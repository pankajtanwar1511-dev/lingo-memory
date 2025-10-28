# Getting Started with JapVocab

**Last Updated:** October 28, 2024
**Project:** JapVocab - Japanese Vocabulary Learning Platform

---

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/japvocab.git
cd japvocab

# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### 2. First Run

The app will automatically:
- Load seed data (N5 vocabulary)
- Initialize IndexedDB
- Set up the study system

No additional configuration needed for local development!

---

## Development Commands

```bash
# Development
npm run dev                 # Start dev server (localhost:3000)
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint
npm run type-check         # TypeScript checking

# Data Pipeline Scripts
npm run import:jmdict      # Import vocabulary from JMdict
npm run enrich:sentences   # Add example sentences from Tatoeba
npm run generate:audio     # Generate TTS audio files
npm run validate:quality   # Validate data quality
npm run review:cards       # Review flashcards
```

---

## Project Structure

```
japvocab/
├── src/
│   ├── app/              # Next.js pages (App Router)
│   │   ├── page.tsx                # Landing page
│   │   ├── study/                  # Flashcard study interface
│   │   ├── vocabulary/             # Vocabulary browser
│   │   ├── quiz/                   # Quiz mode
│   │   ├── progress/               # Progress tracking
│   │   └── settings/               # App settings
│   │
│   ├── components/       # React components
│   │   ├── ui/          # Radix UI components
│   │   ├── quiz/        # Quiz components
│   │   ├── auth/        # Authentication
│   │   └── layout/      # Layout components
│   │
│   ├── services/        # Business logic (14 services)
│   │   ├── database.service.ts          # IndexedDB
│   │   ├── seed-loader.service.ts       # Load seed data
│   │   ├── content-import.service.ts    # Import vocabulary
│   │   ├── sentence-matcher.service.ts  # Tatoeba matching
│   │   ├── quality-scorer.service.ts    # Quality validation
│   │   ├── audio-generator.service.ts   # TTS generation
│   │   ├── analytics.service.ts         # Learning analytics
│   │   ├── sync.service.ts              # Cloud sync
│   │   └── auth.service.ts              # Authentication
│   │
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript definitions
│   ├── schemas/         # Zod validation schemas
│   ├── lib/             # Utility functions
│   └── hooks/           # Custom React hooks
│
├── public/
│   ├── seed-data/       # Production vocabulary datasets
│   │   ├── n5-vocabulary.json
│   │   └── n4-comprehensive.json
│   └── audio/           # Audio files
│
├── data/                # Development data and processing
│   ├── ai-verification/ # AI verification batches
│   ├── backups/         # Data backups
│   └── categorized-examples/  # Quality-sorted examples
│
├── scripts/             # Data processing scripts
├── docs/                # Documentation (you are here)
└── reports/             # Validation reports
```

---

## Environment Setup

### Required

- **Node.js**: 18+
- **npm**: 9+

### Optional (for data generation)

Create `.env.local` file:

```env
# Google Cloud TTS (for audio generation)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

# Firebase (for auth and sync)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Anthropic (for AI content generation)
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Tech Stack

### Core

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI
- **Animations**: Framer Motion

### Data & State

- **Database**: IndexedDB with Dexie 4.x
- **State Management**: Zustand 4.5
- **Validation**: Zod 4.x
- **Search**: Fuse.js 7.x

### Services

- **TTS**: Edge TTS (dev), Google Cloud TTS (prod)
- **Auth**: Firebase Authentication
- **Analytics**: Built-in analytics service
- **Cloud Sync**: Firestore

---

## Key Features

### ✅ Implemented

- **Flashcard Study System**
  - FSRS spaced repetition algorithm
  - Flip cards, rate difficulty
  - Progress tracking

- **Vocabulary Browser**
  - Search and filter by JLPT level
  - View word details, examples, audio

- **Quiz Mode**
  - Multiple question types
  - Score tracking

- **Data Management**
  - Import/export functionality
  - Seed data loading
  - Quality validation

- **UI/UX**
  - Dark mode support
  - Responsive design
  - PWA-ready (offline capable)

### 🚧 In Progress

- **AI Verification**: 15/38 batches completed (39%)
- **N4 Dataset**: Improving coverage from 71% to 95%+

### 📋 Planned (Phase 2)

- Firebase authentication activation
- Cloud sync with Firestore
- Premium features (Stripe integration)
- Advanced analytics dashboard

---

## Data Sources

All data is legally sourced and properly attributed:

### Vocabulary & Examples

- **JMdict & Tatoeba Project** (CC BY-SA 4.0 & CC BY 2.0 FR)
  - Data fetched using custom scripts with filters
  - Manually verified by Claude AI
  - **Current: 401 N5 words** fully verified and ready
  - **Remaining: 261 N5 words** need AI-generated examples
  - N4: Not yet processed (planned for later)
  - Verification results stored in `data/ai-verification-results/`
  - Full attribution in CREDITS.md

### Audio (Planned)

Audio generation is planned for future phases using official LLM models with proper licensing. Previous TTS experiments have been removed.

---

## Database Schema

The app uses IndexedDB with the following stores:

```typescript
// Vocabulary cards
VocabularyCard {
  id: string              // "n5_vocab_0001"
  kanji: string          // "食べる"
  kana: string           // "たべる"
  romaji: string         // "taberu"
  meaning: string        // "to eat"
  jlptLevel: string      // "N5"
  examples: Example[]    // Example sentences
  audio?: string         // Audio URL
}

// Study progress
StudyProgress {
  cardId: string
  lastStudied: Date
  nextReview: Date
  interval: number       // FSRS interval
  difficulty: number     // FSRS difficulty
  stability: number      // FSRS stability
}

// User settings
Settings {
  theme: "light" | "dark"
  dailyGoal: number
  autoPlayAudio: boolean
  studyMode: string
}
```

See `docs/04_DATA_SCHEMA.md` for complete schema documentation.

---

## Common Tasks

### Add New Vocabulary

```bash
# 1. Place source file in data/source/
# 2. Run import script
npm run import:jmdict -- \
  --source data/source/new-vocab.json \
  --output data/new-cards.json \
  --jlpt N5

# 3. Validate quality
npm run validate:quality -- \
  --cards data/new-cards.json \
  --output data/validation-report.json
```

### Clear Development Data

```javascript
// In browser console:
localStorage.clear()
indexedDB.databases().then(dbs =>
  dbs.forEach(db => indexedDB.deleteDatabase(db.name))
)
location.reload()
```

### Test Seed Data Loading

```javascript
// In browser console:
await window.seedLoaderService.loadAll(true)
```

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Database Issues

```bash
# Reset browser database (in console)
indexedDB.databases().then(dbs =>
  dbs.forEach(db => indexedDB.deleteDatabase(db.name))
)
```

---

## Next Steps

1. **Explore the App**
   - Try the flashcard system at `/study`
   - Browse vocabulary at `/vocabulary`
   - Take a quiz at `/quiz`

2. **Read Documentation**
   - `02_ARCHITECTURE.md` - Technical deep dive
   - `03_DATA_PIPELINE.md` - Data processing workflow
   - `04_DATA_SCHEMA.md` - Complete schema reference

3. **Contribute**
   - Check GitHub issues
   - Review `07_DEVELOPMENT_ROADMAP.md`
   - See what features need work

---

## Support

- **Documentation**: See `docs/` folder
- **Issues**: Open a GitHub issue
- **Attribution**: See `CREDITS.md` for data sources

---

**Ready to start learning Japanese? 🇯🇵**

Visit http://localhost:3000 after running `npm run dev`!
