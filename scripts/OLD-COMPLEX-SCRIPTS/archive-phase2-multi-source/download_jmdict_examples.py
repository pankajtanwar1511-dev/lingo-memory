#!/usr/bin/env python3
"""
Download JMdict Example Sentences

Downloads example sentences from the JMdict/EDICT project
License: CC BY-SA 3.0
Source: https://www.edrdg.org/jmdict/edict_doc.html
"""

import requests
import gzip
import xml.etree.ElementTree as ET
from pathlib import Path
import json


def download_jmdict_examples():
    """Download JMdict XML with example sentences"""

    print("📥 Downloading JMdict data...")
    print("   Source: EDRDG JMdict Project")
    print("   License: CC BY-SA 3.0\n")

    # JMdict XML file (includes example sentences)
    url = "http://ftp.edrdg.org/pub/Nihongo/JMdict_e_examp.gz"

    output_dir = Path("data/jmdict")
    output_dir.mkdir(parents=True, exist_ok=True)

    gz_file = output_dir / "JMdict_e_examp.gz"
    xml_file = output_dir / "JMdict_e_examp.xml"

    # Download
    print(f"   Downloading from {url}...")
    print("   (This may take a few minutes, file is ~50MB)")

    response = requests.get(url, stream=True)
    response.raise_for_status()

    with open(gz_file, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    print(f"   ✅ Downloaded to {gz_file}")

    # Extract
    print(f"   Extracting...")
    with gzip.open(gz_file, 'rb') as f_in:
        with open(xml_file, 'wb') as f_out:
            f_out.write(f_in.read())

    print(f"   ✅ Extracted to {xml_file}")

    # Parse and extract examples
    print(f"\n📖 Parsing XML and extracting examples...")

    examples = []
    tree = ET.parse(xml_file)
    root = tree.getroot()

    for entry in root.findall('entry'):
        # Get kanji/kana
        k_ele = entry.find('.//keb')
        r_ele = entry.find('.//reb')

        kanji = k_ele.text if k_ele is not None else None
        kana = r_ele.text if r_ele is not None else None

        # Get example sentences
        for sense in entry.findall('.//sense'):
            example_elements = sense.findall('.//example')

            for ex in example_elements:
                # Get the Japanese text from ex_text
                ex_text = ex.find('.//ex_text')

                # Find English translation by checking xml:lang attribute
                japanese_sent = None
                english_sent = None

                for sent in ex.findall('.//ex_sent'):
                    lang = sent.get('{http://www.w3.org/XML/1998/namespace}lang')
                    if lang == 'jpn':
                        japanese_sent = sent.text
                    elif lang == 'eng':
                        english_sent = sent.text

                # Use the full Japanese sentence (not ex_text which is just the vocab word)
                if japanese_sent is not None:
                    japanese = japanese_sent
                else:
                    continue  # Skip if no Japanese sentence found

                # English must be from eng ex_sent
                english = english_sent

                if japanese and english:
                    examples.append({
                        'japanese': japanese,
                        'english': english,
                        'vocab_kanji': kanji,
                        'vocab_kana': kana,
                        'source': 'jmdict',
                        'license': 'CC BY-SA 3.0'
                    })

    print(f"   ✅ Extracted {len(examples)} example sentences")

    # Save as JSON
    json_file = output_dir / "jmdict_examples.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(examples, f, ensure_ascii=False, indent=2)

    print(f"   ✅ Saved to {json_file}")

    # Save TSV format (compatible with Tatoeba format)
    tsv_file = output_dir / "jmdict_sentences.tsv"
    with open(tsv_file, 'w', encoding='utf-8') as f:
        for i, ex in enumerate(examples):
            # Format: id \t lang \t text
            f.write(f"jmd_{i}\tjpn\t{ex['japanese']}\n")

    print(f"   ✅ Saved TSV to {tsv_file}")

    # Save English translations TSV
    tsv_en_file = output_dir / "jmdict_translations.tsv"
    with open(tsv_en_file, 'w', encoding='utf-8') as f:
        for i, ex in enumerate(examples):
            f.write(f"jmd_{i}\teng\t{ex['english']}\n")

    print(f"   ✅ Saved English TSV to {tsv_en_file}")

    print(f"\n✅ JMdict download complete!")
    print(f"\n📊 Statistics:")
    print(f"   Total examples: {len(examples)}")
    print(f"   Format: TSV (compatible with enrichment script)")
    print(f"   License: CC BY-SA 3.0")

    return examples


if __name__ == '__main__':
    try:
        examples = download_jmdict_examples()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nNote: JMdict XML download may be slow or unavailable.")
        print("Alternative: The script will work with Tatoeba data only.")
