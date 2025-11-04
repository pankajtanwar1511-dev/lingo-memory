#!/usr/bin/env python3
"""
Thorough vocabulary comparison between current list and Tanos.

Creates a comprehensive table with:
- Kanji column
- Kana column
- Valid in both
- Valid in Tanos only
- Valid in current only

Intelligently groups kanji/kana pairs as single entries.
"""

import json
import re
from collections import defaultdict

def has_kanji(text):
    """Check if text contains kanji"""
    return bool(re.search(r'[\u4e00-\u9faf]', text))

def is_hiragana(text):
    """Check if text is only hiragana"""
    return bool(re.match(r'^[ぁ-ん]+$', text))

def is_katakana(text):
    """Check if text is only katakana"""
    return bool(re.match(r'^[ァ-ヴー]+$', text))

def normalize_word(word):
    """Normalize word for comparison"""
    # Remove slashes and alternatives for comparison
    return word.split('/')[0].strip()

def load_current_vocab(filepath):
    """Load current n5_vocab.txt and group kanji/kana pairs"""
    words = {}

    with open(filepath, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f if line.strip()]

    # First pass: collect all words
    kanji_words = {}
    kana_words = {}

    for word in lines:
        normalized = normalize_word(word)

        if has_kanji(normalized):
            kanji_words[normalized] = word
        elif is_hiragana(normalized) or is_katakana(normalized):
            kana_words[normalized] = word

    # Second pass: try to pair kanji with kana
    paired = set()
    entries = []

    for kanji, kanji_full in kanji_words.items():
        # This kanji might have a kana equivalent
        # We'll mark it for now, and try to find reading later
        entries.append({
            'kanji': kanji_full,
            'kana': None,  # Will try to find
            'source': 'current'
        })

    for kana, kana_full in kana_words.items():
        # Add kana-only words
        entries.append({
            'kanji': None,
            'kana': kana_full,
            'source': 'current'
        })

    return entries, kanji_words, kana_words

def load_tanos_vocab(filepath):
    """Load Tanos JSON vocabulary"""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    entries = []
    for entry in data:
        kanji = entry['kanji']
        kana = entry['kana']
        english = entry.get('english', '')

        # Group kanji and kana as single entry
        entries.append({
            'kanji': kanji if has_kanji(kanji) else None,
            'kana': kana,
            'english': english,
            'source': 'tanos'
        })

    return entries

def create_word_index(entries):
    """Create index for fast lookup"""
    index = {}

    for i, entry in enumerate(entries):
        kanji = entry.get('kanji')
        kana = entry.get('kana')

        if kanji:
            index[kanji] = i
        if kana:
            index[kana] = i

    return index

def merge_and_compare(current_entries, tanos_entries):
    """Merge both lists and categorize"""

    # Create lookup dictionaries
    current_by_kanji = {}
    current_by_kana = {}

    for entry in current_entries:
        if entry.get('kanji'):
            current_by_kanji[entry['kanji']] = entry
        if entry.get('kana'):
            current_by_kana[entry['kana']] = entry

    tanos_by_kanji = {}
    tanos_by_kana = {}
    tanos_lookup = {}

    for entry in tanos_entries:
        if entry.get('kanji'):
            tanos_by_kanji[entry['kanji']] = entry
            tanos_lookup[entry['kanji']] = entry
        if entry.get('kana'):
            tanos_by_kana[entry['kana']] = entry
            tanos_lookup[entry['kana']] = entry

    # Results
    in_both = []
    tanos_only = []
    current_only = []

    # Track processed
    processed_tanos = set()
    processed_current = set()

    # Check Tanos entries
    for entry in tanos_entries:
        kanji = entry.get('kanji')
        kana = entry.get('kana')

        entry_id = f"{kanji}|{kana}"
        if entry_id in processed_tanos:
            continue

        # Check if in current
        in_current = False

        if kanji and kanji in current_by_kanji:
            in_current = True
        elif kana and kana in current_by_kana:
            in_current = True

        result_entry = {
            'kanji': kanji if kanji else '',
            'kana': kana if kana else '',
            'english': entry.get('english', ''),
            'in_both': in_current,
            'in_tanos': True,
            'in_current': in_current
        }

        if in_current:
            in_both.append(result_entry)
            processed_tanos.add(entry_id)
            # Mark current as processed
            if kanji:
                processed_current.add(kanji)
            if kana:
                processed_current.add(kana)
        else:
            tanos_only.append(result_entry)
            processed_tanos.add(entry_id)

    # Check current entries not in Tanos
    for entry in current_entries:
        kanji = entry.get('kanji')
        kana = entry.get('kana')

        if kanji and kanji in processed_current:
            continue
        if kana and kana in processed_current:
            continue

        # Not in Tanos
        in_tanos = False

        if kanji and kanji in tanos_by_kanji:
            in_tanos = True
        elif kana and kana in tanos_by_kana:
            in_tanos = True

        if not in_tanos:
            result_entry = {
                'kanji': kanji if kanji else '',
                'kana': kana if kana else '',
                'english': '',  # Don't have English for current
                'in_both': False,
                'in_tanos': False,
                'in_current': True
            }
            current_only.append(result_entry)

    return in_both, tanos_only, current_only

def main():
    print("=" * 100)
    print("THOROUGH VOCABULARY COMPARISON: CURRENT vs TANOS")
    print("=" * 100)
    print()

    # Load current vocabulary
    print("Loading current vocabulary...")
    current_entries, current_kanji, current_kana = load_current_vocab(
        '/home/pankaj/bumble/lingomemory/data_set/N5/reference/n5_vocab.txt'
    )
    print(f"  Current: {len(current_entries)} entries")
    print(f"    - Kanji entries: {len(current_kanji)}")
    print(f"    - Kana entries: {len(current_kana)}")
    print()

    # Load Tanos vocabulary
    print("Loading Tanos vocabulary...")
    tanos_entries = load_tanos_vocab('tanos_n5_vocab.json')
    print(f"  Tanos: {len(tanos_entries)} entries")
    print()

    # Compare
    print("Comparing vocabularies...")
    in_both, tanos_only, current_only = merge_and_compare(current_entries, tanos_entries)
    print(f"  In both: {len(in_both)}")
    print(f"  Tanos only: {len(tanos_only)}")
    print(f"  Current only: {len(current_only)}")
    print()

    # Generate comprehensive CSV
    print("=" * 100)
    print("GENERATING COMPARISON TABLE")
    print("=" * 100)
    print()

    output_file = 'VOCABULARY_COMPARISON_TABLE.csv'

    with open(output_file, 'w', encoding='utf-8') as f:
        # Header
        f.write("Kanji,Kana,English,In Both,In Tanos,In Current,Category\n")

        # In both (sorted by kana)
        for entry in sorted(in_both, key=lambda x: x['kana']):
            f.write(f'"{entry["kanji"]}","{entry["kana"]}","{entry["english"]}",YES,YES,YES,BOTH\n')

        # Tanos only (sorted by kana)
        for entry in sorted(tanos_only, key=lambda x: x['kana']):
            f.write(f'"{entry["kanji"]}","{entry["kana"]}","{entry["english"]}",NO,YES,NO,TANOS_ONLY\n')

        # Current only (sorted by kana)
        for entry in sorted(current_only, key=lambda x: x['kana'] if x['kana'] else x['kanji']):
            f.write(f'"{entry["kanji"]}","{entry["kana"]}","",NO,NO,YES,CURRENT_ONLY\n')

    print(f"✅ Saved to: {output_file}")
    print()

    # Generate Markdown summary
    print("Generating summary report...")

    summary_file = 'VOCABULARY_COMPARISON_SUMMARY.md'

    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write("# Vocabulary Comparison Summary: Current vs Tanos\n\n")
        f.write(f"**Date:** 2025-11-02\n\n")
        f.write("---\n\n")

        f.write("## Overview\n\n")
        f.write(f"| Category | Count |\n")
        f.write(f"|----------|-------|\n")
        f.write(f"| **In Both** | {len(in_both)} |\n")
        f.write(f"| **Tanos Only (Missing from current)** | {len(tanos_only)} |\n")
        f.write(f"| **Current Only (Extra in current)** | {len(current_only)} |\n")
        f.write(f"| **Total Tanos** | {len(tanos_entries)} |\n")
        f.write(f"| **Total Current** | {len(current_entries)} |\n")
        f.write("\n---\n\n")

        # Sample from each category
        f.write("## Sample: Words in Both (First 30)\n\n")
        f.write("| Kanji | Kana | English |\n")
        f.write("|-------|------|----------|\n")
        for entry in sorted(in_both, key=lambda x: x['kana'])[:30]:
            kanji = entry['kanji'] if entry['kanji'] else '(none)'
            f.write(f"| {kanji} | {entry['kana']} | {entry['english']} |\n")
        f.write("\n---\n\n")

        f.write("## Missing from Current (In Tanos, First 50)\n\n")
        f.write("| Kanji | Kana | English |\n")
        f.write("|-------|------|----------|\n")
        for entry in sorted(tanos_only, key=lambda x: x['kana'])[:50]:
            kanji = entry['kanji'] if entry['kanji'] else '(none)'
            f.write(f"| {kanji} | {entry['kana']} | {entry['english']} |\n")

        if len(tanos_only) > 50:
            f.write(f"\n*... and {len(tanos_only) - 50} more*\n")

        f.write("\n---\n\n")

        f.write("## Extra in Current (Not in Tanos, First 50)\n\n")
        f.write("| Kanji | Kana |\n")
        f.write("|-------|------|\n")
        for entry in sorted(current_only, key=lambda x: x['kana'] if x['kana'] else x['kanji'])[:50]:
            kanji = entry['kanji'] if entry['kanji'] else '(none)'
            kana = entry['kana'] if entry['kana'] else '(none)'
            f.write(f"| {kanji} | {kana} |\n")

        if len(current_only) > 50:
            f.write(f"\n*... and {len(current_only) - 50} more*\n")

        f.write("\n---\n\n")

        f.write("## Files Generated\n\n")
        f.write("1. **VOCABULARY_COMPARISON_TABLE.csv** - Full comparison table (CSV format)\n")
        f.write("2. **VOCABULARY_COMPARISON_SUMMARY.md** - This summary report\n")
        f.write("\n")
        f.write("### CSV Columns:\n")
        f.write("- **Kanji**: Kanji form (if exists)\n")
        f.write("- **Kana**: Hiragana/Katakana reading\n")
        f.write("- **English**: English meaning (from Tanos)\n")
        f.write("- **In Both**: YES if in both lists\n")
        f.write("- **In Tanos**: YES if in Tanos\n")
        f.write("- **In Current**: YES if in current list\n")
        f.write("- **Category**: BOTH, TANOS_ONLY, or CURRENT_ONLY\n")
        f.write("\n")

    print(f"✅ Saved to: {summary_file}")
    print()

    # Print summary
    print("=" * 100)
    print("SUMMARY")
    print("=" * 100)
    print()
    print(f"✅ Words in both lists: {len(in_both)}")
    print(f"❌ Missing from current (in Tanos): {len(tanos_only)}")
    print(f"⚠️  Extra in current (not in Tanos): {len(current_only)}")
    print()
    print(f"📊 Coverage: {len(in_both)}/{len(tanos_entries)} = {len(in_both)/len(tanos_entries)*100:.1f}%")
    print()
    print("Files generated:")
    print(f"  1. {output_file}")
    print(f"  2. {summary_file}")
    print()

if __name__ == '__main__':
    main()
