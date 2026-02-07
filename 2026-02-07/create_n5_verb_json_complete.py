#!/usr/bin/env python3
"""
Generate Complete N5 Verb JSON for LingoMemory App
Combines: N5_verb.md (161 verbs) + minna_verbs_jmdict.json
Output: N5_vocab_dataset.json compatible format with ALL verb groups
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

def determine_verb_type(kana, jmdict_info=None):
    """Determine detailed verb type"""
    if jmdict_info and 'jmdict_verb_senses_only' in jmdict_info:
        pos_tags = []
        for sense in jmdict_info['jmdict_verb_senses_only']:
            pos_tags.extend(sense.get('pos', []))

        is_transitive = any('transitive' in tag.lower() for tag in pos_tags)
        is_intransitive = any('intransitive' in tag.lower() for tag in pos_tags)

        return {
            'transitive': is_transitive,
            'intransitive': is_intransitive,
            'pos_tags': pos_tags
        }

    return {'transitive': None, 'intransitive': None, 'pos_tags': []}

def generate_romaji(kana):
    """Convert kana to romaji"""
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
        'っ': ''  # small tsu
    }

    result = ""
    i = 0
    while i < len(kana):
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

def create_verb_entry(kanji, kana, masu_kanji, masu_kana, meaning, current_group, verb_id):
    """Create a verb entry in the standard format"""
    lookup_key = f"{kanji}|{kana}"
    jmdict_info = jmdict_lookup.get(lookup_key)
    verb_type_info = determine_verb_type(kana, jmdict_info)

    # Extract ALL glosses from JMdict (no limit)
    all_meanings = []
    if jmdict_info:
        for sense in jmdict_info.get('jmdict_verb_senses_only', []):
            all_meanings.extend(sense.get('glosses', []))

    # Use provided meaning if no JMdict data
    if not all_meanings and meaning:
        meaning_clean = re.sub(r'\[.*?\]', '', meaning).strip()
        all_meanings = [meaning_clean] if meaning_clean else []

    # Handle する verbs
    if kana.endswith('する'):
        verb_group = 'irregular'
    else:
        verb_group = current_group

    return {
        "id": f"n5_verb_{verb_id:04d}",
        "kanji": kanji,
        "kana": kana,
        "romaji": generate_romaji(kana),
        "meaning": all_meanings if all_meanings else [meaning],  # ALL meanings, no limit
        "jlptLevel": "N5",
        "partOfSpeech": ["verb"],
        "verbGroup": verb_group,
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
        "tags": ["verb", verb_group, "n5"],
        "examples": [],
        "audio": {
            "pronunciationUrl": f"/audio/n5/verbs/n5_verb_{verb_id:04d}.mp3",
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

# Parse verbs from markdown
verbs_list = []
current_group = 'unknown'
verb_id_counter = 1

lines = md_content.split('\n')
for i, line in enumerate(lines):
    # Detect group changes (CHECK GROUP II BEFORE GROUP I!)
    if '## GROUP II' in line:
        current_group = 'ichidan'
        continue
    elif '## GROUP I' in line:
        current_group = 'godan'
        continue
    elif '# Group III' in line:
        current_group = 'irregular'
        continue

    # Skip if not in a valid group yet
    if current_group == 'unknown':
        continue

    # Parse GROUP I and GROUP II verb tables
    if current_group in ['godan', 'ichidan'] and line.startswith('| '):
        parts = [p.strip() for p in line.split('|')]

        # Format: | kanji | kana | masu_kanji | masu_kana | meaning |
        if len(parts) >= 6 and parts[1] and parts[2]:
            kanji = parts[1]
            kana = parts[2]
            masu_kanji = parts[3]
            masu_kana = parts[4]
            meaning = parts[5] if len(parts) > 5 else ''

            # Skip headers and empty rows
            if not kanji or kanji in ['Dictionary Kanji', ''] or 'Dictionary' in kanji or line.startswith('|--'):
                continue

            verb_entry = create_verb_entry(kanji, kana, masu_kanji, masu_kana, meaning, current_group, verb_id_counter)
            verbs_list.append(verb_entry)
            verb_id_counter += 1

    # Parse GROUP III - different table structure
    elif current_group == 'irregular':
        # Core irregular verbs table
        if '| 来る | くる |' in line or '| する | する |' in line:
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 4:
                kanji = parts[1]
                kana = parts[2]

                # Generate masu forms
                if kana == 'くる':
                    masu_kanji = '来ます'
                    masu_kana = 'きます'
                    meaning = 'come'
                elif kana == 'する':
                    masu_kanji = 'します'
                    masu_kana = 'します'
                    meaning = 'do'
                else:
                    continue

                verb_entry = create_verb_entry(kanji, kana, masu_kanji, masu_kana, meaning, 'irregular', verb_id_counter)
                verbs_list.append(verb_entry)
                verb_id_counter += 1

        # する-compound verbs and 来る compounds
        elif line.startswith('| ') and 'する' in line:
            parts = [p.strip() for p in line.split('|')]

            # Format for する-compounds: | Verb Kanji | Verb Kana | Noun Form Kanji | Noun Form Kana | Noun Meaning | Verb Meaning |
            if len(parts) >= 7 and parts[1] and parts[2] and 'する' in parts[2]:
                kanji = parts[1]
                kana = parts[2]

                # Skip headers
                if 'Verb Kanji' in kanji or kanji == '':
                    continue

                # Generate masu form
                if kana.endswith('する'):
                    masu_kanji = kanji[:-2] + 'します' if len(kanji) > 2 else 'します'
                    masu_kana = kana[:-2] + 'します'
                else:
                    continue

                meaning = parts[6] if len(parts) > 6 else ''

                verb_entry = create_verb_entry(kanji, kana, masu_kanji, masu_kana, meaning, 'irregular', verb_id_counter)
                verbs_list.append(verb_entry)
                verb_id_counter += 1

            # Format for 来る compounds: | Verb Kanji | Verb Kana | Components | Meaning |
            elif len(parts) >= 5 and parts[1] and 'くる' in parts[2]:
                kanji = parts[1]
                kana = parts[2]

                # Skip headers
                if 'Verb Kanji' in kanji or kanji == '' or 'Components' in line:
                    continue

                # Generate masu form
                if kana.endswith('くる'):
                    masu_kanji = kanji[:-2] + 'きます' if len(kanji) > 2 else 'きます'
                    masu_kana = kana[:-2] + 'きます'
                else:
                    continue

                meaning = parts[4] if len(parts) > 4 else ''

                verb_entry = create_verb_entry(kanji, kana, masu_kanji, masu_kana, meaning, 'irregular', verb_id_counter)
                verbs_list.append(verb_entry)
                verb_id_counter += 1

# Create final JSON structure
output_json = {
    "metadata": {
        "version": "1.0.0",
        "generatedAt": datetime.now().isoformat() + "Z",
        "description": "Complete JLPT N5 verbs (161 entries) from Minna no Nihongo with JMdict enrichment",
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
print(f"\n🎯 Expected: 161 verbs (91 godan + 44 ichidan + 26 irregular)")
