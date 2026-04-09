#!/usr/bin/env python3
import json
import re

# Load N5 verbs dataset
with open('/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset.json', 'r', encoding='utf-8') as f:
    n5_data = json.load(f)

# Extract all verb forms from N5 dataset
n5_verbs = {}
for verb in n5_data['verbs']:
    kana = verb['lemma']['kana']
    kanji = verb['lemma']['kanji']
    masu_kana = verb['forms']['masu']['kana']
    masu_kanji = verb['forms']['masu']['kanji']
    
    # Store both dictionary and masu forms
    n5_verbs[kana] = {
        'kanji': kanji,
        'masu_kana': masu_kana,
        'masu_kanji': masu_kanji,
        'id': verb['id']
    }
    
    # Also index by masu form
    if masu_kana not in n5_verbs:
        n5_verbs[masu_kana] = {
            'kanji': masu_kanji,
            'dict_kana': kana,
            'dict_kanji': kanji,
            'id': verb['id']
        }

print(f"N5 Dataset: {len(n5_data['verbs'])} verbs loaded")
print(f"Total forms indexed: {len(n5_verbs)}")

# Extract verbs from the markdown file
extracted_verbs = []

with open('/home/pankaj/bumble/lingomemory/docs/extracted-verbs-phrases.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
for i, line in enumerate(lines):
    match = re.match(r'\*\*([^*]+)\*\*', line)
    if match:
        verb_text = match.group(1).strip()
        
        if '##' in line:
            continue
            
        # Skip nouns section except verbs
        if i >= 365 and i <= 393:
            if 'きります' not in verb_text and 'けっこん' not in verb_text:
                continue
        
        # Skip phrases section
        if i >= 397 and i <= 406:
            continue
        
        # Skip workplace phrases and past tense
        if verb_text in ['おさきにしつれいします', 'おつかれさまでした', 'おねがいします', 
                         'わかりました', 'けっこん', 'コピーをおねがいします']:
            continue
            
        # Extract kanji if present
        kanji_match = re.search(r'[一-龯]+', verb_text)
        
        # Remove markers
        clean = re.sub(r'（[^）]+）', '', verb_text)
        clean = re.sub(r'\([^)]+\)', '', clean)
        clean = re.sub(r'\[[^\]]+\]', '', clean)
        clean = clean.strip()
        
        # Split compound verbs
        parts = clean.split('/')
        
        for v in parts:
            v = v.strip()
            
            # Separate kana and kanji
            parts_split = v.split()
            kana = parts_split[0] if parts_split else v
            kanji = parts_split[1] if len(parts_split) > 1 else None
            
            if kana and any(c for c in kana if '\u3040' <= c <= '\u309F' or '\u30A0' <= c <= '\u30FF'):
                extracted_verbs.append({
                    'kana': kana,
                    'kanji': kanji,
                    'original': v
                })

# Remove duplicates
unique_extracted = []
seen = set()
for v in extracted_verbs:
    key = v['kana']
    if key not in seen:
        seen.add(key)
        unique_extracted.append(v)

print(f"\nExtracted from source: {len(unique_extracted)} unique verb forms")

# Compare
missing_from_n5 = []
found_in_n5 = []

for verb in unique_extracted:
    kana = verb['kana']
    
    # Check if exists in N5 dataset (by any form)
    if kana in n5_verbs:
        found_in_n5.append({
            'kana': kana,
            'kanji': verb['kanji'],
            'n5_match': n5_verbs[kana]
        })
    else:
        # Check if it might be a conjugated form or variant
        # Remove ます ending and check dictionary form
        if kana.endswith('ます'):
            base = kana[:-2]  # Remove ます
            
            # Try to find base in dataset
            found = False
            for n5_kana, n5_data in n5_verbs.items():
                if n5_kana.startswith(base) or (isinstance(n5_data.get('dict_kana'), str) and n5_data['dict_kana'].startswith(base)):
                    found_in_n5.append({
                        'kana': kana,
                        'kanji': verb['kanji'],
                        'n5_match': n5_data,
                        'match_type': 'base_match'
                    })
                    found = True
                    break
            
            if not found:
                missing_from_n5.append(verb)
        else:
            missing_from_n5.append(verb)

print(f"\n{'='*70}")
print(f"COMPARISON RESULTS")
print(f"{'='*70}")
print(f"Found in N5 dataset: {len(found_in_n5)}")
print(f"Missing from N5 dataset: {len(missing_from_n5)}")

if missing_from_n5:
    print(f"\n{'='*70}")
    print(f"VERBS IN SOURCE BUT NOT IN N5 DATASET ({len(missing_from_n5)} verbs):")
    print(f"{'='*70}")
    for i, verb in enumerate(missing_from_n5, 1):
        kanji_str = f" ({verb['kanji']})" if verb['kanji'] else ""
        print(f"{i:3}. {verb['kana']}{kanji_str}")
else:
    print(f"\n✓ All extracted verbs are present in the N5 dataset!")

