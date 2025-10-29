# Quality Assurance Guide

**Last Updated:** October 28, 2024

---

## Overview

LingoMemory maintains high data quality through a multi-layered validation system:

1. **Automated Validation** - Schema and consistency checks
2. **Quality Scoring** - 0-100 point scoring system
3. **Human Review** - Manual verification of AI content
4. **AI Verification** - Batch verification with Claude

---

## Automated Validation

### Schema Validation

**Tool:** Zod TypeScript validation

**What's Validated:**
- All required fields present
- Correct data types
- Valid enum values
- Field constraints (length, format)

**Example:**
```typescript
const VocabularyCardSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/),
  kanji: z.string().min(1),
  kana: z.string().min(1),
  romaji: z.string().min(1),
  meaning: z.string().min(1),
  jlptLevel: z.enum(['N5', 'N4', 'N3', 'N2', 'N1']),
  examples: z.array(ExampleSchema).min(0),
  // ...
})
```

**Run Validation:**
```bash
npm run validate:quality -- \
  --cards public/seed-data/n5-vocabulary.json \
  --output reports/validation.json
```

---

## Quality Scoring System

### Scoring Breakdown (0-100 points)

**1. Completeness (40 points)**
- Has kanji: 10 pts
- Has kana: 10 pts
- Has meaning: 10 pts
- Has JLPT level: 10 pts

**2. Examples (30 points)**
- 0 examples: 0 pts
- 1 example: 15 pts
- 2+ examples: 30 pts

**3. Audio (20 points)**
- Has audio URL: 10 pts
- Audio URL valid: 10 pts

**4. Consistency (10 points)**
- Romaji matches kana: 5 pts
- No duplicate examples: 5 pts

### Quality Tiers

**Excellent (90-100)**
- Production ready
- No issues found
- All fields complete
- 2+ high-quality examples
- Audio available

**Good (75-89)**
- Mostly production ready
- Minor issues only
- May have 1 example or missing audio

**Fair (60-74)**
- Needs review
- Missing some fields
- Example quality questionable

**Poor (0-59)**
- Not production ready
- Major issues
- Missing critical fields

---

## Human Review Guidelines

### When Human Review is Needed

- ✅ After AI-generated content (Phase 3)
- ✅ When quality score < 75
- ✅ Before major releases
- ✅ User-submitted content

### 5-Point Quality Checklist

For each example sentence, verify:

#### 1. **Word Usage Correctness**

**Question:** Is the target word used correctly?

**Check:**
- Word appears in sentence
- Usage matches the definition
- Grammar is correct
- Context is appropriate

**Example:**
```
Word: 食べる (to eat)
Good: 私は毎日魚を食べる。(I eat fish every day.)
Bad: 私は魚です。(I am fish.) ❌ Wrong word
```

#### 2. **Natural Wording**

**Question:** Does it sound like something a native speaker would say?

**Check:**
- Natural word order
- Common phrasing
- Not overly formal or casual (unless appropriate)
- No awkward constructions

**Example:**
```
Word: 好き (to like)
Good: 私は音楽が好きです。(I like music.)
Bad: 音楽は私に好きです。❌ Unnatural grammar
```

#### 3. **JLPT Level Appropriateness**

**Question:** Is the sentence at the right difficulty level?

**Check:**
- Uses vocabulary from target level or below
- Grammar patterns appropriate for level
- Not too simple (insulting) or too complex (confusing)

**N5 Guidelines:**
- Present tense verbs
- Basic particles (は、が、を、に、で、と)
- Simple adjectives
- Common nouns
- No complex grammar (causative, passive, etc.)

**Example:**
```
N5 Word: 食べる (to eat)
Good: 私は朝ごはんを食べます。(I eat breakfast.)
Bad: 食べさせられることになっていた。❌ Too complex (N2+ grammar)
```

#### 4. **Kana Correctness**

**Question:** Is the kana reading accurate?

**Check:**
- Matches kanji pronunciation
- Includes particles
- Correct okurigana (送り仮名)
- No typos

**Example:**
```
Japanese: 私は魚を食べる。
Good Kana: わたしは さかなを たべる。✓
Bad Kana: わたしは さかな たべる。❌ Missing を
```

#### 5. **Translation Accuracy**

**Question:** Is the English translation correct?

**Check:**
- Meaning preserved
- Natural English
- Not too literal
- Captures nuance

**Example:**
```
Japanese: いただきます。
Good: Thank you for the meal. (Let's eat.)
Bad: I receive. ❌ Too literal
```

---

## Review Workflow

### Step 1: Export Review Tasks

```bash
python3 scripts/phase5_export_review_tasks.py \
  --input data/n5-phase3/n5_with_generated.json \
  --output data/n5-review/review_tasks.csv
```

### Step 2: Review in Spreadsheet

Open `review_tasks.csv` in Excel or Google Sheets.

**For each row:**

1. Read the example sentence
2. Check against 5-point checklist
3. Fill in `suggested_action`:
   - `approve` - Sentence is good
   - `reject` - Sentence has major issues
   - `rewrite` - Needs minor fixes

4. If rejecting or rewriting, add `reviewer_comments` explaining why
5. Fill in `reviewed_by` (your name) and `review_date` (YYYY-MM-DD)

### Step 3: Quality Targets

**Approval Rate Target:** 80%+

- **>90% approved:** Excellent AI quality
- **80-90% approved:** Good, acceptable
- **60-80% approved:** Needs prompt improvement
- **<60% approved:** Major issues, regenerate

### Step 4: Import Reviewed Data

```bash
python3 scripts/phase6_import_reviewed.py \
  --input data/n5-phase3/n5_with_generated.json \
  --reviews data/n5-review/review_tasks_completed.csv \
  --output data/n5-v1.0.json
```

---

## AI Verification System

### Batch Verification with Claude

For large-scale verification, we use Claude to check examples in batches.

**Current Status:**
- 38 batches prepared (50 examples each)
- 15 batches completed (39%)
- 23 batches remaining (61%)

### Verification Process

1. **Open Prompt File**
   ```
   data/ai-verification-batches/PROMPT_BATCH_01.md
   ```

2. **Copy to Claude**
   - Paste entire prompt (includes data + instructions)
   - Claude analyzes all 50 examples

3. **Save Results**
   - Claude returns JSON with verdicts
   - Save as `data/ai-verification-results/RESULTS_BATCH_01.json`

4. **Repeat for Next Batch**

**Time per batch:** 5-10 minutes

### Verification Criteria (used by Claude)

```markdown
For each example, verify:
1. GRAMMAR: Correct Japanese grammar
2. NATURAL: Sounds natural to native speakers
3. LEVEL: Appropriate for JLPT level (no complex grammar)
4. KANA: Kana reading is accurate
5. TRANSLATION: English translation is accurate
6. WORD_USAGE: Target word used correctly

Return verdict:
- APPROVE: Passes all checks
- APPROVE_MINOR: Minor issues but usable
- REJECT: Major issues, unusable
```

---

## Common Issues & Fixes

### Issue: Word not in sentence

**Example:**
```
Word: 食べる (to eat)
Sentence: 私は学生です。(I am a student.)
```

**Verdict:** REJECT
**Fix:** Generate new example with correct word

---

### Issue: Wrong JLPT level

**Example:**
```
N5 Word: 食べる
Sentence: 食べさせられることになっていた。(N2+ grammar)
```

**Verdict:** REJECT
**Fix:** Simplify to N5 grammar: 私は食べました。

---

### Issue: Unnatural phrasing

**Example:**
```
Word: 好き (to like)
Sentence: 音楽は私に好きです。
```

**Verdict:** REJECT
**Fix:** 私は音楽が好きです。(Natural phrasing)

---

### Issue: Translation too literal

**Example:**
```
Japanese: お疲れ様です。
Translation: You are tired. ❌
```

**Verdict:** REJECT
**Fix:** Thank you for your hard work. / Good work.

---

### Issue: Kana typo

**Example:**
```
Japanese: 私は魚を食べる。
Kana: わたしは さかな たべる。❌ (Missing を)
```

**Verdict:** APPROVE_MINOR (fix kana)
**Fix:** わたしは さかなを たべる。

---

## Validation Reports

### Metrics Report (metrics.json)

```json
{
  "total_cards": 662,
  "cards_with_examples": 647,
  "cards_without_examples": 15,
  "error_count": 0,
  "warning_count": 15,
  "examples_from_tatoeba": 1288,
  "examples_from_ai": 0,
  "pass": true,
  "coverage": "97.7%",
  "average_score": 85.3
}
```

### Failure List (fail_list.json)

```json
{
  "errors": [],
  "warnings": [
    {
      "cardId": "n5_vocab_0036",
      "field": "examples",
      "issue": "No examples found",
      "severity": "warning"
    }
  ]
}
```

### Quality Report (quality-report.json)

```json
{
  "statistics": {
    "total": 662,
    "excellent": 500,
    "good": 140,
    "fair": 20,
    "poor": 2
  },
  "distribution": {
    "90-100": 500,
    "75-89": 140,
    "60-74": 20,
    "0-59": 2
  },
  "flagged_cards": [
    {
      "id": "n5_vocab_0650",
      "score": 55,
      "issues": ["No audio", "Only 1 example", "Kana mismatch"]
    }
  ]
}
```

---

## Best Practices

### For Reviewers

1. **Be Consistent**
   - Use same standards for all examples
   - Document decisions
   - Take breaks (fatigue affects judgment)

2. **When in Doubt**
   - Mark as "needs review" not "approve"
   - Add comments explaining concerns
   - Ask native speaker if available

3. **Focus on User Experience**
   - Will this help learners?
   - Is it clear and unambiguous?
   - Does it teach proper usage?

4. **Document Patterns**
   - Note common AI mistakes
   - Share with team
   - Improve prompts based on findings

### For Developers

1. **Automate Where Possible**
   - Schema validation (100% automated)
   - Consistency checks (automated)
   - Quality scoring (automated)

2. **Human Review for Subjective**
   - Naturalness of phrasing
   - Cultural appropriateness
   - Teaching effectiveness

3. **Iterate on Prompts**
   - If <80% approval, improve prompts
   - Test with small batches first
   - Document what works

4. **Version Control Data**
   - Tag dataset versions (v1.0, v1.1)
   - Track changes over time
   - Rollback if needed

---

## Testing Strategy

### Unit Tests

Test individual validation functions:

```typescript
describe('Quality Scorer', () => {
  it('should score complete card as excellent', () => {
    const card = createCompleteCard()
    const score = qualityScorer.scoreCard(card)
    expect(score.overall).toBeGreaterThan(90)
  })

  it('should flag missing audio', () => {
    const card = createCardWithoutAudio()
    const score = qualityScorer.scoreCard(card)
    expect(score.issues).toContainEqual(
      expect.objectContaining({category: 'audio'})
    )
  })
})
```

### Integration Tests

Test validation pipeline:

```typescript
describe('Validation Pipeline', () => {
  it('should validate full dataset', async () => {
    const dataset = await loadDataset('n5-vocabulary.json')
    const report = await validateDataset(dataset)
    expect(report.pass).toBe(true)
    expect(report.error_count).toBe(0)
  })
})
```

---

## Appendix: Review Decision Matrix

| Issue Type | Severity | Action |
|------------|----------|--------|
| Typo in kana | Minor | APPROVE_MINOR (fix typo) |
| Wrong particle | Minor | APPROVE_MINOR (fix particle) |
| Unnatural but understandable | Medium | REWRITE |
| Wrong word usage | Major | REJECT |
| Grammar error | Major | REJECT |
| Wrong JLPT level | Major | REJECT |
| Offensive content | Critical | REJECT + report |

---

**For more details:**
- `03_DATA_PIPELINE.md` - Validation in pipeline context
- `04_DATA_SCHEMA.md` - Complete schema reference
- `02_ARCHITECTURE.md` - Quality scorer service implementation
