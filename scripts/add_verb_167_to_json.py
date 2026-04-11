#!/usr/bin/env python3
"""
Add placeholder n5_v_0167 to N5_verbs_dataset_2.json
"""

import json

def add_placeholder_verb_167():
    """Add placeholder verb 167 to the extended dataset"""

    filepath = '/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset_2.json'

    # Read the dataset
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Create placeholder entry matching the structure
    placeholder = {
        "id": "n5_v_0167",
        "lemma": {
            "kanji": "[未定]",
            "kana": "みてい"
        },
        "jlpt": "N5",
        "pos": "verb",
        "morphology": {
            "class": "placeholder",
            "isIrregular": False
        },
        "valency": {
            "type": "placeholder",
            "requiredParticles": [],
            "coreStructure": "[未定]"
        },
        "meaning": {
            "primary": "PLACEHOLDER - missing verb",
            "gloss": [
                "placeholder",
                "missing verb entry"
            ]
        },
        "forms": {
            "dictionary": {
                "kanji": "[未定]",
                "kana": "みてい"
            },
            "masu": {
                "kanji": "[未定]ます",
                "kana": "みています"
            },
            "te": {
                "kanji": "[未定]て",
                "kana": "みていて"
            },
            "nai": {
                "kanji": "[未定]ない",
                "kana": "みていない"
            },
            "past": {
                "kanji": "[未定]た",
                "kana": "みていた"
            },
            "potential": {
                "kanji": "[未定]られる",
                "kana": "みていられる"
            },
            "passive": {
                "kanji": "[未定]られる",
                "kana": "みていられる"
            },
            "causative": {
                "kanji": "[未定]させる",
                "kana": "みていさせる"
            },
            "imperative": {
                "kanji": "[未定]ろ",
                "kana": "みていろ"
            },
            "volitional": {
                "kanji": "[未定]よう",
                "kana": "みていよう"
            },
            "conditional": {
                "kanji": "[未定]れば",
                "kana": "みていれば"
            }
        },
        "usage": {
            "commonExpressions": [],
            "exampleSentences": [
                {
                    "japanese": "この動詞は未定です。",
                    "romaji": "kono doushi wa mitei desu.",
                    "english": "This verb is undetermined."
                }
            ]
        },
        "metadata": {
            "frequency": 0,
            "difficulty": 0,
            "tags": ["placeholder", "missing"],
            "notes": "Placeholder for missing verb n5_v_0167. ID gap between 166 and 168."
        }
    }

    # Insert at the beginning of verbs array (before n5_v_0168)
    data['verbs'].insert(0, placeholder)

    # Update metadata
    if 'metadata' in data:
        data['metadata']['totalVerbs'] = len(data['verbs'])
        if 'lastUpdated' in data['metadata']:
            from datetime import datetime
            data['metadata']['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✓ Added placeholder n5_v_0167 to N5_verbs_dataset_2.json")
    print(f"✓ Total verbs in dataset_2: {len(data['verbs'])} (was {len(data['verbs'])-1})")
    print(f"✓ New sequence: ...n5_v_0166 (dataset_1) → n5_v_0167 (placeholder) → n5_v_0168...")

if __name__ == '__main__':
    add_placeholder_verb_167()
