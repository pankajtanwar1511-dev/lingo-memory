#!/usr/bin/env python3
"""
Validate Extracted Candidate Sentences

Validates extracted Tatoeba sentences against N5 requirements:
1. N5 vocabulary compliance (100% required)
2. Difficulty scoring
3. Pattern verification
4. Quality ranking

Usage:
    python3 validate_candidates.py --batch 1
    python3 validate_candidates.py --all
"""

import sys
import json
import re
from pathlib import Path
from typing import List, Dict, Set, Tuple
from dataclasses import dataclass, asdict
from collections import defaultdict

try:
    import fugashi
except ImportError:
    print("❌ Error: fugashi not installed. Run: pip install fugashi unidic-lite")
    sys.exit(1)

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
EXTRACTION_DIR = PROJECT_ROOT / "extraction_results"
VOCAB_STAGES_PATH = PROJECT_ROOT / "reference" / "vocab_stages.json"
GRAMMAR_STAGES_PATH = PROJECT_ROOT / "reference" / "grammar_stages.json"
OUTPUT_DIR = PROJECT_ROOT / "validated_results"

# Create output directory
OUTPUT_DIR.mkdir(exist_ok=True)

@dataclass
class ValidationResult:
    """Results of sentence validation."""
    tatoeba_id: str
    japanese: str
    english: str
    pattern: str
    stage: int

    # Vocabulary check
    vocab_compliant: bool
    non_n5_words: List[str]
    n5_words_found: List[str]

    # Difficulty
    difficulty: int
    difficulty_explanation: str

    # Quality metrics
    length: int
    kanji_count: int
    pattern_verified: bool

    # Ranking
    quality_score: float  # 0.0-1.0
    rank: int = 0


class N5VocabularyChecker:
    """Check if sentences use only N5 vocabulary."""

    def __init__(self):
        self.tagger = fugashi.Tagger()
        self.n5_vocab = self._load_n5_vocab()

        print(f"\n=== N5 Vocabulary Checker ===")
        print(f"Loaded {len(self.n5_vocab)} N5 vocabulary words")

    def _load_n5_vocab(self) -> Set[str]:
        """Load N5 vocabulary from vocab_stages.json."""
        with open(VOCAB_STAGES_PATH, 'r', encoding='utf-8') as f:
            vocab_stages = json.load(f)

        n5_words = set()

        # Extract vocabulary from all stages
        for stage_key in vocab_stages:
            if stage_key == "pattern_to_stage_lookup":
                continue

            stage_data = vocab_stages[stage_key]
            if "categories" in stage_data:
                for category, words in stage_data["categories"].items():
                    n5_words.update(words)

        return n5_words

    def check_sentence(self, japanese: str) -> Tuple[bool, List[str], List[str]]:
        """
        Check if sentence uses only N5 vocabulary.

        Returns:
            (is_compliant, non_n5_words, n5_words_found)
        """
        content_words = []
        non_n5_words = []
        n5_words_found = []

        # Tokenize
        for word in self.tagger(japanese):
            # Get lemma (dictionary form)
            lemma = word.feature.lemma if word.feature.lemma else word.surface

            # Get part of speech
            pos = word.feature.pos1 if hasattr(word.feature, 'pos1') else ""

            # Skip particles, auxiliary verbs, symbols
            if pos in ['助詞', '助動詞', '記号', '補助記号']:
                continue

            # Check content words
            if pos in ['名詞', '動詞', '形容詞', '副詞', '接続詞', '感動詞']:
                content_words.append(lemma)

                if lemma in self.n5_vocab:
                    n5_words_found.append(lemma)
                else:
                    non_n5_words.append(lemma)

        # Sentence is compliant if ALL content words are N5
        is_compliant = len(non_n5_words) == 0 and len(content_words) > 0

        return is_compliant, non_n5_words, n5_words_found


class DifficultyScorer:
    """Calculate difficulty scores for sentences."""

    def __init__(self):
        self.tagger = fugashi.Tagger()

        # Load grammar stages for complexity scoring
        with open(GRAMMAR_STAGES_PATH, 'r', encoding='utf-8') as f:
            grammar_data = json.load(f)

        self.pattern_to_stage = grammar_data.get("pattern_to_stage_lookup", {})

    def score(self, japanese: str) -> Tuple[int, str]:
        """
        Calculate difficulty score (1-10) based on multiple factors.

        Returns:
            (difficulty_score, explanation)
        """
        # Factor 1: Length (20%)
        length = len(japanese)
        if length < 10:
            length_score = 1
        elif length < 15:
            length_score = 3
        elif length < 20:
            length_score = 5
        elif length < 30:
            length_score = 7
        else:
            length_score = 9

        # Factor 2: Kanji count (20%)
        kanji_count = len(re.findall(r'[一-龯]', japanese))
        if kanji_count == 0:
            kanji_score = 1
        elif kanji_count <= 3:
            kanji_score = 3
        elif kanji_count <= 6:
            kanji_score = 5
        elif kanji_count <= 9:
            kanji_score = 7
        else:
            kanji_score = 9

        # Factor 3: Grammar complexity (30%)
        # Detect grammar patterns and find highest stage
        max_grammar_stage = 1
        detected_patterns = []

        for pattern, stage in self.pattern_to_stage.items():
            if pattern in japanese:
                max_grammar_stage = max(max_grammar_stage, stage)
                detected_patterns.append(pattern)

        grammar_score = min(max_grammar_stage * 2, 10)  # Scale to 1-10

        # Factor 4: Word count (15%)
        word_count = 0
        for _ in self.tagger(japanese):
            word_count += 1

        if word_count < 5:
            word_score = 2
        elif word_count < 8:
            word_score = 4
        elif word_count < 12:
            word_score = 6
        elif word_count < 15:
            word_score = 8
        else:
            word_score = 10

        # Factor 5: Sentence features (15%)
        feature_score = 5  # Default mid-range

        # Bonus complexity for questions
        if '？' in japanese or 'か' in japanese:
            feature_score += 1

        # Bonus for potential complexity markers
        if 'ので' in japanese or 'から' in japanese:
            feature_score += 1

        feature_score = min(feature_score, 10)

        # Weighted average
        difficulty = (
            length_score * 0.20 +
            kanji_score * 0.20 +
            grammar_score * 0.30 +
            word_score * 0.15 +
            feature_score * 0.15
        )

        difficulty = max(1, min(10, round(difficulty)))

        # Generate explanation
        explanation = (
            f"L:{length}({length_score}) "
            f"K:{kanji_count}({kanji_score}) "
            f"G:S{max_grammar_stage}({grammar_score}) "
            f"W:{word_count}({word_score})"
        )

        return difficulty, explanation


class CandidateValidator:
    """Main validation orchestrator."""

    def __init__(self):
        self.vocab_checker = N5VocabularyChecker()
        self.difficulty_scorer = DifficultyScorer()

    def validate_batch(self, batch_num: int) -> List[ValidationResult]:
        """Validate all candidates in a batch."""

        # Load batch candidates
        batch_file = EXTRACTION_DIR / f"batch_{batch_num}_candidates.json"

        if not batch_file.exists():
            print(f"❌ Batch file not found: {batch_file}")
            return []

        with open(batch_file, 'r', encoding='utf-8') as f:
            batch_data = json.load(f)

        print(f"\n{'='*70}")
        print(f"VALIDATING BATCH {batch_num}: {batch_data['batch_name']}")
        print(f"{'='*70}")

        all_results = []

        for pattern, pattern_data in batch_data['patterns'].items():
            candidates = pattern_data['candidates']

            print(f"\n🔍 Pattern: {pattern} ({len(candidates)} candidates)")

            pattern_results = []

            for candidate in candidates:
                japanese = candidate['japanese']

                # Check N5 vocabulary
                is_compliant, non_n5, n5_words = self.vocab_checker.check_sentence(japanese)

                # Calculate difficulty
                difficulty, diff_exp = self.difficulty_scorer.score(japanese)

                # Pattern verification (basic - just check presence)
                pattern_verified = pattern in japanese

                # Count kanji
                kanji_count = len(re.findall(r'[一-龯]', japanese))

                # Calculate quality score
                quality_score = self._calculate_quality_score(
                    is_compliant, difficulty, candidate['stage'],
                    len(japanese), kanji_count, pattern_verified
                )

                result = ValidationResult(
                    tatoeba_id=candidate['tatoeba_id'],
                    japanese=japanese,
                    english=candidate['english'],
                    pattern=pattern,
                    stage=candidate['stage'],
                    vocab_compliant=is_compliant,
                    non_n5_words=non_n5,
                    n5_words_found=n5_words,
                    difficulty=difficulty,
                    difficulty_explanation=diff_exp,
                    length=len(japanese),
                    kanji_count=kanji_count,
                    pattern_verified=pattern_verified,
                    quality_score=quality_score
                )

                pattern_results.append(result)

            # Rank within pattern
            pattern_results.sort(key=lambda x: -x.quality_score)
            for i, result in enumerate(pattern_results, 1):
                result.rank = i

            all_results.extend(pattern_results)

            # Print pattern summary
            compliant_count = sum(1 for r in pattern_results if r.vocab_compliant)
            avg_quality = sum(r.quality_score for r in pattern_results) / len(pattern_results)

            print(f"  ✅ N5 compliant: {compliant_count}/{len(candidates)} ({compliant_count/len(candidates)*100:.1f}%)")
            print(f"  📊 Avg quality score: {avg_quality:.3f}")
            print(f"  🎯 Avg difficulty: {sum(r.difficulty for r in pattern_results)/len(pattern_results):.1f}")

        return all_results

    def _calculate_quality_score(self, is_compliant: bool, difficulty: int,
                                 stage: int, length: int, kanji_count: int,
                                 pattern_verified: bool) -> float:
        """
        Calculate quality score (0.0-1.0) for ranking.

        Higher score = better candidate
        """
        score = 0.0

        # N5 compliance (40% weight) - CRITICAL
        if is_compliant:
            score += 0.40

        # Difficulty appropriateness (25% weight)
        # Stage 1-2: prefer difficulty 1-4
        # Stage 3: prefer difficulty 3-6
        # Stage 4-5: prefer difficulty 5-8
        expected_diff_range = {
            1: (1, 4),
            2: (2, 5),
            3: (3, 6),
            4: (4, 7),
            5: (5, 8)
        }

        min_diff, max_diff = expected_diff_range.get(stage, (1, 10))

        if min_diff <= difficulty <= max_diff:
            # Perfect difficulty match
            score += 0.25
        elif difficulty < min_diff:
            # Too easy - partial credit
            score += 0.15
        elif difficulty <= max_diff + 2:
            # Slightly too hard - some credit
            score += 0.10

        # Length appropriateness (15% weight)
        # Prefer 10-25 characters
        if 10 <= length <= 25:
            score += 0.15
        elif 8 <= length <= 30:
            score += 0.10
        elif length < 8:
            score += 0.05

        # Kanji count (10% weight)
        # Prefer 2-6 kanji for readability
        if 2 <= kanji_count <= 6:
            score += 0.10
        elif kanji_count <= 8:
            score += 0.07
        elif kanji_count == 0:
            score += 0.03  # Some kanji is good for learning

        # Pattern verification (10% weight)
        if pattern_verified:
            score += 0.10

        return min(1.0, score)

    def save_results(self, results: List[ValidationResult], batch_num: int):
        """Save validation results."""

        # Convert to JSON-serializable format
        results_data = [asdict(r) for r in results]

        # Save full results
        output_file = OUTPUT_DIR / f"batch_{batch_num}_validated.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results_data, f, ensure_ascii=False, indent=2)

        print(f"\n💾 Validation results saved: {output_file}")

        # Generate summary report
        self._generate_summary_report(results, batch_num)

    def _generate_summary_report(self, results: List[ValidationResult], batch_num: int):
        """Generate human-readable summary."""

        summary_file = OUTPUT_DIR / f"batch_{batch_num}_validation_summary.txt"

        with open(summary_file, 'w', encoding='utf-8') as f:
            f.write(f"BATCH {batch_num} VALIDATION SUMMARY\n")
            f.write("="*70 + "\n\n")

            # Overall stats
            total = len(results)
            compliant = sum(1 for r in results if r.vocab_compliant)
            compliant_pct = (compliant / total * 100) if total > 0 else 0

            f.write(f"OVERALL STATISTICS:\n")
            f.write(f"  Total candidates: {total}\n")
            f.write(f"  N5 compliant: {compliant} ({compliant_pct:.1f}%)\n")
            f.write(f"  Avg quality score: {sum(r.quality_score for r in results)/total:.3f}\n")
            f.write(f"  Avg difficulty: {sum(r.difficulty for r in results)/total:.1f}\n")
            f.write("\n")

            # By pattern
            by_pattern = defaultdict(list)
            for r in results:
                by_pattern[r.pattern].append(r)

            f.write("BY PATTERN:\n")
            f.write("-"*70 + "\n")

            for pattern, pattern_results in sorted(by_pattern.items()):
                pattern_compliant = sum(1 for r in pattern_results if r.vocab_compliant)
                pattern_total = len(pattern_results)

                f.write(f"\n{pattern}:\n")
                f.write(f"  Total: {pattern_total}\n")
                f.write(f"  N5 compliant: {pattern_compliant} ({pattern_compliant/pattern_total*100:.1f}%)\n")

                # Show top 5 candidates
                top_5 = sorted(pattern_results, key=lambda x: -x.quality_score)[:5]
                f.write(f"  Top 5 candidates:\n")

                for i, r in enumerate(top_5, 1):
                    compliance_mark = "✅" if r.vocab_compliant else "❌"
                    f.write(f"    {i}. [{compliance_mark}] {r.japanese} (Q:{r.quality_score:.2f} D:{r.difficulty})\n")
                    f.write(f"       {r.english}\n")
                    if r.non_n5_words:
                        f.write(f"       Non-N5: {', '.join(r.non_n5_words)}\n")

        print(f"💾 Summary saved: {summary_file}")


def main():
    """Main validation function."""
    import argparse

    parser = argparse.ArgumentParser(description='Validate extracted candidate sentences')
    parser.add_argument('--batch', type=int, help='Validate specific batch (1-5)')
    parser.add_argument('--all', action='store_true', help='Validate all batches')

    args = parser.parse_args()

    validator = CandidateValidator()

    if args.all:
        # Validate all batches
        for batch_num in range(1, 6):
            results = validator.validate_batch(batch_num)
            if results:
                validator.save_results(results, batch_num)

    elif args.batch:
        # Validate specific batch
        results = validator.validate_batch(args.batch)
        if results:
            validator.save_results(results, args.batch)

    else:
        print("❌ Please specify --batch N or --all")
        parser.print_help()
        return 1

    print("\n✅ Validation complete!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
