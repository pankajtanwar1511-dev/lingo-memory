#!/usr/bin/env python3
"""
Parse Tanos.co.uk N5 vocabulary PDF and extract all N5 words.

Source: http://www.tanos.co.uk/jlpt/jlpt5/vocab/VocabList.N5.pdf
Note: Vocabulary words themselves are not copyrightable (factual information)
"""

import pdfplumber
import re
import json

def parse_tanos_pdf(pdf_file):
    """Extract vocabulary from Tanos N5 PDF"""

    print(f"Parsing {pdf_file}...")

    vocab_list = []

    with pdfplumber.open(pdf_file) as pdf:
        print(f"Total pages: {len(pdf.pages)}")

        for page_num, page in enumerate(pdf.pages, 1):
            text = page.extract_text()

            if not text:
                continue

            # The Tanos PDF has format like:
            # Kanji  Kana  English
            # Split by lines and parse
            lines = text.split('\n')

            for line in lines:
                line = line.strip()

                # Skip empty lines
                if not line:
                    continue

                # Skip headers
                if 'Kanji' in line and 'Hiragana' in line and 'English' in line:
                    continue

                # Skip page numbers (single digit or small number)
                if line.isdigit() and int(line) < 100:
                    continue

                # Skip the title lines
                if 'JLPT' in line or 'Resources' in line or 'Vocab List' in line:
                    continue

                # Parse the line
                # Format: Kanji Hiragana English
                # Example: 会う あう to meet
                # Split by whitespace
                parts = line.split()

                if len(parts) >= 3:
                    # First word is kanji/kana
                    kanji_word = parts[0]

                    # Second is hiragana reading
                    hiragana = parts[1]

                    # Rest is English
                    english = ' '.join(parts[2:])

                    # Validate: hiragana should be all hiragana
                    if re.match(r'^[ぁ-ん]+$', hiragana):
                        vocab_list.append({
                            'kanji': kanji_word,
                            'kana': hiragana,
                            'english': english,
                            'source': 'Tanos.co.uk'
                        })
                elif len(parts) == 2:
                    # Some entries might be kana-only
                    # Format: あそこ over there
                    word = parts[0]
                    english = parts[1]

                    # Check if first part is all hiragana/katakana
                    if re.match(r'^[ぁ-んァ-ヶー]+$', word):
                        vocab_list.append({
                            'kanji': word,
                            'kana': word,
                            'english': english,
                            'source': 'Tanos.co.uk'
                        })

        print(f"Extracted {len(vocab_list)} vocabulary entries")

    return vocab_list

def main():
    pdf_file = 'tanos_n5_vocab.pdf'

    print("Tanos.co.uk N5 Vocabulary Parser")
    print("=" * 50)

    # Parse PDF
    vocab_list = parse_tanos_pdf(pdf_file)

    # Remove duplicates (based on kanji)
    seen = set()
    unique_vocab = []
    for entry in vocab_list:
        key = entry['kanji']
        if key not in seen:
            seen.add(key)
            unique_vocab.append(entry)

    print(f"Unique words: {len(unique_vocab)}")

    # Save to JSON
    output_json = 'tanos_n5_vocab.json'
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(unique_vocab, f, ensure_ascii=False, indent=2)

    print(f"Saved to {output_json}")

    # Save to plain text (word|kana|english format)
    output_txt = 'tanos_n5_vocab.txt'
    with open(output_txt, 'w', encoding='utf-8') as f:
        for entry in unique_vocab:
            f.write(f"{entry['kanji']}|{entry['kana']}|{entry['english']}\n")

    print(f"Saved to {output_txt}")

    # Save just the words (for comparison)
    output_words = 'tanos_n5_words_only.txt'
    with open(output_words, 'w', encoding='utf-8') as f:
        for entry in unique_vocab:
            f.write(f"{entry['kanji']}\n")

    print(f"Saved word list to {output_words}")

    # Show sample
    print("\nSample entries:")
    for entry in unique_vocab[:20]:
        print(f"  {entry['kanji']} ({entry['kana']}) - {entry['english']}")

    print(f"\nTotal: {len(unique_vocab)} N5 words")

if __name__ == '__main__':
    main()
