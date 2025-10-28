# AI Verification Workflow

## Overview

You now have 38 ready-to-use verification prompts for Claude AI to verify all 1,871 N5 example sentences.

## What's Been Prepared

```
data/ai-verification-batches/
├── batch_01_of_38.json ... batch_38_of_38.json   (Raw data - 38 files)
├── PROMPT_BATCH_01.md ... PROMPT_BATCH_38.md     (Ready prompts - 38 files)
├── INDEX.json                                     (Batch index)
├── README.md                                      (Documentation)
├── VERIFICATION_PROMPT_TEMPLATE.md                (Template file)
└── VERIFICATION_WORKFLOW.md                       (This file)
```

## Verification Process

### Step 1: Verify Each Batch

For each batch (1-38):

1. **Open prompt file**: `PROMPT_BATCH_01.md`
2. **Copy entire contents** (Ctrl+A, Ctrl+C)
3. **Paste into Claude AI** (claude.ai or API)
4. **Wait for JSON results**
5. **Save results** as `RESULTS_BATCH_01.json`

**Estimated time**: 2-3 minutes per batch (2-3 hours total for all 38)

### Step 2: Collect Results

Save all Claude responses in this structure:

```
data/ai-verification-results/
├── RESULTS_BATCH_01.json
├── RESULTS_BATCH_02.json
...
└── RESULTS_BATCH_38.json
```

### Step 3: Compile Results (Script Coming Next)

After collecting all results, run:
```bash
python3 scripts/compile_verification_results.py
```

This will:
- Parse all 38 result files
- Generate summary statistics
- Identify ACCEPT/REVIEW/REJECT counts
- Create filtered dataset with only accepted examples
- Generate report on gaps requiring new examples

## Expected Output Format from Claude

Each batch should return a JSON array like:

```json
[
  {
    "card_id": "n5_vocab_0001",
    "example_index": 0,
    "verification": {
      "target_vocab_present": "YES",
      "target_vocab_notes": "毎朝 appears clearly in correct context",
      "kana_accuracy": "ACCURATE",
      "kana_notes": "Perfect match",
      "n5_grammar_check": "PASS",
      "grammar_notes": "Uses は particle, dictionary form 起きる - both N5",
      "difficulty_rating": 4,
      "difficulty_notes": "Simple grammar, common vocab, short sentence",
      "recommendation": "ACCEPT",
      "overall_notes": "Good beginner example"
    }
  },
  ...
]
```

## Quality Checks

Before moving to next batch, verify:
- ✅ All examples in batch were reviewed
- ✅ JSON is valid (can be parsed)
- ✅ All required fields present
- ✅ Recommendations are ACCEPT/REVIEW/REJECT
- ✅ Difficulty ratings are 1-10

## Batch Processing Tips

### Time Management
- Process 5-10 batches per session
- Take breaks to maintain quality
- Mark progress in README.md checklist

### Handling Edge Cases
- If Claude is unsure → should mark as REVIEW
- If grammar is borderline N5/N4 → mark as REVIEW
- Be consistent across batches

### Tracking Progress

Update this checklist as you complete batches:

```markdown
## Verification Progress

- [ ] Batch 01-05: _____
- [ ] Batch 06-10: _____
- [ ] Batch 11-15: _____
- [ ] Batch 16-20: _____
- [ ] Batch 21-25: _____
- [ ] Batch 26-30: _____
- [ ] Batch 31-35: _____
- [ ] Batch 36-38: _____
```

## What Happens Next

After verification complete:

1. **Compile Results**: Aggregate all 38 batch results
2. **Generate Report**:
   - Total: ACCEPT / REVIEW / REJECT counts
   - Difficulty distribution
   - Kana accuracy statistics
   - Grammar pattern issues
3. **Filter Dataset**: Keep only ACCEPT examples
4. **Identify Gaps**: Which vocab cards need new examples?
5. **Character Universe**: Create contextual examples for gaps
6. **Deploy**: Update production with verified dataset

## Need Help?

### Regenerate Single Prompt
```bash
python3 scripts/prepare_verification_prompt.py 5
```

### Regenerate All Prompts
```bash
python3 scripts/prepare_verification_prompt.py all
```

### Check Original Data
```bash
cat data/ai-verification-batches/batch_01_of_38.json | jq '.examples[0]'
```

---

**Current Status**: All 38 prompts ready for verification
**Next Step**: Start with PROMPT_BATCH_01.md
**Goal**: Verify all 1,871 examples for N5 appropriateness
