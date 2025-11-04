#!/usr/bin/env python3
"""
Analyze N5 Grammar Pattern Coverage

Checks if current corpus covers all major N5 grammar patterns
from JLPT N5 grammar list.
"""

import sqlite3
import re
from pathlib import Path
from collections import defaultdict

# Complete N5 Grammar Pattern List (from JLPT official resources)
N5_GRAMMAR_PATTERNS = {
    # 1. Copula / Be-verbs
    'だ': 'plain copula (is/am/are)',
    'です': 'polite copula (is/am/are)',
    'じゃない': 'casual negative copula (is not)',
    'ではない': 'formal negative copula (is not)',
    'じゃありません': 'polite negative copula (is not)',
    'ではありません': 'polite negative copula (is not)',
    'だった': 'plain copula past (was/were)',
    'でした': 'polite copula past (was/were)',

    # 2. Verb Forms - Present
    'ます': 'polite present/future',
    'ません': 'polite negative present',

    # 3. Verb Forms - Past
    'ました': 'polite past',
    'ませんでした': 'polite negative past',
    'た': 'plain past',
    'なかった': 'plain negative past',

    # 4. Te-forms
    'て': 'te-form (and, please)',
    'ている': 'progressive/state',
    'ています': 'polite progressive/state',
    'てください': 'please do',
    'てもいい': 'it\'s okay to',
    'てはいけない': 'must not',

    # 5. Want/Desire
    'たい': 'want to (verb)',
    'たいです': 'want to (polite)',
    'たくない': 'don\'t want to',
    'ほしい': 'want (noun)',

    # 6. Can/Ability
    'ことができる': 'can do, able to',
    'ことができます': 'can do (polite)',

    # 7. Experience
    'たことがある': 'have done (experience)',
    'たことがない': 'have never done',

    # 8. Invitation/Suggestion
    'ましょう': 'let\'s do',
    'ませんか': 'won\'t you? (invitation)',

    # 9. Volitional
    'う': 'plain volitional (will do)',
    'よう': 'plain volitional (will do)',

    # 10. Adjectives - I-adjectives
    'い': 'i-adjective present',
    'かった': 'i-adjective past',
    'くない': 'i-adjective negative',
    'くなかった': 'i-adjective negative past',
    'くて': 'i-adjective te-form (and)',

    # 11. Adjectives - Na-adjectives
    'な': 'na-adjective connector',

    # 12. Comparatives
    'より': 'than (comparison)',
    'ほど': 'as much as',
    'のほうが': 'more than',
    'いちばん': 'most, number one',

    # 13. Reasons
    'から': 'because',
    'ので': 'because (objective)',

    # 14. Conjunctions
    'が': 'but',
    'けど': 'but (casual)',
    'けれども': 'but (formal)',
    'そして': 'and then',
    'それから': 'and then, after that',
    'でも': 'but, however',

    # 15. Conditionals
    'たら': 'if/when',
    'ば': 'if (conditional)',
    'と': 'if/when (natural result)',

    # 16. Obligation/Necessity
    'なければならない': 'must do',
    'なくてはいけない': 'must do',
    'なくてもいい': 'don\'t have to',

    # 17. Giving/Receiving
    'あげる': 'give (outward)',
    'くれる': 'give (to me)',
    'もらう': 'receive',

    # 18. Try
    'てみる': 'try doing',
    'てみます': 'try doing (polite)',

    # 19. Prohibition
    'な': 'don\'t (prohibitive)',

    # 20. Hearsay/Appearance
    'そうだ': 'I heard that / looks like',
    'そうです': 'I heard that (polite)',
    'らしい': 'seems like, apparently',

    # 21. Speculation
    'でしょう': 'probably (polite)',
    'だろう': 'probably (plain)',

    # 22. Degree/Extent
    'すぎる': 'too much',
    'やすい': 'easy to',
    'にくい': 'hard to',

    # 23. Purpose
    'に行く': 'go to do',
    'に来る': 'come to do',

    # 24. Time Relations
    '前に': 'before',
    '後で': 'after',
    'あとで': 'after (casual)',
    'ながら': 'while doing',
    'とき': 'when, at the time',

    # 25. Sentence Endings
    'ね': 'isn\'t it? (confirmation)',
    'よ': 'you know (emphasis)',
    'か': 'question marker',

    # 26. Likeness
    'みたい': 'like, similar to',
    'みたいだ': 'seems like',
    'ような': 'like, such as',

    # 27. Others
    'しか': 'only (with negative)',
    'だけ': 'only',
    'も': 'also, too',
    'まだ': 'still, not yet',
    'もう': 'already',
}

def analyze_grammar_coverage(db_path: Path):
    """Analyze which N5 grammar patterns are covered in corpus."""

    print("=" * 80)
    print("N5 GRAMMAR PATTERN COVERAGE ANALYSIS")
    print("=" * 80)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all sentences
    cursor.execute("SELECT japanese, formality, difficulty FROM n5_sentences")
    sentences = cursor.fetchall()

    print(f"\nTotal sentences: {len(sentences)}")
    print(f"\nAnalyzing coverage of {len(N5_GRAMMAR_PATTERNS)} N5 grammar patterns...")

    # Track pattern coverage
    pattern_coverage = defaultdict(lambda: {'count': 0, 'examples': []})

    # Check each sentence for patterns
    for japanese, formality, difficulty in sentences:
        for pattern, description in N5_GRAMMAR_PATTERNS.items():
            if pattern in japanese:
                pattern_coverage[pattern]['count'] += 1

                # Store up to 3 examples
                if len(pattern_coverage[pattern]['examples']) < 3:
                    pattern_coverage[pattern]['examples'].append({
                        'sentence': japanese,
                        'formality': formality,
                        'difficulty': difficulty
                    })

    # Categorize patterns
    covered_patterns = {p: data for p, data in pattern_coverage.items() if data['count'] > 0}
    missing_patterns = {p: desc for p, desc in N5_GRAMMAR_PATTERNS.items() if p not in covered_patterns}

    # Sort covered patterns by frequency
    sorted_patterns = sorted(covered_patterns.items(), key=lambda x: x[1]['count'], reverse=True)

    # Statistics
    coverage_pct = (len(covered_patterns) / len(N5_GRAMMAR_PATTERNS)) * 100

    print("\n" + "=" * 80)
    print(f"COVERAGE SUMMARY")
    print("=" * 80)
    print(f"Covered patterns: {len(covered_patterns)}/{len(N5_GRAMMAR_PATTERNS)} ({coverage_pct:.1f}%)")
    print(f"Missing patterns: {len(missing_patterns)}")

    # Show top 20 most common patterns
    print("\n" + "-" * 80)
    print("TOP 20 MOST COMMON PATTERNS")
    print("-" * 80)

    for i, (pattern, data) in enumerate(sorted_patterns[:20], 1):
        description = N5_GRAMMAR_PATTERNS[pattern]
        count = data['count']
        pct = (count / len(sentences)) * 100
        print(f"{i:2d}. {pattern:20s} - {count:4d} sentences ({pct:5.1f}%) - {description}")

    # Show missing patterns
    if missing_patterns:
        print("\n" + "-" * 80)
        print(f"MISSING PATTERNS ({len(missing_patterns)} patterns)")
        print("-" * 80)

        for pattern, description in sorted(missing_patterns.items()):
            print(f"  ❌ {pattern:20s} - {description}")

    # Show under-represented patterns (< 10 examples)
    under_represented = {p: data for p, data in covered_patterns.items() if data['count'] < 10}

    if under_represented:
        print("\n" + "-" * 80)
        print(f"UNDER-REPRESENTED PATTERNS (< 10 examples)")
        print("-" * 80)

        for pattern, data in sorted(under_represented.items(), key=lambda x: x[1]['count']):
            description = N5_GRAMMAR_PATTERNS[pattern]
            count = data['count']
            print(f"  ⚠️  {pattern:20s} - {count:2d} sentences - {description}")

            # Show examples
            for ex in data['examples']:
                print(f"      → {ex['sentence']} (difficulty: {ex['difficulty']})")

    # Distribution by pattern category
    print("\n" + "=" * 80)
    print("PATTERN DISTRIBUTION BY FORMALITY")
    print("=" * 80)

    # Check formal vs casual for key patterns
    key_pattern_pairs = [
        ('だ', 'です', 'Copula'),
        ('た', 'ました', 'Past tense'),
        ('ない', 'ません', 'Negative'),
        ('てる', 'ています', 'Progressive'),
    ]

    for casual_pattern, formal_pattern, category in key_pattern_pairs:
        casual_count = pattern_coverage[casual_pattern]['count'] if casual_pattern in pattern_coverage else 0
        formal_count = pattern_coverage[formal_pattern]['count'] if formal_pattern in pattern_coverage else 0
        total = casual_count + formal_count

        if total > 0:
            casual_pct = (casual_count / total) * 100
            formal_pct = (formal_count / total) * 100

            print(f"\n{category}:")
            print(f"  Casual ({casual_pattern:10s}): {casual_count:4d} ({casual_pct:5.1f}%)")
            print(f"  Formal ({formal_pattern:10s}): {formal_count:4d} ({formal_pct:5.1f}%)")

    # Recommendations
    print("\n" + "=" * 80)
    print("RECOMMENDATIONS FOR PHASE 3")
    print("=" * 80)

    if coverage_pct < 80:
        print("\n⚠️  WARNING: Coverage below 80%!")
        print("   Recommend adding sentences to cover missing patterns")

    if len(under_represented) > 10:
        print(f"\n⚠️  WARNING: {len(under_represented)} patterns have < 10 examples")
        print("   Recommend ensuring each pattern has at least 10-20 examples")

    # Specific recommendations for new generation
    print("\nFor Phase 3B (new sentence generation):")
    print(f"1. Prioritize missing patterns: {len(missing_patterns)} patterns need coverage")
    print(f"2. Boost under-represented patterns: {len(under_represented)} patterns need more examples")
    print(f"3. Target: 10-20 examples per pattern (current avg: {sum(d['count'] for d in covered_patterns.values()) / len(covered_patterns):.1f})")

    # Save detailed report
    report_path = db_path.parent / "grammar_coverage_report.txt"

    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("N5 GRAMMAR PATTERN COVERAGE REPORT\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"Coverage: {len(covered_patterns)}/{len(N5_GRAMMAR_PATTERNS)} ({coverage_pct:.1f}%)\n\n")

        f.write("\nCOVERED PATTERNS:\n")
        for pattern, data in sorted_patterns:
            f.write(f"{pattern:20s} - {data['count']:4d} sentences - {N5_GRAMMAR_PATTERNS[pattern]}\n")

        f.write("\n\nMISSING PATTERNS:\n")
        for pattern, description in sorted(missing_patterns.items()):
            f.write(f"{pattern:20s} - {description}\n")

    print(f"\n✅ Detailed report saved to: {report_path}")

    conn.close()

    return {
        'coverage_pct': coverage_pct,
        'covered': len(covered_patterns),
        'missing': len(missing_patterns),
        'under_represented': len(under_represented),
        'missing_patterns': list(missing_patterns.keys()),
        'under_represented_patterns': list(under_represented.keys()),
    }


def main():
    script_dir = Path(__file__).parent
    db_path = script_dir.parent / "n5_sentences_ultra_pure.db"

    if not db_path.exists():
        print(f"❌ Database not found: {db_path}")
        return

    results = analyze_grammar_coverage(db_path)

    print("\n" + "=" * 80)
    print("ANALYSIS COMPLETE")
    print("=" * 80)
    print(f"\nGrammar coverage: {results['coverage_pct']:.1f}%")
    print(f"Missing patterns: {results['missing']}")
    print(f"Under-represented patterns: {results['under_represented']}")

    if results['coverage_pct'] >= 90:
        print("\n✅ Excellent coverage! Corpus includes most N5 grammar patterns.")
    elif results['coverage_pct'] >= 75:
        print("\n⚠️  Good coverage, but some gaps remain.")
        print("   Recommend focusing on missing patterns in Phase 3B.")
    else:
        print("\n❌ Coverage needs improvement!")
        print("   Strongly recommend expanding corpus to cover missing patterns.")


if __name__ == "__main__":
    main()
