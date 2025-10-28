/**
 * Batch Import Service
 *
 * High-performance batch processing for importing vocabulary from JMdict
 * Features:
 * - JLPT level filtering
 * - Frequency-based prioritization
 * - Deduplication
 * - Batch processing (100+ cards/hour)
 * - Quality validation
 * - Progress tracking
 */

import { VocabularyCard, JLPTLevel } from "@/types/vocabulary"
import { parseJMdictEntry } from "@/lib/jmdict-parser"
import { VocabularyCardSchema } from "@/schemas/vocabulary.schema"
import { z } from "zod"

// JMdict entry interface (from parser)
interface JMdictEntry {
  id: string | number
  kanji?: Array<{ text: string; tags?: string[]; priority?: string[] }>
  readings: Array<{ text: string; tags?: string[]; priority?: string[]; nokanji?: boolean }>
  senses: Array<{
    gloss: Array<{ text: string; lang?: string }>
    partOfSpeech?: string[]
    field?: string[]
    misc?: string[]
  }>
}

// Frequency data structure
interface FrequencyData {
  [word: string]: number // word -> frequency rank (lower = more common)
}

// Import options
export interface BatchImportOptions {
  jlptLevel?: JLPTLevel
  maxCards?: number
  minFrequency?: number // Minimum frequency rank (e.g., top 1000)
  excludeIds?: string[]
  includeOnlyTags?: string[]
  excludeTags?: string[]
  sortByFrequency?: boolean
}

// Import result
export interface BatchImportResult {
  success: boolean
  cardsImported: number
  cardsSkipped: number
  errors: Array<{ cardId: string; error: string }>
  cards: VocabularyCard[]
  statistics: {
    byPartOfSpeech: Record<string, number>
    withKanji: number
    averageFrequencyRank?: number
  }
}

/**
 * Batch Import Service
 */
export class BatchImportService {
  private frequencyData: FrequencyData = {}

  constructor() {
    // Frequency data will be loaded from file or API
  }

  /**
   * Load frequency data from JSON file
   * Format: { "word": rank, ... }
   * Sources: BCCWJ, Leeds Corpus, or similar
   */
  async loadFrequencyData(frequencyData: FrequencyData): Promise<void> {
    this.frequencyData = frequencyData
  }

  /**
   * Get frequency rank for a word (lower = more common)
   * Returns 999999 if not found (treat as very uncommon)
   */
  private getFrequencyRank(card: VocabularyCard): number {
    // Try kanji first, then kana
    const word = card.kanji || card.kana
    return this.frequencyData[word] || 999999
  }

  /**
   * Check if entry has JLPT tag
   */
  private hasJLPTLevel(entry: JMdictEntry, level: JLPTLevel): boolean {
    const allTags: string[] = []

    // Collect all tags from entry
    entry.kanji?.forEach(k => k.tags?.forEach(t => allTags.push(t)))
    entry.readings?.forEach(r => r.tags?.forEach(t => allTags.push(t)))
    entry.senses?.forEach(s => {
      s.field?.forEach(f => allTags.push(f))
      s.misc?.forEach(m => allTags.push(m))
    })

    // Check for JLPT level tags
    const levelPattern = new RegExp(`jlpt[-_]?${level.toLowerCase()}|^${level.toLowerCase()}$`, 'i')
    return allTags.some(tag => levelPattern.test(tag))
  }

  /**
   * Filter JMdict entries by JLPT level
   */
  private filterByJLPTLevel(
    entries: JMdictEntry[],
    level: JLPTLevel
  ): JMdictEntry[] {
    return entries.filter(entry => this.hasJLPTLevel(entry, level))
  }

  /**
   * Filter by tags
   */
  private filterByTags(
    cards: VocabularyCard[],
    includeOnlyTags?: string[],
    excludeTags?: string[]
  ): VocabularyCard[] {
    let filtered = cards

    if (includeOnlyTags && includeOnlyTags.length > 0) {
      filtered = filtered.filter(card =>
        card.tags?.some(tag =>
          includeOnlyTags.some(includeTag =>
            tag.toLowerCase().includes(includeTag.toLowerCase())
          )
        )
      )
    }

    if (excludeTags && excludeTags.length > 0) {
      filtered = filtered.filter(card =>
        !card.tags?.some(tag =>
          excludeTags.some(excludeTag =>
            tag.toLowerCase().includes(excludeTag.toLowerCase())
          )
        )
      )
    }

    return filtered
  }

  /**
   * Remove duplicate cards (by kanji+kana combination)
   */
  private deduplicateCards(cards: VocabularyCard[]): VocabularyCard[] {
    const seen = new Set<string>()
    const deduplicated: VocabularyCard[] = []

    for (const card of cards) {
      const key = `${card.kanji || ''}_${card.kana}`
      if (!seen.has(key)) {
        seen.add(key)
        deduplicated.push(card)
      }
    }

    return deduplicated
  }

  /**
   * Sort cards by frequency (most common first)
   */
  private sortByFrequency(cards: VocabularyCard[]): VocabularyCard[] {
    return cards.sort((a, b) => {
      const rankA = this.getFrequencyRank(a)
      const rankB = this.getFrequencyRank(b)
      return rankA - rankB
    })
  }

  /**
   * Validate card against schema
   */
  private validateCard(card: VocabularyCard): { valid: boolean; error?: string } {
    try {
      VocabularyCardSchema.parse(card)
      return { valid: true }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          error: error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ')
        }
      }
      return { valid: false, error: 'Unknown validation error' }
    }
  }

  /**
   * Calculate import statistics
   */
  private calculateStatistics(cards: VocabularyCard[]): BatchImportResult['statistics'] {
    const stats: BatchImportResult['statistics'] = {
      byPartOfSpeech: {},
      withKanji: 0,
    }

    let totalFrequency = 0
    let countWithFrequency = 0

    for (const card of cards) {
      // Count by part of speech
      if (card.partOfSpeech) {
        for (const pos of card.partOfSpeech) {
          stats.byPartOfSpeech[pos] = (stats.byPartOfSpeech[pos] || 0) + 1
        }
      }

      // Count with kanji
      if (card.kanji) {
        stats.withKanji++
      }

      // Calculate average frequency
      const rank = this.getFrequencyRank(card)
      if (rank < 999999) {
        totalFrequency += rank
        countWithFrequency++
      }
    }

    if (countWithFrequency > 0) {
      stats.averageFrequencyRank = Math.round(totalFrequency / countWithFrequency)
    }

    return stats
  }

  /**
   * Import cards from JMdict entries
   *
   * @param entries - JMdict entries to process
   * @param options - Import options
   * @returns Import result with processed cards
   */
  async importCards(
    entries: JMdictEntry[],
    options: BatchImportOptions = {}
  ): Promise<BatchImportResult> {
    const result: BatchImportResult = {
      success: true,
      cardsImported: 0,
      cardsSkipped: 0,
      errors: [],
      cards: [],
      statistics: {
        byPartOfSpeech: {},
        withKanji: 0,
      }
    }

    try {
      let processedEntries = entries

      // Step 1: Filter by JLPT level
      if (options.jlptLevel) {
        console.log(`Filtering for JLPT ${options.jlptLevel}...`)
        processedEntries = this.filterByJLPTLevel(processedEntries, options.jlptLevel)
        console.log(`Found ${processedEntries.length} ${options.jlptLevel} entries`)
      }

      // Step 2: Parse entries to vocabulary cards
      console.log(`Parsing ${processedEntries.length} entries...`)
      let cards = processedEntries.map(entry => parseJMdictEntry(entry))

      // Step 3: Deduplicate
      const beforeDedup = cards.length
      cards = this.deduplicateCards(cards)
      const duplicatesRemoved = beforeDedup - cards.length
      if (duplicatesRemoved > 0) {
        console.log(`Removed ${duplicatesRemoved} duplicates`)
      }

      // Step 4: Filter by tags
      if (options.includeOnlyTags || options.excludeTags) {
        cards = this.filterByTags(cards, options.includeOnlyTags, options.excludeTags)
        console.log(`After tag filtering: ${cards.length} cards`)
      }

      // Step 5: Exclude specific IDs
      if (options.excludeIds && options.excludeIds.length > 0) {
        const beforeExclude = cards.length
        cards = cards.filter(card => !options.excludeIds!.includes(card.id))
        const excluded = beforeExclude - cards.length
        if (excluded > 0) {
          console.log(`Excluded ${excluded} cards by ID`)
        }
      }

      // Step 6: Sort by frequency
      if (options.sortByFrequency && Object.keys(this.frequencyData).length > 0) {
        console.log(`Sorting by frequency...`)
        cards = this.sortByFrequency(cards)
      }

      // Step 7: Apply max cards limit
      if (options.maxCards && cards.length > options.maxCards) {
        console.log(`Limiting to top ${options.maxCards} cards`)
        cards = cards.slice(0, options.maxCards)
      }

      // Step 8: Filter by minimum frequency
      if (options.minFrequency && Object.keys(this.frequencyData).length > 0) {
        const beforeFilter = cards.length
        cards = cards.filter(card => this.getFrequencyRank(card) <= options.minFrequency!)
        const filtered = beforeFilter - cards.length
        if (filtered > 0) {
          console.log(`Filtered ${filtered} cards below frequency threshold`)
        }
      }

      // Step 9: Validate cards
      console.log(`Validating ${cards.length} cards...`)
      const validatedCards: VocabularyCard[] = []

      for (const card of cards) {
        const validation = this.validateCard(card)

        if (validation.valid) {
          validatedCards.push(card)
          result.cardsImported++
        } else {
          result.cardsSkipped++
          result.errors.push({
            cardId: card.id,
            error: validation.error || 'Validation failed'
          })
        }
      }

      // Step 10: Calculate statistics
      result.cards = validatedCards
      result.statistics = this.calculateStatistics(validatedCards)

      console.log(`\n✅ Import complete:`)
      console.log(`   Imported: ${result.cardsImported}`)
      console.log(`   Skipped: ${result.cardsSkipped}`)
      console.log(`   Errors: ${result.errors.length}`)

      return result

    } catch (error) {
      console.error('Import failed:', error)
      return {
        ...result,
        success: false,
        errors: [...result.errors, {
          cardId: 'BATCH',
          error: error instanceof Error ? error.message : 'Unknown error'
        }]
      }
    }
  }

  /**
   * Export cards to JSON file format
   */
  exportToJSON(
    cards: VocabularyCard[],
    metadata?: {
      jlptLevel?: JLPTLevel
      source?: string
      generatedAt?: Date
    }
  ): string {
    const exportData = {
      metadata: {
        source: metadata?.source || 'JMdict',
        jlptLevel: metadata?.jlptLevel,
        generatedAt: metadata?.generatedAt || new Date(),
        totalCards: cards.length,
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/'
      },
      cards
    }

    return JSON.stringify(exportData, null, 2)
  }

  /**
   * Generate import summary report
   */
  generateReport(result: BatchImportResult): string {
    const report: string[] = []

    report.push('='.repeat(60))
    report.push('BATCH IMPORT REPORT')
    report.push('='.repeat(60))
    report.push('')

    report.push(`Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`)
    report.push(`Cards Imported: ${result.cardsImported}`)
    report.push(`Cards Skipped: ${result.cardsSkipped}`)
    report.push(`Errors: ${result.errors.length}`)
    report.push('')

    if (result.statistics) {
      report.push('STATISTICS:')
      report.push(`  Cards with kanji: ${result.statistics.withKanji}`)
      if (result.statistics.averageFrequencyRank) {
        report.push(`  Average frequency rank: ${result.statistics.averageFrequencyRank}`)
      }
      report.push('')

      report.push('  Part of Speech breakdown:')
      Object.entries(result.statistics.byPartOfSpeech)
        .sort((a, b) => b[1] - a[1])
        .forEach(([pos, count]) => {
          report.push(`    ${pos}: ${count}`)
        })
      report.push('')
    }

    if (result.errors.length > 0) {
      report.push('ERRORS:')
      result.errors.slice(0, 10).forEach(error => {
        report.push(`  ${error.cardId}: ${error.error}`)
      })
      if (result.errors.length > 10) {
        report.push(`  ... and ${result.errors.length - 10} more errors`)
      }
      report.push('')
    }

    report.push('='.repeat(60))

    return report.join('\n')
  }
}

/**
 * Create and configure batch import service
 */
export function createBatchImportService(): BatchImportService {
  return new BatchImportService()
}
