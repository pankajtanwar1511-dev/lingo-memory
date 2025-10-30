/**
 * Card Statistics Store - Track performance for individual cards
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CardStatistics {
  cardId: string
  contentType: "vocabulary" | "kanji"
  totalAttempts: number
  correctAttempts: number
  incorrectAttempts: number
  totalTimeMs: number // Total time spent on this card
  lastReviewedAt: Date
  firstReviewedAt: Date
  averageTimeMs: number
  accuracy: number // 0-100
  streak: number // Current correct streak
  bestStreak: number // Best correct streak ever
}

interface CardStatsStore {
  // Statistics by card ID
  stats: Map<string, CardStatistics>

  // Actions
  recordAttempt: (
    cardId: string,
    contentType: "vocabulary" | "kanji",
    isCorrect: boolean,
    timeSpentMs: number
  ) => void

  getCardStats: (cardId: string) => CardStatistics | undefined
  getAllStats: () => CardStatistics[]
  getStatsByContentType: (contentType: "vocabulary" | "kanji") => CardStatistics[]

  // Analysis
  getWeakestCards: (limit: number, contentType?: "vocabulary" | "kanji") => CardStatistics[]
  getStrongestCards: (limit: number, contentType?: "vocabulary" | "kanji") => CardStatistics[]
  getMostPracticedCards: (limit: number, contentType?: "vocabulary" | "kanji") => CardStatistics[]

  // Utility
  clearAllStats: () => void
  clearCardStats: (cardId: string) => void
}

export const useCardStatsStore = create<CardStatsStore>()(
  persist(
    (set, get) => ({
      stats: new Map<string, CardStatistics>(),

      recordAttempt: (cardId, contentType, isCorrect, timeSpentMs) => {
        set((state) => {
          const newStats = new Map(state.stats)
          const existing = newStats.get(cardId)
          const now = new Date()

          if (existing) {
            // Update existing stats
            const totalAttempts = existing.totalAttempts + 1
            const correctAttempts = existing.correctAttempts + (isCorrect ? 1 : 0)
            const incorrectAttempts = existing.incorrectAttempts + (isCorrect ? 0 : 1)
            const totalTimeMs = existing.totalTimeMs + timeSpentMs
            const averageTimeMs = totalTimeMs / totalAttempts
            const accuracy = (correctAttempts / totalAttempts) * 100
            const streak = isCorrect ? existing.streak + 1 : 0
            const bestStreak = Math.max(existing.bestStreak, streak)

            newStats.set(cardId, {
              ...existing,
              totalAttempts,
              correctAttempts,
              incorrectAttempts,
              totalTimeMs,
              averageTimeMs,
              accuracy,
              lastReviewedAt: now,
              streak,
              bestStreak
            })
          } else {
            // Create new stats
            newStats.set(cardId, {
              cardId,
              contentType,
              totalAttempts: 1,
              correctAttempts: isCorrect ? 1 : 0,
              incorrectAttempts: isCorrect ? 0 : 1,
              totalTimeMs: timeSpentMs,
              averageTimeMs: timeSpentMs,
              accuracy: isCorrect ? 100 : 0,
              lastReviewedAt: now,
              firstReviewedAt: now,
              streak: isCorrect ? 1 : 0,
              bestStreak: isCorrect ? 1 : 0
            })
          }

          return { stats: newStats }
        })
      },

      getCardStats: (cardId) => {
        return get().stats.get(cardId)
      },

      getAllStats: () => {
        return Array.from(get().stats.values())
      },

      getStatsByContentType: (contentType) => {
        return Array.from(get().stats.values()).filter(
          (stat) => stat.contentType === contentType
        )
      },

      getWeakestCards: (limit, contentType) => {
        let stats = Array.from(get().stats.values())

        if (contentType) {
          stats = stats.filter((stat) => stat.contentType === contentType)
        }

        // Sort by accuracy (ascending) and total attempts (descending for ties)
        return stats
          .filter((stat) => stat.totalAttempts >= 3) // Minimum 3 attempts
          .sort((a, b) => {
            if (a.accuracy === b.accuracy) {
              return b.totalAttempts - a.totalAttempts
            }
            return a.accuracy - b.accuracy
          })
          .slice(0, limit)
      },

      getStrongestCards: (limit, contentType) => {
        let stats = Array.from(get().stats.values())

        if (contentType) {
          stats = stats.filter((stat) => stat.contentType === contentType)
        }

        // Sort by accuracy (descending) and streak (descending for ties)
        return stats
          .filter((stat) => stat.totalAttempts >= 3) // Minimum 3 attempts
          .sort((a, b) => {
            if (a.accuracy === b.accuracy) {
              return b.bestStreak - a.bestStreak
            }
            return b.accuracy - a.accuracy
          })
          .slice(0, limit)
      },

      getMostPracticedCards: (limit, contentType) => {
        let stats = Array.from(get().stats.values())

        if (contentType) {
          stats = stats.filter((stat) => stat.contentType === contentType)
        }

        return stats
          .sort((a, b) => b.totalAttempts - a.totalAttempts)
          .slice(0, limit)
      },

      clearAllStats: () => {
        set({ stats: new Map() })
      },

      clearCardStats: (cardId) => {
        set((state) => {
          const newStats = new Map(state.stats)
          newStats.delete(cardId)
          return { stats: newStats }
        })
      }
    }),
    {
      name: "card-stats-storage",
      // Custom storage to handle Map serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const { state } = JSON.parse(str)

          // Convert stored array back to Map
          const statsArray = state.stats || []
          const statsMap = new Map(
            statsArray.map((stat: CardStatistics) => [stat.cardId, {
              ...stat,
              lastReviewedAt: new Date(stat.lastReviewedAt),
              firstReviewedAt: new Date(stat.firstReviewedAt)
            }])
          )

          return {
            state: {
              stats: statsMap
            }
          }
        },
        setItem: (name, value) => {
          // Convert Map to array for storage
          const statsArray = Array.from(value.state.stats.values())
          const str = JSON.stringify({
            state: {
              stats: statsArray
            }
          })
          localStorage.setItem(name, str)
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
)
