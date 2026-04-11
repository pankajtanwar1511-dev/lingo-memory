#!/usr/bin/env python3
"""
Interactive helper to manually match and rename verb images
Opens each image, user types the text they see, script renames accordingly
"""

import json
import shutil
from pathlib import Path
from PIL import Image

def build_text_mapping():
    """Build mapping from text to verb ID"""

    mapping = {}

    # Load both datasets
    dataset1_path = Path("/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset.json")
    dataset2_path = Path("/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset_2.json")

    for dataset_path in [dataset1_path, dataset2_path]:
        with open(dataset_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for verb in data['verbs']:
            verb_id = verb['id']
            primary = verb['meaning']['primary'].upper()
            glosses = verb['meaning'].get('gloss', [])

            # Create all possible text variations
            texts = [primary, f"TO {primary}"]
            for gloss in glosses:
                g_upper = gloss.upper()
                texts.extend([g_upper, f"TO {g_upper}"])

            for text in texts:
                text_clean = text.strip().upper()
                if text_clean not in mapping or verb_id < mapping[text_clean]:
                    mapping[text_clean] = verb_id

    return mapping

def interactive_rename():
    """Interactive image matching and renaming"""

    print("Building text-to-ID mapping...")
    text_mapping = build_text_mapping()

    base_path = Path("/home/pankaj/Downloads/images")
    output_path = Path("/home/pankaj/bumble/lingomemory/public/images/verbs")
    output_path.mkdir(parents=True, exist_ok=True)

    renamed_count = 0
    skipped_count = 0

    # Get all image files
    all_images = []
    for set_num in range(1, 12):
        set_dir = base_path / f"set_{set_num}"
        if set_dir.exists():
            all_images.extend(sorted(set_dir.glob("*.png")))

    total_images = len(all_images)
    print(f"\nFound {total_images} images total")
    print("\nInstructions:")
    print("- Image will open in your default viewer")
    print("- Type the text you see at the bottom (e.g., 'TO WALK' or 'walk')")
    print("- Press Enter to skip")
    print("- Type 'quit' to exit\n")

    for idx, img_file in enumerate(all_images, 1):
        # Skip if already renamed
        possible_ids = [f"n5_v_{i:04d}" for i in range(1, 272)]
        existing_named = any((output_path / f"{pid}.png").exists() for pid in possible_ids)

        print(f"\n[{idx}/{total_images}] Processing: {img_file.name}")

        # Open image for user to view
        try:
            img = Image.open(img_file)
            img.show()
        except Exception as e:
            print(f"Error opening image: {e}")
            continue

        # Get user input
        user_input = input("Enter text seen (or Enter to skip, 'quit' to exit): ").strip()

        if user_input.lower() == 'quit':
            print("\nExiting...")
            break

        if not user_input:
            skipped_count += 1
            continue

        # Try to match text
        text_upper = user_input.upper()
        verb_id = None

        # Try exact match
        if text_upper in text_mapping:
            verb_id = text_mapping[text_upper]
        elif f"TO {text_upper}" in text_mapping:
            verb_id = text_mapping[f"TO {text_upper}"]
        else:
            # Try partial match
            for key, vid in text_mapping.items():
                if text_upper in key or key in text_upper:
                    verb_id = vid
                    break

        if verb_id:
            dest_file = output_path / f"{verb_id}.png"
            if dest_file.exists():
                print(f"⚠️  {verb_id}.png already exists, skipping...")
            else:
                shutil.copy2(img_file, dest_file)
                renamed_count += 1
                print(f"✓ Renamed to: {verb_id}.png")
        else:
            print(f"❌ Could not match text '{user_input}' to any verb")
            skipped_count += 1

    print("\n" + "="*60)
    print(f"✅ Renamed: {renamed_count} images")
    print(f"⏭️  Skipped: {skipped_count} images")

    # Report missing verbs
    renamed_ids = set()
    for file in output_path.glob("n5_v_*.png"):
        renamed_ids.add(file.stem)

    all_verb_ids = set(f"n5_v_{i:04d}" for i in range(1, 272))
    missing_verbs = sorted(all_verb_ids - renamed_ids, key=lambda x: int(x.split('_')[2]))

    if missing_verbs:
        print(f"\n🔍 MISSING VERBS ({len(missing_verbs)} total):")
        for verb_id in missing_verbs[:20]:  # Show first 20
            print(f"   - {verb_id}")
        if len(missing_verbs) > 20:
            print(f"   ... and {len(missing_verbs) - 20} more")

if __name__ == '__main__':
    interactive_rename()
