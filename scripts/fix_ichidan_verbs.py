#!/usr/bin/env python3
"""
Fix misclassified ichidan verbs in N5_verbs_remaining.json
Corrects verb classification and te-forms for 29 verbs
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
VERBS_JSON = BASE_DIR / "public/seed-data/N5_verbs_remaining.json"

def main():
    print("=" * 60)
    print("Fixing Misclassified Ichidan Verbs")
    print("=" * 60)

    # Load data
    with open(VERBS_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)

    verbs = data['verbs']
    fixed_count = 0

    for verb in verbs:
        dict_kanji = verb['forms']['dictionary']['kanji']
        dict_kana = verb['forms']['dictionary']['kana']
        masu_kanji = verb['forms']['masu']['kanji']
        masu_kana = verb['forms']['masu']['kana']
        verb_class = verb['morphology']['class']

        # Check if it follows ichidan pattern
        expected_masu_kanji = dict_kanji[:-1] + 'ます'
        expected_masu_kana = dict_kana[:-1] + 'ます'

        is_ichidan_pattern = (masu_kanji == expected_masu_kanji and masu_kana == expected_masu_kana)

        # If ichidan pattern but classified as godan, fix it
        if is_ichidan_pattern and verb_class == 'godan':
            # Fix classification
            verb['morphology']['class'] = 'ichidan'

            # Fix te-form
            correct_te_kanji = dict_kanji[:-1] + 'て'
            correct_te_kana = dict_kana[:-1] + 'て'

            old_te = verb['forms']['te']['kanji']
            verb['forms']['te']['kanji'] = correct_te_kanji
            verb['forms']['te']['kana'] = correct_te_kana

            # Fix te-form examples
            if 'examples' in verb and 'te' in verb['examples']:
                for example in verb['examples']['te']:
                    # Replace old te-form with correct one in Japanese text
                    example['jp'] = example['jp'].replace(old_te, correct_te_kanji)
                    example['kana'] = example['kana'].replace(verb['forms']['te']['kana'].replace('て', 'って'), correct_te_kana)

            print(f"✓ Fixed {verb['id']}: {dict_kanji} - {old_te} → {correct_te_kanji}")
            fixed_count += 1

    # Update metadata
    data['metadata']['version'] = "3.1.0"
    data['metadata']['description'] = "Additional N5 verbs with comprehensive N4-level examples (ichidan classification fixed)"

    # Save
    with open(VERBS_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print()
    print("=" * 60)
    print(f"✅ Fixed {fixed_count} misclassified verbs")
    print("=" * 60)

if __name__ == "__main__":
    main()
