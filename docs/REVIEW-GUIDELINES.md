# Example Sentence Review Guidelines

This document provides guidelines for human reviewers to validate AI-generated or flagged example sentences.

---

## 📋 Review Process Overview

All examples marked with `needsReview: true` must be reviewed before production use. This includes:
- AI-generated examples (Claude, GPT-4)
- Tatoeba examples flagged by validation (word mismatch, length violations)
- Custom examples added manually

---

## ✅ Review Criteria (5-Point Checklist)

### 1. Word Usage Correctness
**Check:** Does the sentence use the target word in its correct meaning?

- ✅ **APPROVE** if word meaning matches vocabulary definition
- ❌ **REJECT** if word is used with different meaning
- ⚠️ **REWRITE** if close but context is unclear

**Example:**
- Target: いい (good)
- ✅ GOOD: "天気がいいです" (The weather is good)
- ❌ BAD: "いいえ、違います" (No, it's different) - uses いいえ, not いい

---

### 2. Natural Wording
**Check:** Is the sentence natural Japanese that natives would actually say?

- ✅ **APPROVE** if phrasing sounds natural and conversational
- ❌ **REJECT** if awkward, unnatural, or machine-translated feeling
- ⚠️ **REWRITE** if grammatically correct but unnatural

**Common Issues:**
- Overly formal for casual context
- Literal translations from English
- Missing particles
- Unnatural word order

---

### 3. Appropriate JLPT Level
**Check:** Does the sentence match the target JLPT level grammar and vocabulary?

**Level Guidelines:**
- **N5:** Only です/ます form, present tense preferred, basic particles (は、を、に、で)
- **N4:** Past tense OK, て-form OK, basic conjunctions (から、けど)
- **N3:** Conditionals OK, casual form acceptable

- ✅ **APPROVE** if grammar matches level
- ❌ **REJECT** if grammar too advanced
- ⚠️ **REWRITE** to simplify grammar

**Example for N5:**
- ✅ GOOD: "今日は暑いです" (Simple present, です-form)
- ❌ BAD: "今日暑かったら、泳ぎに行こう" (Conditional + volitional = too advanced)

---

### 4. Correct Kana/Kanji
**Check:** Are kana readings correct? Is kanji usage appropriate for level?

- ✅ **APPROVE** if readings and kanji are correct
- ❌ **REJECT** if wrong readings or inappropriate kanji
- ⚠️ **REWRITE** to fix readings or replace complex kanji

**Guidelines:**
- N5: Minimal kanji, provide hiragana readings
- N4: Basic kanji OK, complex readings need furigana
- Verify readings match target word exactly

---

### 5. English Translation Accuracy
**Check:** Is the English translation accurate and helpful for learners?

- ✅ **APPROVE** if translation is accurate and clear
- ❌ **REJECT** if translation is wrong or misleading
- ⚠️ **REWRITE** to improve clarity

**Good translations:**
- Natural English (not literal)
- Convey the Japanese meaning
- Use simple vocabulary for beginners

---

## 🎯 Decision Matrix

| Action | When to Use | Next Step |
|--------|-------------|-----------|
| **APPROVE** | Passes all 5 criteria | Set `needsReview: false` |
| **REJECT** | Fails 2+ criteria or critical error | Delete example entirely |
| **REWRITE** | Fixable issue (1 criterion fails) | Edit and mark `needsReview: false` |
| **FLAG** | Uncertain, need native speaker | Mark `reviewFlag: needs-native-check` |

---

## 📝 Review CSV Format

Use the provided `review_tasks.csv` template:

```csv
card_id,example_index,japanese,kana,english,suggested_action,reviewer_comments,reviewed_by,review_date
n5_jlpt_0030,0,今日はたいへん暑いです,きょうはたいへんあついです,It's very hot today,approve,Natural and appropriate for N5,reviewer_name,2025-01-15
n5_jlpt_0036,0,毎朝シャワーをあびます,まいあさシャワーをあびます,I take a shower every morning,approve,Good example of あびる usage,reviewer_name,2025-01-15
n5_jlpt_0078,0,スプーンを使いますか,スプーンをつかいますか,Do you use a spoon?,rewrite,Consider simpler: スプーンはありますか,reviewer_name,2025-01-15
```

**Columns:**
- `card_id`: Vocabulary card ID (e.g., n5_jlpt_0030)
- `example_index`: Example number (0-based)
- `japanese`: Japanese sentence
- `kana`: Full kana reading (for verification)
- `english`: English translation
- `suggested_action`: approve / reject / rewrite / flag
- `reviewer_comments`: Explanation of decision
- `reviewed_by`: Reviewer name/ID
- `review_date`: Date reviewed (YYYY-MM-DD)

---

## 🔄 Workflow

### For Batch Review

1. **Export examples for review:**
   ```bash
   python3 scripts/export-review-tasks.py \
     --input data/n5-with-generated-examples.json \
     --output review/n5-review-tasks.csv
   ```

2. **Review using spreadsheet software** (Excel, Google Sheets)
   - Sort by `suggested_action` (blank = needs review)
   - Fill in `suggested_action` for each row
   - Add `reviewer_comments` explaining decisions

3. **Import reviewed decisions:**
   ```bash
   python3 scripts/import-review-results.py \
     --input data/n5-with-generated-examples.json \
     --review-csv review/n5-review-tasks-reviewed.csv \
     --output public/seed-data/n5-comprehensive-reviewed.json
   ```

### For Individual Review (Manual)

1. Open dataset JSON file
2. Search for `"needsReview": true`
3. Review using 5-point checklist
4. Update fields:
   - Change `needsReview: false` if approved
   - Delete example entirely if rejected
   - Edit japanese/english if rewritten
5. Save file

---

## 📊 Quality Targets

**Minimum Acceptance Criteria:**
- **Approval Rate:** ≥80% for AI-generated examples
- **Rejection Rate:** ≤10%
- **Rewrite Rate:** ≤20%

**If approval rate <80%:**
- Review LLM prompts in `generate-missing-examples.py`
- Adjust constraints (length, grammar level)
- Consider different model or provider

---

## 🌐 Resources for Reviewers

### Grammar References
- **N5 Grammar:** https://jlptsensei.com/jlpt-n5-grammar-list/
- **N4 Grammar:** https://jlptsensei.com/jlpt-n4-grammar-list/
- **Particle Guide:** https://www.tofugu.com/japanese-grammar/particle-wa/

### Dictionary Resources
- **Jisho.org:** English-Japanese dictionary
- **Weblio:** Japanese-Japanese (for natural usage)
- **Forvo:** Pronunciation check

### When Uncertain
- Check usage on **Tatoeba.org** (search target word)
- Consult **HiNative** for natural phrasing questions
- Mark as `FLAG` and get native speaker review

---

## ⚠️ Common Pitfalls to Avoid

### 1. Word Homonyms
Be careful with words that have multiple meanings:
- はし: bridge (橋) vs chopsticks (箸) vs edge (端)
- かく: write (書く) vs draw (描く) vs lack (欠く)

**Solution:** Verify context matches vocabulary meaning

### 2. Particle Errors
- ❌ 学校は行きます (wrong: は)
- ✅ 学校に行きます (correct: に)

**Solution:** Check particle usage carefully

### 3. Politeness Level Mismatch
- N5 should use です/ます form (polite)
- Don't use casual form (だ/である) until N3

**Solution:** Verify formality matches JLPT level

### 4. Regional Variations
- Prefer standard Tokyo dialect
- Avoid regional expressions (Kansai-ben, etc.)

**Solution:** When in doubt, check if phrase is standard

### 5. Context-Dependent Words
Some words need specific context:
- いただきます (only before meals)
- お疲れ様です (only after work/effort)

**Solution:** Ensure context is appropriate

---

## 📈 Tracking Review Progress

Create a simple tracking sheet:

| Dataset | Total Examples | Needs Review | Approved | Rejected | Rewritten | Completion % |
|---------|---------------|--------------|----------|----------|-----------|--------------|
| N5      | 1,744         | 376          | 0        | 0        | 0         | 0%           |
| N4      | 2,398         | 366          | 0        | 0        | 0         | 0%           |

**Target:** 100% reviewed before production launch

---

## 👥 Review Team Recommendations

**Ideal Review Team:**
- 1 Native Japanese speaker (final approval)
- 1-2 Advanced learners (JLPT N2+) for initial review
- 1 Beginner learner (N5-N4) for clarity check

**Time Estimates:**
- ~30 seconds per example for straightforward cases
- ~2 minutes per example for complex decisions
- **Total:** ~8-10 hours for all 742 generated examples

---

## 📞 Questions?

If you encounter difficult cases:
1. Mark as `FLAG` in CSV
2. Document the issue in `reviewer_comments`
3. Escalate to native speaker reviewer
4. Update this guide with learnings

---

**Last Updated:** January 2025
**Version:** 1.0
