/**
 * Daily Goals Store - Track daily quiz completion goals
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface DailyGoal {
  questionsGoal: number // Daily target for questions answered
  quizzesGoal: number // Daily target for quizzes completed
  accuracyGoal: number // Target accuracy percentage
}

export interface DailyProgress {
  date: string // YYYY-MM-DD
  questionsAnswered: number
  quizzesCompleted: number
  averageAccuracy: number
  goalMet: boolean
}

interface GoalsStore {
  // Current goals
  dailyGoal: DailyGoal

  // Today's progress
  todayProgress: DailyProgress | null

  // History of daily progress
  progressHistory: DailyProgress[]

  // Actions
  setDailyGoal: (goal: Partial<DailyGoal>) => void
  recordQuizCompletion: (questionsAnswered: number, accuracy: number) => void
  getTodayProgress: () => DailyProgress
  getProgressForDate: (date: string) => DailyProgress | null
  getStreak: () => number
  resetTodayProgress: () => void
  clearHistory: () => void
}

const DEFAULT_GOAL: DailyGoal = {
  questionsGoal: 20,
  quizzesGoal: 1,
  accuracyGoal: 70
}

function getTodayDateString(): string {
  const today = new Date()
  return today.toISOString().split("T")[0]
}

function createEmptyProgress(date: string): DailyProgress {
  return {
    date,
    questionsAnswered: 0,
    quizzesCompleted: 0,
    averageAccuracy: 0,
    goalMet: false
  }
}

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set, get) => ({
      dailyGoal: DEFAULT_GOAL,
      todayProgress: null,
      progressHistory: [],

      setDailyGoal: (goal) => {
        set((state) => ({
          dailyGoal: {
            ...state.dailyGoal,
            ...goal
          }
        }))
      },

      recordQuizCompletion: (questionsAnswered, accuracy) => {
        const today = getTodayDateString()
        const { dailyGoal } = get()

        set((state) => {
          // Get or create today's progress
          let todayProgress = state.todayProgress

          // Reset if it's a new day
          if (!todayProgress || todayProgress.date !== today) {
            todayProgress = createEmptyProgress(today)
          }

          // Update progress
          const newQuestionsTotal = todayProgress.questionsAnswered + questionsAnswered
          const newQuizzesTotal = todayProgress.quizzesCompleted + 1

          // Calculate new average accuracy
          const previousTotal = todayProgress.averageAccuracy * todayProgress.quizzesCompleted
          const newAverage = (previousTotal + accuracy) / newQuizzesTotal

          const updatedProgress: DailyProgress = {
            date: today,
            questionsAnswered: newQuestionsTotal,
            quizzesCompleted: newQuizzesTotal,
            averageAccuracy: newAverage,
            goalMet:
              newQuestionsTotal >= dailyGoal.questionsGoal &&
              newQuizzesTotal >= dailyGoal.quizzesGoal &&
              newAverage >= dailyGoal.accuracyGoal
          }

          // Update history
          const historyWithoutToday = state.progressHistory.filter(
            (p) => p.date !== today
          )
          const newHistory = [...historyWithoutToday, updatedProgress]
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 90) // Keep last 90 days

          return {
            todayProgress: updatedProgress,
            progressHistory: newHistory
          }
        })
      },

      getTodayProgress: () => {
        const today = getTodayDateString()
        const { todayProgress } = get()

        if (!todayProgress || todayProgress.date !== today) {
          return createEmptyProgress(today)
        }

        return todayProgress
      },

      getProgressForDate: (date) => {
        const { progressHistory, todayProgress } = get()

        if (todayProgress && todayProgress.date === date) {
          return todayProgress
        }

        return progressHistory.find((p) => p.date === date) || null
      },

      getStreak: () => {
        const { progressHistory } = get()
        const today = getTodayDateString()

        let streak = 0
        let currentDate = new Date()

        // Start from today and go backwards
        for (let i = 0; i < 365; i++) {
          const dateString = currentDate.toISOString().split("T")[0]
          const progress = get().getProgressForDate(dateString)

          if (progress && progress.goalMet) {
            streak++
          } else if (dateString !== today) {
            // If it's not today and goal not met, streak is broken
            break
          }

          // Go to previous day
          currentDate.setDate(currentDate.getDate() - 1)
        }

        return streak
      },

      resetTodayProgress: () => {
        const today = getTodayDateString()
        set({
          todayProgress: createEmptyProgress(today)
        })
      },

      clearHistory: () => {
        set({
          progressHistory: [],
          todayProgress: null
        })
      }
    }),
    {
      name: "goals-storage",
      partialize: (state) => ({
        dailyGoal: state.dailyGoal,
        todayProgress: state.todayProgress,
        progressHistory: state.progressHistory.slice(0, 90) // Keep last 90 days
      })
    }
  )
)
