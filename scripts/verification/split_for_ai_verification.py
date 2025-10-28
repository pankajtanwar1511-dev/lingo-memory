#!/usr/bin/env python3
"""
Split N5 Examples for AI Verification

Splits 1,871 examples into smaller files (~50 each) for Claude AI verification.
Only includes essential information to minimize context usage.
"""

import json
from pathlib import Path
from typing import List, Dict

def split_examples_for_verification():
    """Split examples into batches for AI verification"""

    print("=" * 70)
    print("Splitting N5 Examples for AI Verification")
    print("=" * 70)

    # Load N5 comprehensive data
    input_file = Path('public/seed-data/n5-comprehensive.json')
    print(f"\n📖 Loading: {input_file}")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    vocab_cards = data['vocabulary']
    print(f"   ✅ Loaded {len(vocab_cards)} vocabulary cards")

    # Extract all examples with their target vocabulary
    all_verification_items = []

    for card in vocab_cards:
        if not card.get('examples'):
            continue

        # Target vocabulary info
        target = {
            'kanji': card.get('kanji', ''),
            'kana': card['kana'],
            'meaning': card['meaning'] if isinstance(card['meaning'], str) else card['meaning'][0]
        }

        # Each example
        for idx, example in enumerate(card['examples']):
            item = {
                'card_id': card['id'],
                'example_index': idx,
                'target_vocab': target,
                'sentence': {
                    'japanese': example['japanese'],
                    'kana': example.get('hiragana', example.get('kana', '')),
                    'english': example.get('english', ''),
                    'source': example.get('source', {}).get('type', 'unknown')
                }
            }
            all_verification_items.append(item)

    print(f"   ✅ Extracted {len(all_verification_items)} examples")

    # Split into batches
    batch_size = 50
    batches = []
    for i in range(0, len(all_verification_items), batch_size):
        batch = all_verification_items[i:i + batch_size]
        batches.append(batch)

    print(f"\n📦 Creating {len(batches)} batch files (~{batch_size} examples each)")

    # Create output directory
    output_dir = Path('data/ai-verification-batches')
    output_dir.mkdir(parents=True, exist_ok=True)

    # Save each batch
    for batch_num, batch in enumerate(batches, 1):
        batch_file = output_dir / f'batch_{batch_num:02d}_of_{len(batches):02d}.json'

        batch_data = {
            'batch_number': batch_num,
            'total_batches': len(batches),
            'examples_in_batch': len(batch),
            'verification_instructions': {
                'task': 'Verify each example for N5 appropriateness',
                'check': [
                    '1. Does sentence contain the target vocabulary word?',
                    '2. Does kana reading match the Japanese sentence correctly?',
                    '3. Does sentence use ONLY N5 grammar patterns?',
                    '4. Rate difficulty from 1-10 (within N5 range)',
                    '5. Recommend: accept/review/reject'
                ],
                'output_format': 'For each example, return JSON with: target_vocab_present, kana_accuracy, n5_grammar_check, difficulty_rating, recommendation'
            },
            'examples': batch
        }

        with open(batch_file, 'w', encoding='utf-8') as f:
            json.dump(batch_data, f, ensure_ascii=False, indent=2)

        print(f"   ✅ Batch {batch_num:2d}: {len(batch)} examples → {batch_file.name}")

    # Create master index
    index_file = output_dir / 'INDEX.json'
    index_data = {
        'total_examples': len(all_verification_items),
        'total_batches': len(batches),
        'batch_size': batch_size,
        'files': [f'batch_{i:02d}_of_{len(batches):02d}.json' for i in range(1, len(batches) + 1)],
        'instructions': 'Process each batch file sequentially. Each contains ~50 examples to verify.'
    }

    with open(index_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)

    print(f"\n📋 Index file: {index_file}")

    # Create README
    readme_file = output_dir / 'README.md'
    readme_content = f"""# AI Verification Batches

## Summary

- **Total Examples**: {len(all_verification_items)}
- **Total Batches**: {len(batches)}
- **Examples per batch**: ~{batch_size}

## File Structure

Each batch file contains:
```json
{{
  "batch_number": 1,
  "total_batches": {len(batches)},
  "examples_in_batch": 50,
  "verification_instructions": {{...}},
  "examples": [
    {{
      "card_id": "n5_vocab_0001",
      "example_index": 0,
      "target_vocab": {{
        "kanji": "食べる",
        "kana": "たべる",
        "meaning": "to eat"
      }},
      "sentence": {{
        "japanese": "私は毎日朝ごはんを食べます。",
        "english": "I eat breakfast every day.",
        "source": "tatoeba"
      }}
    }}
  ]
}}
```

## How to Use

1. Feed each batch file to Claude AI
2. Use the comprehensive verification prompt
3. Collect results for each batch
4. Combine all results for final report

## Batch Files

{chr(10).join(f'- batch_{i:02d}_of_{len(batches):02d}.json' for i in range(1, len(batches) + 1))}

## Processing Status

- [ ] Batch 01
- [ ] Batch 02
- [ ] Batch 03
...
- [ ] Batch {len(batches):02d}
"""

    with open(readme_file, 'w', encoding='utf-8') as f:
        f.write(readme_content)

    print(f"📄 README: {readme_file}")

    print(f"\n✅ Split complete!")
    print(f"   Output: {output_dir}/")
    print(f"   Files: {len(batches)} batch files + INDEX.json + README.md")

    print("=" * 70)


if __name__ == '__main__':
    split_examples_for_verification()
