# Audio Generation Setup Guide

## Overview

This guide walks you through setting up Google Cloud Text-to-Speech for generating audio files for your LingoMemory vocabulary cards and example sentences.

**Cost**: **FREE** - Your usage (11,000 characters) is covered by Google's 1M free tier 90x over!

---

## Option 1: Google Cloud TTS (Recommended - FREE)

### Prerequisites

- Google account
- Credit card (required for verification, but won't be charged for free tier)
- ~15-20 minutes setup time

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Project name: `lingomemory-tts` (or any name you prefer)
4. Click "Create"
5. Wait for project creation (~30 seconds)

### Step 2: Enable Text-to-Speech API

1. In the search bar, type "Text-to-Speech API"
2. Click on "Cloud Text-to-Speech API"
3. Click "Enable"
4. Wait for API to be enabled (~1 minute)

### Step 3: Create Service Account

1. Go to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"
3. Service account details:
   - Name: `lingomemory-audio-generator`
   - Description: "Audio generation for LingoMemory app"
4. Click "Create and Continue"
5. Grant role: "Cloud Text-to-Speech Client"
6. Click "Continue" → "Done"

### Step 4: Create and Download Key

1. Find your service account in the list
2. Click the three dots (⋮) → "Manage keys"
3. Click "Add Key" → "Create new key"
4. Key type: JSON
5. Click "Create"
6. **Save the downloaded JSON file securely!** (e.g., `~/keys/lingomemory-tts-key.json`)

### Step 5: Set Environment Variable

**Linux/Mac:**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/keys/lingomemory-tts-key.json"

# Add to ~/.bashrc or ~/.zshrc to make it permanent:
echo 'export GOOGLE_APPLICATION_CREDENTIALS="$HOME/keys/lingomemory-tts-key.json"' >> ~/.bashrc
```

**Windows (PowerShell):**
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\YourName\keys\lingomemory-tts-key.json"

# To make it permanent, add it to System Environment Variables
```

### Step 6: Install Google Cloud TTS Library

```bash
cd /home/pankaj/bumble/lingomemory
npm install @google-cloud/text-to-speech
```

### Step 7: Test Setup (Dry Run)

```bash
npm run generate:audio -- --dry-run
```

**Expected output:**
```
🎙️  Audio Generation with Google Cloud TTS
   Input: public/seed-data/n5-comprehensive.json
   Output: public/audio/n5
   Dry run: true

✅ Google Cloud TTS client initialized

🎤 Generating vocabulary audio...
  [DRY RUN] Would generate: n5_jlpt_0001.mp3 (まいあさ)
  ...
```

### Step 8: Generate Actual Audio

```bash
npm run generate:audio
```

This will generate:
- 662 vocabulary audio files in `public/audio/n5/`
- ~1,368 example audio files in `public/audio/n5/examples/`

**Time estimate**: ~15-30 minutes (API rate limits apply)

---

## Option 2: VOICEVOX (Free, Open Source, Offline)

### Prerequisites

- Docker installed
- ~2GB disk space
- Local machine (runs on your computer)

### Step 1: Run VOICEVOX via Docker

```bash
docker run -d -p 50021:50021 \
  --name voicevox \
  voicevox/voicevox_engine:cpu-ubuntu20.04-latest
```

### Step 2: Verify VOICEVOX is Running

```bash
curl http://localhost:50021/version
```

Should return version info.

### Step 3: Use Alternative Script

```bash
npm run generate:audio:voicevox
```

**Note**: Script needs to be created for VOICEVOX (not implemented yet).

---

## Option 3: Browser TTS (Quick Test, Lower Quality)

For quick testing without setup:

```bash
npm run generate:audio:browser
```

Uses Web Speech API (browser-based, no credentials needed, but lower quality).

**Note**: Script needs to be created (not implemented yet).

---

## Adding Audio URLs to Seed Data

After audio files are generated, update the seed data with audio URLs:

```bash
npm run link:audio
```

This will:
1. Scan `public/audio/n5/` for generated files
2. Add `audioUrl` fields to vocabulary cards
3. Add `audioUrl` fields to example sentences
4. Update `public/seed-data/n5-comprehensive.json`

---

## Verification

### Check Generated Files

```bash
# Count vocabulary audio files
find public/audio/n5 -name "*.mp3" -not -path "*/examples/*" | wc -l
# Expected: 662

# Count example audio files
find public/audio/n5/examples -name "*.mp3" | wc -l
# Expected: ~1,368

# Check file sizes (should be 10-50KB each)
ls -lh public/audio/n5/*.mp3 | head -10
```

### Test in Browser

1. Start dev server: `npm run dev`
2. Open http://localhost:3000/vocabulary
3. Click on a vocabulary card
4. Click the speaker icon 🔊
5. Audio should play!

---

## Cost Monitoring

### Google Cloud Free Tier

- **Free tier**: 1 million characters/month (Neural voices)
- **Your usage**: ~11,000 characters
- **Headroom**: 90x coverage!
- **After free tier**: $16 per 1 million characters

### Set Up Billing Alerts (Optional)

1. Go to Google Cloud Console → Billing
2. "Budgets & alerts"
3. Create budget: $1.00
4. Set alert at 50%, 90%, 100%
5. You'll get email if you somehow exceed free tier

---

## Troubleshooting

### Error: "GOOGLE_APPLICATION_CREDENTIALS not set"

**Solution**: Make sure environment variable is set:
```bash
echo $GOOGLE_APPLICATION_CREDENTIALS
# Should show path to your JSON key file
```

### Error: "Permission denied" or "API not enabled"

**Solution**:
1. Check Text-to-Speech API is enabled in Google Cloud Console
2. Verify service account has "Cloud Text-to-Speech Client" role

### Error: "Quota exceeded"

**Solution**:
1. Wait 1 minute (rate limit is per-minute)
2. Add delay between requests in script
3. Check if you actually exceeded 1M free tier (unlikely!)

### Audio files are too quiet/loud

**Solution**: Adjust `audioConfig` in `scripts/generate-audio-tts.ts`:
```typescript
audioConfig: {
  audioEncoding: 'MP3',
  speakingRate: 0.9,  // 0.5 = slower, 1.5 = faster
  pitch: 0.0,         // -20.0 to 20.0
  volumeGainDb: 3.0,  // Increase volume
}
```

### Want different voice?

Available Japanese Neural2 voices:
- `ja-JP-Neural2-B` - Female (default)
- `ja-JP-Neural2-C` - Male
- `ja-JP-Neural2-D` - Male

Change in `scripts/generate-audio-tts.ts` line 67.

---

## NPM Scripts Reference

Add these to `package.json`:

```json
{
  "scripts": {
    "generate:audio": "ts-node --project tsconfig.scripts.json scripts/generate-audio-tts.ts",
    "link:audio": "ts-node --project tsconfig.scripts.json scripts/link-audio-urls.ts"
  }
}
```

---

## Next Steps

1. Complete Google Cloud setup (Steps 1-6 above)
2. Run dry-run to test: `npm run generate:audio -- --dry-run`
3. Generate actual audio: `npm run generate:audio`
4. Link audio URLs: `npm run link:audio`
5. Test in app!
6. Celebrate! 🎉

---

**Questions?** Check the [Google Cloud TTS Documentation](https://cloud.google.com/text-to-speech/docs)
