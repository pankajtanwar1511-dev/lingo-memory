#!/usr/bin/env python3
"""
ENHANCED N5 Grammar Filter v2.0

Filters sentences to ONLY N5 grammar patterns with comprehensive N4+ detection.

Based on AI validation feedback from ChatGPT-4 and Claude AI:
- Expanded from 5 to 15 grammar patterns
- More precise passive/causative detection
- Added missing N4+ patterns (てある, ておく, てしまう, etc.)

Changes from v1:
- Added 10 new N4+ patterns
- Fixed ている false positive risk
- More precise regex patterns
- Better documentation
"""

import json
import re
from tqdm import tqdm

# Load extracted sentences
print("Loading vocabulary-matched sentences...")
with open('n5_807_vocab_sentences.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

sentences = data['sentences']
print(f"Loaded: {len(sentences)} sentences\n")

# ============================================================================
# ENHANCED N4+ GRAMMAR PATTERNS
# ============================================================================
# Based on JLPT grammar guides and AI validation feedback

NON_N5_GRAMMAR = [
    # ===== ORIGINAL PATTERNS (5) =====

    # Conditionals (N4)
    r'(たら|ば|れば|なら)(?![ばう])',  # Added negative lookahead for safety

    # Passive/Causative (N4+) - ENHANCED for precision
    # Match passive endings more precisely to avoid catching ている
    r'[あかがさたなばまらわ]れる',      # Passive: 食べられる, 見られる
    r'[いきぎしちにびみり]られる',     # Ichidan passive: 見られる
    r'させる|させられる',               # Causative: 食べさせる, 食べさせられる

    # Quotations and relative clauses (N4)
    r'という(?!名前|人|もの)',         # という (refined - allow fixed phrases)
    r'(のが|のは)(?!好き|嫌い)',       # のが/のは (allow with 好き/嫌い per AI feedback)

    # Explanatory のだ pattern (N4)
    r'(んです|のです|んだ|のだ)',

    # Complex conjunctions (N4)
    r'(ので|のに)(?!ついて)',          # Allow 〜について (N5)

    # ===== NEW PATTERNS FROM AI FEEDBACK (10) =====

    # Experience form (N4)
    r'たことがある',

    # Listing actions (N4)
    r'たり.{1,10}たり',                # 食べたり飲んだり

    # Simultaneous action (N4)
    r'ながら',

    # Purpose (N4)
    r'(ように|ために)(?!なる)',         # Allow 〜ようになる (borderline N5/N4)

    # Permission/Prohibition (N4)
    r'(てもいい|てはいけない|ちゃいけない)',

    # Excessive (N4)
    r'(すぎる|すぎます|すぎた)',

    # Resultant state (N4)
    r'てある',

    # Preparatory action (N4)
    r'ておく(?!れる)',                  # 食べておく

    # Completion/Regret (N4)
    r'てしまう|ちゃう',

    # Appearance/Hearsay/Expectation (N4)
    r'(ようだ|ような|みたいだ|みたいな)',  # Appearance
    r'そうだ(?!です)',                   # Hearsay (not そうです which is N5)
    r'(はずだ|はずです)',                # Expectation
    r'らしい',                           # Seems like

    # Potential form variations (N4)
    r'ことができる',                     # Potential (borderline, but safer to exclude)
]

# ============================================================================
# GRAMMAR DETECTION FUNCTION
# ============================================================================

def has_n4_grammar(text: str) -> bool:
    """
    Check if sentence contains N4+ grammar patterns.

    Args:
        text: Japanese sentence to check

    Returns:
        True if N4+ grammar found (should be rejected)

    Examples:
        >>> has_n4_grammar("今日は暑いです。")
        False  # N5 grammar

        >>> has_n4_grammar("暑かったら、水を飲みます。")
        True  # たら conditional (N4)

        >>> has_n4_grammar("食べている。")
        False  # ている is N5 (progressive)

        >>> has_n4_grammar("食べられる。")
        True  # られる is N4 (passive/potential)
    """
    for pattern in NON_N5_GRAMMAR:
        if re.search(pattern, text):
            return True
    return False

# ============================================================================
# FILTER SENTENCES
# ============================================================================

print("Filtering for N5 grammar only (enhanced patterns)...")
n5_only = []
rejected = []
rejection_reasons = {}

for sent in tqdm(sentences, desc="Checking grammar"):
    if not has_n4_grammar(sent['japanese']):
        n5_only.append(sent)
    else:
        rejected.append(sent)

        # Track which pattern caused rejection (for analysis)
        for pattern in NON_N5_GRAMMAR:
            if re.search(pattern, sent['japanese']):
                reason = pattern[:20] + "..." if len(pattern) > 20 else pattern
                rejection_reasons[reason] = rejection_reasons.get(reason, 0) + 1
                break

# ============================================================================
# SAVE N5-ONLY SENTENCES (ENHANCED VERSION)
# ============================================================================

output = {
    'metadata': {
        'version': '2.0',
        'description': 'Enhanced N5 grammar filtering with 15 patterns',
        'total_sentences': len(n5_only),
        'vocabulary_count': 807,
        'source': 'tatoeba',
        'criteria': '100% N5 vocabulary + N5 grammar only (enhanced)',
        'grammar_patterns': len(NON_N5_GRAMMAR),
        'improvements': [
            'Expanded from 5 to 15 grammar patterns',
            'Fixed ている false rejection risk',
            'Added てある, ておく, てしまう patterns',
            'Added たことがある, ながら patterns',
            'Added ように, ために, てもいい patterns',
            'More precise passive/causative detection'
        ],
        'filters': {
            'length': '5-35 characters',
            'vocabulary': '100% from 807 N5 words',
            'grammar': 'N5 only - comprehensive N4+ rejection (15 patterns)',
            'particles': 'allowed'
        }
    },
    'sentences': n5_only
}

with open('n5_807_vocab_n5_grammar_sentences_v2_enhanced.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

# ============================================================================
# PRINT RESULTS
# ============================================================================

print("\n" + "="*80)
print("ENHANCED N5 GRAMMAR FILTERING COMPLETE (v2.0)")
print("="*80)
print(f"\nResults:")
print(f"  Input: {len(sentences):,}")
print(f"  ✅ N5 grammar only: {len(n5_only):,} ({len(n5_only)/len(sentences)*100:.1f}%)")
print(f"  ❌ N4+ grammar: {len(rejected):,} ({len(rejected)/len(sentences)*100:.1f}%)")

print(f"\nComparison to v1:")
print(f"  v1 output: 10,142 sentences (87.8% pass rate)")
print(f"  v2 output: {len(n5_only):,} sentences ({len(n5_only)/len(sentences)*100:.1f}% pass rate)")
print(f"  Difference: {10142 - len(n5_only):,} sentences ({(10142 - len(n5_only))/10142*100:.1f}% stricter)")

import os
size = os.path.getsize('n5_807_vocab_n5_grammar_sentences_v2_enhanced.json') / 1024
print(f"\nOutput: n5_807_vocab_n5_grammar_sentences_v2_enhanced.json ({size:.1f} KB)")

# Top rejection reasons
print(f"\nTop 10 rejection patterns:")
sorted_reasons = sorted(rejection_reasons.items(), key=lambda x: x[1], reverse=True)
for i, (pattern, count) in enumerate(sorted_reasons[:10], 1):
    print(f"  {i}. {pattern}: {count:,} sentences")

# Show sample rejected (different from v1)
print(f"\nSample newly rejected sentences (caught by enhanced patterns):")
sample_count = 0
for sent in rejected[:20]:
    # Check if this would have passed v1 (basic check)
    v1_patterns = [
        r'(たら|ば|れば|なら)',
        r'(られる|れる|させる|させられる)',
        r'(という|のが|のは)',
        r'(んです|のです)',
        r'(ので|のに)',
    ]

    would_pass_v1 = True
    for pattern in v1_patterns:
        if re.search(pattern, sent['japanese']):
            would_pass_v1 = False
            break

    if would_pass_v1 and sample_count < 5:
        print(f"  ❌ {sent['japanese']}")
        print(f"     {sent['english']}")
        sample_count += 1

# Show sample accepted
print(f"\nSample accepted sentences (N5 grammar confirmed):")
for sent in n5_only[:5]:
    print(f"  ✅ {sent['japanese']}")
    print(f"     {sent['english']}")

print("\n" + "="*80)
print("ENHANCED VERSION COMPLETE - Compare with v1 results")
print("="*80)
