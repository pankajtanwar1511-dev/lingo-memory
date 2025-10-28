#!/usr/bin/env python3
"""
Phase 2: Multi-Source Enrichment with Grammar + Vocabulary Filtering

Combines JMdict + Tatoeba (includes Tanaka) with:
- Quality scoring (JMdict > Tatoeba)
- Deduplication
- All 12 filters applied
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
    print("⚠️  fugashi not available")
    exit(1)

try:
    import pykakasi
    PYKAKASI_AVAILABLE = True
except ImportError:
    PYKAKASI_AVAILABLE = False
    print("⚠️  pykakasi not available")
    exit(1)


# Import classes from existing script
import sys
sys.path.insert(0, str(Path(__file__).parent))

# Copy the N5GrammarFilter class from original script
class N5GrammarFilter:
    """Filter sentences to only include N5 grammar patterns"""

    def __init__(self):
        self.tagger = fugashi.Tagger()
        self.n5_particles = {
            'は', 'が', 'を', 'に', 'で', 'へ', 'と', 'から', 'まで',
            'や', 'も', 'の', 'か', 'ね', 'よ', 'ます'
        }
        self.n4_plus_particles = {
            'のに', 'ために', 'ばかり', 'ながら', 'によって', 'として',
            'について', 'に対して', 'において', 'とともに', 'わりに',
            'にとって', 'ほど', 'くらい', 'さえ', 'しか', 'だけ', 'ほか'
        }
        self.n4_plus_patterns = [
            r'たら$', r'ば$', r'なら$', r'せる$', r'させる$',
            r'れる$', r'られる$', r'よう$', r'ましょう$',
            r'そうだ$', r'らしい$', r'ようだ$', r'みたいだ$',
            r'ておく$', r'てしまう$', r'てみる$', r'てあげる$', r'てもらう$', r'てくれる$',
            r'ていく$', r'てくる$', r'なければならない', r'なくてはいけない',
            r'べき$', r'ほうがいい', r'てもいい', r'てはいけない', r'たことがある', r'そう$'
        ]
        self.compiled_patterns = [re.compile(p) for p in self.n4_plus_patterns]

    def check_n5_grammar(self, sentence: str) -> Tuple[bool, str]:
        for particle in self.n4_plus_particles:
            if particle in sentence:
                return False, f"N4+ particle: {particle}"
        words = self.tagger(sentence)
        for word in words:
            surface = word.surface
            features = word.feature
            pos = features.pos1 if hasattr(features, 'pos1') else None
            pos2 = features.pos2 if hasattr(features, 'pos2') else None
            if pos == '動詞':
                for pattern in self.compiled_patterns:
                    if pattern.search(surface):
                        return False, f"N4+ verb form: {surface}"
                if pos2:
                    if 'られる' in surface or ('れる' in surface and len(surface) > 2):
                        if not surface.endswith(('る', 'ます', 'た', 'て', 'ない')):
                            return False, f"Potential/passive form: {surface}"
            if pos == '助詞':
                if surface in ['たら', 'ば', 'なら', 'と'] and len(surface) > 1:
                    if surface != 'と':
                        return False, f"Conditional particle: {surface}"
        return True, ""


class MultiSourceEnricher:
    """Multi-source enricher with deduplication and quality scoring"""

    def __init__(self, n5_words: Set[str], max_examples: int = 3,
                 max_length: int = 35, min_n5_ratio: float = 0.95):
        self.n5_words = n5_words
        self.max_examples = max_examples
        self.max_length = max_length
        self.min_n5_ratio = min_n5_ratio
        self.tagger = fugashi.Tagger()
        self.kks = pykakasi.kakasi()
        self.grammar_filter = N5GrammarFilter()
        self.stats = defaultdict(int)
        
        # Track seen sentences for deduplication
        self.seen_sentences = set()

    def check_n5_level(self, sentence: str) -> Tuple[bool, float, str]:
        self.stats['total_checked'] += 1
        if len(sentence) > self.max_length:
            self.stats['rejected_length'] += 1
            return False, 0.0, f"too long ({len(sentence)} chars)"
        is_n5_grammar, grammar_reason = self.grammar_filter.check_n5_grammar(sentence)
        if not is_n5_grammar:
            self.stats['rejected_grammar'] += 1
            return False, 0.0, f"grammar: {grammar_reason}"
        words = self.tagger(sentence)
        total_words = 0
        n5_words_count = 0
        for word in words:
            surface = word.surface
            features = word.feature
            pos = features.pos1 if hasattr(features, 'pos1') else None
            if pos in ['名詞', '動詞', '形容詞', '副詞', '連体詞']:
                total_words += 1
                base_form = features.lemma if hasattr(features, 'lemma') else surface
                if surface in self.n5_words or base_form in self.n5_words:
                    n5_words_count += 1
        if total_words == 0:
            self.stats['rejected_vocab'] += 1
            return False, 0.0, "no content words"
        n5_ratio = n5_words_count / total_words
        if n5_ratio < self.min_n5_ratio:
            self.stats['rejected_vocab'] += 1
            return False, n5_ratio, f"vocab ratio {n5_ratio:.1%} < {self.min_n5_ratio:.0%}"
        self.stats['accepted'] += 1
        return True, n5_ratio, ""

    def to_hiragana(self, text: str) -> str:
        result = self.kks.convert(text)
        return ''.join([item['hira'] for item in result])

    def is_duplicate(self, sentence: str) -> bool:
        """Check if sentence is duplicate"""
        if sentence in self.seen_sentences:
            self.stats['duplicates'] += 1
            return True
        self.seen_sentences.add(sentence)
        return False

    def load_corpus(self, sentences_jp: Path, sentences_en: Path, links: Path,
                   source_name: str, quality_score: int):
        """Load a corpus and return candidate examples"""
        print(f"\n📚 Loading {source_name} corpus...")
        
        # Load English translations
        print(f"   Loading English translations...")
        en_translations = {}
        with open(sentences_en, 'r', encoding='utf-8') as f:
            for line in f:
                parts = line.strip().split('\t')
                if len(parts) >= 3 and parts[1] == 'eng':
                    en_translations[parts[0]] = parts[2]
        print(f"   ✅ Loaded {len(en_translations):,} English translations")

        # Load links
        print(f"   Loading sentence links...")
        jp_to_en = defaultdict(list)
        with open(links, 'r', encoding='utf-8') as f:
            for line in f:
                parts = line.strip().split('\t')
                if len(parts) >= 2:
                    jp_id, en_id = parts[0], parts[1]
                    if en_id in en_translations:
                        jp_to_en[jp_id].append(en_id)
        print(f"   ✅ Loaded {len(jp_to_en):,} links")

        # Process Japanese sentences
        print(f"   Processing Japanese sentences...")
        candidates = []
        with open(sentences_jp, 'r', encoding='utf-8') as f:
            for line in f:
                parts = line.strip().split('\t')
                if len(parts) < 3 or parts[1] != 'jpn':
                    continue
                
                jp_id = parts[0]
                jp_text = parts[2]
                
                # Check if duplicate
                if self.is_duplicate(jp_text):
                    continue
                
                # Check N5 level
                is_n5, n5_ratio, rejection_reason = self.check_n5_level(jp_text)
                if not is_n5:
                    continue
                
                # Get English translation
                en_ids = jp_to_en.get(jp_id, [])
                if not en_ids:
                    continue
                en_text = en_translations.get(en_ids[0], '')
                if not en_text:
                    continue
                
                # Generate kana
                kana_reading = self.to_hiragana(jp_text)
                
                # Parse for word matching
                words_in_sentence = self.tagger(jp_text)
                word_forms = set()
                for word in words_in_sentence:
                    surface = word.surface
                    lemma = word.feature.lemma if hasattr(word.feature, 'lemma') else surface
                    word_forms.add(surface)
                    word_forms.add(lemma)
                
                # Store candidate
                candidates.append({
                    'japanese': jp_text,
                    'kana': kana_reading,
                    'english': en_text,
                    'word_forms': word_forms,
                    'n5_vocab_ratio': n5_ratio,
                    'source': source_name,
                    'source_id': jp_id,
                    'quality_score': quality_score
                })
        
        print(f"   ✅ Found {len(candidates)} valid examples")
        return candidates

    def enrich_cards(self, vocab_cards: List[dict], all_candidates: List[dict]) -> List[dict]:
        """Enrich cards with best candidates from all sources"""
        print(f"\n🔍 Matching {len(all_candidates)} candidates to {len(vocab_cards)} vocab cards...")
        
        # Build vocab lookup
        vocab_lookup = {}
        for card in vocab_cards:
            kanji = card.get('kanji', '').strip()
            kana = card.get('kana', '').strip()
            if kanji:
                vocab_lookup[kanji] = card
            vocab_lookup[kana] = card
        
        # Match candidates to cards
        cards_enriched = 0
        for vocab_word, card in vocab_lookup.items():
            # Find all matching candidates
            matching_candidates = []
            for candidate in all_candidates:
                if vocab_word in candidate['word_forms']:
                    matching_candidates.append(candidate)
            
            if not matching_candidates:
                continue
            
            # Sort by quality score (lower = better)
            matching_candidates.sort(key=lambda x: x['quality_score'])
            
            # Take top N examples
            selected = matching_candidates[:self.max_examples]
            
            # Add to card
            if 'examples' not in card:
                card['examples'] = []
            
            for candidate in selected:
                example = {
                    'japanese': candidate['japanese'],
                    'kana': candidate['kana'],
                    'english': candidate['english'],
                    'source': {
                        'type': candidate['source'].lower(),
                        'id': candidate['source_id'],
                        'license': 'CC BY-SA 3.0' if candidate['source'] == 'jmdict' else 'CC BY 2.0 FR'
                    },
                    'n5_vocab_ratio': round(candidate['n5_vocab_ratio'], 3),
                    'n5_grammar': True
                }
                card['examples'].append(example)
            
            if len(card['examples']) > 0:
                cards_enriched += 1
                if cards_enriched % 50 == 0:
                    print(f"      📝 {cards_enriched} cards enriched...")
        
        return vocab_cards


def main():
    print("=" * 70)
    print("Phase 2: Multi-Source Enrichment (JMdict + Tatoeba)")
    print("=" * 70)

    # Paths
    input_file = Path('data/n5-phase1/n5-master-list.json')
    output_file = Path('data/n5-phase2/n5_multi_source.json')

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

    # Initialize enricher
    enricher = MultiSourceEnricher(
        n5_words=n5_words,
        max_examples=3,
        max_length=35,
        min_n5_ratio=0.95
    )

    # Load JMdict candidates (priority 1)
    jmdict_candidates = enricher.load_corpus(
        sentences_jp=Path('data/jmdict/jmdict_sentences.tsv'),
        sentences_en=Path('data/jmdict/jmdict_translations.tsv'),
        links=Path('data/jmdict/jmdict_links.tsv'),
        source_name='jmdict',
        quality_score=1
    )

    # Load Tatoeba candidates (priority 2)
    tatoeba_candidates = enricher.load_corpus(
        sentences_jp=Path('data/tatoeba/jpn_sentences.tsv'),
        sentences_en=Path('data/tatoeba/eng_sentences.tsv'),
        links=Path('data/tatoeba/jpn-eng_links.tsv'),
        source_name='tatoeba',
        quality_score=2
    )

    # Combine all candidates
    all_candidates = jmdict_candidates + tatoeba_candidates
    print(f"\n📊 Total candidates from all sources: {len(all_candidates)}")

    # Enrich cards
    enriched_cards = enricher.enrich_cards(cards, all_candidates)

    # Statistics
    cards_with_examples = sum(1 for card in enriched_cards if card.get('examples'))
    total_examples = sum(len(card.get('examples', [])) for card in enriched_cards)
    coverage = (cards_with_examples / len(enriched_cards) * 100) if enriched_cards else 0

    print(f"\n📊 Final Statistics:")
    print(f"   Total sentences checked: {enricher.stats['total_checked']:,}")
    print(f"   Rejected (length): {enricher.stats['rejected_length']:,}")
    print(f"   Rejected (vocabulary): {enricher.stats['rejected_vocab']:,}")
    print(f"   Rejected (grammar): {enricher.stats['rejected_grammar']:,}")
    print(f"   Duplicates removed: {enricher.stats.get('duplicates', 0):,}")
    print(f"   Accepted: {enricher.stats['accepted']:,}")
    print(f"   Cards with examples: {cards_with_examples}/{len(enriched_cards)} ({coverage:.1f}%)")
    print(f"   Total examples: {total_examples}")

    # Save
    output_file.parent.mkdir(parents=True, exist_ok=True)
    output_data = {
        'metadata': data.get('metadata', {}),
        'vocabulary': enriched_cards
    }
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    print(f"\n💾 Saved to {output_file}")
    print(f"\n✅ Multi-source enrichment complete!")
    print("=" * 70)


if __name__ == '__main__':
    main()
