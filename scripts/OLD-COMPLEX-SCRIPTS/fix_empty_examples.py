#!/usr/bin/env python3
"""
Quick fix: Add empty examples array to cards without examples.
"""

import json

def fix_empty_examples():
    """Add empty examples array to cards missing the field."""

    print("📖 Loading dataset...")
    with open('public/seed-data/n5-comprehensive.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards_fixed = 0
    for card in data.get('vocabulary', []):
        if 'examples' not in card or not isinstance(card['examples'], list):
            card['examples'] = []
            cards_fixed += 1
            print(f"   Fixed: {card.get('id')} - {card.get('kanji', card.get('kana'))}")

    print(f"\n✅ Fixed {cards_fixed} cards (added empty examples array)")

    # Save updated dataset
    print("💾 Saving updated dataset...")
    with open('public/seed-data/n5-comprehensive.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("✅ Done!")

if __name__ == '__main__':
    fix_empty_examples()
