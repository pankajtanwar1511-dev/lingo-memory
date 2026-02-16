# Phase 3: N5 Vocabulary Extraction - Complete Analysis Report

**Date:** 2026-02-16
**Analyst:** Manual review by Claude Code
**Source:** N5_807 Dataset v2.3.0 (807 entries, 98.9% JMdict coverage)
**Target:** N5_vocab_dataset_ENHANCED v1.25.0-phase25 (703 cards)

---

## Executive Summary

### Current Status
- **Current vocabulary cards:** 703
- **Missing from N5_807:** 160 words
- **Overlap with N5_807:** 647 words (92% coverage)
- **Projected total after Phase 3:** 863 cards

### Achievement
✅ **We're at 87% of complete N5 coverage** (703/807)

### Phase 3 Goal
Add the remaining **160 high-quality words** from N5_807 to achieve **863 total cards** (>100% of the 807 baseline, accounting for homonyms and variants we already have).

---

## Missing Words Breakdown

| Category | Count | Priority |
|----------|-------|----------|
| **Numbers** | 35 | 🔥 High (essential for basic communication) |
| **Nouns** | 61 | 🔥 High (core vocabulary) |
| **Verbs** | 29 | 🔥 High (action words) |
| **Adjectives** | 8 | ⚠️ Medium (descriptive words) |
| **Counters** | 6 | ⚠️ Medium (Japanese-specific) |
| **Expressions** | 4 | ✅ Low (we added most in Phase 1) |
| **Interjections** | 3 | ✅ Low (conversational) |
| **Other** | 14 | ⚠️ Medium (needs review) |
| **TOTAL** | **160** | |

---

## Detailed Category Analysis

### 1. NUMBERS (35 words) - PRIORITY 1 🔥

**Why critical:** Basic counting is essential for N5 level (prices, times, dates, quantities)

Missing numbers include:
- **Basic digits:** し (四), しち (七), きゅう (九), etc.
- **Native Japanese:** ひとつ, ふたつ, みっつ... (one, two, three...)
- **Counter forms:** ついたち (1st day), ふつか (2nd day), etc.
- **Large numbers:** じゅう (10), ひゃく (100), せん (1000), まん (10,000)

**Examples:**
- じゅう (十) - ten, 10
- ひとつ (一つ) - one
- ついたち (一日) - first day of the month
- ななつ (七つ) - seven
- よっか (四日) - 4th day of the month

**Action:** Add all 35 numbers - these are non-negotiable for N5

---

### 2. NOUNS (61 words) - PRIORITY 1 🔥

**Why critical:** Core everyday vocabulary for objects, people, places

**Sample missing nouns:**
- **People:** いもうとさん (younger sister), わたし (私 - I/me - critical!)
- **Objects:** しゃしん (写真 - photograph), かばん (going off duty)
- **Places:** うち (one's house), まち (町 - town)
- **Time:** いちど (once), ばん (晩 - evening)
- **Body parts:** せ (背 - back), くち (口 - mouth)

**Notable gaps:**
- わたし (私) - "I" is MISSING! This is absolutely essential
- いもうとさん (younger sister) - family term
- しゃしん (写真) - photograph (very common)

**Action:** Add all 61 nouns, prioritize personal pronouns and common objects

---

### 3. VERBS (29 words) - PRIORITY 1 🔥

**Why critical:** Action words essential for sentence construction

**Sample missing verbs:**
- ゆく (行く) - to go (alternative to いく)
- つとめる (勤める) - to work (for)
- なる - to become
- できる - to be able to
- もらう (貰う) - to receive
- やる - to do

**Note:** Some of these might be variant forms or duplicates
- ゆく vs いく (both mean "to go" - different readings)
- Check if we already have masu-forms

**Action:** Manually verify each verb against existing vocabulary to avoid masu-form duplicates

---

### 4. ADJECTIVES (8 words) - PRIORITY 2 ⚠️

**Why important:** We already added adjectives in Phase 2/2.5, but these 8 are missing

**Missing adjectives:**
- うれしい - happy, glad (**Wait, we added this in Phase 2!**)
- おいしい - good-tasting
- おもしろい - interesting
- かわいい - cute
- すい - sour
- まずい - bad-tasting
- ぬるい (温い) - lukewarm
- やさしい (易しい) - easy

**Action:** Double-check these against our Phase 2 additions - some may already exist

---

### 5. COUNTERS (6 words) - PRIORITY 2 ⚠️

**Why important:** Japanese-specific counting system

**Missing counters:**
- つ - general-purpose counter
- まい - counter for thin, flat objects
- など - et cetera (particle usage)

**Action:** Add these with proper counter classification

---

### 6. EXPRESSIONS (4 words) - PRIORITY 3 ✅

**Why lower priority:** We added 32 expressions in Phase 1

**Missing expressions:**
- ありがとう - thank you (**We added ありがとうございます in Phase 1!**)
- おはよう - good morning (**We added おはようございます in Phase 1!**)
- ではまた - see you later
- そうだ - that is so

**Note:** Check if we need casual forms vs polite forms we already added

**Action:** Verify against Phase 1 additions before adding

---

### 7. INTERJECTIONS (3 words) - PRIORITY 3 ✅

**Why lower priority:** Conversational fillers, not critical

**Missing:**
- ああ - ah!, oh!
- あのう - say, well
- えっ - huh?

**Action:** Add for completeness

---

### 8. OTHER (14 words) - REQUIRES MANUAL REVIEW ⚠️

**Why needs review:** Mixed categories or ambiguous classification

**Sample:**
- いい - "having fun" (but we have いい as adjective "good")
- えー - "yes" (interjection)
- じゃ / じゃあ - "then" (particle/conjunction)
- より - "than" (particle)

**Action:** Manual review each entry to determine if needed

---

## Quality Assurance Notes

### Potential Duplicates Found

1. **ありがとう** - We added **ありがとうございます** (polite form) in Phase 1
   - Decision: Add casual form separately? Or skip?

2. **おはよう** - We added **おはようございます** (polite form) in Phase 1
   - Decision: Add casual form for completeness

3. **うれしい** - We added this in Phase 2 (4 missing i-adjectives)
   - Decision: Verify this is actually in our dataset

4. **いい** - We have this as adjective "good"
   - N5_807 has it as "having fun, rejoicing"
   - Decision: Check if we need both meanings

### Minna no Nihongo Verb Cross-Reference

From minna_verb.md, we have 161 verbs documented:
- Group I (Godan): 91 verbs
- Group II (Ichidan): 44 verbs
- Group III (Irregular): 26 verbs

**Action:** Cross-reference the 29 missing verbs with Minna to ensure we're not missing critical textbook verbs

---

## Recommended Phase 3 Implementation Plan

### Step 1: Priority 1 - Numbers (35 words)
- Add all number-related vocabulary
- Timeline: 1 session

### Step 2: Priority 1 - Essential Nouns (61 words)
- Start with: わたし, いもうとさん, しゃしん
- Add common objects and places
- Timeline: 2 sessions

### Step 3: Priority 1 - Verbs (29 words)
- Manually verify each against existing vocabulary
- Check for masu-form duplicates
- Add verified verbs only
- Timeline: 1 session

### Step 4: Priority 2 - Adjectives (8 words)
- Double-check Phase 2 additions
- Add remaining adjectives
- Timeline: 1 session

### Step 5: Priority 2 - Counters (6 words)
- Add with proper classification
- Timeline: 1 session

### Step 6: Priority 3 - Expressions & Interjections (7 words)
- Verify against Phase 1
- Add casual forms if needed
- Timeline: 1 session

### Step 7: Manual Review - Other (14 words)
- Individual review of each entry
- Timeline: 1 session

**Total estimated timeline:** 8 sessions or ~2-3 days

---

## Expected Outcome

After Phase 3 completion:
- **Total vocabulary cards:** 863 (up from 703)
- **Coverage of N5_807:** 100%
- **JMdict coverage:** 98.9%+ (inherited from N5_807)
- **Quality:** High (all manually verified)

This will give us **complete N5 coverage** based on the authoritative N5_807 dataset.

---

## Next Steps

1. ✅ **Review this report** - User approval
2. 📝 **Create Phase 3 extraction script** - Generate missing_words.json
3. ✅ **Manual verification** - Check each word
4. 🏗️ **Build Phase 3 dataset** - Create N5_vocab_dataset_PHASE3.json
5. 🧪 **Test with seed loader** - Verify all works
6. 🚀 **Deploy** - Update production file

---

**Analysis complete. Ready for manual implementation!** ✅

*Generated: 2026-02-16*
*Source files: N5_807_data_set_details/data/N5_vocab_dataset_final.json*
*Current file: public/seed-data/N5_vocab_dataset_ENHANCED.json*
