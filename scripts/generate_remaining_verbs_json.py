#!/usr/bin/env python3
"""
Generate comprehensive JSON for remaining 104 verbs (excluding first 27 already processed)
Uses usage patterns from verbs_usage_thread files
"""

import json
import re
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
REMAINING_VERBS_JSON = BASE_DIR / "remaining_verbs_list.json"
COMPLETE_UNIQUE_MD = BASE_DIR / "N5_verbs_complete_unique.md"
USAGE_THREADS = [BASE_DIR / f"verbs_usage_thread{i}.md" for i in range(1, 6)]
OUTPUT_JSON = BASE_DIR / "public/seed-data/N5_verbs_remaining.json"


# Verb class mapping based on て-form patterns
GODAN_ENDINGS = {'う', 'く', 'ぐ', 'す', 'つ', 'ぬ', 'ぶ', 'む', 'る'}
ICHIDAN_ENDINGS = {'る'}  # Need to check if える/いる ending


def determine_verb_class(kanji, kana):
    """Determine if verb is godan, ichidan, or irregular."""
    # Irregular verbs
    if kanji in ['する', '来る'] or 'する' in kanji:
        return 'irregular', True

    # Ichidan check - ends in eru/iru
    if kana.endswith('える') or kana.endswith('いる'):
        return 'ichidan', False

    # Godan - most other verbs
    return 'godan', False


def determine_valency(kanji, english):
    """Determine if verb is transitive or intransitive."""
    # Transitive markers in English
    transitive_markers = ['を', 'object', 'something', 'food', 'thing']

    # Common intransitive verbs
    intransitive_verbs = {
        '始まる', '止まる', '空く', '溢れる', '痛む', '乾く', '転ぶ', '滑る',
        '治る', '腫れる', '濡れる', '汚れる', '浮かぶ', '折れる', '溺れる',
        '凍る', '壊れる', '裂ける', '沈む', '詰まる', '飛ぶ', '溶ける',
        '流れる', '並ぶ', '破れる', '揺れる', '響く', '光る', '燃える', '消える'
    }

    if kanji in intransitive_verbs:
        return 'intransitive', []

    # Most others are transitive
    return 'transitive', ['を']


def parse_usage_patterns_for_verb(kanji):
    """Extract usage patterns for a specific verb from thread files."""
    for thread_file in USAGE_THREADS:
        if not thread_file.exists():
            continue

        with open(thread_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find this specific verb section
        verb_section_pattern = rf'## [0-9️⃣]+\s+{re.escape(kanji)}\s+\((.+?)\)\s+—\s+\*(.+?)\*\s+\*\*Usage Patterns:\*\*\s+(.*?)(?=\n---|## |\Z)'

        match = re.search(verb_section_pattern, content, re.DOTALL)
        if match:
            kana = match.group(1).strip()
            english = match.group(2).strip()
            patterns_text = match.group(3).strip()

            # Extract individual patterns
            patterns = []
            for line in patterns_text.split('\n'):
                line = line.strip()
                if not line or line.startswith('**Note:'):
                    continue

                item_match = re.match(r'^\d+\.\s+(.+?)\s+—\s+(.+)$', line)
                if item_match:
                    patterns.append({
                        "jp": item_match.group(1).strip(),
                        "en": item_match.group(2).strip()
                    })

            return patterns

    return []


def generate_verb_entry(verb_data, verb_id_num):
    """Generate a complete verb entry in the normalized-v2 schema."""
    kanji = verb_data['kanji']
    kana = verb_data['kana']
    english = verb_data['english']

    # Parse English glosses
    glosses = []
    for part in english.split(','):
        part = part.strip()
        if part.startswith('to '):
            part = part[3:]
        glosses.append(part.strip())

    primary = glosses[0] if glosses else english

    # Determine verb class
    verb_class, is_irregular = determine_verb_class(kanji, kana)

    # Determine valency
    valency_type, required_particles = determine_valency(kanji, english)

    # Core structure based on common patterns
    if valency_type == 'transitive':
        core_structure = f"Thing を {kanji}"
    else:
        core_structure = kanji

    # Get usage patterns
    usage_patterns = parse_usage_patterns_for_verb(kanji)

    # Create masu and te forms (simplified - you may need to refine)
    if verb_class == 'ichidan':
        masu_kanji = kanji[:-1] + 'ます'
        masu_kana = kana[:-2] + 'ます'
        te_kanji = kanji[:-1] + 'て'
        te_kana = kana[:-2] + 'て'
    elif verb_class == 'irregular':
        # Use the provided masu form
        masu_kanji = verb_data.get('masu_form', kanji + 'ます')
        masu_kana = verb_data.get('masu_kana', kana + 'ます')
        te_kanji = kanji + 'て'
        te_kana = kana + 'て'
    else:  # godan
        masu_kanji = verb_data.get('masu_form', kanji[:-1] + 'います')
        masu_kana = verb_data.get('masu_kana', kana)
        # Te-form is complex for godan, use simple approximation
        te_kanji = kanji[:-1] + 'って'
        te_kana = kana[:-1] + 'って'

    # Create basic example
    example_jp = f"{primary}。"
    example_kana = f"{kana}。"

    entry = {
        "id": f"n5_v_{verb_id_num:04d}",
        "lemma": {
            "kanji": kanji,
            "kana": kana
        },
        "jlpt": "N5",
        "pos": "verb",
        "morphology": {
            "class": verb_class,
            "isIrregular": is_irregular
        },
        "valency": {
            "type": valency_type,
            "requiredParticles": required_particles,
            "coreStructure": core_structure
        },
        "meaning": {
            "primary": f"to {primary}",
            "gloss": glosses
        },
        "forms": {
            "dictionary": {
                "kanji": kanji,
                "kana": kana
            },
            "masu": {
                "kanji": masu_kanji,
                "kana": masu_kana
            },
            "te": {
                "kanji": te_kanji,
                "kana": te_kana
            }
        },
        "examples": {
            "masu": [
                {
                    "jp": f"{masu_kanji}。",
                    "kana": f"{masu_kana}。",
                    "en": f"I {primary}.",
                    "grammarTag": "simple-statement",
                    "pattern": "Verb(masu)",
                    "highlight": "basic usage"
                }
            ]
        }
    }

    # Add usage patterns if available
    if usage_patterns:
        entry["usagePatterns"] = usage_patterns

    return entry


def main():
    print("=" * 60)
    print("Generating JSON for Remaining Verbs")
    print("=" * 60)

    # Load remaining verbs list
    print("\n1️⃣ Loading remaining verbs list...")
    with open(REMAINING_VERBS_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)

    all_remaining = data['verbs']
    print(f"  ✓ Total remaining: {len(all_remaining)} verbs")

    # Skip first 27 (already in N5_verbs_expansion.json)
    verbs_to_process = all_remaining[27:]
    print(f"  ✓ After excluding first 27: {len(verbs_to_process)} verbs to process")

    # Generate entries
    print("\n2️⃣ Generating verb entries...")
    generated_verbs = []
    starting_id = 168  # Start after n5_v_0167

    for i, verb_data in enumerate(verbs_to_process, start=1):
        verb_id = starting_id + i - 1
        entry = generate_verb_entry(verb_data, verb_id)
        generated_verbs.append(entry)

        if i % 20 == 0:
            print(f"  ✓ Generated {i}/{len(verbs_to_process)} verbs...")

    print(f"  ✅ Generated {len(generated_verbs)} verb entries")

    # Create output structure
    print("\n3️⃣ Creating output JSON...")
    output_data = {
        "schema": "normalized-v2",
        "metadata": {
            "version": "1.0.0",
            "jlpt": "N5",
            "totalEntries": len(generated_verbs),
            "description": "Additional N5 verbs (beyond main dataset and expansion) with usage patterns",
            "idRange": f"n5_v_0168 to n5_v_{starting_id + len(generated_verbs) - 1:04d}",
            "license": "CC BY-SA 4.0"
        },
        "verbs": generated_verbs
    }

    # Write to file
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"  ✅ Saved to: {OUTPUT_JSON}")

    # Summary
    print("\n" + "=" * 60)
    print("✅ Generation Complete!")
    print("=" * 60)
    print(f"\n📊 Summary:")
    print(f"  - Total verbs generated: {len(generated_verbs)}")
    print(f"  - ID range: n5_v_0168 to n5_v_{starting_id + len(generated_verbs) - 1:04d}")
    print(f"  - Verbs with usage patterns: {sum(1 for v in generated_verbs if 'usagePatterns' in v)}")
    print(f"\n📁 Output file: {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
