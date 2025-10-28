#!/usr/bin/env python3
"""
Prepare Verification Prompt for Claude AI

Combines the verification template with a specific batch file to create
a ready-to-paste prompt for Claude AI.
"""

import json
import sys
from pathlib import Path

def prepare_verification_prompt(batch_number: int):
    """Prepare verification prompt for a specific batch"""

    # Load template
    template_file = Path('data/ai-verification-batches/VERIFICATION_PROMPT_TEMPLATE.md')
    with open(template_file, 'r', encoding='utf-8') as f:
        template = f.read()

    # Load batch
    batch_file = Path(f'data/ai-verification-batches/batch_{batch_number:02d}_of_38.json')
    if not batch_file.exists():
        print(f"❌ Batch file not found: {batch_file}")
        sys.exit(1)

    with open(batch_file, 'r', encoding='utf-8') as f:
        batch = json.load(f)

    # Replace placeholders
    prompt = template.replace('[BATCH_NUMBER]', str(batch['batch_number']))
    prompt = prompt.replace('[EXAMPLES_COUNT]', str(batch['examples_in_batch']))

    # Format examples as readable JSON
    examples_json = json.dumps(batch['examples'], ensure_ascii=False, indent=2)
    prompt = prompt.replace('[PASTE EXAMPLES JSON HERE]', examples_json)

    # Save to output file
    output_file = Path(f'data/ai-verification-batches/PROMPT_BATCH_{batch_number:02d}.md')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(prompt)

    print(f"✅ Verification prompt created: {output_file}")
    print(f"   Batch: {batch_number}/38")
    print(f"   Examples: {batch['examples_in_batch']}")
    print(f"\n📋 Ready to use:")
    print(f"   1. Open {output_file}")
    print(f"   2. Copy entire contents")
    print(f"   3. Paste into Claude AI")
    print(f"   4. Collect JSON results")

    return output_file


def prepare_all_prompts():
    """Prepare verification prompts for all 38 batches"""

    print("=" * 70)
    print("Preparing Verification Prompts for All Batches")
    print("=" * 70)

    output_dir = Path('data/ai-verification-batches')

    for batch_num in range(1, 39):
        batch_file = output_dir / f'batch_{batch_num:02d}_of_38.json'

        if not batch_file.exists():
            print(f"⚠️  Skipping batch {batch_num}: file not found")
            continue

        with open(batch_file, 'r', encoding='utf-8') as f:
            batch = json.load(f)

        # Load template
        template_file = output_dir / 'VERIFICATION_PROMPT_TEMPLATE.md'
        with open(template_file, 'r', encoding='utf-8') as f:
            template = f.read()

        # Replace placeholders
        prompt = template.replace('[BATCH_NUMBER]', str(batch['batch_number']))
        prompt = prompt.replace('[EXAMPLES_COUNT]', str(batch['examples_in_batch']))

        # Format examples
        examples_json = json.dumps(batch['examples'], ensure_ascii=False, indent=2)
        prompt = prompt.replace('[PASTE EXAMPLES JSON HERE]', examples_json)

        # Save
        output_file = output_dir / f'PROMPT_BATCH_{batch_num:02d}.md'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(prompt)

        print(f"   ✅ Batch {batch_num:2d}: {batch['examples_in_batch']} examples → {output_file.name}")

    print(f"\n✅ All verification prompts created!")
    print(f"   Location: {output_dir}/")
    print(f"   Files: PROMPT_BATCH_01.md through PROMPT_BATCH_38.md")
    print("=" * 70)


if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == 'all':
            prepare_all_prompts()
        else:
            try:
                batch_num = int(sys.argv[1])
                if 1 <= batch_num <= 38:
                    prepare_verification_prompt(batch_num)
                else:
                    print(f"❌ Batch number must be between 1 and 38")
                    sys.exit(1)
            except ValueError:
                print(f"❌ Invalid batch number: {sys.argv[1]}")
                sys.exit(1)
    else:
        # Default: prepare first batch as example
        print("Usage: python3 scripts/prepare_verification_prompt.py [batch_number|all]")
        print("\nPreparing first batch as example...\n")
        prepare_verification_prompt(1)
