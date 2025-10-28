# Japanese TTS Alternatives Comparison (2025)

## Legal Issue with Current Setup

**Current:** Using `edge-tts` Python library to access Microsoft Edge's TTS API
**Problem:** This is an **unofficial API access** without explicit commercial license
**Risk Level:** HIGH for commercial use, MEDIUM for redistribution

---

## Alternative Solutions

### 1. VOICEVOX ⭐ **RECOMMENDED**

**License:** Free, open source
**Quality:** ⭐⭐⭐⭐⭐ (AI-based, natural sounding)
**Commercial Use:** ✅ YES (with attribution per character)

**Pros:**
- Highest quality output (AI-based neural TTS)
- Multiple character voices
- Emotional expression control
- Active development
- Windows, Mac, Linux support
- Python API available

**Cons:**
- Requires attribution for each character voice
- Some characters require 400,000¥ license for no-attribution commercial use
- Larger file size (~500MB+ install)

**License Details:**
- Software itself: MIT License (free commercial use)
- Character voices: Individual licenses (most require attribution)
- Example: Zundamon voice requires credit like "Voice: Zundamon (VOICEVOX)"

**Implementation:**
```python
from voicevox_core import VoicevoxCore

core = VoicevoxCore(open_jtalk_dict_dir="path/to/dict")
audio_query = core.audio_query("こんにちは", speaker=1)
wav = core.synthesis(audio_query, speaker=1)
```

**Cost:** $0 (free)
**Best for:** Production apps willing to provide attribution

---

### 2. COEIROINK

**License:** Free for creative use
**Quality:** ⭐⭐⭐⭐ (AI-based)
**Commercial Use:** ✅ YES (with attribution, check per-voice terms)

**Pros:**
- High quality AI voices
- User-created voice models (MYCOE)
- Fine-tune intonation and emotion
- Windows, Mac, Linux

**Cons:**
- Requires checking terms per voice model
- Attribution required
- Less documentation than VOICEVOX

**Best for:** Creative projects, indie apps

---

### 3. OpenJTalk

**License:** Modified BSD License (permissive)
**Quality:** ⭐⭐ (older technology, robotic)
**Commercial Use:** ✅ YES (no restrictions)

**Pros:**
- Completely free, no attribution required
- Lightweight (~50MB)
- Well-established, stable
- No licensing concerns
- Python bindings available (`pyopenjtalk`)

**Cons:**
- Lower quality (robotic voice)
- Old technology (2018)
- Less natural than AI-based options

**Implementation:**
```python
import pyopenjtalk

text = "こんにちは"
wav = pyopenjtalk.tts(text)
pyopenjtalk.write_wav("output.wav", wav, rate=16000)
```

**Cost:** $0 (free)
**Best for:** Projects prioritizing licensing simplicity over quality

---

### 4. Azure Cognitive Services TTS (Official Microsoft)

**License:** Commercial license included with subscription
**Quality:** ⭐⭐⭐⭐⭐ (same as Edge TTS)
**Commercial Use:** ✅ YES (explicitly allowed)

**Pros:**
- Official Microsoft service
- Same high-quality voices as Edge
- Explicit commercial license
- Cloud API (no local install)
- Multiple voices

**Cons:**
- **Costs money** (~$4 per 1M characters)
- Requires API key
- Requires internet connection
- Usage tracking

**Estimated Cost for Full Dataset:**
- N5: 662 words × 3 chars avg = ~2,000 chars
- N4: 632 words × 3 chars avg = ~2,000 chars
- Examples: 3,400 sentences × 20 chars avg = 68,000 chars
- **Total: ~72,000 chars = $0.29 (one-time)**
- **Cost is minimal**, but requires Azure account + credit card

**Best for:** Commercial apps with budget, need legal certainty

---

### 5. Google Cloud TTS

**License:** Commercial license included
**Quality:** ⭐⭐⭐⭐⭐
**Commercial Use:** ✅ YES

**Pros:**
- WaveNet voices (very natural)
- Explicit commercial license
- Good documentation

**Cons:**
- Costs money (~$4-16 per 1M chars depending on voice type)
- Requires API key
- Requires internet

**Estimated Cost:** $0.29 - $1.15 for full dataset

**Best for:** Commercial apps with budget

---

## Comparison Matrix

| Solution | License Risk | Quality | Cost | Attribution | Setup Complexity |
|----------|--------------|---------|------|-------------|------------------|
| **Edge TTS (current)** | ⚠️ HIGH | ⭐⭐⭐⭐⭐ | $0 | None | Easy |
| **VOICEVOX** | ✅ LOW | ⭐⭐⭐⭐⭐ | $0 | Required | Medium |
| **COEIROINK** | ✅ LOW | ⭐⭐⭐⭐ | $0 | Required | Medium |
| **OpenJTalk** | ✅ NONE | ⭐⭐ | $0 | None | Easy |
| **Azure TTS** | ✅ NONE | ⭐⭐⭐⭐⭐ | $0.29 | None | Easy |
| **Google Cloud TTS** | ✅ NONE | ⭐⭐⭐⭐⭐ | $0.29-1.15 | None | Easy |

---

## Recommendations

### For Immediate Use (Development Phase)
**Keep Edge TTS** but add disclaimer:
- Mark all audio files with metadata: `"tts_provider": "edge-tts-unofficial", "license": "development-only"`
- Add disclaimer in app: "Audio generated using development tools"

### For Production (Choose One)

#### Best Free Option: **VOICEVOX**
- Highest quality free option
- Legal for commercial use
- Add attribution: "Voice: [Character Name] (VOICEVOX)"
- Implementation time: ~1 day

#### Best No-Attribution Option: **Azure TTS**
- ~$0.30 total cost for full dataset
- No ongoing costs (files generated once)
- Zero licensing concerns
- Implementation time: ~1 hour

#### Best Open Source: **OpenJTalk**
- Lower quality but completely free
- No attribution, no restrictions
- Simple licensing
- Implementation time: ~1 hour

---

## Implementation Plan

### Phase 1: Mark Current Audio (Immediate)
1. Update metadata in JSON files to indicate "development-only" audio
2. Add disclaimer in app settings
3. Continue using Edge TTS for development

### Phase 2: Production Audio (Before Launch)
**Option A: VOICEVOX (Recommended)**
```bash
# Install VOICEVOX
pip install voicevox-core

# Generate audio with attribution
python scripts/generate-voicevox-audio.py
```

**Option B: Azure TTS**
```bash
# Set up Azure account + API key
export AZURE_TTS_KEY="your-key"
export AZURE_TTS_REGION="japaneast"

# Generate audio (one-time $0.30 cost)
python scripts/generate-azure-audio.py
```

**Option C: OpenJTalk**
```bash
# Install OpenJTalk
pip install pyopenjtalk

# Generate audio (lower quality)
python scripts/generate-openjtalk-audio.py
```

---

## Decision Matrix

Choose based on your priorities:

**Priority: Quality + Free → VOICEVOX**
- Add attribution text to each flashcard
- Example: "Audio by VOICEVOX (Zundamon)"

**Priority: No Attribution + Minimal Cost → Azure TTS**
- One-time $0.30 payment
- Generate all audio once, commit to repo

**Priority: Simplicity + Open Source → OpenJTalk**
- Accept lower quality
- Zero licensing concerns

**Priority: Best Quality + Budget → Google WaveNet**
- $1.15 one-time cost
- Highest quality available

---

## Next Steps

1. ✅ Mark current Edge TTS audio as "development-only" in metadata
2. ⏳ Choose production TTS solution (recommend VOICEVOX or Azure)
3. ⏳ Create generation script for chosen solution
4. ⏳ Regenerate all audio files with legal provider
5. ⏳ Add proper attribution/credits

---

## Credits & Attribution

If using VOICEVOX, add to CREDITS.md:
```
## Audio Generation

Audio generated using VOICEVOX (https://voicevox.hiroshiba.jp/)
Voice: [Character Name]
License: [Character-specific license]
```

If using OpenJTalk, add to CREDITS.md:
```
## Audio Generation

Audio generated using Open JTalk
License: Modified BSD License
```
