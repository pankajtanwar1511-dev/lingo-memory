#!/usr/bin/env python3
"""
Phase 4: Comprehensive N5 Dataset Validation

Validates the complete N5 dataset after all enrichment phases.
Stricter than general validation - enforces N5-specific rules.

Checks:
- Schema compliance (required fields, types)
- JLPT level consistency (all cards must be N5)
- Example quality (length ≤40 chars, word matching)
- License metadata presence
- needsReview flagging for generated content
- Token-level word matching using morphological analysis

Input: data/n5-phase3/n5_with_generated.json
Output: reports/n5-phase4/metrics.json, reports/n5-phase4/fail_list.json

Usage:
    python3 scripts/phase4_validate_n5.py \
        --input data/n5-phase3/n5_with_generated.json \
        --output-dir reports/n5-phase4
"""

import json
import sys
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional
from collections import defaultdict

# Morphological analyzer for Japanese
try:
    import fugashi
    FUGASHI_AVAILABLE = True
except ImportError:
    FUGASHI_AVAILABLE = False
    print("⚠️  fugashi not available. Word matching will use simple substring search.")

# Kana/romaji conversion
try:
    import pykakasi
    PYKAKASI_AVAILABLE = True
except ImportError:
    PYKAKASI_AVAILABLE = False


class N5Validator:
    """Comprehensive validator for N5 dataset"""

    def __init__(self):
        self.errors: List[Dict[str, Any]] = []
        self.warnings: List[Dict[str, Any]] = []
        self.stats = defaultdict(int)

        # Initialize morphological analyzer
        if FUGASHI_AVAILABLE:
            try:
                self.tagger = fugashi.Tagger()
            except RuntimeError:
                print("⚠️  Failed to initialize fugashi. Install unidic: pip install unidic-lite")
                self.tagger = None
        else:
            self.tagger = None

    def add_error(self, card_id: str, field: str, message: str) -> None:
        """Add validation error"""
        self.errors.append({
            'card_id': card_id,
            'field': field,
            'message': message,
            'severity': 'error'
        })
        self.stats['errors'] += 1

    def add_warning(self, card_id: str, field: str, message: str) -> None:
        """Add validation warning"""
        self.warnings.append({
            'card_id': card_id,
            'field': field,
            'message': message,
            'severity': 'warning'
        })
        self.stats['warnings'] += 1

    def validate_required_fields(self, card: Dict[str, Any], card_idx: int) -> bool:
        """Validate required fields are present"""
        card_id = card.get('id', f'unknown_{card_idx}')

        required_fields = ['id', 'kana', 'meaning', 'jlptLevel']

        for field in required_fields:
            if field not in card or not card[field]:
                self.add_error(card_id, field, f"Required field '{field}' is missing or empty")
                return False

        return True

    def validate_jlpt_level(self, card: Dict[str, Any]) -> bool:
        """Validate JLPT level is N5"""
        card_id = card['id']
        jlpt_level = card.get('jlptLevel', '')

        if jlpt_level != 'N5':
            self.add_error(card_id, 'jlptLevel', f"Expected 'N5', got '{jlpt_level}'")
            return False

        return True

    def validate_id_format(self, card: Dict[str, Any]) -> bool:
        """Validate ID format (n5_vocab_XXXX)"""
        card_id = card.get('id', '')

        if not card_id.startswith('n5_vocab_'):
            self.add_error(card_id, 'id', f"ID must start with 'n5_vocab_', got '{card_id}'")
            return False

        return True

    def validate_meaning(self, card: Dict[str, Any]) -> bool:
        """Validate meaning field"""
        card_id = card['id']
        meaning = card.get('meaning', [])

        if isinstance(meaning, str):
            # Convert to list
            card['meaning'] = [meaning]
            meaning = card['meaning']

        if not isinstance(meaning, list) or len(meaning) == 0:
            self.add_error(card_id, 'meaning', "Meaning must be a non-empty list")
            return False

        return True

    def tokenize_japanese(self, text: str) -> List[str]:
        """Tokenize Japanese text into morphemes"""
        if self.tagger:
            tokens = []
            for word in self.tagger(text):
                tokens.append(word.surface)
            return tokens
        else:
            # Fallback: character-level split
            return list(text)

    def word_in_sentence(self, word_kanji: str, word_kana: str, sentence: str) -> bool:
        """Check if word appears in sentence (morphological analysis)"""

        # Simple substring match first
        if word_kanji and word_kanji in sentence:
            return True
        if word_kana and word_kana in sentence:
            return True

        # Token-level match (if fugashi available)
        if self.tagger:
            tokens = self.tokenize_japanese(sentence)

            # Check if word matches any token
            for token in tokens:
                if word_kanji and word_kanji == token:
                    return True
                if word_kana and word_kana == token:
                    return True

        return False

    def validate_examples(self, card: Dict[str, Any]) -> bool:
        """Validate example sentences"""
        card_id = card['id']
        examples = card.get('examples', [])

        if not isinstance(examples, list):
            self.add_error(card_id, 'examples', "Examples must be a list")
            return False

        # Check if card has examples
        if len(examples) == 0:
            self.add_warning(card_id, 'examples', "Card has no examples")
            self.stats['cards_without_examples'] += 1
            return True

        self.stats['cards_with_examples'] += 1

        # Validate each example
        for ex_idx, example in enumerate(examples):
            self.validate_single_example(card, example, ex_idx)

        return True

    def validate_single_example(self, card: Dict[str, Any], example: Dict[str, Any], ex_idx: int) -> bool:
        """Validate a single example sentence"""
        card_id = card['id']
        word_kanji = card.get('kanji', '')
        word_kana = card.get('kana', '')

        # Required fields
        if 'japanese' not in example or not example['japanese']:
            self.add_error(card_id, f'examples[{ex_idx}].japanese', "Japanese text is required")
            return False

        if 'english' not in example or not example['english']:
            self.add_error(card_id, f'examples[{ex_idx}].english', "English translation is required")
            return False

        japanese = example['japanese']
        english = example['english']

        # Length check (N5 specific: ≤40 chars)
        if len(japanese) > 40:
            self.add_warning(card_id, f'examples[{ex_idx}].japanese',
                           f"Sentence too long for N5 ({len(japanese)} chars, max 40)")
            self.stats['example_too_long'] += 1

        # Word matching
        if not self.word_in_sentence(word_kanji, word_kana, japanese):
            self.add_warning(card_id, f'examples[{ex_idx}].japanese',
                           f"Target word not found in example: {japanese}")
            self.stats['word_not_in_example'] += 1

        # Source metadata
        if 'source' not in example:
            self.add_error(card_id, f'examples[{ex_idx}].source', "Source metadata is required")
            return False

        source = example['source']
        if 'type' not in source:
            self.add_error(card_id, f'examples[{ex_idx}].source.type', "Source type is required")
            return False

        source_type = source['type']
        if source_type not in ['tatoeba', 'jmdict', 'custom', 'generated']:
            self.add_error(card_id, f'examples[{ex_idx}].source.type',
                         f"Invalid source type: {source_type}")
            return False

        # Track source types
        self.stats[f'examples_from_{source_type}'] += 1

        # Validate generated content
        if source_type == 'generated':
            if not example.get('needsReview', False):
                self.add_error(card_id, f'examples[{ex_idx}].needsReview',
                             "Generated examples must have needsReview: true")

            if 'model' not in source or 'provider' not in source:
                self.add_error(card_id, f'examples[{ex_idx}].source',
                             "Generated examples must include model and provider")

            self.stats['examples_needing_review'] += 1

        # License check
        if 'license' not in example:
            self.add_error(card_id, f'examples[{ex_idx}].license', "License metadata is required")
            return False

        return True

    def validate_card(self, card: Dict[str, Any], card_idx: int) -> None:
        """Validate a single vocabulary card"""
        self.stats['total_cards'] += 1

        # Required fields
        if not self.validate_required_fields(card, card_idx):
            return

        # JLPT level
        if not self.validate_jlpt_level(card):
            return

        # ID format
        self.validate_id_format(card)

        # Meaning
        self.validate_meaning(card)

        # Examples
        self.validate_examples(card)

    def validate_dataset(self, data: Dict[str, Any]) -> None:
        """Validate entire dataset"""
        # Check top-level structure
        if 'version' not in data:
            self.add_warning('dataset', 'version', "Dataset version is missing")

        if 'metadata' not in data:
            self.add_warning('dataset', 'metadata', "Dataset metadata is missing")

        if 'vocabulary' not in data:
            self.add_error('dataset', 'vocabulary', "Vocabulary array is missing")
            return

        cards = data['vocabulary']

        if not isinstance(cards, list):
            self.add_error('dataset', 'vocabulary', "Vocabulary must be a list")
            return

        print(f"\n🔍 Validating {len(cards)} N5 cards...")

        # Validate each card
        for idx, card in enumerate(cards):
            self.validate_card(card, idx)

            if (idx + 1) % 100 == 0:
                print(f"   Validated {idx + 1}/{len(cards)} cards...")

        print(f"   ✅ Validated {len(cards)} cards")

    def print_summary(self) -> None:
        """Print validation summary"""
        print("\n" + "=" * 60)
        print("📊 VALIDATION SUMMARY")
        print("=" * 60)
        print(f"Total cards:              {self.stats['total_cards']}")
        print(f"Cards with examples:      {self.stats['cards_with_examples']}")
        print(f"Cards without examples:   {self.stats['cards_without_examples']}")
        print()
        print(f"Total errors:             {self.stats['errors']}")
        print(f"Total warnings:           {self.stats['warnings']}")
        print()
        print("Example Sources:")
        print(f"  - Tatoeba:              {self.stats['examples_from_tatoeba']}")
        print(f"  - Generated (AI):       {self.stats['examples_from_generated']}")
        print(f"  - Custom:               {self.stats['examples_from_custom']}")
        print(f"  - JMdict:               {self.stats['examples_from_jmdict']}")
        print()
        print(f"Examples needing review:  {self.stats['examples_needing_review']}")
        print()

        if self.stats['errors'] == 0:
            print("✅ VALIDATION PASSED (0 errors)")
        else:
            print(f"❌ VALIDATION FAILED ({self.stats['errors']} errors)")

        print("=" * 60)

    def save_reports(self, output_dir: Path) -> None:
        """Save validation reports"""
        output_dir.mkdir(parents=True, exist_ok=True)

        # Metrics report
        metrics = {
            'total_cards': self.stats['total_cards'],
            'cards_with_examples': self.stats['cards_with_examples'],
            'cards_without_examples': self.stats['cards_without_examples'],
            'error_count': self.stats['errors'],
            'warning_count': self.stats['warnings'],
            'examples_from_tatoeba': self.stats['examples_from_tatoeba'],
            'examples_from_generated': self.stats['examples_from_generated'],
            'examples_needing_review': self.stats['examples_needing_review'],
            'pass': self.stats['errors'] == 0
        }

        metrics_file = output_dir / 'metrics.json'
        with open(metrics_file, 'w', encoding='utf-8') as f:
            json.dump(metrics, f, ensure_ascii=False, indent=2)
        print(f"\n💾 Saved metrics: {metrics_file}")

        # Failure list
        fail_list = {
            'errors': self.errors,
            'warnings': self.warnings[:100]  # Limit warnings to first 100
        }

        fail_file = output_dir / 'fail_list.json'
        with open(fail_file, 'w', encoding='utf-8') as f:
            json.dump(fail_list, f, ensure_ascii=False, indent=2)
        print(f"💾 Saved failure list: {fail_file}")


def main():
    parser = argparse.ArgumentParser(description="Phase 4: Validate N5 dataset")
    parser.add_argument("--input", required=True, help="Input N5 JSON file (from Phase 3)")
    parser.add_argument("--output-dir", default="reports/n5-phase4", help="Output directory for reports")

    args = parser.parse_args()

    print("🚀 Phase 4: Validating N5 Dataset")
    print("=" * 60)
    print(f"Input:       {args.input}")
    print(f"Output dir:  {args.output_dir}")
    print()

    # Load dataset
    print("📥 Loading N5 dataset...")
    with open(args.input, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Initialize validator
    validator = N5Validator()

    # Validate
    validator.validate_dataset(data)

    # Print summary
    validator.print_summary()

    # Save reports
    validator.save_reports(Path(args.output_dir))

    print("\n✅ Phase 4 Complete!")
    print(f"   Metrics: {args.output_dir}/metrics.json")
    print(f"   Failures: {args.output_dir}/fail_list.json")

    # Exit code
    sys.exit(0 if validator.stats['errors'] == 0 else 1)


if __name__ == "__main__":
    main()
