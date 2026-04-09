#!/usr/bin/env python3
"""
Analyze kanji.md document structure and extract kanji data
"""

import re
from pathlib import Path
from collections import defaultdict

def parse_kanji_md(filepath):
    """Parse the kanji.md file and extract structured data"""

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.strip().split('\n')

    # Track what we find
    lessons = []
    kanji_entries = []
    current_kanji = None

    # Patterns
    lesson_pattern = re.compile(r'★もじ(\d+)')
    kanji_main = re.compile(r'^[一-龯]$')  # Single kanji character
    kun_pattern = re.compile(r'くん[：:](.*)')
    on_pattern = re.compile(r'おん[：:](.*)')
    meaning_pattern = re.compile(r'meaning[：:]?\s*(.*)', re.IGNORECASE)

    current_lesson = None
    kanji_count = 0

    for i, line in enumerate(lines):
        line = line.strip()

        # Check for lesson marker
        lesson_match = lesson_pattern.search(line)
        if lesson_match:
            lesson_num = lesson_match.group(1)
            current_lesson = f"Lesson {lesson_num}"
            lessons.append({
                'number': lesson_num,
                'line': i + 1,
                'kanji': []
            })
            continue

        # Check if line is a single kanji character
        if kanji_main.match(line):
            kanji_count += 1
            current_kanji = {
                'kanji': line,
                'kun': None,
                'on': None,
                'meaning': None,
                'examples': [],
                'line': i + 1,
                'lesson': current_lesson
            }
            kanji_entries.append(current_kanji)
            if lessons:
                lessons[-1]['kanji'].append(line)
            continue

        # Extract readings and meanings if we have a current kanji
        if current_kanji:
            kun_match = kun_pattern.search(line)
            if kun_match:
                current_kanji['kun'] = kun_match.group(1).strip()

            on_match = on_pattern.search(line)
            if on_match:
                current_kanji['on'] = on_match.group(1).strip()

            meaning_match = meaning_pattern.search(line)
            if meaning_match:
                current_kanji['meaning'] = meaning_match.group(1).strip()

    return {
        'total_lines': len(lines),
        'lessons': lessons,
        'kanji_entries': kanji_entries,
        'kanji_count': kanji_count
    }

def print_analysis(data):
    """Print detailed analysis"""

    print("=" * 80)
    print("KANJI.MD DOCUMENT ANALYSIS")
    print("=" * 80)
    print()

    print(f"📄 DOCUMENT STATS")
    print(f"   Total lines: {data['total_lines']}")
    print(f"   Total lessons: {len(data['lessons'])}")
    print(f"   Total kanji found: {data['kanji_count']}")
    print()

    print("=" * 80)
    print("LESSONS BREAKDOWN")
    print("=" * 80)
    print()

    for lesson in data['lessons']:
        print(f"📚 Lesson {lesson['number']} (Line {lesson['line']})")
        print(f"   Kanji: {', '.join(lesson['kanji']) if lesson['kanji'] else '(no kanji detected)'}")
        print(f"   Count: {len(lesson['kanji'])}")
        print()

    print("=" * 80)
    print("ALL KANJI ENTRIES")
    print("=" * 80)
    print()

    # Group by lesson
    by_lesson = defaultdict(list)
    for entry in data['kanji_entries']:
        by_lesson[entry['lesson']].append(entry)

    for lesson in sorted(by_lesson.keys()):
        print(f"\n{lesson}:")
        print("-" * 80)
        for entry in by_lesson[lesson]:
            print(f"  {entry['kanji']} (Line {entry['line']})")
            if entry['kun']:
                print(f"    Kun: {entry['kun']}")
            if entry['on']:
                print(f"    On: {entry['on']}")
            if entry['meaning']:
                print(f"    Meaning: {entry['meaning']}")
            print()

    print("=" * 80)
    print("UNIQUE KANJI LIST")
    print("=" * 80)
    print()

    unique_kanji = list(dict.fromkeys([k['kanji'] for k in data['kanji_entries']]))
    print(f"Total unique kanji: {len(unique_kanji)}")
    print()

    # Print in grid
    for i in range(0, len(unique_kanji), 10):
        chunk = unique_kanji[i:i+10]
        print("  " + "  ".join(chunk))
    print()

    print("=" * 80)
    print("COMPARISON WITH APP KANJI_N5.JSON")
    print("=" * 80)
    print()

    # Load app's kanji data
    app_kanji_path = Path("public/seed-data/kanji_n5.json")
    if app_kanji_path.exists():
        import json
        with open(app_kanji_path, 'r', encoding='utf-8') as f:
            app_data = json.load(f)

        app_kanji_list = [k['kanji'] for k in app_data['kanji']]

        print(f"App kanji count: {len(app_kanji_list)}")
        print(f"Document kanji count: {len(unique_kanji)}")
        print()

        # Find kanji in document but not in app
        in_doc_not_app = [k for k in unique_kanji if k not in app_kanji_list]
        in_app_not_doc = [k for k in app_kanji_list if k not in unique_kanji]

        if in_doc_not_app:
            print(f"✨ Kanji in document but NOT in app ({len(in_doc_not_app)}):")
            print("   " + ", ".join(in_doc_not_app))
            print()
        else:
            print("✅ All document kanji are in the app")
            print()

        if in_app_not_doc:
            print(f"📱 Kanji in app but NOT in document ({len(in_app_not_doc)}):")
            # Show first 20
            print("   " + ", ".join(in_app_not_doc[:20]))
            if len(in_app_not_doc) > 20:
                print(f"   ... and {len(in_app_not_doc) - 20} more")
            print()

        # Calculate overlap
        overlap = len([k for k in unique_kanji if k in app_kanji_list])
        if len(unique_kanji) > 0:
            coverage = (overlap / len(unique_kanji)) * 100
            print(f"📊 Coverage: {overlap}/{len(unique_kanji)} kanji in document are in app ({coverage:.1f}%)")
    else:
        print("⚠️  Could not find app kanji data at public/seed-data/kanji_n5.json")

    print()
    print("=" * 80)

def main():
    filepath = Path("/home/pankaj/Downloads/kanji.md/kanji.md")

    if not filepath.exists():
        print(f"Error: File not found at {filepath}")
        return

    print("Loading and parsing kanji.md...")
    data = parse_kanji_md(filepath)

    print_analysis(data)

if __name__ == "__main__":
    main()
