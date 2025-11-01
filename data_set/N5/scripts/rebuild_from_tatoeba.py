#!/usr/bin/env python3
"""
FILTER_ULTRA_PURE_N5.py - Ultra-Pure N5 Sentence Filter

CRITERIA (STRICTEST POSSIBLE):
- 100% N5 vocabulary (ALL tokens must be N5 vocab or particles)
- 100% vocabulary kanji (0 non-vocab kanji)
- N5 grammar only
- Length: 5-35 characters

This filters the 6,190 sentences from set_2 to keep ONLY those with:
- Every content word in N5 vocabulary
- Every particle allowed
- Zero non-N5 vocabulary words

Result: Ultra-pure N5 sentences perfect for absolute beginners.

Author: LingoMemory Development Team
Date: 2025-11-02
License: MIT
"""

import json
import sqlite3
import time
from pathlib import Path
from typing import Set
from collections import defaultdict

# Check dependencies
try:
    import fugashi
    from tqdm import tqdm
except ImportError as e:
    print("ERROR: Missing dependencies. Please install:")
    print("  pip install fugashi unidic-lite tqdm")
    exit(1)

# Initialize MeCab tagger
tagger = fugashi.Tagger()

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent.parent
INPUT_DB = PROJECT_ROOT / "data_set" / "N5" / "set_2" / "n5_sentences_strict.db"
OUTPUT_DB = PROJECT_ROOT / "data_set" / "N5" / "set_2" / "only_n5_vocab_N5_kanji" / "n5_sentences_ultra_pure.db"
N5_VOCAB_FILE = PROJECT_ROOT / "data" / "n5_vocab.txt"

# Particles and function words (always allowed)
ALLOWED_PARTICLES = {
    # Basic particles
    'は', 'が', 'を', 'に', 'へ', 'で', 'と', 'から', 'まで', 'の', 'も', 'や', 'か', 'ね', 'よ', 'わ',
    # Question/sentence ending
    'です', 'ます', 'だ', 'でした', 'ました', 'ない', 'ません',
    # Conjunctions
    'そして', 'それから', 'でも', 'しかし', 'だから',
    # Copula forms
    'じゃ', 'では',
}


def load_n5_vocab() -> Set[str]:
    """Load N5 vocabulary list"""
    if not N5_VOCAB_FILE.exists():
        print(f"ERROR: {N5_VOCAB_FILE} not found")
        exit(1)

    with N5_VOCAB_FILE.open('r', encoding='utf-8') as f:
        return set(line.strip() for line in f if line.strip())


def is_particle_or_auxiliary(token) -> bool:
    """Check if token is a particle or auxiliary (always allowed)"""
    pos1 = token.feature.pos1
    pos2 = token.feature.pos2 if hasattr(token.feature, 'pos2') else ""

    # Particles, auxiliaries, symbols, punctuation always allowed
    if pos1 in ("助詞", "助動詞", "記号", "補助記号"):
        return True

    # Check if it's in our explicit allowed list
    if token.surface in ALLOWED_PARTICLES:
        return True

    return False


def check_100_percent_n5_vocab(sentence: str, n5_vocab: Set[str]) -> tuple[bool, str]:
    """
    Check if sentence uses ONLY N5 vocabulary + particles

    Returns: (is_pure, rejection_reason)
    """
    tokens = tagger.parseToNodeList(sentence)

    non_n5_words = []

    for token in tokens:
        # Skip particles and auxiliaries (always allowed)
        if is_particle_or_auxiliary(token):
            continue

        # Check if content word is in N5 vocabulary
        surface = token.surface

        if surface not in n5_vocab:
            non_n5_words.append(surface)

    if non_n5_words:
        return False, f"non_n5_words: {','.join(set(non_n5_words))}"

    return True, ""


def init_output_db(db_path: Path):
    """Initialize output SQLite database"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS n5_sentences (
            id TEXT PRIMARY KEY,
            japanese TEXT NOT NULL,
            english TEXT,
            source TEXT DEFAULT 'tatoeba',
            source_id TEXT,
            license TEXT DEFAULT 'CC BY 2.0 FR',
            difficulty INTEGER,
            vocab_coverage REAL,
            non_vocab_kanji INTEGER,
            pass INTEGER,
            rejection_reason TEXT,
            created_at REAL
        )
    """)

    cursor.execute("CREATE INDEX IF NOT EXISTS idx_pass ON n5_sentences(pass)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_difficulty ON n5_sentences(difficulty)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_japanese ON n5_sentences(japanese)")

    conn.commit()
    conn.close()
    print(f"✓ Output database initialized: {db_path}")


def filter_ultra_pure(input_db: Path, output_db: Path, n5_vocab: Set[str]):
    """Filter set_2 database to keep only 100% N5 vocab sentences"""

    print("\n" + "="*60)
    print("FILTERING FOR ULTRA-PURE N5 SENTENCES")
    print("="*60)

    # Connect to input database
    in_conn = sqlite3.connect(input_db)
    in_cursor = in_conn.cursor()

    # Get all passed sentences from set_2
    in_cursor.execute("SELECT COUNT(*) FROM n5_sentences WHERE pass=1")
    total = in_cursor.fetchone()[0]
    print(f"\nInput: {total:,} sentences from set_2")

    # Process each sentence
    in_cursor.execute("""
        SELECT id, japanese, english, source, source_id, license,
               difficulty, vocab_coverage, non_vocab_kanji
        FROM n5_sentences
        WHERE pass=1
    """)

    stats = {
        'total': total,
        'ultra_pure': 0,
        'rejected': 0,
        'rejection_reasons': defaultdict(int),
        'difficulty_distribution': defaultdict(int)
    }

    out_conn = sqlite3.connect(output_db)
    out_cursor = out_conn.cursor()

    print("\nProcessing sentences...")
    for row in tqdm(in_cursor.fetchall(), total=total, desc="Filtering"):
        sid, jpn, eng, source, source_id, license, diff, vocab_cov, non_vocab = row

        # Check if 100% N5 vocabulary
        is_pure, reason = check_100_percent_n5_vocab(jpn, n5_vocab)

        if is_pure:
            # Insert into ultra-pure database
            out_cursor.execute("""
                INSERT INTO n5_sentences
                (id, japanese, english, source, source_id, license,
                 difficulty, vocab_coverage, non_vocab_kanji, pass, rejection_reason, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, '', ?)
            """, (sid, jpn, eng, source, source_id, license, diff, vocab_cov, non_vocab, time.time()))

            stats['ultra_pure'] += 1
            stats['difficulty_distribution'][diff] += 1
        else:
            stats['rejected'] += 1
            reason_type = reason.split(':')[0]
            stats['rejection_reasons'][reason_type] += 1

    out_conn.commit()
    out_conn.close()
    in_conn.close()

    return stats


def print_summary(stats: dict):
    """Print filtering summary"""
    print("\n" + "="*60)
    print("ULTRA-PURE FILTERING SUMMARY")
    print("="*60)

    total = stats['total']
    ultra_pure = stats['ultra_pure']
    rejected = stats['rejected']

    print(f"\nInput (set_2): {total:,} sentences")
    print(f"  ✓ Ultra-pure (100% N5 vocab): {ultra_pure:,} ({ultra_pure/total*100:.1f}%)")
    print(f"  ✗ Rejected: {rejected:,} ({rejected/total*100:.1f}%)")

    if rejected > 0:
        print("\nRejection reasons:")
        for reason, count in sorted(stats['rejection_reasons'].items(),
                                    key=lambda x: x[1], reverse=True):
            print(f"  {reason}: {count:,} ({count/rejected*100:.1f}%)")

    print("\nDifficulty distribution (ultra-pure sentences):")
    for difficulty in sorted(stats['difficulty_distribution'].keys()):
        count = stats['difficulty_distribution'][difficulty]
        print(f"  Level {difficulty}: {count:,} ({count/ultra_pure*100:.1f}%)")

    print("\n" + "="*60)
    print("✓ ULTRA-PURE N5 DATABASE BUILD COMPLETE!")
    print(f"  Database: {OUTPUT_DB}")
    print(f"  Total ultra-pure sentences: {ultra_pure:,}")
    print("="*60)


def main():
    """Main execution"""
    print("\n" + "="*60)
    print("ULTRA-PURE N5 FILTER (100% N5 VOCABULARY)")
    print("="*60)
    print("\nCRITERIA:")
    print("  • 100% N5 vocabulary (ALL tokens must be N5 or particles)")
    print("  • 0 non-vocabulary kanji (inherited from set_2)")
    print("  • N5 grammar only (inherited from set_2)")

    # Check input database exists
    if not INPUT_DB.exists():
        print(f"ERROR: {INPUT_DB} not found")
        print("Please run BUILD_N5_DATABASE_STRICT.py first")
        exit(1)

    # Load N5 vocabulary
    print("\nLoading N5 vocabulary...")
    n5_vocab = load_n5_vocab()
    print(f"  ✓ Loaded {len(n5_vocab)} N5 vocabulary entries")
    print(f"  ✓ {len(ALLOWED_PARTICLES)} particles/auxiliaries always allowed")

    # Initialize output database
    print("\nInitializing output database...")
    if OUTPUT_DB.exists():
        print(f"  WARNING: {OUTPUT_DB} already exists, will be overwritten")
        OUTPUT_DB.unlink()

    init_output_db(OUTPUT_DB)

    # Filter sentences
    stats = filter_ultra_pure(INPUT_DB, OUTPUT_DB, n5_vocab)

    # Print summary
    print_summary(stats)


if __name__ == "__main__":
    main()
