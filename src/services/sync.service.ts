/**
 * Sync Service
 *
 * Coordinates bidirectional synchronization between IndexedDB and Firestore.
 * Handles conflict resolution, offline queuing, and real-time updates.
 */

import { db } from '@/lib/db'
import { realtimeDbService as cloudDb } from '@/lib/realtime-db.service'
import { VocabularyCard, Deck } from '@/types/vocabulary'
import { StudyCard } from '@/store/study-store'

interface SyncQueueItem {
  type: 'vocabulary' | 'study-card' | 'deck'
  action: 'create' | 'update' | 'delete'
  id: string
  data?: any
  timestamp: number
}

export class SyncService {
  private userId: string | null = null
  private syncQueue: SyncQueueItem[] = []
  private isSyncing = false
  private unsubscribers: (() => void)[] = []
  private syncInterval: NodeJS.Timeout | null = null
  private isOnline = typeof window !== 'undefined' ? navigator.onLine : true

  constructor() {
    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline)
      window.addEventListener('offline', this.handleOffline)
    }
  }

  /**
   * Initialize sync for a user
   */
  async initialize(userId: string): Promise<void> {
    if (!cloudDb.isAvailable()) {
      console.log('Firestore not available, skipping sync initialization')
      return
    }

    this.userId = userId
    console.log(`Initializing sync for user: ${userId}`)

    // Perform initial sync
    await this.performInitialSync()

    // Start listening for remote changes
    this.startRealtimeSync()

    // Start periodic sync (every 5 minutes)
    this.startPeriodicSync()

    // Process any queued offline changes
    await this.processOfflineQueue()
  }

  /**
   * Stop sync and clean up
   */
  stop(): void {
    console.log('Stopping sync service')

    // Stop all listeners
    this.unsubscribers.forEach(unsub => unsub())
    this.unsubscribers = []

    // Stop periodic sync
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }

    // Remove event listeners
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline)
      window.removeEventListener('offline', this.handleOffline)
    }

    this.userId = null
  }

  /**
   * Perform initial sync when user logs in
   */
  private async performInitialSync(): Promise<void> {
    if (!this.userId) return

    console.log('Performing initial sync...')
    this.isSyncing = true

    try {
      // Get last sync timestamp
      const lastSync = await cloudDb.getLastSync(this.userId)
      console.log('Last sync:', lastSync)

      // Sync vocabulary
      await this.syncVocabularyDown()

      // Sync study cards
      await this.syncStudyCardsDown()

      // Sync decks
      await this.syncDecksDown()

      // Upload any local changes
      await this.syncLocalChangesUp()

      // Update last sync timestamp
      await cloudDb.updateLastSync(this.userId)

      console.log('Initial sync completed successfully')
    } catch (error) {
      console.error('Initial sync failed:', error)
      throw error
    } finally {
      this.isSyncing = false
    }
  }

  /**
   * Download vocabulary from Firestore to IndexedDB
   */
  private async syncVocabularyDown(): Promise<void> {
    if (!this.userId) return

    const remoteCards = await cloudDb.getVocabularyCards(this.userId)
    console.log(`Downloaded ${remoteCards.length} vocabulary cards from cloud`)

    for (const remoteCard of remoteCards) {
      const localCard = await db.vocabulary.get(remoteCard.id)

      if (!localCard) {
        // New card from cloud - add to local
        await db.vocabulary.add({
          ...remoteCard,
          deckId: undefined,
          addedAt: remoteCard.createdAt || new Date(),
          modifiedAt: remoteCard.updatedAt || new Date(),
        })
      } else {
        // Card exists - check for conflicts
        const remoteTime = remoteCard.updatedAt?.getTime() || 0
        const localTime = localCard.modifiedAt.getTime()

        if (remoteTime > localTime) {
          // Remote is newer - update local
          await db.vocabulary.update(remoteCard.id, {
            ...remoteCard,
            modifiedAt: remoteCard.updatedAt,
          })
        }
      }
    }
  }

  /**
   * Download study cards from Firestore to IndexedDB
   */
  private async syncStudyCardsDown(): Promise<void> {
    if (!this.userId) return

    const remoteCards = await cloudDb.getStudyCards(this.userId)
    console.log(`Downloaded ${remoteCards.length} study cards from cloud`)

    for (const remoteCard of remoteCards) {
      const localCard = await db.studyCards.get(remoteCard.vocabularyId)

      if (!localCard) {
        // New study card - add to local
        await db.studyCards.add({
          ...remoteCard,
          userId: this.userId,
        })
      } else {
        // Study card exists - always prefer remote (has latest progress)
        await db.studyCards.update(remoteCard.vocabularyId, remoteCard)
      }
    }
  }

  /**
   * Download decks from Firestore to IndexedDB
   */
  private async syncDecksDown(): Promise<void> {
    if (!this.userId) return

    const remoteDecks = await cloudDb.getDecks(this.userId)
    console.log(`Downloaded ${remoteDecks.length} decks from cloud`)

    for (const remoteDeck of remoteDecks) {
      // Convert cardIds back to cards array
      const cardIds = remoteDeck.cardIds || []
      const cards = await Promise.all(
        cardIds.map(async (id: string) => {
          const card = await db.vocabulary.get(id)
          if (card) {
            const { deckId, addedAt, modifiedAt, ...vocabCard } = card
            return vocabCard as VocabularyCard
          }
          return null
        })
      )

      const dbDeck = {
        id: remoteDeck.id,
        name: remoteDeck.name,
        description: remoteDeck.description,
        jlptLevel: remoteDeck.jlptLevel,
        visibility: remoteDeck.visibility || 'private' as const,
        cardIds: cardIds,
        userId: this.userId,
        createdAt: remoteDeck.createdAt?.toDate() || new Date(),
        updatedAt: remoteDeck.updatedAt?.toDate() || new Date(),
      }

      const localDeck = await db.decks.get(dbDeck.id)

      if (!localDeck) {
        // New deck - add to local
        await db.decks.add(dbDeck)
      } else {
        // Update existing deck
        await db.decks.update(dbDeck.id, dbDeck)
      }
    }
  }

  /**
   * Upload local changes to Firestore
   */
  private async syncLocalChangesUp(): Promise<void> {
    if (!this.userId) return

    // Upload vocabulary cards
    const localVocab = await db.vocabulary.toArray()
    if (localVocab.length > 0) {
      const vocabCards = localVocab.map(card => {
        const { deckId, addedAt, modifiedAt, ...vocabCard } = card
        return vocabCard as VocabularyCard
      })
      await cloudDb.syncVocabularyCards(this.userId, vocabCards)
      console.log(`Uploaded ${vocabCards.length} vocabulary cards`)
    }

    // Upload study cards
    const localStudyCards = await db.studyCards.where('userId').equals(this.userId).toArray()
    if (localStudyCards.length > 0) {
      await cloudDb.syncStudyCards(this.userId, localStudyCards)
      console.log(`Uploaded ${localStudyCards.length} study cards`)
    }

    // Upload decks
    const localDecks = await db.decks.where('userId').equals(this.userId).toArray()
    for (const dbDeck of localDecks) {
      // Convert DBDeck to Deck by fetching cards
      const cards = await Promise.all(
        dbDeck.cardIds.map(async (id: string) => {
          const card = await db.vocabulary.get(id)
          if (card) {
            const { deckId, addedAt, modifiedAt, ...vocabCard } = card
            return vocabCard as VocabularyCard
          }
          return null
        })
      )

      const deck: Deck = {
        id: dbDeck.id,
        name: dbDeck.name,
        description: dbDeck.description,
        jlptLevel: dbDeck.jlptLevel,
        visibility: dbDeck.visibility,
        cards: cards.filter(Boolean) as VocabularyCard[],
        createdAt: dbDeck.createdAt,
        updatedAt: dbDeck.updatedAt,
      }

      await cloudDb.syncDeck(this.userId, deck)
    }
    if (localDecks.length > 0) {
      console.log(`Uploaded ${localDecks.length} decks`)
    }
  }

  /**
   * Start listening for real-time changes from Firestore
   */
  private startRealtimeSync(): void {
    if (!this.userId) return

    console.log('Starting real-time sync listeners')

    // Listen for vocabulary changes
    const vocabUnsubscribe = cloudDb.subscribeToVocabulary(
      this.userId,
      async (remoteCards) => {
        if (this.isSyncing) return // Skip if we're syncing

        console.log(`Received ${remoteCards.length} vocabulary cards from real-time listener`)

        for (const remoteCard of remoteCards) {
          const localCard = await db.vocabulary.get(remoteCard.id)

          if (!localCard) {
            // New card - add to local
            await db.vocabulary.add({
              ...remoteCard,
              deckId: undefined,
              addedAt: remoteCard.createdAt || new Date(),
              modifiedAt: remoteCard.updatedAt || new Date(),
            })
          } else {
            // Update if remote is newer
            const remoteTime = remoteCard.updatedAt?.getTime() || 0
            const localTime = localCard.modifiedAt.getTime()

            if (remoteTime > localTime) {
              await db.vocabulary.update(remoteCard.id, {
                ...remoteCard,
                modifiedAt: remoteCard.updatedAt,
              })
            }
          }
        }
      }
    )

    this.unsubscribers.push(vocabUnsubscribe)
  }

  /**
   * Start periodic sync (every 5 minutes)
   */
  private startPeriodicSync(): void {
    if (this.syncInterval) return

    this.syncInterval = setInterval(async () => {
      if (this.isOnline && !this.isSyncing && this.userId) {
        console.log('Running periodic sync...')
        try {
          await this.syncLocalChangesUp()
          await cloudDb.updateLastSync(this.userId)
        } catch (error) {
          console.error('Periodic sync failed:', error)
        }
      }
    }, 5 * 60 * 1000) // 5 minutes
  }

  /**
   * Queue an operation for offline sync
   */
  queueOperation(item: SyncQueueItem): void {
    this.syncQueue.push(item)
    console.log(`Queued ${item.action} operation for ${item.type}:${item.id}`)

    // Save queue to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue))
    }
  }

  /**
   * Process queued offline operations
   */
  private async processOfflineQueue(): Promise<void> {
    if (!this.isOnline || !this.userId) return

    // Load queue from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('syncQueue')
      if (saved) {
        this.syncQueue = JSON.parse(saved)
      }
    }

    if (this.syncQueue.length === 0) return

    console.log(`Processing ${this.syncQueue.length} queued operations...`)

    while (this.syncQueue.length > 0) {
      const item = this.syncQueue.shift()
      if (!item) break

      try {
        await this.processQueueItem(item)
      } catch (error) {
        console.error('Failed to process queue item:', item, error)
        // Re-queue the item
        this.syncQueue.push(item)
        break
      }
    }

    // Save updated queue
    if (typeof window !== 'undefined') {
      localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue))
    }
  }

  /**
   * Process a single queue item
   */
  private async processQueueItem(item: SyncQueueItem): Promise<void> {
    if (!this.userId) return

    switch (item.type) {
      case 'vocabulary':
        if (item.action === 'create' || item.action === 'update') {
          await cloudDb.syncVocabularyCard(this.userId, item.data)
        } else if (item.action === 'delete') {
          await cloudDb.deleteVocabularyCard(this.userId, item.id)
        }
        break

      case 'study-card':
        if (item.action === 'create' || item.action === 'update') {
          await cloudDb.syncStudyCard(this.userId, item.data)
        }
        break

      case 'deck':
        if (item.action === 'create' || item.action === 'update') {
          await cloudDb.syncDeck(this.userId, item.data)
        }
        break
    }
  }

  /**
   * Handle online event
   */
  private handleOnline = async () => {
    console.log('Connection restored')
    this.isOnline = true
    await this.processOfflineQueue()
  }

  /**
   * Handle offline event
   */
  private handleOffline = () => {
    console.log('Connection lost - queuing changes for later sync')
    this.isOnline = false
  }

  /**
   * Manually trigger sync
   */
  async syncNow(): Promise<void> {
    if (!this.userId || !this.isOnline) {
      throw new Error('Cannot sync: user not authenticated or offline')
    }

    console.log('Manual sync triggered')
    await this.performInitialSync()
  }

  /**
   * Get sync status
   */
  getSyncStatus(): {
    isOnline: boolean
    isSyncing: boolean
    queueLength: number
    userId: string | null
  } {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      queueLength: this.syncQueue.length,
      userId: this.userId,
    }
  }
}

// Create singleton instance
export const syncService = new SyncService()

// Export for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).syncService = syncService
}
