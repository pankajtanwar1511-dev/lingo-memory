#!/usr/bin/env python3
"""
Process KanjiVG SVG files for N5 kanji.

This script:
1. Reads N5 kanji list
2. Finds corresponding SVG files from KanjiVG
3. Copies SVG files to public/kanji/strokes/
4. Extracts stroke count and paths for animation
5. Outputs: data/kanji/processed/kanjivg_n5.json

Usage:
    python 02_process_kanjivg.py
"""

import json
import shutil
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime

# Paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
RAW_DIR = PROJECT_ROOT / "data" / "kanji" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "kanji" / "processed"
PUBLIC_STROKES_DIR = PROJECT_ROOT / "public" / "kanji" / "strokes"
KANJIVG_DIR = RAW_DIR / "kanjivg" / "kanji"
N5_LIST_JSON = RAW_DIR / "n5-kanji-list.json"
OUTPUT_JSON = PROCESSED_DIR / "kanjivg_n5.json"

def load_n5_kanji_list():
    """Load the list of N5 kanji characters."""
    print("📖 Loading N5 kanji list...")
    with open(N5_LIST_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)
    kanji_list = data['kanji']
    print(f"✅ Loaded {len(kanji_list)} N5 kanji")
    return kanji_list

def get_svg_filename(kanji_char):
    """Convert kanji character to KanjiVG filename format."""
    codepoint = ord(kanji_char)
    hex_code = f"{codepoint:05x}"
    return f"{hex_code}.svg"

def parse_svg_strokes(svg_path):
    """Parse SVG file and extract stroke paths."""
    try:
        tree = ET.parse(svg_path)
        root = tree.getroot()

        # Find all path elements (each path = one stroke)
        # KanjiVG uses namespace
        ns = {'svg': 'http://www.w3.org/2000/svg'}
        paths = root.findall('.//svg:path', ns)

        stroke_paths = []
        for path in paths:
            d = path.get('d')
            if d:
                stroke_paths.append(d)

        return {
            'count': len(stroke_paths),
            'paths': stroke_paths
        }
    except Exception as e:
        print(f"   ⚠️  Error parsing {svg_path.name}: {e}")
        return {'count': 0, 'paths': []}

def process_kanjivg_files(kanji_list):
    """Process KanjiVG SVG files for N5 kanji."""
    print(f"\n📖 Processing KanjiVG SVG files...")
    print(f"   Source: {KANJIVG_DIR}")
    print(f"   Destination: {PUBLIC_STROKES_DIR}")

    # Create public strokes directory
    PUBLIC_STROKES_DIR.mkdir(parents=True, exist_ok=True)

    kanji_data = []
    found_count = 0
    copied_count = 0

    for kanji_char in kanji_list:
        svg_filename = get_svg_filename(kanji_char)
        source_svg = KANJIVG_DIR / svg_filename
        dest_svg = PUBLIC_STROKES_DIR / svg_filename

        entry = {
            'kanji': kanji_char,
            'svgFilename': svg_filename,
            'svgPath': f"/kanji/strokes/{svg_filename}",
            'strokeCount': 0,
            'found': False
        }

        if source_svg.exists():
            found_count += 1
            entry['found'] = True

            # Parse SVG to get stroke count and paths
            stroke_data = parse_svg_strokes(source_svg)
            entry['strokeCount'] = stroke_data['count']
            # Don't store paths in JSON (too large) - generate client-side

            # Copy SVG file to public directory
            try:
                shutil.copy2(source_svg, dest_svg)
                copied_count += 1
            except Exception as e:
                print(f"   ⚠️  Error copying {svg_filename}: {e}")

        else:
            print(f"   ⚠️  Missing: {kanji_char} ({svg_filename})")

        kanji_data.append(entry)

        if (found_count + 1) % 20 == 0:
            print(f"   Processed {found_count}/{len(kanji_list)} kanji...")

    print(f"\n✅ Found {found_count}/{len(kanji_list)} SVG files")
    print(f"✅ Copied {copied_count} files to public/kanji/strokes/")

    if found_count < len(kanji_list):
        missing = [k for k in kanji_data if not k['found']]
        print(f"⚠️  Missing {len(missing)} SVG files:")
        for m in missing[:10]:
            print(f"      {m['kanji']} ({m['svgFilename']})")

    return kanji_data

def save_output(kanji_data):
    """Save processed KanjiVG data to JSON."""
    print(f"\n💾 Saving to: {OUTPUT_JSON}")

    output = {
        'metadata': {
            'source': 'KanjiVG',
            'sourceUrl': 'https://github.com/KanjiVG/kanjivg',
            'license': 'CC BY-SA 3.0',
            'processedAt': datetime.utcnow().isoformat() + 'Z',
            'totalKanji': len(kanji_data),
            'foundSvgFiles': sum(1 for k in kanji_data if k['found']),
            'script': '02_process_kanjivg.py'
        },
        'kanji': kanji_data
    }

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
    print("KanjiVG SVG Processor")
    print("=" * 60)

    # Load N5 kanji list
    kanji_list = load_n5_kanji_list()

    # Process KanjiVG files
    kanji_data = process_kanjivg_files(kanji_list)

    # Save output
    save_output(kanji_data)

    print("\n" + "=" * 60)
    print("✅ KanjiVG processing complete!")
    print("=" * 60)

if __name__ == '__main__':
    main()
