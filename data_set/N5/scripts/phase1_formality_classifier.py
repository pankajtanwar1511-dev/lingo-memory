#!/usr/bin/env python3
"""
Phase 1: Formality and Question Type Classifier for N5 Japanese Sentences

Based on AI consultation (Claude AI + ChatGPT) - 2025-11-02
Consensus rating: 8/10 (7/10 from Claude, 9/10 from ChatGPT)

Key improvements implemented:
1. Check sentence ENDING only (last 15 chars) for mixed formality handling
2. Add だ/だった/だろう detection (CRITICAL missing patterns)
3. Check polite questions BEFORE casual (prevents over-matching)
4. Add でしょう, てください, じゃない patterns

Expected accuracy: 95%+ on N5 corpus
"""

import re
import sqlite3
from typing import Optional, Tuple
from pathlib import Path


def classify_formality(text: str) -> str:
    """
    Classify sentence as 'formal' (polite) or 'casual' (plain).

    Checks sentence ending to handle mixed formality correctly.
    Example: 私は学生ですが、兄は先生だ。→ 'casual' (ends with だ)

    Args:
        text: Japanese sentence

    Returns:
        'formal': です/ます form
        'casual': plain form
    """
    # Check last 15 characters for formality markers
    # This handles mixed formality: sentence-ending predicate determines tone
    ending = text[-15:] if len(text) > 15 else text

    # FORMAL PATTERNS (polite forms)
    formal_patterns = [
        r'です[。！？か]?[。！？]?$',      # です or ですか or ですか。
        r'ます[。！？か]?[。！？]?$',      # ます or ますか or ますか。
        r'でした[。！？か]?[。！？]?$',    # でした or でしたか
        r'ました[。！？か]?[。！？]?$',    # ました or ましたか
        r'でしょう[。！？か]?[。！？]?$',  # NEW: でしょう or でしょうか
        r'ございます[。！？か]?[。！？]?$',
        r'ください[。！？]?$',
        r'てください[。！？]?$',           # NEW: specific polite request (見てください。)
        r'なさい[。！？]?$',
    ]

    # CASUAL PATTERNS (explicit plain forms)
    casual_patterns = [
        r'だ[。！？]?$',            # NEW: plain copula (CRITICAL! - これは学生だ。)
        r'だった[。！？]?$',        # NEW: past plain copula (彼は先生だった。)
        r'だろう[。！？]?$',        # NEW: casual speculation (明日は雨だろう。)
        r'じゃない[。！？]?$',      # NEW: negative plain copula (学生じゃない。)
        r'んだ[。！？]?$',          # explanatory casual (そうなんだ。)
        r'(よ|ね|さ|ぞ|ぜ|わ)[。！？]?$',  # sentence-ending particles (行くよ。)
    ]

    # Check formal first (higher priority for です/ます)
    for pattern in formal_patterns:
        if re.search(pattern, ending):
            return 'formal'

    # Check explicit casual markers
    for pattern in casual_patterns:
        if re.search(pattern, ending):
            return 'casual'

    # Default: assume casual for plain verbs/adjectives
    # (Most plain forms won't match explicit patterns above)
    # Examples: 今日は暑い。学校に行く。食べる。
    return 'casual'


def classify_question(text: str) -> Optional[str]:
    """
    Classify question type.

    IMPORTANT: Checks polite patterns FIRST to prevent over-matching.
    Example: これは何ですか？ → 'polite_question' (not casual due to です)

    Args:
        text: Japanese sentence

    Returns:
        'polite_question': です/ます + か
        'casual_question': plain form questions
        None: not a question
    """
    # 1. POLITE QUESTIONS (check first - higher priority)
    polite_patterns = [
        r'ですか[？。]?$',
        r'ますか[？。]?$',
        r'でしたか[？。]?$',
        r'ましたか[？。]?$',
        r'でしょうか[？。]?$',
        r'ございますか[？。]?$',
    ]

    for pattern in polite_patterns:
        if re.search(pattern, text):
            return 'polite_question'

    # 2. CASUAL QUESTIONS (only if not polite)
    casual_patterns = [
        r'の[？?]$',              # の？
        r'のか[？?]$',            # のか？ (embedded のか won't match due to $ anchor)
        r'かな[？?]?$',           # かな？
        r'かい[？?]?$',           # かい？ (masculine)
        r'だい[？?]?$',           # だい？ (masculine)
        r'だろう[？?]?$',         # だろう？
        r'だっけ[？?]?$',         # だっけ？
        r'っけ[？?]?$',           # っけ？
        r'[？?]$',                # Last resort: any ? (checked after polite patterns)
    ]

    for pattern in casual_patterns:
        if re.search(pattern, text):
            return 'casual_question'

    # 3. Not a question
    return None


def classify_sentence(text: str) -> Tuple[str, Optional[str]]:
    """
    Classify both formality and question type.

    Args:
        text: Japanese sentence

    Returns:
        (formality, question_type)
        - formality: 'formal' or 'casual'
        - question_type: 'polite_question', 'casual_question', or None
    """
    formality = classify_formality(text)
    question_type = classify_question(text)

    return formality, question_type


def test_classifier():
    """
    Test the classifier on known cases.
    Must achieve 100% accuracy to proceed.
    """
    test_cases = [
        # (sentence, expected_formality, expected_question)
        ('今日は暑いです。', 'formal', None),
        ('今日は暑い。', 'casual', None),
        ('これは何ですか。', 'formal', 'polite_question'),
        ('何が問題なの？', 'casual', 'casual_question'),
        ('私は学生ですが、兄は先生だ。', 'casual', None),  # Mixed formality!
        ('学校に行く。', 'casual', None),
        ('学校に行きます。', 'formal', None),
        ('うるさい！', 'casual', None),
        ('これ食べる？', 'casual', 'casual_question'),
        ('何が問題なのかわからない。', 'casual', None),  # Embedded question
        ('頑張って！', 'casual', None),
        ('明日は晴れるでしょうか。', 'formal', 'polite_question'),
        ('これは学生だ。', 'casual', None),  # だ copula
        ('きっと雨でしょう。', 'formal', None),  # でしょう (not question)
    ]

    print("=" * 70)
    print("PHASE 1: FORMALITY CLASSIFIER TEST")
    print("=" * 70)

    correct = 0
    total = len(test_cases)

    for sentence, expected_form, expected_q in test_cases:
        actual_form, actual_q = classify_sentence(sentence)

        form_match = actual_form == expected_form
        q_match = actual_q == expected_q
        is_correct = form_match and q_match

        status = "✅" if is_correct else "❌"
        correct += is_correct

        print(f"\n{status} {sentence}")
        print(f"   Expected: formality={expected_form}, question={expected_q}")
        print(f"   Got:      formality={actual_form}, question={actual_q}")

        if not is_correct:
            if not form_match:
                print(f"   ⚠️  Formality mismatch!")
            if not q_match:
                print(f"   ⚠️  Question type mismatch!")

    print("\n" + "=" * 70)
    accuracy = 100 * correct / total
    print(f"Test Accuracy: {correct}/{total} ({accuracy:.1f}%)")
    print("=" * 70)

    if accuracy == 100.0:
        print("✅ All tests passed! Ready to classify corpus.")
        return True
    else:
        print("❌ Tests failed! Fix classifier before proceeding.")
        return False


def classify_corpus(db_path: Path):
    """
    Classify all N5 sentences in the database.
    Adds formality and question_type columns.

    Args:
        db_path: Path to n5_sentences_ultra_pure.db
    """
    print("\n" + "=" * 70)
    print("CLASSIFYING N5 CORPUS")
    print("=" * 70)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Add columns if they don't exist
    try:
        cursor.execute("ALTER TABLE n5_sentences ADD COLUMN formality TEXT")
        print("✅ Added 'formality' column")
    except sqlite3.OperationalError:
        print("⚠️  'formality' column already exists")

    try:
        cursor.execute("ALTER TABLE n5_sentences ADD COLUMN question_type TEXT")
        print("✅ Added 'question_type' column")
    except sqlite3.OperationalError:
        print("⚠️  'question_type' column already exists")

    # Get all sentences
    cursor.execute("SELECT id, japanese FROM n5_sentences")
    sentences = cursor.fetchall()

    print(f"\nProcessing {len(sentences)} sentences...")

    # Classify and update
    for i, (sentence_id, japanese) in enumerate(sentences, 1):
        formality, question_type = classify_sentence(japanese)

        cursor.execute("""
            UPDATE n5_sentences
            SET formality = ?, question_type = ?
            WHERE id = ?
        """, (formality, question_type, sentence_id))

        if i % 500 == 0:
            print(f"  Processed {i}/{len(sentences)}...")

    conn.commit()
    print(f"✅ Classified all {len(sentences)} sentences")

    # Show distribution
    print("\n" + "=" * 70)
    print("CLASSIFICATION DISTRIBUTION")
    print("=" * 70)

    cursor.execute("""
        SELECT
            formality,
            COUNT(*) as count,
            ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM n5_sentences), 1) as percentage
        FROM n5_sentences
        GROUP BY formality
        ORDER BY count DESC
    """)

    print("\nFormality Distribution:")
    for formality, count, pct in cursor.fetchall():
        print(f"  {formality:10s}: {count:4d} ({pct:5.1f}%)")

    cursor.execute("""
        SELECT
            question_type,
            COUNT(*) as count,
            ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM n5_sentences), 1) as percentage
        FROM n5_sentences
        WHERE question_type IS NOT NULL
        GROUP BY question_type
        ORDER BY count DESC
    """)

    print("\nQuestion Type Distribution:")
    for q_type, count, pct in cursor.fetchall():
        print(f"  {q_type:20s}: {count:4d} ({pct:5.1f}%)")

    cursor.execute("""
        SELECT COUNT(*)
        FROM n5_sentences
        WHERE question_type IS NULL
    """)
    non_questions = cursor.fetchone()[0]
    pct = 100.0 * non_questions / len(sentences)
    print(f"  {'(statements)':20s}: {non_questions:4d} ({pct:5.1f}%)")

    conn.close()


def validate_classification(db_path: Path):
    """
    Validate classification results with sanity checks.

    Args:
        db_path: Path to n5_sentences_ultra_pure.db
    """
    print("\n" + "=" * 70)
    print("VALIDATION: SANITY CHECKS")
    print("=" * 70)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check 1: Sentences marked 'formal' but ending with だ
    cursor.execute("""
        SELECT japanese, formality, question_type
        FROM n5_sentences
        WHERE formality = 'formal' AND (
            japanese LIKE '%だ。' OR
            japanese LIKE '%だった。' OR
            japanese LIKE '%だろう。'
        )
        LIMIT 10
    """)

    results = cursor.fetchall()
    if results:
        print("\n⚠️  POTENTIAL ISSUE: Formal sentences ending with だ/だった/だろう")
        for jp, form, q in results:
            print(f"  {jp} → {form}, {q}")
    else:
        print("\n✅ No formal sentences ending with だ")

    # Check 2: Sentences marked 'casual_question' but have ですか/ますか
    cursor.execute("""
        SELECT japanese, formality, question_type
        FROM n5_sentences
        WHERE question_type = 'casual_question' AND (
            japanese LIKE '%ですか%' OR
            japanese LIKE '%ますか%'
        )
        LIMIT 10
    """)

    results = cursor.fetchall()
    if results:
        print("\n⚠️  POTENTIAL ISSUE: Casual questions with ですか/ますか")
        for jp, form, q in results:
            print(f"  {jp} → {form}, {q}")
    else:
        print("✅ No casual questions with ですか/ますか")

    # Check 3: Mixed formality examples
    cursor.execute("""
        SELECT japanese, formality, question_type
        FROM n5_sentences
        WHERE japanese LIKE '%です%' AND japanese LIKE '%だ%'
        LIMIT 10
    """)

    results = cursor.fetchall()
    if results:
        print("\n📋 Mixed formality sentences (です + だ):")
        for jp, form, q in results:
            print(f"  {jp} → {form}, {q}")

    # Check 4: Sample random sentences for manual review
    print("\n" + "=" * 70)
    print("RANDOM SAMPLES FOR MANUAL REVIEW (10 formal, 10 casual)")
    print("=" * 70)

    cursor.execute("""
        SELECT japanese, formality, question_type
        FROM n5_sentences
        WHERE formality = 'formal'
        ORDER BY RANDOM()
        LIMIT 10
    """)

    print("\nFormal samples:")
    for jp, form, q in cursor.fetchall():
        print(f"  {form:10s} {str(q):20s} | {jp}")

    cursor.execute("""
        SELECT japanese, formality, question_type
        FROM n5_sentences
        WHERE formality = 'casual'
        ORDER BY RANDOM()
        LIMIT 10
    """)

    print("\nCasual samples:")
    for jp, form, q in cursor.fetchall():
        print(f"  {form:10s} {str(q):20s} | {jp}")

    conn.close()


def main():
    """Main execution."""
    print("=" * 70)
    print("PHASE 1: FORMALITY & QUESTION TYPE CLASSIFIER")
    print("Based on AI consultation (Claude AI + ChatGPT)")
    print("Expected accuracy: 95%+ on N5 corpus")
    print("=" * 70)

    # Step 1: Run tests
    if not test_classifier():
        print("\n❌ Tests failed. Exiting.")
        return

    # Step 2: Classify corpus
    db_path = Path(__file__).parent.parent / "n5_sentences_ultra_pure.db"

    if not db_path.exists():
        print(f"\n❌ Database not found: {db_path}")
        return

    classify_corpus(db_path)

    # Step 3: Validate results
    validate_classification(db_path)

    print("\n" + "=" * 70)
    print("✅ PHASE 1 COMPLETE")
    print("=" * 70)
    print("\nNext steps:")
    print("1. Manually review random samples above")
    print("2. Check distribution matches expected (30-40% formal, 60-70% casual)")
    print("3. If accuracy looks good, proceed to Phase 2 (tokenization)")


if __name__ == "__main__":
    main()
