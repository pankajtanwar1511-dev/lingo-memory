#!/usr/bin/env python3
"""
Script to update verb image prompts:
1. Add "Draw an image in 1:1 ratio of " at the start of each prompt
2. Works for all THREAD_*_DETAILED.txt files
"""

import re
import os

def update_file(filename):
    """Update a single THREAD file with the new prompt format."""

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into lines for processing
    lines = content.split('\n')
    updated_lines = []

    i = 0
    while i < len(lines):
        line = lines[i]

        # Check if this is a separator line (dashes)
        if line.startswith('─' * 20):
            updated_lines.append(line)
            i += 1

            # The next line should be the prompt (if it exists and isn't empty)
            if i < len(lines) and lines[i].strip() and not lines[i].startswith('SAVE AS'):
                prompt_line = lines[i]

                # Check if it starts with common prompt beginnings
                # and doesn't already have "Draw an image"
                if not prompt_line.startswith('Draw an image'):
                    # Add the prefix
                    if prompt_line.startswith('A '):
                        updated_lines.append('Draw an image in 1:1 ratio of a ' + prompt_line[2:])
                    elif prompt_line.startswith('An '):
                        updated_lines.append('Draw an image in 1:1 ratio of an ' + prompt_line[3:])
                    elif prompt_line.startswith('Two '):
                        updated_lines.append('Draw an image in 1:1 ratio of two ' + prompt_line[4:])
                    elif prompt_line.startswith('Three '):
                        updated_lines.append('Draw an image in 1:1 ratio of three ' + prompt_line[6:])
                    else:
                        # For any other starting word, just prepend
                        updated_lines.append('Draw an image in 1:1 ratio: ' + prompt_line)
                else:
                    updated_lines.append(prompt_line)
                i += 1
            else:
                continue
        else:
            updated_lines.append(line)
            i += 1

    # Write back
    with open(filename, 'w', encoding='utf-8') as f:
        f.write('\n'.join(updated_lines))

    print(f"✓ Updated {filename}")

def main():
    """Update all THREAD files."""
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Find all THREAD files
    thread_files = [
        'THREAD_1_VERBS_001-054_DETAILED.txt',
        'THREAD_2_VERBS_055-108_DETAILED.txt',
        'THREAD_3_VERBS_109-162_DETAILED.txt',
        'THREAD_4_VERBS_163-216_DETAILED.txt',
        'THREAD_5_VERBS_217-270_DETAILED.txt'
    ]

    for filename in thread_files:
        filepath = os.path.join(script_dir, filename)
        if os.path.exists(filepath):
            update_file(filepath)
        else:
            print(f"✗ File not found: {filename}")

    print("\nAll files updated successfully!")
    print("Each prompt now starts with: 'Draw an image in 1:1 ratio of...'")

if __name__ == '__main__':
    main()
