#!/usr/bin/env python3
"""
Replace placeholder n5_v_0167 with 続ける (tsuzukeru - to continue)
"""

import json

def replace_verb_167():
    """Replace placeholder with real verb: 続ける"""

    filepath = '/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset_2.json'

    # Read the dataset
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Create the real verb entry for 続ける (tsuzukeru - to continue)
    verb_tsuzukeru = {
        "id": "n5_v_0167",
        "lemma": {
            "kanji": "続ける",
            "kana": "つづける"
        },
        "jlpt": "N4",
        "pos": "verb",
        "morphology": {
            "class": "ichidan",
            "isIrregular": False
        },
        "valency": {
            "type": "transitive",
            "requiredParticles": ["を"],
            "coreStructure": "XがYを続ける"
        },
        "meaning": {
            "primary": "to continue",
            "gloss": [
                "continue",
                "keep on",
                "carry on",
                "keep doing"
            ]
        },
        "forms": {
            "dictionary": {
                "kanji": "続ける",
                "kana": "つづける"
            },
            "masu": {
                "kanji": "続けます",
                "kana": "つづけます"
            },
            "te": {
                "kanji": "続けて",
                "kana": "つづけて"
            },
            "nai": {
                "kanji": "続けない",
                "kana": "つづけない"
            },
            "past": {
                "kanji": "続けた",
                "kana": "つづけた"
            },
            "potential": {
                "kanji": "続けられる",
                "kana": "つづけられる"
            },
            "passive": {
                "kanji": "続けられる",
                "kana": "つづけられる"
            },
            "causative": {
                "kanji": "続けさせる",
                "kana": "つづけさせる"
            },
            "imperative": {
                "kanji": "続けろ",
                "kana": "つづけろ"
            },
            "volitional": {
                "kanji": "続けよう",
                "kana": "つづけよう"
            },
            "conditional": {
                "kanji": "続ければ",
                "kana": "つづければ"
            }
        },
        "usage": {
            "commonExpressions": [
                "勉強を続ける (benkyou wo tsuzukeru - continue studying)",
                "仕事を続ける (shigoto wo tsuzukeru - continue working)",
                "話を続ける (hanashi wo tsuzukeru - continue talking)"
            ],
            "exampleSentences": [
                {
                    "japanese": "日本語の勉強を続けています。",
                    "romaji": "nihongo no benkyou wo tsuzukete imasu.",
                    "english": "I am continuing to study Japanese."
                },
                {
                    "japanese": "頑張って続けましょう。",
                    "romaji": "ganbatte tsuzukemashou.",
                    "english": "Let's keep trying our best."
                },
                {
                    "japanese": "この仕事を続けたいです。",
                    "romaji": "kono shigoto wo tsuzuketai desu.",
                    "english": "I want to continue this job."
                }
            ]
        },
        "metadata": {
            "frequency": 450,
            "difficulty": 3,
            "tags": ["continuation", "perseverance", "ichidan", "transitive"],
            "notes": "Common verb for expressing continuation. Often used with 〜ている form for ongoing actions."
        }
    }

    # Replace the first verb (which is the placeholder)
    data['verbs'][0] = verb_tsuzukeru

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✓ Replaced placeholder n5_v_0167 with 続ける (tsuzukeru - to continue)")
    print(f"✓ Verb class: ichidan (regular conjugation)")
    print(f"✓ JLPT level: N4")
    print(f"✓ Usage: Very common verb for 'continue', 'keep on', 'carry on'")

if __name__ == '__main__':
    replace_verb_167()
