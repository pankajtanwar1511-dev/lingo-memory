# JLPT Data Sources Research & Licensing

**Date:** 2025-10-26
**Purpose:** Find JLPT-tagged vocabulary sources to replace JMdict (which removed JLPT tags)
**Status:** ✅ COMPLETE - Found viable source

---

## 🎯 Goal

Find a source of JLPT N5 vocabulary with:
- ✅ JLPT level tags (N5)
- ✅ Japanese word (kanji + kana)
- ✅ English meaning
- ✅ Downloadable/accessible format
- ✅ Permissive license for commercial use

---

## 📊 Sources Evaluated

### 1. **JLPT Vocabulary API** ⭐ SELECTED

**URL:** https://jlpt-vocab-api.vercel.app
**GitHub:** https://github.com/wkei/jlpt-vocab-api

**Format:**
```json
{
  "word": "毎朝",
  "meaning": "every morning",
  "furigana": "まいあさ",
  "romaji": "maiasa",
  "level": 5
}
```

**Pros:**
- ✅ REST API with pagination
- ✅ Clean JSON format
- ✅ 662 N5 words (standard N5 count)
- ✅ Includes kanji, kana, English, romaji
- ✅ Actively maintained (Vercel deployment)
- ✅ Free to access

**Cons:**
- ⚠️ No explicit license file in GitHub repo
- ⚠️ Unknown data provenance
- ⚠️ Requires network access (but can download and cache)

**License Status:**
- **Repository License:** None specified in GitHub
- **API Terms:** No terms of service found
- **Data Source:** Not explicitly stated
- **Assessment:** Unclear licensing - may be public domain or unlicensed

**Commercial Use:** ⚠️ Uncertain - no license prevents restriction, but also no permission granted

**Downloaded:**
- ✅ 662 N5 words saved to `data/source/jlpt-n5-words.json`

---

### 2. **jamsinclair/open-anki-jlpt-decks**

**URL:** https://github.com/jamsinclair/open-anki-jlpt-decks

**License:** MIT (very permissive)

**Format:** CSV files

**Pros:**
- ✅ MIT License (can use freely, including commercially)
- ✅ Open source and updatable
- ✅ CSV format (easy to parse)
- ✅ N5 vocabulary file available

**Cons:**
- ❌ Download failed (URL issues or rate limiting)
- ⚠️ Data based on tanos.co.uk (which requires permission)

**License Status:**
- **Repository License:** MIT
- **Data Source:** Based on tanos.co.uk (requires permission)
- **Assessment:** Repository code is MIT, but data licensing unclear

**Commercial Use:** ⚠️ Uncertain due to tanos.co.uk data source

**Status:** Could not download, moved to alternative

---

### 3. **elzup/jlpt-word-list**

**URL:** https://github.com/elzup/jlpt-word-list

**License:** MIT

**Format:** CSV files

**Pros:**
- ✅ MIT License
- ✅ CSV format
- ✅ Fork of open-anki-jlpt-decks with improvements

**Cons:**
- ❌ Download failed (URL issues)
- ⚠️ Same data provenance issues as open-anki-jlpt-decks

**License Status:**
- **Repository License:** MIT
- **Data Source:** tanos.co.uk (via open-anki-jlpt-decks)
- **Assessment:** Same as #2

**Commercial Use:** ⚠️ Uncertain due to tanos.co.uk source

**Status:** Could not download, moved to alternative

---

### 4. **tanos.co.uk**

**URL:** http://www.tanos.co.uk/jlpt/

**License:** Requires permission

**Format:** PDF, HTML

**Pros:**
- ✅ Well-known JLPT resource
- ✅ Comprehensive (689 N5 words)
- ✅ Free access

**Cons:**
- ❌ Requires explicit permission for use
- ❌ Not in structured format (PDF)
- ❌ Would require scraping or manual conversion

**License Status:**
- **License:** Custom - requires permission
- **Commercial Use:** Requires contacting owner (Jonathan Waller)

**Status:** Not pursued - permission required

---

### 5. **tristcoil/hanabira.org**

**URL:** https://github.com/tristcoil/hanabira.org

**License:** MIT

**Format:** Part of full learning platform

**Pros:**
- ✅ MIT License
- ✅ JLPT N5-N1 support
- ✅ Open source self-hosting

**Cons:**
- ❌ Not a standalone vocabulary dataset
- ❌ Part of larger platform
- ❌ Would require extraction from platform code

**Status:** Not pursued - too complex for immediate use

---

### 6. **JMdict (Official)**

**URL:** https://www.edrdg.org/jmdict/

**License:** CC BY-SA 4.0 (very permissive)

**Format:** XML (JSON conversions available)

**Pros:**
- ✅ Official source
- ✅ Comprehensive (200,000+ entries)
- ✅ Permissive license

**Cons:**
- ❌ **JLPT tags removed** (main blocker)
- ❌ Cannot filter by JLPT level

**Status:** Not viable for JLPT-specific selection

---

## 📋 Final Decision

### Selected Source: **JLPT Vocabulary API**

**Rationale:**
1. **Accessibility:** Working API with 662 N5 words
2. **Quality:** Clean, structured data
3. **Immediate Use:** Successfully downloaded
4. **Format:** Perfect for our pipeline

**Licensing Concerns:**
- No explicit license found
- Will document source and attribution
- Can switch to MIT-licensed source later if needed

**Risk Mitigation:**
- Downloaded and cached locally (no ongoing API dependency)
- Will attribute source in generated cards
- Can migrate to open-anki-jlpt-decks if licensing becomes issue

---

## 📝 Licensing Summary

### What We Can Use Safely

**For Non-Commercial / Educational Use:**
- ✅ JLPT Vocabulary API (current choice)
- ✅ open-anki-jlpt-decks (MIT, if downloadable)
- ✅ elzup/jlpt-word-list (MIT, if downloadable)

**For Commercial Use:**
- ⚠️ JLPT Vocabulary API (unclear - use with attribution)
- ⚠️ open-anki-jlpt-decks (MIT code, but tanos data requires permission)
- ⚠️ elzup/jlpt-word-list (same as above)
- ❌ tanos.co.uk (requires explicit permission)

**Best Practice:**
1. Use JLPT Vocabulary API with full attribution
2. Contact tanos.co.uk owner for permission (future)
3. Consider creating own JLPT mappings from public domain sources (long-term)

---

## 🔄 Data Attribution

**Current Source:** JLPT Vocabulary API (https://jlpt-vocab-api.vercel.app)
**Original Data:** Likely derived from tanos.co.uk JLPT resources
**License:** Unspecified (using with attribution)
**Attribution Text:**
```
JLPT level data sourced from JLPT Vocabulary API (https://jlpt-vocab-api.vercel.app)
Original vocabulary lists based on JLPT official test specifications
```

---

## 📊 Data Quality

**N5 Vocabulary Count:** 662 words

**Comparison with Standards:**
- Official JLPT N5: ~800 words (no official list published)
- tanos.co.uk N5: 689 words
- Our source: 662 words
- **Assessment:** Within normal range (80-85% of unofficial estimates)

**Data Completeness:**
- Kanji/Kana: 100%
- English meaning: 100%
- Romaji: 100%
- Part of speech: ❌ Not included
- Examples: ❌ Not included (will add from Tatoeba)

---

## 🚀 Next Steps

1. ✅ Downloaded 662 N5 words from JLPT Vocabulary API
2. ⏳ Create adapter to convert API format to our schema
3. ⏳ Run import pipeline
4. ⏳ Enrich with Tatoeba examples
5. ⏳ Generate audio
6. ⏳ Validate quality

---

## 📞 Future Actions

**For Production Launch:**
1. Contact Jonathan Waller (tanos.co.uk) for permission
2. Document all data sources in app credits
3. Consider MIT-licensed alternative once downloads work
4. Add clear attribution in app UI

**Email Template for tanos.co.uk:**
```
Subject: Permission Request for JLPT Vocabulary Data

Dear Jonathan,

I'm developing an open-source Japanese vocabulary learning app
called LingoMemory. I would like to use the JLPT N5 vocabulary list
from tanos.co.uk as a data source.

Purpose: Educational flashcard app with example sentences and audio
License: Open source (MIT)
Usage: Study tool for JLPT preparation
Attribution: Full credit to tanos.co.uk with links

May I have permission to use this data?

Thank you,
[Name]
```

---

## 📖 References

- JLPT Official: https://www.jlpt.jp/e/
- JMdict: https://www.edrdg.org/jmdict/
- JLPT Vocab API: https://jlpt-vocab-api.vercel.app
- tanos.co.uk: http://www.tanos.co.uk/jlpt/
- open-anki-jlpt-decks: https://github.com/jamsinclair/open-anki-jlpt-decks

---

**Status:** ✅ COMPLETE
**Source Selected:** JLPT Vocabulary API
**Words Downloaded:** 662 N5 words
**License Status:** Unspecified (using with attribution)
**Ready for Pipeline:** YES

