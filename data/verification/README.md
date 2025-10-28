# AI Verification Directory

This directory contains all files related to AI verification of vocabulary examples.

## Structure

```
verification/
├── batches/          # 38 JSON files with examples to verify (50 each)
├── results/          # 39 completed verification results
├── prompts/          # 38 ready-to-use Claude prompts
├── README.md         # This file
├── START_HERE.md     # Quick start guide
├── VERIFICATION_WORKFLOW.md        # Complete workflow
└── VERIFICATION_PROMPT_TEMPLATE.md # Prompt template
```

## Status

- **Total batches:** 38
- **Completed:** 39 (all batches verified)
- **Result:** 401/662 N5 words verified and production-ready

## Files

### Batches (batches/)
- `batch_01_of_38.json` through `batch_38_of_38.json`
- Each contains ~50 examples for verification
- Total: 1,871 examples

### Results (results/)
- `RESULTS_BATCH_01.json` through `RESULTS_BATCH_39.json`
- Contains Claude's verification verdicts
- Used to categorize examples into production/bridge/needs-correction

### Prompts (prompts/)
- `PROMPT_BATCH_01.md` through `PROMPT_BATCH_38.md`
- Ready-to-paste into Claude
- Includes data + verification instructions

## Usage

See `START_HERE.md` for quick start guide.
See `VERIFICATION_WORKFLOW.md` for complete process.

## Related

- Production ready examples: `data/production/categorized-examples/`
- Analysis scripts: `scripts/verification/`
