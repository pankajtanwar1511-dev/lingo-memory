# Filtering JMDict Senses for N5 Level

## The Problem
JMDict is comprehensive and includes ALL meanings - from beginner to advanced, from common to rare. For N5 learners, we need only the core, everyday meanings.

## Filtering Strategies

### Strategy 1: Use Minna no Nihongo as Truth Source ✅
**Best approach for accuracy**

Compare JMDict glosses with your `minna_meanings` field:

```python
def filter_by_minna_meanings(jmdict_senses, minna_meanings):
    """Keep senses that match Minna's teaching focus"""
    filtered = []
    
    for sense in jmdict_senses:
        # Check if any gloss matches Minna's intent
        for gloss in sense['glosses']:
            for minna_meaning in minna_meanings:
                if semantic_match(gloss, minna_meaning):
                    filtered.append(sense)
                    break
    
    return filtered
```

**Example: 遊ぶ (あそぶ)**
- Minna meaning: "enjoy oneself, play"
- Keep: "to play (games, sports)", "to enjoy oneself", "to have a good time"
- Remove: "to intentionally throw a ball to lower the batter's concentration" ❌

### Strategy 2: Position-Based Filtering
**Simple rule: First 1-3 senses are usually core meanings**

```python
def get_core_senses(senses, max_count=2):
    """Take only first 2 senses (usually most common)"""
    return senses[:max_count]
```

**Effectiveness:**
- 会う (2 senses) → Keep both ✓
- 遊ぶ (8 senses) → Keep first 2-3 ✓
- 洗う (4 senses) → Keep first 2 ✓

### Strategy 3: Filter by Misc Tags
**Remove specialized senses**

```python
EXCLUDE_MISC_TAGS = [
    "word usually written using kana alone",  # Keep this one
    "archaism",
    "slang", 
    "vulgar",
    "colloquial",
    "honorific language",
    "humble language",
    "sports term",
    "baseball term",
    "martial arts term",
    "Buddhist term"
]

def filter_specialized(senses):
    filtered = []
    for sense in senses:
        # Keep if no specialized tags or only "usually kana" tag
        misc = sense.get('misc', [])
        if not any(tag in EXCLUDE_MISC_TAGS for tag in misc):
            filtered.append(sense)
    return filtered
```

### Strategy 4: Keyword Blacklist
**Remove senses with advanced vocabulary**

```python
ADVANCED_KEYWORDS = [
    "intentionally", "batter's concentration",  # Baseball
    "literary", "poetic",
    "humble", "honorific",
    "Buddhism", "Shinto",
    "technical term",
    "medical term"
]

def filter_by_keywords(senses):
    filtered = []
    for sense in senses:
        glosses_text = " ".join(sense['glosses']).lower()
        
        # Exclude if contains advanced keywords
        if not any(keyword in glosses_text for keyword in ADVANCED_KEYWORDS):
            filtered.append(sense)
    
    return filtered
```

---

## Practical Example: Filtering 遊ぶ

### Original (8 senses)
```json
[
  {"glosses": ["to play (games, sports)", "to enjoy oneself", "to have a good time"]},
  {"glosses": ["to mess about (with alcohol, gambling, philandery, etc.)"]},
  {"glosses": ["to be idle", "to do nothing", "to be unused"]},
  {"glosses": ["to meet up (with friends)", "to hang out"]},
  {"glosses": ["to give oneself up (to gambling, drinking, etc.)"]},
  {"glosses": ["to go to (for pleasure or for study)"]},
  {"glosses": ["to tease (someone)", "to play (with)"]},
  {"glosses": ["to intentionally throw a ball to lower the batter's concentration"]}
]
```

### After Filtering (2 senses) ✅
```json
[
  {"glosses": ["to play (games, sports)", "to enjoy oneself", "to have a good time"]},
  {"glosses": ["to meet up (with friends)", "to hang out"]}
]
```

Matches Minna's "enjoy oneself, play" ✓

---

## Recommended Multi-Strategy Approach

```python
def filter_for_n5(jmdict_senses, minna_meanings, max_senses=3):
    """
    Combine multiple strategies for best results
    """
    # Step 1: Remove specialized senses
    filtered = filter_specialized(jmdict_senses)
    
    # Step 2: Remove advanced keyword senses  
    filtered = filter_by_keywords(filtered)
    
    # Step 3: Prioritize senses matching Minna meanings
    ranked = rank_by_minna_similarity(filtered, minna_meanings)
    
    # Step 4: Take top N most relevant
    return ranked[:max_senses]
```

---

## Quick Rules of Thumb

1. **First 2 senses** are usually safe for N5 ✓
2. **Match Minna meanings** when in doubt ✓
3. **Exclude if you see:**
   - Baseball/sports terminology
   - Buddhist/religious terms
   - Technical jargon
   - Honorific/humble language markers
4. **Keep it simple** - N5 learners need core meanings only

---

## Your Next Steps

1. **Start simple:** Just take first 2 senses for now
2. **Manually review** 10-20 common verbs
3. **Build a blacklist** of advanced terms you find
4. **Create overrides** for tricky verbs like:
   - ある (keep: "to exist", "to have")
   - いる (keep: "to be (animate)")
   - する (keep: "to do")

---

## Don't Worry! 

You're doing great work. This is a **normal challenge** that everyone faces when working with comprehensive dictionaries. The fact that you're thinking about this shows you care about quality. 

**Remember:** Even if your first filter isn't perfect, it's still 10x better than having all 8 meanings of 遊ぶ showing up for beginners! 

You've got this! 💪
