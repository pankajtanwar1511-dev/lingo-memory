#!/usr/bin/env python3
"""
Auto-Tagging Script: Populate Curriculum Fields
Based on Claude AI + ChatGPT consensus recommendations

This script automatically populates curriculum fields for all N5 sentences:
- learning_stage (1-5)
- prerequisite_stage (based on grammar dependencies)
- eligible_stages (array of suitable stages)
- primary_grammar_target (main pattern to teach)
- secondary_grammar_targets (review patterns)
- cognitive_load (0-1)
- review_weight (1-5)
- max_new_concepts (count)
- pattern_confidence (0-1)
- manual_flag (needs review)

Automation level: 80-85% automated, 15-20% flagged for manual review
"""

import sqlite3
import json
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Set, Tuple, Optional

# Paths
DB_PATH = Path(__file__).parent.parent / "n5_sentences_ultra_pure.db"
GRAMMAR_STAGES_PATH = Path(__file__).parent.parent / "reference" / "grammar_stages.json"
VOCAB_STAGES_PATH = Path(__file__).parent.parent / "reference" / "vocab_stages.json"
N5_VOCAB_PATH = Path(__file__).parent.parent / "n5_vocab.txt"

# Load grammar-to-stage mapping
def load_grammar_stages() -> Dict[str, int]:
    """Load grammar pattern to stage mapping."""
    with open(GRAMMAR_STAGES_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data["pattern_to_stage_lookup"]

# Load vocab-to-stage mapping (simplified version)
def load_vocab_stages() -> Dict[str, int]:
    """
    Load vocabulary to stage mapping.
    Simplified: frequency rank determines stage.
    """
    if not N5_VOCAB_PATH.exists():
        print(f"⚠️  N5 vocab file not found: {N5_VOCAB_PATH}")
        return {}

    vocab_to_stage = {}
    with open(N5_VOCAB_PATH, 'r', encoding='utf-8') as f:
        for rank, line in enumerate(f, start=1):
            word = line.strip()
            if not word:
                continue

            # Assign stage based on frequency rank
            if rank <= 100:
                stage = 1
            elif rank <= 250:
                stage = 2
            elif rank <= 450:
                stage = 3
            elif rank <= 700:
                stage = 4
            else:
                stage = 5

            vocab_to_stage[word] = stage

    return vocab_to_stage

# Grammar pattern detection (from Phase 2)
N5_GRAMMAR_PATTERNS = {
    'だ': 'plain copula', 'です': 'polite copula', 'でした': 'copula past polite',
    'だった': 'copula past plain', 'じゃない': 'copula negative plain',
    'ではない': 'copula negative formal', 'じゃありません': 'copula negative polite',
    'ではありません': 'copula negative formal polite', 'ます': 'polite present verb',
    'ました': 'polite past verb', 'ません': 'polite negative verb',
    'ませんでした': 'polite negative past verb', 'た': 'plain past verb',
    'ない': 'plain negative verb', 'なかった': 'plain negative past',
    'い': 'i-adjective present', 'かった': 'i-adjective past',
    'くない': 'i-adjective negative', 'は': 'topic marker', 'が': 'subject marker',
    'を': 'object marker', 'に': 'location/time/indirect object',
    'で': 'means/location of action', 'と': 'and/with', 'へ': 'direction',
    'の': 'possessive/explanatory', 'か': 'question marker',
    'よ': 'emphasis particle', 'ね': 'confirmation particle',
    'も': 'also/too', 'や': 'and (non-exhaustive)', 'から': 'because/from',
    'まで': 'until/up to', 'ので': 'because (objective)',
    'けれども': 'but (formal)', 'でも': 'but/however', 'けど': 'but (casual)',
    'て': 'te-form connector', 'てください': 'please do',
    'ている': 'progressive/state plain', 'ています': 'progressive/state polite',
    'てから': 'after doing', 'てもいい': 'it\'s okay to',
    'てはいけない': 'must not', 'てみる': 'try doing plain',
    'てみます': 'try doing polite', 'たい': 'want to plain',
    'たいです': 'want to polite', 'たくない': 'don\'t want to plain',
    'たくないです': 'don\'t want to polite', 'ほしい': 'want object',
    'たら': 'if/when conditional', 'ば': 'if conditional', 'なら': 'if contextual',
    'たことがある': 'have done', 'たことがない': 'have never done',
    'ことができる': 'can do plain', 'ことができます': 'can do polite',
    'なければならない': 'must do', 'なくてはいけない': 'must do variant',
    'なくてもいい': 'don\'t have to', 'ましょう': 'let\'s polite',
    'ませんか': 'won\'t you invitation', 'でしょう': 'probably polite',
    'だろう': 'probably plain', 'そうだ': 'looks like/hearsay',
    'そうです': 'looks like polite', 'みたいだ': 'seems like',
    'らしい': 'seems like/apparently', 'な': 'na-adjective',
    'より': 'than', 'のほうが': 'more than', 'いちばん': 'most',
    'ほうがいい': 'had better', 'ほど': 'to the extent',
    'とき': 'when/time', '前に': 'before', '後で': 'after',
    'あとで': 'later/afterwards', 'ながら': 'while doing',
    'あげる': 'give outward', 'くれる': 'give to me', 'もらう': 'receive',
    'に行く': 'go to do', 'に来る': 'come to do',
    'すぎる': 'too much', 'やすい': 'easy to', 'にくい': 'hard to',
    'う': 'plain volitional', 'よう': 'plain volitional variant',
    'ような': 'like/such as', 'そして': 'and then',
    'それから': 'and then formal'
}

def detect_grammar_patterns(japanese: str) -> List[str]:
    """
    Detect grammar patterns in Japanese sentence.
    Returns list of pattern strings found.
    """
    patterns = []

    # Sort by length (longest first) to match complex patterns before simple ones
    sorted_patterns = sorted(N5_GRAMMAR_PATTERNS.keys(), key=len, reverse=True)

    for pattern in sorted_patterns:
        if pattern in japanese:
            patterns.append(pattern)

    return patterns

class CurriculumTagger:
    """Main curriculum tagging class."""

    def __init__(self):
        self.grammar_to_stage = load_grammar_stages()
        self.vocab_to_stage = load_vocab_stages()
        self.conn = sqlite3.connect(DB_PATH)
        self.conn.row_factory = sqlite3.Row

        # Critical patterns for review_weight boosting
        self.critical_patterns = {
            'です', 'ます', 'た', 'ている', 'ています', 'たら',
            'ことができる', 'てください', 'から', 'より'
        }

        # Track pattern frequency in corpus for primary_grammar_target selection
        self.pattern_frequency = defaultdict(int)

    def calculate_prerequisite_stage(self, grammar_patterns: List[str]) -> int:
        """
        Calculate minimum stage based on grammar pattern dependencies.
        Returns highest stage number among all patterns.
        """
        if not grammar_patterns:
            return 1  # Default to Stage 1 if no patterns

        max_stage = 1
        for pattern in grammar_patterns:
            stage = self.grammar_to_stage.get(pattern, 1)
            max_stage = max(max_stage, stage)

        return max_stage

    def calculate_learning_stage(self,
                                prerequisite_stage: int,
                                difficulty: int) -> int:
        """
        Calculate optimal learning stage using GRAMMAR-ONLY approach.

        Strategy:
        1. Primary factor: grammar pattern stage (prerequisite_stage)
        2. Secondary factor: difficulty score (fine-tuning)

        This is simpler and more pedagogically sound than vocab-based assignment.
        """
        # Start with grammar prerequisite stage
        stage = prerequisite_stage

        # Adjust based on difficulty for edge cases
        # If sentence is very hard despite simple grammar, push to later stage
        if difficulty >= 9 and stage < 5:
            stage = min(stage + 1, 5)  # Bump up by 1
        elif difficulty >= 8 and stage < 4:
            stage = min(stage + 1, 5)  # Bump up by 1

        # If sentence is very easy despite advanced grammar, DON'T pull back
        # (Grammar prerequisites must be respected)

        # Ensure stage is in valid range
        return min(5, max(1, stage))

    def calculate_eligible_stages(self,
                                 learning_stage: int,
                                 difficulty: int) -> List[int]:
        """
        Calculate which stages this sentence can appear in.
        Sentences can appear in their stage + next 1-3 stages for review.
        """
        min_stage = learning_stage

        # Calculate range based on difficulty
        if difficulty <= 3:  # Easy
            max_stage = min(5, learning_stage + 2)
        elif difficulty <= 6:  # Medium
            max_stage = min(5, learning_stage + 3)
        else:  # Hard
            max_stage = 5  # Can appear through final stage

        return list(range(min_stage, max_stage + 1))

    def identify_primary_grammar_target(self,
                                       grammar_patterns: List[str],
                                       learning_stage: int) -> Tuple[Optional[str], float]:
        """
        Identify the main grammar pattern this sentence teaches.
        Returns (pattern, confidence_score)

        Priority:
        1. Patterns new in this stage (not in previous stages)
        2. Among new patterns, pick rarest in corpus
        3. If no new patterns, pick most important review pattern
        """
        if not grammar_patterns:
            return (None, 0.0)

        # Find patterns that are NEW in this stage
        new_patterns = [
            p for p in grammar_patterns
            if self.grammar_to_stage.get(p, 1) == learning_stage
        ]

        if new_patterns:
            # Pick rarest new pattern
            primary = min(new_patterns, key=lambda p: self.pattern_frequency.get(p, 0))
            confidence = 0.9  # High confidence for new patterns
        else:
            # No new patterns - this is a review sentence
            # Pick most important review pattern (critical patterns first)
            critical_found = [p for p in grammar_patterns if p in self.critical_patterns]

            if critical_found:
                primary = min(critical_found, key=lambda p: self.pattern_frequency.get(p, 0))
                confidence = 0.7  # Medium confidence for review
            else:
                # Pick any pattern, prefer earlier stage patterns
                primary = min(grammar_patterns,
                            key=lambda p: (self.grammar_to_stage.get(p, 1),
                                         self.pattern_frequency.get(p, 0)))
                confidence = 0.6  # Lower confidence

        return (primary, confidence)

    def identify_secondary_targets(self,
                                  grammar_patterns: List[str],
                                  primary_target: Optional[str]) -> List[str]:
        """
        Identify secondary grammar patterns (review/reinforcement).
        """
        if not grammar_patterns or not primary_target:
            return []

        # All patterns except primary
        secondary = [p for p in grammar_patterns if p != primary_target]

        # Limit to top 5 most important
        return secondary[:5]

    def calculate_cognitive_load(self,
                                 grammar_patterns: List[str],
                                 learning_stage: int) -> float:
        """
        Calculate cognitive load (ratio of new concepts).
        0.0 = all review, 1.0 = all new

        NOTE: This is a simplified version. Full version would require
        tracking user progress, which we don't have yet.
        """
        if not grammar_patterns:
            return 0.0

        # Count patterns new to this stage
        new_count = sum(1 for p in grammar_patterns
                       if self.grammar_to_stage.get(p, 1) == learning_stage)

        # Calculate ratio
        load = new_count / len(grammar_patterns) if grammar_patterns else 0.0

        return round(load, 2)

    def calculate_review_weight(self,
                               grammar_patterns: List[str],
                               difficulty: int) -> float:
        """
        Calculate importance for spaced repetition (1.0-5.0).
        Higher weight = more important to review.
        """
        weight = 3.0  # Default

        # Boost for critical patterns
        if any(p in self.critical_patterns for p in grammar_patterns):
            weight += 1.0

        # Boost for intermediate difficulty (sweet spot for practice)
        if 4 <= difficulty <= 7:
            weight += 0.5

        # Reduce for too easy or too hard
        if difficulty < 2 or difficulty > 9:
            weight -= 0.5

        # Ensure valid range
        return round(max(1.0, min(5.0, weight)), 1)

    def calculate_max_new_concepts(self,
                                  grammar_patterns: List[str],
                                  learning_stage: int,
                                  content_words: List[str]) -> int:
        """
        Count total new concepts (new grammar + new vocab).
        Simplified version without user progress tracking.
        """
        # New grammar patterns
        new_grammar = sum(1 for p in grammar_patterns
                         if self.grammar_to_stage.get(p, 1) == learning_stage)

        # New vocabulary (words from this stage or later)
        new_vocab = sum(1 for w in content_words
                       if self.vocab_to_stage.get(w, 5) >= learning_stage)

        return new_grammar + new_vocab

    def should_flag_for_manual_review(self,
                                     pattern_confidence: float,
                                     max_new_concepts: int,
                                     grammar_patterns: List[str]) -> bool:
        """
        Determine if sentence needs manual review.

        Flag ONLY critical issues that truly need human judgment:
        - No grammar patterns detected (unusual)
        - Very low pattern confidence (<0.4) AND high concept count

        Target: ~10-15% flagging rate

        NOTE: We removed max_new_concepts as a standalone flag because
        it's normal for intermediate/advanced sentences to introduce
        multiple new words/patterns. Grammar-based assignment handles this.
        """
        # Flag if no grammar patterns (unusual case - missing fundamental structure)
        if not grammar_patterns:
            return True

        # Flag only if BOTH low confidence AND high concept load
        # (indicates ambiguous sentence with lots of new content)
        if pattern_confidence < 0.4 and max_new_concepts > 5:
            return True

        return False

    def tag_sentence(self, row: sqlite3.Row) -> Dict:
        """
        Tag a single sentence with all curriculum fields.
        Returns dict of field values.
        """
        # Parse existing fields
        sentence_id = row['id']
        japanese = row['japanese']
        difficulty = row['difficulty']
        content_words_json = row['content_words'] or '[]'
        content_words = json.loads(content_words_json)

        # Detect grammar patterns
        grammar_patterns = detect_grammar_patterns(japanese)

        # Calculate stages (GRAMMAR-ONLY approach)
        prerequisite_stage = self.calculate_prerequisite_stage(grammar_patterns)
        learning_stage = self.calculate_learning_stage(prerequisite_stage, difficulty)
        eligible_stages = self.calculate_eligible_stages(learning_stage, difficulty)

        # Identify grammar targets
        primary_target, pattern_confidence = self.identify_primary_grammar_target(
            grammar_patterns, learning_stage
        )
        secondary_targets = self.identify_secondary_targets(grammar_patterns, primary_target)

        # Calculate metrics
        cognitive_load = self.calculate_cognitive_load(grammar_patterns, learning_stage)
        review_weight = self.calculate_review_weight(grammar_patterns, difficulty)
        max_new_concepts = self.calculate_max_new_concepts(
            grammar_patterns, learning_stage, content_words
        )

        # Determine if manual review needed
        manual_flag = self.should_flag_for_manual_review(
            pattern_confidence, max_new_concepts, grammar_patterns
        )

        # Update pattern frequency for future calculations
        for pattern in grammar_patterns:
            self.pattern_frequency[pattern] += 1

        return {
            'learning_stage': learning_stage,
            'eligible_stages': json.dumps(eligible_stages),
            'prerequisite_stage': prerequisite_stage,
            'primary_grammar_target': primary_target,
            'secondary_grammar_targets': json.dumps(secondary_targets),
            'new_vocab_introduced': json.dumps([]),  # Will be calculated in second pass
            'review_vocab': json.dumps([]),  # Will be calculated in second pass
            'cognitive_load': cognitive_load,
            'review_weight': review_weight,
            'max_new_concepts': max_new_concepts,
            'pattern_confidence': pattern_confidence,
            'manual_flag': 1 if manual_flag else 0,
        }

    def tag_all_sentences(self):
        """Tag all sentences in the database."""
        cursor = self.conn.cursor()

        # Fetch all sentences
        cursor.execute("""
            SELECT id, japanese, difficulty, content_words, particles
            FROM n5_sentences
            ORDER BY difficulty, id
        """)

        sentences = cursor.fetchall()
        total = len(sentences)

        print(f"\n=== Tagging {total} sentences ===\n")

        tagged_count = 0
        flagged_count = 0

        for i, row in enumerate(sentences, 1):
            # Tag sentence
            tags = self.tag_sentence(row)

            # Update database
            cursor.execute("""
                UPDATE n5_sentences SET
                    learning_stage = ?,
                    eligible_stages = ?,
                    prerequisite_stage = ?,
                    primary_grammar_target = ?,
                    secondary_grammar_targets = ?,
                    new_vocab_introduced = ?,
                    review_vocab = ?,
                    cognitive_load = ?,
                    review_weight = ?,
                    max_new_concepts = ?,
                    pattern_confidence = ?,
                    manual_flag = ?
                WHERE id = ?
            """, (
                tags['learning_stage'],
                tags['eligible_stages'],
                tags['prerequisite_stage'],
                tags['primary_grammar_target'],
                tags['secondary_grammar_targets'],
                tags['new_vocab_introduced'],
                tags['review_vocab'],
                tags['cognitive_load'],
                tags['review_weight'],
                tags['max_new_concepts'],
                tags['pattern_confidence'],
                tags['manual_flag'],
                row['id']
            ))

            tagged_count += 1
            if tags['manual_flag']:
                flagged_count += 1

            # Progress update
            if i % 100 == 0:
                print(f"  Progress: {i}/{total} ({i/total*100:.1f}%) - Flagged: {flagged_count}")

        self.conn.commit()

        return tagged_count, flagged_count

    def print_statistics(self):
        """Print tagging statistics."""
        cursor = self.conn.cursor()

        print("\n" + "="*60)
        print("   Tagging Statistics")
        print("="*60)

        # Stage distribution
        print("\n--- Sentences per Stage ---")
        cursor.execute("""
            SELECT learning_stage, COUNT(*) as count
            FROM n5_sentences
            WHERE learning_stage IS NOT NULL
            GROUP BY learning_stage
            ORDER BY learning_stage
        """)
        for row in cursor.fetchall():
            stage, count = row
            print(f"  Stage {stage}: {count} sentences")

        # Manual flags
        cursor.execute("SELECT COUNT(*) FROM n5_sentences WHERE manual_flag = 1")
        flagged = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM n5_sentences")
        total = cursor.fetchone()[0]
        print(f"\n--- Manual Review Needed ---")
        print(f"  Flagged: {flagged} sentences ({flagged/total*100:.1f}%)")

        # Pattern coverage
        cursor.execute("""
            SELECT primary_grammar_target, COUNT(*) as count
            FROM n5_sentences
            WHERE primary_grammar_target IS NOT NULL
            GROUP BY primary_grammar_target
            ORDER BY count DESC
            LIMIT 10
        """)
        print(f"\n--- Top 10 Primary Grammar Targets ---")
        for row in cursor.fetchall():
            pattern, count = row
            print(f"  {pattern}: {count} sentences")

        # Cognitive load distribution
        cursor.execute("""
            SELECT
                CASE
                    WHEN cognitive_load < 0.3 THEN 'Low (0-0.3)'
                    WHEN cognitive_load < 0.6 THEN 'Medium (0.3-0.6)'
                    ELSE 'High (0.6-1.0)'
                END as load_category,
                COUNT(*) as count
            FROM n5_sentences
            WHERE cognitive_load IS NOT NULL
            GROUP BY load_category
        """)
        print(f"\n--- Cognitive Load Distribution ---")
        for row in cursor.fetchall():
            category, count = row
            print(f"  {category}: {count} sentences")

    def close(self):
        """Close database connection."""
        self.conn.close()

def main():
    """Main execution function."""
    print("="*60)
    print("   Auto-Tagging Script: Curriculum Fields")
    print("="*60)
    print("\nBased on: Claude AI + ChatGPT consensus")
    print("Automation level: 80-85% automated\n")

    # Check required files
    if not DB_PATH.exists():
        print(f"❌ Database not found: {DB_PATH}")
        return 1

    if not GRAMMAR_STAGES_PATH.exists():
        print(f"❌ Grammar stages file not found: {GRAMMAR_STAGES_PATH}")
        return 1

    # Initialize tagger
    tagger = CurriculumTagger()

    try:
        # Tag all sentences
        tagged_count, flagged_count = tagger.tag_all_sentences()

        print(f"\n✅ Successfully tagged {tagged_count} sentences")
        print(f"⚠️  {flagged_count} sentences flagged for manual review")

        # Print statistics
        tagger.print_statistics()

        print("\n" + "="*60)
        print("   ✅ Auto-tagging completed successfully!")
        print("="*60)
        print("\nNext steps:")
        print("  1. Review flagged sentences (manual_flag = 1)")
        print("  2. Run validation suite to check for issues")
        print("  3. Calculate new_vocab_introduced (requires second pass)")

        return 0

    except Exception as e:
        print(f"\n❌ Error during tagging: {e}")
        import traceback
        traceback.print_exc()
        return 1

    finally:
        tagger.close()

if __name__ == "__main__":
    exit(main())
