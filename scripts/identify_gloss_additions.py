#!/usr/bin/env python3
import json
import re

# Load N5 verbs dataset
with open('/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset.json', 'r', encoding='utf-8') as f:
    n5_data = json.load(f)

# Create lookup by masu kanji
n5_by_masu_kanji = {}
for verb in n5_data['verbs']:
    masu_kanji = verb['forms']['masu']['kanji']
    dict_kanji = verb['lemma']['kanji']
    masu_kana = verb['forms']['masu']['kana']
    
    n5_by_masu_kanji[masu_kanji] = verb
    # Also index by kana for matching
    if masu_kana not in n5_by_masu_kanji:
        n5_by_masu_kanji[masu_kana] = verb

# Extract verbs from markdown with kanji and meanings
source_verbs = []

with open('/home/pankaj/bumble/lingomemory/docs/extracted-verbs-phrases.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    # Match: **verb** (romaji) - meaning
    match = re.match(r'\*\*([^*]+)\*\*\s*(?:[^-]*?)\s*-\s*(.+?)(?:\[|$)', line)
    if match:
        verb_part = match.group(1).strip()
        meaning = match.group(2).strip()
        
        # Skip headers and phrases
        if '##' in line or i >= 397:
            continue
            
        # Extract kanji if present
        kanji_in_line = re.findall(r'[一-龯]+', verb_part)
        
        # Remove markers
        verb_part = re.sub(r'（[^）]+）', '', verb_part)
        verb_part = re.sub(r'\([^)]+\)', '', verb_part)
        verb_part = re.sub(r'\[[^\]]+\]', '', verb_part)
        verb_part = verb_part.strip()
        
        # Split compound verbs
        parts = verb_part.split('/')
        for v in parts:
            v = v.strip()
            words = v.split()
            if words:
                kana = words[0]
                kanji = words[1] if len(words) > 1 else (kanji_in_line[0] if kanji_in_line else None)
                
                if kana and any(c for c in kana if '\u3040' <= c <= '\u309F' or '\u30A0' <= c <= '\u30FF'):
                    source_verbs.append({
                        'kana': kana,
                        'kanji': kanji,
                        'meaning': meaning
                    })

# Now compare and find matches
potential_additions = []

for source in source_verbs:
    source_kanji = source['kanji']
    source_kana = source['kana']
    source_meaning = source['meaning']
    
    # Try to find in N5 by kanji first
    n5_verb = None
    if source_kanji and source_kanji in n5_by_masu_kanji:
        n5_verb = n5_by_masu_kanji[source_kanji]
    elif source_kana in n5_by_masu_kanji:
        n5_verb = n5_by_masu_kanji[source_kana]
    
    if n5_verb:
        # Check if the kanji matches
        if source_kanji and (n5_verb['lemma']['kanji'] == source_kanji or n5_verb['forms']['masu']['kanji'] == source_kanji):
            # Same kanji! Check if meaning already exists
            existing_meanings = [n5_verb['meaning']['primary']] + n5_verb['meaning']['gloss']
            existing_text = ' '.join(existing_meanings).lower()
            
            # Parse source meaning into individual words
            source_words = re.findall(r'\b\w+\b', source_meaning.lower())
            
            # Check if any source words are missing
            new_meanings = []
            for word in source_words:
                if word not in existing_text and word not in ['to', 'a', 'an', 'the', 'or', 'and']:
                    new_meanings.append(word)
            
            if new_meanings:
                potential_additions.append({
                    'id': n5_verb['id'],
                    'kanji': source_kanji,
                    'kana': source_kana,
                    'n5_primary': n5_verb['meaning']['primary'],
                    'n5_gloss': n5_verb['meaning']['gloss'],
                    'source_meaning': source_meaning,
                    'new_words': new_meanings
                })

# Remove duplicates
seen = set()
unique_additions = []
for item in potential_additions:
    key = item['id']
    if key not in seen:
        seen.add(key)
        unique_additions.append(item)

print("=" * 100)
print("VERBS WHERE WE CAN ADD SOURCE MEANINGS TO N5 GLOSS")
print("=" * 100)
print(f"\nFound {len(unique_additions)} verbs where source provides additional context-specific meanings")
print("\n" + "=" * 100)

for i, verb in enumerate(unique_additions, 1):
    print(f"\n{i}. {verb['id']}: {verb['kanji']} ({verb['kana']})")
    print(f"   N5 Primary: {verb['n5_primary']}")
    print(f"   N5 Gloss:   {', '.join(verb['n5_gloss'])}")
    print(f"   Source:     {verb['source_meaning']}")
    print(f"   → Could add: {', '.join(set(verb['new_words']))}")

# Now create recommendations
print("\n" + "=" * 100)
print("SPECIFIC RECOMMENDATIONS FOR GLOSS ADDITIONS")
print("=" * 100)

recommendations = []

# Manual curation of good additions
good_additions = {
    '入ります': {
        'id': 'n5_v_0063',
        'current_gloss': ['enter', 'go into', 'join'],
        'add': 'take (a bath)',
        'reason': 'Natural English for 風呂に入る'
    },
    '入れます': {
        'id': 'n5_v_0093', 
        'current_gloss': ['put in', 'insert', 'let in', 'include'],
        'add': 'add',
        'reason': 'Natural English for 塩を入れる (cooking context)'
    },
    'かけます': {
        'id': 'n5_v_0101',
        'current_gloss': ['put on (glasses)', 'hang', 'make (phone call)', 'pour over'],
        'add': 'sprinkle',
        'reason': 'Natural English for 塩をかける'
    }
}

print("\nHIGH PRIORITY - Clear improvements:\n")
for kana, info in good_additions.items():
    print(f"{info['id']}: {kana}")
    print(f"   Current gloss: {info['current_gloss']}")
    print(f"   ✅ ADD: '{info['add']}'")
    print(f"   Reason: {info['reason']}\n")

