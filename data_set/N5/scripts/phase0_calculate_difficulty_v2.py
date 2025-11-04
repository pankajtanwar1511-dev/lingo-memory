#!/usr/bin/env python3
"""
Phase 0 v2: Improved N5 Difficulty Scoring Algorithm

Based on feedback from Claude AI (6/10) and ChatGPT (4/10):
- FIXED: Real vocabulary frequency using fugashi tokenization
- FIXED: Enhanced grammar complexity detection
- IMPROVED: Better weighting (30% grammar, 25% vocab, 20% kanji, 20% length, 5% features)

Target distribution (bell curve):
  Level 1-2:  25% (~775 sentences)  - Foundation
  Level 3-4:  35% (~1,083 sentences) - Core N5 (peak learning)
  Level 5-6:  25% (~775 sentences)  - Practice
  Level 7-8:  11% (~340 sentences)  - Challenge
  Level 9-10: 4% (~124 sentences)   - Edge cases
"""

import sqlite3
import re
import json
from pathlib import Path
from typing import Dict, List, Tuple

try:
    import fugashi
except ImportError:
    print("ERROR: fugashi not installed. Run: pip install fugashi")
    exit(1)

# Paths
DB_PATH = Path(__file__).parent.parent / "n5_sentences_ultra_pure.db"
N5_VOCAB_PATH = Path(__file__).parent.parent / "reference" / "n5_vocab.txt"

# Initialize MeCab tagger
tagger = fugashi.Tagger()

# Load N5 vocabulary with frequency ranks
n5_vocab_rank = {}
if N5_VOCAB_PATH.exists():
    with open(N5_VOCAB_PATH, 'r', encoding='utf-8') as f:
        for idx, line in enumerate(f):
            parts = line.strip().split('|')
            if parts:
                word = parts[0]
                # Frequency score: 1.0 (most common) -> 0.0 (least common)
                n5_vocab_rank[word] = 1.0 - (idx / 1147)
else:
    print(f"WARNING: N5 vocab file not found at {N5_VOCAB_PATH}")


# =============================================================================
# FEATURE CALCULATION FUNCTIONS
# =============================================================================

def count_kanji(text: str) -> int:
    """Count kanji characters in text."""
    kanji_pattern = re.compile(r'[\u4e00-\u9faf]')
    return len(kanji_pattern.findall(text))


def calculate_length_score(text: str) -> float:
    """
    Length-based difficulty (0.0-1.0).
    Shorter sentences tend to be easier.
    """
    length = len(text)
    if length <= 10:
        return 0.0
    elif length <= 15:
        return 0.25
    elif length <= 20:
        return 0.5
    elif length <= 25:
        return 0.75
    else:
        return 1.0


def calculate_kanji_score(text: str) -> float:
    """
    Kanji-based difficulty (0.0-1.0).
    More kanji = harder to read.
    """
    kanji_count = count_kanji(text)
    if kanji_count == 0:
        return 0.0
    elif kanji_count <= 2:
        return 0.25
    elif kanji_count <= 4:
        return 0.5
    elif kanji_count <= 6:
        return 0.75
    else:
        return 1.0


def calculate_vocab_score(text: str) -> float:
    """
    IMPROVED: Real vocabulary frequency scoring using MeCab tokenization.

    Uses N5 vocab list with frequency ranking.
    Returns 0.0 (all common words) to 1.0 (many rare words).
    """
    try:
        # Tokenize
        tokens = list(tagger(text))

        if not tokens:
            return 0.5  # Neutral if parsing fails

        # Get surfaces (actual words)
        surfaces = [t.surface for t in tokens]

        # Score each word
        word_scores = []
        for surface in surfaces:
            # Skip punctuation
            if surface in ['。', '、', '！', '？', '!', '?', ',', '.']:
                continue

            # Try exact match first
            if surface in n5_vocab_rank:
                # Common word = low difficulty
                word_scores.append(1.0 - n5_vocab_rank[surface])
            # Try without punctuation
            elif surface.strip('。、！？!?,') in n5_vocab_rank:
                word_scores.append(1.0 - n5_vocab_rank[surface.strip('。、！？!?,')])
            else:
                # Word not in N5 list = harder
                word_scores.append(0.8)

        # Average difficulty across all words
        if word_scores:
            return sum(word_scores) / len(word_scores)
        else:
            return 0.5

    except Exception as e:
        # Fallback to kanji-based estimate if tokenization fails
        return calculate_kanji_score(text) * 0.8


def calculate_grammar_score(text: str) -> float:
    """
    IMPROVED: Enhanced grammar complexity scoring.

    Detects:
    - Polite vs plain forms
    - Conditionals (たら, ば, なら)
    - Passive/causative
    - Complex verb forms (ている, てある, etc.)
    - Explanatory patterns (んです, のです)
    - Causal connectors (から, ので, けど)
    - Particle density

    Returns 0.0 (very simple) to 1.0 (very complex).
    """
    score = 0.0

    # 1. Plain form vs polite (base difficulty)
    if not re.search(r'(です|ます|でした|ました)$', text):
        score += 0.2  # Plain form = slightly harder

    # 2. Conditionals (HARD - ChatGPT's strong weighting)
    conditionals = re.findall(r'(たら|ば|れば|なら)', text)
    if conditionals:
        score += 0.8  # Conditionals are very hard for N5

    # 3. Passive/Causative (VERY HARD)
    if re.search(r'(られる|れる|させる|させられる)(?!ば)', text):
        score += 0.9

    # 4. Complex verb forms (MODERATE-HARD)
    complex_verbs = len(re.findall(r'(ている|てある|ておく|てしまう|てみる|てくる)', text))
    score += min(complex_verbs * 0.25, 0.5)

    # 5. Explanatory patterns (MODERATE)
    if 'んです' in text or 'のです' in text:
        score += 0.2

    # 6. Quotation/relative clause patterns (MODERATE-HARD)
    if re.search(r'(という|のが|のは)', text):
        score += 0.6

    # 7. Causal connectors (MODERATE)
    connectors = len(re.findall(r'(から|ので|のに|けど|が、)', text))
    score += min(connectors * 0.15, 0.3)

    # 8. Particle density (structural complexity)
    particles = len(re.findall(r'[はがをにでとへのかも]', text))
    particle_density = particles / max(len(text), 1)
    score += min(particle_density * 2, 0.4)

    # Cap at 1.0
    return min(score, 1.0)


def calculate_feature_score(text: str) -> float:
    """
    Additional linguistic features that affect difficulty.

    Returns 0.0-1.0 score.
    """
    score = 0.0

    # 1. Question sentences (often easier due to set patterns)
    if text.endswith('か？') or text.endswith('か。'):
        score -= 0.1

    # 2. Imperative/request forms (moderate)
    if re.search(r'(なさい|てください|ください)$', text):
        score += 0.1

    # 3. Multiple clauses (harder to parse)
    clause_markers = len(re.findall(r'[、。]', text))
    if clause_markers >= 2:
        score += 0.2

    # 4. Known idioms (contextually harder)
    idioms = ['目には目を', 'お大事に', 'お疲れ様', 'いただきます', 'ごちそうさま']
    if any(idiom in text for idiom in idioms):
        score += 0.3

    # Normalize to 0-1 range
    return max(0.0, min(1.0, score + 0.5))


# =============================================================================
# MAIN DIFFICULTY CALCULATION
# =============================================================================

def calculate_raw_difficulty_v2(japanese: str) -> Tuple[float, Dict]:
    """
    Improved difficulty calculation using hybrid approach.

    Weights (recommended by Claude AI & ChatGPT):
    - 20% Length
    - 20% Kanji count
    - 30% Grammar complexity (increased from 20%)
    - 25% Vocab frequency (REAL, not fake)
    - 5% Features

    Returns:
        (raw_score, features_dict)
    """
    # Calculate individual scores
    length_score = calculate_length_score(japanese)
    kanji_score = calculate_kanji_score(japanese)
    grammar_score = calculate_grammar_score(japanese)
    vocab_score = calculate_vocab_score(japanese)
    feature_score = calculate_feature_score(japanese)

    # Weighted combination
    raw_score = (
        0.20 * length_score +
        0.20 * kanji_score +
        0.30 * grammar_score +
        0.25 * vocab_score +
        0.05 * feature_score
    )

    # Clamp to 0-1
    raw_score = max(0.0, min(1.0, raw_score))

    # Store individual features for debugging
    features = {
        'length_score': round(length_score, 3),
        'kanji_score': round(kanji_score, 3),
        'grammar_score': round(grammar_score, 3),
        'vocab_score': round(vocab_score, 3),
        'feature_score': round(feature_score, 3),
        'raw_score': round(raw_score, 3)
    }

    return raw_score, features


def raw_to_level(percentile: float) -> int:
    """
    Convert percentile to difficulty level 1-10 to achieve target distribution.

    Target:
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


# =============================================================================
# DATABASE OPERATIONS
# =============================================================================

def calculate_difficulty_scores(conn: sqlite3.Connection) -> Dict[str, Tuple[int, float, Dict]]:
    """Calculate difficulty scores for all sentences."""
    cursor = conn.cursor()

    # Get all sentences
    cursor.execute("SELECT id, japanese FROM n5_sentences WHERE pass=1")
    sentences = cursor.fetchall()

    print(f"Calculating improved difficulty for {len(sentences)} sentences...")
    print("Using: fugashi tokenization + N5 vocab frequency + enhanced grammar detection")
    print()

    # Calculate raw scores
    sentence_scores = []
    for sent_id, japanese in sentences:
        raw_score, features = calculate_raw_difficulty_v2(japanese)
        sentence_scores.append((sent_id, japanese, raw_score, features))

    # Sort by raw score to determine percentiles
    sentence_scores.sort(key=lambda x: x[2])

    # Assign levels based on percentile ranking
    total = len(sentence_scores)
    difficulty_map = {}

    for idx, (sent_id, japanese, raw_score, features) in enumerate(sentence_scores):
        percentile = (idx / total) * 100
        level = raw_to_level(percentile)
        difficulty_map[sent_id] = (level, raw_score, features)

    return difficulty_map


def update_database(conn: sqlite3.Connection, difficulty_map: Dict[str, Tuple[int, float, Dict]]):
    """Update difficulty scores in database."""
    cursor = conn.cursor()

    print(f"Updating {len(difficulty_map)} difficulty scores in database...")

    # Add validation_meta column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE n5_sentences ADD COLUMN validation_meta TEXT")
        conn.commit()
        print("Added validation_meta column")
    except sqlite3.OperationalError:
        pass  # Column already exists

    # Update each sentence
    for sent_id, (level, raw_score, features) in difficulty_map.items():
        # Store features as JSON for debugging
        meta = json.dumps(features, ensure_ascii=False)

        cursor.execute(
            "UPDATE n5_sentences SET difficulty = ?, validation_meta = ? WHERE id = ?",
            (level, meta, sent_id)
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
    print("IMPROVED DIFFICULTY DISTRIBUTION REPORT")
    print("=" * 80)

    # Group by ranges
    ranges = {
        '1-2': 0,
        '3-4': 0,
        '5-6': 0,
        '7-8': 0,
        '9-10': 0
    }

    for level, count in distribution:
        if 1 <= level <= 2:
            ranges['1-2'] += count
        elif 3 <= level <= 4:
            ranges['3-4'] += count
        elif 5 <= level <= 6:
            ranges['5-6'] += count
        elif 7 <= level <= 8:
            ranges['7-8'] += count
        elif 9 <= level <= 10:
            ranges['9-10'] += count

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

    for range_name, count in ranges.items():
        pct = (count / total) * 100
        target = targets[range_name]
        diff = abs(pct - target)
        status = "✅" if diff <= 2 else "⚠️"
        bar = '█' * int(pct)
        print(f"  Level {range_name}: {count:4d} ({pct:5.1f}%) [Target: {target}%] {status}")
        print(f"           {bar}")

    # Sample sentences from each level with feature breakdown
    print("\n" + "=" * 80)
    print("SAMPLE SENTENCES BY DIFFICULTY (with feature scores)")
    print("=" * 80)

    for level in [1, 3, 5, 7, 9]:
        cursor.execute("""
            SELECT japanese, validation_meta
            FROM n5_sentences
            WHERE difficulty = ? AND pass=1
            LIMIT 3
        """, (level,))

        samples = cursor.fetchall()
        if samples:
            print(f"\n【Level {level} Examples】")
            for idx, (japanese, meta_json) in enumerate(samples, 1):
                print(f"  {idx}. {japanese}")
                if meta_json:
                    try:
                        meta = json.loads(meta_json)
                        print(f"     Grammar:{meta.get('grammar_score',0):.2f} Vocab:{meta.get('vocab_score',0):.2f} "
                              f"Kanji:{meta.get('kanji_score',0):.2f} Length:{meta.get('length_score',0):.2f}")
                    except:
                        pass

    print("\n" + "=" * 80)


# =============================================================================
# MAIN ENTRY POINT
# =============================================================================

def main():
    print("=" * 80)
    print("PHASE 0 V2: IMPROVED DIFFICULTY SCORING")
    print("=" * 80)
    print()
    print("Improvements:")
    print("  ✅ Real vocabulary frequency (fugashi tokenization)")
    print("  ✅ Enhanced grammar complexity detection")
    print("  ✅ Better weighting (30% grammar, 25% vocab)")
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

    print("\n✅ Phase 0 v2 Complete!")
    print(f"📊 Difficulty scores updated for {len(difficulty_map)} sentences")
    print(f"📁 Database: {DB_PATH}")
    print("\nNext: Compare with old results to see improvements")


if __name__ == "__main__":
    main()
