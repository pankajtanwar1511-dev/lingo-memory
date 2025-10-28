#!/usr/bin/env python3
"""
Analyze AI Verification Results

Handles two different JSON formats:
- Format 1 (batches 01-04, 09-26): Array of objects with nested 'verification' field
- Format 2 (batches 05-08): Object with 'examples_verification' array and simpler structure
"""

import json
from pathlib import Path
from collections import defaultdict, Counter

def normalize_result(result, format_type):
    """Normalize different formats to common structure"""

    if format_type == 'full':
        # Format 1: nested verification object
        return {
            'card_id': result['card_id'],
            'example_index': result['example_index'],
            'target_vocab_present': result['verification']['target_vocab_present'],
            'kana_accuracy': result['verification']['kana_accuracy'],
            'n5_grammar_check': result['verification']['n5_grammar_check'],
            'difficulty_rating': result['verification'].get('difficulty_rating', 0),
            'recommendation': result['verification']['recommendation'],
            'grammar_notes': result['verification'].get('grammar_notes', ''),
        }
    else:
        # Format 2: flat structure with boolean/simpler values
        return {
            'card_id': result['card_id'],
            'example_index': result['example_index'],
            'target_vocab_present': 'YES' if result.get('target_vocab_present') else 'NO',
            'kana_accuracy': result.get('kana_accuracy', 'UNKNOWN'),
            'n5_grammar_check': result.get('n5_grammar_check', 'UNKNOWN'),
            'difficulty_rating': result.get('difficulty_rating', 0),
            'recommendation': result.get('recommendation', 'UNKNOWN'),
            'grammar_notes': result.get('notes', ''),
        }

def analyze_all_batches():
    """Analyze all verification result batches"""

    print("=" * 80)
    print("AI VERIFICATION RESULTS ANALYSIS (Batches 01-38)")
    print("=" * 80)

    results_dir = Path('data/ai-verification-results')

    # Collect all results
    all_results = []
    batch_stats = []
    skipped_batches = []

    for batch_num in range(1, 39):  # Analyze all 38 batches
        batch_file = results_dir / f'RESULTS_BATCH_{batch_num:02d}.json'

        if not batch_file.exists():
            skipped_batches.append(batch_num)
            print(f"⚠️  Batch {batch_num:02d} not found - skipping")
            continue

        # Check if file is empty
        if batch_file.stat().st_size == 0:
            skipped_batches.append(batch_num)
            print(f"⚠️  Batch {batch_num:02d} is empty - skipping")
            continue

        try:
            with open(batch_file, 'r', encoding='utf-8') as f:
                batch_data = json.load(f)

            # Detect format
            if isinstance(batch_data, list):
                # Format 1: array of results
                format_type = 'full'
                batch_results = [normalize_result(r, format_type) for r in batch_data]
            elif isinstance(batch_data, dict) and 'examples_verification' in batch_data:
                # Format 2: object with examples_verification
                format_type = 'condensed'
                batch_results = [normalize_result(r, format_type) for r in batch_data['examples_verification']]
            else:
                print(f"❌ Batch {batch_num:02d}: Unknown format - skipping")
                skipped_batches.append(batch_num)
                continue

            all_results.extend(batch_results)

            # Count recommendations per batch
            batch_accept = sum(1 for r in batch_results if r['recommendation'] == 'ACCEPT')
            batch_reject = sum(1 for r in batch_results if r['recommendation'] == 'REJECT')
            batch_review = sum(1 for r in batch_results if r['recommendation'] == 'REVIEW')

            batch_stats.append({
                'batch': batch_num,
                'format': format_type,
                'total': len(batch_results),
                'accept': batch_accept,
                'reject': batch_reject,
                'review': batch_review,
                'accept_rate': batch_accept / len(batch_results) * 100 if batch_results else 0
            })

            print(f"✅ Batch {batch_num:02d} ({format_type:10}): {len(batch_results):2} examples - "
                  f"Accept: {batch_accept:2}, Reject: {batch_reject:2}, Review: {batch_review:2}")

        except Exception as e:
            print(f"❌ Error reading batch {batch_num:02d}: {e}")
            skipped_batches.append(batch_num)
            continue

    print(f"\n{'='*80}")
    print(f"✅ Loaded {len(all_results):,} verification results from {len(batch_stats)} batches")
    if skipped_batches:
        print(f"⚠️  Skipped batches: {', '.join(map(str, skipped_batches))}")
    print("=" * 80)

    if not all_results:
        print("\n❌ No results to analyze!")
        return

    # Overall statistics
    print("\n" + "=" * 80)
    print("OVERALL STATISTICS")
    print("=" * 80)

    total_accept = sum(1 for r in all_results if r['recommendation'] == 'ACCEPT')
    total_reject = sum(1 for r in all_results if r['recommendation'] == 'REJECT')
    total_review = sum(1 for r in all_results if r['recommendation'] == 'REVIEW')
    total = len(all_results)

    print(f"\nTotal examples verified:     {total:,}")
    print(f"  ✅ ACCEPT:                 {total_accept:,} ({total_accept/total*100:.1f}%)")
    print(f"  ❌ REJECT:                 {total_reject:,} ({total_reject/total*100:.1f}%)")
    print(f"  ⚠️  REVIEW:                 {total_review:,} ({total_review/total*100:.1f}%)")

    # Projected usable examples
    usable_min = total_accept
    usable_max = total_accept + total_review  # if all reviews pass
    print(f"\n📊 Usable examples:          {usable_min:,} - {usable_max:,}")
    print(f"   Loss from original:       {total_reject:,} ({total_reject/total*100:.1f}%)")

    # Progress towards total dataset
    total_examples_in_dataset = 1871
    verified_so_far = total
    remaining = total_examples_in_dataset - verified_so_far
    print(f"\n📈 Verification progress:    {verified_so_far:,} / {total_examples_in_dataset:,} "
          f"({verified_so_far/total_examples_in_dataset*100:.1f}%)")
    print(f"   Remaining examples:       {remaining:,}")

    # Grammar failures analysis
    print("\n" + "=" * 80)
    print("GRAMMAR PATTERN FAILURES (Top 20)")
    print("=" * 80)

    grammar_failures = []
    for r in all_results:
        if r['n5_grammar_check'] == 'FAIL':
            grammar_failures.append(r['grammar_notes'])

    # Extract common patterns
    pattern_counts = Counter()
    patterns_map = {
        'と言った': 'Reported speech (と言った)',
        'quotation': 'Reported speech',
        'たら': 'Conditional たら',
        'ば': 'Conditional ば',
        'なら': 'Conditional なら',
        'conditional': 'Conditional forms',
        'なければならない': 'Obligation なければならない',
        'なくてはいけない': 'Obligation なくてはいけない',
        'obligation': 'Obligation patterns',
        'られる': 'Potential られる',
        'potential': 'Potential form',
        'causative': 'Causative せる/させる',
        'passive': 'Passive れる/られる',
        'らしい': 'Evidential らしい',
        'ている': 'Progressive ている',
        'ていた': 'Past progressive ていた',
        'てみる': 'Try doing てみる',
        'のに': 'Conjunction のに',
        'ので': 'Conjunction ので',
        'だろう': 'Plain volitional だろう',
        'んだ': 'Explanatory んだ/のだ',
    }

    for note in grammar_failures:
        note_lower = note.lower()
        for pattern, label in patterns_map.items():
            if pattern in note_lower:
                pattern_counts[label] += 1

    print("\nPattern                              Count    % of Failures")
    print("-" * 80)
    for pattern, count in pattern_counts.most_common(20):
        pct = count / len(grammar_failures) * 100 if grammar_failures else 0
        print(f"{pattern:35} {count:5}    {pct:5.1f}%")

    print(f"\nTotal grammar failures: {len(grammar_failures)} ({len(grammar_failures)/total*100:.1f}%)")

    # Kana accuracy
    print("\n" + "=" * 80)
    print("KANA ACCURACY")
    print("=" * 80)

    kana_stats = Counter()
    for r in all_results:
        kana = r['kana_accuracy']
        # Normalize different naming conventions
        if kana in ['ACCURATE', 'CORRECT']:
            kana_stats['ACCURATE'] += 1
        elif kana in ['MINOR_ERROR', 'INCORRECT']:
            kana_stats['ERRORS'] += 1
        elif kana == 'MAJOR_ERROR':
            kana_stats['MAJOR_ERROR'] += 1

    kana_accurate = kana_stats.get('ACCURATE', 0)
    kana_errors = kana_stats.get('ERRORS', 0)
    kana_major = kana_stats.get('MAJOR_ERROR', 0)

    print(f"\n  ✅ ACCURATE:               {kana_accurate:,} ({kana_accurate/total*100:.1f}%)")
    print(f"  ⚠️  MINOR/INCORRECT:        {kana_errors:,} ({kana_errors/total*100:.1f}%)")
    if kana_major > 0:
        print(f"  ❌ MAJOR_ERROR:            {kana_major:,} ({kana_major/total*100:.1f}%)")

    # Target vocabulary presence
    print("\n" + "=" * 80)
    print("TARGET VOCABULARY PRESENCE")
    print("=" * 80)

    vocab_yes = sum(1 for r in all_results if r['target_vocab_present'] in ['YES', 'True', True])
    vocab_no = sum(1 for r in all_results if r['target_vocab_present'] in ['NO', 'False', False])
    vocab_unclear = sum(1 for r in all_results if r['target_vocab_present'] == 'UNCLEAR')

    print(f"\n  ✅ YES:                    {vocab_yes:,} ({vocab_yes/total*100:.1f}%)")
    print(f"  ❌ NO:                     {vocab_no:,} ({vocab_no/total*100:.1f}%)")
    if vocab_unclear > 0:
        print(f"  ⚠️  UNCLEAR:                {vocab_unclear:,} ({vocab_unclear/total*100:.1f}%)")

    # Difficulty distribution
    print("\n" + "=" * 80)
    print("DIFFICULTY DISTRIBUTION (1-10)")
    print("=" * 80)

    difficulty_counts = Counter()
    difficulty_by_recommendation = defaultdict(list)

    for r in all_results:
        rating = r.get('difficulty_rating', 0)
        # Convert to int if it's a string
        try:
            rating = int(rating) if rating else 0
        except (ValueError, TypeError):
            rating = 0
        if rating > 0:  # Only count valid ratings
            difficulty_counts[rating] += 1
            difficulty_by_recommendation[r['recommendation']].append(rating)

    print("\nRating  Count    Distribution")
    print("-" * 40)
    max_count = max(difficulty_counts.values()) if difficulty_counts else 1
    for rating in range(1, 11):
        count = difficulty_counts.get(rating, 0)
        bar_length = int(count / max_count * 40) if max_count > 0 else 0
        bar = '█' * bar_length
        print(f"  {rating:2}    {count:5}    {bar}")

    # Average difficulty by recommendation
    print("\nAverage difficulty by recommendation:")
    for rec in ['ACCEPT', 'REVIEW', 'REJECT']:
        if difficulty_by_recommendation[rec]:
            avg = sum(difficulty_by_recommendation[rec]) / len(difficulty_by_recommendation[rec])
            print(f"  {rec:7}: {avg:.1f}")

    # Per-card statistics
    print("\n" + "=" * 80)
    print("PER-CARD STATISTICS")
    print("=" * 80)

    card_stats = defaultdict(lambda: {'accept': 0, 'reject': 0, 'review': 0, 'total': 0})

    for r in all_results:
        card_id = r['card_id']
        rec = r['recommendation']
        card_stats[card_id]['total'] += 1
        if rec == 'ACCEPT':
            card_stats[card_id]['accept'] += 1
        elif rec == 'REJECT':
            card_stats[card_id]['reject'] += 1
        elif rec == 'REVIEW':
            card_stats[card_id]['review'] += 1

    # Cards with no accepted examples
    cards_zero_accept = [card_id for card_id, stats in card_stats.items() if stats['accept'] == 0]
    cards_one_accept = [card_id for card_id, stats in card_stats.items() if stats['accept'] == 1]
    cards_two_plus = [card_id for card_id, stats in card_stats.items() if stats['accept'] >= 2]

    print(f"\nCards with 0 accepted examples:  {len(cards_zero_accept)}")
    print(f"Cards with 1 accepted example:   {len(cards_one_accept)}")
    print(f"Cards with 2+ accepted examples: {len(cards_two_plus)}")
    print(f"Total unique cards verified:     {len(card_stats)}")

    # Batch-by-batch summary
    print("\n" + "=" * 80)
    print("BATCH-BY-BATCH ACCEPTANCE RATES")
    print("=" * 80)

    print("\nBatch  Format      Total  Accept  Reject  Review  Rate")
    print("-" * 60)
    for stats in batch_stats:
        print(f"{stats['batch']:3}    {stats['format']:10}  {stats['total']:3}    "
              f"{stats['accept']:3}     {stats['reject']:3}     "
              f"{stats['review']:3}     {stats['accept_rate']:5.1f}%")

    # Average acceptance rate across all batches
    avg_accept_rate = sum(s['accept_rate'] for s in batch_stats) / len(batch_stats) if batch_stats else 0
    print(f"\nAverage acceptance rate: {avg_accept_rate:.1f}%")

    # Save detailed report
    output_file = Path('data/ai-verification-results/ANALYSIS_REPORT.json')
    report = {
        'summary': {
            'batches_analyzed': len(batch_stats),
            'batches_skipped': skipped_batches,
            'total_examples': total,
            'accept': total_accept,
            'reject': total_reject,
            'review': total_review,
            'accept_rate': total_accept / total * 100 if total else 0,
            'usable_min': usable_min,
            'usable_max': usable_max,
            'progress_pct': verified_so_far / total_examples_in_dataset * 100
        },
        'grammar_failures': dict(pattern_counts.most_common()),
        'kana_accuracy': {
            'accurate': kana_accurate,
            'errors': kana_errors,
            'major_error': kana_major
        },
        'vocab_presence': {
            'yes': vocab_yes,
            'no': vocab_no,
            'unclear': vocab_unclear
        },
        'difficulty_distribution': dict(difficulty_counts),
        'cards_needing_examples': {
            'zero_accepted': sorted(cards_zero_accept),
            'one_accepted': sorted(cards_one_accept),
            'two_plus_accepted': sorted(cards_two_plus)
        },
        'batch_stats': batch_stats
    }

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Detailed report saved to: {output_file}")
    print("=" * 80)


if __name__ == '__main__':
    analyze_all_batches()
