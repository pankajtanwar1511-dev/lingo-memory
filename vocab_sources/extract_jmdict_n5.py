#!/usr/bin/env python3
"""
Extract JLPT N5 vocabulary from JMdict XML file.

JMdict is licensed under CC-BY-SA 3.0
Source: http://www.edrdg.org/jmdict/j_jmdict.html
"""

import xml.etree.ElementTree as ET
import json
from collections import defaultdict

def extract_n5_vocab(jmdict_file):
    """Extract all words tagged with nf01-nf24 (common words) or ke_pri/re_pri containing '5'"""

    print(f"Parsing {jmdict_file}...")
    tree = ET.parse(jmdict_file)
    root = tree.getroot()

    n5_words = []
    n5_count = 0

    for entry in root.findall('entry'):
        # Check if entry has N5 tag
        has_n5 = False

        # Check for ke_pri (kanji element priority) or re_pri (reading element priority)
        # These can contain markers like "nf01" (common word frequency)
        # or specific JLPT markers

        # Get all kanji elements
        kanji_elements = entry.findall('.//k_ele')
        reading_elements = entry.findall('.//r_ele')

        # Check for priority markers that might indicate N5
        # Common words (nf01-nf24) are usually N5-N4 level
        for k_ele in kanji_elements:
            for pri in k_ele.findall('ke_pri'):
                if pri.text and ('nf' in pri.text):
                    # nf01-nf12 are very common (likely N5)
                    freq_num = int(pri.text.replace('nf', ''))
                    if freq_num <= 12:  # Top frequency words
                        has_n5 = True
                        break

        for r_ele in reading_elements:
            for pri in r_ele.findall('re_pri'):
                if pri.text and ('nf' in pri.text):
                    freq_num = int(pri.text.replace('nf', ''))
                    if freq_num <= 12:
                        has_n5 = True
                        break

        # Also check for explicit misc tags (though JMdict doesn't have JLPT tags directly)
        # We'll rely on frequency markers for now

        if has_n5:
            # Extract kanji (if exists)
            kanji = None
            for k_ele in kanji_elements:
                keb = k_ele.find('keb')
                if keb is not None:
                    kanji = keb.text
                    break

            # Extract reading (kana)
            kana = None
            for r_ele in reading_elements:
                reb = r_ele.find('reb')
                if reb is not None:
                    kana = reb.text
                    break

            # Extract English meanings
            meanings = []
            for sense in entry.findall('sense'):
                for gloss in sense.findall('gloss'):
                    if gloss.text and gloss.get('{http://www.w3.org/XML/1998/namespace}lang') is None:
                        # Only English glosses (no lang attribute = English)
                        meanings.append(gloss.text)

            if kana:  # Must have at least kana
                word_entry = {
                    'kanji': kanji if kanji else kana,
                    'kana': kana,
                    'english': ', '.join(meanings[:3]) if meanings else 'N/A',
                    'source': 'JMdict'
                }
                n5_words.append(word_entry)
                n5_count += 1

    print(f"Found {n5_count} high-frequency words (likely N5-N4 level)")
    return n5_words

def main():
    jmdict_file = 'JMdict_e'

    print("JMdict N5 Vocabulary Extractor")
    print("=" * 50)
    print("Note: JMdict doesn't have explicit JLPT tags")
    print("We're extracting high-frequency words (nf01-nf12)")
    print("These are likely N5-N4 level words")
    print("=" * 50)
    print()

    # Extract N5 words
    n5_words = extract_n5_vocab(jmdict_file)

    # Save to JSON
    output_file = 'jmdict_n5_candidates.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(n5_words, f, ensure_ascii=False, indent=2)

    print(f"\nSaved {len(n5_words)} words to {output_file}")

    # Save to plain text (word|kana|english format)
    output_txt = 'jmdict_n5_candidates.txt'
    with open(output_txt, 'w', encoding='utf-8') as f:
        for word in n5_words:
            f.write(f"{word['kanji']}|{word['kana']}|{word['english']}\n")

    print(f"Saved plain text format to {output_txt}")

    # Show sample
    print("\nSample words:")
    for word in n5_words[:20]:
        print(f"  {word['kanji']} ({word['kana']}) - {word['english']}")

if __name__ == '__main__':
    main()
