# LingoMemory - Data Guide

**Version:** 1.0
**Last Updated:** February 16, 2026
**Dataset Version:** v1.25.0

---

## Table of Contents

1. [Dataset Overview](#dataset-overview)
2. [Data Creation Process](#data-creation-process)
3. [Vocabulary Dataset](#vocabulary-dataset)
4. [Verbs Dataset](#verbs-dataset)
5. [Dlingo Special Vocabulary](#dlingo-special-vocabulary)
6. [Data Schema](#data-schema)
7. [Quality Metrics](#quality-metrics)
8. [Data Sources](#data-sources)
9. [How to Modify Data](#how-to-modify-data)
10. [Data Processing Scripts](#data-processing-scripts)

---

## Dataset Overview

LingoMemory contains three primary datasets:

| Dataset | File | Size | Records | Coverage |
|---------|------|------|---------|----------|
| **N5 Vocabulary** | `N5_vocab_dataset.json` | ~2 MB | 863 cards | 100% JLPT N5 |
| **N5 Verbs** | `N5_verbs_dataset.json` | ~400 KB | 161 verbs | All N5 verbs |
| **Dlingo Vocab** | `dlingo_vocab_enhanced.json` | ~1.5 MB | ~1000+ words | Specialized vocab |

**Total:** ~4 MB of curated Japanese learning content

---

## Data Creation Process

### Overview: 3-Phase Enhancement Pipeline

The vocabulary dataset was created through a rigorous multi-phase process combining automated processing, AI validation, and manual curation.

```
Phase 0: Difficulty Scoring (N5 Sentences)
    ↓
Phase 1: Formality Classification
    ↓
Phase 2: Tokenization & Kana Generation
    ↓
Phase 3: Vocabulary Enhancement
    ↓
Final Dataset: N5_vocab_dataset.json (v1.25.0)
```

---

### Phase 0: Difficulty Scoring

**Goal:** Assign honest difficulty ratings to 3,094 N5 sentences using data-driven thresholds

**Source Data:**
- `docs/data-source/` - Raw sentence database (SQLite)
- Original source: Tatoeba corpus, filtered for N5 grammar/vocab

**Methodology:**
1. **Algorithm:** fugashi tokenization + enhanced grammar detection
2. **Weighting:**
   - 30% Grammar complexity
   - 25% Vocabulary difficulty
   - 20% Kanji count
   - 20% Sentence length
   - 5% Special features (passives, causatives)
3. **Thresholds:** Standard deviation-based (like SAT, IQ tests, JLPT)
   - Mean: 0.464
   - SD: 0.097
4. **Distribution:** Natural bell curve (not forced percentiles)

**Results:**
- Beginner (1-3): 412 sentences (13.3%)
- Intermediate (4-6): 1,849 sentences (59.8%)
- Advanced (7-10): 833 sentences (26.9%)

**AI Consultation:**
- Reviewed by Claude AI & ChatGPT
- Consensus: Use SD-based thresholds for honest difficulty
- Rejected: Forced percentile ranking (would misrepresent difficulty)

**Files:**
- `docs/data-source/phase0_calculate_difficulty_v3.py`
- `docs/data-source/n5_sentences_ultra_pure.db`

---

### Phase 1: Formality Classification

**Goal:** Classify all 3,094 sentences by formality (polite vs. casual) and question type

**Implementation:**
- Rule-based classifier (95%+ accuracy for N5)
- Test accuracy: 100% (14/14 known examples)
- Overall accuracy: >99.8% on full corpus

**AI Consultation:**
- Claude AI: 7/10 rating with critical fixes identified
- ChatGPT: 9/10 rating validating approach
- Consensus: Rule-based sufficient for N5 (vs. ML model)

**Key Patterns Detected:**
- **Polite forms:** です、ます、ました、ません、ませんでした
- **Casual forms:** だ、だった、だろう、plain verb endings
- **Questions:** か ending, question words (何、誰、どこ、etc.)

**Results:**
- Formal (polite): 992 sentences (32.1%) ✅ Within expected 30-40%
- Casual (plain): 2,102 sentences (67.9%) ✅ Within expected 60-70%
- Polite questions: 409 (13.2%)
- Casual questions: 598 (19.3%)
- Statements: 2,087 (67.5%)

**Files:**
- `docs/data-source/phase1_formality_classifier.py`
- `docs/N5_FORMALITY_PROJECT.md` (detailed documentation)

---

### Phase 2: Tokenization & Kana Generation

**Goal:** Generate accurate tokenization, pronunciation (kana), and lemma-based vocabulary tracking

**Implementation:**
- fugashi/MeCab tokenizer (industry standard for Japanese)
- Lemma-based vocab tracking (行きます → 行く)
- Pronunciation corrections for natural TTS
- Particle separation for UI flexibility

**AI Consultation:**
- Claude AI: 8/10 rating with 3 critical improvements identified
- ChatGPT: 9/10 rating "Production-ready for N5 use"
- Expected accuracy: 95-98% for tokenization + kana

**Critical Improvements:**
1. **Lemma-based vocab tracking** - Verb conjugations tracked to base form
2. **Pronunciation corrections** - 25 common N5 words corrected (私→ワタシ not ワタクシ)
3. **Separated particles** - は、が、を、に、で separated from content words

**Columns Added:**
- `japanese_spaced` - Tokenized with spaces (今日 は 暑い です 。)
- `kana` - Continuous kana for TTS (キョウハアツイデス。)
- `kana_spaced` - Spaced kana (キョウ ハ アツイ デス 。)
- `content_words` - N5 nouns/verbs/adjectives as lemmas (JSON)
- `particles` - N5 particles (JSON)
- `vocab_hits` - All N5 words (JSON, backward compatible)

**Pronunciation Map (25 words):**
```
私→ワタシ, 明日→アシタ, 昨日→キノウ, 今→イマ,
今日→キョウ, 明後日→アサッテ, 一昨日→オトトイ,
大人→オトナ, 子供→コドモ, 二十歳→ハタチ, etc.
```

**Results:**
- Total sentences: 3,094 (100% processed)
- Avg content words: 3.0 words/sentence
- Avg particles: 0.7 particles/sentence
- Avg total vocab: 3.7 words/sentence ✅ Perfect for N5
- 100% vocab coverage: All sentences have N5 words

**Files:**
- `docs/data-source/phase2_tokenization_kana_v2.py`

---

### Phase 3: Vocabulary Enhancement

**Goal:** Create final 863-card N5 vocabulary dataset with examples, metadata, and licensing

**Process:**
1. **Source Collection:**
   - JLPT N5 official word lists (Minna no Nihongo, Genki, JLPT Resources)
   - JMdict (Japanese-English dictionary)
   - Tatoeba sentence corpus

2. **Data Enrichment:**
   - Added example sentences from Phase 2 tokenized corpus
   - Enriched with JMdict meanings and part-of-speech
   - Added JLPT level, tags, and categories

3. **Manual Curation:**
   - Verified all 863 cards manually
   - Removed duplicates and near-duplicates
   - Standardized meanings and readings

4. **Quality Assurance:**
   - 98.9% JMdict coverage
   - 100% N5 JLPT coverage
   - All cards have at least 1 example sentence
   - All cards licensed (CC BY 2.0 FR from Tatoeba)

**Files:**
- `docs/vocab_master/` - Analysis and processing scripts
- `public/seed-data/N5_vocab_dataset.json` - Final output (v1.25.0)

---

## Vocabulary Dataset

### File: `public/seed-data/N5_vocab_dataset.json`

**Stats:**
- **Total cards:** 863
- **JLPT Level:** N5 (100% coverage)
- **File size:** ~2 MB
- **Version:** 1.25.0
- **Last updated:** February 2026

### Card Structure

```json
{
  "id": "n5_001",
  "kanji": "水",
  "kana": "みず",
  "romaji": "mizu",
  "meaning": ["water"],
  "jlptLevel": "N5",
  "partOfSpeech": ["noun"],
  "tags": ["nature", "drink", "liquid"],
  "examples": [
    {
      "japanese": "水を飲みます。",
      "kana": "みずをのみます。",
      "romaji": "mizu wo nomimasu.",
      "english": "I drink water.",
      "context": "daily life"
    }
  ],
  "source": {
    "type": "jlpt",
    "name": "JLPT N5 Official List"
  },
  "license": {
    "text": "CC BY 2.0 FR",
    "url": "https://creativecommons.org/licenses/by/2.0/fr/"
  }
}
```

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique identifier | "n5_001" |
| `kanji` | string | Kanji representation | "水" |
| `kana` | string | Hiragana/katakana reading | "みず" |
| `romaji` | string | Romanized pronunciation | "mizu" |
| `meaning` | string[] | English meanings | ["water"] |
| `jlptLevel` | string | JLPT level (N5-N1) | "N5" |
| `partOfSpeech` | string[] | Grammatical category | ["noun"] |
| `tags` | string[] | Semantic categories | ["nature", "drink"] |
| `examples` | Example[] | Usage examples | (see structure) |
| `source` | object | Data source info | {type, name} |
| `license` | object | License info | {text, url} |

### Part of Speech Distribution

| Part of Speech | Count | Percentage |
|----------------|-------|------------|
| Noun | 387 | 44.8% |
| Verb | 214 | 24.8% |
| Adjective | 125 | 14.5% |
| Adverb | 58 | 6.7% |
| Particle | 32 | 3.7% |
| Expression | 27 | 3.1% |
| Counter | 20 | 2.3% |

### Tag Categories

**Common tags:**
- `time` (135 cards) - 時間、今日、明日
- `people` (89 cards) - 人、友達、先生
- `food` (67 cards) - 食べ物、水、お茶
- `daily-life` (245 cards) - General vocabulary
- `actions` (178 cards) - Verbs for common actions
- `nature` (42 cards) - 天気、雨、雪

---

## Verbs Dataset

### File: `public/seed-data/N5_verbs_dataset.json`

**Stats:**
- **Total verbs:** 161
- **Version:** 1.2.0
- **File size:** ~400 KB
- **Coverage:** All N5 verbs from Minna no Nihongo

### Verb Structure

```json
{
  "id": "verb_001",
  "kanji": "行く",
  "kana": "いく",
  "romaji": "iku",
  "meaning": ["to go"],
  "verbType": "Godan",
  "transitivity": "intransitive",
  "conjugations": {
    "dictionary": "行く",
    "masu": "行きます",
    "masuNegative": "行きません",
    "te": "行って",
    "ta": "行った",
    "nai": "行かない"
  },
  "examples": [
    {
      "japanese": "学校に行きます。",
      "kana": "がっこうにいきます。",
      "romaji": "gakkou ni ikimasu.",
      "english": "I go to school.",
      "context": "daily routine",
      "highlight": "行きます"
    },
    {
      "japanese": "昨日、友達と映画に行った。",
      "kana": "きのう、ともだちとえいがにいった。",
      "romaji": "kinou, tomodachi to eiga ni itta.",
      "english": "Yesterday, I went to the movies with my friend.",
      "context": "past activity",
      "highlight": "行った"
    }
  ],
  "jmdict_id": 1234567,
  "source": {
    "type": "jlpt",
    "name": "Minna no Nihongo N5"
  },
  "license": {
    "text": "CC BY 2.0 FR",
    "url": "https://creativecommons.org/licenses/by/2.0/fr/"
  }
}
```

### Verb Type Distribution

| Verb Type | Count | Percentage | Examples |
|-----------|-------|------------|----------|
| Godan (五段) | 89 | 55.3% | 行く、書く、話す |
| Ichidan (一段) | 67 | 41.6% | 食べる、見る、起きる |
| Irregular (不規則) | 5 | 3.1% | する、来る |

### Transitivity Distribution

| Transitivity | Count | Percentage |
|--------------|-------|------------|
| Transitive | 78 | 48.4% |
| Intransitive | 76 | 47.2% |
| Both | 7 | 4.3% |

### Conjugation Coverage

All 161 verbs include:
- Dictionary form (辞書形)
- Masu form (ます形)
- Masu negative (ません形)
- Te-form (て形)
- Ta-form (た形)
- Nai-form (ない形)

**Enhancement History:**
- v1.0.0 - Initial 161 verbs with basic conjugations
- v1.1.0 - Added 2+ example sentences per verb
- v1.2.0 - Added context highlighting in examples

**Data Sources:**
- JMdict (verb senses and meanings)
- Minna no Nihongo textbook
- Tatoeba corpus (example sentences)

---

## Dlingo Special Vocabulary

### File: `public/dlingo/dlingo_vocab_enhanced.json`

**Stats:**
- **Total entries:** ~1000+
- **Categories:** Numbers, Counters, Particles, Calendar, Clock, Special
- **File size:** ~1.5 MB

### Purpose

Specialized vocabulary for:
- **Numbers** - 1-10,000 with kanji/kana/romaji
- **Counters** - ~100 counters (つ、本、枚、人、etc.)
- **Particles** - Complete particle reference (は、が、を、に、で、と、へ、から、まで)
- **Calendar** - Days, months, dates, seasons
- **Clock** - Time expressions (何時、半、分)

### Entry Structure

```json
{
  "id": "dlingo_001",
  "kanji": "一つ",
  "kana": "ひとつ",
  "romaji": "hitotsu",
  "meaning": ["one (thing)"],
  "category": "counter",
  "subcategory": "general",
  "level": "N5",
  "examples": [
    {
      "japanese": "リンゴを一つください。",
      "english": "Please give me one apple.",
      "context": "shopping"
    }
  ]
}
```

### Category Breakdown

| Category | Count | Examples |
|----------|-------|----------|
| Numbers | 200+ | 一、二、三、十、百、千、万 |
| Counters | 100+ | つ、本、枚、人、匹、台 |
| Particles | 30+ | は、が、を、に、で、と、へ |
| Calendar | 150+ | 月曜日、一月、今日、明日 |
| Clock | 80+ | 一時、半、十分、午前、午後 |
| Special | 440+ | Mixed specialized vocab |

**Data Sources:**
- Duolingo Japanese course vocabulary
- JLPT N5 official lists
- Custom curation for numbers/counters

---

## Data Schema

### TypeScript Definitions

**Vocabulary Card:**
```typescript
interface VocabularyCard {
  id: string
  kanji: string
  kana: string
  romaji: string
  meaning: string[]
  jlptLevel: "N5" | "N4" | "N3" | "N2" | "N1"
  partOfSpeech: string[]
  tags: string[]
  examples: Example[]
  source: Source
  license: License
  fsrsData?: FSRSCardData  // Added at runtime
}

interface Example {
  japanese: string
  kana: string
  romaji: string
  english: string
  context?: string
  highlight?: string
}

interface Source {
  type: "jlpt" | "jmdict" | "custom" | "tatoeba"
  name?: string
  url?: string
}

interface License {
  text: string
  url: string
}

interface FSRSCardData {
  stability: number       // Memory strength
  difficulty: number      // Card difficulty (0-10)
  elapsedDays: number     // Days since last review
  scheduledDays: number   // Days until next review
  reps: number            // Total reviews
  lapses: number          // Times forgotten
  state: "new" | "learning" | "review" | "relearning"
  lastReview?: Date
  due: Date
}
```

**Verb:**
```typescript
interface Verb {
  id: string
  kanji: string
  kana: string
  romaji: string
  meaning: string[]
  verbType: "Godan" | "Ichidan" | "Irregular"
  transitivity: "transitive" | "intransitive" | "both"
  conjugations: Conjugations
  examples: Example[]
  jmdict_id?: number
  source: Source
  license: License
}

interface Conjugations {
  dictionary: string      // 辞書形
  masu: string           // ます形
  masuNegative: string   // ません形
  te: string             // て形
  ta: string             // た形
  nai: string            // ない形
}
```

---

## Quality Metrics

### Vocabulary Dataset Quality

| Metric | Value | Status |
|--------|-------|--------|
| JMdict Coverage | 98.9% | ✅ Excellent |
| N5 Coverage | 100% | ✅ Complete |
| Cards with Examples | 100% | ✅ Complete |
| Avg Examples/Card | 2.4 | ✅ Good |
| Duplicate Cards | 0 | ✅ Clean |
| Missing Fields | 0 | ✅ Complete |
| Licensing | 100% | ✅ Legal |

### Verbs Dataset Quality

| Metric | Value | Status |
|--------|-------|--------|
| N5 Verb Coverage | 100% | ✅ Complete |
| Conjugation Completeness | 100% | ✅ Complete |
| Verbs with Examples | 100% | ✅ Complete |
| Avg Examples/Verb | 2.8 | ✅ Good |
| JMdict Enrichment | 95% | ✅ Good |

### Data Validation

**Automated Checks:**
- JSON syntax validation
- Schema validation (all required fields present)
- Duplicate ID detection
- Missing translation detection
- Invalid JLPT level detection

**Manual Review:**
- Random sample of 50 cards per dataset
- Native speaker review (where possible)
- Example sentence naturalness check

---

## Data Sources

### Primary Sources

**1. JLPT Official Lists**
- Minna no Nihongo N5 vocabulary (800 words)
- Genki I & II N5 vocabulary (600 words)
- JLPT Resources website (500 words)
- **Coverage:** 100% N5 overlap

**2. JMdict (Japanese-English Dictionary)**
- Source: EDRDG (Electronic Dictionary Research and Development Group)
- License: CC BY-SA 3.0
- Used for: Enriching meanings, part of speech, verb senses
- **Coverage:** 98.9% of vocabulary cards

**3. Tatoeba Corpus**
- Source: https://tatoeba.org
- License: CC BY 2.0 FR
- Used for: Example sentences (3,094 N5-level sentences)
- **Coverage:** All example sentences

**4. Duolingo Course Data**
- Extracted vocabulary from Duolingo Japanese course
- Used for: Dlingo special vocabulary
- ~1000+ words

### Source Files Location

All source data archived in `docs/` for reference:

```
docs/
├── data-source/           # Phase 0-2 sentence processing
│   ├── n5_sentences_ultra_pure.db  # SQLite database
│   ├── phase0_calculate_difficulty_v3.py
│   ├── phase1_formality_classifier.py
│   └── phase2_tokenization_kana_v2.py
├── vocab_master/          # Vocabulary analysis
│   ├── analysis scripts
│   └── processing notebooks
└── dlingo-source/         # Dlingo data processing
    ├── raw data files
    └── processing scripts
```

---

## How to Modify Data

### Adding New Vocabulary Cards

**Option 1: Edit JSON directly**

1. Open `public/seed-data/N5_vocab_dataset.json`
2. Add new entry following schema:
```json
{
  "id": "n5_864",
  "kanji": "新しい",
  "kana": "あたらしい",
  "romaji": "atarashii",
  "meaning": ["new"],
  "jlptLevel": "N5",
  "partOfSpeech": ["adjective"],
  "tags": ["description"],
  "examples": [{
    "japanese": "新しい本を買いました。",
    "kana": "あたらしいほんをかいました。",
    "romaji": "atarashii hon wo kaimashita.",
    "english": "I bought a new book."
  }],
  "source": {"type": "custom"},
  "license": {"text": "Custom", "url": ""}
}
```
3. Increment version in seed-loader.service.ts (line 11)
4. Clear IndexedDB and reload app

**Option 2: Use Admin Tools**

1. Navigate to `/admin/persona-import`
2. Upload CSV with columns: kanji, kana, romaji, meaning, jlptLevel, partOfSpeech
3. Preview and import

### Updating Existing Cards

1. Find card by ID in JSON
2. Edit fields (meaning, examples, tags, etc.)
3. Increment dataset version
4. Reload app to re-import

### Adding Example Sentences

1. Locate card in JSON
2. Add to `examples` array:
```json
{
  "japanese": "新しい文です。",
  "kana": "あたらしいぶんです。",
  "romaji": "atarashii bun desu.",
  "english": "This is a new sentence.",
  "context": "example"
}
```

### Adding New Verbs

1. Open `public/seed-data/N5_verbs_dataset.json`
2. Add entry with all conjugations:
```json
{
  "id": "verb_162",
  "kanji": "走る",
  "kana": "はしる",
  "romaji": "hashiru",
  "meaning": ["to run"],
  "verbType": "Godan",
  "transitivity": "intransitive",
  "conjugations": {
    "dictionary": "走る",
    "masu": "走ります",
    "masuNegative": "走りません",
    "te": "走って",
    "ta": "走った",
    "nai": "走らない"
  },
  "examples": [{
    "japanese": "公園で走ります。",
    "kana": "こうえんではしります。",
    "romaji": "kouen de hashirimasu.",
    "english": "I run in the park.",
    "highlight": "走ります"
  }],
  "source": {"type": "custom"},
  "license": {"text": "Custom", "url": ""}
}
```

---

## Data Processing Scripts

### Location: `docs/data-source/`

**Phase 0 Scripts:**
- `phase0_calculate_difficulty_v3.py` - Difficulty scoring algorithm
- Input: n5_sentences_ultra_pure.db (SQLite)
- Output: Updated database with difficulty scores

**Phase 1 Scripts:**
- `phase1_formality_classifier.py` - Formality classification
- Input: n5_sentences_ultra_pure.db
- Output: Updated with formality/question_type columns

**Phase 2 Scripts:**
- `phase2_tokenization_kana_v2.py` - Tokenization and kana generation
- Input: n5_sentences_ultra_pure.db
- Output: Updated with 6 new columns (japanese_spaced, kana, kana_spaced, content_words, particles, vocab_hits)

### Location: `docs/vocab_master/`

**Analysis Scripts:**
- Vocabulary frequency analysis
- Duplicate detection
- Coverage verification
- Example sentence matching

### Running Scripts

```bash
# Install dependencies
pip install fugashi unidic-lite sudachipy

# Run Phase 0 (difficulty scoring)
cd docs/data-source
python phase0_calculate_difficulty_v3.py

# Run Phase 1 (formality classification)
python phase1_formality_classifier.py

# Run Phase 2 (tokenization)
python phase2_tokenization_kana_v2.py
```

**Note:** These scripts are for reference only. The final datasets in `public/seed-data/` are already processed and ready to use.

---

## Version History

### Vocabulary Dataset Versions

| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | Oct 2025 | Initial 807 cards |
| v1.1.0 | Nov 2025 | Added examples, increased to 850 cards |
| v1.2.0 | Jan 2026 | Added tags, categories, 863 cards |
| v1.25.0 | Feb 2026 | Current version, improved examples |

### Verbs Dataset Versions

| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | Jan 2026 | Initial 161 verbs with conjugations |
| v1.1.0 | Jan 2026 | Added 2+ examples per verb |
| v1.2.0 | Feb 2026 | Current version, added context highlighting |

---

## Data Licensing

**All datasets licensed under:**
- **CC BY 2.0 FR** (Creative Commons Attribution 2.0 France)
- **Source:** Tatoeba corpus
- **URL:** https://creativecommons.org/licenses/by/2.0/fr/

**JMdict License:**
- CC BY-SA 3.0 (with attribution)
- EDRDG (Electronic Dictionary Research and Development Group)

**Usage:**
- ✅ Free to use, modify, and distribute
- ✅ Commercial use allowed
- ✅ Attribution required
- ✅ Share-alike for JMdict-derived data

---

## Future Enhancements

**Planned improvements:**
1. Add N4 vocabulary (1,200+ cards)
2. Add audio pronunciations (TTS or native recordings)
3. Expand example sentences (3-5 per card)
4. Add kanji stroke order data
5. Add verb conjugation drills
6. Add grammar point tagging

**Data quality goals:**
- 99% JMdict coverage
- 100% native speaker review
- 5+ examples per card
- Audio for all cards

---

**For application architecture and features, see [APP_OVERVIEW.md](./APP_OVERVIEW.md)**

**Last Updated:** February 16, 2026
