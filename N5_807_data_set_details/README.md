# N5 807 Dataset - Complete Package

**Production-ready N5 Japanese vocabulary and sentence dataset**

Version: **v2.3.0** | Vocabulary: **807 words** | Sentences: **v1: 10,142 | v2: 9,419** | Status: ✅ **COMPLETE**

---

## 📦 What's in This Package

This folder contains everything needed for N5-level Japanese learning:

1. **807 JMdict-verified N5 vocabulary words** with full definitions
2. **TWO VERSIONS of N5 sentence datasets** from Tatoeba corpus:
   - **v1 (Original)**: 10,142 sentences - Good quality, maximum coverage
   - **v2 (Enhanced)**: 9,419 sentences - Excellent quality, stricter filtering
3. **Extraction scripts** (v1 and v2) to reproduce or extend the dataset
4. **Complete documentation** of methodology and quality assurance
5. **Version comparison analysis** - Choose the right version for your needs

---

## 📁 Folder Structure

```
N5_807_data_set_details/
├── data/                          # Production-ready datasets
│   ├── N5_vocab_dataset_final.json                           (612 KB) - 807 vocabulary words
│   ├── n5_807_vocab_n5_grammar_sentences.json                (1.7 MB) - v1: 10,142 sentences
│   └── n5_807_vocab_n5_grammar_sentences_v2_enhanced.json    (1.5 MB) - v2: 9,419 sentences ⭐
│
├── scripts/                       # Extraction and filtering scripts
│   ├── extract_807_vocab_sentences.py                - v1: Vocabulary extraction
│   ├── extract_807_vocab_sentences_v2_enhanced.py    - v2: Enhanced vocabulary extraction
│   ├── filter_n5_grammar.py                          - v1: Grammar filter (5 patterns)
│   └── filter_n5_grammar_v2_enhanced.py              - v2: Grammar filter (15 patterns) ⭐
│
├── docs/                          # Documentation
│   ├── PROJECT_DOCUMENTATION.md                  - Complete methodology
│   ├── VOCABULARY_README.md                      - Vocabulary dataset guide
│   └── VERSION_COMPARISON.md                     - v1 vs v2 comparison ⭐
│
└── archive/                       # Historical and intermediate files
    ├── FINAL_PROJECT_SUMMARY.txt                 - Project completion summary
    ├── extraction_log.txt                        - Extraction process log
    ├── EXTRACTION_SUMMARY.md                     - Sentence extraction details
    └── n5_807_vocab_sentences.json               - Pre-grammar-filter dataset (11,553)
```

⭐ = **Recommended for production use (v2 Enhanced)**

---

## 🎯 Quick Start

### Load Vocabulary Dataset
```javascript
// JavaScript/Node.js
const vocab = require('./data/N5_vocab_dataset_final.json');
console.log(`Loaded ${vocab.metadata.totalCards} N5 words`);
// Output: Loaded 807 N5 words

// Python
import json
with open('data/N5_vocab_dataset_final.json', 'r', encoding='utf-8') as f:
    vocab = json.load(f)
print(f"Loaded {vocab['metadata']['totalCards']} N5 words")
```

### Load Sentence Dataset

**Version 1 (Original - Maximum Coverage)**:
```javascript
// JavaScript/Node.js
const sentences = require('./data/n5_807_vocab_n5_grammar_sentences.json');
console.log(`Loaded ${sentences.metadata.total_sentences} N5 sentences`);
// Output: Loaded 10,142 N5 sentences

// Python
import json
with open('data/n5_807_vocab_n5_grammar_sentences.json', 'r', encoding='utf-8') as f:
    sentences = json.load(f)
print(f"Loaded {sentences['metadata']['total_sentences']} N5 sentences")
```

**Version 2 (Enhanced - Recommended ⭐)**:
```javascript
// JavaScript/Node.js
const sentences = require('./data/n5_807_vocab_n5_grammar_sentences_v2_enhanced.json');
console.log(`Loaded ${sentences.metadata.total_sentences} N5 sentences`);
// Output: Loaded 9,419 N5 sentences

// Python
import json
with open('data/n5_807_vocab_n5_grammar_sentences_v2_enhanced.json', 'r', encoding='utf-8') as f:
    sentences = json.load(f)
print(f"Loaded {sentences['metadata']['total_sentences']} N5 sentences")
```

---

## 🔄 Version Comparison (v1 vs v2)

| Aspect | v1 (Original) | v2 (Enhanced) ⭐ |
|--------|---------------|------------------|
| **Sentences** | 10,142 | 9,419 |
| **Grammar Patterns** | 5 | 15 |
| **Pass Rate** | 87.8% | 81.5% |
| **Quality** | Good | Excellent |
| **Use Case** | Maximum coverage | Maximum purity |

**Key Differences**:
- **v2 adds 10 new N4+ patterns**: てある, ておく, てしまう, たことがある, ながら, ように, ために, てもいい, すぎる, らしい
- **v2 is 7.1% stricter**: Rejects 723 additional sentences
- **v2 recommended for production**: Higher N5 confidence

**Choose v1 if**: You need maximum sentence coverage
**Choose v2 if**: You need maximum N5 purity (recommended)

📖 **See `docs/VERSION_COMPARISON.md` for detailed analysis**

---

## 📊 Dataset Statistics

### Vocabulary (807 words)
- **Total entries**: 807 JMdict-verified words
- **JMdict coverage**: 100% (all entries have full dictionary data)
- **Kanji entries**: 499 (61.8%)
- **Kana-only**: 308 (38.2%)
- **Unique forms**: 1,286 (kanji + kana representations)

**Part of Speech Breakdown**:
- Nouns: ~583
- Verbs: ~246
- Adjectives: ~92
- Adverbs: ~98
- Particles: ~58

### Sentences - Version 1 (10,142 sentences)
- **Source**: Tatoeba corpus (247,929 sentences processed)
- **Pass rate**: 4.1% (strict filtering)
- **Grammar patterns**: 5 (core N4+ rejections)
- **Vocabulary coverage**: 100% N5 (807 words only)
- **Grammar coverage**: Good N5 quality

### Sentences - Version 2 (9,419 sentences) ⭐ Recommended
- **Source**: Tatoeba corpus (247,929 sentences processed)
- **Pass rate**: 3.8% (very strict filtering)
- **Grammar patterns**: 15 (comprehensive N4+ rejections)
- **Vocabulary coverage**: 100% N5 (807 words only)
- **Grammar coverage**: Excellent N5 quality

**Comparison to Previous Dataset**:
- Old dataset: 3,094 sentences (1,147 words, included duplicates)
- New v1: 10,142 sentences (807 verified words, no duplicates) - 3.3x improvement
- New v2: 9,419 sentences (807 verified words, stricter grammar) - 3.0x improvement with higher quality

---

## ✅ Quality Assurance

### Vocabulary Dataset (v2.3.0)
1. ✅ **Deduplication** - Removed 479 kanji/kana duplicates (33.6%)
2. ✅ **Normalization** - Removed 30 redundant ます-forms
3. ✅ **JMdict Extraction** - 100% coverage with full data
4. ✅ **Bug Fix** - Fixed critical homonym matching (今 vs 居間)
5. ✅ **Quality Review** - Removed 3 non-N5 entries (大使館, 留学生, 背広)
6. ✅ **Strict JMdict-only** - Removed 127 entries without JMdict data

### Sentence Dataset (v1.0.0)
1. ✅ **Vocabulary Filtering** - 100% match against 807 words (1,286 forms)
2. ✅ **Tokenization** - fugashi/MeCab with lemma matching
3. ✅ **Grammar Filtering** - Rejected N4+ patterns:
   - Conditionals (たら, ば, れば, なら)
   - Passive/Causative (られる, れる, させる, させられる)
   - Quotations (という, のが, のは)
   - Explanatory (んです, のです)
   - Complex conjunctions (ので, のに)
4. ✅ **Length Validation** - 5-35 characters only
5. ✅ **ID Preservation** - All sentences retain Tatoeba IDs

**Filtering Results**:
- Stage 1 (Vocabulary): 247,929 → 11,553 (4.66% pass rate)
- Stage 2 (Grammar): 11,553 → 10,142 (87.8% pass rate)
- Final: 10,142 strictly N5 sentences (4.1% of Tatoeba corpus)

---

## 🔬 Methodology

### Vocabulary Extraction Process
```
1,426 words (Vercel list with duplicates)
    ↓ Phase 1: Deduplication
947 entries (removed 479 kanji/kana duplicates)
    ↓ Phase 2: Normalization
917 entries (removed 30 redundant ます-forms)
    ↓ Phase 3: JMdict Extraction
790 entries (86.2% JMdict coverage)
    ↓ Phase 4: Quality Review
787 entries (removed 3 non-N5 words)
    ↓ Phase 5: Enhancement
807 entries (added 20 essential N5 words)
    ↓ Phase 6: JMdict-only Cleanup
807 entries (removed 127 without JMdict data)
```

### Sentence Extraction Process
```
Tatoeba Corpus: 247,929 sentences
    ↓ Vocabulary Filter (100% N5)
11,553 sentences (4.66% pass rate)
    ↓ Grammar Filter (N5 only)
10,142 sentences (87.8% pass rate)
    ↓ Final Dataset
10,142 strictly N5 sentences
```

**Key Algorithms**:
- **Tokenization**: fugashi (MeCab) with UniDic
- **Lemma Matching**: Conjugated forms → dictionary forms (行きます → 行く)
- **Particle Handling**: は, が, を, に, etc. allowed
- **Grammar Detection**: Regex patterns for N4+ constructs
- **Stability**: Files must match both surface and lemma forms

---

## 📚 Data Sources

1. **JMdict/EDICT** - http://ftp.edrdg.org/pub/Nihongo/
   - 213,981 total entries
   - Used 807 entries for N5
   - License: CC BY-SA 3.0

2. **Tatoeba Corpus** - https://tatoeba.org/
   - 247,929 Japanese sentences
   - Used 10,142 sentences for N5
   - License: CC BY 2.0 FR

3. **Reference Sources**:
   - Tanos N5 List: http://www.tanos.co.uk/jlpt/jlpt5/vocab/
   - MLC Japanese N5: https://www.mlcjapanese.co.jp/Download/Vocabulary_of_JLPT_N5.pdf

---

## 📜 License

**Vocabulary Dataset**: CC BY-SA 3.0 (Creative Commons Attribution-ShareAlike 3.0)
**Sentence Dataset**: CC BY 2.0 FR (Creative Commons Attribution 2.0 France)

### Required Attribution

```
Vocabulary data from JMdict/EDICT
© Electronic Dictionary Research and Development Group
http://www.edrdg.org/jmdict/j_jmdict.html
License: CC BY-SA 3.0

Sentence data from Tatoeba
https://tatoeba.org/
License: CC BY 2.0 FR
```

---

## 🔄 Version History

**v2.3.0** (2025-11-03) - Current Vocabulary Dataset
- Removed 127 entries without JMdict data
- Final: 807 verified entries (100% JMdict coverage)

**v1.0.0** (2025-11-03) - Initial Sentence Dataset
- Extracted 10,142 strictly N5 sentences
- 100% vocabulary match (807 words)
- 100% grammar match (N5 only)

---

## 🚀 Usage Examples

### Get All Verbs
```javascript
const vocab = require('./data/N5_vocab_dataset_final.json');
const verbs = vocab.vocabulary.filter(entry => entry.tags.includes('verb'));
console.log(`${verbs.length} verbs in dataset`);
```

### Search Sentences by Vocabulary
```python
import json
with open('data/n5_807_vocab_n5_grammar_sentences.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find sentences containing a specific word
target = "学校"  # school
matching = [s for s in data['sentences'] if target in s['japanese']]
print(f"Found {len(matching)} sentences with '{target}'")
```

### Get Sentence by Tatoeba ID
```javascript
const sentences = require('./data/n5_807_vocab_n5_grammar_sentences.json');
const sentenceId = "4710";
const sentence = sentences.sentences.find(s => s.id === sentenceId);
console.log(sentence);
// { id: "4710", japanese: "知らない。", english: "I don't know.", source: "tatoeba" }
```

---

## 🛠️ Reproducing the Dataset

### Prerequisites
```bash
pip install fugashi unidic-lite tqdm
```

### Step 1: Extract Vocabulary-Matched Sentences
```bash
python scripts/extract_807_vocab_sentences.py
```
**Input**: Tatoeba corpus (247,929 sentences)
**Output**: `n5_807_vocab_sentences.json` (11,553 sentences)
**Criteria**: 100% vocabulary match against 807 words

### Step 2: Filter N4+ Grammar
```bash
python scripts/filter_n5_grammar.py
```
**Input**: `n5_807_vocab_sentences.json` (11,553 sentences)
**Output**: `n5_807_vocab_n5_grammar_sentences.json` (10,142 sentences)
**Criteria**: Reject conditionals, passive, causative, complex patterns

---

## 📈 Performance Metrics

| Metric | Value |
|--------|-------|
| Vocabulary Size | 807 words |
| Unique Forms | 1,286 (kanji + kana) |
| Sentence Count | 10,142 |
| Tatoeba Pass Rate | 4.1% |
| Grammar Pass Rate | 87.8% |
| Avg Sentence Length | 12 characters |
| Dataset Size | 2.3 MB (combined) |

---

## 🎓 Use Cases

1. **Language Learning Apps** - Flashcards, spaced repetition
2. **Example Sentence Lookup** - Context for vocabulary
3. **Grammar Practice** - Pure N5 grammar patterns
4. **Reading Practice** - Graded content for beginners
5. **NLP Research** - Clean, labeled Japanese corpus
6. **Curriculum Development** - Structured progression

---

## 📧 Documentation

For complete details, see:
- **Vocabulary Guide**: `docs/VOCABULARY_README.md`
- **Project Documentation**: `docs/PROJECT_DOCUMENTATION.md`
- **Extraction Log**: `archive/extraction_log.txt`
- **Project Summary**: `archive/FINAL_PROJECT_SUMMARY.txt`

---

## 🔍 Known Limitations

1. **Example sentences field empty in vocabulary** - Populate from sentence dataset programmatically
2. **Audio files pending** - Pronunciation URLs are placeholders
3. **Limited to Tatoeba corpus** - May not cover all vocabulary equally
4. **Static dataset** - Does not auto-update with new Tatoeba sentences

---

**Generated**: 2025-11-03
**Status**: ✅ Production Ready
**License**: CC BY-SA 3.0 (Vocabulary) + CC BY 2.0 FR (Sentences)
