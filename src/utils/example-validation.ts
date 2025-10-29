/**
 * Example Validation Utilities
 *
 * Automated validation for generated example sentences.
 * Checks for token matching, length appropriateness, and basic quality.
 */

import { Example, JLPTLevel, VocabularyCard } from "@/types/vocabulary"
import { ExampleValidation } from "@/types/vocabulary"

/**
 * Maximum character lengths for different JLPT levels
 */
const MAX_LENGTH_BY_LEVEL: Record<JLPTLevel, number> = {
  N5: 30,
  N4: 40,
  N3: 50,
  N2: 60,
  N1: 70,
}

/**
 * Normalize Japanese text for comparison
 * - Removes spaces
 * - Converts full-width to half-width numbers/letters where appropriate
 */
function normalizeJapanese(text: string): string {
  return text
    .replace(/\s+/g, "") // Remove all whitespace
    .replace(/[！？]/g, (match) => (match === "！" ? "!" : "?")) // Normalize punctuation
    .toLowerCase()
}

/**
 * Check if the target word appears in the example sentence
 * Checks both kanji and kana forms
 */
export function validateTokenMatch(
  example: Example,
  card: VocabularyCard
): boolean {
  const normalizedExample = normalizeJapanese(example.japanese)
  const normalizedKana = normalizeJapanese(example.kana)

  // Check kanji form
  if (card.kanji) {
    const normalizedKanji = normalizeJapanese(card.kanji)
    if (normalizedExample.includes(normalizedKanji)) {
      return true
    }
  }

  // Check kana form (from card)
  const normalizedCardKana = normalizeJapanese(card.kana)
  if (
    normalizedExample.includes(normalizedCardKana) ||
    normalizedKana.includes(normalizedCardKana)
  ) {
    return true
  }

  // For verbs and adjectives, check for stem matches
  // (basic heuristic - not perfect but catches most cases)
  if (card.partOfSpeech?.some((pos) => pos.includes("verb"))) {
    // Remove common verb endings: る、ます、た、て、ない
    const cardKanaStem = normalizedCardKana.replace(/[るますたてない]+$/, "")
    if (
      cardKanaStem.length > 1 &&
      (normalizedExample.includes(cardKanaStem) ||
        normalizedKana.includes(cardKanaStem))
    ) {
      return true
    }
  }

  if (card.partOfSpeech?.some((pos) => pos.includes("adjective"))) {
    // Remove common adjective endings: い、かった、くて、くない
    const cardKanaStem = normalizedCardKana.replace(/[いかったくてくない]+$/, "")
    if (
      cardKanaStem.length > 1 &&
      (normalizedExample.includes(cardKanaStem) ||
        normalizedKana.includes(cardKanaStem))
    ) {
      return true
    }
  }

  return false
}

/**
 * Validate kana consistency (basic check)
 * Ensures kana field is present and reasonably matches
 */
export function validateKanaConsistency(example: Example): boolean {
  // Kana field should be present
  if (!example.kana) {
    return false
  }

  // Should not be empty
  if (example.kana.trim().length === 0) {
    return false
  }

  // Should have similar length to japanese (±50%)
  const japaneseLen = example.japanese.length
  const kanaLen = example.kana.length
  const lengthRatio = kanaLen / japaneseLen

  // Kana can be longer (kanji->kana) but shouldn't be too different
  if (lengthRatio < 0.5 || lengthRatio > 2.0) {
    return false
  }

  return true
}

/**
 * Validate length is appropriate for JLPT level
 */
export function validateLength(
  example: Example,
  jlptLevel?: JLPTLevel
): boolean {
  const level = jlptLevel || "N5"
  const maxLength = MAX_LENGTH_BY_LEVEL[level]

  // Count characters excluding spaces
  const charCount = example.japanese.replace(/\s+/g, "").length

  return charCount <= maxLength
}

/**
 * Validate English translation exists and is reasonable
 */
export function validateEnglishTranslation(example: Example): boolean {
  if (!example.english || example.english.trim().length === 0) {
    return false
  }

  // Should have at least 2 words (very basic check)
  const wordCount = example.english.trim().split(/\s+/).length
  if (wordCount < 2) {
    return false
  }

  return true
}

/**
 * Check if English translation contains keywords from meaning
 * (Heuristic for sense matching)
 */
export function validateSenseMatch(
  example: Example,
  card: VocabularyCard
): boolean {
  const meanings = Array.isArray(card.meaning) ? card.meaning : [card.meaning]
  const englishLower = example.english.toLowerCase()

  // Check if any meaning keyword appears in English translation
  for (const meaning of meanings) {
    const meaningWords = meaning.toLowerCase().split(/[\s,;]+/)

    for (const word of meaningWords) {
      // Skip very short words (particles, articles)
      if (word.length <= 2) continue

      // Check for partial match
      if (englishLower.includes(word)) {
        return true
      }
    }
  }

  // If we can't find a match, it might still be okay (indirect translation)
  // So we return true with lower confidence (handled in scoring)
  return false // Return false to flag for review, not reject
}

/**
 * Comprehensive validation of an example
 */
export function validateExample(
  example: Example,
  card: VocabularyCard
): ExampleValidation {
  const issues: string[] = []

  const tokenMatch = validateTokenMatch(example, card)
  if (!tokenMatch) {
    issues.push("Target word not found in example")
  }

  const kanaMatch = validateKanaConsistency(example)
  if (!kanaMatch) {
    issues.push("Kana field missing or inconsistent")
  }

  const lengthOk = validateLength(example, card.jlptLevel)
  if (!lengthOk) {
    issues.push(
      `Example too long for ${card.jlptLevel || "N5"} (>${MAX_LENGTH_BY_LEVEL[card.jlptLevel || "N5"]} chars)`
    )
  }

  const englishOk = validateEnglishTranslation(example)
  if (!englishOk) {
    issues.push("English translation missing or too short")
  }

  const senseMatch = validateSenseMatch(example, card)
  if (!senseMatch) {
    issues.push("English translation may not match word meaning (needs review)")
  }

  // Calculate auto score (0-1)
  const checks = [tokenMatch, kanaMatch, lengthOk, englishOk, senseMatch]
  const passedChecks = checks.filter(Boolean).length
  const autoScore = passedChecks / checks.length

  return {
    tokenMatch,
    kanaMatch,
    lengthOk,
    autoScore,
    validatedAt: new Date().toISOString(),
    issues: issues.length > 0 ? issues : undefined,
  }
}

/**
 * Batch validate multiple examples
 */
export function validateExamples(
  examples: Example[],
  card: VocabularyCard
): ExampleValidation[] {
  return examples.map((example) => validateExample(example, card))
}

/**
 * Check if validation passes minimum quality threshold
 */
export function isValidationPassed(
  validation: ExampleValidation,
  minScore: number = 0.8
): boolean {
  // Must have token match (critical)
  if (!validation.tokenMatch) {
    return false
  }

  // Must have kana match (critical)
  if (!validation.kanaMatch) {
    return false
  }

  // Must have reasonable length (critical)
  if (!validation.lengthOk) {
    return false
  }

  // Check overall score
  if (validation.autoScore !== undefined && validation.autoScore < minScore) {
    return false
  }

  return true
}

/**
 * Get validation summary for a batch of validations
 */
export function getValidationSummary(validations: ExampleValidation[]): {
  total: number
  passed: number
  failed: number
  passRate: number
  averageScore: number
  commonIssues: Record<string, number>
} {
  const total = validations.length
  const passed = validations.filter((v) => isValidationPassed(v)).length
  const failed = total - passed
  const passRate = total > 0 ? passed / total : 0

  const scores = validations
    .map((v) => v.autoScore)
    .filter((s): s is number => s !== undefined)
  const averageScore =
    scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

  // Count common issues
  const commonIssues: Record<string, number> = {}
  validations.forEach((v) => {
    v.issues?.forEach((issue) => {
      commonIssues[issue] = (commonIssues[issue] || 0) + 1
    })
  })

  return {
    total,
    passed,
    failed,
    passRate,
    averageScore,
    commonIssues,
  }
}
