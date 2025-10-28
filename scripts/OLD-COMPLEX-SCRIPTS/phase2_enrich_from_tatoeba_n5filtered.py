#!/usr/bin/env python3
"""
Phase 2: Enrich N5 Master List with Tatoeba Examples (N5-Level Filtered)

Enhanced version with vocabulary-level filtering to ensure examples use
only N5-level words.

Features:
- Streams Tatoeba corpus (jpn_sentences.tsv, links.csv, translations.tsv)
- Matches sentences containing target word (kanji OR kana)
- **NEW**: Filters by N5 vocabulary level (85%+ of words must be N5)
- Filters by length (≤50 chars by default)
- Max 2 examples per word
- Includes full license metadata per example
- Marks words with no matches for Phase 3 generation

Input: data/n5-phase1/n5-master-list.json
Output: data/n5-phase2/n5_with_examples_auto.json

Usage:
    python3 scripts/phase2_enrich_from_tatoeba_n5filtered.py \
        --input data/n5-phase1/n5-master-list.json \
        --corpus data/tatoeba \
        --output data/n5-phase2/n5_with_examples_n5filtered.json \
        --max-examples 2 \
        --max-length 50 \
        --min-n5-ratio 0.85
"""

import json
import csv
import sys
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional, Set
from collections import defaultdict
import time

# Morphological analysis for vocabulary checking
try:
    import fugashi
    FUGASHI_AVAILABLE = True
except ImportError:
    FUGASHI_AVAILABLE = False
    print("⚠️  fugashi not available. Install: pip install fugashi unidic-lite")
    sys.exit(1)

# Optional: pykakasi for kana conversion
try:
    import pykakasi
    PYKAKASI_AVAILABLE = True
except ImportError:
    PYKAKASI_AVAILABLE = False
    print("⚠️  pykakasi not available. Kana extraction will be skipped for some examples.")


class N5FilteredTatoebaEnricher:
    """Enrich N5 vocabulary with N5-level Tatoeba examples using streaming"""

    def __init__(
        self,
        corpus_dir: str,
        max_examples: int = 2,
        max_length: int = 50,
        min_n5_ratio: float = 0.85
    ):
        self.corpus_dir = Path(corpus_dir)
        self.max_examples = max_examples
        self.max_length = max_length
        self.min_n5_ratio = min_n5_ratio

        # Tatoeba file paths
        self.jpn_sentences_file = self.corpus_dir / "jpn_sentences.tsv"
        self.links_file = self.corpus_dir / "links.csv"
        self.translations_file = self.corpus_dir / "eng_translations.tsv"

        # In-memory structures (populated during streaming)
        self.sentence_id_to_eng: Dict[int, str] = {}  # jpn_id -> english translation
        self.jpn_id_to_eng_id: Dict[int, int] = {}    # jpn_id -> eng_id (for tracking)

        # N5 vocabulary lookup
        self.n5_words: Set[str] = set()  # All N5 words (kanji and kana)

        # Statistics
        self.stats = defaultdict(int)

        # Initialize morphological analyzer
        if FUGASHI_AVAILABLE:
            try:
                self.tagger = fugashi.Tagger()
                print("✅ Morphological analyzer initialized (fugashi)")
            except:
                print("⚠️  fugashi initialization failed")
                self.tagger = None
        else:
            self.tagger = None

        # Initialize kana converter
        if PYKAKASI_AVAILABLE:
            self.kks = pykakasi.kakasi()
        else:
            self.kks = None

    def build_n5_vocabulary_set(self, cards: List[Dict[str, Any]]) -> None:
        """Build a set of all N5 words (kanji and kana) for filtering"""
        print("\n📚 Building N5 vocabulary lookup...")

        for card in cards:
            kanji = card.get('kanji', '').strip()
            kana = card.get('kana', '').strip()

            if kanji:
                # Add full word
                self.n5_words.add(kanji)

                # Also add individual kanji characters for compound matching
                for char in kanji:
                    if char not in ['/', '・', '〜', '～']:
                        self.n5_words.add(char)

            if kana:
                self.n5_words.add(kana)

        # Add common particles and grammar words (always N5)
        common_particles = [
            'は', 'が', 'を', 'に', 'へ', 'と', 'で', 'から', 'まで', 'より',
            'の', 'も', 'か', 'ね', 'よ', 'な', 'や', 'ます', 'です', 'だ',
            'ある', 'いる', 'する', 'なる', 'いく', 'くる', 'みる', 'きく',
            'ない', 'た', 'て', 'ている', 'ました', 'でした', 'ません',
            'これ', 'それ', 'あれ', 'この', 'その', 'あの', 'ここ', 'そこ', 'あそこ',
            'だれ', 'なに', 'どこ', 'いつ', 'どう', 'なぜ', 'どれ', 'どの',
            'ん', 'の', 'か', 'ね', 'よ', 'わ', 'さ', 'ぞ', 'ぜ'
        ]

        for particle in common_particles:
            self.n5_words.add(particle)

        print(f"   ✅ Built N5 vocabulary set: {len(self.n5_words):,} unique words/particles")

    def check_n5_level(self, sentence: str) -> tuple[bool, float]:
        """
        Check if a sentence uses mostly N5-level vocabulary.

        Returns:
            (is_n5_level: bool, n5_ratio: float)
        """
        if not self.tagger:
            return True, 1.0  # Skip check if no tagger

        # Parse sentence into words
        words = self.tagger(sentence)

        total_words = 0
        n5_words_count = 0

        for word in words:
            # Get surface form and base form
            surface = word.surface
            features = word.feature

            # Skip punctuation and symbols
            if not surface or surface in ['。', '、', '！', '？', '「', '」', '…', '・']:
                continue

            total_words += 1

            # Check if word is in N5 vocabulary (surface or base form)
            if surface in self.n5_words:
                n5_words_count += 1
                continue

            # Try to get base form (dictionary form)
            try:
                # Features: pos, pos_detail1, pos_detail2, pos_detail3, conjugation_type, conjugation_form, base_form, reading, pronunciation
                base_form = features.kana if hasattr(features, 'kana') else None

                if base_form and base_form in self.n5_words:
                    n5_words_count += 1
                    continue
            except:
                pass

            # Check if any character is in N5 (for kanji compounds)
            if any(char in self.n5_words for char in surface):
                n5_words_count += 0.5  # Partial credit for compounds

        if total_words == 0:
            return False, 0.0

        n5_ratio = n5_words_count / total_words
        is_n5_level = n5_ratio >= self.min_n5_ratio

        self.stats['sentences_checked_n5'] += 1
        if is_n5_level:
            self.stats['sentences_passed_n5'] += 1

        return is_n5_level, n5_ratio

    def load_translations_streaming(self) -> None:
        """Stream English translations and build jpn_id -> english map"""
        print("\n📥 Step 1/5: Loading English translations (streaming)...")

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
        """Stream sentence links and build jpn_id -> eng_id map"""
        print("\n📥 Step 2/5: Loading sentence links (streaming)...")

        if not self.links_file.exists():
            print(f"   ⚠️  File not found: {self.links_file}")
            return

        with open(self.links_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter='\t')
            for row in reader:
                if len(row) < 2:
                    continue

                try:
                    jpn_id = int(row[0])
                    eng_id = int(row[1])

                    # Only store if we have the English translation
                    if eng_id in self.sentence_id_to_eng:
                        self.jpn_id_to_eng_id[jpn_id] = eng_id
                        self.stats['links_loaded'] += 1

                        if self.stats['links_loaded'] % 100000 == 0:
                            print(f"   Loaded {self.stats['links_loaded']:,} links...")
                except (ValueError, IndexError):
                    continue

        print(f"   ✅ Loaded {self.stats['links_loaded']:,} Japanese->English links")

    def convert_to_kana(self, text: str) -> str:
        """Convert mixed kanji/kana text to all hiragana"""
        if not self.kks:
            return text

        try:
            result = self.kks.convert(text)
            kana = ''.join([item['hira'] for item in result])
            return kana
        except:
            return text

    def word_matches_sentence(self, word_kanji: str, word_kana: str, sentence: str) -> bool:
        """Check if word (kanji OR kana) appears in sentence"""
        if word_kanji and word_kanji in sentence:
            return True
        if word_kana and word_kana in sentence:
            return True
        return False

    def enrich_from_streaming(self, cards: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Stream Japanese sentences and match to vocabulary words with N5 filtering"""
        print("\n📥 Step 3/5: Streaming Japanese sentences and matching (N5-filtered)...")

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
        print(f"   N5 vocabulary filtering: {self.min_n5_ratio * 100:.0f}%+ words must be N5 level")

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

                            # **NEW**: Check N5 vocabulary level
                            is_n5, n5_ratio = self.check_n5_level(jpn_text)
                            if not is_n5:
                                self.stats['sentences_rejected_vocab'] += 1
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
                                "kana": kana_text,
                                "english": eng_text,
                                "source": {
                                    "type": "tatoeba",
                                    "id": jpn_id
                                },
                                "license": {
                                    "text": "CC BY 2.0 FR",
                                    "url": "https://creativecommons.org/licenses/by/2.0/fr/"
                                },
                                "metadata": {
                                    "n5_vocab_ratio": round(n5_ratio, 2),
                                    "length": len(jpn_text)
                                }
                            }

                            card_examples[card_idx].append(example)
                            matches_found += 1

                    # Progress update
                    if sentences_checked % 10000 == 0:
                        print(f"   Checked {sentences_checked:,} sentences, found {matches_found:,} N5-level matches...")

                except (ValueError, IndexError) as e:
                    continue

        print(f"   ✅ Checked {sentences_checked:,} sentences")
        print(f"   ✅ Found {matches_found:,} N5-level example matches")
        print(f"   ✅ Rejected {self.stats.get('sentences_rejected_vocab', 0):,} sentences (too complex)")

        # Merge examples into cards
        cards_with_examples = 0
        total_examples = 0

        for card_idx, examples in card_examples.items():
            cards[card_idx]['examples'] = examples
            if examples:
                cards_with_examples += 1
                total_examples += len(examples)

        print(f"   ✅ {cards_with_examples}/{len(cards)} cards now have examples ({total_examples} total)")

        return cards

    def add_metadata_and_license(self, cards: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Wrap cards with metadata and ensure license fields"""
        print("\n📝 Step 4/5: Adding metadata and license fields...")

        # Add top-level license to each card
        cards_fixed = 0
        for card in cards:
            if 'license' not in card:
                card['license'] = {
                    "text": "CC BY-SA 4.0",
                    "url": "https://creativecommons.org/licenses/by-sa/4.0/"
                }
                cards_fixed += 1

        print(f"   ✅ Added license field to {cards_fixed} cards")

        # Count coverage
        cards_with_examples = sum(1 for card in cards if card.get('examples'))
        cards_without_examples = len(cards) - cards_with_examples
        total_examples = sum(len(card.get('examples', [])) for card in cards)

        # Create metadata
        metadata = {
            "phase": "Phase 2: Tatoeba Enrichment (N5-Filtered)",
            "createdAt": time.strftime("%Y-%m-%d"),
            "description": "N5 vocabulary enriched with N5-level Tatoeba examples (vocabulary-filtered)",
            "license": "CC BY-SA 4.0 (vocab) + CC BY 2.0 FR (examples)",
            "totalCards": len(cards),
            "coverage": {
                "cardsWithExamples": cards_with_examples,
                "cardsWithoutExamples": cards_without_examples,
                "totalExamples": total_examples,
                "coveragePercent": round((cards_with_examples / len(cards)) * 100, 1)
            },
            "enrichmentSettings": {
                "maxExamplesPerWord": self.max_examples,
                "maxSentenceLength": self.max_length,
                "minN5VocabRatio": self.min_n5_ratio,
                "source": "Tatoeba Project",
                "filtering": "N5 vocabulary level"
            }
        }

        return {
            "version": "1.0.0-phase2-n5filtered",
            "metadata": metadata,
            "vocabulary": cards
        }

    def run(self, input_file: str, output_file: str) -> None:
        """Run the complete enrichment pipeline"""
        print("=" * 60)
        print("Phase 2: Tatoeba Enrichment (N5 Vocabulary Filtered)")
        print("=" * 60)

        # Load input
        print(f"\n📖 Loading input: {input_file}")
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        cards = data.get('vocabulary', [])
        print(f"   ✅ Loaded {len(cards)} N5 vocabulary cards")

        # Build N5 vocabulary set for filtering
        self.build_n5_vocabulary_set(cards)

        # Stream and process
        self.load_translations_streaming()
        self.load_links_streaming()
        enriched_cards = self.enrich_from_streaming(cards)

        # Add metadata and wrap
        output_data = self.add_metadata_and_license(enriched_cards)

        # Write output
        print(f"\n💾 Step 5/5: Writing output to {output_file}...")
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)

        print(f"   ✅ Saved to {output_file}")

        # Print summary
        print("\n" + "=" * 60)
        print("📊 PHASE 2 SUMMARY (N5-Filtered)")
        print("=" * 60)
        metadata = output_data['metadata']
        print(f"Total cards:           {metadata['totalCards']}")
        print(f"Cards with examples:   {metadata['coverage']['cardsWithExamples']}")
        print(f"Cards without examples: {metadata['coverage']['cardsWithoutExamples']}")
        print(f"Total examples:        {metadata['coverage']['totalExamples']}")
        print(f"Coverage:              {metadata['coverage']['coveragePercent']}%")
        print(f"\nFiltering settings:")
        print(f"  Max sentence length: {self.max_length} characters")
        print(f"  Min N5 vocab ratio:  {self.min_n5_ratio * 100:.0f}%")
        print(f"\nVocabulary filtering stats:")
        print(f"  Sentences checked:   {self.stats.get('sentences_checked_n5', 0):,}")
        print(f"  Passed N5 filter:    {self.stats.get('sentences_passed_n5', 0):,}")
        print(f"  Rejected (complex):  {self.stats.get('sentences_rejected_vocab', 0):,}")
        print("=" * 60)


def main():
    parser = argparse.ArgumentParser(
        description='Phase 2: Enrich N5 vocabulary with N5-level Tatoeba examples (vocabulary-filtered)'
    )
    parser.add_argument(
        '--input',
        required=True,
        help='Input JSON file (Phase 1 output: n5-master-list.json)'
    )
    parser.add_argument(
        '--corpus',
        required=True,
        help='Path to Tatoeba corpus directory (contains jpn_sentences.tsv, etc.)'
    )
    parser.add_argument(
        '--output',
        required=True,
        help='Output JSON file (e.g., n5_with_examples_n5filtered.json)'
    )
    parser.add_argument(
        '--max-examples',
        type=int,
        default=2,
        help='Maximum examples per word (default: 2)'
    )
    parser.add_argument(
        '--max-length',
        type=int,
        default=50,
        help='Maximum sentence length in characters (default: 50)'
    )
    parser.add_argument(
        '--min-n5-ratio',
        type=float,
        default=0.85,
        help='Minimum N5 vocabulary ratio (0.0-1.0, default: 0.85 = 85%%)'
    )

    args = parser.parse_args()

    # Validate inputs
    if not Path(args.input).exists():
        print(f"❌ Error: Input file not found: {args.input}")
        sys.exit(1)

    if not Path(args.corpus).exists():
        print(f"❌ Error: Corpus directory not found: {args.corpus}")
        sys.exit(1)

    # Run enrichment
    enricher = N5FilteredTatoebaEnricher(
        corpus_dir=args.corpus,
        max_examples=args.max_examples,
        max_length=args.max_length,
        min_n5_ratio=args.min_n5_ratio
    )

    enricher.run(args.input, args.output)


if __name__ == '__main__':
    main()
