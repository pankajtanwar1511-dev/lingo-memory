#!/usr/bin/env python3
import json
import re

# Load N5 verbs dataset
with open('/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset.json', 'r', encoding='utf-8') as f:
    n5_data = json.load(f)

# Create comprehensive lookup
n5_lookup = {}
for verb in n5_data['verbs']:
    masu_kana = verb['forms']['masu']['kana']
    dict_kanji = verb['lemma']['kanji']
    masu_kanji = verb['forms']['masu']['kanji']
    
    key = masu_kana
    if key not in n5_lookup:
        n5_lookup[key] = []
    n5_lookup[key].append(verb)

# Parse source data more carefully
source_meanings = {}

with open('/home/pankaj/bumble/lingomemory/docs/extracted-verbs-phrases.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match verb entries
lines = content.split('\n')
for i, line in enumerate(lines):
    if line.startswith('**') and '**' in line[2:]:
        # Extract verb and meaning
        match = re.match(r'\*\*([^*]+)\*\*\s*(.+?)\s*-\s*(.+?)(?:\[|$)', line)
        if match:
            verb_part = match.group(1).strip()
            romaji_part = match.group(2).strip() if match.group(2) else ''
            meaning = match.group(3).strip()
            
            # Extract kanji and kana
            # Remove context markers
            clean_verb = re.sub(r'[（(][^)）]+[)）]', '', verb_part)
            clean_verb = re.sub(r'\[[^\]]+\]', '', clean_verb)
            clean_verb = clean_verb.strip()
            
            # Split if compound
            parts = clean_verb.split('/')
            for part in parts:
                part = part.strip()
                words = part.split()
                if words:
                    kana = words[0]
                    kanji = words[1] if len(words) > 1 else None
                    
                    if kana not in source_meanings:
                        source_meanings[kana] = []
                    source_meanings[kana].append({
                        'kanji': kanji,
                        'meaning': meaning,
                        'original': verb_part
                    })

# Now compare
print("=" * 100)
print("COMPREHENSIVE ANALYSIS: Adding Source Meanings to N5 Dataset")
print("=" * 100)

gloss_additions = []

for kana, source_list in source_meanings.items():
    if kana in n5_lookup:
        n5_verbs = n5_lookup[kana]
        
        for source in source_list:
            source_kanji = source['kanji']
            source_meaning = source['meaning']
            
            # Try to match kanji
            for n5_verb in n5_verbs:
                n5_dict_kanji = n5_verb['lemma']['kanji']
                n5_masu_kanji = n5_verb['forms']['masu']['kanji']
                
                # Check if kanji matches (or if source has no kanji and kana matches)
                kanji_match = False
                if source_kanji:
                    if source_kanji == n5_dict_kanji or source_kanji == n5_masu_kanji:
                        kanji_match = True
                else:
                    # No kanji in source, match by kana only (could be katakana verb)
                    if kana == n5_verb['forms']['masu']['kana']:
                        kanji_match = True
                
                if kanji_match:
                    # Check if meaning is new
                    n5_primary = n5_verb['meaning']['primary'].lower()
                    n5_gloss = [g.lower() for g in n5_verb['meaning']['gloss']]
                    all_n5_meanings = ' '.join([n5_primary] + n5_gloss)
                    
                    source_clean = source_meaning.lower().strip()
                    
                    # Check if source meaning adds new information
                    # Parse out key words from source
                    source_key_words = re.findall(r'\b[a-z]+\b', source_clean)
                    
                    new_info = False
                    new_terms = []
                    
                    # Specific checks for known good additions
                    if kana == 'はいります' and 'take' in source_clean and 'bath' not in all_n5_meanings:
                        new_info = True
                        new_terms.append('take (a bath)')
                    elif kana == 'いれます' and 'add' in source_clean and 'add' not in all_n5_meanings:
                        new_info = True
                        new_terms.append('add')
                    elif kana == 'かけます' and 'sprinkle' in source_clean and 'sprinkle' not in all_n5_meanings:
                        new_info = True
                        new_terms.append('sprinkle')
                    elif kana == 'します' and 'do' in source_clean:
                        # Check specific compound forms
                        if 'photocopy' in source_clean and 'photocopy' not in all_n5_meanings:
                            new_info = True
                            new_terms.append('photocopy')
                    
                    if new_info:
                        gloss_additions.append({
                            'id': n5_verb['id'],
                            'kana': kana,
                            'kanji': n5_dict_kanji,
                            'n5_primary': n5_verb['meaning']['primary'],
                            'n5_gloss': n5_verb['meaning']['gloss'],
                            'source_meaning': source_meaning,
                            'suggested_additions': new_terms
                        })

# Remove duplicates
seen = set()
unique = []
for item in gloss_additions:
    key = item['id']
    if key not in seen:
        seen.add(key)
        unique.append(item)

print(f"\nFound {len(unique)} verbs where we can add context-specific meanings from source\n")
print("=" * 100)
print("RECOMMENDED GLOSS ADDITIONS")
print("=" * 100)

for i, verb in enumerate(unique, 1):
    print(f"\n{i}. {verb['id']}: {verb['kanji']} ({verb['kana']})")
    print(f"   Current primary: {verb['n5_primary']}")
    print(f"   Current gloss:   [{', '.join(verb['n5_gloss'])}]")
    print(f"   Source context:  {verb['source_meaning']}")
    print(f"   ✅ ADD TO GLOSS: {verb['suggested_additions']}")
    print(f"   New gloss would be: [{', '.join(verb['n5_gloss'] + verb['suggested_additions'])}]")

# Summary
print("\n" + "=" * 100)
print("SUMMARY OF RECOMMENDATIONS")
print("=" * 100)
print(f"\nTotal verbs to update: {len(unique)}")
print("\nChanges:")
for verb in unique:
    print(f"  • {verb['id']}: Add {verb['suggested_additions']}")

