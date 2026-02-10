/**
 * Dlingo Service
 * Loads and manages Dlingo vocabulary data for LingoSpecial quiz
 */

import { DlingoVocabEntry } from "@/lib/lingo-special-generator"

let dlingoData: DlingoVocabEntry[] | null = null
let loadingPromise: Promise<DlingoVocabEntry[]> | null = null

/**
 * Load Dlingo vocabulary data from JSON file
 */
export async function loadDlingoData(): Promise<DlingoVocabEntry[]> {
  // Return cached data if already loaded
  if (dlingoData) {
    return dlingoData
  }

  // Return existing promise if already loading
  if (loadingPromise) {
    return loadingPromise
  }

  // Load data
  loadingPromise = (async () => {
    try {
      const response = await fetch('/seed-data/dlingo_vocab_enhanced.json')

      if (!response.ok) {
        throw new Error(`Failed to load Dlingo data: ${response.statusText}`)
      }

      const data: DlingoVocabEntry[] = await response.json()

      console.log(`✅ Loaded ${data.length} Dlingo vocabulary entries`)

      // Cache the data
      dlingoData = data

      return data
    } catch (error) {
      console.error('❌ Error loading Dlingo data:', error)
      loadingPromise = null
      throw error
    }
  })()

  return loadingPromise
}

/**
 * Get cached Dlingo data (returns null if not loaded yet)
 */
export function getDlingoData(): DlingoVocabEntry[] | null {
  return dlingoData
}

/**
 * Check if Dlingo data is loaded
 */
export function isDlingoDataLoaded(): boolean {
  return dlingoData !== null
}

/**
 * Get Dlingo data statistics
 */
export function getDlingoStats(): {
  totalWords: number
  byJlptLevel: Record<string, number>
  byPartOfSpeech: Record<string, number>
  byDifficulty: Record<number, number>
} | null {
  if (!dlingoData) return null

  const stats = {
    totalWords: dlingoData.length,
    byJlptLevel: {} as Record<string, number>,
    byPartOfSpeech: {} as Record<string, number>,
    byDifficulty: {} as Record<number, number>
  }

  dlingoData.forEach(word => {
    // JLPT level
    stats.byJlptLevel[word.jlptLevel] = (stats.byJlptLevel[word.jlptLevel] || 0) + 1

    // Part of speech
    stats.byPartOfSpeech[word.partOfSpeech] = (stats.byPartOfSpeech[word.partOfSpeech] || 0) + 1

    // Difficulty
    stats.byDifficulty[word.difficulty] = (stats.byDifficulty[word.difficulty] || 0) + 1
  })

  return stats
}

/**
 * Filter Dlingo words by various criteria
 */
export function filterDlingoWords(
  criteria: {
    jlptLevel?: string
    partOfSpeech?: string[]
    tags?: string[]
    minDifficulty?: number
    maxDifficulty?: number
  }
): DlingoVocabEntry[] {
  if (!dlingoData) {
    console.warn('Dlingo data not loaded yet')
    return []
  }

  return dlingoData.filter(word => {
    if (criteria.jlptLevel && word.jlptLevel !== criteria.jlptLevel) {
      return false
    }

    if (criteria.partOfSpeech && criteria.partOfSpeech.length > 0) {
      if (!criteria.partOfSpeech.includes(word.partOfSpeech)) {
        return false
      }
    }

    if (criteria.tags && criteria.tags.length > 0) {
      const hasTag = criteria.tags.some(tag => word.tags.includes(tag))
      if (!hasTag) {
        return false
      }
    }

    if (criteria.minDifficulty !== undefined && word.difficulty < criteria.minDifficulty) {
      return false
    }

    if (criteria.maxDifficulty !== undefined && word.difficulty > criteria.maxDifficulty) {
      return false
    }

    return true
  })
}

/**
 * Get random sample of Dlingo words
 */
export function getRandomDlingoWords(count: number): DlingoVocabEntry[] {
  if (!dlingoData) {
    console.warn('Dlingo data not loaded yet')
    return []
  }

  const shuffled = [...dlingoData].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

/**
 * Preload Dlingo data on app initialization (call this early)
 */
export function preloadDlingoData(): void {
  if (!dlingoData && !loadingPromise) {
    loadDlingoData().catch(error => {
      console.error('Failed to preload Dlingo data:', error)
    })
  }
}
