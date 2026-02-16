# Audio Production Guide

**Last Updated:** October 28, 2024
**Current Status:** Audio generation planned for future

---

## Current Status

### ⚠️ No Audio Currently

- Previous TTS experiments using Edge TTS have been removed (licensing concerns)
- Audio generation is **planned for future phases**
- Will use official LLM models with proper licensing

---

## Future Audio Plan

### Planned Approach

When audio generation is implemented:

1. **Use Licensed TTS Services**
   - Official LLM-based TTS models
   - Proper commercial licensing
   - High-quality natural voices

2. **Generate for Verified Content First**
   - Start with 401 verified N5 words
   - Add audio for AI-generated examples later
   - Ensure quality matches data quality

3. **Storage & Delivery**
   - Store audio files on CDN
   - Link to vocabulary cards
   - Progressive loading for performance

---

## Considerations for Future Implementation

### Quality Requirements

- Natural-sounding Japanese pronunciation
- Consistent voice across all audio
- Appropriate speed for learners
- Clear enunciation

### Technical Requirements

- MP3 format (browser compatible)
- Reasonable file sizes (<50KB per file)
- CDN delivery for performance
- Proper attribution if required

### Legal Requirements

- Fully licensed for commercial use
- Proper attribution if needed
- Terms compatible with project license

---

## Why Audio Was Removed

Previous TTS experiments used Microsoft Edge TTS via unofficial API access. This approach had licensing concerns for commercial use, so all generated audio has been removed from the project.

---

## Timeline

Audio generation will be addressed in a future phase after:
- N5 dataset completion (401 → 662 words)
- Core features stabilization
- Selection of appropriate licensed TTS service

---

**For current development:**
Focus on core features and data quality. Audio is a nice-to-have enhancement that will be added later with proper licensing.
