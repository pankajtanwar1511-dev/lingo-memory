# N5 Progressive Curriculum Implementation

**Feature:** Progressive N5 Learning Curriculum with Grammar Pattern Detection
**Dataset:** v2 Enhanced (9,419 sentences from Tatoeba)
**Last Updated:** 2025-11-03
**Status:** 🚀 **READY TO START** - Applying proven methodology to enhanced dataset

---

## 📊 Current Status (2025-11-03)

### 🎯 MISSION: SMART FILTERING - Curate Maximum Natural N5 Sentences

**Context:** We have successfully created a v2 Enhanced dataset (9,419 sentences) with:
- ✅ 100% N5 vocabulary match (807 JMdict-verified words)
- ✅ 15 N4+ grammar patterns rejected (vs 5 in v1)
- ✅ AI-validated filtering (9/10 rating from ChatGPT + Claude)
- ✅ Higher N5 purity than original 3,094 database

### ✅ **PHASE 0 COMPLETE** (2025-11-03)

**Diagnostic Analysis Results:**

**📊 Sentence Statistics:**
- Total sentences analyzed: 9,419
- **Formal (polite): 1,924 (20.4%)** 🔴 CRITICAL
- **Casual (plain): 7,495 (79.6%)**
- Mean length: 11.7 characters (good for N5)
- Mean kanji: 2.55 per sentence (reasonable)

**📚 Vocabulary Coverage (807 N5 Words):**
- **Excellent (6+ examples): 482 words (59.7%)** ✅
- **Good (2-5 examples): 110 words (13.6%)** ✅
- **Low (1 example): 46 words (5.7%)** ⚠️
- **Missing (0 examples): 169 words (20.9%)** 🔴
- **Total Covered: 638 words (79.1%)** ✅
- **Need Attention: 215 words (26.6%)** (missing + low)

**🎯 Pattern Distribution (Top 5):**
- は particle: 38.8%
- です/ます: 26.6%
- に particle: 21.1%
- を particle: 17.8%
- た form: 11.6%

**🔍 Existing Metadata:** None (as expected)

**💡 Strategic Implications:**

🎯 **REVISED CORE TIER TARGET: ~2,000-2,500 sentences**

**Why?** Only 1,924 formal sentences available naturally.
- If CORE = 85% formal → Max CORE = 2,264 sentences
  - 1,924 formal (85%) + 340 casual (15%) = 2,264 total
- **This is EXCELLENT for quality-focused curriculum!**

**Tier Distribution:**
- **CORE Tier:** ~2,000-2,500 sentences (85% formal from 1,924 available)
- **EXTENDED Tier:** ~6,500-7,000 sentences (remaining casual + leftover formal)

**AI Generation Needs:**
- **169 vocabulary words have NO examples** (20.9%) → Need targeted AI generation
- **46 words have only 1 example** (5.7%) → Need 1-2 more examples
- **Total Priority: 215 words (26.6%)** need attention
- Focus on formal examples to supplement CORE tier vocabulary coverage
- Common missing words: お金, お茶, お母さん, お父さん, etc. (essential N5 vocabulary)

**Decision:** ✅ Proceed with smart filtering. Work with natural distribution.

**STRATEGIC DECISION (2025-11-03):**
🎯 **Quality over Quantity - Filter, Don't Convert!**

Instead of trying to fix/convert all 9,419 sentences, we will:
1. **Analyze all 9,419** with rich metadata (difficulty, formality, grammar, vocab)
2. **SELECT AS MANY AS POSSIBLE** that naturally meet our criteria (no AI conversion)
3. **NO FORCED TARGET:** Take whatever naturally qualifies (could be 2,000 or 4,500+)
4. **Extend with AI ONLY for gaps:** If critical patterns/vocab missing

**Why this approach?**
- ✅ **100% Authentic Japanese:** No conversions, only natural Tatoeba sentences
- ✅ **Absolute Accuracy:** Natural quality over forced quantity
- ✅ **Faster Development:** No conversion work needed
- ✅ **Easier Validation:** Only validating natural sentences
- ✅ **True to Philosophy:** Quality and accuracy are non-negotiable

**Goal:** Create a **progressive learning curriculum** with:
- 🎯 **CORE sentences: As many as naturally qualify** (ideal ~4,000, flexible 2,000-4,500)
- 🎯 **85% formal target (flexible)** - from naturally polite Tatoeba sentences
- 🎯 **Bell curve difficulty** centered at 4.5-5/10
- 🎯 **Maximum grammar pattern coverage** - whatever naturally exists
- 🎯 **Maximum vocabulary coverage** - whatever naturally exists
- 🎯 **AI generation ONLY if critical gaps** - minimal intervention
- 🎯 **Progressive vocabulary IDs** sorted by difficulty (n5_vocab_0001 → n5_vocab_0807)
- 🎯 **Complete metadata** for all sentences (formality, kana, grammar, vocab tracking)
- 🎯 **Extended Tier:** All remaining sentences available for practice

---

## 📁 Dataset Information

### Source Dataset (v2 Enhanced)
```
File: vocab_sources/n5_vocab_final/n5_807_vocab_n5_grammar_sentences_v2_enhanced.json
Size: 1.5 MB
Sentences: 9,419 (3x larger than old 3,094 database)
Vocabulary: 807 JMdict-verified N5 words (1,286 unique forms)
Grammar Filter: 15 N4+ patterns rejected (comprehensive)
Source: Tatoeba Corpus (247,929 processed → 3.8% pass rate)
License: CC BY 2.0 FR
```

### Target Output (CORE + EXTENDED)

**CORE TIER (Primary Curriculum):**
```
Database: N5_807_data_set_details/n5_core_curriculum.db
Sentences: ~2,000-2,500 (REVISED based on Phase 0 - naturally polite sentences)
Formality: 85%+ formal (polite) - from 1,924 naturally polite Tatoeba sentences
Difficulty: Bell curve centered at 4.5-5/10
Grammar Coverage: Maximum N5 patterns with 5-10 examples each
Vocabulary Coverage: Maximum coverage (679 words have 2+ examples naturally)
Progressive IDs: n5_vocab_0001 → n5_vocab_0807 by difficulty
Quality: Manual review on 10% sample (200-250 sentences)
Purpose: Structured progressive learning curriculum
```

**EXTENDED TIER (Supplementary Practice):**
```
Database: N5_807_data_set_details/n5_extended_practice.db
Sentences: ~6,500-7,000 (remaining from 9,419 after CORE selection)
Formality: Mixed (natural distribution ~20% formal, 80% casual)
Quality: All pass N5 vocabulary + grammar filters
Purpose: Additional reading practice, exercises, comprehension
Usage: Optional practice after completing Core Tier
```

**COMPLETE DATASET (Both Tiers):**
```
File: N5_807_data_set_details/n5_complete_curriculum.json
Total: 9,419 sentences (all analyzed, all tagged)
Metadata: Complete for all sentences
Tiers: Core (~2,200) + Extended (~7,200)
Purpose: Full dataset with flexibility to use Core alone or both tiers
```

### Vocabulary Dataset
```
File: vocab_sources/n5_vocab_final/N5_vocab_dataset_final.json
Size: 612 KB
Words: 807 JMdict-verified N5 words
Coverage: 100% (all entries have full dictionary data)
Kanji entries: 499 (61.8%)
Kana-only: 308 (38.2%)
Unique forms: 1,286 (kanji + kana representations)
```

---

## 🔍 Phase 0: Pre-Analysis & Diagnostic ⏳ **IN PROGRESS**

**Goal:** Understand the current state of v2 Enhanced dataset before applying transformations

**Status:** Starting diagnostic...

### Diagnostic Checklist
- [ ] Load v2 Enhanced JSON (9,419 sentences)
- [ ] Check existing metadata fields
- [ ] Analyze current formality distribution (if exists)
- [ ] Check if tokenization/kana already present
- [ ] Validate against 807 vocabulary (should be 100% match)
- [ ] Check sentence length distribution
- [ ] Identify what phases need to be run
- [ ] Generate diagnostic report

### Expected Findings
Based on v2 Enhanced creation:
- ✅ All sentences have: id, japanese, english, source (tatoeba)
- ❌ Likely missing: formality, difficulty, kana, tokenization, grammar tags
- ❌ Likely missing: progressive vocabulary IDs
- ✅ Grammar: Already filtered for N4+ patterns (15 patterns rejected)

### Diagnostic Scripts
```
Script 1: scripts/phase0_diagnostic.py
Purpose: Analyze sentence formality, patterns, overall statistics
Output: phase0_diagnostic_report.json

Script 2: scripts/phase0_vocab_coverage_detailed.py
Purpose: Analyze vocabulary coverage in detail (807 words)
Output: phase0_vocab_coverage.json + phase0_missing_low_coverage.json
```

**Time Estimate:** 30 minutes ✅ **COMPLETED**

### Phase 0 Results (2025-11-03)

**📊 Sentence Statistics:**
- Total: 9,419 sentences analyzed
- **Formal (polite): 1,924 (20.4%)** 🔴 CRITICAL
- Casual (plain): 7,495 (79.6%)
- Mean length: 11.7 chars, Mean kanji: 2.55

**📚 Vocabulary Coverage (807 N5 Words):**
- Excellent (6+ examples): 482 words (59.7%) ✅
- Good (2-5 examples): 110 words (13.6%) ✅
- Low (1 example): 46 words (5.7%) ⚠️
- **Missing (0 examples): 169 words (20.9%)** 🔴
- **Total Covered: 638 words (79.1%)** ✅

**🎯 Pattern Distribution:**
- は particle: 38.8%
- です/ます: 26.6%
- に particle: 21.1%
- を particle: 17.8%
- た form: 11.6%

**📁 Generated Files:**
1. `reports/phase0_diagnostic_report.json` (2.1 KB) - Overall statistics
2. `reports/phase0_sample_sentences.json` (16 KB) - 50 sample sentences
3. `reports/phase0_vocab_coverage.json` (1.2 MB) - All 807 words with coverage stats & examples
4. `reports/phase0_missing_low_coverage.json` (116 KB) - 215 priority words (169 missing + 46 low)

**💡 Strategic Decisions:**
- ✅ CORE tier target: ~2,000-2,500 sentences (limited by 1,924 formal available)
- ✅ EXTENDED tier: ~6,500-7,000 sentences
- ✅ AI generation needed for 169 missing vocabulary words (focus on formal examples)
- ✅ Smart filtering approach validated - work with natural distribution

---

## 📋 Implementation Phases (SMART FILTERING APPROACH)

### Overview: Process ALL 9,419 → Select BEST ~2,000-2,500 for CORE

**Strategy (Updated based on Phase 0 findings):**
1. **Phases 1-4:** Analyze and tag ALL 9,419 sentences with rich metadata
2. **Phase 5:** SMART FILTERING - Select best ~2,000-2,500 for CORE tier (limited by 1,924 formal sentences)
3. **Phase 6:** Gap analysis + targeted AI generation (~169 missing vocabulary words)
4. **Phase 7:** Vocabulary difficulty + Progressive IDs
5. **Phase 8:** Final validation + export

**Time:** 6 days (vs 14 days with convert approach)

**CORE Tier Constraint:** Maximum 2,264 sentences possible with 85% formal (1,924 formal + 340 casual)
**EXTENDED Tier:** Remaining ~6,500-7,000 sentences for practice

---

### Phase 1: Difficulty Scoring (ALL 9,419 sentences) ⏳ **PENDING**

**Reference:** `data_set/N5/scripts/phase0_calculate_difficulty_v3.py` (AI-verified, 8.5/10 rating)

**Approach:** Standard Deviation-Based Thresholds (proven methodology)

**Methodology:**
1. Calculate raw difficulty score (0.0-1.0) based on:
   - **30% Grammar complexity** (です/ます, conditionals, particles, clauses)
   - **25% Vocabulary frequency** (using fugashi tokenization + N5 word list)
   - **20% Kanji count** (fewer kanji = easier)
   - **20% Sentence length** (shorter = easier)
   - **5% Features** (questions, embedded clauses, idioms)

2. Apply SD-based thresholds for level assignment (1-10 scale):
   - Calculate mean (μ) and standard deviation (σ) of raw scores
   - Level 1: < μ - 2.5σ (easiest)
   - Level 2: < μ - 1.5σ
   - Level 3: < μ - 1.0σ
   - Level 4: < μ - 0.5σ
   - Level 5-6: μ ± 0.5σ (peak - natural center)
   - Level 7: < μ + 1.0σ
   - Level 8: < μ + 1.5σ
   - Level 9: < μ + 2.0σ
   - Level 10: ≥ μ + 2.5σ (hardest)

3. **Target Distribution (Natural Bell Curve):**
   ```
   Level 1-2:  ~200 (2%)     - Foundation
   Level 3-4:  ~2,700 (29%)  - Entry
   Level 5-6:  ~3,900 (42%)  - Core N5 ⭐ Peak learning
   Level 7-8:  ~2,200 (23%)  - Challenge
   Level 9-10: ~400 (4%)     - Advanced
   ```

**Why SD-based thresholds?**
- ✅ Data-driven (like SAT, IQ tests, JLPT)
- ✅ Natural bell curve (not forced percentiles)
- ✅ Honest about true difficulty
- ✅ Statistically sound
- ✅ Scalable (adding sentences won't change existing levels)

**Script to Adapt:**
```
Source: data_set/N5/scripts/phase0_calculate_difficulty_v3.py
Target: vocab_sources/n5_vocab_final/scripts/phase1_calculate_difficulty.py
Changes:
  - Load from v2 Enhanced JSON (not SQLite)
  - Write to new SQLite database
  - Add columns: difficulty (1-10), raw_score (0.0-1.0)
```

**AI Validation:** ✅ Proven methodology (8.5/10 rating from Claude + ChatGPT)

**Time Estimate:** 3-4 hours (adaptation + testing + validation)

---

### Phase 2: Formality & Question Type Classification ⏳ **PENDING**

**Reference:** `data_set/N5/scripts/phase1_formality_classifier.py` (AI-verified, 100% test accuracy)

**Approach:** Rule-Based Classifier (proven 99.8% accuracy)

**Methodology:**
1. **Formality Detection (check sentence ENDING only - last 15 chars):**
   - **Formal (polite):** です/ます/でした/ました/でしょう/ください/てください/なさい
   - **Casual (plain):** だ/だった/だろう/じゃない/んだ/よ/ね/わ/plain verbs

2. **Question Type Detection:**
   - **Polite questions:** ですか/ますか/でしょうか
   - **Casual questions:** の？/のか？/かな？/だっけ？/plain + ?
   - **Statements:** All others

3. **Critical Implementation Details (from AI feedback):**
   - ✅ Check sentence ENDING only (handles mixed formality correctly)
   - ✅ Check polite patterns BEFORE casual (prevents over-matching)
   - ✅ Include だ/だった/だろう detection (critical missing pattern in v1)

**Expected Results (ALL 9,419 sentences):**
```
ACTUAL Distribution (from Phase 0 Diagnostic):
Formal (polite): 1,924 sentences (20.4%) ✅ CONFIRMED
Casual (plain):  7,495 sentences (79.6%) ✅ CONFIRMED

Question Types: (to be classified)
Statements:       ~6,300 (67%) - estimated
Polite questions: ~1,200 (13%) - estimated
Casual questions: ~1,900 (20%) - estimated

NOTE: We will SELECT from this pool, not convert!
Phase 5 will use 1,924 formal sentences for CORE tier (85%+ formal = max 2,264 CORE)
```

**Purpose:** Tag all sentences so we can make intelligent filtering decisions in Phase 5

**Script to Adapt:**
```
Source: data_set/N5/scripts/phase1_formality_classifier.py
Target: vocab_sources/n5_vocab_final/scripts/phase2_formality_classifier.py
Changes:
  - Load from SQLite (from Phase 1)
  - Add columns: formality, question_type
  - Generate distribution report
```

**AI Validation:** ✅ Proven methodology (9/10 rating, 100% test accuracy)

**Time Estimate:** 2-3 hours (adaptation + validation)

---

### Phase 3: Tokenization & Kana Generation (ALL 9,419 sentences) ⏳ **PENDING**

**Reference:** `data_set/N5/scripts/phase2_tokenization_kana_v2.py` (AI-verified, 8.5/10 rating)

**Approach:** fugashi/MeCab with lemma tracking + pronunciation corrections (proven)

**Methodology:**
1. **Tokenization with fugashi/MeCab (UniDic):**
   - Parse each sentence into morphemes
   - Track lemmas for vocabulary matching (行きます → 行く)
   - Separate content words vs particles

2. **Kana Generation with Pronunciation Corrections:**
   - Generate kana reading for each token
   - Apply 25 common N5 pronunciation corrections:
     - 私 → ワタシ (not ワタクシ)
     - 明日 → アシタ (not アス)
     - 昨日 → キノウ (not サクジツ)
     - 今 → イマ (not キン)
     - etc.

3. **Columns Added:**
   ```
   japanese_spaced:  今日 は 暑い です 。
   kana:             キョウハアツイデス。 (continuous, for TTS)
   kana_spaced:      キョウ ハ アツイ デス 。
   content_words:    ["今日", "暑い"] (JSON - nouns, verbs, adjectives as lemmas)
   particles:        ["は"] (JSON - grammar particles)
   vocab_hits:       ["今日", "暑い", "は"] (JSON - all N5 words found)
   ```

4. **Critical Improvements (from AI feedback):**
   - ✅ Lemma-based vocab tracking (conjugations → dictionary form)
   - ✅ Pronunciation corrections for natural TTS
   - ✅ Separated particles from content words for UI flexibility

**Expected Results:**
```
Total sentences:  9,419 (100% processed)
Avg content words: ~3.0 words/sentence
Avg particles:     ~0.7 particles/sentence
Avg total vocab:   ~3.7 words/sentence ✅ Perfect for N5
100% vocab coverage: All sentences have N5 words
```

**Script to Adapt:**
```
Source: data_set/N5/scripts/phase2_tokenization_kana_v2.py
Target: vocab_sources/n5_vocab_final/scripts/phase3_tokenization_kana.py
Changes:
  - Load from SQLite (from Phase 2)
  - Add 6 new columns (japanese_spaced, kana, kana_spaced, content_words, particles, vocab_hits)
  - Use same pronunciation map (25 corrections)
```

**AI Validation:** ✅ Proven methodology (8.5/10 rating, "Production-ready for N5")

**Dependencies:**
```bash
pip install fugashi unidic-lite
```

**Time Estimate:** 3-4 hours (adaptation + testing)

---

### Phase 4: Grammar Pattern Detection (ALL 9,419 sentences) 🔴 **CRITICAL**

**Status:** NEW IMPLEMENTATION REQUIRED (this was the blocker in old project)

**Goal:** Detect and tag 25+ N5 grammar patterns in ALL sentences for smart filtering

**Approach:** Rule-Based with fugashi/MeCab + Enhanced Regex (AI consensus)

**AI Consultation (4 AIs - 2025-11-03):**
- **Claude AI:** Expand to 25+ patterns, add pre-analysis, validate kanji
- **ChatGPT:** Comprehensive code with 25+ patterns, 85% formal strategy, fugashi tagger
- **Original Analysis:** Needs comprehensive detection, not just 10-12 patterns
- **Team Consensus:** Rule-based is perfect for N5, need 25+ patterns for completeness

**Critical Implementation Notes (ChatGPT Final Validation):**
- ⚠️ **`という` handling:** Flag but don't auto-reject when part of names/quotes
  - Use token context: Check if という appears in quoted phrase or name construct
  - Example: `トムという人` (a person named Tom) - acceptable
  - Example: `彼が来るという` (the fact that he comes) - N4 quotation, reject

- ⚠️ **`られる/れる` disambiguation:** Distinguish passive (N4) from potential (can be N5-like)
  - Use lemma + POS auxiliary tags from fugashi
  - Passive: `食べられる` (is eaten) - reject as N4
  - Potential: `食べられる` (can eat) - context-dependent, may accept
  - Prefer using verb stem + できる for potential to avoid ambiguity

- ⚠️ **Pattern priority:** Check polite markers BEFORE casual to avoid over-matching

**Grammar Patterns to Detect (ChatGPT's comprehensive list):**

**1. Politeness & Copula (5 patterns):**
```python
"desu_masu":        です|ます|でした|ました|でしょうか|でしょう
"da":               だ|だった|だろう
"ka_question":      か[？?]?
"question_word":    ^(何|誰|どこ|いつ|どう|なぜ|どれ|いくら)
"kudasai":          ください
```

**2. Verb Forms (8 patterns):**
```python
"te_kudasai":       てください
"teiru":            ている|てます|ています
"te_form":          て(?!い)
"nai":              ない(です|でした|ですか)?
"ta":               (?<![っど])た(ました|です)?
"tai":              たい(です)?
"dekiru":           できる|できます
"potential":        られる|れる (careful - not passive)
```

**3. Particles (via token analysis - 10+ particles):**
```python
"particle_wa":      は (topic)
"particle_ga":      が (subject)
"particle_wo":      を (object)
"particle_ni":      に (location/direction/time)
"particle_de":      で (location/means)
"particle_to":      と (with/and)
"particle_kara":    から (from)
"particle_made":    まで (until)
"particle_mo":      も (also)
"particle_ne":      ね (confirmation)
"particle_yo":      よ (emphasis)
# ... more particles
```

**4. Advanced N5 Patterns (5+ patterns):**
```python
"adjective_na":     な adjectives with な/に/だ
"adjective_i":      い adjectives with い ending
"comparison":       より|ほど (comparison)
"existence":        いる|ある (existence verbs)
"conjunction":      が|けど|から|ので (conjunctions)
```

**Implementation Strategy:**
1. **Phase 4a: Pattern Detection** (3-4 hours)
   - Implement 25+ pattern matchers (regex + token analysis)
   - Use fugashi for particle/POS detection
   - Store as JSON array: `grammar_patterns: ["desu_masu", "particle_wa", "te_form"]`

2. **Phase 4b: Grammar Complexity Scoring** (2-3 hours)
   - Count patterns per sentence
   - Calculate grammar complexity score (0.0-1.0)
   - Weight patterns by difficulty (です/ます=0.1, conditionals=0.8, etc.)
   - Store as: `grammar_complexity: 0.45`

3. **Phase 4c: Coverage Analysis** (1-2 hours)
   - Generate report: How many sentences per pattern?
   - Identify underrepresented patterns
   - Validate all 25+ patterns are present in dataset

**Script:**
```
Script: vocab_sources/n5_vocab_final/scripts/phase4_grammar_detection.py
Purpose: Detect 25+ N5 grammar patterns in all sentences
Input: SQLite from Phase 3 (with tokenization)
Output: Add columns: grammar_patterns (JSON), grammar_complexity (float)
```

**AI Validation:** ✅ Consensus from 3 AIs (rule-based approach, 25+ patterns needed)

**Expected Output:**
```
Columns Added:
  grammar_patterns:    ["desu_masu", "particle_wa", "te_form", ...]
  grammar_complexity:  0.45 (0.0-1.0 scale)

Coverage Report:
  desu_masu:      ~8,000 sentences (85% if formal target met)
  particle_wa:    ~7,000 sentences
  te_form:        ~3,000 sentences
  teiru:          ~1,500 sentences
  ... (all 25+ patterns)
```

**Time Estimate:** 6-9 hours (critical new implementation)

---

### Phase 5: SMART FILTERING - Select CORE Tier (~2,000-2,500 sentences) ⭐ **KEY INNOVATION**

**Goal:** Select the BEST ~2,000-2,500 sentences from 9,419 for the CORE curriculum

**Status:** This is the heart of our smart approach - **filter, don't convert!**

**Input:** ALL 9,419 sentences with complete metadata from Phases 1-4

**CRITICAL CONSTRAINT (from Phase 0):**
- Only 1,924 formal sentences available naturally
- If CORE = 85% formal → Maximum CORE size = 2,264 sentences
  - 1,924 formal (85%) + 340 casual (15%) = 2,264 total
- **Target: ~2,000-2,200 sentences** (leave some formal for vocabulary diversity)

**Selection Criteria (Hierarchical Priority):**

1. **Formality Filter** (Priority #1):
   - **Target:** 85%+ polite in CORE tier
   - **Available:** 1,924 formal sentences total (20.4% of 9,419)
   - **Strategy:** Take ~1,700-1,870 best formal sentences (save some for vocabulary balance)
   - **Supplement:** ~300-340 cleanest casual sentences for coverage
   - **No conversion:** Keep authentic Tatoeba Japanese

2. **Grammar Pattern Coverage** (Priority #2):
   - **Requirement:** ALL 25+ patterns represented
   - **Minimum per pattern:** 5-10 examples in CORE tier
   - **Strategy:** Greedy selection prioritizing underrepresented patterns
   - **Example:** If ている has only 3 sentences, prioritize sentences with ている

3. **Vocabulary Coverage** (Priority #3):
   - **Requirement:** ALL 807 words have examples in CORE
   - **Target:** 2-3 sentences per word minimum
   - **Strategy:** Prioritize sentences containing words with low coverage
   - **Gap handling:** Words with 0 sentences → AI generation in Phase 6

4. **Difficulty Distribution** (Priority #4):
   - **Target:** Natural bell curve centered at 4.5-5/10
   - **Distribution goal (UPDATED for ~2,200 sentences):**
     ```
     Level 1-2:  ~44 (2%)
     Level 3-4:  ~638 (29%)
     Level 5-6:  ~924 (42%)  ← Peak
     Level 7-8:  ~506 (23%)
     Level 9-10: ~88 (4%)
     Total: ~2,200 sentences
     ```
   - **Strategy:** Balance across levels to match bell curve

5. **Quality Filters** (Applied to all candidates):
   - ✅ Length: Prefer 5-25 characters (simpler)
   - ✅ Complexity: Prefer sentences with 1-2 grammar patterns (clearer learning)
   - ✅ Naturalness: Original Tatoeba sentences only (no conversions)
   - ✅ Clarity: Avoid ambiguous or overly complex sentences

**Selection Algorithm (Greedy with Constraints):**

```python
# Pseudocode for smart filtering (UPDATED for Phase 0 constraints)

CORE_SIZE = 2200  # UPDATED from 3500 (limited by formal sentences)
MIN_FORMAL_RATIO = 0.85
FORMAL_TARGET = int(CORE_SIZE * MIN_FORMAL_RATIO)  # 1,870 formal
CASUAL_ALLOWED = CORE_SIZE - FORMAL_TARGET  # 330 casual
MIN_PATTERN_EXAMPLES = 5
MIN_VOCAB_EXAMPLES = 2

# Step 1: Initial pool (formal sentences only)
# NOTE: Only 1,924 formal sentences available from Phase 0
candidates_formal = filter(sentences, formality="formal")  # 1,924 available
candidates_casual = filter(sentences, formality="casual")  # 7,495 available

# Step 2: Greedy selection loop
selected = []
pattern_counts = {}
vocab_counts = {}

while len(selected) < CORE_SIZE and candidates:
    # Score each candidate
    for sentence in candidates:
        score = 0

        # High priority: underrepresented patterns
        for pattern in sentence.grammar_patterns:
            if pattern_counts[pattern] < MIN_PATTERN_EXAMPLES:
                score += 100

        # Medium priority: underrepresented vocab
        for word in sentence.vocab_hits:
            if vocab_counts[word] < MIN_VOCAB_EXAMPLES:
                score += 50

        # Low priority: difficulty balance
        target_difficulty_bucket = get_target_bucket(len(selected))
        if sentence.difficulty in target_difficulty_bucket:
            score += 20

        # Tie-breakers
        score += (30 - sentence.length) * 0.5  # Prefer shorter
        score += (10 - sentence.grammar_complexity * 10) * 0.3  # Prefer simpler

    # Pick highest scoring sentence
    best = max(candidates, key=lambda s: score(s))
    selected.append(best)
    update_counts(best, pattern_counts, vocab_counts)
    candidates.remove(best)

# Step 3: Validation
validate_coverage(selected, patterns, vocabulary)
validate_formality(selected, min_ratio=0.85)
validate_difficulty_distribution(selected, target_bell_curve)
```

**Output (UPDATED for Phase 0 constraints):**

```
CORE TIER: N5_807_data_set_details/n5_core_curriculum.db
Sentences: ~2,000-2,200 (curated best - limited by 1,924 formal available)
Formality: 85%+ polite (~1,870 formal + ~330 casual = 2,200 total)
Grammar Coverage: Maximum N5 patterns with 5-10 examples each
Vocabulary Coverage: Maximum from natural Tatoeba (expect gaps for 169 missing words)
Difficulty: Natural bell curve centered at 4.5-5
Quality: 100% authentic Tatoeba (no conversions)

EXTENDED TIER: N5_807_data_set_details/n5_extended_practice.db
Sentences: ~7,200 (remaining sentences after CORE selection)
Formality: Natural distribution (~20% formal, 80% casual)
Purpose: Additional practice after completing CORE
```

**Expected Coverage Report (estimates based on Phase 0):**
```
Grammar Pattern Coverage:
  desu_masu:        ~1,600 sentences (73%)  ✅ (from 1,870 formal + some casual)
  particle_wa:      ~850 sentences (39%)    ✅
  te_form:          ~150 sentences (7%)     ✅
  teiru:            ~80 sentences (4%)      ✅
  ... (most 25+ patterns covered, some may need AI generation)

Vocabulary Coverage (KNOWN from Phase 0):
  Words with 0 examples:    169 (20.9%)  🔴 → AI generation REQUIRED
  Words with 1 example:     46 (5.7%)    ⚠️ → AI generation recommended
  Words with 2-5 examples:  110 (13.6%)  ✅
  Words with 6+ examples:   482 (59.7%)  ✅

  Total Natural Coverage: 638/807 (79.1%)
  Need AI Generation: 169 words minimum, 215 words recommended

Difficulty Distribution (target for ~2,200 sentences):
  Level 1-2:   ~44 (2%)    Target
  Level 3-4:   ~638 (29%)  Target
  Level 5-6:   ~924 (42%)  Target ← Peak
  Level 7-8:   ~506 (23%)  Target
  Level 9-10:  ~88 (4%)    Target
```

**Script:**
```
Script: N5_807_data_set_details/scripts/phase5_smart_filtering.py
Purpose: Select best ~2,000-2,200 sentences for CORE tier
Input: JSON from Phase 4 (all 9,419 with metadata)
Output:
  - n5_core_curriculum.db (CORE tier)
  - n5_extended_practice.db (EXTENDED tier)
  - phase5_coverage_report.json (detailed gap analysis)
  - phase5_filtering_summary.json (selection statistics)
```

**Time Estimate:** 4-6 hours (algorithm + testing + validation)

---

### Phase 6: Gap Analysis & Targeted AI Generation ⏳ **PENDING**

**Goal:** Fill vocabulary and grammar gaps identified in Phase 0 and Phase 5

**Status:** Generate ONLY for confirmed gaps

**KNOWN Gaps from Phase 0:**

1. **Vocabulary Gaps (CONFIRMED):**
   - **169 words with 0 examples** (20.9%) - MUST generate
   - **46 words with 1 example** (5.7%) - SHOULD generate 1-2 more
   - **Total: 215 priority words**
   - Source: `reports/phase0_missing_low_coverage.json`
   - Common missing words: お金, お茶, お母さん, お父さん, お弁当, etc.

**AI Generation Strategy:**

1. **Minimum Target (169 missing words):**
   - Generate 2 sentences per word × 169 words = **338 sentences**
   - Priority: Essential N5 vocabulary (family, food, money, daily items)
   - Formality: 100% formal (です/ます) to supplement CORE tier
   - Difficulty: Levels 2-6 (beginner to intermediate)

2. **Recommended Target (215 priority words):**
   - 169 missing words: 2 sentences each = 338 sentences
   - 46 low coverage words: 1-2 more each = 46-92 sentences
   - **Total: 384-430 sentences**

**Expected Gaps from Phase 5 (to be confirmed):**

1. **Grammar Pattern Gaps:**
   - Patterns with < 5 examples in CORE after filtering
   - Example: If たい (desire) only has 2 examples, generate 3 more formal examples
   - Estimated: ~50-100 sentences (depends on Phase 5 results)
**Total AI Generation Estimate:**
- **Minimum:** 338 sentences (169 missing words × 2)
- **Recommended:** 384-430 sentences (215 priority words)
- **Plus grammar gaps:** +50-100 sentences (if needed after Phase 5)
- **Grand Total:** ~400-530 AI-generated sentences

**Generation Strategy:**

```python
# For vocabulary gaps
for word in words_with_zero_examples:
    prompt = f"""
    Generate 2 strictly N5-level Japanese sentences using the word: {word}

    Requirements:
    - Formal/polite form (です/ます)
    - Difficulty level: 3-5 (beginner-friendly)
    - Grammar: Only N5 patterns (です/ます, particles, て-form, ている, たい, ない)
    - Vocabulary: Only N5 words
    - Length: 5-20 characters
    - Natural, common usage

    Format:
    1. [Japanese sentence]
       [English translation]
    2. [Japanese sentence]
       [English translation]
    """

    sentences = claude_api.generate(prompt)
    validate_with_n5_filter(sentences)  # Must pass same filters as Tatoeba
    add_to_core_tier(sentences)

# For grammar pattern gaps
for pattern in patterns_with_low_coverage:
    prompt = f"""
    Generate 5 strictly N5-level Japanese sentences demonstrating: {pattern}

    [Same requirements as above]
    """
    # ... same process
```

**Validation:** ALL generated sentences must:
- ✅ Pass N5 vocabulary filter (100% match with 807 words)
- ✅ Pass N5 grammar filter (no N4+ patterns)
- ✅ Pass tokenization + kana generation
- ✅ Human review on 100% of generated sentences
- ✅ Marked as source: "ai-generated"

**Output (UPDATED for Phase 0 constraints):**
```
Updated: N5_807_data_set_details/n5_core_curriculum.db
New AI-generated sentences: ~400-530 (for 169-215 missing/low coverage words + grammar gaps)
Total CORE after AI generation: ~2,400-2,730 sentences
  - Natural Tatoeba: ~2,000-2,200 (85% formal)
  - AI-generated: ~400-530 (100% formal, filling vocabulary gaps)
All vocabulary gaps filled: ✅ (807/807 words covered)
```

**Final CORE Tier Composition:**
```
Total: ~2,400-2,730 sentences
Natural Tatoeba: ~2,000-2,200 (73-82%)
AI-Generated: ~400-530 (18-22%)
Formality: 85-90% formal overall (both sources formal-heavy)
Vocabulary: 100% coverage (807/807 words)
```

**Script:**
```
Script: N5_807_data_set_details/scripts/phase6_ai_generation.py
Purpose: Generate sentences for 169 missing + 46 low coverage words
Input:
  - reports/phase0_missing_low_coverage.json (215 priority words)
  - reports/phase5_coverage_report.json (grammar gaps after filtering)
Output:
  - data/ai_generated_sentences.json (new sentences)
  - Updated n5_core_curriculum.db with AI sentences
API: Uses Claude API for generation
```

**Time Estimate:** 6-8 hours (prompting + generation + validation + human review)

---

### Phase 7: Vocabulary Difficulty & Progressive IDs ⏳ **PENDING**

**Goal:** Assign difficulty and progressive IDs to all 807 vocabulary words

**Input:** CORE tier from Phase 6 (final sentence set with all metadata)

**Methodology:**

**Simplified 3-Factor Scoring** (based on user feedback):
1. **50% Usage frequency** in CORE tier (more common = easier)
2. **30% Average sentence difficulty** (sentences containing this word)
3. **20% Kanji complexity** (stroke count from JMdict)

**Calculate for each word:**
```python
for word in vocabulary:
    # Factor 1: Usage frequency
    usage_count = count_in_core_tier(word)
    usage_score = normalize(usage_count, 0, max_usage)  # 0.0-1.0

    # Factor 2: Avg sentence difficulty
    sentences_with_word = filter_core_by_vocab(word)
    avg_difficulty = mean([s.raw_difficulty for s in sentences_with_word])

    # Factor 3: Kanji complexity (stroke count)
    stroke_count = get_stroke_count(word) if has_kanji(word) else 0
    kanji_score = normalize(stroke_count, 0, 30)  # 0.0-1.0

    # Combined difficulty (inverted for usage - higher usage = easier)
    raw_difficulty = (
        (1.0 - usage_score) * 0.50 +  # Invert: high usage = low difficulty
        avg_difficulty * 0.30 +
        kanji_score * 0.20
    )

    # SD-based level assignment (1-10)
    difficulty_level = assign_level_by_sd(raw_difficulty, mean, std)

    # Store
    word.difficulty = difficulty_level
    word.difficulty_raw = raw_difficulty
    word.usage_frequency = usage_count
    word.avg_sentence_difficulty = avg_difficulty
```

**Progressive ID Assignment:**
```python
# Sort by difficulty (ascending), then by usage frequency (descending)
sorted_vocab = sorted(vocabulary,
                      key=lambda w: (w.difficulty, -w.usage_frequency))

# Assign progressive IDs
for i, word in enumerate(sorted_vocab, start=1):
    word.progressive_id = f"n5_vocab_{i:04d}"  # n5_vocab_0001, n5_vocab_0002, ...
```

**Expected Distribution:**
```
Level 1-2:  ~16 words (2%)    - Survival basics (はい, ありがとう, etc.)
Level 3-4:  ~234 words (29%)  - Common nouns/verbs (食べる, 学校, etc.)
Level 5-6:  ~339 words (42%)  - Core N5 vocabulary
Level 7-8:  ~186 words (23%)  - Advanced N5
Level 9-10: ~32 words (4%)    - Specialized/abstract

Example Progressive Order:
n5_vocab_0001: はい (yes) - Level 1, usage: 234, difficulty: 0.102
n5_vocab_0002: いいえ (no) - Level 1, usage: 187, difficulty: 0.115
n5_vocab_0003: ありがとう (thank you) - Level 1, usage: 156, difficulty: 0.134
...
n5_vocab_0805: 以外 (except) - Level 9, usage: 12, difficulty: 0.876
n5_vocab_0806: 抽象 (abstract) - Level 10, usage: 8, difficulty: 0.923
n5_vocab_0807: ... - Level 10, usage: 5, difficulty: 0.951
```

**Output:**
```
Updated: vocab_sources/n5_vocab_final/N5_vocab_dataset_final.json

Each word gets:
  progressive_id: "n5_vocab_0001" (sorted by difficulty)
  difficulty: 1-10 (SD-based level)
  difficulty_raw: 0.102 (0.0-1.0 raw score)
  usage_frequency: 234 (count in CORE tier)
  avg_sentence_difficulty: 2.3 (average of containing sentences)
  stroke_count: 5 (for kanji complexity)
```

**Script:**
```
Script: vocab_sources/n5_vocab_final/scripts/phase7_vocab_difficulty.py
Purpose: Calculate vocabulary difficulty and assign progressive IDs
Input: n5_core_curriculum.db, N5_vocab_dataset_final.json
Output: Updated N5_vocab_dataset_final.json with progressive IDs
```

**Time Estimate:** 3-4 hours

---

### Phase 8: Final Validation & Export ⏳ **PENDING**

**Goal:** Validate CORE + EXTENDED tiers and export final datasets

**Tasks:**

1. **Data Validation (2 hours):**
   ```
   CORE TIER Validation:
   ✅ 3,200-4,350 sentences (with AI-generated)
   ✅ 85%+ formality (polite sentences)
   ✅ ALL 807 vocabulary words have 2+ examples
   ✅ ALL 25+ grammar patterns have 5+ examples
   ✅ Bell curve difficulty distribution
   ✅ No missing metadata fields
   ✅ 100% validated (manual review on 10% sample)

   EXTENDED TIER Validation:
   ✅ ~5,500-6,000 sentences (remaining)
   ✅ Natural formality distribution
   ✅ Complete metadata for all
   ✅ Quality filter passed (N5 vocab + grammar)

   VOCABULARY Validation:
   ✅ All 807 words have progressive IDs (n5_vocab_0001-0807)
   ✅ All words have difficulty scores (1-10)
   ✅ All words have usage frequency from CORE tier
   ```

2. **Export Final Datasets (2 hours):**
   ```
   Output Files:

   1. n5_core_curriculum_final.json (CORE TIER)
      Size: ~1.8-2.2 MB
      Sentences: 3,200-4,350
      Purpose: Primary progressive curriculum
      Metadata: Complete (all fields)

   2. n5_extended_practice_final.json (EXTENDED TIER)
      Size: ~2.8-3.2 MB
      Sentences: ~5,500-6,000
      Purpose: Supplementary practice
      Metadata: Complete (all fields)

   3. n5_complete_curriculum_final.json (BOTH TIERS)
      Size: ~4.6-5.4 MB
      Sentences: 9,419 total
      Tiers: Core + Extended with tier tags
      Purpose: Complete dataset with both tiers

   4. N5_vocab_dataset_final.json (VOCABULARY - Updated)
      Size: ~650 KB
      Words: 807 with progressive IDs
      Metadata: difficulty, usage, progressive_id

   Format Example (CORE TIER):
   {
     "metadata": {
       "version": "1.0",
       "tier": "core",
       "total_sentences": 3500,
       "total_vocabulary": 807,
       "formality": {"formal": 2975, "casual": 525},
       "difficulty_distribution": {
         "1-2": 70, "3-4": 1015, "5-6": 1470,
         "7-8": 805, "9-10": 140
       },
       "grammar_patterns": 25,
       "tatoeba_sentences": 3200,
       "ai_generated_sentences": 300,
       "created": "2025-11-03"
     },
     "sentences": [
       {
         "id": "tatoeba_12345",
         "tier": "core",
         "japanese": "今日は暑いです。",
         "japanese_spaced": "今日 は 暑い です 。",
         "kana": "キョウハアツイデス。",
         "kana_spaced": "キョウ ハ アツイ デス 。",
         "english": "It's hot today.",
         "difficulty": 4,
         "difficulty_raw": 0.389,
         "formality": "formal",
         "question_type": "statement",
         "content_words": ["今日", "暑い"],
         "particles": ["は"],
         "vocab_hits": ["今日", "暑い", "は"],
         "grammar_patterns": ["desu_masu", "particle_wa", "adjective_i"],
         "grammar_complexity": 0.35,
         "source": "tatoeba"
       },
       ...
     ]
   }
   ```

3. **Generate Coverage Reports (2 hours):**
   ```
   Reports to Generate:

   1. core_curriculum_report.md
      - Vocabulary coverage (sentences per word)
      - Grammar coverage (sentences per pattern)
      - Difficulty distribution histogram
      - Formality distribution
      - Quality metrics

   2. extended_practice_report.md
      - Same metrics for extended tier
      - Comparison to CORE tier

   3. vocabulary_progression_report.md
      - Progressive ID assignments
      - Difficulty distribution for words
      - Usage frequency analysis
      - Example sentences per word

   4. curriculum_guide.md
      - How to use the curriculum
      - Recommended learning path
      - Integration instructions for apps
   ```

4. **Manual Quality Checks (2-3 hours):**
   - Random sample 300-400 CORE sentences (10%)
   - Verify formality tags correct
   - Verify grammar patterns correct
   - Verify difficulty feels right
   - Check for any unnatural Japanese
   - Validate AI-generated sentences (100% review)

5. **Update Documentation (1-2 hours):**
   - Update this file with final statistics
   - Create CURRICULUM_GUIDE.md
   - Update README.md
   - Create VERSION_HISTORY.md
   - Update ENHANCEMENT_COMPLETE.md

**Script:**
```
Script: vocab_sources/n5_vocab_final/scripts/phase8_final_export.py
Purpose: Export all final datasets with validation
Input: n5_core_curriculum.db, n5_extended_practice.db, N5_vocab_dataset_final.json
Output: All JSON exports + reports
```

**Time Estimate:** 7-9 hours (validation + export + QA + docs)

---

## 📊 Expected Final Statistics (SMART FILTERING APPROACH)

### CORE TIER (Primary Curriculum) - Target
```
Database: vocab_sources/n5_vocab_final/n5_core_curriculum_final.json
Total sentences: 3,200-4,350 (curated best + AI-generated for gaps)

SOURCE BREAKDOWN:
├─ Tatoeba (natural): ~3,000-4,000 sentences (85-92%)
└─ AI-generated (gaps): ~200-350 sentences (8-15%)

FORMALITY DISTRIBUTION:
├─ Formal (polite): ~2,900-3,700 (85-90%) ✅ Exam preparation focus
└─ Casual (plain):  ~300-650 (10-15%) ✅ Selected for coverage only

DIFFICULTY DISTRIBUTION (Natural Bell Curve):
├─ Level 1-2:  ~70 (2%)      - Foundation
├─ Level 3-4:  ~1,015 (29%)  - Entry
├─ Level 5-6:  ~1,470 (42%)  - Core N5 ⭐ Peak learning
├─ Level 7-8:  ~805 (23%)    - Challenge
└─ Level 9-10: ~140 (4%)     - Advanced

QUESTION TYPES:
├─ Statements:       ~2,350 (67%)
├─ Polite questions: ~455 (13%)
└─ Casual questions: ~195 (6%)

GRAMMAR COVERAGE:
├─ Total patterns: 25+
├─ Minimum per pattern: 5-10 examples ✅
├─ Most common: です/ます (~3,000), particles (~2,600)
├─ Balanced distribution: All patterns well-represented
└─ Coverage: 100% of N5 grammar ✅

VOCABULARY COVERAGE:
├─ Words with 0 examples: 0 (0%) ✅ All filled
├─ Words with 1 example: 0 (0%) ✅ All filled
├─ Words with 2+ examples: 807 (100%) ✅
├─ Words with 3+ examples: ~680 (84%) ✅
└─ Target: 2-3 examples per word ✅ ACHIEVED

METADATA COMPLETENESS:
├─ All base fields: 100%
├─ japanese_spaced, kana, kana_spaced: 100%
├─ difficulty, formality, question_type: 100%
├─ content_words, particles, vocab_hits: 100%
├─ grammar_patterns, grammar_complexity: 100%
├─ tier: "core" tag: 100%
└─ Complete metadata: ✅ 100%

QUALITY:
├─ 100% N5 vocabulary match ✅
├─ 100% N5 grammar patterns ✅
├─ 100% authentic or AI-validated ✅
├─ Manual QA on 10% sample (300-400 sentences) ✅
└─ AI-generated: 100% human reviewed ✅
```

### EXTENDED TIER (Supplementary Practice) - Target
```
Database: vocab_sources/n5_vocab_final/n5_extended_practice_final.json
Total sentences: ~5,500-6,200 (remaining from 9,419 after CORE selection)

FORMALITY DISTRIBUTION (Natural Tatoeba):
├─ Formal (polite): ~1,900-2,500 (35-40%)
└─ Casual (plain):  ~3,600-3,700 (60-65%)

DIFFICULTY DISTRIBUTION:
├─ All difficulty levels represented
├─ Natural distribution (not curated)
└─ Broader range than CORE

PURPOSE:
├─ Additional reading practice after CORE completion
├─ Casual sentence comprehension training
├─ Extended examples for vocabulary reinforcement
└─ Optional supplementary material

METADATA COMPLETENESS:
├─ Same as CORE tier: 100%
└─ tier: "extended" tag: 100%

QUALITY:
├─ 100% N5 vocabulary match ✅
├─ 100% N5 grammar patterns (15 N4+ rejected) ✅
└─ Full metadata for all sentences ✅
```

### COMPLETE DATASET (Both Tiers Combined)
```
File: vocab_sources/n5_vocab_final/n5_complete_curriculum_final.json
Total sentences: 9,419 (ALL analyzed, ALL tagged)
Tiers: CORE (3,500) + EXTENDED (5,900)
Size: ~4.6-5.4 MB
Purpose: Complete dataset with tier flexibility
Use Case: Apps can use CORE alone or both tiers together
```

### Vocabulary Dataset (Target)
```
File: vocab_sources/n5_vocab_final/N5_vocab_dataset_final.json
Total words: 807 (100% JMdict coverage)

PROGRESSIVE IDs:
├─ n5_vocab_0001 → n5_vocab_0807
├─ Sorted by: difficulty (ascending)
└─ Distribution: Natural (matches sentence difficulty curve)

DIFFICULTY DISTRIBUTION:
├─ Level 1-2:  ~16 (2%)    - Survival words
├─ Level 3-4:  ~234 (29%)  - Basic vocabulary
├─ Level 5-6:  ~339 (42%)  - Core N5 vocabulary
├─ Level 7-8:  ~186 (23%)  - Advanced N5
└─ Level 9-10: ~32 (4%)    - Specialized

METADATA ADDED:
├─ progressive_id: n5_vocab_0001 (sorted by difficulty)
├─ difficulty: 1-10 (level)
├─ difficulty_raw: 0.0-1.0 (raw score)
├─ usage_frequency: count in 9,419 sentences
└─ avg_sentence_difficulty: average difficulty of containing sentences
```

---

## 🔧 Scripts Inventory

### Diagnostic & Analysis
```
vocab_sources/n5_vocab_final/scripts/phase0_diagnostic.py
  └─ Analyze v2 Enhanced current state
  └─ Generate diagnostic report
  └─ Status: ⏳ TO BE CREATED
```

### Phase 1: Difficulty Scoring
```
Source: data_set/N5/scripts/phase0_calculate_difficulty_v3.py (✅ AI-verified)
Target: vocab_sources/n5_vocab_final/scripts/phase1_calculate_difficulty.py
  └─ SD-based difficulty scoring (1-10 scale)
  └─ Natural bell curve distribution
  └─ Status: ⏳ TO BE ADAPTED
```

### Phase 2: Formality Classification
```
Source: data_set/N5/scripts/phase1_formality_classifier.py (✅ AI-verified)
Target: vocab_sources/n5_vocab_final/scripts/phase2_formality_classifier.py
  └─ Rule-based formality & question type detection
  └─ 99.8% accuracy proven
  └─ Status: ⏳ TO BE ADAPTED
```

### Phase 3: Tokenization & Kana
```
Source: data_set/N5/scripts/phase2_tokenization_kana_v2.py (✅ AI-verified)
Target: vocab_sources/n5_vocab_final/scripts/phase3_tokenization_kana.py
  └─ fugashi/MeCab tokenization
  └─ Kana generation with pronunciation corrections
  └─ Lemma tracking for vocabulary
  └─ Status: ⏳ TO BE ADAPTED
```

### Phase 4: Grammar Pattern Detection (NEW - Critical)
```
vocab_sources/n5_vocab_final/scripts/phase4_grammar_detection.py
  └─ Detect 25+ N5 grammar patterns
  └─ Calculate grammar complexity
  └─ Generate coverage report
  └─ Status: 🔴 NEW IMPLEMENTATION REQUIRED
```

### Phase 5: Smart Filtering (KEY INNOVATION) ⭐
```
vocab_sources/n5_vocab_final/scripts/phase5_smart_filtering.py
  └─ Select best 3,000-4,000 sentences for CORE tier
  └─ Greedy algorithm with coverage constraints
  └─ Prioritize formality, grammar patterns, vocabulary coverage
  └─ Export CORE + EXTENDED tiers
  └─ Generate coverage gap report
  └─ Status: ⏳ TO BE CREATED
```

### Phase 6: AI Generation (Gap Filling)
```
vocab_sources/n5_vocab_final/scripts/phase6_ai_generation.py
  └─ Generate ~200-350 sentences for coverage gaps
  └─ Fill vocabulary gaps (words with 0-1 examples)
  └─ Fill grammar pattern gaps (patterns with <5 examples)
  └─ Claude API integration
  └─ 100% validation and human review
  └─ Status: ⏳ TO BE CREATED
```

### Phase 7: Vocabulary Difficulty & Progressive IDs
```
vocab_sources/n5_vocab_final/scripts/phase7_vocab_difficulty.py
  └─ Calculate vocabulary difficulty (3-factor scoring)
  └─ Assign progressive IDs (n5_vocab_0001 → n5_vocab_0807)
  └─ Update N5_vocab_dataset_final.json
  └─ Status: ⏳ TO BE CREATED
```

### Phase 8: Final Validation & Export
```
vocab_sources/n5_vocab_final/scripts/phase8_final_export.py
  └─ Validate CORE + EXTENDED tiers
  └─ Export all final JSON datasets
  └─ Generate comprehensive coverage reports
  └─ Manual QA (10% sample of CORE)
  └─ Update documentation
  └─ Status: ⏳ TO BE CREATED
```

---

## 📚 Reference Documentation

### Source Methodology (Proven Approach)
- **Original Implementation:** `docs/vocabulary_implementation.md`
- **Phases 0-2:** ✅ AI-verified scripts available
- **Phase 3:** 🔴 Was the blocker - now solved with comprehensive approach
- **Rating:** 8.5-9/10 from Claude AI + ChatGPT

### v2 Enhanced Dataset Creation
- **Enhancement Complete:** `vocab_sources/n5_vocab_final/ENHANCEMENT_COMPLETE.md`
- **Version Comparison:** `vocab_sources/n5_vocab_final/VERSION_COMPARISON.md`
- **AI Validation:** `vocab_sources/n5_vocab_final/AI_VALIDATION_RESULTS.md`
- **Rating:** 9/10 from ChatGPT + Claude for v2 methodology

### Current Project Documentation
- **Main README:** `vocab_sources/n5_vocab_final/README.md`
- **Vocabulary Guide:** `vocab_sources/n5_vocab_final/VOCABULARY_README.md`
- **This Document:** Single source of truth for progressive curriculum

---

## 🎯 Success Criteria

### Must-Have (Non-negotiable)
- ✅ All 9,419 sentences have complete metadata (100%)
- ✅ 85% formal (polite) sentences (~8,000 sentences)
- ✅ Natural bell curve difficulty centered at 4.5-5/10
- ✅ All 25+ N5 grammar patterns detected and tagged
- ✅ All 807 vocabulary words have progressive IDs (n5_vocab_0001 → n5_vocab_0807)
- ✅ 100% vocabulary coverage maintained (807 words only)

### Nice-to-Have (Optional)
- 🎯 Scenario grouping (daily life, school, travel, etc.)
- 🎯 Sentence similarity clustering
- 🎯 Audio generation for TTS
- 🎯 Example sentence assignment to vocabulary (2-3 per word)

---

## 📐 Final Data Schema

### CORE Tier Sentence Object (Example with Default Values)
```json
{
  "id": "tatoeba_12345",
  "tier": "core",
  "japanese": "今日は暑いです。",
  "japanese_spaced": "今日 は 暑い です 。",
  "kana": "キョウハアツイデス。",
  "kana_spaced": "キョウ ハ アツイ デス 。",
  "english": "It's hot today.",
  "difficulty": 4,
  "difficulty_raw": 0.389,
  "formality": "formal",
  "question_type": "statement",
  "content_words": ["今日", "暑い"],
  "particles": ["は"],
  "vocab_hits": ["今日", "暑い", "は"],
  "grammar_patterns": ["desu_masu", "particle_wa", "adjective_i"],
  "grammar_complexity": 0.35,
  "source": "tatoeba",
  "length": 9,
  "kanji_count": 2
}
```

### EXTENDED Tier Sentence Object
```json
{
  "id": "tatoeba_67890",
  "tier": "extended",
  "japanese": "明日行くよ。",
  "japanese_spaced": "明日 行く よ 。",
  "kana": "アシタイクヨ。",
  "kana_spaced": "アシタ イク ヨ 。",
  "english": "I'll go tomorrow.",
  "difficulty": 3,
  "difficulty_raw": 0.312,
  "formality": "casual",
  "question_type": "statement",
  "content_words": ["明日", "行く"],
  "particles": ["よ"],
  "vocab_hits": ["明日", "行く", "よ"],
  "grammar_patterns": ["plain_form", "particle_yo"],
  "grammar_complexity": 0.25,
  "source": "tatoeba",
  "length": 6,
  "kanji_count": 2
}
```

### Vocabulary Object (with Progressive ID + Existing Fields)
```json
{
  "id": "n5_vocab_0001",
  "progressive_id": "n5_vocab_0001",
  "kanji": "はい",
  "kana": "はい",
  "romaji": "hai",
  "meaning": ["yes"],
  "jlptLevel": "N5",
  "partOfSpeech": ["interjection"],
  "tags": ["common", "beginner"],
  "difficulty": 1,
  "difficulty_raw": 0.102,
  "usage_frequency": 234,
  "avg_sentence_difficulty": 2.3,
  "stroke_count": 0,
  "examples": [
    {
      "japanese": "はい、分かりました。",
      "kana": "はい、わかりました。",
      "english": "Yes, I understand.",
      "source": {
        "type": "tatoeba",
        "id": "12345"
      },
      "license": {
        "text": "CC BY 2.0 FR",
        "url": "https://creativecommons.org/licenses/by/2.0/fr/"
      },
      "audioUrl": "/audio/n5/examples/n5_vocab_0001_ex1.mp3",
      "difficulty": 2,
      "formality": "formal",
      "grammar_patterns": ["desu_masu"]
    },
    {
      "japanese": "はい、そうです。",
      "kana": "はい、そうです。",
      "english": "Yes, that's right.",
      "source": {
        "type": "tatoeba",
        "id": "23456"
      },
      "license": {
        "text": "CC BY 2.0 FR",
        "url": "https://creativecommons.org/licenses/by/2.0/fr/"
      },
      "audioUrl": "/audio/n5/examples/n5_vocab_0001_ex2.mp3",
      "difficulty": 1,
      "formality": "formal",
      "grammar_patterns": ["desu_masu"]
    }
  ],
  "audio": {
    "pronunciationUrl": "/audio/n5/n5_vocab_0001.mp3",
    "source": "pending"
  },
  "source": {
    "type": "jmdict",
    "url": "http://www.edrdg.org/jmdict/j_jmdict.html"
  },
  "license": {
    "text": "CC BY-SA 3.0",
    "url": "https://creativecommons.org/licenses/by-sa/3.0/"
  }
}
```

### Metadata Object (Dataset Level)
```json
{
  "version": "1.0",
  "tier": "core",
  "created": "2025-11-03",
  "total_sentences": 3200,
  "total_vocabulary": 807,
  "formality": {
    "formal": 2720,
    "casual": 480,
    "formal_percent": 85
  },
  "difficulty_distribution": {
    "1-2": 64,
    "3-4": 928,
    "5-6": 1344,
    "7-8": 736,
    "9-10": 128
  },
  "grammar_patterns": 25,
  "tatoeba_sentences": 3200,
  "ai_generated_sentences": 0,
  "source": "Tatoeba + N5 807 vocabulary filtering",
  "license": "CC BY 2.0 FR (Tatoeba)",
  "filters_applied": [
    "100% N5 vocabulary (807 words)",
    "15 N4+ grammar patterns rejected",
    "Smart filtering for quality",
    "Natural sentences only (no conversions)"
  ]
}
```

### Field Descriptions

**Sentence Fields:**
- `id`: Tatoeba sentence ID (format: "tatoeba_12345")
- `tier`: "core" or "extended"
- `japanese`: Original Japanese sentence
- `japanese_spaced`: Space-separated tokens for learners
- `kana`: Continuous kana (for TTS)
- `kana_spaced`: Space-separated kana
- `english`: English translation
- `difficulty`: 1-10 scale (SD-based)
- `difficulty_raw`: 0.0-1.0 raw score
- `formality`: "formal" or "casual"
- `question_type`: "statement", "polite_question", "casual_question"
- `content_words`: Array of nouns/verbs/adjectives (lemmas)
- `particles`: Array of particles found
- `vocab_hits`: Array of ALL N5 words found (includes particles)
- `grammar_patterns`: Array of pattern names detected
- `grammar_complexity`: 0.0-1.0 complexity score
- `source`: "tatoeba" or "ai-generated"
- `length`: Character count
- `kanji_count`: Number of kanji characters

**Vocabulary Fields:**
- `id`: Same as progressive_id (for compatibility)
- `progressive_id`: Sequential ID by difficulty (n5_vocab_0001-0807) **NEW**
- `kanji`: Kanji form (if exists)
- `kana`: Kana form
- `romaji`: Romanized form
- `meaning`: Array of English meanings
- `jlptLevel`: "N5"
- `partOfSpeech`: Array of parts of speech
- `tags`: Array of descriptive tags
- `difficulty`: 1-10 scale (3-factor scoring) **NEW**
- `difficulty_raw`: 0.0-1.0 raw score **NEW**
- `usage_frequency`: Count in CORE tier **NEW**
- `avg_sentence_difficulty`: Average difficulty of containing sentences **NEW**
- `stroke_count`: Stroke count (0 if kana-only) **NEW**
- `examples`: Array of example sentences (from CORE tier)
  - `japanese`: Japanese sentence
  - `kana`: Kana reading
  - `english`: English translation
  - `source`: {type, id}
  - `license`: {text, url}
  - `audioUrl`: Path to audio file
  - `difficulty`: Sentence difficulty (1-10) **NEW**
  - `formality`: "formal" or "casual" **NEW**
  - `grammar_patterns`: Array of patterns **NEW**
- `audio`: {pronunciationUrl, source}
- `source`: {type, url}
- `license`: {text, url}

---

## ⏱️ Timeline Estimate (SMART FILTERING APPROACH)

### Phase-by-Phase Breakdown
```
Phase 0: Diagnostic                      30 min       ⏳ IN PROGRESS
Phase 1: Difficulty Scoring (9,419)     3-4 hours    ⏳ PENDING
Phase 2: Formality Classification       2-3 hours    ⏳ PENDING
Phase 3: Tokenization & Kana            3-4 hours    ⏳ PENDING
Phase 4: Grammar Pattern Detection      6-9 hours    🔴 CRITICAL
Phase 5: Smart Filtering (CORE)         4-6 hours    ⭐ KEY INNOVATION
Phase 6: AI Generation (gaps)           6-8 hours    ⏳ PENDING
Phase 7: Vocabulary Difficulty          3-4 hours    ⏳ PENDING
Phase 8: Final Validation & Export      7-9 hours    ⏳ PENDING

TOTAL: 35-47 hours (4.5-6 days if working 8 hours/day)

SAVINGS vs Conversion Approach:
- No Phase 2b conversion: -4 to -6 hours ✅
- Smart filtering faster than fixing all: -3 to -5 hours ✅
- Better quality, less risk: Priceless! ✅
```

### Realistic Schedule (6 days) 🎯 **OPTIMIZED**
```
Day 1 (8 hours): Phase 0 + Phase 1
  - Morning: Run diagnostic (30 min)
  - Morning-Afternoon: Adapt & run difficulty scoring on ALL 9,419 (3-4 hours)
  - Afternoon: Review results, validate distribution
  - Evening: Start Phase 2 setup

Day 2 (8 hours): Phase 2 + Phase 3
  - Morning: Adapt & run formality classification (2-3 hours)
  - Afternoon: Adapt & run tokenization + kana generation (3-4 hours)
  - Evening: Validate kana accuracy on sample

Day 3 (8 hours): Phase 4 - Grammar Detection (Part 1)
  - Full day: Implement 25+ grammar pattern detection
  - Build pattern matchers (regex + token analysis)
  - Test on sample sentences

Day 4 (8 hours): Phase 4 - Grammar Detection (Part 2) + Phase 5 Start
  - Morning: Complete grammar detection, run on ALL 9,419 (3-4 hours)
  - Afternoon: Start Phase 5 - Smart filtering algorithm (4 hours)
  - Evening: Initial CORE tier selection

Day 5 (8 hours): Phase 5 Complete + Phase 6
  - Morning: Finish smart filtering, validate coverage (2 hours)
  - Afternoon-Evening: AI generation for gaps (~300 sentences, 6 hours)
  - Manual review of AI-generated sentences

Day 6 (8 hours): Phase 7 + Phase 8
  - Morning: Vocabulary difficulty & progressive IDs (3-4 hours)
  - Afternoon: Final validation, export, reports (4 hours)
  - Evening: Manual QA (10% sample), update docs (1-2 hours)

CONTINGENCY: Add Day 7 if needed for extra QA or fixes
```

### Comparison: Smart Filtering vs Old Approach
```
OLD APPROACH (Convert all 9,419):
- Days: 7-14 days
- Risk: High (conversion errors, unnatural Japanese)
- Quality: Mixed (some sentences forced to polite)
- Coverage: 100% of 9,419 (quantity focus)

SMART FILTERING (Curate best 3,500): ⭐
- Days: 6 days
- Risk: Low (natural Tatoeba + validated AI)
- Quality: Excellent (curated best)
- Coverage: 100% grammar + vocab (quality focus)

WINNER: Smart Filtering! 🎯
```

---

## 🚨 Known Risks & Mitigation (SMART FILTERING APPROACH)

### Risk 1: Not enough polite sentences for 85% CORE target ✅ **MITIGATED**
- **Likelihood:** LOW (estimated 3,300-4,200 polite available, need ~3,000)
- **Impact:** LOW (can supplement with best casual sentences)
- **Mitigation:** Smart filtering prioritizes polite first, accepts 85-90% target range
- **Time Impact:** None (already in algorithm)
- **Status:** ✅ Risk eliminated by filtering approach

### Risk 2: Grammar pattern gaps in CORE tier
- **Likelihood:** MEDIUM (some patterns might be rare)
- **Impact:** MEDIUM (need AI generation)
- **Mitigation:** Phase 6 AI generation fills all gaps (budgeted ~300 sentences)
- **Time Impact:** Already budgeted 6-8 hours in Phase 6
- **Status:** ⚠️ Manageable with planned AI generation

### Risk 3: Vocabulary coverage gaps in CORE tier
- **Likelihood:** MEDIUM (~50-100 words might have <2 examples)
- **Impact:** MEDIUM (need AI generation)
- **Mitigation:** Phase 6 AI generation for missing words (budgeted ~150 sentences)
- **Time Impact:** Already budgeted in Phase 6
- **Status:** ⚠️ Manageable with planned AI generation

### Risk 4: Grammar pattern detection incomplete
- **Likelihood:** MEDIUM (new implementation, 25+ patterns)
- **Impact:** HIGH (affects filtering quality)
- **Mitigation:** Using 3 AI validations + ChatGPT's comprehensive list + testing on samples
- **Time Impact:** Already budgeted 6-9 hours
- **Status:** ⚠️ Critical but well-planned

### Risk 5: AI-generated sentences sound unnatural
- **Likelihood:** LOW (Claude AI with strict validation)
- **Impact:** MEDIUM (affects quality)
- **Mitigation:**
  - Strict prompts with N5 requirements
  - 100% validation against same filters as Tatoeba
  - 100% human review of ALL generated sentences
  - Can reject and regenerate if needed
- **Time Impact:** +2-3 hours if many regenerations needed
- **Status:** ⚠️ Low risk, strong mitigation

### Risk 6: Script adaptation errors (Phases 1-4)
- **Likelihood:** LOW (adapting proven scripts)
- **Impact:** MEDIUM (delays)
- **Mitigation:** Test on 100-sentence sample first, careful validation at each phase
- **Time Impact:** +2-3 hours buffer included
- **Status:** ⚠️ Low risk, can test incrementally

### Risk 7: Timeline slippage
- **Likelihood:** MEDIUM (optimistic 6-day estimate)
- **Impact:** LOW (quality over speed)
- **Mitigation:** Built in Day 7 contingency, can extend to 2 weeks if needed
- **Time Impact:** +1-5 days if needed
- **Status:** ⚠️ Acceptable - quality focus

### Overall Risk Assessment: ✅ **LOW TO MEDIUM**
- **Smart filtering eliminates** the biggest risk (conversion quality)
- All remaining risks are **manageable** with planned mitigations
- **Worst case:** Project takes 2 weeks instead of 6 days - still acceptable
- **Best case:** Finish in 6 days with excellent quality - likely!

---

## 📜 Licensing & Attribution

### Dataset License
```
Source Data: Tatoeba Corpus
License: CC BY 2.0 FR (Creative Commons Attribution 2.0 France)
URL: https://tatoeba.org/

Required Attribution:
Sentence data from Tatoeba
https://tatoeba.org/
License: CC BY 2.0 FR
```

### Vocabulary License
```
Source Data: JMdict/EDICT
License: CC BY-SA 3.0 (Creative Commons Attribution-ShareAlike 3.0)
URL: http://www.edrdg.org/jmdict/j_jmdict.html

Required Attribution:
Dictionary data from JMdict/EDICT
© Electronic Dictionary Research and Development Group
http://www.edrdg.org/jmdict/j_jmdict.html
License: CC BY-SA 3.0
```

### AI-Generated Sentences (Phase 6)
```
AI-generated sentences for coverage gaps:
License: Original work (can be released under CC BY 2.0 FR to match Tatoeba)
Source: Mark as "ai-generated" in dataset
Attribution: "Generated by Claude AI for N5 Progressive Curriculum"
Validation: Must pass same N5 filters as Tatoeba sentences
```

---

## 🔄 Version History

**v0.2** (2025-11-03) - **SMART FILTERING APPROACH** ⭐
- **STRATEGIC PIVOT:** Changed from "fix all 9,419" to "curate best 3,000-4,000"
- Added Phase 5: Smart Filtering (greedy algorithm for CORE selection)
- Added Phase 6: Targeted AI Generation (fill gaps only, ~300 sentences)
- Removed Phase 2b: Casual→Polite Conversion (no longer needed!)
- Updated phases 7-8 for CORE + EXTENDED tier structure
- Redefined success criteria: Quality over quantity
- Timeline: 6 days (vs 7-14 days with conversion approach)
- Risk reduction: Eliminated conversion quality risk
- Consensus from 4 AIs: User + Claude Code + ChatGPT + Claude AI
- Status: Ready for AI validation and user approval

**v0.1** (2025-11-03) - Initial Planning
- Created master documentation
- Copied proven methodology from vocabulary_implementation.md
- Defined 8 phases (including conversion approach)
- Set success criteria (85% formal, 25+ patterns, progressive IDs)
- Status: Superseded by v0.2

---

## 🎯 Summary: Why Smart Filtering Wins

**The Challenge:**
- 9,419 sentences from Tatoeba (v2 Enhanced)
- Only ~35-40% are polite (need 85% for JLPT N5 prep)
- Some grammar patterns might be underrepresented
- Some vocabulary words might lack examples

**Old Approach (Conversion):**
- Convert ~4,000 casual → polite sentences
- Risk: Unnatural Japanese, conversion errors
- Time: 7-14 days
- Result: Forced quality

**NEW Approach (Smart Filtering):** ⭐
- SELECT best 3,000-4,000 that ALREADY meet criteria
- FILL gaps with targeted AI generation (~300 sentences)
- Risk: Low (natural Tatoeba + validated AI)
- Time: 6 days
- Result: Curated excellence

**Benefits:**
1. ✅ **Authentic Japanese** (no conversions)
2. ✅ **Faster development** (6 days vs 2 weeks)
3. ✅ **Better pedagogy** (curated best vs forced all)
4. ✅ **Easier validation** (smaller core set)
5. ✅ **Flexible use** (CORE alone or + EXTENDED)

**Consensus:** All 4 AIs (User, Claude Code, ChatGPT, Claude AI) agree this is superior! 🎉

---

## 📞 Next Action

**IMMEDIATE:** Validate plan with AI friends (ChatGPT + Claude AI) ✅

**User will:**
1. Review this updated documentation
2. Share with ChatGPT for validation
3. Share with Claude AI for validation
4. Gather any final feedback or concerns
5. Give go-ahead to start Phase 0

**Then I will:**
1. Create Phase 0 diagnostic script
2. Run diagnostic on v2 Enhanced (9,419 sentences)
3. Generate diagnostic report
4. Review with user
5. Proceed with Phases 1-8

**Script to Create (Phase 0):**
```python
# vocab_sources/n5_vocab_final/scripts/phase0_diagnostic.py

Purpose:
1. Load v2 Enhanced JSON (9,419 sentences)
2. Check existing metadata fields
3. Analyze formality distribution (CRITICAL for filtering strategy)
4. Check sentence length distribution
5. Validate 100% N5 vocabulary match
6. Generate comprehensive diagnostic report

Output:
- Console report with key statistics
- JSON report for analysis
- Recommendations for smart filtering
- Estimated CORE tier size based on polite sentence availability
```

---

## 📊 Phase 0 Complete - Key Takeaways

**Phase 0 Completion Date:** 2025-11-03

### Critical Findings:

1. **Formality Reality Check:**
   - Only 20.4% formal sentences (1,924 out of 9,419)
   - This limits CORE tier to ~2,000-2,500 sentences (not 3,000-4,000)
   - EXTENDED tier will be massive: ~6,500-7,000 sentences

2. **Vocabulary Coverage:**
   - 79.1% naturally covered (638/807 words)
   - 169 words missing (20.9%) - need AI generation
   - 46 words with only 1 example (5.7%) - need more examples
   - **Total priority: 215 words need attention**

3. **Revised Strategy:**
   - CORE: ~2,000-2,200 natural Tatoeba + ~400-530 AI = **~2,400-2,730 total**
   - EXTENDED: ~6,500-7,000 natural Tatoeba
   - Complete dataset: 9,419 sentences (all analyzed, all usable)

4. **Generated Reports:**
   - `reports/phase0_diagnostic_report.json` (2.1 KB) - Overall stats
   - `reports/phase0_sample_sentences.json` (16 KB) - 50 samples
   - `reports/phase0_vocab_coverage.json` (1.2 MB) - All 807 words detailed
   - `reports/phase0_missing_low_coverage.json` (116 KB) - 215 priority words

### Next Steps:

✅ **Phase 0 Complete**
⏳ **Phase 1 Ready:** Difficulty Scoring (3-4 hours)

---

**Last Updated:** 2025-11-03 (v0.3 - Phase 0 Complete)
**Status:** ✅ **PHASE 0 COMPLETE** - Ready for Phase 1 (Difficulty Scoring)
**Progress:** Phase 0/8 complete
**Target Completion:** 2025-11-09 (6 days remaining, Phases 1-8)
**Single Source of Truth:** This document (N5_PROGRESSIVE_CURRICULUM_IMPLEMENTATION.md)

---

## 🙏 Acknowledgments

**This curriculum is a collaborative effort of 4 intelligences:**
1. **User (Pankaj)** - Vision, requirements, and quality standards
2. **Claude Code** - Implementation planning and documentation
3. **ChatGPT** - Grammar pattern expertise and filtering algorithm
4. **Claude AI** - Methodology validation and strategic advice

**Together, we're building the best N5 Japanese curriculum in the market!** 🇯🇵🎓
