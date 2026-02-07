#!/usr/bin/env python3
import re

# Read the original file
with open('../N5_important/minna_verb.md', 'r', encoding='utf-8') as f:
    content = f.read()

def kana_masu_form(kana_dict):
    """Generate kana masu form from dictionary kana"""
    kana = kana_dict

    # Special cases for irregular verbs
    if kana == 'くる':
        return 'きます'
    elif kana == 'する':
        return 'します'
    elif kana.endswith('する'):
        return kana[:-2] + 'します'

    # Ichidan verbs - these just drop る and add ます
    ichidan_verbs = [
        'あける', 'あげる', 'あつめる', 'あびる', 'いる', 'いれる',
        'うまれる', 'おきる', 'おしえる', 'おぼえる', 'おりる',
        'かえる', 'かける', 'かりる', 'かんがえる', 'きる', 'きをつける',
        'くれる', 'しめる', 'しらべる', 'すてる', 'たべる', 'たりる',
        'つかれる', 'つける', 'でかける', 'できる', 'でる', 'とめる',
        'ねる', 'のりかえる', 'はじめる', 'まける', 'みせる', 'みる',
        'むかえる', 'やめる', 'わすれる'
    ]

    if kana in ichidan_verbs:
        return kana[:-1] + 'ます'

    # Godan verbs (う-verbs): last う sound changes to い + ます
    if kana.endswith('う'):
        return kana[:-1] + 'います'
    elif kana.endswith('く'):
        return kana[:-1] + 'きます'
    elif kana.endswith('ぐ'):
        return kana[:-1] + 'ぎます'
    elif kana.endswith('す'):
        return kana[:-1] + 'します'
    elif kana.endswith('つ'):
        return kana[:-1] + 'ちます'
    elif kana.endswith('ぬ'):
        return kana[:-1] + 'にます'
    elif kana.endswith('ぶ'):
        return kana[:-1] + 'びます'
    elif kana.endswith('む'):
        return kana[:-1] + 'みます'
    elif kana.endswith('る'):
        # Godan る
        return kana[:-1] + 'ります'

    return kana + 'ます'  # fallback

# Process each line
lines = content.split('\n')
output_lines = []

group3_mode = False

for i, line in enumerate(lines):
    # Detect Group III section
    if '# Group III' in line:
        group3_mode = True

    # Check if it's a header row for GROUP I or II tables
    if line.startswith('| Dictionary Kanji | Dictionary Kana | Masu-form | Meaning |'):
        output_lines.append('| Dictionary Kanji | Dictionary Kana | Masu-form | Masu-form (Kana) | Meaning |')
    elif line == '|-----------------|----------------|-----------|---------|':
        output_lines.append('|-----------------|----------------|-----------|------------------|---------|')
    # Group III - don't modify
    elif group3_mode:
        output_lines.append(line)
    elif line.startswith('| ') and '|' in line[2:]:
        parts = [p.strip() for p in line.split('|')]

        # Check if it's a GROUP I or II data row (5 parts: empty, kanji, kana, masu, meaning, empty)
        if len(parts) >= 5 and parts[1] and parts[2] and parts[3]:
            kanji = parts[1]
            kana = parts[2]
            masu_kanji = parts[3]
            meaning = parts[4] if len(parts) > 4 else ''

            # Skip if it's empty or header
            if not kanji or 'Dictionary' in kanji:
                output_lines.append(line)
                continue

            # Generate kana masu form
            masu_kana = kana_masu_form(kana)

            # Rebuild line with new column
            new_line = f'| {kanji} | {kana} | {masu_kanji} | {masu_kana} | {meaning} |'
            output_lines.append(new_line)
        else:
            output_lines.append(line)
    else:
        output_lines.append(line)

# Save to new file
output_content = '\n'.join(output_lines)

with open('N5_verb.md', 'w', encoding='utf-8') as f:
    f.write(output_content)

print("✅ Created: 2026-02-07/N5_verb.md")
print(f"Total lines: {len(output_lines)}")
