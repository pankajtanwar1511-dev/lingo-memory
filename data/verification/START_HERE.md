# N5 Example Verification - START HERE

## What's Ready

All preparation work is **COMPLETE**. You now have everything needed to verify the 1,871 N5 example sentences using Claude AI.

## Quick Summary

```
✅ 1,871 examples split into 38 batches (~50 each)
✅ 38 ready-to-use verification prompts created
✅ Comprehensive verification criteria prepared
✅ Results directory created
✅ Helper scripts ready
```

## Files You'll Use

### 1. Verification Prompts (Ready to Copy-Paste)
```
data/ai-verification-batches/
├── PROMPT_BATCH_01.md  ← Start here!
├── PROMPT_BATCH_02.md
├── PROMPT_BATCH_03.md
...
└── PROMPT_BATCH_38.md
```

### 2. Save Results Here
```
data/ai-verification-results/
├── RESULTS_BATCH_01.json  ← Save Claude's response
├── RESULTS_BATCH_02.json
...
└── RESULTS_BATCH_38.json
```

## How to Start (3 Simple Steps)

### Step 1: Open First Prompt
```bash
# Open in your text editor
cat data/ai-verification-batches/PROMPT_BATCH_01.md
```

### Step 2: Use Claude AI
1. Go to claude.ai (or use API)
2. Copy **entire contents** of PROMPT_BATCH_01.md
3. Paste into Claude
4. Wait for verification results (JSON format)

### Step 3: Save Results
1. Copy Claude's JSON response
2. Save as `data/ai-verification-results/RESULTS_BATCH_01.json`
3. Move to next batch

## What Claude Will Verify

For each of the 50 examples in the batch, Claude will check:

### ✅ 1. Target Vocabulary Present?
- Does sentence actually contain the target word?
- Is it a false positive from substring matching?

### ✅ 2. Kana Accuracy
- Does kana reading match Japanese sentence?
- Are there any character-level errors?

### ✅ 3. N5 Grammar Only?
- Does it use ONLY N5 grammar patterns?
- Are there any N4+ patterns (conditionals, causative, passive)?

### ✅ 4. Difficulty Rating (1-10)
- How complex is this within N5 range?
- Helps with proper sequencing for learners

### ✅ 5. Recommendation
- **ACCEPT**: Good quality, keep for production
- **REVIEW**: Borderline, needs human review
- **REJECT**: Not N5-appropriate, discard

## Expected Output Format

Claude will return JSON like this:

```json
[
  {
    "card_id": "n5_vocab_0001",
    "example_index": 0,
    "verification": {
      "target_vocab_present": "YES",
      "target_vocab_notes": "毎朝 clearly present in correct context",
      "kana_accuracy": "ACCURATE",
      "kana_notes": "Perfect character-by-character match",
      "n5_grammar_check": "PASS",
      "grammar_notes": "Uses は particle and dictionary form - both N5",
      "difficulty_rating": 4,
      "difficulty_notes": "Simple grammar, common vocabulary, short sentence",
      "recommendation": "ACCEPT",
      "overall_notes": "Excellent beginner example"
    }
  },
  ... (49 more examples)
]
```

## Time Estimate

- **Per batch**: 2-3 minutes
- **Total (38 batches)**: 2-3 hours
- **Recommended**: Process 5-10 batches per session

## What Happens After?

Once all 38 batches are verified:

1. **Compile Results**: Aggregate all verification data
2. **Generate Report**:
   - How many ACCEPT / REVIEW / REJECT?
   - What's the difficulty distribution?
   - Which vocab cards need more examples?
3. **Filter Dataset**: Keep only accepted examples
4. **Identify Gaps**: Find vocab with insufficient examples
5. **Character Universe**: Create new examples for gaps
6. **Deploy**: Update production with verified dataset

## Key Files Reference

### Primary Files
- `START_HERE.md` (this file) - Overview and quick start
- `VERIFICATION_WORKFLOW.md` - Detailed workflow guide
- `VERIFICATION_PROMPT_TEMPLATE.md` - Template used for all prompts
- `PROMPT_BATCH_01.md` through `PROMPT_BATCH_38.md` - Ready prompts

### Helper Scripts
- `scripts/split_for_ai_verification.py` - Already run, created batches
- `scripts/prepare_verification_prompt.py` - Already run, created prompts
- `scripts/compile_verification_results.py` - (Coming next, after results collected)

### Data Files
- `public/seed-data/n5-comprehensive.json` - Original production data
- `data/ai-verification-batches/batch_XX_of_38.json` - Raw batch data
- `data/ai-verification-results/RESULTS_BATCH_XX.json` - Your saved results

## Current Data Stats

```
Total vocabulary cards:     662
Cards with examples:        552 (83.4%)
Cards without examples:     110 (16.6%)
Total examples to verify: 1,871
```

### Examples Distribution
```
0 examples: 110 cards (need new content)
1 example:   12 cards (need more examples)
2 examples:  15 cards
3 examples: 409 cards ← majority
4 examples:  40 cards
5 examples:  14 cards
6 examples:  62 cards
```

## Questions?

### Regenerate a prompt?
```bash
python3 scripts/prepare_verification_prompt.py 5
```

### Check batch contents?
```bash
cat data/ai-verification-batches/batch_01_of_38.json | head -50
```

### View original data?
```bash
cat public/seed-data/n5-comprehensive.json | jq '.vocabulary[0]'
```

---

## 🚀 Ready to Start!

**Next Action**: Open `PROMPT_BATCH_01.md` and paste into Claude AI

**Goal**: Verify all 1,871 examples for true N5 appropriateness

**Result**: High-quality, pedagogically-sound example dataset
