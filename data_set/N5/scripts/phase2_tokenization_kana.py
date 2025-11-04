#!/usr/bin/env python3
"""
Phase 2: Tokenization & Kana Generation for N5 Japanese Sentences

Adds the following columns to the database:
- japanese_spaced: Tokenized Japanese with spaces
- kana: Full kana reading
- kana_spaced: Spaced kana reading
- vocab_hits: JSON array of N5 words found in sentence

Uses fugashi (MeCab) for morphological analysis.
"""

import sqlite3
import json
import fugashi
from pathlib import Path
from typing import List, Tuple, Dict


class N5Tokenizer:
    """Tokenizer for N5 sentences with kana generation and vocab tracking."""

    def __init__(self, n5_vocab_path: Path):
        """
        Initialize tokenizer.

        Args:
            n5_vocab_path: Path to N5 word list (one word per line)
        """
        self.tagger = fugashi.Tagger()

        # Load N5 vocabulary
        self.n5_vocab = self._load_n5_vocab(n5_vocab_path)
        print(f"Loaded {len(self.n5_vocab)} N5 words")

    def _load_n5_vocab(self, vocab_path: Path) -> set:
        """Load N5 vocabulary from file."""
        if not vocab_path.exists():
            raise FileNotFoundError(f"N5 vocab file not found: {vocab_path}")

        with open(vocab_path, 'r', encoding='utf-8') as f:
            # Remove whitespace and empty lines
            words = {line.strip() for line in f if line.strip()}

        return words

    def tokenize(self, text: str) -> Tuple[str, str, str, List[str]]:
        """
        Tokenize sentence and generate kana.

        Args:
            text: Japanese sentence

        Returns:
            Tuple of (japanese_spaced, kana, kana_spaced, vocab_hits)
        """
        tokens = list(self.tagger(text))

        japanese_parts = []
        kana_parts = []
        vocab_hits = []

        for token in tokens:
            surface = token.surface  # The word as it appears

            # Get kana reading
            # Try feature.kana first, fallback to surface if not available
            try:
                if hasattr(token.feature, 'kana') and token.feature.kana:
                    kana = token.feature.kana
                else:
                    # Fallback: use surface for punctuation/symbols
                    kana = surface
            except:
                kana = surface

            japanese_parts.append(surface)
            kana_parts.append(kana)

            # Check if this token is an N5 word
            if surface in self.n5_vocab:
                vocab_hits.append(surface)

        japanese_spaced = ' '.join(japanese_parts)
        kana = ''.join(kana_parts)  # No spaces
        kana_spaced = ' '.join(kana_parts)

        # Remove duplicates from vocab_hits while preserving order
        vocab_hits = list(dict.fromkeys(vocab_hits))

        return japanese_spaced, kana, kana_spaced, vocab_hits


def test_tokenizer():
    """Test tokenizer on sample sentences."""
    print("=" * 70)
    print("PHASE 2: TOKENIZATION & KANA TEST")
    print("=" * 70)

    # Get N5 word list path
    script_dir = Path(__file__).parent
    vocab_path = script_dir.parent / "reference" / "n5_vocab.txt"

    tokenizer = N5Tokenizer(vocab_path)

    test_sentences = [
        "今日は暑いです。",
        "学校に行きます。",
        "これは何ですか。",
        "私は学生だ。",
        "うるさい！",
    ]

    print("\nTest Results:")
    print("=" * 70)

    for sentence in test_sentences:
        jp_spaced, kana, kana_spaced, vocab = tokenizer.tokenize(sentence)

        print(f"\nOriginal:        {sentence}")
        print(f"Japanese spaced: {jp_spaced}")
        print(f"Kana:            {kana}")
        print(f"Kana spaced:     {kana_spaced}")
        print(f"Vocab hits:      {vocab}")

    print("\n" + "=" * 70)
    print("✅ Test complete")


def process_corpus(db_path: Path, vocab_path: Path):
    """
    Process all sentences in the database.

    Args:
        db_path: Path to n5_sentences_ultra_pure.db
        vocab_path: Path to N5 word list
    """
    print("\n" + "=" * 70)
    print("PROCESSING N5 CORPUS")
    print("=" * 70)

    tokenizer = N5Tokenizer(vocab_path)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Add columns if they don't exist
    columns_to_add = [
        ("japanese_spaced", "TEXT"),
        ("kana", "TEXT"),
        ("kana_spaced", "TEXT"),
        ("vocab_hits", "TEXT"),  # JSON array
    ]

    for col_name, col_type in columns_to_add:
        try:
            cursor.execute(f"ALTER TABLE n5_sentences ADD COLUMN {col_name} {col_type}")
            print(f"✅ Added '{col_name}' column")
        except sqlite3.OperationalError:
            print(f"⚠️  '{col_name}' column already exists")

    # Get all sentences
    cursor.execute("SELECT id, japanese FROM n5_sentences")
    sentences = cursor.fetchall()

    print(f"\nProcessing {len(sentences)} sentences...")

    # Process each sentence
    for i, (sentence_id, japanese) in enumerate(sentences, 1):
        jp_spaced, kana, kana_spaced, vocab = tokenizer.tokenize(japanese)

        # Convert vocab list to JSON
        vocab_json = json.dumps(vocab, ensure_ascii=False)

        cursor.execute("""
            UPDATE n5_sentences
            SET japanese_spaced = ?,
                kana = ?,
                kana_spaced = ?,
                vocab_hits = ?
            WHERE id = ?
        """, (jp_spaced, kana, kana_spaced, vocab_json, sentence_id))

        if i % 500 == 0:
            print(f"  Processed {i}/{len(sentences)}...")
            conn.commit()  # Commit periodically

    conn.commit()
    print(f"✅ Processed all {len(sentences)} sentences")

    # Generate statistics
    print("\n" + "=" * 70)
    print("STATISTICS")
    print("=" * 70)

    # Sentences with vocab hits
    cursor.execute("SELECT COUNT(*) FROM n5_sentences WHERE vocab_hits != '[]'")
    with_vocab = cursor.fetchone()[0]
    print(f"\nSentences with N5 vocab: {with_vocab}/{len(sentences)} ({100*with_vocab/len(sentences):.1f}%)")

    # Average vocab hits per sentence
    cursor.execute("""
        SELECT AVG(json_array_length(vocab_hits))
        FROM n5_sentences
        WHERE vocab_hits != '[]'
    """)
    avg_vocab = cursor.fetchone()[0]
    if avg_vocab:
        print(f"Average vocab hits: {avg_vocab:.1f} words/sentence")

    # Sample results
    print("\n" + "=" * 70)
    print("SAMPLE RESULTS (10 random sentences)")
    print("=" * 70)

    cursor.execute("""
        SELECT japanese, japanese_spaced, kana, vocab_hits
        FROM n5_sentences
        ORDER BY RANDOM()
        LIMIT 10
    """)

    for jp, jp_sp, kn, vocab_json in cursor.fetchall():
        vocab = json.loads(vocab_json)
        print(f"\nOriginal:   {jp}")
        print(f"Spaced:     {jp_sp}")
        print(f"Kana:       {kn}")
        print(f"Vocab ({len(vocab)}): {', '.join(vocab[:5])}{'...' if len(vocab) > 5 else ''}")

    conn.close()


def main():
    """Main execution."""
    print("=" * 70)
    print("PHASE 2: TOKENIZATION & KANA GENERATION")
    print("=" * 70)

    script_dir = Path(__file__).parent
    db_path = script_dir.parent / "n5_sentences_ultra_pure.db"
    vocab_path = script_dir.parent / "reference" / "n5_vocab.txt"

    if not db_path.exists():
        print(f"\n❌ Database not found: {db_path}")
        return

    if not vocab_path.exists():
        print(f"\n❌ N5 word list not found: {vocab_path}")
        return

    # Step 1: Test tokenizer
    test_tokenizer()

    # Step 2: Process corpus
    process_corpus(db_path, vocab_path)

    print("\n" + "=" * 70)
    print("✅ PHASE 2 COMPLETE")
    print("=" * 70)
    print("\nNext steps:")
    print("1. Review sample results above")
    print("2. Check that kana readings are correct")
    print("3. Verify vocab_hits match expected N5 words")
    print("4. If accuracy looks good, proceed to Phase 3 (polite expansion)")


if __name__ == "__main__":
    main()
