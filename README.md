# JapVocab - Master Japanese with Science-Backed Learning

A modern, beautiful Japanese vocabulary learning app built with Next.js 14, TypeScript, and Tailwind CSS. Features FSRS spaced repetition algorithm, authentic content from JMdict and Tatoeba, and a delightful learning experience.

## 🚀 Features

- **FSRS Algorithm**: Science-backed spaced repetition for optimal retention
- **Authentic Content**: Real Japanese from verified sources with proper attribution
- **Beautiful UI**: Modern design with smooth animations and dark mode support
- **PWA Ready**: Works offline, installable on all devices
- **JLPT Aligned**: Structured learning path from N5 to N1
- **TypeScript**: Full type safety throughout the codebase

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **State Management**: Zustand (coming in Phase 2)
- **Database**: IndexedDB with Dexie (coming in Phase 2)

## 📦 Installation

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

## 🏗️ Project Structure

```
japvocab/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   └── layout/      # Layout components
│   ├── data/            # Sample vocabulary data
│   ├── lib/             # Utility functions
│   ├── types/           # TypeScript type definitions
│   └── store/           # State management (Zustand)
├── public/              # Static assets
├── tailwind.config.ts   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
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

## 📈 Development Phases

### Phase 1: Foundation (Current)
- ✅ Next.js setup with TypeScript
- ✅ Tailwind CSS with custom theme
- ✅ Base component library
- ✅ Sample flashcard component
- ✅ N5 vocabulary data
- ✅ Beautiful landing page

### Phase 2: Core Features (Coming Next)
- [ ] FSRS algorithm implementation
- [ ] IndexedDB integration with Dexie
- [ ] PWA manifest and service worker
- [ ] Firebase authentication
- [ ] Cloud sync with Firestore

### Phase 3: Premium Features
- [ ] Stripe payment integration
- [ ] Premium audio recordings
- [ ] Advanced analytics
- [ ] Import/Export functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

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

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ for Japanese learners worldwide