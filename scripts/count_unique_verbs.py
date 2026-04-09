#!/usr/bin/env python3
import re

verbs = set()
verb_list = []

with open('/home/pankaj/bumble/lingomemory/docs/extracted-verbs-phrases.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
for i, line in enumerate(lines):
    # Match lines like: **はたらきます / しごとします** (hatarakimasu / shigoto shimasu) - work
    match = re.match(r'\*\*([^*]+)\*\*', line)
    if match:
        verb_text = match.group(1).strip()
        
        # Skip if it's a section header (has ##)
        if '##' in line:
            continue
            
        # Skip nouns section entries (lines 366-394)
        if i >= 365 and i <= 393:
            # Only keep きります (cut) and けっこん which are in "Actions" subsection
            if 'きります' not in verb_text and 'けっこん' not in verb_text:
                continue
        
        # Skip pure phrases section (lines 398-407)
        if i >= 397 and i <= 406:
            continue
            
        # Remove context markers like （えきに）, （部屋に）, etc.
        verb_text = re.sub(r'（[^）]+）', '', verb_text)
        verb_text = re.sub(r'\([^)]+\)', '', verb_text)
        
        # Remove object markers like [電話を], [写真を], etc.
        verb_text = re.sub(r'\[[^\]]+\]', '', verb_text)
        verb_text = re.sub(r'【[^】]+】', '', verb_text)
        
        verb_text = verb_text.strip()
        
        # Split compound verbs separated by /
        parts = verb_text.split('/')
        
        for v in parts:
            v = v.strip()
            # Remove kanji that comes after the hiragana (like 歩きます after あるきます)
            # Keep only the part before any kanji appears separately
            v = re.split(r'\s+[一-龯]+', v)[0].strip()
            
            if v and any(c for c in v if '\u3040' <= c <= '\u309F' or '\u30A0' <= c <= '\u30FF' or '\u4E00' <= c <= '\u9FFF'):
                # Has hiragana, katakana, or kanji
                if v not in verbs:
                    verbs.add(v)
                    verb_list.append(v)

print(f"Total unique verbs: {len(verbs)}\n")
print("Complete list of unique verbs:")
print("=" * 60)
for i, v in enumerate(sorted(verb_list), 1):
    print(f"{i:3}. {v}")
