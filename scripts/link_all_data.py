#!/usr/bin/env python3
"""
PHASE 3 & 4: Link all data and update kanji_n5.json
"""

import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any
from collections import defaultdict

def load_json(filename):
    """Load JSON file"""
    path = Path(f"public/seed-data/{filename}")
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(data, filename):
    """Save JSON file"""
    path = Path(f"public/seed-data/{filename}")
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return path

def main():
    print("=" * 80)
    print("PHASE 3 & 4: LINKING DATA AND UPDATING KANJI_N5.JSON")
    print("=" * 80)
    print()

    # Load all files
    print("📖 Loading all data files...")
    kanji_data = load_json("kanji_n5.json")
    lessons_data = load_json("kanji_lessons.json")
    sentences_data = load_json("kanji_sentences.json")
    vocab_data = load_json("kanji_vocabulary_supplemental.json")
    cultural_data = load_json("cultural_notes.json")
    print("✅ Loaded all files")
    print()

    # Create lookup maps
    kanji_map = {k['id']: k for k in kanji_data['kanji']}
    lesson_map = {l['id']: l for l in lessons_data['lessons']}

    print("🔗 Phase 3: Linking sentences to lessons...")
    print()

    # For each sentence, determine which lessons it belongs to
    # based on the kanji it uses
    for sentence in sentences_data['sentences']:
        lesson_ids_for_sentence = set()

        # Check which kanji this sentence uses
        for kanji_id in sentence['kanji_ids']:
            # Find all lessons that teach this kanji
            for lesson in lessons_data['lessons']:
                if kanji_id in lesson['kanji_ids']:
                    lesson_ids_for_sentence.add(lesson['id'])

        sentence['lesson_ids'] = sorted(list(lesson_ids_for_sentence))

    # Update lessons with sentence IDs
    for lesson in lessons_data['lessons']:
        lesson_sentences = []
        for sentence in sentences_data['sentences']:
            if lesson['id'] in sentence['lesson_ids']:
                lesson_sentences.append(sentence['id'])
        lesson['sentence_ids'] = lesson_sentences

    print(f"✅ Linked {len(sentences_data['sentences'])} sentences to lessons")
    for lesson in lessons_data['lessons']:
        print(f"   Lesson {lesson['number']}: {len(lesson['sentence_ids'])} sentences")
    print()

    print("🔗 Phase 4: Updating kanji_n5.json with new linking fields...")
    print()

    # Add new fields to each kanji entry
    kanji_updated_count = 0
    for kanji in kanji_data['kanji']:
        kanji_id = kanji['id']

        # Find sentences that use this kanji
        sentence_ids = []
        for sentence in sentences_data['sentences']:
            if kanji_id in sentence['kanji_ids']:
                sentence_ids.append(sentence['id'])

        # Find lessons that teach this kanji
        lesson_ids = []
        for lesson in lessons_data['lessons']:
            if kanji_id in lesson['kanji_ids']:
                lesson_ids.append(lesson['id'])

        # Find cultural notes that reference this kanji
        cultural_ids = []
        for note in cultural_data['notes']:
            if kanji_id in note['kanji_ids']:
                cultural_ids.append(note['id'])

        # Add new fields (only if they have data)
        if sentence_ids:
            kanji['sentence_ids'] = sentence_ids
            kanji_updated_count += 1
        else:
            kanji['sentence_ids'] = []

        if lesson_ids:
            kanji['lesson_ids'] = lesson_ids
        else:
            kanji['lesson_ids'] = []

        if cultural_ids:
            kanji['cultural_note_ids'] = cultural_ids
        else:
            kanji['cultural_note_ids'] = []

    print(f"✅ Updated {kanji_updated_count} kanji with sentence links")
    print()

    # Update metadata
    kanji_data['metadata']['lastUpdated'] = datetime.now().isoformat()
    kanji_data['metadata']['linkedData'] = {
        'sentences': True,
        'lessons': True,
        'culturalNotes': True,
        'linkedAt': datetime.now().isoformat()
    }

    lessons_data['metadata']['linkedAt'] = datetime.now().isoformat()
    sentences_data['metadata']['linkedAt'] = datetime.now().isoformat()

    # Save all updated files
    print("💾 Saving updated files...")
    kanji_path = save_json(kanji_data, "kanji_n5.json")
    lessons_path = save_json(lessons_data, "kanji_lessons.json")
    sentences_path = save_json(sentences_data, "kanji_sentences.json")
    vocab_path = save_json(vocab_data, "kanji_vocabulary_supplemental.json")
    cultural_path = save_json(cultural_data, "cultural_notes.json")
    print("✅ All files saved")
    print()

    # Generate statistics
    print("=" * 80)
    print("LINKING STATISTICS")
    print("=" * 80)
    print()

    print("📊 Kanji → Sentences Linking:")
    kanji_with_sentences = sum(1 for k in kanji_data['kanji'] if k.get('sentence_ids', []))
    print(f"   Kanji with sentences: {kanji_with_sentences}/88 ({kanji_with_sentences/88*100:.1f}%)")
    print()

    print("📊 Kanji → Lessons Linking:")
    kanji_in_lessons = sum(1 for k in kanji_data['kanji'] if k.get('lesson_ids', []))
    print(f"   Kanji in lessons: {kanji_in_lessons}/88 ({kanji_in_lessons/88*100:.1f}%)")
    print()

    print("📊 Sentences → Lessons Linking:")
    sentences_in_lessons = sum(1 for s in sentences_data['sentences'] if s.get('lesson_ids', []))
    print(f"   Sentences in lessons: {sentences_in_lessons}/{len(sentences_data['sentences'])}")
    print()

    print("📊 Detailed Breakdown:")
    print()
    for lesson in lessons_data['lessons']:
        print(f"Lesson {lesson['number']}: {lesson['title']}")
        print(f"   Kanji: {len(lesson['kanji_ids'])} ({', '.join(lesson['kanji_chars'][:5])}{'...' if len(lesson['kanji_chars']) > 5 else ''})")
        print(f"   Sentences: {len(lesson['sentence_ids'])}")
        print()

    # Show sample kanji with all links
    print("=" * 80)
    print("SAMPLE: Kanji with Full Linking")
    print("=" * 80)
    print()

    sample_kanji_ids = ['kanji_n5_大', 'kanji_n5_一', 'kanji_n5_日']
    for kanji_id in sample_kanji_ids:
        kanji = kanji_map.get(kanji_id)
        if kanji:
            print(f"Kanji: {kanji['kanji']} ({kanji_id})")
            print(f"   Examples (vocab): {len(kanji.get('examples', []))} words")
            print(f"   Sentences: {len(kanji.get('sentence_ids', []))} sentences")
            print(f"   Lessons: {', '.join(kanji.get('lesson_ids', []))}")
            print(f"   Cultural notes: {len(kanji.get('cultural_note_ids', []))}")
            print()

    print("=" * 80)
    print("✅ PHASE 3 & 4 COMPLETE!")
    print("=" * 80)
    print()
    print("📁 Updated files:")
    print(f"   ✓ {kanji_path} (with new linking fields)")
    print(f"   ✓ {lessons_path} (with sentence links)")
    print(f"   ✓ {sentences_path} (with lesson links)")
    print(f"   ✓ {vocab_path}")
    print(f"   ✓ {cultural_path}")
    print()
    print("🎯 Ready for app integration!")
    print("=" * 80)

if __name__ == "__main__":
    main()
