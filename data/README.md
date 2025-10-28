# Data Sources for JapVocab Content

This directory contains data files and documentation for vocabulary content sources.

---

## 📁 Directory Contents

- `frequency-sample.json` - Sample frequency data (top 100 Japanese words)
- `README.md` - This file

---

## 📚 Primary Data Sources

### 1. JMdict (Japanese-Multilingual Dictionary)

**Purpose:** Primary source for vocabulary cards

**Details:**
- **Website:** https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project
- **License:** CC BY-SA 4.0
- **Size:** ~170,000 entries
- **Format:** JSON or XML
- **Features:**
  - Japanese headwords (kanji + kana)
  - English meanings
  - Part of speech tags
  - JLPT level tags (N5-N1)
  - Multiple readings
  - Usage notes

**How to Download:**

1. **Via API (Recommended for testing):**
```bash
curl https://jmdict-simplified-api.herokuapp.com/ -o jmdict.json
```

2. **Official Download:**
   - Visit: https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project
   - Download JMdict_e.gz
   - Extract and convert to JSON (or use XML parser)

3. **Alternative (Simplified JSON):**
   - GitHub: https://github.com/scriptin/jmdict-simplified
   - Pre-converted to JSON
   - Easier to work with

**Usage in JapVocab:**
```bash
npm run import:jmdict -- --input ./jmdict.json --level N5
```

---

### 2. Tatoeba Corpus (Example Sentences)

**Purpose:** Example sentences for vocabulary cards

**Details:**
- **Website:** https://tatoeba.org
- **License:** CC BY 2.0 FR
- **Size:** 300,000+ Japanese sentences
- **Format:** TSV (tab-separated values)
- **Features:**
  - Japanese sentences with English translations
  - Sentence IDs for attribution
  - Quality ratings
  - Native speaker contributions

**How to Download:**

1. **Japanese Sentences:**
```bash
curl https://downloads.tatoeba.org/exports/sentences.tar.bz2 -o sentences.tar.bz2
tar -xjf sentences.tar.bz2
# Extract Japanese sentences (jpn)
grep "^jpn" sentences.csv > sentences_jpn.tsv
```

2. **Translations (Japanese-English):**
```bash
curl https://downloads.tatoeba.org/exports/jpn-eng.tar.bz2 -o jpn-eng.tar.bz2
tar -xjf jpn-eng.tar.bz2
```

**File Format:**
```
Sentence ID	Language	Sentence Text
123456	jpn	食べる
```

**Links Format:**
```
Japanese Sentence ID	English Sentence ID
123456	654321
```

**Usage in JapVocab:**
- Day 12 will implement Tatoeba sentence matching service
- Automatically finds 2-3 example sentences per vocabulary word

---

### 3. Frequency Data

**Purpose:** Sort vocabulary by commonality (most useful words first)

**Options:**

#### **Option A: BCCWJ (Balanced Corpus of Contemporary Written Japanese)**

**Best for:** Academic accuracy

**Details:**
- **Website:** https://clrd.ninjal.ac.jp/bccwj/en/
- **License:** Academic use (check terms)
- **Size:** 100 million words
- **Quality:** ⭐⭐⭐⭐⭐ (authoritative)

**How to Obtain:**
1. Visit NINJAL website
2. Register for academic access
3. Download frequency list
4. Convert to JSON format

**Note:** May require institutional access or purchase

---

#### **Option B: Leeds Corpus**

**Best for:** Free, general-purpose use

**Details:**
- **Website:** http://corpus.leeds.ac.uk/list.html
- **License:** Free for research/education
- **Size:** Based on web content
- **Quality:** ⭐⭐⭐⭐ (reliable)

**How to Download:**
1. Visit: http://corpus.leeds.ac.uk/frqc/internet-ja.num
2. Download frequency list (text file)
3. Convert to JSON

**Conversion Script:**
```bash
# Download
curl http://corpus.leeds.ac.uk/frqc/internet-ja.num -o leeds-ja.txt

# Convert to JSON (using Python/Node.js)
# See conversion scripts in scripts/convert-frequency.ts
```

---

#### **Option C: Anime/Netflix Subtitles (Conversational)**

**Best for:** Spoken Japanese frequency

**Details:**
- **Source:** Subtitle files from anime/Netflix
- **License:** Fair use (educational purposes)
- **Quality:** ⭐⭐⭐ (good for conversational Japanese)

**How to Obtain:**
1. Download subtitle files (.srt, .ass)
2. Extract Japanese text
3. Count word frequencies
4. Generate JSON

**Tools:**
- Subtitle parsers (available on GitHub)
- MeCab for tokenization
- Custom frequency counter

---

### 4. Audio Sources

**Purpose:** Pronunciation audio for vocabulary

**Options:**

#### **Option A: Google Cloud Text-to-Speech**

**Best for:** Free tier, bulk generation

**Details:**
- **Website:** https://cloud.google.com/text-to-speech
- **Pricing:** Free tier: 1M chars/month, then $4/1M chars
- **Quality:** ⭐⭐⭐⭐ (very good)
- **Voices:** ja-JP-Standard-A/B/C/D (male/female)

**Usage:**
```bash
# Day 13 will implement audio generator using Google TTS
```

---

#### **Option B: Azure Cognitive Services TTS**

**Best for:** Premium quality, natural voices

**Details:**
- **Website:** https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/
- **Pricing:** $4-16/1M chars (depending on voice)
- **Quality:** ⭐⭐⭐⭐⭐ (excellent, most natural)
- **Voices:** ja-JP-NanamiNeural (best female), ja-JP-KeitaNeural (best male)

**Recommended for:** Top 200-500 most common words

---

#### **Option C: Forvo (Community Audio)**

**Best for:** Native speaker recordings

**Details:**
- **Website:** https://forvo.com
- **Pricing:** API access: $500/year
- **Quality:** ⭐⭐⭐⭐⭐ (real native speakers)

**Usage:**
- Link to Forvo in cards: `https://forvo.com/word/{word}/#ja`
- For premium: Use API to download recordings

---

## 🔧 Data Preparation Scripts

### Convert Frequency Data (TSV → JSON)

```typescript
// scripts/convert-frequency.ts
import * as fs from 'fs/promises'

async function convertFrequencyData(inputPath: string, outputPath: string) {
  const content = await fs.readFile(inputPath, 'utf-8')
  const lines = content.split('\n')

  const frequencyData: Record<string, number> = {}

  lines.forEach((line, index) => {
    const [rank, word, count] = line.split('\t')
    if (word && word.trim()) {
      frequencyData[word.trim()] = parseInt(rank, 10) || index + 1
    }
  })

  await fs.writeFile(
    outputPath,
    JSON.stringify(frequencyData, null, 2),
    'utf-8'
  )

  console.log(`Converted ${Object.keys(frequencyData).length} words`)
}

// Usage:
// convertFrequencyData('./leeds-ja.txt', './frequency.json')
```

---

## 📊 Data Quality Standards

### For Vocabulary Cards

- ✅ All cards must have English meaning
- ✅ All cards must have kana reading
- ✅ 90%+ should have kanji (where applicable)
- ✅ JLPT level tagged (where available)
- ✅ Part of speech specified
- ✅ Proper licensing attribution

### For Example Sentences

- ✅ 2-3 examples per card (minimum 2)
- ✅ Length: 5-25 characters (optimal)
- ✅ Grammar complexity appropriate for JLPT level
- ✅ Natural Japanese (from native speakers)
- ✅ English translation provided
- ✅ Source attribution (Tatoeba ID)

### For Audio

- ✅ Clear pronunciation
- ✅ Native or near-native speaker
- ✅ MP3 format, 128kbps+
- ✅ Normalized volume
- ✅ < 5 seconds duration

---

## 📝 License Compliance

### JMdict
- **License:** CC BY-SA 4.0
- **Attribution Required:** Yes
- **Share-Alike:** Yes
- **Commercial Use:** Allowed

**Our Attribution:**
```
Data from JMdict (https://www.edrdg.org/jmdict/j_jmdict.html)
Licensed under CC BY-SA 4.0
```

### Tatoeba
- **License:** CC BY 2.0 FR
- **Attribution Required:** Yes
- **Share-Alike:** No
- **Commercial Use:** Allowed

**Our Attribution:**
```
Example sentences from Tatoeba (https://tatoeba.org)
Licensed under CC BY 2.0 FR
Sentence ID: {tatoeba_id}
```

### Our Content License
- **License:** CC BY-SA 4.0 (inherits from JMdict)
- **Allows:** Commercial use, modification, distribution
- **Requires:** Attribution, share-alike

---

## 🚀 Quick Setup Guide

### Step 1: Download JMdict
```bash
mkdir -p data/source
cd data/source
curl https://jmdict-simplified-api.herokuapp.com/ -o jmdict.json
```

### Step 2: Download Frequency Data (Optional)
```bash
# Using Leeds Corpus
curl http://corpus.leeds.ac.uk/frqc/internet-ja.num -o leeds-ja.txt

# Convert to JSON (manual or script)
# Output: frequency.json
```

### Step 3: Download Tatoeba (Optional - for Day 12)
```bash
# Japanese sentences
curl https://downloads.tatoeba.org/exports/sentences.tar.bz2 -o sentences.tar.bz2
tar -xjf sentences.tar.bz2

# Japanese-English links
curl https://downloads.tatoeba.org/exports/jpn-eng.tar.bz2 -o jpn-eng.tar.bz2
tar -xjf jpn-eng.tar.bz2
```

### Step 4: Run Import
```bash
cd ../.. # Back to project root
npm run import:jmdict -- \
  --input ./data/source/jmdict.json \
  --level N5 \
  --frequency ./data/frequency.json \
  --sort-freq \
  --output ./data/n5-imported.json
```

---

## 📞 Support & Resources

### Helpful Links
- JMdict Documentation: https://www.edrdg.org/jmdict/j_jmdict.html
- Tatoeba API: https://tatoeba.org/en/exports
- Google TTS Docs: https://cloud.google.com/text-to-speech/docs
- Azure TTS Docs: https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/

### Community
- r/LearnJapanese: https://reddit.com/r/LearnJapanese
- Japanese Stack Exchange: https://japanese.stackexchange.com

---

**Last Updated:** 2025-10-26
**Maintainer:** JapVocab Development Team
