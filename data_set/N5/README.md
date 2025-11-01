# N5 Ultra-Pure Sentence Database

**Single Source of Truth for N5 Example Sentences**

---

## Overview

This database contains **3,094 ultra-pure N5 sentences** from Tatoeba, validated with the strictest criteria to ensure 100% beginner-friendly content.

**Created:** 2025-11-02
**Source:** Tatoeba Corpus (247,929 sentences filtered)
**Pass Rate:** 1.2% (only highest quality sentences accepted)

---

## What Makes This "Ultra-Pure"?

### Validation Criteria

Every sentence must pass ALL of these strict requirements:

1. **100% N5 Vocabulary**
   - Every word must be from the N5 vocabulary list (1,147 words)
   - Particles and auxiliaries allowed (は, が, を, に, etc.)
   - ZERO tolerance for non-N5 words

2. **100% Vocabulary Kanji**
   - Only 418 kanji from N5 vocabulary allowed
   - ZERO non-vocabulary kanji
   - Perfect alignment with what learners study

3. **N5 Grammar Only**
   - Only です/ます, て-form, basic particles
   - No N4+ grammar (たら, ば, passive, causative)

4. **Appropriate Length**
   - 5-35 characters
   - Suitable for beginners

---

## Database Statistics

### Sentence Quality
- **Total sentences:** 3,094
- **Database size:** 628KB
- **Difficulty distribution:**
  - Level 2 (very simple): 2,222 sentences (71.8%)
  - Level 3-5: 836 sentences (27.0%)
  - Level 7 (complex): 36 sentences (1.2%)

### Vocabulary Coverage
- **Total N5 vocabulary:** 662 words
- **Words with sentences:** 498 (75.2%)
- **Words needing examples:** 164 (24.8%)

### Example Extraction Results
For 275 words needing examples:
- **Words with candidates:** 148 (53.8%)
- **Total candidates found:** 986
- **Average per word:** 3.6 candidates
- **Words needing AI generation:** 127 (46.2%)

---

## Files

### Core Files (Production Use)
```
n5_sentences_ultra_pure.db       SQLite database with 3,094 sentences (628KB)
vocab_examples_candidates.json   986 candidate examples for 148 words (352KB)
extract_vocab_examples.py        Extract examples for vocabulary words
```

### Reference Data
```
reference/n5_vocab_kanji.txt     418 kanji from N5 vocabulary
reference/extract_vocab_kanji.py Script to extract kanji from vocabulary
```

### Scripts (Optional)
```
scripts/rebuild_from_tatoeba.py  Rebuild database from Tatoeba corpus
```

---

## How to Use

### Extract Examples for Vocabulary Words

```bash
python3 extract_vocab_examples.py
```

This will:
1. Load your vocabulary dataset
2. Find words needing examples
3. Search database for sentences containing each word
4. Rank candidates by quality (difficulty, vocab coverage)
5. Export to `vocab_examples_candidates.json`

### Query the Database

```python
import sqlite3

conn = sqlite3.connect('n5_sentences_ultra_pure.db')
cursor = conn.cursor()

# Find sentences containing a word
cursor.execute("""
    SELECT japanese, english, difficulty
    FROM n5_sentences
    WHERE pass=1 AND japanese LIKE '%日本%'
    ORDER BY difficulty ASC
    LIMIT 10
""")

for jpn, eng, diff in cursor.fetchall():
    print(f"[Level {diff}] {jpn}")
    print(f"          {eng}\n")
```

### Database Schema

```sql
CREATE TABLE n5_sentences (
    id TEXT PRIMARY KEY,
    japanese TEXT NOT NULL,
    english TEXT,
    source TEXT DEFAULT 'tatoeba',
    difficulty INTEGER,           -- 2-8 scale
    vocab_coverage REAL,          -- 1.0 (always 100%)
    non_vocab_kanji INTEGER,      -- 0 (always zero)
    pass INTEGER,                 -- 1 (all passed)
    created_at REAL
);
```

---

## Pedagogical Philosophy

### Why 100% N5 Vocabulary?

**For absolute beginners:**
- ✅ **100% comprehensible input** - no unknown words
- ✅ **Confidence building** - guaranteed understanding
- ✅ **Vocabulary reinforcement** - only familiar words
- ✅ **Zero frustration** - perfect for day 1 learners

**Trade-off:**
- Fewer sentences (3,094 vs 6,190 in parent set)
- Some vocabulary needs AI-generated examples
- But: **Perfect pedagogical purity**

### When to Use This Database

**Use for:**
- Teaching absolute beginners
- First reading practice materials
- Vocabulary example sentences
- Confidence-building exercises
- Content where 100% comprehension is critical

**Not suitable for:**
- Intermediate learners (too restrictive)
- Natural speech exposure (overly simplified)
- Grammar practice beyond N5

---

## Comparison: Evolution of Strictness

| Criteria | Set_1 | Set_2 | Ultra-Pure |
|----------|-------|-------|------------|
| **Sentences** | 6,040 | 6,190 | 3,094 |
| **Kanji rule** | Max 2 non-JLPT | 0 non-vocab | 0 non-vocab |
| **Vocab rule** | ≥70% N5 | ≥70% N5 | **100% N5** |
| **Words covered** | 191/275 | 198/275 | 148/275 |
| **Philosophy** | Flexible | Strict | **Purest** |

**This database (Ultra-Pure) is the strictest and most pedagogically pure.**

---

## Next Steps

### To Complete N5 Vocabulary Examples:

1. **Review 986 candidates** in `vocab_examples_candidates.json`
2. **Select best examples** for 148 words (1-2 per word)
3. **AI-generate examples** for remaining 127 words
   - Use strict prompt: "Only N5 vocabulary + particles"
   - Validate with `scripts/rebuild_from_tatoeba.py`
4. **Merge into** `public/seed-data/N5_vocab_dataset.json`

---

## Quality Statement

This is the **most pedagogically pure N5 sentence database** possible.

Every single word in every sentence is guaranteed to be:
- In the N5 vocabulary list, OR
- A Japanese particle/auxiliary

Perfect for beginners who need 100% comprehensible input.

---

## License

**Tatoeba Data:** CC BY 2.0 FR
**Scripts:** MIT License
**Database:** CC BY 2.0 FR (inherited from Tatoeba)

---

**Version:** 1.0
**Status:** ✅ Production Ready
**Recommended:** ✅ Use for N5 beginner content
