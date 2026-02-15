/**
 * Smart Card Filtering for Quiz Directions
 *
 * This module provides intelligent filtering of vocabulary and kanji cards
 * based on the selected quiz direction. It ensures that only cards with
 * the required fields for a given direction are included in the quiz.
 *
 * Example: If direction is "kana → kanji", only cards WITH kanji will be shown.
 *          Cards without kanji (kana-only) will be filtered out.
 */

import { VocabularyCard } from "@/types/vocabulary"
import { KanjiCard } from "@/types/kanji"
import { QuizDirection } from "@/types/quiz"

/**
 * Card validation result with details about why a card was filtered
 */
export interface CardValidationResult {
  isValid: boolean
  reason?: string
  missingField?: string
}

/**
 * Validates if a vocabulary card has the required fields for a given direction
 */
export function validateVocabularyCard(
  card: VocabularyCard,
  direction: QuizDirection
): CardValidationResult {
  switch (direction) {
    // KANJI-BASED DIRECTIONS
    case "kanji-only-to-english":
    case "kanji-to-reading":
      // Need kanji to show as question
      if (!card.kanji || card.kanji.trim() === "") {
        return {
          isValid: false,
          reason: "Card has no kanji",
          missingField: "kanji"
        }
      }
      break

    case "reading-to-kanji":
    case "english-to-kanji":
      // Need kanji as the answer
      if (!card.kanji || card.kanji.trim() === "") {
        return {
          isValid: false,
          reason: "Card has no kanji to practice",
          missingField: "kanji"
        }
      }
      break

    // KANA-BASED DIRECTIONS (always valid - kana is required field)
    case "kana-only-to-english":
    case "english-to-kana":
      // Kana is required field in VocabularyCard, so always valid
      break

    // JAPANESE TO ENGLISH (can use kanji OR kana)
    case "japanese-to-english":
      // Valid if has either kanji or kana (kana always exists)
      break

    // ENGLISH TO JAPANESE (can answer with kanji OR kana)
    case "english-to-japanese":
      // Always valid - can answer with kana at minimum
      break

    // KANJI TO MEANING (for kanji content type)
    case "kanji-to-meaning":
    case "meaning-to-kanji":
    case "reading-to-kanji":
      // These are for kanji cards, not vocabulary cards
      // But for vocabulary, we can use them if kanji exists
      if (!card.kanji || card.kanji.trim() === "") {
        return {
          isValid: false,
          reason: "Card has no kanji for this direction",
          missingField: "kanji"
        }
      }
      break

    default:
      // Unknown direction - be permissive
      break
  }

  // Additional validation: Must have meanings
  if (!card.meaning || card.meaning.length === 0) {
    return {
      isValid: false,
      reason: "Card has no meanings",
      missingField: "meaning"
    }
  }

  return { isValid: true }
}

/**
 * Validates if a kanji card has the required fields for a given direction
 */
export function validateKanjiCard(
  card: KanjiCard,
  direction: QuizDirection
): CardValidationResult {
  switch (direction) {
    case "kanji-to-meaning":
      // Need kanji and meanings
      if (!card.meanings || card.meanings.length === 0) {
        return {
          isValid: false,
          reason: "Kanji has no meanings",
          missingField: "meanings"
        }
      }
      break

    case "meaning-to-kanji":
      // Need meanings to show as question
      if (!card.meanings || card.meanings.length === 0) {
        return {
          isValid: false,
          reason: "Kanji has no meanings",
          missingField: "meanings"
        }
      }
      break

    case "kanji-to-reading":
      // Need readings (on or kun)
      const hasReadings =
        (card.onReadings && card.onReadings.length > 0) ||
        (card.kunReadings && card.kunReadings.length > 0)

      if (!hasReadings) {
        return {
          isValid: false,
          reason: "Kanji has no readings",
          missingField: "readings"
        }
      }
      break

    case "reading-to-kanji":
      // Need readings to show as question
      const hasReadingsForQuestion =
        (card.onReadings && card.onReadings.length > 0) ||
        (card.kunReadings && card.kunReadings.length > 0)

      if (!hasReadingsForQuestion) {
        return {
          isValid: false,
          reason: "Kanji has no readings",
          missingField: "readings"
        }
      }
      break

    // Vocabulary-specific directions (not applicable to kanji)
    case "kanji-only-to-english":
    case "kana-only-to-english":
    case "english-to-kanji":
    case "english-to-kana":
    case "japanese-to-english":
    case "english-to-japanese":
      // For kanji cards, treat these as kanji-to-meaning
      if (!card.meanings || card.meanings.length === 0) {
        return {
          isValid: false,
          reason: "Kanji has no meanings",
          missingField: "meanings"
        }
      }
      break

    default:
      // Unknown direction - be permissive
      break
  }

  return { isValid: true }
}

/**
 * Filters an array of cards based on direction requirements
 * Returns only cards that are valid for the given direction
 */
export function filterCardsForDirection(
  cards: (VocabularyCard | KanjiCard)[],
  direction: QuizDirection
): (VocabularyCard | KanjiCard)[] {
  return cards.filter(card => {
    const isVocabulary = "kana" in card
    const validation = isVocabulary
      ? validateVocabularyCard(card as VocabularyCard, direction)
      : validateKanjiCard(card as KanjiCard, direction)

    return validation.isValid
  })
}

/**
 * Gets statistics about how many cards are valid for a given direction
 */
export interface DirectionFilterStats {
  total: number
  valid: number
  filtered: number
  filterReasons: Record<string, number> // e.g., { "no kanji": 5, "no meanings": 2 }
}

export function getDirectionFilterStats(
  cards: (VocabularyCard | KanjiCard)[],
  direction: QuizDirection
): DirectionFilterStats {
  const stats: DirectionFilterStats = {
    total: cards.length,
    valid: 0,
    filtered: 0,
    filterReasons: {}
  }

  cards.forEach(card => {
    const isVocabulary = "kana" in card
    const validation = isVocabulary
      ? validateVocabularyCard(card as VocabularyCard, direction)
      : validateKanjiCard(card as KanjiCard, direction)

    if (validation.isValid) {
      stats.valid++
    } else {
      stats.filtered++
      if (validation.reason) {
        stats.filterReasons[validation.reason] =
          (stats.filterReasons[validation.reason] || 0) + 1
      }
    }
  })

  return stats
}

/**
 * Helper function to check if a card has kanji
 */
export function hasKanji(card: VocabularyCard | KanjiCard): boolean {
  if ("kana" in card) {
    // Vocabulary card
    return !!(card.kanji && card.kanji.trim() !== "")
  } else {
    // Kanji card - always has kanji by definition
    return true
  }
}

/**
 * Helper function to check if a card has audio
 */
export function hasAudio(card: VocabularyCard | KanjiCard): boolean {
  if ("kana" in card) {
    // Vocabulary card
    return !!(card.audio && card.audio.pronunciationUrl)
  } else {
    // Kanji cards don't have audio field in current schema
    return false
  }
}

/**
 * Helper function to check if a card has example sentences
 */
export function hasExamples(card: VocabularyCard | KanjiCard): boolean {
  if ("kana" in card) {
    // Vocabulary card
    return !!(card.examples && card.examples.length > 0)
  } else {
    // Kanji card doesn't have examples field
    return false
  }
}

/**
 * Get user-friendly direction requirements description
 */
export function getDirectionRequirements(direction: QuizDirection): string {
  switch (direction) {
    case "kanji-only-to-english":
    case "kanji-to-reading":
      return "Requires cards with kanji"

    case "reading-to-kanji":
    case "english-to-kanji":
      return "Requires cards with kanji"

    case "kana-only-to-english":
    case "english-to-kana":
      return "All cards supported (kana only)"

    case "kanji-to-meaning":
    case "meaning-to-kanji":
      return "Requires kanji cards with meanings"

    case "reading-to-kanji":
      return "Requires kanji cards with readings"

    default:
      return "All cards supported"
  }
}
