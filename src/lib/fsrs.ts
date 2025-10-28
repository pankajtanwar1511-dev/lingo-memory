/**
 * FSRS (Free Spaced Repetition Scheduler) Algorithm Implementation
 * Based on: https://github.com/open-spaced-repetition/free-spaced-repetition-scheduler
 *
 * This algorithm is more accurate than SM-2 and provides better retention rates
 */

export interface FSRSCard {
  due: Date
  stability: number
  difficulty: number
  elapsedDays: number
  scheduledDays: number
  reps: number
  lapses: number
  state: CardState
  lastReview?: Date
}

export enum CardState {
  New = 0,
  Learning = 1,
  Review = 2,
  Relearning = 3
}

export enum Rating {
  Again = 1,
  Hard = 2,
  Good = 3,
  Easy = 4
}

export interface FSRSParameters {
  requestRetention: number
  maximumInterval: number
  w: number[]
}

export interface ReviewLog {
  rating: Rating
  scheduledDays: number
  elapsedDays: number
  review: Date
  state: CardState
}

export class FSRS {
  private p: FSRSParameters

  constructor(params?: Partial<FSRSParameters>) {
    // Default parameters optimized for language learning
    this.p = {
      requestRetention: 0.9, // Target 90% retention
      maximumInterval: 36500, // 100 years
      w: [
        0.4,    // Initial stability for Again
        0.6,    // Initial stability for Hard
        2.4,    // Initial stability for Good
        5.8,    // Initial stability for Easy
        4.93,   // Difficulty initialization
        0.94,   // Difficulty increase for Again
        0.86,   // Difficulty increase for Hard
        0.01,   // Difficulty increase for Good
        1.49,   // Difficulty increase for Easy
        0.14,   // Stability increase factor
        0.94,   // Stability decrease factor
        2,      // Retrievability power
        0.2,    // Stability-retrievability correlation
        0.99,   // Leech threshold factor
        2.5,    // Initial interval modifier
        8.5,    // Hard interval modifier
        2       // Easy bonus
      ],
      ...params
    }
  }

  /**
   * Initialize a new card
   */
  initCard(): FSRSCard {
    return {
      due: new Date(),
      stability: 0,
      difficulty: 0,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
      state: CardState.New,
      lastReview: undefined
    }
  }

  /**
   * Calculate the next review intervals for all possible ratings
   */
  repeat(card: FSRSCard, now: Date): Record<Rating, FSRSCard> {
    card = { ...card }

    if (card.state === CardState.New) {
      card.elapsedDays = 0
    } else {
      card.elapsedDays = this.daysSince(card.lastReview!, now)
    }

    card.lastReview = now
    card.reps += 1

    const s0 = card.stability
    const d0 = card.difficulty

    // Calculate for each rating
    const cards: Record<Rating, FSRSCard> = {} as Record<Rating, FSRSCard>

    for (let rating = Rating.Again; rating <= Rating.Easy; rating++) {
      const newCard = { ...card }

      // Calculate new difficulty
      newCard.difficulty = this.nextDifficulty(d0, rating)

      // Calculate new stability
      if (card.state === CardState.New) {
        newCard.stability = this.initStability(rating)
        newCard.state = CardState.Learning
      } else if (card.state === CardState.Learning || card.state === CardState.Relearning) {
        if (rating === Rating.Again) {
          newCard.stability = s0
          newCard.state = CardState.Relearning
        } else {
          newCard.stability = this.nextStability(s0, newCard.difficulty, rating, card.elapsedDays)
          newCard.state = CardState.Review
        }
      } else if (card.state === CardState.Review) {
        if (rating === Rating.Again) {
          newCard.stability = this.p.w[10] * Math.pow(s0, this.p.w[11])
          newCard.state = CardState.Relearning
          newCard.lapses += 1
        } else {
          newCard.stability = this.nextStability(s0, newCard.difficulty, rating, card.elapsedDays)
        }
      }

      // Calculate interval
      if (newCard.state === CardState.Learning || newCard.state === CardState.Relearning) {
        // Short intervals for learning cards
        newCard.scheduledDays = this.learningInterval(rating)
      } else {
        // Longer intervals for review cards
        newCard.scheduledDays = this.nextInterval(newCard.stability)
      }

      // Set due date
      newCard.due = new Date(now.getTime() + newCard.scheduledDays * 24 * 60 * 60 * 1000)

      cards[rating] = newCard
    }

    return cards
  }

  /**
   * Get the review card after a specific rating
   */
  reviewCard(card: FSRSCard, rating: Rating, now: Date): FSRSCard {
    const cards = this.repeat(card, now)
    return cards[rating]
  }

  /**
   * Calculate initial stability based on first rating
   */
  private initStability(rating: Rating): number {
    return this.p.w[rating - 1]
  }

  /**
   * Calculate next difficulty based on rating
   */
  private nextDifficulty(d: number, rating: Rating): number {
    const delta = this.p.w[4 + rating - 1] - d
    return d + delta * 0.1
  }

  /**
   * Calculate next stability
   */
  private nextStability(s: number, d: number, rating: Rating, elapsedDays: number): number {
    const retrievability = Math.exp(Math.log(0.9) * elapsedDays / s)

    let modifier = 1
    if (rating === Rating.Hard) {
      modifier = this.p.w[15]
    } else if (rating === Rating.Easy) {
      modifier = this.p.w[16]
    }

    const s_recall = s * (1 + Math.exp(this.p.w[9]) *
      (11 - d) *
      Math.pow(s, -this.p.w[10]) *
      (Math.exp((1 - retrievability) * this.p.w[12]) - 1))

    return s_recall * modifier
  }

  /**
   * Calculate next interval based on stability
   */
  private nextInterval(stability: number): number {
    const interval = stability * Math.log(this.p.requestRetention) / Math.log(0.9)
    return Math.min(Math.max(1, Math.round(interval)), this.p.maximumInterval)
  }

  /**
   * Learning intervals (in days)
   */
  private learningInterval(rating: Rating): number {
    // Minutes converted to days
    const intervals = {
      [Rating.Again]: 1 / (24 * 60), // 1 minute
      [Rating.Hard]: 5 / (24 * 60),  // 5 minutes
      [Rating.Good]: 10 / (24 * 60), // 10 minutes
      [Rating.Easy]: 1 / 24,         // 1 hour
    }
    return intervals[rating]
  }

  /**
   * Calculate days since a date
   */
  private daysSince(date: Date, now: Date): number {
    const diff = now.getTime() - date.getTime()
    return diff / (24 * 60 * 60 * 1000)
  }

  /**
   * Get cards due for review
   */
  getDueCards(cards: FSRSCard[], now: Date = new Date()): FSRSCard[] {
    return cards.filter(card => card.due <= now)
  }

  /**
   * Format interval for display
   */
  static formatInterval(days: number): string {
    if (days < 1 / 24) {
      const minutes = Math.round(days * 24 * 60)
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`
    } else if (days < 1) {
      const hours = Math.round(days * 24)
      return `${hours} hour${hours !== 1 ? 's' : ''}`
    } else if (days < 30) {
      const d = Math.round(days)
      return `${d} day${d !== 1 ? 's' : ''}`
    } else if (days < 365) {
      const months = Math.round(days / 30)
      return `${months} month${months !== 1 ? 's' : ''}`
    } else {
      const years = Math.round(days / 365 * 10) / 10
      return `${years} year${years !== 1 ? 's' : ''}`
    }
  }
}

// Export singleton instance with default settings
export const fsrs = new FSRS()

// Helper function to create a study card from vocabulary
export function createStudyCard(vocabularyId: string): FSRSCard & { vocabularyId: string } {
  return {
    ...fsrs.initCard(),
    vocabularyId
  }
}