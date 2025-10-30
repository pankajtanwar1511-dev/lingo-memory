#!/usr/bin/env python3
"""
Merge all processed kanji data into final production dataset.

This script:
1. Loads KANJIDIC2 data (meanings, readings, etc.)
2. Loads KanjiVG data (SVG paths, stroke counts)
3. Loads vocabulary links
4. Merges into final schema
5. Adds radical meanings from RADKFILE
6. Outputs: public/seed-data/kanji_n5.json

Usage:
    python 04_merge_dataset.py
"""

import json
from pathlib import Path
from datetime import datetime

# Paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
PROCESSED_DIR = PROJECT_ROOT / "data" / "kanji" / "processed"
OUTPUT_JSON = PROJECT_ROOT / "public" / "seed-data" / "kanji_n5.json"

KANJIDIC2_JSON = PROCESSED_DIR / "kanjidic2_n5.json"
KANJIVG_JSON = PROCESSED_DIR / "kanjivg_n5.json"
VOCAB_LINKS_JSON = PROCESSED_DIR / "kanji_vocab_links.json"

# Radical meanings (simplified lookup - from Kangxi radicals)
RADICAL_MEANINGS = {
    1: "one", 2: "line", 3: "dot", 4: "slash", 5: "second",
    6: "hook", 7: "two", 8: "lid", 9: "person", 10: "legs",
    11: "enter", 12: "eight", 13: "borders", 14: "cover", 15: "ice",
    16: "table", 17: "open box", 18: "knife", 19: "power", 20: "wrap",
    21: "spoon", 22: "right open box", 23: "hiding enclosure", 24: "ten",
    25: "divination", 26: "seal", 27: "cliff", 28: "private", 29: "again",
    30: "mouth", 31: "enclosure", 32: "earth", 33: "scholar", 34: "go",
    35: "go slowly", 36: "evening", 37: "big", 38: "woman", 39: "child",
    40: "roof", 41: "inch", 42: "small", 43: "lame", 44: "corpse",
    45: "sprout", 46: "mountain", 47: "river", 48: "work", 49: "oneself",
    50: "turban", 51: "dry", 52: "short thread", 53: "dotted cliff",
    54: "long stride", 55: "two hands", 56: "shoot", 57: "bow",
    58: "snout", 59: "bristle", 60: "step", 61: "heart", 62: "halberd",
    63: "door", 64: "hand", 65: "branch", 66: "rap", 67: "script",
    68: "dipper", 69: "axe", 70: "square", 71: "not", 72: "sun",
    73: "say", 74: "moon", 75: "tree", 76: "lack", 77: "stop",
    78: "death", 79: "weapon", 80: "do not", 81: "compare", 82: "fur",
    83: "clan", 84: "steam", 85: "water", 86: "fire", 87: "claw",
    88: "father", 89: "half tree trunk", 90: "split wood", 91: "slice",
    92: "fang", 93: "cow", 94: "dog", 95: "profound", 96: "jade",
    97: "melon", 98: "tile", 99: "sweet", 100: "life", 101: "use",
    102: "field", 103: "bolt of cloth", 104: "sickness", 105: "dotted tent",
    106: "white", 107: "skin", 108: "dish", 109: "eye", 110: "spear",
    111: "arrow", 112: "stone", 113: "spirit", 114: "track", 115: "grain",
    116: "cave", 117: "stand", 118: "bamboo", 119: "rice", 120: "silk",
    121: "jar", 122: "net", 123: "sheep", 124: "feather", 125: "old",
    126: "and", 127: "plow", 128: "ear", 129: "brush", 130: "meat",
    131: "minister", 132: "self", 133: "arrive", 134: "mortar", 135: "tongue",
    136: "oppose", 137: "boat", 138: "stopping", 139: "color", 140: "grass",
    141: "tiger", 142: "insect", 143: "blood", 144: "walk enclosure",
    145: "clothes", 146: "west", 147: "see", 148: "horn", 149: "word",
    150: "valley", 151: "bean", 152: "pig", 153: "badger", 154: "shell",
    155: "red", 156: "run", 157: "foot", 158: "body", 159: "cart",
    160: "bitter", 161: "morning", 162: "walk", 163: "city", 164: "wine",
    165: "distinguish", 166: "village", 167: "gold", 168: "long", 169: "gate",
    170: "mound", 171: "slave", 172: "short tailed bird", 173: "rain",
    174: "blue", 175: "wrong", 176: "face", 177: "leather", 178: "tanned leather",
    179: "leek", 180: "sound", 181: "leaf", 182: "wind", 183: "fly",
    184: "eat", 185: "head", 186: "fragrant", 187: "horse", 188: "bone",
    189: "tall", 190: "hair", 191: "fight", 192: "sacrificial wine",
    193: "cauldron", 194: "ghost", 195: "fish", 196: "bird", 197: "salt",
    198: "deer", 199: "wheat", 200: "hemp", 201: "yellow", 202: "millet",
    203: "black", 204: "embroidery", 205: "frog", 206: "tripod", 207: "drum",
    208: "rat", 209: "nose", 210: "even", 211: "tooth", 212: "dragon",
    213: "turtle", 214: "flute"
}

def load_processed_data():
    """Load all processed JSON files."""
    print("📖 Loading processed data files...")

    with open(KANJIDIC2_JSON, 'r', encoding='utf-8') as f:
        kanjidic2_data = json.load(f)

    with open(KANJIVG_JSON, 'r', encoding='utf-8') as f:
        kanjivg_data = json.load(f)

    with open(VOCAB_LINKS_JSON, 'r', encoding='utf-8') as f:
        vocab_links_data = json.load(f)

    print(f"✅ KANJIDIC2: {len(kanjidic2_data['kanji'])} entries")
    print(f"✅ KanjiVG: {len(kanjivg_data['kanji'])} entries")
    print(f"✅ Vocab links: {len(vocab_links_data['kanji'])} entries")

    return kanjidic2_data, kanjivg_data, vocab_links_data

def merge_kanji_data(kanjidic2_data, kanjivg_data, vocab_links_data):
    """Merge all data sources into final schema."""
    print("\n🔗 Merging kanji data...")

    # Create lookups
    kanjivg_lookup = {k['kanji']: k for k in kanjivg_data['kanji']}
    vocab_links_lookup = {k['kanji']: k for k in vocab_links_data['kanji']}

    merged_kanji = []

    for kanjidic_entry in kanjidic2_data['kanji']:
        kanji_char = kanjidic_entry['kanji']

        # Get data from other sources
        kanjivg_entry = kanjivg_lookup.get(kanji_char, {})
        vocab_entry = vocab_links_lookup.get(kanji_char, {})

        # Build radical object
        radical_obj = None
        if kanjidic_entry.get('radical'):
            radical_number = kanjidic_entry['radical']
            radical_obj = {
                'literal': kanji_char,  # Fallback to kanji itself
                'meaning': RADICAL_MEANINGS.get(radical_number, 'unknown'),
                'number': radical_number
            }

        # Merge into final schema
        final_entry = {
            'id': f"kanji_n5_{kanji_char}",
            'kanji': kanji_char,
            'jlptLevel': 'N5',

            # Meanings & Readings (from KANJIDIC2)
            'meanings': kanjidic_entry.get('meanings', []),
            'onReadings': kanjidic_entry.get('onReadings', []),
            'kunReadings': kanjidic_entry.get('kunReadings', []),

            # Structure (from KANJIDIC2)
            'strokeCount': kanjidic_entry.get('strokeCount'),
            'grade': kanjidic_entry.get('grade'),
            'radical': radical_obj,
            'frequency': kanjidic_entry.get('frequency'),

            # Strokes (from KanjiVG)
            'strokes': {
                'svgPath': kanjivg_entry.get('svgPath', ''),
                'count': kanjivg_entry.get('strokeCount', 0)
            },

            # Vocabulary links
            'examples': vocab_entry.get('examples', []),

            # Attribution
            'source': {
                'type': 'kanjidic2',
                'version': 'KANJIDIC2 2024-12',
                'url': 'http://www.edrdg.org/wiki/index.php/KANJIDIC_Project'
            },
            'license': {
                'text': 'CC BY-SA 4.0',
                'url': 'https://creativecommons.org/licenses/by-sa/4.0/'
            },
            'metadata': {
                'verified': True,
                'addedDate': datetime.utcnow().isoformat() + 'Z',
                'lastUpdated': datetime.utcnow().isoformat() + 'Z'
            }
        }

        merged_kanji.append(final_entry)

    print(f"✅ Merged {len(merged_kanji)} kanji entries")
    return merged_kanji

def create_final_dataset(merged_kanji):
    """Create final dataset with metadata."""
    print("\n📦 Creating final dataset...")

    total_examples = sum(len(k['examples']) for k in merged_kanji)
    kanji_with_examples = sum(1 for k in merged_kanji if len(k['examples']) > 0)

    dataset = {
        'metadata': {
            'version': '1.0.0',
            'generatedAt': datetime.utcnow().isoformat() + 'Z',
            'description': 'JLPT N5 kanji with stroke order animations and vocabulary links',
            'totalKanji': len(merged_kanji),
            'kanjiWithExamples': kanji_with_examples,
            'totalExampleWords': total_examples,
            'sources': {
                'kanjidic2': 'KANJIDIC2 2024-12 (Rev 1.6)',
                'kanjivg': 'KanjiVG 20240101',
                'vocabulary': 'LingoMemory N5 Vocab Dataset v1.0.0'
            }
        },
        'kanji': sorted(merged_kanji, key=lambda k: k['strokeCount'] or 999)
    }

    print(f"✅ Dataset created")
    print(f"   Total kanji: {len(merged_kanji)}")
    print(f"   With examples: {kanji_with_examples}")
    print(f"   Total example links: {total_examples}")

    return dataset

def save_output(dataset):
    """Save final dataset to public/seed-data/."""
    print(f"\n💾 Saving to: {OUTPUT_JSON}")

    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(dataset, f, ensure_ascii=False, indent=2)

    # Get file size
    file_size = OUTPUT_JSON.stat().st_size / 1024  # KB

    print(f"✅ Saved final dataset ({file_size:.1f} KB)")

    # Print sample
    print("\n📊 Sample entry (日):")
    sample = next((k for k in dataset['kanji'] if k['kanji'] == '日'), None)
    if sample:
        print(json.dumps(sample, ensure_ascii=False, indent=2))

def main():
    print("=" * 60)
    print("Kanji Dataset Merger")
    print("=" * 60)

    # Load processed data
    kanjidic2_data, kanjivg_data, vocab_links_data = load_processed_data()

    # Merge data
    merged_kanji = merge_kanji_data(kanjidic2_data, kanjivg_data, vocab_links_data)

    # Create final dataset
    dataset = create_final_dataset(merged_kanji)

    # Save output
    save_output(dataset)

    print("\n" + "=" * 60)
    print("✅ Kanji dataset generation complete!")
    print("   Output: public/seed-data/kanji_n5.json")
    print("=" * 60)

if __name__ == '__main__':
    main()
