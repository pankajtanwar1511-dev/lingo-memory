#!/usr/bin/env python3
"""
Phase 0: Calculate difficulty scores for all N5 sentences.

Target distribution (bell curve):
  Level 1-2:  25% (~775 sentences)  - Foundation
  Level 3-4:  35% (~1,083 sentences) - Core N5 ⭐ Peak learning
  Level 5-6:  25% (~775 sentences)  - Practice
  Level 7-8:  11% (~340 sentences)  - Challenge
  Level 9-10: 4% (~124 sentences)   - Edge cases
"""

import sqlite3
import json
import re
from pathlib import Path
from typing import Dict, List

DB_PATH = Path(__file__).parent.parent / "n5_sentences_ultra_pure.db"
N5_VOCAB_PATH = Path(__file__).parent.parent / "reference" / "n5_vocab.txt"

# Load N5 vocabulary for frequency scoring
n5_vocab_freq = {}
if N5_VOCAB_PATH.exists():
    with open(N5_VOCAB_PATH, 'r', encoding='utf-8') as f:
        for idx, line in enumerate(f):
            parts = line.strip().split('|')
            if len(parts) >= 1:
                word = parts[0]
                # Higher index = less common (reverse for frequency)
                n5_vocab_freq[word] = 1.0 - (idx / 1147)  # 1147 total words


def count_kanji(text: str) -> int:
    """Count kanji characters in text."""
    kanji_pattern = re.compile(r'[\u4e00-\u9faf]')
    return len(kanji_pattern.findall(text))


def calculate_raw_difficulty(japanese: str) -> float:
    """
    Calculate raw difficulty score (0.0-1.0).

    Components:
    - 30% Length (longer = harder)
    - 30% Kanji count (more kanji = harder)
    - 20% Grammar complexity (estimated by particle count, です/ます presence)
    - 20% Vocab frequency (less common words = harder)
    """
    # 1. Length score (0.0-1.0)
    length = len(japanese)
    if length <= 10:
        length_score = 0.0
    elif length <= 15:
        length_score = 0.25
    elif length <= 20:
        length_score = 0.5
    elif length <= 25:
        length_score = 0.75
    else:
        length_score = 1.0

    # 2. Kanji score (0.0-1.0)
    kanji_count = count_kanji(japanese)
    if kanji_count == 0:
        kanji_score = 0.0
    elif kanji_count <= 2:
        kanji_score = 0.25
    elif kanji_count <= 4:
        kanji_score = 0.5
    elif kanji_count <= 6:
        kanji_score = 0.75
    else:
        kanji_score = 1.0

    # 3. Grammar complexity score (0.0-1.0)
    # Easier: です/ます forms
    # Harder: Complex particles, conditionals, passive
    has_desu_masu = bool(re.search(r'(です|ます|でした|ました)', japanese))
    particle_count = len(re.findall(r'[はがをにでとへのかも]', japanese))

    if has_desu_masu and particle_count <= 2:
        grammar_score = 0.0  # Very simple
    elif has_desu_masu and particle_count <= 4:
        grammar_score = 0.3  # Simple
    elif particle_count <= 3:
        grammar_score = 0.5  # Moderate
    elif particle_count <= 5:
        grammar_score = 0.7  # Complex
    else:
        grammar_score = 1.0  # Very complex

    # 4. Vocabulary frequency score (0.0-1.0)
    # This is simplified - ideally would check each word in sentence
    # For now, estimate based on kanji presence (more kanji = less common words)
    # TODO: Implement proper tokenization and vocab lookup
    vocab_score = kanji_score * 0.8  # Approximate correlation

    # Weighted combination
    raw_score = (
        0.30 * length_score +
        0.30 * kanji_score +
        0.20 * grammar_score +
        0.20 * vocab_score
    )

    return raw_score


def raw_to_level(raw_score: float, percentile: float) -> int:
    """
    Convert raw score (0.0-1.0) to difficulty level (1-10).
    Uses percentile ranking to achieve target distribution.

    Target distribution:
      Level 1-2:  25% (percentile 0-25)
      Level 3-4:  35% (percentile 25-60)
      Level 5-6:  25% (percentile 60-85)
      Level 7-8:  11% (percentile 85-96)
      Level 9-10: 4% (percentile 96-100)
    """
    if percentile <= 12.5:
        return 1
    elif percentile <= 25:
        return 2
    elif percentile <= 42.5:
        return 3
    elif percentile <= 60:
        return 4
    elif percentile <= 72.5:
        return 5
    elif percentile <= 85:
        return 6
    elif percentile <= 90.5:
        return 7
    elif percentile <= 96:
        return 8
    elif percentile <= 98:
        return 9
    else:
        return 10


def calculate_difficulty_scores(conn: sqlite3.Connection) -> Dict[str, int]:
    """Calculate difficulty scores for all sentences."""
    cursor = conn.cursor()

    # Get all sentences
    cursor.execute("SELECT id, japanese FROM n5_sentences WHERE pass=1")
    sentences = cursor.fetchall()

    print(f"Calculating difficulty for {len(sentences)} sentences...")

    # Calculate raw scores
    sentence_scores = []
    for sent_id, japanese in sentences:
        raw_score = calculate_raw_difficulty(japanese)
        sentence_scores.append((sent_id, japanese, raw_score))

    # Sort by raw score to determine percentiles
    sentence_scores.sort(key=lambda x: x[2])

    # Assign levels based on percentile ranking
    total = len(sentence_scores)
    difficulty_map = {}

    for idx, (sent_id, japanese, raw_score) in enumerate(sentence_scores):
        percentile = (idx / total) * 100
        level = raw_to_level(raw_score, percentile)
        difficulty_map[sent_id] = level

    return difficulty_map


def update_database(conn: sqlite3.Connection, difficulty_map: Dict[str, int]):
    """Update difficulty scores in database."""
    cursor = conn.cursor()

    print(f"Updating {len(difficulty_map)} difficulty scores...")

    for sent_id, level in difficulty_map.items():
        cursor.execute(
            "UPDATE n5_sentences SET difficulty = ? WHERE id = ?",
            (level, sent_id)
        )

    conn.commit()
    print("✅ Database updated!")


def generate_report(conn: sqlite3.Connection):
    """Generate difficulty distribution report."""
    cursor = conn.cursor()

    # Get distribution
    cursor.execute("""
        SELECT difficulty, COUNT(*) as count
        FROM n5_sentences
        WHERE pass=1
        GROUP BY difficulty
        ORDER BY difficulty
    """)

    distribution = cursor.fetchall()
    total = sum(count for _, count in distribution)

    print("\n" + "=" * 80)
    print("DIFFICULTY DISTRIBUTION REPORT")
    print("=" * 80)

    # Group by ranges
    ranges = {
        '1-2': (0, 0),
        '3-4': (0, 0),
        '5-6': (0, 0),
        '7-8': (0, 0),
        '9-10': (0, 0)
    }

    for level, count in distribution:
        if 1 <= level <= 2:
            ranges['1-2'] = (ranges['1-2'][0] + count, ranges['1-2'][1] + count)
        elif 3 <= level <= 4:
            ranges['3-4'] = (ranges['3-4'][0] + count, ranges['3-4'][1] + count)
        elif 5 <= level <= 6:
            ranges['5-6'] = (ranges['5-6'][0] + count, ranges['5-6'][1] + count)
        elif 7 <= level <= 8:
            ranges['7-8'] = (ranges['7-8'][0] + count, ranges['7-8'][1] + count)
        elif 9 <= level <= 10:
            ranges['9-10'] = (ranges['9-10'][0] + count, ranges['9-10'][1] + count)

    print(f"\nTotal sentences: {total}\n")

    # Print detailed distribution
    print("By Level:")
    for level, count in distribution:
        pct = (count / total) * 100
        bar = '█' * int(pct / 2)
        print(f"  Level {level:2d}: {count:4d} ({pct:5.1f}%) {bar}")

    print("\nBy Range (Target vs Actual):")
    targets = {
        '1-2': 25,
        '3-4': 35,
        '5-6': 25,
        '7-8': 11,
        '9-10': 4
    }

    for range_name, (count, _) in ranges.items():
        pct = (count / total) * 100
        target = targets[range_name]
        diff = pct - target
        status = "✅" if abs(diff) <= 2 else "⚠️"
        bar = '█' * int(pct)
        print(f"  Level {range_name}: {count:4d} ({pct:5.1f}%) [Target: {target}%] {status}")
        print(f"           {bar}")

    # Sample sentences from each level
    print("\n" + "=" * 80)
    print("SAMPLE SENTENCES BY DIFFICULTY")
    print("=" * 80)

    for level in [1, 3, 5, 7, 9]:
        cursor.execute("""
            SELECT japanese
            FROM n5_sentences
            WHERE difficulty = ? AND pass=1
            LIMIT 5
        """, (level,))

        samples = cursor.fetchall()
        if samples:
            print(f"\n【Level {level} Examples】")
            for idx, (japanese,) in enumerate(samples, 1):
                print(f"  {idx}. {japanese}")

    print("\n" + "=" * 80)


def main():
    print("=" * 80)
    print("PHASE 0: DIFFICULTY SCORING")
    print("=" * 80)
    print()

    conn = sqlite3.connect(DB_PATH)

    try:
        # Calculate difficulty scores
        difficulty_map = calculate_difficulty_scores(conn)

        # Update database
        update_database(conn, difficulty_map)

        # Generate report
        generate_report(conn)

    finally:
        conn.close()

    print("\n✅ Phase 0 Complete!")
    print(f"📊 Difficulty scores updated for {len(difficulty_map)} sentences")
    print(f"📁 Database: {DB_PATH}")


if __name__ == "__main__":
    main()
