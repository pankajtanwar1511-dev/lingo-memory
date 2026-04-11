#!/usr/bin/env python3
"""
Find which images are still unmatched and try aggressive fuzzy matching
"""

import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from PIL import Image
from difflib import SequenceMatcher

def extract_exact_labels_from_threads():
    """Extract exact text labels from THREAD files"""

    verb_to_label = {}
    label_to_verb = {}

    thread_files = [
        "THREAD_1_VERBS_001-054_DETAILED.txt",
        "THREAD_2_VERBS_055-108_DETAILED.txt",
        "THREAD_3_VERBS_109-162_DETAILED.txt",
        "THREAD_4_VERBS_163-216_DETAILED.txt",
        "THREAD_5_VERBS_217-270_DETAILED.txt"
    ]

    scripts_dir = Path("/home/pankaj/bumble/lingomemory/scripts")

    for thread_file in thread_files:
        filepath = scripts_dir / thread_file
        if not filepath.exists():
            continue

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        verb_blocks = re.split(r'\n(?=VERB \d+(?:\s+\(Extended\))?:)', content)

        for block in verb_blocks:
            verb_match = re.search(r'(n5_v_\d+)', block)
            if not verb_match:
                continue

            verb_id = verb_match.group(1)
            label_match = re.search(r'bold black text "([^"]+)"', block, re.IGNORECASE)

            if label_match:
                text_label = label_match.group(1).strip().upper()
                verb_to_label[verb_id] = text_label
                label_to_verb[text_label] = verb_id

    return verb_to_label, label_to_verb

def extract_text_from_image(image_path):
    """Extract text from bottom of image using tesseract"""
    try:
        img = Image.open(image_path)
        width, height = img.size

        bottom_crop = img.crop((0, int(height * 0.85), width, height))

        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
            bottom_crop.save(tmp.name)
            tmp_path = tmp.name

        result = subprocess.run(
            ['tesseract', tmp_path, 'stdout'],
            capture_output=True,
            text=True
        )

        Path(tmp_path).unlink()

        text = result.stdout.strip().upper()
        text = ''.join(c for c in text if c.isalnum() or c.isspace())
        text = ' '.join(text.split())

        return text
    except Exception as e:
        return ""

def get_verb_info(verb_id):
    """Get verb kanji and meaning from datasets"""
    dataset1_path = Path("/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset.json")
    dataset2_path = Path("/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset_2.json")

    for dataset_path in [dataset1_path, dataset2_path]:
        with open(dataset_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for verb in data['verbs']:
            if verb['id'] == verb_id:
                return f"{verb['lemma']['kanji']} - {verb['meaning']['primary']}"
    return "Unknown"

def find_unmatched():
    """Find and report unmatched images"""

    print("=" * 70)
    print("FINDING UNMATCHED IMAGES")
    print("=" * 70)

    # Get all missing verb IDs
    output_path = Path("/home/pankaj/bumble/lingomemory/public/images/verbs")
    all_verb_ids = set(f"n5_v_{i:04d}" for i in range(1, 272))
    matched_ids = set(f.stem for f in output_path.glob("n5_v_*.png"))
    missing_ids = sorted(all_verb_ids - matched_ids, key=lambda x: int(x.split('_')[2]))

    print(f"\nMissing {len(missing_ids)} verb images")

    # Get all downloaded images
    base_path = Path("/home/pankaj/Downloads/images")
    all_downloaded_images = []
    for set_num in range(1, 12):
        set_dir = base_path / f"set_{set_num}"
        if set_dir.exists():
            all_downloaded_images.extend(sorted(set_dir.glob("*.png")))

    print(f"Total downloaded images: {len(all_downloaded_images)}")

    # Find which images are not yet matched
    used_images = set()
    for matched_id in matched_ids:
        matched_file = output_path / f"{matched_id}.png"
        if matched_file.exists():
            matched_size = matched_file.stat().st_size
            for img in all_downloaded_images:
                if img.stat().st_size == matched_size:
                    used_images.add(img.name)
                    break

    unmatched_images = [img for img in all_downloaded_images if img.name not in used_images]
    print(f"Unmatched images: {len(unmatched_images)}")

    # Extract labels
    print("\n" + "=" * 70)
    print("UNMATCHED IMAGES WITH OCR TEXT")
    print("=" * 70)

    verb_to_label, label_to_verb = extract_exact_labels_from_threads()

    for img_file in unmatched_images:
        ocr_text = extract_text_from_image(img_file)
        print(f"\n{img_file.parent.name}/{img_file.name}")
        print(f"  OCR text: '{ocr_text}'")

        # Find best match
        best_match = None
        best_ratio = 0

        for verb_id in missing_ids:
            expected_label = verb_to_label.get(verb_id, "")
            if not expected_label:
                continue

            ratio = SequenceMatcher(None, ocr_text, expected_label).ratio()
            if ratio > best_ratio:
                best_ratio = ratio
                best_match = verb_id

        if best_match:
            expected_label = verb_to_label.get(best_match, "")
            verb_info = get_verb_info(best_match)
            print(f"  Best match: {best_match} - {verb_info}")
            print(f"  Expected: '{expected_label}' (ratio: {best_ratio:.2f})")

    # Now show missing verbs that have NO images
    print("\n" + "=" * 70)
    print("MISSING VERBS (NO IMAGES GENERATED)")
    print("=" * 70)

    if len(missing_ids) > len(unmatched_images):
        never_generated = missing_ids[len(unmatched_images):]
        print(f"\nThese {len(never_generated)} verbs were NEVER generated:")
        for verb_id in never_generated:
            expected_label = verb_to_label.get(verb_id, "")
            verb_info = get_verb_info(verb_id)
            print(f"  - {verb_id}: {verb_info}")
            print(f"    Expected label: '{expected_label}'")

if __name__ == '__main__':
    find_unmatched()
