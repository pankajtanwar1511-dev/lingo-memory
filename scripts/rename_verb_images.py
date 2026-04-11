#!/usr/bin/env python3
"""
Rename downloaded verb images from Copilot_timestamp format to n5_v_XXXX.png format
"""

import os
import shutil
from pathlib import Path

def rename_images():
    """Rename all images in set folders to proper verb IDs"""

    base_path = Path("/home/pankaj/Downloads/images")
    output_path = Path("/home/pankaj/bumble/lingomemory/public/images/verbs")

    # Create output directory if it doesn't exist
    output_path.mkdir(parents=True, exist_ok=True)

    missing_verbs = []
    renamed_count = 0

    # Process each set
    for set_num in range(1, 12):  # set_1 to set_11
        set_dir = base_path / f"set_{set_num}"

        if not set_dir.exists():
            print(f"❌ Directory not found: {set_dir}")
            continue

        # Get all PNG files sorted by filename (which contains timestamp)
        image_files = sorted(set_dir.glob("*.png"))

        # Calculate verb range for this set
        start_verb = (set_num - 1) * 25 + 1
        end_verb = min(start_verb + 24, 271)  # Max 271 verbs
        expected_count = end_verb - start_verb + 1

        print(f"\n=== SET {set_num} ===")
        print(f"Verb range: {start_verb:04d} - {end_verb:04d}")
        print(f"Expected files: {expected_count}")
        print(f"Found files: {len(image_files)}")

        if len(image_files) < expected_count:
            missing = expected_count - len(image_files)
            print(f"⚠️  MISSING: {missing} file(s)")

        # Rename each file
        for idx, img_file in enumerate(image_files):
            verb_id = start_verb + idx
            if verb_id > 271:
                print(f"⚠️  Skipping extra file: {img_file.name}")
                continue

            new_name = f"n5_v_{verb_id:04d}.png"
            dest_file = output_path / new_name

            # Copy (not move) to preserve originals
            shutil.copy2(img_file, dest_file)
            renamed_count += 1

        # Check for missing verbs in this set
        for verb_id in range(start_verb, end_verb + 1):
            expected_file = output_path / f"n5_v_{verb_id:04d}.png"
            if not expected_file.exists():
                missing_verbs.append(verb_id)

    print("\n" + "="*60)
    print(f"✅ Renamed and copied: {renamed_count} files")
    print(f"📁 Destination: {output_path}")

    if missing_verbs:
        print(f"\n❌ MISSING VERBS ({len(missing_verbs)} total):")
        for verb_id in missing_verbs:
            print(f"   - n5_v_{verb_id:04d}")
    else:
        print(f"\n✅ All 271 verbs have images!")

    return missing_verbs

if __name__ == '__main__':
    missing = rename_images()
