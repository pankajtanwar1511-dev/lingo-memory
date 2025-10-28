/**
 * Quiz-FSRS Integration
 * Updates FSRS card data based on quiz performance
 */

import { fsrs, Rating, FSRSCard } from "./fsrs"
import { QuizAnswer, QuizResult } from "@/types/quiz"
import { databaseService } from "@/services/database.service"

/**
 * Convert quiz answer to FSRS rating
 */
export function quizAnswerToFSRSRating(
  answer: QuizAnswer,
  perfectThreshold: number = 0
): Rating {
  if (!answer.isCorrect) {
    // Incorrect answer = Again (1)
    return Rating.Again
  }

  // Perfect answer (no hints, first try, fast)
  if (answer.hintsUsed === perfectThreshold && answer.attemptCount === 1) {
    if (answer.timeSpent < 5000) {
      // Less than 5 seconds
      return Rating.Easy
    }
    return Rating.Good
  }

  // Used hints or multiple attempts
  if (answer.hintsUsed > 0 || answer.attemptCount > 1) {
    return Rating.Hard
  }

  // Correct but slow
  if (answer.timeSpent > 15000) {
    // More than 15 seconds
    return Rating.Hard
  }

  return Rating.Good
}

/**
 * Update FSRS cards based on quiz results
 */
export async function updateFSRSFromQuizResult(result: QuizResult): Promise<void> {
  try {
    const updates: Array<{
      vocabularyId: string
      rating: Rating
      timestamp: Date
    }> = []

    // Process each answer
    for (let i = 0; i < result.answers.length; i++) {
      const answer = result.answers[i]
      const question = result.questions[i]

      if (!question || !question.card) continue

      const rating = quizAnswerToFSRSRating(answer)

      updates.push({
        vocabularyId: question.card.id,
        rating,
        timestamp: new Date(result.startedAt.getTime() + answer.timeSpent)
      })
    }

    // Get current study cards
    const studyCards = await databaseService.getStudyCards()

    // Update each card
    for (const update of updates) {
      const existingCard = studyCards.find(
        card => card.vocabularyId === update.vocabularyId
      )

      if (!existingCard) {
        // Create new study card
        const newCard: FSRSCard = fsrs.initCard()
        const updatedCard = fsrs.repeat(newCard, update.timestamp)[update.rating]

        await databaseService.updateStudyCard({
          ...updatedCard,
          vocabularyId: update.vocabularyId
        })
      } else {
        // Update existing card
        const fsrsCard: FSRSCard = {
          due: existingCard.due,
          stability: existingCard.stability,
          difficulty: existingCard.difficulty,
          elapsedDays: existingCard.elapsedDays,
          scheduledDays: existingCard.scheduledDays,
          reps: existingCard.reps,
          lapses: existingCard.lapses,
          state: existingCard.state,
          lastReview: existingCard.lastReview
        }

        const updatedCard = fsrs.repeat(fsrsCard, update.timestamp)[update.rating]

        await databaseService.updateStudyCard({
          ...existingCard,
          ...updatedCard
        })
      }
    }

    console.log(`Updated FSRS data for ${updates.length} cards`)
  } catch (error) {
    console.error("Failed to update FSRS from quiz:", error)
    throw error
  }
}

/**
 * Calculate quiz difficulty based on card FSRS data
 */
export function calculateQuizDifficulty(cards: FSRSCard[]): {
  easy: FSRSCard[]
  medium: FSRSCard[]
  hard: FSRSCard[]
} {
  return {
    easy: cards.filter(card => card.difficulty < 5),
    medium: cards.filter(card => card.difficulty >= 5 && card.difficulty < 7),
    hard: cards.filter(card => card.difficulty >= 7)
  }
}

/**
 * Get recommended cards for quiz based on FSRS
 */
export async function getRecommendedQuizCards(
  count: number = 20
): Promise<{
  dueCards: any[]
  newCards: any[]
  reviewCards: any[]
}> {
  const studyCards = await databaseService.getStudyCards()
  const now = new Date()

  // Separate cards by status
  const dueCards = studyCards.filter(card => card.due <= now)
  const newCards = studyCards.filter(card => card.reps === 0)
  const reviewCards = studyCards.filter(
    card => card.reps > 0 && card.due > now
  )

  return {
    dueCards: dueCards.slice(0, count),
    newCards: newCards.slice(0, Math.floor(count / 2)),
    reviewCards: reviewCards.slice(0, Math.floor(count / 4))
  }
}

/**
 * Calculate retention rate from quiz history
 */
export function calculateRetentionRate(results: QuizResult[]): number {
  if (results.length === 0) return 0

  const totalAnswers = results.reduce(
    (sum, result) => sum + result.answers.length,
    0
  )
  const correctAnswers = results.reduce(
    (sum, result) => sum + result.answers.filter(a => a.isCorrect).length,
    0
  )

  return totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0
}

/**
 * Suggest optimal quiz settings based on performance
 */
export function suggestQuizSettings(results: QuizResult[]): {
  recommendedDifficulty: "easy" | "medium" | "hard"
  recommendedQuestionCount: number
  recommendedTimeLimit: number | undefined
  reasoning: string
} {
  if (results.length === 0) {
    return {
      recommendedDifficulty: "medium",
      recommendedQuestionCount: 20,
      recommendedTimeLimit: 60,
      reasoning: "Starting with balanced settings"
    }
  }

  const recentResults = results.slice(-5) // Last 5 sessions
  const avgScore = recentResults.reduce((sum, r) => sum + r.score, 0) / recentResults.length
  const avgTime = recentResults.reduce((sum, r) => sum + r.averageTimePerQuestion, 0) / recentResults.length

  if (avgScore >= 85 && avgTime < 10000) {
    return {
      recommendedDifficulty: "hard",
      recommendedQuestionCount: 30,
      recommendedTimeLimit: 30,
      reasoning: "You're performing excellently! Try harder challenges."
    }
  }

  if (avgScore >= 70 && avgTime < 15000) {
    return {
      recommendedDifficulty: "medium",
      recommendedQuestionCount: 25,
      recommendedTimeLimit: 45,
      reasoning: "Good progress! Continue with current difficulty."
    }
  }

  return {
    recommendedDifficulty: "easy",
    recommendedQuestionCount: 15,
    recommendedTimeLimit: undefined,
    reasoning: "Focus on accuracy without time pressure."
  }
}
