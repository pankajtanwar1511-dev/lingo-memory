import { QuizMode, QuizDirection, QuizDifficulty, QuizContentType } from "@/types/quiz"

/**
 * Quiz Presets for Quick Start
 *
 * Provides common quiz configurations that users can quickly select
 */

export interface QuizPreset {
  id: string
  name: string
  description: string
  icon: string
  contentType: QuizContentType
  mode: QuizMode
  direction: QuizDirection
  difficulty: QuizDifficulty
  questionCount: number
  category: "recognition" | "production" | "listening" | "comprehensive"
  recommendedFor: string[] // JLPT levels
}

/**
 * Predefined quiz presets
 */
export const quizPresets: QuizPreset[] = [
  // ===== RECOGNITION PRESETS (Beginner-friendly) =====
  {
    id: "practice-meanings",
    name: "Practice Meanings",
    description: "Learn what words mean - see kanji, answer English",
    icon: "🎯",
    contentType: "vocabulary",
    mode: "multiple-choice",
    direction: "kanji-only-to-english",
    difficulty: "easy",
    questionCount: 20,
    category: "recognition",
    recommendedFor: ["N5", "N4", "beginners"]
  },
  {
    id: "practice-readings",
    name: "Practice Readings",
    description: "Learn how to read kanji - see kanji, answer with kana",
    icon: "📖",
    contentType: "vocabulary",
    mode: "multiple-choice",
    direction: "kanji-to-reading",
    difficulty: "easy",
    questionCount: 20,
    category: "recognition",
    recommendedFor: ["N5", "N4", "intermediate"]
  },

  // ===== PRODUCTION PRESETS (More challenging) =====
  {
    id: "practice-writing",
    name: "Practice Writing",
    description: "Practice writing kanji - see English, type kanji",
    icon: "✍️",
    contentType: "vocabulary",
    mode: "typing",
    direction: "english-to-kanji",
    difficulty: "medium",
    questionCount: 15,
    category: "production",
    recommendedFor: ["N3", "N2", "advanced"]
  },
  {
    id: "practice-speaking",
    name: "Practice Speaking",
    description: "Practice pronunciation - see English, type kana",
    icon: "🗣️",
    contentType: "vocabulary",
    mode: "typing",
    direction: "english-to-kana",
    difficulty: "medium",
    questionCount: 15,
    category: "production",
    recommendedFor: ["N4", "N3", "intermediate"]
  },

  // ===== LISTENING PRESETS =====
  {
    id: "listening-practice",
    name: "Listening Practice",
    description: "Train your ear - listen to audio, answer English",
    icon: "🎧",
    contentType: "vocabulary",
    mode: "listening",
    direction: "kanji-only-to-english",
    difficulty: "medium",
    questionCount: 10,
    category: "listening",
    recommendedFor: ["N5", "N4", "N3", "all levels"]
  },

  // ===== COMPREHENSIVE PRESETS =====
  {
    id: "flashcard-review",
    name: "Flashcard Review",
    description: "Quick review with flashcards - kanji to English",
    icon: "🃏",
    contentType: "vocabulary",
    mode: "flashcard",
    direction: "kanji-only-to-english",
    difficulty: "easy",
    questionCount: 30,
    category: "comprehensive",
    recommendedFor: ["all levels"]
  },
  {
    id: "comprehensive-quiz",
    name: "Comprehensive Quiz",
    description: "Test all skills - mixed question types",
    icon: "📝",
    contentType: "vocabulary",
    mode: "multiple-choice",
    direction: "kanji-only-to-english",
    difficulty: "medium",
    questionCount: 25,
    category: "comprehensive",
    recommendedFor: ["N5", "N4", "N3"]
  },

  // ===== KANJI-SPECIFIC PRESETS =====
  {
    id: "kanji-meanings",
    name: "Kanji Meanings",
    description: "Learn individual kanji meanings",
    icon: "㊗️",
    contentType: "kanji",
    mode: "multiple-choice",
    direction: "kanji-to-meaning",
    difficulty: "easy",
    questionCount: 20,
    category: "recognition",
    recommendedFor: ["N5", "N4"]
  },
  {
    id: "kanji-readings",
    name: "Kanji Readings",
    description: "Practice kanji on-yomi and kun-yomi readings",
    icon: "🈯",
    contentType: "kanji",
    mode: "multiple-choice",
    direction: "kanji-to-reading",
    difficulty: "medium",
    questionCount: 15,
    category: "recognition",
    recommendedFor: ["N5", "N4", "N3"]
  },
  {
    id: "stroke-order",
    name: "Stroke Order Practice",
    description: "Learn to write kanji with correct stroke order",
    icon: "✨",
    contentType: "kanji",
    mode: "stroke-order",
    direction: "kanji-to-meaning",
    difficulty: "medium",
    questionCount: 10,
    category: "production",
    recommendedFor: ["N5", "N4"]
  },

  // ===== LINGOSPECIAL - ULTRA HARD MODE =====
  {
    id: "lingo-special",
    name: "LingoSpecial 🔥",
    description: "ULTRA HARD: Confusable options, bidirectional, 6 choices, 20s limit - Expert challenge!",
    icon: "💀",
    contentType: "vocabulary",
    mode: "multiple-choice",
    direction: "japanese-to-english", // Will alternate in generator
    difficulty: "hard",
    questionCount: 30,
    category: "comprehensive",
    recommendedFor: ["N4", "N3", "advanced", "expert"]
  },
]

/**
 * Get preset by ID
 */
export function getPresetById(id: string): QuizPreset | undefined {
  return quizPresets.find(preset => preset.id === id)
}

/**
 * Get presets by category
 */
export function getPresetsByCategory(category: QuizPreset["category"]): QuizPreset[] {
  return quizPresets.filter(preset => preset.category === category)
}

/**
 * Get presets recommended for a JLPT level
 */
export function getPresetsForLevel(jlptLevel: string): QuizPreset[] {
  return quizPresets.filter(preset =>
    preset.recommendedFor.includes(jlptLevel) ||
    preset.recommendedFor.includes("all levels")
  )
}

/**
 * Get beginner-friendly presets (recognition-based)
 */
export function getBeginnerPresets(): QuizPreset[] {
  return quizPresets.filter(preset =>
    preset.category === "recognition" &&
    preset.difficulty === "easy"
  )
}

/**
 * Get advanced presets (production-based)
 */
export function getAdvancedPresets(): QuizPreset[] {
  return quizPresets.filter(preset =>
    preset.category === "production" &&
    (preset.difficulty === "medium" || preset.difficulty === "hard")
  )
}
