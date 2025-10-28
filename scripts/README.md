# Scripts Directory

This directory contains data processing and utility scripts.

## Structure

```
scripts/
├── verification/     # AI verification scripts (Python)
├── deprecated/       # Old audio scripts (not in use)
└── README.md        # This file
```

## Verification Scripts (verification/)

**Active Python scripts for AI verification:**

- `split_for_ai_verification.py` - Split data into batches for Claude
- `prepare_verification_prompt.py` - Generate Claude-ready prompts
- `analyze_verification_results.py` - Analyze verification statistics
- `categorize_verified_examples.py` - Sort by quality

**Usage:**
```bash
cd scripts/verification

# Split data into batches
python3 split_for_ai_verification.py --input ../../data/examples.json

# Prepare prompts
python3 prepare_verification_prompt.py --batch 01

# Analyze results
python3 analyze_verification_results.py --results-dir ../../data/verification/results

# Categorize examples
python3 categorize_verified_examples.py --results ../../data/verification/results
```

## Deprecated Scripts (deprecated/)

**Old audio generation scripts (not in use):**

These scripts were used for audio generation experiments with Edge TTS but have been deprecated due to licensing concerns. They are kept for reference only.

- `generate-audio-edge.ts/js` - Edge TTS audio generation
- `generate-audio.ts` - Generic audio generation
- `generate-audio-tts.ts` - Google Cloud TTS
- `link-audio-urls.ts` - Link audio files to vocabulary
- `upload-audio.ts` - Upload audio to CDN
- `check-audio-progress.sh` - Monitor audio generation
- `generate-n4-audio.sh` - Generate N4 audio batch

**Status:** ⚠️ Not for production use (licensing issues)

Future audio generation will use properly licensed LLM-based TTS solutions.

## TypeScript Scripts

TypeScript scripts are run via package.json scripts:
```bash
# See package.json for available scripts
npm run <script-name>
```

## Related

- Data verification: `data/verification/`
- Production examples: `data/production/`
- Tools: `tools/` (HTML utilities)
