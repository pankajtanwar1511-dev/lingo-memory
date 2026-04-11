#!/usr/bin/env python3
"""
Sequential + fuzzy matching of verb images using exact THREAD labels
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

        # Split by VERB entries
        verb_blocks = re.split(r'\n(?=VERB \d+(?:\s+\(Extended\))?:)', content)

        for block in verb_blocks:
            # Extract verb ID
            verb_match = re.search(r'(n5_v_\d+)', block)
            if not verb_match:
                continue

            verb_id = verb_match.group(1)

            # Extract text label from prompt
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

        # Crop bottom 15% where text should be
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
        # Clean up text
        text = ''.join(c for c in text if c.isalnum() or c.isspace())
        text = ' '.join(text.split())

        return text
    except Exception as e:
        return ""

def fuzzy_match(text1, text2, threshold=0.75):
    """Check if two texts match with fuzzy matching"""
    if not text1 or not text2:
        return False

    # Exact match
    if text1 == text2:
        return True

    # Fuzzy match
    ratio = SequenceMatcher(None, text1, text2).ratio()
    return ratio >= threshold

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

def sequential_match():
    """Match images using sequential + fuzzy approach"""

    print("=" * 70)
    print("SEQUENTIAL + FUZZY MATCHING WITH EXACT THREAD LABELS")
    print("=" * 70)

    print("\n1. Extracting exact labels from THREAD files...")
    verb_to_label, label_to_verb = extract_exact_labels_from_threads()
    print(f"   ✓ Extracted {len(verb_to_label)} labels from THREAD files")

    base_path = Path("/home/pankaj/Downloads/images")
    output_path = Path("/home/pankaj/bumble/lingomemory/public/images/verbs")
    output_path.mkdir(parents=True, exist_ok=True)

    matched_count = 0
    matched_verbs = set()

    # Process each set
    for set_num in range(1, 12):
        set_dir = base_path / f"set_{set_num}"

        if not set_dir.exists():
            continue

        print(f"\n{'=' * 70}")
        print(f"Processing set_{set_num}")
        print(f"{'=' * 70}")

        # Get all images in chronological order
        images = sorted(list(set_dir.glob("*.png")))

        # Calculate expected verb range for this set
        # set_1 = verbs 1-25, set_2 = 26-50, etc.
        start_verb = (set_num - 1) * 25 + 1
        end_verb = min(set_num * 25, 271)

        expected_verbs = [f"n5_v_{i:04d}" for i in range(start_verb, end_verb + 1)]

        print(f"Expected verbs: {expected_verbs[0]} to {expected_verbs[-1]} ({len(expected_verbs)} verbs)")
        print(f"Images found: {len(images)}")

        # Track which verbs in this set are still unmatched
        unmatched_verbs = [v for v in expected_verbs if v not in matched_verbs]

        # PHASE 1: Sequential matching
        print(f"\nPhase 1: Sequential matching...")
        for i, img_file in enumerate(images):
            if i >= len(unmatched_verbs):
                break

            verb_id = unmatched_verbs[i]
            expected_label = verb_to_label.get(verb_id, "")

            if not expected_label:
                continue

            # Extract text from image
            ocr_text = extract_text_from_image(img_file)

            # Check if it matches expected label
            if fuzzy_match(ocr_text, expected_label, threshold=0.75):
                dest_file = output_path / f"{verb_id}.png"
                shutil.copy2(img_file, dest_file)
                matched_count += 1
                matched_verbs.add(verb_id)
                verb_info = get_verb_info(verb_id)
                print(f"  ✓ Sequential match: {img_file.name}")
                print(f"    → {verb_id}.png ({verb_info})")
                print(f"    OCR: '{ocr_text}' ≈ Expected: '{expected_label}'")
                # Remove from unmatched list
                unmatched_verbs[i] = None

        # Clean up None values
        unmatched_verbs = [v for v in unmatched_verbs if v is not None]

        # PHASE 2: Fuzzy matching for remaining images
        if unmatched_verbs:
            print(f"\nPhase 2: Fuzzy matching for {len(unmatched_verbs)} remaining verbs...")

            # Get unmatched images
            unmatched_images = []
            for img_file in images:
                # Check if this image was already used
                already_used = False
                for matched_verb in matched_verbs:
                    dest_file = output_path / f"{matched_verb}.png"
                    if dest_file.exists():
                        # Compare file sizes (simple check)
                        if img_file.stat().st_size == dest_file.stat().st_size:
                            already_used = True
                            break

                if not already_used:
                    unmatched_images.append(img_file)

            # Try to match each unmatched image with each unmatched verb
            for img_file in unmatched_images:
                ocr_text = extract_text_from_image(img_file)

                best_match = None
                best_ratio = 0

                for verb_id in unmatched_verbs:
                    expected_label = verb_to_label.get(verb_id, "")
                    if not expected_label:
                        continue

                    ratio = SequenceMatcher(None, ocr_text, expected_label).ratio()
                    if ratio > best_ratio:
                        best_ratio = ratio
                        best_match = verb_id

                if best_match and best_ratio >= 0.65:
                    dest_file = output_path / f"{best_match}.png"
                    if not dest_file.exists():
                        shutil.copy2(img_file, dest_file)
                        matched_count += 1
                        matched_verbs.add(best_match)
                        verb_info = get_verb_info(best_match)
                        expected_label = verb_to_label.get(best_match, "")
                        print(f"  ✓ Fuzzy match: {img_file.name}")
                        print(f"    → {best_match}.png ({verb_info})")
                        print(f"    OCR: '{ocr_text}' ≈ Expected: '{expected_label}' (ratio: {best_ratio:.2f})")
                        unmatched_verbs.remove(best_match)
                else:
                    if ocr_text:
                        print(f"  ❌ No match: {img_file.name} - OCR: '{ocr_text}' (best ratio: {best_ratio:.2f})")

    # Final report
    print("\n" + "=" * 70)
    print("FINAL REPORT")
    print("=" * 70)
    print(f"✅ Matched: {matched_count} images")

    all_verb_ids = set(f"n5_v_{i:04d}" for i in range(1, 272))
    missing_verbs = sorted(all_verb_ids - matched_verbs, key=lambda x: int(x.split('_')[2]))

    print(f"❌ Missing: {len(missing_verbs)} verbs")

    if missing_verbs:
        print("\nMissing verb IDs:")
        for verb_id in missing_verbs:
            expected_label = verb_to_label.get(verb_id, "")
            verb_info = get_verb_info(verb_id)
            print(f"  - {verb_id}: {verb_info} (expected label: '{expected_label}')")

if __name__ == '__main__':
    sequential_match()
