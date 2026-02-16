# LingoMemory - Application Overview

**Version:** 1.0
**Last Updated:** February 16, 2026
**Status:** Production Ready

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Application Routes](#application-routes)
3. [Core Features](#core-features)
4. [Technical Architecture](#technical-architecture)
5. [User Workflows](#user-workflows)
6. [Component Breakdown](#component-breakdown)
7. [State Management](#state-management)
8. [Data Flow](#data-flow)

---

## Architecture Overview

LingoMemory is a modern Progressive Web App (PWA) built with Next.js 14 App Router, designed for Japanese vocabulary learning using spaced repetition and interactive exercises.

### Tech Stack Summary

**Frontend Framework:**
- Next.js 14 with App Router (file-based routing)
- React 18 with TypeScript
- Tailwind CSS + Framer Motion for animations
- Radix UI for accessible components

**State & Persistence:**
- Zustand (global state management)
- Dexie.js (IndexedDB wrapper for offline storage)
- LocalStorage (user preferences, progress tracking)

**Key Algorithms:**
- FSRS (Free Spaced Repetition Scheduler) for optimal review scheduling
- Custom quiz generation with difficulty levels
- Confusable word detection for targeted practice

### Project Structure

```
src/
├── app/                    # Next.js 14 App Router pages (17 routes)
│   ├── page.tsx            # Landing page with demo cards
│   ├── study/              # Main study interface
│   ├── quiz/               # Quiz system
│   ├── verbs/              # Verb learning with flip cards
│   ├── progress/           # Analytics and insights
│   ├── dlingo-review/      # Dlingo vocabulary review
│   ├── dlingo-special/     # Numbers, counters, particles
│   ├── conjugation-ref/    # Verb conjugation reference
│   └── admin/              # Admin tools (persona import, settings)
├── components/             # React components (69 total)
│   ├── ui/                 # Base UI components (Radix wrappers)
│   ├── study/              # Study session components
│   ├── quiz/               # Quiz components
│   ├── verbs/              # Verb learning components
│   ├── dlingo/             # Dlingo review components
│   └── dlingo-special/     # Visual learning components
├── services/               # Business logic (17 services)
│   ├── database.service.ts     # IndexedDB operations
│   ├── seed-loader.service.ts  # Vocabulary import
│   ├── fsrs.service.ts         # Spaced repetition
│   ├── quiz-generator.service.ts
│   └── ...
├── lib/                    # Utilities, configs, helpers
├── types/                  # TypeScript type definitions
└── data/                   # Compile-time static data
```

---

## Application Routes

### 1. `/` - Landing Page
**Purpose:** Introduction and demo of vocabulary cards
**Features:**
- 3 demo cards with flip animation
- Quick start buttons to main features
- Navigation to all major sections

**Components:** `src/app/page.tsx`

---

### 2. `/study` - Main Study Interface
**Purpose:** Primary vocabulary learning with spaced repetition
**Features:**
- FSRS-based card scheduling
- Review cards due for study
- Card flip animation (kanji ↔ meaning)
- Difficulty rating (Again, Hard, Good, Easy)
- Progress tracking (cards studied, review streak)
- Session statistics

**Key Components:**
- `src/components/study/study-session.tsx` - Main study logic
- `src/components/study/vocabulary-card.tsx` - Card display
- `src/components/study/study-controls.tsx` - Rating buttons

**Data Flow:**
1. Load cards from IndexedDB (via `database.service.ts`)
2. Filter cards due for review (FSRS algorithm)
3. User rates card difficulty
4. Update card state and schedule next review
5. Save to IndexedDB

**State Management:**
- `src/store/study-store.ts` - Study session state
- LocalStorage - User preferences (card side preference, study streak)

---

### 3. `/quiz` - Quiz System
**Purpose:** Test vocabulary knowledge with multiple choice questions
**Features:**
- 6 quiz presets (Quick Review, Daily Challenge, LingoSpecial, etc.)
- Custom quiz builder (difficulty, question count, time limit)
- Multiple question types:
  - Japanese → English
  - English → Japanese
  - Kanji → Kana reading
- Smart distractor generation (confusable words)
- Timed mode with countdown
- Score tracking and feedback

**Key Components:**
- `src/components/quiz/quiz-setup.tsx` - Quiz configuration
- `src/components/quiz/quiz-session.tsx` - Quiz gameplay
- `src/components/quiz/quiz-results.tsx` - Score and review

**Quiz Presets:**
1. **Quick Review** - 10 questions, 30s each, easy
2. **Daily Challenge** - 20 questions, 20s each, medium
3. **JLPT Practice** - 30 questions, 15s each, medium
4. **Speed Challenge** - 20 questions, 10s each, hard
5. **Master Test** - 50 questions, 15s each, all levels
6. **LingoSpecial 🔥** - 20 questions, 20s each, confusable options, ultra-hard

**Quiz Generation Logic:**
- `src/services/quiz-generator.service.ts`
- Randomly selects cards based on JLPT level filter
- Generates confusable distractors using:
  - Similar kanji (e.g., 先生 vs 学生)
  - Similar meanings (e.g., 行く vs 来る)
  - Same category (e.g., all animals)

---

### 4. `/verbs` - Verb Learning
**Purpose:** Dedicated verb study with conjugations and examples
**Features:**
- 161 N5 verbs with full conjugation tables
- Flip card interface (customizable front/back)
- View modes:
  - All Info (kanji, kana, meaning, conjugations)
  - Dictionary Form
  - Masu Forms
- Test mode with Know/Don't Know tracking
- Spaced repetition (6 levels: L0-L5)
- Filter by verb group (Godan, Ichidan, Irregular)
- Search by kanji, kana, romaji, or meaning
- Example sentences with context highlighting

**Key Components:**
- `src/app/verbs/page.tsx` - Main verb interface
- Flip card with 3D animation (Framer Motion)
- Examples popup with smart kana display

**Dataset:**
- `public/seed-data/N5_verbs_dataset.json` (161 verbs)
- Each verb includes:
  - Dictionary form, masu form, te-form, nai-form, ta-form
  - Transitive/intransitive classification
  - 2+ example sentences with English translation
  - Verb group (Godan, Ichidan, Irregular)

**Progress Tracking:**
- LocalStorage tracks known/unknown state
- Level badges (L0-L5) show retention strength
- Green ring = known, Red ring = needs practice

---

### 5. `/progress` - Analytics & Insights
**Purpose:** Track learning progress and statistics
**Features:**
- Daily study streak
- Total cards studied
- Review accuracy rate
- Study time tracker
- Calendar heatmap of activity
- Level progress breakdown (N5 → N1)
- Recent activity log
- Milestone achievements

**Key Components:**
- `src/app/progress/page.tsx`
- `src/components/ui/charts.tsx` (Recharts integration)

**Metrics Tracked:**
- Cards learned (per level)
- Review sessions completed
- Average accuracy
- Study consistency (streak days)
- Time spent studying

---

### 6. `/dlingo-review` - Dlingo Vocabulary Review
**Purpose:** Review specialized vocabulary with multiple view modes
**Features:**
- ~1000+ Dlingo vocabulary words
- 4 view modes:
  - Classic Cards (grid layout)
  - Flash Cards (single card flip)
  - Focused Grid (compact view)
  - Single Card (full-screen)
- Filter by category
- Search functionality
- Progress tracking per category

**Dataset:**
- `public/dlingo/dlingo_vocab_enhanced.json`

---

### 7. `/dlingo-special` - Numbers, Counters, Particles
**Purpose:** Visual learning for special vocabulary categories
**Features:**
- **Numbers:** 1-10,000 with kanji/kana/romaji
- **Counters:** ~100 counters with usage examples
- **Particles:** は、が、を、に、で、と、へ、から、まで
- **Calendar:** Days, months, dates
- **Clock:** Time expressions

**Visual Components:**
- `src/components/dlingo-special/numbers-visual.tsx`
- `src/components/dlingo-special/counters-visual.tsx`
- `src/components/dlingo-special/particles-visual.tsx`
- `src/components/dlingo-special/calendar-visual.tsx`
- `src/components/dlingo-special/clock-visual.tsx`

---

### 8. `/conjugation-ref` - Verb Conjugation Reference
**Purpose:** Quick reference guide for all verb conjugation rules
**Features:**
- Complete conjugation rules for Godan, Ichidan, Irregular verbs
- Tables with examples
- Grouped by verb type
- Searchable
- Printable format

**Components:** `src/app/conjugation-ref/page.tsx`

---

### 9. `/admin/persona-import` - Persona Import Tool
**Purpose:** Admin tool for batch importing vocabulary with persona examples
**Features:**
- CSV/JSON import
- Preview before import
- Validation
- Error reporting
- Demo data import (deprecated)

**Components:** `src/app/admin/persona-import/page.tsx`

---

### 10. `/admin/settings` - Application Settings
**Purpose:** Configure app behavior and preferences
**Features:**
- Study preferences (daily goal, auto-play audio)
- Display settings (card side preference, show romaji)
- Quiz defaults (time limit, question count)
- Data management (export/import, reset)
- Theme selection (light/dark/system)

**Components:** `src/app/admin/settings/page.tsx`

---

## Core Features

### 1. Vocabulary System (863 N5 Cards)

**Card Structure:**
```typescript
interface VocabularyCard {
  id: string
  kanji: string
  kana: string
  romaji: string
  meaning: string[]
  jlptLevel: "N5" | "N4" | "N3" | "N2" | "N1"
  partOfSpeech: string[]
  tags: string[]
  examples: Example[]
  fsrsData?: FSRSCardData
  source: { type: string }
  license: { text: string; url: string }
}
```

**FSRS Spaced Repetition:**
- Automatically schedules reviews based on memory retention
- 4 difficulty levels adjust future intervals
- Tracks stability, difficulty, elapsed days, scheduled days
- Implemented via `src/services/fsrs.service.ts`

**Seed Loading:**
- Automatic import from `public/seed-data/N5_vocab_dataset.json`
- Version tracking prevents duplicate imports
- Runs on first app load via `src/services/seed-loader.service.ts`

### 2. Verb Learning (161 N5 Verbs)

**Verb Structure:**
```typescript
interface Verb {
  id: string
  kanji: string
  kana: string
  romaji: string
  meaning: string[]
  verbType: "Godan" | "Ichidan" | "Irregular"
  transitivity: "transitive" | "intransitive" | "both"
  conjugations: {
    dictionary: string
    masu: string
    masuNegative: string
    te: string
    ta: string
    nai: string
  }
  examples: Example[]
}
```

**Features:**
- Flip card interface with customizable views
- Spaced repetition tracking (L0-L5)
- Example sentences with context highlighting
- Filter by verb group
- Search functionality

### 3. Quiz System

**Question Types:**
1. **Japanese → English** - Show kanji/kana, choose English meaning
2. **English → Japanese** - Show meaning, choose kanji/kana
3. **Kanji → Kana** - Show kanji, choose correct reading
4. **Bidirectional** - Random mix of above

**Difficulty Levels:**
- **Easy** - 4 choices, similar JLPT level distractors
- **Medium** - 5 choices, cross-level distractors
- **Hard** - 6 choices, confusable words (similar kanji/meaning)

**Smart Distractor Generation:**
- Analyzes card tags and part of speech
- Finds similar words within same category
- For confusable mode: prioritizes words with:
  - Shared kanji components
  - Similar meanings
  - Same grammatical function

### 4. Progress Tracking

**Metrics:**
- Cards learned (total and per JLPT level)
- Review sessions completed
- Study streak (consecutive days)
- Average accuracy
- Time spent studying
- Milestone achievements

**Visualizations:**
- Calendar heatmap (study activity)
- Bar charts (level progress)
- Line charts (accuracy trends)
- Pie charts (category breakdown)

### 5. PWA Support

**Features:**
- Offline functionality (IndexedDB storage)
- Installable on desktop/mobile
- Service worker for caching
- App manifest for icon/name
- Works without internet after first load

**Configuration:**
- `next.config.js` - PWA settings
- `public/manifest.json` - App metadata
- Service worker auto-generated by Next.js

---

## Technical Architecture

### Data Persistence Layers

**1. IndexedDB (via Dexie.js)**
- **Purpose:** Persistent storage for vocabulary cards, progress, reviews
- **Schema:** `src/services/database.service.ts`
- **Tables:**
  - `vocabulary` - All vocabulary cards with FSRS data
  - `reviews` - Review history (card_id, timestamp, rating, ease)
  - `settings` - User preferences
  - `seedVersions` - Track imported dataset versions

**2. LocalStorage**
- **Purpose:** Lightweight preferences, session data
- **Used for:** Theme, study streak, verb learning progress

**3. Zustand Stores**
- **Purpose:** Global reactive state
- **Stores:**
  - `study-store.ts` - Current study session state
  - `quiz-store.ts` - Quiz session state
  - Theme store (from next-themes)

### State Management Flow

```
User Action
    ↓
React Component
    ↓
Zustand Store (if global state needed)
    ↓
Service Layer (business logic)
    ↓
Database Service (Dexie)
    ↓
IndexedDB (persistent storage)
```

### Data Flow Example: Study Session

1. **Initialization:**
   - User navigates to `/study`
   - `study-session.tsx` loads cards from `database.service.ts`
   - Filters cards due for review (FSRS algorithm)
   - Displays first card

2. **User Interaction:**
   - User clicks "Show Answer" → flips card
   - User rates difficulty (Again/Hard/Good/Easy)
   - Rating triggers FSRS calculation

3. **State Update:**
   - `fsrs.service.ts` calculates new review schedule
   - Card updated with new FSRS data
   - `database.service.ts` saves to IndexedDB
   - Review logged to `reviews` table

4. **Next Card:**
   - Remove current card from session queue
   - Display next card or show completion screen

---

## User Workflows

### Study Workflow

1. User clicks "Start Studying" on home page
2. App loads cards due for review from IndexedDB
3. If no cards due, shows message "No cards to review today"
4. Display first card (front side: kanji/kana)
5. User clicks "Show Answer" to reveal meaning
6. User rates difficulty:
   - **Again** - Forgot, review soon (1 day)
   - **Hard** - Remembered with effort (3 days)
   - **Good** - Remembered easily (7 days)
   - **Easy** - Too easy (14 days)
7. Card scheduled for next review based on rating
8. Repeat until all cards reviewed
9. Show session summary (cards studied, time, accuracy)

### Quiz Workflow

1. User navigates to `/quiz`
2. Choose preset or create custom quiz
3. Configure options:
   - JLPT level filter
   - Question count
   - Time limit per question
   - Question type (JP→EN, EN→JP, etc.)
   - Difficulty (choice count, confusable mode)
4. Click "Start Quiz"
5. For each question:
   - Display question text
   - Show 4-6 answer choices
   - Start countdown timer (if enabled)
   - User selects answer
   - Instant feedback (correct/incorrect)
6. After all questions:
   - Show final score
   - Display incorrect answers for review
   - Option to retake or return to setup

### Verb Learning Workflow

1. User navigates to `/verbs`
2. Browse 161 N5 verbs in grid view
3. Filter by verb group or search
4. Click card to enter flip card mode
5. Configure card display:
   - **Front side:** Dictionary form, Masu form, or Meaning
   - **Back side:** All info, Conjugations, or Examples
6. Click card to flip
7. Optional: Enable "Test Mode"
   - Mark cards as "Know" or "Don't Know"
   - Track progress with spaced repetition levels
8. Click "Examples" to see usage in sentences
9. Shuffle or navigate with arrow keys

---

## Component Breakdown

### UI Components (`src/components/ui/`)

Base components wrapping Radix UI for consistent styling:
- `button.tsx` - Buttons with variants
- `card.tsx` - Card container
- `dialog.tsx` - Modal dialogs
- `tabs.tsx` - Tab navigation
- `toast.tsx` - Notifications
- `progress.tsx` - Progress bars
- `switch.tsx` - Toggle switches

### Study Components (`src/components/study/`)

- `study-session.tsx` - Main study interface, orchestrates study flow
- `vocabulary-card.tsx` - Card display with flip animation
- `study-controls.tsx` - Difficulty rating buttons
- `study-stats.tsx` - Session statistics display

### Quiz Components (`src/components/quiz/`)

- `quiz-setup.tsx` - Quiz configuration screen
- `quiz-session.tsx` - Quiz gameplay interface
- `quiz-results.tsx` - Score and review screen
- `question-display.tsx` - Individual question rendering

### Verb Components (`src/components/verbs/`)

- `verb-flip-card.tsx` - 3D flip card with Framer Motion
- `verb-grid.tsx` - Grid layout for browsing verbs
- `verb-examples-popup.tsx` - Example sentences modal
- `conjugation-table.tsx` - Verb conjugation display

---

## State Management

### Zustand Stores

**1. `src/store/study-store.ts`**
```typescript
interface StudyState {
  vocabulary: VocabularyCard[]
  currentCard: VocabularyCard | null
  reviewQueue: VocabularyCard[]
  sessionStats: {
    cardsStudied: number
    startTime: Date
    accuracy: number
  }
  // Actions
  loadVocabulary: () => Promise<void>
  rateCard: (rating: FSRSRating) => void
  nextCard: () => void
}
```

**2. Quiz Store** (inline in `quiz-session.tsx`)
- Current question index
- User answers
- Score
- Time remaining

### Database Service

**`src/services/database.service.ts`**

Key methods:
- `initializeDatabase()` - Setup IndexedDB schema
- `getAllVocabulary()` - Fetch all cards
- `getVocabularyById(id)` - Fetch single card
- `updateVocabulary(card)` - Update card (FSRS data)
- `addReview(review)` - Log review event
- `getCardsDueForReview()` - Filter cards by due date

---

## Data Flow

### Vocabulary Import Flow

```
App First Load
    ↓
seed-loader.service.ts checks seedVersions table
    ↓
If version not imported:
    ↓
Fetch public/seed-data/N5_vocab_dataset.json
    ↓
Parse JSON (863 cards)
    ↓
For each card:
    - Initialize FSRS data (new card state)
    - Insert into IndexedDB vocabulary table
    ↓
Save version to seedVersions table
    ↓
Load complete (study-store populates vocabulary array)
```

### FSRS Update Flow

```
User rates card (Again/Hard/Good/Easy)
    ↓
fsrs.service.ts receives:
    - Current card FSRS data
    - Rating (0-3)
    ↓
Calculate new values:
    - Stability (memory strength)
    - Difficulty (inherent card difficulty)
    - Due date (next review)
    ↓
Update card object with new FSRS data
    ↓
database.service.ts saves to IndexedDB
    ↓
Log review event (card_id, timestamp, rating)
    ↓
Remove card from review queue
    ↓
Load next card or end session
```

---

## Performance Considerations

### Bundle Optimization

- **Code Splitting:** Next.js automatically splits routes
- **Dynamic Imports:** Heavy components lazy-loaded
- **Tree Shaking:** Unused code eliminated
- **Image Optimization:** Next.js Image component

### Data Management

- **IndexedDB:** Stores 863 cards (~2 MB) offline
- **Lazy Loading:** Cards loaded on-demand for study
- **Memoization:** React.memo for expensive components
- **Debouncing:** Search input debounced (300ms)

### Rendering Performance

- **Virtual Scrolling:** For large lists (not currently implemented, could optimize verb grid)
- **Framer Motion:** GPU-accelerated animations
- **CSS-only animations:** Where possible

---

## Security & Privacy

- **No Backend:** All data stored client-side (IndexedDB)
- **No User Authentication:** No accounts, no personal data collection
- **No Analytics:** No tracking scripts
- **No External API Calls:** Fully offline after first load
- **Open Source Datasets:** All vocabulary from public JLPT sources

---

## Browser Compatibility

**Supported Browsers:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Required APIs:**
- IndexedDB (Dexie.js)
- LocalStorage
- Service Workers (PWA)
- CSS Grid/Flexbox
- ES2020 features

---

## Deployment

**Build Command:**
```bash
npm run build
```

**Output:**
- Static HTML/CSS/JS in `.next/` folder
- Optimized production bundle
- Service worker for offline support

**Deployment Options:**
- Vercel (recommended, zero-config)
- Netlify
- AWS S3 + CloudFront
- Any static host

---

**For dataset details and data creation process, see [DATA_GUIDE.md](./DATA_GUIDE.md)**

**Last Updated:** February 16, 2026
