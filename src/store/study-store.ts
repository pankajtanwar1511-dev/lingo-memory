import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { VocabularyCard } from '@/types/vocabulary'
import { FSRSCard, Rating, fsrs, CardState } from '@/lib/fsrs'
import { sampleN5Deck } from '@/data/sample-n5-deck'

export interface StudyCard extends FSRSCard {
  vocabularyId: string
}

export interface StudySession {
  id: string
  startedAt: Date
  completedAt?: Date
  cardsStudied: number
  correctCount: number
  mode: 'review' | 'learn' | 'cram'
}

export interface StudyStats {
  totalReviews: number
  streakDays: number
  cardsLearned: number
  retention: number
  todayReviews: number
  todayMinutes: number
  lastStudyDate?: Date
}

export interface StudyPreferences {
  showGeneratedExamples: boolean
  showAuthenticExamples: boolean
  showNeedsReview: boolean
}

interface StudyStore {
  // Cards data
  vocabulary: VocabularyCard[]
  studyCards: StudyCard[]

  // Current session
  currentSession: StudySession | null
  currentCard: StudyCard | null
  queue: StudyCard[]

  // Stats
  stats: StudyStats

  // Preferences
  preferences: StudyPreferences

  // Actions
  loadVocabulary: (cards: VocabularyCard[]) => void
  initializeCards: () => void
  getNextCard: () => StudyCard | null
  gradeCard: (rating: Rating) => void
  startSession: (mode: 'review' | 'learn' | 'cram') => void
  endSession: () => void
  getDueCards: () => StudyCard[]
  getNewCards: (limit?: number) => StudyCard[]
  updateStats: () => void
  resetProgress: () => void
  updatePreferences: (prefs: Partial<StudyPreferences>) => void
}

const useStudyStore = create<StudyStore>()(
  persist(
    (set, get) => ({
      // Initial state
      vocabulary: sampleN5Deck,
      studyCards: [],
      currentSession: null,
      currentCard: null,
      queue: [],
      stats: {
        totalReviews: 0,
        streakDays: 0,
        cardsLearned: 0,
        retention: 0,
        todayReviews: 0,
        todayMinutes: 0,
        lastStudyDate: undefined
      },
      preferences: {
        showGeneratedExamples: true,
        showAuthenticExamples: true,
        showNeedsReview: true
      },

      // Load vocabulary from database
      loadVocabulary: (cards: VocabularyCard[]) => {
        set({ vocabulary: cards })
        // Auto-initialize study cards for new vocabulary
        get().initializeCards()
      },

      // Initialize cards (create FSRS cards for vocabulary)
      initializeCards: () => {
        const { vocabulary, studyCards } = get()

        // Create study cards for vocabulary items that don't have them yet
        const existingIds = new Set(studyCards.map(c => c.vocabularyId))
        const newStudyCards = vocabulary
          .filter(v => !existingIds.has(v.id))
          .map(v => ({
            ...fsrs.initCard(),
            vocabularyId: v.id
          }))

        set({
          studyCards: [...studyCards, ...newStudyCards]
        })
      },

      // Get due cards for review
      getDueCards: () => {
        const { studyCards } = get()
        const now = new Date()
        return studyCards.filter(card =>
          card.due <= now && card.state !== CardState.New
        )
      },

      // Get new cards to learn
      getNewCards: (limit = 5) => {
        const { studyCards } = get()
        return studyCards
          .filter(card => card.state === CardState.New)
          .slice(0, limit)
      },

      // Start a study session
      startSession: (mode) => {
        const { getDueCards, getNewCards, studyCards } = get()

        let queue: StudyCard[] = []

        if (mode === 'review') {
          // Review mode: due cards + some new cards
          queue = [...getDueCards(), ...getNewCards(5)]
        } else if (mode === 'learn') {
          // Learn mode: only new cards
          queue = getNewCards(20)
        } else if (mode === 'cram') {
          // Cram mode: all cards shuffled
          queue = [...studyCards].sort(() => Math.random() - 0.5).slice(0, 30)
        }

        const session: StudySession = {
          id: Date.now().toString(),
          startedAt: new Date(),
          cardsStudied: 0,
          correctCount: 0,
          mode
        }

        set({
          currentSession: session,
          queue,
          currentCard: queue[0] || null
        })
      },

      // Get next card from queue
      getNextCard: () => {
        const { queue } = get()
        const nextCard = queue[0] || null

        set({
          currentCard: nextCard,
          queue: queue.slice(1)
        })

        return nextCard
      },

      // Grade current card
      gradeCard: (rating: Rating) => {
        const { currentCard, studyCards, currentSession, stats } = get()

        if (!currentCard || !currentSession) return

        // Apply FSRS algorithm
        const updatedFSRSCard = fsrs.reviewCard(currentCard, rating, new Date())

        // Preserve vocabularyId when updating
        const updatedCard: StudyCard = {
          ...updatedFSRSCard,
          vocabularyId: currentCard.vocabularyId
        }

        // Update the card in the study cards array
        const updatedStudyCards = studyCards.map(card =>
          card.vocabularyId === currentCard.vocabularyId ? updatedCard : card
        )

        // Update session stats
        const updatedSession = {
          ...currentSession,
          cardsStudied: currentSession.cardsStudied + 1,
          correctCount: rating >= Rating.Good
            ? currentSession.correctCount + 1
            : currentSession.correctCount
        }

        // Update global stats
        const updatedStats = {
          ...stats,
          totalReviews: stats.totalReviews + 1,
          todayReviews: stats.todayReviews + 1,
          cardsLearned: updatedCard.state === CardState.Review
            ? stats.cardsLearned + (currentCard.state === CardState.New ? 1 : 0)
            : stats.cardsLearned
        }

        set({
          studyCards: updatedStudyCards,
          currentSession: updatedSession,
          stats: updatedStats
        })

        // Get next card
        get().getNextCard()
      },

      // End current session
      endSession: () => {
        const { currentSession, stats } = get()

        if (!currentSession) return

        // Convert startedAt to Date object if it's a string (from localStorage)
        const startedAt = currentSession.startedAt instanceof Date
          ? currentSession.startedAt
          : new Date(currentSession.startedAt)

        const sessionDuration = (new Date().getTime() - startedAt.getTime()) / 60000 // minutes

        set({
          currentSession: null,
          currentCard: null,
          queue: [],
          stats: {
            ...stats,
            todayMinutes: stats.todayMinutes + sessionDuration,
            lastStudyDate: new Date()
          }
        })
      },

      // Update daily stats
      updateStats: () => {
        const { stats, studyCards } = get()
        const today = new Date()
        // Convert lastStudyDate to Date object if it's a string (from localStorage)
        const lastDate = stats.lastStudyDate
          ? (stats.lastStudyDate instanceof Date
              ? stats.lastStudyDate
              : new Date(stats.lastStudyDate))
          : null

        // Reset daily stats if it's a new day
        if (!lastDate ||
            lastDate.toDateString() !== today.toDateString()) {

          // Update streak
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)

          const newStreak = lastDate && lastDate.toDateString() === yesterday.toDateString()
            ? stats.streakDays + 1
            : stats.todayReviews > 0 ? 1 : 0

          // Calculate retention (cards due vs cards that would be forgotten)
          const dueCards = studyCards.filter(c => c.due <= today && c.reps > 0)
          const retention = dueCards.length > 0
            ? (dueCards.filter(c => c.lapses === 0).length / dueCards.length) * 100
            : 100

          set({
            stats: {
              ...stats,
              streakDays: newStreak,
              todayReviews: 0,
              todayMinutes: 0,
              retention,
              lastStudyDate: today
            }
          })
        }
      },

      // Reset all progress
      resetProgress: () => {
        const { vocabulary } = get()
        const freshCards = vocabulary.map(v => ({
          ...fsrs.initCard(),
          vocabularyId: v.id
        }))

        set({
          studyCards: freshCards,
          currentSession: null,
          currentCard: null,
          queue: [],
          stats: {
            totalReviews: 0,
            streakDays: 0,
            cardsLearned: 0,
            retention: 0,
            todayReviews: 0,
            todayMinutes: 0,
            lastStudyDate: undefined
          }
        })
      },

      // Update preferences
      updatePreferences: (prefs: Partial<StudyPreferences>) => {
        set({
          preferences: {
            ...get().preferences,
            ...prefs
          }
        })
      }
    }),
    {
      name: 'lingomemory-study-store',
      partialize: (state) => ({
        studyCards: state.studyCards,
        stats: state.stats,
        preferences: state.preferences
      }),
      // Custom storage with date deserialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null

          const { state } = JSON.parse(str)

          // Convert date strings back to Date objects
          if (state.studyCards) {
            state.studyCards = state.studyCards.map((card: any) => ({
              ...card,
              due: card.due ? new Date(card.due) : new Date()
            }))
          }

          if (state.stats?.lastStudyDate) {
            state.stats.lastStudyDate = new Date(state.stats.lastStudyDate)
          }

          return { state }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        }
      }
    }
  )
)

export default useStudyStore