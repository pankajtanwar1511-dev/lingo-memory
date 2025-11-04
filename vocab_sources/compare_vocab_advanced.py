#!/usr/bin/env python3
"""
Advanced comparison that handles both kanji and kana forms.
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
    """Load Tanos JSON vocabulary with both kanji and kana"""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Extract both kanji AND kana forms
    kanji_forms = set()
    kana_forms = set()
    word_details = {}

    for entry in data:
        kanji = entry['kanji']
        kana = entry['kana']

        kanji_forms.add(kanji)
        if kanji != kana:  # Don't duplicate if word is kana-only
            kana_forms.add(kana)

        word_details[kanji] = entry
        word_details[kana] = entry

    all_forms = kanji_forms | kana_forms

    return kanji_forms, kana_forms, all_forms, word_details

def main():
    print("N5 Vocabulary Advanced Comparison")
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
    tanos_kanji, tanos_kana, tanos_all, tanos_details = load_tanos_vocab(tanos_vocab_file)
    print(f"  Tanos kanji forms: {len(tanos_kanji)}")
    print(f"  Tanos kana forms: {len(tanos_kana)}")
    print(f"  Total Tanos words: {len(tanos_all)}")
    print()

    # Analysis
    print("=" * 70)
    print("ANALYSIS")
    print("=" * 70)
    print()

    # Words in Tanos (either kanji or kana) that are missing from current
    missing_in_current = tanos_all - current_vocab
    print(f"❌ Missing from current reference: {len(missing_in_current)}")

    # Words in current that are NOT in Tanos (might be N4+ or inflections)
    extra_in_current = current_vocab - tanos_all
    print(f"⚠️  Extra words in current (not in Tanos): {len(extra_in_current)}")

    # Common words
    common = current_vocab & tanos_all
    print(f"✅ Words in both lists: {len(common)}")
    print()

    # Save missing words
    if missing_in_current:
        output_missing = 'missing_n5_words_detailed.txt'
        with open(output_missing, 'w', encoding='utf-8') as f:
            f.write(f"Missing N5 Words: {len(missing_in_current)}\n")
            f.write(f"These N5 words are in Tanos but NOT in our current reference\n")
            f.write("=" * 70 + "\n\n")

            for word in sorted(missing_in_current):
                if word in tanos_details:
                    details = tanos_details[word]
                    f.write(f"{details['kanji']}\t{details['kana']}\t{details['english']}\n")
                else:
                    f.write(f"{word}\t?\t?\n")

        print(f"Saved missing words to: {output_missing}")

        print("\nSample missing words:")
        for word in list(sorted(missing_in_current))[:30]:
            if word in tanos_details:
                details = tanos_details[word]
                print(f"  {details['kanji']} ({details['kana']}) - {details['english']}")
        print()

    # Save extra words
    if extra_in_current:
        output_extra = 'extra_words_detailed.txt'
        with open(output_extra, 'w', encoding='utf-8') as f:
            f.write(f"Extra Words: {len(extra_in_current)}\n")
            f.write(f"These are in current reference but NOT in Tanos N5\n")
            f.write("=" * 70 + "\n\n")

            for word in sorted(extra_in_current):
                f.write(f"{word}\n")

        print(f"Saved extra words to: {output_extra}")
        print(f"  (Sample: {list(sorted(extra_in_current))[:10]})")
        print()

    # Create complete vocabulary list (Tanos as authoritative base)
    print("=" * 70)
    print("RECOMMENDATION")
    print("=" * 70)
    print()

    print("🎯 DIAGNOSIS:")
    print(f"   Your current list has {len(current_vocab)} words")
    print(f"   Tanos N5 (authoritative) has {len(tanos_all)} words")
    print(f"   You're missing {len(missing_in_current)} true N5 words")
    print(f"   You have {len(extra_in_current)} extra words (possibly N4+ or inflections)")
    print()

    print("💡 SOLUTION:")
    print("   Option 1: Use Tanos list as-is ({} words) ✅ Conservative".format(len(tanos_all)))
    print("   Option 2: Merge both lists ({} words) ⚠️ Includes possible N4+ words".format(len(current_vocab | tanos_all)))
    print("   Option 3: Review extra words manually")
    print()

    # Save Tanos-only list (conservative, authoritative)
    output_tanos_only = 'n5_vocab_tanos_authoritative.txt'
    with open(output_tanos_only, 'w', encoding='utf-8') as f:
        for word in sorted(tanos_all):
            f.write(f"{word}\n")

    print(f"✅ Saved authoritative Tanos-only list to: {output_tanos_only}")
    print(f"   ({len(tanos_all)} words)")
    print()

    # Save merged list
    merged = current_vocab | tanos_all
    output_merged = 'n5_vocab_merged.txt'
    with open(output_merged, 'w', encoding='utf-8') as f:
        for word in sorted(merged):
            f.write(f"{word}\n")

    print(f"⚠️  Saved merged list to: {output_merged}")
    print(f"   ({len(merged)} words - includes possible N4+ words)")
    print()

    print("=" * 70)
    print("NEXT STEPS")
    print("=" * 70)
    print()
    print("1. Use 'n5_vocab_tanos_authoritative.txt' for strict N5 validation")
    print("2. This should fix the 2.1% validation failure")
    print("3. Re-run Tatoeba extraction with the authoritative list")
    print()

if __name__ == '__main__':
    main()
