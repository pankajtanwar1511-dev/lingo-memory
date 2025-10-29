# Data Improvement Plan for LingoMemory

## Executive Summary

**Current Status**:
- 662 N5 vocabulary cards total
- Only 154 cards (23.3%) have example sentences
- 408 total examples across enriched cards
- Zero real audio files (all placeholders)

**Critical Finding**: The low coverage is NOT due to missing data in the corpus. The Tatoeba corpus contains abundant examples for even the words without examples. A **critical bug** in the enrichment script is preventing proper matching.

**Total Character Count**: 5,378 characters (2,173 vocab + 3,205 examples)

---

## Problem Analysis

### Issue 1: Critical Bug in Enrichment Script ⚠️ HIGH PRIORITY

**Location**: `scripts/enrich-sentences-streaming.ts:73-79` vs `lines 280-281`

**Problem**:
```typescript
// Step 1: Individual kanji ARE added to search vocabulary (lines 73-79)
for (const char of card.kanji) {
  if (char !== ' ') {
    words.add(char)  // ✅ "遊" added
  }
}

// Step 2: Matches found correctly during streaming (line 124)
if (trimmedText.includes(word)) {  // ✅ Matches "遊んで", "遊び", etc.
  matches.set(id, { word: "遊", ... })  // Stores individual kanji
}

// Step 3: BUG - Individual kanji NOT added to cardWords (lines 280-281)
const cardWords = new Set([card.kana])
if (card.kanji) cardWords.add(card.kanji)
// ❌ Missing: Individual kanji characters not added!

// Step 4: Match fails (line 286)
if (cardWords.has(match.word)) {  // cardWords has "遊ぶ", match.word is "遊"
  // ❌ FALSE - No match!
}
```

**Evidence**:
- Word "遊ぶ" (asobu - to play) has 108 matches in Tatoeba corpus
- Word "寒い" (samui - cold) has 274 matches in Tatoeba corpus
- Both cards have ZERO examples in final output
- Short sentences exist: "遊びましょう", "寒い。", "一緒に遊ばない？"

**Fix**:
```typescript
// In enrichCards function around line 280
const cardWords = new Set([card.kana])
if (card.kanji) {
  cardWords.add(card.kanji)
  // ADD THIS:
  for (const char of card.kanji) {
    if (char !== ' ') {
      cardWords.add(char)
    }
  }
}
```

**Expected Impact**: Coverage should jump from 23.3% to **50-70%** with this fix alone.

---

### Issue 2: Sentence Length Too Restrictive

**Current Setting**: `maxLength = 25` characters

**Analysis**:
- Most current examples are 6-12 characters (very short)
- Many natural N5 sentences are 25-40 characters
- Longer sentences often have better context

**Recommendation**: Increase to `maxLength = 40` or even `50`

**Trade-off**: Longer sentences may be harder for beginners, but provide better context

---

### Issue 3: No Conjugation Handling

**Problem**: Script only matches exact forms in sentences
- Searches for: "遊ぶ" (dictionary form)
- Misses: "遊んで" (te-form), "遊びます" (polite), "遊ばない" (negative)

**Current Workaround**: Individual kanji matching (once bug fixed) will catch most conjugations

**Future Enhancement**: Integrate MeCab morphological analyzer
- npm packages available: `@enjoyjs/node-mecab`, `mecab-async`
- Would normalize conjugations to dictionary form
- Requires MeCab system installation

**Priority**: LOW (individual kanji matching is 80% solution)

---

## Audio Generation Strategy

### Option Comparison

| Service | Cost | Free Tier | Quality | Pros | Cons |
|---------|------|-----------|---------|------|------|
| **Google Cloud TTS (Neural2)** | $16/1M chars | 1M/month forever | Excellent | Best voices, generous free tier | Requires GCP account |
| **Amazon Polly (Neural)** | $16/1M chars | 1M for 12 months | Excellent | AWS ecosystem | Limited free period |
| **VOICEVOX** | FREE | Unlimited | Good | Open source, privacy | Requires Docker setup, API server |

### Cost Calculation

**Current Dataset**:
- 662 vocab words (kana): 2,173 characters
- 408 example sentences: 3,205 characters
- **Total**: 5,378 characters = **$0.09 with Neural voices**

**Target (100% coverage with 3 examples each)**:
- 662 vocab words: 2,173 characters
- 1,986 example sentences (~15 chars avg): ~9,000 characters
- **Total**: ~11,000 characters = **$0.18 with Neural voices**

### Recommendation: Google Cloud TTS (Neural2)

**Rationale**:
1. **Completely FREE** - 1M free tier covers this project 90x over
2. **Best quality** - Natural-sounding Japanese voices
3. **Simple API** - Easy integration with Node.js
4. **No infrastructure** - Cloud-based, no Docker/server needed

**Implementation**:
```bash
npm install @google-cloud/text-to-speech
```

**Script structure**:
```typescript
// scripts/generate-audio.ts
// For each vocab card + example sentence:
//   1. Call Google TTS API
//   2. Save MP3 file to public/audio/{level}/{id}.mp3
//   3. Update seed data with audioUrl field
```

**Timeline**: 1-2 days for script + generation

---

## Implementation Roadmap

### Phase 1: Fix Critical Bug (IMMEDIATE - 1 hour)

**Priority**: 🔴 CRITICAL
**Impact**: 23.3% → 50-70% coverage
**Effort**: 30 minutes coding + 30 minutes testing

**Steps**:
1. Modify `scripts/enrich-sentences-streaming.ts` line ~280
2. Add individual kanji characters to cardWords
3. Re-run enrichment: `npm run enrich:stream`
4. Validate output
5. Regenerate seed data: `jq` command to add license, remove audioUrl
6. Test in app

**Success Criteria**:
- 遊ぶ card has examples
- 寒い card has examples
- Coverage ≥ 50% (331+ cards with examples)

---

### Phase 2: Optimize Sentence Length (1 hour)

**Priority**: 🟡 HIGH
**Impact**: Additional 10-15% coverage improvement
**Effort**: 15 minutes coding + 45 minutes regeneration

**Steps**:
1. Modify `enrich-sentences-streaming.ts`: `maxLength = 40`
2. Re-run enrichment
3. Analyze sentence length distribution
4. Adjust if needed (try 50 if still too restrictive)

**Success Criteria**:
- Coverage ≥ 60% (397+ cards)
- Example lengths 6-40 characters
- Sentences still beginner-appropriate

---

### Phase 3: Generate Audio Files (1-2 days)

**Priority**: 🟢 MEDIUM
**Impact**: Makes app usable for learning
**Effort**: 4-6 hours (script writing + generation + testing)

**Steps**:
1. Set up Google Cloud TTS account + credentials
2. Write `scripts/generate-audio.ts`:
   ```typescript
   - Load n5-comprehensive.json
   - For each card.kana + card.examples[].japanese:
     - Generate audio via TTS API
     - Save to public/audio/n5/{id}.mp3
     - Add audioUrl to card/example
   - Save updated JSON
   ```
3. Run generation (will take ~30 mins for 1,000+ requests)
4. Validate audio files (spot check 20-30 files)
5. Update seed data
6. Test in app

**Success Criteria**:
- All 662 vocab words have audio
- All examples have audio
- Audio plays correctly in flashcard component
- Files are reasonable size (10-50KB each)

---

### Phase 4: Advanced Matching (Future - Optional)

**Priority**: 🔵 LOW
**Impact**: 70% → 85%+ coverage
**Effort**: 8-16 hours (research + integration + testing)

**Approach 1: Hiragana Fallback**
- Also search for kana-only forms in corpus
- Example: Search "あそぶ" when kanji is "遊ぶ"
- Simple implementation, moderate impact

**Approach 2: MeCab Integration**
- Install MeCab + npm wrapper
- Tokenize Tatoeba sentences during streaming
- Extract base forms (辞書形) for matching
- Complex but handles all conjugations

**Decision Point**: Re-evaluate after Phase 1+2. If coverage reaches 65-70%, this may not be needed.

---

## Quality Assurance

### Validation Checklist After Each Phase

- [ ] All cards pass Zod schema validation
- [ ] No console errors when loading vocabulary page
- [ ] Example sentences are grammatically correct
- [ ] Example sentences use the vocabulary word
- [ ] Audio files play without errors
- [ ] Audio pronunciation is accurate
- [ ] Coverage metrics calculated and documented

### Testing Scenarios

1. **Load vocabulary page** - All 662 cards visible
2. **Filter by has examples** - Correct count matches stats
3. **Click card** - Examples display properly
4. **Play audio** - Vocab word audio plays
5. **Play example audio** - Example sentence audio plays
6. **Study mode** - Cards cycle properly with audio

---

## Success Metrics

### Target Goals (After All Phases)

| Metric | Current | Phase 1 | Phase 2 | Phase 3 | Notes |
|--------|---------|---------|---------|---------|-------|
| Cards with examples | 154 (23%) | 397 (60%) | 464 (70%) | 464 (70%) | Target: ≥60% |
| Total examples | 408 | ~1,200 | ~1,400 | ~1,400 | Avg 3 per card |
| Cards with audio | 0 (0%) | 0 (0%) | 0 (0%) | 662 (100%) | Target: 100% |
| Examples with audio | 0 (0%) | 0 (0%) | 0 (0%) | ~1,400 (100%) | Target: 100% |
| Audio cost | $0 | $0 | $0 | $0 | Free tier sufficient |

### Validation Queries

```bash
# Check coverage
jq '[.vocabulary[] | select(.examples | length > 0)] | length' public/seed-data/n5-comprehensive.json

# Check audio files
find public/audio/n5 -name "*.mp3" | wc -l

# Check example distribution
jq '[.vocabulary[] | .examples | length] | group_by(.) | map({count: .[0], cards: length})' public/seed-data/n5-comprehensive.json

# Validate schema
npm run validate:quality
```

---

## Cost & Timeline Summary

| Phase | Priority | Effort | Timeline | Cost |
|-------|----------|--------|----------|------|
| 1. Fix Bug | Critical | 1 hour | Today | $0 |
| 2. Optimize Length | High | 1 hour | Today | $0 |
| 3. Generate Audio | Medium | 4-6 hours | 1-2 days | $0 (free tier) |
| 4. Advanced (Optional) | Low | 8-16 hours | Future | $0 |
| **TOTAL** | - | **6-8 hours** | **2-3 days** | **$0** |

---

## Recommendations

### Immediate Actions (Next Session)

1. **Fix the enrichment bug** (Phase 1)
   - This is the single highest impact change
   - Will immediately improve coverage 2-3x
   - Takes only 1 hour

2. **Re-evaluate after bug fix**
   - Check actual coverage improvement
   - If ≥60%, proceed to audio generation
   - If <60%, do Phase 2 (sentence length)

3. **Generate audio files** (Phase 3)
   - Set up Google Cloud TTS (free tier)
   - Run generation script
   - User can start actually using the app for learning

### Long-term Considerations

- **Phase 4 (MeCab)** likely not needed if Phases 1+2 achieve 65%+ coverage
- **Monitor audio costs** - Should stay free, but set up billing alerts
- **Consider Tatoeba updates** - Corpus is actively maintained, could re-enrich quarterly
- **Expand to N4** - Once N5 pipeline is perfected, replicate for N4 level

---

## Appendix: Technical Details

### Bug Reproduction

```bash
# Show cards without examples
jq '[.vocabulary[] | select(.examples | length == 0) | {id, kanji, kana}] | .[0:10]' \
  public/seed-data/n5-comprehensive.json

# Verify words exist in corpus
grep "遊ぶ" data/tatoeba/jpn_sentences.tsv | wc -l  # Result: 108
grep "寒い" data/tatoeba/jpn_sentences.tsv | wc -l  # Result: 274

# Check short sentences
grep "遊" data/tatoeba/jpn_sentences.tsv | awk -F'\t' 'length($3) <= 25' | head -10
```

### Enrichment Script Analysis

**Key Functions**:
- `extractVocabularyWords()` (lines 60-84): ✅ Correctly adds individual kanji
- `findMatchingSentences()` (lines 89-150): ✅ Correctly matches sentences
- `enrichCards()` (lines 252-318): ❌ BUG - Doesn't add individual kanji to cardWords

### Google Cloud TTS Setup

```bash
# 1. Create GCP project
# 2. Enable Text-to-Speech API
# 3. Create service account + download JSON key
# 4. Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json

# 5. Install SDK
npm install @google-cloud/text-to-speech

# 6. Test
node -e "
  const tts = require('@google-cloud/text-to-speech');
  const client = new tts.TextToSpeechClient();
  // Test synthesis...
"
```

---

**Document Version**: 1.0
**Created**: 2025-10-27
**Author**: Claude Code Analysis
**Status**: Ready for Implementation
