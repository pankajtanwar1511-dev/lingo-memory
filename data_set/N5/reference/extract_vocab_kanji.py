#!/usr/bin/env python3
"""
Extract all unique kanji from N5 vocabulary dataset
This creates a more comprehensive N5 kanji list based on actual vocabulary
"""
import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
VOCAB_FILE = PROJECT_ROOT / "public" / "seed-data" / "N5_vocab_dataset.json"
OUTPUT_FILE = PROJECT_ROOT / "data" / "n5_vocab_kanji.txt"

def is_kanji(char):
    """Check if character is kanji"""
    return '\u4e00' <= char <= '\u9fff'

def extract_kanji_from_vocab():
    """Extract all unique kanji from vocabulary dataset"""
    with open(VOCAB_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    all_kanji = set()
    vocab_with_kanji = 0

    for vocab in data['vocabulary']:
        kanji_word = vocab.get('kanji', '')

        if kanji_word:
            # Extract kanji from this vocabulary word
            word_kanji = [c for c in kanji_word if is_kanji(c)]
            if word_kanji:
                vocab_with_kanji += 1
                all_kanji.update(word_kanji)

    return sorted(all_kanji), vocab_with_kanji, len(data['vocabulary'])

def main():
    print("\n" + "="*60)
    print("EXTRACTING KANJI FROM N5 VOCABULARY")
    print("="*60)

    kanji_list, vocab_with_kanji, total_vocab = extract_kanji_from_vocab()

    print(f"\nTotal vocabulary words: {total_vocab}")
    print(f"Words with kanji: {vocab_with_kanji}")
    print(f"Unique kanji extracted: {len(kanji_list)}")

    # Save to file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        for kanji in kanji_list:
            f.write(kanji + '\n')

    print(f"\n✓ Saved to: {OUTPUT_FILE}")

    # Show the kanji list
    print(f"\nExtracted kanji ({len(kanji_list)}):")
    print(''.join(kanji_list))

    # Compare with official N5 kanji list
    official_n5_file = PROJECT_ROOT / "data" / "n5_kanji.txt"
    if official_n5_file.exists():
        with open(official_n5_file, 'r', encoding='utf-8') as f:
            official_n5 = set(line.strip() for line in f if line.strip())

        vocab_kanji_set = set(kanji_list)

        in_both = official_n5 & vocab_kanji_set
        only_in_official = official_n5 - vocab_kanji_set
        only_in_vocab = vocab_kanji_set - official_n5

        print(f"\n" + "="*60)
        print("COMPARISON WITH OFFICIAL JLPT N5 KANJI")
        print("="*60)
        print(f"\nOfficial JLPT N5 kanji: {len(official_n5)}")
        print(f"Vocabulary kanji: {len(vocab_kanji_set)}")
        print(f"\nIn both lists: {len(in_both)}")
        print(f"Only in official JLPT: {len(only_in_official)}")
        if only_in_official:
            print(f"  {''.join(sorted(only_in_official))}")
        print(f"Only in vocabulary: {len(only_in_vocab)}")
        if only_in_vocab:
            print(f"  {''.join(sorted(only_in_vocab))}")

    print("\n" + "="*60)
    print("✓ EXTRACTION COMPLETE")
    print("="*60)

if __name__ == "__main__":
    main()
