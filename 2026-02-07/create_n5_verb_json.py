#!/usr/bin/env python3
"""
Generate N5 Verb JSON for LingoMemory App
Combines: N5_verb.md + minna_verbs_jmdict.json
Output: N5_vocab_dataset.json compatible format with verb-specific fields
"""

import json
import re
from datetime import datetime

# Read N5_verb.md
with open('N5_verb.md', 'r', encoding='utf-8') as f:
    md_content = f.read()

# Read JMdict verb data
with open('../N5_important/minna_verbs_jmdict.json', 'r', encoding='utf-8') as f:
    jmdict_data = json.load(f)

# Create lookup dict for JMdict data
jmdict_lookup = {}
for verb in jmdict_data['verbs']:
    key = f"{verb['minna_kanji']}|{verb['minna_kana']}"
    jmdict_lookup[key] = verb

def extract_verb_group(line_context):
    """Determine verb group from context"""
    if 'GROUP I' in line_context:
        return 'godan'
    elif 'GROUP II' in line_context:
        return 'ichidan'
    elif 'Group III' in line_context or 'Irregular' in line_context:
        return 'irregular'
    return 'unknown'

def determine_verb_type(kana, jmdict_info=None):
    """Determine detailed verb type"""
    # Check JMdict first
    if jmdict_info and 'jmdict_verb_senses_only' in jmdict_info:
        pos_tags = []
        for sense in jmdict_info['jmdict_verb_senses_only']:
            pos_tags.extend(sense.get('pos', []))

        # Determine transitivity
        is_transitive = any('transitive' in tag.lower() for tag in pos_tags)
        is_intransitive = any('intransitive' in tag.lower() for tag in pos_tags)

        return {
            'transitive': is_transitive,
            'intransitive': is_intransitive,
            'pos_tags': pos_tags
        }

    # Default
    return {
        'transitive': None,
        'intransitive': None,
        'pos_tags': []
    }

def generate_romaji(kana):
    """Simple kana to romaji converter (basic)"""
    # This is simplified - you might want a proper library
    romaji_map = {
        'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
        'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
        'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
        'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
        'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
        'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
        'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
        'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
        'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
        'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
        'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
        'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
        'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
        'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
        'わ': 'wa', 'を': 'wo', 'ん': 'n',
        'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
        'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
        'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
        'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
        'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
        'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
        'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
        'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
        'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
        'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
        'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
    }

    result = ""
    i = 0
    while i < len(kana):
        # Try 2-character match first
        if i < len(kana) - 1 and kana[i:i+2] in romaji_map:
            result += romaji_map[kana[i:i+2]]
            i += 2
        elif kana[i] in romaji_map:
            result += romaji_map[kana[i]]
            i += 1
        else:
            result += kana[i]
            i += 1

    return result

# Parse verbs from markdown
verbs_list = []
current_group = 'unknown'
verb_id_counter = 1

lines = md_content.split('\n')
for i, line in enumerate(lines):
    # Detect group
    if 'GROUP I' in line:
        current_group = 'godan'
    elif 'GROUP II' in line:
        current_group = 'ichidan'
    elif 'Group III' in line:
        current_group = 'irregular'

    # Parse verb table rows
    if line.startswith('| ') and not 'Dictionary' in line and not line.startswith('|--'):
        parts = [p.strip() for p in line.split('|')]

        # GROUP I and II format: | kanji | kana | masu_kanji | masu_kana | meaning |
        if len(parts) >= 6 and parts[1] and parts[2] and parts[3] and current_group in ['godan', 'ichidan']:
            kanji = parts[1]
            kana = parts[2]
            masu_kanji = parts[3]
            masu_kana = parts[4]
            meaning = parts[5] if len(parts) > 5 else ''

            # Skip empty or header rows
            if not kanji or kanji in ['Dictionary Kanji', 'Verb Kanji', '']:
                continue

            # Lookup JMdict data
            lookup_key = f"{kanji}|{kana}"
            jmdict_info = jmdict_lookup.get(lookup_key)
            verb_type_info = determine_verb_type(kana, jmdict_info)

            # Extract all glosses from JMdict
            all_meanings = []
            if jmdict_info:
                for sense in jmdict_info.get('jmdict_verb_senses_only', []):
                    all_meanings.extend(sense.get('glosses', []))

            # Use Minna meaning if no JMdict data
            if not all_meanings and meaning:
                # Clean up meaning
                meaning_clean = re.sub(r'\[.*?\]', '', meaning).strip()
                all_meanings = [meaning_clean] if meaning_clean else []

            verb_entry = {
                "id": f"n5_verb_{verb_id_counter:04d}",
                "kanji": kanji,
                "kana": kana,
                "romaji": generate_romaji(kana),
                "meaning": all_meanings[:5] if all_meanings else [meaning],  # Top 5 meanings
                "jlptLevel": "N5",
                "partOfSpeech": ["verb"],
                "verbGroup": current_group,
                "verbType": {
                    "transitive": verb_type_info['transitive'],
                    "intransitive": verb_type_info['intransitive']
                },
                "conjugations": {
                    "dictionary": kanji,
                    "dictionaryKana": kana,
                    "masu": masu_kanji,
                    "masuKana": masu_kana
                },
                "tags": [
                    "verb",
                    current_group,
                    "n5"
                ],
                "examples": [],  # To be filled later
                "audio": {
                    "pronunciationUrl": f"/audio/n5/verbs/{verb_entry_id}.mp3" if 'verb_entry_id' in locals() else "",
                    "source": "pending"
                },
                "source": {
                    "type": "minna-no-nihongo",
                    "jmdict_ent_seq": jmdict_info.get('jmdict_ent_seq', '') if jmdict_info else '',
                    "url": "https://www.3anetwork.com"
                },
                "license": {
                    "text": "CC BY-SA 4.0",
                    "url": "https://creativecommons.org/licenses/by-sa/4.0/"
                }
            }

            # Fix audio URL after id is set
            verb_entry["audio"]["pronunciationUrl"] = f"/audio/n5/verbs/{verb_entry['id']}.mp3"

            verbs_list.append(verb_entry)
            verb_id_counter += 1

# Create final JSON structure
output_json = {
    "metadata": {
        "version": "1.0.0",
        "generatedAt": datetime.now().isoformat() + "Z",
        "description": "JLPT N5 verbs from Minna no Nihongo with JMdict enrichment",
        "totalVerbs": len(verbs_list),
        "verbsWithJMdictData": sum(1 for v in verbs_list if v['source']['jmdict_ent_seq']),
        "dataSource": "Minna no Nihongo + JMdict",
        "groups": {
            "godan": sum(1 for v in verbs_list if v['verbGroup'] == 'godan'),
            "ichidan": sum(1 for v in verbs_list if v['verbGroup'] == 'ichidan'),
            "irregular": sum(1 for v in verbs_list if v['verbGroup'] == 'irregular')
        }
    },
    "verbs": verbs_list
}

# Write to file
with open('N5_verbs_dataset.json', 'w', encoding='utf-8') as f:
    json.dump(output_json, f, ensure_ascii=False, indent=2)

print(f"✅ Created: N5_verbs_dataset.json")
print(f"📊 Total verbs: {len(verbs_list)}")
print(f"   - Godan (Group I): {output_json['metadata']['groups']['godan']}")
print(f"   - Ichidan (Group II): {output_json['metadata']['groups']['ichidan']}")
print(f"   - Irregular (Group III): {output_json['metadata']['groups']['irregular']}")
print(f"   - With JMdict data: {output_json['metadata']['verbsWithJMdictData']}")
