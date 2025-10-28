import { db, DBVocabularyCard, DBStudyCard, DBDeck } from '@/lib/db'
import { VocabularyCard, JLPTLevel } from '@/types/vocabulary'
import { StudyCard } from '@/store/study-store'
import { fsrs } from '@/lib/fsrs'
import { sampleN5Deck, sampleN5DeckMetadata } from '@/data/sample-n5-deck'

// Default user ID for local-only mode
const DEFAULT_USER_ID = 'local-user'

export class DatabaseService {
  private userId: string

  constructor(userId: string = DEFAULT_USER_ID) {
    this.userId = userId
  }

  /**
   * Initialize database with sample data
   */
  async initializeDatabase(): Promise<void> {
    try {
      // Check if we already have data
      const existingDecks = await db.decks.where('userId').equals(this.userId).count()

      if (existingDecks === 0) {
        console.log('Initializing database with sample data...')

        // Create sample deck
        const deckId = `deck_${Date.now()}`
        const deck: Omit<DBDeck, 'id'> = {
          name: sampleN5DeckMetadata.name,
          description: sampleN5DeckMetadata.description,
          jlptLevel: sampleN5DeckMetadata.jlptLevel,
          cardIds: sampleN5Deck.map(card => card.id),
          visibility: sampleN5DeckMetadata.visibility,
          premiumOnly: sampleN5DeckMetadata.premiumOnly,
          credits: sampleN5DeckMetadata.credits,
          createdAt: sampleN5DeckMetadata.createdAt,
          updatedAt: sampleN5DeckMetadata.updatedAt,
          userId: this.userId
        }

        // Add deck to database
        await db.decks.add({ ...deck, id: deckId })

        // Add vocabulary cards
        const vocabCards: DBVocabularyCard[] = sampleN5Deck.map(card => ({
          ...card,
          deckId,
          addedAt: new Date(),
          modifiedAt: new Date()
        }))

        await db.vocabulary.bulkAdd(vocabCards)

        // Create study cards for each vocabulary
        // Only add study cards that don't already exist
        const existingStudyCards = await db.studyCards
          .where('[userId+vocabularyId]')
          .anyOf(sampleN5Deck.map(card => [this.userId, card.id]))
          .toArray()

        const existingVocabIds = new Set(existingStudyCards.map(sc => sc.vocabularyId))

        const studyCards: DBStudyCard[] = sampleN5Deck
          .filter(card => !existingVocabIds.has(card.id))
          .map(card => ({
            ...fsrs.initCard(),
            vocabularyId: card.id,
            userId: this.userId
          }))

        if (studyCards.length > 0) {
          await db.studyCards.bulkAdd(studyCards)
          console.log(`Created ${studyCards.length} new study cards`)
        } else {
          console.log('Study cards already exist, skipping creation')
        }

        console.log('Database initialized successfully')
      }
    } catch (error) {
      console.error('Error initializing database:', error)
      throw error
    }
  }

  /**
   * Get all vocabulary cards
   */
  async getVocabulary(): Promise<VocabularyCard[]> {
    const cards = await db.vocabulary.toArray()
    return cards.map(card => {
      const { deckId, addedAt, modifiedAt, ...vocabCard } = card
      return vocabCard as VocabularyCard
    })
  }

  /**
   * Get study cards for current user
   */
  async getStudyCards(): Promise<StudyCard[]> {
    return await db.getUserStudyCards(this.userId)
  }

  /**
   * Update study card
   */
  async updateStudyCard(card: StudyCard): Promise<void> {
    const dbCard: DBStudyCard = {
      ...card,
      userId: this.userId
    }

    const existing = await db.studyCards
      .where('[userId+vocabularyId]')
      .equals([this.userId, card.vocabularyId])
      .first()

    if (existing && existing.id) {
      await db.studyCards.update(existing.id, dbCard)
    } else {
      await db.studyCards.add(dbCard)
    }
  }

  /**
   * Bulk update study cards
   */
  async bulkUpdateStudyCards(cards: StudyCard[]): Promise<void> {
    const dbCards: DBStudyCard[] = cards.map(card => ({
      ...card,
      userId: this.userId
    }))

    await db.transaction('rw', db.studyCards, async () => {
      for (const card of dbCards) {
        const existing = await db.studyCards
          .where('[userId+vocabularyId]')
          .equals([this.userId, card.vocabularyId])
          .first()

        if (existing && existing.id) {
          await db.studyCards.update(existing.id, card)
        } else {
          await db.studyCards.add(card)
        }
      }
    })
  }

  /**
   * Export all data as JSON
   */
  async exportData(): Promise<string> {
    const data = await db.exportUserData(this.userId)
    return JSON.stringify(data, null, 2)
  }

  /**
   * Import data from JSON
   */
  async importData(jsonString: string): Promise<void> {
    try {
      const data = JSON.parse(jsonString)

      // Validate data structure
      if (!data.version || !data.exportDate) {
        throw new Error('Invalid import file format')
      }

      await db.importUserData(this.userId, data)
    } catch (error) {
      console.error('Error importing data:', error)
      throw new Error('Failed to import data. Please check the file format.')
    }
  }

  /**
   * Get database statistics
   */
  async getStatistics(): Promise<{
    totalCards: number
    totalDecks: number
    studyCards: number
    sessions: number
  }> {
    const [totalCards, totalDecks, studyCards, sessions] = await Promise.all([
      db.vocabulary.count(),
      db.decks.where('userId').equals(this.userId).count(),
      db.studyCards.where('userId').equals(this.userId).count(),
      db.sessions.where('userId').equals(this.userId).count()
    ])

    return {
      totalCards,
      totalDecks,
      studyCards,
      sessions
    }
  }

  /**
   * Clear all data
   */
  async clearAllData(): Promise<void> {
    await db.clearUserData(this.userId)
  }

  /**
   * Sync with Zustand store (migration helper)
   */
  async syncFromStore(storeData: {
    vocabulary: VocabularyCard[]
    studyCards: StudyCard[]
  }): Promise<void> {
    console.log(`📤 Syncing ${storeData.studyCards.length} study cards from store to database...`)

    // Clear existing data for this user
    const deleted = await db.studyCards.where('userId').equals(this.userId).delete()
    console.log(`🗑️ Deleted ${deleted} existing study cards`)

    // Import study cards from store
    const dbStudyCards: DBStudyCard[] = storeData.studyCards.map(card => ({
      ...card,
      userId: this.userId
    }))

    if (dbStudyCards.length > 0) {
      await db.studyCards.bulkAdd(dbStudyCards)
      console.log(`✅ Added ${dbStudyCards.length} study cards to database`)
    }
  }

  /**
   * Get data for Zustand store initialization
   */
  async getDataForStore(): Promise<{
    vocabulary: VocabularyCard[]
    studyCards: StudyCard[]
  }> {
    const [vocabulary, studyCards] = await Promise.all([
      this.getVocabulary(),
      this.getStudyCards()
    ])

    return {
      vocabulary,
      studyCards
    }
  }

  // ========== Day 4 Management Features ==========

  /**
   * Add a new vocabulary card
   */
  async addVocabularyCard(card: VocabularyCard, deckId?: string): Promise<void> {
    const dbCard: DBVocabularyCard = {
      ...card,
      deckId,
      addedAt: new Date(),
      modifiedAt: new Date()
    }

    await db.vocabulary.add(dbCard)

    // Create study card for this vocabulary
    const studyCard: DBStudyCard = {
      ...fsrs.initCard(),
      vocabularyId: card.id,
      userId: this.userId
    }

    await db.studyCards.add(studyCard)
  }

  /**
   * Add multiple vocabulary cards (bulk)
   */
  async addVocabularyCards(cards: VocabularyCard[], deckId?: string): Promise<void> {
    await db.transaction('rw', db.vocabulary, db.studyCards, async () => {
      const dbCards: DBVocabularyCard[] = cards.map(card => ({
        ...card,
        deckId,
        addedAt: new Date(),
        modifiedAt: new Date()
      }))

      await db.vocabulary.bulkAdd(dbCards)

      // Create study cards for all vocabulary
      // Only add study cards that don't already exist
      const existingStudyCards = await db.studyCards
        .where('[userId+vocabularyId]')
        .anyOf(cards.map(card => [this.userId, card.id]))
        .toArray()

      const existingVocabIds = new Set(existingStudyCards.map(sc => sc.vocabularyId))

      const studyCards: DBStudyCard[] = cards
        .filter(card => !existingVocabIds.has(card.id))
        .map(card => ({
          ...fsrs.initCard(),
          vocabularyId: card.id,
          userId: this.userId
        }))

      if (studyCards.length > 0) {
        await db.studyCards.bulkAdd(studyCards)
      }
    })
  }

  /**
   * Update a vocabulary card
   */
  async updateVocabularyCard(cardId: string, updates: Partial<VocabularyCard>): Promise<void> {
    await db.vocabulary.update(cardId, {
      ...updates,
      modifiedAt: new Date()
    })
  }

  /**
   * Delete vocabulary cards (bulk)
   */
  async deleteVocabularyCards(cardIds: string[]): Promise<void> {
    await db.transaction('rw', db.vocabulary, db.studyCards, async () => {
      await db.vocabulary.bulkDelete(cardIds)

      // Also delete associated study cards
      await db.studyCards
        .where('vocabularyId')
        .anyOf(cardIds)
        .delete()
    })
  }

  /**
   * Get all decks for current user
   */
  async getDecks(): Promise<DBDeck[]> {
    return await db.decks.where('userId').equals(this.userId).toArray()
  }

  /**
   * Create a new deck
   */
  async createDeck(deck: Omit<DBDeck, 'id' | 'userId'>): Promise<string> {
    const deckId = `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await db.decks.add({
      ...deck,
      id: deckId,
      userId: this.userId
    })

    return deckId
  }

  /**
   * Update a deck
   */
  async updateDeck(deckId: string, updates: Partial<DBDeck>): Promise<void> {
    await db.decks.update(deckId, {
      ...updates,
      updatedAt: new Date()
    })
  }

  /**
   * Delete a deck (keeps vocabulary cards)
   */
  async deleteDeck(deckId: string): Promise<void> {
    await db.decks.delete(deckId)
  }

  /**
   * Get vocabulary cards in a deck
   */
  async getDeckVocabulary(deckId: string): Promise<VocabularyCard[]> {
    const cards = await db.getDeckCards(deckId)
    return cards.map(card => {
      const { deckId: _, addedAt, modifiedAt, ...vocabCard } = card
      return vocabCard as VocabularyCard
    })
  }

  /**
   * Bulk add tags to vocabulary cards
   */
  async bulkAddTags(cardIds: string[], tags: string[]): Promise<void> {
    await db.transaction('rw', db.vocabulary, async () => {
      const cards = await db.vocabulary.where('id').anyOf(cardIds).toArray()

      for (const card of cards) {
        const newTags = [...new Set([...(card.tags || []), ...tags])]
        await db.vocabulary.update(card.id, {
          tags: newTags,
          modifiedAt: new Date()
        })
      }
    })
  }

  /**
   * Bulk remove tags from vocabulary cards
   */
  async bulkRemoveTags(cardIds: string[], tags: string[]): Promise<void> {
    await db.transaction('rw', db.vocabulary, async () => {
      const cards = await db.vocabulary.where('id').anyOf(cardIds).toArray()

      for (const card of cards) {
        const newTags = (card.tags || []).filter(tag => !tags.includes(tag))
        await db.vocabulary.update(card.id, {
          tags: newTags,
          modifiedAt: new Date()
        })
      }
    })
  }

  /**
   * Bulk update JLPT level
   */
  async bulkUpdateJLPTLevel(cardIds: string[], level?: JLPTLevel): Promise<void> {
    await db.vocabulary
      .where('id')
      .anyOf(cardIds)
      .modify({
        jlptLevel: level,
        updatedAt: new Date()
      })
  }

  /**
   * Move cards to a deck
   */
  async moveCardsToDeck(cardIds: string[], deckId: string): Promise<void> {
    await db.transaction('rw', db.vocabulary, db.decks, async () => {
      // Update cards with new deckId
      await db.vocabulary
        .where('id')
        .anyOf(cardIds)
        .modify({
          deckId,
          modifiedAt: new Date()
        })

      // Update deck's cardIds array
      const deck = await db.decks.get(deckId)
      if (deck) {
        const newCardIds = [...new Set([...deck.cardIds, ...cardIds])]
        await db.decks.update(deckId, {
          cardIds: newCardIds,
          updatedAt: new Date()
        })
      }
    })
  }

  /**
   * Search vocabulary cards
   */
  async searchVocabulary(query: string): Promise<VocabularyCard[]> {
    const allCards = await db.vocabulary.toArray()
    const lowerQuery = query.toLowerCase()

    const filtered = allCards.filter(card => {
      const meaning = Array.isArray(card.meaning)
        ? card.meaning.join(' ').toLowerCase()
        : card.meaning.toLowerCase()

      return (
        card.kanji?.toLowerCase().includes(lowerQuery) ||
        card.kana.toLowerCase().includes(lowerQuery) ||
        meaning.includes(lowerQuery)
      )
    })

    return filtered.map(card => {
      const { deckId, addedAt, modifiedAt, ...vocabCard } = card
      return vocabCard as VocabularyCard
    })
  }
}

// Create singleton instance
export const databaseService = new DatabaseService()

// Export for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).databaseService = databaseService
}