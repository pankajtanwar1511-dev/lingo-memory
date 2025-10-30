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
      return createSentenceCompletionQuestion(card)

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
    contentType: "vocabulary",
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
