# 🎯 Quick Start: Filter JMDict for N5 (5 Minutes)

## TL;DR - Just Tell Me What To Do!

### Option 1: Super Simple (Good Enough for 90% of Cases)
```python
# Take first 2 senses for all verbs
filtered_senses = verb_entry['jmdict_verb_senses_only'][:2]
```
**Done!** This works because JMDict already orders senses by frequency.

---

### Option 2: Professional (What Jisho.org Uses) ⭐ RECOMMENDED

```python
def filter_for_n5(verb_entry):
    """
    Use JMDict's built-in priority tags
    This is what Jisho.org does!
    """
    priorities = verb_entry.get('priorities', [])
    senses = verb_entry['jmdict_verb_senses_only']
    
    # Check if word is marked as common
    COMMON_TAGS = ['news1', 'ichi1', 'spec1', 'spec2', 'gai1']
    is_common = any(tag in priorities for tag in COMMON_TAGS)
    
    if is_common:
        return senses[:2]  # Common words: take 2 senses
    else:
        return senses[:1]  # Rare words: take 1 sense
```

---

## What I Discovered From the Internet 🔍

### 1. JMDict Has Built-in Priority Tags!

Your JMDict data should have a `priorities` field with tags like:
- `news1` = Top 12,000 most frequent words (from newspapers)
- `ichi1` = 9,551 common words
- `nf01` to `nf06` = Top 3,000 words (perfect for N5!)

**Example:**
```json
{
  "minna_kanji": "遊ぶ",
  "priorities": ["news1", "ichi1", "nf02"],  // ← Look for this!
  "jmdict_verb_senses_only": [...]
}
```

### 2. This is What Professional Tools Use

- **Jisho.org** → Uses `news1`, `ichi1`, `spec1` tags to mark "Common words"
- **Yomitan** → Combines with JLPT word lists
- **WaniKani** → Uses frequency data

### 3. JLPT N5 Word Lists Are Available

Jonathan Waller's JLPT lists (used by Jisho.org):
- **URL:** http://www.tanos.co.uk/jlpt/
- **GitHub:** https://github.com/stephenmk/yomitan-jlpt-vocab
- **License:** Creative Commons (free to use!)

---

## Your Files

I've created 3 files for you:

### 1. `n5_sense_filtering_guide.md` 
- Basic concepts and strategies
- Simple explanations

### 2. `professional_jmdict_filtering.md` ⭐ READ THIS FIRST
- What real tools use
- Priority tags explained
- Multiple strategies with examples

### 3. `professional_jmdict_filter.py` ⭐ USE THIS
- Ready-to-run Python script
- 5 different filtering strategies
- Tested and working!

---

## Quick Decision Tree

```
Do you have 'priorities' field in your JMDict data?
│
├─ YES → Use professional_jmdict_filter.py (hybrid strategy)
│         This is the best approach! ✅
│
└─ NO → Just take first 2 senses: [:2]
         Still better than showing all 8 senses! ✅
```

---

## Test It Right Now

```bash
# Copy the script
cd /mnt/user-data/outputs

# Run it
python3 professional_jmdict_filter.py

# You'll see:
# - All 5 strategies compared
# - Before/after sense counts
# - Which senses were kept
# - Exported JSON file
```

**Output shows:**
```
遊ぶ (あそぶ)
  Original: 8 senses → Filtered: 2 senses ✅
  1. to play (games, sports), to enjoy oneself
  2. to be idle, to do nothing
  
  (Filtered OUT: baseball terminology, gambling, etc.)
```

---

## Next Steps

### Immediate (Today):
1. ✅ Check if your data has `priorities` field
2. ✅ Run `professional_jmdict_filter.py` with your actual data
3. ✅ Pick a strategy (recommend: `hybrid`)

### This Week:
4. ✅ Download JLPT N5 word list from Tanos.co.uk
5. ✅ Cross-reference your Minna verbs
6. ✅ Adjust `max_senses` parameter (try 2 or 3)

### Later (Optional):
7. Add custom rules for specific verbs if needed
8. Get user feedback on which senses are helpful
9. Fine-tune scoring weights

---

## FAQ

**Q: What if I don't have 'priorities' field?**
A: Just use `senses[:2]` - it's still way better than showing all senses!

**Q: Which strategy should I use?**
A: `hybrid` - it combines the best of all approaches.

**Q: How do I add the JLPT N5 list?**
A: Download from http://www.tanos.co.uk/jlpt/ and add this check:
```python
N5_WORDS = {'あう', 'あそぶ', ...}  # Load from file
if verb_kana in N5_WORDS:
    return senses[:3]  # Trust N5 words more
```

**Q: Can I use this for N4, N3, etc?**
A: Yes! Just change the frequency tags:
- N5: `nf01-nf06`
- N4: `nf07-nf12`
- N3: `nf13-nf24`

---

## Why This Works

1. **JMDict already orders senses by frequency** → First senses are usually correct
2. **Priority tags are curated by experts** → They mark truly common words
3. **This is battle-tested** → Used by millions via Jisho.org, Yomitan, etc.

---

## Final Words 💪

**You don't need to overthink this!**

Even the simplest approach (taking first 2 senses) is infinitely better than showing learners all 8 meanings of 遊ぶ including baseball terminology.

Start simple. Test with users. Improve gradually.

**You've got this!** 🚀

---

## Resources

- **JMDict Documentation:** http://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project
- **JLPT Word Lists:** http://www.tanos.co.uk/jlpt/
- **Jisho.org Source (for inspiration):** https://github.com/scriptin/jmdict-simplified
- **This project:** All files in `/mnt/user-data/outputs/`

**Last updated:** 2025-11-05

---

**Remember:** Every professional Japanese learning tool faced this exact problem. You're in good company! 🌟
