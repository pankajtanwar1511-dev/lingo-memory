#!/usr/bin/env python3
"""
Categorize Verified Examples into Multi-Level Datasets

Sorts all verified examples into:
- Category A: N5 Production (ACCEPT + accurate)
- Category B: N5/N4 Bridge (REVIEW + accurate)
- Category C: N4 Foundation (REJECT + accurate + N4 grammar)
- Category D: Needs Correction (kana errors or vocab issues)
"""

import json
from pathlib import Path
from collections import defaultdict

def normalize_result(result, format_type):
    """Normalize different formats to common structure"""

    if format_type == 'full':
        return {
            'card_id': result['card_id'],
            'example_index': result['example_index'],
            'target_vocab_present': result['verification']['target_vocab_present'],
            'kana_accuracy': result['verification']['kana_accuracy'],
            'n5_grammar_check': result['verification']['n5_grammar_check'],
            'difficulty_rating': result['verification'].get('difficulty_rating', 0),
            'recommendation': result['verification']['recommendation'],
            'grammar_notes': result['verification'].get('grammar_notes', ''),
            'target_vocab_notes': result['verification'].get('target_vocab_notes', ''),
            'kana_notes': result['verification'].get('kana_notes', ''),
            'overall_notes': result['verification'].get('overall_notes', ''),
        }
    else:
        return {
            'card_id': result['card_id'],
            'example_index': result['example_index'],
            'target_vocab_present': 'YES' if result.get('target_vocab_present') else 'NO',
            'kana_accuracy': result.get('kana_accuracy', 'UNKNOWN'),
            'n5_grammar_check': result.get('n5_grammar_check', 'UNKNOWN'),
            'difficulty_rating': result.get('difficulty_rating', 0),
            'recommendation': result.get('recommendation', 'UNKNOWN'),
            'grammar_notes': result.get('notes', ''),
            'target_vocab_notes': '',
            'kana_notes': result.get('kana_issue', ''),
            'overall_notes': result.get('notes', ''),
        }

def categorize_all_batches():
    """Categorize all verified examples"""

    print("=" * 80)
    print("CATEGORIZING VERIFIED EXAMPLES INTO MULTI-LEVEL DATASETS")
    print("=" * 80)

    results_dir = Path('data/ai-verification-results')
    output_dir = Path('data/categorized-examples')
    output_dir.mkdir(exist_ok=True)

    # Categories
    n5_production = []      # Category A: ACCEPT + accurate
    n5_n4_bridge = []       # Category B: REVIEW + accurate
    n4_foundation = []      # Category C: REJECT + accurate + N4 grammar
    needs_correction = []   # Category D: Issues to fix

    all_results = []

    # Load all batches
    for batch_num in range(1, 39):
        batch_file = results_dir / f'RESULTS_BATCH_{batch_num:02d}.json'

        if not batch_file.exists() or batch_file.stat().st_size == 0:
            continue

        try:
            with open(batch_file, 'r', encoding='utf-8') as f:
                batch_data = json.load(f)

            # Detect format
            if isinstance(batch_data, list):
                format_type = 'full'
                batch_results = [normalize_result(r, format_type) for r in batch_data]
            elif isinstance(batch_data, dict) and 'examples_verification' in batch_data:
                format_type = 'condensed'
                batch_results = [normalize_result(r, format_type) for r in batch_data['examples_verification']]
            else:
                continue

            all_results.extend(batch_results)
        except Exception as e:
            print(f"Error loading batch {batch_num}: {e}")
            continue

    print(f"\nLoaded {len(all_results)} verified examples\n")

    # Categorize each example
    for result in all_results:
        rec = result['recommendation']
        kana = result['kana_accuracy']
        vocab = result['target_vocab_present']
        grammar = result['n5_grammar_check']

        # Normalize values
        kana_ok = kana in ['ACCURATE', 'CORRECT']
        kana_minor = kana in ['MINOR_ERROR', 'INCORRECT']
        kana_major = kana == 'MAJOR_ERROR'
        vocab_ok = vocab in ['YES', 'True', True]
        vocab_unclear = vocab == 'UNCLEAR'

        # Category A: N5 Production
        if rec == 'ACCEPT' and kana_ok and vocab_ok:
            n5_production.append(result)

        # Category B: N5/N4 Bridge (REVIEW cases)
        elif rec == 'REVIEW' and (kana_ok or kana_minor) and vocab_ok:
            n5_n4_bridge.append(result)

        # Category C: N4 Foundation (REJECT but good quality, just wrong level)
        elif rec == 'REJECT' and kana_ok and vocab_ok and grammar == 'FAIL':
            n4_foundation.append(result)

        # Category D: Needs Correction
        else:
            needs_correction.append(result)

    # Print summary
    print("CATEGORIZATION RESULTS")
    print("=" * 80)
    print(f"\nCategory A - N5 Production (ACCEPT + accurate):")
    print(f"  Count: {len(n5_production):,}")
    print(f"  Use: Deploy to app immediately")
    print(f"  File: n5-production.json")

    print(f"\nCategory B - N5/N4 Bridge (REVIEW + accurate):")
    print(f"  Count: {len(n5_n4_bridge):,}")
    print(f"  Use: Human review for final placement")
    print(f"  File: n5-n4-bridge.json")
    print(f"  Action: Quick 10-15 min review to decide N5 vs N4")

    print(f"\nCategory C - N4 Foundation (REJECT + accurate):")
    print(f"  Count: {len(n4_foundation):,}")
    print(f"  Use: N4 dataset starting point")
    print(f"  File: n4-foundation.json")
    print(f"  Action: Save for N4 development")

    print(f"\nCategory D - Needs Correction:")
    print(f"  Count: {len(needs_correction):,}")
    print(f"  Use: Fix kana or discard")
    print(f"  File: needs-correction.json")
    print(f"  Action: Manual review/correction")

    total = len(all_results)
    print(f"\nTotal examples: {total:,}")
    print(f"  Usable now (A):        {len(n5_production):,} ({len(n5_production)/total*100:.1f}%)")
    print(f"  Review needed (B):     {len(n5_n4_bridge):,} ({len(n5_n4_bridge)/total*100:.1f}%)")
    print(f"  Future N4 use (C):     {len(n4_foundation):,} ({len(n4_foundation)/total*100:.1f}%)")
    print(f"  Correction needed (D): {len(needs_correction):,} ({len(needs_correction)/total*100:.1f}%)")

    verified_total = len(n5_production) + len(n5_n4_bridge) + len(n4_foundation)
    print(f"\nTotal verified & usable: {verified_total:,} ({verified_total/total*100:.1f}%)")

    # Save categorized datasets
    datasets = {
        'n5-production.json': n5_production,
        'n5-n4-bridge.json': n5_n4_bridge,
        'n4-foundation.json': n4_foundation,
        'needs-correction.json': needs_correction,
    }

    print(f"\n{'='*80}")
    print("SAVING CATEGORIZED DATASETS")
    print("=" * 80)

    for filename, data in datasets.items():
        output_file = output_dir / filename
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ {filename:25} {len(data):5} examples")

    # Generate summary statistics
    summary = {
        'total_examples': total,
        'categories': {
            'n5_production': {
                'count': len(n5_production),
                'percentage': len(n5_production) / total * 100,
                'description': 'Ready for N5 app deployment'
            },
            'n5_n4_bridge': {
                'count': len(n5_n4_bridge),
                'percentage': len(n5_n4_bridge) / total * 100,
                'description': 'Needs human review for level placement'
            },
            'n4_foundation': {
                'count': len(n4_foundation),
                'percentage': len(n4_foundation) / total * 100,
                'description': 'N4 dataset foundation (grammar too advanced for N5)'
            },
            'needs_correction': {
                'count': len(needs_correction),
                'percentage': len(needs_correction) / total * 100,
                'description': 'Kana errors or vocabulary issues'
            }
        },
        'usability': {
            'immediate_use': len(n5_production),
            'after_review': len(n5_production) + len(n5_n4_bridge),
            'total_verified': verified_total,
            'correction_rate': len(needs_correction) / total * 100
        }
    }

    summary_file = output_dir / 'categorization-summary.json'
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Summary: {summary_file}")
    print("=" * 80)

    # Breakdown of needs_correction
    if needs_correction:
        print("\nNEEDS CORRECTION BREAKDOWN")
        print("=" * 80)

        kana_errors = sum(1 for r in needs_correction
                         if r['kana_accuracy'] in ['MAJOR_ERROR', 'MINOR_ERROR', 'INCORRECT'])
        vocab_issues = sum(1 for r in needs_correction
                          if r['target_vocab_present'] in ['NO', 'UNCLEAR', False])
        both_issues = sum(1 for r in needs_correction
                         if (r['kana_accuracy'] in ['MAJOR_ERROR', 'INCORRECT'])
                         and r['target_vocab_present'] in ['NO', 'UNCLEAR', False])

        print(f"  Kana errors:       {kana_errors}")
        print(f"  Vocab issues:      {vocab_issues}")
        print(f"  Both issues:       {both_issues}")


if __name__ == '__main__':
    categorize_all_batches()
