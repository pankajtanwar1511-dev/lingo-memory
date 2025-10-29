/**
 * Persona Matcher
 *
 * Utilities for matching vocabulary words to appropriate personas
 * based on context, tags, and word characteristics.
 */

import { VocabularyCard } from "@/types/vocabulary"
import {
  Persona,
  PersonaMatchCriteria,
  PersonaMatchResult,
} from "@/types/persona"
import { activePersonas } from "@/data/personas"

/**
 * Calculate match score between a word and a persona
 * Returns a score from 0 (no match) to 1 (perfect match)
 */
function calculateMatchScore(
  card: VocabularyCard,
  persona: Persona
): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  // Base score for all personas
  score += 0.2

  // Tag matching (most important)
  if (card.tags) {
    const matchingTags = card.tags.filter((tag) =>
      persona.preferredVocabulary.some((pref) =>
        pref.toLowerCase().includes(tag.toLowerCase())
      )
    )

    if (matchingTags.length > 0) {
      const tagScore = Math.min(matchingTags.length * 0.2, 0.4)
      score += tagScore
      reasons.push(
        `Matching tags: ${matchingTags.join(", ")} (${persona.preferredVocabulary.filter((v) => matchingTags.some((t) => v.toLowerCase().includes(t.toLowerCase()))).join(", ")})`
      )
    }
  }

  // Part of speech matching
  if (card.partOfSpeech) {
    const hasVerb = card.partOfSpeech.some((pos) => pos.includes("verb"))
    const hasAdjective = card.partOfSpeech.some((pos) =>
      pos.includes("adjective")
    )

    if (hasVerb && persona.preferredVocabulary.includes("basic verbs")) {
      score += 0.15
      reasons.push("Matches persona's verb usage")
    }

    if (
      hasAdjective &&
      persona.preferredVocabulary.includes("basic adjectives")
    ) {
      score += 0.15
      reasons.push("Matches persona's adjective usage")
    }
  }

  // JLPT level matching
  if (card.jlptLevel === persona.grammarLevel) {
    score += 0.15
    reasons.push(`JLPT ${card.jlptLevel} matches persona level`)
  }

  // Context-specific matching
  const cardMeaning = Array.isArray(card.meaning)
    ? card.meaning.join(" ")
    : card.meaning

  // School-related words → Tomoko
  if (
    persona.id === "persona_tomoko" &&
    (cardMeaning.includes("school") ||
      card.tags?.includes("education") ||
      card.tags?.includes("student"))
  ) {
    score += 0.2
    reasons.push("School/education context matches Tomoko")
  }

  // Work/time-related words → Ken
  if (
    persona.id === "persona_ken" &&
    (card.tags?.includes("time") ||
      card.tags?.includes("work") ||
      cardMeaning.includes("work") ||
      cardMeaning.includes("office"))
  ) {
    score += 0.2
    reasons.push("Work/routine context matches Ken")
  }

  // Social/hobby words → Aya
  if (
    persona.id === "persona_aya" &&
    (card.tags?.includes("hobby") ||
      card.tags?.includes("social") ||
      card.tags?.includes("entertainment") ||
      cardMeaning.includes("fun"))
  ) {
    score += 0.2
    reasons.push("Social/hobby context matches Aya")
  }

  // Common daily words → all personas (slight boost)
  if (card.tags?.includes("common")) {
    score += 0.1
    reasons.push("Common word - suitable for any persona")
  }

  // Cap score at 1.0
  score = Math.min(score, 1.0)

  return { score, reasons }
}

/**
 * Find the best matching persona for a vocabulary card
 */
export function matchPersona(card: VocabularyCard): PersonaMatchResult {
  const matches = activePersonas.map((persona) => {
    const { score, reasons } = calculateMatchScore(card, persona)
    return {
      persona,
      confidence: score,
      reason: reasons.join("; "),
    }
  })

  // Sort by confidence (highest first)
  matches.sort((a, b) => b.confidence - a.confidence)

  // Return best match
  return matches[0]
}

/**
 * Get multiple persona matches (e.g., to generate examples from different perspectives)
 */
export function matchPersonas(
  card: VocabularyCard,
  count: number = 2
): PersonaMatchResult[] {
  const matches = activePersonas.map((persona) => {
    const { score, reasons } = calculateMatchScore(card, persona)
    return {
      persona,
      confidence: score,
      reason: reasons.join("; "),
    }
  })

  // Sort by confidence (highest first)
  matches.sort((a, b) => b.confidence - a.confidence)

  // Return top N matches
  return matches.slice(0, Math.min(count, matches.length))
}

/**
 * Check if a persona is suitable for a given word
 * (minimum confidence threshold)
 */
export function isPersonaSuitable(
  card: VocabularyCard,
  persona: Persona,
  minConfidence: number = 0.4
): boolean {
  const { score } = calculateMatchScore(card, persona)
  return score >= minConfidence
}

/**
 * Get all suitable personas for a word
 */
export function getSuitablePersonas(
  card: VocabularyCard,
  minConfidence: number = 0.4
): PersonaMatchResult[] {
  return activePersonas
    .map((persona) => {
      const { score, reasons } = calculateMatchScore(card, persona)
      return {
        persona,
        confidence: score,
        reason: reasons.join("; "),
      }
    })
    .filter((result) => result.confidence >= minConfidence)
    .sort((a, b) => b.confidence - a.confidence)
}

/**
 * Batch match multiple vocabulary cards to personas
 * Returns a map of card ID to best matching persona
 */
export function batchMatchPersonas(
  cards: VocabularyCard[]
): Map<string, PersonaMatchResult> {
  const matches = new Map<string, PersonaMatchResult>()

  cards.forEach((card) => {
    const match = matchPersona(card)
    matches.set(card.id, match)
  })

  return matches
}

/**
 * Get match statistics for a batch of cards
 */
export function getMatchStatistics(cards: VocabularyCard[]): {
  totalCards: number
  personaDistribution: Record<string, number>
  averageConfidence: number
  lowConfidenceCards: VocabularyCard[]
} {
  const matches = batchMatchPersonas(cards)
  const personaDistribution: Record<string, number> = {}
  let totalConfidence = 0
  const lowConfidenceCards: VocabularyCard[] = []

  cards.forEach((card) => {
    const match = matches.get(card.id)
    if (match) {
      const personaName = match.persona.name
      personaDistribution[personaName] =
        (personaDistribution[personaName] || 0) + 1
      totalConfidence += match.confidence

      if (match.confidence < 0.5) {
        lowConfidenceCards.push(card)
      }
    }
  })

  return {
    totalCards: cards.length,
    personaDistribution,
    averageConfidence: cards.length > 0 ? totalConfidence / cards.length : 0,
    lowConfidenceCards,
  }
}
