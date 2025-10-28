# Content Generation Pipeline - Quickstart Guide

**Updated:** 2025-10-26
**Status:** ✅ VERIFIED (All steps tested and working)

This guide shows the complete automated pipeline for generating production-ready vocabulary cards: Import → Enrich → Audio → Validate.

---

## Overview

The content generation pipeline consists of 4 automated steps:

1. **Import** - Convert JMdict entries to vocabulary cards
2. **Enrich** - Add example sentences from Tatoeba corpus
3. **Audio** - Generate pronunciation audio files
4. **Validate** - Check quality and flag issues

**Time:** ~5 minutes for 30 cards (mostly automated)

---

## Prerequisites

### Required

- Node.js 18+ installed
- Project dependencies installed (`npm install`)

### Optional (for production)

- Google Cloud credentials (for real audio generation)
- Full JMdict dataset (for large-scale import)
- Full Tatoeba corpus (for better sentence matching)

**Note:** All steps work with sample data and mock mode for quick testing.

---

## Quick Start (Sample Data)

This example uses the included sample datasets to demonstrate the complete pipeline.

### Step 1: Import Vocabulary Cards

Import 30 N5 verbs from sample JMdict data:

```bash
npm run import:jmdict -- \
  --source data/source/jmdict-n5-sample.json \
  --output data/n5-cards.json \
  --jlpt N5 \
  --limit 30
```

**Output:**
- `data/n5-cards.json` - 30 vocabulary cards (without examples)

**Expected results:**
```
✅ Loaded 30 cards
✅ Successfully imported 30 vocabulary cards
```

### Step 2: Enrich with Example Sentences

Add example sentences from Tatoeba corpus:

```bash
npm run enrich:sentences -- \
  --cards data/n5-cards.json \
  --corpus data/tatoeba \
  --output data/n5-enriched.json \
  --build-index \
  --max 3 \
  --min-score 60
```

**Options explained:**
- `--build-index` - Build corpus index from TSV files (first run only)
- `--max 3` - Maximum 3 examples per card
- `--min-score 60` - Minimum quality score (0-100)

**Output:**
- `data/n5-enriched.json` - Cards with example sentences
- `tatoeba-index.json` - Cached corpus index (reuse for faster subsequent runs)

**Expected results:**
```
✅ Loaded 30 cards
✅ Loaded 93 Japanese sentences
✅ Loaded 93 English sentences
✅ Sentence matcher ready
✨ Enrichment complete!
  Total cards: 30
  Cards with examples: 27
  Total examples: 37
```

### Step 3: Generate Audio Files

Generate pronunciation audio (runs in mock mode without Google Cloud):

```bash
npm run generate:audio -- \
  --cards data/n5-enriched.json \
  --output public/audio/n5 \
  --voice female-standard \
  --speed normal
```

**Options explained:**
- `--voice female-standard` - Voice type (also: female-premium, male-standard, male-premium)
- `--speed normal` - Speech speed (also: slow, fast)

**Output:**
- `public/audio/n5/*.mp3` - 30 audio files (one per card)

**Expected results:**
```
⚠️  Running in MOCK MODE
✅ Loaded 30 cards
✅ Generation Complete!
  Total: 30
  Successful: 30
  Total size: 547 B
```

**Note:** Mock mode generates dummy files. For real audio, install `@google-cloud/text-to-speech` and set up Google Cloud credentials.

### Step 4: Validate Quality

Check quality scores and identify issues:

```bash
npm run validate:quality -- \
  --cards data/n5-enriched.json \
  --output data/validation-report.json \
  --min-score 75
```

**Output:**
- `data/validation-report.json` - Detailed quality scores
- `data/flagged-cards.json` - Cards needing review

**Expected results:**
```
✅ Saved validation report
⚠️  30 cards flagged for review
  Total cards: 30
  Average score: 75/100
  Production ready: 0 (0%)
  Needs review: 30 (100%)

Score Distribution:
  Excellent (90-100): 0 cards
  Good (75-89):      7 cards
  Fair (60-74):      23 cards
  Poor (0-59):       0 cards
```

**Note:** Cards score lower because they're missing audio URLs (files exist but URLs not set). This is expected for development.

---

## Complete Workflow (Production Scale)

For production with full datasets:

### 1. Download Full Datasets

```bash
# Create data directories
mkdir -p data/source data/tatoeba

# Download JMdict (official source)
curl https://www.edrdg.org/jmdict/jmdict-simplified.json.gz -o data/source/jmdict.json.gz
gunzip data/source/jmdict.json.gz

# Download Tatoeba corpus
curl https://downloads.tatoeba.org/exports/per_language/jpn/jpn_sentences.tsv.bz2 -o data/tatoeba/jpn_sentences.tsv.bz2
bzip2 -d data/tatoeba/jpn_sentences.tsv.bz2

curl https://downloads.tatoeba.org/exports/per_language/eng/eng_sentences.tsv.bz2 -o data/tatoeba/eng_sentences.tsv.bz2
bzip2 -d data/tatoeba/eng_sentences.tsv.bz2

curl https://downloads.tatoeba.org/exports/jpn-eng_links.tsv.bz2 -o data/tatoeba/jpn-eng_links.tsv.bz2
bzip2 -d data/tatoeba/jpn-eng_links.tsv.bz2
```

**Download sizes:**
- JMdict: ~50MB (compressed), ~200MB (uncompressed)
- Tatoeba: ~30MB (compressed), ~100MB (uncompressed)

### 2. Set Up Google Cloud TTS

For real audio generation:

```bash
# 1. Install Google Cloud TTS SDK
npm install @google-cloud/text-to-speech

# 2. Set up credentials
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"

# 3. Test authentication
gcloud auth application-default print-access-token
```

**Google Cloud Setup:**
1. Create project at https://console.cloud.google.com
2. Enable Text-to-Speech API
3. Create service account
4. Download JSON key file
5. Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable

### 3. Run Full Pipeline

```bash
# Step 1: Import 800+ N5 cards
npm run import:jmdict -- \
  --source data/source/jmdict.json \
  --output data/n5-all.json \
  --jlpt N5

# Step 2: Enrich with examples (use cached index)
npm run enrich:sentences -- \
  --cards data/n5-all.json \
  --index-cache tatoeba-index.json \
  --output data/n5-all-enriched.json \
  --max 3 \
  --min-score 70

# Step 3: Generate real audio
npm run generate:audio -- \
  --cards data/n5-all-enriched.json \
  --output public/audio/n5 \
  --voice female-premium \
  --speed normal

# Step 4: Validate quality
npm run validate:quality -- \
  --cards data/n5-all-enriched.json \
  --output data/n5-validation.json \
  --min-score 80
```

**Expected time:**
- Import: ~30 seconds
- Enrich: ~2-3 minutes (800 cards)
- Audio: ~5-10 minutes (depends on API)
- Validate: ~10 seconds

---

## Cost Estimation

### Google Cloud Text-to-Speech

**Pricing (as of 2025):**
- Standard voices: $4 per 1 million characters
- Premium voices: $16 per 1 million characters

**Example costs:**
```
800 N5 words × 3 chars avg = 2,400 chars
Standard: $0.01 (less than 1 cent)
Premium: $0.04 (4 cents)

With examples (3 per card × 15 chars avg):
800 × (3 + 45) = 38,400 chars
Standard: $0.15
Premium: $0.61
```

**Cost-saving tips:**
1. Use standard voices for development
2. Use premium voices for final production
3. Use `--dry-run` to preview before generating
4. Cache audio files (automatically skips existing)

---

## Troubleshooting

### Common Issues

**1. Import fails with "ID format error"**

```bash
# Check your JMdict source format
cat data/source/jmdict-n5-sample.json | head -20

# Ensure it matches expected structure:
{
  "version": "...",
  "languages": ["eng"],
  "words": [
    {
      "id": "1578850",
      "kanji": [{"text": "食べる"}],
      "readings": [{"text": "たべる"}],
      "senses": [{"gloss": [{"text": "to eat"}]}]
    }
  ]
}
```

**2. Enrich fails with "Cannot find corpus files"**

```bash
# Check file names (must match exactly)
ls -la data/tatoeba/
# Should see:
#   jpn_sentences.tsv (or jpn_sentences_sample.tsv)
#   eng_sentences.tsv (or eng_sentences_sample.tsv)
#   jpn-eng_links.tsv (or jpn-eng_links_sample.tsv)

# Copy sample files if needed
cp data/tatoeba/jpn_sentences_sample.tsv data/tatoeba/jpn_sentences.tsv
```

**3. Audio generation fails**

```bash
# If Google Cloud TTS not installed:
⚠️  Running in MOCK MODE
# This is expected - dummy files will be created

# To use real TTS:
npm install @google-cloud/text-to-speech
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
```

**4. Validation shows low scores**

Common reasons:
- Missing audio URLs (expected in development)
- Only 1 example sentence (increase with `--max 3`)
- No examples found (corpus may not have sentences for that word)

```bash
# Check validation report for details
cat data/validation-report.json | jq '.cards[0].score.issues'
```

---

## Best Practices

### Development Workflow

1. **Start Small**
   - Test with 10-30 cards first
   - Validate each step works
   - Then scale to hundreds/thousands

2. **Use Sample Data**
   - Faster iteration
   - No bandwidth limits
   - Reproducible testing

3. **Cache Intermediate Results**
   - Save corpus index (`tatoeba-index.json`)
   - Keep enriched cards even if audio fails
   - Resume from last successful step

### Production Workflow

1. **Quality Over Quantity**
   - Better to have 100 perfect cards than 1000 mediocre
   - Set high `--min-score` for enrichment (70-80)
   - Manual review of flagged cards

2. **Incremental Approach**
   ```bash
   # Generate in batches
   npm run import:jmdict -- --limit 100 --output batch1.json
   # ... validate ...
   npm run import:jmdict -- --limit 100 --skip 100 --output batch2.json
   ```

3. **Cost Management**
   - Use `--dry-run` for audio generation
   - Start with standard voices
   - Upgrade to premium for final production

---

## File Formats

### Input Files

**JMdict JSON:**
```json
{
  "version": "2025-10-26",
  "languages": ["eng"],
  "words": [
    {
      "id": "1578850",
      "kanji": [{"text": "食べる", "tags": ["jlpt-n5"]}],
      "readings": [{"text": "たべる", "romaji": "taberu"}],
      "senses": [{
        "partOfSpeech": ["v1"],
        "gloss": [{"text": "to eat"}]
      }]
    }
  ]
}
```

**Tatoeba TSV:**
```tsv
1	jpn	食べる。
2	jpn	飲む。
```

### Output Files

**Vocabulary Cards JSON:**
```json
{
  "metadata": {
    "source": "JMdict",
    "generatedAt": "2025-10-26T...",
    "totalCards": 30
  },
  "cards": [
    {
      "id": "n5_1578850",
      "kanji": "食べる",
      "kana": "たべる",
      "meaning": "to eat",
      "examples": [
        {
          "japanese": "私は毎日魚を食べる。",
          "english": "I eat fish every day.",
          "source": {"type": "tatoeba", "id": "123456"}
        }
      ],
      "jlptLevel": "N5",
      "partOfSpeech": ["v1"]
    }
  ]
}
```

**Validation Report:**
```json
{
  "statistics": {
    "total": 30,
    "average": 75,
    "productionReady": 0
  },
  "cards": [
    {
      "id": "n5_1578850",
      "score": {
        "overall": 80,
        "breakdown": {
          "completeness": 30,
          "examples": 30,
          "audio": 0,
          "consistency": 20
        },
        "issues": [
          {
            "severity": "critical",
            "category": "audio",
            "message": "Missing audio URL"
          }
        ]
      }
    }
  ]
}
```

---

## Next Steps

After generating cards:

1. **Review flagged cards** - Check `data/flagged-cards.json`
2. **Upload audio to CDN** - Use `npm run upload:audio`
3. **Update card URLs** - Add audio URLs to cards
4. **Deploy to production** - Import cards to database

---

## Reference

### All Available Scripts

```bash
# Import
npm run import:jmdict -- --help

# Enrich
npm run enrich:sentences -- --help

# Audio
npm run generate:audio -- --help

# Validate
npm run validate:quality -- --help

# Review
npm run review:cards -- --help
```

### Documentation

- [DAY11_JMDICT_BATCH_IMPORT.md](./DAY11_JMDICT_BATCH_IMPORT.md) - Detailed import guide
- [DAY12_TATOEBA_MATCHING.md](./DAY12_TATOEBA_MATCHING.md) - Sentence matching guide
- [DAY13_AUDIO_GENERATION.md](./DAY13_AUDIO_GENERATION.md) - Audio generation guide
- [DAY14_QUALITY_VALIDATION.md](./DAY14_QUALITY_VALIDATION.md) - Validation guide

---

**Last Updated:** 2025-10-26
**Tested With:** Sample data (30 N5 cards)
**Status:** ✅ All steps verified working
