import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { databaseService } from '@/services/database.service'
import { VocabularyCard } from '@/types/vocabulary'
import { StudyCard } from '@/store/study-store'
import useStudyStore from '@/store/study-store'
import { useAuth } from '@/contexts/auth-context'

/**
 * Get the current user ID for database operations
 * Returns authenticated user's ID or 'local-user' for offline mode
 */
export function useUserId(): string {
  const { user, isAuthenticated } = useAuth()
  return isAuthenticated && user ? user.uid : 'local-user'
}

// Global state to prevent multiple simultaneous initializations
let isInitializing = false
let initializationPromise: Promise<void> | null = null

export function useDatabase() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize database and sync with store
  useEffect(() => {
    const initDB = async () => {
      // Prevent multiple simultaneous initializations
      if (isInitializing && initializationPromise) {
        console.log('⏳ Database initialization already in progress, waiting...')
        await initializationPromise
        setIsInitialized(true)
        setIsLoading(false)
        return
      }

      if (isInitialized) {
        console.log('✅ Database already initialized, skipping...')
        return
      }

      // Mark as initializing and create promise
      isInitializing = true

      initializationPromise = (async () => {
        try {
          setIsLoading(true)
          setError(null)

          console.log('🚀 Starting database initialization...')

          // Initialize database with sample data if needed
          await databaseService.initializeDatabase()

          // Get data from IndexedDB
          const dbData = await databaseService.getDataForStore()

          // Update Zustand store with database data
          const store = useStudyStore.getState()

          // Only update if we have more data in DB than store
          if (dbData.studyCards.length > store.studyCards.length) {
            console.log(`📊 Updating store with ${dbData.studyCards.length} study cards from DB`)
            useStudyStore.setState({
              vocabulary: dbData.vocabulary,
              studyCards: dbData.studyCards
            })
          } else if (store.studyCards.length > 0 && store.studyCards.length > dbData.studyCards.length) {
            // Sync store data to DB ONLY if store has MORE data
            console.log(`📤 Syncing ${store.studyCards.length} study cards from store to DB`)
            await databaseService.syncFromStore({
              vocabulary: store.vocabulary,
              studyCards: store.studyCards
            })
          } else {
            console.log('✅ Database and store are in sync')
          }

          setIsInitialized(true)
          console.log('✅ Database initialization complete!')
        } catch (err) {
          console.error('❌ Database initialization error:', err)
          setError(err instanceof Error ? err.message : 'Failed to initialize database')
          throw err
        } finally {
          setIsLoading(false)
          isInitializing = false
          initializationPromise = null
        }
      })()

      await initializationPromise
    }

    initDB()
  }, [])

  // Subscribe to study card updates and sync to DB
  useEffect(() => {
    let previousStudyCards = useStudyStore.getState().studyCards

    const unsubscribe = useStudyStore.subscribe(
      (state) => {
        if (isInitialized && state.studyCards !== previousStudyCards) {
          previousStudyCards = state.studyCards
          // Debounce to avoid too many writes
          setTimeout(() => {
            databaseService.bulkUpdateStudyCards(state.studyCards).catch(console.error)
          }, 1000)
        }
      }
    )

    return unsubscribe
  }, [isInitialized])

  return {
    isInitialized,
    isLoading,
    error
  }
}

// Hook for live vocabulary query
export function useLiveVocabulary(deckId?: string) {
  return useLiveQuery(
    async () => {
      if (deckId) {
        return await db.getDeckCards(deckId)
      }
      return await db.vocabulary.toArray()
    },
    [deckId],
    []
  )
}

// Hook for live study cards query
export function useLiveStudyCards(userId?: string) {
  const currentUserId = useUserId()
  const effectiveUserId = userId ?? currentUserId

  return useLiveQuery(
    async () => {
      return await db.getUserStudyCards(effectiveUserId)
    },
    [effectiveUserId],
    []
  )
}

// Hook for live due cards
export function useLiveDueCards(userId?: string, limit?: number) {
  const currentUserId = useUserId()
  const effectiveUserId = userId ?? currentUserId

  return useLiveQuery(
    async () => {
      return await db.getDueCards(effectiveUserId, limit)
    },
    [effectiveUserId, limit],
    []
  )
}

// Hook for database stats
export function useDatabaseStats() {
  const [stats, setStats] = useState({
    totalCards: 0,
    totalDecks: 0,
    studyCards: 0,
    sessions: 0,
    storageUsed: '0 KB'
  })

  useEffect(() => {
    const updateStats = async () => {
      const dbStats = await databaseService.getStatistics()

      // Estimate storage usage
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate()
        const usage = estimate.usage || 0
        const storageUsed =
          usage < 1024 ? `${usage} B` :
          usage < 1024 * 1024 ? `${(usage / 1024).toFixed(1)} KB` :
          `${(usage / (1024 * 1024)).toFixed(1)} MB`

        setStats({
          ...dbStats,
          storageUsed
        })
      } else {
        setStats({
          ...dbStats,
          storageUsed: 'N/A'
        })
      }
    }

    updateStats()
    const interval = setInterval(updateStats, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return stats
}

// Hook for live decks query
export function useLiveDecks(userId?: string) {
  const currentUserId = useUserId()
  const effectiveUserId = userId ?? currentUserId

  return useLiveQuery(
    async () => {
      return await db.decks.where('userId').equals(effectiveUserId).toArray()
    },
    [effectiveUserId],
    []
  )
}

// Hook for live vocabulary with filters
export function useLiveVocabularyFiltered(
  jlptLevel?: string,
  deckId?: string
) {
  return useLiveQuery(
    async () => {
      let query = db.vocabulary.toCollection()

      if (deckId) {
        query = db.vocabulary.where('deckId').equals(deckId)
      }

      const cards = await query.toArray()

      if (jlptLevel) {
        return cards.filter(card => card.jlptLevel === jlptLevel)
      }

      return cards
    },
    [jlptLevel, deckId],
    []
  )
}

// Export/Import functions
export async function exportDatabase(): Promise<void> {
  try {
    const data = await databaseService.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `japvocab-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export failed:', error)
    throw error
  }
}

export async function importDatabase(file: File): Promise<void> {
  try {
    const text = await file.text()
    await databaseService.importData(text)

    // Reload data to store
    const dbData = await databaseService.getDataForStore()
    useStudyStore.setState({
      vocabulary: dbData.vocabulary,
      studyCards: dbData.studyCards
    })
  } catch (error) {
    console.error('Import failed:', error)
    throw error
  }
}