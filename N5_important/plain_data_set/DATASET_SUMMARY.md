# N5 Vocabulary Complete Dataset Summary

**Date Created:** 2025-11-04  
**Source:** All entries from comparison_analysis.md (6 tables)  
**JMdict Source:** vocab_sources/JMdict_e.gz

---

## Dataset Statistics

| Metric | Original (N5_vocab_dataset_final.json) | Complete (N5_vocab_complete.json) |
|--------|----------------------------------------|-----------------------------------|
| **Total Entries** | 2 | 890 |
| **File Size** | 612 KB | 344 KB |
| **Source** | N5 core vocabulary only | All tables in comparison_analysis.md |

---

## Complete Dataset Breakdown

### Total: 890 entries

**Matching Status:**
- ✅ Matched in JMdict: 881 entries (98.9%)
- ⚠️ Not found in JMdict: 9 entries (1.1%)
  - 8 する compound verbs (けっこんする, さんぽする, etc.)
  - 1 special entry (なん / なに with slash)

**Homonyms (Multiple entries for same kana):**
- 65 kana have multiple entries
- Examples:
  - あつい (3 entries): 厚い, 暑い, 熱い
  - あめ (2 entries): 雨, 飴
  - いる (2 entries): 居る, 要る
  - みる (3 entries): 看る, 見る, 観る

**Entries without Kanji:** 119 entries
- Hiragana-only words
- Katakana loanwords
- Particles and expressions

---

## Data Schema

Each entry contains:

```json
{
  "kana": "あう",              // Primary kana reading
  "kanji": "会う",             // Primary kanji (empty if none)
  "meaning": ["to meet", ...], // List of meanings (up to 5)
  "romaji": "",                // (Currently empty, can be added)
  "partOfSpeech": [...],       // JMdict POS tags
  "tags": ["verb", "godan"],   // Simplified tags (noun, verb, adjective, etc.)
  "allKana": ["あう"],         // All kana readings from JMdict
  "allKanji": ["会う", "逢う", "遭う", "遇う"]  // All kanji variants
}
```

---

## Source Tables from comparison_analysis.md

| Table | Description | Entries | Status |
|-------|-------------|---------|--------|
| **Table 1** | Perfect Match (Kana + Kanji + Meaning) | 563 | ✅ Included |
| **Table 2** | Kana + Kanji Match (Meaning differs) | 133 | ✅ Included (both N5 & GPT) |
| **Table 3** | Kana + Meaning Match (Kanji differs) | 56 | ✅ Included (both kanji) |
| **Table 4** | Kana Only Match (Both differ) | 47 | ✅ Included (both versions) |
| **Table 5** | Extra in ChatGPT (Missing in N5) | 41 | ✅ Included |
| **Table 6** | Missing in ChatGPT (No GPT match) | 8 | ✅ Included |

**Note:** Tables 2, 3, 4 include entries from both N5 and GPT datasets where they differ, resulting in more total entries than simple addition.

---

## Known Issues & Notes

### 9 Entries Not Found in JMdict:

These are compound する verbs not stored as combined forms in JMdict:

1. けっこんする (結婚する) - to marry
2. さんぽする (散歩する) - to stroll
3. せんたくする (洗濯する) - to wash laundry
4. そうじする (掃除する) - to clean
5. でんわする (電話する) - to make a phone call
6. べんきょうする (勉強する) - to study
7. りょこうする (旅行する) - to travel
8. れんしゅうする (練習する) - to practice
9. なん / なに (何) - what (special notation with slash)

**Note:** The noun forms (結婚, 散歩, 洗濯, etc.) ARE in JMdict. The combined する forms are not stored as single entries.

---

## Comparison with Original Dataset

### Original (N5_vocab_dataset_final.json):
- 807 entries
- Only core N5 vocabulary
- Single source

### Complete (N5_vocab_complete.json):
- 890 entries
- Includes all variations from comparison analysis
- Multiple sources merged (N5 + ChatGPT tags)
- Handles homonyms with different kanji/meanings
- Includes extra GPT entries

**Growth:** +83 entries (10.3% increase)

---

## Data Quality

✅ **Strengths:**
- Comprehensive coverage of all comparison table entries
- Proper handling of homonyms (same kana, different kanji/meaning)
- Rich JMdict data (multiple meanings, POS tags, kanji variants)
- 98.9% JMdict match rate

⚠️ **Limitations:**
- 9 entries missing JMdict data (する compounds)
- Romaji field currently empty (can be generated if needed)
- Some GPT entries may have slightly different meanings than N5 standard

---

## Usage Recommendations

### Use Original Dataset (N5_vocab_dataset_final.json) when:
- You want only core N5 vocabulary
- You need standardized N5 meanings
- You want a smaller, focused dataset

### Use Complete Dataset (N5_vocab_complete.json) when:
- You want comprehensive vocabulary coverage
- You need to include all variations and homonyms
- You want merged N5 + ChatGPT vocabulary
- You need detailed JMdict information

---

## Files

**Location:** `N5_important/plain_data_set/`

- `N5_vocab_dataset_final.json` (612 KB) - Original 807 entries
- `N5_vocab_complete.json` (344 KB) - New 890 entries with full data

**Source:**
- `N5_important/comparison_analysis.md` - 6 comparison tables
- `vocab_sources/JMdict_e.gz` - Dictionary data

---

## Next Steps (Optional)

1. **Add Romaji:** Generate romaji for all kana entries
2. **Fix する verbs:** Manually add POS/tags for 9 missing entries
3. **Add Examples:** Link to sentence examples from n5_vocab_with_examples.db
4. **Add Audio:** Generate or link TTS audio files
5. **Create SQLite version:** Convert JSON to database for easier querying

---

*Generated: 2025-11-04*
