#!/usr/bin/env python3
"""
Analyze current distribution for Phase 3 planning.
Shows formality × difficulty distribution to plan smart conversions.
"""

import sqlite3
from pathlib import Path

db_path = Path(__file__).parent.parent / "n5_sentences_ultra_pure.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("=" * 80)
print("CURRENT DISTRIBUTION: FORMALITY × DIFFICULTY")
print("=" * 80)

# Get distribution by formality and difficulty tier
cursor.execute("""
SELECT
    formality,
    CASE
        WHEN difficulty BETWEEN 1 AND 3 THEN 'Beginner (1-3)'
        WHEN difficulty BETWEEN 4 AND 6 THEN 'Intermediate (4-6)'
        WHEN difficulty BETWEEN 7 AND 10 THEN 'Advanced (7-10)'
    END as difficulty_tier,
    COUNT(*) as count
FROM n5_sentences
GROUP BY formality, difficulty_tier
ORDER BY formality DESC, difficulty_tier
""")

results = cursor.fetchall()

formal_total = sum(count for form, _, count in results if form == 'formal')
casual_total = sum(count for form, _, count in results if form == 'casual')
overall_total = formal_total + casual_total

print(f"\nTotal Sentences: {overall_total}")
print(f"Formal: {formal_total} ({100*formal_total/overall_total:.1f}%)")
print(f"Casual: {casual_total} ({100*casual_total/overall_total:.1f}%)")

print("\n" + "-" * 80)
print("FORMAL SENTENCES (Current)")
print("-" * 80)

formal_dist = {}
for formality, tier, count in results:
    if formality == 'formal':
        pct_within = 100 * count / formal_total
        pct_total = 100 * count / overall_total
        formal_dist[tier] = count
        print(f"{tier:20s}: {count:4d} sentences ({pct_within:5.1f}% of formal, {pct_total:5.1f}% of total)")

print("\n" + "-" * 80)
print("CASUAL SENTENCES (Current)")
print("-" * 80)

casual_dist = {}
for formality, tier, count in results:
    if formality == 'casual':
        pct_within = 100 * count / casual_total
        pct_total = 100 * count / overall_total
        casual_dist[tier] = count
        print(f"{tier:20s}: {count:4d} sentences ({pct_within:5.1f}% of casual, {pct_total:5.1f}% of total)")

# Calculate target distribution (60% formal, 40% casual, maintaining bell curve)
print("\n" + "=" * 80)
print("TARGET DISTRIBUTION (After Phase 3)")
print("=" * 80)

target_total = overall_total + 1000  # Estimate: add ~1000 sentences
target_formal = int(target_total * 0.60)
target_casual = int(target_total * 0.40)

print(f"\nTarget Total: ~{target_total}")
print(f"Target Formal: ~{target_formal} (60%)")
print(f"Target Casual: ~{target_casual} (40%)")

print("\n" + "-" * 80)
print("TARGET FORMAL DISTRIBUTION (Maintaining Bell Curve)")
print("-" * 80)

target_formal_dist = {
    'Beginner (1-3)': int(target_formal * 0.133),
    'Intermediate (4-6)': int(target_formal * 0.598),
    'Advanced (7-10)': int(target_formal * 0.269)
}

for tier, target_count in target_formal_dist.items():
    current = formal_dist.get(tier, 0)
    gap = target_count - current
    print(f"{tier:20s}: Target {target_count:4d} | Current {current:4d} | Gap: {gap:+4d}")

print("\n" + "-" * 80)
print("TARGET CASUAL DISTRIBUTION (Maintaining Bell Curve)")
print("-" * 80)

target_casual_dist = {
    'Beginner (1-3)': int(target_casual * 0.133),
    'Intermediate (4-6)': int(target_casual * 0.598),
    'Advanced (7-10)': int(target_casual * 0.269)
}

for tier, target_count in target_casual_dist.items():
    current = casual_dist.get(tier, 0)
    gap = target_count - current
    print(f"{tier:20s}: Target {target_count:4d} | Current {current:4d} | Gap: {gap:+4d}")

# Conversion strategy
print("\n" + "=" * 80)
print("SMART CONVERSION STRATEGY")
print("=" * 80)

print("\nWe need to convert casual → formal in specific difficulty tiers:")

for tier in ['Beginner (1-3)', 'Intermediate (4-6)', 'Advanced (7-10)']:
    formal_gap = target_formal_dist[tier] - formal_dist.get(tier, 0)
    casual_current = casual_dist.get(tier, 0)
    casual_target = target_casual_dist[tier]
    casual_surplus = casual_current - casual_target

    can_convert = min(formal_gap, casual_surplus) if formal_gap > 0 and casual_surplus > 0 else 0

    print(f"\n{tier}:")
    print(f"  Formal needs:    +{formal_gap:4d} sentences")
    print(f"  Casual has:      {casual_current:4d} sentences (target: {casual_target}, surplus: {casual_surplus:+4d})")
    if can_convert > 0:
        print(f"  → CAN CONVERT:   {can_convert:4d} casual → formal ✅")
    elif formal_gap > 0:
        print(f"  → NEED TO GENERATE: {formal_gap:4d} NEW formal sentences 🆕")
    else:
        print(f"  → No action needed")

# Summary
print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)

total_convert = 0
total_generate = 0

for tier in ['Beginner (1-3)', 'Intermediate (4-6)', 'Advanced (7-10)']:
    formal_gap = target_formal_dist[tier] - formal_dist.get(tier, 0)
    casual_surplus = casual_dist.get(tier, 0) - target_casual_dist[tier]

    if formal_gap > 0:
        can_convert = min(formal_gap, max(0, casual_surplus))
        need_generate = formal_gap - can_convert

        total_convert += can_convert
        total_generate += need_generate

print(f"\nTotal conversions needed: {total_convert}")
print(f"Total new generation needed: {total_generate}")
print(f"Total new sentences: {total_convert + total_generate}")

print(f"\n✅ This strategy maintains bell curve for BOTH formal and casual!")

conn.close()
