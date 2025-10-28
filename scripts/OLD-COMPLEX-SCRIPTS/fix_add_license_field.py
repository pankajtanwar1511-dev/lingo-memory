#!/usr/bin/env python3
"""
Quick fix: Add missing top-level license field to all vocabulary cards.

This fixes the validation error where cards are missing the required license field.
"""

import json
import sys
from pathlib import Path

def add_license_fields(input_file: Path, output_file: Path):
    """Add top-level license field to all vocabulary cards."""

    print(f"📖 Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    total_cards = len(data.get('vocabulary', []))
    cards_fixed = 0

    print(f"📝 Processing {total_cards} cards...")

    # License for vocabulary data (from JLPT Vocab API)
    vocab_license = {
        "text": "CC BY-SA 4.0",
        "url": "https://creativecommons.org/licenses/by-sa/4.0/"
    }

    for card in data.get('vocabulary', []):
        if 'license' not in card:
            card['license'] = vocab_license
            cards_fixed += 1

    print(f"✅ Fixed {cards_fixed} cards (added license field)")

    # Write output
    print(f"💾 Writing to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✨ Done! All cards now have license field.")
    print(f"\n📊 Summary:")
    print(f"   Total cards: {total_cards}")
    print(f"   Cards fixed: {cards_fixed}")
    print(f"   Output: {output_file}")

if __name__ == '__main__':
    input_file = Path('public/seed-data/n5-comprehensive.json')
    output_file = Path('public/seed-data/n5-comprehensive.json')

    if not input_file.exists():
        print(f"❌ Error: {input_file} not found")
        sys.exit(1)

    add_license_fields(input_file, output_file)
