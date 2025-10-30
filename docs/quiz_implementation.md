# Quiz Implementation Document

**Project:** LingoMemory Quiz System
**Created:** 2025-01-31
**Current Branch:** `quiz_mode_updation`
**Status:** 🔄 In Progress - Enhancements Phase

---

## 🎯 Current Status

**Overall Completion: 93%**
- ✅ Basic Quiz Setup: 100%
- ✅ Question Types: 80% (3/4 modes implemented)
- ✅ Content Support: 100% (Vocabulary + Kanji + Mixed)
- ⏸️ Bug Fixes: 0% (Audio tasks skipped for later)
- ✅ Display Improvements: 100% (Kanji size, readings)
- ✅ JLPT Filtering: 100%
- ✅ Review System: 100% (Track & review incorrect answers)
- ✅ Advanced Features: 100% (Mixed content, Bookmarks complete)
- ✅ Statistics & Analytics: 100% (Per-card stats, Learning curve, Weak areas complete)
- ✅ Study Enhancements: 67% (Daily goals, Streaks complete; FSRS deferred)
- ✅ UX Enhancements: 100% (Keyboard shortcuts, confetti, dark mode complete)

---

## 📋 Current Implementation

### Completed Features ✅

#### 1. Content Type Support
**Files:** `src/types/quiz.ts`, `src/components/quiz/quiz-setup.tsx`
- **Vocabulary Quizzes**: Full support with all modes
- **Kanji Quizzes**: Multiple choice, Typing, Flashcard modes
- Content type selector in setup screen
- Auto-switches quiz directions based on content type

#### 2. Quiz Modes
**File:** `src/lib/quiz-generator.ts`
- ✅ **Multiple Choice**: 4-6 options based on difficulty
- ✅ **Typing**: Free text input with multiple valid answers
- ✅ **Listening**: Audio playback with multiple choice (vocabulary only)
- ⚠️ **Sentence Completion**: Implemented but needs testing
- ❌ **Flashcard**: Defined but not in quiz flow

#### 3. Quiz Directions

**Vocabulary:**
- Japanese → English
- English → Japanese
- Kanji → Reading
- Reading → Kanji

**Kanji:**
- Kanji → Meaning
- Meaning → Kanji
- Kanji → Reading
- Reading → Kanji

#### 4. Difficulty Levels
**File:** `src/types/quiz.ts` (lines 118-137)

| Difficulty | Questions | Time Limit | Hints | Choices |
|------------|-----------|------------|-------|---------|
| Easy       | 10        | None       | Yes   | 4       |
| Medium     | 20        | 60s        | Yes   | 4       |
| Hard       | 30        | 30s        | No    | 6       |

#### 5. Quiz Settings
**File:** `src/components/quiz/quiz-setup.tsx`
- Content type selection (Vocabulary/Kanji)
- Mode selection (Multiple Choice/Typing/Listening)
- Direction selection (context-aware)
- Difficulty presets (Easy/Medium/Hard)
- Question count slider (5-100)
- Time limit toggle (10-300 seconds)
- Show hints toggle
- Auto-play audio toggle
- Auto-advance toggle
- Strict typing mode (for typing questions)
- Case sensitive toggle (for typing questions)

#### 6. Quiz Question Component
**File:** `src/components/quiz/quiz-question.tsx`
- Question display with number/total
- Timer with progress bar
- Multiple choice buttons with A/B/C/D labels
- Typing input with Enter key support
- Hint system (shows on button click)
- Skip button
- Submit button
- Answer feedback (green for correct, red for incorrect)
- Auto-timeout handling

#### 7. Quiz Results
**File:** `src/components/quiz/quiz-results.tsx`
- Score percentage
- Accuracy percentage (excluding skipped)
- Total time spent
- Average time per question
- Perfect answers count (correct with no hints)
- Correct/Incorrect/Skipped breakdown
- Retry button
- New Quiz button
- View Progress button

#### 8. Quiz Store
**File:** `src/store/quiz-store.ts`
- Zustand state management
- Persistent storage (localStorage)
- Session tracking
- Answer history
- Progress tracking
- Statistics accumulation

#### 9. Data Loading
**File:** `src/app/quiz/page.tsx`
- Loads vocabulary from IndexedDB (via hooks)
- Loads kanji from `/seed-data/kanji_n5.json`
- Shows available card counts for each type
- Loading states and error handling

---

## 🐛 Known Issues (Priority Order)

### 🔴 Critical - Must Fix

#### Issue #1: Audio Playback Bug for Kanji Cards
**File:** `src/components/quiz/quiz-question.tsx:106`
**Problem:**
```typescript
const textToSpeak = question.card.kanji || question.card.kana
```
This assumes `VocabularyCard` structure. Kanji cards have:
- `card.kanji` (the kanji character)
- No `kana` field
- Instead: `onReadings[]` and `kunReadings[]`

**Impact:** Listening mode will crash if used with kanji (though currently disabled in UI)

**Fix Required:**
- Add type guard to check `question.contentType`
- For kanji: use `card.kanji` as text
- For vocabulary: use existing logic

**Status:** ⏳ Not started

---

### 🟡 High Priority - Should Fix Soon

#### Issue #2: Kanji Character Display Too Small
**File:** `src/components/quiz/quiz-question.tsx:224`
**Problem:** Kanji shown in regular `text-3xl` (same as English text)
**Expected:** Kanji should be much larger (6xl or 7xl) for readability

**Fix Required:**
- Detect if question is kanji-based
- Apply larger font size for kanji questions
- Maybe add stroke count display near question

**Status:** ⏳ Not started

---

## 🎨 Planned Enhancements

### Phase 1: Bug Fixes & Display Improvements (Current Priority)

#### Task 1.1: Fix Audio Bug for Kanji Cards ⏸️ SKIPPED
**Estimate:** 30 minutes
**Status:** ⏸️ **SKIPPED - All audio features will be implemented together later**

**Note:** This task is part of the larger audio implementation effort. Will be completed when we do the comprehensive audio feature implementation.

**Files to modify:**
- `src/components/quiz/quiz-question.tsx`

**Implementation:**
```typescript
const playQuestionAudio = async () => {
  audioService.stop()

  if (question.mode === "listening") {
    let textToSpeak = ""

    if (question.contentType === "kanji") {
      // For kanji, just speak the character
      textToSpeak = question.card.kanji
    } else {
      // For vocabulary, use kanji or kana
      textToSpeak = question.card.kanji || question.card.kana
    }

    // ... rest of implementation
  }
}
```

**Acceptance Criteria:**
- [ ] Listening mode works for vocabulary cards
- [ ] Listening mode disabled for kanji (or works if enabled)
- [ ] No TypeScript errors
- [ ] No runtime crashes

---

#### Task 1.2: Improve Kanji Display Size ✅ COMPLETE
**Estimate:** 1 hour
**Completed:** 2025-01-31
**Files modified:**
- `src/components/quiz/quiz-question.tsx`

**Implementation:**
```typescript
<h2 className={`font-bold mb-2 text-foreground ${
  question.contentType === "kanji"
    ? "text-7xl"
    : "text-3xl"
}`}>
  {question.question}
</h2>

{/* Add stroke count for kanji */}
{question.contentType === "kanji" && "strokeCount" in question.card && (
  <p className="text-sm text-muted-foreground mt-2">
    Stroke count: {question.card.strokeCount}
  </p>
)}
```

**Acceptance Criteria:**
- [x] Kanji displayed at 7xl font size
- [x] Vocabulary displayed at 3xl font size
- [x] Stroke count shown for kanji questions
- [x] Responsive on mobile
- [x] Added text-foreground for better dark mode contrast

---

#### Task 1.3: Add Reading Pronunciation Display ✅ COMPLETE
**Estimate:** 1 hour
**Completed:** 2025-01-31
**Files modified:**
- `src/components/quiz/quiz-question.tsx`

**Implementation:**
Show on-yomi and kun-yomi readings for kanji questions after user answers (kanji-to-meaning direction)

```typescript
{/* Show readings for kanji-to-meaning questions (after they answer) */}
{question.contentType === "kanji" &&
 question.direction === "kanji-to-meaning" &&
 "onReadings" in question.card &&
 "kunReadings" in question.card &&
 hasAnswered && (
  <div className="text-sm text-muted-foreground mt-3 space-x-3">
    {question.card.onReadings.length > 0 && (
      <span className="inline-block">
        <span className="font-semibold">音:</span> {question.card.onReadings.join(", ")}
      </span>
    )}
    {question.card.kunReadings.length > 0 && (
      <span className="inline-block">
        <span className="font-semibold">訓:</span> {question.card.kunReadings.join(", ")}
      </span>
    )}
  </div>
)}
```

**Acceptance Criteria:**
- [x] Shows on-yomi (音読み) in katakana
- [x] Shows kun-yomi (訓読み) in hiragana
- [x] Only displays for kanji-to-meaning direction
- [x] Doesn't spoil the answer (shows after answer submitted)
- [x] Properly styled with font-semibold labels

---

### Phase 2: JLPT Level Filtering

#### Task 2.1: Add JLPT Filter to Quiz Setup ✅ COMPLETE
**Estimate:** 2 hours
**Completed:** 2025-01-31
**Files modified:**
- `src/components/quiz/quiz-setup.tsx`
- `src/app/quiz/page.tsx`
- `src/types/quiz.ts`

**Implementation:**
Added JLPT level selector with buttons for All, N5, N4, N3, N2, N1

```typescript
// In quiz-setup.tsx
const [jlptLevel, setJlptLevel] = useState<string>("All")

{/* JLPT Level Filter */}
<div>
  <label className="text-sm font-medium mb-3 block">JLPT Level</label>
  <div className="grid grid-cols-3 gap-2">
    {["All", "N5", "N4", "N3", "N2", "N1"].map((level) => (
      <Button
        key={level}
        variant={jlptLevel === level ? "default" : "outline"}
        onClick={() => setJlptLevel(level)}
        size="sm"
        className={level === "All" ? "col-span-3" : ""}
      >
        {level}
      </Button>
    ))}
  </div>
</div>

// In quiz/page.tsx - filtering logic
if (settings.jlptLevel && settings.jlptLevel !== "All") {
  cards = cards.filter(card => card.jlptLevel === settings.jlptLevel)
}
```

**Acceptance Criteria:**
- [x] JLPT filter in setup screen with 6 buttons
- [x] Filters both kanji and vocabulary
- [x] "All" option includes all levels and spans 3 columns
- [x] Shows error message if no cards available at level
- [x] jlptLevel added to QuizSettings interface

---

#### Task 2.2: Mixed Content Quiz Option ✅ COMPLETE
**Estimate:** 3 hours
**Completed:** 2025-01-31
**Files modified:**
- `src/types/quiz.ts`
- `src/components/quiz/quiz-setup.tsx`
- `src/app/quiz/page.tsx`
- `src/lib/quiz-generator.ts`

**Implementation:**
Added "Mixed" as a third content type option

```typescript
// src/types/quiz.ts
export type QuizContentType = "vocabulary" | "kanji" | "mixed"

// src/components/quiz/quiz-setup.tsx
<ModeCard
  icon={<Brain className="h-5 w-5" />}
  title="Mixed"
  description={`${availableVocabCount + availableKanjiCount} total cards`}
  selected={contentType === "mixed"}
  onClick={() => handleContentTypeChange("mixed")}
/>

// src/app/quiz/page.tsx
if (settings.contentType === "mixed") {
  cards = [...availableVocabCards, ...kanjiCards]
} else if (settings.contentType === "vocabulary") {
  cards = availableVocabCards
} else {
  cards = kanjiCards
}

// src/lib/quiz-generator.ts
if (settings.contentType === "mixed") {
  // Determine card type dynamically
  if ("kana" in card) {
    const vocabCards = allCards.filter((c): c is VocabularyCard => "kana" in c)
    question = createVocabQuestion(card as VocabularyCard, settings, vocabCards)
  } else {
    const kanjiCards = allCards.filter((c): c is KanjiCard => "strokeCount" in c)
    question = createKanjiQuestion(card as KanjiCard, settings, kanjiCards)
  }
}
```

**Acceptance Criteria:**
- [x] "Mixed" option in content type selector with Brain icon
- [x] Questions randomly interleave vocab and kanji
- [x] Only shows compatible quiz directions (japanese-to-english, english-to-japanese)
- [x] Maintains difficulty settings across both types
- [x] Proper card type detection using type guards
- [x] Correct distractors for multiple choice (vocab with vocab, kanji with kanji)

---

### Phase 3: Review Wrong Answers

#### Task 3.1: Track Incorrect Answers ✅ COMPLETE
**Estimate:** 2 hours
**Completed:** 2025-01-31
**Files modified:**
- `src/store/quiz-store.ts`
- `src/types/quiz.ts`

**Implementation:**
Added `IncorrectQuestionDetail` interface and `incorrectQuestionDetails` field to `QuizResult`

```typescript
// src/types/quiz.ts
export interface IncorrectQuestionDetail {
  question: QuizQuestion
  userAnswer: string
  correctAnswer: string | string[]
  timeSpent: number
  hintsUsed: number
}

export interface QuizResult {
  // ... existing fields
  incorrectQuestionDetails?: IncorrectQuestionDetail[]
}

// src/store/quiz-store.ts - in endQuiz()
const incorrectQuestionDetails = currentSession.answers
  .map((answer, index) => {
    if (!answer.isCorrect && answer.userAnswer !== "") {
      return {
        question: currentSession.questions[index],
        userAnswer: answer.userAnswer,
        correctAnswer: answer.correctAnswer,
        timeSpent: answer.timeSpent,
        hintsUsed: answer.hintsUsed
      }
    }
    return null
  })
  .filter((detail): detail is NonNullable<typeof detail> => detail !== null)
```

**Acceptance Criteria:**
- [x] Wrong answers stored in result with full details
- [x] Includes original question data (card, mode, direction, etc.)
- [x] Includes what user answered vs correct answer
- [x] Persists in session history (via Zustand persist middleware)
- [x] Type-safe with proper TypeScript interfaces

---

#### Task 3.2: Review Mode UI ✅ COMPLETE
**Estimate:** 3 hours
**Completed:** 2025-01-31
**Files modified:**
- `src/components/quiz/quiz-results.tsx`
- `src/app/quiz/page.tsx`
- `src/store/quiz-store.ts`

**Implementation:**
Added "Review Mistakes" button and `startReviewQuiz` function

```typescript
// src/store/quiz-store.ts
startReviewQuiz: (incorrectDetails, originalSettings) => {
  // Use the questions from incorrect answers directly
  const questions = incorrectDetails.map(detail => detail.question)
  const sessionId = `review_${Date.now()}`

  const session: QuizSession = {
    id: sessionId,
    settings: originalSettings,
    questions,
    // ... rest of session setup
  }

  set({ currentSession: session, currentQuestionIndex: 0 })
}

// src/components/quiz-results.tsx
{result.incorrectQuestionDetails && result.incorrectQuestionDetails.length > 0 && onReviewMistakes && (
  <Button
    variant="outline"
    onClick={onReviewMistakes}
    className="flex-1 gap-2 border-orange-600 text-orange-600"
  >
    <X className="h-4 w-4" />
    Review Mistakes ({result.incorrectQuestionDetails.length})
  </Button>
)}

// src/app/quiz/page.tsx
const handleReviewMistakes = () => {
  if (!currentSession) return

  const incorrectDetails = currentSession.answers
    .map((answer, index) => {
      if (!answer.isCorrect && answer.userAnswer !== "") {
        return {
          question: currentSession.questions[index],
          userAnswer: answer.userAnswer,
          correctAnswer: answer.correctAnswer,
          timeSpent: answer.timeSpent,
          hintsUsed: answer.hintsUsed
        }
      }
      return null
    })
    .filter((detail): detail is NonNullable<typeof detail> => detail !== null)

  if (incorrectDetails.length > 0) {
    startReviewQuiz(incorrectDetails, currentSession.settings)
    setQuizState("in-progress")
  }
}
```

**Acceptance Criteria:**
- [x] Button appears only if any incorrect answers exist
- [x] Shows count of mistakes in button text
- [x] Starts new quiz with wrong questions only
- [x] Uses same settings as original quiz (mode, difficulty, etc.)
- [x] Can be retried multiple times
- [x] Orange styling to indicate review mode
- [x] Seamless transition back to quiz interface

---

### Phase 4: Favorites & Bookmarks

#### Task 4.1: Bookmark System ✅ COMPLETE
**Estimate:** 4 hours
**Completed:** 2025-01-31
**Files created/modified:**
- `src/store/bookmarks-store.ts` (new)
- `src/components/quiz/quiz-question.tsx`
- `src/components/quiz/quiz-setup.tsx`
- `src/app/quiz/page.tsx`
- `src/types/quiz.ts`

**Implementation:**
Created a complete bookmark system with Zustand store and UI integration

```typescript
// src/store/bookmarks-store.ts - New Store
export const useBookmarksStore = create<BookmarksStore>()(
  persist(
    (set, get) => ({
      bookmarkedVocab: new Set<string>(),
      bookmarkedKanji: new Set<string>(),

      toggleVocabBookmark: (cardId: string) => { /* ... */ },
      toggleKanjiBookmark: (cardId: string) => { /* ... */ },
      isVocabBookmarked: (cardId: string) => boolean,
      isKanjiBookmarked: (cardId: string) => boolean,
      clearAllBookmarks: () => { /* ... */ },
      getBookmarkCounts: () => { vocab, kanji, total }
    }),
    {
      name: "bookmarks-storage",
      // Custom storage to handle Set serialization
    }
  )
)

// src/components/quiz/quiz-question.tsx - Bookmark Button
const isBookmarked = question.contentType === "vocabulary"
  ? isVocabBookmarked(question.card.id)
  : isKanjiBookmarked(question.card.id)

<Button
  variant="ghost"
  size="sm"
  onClick={handleToggleBookmark}
  className={`h-8 w-8 p-0 ${isBookmarked ? "text-yellow-500" : "text-gray-400"}`}
>
  <Star className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
</Button>

// src/components/quiz/quiz-setup.tsx - Filter Option
<Checkbox
  checked={bookmarkedOnly}
  onChange={(e) => setBookmarkedOnly(e.target.checked)}
  label={`Bookmarked only (${bookmarkCounts.total} cards)`}
  disabled={bookmarkCounts.total === 0}
/>

// src/app/quiz/page.tsx - Filtering Logic
if (settings.bookmarkedOnly) {
  cards = cards.filter(card => {
    if ("kana" in card) {
      return bookmarkedVocab.has(card.id)
    } else {
      return bookmarkedKanji.has(card.id)
    }
  })
}
```

**Acceptance Criteria:**
- [x] Star/bookmark icon on quiz questions (filled when bookmarked)
- [x] Saves to localStorage with Set serialization
- [x] "Bookmarked Only" checkbox in quiz setup
- [x] Shows bookmark count in filter label
- [x] Filter disabled when no bookmarks exist
- [x] Works for both vocabulary and kanji
- [x] Persists across sessions
- [x] Yellow star color for visual distinction

---

### Phase 5: Statistics & Analytics

#### Task 5.1: Per-Card Statistics ✅ COMPLETE
**Estimate:** 5 hours
**Completed:** 2025-01-31
**Files created/modified:**
- `src/store/card-stats-store.ts` (new - 220 lines)
- `src/store/quiz-store.ts`

**Implementation:**
Created comprehensive card statistics tracking system with Zustand + persist middleware

```typescript
// src/store/card-stats-store.ts - New Store
export interface CardStatistics {
  cardId: string
  contentType: "vocabulary" | "kanji"
  totalAttempts: number
  correctAttempts: number
  incorrectAttempts: number
  totalTimeMs: number
  lastReviewedAt: Date
  firstReviewedAt: Date
  averageTimeMs: number
  accuracy: number // 0-100
  streak: number // Current correct streak
  bestStreak: number // Best correct streak ever
}

interface CardStatsStore {
  stats: Map<string, CardStatistics>
  recordAttempt: (cardId, contentType, isCorrect, timeSpentMs) => void
  getCardStats: (cardId) => CardStatistics | undefined
  getAllStats: () => CardStatistics[]
  getStatsByContentType: (contentType) => CardStatistics[]
  getWeakestCards: (limit, contentType?) => CardStatistics[]
  getStrongestCards: (limit, contentType?) => CardStatistics[]
  getMostPracticedCards: (limit, contentType?) => CardStatistics[]
  clearAllStats: () => void
  clearCardStats: (cardId) => void
}

// Custom Map serialization for localStorage
storage: {
  getItem: (name) => { /* Convert array to Map */ },
  setItem: (name, value) => { /* Convert Map to array */ }
}

// src/store/quiz-store.ts - Integration
answerQuestion: (answer, timeSpent, hintsUsed) => {
  // ... existing logic

  // Record card statistics
  useCardStatsStore.getState().recordAttempt(
    question.card.id,
    question.contentType,
    isCorrect,
    timeSpent
  )
}
```

**Acceptance Criteria:**
- [x] Statistics tracked per card with Map-based storage
- [x] Updates after each quiz question
- [x] Stored in localStorage with custom serialization
- [x] Persists across sessions
- [x] Tracks streaks and timing metrics
- [x] Analysis functions for weak/strong/practiced cards

---

#### Task 5.2: Learning Curve Graph ✅ COMPLETE
**Estimate:** 4 hours
**Completed:** 2025-01-31
**Files created:**
- `src/components/analytics/quiz-learning-curve.tsx` (new - 280 lines)
- `src/app/progress/page.tsx` (modified)

**Implementation:**
Interactive line chart showing quiz performance over time using recharts

```typescript
// src/components/analytics/quiz-learning-curve.tsx
export function QuizLearningCurve({ contentType, days = 30 }) {
  const { sessionHistory } = useQuizStore()

  // Filter sessions by content type
  const filteredSessions = contentType
    ? sessionHistory.filter(r => r.settings.contentType === contentType)
    : sessionHistory

  // Generate chart data by aggregating by date
  const chartData = generateChartData(filteredSessions, days)

  return (
    <Card>
      {/* Summary stats: average score, trend */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} label="Score (%)" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line dataKey="score" stroke="#3b82f6" name="Score" />
          <Line dataKey="accuracy" stroke="#10b981" name="Accuracy" />
        </LineChart>
      </ResponsiveContainer>
      {/* Trend-based tips */}
    </Card>
  )
}

// Helper: Calculate trend (recent 3 vs early 3 points)
function calculateTrend(data: ChartDataPoint[]): number {
  const recentAvg = average(data.slice(-3))
  const earlyAvg = average(data.slice(0, 3))
  return recentAvg - earlyAvg
}
```

**Dependencies:** recharts (already installed)

**Acceptance Criteria:**
- [x] Graph renders on progress page in Quiz Analytics section
- [x] Shows data for last 30 days (configurable)
- [x] Aggregates multiple sessions per day
- [x] Two lines: score and accuracy
- [x] Shows trend indicator (up/down/stable)
- [x] Responsive design with ResponsiveContainer
- [x] Dark mode support with semantic tokens
- [x] Custom tooltip showing session count
- [x] Empty state for no data

---

#### Task 5.3: Weak Areas Report ✅ COMPLETE
**Estimate:** 3 hours
**Completed:** 2025-01-31
**Files created:**
- `src/components/analytics/weak-areas-report.tsx` (new - 141 lines)
- `src/app/progress/page.tsx` (modified)

**Implementation:**
Displays lowest-performing cards with detailed statistics

```typescript
// src/components/analytics/weak-areas-report.tsx
export function WeakAreasReport({ contentType, limit = 10, onPracticeCard }) {
  const { getWeakestCards } = useCardStatsStore()
  const weakCards = getWeakestCards(limit, contentType)

  if (weakCards.length === 0) {
    return <EmptyState message="No weak areas found. Keep up the great work!" />
  }

  return (
    <Card>
      <div className="space-y-3">
        {weakCards.map((stat, index) => (
          <div key={stat.cardId} className="p-4 rounded-lg border border-orange-200 bg-orange-50">
            {/* Card ranking, content type badge, card ID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Accuracy (color-coded: red <50%, orange <70%, yellow ≥70%) */}
              {/* Total attempts, Correct count, Incorrect count */}
            </div>
            {/* Last reviewed date */}
            {onPracticeCard && <Button>Practice</Button>}
          </div>
        ))}
      </div>

      {/* Tip: Focus on these cards in next quiz */}
    </Card>
  )
}

// src/store/card-stats-store.ts - Weak cards query
getWeakestCards: (limit, contentType) => {
  return stats
    .filter(stat => stat.totalAttempts >= 3) // Minimum attempts
    .sort((a, b) => a.accuracy - b.accuracy) // Ascending accuracy
    .slice(0, limit)
}
```

**Acceptance Criteria:**
- [x] Shows top 10 weakest cards (configurable limit)
- [x] Requires minimum 3 attempts for inclusion
- [x] Prioritized by accuracy (lowest first)
- [x] Color-coded accuracy indicators
- [x] Shows all key metrics (attempts, correct, incorrect, accuracy)
- [x] Displays last reviewed date
- [x] Content type filter support
- [x] Practice button (optional callback)
- [x] Empty state when no weak areas
- [x] Added to progress page in Quiz Analytics section

---

### Phase 6: Study Enhancements

#### Task 6.1: FSRS Integration ⏸️ DEFERRED
**Estimate:** 6 hours
**Status:** ⏸️ **DEFERRED - To be completed at end of quiz implementation**

**⚠️ IMPORTANT NOTE:** This task will be completed at the end of all quiz implementation sprints as a final integration step.

**Reason for deferral:** FSRS integration is already partially implemented in `quiz-fsrs-integration.ts` and is called from `quiz-store.ts` after each quiz. Full integration requires restructuring how cards are loaded in the quiz (currently from JSON/IndexedDB directly, but FSRS requires study cards from database). This is a larger architectural change that should be done as part of a comprehensive study system refactor.

**What's already working:**
- ✅ FSRS cards updated after each quiz completion
- ✅ `quizAnswerToFSRSRating()` converts quiz performance to FSRS ratings
- ✅ `updateFSRSFromQuizResult()` updates study cards in database
- ✅ Helper functions for quiz difficulty calculation

**What's still needed (for future sprint):**
- [ ] Restructure quiz card loading to use FSRS study cards
- [ ] "Smart" mode that prioritizes due cards
- [ ] Show "due for review" count in quiz setup
- [ ] Filter by "due cards only" option

**Files to modify (future):**
- `src/app/quiz/page.tsx` - Card loading logic
- `src/components/quiz/quiz-setup.tsx` - Add smart mode/due cards options
- `src/types/quiz.ts` - Add `dueCardsOnly` and `smartMode` settings

---

#### Task 6.2: Daily Goals System ✅ COMPLETE
**Estimate:** 4 hours
**Completed:** 2025-01-31
**Files created:**
- `src/store/goals-store.ts` (new - 196 lines)
- `src/components/dashboard/daily-goals.tsx` (new - 233 lines)

**Files modified:**
- `src/store/quiz-store.ts` (integrated goal tracking)
- `src/app/progress/page.tsx` (added to progress page)

**Implementation:**
Created comprehensive daily goals system with Zustand + persist middleware

```typescript
// src/store/goals-store.ts
export interface DailyGoal {
  questionsGoal: number // Default: 20
  quizzesGoal: number // Default: 1
  accuracyGoal: number // Default: 70%
}

export interface DailyProgress {
  date: string // YYYY-MM-DD
  questionsAnswered: number
  quizzesCompleted: number
  averageAccuracy: number
  goalMet: boolean
}

interface GoalsStore {
  dailyGoal: DailyGoal
  todayProgress: DailyProgress | null
  progressHistory: DailyProgress[] // Last 90 days

  setDailyGoal: (goal: Partial<DailyGoal>) => void
  recordQuizCompletion: (questionsAnswered, accuracy) => void
  getTodayProgress: () => DailyProgress
  getProgressForDate: (date: string) => DailyProgress | null
  getStreak: () => number
  resetTodayProgress: () => void
  clearHistory: () => void
}

// src/components/dashboard/daily-goals.tsx
export function DailyGoals({ showSettings }) {
  // Overall progress bar (average of 3 goals)
  // Individual progress for: questions, quizzes, accuracy
  // Edit mode to customize goals
  // Streak display if active
  // Motivational tips based on progress
}

// src/store/quiz-store.ts - Integration
endQuiz: () => {
  // ... existing logic

  // Update daily goals progress
  useGoalsStore.getState().recordQuizCompletion(
    result.questions.length,
    result.accuracy
  )
}
```

**Acceptance Criteria:**
- [x] Customizable daily goal (questions, quizzes, accuracy)
- [x] Progress persists across sessions (localStorage)
- [x] Automatically resets at midnight (checks date on each access)
- [x] Shows on progress page with edit button
- [x] Goal completion tracked and displayed
- [x] Keeps 90-day history for streak calculation

---

#### Task 6.3: Streak Tracking ✅ COMPLETE
**Estimate:** 3 hours
**Completed:** 2025-01-31
**Files created:**
- `src/components/dashboard/streak-display.tsx` (new - 265 lines)

**Files modified:**
- `src/store/goals-store.ts` (streak calculation integrated)
- `src/app/progress/page.tsx` (added to progress page)

**Implementation:**
Streak tracking built into goals store with dedicated display component

```typescript
// src/store/goals-store.ts - Streak Calculation
getStreak: () => {
  const { progressHistory } = get()
  const today = getTodayDateString()

  let streak = 0
  let currentDate = new Date()

  // Count backwards from today
  for (let i = 0; i < 365; i++) {
    const dateString = currentDate.toISOString().split("T")[0]
    const progress = get().getProgressForDate(dateString)

    if (progress && progress.goalMet) {
      streak++
    } else if (dateString !== today) {
      break // Streak broken
    }

    currentDate.setDate(currentDate.getDate() - 1)
  }

  return streak
}

// src/components/dashboard/streak-display.tsx
export function StreakDisplay({ compact = false }) {
  // Adaptive status based on streak length
  // - 0 days: Gray, motivational start message
  // - 1-6 days: Orange flame, "Great start!"
  // - 7-29 days: Yellow zap, "Amazing consistency!"
  // - 30+ days: Purple award, "Legendary!"

  // At-risk detection (streak > 0 but goal not met today)
  // Current streak and best streak display
  // Today's progress breakdown
  // Motivational messages based on progress
  // Compact mode for smaller displays
}
```

**Features:**
- Visual status system with icons and colors (Flame/Zap/Award)
- At-risk warning badge when goal not met today
- Shows both current and best streak
- Today's progress breakdown when at risk
- Motivational messages:
  - 0 days: "Start your first streak today!"
  - 1-6 days: "Great start! Build your habit!"
  - 7+ days: "Amazing consistency! Keep it up!"
  - 30+ days: "Legendary streak! You're unstoppable!"
- Compact mode option for smaller displays

**Acceptance Criteria:**
- [x] Counts consecutive days of goal completion
- [x] Stores best streak ever (calculated from history)
- [x] Displays on progress page in 2-column grid with DailyGoals
- [x] Shows "at risk" warning with badge when streak endangered
- [x] Persists across sessions (via goals store)
- [x] Progress summary when streak active but incomplete

---

### Phase 7: User Experience

#### Task 7.1: Keyboard Shortcuts ✅ COMPLETE
**Estimate:** 2 hours
**Completed:** 2025-01-31
**Files modified:**
- `src/components/quiz/quiz-question.tsx`

**Implementation:**
Added comprehensive keyboard shortcuts with event listener and visual hints

```typescript
// Keyboard shortcuts
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Don't trigger shortcuts if user is typing
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    // Don't trigger if already answered or disabled
    if (hasAnswered || disabled) return

    // Multiple choice: Number keys 1-4 (or 1-6 for hard mode)
    if (question.mode === "multiple-choice" && question.choices) {
      const num = parseInt(e.key)
      if (num >= 1 && num <= question.choices.length) {
        const choice = question.choices[num - 1]
        setSelectedAnswer(choice)
        return
      }
    }

    // Enter key: Submit answer
    if (e.key === "Enter") {
      e.preventDefault()
      if (question.mode === "multiple-choice" && selectedAnswer) {
        handleSubmit()
      } else if (question.mode === "typing" && typedAnswer.trim()) {
        handleSubmit()
      }
      return
    }

    // Space key: Skip question
    if (e.key === " " && !(e.target instanceof HTMLInputElement)) {
      e.preventDefault()
      handleSkipClick()
      return
    }
  }

  window.addEventListener("keydown", handleKeyPress)
  return () => window.removeEventListener("keydown", handleKeyPress)
}, [question.mode, question.choices, selectedAnswer, typedAnswer, hasAnswered, disabled])

{/* Keyboard shortcuts hint */}
{question.mode === "multiple-choice" && !hasAnswered && (
  <p className="text-xs text-center text-muted-foreground">
    Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">1-{question.choices?.length || 4}</kbd> to select, <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to submit, <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Space</kbd> to skip
  </p>
)}
```

**Acceptance Criteria:**
- [x] 1-6 keys select choices (adapts to choice count)
- [x] Enter submits selected answer
- [x] Space skips current question
- [x] Works in all quiz modes (multiple-choice, typing)
- [x] Hints shown in UI below action buttons
- [x] Prevents conflicts with input fields
- [x] Proper event listener cleanup

---

#### Task 7.2: Sound Effects ⏸️ SKIPPED
**Estimate:** 2 hours
**Status:** ⏸️ **SKIPPED - All audio features will be implemented together later**

**Note:** This task is part of the larger audio implementation effort.

**Files to modify:**
- `src/components/quiz/quiz-question.tsx`
- Create: `public/sounds/` directory

**Implementation:**
- "Ding" sound for correct answer
- "Buzz" sound for wrong answer
- "Tick" sound for timer warning
- Toggle in settings to enable/disable
- Use Web Audio API

**Acceptance Criteria:**
- [ ] Sounds play on answer feedback
- [ ] Volume controlled by system
- [ ] Can be disabled in settings
- [ ] Works on mobile and desktop
- [ ] No delay/lag

---

#### Task 7.3: Confetti Animation ✅ COMPLETE
**Estimate:** 2 hours
**Completed:** 2025-01-31
**Files modified:**
- `src/components/quiz/quiz-results.tsx`
- `package.json` (added canvas-confetti dependency)

**Implementation:**
Added confetti celebration for high scores using dynamic imports

```typescript
import { useEffect } from "react"

// Trigger confetti for high scores
useEffect(() => {
  const triggerConfetti = async () => {
    if (result.score >= 90) {
      // Dynamically import confetti library
      const confetti = (await import("canvas-confetti")).default

      if (result.score === 100) {
        // Perfect score - golden confetti
        confetti({
          particleCount: 200,
          spread: 160,
          origin: { y: 0.6 },
          colors: ["#FFD700", "#FFA500", "#FF8C00"],
          scalar: 1.2
        })
      } else {
        // High score - regular confetti
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.6 }
        })
      }
    }
  }

  triggerConfetti()
}, [result.score])
```

**Installed:**
```bash
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
```

**Acceptance Criteria:**
- [x] Triggers on high scores (≥90%)
- [x] Different animations per score range (golden for 100%, regular for 90-99%)
- [x] Doesn't block UI (uses async/await)
- [x] Performs well (dynamic import for code splitting)
- [x] Auto-dismisses after animation

---

#### Task 7.4: Dark Mode Optimization ✅ COMPLETE
**Estimate:** 3 hours
**Completed:** 2025-01-31
**Files modified:**
- `src/components/quiz/quiz-question.tsx`

**Implementation:**
Updated to use semantic color tokens for better dark mode contrast

```typescript
// Before: hardcoded colors
<span className="flex-1 font-medium">{choice}</span>

// After: semantic tokens
<span className="flex-1 text-foreground font-medium">{choice}</span>

// Also updated question display
<h2 className={`font-bold mb-2 text-foreground ${
  question.contentType === "kanji" ? "text-7xl" : "text-3xl"
}`}>
  {question.question}
</h2>
```

**Changes:**
- Used `text-foreground` for high contrast in both themes
- Used `text-muted-foreground` for secondary text
- Applied to all Japanese text (kanji, hiragana, katakana)
- Ensured multiple choice options have proper contrast

**Acceptance Criteria:**
- [x] Kanji readable in dark mode with 7xl size
- [x] Hiragana/Katakana have clear contrast
- [x] Button states visible with proper borders
- [x] Uses semantic color tokens for theme compatibility
- [x] Large font size (7xl) ensures readability

---

### Phase 8: Content Enhancements

#### Task 8.1: Sentence Building Mode ✅ COMPLETE
**Estimate:** 8 hours
**Actual Time:** ~12 hours (multiple iterations with user feedback)
**Completed:** 2025-02-01
**Files created:**
- `src/components/quiz/sentence-builder.tsx` (563 lines)

**Files modified:**
- `src/lib/quiz-generator.ts` (smart word boundary detection)
- `src/components/quiz/quiz-question.tsx` (integrated sentence builder)
- `src/types/quiz.ts` (added scrambledWords field)

**Implementation:**
Duolingo-style tap-to-move interface with smart word boundary detection:

```typescript
// Duolingo-style UX with separate answer area and word bank
<div className="space-y-6">
  {/* Answer Area - Drag to reorder, tap to remove */}
  <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
    <SortableContext items={answerArea}>
      {answerArea.map(item => (
        <SortableAnswerWord
          item={item}
          onClick={() => handleAnswerAreaClick(item)} // Tap to remove
        />
      ))}
    </SortableContext>
  </DndContext>

  {/* Word Bank - Tap to add, maintains layout with null placeholders */}
  {wordBank.map((item, index) =>
    item === null
      ? renderGrayPlaceholder(initialItems[index].id)
      : renderWordBankWord(item, () => handleWordBankClick(item, index))
  )}
</div>

// Smart word boundary detection (quiz-generator.ts)
function createSentenceBuildingQuestion(card, settings) {
  const particles = ["は", "が", "を", "に", ...] // 28 particles
  const wordEndings = ["ます", "です", "た", ...] // 18 endings

  let words: string[] = []
  let currentWord = ""

  while (i < sentence.length) {
    const char = sentence[i]

    // Split on particles
    if (particles.includes(char)) {
      if (currentWord) words.push(currentWord)
      words.push(char)
      currentWord = ""
      continue
    }

    // Check multi-character verb endings
    for (const ending of wordEndings) {
      if (sentence.slice(i, i + ending.length) === ending) {
        currentWord += ending
        words.push(currentWord)
        currentWord = ""
        i += ending.length
        break
      }
    }

    currentWord += char
    i++
  }

  // Example output: "私は学生です" → ["私", "は", "学生", "です"]
}
```

**Key Features:**
1. **Duolingo-style UX**: Separate answer area and word bank
2. **Tap-to-move**: Click words in bank to add to answer, click in answer to remove back to bank
3. **Drag-to-reorder**: Drag words within answer area to change order (@dnd-kit with 3px activation)
4. **Layout stability**: Null placeholders with exact width measurement prevent shifting
5. **Smart word splitting**: Linguistic rules for Japanese (particles, verb endings, copulas)
6. **Particle highlighting**: Purple background for particles (は、を、に, etc.)
7. **Tutorial popup**: First-time instructions with "Don't show again" checkbox
8. **Post-answer buttons**: Retry (if wrong), Show Answer (toggle), Next
9. **Original position memory**: Removed words return to exact original slot
10. **Fixed feedback area**: Reserved 120px height prevents button position shifts

**Performance Optimizations:**
- Only answer area uses drag-and-drop (word bank is click-only)
- Exact width measurement cached using useRef + useEffect
- Gray placeholders styled with exact pixel widths for zero layout shift

**User Experience Iterations:**
1. Initial: Full drag-and-drop (slow, 8px activation)
2. v2: Click-to-swap between two words
3. v3: Duolingo-style with answer area + word bank
4. v4: Added drag-to-reorder within answer area
5. v5: Fixed layout shifting with null placeholders + width measurement
6. v6: Tutorial popup + reset button
7. v7: Post-answer button redesign (3 parallel buttons)
8. v8: Fixed duplicate correct answer display + retry state reset

**Acceptance Criteria:**
- [✅] Tap-to-move works (word bank → answer, answer → word bank)
- [✅] Drag-to-reorder works (within answer area only)
- [✅] Validates word order (joins and compares strings)
- [✅] Touch-friendly on mobile (3px activation constraint)
- [✅] Shows correct answer (toggle with Show Answer button)
- [⏸️] Audio playback (deferred with other audio features)
- [✅] Smart word splitting preserves kanji/hiragana combinations
- [✅] Layout stability with exact width placeholders
- [✅] Particle highlighting for visual grammar cues
- [✅] Tutorial for first-time users
- [✅] Fixed button positions with reserved feedback space

**Known Limitations:**
- Word boundary detection is heuristic-based (not perfect for all sentence structures)
- Depends on quality of example sentences in database
- No hiragana-only filter (user requested but not implemented - see Deferred Features)

---

#### Task 8.2: Kanji Stroke Order Quiz ⏳
**Estimate:** 10 hours
**Files to create:**
- `src/components/quiz/kanji-drawing.tsx`

**Implementation:**
Draw kanji using touch/mouse:
- Canvas-based drawing
- Stroke order validation
- Compare with KanjiVG data
- Show correct strokes in sequence
- Score based on accuracy

**Dependencies:** Canvas drawing library

**Acceptance Criteria:**
- [ ] Drawing works on touch devices
- [ ] Validates stroke order
- [ ] Shows correct strokes
- [ ] Gives accuracy score
- [ ] Works offline

---

#### Task 8.3: More Context Sentences ✅ COMPLETE
**Estimate:** 4 hours
**Completed:** 2025-02-01
**Files modified:**
- `src/lib/quiz-generator.ts`

**Implementation:**
Significantly expanded sentence-completion mode with intelligent blanking

```typescript
function createSentenceCompletionQuestion(
  card: VocabularyCard,
  settings: QuizSettings
): QuizQuestion | null {
  // Select random example from ALL available (not just first)
  const exampleIndex = Math.floor(Math.random() * card.examples.length)
  const example = card.examples[exampleIndex]

  // Determine number of blanks based on difficulty
  let blankCount = 1
  if (settings.difficulty === "medium") {
    blankCount = Math.random() > 0.5 ? 1 : 2
  } else if (settings.difficulty === "hard") {
    blankCount = Math.min(2 + Math.floor(Math.random() * 2), 3) // 2-3 blanks
  }

  // List of Japanese particles to avoid blanking
  const particles = ["は", "が", "を", "に", "へ", "で", "と", ...]

  // Always blank target word first
  // Then add additional blanks avoiding particles
  const blankableWords = words.filter(word =>
    word.length >= 2 &&
    word.length <= 4 &&
    !particles.includes(word) &&
    !/ [。、！？\s]/.test(word)
  )
}
```

**Features:**
- **All examples used**: Randomly selects from all available example sentences (not just first)
- **Difficulty scaling**:
  - Easy: 1 blank (target word only)
  - Medium: 1-2 blanks (50% chance of extra blank)
  - Hard: 2-3 blanks (randomized)
- **Grammar-aware**: Avoids blanking 20+ common Japanese particles (は、が、を、に、etc.)
- **Smart word selection**: Only blanks 2-4 character words that aren't punctuation
- **Multiple correct answers**: Returns array when multiple blanks

**Acceptance Criteria:**
- [x] Uses all available examples (random selection)
- [x] Multiple blanks supported (up to 3 on hard)
- [x] Doesn't blank particles (20+ particles filtered)
- [x] Scales with difficulty (easy: 1, medium: 1-2, hard: 2-3)
- [⏸️] Audio for sentences (deferred with other audio features)

---

## ⏸️ Deferred / Skipped Features

This section documents features that were requested but explicitly skipped or deferred for future implementation.

### Hiragana-Only Filter for Sentence Building
**Status:** ⏸️ **DEFERRED - Database Quality Dependent**
**Requested:** 2025-02-01 (during Sprint 8.1)
**Reason for deferral:** This feature depends on having high-quality hiragana-only example sentences in the database.

**User Request:**
> "Can we have a filter to use only hiragana no kanji....In my current example adjective and noun came together..so I guess it depends on our database"

**Technical Context:**
- Current word boundary detection works with kanji/hiragana mixed sentences using linguistic rules
- Switching to pure hiragana requires different splitting logic (no visual kanji boundaries)
- Would need to filter vocabulary cards to only those with hiragana-only examples
- Quality of hiragana sentences varies significantly in current dataset

**Implementation Path (when ready):**
1. Add checkbox in quiz setup: "Hiragana only (no kanji)"
2. Filter cards to only those with `card.examples[].hasKanji === false`
3. Update word boundary detection for hiragana-only mode:
   - Rely more heavily on particle detection
   - Use dictionary-based word segmentation (e.g., TinySegmenter)
   - Consider spacing hints in example sentences

**Files to modify:**
- `src/components/quiz/quiz-setup.tsx` - Add hiragana-only checkbox
- `src/types/quiz.ts` - Add `hiraganaOnly: boolean` to QuizSettings
- `src/app/quiz/page.tsx` - Filter cards by `hasKanji` field
- `src/lib/quiz-generator.ts` - Alternative word splitting for hiragana mode

**Database Requirements:**
- Tag all example sentences with `hasKanji: boolean` field
- Review and improve quality of hiragana-only sentences
- Ensure sufficient volume (target: 100+ cards with hiragana-only examples)

**Priority:** Low - Better to focus on improving mixed kanji/hiragana experience first

---

### Audio Features (Batch)
**Status:** ⏸️ **DEFERRED - To be implemented as comprehensive audio sprint**
**Tasks Included:**
- Task 1.1: Fix audio bug for kanji cards (listening mode)
- Task 7.2: Sound effects (correct/incorrect/timer)
- Task 8.1: Audio playback for sentence building

**Reason for deferral:**
Audio features across the quiz system should be implemented together as a coherent batch, not piecemeal. This ensures:
- Consistent audio service interface
- Unified settings for audio preferences
- Better performance with shared audio resources
- Comprehensive testing of audio features

**Estimated Batch Effort:** 8-10 hours total

---

### FSRS Smart Mode
**Status:** ⏸️ **DEFERRED - Requires database restructuring**
**Task:** Task 6.1 (from Sprint 5)

**What's already working:**
- ✅ FSRS cards updated after each quiz completion
- ✅ Quiz performance converted to FSRS ratings
- ✅ Study cards updated in database

**What's needed:**
- [ ] Restructure quiz to load from FSRS study cards (not raw JSON/IndexedDB)
- [ ] "Smart" mode prioritizing due cards
- [ ] "Due for review" count display
- [ ] Filter by due cards only

**Reason for deferral:** Requires architectural changes to how cards are loaded in quiz flow. Current implementation loads directly from IndexedDB/JSON files. FSRS integration requires loading from study cards table in database, which is a larger refactor affecting multiple components.

**Estimated Effort:** 6-8 hours when ready

---

## 📊 Implementation Roadmap

### Sprint 1: Critical Fixes (Week 1) - ✅ MOSTLY COMPLETE
- [⏸️] Task 1.1: Fix audio bug (SKIPPED - deferred to audio batch)
- [✅] Task 1.2: Improve kanji display
- [✅] Task 1.3: Add reading pronunciation

**Target:** 3 tasks, ~2.5 hours total
**Completed:** 2/3 tasks (1 skipped for later)

### Sprint 2: Filtering & Review (Week 2) - ✅ COMPLETE
- [✅] Task 2.1: JLPT level filter
- [✅] Task 3.1: Track incorrect answers
- [✅] Task 3.2: Review mode UI

**Target:** 3 tasks, ~7 hours total
**Completed:** 3/3 tasks ✅

### Sprint 3: Advanced Features (Week 3) - ✅ COMPLETE
- [✅] Task 2.2: Mixed content quizzes
- [✅] Task 4.1: Bookmark system
- [✅] Task 7.1: Keyboard shortcuts

**Target:** 3 tasks, ~9 hours total
**Completed:** 3/3 tasks ✅

### Sprint 4: Analytics (Week 4) - ✅ COMPLETE
- [✅] Task 5.1: Per-card statistics
- [✅] Task 5.2: Learning curve graph
- [✅] Task 5.3: Weak areas report

**Target:** 3 tasks, ~12 hours total
**Completed:** 3/3 tasks ✅

### Sprint 5: Study Enhancements (Week 5) - ⚠️ MOSTLY COMPLETE
- [⏸️] Task 6.1: FSRS integration (deferred - requires DB restructuring)
- [✅] Task 6.2: Daily goals system
- [✅] Task 6.3: Streak tracking

**Target:** 3 tasks, ~13 hours total
**Completed:** 2/3 tasks (1 deferred for major refactor)

### Sprint 6: UX Polish (Week 6) - ✅ MOSTLY COMPLETE
- [⏸️] Task 7.2: Sound effects (SKIPPED - deferred to audio batch)
- [✅] Task 7.3: Confetti animation
- [✅] Task 7.4: Dark mode optimization

**Target:** 3 tasks, ~7 hours total
**Completed:** 2/3 tasks (1 skipped for later)

### Future Sprints: Content Enhancements
- Task 8.1: Sentence building (8 hours)
- Task 8.2: Kanji stroke order (10 hours)
- Task 8.3: More context sentences (4 hours)

---

## 🗂️ File Structure

```
src/
├── app/
│   └── quiz/
│       └── page.tsx                 # Main quiz page
├── components/
│   ├── quiz/
│   │   ├── quiz-setup.tsx          # Configuration screen
│   │   ├── quiz-question.tsx       # Question display
│   │   └── quiz-results.tsx        # Results screen
│   ├── analytics/
│   │   ├── quiz-learning-curve.tsx # ✅ Learning graph (recharts)
│   │   └── weak-areas-report.tsx   # ✅ Weak areas display
│   └── dashboard/
│       ├── daily-goals.tsx         # ✅ Daily goals tracking
│       └── streak-display.tsx      # ✅ Streak tracking
├── lib/
│   ├── quiz-generator.ts           # Question generation logic
│   └── quiz-fsrs-integration.ts    # ⚠️ FSRS integration (partial)
├── store/
│   ├── quiz-store.ts               # Quiz state management
│   ├── bookmarks-store.ts          # ✅ Bookmark system
│   ├── card-stats-store.ts         # ✅ Per-card statistics
│   └── goals-store.ts              # ✅ Daily goals + streaks
└── types/
    └── quiz.ts                      # TypeScript interfaces
```

---

## 📝 Progress Log

| Date | Task | Status | Notes |
|------|------|--------|-------|
| 2025-01-31 | Initial quiz system | ✅ Complete | Vocabulary support only |
| 2025-01-31 | Kanji content type | ✅ Complete | Added kanji quiz support |
| 2025-01-31 | Created documentation | ✅ Complete | This file |
| 2025-01-31 | Task 1.2: Kanji display size | ✅ Complete | 7xl font, stroke count |
| 2025-01-31 | Task 1.3: Reading pronunciation | ✅ Complete | On-yomi/kun-yomi display |
| 2025-01-31 | Task 2.1: JLPT level filter | ✅ Complete | All/N5/N4/N3/N2/N1 buttons |
| 2025-01-31 | Task 7.1: Keyboard shortcuts | ✅ Complete | 1-6, Enter, Space keys |
| 2025-01-31 | Task 7.3: Confetti animation | ✅ Complete | Canvas-confetti integration |
| 2025-01-31 | Task 7.4: Dark mode optimization | ✅ Complete | Semantic color tokens |
| 2025-01-31 | Audio tasks deferred | ⏸️ Skipped | Tasks 1.1, 7.2 for later batch |
| 2025-01-31 | Task 3.1: Track incorrect answers | ✅ Complete | IncorrectQuestionDetail interface |
| 2025-01-31 | Task 3.2: Review Mode UI | ✅ Complete | Review Mistakes button + flow |
| 2025-01-31 | Sprint 2 completed | ✅ Milestone | All filtering & review tasks done |
| 2025-01-31 | Task 2.2: Mixed content quiz | ✅ Complete | Vocabulary + Kanji interleaved |
| 2025-01-31 | Task 4.1: Bookmark system | ✅ Complete | Star icon + bookmarked filter |
| 2025-01-31 | Sprint 3 completed | ✅ Milestone | All advanced features done |
| 2025-01-31 | Task 5.1: Per-card statistics | ✅ Complete | Map-based store with streaks |
| 2025-01-31 | Task 5.2: Learning curve graph | ✅ Complete | Recharts line chart with trend |
| 2025-01-31 | Task 5.3: Weak areas report | ✅ Complete | Color-coded accuracy display |
| 2025-01-31 | Sprint 4 completed | ✅ Milestone | All analytics features done |
| 2025-01-31 | Task 6.1: FSRS integration | ⏸️ Deferred | Requires database restructuring |
| 2025-01-31 | Task 6.2: Daily goals system | ✅ Complete | Goals store + progress tracking |
| 2025-01-31 | Task 6.3: Streak tracking | ✅ Complete | Adaptive display with motivation |
| 2025-01-31 | Sprint 5 mostly complete | ⚠️ Milestone | 2/3 tasks done (1 deferred) |
| 2025-02-01 | Task 8.3: Enhanced sentences | ✅ Complete | Multi-blank, grammar-aware |
| 2025-02-01 | Task 8.1: Sentence building mode | ✅ Complete | Duolingo-style, 8 iterations |
| 2025-02-01 | Hiragana-only filter | ⏸️ Deferred | Database quality dependent |
| 2025-02-01 | Sprint 8.1 completed | ✅ Milestone | Sentence building fully functional |

---

## 🎯 Success Metrics

### Definition of Done
Each task is considered complete when:
- [ ] Code implemented and tested
- [ ] TypeScript compiles with no errors
- [ ] No console errors or warnings
- [ ] Works on mobile and desktop
- [ ] Dark mode compatible
- [ ] Acceptance criteria met
- [ ] This document updated

### Quality Standards
- Code follows existing patterns
- Components are reusable
- Performance: <100ms render time
- Accessibility: WCAG AA compliant
- Mobile-first responsive design

---

**Last Updated:** 2025-02-01 14:45 UTC
**Document Version:** 1.6.0
**Next Review:** After remaining content enhancement sprints (8.2, 8.3)

---

## 📌 Recent Updates

### v1.6.0 - Sprint 8.1 Complete - Sentence Building Mode (2025-02-01 14:45 UTC)

**Completed Content Enhancement:**
- ✅ Task 8.1: Sentence building mode (563-line component with 8 UX iterations)
  - Duolingo-style tap-to-move interface
  - Smart word boundary detection with 28 particles + 18 verb endings
  - Layout stability with exact width measurement
  - Tutorial popup, particle highlighting, fixed button positions
  - Retry function fixed, duplicate answer display resolved

**New Files Created:**
- `src/components/quiz/sentence-builder.tsx` - Complete sentence building component

**Files Modified:**
- `src/lib/quiz-generator.ts` - Smart word splitting with linguistic rules
- `src/components/quiz/quiz-question.tsx` - Integrated sentence builder with onNext prop
- `src/types/quiz.ts` - Added scrambledWords field (already existed)

**New Documentation Section:**
- ⏸️ Deferred / Skipped Features
  - Hiragana-only filter (database quality dependent)
  - Audio features batch (comprehensive sprint planned)
  - FSRS smart mode (requires DB restructuring)

**Impact:** Quiz now supports 4 question modes (was 3)
- ✅ Multiple Choice
- ✅ Typing
- ✅ Listening (vocabulary only)
- ✅ Sentence Building (NEW)

**User Feedback Iterations:**
1. Performance: Removed slow drag-and-drop from word bank
2. UX: Switched to Duolingo-style separate areas
3. Layout: Fixed shifting with null placeholders + width measurement
4. Visual: Darker placeholders, proper text centering
5. Tutorial: Added first-time popup with dismissal
6. Buttons: Redesigned to 3 parallel buttons (Retry, Show Answer, Next)
7. Bugs: Fixed duplicate correct answer, retry state reset
8. Word splitting: Implemented smart linguistic boundaries

**Current Quiz System Completion: 96%**

---

### v1.5.0 - Sprint 5 Mostly Complete (2025-02-01 00:30 UTC)

**Completed Study Enhancement Features:**
- ✅ Task 6.2: Daily goals system (196-line goals store + 233-line component)
- ✅ Task 6.3: Streak tracking (265-line adaptive display component)
- ⏸️ Task 6.1: FSRS integration (deferred - requires DB restructuring)

**New Files Created:**
- `src/store/goals-store.ts` - Daily goals tracking with 90-day history
- `src/components/dashboard/daily-goals.tsx` - Customizable goals with edit mode
- `src/components/dashboard/streak-display.tsx` - Adaptive streak display with motivation

**Impact:** Quiz completion increased from 88% to 92%

**Major Milestones:**
- ✅ Sprint 1: Display improvements complete
- ✅ Sprint 2: Filtering & review system complete
- ✅ Sprint 3: Advanced features (mixed content + bookmarks) complete
- ✅ Sprint 4: Analytics & statistics complete
- ⚠️ Sprint 5: Study enhancements mostly complete (2/3 tasks, 1 deferred)

---

### v1.4.0 - Sprint 4 Complete (2025-01-31 23:30 UTC)

**Completed Analytics Features:**
- ✅ Task 5.1: Per-card statistics tracking (220-line Map-based store)
- ✅ Task 5.2: Learning curve graph (Recharts line chart with trend calculation)
- ✅ Task 5.3: Weak areas report (Color-coded accuracy display)

**New Files Created:**
- `src/store/card-stats-store.ts` - Comprehensive statistics tracking
- `src/components/analytics/quiz-learning-curve.tsx` - Performance graph
- `src/components/analytics/weak-areas-report.tsx` - Weak cards display

---

### v1.3.0 - Sprints 1-3 Complete (2025-01-31 22:00 UTC)

**Completed Features:**
- ✅ Task 1.2: Improved kanji display size (7xl font, stroke count)
- ✅ Task 1.3: Added reading pronunciation display (on-yomi/kun-yomi)
- ✅ Task 2.1: Added JLPT level filter (All/N5/N4/N3/N2/N1)
- ✅ Task 2.2: Mixed content quiz (vocabulary + kanji interleaved)
- ✅ Task 3.1: Track incorrect answers (IncorrectQuestionDetail)
- ✅ Task 3.2: Review Mode UI (Review Mistakes button)
- ✅ Task 4.1: Bookmark system (star icon + filter)
- ✅ Task 7.1: Added keyboard shortcuts (1-6, Enter, Space)
- ✅ Task 7.3: Added confetti animation (canvas-confetti)
- ✅ Task 7.4: Optimized dark mode (semantic color tokens)
- ⏸️ Skipped: Tasks 1.1 and 7.2 (audio features - to be done as batch later)
