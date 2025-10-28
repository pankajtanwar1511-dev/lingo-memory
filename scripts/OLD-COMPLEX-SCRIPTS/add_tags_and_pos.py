#!/usr/bin/env python3
"""
Add Part of Speech and Semantic Tags to N5 Vocabulary

Uses:
- Fugashi for grammatical analysis (part of speech)
- Semantic categorization based on meanings and common patterns
"""

import json
import re
from pathlib import Path
from typing import List, Set

try:
    import fugashi
    FUGASHI_AVAILABLE = True
except ImportError:
    FUGASHI_AVAILABLE = False
    print("⚠️  fugashi not available. Install: pip install fugashi unidic-lite")
    exit(1)


class TagEnricher:
    """Add tags and part of speech to vocabulary cards"""

    def __init__(self):
        self.tagger = fugashi.Tagger()

        # Semantic category mappings based on English meanings
        self.semantic_patterns = {
            'time': [
                'morning', 'afternoon', 'evening', 'night', 'today', 'yesterday', 'tomorrow',
                'day', 'week', 'month', 'year', 'hour', 'minute', 'second', 'time', 'o\'clock',
                'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
                'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
                'september', 'october', 'november', 'december', 'when', 'now', 'before', 'after'
            ],
            'food': [
                'food', 'eat', 'drink', 'meal', 'breakfast', 'lunch', 'dinner', 'rice', 'meat',
                'fish', 'vegetable', 'fruit', 'water', 'tea', 'coffee', 'milk', 'bread', 'egg',
                'restaurant', 'taste', 'delicious', 'hungry', 'thirsty', 'cook', 'dish'
            ],
            'family': [
                'mother', 'father', 'parent', 'child', 'son', 'daughter', 'brother', 'sister',
                'family', 'grandfather', 'grandmother', 'husband', 'wife', 'baby', 'person'
            ],
            'location': [
                'place', 'here', 'there', 'where', 'inside', 'outside', 'up', 'down', 'left',
                'right', 'front', 'back', 'side', 'near', 'far', 'top', 'bottom', 'between'
            ],
            'home': [
                'house', 'home', 'room', 'door', 'window', 'floor', 'wall', 'ceiling', 'bed',
                'desk', 'chair', 'table', 'bathroom', 'kitchen', 'garden', 'entrance'
            ],
            'school': [
                'school', 'student', 'teacher', 'study', 'learn', 'class', 'lesson', 'test',
                'exam', 'homework', 'book', 'paper', 'pen', 'pencil', 'desk', 'classroom'
            ],
            'work': [
                'work', 'job', 'company', 'office', 'business', 'employee', 'boss', 'meeting',
                'schedule', 'busy', 'colleague', 'salary', 'overtime'
            ],
            'transportation': [
                'car', 'train', 'bus', 'bicycle', 'taxi', 'subway', 'station', 'airport',
                'plane', 'ship', 'ticket', 'ride', 'drive', 'walk', 'run', 'go', 'come'
            ],
            'weather': [
                'weather', 'rain', 'snow', 'wind', 'cloud', 'sunny', 'cloudy', 'hot', 'cold',
                'warm', 'cool', 'temperature', 'sky', 'umbrella'
            ],
            'body': [
                'body', 'head', 'face', 'eye', 'ear', 'nose', 'mouth', 'hand', 'foot', 'arm',
                'leg', 'finger', 'toe', 'hair', 'stomach', 'heart', 'back'
            ],
            'clothes': [
                'clothes', 'shirt', 'pants', 'dress', 'skirt', 'shoes', 'hat', 'jacket',
                'wear', 'put on', 'take off', 'suit', 'uniform'
            ],
            'numbers': [
                'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
                'hundred', 'thousand', 'many', 'few', 'number', 'count', 'first', 'second'
            ],
            'color': [
                'color', 'red', 'blue', 'yellow', 'green', 'black', 'white', 'brown', 'pink',
                'purple', 'orange', 'gray'
            ],
            'emotion': [
                'happy', 'sad', 'angry', 'fun', 'enjoy', 'love', 'like', 'hate', 'fear',
                'worry', 'glad', 'sorry', 'thank', 'feeling', 'mood', 'heart'
            ],
            'question': [
                'what', 'who', 'when', 'where', 'why', 'how', 'which', 'whose'
            ],
            'animals': [
                'dog', 'cat', 'bird', 'fish', 'animal', 'pet', 'horse', 'cow', 'pig'
            ],
            'nature': [
                'mountain', 'river', 'sea', 'ocean', 'lake', 'tree', 'flower', 'grass',
                'forest', 'park', 'nature', 'sun', 'moon', 'star', 'earth'
            ],
            'actions': [
                'do', 'make', 'go', 'come', 'see', 'look', 'hear', 'listen', 'speak', 'talk',
                'read', 'write', 'eat', 'drink', 'sleep', 'wake', 'stand', 'sit', 'walk',
                'run', 'buy', 'sell', 'give', 'take', 'open', 'close', 'enter', 'exit'
            ]
        }

    def get_part_of_speech(self, word: str) -> List[str]:
        """Analyze word and return part of speech tags"""
        if not word:
            return ["unknown"]

        pos_tags = set()

        try:
            # Parse word with fugashi
            tokens = self.tagger(word)

            for token in tokens:
                features = token.feature

                # Get main POS
                pos = features.pos1 if hasattr(features, 'pos1') else None

                if pos:
                    # Map Japanese POS to English
                    if pos == '名詞':  # Noun
                        pos_tags.add('noun')
                    elif pos == '動詞':  # Verb
                        pos_tags.add('verb')
                    elif pos == '形容詞':  # Adjective
                        pos_tags.add('adjective')
                    elif pos == '副詞':  # Adverb
                        pos_tags.add('adverb')
                    elif pos == '助詞':  # Particle
                        pos_tags.add('particle')
                    elif pos == '助動詞':  # Auxiliary verb
                        pos_tags.add('auxiliary')
                    elif pos == '接続詞':  # Conjunction
                        pos_tags.add('conjunction')
                    elif pos == '連体詞':  # Adnominal
                        pos_tags.add('adnominal')
                    elif pos == '感動詞':  # Interjection
                        pos_tags.add('interjection')
                    elif pos == '接頭詞':  # Prefix
                        pos_tags.add('prefix')
                    elif pos == '接尾詞':  # Suffix
                        pos_tags.add('suffix')

                # Get detailed POS (i-adjective, na-adjective, etc.)
                pos2 = features.pos2 if hasattr(features, 'pos2') else None
                if pos2:
                    if pos2 == '自立':
                        if pos == '形容詞':
                            pos_tags.add('i-adjective')
                    elif pos2 == '形容動詞語幹':
                        pos_tags.add('na-adjective')

        except Exception as e:
            print(f"   Error analyzing '{word}': {e}")

        return list(pos_tags) if pos_tags else ["unknown"]

    def get_semantic_tags(self, meanings: List[str]) -> Set[str]:
        """Get semantic category tags based on English meanings"""
        tags = set()

        # Combine all meanings into lowercase text
        meaning_text = ' '.join(meanings).lower()

        # Check each category
        for category, keywords in self.semantic_patterns.items():
            for keyword in keywords:
                # Use word boundaries to avoid partial matches
                if re.search(r'\b' + re.escape(keyword) + r'\b', meaning_text):
                    tags.add(category)
                    break  # One match per category is enough

        return tags

    def enrich_cards(self, cards: List[dict]) -> List[dict]:
        """Add part of speech and semantic tags to all cards"""
        print("\n🏷️  Adding tags and part of speech...")

        for i, card in enumerate(cards):
            kanji = card.get('kanji', '').strip()
            kana = card.get('kana', '').strip()
            meanings = card.get('meaning', [])

            # Determine word to analyze (prefer kanji, fall back to kana)
            word = kanji if kanji else kana

            # Get part of speech
            pos = self.get_part_of_speech(word)
            card['partOfSpeech'] = pos

            # Get semantic tags
            semantic_tags = self.get_semantic_tags(meanings)

            # Combine with POS tags
            all_tags = semantic_tags.union(set(pos))

            # Remove 'unknown' if we have real tags
            if len(all_tags) > 1 and 'unknown' in all_tags:
                all_tags.remove('unknown')

            card['tags'] = sorted(list(all_tags))

            # Progress
            if (i + 1) % 100 == 0:
                print(f"   Processed {i + 1}/{len(cards)} cards...")

        print(f"   ✅ Processed all {len(cards)} cards")

        # Print statistics
        pos_counts = {}
        tag_counts = {}

        for card in cards:
            for pos in card.get('partOfSpeech', []):
                pos_counts[pos] = pos_counts.get(pos, 0) + 1

            for tag in card.get('tags', []):
                tag_counts[tag] = tag_counts.get(tag, 0) + 1

        print(f"\n   Part of Speech Distribution:")
        for pos, count in sorted(pos_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"      {pos}: {count}")

        print(f"\n   Top Tags:")
        for tag, count in sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:15]:
            print(f"      {tag}: {count}")

        return cards


def main():
    print("=" * 60)
    print("Add Tags and Part of Speech to N5 Vocabulary")
    print("=" * 60)

    # Load dataset
    input_file = Path('public/seed-data/n5-comprehensive.json')
    print(f"\n📖 Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data.get('vocabulary', [])
    print(f"   ✅ Loaded {len(cards)} cards")

    # Enrich with tags
    enricher = TagEnricher()
    enriched_cards = enricher.enrich_cards(cards)

    # Update data
    data['vocabulary'] = enriched_cards

    # Save
    print(f"\n💾 Saving to {input_file}...")
    with open(input_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("\n✅ Done! Tags and part of speech added to all cards")
    print("=" * 60)


if __name__ == '__main__':
    main()
