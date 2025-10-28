/**
 * Analytics Service
 *
 * Tracks user progress, study sessions, streaks, and performance metrics.
 * Provides insights and recommendations based on study patterns.
 */

import { db } from '@/lib/db'
import { DailyStats, ProgressSnapshot, StreakInfo, PerformanceMetrics, ActivityDataPoint } from '@/types/analytics'
import { StudySession } from '@/types/vocabulary'
import { CardState } from '@/lib/fsrs'
import { format, startOfDay, subDays, isToday, differenceInDays } from 'date-fns'

export class AnalyticsService {
  /**
   * Get or create daily stats for a specific date
   */
  async getDailyStats(date: Date = new Date()): Promise<DailyStats> {
    const dateKey = format(startOfDay(date), 'yyyy-MM-dd')

    let stats = await db.dailyStats.get(dateKey)

    if (!stats) {
      stats = {
        id: dateKey,
        date: startOfDay(date),
        cardsStudied: 0,
        newCards: 0,
        reviewCards: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        averageResponseTime: 0,
        studyTime: 0,
        sessionsCount: 0,
        streak: 0
      }
      await db.dailyStats.put(stats)
    }

    return stats
  }

  /**
   * Update daily stats
   */
  async updateDailyStats(updates: Partial<DailyStats>, date: Date = new Date()): Promise<void> {
    const stats = await this.getDailyStats(date)
    const updated = { ...stats, ...updates }
    await db.dailyStats.put(updated)
  }

  /**
   * Increment daily stat counters
   */
  async incrementDailyStats(increments: {
    cardsStudied?: number
    newCards?: number
    reviewCards?: number
    correctAnswers?: number
    incorrectAnswers?: number
    studyTime?: number
    sessionsCount?: number
  }, date: Date = new Date()): Promise<void> {
    const stats = await this.getDailyStats(date)

    const updated: DailyStats = {
      ...stats,
      cardsStudied: stats.cardsStudied + (increments.cardsStudied || 0),
      newCards: stats.newCards + (increments.newCards || 0),
      reviewCards: stats.reviewCards + (increments.reviewCards || 0),
      correctAnswers: stats.correctAnswers + (increments.correctAnswers || 0),
      incorrectAnswers: stats.incorrectAnswers + (increments.incorrectAnswers || 0),
      studyTime: stats.studyTime + (increments.studyTime || 0),
      sessionsCount: stats.sessionsCount + (increments.sessionsCount || 0)
    }

    // Recalculate average response time if we have data
    if (updated.correctAnswers + updated.incorrectAnswers > 0) {
      const totalCards = updated.correctAnswers + updated.incorrectAnswers
      // This is a simplified average - in production you'd track actual response times
      updated.averageResponseTime = updated.studyTime / totalCards
    }

    await db.dailyStats.put(updated)
  }

  /**
   * Get stats for a date range
   */
  async getStatsRange(days: number = 30): Promise<DailyStats[]> {
    const endDate = new Date()
    const startDate = subDays(endDate, days - 1)

    const allStats = await db.dailyStats
      .where('date')
      .between(startOfDay(startDate), endDate, true, true)
      .toArray()

    // Fill in missing days with zero stats
    const statsMap = new Map(allStats.map(s => [s.id, s]))
    const result: DailyStats[] = []

    for (let i = 0; i < days; i++) {
      const date = subDays(endDate, days - 1 - i)
      const dateKey = format(startOfDay(date), 'yyyy-MM-dd')

      if (statsMap.has(dateKey)) {
        result.push(statsMap.get(dateKey)!)
      } else {
        result.push({
          id: dateKey,
          date: startOfDay(date),
          cardsStudied: 0,
          newCards: 0,
          reviewCards: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
          averageResponseTime: 0,
          studyTime: 0,
          sessionsCount: 0,
          streak: 0
        })
      }
    }

    return result
  }

  /**
   * Get activity data points for charts
   */
  async getActivityData(days: number = 30): Promise<ActivityDataPoint[]> {
    const stats = await this.getStatsRange(days)

    return stats.map(s => ({
      date: format(s.date, 'MM/dd'),
      cards: s.cardsStudied,
      accuracy: s.correctAnswers + s.incorrectAnswers > 0
        ? Math.round((s.correctAnswers / (s.correctAnswers + s.incorrectAnswers)) * 100)
        : 0,
      time: Math.round(s.studyTime)
    }))
  }

  /**
   * Calculate current streak
   */
  async getCurrentStreak(): Promise<StreakInfo> {
    const allStats = await db.dailyStats
      .orderBy('date')
      .reverse()
      .toArray()

    if (allStats.length === 0) {
      return {
        current: 0,
        longest: 0,
        isActiveToday: false
      }
    }

    // Check if studied today
    const today = startOfDay(new Date())
    const isActiveToday = allStats.some(s =>
      startOfDay(s.date).getTime() === today.getTime() && s.cardsStudied > 0
    )

    // Calculate current streak
    let currentStreak = 0
    const now = new Date()

    for (const stat of allStats) {
      if (stat.cardsStudied > 0) {
        const daysDiff = differenceInDays(now, stat.date)

        if (daysDiff === currentStreak || (daysDiff === currentStreak + 1 && !isActiveToday)) {
          currentStreak = daysDiff + 1
        } else {
          break
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0
    let tempStreak = 0
    let lastDate: Date | null = null

    for (const stat of allStats.reverse()) {
      if (stat.cardsStudied > 0) {
        if (lastDate === null || differenceInDays(stat.date, lastDate) === 1) {
          tempStreak++
          longestStreak = Math.max(longestStreak, tempStreak)
        } else {
          tempStreak = 1
        }
        lastDate = stat.date
      }
    }

    return {
      current: isActiveToday ? currentStreak : 0,
      longest: Math.max(longestStreak, currentStreak),
      lastStudyDate: allStats[0]?.date,
      isActiveToday
    }
  }

  /**
   * Get progress snapshot
   */
  async getProgressSnapshot(): Promise<ProgressSnapshot> {
    const stats = await this.getStatsRange(365) // Last year
    const streakInfo = await this.getCurrentStreak()

    // Count cards that have been studied (not in "New" state)
    const allCards = await db.studyCards.toArray()
    const totalCardsLearned = allCards.filter(c => c.state !== CardState.New).length
    const totalReviews = stats.reduce((sum, s) => sum + s.cardsStudied, 0)
    const totalStudyTime = stats.reduce((sum, s) => sum + s.studyTime, 0)

    const totalCorrect = stats.reduce((sum, s) => sum + s.correctAnswers, 0)
    const totalIncorrect = stats.reduce((sum, s) => sum + s.incorrectAnswers, 0)
    const averageAccuracy = totalCorrect + totalIncorrect > 0
      ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
      : 0

    // Get JLPT progress
    const n5Total = await db.vocabulary.where('jlptLevel').equals('N5').count()
    const n4Total = await db.vocabulary.where('jlptLevel').equals('N4').count()
    const n3Total = await db.vocabulary.where('jlptLevel').equals('N3').count()
    const n2Total = await db.vocabulary.where('jlptLevel').equals('N2').count()
    const n1Total = await db.vocabulary.where('jlptLevel').equals('N1').count()

    console.log('📊 JLPT Totals:', { n5Total, n4Total, n3Total, n2Total, n1Total })

    // Only count cards that have been studied (not in "New" state)
    const allStudyCards = await db.studyCards.toArray()
    const learnedCards = allStudyCards.filter(c => c.state !== CardState.New)

    console.log('📚 Study Cards:', {
      total: allStudyCards.length,
      learned: learnedCards.length,
      states: {
        new: allStudyCards.filter(c => c.state === CardState.New).length,
        learning: allStudyCards.filter(c => c.state === CardState.Learning).length,
        review: allStudyCards.filter(c => c.state === CardState.Review).length,
        relearning: allStudyCards.filter(c => c.state === CardState.Relearning).length
      }
    })

    // Fetch all vocabulary cards with their JLPT levels
    const vocabMap = new Map<string, string>()
    const allVocab = await db.vocabulary.toArray()
    allVocab.forEach(v => {
      if (v.jlptLevel) {
        vocabMap.set(v.id, v.jlptLevel)
      }
    })

    console.log('🗺️ Vocab Map:', {
      totalVocab: allVocab.length,
      withLevel: vocabMap.size,
      levels: {
        N5: allVocab.filter(v => v.jlptLevel === 'N5').length,
        N4: allVocab.filter(v => v.jlptLevel === 'N4').length,
        N3: allVocab.filter(v => v.jlptLevel === 'N3').length,
        N2: allVocab.filter(v => v.jlptLevel === 'N2').length,
        N1: allVocab.filter(v => v.jlptLevel === 'N1').length
      }
    })

    // Count learned cards by JLPT level
    const n5Learned = learnedCards.filter(c => vocabMap.get(c.vocabularyId) === 'N5').length
    const n4Learned = learnedCards.filter(c => vocabMap.get(c.vocabularyId) === 'N4').length
    const n3Learned = learnedCards.filter(c => vocabMap.get(c.vocabularyId) === 'N3').length
    const n2Learned = learnedCards.filter(c => vocabMap.get(c.vocabularyId) === 'N2').length
    const n1Learned = learnedCards.filter(c => vocabMap.get(c.vocabularyId) === 'N1').length

    console.log('✅ Learned Counts:', { n5Learned, n4Learned, n3Learned, n2Learned, n1Learned })

    // Debug: Check unmapped cards
    const unmappedCards = learnedCards.filter(c => !vocabMap.has(c.vocabularyId))
    if (unmappedCards.length > 0) {
      console.warn('⚠️ Unmapped study cards:', unmappedCards.length, unmappedCards.slice(0, 5))
    }

    return {
      date: new Date(),
      totalCardsLearned,
      totalReviews,
      currentStreak: streakInfo.current,
      longestStreak: streakInfo.longest,
      studyTime: totalStudyTime,
      averageAccuracy,
      jlptProgress: {
        N5: {
          level: 'N5',
          learned: n5Learned,
          total: n5Total,
          percentage: n5Total > 0 ? Math.round((n5Learned / n5Total) * 100) : 0,
          newToday: 0,
          reviewedToday: 0
        },
        N4: {
          level: 'N4',
          learned: n4Learned,
          total: n4Total,
          percentage: n4Total > 0 ? Math.round((n4Learned / n4Total) * 100) : 0,
          newToday: 0,
          reviewedToday: 0
        },
        N3: {
          level: 'N3',
          learned: n3Learned,
          total: n3Total,
          percentage: n3Total > 0 ? Math.round((n3Learned / n3Total) * 100) : 0,
          newToday: 0,
          reviewedToday: 0
        },
        N2: {
          level: 'N2',
          learned: n2Learned,
          total: n2Total,
          percentage: n2Total > 0 ? Math.round((n2Learned / n2Total) * 100) : 0,
          newToday: 0,
          reviewedToday: 0
        },
        N1: {
          level: 'N1',
          learned: n1Learned,
          total: n1Total,
          percentage: n1Total > 0 ? Math.round((n1Learned / n1Total) * 100) : 0,
          newToday: 0,
          reviewedToday: 0
        }
      }
    }
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const stats = await this.getStatsRange(30)
    const streakInfo = await this.getCurrentStreak()

    const totalCorrect = stats.reduce((sum, s) => sum + s.correctAnswers, 0)
    const totalIncorrect = stats.reduce((sum, s) => sum + s.incorrectAnswers, 0)
    const totalCards = stats.reduce((sum, s) => sum + s.cardsStudied, 0)
    const totalSessions = stats.reduce((sum, s) => sum + s.sessionsCount, 0)
    const totalTime = stats.reduce((sum, s) => sum + s.studyTime, 0)

    // Calculate consistency score (0-100)
    const daysStudied = stats.filter(s => s.cardsStudied > 0).length
    const consistencyScore = Math.round((daysStudied / stats.length) * 100)

    return {
      averageAccuracy: totalCorrect + totalIncorrect > 0
        ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
        : 0,
      averageResponseTime: totalCards > 0 ? totalTime / totalCards : 0,
      totalStudyTime: totalTime,
      cardsPerSession: totalSessions > 0 ? Math.round(totalCards / totalSessions) : 0,
      bestStreak: streakInfo.longest,
      consistencyScore
    }
  }

  /**
   * Record a study session
   */
  async recordSession(
    deckId: string,
    mode: 'flashcard' | 'quiz' | 'typing',
    cardsStudied: number,
    correctAnswers: number,
    averageResponseTime: number
  ): Promise<void> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const session: StudySession = {
      id: sessionId,
      deckId,
      startedAt: new Date(),
      completedAt: new Date(),
      cardsStudied,
      correctAnswers,
      averageResponseTime,
      mode
    }

    await db.sessions.put(session)

    // Update daily stats
    const incorrectAnswers = cardsStudied - correctAnswers
    await this.incrementDailyStats({
      cardsStudied,
      correctAnswers,
      incorrectAnswers,
      studyTime: Math.round(cardsStudied * averageResponseTime / 60), // Convert to minutes
      sessionsCount: 1
    })
  }

  /**
   * Get recent sessions
   */
  async getRecentSessions(limit: number = 10): Promise<StudySession[]> {
    return await db.sessions
      .orderBy('startedAt')
      .reverse()
      .limit(limit)
      .toArray()
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService()

// Export for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).analyticsService = analyticsService
}
