/**
 * Quiz Store - Zustand state management for quiz sessions
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  QuizSession,
  QuizQuestion,
  QuizAnswer,
  QuizSettings,
  QuizResult,
  QuizProgress,
  QuizStatistics,
  IncorrectQuestionDetail
} from "@/types/quiz"
import { VocabularyCard } from "@/types/vocabulary"
import { KanjiCard } from "@/types/kanji"
import { generateQuizQuestions } from "@/lib/quiz-generator"
import { updateFSRSFromQuizResult } from "@/lib/quiz-fsrs-integration"
import { useCardStatsStore } from "./card-stats-store"

interface QuizStore {
  // Current session
  currentSession: QuizSession | null
  currentQuestionIndex: number

  // Statistics
  statistics: QuizStatistics

  // Session history
  sessionHistory: QuizResult[]

  // Actions
  startQuiz: (cards: (VocabularyCard | KanjiCard)[], settings: QuizSettings, allCards: (VocabularyCard | KanjiCard)[]) => void
  startReviewQuiz: (incorrectDetails: IncorrectQuestionDetail[], originalSettings: QuizSettings) => void
  answerQuestion: (answer: string, timeSpent: number, hintsUsed: number) => void
  skipQuestion: () => void
  nextQuestion: () => void
  previousQuestion: () => void
  pauseQuiz: () => void
  resumeQuiz: () => void
  endQuiz: () => QuizResult | null
  abandonQuiz: () => void
  retryQuiz: () => void

  // Progress
  getProgress: () => QuizProgress | null
  getCurrentQuestion: () => QuizQuestion | null

  // History
  getSessionResult: (sessionId: string) => QuizResult | null
  clearHistory: () => void

  // Statistics
  updateStatistics: (result: QuizResult) => void
  resetStatistics: () => void
}

const initialStatistics: QuizStatistics = {
  totalSessions: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  totalIncorrect: 0,
  averageScore: 0,
  averageAccuracy: 0,
  bestScore: 0,
  worstScore: 100,
  totalTimeSpent: 0,
  averageTimePerQuestion: 0,
  favoriteMode: "multiple-choice",
  favoriteDirection: "japanese-to-english",
  sessionHistory: [],
  streakCurrent: 0,
  streakBest: 0,
  lastSessionDate: null
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      currentQuestionIndex: 0,
      statistics: initialStatistics,
      sessionHistory: [],

      startQuiz: (cards, settings, allCards) => {
        const questions = generateQuizQuestions(cards, settings, allCards)
        const sessionId = `quiz_${Date.now()}`

        const session: QuizSession = {
          id: sessionId,
          settings,
          questions,
          answers: [],
          progress: {
            currentQuestionIndex: 0,
            totalQuestions: questions.length,
            answeredCount: 0,
            correctCount: 0,
            startTime: new Date(),
            elapsedTime: 0,
            isPaused: false
          },
          startedAt: new Date(),
          status: "in-progress"
        }

        set({
          currentSession: session,
          currentQuestionIndex: 0
        })
      },

      startReviewQuiz: (incorrectDetails, originalSettings) => {
        // Use the questions from incorrect answers directly
        const questions = incorrectDetails.map(detail => detail.question)
        const sessionId = `review_${Date.now()}`

        const session: QuizSession = {
          id: sessionId,
          settings: originalSettings,
          questions,
          answers: [],
          progress: {
            currentQuestionIndex: 0,
            totalQuestions: questions.length,
            answeredCount: 0,
            correctCount: 0,
            startTime: new Date(),
            elapsedTime: 0,
            isPaused: false
          },
          startedAt: new Date(),
          status: "in-progress"
        }

        set({
          currentSession: session,
          currentQuestionIndex: 0
        })
      },

      answerQuestion: (answer, timeSpent, hintsUsed) => {
        const { currentSession, currentQuestionIndex } = get()
        if (!currentSession || !currentSession.questions[currentQuestionIndex]) {
          return
        }

        const question = currentSession.questions[currentQuestionIndex]
        const correctAnswers = Array.isArray(question.correctAnswer)
          ? question.correctAnswer
          : [question.correctAnswer]

        // Check if answer is correct
        const isCorrect = correctAnswers.some(
          correct =>
            answer.trim().toLowerCase() === correct.trim().toLowerCase()
        )

        const quizAnswer: QuizAnswer = {
          questionId: question.id,
          userAnswer: answer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          timeSpent,
          hintsUsed,
          attemptCount: 1
        }

        const updatedAnswers = [...currentSession.answers, quizAnswer]
        const answeredCount = updatedAnswers.length
        const correctCount = updatedAnswers.filter(a => a.isCorrect).length

        // Record card statistics
        useCardStatsStore.getState().recordAttempt(
          question.card.id,
          question.contentType,
          isCorrect,
          timeSpent
        )

        set({
          currentSession: {
            ...currentSession,
            answers: updatedAnswers,
            progress: {
              ...currentSession.progress,
              answeredCount,
              correctCount,
              elapsedTime: Date.now() - currentSession.startedAt.getTime()
            }
          }
        })

        // Auto-advance if enabled
        if (currentSession.settings.autoAdvance) {
          setTimeout(() => {
            get().nextQuestion()
          }, 1500)
        }
      },

      skipQuestion: () => {
        const { currentSession, currentQuestionIndex } = get()
        if (!currentSession || !currentSession.questions[currentQuestionIndex]) {
          return
        }

        const question = currentSession.questions[currentQuestionIndex]

        const quizAnswer: QuizAnswer = {
          questionId: question.id,
          userAnswer: "",
          correctAnswer: question.correctAnswer,
          isCorrect: false,
          timeSpent: 0,
          hintsUsed: 0,
          attemptCount: 0
        }

        const updatedAnswers = [...currentSession.answers, quizAnswer]

        set({
          currentSession: {
            ...currentSession,
            answers: updatedAnswers,
            progress: {
              ...currentSession.progress,
              answeredCount: updatedAnswers.length,
              elapsedTime: Date.now() - currentSession.startedAt.getTime()
            }
          }
        })

        get().nextQuestion()
      },

      nextQuestion: () => {
        const { currentSession, currentQuestionIndex } = get()
        if (!currentSession) return

        const nextIndex = currentQuestionIndex + 1

        if (nextIndex >= currentSession.questions.length) {
          // Quiz completed
          get().endQuiz()
        } else {
          set({ currentQuestionIndex: nextIndex })
        }
      },

      previousQuestion: () => {
        const { currentQuestionIndex } = get()
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 })
        }
      },

      pauseQuiz: () => {
        const { currentSession } = get()
        if (!currentSession) return

        set({
          currentSession: {
            ...currentSession,
            progress: {
              ...currentSession.progress,
              isPaused: true
            }
          }
        })
      },

      resumeQuiz: () => {
        const { currentSession } = get()
        if (!currentSession) return

        set({
          currentSession: {
            ...currentSession,
            progress: {
              ...currentSession.progress,
              isPaused: false
            }
          }
        })
      },

      endQuiz: () => {
        const { currentSession } = get()
        if (!currentSession) return null

        const completedAt = new Date()
        const totalTime = completedAt.getTime() - currentSession.startedAt.getTime()

        const correctAnswers = currentSession.answers.filter(a => a.isCorrect).length
        const incorrectAnswers = currentSession.answers.filter(
          a => !a.isCorrect && a.userAnswer !== ""
        ).length
        const skippedAnswers = currentSession.answers.filter(
          a => a.userAnswer === ""
        ).length

        const answeredQuestions = currentSession.answers.filter(
          a => a.userAnswer !== ""
        ).length

        const score = (correctAnswers / currentSession.questions.length) * 100
        const accuracy =
          answeredQuestions > 0
            ? (correctAnswers / answeredQuestions) * 100
            : 0

        const averageTimePerQuestion =
          currentSession.answers.length > 0
            ? currentSession.answers.reduce((sum, a) => sum + a.timeSpent, 0) /
              currentSession.answers.length
            : 0

        // Build incorrect question details
        const incorrectQuestionDetails = currentSession.answers
          .map((answer, index) => {
            if (!answer.isCorrect && answer.userAnswer !== "") {
              return {
                question: currentSession.questions[index],
                userAnswer: answer.userAnswer,
                correctAnswer: answer.correctAnswer,
                timeSpent: answer.timeSpent,
                hintsUsed: answer.hintsUsed
              }
            }
            return null
          })
          .filter((detail): detail is NonNullable<typeof detail> => detail !== null)

        const result: QuizResult = {
          sessionId: currentSession.id,
          startedAt: currentSession.startedAt,
          completedAt,
          settings: currentSession.settings,
          questions: currentSession.questions,
          answers: currentSession.answers,
          score,
          accuracy,
          totalTime,
          averageTimePerQuestion,
          perfectAnswers: currentSession.answers.filter(
            a => a.isCorrect && a.hintsUsed === 0 && a.attemptCount === 1
          ).length,
          correctAnswers,
          incorrectAnswers,
          skippedAnswers,
          incorrectQuestionDetails
        }

        // Update statistics
        get().updateStatistics(result)

        // Update FSRS data asynchronously
        updateFSRSFromQuizResult(result).catch(err => {
          console.error("Failed to update FSRS from quiz:", err)
        })

        // Add to history
        set(state => ({
          sessionHistory: [...state.sessionHistory, result],
          currentSession: {
            ...currentSession,
            status: "completed"
          }
        }))

        return result
      },

      abandonQuiz: () => {
        const { currentSession } = get()
        if (!currentSession) return

        set({
          currentSession: {
            ...currentSession,
            status: "abandoned"
          }
        })
      },

      retryQuiz: () => {
        const { currentSession } = get()
        if (!currentSession) return

        // Start new quiz with same settings and cards
        const cards = currentSession.questions.map(q => q.card)
        get().startQuiz(cards, currentSession.settings, cards)
      },

      getProgress: () => {
        const { currentSession } = get()
        return currentSession?.progress || null
      },

      getCurrentQuestion: () => {
        const { currentSession, currentQuestionIndex } = get()
        if (!currentSession) return null
        return currentSession.questions[currentQuestionIndex] || null
      },

      getSessionResult: (sessionId) => {
        const { sessionHistory } = get()
        return sessionHistory.find(r => r.sessionId === sessionId) || null
      },

      clearHistory: () => {
        set({ sessionHistory: [] })
      },

      updateStatistics: (result) => {
        const { statistics } = get()

        const totalSessions = statistics.totalSessions + 1
        const totalQuestions = statistics.totalQuestions + result.questions.length
        const totalCorrect = statistics.totalCorrect + result.correctAnswers
        const totalIncorrect = statistics.totalIncorrect + result.incorrectAnswers

        const averageScore =
          (statistics.averageScore * statistics.totalSessions + result.score) /
          totalSessions

        const totalAnswered = totalCorrect + totalIncorrect
        const averageAccuracy = totalAnswered > 0
          ? (totalCorrect / totalAnswered) * 100
          : 0

        const bestScore = Math.max(statistics.bestScore, result.score)
        const worstScore = Math.min(statistics.worstScore, result.score)

        const totalTimeSpent = statistics.totalTimeSpent + result.totalTime
        const averageTimePerQuestion =
          (statistics.averageTimePerQuestion * statistics.totalQuestions +
            result.averageTimePerQuestion * result.questions.length) /
          totalQuestions

        // Update streak
        const today = new Date().toDateString()
        const lastDate = statistics.lastSessionDate
          ? new Date(statistics.lastSessionDate).toDateString()
          : null

        let streakCurrent = statistics.streakCurrent
        if (lastDate === today) {
          // Same day, streak continues
        } else if (lastDate && isYesterday(new Date(lastDate))) {
          // Consecutive day
          streakCurrent++
        } else {
          // Streak broken
          streakCurrent = 1
        }

        const streakBest = Math.max(statistics.streakBest, streakCurrent)

        set({
          statistics: {
            ...statistics,
            totalSessions,
            totalQuestions,
            totalCorrect,
            totalIncorrect,
            averageScore,
            averageAccuracy,
            bestScore,
            worstScore,
            totalTimeSpent,
            averageTimePerQuestion,
            favoriteMode: result.settings.mode,
            favoriteDirection: result.settings.direction,
            streakCurrent,
            streakBest,
            lastSessionDate: new Date()
          }
        })
      },

      resetStatistics: () => {
        set({ statistics: initialStatistics })
      }
    }),
    {
      name: "quiz-storage",
      partialize: (state) => ({
        statistics: state.statistics,
        sessionHistory: state.sessionHistory.slice(-50) // Keep last 50 sessions
      })
    }
  )
)

/**
 * Check if a date is yesterday
 */
function isYesterday(date: Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return date.toDateString() === yesterday.toDateString()
}
