#!/usr/bin/env python3
"""
Extract sentences from Tatoeba that ONLY use our 807 N5 vocabulary words.

Strict criteria:
- 100% of content words must be in our 807 vocab (kanji or kana form)
- Particles/auxiliaries allowed
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
OUTPUT_JSON = Path("n5_807_vocab_sentences.json")

# Allowed particles (always OK)
ALLOWED_PARTICLES = {
    'は', 'が', 'を', 'に', 'へ', 'で', 'と', 'から', 'まで', 'の', 'も', 'や', 'か', 'ね', 'よ', 'わ',
    'です', 'ます', 'だ', 'でした', 'ました', 'ない', 'ません',
    'そして', 'それから', 'でも', 'しかし', 'だから', 'じゃ', 'では',
}

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

def is_particle(token) -> bool:
    """Check if token is particle/auxiliary"""
    pos1 = token.feature.pos1
    if pos1 in ("助詞", "助動詞", "記号", "補助記号"):
        return True
    if token.surface in ALLOWED_PARTICLES:
        return True
    return False

def check_sentence(sentence: str, vocab_kanji: Set[str], vocab_kana: Set[str]) -> Tuple[bool, str]:
    """
    Check if sentence uses ONLY our 807 vocabulary.
    Returns: (passes, rejection_reason)
    """
    # Length check
    if len(sentence) < 5 or len(sentence) > 35:
        return False, f"length_{len(sentence)}"
    
    tokens = tagger.parseToNodeList(sentence)
    
    for token in tokens:
        # Skip particles
        if is_particle(token):
            continue
        
        surface = token.surface
        lemma = token.feature.lemma if hasattr(token.feature, 'lemma') else surface
        
        # Check if word (surface or lemma) is in our 807 vocab
        if surface not in vocab_kanji and surface not in vocab_kana and \
           lemma not in vocab_kanji and lemma not in vocab_kana:
            return False, f"non_vocab_word:{surface}"
    
    return True, ""

def main():
    print("="*80)
    print("EXTRACTING SENTENCES FOR 807 N5 VOCABULARY")
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
    stats = {'total': 0, 'passed': 0, 'length': 0, 'non_vocab': 0}
    
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
            'total_sentences': stats['passed'],
            'vocabulary_count': 807,
            'source': 'tatoeba',
            'criteria': '100% vocabulary match (807 words only)',
            'filters': {
                'length': '5-35 characters',
                'vocabulary': '100% from 807 N5 words',
                'particles': 'allowed'
            }
        },
        'sentences': passed_sentences
    }
    
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    # Print summary
    print("\n" + "="*80)
    print("EXTRACTION COMPLETE")
    print("="*80)
    print(f"\nResults:")
    print(f"  Total processed: {stats['total']:,}")
    print(f"  ✅ Passed: {stats['passed']:,} ({stats['passed']/stats['total']*100:.2f}%)")
    print(f"  ❌ Length filter: {stats['length']:,}")
    print(f"  ❌ Non-vocab words: {stats['non_vocab']:,}")
    print(f"\nOutput saved to: {OUTPUT_JSON}")
    print(f"File size: {OUTPUT_JSON.stat().st_size / 1024:.1f} KB")

if __name__ == "__main__":
    main()
