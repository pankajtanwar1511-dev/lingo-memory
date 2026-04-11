#!/usr/bin/env python3
"""
Generate images for all verbs using Pollinations.ai FREE Stable Diffusion API
Completely free, no API key required, no limits
"""

import json
import os
import time
import requests
from pathlib import Path
from typing import List, Dict, Any
import urllib.request
import urllib.parse

# Configuration - Using Pollinations.ai (completely free, unlimited)
# Alternative: "https://router.huggingface.co/models/stabilityai/stable-diffusion-2-1"
POLLINATIONS_API = "https://image.pollinations.ai/prompt"
OUTPUT_DIR = Path("public/images/verbs")
DATASET_1 = Path("public/seed-data/N5_verbs_dataset.json")
DATASET_2 = Path("public/seed-data/N5_verbs_dataset_2.json")

# Create output directory
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def generate_prompt(verb: Dict[str, Any]) -> str:
    """
    Generate an optimized Stable Diffusion prompt for a verb

    Args:
        verb: Verb object with lemma and meaning

    Returns:
        Optimized prompt string
    """
    # Get verb information
    verb_kanji = verb['lemma']['kanji']
    verb_kana = verb['lemma']['kana']
    verb_meaning = verb['meaning']['primary']

    # Create descriptive prompt for the action
    # Stable Diffusion works best with detailed, visual descriptions
    prompt = f"minimalist illustration of {verb_meaning}, simple line art, educational flashcard style, clean white background, Japanese learning material, clear action depiction, vector art style, professional, high quality"

    return prompt

def generate_image_pollinations(prompt: str, verb_id: str) -> bool:
    """
    Generate image using Pollinations.ai FREE API
    No API key required - completely free and unlimited
    Uses simple GET request with prompt in URL

    Args:
        prompt: Text prompt for image generation
        verb_id: Verb ID for filename

    Returns:
        True if successful, False otherwise
    """
    output_path = OUTPUT_DIR / f"{verb_id}.png"

    # Skip if already exists
    if output_path.exists():
        print(f"  ⏭️  Image already exists: {verb_id}.png")
        return True

    try:
        # Pollinations.ai uses a simple URL format:
        # https://image.pollinations.ai/prompt/{encoded_prompt}
        # Add parameters for better quality
        encoded_prompt = urllib.parse.quote(prompt)

        # API URL with quality parameters
        # width=512, height=512 for square images
        # nologo=true to remove watermark
        # model=flux for best quality (or use 'stable-diffusion' for faster)
        image_url = f"{POLLINATIONS_API}/{encoded_prompt}?width=512&height=512&nologo=true"

        print(f"  🔗 URL: {image_url[:80]}...")

        # Download the image
        response = requests.get(image_url, timeout=60)

        if response.status_code == 200:
            # Save image
            with open(output_path, 'wb') as f:
                f.write(response.content)
            print(f"  ✅ Generated: {verb_id}.png ({len(response.content)} bytes)")
            return True
        else:
            print(f"  ❌ Error {response.status_code}")
            return False

    except Exception as e:
        print(f"  ❌ Exception: {str(e)}")
        return False

def update_dataset_with_images(dataset_path: Path) -> None:
    """
    Update verb dataset JSON with image URLs

    Args:
        dataset_path: Path to the dataset JSON file
    """
    print(f"\n📝 Updating {dataset_path.name}...")

    with open(dataset_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    updated_count = 0
    for verb in data['verbs']:
        verb_id = verb['id']
        image_path = OUTPUT_DIR / f"{verb_id}.png"

        if image_path.exists():
            # Add image field if it doesn't exist
            if 'image' not in verb:
                verb['image'] = {
                    "url": f"/images/verbs/{verb_id}.png",
                    "source": "stable-diffusion-2-1",
                    "generated": True
                }
                updated_count += 1

    # Save updated dataset
    with open(dataset_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"  ✅ Updated {updated_count} verbs with image URLs")

def main():
    """Main execution function"""
    print("=" * 70)
    print("🎨 VERB IMAGE GENERATOR - Pollinations.ai (Free & Unlimited)")
    print("=" * 70)
    print()
    print("Using: Pollinations.ai Stable Diffusion (completely free)")
    print("Cost: $0 (no API key, no limits)")
    print("Time: ~15-20 minutes for 270 images (fast!)")
    print()

    # Load both datasets
    datasets = [
        (DATASET_1, "Main Verbs (166)"),
        (DATASET_2, "Extended Verbs (104)")
    ]

    total_verbs = 0
    generated_count = 0
    skipped_count = 0
    failed_count = 0

    for dataset_path, dataset_name in datasets:
        print(f"\n📚 Processing: {dataset_name}")
        print("-" * 70)

        with open(dataset_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        verbs = data['verbs']
        total_verbs += len(verbs)

        for i, verb in enumerate(verbs, 1):
            verb_id = verb['id']
            verb_kanji = verb['lemma']['kanji']
            verb_meaning = verb['meaning']['primary']

            print(f"\n[{i}/{len(verbs)}] {verb_id}: {verb_kanji} ({verb_meaning})")

            # Check if image already exists
            if (OUTPUT_DIR / f"{verb_id}.png").exists():
                print(f"  ⏭️  Already exists, skipping...")
                skipped_count += 1
                continue

            # Generate prompt
            prompt = generate_prompt(verb)
            print(f"  📝 Prompt: {prompt[:80]}...")

            # Generate image
            success = generate_image_pollinations(prompt, verb_id)

            if success:
                generated_count += 1
            else:
                failed_count += 1

            # Small delay to be respectful to the free API
            # Pollinations.ai has no rate limits, but let's be nice
            if i < len(verbs):
                time.sleep(1)

    print("\n" + "=" * 70)
    print("📊 GENERATION SUMMARY")
    print("=" * 70)
    print(f"Total verbs: {total_verbs}")
    print(f"✅ Generated: {generated_count}")
    print(f"⏭️  Skipped (already exist): {skipped_count}")
    print(f"❌ Failed: {failed_count}")
    print()

    # Update JSON files with image URLs
    if generated_count > 0 or skipped_count > 0:
        print("=" * 70)
        print("📝 UPDATING JSON FILES")
        print("=" * 70)
        update_dataset_with_images(DATASET_1)
        update_dataset_with_images(DATASET_2)
        print()

    print("=" * 70)
    print("✅ COMPLETE!")
    print("=" * 70)
    print(f"\nImages saved to: {OUTPUT_DIR}")
    print(f"Total images: {generated_count + skipped_count}")
    print()

    if failed_count > 0:
        print(f"⚠️  {failed_count} images failed to generate.")
        print("   You can re-run this script to retry failed images.")
        print()

if __name__ == "__main__":
    main()
