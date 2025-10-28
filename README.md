# JapVocab - Master Japanese with Science-Backed Learning

A modern, beautiful Japanese vocabulary learning app built with Next.js 14, TypeScript, and Tailwind CSS. Features FSRS spaced repetition algorithm, authentic content from JMdict and Tatoeba, and a delightful learning experience.

## 🚀 Features

- **FSRS Algorithm**: Science-backed spaced repetition for optimal retention
- **Authentic Content**: Real Japanese from verified sources with proper attribution
- **401 N5 Words Ready**: Verified vocabulary with authentic examples from Tatoeba/JMdict
- **Beautiful UI**: Modern design with smooth animations and dark mode support
- **PWA Ready**: Works offline, installable on all devices
- **JLPT Aligned**: Structured learning path from N5 to N1
- **TypeScript**: Full type safety throughout the codebase

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **State Management**: Zustand 4.5
- **Database**: IndexedDB with Dexie 4.2
- **Validation**: Zod 4.x

## 📦 Installation

```bash
# Clone the repository
git clone git@github.com:pankajtanwar1511-dev/lingo-memory.git japvocab
cd japvocab

# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000 in your browser
```

## 🏗️ Project Structure

```
japvocab/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components (30+)
│   ├── services/         # Business logic (14 services)
│   ├── store/            # State management (Zustand)
│   ├── types/            # TypeScript type definitions
│   ├── schemas/          # Zod validation schemas
│   ├── lib/              # Utility functions (JMdict parser, etc.)
│   └── hooks/            # Custom React hooks
├── public/
│   ├── icons/            # PWA icons
│   └── seed-data/        # N5 & N4 vocabulary datasets
├── data/
│   ├── verification/     # AI verification (batches, results, prompts)
│   ├── production/       # Production-ready categorized examples
│   ├── archive/          # Backups and old datasets
│   └── backups/          # Dataset backups
├── scripts/
│   ├── verification/     # AI verification scripts (Python)
│   └── deprecated/       # Old audio scripts (not in use)
├── docs/                 # Documentation (01-08 + archive)
├── reports/              # Validation reports & metrics
└── tools/                # HTML utilities (reset DB, etc.)
```

## 🎨 Design System

### Color Palette

- **Primary**: Purple (#6B46C1) - Wisdom and learning
- **Secondary**: Blue (#0EA5E9) - Progress and success
- **Success**: Green (#10B981) - Correct answers
- **Warning**: Amber (#F59E0B) - Reviews due
- **Danger**: Red (#EF4444) - Incorrect answers

### Typography

- **Body**: Inter font family
- **Japanese**: Noto Sans JP

## 🚦 Getting Started

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Add your environment variables here (coming in Phase 2)
NEXT_PUBLIC_API_URL=your_api_url
```

## 📈 Current Status

**Production Readiness:** 58.5%

### ✅ Completed (Phase 1, 2 & 3)

- ✅ **Core Application**: Next.js 14, full component library, study system
- ✅ **Services**: 14 business logic services implemented
- ✅ **Database**: IndexedDB with Dexie, seed loading, import/export
- ✅ **UI/UX**: Flashcards, quiz mode, progress tracking, dark mode
- ✅ **Data Pipeline**: Automated pipeline with Tatoeba/JMdict integration
- ✅ **AI Verification**: 38 batches (1,859 examples) manually verified by Claude
- ✅ **N5 Dataset**: 387 words production-ready (2+ verified examples each)
- ✅ **Quality Control**: All examples verified for N5 grammar, kana accuracy, vocab presence
- ✅ **Documentation**: 8 comprehensive guides + archived history

### 🚧 In Progress

- 🚧 **N5 Completion**: 387/662 production-ready → 275 need examples
  - 115 cards with 1 example (need 1 more)
  - 160 cards with 0 examples (need 2 new)
- 🚧 **N4 Dataset**: Not yet processed (planned for later)
- 🚧 **Audio Generation**: Planned with official LLM models (TTS removed)

### 📋 Next Phase

- [ ] Generate examples for 275 remaining N5 words (AI-assisted)
- [ ] Audio generation with licensed TTS
- [ ] Firebase authentication activation
- [ ] Cloud sync with Firestore
- [ ] Testing suite (unit + integration)

See `docs/07_DEVELOPMENT_ROADMAP.md` for detailed roadmap

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

1. **[Getting Started](docs/01_GETTING_STARTED.md)** - Installation & quick start
2. **[Architecture](docs/02_ARCHITECTURE.md)** - Technical deep dive
3. **[Data Pipeline](docs/03_DATA_PIPELINE.md)** - Data processing guide
4. **[Data Schema](docs/04_DATA_SCHEMA.md)** - Complete schema reference
5. **[Audio Production](docs/05_AUDIO_PRODUCTION.md)** - TTS setup & migration
6. **[Project History](docs/06_PROJECT_HISTORY.md)** - Timeline & milestones
7. **[Development Roadmap](docs/07_DEVELOPMENT_ROADMAP.md)** - Future plans
8. **[Quality Assurance](docs/08_QUALITY_ASSURANCE.md)** - Validation & review

**Historical Docs:** See `docs/archive/` for 49 archived development logs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

**Before contributing:**
- Read `docs/01_GETTING_STARTED.md` for setup
- Check `docs/07_DEVELOPMENT_ROADMAP.md` for priorities
- Review `docs/08_QUALITY_ASSURANCE.md` for quality standards

## 📄 License

This project uses open-source vocabulary data:
- JMdict (EDRDG) - CC BY-SA 4.0
- Tatoeba Project - CC BY 2.0

## 🙏 Credits

- Vocabulary data from [JMdict](http://www.edrdg.org/jmdict/j_jmdict.html)
- Example sentences from [Tatoeba](https://tatoeba.org)
- Icons from [Lucide](https://lucide.dev)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com)

## 📧 Contact

For questions or feedback, please open an issue on [GitHub](https://github.com/pankajtanwar1511-dev/lingo-memory).

---

Built with ❤️ for Japanese learners worldwide