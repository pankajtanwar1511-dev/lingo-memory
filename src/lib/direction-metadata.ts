import { QuizDirection } from "@/types/quiz"

/**
 * Direction Metadata for Pedagogical Guidance
 *
 * Provides difficulty levels, descriptions, and guidance for each quiz direction
 */

export type DirectionDifficulty = "beginner" | "intermediate" | "advanced"
export type DirectionType = "recognition" | "production"

export interface DirectionMetadata {
  label: string
  difficulty: DirectionDifficulty
  type: DirectionType
  description: string
  shortDescription: string
  difficultyStars: number // 1-3
  suitableFor: string[] // JLPT levels or learner types
  pedagogicalNote?: string
}

/**
 * Comprehensive direction metadata
 *
 * Recognition (easier): See Japanese → answer English
 * Production (harder): See English → produce Japanese
 */
export const directionMetadata: Record<QuizDirection, DirectionMetadata> = {
  // ===== BEGINNER LEVEL (Recognition) =====
  "kanji-only-to-english": {
    label: "Kanji → English",
    difficulty: "beginner",
    type: "recognition",
    description: "See kanji, answer with meaning",
    shortDescription: "Recognize kanji meanings",
    difficultyStars: 1,
    suitableFor: ["N5", "N4", "beginners"],
    pedagogicalNote: "Best starting point for learning vocabulary"
  },

  "kana-only-to-english": {
    label: "Kana → English",
    difficulty: "beginner",
    type: "recognition",
    description: "See hiragana/katakana, answer with meaning",
    shortDescription: "Recognize kana meanings",
    difficultyStars: 1,
    suitableFor: ["N5", "N4", "beginners"],
    pedagogicalNote: "Good for words without kanji or pronunciation practice"
  },

  "japanese-to-english": {
    label: "Japanese → English",
    difficulty: "beginner",
    type: "recognition",
    description: "See Japanese (kanji with kana hint), answer with meaning",
    shortDescription: "Recognize meanings",
    difficultyStars: 1,
    suitableFor: ["N5", "N4", "N3", "all levels"],
    pedagogicalNote: "Shows both kanji and reading for context"
  },

  // ===== INTERMEDIATE LEVEL =====
  "kanji-to-reading": {
    label: "Kanji → Kana",
    difficulty: "intermediate",
    type: "recognition",
    description: "See kanji, answer with hiragana/katakana reading",
    shortDescription: "Practice reading kanji",
    difficultyStars: 2,
    suitableFor: ["N5", "N4", "N3", "intermediate"],
    pedagogicalNote: "Essential for learning proper pronunciation"
  },

  "english-to-kana": {
    label: "English → Kana",
    difficulty: "intermediate",
    type: "production",
    description: "See English meaning, write in hiragana/katakana",
    shortDescription: "Practice pronunciation",
    difficultyStars: 2,
    suitableFor: ["N4", "N3", "intermediate"],
    pedagogicalNote: "Requires active recall and kana writing ability"
  },

  "reading-to-kanji": {
    label: "Kana → Kanji",
    difficulty: "intermediate",
    type: "production",
    description: "See hiragana/katakana, write the kanji form",
    shortDescription: "Match readings to kanji",
    difficultyStars: 2,
    suitableFor: ["N4", "N3", "intermediate"],
    pedagogicalNote: "Helps associate sounds with kanji characters"
  },

  // ===== ADVANCED LEVEL (Production) =====
  "english-to-kanji": {
    label: "English → Kanji",
    difficulty: "advanced",
    type: "production",
    description: "See English meaning, write in kanji",
    shortDescription: "Practice writing kanji",
    difficultyStars: 3,
    suitableFor: ["N3", "N2", "N1", "advanced"],
    pedagogicalNote: "Most challenging - requires kanji recall and writing"
  },

  "english-to-japanese": {
    label: "English → Japanese",
    difficulty: "advanced",
    type: "production",
    description: "See English meaning, write in Japanese (kanji or kana accepted)",
    shortDescription: "Active production",
    difficultyStars: 3,
    suitableFor: ["N3", "N2", "N1", "advanced"],
    pedagogicalNote: "Flexible - accepts both kanji and kana"
  },

  // ===== KANJI-SPECIFIC DIRECTIONS =====
  "kanji-to-meaning": {
    label: "Kanji → Meaning",
    difficulty: "beginner",
    type: "recognition",
    description: "See kanji character, answer with English meaning",
    shortDescription: "Kanji recognition",
    difficultyStars: 1,
    suitableFor: ["N5", "N4", "N3", "all levels"],
    pedagogicalNote: "For individual kanji character study"
  },

  "meaning-to-kanji": {
    label: "Meaning → Kanji",
    difficulty: "advanced",
    type: "production",
    description: "See English meaning, recall the kanji character",
    shortDescription: "Kanji recall",
    difficultyStars: 3,
    suitableFor: ["N3", "N2", "N1", "advanced"],
    pedagogicalNote: "Active kanji character recall"
  },
}

/**
 * Get direction metadata by direction
 */
export function getDirectionMetadata(direction: QuizDirection): DirectionMetadata {
  return directionMetadata[direction]
}

/**
 * Get directions by difficulty level
 */
export function getDirectionsByDifficulty(difficulty: DirectionDifficulty): QuizDirection[] {
  return Object.entries(directionMetadata)
    .filter(([_, meta]) => meta.difficulty === difficulty)
    .map(([dir, _]) => dir as QuizDirection)
}

/**
 * Get directions by type (recognition vs production)
 */
export function getDirectionsByType(type: DirectionType): QuizDirection[] {
  return Object.entries(directionMetadata)
    .filter(([_, meta]) => meta.type === type)
    .map(([dir, _]) => dir as QuizDirection)
}

/**
 * Get difficulty color for UI display
 */
export function getDifficultyColor(difficulty: DirectionDifficulty): string {
  switch (difficulty) {
    case "beginner":
      return "text-green-600"
    case "intermediate":
      return "text-yellow-600"
    case "advanced":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

/**
 * Get difficulty badge text
 */
export function getDifficultyBadge(difficulty: DirectionDifficulty): string {
  switch (difficulty) {
    case "beginner":
      return "⭐"
    case "intermediate":
      return "⭐⭐"
    case "advanced":
      return "⭐⭐⭐"
    default:
      return ""
  }
}
