#!/usr/bin/env python3
"""
Phase 0: Detailed Vocabulary Coverage Analysis

Generates:
1. phase0_vocab_coverage.json - All 807 words with coverage stats
2. phase0_missing_low_coverage.json - 169 missing + 46 low coverage words (detailed)
"""

import json
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).parent.parent
VOCAB_FILE = BASE_DIR / "data" / "N5_vocab_dataset_final.json"
SENTENCES_FILE = BASE_DIR / "data" / "n5_807_vocab_n5_grammar_sentences_v2_enhanced.json"
REPORTS_DIR = BASE_DIR / "reports"

REPORTS_DIR.mkdir(exist_ok=True)

print("="*80)
print("PHASE 0: DETAILED VOCABULARY COVERAGE ANALYSIS")
print("="*80)
print()

# ============================================================================
# Load Data
# ============================================================================

print("Loading vocabulary dataset...")
with open(VOCAB_FILE, 'r', encoding='utf-8') as f:
    vocab_data = json.load(f)

vocab_list = vocab_data['vocabulary']
print(f"✓ Loaded {len(vocab_list)} vocabulary entries")
print()

print("Loading sentences...")
with open(SENTENCES_FILE, 'r', encoding='utf-8') as f:
    sentence_data = json.load(f)

if isinstance(sentence_data, dict) and 'sentences' in sentence_data:
    sentences = sentence_data['sentences']
else:
    sentences = sentence_data

print(f"✓ Loaded {len(sentences)} sentences")
print()

# ============================================================================
# Analyze Coverage with Sentence Examples
# ============================================================================

print("Analyzing coverage with sentence examples...")

coverage_data = []

for entry in vocab_list:
    entry_id = entry.get('id', '')
    kanji = entry.get('kanji', '')
    kana = entry.get('kana', '')
    meaning = entry.get('meaning', [''])[0] if entry.get('meaning') else ''
    pos = entry.get('partOfSpeech', [])
    jlpt = entry.get('jlptLevel', 'N5')

    # Find all sentences containing this word
    matching_sentences = []

    for sentence in sentences:
        jp = sentence.get('japanese', '')

        # Check if word appears (kanji or kana form)
        found = False
        if kanji and kanji in jp:
            found = True
        elif kana and kana in jp:
            found = True

        if found:
            matching_sentences.append({
                'id': sentence.get('id', ''),
                'japanese': jp,
                'english': sentence.get('english', '')
            })

    # Create coverage entry
    coverage_entry = {
        'id': entry_id,
        'kanji': kanji,
        'kana': kana,
        'romaji': entry.get('romaji', ''),
        'meaning': meaning,
        'meaning_full': entry.get('meaning', []),
        'part_of_speech': pos,
        'jlpt_level': jlpt,
        'tags': entry.get('tags', []),
        'example_count': len(matching_sentences),
        'example_sentences': matching_sentences[:10],  # First 10 examples
        'coverage_status': (
            'missing' if len(matching_sentences) == 0 else
            'low' if len(matching_sentences) == 1 else
            'good' if len(matching_sentences) <= 5 else
            'excellent'
        )
    }

    coverage_data.append(coverage_entry)

print(f"✓ Analyzed {len(coverage_data)} vocabulary entries")
print()

# ============================================================================
# Generate Statistics
# ============================================================================

missing = [e for e in coverage_data if e['coverage_status'] == 'missing']
low = [e for e in coverage_data if e['coverage_status'] == 'low']
good = [e for e in coverage_data if e['coverage_status'] == 'good']
excellent = [e for e in coverage_data if e['coverage_status'] == 'excellent']

print("="*80)
print("STATISTICS")
print("="*80)
print()

print(f"📊 COVERAGE BREAKDOWN (out of 807 vocabulary words):")
print(f"  Missing (0 examples):     {len(missing):4d} ({len(missing)/807*100:5.1f}%)")
print(f"  Low (1 example):          {len(low):4d} ({len(low)/807*100:5.1f}%)")
print(f"  Good (2-5 examples):      {len(good):4d} ({len(good)/807*100:5.1f}%)")
print(f"  Excellent (6+ examples):  {len(excellent):4d} ({len(excellent)/807*100:5.1f}%)")
print()

print(f"✅ TOTAL COVERED: {len(low) + len(good) + len(excellent)} words ({(len(low) + len(good) + len(excellent))/807*100:.1f}%)")
print(f"🔴 NEED ATTENTION: {len(missing) + len(low)} words (missing + low = {(len(missing) + len(low))/807*100:.1f}%)")
print()

# ============================================================================
# Save Full Coverage Report
# ============================================================================

full_report = {
    'metadata': {
        'phase': 'Phase 0 - Vocabulary Coverage',
        'date': '2025-11-03',
        'total_vocab_words': 807,
        'total_sentences': len(sentences),
        'source_file': str(SENTENCES_FILE)
    },
    'summary': {
        'missing_count': len(missing),
        'low_count': len(low),
        'good_count': len(good),
        'excellent_count': len(excellent),
        'total_covered': len(low) + len(good) + len(excellent),
        'coverage_percentage': round((len(low) + len(good) + len(excellent))/807*100, 2)
    },
    'vocabulary': coverage_data
}

output_file = REPORTS_DIR / "phase0_vocab_coverage.json"
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(full_report, f, ensure_ascii=False, indent=2)

print(f"✓ Saved: {output_file}")
print(f"  Size: {output_file.stat().st_size / 1024:.1f} KB")
print()

# ============================================================================
# Save Missing + Low Coverage (Detailed)
# ============================================================================

priority_words = {
    'metadata': {
        'phase': 'Phase 0 - Priority Words for AI Generation',
        'date': '2025-11-03',
        'total_priority_words': len(missing) + len(low),
        'missing_words': len(missing),
        'low_coverage_words': len(low),
        'note': 'These words need AI generation (missing) or more examples (low coverage)'
    },
    'summary': {
        'missing_count': len(missing),
        'low_count': len(low),
        'total_priority': len(missing) + len(low),
        'percentage_of_vocab': round((len(missing) + len(low))/807*100, 2)
    },
    'missing_words': sorted(missing, key=lambda x: x['id']),
    'low_coverage_words': sorted(low, key=lambda x: x['id'])
}

priority_file = REPORTS_DIR / "phase0_missing_low_coverage.json"
with open(priority_file, 'w', encoding='utf-8') as f:
    json.dump(priority_words, f, ensure_ascii=False, indent=2)

print(f"✓ Saved: {priority_file}")
print(f"  Size: {priority_file.stat().st_size / 1024:.1f} KB")
print()

# ============================================================================
# Print Sample Missing Words
# ============================================================================

print("="*80)
print("SAMPLE MISSING WORDS (first 20)")
print("="*80)
print()

for entry in missing[:20]:
    kanji_display = entry['kanji'] if entry['kanji'] else '(none)'
    print(f"  {entry['id']}: {kanji_display} / {entry['kana']}")
    print(f"    Meaning: {entry['meaning']}")
    print(f"    POS: {', '.join(entry['part_of_speech'])}")
    print()

if len(missing) > 20:
    print(f"  ... and {len(missing) - 20} more")
print()

# ============================================================================
# Print Sample Low Coverage Words
# ============================================================================

print("="*80)
print("SAMPLE LOW COVERAGE WORDS (first 20)")
print("="*80)
print()

for entry in low[:20]:
    kanji_display = entry['kanji'] if entry['kanji'] else '(none)'
    print(f"  {entry['id']}: {kanji_display} / {entry['kana']}")
    print(f"    Meaning: {entry['meaning']}")
    print(f"    POS: {', '.join(entry['part_of_speech'])}")
    if entry['example_sentences']:
        print(f"    Example: {entry['example_sentences'][0]['japanese']}")
    print()

if len(low) > 20:
    print(f"  ... and {len(low) - 20} more")
print()

# ============================================================================
# Part of Speech Breakdown for Priority Words
# ============================================================================

print("="*80)
print("PART OF SPEECH BREAKDOWN (Priority Words)")
print("="*80)
print()

pos_count = defaultdict(int)
for entry in missing + low:
    for pos in entry['part_of_speech']:
        pos_count[pos] += 1

print("Missing + Low Coverage by Part of Speech:")
for pos, count in sorted(pos_count.items(), key=lambda x: x[1], reverse=True):
    print(f"  {pos}: {count}")
print()

# ============================================================================
# Done
# ============================================================================

print("="*80)
print("PHASE 0 VOCABULARY COVERAGE COMPLETE")
print("="*80)
print()

print("Generated files:")
print(f"  1. {output_file}")
print(f"     - All 807 words with coverage stats and example sentences")
print()
print(f"  2. {priority_file}")
print(f"     - {len(missing)} missing words + {len(low)} low coverage words (detailed)")
print()

print(f"Summary:")
print(f"  ✅ Covered: {len(low) + len(good) + len(excellent)} words ({(len(low) + len(good) + len(excellent))/807*100:.1f}%)")
print(f"  🔴 Need Attention: {len(missing) + len(low)} words ({(len(missing) + len(low))/807*100:.1f}%)")
print(f"  🎯 AI Generation Target: {len(missing)} words")
