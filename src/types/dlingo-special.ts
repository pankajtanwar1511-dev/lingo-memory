/**
 * TypeScript types for Dlingo Special vocabulary system
 * Structured learning for numbers, time, dates, and counters
 */

export interface SpecialWord {
  japanese: string
  english: string
  type: string // "number", "noun", "counter", "question", etc.
  special?: boolean // Marked as special (irregular, exception, important)
  specialReason?: "multiple-readings" | "irregular" | "question" | "undefined"
}

export interface SpecialSubcategory {
  subcategory: string
  words: SpecialWord[]
}

export interface SpecialCategory {
  category: string
  subcategories: SpecialSubcategory[]
}

export interface SpecialVocabularyData {
  vocabularyCategories: SpecialCategory[]
  summary: {
    totalCategories: number
    totalSubcategories: number
    totalVocabulary: number
    questionWordsIncluded: boolean
  }
}

// Category types for visual components
export type CategoryType =
  | "numbers"
  | "time-expressions"
  | "telling-time"
  | "days-of-week"
  | "date"
  | "time-duration"
  | "period"
  | "counters"

// Visual aid types
export type VisualAidType =
  | "clock"          // For telling time
  | "calendar"       // For dates and days
  | "number-builder" // For number construction
  | "counter-icons"  // For counter illustrations
  | "timeline"       // For time expressions
  | "none"           // No visual aid

// Learning progress tracking
export interface SubcategoryProgress {
  categoryIndex: number
  subcategoryIndex: number
  name: string
  totalWords: number
  masteredWords: number // Words answered correctly 3+ times
  accuracy: number      // Percentage correct
  lastPracticed: Date | null
  isUnlocked: boolean
  isMastered: boolean   // 100% accuracy with 3+ correct attempts
}

export interface CategoryProgress {
  categoryName: string
  categoryIndex: number
  subcategories: SubcategoryProgress[]
  overallProgress: number // 0-100
  isMastered: boolean
}

// Drill mode settings
export interface DrillSettings {
  categories: number[]      // Selected category indices
  subcategories: number[][] // Selected subcategory indices per category
  questionCount: number     // Total questions in drill
  timeLimit: number | null  // Seconds, null = no limit
  direction: "jp-to-en" | "en-to-jp" | "mixed"
  showVisuals: boolean
}

// Drill result
export interface DrillResult {
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  averageTimePerQuestion: number // Seconds
  totalTime: number // Seconds
  accuracy: number // Percentage
  timestamp: Date
}

// Learn mode state
export interface LearnModeState {
  currentCategoryIndex: number
  currentSubcategoryIndex: number
  currentWordIndex: number
  showAnswer: boolean
  masteryLevel: number // 0-3, how many times answered correctly
}
