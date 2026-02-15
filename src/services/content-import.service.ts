/**
 * Content Import Service
 *
 * Handles importing, validating, and managing vocabulary content.
 * Supports JSON and CSV formats with comprehensive validation.
 */

import Papa from 'papaparse'
import { db } from '@/lib/db'
import { VocabularyCard, JLPTLevel } from '@/types/vocabulary'
import {
  validateVocabularyCards,
  validateImportFile,
  ValidationResult,
  VocabularyCardInput
} from '@/schemas/vocabulary.schema'

export interface ImportResult {
  success: boolean
  imported: number
  skipped: number
  errors: string[]
  validation: ValidationResult
}

export interface ImportOptions {
  overwrite?: boolean // Overwrite existing cards with same ID
  skipInvalid?: boolean // Skip invalid cards instead of failing
  validateOnly?: boolean // Only validate, don't import
}

export class ContentImportService {
  /**
   * Import vocabulary from JSON file
   */
  async importFromJSON(
    file: File,
    options: ImportOptions = {}
  ): Promise<ImportResult> {
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Validate the import file structure
      const validation = validateImportFile(data)

      if (options.validateOnly) {
        return {
          success: validation.valid,
          imported: 0,
          skipped: 0,
          errors: validation.errors.map(e => `${e.field}: ${e.message}`),
          validation
        }
      }

      if (!validation.valid && !options.skipInvalid) {
        return {
          success: false,
          imported: 0,
          skipped: 0,
          errors: validation.errors.map(e => `${e.field}: ${e.message}`),
          validation
        }
      }

      // Import valid cards
      const cards = data.vocabulary as VocabularyCard[]
      return await this.bulkInsert(cards, options)
    } catch (error) {
      return {
        success: false,
        imported: 0,
        skipped: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        validation: {
          valid: false,
          errors: [{ field: 'file', message: 'Invalid JSON file' }],
          warnings: [],
          stats: { total: 0, valid: 0, invalid: 0, duplicateIds: [] }
        }
      }
    }
  }

  /**
   * Import vocabulary from CSV file
   */
  async importFromCSV(
    file: File,
    options: ImportOptions = {}
  ): Promise<ImportResult> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            // Transform CSV rows to vocabulary cards
            const cards = results.data.map((row: any, index: number) =>
              this.transformCSVRow(row, index)
            ).filter(card => card !== null)

            // Validate cards
            const validation = validateVocabularyCards(cards)

            if (options.validateOnly) {
              resolve({
                success: validation.valid,
                imported: 0,
                skipped: 0,
                errors: validation.errors.map(e => `${e.field}: ${e.message}`),
                validation
              })
              return
            }

            if (!validation.valid && !options.skipInvalid) {
              resolve({
                success: false,
                imported: 0,
                skipped: 0,
                errors: validation.errors.map(e => `${e.field}: ${e.message}`),
                validation
              })
              return
            }

            // Import valid cards
            const result = await this.bulkInsert(cards as VocabularyCard[], options)
            resolve(result)
          } catch (error) {
            resolve({
              success: false,
              imported: 0,
              skipped: 0,
              errors: [error instanceof Error ? error.message : 'CSV processing error'],
              validation: {
                valid: false,
                errors: [{ field: 'file', message: 'Invalid CSV file' }],
                warnings: [],
                stats: { total: 0, valid: 0, invalid: 0, duplicateIds: [] }
              }
            })
          }
        },
        error: (error) => {
          resolve({
            success: false,
            imported: 0,
            skipped: 0,
            errors: [error.message],
            validation: {
              valid: false,
              errors: [{ field: 'file', message: 'CSV parsing error' }],
              warnings: [],
              stats: { total: 0, valid: 0, invalid: 0, duplicateIds: [] }
            }
          })
        }
      })
    })
  }

  /**
   * Transform CSV row to vocabulary card
   */
  private transformCSVRow(row: any, index: number): VocabularyCardInput | null {
    try {
      // Parse examples from JSON string in CSV
      let examples = []
      if (row.examples) {
        try {
          examples = JSON.parse(row.examples)
        } catch {
          examples = [{
            japanese: row.exampleJapanese || '',
            hiragana: row.exampleHiragana || '',
            english: row.exampleEnglish || '',
            source: { type: 'custom' as const }
          }]
        }
      }

      // Parse meanings
      let meanings = row.meaning
      if (row.meanings) {
        try {
          meanings = JSON.parse(row.meanings)
        } catch {
          meanings = row.meanings.split(',').map((m: string) => m.trim())
        }
      }

      // Parse tags
      let tags: string[] = []
      if (row.tags) {
        try {
          tags = JSON.parse(row.tags)
        } catch {
          tags = row.tags.split(',').map((t: string) => t.trim())
        }
      }

      // Parse part of speech
      let partOfSpeech: string[] = []
      if (row.partOfSpeech) {
        try {
          partOfSpeech = JSON.parse(row.partOfSpeech)
        } catch {
          partOfSpeech = row.partOfSpeech.split(',').map((p: string) => p.trim())
        }
      }

      return {
        id: row.id || `import_${index}`,
        kanji: row.kanji || undefined,
        kana: row.kana,
        meaning: meanings,
        examples,
        tags: tags.length > 0 ? tags : undefined,
        jlptLevel: row.jlptLevel as JLPTLevel,
        partOfSpeech: partOfSpeech.length > 0 ? partOfSpeech : undefined,
        license: {
          text: row.licenseText || 'CC BY-SA 4.0',
          url: row.licenseUrl || 'https://creativecommons.org/licenses/by-sa/4.0/'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    } catch (error) {
      console.error(`Error transforming row ${index}:`, error)
      return null
    }
  }

  /**
   * Bulk insert vocabulary cards into database
   */
  async bulkInsert(
    cards: VocabularyCard[],
    options: ImportOptions = {}
  ): Promise<ImportResult> {
    let imported = 0
    let skipped = 0
    const errors: string[] = []

    // Validate cards first
    const validation = validateVocabularyCards(cards)

    try {
      for (const card of cards) {
        try {
          // Check if card already exists
          const existing = await db.vocabulary.get(card.id)

          if (existing && !options.overwrite) {
            console.debug(`⏭️ Skipping duplicate card: ${card.id}`)
            skipped++
            continue
          }

          // Validate individual card
          const cardValidation = validateVocabularyCards([card])
          if (!cardValidation.valid) {
            const errorMsg = cardValidation.errors.map(e => `${e.field}: ${e.message}`).join(', ')
            console.warn(`⚠️ Skipping invalid card ${card.id}:`, errorMsg)
            if (options.skipInvalid) {
              skipped++
              continue
            } else {
              errors.push(`Card ${card.id}: ${errorMsg}`)
              continue
            }
          }

          // Ensure dates are Date objects and add DB-specific fields
          const now = new Date()
          const cardToInsert = {
            ...card,
            createdAt: card.createdAt || now,
            updatedAt: now,
            addedAt: now,
            modifiedAt: now
          }

          // Insert or update card
          await db.vocabulary.put(cardToInsert)
          imported++
        } catch (error) {
          errors.push(
            `Card ${card.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          )
          if (!options.skipInvalid) {
            break
          }
          skipped++
        }
      }

      return {
        success: errors.length === 0 && imported > 0,
        imported,
        skipped,
        errors,
        validation
      }
    } catch (error) {
      return {
        success: false,
        imported,
        skipped,
        errors: [...errors, error instanceof Error ? error.message : 'Bulk insert failed'],
        validation
      }
    }
  }

  /**
   * Export vocabulary to JSON
   */
  async exportToJSON(level?: JLPTLevel): Promise<Blob> {
    let cards: VocabularyCard[]

    if (level) {
      cards = await db.vocabulary.where('jlptLevel').equals(level).toArray()
    } else {
      cards = await db.vocabulary.toArray()
    }

    const exportData = {
      version: '1.0.0',
      metadata: {
        source: 'LingoMemory App',
        createdAt: new Date().toISOString(),
        author: 'LingoMemory',
        license: 'CC BY-SA 4.0',
        exportedBy: 'user',
        totalCards: cards.length
      },
      vocabulary: cards.map(card => ({
        ...card,
        createdAt: card.createdAt?.toISOString(),
        updatedAt: card.updatedAt?.toISOString()
      }))
    }

    return new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
  }

  /**
   * Export vocabulary to CSV
   */
  async exportToCSV(level?: JLPTLevel): Promise<Blob> {
    let cards: VocabularyCard[]

    if (level) {
      cards = await db.vocabulary.where('jlptLevel').equals(level).toArray()
    } else {
      cards = await db.vocabulary.toArray()
    }

    // Transform cards to CSV-friendly format
    const csvData = cards.map(card => ({
      id: card.id,
      kanji: card.kanji || '',
      kana: card.kana,
      meaning: Array.isArray(card.meaning) ? card.meaning.join('; ') : card.meaning,
      jlptLevel: card.jlptLevel,
      partOfSpeech: card.partOfSpeech?.join(', ') || '',
      tags: card.tags?.join(', ') || '',
      examples: JSON.stringify(card.examples),
      audioUrl: card.audio?.pronunciationUrl || '',
      licenseText: card.license?.text || '',
      licenseUrl: card.license?.url || ''
    }))

    const csv = Papa.unparse(csvData)

    return new Blob([csv], { type: 'text/csv' })
  }

  /**
   * Get import statistics
   */
  async getImportStats() {
    const total = await db.vocabulary.count()
    const byLevel = {
      N5: await db.vocabulary.where('jlptLevel').equals('N5').count(),
      N4: await db.vocabulary.where('jlptLevel').equals('N4').count(),
      N3: await db.vocabulary.where('jlptLevel').equals('N3').count(),
      N2: await db.vocabulary.where('jlptLevel').equals('N2').count(),
      N1: await db.vocabulary.where('jlptLevel').equals('N1').count()
    }

    return {
      total,
      byLevel,
      lastUpdated: new Date()
    }
  }

  /**
   * Clear all vocabulary data
   */
  async clearAll(): Promise<boolean> {
    try {
      await db.vocabulary.clear()
      return true
    } catch (error) {
      console.error('Error clearing vocabulary:', error)
      return false
    }
  }

  /**
   * Delete vocabulary by level
   */
  async deleteByLevel(level: JLPTLevel): Promise<number> {
    try {
      return await db.vocabulary.where('jlptLevel').equals(level).delete()
    } catch (error) {
      console.error(`Error deleting ${level} vocabulary:`, error)
      return 0
    }
  }
}

// Create singleton instance
export const contentImportService = new ContentImportService()

// Export for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).contentImportService = contentImportService
}
