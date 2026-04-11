#!/usr/bin/env python3
"""
Extract expected text labels from THREAD files to create a mapping reference
"""

import json
import re
from pathlib import Path

def extract_thread_mappings():
    """Extract verb ID -> expected text label from THREAD files"""

    mapping = {}

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

        # Find all verb entries with their text labels
        # Pattern: VERB XXX: n5_v_XXXX - Japanese (text label)
        # Text label appears in prompt with "bold black text "LABEL""

        # Split by VERB entries
        verb_blocks = re.split(r'\nVERB \d+(?:\s+\(Extended\))?:', content)

        for block in verb_blocks[1:]:  # Skip first empty block
            # Extract verb ID
            id_match = re.search(r'n5_v_(\d+)', block)
            if not id_match:
                continue

            verb_num = id_match.group(1)
            verb_id = f"n5_v_{verb_num}"

            # Extract text label from prompt
            # Look for patterns like: "TO MEET", "TO WALK", etc.
            text_match = re.search(r'(?:bold black text |with text )"([^"]+)"', block, re.IGNORECASE)

            if text_match:
                text_label = text_match.group(1).strip()
                mapping[verb_id] = text_label
                print(f"{verb_id}: {text_label}")

    return mapping

def create_csv_mapping():
    """Create CSV file for manual matching reference"""

    mapping = extract_thread_mappings()

    output_file = Path("/home/pankaj/bumble/lingomemory/scripts/verb_id_to_text.csv")

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("verb_id,expected_text_label\n")
        for verb_id in sorted(mapping.keys(), key=lambda x: int(x.split('_')[2])):
            f.write(f"{verb_id},{mapping[verb_id]}\n")

    print(f"\n✓ Created mapping file: {output_file}")
    print(f"✓ Total verbs mapped: {len(mapping)}")

if __name__ == '__main__':
    create_csv_mapping()
