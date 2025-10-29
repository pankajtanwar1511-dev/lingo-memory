import Dexie, { Table } from 'dexie'
import { VocabularyCard, Deck, StudySession, UserProgress } from '@/types/vocabulary'
import { StudyCard } from '@/store/study-store'
import { DailyStats, Achievement } from '@/types/analytics'

export interface DBVocabularyCard extends VocabularyCard {
  deckId?: string
  addedAt: Date
  modifiedAt: Date
}

export interface DBStudyCard extends StudyCard {
  id?: number
  userId?: string
}

export interface DBDeck extends Omit<Deck, 'cards'> {
  cardIds: string[]
  userId?: string
}

export interface DBStudySession extends StudySession {
  userId?: string
}

export interface DBUserSettings {
  id?: number
  userId: string
  theme: 'light' | 'dark' | 'system'
  dailyGoal: number
  notifications: boolean
  sound: boolean
  autoplay: boolean
  showFurigana: boolean
  reviewTime: string
  language: string
  dataSync: boolean
  analytics: boolean
  createdAt: Date
  updatedAt: Date
}

export interface DBSyncLog {
  id?: number
  userId: string
  operation: 'upload' | 'download'
  entityType: string
  entityId: string
  timestamp: Date
  success: boolean
  error?: string
}

class LingoMemoryDB extends Dexie {
  // Tables
  vocabulary!: Table<DBVocabularyCard>
  studyCards!: Table<DBStudyCard>
  decks!: Table<DBDeck>
  sessions!: Table<DBStudySession>
  settings!: Table<DBUserSettings>
  syncLog!: Table<DBSyncLog>
  progress!: Table<UserProgress>
  dailyStats!: Table<DailyStats>
  achievements!: Table<Achievement>

  constructor() {
    super('LingoMemoryDB')

    // Define database schema
    // Version 1
    this.version(1).stores({
      vocabulary: '&id, deckId, jlptLevel, addedAt, modifiedAt',
      studyCards: '++id, vocabularyId, userId, due, state',
      decks: '&id, userId, name, jlptLevel, visibility, createdAt',
      sessions: '&id, userId, deckId, startedAt, mode',
      settings: '++id, &userId, theme, language',
      syncLog: '++id, userId, timestamp, entityType',
      progress: '&userId, totalCardsLearned, currentStreak'
    })

    // Version 2: Add indexes for better query performance
    this.version(2).stores({
      vocabulary: '&id, deckId, jlptLevel, [deckId+jlptLevel], addedAt, modifiedAt, *tags',
      studyCards: '++id, vocabularyId, userId, [userId+vocabularyId], due, state, [userId+state], [userId+due]',
      decks: '&id, userId, name, jlptLevel, [userId+visibility], visibility, createdAt',
      sessions: '&id, userId, deckId, [userId+startedAt], startedAt, mode',
      settings: '++id, &userId, theme, language, updatedAt',
      syncLog: '++id, userId, [userId+timestamp], timestamp, entityType, success',
      progress: '&userId, totalCardsLearned, currentStreak, lastStudyDate'
    })

    // Version 3: Add analytics tables
    this.version(3).stores({
      vocabulary: '&id, deckId, jlptLevel, [deckId+jlptLevel], addedAt, modifiedAt, *tags',
      studyCards: '++id, vocabularyId, userId, [userId+vocabularyId], due, state, [userId+state], [userId+due]',
      decks: '&id, userId, name, jlptLevel, [userId+visibility], visibility, createdAt',
      sessions: '&id, userId, deckId, [userId+startedAt], startedAt, mode',
      settings: '++id, &userId, theme, language, updatedAt',
      syncLog: '++id, userId, [userId+timestamp], timestamp, entityType, success',
      progress: '&userId, totalCardsLearned, currentStreak, lastStudyDate',
      dailyStats: '&id, userId, date, cardsStudied, streak',
      achievements: '&id, userId, type, unlocked, tier'
    })

    // Initialize tables
    this.vocabulary = this.table('vocabulary')
    this.studyCards = this.table('studyCards')
    this.decks = this.table('decks')
    this.sessions = this.table('sessions')
    this.settings = this.table('settings')
    this.syncLog = this.table('syncLog')
    this.progress = this.table('progress')
    this.dailyStats = this.table('dailyStats')
    this.achievements = this.table('achievements')
  }

  // Helper methods for common operations

  /**
   * Get or create user settings
   */
  async getUserSettings(userId: string): Promise<DBUserSettings> {
    let settings = await this.settings.where('userId').equals(userId).first()

    if (!settings) {
      const defaultSettings: DBUserSettings = {
        userId,
        theme: 'system',
        dailyGoal: 20,
        notifications: true,
        sound: true,
        autoplay: false,
        showFurigana: true,
        reviewTime: '09:00',
        language: 'en',
        dataSync: true,
        analytics: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const id = await this.settings.add(defaultSettings)
      settings = { ...defaultSettings, id }
    }

    return settings
  }

  /**
   * Get study cards for a user
   */
  async getUserStudyCards(userId: string): Promise<DBStudyCard[]> {
    return await this.studyCards
      .where('[userId+state]')
      .between([userId, 0], [userId, 4])
      .toArray()
  }

  /**
   * Get due cards for review
   */
  async getDueCards(userId: string, limit?: number): Promise<DBStudyCard[]> {
    const now = new Date()
    let query = this.studyCards
      .where('[userId+due]')
      .between([userId, new Date(0)], [userId, now])

    if (limit) {
      return await query.limit(limit).toArray()
    }

    return await query.toArray()
  }

  /**
   * Get vocabulary cards for a deck
   */
  async getDeckCards(deckId: string): Promise<DBVocabularyCard[]> {
    return await this.vocabulary
      .where('deckId')
      .equals(deckId)
      .toArray()
  }

  /**
   * Create a new deck with cards
   */
  async createDeck(
    deck: Omit<DBDeck, 'id'>,
    cards: Omit<DBVocabularyCard, 'id' | 'deckId'>[]
  ): Promise<string> {
    return await this.transaction('rw', this.decks, this.vocabulary, async () => {
      // Generate deck ID and create deck
      const deckId = `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await this.decks.add({ ...deck, id: deckId })

      // Add cards to deck
      const cardsWithDeck = cards.map(card => ({
        ...card,
        id: `${deckId}_${Math.random().toString(36).substr(2, 9)}`,
        deckId: deckId,
        addedAt: new Date(),
        modifiedAt: new Date()
      }))

      await this.vocabulary.bulkAdd(cardsWithDeck)

      return deckId
    })
  }

  /**
   * Log sync operation
   */
  async logSync(
    userId: string,
    operation: 'upload' | 'download',
    entityType: string,
    entityId: string,
    success: boolean,
    error?: string
  ): Promise<void> {
    await this.syncLog.add({
      userId,
      operation,
      entityType,
      entityId,
      timestamp: new Date(),
      success,
      error
    })
  }

  /**
   * Export user data for backup
   */
  async exportUserData(userId: string): Promise<{
    version: string
    exportDate: Date
    settings: DBUserSettings | undefined
    studyCards: DBStudyCard[]
    decks: DBDeck[]
    sessions: DBStudySession[]
    progress: UserProgress | undefined
  }> {
    const [settings, studyCards, decks, sessions, progress] = await Promise.all([
      this.settings.where('userId').equals(userId).first(),
      this.studyCards.where('userId').equals(userId).toArray(),
      this.decks.where('userId').equals(userId).toArray(),
      this.sessions.where('userId').equals(userId).toArray(),
      this.progress.where('userId').equals(userId).first()
    ])

    return {
      version: '1.0.0',
      exportDate: new Date(),
      settings,
      studyCards,
      decks,
      sessions,
      progress
    }
  }

  /**
   * Import user data from backup
   */
  async importUserData(
    userId: string,
    data: {
      settings?: DBUserSettings
      studyCards?: DBStudyCard[]
      decks?: DBDeck[]
      sessions?: DBStudySession[]
      progress?: UserProgress
    }
  ): Promise<void> {
    await this.transaction('rw',
      [this.settings, this.studyCards, this.decks, this.sessions, this.progress],
      async () => {
        // Clear existing user data
        await Promise.all([
          this.settings.where('userId').equals(userId).delete(),
          this.studyCards.where('userId').equals(userId).delete(),
          this.decks.where('userId').equals(userId).delete(),
          this.sessions.where('userId').equals(userId).delete(),
          this.progress.where('userId').equals(userId).delete()
        ])

        // Import new data
        if (data.settings) {
          await this.settings.add({ ...data.settings, userId })
        }

        if (data.studyCards && data.studyCards.length > 0) {
          await this.studyCards.bulkAdd(
            data.studyCards.map(card => ({ ...card, userId }))
          )
        }

        if (data.decks && data.decks.length > 0) {
          await this.decks.bulkAdd(
            data.decks.map(deck => ({ ...deck, userId }))
          )
        }

        if (data.sessions && data.sessions.length > 0) {
          await this.sessions.bulkAdd(
            data.sessions.map(session => ({ ...session, userId }))
          )
        }

        if (data.progress) {
          await this.progress.add({ ...data.progress, userId })
        }
      }
    )
  }

  /**
   * Clear all user data
   */
  async clearUserData(userId: string): Promise<void> {
    await this.transaction('rw',
      [this.settings, this.studyCards, this.decks, this.sessions, this.progress, this.syncLog],
      async () => {
        await Promise.all([
          this.settings.where('userId').equals(userId).delete(),
          this.studyCards.where('userId').equals(userId).delete(),
          this.decks.where('userId').equals(userId).delete(),
          this.sessions.where('userId').equals(userId).delete(),
          this.progress.where('userId').equals(userId).delete(),
          this.syncLog.where('userId').equals(userId).delete()
        ])
      }
    )
  }
}

// Create database instance
export const db = new LingoMemoryDB()

// Export database for debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).db = db
}