#!/usr/bin/env python3
"""
ENHANCED N5 Vocabulary Sentence Extractor v2.0

Extract sentences from Tatoeba that ONLY use our 807 N5 vocabulary words.

IMPROVEMENTS from v1:
- Separated particles, auxiliaries, and conjunctions by POS type
- Added missing sentence-ending particles (かな, な)
- More precise POS tag checking
- Better code organization and documentation
- Added ている protection (ensure progressive form is not rejected)

Strict criteria:
- 100% of content words must be in our 807 vocab (kanji or kana form)
- Particles/auxiliaries/conjunctions allowed (properly categorized)
- Length: 5-35 characters
"""

import json
import sqlite3
from pathlib import Path
from typing import Set, Dict, Tuple

try:
    import fugashi
    from tqdm import tqdm
except ImportError:
    print("ERROR: Please install: pip install fugashi unidic-lite tqdm")
    exit(1)

# Initialize MeCab
tagger = fugashi.Tagger()

# Paths
VOCAB_FILE = Path("N5_vocab_dataset_final.json")
TATOEBA_FILE = Path("../../data/tatoeba/jpn_sentences_detailed.tsv")
OUTPUT_JSON = Path("n5_807_vocab_sentences_v2_enhanced.json")

# ============================================================================
# ENHANCED PARTICLE/AUXILIARY CATEGORIZATION
# ============================================================================
# Based on AI feedback: separate by actual POS type

# TRUE PARTICLES (助詞) - Case markers, topic markers, etc.
ALLOWED_PARTICLES = {
    # Case particles
    'が', 'を', 'に', 'へ', 'で', 'と', 'から', 'まで', 'より',

    # Topic/emphasis particles
    'は', 'も', 'こそ', 'さえ', 'しか', 'だけ', 'ばかり',

    # Listing particles
    'や', 'とか',

    # Sentence-ending particles (終助詞)
    'か', 'ね', 'よ', 'わ', 'な', 'かな', 'ぞ', 'ぜ', 'さ', 'っけ',

    # Connecting particles
    'の', 'し', 'けど', 'けれど', 'が'
}

# AUXILIARIES (助動詞) - Copulas, verb endings
ALLOWED_AUXILIARIES = {
    # Copula forms
    'だ', 'です', 'である',

    # Past copula
    'だった', 'でした',

    # Polite verb endings
    'ます', 'ました', 'ません', 'ませんでした',

    # Negative
    'ない', 'なかった',

    # Desire
    'たい', 'たかった',

    # Volitional/suggestion
    'う', 'よう', 'ましょう',

    # Presumption (N5 level only)
    'でしょう', 'だろう',

    # Progressive (ている) - explicitly allow
    'て', 'ている', 'ています', 'ていた', 'ていました',
    'でいる', 'でいます', 'でいた', 'でいました'
}

# CONJUNCTIONS (接続詞) - Sentence connectors
ALLOWED_CONJUNCTIONS = {
    'そして', 'それから', 'それで', 'だから', 'でも', 'しかし',
    'または', 'あるいは', 'そうすると', 'では', 'じゃ', 'じゃあ'
}

# COMMON INTERJECTIONS (感動詞) - Based on ChatGPT feedback
ALLOWED_INTERJECTIONS = {
    'はい', 'いいえ', 'ええ', 'うん', 'ううん', 'あの', 'えっと', 'そう',
    'ああ', 'まあ', 'ねえ', 'おい', 'ほら', 'さあ'
}

# ============================================================================
# VOCABULARY LOADING
# ============================================================================

def load_807_vocab() -> Tuple[Set[str], Set[str]]:
    """Load 807 vocabulary (kanji and kana forms)"""
    with open(VOCAB_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    vocab_kanji = set()
    vocab_kana = set()

    for entry in data['vocabulary']:
        kana = entry.get('kana', '')
        kanji = entry.get('kanji', '')

        if kana:
            vocab_kana.add(kana)
        if kanji:
            vocab_kanji.add(kanji)

    print(f"Loaded 807 vocabulary:")
    print(f"  Kana forms: {len(vocab_kana)}")
    print(f"  Kanji forms: {len(vocab_kanji)}")
    print(f"  Total unique: {len(vocab_kanji | vocab_kana)}")

    return vocab_kanji, vocab_kana

# ============================================================================
# TOKEN CLASSIFICATION (ENHANCED)
# ============================================================================

def should_skip_token(token) -> Tuple[bool, str]:
    """
    Check if token should be skipped (not checked against vocabulary).

    Returns:
        (should_skip, reason)

    Enhanced logic:
    - Check POS tag first (most reliable)
    - Then check surface form whitelist
    - Separate by actual POS type
    """
    surface = token.surface
    pos1 = token.feature.pos1 if hasattr(token.feature, 'pos1') else ""

    # Symbols and punctuation (always skip)
    if pos1 in ("記号", "補助記号", "空白"):
        return True, "symbol"

    # Particles (助詞)
    if pos1 == "助詞":
        return True, "particle"
    if surface in ALLOWED_PARTICLES:
        return True, "particle"

    # Auxiliaries (助動詞)
    if pos1 == "助動詞":
        return True, "auxiliary"
    if surface in ALLOWED_AUXILIARIES:
        return True, "auxiliary"

    # Conjunctions (接続詞)
    if pos1 == "接続詞":
        return True, "conjunction"
    if surface in ALLOWED_CONJUNCTIONS:
        return True, "conjunction"

    # Interjections (感動詞)
    if pos1 == "感動詞":
        return True, "interjection"
    if surface in ALLOWED_INTERJECTIONS:
        return True, "interjection"

    # Content word - must check against vocabulary
    return False, ""

# ============================================================================
# SENTENCE VALIDATION (ENHANCED)
# ============================================================================

def check_sentence(sentence: str, vocab_kanji: Set[str], vocab_kana: Set[str]) -> Tuple[bool, str]:
    """
    Check if sentence uses ONLY our 807 vocabulary.

    Returns: (passes, rejection_reason)

    Enhanced with:
    - Better token classification
    - Progressive form (ている) protection
    - More detailed rejection reasons
    """
    # Length check
    if len(sentence) < 5 or len(sentence) > 35:
        return False, f"length_{len(sentence)}"

    tokens = tagger.parseToNodeList(sentence)

    for token in tokens:
        # Check if token should be skipped
        should_skip, reason = should_skip_token(token)
        if should_skip:
            continue

        surface = token.surface
        lemma = token.feature.lemma if hasattr(token.feature, 'lemma') else surface

        # Check if word (surface or lemma) is in our 807 vocab
        if surface not in vocab_kanji and surface not in vocab_kana and \
           lemma not in vocab_kanji and lemma not in vocab_kana:
            return False, f"non_vocab_word:{surface}"

    return True, ""

# ============================================================================
# MAIN EXTRACTION
# ============================================================================

def main():
    print("="*80)
    print("EXTRACTING SENTENCES FOR 807 N5 VOCABULARY (ENHANCED v2.0)")
    print("="*80)

    # Load vocabulary
    vocab_kanji, vocab_kana = load_807_vocab()

    # Check Tatoeba file
    if not TATOEBA_FILE.exists():
        print(f"ERROR: {TATOEBA_FILE} not found!")
        return

    print(f"\nProcessing: {TATOEBA_FILE}")

    # Count total lines
    with open(TATOEBA_FILE, 'r', encoding='utf-8') as f:
        total_lines = sum(1 for _ in f)

    print(f"Total Tatoeba sentences: {total_lines:,}")

    # Extract sentences
    passed_sentences = []
    stats = {
        'total': 0,
        'passed': 0,
        'length': 0,
        'non_vocab': 0,
        'skipped_tokens': {
            'particle': 0,
            'auxiliary': 0,
            'conjunction': 0,
            'interjection': 0,
            'symbol': 0
        }
    }

    with open(TATOEBA_FILE, 'r', encoding='utf-8') as f:
        for line in tqdm(f, total=total_lines, desc="Filtering"):
            stats['total'] += 1

            parts = line.strip().split('\t')
            if len(parts) < 3:
                continue

            sentence_id, japanese, english = parts[0], parts[1], parts[2]

            # Check if sentence passes
            passes, reason = check_sentence(japanese, vocab_kanji, vocab_kana)

            if passes:
                stats['passed'] += 1
                passed_sentences.append({
                    'id': sentence_id,
                    'japanese': japanese,
                    'english': english,
                    'source': 'tatoeba'
                })
            else:
                if reason.startswith('length'):
                    stats['length'] += 1
                elif reason.startswith('non_vocab'):
                    stats['non_vocab'] += 1

    # Save results
    output = {
        'metadata': {
            'version': '2.0',
            'description': 'Enhanced vocabulary filtering with separated POS types',
            'total_sentences': stats['passed'],
            'vocabulary_count': 807,
            'source': 'tatoeba',
            'criteria': '100% vocabulary match (807 words only)',
            'improvements': [
                'Separated particles, auxiliaries, and conjunctions',
                'Added sentence-ending particles (かな, な)',
                'Added interjections (はい, ええ, そう, etc.)',
                'Progressive form (ている) explicitly protected',
                'More precise POS tag checking'
            ],
            'filters': {
                'length': '5-35 characters',
                'vocabulary': '100% from 807 N5 words',
                'particles': 'allowed (properly categorized)',
                'auxiliaries': 'allowed (です/ます, ている, etc.)',
                'conjunctions': 'allowed (そして, でも, etc.)',
                'interjections': 'allowed (はい, ええ, etc.)'
            }
        },
        'sentences': passed_sentences
    }

    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # Print summary
    print("\n" + "="*80)
    print("ENHANCED EXTRACTION COMPLETE (v2.0)")
    print("="*80)
    print(f"\nResults:")
    print(f"  Total processed: {stats['total']:,}")
    print(f"  ✅ Passed: {stats['passed']:,} ({stats['passed']/stats['total']*100:.2f}%)")
    print(f"  ❌ Length filter: {stats['length']:,}")
    print(f"  ❌ Non-vocab words: {stats['non_vocab']:,}")

    print(f"\nComparison to v1:")
    print(f"  v1 output: 11,553 sentences (4.66% pass rate)")
    print(f"  v2 output: {stats['passed']:,} sentences ({stats['passed']/stats['total']*100:.2f}% pass rate)")

    print(f"\nOutput saved to: {OUTPUT_JSON}")
    print(f"File size: {OUTPUT_JSON.stat().st_size / 1024:.1f} KB")

if __name__ == "__main__":
    main()
