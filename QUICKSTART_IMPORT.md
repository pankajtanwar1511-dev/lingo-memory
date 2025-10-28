# Quick Start: Import Vocabulary

**Get 800 N5 cards in 5 minutes!**

---

## Step 1: Download JMdict

```bash
# Create data directory
mkdir -p data/source

# Download JMdict (simplified JSON format)
curl https://jmdict-simplified-api.herokuapp.com/ -o data/source/jmdict.json
```

**Alternative:** Download from https://github.com/scriptin/jmdict-simplified

---

## Step 2: Preview Import (Dry Run)

```bash
# See what will be imported (no files created)
npm run import:jmdict -- \
  --input data/source/jmdict.json \
  --level N5 \
  --dry-run
```

**You should see:**
```
✅ Loaded 170,000+ entries from JMdict
Filtering for JLPT N5...
Found 800 N5 entries
✅ Import complete:
   Imported: 800
   Skipped: 0
```

---

## Step 3: Import N5 Cards

```bash
# Import all N5 vocabulary to JSON file
npm run import:jmdict -- \
  --input data/source/jmdict.json \
  --level N5 \
  --output data/n5-imported.json
```

**Output:** `data/n5-imported.json` with 800 N5 vocabulary cards

---

## Step 4: Check the Output

```bash
# View first card
cat data/n5-imported.json | jq '.cards[0]'
```

**Expected output:**
```json
{
  "id": "n5_001234",
  "kanji": "食べる",
  "kana": "たべる",
  "meaning": "to eat",
  "examples": [],
  "tags": ["verb", "ichidan"],
  "jlptLevel": "N5",
  "partOfSpeech": ["verb"],
  "license": {
    "text": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0/"
  }
}
```

---

## Step 5: Import with Frequency Sorting (Optional)

```bash
# Import top 200 most common N5 words
npm run import:jmdict -- \
  --input data/source/jmdict.json \
  --level N5 \
  --max 200 \
  --frequency data/frequency-sample.json \
  --sort-freq \
  --output data/n5-common-200.json
```

**Note:** For full frequency sorting, download Leeds Corpus or BCCWJ (see `data/README.md`)

---

## Common Commands

### Import All JLPT Levels

```bash
# N5 (800 cards)
npm run import:jmdict -- --input data/source/jmdict.json --level N5 --output data/n5.json

# N4 (600 cards)
npm run import:jmdict -- --input data/source/jmdict.json --level N4 --output data/n4.json

# N3 (600 cards)
npm run import:jmdict -- --input data/source/jmdict.json --level N3 --output data/n3.json

# N2 (800 cards)
npm run import:jmdict -- --input data/source/jmdict.json --level N2 --output data/n2.json

# N1 (1200 cards)
npm run import:jmdict -- --input data/source/jmdict.json --level N1 --output data/n1.json
```

### Import Essential Vocabulary Only

```bash
# Top 100 essential N5 words
npm run import:jmdict -- \
  --input data/source/jmdict.json \
  --level N5 \
  --max 100 \
  --frequency data/frequency-sample.json \
  --sort-freq \
  --output data/n5-essential-100.json
```

---

## Troubleshooting

### "File not found" error
```
❌ ERROR: File not found: data/source/jmdict.json
```
**Solution:** Download JMdict first (Step 1)

### "No entries found"
```
Found 0 N5 entries
```
**Solution:** JMdict file may not have JLPT tags. Try without `--level` to import all.

### "ts-node: command not found"
```
❌ ERROR: ts-node: command not found
```
**Solution:** Run `npm install` to install dependencies

---

## Next Steps

After importing cards:

1. **Add Example Sentences** (Day 2)
   - Use Tatoeba sentence matcher
   - Add 2-3 examples per card

2. **Generate Audio** (Day 3)
   - Use Google Cloud TTS
   - Create audio files for all cards

3. **Validate Quality** (Day 4)
   - Run quality checks
   - Review and approve cards

4. **Import to Database** (Day 5+)
   - Import to IndexedDB
   - Sync to Firestore

---

## Need Help?

- **Full Documentation:** `docs/DAY11_JMDICT_BATCH_IMPORT.md`
- **Data Sources:** `data/README.md`
- **CLI Help:** `npm run import:jmdict -- --help`

---

**Quick Reference Card:**

```bash
# Preview
npm run import:jmdict -- --input FILE --level N5 --dry-run

# Import
npm run import:jmdict -- --input FILE --level N5 --output OUT.json

# With frequency
npm run import:jmdict -- --input FILE --level N5 --frequency FREQ.json --sort-freq

# Help
npm run import:jmdict -- --help
```

---

**Estimated time:** 5 minutes to import 800 N5 cards ⚡
