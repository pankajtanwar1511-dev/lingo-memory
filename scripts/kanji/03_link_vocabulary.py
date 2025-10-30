#!/usr/bin/env python3
"""
Link N5 kanji to vocabulary words.

This script:
1. Loads N5 vocab dataset (public/seed-data/N5_vocab_dataset.json)
2. For each kanji, finds all vocab words containing it
3. Creates bidirectional links (kanji ↔ vocabulary)
4. Outputs: data/kanji/processed/kanji_vocab_links.json

Usage:
    python 03_link_vocabulary.py
"""

import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict

# Paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
RAW_DIR = PROJECT_ROOT / "data" / "kanji" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "kanji" / "processed"
VOCAB_DATASET = PROJECT_ROOT / "public" / "seed-data" / "N5_vocab_dataset.json"
N5_LIST_JSON = RAW_DIR / "n5-kanji-list.json"
OUTPUT_JSON = PROCESSED_DIR / "kanji_vocab_links.json"

def is_kanji(char):
    """Check if a character is a kanji (CJK Unified Ideographs)."""
    codepoint = ord(char)
    return 0x4E00 <= codepoint <= 0x9FFF

def load_n5_kanji_list():
    """Load the list of N5 kanji characters."""
    print("📖 Loading N5 kanji list...")
    with open(N5_LIST_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)
    kanji_set = set(data['kanji'])
    print(f"✅ Loaded {len(kanji_set)} N5 kanji")
    return kanji_set

def load_vocab_dataset():
    """Load the N5 vocabulary dataset."""
    print("\n📖 Loading N5 vocab dataset...")
    with open(VOCAB_DATASET, 'r', encoding='utf-8') as f:
        data = json.load(f)
    vocab_list = data['vocabulary']
    print(f"✅ Loaded {len(vocab_list)} vocabulary words")
    return vocab_list

def link_kanji_to_vocab(n5_kanji_set, vocab_list):
    """Create links between kanji and vocabulary words."""
    print("\n🔗 Linking kanji to vocabulary...")

    # Build kanji → vocab mapping
    kanji_to_vocab = defaultdict(list)
    vocab_count = 0

    for vocab in vocab_list:
        vocab_word = vocab.get('kanji', '')
        vocab_id = vocab.get('id', '')

        if not vocab_word or not vocab_id:
            continue

        # Extract kanji from vocab word
        for char in vocab_word:
            if is_kanji(char) and char in n5_kanji_set:
                kanji_to_vocab[char].append({
                    'vocabId': vocab_id,
                    'word': vocab_word,
                    'kana': vocab.get('kana', ''),
                    'meaning': vocab.get('meaning', [])[0] if vocab.get('meaning') else '',
                    'audioUrl': vocab.get('audio', {}).get('pronunciationUrl', '')
                })

        vocab_count += 1
        if vocab_count % 100 == 0:
            print(f"   Processed {vocab_count}/{len(vocab_list)} vocab words...")

    print(f"✅ Created links for {len(kanji_to_vocab)} kanji")

    # Convert to list format
    kanji_links = []
    for kanji_char in sorted(n5_kanji_set):
        vocab_examples = kanji_to_vocab.get(kanji_char, [])

        # Sort by word length (shorter = more basic)
        vocab_examples.sort(key=lambda v: len(v['word']))

        kanji_links.append({
            'kanji': kanji_char,
            'exampleCount': len(vocab_examples),
            'examples': [v['vocabId'] for v in vocab_examples],  # Just IDs for final dataset
            'exampleDetails': vocab_examples  # Full details for review
        })

    return kanji_links

def print_statistics(kanji_links):
    """Print linking statistics."""
    print("\n📊 Linking Statistics:")

    total = len(kanji_links)
    with_examples = sum(1 for k in kanji_links if k['exampleCount'] > 0)
    without_examples = total - with_examples

    total_examples = sum(k['exampleCount'] for k in kanji_links)
    avg_examples = total_examples / total if total > 0 else 0

    print(f"   Total kanji: {total}")
    print(f"   Kanji with examples: {with_examples} ({with_examples/total*100:.1f}%)")
    print(f"   Kanji without examples: {without_examples}")
    print(f"   Total example words: {total_examples}")
    print(f"   Average examples per kanji: {avg_examples:.1f}")

    # Show kanji with most examples
    top_kanji = sorted(kanji_links, key=lambda k: k['exampleCount'], reverse=True)[:5]
    print("\n   Top 5 kanji by example count:")
    for k in top_kanji:
        examples = ', '.join([v['word'] for v in k['exampleDetails'][:3]])
        more = f" (+{k['exampleCount'] - 3} more)" if k['exampleCount'] > 3 else ""
        print(f"      {k['kanji']}: {k['exampleCount']} examples ({examples}{more})")

    # Show kanji without examples
    if without_examples > 0:
        no_examples = [k['kanji'] for k in kanji_links if k['exampleCount'] == 0]
        print(f"\n   ⚠️  Kanji without examples ({len(no_examples)}):")
        print(f"      {', '.join(no_examples[:20])}")
        if len(no_examples) > 20:
            print(f"      ... and {len(no_examples) - 20} more")

def save_output(kanji_links):
    """Save kanji-vocab links to JSON."""
    print(f"\n💾 Saving to: {OUTPUT_JSON}")

    output = {
        'metadata': {
            'source': 'LingoMemory N5 Vocab Dataset',
            'processedAt': datetime.utcnow().isoformat() + 'Z',
            'totalKanji': len(kanji_links),
            'kanjiWithExamples': sum(1 for k in kanji_links if k['exampleCount'] > 0),
            'totalExampleWords': sum(k['exampleCount'] for k in kanji_links),
            'script': '03_link_vocabulary.py'
        },
        'kanji': kanji_links
    }

    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"✅ Saved {len(kanji_links)} kanji with vocabulary links")

    # Print sample
    print("\n📊 Sample entry (日):")
    sample = next((k for k in kanji_links if k['kanji'] == '日'), None)
    if sample:
        # Print without full exampleDetails (too verbose)
        sample_output = {
            'kanji': sample['kanji'],
            'exampleCount': sample['exampleCount'],
            'examples': sample['examples'][:5],
            'sampleWords': [v['word'] for v in sample['exampleDetails'][:5]]
        }
        print(json.dumps(sample_output, ensure_ascii=False, indent=2))

def main():
    print("=" * 60)
    print("Kanji-Vocabulary Linker")
    print("=" * 60)

    # Load data
    n5_kanji_set = load_n5_kanji_list()
    vocab_list = load_vocab_dataset()

    # Create links
    kanji_links = link_kanji_to_vocab(n5_kanji_set, vocab_list)

    # Print statistics
    print_statistics(kanji_links)

    # Save output
    save_output(kanji_links)

    print("\n" + "=" * 60)
    print("✅ Vocabulary linking complete!")
    print("=" * 60)

if __name__ == '__main__':
    main()
