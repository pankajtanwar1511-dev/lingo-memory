# Kanji Implementation Plan

**Project:** LingoMemory Kanji Learning Module
**Created:** 2025-01-30
**Current Branch:** `kanji` (all phases in this branch)
**Status:** 🔄 Phase 3 - Integration & Polish

---

## 🎯 Progress Overview

**Overall Completion: 66%** (Phase 1: 100%, Phase 2: 100%, Phase 3: 0%)

### Phase 1: Data Fetching & Processing (100% complete) ✅
**Started:** 2025-01-30 12:15
**Completed:** 2025-01-30 12:30
**Status:** ✅ Complete

#### Completed Tasks ✅
- [x] Task 1.1: Download source data (3/3 sources)
  - KANJIDIC2 XML (15MB) downloaded and extracted
  - KanjiVG repository cloned (11,000+ SVG files)
  - N5 kanji list created (88 kanji)
- [x] Task 1.2: Create data processing scripts (4/4 scripts)
  - `01_process_kanjidic2.py` - Extract kanji metadata from KANJIDIC2
  - `02_process_kanjivg.py` - Process SVG files and copy to public/
  - `03_link_vocabulary.py` - Link kanji to vocab words
  - `04_merge_dataset.py` - Merge all data into final schema
- [x] Task 1.3: Schema finalized and documented
- [x] Task 1.4: Generate production dataset
  - **Output:** `public/seed-data/kanji_n5.json` (91KB)
  - **Kanji:** 88 N5 characters
  - **Vocab links:** 272 example words
  - **SVG files:** 88 stroke order diagrams in `public/kanji/strokes/`
- [x] Task 1.5: Update CREDITS.md with KANJIDIC2 and KanjiVG attribution

#### Skipped/Blocked ⚠️
- None - All tasks completed successfully!

---

### Phase 2: UI Components & Animations (100% complete) ✅
**Started:** 2025-01-30 12:35
**Completed:** 2025-01-30 14:30
**Status:** ✅ Complete
**Branch:** `kanji` (same branch for all phases)

#### Completed Tasks ✅
- [x] TypeScript types (src/types/kanji.ts)
- [x] Stroke animation component with Framer Motion
- [x] Kanji detail page with URL decoding fix
- [x] Kanji list page with search, sort, and filter
- [x] Navigation integration (header + study page)
- [x] Reading cards with subtle colors (blue/green)
- [x] Animation fixes:
  - Fixed initial state (start at currentStroke = -1)
  - Fixed replay animation (animationKey remounting)
  - Fixed stroke sequencing (auto-advance working)
  - Fixed last stroke blink
  - Fixed loop restart animations
- [x] Stroke number positioning (at stroke start points)
- [x] Stroke number display modes (Current/All/Hidden toggle)
- [x] Kanji detail page (/study/kanji/[id])
- [x] Kanji list page (/study/kanji)
- [x] Navigation integration (header + study page)
- [x] Kanji card on main study page

#### Skipped/Deferred ⏳
- FSRS integration for kanji study → Moved to Phase 3

---

### Phase 3: Integration & Polish (0% complete)
**Status:** ⏳ Not started (blocked by Phase 2)

---

### Phase 4: Teaching Examples & Enhancements (0% complete)
**Status:** ⏳ Not started (blocked by Phase 3)
**Note:** Added based on design discussion - dedicated kanji teaching examples

#### Planned Tasks
- [ ] Generate AI teaching examples (2-3 per kanji, 250 total)
  - One kun-reading example
  - One on-reading example
  - N5-appropriate grammar only
- [ ] AI verification in batches (similar to vocab workflow)
- [ ] Update schema to support both vocab links + teaching examples
- [ ] Add audio for teaching examples (with licensed TTS)
- [ ] Update UI to show teaching examples section

**Goal:** Provide simple, focused examples that teach individual kanji readings in isolation (complement existing vocab word links)

---

## 📝 Recent Updates Log

| Timestamp | Task | Status | Notes |
|-----------|------|--------|-------|
| 2025-01-30 12:00 | Schema documentation | ✅ Complete | Added comprehensive field-by-field docs |
| 2025-01-30 12:15 | Starting Phase 1 | 🔄 In Progress | Beginning data downloads |
| 2025-01-30 12:21 | Task 1.1 - Data download | ✅ Complete | KANJIDIC2 (15MB), KanjiVG (11K SVGs), N5 list (88 kanji) |
| 2025-01-30 12:23 | Script 1: KANJIDIC2 processor | ✅ Complete | Extracted 88 N5 kanji with full metadata |
| 2025-01-30 12:24 | Script 2: KanjiVG processor | ✅ Complete | Copied 88 SVG files to public/ |
| 2025-01-30 12:24 | Script 3: Vocab linker | ✅ Complete | Linked 272 vocab examples to kanji |
| 2025-01-30 12:25 | Script 4: Dataset merger | ✅ Complete | Generated kanji_n5.json (91KB) |
| 2025-01-30 12:26 | CREDITS.md update | ✅ Complete | Added KANJIDIC2 and KanjiVG attribution |
| 2025-01-30 12:30 | **Phase 1 COMPLETE** | ✅ **100%** | All data processing done - ready for Phase 2 |
| 2025-01-30 12:32 | Git commit & branch setup | ✅ Complete | Phase 1 committed, switched to `kanji` branch |
| 2025-01-30 12:35 | **Phase 2 STARTED** | 🔄 In Progress | Beginning UI components and stroke animations |
| 2025-01-30 12:40 | Stroke animation component | ✅ Complete | Framer Motion-based with full controls |
| 2025-01-30 12:45 | Kanji detail page | ✅ Complete | Full kanji info + stroke animation + examples |
| 2025-01-30 12:50 | Kanji list page | ✅ Complete | Grid view with search, filter, sort |
| 2025-01-30 12:55 | Navigation integration | ✅ Complete | Added Kanji to header nav + study page card |
| 2025-01-30 13:00 | **Phase 2 COMPLETE** | ✅ **100%** | All UI components done - ready for Phase 3 |

---

## 📋 Overview

This document tracks the complete implementation of the Kanji learning section for LingoMemory. The implementation is divided into **3 phases**, each handled in a separate branch for clean, manageable development.

### Goals

1. ✅ Legally source all kanji data (KANJIDIC2 + KanjiVG + community N5 list)
2. ✅ Build production-ready kanji dataset (80 N5 kanji → expandable to N4-N1)
3. ✅ Create beautiful kanji detail pages with stroke order animations
4. ✅ Integrate kanji study mode into existing FSRS system
5. ✅ Link kanji ↔ vocabulary bidirectionally

### Data Sources (All Legal & Attributed)

| Source | License | Usage | Status |
|--------|---------|-------|--------|
| **KANJIDIC2** (EDRDG) | CC BY-SA 4.0 | Readings, meanings, metadata | 🔲 Not started |
| **KanjiVG** | CC BY-SA 3.0 | SVG stroke order diagrams | 🔲 Not started |
| **Community N5 List** | MIT/CC0 | Level mapping (80 kanji) | 🔲 Not started |
| **Existing Vocab** | CC BY-SA 4.0 | Example words per kanji | ✅ Already have |

---

## 🎯 Phase 1: Data Fetching & Processing
**Branch:** `kanji-data-fetching` (current)
**Goal:** Download, parse, and generate production-ready kanji dataset
**Estimated Time:** 2-3 days

### 1.1 Download Source Data

- [ ] **Download KANJIDIC2 XML**
  - URL: http://ftp.edrdg.org/pub/Nihongo/kanjidic2.xml.gz
  - Location: `data/kanji/raw/kanjidic2.xml`
  - Size: ~7 MB (compressed)
  - Format: XML with kanji entries

- [ ] **Clone KanjiVG Repository**
  - URL: https://github.com/KanjiVG/kanjivg
  - Location: `data/kanji/raw/kanjivg/`
  - Files needed: `kanji/*.svg` (80 files for N5)
  - Format: SVG with stroke groups

- [ ] **Get Community N5 Kanji List**
  - Option A: https://github.com/davidluzgouveia/kanji-data (MIT)
  - Option B: Manually curated list from official JLPT resources
  - Location: `data/kanji/n5-kanji-list.json`
  - Content: 80 kanji characters with basic metadata

**Status:** 🔲 Not started
**Blockers:** None
**Notes:** All sources use permissive licenses compatible with our project

---

### 1.2 Create Data Processing Script

- [ ] **Script:** `scripts/kanji/01_process_kanjidic2.py`
  - Parse KANJIDIC2 XML
  - Extract fields: literal, meanings, readings (on/kun), stroke_count, grade, freq
  - Filter to N5 kanji only (80 entries)
  - Output: `data/kanji/processed/kanjidic2_n5.json`

- [ ] **Script:** `scripts/kanji/02_process_kanjivg.py`
  - Copy N5 SVG files to `public/kanji/strokes/`
  - Parse SVG to extract stroke groups for animation
  - Generate metadata: stroke count, viewBox dimensions
  - Output: `data/kanji/processed/kanjivg_n5.json`

- [ ] **Script:** `scripts/kanji/03_link_vocabulary.py`
  - Read existing `public/seed-data/N5_vocab_dataset.json`
  - For each kanji, find all vocab words containing it
  - Extract: word, reading, meaning, audioPath
  - Output: `data/kanji/processed/kanji_vocab_links.json`

- [ ] **Script:** `scripts/kanji/04_merge_dataset.py`
  - Combine all processed data sources
  - Generate final schema (see 1.3)
  - Add generation metadata (date, sources, version)
  - Output: `public/seed-data/kanji_n5.json`

**Status:** 🔲 Not started
**Dependencies:** 1.1 must be complete
**Tech Stack:** Python 3.x, `lxml` (XML parsing), `beautifulsoup4` (SVG parsing)

---

### 1.3 Define Kanji Data Schema

**File:** `data/kanji/schema.json`

---

## 📖 Comprehensive Kanji Schema Documentation

This section provides a **complete reference** for the kanji data structure used in LingoMemory. The schema is designed to be:
- ✅ **Consistent** with existing vocab dataset (`N5_vocab_dataset.json`)
- ✅ **Extensible** for future features (audio, mnemonics, N4-N1 expansion)
- ✅ **Legally compliant** with CC BY-SA 4.0 attribution requirements
- ✅ **Performance-optimized** for fast lookups and rendering

---

#### Final Kanji Schema (Optimized for LingoMemory)

```typescript
// TypeScript interface for type safety
interface KanjiCard {
  // === Core Identity ===
  id: string;                    // e.g., "kanji_n5_日"
  kanji: string;                 // "日"
  jlptLevel: "N5" | "N4" | "N3" | "N2" | "N1";

  // === Meanings & Readings ===
  meanings: string[];            // ["day", "sun", "Japan"]
  onReadings: string[];          // ["ニチ", "ジツ"]
  kunReadings: string[];         // ["ひ", "-び", "-か"]

  // === Structure ===
  strokeCount: number;           // 4
  grade: number | null;          // Jouyou grade 1-6, or null (e.g., for 毎 = null)
  radical: {
    literal: string;             // "日"
    meaning: string;             // "sun, day"
    position?: string;           // "left", "right", "top", "bottom", "enclosure", etc.
  };
  frequency: number | null;      // Frequency rank from KANJIDIC2 (1 = most common)

  // === Visual/Animation ===
  strokes: {
    svgPath: string;             // "/kanji/strokes/065e5.svg" (KanjiVG filename)
    count: number;               // Same as strokeCount (redundant for validation)
    animationData?: {            // Parsed from SVG (optional, can be generated client-side)
      paths: string[];           // SVG path data for each stroke
      durations: number[];       // Animation duration per stroke (ms)
    };
  };

  // === Vocabulary Links (Bidirectional) ===
  examples: string[];            // ["n5_vocab_0001", "n5_vocab_0042", "n5_vocab_0123"]
                                 // Array of vocab IDs from N5_vocab_dataset.json

  // === Audio (Future - Phase 4+) ===
  audio?: {
    onReadings?: string[];       // ["/audio/kanji/日_ニチ.mp3", "/audio/kanji/日_ジツ.mp3"]
    kunReadings?: string[];      // ["/audio/kanji/日_ひ.mp3", "/audio/kanji/日_か.mp3"]
    source?: "pending" | "voicevox" | "openjtalk" | "azure";
  };

  // === Mnemonics (Future - Phase 5+) ===
  mnemonics?: {
    visual?: string;             // "Picture of the sun ☀️"
    story?: string;              // "The sun rises every DAY"
    radical?: string;            // "Composed of 囗 (box) + 一 (one)"
    source: "community" | "generated" | "manual";
  };

  // === Attribution & Metadata ===
  source: {
    type: "kanjidic2";           // Primary source
    version: string;             // "KANJIDIC2 2024-12"
    url: string;                 // "http://www.edrdg.org/wiki/index.php/KANJIDIC_Project"
  };
  license: {
    text: "CC BY-SA 4.0";        // Same as vocab dataset
    url: string;                 // "https://creativecommons.org/licenses/by-sa/4.0/"
  };
  metadata: {
    verified: boolean;           // true (after manual QA)
    addedDate: string;           // ISO 8601: "2025-01-30T12:00:00Z"
    lastUpdated: string;         // ISO 8601
  };
}

// Root dataset structure (mirrors vocab dataset)
interface KanjiDataset {
  metadata: {
    version: string;             // "1.0.0"
    generatedAt: string;         // ISO 8601
    description: string;         // "JLPT N5 kanji with stroke order and vocabulary links"
    totalKanji: number;          // 80 (for N5)
    kanjiWithExamples: number;   // Count of kanji with 1+ example words
    totalExampleWords: number;   // Total vocab words linked
    sources: {
      kanjidic2: string;         // Version/date
      kanjivg: string;           // Version/date
      vocabulary: string;        // "LingoMemory N5 Vocab Dataset v1.0.0"
    };
  };
  kanji: KanjiCard[];
}
```

#### Example JSON Entry (Kanji: 日)

```json
{
  "id": "kanji_n5_日",
  "kanji": "日",
  "jlptLevel": "N5",
  "meanings": ["day", "sun", "Japan"],
  "onReadings": ["ニチ", "ジツ"],
  "kunReadings": ["ひ", "-び", "-か"],
  "strokeCount": 4,
  "grade": 1,
  "radical": {
    "literal": "日",
    "meaning": "sun, day",
    "position": "standalone"
  },
  "frequency": 1,
  "strokes": {
    "svgPath": "/kanji/strokes/065e5.svg",
    "count": 4
  },
  "examples": ["n5_vocab_0042", "n5_vocab_0123", "n5_vocab_0205", "n5_vocab_0301"],
  "source": {
    "type": "kanjidic2",
    "version": "KANJIDIC2 2024-12",
    "url": "http://www.edrdg.org/wiki/index.php/KANJIDIC_Project"
  },
  "license": {
    "text": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  "metadata": {
    "verified": true,
    "addedDate": "2025-01-30T12:00:00Z",
    "lastUpdated": "2025-01-30T12:00:00Z"
  }
}
```

#### Example JSON Entry (Kanji: 毎 - your example)

```json
{
  "id": "kanji_n5_毎",
  "kanji": "毎",
  "jlptLevel": "N5",
  "meanings": ["every"],
  "onReadings": ["マイ"],
  "kunReadings": ["ごと", "-ごと"],
  "strokeCount": 6,
  "grade": 2,
  "radical": {
    "literal": "母",
    "meaning": "mother",
    "position": "standalone"
  },
  "frequency": 451,
  "strokes": {
    "svgPath": "/kanji/strokes/06bcf.svg",
    "count": 6
  },
  "examples": ["n5_vocab_0001", "n5_vocab_0234", "n5_vocab_0456"],
  "source": {
    "type": "kanjidic2",
    "version": "KANJIDIC2 2024-12",
    "url": "http://www.edrdg.org/wiki/index.php/KANJIDIC_Project"
  },
  "license": {
    "text": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  "metadata": {
    "verified": true,
    "addedDate": "2025-01-30T12:00:00Z",
    "lastUpdated": "2025-01-30T12:00:00Z"
  }
}
```

#### Linking with Existing Vocab Dataset

**Bidirectional Linking Strategy:**

1. **Kanji → Vocabulary** (this schema)
   - `examples: ["n5_vocab_0001", "n5_vocab_0042", ...]`
   - Links to vocab IDs in `N5_vocab_dataset.json`

2. **Vocabulary → Kanji** (update vocab schema later)
   - Add new field to vocab cards: `"containsKanji": ["kanji_n5_日", "kanji_n5_本"]`
   - Generated automatically during Phase 1 processing

3. **Script to Generate Links** (`scripts/kanji/03_link_vocabulary.py`)
   ```python
   # For each kanji (e.g., "日"):
   #   1. Search all vocab words where word.kanji contains "日"
   #   2. Add vocab.id to kanji.examples[]
   #   3. Add kanji.id to vocab.containsKanji[]
   ```

---

## 📋 Field-by-Field Detailed Documentation

### Core Identity Fields

#### `id: string`
- **Purpose:** Unique identifier for each kanji entry
- **Format:** `kanji_{jlptLevel}_{kanjiCharacter}`
- **Examples:**
  - `"kanji_n5_日"` (kanji "日" at N5 level)
  - `"kanji_n5_毎"` (kanji "毎" at N5 level)
  - `"kanji_n4_勉"` (future: kanji "勉" at N4 level)
- **Use Cases:**
  - Primary key in IndexedDB `kanjiProgress` table
  - Foreign key in vocab dataset's `containsKanji` field
  - URL routing: `/study/kanji/[id]`
- **Validation Rules:**
  - Must be unique across entire dataset
  - Must match pattern: `/^kanji_(n5|n4|n3|n2|n1)_.+$/`
- **Notes:** Using ID instead of raw kanji character allows duplicate kanji across levels (rare but possible)

#### `kanji: string`
- **Purpose:** The actual kanji character
- **Format:** Single Unicode character (UTF-8)
- **Examples:** `"日"`, `"毎"`, `"本"`, `"人"`
- **Use Cases:**
  - Display in UI (large font on kanji cards)
  - Search/filter functionality
  - Substring matching in vocabulary words
- **Validation Rules:**
  - Must be exactly 1 character
  - Must be valid Unicode kanji (U+4E00 to U+9FFF range)
  - No hiragana, katakana, or romaji allowed
- **Edge Cases:**
  - Some N5 kanji are also used in N4-N1 (handled via separate entries with different IDs)
  - Kanji may have multiple forms (旧字体 vs 新字体) - we use modern forms only

#### `jlptLevel: "N5" | "N4" | "N3" | "N2" | "N1"`
- **Purpose:** JLPT level classification
- **Format:** Enum of 5 values (N5 easiest → N1 hardest)
- **Examples:** `"N5"`, `"N4"`, `"N3"`, `"N2"`, `"N1"`
- **Use Cases:**
  - Filtering kanji list by level
  - Study progression (unlock N4 after N5 completion)
  - Difficulty-based sorting
- **Validation Rules:**
  - Must be one of the 5 exact values
  - Case-sensitive (uppercase N required)
- **Notes:**
  - N5 has ~80 kanji, N4 has ~168, N3 has ~361, N2 has ~415, N1 has ~1000+
  - JLPT doesn't publish official lists - we use community consensus

---

### Meanings & Readings Fields

#### `meanings: string[]`
- **Purpose:** English meanings/translations
- **Format:** Array of strings (order: most common → least common)
- **Examples:**
  - `["day", "sun", "Japan"]` (for 日)
  - `["every"]` (for 毎)
  - `["book", "origin", "main"]` (for 本)
- **Use Cases:**
  - Display primary meaning in kanji list cards
  - Show all meanings on kanji detail page
  - Search/filter by English keyword
- **Validation Rules:**
  - Array must have at least 1 meaning
  - Each meaning lowercase (except proper nouns)
  - No duplicates in array
  - Max 10 meanings (for UI performance)
- **Data Source:** KANJIDIC2 `<meaning>` tags (English only)
- **Edge Cases:**
  - Some kanji have 10+ meanings - we prioritize most common
  - Technical/archaic meanings excluded for N5-N3

#### `onReadings: string[]`
- **Purpose:** 音読み (Chinese-origin readings) in katakana
- **Format:** Array of katakana strings
- **Examples:**
  - `["ニチ", "ジツ"]` (for 日)
  - `["マイ"]` (for 毎)
  - `["ホン"]` (for 本)
- **Use Cases:**
  - Display on kanji detail page
  - Audio pronunciation (future)
  - Quiz mode: "What's the on-reading?"
- **Validation Rules:**
  - All entries must be katakana only (no hiragana/kanji/romaji)
  - Empty array allowed (some kanji have no on-reading)
  - No duplicates
  - Sorted by frequency (most common first)
- **Data Source:** KANJIDIC2 `<reading r_type="ja_on">`
- **Notes:**
  - 音読み used in compound words (熟語)
  - Example: 日本 (にほん) uses on-reading ニチ→ニ

#### `kunReadings: string[]`
- **Purpose:** 訓読み (Japanese-origin readings) in hiragana
- **Format:** Array of hiragana strings (may include okurigana markers)
- **Examples:**
  - `["ひ", "-び", "-か"]` (for 日)
  - `["ごと", "-ごと"]` (for 毎)
  - `["もと"]` (for 本)
- **Use Cases:**
  - Display on kanji detail page
  - Show standalone word usage
  - Quiz mode: "What's the kun-reading?"
- **Validation Rules:**
  - All entries must be hiragana (with optional `-` prefix/suffix)
  - Empty array allowed (some kanji have no kun-reading)
  - No duplicates
  - Sorted by frequency
- **Data Source:** KANJIDIC2 `<reading r_type="ja_kun">`
- **Special Markers:**
  - `-` prefix: reading used as suffix (e.g., `-び` in 誕生日)
  - `.` (dot): separates kanji reading from okurigana (e.g., `た.べる` → we store as `た`)
- **Notes:**
  - 訓読み used in standalone words and verbs
  - Example: 日 (ひ) = "day" as standalone word

---

### Structure Fields

#### `strokeCount: number`
- **Purpose:** Total number of strokes to write the kanji
- **Format:** Positive integer (1-30 for N5, up to 84 for rarest kanji)
- **Examples:** `4` (日), `6` (毎), `5` (本)
- **Use Cases:**
  - Sorting kanji by complexity
  - Filtering (e.g., "Show only 1-5 stroke kanji")
  - Validation against SVG stroke paths
  - Study progression (learn simple kanji first)
- **Validation Rules:**
  - Must be positive integer
  - Must match `strokes.count` field (redundancy check)
  - N5 range: typically 1-17 strokes
- **Data Source:** KANJIDIC2 `<stroke_count>` tag
- **Notes:** Stroke count is standardized (教育漢字 rules)

#### `grade: number | null`
- **Purpose:** Jouyou kanji grade (教育漢字 grade level in Japan)
- **Format:** Integer 1-6, or null for non-Jouyou kanji
- **Examples:**
  - `1` (日 - 1st grade)
  - `2` (毎 - 2nd grade)
  - `null` (for non-Jouyou kanji)
- **Use Cases:**
  - Show "Elementary grade X" badge on kanji cards
  - Filter by Japanese school grade
  - Indicate kanji difficulty for native learners
- **Validation Rules:**
  - Must be 1, 2, 3, 4, 5, 6, or null
  - N5 kanji are mostly grade 1-2
- **Data Source:** KANJIDIC2 `<grade>` tag
- **Notes:**
  - Grade 1-6 = 教育漢字 (1,006 kanji taught in elementary school)
  - Null = 常用漢字外 (outside standard usage) or 常用漢字 grade 7+

#### `radical: object`
- **Purpose:** The kanji's radical (部首) - semantic/phonetic component
- **Format:** Object with literal, meaning, and optional position
- **Structure:**
  ```typescript
  {
    literal: string;      // Radical character (e.g., "日")
    meaning: string;      // English meaning (e.g., "sun, day")
    position?: string;    // Position in kanji (optional)
  }
  ```
- **Examples:**
  - `{ literal: "日", meaning: "sun, day", position: "standalone" }` (日)
  - `{ literal: "母", meaning: "mother", position: "standalone" }` (毎)
  - `{ literal: "木", meaning: "tree", position: "left" }` (for 校)
- **Use Cases:**
  - Display radical information on kanji detail page
  - Group kanji by radical (advanced filtering)
  - Help learners understand kanji composition
- **Validation Rules:**
  - `literal` must be valid radical from 214 Kangxi radicals
  - `meaning` must be lowercase English
  - `position` values: "left", "right", "top", "bottom", "enclosure", "standalone"
- **Data Source:** KANJIDIC2 `<radical>` tag (classical radical)
- **Notes:**
  - Some kanji have multiple possible radicals - we use the "official" one from KANJIDIC2
  - Radical position helps with mnemonic creation

#### `frequency: number | null`
- **Purpose:** Frequency rank in Japanese text (lower = more common)
- **Format:** Positive integer (1 = most frequent), or null if not ranked
- **Examples:**
  - `1` (日 - most common kanji)
  - `451` (毎 - moderately common)
  - `null` (rare kanji not in top 2,500)
- **Use Cases:**
  - Prioritize common kanji in study order
  - Sort kanji list by "most useful first"
  - Show "Top 100 kanji" badge
- **Validation Rules:**
  - Must be positive integer or null
  - Typically 1-2,500 for N5-N2 kanji
- **Data Source:** KANJIDIC2 `<freq>` tag (based on newspaper corpus)
- **Notes:**
  - Frequency based on 1990s newspaper analysis
  - N5 kanji are generally in top 500 most common

---

### Visual/Animation Fields

#### `strokes: object`
- **Purpose:** SVG file path and stroke animation data
- **Format:** Object with path, count, and optional animation data
- **Structure:**
  ```typescript
  {
    svgPath: string;           // Path to KanjiVG SVG file
    count: number;             // Redundant stroke count (validation)
    animationData?: {          // Optional pre-parsed animation data
      paths: string[];         // SVG path data per stroke
      durations: number[];     // Animation duration per stroke (ms)
    };
  }
  ```
- **Examples:**
  ```json
  {
    "svgPath": "/kanji/strokes/065e5.svg",
    "count": 4,
    "animationData": {
      "paths": [
        "M 26,24 L 74,24",
        "M 50,13 L 50,87",
        "M 13,45 L 87,45",
        "M 20,68 L 80,68"
      ],
      "durations": [800, 800, 800, 800]
    }
  }
  ```
- **Use Cases:**
  - Load SVG for stroke order animation
  - Validate stroke count consistency
  - Precomputed animation paths (optional optimization)
- **Validation Rules:**
  - `svgPath` must exist in `public/kanji/strokes/` directory
  - `count` must match `strokeCount` field
  - `animationData.paths.length` must equal `count`
  - `animationData.durations.length` must equal `count`
- **Data Source:**
  - `svgPath`: KanjiVG repository (filename = Unicode codepoint in hex)
  - `animationData`: Parsed from SVG `<path>` elements (optional)
- **Notes:**
  - Filename format: `{unicode}.svg` (e.g., `065e5.svg` for 日 = U+65E5)
  - Animation data can be generated client-side (saves dataset size)

**SVG Filename Calculation:**
```python
# Python script to calculate KanjiVG filename
kanji = "日"
codepoint = ord(kanji)  # 26085 decimal
hex_code = f"{codepoint:05x}"  # "065e5"
filename = f"{hex_code}.svg"  # "065e5.svg"
```

---

### Vocabulary Links Field

#### `examples: string[]`
- **Purpose:** Array of vocabulary IDs that contain this kanji
- **Format:** Array of vocab ID strings (from `N5_vocab_dataset.json`)
- **Examples:**
  - `["n5_vocab_0001", "n5_vocab_0042", "n5_vocab_0123"]` (for 毎)
  - `["n5_vocab_0010", "n5_vocab_0205", "n5_vocab_0301"]` (for 日)
- **Use Cases:**
  - Display "Example Words" section on kanji detail page
  - Click example → navigate to vocab detail page
  - Show progress: "You know 3/5 words using this kanji"
- **Validation Rules:**
  - All IDs must exist in `N5_vocab_dataset.json`
  - Each ID must contain the kanji in its `kanji` field
  - No duplicates
  - Sorted by vocab frequency (common words first)
- **Generation Logic:**
  ```python
  # Script: scripts/kanji/03_link_vocabulary.py
  for kanji in kanji_list:
      kanji['examples'] = []
      for vocab in vocab_dataset:
          if kanji['kanji'] in vocab['kanji']:
              kanji['examples'].append(vocab['id'])
  ```
- **Reverse Link:** Vocab cards will get new field `containsKanji: string[]`
- **Notes:**
  - N5 kanji typically have 3-10 example words
  - Empty array possible (kanji exists but no vocab words in dataset yet)

**Bidirectional Linking Flow:**
```
Kanji Card (日)
├── examples: ["n5_vocab_0042", "n5_vocab_0123"]
│
Vocab Card (今日 = n5_vocab_0042)
├── containsKanji: ["kanji_n5_今", "kanji_n5_日"]
│
User clicks "日" on vocab card
→ Navigate to /study/kanji/kanji_n5_日
→ Shows all example words including 今日
```

---

### Future Fields (Optional - Phase 4+)

#### `audio: object` (Future - Phase 4+)
- **Purpose:** Audio files for kanji readings
- **Format:** Object with arrays of audio file paths
- **Structure:**
  ```typescript
  {
    onReadings?: string[];    // Audio for each on-reading
    kunReadings?: string[];   // Audio for each kun-reading
    source?: string;          // TTS engine used
  }
  ```
- **Example:**
  ```json
  {
    "onReadings": ["/audio/kanji/日_ニチ.mp3", "/audio/kanji/日_ジツ.mp3"],
    "kunReadings": ["/audio/kanji/日_ひ.mp3"],
    "source": "voicevox"
  }
  ```
- **Status:** 🔲 Not implemented (waiting for TTS licensing decision)
- **Notes:** Will use same TTS engine as vocabulary audio

#### `mnemonics: object` (Future - Phase 5+)
- **Purpose:** Memory aids to help remember kanji
- **Format:** Object with visual, story, and radical mnemonics
- **Structure:**
  ```typescript
  {
    visual?: string;     // Visual description
    story?: string;      // Memory story
    radical?: string;    // Radical composition explanation
    source: string;      // "community" | "generated" | "manual"
  }
  ```
- **Example:**
  ```json
  {
    "visual": "Picture of the sun ☀️ in a square",
    "story": "The sun rises every DAY, so 日 means 'day'",
    "radical": "The kanji 日 itself is the radical meaning 'sun'",
    "source": "manual"
  }
  ```
- **Status:** 🔲 Not implemented (can be added via AI generation)
- **Notes:** Similar to WaniKani/RTK mnemonic system

---

### Attribution & Metadata Fields

#### `source: object`
- **Purpose:** Track data source for legal attribution
- **Format:** Object with type, version, URL
- **Structure:**
  ```typescript
  {
    type: "kanjidic2";    // Always "kanjidic2" for kanji data
    version: string;      // KANJIDIC2 version/date
    url: string;          // Official project URL
  }
  ```
- **Example:**
  ```json
  {
    "type": "kanjidic2",
    "version": "KANJIDIC2 2024-12",
    "url": "http://www.edrdg.org/wiki/index.php/KANJIDIC_Project"
  }
  ```
- **Use Cases:**
  - Legal attribution in CREDITS.md
  - Display source info on About page
  - Audit trail for data provenance
- **Validation Rules:**
  - `type` must be "kanjidic2"
  - `version` should include year/month
  - `url` must be valid EDRDG URL
- **Notes:** Required for CC BY-SA 4.0 compliance

#### `license: object`
- **Purpose:** License information for redistribution
- **Format:** Object with license name and URL
- **Structure:**
  ```typescript
  {
    text: "CC BY-SA 4.0";
    url: string;
  }
  ```
- **Example:**
  ```json
  {
    "text": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0/"
  }
  ```
- **Use Cases:**
  - Legal compliance for redistribution
  - Display license info on detail pages
  - Match vocab dataset license (consistency)
- **Validation Rules:**
  - `text` must be "CC BY-SA 4.0"
  - `url` must be official CC license URL
- **Notes:** Same license as vocab dataset

#### `metadata: object`
- **Purpose:** Track QA status and update history
- **Format:** Object with verification flag and timestamps
- **Structure:**
  ```typescript
  {
    verified: boolean;      // QA passed
    addedDate: string;      // ISO 8601 timestamp
    lastUpdated: string;    // ISO 8601 timestamp
  }
  ```
- **Example:**
  ```json
  {
    "verified": true,
    "addedDate": "2025-01-30T12:00:00Z",
    "lastUpdated": "2025-01-30T12:00:00Z"
  }
  ```
- **Use Cases:**
  - Filter out unverified kanji in production
  - Track when kanji was added/updated
  - Audit trail for quality control
- **Validation Rules:**
  - `verified` must be boolean
  - Dates must be valid ISO 8601 format
  - `lastUpdated` >= `addedDate`
- **Notes:** Similar to vocab dataset verification tracking

---

## 🗂️ Root Dataset Structure

The complete kanji dataset file (`public/seed-data/kanji_n5.json`) has this structure:

```typescript
interface KanjiDataset {
  metadata: {
    version: string;             // Semantic version (e.g., "1.0.0")
    generatedAt: string;         // ISO 8601 timestamp of generation
    description: string;         // Human-readable description
    totalKanji: number;          // Total entries in dataset
    kanjiWithExamples: number;   // Count with 1+ example words
    totalExampleWords: number;   // Sum of all example word links
    sources: {
      kanjidic2: string;         // KANJIDIC2 version
      kanjivg: string;           // KanjiVG commit/date
      vocabulary: string;        // Vocab dataset version
    };
  };
  kanji: KanjiCard[];            // Array of 80 kanji entries
}
```

**Example Root Metadata:**
```json
{
  "metadata": {
    "version": "1.0.0",
    "generatedAt": "2025-01-30T12:00:00Z",
    "description": "JLPT N5 kanji with stroke order animations and vocabulary links",
    "totalKanji": 80,
    "kanjiWithExamples": 78,
    "totalExampleWords": 425,
    "sources": {
      "kanjidic2": "KANJIDIC2 2024-12 (Rev 1.6)",
      "kanjivg": "KanjiVG 20240101",
      "vocabulary": "LingoMemory N5 Vocab Dataset v1.0.0"
    }
  },
  "kanji": [ /* 80 KanjiCard objects */ ]
}
```

---

## 🔗 Detailed Bidirectional Linking Documentation

### Overview
LingoMemory uses **bidirectional linking** between kanji and vocabulary:
- **Kanji → Vocabulary:** `kanji.examples[]` contains vocab IDs
- **Vocabulary → Kanji:** `vocab.containsKanji[]` contains kanji IDs

### Linking Algorithm

**Step 1: Generate Kanji → Vocabulary Links**
```python
# Script: scripts/kanji/03_link_vocabulary.py

import json

# Load datasets
with open('public/seed-data/N5_vocab_dataset.json') as f:
    vocab_data = json.load(f)

with open('data/kanji/processed/kanjidic2_n5.json') as f:
    kanji_list = json.load(f)

# Build links
for kanji_entry in kanji_list:
    kanji_char = kanji_entry['kanji']
    kanji_entry['examples'] = []

    for vocab in vocab_data['vocabulary']:
        # Check if kanji appears in vocab word
        if kanji_char in vocab['kanji']:
            kanji_entry['examples'].append(vocab['id'])

    # Sort by vocab frequency (could add sorting logic here)
    kanji_entry['examples'].sort()

print(f"✅ Linked {len(kanji_list)} kanji to vocabulary")
```

**Step 2: Generate Vocabulary → Kanji Links** (Phase 3)
```python
# Script: scripts/kanji/05_update_vocab_with_kanji.py

# For each vocab word, extract kanji and link to kanji IDs
for vocab in vocab_data['vocabulary']:
    vocab['containsKanji'] = []

    for char in vocab['kanji']:
        # Check if character is a kanji (not kana)
        if is_kanji(char):
            kanji_id = f"kanji_n5_{char}"
            vocab['containsKanji'].append(kanji_id)

# Save updated vocab dataset
with open('public/seed-data/N5_vocab_dataset.json', 'w') as f:
    json.dump(vocab_data, f, ensure_ascii=False, indent=2)
```

### Example Link Graph

```
毎 (kanji_n5_毎)
├── examples:
│   ├── n5_vocab_0001 (毎朝 = every morning)
│   ├── n5_vocab_0234 (毎日 = every day)
│   └── n5_vocab_0456 (毎週 = every week)

日 (kanji_n5_日)
├── examples:
│   ├── n5_vocab_0042 (今日 = today)
│   ├── n5_vocab_0123 (日本 = Japan)
│   ├── n5_vocab_0234 (毎日 = every day)
│   └── n5_vocab_0301 (誕生日 = birthday)

n5_vocab_0234 (毎日)
├── containsKanji:
│   ├── kanji_n5_毎
│   └── kanji_n5_日
```

### UI Navigation Flow

1. **User studies vocab card "毎日" (every day)**
2. **Vocab card shows:** "Contains kanji: 毎, 日" (clickable)
3. **User clicks "日"**
4. **Navigate to:** `/study/kanji/kanji_n5_日`
5. **Kanji detail page shows:**
   - Stroke animation for 日
   - Meanings: day, sun, Japan
   - Example words: 今日, 日本, 毎日, 誕生日 (all clickable)
6. **User clicks "毎日" from example words**
7. **Navigate back to:** `/study/vocab/n5_vocab_0234`
8. **Cycle continues!**

### Performance Optimization

**IndexedDB Schema for Fast Lookups:**
```typescript
// src/services/db/schema.ts

// Table: kanjiCards
interface KanjiCardDB {
  id: string;              // Primary key: "kanji_n5_日"
  kanji: string;           // Indexed for search
  jlptLevel: string;       // Indexed for filtering
  examples: string[];      // Vocab IDs (for joins)
  // ... all other fields
}

// Index definitions
db.version(2).stores({
  kanjiCards: 'id, kanji, jlptLevel, *examples',
  //          ^primary ^indexed  ^indexed ^multiEntry
});

// Fast query: Get all kanji containing vocab word
const vocabId = "n5_vocab_0234";
const relatedKanji = await db.kanjiCards
  .where('examples')
  .equals(vocabId)
  .toArray();
// Returns: [kanji_n5_毎, kanji_n5_日]
```

---

## 🎯 Schema Validation Rules Summary

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `id` | string | ✅ | Match pattern `/^kanji_n5_.$/` |
| `kanji` | string | ✅ | 1 char, Unicode kanji range |
| `jlptLevel` | enum | ✅ | One of: N5, N4, N3, N2, N1 |
| `meanings` | string[] | ✅ | Min 1, max 10, lowercase |
| `onReadings` | string[] | ✅ | Katakana only, can be empty |
| `kunReadings` | string[] | ✅ | Hiragana only, can be empty |
| `strokeCount` | number | ✅ | Positive integer, 1-30 for N5 |
| `grade` | number\|null | ✅ | 1-6 or null |
| `radical.literal` | string | ✅ | Valid Kangxi radical |
| `radical.meaning` | string | ✅ | Lowercase English |
| `radical.position` | string | ❌ | Enum: left/right/top/bottom/enclosure/standalone |
| `frequency` | number\|null | ✅ | Positive integer or null |
| `strokes.svgPath` | string | ✅ | Valid file path |
| `strokes.count` | number | ✅ | Must equal strokeCount |
| `strokes.animationData` | object | ❌ | Optional optimization |
| `examples` | string[] | ✅ | Valid vocab IDs, can be empty |
| `audio` | object | ❌ | Future Phase 4+ |
| `mnemonics` | object | ❌ | Future Phase 5+ |
| `source.type` | string | ✅ | Must be "kanjidic2" |
| `source.version` | string | ✅ | Semantic version |
| `source.url` | string | ✅ | Valid URL |
| `license.text` | string | ✅ | Must be "CC BY-SA 4.0" |
| `license.url` | string | ✅ | Valid CC license URL |
| `metadata.verified` | boolean | ✅ | true/false |
| `metadata.addedDate` | string | ✅ | ISO 8601 format |
| `metadata.lastUpdated` | string | ✅ | ISO 8601, >= addedDate |

---

## 📊 Expected N5 Dataset Statistics

Based on KANJIDIC2 analysis, the N5 dataset will have these characteristics:

| Metric | Expected Value | Notes |
|--------|---------------|-------|
| **Total kanji** | 80 | Community consensus N5 list |
| **Stroke range** | 1-17 strokes | Most are 1-12 strokes |
| **Grade distribution** | 70% grade 1-2, 30% grade 3+ | Elementary school kanji |
| **With on-reading** | ~75 (94%) | Most have Chinese reading |
| **With kun-reading** | ~70 (88%) | Most have Japanese reading |
| **Frequency rank** | Top 500 | Most common kanji in Japanese |
| **With examples** | ~78 (98%) | Based on current vocab dataset |
| **Avg examples/kanji** | 5.3 | Range: 0-15 example words |
| **Total SVG files** | 80 | One per kanji from KanjiVG |

---

**Status:** ✅ Schema finalized with comprehensive documentation
**Notes:**
- Schema mirrors vocab dataset structure for consistency
- Designed for easy expansion (audio, mnemonics, N4-N1)
- Bidirectional linking enables powerful UX (click kanji in word → see kanji page)
- All fields documented with validation rules, examples, and edge cases
- Performance optimizations planned with IndexedDB indexes

---

### 1.4 Generate Production Dataset

- [ ] **Run all processing scripts**
  ```bash
  cd scripts/kanji
  python 01_process_kanjidic2.py
  python 02_process_kanjivg.py
  python 03_link_vocabulary.py
  python 04_merge_dataset.py
  ```

- [ ] **Validate output**
  - Verify all 80 N5 kanji present
  - Check SVG files copied correctly
  - Ensure vocabulary links are accurate
  - Validate JSON schema

- [ ] **Update CREDITS.md**
  - Add KANJIDIC2 attribution
  - Add KanjiVG attribution
  - Include license texts
  - Link to original sources

**Status:** 🔲 Not started
**Output:** `public/seed-data/kanji_n5.json` (production-ready)

---

### 1.5 Phase 1 Completion Checklist

- [ ] All raw data downloaded and stored in `data/kanji/raw/`
- [ ] 4 processing scripts created and tested
- [ ] Final dataset `kanji_n5.json` generated (80 entries)
- [ ] 80 SVG files copied to `public/kanji/strokes/`
- [ ] CREDITS.md updated with kanji sources
- [ ] Git branch `kanji-data-fetching` ready for PR
- [ ] Documentation updated in this file

**Merge Criteria:**
- No TypeScript errors
- Dataset passes validation
- CREDITS.md legally compliant
- Code reviewed

---

## 🎨 Phase 2: UI Components & Stroke Animations
**Branch:** `kanji-ui-components`
**Goal:** Build kanji detail page with animated stroke order
**Estimated Time:** 3-4 days

### 2.1 Create Stroke Animation Component

- [ ] **Component:** `src/components/kanji/StrokeOrderAnimation.tsx`
  - Load SVG from `public/kanji/strokes/{kanji}.svg`
  - Parse SVG paths for individual strokes
  - Animate strokes sequentially using Framer Motion
  - Controls: play, pause, speed (0.5x, 1x, 2x), loop
  - Display stroke numbers on each path
  - Responsive sizing (mobile + desktop)

**Features:**
```typescript
interface StrokeOrderAnimationProps {
  kanji: string;
  svgPath: string;
  autoPlay?: boolean;
  speed?: number; // 0.5 to 2.0
  showStrokeNumbers?: boolean;
  onComplete?: () => void;
}
```

**Animation Logic:**
- Stroke 1: Draw over 800ms
- Pause 300ms
- Stroke 2: Draw over 800ms
- ...continue for all strokes
- Loop or stop based on settings

**Status:** 🔲 Not started
**Dependencies:** Phase 1 complete (SVG files available)
**Tech:** Framer Motion, SVG manipulation

---

### 2.2 Create Kanji Detail Page

- [ ] **Page:** `src/app/study/kanji/[kanji]/page.tsx`
  - Dynamic route for each kanji (e.g., `/study/kanji/日`)
  - Load kanji data from IndexedDB
  - Display all kanji information
  - Integrate stroke animation component
  - Show example vocabulary grid
  - Audio playback for example words

**Layout:**
```
┌─────────────────────────────────────┐
│  Header: 日                         │
│  Meanings: day, sun, Japan          │
│  Readings: ニチ・ジツ / ひ・か      │
│  Stroke Count: 4 | JLPT: N5         │
├─────────────────────────────────────┤
│  [ Stroke Order Animation ]         │
│  [ Controls: ▶️ ⏸ 🔁 Speed: 1x ]   │
├─────────────────────────────────────┤
│  Example Words (6 cards)            │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │今日  │ │日本  │ │毎日  │       │
│  │kyou  │ │nihon │ │mainichi│     │
│  └──────┘ └──────┘ └──────┘       │
└─────────────────────────────────────┘
```

**Status:** 🔲 Not started
**Dependencies:** 2.1 complete

---

### 2.3 Create Kanji List Page

- [ ] **Page:** `src/app/study/kanji/page.tsx`
  - Grid view of all N5 kanji (80 cards)
  - Filter by: studied, mastered, learning
  - Sort by: stroke count, frequency, progress
  - Click card → navigate to detail page
  - Show mini progress indicator per kanji

**Card Design:**
```
┌─────────┐
│    日    │  (Large kanji)
│  ニチ    │  (Primary reading)
│  day     │  (Primary meaning)
│ ●●●○○   │  (Progress: 3/5 example words known)
└─────────┘
```

**Status:** 🔲 Not started
**Dependencies:** Phase 1 complete

---

### 2.4 Create Kanji Study Mode

- [ ] **Component:** `src/components/kanji/KanjiStudyCard.tsx`
  - Similar to vocabulary flashcards
  - Front: Show kanji + prompt ("What does this mean?")
  - Back: Show meanings, readings, stroke animation
  - Quiz modes:
    - Recognition: Kanji → Meaning
    - Reading: Kanji → On/Kun readings
    - Writing: Meaning → Kanji (stroke practice)

**Status:** 🔲 Not started
**Dependencies:** 2.1, 2.2 complete

---

### 2.5 Integrate with FSRS Algorithm

- [ ] **Service:** `src/services/kanjiStudyService.ts`
  - Extend existing FSRS service for kanji cards
  - Track separate progress for each kanji
  - Schedule reviews based on performance
  - Store in IndexedDB `kanjiProgress` table

- [ ] **Database Schema:** `src/services/db/schema.ts`
  ```typescript
  interface KanjiProgress {
    id: string; // e.g., "kanji_日"
    kanji: string;
    stability: number;
    difficulty: number;
    elapsedDays: number;
    scheduledDays: number;
    reps: number;
    lapses: number;
    state: 0 | 1 | 2 | 3; // New | Learning | Review | Relearning
    lastReview: Date;
    dueDate: Date;
  }
  ```

**Status:** 🔲 Not started
**Dependencies:** Existing FSRS service (`src/services/studyService.ts`)

---

### 2.6 Phase 2 Completion Checklist

- [ ] Stroke animation component fully functional
- [ ] Kanji detail page responsive and beautiful
- [ ] Kanji list page with filtering/sorting
- [ ] Study mode integrated with FSRS
- [ ] Database schema updated
- [ ] All components TypeScript error-free
- [ ] Mobile responsive tested
- [ ] Git branch `kanji-ui-components` ready for PR

**Merge Criteria:**
- Components render correctly
- Animations smooth (60fps)
- FSRS integration tested
- No console errors
- Code reviewed

---

## 🔗 Phase 3: Integration & Polish
**Branch:** `kanji-integration`
**Goal:** Connect kanji to vocabulary, add navigation, polish UX
**Estimated Time:** 2-3 days

### 3.1 Bidirectional Kanji ↔ Vocabulary Links

- [ ] **Vocabulary Card Enhancement**
  - Add "Kanji Breakdown" section to vocab detail pages
  - Click kanji in word → navigate to kanji detail
  - Example: "今日" card shows links to "今" and "日" kanji pages

- [ ] **Kanji Page Enhancement**
  - Example words are clickable → navigate to vocab detail
  - Show which example words user has studied/mastered

**Status:** 🔲 Not started
**Dependencies:** Phase 2 complete

---

### 3.2 Navigation Updates

- [ ] **Update Main Navigation**
  - Add "Kanji" section to `/study` page
  - Show kanji progress stats on dashboard
  - Add kanji quick-access from header menu

- [ ] **Add Kanji Dashboard Widget**
  - `src/components/dashboard/KanjiProgressWidget.tsx`
  - Show: X/80 kanji studied, Y due today
  - Click → navigate to kanji study mode

**Status:** 🔲 Not started

---

### 3.3 Search & Discovery

- [ ] **Add Kanji to Search**
  - Update `src/services/searchService.ts`
  - Search kanji by: character, meaning, reading
  - Example: Search "sun" → finds "日" kanji

- [ ] **Kanji Filtering**
  - Filter by stroke count (1-4, 5-8, 9-12, 13+)
  - Filter by grade (Jouyou grade 1-6)
  - Filter by frequency (common → rare)

**Status:** 🔲 Not started

---

### 3.4 Statistics & Analytics

- [ ] **Add Kanji Metrics**
  - Total kanji studied
  - Average retention rate
  - Kanji mastered this week/month
  - Hardest kanji (most lapses)

- [ ] **Update Progress Reports**
  - Include kanji progress in weekly reports
  - Show kanji vs. vocabulary balance

**Status:** 🔲 Not started

---

### 3.5 Audio Integration (Future)

- [ ] **Kanji Reading Audio**
  - When TTS is implemented (Phase 4+)
  - Audio for on/kun readings
  - Audio for example words (already have from vocab)

**Status:** 🔲 Deferred (waiting for TTS licensing)
**Notes:** Not blocking for Phase 3 completion

---

### 3.6 Performance Optimization

- [ ] **Lazy Load SVG Files**
  - Only load SVG when animation starts
  - Cache loaded SVGs in memory

- [ ] **IndexedDB Indexing**
  - Add indexes for kanji queries
  - Optimize kanji progress lookups

- [ ] **Code Splitting**
  - Lazy load kanji components
  - Reduce initial bundle size

**Status:** 🔲 Not started

---

### 3.7 Phase 3 Completion Checklist

- [ ] Kanji ↔ Vocabulary bidirectional links working
- [ ] Navigation updated with kanji sections
- [ ] Search includes kanji
- [ ] Statistics dashboard shows kanji metrics
- [ ] Performance optimized
- [ ] All features tested on mobile
- [ ] Git branch `kanji-integration` ready for PR

**Merge Criteria:**
- All navigation flows tested
- Search returns correct results
- Performance metrics acceptable
- No regressions in existing features
- Code reviewed

---

## 📊 Progress Tracking

### Overall Completion

| Phase | Status | Progress | Branch | Merged |
|-------|--------|----------|--------|--------|
| **Phase 1:** Data Fetching | 🔲 Not started | 0% | `kanji-data-fetching` | ❌ |
| **Phase 2:** UI & Animations | 🔲 Not started | 0% | `kanji-ui-components` | ❌ |
| **Phase 3:** Integration | 🔲 Not started | 0% | `kanji-integration` | ❌ |

**Total Progress:** 0% (0/3 phases complete)

---

## 📝 Implementation Notes

### Phase 1 Notes
- **Date:** N/A
- **Status:** Not started
- **Blockers:** None
- **Decisions:** N/A

### Phase 2 Notes
- **Date:** N/A
- **Status:** Not started
- **Blockers:** Phase 1 must complete
- **Decisions:** N/A

### Phase 3 Notes
- **Date:** N/A
- **Status:** Not started
- **Blockers:** Phase 2 must complete
- **Decisions:** N/A

---

## ⚠️ Known Limitations & Future Work

### Current Limitations
- [ ] Only N5 kanji (80 characters) - N4-N1 not yet planned
- [ ] No writing practice (stroke tracing) - only visual animation
- [ ] No mnemonics (can be added via AI generation later)
- [ ] No kanji composition/radicals breakdown (advanced feature)

### Future Enhancements (Post-Phase 3)
- [ ] **Phase 4:** N4 Kanji (168 characters)
- [ ] **Phase 5:** Writing practice with touch/mouse tracing
- [ ] **Phase 6:** AI-generated mnemonics
- [ ] **Phase 7:** Radical breakdown and etymology
- [ ] **Phase 8:** N3-N1 Kanji expansion

---

## 🎯 Success Metrics

### Phase 1 Success Criteria
- ✅ Dataset contains all 80 N5 kanji
- ✅ All SVG files present and valid
- ✅ Vocabulary links accurate (100% of example words exist)
- ✅ CREDITS.md legally compliant
- ✅ No data parsing errors

### Phase 2 Success Criteria
- ✅ Stroke animations run smoothly (60fps)
- ✅ Kanji detail page loads <500ms
- ✅ Mobile responsive (tested on 320px width)
- ✅ FSRS integration tested with 10+ review sessions
- ✅ No TypeScript errors

### Phase 3 Success Criteria
- ✅ All navigation links functional
- ✅ Search returns results <100ms
- ✅ Bidirectional links work 100% of time
- ✅ Dashboard metrics accurate
- ✅ Bundle size increase <200KB

---

## 🔄 Update Log

| Date | Phase | Update | Author |
|------|-------|--------|--------|
| 2025-01-30 | Planning | Initial plan created | Claude |

---

## 📋 Final Notes

**Important Rules:**
1. ✅ **Only update this file** - no other docs during kanji implementation
2. ✅ **Update after each task** - keep status current
3. ✅ **Document all blockers** - write why something was skipped
4. ✅ **Track all decisions** - explain technical choices
5. ✅ **One phase per branch** - clean separation of concerns

**Next Step:** Start Phase 1 by downloading KANJIDIC2 and KanjiVG data.

---

**Last Updated:** 2025-01-30 11:42 UTC
**Document Version:** 1.0.0
**Current Phase:** Planning Complete → Ready to Start Phase 1
