# N5 Dataset Creation - Complete Pipeline Guide

This document provides the complete step-by-step execution guide for creating the N5 v1.0 dataset using the phase-by-phase approach.

**Status:** Ready to execute
**Estimated Total Time:** 2-3 hours + 8-10 hours human review
**Estimated Cost:** $1-2 (API calls for LLM generation)

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Master List Creation](#phase-1-master-list-creation)
4. [Phase 2: Tatoeba Enrichment](#phase-2-tatoeba-enrichment)
5. [Phase 3: LLM Fallback Generation](#phase-3-llm-fallback-generation)
6. [Phase 4: Validation](#phase-4-validation)
7. [Phase 5: Review Task Export](#phase-5-review-task-export)
8. [Phase 6: Human Review](#phase-6-human-review)
9. [Phase 7: Finalization](#phase-7-finalization)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### The Pipeline

```
Phase 1: Extract N5 words
  ↓ (data/n5-phase1/n5-master-list.json)
Phase 2: Add Tatoeba examples
  ↓ (data/n5-phase2/n5_with_examples_auto.json)
Phase 3: Generate missing examples (LLM)
  ↓ (data/n5-phase3/n5_with_generated.json)
Phase 4: Validate dataset
  ↓ (reports/n5-phase4/metrics.json)
Phase 5: Export review tasks
  ↓ (data/n5-review/review_tasks.csv)
Phase 6: Human review (8-10 hours)
  ↓ (data/n5-review/review_tasks_completed.csv)
Phase 7: Final assembly
  ↓ (data/n5-v1.0.json) ✅ PRODUCTION DATASET
```

### What Gets Created

- **Phase 1**: Canonical N5 master list (662 words, minimal fields)
- **Phase 2**: N5 + Tatoeba examples (~450-500 words with examples)
- **Phase 3**: N5 + All examples (~650+ words with examples)
- **Phase 4**: Validation reports (metrics + failure list)
- **Phase 5**: Review tasks CSV (~350+ AI examples to review)
- **Phase 6**: Reviewed and approved examples
- **Phase 7**: Final production-ready N5 v1.0 dataset

---

## Prerequisites

### 1. Install Python Dependencies

```bash
# Morphological analysis
pip install fugashi unidic-lite

# Romanization
pip install pykakasi

# LLM provider (choose one)
pip install anthropic  # For Claude (recommended)
pip install openai     # For GPT-4 (alternative)
```

### 2. Environment Variables

```bash
# For LLM generation (Phase 3)
export ANTHROPIC_API_KEY="sk-ant-..."  # If using Claude
# OR
export OPENAI_API_KEY="sk-..."         # If using GPT-4
```

### 3. Required Files

Ensure these files exist:

- ✅ `public/seed-data/n5-comprehensive.json` (existing N5 dataset)
- ✅ `data/tatoeba/jpn_sentences.tsv` (Japanese sentences)
- ✅ `data/tatoeba/eng_translations.tsv` (English translations)
- ✅ `data/tatoeba/links.csv` (Sentence links)

### 4. Create Output Directories

```bash
mkdir -p data/n5-phase1
mkdir -p data/n5-phase2
mkdir -p data/n5-phase3
mkdir -p data/n5-review
mkdir -p reports/n5-phase4
```

---

## Phase 1: Master List Creation

### What It Does

- Extracts N5 words from existing comprehensive dataset
- Deduplicates by kanji+kana combination
- Generates romaji
- Assigns sequential IDs (n5_vocab_0001, n5_vocab_0002, ...)

### Command

```bash
python3 scripts/phase1_merge_n5_lists.py \
  --input public/seed-data/n5-comprehensive.json \
  --output data/n5-phase1/n5-master-list.json
```

### Expected Output

```
🚀 Phase 1: Creating Canonical N5 Master List
============================================================

📥 Loading existing N5 file: public/seed-data/n5-comprehensive.json
   Found 662 cards

🔄 Merging 662 cards...

💾 Saved master list: data/n5-phase1/n5-master-list.json

============================================================
📊 MERGE STATISTICS
============================================================
Extracted from existing:  662
Duplicates skipped:       0
Skipped (no kana):        0
Total merged:             662
============================================================

✅ Phase 1 Complete!
   Master list: data/n5-phase1/n5-master-list.json
   Total N5 words: 662
```

### Verify

```bash
# Check output file size
ls -lh data/n5-phase1/n5-master-list.json

# Check word count
jq '.vocabulary | length' data/n5-phase1/n5-master-list.json
# Should output: 662
```

---

## Phase 2: Tatoeba Enrichment

### What It Does

- Streams through 531MB Tatoeba corpus
- Matches sentences containing each N5 word
- Filters by length (≤40 chars)
- Max 2 examples per word
- Includes full license metadata

### Command

```bash
python3 scripts/phase2_enrich_from_tatoeba.py \
  --input data/n5-phase1/n5-master-list.json \
  --corpus data/tatoeba \
  --output data/n5-phase2/n5_with_examples_auto.json \
  --max-examples 2 \
  --max-length 40
```

### Expected Output

```
🚀 Phase 2: Enriching N5 Master List with Tatoeba Examples
============================================================

📥 Loading N5 master list...
   Loaded 662 N5 words

📥 Step 1/4: Loading English translations (streaming)...
   Loaded 1,234,567 English translations

📥 Step 2/4: Loading sentence links (streaming)...
   Loaded 987,654 jpn->eng links

📥 Step 3/4: Streaming Japanese sentences and matching...
   Built lookup table for 662 words
   Checked 50,000 sentences, found 234 matches...
   Checked 100,000 sentences, found 567 matches...
   ...
   ✅ Checked 300,000 sentences, found 948 matches

📥 Step 4/4: Saving enriched dataset...
   ✅ Saved: data/n5-phase2/n5_with_examples_auto.json

============================================================
📊 ENRICHMENT STATISTICS
============================================================
Translations loaded:      1,234,567
Links loaded:             987,654
Cards with examples:      474
Cards without examples:   188
Total examples added:     948
Example coverage:         71.6%
============================================================

⏱️  Total time: 45.3s

✅ Phase 2 Complete!
```

### Verify

```bash
# Check coverage
jq '.metadata.coverage' data/n5-phase2/n5_with_examples_auto.json

# Count words without examples (will be generated in Phase 3)
jq '[.vocabulary[] | select(.needsGeneration == true)] | length' \
  data/n5-phase2/n5_with_examples_auto.json
# Should output: ~188
```

---

## Phase 3: LLM Fallback Generation

### What It Does

- Generates examples for words with no Tatoeba matches (~188 words)
- Uses Claude or GPT-4 with N5-specific prompts
- Marks all generated examples with `needsReview: true`
- Rate limited to 1 request/second
- Estimated time: ~3-4 minutes

### Command

```bash
# Using Claude (recommended)
python3 scripts/phase3_generate_missing.py \
  --input data/n5-phase2/n5_with_examples_auto.json \
  --output data/n5-phase3/n5_with_generated.json \
  --max-per-card 2 \
  --model claude

# OR using GPT-4
python3 scripts/phase3_generate_missing.py \
  --input data/n5-phase2/n5_with_examples_auto.json \
  --output data/n5-phase3/n5_with_generated.json \
  --max-per-card 2 \
  --model gpt4
```

### Expected Output

```
🚀 Phase 3: Generating Missing Examples with LLM
============================================================

📥 Loading enriched dataset...
   Loaded 662 words

🤖 Generating missing examples with LLM...
   Found 188 words needing examples
   Estimated API calls: 188
   Rate limit: 1 request/second
   Estimated time: 188 seconds (~3 min)

   [1/662] Generating for: 毎朝
   [50/662] Generating for: 暑い
   [100/662] Generating for: 問題
   ...

💾 Saving dataset with generated examples...
   ✅ Saved: data/n5-phase3/n5_with_generated.json

============================================================
📊 GENERATION STATISTICS
============================================================
Words needing examples:   188
API calls made:           188
Examples generated:       376
Errors:                   0
============================================================

✅ Phase 3 Complete!
   Dataset with generated examples: data/n5-phase3/n5_with_generated.json
   Total examples generated: 376
```

### Cost Estimate

**Claude (Recommended)**:
- Model: claude-3-5-sonnet-20241022
- Cost: ~$0.50-1.00 for 188 API calls
- Quality: Excellent

**GPT-4 (Alternative)**:
- Model: gpt-4-turbo-preview
- Cost: ~$1.00-2.00 for 188 API calls
- Quality: Excellent

### Verify

```bash
# Count generated examples
jq '[.vocabulary[].examples[] | select(.needsReview == true)] | length' \
  data/n5-phase3/n5_with_generated.json
# Should output: ~376

# Check overall coverage
jq '[.vocabulary[] | select(.examples | length > 0)] | length' \
  data/n5-phase3/n5_with_generated.json
# Should output: ~662 (100% coverage)
```

---

## Phase 4: Validation

### What It Does

- Validates all 662 cards against schema
- Checks example quality (length, word matching)
- Verifies license metadata
- Generates metrics and failure reports

### Command

```bash
python3 scripts/phase4_validate_n5.py \
  --input data/n5-phase3/n5_with_generated.json \
  --output-dir reports/n5-phase4
```

### Expected Output

```
🚀 Phase 4: Validating N5 Dataset
============================================================

📥 Loading N5 dataset...

🔍 Validating 662 N5 cards...
   Validated 100/662 cards...
   Validated 200/662 cards...
   ...
   ✅ Validated 662 cards

============================================================
📊 VALIDATION SUMMARY
============================================================
Total cards:              662
Cards with examples:      662
Cards without examples:   0

Total errors:             0
Total warnings:           345

Example Sources:
  - Tatoeba:              948
  - Generated (AI):       376
  - Custom:               0
  - JMdict:               0

Examples needing review:  376

✅ VALIDATION PASSED (0 errors)
============================================================

💾 Saved metrics: reports/n5-phase4/metrics.json
💾 Saved failure list: reports/n5-phase4/fail_list.json

✅ Phase 4 Complete!
```

### Verify

```bash
# Check validation passed
jq '.pass' reports/n5-phase4/metrics.json
# Should output: true

# Check error count
jq '.error_count' reports/n5-phase4/metrics.json
# Should output: 0
```

---

## Phase 5: Review Task Export

### What It Does

- Extracts all examples with `needsReview: true`
- Exports to CSV for human reviewers
- Creates README with review instructions

### Command

```bash
python3 scripts/phase5_export_review_tasks.py \
  --input data/n5-phase3/n5_with_generated.json \
  --output data/n5-review/review_tasks.csv
```

### Expected Output

```
🚀 Phase 5: Exporting Review Tasks
============================================================

📥 Loading dataset...
   Loaded 662 cards

📋 Extracting review tasks...
   Found 376 examples needing review

💾 Exporting to CSV: data/n5-review/review_tasks.csv
   ✅ Exported 376 review tasks
   ✅ Created README: data/n5-review/README.md

============================================================
📊 REVIEW TASK STATISTICS
============================================================
Cards checked:            662
Examples checked:         1,324
Examples needing review:  376
Examples already approved:948

Estimated review time:    3.1 hours (at 30s per example)
============================================================

✅ Phase 5 Complete!
   Review tasks: data/n5-review/review_tasks.csv
   Instructions: data/n5-review/README.md
```

### Verify

```bash
# Count review tasks
wc -l data/n5-review/review_tasks.csv
# Should output: ~378 (376 tasks + 2 header rows)
```

---

## Phase 6: Human Review

### What It Does

Human reviewers validate AI-generated examples using the 5-point quality checklist.

### Steps

1. **Open CSV in Excel or Google Sheets**:
   ```bash
   open data/n5-review/review_tasks.csv
   ```

2. **Review Each Example**:
   - Check word usage correctness
   - Check natural wording
   - Check JLPT N5 level appropriateness
   - Check kana correctness
   - Check translation accuracy

3. **Fill In Columns**:
   - `suggested_action`: `approve`, `reject`, or `rewrite`
   - `reviewer_comments`: Optional feedback
   - `reviewed_by`: Your name
   - `review_date`: YYYY-MM-DD

4. **Quality Target**: 80%+ approval rate

5. **Save Completed CSV**:
   ```bash
   # Save as:
   data/n5-review/review_tasks_completed.csv
   ```

### Estimated Time

- **Single reviewer**: 8-10 hours
- **Two reviewers**: 4-5 hours each (parallel review)
- **Three reviewers**: 3-4 hours each (parallel review)

### Review Guidelines

See `docs/REVIEW-GUIDELINES.md` for complete 5-point checklist.

---

## Phase 7: Finalization

### What It Does

- Merges approved examples back into dataset
- Discards rejected examples
- Applies rewrites from reviewer comments
- Generates final N5 v1.0 production dataset

### Command

```bash
# Import script (to be created)
python3 scripts/phase6_import_reviewed.py \
  --input data/n5-phase3/n5_with_generated.json \
  --reviews data/n5-review/review_tasks_completed.csv \
  --output data/n5-v1.0.json
```

### Expected Output

```
🚀 Phase 6: Importing Reviewed Examples
============================================================

📥 Loading dataset...
   Loaded 662 cards

📥 Loading review results...
   Loaded 376 review tasks

🔄 Processing reviews...
   Approved:     310 (82.4%)
   Rejected:     50 (13.3%)
   Rewritten:    16 (4.3%)

💾 Saving final dataset...
   ✅ Saved: data/n5-v1.0.json

============================================================
📊 FINAL DATASET STATISTICS
============================================================
Total cards:              662
Cards with examples:      662
Total examples:           1,274
  - Tatoeba:              948
  - AI-generated:         310
  - Rewritten:            16

Coverage:                 100%
Approval rate:            82.4%
============================================================

✅ N5 v1.0 Dataset Complete! 🎉
```

### Final Verification

```bash
# Validate final dataset
python3 scripts/phase4_validate_n5.py \
  --input data/n5-v1.0.json \
  --output-dir reports/n5-v1.0

# Check final metrics
jq '.metadata' data/n5-v1.0.json
```

---

## Troubleshooting

### Issue: Tatoeba files not found

**Error**: `File not found: data/tatoeba/jpn_sentences.tsv`

**Solution**:
```bash
# Download Tatoeba corpus
cd data
mkdir -p tatoeba
cd tatoeba

# Download files (may take several minutes)
wget https://downloads.tatoeba.org/exports/jpn_sentences.tsv.bz2
wget https://downloads.tatoeba.org/exports/eng_translations.tsv.bz2
wget https://downloads.tatoeba.org/exports/links.csv.bz2

# Extract
bzip2 -d jpn_sentences.tsv.bz2
bzip2 -d eng_translations.tsv.bz2
bzip2 -d links.csv.bz2
```

---

### Issue: LLM API key not set

**Error**: `anthropic.AuthenticationError: No API key provided`

**Solution**:
```bash
# Set API key
export ANTHROPIC_API_KEY="sk-ant-..."

# Verify
echo $ANTHROPIC_API_KEY
```

---

### Issue: Low approval rate (<50%)

**Problem**: AI-generated examples are low quality

**Solutions**:

1. **Regenerate with different model**:
   ```bash
   # Try GPT-4 instead of Claude
   python3 scripts/phase3_generate_missing.py \
     --input data/n5-phase2/n5_with_examples_auto.json \
     --output data/n5-phase3/n5_with_generated_gpt4.json \
     --model gpt4
   ```

2. **Adjust prompts**: Edit `scripts/phase3_generate_missing.py` to refine prompts

3. **Manual creation**: Create examples manually for problematic words

---

### Issue: Validation errors

**Error**: `❌ VALIDATION FAILED (15 errors)`

**Solution**:
```bash
# Review failure list
jq '.errors' reports/n5-phase4/fail_list.json

# Fix issues in source file
# Re-run validation
python3 scripts/phase4_validate_n5.py \
  --input data/n5-phase3/n5_with_generated.json \
  --output-dir reports/n5-phase4
```

---

## Next Steps After N5 v1.0

1. **Audio Generation**: Generate TTS audio for all examples
2. **N4 Dataset**: Repeat pipeline for N4 words
3. **App Integration**: Update app to use new N5 v1.0 dataset
4. **User Testing**: Beta test with real users
5. **Feedback Loop**: Collect feedback and improve

---

## Quick Reference

### All Commands (Copy-Paste)

```bash
# Phase 1: Master List
python3 scripts/phase1_merge_n5_lists.py \
  --input public/seed-data/n5-comprehensive.json \
  --output data/n5-phase1/n5-master-list.json

# Phase 2: Tatoeba Enrichment
python3 scripts/phase2_enrich_from_tatoeba.py \
  --input data/n5-phase1/n5-master-list.json \
  --corpus data/tatoeba \
  --output data/n5-phase2/n5_with_examples_auto.json \
  --max-examples 2 \
  --max-length 40

# Phase 3: LLM Generation
export ANTHROPIC_API_KEY="sk-ant-..."
python3 scripts/phase3_generate_missing.py \
  --input data/n5-phase2/n5_with_examples_auto.json \
  --output data/n5-phase3/n5_with_generated.json \
  --max-per-card 2 \
  --model claude

# Phase 4: Validation
python3 scripts/phase4_validate_n5.py \
  --input data/n5-phase3/n5_with_generated.json \
  --output-dir reports/n5-phase4

# Phase 5: Review Export
python3 scripts/phase5_export_review_tasks.py \
  --input data/n5-phase3/n5_with_generated.json \
  --output data/n5-review/review_tasks.csv

# Phase 6: Human review (manual step)
# Open data/n5-review/review_tasks.csv
# Fill in suggested_action, reviewer_comments, etc.
# Save as data/n5-review/review_tasks_completed.csv

# Phase 7: Finalization (script to be created)
python3 scripts/phase6_import_reviewed.py \
  --input data/n5-phase3/n5_with_generated.json \
  --reviews data/n5-review/review_tasks_completed.csv \
  --output data/n5-v1.0.json
```

---

**Last Updated:** January 2025
**Status:** Ready to Execute
**Maintainer:** See repository for contacts
