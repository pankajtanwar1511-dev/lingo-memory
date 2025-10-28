# Day 5 Quick Start Guide

## Getting Started

### 1. Access the Quiz Page

Navigate to `/quiz` in your application:

```bash
npm run dev
# Open http://localhost:3000/quiz
```

---

## Taking Your First Quiz

### Step 1: Configure Quiz Settings

1. **Choose Quiz Mode**:
   - Multiple Choice (easiest)
   - Typing (medium)
   - Listening (requires audio)

2. **Select Direction**:
   - Japanese → English (most common)
   - English → Japanese
   - Kanji → Reading
   - Reading → Kanji

3. **Pick Difficulty**:
   - Easy: 10 questions, no time limit
   - Medium: 20 questions, 60s each
   - Hard: 30 questions, 30s each

4. **Adjust Options**:
   - Question count (5-100)
   - Time limit (toggle + seconds)
   - Show hints
   - Play audio automatically
   - Auto-advance to next question
   - Strict typing (for typing mode)
   - Case sensitive (for typing mode)

5. **Click "Start Quiz"**

### Step 2: Answer Questions

**Multiple Choice**:
- Click the correct answer
- Selected choice highlights in purple
- Click "Submit" to confirm

**Typing**:
- Type your answer in the input box
- Press Enter or click "Submit"
- Accepts multiple correct answers

**Listening**:
- Click "Play Audio" to hear the word
- Choose the correct meaning
- Click "Submit"

**During Quiz**:
- Click "Show Hint" if hints are enabled
- Click "Skip" to skip a question
- Click "Pause" to pause the quiz
- Click "Quit" to abandon (not saved)

### Step 3: View Results

After completing the quiz, you'll see:
- Overall score (percentage)
- Correct, incorrect, skipped counts
- Perfect answers (no hints, fast)
- Accuracy percentage
- Total time and average time per question
- Question-by-question review

**Actions**:
- **Retry Quiz**: Same cards, new session
- **New Quiz**: Back to setup
- **View Progress**: Go to progress dashboard

---

## Using Audio Features

### Play Vocabulary Audio

```typescript
import { audioService } from "@/lib/audio-service"

// Play vocabulary card
await audioService.playVocabulary(card)

// Play kanji or kana
await audioService.playVocabulary(card, playKanji = true) // Kanji
await audioService.playVocabulary(card, playKanji = false) // Kana

// Play example sentence
await audioService.playExample("水を飲みます")

// Stop playback
audioService.stop()
```

### Configure Speech Settings

```typescript
await audioService.speak("こんにちは", {
  rate: 0.9,    // Speed (0.1 to 10)
  pitch: 1.0,   // Pitch (0 to 2)
  volume: 1.0,  // Volume (0 to 1)
  lang: "ja-JP" // Language
})
```

### Record Pronunciation

```typescript
// Record for 5 seconds
const audioBlob = await audioService.recordAudio(5000)

// Save or compare
if (audioBlob) {
  const url = URL.createObjectURL(audioBlob)
  // Play back or send to server for analysis
}
```

---

## Sentence Mining

### Step 1: Open Sentence Mining

Navigate to a page with the sentence mining component (or create one):

```tsx
import { SentenceMining } from "@/components/sentence-mining"
import { databaseService } from "@/services/database.service"

function MinePage() {
  return (
    <SentenceMining
      onAddCard={async (card) => {
        const id = `mined_${Date.now()}`
        await databaseService.addVocabularyCard({ ...card, id })
      }}
    />
  )
}
```

### Step 2: Paste Japanese Text

Paste any Japanese text:
```
日本語を勉強しています。
毎日漢字を練習します。
```

### Step 3: Analyze and Add

1. Click "Analyze Text"
2. Review extracted words
3. Click "Add" for words you want to learn
4. Cards are automatically tagged as "mined" and "needs-review"

**Note**: Current implementation is basic. For production, integrate MeCab or Kuromoji for proper tokenization.

---

## FSRS Integration

### Automatic Updates

FSRS data updates automatically after each quiz:
```typescript
// Happens automatically in quiz store
const result = endQuiz()
// → Updates FSRS study cards based on performance
```

### Get Recommended Cards

```typescript
import { getRecommendedQuizCards } from "@/lib/quiz-fsrs-integration"

const { dueCards, newCards, reviewCards } = await getRecommendedQuizCards(20)

// Use for quiz
const quizCards = [...dueCards, ...newCards.slice(0, 5)]
startQuiz(quizCards, settings, allCards)
```

### Get Smart Suggestions

```typescript
import { suggestQuizSettings } from "@/lib/quiz-fsrs-integration"
import { useQuizStore } from "@/store/quiz-store"

const { sessionHistory } = useQuizStore()
const suggestion = suggestQuizSettings(sessionHistory)

console.log(suggestion)
// {
//   recommendedDifficulty: "medium",
//   recommendedQuestionCount: 20,
//   recommendedTimeLimit: 60,
//   reasoning: "Good progress! Continue with current difficulty."
// }
```

### Calculate Retention

```typescript
import { calculateRetentionRate } from "@/lib/quiz-fsrs-integration"

const retention = calculateRetentionRate(quizResults)
console.log(`Retention: ${retention.toFixed(1)}%`)
```

---

## Viewing Statistics

### Access Quiz Statistics

```typescript
import { useQuizStore } from "@/store/quiz-store"

const { statistics } = useQuizStore()

console.log(statistics)
// {
//   totalSessions: 15,
//   totalQuestions: 300,
//   totalCorrect: 240,
//   totalIncorrect: 60,
//   averageScore: 80.5,
//   averageAccuracy: 82.1,
//   bestScore: 95,
//   worstScore: 65,
//   totalTimeSpent: 3600000, // ms
//   averageTimePerQuestion: 12000, // ms
//   favoriteMode: "multiple-choice",
//   favoriteDirection: "japanese-to-english",
//   streakCurrent: 3,
//   streakBest: 7,
//   lastSessionDate: Date
// }
```

### View Session History

```typescript
const { sessionHistory } = useQuizStore()

// Get last 5 sessions
const recent = sessionHistory.slice(-5)

recent.forEach(result => {
  console.log(`Session ${result.sessionId}:`)
  console.log(`- Score: ${result.score}%`)
  console.log(`- Questions: ${result.questions.length}`)
  console.log(`- Time: ${result.totalTime}ms`)
})
```

### Clear History

```typescript
const { clearHistory } = useQuizStore()

clearHistory() // Clears session history
```

---

## Code Examples

### Complete Quiz Flow

```typescript
import { useQuizStore } from "@/store/quiz-store"
import { databaseService } from "@/services/database.service"

async function startNewQuiz() {
  // 1. Get vocabulary
  const vocabulary = await databaseService.getVocabulary()

  // 2. Configure settings
  const settings: QuizSettings = {
    mode: "multiple-choice",
    direction: "japanese-to-english",
    difficulty: "medium",
    questionCount: 20,
    timeLimit: 60,
    showHints: true,
    playAudio: true,
    autoAdvance: true,
    strictTyping: false,
    caseSensitive: false
  }

  // 3. Start quiz
  const { startQuiz } = useQuizStore()
  startQuiz(vocabulary, settings, vocabulary)
}
```

### Answer Questions Programmatically

```typescript
const { answerQuestion, skipQuestion, nextQuestion } = useQuizStore()

// Answer a question
answerQuestion("water", 3500, 0) // answer, timeSpent (ms), hintsUsed

// Skip a question
skipQuestion()

// Manually advance (if auto-advance disabled)
nextQuestion()
```

### Custom Audio Implementation

```typescript
import { audioService } from "@/lib/audio-service"
import { VocabularyCard } from "@/types/vocabulary"

async function studyWithAudio(card: VocabularyCard) {
  // 1. Show card
  displayCard(card)

  // 2. Play audio
  await audioService.playVocabulary(card)

  // 3. Wait for user to reveal
  await waitForReveal()

  // 4. Play example
  if (card.examples.length > 0) {
    await audioService.playExample(card.examples[0].japanese)
  }
}
```

### Preload Audio

```typescript
import { audioService } from "@/lib/audio-service"

// In component
useEffect(() => {
  if (quizCards.length > 0) {
    // Preload audio for all quiz cards
    audioService.preloadVocabulary(quizCards)
  }

  return () => {
    // Cleanup
    audioService.stop()
    audioService.clearExpiredCache()
  }
}, [quizCards])
```

### FSRS-Powered Study Session

```typescript
import { getRecommendedQuizCards } from "@/lib/quiz-fsrs-integration"
import { useQuizStore } from "@/store/quiz-store"

async function startSmartStudySession() {
  // Get cards that need review
  const { dueCards, newCards } = await getRecommendedQuizCards(20)

  // Mix 15 due cards + 5 new cards
  const studyCards = [
    ...dueCards.slice(0, 15),
    ...newCards.slice(0, 5)
  ]

  // Get current vocabulary for distractors
  const allCards = await databaseService.getVocabulary()

  // Start quiz with recommended cards
  const { startQuiz } = useQuizStore()
  startQuiz(studyCards, settings, allCards)
}
```

---

## Tips & Best Practices

### Quiz Taking

1. **Start with Easy**: Build confidence with easy mode
2. **Use Hints Wisely**: Hints reduce your "perfect" score
3. **Type Carefully**: For typing mode, watch for typos
4. **Listen Multiple Times**: Don't hesitate to replay audio
5. **Review Mistakes**: Check question review after quiz
6. **Track Streaks**: Build daily study habits

### Audio Usage

1. **System Voices**: Install high-quality Japanese voices
2. **Browser Choice**: Chrome/Edge have better Web Speech API support
3. **Headphones**: Use headphones for better listening practice
4. **Slow Speech**: Use rate: 0.8-0.9 for clearer pronunciation
5. **Practice Shadowing**: Repeat after the audio

### Sentence Mining

1. **Quality Sources**: Use native materials (news, books, anime with subtitles)
2. **Context Matters**: Always mine with full sentence context
3. **Review Later**: Cards are tagged "needs-review" - edit them
4. **Add Definitions**: Current extraction is basic - add proper meanings
5. **Use Anki**: Export mined cards to Anki for review

### FSRS Optimization

1. **Honest Ratings**: Quiz ratings should reflect actual difficulty
2. **Daily Reviews**: Review due cards daily for best results
3. **Mix New & Old**: Balance new learning with review
4. **Track Retention**: Aim for 85-90% retention rate
5. **Adjust Difficulty**: If retention < 80%, make quizzes easier

---

## Troubleshooting

### Quiz Issues

**Problem**: Quiz won't start
**Solution**:
- Ensure vocabulary exists: `await db.vocabulary.count()`
- Initialize sample data if needed
- Check browser console for errors

**Problem**: Timer doesn't work
**Solution**:
- Check quiz settings, time limit enabled
- Ensure browser tab is active (timers pause in background)

**Problem**: Answers not saving
**Solution**:
- Check quiz store is initialized
- Verify IndexedDB permissions
- Check browser console for errors

### Audio Issues

**Problem**: No sound
**Solution**:
- Check system volume and browser permissions
- Verify Japanese voices installed
- Try different browser (Chrome recommended)
- Check `audioService.getJapaneseVoice()` returns voice

**Problem**: Wrong voice/accent
**Solution**:
- Install Google Japanese voices (better quality)
- System Settings → Speech → Add Japanese voice
- Try `speechSynthesis.getVoices()` in console

**Problem**: Recording not working
**Solution**:
- Grant microphone permissions
- Check browser supports `getUserMedia`
- Try HTTPS (required for microphone on some browsers)

### FSRS Issues

**Problem**: Cards not updating
**Solution**:
- Check study cards exist: `await db.studyCards.toArray()`
- Verify quiz completes successfully
- Check browser console for FSRS errors
- Manually update: `await updateFSRSFromQuizResult(result)`

**Problem**: Recommended cards empty
**Solution**:
- Create study cards for vocabulary
- Wait 24 hours for some cards to be due
- Use "new cards" for initial learning

---

## Performance Tips

### Optimize Quiz Performance

```typescript
// Preload questions
useEffect(() => {
  if (currentQuestionIndex < questions.length - 3) {
    // Preload next 3 questions' audio
    const upcoming = questions.slice(currentQuestionIndex + 1, currentQuestionIndex + 4)
    audioService.preloadVocabulary(upcoming.map(q => q.card))
  }
}, [currentQuestionIndex])
```

### Optimize Audio Caching

```typescript
// Clear expired cache periodically
useEffect(() => {
  const interval = setInterval(() => {
    audioService.clearExpiredCache()
  }, 60 * 60 * 1000) // Every hour

  return () => clearInterval(interval)
}, [])
```

### Optimize State Updates

```typescript
// Batch state updates
const { startQuiz, answerQuestion } = useQuizStore.getState()

// Instead of multiple updates
answerQuestion(answer1, time1, hints1)
answerQuestion(answer2, time2, hints2)

// Use bulk update (if implemented)
bulkAnswerQuestions([
  { answer: answer1, timeSpent: time1, hintsUsed: hints1 },
  { answer: answer2, timeSpent: time2, hintsUsed: hints2 }
])
```

---

## Next Steps

### Day 6 Preview

After mastering Day 5 features, Day 6 will add:

1. **Firebase Integration**
   - Cloud storage for vocabulary
   - Multi-device sync
   - User authentication
   - Backup and restore

2. **Premium Features**
   - OpenAI TTS for premium audio
   - Native Japanese audio recordings
   - Speech recognition for pronunciation
   - Advanced analytics

3. **Social Features**
   - Shared decks
   - Leaderboards
   - Study groups
   - Challenges

4. **Advanced Analytics**
   - Learning curves
   - Weak point identification
   - Time optimization
   - Progress predictions

---

## Resources

### Documentation
- **DAY5_FEATURES.md**: Complete feature documentation
- **DAY5_QUICKSTART.md**: This file

### External Tools
- **MeCab**: Japanese morphological analyzer
- **Kuromoji**: JavaScript Japanese tokenizer
- **JMdict**: Japanese-English dictionary
- **Tatoeba**: Example sentence database

### Recommended Reading
- FSRS Algorithm: https://github.com/open-spaced-repetition/fsrs.js
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- Japanese NLP: https://www.npmjs.com/package/kuromoji

---

**Day 5 Complete! 🚀**

You now have a full-featured quiz system with:
- ✅ 5 quiz modes
- ✅ Audio generation and playback
- ✅ Typing practice with validation
- ✅ Sentence mining
- ✅ FSRS integration
- ✅ Comprehensive analytics
- ✅ Progress tracking

Happy learning! 📚🎌
