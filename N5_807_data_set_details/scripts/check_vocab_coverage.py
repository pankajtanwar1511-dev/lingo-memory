#!/usr/bin/env python3
"""
Check vocabulary coverage against actual 807 N5 words
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
VOCAB_FILE = BASE_DIR / "data" / "N5_vocab_dataset_final.json"
SENTENCES_FILE = BASE_DIR / "data" / "n5_807_vocab_n5_grammar_sentences_v2_enhanced.json"

print("="*80)
print("VOCABULARY COVERAGE ANALYSIS (807 N5 Words)")
print("="*80)
print()

# Load vocabulary (807 words)
print("Loading vocabulary dataset...")
with open(VOCAB_FILE, 'r', encoding='utf-8') as f:
    vocab_data = json.load(f)

vocab_list = vocab_data['vocabulary']
print(f"✓ Loaded {len(vocab_list)} vocabulary entries")
print()

# Build word -> entry mapping
word_map = {}
for entry in vocab_list:
    # Use kanji as primary key, kana as fallback
    key = entry.get('kanji', entry.get('kana', ''))
    if key:
        word_map[key] = entry
        # Also add kana form if different
        kana = entry.get('kana', '')
        if kana and kana != key:
            word_map[kana] = entry

print(f"Total unique forms: {len(word_map)}")
print()

# Load sentences
print("Loading sentences...")
with open(SENTENCES_FILE, 'r', encoding='utf-8') as f:
    sentence_data = json.load(f)

if isinstance(sentence_data, dict) and 'sentences' in sentence_data:
    sentences = sentence_data['sentences']
else:
    sentences = sentence_data

print(f"✓ Loaded {len(sentences)} sentences")
print()

# Count occurrences for each vocabulary entry
print("Analyzing coverage...")
coverage = {}

for entry in vocab_list:
    entry_id = entry.get('id', '')
    kanji = entry.get('kanji', '')
    kana = entry.get('kana', '')

    # Count sentences containing this word (either form)
    count = 0
    for sentence in sentences:
        jp = sentence.get('japanese', '')
        if kanji and kanji in jp:
            count += 1
        elif kana and kana in jp:
            count += 1

    coverage[entry_id] = {
        'kanji': kanji,
        'kana': kana,
        'count': count,
        'meaning': entry.get('meaning', [''])[0] if entry.get('meaning') else ''
    }

# Analyze results
with_0 = [k for k, v in coverage.items() if v['count'] == 0]
with_1 = [k for k, v in coverage.items() if v['count'] == 1]
with_2_5 = [k for k, v in coverage.items() if 2 <= v['count'] <= 5]
with_6plus = [k for k, v in coverage.items() if v['count'] >= 6]

print("="*80)
print("RESULTS")
print("="*80)
print()

print(f"📊 COVERAGE BREAKDOWN (out of 807 vocabulary words):")
print(f"  Words with 0 examples:    {len(with_0):4d} ({len(with_0)/807*100:5.1f}%)")
print(f"  Words with 1 example:     {len(with_1):4d} ({len(with_1)/807*100:5.1f}%)")
print(f"  Words with 2-5 examples:  {len(with_2_5):4d} ({len(with_2_5)/807*100:5.1f}%)")
print(f"  Words with 6+ examples:   {len(with_6plus):4d} ({len(with_6plus)/807*100:5.1f}%)")
print()

print(f"✅ TOTAL COVERED: {len(with_1) + len(with_2_5) + len(with_6plus)} words ({(len(with_1) + len(with_2_5) + len(with_6plus))/807*100:.1f}%)")
print(f"🔴 MISSING: {len(with_0)} words ({len(with_0)/807*100:.1f}%)")
print()

# Show sample of missing words
if with_0:
    print("🔴 SAMPLE MISSING WORDS (first 20):")
    for word_id in with_0[:20]:
        info = coverage[word_id]
        kanji = info['kanji'] if info['kanji'] else '(none)'
        kana = info['kana']
        meaning = info['meaning']
        print(f"  {word_id}: {kanji} / {kana} - {meaning}")

    if len(with_0) > 20:
        print(f"  ... and {len(with_0) - 20} more")
    print()

# Show words with only 1 example
if with_1:
    print("⚠️  WORDS WITH ONLY 1 EXAMPLE (first 20):")
    for word_id in with_1[:20]:
        info = coverage[word_id]
        kanji = info['kanji'] if info['kanji'] else '(none)'
        kana = info['kana']
        meaning = info['meaning']
        print(f"  {word_id}: {kanji} / {kana} - {meaning}")

    if len(with_1) > 20:
        print(f"  ... and {len(with_1) - 20} more")

print()
print("="*80)
print("DONE")
print("="*80)
