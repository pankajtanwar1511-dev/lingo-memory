#!/usr/bin/env python3
"""
Update N5_verbs_dataset.json with:
1. Improved English glosses from N5_verbs_complete_unique.md
2. Usage patterns from verbs_usage_thread1-5.md
"""

import json
import re
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
VERBS_JSON = BASE_DIR / "public/seed-data/N5_verbs_dataset.json"
UNIQUE_MD = BASE_DIR / "N5_verbs_complete_unique.md"
THREAD_FILES = [
    BASE_DIR / f"verbs_usage_thread{i}.md" for i in range(1, 6)
]


def parse_unique_md():
    """Parse N5_verbs_complete_unique.md to extract improved glosses."""
    glosses = {}

    with open(UNIQUE_MD, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match table rows: | Kanji | Kana | Masu Form | Masu (Kana) | English |
    pattern = r'\| ([^\|]+) \| ([^\|]+) \| ([^\|]+) \| ([^\|]+) \| ([^\|]+) \|'

    for match in re.finditer(pattern, content):
        kanji = match.group(1).strip()
        kana = match.group(2).strip()
        english = match.group(5).strip()

        # Skip header rows
        if kanji == "Kanji" or kanji == "------":
            continue

        # Parse English meanings (split by comma, remove "to ")
        meanings = []
        for part in english.split(','):
            part = part.strip()
            # Remove "to " prefix
            if part.startswith('to '):
                part = part[3:]
            # Handle parenthetical notes like "(a shower)"
            # Keep them for now
            meanings.append(part.strip())

        # Use kanji as key
        glosses[kanji] = meanings

    print(f"✓ Parsed {len(glosses)} verb glosses from N5_verbs_complete_unique.md")
    return glosses


def parse_usage_threads():
    """Parse all verbs_usage_thread files to extract usage patterns."""
    usage_patterns = {}

    for thread_file in THREAD_FILES:
        if not thread_file.exists():
            print(f"⚠ Warning: {thread_file.name} not found")
            continue

        with open(thread_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Match verb sections: ## 1️⃣ 会う (あう) — *to meet*
        # Then extract usage patterns
        verb_pattern = r'## [0-9️⃣]+\s+(.+?)\s+\((.+?)\)\s+—\s+\*(.+?)\*\s+\*\*Usage Patterns:\*\*\s+(.*?)(?=\n---|\Z)'

        for match in re.finditer(verb_pattern, content, re.DOTALL):
            kanji = match.group(1).strip()
            kana = match.group(2).strip()
            english = match.group(3).strip()
            patterns_text = match.group(4).strip()

            # Extract individual patterns: 1. pattern — translation
            pattern_items = []
            for line in patterns_text.split('\n'):
                line = line.strip()
                if not line or line.startswith('**Note:'):
                    continue

                # Match: 1. japanese — english
                item_match = re.match(r'^\d+\.\s+(.+?)\s+—\s+(.+)$', line)
                if item_match:
                    japanese = item_match.group(1).strip()
                    english_trans = item_match.group(2).strip()
                    pattern_items.append({
                        "jp": japanese,
                        "en": english_trans
                    })

            if pattern_items:
                usage_patterns[kanji] = pattern_items

        print(f"✓ Parsed {thread_file.name}")

    print(f"✓ Total verbs with usage patterns: {len(usage_patterns)}")
    return usage_patterns


def update_verbs_dataset(glosses, usage_patterns):
    """Update N5_verbs_dataset.json with glosses and usage patterns."""

    # Read current JSON
    with open(VERBS_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)

    updated_count_glosses = 0
    updated_count_usage = 0

    for verb in data['verbs']:
        kanji = verb['lemma']['kanji']

        # Update glosses
        if kanji in glosses:
            old_gloss = verb['meaning']['gloss']
            new_gloss = glosses[kanji]

            # Only update if different
            if old_gloss != new_gloss:
                verb['meaning']['gloss'] = new_gloss
                updated_count_glosses += 1
                print(f"  Updated gloss: {kanji} | {old_gloss} → {new_gloss}")

        # Add usage patterns
        if kanji in usage_patterns:
            verb['usagePatterns'] = usage_patterns[kanji]
            updated_count_usage += 1

    # Update metadata
    data['metadata']['version'] = "2.0.0"
    data['metadata']['description'] = "Complete JLPT N5 verb dataset with enhanced glosses and usage patterns"

    # Write updated JSON
    with open(VERBS_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Updated {updated_count_glosses} verb glosses")
    print(f"✅ Added usage patterns to {updated_count_usage} verbs")
    print(f"✅ Saved to {VERBS_JSON}")


def main():
    print("=" * 60)
    print("Updating N5_verbs_dataset.json")
    print("=" * 60)

    # Parse source files
    print("\n1️⃣ Parsing N5_verbs_complete_unique.md...")
    glosses = parse_unique_md()

    print("\n2️⃣ Parsing verbs_usage_thread1-5.md...")
    usage_patterns = parse_usage_threads()

    print("\n3️⃣ Updating N5_verbs_dataset.json...")
    update_verbs_dataset(glosses, usage_patterns)

    print("\n" + "=" * 60)
    print("✅ Update complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
