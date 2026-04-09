# Gloss Enrichment Recommendations
## Adding Context-Specific Meanings from Source Data

**Date:** March 11, 2026

## Executive Summary

After comparing the N5 dataset (140 verbs) with the source data, we identified **3 verbs** where the source provides valuable context-specific English meanings that are:
- ✅ Same kanji (same verb)
- ✅ Not currently in N5 gloss
- ✅ Natural, practical English translations

---

## Recommended Updates

### 1. **入る** (はいる) - n5_v_0063

**Current N5 Entry:**
```json
{
  "id": "n5_v_0063",
  "lemma": {
    "kanji": "入る",
    "kana": "はいる"
  },
  "meaning": {
    "primary": "to enter",
    "gloss": ["enter", "go into", "join"]
  }
}
```

**Recommendation:**
```json
{
  "meaning": {
    "primary": "to enter",
    "gloss": ["enter", "go into", "join", "take (a bath)"]
  }
}
```

**Rationale:**
- Source context: 風呂に入る (take a bath)
- This is a very common usage of 入る
- "Take a bath" is the natural English translation, not "enter a bath"
- High pedagogical value ⭐⭐⭐

---

### 2. **かける** (かける) - n5_v_0101

**Current N5 Entry:**
```json
{
  "id": "n5_v_0101",
  "lemma": {
    "kanji": "かける",
    "kana": "かける"
  },
  "meaning": {
    "primary": "to put on",
    "gloss": ["put on (glasses)", "hang", "make (phone call)", "pour over"]
  }
}
```

**Recommendation:**
```json
{
  "meaning": {
    "primary": "to put on",
    "gloss": ["put on (glasses)", "hang", "make (phone call)", "pour over", "sprinkle"]
  }
}
```

**Rationale:**
- Source context: 塩をかける (sprinkle salt)
- "Sprinkle" is more natural than "pour over" for salt, seasoning, etc.
- Complements existing "pour over" meaning
- Cooking context is very common ⭐⭐⭐

---

### 3. **入れる** (いれる) - n5_v_0093

**Current N5 Entry:**
```json
{
  "id": "n5_v_0093",
  "lemma": {
    "kanji": "入れる",
    "kana": "いれる"
  },
  "meaning": {
    "primary": "to put in",
    "gloss": ["put in", "insert", "let in", "include"]
  }
}
```

**Recommendation:**
```json
{
  "meaning": {
    "primary": "to put in",
    "gloss": ["put in", "insert", "let in", "include", "add"]
  }
}
```

**Rationale:**
- Source context: 塩を入れる (add salt)
- "Add" is the natural cooking term
- Already has "include" which is similar, but "add" is more direct
- Very common in recipes and cooking instructions ⭐⭐

---

## Implementation Summary

### Changes to Make:

| Verb ID | Verb | Current Gloss Count | New Gloss Count | Addition |
|---------|------|---------------------|-----------------|----------|
| n5_v_0063 | 入る | 3 items | 4 items | "take (a bath)" |
| n5_v_0101 | かける | 4 items | 5 items | "sprinkle" |
| n5_v_0093 | 入れる | 4 items | 5 items | "add" |

### Impact:

- **Minimal risk:** Only adding to gloss array, not changing primary meaning
- **High value:** All additions are common, practical usage
- **Better learner experience:** More natural English in context
- **Dataset consistency:** No structural changes needed

---

## Additional Benefits

### These additions help with:

1. **Cooking vocabulary** (2/3 additions)
   - 塩をかける → sprinkle salt
   - 塩を入れる → add salt

2. **Daily life phrases** (1/3 additions)
   - 風呂に入る → take a bath

3. **Natural English**
   - Learners will see "take a bath" not "enter a bath" ✅
   - Learners will see "add salt" not "put in salt" ✅
   - Learners will see "sprinkle salt" not "pour salt" ✅

---

## Quality Assurance

### Why only 3 additions?

We analyzed all 85 common verbs and found:
- **75 verbs (88%):** Already have excellent, comprehensive meanings
- **7 verbs:** Source refers to different verb (homonym with different kanji)
- **3 verbs:** Source provides new context-specific meaning ✅ (these!)

This shows the N5 dataset is already very high quality!

---

## Recommendation Priority

| Priority | Verb | Reason |
|----------|------|--------|
| **HIGH** | 入る (take a bath) | Extremely common daily phrase |
| **MEDIUM** | かける (sprinkle) | Common cooking term |
| **MEDIUM** | 入れる (add) | Common cooking term, though "include" is similar |

---

## Next Steps

1. ✅ Update `N5_verbs_dataset.json`:
   - Add "take (a bath)" to n5_v_0063 gloss
   - Add "sprinkle" to n5_v_0101 gloss
   - Add "add" to n5_v_0093 gloss

2. ✅ Test app to ensure changes work correctly

3. ✅ Consider adding usage examples in the future:
   - 風呂に入る (take a bath)
   - 塩をかける (sprinkle salt)
   - 塩を入れる (add salt)

---

**Generated:** March 11, 2026
**Total Improvements:** 3 verbs enriched with context-specific meanings
