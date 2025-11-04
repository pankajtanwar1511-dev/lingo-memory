# Phase 4: Grammar Coverage Completion - Extraction Plan

**Date:** 2025-11-02
**Current Status:** 62% pattern coverage (54/87 patterns)
**Target:** 85-90% coverage (75+/87 patterns)
**Estimated New Sentences:** 220-270 sentences

---

## 🎯 Extraction Strategy

### Approach: Pattern-Targeted Extraction

Instead of random Tatoeba extraction, we'll use **pattern-specific queries** to fill exact gaps.

**Why this works:**
1. Precise targeting of missing patterns
2. Maintains N5-only constraint
3. Efficient (only extract what's needed)
4. Better quality control

### Data Source

**Tatoeba Corpus** (legal, CC-licensed):
- Japanese sentences with English translations
- Filter for N5-appropriate content
- Validate vocabulary and grammar
- Check difficulty distribution

---

## 📋 Extraction Queries (Priority Order)

### Priority 1: CRITICAL Stage 1-3 Polite Forms

**Target:** 90+ sentences to fix formality imbalance

#### Query Group 1: Polite Verb Forms (Stage 1-2)

```
Pattern: ます (polite present)
Current: 8 examples
Target: 60 examples
Needed: 52 sentences

Search strategy:
- Tatoeba search: sentences ending with "ます"
- Exclude: compounds like "います", "あります" (too specific)
- Include: action verbs (食べます、行きます、見ます、etc.)
- Filter: Basic vocabulary only, short sentences (<15 characters)
```

```
Pattern: ました (polite past)
Current: 3 examples
Target: 25 examples
Needed: 22 sentences

Search strategy:
- Sentences ending with "ました"
- Common past actions (行きました、食べました、見ました)
- Filter: Beginner difficulty, everyday contexts
```

```
Pattern: ません (polite negative)
Current: 3 examples
Target: 25 examples
Needed: 22 sentences

Search strategy:
- Sentences ending with "ません"
- Common negations (行きません、食べません、分かりません)
- Filter: Daily life contexts
```

```
Pattern: ています (polite progressive)
Current: 0 examples ❌
Target: 15 examples
Needed: 15 sentences

Search strategy:
- Sentences with "ています"
- States and ongoing actions (住んでいます、働いています)
- Filter: Present continuous contexts
```

**Subtotal for Polite Forms:** ~114 sentences

---

#### Query Group 2: Desire & Request Forms (Stage 3)

```
Pattern: たいです (want to - polite)
Current: 3 examples
Target: 12 examples
Needed: 9 sentences

Search: "たいです" in sentences
Filter: Common desires (行きたいです、食べたいです、見たいです)
```

```
Pattern: たくない (don't want to)
Current: 0 examples ❌
Target: 8 examples
Needed: 8 sentences

Search: "たくない" endings
Filter: Common negative desires
```

```
Pattern: てください (please do)
Current: 2 examples
Target: 12 examples
Needed: 10 sentences

Search: "てください" in sentences
Filter: Common requests (見てください、教えてください、etc.)
```

**Subtotal for Desire/Request:** ~27 sentences

---

#### Query Group 3: Progressive & Time Forms (Stage 3)

```
Pattern: ている (progressive/state - casual)
Current: 1 example
Target: 10 examples
Needed: 9 sentences

Search: "ている" in sentences (not "ています")
Filter: Casual contexts, ongoing states
```

```
Pattern: とき (when, at the time)
Current: 2 examples
Target: 10 examples
Needed: 8 sentences

Search: "とき" in sentences
Filter: Time expressions (学校に行くとき、etc.)
```

```
Pattern: あとで (after - casual)
Current: 2 examples
Target: 10 examples
Needed: 8 sentences

Search: "あとで" in sentences
Filter: Short casual promises (あとで行く、あとで電話する)
```

```
Pattern: てから (after doing)
Current: 0 examples ❌
Target: 8 examples
Needed: 8 sentences

Search: "てから" in sentences
Filter: Sequential actions (食べてから、帰ってから)
```

**Subtotal for Progressive/Time:** ~33 sentences

---

### Priority 2: MEDIUM Stage 3-4 Missing Patterns

**Target:** 80+ sentences to cover important intermediate patterns

#### Query Group 4: Comparisons (Stage 3)

```
Pattern: いちばん (most)
Current: 0 examples ❌
Target: 8 examples
Needed: 8 sentences

Search: "いちばん" in sentences
Filter: Superlatives (いちばん好き、いちばん大きい)
```

```
Pattern: のほうが (more than)
Current: 0 examples ❌
Target: 8 examples
Needed: 8 sentences

Search: "のほうが" in sentences
Filter: Comparisons (AのほうがBより)
```

**Subtotal for Comparisons:** ~16 sentences

---

#### Query Group 5: Conditionals (Stage 4)

```
Pattern: たら (if/when)
Current: 0 examples ❌
Target: 10 examples
Needed: 10 sentences

Search: "たら" in sentences (not "だったら")
Filter: Simple conditions (行ったら、食べたら)
```

```
Pattern: ば (if - conditional)
Current: 2 examples (wrong context)
Target: 10 examples
Needed: 10 sentences

Search: "ば" endings (not "ばっかり")
Filter: Verb conditionals (食べれば、行けば)
```

```
Pattern: と (if/when - natural result)
Current: 301 examples (but mostly quotation usage)
Target: Verify context, may need 5 more conditional examples
Needed: 5 sentences with conditional usage

Search: "と" with conditional meaning
Filter: Natural results (押すと開く、etc.)
```

**Subtotal for Conditionals:** ~25 sentences

---

#### Query Group 6: Permissions & Try (Stage 4)

```
Pattern: てもいい (it's okay to)
Current: 0 examples ❌
Target: 8 examples
Needed: 8 sentences

Search: "てもいい" in sentences
Filter: Permissions (食べてもいい、行ってもいい)
```

```
Pattern: てはいけない (must not)
Current: 0 examples ❌
Target: 6 examples
Needed: 6 sentences

Search: "てはいけない" in sentences
Filter: Prohibitions (食べてはいけない)
```

```
Pattern: てみる / てみます (try doing)
Current: 0 examples ❌
Target: 10 examples (combined)
Needed: 10 sentences

Search: "てみる" and "てみます"
Filter: Trial actions (食べてみる、行ってみます)
```

**Subtotal for Permissions/Try:** ~24 sentences

---

#### Query Group 7: Experience & Ability (Stage 4)

```
Pattern: たことがある (have done)
Current: 0 examples ❌
Target: 8 examples
Needed: 8 sentences

Search: "たことがある" in sentences
Filter: Past experiences (行ったことがある、etc.)
```

```
Pattern: たことがない (have never done)
Current: 0 examples ❌
Target: 6 examples
Needed: 6 sentences

Search: "たことがない" in sentences
Filter: Lack of experience
```

```
Pattern: ことができる / ことができます (can do)
Current: 0 examples ❌
Target: 10 examples (combined)
Needed: 10 sentences

Search: "ことができる" and "ことができます"
Filter: Abilities (日本語を話すことができる)
```

**Subtotal for Experience/Ability:** ~24 sentences

---

### Priority 3: LOW Stage 4-5 Advanced Patterns

**Target:** 40+ sentences to round out advanced coverage

#### Query Group 8: Obligations (Stage 5)

```
Pattern: なければならない (must do)
Current: 0 examples ❌
Target: 5 examples
Needed: 5 sentences

Search: "なければならない"
Filter: Strong obligations
```

```
Pattern: なくてはいけない (must do - casual)
Current: 0 examples ❌
Target: 5 examples
Needed: 5 sentences

Search: "なくてはいけない"
Filter: Obligations
```

```
Pattern: なくてもいい (don't have to)
Current: 0 examples ❌
Target: 5 examples
Needed: 5 sentences

Search: "なくてもいい"
Filter: Lack of obligation
```

**Subtotal for Obligations:** ~15 sentences

---

#### Query Group 9: Degree & Miscellaneous (Stage 4-5)

```
Pattern: すぎる (too much)
Current: 0 examples ❌
Target: 6 examples
Needed: 6 sentences

Search: "すぎる" in sentences
Filter: Excess (食べすぎる、飲みすぎる)
```

```
Pattern: やすい (easy to)
Current: 0 examples ❌
Target: 5 examples
Needed: 5 sentences

Search: "やすい" in sentences
Filter: Ease (分かりやすい、読みやすい)
```

```
Pattern: にくい (hard to)
Current: 0 examples ❌
Target: 5 examples
Needed: 5 sentences

Search: "にくい" in sentences
Filter: Difficulty (分かりにくい、読みにくい)
```

```
Pattern: ながら (while doing)
Current: 0 examples ❌
Target: 5 examples
Needed: 5 sentences

Search: "ながら" in sentences
Filter: Simultaneous actions (食べながら、歩きながら)
```

**Subtotal for Degree/Misc:** ~21 sentences

---

## 📊 Extraction Summary

### Total Sentences Needed by Priority:

| Priority Level | Sentence Count | Patterns Covered |
|---------------|----------------|------------------|
| **CRITICAL (Stage 1-3)** | ~174 sentences | Polite forms, desire, time, progressive |
| **MEDIUM (Stage 3-4)** | ~89 sentences | Comparisons, conditionals, permissions, experience |
| **LOW (Stage 4-5)** | ~36 sentences | Obligations, degree, advanced |
| **TOTAL** | **~299 sentences** | 33+ missing patterns |

**Adjusted Target:** ~250-300 sentences (slightly higher than initial estimate)

### Expected Coverage After Extraction:

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **Covered patterns** | 54/87 (62.1%) | 80+/87 (92%+) | +30% |
| **Stage 1-3 coverage** | ~70% | 95%+ | +25% |
| **Corpus size** | 3,094 | ~3,350-3,400 | +8-10% |

---

## 🛠️ Implementation Workflow

### Step 1: Tatoeba Download & Preparation
```bash
# Download Tatoeba Japanese sentences
wget https://downloads.tatoeba.org/exports/jpn_sentences.tsv.bz2
bzip2 -d jpn_sentences.tsv.bz2

# Download translations (optional, for validation)
wget https://downloads.tatoeba.org/exports/eng_sentences.tsv.bz2
```

### Step 2: Pattern-Specific Extraction Script

Create `scripts/extract_pattern_targeted.py`:

```python
"""
Extract sentences from Tatoeba for specific grammar patterns.
Uses pattern-specific queries to fill coverage gaps.
"""

import re
from pathlib import Path

def extract_for_pattern(pattern, tatoeba_file, max_sentences=50):
    """
    Extract sentences containing a specific pattern.

    Args:
        pattern: Grammar pattern to search for (e.g., "ます")
        tatoeba_file: Path to Tatoeba TSV
        max_sentences: Maximum sentences to extract

    Returns:
        List of candidate sentences
    """
    # Implementation here...
    pass

# Extraction queries for each pattern group
EXTRACTION_QUERIES = {
    'group_1_polite_forms': {
        'ます': {'needed': 52, 'filter': 'ends_with'},
        'ました': {'needed': 22, 'filter': 'ends_with'},
        'ません': {'needed': 22, 'filter': 'ends_with'},
        'ています': {'needed': 15, 'filter': 'contains'},
    },
    # ... more groups
}
```

### Step 3: Validation Pipeline

For each extracted sentence:
1. ✅ **Vocabulary check:** All words must be N5
2. ✅ **Pattern verification:** Confirm target pattern exists and is used correctly
3. ✅ **Difficulty estimation:** Calculate difficulty score (aim for appropriate stage)
4. ✅ **Deduplication:** Check against existing corpus
5. ✅ **Length filter:** Prefer 10-25 character sentences
6. ✅ **Quality check:** Grammar must be natural, no slang/archaic forms

### Step 4: Batch Processing

Process in batches by priority:
- **Batch 1:** Critical polite forms (Priority 1, ~114 sentences)
- **Batch 2:** Desire/request/time (Priority 1, ~60 sentences)
- **Batch 3:** Comparisons/conditionals (Priority 2, ~41 sentences)
- **Batch 4:** Permissions/ability (Priority 2, ~48 sentences)
- **Batch 5:** Advanced patterns (Priority 3, ~36 sentences)

### Step 5: Integration & Re-tagging

After each batch:
1. Add to `n5_sentences_ultra_pure.db`
2. Run auto-tagging script to classify new sentences
3. Verify stage assignments
4. Check formality distribution
5. Update coverage metrics

---

## ✅ Success Criteria

### Coverage Targets:

- [ ] **Overall coverage:** 85-90% (75+/87 patterns)
- [ ] **Stage 1-2 polite forms:** 50+ examples each for ます/ました/ません
- [ ] **Stage 3 critical patterns:** All have 8+ examples
- [ ] **No pattern with 0 examples** in Stages 1-3
- [ ] **Formality ratio (Stage 1-2):** 70-80% formal (currently ~65% for copula only)

### Quality Targets:

- [ ] **N5 vocabulary:** 100% compliance
- [ ] **Natural grammar:** No forced/unnatural sentences
- [ ] **Difficulty distribution:** Bell curve maintained
- [ ] **Deduplication:** <5% overlap with existing corpus
- [ ] **Auto-tagging accuracy:** >95% (minimal manual flags)

---

## 📅 Timeline Estimate

| Phase | Time | Description |
|-------|------|-------------|
| **Setup** | 2 hours | Download Tatoeba, create extraction scripts |
| **Batch 1 (Critical)** | 4-6 hours | Extract & validate 114 polite form sentences |
| **Batch 2 (Critical)** | 3-4 hours | Extract & validate 60 desire/time sentences |
| **Batch 3 (Medium)** | 3-4 hours | Extract & validate 41 comparison/conditional sentences |
| **Batch 4 (Medium)** | 3-4 hours | Extract & validate 48 permission/ability sentences |
| **Batch 5 (Low)** | 2-3 hours | Extract & validate 36 advanced sentences |
| **Integration** | 2-3 hours | Add to database, re-tag, validate |
| **Review & Cleanup** | 2-3 hours | Manual review of flagged sentences, quality check |
| **TOTAL** | **21-30 hours** | ~3-4 work days |

**Realistic completion:** 1 week with 4-6 hours/day effort

---

## 🚀 Next Immediate Steps

1. **Download Tatoeba corpus** (~10 minutes)
2. **Create extraction script template** (~1 hour)
3. **Test extraction for 1-2 patterns** (~30 minutes, validation)
4. **Run Batch 1 (polite forms)** - highest priority
5. **Integrate and validate** - check if approach works
6. **Iterate for remaining batches**

---

**Document Status:** Ready for implementation
**Prerequisites:** Tatoeba corpus, extraction scripts
**Expected Outcome:** 85-90% pattern coverage with 3,350+ high-quality N5 sentences

**Next file to create:** `scripts/extract_pattern_targeted.py`
