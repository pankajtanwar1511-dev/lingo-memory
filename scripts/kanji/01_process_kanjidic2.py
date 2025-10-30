#!/usr/bin/env python3
"""
Process KANJIDIC2 XML to extract N5 kanji data.

This script:
1. Parses KANJIDIC2 XML file (15MB)
2. Filters to N5 kanji only (80 entries)
3. Extracts: meanings, readings, stroke count, grade, frequency, radical
4. Outputs: data/kanji/processed/kanjidic2_n5.json

Usage:
    python 01_process_kanjidic2.py
"""

import json
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime

# Paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
RAW_DIR = PROJECT_ROOT / "data" / "kanji" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "kanji" / "processed"
KANJIDIC2_XML = RAW_DIR / "kanjidic2.xml"
N5_LIST_JSON = RAW_DIR / "n5-kanji-list.json"
OUTPUT_JSON = PROCESSED_DIR / "kanjidic2_n5.json"

def load_n5_kanji_list():
    """Load the list of N5 kanji characters."""
    print("📖 Loading N5 kanji list...")
    with open(N5_LIST_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)
    kanji_list = data['kanji']
    print(f"✅ Loaded {len(kanji_list)} N5 kanji")
    return set(kanji_list)

def parse_kanjidic2(n5_kanji_set):
    """Parse KANJIDIC2 XML and extract N5 kanji data."""
    print(f"\n📖 Parsing KANJIDIC2 XML file: {KANJIDIC2_XML}")
    print("   (This may take 10-15 seconds...)")

    tree = ET.parse(KANJIDIC2_XML)
    root = tree.getroot()

    kanji_data = []
    found_count = 0
    total_entries = len(root.findall('character'))

    print(f"   Total entries in KANJIDIC2: {total_entries}")

    for char_elem in root.findall('character'):
        # Get the kanji character
        literal_elem = char_elem.find('literal')
        if literal_elem is None:
            continue

        kanji_char = literal_elem.text

        # Only process N5 kanji
        if kanji_char not in n5_kanji_set:
            continue

        found_count += 1

        # Extract data
        entry = {
            'kanji': kanji_char,
            'meanings': [],
            'onReadings': [],
            'kunReadings': [],
            'strokeCount': None,
            'grade': None,
            'frequency': None,
            'radical': None
        }

        # Stroke count
        misc = char_elem.find('misc')
        if misc is not None:
            stroke_elem = misc.find('stroke_count')
            if stroke_elem is not None:
                entry['strokeCount'] = int(stroke_elem.text)

            grade_elem = misc.find('grade')
            if grade_elem is not None:
                entry['grade'] = int(grade_elem.text)

            freq_elem = misc.find('freq')
            if freq_elem is not None:
                entry['frequency'] = int(freq_elem.text)

        # Radical (classical radical)
        radical_elem = char_elem.find('.//radical[@rad_type="classical"]')
        if radical_elem is not None:
            entry['radical'] = int(radical_elem.text)

        # Readings
        reading_meaning = char_elem.find('reading_meaning')
        if reading_meaning is not None:
            rmgroup = reading_meaning.find('rmgroup')
            if rmgroup is not None:
                # Meanings (English only)
                for meaning_elem in rmgroup.findall('meaning'):
                    if meaning_elem.get('m_lang') is None:  # No lang attribute = English
                        entry['meanings'].append(meaning_elem.text.lower())

                # Readings
                for reading_elem in rmgroup.findall('reading'):
                    r_type = reading_elem.get('r_type')
                    if r_type == 'ja_on':
                        entry['onReadings'].append(reading_elem.text)
                    elif r_type == 'ja_kun':
                        # Remove okurigana marker (dot)
                        reading = reading_elem.text.replace('.', '')
                        entry['kunReadings'].append(reading)

        kanji_data.append(entry)

        if found_count % 10 == 0:
            print(f"   Processed {found_count}/{len(n5_kanji_set)} N5 kanji...")

    print(f"✅ Found {found_count}/{len(n5_kanji_set)} N5 kanji in KANJIDIC2")

    if found_count < len(n5_kanji_set):
        missing = n5_kanji_set - {entry['kanji'] for entry in kanji_data}
        print(f"⚠️  Missing {len(missing)} kanji: {', '.join(sorted(missing))}")

    return kanji_data

def save_output(kanji_data):
    """Save processed data to JSON."""
    print(f"\n💾 Saving to: {OUTPUT_JSON}")

    output = {
        'metadata': {
            'source': 'KANJIDIC2',
            'sourceUrl': 'http://www.edrdg.org/wiki/index.php/KANJIDIC_Project',
            'license': 'CC BY-SA 4.0',
            'processedAt': datetime.utcnow().isoformat() + 'Z',
            'totalKanji': len(kanji_data),
            'script': '01_process_kanjidic2.py'
        },
        'kanji': sorted(kanji_data, key=lambda x: x['strokeCount'] or 999)
    }

    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"✅ Saved {len(kanji_data)} kanji entries")

    # Print sample
    print("\n📊 Sample entry (日):")
    sample = next((k for k in kanji_data if k['kanji'] == '日'), None)
    if sample:
        print(json.dumps(sample, ensure_ascii=False, indent=2))

def main():
    print("=" * 60)
    print("KANJIDIC2 N5 Kanji Processor")
    print("=" * 60)

    # Load N5 kanji list
    n5_kanji_set = load_n5_kanji_list()

    # Parse KANJIDIC2
    kanji_data = parse_kanjidic2(n5_kanji_set)

    # Save output
    save_output(kanji_data)

    print("\n" + "=" * 60)
    print("✅ KANJIDIC2 processing complete!")
    print("=" * 60)

if __name__ == '__main__':
    main()
