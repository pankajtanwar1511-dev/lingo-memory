#!/usr/bin/env python3
"""
COMPREHENSIVE EXTRACTION from kanji.md
Extracts EVERYTHING - no data left behind!
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime

def extract_all_vocabulary(content: str, lines: List[str]) -> List[Dict[str, Any]]:
    """Extract ALL vocabulary words - even duplicates"""
    vocab_list = []
    vocab_id = 1

    # Pattern 1: 大学 (だいがく) style
    pattern1 = re.compile(r'([一-龯ぁ-んァ-ヶー]+)\s*\(([ぁ-ん]+)\)')

    # Pattern 2: Words with meanings
    # 大学\ncollege
    # 大学生\ncollege student

    seen = set()  # Track to mark duplicates but keep them

    for i, line in enumerate(lines):
        line = line.strip()

        # Pattern 1: Kanji (hiragana)
        matches = pattern1.findall(line)
        for match in matches:
            kanji_word = match[0]
            reading = match[1]

            # Look for meaning nearby (next few lines)
            meaning = None
            for j in range(i+1, min(i+5, len(lines))):
                next_line = lines[j].strip()
                # Check if it's English (no Japanese characters)
                if next_line and not re.search(r'[ぁ-んァ-ヶー一-龯]', next_line):
                    # Could be meaning
                    if len(next_line) < 100 and not next_line.startswith('P'):
                        meaning = next_line
                        break

            vocab_id_str = f"kmd_vocab_{vocab_id:04d}"
            is_duplicate = kanji_word in seen
            seen.add(kanji_word)

            vocab_list.append({
                'id': vocab_id_str,
                'word': kanji_word,
                'kana': reading,
                'romaji': None,  # Will add manually later
                'meaning': meaning,
                'source': 'kanji.md',
                'line': i + 1,
                'is_duplicate': is_duplicate
            })
            vocab_id += 1

    return vocab_list

def extract_all_sentences(content: str, lines: List[str]) -> List[Dict[str, Any]]:
    """Extract ALL Japanese sentences"""
    sentences = []
    sent_id = 1

    # Patterns for sentences (ends with 。？！or です/ます)
    sentence_patterns = [
        re.compile(r'([ぁ-んァ-ヶー一-龯]+[。？！])'),  # Ends with punctuation
        re.compile(r'([ぁ-んァ-ヶー一-龯]+です)'),       # Ends with です
        re.compile(r'([ぁ-んァ-ヶー一-龯]+ます)'),       # Ends with ます
        re.compile(r'([ぁ-んァ-ヶー一-龯]+ません)'),     # Ends with ません
        re.compile(r'([ぁ-んァ-ヶー一-龯]+でした)'),     # Ends with でした
        re.compile(r'([ぁ-んァ-ヶー一-龯]+ました)'),     # Ends with ました
    ]

    for i, line in enumerate(lines):
        line = line.strip()

        for pattern in sentence_patterns:
            matches = pattern.findall(line)
            for sentence in matches:
                # Must be at least 5 characters and contain at least one kanji or hiragana
                if len(sentence) >= 5:
                    # Find context kanji (nearby kanji being taught)
                    context_kanji = []
                    for j in range(max(0, i-15), min(len(lines), i+5)):
                        check_line = lines[j].strip()
                        # Single kanji on its own line
                        if re.match(r'^[一-龯]$', check_line):
                            context_kanji.append(check_line)

                    # Extract kanji from sentence itself
                    kanji_in_sentence = list(set(re.findall(r'[一-龯]', sentence)))

                    sent_id_str = f"sent_{sent_id:04d}"
                    sentences.append({
                        'id': sent_id_str,
                        'japanese': sentence,
                        'kana': None,  # Add manually
                        'romaji': None,  # Add manually
                        'english': None,  # Add manually
                        'kanji_ids': [],  # Will link later
                        'kanji_chars': kanji_in_sentence,
                        'context_kanji': list(set(context_kanji)),
                        'line': i + 1,
                        'source': 'kanji.md'
                    })
                    sent_id += 1

    return sentences

def extract_kanji_detailed(content: str, lines: List[str]) -> List[Dict[str, Any]]:
    """Extract kanji entries with ALL information"""
    kanji_list = []

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Check if single kanji character
        if re.match(r'^[一-龯]$', line):
            kanji_char = line

            entry = {
                'kanji': kanji_char,
                'kun': None,
                'on': None,
                'meaning': None,
                'examples_in_doc': [],
                'line': i + 1,
                'context_lines': []
            }

            # Capture next 30 lines as context
            context_start = i + 1
            context_end = min(i + 30, len(lines))
            entry['context_lines'] = lines[context_start:context_end]

            # Extract readings and meaning from context
            for j in range(context_start, context_end):
                ctx_line = lines[j]

                # Kun reading
                kun_match = re.search(r'くん[：:]\s*([^\n]+)', ctx_line)
                if kun_match and not entry['kun']:
                    entry['kun'] = kun_match.group(1).strip()

                # On reading
                on_match = re.search(r'おん[：:]\s*([^\n]+)', ctx_line)
                if on_match and not entry['on']:
                    entry['on'] = on_match.group(1).strip()

                # Meaning
                meaning_match = re.search(r'meaning[：:]?\s*[：:]?\s*([^\n]+)', ctx_line, re.IGNORECASE)
                if meaning_match and not entry['meaning']:
                    entry['meaning'] = meaning_match.group(1).strip()

            kanji_list.append(entry)

        i += 1

    return kanji_list

def extract_lessons_detailed(content: str, lines: List[str]) -> List[Dict[str, Any]]:
    """Extract lesson structure with all details"""
    lessons = []

    lesson_pattern = re.compile(r'★もじ(\d+)')
    page_pattern = re.compile(r'P(\d{3})')

    for i, line in enumerate(lines):
        lesson_match = lesson_pattern.search(line)
        if lesson_match:
            lesson_num = lesson_match.group(1)

            # Find page
            page = None
            for j in range(i, min(i+10, len(lines))):
                page_match = page_pattern.search(lines[j])
                if page_match:
                    page = page_match.group(1)
                    break

            # Find kanji in next 100 lines
            kanji_in_lesson = []
            for j in range(i+1, min(i+100, len(lines))):
                if lines[j].strip() and re.match(r'^[一-龯]$', lines[j].strip()):
                    kanji_in_lesson.append(lines[j].strip())
                # Stop at next lesson
                if j > i+1 and lesson_pattern.search(lines[j]):
                    break

            lessons.append({
                'id': f"lesson_{int(lesson_num):03d}",
                'lesson_number': int(lesson_num),
                'title': f"Moji {lesson_num}",
                'page': f"P{page}" if page else None,
                'kanji_chars': list(dict.fromkeys(kanji_in_lesson)),  # Remove duplicates, keep order
                'line_start': i + 1,
                'source': 'kanji.md'
            })

    return lessons

def extract_cultural_items(content: str, lines: List[str]) -> List[Dict[str, Any]]:
    """Extract cultural references and notes"""
    cultural = []

    # Known items from manual review
    items = {
        '七五三': {
            'title': '七五三 (Shichi-Go-San)',
            'description': 'Traditional Japanese celebration for children at ages 3, 5, and 7',
            'kanji_chars': ['七', '五', '三'],
            'category': 'festivals'
        },
        '封筒': {
            'title': '封筒 (Envelope)',
            'description': 'Japanese envelope addressing system',
            'kanji_chars': [],
            'category': 'postal_system'
        },
        'はがき': {
            'title': 'はがき (Postcard)',
            'description': 'Japanese postcard addressing system',
            'kanji_chars': [],
            'category': 'postal_system'
        },
        '八百屋': {
            'title': '八百屋 (Yaoya)',
            'description': 'Traditional Japanese vegetable shop',
            'kanji_chars': ['八', '百'],
            'category': 'shops'
        },
        '万年筆': {
            'title': '万年筆 (Mannenhitsu)',
            'description': 'Fountain pen - traditional writing instrument',
            'kanji_chars': ['万', '年', '筆'],
            'category': 'stationery'
        },
        '富士山': {
            'title': '富士山 (Mt. Fuji)',
            'description': 'Japan\'s highest mountain and cultural icon',
            'kanji_chars': ['富', '士', '山'],
            'category': 'geography'
        }
    }

    cult_id = 1
    for term, info in items.items():
        if term in content:
            # Find line number
            line_num = None
            context = ""
            for i, line in enumerate(lines):
                if term in line:
                    line_num = i + 1
                    context = line.strip()
                    break

            cultural.append({
                'id': f"culture_{cult_id:03d}",
                'term': term,
                'title': info['title'],
                'description': info['description'],
                'kanji_chars': info['kanji_chars'],
                'category': info['category'],
                'line': line_num,
                'context': context,
                'source': 'kanji.md'
            })
            cult_id += 1

    return cultural

def main():
    print("=" * 80)
    print("PHASE 1: COMPREHENSIVE EXTRACTION FROM KANJI.MD")
    print("=" * 80)
    print()

    filepath = Path("/home/pankaj/Downloads/kanji.md/kanji.md")

    if not filepath.exists():
        print(f"❌ Error: File not found at {filepath}")
        return

    print(f"📖 Loading {filepath.name}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    print(f"✅ Loaded {len(lines)} lines")
    print()

    # Extract everything
    print("🔍 Extracting data...")
    print()

    print("1️⃣  Extracting lessons...")
    lessons = extract_lessons_detailed(content, lines)
    print(f"   Found: {len(lessons)} lessons")

    print("2️⃣  Extracting kanji entries...")
    kanji = extract_kanji_detailed(content, lines)
    print(f"   Found: {len(kanji)} kanji")

    print("3️⃣  Extracting vocabulary...")
    vocab = extract_all_vocabulary(content, lines)
    print(f"   Found: {len(vocab)} vocabulary items")

    print("4️⃣  Extracting sentences...")
    sentences = extract_all_sentences(content, lines)
    print(f"   Found: {len(sentences)} sentences")

    print("5️⃣  Extracting cultural notes...")
    cultural = extract_cultural_items(content, lines)
    print(f"   Found: {len(cultural)} cultural items")

    print()

    # Compile everything
    extracted_data = {
        'metadata': {
            'source': 'kanji.md',
            'source_path': str(filepath),
            'extracted_at': datetime.now().isoformat(),
            'total_lines': len(lines),
            'extractor_version': '1.0.0'
        },
        'statistics': {
            'lessons': len(lessons),
            'kanji': len(kanji),
            'vocabulary': len(vocab),
            'sentences': len(sentences),
            'cultural_notes': len(cultural)
        },
        'lessons': lessons,
        'kanji': kanji,
        'vocabulary': vocab,
        'sentences': sentences,
        'cultural_notes': cultural
    }

    # Save raw extraction
    output_path = Path("public/seed-data/kanji_md_raw_extraction.json")
    print(f"💾 Saving raw extraction to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, ensure_ascii=False, indent=2)
    print(f"✅ Saved!")
    print()

    # Print summary
    print("=" * 80)
    print("EXTRACTION SUMMARY")
    print("=" * 80)
    print()

    print(f"📚 LESSONS ({len(lessons)}):")
    for lesson in lessons:
        print(f"   Lesson {lesson['lesson_number']}: {len(lesson['kanji_chars'])} kanji - {', '.join(lesson['kanji_chars'][:10])}")
    print()

    print(f"🔤 KANJI ({len(kanji)}):")
    for k in kanji[:10]:
        kun = k['kun'][:20] if k['kun'] else 'N/A'
        on = k['on'][:20] if k['on'] else 'N/A'
        meaning = k['meaning'][:20] if k['meaning'] else 'N/A'
        print(f"   {k['kanji']}: くん={kun}, おん={on}, meaning={meaning}")
    if len(kanji) > 10:
        print(f"   ... and {len(kanji) - 10} more")
    print()

    print(f"📖 VOCABULARY ({len(vocab)}):")
    for v in vocab[:15]:
        dup = " (DUPLICATE)" if v['is_duplicate'] else ""
        meaning = v['meaning'][:30] if v['meaning'] else 'N/A'
        print(f"   {v['word']} ({v['kana']}) = {meaning}{dup}")
    if len(vocab) > 15:
        print(f"   ... and {len(vocab) - 15} more")
    print()

    print(f"💬 SENTENCES ({len(sentences)}):")
    for s in sentences[:10]:
        print(f"   {s['japanese'][:50]}...")
        if s['kanji_chars']:
            print(f"      Contains kanji: {', '.join(s['kanji_chars'][:5])}")
    if len(sentences) > 10:
        print(f"   ... and {len(sentences) - 10} more")
    print()

    print(f"🎎 CULTURAL NOTES ({len(cultural)}):")
    for c in cultural:
        print(f"   {c['title']}: {c['description'][:60]}...")
    print()

    print("=" * 80)
    print("✅ PHASE 1 COMPLETE!")
    print("=" * 80)
    print()
    print(f"📁 Raw data saved to: {output_path}")
    print(f"📊 Total items extracted: {sum(extracted_data['statistics'].values())}")
    print()
    print("Next: Run Phase 2 to create structured JSON files")
    print("=" * 80)

if __name__ == "__main__":
    main()
