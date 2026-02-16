# LingoMemory Architecture

**Last Updated:** October 28, 2024

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Application Architecture](#application-architecture)
4. [Services Layer](#services-layer)
5. [Data Flow](#data-flow)
6. [State Management](#state-management)
7. [Database Design](#database-design)

---

## Overview

LingoMemory is a modern web application built with Next.js 14, featuring a clean separation of concerns through a service-oriented architecture. The app follows best practices for Progressive Web Apps (PWA) and offline-first design.

### Key Architectural Principles

- **Service-Oriented**: Business logic isolated in service classes
- **Type-Safe**: Full TypeScript coverage with Zod validation
- **Offline-First**: IndexedDB for local storage, sync when online
- **Component-Based**: Reusable UI components with Radix UI
- **Progressive Enhancement**: Works without JavaScript, enhanced with it

---

## Tech Stack

### Frontend Framework

- **Next.js 14** (App Router)
  - Server Components for initial load
  - Client Components for interactivity
  - API routes for backend logic
  - Built-in optimization (images, fonts, code splitting)

### Language & Type Safety

- **TypeScript 5.3**
  - Strict mode enabled
  - Path aliases configured (`@/components`, `@/services`)
  - Comprehensive type definitions in `src/types/`

- **Zod 4.x**
  - Runtime validation
  - Schema definitions in `src/schemas/`
  - Type inference from schemas

### Styling & UI

- **Tailwind CSS 3.4**
  - Utility-first styling
  - Custom theme in `tailwind.config.ts`
  - Dark mode support with `next-themes`

- **Radix UI**
  - Accessible, unstyled components
  - Dialog, Dropdown, Progress, Switch, Tabs, Toast
  - ARIA-compliant

- **Framer Motion 11**
  - Smooth animations
  - Page transitions
  - Card flip animations

### Data Management

- **Dexie 4.2** (IndexedDB wrapper)
  - Type-safe database queries
  - Reactive hooks with `dexie-react-hooks`
  - Migration support

- **Zustand 4.5** (State management)
  - Lightweight alternative to Redux
  - Simple API with hooks
  - Persist middleware for localStorage

### Additional Libraries

- **Fuse.js 7.x**: Fuzzy search for vocabulary
- **date-fns 4.x**: Date manipulation
- **Recharts 3.x**: Analytics charts
- **Papa Parse 5.x**: CSV parsing

---

## Application Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router (pages)
├── components/             # React components
├── services/              # Business logic layer ⭐
├── store/                 # Zustand stores
├── types/                 # TypeScript definitions
├── schemas/               # Zod validation schemas
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── contexts/              # React contexts
└── data/                  # Static seed data
```

### Component Hierarchy

```
app/layout.tsx (Root Layout)
├── Providers (Theme, Toast, etc.)
├── Navigation
└── app/*/page.tsx (Page Components)
    ├── Layout Components (Header, Sidebar, Footer)
    ├── Feature Components (FlashCard, VocabList, QuizCard)
    └── UI Components (Button, Dialog, etc.)
```

### Data Flow Pattern

```
User Interaction
    ↓
React Component
    ↓
Service Layer ⭐ (Business Logic)
    ↓
IndexedDB (Local Storage)
    ↓
(Optional) Cloud Sync → Firestore
```

---

## Services Layer

The heart of LingoMemory's architecture. All business logic lives in services (src/services/), keeping components clean and testable.

### Core Services (14 Total)

#### 1. **database.service.ts** (13KB)

Manages IndexedDB with Dexie.

```typescript
class DatabaseService {
  private db: Dexie

  // Stores
  vocabulary: Dexie.Table<VocabularyCard>
  progress: Dexie.Table<StudyProgress>
  settings: Dexie.Table<Settings>

  // Methods
  async initialize(): Promise<void>
  async clearAll(): Promise<void>
  async export(): Promise<Blob>
  async import(data: Blob): Promise<void>
}
```

**Key Features:**
- Schema versioning with migrations
- Bulk operations for performance
- Transaction support
- Export/import functionality

#### 2. **seed-loader.service.ts** (7.5KB)

Loads initial vocabulary data from JSON files.

```typescript
class SeedLoaderService {
  async loadN5(): Promise<void>
  async loadN4(): Promise<void>
  async loadAll(force?: boolean): Promise<void>
  async getLoadedStatus(): Promise<LoadStatus>
}
```

**Process:**
1. Check if data already loaded (skip if exists)
2. Fetch JSON from `public/seed-data/`
3. Validate with Zod schemas
4. Bulk insert into IndexedDB
5. Track loaded datasets in localStorage

#### 3. **content-import.service.ts** (12KB)

Imports vocabulary from external sources (JMdict, custom CSV).

```typescript
class ContentImportService {
  async importFromJMdict(file: File): Promise<ImportResult>
  async importFromCSV(file: File): Promise<ImportResult>
  async validateImport(data: unknown): Promise<ValidationResult>
}
```

**Features:**
- Schema validation before import
- Duplicate detection
- Progress reporting
- Error handling with rollback

#### 4. **sentence-matcher.service.ts** (11KB)

Matches vocabulary words to example sentences from Tatoeba corpus.

```typescript
class SentenceMatcherService {
  async matchSentences(
    card: VocabularyCard,
    corpus: TatoebaCorpus,
    options: MatchOptions
  ): Promise<Example[]>

  private scoreMatch(sentence: string, word: string): number
}
```

**Matching Algorithm:**
1. Tokenize sentence (morphological analysis)
2. Check if target word appears
3. Score by position, frequency, sentence length
4. Filter by minimum score threshold
5. Return top N matches

#### 5. **quality-scorer.service.ts** (13KB)

Validates data quality and scores cards.

```typescript
class QualityScorerService {
  scoreCard(card: VocabularyCard): QualityScore {
    return {
      overall: number,        // 0-100
      completeness: number,   // Has all required fields?
      examples: number,       // Good examples?
      audio: number,          // Audio available?
      consistency: number,    // Data consistent?
      issues: Issue[]
    }
  }
}
```

**Scoring Breakdown:**
- **Completeness (40 pts)**: kanji, kana, meaning, JLPT level
- **Examples (30 pts)**: 2+ examples, proper format
- **Audio (20 pts)**: Audio URL present and valid
- **Consistency (10 pts)**: Romaji matches kana, etc.

#### 6. **audio-generator.service.ts** (7.8KB)

Generates TTS audio files.

```typescript
class AudioGeneratorService {
  async generateAudio(
    text: string,
    options: AudioOptions
  ): Promise<AudioResult>

  async batchGenerate(
    cards: VocabularyCard[]
  ): Promise<BatchResult>
}
```

**Supported TTS:**
- Google Cloud TTS (production)
- Edge TTS (development only)
- Mock mode (testing)

#### 7. **analytics.service.ts** (13.5KB)

Tracks learning progress and generates insights.

```typescript
class AnalyticsService {
  async recordStudySession(session: StudySession): Promise<void>
  async getProgress(timeRange: TimeRange): Promise<ProgressData>
  async getPredictions(): Promise<Predictions>
}
```

**Metrics Tracked:**
- Cards studied per day
- Accuracy rate
- Streak days
- Time spent studying
- Cards due for review
- Predicted success rate (FSRS)

#### 8. **sync.service.ts** (13.7KB)

Syncs data with Firestore.

```typescript
class SyncService {
  async syncUp(): Promise<SyncResult>    // Local → Cloud
  async syncDown(): Promise<SyncResult>  // Cloud → Local
  async resolvConflicts(conflicts: Conflict[]): Promise<void>
}
```

**Sync Strategy:**
- Last-write-wins for settings
- Merge strategy for study progress
- Conflict detection and resolution
- Offline queue for pending changes

#### 9. **auth.service.ts** (7KB)

Firebase authentication wrapper.

```typescript
class AuthService {
  async signIn(email: string, password: string): Promise<User>
  async signUp(email: string, password: string): Promise<User>
  async signOut(): Promise<void>
  async resetPassword(email: string): Promise<void>
  onAuthStateChanged(callback: (user: User | null) => void)
}
```

#### 10. **settings.service.ts** (10.4KB)

Manages user preferences.

```typescript
class SettingsService {
  async getSettings(): Promise<Settings>
  async updateSettings(updates: Partial<Settings>): Promise<void>
  async resetToDefaults(): Promise<void>
}
```

**Settings Managed:**
- Theme (light/dark/system)
- Daily study goal
- Auto-play audio
- Notification preferences
- Study mode preferences

#### 11-14. **Other Services**

- **content-stats.service.ts** (9.2KB): Content statistics
- **tatoeba-parser.service.ts** (8.4KB): Parse Tatoeba TSV files
- **batch-import.service.ts** (12.5KB): Batch processing
- **review-generator.service.ts**: Generate review tasks

---

## Data Flow

### Study Session Flow

```
1. User opens /study
   ↓
2. Component calls StudyStore.loadDueCards()
   ↓
3. StudyStore calls DatabaseService.getDueCards()
   ↓
4. DatabaseService queries IndexedDB
   ↓
5. FSRS algorithm calculates due cards
   ↓
6. Cards returned to component
   ↓
7. User rates card (Again/Hard/Good/Easy)
   ↓
8. Component calls StudyStore.submitRating()
   ↓
9. StudyStore updates progress via DatabaseService
   ↓
10. IndexedDB updated
   ↓
11. (Optional) SyncService.syncUp() to Firestore
```

### Data Import Flow

```
1. User uploads CSV/JSON
   ↓
2. ContentImportService.importFromCSV()
   ↓
3. Parse file with PapaParse
   ↓
4. Validate with Zod schema
   ↓
5. Check for duplicates
   ↓
6. QualityScorerService.scoreCard() for each
   ↓
7. Bulk insert to IndexedDB
   ↓
8. Return import report
```

---

## State Management

### Zustand Stores

#### StudyStore (`src/store/study-store.ts`)

```typescript
interface StudyStore {
  // State
  currentCard: VocabularyCard | null
  dueCards: VocabularyCard[]
  sessionStats: SessionStats

  // Actions
  loadDueCards: () => Promise<void>
  submitRating: (rating: Rating) => Promise<void>
  skipCard: () => void
  endSession: () => Promise<SessionSummary>
}
```

#### QuizStore (`src/store/quiz-store.ts`)

```typescript
interface QuizStore {
  // State
  questions: QuizQuestion[]
  currentIndex: number
  score: number

  // Actions
  startQuiz: (options: QuizOptions) => Promise<void>
  answerQuestion: (answer: string) => void
  nextQuestion: () => void
  endQuiz: () => QuizResult
}
```

### When to Use Store vs Service

**Use Store for:**
- UI state (current card, loading states)
- Session-scoped data (quiz progress)
- Derived state (computed values)

**Use Service for:**
- Data persistence (IndexedDB, API calls)
- Business logic (FSRS calculations, scoring)
- Side effects (sync, analytics)

---

## Database Design

### IndexedDB Schema (Dexie)

```typescript
const db = new Dexie('LingoMemoryDB')

db.version(1).stores({
  vocabulary: 'id, jlptLevel, [jlptLevel+createdAt]',
  progress: 'cardId, nextReview, [nextReview+cardId]',
  settings: 'key',
  sessions: '++id, startedAt',
  analytics: '++id, date, [userId+date]'
})
```

### Indexes Explained

- **Primary**: `id` (unique identifier)
- **Single**: `jlptLevel` (filter by level)
- **Compound**: `[jlptLevel+createdAt]` (filter + sort)
- **Auto-increment**: `++id` (generated ID)

### Query Examples

```typescript
// Get all N5 cards
await db.vocabulary
  .where('jlptLevel').equals('N5')
  .toArray()

// Get cards due for review
const now = new Date()
await db.progress
  .where('nextReview').below(now)
  .toArray()

// Compound index query
await db.vocabulary
  .where('[jlptLevel+createdAt]')
  .between(['N5', new Date('2024-01-01')],
           ['N5', new Date('2024-12-31')])
  .toArray()
```

---

## Performance Considerations

### Code Splitting

- Dynamic imports for large components
- Route-based splitting (automatic with App Router)
- Service lazy-loading

### Database Optimization

- Indexed queries (avoid `toArray()` without `where()`)
- Bulk operations over individual inserts
- Transaction batching

### Caching Strategy

- IndexedDB as primary cache
- localStorage for settings
- Service Worker for offline assets (PWA)

---

## Security

### Data Protection

- No sensitive data stored in localStorage
- IndexedDB not accessible cross-origin
- Firebase security rules for Firestore

### Authentication

- Firebase Auth with email/password
- Secure token storage (httpOnly cookies)
- Session management

---

## Testing Strategy

### Unit Tests

- Service logic (pure functions)
- Utility functions
- Validation schemas

### Integration Tests

- Service + Database interaction
- Component + Service integration

### E2E Tests

- Critical user flows (study, quiz)
- Import/export functionality

---

## Deployment

### Build Process

```bash
npm run build
# Creates optimized production build in .next/
```

### Environment Variables

```env
# Production
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
DATABASE_URL=... (if using external DB)
```

### Hosting Options

- **Vercel**: Recommended (Next.js creators)
- **Netlify**: Alternative
- **Self-hosted**: Docker container

---

## Future Improvements

- [ ] Add unit tests for services
- [ ] Implement service worker for offline
- [ ] Add database migration testing
- [ ] Performance monitoring (Web Vitals)
- [ ] Error tracking (Sentry)

---

**For more details, see:**
- `01_GETTING_STARTED.md` - Setup and installation
- `04_DATA_SCHEMA.md` - Complete data schema reference
- `03_DATA_PIPELINE.md` - Data processing workflow
