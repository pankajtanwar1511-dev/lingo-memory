#!/usr/bin/env python3
"""
Find verbs in N5_verbs_complete_unique.md that are NOT in N5_verbs_dataset.json
"""

import json
import re
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
COMPLETE_UNIQUE_MD = BASE_DIR / "N5_verbs_complete_unique.md"
VERBS_DATASET_JSON = BASE_DIR / "public/seed-data/N5_verbs_dataset.json"
USAGE_THREADS = [BASE_DIR / f"verbs_usage_thread{i}.md" for i in range(1, 6)]


def parse_complete_unique_md():
    """Parse N5_verbs_complete_unique.md to extract all verbs."""
    verbs = []

    with open(COMPLETE_UNIQUE_MD, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match table rows: | Kanji | Kana | Masu Form | Masu (Kana) | English |
    pattern = r'\| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|'

    for match in re.finditer(pattern, content):
        kanji = match.group(1).strip()
        kana = match.group(2).strip()
        masu_form = match.group(3).strip()
        masu_kana = match.group(4).strip()
        english = match.group(5).strip()

        # Skip header rows
        if kanji == "Kanji" or kanji.startswith("---"):
            continue

        if kanji and kana:
            verbs.append({
                "kanji": kanji,
                "kana": kana,
                "masu_form": masu_form,
                "masu_kana": masu_kana,
                "english": english
            })

    print(f"✓ Found {len(verbs)} verbs in N5_verbs_complete_unique.md")
    return verbs


def get_dataset_verbs():
    """Get all verb kanji from N5_verbs_dataset.json."""
    with open(VERBS_DATASET_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)

    kanji_set = {verb['lemma']['kanji'] for verb in data['verbs']}
    print(f"✓ Found {len(kanji_set)} verbs in N5_verbs_dataset.json")
    return kanji_set


def check_usage_threads():
    """Check which verbs have usage patterns in threads."""
    verbs_with_usage = set()

    for thread_file in USAGE_THREADS:
        if not thread_file.exists():
            continue

        with open(thread_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Match verb sections: ## 1️⃣ 会う (あう) — *to meet*
        verb_pattern = r'## [0-9️⃣]+\s+(.+?)\s+\('

        for match in re.finditer(verb_pattern, content):
            kanji = match.group(1).strip()
            verbs_with_usage.add(kanji)

    print(f"✓ Found {len(verbs_with_usage)} verbs with usage patterns in threads")
    return verbs_with_usage


def main():
    print("=" * 60)
    print("Finding Remaining Verbs")
    print("=" * 60)

    # Get all verbs from complete unique
    print("\n1️⃣ Parsing N5_verbs_complete_unique.md...")
    all_verbs = parse_complete_unique_md()

    # Get verbs already in dataset
    print("\n2️⃣ Reading N5_verbs_dataset.json...")
    dataset_verbs = get_dataset_verbs()

    # Check usage thread coverage
    print("\n3️⃣ Checking verbs_usage_thread files...")
    verbs_with_usage = check_usage_threads()

    # Find remaining verbs
    print("\n4️⃣ Identifying remaining verbs...")
    remaining_verbs = []
    for verb in all_verbs:
        if verb['kanji'] not in dataset_verbs:
            verb['has_usage_patterns'] = verb['kanji'] in verbs_with_usage
            remaining_verbs.append(verb)

    print(f"\n✅ Found {len(remaining_verbs)} remaining verbs")

    # Separate by usage pattern availability
    with_usage = [v for v in remaining_verbs if v['has_usage_patterns']]
    without_usage = [v for v in remaining_verbs if not v['has_usage_patterns']]

    print(f"  - {len(with_usage)} verbs WITH usage patterns in threads")
    print(f"  - {len(without_usage)} verbs WITHOUT usage patterns (need to create)")

    # Print the list
    print("\n📋 Remaining Verbs:")
    print("\n" + "=" * 60)
    print("WITH Usage Patterns:")
    print("=" * 60)
    for i, verb in enumerate(with_usage, 1):
        print(f"{i:3}. {verb['kanji']:10} ({verb['kana']:15}) - {verb['english']}")

    print("\n" + "=" * 60)
    print("WITHOUT Usage Patterns (Need to Create):")
    print("=" * 60)
    for i, verb in enumerate(without_usage, 1):
        print(f"{i:3}. {verb['kanji']:10} ({verb['kana']:15}) - {verb['english']}")

    # Save to file for processing
    output_file = BASE_DIR / "remaining_verbs_list.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            "total": len(remaining_verbs),
            "with_usage_patterns": len(with_usage),
            "without_usage_patterns": len(without_usage),
            "verbs": remaining_verbs
        }, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Saved remaining verbs list to: {output_file}")


if __name__ == "__main__":
    main()
