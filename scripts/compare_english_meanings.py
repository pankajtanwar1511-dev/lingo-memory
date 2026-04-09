#!/usr/bin/env python3
import json
import re

# Load N5 verbs dataset
with open('/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset.json', 'r', encoding='utf-8') as f:
    n5_data = json.load(f)

# Create lookup by kana (masu form)
n5_lookup = {}
for verb in n5_data['verbs']:
    masu_kana = verb['forms']['masu']['kana']
    masu_kanji = verb['forms']['masu']['kanji']
    
    n5_lookup[masu_kana] = {
        'id': verb['id'],
        'kanji': verb['lemma']['kanji'],
        'primary': verb['meaning']['primary'],
        'gloss': verb['meaning']['gloss'],
        'dict_form': verb['lemma']['kana']
    }

# Extract verbs from markdown with meanings
source_verbs = {}

with open('/home/pankaj/bumble/lingomemory/docs/extracted-verbs-phrases.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    # Match: **verb** (romaji) - meaning
    match = re.match(r'\*\*([^*]+)\*\*\s*(?:[^-]*?)\s*-\s*(.+?)(?:\[|$)', line)
    if match:
        verb_part = match.group(1).strip()
        meaning = match.group(2).strip()
        
        # Skip section headers
        if '##' in line or i >= 397:
            continue
            
        # Remove markers
        verb_part = re.sub(r'（[^）]+）', '', verb_part)
        verb_part = re.sub(r'\([^)]+\)', '', verb_part)
        verb_part = re.sub(r'\[[^\]]+\]', '', verb_part)
        verb_part = verb_part.strip()
        
        # Split compound verbs
        parts = verb_part.split('/')
        for v in parts:
            v = v.strip()
            # Get just kana (first part)
            words = v.split()
            if words:
                kana = words[0]
                if any(c for c in kana if '\u3040' <= c <= '\u309F' or '\u30A0' <= c <= '\u30FF'):
                    source_verbs[kana] = meaning

# Compare
common_verbs = []
different_meanings = []

for kana, source_meaning in source_verbs.items():
    if kana in n5_lookup:
        n5_verb = n5_lookup[kana]
        n5_primary = n5_verb['primary']
        n5_gloss = ', '.join(n5_verb['gloss']) if n5_verb['gloss'] else n5_primary
        
        common_verbs.append({
            'kana': kana,
            'kanji': n5_verb['kanji'],
            'n5_primary': n5_primary,
            'n5_gloss': n5_gloss,
            'source_meaning': source_meaning,
            'id': n5_verb['id']
        })
        
        # Check if meanings are different
        # Normalize for comparison
        source_lower = source_meaning.lower().strip()
        n5_primary_lower = n5_primary.lower().strip()
        n5_gloss_lower = n5_gloss.lower().strip()
        
        # Check if they're significantly different
        source_words = set(re.findall(r'\w+', source_lower))
        n5_primary_words = set(re.findall(r'\w+', n5_primary_lower))
        n5_gloss_words = set(re.findall(r'\w+', n5_gloss_lower))
        
        # If no overlap, they're different
        if not (source_words & n5_primary_words) and not (source_words & n5_gloss_words):
            different_meanings.append({
                'kana': kana,
                'kanji': n5_verb['kanji'],
                'n5_primary': n5_primary,
                'n5_gloss': n5_gloss,
                'source_meaning': source_meaning,
                'id': n5_verb['id']
            })

print("=" * 90)
print("ENGLISH MEANING COMPARISON - COMMON VERBS (85 verbs)")
print("=" * 90)
print(f"\nTotal common verbs: {len(common_verbs)}")
print(f"Verbs with DIFFERENT meanings: {len(different_meanings)}")
print(f"Verbs with SAME/SIMILAR meanings: {len(common_verbs) - len(different_meanings)}")

if different_meanings:
    print(f"\n" + "=" * 90)
    print(f"VERBS WITH DIFFERENT ENGLISH TRANSLATIONS ({len(different_meanings)} verbs)")
    print("=" * 90)
    print(f"\n{'No.':<4} {'Kana':<15} {'Kanji':<12} {'N5 Dataset':<25} {'Source Data':<25}")
    print("-" * 90)
    
    for i, verb in enumerate(different_meanings, 1):
        kana = verb['kana']
        kanji = verb['kanji']
        n5_meaning = verb['n5_primary']
        source_meaning = verb['source_meaning'][:24]  # Truncate for display
        
        print(f"{i:<4} {kana:<15} {kanji:<12} {n5_meaning:<25} {source_meaning:<25}")

# Now show detailed analysis
print(f"\n" + "=" * 90)
print("DETAILED COMPARISON (Verbs with different meanings)")
print("=" * 90)

for i, verb in enumerate(different_meanings, 1):
    print(f"\n{i}. {verb['kana']} ({verb['kanji']})")
    print(f"   N5 Dataset:")
    print(f"      Primary: {verb['n5_primary']}")
    print(f"      Gloss:   {verb['n5_gloss']}")
    print(f"   Source Data: {verb['source_meaning']}")
    print(f"   ID: {verb['id']}")

