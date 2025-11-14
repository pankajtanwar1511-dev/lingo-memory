#!/usr/bin/env python3
"""
Professional JMDict Sense Filter for N5
Based on strategies used by Jisho.org, Yomitan, and other production tools

Key Features:
1. Uses JMDict's built-in priority tags (news1, ichi1, nf01-24)
2. Compatible with JLPT N5 word lists
3. Multi-factor scoring for optimal sense selection
4. Filters out advanced/specialized vocabulary
"""

import json
import re
from typing import List, Dict, Any, Set

# ============================================================================
# CONFIGURATION
# ============================================================================

# JMDict Priority Tags for Common Words (used by Jisho.org)
COMMON_PRIORITIES = ['news1', 'ichi1', 'spec1', 'spec2', 'gai1']

# Frequency tags for N5 level (first ~3,000 most common words)
N5_FREQUENCY_TAGS = ['nf01', 'nf02', 'nf03', 'nf04', 'nf05', 'nf06']

# Keywords that indicate advanced/specialized content
ADVANCED_KEYWORDS = [
    'baseball', 'batter', 'intentionally throw',
    'martial arts', 'sumo', 'judo', 'kendo',
    'buddhist', 'buddhism', 'shinto', 'zen',
    'literary', 'poetic', 'archaic', 'archaism', 'obsolete',
    'humble', 'honorific', 'respectful language',
    'gambling', 'philandery', 'vulgar', 'slang',
    'technical term', 'medical term', 'legal term',
    'computing', 'mathematics', 'physics', 'chemistry'
]

# Misc tags to filter out
ADVANCED_MISC_TAGS = [
    'archaism', 'dated term', 'obsolete term',
    'rare', 'slang', 'vulgar expression or word',
    'Buddhist term', 'Shinto term',
    'honorific or respectful (sonkeigo) language',
    'humble (kenjougo) language'
]


# ============================================================================
# CORE FILTERING FUNCTIONS
# ============================================================================

def has_common_priority(verb_entry: Dict[str, Any]) -> bool:
    """
    Check if word has common priority tag (Jisho.org method)
    
    Args:
        verb_entry: Dictionary with 'priorities' field
        
    Returns:
        True if word is marked as common
    """
    priorities = verb_entry.get('priorities', [])
    return any(pri in COMMON_PRIORITIES for pri in priorities)


def has_n5_frequency(verb_entry: Dict[str, Any]) -> bool:
    """
    Check if word is in N5 frequency range (nf01-nf06)
    
    Returns:
        True if word is in top ~3,000 most frequent
    """
    priorities = verb_entry.get('priorities', [])
    return any(pri in N5_FREQUENCY_TAGS for pri in priorities)


def contains_advanced_keywords(sense: Dict[str, Any]) -> bool:
    """
    Check if sense contains advanced vocabulary
    
    Args:
        sense: JMDict sense with 'glosses' field
        
    Returns:
        True if sense should be filtered out
    """
    glosses_text = ' '.join(sense.get('glosses', [])).lower()
    return any(keyword in glosses_text for keyword in ADVANCED_KEYWORDS)


def has_advanced_misc_tags(sense: Dict[str, Any]) -> bool:
    """
    Check if sense has specialized misc tags
    
    Returns:
        True if sense should be filtered out
    """
    misc = sense.get('misc', [])
    return any(tag in ADVANCED_MISC_TAGS for tag in misc)


def calculate_sense_score(
    sense: Dict[str, Any],
    sense_index: int,
    verb_entry: Dict[str, Any],
    minna_meanings: List[str]
) -> float:
    """
    Calculate relevance score for N5 learners
    
    Higher score = more relevant for beginners
    
    Scoring factors:
    - Priority tags (news1, ichi1) = +10
    - Early position (1st sense) = +10
    - Similarity to Minna meaning = +5
    - Short, simple glosses = +3
    - Advanced keywords = -20
    - Specialized tags = -20
    """
    score = 0.0
    
    # Factor 1: Word-level priority (strongest signal)
    priorities = verb_entry.get('priorities', [])
    if 'news1' in priorities:
        score += 10
    if 'ichi1' in priorities:
        score += 8
    if any(f'nf{i:02d}' in priorities for i in range(1, 7)):
        score += 5
    
    # Factor 2: Sense position (earlier = more common)
    position_score = max(0, 10 - sense_index)
    score += position_score
    
    # Factor 3: Similarity to Minna meanings
    glosses_text = ' '.join(sense.get('glosses', [])).lower()
    for minna_meaning in minna_meanings:
        minna_words = set(re.findall(r'\w+', minna_meaning.lower()))
        matches = sum(1 for word in minna_words if word in glosses_text)
        score += matches * 2.5
    
    # Factor 4: Gloss simplicity
    glosses = sense.get('glosses', [])
    if glosses:
        avg_words = sum(len(g.split()) for g in glosses) / len(glosses)
        if avg_words <= 3:  # Short = basic
            score += 3
    
    # Factor 5: Penalties for advanced content
    if contains_advanced_keywords(sense):
        score -= 20
    if has_advanced_misc_tags(sense):
        score -= 20
    
    return score


# ============================================================================
# MAIN FILTERING STRATEGIES
# ============================================================================

def strategy_simple(verb_entry: Dict[str, Any], max_senses: int = 2) -> List[Dict[str, Any]]:
    """
    Strategy 1: Simple - Just take first N senses
    
    Works well because JMDict already orders senses by frequency
    """
    senses = verb_entry.get('jmdict_verb_senses_only', [])
    return senses[:max_senses]


def strategy_priority_based(verb_entry: Dict[str, Any], max_senses: int = 2) -> List[Dict[str, Any]]:
    """
    Strategy 2: Priority-based (Jisho.org method)
    
    - Common words (news1, ichi1): take 2-3 senses
    - Rare words: take only 1 sense
    """
    senses = verb_entry.get('jmdict_verb_senses_only', [])
    
    if has_common_priority(verb_entry):
        # Common word: trust it more
        return senses[:max_senses]
    else:
        # Rare word: be conservative
        return senses[:1]


def strategy_keyword_filter(verb_entry: Dict[str, Any], max_senses: int = 3) -> List[Dict[str, Any]]:
    """
    Strategy 3: Keyword-based filtering
    
    Remove senses with advanced keywords
    """
    senses = verb_entry.get('jmdict_verb_senses_only', [])
    
    filtered = []
    for sense in senses:
        if not contains_advanced_keywords(sense) and not has_advanced_misc_tags(sense):
            filtered.append(sense)
            if len(filtered) >= max_senses:
                break
    
    return filtered


def strategy_scored(verb_entry: Dict[str, Any], max_senses: int = 2) -> List[Dict[str, Any]]:
    """
    Strategy 4: Multi-factor scoring (RECOMMENDED)
    
    Score each sense by multiple factors, return top N
    """
    senses = verb_entry.get('jmdict_verb_senses_only', [])
    minna_meanings = verb_entry.get('minna_meanings', [])
    
    # Score all senses
    sense_scores = []
    for i, sense in enumerate(senses):
        score = calculate_sense_score(sense, i, verb_entry, minna_meanings)
        sense_scores.append((sense, score))
    
    # Sort by score (descending)
    sense_scores.sort(key=lambda x: x[1], reverse=True)
    
    # Return top N with positive scores
    return [sense for sense, score in sense_scores[:max_senses] if score > 0]


def strategy_hybrid(verb_entry: Dict[str, Any], max_senses: int = 2) -> List[Dict[str, Any]]:
    """
    Strategy 5: Hybrid (BEST - combines all strategies)
    
    1. Check priority tags for quick decisions
    2. Score remaining senses
    3. Filter advanced content
    4. Match against Minna meanings
    """
    senses = verb_entry.get('jmdict_verb_senses_only', [])
    
    # Quick path: Common word with good frequency
    if has_common_priority(verb_entry) and has_n5_frequency(verb_entry):
        # High confidence - filter keywords only
        filtered = []
        for sense in senses[:3]:
            if not contains_advanced_keywords(sense):
                filtered.append(sense)
        return filtered[:max_senses]
    
    # Standard path: Use scoring
    return strategy_scored(verb_entry, max_senses)


# ============================================================================
# CONVENIENCE FUNCTION
# ============================================================================

def filter_jmdict_senses(
    verb_entries: List[Dict[str, Any]],
    strategy: str = 'hybrid',
    max_senses: int = 2
) -> List[Dict[str, Any]]:
    """
    Main function to filter JMDict senses for N5 learners
    
    Args:
        verb_entries: List of verb entries with JMDict data
        strategy: One of 'simple', 'priority', 'keyword', 'scored', 'hybrid'
        max_senses: Maximum number of senses to keep per entry
        
    Returns:
        Filtered list of verb entries
    """
    strategies = {
        'simple': strategy_simple,
        'priority': strategy_priority_based,
        'keyword': strategy_keyword_filter,
        'scored': strategy_scored,
        'hybrid': strategy_hybrid
    }
    
    filter_func = strategies.get(strategy, strategy_hybrid)
    
    results = []
    for entry in verb_entries:
        filtered_entry = entry.copy()
        filtered_entry['jmdict_verb_senses_only'] = filter_func(entry, max_senses)
        filtered_entry['filtered_sense_count'] = len(filtered_entry['jmdict_verb_senses_only'])
        filtered_entry['original_sense_count'] = len(entry.get('jmdict_verb_senses_only', []))
        filtered_entry['filter_strategy'] = strategy
        results.append(filtered_entry)
    
    return results


# ============================================================================
# EXAMPLE USAGE
# ============================================================================

if __name__ == '__main__':
    # Example data
    sample_data = [
        {
            "minna_kanji": "遊ぶ",
            "minna_kana": "あそぶ",
            "minna_meanings": ["enjoy oneself, play"],
            "priorities": ["news1", "ichi1", "nf02"],  # Common word!
            "jmdict_verb_senses_only": [
                {"glosses": ["to play (games, sports)", "to enjoy oneself", "to have a good time"]},
                {"glosses": ["to mess about (with alcohol, gambling, philandery, etc.)"]},
                {"glosses": ["to be idle", "to do nothing", "to be unused"]},
                {"glosses": ["to meet up (with friends)", "to hang out"]},
                {"glosses": ["to give oneself up (to gambling, drinking, etc.)"]},
                {"glosses": ["to go to (for pleasure or for study)"]},
                {"glosses": ["to tease (someone)", "to play (with)"]},
                {"glosses": ["to intentionally throw a ball to lower the batter's concentration"]}
            ]
        },
        {
            "minna_kanji": "会う",
            "minna_kana": "あう",
            "minna_meanings": ["meet [a friend]"],
            "priorities": ["news1", "ichi1", "spec1", "nf01"],  # Very common!
            "jmdict_verb_senses_only": [
                {"glosses": ["to meet", "to encounter", "to see"]},
                {"glosses": ["to have an accident", "to have a bad experience"], "misc": ["word usually written using kana alone"]}
            ]
        }
    ]
    
    print("=" * 70)
    print("TESTING ALL STRATEGIES")
    print("=" * 70)
    
    for strategy_name in ['simple', 'priority', 'keyword', 'scored', 'hybrid']:
        print(f"\n{'='*70}")
        print(f"Strategy: {strategy_name.upper()}")
        print('='*70)
        
        results = filter_jmdict_senses(sample_data, strategy=strategy_name, max_senses=2)
        
        for entry in results:
            print(f"\n{entry['minna_kanji']} ({entry['minna_kana']})")
            print(f"  Priority tags: {entry.get('priorities', [])}")
            print(f"  Original: {entry['original_sense_count']} senses → Filtered: {entry['filtered_sense_count']} senses")
            for i, sense in enumerate(entry['jmdict_verb_senses_only'], 1):
                print(f"    {i}. {', '.join(sense['glosses'])}")
    
    print("\n" + "=" * 70)
    print("RECOMMENDATION: Use 'hybrid' strategy for best results! ⭐")
    print("=" * 70)
    
    # Export results
    final_results = filter_jmdict_senses(sample_data, strategy='hybrid', max_senses=2)
    
    print("\n📝 Exporting filtered results...")
    with open('/tmp/filtered_verbs.json', 'w', encoding='utf-8') as f:
        json.dump(final_results, f, indent=2, ensure_ascii=False)
    
    print("✅ Done! Filtered data saved to /tmp/filtered_verbs.json")
