#!/usr/bin/env python3
"""
Update N5_verbs_expansion.json with:
1. Improved English glosses from COLORED_VERBS_MASTER_LIST.md (if better)
2. Usage patterns from verbs_usage_thread1-5.md
"""

import json
import re
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
VERBS_EXPANSION_JSON = BASE_DIR / "public/seed-data/N5_verbs_expansion.json"
COLORED_MD = Path.home() / "Downloads/COLORED_VERBS_MASTER_LIST.md"
N5_UNIQUE_MD = BASE_DIR / "N5_verbs_complete_unique.md"
THREAD_FILES = [
    BASE_DIR / f"verbs_usage_thread{i}.md" for i in range(1, 6)
]


def parse_colored_md():
    """Parse COLORED_VERBS_MASTER_LIST.md to extract glosses."""
    if not COLORED_MD.exists():
        print(f"⚠ Warning: {COLORED_MD} not found, skipping COLORED comparison")
        return {}

    glosses = {}

    with open(COLORED_MD, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match table rows: | Kanji | Kana | Masu Form | Masu (Kana) | English |
    pattern = r'\| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|'

    for match in re.finditer(pattern, content):
        kanji = match.group(1).strip()
        kana = match.group(2).strip()
        english = match.group(5).strip()

        # Skip header rows
        if kanji == "Kanji" or kanji.startswith("---"):
            continue

        # Parse English meanings (split by comma, remove "to ")
        meanings = []
        for part in english.split(','):
            part = part.strip()
            # Remove "to " prefix
            if part.startswith('to '):
                part = part[3:]
            meanings.append(part.strip())

        # Use kanji as key
        if kanji and meanings:
            glosses[kanji] = meanings

    print(f"✓ Parsed {len(glosses)} verb glosses from COLORED_VERBS_MASTER_LIST.md")
    return glosses


def parse_n5_unique_md():
    """Parse N5_verbs_complete_unique.md as fallback for glosses."""
    glosses = {}

    with open(N5_UNIQUE_MD, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match table rows
    pattern = r'\| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|'

    for match in re.finditer(pattern, content):
        kanji = match.group(1).strip()
        kana = match.group(2).strip()
        english = match.group(5).strip()

        # Skip header rows
        if kanji == "Kanji" or kanji.startswith("---"):
            continue

        # Parse English meanings
        meanings = []
        for part in english.split(','):
            part = part.strip()
            if part.startswith('to '):
                part = part[3:]
            meanings.append(part.strip())

        if kanji and meanings:
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
        verb_pattern = r'## [0-9️⃣]+\s+(.+?)\s+\((.+?)\)\s+—\s+\*(.+?)\*\s+\*\*Usage Patterns:\*\*\s+(.*?)(?=\n---|## |\\Z)'

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


def update_verbs_expansion(colored_glosses, n5_glosses, usage_patterns):
    """Update N5_verbs_expansion.json with glosses and usage patterns."""

    # Read current JSON
    with open(VERBS_EXPANSION_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)

    updated_count_glosses = 0
    updated_count_usage = 0

    for verb in data['verbs']:
        kanji = verb['lemma']['kanji']

        # Check if we have better glosses (COLORED first, then N5_unique as fallback)
        new_gloss = None
        if kanji in colored_glosses:
            new_gloss = colored_glosses[kanji]
        elif kanji in n5_glosses:
            new_gloss = n5_glosses[kanji]

        # Update glosses if we found better ones
        if new_gloss:
            old_gloss = verb['meaning']['gloss']

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
    data['metadata']['description'] = "Additional N5 verbs with enhanced glosses and usage patterns"

    # Write updated JSON
    with open(VERBS_EXPANSION_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Updated {updated_count_glosses} verb glosses")
    print(f"✅ Added usage patterns to {updated_count_usage} verbs")
    print(f"✅ Saved to {VERBS_EXPANSION_JSON}")


def main():
    print("=" * 60)
    print("Updating N5_verbs_expansion.json")
    print("=" * 60)

    # Parse source files
    print("\n1️⃣ Parsing COLORED_VERBS_MASTER_LIST.md...")
    colored_glosses = parse_colored_md()

    print("\n2️⃣ Parsing N5_verbs_complete_unique.md (fallback)...")
    n5_glosses = parse_n5_unique_md()

    print("\n3️⃣ Parsing verbs_usage_thread1-5.md...")
    usage_patterns = parse_usage_threads()

    print("\n4️⃣ Updating N5_verbs_expansion.json...")
    update_verbs_expansion(colored_glosses, n5_glosses, usage_patterns)

    print("\n" + "=" * 60)
    print("✅ Update complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
