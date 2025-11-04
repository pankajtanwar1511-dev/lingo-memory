#!/usr/bin/env python3
"""
Phase 0: Diagnostic Analysis
Analyze v2 Enhanced dataset (9,419 sentences) to understand current state

Purpose:
- Check formality distribution (CRITICAL for filtering strategy)
- Check vocabulary coverage
- Check sentence length distribution
- Check for any existing metadata
- Generate comprehensive diagnostic report

Output:
- Console report with key statistics
- JSON report: reports/phase0_diagnostic_report.json
- Sample output: reports/phase0_sample_sentences.json
"""

import json
import os
from collections import Counter, defaultdict
from statistics import mean, stdev
from pathlib import Path

# Paths (all relative to N5_807_data_set_details/)
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
REPORTS_DIR = BASE_DIR / "reports"

SENTENCES_FILE = DATA_DIR / "n5_807_vocab_n5_grammar_sentences_v2_enhanced.json"
VOCAB_FILE = DATA_DIR / "N5_vocab_dataset_final.json"
REPORT_FILE = REPORTS_DIR / "phase0_diagnostic_report.json"
SAMPLE_FILE = REPORTS_DIR / "phase0_sample_sentences.json"

# Ensure reports directory exists
REPORTS_DIR.mkdir(exist_ok=True)

print("="*80)
print("PHASE 0: DIAGNOSTIC ANALYSIS")
print("="*80)
print()

# ============================================================================
# Load Data
# ============================================================================

print("Loading sentences data...")
with open(SENTENCES_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Handle both formats: direct list or {"sentences": [...]}
if isinstance(data, dict) and 'sentences' in data:
    sentences = data['sentences']
    metadata = data.get('metadata', {})
else:
    sentences = data
    metadata = {}

print(f"✓ Loaded {len(sentences):,} sentences")
print()

print("Loading vocabulary data...")
with open(VOCAB_FILE, 'r', encoding='utf-8') as f:
    vocab_data = json.load(f)

# Build vocabulary word set (both kanji and kana forms)
vocab_words = set()
if isinstance(vocab_data, list):
    for entry in vocab_data:
        if 'kanji' in entry and entry['kanji']:
            vocab_words.add(entry['kanji'])
        if 'kana' in entry and entry['kana']:
            vocab_words.add(entry['kana'])
elif isinstance(vocab_data, dict) and 'vocabulary' in vocab_data:
    for entry in vocab_data['vocabulary']:
        if 'kanji' in entry and entry['kanji']:
            vocab_words.add(entry['kanji'])
        if 'kana' in entry and entry['kana']:
            vocab_words.add(entry['kana'])

print(f"✓ Loaded {len(vocab_words):,} vocabulary forms")
print()

# ============================================================================
# Simple Formality Detector (Rule-based)
# ============================================================================

def detect_formality(sentence):
    """Simple rule-based formality detection"""
    s = sentence.strip()

    # Check last 10 characters for ending patterns
    end = s[-10:] if len(s) > 10 else s

    # Polite patterns (check BEFORE casual to avoid over-matching)
    polite_patterns = [
        "ですか", "ますか", "でしょうか",
        "でした", "ました",
        "です", "ます",
        "てください", "ください"
    ]

    for pattern in polite_patterns:
        if end.endswith(pattern):
            return "formal"

    # Casual patterns
    casual_patterns = [
        "だろう", "だよ", "だね", "だった", "だ。",
        "よね", "よ。", "ね。", "の？", "のか", "かな"
    ]

    for pattern in casual_patterns:
        if pattern in end:
            return "casual"

    # Fallback: check anywhere in sentence
    if "です" in s or "ます" in s:
        return "formal"

    # Default to casual for plain forms
    return "casual"

# ============================================================================
# Simple Pattern Detector (for diagnostic only)
# ============================================================================

DIAGNOSTIC_PATTERNS = {
    "desu_masu": ["です", "ます", "でした", "ました"],
    "da": ["だ。", "だった", "だろう"],
    "nai": ["ない"],
    "ta": ["た。", "た」", "ました"],
    "teiru": ["ている", "ています"],
    "kudasai": ["ください"],
    "ka_question": ["か？", "か?", "ですか", "ますか"],
    "particle_wa": ["は"],
    "particle_wo": ["を"],
    "particle_ni": ["に"],
}

def detect_simple_patterns(sentence):
    """Detect basic patterns for diagnostic"""
    found = []
    for pattern_name, markers in DIAGNOSTIC_PATTERNS.items():
        for marker in markers:
            if marker in sentence:
                found.append(pattern_name)
                break
    return found

# ============================================================================
# Analyze Sentences
# ============================================================================

print("Analyzing sentences...")

stats = {
    'total': len(sentences),
    'formal_count': 0,
    'casual_count': 0,
    'lengths': [],
    'kanji_counts': [],
    'pattern_counter': Counter(),
    'vocab_counter': Counter(),
    'has_metadata': {
        'formality': 0,
        'difficulty': 0,
        'kana': 0,
        'grammar_patterns': 0,
    },
    'sample_sentences': [],
}

for i, sentence in enumerate(sentences):
    # Get Japanese text
    jp = sentence.get('japanese', '')
    if not jp:
        continue

    # Check existing metadata
    if 'formality' in sentence and sentence['formality']:
        stats['has_metadata']['formality'] += 1
        formality = sentence['formality']
    else:
        formality = detect_formality(jp)

    if formality == 'formal':
        stats['formal_count'] += 1
    else:
        stats['casual_count'] += 1

    # Check other metadata
    if 'difficulty' in sentence and sentence['difficulty']:
        stats['has_metadata']['difficulty'] += 1
    if 'kana' in sentence and sentence['kana']:
        stats['has_metadata']['kana'] += 1
    if 'grammar_patterns' in sentence and sentence['grammar_patterns']:
        stats['has_metadata']['grammar_patterns'] += 1

    # Length analysis
    length = len(jp)
    stats['lengths'].append(length)

    # Kanji count
    kanji_count = sum(1 for ch in jp if '\u4e00' <= ch <= '\u9faf')
    stats['kanji_counts'].append(kanji_count)

    # Pattern detection
    patterns = detect_simple_patterns(jp)
    for pattern in patterns:
        stats['pattern_counter'][pattern] += 1

    # Vocabulary coverage (simple substring matching)
    vocab_hits = [word for word in vocab_words if word in jp]
    for word in vocab_hits:
        stats['vocab_counter'][word] += 1

    # Save first 50 as samples
    if i < 50:
        stats['sample_sentences'].append({
            'id': sentence.get('id', f'idx_{i}'),
            'japanese': jp,
            'english': sentence.get('english', ''),
            'formality': formality,
            'length': length,
            'kanji_count': kanji_count,
            'patterns': patterns,
            'vocab_hits': vocab_hits[:5]  # First 5 words
        })

print(f"✓ Analysis complete")
print()

# ============================================================================
# Calculate Statistics
# ============================================================================

total = stats['total']
formal_pct = (stats['formal_count'] / total * 100) if total > 0 else 0
casual_pct = (stats['casual_count'] / total * 100) if total > 0 else 0

length_mean = mean(stats['lengths']) if stats['lengths'] else 0
length_std = stdev(stats['lengths']) if len(stats['lengths']) > 1 else 0
length_min = min(stats['lengths']) if stats['lengths'] else 0
length_max = max(stats['lengths']) if stats['lengths'] else 0

kanji_mean = mean(stats['kanji_counts']) if stats['kanji_counts'] else 0
kanji_std = stdev(stats['kanji_counts']) if len(stats['kanji_counts']) > 1 else 0

# Vocabulary coverage
vocab_with_0_examples = len([w for w in vocab_words if stats['vocab_counter'][w] == 0])
vocab_with_1_example = len([w for w in vocab_words if stats['vocab_counter'][w] == 1])
vocab_with_2plus = len([w for w in vocab_words if stats['vocab_counter'][w] >= 2])

# ============================================================================
# Generate Report
# ============================================================================

report = {
    'phase': 'Phase 0 - Diagnostic',
    'date': '2025-11-03',
    'input_file': str(SENTENCES_FILE),

    'sentence_statistics': {
        'total_sentences': total,
        'formal_count': stats['formal_count'],
        'casual_count': stats['casual_count'],
        'formal_percent': round(formal_pct, 2),
        'casual_percent': round(casual_pct, 2),
    },

    'length_statistics': {
        'mean': round(length_mean, 2),
        'std': round(length_std, 2),
        'min': length_min,
        'max': length_max,
    },

    'kanji_statistics': {
        'mean': round(kanji_mean, 2),
        'std': round(kanji_std, 2),
    },

    'existing_metadata': {
        'formality': stats['has_metadata']['formality'],
        'difficulty': stats['has_metadata']['difficulty'],
        'kana': stats['has_metadata']['kana'],
        'grammar_patterns': stats['has_metadata']['grammar_patterns'],
    },

    'pattern_distribution': dict(stats['pattern_counter'].most_common(20)),

    'vocabulary_coverage': {
        'total_vocab_words': len(vocab_words),
        'words_with_0_examples': vocab_with_0_examples,
        'words_with_1_example': vocab_with_1_example,
        'words_with_2plus_examples': vocab_with_2plus,
        'top_30_words': dict(stats['vocab_counter'].most_common(30)),
    },

    'recommendations': []
}

# Add recommendations
if formal_pct < 40:
    report['recommendations'].append({
        'priority': 'HIGH',
        'issue': f'Low formal percentage ({formal_pct:.1f}%)',
        'recommendation': 'Will need to prioritize formal sentences in filtering. Target 85% in CORE tier may require smaller core or AI generation.'
    })
elif formal_pct >= 40 and formal_pct < 50:
    report['recommendations'].append({
        'priority': 'MEDIUM',
        'issue': f'Moderate formal percentage ({formal_pct:.1f}%)',
        'recommendation': f'Should have ~{int(total * 0.4)} formal sentences. Can likely build 3,000-4,000 CORE tier with 85%+ formal.'
    })
else:
    report['recommendations'].append({
        'priority': 'LOW',
        'issue': f'Good formal percentage ({formal_pct:.1f}%)',
        'recommendation': f'Have ~{stats["formal_count"]} formal sentences. Excellent for 85% formal CORE tier!'
    })

if vocab_with_0_examples > 50:
    report['recommendations'].append({
        'priority': 'HIGH',
        'issue': f'{vocab_with_0_examples} words have no examples',
        'recommendation': 'May need AI generation for missing vocabulary words'
    })

# ============================================================================
# Save Reports
# ============================================================================

print("Saving reports...")

# Save full report
with open(REPORT_FILE, 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)
print(f"✓ Saved: {REPORT_FILE}")

# Save sample sentences
with open(SAMPLE_FILE, 'w', encoding='utf-8') as f:
    json.dump(stats['sample_sentences'], f, ensure_ascii=False, indent=2)
print(f"✓ Saved: {SAMPLE_FILE}")
print()

# ============================================================================
# Print Summary
# ============================================================================

print("="*80)
print("PHASE 0 DIAGNOSTIC RESULTS")
print("="*80)
print()

print("📊 SENTENCE STATISTICS:")
print(f"  Total sentences: {total:,}")
print(f"  Formal (polite): {stats['formal_count']:,} ({formal_pct:.1f}%)")
print(f"  Casual (plain):  {stats['casual_count']:,} ({casual_pct:.1f}%)")
print()

print("📏 LENGTH STATISTICS:")
print(f"  Mean length: {length_mean:.1f} characters")
print(f"  Std deviation: {length_std:.1f}")
print(f"  Range: {length_min}-{length_max} characters")
print()

print("📝 KANJI STATISTICS:")
print(f"  Mean kanji per sentence: {kanji_mean:.2f}")
print(f"  Std deviation: {kanji_std:.2f}")
print()

print("🔍 EXISTING METADATA:")
print(f"  Formality tags: {stats['has_metadata']['formality']:,}")
print(f"  Difficulty scores: {stats['has_metadata']['difficulty']:,}")
print(f"  Kana readings: {stats['has_metadata']['kana']:,}")
print(f"  Grammar patterns: {stats['has_metadata']['grammar_patterns']:,}")
print()

print("📚 VOCABULARY COVERAGE:")
print(f"  Total vocab words: {len(vocab_words):,}")
print(f"  Words with 0 examples: {vocab_with_0_examples}")
print(f"  Words with 1 example: {vocab_with_1_example}")
print(f"  Words with 2+ examples: {vocab_with_2plus}")
print()

print("🎯 TOP 5 PATTERNS:")
for pattern, count in stats['pattern_counter'].most_common(5):
    pct = (count / total * 100) if total > 0 else 0
    print(f"  {pattern}: {count:,} ({pct:.1f}%)")
print()

print("💡 RECOMMENDATIONS:")
for rec in report['recommendations']:
    priority = rec['priority']
    symbol = "🔴" if priority == "HIGH" else "🟡" if priority == "MEDIUM" else "🟢"
    print(f"  {symbol} [{priority}] {rec['issue']}")
    print(f"     → {rec['recommendation']}")
print()

print("="*80)
print("PHASE 0 COMPLETE - Ready for Phase 1")
print("="*80)
print()
print(f"Full report: {REPORT_FILE}")
print(f"Samples: {SAMPLE_FILE}")
