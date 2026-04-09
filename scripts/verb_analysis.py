#!/usr/bin/env python3
import re

verbs = []
phrases = []
duplicates = []

with open('/home/pankaj/bumble/lingomemory/docs/extracted-verbs-phrases.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
for i, line in enumerate(lines):
    match = re.match(r'\*\*([^*]+)\*\*', line)
    if match:
        verb_text = match.group(1).strip()
        
        if '##' in line:
            continue
            
        # Skip nouns section entries except verbs in Actions subsection
        if i >= 365 and i <= 393:
            if 'きります' not in verb_text and 'けっこん' not in verb_text:
                continue
        
        # Skip pure phrases section
        if i >= 397 and i <= 406:
            continue
            
        # Identify phrases (multi-word expressions)
        if 'を' in verb_text or 'に' in verb_text or len(verb_text) > 15:
            # Clean it
            clean = re.sub(r'（[^）]+）', '', verb_text)
            clean = re.sub(r'\([^)]+\)', '', clean)
            clean = re.sub(r'\[[^\]]+\]', '', clean)
            clean = clean.strip()
            if 'を' in clean or len(clean) > 15:
                phrases.append(clean)
                continue
        
        # Remove markers
        verb_text = re.sub(r'（[^）]+）', '', verb_text)
        verb_text = re.sub(r'\([^)]+\)', '', verb_text)
        verb_text = re.sub(r'\[[^\]]+\]', '', verb_text)
        verb_text = verb_text.strip()
        
        # Split compound verbs
        parts = verb_text.split('/')
        
        for v in parts:
            v = v.strip()
            v = re.split(r'\s+[一-龯]+', v)[0].strip()
            
            if v and any(c for c in v if '\u3040' <= c <= '\u309F' or '\u30A0' <= c <= '\u30FF' or '\u4E00' <= c <= '\u9FFF'):
                verbs.append(v)

# Count unique
unique_verbs = list(dict.fromkeys(verbs))  # Preserves order
unique_phrases = list(dict.fromkeys(phrases))

# Identify actual verb forms vs phrases/expressions
actual_verbs = []
expression_phrases = []
past_forms = []
nouns = []

for v in unique_verbs:
    if v == 'わかりました':
        past_forms.append(v)
    elif v == 'けっこん':
        nouns.append(v)
    elif 'を' in v or v in ['おさきにしつれいします', 'おつかれさまでした', 'おねがいします', 'コピーをおねがいします']:
        expression_phrases.append(v)
    else:
        actual_verbs.append(v)

print("=" * 70)
print("VERB ANALYSIS SUMMARY")
print("=" * 70)
print(f"\nTotal entries extracted: {len(verbs)}")
print(f"Unique verb forms: {len(unique_verbs)}")
print(f"\nBreakdown:")
print(f"  - Actual verbs (masu-form): {len(actual_verbs)}")
print(f"  - Workplace phrases/expressions: {len(expression_phrases)}")
print(f"  - Past tense forms: {len(past_forms)}")
print(f"  - Nouns: {len(nouns)}")

print(f"\n{'='*70}")
print(f"FINAL COUNT: {len(actual_verbs)} true unique verbs")
print(f"{'='*70}")

print(f"\nWorkplace phrases/expressions ({len(expression_phrases)}):")
for p in expression_phrases:
    print(f"  - {p}")

if past_forms:
    print(f"\nPast tense forms ({len(past_forms)}):")
    for p in past_forms:
        print(f"  - {p}")

if nouns:
    print(f"\nNouns ({len(nouns)}):")
    for n in nouns:
        print(f"  - {n}")

# Check for homonyms (same hiragana, different meanings)
print(f"\n{'='*70}")
print("HOMONYMS (same form, different meanings):")
print(f"{'='*70}")
homonym_groups = {
    'きます': ['来ます (come)', '着ます (wear)'],
    'おきます': ['起きます (wake up)', '置きます (put/place)'],
    'かいます': ['買います (buy)', '飼います (keep pet)'],
    'とります': ['取ります (take/pass)', '撮ります (take photo)', '採ります (pick)'],
    'かけます': ['掛けます (make call/hang)', '掛けます (put on glasses)', 'かけます (sprinkle)'],
    'はいります': ['入ります (enter)', '入ります (take bath)'],
    'とめます': ['止めます (stop)', '停めます (park)', '留めます (fasten/staple)']
}

for hiragana, meanings in homonym_groups.items():
    if hiragana in actual_verbs:
        print(f"\n{hiragana}:")
        for meaning in meanings:
            print(f"  - {meaning}")

print(f"\n{'='*70}")
print(f"Note: The N5 verb dataset file shows 140 verbs.")
print(f"This extracted list has {len(actual_verbs)} unique verb forms.")
print(f"The difference may be due to:")
print(f"  - Homonyms counted once here but separately in the dataset")
print(f"  - Additional verb forms in the dataset not in this source")
print(f"  - Dictionary vs masu-form variations")
print(f"{'='*70}")
