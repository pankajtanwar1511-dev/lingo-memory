#!/usr/bin/env python3
"""
Phase 1: Tag & Classify N5 Sentences

Adds formality and question-type metadata to all sentences in the database.

Classifies sentences as:
- Formality: 'formal' (polite です/ます) or 'casual' (plain だ/verb dictionary form)
- Question type: 'polite_question', 'casual_question', or None

Usage:
    python3 phase1_tag_classify.py
"""

import sqlite3
import re
from pathlib import Path
from typing import Tuple, Optional

# Paths
DB_PATH = Path(__file__).parent.parent / "n5_sentences_ultra_pure.db"


# =============================================================================
# CLASSIFICATION FUNCTIONS
# =============================================================================

def classify_formality(japanese: str) -> str:
    """
    Classify sentence as 'formal' (polite) or 'casual' (plain).

    Formal indicators:
    - です, ます, でした, ました
    - ございます (very polite)
    - お〜ください (polite request)

    Returns:
        'formal' or 'casual'
    """
    # Remove whitespace for consistency
    text = japanese.strip()

    # Formal patterns (polite forms)
    formal_patterns = [
        r'です(?:[。！？]|$)',          # です at end
        r'ます(?:[。！？]|$)',          # ます at end
        r'でした(?:[。！？]|$)',        # でした at end
        r'ました(?:[。！？]|$)',        # ました at end
        r'ございます',                   # very polite
        r'ください',                     # polite request
        r'なさい',                       # polite imperative
    ]

    for pattern in formal_patterns:
        if re.search(pattern, text):
            return 'formal'

    # Default to casual if no formal markers
    return 'casual'


def classify_question(japanese: str) -> Optional[str]:
    """
    Classify question type.

    Returns:
        'polite_question' - ends with ですか/ますか/でしょうか
        'casual_question' - ends with の?/かな/だっけ/question with か but casual
        None - not a question
    """
    text = japanese.strip()

    # Polite question patterns
    polite_question_patterns = [
        r'ですか[？。]?$',
        r'ますか[？。]?$',
        r'でしたか[？。]?$',
        r'ましたか[？。]?$',
        r'でしょうか[？。]?$',
    ]

    for pattern in polite_question_patterns:
        if re.search(pattern, text):
            return 'polite_question'

    # Casual question patterns
    casual_question_patterns = [
        r'の[？?]$',              # の？
        r'のか[？?]$',            # のか？
        r'かな[？?]?$',           # かな/かな？
        r'だっけ[？?]?$',         # だっけ/だっけ？
        r'っけ[？?]?$',           # っけ/っけ？
        r'[？?]$',                # ends with ?
        r'(?<!です)(?<!ます)か[？。]?$',  # か but not polite
    ]

    for pattern in casual_question_patterns:
        if re.search(pattern, text):
            return 'casual_question'

    return None


def classify_sentence(japanese: str) -> Tuple[str, Optional[str]]:
    """
    Classify both formality and question type.

    Returns:
        (formality, question_type)
    """
    formality = classify_formality(japanese)
    question_type = classify_question(japanese)

    return formality, question_type


# =============================================================================
# DATABASE OPERATIONS
# =============================================================================

def add_metadata_columns(conn: sqlite3.Connection):
    """Add formality and question metadata columns if they don't exist."""
    cursor = conn.cursor()

    try:
        cursor.execute("ALTER TABLE n5_sentences ADD COLUMN formality TEXT")
        print("✅ Added 'formality' column")
    except sqlite3.OperationalError:
        print("⏭️  'formality' column already exists")

    try:
        cursor.execute("ALTER TABLE n5_sentences ADD COLUMN is_question TEXT")
        print("✅ Added 'is_question' column")
    except sqlite3.OperationalError:
        print("⏭️  'is_question' column already exists")

    conn.commit()


def classify_all_sentences(conn: sqlite3.Connection):
    """Classify all sentences and update database."""
    cursor = conn.cursor()

    # Get all passing sentences
    cursor.execute("SELECT id, japanese FROM n5_sentences WHERE pass=1")
    sentences = cursor.fetchall()

    print(f"\nClassifying {len(sentences)} sentences...")

    # Track statistics
    stats = {
        'formal': 0,
        'casual': 0,
        'polite_question': 0,
        'casual_question': 0,
        'statement': 0
    }

    # Classify and update each sentence
    for idx, (sent_id, japanese) in enumerate(sentences, 1):
        formality, question_type = classify_sentence(japanese)

        # Update statistics
        stats[formality] += 1
        if question_type:
            stats[question_type] += 1
        else:
            stats['statement'] += 1

        # Update database
        cursor.execute(
            "UPDATE n5_sentences SET formality = ?, is_question = ? WHERE id = ?",
            (formality, question_type, sent_id)
        )

        # Progress indicator
        if idx % 500 == 0:
            print(f"  Processed {idx}/{len(sentences)}...")

    conn.commit()
    print(f"✅ Classified all {len(sentences)} sentences")

    return stats


def generate_report(conn: sqlite3.Connection, stats: dict):
    """Generate classification report."""
    cursor = conn.cursor()

    # Get total count
    cursor.execute("SELECT COUNT(*) FROM n5_sentences WHERE pass=1")
    total = cursor.fetchone()[0]

    print("\n" + "=" * 80)
    print("PHASE 1: CLASSIFICATION REPORT")
    print("=" * 80)

    print(f"\nTotal sentences: {total}")

    # Formality distribution
    print("\n【Formality Distribution】")
    formal_count = stats['formal']
    casual_count = stats['casual']
    formal_pct = (formal_count / total) * 100
    casual_pct = (casual_count / total) * 100

    print(f"  Formal (polite):  {formal_count:4d} ({formal_pct:5.1f}%) {'█' * int(formal_pct / 2)}")
    print(f"  Casual (plain):   {casual_count:4d} ({casual_pct:5.1f}%) {'█' * int(casual_pct / 2)}")

    # Question distribution
    print("\n【Question Type Distribution】")
    polite_q = stats['polite_question']
    casual_q = stats['casual_question']
    statement = stats['statement']
    polite_q_pct = (polite_q / total) * 100
    casual_q_pct = (casual_q / total) * 100
    statement_pct = (statement / total) * 100

    print(f"  Polite questions: {polite_q:4d} ({polite_q_pct:5.1f}%) {'█' * int(polite_q_pct / 2)}")
    print(f"  Casual questions: {casual_q:4d} ({casual_q_pct:5.1f}%) {'█' * int(casual_q_pct / 2)}")
    print(f"  Statements:       {statement:4d} ({statement_pct:5.1f}%) {'█' * int(statement_pct / 2)}")

    # Sample sentences by category
    print("\n" + "=" * 80)
    print("SAMPLE SENTENCES BY CATEGORY")
    print("=" * 80)

    categories = [
        ("Formal Statements", "formality='formal' AND is_question IS NULL"),
        ("Casual Statements", "formality='casual' AND is_question IS NULL"),
        ("Polite Questions", "is_question='polite_question'"),
        ("Casual Questions", "is_question='casual_question'"),
    ]

    for category_name, condition in categories:
        cursor.execute(f"""
            SELECT japanese, difficulty
            FROM n5_sentences
            WHERE pass=1 AND {condition}
            ORDER BY difficulty
            LIMIT 5
        """)
        samples = cursor.fetchall()

        if samples:
            print(f"\n【{category_name}】")
            for jp, diff in samples:
                print(f"  Level {diff}: {jp}")

    print("\n" + "=" * 80)


# =============================================================================
# MAIN ENTRY POINT
# =============================================================================

def main():
    print("=" * 80)
    print("PHASE 1: TAG & CLASSIFY N5 SENTENCES")
    print("=" * 80)
    print()
    print("Adding formality and question-type metadata to all sentences.")
    print(f"Database: {DB_PATH}")
    print()

    conn = sqlite3.connect(DB_PATH)

    try:
        # Step 1: Add metadata columns
        print("Step 1: Adding metadata columns...")
        add_metadata_columns(conn)

        # Step 2: Classify all sentences
        print("\nStep 2: Classifying sentences...")
        stats = classify_all_sentences(conn)

        # Step 3: Generate report
        generate_report(conn, stats)

    finally:
        conn.close()

    print("\n✅ Phase 1 Complete!")
    print(f"📊 All sentences tagged with formality and question type")
    print(f"📁 Database: {DB_PATH}")


if __name__ == "__main__":
    main()
