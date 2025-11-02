#!/usr/bin/env python3
"""
Phase 2: Enhanced Tokenization & Kana Generation (v2)

Based on AI consultation (Claude AI 8/10 + ChatGPT 9/10)

Key improvements:
1. Lemma-based vocab tracking (fixes conjugated verbs)
2. Pronunciation correction map (fixes TTS readings)
3. Separate particles from content words (better UI flexibility)
"""

import sqlite3
import json
import fugashi
from pathlib import Path
from typing import List, Tuple, Dict


class N5TokenizerEnhanced:
    """Enhanced tokenizer with lemma tracking and pronunciation corrections."""

    def __init__(self, n5_vocab_path: Path):
        """Initialize tokenizer with N5 vocab and corrections."""
        self.tagger = fugashi.Tagger()
        self.n5_vocab = self._load_n5_vocab(n5_vocab_path)

        # Pronunciation corrections for TTS (common N5 words)
        # Based on AI recommendations: ~30 entries for naturalness
        self.pronunciation_map = {
            '私': 'ワタシ',      # Not ワタクシ (too formal)
            '僕': 'ボク',        # Male "I"
            '明日': 'アシタ',    # Not アス (rare)
            '昨日': 'キノウ',    # Not サクジツ (formal)
            '今': 'イマ',        # Not キン
            '今日': 'キョウ',    # Verify default is correct
            '一人': 'ヒトリ',    # Not イチニン
            '二人': 'フタリ',    # Not ニニン
            '大人': 'オトナ',    # Not ダイニン
            '下手': 'ヘタ',      # Not シタテ
            '上手': 'ジョウズ',  # Not ウワテ
            '沢山': 'タクサン',  # Verify
            '一つ': 'ヒトツ',    # Not イチツ
            '二つ': 'フタツ',    # Not ニツ
            '三つ': 'ミッツ',    # Verify
            # Numbers
            '一': 'イチ',        # Not イツ
            '二': 'ニ',
            '三': 'サン',
            '四': 'ヨン',        # Or シ
            '五': 'ゴ',
            '六': 'ロク',
            '七': 'ナナ',        # Or シチ
            '八': 'ハチ',
            '九': 'キュウ',      # Or ク
            '十': 'ジュウ',
            # Add more as discovered during testing
        }

        # N5 particles for separation
        self.n5_particles = {
            'は', 'が', 'を', 'に', 'で', 'と', 'へ', 'の',
            'か', 'も', 'や', 'より', 'まで', 'から',
            'ね', 'よ', 'ぞ', 'な', 'わ', 'さ', 'ぜ',
            'だ', 'です', 'ます'  # Include copula/polite markers
        }

        print(f"Loaded {len(self.n5_vocab)} N5 words")
        print(f"Pronunciation map: {len(self.pronunciation_map)} corrections")

    def _load_n5_vocab(self, vocab_path: Path) -> set:
        """Load N5 vocabulary from file."""
        if not vocab_path.exists():
            raise FileNotFoundError(f"N5 vocab file not found: {vocab_path}")

        with open(vocab_path, 'r', encoding='utf-8') as f:
            words = {line.strip() for line in f if line.strip()}

        return words

    def get_lemma(self, token) -> str:
        """
        Get base form (dictionary form) of token.

        Critical for matching conjugated verbs:
        行きます → lemma: 行く ✓
        """
        try:
            if hasattr(token.feature, 'lemma') and token.feature.lemma:
                return token.feature.lemma
        except:
            pass

        return token.surface

    def get_kana_reading(self, token) -> str:
        """
        Get kana reading with pronunciation corrections.

        Checks pronunciation_map first for common N5 words,
        then falls back to MeCab's reading.
        """
        surface = token.surface

        # Check pronunciation map first (for TTS accuracy)
        if surface in self.pronunciation_map:
            return self.pronunciation_map[surface]

        # Use MeCab's kana reading
        try:
            if hasattr(token.feature, 'kana') and token.feature.kana:
                return token.feature.kana
        except:
            pass

        # Fallback: return surface (for katakana, punctuation)
        return surface

    def tokenize(self, text: str) -> Dict:
        """
        Enhanced tokenization with lemma tracking and particle separation.

        Returns dict with:
            japanese_spaced: Spaced Japanese
            kana: Continuous kana (for TTS)
            kana_spaced: Spaced kana
            content_words: N5 content words (nouns, verbs, adjectives as lemmas)
            particles: N5 particles
            all_vocab: Combined list (backward compatible)
        """
        tokens = list(self.tagger(text))

        japanese_parts = []
        kana_parts = []
        content_words = []
        particles = []

        for token in tokens:
            surface = token.surface
            lemma = self.get_lemma(token)
            kana = self.get_kana_reading(token)

            japanese_parts.append(surface)
            kana_parts.append(kana)

            # Enhanced vocab tracking with lemma
            word_to_track = None

            # Check lemma first (for verbs/adjectives)
            if lemma in self.n5_vocab:
                word_to_track = lemma
            # Then check surface (for particles/nouns)
            elif surface in self.n5_vocab:
                word_to_track = surface

            if word_to_track:
                # Categorize: particles vs content words
                if surface in self.n5_particles:
                    particles.append(surface)
                else:
                    content_words.append(word_to_track)

        japanese_spaced = ' '.join(japanese_parts)
        kana = ''.join(kana_parts)  # No spaces (for TTS)
        kana_spaced = ' '.join(kana_parts)

        # Remove duplicates while preserving order
        content_words = list(dict.fromkeys(content_words))
        particles = list(dict.fromkeys(particles))
        all_vocab = list(dict.fromkeys(content_words + particles))

        return {
            'japanese_spaced': japanese_spaced,
            'kana': kana,
            'kana_spaced': kana_spaced,
            'content_words': content_words,
            'particles': particles,
            'all_vocab': all_vocab
        }


def test_enhanced_tokenizer():
    """Test enhanced tokenizer on sample sentences."""
    print("=" * 70)
    print("PHASE 2: ENHANCED TOKENIZATION TEST (v2)")
    print("=" * 70)

    script_dir = Path(__file__).parent
    vocab_path = script_dir.parent / "reference" / "n5_vocab.txt"

    tokenizer = N5TokenizerEnhanced(vocab_path)

    test_sentences = [
        "今日は暑いです。",
        "学校に行きます。",  # Test: Should catch 行く via lemma
        "これは何ですか。",
        "私は学生だ。",  # Test: Should use ワタシ not ワタクシ
        "明日学校に行く。",  # Test: Should use アシタ not アス
    ]

    print("\nTest Results:")
    print("=" * 70)

    for sentence in test_sentences:
        result = tokenizer.tokenize(sentence)

        print(f"\nOriginal:        {sentence}")
        print(f"Japanese spaced: {result['japanese_spaced']}")
        print(f"Kana:            {result['kana']}")
        print(f"Content words:   {result['content_words']}")
        print(f"Particles:       {result['particles']}")
        print(f"All vocab:       {result['all_vocab']}")

    print("\n" + "=" * 70)
    print("✅ Enhanced tokenizer test complete")


def process_corpus_enhanced(db_path: Path, vocab_path: Path):
    """Process all sentences with enhanced tokenizer."""
    print("\n" + "=" * 70)
    print("PROCESSING N5 CORPUS (ENHANCED v2)")
    print("=" * 70)

    tokenizer = N5TokenizerEnhanced(vocab_path)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Add new columns (content_words, particles)
    # Keep existing columns for backward compatibility
    new_columns = [
        ("content_words", "TEXT"),  # JSON array
        ("particles", "TEXT"),       # JSON array
    ]

    for col_name, col_type in new_columns:
        try:
            cursor.execute(f"ALTER TABLE n5_sentences ADD COLUMN {col_name} {col_type}")
            print(f"✅ Added '{col_name}' column")
        except sqlite3.OperationalError:
            print(f"⚠️  '{col_name}' column already exists - will update")

    # Get all sentences
    cursor.execute("SELECT id, japanese FROM n5_sentences")
    sentences = cursor.fetchall()

    print(f"\nProcessing {len(sentences)} sentences...")

    # Track improvements
    improved_count = 0

    for i, (sentence_id, japanese) in enumerate(sentences, 1):
        result = tokenizer.tokenize(japanese)

        # Convert arrays to JSON
        content_json = json.dumps(result['content_words'], ensure_ascii=False)
        particles_json = json.dumps(result['particles'], ensure_ascii=False)
        all_vocab_json = json.dumps(result['all_vocab'], ensure_ascii=False)

        # Update ALL columns (re-process with improvements)
        cursor.execute("""
            UPDATE n5_sentences
            SET japanese_spaced = ?,
                kana = ?,
                kana_spaced = ?,
                vocab_hits = ?,
                content_words = ?,
                particles = ?
            WHERE id = ?
        """, (
            result['japanese_spaced'],
            result['kana'],
            result['kana_spaced'],
            all_vocab_json,  # Update vocab_hits with enhanced tracking
            content_json,
            particles_json,
            sentence_id
        ))

        # Count improvements (more vocab hits due to lemma tracking)
        if len(result['all_vocab']) > 0:
            improved_count += 1

        if i % 500 == 0:
            print(f"  Processed {i}/{len(sentences)}...")
            conn.commit()

    conn.commit()
    print(f"✅ Processed all {len(sentences)} sentences")
    print(f"   Sentences with vocab: {improved_count} ({100*improved_count/len(sentences):.1f}%)")

    # Show statistics
    print("\n" + "=" * 70)
    print("ENHANCED STATISTICS")
    print("=" * 70)

    # Average content words vs particles
    cursor.execute("""
        SELECT
            AVG(json_array_length(content_words)) as avg_content,
            AVG(json_array_length(particles)) as avg_particles,
            AVG(json_array_length(vocab_hits)) as avg_total
        FROM n5_sentences
    """)
    avg_content, avg_particles, avg_total = cursor.fetchone()

    print(f"\nAverage per sentence:")
    print(f"  Content words: {avg_content:.1f}")
    print(f"  Particles:     {avg_particles:.1f}")
    print(f"  Total vocab:   {avg_total:.1f}")

    # Sample enhanced results
    print("\n" + "=" * 70)
    print("SAMPLE ENHANCED RESULTS (10 random)")
    print("=" * 70)

    cursor.execute("""
        SELECT japanese, kana, content_words, particles
        FROM n5_sentences
        ORDER BY RANDOM()
        LIMIT 10
    """)

    for jp, kana, content_json, particles_json in cursor.fetchall():
        content = json.loads(content_json)
        parts = json.loads(particles_json)
        print(f"\nSentence: {jp}")
        print(f"Kana:     {kana}")
        print(f"Content:  {', '.join(content)}")
        print(f"Particles:{', '.join(parts)}")

    conn.close()


def main():
    """Main execution."""
    print("=" * 70)
    print("PHASE 2: ENHANCED TOKENIZATION & KANA (v2)")
    print("Based on AI recommendations (8.5/10 average)")
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

    # Step 1: Test enhanced tokenizer
    test_enhanced_tokenizer()

    # Step 2: Process corpus with enhancements
    process_corpus_enhanced(db_path, vocab_path)

    print("\n" + "=" * 70)
    print("✅ PHASE 2 ENHANCED COMPLETE")
    print("=" * 70)
    print("\nImprovements:")
    print("1. ✅ Lemma-based vocab tracking (行きます → 行く)")
    print("2. ✅ Pronunciation corrections (私 → ワタシ)")
    print("3. ✅ Separated particles from content words")
    print("\nNext: Validate results, then proceed to Phase 3")


if __name__ == "__main__":
    main()
