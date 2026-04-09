#!/usr/bin/env python3
import re

# Map of verbs with their kanji and meanings from the markdown
verb_details = {}

with open('/home/pankaj/bumble/lingomemory/docs/extracted-verbs-phrases.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Parse each verb entry
pattern = r'\*\*([^*]+)\*\*\s*(?:\([^)]+\))?\s*-\s*([^[\n]+)'
matches = re.findall(pattern, content)

for match in matches:
    verb_part = match[0].strip()
    meaning = match[1].strip()
    
    # Remove context markers
    verb_part = re.sub(r'（[^）]+）', '', verb_part)
    verb_part = re.sub(r'\([^)]+\)', '', verb_part)
    verb_part = re.sub(r'\[[^\]]+\]', '', verb_part)
    verb_part = verb_part.strip()
    
    # Split if compound
    parts = verb_part.split('/')
    for v in parts:
        v = v.strip()
        # Split kana and kanji
        words = v.split()
        if words:
            kana = words[0]
            kanji = words[1] if len(words) > 1 else None
            verb_details[kana] = {
                'kanji': kanji if kanji else kana,
                'meaning': meaning
            }

# Missing verbs list
missing = [
    'ちがいます', 'しごとします', 'はじまります', 'もどります', 'ドライブします',
    'はっぴょうします', 'こたえます', 'たすかります', 'ならべます', 'けしょうします',
    'きめます', 'わらいます', 'なきます', 'けんかします', 'はしります',
    'おどります', 'きゅうけいします', 'しにます', 'りょこうします', 'うかがいます',
    'りょうりします', 'ゆでます', 'わきます', 'おくれます', 'ほします',
    'さきます', 'まもります'
]

print("=" * 80)
print("VERBS IN SOURCE BUT NOT IN N5 DATASET (27 verbs)")
print("=" * 80)
print(f"\n{'No.':<5} {'Kana':<20} {'Kanji':<15} {'Meaning':<30}")
print("-" * 80)

for i, kana in enumerate(missing, 1):
    details = verb_details.get(kana, {'kanji': '?', 'meaning': '?'})
    kanji = details['kanji']
    meaning = details['meaning']
    print(f"{i:<5} {kana:<20} {kanji:<15} {meaning:<30}")

print("\n" + "=" * 80)
print("BREAKDOWN BY CATEGORY:")
print("=" * 80)

categories = {
    'Basic verbs': ['ちがいます', 'しごとします', 'はじまります', 'もどります'],
    'Communication': ['はっぴょうします', 'こたえます'],
    'Work/Office': ['きゅうけいします', 'おくれます'],
    'Emotional/Physical': ['わらいます', 'なきます', 'けんかします', 'はしります', 'おどります', 'しにます'],
    'Helpful/Support': ['たすかります', 'まもります'],
    'Arrangement': ['ならべます'],
    'Personal care': ['けしょうします'],
    'Decision/Planning': ['きめます', 'りょこうします'],
    'Visiting': ['うかがいます'],
    'Cooking': ['りょうりします', 'ゆでます', 'わきます'],
    'Household': ['ほします'],
    'Nature': ['さきます'],
    'Transportation': ['ドライブします']
}

for category, verbs in categories.items():
    print(f"\n{category} ({len(verbs)}):")
    for v in verbs:
        details = verb_details.get(v, {'kanji': '?', 'meaning': '?'})
        print(f"  - {v} ({details['kanji']}) - {details['meaning']}")

print("\n" + "=" * 80)
print("NOTE: These 27 verbs should be considered for addition to the N5 dataset")
print("=" * 80)

