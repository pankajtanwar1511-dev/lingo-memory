#!/usr/bin/env python3
"""
Extract examples for 275 vocabulary words from N5 ultra-pure database (set_2/only_n5_vocab_N5_kanji)

This script:
1. Loads N5_vocab_dataset.json to find words needing examples
2. Queries n5_sentences_ultra_pure.db for sentences containing each vocabulary word
3. Ranks candidates by quality (difficulty, vocab coverage, non-N5 kanji)
4. Exports top candidates for AI review

Output: data_set/N5/set_1/vocab_examples_candidates_ultra_pure.json
"""
import json
import sqlite3
from pathlib import Path
from collections import defaultdict

PROJECT_ROOT = Path(__file__).parent.parent.parent.parent.parent
DB_PATH = PROJECT_ROOT / "data_set" / "N5" / "set_2" / "only_n5_vocab_N5_kanji" / "n5_sentences_ultra_pure.db"
VOCAB_FILE = PROJECT_ROOT / "public" / "seed-data" / "N5_vocab_dataset.json"
OUTPUT_FILE = PROJECT_ROOT / "data_set" / "N5" / "set_2" / "only_n5_vocab_N5_kanji" / "vocab_examples_candidates_ultra_pure.json"

# Quality criteria
PREFERRED_DIFFICULTY = [2, 3, 4, 5]  # Easier sentences first
MIN_EXAMPLES_PER_WORD = 2
MAX_CANDIDATES_PER_WORD = 10

def load_vocab_needing_examples():
    """Load vocabulary words that need more examples"""
    with open(VOCAB_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    words_needing_examples = []

    for vocab in data['vocabulary']:
        kanji = vocab.get('kanji', '')
        kana = vocab.get('kana', '')
        examples = vocab.get('examples', [])

        examples_needed = MIN_EXAMPLES_PER_WORD - len(examples)

        if examples_needed > 0:
            words_needing_examples.append({
                'id': vocab['id'],
                'kanji': kanji,
                'kana': kana,
                'romaji': vocab.get('romaji', ''),
                'meaning': vocab.get('meaning', []),
                'current_examples': len(examples),
                'needed': examples_needed,
                'search_term': kanji if kanji else kana
            })

    return words_needing_examples

def search_database(conn, search_term):
    """Search database for sentences containing the vocabulary word"""
    cursor = conn.cursor()

    query = """
        SELECT japanese, english, difficulty, vocab_coverage, non_vocab_kanji, id
        FROM n5_sentences
        WHERE pass=1 AND japanese LIKE ?
        ORDER BY
            CASE difficulty
                WHEN 2 THEN 1
                WHEN 3 THEN 2
                WHEN 4 THEN 3
                WHEN 5 THEN 4
                WHEN 6 THEN 5
                WHEN 7 THEN 6
            END,
            vocab_coverage DESC,
            non_vocab_kanji ASC
        LIMIT ?
    """

    cursor.execute(query, (f'%{search_term}%', MAX_CANDIDATES_PER_WORD))
    return cursor.fetchall()

def rank_candidates(results):
    """Rank candidates by quality score"""
    ranked = []

    for jpn, eng, diff, vocab_cov, non_n5, sid in results:
        # Quality score (lower is better)
        score = 0

        # Prefer easier difficulties (2-5)
        if diff in [2, 3]:
            score += 0
        elif diff in [4, 5]:
            score += 1
        else:
            score += 2

        # Prefer higher vocab coverage
        if vocab_cov >= 0.9:
            score += 0
        elif vocab_cov >= 0.8:
            score += 1
        else:
            score += 2

        # Prefer fewer non-vocab kanji
        score += non_n5

        ranked.append({
            'japanese': jpn,
            'english': eng,
            'difficulty': diff,
            'vocab_coverage': vocab_cov,
            'non_vocab_kanji': non_n5,
            'source_id': sid,
            'quality_score': score
        })

    # Sort by quality score (lower = better)
    ranked.sort(key=lambda x: x['quality_score'])

    return ranked

def main():
    print("\n" + "="*60)
    print("EXTRACTING EXAMPLES FOR 275 VOCABULARY WORDS")
    print("="*60)

    # Load vocabulary needing examples
    print("\nLoading vocabulary words needing examples...")
    words = load_vocab_needing_examples()
    print(f"  ✓ Found {len(words)} words needing examples")

    # Count by need
    need_2 = sum(1 for w in words if w['needed'] >= 2)
    need_1 = sum(1 for w in words if w['needed'] == 1)
    print(f"    - {need_2} words need 2 examples")
    print(f"    - {need_1} words need 1 example")

    # Connect to database
    print(f"\nConnecting to database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)

    # Search for each vocabulary word
    print("\nSearching database for candidates...")
    results = {
        'metadata': {
            'total_words_searched': len(words),
            'words_with_candidates': 0,
            'words_without_candidates': 0,
            'total_candidates_found': 0,
            'generated_at': None
        },
        'words': []
    }

    for i, word in enumerate(words, 1):
        search_term = word['search_term']

        # Search database
        db_results = search_database(conn, search_term)

        if db_results:
            candidates = rank_candidates(db_results)
            results['words'].append({
                'id': word['id'],
                'kanji': word['kanji'],
                'kana': word['kana'],
                'romaji': word['romaji'],
                'meaning': word['meaning'],
                'current_examples': word['current_examples'],
                'examples_needed': word['needed'],
                'candidates_found': len(candidates),
                'candidates': candidates
            })
            results['metadata']['words_with_candidates'] += 1
            results['metadata']['total_candidates_found'] += len(candidates)
        else:
            results['words'].append({
                'id': word['id'],
                'kanji': word['kanji'],
                'kana': word['kana'],
                'romaji': word['romaji'],
                'meaning': word['meaning'],
                'current_examples': word['current_examples'],
                'examples_needed': word['needed'],
                'candidates_found': 0,
                'candidates': []
            })
            results['metadata']['words_without_candidates'] += 1

        if i % 25 == 0:
            print(f"  Processed {i}/{len(words)} words...")

    conn.close()

    # Add timestamp
    from datetime import datetime
    results['metadata']['generated_at'] = datetime.now().isoformat()

    # Save results
    print(f"\nSaving results to: {OUTPUT_FILE}")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    # Print summary
    print("\n" + "="*60)
    print("EXTRACTION SUMMARY")
    print("="*60)

    print(f"\nVocabulary words searched: {results['metadata']['total_words_searched']}")
    print(f"  ✓ Words with candidates: {results['metadata']['words_with_candidates']}")
    print(f"  ✗ Words without candidates: {results['metadata']['words_without_candidates']}")
    print(f"\nTotal candidates found: {results['metadata']['total_candidates_found']}")
    print(f"Average per word: {results['metadata']['total_candidates_found']/len(words):.1f}")

    # Breakdown by candidates found
    candidate_counts = defaultdict(int)
    for word in results['words']:
        count = min(word['candidates_found'], 10)  # Cap at 10 for display
        candidate_counts[count] += 1

    print("\nCandidate distribution:")
    for count in sorted(candidate_counts.keys(), reverse=True):
        if count == 10:
            print(f"  {count}+ candidates: {candidate_counts[count]} words")
        else:
            print(f"  {count} candidates: {candidate_counts[count]} words")

    print(f"\n✓ Results saved to: {OUTPUT_FILE}")
    print("="*60)

if __name__ == "__main__":
    main()
