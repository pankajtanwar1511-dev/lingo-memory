/**
 * Quality Scorer Service
 *
 * Evaluates vocabulary cards and assigns quality scores (0-100)
 *
 * Scoring Criteria:
 * - Completeness: Has all required fields (30 points)
 * - Example Quality: Has 2-3 relevant examples (30 points)
 * - Audio: Has audio URL (20 points)
 * - Data Consistency: Proper formatting, no empty strings (20 points)
 *
 * Score Ranges:
 * - 90-100: Excellent (production-ready)
 * - 75-89: Good (minor issues)
 * - 60-74: Fair (needs review)
 * - 0-59: Poor (needs fixing)
 */

import { VocabularyCard, JLPTLevel } from '../types/vocabulary'

export interface QualityScore {
  overall: number // 0-100
  breakdown: {
    completeness: number // 0-30
    examples: number // 0-30
    audio: number // 0-20
    consistency: number // 0-20
  }
  issues: QualityIssue[]
  rating: 'excellent' | 'good' | 'fair' | 'poor'
  productionReady: boolean
}

export interface QualityIssue {
  severity: 'critical' | 'warning' | 'info'
  category: 'completeness' | 'examples' | 'audio' | 'consistency'
  message: string
  field?: string
}

export interface QualityScorerOptions {
  requireAudio?: boolean // Default: true
  minExamples?: number // Default: 2
  maxExamples?: number // Default: 3
  requireAllFields?: boolean // Default: true
}

export class QualityScorerService {
  private options: Required<QualityScorerOptions>

  constructor(options: QualityScorerOptions = {}) {
    this.options = {
      requireAudio: options.requireAudio ?? true,
      minExamples: options.minExamples ?? 2,
      maxExamples: options.maxExamples ?? 3,
      requireAllFields: options.requireAllFields ?? true,
    }
  }

  /**
   * Score a single vocabulary card
   */
  scoreCard(card: VocabularyCard): QualityScore {
    const issues: QualityIssue[] = []

    // 1. Completeness (0-30 points)
    const completeness = this.scoreCompleteness(card, issues)

    // 2. Examples (0-30 points)
    const examples = this.scoreExamples(card, issues)

    // 3. Audio (0-20 points)
    const audio = this.scoreAudio(card, issues)

    // 4. Consistency (0-20 points)
    const consistency = this.scoreConsistency(card, issues)

    // Calculate overall score
    const overall = completeness + examples + audio + consistency

    // Determine rating
    let rating: QualityScore['rating']
    if (overall >= 90) rating = 'excellent'
    else if (overall >= 75) rating = 'good'
    else if (overall >= 60) rating = 'fair'
    else rating = 'poor'

    // Production ready if excellent or good with no critical issues
    const hasCriticalIssues = issues.some(i => i.severity === 'critical')
    const productionReady = overall >= 75 && !hasCriticalIssues

    return {
      overall,
      breakdown: {
        completeness,
        examples,
        audio,
        consistency,
      },
      issues,
      rating,
      productionReady,
    }
  }

  /**
   * Score completeness (0-30 points)
   * Checks if card has all required fields
   */
  private scoreCompleteness(card: VocabularyCard, issues: QualityIssue[]): number {
    let score = 0

    // ID (5 points)
    if (card.id && card.id.trim()) {
      score += 5
    } else {
      issues.push({
        severity: 'critical',
        category: 'completeness',
        message: 'Missing or empty ID',
        field: 'id',
      })
    }

    // Kanji or Kana (10 points)
    if ((card.kanji && card.kanji.trim()) || (card.kana && card.kana.trim())) {
      score += 10
    } else {
      issues.push({
        severity: 'critical',
        category: 'completeness',
        message: 'Missing both kanji and kana',
        field: 'kanji/kana',
      })
    }

    // Meaning (10 points)
    const hasMeaning = card.meaning && card.meaning.length > 0
    if (hasMeaning) {
      score += 10
    } else {
      issues.push({
        severity: 'critical',
        category: 'completeness',
        message: 'Missing or empty meaning',
        field: 'meaning',
      })
    }

    // JLPT Level (5 points)
    if (card.jlptLevel && this.isValidJLPTLevel(card.jlptLevel)) {
      score += 5
    } else {
      issues.push({
        severity: 'warning',
        category: 'completeness',
        message: 'Missing or invalid JLPT level',
        field: 'jlptLevel',
      })
    }

    return score
  }

  /**
   * Score examples (0-30 points)
   * Checks quantity and quality of example sentences
   */
  private scoreExamples(card: VocabularyCard, issues: QualityIssue[]): number {
    let score = 0

    if (!card.examples || !Array.isArray(card.examples)) {
      issues.push({
        severity: 'critical',
        category: 'examples',
        message: 'Missing examples array',
        field: 'examples',
      })
      return 0
    }

    const exampleCount = card.examples.length

    // Quantity (15 points)
    if (exampleCount >= this.options.minExamples && exampleCount <= this.options.maxExamples) {
      score += 15
    } else if (exampleCount === 1) {
      score += 8
      issues.push({
        severity: 'warning',
        category: 'examples',
        message: `Only ${exampleCount} example (recommended: ${this.options.minExamples}-${this.options.maxExamples})`,
        field: 'examples',
      })
    } else if (exampleCount === 0) {
      issues.push({
        severity: 'critical',
        category: 'examples',
        message: 'No example sentences',
        field: 'examples',
      })
    } else if (exampleCount > this.options.maxExamples) {
      score += 12
      issues.push({
        severity: 'info',
        category: 'examples',
        message: `${exampleCount} examples (recommended: ${this.options.minExamples}-${this.options.maxExamples})`,
        field: 'examples',
      })
    }

    // Quality (15 points)
    let validExamples = 0
    for (let i = 0; i < card.examples.length; i++) {
      const example = card.examples[i]

      // Check required fields
      const hasJapanese = example.japanese && example.japanese.trim()
      const hasEnglish = example.english && example.english.trim()

      if (hasJapanese && hasEnglish) {
        validExamples++
      } else {
        issues.push({
          severity: 'warning',
          category: 'examples',
          message: `Example ${i + 1} missing ${!hasJapanese ? 'Japanese' : 'English'} text`,
          field: `examples[${i}]`,
        })
      }

      // Check sentence length (should be reasonable)
      if (hasJapanese && example.japanese.length < 3) {
        issues.push({
          severity: 'warning',
          category: 'examples',
          message: `Example ${i + 1} Japanese text too short (${example.japanese.length} chars)`,
          field: `examples[${i}].japanese`,
        })
      }

      if (hasJapanese && example.japanese.length > 100) {
        issues.push({
          severity: 'info',
          category: 'examples',
          message: `Example ${i + 1} Japanese text very long (${example.japanese.length} chars)`,
          field: `examples[${i}].japanese`,
        })
      }
    }

    if (exampleCount > 0) {
      score += Math.round((validExamples / exampleCount) * 15)
    }

    return score
  }

  /**
   * Score audio (0-20 points)
   * Checks if audio URL exists
   */
  private scoreAudio(card: VocabularyCard, issues: QualityIssue[]): number {
    let score = 0

    if (card.audio?.pronunciationUrl && card.audio.pronunciationUrl.trim()) {
      score += 20

      // Check if URL looks valid
      const url = card.audio.pronunciationUrl.trim()
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        issues.push({
          severity: 'warning',
          category: 'audio',
          message: 'Audio URL does not start with http:// or https://',
          field: 'audio.pronunciationUrl',
        })
        score -= 5
      }

      // Check if URL ends with audio extension
      const hasAudioExt = url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.ogg')
      if (!hasAudioExt) {
        issues.push({
          severity: 'info',
          category: 'audio',
          message: 'Audio URL does not end with common audio extension',
          field: 'audio.pronunciationUrl',
        })
      }
    } else {
      if (this.options.requireAudio) {
        issues.push({
          severity: 'critical',
          category: 'audio',
          message: 'Missing audio URL',
          field: 'audio.pronunciationUrl',
        })
      } else {
        issues.push({
          severity: 'warning',
          category: 'audio',
          message: 'Missing audio URL',
          field: 'audio.pronunciationUrl',
        })
        score += 10 // Partial credit if audio is optional
      }
    }

    return score
  }

  /**
   * Score consistency (0-20 points)
   * Checks data formatting and consistency
   */
  private scoreConsistency(card: VocabularyCard, issues: QualityIssue[]): number {
    let score = 20 // Start with full points, deduct for issues

    // Check for empty strings (should be null or omitted)
    if (card.kanji === '') {
      issues.push({
        severity: 'info',
        category: 'consistency',
        message: 'Kanji field is empty string (should be null or omitted)',
        field: 'kanji',
      })
      score -= 2
    }

    if (card.kana === '') {
      issues.push({
        severity: 'info',
        category: 'consistency',
        message: 'Kana field is empty string (should be null or omitted)',
        field: 'kana',
      })
      score -= 2
    }

    // Check for whitespace issues
    if (card.kanji && card.kanji !== card.kanji.trim()) {
      issues.push({
        severity: 'warning',
        category: 'consistency',
        message: 'Kanji has leading/trailing whitespace',
        field: 'kanji',
      })
      score -= 3
    }

    if (card.kana && card.kana !== card.kana.trim()) {
      issues.push({
        severity: 'warning',
        category: 'consistency',
        message: 'Kana has leading/trailing whitespace',
        field: 'kana',
      })
      score -= 3
    }

    // Arrays don't have whitespace issues, so skip whitespace check for meaning

    // Check kanji contains actual kanji (if present)
    if (card.kanji && card.kanji.trim()) {
      const hasKanji = /[\u4e00-\u9faf]/.test(card.kanji)
      if (!hasKanji) {
        issues.push({
          severity: 'info',
          category: 'consistency',
          message: 'Kanji field does not contain kanji characters',
          field: 'kanji',
        })
        score -= 2
      }
    }

    // Check kana contains actual hiragana/katakana (if present)
    if (card.kana && card.kana.trim()) {
      const hasKana = /[\u3040-\u309f\u30a0-\u30ff]/.test(card.kana)
      if (!hasKana) {
        issues.push({
          severity: 'warning',
          category: 'consistency',
          message: 'Kana field does not contain hiragana/katakana',
          field: 'kana',
        })
        score -= 3
      }
    }

    // Ensure score doesn't go below 0
    return Math.max(0, score)
  }

  /**
   * Batch score multiple cards
   */
  scoreBatch(cards: VocabularyCard[]): Map<string, QualityScore> {
    const scores = new Map<string, QualityScore>()

    for (const card of cards) {
      scores.set(card.id, this.scoreCard(card))
    }

    return scores
  }

  /**
   * Generate summary statistics for a batch
   */
  generateBatchStatistics(scores: Map<string, QualityScore>) {
    const total = scores.size
    let excellent = 0
    let good = 0
    let fair = 0
    let poor = 0
    let productionReady = 0
    let totalScore = 0
    const criticalIssues: string[] = []

    for (const [cardId, score] of scores) {
      totalScore += score.overall

      if (score.rating === 'excellent') excellent++
      else if (score.rating === 'good') good++
      else if (score.rating === 'fair') fair++
      else poor++

      if (score.productionReady) productionReady++

      // Collect cards with critical issues
      const hasCritical = score.issues.some(i => i.severity === 'critical')
      if (hasCritical) {
        criticalIssues.push(cardId)
      }
    }

    return {
      total,
      average: total > 0 ? Math.round(totalScore / total) : 0,
      distribution: {
        excellent,
        good,
        fair,
        poor,
      },
      productionReady,
      needsReview: total - productionReady,
      criticalIssues: criticalIssues.length,
      criticalIssueCards: criticalIssues,
    }
  }

  /**
   * Helper: Check if JLPT level is valid
   */
  private isValidJLPTLevel(level: string): boolean {
    return ['N5', 'N4', 'N3', 'N2', 'N1'].includes(level)
  }
}

/**
 * Factory function
 */
export function createQualityScorer(options?: QualityScorerOptions): QualityScorerService {
  return new QualityScorerService(options)
}
