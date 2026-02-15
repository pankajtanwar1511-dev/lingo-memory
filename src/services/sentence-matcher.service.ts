/**
 * Sentence Matcher Service
 *
 * Finds relevant example sentences from Tatoeba corpus for vocabulary cards
 *
 * Features:
 * - Multiple matching strategies (exact, kanji, kana)
 * - Quality-based ranking
 * - Length and complexity filtering
 * - JLPT level appropriateness
 */

import { VocabularyCard, JLPTLevel, Example } from '@/types/vocabulary'
import {
  TatoebaCorpusIndex,
  TatoebaSentencePair,
  SentenceMatch,
  SentenceMatchResult,
  SentenceQuality,
} from '@/types/tatoeba'

export interface SentenceMatcherOptions {
  maxResults?: number // Maximum sentences to return (default: 3)
  minScore?: number // Minimum quality score (default: 60)
  maxLength?: number // Maximum sentence length in characters (default: 25)
  minLength?: number // Minimum sentence length in characters (default: 5)
  jlptLevel?: JLPTLevel // Filter for JLPT level appropriateness
  requireTranslation?: boolean // Require English translation (default: true)
  preferShorter?: boolean // Prefer shorter sentences (default: true)
}

export class SentenceMatcherService {
  private corpusIndex: TatoebaCorpusIndex | null = null

  constructor() {}

  /**
   * Load corpus index
   */
  loadCorpusIndex(index: TatoebaCorpusIndex): void {
    this.corpusIndex = index
  }

  /**
   * Check if corpus is loaded
   */
  isLoaded(): boolean {
    return this.corpusIndex !== null
  }

  /**
   * Find sentences for a vocabulary card
   */
  findSentences(
    card: VocabularyCard,
    options: SentenceMatcherOptions = {}
  ): SentenceMatchResult {
    if (!this.corpusIndex) {
      throw new Error('Corpus index not loaded')
    }

    const {
      maxResults = 3,
      minScore = 60,
      maxLength = 25,
      minLength = 5,
      requireTranslation = true,
      preferShorter = true,
    } = options

    const word = card.kanji || card.kana
    const matches: SentenceMatch[] = []

    // Strategy 1: Exact kanji match
    if (card.kanji) {
      const exactMatches = this.findByWord(card.kanji, 'exact', card.kanji)
      matches.push(...exactMatches)
    }

    // Strategy 2: Kana match
    const kanaMatches = this.findByWord(card.kana, 'kana', card.kana)
    matches.push(...kanaMatches)

    // Strategy 3: Try partial kanji match (if word is long)
    if (card.kanji && card.kanji.length > 2) {
      for (let len = 2; len <= card.kanji.length - 1; len++) {
        const partial = card.kanji.slice(0, len)
        const partialMatches = this.findByWord(partial, 'kanji', card.kanji)
        matches.push(...partialMatches)
      }
    }

    // Filter by quality
    const qualityMatches = matches.filter(match => {
      const quality = this.assessSentenceQuality(match.sentence, card.jlptLevel)

      // Apply filters
      if (quality.score < minScore) return false
      if (quality.length > maxLength) return false
      if (quality.length < minLength) return false
      if (requireTranslation && !quality.hasTranslation) return false

      // Update match score with quality
      match.score = quality.score

      return true
    })

    // Remove duplicates (same Japanese sentence)
    const uniqueMatches = this.deduplicateMatches(qualityMatches)

    // Sort by score (descending)
    uniqueMatches.sort((a, b) => {
      // First by score
      if (a.score !== b.score) {
        return b.score - a.score
      }

      // Then by length (prefer shorter if enabled)
      if (preferShorter) {
        return a.sentence.japanese.text.length - b.sentence.japanese.text.length
      }

      return 0
    })

    // Take top matches
    const topMatches = uniqueMatches.slice(0, maxResults)

    return {
      cardId: card.id,
      word,
      matches: topMatches,
      totalFound: uniqueMatches.length,
      topMatches: topMatches.map(m => m.sentence),
    }
  }

  /**
   * Find sentences containing a specific word
   */
  private findByWord(
    word: string,
    matchType: 'exact' | 'kanji' | 'kana',
    originalWord: string
  ): SentenceMatch[] {
    if (!this.corpusIndex) return []

    const sentenceIds = this.corpusIndex.wordIndex.get(word) || []
    const matches: SentenceMatch[] = []

    for (const sentenceId of sentenceIds) {
      const jpnSentence = this.corpusIndex.sentences.get(sentenceId)
      if (!jpnSentence || jpnSentence.lang !== 'jpn') continue

      // Get translation
      const translationIds = this.corpusIndex.translations.get(sentenceId)
      if (!translationIds || translationIds.length === 0) continue

      const engSentence = this.corpusIndex.sentences.get(translationIds[0])
      if (!engSentence) continue

      matches.push({
        sentence: {
          japanese: jpnSentence,
          english: engSentence,
        },
        score: 0, // Will be calculated later
        matchType,
        matchedWord: originalWord,
      })
    }

    return matches
  }

  /**
   * Assess sentence quality for learning
   */
  private assessSentenceQuality(
    sentence: TatoebaSentencePair,
    jlptLevel?: JLPTLevel
  ): SentenceQuality {
    const jpnText = sentence.japanese.text
    const length = jpnText.length

    let score = 100
    let complexity: 'beginner' | 'intermediate' | 'advanced' = 'beginner'

    // Length scoring (prefer 8-20 characters)
    if (length < 5) {
      score -= 30 // Too short
    } else if (length <= 12) {
      score += 0 // Ideal
    } else if (length <= 20) {
      score -= 10 // Good
    } else if (length <= 30) {
      score -= 20 // Acceptable
      complexity = 'intermediate'
    } else {
      score -= 40 // Too long
      complexity = 'advanced'
    }

    // Check for difficult grammar patterns
    const hasDifficultGrammar = this.hasDifficultGrammar(jpnText, jlptLevel)
    if (hasDifficultGrammar) {
      score -= 20
      complexity = 'advanced'
    }

    // Check for too many kanji (if N5/N4)
    if (jlptLevel === 'N5' || jlptLevel === 'N4') {
      const kanjiCount = (jpnText.match(/[\u4e00-\u9faf]/g) || []).length
      if (kanjiCount > 3) {
        score -= 15
        complexity = 'intermediate'
      }
    }

    // Check translation quality (heuristics)
    const engText = sentence.english.text
    const hasTranslation = !!(engText && engText.length > 0)

    if (!hasTranslation) {
      score -= 50
    } else if (engText.length < 3) {
      score -= 20
    }

    // Natural Japanese heuristics
    const isNatural = Boolean(this.isNaturalJapanese(jpnText))
    if (!isNatural) {
      score -= 15
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      length,
      complexity,
      hasTranslation,
      isNatural,
      hasDifficultGrammar,
    }
  }

  /**
   * Check for difficult grammar patterns
   */
  private hasDifficultGrammar(text: string, jlptLevel?: JLPTLevel): boolean {
    // N5/N4 should avoid these patterns
    if (jlptLevel === 'N5' || jlptLevel === 'N4') {
      const difficultPatterns = [
        'られる', // Passive
        'させる', // Causative
        'ばかり', // Advanced particle
        'ものの', // Advanced conjunction
        'にもかかわらず', // Despite
        'わけではない', // Not necessarily
        'というより', // Rather than
        'ならば', // Conditional (formal)
      ]

      return difficultPatterns.some(pattern => text.includes(pattern))
    }

    return false
  }

  /**
   * Check if sentence is natural Japanese (heuristics)
   */
  private isNaturalJapanese(text: string): boolean {
    // Avoid sentences that are just single words or very short
    if (text.length < 3) return false

    // Avoid sentences with too many special characters
    const specialCharCount = (text.match(/[(){}[\]<>]/g) || []).length
    if (specialCharCount > 2) return false

    // Avoid sentences with URLs or email addresses
    if (text.match(/https?:\/\/|@/)) return false

    // Avoid sentences with too many numbers
    const numberCount = (text.match(/[0-9]/g) || []).length
    if (numberCount > 5) return false

    return true
  }

  /**
   * Remove duplicate sentences
   */
  private deduplicateMatches(matches: SentenceMatch[]): SentenceMatch[] {
    const seen = new Set<string>()
    const unique: SentenceMatch[] = []

    for (const match of matches) {
      const key = match.sentence.japanese.text
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(match)
      }
    }

    return unique
  }

  /**
   * Convert sentence matches to Example objects for VocabularyCard
   */
  convertToExamples(matches: SentenceMatch[]): Example[] {
    return matches.map(match => ({
      japanese: match.sentence.japanese.text,
      kana: match.sentence.japanese.text, // Tatoeba doesn't provide separate kana
      english: match.sentence.english.text,
      source: {
        type: 'tatoeba' as const,
        id: match.sentence.japanese.id,
      },
      license: {
        text: 'CC BY 2.0 FR',
        url: 'https://creativecommons.org/licenses/by/2.0/fr/'
      }
    }))
  }

  /**
   * Enrich a single vocabulary card with example sentences
   */
  enrichCard(card: VocabularyCard, options?: SentenceMatcherOptions): VocabularyCard {
    const result = this.findSentences(card, options)

    return {
      ...card,
      examples: this.convertToExamples(result.matches),
    }
  }

  /**
   * Enrich multiple vocabulary cards (batch processing)
   */
  enrichCards(
    cards: VocabularyCard[],
    options?: SentenceMatcherOptions,
    onProgress?: (current: number, total: number) => void
  ): VocabularyCard[] {
    const enrichedCards: VocabularyCard[] = []

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]
      const enriched = this.enrichCard(card, options)
      enrichedCards.push(enriched)

      if (onProgress) {
        onProgress(i + 1, cards.length)
      }
    }

    return enrichedCards
  }

  /**
   * Get statistics for sentence matching
   */
  getMatchingStats(cards: VocabularyCard[]): {
    totalCards: number
    cardsWithExamples: number
    cardsWithoutExamples: number
    totalExamples: number
    averageExamplesPerCard: number
    exampleLengthDistribution: Record<string, number>
  } {
    let totalExamples = 0
    let cardsWithExamples = 0
    const lengthDistribution: Record<string, number> = {
      'short (< 10)': 0,
      'medium (10-20)': 0,
      'long (20-30)': 0,
      'very long (> 30)': 0,
    }

    for (const card of cards) {
      if (card.examples && card.examples.length > 0) {
        cardsWithExamples++
        totalExamples += card.examples.length

        // Count example lengths
        for (const example of card.examples) {
          const length = example.japanese.length
          if (length < 10) {
            lengthDistribution['short (< 10)']++
          } else if (length <= 20) {
            lengthDistribution['medium (10-20)']++
          } else if (length <= 30) {
            lengthDistribution['long (20-30)']++
          } else {
            lengthDistribution['very long (> 30)']++
          }
        }
      }
    }

    return {
      totalCards: cards.length,
      cardsWithExamples,
      cardsWithoutExamples: cards.length - cardsWithExamples,
      totalExamples,
      averageExamplesPerCard: cards.length > 0 ? totalExamples / cards.length : 0,
      exampleLengthDistribution: lengthDistribution,
    }
  }
}

/**
 * Create sentence matcher service
 */
export function createSentenceMatcher(): SentenceMatcherService {
  return new SentenceMatcherService()
}
