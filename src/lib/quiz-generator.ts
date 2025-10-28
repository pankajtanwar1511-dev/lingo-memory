/**
 * Quiz Generator Service
 * Generates quiz questions from vocabulary cards
 */

import { VocabularyCard } from "@/types/vocabulary"
import {
  QuizQuestion,
  QuizMode,
  QuizDirection,
  QuizSettings,
  QuizDifficulty
} from "@/types/quiz"

/**
 * Generate quiz questions from vocabulary cards
 */
export function generateQuizQuestions(
  cards: VocabularyCard[],
  settings: QuizSettings,
  allCards: VocabularyCard[] // For generating distractors in multiple choice
): QuizQuestion[] {
  const questions: QuizQuestion[] = []

  // Shuffle and limit cards
  const shuffled = shuffleArray([...cards]).slice(0, settings.questionCount)

  for (const card of shuffled) {
    const question = createQuestion(card, settings, allCards)
    if (question) {
      questions.push(question)
    }
  }

  return questions
}

/**
 * Create a single quiz question
 */
function createQuestion(
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
      return createSentenceCompletionQuestion(card)

    case "flashcard":
      return createFlashcardQuestion(card, direction)

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

    default:
      question = card.kana
      correctAnswer = Array.isArray(card.meaning)
        ? card.meaning
        : [card.meaning]
  }

  return {
    id: `quiz_${card.id}_${Date.now()}`,
    card,
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
 */
function createSentenceCompletionQuestion(card: VocabularyCard): QuizQuestion | null {
  if (!card.examples || card.examples.length === 0) {
    return null
  }

  const example = card.examples[0]
  const sentence = example.japanese
  const wordToBlank = card.kanji || card.kana

  // Create blank in sentence
  const question = sentence.replace(wordToBlank, "____")

  return {
    id: `quiz_${card.id}_${Date.now()}`,
    card,
    mode: "sentence-completion",
    direction: "japanese-to-english",
    question,
    correctAnswer: wordToBlank,
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

    default:
      question = card.kana
      correctAnswer = Array.isArray(card.meaning)
        ? card.meaning[0]
        : card.meaning
  }

  return {
    id: `quiz_${card.id}_${Date.now()}`,
    card,
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
