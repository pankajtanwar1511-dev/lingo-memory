# N5 Vocabulary Implementation Status

**Feature:** JLPT N5 Vocabulary Completion
**Branch:** `vocab_N5_completion`
**Last Updated:** 2025-11-02
**Status:** ✅ Ultra-Pure Database Complete - Ready for Example Selection

---

## 📊 Current Status (2025-11-02)

### ⚠️ CRITICAL DECISION: Fresh Start with Ultra-Pure Examples

**Decision made 2025-11-02:** The existing 1,129 examples in `N5_vocab_dataset.json` are **NOT suitable** for the final product. We will create a **completely new example dataset** from the ultra-pure database.

**Reasons:**
- Old examples may not meet ultra-pure standards (100% N5 vocab + particles only)
- Inconsistent quality and formality distribution
- Missing critical metadata (formality, kana, spacing, vocab_hits, particles, grammar)
- Need fresh start with complete metadata from day 1

**Backup created:** `N5_vocab_dataset.json.backup_old_examples_2025-11-02`

### Vocabulary Dataset (Starting Fresh)
```
Total N5 Words:         662 / 662  (100% ✅)
Words with examples:    0 / 662    (0% - STARTING FRESH)
Target examples/word:   2-3 examples minimum
Source:                 Ultra-pure database (3,094 sentences) + AI generation
Total examples needed:  ~1,500-2,000 (to cover all 662 words with 2-3 each)
```

### Ultra-Pure N5 Database ✅ COMPLETE
```
Database: data_set/N5/n5_sentences_ultra_pure.db
Sentences: 3,094 (100% N5 vocabulary + particles only)
Source: Tatoeba Corpus (247,929 processed)
Validation: Strictest possible (100% N5 vocab, 0 non-vocab kanji)
Pass Rate: 1.2%
```

**Coverage in Ultra-Pure:**
- **498/662 words (75.2%)** have sentences available
- **164/662 words (24.8%)** need AI generation
- **350/387 existing words (90.4%)** found in database
- **148/275 needed words (53.8%)** have candidates

**Candidates Extracted:**
- Total candidates: 986 sentences
- For 148 words with matches
- Average: 3.6 candidates per word
- File: `data_set/N5/vocab_examples_candidates.json`

---

## 🎯 Next Steps

### Phase 5: Complete N5 Sentence Database (NEW PLAN - 2025-11-02)

**Updated Goals:**
- **Keep ALL 3,094 existing sentences** (100% N5 vocabulary verified ✅)
- **Add ~1,000 more polite sentences** via conversion + AI generation
- **Target Final Dataset: ~4,000-4,500 sentences**
  - Polite: ~2,000-2,500 (60-65%) - Exam preparation
  - Casual: ~2,000 (40-45%) - Real-world comprehension

**Rationale:**
- **Don't discard quality data** - All 3,094 passed strict N5 validation
- JLPT N5 exam requires 60-70% polite form proficiency
- Current database: 1,043 formal (33.7%) - **NEED +957-1,457 more**
- Casual sentences are valuable for listening comprehension
- Maximize dataset size while maintaining pedagogical quality

**Approach: Multi-Phase Enhancement**

### Phase 0: Difficulty Scoring ✅ **COMPLETE** (Nov 2, 2025)

**Final Approach:** Standard Deviation-Based Thresholds (v3)

1. **✅ Backup database** - Created backup_phase0_2025-11-02
2. **✅ Calculate difficulty scores (1-10 scale)** based on:
   - 20% Sentence length (shorter = easier)
   - 20% Kanji count (fewer kanji = easier)
   - 30% Grammar complexity (です/ます, conditionals, passive, causative)
   - 25% Vocabulary frequency (REAL - using fugashi tokenization + N5 word list)
   - 5% Features (questions, clauses, idioms)

3. **✅ Natural bell curve distribution achieved (v3):**
   ```
   Level 1-2:  53 (1.7%)    - Foundation
   Level 3-4:  898 (29.0%)  - Entry (peak starts)
   Level 5-6:  1,310 (42.3%) - Core N5 ⭐ Peak learning
   Level 7-8:  721 (23.3%)  - Challenge
   Level 9-10: 112 (3.6%)   - Advanced
   ```

**Methodology Evolution:**
- **v1:** Simple algorithm with fake vocab frequency → 6/10 rating
- **v2:** Improved with fugashi tokenization → forced percentile distribution (25/35/25/11/4)
- **v3:** Standard deviation-based thresholds → FINAL ⭐

**v3 Key Innovation:**
- Uses data-driven thresholds: mean ± standard deviations (like SAT, IQ tests, JLPT)
- Thresholds: mean=0.464, σ=0.097
  - Level 1: < mean-2.5σ (< 0.221)
  - Level 5-6: mean ± 0.5σ (0.416-0.513) ← Natural peak
  - Level 10: > mean+2.5σ (> 0.707)
- **Honest about true difficulty** (not artificially forced)
- **Natural bell curve** (42% peak at Level 5-6 is correct!)
- **Statistically sound** (standard test methodology)
- **Scalable** (adding sentences won't change existing levels)

**Scripts:**
- `data_set/N5/scripts/phase0_calculate_difficulty.py` (v1 - baseline)
- `data_set/N5/scripts/phase0_calculate_difficulty_v2.py` (v2 - improved scoring, forced distribution)
- `data_set/N5/scripts/phase0_calculate_difficulty_v3.py` (v3 - SD-based thresholds) ⭐ **FINAL**

**AI Consultation (Distribution Decision):**
- **Problem:** v2 forced percentiles vs natural 66% clustering at mid-level
- **Root cause:** Fixed thresholds (0.1, 0.2, 0.3...) didn't match actual data range (0.102-0.827)
- **Claude AI recommendation:** Use standard deviation-based thresholds ✅ **IMPLEMENTED**
- **ChatGPT recommendation:** Dual-field + sampling (rejected as too complex)
- **Consensus:** Natural clustering is correct - need data-driven thresholds, not forcing

**Sample Sentences:**
- Level 1: `うるさい！` (raw=0.102)
- Level 3: `いくらですか？` (raw=0.337)
- Level 5: `今日はとても暑い。` (raw=0.439)
- Level 7: `あなたが女の子だからよ。` (raw=0.514)
- Level 9: `夜のこんな時間に電話をかけるものではない。` (raw=0.701)

**Status:** ✅ Complete with natural bell curve - ready for Phase 1

### Phase 1: Tag & Classify (2-3 hours)
1. **Add metadata columns** to database:
   - `formality`, `is_question`, `question_type`, `confidence`
   - `japanese_spaced`, `kana`, `kana_spaced`
   - `vocab_hits`, `particles`, `grammar_patterns`
2. **Run enhanced classifier** on all 3,094 sentences
3. **Generate classification report**

### Phase 2: Tokenization & Kana (3-4 hours)
1. **Use fugashi** to tokenize all sentences
2. **Generate spaced versions** (japanese_spaced, kana_spaced)
3. **Extract vocab_hits** (N5 words present in each sentence)
4. **Detect particles** with grammatical roles
5. **Manual review** of 50 samples for accuracy

### Phase 3: Polite Sentence Expansion (6-8 hours)
1. **Current state:** 1,043 polite, 2,051 casual (KEEP ALL ✅)
2. **Target:** 2,000-2,500 polite total
3. **Strategy to add +957-1,457 polite sentences:**

   **Option A: Casual → Polite Conversion (~700 sentences)**
   - Select 700 convertible casual sentences
   - **Rule-based (70%):** Simple sentences (verb + ます, adj + です)
   - **AI-assisted (30%):** Complex sentences (Claude with validation)
   - **Keep original casual** + add polite version (both sentences retained!)
   - License: Mark conversions as `tatoeba-converted` (CC BY 2.0 FR)

   **Option B: AI Generation (~300-700 sentences)**
   - Generate NEW polite sentences for underrepresented vocab
   - Target: Grammar patterns, question forms, common situations
   - Strict validation: Must pass N5 vocabulary filter
   - License: Mark as `ai-generated` (original work)

4. **Validation:** ALL new sentences must pass strict validator
5. **Result:** 3,094 original + 1,000 new = **~4,094 total sentences**

### Phase 4: Vocabulary Example Assignment (NEW - FRESH START)
**Goal:** Assign examples from ultra-pure database to all 662 vocabulary words

1. **Extract all vocab word occurrences** from enhanced database
   - For each of 662 words, find ALL sentences containing that word
   - Rank by: **difficulty (prefer 1-4)**, formality (prefer polite), quality score

2. **Assign 2-3 best examples per word:**
   - Priority 1: **Difficulty 1-4** (beginner-friendly)
   - Priority 2: At least 1 polite sentence
   - Priority 3: At least 1 casual sentence (difficulty 1-3 only)
   - Priority 4: Mix of statements and questions
   - Priority 5: Different contexts (not repetitive)

3. **Casual sentence selection (controlled):**
   - **~700 casual examples total** (roughly 1 per word)
   - Select ONLY from difficulty 1-3 (easiest casual sentences)
   - All other casual sentences stay in database but NOT in vocabulary dataset

4. **Create new N5_vocab_dataset.json:**
   - 662 words with fresh, ultra-pure examples
   - ~1,500-2,000 total examples (2-3 per word)
   - ~60% polite (~1,000 examples), ~40% casual (~700 examples)
   - Complete metadata: formality, kana, spacing, vocab_hits, particles, grammar
   - **Average difficulty: 2-3** (beginner-focused)

**Time estimate:** 2-3 hours

### Phase 5: Basic Grammar Tagging (4-5 hours)
1. **Tag 10 core N5 grammar patterns:**
   - です/ます (polite)
   - だ (casual copula)
   - ている (progressive)
   - たい (desire)
   - ない (negative)
   - た (past)
   - て-form
   - Particles (は/が/を/に/で)
   - Questions (か/の)
   - Requests (ください)
2. **Use MeCab + pattern matching rules**
3. **Store in grammar_patterns array**

### Phase 6: Final Integration (2-3 hours)
1. **Export enhanced dataset** as JSON
2. **Update vocabulary dataset** with new examples
3. **Generate coverage report**
4. **Update documentation**

**Final Target:**
```
SENTENCE DATABASE (data_set/N5/n5_sentences_ultra_pure.db):
Total sentences: ~4,000-4,500 (ultra-pure N5)
├─ Original Tatoeba: 3,094 (100% verified ✅)
├─ Converted (casual→polite): +700
└─ AI-generated (polite): +300-700
│
├─ Polite: ~2,000-2,500 (60-65%) ✅ Exam-ready
├─ Casual: ~2,000 (40-45%) ✅ Comprehension
│
├─ Questions: ~1,000+ (polite + casual)
├─ With kana: 100%
├─ With spacing: 100%
├─ With grammar tags: 100%
├─ With vocab_hits: 100%
└─ With particles tagged: 100%

VOCABULARY DATASET (public/seed-data/N5_vocab_dataset.json):
Total words: 662 (100% coverage)
├─ Each word has: 2-3 ultra-pure examples
├─ Total examples: ~1,500-2,000 (selected from sentence database)
├─ Complete metadata: formality, kana, spacing, vocab_hits, particles, grammar
├─ Quality: 100% ultra-pure (from enhanced sentence database)
└─ Polite ratio: ~60-65% (matching sentence database distribution)

INTEGRATION:
✅ Sentence database = master source (4,000-4,500 sentences with full metadata)
✅ Vocabulary dataset = curated subset (~1,500-2,000 best examples for vocab learning)
✅ Each vocab word links to 2-3 best examples from sentence database
✅ Both datasets share same metadata structure and quality standards

Ready for: Quiz, flashcards, reading practice, exam prep, listening
Quality: ALL sentences pass strict N5 validation
Polite % for exam: 60-65% ✅ Perfect for N5 JLPT
```

**Timeline:** 2-3 weeks total

**Next Action:** Start Phase 1 tomorrow morning (backup + schema enhancement)

---

## 📁 Source of Truth

**Database Documentation:** `data_set/N5/README.md`

All technical details, validation criteria, statistics, and usage instructions are documented in the database README.

**Key Files:**
- `data_set/N5/n5_sentences_ultra_pure.db` - The database (3,094 sentences)
- `data_set/N5/vocab_examples_candidates.json` - 986 candidates for 148 words
- `data_set/N5/extract_vocab_examples.py` - Extraction script
- `public/seed-data/N5_vocab_dataset.json` - Main vocabulary dataset

---

## 📦 Complete Data Inventory (Codebase Exploration - 2025-11-02)

**Comprehensive exploration completed before Phase 1 implementation.**

### Core Databases & Datasets

**N5 Sentences Database**
```
File: data_set/N5/n5_sentences_ultra_pure.db
Size: 643 KB
Sentences: 3,094 ultra-pure (100% N5 vocab, 100% vocab kanji, 0 non-vocab kanji)
Source: Tatoeba Corpus (247,929 processed → 1.2% pass rate)
Schema: id, japanese, english, source, difficulty, vocab_coverage, non_vocab_kanji, pass, created_at
```

**N5 Vocabulary Dataset**
```
File: public/seed-data/N5_vocab_dataset.json
Size: 1.0 MB
Words: 662 total
  ├─ With examples: 502 (75.8%)
  ├─ With 2+ examples: 387 (58.5%)
  ├─ With 0 examples: 160 (24.2%)
  └─ Total example sentences: 1,129

Each entry contains:
  - word, kana, english, difficulty
  - examples: [{japanese, english, source, vocab_coverage, formality}]
  - stats: {jlpt_level, kanji_count}
```

**N5 Kanji Dataset**
```
File: public/seed-data/kanji_n5.json
Size: 93 KB
Kanji: 88 N5 kanji (complete set)
Each entry: character, readings, meanings, stroke_order, grade, jlpt, examples
Stroke data: Complete SVG paths from KanjiVG
Example words: 272 total associations
```

### Candidate & Verification Data

**Vocabulary Example Candidates**
```
File: data_set/N5/vocab_examples_candidates.json
Size: 637 KB
Candidates: 986 sentences for 148 words
Average: 3.6 candidates per word
Status: Ready for review and selection
```

**Production-Ready Examples**
```
File: data/production/categorized-examples/n5-production.json
Size: 637 KB
Examples: 1,166 verified production-ready
Source: AI verification (38 batches, 1,859 total verified)
Pass rate: 62.7% accepted, 24.4% rejected, 12.9% review needed
```

**AI Verification Data**
```
Location: data/verification/batches/
Files: 38 batch files (batch_001.json to batch_038.json)
Size: ~10 MB total
Format: Each batch contains ~50 examples with verification results
Criteria: vocab_present, kana_accurate, n5_grammar, recommendation
```

### Reference Lists & Source Data

**N5 Vocabulary Reference**
```
File: data_set/N5/reference/n5_vocab.txt
Words: 1,147 (includes inflections)
Format: word|kana|english
```

**N5 Vocabulary Kanji**
```
File: data_set/N5/reference/n5_vocab_kanji.txt
Kanji: 418 unique kanji from N5 vocabulary
Extracted from: N5 vocabulary words
```

**Tatoeba Corpus**
```
File: data/tatoeba/jpn_sentences_detailed.tsv
Size: 60 MB
Sentences: 247,929 Japanese sentences with translations
Format: sentence_id | lang | japanese | english
```

**KANJIDIC2 Database**
```
File: data/kanji/kanjidic2.xml
Size: 15.6 MB
Coverage: Complete Japanese kanji dictionary
Used for: Kanji meanings, readings, stroke counts
```

**KanjiVG Stroke Order**
```
Location: data/kanji/kanjivg/
Files: 11,661 SVG files
Size: 134 MB
Coverage: Complete stroke order diagrams for all kanji
```

### Processing Scripts

**Database Building**
```
data_set/N5/scripts/rebuild_from_tatoeba.py
  └─ Rebuilds ultra-pure database from Tatoeba corpus
  └─ Applies strict N5 filters (100% vocab, 0 non-vocab kanji)

data_set/N5/extract_vocab_examples.py
  └─ Extracts vocabulary example candidates from database
  └─ Ranks by quality scoring

data_set/N5/reference/extract_vocab_kanji.py
  └─ Extracts unique kanji from N5 vocabulary
```

**Kanji Processing Pipeline**
```
scripts/kanji/
├── 01_process_kanjidic2.py    → Parse KANJIDIC2 XML → kanjidic2_n5.json
├── 02_process_kanjivg.py      → Extract KanjiVG SVGs → kanjivg_n5.json
├── 03_link_vocabulary.py      → Link kanji to words → kanji_vocab_links.json
└── 04_merge_dataset.py        → Merge all 3 → kanji_n5.json (final)
```

### Frontend Services & Types

**TypeScript Services** (`src/services/`)
```
database.service.ts (541 lines)
  └─ IndexedDB operations, CRUD for vocab/kanji/sentences

seed-loader.service.ts (277 lines)
  └─ Load JSON seed data from public/seed-data/

batch-import.service.ts (448 lines)
  └─ Bulk import operations

sentence-matcher.service.ts (415 lines)
  └─ Find matching example sentences for vocabulary

quality-scorer.service.ts (484 lines)
  └─ Score example sentences by quality criteria
```

**Data Types** (`src/types/`)
```
vocabulary.ts (190 lines)
  └─ VocabularyEntry, Example, VocabularyStats interfaces

kanji.ts (197 lines)
  └─ KanjiEntry, StrokeOrder, Reading interfaces
```

**Embedded Data** (`src/data/`)
```
n5-vocabulary-full.ts (12,660 lines)
  └─ Full N5 vocabulary embedded in TypeScript for offline use
```

### Data Sources & Licensing

```
Source            License          Usage
─────────────────────────────────────────────────────────────────
Tatoeba Project   CC BY 2.0 FR     3,094 N5 sentences
KANJIDIC2         CC BY SA 3.0     Kanji data + meanings
KanjiVG           CC BY SA 3.0     Stroke order SVGs (11,661 files)
LingoMemory       Custom           AI verification + processing
```

### Current Gaps (Pre-Phase 1)

**Missing Metadata (to be added in Phase 1-5):**
- ❌ Formality tags (formal/casual)
- ❌ Question type classification (polite_question/casual_question)
- ❌ Kana versions (kana, kana_spaced)
- ❌ Spaced versions (japanese_spaced)
- ❌ Vocabulary hits (vocab_hits array)
- ❌ Particle tagging with grammatical roles
- ❌ Grammar pattern tags (10 core N5 patterns)

**Missing Content:**
- ❌ ~1,000 additional polite sentences (need conversion + AI generation)
- ❌ Examples for 160 words with 0 examples
- ❌ Second/third examples for 115 words with only 1 example

### Storage Breakdown

```
Total Project Size: ~138 MB

/data_set/               1.1 MB
  └─ N5/                 1.1 MB (ultra-pure DB + references)

/data/                   145 MB
  ├─ kanji/              134 MB (KANJIDIC2 15.6MB + KanjiVG SVGs 118MB)
  ├─ tatoeba/            60 MB  (jpn_sentences_detailed.tsv)
  ├─ verification/       10 MB  (38 batches + results)
  ├─ production/         1.2 MB (categorized examples)
  └─ archive/            < 1 MB (N4 foundation data)

/public/seed-data/       3.5 MB (N5 vocab + kanji JSON for frontend)
/scripts/                < 1 MB (Python processing scripts)
/src/                    ~2 MB  (TypeScript frontend code)
```

### Key Statistics Summary

**N5 Vocabulary Coverage:**
- Total words: 662 / 662 (100% ✅)
- Words with examples: 502 (75.8%)
- Words verified: 387 (58.5%)
- Words needing examples: 160 (24.2%)
- Total examples: 1,129
- Verified examples: 1,166 (62.7% pass rate from 1,859 verified)

**N5 Sentence Database:**
- Ultra-pure sentences: 3,094
- From corpus: 247,929 processed
- Pass rate: 1.2% (strictest standards)
- Quality: 100% N5 vocab, 0 non-vocab kanji
- Formality: 1,043 formal (33.7%), 2,051 casual (66.3%)
- Questions: 995 total (276 polite, 719 casual)

**N5 Kanji:**
- Total N5 kanji: 88
- With example words: 88 (100%)
- Example word associations: 272
- SVG stroke files: 11,661 (full library)

### Exploration Documentation

**Detailed inventory files created in `/tmp/`:**
- `lingomemory_quick_reference.txt` - Quick reference cheat sheet
- `lingomemory_data_inventory.md` - Complete file-by-file inventory
- `EXPLORATION_COMPLETE.md` - Executive summary
- `INDEX.md` - Navigation guide

**Status:** All data accounted for, ready for Phase 1 implementation.

---

## 🏆 Why Ultra-Pure?

**Decision:** Use 100% N5 vocabulary database for absolute beginner confidence.

**Pedagogical Rationale:**
- ✅ Every word guaranteed to be in N5 vocabulary
- ✅ Perfect for day-1 learners
- ✅ Zero frustration from unknown words
- ✅ Builds confidence through 100% comprehension

**Trade-off Accepted:**
- 127 words need AI generation (vs 77 in less strict approach)
- But: Perfect pedagogical purity for N5 app users

---

## 📌 Past Work Summary

### Phases 1-4: Complete ✅
- ✅ Phase 1: Master N5 list (662 words)
- ✅ Phase 2: Tatoeba enrichment (1,129 examples)
- ✅ Phase 3: AI validation (all examples verified)
- ✅ Phase 4A: Gap analysis (275 words identified)
- ✅ Phase 4B: Difficulty ratings merged
- ✅ **Phase 5: Ultra-Pure N5 Database Built** (NEW)

### Database Evolution
1. **Set_1:** 88 JLPT kanji, max 2 non-N5 kanji → 6,040 sentences
2. **Set_2:** 418 vocab kanji, 0 non-vocab kanji → 6,190 sentences
3. **Ultra-Pure:** 100% N5 vocabulary only → **3,094 sentences** ✅ FINAL

**Cleanup:**
- Deleted Set_1 and Set_2 intermediates
- Ultra-Pure is the single source of truth

---

## 🔗 Related Documentation

- **Database Details:** `data_set/N5/README.md` (complete technical docs)
- **Data Pipeline:** `docs/03_DATA_PIPELINE.md` (historical reference)
- **Quality Standards:** `docs/08_QUALITY_ASSURANCE.md` (validation criteria)

---

**Last Updated:** 2025-11-02
**Version:** 3.1 (Complete Data Inventory Added - Ready for Phase 1)
**Next Action:** Start Phase 1 (Backup + Tag & Classify)
