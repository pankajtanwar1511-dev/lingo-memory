#!/usr/bin/env python3
"""
Dataset Validation and Cleanup Script

Fixes all common data integrity issues:
- Missing or invalid fields
- Empty arrays vs undefined
- Invalid nested objects
- Type mismatches
"""

import json
import sys
from pathlib import Path
from typing import Any, Dict, List


class DatasetValidator:
    """Validates and fixes vocabulary dataset"""

    def __init__(self):
        self.stats = {
            'total_cards': 0,
            'fixed_examples': 0,
            'fixed_audio_url': 0,
            'fixed_license': 0,
            'fixed_tags': 0,
            'fixed_part_of_speech': 0,
            'fixed_source': 0,
            'fixed_example_source': 0,
            'invalid_cards': []
        }

    def validate_and_fix_card(self, card: Dict[str, Any], index: int) -> Dict[str, Any]:
        """Validate and fix a single vocabulary card"""
        self.stats['total_cards'] += 1

        # Required fields
        if 'id' not in card or not card['id']:
            card['id'] = f"card_{index}"
            print(f"  ⚠️  Card {index}: Missing ID, generated: {card['id']}")

        if 'kana' not in card or not card['kana']:
            self.stats['invalid_cards'].append({
                'index': index,
                'id': card.get('id', 'unknown'),
                'reason': 'Missing required field: kana'
            })
            print(f"  ❌ Card {index} ({card.get('id')}): Missing required 'kana' field")

        if 'meaning' not in card or not card['meaning']:
            self.stats['invalid_cards'].append({
                'index': index,
                'id': card.get('id', 'unknown'),
                'reason': 'Missing required field: meaning'
            })
            print(f"  ❌ Card {index} ({card.get('id')}): Missing required 'meaning' field")

        # Fix examples field
        if 'examples' not in card:
            card['examples'] = []
            self.stats['fixed_examples'] += 1
        elif card['examples'] is None:
            card['examples'] = []
            self.stats['fixed_examples'] += 1
        elif not isinstance(card['examples'], list):
            print(f"  ⚠️  Card {index} ({card.get('id')}): examples is not a list, converting")
            card['examples'] = []
            self.stats['fixed_examples'] += 1

        # Fix examples source objects
        for i, example in enumerate(card.get('examples', [])):
            if 'source' not in example or not isinstance(example['source'], dict):
                example['source'] = {'type': 'custom'}
                self.stats['fixed_example_source'] += 1
            elif 'type' not in example['source']:
                example['source']['type'] = 'custom'
                self.stats['fixed_example_source'] += 1

        # Fix audioUrl field
        if 'audioUrl' not in card:
            card['audioUrl'] = ''
            self.stats['fixed_audio_url'] += 1
        elif card['audioUrl'] is None:
            card['audioUrl'] = ''
            self.stats['fixed_audio_url'] += 1

        # Fix license field (should be object with text + optional url)
        if 'license' not in card or card['license'] is None:
            card['license'] = {
                'text': 'CC BY-SA 4.0',
                'url': 'https://creativecommons.org/licenses/by-sa/4.0/'
            }
            self.stats['fixed_license'] += 1
        elif not isinstance(card['license'], dict):
            # Convert string license to object
            license_text = str(card['license'])
            card['license'] = {
                'text': license_text,
                'url': 'https://creativecommons.org/licenses/by-sa/4.0/'
            }
            self.stats['fixed_license'] += 1
        elif 'text' not in card['license']:
            card['license']['text'] = 'CC BY-SA 4.0'
            self.stats['fixed_license'] += 1

        # Fix tags field
        if 'tags' not in card:
            card['tags'] = []
            self.stats['fixed_tags'] += 1
        elif card['tags'] is None:
            card['tags'] = []
            self.stats['fixed_tags'] += 1
        elif not isinstance(card['tags'], list):
            card['tags'] = []
            self.stats['fixed_tags'] += 1

        # Fix partOfSpeech field
        if 'partOfSpeech' not in card:
            card['partOfSpeech'] = []
            self.stats['fixed_part_of_speech'] += 1
        elif card['partOfSpeech'] is None:
            card['partOfSpeech'] = []
            self.stats['fixed_part_of_speech'] += 1
        elif not isinstance(card['partOfSpeech'], list):
            card['partOfSpeech'] = []
            self.stats['fixed_part_of_speech'] += 1

        # Fix source field (top-level card source)
        if 'source' not in card or card['source'] is None:
            card['source'] = {
                'type': 'jlpt-vocab-api',
                'url': 'https://jlpt-vocab-api.vercel.app'
            }
            self.stats['fixed_source'] += 1
        elif not isinstance(card['source'], dict):
            card['source'] = {
                'type': 'jlpt-vocab-api',
                'url': 'https://jlpt-vocab-api.vercel.app'
            }
            self.stats['fixed_source'] += 1

        return card

    def validate_dataset(self, input_file: Path, output_file: Path) -> bool:
        """Validate and fix entire dataset"""

        print(f"\n{'='*70}")
        print("Dataset Validation and Cleanup")
        print(f"{'='*70}\n")

        # Load data
        print(f"📖 Loading dataset from {input_file}...")
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            print(f"❌ Failed to load dataset: {e}")
            return False

        # Validate structure
        if 'vocabulary' not in data:
            print("❌ Invalid dataset: missing 'vocabulary' field")
            return False

        if not isinstance(data['vocabulary'], list):
            print("❌ Invalid dataset: 'vocabulary' is not a list")
            return False

        print(f"   ✅ Loaded {len(data['vocabulary'])} cards\n")

        # Fix metadata
        if 'metadata' not in data:
            data['metadata'] = {}

        # Validate and fix each card
        print("🔍 Validating and fixing cards...")
        fixed_cards = []

        for index, card in enumerate(data['vocabulary']):
            try:
                fixed_card = self.validate_and_fix_card(card, index)
                fixed_cards.append(fixed_card)
            except Exception as e:
                print(f"  ❌ Card {index}: Unhandled error: {e}")
                self.stats['invalid_cards'].append({
                    'index': index,
                    'id': card.get('id', 'unknown'),
                    'reason': f'Unhandled error: {e}'
                })

        data['vocabulary'] = fixed_cards

        # Print statistics
        print(f"\n📊 Validation Statistics:")
        print(f"   Total cards: {self.stats['total_cards']}")
        print(f"   Fixed missing examples field: {self.stats['fixed_examples']}")
        print(f"   Fixed missing audioUrl field: {self.stats['fixed_audio_url']}")
        print(f"   Fixed missing/invalid license field: {self.stats['fixed_license']}")
        print(f"   Fixed missing tags field: {self.stats['fixed_tags']}")
        print(f"   Fixed missing partOfSpeech field: {self.stats['fixed_part_of_speech']}")
        print(f"   Fixed missing source field: {self.stats['fixed_source']}")
        print(f"   Fixed example source objects: {self.stats['fixed_example_source']}")
        print(f"   Invalid cards (errors): {len(self.stats['invalid_cards'])}")

        if self.stats['invalid_cards']:
            print(f"\n⚠️  Invalid cards:")
            for invalid in self.stats['invalid_cards']:
                print(f"   - Card {invalid['index']} ({invalid['id']}): {invalid['reason']}")

        # Save fixed data
        print(f"\n💾 Saving validated dataset to {output_file}...")
        try:
            output_file.parent.mkdir(parents=True, exist_ok=True)
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print("   ✅ Saved successfully")
        except Exception as e:
            print(f"   ❌ Failed to save: {e}")
            return False

        print(f"\n✅ Validation complete!")
        print(f"{'='*70}\n")

        return len(self.stats['invalid_cards']) == 0


def main():
    """Main entry point"""

    # Default paths
    input_file = Path('public/seed-data/n5-comprehensive.json')
    output_file = Path('public/seed-data/n5-comprehensive.json')

    # Allow custom paths via command line
    if len(sys.argv) > 1:
        input_file = Path(sys.argv[1])

    if len(sys.argv) > 2:
        output_file = Path(sys.argv[2])
    else:
        # If no output specified, overwrite input
        output_file = input_file

    if not input_file.exists():
        print(f"❌ Input file not found: {input_file}")
        sys.exit(1)

    # Validate and fix
    validator = DatasetValidator()
    success = validator.validate_dataset(input_file, output_file)

    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
