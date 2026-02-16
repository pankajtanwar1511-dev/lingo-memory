/**
 * Seed Loader Service
 *
 * Automatically loads curated vocabulary seed data into the database.
 * Runs on first app load or when explicitly triggered.
 */

import { contentImportService } from './content-import.service'
import { db } from '@/lib/db'

export interface SeedFile {
  name: string
  path: string
  description: string
  priority: number // Lower number = higher priority
}

/**
 * Available seed data files
 */
export const SEED_FILES: SeedFile[] = [
  {
    name: 'N5 Enhanced Dataset',
    path: '/seed-data/N5_vocab_dataset.json',
    description: '863 JLPT N5 words - complete N5 coverage with 98.9% JMdict integration',
    priority: 1
  }
]

export interface SeedResult {
  success: boolean
  loaded: number
  failed: number
  total: number
  errors: string[]
  details: {
    file: string
    imported: number
    skipped: number
    errors: string[]
  }[]
}

export class SeedLoaderService {
  private hasLoadedKey = 'vocab_seed_loaded_v30_phase3' // v3.0 Phase 3: Complete N5 coverage (863 cards)

  /**
   * Check if seed data has already been loaded
   */
  hasLoaded(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(this.hasLoadedKey) === 'true'
  }

  /**
   * Mark seed data as loaded
   */
  private markAsLoaded(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.hasLoadedKey, 'true')
    }
  }

  /**
   * Clear the loaded flag (for re-seeding)
   */
  clearLoadedFlag(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.hasLoadedKey)
    }
  }

  /**
   * Load all seed data files
   */
  async loadAll(force: boolean = false): Promise<SeedResult> {
    // Check if already loaded
    if (!force && this.hasLoaded()) {
      console.log('Seed data already loaded, skipping...')
      return {
        success: true,
        loaded: 0,
        failed: 0,
        total: 0,
        errors: [],
        details: []
      }
    }

    const result: SeedResult = {
      success: true,
      loaded: 0,
      failed: 0,
      total: SEED_FILES.length,
      errors: [],
      details: []
    }

    // Sort by priority
    const sortedFiles = [...SEED_FILES].sort((a, b) => a.priority - b.priority)

    // Load each file
    for (const seedFile of sortedFiles) {
      try {
        console.log(`Loading seed file: ${seedFile.name}...`)

        const response = await fetch(seedFile.path)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        // Create a File object from the JSON data
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
        const file = new File([blob], `${seedFile.name}.json`, { type: 'application/json' })

        // Import the data
        const importResult = await contentImportService.importFromJSON(file, {
          overwrite: false,
          skipInvalid: true
        })

        if (importResult.success) {
          result.loaded++
          console.log(`✅ Loaded ${seedFile.name}: ${importResult.imported} cards imported, ${importResult.skipped} skipped`)
          if (importResult.skipped > 0) {
            console.warn(`⚠️ ${seedFile.name}: ${importResult.skipped} cards were skipped (duplicates or validation errors)`)
          }
        } else {
          result.failed++
          result.errors.push(`Failed to load ${seedFile.name}`)
          console.error(`❌ Failed to load ${seedFile.name}:`, importResult.errors)
        }

        result.details.push({
          file: seedFile.name,
          imported: importResult.imported,
          skipped: importResult.skipped,
          errors: importResult.errors
        })
      } catch (error) {
        result.failed++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        result.errors.push(`Error loading ${seedFile.name}: ${errorMessage}`)
        console.error(`❌ Error loading ${seedFile.name}:`, error)

        result.details.push({
          file: seedFile.name,
          imported: 0,
          skipped: 0,
          errors: [errorMessage]
        })
      }
    }

    // Mark as loaded if successful
    if (result.loaded > 0 && result.failed === 0) {
      this.markAsLoaded()
      console.log(`✅ Successfully loaded all ${result.loaded} seed files`)
    } else if (result.loaded > 0) {
      this.markAsLoaded()
      console.warn(`⚠️ Loaded ${result.loaded}/${result.total} seed files (${result.failed} failed)`)
    } else {
      result.success = false
      console.error('❌ Failed to load any seed files')
    }

    return result
  }

  /**
   * Load a specific seed file
   */
  async loadFile(seedFile: SeedFile): Promise<SeedResult> {
    const result: SeedResult = {
      success: false,
      loaded: 0,
      failed: 0,
      total: 1,
      errors: [],
      details: []
    }

    try {
      const response = await fetch(seedFile.path)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const file = new File([blob], `${seedFile.name}.json`, { type: 'application/json' })

      const importResult = await contentImportService.importFromJSON(file, {
        overwrite: true,
        skipInvalid: true
      })

      if (importResult.success) {
        result.loaded = 1
        result.success = true
      } else {
        result.failed = 1
        result.errors = importResult.errors
      }

      result.details.push({
        file: seedFile.name,
        imported: importResult.imported,
        skipped: importResult.skipped,
        errors: importResult.errors
      })
    } catch (error) {
      result.failed = 1
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      result.errors.push(errorMessage)

      result.details.push({
        file: seedFile.name,
        imported: 0,
        skipped: 0,
        errors: [errorMessage]
      })
    }

    return result
  }

  /**
   * Re-seed all data (clear and reload)
   */
  async reseed(): Promise<SeedResult> {
    console.log('Re-seeding vocabulary data...')

    // Clear existing vocabulary
    await db.vocabulary.clear()

    // Clear loaded flag
    this.clearLoadedFlag()

    // Load all seed files
    return await this.loadAll(true)
  }

  /**
   * Get seeding status
   */
  async getStatus() {
    const hasLoaded = this.hasLoaded()
    const totalCards = await db.vocabulary.count()
    const byLevel = {
      N5: await db.vocabulary.where('jlptLevel').equals('N5').count(),
      N4: await db.vocabulary.where('jlptLevel').equals('N4').count(),
      N3: await db.vocabulary.where('jlptLevel').equals('N3').count(),
      N2: await db.vocabulary.where('jlptLevel').equals('N2').count(),
      N1: await db.vocabulary.where('jlptLevel').equals('N1').count()
    }

    return {
      hasLoaded,
      totalCards,
      byLevel,
      seedFiles: SEED_FILES.length
    }
  }
}

// Create singleton instance
export const seedLoaderService = new SeedLoaderService()

// Export for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).seedLoaderService = seedLoaderService
}
