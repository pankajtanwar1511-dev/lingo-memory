#!/usr/bin/env python3
"""
Script to expand office vocabulary from current 361 to target 580 entries.
Parses japanese-office-vocabulary.md reference doc and generates missing entries.
"""

import json
import re
from pathlib import Path
from typing import List, Dict, Set

# Category mapping from reference doc to our schema
CATEGORY_MAPPING = {
    "Roles & Titles": "roles",
    "Departments & Divisions": "departments",
    "Workplace Facilities & Spaces": "facilities",
    "Office Supplies & Equipment": "supplies",
    "Documents & Paperwork": "documents",
    "Business Verbs & Actions": "verbs",
    "Meetings & Discussions": "meetings",
    "Time, Deadlines & Scheduling": "time",
    "Communication": "communication",
    "Finance, Budget & Accounting": "finance",
    "HR & Employment": "hr",
    "Business Etiquette & Culture": "culture",
    "Keigo — Verb Substitutions": "keigo",
    "Keigo — Set Phrases & Greetings": "keigo",
    "Project Management": "project",
    "Customers & Client Relations": "clients",
    "Technology & IT": "tech",
    "Presentations & Data": "presentations",
    "Engineering & Technical Operations": "engineering",
    "High-Frequency Workplace Phrases": "communication",
    "Incident / Trouble / Escalation": "incident",
    "General Vocabulary": "general"
}

# Freq tier mapping
FREQ_MAPPING = {
    "S": "S",
    "A": "A",
    "B": "B",
    "C": "C"
}

def parse_reference_doc(file_path: Path) -> List[Dict]:
    """Parse japanese-office-vocabulary.md and extract all entries."""
    entries = []
    current_category = None

    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Detect category headers
        if line.startswith('## Category') and '—' in line:
            # Extract category name after "—"
            parts = line.split('—', 1)
            if len(parts) == 2:
                current_category = parts[1].strip()
            i += 1
            continue

        # Parse table rows (starts with |)
        if line.startswith('|') and current_category and '|---|' not in line:
            parts = [p.strip() for p in line.split('|')]
            # Valid entry row has at least 9 columns
            if len(parts) >= 9 and parts[1] and parts[1] != 'Kanji':
                try:
                    kanji = parts[1].replace('★', '').strip()
                    kana = parts[2].strip()
                    romaji = parts[3].strip()
                    english = parts[4].strip()
                    jlpt = parts[5].strip()
                    active_passive = parts[6].strip()
                    freq = parts[7].strip()
                    notes = parts[8].strip() if len(parts) > 8 else ""

                    # Skip if kanji is empty or a header
                    if not kanji or kanji in ['Kanji', '---']:
                        i += 1
                        continue

                    # Determine active/passive
                    active = '🔵' in active_passive

                    # Map category
                    mapped_category = CATEGORY_MAPPING.get(current_category, "general")

                    # Map tier
                    tier = FREQ_MAPPING.get(freq, "B")

                    # Extract contexts from notes
                    contexts = []
                    context_tags = re.findall(r'\[([\w\-]+)\]', notes)
                    for tag in context_tags:
                        if tag in ['slack', 'standup', 'email', 'meeting', 'incident', '1on1', 'hr', 'client', 'engineering', 'board']:
                            contexts.append(tag)

                    # Default contexts if none found
                    if not contexts:
                        if mapped_category == 'verbs':
                            contexts = ['standup', 'email']
                        elif mapped_category == 'meetings':
                            contexts = ['meeting']
                        elif mapped_category == 'incident':
                            contexts = ['incident']
                        else:
                            contexts = ['email']

                    # Split English meanings
                    meanings = [m.strip() for m in english.split('/')]

                    entry = {
                        'kanji': kanji,
                        'kana': kana,
                        'romaji': romaji,
                        'meaning': meanings,
                        'category': mapped_category,
                        'active': active,
                        'tier': tier,
                        'contexts': contexts[:3],  # Max 3 contexts
                        'notes': notes,
                        'ref_category': current_category
                    }

                    entries.append(entry)
                except (IndexError, ValueError) as e:
                    # Skip malformed rows
                    pass

        i += 1

    return entries

def load_current_vocabulary(file_path: Path) -> List[Dict]:
    """Load current office_vocabulary.json."""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data['entries']

def find_missing_entries(reference_entries: List[Dict], current_entries: List[Dict]) -> List[Dict]:
    """Find entries in reference that are missing from current vocabulary."""
    # Create a set of current kanji for fast lookup
    current_kanji = {e['kanji'] for e in current_entries}

    missing = []
    for ref_entry in reference_entries:
        if ref_entry['kanji'] not in current_kanji:
            missing.append(ref_entry)

    return missing

def create_example_sentence(entry: Dict) -> Dict:
    """Generate a placeholder example sentence for an entry."""
    kanji = entry['kanji']
    kana = entry['kana']
    english_meaning = entry['meaning'][0]

    # Simple templates based on part of speech
    if entry['category'] == 'verbs' or 'する' in kanji:
        japanese = f"{kanji}を予定しています。"
        kana_example = f"{kana}をよていしています。"
        english = f"I plan to {english_meaning.lower()}."
    elif entry['category'] in ['documents', 'supplies']:
        japanese = f"{kanji}が必要です。"
        kana_example = f"{kana}がひつようです。"
        english = f"{english_meaning} is needed."
    elif entry['category'] in ['roles', 'departments']:
        japanese = f"{kanji}に確認します。"
        kana_example = f"{kana}にかくにんします。"
        english = f"I will check with {english_meaning.lower()}."
    elif entry['category'] in ['facilities']:
        japanese = f"{kanji}を予約しました。"
        kana_example = f"{kana}をよやくしました。"
        english = f"I reserved the {english_meaning.lower()}."
    else:
        japanese = f"{kanji}について説明します。"
        kana_example = f"{kana}についてせつめいします。"
        english = f"I will explain about {english_meaning.lower()}."

    return {
        "japanese": japanese,
        "kana": kana_example,
        "english": english
    }

def generate_vocabulary_entries(missing_entries: List[Dict], start_id: int) -> List[Dict]:
    """Generate properly formatted vocabulary entries."""
    formatted_entries = []

    for i, entry in enumerate(missing_entries):
        vocab_id = f"office-{start_id + i:03d}"

        # Determine part of speech
        if 'する' in entry['kanji']:
            part_of_speech = ["verb"]
        elif entry['category'] in ['verbs']:
            part_of_speech = ["verb"]
        elif entry['category'] in ['roles', 'departments']:
            part_of_speech = ["noun"]
        else:
            part_of_speech = ["noun"]

        formatted_entry = {
            "id": vocab_id,
            "kanji": entry['kanji'],
            "kana": entry['kana'],
            "romaji": entry['romaji'],
            "meaning": entry['meaning'],
            "partOfSpeech": part_of_speech,
            "active": entry['active'],
            "tier": entry['tier'],
            "contexts": entry['contexts'],
            "category": entry['category'],
            "example": create_example_sentence(entry)
        }

        formatted_entries.append(formatted_entry)

    return formatted_entries

def main():
    """Main execution function."""
    base_dir = Path(__file__).parent.parent
    ref_doc = base_dir / "docs" / "japanese-office-vocabulary.md"
    current_vocab = base_dir / "public" / "seed-data" / "office_vocabulary.json"

    print("📖 Parsing reference documentation...")
    reference_entries = parse_reference_doc(ref_doc)
    print(f"   Found {len(reference_entries)} entries in reference doc")

    print("\n📚 Loading current vocabulary...")
    current_entries = load_current_vocabulary(current_vocab)
    print(f"   Current vocabulary has {len(current_entries)} entries")

    print("\n🔍 Identifying missing entries...")
    missing_entries = find_missing_entries(reference_entries, current_entries)
    print(f"   Found {len(missing_entries)} missing entries")

    if not missing_entries:
        print("\n✅ No missing entries! Vocabulary is already complete.")
        return

    # Determine starting ID
    current_ids = [int(e['id'].split('-')[1]) for e in current_entries]
    next_id = max(current_ids) + 1

    print(f"\n🎯 Generating new entries starting from office-{next_id:03d}...")
    new_entries = generate_vocabulary_entries(missing_entries, next_id)

    # Calculate target total
    target_total = 580
    current_total = len(current_entries)
    available_new = len(new_entries)

    # Trim to reach exactly 580
    entries_needed = target_total - current_total
    if entries_needed < len(new_entries):
        print(f"\n⚠️  Reference has {len(new_entries)} missing entries, but we only need {entries_needed} to reach 580")
        new_entries = new_entries[:entries_needed]

    print(f"\n📦 Dividing {len(new_entries)} entries into parts (~45 entries each)...")

    # Divide into parts
    part_size = 45
    parts = []
    for i in range(0, len(new_entries), part_size):
        part_entries = new_entries[i:i+part_size]
        part_num = (i // part_size) + 11  # Start from Part 11
        parts.append((part_num, part_entries))

    # Write part files
    output_dir = base_dir / "public" / "seed-data"
    for part_num, part_entries in parts:
        part_file = output_dir / f"office_vocabulary_part{part_num}.json"
        part_data = {
            "schema": "office-v2",
            "entries": part_entries
        }

        with open(part_file, 'w', encoding='utf-8') as f:
            json.dump(part_data, f, ensure_ascii=False, indent=2)

        start_id = part_entries[0]['id']
        end_id = part_entries[-1]['id']
        print(f"   ✅ Part {part_num}: {len(part_entries)} entries ({start_id} to {end_id})")
        print(f"      → {part_file.name}")

    # Print summary by category
    print("\n📊 New entries by category:")
    from collections import Counter
    category_counts = Counter(e['category'] for e in new_entries)
    for category, count in sorted(category_counts.items(), key=lambda x: -x[1]):
        print(f"   {category:20s}: {count:3d} entries")

    print(f"\n✨ Complete! Created {len(parts)} part files.")
    print(f"   Current total: {current_total} → Target total: {current_total + len(new_entries)} entries")
    print(f"\n📋 Next steps:")
    print(f"   1. Review each part file for quality")
    print(f"   2. Submit to ChatGPT for linguistic review")
    print(f"   3. Apply fixes to part files")
    print(f"   4. Merge into office_vocabulary.json")

if __name__ == "__main__":
    main()
