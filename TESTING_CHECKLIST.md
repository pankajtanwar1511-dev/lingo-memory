# Testing Checklist - Day 4 & Day 5 Features

**Development Server**: Running at http://localhost:3001

---

## Pre-Test Setup

- [x] Development server started successfully
- [ ] Browser DevTools open (F12) to monitor console for errors
- [ ] Check Application tab → IndexedDB → vocabulary-db exists

---

## Day 4: Vocabulary Management System

### 1. Navigation & UI (5 min)

**URL**: http://localhost:3001/manage

- [ ] Page loads without errors
- [ ] All tabs visible: Vocabulary, Decks, Search, Bulk Operations
- [ ] Dark mode toggle works (if implemented)
- [ ] UI is responsive on different screen sizes

**Expected**: Clean UI with 4 tabs and no console errors

---

### 2. Vocabulary CRUD Operations (10 min)

#### Create New Card

1. [ ] Click "Add Card" button
2. [ ] Fill in the form:
   - Kanji: `水`
   - Kana: `みず`
   - Meaning: `water`
   - Examples: Click "Add Example"
     - Japanese: `水を飲みます`
     - English: `I drink water`
   - Tags: Add `jlpt-n5`, `noun`
   - Part of Speech: Select `noun`
   - JLPT Level: Select `N5`
3. [ ] Click "Save"
4. [ ] Card appears in the vocabulary list

**Expected**: Card saved successfully, visible in list

#### Edit Card

1. [ ] Click "Edit" on the newly created card
2. [ ] Modify meaning to: `water; cold water`
3. [ ] Add another tag: `basic`
4. [ ] Click "Save"
5. [ ] Changes reflected in list

**Expected**: Card updated successfully

#### Delete Card

1. [ ] Create a test card (any content)
2. [ ] Click "Delete" on the test card
3. [ ] Confirm deletion
4. [ ] Card removed from list

**Expected**: Card deleted successfully

---

### 3. Deck Management (10 min)

#### Create Deck

1. [ ] Switch to "Decks" tab
2. [ ] Click "Create Deck"
3. [ ] Fill in:
   - Name: `JLPT N5 Basics`
   - Description: `Basic vocabulary for JLPT N5`
   - Tags: `jlpt-n5`, `beginner`
4. [ ] Click "Create"
5. [ ] Deck appears in deck list

**Expected**: Deck created and visible

#### Add Cards to Deck

1. [ ] Click "View" on the deck
2. [ ] Click "Add Cards"
3. [ ] Select 2-3 vocabulary cards
4. [ ] Click "Add Selected"
5. [ ] Cards appear in deck

**Expected**: Cards successfully added to deck

#### Edit Deck

1. [ ] Click "Edit" on the deck
2. [ ] Change description to: `Essential JLPT N5 vocabulary`
3. [ ] Click "Save"
4. [ ] Changes reflected

**Expected**: Deck updated successfully

#### Delete Deck

1. [ ] Create a test deck
2. [ ] Click "Delete"
3. [ ] Confirm deletion
4. [ ] Deck removed

**Expected**: Deck deleted (cards remain in vocabulary)

---

### 4. Search & Filter (10 min)

**Switch to "Search" tab**

#### Text Search

1. [ ] Type `水` in search box
2. [ ] Results show cards containing `水`
3. [ ] Clear search
4. [ ] Type `water`
5. [ ] Results show cards with "water" in meaning

**Expected**: Search finds cards by kanji, kana, or meaning

#### JLPT Level Filter

1. [ ] Select "N5" from JLPT dropdown
2. [ ] Only N5 cards displayed
3. [ ] Select "All" to reset

**Expected**: Filtering works correctly

#### Tag Filter

1. [ ] Click tag filter
2. [ ] Select `jlpt-n5` tag
3. [ ] Only tagged cards displayed
4. [ ] Clear filter

**Expected**: Tag filtering works

#### Combined Filters

1. [ ] Search: `水`
2. [ ] JLPT: `N5`
3. [ ] Tags: `noun`
4. [ ] Results match ALL criteria

**Expected**: Multiple filters work together

---

### 5. Import/Export (15 min)

#### Export to CSV

1. [ ] Go to "Bulk Operations" tab
2. [ ] Select 3-5 cards
3. [ ] Click "Export Selected"
4. [ ] Choose "CSV" format
5. [ ] File downloads successfully
6. [ ] Open CSV in text editor
7. [ ] Verify structure: `kanji,kana,meaning,examples,tags`

**Expected**: Valid CSV file with selected cards

#### Export to JSON

1. [ ] Select same cards
2. [ ] Click "Export Selected"
3. [ ] Choose "JSON" format
4. [ ] File downloads
5. [ ] Open in text editor
6. [ ] Valid JSON with all card fields

**Expected**: Valid JSON file

#### Import from CSV

1. [ ] Create test CSV file:
```csv
kanji,kana,meaning,examples,tags
火,ひ,fire,"火をつける - light a fire",jlpt-n5;noun
```
2. [ ] Click "Import" button
3. [ ] Select CSV file
4. [ ] Click "Import"
5. [ ] Card appears in vocabulary list

**Expected**: CSV import successful

#### Import from JSON

1. [ ] Create test JSON:
```json
[
  {
    "kanji": "木",
    "kana": "き",
    "meaning": "tree; wood",
    "examples": [{"japanese": "木を切る", "english": "cut a tree", "source": {"type": "custom"}}],
    "tags": ["jlpt-n5", "noun"]
  }
]
```
2. [ ] Import JSON file
3. [ ] Card appears in list

**Expected**: JSON import successful

---

### 6. Bulk Operations (10 min)

#### Bulk Tag Addition

1. [ ] Select 3-5 cards
2. [ ] Click "Add Tags"
3. [ ] Enter: `reviewed`
4. [ ] Confirm
5. [ ] All selected cards now have `reviewed` tag

**Expected**: Tags added to all selected cards

#### Bulk Tag Removal

1. [ ] Select same cards
2. [ ] Click "Remove Tags"
3. [ ] Enter: `reviewed`
4. [ ] Confirm
5. [ ] Tag removed from all cards

**Expected**: Tags removed successfully

#### Bulk JLPT Update

1. [ ] Select cards without JLPT level
2. [ ] Click "Update JLPT"
3. [ ] Select `N4`
4. [ ] Confirm
5. [ ] All cards now N4

**Expected**: JLPT level updated

#### Bulk Move to Deck

1. [ ] Ensure deck exists
2. [ ] Select 3 cards
3. [ ] Click "Move to Deck"
4. [ ] Select deck
5. [ ] Confirm
6. [ ] Check deck - cards are there

**Expected**: Cards moved to deck

#### Bulk Delete

1. [ ] Create 2-3 test cards
2. [ ] Select them
3. [ ] Click "Delete Selected"
4. [ ] Confirm
5. [ ] Cards removed

**Expected**: Multiple cards deleted

---

## Day 5: Quiz System

### 7. Quiz Setup (10 min)

**URL**: http://localhost:3001/quiz

#### Page Load

- [ ] Page loads without errors
- [ ] Quiz setup screen visible
- [ ] All quiz mode cards displayed:
  - Multiple Choice
  - Typing
  - Listening
  - Sentence Completion
  - Flashcard

**Expected**: Clean setup interface

#### Configuration

1. [ ] Select "Multiple Choice" mode
2. [ ] Direction: "Japanese → English"
3. [ ] Difficulty: Click "Medium"
   - Should set: 20 questions, 60s time limit
4. [ ] Verify settings:
   - Question count slider works
   - Time limit toggle works
   - All checkboxes work (hints, audio, auto-advance, etc.)
5. [ ] Click "Start Quiz"

**Expected**: Quiz starts with correct settings

---

### 8. Multiple Choice Quiz (15 min)

#### Basic Functionality

1. [ ] Question displays with:
   - Japanese word (kanji/kana)
   - 4 answer choices (A, B, C, D)
   - Timer counting down
   - Progress indicator (e.g., "1/20")
2. [ ] Click an answer
3. [ ] Selected answer highlights
4. [ ] Click "Submit"
5. [ ] Immediate feedback (green = correct, red = incorrect)
6. [ ] Auto-advances to next question (if enabled)

**Expected**: Smooth question flow with visual feedback

#### Timer Functionality

1. [ ] Timer counts down
2. [ ] Progress bar decreases
3. [ ] When < 20% remaining, color changes to red/orange
4. [ ] If time expires:
   - Question auto-submits
   - Marked as incorrect

**Expected**: Timer works correctly with visual warnings

#### Hint System

1. [ ] Click "Show Hint" button
2. [ ] Hint reveals (examples or reading)
3. [ ] Hint counter increments
4. [ ] Complete quiz to see if hints affect score

**Expected**: Hints work and tracked

#### Skip Functionality

1. [ ] Click "Skip" button
2. [ ] Question skipped
3. [ ] Next question loads
4. [ ] Skipped count increments

**Expected**: Skip works correctly

#### Pause/Resume

1. [ ] Click "Pause" button
2. [ ] Quiz pauses with overlay
3. [ ] Timer stops
4. [ ] Click "Resume"
5. [ ] Timer continues
6. [ ] Can answer questions

**Expected**: Pause/resume works

#### Quit Quiz

1. [ ] Click "Quit" button
2. [ ] Confirmation dialog appears
3. [ ] Confirm quit
4. [ ] Returns to setup screen
5. [ ] Quiz not saved

**Expected**: Quit works without saving

---

### 9. Typing Mode Quiz (15 min)

#### Setup

1. [ ] Return to setup
2. [ ] Select "Typing" mode
3. [ ] Direction: "Japanese → English"
4. [ ] Disable time limit for easier testing
5. [ ] Enable "Strict Typing" option
6. [ ] Start quiz

**Expected**: Typing quiz starts

#### Typing Functionality

1. [ ] Question shows Japanese word
2. [ ] Text input box visible
3. [ ] Type correct answer
4. [ ] Press Enter or click "Submit"
5. [ ] Correct answer feedback

**Expected**: Typing answer works

#### Leniency Testing (Disable Strict Mode)

1. [ ] Return to setup
2. [ ] Disable "Strict Typing"
3. [ ] Start quiz
4. [ ] For answer "water":
   - Try: `water ` (extra space) - Should accept
   - Try: `Water` (capital) - Should accept if case-insensitive
   - Try: `watter` (typo) - May accept based on similarity

**Expected**: Lenient mode accepts close answers

#### Multiple Correct Answers

1. [ ] If card has multiple meanings (e.g., "water; cold water")
2. [ ] Try typing either: `water` or `cold water`
3. [ ] Both should be accepted

**Expected**: Multiple valid answers accepted

---

### 10. Listening Mode Quiz (10 min)

#### Setup

1. [ ] Select "Listening" mode
2. [ ] Enable "Play audio automatically"
3. [ ] Start quiz

**Expected**: Listening quiz starts

#### Audio Playback

1. [ ] Audio plays automatically when question loads
2. [ ] Click "Play Audio" button to replay
3. [ ] Hear Japanese pronunciation (via TTS)
4. [ ] Select correct meaning from choices
5. [ ] Submit answer

**Expected**: Audio plays correctly (requires Japanese TTS voice installed)

**Troubleshooting**:
- If no audio: Check browser console for errors
- Open DevTools → Console → Type: `speechSynthesis.getVoices()`
- Should see Japanese voices (ja-JP)

---

### 11. Audio Features (10 min)

#### Check Available Voices

1. [ ] Open browser console (F12)
2. [ ] Type: `speechSynthesis.getVoices().filter(v => v.lang.startsWith('ja'))`
3. [ ] Should see Japanese voices listed
4. [ ] If empty, install Japanese language pack:
   - **Windows**: Settings → Time & Language → Language → Add Japanese
   - **Mac**: System Preferences → Accessibility → Spoken Content → System Voice → Download Japanese
   - **Linux**: Install `speech-dispatcher` and Japanese voices

**Expected**: At least one Japanese voice available

#### Audio Caching

1. [ ] Complete a listening quiz with 5+ questions
2. [ ] Open DevTools → Application → Cache Storage
3. [ ] Look for audio cache entries
4. [ ] Replay same quiz
5. [ ] Audio should load faster (from cache)

**Expected**: Audio cached for 24 hours

---

### 12. Quiz Results (10 min)

#### Complete Quiz

1. [ ] Start any quiz mode
2. [ ] Answer all questions (mix of correct/incorrect/skip)
3. [ ] Quiz completes automatically
4. [ ] Results screen displays

**Expected**: Results screen shows

#### Results Display

- [ ] Large score percentage displayed
- [ ] Color-coded score:
  - Green ≥ 90%
  - Yellow ≥ 70%
  - Red < 70%
- [ ] Statistics cards show:
  - Correct count
  - Incorrect count
  - Skipped count
  - Perfect answers (no hints, fast)
- [ ] Performance metrics:
  - Accuracy percentage
  - Total time
  - Average time per question
- [ ] Question review section:
  - All questions listed
  - Your answer vs correct answer
  - Visual indicators (✓ ✗ ⊝)

**Expected**: Comprehensive results display

#### Results Actions

1. [ ] Click "Retry Quiz"
   - Should restart same cards
2. [ ] Click "New Quiz"
   - Returns to setup
3. [ ] Click "View Progress"
   - Should navigate to progress/stats page (if implemented)

**Expected**: All action buttons work

---

### 13. Sentence Mining (10 min)

**Note**: If not on a dedicated page, find where sentence mining component is used

#### Setup

1. [ ] Navigate to sentence mining feature
2. [ ] Paste Japanese text:
```
日本語を勉強しています。
毎日漢字を練習します。
新しい言葉を覚えます。
```

**Expected**: Text area accepts Japanese input

#### Analysis

1. [ ] Click "Analyze Text" button
2. [ ] Wait for processing
3. [ ] Extracted words displayed (basic extraction):
   - Individual kanji/kana
   - Each marked as "Definition needed"

**Expected**: Words extracted (basic tokenization)

#### Add to Vocabulary

1. [ ] Click "Add" on an extracted word
2. [ ] Card created with:
   - Kanji/kana from text
   - Tags: `mined`, `needs-review`
   - Context: full sentence
3. [ ] Check vocabulary list - card is there

**Expected**: Mined cards added successfully

**Note**: Current implementation is basic. Production needs MeCab/Kuromoji.

---

### 14. FSRS Integration (15 min)

#### Check Study Cards Database

1. [ ] Open DevTools → Application → IndexedDB
2. [ ] Open `vocabulary-db` database
3. [ ] Check `studyCards` table
4. [ ] Initially may be empty

**Expected**: Database table exists

#### Take Quiz to Trigger FSRS Update

1. [ ] Start a quiz with 5-10 questions
2. [ ] Answer questions (mix of correct/incorrect)
3. [ ] Complete quiz
4. [ ] Check browser console for: `"Updated FSRS data for X cards"`

**Expected**: Console confirms FSRS update

#### Verify Study Cards Created

1. [ ] Refresh IndexedDB in DevTools
2. [ ] Check `studyCards` table
3. [ ] Should see entries for each quiz card
4. [ ] Each card has:
   - `vocabularyId`
   - `due` (next review date)
   - `stability`
   - `difficulty`
   - `reps` (repetition count)
   - `state` (New, Learning, Review, Relearning)

**Expected**: Study cards created/updated

#### Recommended Cards

Open browser console and run:

```javascript
// Get recommended cards
const { databaseService } = await import('./src/services/database.service')
const db = databaseService
const studyCards = await db.getStudyCards()
console.log('Total study cards:', studyCards.length)

// Due cards
const now = new Date()
const due = studyCards.filter(c => c.due <= now)
console.log('Due cards:', due.length)

// New cards
const newCards = studyCards.filter(c => c.reps === 0)
console.log('New cards:', newCards.length)
```

**Expected**: Can query study cards programmatically

---

### 15. Quiz Statistics (10 min)

#### Check Persisted Statistics

1. [ ] Open DevTools → Application → Local Storage
2. [ ] Look for `quiz-storage` key
3. [ ] Should contain:
   - `statistics` object
   - `sessionHistory` array (last 50 sessions)

**Expected**: Quiz data persisted to localStorage

#### Statistics Data

Verify statistics object has:
- [ ] `totalSessions`: Number of quizzes taken
- [ ] `totalQuestions`: Total questions answered
- [ ] `totalCorrect`: Correct answers
- [ ] `totalIncorrect`: Incorrect answers
- [ ] `averageScore`: Average quiz score
- [ ] `averageAccuracy`: Accuracy across all quizzes
- [ ] `bestScore`: Highest score
- [ ] `worstScore`: Lowest score
- [ ] `streakCurrent`: Current daily streak
- [ ] `streakBest`: Best streak achieved

**Expected**: All statistics tracked

#### Session History

1. [ ] Take 2-3 quizzes
2. [ ] Check localStorage `quiz-storage`
3. [ ] `sessionHistory` array has entries
4. [ ] Each session has:
   - `sessionId`
   - `startedAt` / `completedAt`
   - `questions` array
   - `answers` array
   - `score`, `accuracy`, `totalTime`

**Expected**: Full session history saved

#### Streak Tracking

1. [ ] Take quiz today
2. [ ] Check `statistics.streakCurrent`
3. [ ] Should be ≥ 1
4. [ ] Take another quiz same day
5. [ ] Streak stays same (doesn't increment twice in one day)

**Expected**: Streak tracks daily study

---

## Browser Console Checks

### No Errors

Throughout testing, monitor console for:
- [ ] No React errors or warnings
- [ ] No database errors
- [ ] No CORS errors
- [ ] No TypeScript errors

### Expected Logs

You may see helpful logs:
- `"Updated FSRS data for X cards"` after quiz completion
- Audio service logs about voices/caching
- Database operation confirmations

---

## Issues Log

**Instructions**: As you test, note any bugs or issues here:

### Issue 1
- **Feature**:
- **Steps to Reproduce**:
- **Expected**:
- **Actual**:
- **Error Messages**:

### Issue 2
- **Feature**:
- **Steps to Reproduce**:
- **Expected**:
- **Actual**:
- **Error Messages**:

---

## Post-Testing

- [ ] All Day 4 features working
- [ ] All Day 5 features working
- [ ] No critical bugs
- [ ] Ready for bug fixes (if any found)
- [ ] Ready for Day 6 implementation (if all passed)

---

## Summary

**Completion Time**: _______

**Features Tested**: _____ / 15

**Bugs Found**: _____

**Status**:
- [ ] All features working perfectly ✅
- [ ] Minor issues found (fixable) ⚠️
- [ ] Major issues found (needs attention) ❌

---

**Next Steps**: Report bugs to AI assistant for fixes, or proceed to Day 6 implementation.
