#!/usr/bin/env python3
"""
PHASE 2: Build structured JSON files from raw extraction
Creates: kanji_lessons.json, kanji_sentences.json, kanji_vocabulary_supplemental.json, cultural_notes.json
"""

import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any

def load_raw_extraction():
    """Load the raw extracted data"""
    path = Path("public/seed-data/kanji_md_raw_extraction.json")
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_app_kanji():
    """Load existing app kanji data for ID mapping"""
    path = Path("public/seed-data/kanji_n5.json")
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def build_kanji_lessons(raw_data: Dict, app_kanji_data: Dict) -> Dict:
    """Build kanji_lessons.json"""

    # Create kanji char -> ID map
    kanji_map = {k['kanji']: k['id'] for k in app_kanji_data['kanji']}

    lessons = []

    # Manual lesson definitions based on kanji.md structure
    lesson_defs = [
        {
            'number': 3,
            'title': 'Size & People',
            'description': 'Learn basic kanji for describing size and people',
            'kanji_chars': ['大', '小', '人'],
            'page': 'P198',
            'difficulty': 'beginner',
            'estimated_minutes': 15
        },
        {
            'number': 4,
            'title': 'Nature',
            'description': 'Learn kanji for natural features',
            'kanji_chars': ['山', '川', '田'],
            'page': 'P200',
            'difficulty': 'beginner',
            'estimated_minutes': 15
        },
        {
            'number': 5,
            'title': 'Numbers 1-10',
            'description': 'Learn kanji for counting from one to ten',
            'kanji_chars': ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
            'page': 'P201',
            'difficulty': 'beginner',
            'estimated_minutes': 25
        },
        {
            'number': 6,
            'title': 'Large Numbers',
            'description': 'Learn kanji for hundreds, thousands, and yen',
            'kanji_chars': ['百', '千', '万', '円'],
            'page': 'P204',
            'difficulty': 'beginner',
            'estimated_minutes': 15
        },
        {
            'number': 7,
            'title': 'Directions',
            'description': 'Learn kanji for spatial directions and positions',
            'kanji_chars': ['上', '中', '下'],
            'page': 'P206',
            'difficulty': 'beginner',
            'estimated_minutes': 15
        },
        {
            'number': 8,
            'title': 'Days of the Week',
            'description': 'Learn kanji for days and basic time expressions',
            'kanji_chars': ['日', '月', '火', '水', '木', '金', '土'],
            'page': 'P208',
            'difficulty': 'beginner',
            'estimated_minutes': 20
        }
    ]

    for idx, lesson_def in enumerate(lesson_defs):
        # Map kanji chars to IDs
        kanji_ids = []
        for char in lesson_def['kanji_chars']:
            if char in kanji_map:
                kanji_ids.append(kanji_map[char])

        lessons.append({
            'id': f"lesson_{lesson_def['number']:03d}",
            'number': lesson_def['number'],
            'title': lesson_def['title'],
            'description': lesson_def['description'],
            'difficulty': lesson_def['difficulty'],
            'estimatedMinutes': lesson_def['estimated_minutes'],
            'page': lesson_def['page'],
            'order': idx + 1,
            'kanji_ids': kanji_ids,
            'kanji_chars': lesson_def['kanji_chars'],
            'sentence_ids': [],  # Will populate later
            'vocab_ids': [],     # Will populate later
            'prerequisites': [] if idx == 0 else [f"lesson_{lesson_defs[idx-1]['number']:03d}"],
            'nextLesson': f"lesson_{lesson_defs[idx+1]['number']:03d}" if idx < len(lesson_defs) - 1 else None,
            'source': 'kanji.md'
        })

    return {
        'metadata': {
            'version': '1.0.0',
            'generatedAt': datetime.now().isoformat(),
            'totalLessons': len(lessons),
            'difficulty': 'beginner',
            'source': 'kanji.md textbook',
            'description': 'Structured kanji lessons for beginners based on Japanese language textbook'
        },
        'lessons': lessons
    }

def build_kanji_sentences(raw_data: Dict, app_kanji_data: Dict) -> Dict:
    """Build kanji_sentences.json"""

    # Create kanji char -> ID map
    kanji_map = {k['kanji']: k['id'] for k in app_kanji_data['kanji']}

    sentences_out = []

    # Process extracted sentences
    for sent in raw_data['sentences']:
        # Map kanji chars to IDs
        kanji_ids = []
        for char in sent['kanji_chars']:
            if char in kanji_map:
                kanji_ids.append(kanji_map[char])

        # Only include sentences with at least one recognized kanji
        if kanji_ids:
            sentences_out.append({
                'id': sent['id'],
                'japanese': sent['japanese'],
                'kana': None,  # TODO: Add manually
                'romaji': None,  # TODO: Add manually
                'english': None,  # TODO: Add manually
                'kanji_ids': kanji_ids,
                'kanji_chars': sent['kanji_chars'],
                'vocab_ids': [],  # TODO: Link later
                'lesson_ids': [],  # TODO: Link later
                'difficulty': 'N5',
                'grammarPoints': [],  # TODO: Add manually
                'tags': [],
                'audioUrl': None,
                'source': {
                    'type': 'kanji.md',
                    'line': sent['line']
                }
            })

    return {
        'metadata': {
            'version': '1.0.0',
            'generatedAt': datetime.now().isoformat(),
            'totalSentences': len(sentences_out),
            'source': 'kanji.md textbook',
            'description': 'Japanese example sentences from kanji.md textbook',
            'note': 'kana, romaji, and english translations need to be added manually'
        },
        'sentences': sentences_out
    }

def build_kanji_vocabulary_supplemental(raw_data: Dict, app_kanji_data: Dict) -> Dict:
    """Build kanji_vocabulary_supplemental.json"""

    # Create kanji char -> ID map
    kanji_map = {k['kanji']: k['id'] for k in app_kanji_data['kanji']}

    vocab_out = []

    # Process extracted vocabulary
    for vocab in raw_data['vocabulary']:
        # Find kanji chars in word
        kanji_chars = []
        for char in vocab['word']:
            if '\u4e00' <= char <= '\u9fff':  # CJK kanji range
                kanji_chars.append(char)

        # Map to IDs
        kanji_ids = []
        for char in kanji_chars:
            if char in kanji_map:
                kanji_ids.append(kanji_map[char])

        vocab_out.append({
            'id': vocab['id'],
            'word': vocab['word'],
            'kana': vocab['kana'],
            'romaji': None,  # TODO: Add manually
            'meaning': vocab['meaning'],
            'kanji_ids': kanji_ids,
            'kanji_chars': kanji_chars,
            'lesson_ids': [],  # TODO: Link later
            'partOfSpeech': [],  # TODO: Add manually
            'jlptLevel': 'N5',
            'isDuplicate': vocab['is_duplicate'],
            'source': {
                'type': 'kanji.md',
                'line': vocab['line']
            }
        })

    return {
        'metadata': {
            'version': '1.0.0',
            'generatedAt': datetime.now().isoformat(),
            'totalVocabulary': len(vocab_out),
            'source': 'kanji.md textbook',
            'description': 'Supplemental vocabulary from kanji.md (may include duplicates from main N5 dataset)',
            'note': 'romaji and partOfSpeech need to be added manually'
        },
        'vocabulary': vocab_out
    }

def build_cultural_notes(raw_data: Dict, app_kanji_data: Dict) -> Dict:
    """Build cultural_notes.json"""

    # Create kanji char -> ID map
    kanji_map = {k['kanji']: k['id'] for k in app_kanji_data['kanji']}

    notes_out = []

    for note in raw_data['cultural_notes']:
        # Map kanji chars to IDs
        kanji_ids = []
        for char in note['kanji_chars']:
            if char in kanji_map:
                kanji_ids.append(kanji_map[char])

        notes_out.append({
            'id': note['id'],
            'term': note['term'],
            'title': note['title'],
            'shortDescription': note['description'],
            'fullDescription': note['description'],  # TODO: Expand manually
            'kanji_ids': kanji_ids,
            'kanji_chars': note['kanji_chars'],
            'vocab_ids': [],  # TODO: Link later
            'category': note['category'],
            'imageUrl': None,  # TODO: Add images
            'externalLinks': [],
            'source': {
                'type': 'kanji.md',
                'line': note['line'],
                'context': note['context']
            }
        })

    return {
        'metadata': {
            'version': '1.0.0',
            'generatedAt': datetime.now().isoformat(),
            'totalNotes': len(notes_out),
            'source': 'kanji.md textbook',
            'description': 'Cultural notes and references from Japanese language learning material'
        },
        'notes': notes_out
    }

def main():
    print("=" * 80)
    print("PHASE 2: BUILDING STRUCTURED JSON FILES")
    print("=" * 80)
    print()

    print("📖 Loading raw extraction...")
    raw_data = load_raw_extraction()
    print(f"✅ Loaded {sum(raw_data['statistics'].values())} items")
    print()

    print("📖 Loading app kanji data...")
    app_kanji_data = load_app_kanji()
    print(f"✅ Loaded {len(app_kanji_data['kanji'])} kanji")
    print()

    print("🏗️  Building structured files...")
    print()

    # Build each file
    print("1️⃣  Building kanji_lessons.json...")
    lessons_data = build_kanji_lessons(raw_data, app_kanji_data)
    lessons_path = Path("public/seed-data/kanji_lessons.json")
    with open(lessons_path, 'w', encoding='utf-8') as f:
        json.dump(lessons_data, f, ensure_ascii=False, indent=2)
    print(f"   ✅ Saved {len(lessons_data['lessons'])} lessons to {lessons_path}")

    print("2️⃣  Building kanji_sentences.json...")
    sentences_data = build_kanji_sentences(raw_data, app_kanji_data)
    sentences_path = Path("public/seed-data/kanji_sentences.json")
    with open(sentences_path, 'w', encoding='utf-8') as f:
        json.dump(sentences_data, f, ensure_ascii=False, indent=2)
    print(f"   ✅ Saved {len(sentences_data['sentences'])} sentences to {sentences_path}")

    print("3️⃣  Building kanji_vocabulary_supplemental.json...")
    vocab_data = build_kanji_vocabulary_supplemental(raw_data, app_kanji_data)
    vocab_path = Path("public/seed-data/kanji_vocabulary_supplemental.json")
    with open(vocab_path, 'w', encoding='utf-8') as f:
        json.dump(vocab_data, f, ensure_ascii=False, indent=2)
    print(f"   ✅ Saved {len(vocab_data['vocabulary'])} vocabulary items to {vocab_path}")

    print("4️⃣  Building cultural_notes.json...")
    cultural_data = build_cultural_notes(raw_data, app_kanji_data)
    cultural_path = Path("public/seed-data/cultural_notes.json")
    with open(cultural_path, 'w', encoding='utf-8') as f:
        json.dump(cultural_data, f, ensure_ascii=False, indent=2)
    print(f"   ✅ Saved {len(cultural_data['notes'])} cultural notes to {cultural_path}")

    print()
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print()

    print(f"📚 kanji_lessons.json:")
    for lesson in lessons_data['lessons']:
        print(f"   Lesson {lesson['number']}: {lesson['title']} ({len(lesson['kanji_ids'])} kanji)")
    print()

    print(f"💬 kanji_sentences.json:")
    print(f"   Total: {len(sentences_data['sentences'])} sentences")
    print(f"   Sample:")
    for sent in sentences_data['sentences'][:5]:
        print(f"     • {sent['japanese'][:50]}... ({len(sent['kanji_ids'])} kanji)")
    print()

    print(f"📖 kanji_vocabulary_supplemental.json:")
    print(f"   Total: {len(vocab_data['vocabulary'])} words")
    duplicates = sum(1 for v in vocab_data['vocabulary'] if v['isDuplicate'])
    print(f"   Duplicates: {duplicates}")
    print(f"   Sample:")
    for vocab in vocab_data['vocabulary'][:5]:
        dup = " [DUP]" if vocab['isDuplicate'] else ""
        print(f"     • {vocab['word']} ({vocab['kana']}){dup}")
    print()

    print(f"🎎 cultural_notes.json:")
    for note in cultural_data['notes']:
        print(f"   • {note['title']}: {note['shortDescription'][:60]}...")
    print()

    print("=" * 80)
    print("✅ PHASE 2 COMPLETE!")
    print("=" * 80)
    print()
    print("📁 Files created:")
    print(f"   • {lessons_path}")
    print(f"   • {sentences_path}")
    print(f"   • {vocab_path}")
    print(f"   • {cultural_path}")
    print()
    print("📝 Next steps:")
    print("   1. Manually add missing translations to sentences")
    print("   2. Add romaji to vocabulary")
    print("   3. Link sentences to lessons")
    print("   4. Update kanji_n5.json with new linking fields")
    print("=" * 80)

if __name__ == "__main__":
    main()
