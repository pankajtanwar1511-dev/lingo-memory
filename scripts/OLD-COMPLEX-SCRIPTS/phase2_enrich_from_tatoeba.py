#!/usr/bin/env python3
"""
Phase 2: Enrich N5 Master List with Tatoeba Examples (Streaming)

Takes the canonical N5 master list from Phase 1 and enriches each word with
example sentences from the Tatoeba Project corpus. Uses memory-efficient
streaming to process the 531MB corpus.

Features:
- Streams Tatoeba corpus (jpn_sentences.tsv, links.csv, translations.tsv)
- Matches sentences containing target word (kanji OR kana)
- Filters by length (≤40 chars for N5)
- Max 2 examples per word
- Includes full license metadata per example
- Marks words with no matches for Phase 3 generation

Input: data/n5-phase1/n5-master-list.json
Output: data/n5-phase2/n5_with_examples_auto.json

Usage:
    python3 scripts/phase2_enrich_from_tatoeba.py \
        --input data/n5-phase1/n5-master-list.json \
        --corpus data/tatoeba \
        --output data/n5-phase2/n5_with_examples_auto.json \
        --max-examples 2 \
        --max-length 40
"""

import json
import csv
import sys
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional
from collections import defaultdict
import time

# Optional: pykakasi for kana conversion
try:
    import pykakasi
    PYKAKASI_AVAILABLE = True
except ImportError:
    PYKAKASI_AVAILABLE = False
    print("⚠️  pykakasi not available. Kana extraction will be skipped for some examples.")


class TatoebaEnricher:
    """Enrich N5 vocabulary with Tatoeba example sentences using streaming"""

    def __init__(self, corpus_dir: str, max_examples: int = 2, max_length: int = 40):
        self.corpus_dir = Path(corpus_dir)
        self.max_examples = max_examples
        self.max_length = max_length

        # Tatoeba file paths
        self.jpn_sentences_file = self.corpus_dir / "jpn_sentences.tsv"
        self.links_file = self.corpus_dir / "links.csv"
        self.translations_file = self.corpus_dir / "eng_translations.tsv"

        # In-memory structures (populated during streaming)
        self.sentence_id_to_eng: Dict[int, str] = {}  # jpn_id -> english translation
        self.jpn_id_to_eng_id: Dict[int, int] = {}    # jpn_id -> eng_id (for tracking)

        # Statistics
        self.stats = defaultdict(int)

        # Initialize kana converter
        if PYKAKASI_AVAILABLE:
            self.kks = pykakasi.kakasi()
        else:
            self.kks = None

    def load_translations_streaming(self) -> None:
        """Stream English translations and build jpn_id -> english map"""
        print("\n📥 Step 1/4: Loading English translations (streaming)...")

        if not self.translations_file.exists():
            print(f"   ⚠️  File not found: {self.translations_file}")
            return

        with open(self.translations_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter='\t')
            for row in reader:
                if len(row) < 3:
                    continue

                try:
                    eng_id = int(row[0])
                    eng_text = row[2].strip()
                    self.sentence_id_to_eng[eng_id] = eng_text
                    self.stats['translations_loaded'] += 1

                    if self.stats['translations_loaded'] % 100000 == 0:
                        print(f"   Loaded {self.stats['translations_loaded']:,} translations...")
                except (ValueError, IndexError):
                    continue

        print(f"   ✅ Loaded {self.stats['translations_loaded']:,} English translations")

    def load_links_streaming(self) -> None:
        """Stream links to map jpn_id -> eng_id"""
        print("\n📥 Step 2/4: Loading sentence links (streaming)...")

        if not self.links_file.exists():
            print(f"   ⚠️  File not found: {self.links_file}")
            return

        with open(self.links_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter='\t')
            for row in reader:
                if len(row) < 2:
                    continue

                try:
                    sent_id = int(row[0])
                    trans_id = int(row[1])

                    # Only keep links where translation exists
                    if trans_id in self.sentence_id_to_eng:
                        # Map jpn_id -> eng_id, then later jpn_id -> eng_text
                        if sent_id not in self.jpn_id_to_eng_id:
                            self.jpn_id_to_eng_id[sent_id] = trans_id
                            self.stats['links_loaded'] += 1

                    if self.stats['links_loaded'] % 100000 == 0:
                        print(f"   Loaded {self.stats['links_loaded']:,} links...")
                except (ValueError, IndexError):
                    continue

        print(f"   ✅ Loaded {self.stats['links_loaded']:,} jpn->eng links")

    def convert_to_kana(self, japanese: str) -> str:
        """Convert Japanese text to kana (hiragana)"""
        if self.kks:
            result = self.kks.convert(japanese)
            return "".join([item['hira'] for item in result])
        else:
            # Fallback: return empty (will be filled manually or skipped)
            return ""

    def word_matches_sentence(self, word_kanji: str, word_kana: str, sentence: str) -> bool:
        """Check if word appears in sentence (kanji OR kana match)"""
        # Match kanji if present
        if word_kanji and word_kanji in sentence:
            return True

        # Match kana
        if word_kana and word_kana in sentence:
            return True

        return False

    def enrich_from_streaming(self, cards: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Stream Japanese sentences and match to vocabulary words"""
        print("\n📥 Step 3/4: Streaming Japanese sentences and matching...")

        if not self.jpn_sentences_file.exists():
            print(f"   ⚠️  File not found: {self.jpn_sentences_file}")
            return cards

        # Build word lookup by kanji and kana
        word_lookup: Dict[str, List[int]] = defaultdict(list)  # key -> [card_indices]

        for idx, card in enumerate(cards):
            kanji = card.get('kanji', '')
            kana = card.get('kana', '')

            if kanji:
                word_lookup[kanji].append(idx)
            if kana:
                word_lookup[kana].append(idx)

        print(f"   Built lookup table for {len(cards)} words")

        # Track examples per card
        card_examples: Dict[int, List[Dict[str, Any]]] = defaultdict(list)

        # Stream Japanese sentences
        sentences_checked = 0
        matches_found = 0

        with open(self.jpn_sentences_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter='\t')
            for row in reader:
                if len(row) < 3:
                    continue

                try:
                    jpn_id = int(row[0])
                    jpn_text = row[2].strip()

                    # Filter by length first (optimization)
                    if len(jpn_text) > self.max_length:
                        continue

                    sentences_checked += 1

                    # Check if sentence matches any word
                    for search_text, card_indices in word_lookup.items():
                        if search_text not in jpn_text:
                            continue

                        # Found a match! Check each card
                        for card_idx in card_indices:
                            # Skip if already have max examples
                            if len(card_examples[card_idx]) >= self.max_examples:
                                continue

                            card = cards[card_idx]
                            word_kanji = card.get('kanji', '')
                            word_kana = card.get('kana', '')

                            # Verify match (kanji OR kana)
                            if not self.word_matches_sentence(word_kanji, word_kana, jpn_text):
                                continue

                            # Get English translation
                            eng_id = self.jpn_id_to_eng_id.get(jpn_id)
                            if not eng_id:
                                continue

                            eng_text = self.sentence_id_to_eng.get(eng_id)
                            if not eng_text:
                                continue

                            # Convert to kana (hiragana)
                            kana_text = self.convert_to_kana(jpn_text)

                            # Create example object
                            example = {
                                "japanese": jpn_text,
                                "kana": kana_text if kana_text else jpn_text,  # Fallback to original
                                "english": eng_text,
                                "source": {
                                    "type": "tatoeba",
                                    "id": jpn_id
                                },
                                "license": {
                                    "text": "CC BY 2.0 FR",
                                    "url": "https://creativecommons.org/licenses/by/2.0/fr/"
                                }
                            }

                            card_examples[card_idx].append(example)
                            matches_found += 1

                    # Progress update
                    if sentences_checked % 50000 == 0:
                        print(f"   Checked {sentences_checked:,} sentences, found {matches_found:,} matches...")

                except (ValueError, IndexError):
                    continue

        print(f"   ✅ Checked {sentences_checked:,} sentences, found {matches_found:,} matches")

        # Attach examples to cards
        enriched_cards = []
        cards_with_examples = 0
        cards_without_examples = 0

        for idx, card in enumerate(cards):
            enriched_card = card.copy()

            examples = card_examples.get(idx, [])
            if examples:
                enriched_card['examples'] = examples
                cards_with_examples += 1
            else:
                enriched_card['examples'] = []
                enriched_card['needsGeneration'] = True  # Mark for Phase 3
                cards_without_examples += 1

            enriched_cards.append(enriched_card)

        self.stats['cards_with_examples'] = cards_with_examples
        self.stats['cards_without_examples'] = cards_without_examples
        self.stats['total_examples_added'] = matches_found

        return enriched_cards

    def print_stats(self) -> None:
        """Print enrichment statistics"""
        print("\n" + "=" * 60)
        print("📊 ENRICHMENT STATISTICS")
        print("=" * 60)
        print(f"Translations loaded:      {self.stats['translations_loaded']:,}")
        print(f"Links loaded:             {self.stats['links_loaded']:,}")
        print(f"Cards with examples:      {self.stats['cards_with_examples']}")
        print(f"Cards without examples:   {self.stats['cards_without_examples']}")
        print(f"Total examples added:     {self.stats['total_examples_added']}")
        coverage = (self.stats['cards_with_examples'] /
                   (self.stats['cards_with_examples'] + self.stats['cards_without_examples']) * 100
                   if (self.stats['cards_with_examples'] + self.stats['cards_without_examples']) > 0 else 0)
        print(f"Example coverage:         {coverage:.1f}%")
        print("=" * 60)


def main():
    parser = argparse.ArgumentParser(description="Phase 2: Enrich N5 with Tatoeba examples")
    parser.add_argument("--input", required=True, help="Input N5 master list JSON (from Phase 1)")
    parser.add_argument("--corpus", required=True, help="Tatoeba corpus directory")
    parser.add_argument("--output", default="data/n5-phase2/n5_with_examples_auto.json",
                       help="Output enriched JSON file")
    parser.add_argument("--max-examples", type=int, default=2, help="Max examples per word (default: 2)")
    parser.add_argument("--max-length", type=int, default=40, help="Max sentence length in chars (default: 40)")

    args = parser.parse_args()

    print("🚀 Phase 2: Enriching N5 Master List with Tatoeba Examples")
    print("=" * 60)
    print(f"Input:          {args.input}")
    print(f"Corpus:         {args.corpus}")
    print(f"Output:         {args.output}")
    print(f"Max examples:   {args.max_examples}")
    print(f"Max length:     {args.max_length} chars")
    print()

    start_time = time.time()

    # Load master list
    print("📥 Loading N5 master list...")
    with open(args.input, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data.get('vocabulary', [])
    print(f"   Loaded {len(cards)} N5 words")

    # Initialize enricher
    enricher = TatoebaEnricher(
        corpus_dir=args.corpus,
        max_examples=args.max_examples,
        max_length=args.max_length
    )

    # Step 1: Load translations
    enricher.load_translations_streaming()

    # Step 2: Load links
    enricher.load_links_streaming()

    # Step 3: Enrich cards with examples
    enriched_cards = enricher.enrich_from_streaming(cards)

    # Step 4: Save output
    print("\n📥 Step 4/4: Saving enriched dataset...")

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    output_data = {
        'version': '1.0.0-phase2',
        'metadata': {
            'phase': 'Phase 2: Tatoeba Enrichment',
            'createdAt': '2025-01-01',
            'description': 'N5 vocabulary enriched with Tatoeba examples (auto-matched)',
            'license': 'CC BY-SA 4.0 (vocab) + CC BY 2.0 FR (examples)',
            'totalCards': len(enriched_cards),
            'coverage': {
                'cardsWithExamples': enricher.stats['cards_with_examples'],
                'cardsWithoutExamples': enricher.stats['cards_without_examples'],
                'totalExamples': enricher.stats['total_examples_added']
            },
            'enrichmentSettings': {
                'maxExamplesPerWord': args.max_examples,
                'maxSentenceLength': args.max_length,
                'source': 'Tatoeba Project'
            }
        },
        'vocabulary': enriched_cards
    }

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"   ✅ Saved: {output_path}")

    # Print statistics
    enricher.print_stats()

    elapsed = time.time() - start_time
    print(f"\n⏱️  Total time: {elapsed:.1f}s")

    print("\n✅ Phase 2 Complete!")
    print(f"   Enriched dataset: {args.output}")
    print(f"   Words needing generation: {enricher.stats['cards_without_examples']}")
    print()
    print("📝 Next step: Run Phase 3 (LLM generation for missing examples)")
    print(f"   python3 scripts/phase3_generate_missing.py \\")
    print(f"     --input {args.output} \\")
    print(f"     --output data/n5-phase3/n5_with_generated.json")


if __name__ == "__main__":
    main()
