#!/usr/bin/env python3
"""
Phase 5: Export Review Tasks for Human Review

Extracts all examples marked with needsReview: true and exports them
to a CSV file for human reviewers to validate.

Review workflow:
1. Run this script to generate review_tasks.csv
2. Reviewers fill in: suggested_action, reviewer_comments, reviewed_by, review_date
3. Run import script (separate) to merge approved examples back

Input: data/n5-phase3/n5_with_generated.json
Output: data/n5-review/review_tasks.csv

Usage:
    python3 scripts/phase5_export_review_tasks.py \
        --input data/n5-phase3/n5_with_generated.json \
        --output data/n5-review/review_tasks.csv
"""

import json
import csv
import argparse
from pathlib import Path
from typing import List, Dict, Any


class ReviewTaskExporter:
    """Export examples needing review to CSV"""

    def __init__(self):
        self.review_tasks: List[Dict[str, Any]] = []
        self.stats = {
            'cards_checked': 0,
            'examples_checked': 0,
            'examples_needing_review': 0,
            'examples_approved': 0
        }

    def extract_review_tasks(self, cards: List[Dict[str, Any]]) -> None:
        """Extract all examples marked for review"""
        print("\n📋 Extracting review tasks...")

        for card in cards:
            self.stats['cards_checked'] += 1

            card_id = card.get('id', 'unknown')
            word_kanji = card.get('kanji', '')
            word_kana = card.get('kana', '')
            word_display = f"{word_kanji} ({word_kana})" if word_kanji else word_kana

            meanings = card.get('meaning', [])
            if isinstance(meanings, str):
                meanings = [meanings]
            meaning_str = ", ".join(meanings[:2])  # First 2 meanings

            examples = card.get('examples', [])

            for ex_idx, example in enumerate(examples):
                self.stats['examples_checked'] += 1

                needs_review = example.get('needsReview', False)

                if needs_review:
                    # Extract task
                    task = {
                        'card_id': card_id,
                        'word': word_display,
                        'meaning': meaning_str,
                        'example_index': ex_idx,
                        'japanese': example.get('japanese', ''),
                        'kana': example.get('kana', ''),
                        'english': example.get('english', ''),
                        'source_type': example.get('source', {}).get('type', ''),
                        'model': example.get('source', {}).get('model', ''),
                        'provider': example.get('source', {}).get('provider', ''),
                        'suggested_action': '',  # To be filled by reviewer
                        'reviewer_comments': '',
                        'reviewed_by': '',
                        'review_date': ''
                    }

                    self.review_tasks.append(task)
                    self.stats['examples_needing_review'] += 1
                else:
                    self.stats['examples_approved'] += 1

        print(f"   Found {self.stats['examples_needing_review']} examples needing review")

    def export_to_csv(self, output_path: Path) -> None:
        """Export review tasks to CSV"""
        print(f"\n💾 Exporting to CSV: {output_path}")

        output_path.parent.mkdir(parents=True, exist_ok=True)

        fieldnames = [
            'card_id',
            'word',
            'meaning',
            'example_index',
            'japanese',
            'kana',
            'english',
            'source_type',
            'model',
            'provider',
            'suggested_action',
            'reviewer_comments',
            'reviewed_by',
            'review_date'
        ]

        with open(output_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

            # Write instructions as first row (will be skipped on import)
            instructions = {
                'card_id': '# INSTRUCTIONS',
                'word': 'Review each example below',
                'meaning': 'Fill in suggested_action column',
                'example_index': 'Options: approve / reject / rewrite',
                'japanese': 'Add comments if needed',
                'kana': 'Sign with your name',
                'english': 'Add review date',
                'source_type': '',
                'model': '',
                'provider': '',
                'suggested_action': 'approve',
                'reviewer_comments': 'Optional feedback',
                'reviewed_by': 'Your Name',
                'review_date': 'YYYY-MM-DD'
            }
            writer.writerow(instructions)

            # Write separator row
            separator = {field: '---' for field in fieldnames}
            writer.writerow(separator)

            # Write actual tasks
            for task in self.review_tasks:
                writer.writerow(task)

        print(f"   ✅ Exported {len(self.review_tasks)} review tasks")

    def print_stats(self) -> None:
        """Print export statistics"""
        print("\n" + "=" * 60)
        print("📊 REVIEW TASK STATISTICS")
        print("=" * 60)
        print(f"Cards checked:            {self.stats['cards_checked']}")
        print(f"Examples checked:         {self.stats['examples_checked']}")
        print(f"Examples needing review:  {self.stats['examples_needing_review']}")
        print(f"Examples already approved:{self.stats['examples_approved']}")
        print()

        if self.stats['examples_needing_review'] > 0:
            review_hours = (self.stats['examples_needing_review'] * 30) / 3600  # 30s per example
            print(f"Estimated review time:    {review_hours:.1f} hours (at 30s per example)")

        print("=" * 60)

    def create_readme(self, output_dir: Path) -> None:
        """Create README with review instructions"""
        readme_content = """# Review Tasks - N5 Examples

This folder contains AI-generated examples that need human review.

## Files

- `review_tasks.csv` - Examples to review (generated from Phase 3)
- `REVIEW-GUIDELINES.md` - Quality checklist (5-point review system)

## Review Process

### 1. Open `review_tasks.csv` in Excel or Google Sheets

### 2. For Each Example, Fill In:

**suggested_action** (required):
- `approve` - Example is good, use as-is
- `reject` - Example is bad, discard
- `rewrite` - Example needs editing (add corrected version in comments)

**reviewer_comments** (optional):
- Why you rejected it
- What's wrong
- Corrected version (if rewriting)

**reviewed_by** (required):
- Your name or initials

**review_date** (required):
- Today's date (YYYY-MM-DD format)

### 3. Quality Checklist

Check EACH example against these criteria:

1. ✅ **Word Usage**: Target word used correctly and naturally
2. ✅ **Natural Wording**: Sounds natural to native speakers
3. ✅ **JLPT N5 Level**: Grammar and vocabulary appropriate for beginners
4. ✅ **Kana Correctness**: Reading (kana) is accurate
5. ✅ **Translation Accuracy**: English matches Japanese meaning

If ANY criterion fails → reject or rewrite.

### 4. Common Issues to Watch For

❌ **REJECT if you see**:
- Word used incorrectly
- Unnatural phrasing
- Too complex grammar (N4+ level)
- Wrong kana/reading
- Mistranslation

⚠️ **REWRITE if**:
- Example is close but needs small fix
- Translation is off
- Could be simplified

### 5. Target Quality

**Aim for 80%+ approval rate**
- If <50% approved → regenerate with better prompts
- If 50-80% → acceptable, but improve prompts next time
- If >80% → excellent LLM quality

### 6. After Review

**Return completed CSV to maintainer**

Maintainer will run import script to:
- Add approved examples to dataset
- Discard rejected examples
- Apply rewrites from comments

## Example Review

```csv
card_id,word,japanese,english,suggested_action,reviewer_comments,reviewed_by,review_date
n5_vocab_0042,毎朝 (まいあさ),毎朝コーヒーを飲みます。,I drink coffee every morning.,approve,,Alice,2025-01-15
n5_vocab_0103,暑い (あつい),今日は暑いから、プールに行きます。,It's hot today so let's go to the pool.,reject,Too complex (から is N4),Bob,2025-01-15
```

## Questions?

See full guidelines: `docs/REVIEW-GUIDELINES.md`
"""

        readme_path = output_dir / 'README.md'
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(readme_content)

        print(f"   ✅ Created README: {readme_path}")


def main():
    parser = argparse.ArgumentParser(description="Phase 5: Export review tasks to CSV")
    parser.add_argument("--input", required=True, help="Input N5 JSON (from Phase 3)")
    parser.add_argument("--output", default="data/n5-review/review_tasks.csv",
                       help="Output CSV file")

    args = parser.parse_args()

    print("🚀 Phase 5: Exporting Review Tasks")
    print("=" * 60)
    print(f"Input:   {args.input}")
    print(f"Output:  {args.output}")
    print()

    # Load dataset
    print("📥 Loading dataset...")
    with open(args.input, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data.get('vocabulary', [])
    print(f"   Loaded {len(cards)} cards")

    # Initialize exporter
    exporter = ReviewTaskExporter()

    # Extract review tasks
    exporter.extract_review_tasks(cards)

    # Export to CSV
    output_path = Path(args.output)
    exporter.export_to_csv(output_path)

    # Create README
    exporter.create_readme(output_path.parent)

    # Print statistics
    exporter.print_stats()

    print("\n✅ Phase 5 Complete!")
    print(f"   Review tasks: {args.output}")
    print(f"   Instructions: {output_path.parent}/README.md")
    print()
    print("📝 Next step: Human reviewers validate examples")
    print(f"   1. Open {args.output} in Excel/Sheets")
    print(f"   2. Fill in suggested_action for each row")
    print(f"   3. Return completed CSV")


if __name__ == "__main__":
    main()
