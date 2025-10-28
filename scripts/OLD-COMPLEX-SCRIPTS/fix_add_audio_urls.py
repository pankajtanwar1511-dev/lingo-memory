#!/usr/bin/env python3
"""
Quick fix: Copy audioUrl fields from original dataset to new N5-filtered dataset.
"""

import json
from pathlib import Path

def merge_audio_urls():
    """Merge audioUrl fields from original to new dataset."""

    # Load original dataset (has audioUrl)
    print("📖 Loading original dataset...")
    with open('public/seed-data/n5-comprehensive.json.backup', 'r', encoding='utf-8') as f:
        original = json.load(f)

    # Load new filtered dataset (missing audioUrl)
    print("📖 Loading new filtered dataset...")
    with open('public/seed-data/n5-comprehensive.json', 'r', encoding='utf-8') as f:
        new_data = json.load(f)

    # Build lookup: (kanji, kana) -> audioUrl
    audio_lookup = {}
    for card in original.get('vocabulary', []):
        kanji = card.get('kanji', '').strip()
        kana = card.get('kana', '').strip()
        audio_url = card.get('audioUrl')

        # Create unique key
        key = f"{kanji}:{kana}"

        if audio_url:
            audio_lookup[key] = audio_url

    print(f"   Found {len(audio_lookup)} audio URLs in original dataset")

    # Add audioUrl to new dataset
    cards_updated = 0
    for card in new_data.get('vocabulary', []):
        kanji = card.get('kanji', '').strip()
        kana = card.get('kana', '').strip()
        key = f"{kanji}:{kana}"

        if key in audio_lookup:
            card['audioUrl'] = audio_lookup[key]
            cards_updated += 1

    print(f"   Added audioUrl to {cards_updated} cards")

    # Save updated dataset
    print("💾 Saving updated dataset...")
    with open('public/seed-data/n5-comprehensive.json', 'w', encoding='utf-8') as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)

    print("✅ Done! All cards now have audioUrl field")

if __name__ == '__main__':
    merge_audio_urls()
