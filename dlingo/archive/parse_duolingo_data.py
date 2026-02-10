#!/usr/bin/env python3
"""
Parse Duolingo data.txt and categorize by part of speech.
Creates a well-formatted JSON file for quiz integration.
"""

import json
import re
from typing import Dict, List, Tuple

def determine_part_of_speech(japanese: str, english: str) -> str:
    """
    Determine the part of speech based on Japanese grammar patterns and English hints.
    """
    # Remove whitespace
    jp = japanese.strip()
    eng = english.strip().lower()

    # Particles (most specific first)
    particles = ['は', 'を', 'に', 'が', 'と', 'で', 'から', 'まで', 'の', 'へ', 'や', 'か', 'も', 'ね', 'な', 'よ']
    if jp in particles:
        return 'particle'

    # Numbers
    number_kanji = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '〇']
    if any(num in jp for num in number_kanji) and any(word in eng for word in ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'hundred', 'thousand', 'zero', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty']):
        return 'number'

    # Counters (Japanese counting words)
    counter_patterns = ['つ', 'ひき', 'にん', 'まい', 'ほん', 'さつ', 'だい', 'かい', '階', '時', '分', '日', '月', '年', '時間', 'ばん']
    if any(jp.endswith(counter) for counter in counter_patterns) and not jp.endswith('ます'):
        if any(word in eng for word in ['floor', 'people', 'things', 'o\'clock', 'hours', 'minutes', 'days', 'month', 'year', 'number']):
            return 'counter'

    # Verbs (check for various forms)
    verb_endings = [
        'ます', 'ません', 'ました', 'ませんでした',
        'ましょう', 'ましょうか', 'ませんか',
        'たいです', 'たくないです',
        'します', 'しません', 'しました',
        'あります', 'います', 'きます', 'します',
        'ります', 'きます', 'ぎます', 'びます', 'みます', 'ちます', 'います', 'ります'
    ]
    if any(jp.endswith(ending) for ending in verb_endings):
        return 'verb'

    # Check English for verb indicators
    verb_indicators = ['(will)', '(am)', '(is)', '(are)', 'going to', 'want to', 'do not', 'does not', 'will', 'went', 'ate', 'slept', 'played', 'watched', 'came', 'found', 'practiced', 'take', 'make', 'eat', 'drink', 'sleep', 'go', 'come', 'see', 'watch', 'play', 'study', 'work', 'wash', 'clean', 'cook', 'write', 'read', 'listen', 'speak', 'buy', 'sell']
    if any(indicator in eng for indicator in verb_indicators):
        return 'verb'

    # Na-adjectives (common ones)
    na_adjectives = ['きれい', 'しずか', 'にぎやか', 'ゆうめい', 'べんり', 'ふべん', 'しんせつ', 'たいへん', 'げんき', 'ひま', 'すてき', 'おしゃれ', 'だいすき', 'すき', 'にんき', 'カラフル', 'ダサい']
    if any(jp.startswith(adj) or jp == adj for adj in na_adjectives):
        return 'na-adjective'

    # I-adjectives (ending in い but not verbs)
    if jp.endswith('い') and not jp.endswith('ます') and not jp.endswith('たい'):
        # Check if it's describing something (adjective hints in English)
        adj_indicators = ['big', 'small', 'good', 'bad', 'hot', 'cold', 'warm', 'cool', 'expensive', 'cheap', 'new', 'old', 'long', 'short', 'high', 'low', 'fast', 'slow', 'delicious', 'tasty', 'sweet', 'spicy', 'salty', 'difficult', 'easy', 'fun', 'boring', 'interesting', 'cute', 'beautiful', 'clean', 'dirty', 'busy', 'free', 'dark', 'bright', 'heavy', 'light', 'near', 'far', 'tall', 'short', 'wide', 'narrow', 'kind', 'smart', 'noisy', 'quiet', 'scary', 'dangerous', 'sleepy', 'red', 'blue', 'white', 'black', 'yellow', 'convenient', 'inconvenient']
        if any(adj in eng for adj in adj_indicators):
            return 'i-adjective'

    # Adverbs
    adverb_patterns = ['よく', 'ときどき', 'いつも', 'また', 'もう', 'まだ', 'とても', 'ちょっと', 'すこし', 'たくさん', 'ゆっくり', 'はやく', 'そろそろ', 'もうすぐ', 'まず', 'ちゃんと', 'ほんとうに', 'あまり', 'ぜんぶ', 'いっしょに', 'ひとりで']
    if jp in adverb_patterns or jp.startswith('まい'):  # まいにち, まいあさ, etc.
        return 'adverb'

    # Expressions/Greetings (common phrases)
    expressions = [
        'おはようございます', 'こんにちは', 'こんばんは', 'ありがとうございます',
        'すみません', 'いらっしゃいませ', 'ください', 'おねがいします',
        'よろしくおねがいします', 'はじめまして', 'どうぞよろしく',
        'じゃあね', 'またあした', 'さようなら', 'いってきます', 'いってらっしゃい',
        'ただいま', 'おかえり', 'いただきます', 'ごちそうさま', 'おつかれさま',
        'がんばって', 'だいじょうぶ', 'ようこそ', 'どうですか', 'ほんとうですか',
        'ひさしぶりです'
    ]
    if jp in expressions or 'ませんか' in jp or 'ましょうか' in jp or 'ましょう' in jp:
        if any(phrase in eng for phrase in ['hello', 'good morning', 'good evening', 'thank you', 'excuse me', 'welcome', 'please', 'nice to meet', 'bye', 'see you', 'shall we', 'should we', 'let\'s', 'why don\'t', 'would you like']):
            return 'expression'

    # Question words
    question_words = ['なに', '何', 'だれ', 'どこ', 'いつ', 'どう', 'どの', 'なん', 'どんな', 'いくら', 'どうやって', 'なんで', 'なぜ']
    if any(jp.startswith(q) for q in question_words):
        return 'question-word'

    # Time expressions
    time_words = ['今日', 'きょう', '明日', 'あした', 'きのう', '昨日', '今', 'いま', '今夜', 'こんや', 'こんばん', '今週', 'こんしゅう', '先週', 'せんしゅう', '来週', 'らいしゅう', '先月', 'せんげつ', '来月', 'らいげつ', 'きょねん', '去年', 'らいねん', '来年', 'あさって', 'しあさって', 'おととい', 'まいにち', 'まいあさ', 'まいばん', 'まいしゅう']
    if jp in time_words:
        return 'time-expression'

    # Location/Direction words
    location_words = ['ここ', 'そこ', 'あそこ', 'どこ', '上', '下', '前', 'まえ', '後ろ', 'うしろ', '右', '左', '中', '外', 'そと', 'となり', 'ちかく', 'まんなか', 'すみ']
    if jp in location_words:
        return 'location'

    # Proper nouns (places, names)
    proper_nouns = ['日本', 'にほん', '東京', 'とうきょう', '京都', 'きょうと', 'おおさか', '大阪', 'さいたま', 'ちば', 'よこはま', 'なごや', 'ほっかいどう', 'ぎんざ', 'はらじゅく', 'しぶや', 'あきはばら', 'あさくさ', 'うえのこうえん', 'ふじさん', 'アメリカ', 'イギリス', 'フランス', 'ドイツ', 'カナダ', 'オーストラリア', 'ブラジル', 'タイ', 'ちゅうごく', '中国', 'かんこく', 'たいわん', 'フィリピン', 'マレーシア', 'ベトナム', 'ニューヨーク', 'トロント', 'ソウル', 'ケン', 'けん', 'ナオミ', 'なおみ', 'ハナ', 'はな', 'タナカ', 'たなか', '田中', 'ヤマグチ', 'やまぐち', '山口', 'ナカヤマ', 'なかやま', '中山', 'サム', 'スミス', 'ヤマダ', '山田', 'エリカ', 'アンドリュー', 'ダニエル']
    if jp in proper_nouns:
        return 'proper-noun'

    # Check for katakana (often loan words, which are typically nouns)
    if re.match(r'^[\u30A0-\u30FF]+$', jp):
        # But check if it's not a verb or adjective
        if not any(jp.endswith(ending) for ending in verb_endings):
            return 'noun'

    # Default to noun if no other category matches
    return 'noun'

def parse_duolingo_file(filepath: str) -> List[Dict]:
    """
    Parse the Duolingo data.txt file into structured entries.
    """
    entries = []

    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Parse every 3 lines (japanese, english, blank)
    for i in range(0, len(lines), 3):
        if i + 1 >= len(lines):
            break

        japanese = lines[i].strip()
        english = lines[i + 1].strip()

        if not japanese or not english:
            continue

        # Determine part of speech
        pos = determine_part_of_speech(japanese, english)

        # Create entry
        entry = {
            'id': len(entries) + 1,
            'japanese': japanese,
            'english': english,
            'partOfSpeech': pos,
            'source': 'duolingo'
        }

        entries.append(entry)

    return entries

def create_summary(entries: List[Dict]) -> Dict:
    """
    Create summary statistics for the parsed data.
    """
    pos_counts = {}
    for entry in entries:
        pos = entry['partOfSpeech']
        pos_counts[pos] = pos_counts.get(pos, 0) + 1

    return {
        'totalEntries': len(entries),
        'partOfSpeechBreakdown': dict(sorted(pos_counts.items(), key=lambda x: x[1], reverse=True))
    }

def main():
    input_file = '/home/pankaj/bumble/lingomemory/duolingo/data.txt'
    output_file = '/home/pankaj/bumble/lingomemory/duolingo/duolingo_vocab.json'
    summary_file = '/home/pankaj/bumble/lingomemory/duolingo/summary.json'

    print("Parsing Duolingo data...")
    entries = parse_duolingo_file(input_file)

    print(f"Parsed {len(entries)} entries")

    # Create summary
    summary = create_summary(entries)

    # Save entries to JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)

    print(f"Saved vocabulary to: {output_file}")

    # Save summary
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print(f"Saved summary to: {summary_file}")

    # Print summary
    print("\n=== SUMMARY ===")
    print(f"Total entries: {summary['totalEntries']}")
    print("\nPart of Speech Breakdown:")
    for pos, count in summary['partOfSpeechBreakdown'].items():
        percentage = (count / summary['totalEntries']) * 100
        print(f"  {pos:20} {count:4} ({percentage:5.1f}%)")

if __name__ == '__main__':
    main()
