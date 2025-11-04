# Grammar Coverage Gap Analysis

**Date:** 2025-11-02
**Corpus:** 3,094 N5 sentences (curriculum-tagged)
**Reference:** 87 N5 grammar patterns (from grammar_stages.json)
**Purpose:** Identify extraction targets to improve pattern coverage

---

## 📊 Current Coverage Summary

### Overall Statistics

| Metric | Value |
|--------|-------|
| **Total reference patterns** | 87 |
| **Covered patterns** | 54-58 (62.1-62.4%) |
| **Missing patterns** | 33-35 |
| **Under-represented (<10)** | 25 patterns |

### Coverage Distribution

| Category | Count | Percentage |
|----------|-------|------------|
| ✅ **Excellent (≥20 examples)** | 31 patterns | 35.6% |
| ✅ **Good (10-19 examples)** | 4 patterns | 4.6% |
| ⚠️ **Moderate (5-9 examples)** | 9 patterns | 10.3% |
| ⚠️ **Weak (1-4 examples)** | 14 patterns | 16.1% |
| ❌ **Missing (0 examples)** | 35 patterns | 40.2% |

**Conclusion:** 62% coverage is below target. Need to reach 85-90% for a complete N5 curriculum.

---

## 🚨 Critical Gaps (Stage 1-3 Patterns)

These are **foundation/core/connections** patterns that should be taught early but have weak coverage:

### Stage 2 (Core Verbs & Forms) - 5 patterns

| Pattern | Current Count | Description |
|---------|---------------|-------------|
| かった | 0.5-1 | i-adjective past |
| ました | 2-3 | polite past |
| ません | 2.5-3 | polite negative present |
| じゃない | 3-5 | casual negative copula |
| くない | 4-5 | i-adjective negative |

**Priority:** CRITICAL - These are essential verb/adjective conjugations

### Stage 3 (Connections) - 11 patterns

| Pattern | Current Count | Description |
|---------|---------------|-------------|
| ています | 0 | polite progressive/state |
| たくないです | 0 | don't want to (polite) |
| たくない | 0 | don't want to |
| のほうが | 0 | more than (comparison) |
| てから | 0 | after doing |
| いちばん | 0 | most, number one |
| ている | 0.5-1 | progressive/state |
| とき | 1.5-2 | when, at the time |
| てください | 2 | please do |
| あとで | 2 | after (casual) |
| たいです | 2.5-3 | want to (polite) |

**Priority:** CRITICAL - Required for expressing desires, time, and requests

---

## ❌ Missing Patterns (33-35 total)

Patterns with **ZERO examples** in current corpus:

### By Stage Breakdown:

#### Stage 2 (Core) - 0 missing
All Stage 2 patterns have at least some coverage (though weak)

#### Stage 3 (Connections) - 6 missing
- ています (polite progressive)
- たくないです (don't want to - polite)
- たくない (don't want to)
- のほうが (more than)
- てから (after doing)
- いちばん (most)

#### Stage 4 (Conditionals) - 15+ missing
- たら (if/when)
- ば (conditional) - **Note:** Has 2 examples but in wrong context (ばっかり)
- てもいい (it's okay to)
- てはいけない (must not)
- てみる/てみます (try doing)
- たことがある/ない (have/never done)
- ことができる/ます (can do)
- すぎる (too much)
- やすい/にくい (easy/hard to)

#### Stage 5 (Advanced) - 10+ missing
- なければならない (must do)
- なくてはいけない (must do)
- なくてもいい (don't have to)
- ながら (while doing)
- そうだ/です (hearsay)
- みたいだ (seems like)
- ような (like, such as)
- それから (and then, after that)
- もらう (receive)
- くれる (give to me)

---

## ⚠️ Under-Represented Patterns (<10 examples)

Patterns with 1-9 examples that need boosting:

### Critical (1-4 examples):

| Pattern | Count | Stage | Description |
|---------|-------|-------|-------------|
| なかった | 1 | 2 | plain negative past |
| かった | 1 | 2 | i-adjective past |
| ている | 1 | 3 | progressive/state |
| ませんか | 1 | 2 | won't you? (invitation) |
| とき | 2 | 3 | when, at the time |
| てください | 2 | 3 | please do |
| ば | 2* | 4 | if (conditional) - *wrong usage |
| あとで | 2 | 3 | after (casual) |
| そして | 2 | 3 | and then |
| たいです | 3 | 3 | want to (polite) |
| ません | 3 | 2 | polite negative present |
| ました | 3 | 2 | polite past |

### Moderate (5-9 examples):

| Pattern | Count | Stage |
|---------|-------|-------|
| ほど | 5 | 3 |
| しか | 5 | 3 |
| みたい | 5 | 5 |
| ましょう | 5 | 2 |
| くない | 5 | 2 |
| じゃない | 5 | 2 |
| あげる | 6 | 5 |
| ではない | 7 | 2 |
| ます | 8 | 1 |
| 前に | 8 | 3 |
| らしい | 9 | 5 |
| 後で | 9 | 3 |
| に来る | 9 | 3 |

---

## 🎯 Extraction Targets

To reach 85-90% coverage with balanced distribution:

### Target Counts by Stage:

| Stage | Target per Pattern | Rationale |
|-------|-------------------|-----------|
| 1-2 (Foundation/Core) | 10 examples | Essential patterns, need strong coverage |
| 3 (Connections) | 7 examples | Important for progression |
| 4-5 (Advanced) | 5 examples | Sufficient for introduction |

### Sentences Needed:

Based on analysis, we need approximately:

- **Critical (Stage 1-3):** ~120-150 sentences to fill gaps
- **Medium (Stage 4-5):** ~100-120 sentences to cover missing patterns
- **Total:** ~220-270 new sentences

This represents a **7-9% increase** in corpus size (from 3,094 → ~3,300-3,350)

---

## 📈 Top 20 Best Covered Patterns

For reference, these patterns are **well-represented**:

| Rank | Pattern | Count | Type |
|------|---------|-------|------|
| 1 | い | 1,252 | i-adjective present |
| 2 | です | 962 | polite copula |
| 3 | が | 834 | subject marker / but |
| 4 | か | 747 | question marker |
| 5 | な | 631 | na-adjective / prohibitive |
| 6 | だ | 545 | plain copula |
| 7 | よ | 427 | emphasis particle |
| 8 | も | 415 | also/too particle |
| 9 | た | 401 | plain past |
| 10 | う | 389 | volitional |
| 11 | と | 301 | quotation / conditional |
| 12 | て | 236 | te-form |
| 13 | ね | 145 | confirmation particle |
| 14 | ので | 123 | because (objective) |
| 15 | だった | 81 | plain copula past |
| 16 | より | 73 | comparison |
| 17 | もう | 64 | already |
| 18 | から | 63 | because / from |
| 19 | だろう | 55 | probably (plain) |
| 20 | に行く | 51 | go to do |

---

## 🔍 Pattern Distribution Issues

### Formality Imbalance:

| Pattern Pair | Casual | Formal | Ratio |
|-------------|--------|--------|-------|
| **Copula** | だ: 545 | です: 962 | 36%:64% ✅ Good |
| **Past tense** | た: 401 | ました: 3 | **99%:1% ❌ Severe** |
| **Negative** | ない: 0 | ません: 3 | **0%:100% ❌ Critical** |

**Issue:** Polite forms (ます/ました/ません) are severely under-represented!

This contradicts our Stage 1-2 design which requires **90% formal** sentences.

### Recommendation:
When extracting new sentences for Stage 1-2, **prioritize polite forms**:
- ます (polite present) - Need 50+ more
- ました (polite past) - Need 20+ more
- ません (polite negative) - Need 20+ more
- ていますpolite progressive) - Need 15+ (currently 0!)

---

## 📋 Next Steps (Priority Order)

### Immediate Actions:

1. **Create targeted extraction queries** for critical gaps:
   - Query 1: Polite verb forms (ます/ました/ません)
   - Query 2: Progressive forms (ている/ています)
   - Query 3: Desire expressions (たい/たいです/たくない)
   - Query 4: Request forms (てください)

2. **Extract from Tatoeba** using pattern-specific searches:
   - Filter for N5-appropriate sentences
   - Validate grammar patterns match exactly
   - Ensure difficulty distribution (bias toward beginner)

3. **Validate extracted sentences** using existing scripts:
   - N5 vocabulary check
   - Grammar pattern detection
   - Difficulty scoring

4. **Re-run auto-tagging** on expanded corpus:
   - Should improve stage distribution
   - Reduce manual flagging rate
   - Better formality balance

### Medium Term:

5. **Manual review of 19 flagged sentences** from initial tagging
6. **Create validation suite** to check:
   - Pattern coverage per stage
   - Formality ratios per stage
   - Difficulty distribution
7. **Update main documentation** with curriculum design

---

## 📊 Success Metrics

Target metrics for Phase 4 (Grammar Coverage Completion):

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| **Overall coverage** | 62.1% | 85-90% | ❌ Need +23-28% |
| **Stage 1-3 coverage** | ~70% | 95%+ | ❌ Critical gaps |
| **Polite forms coverage** | <5% | 50%+ | ❌ Severe gap |
| **Patterns with ≥5 examples** | ~60% | 85%+ | ❌ Need boost |
| **Corpus size** | 3,094 | ~3,300 | Target +7% |

---

## 💡 Key Insights

1. **Coverage is acceptable but not excellent:** 62% means core patterns are present, but many important patterns are missing

2. **Formality imbalance is critical:** Stage 1-2 need polite forms but corpus is heavily casual-biased for verbs

3. **Stage 3 has most gaps:** Connection patterns (ている/たい/てください) are essential but under-represented

4. **Extraction is manageable:** ~220-270 sentences needed (not thousands)

5. **Pattern-targeted extraction works best:** Instead of random sampling, search specifically for missing patterns

---

**Generated:** 2025-11-02
**Analysis Script:** `scripts/analyze_grammar_coverage.py`
**Data Source:** `n5_sentences_ultra_pure.db` (3,094 tagged sentences)
**Reference:** `reference/grammar_stages.json` (87 N5 patterns)
