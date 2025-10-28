import { VocabularyCard } from "./vocabulary"

/**
 * Quiz Types and Interfaces for Day 5
 */

export type QuizMode =
  | "multiple-choice"
  | "typing"
  | "listening"
  | "sentence-completion"
  | "flashcard"

export type QuizDirection =
  | "japanese-to-english"
  | "english-to-japanese"
  | "kanji-to-reading"
  | "reading-to-kanji"

export type QuizDifficulty = "easy" | "medium" | "hard"

export interface QuizSettings {
  mode: QuizMode
  direction: QuizDirection
  difficulty: QuizDifficulty
  questionCount: number
  timeLimit?: number // seconds per question
  showHints: boolean
  playAudio: boolean
  autoAdvance: boolean
  strictTyping: boolean // For typing mode - require exact match
  caseSensitive: boolean // For typing mode
}

export interface QuizQuestion {
  id: string
  card: VocabularyCard
  mode: QuizMode
  direction: QuizDirection
  question: string
  correctAnswer: string | string[] // Can be array for multiple valid answers
  choices?: string[] // For multiple choice
  hint?: string
  audioUrl?: string // For listening mode
}

export interface QuizAnswer {
  questionId: string
  userAnswer: string
  correctAnswer: string | string[]
  isCorrect: boolean
  timeSpent: number // milliseconds
  hintsUsed: number
  attemptCount: number
}

export interface QuizResult {
  sessionId: string
  startedAt: Date
  completedAt: Date
  settings: QuizSettings
  questions: QuizQuestion[]
  answers: QuizAnswer[]
  score: number // Percentage
  accuracy: number // Percentage (excluding skipped)
  totalTime: number // milliseconds
  averageTimePerQuestion: number // milliseconds
  perfectAnswers: number
  correctAnswers: number
  incorrectAnswers: number
  skippedAnswers: number
}

export interface QuizProgress {
  currentQuestionIndex: number
  totalQuestions: number
  answeredCount: number
  correctCount: number
  startTime: Date
  elapsedTime: number // milliseconds
  isPaused: boolean
}

export interface QuizSession {
  id: string
  settings: QuizSettings
  questions: QuizQuestion[]
  answers: QuizAnswer[]
  progress: QuizProgress
  startedAt: Date
  status: "in-progress" | "completed" | "abandoned"
}

/**
 * Quiz difficulty settings
 */
export interface QuizDifficultyConfig {
  easy: {
    questionCount: number
    timeLimit: number | null
    showHints: boolean
    choiceCount: number // For multiple choice
  }
  medium: {
    questionCount: number
    timeLimit: number | null
    showHints: boolean
    choiceCount: number
  }
  hard: {
    questionCount: number
    timeLimit: number
    showHints: boolean
    choiceCount: number
  }
}

export const DEFAULT_QUIZ_DIFFICULTY_CONFIG: QuizDifficultyConfig = {
  easy: {
    questionCount: 10,
    timeLimit: null,
    showHints: true,
    choiceCount: 4
  },
  medium: {
    questionCount: 20,
    timeLimit: 60,
    showHints: true,
    choiceCount: 4
  },
  hard: {
    questionCount: 30,
    timeLimit: 30,
    showHints: false,
    choiceCount: 6
  }
}

/**
 * Quiz statistics for analytics
 */
export interface QuizStatistics {
  totalSessions: number
  totalQuestions: number
  totalCorrect: number
  totalIncorrect: number
  averageScore: number
  averageAccuracy: number
  bestScore: number
  worstScore: number
  totalTimeSpent: number // milliseconds
  averageTimePerQuestion: number
  favoriteMode: QuizMode
  favoriteDirection: QuizDirection
  sessionHistory: QuizResult[]
  streakCurrent: number
  streakBest: number
  lastSessionDate: Date | null
}

/**
 * Typing validation result
 */
export interface TypingValidationResult {
  isCorrect: boolean
  similarity: number // 0-1, how close the answer is
  suggestions: string[]
  errors: TypingError[]
}

export interface TypingError {
  type: "spelling" | "grammar" | "kanji" | "hiragana" | "missing" | "extra"
  position: number
  expected: string
  actual: string
  message: string
}

/**
 * Sentence completion question
 */
export interface SentenceCompletionQuestion extends QuizQuestion {
  sentence: string
  blanks: Array<{
    position: number
    answer: string
    choices?: string[]
  }>
}

/**
 * Audio quiz question
 */
export interface AudioQuizQuestion extends QuizQuestion {
  audioUrl: string
  playCount: number
  maxPlayCount?: number
}
