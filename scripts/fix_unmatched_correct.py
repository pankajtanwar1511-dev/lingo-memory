#!/usr/bin/env python3
"""
Correctly match the unmatched images based on actual missing verbs
"""

import shutil
import json
import subprocess
import tempfile
from pathlib import Path
from PIL import Image

def extract_text_from_image(image_path):
    """Extract text using tesseract"""
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
        return text
    except:
        return ""

def get_verb_info(verb_id):
    """Get verb info from datasets"""
    dataset1_path = Path("/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset.json")
    dataset2_path = Path("/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset_2.json")

    for dataset_path in [dataset1_path, dataset2_path]:
        with open(dataset_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for verb in data['verbs']:
            if verb['id'] == verb_id:
                return f"{verb['lemma']['kanji']} - {verb['meaning']['primary']}"
    return "Unknown"

def fix_unmatched():
    """Manually fix unmatched images"""

    base_path = Path("/home/pankaj/Downloads/images")
    output_path = Path("/home/pankaj/bumble/lingomemory/public/images/verbs")

    # Correct manual mappings based on actual missing verbs
    manual_matches = {
        # Based on OCR text matching missing verbs
        "Copilot_20260411_180253.png": "n5_v_0019",  # TO LOWER → 下ろす (to withdraw)
        "Copilot_20260411_181235.png": "n5_v_0029",  # TRY HARD → 頑張る (to do one's best)
        "Copilot_20260411_182243.png": "n5_v_0043",  # TO BRING SOMEONE → 連れて行く
        "Copilot_20260411_182622.png": "n5_v_0047",  # TO PHOTOGRAPH → 撮る
        "Copilot_20260411_182634.png": "n5_v_0049",  # TO FIX → 直す
        "Copilot_20260411_192748.png": "n5_v_0150",  # TO BRING SOMEONE → 連れて来る
        "Copilot_20260411_193229.png": "n5_v_0152",  # TO BRING SOMETHING → 持って来る
        "Copilot_20260411_193601.png": "n5_v_0159",  # TO VISIT HUMBLE → 伺う
        "Copilot_20260411_195045.png": "n5_v_0174",  # TO PARK VEHICLE → 停める
        "Copilot_20260411_195929.png": "n5_v_0181",  # TO WARM UP FOOD → 温める
        "Copilot_20260411_200521.png": "n5_v_0200",  # TO VISIT PERSON → 訪ねる
        "Copilot_20260411_201743.png": "n5_v_0217",  # TO REVIEW LESSONS → 復習する
        "Copilot_20260411_205842.png": "n5_v_0241",  # TO DYE HAIR → 染める
        "Copilot_20260411_210048.png": "n5_v_0250",  # TO COMB HAIR → 梳かす
        "Copilot_20260411_210514.png": "n5_v_0255",  # TO APPLY MEDICINE → 塗る
        "Copilot_20260411_210644.png": "n5_v_0259",  # TO TIE HAIR → 結ぶ
    }

    fixed_count = 0

    print("Fixing unmatched images with correct manual mappings...\n")

    # Process manual matches
    for set_num in range(1, 12):
        set_dir = base_path / f"set_{set_num}"
        if not set_dir.exists():
            continue

        for filename, verb_id in manual_matches.items():
            img_file = set_dir / filename
            if img_file.exists():
                dest_file = output_path / f"{verb_id}.png"
                if not dest_file.exists():
                    shutil.copy2(img_file, dest_file)
                    meaning = get_verb_info(verb_id)
                    print(f"✓ Fixed: {filename} → {verb_id}.png ({meaning})")
                    fixed_count += 1

    print(f"\n✅ Fixed: {fixed_count} additional images")

    # Show updated missing verbs count
    all_verb_ids = set(f"n5_v_{i:04d}" for i in range(1, 272))
    renamed_ids = set()
    for file in output_path.glob("n5_v_*.png"):
        renamed_ids.add(file.stem)

    missing_verbs = sorted(all_verb_ids - renamed_ids, key=lambda x: int(x.split('_')[2]))
    print(f"\n🔍 Still missing: {len(missing_verbs)} verb images")

    if len(missing_verbs) <= 20:
        print("\nMissing verb IDs:")
        for verb_id in missing_verbs:
            meaning = get_verb_info(verb_id)
            print(f"  - {verb_id}: {meaning}")

if __name__ == '__main__':
    fix_unmatched()
