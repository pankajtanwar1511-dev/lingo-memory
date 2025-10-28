#!/usr/bin/env python3
"""
N4 Audio Generation using Edge-TTS (Python)

100% FREE - No API key, no payment info needed!

Prerequisites:
  pip install edge-tts

Usage:
  python3 scripts/generate-n4-audio.py

Generates audio for all N4 vocabulary words and examples.
"""

import json
import asyncio
import os
import sys
from pathlib import Path

try:
    import edge_tts
except ImportError:
    print("❌ edge-tts not installed. Installing...")
    os.system("pip install edge-tts")
    import edge_tts

# Configuration
INPUT_FILE = "public/seed-data/n4-comprehensive.json"
OUTPUT_DIR = "public/audio/n4"
VOICE = "ja-JP-NanamiNeural"  # Female voice
# Alternatives: ja-JP-KeitaNeural (Male)

async def generate_audio(text: str, output_path: str):
    """Generate audio file using Edge-TTS"""
    try:
        communicate = edge_tts.Communicate(text, VOICE)
        await communicate.save(output_path)
        return True
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

async def main():
    print("🎙️  N4 Audio Generation with Microsoft Edge TTS (FREE!)")
    print(f"   Input: {INPUT_FILE}")
    print(f"   Output: {OUTPUT_DIR}")
    print(f"   Voice: {VOICE}\n")

    # Create output directories
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
    Path(f"{OUTPUT_DIR}/examples").mkdir(parents=True, exist_ok=True)

    # Load vocabulary data
    print("📥 Loading vocabulary data...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data['vocabulary']
    print(f"✅ Loaded {len(cards)} cards\n")

    # Statistics
    vocab_generated = 0
    vocab_skipped = 0
    examples_generated = 0
    examples_skipped = 0
    errors = 0

    # Generate vocabulary audio
    print("🎤 Generating vocabulary audio...")
    for i, card in enumerate(cards, 1):
        card_id = card['id']
        kana = card['kana']
        audio_path = f"{OUTPUT_DIR}/{card_id}.mp3"

        if os.path.exists(audio_path):
            vocab_skipped += 1
            continue

        success = await generate_audio(kana, audio_path)
        if success:
            vocab_generated += 1
            if vocab_generated % 50 == 0:
                print(f"  Generated {vocab_generated}/{len(cards)} vocab audio files...")
        else:
            errors += 1

        # Small delay to be nice to the service
        await asyncio.sleep(0.1)

    print(f"✅ Vocabulary audio: {vocab_generated} generated, {vocab_skipped} skipped\n")

    # Generate example audio
    print("🎤 Generating example audio...")
    total_examples = sum(len(card.get('examples', [])) for card in cards)
    example_count = 0

    for card in cards:
        card_id = card['id']
        examples = card.get('examples', [])

        for i, example in enumerate(examples, 1):
            example_path = f"{OUTPUT_DIR}/examples/{card_id}_ex{i}.mp3"

            if os.path.exists(example_path):
                examples_skipped += 1
                continue

            japanese = example['japanese']
            success = await generate_audio(japanese, example_path)
            if success:
                examples_generated += 1
                if examples_generated % 100 == 0:
                    print(f"  Generated {examples_generated}/{total_examples} example audio files...")
            else:
                errors += 1

            # Small delay
            await asyncio.sleep(0.1)

    print(f"✅ Example audio: {examples_generated} generated, {examples_skipped} skipped\n")

    # Summary
    print("📊 Summary:")
    print(f"   Vocabulary audio: {vocab_generated} generated, {vocab_skipped} skipped")
    print(f"   Example audio: {examples_generated} generated, {examples_skipped} skipped")
    print(f"   Total audio files: {vocab_generated + examples_generated}")
    print(f"   Cost: $0.00 (100% FREE!)")
    print(f"   Errors: {errors}\n")
    print("🎉 N4 Audio generation complete!")

if __name__ == "__main__":
    asyncio.run(main())
