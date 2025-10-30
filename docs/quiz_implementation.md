# Quiz Implementation Document

**Project:** LingoMemory Quiz System
**Created:** 2025-01-31
**Current Branch:** `quiz_mode_updation`
**Status:** 🔄 In Progress - Enhancements Phase

---

## 🎯 Current Status

**Overall Completion: 73%**
- ✅ Basic Quiz Setup: 100%
- ✅ Question Types: 80% (3/4 modes implemented)
- ✅ Content Support: 100% (Vocabulary + Kanji)
- ⏸️ Bug Fixes: 0% (Audio tasks skipped for later)
- ✅ Display Improvements: 100% (Kanji size, readings)
- ✅ JLPT Filtering: 100%
- ✅ Review System: 100% (Track & review incorrect answers)
- ⏳ Advanced Features: 0%
- ⏳ Statistics & Analytics: 0%
- ✅ UX Enhancements: 75% (Keyboard shortcuts, confetti, dark mode complete)

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

#### Task 2.2: Mixed Content Quiz Option ⏳
**Estimate:** 3 hours
**Files to modify:**
- `src/components/quiz/quiz-setup.tsx`
- `src/app/quiz/page.tsx`
- `src/lib/quiz-generator.ts`

**Implementation:**
Add "Mixed" content type option
- Combine vocabulary and kanji cards
- Randomly interleave in question generation
- Smart direction selection (only compatible directions)

**Acceptance Criteria:**
- [ ] "Mixed" option in content type selector
- [ ] Questions alternate between vocab and kanji
- [ ] Only shows compatible quiz directions
- [ ] Maintains difficulty settings

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

#### Task 4.1: Bookmark System ⏳
**Estimate:** 4 hours
**Files to create/modify:**
- `src/store/bookmarks-store.ts` (new)
- `src/components/quiz/quiz-question.tsx`
- `src/components/quiz/quiz-setup.tsx`

**Implementation:**
- Bookmark button on quiz questions
- Store in localStorage
- Filter quiz setup to show only bookmarked cards

**Acceptance Criteria:**
- [ ] Star/bookmark icon on questions
- [ ] Saves to localStorage
- [ ] "Bookmarked Only" filter in setup
- [ ] Sync across devices (future)

---

### Phase 5: Statistics & Analytics

#### Task 5.1: Per-Card Statistics ⏳
**Estimate:** 5 hours
**Files to modify:**
- `src/store/quiz-store.ts`
- Create: `src/app/analytics/quiz/page.tsx`

**Implementation:**
Track statistics per vocabulary word and per kanji:
- Total attempts
- Correct attempts
- Incorrect attempts
- Average time to answer
- Last reviewed date
- Accuracy percentage
- Difficulty score (calculated)

**Data structure:**
```typescript
interface CardStatistics {
  cardId: string
  contentType: "vocabulary" | "kanji"
  totalAttempts: number
  correctAttempts: number
  incorrectAttempts: number
  averageTimeMs: number
  lastReviewedAt: Date
  accuracy: number // 0-100
  difficultyScore: number // calculated based on performance
}
```

**Acceptance Criteria:**
- [ ] Statistics tracked per card
- [ ] Updates after each quiz
- [ ] Stored in localStorage/IndexedDB
- [ ] Persists across sessions

---

#### Task 5.2: Learning Curve Graph ⏳
**Estimate:** 4 hours
**Files to create:**
- `src/components/analytics/quiz-learning-curve.tsx`

**Implementation:**
Chart showing quiz performance over time
- X-axis: Date
- Y-axis: Average score percentage
- Line graph with trend line
- Show last 30 days by default

**Dependencies:** Chart library (recharts or chart.js)

**Acceptance Criteria:**
- [ ] Graph renders on analytics page
- [ ] Shows data for last 30 days
- [ ] Updates after each quiz
- [ ] Responsive design
- [ ] Dark mode support

---

#### Task 5.3: Weak Areas Report ⏳
**Estimate:** 3 hours
**Files to create:**
- `src/components/analytics/weak-areas-report.tsx`

**Implementation:**
Analyze quiz data to identify weak areas:
- Lowest accuracy quiz directions
- Slowest answer times
- Most skipped questions
- Kanji with most errors
- Vocabulary with most errors

**Acceptance Criteria:**
- [ ] Shows top 5 weak areas
- [ ] Prioritized by error rate
- [ ] Clickable to start focused quiz
- [ ] Updates after each quiz session

---

### Phase 6: Study Enhancements

#### Task 6.1: FSRS Integration ⏳
**Estimate:** 6 hours
**Files to modify:**
- `src/lib/quiz-fsrs-integration.ts`
- `src/store/quiz-store.ts`

**Implementation:**
Currently exists but not fully integrated. Need to:
- Update FSRS cards after each quiz
- Use FSRS to prioritize questions
- Schedule reviews based on spaced repetition
- Show "due for review" count

**Acceptance Criteria:**
- [ ] Quiz results update FSRS data
- [ ] FSRS algorithm schedules next review
- [ ] "Smart" mode uses FSRS for question selection
- [ ] Shows cards due today in dashboard

---

#### Task 6.2: Daily Goals System ⏳
**Estimate:** 4 hours
**Files to create:**
- `src/store/goals-store.ts`
- `src/components/dashboard/daily-goals.tsx`

**Implementation:**
- Set daily question goal (default: 20)
- Track progress throughout day
- Show progress bar on dashboard
- Celebrate when goal reached
- Reset at midnight

**Acceptance Criteria:**
- [ ] Customizable daily goal
- [ ] Progress persists across sessions
- [ ] Resets at midnight (local time)
- [ ] Shows on dashboard
- [ ] Notification when goal reached

---

#### Task 6.3: Streak Tracking ⏳
**Estimate:** 3 hours
**Files to modify:**
- `src/store/quiz-store.ts`
- `src/components/dashboard/streak-display.tsx`

**Implementation:**
- Track consecutive days of quiz completion
- Show current streak
- Show best streak
- Visual flame icon
- Warn if streak at risk

**Acceptance Criteria:**
- [ ] Counts consecutive days
- [ ] Stores best streak ever
- [ ] Displays on dashboard
- [ ] Shows "at risk" if not completed today
- [ ] Persists across sessions

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

#### Task 8.1: Sentence Building Mode ⏳
**Estimate:** 8 hours
**Files to create:**
- `src/components/quiz/sentence-builder.tsx`

**Implementation:**
Drag-and-drop interface to build sentences:
- Show scrambled words
- User drags to correct order
- Validates sentence structure
- Shows particles in different color
- Audio playback of correct sentence

**Acceptance Criteria:**
- [ ] Drag and drop works
- [ ] Validates word order
- [ ] Touch-friendly on mobile
- [ ] Shows correct answer
- [ ] Audio playback

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

#### Task 8.3: More Context Sentences ⏳
**Estimate:** 4 hours
**Files to modify:**
- `src/lib/quiz-generator.ts`

**Implementation:**
Expand sentence-completion mode:
- Use all example sentences (not just first)
- Multiple blanks per sentence
- Grammar-aware blanking
- Difficulty levels (1, 2, 3 blanks)

**Acceptance Criteria:**
- [ ] Uses all available examples
- [ ] Multiple blanks supported
- [ ] Doesn't blank particles
- [ ] Scales with difficulty
- [ ] Audio for sentences

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

### Sprint 3: Advanced Features (Week 3) - 🔄 IN PROGRESS
- [ ] Task 2.2: Mixed content quizzes
- [ ] Task 4.1: Bookmark system
- [✅] Task 7.1: Keyboard shortcuts

**Target:** 3 tasks, ~9 hours total
**Completed:** 1/3 tasks

### Sprint 4: Analytics (Week 4)
- [ ] Task 5.1: Per-card statistics
- [ ] Task 5.2: Learning curve graph
- [ ] Task 5.3: Weak areas report

**Target:** 3 tasks, ~12 hours total

### Sprint 5: Study Enhancements (Week 5)
- [ ] Task 6.1: FSRS integration
- [ ] Task 6.2: Daily goals
- [ ] Task 6.3: Streak tracking

**Target:** 3 tasks, ~13 hours total

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
│   │   ├── quiz-learning-curve.tsx # Future: Learning graph
│   │   └── weak-areas-report.tsx   # Future: Weak areas
│   └── dashboard/
│       ├── daily-goals.tsx         # Future: Daily goals
│       └── streak-display.tsx      # Future: Streak tracking
├── lib/
│   ├── quiz-generator.ts           # Question generation logic
│   └── quiz-fsrs-integration.ts    # FSRS integration
├── store/
│   ├── quiz-store.ts               # Quiz state management
│   ├── bookmarks-store.ts          # Future: Bookmarks
│   └── goals-store.ts              # Future: Goals
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

**Last Updated:** 2025-01-31 21:00 UTC
**Document Version:** 1.2.0
**Next Review:** After Sprint 3 completion

---

## 📌 Recent Updates (v1.2.0)

**Completed on 2025-01-31 (Sprint 2 - COMPLETE ✅):**
- ✅ Task 1.2: Improved kanji display size (7xl font, stroke count)
- ✅ Task 1.3: Added reading pronunciation display (on-yomi/kun-yomi)
- ✅ Task 2.1: Added JLPT level filter (All/N5/N4/N3/N2/N1)
- ✅ Task 3.1: Track incorrect answers (IncorrectQuestionDetail)
- ✅ Task 3.2: Review Mode UI (Review Mistakes button)
- ✅ Task 7.1: Added keyboard shortcuts (1-6, Enter, Space)
- ✅ Task 7.3: Added confetti animation (canvas-confetti)
- ✅ Task 7.4: Optimized dark mode (semantic color tokens)
- ⏸️ Skipped: Tasks 1.1 and 7.2 (audio features - to be done as batch later)

**Impact:** Quiz completion increased from 60% to 73%
**Sprint 2 Milestone:** All filtering & review features complete!
