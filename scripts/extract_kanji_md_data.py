#!/usr/bin/env python3
"""
Extract structured data from kanji.md document
Extracts: example sentences, cultural notes, vocabulary, lessons
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Any

def extract_example_sentences(content: str) -> List[Dict[str, str]]:
    """Extract Japanese example sentences with their context"""
    sentences = []

    # Pattern to find Japanese sentences (ends with 。or ？ or ！)
    sentence_pattern = re.compile(r'([ぁ-んァ-ヶー一-龯]+[。？！])')

    lines = content.split('\n')

    for i, line in enumerate(lines):
        matches = sentence_pattern.findall(line)
        for sentence in matches:
            # Try to find context (kanji being taught nearby)
            context_kanji = None
            for j in range(max(0, i-10), min(len(lines), i+5)):
                # Look for single kanji character in nearby lines
                kanji_match = re.search(r'^([一-龯])$', lines[j].strip())
                if kanji_match:
                    context_kanji = kanji_match.group(1)
                    break

            sentences.append({
                'japanese': sentence,
                'kanji_context': context_kanji,
                'line_number': i + 1
            })

    return sentences

def extract_vocabulary(content: str) -> List[Dict[str, Any]]:
    """Extract vocabulary words with readings and meanings"""
    vocab_list = []

    # Common patterns in the document
    # Pattern 1: 大学 (だいがく) = college
    pattern1 = re.compile(r'([一-龯ぁ-んァ-ヶー]+)\s*\(([ぁ-ん]+)\)[=\s]*([a-zA-Z\s]+)')

    # Pattern 2: 大学\ndaigaku\ncollege
    lines = content.split('\n')

    for i, line in enumerate(lines):
        # Try pattern 1
        match = pattern1.search(line)
        if match:
            kanji_word = match.group(1)
            reading = match.group(2)
            meaning = match.group(3).strip()

            vocab_list.append({
                'word': kanji_word,
                'reading': reading,
                'meaning': meaning,
                'source': 'kanji.md',
                'line': i + 1
            })

    return vocab_list

def extract_kanji_entries(content: str) -> List[Dict[str, Any]]:
    """Extract kanji with all their information"""
    kanji_entries = []
    lines = content.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Check if line is a single kanji character
        if re.match(r'^[一-龯]$', line):
            kanji_char = line
            entry = {
                'kanji': kanji_char,
                'kun': None,
                'on': None,
                'meaning': None,
                'examples': [],
                'line': i + 1
            }

            # Look ahead for kun, on, meaning in next 10 lines
            for j in range(i+1, min(i+10, len(lines))):
                next_line = lines[j]

                kun_match = re.search(r'くん[：:]\s*([^\n]+)', next_line)
                if kun_match:
                    entry['kun'] = kun_match.group(1).strip()

                on_match = re.search(r'おん[：:]\s*([^\n]+)', next_line)
                if on_match:
                    entry['on'] = on_match.group(1).strip()

                meaning_match = re.search(r'meaning[：:]?\s*[：:]?\s*([^\n]+)', next_line, re.IGNORECASE)
                if meaning_match:
                    entry['meaning'] = meaning_match.group(1).strip()

            kanji_entries.append(entry)

        i += 1

    return kanji_entries

def extract_lessons(content: str) -> List[Dict[str, Any]]:
    """Extract lesson structure"""
    lessons = []

    # Find all lesson markers
    lesson_pattern = re.compile(r'★もじ(\d+)')
    page_pattern = re.compile(r'P(\d{3})')

    lines = content.split('\n')

    for i, line in enumerate(lines):
        lesson_match = lesson_pattern.search(line)
        if lesson_match:
            lesson_num = lesson_match.group(1)

            # Try to find page number nearby
            page = None
            for j in range(i, min(i+5, len(lines))):
                page_match = page_pattern.search(lines[j])
                if page_match:
                    page = page_match.group(1)
                    break

            lessons.append({
                'lesson': f"Moji {lesson_num}",
                'lesson_number': int(lesson_num),
                'page': f"P{page}" if page else None,
                'line': i + 1
            })

    return lessons

def extract_cultural_notes(content: str) -> List[Dict[str, str]]:
    """Extract cultural references and special notes"""
    cultural = []

    # Known cultural items
    cultural_items = {
        '七五三': 'Shichi-Go-San (traditional Japanese celebration for children)',
        '封筒': 'Japanese envelope addressing',
        'はがき': 'Japanese postcard addressing',
        '八百屋': 'Traditional vegetable shop',
        '万年筆': 'Fountain pen (traditional writing instrument)'
    }

    for item, description in cultural_items.items():
        if item in content:
            # Find the line number
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if item in line:
                    cultural.append({
                        'term': item,
                        'description': description,
                        'line': i + 1,
                        'context': line.strip()[:100]
                    })
                    break

    return cultural

def main():
    """Main extraction function"""

    print("=" * 80)
    print("KANJI.MD DATA EXTRACTION")
    print("=" * 80)
    print()

    # Load the document
    filepath = Path("/home/pankaj/Downloads/kanji.md/kanji.md")

    if not filepath.exists():
        print(f"Error: File not found at {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    print("📖 Extracting data...")
    print()

    # Extract all data types
    sentences = extract_example_sentences(content)
    vocab = extract_vocabulary(content)
    kanji = extract_kanji_entries(content)
    lessons = extract_lessons(content)
    cultural = extract_cultural_notes(content)

    # Compile results
    extracted_data = {
        'metadata': {
            'source': 'kanji.md',
            'extracted_at': '2026-03-18',
            'total_lines': len(content.split('\n'))
        },
        'lessons': lessons,
        'kanji': kanji,
        'vocabulary': vocab,
        'example_sentences': sentences,
        'cultural_notes': cultural,
        'statistics': {
            'lessons_found': len(lessons),
            'kanji_entries': len(kanji),
            'vocabulary_words': len(vocab),
            'example_sentences': len(sentences),
            'cultural_notes': len(cultural)
        }
    }

    # Save to JSON
    output_path = Path("public/seed-data/kanji_md_extracted.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, ensure_ascii=False, indent=2)

    # Print summary
    print(f"✅ Extraction complete!")
    print()
    print(f"📊 STATISTICS:")
    print(f"   Lessons: {len(lessons)}")
    print(f"   Kanji entries: {len(kanji)}")
    print(f"   Vocabulary words: {len(vocab)}")
    print(f"   Example sentences: {len(sentences)}")
    print(f"   Cultural notes: {len(cultural)}")
    print()
    print(f"💾 Saved to: {output_path}")
    print()

    # Show samples
    if sentences:
        print("📝 Sample sentences (first 5):")
        for sent in sentences[:5]:
            print(f"   {sent['japanese']}")
            if sent['kanji_context']:
                print(f"   → Related to kanji: {sent['kanji_context']}")
        print()

    if vocab:
        print("📚 Sample vocabulary (first 10):")
        for v in vocab[:10]:
            print(f"   {v['word']} ({v['reading']}) = {v['meaning']}")
        print()

    if cultural:
        print("🎎 Cultural notes found:")
        for c in cultural:
            print(f"   {c['term']}: {c['description']}")
        print()

    print("=" * 80)

if __name__ == "__main__":
    main()
