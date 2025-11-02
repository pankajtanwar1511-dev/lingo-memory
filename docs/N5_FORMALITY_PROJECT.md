# N5 Formality & Question Detection Project

**Status:** Analysis Complete - Ready for Implementation
**Date:** 2025-11-02
**Branch:** `vocab_N5_completion`

---

## 📊 Current Database Status

### Ultra-Pure N5 Sentence Database
- **Location:** `data_set/N5/n5_sentences_ultra_pure.db`
- **Total sentences:** 3,094
- **Quality:** 100% N5 vocabulary + particles only
- **Pass rate:** 1.2% from 247,929 Tatoeba sentences
- **Coverage:** 498/662 N5 words (75.2%)

### Classification Results (2025-11-02)

**Formality Distribution:**
```
Formal (です/ます):     1,043 sentences (33.7%)
Casual (plain form):    2,051 sentences (66.3%)
```

**Question Distribution:**
```
Total questions:         995 sentences (32.2%)
  ├─ Polite questions:   276 sentences (8.9%)  [ですか/ますか]
  └─ Casual questions:   719 sentences (23.2%) [か/の/かな]
Statements:            2,099 sentences (67.8%)
```

**Cross-Tabulation (Approximate):**
```
Formal statements:      ~767
Formal questions:       ~276
Casual statements:     ~1,332
Casual questions:       ~719
```

---

## ⚠️ The Problem

### Issue: Formality Imbalance
- **Current:** 33.7% formal / 66.3% casual
- **N5 Exam needs:** 60-70% formal / 30-40% casual

### Why This Matters
1. **JLPT N5** heavily tests です/ます forms (polite speech)
2. **Textbooks** (Genki, Minna no Nihongo) teach polite form first
3. **Beginners** need polite form to be socially safe
4. **Current ratio is inverted** - too much casual form for exam prep

### Root Cause
- Tatoeba corpus favors natural, conversational Japanese (casual)
- Short sentences (5-35 chars) are often casual fragments
- Polite form adds length (です/ます), making sentences longer

---

## ✅ Good News

### Questions Coverage is Excellent
- **32.2% questions** - Perfect for N5 exam practice
- **8.9% polite questions** - Good for listening/speaking
- **23.2% casual questions** - Good for comprehension
- Questions are critical for N5 exam success

### Database Quality is Perfect
- 100% N5 vocabulary purity maintained
- Every sentence is pedagogically appropriate
- Zero non-vocabulary kanji
- All sentences validated

---

## 🎯 The Solution: Three-Phase Plan

### Phase 1: Tag Database with Metadata ⏳ **NEXT TASK**

**Goal:** Add formality and question metadata to every sentence

**Actions:**
1. Backup database
2. Add columns to `n5_sentences` table:
   - `formality` TEXT ('formal' | 'casual')
   - `is_question` INTEGER (0 | 1)
   - `question_type` TEXT ('polite_question' | 'casual_question' | NULL)
   - `confidence` TEXT ('high' | 'medium' | 'low')
3. Run classifier on all 3,094 sentences
4. Update database with results

**Deliverables:**
- Enhanced database with formality tags
- Classification report (stats + samples)
- Updated README documenting new columns

**Time estimate:** 30 minutes

**Scripts ready:**
- `/tmp/classify_formality_and_questions.py` - Classifier with question detection

---

### Phase 2: AI Conversion of Simple Sentences 📋 **PLANNED**

**Goal:** Convert simple casual sentences to polite form

**Eligibility Criteria for Conversion:**
- Length ≤ 25 characters
- Single clause
- Ends with plain verb, い-adjective, or だ copula
- No sentence-final particles (よ, ね, ぞ) that change nuance
- High confidence classification

**Examples:**
```
Casual → Formal
今日は暑い。 → 今日は暑いです。
頭が痛い。 → 頭が痛いです。
鳥は飛ぶ。 → 鳥は飛びます。
私は男だ。 → 私は男です。
```

**Process:**
1. Extract 200-500 eligible casual sentences
2. Use AI (Claude) with strict prompt:
   ```
   Convert to polite form (です/ます) using only N5 grammar.
   Keep meaning identical. Output JSON: {"japanese":"..."}
   If conversion changes nuance, reply {"error":"not_convertible"}
   ```
3. Validate ALL conversions with strict validator
4. Accept only if: `pass=True` AND `formality='formal'` AND `confidence≥0.8`
5. Add to database with `source='converted'`, `converted_from=<id>`

**Target:** +500 formal sentences → ~50% formal coverage

**Time estimate:** 2-3 hours (includes validation)

**Already identified:** 1,983 eligible casual sentences ≤25 chars

---

### Phase 3: App-Level Weighting 🎮 **PLANNED**

**Goal:** Show formal sentences 2× more often to beginners

**Implementation:**
```python
# Weighted sampling: formal sentences appear twice as often
def sample_for_beginner(conn, n=20):
    pool = []
    for sentence in sentences:
        weight = 2 if sentence.formality == 'formal' else 1
        pool.extend([sentence] * weight)
    return random.sample(pool, n)
```

**Result:** Students see 67% formal / 33% casual (ideal ratio!)

**Benefits:**
- No data loss (keep all 3,094 sentences)
- Flexible by user level
- Easy to adjust weighting
- Students still get casual exposure

**Time estimate:** 1 day (app development work)

---

## 📈 Future Data Sources

### Priority 1: NHK Easy News ✅ **RECOMMENDED**
- **URL:** https://www3.nhk.or.jp/news/easy/
- **Format:** Simplified news (N5-N4 level)
- **Pros:**
  - High formal % (news = です/ます style)
  - Real, natural Japanese
  - Free, public content
  - ~1,000-2,000 sentences possible
- **Cons:**
  - May contain N4 vocabulary (filter needed)
  - Longer sentences (filter by length)
- **Next step:** Build scraper + N5 vocabulary filter

### Priority 2: AI Generation (Targeted)
- Generate specific grammar patterns lacking in corpus
- Example: て-form requests, negative questions, time expressions
- Must validate ALL generated content

### Priority 3: Graded Readers (License needed)
- Japanese Graded Readers Level 0-1
- Perfect N5 alignment
- Requires copyright clearance

---

## 📁 Key Files & Scripts

### Database
```
data_set/N5/
├── n5_sentences_ultra_pure.db          # Main database (3,094 sentences)
├── vocab_examples_candidates.json      # 986 candidates for 148 words
├── extract_vocab_examples.py           # Extract examples for vocabulary
├── README.md                            # Database documentation
├── reference/
│   ├── n5_vocab_kanji.txt              # 418 kanji from N5 vocabulary
│   └── n5_vocab.txt                    # N5 vocabulary list (1,147 words)
└── scripts/
    └── rebuild_from_tatoeba.py         # Rebuild database from Tatoeba
```

### Documentation
```
docs/
├── vocabulary_implementation.md        # Overall N5 vocabulary status
└── N5_FORMALITY_PROJECT.md            # This file (formality project plan)
```

### Analysis Scripts (in /tmp)
```
/tmp/
├── classify_formality_v2.py                   # Basic formality classifier
├── classify_formality_and_questions.py        # Enhanced: formality + questions
└── extract_casual_candidates.py               # Extract convertible sentences
```

---

## 🔄 Database Schema (Current)

### n5_sentences table
```sql
CREATE TABLE n5_sentences (
    id TEXT PRIMARY KEY,
    japanese TEXT NOT NULL,
    english TEXT,
    source TEXT DEFAULT 'tatoeba',
    difficulty INTEGER,           -- 2-8 scale
    vocab_coverage REAL,          -- 1.0 (always 100%)
    non_vocab_kanji INTEGER,      -- 0 (always zero)
    pass INTEGER,                 -- 1 (all passed)
    created_at REAL
);
```

### Planned Schema Additions (Phase 1)
```sql
-- New columns to add:
formality TEXT,                   -- 'formal' | 'casual'
is_question INTEGER,              -- 0 | 1
question_type TEXT,               -- 'polite_question' | 'casual_question' | NULL
confidence TEXT,                  -- 'high' | 'medium' | 'low'
converted_from TEXT,              -- ID of original sentence (if converted)
validation_meta TEXT              -- JSON with validation details
```

---

## 📊 Success Metrics

### After Phase 1 (Tagging)
- [x] All 3,094 sentences tagged with formality
- [x] All questions identified and typed
- [ ] Database updated with new columns
- [ ] Documentation updated

### After Phase 2 (Conversion)
- [ ] +500 formal sentences added
- [ ] Formal coverage: ~50% (target: 50-60%)
- [ ] All conversions validated (pass rate ≥95%)
- [ ] No quality degradation

### After Phase 3 (App Weighting)
- [ ] Students see 67% formal / 33% casual
- [ ] Question practice mode implemented
- [ ] User can filter by: formality, question type, difficulty
- [ ] Tracking: monitor user error rates on polite forms

---

## 🎓 Pedagogical Principles

### N5 Exam Alignment
1. **Polite form first** - です/ます is foundation
2. **Questions are critical** - 30%+ of exam items use questions
3. **100% comprehensible input** - All vocabulary must be known
4. **Social safety** - Beginners should default to polite form
5. **Gradual exposure** - Show casual for comprehension, not production

### Quality Standards (Never Compromise)
- ✅ 100% N5 vocabulary only
- ✅ 0 non-vocabulary kanji
- ✅ N5 grammar patterns only
- ✅ Appropriate length (5-35 characters)
- ✅ Natural Japanese (not synthetic-sounding)

---

## 🚀 Tomorrow's Tasks (Priority Order)

### Task 1: Backup Database ⏱️ 1 min
```bash
cp data_set/N5/n5_sentences_ultra_pure.db \
   data_set/N5/n5_sentences_ultra_pure.db.backup_2025-11-02
```

### Task 2: Add Database Columns ⏱️ 5 min
```sql
ALTER TABLE n5_sentences ADD COLUMN formality TEXT DEFAULT 'neutral';
ALTER TABLE n5_sentences ADD COLUMN is_question INTEGER DEFAULT 0;
ALTER TABLE n5_sentences ADD COLUMN question_type TEXT DEFAULT NULL;
ALTER TABLE n5_sentences ADD COLUMN confidence TEXT DEFAULT 'medium';
ALTER TABLE n5_sentences ADD COLUMN converted_from TEXT DEFAULT NULL;
ALTER TABLE n5_sentences ADD COLUMN validation_meta TEXT DEFAULT NULL;
```

### Task 3: Run Classifier & Update Database ⏱️ 15 min
- Use: `/tmp/classify_formality_and_questions.py`
- Process all 3,094 sentences
- Write results to database
- Generate classification report

### Task 4: Verify Results ⏱️ 10 min
- Manually review 20 formal examples
- Manually review 20 casual examples
- Manually review 20 questions
- Check for misclassifications

### Task 5: Extract Conversion Candidates ⏱️ 5 min
- Run: `/tmp/extract_casual_candidates.py`
- Filter: length ≤25, confidence=high, no particles
- Select top 200 for pilot conversion
- Review for convertibility

### Task 6: Update Documentation ⏱️ 10 min
- Update `data_set/N5/README.md` with new schema
- Document formality distribution
- Document question coverage
- Add usage examples

**Total time: ~45 minutes** to complete Phase 1

---

## 📞 Questions to Resolve

### Before Phase 2 (AI Conversion)
1. Which AI to use? Claude vs GPT-4 vs both?
2. Batch size for pilot? 50 or 200 sentences?
3. Who reviews conversions? Manual or automated validation?
4. What's acceptable pass rate? 95% or 100%?

### Before Phase 3 (App Integration)
1. Where in app code to implement weighting?
2. How to expose formality filter to users?
3. Should advanced users disable weighting?
4. Track metrics: which sentences cause errors?

---

## 🔗 Related Issues

### Vocabulary Examples (Separate Task)
- **Current:** 387/662 words have 2+ examples
- **Need:** 275 words need examples
- **Candidates available:** 986 sentences for 148 words
- **Next step:** Review candidates, prioritize formal examples
- **Tracked in:** `docs/vocabulary_implementation.md`

### Data Pipeline Documentation
- **Location:** `docs/03_DATA_PIPELINE.md` (historical reference)
- **Current source of truth:** `data_set/N5/README.md`

---

## 📝 Notes & Observations

### What Worked Well
1. ✅ Ultra-Pure filtering (100% N5 vocab) - Excellent quality
2. ✅ MeCab-based classification - Accurate and fast
3. ✅ Question detection - Comprehensive coverage
4. ✅ Conservative approach - Few false positives

### Challenges Discovered
1. ⚠️ Tatoeba corpus naturally casual (57% → 66% after better classification)
2. ⚠️ Short sentences tend to be casual fragments
3. ⚠️ Polite form is verbose (adds length → filtered out)
4. ⚠️ Some particles (よ, ね) prevent natural conversion

### Lessons Learned
1. 💡 Can't rely on single corpus - need multiple sources
2. 💡 App-level weighting better than data filtering (no loss)
3. 💡 AI conversion works BUT needs strict validation
4. 💡 Questions are plentiful - good for N5 exam prep
5. 💡 Conservative classification prevents false positives

---

## 🎯 Long-Term Vision

### N5 Complete Dataset (Goal)
```
Total sentences: 5,000-6,000
├─ Formal (60%): 3,000-3,600
│  ├─ Statements: 2,500
│  └─ Questions: 500-1,100
└─ Casual (40%): 2,000-2,400
   ├─ Statements: 1,500
   └─ Questions: 500-900

Vocabulary coverage: 662/662 words (100%)
Questions: 15-20% total
Source mix: 50% Tatoeba + 30% NHK Easy + 20% AI-generated
```

### Beyond N5
- **N4 Database:** Use same methodology with N4 vocabulary (1,500 words)
- **N3 Database:** Expand to 3,000 words
- **Difficulty progression:** Learners move through levels
- **Personalization:** AI adapts to user's weak points

---

## 📞 Contact & Context

**Last worked on:** 2025-11-02
**Last conversation summary:** See previous session summary (context continuation)
**Key decision-makers:** Product team + Pedagogy expert
**Timeline:** Phase 1 tomorrow, Phase 2 this week, Phase 3 next sprint

---

**Version:** 1.0
**Status:** ✅ Analysis Complete - Ready to Execute Phase 1
**Next action:** Run Task 1-6 tomorrow morning (45 min total)
**Blocked by:** None - all scripts ready, plan approved

---

## Quick Start Commands (Copy-Paste Ready)

```bash
# 1. Backup database
cd /home/pankaj/bumble/lingomemory
cp data_set/N5/n5_sentences_ultra_pure.db \
   data_set/N5/n5_sentences_ultra_pure.db.backup_2025-11-02

# 2. Add columns (run with sqlite3 or Python)
sqlite3 data_set/N5/n5_sentences_ultra_pure.db << 'EOF'
ALTER TABLE n5_sentences ADD COLUMN formality TEXT DEFAULT 'neutral';
ALTER TABLE n5_sentences ADD COLUMN is_question INTEGER DEFAULT 0;
ALTER TABLE n5_sentences ADD COLUMN question_type TEXT DEFAULT NULL;
ALTER TABLE n5_sentences ADD COLUMN confidence TEXT DEFAULT 'medium';
ALTER TABLE n5_sentences ADD COLUMN converted_from TEXT DEFAULT NULL;
ALTER TABLE n5_sentences ADD COLUMN validation_meta TEXT DEFAULT NULL;
EOF

# 3. Run classifier (script needs to be moved from /tmp first)
cp /tmp/classify_formality_and_questions.py data_set/N5/scripts/
python3 data_set/N5/scripts/classify_formality_and_questions.py

# 4. Extract conversion candidates
python3 /tmp/extract_casual_candidates.py > /tmp/conversion_candidates_200.txt

# 5. Verify results
sqlite3 data_set/N5/n5_sentences_ultra_pure.db \
  "SELECT formality, COUNT(*) FROM n5_sentences GROUP BY formality;"
```

---

**END OF DOCUMENT**
