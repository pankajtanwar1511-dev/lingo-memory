# Data Pipeline Guide

**Last Updated:** October 29, 2024
**Status:** N5 387/662 Production-Ready (58.5%), N4 Not Started

---

## Overview

LingoMemory uses a TypeScript-based data pipeline to fetch vocabulary from JMdict and Tatoeba, apply sophisticated filters, and verify with Claude AI.

### Current Pipeline

**Scripts Used:**
- `src/lib/jmdict-parser.ts` - Parse JMdict vocabulary
- `src/services/tatoeba-parser.service.ts` - Parse Tatoeba corpus
- `src/services/sentence-matcher.service.ts` - Match sentences with filters
- `scripts/split_for_ai_verification.py` - Create verification batches
- `scripts/prepare_verification_prompt.py` - Generate Claude prompts
- `scripts/analyze_verification_results.py` - Analyze results

**Process:**
```
Step 1: JMdict Parser
   ↓ (Extract N5 words with JLPT tags)
Step 2: Tatoeba Corpus Loading
   ↓ (Load 300K+ Japanese sentences + translations)
Step 3: Sentence Matching with Filters
   ↓ (Quality score 60+, length 5-25 chars, no complex grammar)
Step 4: AI Verification (38 batches)
   ↓ (Manual Claude verification - 39 batches completed)
Step 5: Categorization
   ↓ (401 production-ready, 261 pending)
```

### Filters Applied

**JMdict Filters:**
- JLPT level tags ("jlpt-n5", "n5", etc.)
- Must have kana readings
- Must have meanings
- Extract part of speech

**Tatoeba Filters:**
- **Min score:** 60/100
- **Length:** 5-25 characters
- **Grammar:** No passive/causative for N5/N4
- **Kanji limit:** ≤3 kanji for N5/N4
- **Natural Japanese:** No URLs, excessive punctuation
- **Translation:** Must have English translation

**Quality Scoring (100 points):**
- Ideal length (8-12 chars): Best score
- Difficult grammar: -20 points
- Too many kanji: -15 points
- No translation: -50 points
- Unnatural text: -15 points

**Result:** 387/662 N5 words production-ready (2+ perfect examples), 275 pending

### AI Verification Methodology

**Quality Criteria (All Must Pass):**
1. ✅ **Vocab Present = YES**: Target vocabulary appears in sentence as distinct word
2. ✅ **Kana Accurate = ACCURATE**: Kana reading matches perfectly (character-by-character)
3. ✅ **N5 Grammar = PASS**: Only N5 grammar patterns (no conditional, passive, causative, potential forms)
4. ✅ **Recommendation = ACCEPT**: Passes all checks

**Verification Process:**
- 38 batches created (~50 examples each)
- Manual review by Claude AI
- 1,859 examples verified total
- 1,165 examples passed all criteria (62.7%)
- 387 vocabulary cards have 2+ perfect examples (production-ready)

**Final Dataset:** `public/seed-data/N5_vocab_dataset.json`

---

## Quick Start (N5 Dataset)

### Step 1: Create Master List

```bash
python3 scripts/phase1_merge_n5_lists.py \
  --input public/seed-data/n5-comprehensive.json \
  --output data/n5-phase1/n5-master-list.json
```

**What it does:**
- Extracts N5 words from existing dataset
- Deduplicates by kanji+kana
- Generates romaji
- Assigns sequential IDs

**Output:** 662 N5 words

### Step 2: Enrich with Tatoeba

```bash
python3 scripts/phase2_enrich_from_tatoeba.py \
  --input data/n5-phase1/n5-master-list.json \
  --corpus data/tatoeba \
  --output data/n5-phase2/n5_with_examples_auto.json \
  --max-examples 2 \
  --max-length 40
```

**What it does:**
- Streams through 531MB Tatoeba corpus
- Matches sentences containing each N5 word
- Filters by length (≤40 chars)
- Includes full license metadata

**Output:** 647/662 words with examples (97.7% coverage)

### Step 3: Validate Quality

```bash
python3 scripts/phase4_validate_n5.py \
  --input data/n5-phase2/n5_with_examples_auto.json \
  --output-dir reports/n5-phase4
```

**Output:**
- `metrics.json` - Overall statistics
- `fail_list.json` - Issues found

---

## Current Status

### N5 Dataset 🚧

- **Total target words:** 662
- **Fully verified words:** 401 (60.6%)
- **Remaining words:** 261 (need AI-generated examples)
- **Sources:** JMdict & Tatoeba Project (CC BY-SA 4.0 & CC BY 2.0 FR)
- **Data fetched:** Custom scripts with filters
- **Verification:** Manual verification by Claude AI
- **Verification results:** Stored in `data/ai-verification-results/` (39 batches)
- **Status:** 401 words production-ready, 261 pending

### N4 Dataset ❌

- **Status:** Not yet processed
- **Plan:** Will process after N5 completion

---

## Detailed Pipeline Guide

### Phase 1: Master List Creation

**Purpose:** Create canonical list of vocabulary words

**Process:**
1. Load existing comprehensive dataset
2. Extract words by JLPT level
3. Deduplicate (kanji + kana combination)
4. Generate romaji with pykakasi
5. Assign sequential IDs (n5_vocab_0001, etc.)

**Command:**
```bash
python3 scripts/phase1_merge_n5_lists.py \
  --input public/seed-data/n5-comprehensive.json \
  --output data/n5-phase1/n5-master-list.json
```

**Output Format:**
```json
{
  "metadata": {
    "source": "n5-comprehensive.json",
    "totalCards": 662,
    "generatedAt": "2025-01-27T..."
  },
  "vocabulary": [
    {
      "id": "n5_vocab_0001",
      "kanji": "食べる",
      "kana": "たべる",
      "romaji": "taberu",
      "meaning": "to eat",
      "jlptLevel": "N5"
    }
  ]
}
```

**Time:** ~5 seconds

---

### Phase 2: Tatoeba Enrichment

**Purpose:** Add authentic example sentences from Tatoeba corpus

**Process:**
1. Load English translations (1.2M+ sentences)
2. Load sentence links (jpn↔eng mappings)
3. Stream Japanese sentences (531MB file)
4. For each sentence:
   - Check if it contains target word
   - Calculate quality score
   - Add to card if score ≥ threshold
5. Save enriched dataset

**Command:**
```bash
python3 scripts/phase2_enrich_from_tatoeba.py \
  --input data/n5-phase1/n5-master-list.json \
  --corpus data/tatoeba \
  --output data/n5-phase2/n5_with_examples_auto.json \
  --max-examples 2 \
  --max-length 40
```

**Options:**
- `--max-examples 2` - Max examples per card
- `--max-length 40` - Max sentence length (chars)
- `--min-score 60` - Minimum quality score (0-100)

**Matching Algorithm:**
1. **Word Detection:** Check if sentence contains exact kanji/kana
2. **Position Score:** Earlier in sentence = higher score
3. **Length Score:** Shorter = higher score (easier to learn)
4. **Frequency Score:** Word appears once = best
5. **Combined Score:** Weighted average of above

**Output:** Cards with example sentences

**Time:** ~45 seconds (streaming mode)

---

### Phase 3: AI Generation (Optional)

**Purpose:** Generate examples for words with no Tatoeba matches

**When needed:** If Phase 2 coverage < 95%

**Process:**
1. Identify cards with `needsGeneration: true`
2. For each card, call LLM with prompt:
   ```
   Generate 2 JLPT N5 example sentences for: 食べる (to eat)
   Requirements:
   - Use only N5 vocabulary
   - Natural Japanese
   - Include kana reading
   - Translate to English
   ```
3. Parse JSON response
4. Add examples with `needsReview: true` flag
5. Rate limit: 1 request/second

**Command:**
```bash
# Using Claude (recommended)
export ANTHROPIC_API_KEY="sk-ant-..."
python3 scripts/phase3_generate_missing.py \
  --input data/n5-phase2/n5_with_examples_auto.json \
  --output data/n5-phase3/n5_with_generated.json \
  --max-per-card 2 \
  --model claude

# Or using GPT-4
export OPENAI_API_KEY="sk-..."
python3 scripts/phase3_generate_missing.py \
  --input data/n5-phase2/n5_with_examples_auto.json \
  --output data/n5-phase3/n5_with_generated.json \
  --max-per-card 2 \
  --model gpt4
```

**Cost:**
- Claude: ~$0.50-1.00 for 188 words
- GPT-4: ~$1.00-2.00 for 188 words

**Time:** ~3-4 minutes (188 words × 1s rate limit)

**⚠️ Important:** All AI-generated examples MUST be human-reviewed (Phase 6)

---

### Phase 4: Validation

**Purpose:** Check data quality and identify issues

**Validation Checks:**
1. **Schema Validation:**
   - Required fields present
   - Correct data types
   - Valid enum values

2. **Example Quality:**
   - Sentence length reasonable
   - Word actually appears in sentence
   - Translation exists
   - License metadata present

3. **Consistency:**
   - Romaji matches kana
   - JLPT level consistent
   - No duplicate examples

**Command:**
```bash
python3 scripts/phase4_validate_n5.py \
  --input data/n5-phase2/n5_with_examples_auto.json \
  --output-dir reports/n5-phase4
```

**Output Files:**

**metrics.json:**
```json
{
  "total_cards": 662,
  "cards_with_examples": 647,
  "cards_without_examples": 15,
  "error_count": 0,
  "warning_count": 15,
  "examples_from_tatoeba": 1288,
  "pass": true
}
```

**fail_list.json:**
```json
{
  "errors": [],
  "warnings": [
    {
      "cardId": "n5_vocab_0036",
      "issue": "No examples found",
      "severity": "warning"
    }
  ]
}
```

**Time:** ~10 seconds

---

### Phase 5: Review Task Export

**Purpose:** Export AI-generated content for human review

**When needed:** After Phase 3 (AI generation)

**Process:**
1. Find all examples with `needsReview: true`
2. Export to CSV with columns:
   - `card_id`, `kanji`, `kana`, `meaning`
   - `japanese`, `kana_reading`, `english`
   - `source_type`, `generated_by`
   - `suggested_action` (empty)
   - `reviewer_comments` (empty)
   - `reviewed_by`, `review_date`
3. Create README with review guidelines

**Command:**
```bash
python3 scripts/phase5_export_review_tasks.py \
  --input data/n5-phase3/n5_with_generated.json \
  --output data/n5-review/review_tasks.csv
```

**Output:** CSV file with ~350+ review tasks

---

### Phase 6: Human Review

**Purpose:** Verify AI-generated examples meet quality standards

**Process:**
1. Open CSV in Excel/Google Sheets
2. For each example, check:
   - ✅ Word usage correctness
   - ✅ Natural wording
   - ✅ JLPT N5 level appropriate
   - ✅ Kana correctness
   - ✅ Translation accuracy
3. Fill in `suggested_action`: `approve`, `reject`, or `rewrite`
4. Add `reviewer_comments` if needed
5. Save as `review_tasks_completed.csv`

**Quality Target:** 80%+ approval rate

**Time:**
- Single reviewer: 8-10 hours
- Two reviewers: 4-5 hours each
- Three reviewers: 3-4 hours each

**See:** `docs/08_QUALITY_ASSURANCE.md` for full review guidelines

---

### Phase 7: Finalization

**Purpose:** Create production-ready dataset

**Process:**
1. Load original dataset + review results
2. Apply reviewer decisions:
   - **Approved:** Keep example
   - **Rejected:** Remove example
   - **Rewrite:** Replace with reviewer's version
3. Remove `needsReview` flags
4. Add version number
5. Generate final dataset

**Command:**
```bash
python3 scripts/phase6_import_reviewed.py \
  --input data/n5-phase3/n5_with_generated.json \
  --reviews data/n5-review/review_tasks_completed.csv \
  --output data/n5-v1.0.json
```

**Output:** Production-ready N5 dataset

**Final Validation:**
```bash
python3 scripts/phase4_validate_n5.py \
  --input data/n5-v1.0.json \
  --output-dir reports/n5-v1.0
```

---

## Data Sources

### Required Files

**Tatoeba Corpus:**
```bash
data/tatoeba/
├── jpn_sentences.tsv       # Japanese sentences (531MB)
├── eng_sentences.tsv       # English translations
└── jpn-eng_links.tsv       # Sentence mappings
```

**Download:**
```bash
cd data/tatoeba
wget https://downloads.tatoeba.org/exports/per_language/jpn/jpn_sentences.tsv.bz2
wget https://downloads.tatoeba.org/exports/per_language/eng/eng_sentences.tsv.bz2
wget https://downloads.tatoeba.org/exports/jpn-eng_links.tsv.bz2
bzip2 -d *.bz2
```

---

## AI Verification System

### Overview

For N5 dataset, we have:
- **1,871 example sentences** prepared for verification
- **38 batches** created
- **15 batches completed** (39%)
- **23 batches remaining** (61%)

### Batch Structure

```
data/ai-verification-batches/
├── batch_01_of_38.json        # Data (50 examples each)
├── PROMPT_BATCH_01.md         # Ready-to-use Claude prompt
├── batch_02_of_38.json
├── PROMPT_BATCH_02.md
└── ...

data/ai-verification-results/
├── RESULTS_BATCH_01.json      # Completed verifications
├── RESULTS_BATCH_02.json
└── ...
```

### Verification Workflow

1. **Open prompt:** `data/ai-verification-batches/PROMPT_BATCH_01.md`
2. **Copy to Claude:** Paste entire prompt
3. **Review results:** Claude returns JSON with verdicts
4. **Save output:** `data/ai-verification-results/RESULTS_BATCH_01.json`
5. **Repeat** for remaining 23 batches

**Time per batch:** ~5-10 minutes

---

## Troubleshooting

### Issue: Low coverage after Phase 2

**Problem:** Only 50-60% coverage from Tatoeba

**Solutions:**
1. Lower `--min-score` threshold (try 50 instead of 60)
2. Increase `--max-length` (try 50 instead of 40)
3. Increase `--max-examples` (try 3 instead of 2)

### Issue: Validation fails

**Problem:** Phase 4 shows errors

**Solution:**
```bash
# Check error details
jq '.errors' reports/n5-phase4/fail_list.json

# Fix issues in source file
# Re-run validation
```

### Issue: AI generation quality low

**Problem:** <50% approval rate in review

**Solutions:**
1. Try different LLM (Claude vs GPT-4)
2. Adjust prompts in `phase3_generate_missing.py`
3. Create examples manually for problematic words

---

## Best Practices

### 1. Start Small
```bash
# Test with 30 words first
head -30 data/n5-phase1/n5-master-list.json > data/test-30.json
# Run pipeline on test-30.json
```

### 2. Backup Before Each Phase
```bash
cp data/n5-phase2/n5_with_examples_auto.json \
   data/n5-phase2/n5_with_examples_auto.json.backup
```

### 3. Version Your Datasets
```bash
# Add version to final output
jq '. + {version: "1.0.0"}' data/n5-v1.0.json > /tmp/versioned.json
mv /tmp/versioned.json data/n5-v1.0.json
```

### 4. Track Progress
Keep a log file:
```bash
date >> pipeline.log
echo "Phase 2 complete: 97.7% coverage" >> pipeline.log
```

---

## Next Steps

After completing the pipeline:

1. **Generate Audio** - See `docs/05_AUDIO_PRODUCTION.md`
2. **Deploy to App** - Copy to `public/seed-data/`
3. **Update Schema** - Ensure app expects new format
4. **Test Thoroughly** - Load in dev environment
5. **Repeat for N4/N3/N2/N1** - Use same pipeline

---

**For more details:**
- **Schema:** `04_DATA_SCHEMA.md`
- **Quality Guidelines:** `08_QUALITY_ASSURANCE.md`
- **Audio Production:** `05_AUDIO_PRODUCTION.md`
