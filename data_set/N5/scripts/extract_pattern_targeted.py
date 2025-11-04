#!/usr/bin/env python3
"""
Pattern-Targeted Sentence Extraction from Tatoeba

Extracts sentences for specific grammar patterns to fill coverage gaps.
Based on EXTRACTION_PLAN_PHASE4.md

Usage:
    python3 extract_pattern_targeted.py --pattern ます --needed 52
    python3 extract_pattern_targeted.py --batch 1  # Extract entire batch
"""

import sys
import re
import sqlite3
from pathlib import Path
from typing import List, Dict, Set, Tuple
from dataclasses import dataclass
import json

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent
TATOEBA_FILE = PROJECT_ROOT / "data" / "tatoeba" / "jpn_sentences_detailed.tsv"
DB_PATH = SCRIPT_DIR.parent / "n5_sentences_ultra_pure.db"
OUTPUT_DIR = SCRIPT_DIR.parent / "extraction_results"

# Create output directory
OUTPUT_DIR.mkdir(exist_ok=True)

@dataclass
class ExtractionQuery:
    """Definition of a pattern extraction query."""
    pattern: str
    needed: int
    search_type: str  # 'ends_with', 'contains', 'regex'
    filter_fn: str = None  # Optional additional filter
    priority: str = "MEDIUM"  # CRITICAL, MEDIUM, LOW
    stage: int = 3
    description: str = ""

# Extraction batches from EXTRACTION_PLAN_PHASE4.md
EXTRACTION_BATCHES = {
    1: {  # CRITICAL: Polite forms
        'name': 'Critical Polite Forms',
        'priority': 'CRITICAL',
        'queries': [
            ExtractionQuery('ます', 52, 'ends_with', stage=1, priority='CRITICAL',
                          description='polite present'),
            ExtractionQuery('ました', 22, 'ends_with', stage=2, priority='CRITICAL',
                          description='polite past'),
            ExtractionQuery('ません', 22, 'ends_with', stage=2, priority='CRITICAL',
                          description='polite negative'),
            ExtractionQuery('ています', 15, 'contains', stage=3, priority='CRITICAL',
                          description='polite progressive'),
        ]
    },
    2: {  # CRITICAL: Desire & Request
        'name': 'Desire & Request Forms',
        'priority': 'CRITICAL',
        'queries': [
            ExtractionQuery('たいです', 9, 'contains', stage=3, priority='CRITICAL',
                          description='want to (polite)'),
            ExtractionQuery('たくない', 8, 'contains', stage=3, priority='CRITICAL',
                          description="don't want to"),
            ExtractionQuery('てください', 10, 'contains', stage=3, priority='CRITICAL',
                          description='please do'),
        ]
    },
    3: {  # CRITICAL: Progressive & Time
        'name': 'Progressive & Time Forms',
        'priority': 'CRITICAL',
        'queries': [
            ExtractionQuery('ている', 9, 'contains', stage=3, priority='CRITICAL',
                          description='progressive/state (casual)'),
            ExtractionQuery('とき', 8, 'contains', stage=3, priority='CRITICAL',
                          description='when, at the time'),
            ExtractionQuery('あとで', 8, 'contains', stage=3, priority='CRITICAL',
                          description='after (casual)'),
            ExtractionQuery('てから', 8, 'contains', stage=3, priority='CRITICAL',
                          description='after doing'),
        ]
    },
    4: {  # MEDIUM: Comparisons
        'name': 'Comparison Forms',
        'priority': 'MEDIUM',
        'queries': [
            ExtractionQuery('いちばん', 8, 'contains', stage=3, priority='MEDIUM',
                          description='most'),
            ExtractionQuery('のほうが', 8, 'contains', stage=3, priority='MEDIUM',
                          description='more than'),
        ]
    },
    5: {  # MEDIUM: Conditionals
        'name': 'Conditional Forms',
        'priority': 'MEDIUM',
        'queries': [
            ExtractionQuery('たら', 10, 'contains', stage=4, priority='MEDIUM',
                          description='if/when'),
            ExtractionQuery('れば', 10, 'contains', stage=4, priority='MEDIUM',
                          description='if (conditional)'),
        ]
    },
}


class PatternExtractor:
    """Extract sentences for specific grammar patterns from Tatoeba."""

    def __init__(self):
        self.tatoeba_file = TATOEBA_FILE
        self.db_path = DB_PATH
        self.existing_sentences = self._load_existing_sentences()

        print(f"\n=== Pattern-Targeted Extractor ===")
        print(f"Tatoeba file: {self.tatoeba_file}")
        print(f"Database: {self.db_path}")
        print(f"Existing sentences: {len(self.existing_sentences)}")

    def _load_existing_sentences(self) -> Set[str]:
        """Load existing sentences to avoid duplicates."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT japanese FROM n5_sentences")
        sentences = {row[0] for row in cursor.fetchall()}
        conn.close()
        return sentences

    def extract_for_pattern(self, query: ExtractionQuery, max_results: int = 100) -> List[Dict]:
        """
        Extract sentences matching a specific pattern.

        Args:
            query: ExtractionQuery specification
            max_results: Maximum sentences to extract

        Returns:
            List of candidate sentences with metadata
        """
        print(f"\n{'='*70}")
        print(f"Extracting: {query.pattern} ({query.description})")
        print(f"Target: {query.needed} sentences | Priority: {query.priority}")
        print(f"{'='*70}")

        candidates = []
        processed = 0
        matched = 0

        with open(self.tatoeba_file, 'r', encoding='utf-8') as f:
            for line in f:
                processed += 1

                if processed % 100000 == 0:
                    print(f"  Processed: {processed:,} | Matched: {matched} | Candidates: {len(candidates)}")

                # Parse TSV
                parts = line.strip().split('\t')
                if len(parts) < 3:
                    continue

                tatoeba_id, japanese, english = parts[0], parts[1], parts[2]

                # Skip if already in corpus
                if japanese in self.existing_sentences:
                    continue

                # Apply pattern matching
                is_match = False

                if query.search_type == 'ends_with':
                    # Check if pattern appears before common punctuation
                    is_match = (japanese.endswith(query.pattern) or
                               japanese.endswith(query.pattern + '。') or
                               japanese.endswith(query.pattern + '？') or
                               japanese.endswith(query.pattern + '！') or
                               japanese.endswith(query.pattern + 'か。') or
                               japanese.endswith(query.pattern + 'ね。') or
                               japanese.endswith(query.pattern + 'よ。'))
                elif query.search_type == 'contains':
                    is_match = query.pattern in japanese
                elif query.search_type == 'regex':
                    is_match = re.search(query.pattern, japanese) is not None

                if not is_match:
                    continue

                matched += 1

                # Basic quality filters
                if not self._basic_quality_check(japanese):
                    continue

                # Add candidate
                candidates.append({
                    'tatoeba_id': tatoeba_id,
                    'japanese': japanese,
                    'english': english,
                    'pattern': query.pattern,
                    'length': len(japanese),
                    'stage': query.stage,
                    'priority': query.priority
                })

                # Stop if we have enough candidates
                if len(candidates) >= max_results:
                    break

        print(f"\n✅ Extraction complete:")
        print(f"   Total processed: {processed:,}")
        print(f"   Pattern matches: {matched}")
        print(f"   Quality candidates: {len(candidates)}")
        print(f"   Needed: {query.needed}")

        return candidates[:max_results]

    def _basic_quality_check(self, japanese: str) -> bool:
        """Basic quality filters for candidate sentences."""

        # Length filter: 5-40 characters (N5 appropriate)
        if len(japanese) < 5 or len(japanese) > 40:
            return False

        # Must contain at least one hiragana (exclude katakana-only/romaji)
        if not re.search(r'[ぁ-ん]', japanese):
            return False

        # Exclude sentences with too many kanji (likely N4+)
        kanji_count = len(re.findall(r'[一-龯]', japanese))
        if kanji_count > 8:
            return False

        # Exclude URLs, special characters
        if any(char in japanese for char in ['http', 'www', '@', '#']):
            return False

        return True

    def extract_batch(self, batch_num: int) -> Dict[str, List[Dict]]:
        """Extract all patterns in a batch."""

        if batch_num not in EXTRACTION_BATCHES:
            print(f"❌ Batch {batch_num} not found")
            return {}

        batch = EXTRACTION_BATCHES[batch_num]
        print(f"\n{'='*70}")
        print(f"BATCH {batch_num}: {batch['name']}")
        print(f"Priority: {batch['priority']}")
        print(f"Patterns: {len(batch['queries'])}")
        print(f"{'='*70}")

        results = {}

        for query in batch['queries']:
            candidates = self.extract_for_pattern(query, max_results=query.needed * 3)
            results[query.pattern] = candidates

        return results

    def save_results(self, results: Dict[str, List[Dict]], batch_num: int):
        """Save extraction results to JSON."""

        output_file = OUTPUT_DIR / f"batch_{batch_num}_candidates.json"

        # Format for saving
        from datetime import datetime
        output_data = {
            'batch_number': batch_num,
            'batch_name': EXTRACTION_BATCHES[batch_num]['name'],
            'extracted_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'patterns': {}
        }

        total_candidates = 0

        for pattern, candidates in results.items():
            output_data['patterns'][pattern] = {
                'count': len(candidates),
                'candidates': candidates
            }
            total_candidates += len(candidates)

        # Save JSON
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)

        print(f"\n💾 Results saved: {output_file}")
        print(f"   Total candidates: {total_candidates}")

        # Also save human-readable summary
        summary_file = OUTPUT_DIR / f"batch_{batch_num}_summary.txt"
        with open(summary_file, 'w', encoding='utf-8') as f:
            f.write(f"BATCH {batch_num}: {output_data['batch_name']}\n")
            f.write(f"{'='*70}\n\n")

            for pattern, data in output_data['patterns'].items():
                f.write(f"\nPattern: {pattern}\n")
                f.write(f"Candidates: {data['count']}\n")
                f.write(f"-"*70 + "\n")

                for i, cand in enumerate(data['candidates'][:10], 1):
                    f.write(f"{i:2d}. {cand['japanese']}\n")
                    f.write(f"    {cand['english']}\n")

                if data['count'] > 10:
                    f.write(f"    ... and {data['count'] - 10} more\n")
                f.write("\n")

        print(f"💾 Summary saved: {summary_file}")


def main():
    """Main extraction function."""
    import argparse

    parser = argparse.ArgumentParser(description='Extract sentences for specific grammar patterns')
    parser.add_argument('--pattern', type=str, help='Specific pattern to extract (e.g., ます)')
    parser.add_argument('--needed', type=int, default=50, help='Number of sentences needed')
    parser.add_argument('--batch', type=int, help='Extract entire batch (1-5)')
    parser.add_argument('--stage', type=int, default=3, help='Expected learning stage')

    args = parser.parse_args()

    extractor = PatternExtractor()

    if args.batch:
        # Extract entire batch
        results = extractor.extract_batch(args.batch)
        extractor.save_results(results, args.batch)

    elif args.pattern:
        # Extract single pattern
        query = ExtractionQuery(
            pattern=args.pattern,
            needed=args.needed,
            search_type='contains',  # Default to contains
            stage=args.stage
        )

        candidates = extractor.extract_for_pattern(query, max_results=args.needed * 2)

        # Save single pattern results
        results = {args.pattern: candidates}
        extractor.save_results(results, 0)  # Use batch 0 for single patterns

    else:
        print("❌ Please specify either --pattern or --batch")
        parser.print_help()
        return 1

    print("\n✅ Extraction complete!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
