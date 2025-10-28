/**
 * Content Statistics Service
 *
 * Provides insights and statistics about the vocabulary database.
 * Used for dashboards, analytics, and content management.
 */

import { db } from '@/lib/db'
import { JLPTLevel, VocabularyCard } from '@/types/vocabulary'

export interface ContentStats {
  total: number
  byLevel: Record<JLPTLevel, number>
  byPartOfSpeech: Record<string, number>
  byTag: Record<string, number>
  withExamples: number
  withAudio: number
  withImages: number
  withKanji: number
  averageExamplesPerCard: number
  lastUpdated: Date
}

export interface LevelStats {
  level: JLPTLevel
  total: number
  verbs: number
  nouns: number
  adjectives: number
  particles: number
  other: number
  withExamples: number
  withAudio: number
  coverage: number // Percentage of expected vocabulary (e.g., N5 = 800 words expected)
}

export interface CategoryStats {
  category: string
  count: number
  percentage: number
  topWords: VocabularyCard[]
}

export class ContentStatsService {
  /**
   * Get overall content statistics
   */
  async getOverallStats(): Promise<ContentStats> {
    const allCards = await db.vocabulary.toArray()

    const stats: ContentStats = {
      total: allCards.length,
      byLevel: {
        N5: 0,
        N4: 0,
        N3: 0,
        N2: 0,
        N1: 0
      },
      byPartOfSpeech: {},
      byTag: {},
      withExamples: 0,
      withAudio: 0,
      withImages: 0,
      withKanji: 0,
      averageExamplesPerCard: 0,
      lastUpdated: new Date()
    }

    let totalExamples = 0

    allCards.forEach(card => {
      // Count by level
      if (card.jlptLevel) {
        stats.byLevel[card.jlptLevel]++
      }

      // Count by part of speech
      if (card.partOfSpeech && card.partOfSpeech.length > 0) {
        card.partOfSpeech.forEach(pos => {
          stats.byPartOfSpeech[pos] = (stats.byPartOfSpeech[pos] || 0) + 1
        })
      }

      // Count by tag
      if (card.tags && card.tags.length > 0) {
        card.tags.forEach(tag => {
          stats.byTag[tag] = (stats.byTag[tag] || 0) + 1
        })
      }

      // Count features
      if (card.examples && card.examples.length > 0) {
        stats.withExamples++
        totalExamples += card.examples.length
      }

      if (card.audioUrl) {
        stats.withAudio++
      }

      if (card.imageUrl) {
        stats.withImages++
      }

      if (card.kanji) {
        stats.withKanji++
      }
    })

    // Calculate average examples per card
    stats.averageExamplesPerCard = allCards.length > 0
      ? Math.round((totalExamples / allCards.length) * 10) / 10
      : 0

    return stats
  }

  /**
   * Get statistics for a specific JLPT level
   */
  async getLevelStats(level: JLPTLevel): Promise<LevelStats> {
    const cards = await db.vocabulary.where('jlptLevel').equals(level).toArray()

    const stats: LevelStats = {
      level,
      total: cards.length,
      verbs: 0,
      nouns: 0,
      adjectives: 0,
      particles: 0,
      other: 0,
      withExamples: 0,
      withAudio: 0,
      coverage: 0
    }

    cards.forEach(card => {
      // Count by part of speech
      const pos = card.partOfSpeech?.[0] || 'other'
      if (pos.includes('verb')) {
        stats.verbs++
      } else if (pos.includes('noun')) {
        stats.nouns++
      } else if (pos.includes('adjective')) {
        stats.adjectives++
      } else if (pos.includes('particle')) {
        stats.particles++
      } else {
        stats.other++
      }

      // Count features
      if (card.examples && card.examples.length > 0) {
        stats.withExamples++
      }

      if (card.audioUrl) {
        stats.withAudio++
      }
    })

    // Calculate coverage based on expected vocabulary counts
    const expectedCounts: Record<JLPTLevel, number> = {
      N5: 800,
      N4: 600,
      N3: 600,
      N2: 1000,
      N1: 2000
    }

    stats.coverage = Math.round((cards.length / expectedCounts[level]) * 100)

    return stats
  }

  /**
   * Get statistics for all JLPT levels
   */
  async getAllLevelStats(): Promise<LevelStats[]> {
    const levels: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1']
    const stats = await Promise.all(levels.map(level => this.getLevelStats(level)))
    return stats
  }

  /**
   * Get tag statistics
   */
  async getTagStats(limit: number = 20): Promise<CategoryStats[]> {
    const allCards = await db.vocabulary.toArray()
    const tagCounts: Record<string, number> = {}

    allCards.forEach(card => {
      if (card.tags && card.tags.length > 0) {
        card.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      }
    })

    const total = allCards.length

    const stats: CategoryStats[] = Object.entries(tagCounts)
      .map(([tag, count]) => ({
        category: tag,
        count,
        percentage: Math.round((count / total) * 100),
        topWords: [] // TODO: Implement if needed
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)

    return stats
  }

  /**
   * Get part of speech statistics
   */
  async getPartOfSpeechStats(): Promise<CategoryStats[]> {
    const allCards = await db.vocabulary.toArray()
    const posCounts: Record<string, number> = {}

    allCards.forEach(card => {
      if (card.partOfSpeech && card.partOfSpeech.length > 0) {
        card.partOfSpeech.forEach(pos => {
          posCounts[pos] = (posCounts[pos] || 0) + 1
        })
      }
    })

    const total = allCards.length

    const stats: CategoryStats[] = Object.entries(posCounts)
      .map(([pos, count]) => ({
        category: pos,
        count,
        percentage: Math.round((count / total) * 100),
        topWords: []
      }))
      .sort((a, b) => b.count - a.count)

    return stats
  }

  /**
   * Get most recent vocabulary cards
   */
  async getRecentCards(limit: number = 10): Promise<VocabularyCard[]> {
    const cards = await db.vocabulary
      .orderBy('createdAt')
      .reverse()
      .limit(limit)
      .toArray()

    return cards
  }

  /**
   * Get random vocabulary cards
   */
  async getRandomCards(count: number = 10, level?: JLPTLevel): Promise<VocabularyCard[]> {
    let cards: VocabularyCard[]

    if (level) {
      cards = await db.vocabulary.where('jlptLevel').equals(level).toArray()
    } else {
      cards = await db.vocabulary.toArray()
    }

    // Fisher-Yates shuffle and take first N cards
    const shuffled = cards.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  /**
   * Get quality score for the vocabulary database
   */
  async getQualityScore(): Promise<{
    score: number
    breakdown: {
      examples: number
      audio: number
      images: number
      kanji: number
      overall: number
    }
  }> {
    const stats = await this.getOverallStats()

    if (stats.total === 0) {
      return {
        score: 0,
        breakdown: {
          examples: 0,
          audio: 0,
          images: 0,
          kanji: 0,
          overall: 0
        }
      }
    }

    const breakdown = {
      examples: Math.round((stats.withExamples / stats.total) * 100),
      audio: Math.round((stats.withAudio / stats.total) * 100),
      images: Math.round((stats.withImages / stats.total) * 100),
      kanji: Math.round((stats.withKanji / stats.total) * 100),
      overall: 0
    }

    // Calculate overall score (weighted average)
    breakdown.overall = Math.round(
      breakdown.examples * 0.4 + // Examples are most important
      breakdown.audio * 0.3 +
      breakdown.kanji * 0.2 +
      breakdown.images * 0.1
    )

    return {
      score: breakdown.overall,
      breakdown
    }
  }

  /**
   * Search vocabulary cards
   */
  async search(query: string, options?: {
    level?: JLPTLevel
    partOfSpeech?: string
    tags?: string[]
    limit?: number
  }): Promise<VocabularyCard[]> {
    let cards = await db.vocabulary.toArray()

    // Filter by level
    if (options?.level) {
      cards = cards.filter(card => card.jlptLevel === options.level)
    }

    // Filter by part of speech
    if (options?.partOfSpeech) {
      cards = cards.filter(card =>
        card.partOfSpeech?.includes(options.partOfSpeech!)
      )
    }

    // Filter by tags
    if (options?.tags && options.tags.length > 0) {
      cards = cards.filter(card =>
        card.tags?.some(tag => options.tags!.includes(tag))
      )
    }

    // Search in kana, kanji, and meaning
    const lowerQuery = query.toLowerCase()
    const results = cards.filter(card => {
      const meanings = Array.isArray(card.meaning)
        ? card.meaning.join(' ')
        : card.meaning

      return (
        card.kana.toLowerCase().includes(lowerQuery) ||
        card.kanji?.toLowerCase().includes(lowerQuery) ||
        meanings.toLowerCase().includes(lowerQuery)
      )
    })

    // Limit results
    if (options?.limit) {
      return results.slice(0, options.limit)
    }

    return results
  }
}

// Create singleton instance
export const contentStatsService = new ContentStatsService()

// Export for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).contentStatsService = contentStatsService
}
