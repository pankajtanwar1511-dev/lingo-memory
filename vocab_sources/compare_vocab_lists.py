#!/usr/bin/env python3
"""
Compare Tanos N5 vocabulary list with existing n5_vocab.txt reference.
Identify missing words that are causing validation failures.
"""

import json

def load_current_vocab(filepath):
    """Load current n5_vocab.txt file"""
    words = set()
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            word = line.strip()
            if word:
                words.add(word)
    return words

def load_tanos_vocab(filepath):
    """Load Tanos JSON vocabulary"""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Extract just the kanji/word
    words = set()
    word_details = {}
    for entry in data:
        word = entry['kanji']
        words.add(word)
        word_details[word] = entry

    return words, word_details

def main():
    print("N5 Vocabulary Comparison Tool")
    print("=" * 70)
    print()

    # Load current vocabulary list
    current_vocab_file = '/home/pankaj/bumble/lingomemory/data_set/N5/reference/n5_vocab.txt'
    print(f"Loading current vocabulary from {current_vocab_file}...")
    current_vocab = load_current_vocab(current_vocab_file)
    print(f"  Loaded: {len(current_vocab)} words")
    print()

    # Load Tanos vocabulary
    tanos_vocab_file = 'tanos_n5_vocab.json'
    print(f"Loading Tanos N5 vocabulary from {tanos_vocab_file}...")
    tanos_vocab, tanos_details = load_tanos_vocab(tanos_vocab_file)
    print(f"  Loaded: {len(tanos_vocab)} words")
    print()

    # Find missing words
    print("=" * 70)
    print("ANALYSIS")
    print("=" * 70)
    print()

    missing_in_current = tanos_vocab - current_vocab
    print(f"✅ Words in Tanos N5 list: {len(tanos_vocab)}")
    print(f"📝 Words in current reference: {len(current_vocab)}")
    print(f"❌ Missing from current reference: {len(missing_in_current)}")
    print()

    # Find extra words (in current but not in Tanos)
    extra_in_current = current_vocab - tanos_vocab
    print(f"⚠️  Words in current but NOT in Tanos: {len(extra_in_current)}")
    print(f"   (These might be inflections, particles, or N4+ words)")
    print()

    # Common words
    common = current_vocab & tanos_vocab
    print(f"✅ Words in both lists: {len(common)}")
    print()

    # Save missing words
    print("=" * 70)
    print("MISSING WORDS (likely causing 2.1% validation failure)")
    print("=" * 70)
    print()

    if missing_in_current:
        # Save to file with details
        output_file = 'missing_n5_words.txt'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"Missing N5 Words: {len(missing_in_current)}\n")
            f.write(f"These words are in Tanos N5 list but NOT in our current reference\n")
            f.write("=" * 70 + "\n\n")

            # Sort alphabetically by kana
            sorted_missing = sorted(missing_in_current, key=lambda x: tanos_details[x]['kana'])

            for word in sorted_missing:
                details = tanos_details[word]
                line = f"{details['kanji']}\t{details['kana']}\t{details['english']}\n"
                f.write(line)

        print(f"Saved detailed list to: {output_file}")
        print()
        print("Sample missing words:")
        for word in list(sorted_missing)[:20]:
            details = tanos_details[word]
            print(f"  {details['kanji']} ({details['kana']}) - {details['english']}")

        print(f"\n... and {len(missing_in_current) - 20} more")
        print()

    # Save extra words
    if extra_in_current:
        output_extra = 'extra_words_in_current.txt'
        with open(output_extra, 'w', encoding='utf-8') as f:
            f.write(f"Extra Words in Current Reference: {len(extra_in_current)}\n")
            f.write(f"These words are in our current reference but NOT in Tanos N5\n")
            f.write(f"(Might be inflections, particles, or N4+ words)\n")
            f.write("=" * 70 + "\n\n")

            for word in sorted(extra_in_current):
                f.write(f"{word}\n")

        print(f"Saved extra words to: {output_extra}")
        print()

    # Create merged vocabulary list
    print("=" * 70)
    print("CREATING COMPLETE N5 VOCABULARY LIST")
    print("=" * 70)
    print()

    merged_vocab = current_vocab | tanos_vocab
    print(f"Merged vocabulary size: {len(merged_vocab)} words")

    output_merged = 'n5_vocab_complete.txt'
    with open(output_merged, 'w', encoding='utf-8') as f:
        for word in sorted(merged_vocab):
            f.write(f"{word}\n")

    print(f"Saved complete list to: {output_merged}")
    print()

    # Summary
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print()
    print(f"Original vocabulary: {len(current_vocab)} words")
    print(f"Tanos N5 vocabulary: {len(tanos_vocab)} words")
    print(f"Missing from original: {len(missing_in_current)} words ❌")
    print(f"Extra in original: {len(extra_in_current)} words ⚠️")
    print(f"Complete merged list: {len(merged_vocab)} words ✅")
    print()
    print("🎯 NEXT STEPS:")
    print("1. Review missing_n5_words.txt - These are causing validation failures")
    print("2. Review extra_words_in_current.txt - Check if these are valid N5")
    print("3. Use n5_vocab_complete.txt for re-validation")
    print()
    print(f"Expected validation improvement: From 2.1% to ~30-50% success rate")
    print()

if __name__ == '__main__':
    main()
