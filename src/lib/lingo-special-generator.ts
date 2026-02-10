/**
 * LingoSpecial Quiz Generator
 * Creates ultra-hard quiz questions with confusable options
 */

import { QuizQuestion, QuizDirection } from "@/types/quiz"

export interface DlingoVocabEntry {
  id: number
  japanese: string
  english: string
  partOfSpeech: string
  source: string
  jlptLevel: string
  difficulty: number
  suggestedQuizTypes: string[]
  tags: string[]
  deck: string
  examples: any[]
}

interface ConfusableGroup {
  word: DlingoVocabEntry
  confusables: DlingoVocabEntry[]
}

/**
 * Calculate visual similarity between two Japanese strings
 */
function calculateVisualSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1.0

  // Length similarity (important for visual confusion)
  const lengthDiff = Math.abs(str1.length - str2.length)
  const lengthScore = 1 - (lengthDiff / Math.max(str1.length, str2.length))

  // Character overlap
  const chars1 = new Set(str1.split(''))
  const chars2 = new Set(str2.split(''))
  const intersection = new Set([...chars1].filter(x => chars2.has(x)))
  const union = new Set([...chars1, ...chars2])
  const overlapScore = intersection.size / union.size

  // Prefix/suffix similarity (words starting or ending similarly are confusing)
  let prefixScore = 0
  let suffixScore = 0
  const minLen = Math.min(str1.length, str2.length)

  for (let i = 0; i < minLen; i++) {
    if (str1[i] === str2[i]) prefixScore++
    else break
  }
  prefixScore = prefixScore / minLen

  for (let i = 1; i <= minLen; i++) {
    if (str1[str1.length - i] === str2[str2.length - i]) suffixScore++
    else break
  }
  suffixScore = suffixScore / minLen

  // Weighted combination
  return (
    lengthScore * 0.3 +
    overlapScore * 0.3 +
    prefixScore * 0.2 +
    suffixScore * 0.2
  )
}

/**
 * Calculate semantic similarity based on tags and categories
 */
function calculateSemanticSimilarity(word1: DlingoVocabEntry, word2: DlingoVocabEntry): number {
  // Same part of speech is highly confusing
  const posMatch = word1.partOfSpeech === word2.partOfSpeech ? 0.4 : 0

  // Same JLPT level means similar difficulty
  const jlptMatch = word1.jlptLevel === word2.jlptLevel ? 0.2 : 0

  // Tag overlap (thematic similarity)
  const tags1 = new Set(word1.tags)
  const tags2 = new Set(word2.tags)
  const tagIntersection = new Set([...tags1].filter(x => tags2.has(x)))
  const tagScore = tags1.size > 0 && tags2.size > 0
    ? (tagIntersection.size / Math.max(tags1.size, tags2.size)) * 0.4
    : 0

  return posMatch + jlptMatch + tagScore
}

/**
 * Find the most confusable words for a given word
 */
export function findConfusableOptions(
  targetWord: DlingoVocabEntry,
  allWords: DlingoVocabEntry[],
  count: number = 5,
  direction: QuizDirection = "japanese-to-english"
): DlingoVocabEntry[] {
  const isJapaneseQuestion = direction === "japanese-to-english" ||
                             direction === "kanji-to-reading" ||
                             direction === "kanji-only-to-english"

  // Calculate confusion score for each word
  const scoredWords = allWords
    .filter(w => w.id !== targetWord.id) // Exclude the target word
    .map(word => {
      let visualScore = 0
      let semanticScore = 0

      if (isJapaneseQuestion) {
        // For JP→EN: confuse on Japanese side (similar looking words)
        visualScore = calculateVisualSimilarity(targetWord.japanese, word.japanese)
      } else {
        // For EN→JP: confuse on English side (similar meanings)
        visualScore = calculateVisualSimilarity(targetWord.english, word.english)
      }

      semanticScore = calculateSemanticSimilarity(targetWord, word)

      // Weighted total confusion score
      const totalScore = (visualScore * 0.4) + (semanticScore * 0.6)

      return { word, score: totalScore }
    })
    .filter(item => item.score > 0.1) // Minimum threshold

  // Sort by confusion score (highest = most confusing)
  scoredWords.sort((a, b) => b.score - a.score)

  // Return top N confusables
  return scoredWords.slice(0, count).map(item => item.word)
}

/**
 * Generate a LingoSpecial multiple choice question with bidirectional support
 */
export function generateLingoSpecialQuestion(
  targetWord: DlingoVocabEntry,
  allWords: DlingoVocabEntry[],
  direction: QuizDirection
): QuizQuestion {
  // Find 5 confusable options
  const confusables = findConfusableOptions(targetWord, allWords, 5, direction)

  let question: string
  let correctAnswer: string
  let choices: string[]

  if (direction === "japanese-to-english") {
    // JP → EN
    question = targetWord.japanese
    correctAnswer = targetWord.english
    choices = confusables.map(w => w.english)
  } else {
    // EN → JP
    question = targetWord.english
    correctAnswer = targetWord.japanese
    choices = confusables.map(w => w.japanese)
  }

  // Add correct answer and shuffle
  choices.push(correctAnswer)
  choices = shuffleArray(choices)

  // Create pseudo-vocabulary card (LingoSpecial uses Dlingo data)
  const pseudoCard: any = {
    id: `dlingo_${targetWord.id}`,
    kanji: targetWord.japanese,
    kana: targetWord.japanese, // Dlingo data doesn't separate these
    meaning: targetWord.english,
    partOfSpeech: [targetWord.partOfSpeech],
    jlptLevel: targetWord.jlptLevel,
    tags: targetWord.tags,
    examples: [],
    _dlingoData: targetWord
  }

  return {
    id: `lingospecial_${targetWord.id}_${Date.now()}`,
    card: pseudoCard,
    contentType: "vocabulary",
    mode: "multiple-choice",
    direction,
    question,
    correctAnswer,
    choices,
    hint: undefined // No hints in LingoSpecial!
  }
}

/**
 * Generate a full LingoSpecial quiz session with alternating directions
 */
export function generateLingoSpecialSession(
  dlingoWords: DlingoVocabEntry[],
  questionCount: number = 30
): QuizQuestion[] {
  const questions: QuizQuestion[] = []

  // Shuffle words and take required count
  const shuffledWords = shuffleArray([...dlingoWords]).slice(0, questionCount)

  // Alternate directions for maximum challenge
  for (let i = 0; i < shuffledWords.length; i++) {
    const word = shuffledWords[i]

    // Alternate: even indices = JP→EN, odd indices = EN→JP
    const direction: QuizDirection = i % 2 === 0
      ? "japanese-to-english"
      : "english-to-japanese"

    const question = generateLingoSpecialQuestion(word, dlingoWords, direction)
    questions.push(question)
  }

  return questions
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Filter Dlingo words by difficulty/JLPT level for progressive difficulty
 */
export function filterDlingoWords(
  words: DlingoVocabEntry[],
  options: {
    jlptLevel?: string
    minDifficulty?: number
    maxDifficulty?: number
    partOfSpeech?: string[]
    tags?: string[]
  }
): DlingoVocabEntry[] {
  return words.filter(word => {
    if (options.jlptLevel && word.jlptLevel !== options.jlptLevel) {
      return false
    }

    if (options.minDifficulty !== undefined && word.difficulty < options.minDifficulty) {
      return false
    }

    if (options.maxDifficulty !== undefined && word.difficulty > options.maxDifficulty) {
      return false
    }

    if (options.partOfSpeech && options.partOfSpeech.length > 0) {
      if (!options.partOfSpeech.includes(word.partOfSpeech)) {
        return false
      }
    }

    if (options.tags && options.tags.length > 0) {
      const hasTag = options.tags.some(tag => word.tags.includes(tag))
      if (!hasTag) {
        return false
      }
    }

    return true
  })
}

/**
 * Get statistics about confusability for debugging/tuning
 */
export function analyzeConfusability(
  word: DlingoVocabEntry,
  allWords: DlingoVocabEntry[]
): {
  topConfusables: Array<{ word: DlingoVocabEntry; score: number }>
  averageScore: number
} {
  const confusables = findConfusableOptions(word, allWords, 10, "japanese-to-english")

  const scored = confusables.map(w => ({
    word: w,
    score: calculateVisualSimilarity(word.japanese, w.japanese) * 0.4 +
           calculateSemanticSimilarity(word, w) * 0.6
  }))

  const averageScore = scored.reduce((sum, item) => sum + item.score, 0) / scored.length

  return {
    topConfusables: scored,
    averageScore
  }
}
