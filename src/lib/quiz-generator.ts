/**
 * Quiz Generator Service
 * Generates quiz questions from vocabulary or kanji cards
 */

import { VocabularyCard } from "@/types/vocabulary"
import { KanjiCard } from "@/types/kanji"
import {
  QuizQuestion,
  QuizMode,
  QuizDirection,
  QuizSettings,
  QuizDifficulty
} from "@/types/quiz"

/**
 * Generate quiz questions from vocabulary or kanji cards
 */
export function generateQuizQuestions(
  cards: (VocabularyCard | KanjiCard)[],
  settings: QuizSettings,
  allCards: (VocabularyCard | KanjiCard)[] // For generating distractors in multiple choice
): QuizQuestion[] {
  const questions: QuizQuestion[] = []

  // Shuffle and limit cards
  const shuffled = shuffleArray([...cards]).slice(0, settings.questionCount)

  for (const card of shuffled) {
    let question: QuizQuestion | null = null

    // For mixed mode, determine card type dynamically
    if (settings.contentType === "mixed") {
      // Check if card is vocabulary (has 'kana' property) or kanji
      if ("kana" in card) {
        // Filter allCards to only vocabulary for distractors
        const vocabCards = allCards.filter((c): c is VocabularyCard => "kana" in c)
        question = createVocabQuestion(card as VocabularyCard, settings, vocabCards)
      } else {
        // Filter allCards to only kanji for distractors
        const kanjiCards = allCards.filter((c): c is KanjiCard => "strokeCount" in c)
        question = createKanjiQuestion(card as KanjiCard, settings, kanjiCards)
      }
    } else if (settings.contentType === "vocabulary") {
      question = createVocabQuestion(card as VocabularyCard, settings, allCards as VocabularyCard[])
    } else {
      question = createKanjiQuestion(card as KanjiCard, settings, allCards as KanjiCard[])
    }

    if (question) {
      questions.push(question)
    }
  }

  return questions
}

/**
 * Create a vocabulary quiz question
 */
function createVocabQuestion(
  card: VocabularyCard,
  settings: QuizSettings,
  allCards: VocabularyCard[]
): QuizQuestion | null {
  const { mode, direction } = settings

  switch (mode) {
    case "multiple-choice":
      return createMultipleChoiceQuestion(card, direction, allCards, settings.difficulty)

    case "typing":
      return createTypingQuestion(card, direction)

    case "listening":
      return createListeningQuestion(card, allCards, settings.difficulty)

    case "sentence-completion":
      return createSentenceCompletionQuestion(card, settings)

    case "sentence-building":
      return createSentenceBuildingQuestion(card, settings)

    case "flashcard":
      return createFlashcardQuestion(card, direction)

    default:
      return null
  }
}

/**
 * Create a kanji quiz question
 */
function createKanjiQuestion(
  card: KanjiCard,
  settings: QuizSettings,
  allCards: KanjiCard[]
): QuizQuestion | null {
  const { mode, direction } = settings

  switch (mode) {
    case "multiple-choice":
      return createKanjiMultipleChoiceQuestion(card, direction, allCards, settings.difficulty)

    case "typing":
      return createKanjiTypingQuestion(card, direction)

    case "stroke-order":
      return createKanjiStrokeOrderQuestion(card, direction)

    case "flashcard":
      return createKanjiFlashcardQuestion(card, direction)

    default:
      return null
  }
}

/**
 * Create multiple choice question
 */
function createMultipleChoiceQuestion(
  card: VocabularyCard,
  direction: QuizDirection,
  allCards: VocabularyCard[],
  difficulty: QuizDifficulty
): QuizQuestion {
  const choiceCount = difficulty === "easy" ? 4 : difficulty === "medium" ? 4 : 6
  let question: string
  let correctAnswer: string
  let choices: string[]

  switch (direction) {
    case "japanese-to-english":
      question = card.kanji ? `${card.kanji} (${card.kana})` : card.kana
      correctAnswer = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning

      choices = generateDistractors(
        correctAnswer,
        allCards.map(c =>
          Array.isArray(c.meaning) ? c.meaning[0] : c.meaning
        ),
        choiceCount - 1
      )
      break

    case "english-to-japanese":
      question = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      correctAnswer = card.kanji || card.kana
      choices = generateDistractors(
        correctAnswer,
        allCards.map(c => c.kanji || c.kana),
        choiceCount - 1
      )
      break

    case "kanji-to-reading":
      question = card.kanji || card.kana
      correctAnswer = card.kana
      choices = generateDistractors(
        correctAnswer,
        allCards.map(c => c.kana),
        choiceCount - 1
      )
      break

    case "reading-to-kanji":
      question = card.kana
      correctAnswer = card.kanji || card.kana
      choices = generateDistractors(
        correctAnswer,
        allCards.filter(c => c.kanji).map(c => c.kanji!),
        choiceCount - 1
      )
      break

    case "kanji-only-to-english":
      // Show ONLY kanji, no kana hint
      question = card.kanji || card.kana
      correctAnswer = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      choices = generateDistractors(
        correctAnswer,
        allCards.map(c =>
          Array.isArray(c.meaning) ? c.meaning[0] : c.meaning
        ),
        choiceCount - 1
      )
      break

    case "kana-only-to-english":
      // Show ONLY kana, never show kanji
      question = card.kana
      correctAnswer = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      choices = generateDistractors(
        correctAnswer,
        allCards.map(c =>
          Array.isArray(c.meaning) ? c.meaning[0] : c.meaning
        ),
        choiceCount - 1
      )
      break

    case "english-to-kanji":
      // Answer must be in kanji form
      question = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      correctAnswer = card.kanji || card.kana
      choices = generateDistractors(
        correctAnswer,
        allCards.map(c => c.kanji || c.kana),
        choiceCount - 1
      )
      break

    case "english-to-kana":
      // Answer must be in kana form
      question = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      correctAnswer = card.kana
      choices = generateDistractors(
        correctAnswer,
        allCards.map(c => c.kana),
        choiceCount - 1
      )
      break

    default:
      question = card.kana
      correctAnswer = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      choices = generateDistractors(
        correctAnswer,
        allCards.map(c =>
          Array.isArray(c.meaning) ? c.meaning[0] : c.meaning
        ),
        choiceCount - 1
      )
  }

  // Add correct answer and shuffle
  choices.push(correctAnswer)
  choices = shuffleArray(choices)

  return {
    id: `quiz_${card.id}_${Date.now()}`,
    card,
    contentType: "vocabulary",
    mode: "multiple-choice",
    direction,
    question,
    correctAnswer,
    choices,
    hint: getHint(card, direction)
  }
}

/**
 * Create typing question
 */
function createTypingQuestion(
  card: VocabularyCard,
  direction: QuizDirection
): QuizQuestion {
  let question: string
  let correctAnswer: string | string[]

  switch (direction) {
    case "japanese-to-english":
      question = card.kanji ? `${card.kanji} (${card.kana})` : card.kana
      correctAnswer = Array.isArray(card.meaning)
        ? card.meaning
        : [card.meaning]
      break

    case "english-to-japanese":
      question = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      correctAnswer = [card.kanji || card.kana, card.kana]
      if (card.kanji) {
        correctAnswer = [card.kanji, card.kana] // Accept both
      }
      break

    case "kanji-to-reading":
      question = card.kanji || card.kana
      correctAnswer = card.kana
      break

    case "reading-to-kanji":
      question = card.kana
      correctAnswer = card.kanji || card.kana
      break

    case "kanji-only-to-english":
      // Show ONLY kanji, no kana hint
      question = card.kanji || card.kana
      correctAnswer = Array.isArray(card.meaning)
        ? card.meaning
        : [card.meaning]
      break

    case "kana-only-to-english":
      // Show ONLY kana, never show kanji
      question = card.kana
      correctAnswer = Array.isArray(card.meaning)
        ? card.meaning
        : [card.meaning]
      break

    case "english-to-kanji":
      // Answer must be ONLY in kanji form (strict)
      question = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      correctAnswer = card.kanji || card.kana
      break

    case "english-to-kana":
      // Answer must be ONLY in kana form (strict)
      question = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      correctAnswer = card.kana
      break

    default:
      question = card.kana
      correctAnswer = Array.isArray(card.meaning)
        ? card.meaning
        : [card.meaning]
  }

  return {
    id: `quiz_${card.id}_${Date.now()}`,
    card,
    contentType: "vocabulary",
    mode: "typing",
    direction,
    question,
    correctAnswer,
    hint: getHint(card, direction)
  }
}

/**
 * Create listening question
 */
function createListeningQuestion(
  card: VocabularyCard,
  allCards: VocabularyCard[],
  difficulty: QuizDifficulty
): QuizQuestion {
  const choiceCount = difficulty === "easy" ? 4 : difficulty === "medium" ? 4 : 6
  const question = "Listen and choose the correct meaning"

  const correctAnswer = Array.isArray(card.meaning)
    ? card.meaning[0]
    : card.meaning

  let choices = generateDistractors(
    correctAnswer,
    allCards.map(c =>
      Array.isArray(c.meaning) ? c.meaning[0] : c.meaning
    ),
    choiceCount - 1
  )

  choices.push(correctAnswer)
  choices = shuffleArray(choices)

  return {
    id: `quiz_${card.id}_${Date.now()}`,
    card,
    contentType: "vocabulary",
    mode: "listening",
    direction: "japanese-to-english",
    question,
    correctAnswer,
    choices,
    audioUrl: card.audioUrl, // Use card's audioUrl if available, otherwise audio service will use TTS
    hint: getHint(card, "japanese-to-english")
  }
}

/**
 * Create sentence completion question
 * Enhanced to use all examples, support multiple blanks, and scale with difficulty
 */
function createSentenceCompletionQuestion(
  card: VocabularyCard,
  settings: QuizSettings
): QuizQuestion | null {
  if (!card.examples || card.examples.length === 0) {
    return null
  }

  // Select random example from all available (not just first)
  const exampleIndex = Math.floor(Math.random() * card.examples.length)
  const example = card.examples[exampleIndex]
  const sentence = example.japanese
  const wordToBlank = card.kanji || card.kana

  // Determine number of blanks based on difficulty
  let blankCount = 1
  if (settings.difficulty === "medium") {
    blankCount = Math.random() > 0.5 ? 1 : 2
  } else if (settings.difficulty === "hard") {
    blankCount = Math.min(2 + Math.floor(Math.random() * 2), 3) // 2-3 blanks
  }

  // List of Japanese particles to avoid blanking
  const particles = [
    "は", "が", "を", "に", "へ", "で", "と", "から", "まで", "より",
    "も", "か", "ね", "よ", "な", "の", "や", "ば", "けど", "けれど"
  ]

  // Create blanks (primary target always blanked)
  let questionText = sentence
  const blankedWords: string[] = []

  // Always blank the target word first
  questionText = sentence.replace(wordToBlank, "____")
  blankedWords.push(wordToBlank)

  // For multiple blanks, find additional words to blank (avoiding particles)
  if (blankCount > 1 && sentence.length > wordToBlank.length + 10) {
    // Simple approach: blank 2-3 character words that aren't particles
    const words = sentence.split(/([。、！？\s]+)/).filter(w => w.trim().length > 0)

    const blankableWords = words.filter(word =>
      word.length >= 2 &&
      word.length <= 4 &&
      !particles.includes(word) &&
      word !== wordToBlank &&
      !/[。、！？\s]/.test(word) &&
      questionText.includes(word) // Must still be in question (not already blanked)
    )

    for (let i = 0; i < Math.min(blankCount - 1, blankableWords.length); i++) {
      const wordToAdd = blankableWords[i]
      questionText = questionText.replace(wordToAdd, "____")
      blankedWords.push(wordToAdd)
    }
  }

  // Correct answer is the primary target word or all blanked words
  const correctAnswer = blankedWords.length === 1
    ? blankedWords[0]
    : blankedWords

  return {
    id: `quiz_${card.id}_${Date.now()}`,
    card,
    contentType: "vocabulary",
    mode: "sentence-completion",
    direction: "japanese-to-english",
    question: questionText,
    correctAnswer,
    hint: example.english
  }
}

/**
 * Create flashcard question (for review)
 */
function createFlashcardQuestion(
  card: VocabularyCard,
  direction: QuizDirection
): QuizQuestion {
  let question: string
  let correctAnswer: string

  switch (direction) {
    case "japanese-to-english":
      question = card.kanji ? `${card.kanji} (${card.kana})` : card.kana
      correctAnswer = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      break

    case "english-to-japanese":
      question = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      correctAnswer = card.kanji || card.kana
      break

    case "kanji-to-reading":
      question = card.kanji || card.kana
      correctAnswer = card.kana
      break

    case "reading-to-kanji":
      question = card.kana
      correctAnswer = card.kanji || card.kana
      break

    case "kanji-only-to-english":
      // Show ONLY kanji, no kana hint
      question = card.kanji || card.kana
      correctAnswer = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      break

    case "kana-only-to-english":
      // Show ONLY kana, never show kanji
      question = card.kana
      correctAnswer = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      break

    case "english-to-kanji":
      // Answer in kanji form
      question = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      correctAnswer = card.kanji || card.kana
      break

    case "english-to-kana":
      // Answer in kana form
      question = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
      correctAnswer = card.kana
      break

    default:
      question = card.kana
      correctAnswer = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
  }

  return {
    id: `quiz_${card.id}_${Date.now()}`,
    card,
    contentType: "vocabulary",
    mode: "flashcard",
    direction,
    question,
    correctAnswer,
    hint: getHint(card, direction)
  }
}

/**
 * Generate distractor choices (wrong answers)
 */
function generateDistractors(
  correctAnswer: string,
  allOptions: string[],
  count: number
): string[] {
  const distractors = allOptions
    .filter(opt => opt !== correctAnswer && opt) // Remove correct answer and empty strings
    .filter((opt, index, self) => self.indexOf(opt) === index) // Remove duplicates

  // Shuffle and take required count
  return shuffleArray(distractors).slice(0, count)
}

/**
 * Get hint for a card
 */
function getHint(card: VocabularyCard, direction: QuizDirection): string {
  switch (direction) {
    case "japanese-to-english":
      if (card.partOfSpeech && card.partOfSpeech.length > 0) {
        return `Part of speech: ${card.partOfSpeech[0]}`
      }
      return "Think about the context"

    case "english-to-japanese":
      if (card.examples && card.examples.length > 0) {
        return `Example: ${card.examples[0].english}`
      }
      return "Think about the meaning"

    case "kanji-to-reading":
      const kanjiHint = card.kanji?.charAt(0) || ""
      return `Starts with: ${card.kana.charAt(0)}`

    case "reading-to-kanji":
      return `Meaning: ${
        Array.isArray(card.meaning) ? card.meaning[0] : card.meaning
      }`

    default:
      return "You can do it!"
  }
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Validate typing answer
 */
export function validateTypingAnswer(
  userAnswer: string,
  correctAnswers: string | string[],
  strictMode: boolean = false,
  caseSensitive: boolean = false
): boolean {
  const answers = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers]
  const normalizedUser = caseSensitive
    ? userAnswer.trim()
    : userAnswer.trim().toLowerCase()

  for (const answer of answers) {
    const normalizedCorrect = caseSensitive
      ? answer.trim()
      : answer.trim().toLowerCase()

    if (strictMode) {
      if (normalizedUser === normalizedCorrect) return true
    } else {
      // Allow some flexibility
      if (
        normalizedUser === normalizedCorrect ||
        normalizedUser.replace(/\s+/g, "") === normalizedCorrect.replace(/\s+/g, "")
      ) {
        return true
      }
    }
  }

  return false
}

/**
 * Calculate similarity between two strings (for partial credit)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(
    longer.toLowerCase(),
    shorter.toLowerCase()
  )

  return (longer.length - editDistance) / longer.length
}

/**
 * Calculate Levenshtein distance (edit distance)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

/**
 * Kanji-specific question generation functions
 */

/**
 * Create multiple choice question for kanji
 */
function createKanjiMultipleChoiceQuestion(
  card: KanjiCard,
  direction: QuizDirection,
  allCards: KanjiCard[],
  difficulty: QuizDifficulty
): QuizQuestion {
  const choiceCount = difficulty === "easy" ? 4 : difficulty === "medium" ? 4 : 6
  let question: string
  let correctAnswer: string
  let choices: string[]

  switch (direction) {
    case "kanji-to-meaning":
      question = card.kanji
      correctAnswer = card.meanings[0]
      choices = generateDistractors(
        correctAnswer,
        allCards.map(k => k.meanings[0]),
        choiceCount - 1
      )
      break

    case "meaning-to-kanji":
      question = card.meanings[0]
      correctAnswer = card.kanji
      choices = generateDistractors(
        correctAnswer,
        allCards.map(k => k.kanji),
        choiceCount - 1
      )
      break

    case "kanji-to-reading":
      question = card.kanji
      // Combine on and kun readings
      const allReadings = [...card.onReadings, ...card.kunReadings]
      correctAnswer = allReadings[0] || card.kanji
      choices = generateDistractors(
        correctAnswer,
        allCards.flatMap(k => [...k.onReadings, ...k.kunReadings]),
        choiceCount - 1
      )
      break

    case "reading-to-kanji":
      const readings = [...card.onReadings, ...card.kunReadings]
      question = readings[0] || card.kanji
      correctAnswer = card.kanji
      choices = generateDistractors(
        correctAnswer,
        allCards.map(k => k.kanji),
        choiceCount - 1
      )
      break

    default:
      question = card.kanji
      correctAnswer = card.meanings[0]
      choices = generateDistractors(
        correctAnswer,
        allCards.map(k => k.meanings[0]),
        choiceCount - 1
      )
  }

  choices.push(correctAnswer)
  choices = shuffleArray(choices)

  return {
    id: `quiz_${card.id}_${Date.now()}`,
    card,
    contentType: "kanji",
    mode: "multiple-choice",
    direction,
    question,
    correctAnswer,
    choices,
    hint: getKanjiHint(card, direction)
  }
}

/**
 * Create typing question for kanji
 */
function createKanjiTypingQuestion(
  card: KanjiCard,
  direction: QuizDirection
): QuizQuestion {
  let question: string
  let correctAnswer: string | string[]

  switch (direction) {
    case "kanji-to-meaning":
      question = card.kanji
      correctAnswer = card.meanings // Accept all meanings
      break

    case "meaning-to-kanji":
      question = card.meanings[0]
      correctAnswer = card.kanji
      break

    case "kanji-to-reading":
      question = card.kanji
      correctAnswer = [...card.onReadings, ...card.kunReadings] // Accept any reading
      break

    case "reading-to-kanji":
      const readings = [...card.onReadings, ...card.kunReadings]
      question = readings[0] || card.kanji
      correctAnswer = card.kanji
      break

    default:
      question = card.kanji
      correctAnswer = card.meanings
  }

  return {
    id: `quiz_${card.id}_${Date.now()}`,
    card,
    contentType: "kanji",
    mode: "typing",
    direction,
    question,
    correctAnswer,
    hint: getKanjiHint(card, direction)
  }
}

/**
 * Create flashcard question for kanji
 */
function createKanjiFlashcardQuestion(
  card: KanjiCard,
  direction: QuizDirection
): QuizQuestion {
  let question: string
  let correctAnswer: string

  switch (direction) {
    case "kanji-to-meaning":
      question = card.kanji
      correctAnswer = card.meanings[0]
      break

    case "meaning-to-kanji":
      question = card.meanings[0]
      correctAnswer = card.kanji
      break

    case "kanji-to-reading":
      question = card.kanji
      const allReadings = [...card.onReadings, ...card.kunReadings]
      correctAnswer = allReadings.join(", ")
      break

    case "reading-to-kanji":
      const readings = [...card.onReadings, ...card.kunReadings]
      question = readings.join(", ")
      correctAnswer = card.kanji
      break

    default:
      question = card.kanji
      correctAnswer = card.meanings[0]
  }

  return {
    id: `quiz_${card.id}_${Date.now()}`,
    card,
    contentType: "kanji",
    mode: "flashcard",
    direction,
    question,
    correctAnswer,
    hint: getKanjiHint(card, direction)
  }
}

/**
 * Create stroke order question for kanji
 * Note: The direction parameter is accepted to maintain consistency with other question types,
 * but stroke-order mode does not use direction logic - it always shows the kanji to draw.
 */
function createKanjiStrokeOrderQuestion(card: KanjiCard, direction: QuizDirection): QuizQuestion {
  return {
    id: `quiz_${card.id}_${Date.now()}`,
    card,
    contentType: "kanji",
    mode: "stroke-order",
    direction, // Store direction but doesn't affect stroke-order behavior
    question: card.kanji,
    correctAnswer: `${card.strokeCount} strokes`,
    hint: `This kanji means "${card.meanings[0]}" and has ${card.strokeCount} strokes`
  }
}

/**
 * Get hint for a kanji card
 */
function getKanjiHint(card: KanjiCard, direction: QuizDirection): string {
  switch (direction) {
    case "kanji-to-meaning":
      return `Stroke count: ${card.strokeCount}`

    case "meaning-to-kanji":
      if (card.radical && card.radical.meaning) {
        return `Radical: ${card.radical.literal} (${card.radical.meaning})`
      }
      return `Stroke count: ${card.strokeCount}`

    case "kanji-to-reading":
      const hasOn = card.onReadings.length > 0
      const hasKun = card.kunReadings.length > 0
      if (hasOn && hasKun) {
        return `Has both on-yomi and kun-yomi readings`
      } else if (hasOn) {
        return `Has on-yomi reading (katakana)`
      } else if (hasKun) {
        return `Has kun-yomi reading (hiragana)`
      }
      return `Think about common readings`

    case "reading-to-kanji":
      return `Meaning: ${card.meanings[0]}`

    default:
      return "You can do it!"
  }
}

/**
 * Create sentence building question (drag-and-drop)
 * User must arrange scrambled words into correct order
 */
function createSentenceBuildingQuestion(
  card: VocabularyCard,
  settings: QuizSettings
): QuizQuestion | null {
  if (!card.examples || card.examples.length === 0) {
    console.log(`[Sentence Building] Skipping card ${card.id}: no examples`)
    return null
  }

  // Select random example from all available
  const exampleIndex = Math.floor(Math.random() * card.examples.length)
  const example = card.examples[exampleIndex]

  // Use kana field (hiragana only) if kanaOnly setting is enabled
  const sentence = settings.kanaOnly ? example.kana : example.japanese

  // Japanese particles list for intelligent word splitting
  const particles = [
    "は", "が", "を", "に", "へ", "で", "と", "から", "まで", "より",
    "も", "か", "ね", "よ", "な", "の", "や", "ば", "けど", "けれど",
    "って", "だけ", "しか", "さえ", "こそ", "など", "くらい", "ほど"
  ]

  // Common verb/adjective endings and auxiliary verbs that indicate word boundaries
  const wordEndings = [
    "ます", "ました", "ません", "ませんでした",
    "です", "でした", "じゃない", "ではない",
    "だ", "た", "ない", "なかった",
    "られる", "られた", "させる", "させた",
    "ている", "ていた", "てある", "てあった",
    "そう", "よう", "らしい"
  ]

  // Smart word splitting with linguistic boundaries
  const words: string[] = []
  let currentWord = ""
  let i = 0

  while (i < sentence.length) {
    const char = sentence[i]
    const isSpace = /\s/.test(char)
    const isPunctuation = /[。、！？]/.test(char)
    const isParticle = particles.includes(char)

    if (isSpace) {
      // Space: save current word and skip
      if (currentWord) {
        words.push(currentWord)
        currentWord = ""
      }
      i++
      continue
    }

    if (isPunctuation) {
      // Punctuation: save word, skip punctuation
      if (currentWord) {
        words.push(currentWord)
        currentWord = ""
      }
      i++
      continue
    }

    if (isParticle) {
      // Particle: save word, add particle separately
      if (currentWord) {
        words.push(currentWord)
        currentWord = ""
      }
      words.push(char)
      i++
      continue
    }

    // Check for multi-character word endings
    let foundEnding = false
    for (const ending of wordEndings) {
      if (sentence.slice(i, i + ending.length) === ending) {
        // Found a word ending - include it with current word
        currentWord += ending
        words.push(currentWord)
        currentWord = ""
        i += ending.length
        foundEnding = true
        break
      }
    }

    if (foundEnding) {
      continue
    }

    // Regular character: add to current word
    currentWord += char
    i++
  }

  // Add final word if any
  if (currentWord) {
    words.push(currentWord)
  }

  const validWords = words.filter(w => w.trim().length > 0)

  // Need at least 2 words for meaningful scrambling (lowered from 3)
  if (validWords.length < 2) {
    console.log(`[Sentence Building] Skipping card ${card.id}: only ${validWords.length} words in "${sentence}"`)
    return null
  }

  console.log(`[Sentence Building] Creating question for card ${card.id}: ${validWords.length} words - "${sentence}"`)

  // Scramble the words (Fisher-Yates shuffle)
  const scrambledWords = [...validWords]
  for (let i = scrambledWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [scrambledWords[i], scrambledWords[j]] = [scrambledWords[j], scrambledWords[i]]
  }

  // Ensure scrambled order is different from correct order
  let attempts = 0
  while (
    scrambledWords.join("") === validWords.join("") &&
    attempts < 10
  ) {
    // Try different scramble
    for (let i = scrambledWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambledWords[i], scrambledWords[j]] = [scrambledWords[j], scrambledWords[i]]
    }
    attempts++
  }

  // Always show the English translation as the question
  // User builds the Japanese sentence from scrambled words
  const questionText = example.english
  const hintText = sentence // Show complete Japanese as hint

  return {
    id: `quiz_${card.id}_${Date.now()}`,
    card,
    contentType: "vocabulary",
    mode: "sentence-building",
    direction: settings.direction,
    question: questionText,
    correctAnswer: validWords, // Correct word order (array)
    scrambledWords, // Scrambled word order (array) - custom field
    hint: hintText
  }
}
