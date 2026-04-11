#!/usr/bin/env python3
"""
Generate placeholder images for verbs with Japanese text
This creates attractive placeholder images that show the verb clearly
Later you can replace these with AI-generated images
"""

import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import random

# Configuration
OUTPUT_DIR = Path("public/images/verbs")
DATASET_1 = Path("public/seed-data/N5_verbs_dataset.json")
DATASET_2 = Path("public/seed-data/N5_verbs_dataset_2.json")

# Create output directory
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Color schemes (pastel colors for educational feel)
COLOR_SCHEMES = [
    {"bg": "#E3F2FD", "text": "#1565C0", "accent": "#42A5F5"},  # Blue
    {"bg": "#F3E5F5", "text": "#6A1B9A", "accent": "#AB47BC"},  # Purple
    {"bg": "#E8F5E9", "text": "#2E7D32", "accent": "#66BB6A"},  # Green
    {"bg": "#FFF3E0", "text": "#E65100", "accent": "#FFA726"},  # Orange
    {"bg": "#FCE4EC", "text": "#C2185B", "accent": "#F06292"},  # Pink
]

def create_placeholder_image(verb: dict, output_path: Path):
    """Create a nice placeholder image with verb info"""

    # Image size
    width, height = 512, 512

    # Choose random color scheme
    colors = random.choice(COLOR_SCHEMES)

    # Create image
    img = Image.new('RGB', (width, height), colors['bg'])
    draw = ImageDraw.Draw(img)

    # Try to use a nice font (fallback to default if not available)
    try:
        # Try to find a Japanese-compatible font
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
    except:
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Get verb info
    kanji = verb['lemma']['kanji']
    kana = verb['lemma']['kana']
    meaning = verb['meaning']['primary']

    # Draw kanji (large, centered)
    kanji_bbox = draw.textbbox((0, 0), kanji, font=font_large)
    kanji_width = kanji_bbox[2] - kanji_bbox[0]
    kanji_height = kanji_bbox[3] - kanji_bbox[1]
    kanji_x = (width - kanji_width) // 2
    kanji_y = 120
    draw.text((kanji_x, kanji_y), kanji, fill=colors['text'], font=font_large)

    # Draw kana (medium, centered)
    kana_bbox = draw.textbbox((0, 0), kana, font=font_medium)
    kana_width = kana_bbox[2] - kana_bbox[0]
    kana_x = (width - kana_width) // 2
    kana_y = 230
    draw.text((kana_x, kana_y), kana, fill=colors['accent'], font=font_medium)

    # Draw English meaning (small, centered)
    meaning_bbox = draw.textbbox((0, 0), meaning, font=font_small)
    meaning_width = meaning_bbox[2] - meaning_bbox[0]
    meaning_x = (width - meaning_width) // 2
    meaning_y = 320
    draw.text((meaning_x, meaning_y), meaning, fill=colors['text'], font=font_small)

    # Draw decorative border
    border_width = 10
    draw.rectangle(
        [border_width, border_width, width-border_width, height-border_width],
        outline=colors['accent'],
        width=4
    )

    # Save
    img.save(output_path)

def update_dataset_with_images(dataset_path: Path):
    """Update verb dataset JSON with image URLs"""
    print(f"\n📝 Updating {dataset_path.name}...")

    with open(dataset_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    updated_count = 0
    for verb in data['verbs']:
        verb_id = verb['id']
        image_path = OUTPUT_DIR / f"{verb_id}.png"

        if image_path.exists():
            if 'image' not in verb:
                verb['image'] = {
                    "url": f"/images/verbs/{verb_id}.png",
                    "type": "placeholder",
                    "generated": False
                }
                updated_count += 1

    # Save
    with open(dataset_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"  ✅ Updated {updated_count} verbs")

def main():
    print("=" * 70)
    print("🎨 VERB PLACEHOLDER IMAGE GENERATOR")
    print("=" * 70)
    print()
    print("Creating attractive placeholder images with Japanese text")
    print("These work great and you can replace with AI images later!")
    print()

    # Load both datasets
    datasets = [
        (DATASET_1, "Main Verbs (166)"),
        (DATASET_2, "Extended Verbs (104)")
    ]

    total = 0
    created = 0

    for dataset_path, dataset_name in datasets:
        print(f"\n📚 {dataset_name}")
        print("-" * 70)

        with open(dataset_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for i, verb in enumerate(data['verbs'], 1):
            verb_id = verb['id']
            kanji = verb['lemma']['kanji']
            output_path = OUTPUT_DIR / f"{verb_id}.png"

            if output_path.exists():
                print(f"[{i}/{len(data['verbs'])}] ⏭️  {kanji} - already exists")
            else:
                create_placeholder_image(verb, output_path)
                print(f"[{i}/{len(data['verbs'])}] ✅ {kanji} - created")
                created += 1

            total += 1

    print("\n" + "=" * 70)
    print("📊 SUMMARY")
    print("=" * 70)
    print(f"Total: {total}")
    print(f"Created: {created}")
    print()

    # Update JSON files
    print("=" * 70)
    print("📝 UPDATING JSON FILES")
    print("=" * 70)
    update_dataset_with_images(DATASET_1)
    update_dataset_with_images(DATASET_2)

    print("\n" + "=" * 70)
    print("✅ COMPLETE!")
    print("=" * 70)
    print(f"\nImages saved to: {OUTPUT_DIR}")
    print("\n💡 These placeholder images:")
    print("   • Show verb clearly in Japanese + English")
    print("   • Use nice pastel colors")
    print("   • Work great for studying")
    print("   • Can be replaced with AI images anytime")
    print()

if __name__ == "__main__":
    try:
        main()
    except ImportError as e:
        print(f"\n❌ Missing dependency: {e}")
        print("\n📦 Install Pillow:")
        print("   pip install Pillow")
        print("\nThen run again:")
        print("   python3 scripts/generate_verb_placeholders.py")
