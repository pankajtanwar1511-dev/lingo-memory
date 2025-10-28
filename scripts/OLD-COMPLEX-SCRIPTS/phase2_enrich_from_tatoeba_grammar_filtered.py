#!/usr/bin/env python3
"""
Phase 2: Enrich N5 Vocabulary with Tatoeba Examples (Grammar + Vocabulary Filtered)

Enhanced version with BOTH vocabulary-level and grammar-level filtering:
- Only N5 vocabulary (85%+ N5 words)
- Only N5 grammar patterns
- Max 50 characters
- Streams large Tatoeba corpus efficiently
"""

import json
import re
from pathlib import Path
from typing import List, Dict, Set, Tuple
from collections import defaultdict

try:
    import fugashi
    FUGASHI_AVAILABLE = True
except ImportError:
    FUGASHI_AVAILABLE = False
    print("⚠️  fugashi not available. Install: pip install fugashi unidic-lite")
    exit(1)

try:
    import pykakasi
    PYKAKASI_AVAILABLE = True
except ImportError:
    PYKAKASI_AVAILABLE = False
    print("⚠️  pykakasi not available. Install: pip install pykakasi")
    exit(1)


class N5GrammarFilter:
    """Filter sentences to only include N5 grammar patterns"""

    def __init__(self):
        self.tagger = fugashi.Tagger()

        # N5 particles (allowed)
        self.n5_particles = {
            'は', 'が', 'を', 'に', 'で', 'へ', 'と', 'から', 'まで',
            'や', 'も', 'の', 'か', 'ね', 'よ', 'ます'
        }

        # N4+ particles to REJECT
        self.n4_plus_particles = {
            'のに', 'ために', 'ばかり', 'ながら', 'によって', 'として',
            'について', 'に対して', 'において', 'とともに', 'わりに',
            'にとって', 'ほど', 'くらい', 'さえ', 'しか', 'だけ', 'ほか'
        }

        # N4+ verb forms to REJECT (patterns in surface form)
        self.n4_plus_patterns = [
            # Conditionals
            r'たら$', r'ば$', r'なら$',
            # Causative
            r'せる$', r'させる$',
            # Passive
            r'れる$', r'られる$',
            # Potential (overlaps with passive but we'll catch it)
            r'れる$', r'られる$',
            # Volitional
            r'よう$', r'ましょう$',
            # Inference/hearsay
            r'そうだ$', r'らしい$', r'ようだ$', r'みたいだ$',
            # て-form + complex patterns
            r'ておく$', r'てしまう$', r'てみる$', r'てあげる$', r'てもらう$', r'てくれる$',
            r'ていく$', r'てくる$', r'ておく$',
            # Obligation/advice
            r'なければならない', r'なくてはいけない', r'べき$', r'ほうがいい',
            # Permission
            r'てもいい', r'てはいけない',
            # Experience
            r'たことがある',
            # Seeming
            r'そう$'  # looks like (after i-adj/verb stem)
        ]

        # Compile patterns
        self.compiled_patterns = [re.compile(p) for p in self.n4_plus_patterns]

    def check_n5_grammar(self, sentence: str) -> Tuple[bool, str]:
        """
        Check if sentence uses only N5 grammar.
        Returns (is_n5_grammar, rejection_reason)
        """
        # Check for multi-character N4+ particles first
        for particle in self.n4_plus_particles:
            if particle in sentence:
                return False, f"N4+ particle: {particle}"

        # Parse with fugashi
        words = self.tagger(sentence)

        for word in words:
            surface = word.surface
            features = word.feature

            # Get part of speech
            pos = features.pos1 if hasattr(features, 'pos1') else None
            pos2 = features.pos2 if hasattr(features, 'pos2') else None

            # Check for N4+ verb forms
            if pos == '動詞':  # Verb
                # Check surface form against N4+ patterns
                for pattern in self.compiled_patterns:
                    if pattern.search(surface):
                        return False, f"N4+ verb form: {surface}"

                # Check conjugation type
                if pos2:
                    # Potential form markers
                    if 'られる' in surface or ('れる' in surface and len(surface) > 2):
                        # Simple heuristic: if it's not a basic verb ending, likely potential/passive
                        if not surface.endswith(('る', 'ます', 'た', 'て', 'ない')):
                            return False, f"Potential/passive form: {surface}"

            # Check for conditional markers
            if pos == '助詞':  # Particle
                if surface in ['たら', 'ば', 'なら', 'と'] and len(surface) > 1:
                    # 'と' is OK for N5 as quotation/and, but not as conditional
                    # We'll allow single-char particles through
                    if surface != 'と':
                        return False, f"Conditional particle: {surface}"

        return True, ""


class TatoebaStreamEnricher:
    """Stream-based enricher with vocabulary AND grammar filtering"""

    def __init__(self, n5_words: Set[str], max_examples: int = 3,
                 max_length: int = 50, min_n5_ratio: float = 0.85):
        self.n5_words = n5_words
        self.max_examples = max_examples
        self.max_length = max_length
        self.min_n5_ratio = min_n5_ratio

        self.tagger = fugashi.Tagger()
        self.kks = pykakasi.kakasi()
        self.grammar_filter = N5GrammarFilter()

        # Statistics
        self.stats = {
            'total_checked': 0,
            'rejected_length': 0,
            'rejected_vocab': 0,
            'rejected_grammar': 0,
            'accepted': 0
        }

    def check_n5_level(self, sentence: str) -> Tuple[bool, float, str]:
        """
        Check if a sentence is N5 level (vocabulary + grammar).
        Returns (is_n5_level, n5_vocab_ratio, rejection_reason)
        """
        self.stats['total_checked'] += 1

        # Filter 1: Length
        if len(sentence) > self.max_length:
            self.stats['rejected_length'] += 1
            return False, 0.0, f"too long ({len(sentence)} chars)"

        # Filter 2: Grammar check
        is_n5_grammar, grammar_reason = self.grammar_filter.check_n5_grammar(sentence)
        if not is_n5_grammar:
            self.stats['rejected_grammar'] += 1
            return False, 0.0, f"grammar: {grammar_reason}"

        # Filter 3: Vocabulary check
        words = self.tagger(sentence)
        total_words = 0
        n5_words_count = 0

        for word in words:
            surface = word.surface
            features = word.feature

            # Get part of speech
            pos = features.pos1 if hasattr(features, 'pos1') else None

            # Only count content words (nouns, verbs, adjectives, adverbs)
            if pos in ['名詞', '動詞', '形容詞', '副詞', '連体詞']:
                total_words += 1

                # Normalize: get base form if available
                base_form = features.lemma if hasattr(features, 'lemma') else surface

                # Check if word is in N5 list
                if surface in self.n5_words or base_form in self.n5_words:
                    n5_words_count += 1

        # Calculate N5 vocabulary ratio
        if total_words == 0:
            self.stats['rejected_vocab'] += 1
            return False, 0.0, "no content words"

        n5_ratio = n5_words_count / total_words

        if n5_ratio < self.min_n5_ratio:
            self.stats['rejected_vocab'] += 1
            return False, n5_ratio, f"vocab ratio {n5_ratio:.1%} < {self.min_n5_ratio:.0%}"

        # Passed all filters!
        self.stats['accepted'] += 1
        return True, n5_ratio, ""

    def to_hiragana(self, text: str) -> str:
        """Convert Japanese text to hiragana"""
        result = self.kks.convert(text)
        return ''.join([item['hira'] for item in result])

    def stream_enrich(self, vocab_cards: List[dict],
                     sentences_jp: Path, sentences_en: Path,
                     links: Path) -> List[dict]:
        """Stream through Tatoeba corpus and enrich cards"""

        print("\n📚 Loading Tatoeba corpus structure...")

        # Build lookup: sentence_id -> english translation
        print("   Loading English translations...")
        en_translations = {}
        with open(sentences_en, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                if line_num % 100000 == 0:
                    print(f"      {line_num:,} English sentences loaded...")

                parts = line.strip().split('\t')
                if len(parts) >= 3 and parts[1] == 'eng':
                    sentence_id = parts[0]
                    text = parts[2]
                    en_translations[sentence_id] = text

        print(f"   ✅ Loaded {len(en_translations):,} English translations")

        # Build lookup: jp_id -> [en_id1, en_id2, ...]
        print("   Loading sentence links...")
        jp_to_en = defaultdict(list)
        with open(links, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                if line_num % 500000 == 0:
                    print(f"      {line_num:,} links processed...")

                parts = line.strip().split('\t')
                if len(parts) >= 2:
                    jp_id, en_id = parts[0], parts[1]
                    if en_id in en_translations:
                        jp_to_en[jp_id].append(en_id)

        print(f"   ✅ Loaded {len(jp_to_en):,} Japanese->English links")

        # Build lookup: vocab_word -> card
        vocab_lookup = {}
        for card in vocab_cards:
            kanji = card.get('kanji', '').strip()
            kana = card.get('kana', '').strip()

            if kanji:
                vocab_lookup[kanji] = card
            vocab_lookup[kana] = card

        # Enrich cards by streaming Japanese sentences
        print(f"\n🔍 Streaming Japanese sentences...")
        print(f"   Filters: max {self.max_length} chars, {self.min_n5_ratio:.0%}+ N5 vocab, N5 grammar only")
        print(f"   (Strict filtering for beginner-friendly sentences)")

        cards_with_examples = 0

        with open(sentences_jp, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                if line_num % 100000 == 0:
                    print(f"      {line_num:,} sentences | {self.stats['accepted']:,} accepted | "
                          f"{self.stats['rejected_grammar']:,} grammar | "
                          f"{self.stats['rejected_vocab']:,} vocab | "
                          f"{self.stats['rejected_length']:,} length")

                parts = line.strip().split('\t')
                if len(parts) < 3 or parts[1] != 'jpn':
                    continue

                jp_id = parts[0]
                jp_text = parts[2]

                # Check if N5 level (vocabulary + grammar)
                is_n5, n5_ratio, rejection_reason = self.check_n5_level(jp_text)

                if not is_n5:
                    continue  # Skip non-N5 sentences

                # Get English translations
                en_ids = jp_to_en.get(jp_id, [])
                if not en_ids:
                    continue

                # Use first English translation
                en_text = en_translations.get(en_ids[0], '')
                if not en_text:
                    continue

                # Generate kana reading
                kana_reading = self.to_hiragana(jp_text)

                # Parse sentence to find actual words (not substrings)
                words_in_sentence = self.tagger(jp_text)
                word_forms = set()

                for word in words_in_sentence:
                    surface = word.surface
                    lemma = word.feature.lemma if hasattr(word.feature, 'lemma') else surface
                    word_forms.add(surface)
                    word_forms.add(lemma)

                # Find matching vocabulary cards (must match actual word, not substring)
                for vocab_word, card in vocab_lookup.items():
                    if vocab_word not in word_forms:
                        continue

                    # Check if card needs more examples
                    if len(card.get('examples', [])) < self.max_examples:
                        # Add example
                        if 'examples' not in card:
                            card['examples'] = []

                        example = {
                            'japanese': jp_text,
                            'kana': kana_reading,
                            'english': en_text,
                            'source': {
                                'type': 'tatoeba',
                                'id': jp_id,
                                'license': 'CC BY 2.0 FR'
                            },
                            'n5_vocab_ratio': round(n5_ratio, 3),
                            'n5_grammar': True
                        }

                        card['examples'].append(example)

                        # Track progress
                        if len(card['examples']) == 1:
                            cards_with_examples += 1
                            if cards_with_examples % 50 == 0:
                                print(f"      📝 {cards_with_examples} cards enriched...")

        print(f"\n   ✅ Enrichment complete!")
        print(f"\n   Statistics:")
        print(f"      Total sentences checked: {self.stats['total_checked']:,}")
        print(f"      Rejected (length): {self.stats['rejected_length']:,}")
        print(f"      Rejected (vocabulary): {self.stats['rejected_vocab']:,}")
        print(f"      Rejected (grammar): {self.stats['rejected_grammar']:,}")
        print(f"      Accepted: {self.stats['accepted']:,}")
        print(f"      Cards with examples: {cards_with_examples}")

        return vocab_cards


def main():
    print("=" * 70)
    print("Phase 2: Enrich with Tatoeba Examples (Grammar + Vocabulary Filtered)")
    print("=" * 70)

    # Paths
    input_file = Path('data/n5-phase1/n5-master-list.json')
    output_file = Path('data/n5-phase2/n5_with_examples_grammar_filtered.json')

    tatoeba_dir = Path('data/tatoeba')
    sentences_jp = tatoeba_dir / 'jpn_sentences.tsv'
    sentences_en = tatoeba_dir / 'eng_sentences.tsv'
    links = tatoeba_dir / 'jpn-eng_links.tsv'

    # Validate paths
    if not input_file.exists():
        print(f"❌ Input file not found: {input_file}")
        return

    if not all([sentences_jp.exists(), links.exists()]):
        print(f"❌ Tatoeba corpus not found in {tatoeba_dir}")
        print("   Download from: https://tatoeba.org/en/downloads")
        return

    # Load N5 vocabulary
    print(f"\n📖 Loading N5 vocabulary from {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data.get('vocabulary', [])
    print(f"   ✅ Loaded {len(cards)} N5 vocabulary cards")

    # Build N5 word set
    n5_words = set()
    for card in cards:
        kanji = card.get('kanji', '').strip()
        kana = card.get('kana', '').strip()

        if kanji:
            n5_words.add(kanji)
        if kana:
            n5_words.add(kana)

    print(f"   ✅ Built N5 word set: {len(n5_words)} unique words")

    # Initialize enricher with grammar + vocabulary filtering
    enricher = TatoebaStreamEnricher(
        n5_words=n5_words,
        max_examples=3,
        max_length=35,
        min_n5_ratio=0.95
    )

    # Enrich cards
    enriched_cards = enricher.stream_enrich(
        vocab_cards=cards,
        sentences_jp=sentences_jp,
        sentences_en=sentences_en,
        links=links
    )

    # Count coverage
    cards_with_examples = sum(1 for card in enriched_cards if card.get('examples'))
    total_examples = sum(len(card.get('examples', [])) for card in enriched_cards)
    coverage = (cards_with_examples / len(enriched_cards) * 100) if enriched_cards else 0

    print(f"\n📊 Final Coverage:")
    print(f"   Cards with examples: {cards_with_examples}/{len(enriched_cards)} ({coverage:.1f}%)")
    print(f"   Total examples added: {total_examples}")

    # Save enriched data
    output_file.parent.mkdir(parents=True, exist_ok=True)

    output_data = {
        'metadata': data.get('metadata', {}),
        'vocabulary': enriched_cards
    }

    print(f"\n💾 Saving enriched data to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print("\n✅ Phase 2 complete!")
    print("=" * 70)


if __name__ == '__main__':
    main()
