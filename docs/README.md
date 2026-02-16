# LingoMemory Documentation

**Version:** 1.0 (February 2026)
**Status:** Production Ready

---

## 📚 Quick Navigation

1. **[APP_OVERVIEW.md](./APP_OVERVIEW.md)** - Complete feature guide, architecture, and user workflows
2. **[DATA_GUIDE.md](./DATA_GUIDE.md)** - Dataset details, data creation process, and quality metrics
3. **Archive** - Old documentation in `./archive/old-docs/`

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

**Access:** http://localhost:3000

---

## 📊 Project Stats

- **Vocabulary Cards:** 863 N5 words (100% JLPT N5 coverage)
- **Verbs Dataset:** 161 N5 verbs with examples
- **Quiz Questions:** Dynamic generation from vocabulary
- **Project Size:** 850 MB (optimized from 2.3 GB)
- **Lines of Code:** ~50,000+ TypeScript/React

---

## 🏗️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS + Framer Motion

**State & Data:**
- Zustand (state management)
- Dexie.js (IndexedDB wrapper)
- FSRS algorithm (spaced repetition)

**Key Libraries:**
- Radix UI (accessible components)
- Lucide React (icons)
- Recharts (analytics)
- Canvas Confetti (celebrations)

---

## 📁 Project Structure

```
lingomemory/
├── src/              # Application source code
│   ├── app/          # Next.js pages (17 routes)
│   ├── components/   # React components (69 components)
│   ├── services/     # Business logic (17 services)
│   ├── data/         # Static data files
│   ├── lib/          # Utilities & configs
│   └── types/        # TypeScript definitions
├── public/           # Runtime assets
│   ├── seed-data/    # Vocabulary JSON files
│   └── dlingo/       # Dlingo special vocab
└── docs/             # Documentation
    ├── data-source/  # Source data for processing
    ├── vocab_master/ # Vocabulary analysis
    └── dlingo-source/# Dlingo processing files
```

---

## 🎯 Key Features

1. **Vocabulary System** - 863 N5 cards with FSRS spaced repetition
2. **Verb Learning** - 161 verbs with conjugations and examples
3. **Quiz System** - Multiple quiz modes with AI-generated questions
4. **Dlingo Special** - Numbers, counters, particles, calendar vocab
5. **Progress Tracking** - Analytics, insights, and study statistics
6. **PWA Support** - Offline-capable, installable web app

---

## 📝 For Developers

**Read First:**
1. [APP_OVERVIEW.md](./APP_OVERVIEW.md) - Understand the architecture
2. [DATA_GUIDE.md](./DATA_GUIDE.md) - Learn about data structures

**Common Tasks:**
- Adding vocabulary: Update `public/seed-data/N5_vocab_dataset.json`
- Adding routes: Create files in `src/app/`
- Adding components: Create in `src/components/`
- Adding services: Create in `src/services/`

---

## 🗂️ Archive

Old documentation (19 files) archived in `./archive/old-docs/`:
- Numbered guides (00-08)
- Implementation docs (content, kanji, quiz, vocabulary)
- Project summaries and session logs

These are kept for historical reference but may be outdated.

---

**Last Updated:** February 16, 2026
**Maintained By:** Development Team
