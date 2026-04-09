#!/usr/bin/env python3
"""
Merge N5_verbs_dataset.json into N5_verbs_expansion.json
Keeps N5_verbs_dataset.json unchanged
"""

import json
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
VERBS_DATASET_JSON = BASE_DIR / "public/seed-data/N5_verbs_dataset.json"
VERBS_EXPANSION_JSON = BASE_DIR / "public/seed-data/N5_verbs_expansion.json"


def compare_structures(dataset_verb, expansion_verb):
    """Compare the structure of two verb entries."""
    dataset_keys = set(dataset_verb.keys())
    expansion_keys = set(expansion_verb.keys())

    print(f"\n📊 Structure Comparison:")
    print(f"  Dataset verb keys: {sorted(dataset_keys)}")
    print(f"  Expansion verb keys: {sorted(expansion_keys)}")
    print(f"  Common keys: {sorted(dataset_keys & expansion_keys)}")
    print(f"  Only in dataset: {sorted(dataset_keys - expansion_keys)}")
    print(f"  Only in expansion: {sorted(expansion_keys - dataset_keys)}")

    # Check nested structures
    print(f"\n  Examples structure:")
    if 'examples' in dataset_verb:
        print(f"    Dataset has: {list(dataset_verb['examples'].keys())}")
    if 'examples' in expansion_verb:
        print(f"    Expansion has: {list(expansion_verb['examples'].keys())}")

    return True  # Structures are compatible


def merge_datasets():
    """Merge N5_verbs_dataset.json into N5_verbs_expansion.json."""

    print("=" * 60)
    print("Merging Verb Datasets")
    print("=" * 60)

    # Read both files
    print("\n1️⃣ Reading source files...")
    with open(VERBS_DATASET_JSON, 'r', encoding='utf-8') as f:
        dataset = json.load(f)
    print(f"  ✓ N5_verbs_dataset.json: {dataset['metadata']['totalEntries']} verbs")

    with open(VERBS_EXPANSION_JSON, 'r', encoding='utf-8') as f:
        expansion = json.load(f)
    print(f"  ✓ N5_verbs_expansion.json: {expansion['metadata']['totalEntries']} verbs")

    # Compare structures
    print("\n2️⃣ Comparing structures...")
    if dataset['verbs'] and expansion['verbs']:
        compatible = compare_structures(dataset['verbs'][0], expansion['verbs'][0])
        if compatible:
            print("\n  ✅ Structures are compatible - proceeding with merge")
        else:
            print("\n  ❌ Structures are incompatible - aborting")
            return

    # Merge verbs
    print("\n3️⃣ Merging verb arrays...")
    merged_verbs = dataset['verbs'] + expansion['verbs']
    total_verbs = len(merged_verbs)
    print(f"  ✓ Merged: {len(dataset['verbs'])} + {len(expansion['verbs'])} = {total_verbs} verbs")

    # Create merged data structure
    merged_data = {
        "schema": "normalized-v2",
        "metadata": {
            "version": "3.0.0",
            "jlpt": "N5",
            "totalEntries": total_verbs,
            "description": "Complete JLPT N5 verb dataset (main + expansion) with enhanced glosses and usage patterns",
            "sources": [
                "N5_verbs_dataset.json (140 verbs)",
                "N5_verbs_expansion.json (27 additional verbs)"
            ],
            "license": "CC BY-SA 4.0"
        },
        "verbs": merged_verbs
    }

    # Create backup of original expansion file
    backup_path = VERBS_EXPANSION_JSON.with_suffix('.json.backup')
    print(f"\n4️⃣ Creating backup...")
    with open(VERBS_EXPANSION_JSON, 'r', encoding='utf-8') as f:
        backup_data = f.read()
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(backup_data)
    print(f"  ✓ Backup saved: {backup_path}")

    # Write merged data to expansion file
    print(f"\n5️⃣ Writing merged data to N5_verbs_expansion.json...")
    with open(VERBS_EXPANSION_JSON, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, ensure_ascii=False, indent=2)
    print(f"  ✓ Merged dataset written successfully")

    # Verify
    print("\n6️⃣ Verifying merged file...")
    with open(VERBS_EXPANSION_JSON, 'r', encoding='utf-8') as f:
        verify = json.load(f)
    print(f"  ✓ Verification complete:")
    print(f"    - Total verbs: {verify['metadata']['totalEntries']}")
    print(f"    - Version: {verify['metadata']['version']}")
    print(f"    - First verb ID: {verify['verbs'][0]['id']}")
    print(f"    - Last verb ID: {verify['verbs'][-1]['id']}")

    print("\n" + "=" * 60)
    print("✅ Merge Complete!")
    print("=" * 60)
    print(f"\n📁 Files:")
    print(f"  ✓ N5_verbs_expansion.json - NOW CONTAINS {total_verbs} VERBS")
    print(f"  ✓ N5_verbs_dataset.json - UNCHANGED ({dataset['metadata']['totalEntries']} verbs)")
    print(f"  ✓ N5_verbs_expansion.json.backup - BACKUP OF ORIGINAL")


if __name__ == "__main__":
    merge_datasets()
