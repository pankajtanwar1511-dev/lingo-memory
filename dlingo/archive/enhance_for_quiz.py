#!/usr/bin/env python3
"""
Enhance the Duolingo vocabulary data with additional metadata for quiz integration.
"""

import json
import re

def estimate_jlpt_level(japanese: str, english: str, pos: str) -> str:
    """
    Estimate JLPT level based on word complexity and common patterns.
    N5: Basic greetings, numbers, simple daily expressions
    N4: Common verbs, adjectives, everyday conversation
    N3: More complex grammar, varied vocabulary
    """
    # Very basic words and greetings (N5)
    n5_patterns = [
        'です', 'これ', 'それ', 'あれ', 'ここ', 'そこ', 'あそこ',
        'はい', 'いいえ', '私', 'あなた', '今', '今日', '明日', 'きのう',
        'おはよう', 'こんにちは', 'こんばんは', 'ありがとう', 'すみません',
        'one', 'two', 'three', 'hello', 'thank you', 'yes', 'no'
    ]

    if pos in ['number', 'particle']:
        return 'N5'

    if any(pattern in japanese or pattern in english for pattern in n5_patterns):
        return 'N5'

    # Common counters and time expressions (N5-N4)
    if pos in ['counter', 'time-expression']:
        return 'N5'

    # Basic adjectives and simple verbs (N4)
    basic_verbs = ['食べます', '飲みます', '見ます', '行きます', '来ます', '買います']
    if any(verb in japanese for verb in basic_verbs):
        return 'N5'

    # More complex verbs with たい form, negative forms
    if 'たい' in japanese or 'たくない' in japanese or 'ません' in japanese:
        return 'N4'

    # Complex expressions and less common vocabulary
    if pos == 'expression' and len(japanese) > 8:
        return 'N4'

    # Katakana words (usually N4-N3 loan words)
    if re.match(r'^[\u30A0-\u30FF]+$', japanese) and len(japanese) > 4:
        return 'N3'

    # Default distribution
    if pos == 'proper-noun':
        return 'N5'
    elif pos in ['i-adjective', 'na-adjective', 'adverb']:
        return 'N4'
    else:
        return 'N4'

def calculate_difficulty(japanese: str, english: str, pos: str, jlpt: str) -> int:
    """
    Calculate difficulty score 1-10.
    Based on: JLPT level, word length, complexity, part of speech
    """
    score = 3  # Base score

    # JLPT level contribution
    jlpt_scores = {'N5': 0, 'N4': 2, 'N3': 4}
    score += jlpt_scores.get(jlpt, 2)

    # Length contribution
    if len(japanese) > 8:
        score += 2
    elif len(japanese) > 5:
        score += 1

    # Part of speech contribution
    if pos in ['particle', 'number', 'counter']:
        score -= 1  # Easier
    elif pos in ['expression', 'verb']:
        score += 1  # Harder
    elif pos == 'proper-noun':
        score -= 1  # Easier

    # Multiple meanings increase difficulty
    if ',' in english:
        meanings_count = len(english.split(','))
        if meanings_count > 2:
            score += 1

    # Kanji presence increases difficulty
    if re.search(r'[\u4E00-\u9FFF]', japanese):
        score += 1

    # Clamp between 1-10
    return max(1, min(10, score))

def suggest_quiz_types(pos: str) -> list:
    """
    Suggest appropriate quiz types based on part of speech.
    """
    quiz_types = ['multiple-choice', 'typing']  # Default

    if pos == 'verb':
        quiz_types.extend(['conjugation', 'fill-in-blank'])
    elif pos in ['i-adjective', 'na-adjective']:
        quiz_types.extend(['conjugation', 'sentence-building'])
    elif pos == 'noun':
        quiz_types.extend(['matching', 'listening'])
    elif pos == 'particle':
        quiz_types.extend(['fill-in-blank', 'sentence-building'])
    elif pos == 'expression':
        quiz_types.extend(['listening', 'context-matching'])
    elif pos in ['number', 'counter']:
        quiz_types.extend(['listening', 'matching'])

    return quiz_types

def generate_tags(japanese: str, english: str, pos: str) -> list:
    """
    Generate relevant tags for categorization and filtering.
    """
    tags = [pos]

    # Thematic tags based on English meaning
    themes = {
        'food': ['food', 'eat', 'drink', 'rice', 'meat', 'fish', 'vegetable', 'fruit', 'restaurant', 'chef', 'kitchen', 'cooking', 'delicious', 'taste', 'meal', 'breakfast', 'lunch', 'dinner'],
        'travel': ['travel', 'trip', 'train', 'station', 'bus', 'plane', 'airport', 'hotel', 'ticket', 'passport'],
        'shopping': ['buy', 'shop', 'store', 'expensive', 'cheap', 'price', 'yen', 'clothes', 'shopping'],
        'family': ['family', 'mother', 'father', 'sister', 'brother', 'parent', 'child', 'daughter', 'son'],
        'time': ['time', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'morning', 'evening', 'night'],
        'location': ['here', 'there', 'where', 'place', 'city', 'country', 'station', 'park', 'school'],
        'school': ['school', 'student', 'teacher', 'study', 'class', 'university', 'homework', 'test'],
        'work': ['work', 'company', 'office', 'job', 'business', 'meeting', 'colleague'],
        'weather': ['weather', 'rain', 'snow', 'sunny', 'cloudy', 'hot', 'cold', 'warm'],
        'emotions': ['happy', 'sad', 'fun', 'boring', 'interesting', 'exciting', 'scary', 'like', 'love'],
        'body': ['body', 'head', 'eye', 'ear', 'mouth', 'hand', 'foot', 'face'],
        'animals': ['animal', 'dog', 'cat', 'bird', 'fish', 'zoo'],
        'colors': ['red', 'blue', 'yellow', 'green', 'white', 'black', 'color'],
        'numbers': ['one', 'two', 'three', 'four', 'five', 'number', 'hundred', 'thousand']
    }

    eng_lower = english.lower()
    for theme, keywords in themes.items():
        if any(keyword in eng_lower for keyword in keywords):
            tags.append(theme)

    # Grammar tags
    if 'ます' in japanese:
        tags.append('masu-form')
    if 'たい' in japanese:
        tags.append('desire-form')
    if 'ません' in japanese:
        tags.append('negative')
    if 'ました' in japanese:
        tags.append('past-tense')

    return list(set(tags))  # Remove duplicates

def enhance_vocabulary(input_file: str, output_file: str):
    """
    Load vocabulary and enhance with metadata.
    """
    with open(input_file, 'r', encoding='utf-8') as f:
        entries = json.load(f)

    enhanced_entries = []

    for entry in entries:
        japanese = entry['japanese']
        english = entry['english']
        pos = entry['partOfSpeech']

        # Add enhanced metadata
        jlpt_level = estimate_jlpt_level(japanese, english, pos)
        difficulty = calculate_difficulty(japanese, english, pos, jlpt_level)
        quiz_types = suggest_quiz_types(pos)
        tags = generate_tags(japanese, english, pos)

        enhanced_entry = {
            **entry,
            'jlptLevel': jlpt_level,
            'difficulty': difficulty,
            'suggestedQuizTypes': quiz_types,
            'tags': tags,
            'deck': 'duolingo-basics',
            'examples': []  # Placeholder for future example sentences
        }

        enhanced_entries.append(enhanced_entry)

    # Save enhanced data
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(enhanced_entries, f, ensure_ascii=False, indent=2)

    # Create statistics
    stats = {
        'totalEntries': len(enhanced_entries),
        'byJlptLevel': {},
        'byDifficulty': {},
        'byPartOfSpeech': {},
        'averageDifficulty': sum(e['difficulty'] for e in enhanced_entries) / len(enhanced_entries)
    }

    for entry in enhanced_entries:
        # JLPT stats
        jlpt = entry['jlptLevel']
        stats['byJlptLevel'][jlpt] = stats['byJlptLevel'].get(jlpt, 0) + 1

        # Difficulty stats
        diff = entry['difficulty']
        stats['byDifficulty'][diff] = stats['byDifficulty'].get(diff, 0) + 1

        # POS stats
        pos = entry['partOfSpeech']
        stats['byPartOfSpeech'][pos] = stats['byPartOfSpeech'].get(pos, 0) + 1

    return enhanced_entries, stats

def main():
    input_file = '/home/pankaj/bumble/lingomemory/duolingo/duolingo_vocab.json'
    output_file = '/home/pankaj/bumble/lingomemory/duolingo/duolingo_vocab_enhanced.json'
    stats_file = '/home/pankaj/bumble/lingomemory/duolingo/enhanced_stats.json'

    print("Enhancing Duolingo vocabulary with quiz metadata...")
    enhanced_entries, stats = enhance_vocabulary(input_file, output_file)

    print(f"\nEnhanced {len(enhanced_entries)} entries")
    print(f"Saved to: {output_file}")

    # Save stats
    with open(stats_file, 'w', encoding='utf-8') as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)

    print(f"Saved statistics to: {stats_file}")

    # Print stats
    print("\n=== ENHANCED STATISTICS ===")
    print(f"Total entries: {stats['totalEntries']}")
    print(f"Average difficulty: {stats['averageDifficulty']:.1f}/10")

    print("\nJLPT Level Distribution:")
    for level in sorted(stats['byJlptLevel'].keys()):
        count = stats['byJlptLevel'][level]
        pct = (count / stats['totalEntries']) * 100
        print(f"  {level}: {count:4} ({pct:5.1f}%)")

    print("\nDifficulty Distribution:")
    for diff in sorted(stats['byDifficulty'].keys()):
        count = stats['byDifficulty'][diff]
        pct = (count / stats['totalEntries']) * 100
        print(f"  Level {diff:2}: {count:4} ({pct:5.1f}%)")

    print("\nTop 10 Part of Speech:")
    sorted_pos = sorted(stats['byPartOfSpeech'].items(), key=lambda x: x[1], reverse=True)
    for pos, count in sorted_pos[:10]:
        pct = (count / stats['totalEntries']) * 100
        print(f"  {pos:20}: {count:4} ({pct:5.1f}%)")

if __name__ == '__main__':
    main()
