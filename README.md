# LingoMemory - Master Japanese with Science-Backed Learning

A modern, beautiful Japanese vocabulary learning app built with Next.js 14, TypeScript, and Tailwind CSS. Features FSRS spaced repetition algorithm, authentic content from JMdict and Tatoeba, and a delightful learning experience.

**Version:** 1.0 (February 2026)
**Status:** Production Ready

## 🚀 Features

- **FSRS Algorithm**: Science-backed spaced repetition for optimal retention
- **863 N5 Vocabulary Cards**: Complete JLPT N5 coverage with authentic examples
- **161 N5 Verbs**: Full conjugation tables with example sentences
- **Multiple Learning Modes**: Study cards, quiz system, verb practice, special vocabulary
- **Quiz System**: 6 preset modes including LingoSpecial ultra-hard challenge
- **Progress Tracking**: Analytics, insights, study statistics, calendar heatmap
- **Dlingo Special**: Numbers, counters, particles, calendar, clock (1000+ entries)
- **Beautiful UI**: Modern design with smooth animations and dark mode support
- **PWA Ready**: Works offline, installable on all devices
- **TypeScript**: Full type safety throughout the codebase

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript 5.3
- Tailwind CSS 3.4
- Framer Motion (animations)

**State & Data:**
- Zustand 4.5 (state management)
- Dexie.js 4.2 (IndexedDB wrapper)
- FSRS algorithm (spaced repetition)

**Key Libraries:**
- Radix UI (accessible components)
- Lucide React (icons)
- Recharts (analytics charts)
- Canvas Confetti (celebrations)

## 📦 Quick Start

```bash
# Clone the repository
git clone git@github.com:pankajtanwar1511-dev/lingo-memory.git lingomemory
cd lingomemory

# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🏗️ Project Structure

```
lingomemory/
├── src/                    # Application source code
│   ├── app/                # Next.js pages (17 routes)
│   ├── components/         # React components (69 components)
│   ├── services/           # Business logic (17 services)
│   ├── store/              # State management (Zustand)
│   ├── types/              # TypeScript type definitions
│   ├── lib/                # Utilities & configs
│   └── hooks/              # Custom React hooks
├── public/                 # Runtime assets
│   ├── seed-data/          # Vocabulary JSON files
│   │   ├── N5_vocab_dataset.json (863 cards)
│   │   └── N5_verbs_dataset.json (161 verbs)
│   └── dlingo/             # Dlingo special vocab
│       └── dlingo_vocab_enhanced.json (1000+ entries)
└── docs/                   # Documentation
    ├── README.md           # Documentation index
    ├── APP_OVERVIEW.md     # Complete application guide
    ├── DATA_GUIDE.md       # Dataset details & creation process
    ├── data-source/        # Source data for processing
    ├── vocab_master/       # Vocabulary analysis
    └── dlingo-source/      # Dlingo processing files
```

## 📊 Dataset Statistics

| Dataset | Records | Coverage | File Size |
|---------|---------|----------|-----------|
| N5 Vocabulary | 863 cards | 100% JLPT N5 | ~2 MB |
| N5 Verbs | 161 verbs | All N5 verbs | ~400 KB |
| Dlingo Vocab | 1000+ entries | Specialized vocab | ~1.5 MB |

**Quality Metrics:**
- 98.9% JMdict coverage
- 100% N5 JLPT coverage
- All cards have examples
- All data licensed (CC BY 2.0 FR)

## 🎯 Key Features

### 1. Vocabulary System
- 863 N5 cards with FSRS spaced repetition
- Automatic scheduling based on memory retention
- 4 difficulty levels (Again, Hard, Good, Easy)
- Session statistics and progress tracking

### 2. Verb Learning
- 161 N5 verbs with full conjugation tables
- Flip card interface with customizable views
- Spaced repetition tracking (L0-L5)
- Filter by verb group (Godan, Ichidan, Irregular)
- 2+ example sentences per verb

### 3. Quiz System
- 6 quiz presets (Quick Review, Daily Challenge, JLPT Practice, Speed Challenge, Master Test, LingoSpecial)
- Custom quiz builder
- Multiple question types (JP→EN, EN→JP, Kanji→Kana)
- Smart distractor generation
- Timed mode with countdown
- Score tracking and review

### 4. Dlingo Special
- Numbers (1-10,000)
- Counters (~100 counters)
- Particles (complete reference)
- Calendar (days, months, dates)
- Clock (time expressions)

### 5. Progress Tracking
- Daily study streak
- Calendar heatmap
- Analytics charts
- Milestone achievements
- Study time tracking

### 6. PWA Support
- Offline functionality
- Installable on desktop/mobile
- Service worker caching
- Works without internet after first load

## 📚 Documentation

**Main Documentation:**
- **[docs/README.md](docs/README.md)** - Documentation index and quick start
- **[docs/APP_OVERVIEW.md](docs/APP_OVERVIEW.md)** - Complete application guide (700+ lines)
  - All 17 routes documented
  - Architecture overview
  - Component breakdown
  - User workflows
- **[docs/DATA_GUIDE.md](docs/DATA_GUIDE.md)** - Dataset details (600+ lines)
  - Data creation process (3-phase pipeline)
  - Quality metrics
  - Data schema
  - How to modify data

**Additional Resources:**
- **[PROJECT_HISTORY.md](PROJECT_HISTORY.md)** - Development history and changelog
- **[CREDITS.md](CREDITS.md)** - Attribution and licensing

## 🎨 Design System

**Color Palette:**
- Primary: Purple (#6B46C1) - Wisdom and learning
- Secondary: Blue (#0EA5E9) - Progress and success
- Success: Green (#10B981) - Correct answers
- Warning: Amber (#F59E0B) - Reviews due
- Danger: Red (#EF4444) - Incorrect answers

**Typography:**
- Body: Inter font family
- Japanese: Noto Sans JP

## 🚀 Deployment

**Build:**
```bash
npm run build
```

**Deployment Options:**
- Vercel (recommended, zero-config)
- Netlify
- AWS S3 + CloudFront
- Any static host

**Browser Compatibility:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

**Before contributing:**
1. Read `docs/README.md` for setup
2. Review `docs/APP_OVERVIEW.md` for architecture
3. Check `docs/DATA_GUIDE.md` for data structures

## 📄 License

This project uses open-source vocabulary data:
- **JMdict** (EDRDG) - CC BY-SA 3.0
- **Tatoeba Project** - CC BY 2.0 FR

See [CREDITS.md](CREDITS.md) for complete attribution.

## 🙏 Credits

- Vocabulary data from [JMdict](http://www.edrdg.org/jmdict/j_jmdict.html)
- Example sentences from [Tatoeba](https://tatoeba.org)
- Icons from [Lucide](https://lucide.dev)
- UI components from [Radix UI](https://radix-ui.com)

## 📧 Contact

For questions or feedback, please open an issue on [GitHub](https://github.com/pankajtanwar1511-dev/lingo-memory/issues).

---

**Built with ❤️ for Japanese learners worldwide**

**Last Updated:** February 16, 2026
