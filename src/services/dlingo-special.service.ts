/**
 * Service for loading and managing Dlingo Special vocabulary
 * Handles data loading, progress tracking, and visual aid mapping
 */

import {
  SpecialVocabularyData,
  SpecialCategory,
  SpecialSubcategory,
  SpecialWord,
  CategoryType,
  VisualAidType,
  CategoryProgress,
  SubcategoryProgress,
} from "@/types/dlingo-special"

let specialData: SpecialVocabularyData | null = null

/**
 * Load special vocabulary data from JSON file
 */
export async function loadSpecialData(): Promise<SpecialVocabularyData> {
  if (specialData) {
    return specialData
  }

  try {
    const response = await fetch('/dlingo/special.json')
    if (!response.ok) {
      throw new Error(`Failed to load special vocabulary: ${response.statusText}`)
    }
    specialData = await response.json()
    if (!specialData) {
      throw new Error('Failed to parse special vocabulary data')
    }
    return specialData
  } catch (error) {
    console.error('Error loading special vocabulary:', error)
    throw error
  }
}

/**
 * Get cached special data (call loadSpecialData first)
 */
export function getSpecialData(): SpecialVocabularyData | null {
  return specialData
}

/**
 * Determine category type from category name
 */
export function getCategoryType(categoryName: string): CategoryType {
  const normalized = categoryName.toLowerCase()

  if (normalized.includes("number")) return "numbers"
  if (normalized.includes("time expression")) return "time-expressions"
  if (normalized.includes("telling time")) return "telling-time"
  if (normalized.includes("days of the week")) return "days-of-week"
  if (normalized.includes("date")) return "date"
  if (normalized.includes("time duration")) return "time-duration"
  if (normalized.includes("period")) return "period"
  if (normalized.includes("counter")) return "counters"

  return "counters" // Default
}

/**
 * Determine which visual aid to use for a category
 */
export function getVisualAidType(categoryType: CategoryType): VisualAidType {
  switch (categoryType) {
    case "telling-time":
    case "time-duration":
      return "clock"
    case "date":
    case "days-of-week":
      return "calendar"
    case "numbers":
      return "number-builder"
    case "counters":
      return "counter-icons"
    case "time-expressions":
    case "period":
      return "timeline"
    default:
      return "none"
  }
}

/**
 * Get all categories
 */
export function getAllCategories(): SpecialCategory[] {
  if (!specialData) return []
  return specialData.vocabularyCategories
}

/**
 * Get a specific category by index
 */
export function getCategory(index: number): SpecialCategory | null {
  if (!specialData || index < 0 || index >= specialData.vocabularyCategories.length) {
    return null
  }
  return specialData.vocabularyCategories[index]
}

/**
 * Get a specific subcategory
 */
export function getSubcategory(
  categoryIndex: number,
  subcategoryIndex: number
): SpecialSubcategory | null {
  const category = getCategory(categoryIndex)
  if (!category || subcategoryIndex < 0 || subcategoryIndex >= category.subcategories.length) {
    return null
  }
  return category.subcategories[subcategoryIndex]
}

/**
 * Get total word count across all categories
 */
export function getTotalWordCount(): number {
  if (!specialData) return 0
  return specialData.summary.totalVocabulary
}

/**
 * Get word count for a specific category
 */
export function getCategoryWordCount(categoryIndex: number): number {
  const category = getCategory(categoryIndex)
  if (!category) return 0

  return category.subcategories.reduce(
    (total, sub) => total + sub.words.length,
    0
  )
}

/**
 * Initialize progress tracking for all categories
 */
export function initializeProgress(): CategoryProgress[] {
  if (!specialData) return []

  return specialData.vocabularyCategories.map((category, catIndex) => {
    const subcategories: SubcategoryProgress[] = category.subcategories.map((sub, subIndex) => ({
      categoryIndex: catIndex,
      subcategoryIndex: subIndex,
      name: sub.subcategory,
      totalWords: sub.words.length,
      masteredWords: 0,
      accuracy: 0,
      lastPracticed: null,
      isUnlocked: catIndex === 0 && subIndex === 0, // First subcategory unlocked
      isMastered: false,
    }))

    return {
      categoryName: category.category,
      categoryIndex: catIndex,
      subcategories,
      overallProgress: 0,
      isMastered: false,
    }
  })
}

/**
 * Get random words from selected categories for drill mode
 */
export function getRandomWordsForDrill(
  categoryIndices: number[],
  subcategoryIndices: number[][],
  count: number
): Array<{ word: SpecialWord; categoryIndex: number; subcategoryIndex: number }> {
  if (!specialData) return []

  const availableWords: Array<{
    word: SpecialWord
    categoryIndex: number
    subcategoryIndex: number
  }> = []

  // Collect all words from selected categories/subcategories
  categoryIndices.forEach((catIndex, i) => {
    const category = getCategory(catIndex)
    if (!category) return

    const selectedSubs = subcategoryIndices[i] || []

    category.subcategories.forEach((sub, subIndex) => {
      // If specific subcategories selected, filter; otherwise include all
      if (selectedSubs.length === 0 || selectedSubs.includes(subIndex)) {
        sub.words.forEach(word => {
          availableWords.push({
            word,
            categoryIndex: catIndex,
            subcategoryIndex: subIndex,
          })
        })
      }
    })
  })

  // Shuffle and take requested count
  const shuffled = availableWords.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

/**
 * Get category statistics
 */
export function getCategoryStats(categoryIndex: number) {
  const category = getCategory(categoryIndex)
  if (!category) return null

  const totalWords = getCategoryWordCount(categoryIndex)
  const subcategoryCount = category.subcategories.length
  const categoryType = getCategoryType(category.category)
  const visualAid = getVisualAidType(categoryType)

  return {
    name: category.category,
    totalWords,
    subcategoryCount,
    categoryType,
    visualAid,
  }
}

/**
 * Extract category number from name (e.g., "1. Numbers" -> 1)
 */
export function extractCategoryNumber(categoryName: string): number {
  const match = categoryName.match(/^(\d+)\./)
  return match ? parseInt(match[1]) : 0
}

/**
 * Check if a word is a question word
 */
export function isQuestionWord(word: SpecialWord): boolean {
  return word.type === "question" || word.english.toLowerCase().startsWith("what") ||
         word.english.toLowerCase().startsWith("how")
}

/**
 * Get visual hint for a word based on its category
 */
export function getWordVisualHint(
  word: SpecialWord,
  categoryType: CategoryType
): string | null {
  // This can be expanded to return emoji hints or descriptions
  switch (categoryType) {
    case "telling-time":
      return "🕐"
    case "date":
    case "days-of-week":
      return "📅"
    case "numbers":
      return "🔢"
    case "counters":
      // Could map specific counters to emojis
      if (word.japanese.includes("人") || word.japanese.includes("にん")) return "👥"
      if (word.japanese.includes("枚") || word.japanese.includes("まい")) return "📄"
      if (word.japanese.includes("台") || word.japanese.includes("だい")) return "🚗"
      if (word.japanese.includes("本") || word.japanese.includes("ほん") || word.japanese.includes("ぽん") || word.japanese.includes("ぼん")) return "📏"
      if (word.japanese.includes("杯") || word.japanese.includes("はい") || word.japanese.includes("ぱい") || word.japanese.includes("ばい")) return "🥤"
      if (word.japanese.includes("匹") || word.japanese.includes("ひき") || word.japanese.includes("ぴき") || word.japanese.includes("びき")) return "🐕"
      return "📊"
    default:
      return null
  }
}
