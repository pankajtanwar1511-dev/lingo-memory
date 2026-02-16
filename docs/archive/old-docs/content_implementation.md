# Content Implementation Document

**Project:** LingoMemory Content Development
**Created:** 2025-11-01
**Status:** 🔄 Active Development
**Current Focus:** Grammar, Particles, Vocabulary Completion

---

## 📖 Documentation Strategy & Lifecycle

### Active Development Tracking
This document serves as the **single source of truth** for all content features currently under development.

### Graduation Process
When a feature reaches **100% completion**, it follows this process:

1. ✅ **Create dedicated doc** - `{feature}_implementation.md`
2. ✅ **Mark as archived** - Add to "Completed Features" list
3. ✅ **Remove from this doc** - Delete the feature section
4. ✅ **Update status** - Reflect in "Currently Tracked Here" list

**Example:** Quiz system reached 98% completion → Created `quiz_implementation.md` → Removed from this doc

### Completed Features (Archived)
- ✅ **Quiz System** → See `quiz_implementation.md` (98% complete, production-ready)
  - 6 quiz modes, FSRS integration, statistics, UX optimization
- ✅ **Kanji System** → See `kanji_implementation.md` (100% complete)
  - 88 N5 kanji, stroke order animations, KANJIDIC2 + KanjiVG

### Currently Tracked Here
- 🔄 **Vocabulary** (58.5% - 387/662 N5 words)
- 🔄 **Grammar** (0% - Not started)
- 🔄 **Particles** (0% - Not started)
- 🔄 **Conjugation** (0% - Not started)
- 🔄 **Reading** (0% - Not started)
- 🔄 **Listening** (30% - Framework ready, needs audio)
- 🔄 **Gamification** (80% - Goals, streaks, bookmarks done)

### Future Standalone Docs (When 100% Complete)
- `vocabulary_implementation.md` - When vocab reaches 100%
- `grammar_implementation.md` - When grammar reaches 100%
- `particles_implementation.md` - When particles reaches 100%
- `conjugation_implementation.md` - When conjugation reaches 100%
- `reading_implementation.md` - When reading reaches 100%
- `listening_implementation.md` - When listening reaches 100%
- `gamification_implementation.md` - When gamification reaches 100%

---

## 📌 Quick Status Overview

**Implementation Sequence:** Follow numbered order below 👇

| Step | Feature | Status | Priority | Effort | Next Milestone |
|------|---------|--------|----------|--------|----------------|
| **1️⃣** | **Vocabulary** | 58.5% | 🔴 START HERE | 10 hrs | Complete N5 (662 words) |
| **2️⃣** | **Grammar** | 0% | 🔴 HIGH | 12-16 hrs | Build module (25 patterns) |
| **3️⃣** | **Particles** | 0% | 🔴 HIGH | 8-12 hrs | Build module (12 particles) |
| **4️⃣** | **Listening** | 30% | 🟡 MEDIUM | 4-8 hrs | Audio integration (662 files) |
| — | **Gamification** | 80% | 🟢 Phase 2 | 4-6 hrs | XP system, badges |
| — | **Conjugation** | 0% | 🟢 Phase 2 | 10-14 hrs | Build practice system |
| — | **Reading** | 0% | 🟢 Phase 2 | 8-12 hrs | Add passages |

**Phase 1 (Steps 1-4):** 34-46 hours → "Complete JLPT N5 Platform"
**Phase 2 (Remaining):** 22-32 hours → Enhanced features
**Total Estimated Effort:** 56-78 hours

---

## 🎯 Overall Implementation Strategy

### Phase 1: Complete N5 Core (34-46 hours) - **CURRENT FOCUS**
**Goal:** "Complete JLPT N5 Preparation Platform"

**Recommended Sequence & Reasoning:**

#### **Step 1: Complete N5 Vocabulary** (10 hours) - **START HERE**
**Priority:** 🔴 CRITICAL

**Why first:**
- ✅ Quickest win - can claim "Complete N5 Vocabulary"
- ✅ Foundation for grammar examples (grammar needs vocab)
- ✅ 71% content increase (387→662 words)
- ✅ Pipeline already works (JMdict, Tatoeba, Claude)
- ✅ Immediate user benefit (more quiz content)

**Tasks:**
1. Export 275 remaining N5 words from JMdict
2. Find/generate 550+ example sentences (2 per word)
3. Run Claude validation (quality score >4.5)
4. Update seed data JSON
5. Test quiz integration

**Outcome:** "Complete JLPT N5 Vocabulary Platform" - strong marketing claim

---

#### **Step 2: Build Grammar Module** (12-16 hours)
**Priority:** 🔴 HIGH

**Why second:**
- ✅ Most requested feature ("I know words but can't make sentences")
- ✅ Essential for JLPT N5 (25-30% of exam)
- ✅ Natural progression: Vocab → Grammar → Sentences
- ✅ Differentiates from flashcard-only apps
- ✅ Can now use 662 words in grammar examples

**Tasks:**
1. Research 25-30 N5 patterns (JGRAM.org)
2. Create grammar type definitions
3. Build database with examples
4. Add grammar quiz mode (multiple-choice, fill-in-blank)
5. Build grammar browse/search UI

**Outcome:** "Complete N5 Vocabulary + Grammar" - real learning platform

---

#### **Step 3: Build Particles Module** (8-12 hours)
**Priority:** 🔴 HIGH

**Why third:**
- ✅ Biggest beginner pain point (は vs が confusion)
- ✅ Complements grammar (particles ARE grammar)
- ✅ Quick to build (12-15 particles only)
- ✅ High value/effort ratio
- ✅ Visual comparisons highly shareable (marketing)

**Tasks:**
1. Create particle database (12-15 particles)
2. Build comparison charts (は/が, に/で, etc.)
3. Add 5+ examples per particle
4. Add particle quiz mode
5. Particle highlighting in sentences

**Outcome:** "Complete N5 Core Content" - vocab + grammar + particles

---

#### **Step 4: Audio Integration** (4-8 hours)
**Priority:** 🟡 MEDIUM

**Why fourth:**
- ✅ Listening is 25% of JLPT exam
- ✅ Makes platform feel "complete"
- ✅ VOICEVOX free (or Azure <$1 total)
- ✅ Framework already exists - just connect TTS
- ✅ Now have 662 words to generate audio for

**Tasks:**
1. Set up VOICEVOX (free) or Azure TTS
2. Generate 662 audio files
3. Store on Cloudinary (free tier: 10GB)
4. Connect to listening quiz mode
5. Test on mobile devices

**Outcome:** "Complete N5 Platform with Audio" - production-ready

---

**Total Phase 1 Time:** 34-46 hours
- Part-time (10h/week): 4-5 weeks
- Full-time (40h/week): 1 week

**After Phase 1 Complete:**
- ✅ 662 N5 vocabulary words (100%)
- ✅ 88 N5 kanji (100%)
- ✅ 25-30 N5 grammar patterns (100%)
- ✅ 12-15 particles with comparisons (100%)
- ✅ Audio for all vocabulary (100%)
- ✅ 6 quiz modes working
- ✅ FSRS spaced repetition
- ✅ Premium UX (Quick Start, Remember Setup)

**Market Position:** "Best free, open-source JLPT N5 preparation platform"

**Alternative Sequences:**
- **Fast Launch:** Vocab (10h) → Audio (6h) → Ship → Add Grammar/Particles in v2
- **Grammar First:** Grammar (14h) → Particles (10h) → Vocab (10h) → Audio (6h)

---

### Phase 2: Enhanced Features (20-30 hours)
**Goal:** Best-in-class learning experience

1. Conjugation Practice (10-14 hrs)
2. Reading Practice (8-12 hrs)
3. Complete Gamification (4-6 hrs)

---

### Phase 3: N4 Expansion (60-80 hours)
**Goal:** Monetization via premium tiers

1. N4 Vocabulary (733 words)
2. N4 Kanji (93 kanji)
3. N4 Grammar (40+ patterns)
4. Audio for N4 content

---

## 📊 Data Sources & Licensing

All data sources are **free, legal, and commercial-safe**:

| Source | License | Use | Coverage | Status |
|--------|---------|-----|----------|--------|
| **JMdict** | CC BY-SA 4.0 | Vocabulary definitions | 180,000+ entries | ✅ Active |
| **Tatoeba Project** | CC BY 2.0 FR | Example sentences | 200,000+ Japanese | ✅ Active |
| **KANJIDIC2** | CC BY-SA 4.0 | Kanji data | 13,108 kanji | ✅ Active |
| **KanjiVG** | CC BY-SA 3.0 | Stroke order SVG | 6,355+ kanji | ✅ Active |
| **JGRAM.org** | CC BY-SA | Grammar patterns | 400+ patterns | 🔜 Planned |
| **VOICEVOX** | Free (attribution) | Japanese TTS | Multiple voices | 🔜 Planned |
| **Azure TTS** | Commercial | Premium TTS | Neural voices | 🔜 Alternative |
| **Claude AI** | N/A | Quality verification | Example validation | ✅ Active |

**Attribution:** All sources properly credited in `CREDITS.md`

---

## 📋 Feature: Vocabulary

**Status:** 🔄 58.5% Complete (387/662 N5 words)
**Priority:** 🔴 HIGH
**Estimated Effort:** 8-12 hours to complete
**Target:** 100% N5 coverage (662 words)

### Current Implementation

**Data Structure:**
```typescript
interface VocabularyCard {
  id: string
  kanji?: string
  kana: string
  romaji?: string
  meaning: string[]
  partOfSpeech: string[]
  jlptLevel?: JLPTLevel
  examples: Example[]
  tags?: string[]
  frequency?: number
  audioUrl?: string
  imageUrl?: string
}

interface Example {
  japanese: string      // Sentence with kanji
  kana: string         // Full hiragana reading
  english: string      // Translation
  source: ExampleSource
  license: License
  audioUrl?: string
  needsReview?: boolean
  validation?: ExampleValidation
  quality?: QualityMetrics
}
```

**Files:**
- Types: `src/types/vocabulary.ts` (250 lines)
- Data: `public/seed-data/N5_vocab_dataset.json` (387 words)
- Service: `src/services/database.service.ts`

**Current Coverage:**
- ✅ 387 N5 words with 2+ examples each
- ✅ 1,859 total example sentences
- ✅ 62.7% rated perfect quality (1,165 examples)
- ✅ All examples AI-validated by Claude
- ❌ 275 N5 words still missing (41.5%)

**Data Quality Metrics:**
```
Perfect Quality (5/5):    1,165 examples (62.7%)
Good Quality (4/5):       489 examples (26.3%)
Acceptable (3/5):         205 examples (11.0%)
Total:                    1,859 examples
Average Score:            4.52/5.0
```

### Roadmap to 100%

**Tasks:**
1. [ ] Export remaining 275 N5 words from JMdict
   - Use existing N5 word list
   - Cross-reference with JLPT resources
   - Priority: High-frequency words first

2. [ ] Find/generate 550+ example sentences
   - Target: 2 examples per word (minimum)
   - Sources: Tatoeba search, Claude generation
   - Maintain quality standards (aim for 4.5+ score)

3. [ ] Run Claude validation on new examples
   - Token match verification
   - Grammar check
   - Natural usage validation
   - Quality scoring

4. [ ] Update seed data JSON
   - Add new words to dataset
   - Maintain structure consistency
   - Update metadata (total count, version)

5. [ ] Update database
   - Run migration/import script
   - Verify data integrity
   - Update indexes

**Estimated Timeline:**
- Day 1-2: Export words + find examples (6 hrs)
- Day 3: Claude validation (2 hrs)
- Day 4: Update data + testing (2 hrs)
- **Total: 10 hours**

**Completion Criteria:**
- ✅ 662 N5 words (100% coverage)
- ✅ 2+ examples per word (1,324+ total examples)
- ✅ Average quality score >4.5
- ✅ All examples validated by Claude
- ✅ Audio URLs prepared (even if files not generated yet)

### Recent Updates

**2025-11-01 - Initial Status Assessment**
- Documented current state: 387/662 words (58.5%)
- Quality metrics: 4.52/5.0 average score
- Identified gap: 275 words needed for completion

---

## 📋 Feature: Grammar

**Status:** 🔄 0% Complete
**Priority:** 🔴 HIGH
**Estimated Effort:** 12-16 hours
**Target:** 25-30 N5 grammar patterns

### Planned Implementation

**Data Structure:**
```typescript
interface GrammarPoint {
  id: string
  pattern: string          // "〜たい"
  patternKana: string     // "〜tai"
  jlptLevel: JLPTLevel
  category: GrammarCategory // "desire", "ability", "permission", etc.
  meaning: string          // "want to do"
  formation: string        // "Verb stem + たい"
  explanation: string      // Detailed explanation
  examples: Example[]      // 3-5 example sentences
  commonMistakes?: string[]
  relatedPatterns?: string[] // ["〜たがる", "〜ほしい"]
  usageNotes?: string
}

type GrammarCategory =
  | "particles"
  | "verb-forms"
  | "desire"
  | "ability"
  | "permission"
  | "obligation"
  | "time"
  | "comparison"
  | "question"
  | "negation"
```

**Planned Files:**
- Types: `src/types/grammar.ts` (new)
- Data: `public/seed-data/grammar_n5.json` (new)
- Service: `src/services/grammar.service.ts` (new)
- Component: `src/components/grammar/GrammarCard.tsx` (new)

### N5 Grammar Patterns to Implement

**Priority List (25-30 patterns):**

**Particles (8 patterns):**
1. は (topic marker)
2. が (subject marker)
3. を (object marker)
4. に (location, time, indirect object)
5. で (location of action, means)
6. へ (direction)
7. から/まで (from/until)
8. と/や (and - exhaustive/non-exhaustive)

**Verb Forms (7 patterns):**
9. ます/ました (polite present/past)
10. ません/ませんでした (polite negative)
11. て-form
12. ている (progressive/state)
13. たい (want to)
14. ましょう (let's)
15. てください (please do)

**Adjectives (4 patterns):**
16. い-adjective conjugation
17. な-adjective usage
18. 〜くないです (negative)
19. 〜でした (past)

**Other Essential (6-11 patterns):**
20. か (question particle)
21. ね/よ (sentence-ending particles)
22. の (possessive, nominalizer)
23. も (also/too)
24. Counters basics
25. Comparison (より、〜ほうが)
26. 〜がある/いる (existence)
27. 〜ができます (can do/ability)
28. 〜ほしい (want something)
29. Conditional (〜たら、〜ば)
30. Reasons (から、ので)

### Roadmap

**Phase 1: Data Collection (4-6 hours)**
1. [ ] Research patterns on JGRAM.org
2. [ ] Cross-reference with JLPT N5 official lists
3. [ ] Collect formation rules and explanations
4. [ ] Find 3-5 examples per pattern (Tatoeba)

**Phase 2: Data Structuring (3-4 hours)**
1. [ ] Create TypeScript type definitions
2. [ ] Build JSON database with all patterns
3. [ ] Validate data structure
4. [ ] Add cross-references between related patterns

**Phase 3: UI Implementation (5-6 hours)**
1. [ ] Create GrammarCard component
2. [ ] Build grammar quiz mode
   - Multiple choice (identify correct particle)
   - Fill-in-the-blank
   - Sentence reordering
3. [ ] Add grammar section to navigation
4. [ ] Build grammar browse/search page

**Total: 12-16 hours**

**Completion Criteria:**
- ✅ 25-30 N5 grammar patterns documented
- ✅ 3-5 examples per pattern (75-150 examples total)
- ✅ Grammar quiz mode functional
- ✅ Browse/search interface complete
- ✅ All patterns cross-referenced

### Data Sources

**Primary:**
- JGRAM.org (CC BY-SA) - Grammar explanations
- Tatoeba (CC BY 2.0) - Example sentences
- JLPT N5 official grammar list

**Reference:**
- Tae Kim's Guide (CC BY-NC-SA) - For inspiration only
- Bunpro community decks - Pattern list verification
- Genki I textbook - Coverage verification (no direct copying)

### Recent Updates

**2025-11-01 - Initial Planning**
- Created grammar data structure
- Identified 25-30 core N5 patterns
- Researched data sources
- Estimated 12-16 hour implementation

---

## 📋 Feature: Particles

**Status:** 🔄 0% Complete
**Priority:** 🔴 HIGH
**Estimated Effort:** 8-12 hours
**Target:** 12-15 core particles with comparisons

### Planned Implementation

**Data Structure:**
```typescript
interface Particle {
  id: string
  particle: string          // "は"
  romaji: string           // "wa"
  meaning: string[]        // ["topic marker", "contrast"]
  usage: ParticleUsage[]
  examples: Example[]      // 5+ examples per particle
  commonErrors?: string[]
  relatedParticles?: string[]
}

interface ParticleUsage {
  category: string         // "topic marking", "contrast"
  explanation: string
  examples: Example[]
}

interface ParticleComparison {
  particles: [string, string]  // ["は", "が"]
  title: string                // "は vs が: Topic vs Subject"
  explanation: string
  differences: ComparisonPoint[]
  examplePairs: ExamplePair[]
}

interface ComparisonPoint {
  particle: string
  usage: string
  example: string
}
```

**Planned Files:**
- Types: `src/types/particle.ts` (new)
- Data: `public/seed-data/particles.json` (new)
- Component: `src/components/particles/ParticleCard.tsx` (new)
- Component: `src/components/particles/ParticleComparison.tsx` (new)

### Core Particles to Implement

**Essential 12-15 particles:**

1. **は (wa)** - Topic marker, contrast
2. **が (ga)** - Subject marker, emphasis
3. **を (wo/o)** - Direct object marker
4. **に (ni)** - Location (static), time, indirect object, direction
5. **で (de)** - Location (action), means, method
6. **へ (e)** - Direction, destination
7. **から (kara)** - From (place/time), because
8. **まで (made)** - Until, up to
9. **と (to)** - And (exhaustive), with, quotation
10. **や (ya)** - And (non-exhaustive)
11. **も (mo)** - Also, too, even
12. **の (no)** - Possessive, nominalizer
13. **か (ka)** - Question marker
14. **ね (ne)** - Seeking agreement
15. **よ (yo)** - Emphasis, assertion

### Key Comparisons to Build

**Critical comparisons (5-7 pairs):**
1. **は vs が** - Topic vs Subject (most confusing for learners)
2. **に vs で** - Static location vs Action location
3. **へ vs に** - Direction destination
4. **と vs や** - Exhaustive vs Non-exhaustive "and"
5. **から vs ので** - Reason/because
6. **か vs ね** - Question vs Confirmation
7. **を vs が** - Object vs Subject (potential verbs)

### Roadmap

**Phase 1: Core Particle Data (3-4 hours)**
1. [ ] Create particle type definitions
2. [ ] Build database for 12-15 particles
3. [ ] Add 5+ examples per particle (60-75 examples)
4. [ ] Document common errors

**Phase 2: Comparison System (3-4 hours)**
1. [ ] Build comparison data structure
2. [ ] Create 5-7 critical comparison pairs
3. [ ] Add side-by-side examples
4. [ ] Visual highlighting system

**Phase 3: UI Implementation (2-4 hours)**
1. [ ] Create ParticleCard component
2. [ ] Build ParticleComparison view
3. [ ] Add particle quiz mode (fill-in-blank)
4. [ ] Particle highlighting in example sentences

**Total: 8-12 hours**

**Completion Criteria:**
- ✅ 12-15 core particles documented
- ✅ 5+ examples per particle (60-75 examples)
- ✅ 5-7 comparison charts
- ✅ Particle quiz mode functional
- ✅ Visual highlighting system

### Implementation Notes

**Visual Design Ideas:**
- Color-code particles by category (location, time, logical, etc.)
- Highlight particle in example sentences
- Side-by-side comparison view
- Interactive exercises (drag particle to correct position)

**Quiz Modes:**
- Fill-in-the-blank (choose correct particle)
- Particle identification (what does this particle do?)
- Comparison questions (は or が?)

### Recent Updates

**2025-11-01 - Initial Planning**
- Created particle data structure
- Identified 12-15 core particles
- Planned 5-7 key comparisons
- Estimated 8-12 hour implementation

---

## 📋 Feature: Listening

**Status:** 🔄 30% Complete (Framework ready, no audio)
**Priority:** 🟡 MEDIUM
**Estimated Effort:** 4-8 hours
**Target:** Audio for 387 vocabulary words + quiz integration

### Current Implementation

**What's Done:**
- ✅ Listening quiz mode exists (`quiz-question.tsx`)
- ✅ Audio service framework (`audio-generator.service.ts`)
- ✅ Audio playback UI components
- ✅ Support for multiple voices/speeds
- ✅ Mock mode for testing

**What's Missing:**
- ❌ 0/387 audio files generated
- ❌ TTS integration (VOICEVOX or Azure)
- ❌ Audio file storage/CDN
- ❌ Audio for example sentences

**Audio Service Status:**
```typescript
// src/services/audio-generator.service.ts (275 lines)
class AudioGeneratorService {
  // ✅ Implemented
  async generateSingle(text: string, options: TTSOptions): Promise<AudioFile>
  async generateBatch(items: BatchItem[]): Promise<AudioFile[]>

  // ✅ Framework ready
  voice: 'male' | 'female' | 'neutral'
  speed: 0.5 - 2.0
  pitch: -20 to +20

  // ❌ Not connected
  ttsProvider: null  // Need VOICEVOX or Azure TTS
}
```

### Roadmap to 100%

**Phase 1: Choose TTS Provider (1 hour)**

**Option A: VOICEVOX (Free, Natural)**
- ✅ Free with attribution
- ✅ Very natural Japanese voices
- ✅ Popular in Japan
- ✅ Multiple voice characters
- ❌ Requires local installation or API
- ❌ Attribution required per voice

**Option B: Azure TTS (Paid, Professional)**
- ✅ Cloud-based (no installation)
- ✅ Neural voices (very natural)
- ✅ Easy integration
- ✅ Reliable uptime
- ❌ Costs ~$0.015 per 1K characters
- Cost estimate: ~$0.30 for 387 words + 1,859 sentences

**Recommendation:** Start with VOICEVOX (free), migrate to Azure if needed

**Phase 2: Generate Audio Files (2-4 hours)**
1. [ ] Set up VOICEVOX or Azure TTS account
2. [ ] Generate audio for 387 vocabulary words
3. [ ] Generate audio for 1,859 example sentences (optional)
4. [ ] Store files (Cloudinary free tier: 10GB)
5. [ ] Update VocabularyCard.audioUrl field

**Phase 3: Integration (1-3 hours)**
1. [ ] Connect audio service to TTS provider
2. [ ] Update quiz listening mode
3. [ ] Add audio playback to flashcards
4. [ ] Test on mobile devices
5. [ ] Add audio controls (play/pause/speed)

**Total: 4-8 hours**

**Completion Criteria:**
- ✅ 387 audio files for vocabulary
- ✅ TTS integration working
- ✅ Listening quiz mode functional
- ✅ Audio playback on mobile
- ✅ Optional: Audio for example sentences

### Cost Estimate

**VOICEVOX (Free):**
- Cost: $0
- Attribution: Required (add voice credits)
- Setup: ~1-2 hours (local or API)

**Azure TTS (Paid):**
- 387 words × ~10 chars avg = ~3,870 chars
- 1,859 sentences × ~30 chars avg = ~55,770 chars
- Total: ~59,640 chars ≈ $0.89
- First 5M chars free monthly
- **Effective cost: $0 (within free tier)**

### Recent Updates

**2025-11-01 - Status Assessment**
- Framework 100% complete
- Audio generation pending
- Estimated 4-8 hours to complete

---

## 📋 Feature: Gamification

**Status:** 🔄 80% Complete
**Priority:** 🟢 LOW
**Estimated Effort:** 4-6 hours to complete
**Target:** Full XP system, badges, leaderboards

### Current Implementation

**What's Done (80%):**
- ✅ Daily Goals system (`src/store/goals-store.ts`)
  - Cards studied, quizzes completed, study time
  - Progress tracking and persistence
- ✅ Streak Tracking (`src/store/study-store.ts`)
  - Current streak, longest streak
  - Adaptive display with motivation messages
- ✅ Bookmark System
  - Star favorites, filter by bookmarked
  - Per-card bookmarking
- ✅ Statistics & Analytics
  - Per-card statistics (accuracy, attempts, streaks)
  - Learning curve graph (Recharts)
  - Weak areas report
  - Color-coded accuracy display

**What's Missing (20%):**
- ❌ XP (Experience Points) system
- ❌ Level progression (Level 1-50+)
- ❌ Badge/Achievement system
- ❌ Leaderboards (optional, requires backend)

### Planned XP System

**Data Structure:**
```typescript
interface UserXP {
  userId: string
  totalXP: number
  level: number
  currentLevelXP: number
  xpToNextLevel: number
  lastXPGain: Date
}

interface XPEvent {
  action: XPAction
  amount: number
  timestamp: Date
  source?: string  // card ID, quiz ID, etc.
}

type XPAction =
  | "quiz_completed"
  | "perfect_quiz"
  | "card_correct"
  | "streak_day"
  | "achievement_unlocked"
  | "daily_goal_completed"
```

**XP Awards:**
- Quiz completed: 10 XP
- Perfect quiz (100%): +20 XP bonus
- Correct answer: 2 XP
- Wrong answer: 0 XP
- 7-day streak: 50 XP
- 30-day streak: 200 XP
- Daily goal completed: 25 XP
- Achievement unlocked: 50-500 XP

**Level Formula:**
```typescript
// XP required for level N
xpForLevel(n) = 100 * n * (n + 1) / 2
// Level 1: 100 XP
// Level 2: 300 XP
// Level 3: 600 XP
// Level 10: 5,500 XP
```

### Planned Badge System

**Badge Categories:**

**Milestone Badges:**
- 🎯 First Quiz - Complete your first quiz
- 🔥 Week Warrior - 7-day streak
- ⚡ Month Master - 30-day streak
- 📚 Century Club - 100 cards studied
- 🎓 Scholar - 500 cards studied

**Performance Badges:**
- ⭐ Perfect Quiz - 100% accuracy
- 🎯 Sharpshooter - 90%+ accuracy over 10 quizzes
- 🚀 Speed Demon - Complete quiz in <5 min
- 💎 Perfectionist - 10 perfect quizzes

**Content Badges:**
- 🈶 Kanji Master - Complete all N5 kanji
- 📝 Vocab Virtuoso - Complete all N5 vocabulary
- 📖 Grammar Guru - Complete all N5 grammar
- 🎌 JLPT Ready - Complete all N5 content

### Roadmap to 100%

**Phase 1: XP System (2-3 hours)**
1. [ ] Create XP type definitions
2. [ ] Build XP store (Zustand)
3. [ ] Add XP tracking to quiz completion
4. [ ] Display XP gains with animations
5. [ ] Level-up celebration modal

**Phase 2: Badge System (2-3 hours)**
1. [ ] Create badge type definitions
2. [ ] Build badge database (20-30 badges)
3. [ ] Implement badge checking logic
4. [ ] Badge unlock animations
5. [ ] Badge showcase page

**Total: 4-6 hours**

**Completion Criteria:**
- ✅ XP system tracking all actions
- ✅ Level progression working
- ✅ 20-30 badges implemented
- ✅ Badge unlock animations
- ✅ Leaderboard (optional, nice-to-have)

### Recent Updates

**2025-11-01 - Status Assessment**
- Daily goals: 100% complete
- Streak tracking: 100% complete
- Bookmark system: 100% complete
- Statistics: 100% complete
- XP/Badges: 0% complete

---

## 📋 Feature: Conjugation

**Status:** 🔄 0% Complete
**Priority:** 🟢 LOW
**Estimated Effort:** 10-14 hours
**Target:** Interactive conjugation practice for verbs/adjectives

### Planned Implementation

**Data Structure:**
```typescript
interface ConjugationPattern {
  id: string
  word: string
  type: 'verb' | 'i-adjective' | 'na-adjective'
  group?: VerbGroup  // 'godan', 'ichidan', 'irregular'
  forms: ConjugationForms
}

interface ConjugationForms {
  dictionary: string
  masu: string
  te: string
  ta: string
  nai: string
  potential: string
  passive: string
  causative: string
  conditional: string
  volitional: string
  imperative?: string
}

interface ConjugationDrill {
  word: string
  fromForm: string
  toForm: string
  correctAnswer: string
  alternatives?: string[]
}
```

**Planned Files:**
- Types: `src/types/conjugation.ts` (new)
- Service: `src/services/conjugation.service.ts` (new)
- Component: `src/components/conjugation/ConjugationTable.tsx` (new)
- Component: `src/components/conjugation/ConjugationDrill.tsx` (new)

### Roadmap

**Phase 1: Auto-Generation Logic (4-6 hours)**
- Use MeCab + UniDic for verb identification
- Implement conjugation rules for godan/ichidan
- Handle irregular verbs (する、くる、etc.)
- Generate all forms automatically

**Phase 2: Interactive Drills (4-6 hours)**
- Fill-in-the-blank conjugation quiz
- Conjugation table with blanks
- Progressive difficulty

**Phase 3: UI Polish (2-3 hours)**
- Beautiful conjugation tables
- Color-coded form categories
- Mobile-friendly layout

**Total: 10-14 hours**

**Note:** Lower priority - users can use external conjugation tools (jisho.org) initially

### Recent Updates

**2025-11-01 - Initial Planning**
- Defined data structure
- Researched auto-generation approach
- Estimated 10-14 hours

---

## 📋 Feature: Reading Practice

**Status:** 🔄 0% Complete
**Priority:** 🟢 LOW
**Estimated Effort:** 8-12 hours
**Target:** 10-20 reading passages per JLPT level

### Planned Implementation

**Data Structure:**
```typescript
interface ReadingPassage {
  id: string
  title: string
  jlptLevel: JLPTLevel
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  text: string
  furigana?: string  // Ruby annotations
  vocabulary: VocabularyReference[]
  comprehensionQuestions: ComprehensionQuestion[]
  source: PassageSource
  license: License
}

interface ComprehensionQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}
```

**Planned Files:**
- Types: `src/types/reading.ts` (new)
- Data: `public/seed-data/reading_passages_n5.json` (new)
- Component: `src/components/reading/ReadingPassage.tsx` (new)

### Content Sources

**Free Sources:**
- Tadoku Free Graded Readers (CC BY-NC-SA) - 10-20 N5 passages
- Aozora Bunko (Public Domain) - Classic literature
- Tatoeba multi-sentence entries - Connected sentences
- NHK Easy News - Simplified news articles

### Roadmap

**Phase 1: Content Collection (3-4 hours)**
- Source 10-20 N5-appropriate passages
- Add furigana annotations
- Identify key vocabulary

**Phase 2: Comprehension Questions (3-4 hours)**
- Write 3-5 questions per passage
- Add explanations

**Phase 3: UI Implementation (2-4 hours)**
- Reading passage display
- Vocabulary popup on hover
- Comprehension quiz

**Total: 8-12 hours**

### Recent Updates

**2025-11-01 - Initial Planning**
- Identified data sources
- Planned structure
- Estimated 8-12 hours

---

## 📈 Overall Quality Metrics

### Data Completeness (N5 Level)

| Content Type | Current | Target | Completion |
|--------------|---------|--------|------------|
| Vocabulary | 387 | 662 | 58.5% |
| Kanji | 88 | 88 | 100% |
| Grammar | 0 | 25 | 0% |
| Particles | 0 | 12 | 0% |
| Audio | 0 | 387 | 0% |
| Examples | 1,859 | 1,324+ | 140%+ |

### Example Quality Distribution

```
Perfect (5/5):     1,165 examples (62.7%)
Good (4/5):        489 examples (26.3%)
Acceptable (3/5):  205 examples (11.0%)
Average Score:     4.52/5.0
```

### Data Sources Attribution

All content properly attributed in `CREDITS.md`:
- JMdict (CC BY-SA 4.0)
- Tatoeba (CC BY 2.0 FR)
- KANJIDIC2 (CC BY-SA 4.0)
- KanjiVG (CC BY-SA 3.0)

---

## 📌 Recent Updates

### v1.0 - Content Implementation Tracking Started (2025-11-01)

**Documentation Strategy Established:**
- Created master content tracking document
- Consolidated analysis from 4 separate reports
- Defined graduation strategy for completed features

**Current Status Assessment:**
- ✅ Vocabulary: 58.5% complete (387/662 words)
- ✅ Kanji: 100% complete (archived to kanji_implementation.md)
- ✅ Quiz System: 98% complete (archived to quiz_implementation.md)
- 🔄 Grammar: 0% - ready to start
- 🔄 Particles: 0% - ready to start
- 🔄 Listening: 30% - framework done, needs audio
- 🔄 Gamification: 80% - needs XP/badges

**Next Steps Identified:**
- Priority 1: Complete N5 vocabulary (275 words)
- Priority 2: Build grammar module (25 patterns)
- Priority 3: Build particles module (12 particles)
- Priority 4: Audio integration (387 files)

**Timeline:** 30-40 hours to complete N5 core content

---

## 📚 Technical References

### Development Tools
- **MeCab** - Japanese morphological analyzer
- **UniDic** - Dictionary for MeCab
- **VOICEVOX** - Free Japanese TTS
- **Azure TTS** - Premium TTS option
- **Claude AI** - Example validation

### Testing & Analytics
- **Vitest** - Unit testing framework
- **Playwright** - E2E testing
- **Plausible** - Privacy-friendly analytics
- **Sentry** - Error monitoring

### Data Processing
- **JMdict API** - Vocabulary extraction
- **Tatoeba API** - Sentence search
- **Claude API** - Quality validation

---

## 🎯 Success Criteria

### Definition of "Complete" for Each Feature

**Vocabulary:** 100% of N5 words (662) with 2+ examples each, audio URLs
**Grammar:** 25-30 N5 patterns with 3+ examples, quiz mode functional
**Particles:** 12-15 particles with 5+ examples, comparison charts
**Listening:** Audio files generated, TTS integrated, quiz mode working
**Gamification:** XP system, badges, level progression all functional
**Conjugation:** Auto-generation working, interactive drills complete
**Reading:** 10-20 passages with comprehension questions

### Graduation Criteria

A feature can be moved to its own `{feature}_implementation.md` when:
1. ✅ 100% of planned content/functionality complete
2. ✅ All acceptance criteria met
3. ✅ Tested and verified working
4. ✅ Documentation complete
5. ✅ Ready for production use

---

## 🚀 Ready to Start?

### **Next Action: Begin Step 1 - Complete N5 Vocabulary**

**You're starting at:** 387/662 words (58.5%)
**Goal:** 662/662 words (100%)
**Effort:** 10 hours
**Impact:** 71% content increase

**To begin:**
1. Open this document
2. Go to "Feature: Vocabulary" section (line ~200)
3. Follow the 5-step roadmap
4. Update status as you progress

**When Step 1 is complete:**
- ✅ Mark Vocabulary as 100% in Quick Status table
- ✅ Update "Recent Updates" section
- ✅ Move to Step 2 (Grammar)

**Need help?** Each feature section has:
- Detailed roadmap with tasks
- Data structure examples
- Timeline estimates
- Completion criteria

---

**Last Updated:** 2025-11-01 01:15 UTC
**Document Version:** 1.1.0
**Next Review:** After completing Step 1 (Vocabulary)
