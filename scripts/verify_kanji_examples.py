#!/usr/bin/env python3
"""
Verify Kanji Examples Linking
Checks if all example vocabulary IDs in kanji_n5.json:
1. Actually exist in N5_vocab_dataset.json
2. Contain the target kanji character
"""

import json
from pathlib import Path

def load_data():
    """Load both kanji and vocab datasets"""
    kanji_path = Path("public/seed-data/kanji_n5.json")
    vocab_path = Path("public/seed-data/N5_vocab_dataset.json")

    with open(kanji_path, 'r', encoding='utf-8') as f:
        kanji_data = json.load(f)

    with open(vocab_path, 'r', encoding='utf-8') as f:
        vocab_data = json.load(f)

    return kanji_data, vocab_data

def create_vocab_map(vocab_data):
    """Create ID -> vocab object mapping"""
    vocab_map = {}
    for vocab in vocab_data['vocabulary']:
        vocab_map[vocab['id']] = vocab
    return vocab_map

def verify_kanji_examples(kanji_data, vocab_map, num_kanji=20):
    """Verify examples for specified number of kanji"""

    results = {
        'total_kanji_checked': 0,
        'total_examples_checked': 0,
        'missing_vocab_ids': [],
        'kanji_mismatch': [],
        'valid_examples': 0,
        'kanji_details': []
    }

    kanji_list = kanji_data['kanji'][:num_kanji]

    for kanji_obj in kanji_list:
        kanji_char = kanji_obj['kanji']
        kanji_id = kanji_obj['id']
        examples = kanji_obj.get('examples', [])

        kanji_report = {
            'kanji': kanji_char,
            'id': kanji_id,
            'total_examples': len(examples),
            'valid': 0,
            'missing': [],
            'mismatch': []
        }

        for vocab_id in examples:
            results['total_examples_checked'] += 1

            # Check if vocab ID exists
            if vocab_id not in vocab_map:
                results['missing_vocab_ids'].append({
                    'kanji': kanji_char,
                    'kanji_id': kanji_id,
                    'missing_vocab_id': vocab_id
                })
                kanji_report['missing'].append(vocab_id)
                continue

            vocab = vocab_map[vocab_id]
            vocab_kanji = vocab.get('kanji', '')
            vocab_kana = vocab.get('kana', '')
            vocab_meaning = vocab.get('meaning', [''])[0]

            # Check if vocab word contains the target kanji
            if vocab_kanji and kanji_char in vocab_kanji:
                results['valid_examples'] += 1
                kanji_report['valid'] += 1
            elif not vocab_kanji:
                # Some words are kana-only (no kanji)
                # Mark as mismatch
                results['kanji_mismatch'].append({
                    'kanji': kanji_char,
                    'kanji_id': kanji_id,
                    'vocab_id': vocab_id,
                    'vocab_kanji': vocab_kanji or '(none)',
                    'vocab_kana': vocab_kana,
                    'vocab_meaning': vocab_meaning,
                    'reason': 'Vocab has no kanji field'
                })
                kanji_report['mismatch'].append({
                    'vocab_id': vocab_id,
                    'vocab_word': vocab_kana,
                    'meaning': vocab_meaning,
                    'reason': 'No kanji'
                })
            else:
                # Vocab has kanji but doesn't contain target kanji
                results['kanji_mismatch'].append({
                    'kanji': kanji_char,
                    'kanji_id': kanji_id,
                    'vocab_id': vocab_id,
                    'vocab_kanji': vocab_kanji,
                    'vocab_kana': vocab_kana,
                    'vocab_meaning': vocab_meaning,
                    'reason': f'Kanji "{kanji_char}" not in "{vocab_kanji}"'
                })
                kanji_report['mismatch'].append({
                    'vocab_id': vocab_id,
                    'vocab_word': vocab_kanji,
                    'meaning': vocab_meaning,
                    'reason': f'Does not contain {kanji_char}'
                })

        results['kanji_details'].append(kanji_report)
        results['total_kanji_checked'] += 1

    return results

def print_report(results):
    """Print detailed verification report"""

    print("=" * 80)
    print("KANJI EXAMPLES VERIFICATION REPORT")
    print("=" * 80)
    print()

    print(f"📊 SUMMARY")
    print(f"   Kanji checked: {results['total_kanji_checked']}")
    print(f"   Total examples checked: {results['total_examples_checked']}")
    print(f"   Valid examples: {results['valid_examples']}")
    print(f"   Missing vocab IDs: {len(results['missing_vocab_ids'])}")
    print(f"   Kanji mismatches: {len(results['kanji_mismatch'])}")
    print()

    # Success rate
    if results['total_examples_checked'] > 0:
        success_rate = (results['valid_examples'] / results['total_examples_checked']) * 100
        print(f"   ✅ Success Rate: {success_rate:.1f}%")
    print()

    print("=" * 80)
    print("DETAILED KANJI-BY-KANJI REPORT")
    print("=" * 80)
    print()

    for kanji in results['kanji_details']:
        status = "✅" if kanji['valid'] == kanji['total_examples'] else "⚠️"
        print(f"{status} {kanji['kanji']} ({kanji['id']})")
        print(f"   Total examples: {kanji['total_examples']}")
        print(f"   Valid: {kanji['valid']}")

        if kanji['missing']:
            print(f"   ❌ Missing vocab IDs: {len(kanji['missing'])}")
            for vid in kanji['missing'][:3]:  # Show first 3
                print(f"      - {vid}")

        if kanji['mismatch']:
            print(f"   ⚠️  Mismatches: {len(kanji['mismatch'])}")
            for m in kanji['mismatch'][:3]:  # Show first 3
                print(f"      - {m['vocab_id']}: {m['vocab_word']} ({m['meaning']}) - {m['reason']}")

        print()

    # Print all issues
    if results['missing_vocab_ids']:
        print("=" * 80)
        print("❌ MISSING VOCABULARY IDs")
        print("=" * 80)
        for item in results['missing_vocab_ids']:
            print(f"   Kanji: {item['kanji']} ({item['kanji_id']})")
            print(f"   Missing: {item['missing_vocab_id']}")
            print()

    if results['kanji_mismatch']:
        print("=" * 80)
        print("⚠️  KANJI MISMATCHES")
        print("=" * 80)
        for item in results['kanji_mismatch'][:10]:  # Show first 10
            print(f"   Kanji: {item['kanji']} ({item['kanji_id']})")
            print(f"   Vocab ID: {item['vocab_id']}")
            print(f"   Vocab Word: {item['vocab_kanji']} ({item['vocab_kana']})")
            print(f"   Meaning: {item['vocab_meaning']}")
            print(f"   Reason: {item['reason']}")
            print()

        if len(results['kanji_mismatch']) > 10:
            print(f"   ... and {len(results['kanji_mismatch']) - 10} more mismatches")
            print()

def main():
    print("Loading datasets...")
    kanji_data, vocab_data = load_data()

    print(f"Loaded {kanji_data['metadata']['totalKanji']} kanji")
    print(f"Loaded {vocab_data['metadata']['totalCards']} vocabulary entries")
    print()

    print("Creating vocabulary lookup map...")
    vocab_map = create_vocab_map(vocab_data)
    print()

    print("Verifying kanji examples (first 20 kanji)...")
    results = verify_kanji_examples(kanji_data, vocab_map, num_kanji=20)
    print()

    print_report(results)

    # Overall verdict
    print("=" * 80)
    print("VERDICT")
    print("=" * 80)
    if len(results['missing_vocab_ids']) == 0 and len(results['kanji_mismatch']) == 0:
        print("✅ ALL EXAMPLES ARE VALID AND CORRECTLY LINKED!")
    elif len(results['missing_vocab_ids']) > 0:
        print(f"❌ CRITICAL: Found {len(results['missing_vocab_ids'])} missing vocabulary IDs")
    elif len(results['kanji_mismatch']) > 0:
        print(f"⚠️  WARNING: Found {len(results['kanji_mismatch'])} kanji mismatches")
    print("=" * 80)

if __name__ == "__main__":
    main()
