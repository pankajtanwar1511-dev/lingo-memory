#!/usr/bin/env python3
"""
Filter sentences to ONLY N5 grammar patterns.
Removes N4+ grammar like conditionals, passive, causative, etc.
"""

import json
import re
from tqdm import tqdm

# Load extracted sentences
print("Loading 11,553 extracted sentences...")
with open('n5_807_vocab_sentences.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

sentences = data['sentences']
print(f"Loaded: {len(sentences)} sentences\n")

# N4+ Grammar patterns to REJECT
NON_N5_GRAMMAR = [
    r'(たら|ば|れば|なら)',  # Conditionals (N4)
    r'(られる|れる|させる|させられる)(?!ば)',  # Passive/Causative (N4+)
    r'(という|のが|のは)',  # Quotation/relative clause (N4)
    r'(んです|のです)',  # Explanatory (N4)
    r'(ので|のに)',  # Complex conjunctions (N4)
]

def has_n4_grammar(text: str) -> bool:
    """Check if sentence contains N4+ grammar."""
    for pattern in NON_N5_GRAMMAR:
        if re.search(pattern, text):
            return True
    return False

# Filter sentences
print("Filtering for N5 grammar only...")
n5_only = []
rejected = []

for sent in tqdm(sentences, desc="Checking grammar"):
    if not has_n4_grammar(sent['japanese']):
        n5_only.append(sent)
    else:
        rejected.append(sent)

# Save N5-only sentences
output = {
    'metadata': {
        'total_sentences': len(n5_only),
        'vocabulary_count': 807,
        'source': 'tatoeba',
        'criteria': '100% N5 vocabulary + N5 grammar only',
        'filters': {
            'length': '5-35 characters',
            'vocabulary': '100% from 807 N5 words',
            'grammar': 'N5 only (no conditionals, passive, causative, etc.)',
            'particles': 'allowed'
        }
    },
    'sentences': n5_only
}

with open('n5_807_vocab_n5_grammar_sentences.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

# Print results
print("\n" + "="*80)
print("N5 GRAMMAR FILTERING COMPLETE")
print("="*80)
print(f"\nResults:")
print(f"  Input: {len(sentences):,}")
print(f"  ✅ N5 grammar only: {len(n5_only):,} ({len(n5_only)/len(sentences)*100:.1f}%)")
print(f"  ❌ N4+ grammar: {len(rejected):,} ({len(rejected)/len(sentences)*100:.1f}%)")

import os
size = os.path.getsize('n5_807_vocab_n5_grammar_sentences.json') / 1024
print(f"\nOutput: n5_807_vocab_n5_grammar_sentences.json ({size:.1f} KB)")

# Show sample rejected
print(f"\nSample rejected sentences (N4+ grammar):")
for sent in rejected[:5]:
    print(f"  ❌ {sent['japanese']}")
    print(f"     {sent['english']}")

# Show sample accepted
print(f"\nSample accepted sentences (N5 grammar):")
for sent in n5_only[:5]:
    print(f"  ✅ {sent['japanese']}")
    print(f"     {sent['english']}")

