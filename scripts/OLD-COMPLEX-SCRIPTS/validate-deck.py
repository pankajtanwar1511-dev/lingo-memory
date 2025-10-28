#!/usr/bin/env python3
"""
Dataset Validator for Japanese Vocabulary Cards

Validates vocabulary card datasets for:
- Schema compliance (required fields, types)
- Example quality (contains target word, appropriate length)
- Audio file existence
- License metadata presence

Outputs:
- fail_list.json: All validation failures with reasons
- metrics.json: Coverage stats, pass rates, quality metrics

Usage:
    python3 scripts/validate-deck.py --input public/seed-data/n5-comprehensive.json
    python3 scripts/validate-deck.py --input public/seed-data/n4-comprehensive.json --output-dir validation-results/
"""

import json
import os
import sys
import argparse
from pathlib import Path
from typing import Dict, List, Any, Tuple
from collections import defaultdict

# Try to import optional dependencies
try:
    import fugashi
    FUGASHI_AVAILABLE = True
except ImportError:
    FUGASHI_AVAILABLE = False
    print("⚠️  Warning: fugashi not installed. Word matching validation will be skipped.")
    print("   Install: pip install fugashi unidic-lite")

try:
    import pykakasi
    PYKAKASI_AVAILABLE = True
except ImportError:
    PYKAKASI_AVAILABLE = False
    print("⚠️  Warning: pykakasi not installed. Kana conversion will be limited.")
    print("   Install: pip install pykakasi")


class VocabularyValidator:
    """Validates Japanese vocabulary card datasets"""

    def __init__(self, dataset_path: str, audio_base_path: str = "public"):
        self.dataset_path = Path(dataset_path)
        self.audio_base_path = Path(audio_base_path)
        self.failures = []
        self.warnings = []
        self.stats = defaultdict(int)

        # Initialize optional tools
        self.tagger = None
        self.kakasi = None

        if FUGASHI_AVAILABLE:
            try:
                self.tagger = fugashi.Tagger()
            except Exception as e:
                print(f"⚠️  Could not initialize fugashi tagger: {e}")

        if PYKAKASI_AVAILABLE:
            try:
                self.kakasi = pykakasi.kakasi()
            except Exception as e:
                print(f"⚠️  Could not initialize pykakasi: {e}")

    def add_failure(self, card_id: str, field: str, reason: str, severity: str = "error"):
        """Add a validation failure"""
        self.failures.append({
            "card_id": card_id,
            "field": field,
            "reason": reason,
            "severity": severity
        })
        self.stats[f"{severity}_count"] += 1

    def add_warning(self, card_id: str, field: str, reason: str):
        """Add a validation warning"""
        self.warnings.append({
            "card_id": card_id,
            "field": field,
            "reason": reason
        })
        self.stats["warning_count"] += 1

    def validate_required_fields(self, card: Dict[str, Any], card_idx: int) -> bool:
        """Validate presence of required fields"""
        required = ["id", "kana", "meaning", "jlptLevel"]
        card_id = card.get("id", f"card_{card_idx}")

        valid = True
        for field in required:
            if field not in card:
                self.add_failure(card_id, field, f"Missing required field: {field}")
                valid = False

        return valid

    def validate_field_types(self, card: Dict[str, Any]) -> bool:
        """Validate field types"""
        card_id = card.get("id", "unknown")
        valid = True

        # ID must be string
        if "id" in card and not isinstance(card["id"], str):
            self.add_failure(card_id, "id", f"ID must be string, got {type(card['id'])}")
            valid = False

        # Kana must be string
        if "kana" in card and not isinstance(card["kana"], str):
            self.add_failure(card_id, "kana", f"Kana must be string, got {type(card['kana'])}")
            valid = False

        # Meaning can be string or array
        if "meaning" in card:
            if not isinstance(card["meaning"], (str, list)):
                self.add_failure(card_id, "meaning", f"Meaning must be string or array, got {type(card['meaning'])}")
                valid = False

        # JLPT level must be string
        if "jlptLevel" in card and not isinstance(card["jlptLevel"], str):
            self.add_failure(card_id, "jlptLevel", f"jlptLevel must be string, got {type(card['jlptLevel'])}")
            valid = False

        # Examples must be array
        if "examples" in card and not isinstance(card["examples"], list):
            self.add_failure(card_id, "examples", f"Examples must be array, got {type(card['examples'])}")
            valid = False

        return valid

    def validate_jlpt_level(self, card: Dict[str, Any]) -> bool:
        """Validate JLPT level format"""
        card_id = card.get("id", "unknown")
        jlpt_level = card.get("jlptLevel")

        if jlpt_level not in ["N5", "N4", "N3", "N2", "N1"]:
            self.add_failure(card_id, "jlptLevel", f"Invalid JLPT level: {jlpt_level}")
            return False

        return True

    def text_contains_word(self, text: str, target_kana: str, target_kanji: str = None) -> bool:
        """Check if text contains the target word (kana or kanji)"""
        # Simple substring check first
        if target_kana in text:
            return True
        if target_kanji and target_kanji in text:
            return True

        # If fugashi is available, use morphological analysis
        if self.tagger:
            try:
                for word in self.tagger(text):
                    # Check surface form
                    if word.surface == target_kana or (target_kanji and word.surface == target_kanji):
                        return True
                    # Check reading
                    if hasattr(word, 'feature') and hasattr(word.feature, 'kana'):
                        if word.feature.kana == target_kana:
                            return True
            except:
                pass

        return False

    def validate_example(self, card: Dict[str, Any], example: Dict[str, Any], ex_idx: int) -> bool:
        """Validate a single example"""
        card_id = card.get("id", "unknown")
        jlpt_level = card.get("jlptLevel", "N5")
        target_kana = card.get("kana", "")
        target_kanji = card.get("kanji", None)

        valid = True

        # Required fields in example
        if "japanese" not in example:
            self.add_failure(card_id, f"examples[{ex_idx}].japanese", "Missing japanese text")
            valid = False

        if "english" not in example:
            self.add_failure(card_id, f"examples[{ex_idx}].english", "Missing english translation")
            valid = False

        if "source" not in example:
            self.add_warning(card_id, f"examples[{ex_idx}].source", "Missing source metadata")

        # Check example length
        if "japanese" in example:
            jp_text = example["japanese"]
            text_len = len(jp_text)

            # Length limits based on JLPT level
            max_length = 80 if jlpt_level in ["N3", "N4"] else 60
            if text_len > max_length:
                self.add_failure(
                    card_id,
                    f"examples[{ex_idx}].japanese",
                    f"Example too long: {text_len} chars (max {max_length} for {jlpt_level})"
                )
                valid = False

            # Check if example contains target word (if tools available)
            if self.tagger or target_kana:
                if not self.text_contains_word(jp_text, target_kana, target_kanji):
                    self.add_warning(
                        card_id,
                        f"examples[{ex_idx}].japanese",
                        f"Example may not contain target word '{target_kana}'"
                    )

        # Check source metadata
        if "source" in example:
            source = example["source"]
            if "type" not in source:
                self.add_warning(card_id, f"examples[{ex_idx}].source.type", "Missing source type")
            elif source["type"] not in ["tatoeba", "jmdict", "custom", "generated"]:
                self.add_warning(
                    card_id,
                    f"examples[{ex_idx}].source.type",
                    f"Unknown source type: {source['type']}"
                )

        return valid

    def validate_audio_file(self, card: Dict[str, Any], audio_url: str, audio_type: str) -> bool:
        """Check if audio file exists"""
        card_id = card.get("id", "unknown")

        if not audio_url:
            return True  # No audio specified, not an error

        # Convert URL to file path
        if audio_url.startswith("/"):
            audio_url = audio_url[1:]  # Remove leading slash

        audio_path = self.audio_base_path / audio_url

        if not audio_path.exists():
            self.add_failure(
                card_id,
                f"{audio_type}_audioUrl",
                f"Audio file not found: {audio_path}"
            )
            return False

        return True

    def validate_card(self, card: Dict[str, Any], card_idx: int) -> Dict[str, int]:
        """Validate a single vocabulary card"""
        card_id = card.get("id", f"card_{card_idx}")
        card_stats = {
            "errors": 0,
            "warnings": 0,
            "has_examples": 0,
            "has_audio": 0,
            "example_count": 0
        }

        # Required fields
        if not self.validate_required_fields(card, card_idx):
            card_stats["errors"] += 1

        # Field types
        if not self.validate_field_types(card):
            card_stats["errors"] += 1

        # JLPT level
        if not self.validate_jlpt_level(card):
            card_stats["errors"] += 1

        # Examples
        examples = card.get("examples", [])
        if examples:
            card_stats["has_examples"] = 1
            card_stats["example_count"] = len(examples)

            for ex_idx, example in enumerate(examples):
                if not self.validate_example(card, example, ex_idx):
                    card_stats["errors"] += 1

                # Check example audio
                if "audioUrl" in example:
                    self.validate_audio_file(card, example["audioUrl"], f"examples[{ex_idx}]")

        # Vocabulary audio
        if "audioUrl" in card:
            card_stats["has_audio"] = 1
            self.validate_audio_file(card, card["audioUrl"], "vocab")

        # License check
        if "license" not in card and "license" not in card.get("metadata", {}):
            self.add_warning(card_id, "license", "Missing license information")

        return card_stats

    def validate_dataset(self) -> Dict[str, Any]:
        """Validate entire dataset"""
        print(f"📋 Validating dataset: {self.dataset_path}")
        print()

        # Load dataset
        try:
            with open(self.dataset_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to load dataset: {e}"
            }

        # Check top-level structure
        if "vocabulary" not in data:
            return {
                "success": False,
                "error": "Missing 'vocabulary' field in dataset"
            }

        cards = data["vocabulary"]
        self.stats["total_cards"] = len(cards)

        print(f"Total cards: {len(cards)}")
        print()

        # Validate each card
        for idx, card in enumerate(cards):
            card_stats = self.validate_card(card, idx)

            # Aggregate stats
            self.stats["cards_with_examples"] += card_stats["has_examples"]
            self.stats["cards_with_audio"] += card_stats["has_audio"]
            self.stats["total_examples"] += card_stats["example_count"]

            # Progress indicator
            if (idx + 1) % 100 == 0:
                print(f"  Validated {idx + 1}/{len(cards)} cards...")

        print(f"✅ Validation complete!")
        print()

        # Calculate metrics
        metrics = self.calculate_metrics()

        return {
            "success": True,
            "metrics": metrics,
            "failures": self.failures,
            "warnings": self.warnings
        }

    def calculate_metrics(self) -> Dict[str, Any]:
        """Calculate dataset quality metrics"""
        total = self.stats["total_cards"]

        metrics = {
            "total_cards": total,
            "cards_with_examples": self.stats["cards_with_examples"],
            "cards_without_examples": total - self.stats["cards_with_examples"],
            "cards_with_audio": self.stats["cards_with_audio"],
            "total_examples": self.stats["total_examples"],
            "example_coverage_percent": round(self.stats["cards_with_examples"] / total * 100, 2) if total > 0 else 0,
            "audio_coverage_percent": round(self.stats["cards_with_audio"] / total * 100, 2) if total > 0 else 0,
            "avg_examples_per_card": round(self.stats["total_examples"] / total, 2) if total > 0 else 0,
            "error_count": self.stats.get("error_count", 0),
            "warning_count": self.stats.get("warning_count", 0),
            "pass_rate_percent": round((total - len([f for f in self.failures if f["severity"] == "error"])) / total * 100, 2) if total > 0 else 0
        }

        return metrics


def main():
    parser = argparse.ArgumentParser(description="Validate Japanese vocabulary dataset")
    parser.add_argument("--input", required=True, help="Input JSON file path")
    parser.add_argument("--output-dir", default="validation-results", help="Output directory for results")
    parser.add_argument("--audio-base", default="public", help="Base directory for audio files")

    args = parser.parse_args()

    # Create output directory
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Create validator
    validator = VocabularyValidator(args.input, args.audio_base)

    # Run validation
    result = validator.validate_dataset()

    if not result["success"]:
        print(f"❌ Validation failed: {result.get('error')}")
        sys.exit(1)

    # Print summary
    metrics = result["metrics"]
    print()
    print("=" * 60)
    print("📊 VALIDATION SUMMARY")
    print("=" * 60)
    print()
    print(f"Total Cards:              {metrics['total_cards']}")
    print(f"Cards with Examples:      {metrics['cards_with_examples']} ({metrics['example_coverage_percent']}%)")
    print(f"Cards with Audio:         {metrics['cards_with_audio']} ({metrics['audio_coverage_percent']}%)")
    print(f"Total Examples:           {metrics['total_examples']}")
    print(f"Avg Examples per Card:    {metrics['avg_examples_per_card']}")
    print()
    print(f"Errors:                   {metrics['error_count']}")
    print(f"Warnings:                 {metrics['warning_count']}")
    print(f"Pass Rate:                {metrics['pass_rate_percent']}%")
    print()

    # Save results
    dataset_name = Path(args.input).stem

    # Save failures
    fail_list_path = output_dir / f"{dataset_name}_fail_list.json"
    with open(fail_list_path, 'w', encoding='utf-8') as f:
        json.dump({
            "dataset": str(args.input),
            "failures": result["failures"],
            "warnings": result["warnings"]
        }, f, indent=2, ensure_ascii=False)

    print(f"💾 Failures saved to: {fail_list_path}")

    # Save metrics
    metrics_path = output_dir / f"{dataset_name}_metrics.json"
    with open(metrics_path, 'w', encoding='utf-8') as f:
        json.dump(metrics, f, indent=2, ensure_ascii=False)

    print(f"💾 Metrics saved to: {metrics_path}")
    print()

    # Exit with error code if there are failures
    if metrics['error_count'] > 0:
        print(f"⚠️  Found {metrics['error_count']} errors. Please review {fail_list_path}")
        sys.exit(1)
    else:
        print("✅ All validations passed!")
        sys.exit(0)


if __name__ == "__main__":
    main()
