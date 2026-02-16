/**
 * Persona Example Import Service
 *
 * Imports persona-based example data into the database
 */

import { db, DBVocabularyCard } from '@/lib/db'
import { VocabularyCard, Example } from '@/types/vocabulary'

export interface PersonaImportResult {
  success: boolean
  imported: number
  updated: number
  errors: string[]
}

export class PersonaImportService {
  /**
   * Import demo examples with personas (deprecated - demo data removed)
   */
  async importDemoExamples(): Promise<PersonaImportResult> {
    return {
      success: false,
      imported: 0,
      updated: 0,
      errors: ['Demo data has been removed. Please use importVocabularyWithPersonas() with your own data.']
    }
  }

  /**
   * Import specific vocabulary cards with persona examples
   */
  async importVocabularyWithPersonas(
    cards: VocabularyCard[],
    overwrite: boolean = false
  ): Promise<PersonaImportResult> {
    const result: PersonaImportResult = {
      success: true,
      imported: 0,
      updated: 0,
      errors: []
    }

    try {
      for (const card of cards) {
        try {
          const existing = await db.vocabulary.get(card.id)

          if (existing) {
            if (overwrite) {
              await db.vocabulary.update(card.id, {
                ...card,
                modifiedAt: new Date()
              })
              result.updated++
            } else {
              result.errors.push(`Card ${card.id} already exists (use overwrite to replace)`)
            }
          } else {
            const newCard: DBVocabularyCard = {
              ...card,
              addedAt: new Date(),
              modifiedAt: new Date()
            }

            await db.vocabulary.add(newCard)
            result.imported++
          }
        } catch (error) {
          result.errors.push(
            `Failed to import ${card.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          )
          result.success = false
        }
      }

      return result
    } catch (error) {
      return {
        success: false,
        imported: 0,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown import error']
      }
    }
  }

  /**
   * Get all vocabulary cards with generated examples
   */
  async getCardsWithGeneratedExamples(): Promise<DBVocabularyCard[]> {
    const allCards = await db.vocabulary.toArray()

    return allCards.filter(card =>
      card.examples && card.examples.some(ex => ex.source.type === 'generated')
    )
  }

  /**
   * Get statistics about persona examples in database
   */
  async getPersonaStats(): Promise<{
    totalCards: number
    cardsWithGeneratedExamples: number
    totalGeneratedExamples: number
    examplesByPersona: Record<string, number>
  }> {
    const allCards = await db.vocabulary.toArray()
    const cardsWithGenerated = allCards.filter(card =>
      card.examples && card.examples.some(ex => ex.source.type === 'generated')
    )

    const examplesByPersona: Record<string, number> = {}
    let totalGenerated = 0

    for (const card of allCards) {
      if (!card.examples) continue

      for (const example of card.examples) {
        if (example.source.type === 'generated' && 'persona' in example.source) {
          const personaId = example.source.persona
          examplesByPersona[personaId] = (examplesByPersona[personaId] || 0) + 1
          totalGenerated++
        }
      }
    }

    return {
      totalCards: allCards.length,
      cardsWithGeneratedExamples: cardsWithGenerated.length,
      totalGeneratedExamples: totalGenerated,
      examplesByPersona
    }
  }

  /**
   * Clear all generated examples from database
   */
  async clearGeneratedExamples(): Promise<number> {
    let clearedCount = 0

    const allCards = await db.vocabulary.toArray()

    for (const card of allCards) {
      if (!card.examples) continue

      const authenticExamples = card.examples.filter(ex => ex.source.type !== 'generated')

      if (authenticExamples.length !== card.examples.length) {
        await db.vocabulary.update(card.id, {
          examples: authenticExamples,
          modifiedAt: new Date()
        })
        clearedCount++
      }
    }

    return clearedCount
  }
}

// Export singleton instance
export const personaImportService = new PersonaImportService()
