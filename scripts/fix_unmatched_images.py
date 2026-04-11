#!/usr/bin/env python3
"""
Manually match the unmatched images based on known patterns
"""

import shutil
import json
from pathlib import Path

def get_verb_info(verb_id):
    """Get verb info from datasets"""
    dataset1_path = Path("/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset.json")
    dataset2_path = Path("/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset_2.json")

    for dataset_path in [dataset1_path, dataset2_path]:
        with open(dataset_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for verb in data['verbs']:
            if verb['id'] == verb_id:
                return verb['meaning']['primary']
    return None

def fix_unmatched():
    """Manually fix unmatched images based on OCR patterns"""

    base_path = Path("/home/pankaj/Downloads/images")
    output_path = Path("/home/pankaj/bumble/lingomemory/public/images/verbs")

    # Manual mappings based on OCR errors and context
    manual_matches = {
        "Copilot_20260411_180253.png": "n5_v_0019",  # TO LOWER
        "Copilot_20260411_181235.png": "n5_v_0028",  # TRY HARD -> ganbaru
        "Copilot_20260411_182243.png": "n5_v_0043",  # TO BRING SOMEONE
        "Copilot_20260411_182622.png": "n5_v_0047",  # TO PHOTOGRAPH
        "Copilot_20260411_182634.png": "n5_v_0135",  # TO FIX -> naosu
        "Copilot_20260411_192748.png": "n5_v_0150",  # TO BRING SOMEONE (tsureteiku)
        "Copilot_20260411_193229.png": "n5_v_0152",  # TO BRING SOMETHING
        "Copilot_20260411_193601.png": "n5_v_0159",  # TO VISIT HUMBLE -> ukagau
        "Copilot_20260411_195045.png": "n5_v_0173",  # TO PARK VEHICLE
        "Copilot_20260411_195929.png": "n5_v_0181",  # TO WARM UP FOOD
        "Copilot_20260411_200521.png": "n5_v_0200",  # TO VISIT PERSON
        "Copilot_20260411_201551.png": "n5_v_0211",  # TO PICK UP
        "Copilot_20260411_201743.png": "n5_v_0217",  # TO REVIEW LESSONS
        "Copilot_20260411_205717.png": "n5_v_0235",  # TO JOIN (might be garbled)
        "Copilot_20260411_205842.png": "n5_v_0237",  # TO DYE HAIR
        "Copilot_20260411_205902.png": "n5_v_0244",  # TO FAIL (might be garbled)
        "Copilot_20260411_210046.png": "n5_v_0249",  # TO SMELL (might be garbled)
        "Copilot_20260411_210048.png": "n5_v_0250",  # TO COMB HAIR
        "Copilot_20260411_210514.png": "n5_v_0255",  # TO APPLY MEDICINE
        "Copilot_20260411_210644.png": "n5_v_0259",  # TO TIE HAIR
    }

    # Images that OCR completely failed on - need to check manually
    need_manual_check = [
        "Copilot_20260411_175433.png",
        "Copilot_20260411_175914.png",  # TU PUM
        "Copilot_20260411_180558.png",
        "Copilot_20260411_184052.png",
        "Copilot_20260411_184948.png",
        "Copilot_20260411_185819.png",
        "Copilot_20260411_193232.png",
        "Copilot_20260411_193545.png",
        "Copilot_20260411_194130.png",
        "Copilot_20260411_195405.png",
        "Copilot_20260411_200404.png",
        "Copilot_20260411_200811.png",
        "Copilot_20260411_201420.png",
        "Copilot_20260411_201542.png",
        "Copilot_20260411_201547.png",
        "Copilot_20260411_201739.png",
        "Copilot_20260411_201943.png",
        "Copilot_20260411_205722.png",
    ]

    fixed_count = 0

    print("Attempting to fix unmatched images...\n")

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
    print(f"\n⚠️  Still need manual check: {len(need_manual_check)} images")
    print("\nImages needing manual check:")
    for filename in need_manual_check:
        print(f"  - {filename}")

    # Show updated missing verbs count
    all_verb_ids = set(f"n5_v_{i:04d}" for i in range(1, 272))
    renamed_ids = set()
    for file in output_path.glob("n5_v_*.png"):
        renamed_ids.add(file.stem)

    missing_verbs = sorted(all_verb_ids - renamed_ids, key=lambda x: int(x.split('_')[2]))
    print(f"\n🔍 Still missing: {len(missing_verbs)} verbs")

if __name__ == '__main__':
    fix_unmatched()
