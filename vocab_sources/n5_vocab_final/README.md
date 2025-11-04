# N5 Vocabulary Dataset

**Production-ready N5 Japanese vocabulary dataset with JMdict integration**

Version: **v2.2.0** | Entries: **934** | JMdict Coverage: **86.4%**

---

## 📦 Quick Start

### Main Files

| File | Size | Purpose |
|------|------|---------|
| `N5_vocab_dataset_final.json` | 715 KB | **Main dataset** - Use this in your app |
| `807_JMDICT_ENTRIES_TABLE.md` | 89 KB | Human-readable reference table |
| `807_jmdict_entries.csv` | 91 KB | Spreadsheet-compatible format |
| `807_jmdict_entries_detailed.json` | 344 KB | Complete JSON with metadata |
| `PROJECT_DOCUMENTATION.md` | - | Full project documentation |

### Load in Your Application

```javascript
// Node.js / JavaScript
const vocab = require('./N5_vocab_dataset_final.json');
console.log(`Loaded ${vocab.metadata.totalCards} N5 vocabulary entries`);

// Python
import json
with open('N5_vocab_dataset_final.json', 'r', encoding='utf-8') as f:
    vocab = json.load(f)
print(f"Loaded {vocab['metadata']['totalCards']} N5 vocabulary entries")
```

---

## 📊 Dataset Overview

- **934 total N5 vocabulary entries**
- **807 entries (86.4%)** with full JMdict data
- **127 entries (13.6%)** without JMdict data (expressions, ます-forms, etc.)
- **Deduplicated** - No kanji/kana duplicates
- **Verified N5 level** - Non-N5 entries removed
- **Properly licensed** - CC BY-SA 3.0

---

## 📖 Entry Structure

Each vocabulary entry contains:

```json
{
  "id": "n5_vocab_0001",
  "kanji": "お兄さん",
  "kana": "おにいさん",
  "romaji": "oniisan",
  "meaning": ["older brother", "elder brother", "young man"],
  "jlptLevel": "N5",
  "partOfSpeech": ["noun (common)"],
  "tags": ["noun"],
  "examples": [],
  "audio": {
    "pronunciationUrl": "/audio/n5/n5_vocab_0001.mp3",
    "source": "pending"
  },
  "source": {
    "type": "JMdict",
    "jmdict_id": "1234567",
    "url": "http://www.edrdg.org/jmdict/j_jmdict.html",
    "additional_kanji": []
  },
  "license": {
    "text": "CC BY-SA 3.0",
    "url": "https://creativecommons.org/licenses/by-sa/3.0/"
  }
}
```

---

## 🔍 Data Sources

1. **Tanos N5 List** - http://www.tanos.co.uk/jlpt/jlpt5/vocab/
2. **MLC Japanese N5 PDF** - https://www.mlcjapanese.co.jp/Download/Vocabulary_of_JLPT_N5.pdf
3. **JMdict/EDICT** - http://ftp.edrdg.org/pub/Nihongo/
4. **User's original Vercel list** - 1,426 words (deduplicated)

---

## ✅ What Was Done

1. ✅ **Deduplication** - Removed 479 kanji/kana duplicates (33.6%)
2. ✅ **Normalization** - Removed 30 redundant ます-forms
3. ✅ **JMdict Extraction** - 86.4% coverage with full data
4. ✅ **Bug Fix** - Fixed critical homonym matching issue
5. ✅ **Quality Review** - Removed 3 non-N5 entries
6. ✅ **Enhancement** - Added 20 essential N5 words

---

## 📜 License

**CC BY-SA 3.0** (Creative Commons Attribution-ShareAlike 3.0)

### Required Attribution

```
Dictionary data from JMdict/EDICT
© Electronic Dictionary Research and Development Group
http://www.edrdg.org/jmdict/j_jmdict.html
License: CC BY-SA 3.0
```

---

## 📚 Documentation

See **`PROJECT_DOCUMENTATION.md`** for:
- Complete processing methodology
- Version history
- Quality assurance details
- Technical specifications
- Known limitations
- Usage recommendations

---

## 🎯 Usage Examples

### Filter Entries with JMdict Data

```javascript
const jmdictEntries = vocab.vocabulary.filter(
  entry => entry.source.type === 'JMdict'
);
console.log(`${jmdictEntries.length} entries with full JMdict data`);
// Output: 807 entries with full JMdict data
```

### Get All Verbs

```javascript
const verbs = vocab.vocabulary.filter(
  entry => entry.tags.includes('verb')
);
console.log(`${verbs.length} verbs in dataset`);
```

### Search by Kana

```javascript
function findByKana(kana) {
  return vocab.vocabulary.find(entry => entry.kana === kana);
}

const word = findByKana('おにいさん');
console.log(word.meaning); // ["older brother", "elder brother", "young man"]
```

---

## 📈 Statistics

| Metric | Value |
|--------|-------|
| Total Entries | 934 |
| JMdict Coverage | 807 (86.4%) |
| Kanji Entries | 747 (80.0%) |
| Kana-Only | 187 (20.0%) |
| Nouns | ~583 |
| Verbs | ~246 |
| Adjectives | ~92 |
| Adverbs | ~98 |
| Particles | ~58 |

---

## 🔄 Version History

**v2.2.0** (2025-11-02) - Current
- Added 20 new N5 entries
- Final count: 934 entries

**v2.1.0** (2025-11-02)
- Removed 3 non-N5 entries
- Simplified tables

**v2.0.1** (2025-11-02)
- Fixed homonym matching bug
- Strict kanji+kana matching

**v2.0.0** (2025-11-02)
- Initial release
- Deduplication & normalization

---

## 🚀 Next Steps (Optional)

1. **Add Example Sentences** - Populate `examples` field from N5 sentence corpus
2. **Generate Audio** - Create pronunciation audio files
3. **Add Remaining 127 Entries** - Manual definitions for non-JMdict words
4. **Create N4 Dataset** - Continue with next JLPT level

---

## 📧 Contact

For questions or issues with this dataset, please refer to the `PROJECT_DOCUMENTATION.md` file for detailed information.

---

**Generated:** 2025-11-02  
**Status:** ✅ Production Ready  
**License:** CC BY-SA 3.0
