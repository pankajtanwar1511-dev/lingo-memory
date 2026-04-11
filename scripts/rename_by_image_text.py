#!/usr/bin/env python3
"""
Read each verb image, extract the text label at bottom, and rename to correct n5_v_XXXX.png
"""

import json
import shutil
from pathlib import Path
from PIL import Image
import pytesseract

def build_text_mapping():
    """Build mapping from English text to verb ID"""

    mapping = {}

    # Load both datasets
    dataset1_path = Path("/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset.json")
    dataset2_path = Path("/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset_2.json")

    for dataset_path in [dataset1_path, dataset2_path]:
        with open(dataset_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for verb in data['verbs']:
            verb_id = verb['id']

            # Get primary meaning
            primary = verb['meaning']['primary'].upper()

            # Also get all glosses
            glosses = verb['meaning'].get('gloss', [])

            # Common text patterns from THREAD files
            # Map various forms to the verb ID
            meanings = [primary]
            meanings.extend([g.upper() for g in glosses])

            for meaning in meanings:
                # Clean up the meaning text
                text = meaning.strip().upper()

                # Add variations with "TO"
                mapping[f"TO {text}"] = verb_id
                mapping[text] = verb_id

    # Manual additions for specific THREAD file texts
    manual_mappings = {
        "TO MEET": "n5_v_0001",
        "TO PLAY": "n5_v_0002",
        "TO WASH": "n5_v_0003",
        "TO EXIST": "n5_v_0004",
        "TO WALK": "n5_v_0005",
        "TO SAY": "n5_v_0006",
        "TO GO": "n5_v_0007",
        "TO HURRY": "n5_v_0008",
        "TO NEED": "n5_v_0009",
        "TO MOVE": "n5_v_0010",
        "TO SING": "n5_v_0011",
        "TO SELL": "n5_v_0012",
        "TO PUT": "n5_v_0013",
        "TO SEND": "n5_v_0014",
        "TO PUSH": "n5_v_0015",
        "TO REMEMBER": "n5_v_0016",
        "TO THINK": "n5_v_0017",
        "TO SWIM": "n5_v_0018",
        "TO LOWER": "n5_v_0019",
        "TO FINISH": "n5_v_0020",
        "TO BUY": "n5_v_0021",
        "TO RETURN": "n5_v_0022",
        "TO GO HOME": "n5_v_0023",
        "TO TAKE TIME": "n5_v_0024",
        "TO WRITE": "n5_v_0025",
        "TO CONTINUE": "n5_v_0167",
        # Add more as needed from THREAD files
    }

    mapping.update(manual_mappings)

    return mapping

def extract_text_from_image(image_path):
    """Extract text from bottom of image using OCR"""

    try:
        img = Image.open(image_path)
        width, height = img.size

        # Crop bottom portion where text should be (last 15% of image)
        bottom_crop = img.crop((0, int(height * 0.85), width, height))

        # Extract text using pytesseract
        text = pytesseract.image_to_string(bottom_crop, config='--psm 6')

        # Clean up text
        text = text.strip().upper()
        text = ''.join(c for c in text if c.isalnum() or c.isspace())
        text = ' '.join(text.split())  # Normalize whitespace

        return text

    except Exception as e:
        print(f"Error reading {image_path.name}: {e}")
        return None

def rename_images():
    """Process all images and rename based on text label"""

    print("Building text-to-ID mapping...")
    text_mapping = build_text_mapping()

    base_path = Path("/home/pankaj/Downloads/images")
    output_path = Path("/home/pankaj/bumble/lingomemory/public/images/verbs")
    output_path.mkdir(parents=True, exist_ok=True)

    renamed_count = 0
    unmatched = []

    # Process each set
    for set_num in range(1, 12):
        set_dir = base_path / f"set_{set_num}"

        if not set_dir.exists():
            continue

        print(f"\n=== Processing set_{set_num} ===")

        image_files = list(set_dir.glob("*.png"))

        for img_file in image_files:
            # Extract text from image
            extracted_text = extract_text_from_image(img_file)

            if not extracted_text:
                print(f"⚠️  Could not extract text from: {img_file.name}")
                unmatched.append(img_file.name)
                continue

            # Try to find matching verb ID
            verb_id = None

            # Try exact match first
            if extracted_text in text_mapping:
                verb_id = text_mapping[extracted_text]
            else:
                # Try partial matches
                for key, value in text_mapping.items():
                    if key in extracted_text or extracted_text in key:
                        verb_id = value
                        break

            if verb_id:
                dest_file = output_path / f"{verb_id}.png"
                shutil.copy2(img_file, dest_file)
                renamed_count += 1
                print(f"✓ {img_file.name} → {verb_id}.png (text: '{extracted_text}')")
            else:
                print(f"❌ No match for: {img_file.name} (text: '{extracted_text}')")
                unmatched.append((img_file.name, extracted_text))

    print("\n" + "="*60)
    print(f"✅ Renamed: {renamed_count} images")
    print(f"❌ Unmatched: {len(unmatched)} images")

    if unmatched:
        print("\nUnmatched files:")
        for item in unmatched:
            if isinstance(item, tuple):
                print(f"  {item[0]} - text: '{item[1]}'")
            else:
                print(f"  {item}")

if __name__ == '__main__':
    rename_images()
