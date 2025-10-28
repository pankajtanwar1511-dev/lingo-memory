/**
 * Analytics & Progress Tracking Types
 *
 * Types for tracking user progress, study sessions, achievements,
 * and performance analytics.
 */

import { JLPTLevel } from './vocabulary'

/**
 * Daily study statistics
 */
export interface DailyStats {
  id: string // Format: YYYY-MM-DD
  userId?: string
  date: Date
  cardsStudied: number
  newCards: number
  reviewCards: number
  correctAnswers: number
  incorrectAnswers: number
  averageResponseTime: number // seconds
  studyTime: number // minutes
  sessionsCount: number
  streak: number
}

// Note: StudySession is imported from vocabulary types to maintain compatibility
// We extend it here for analytics-specific needs
export interface AnalyticsSession {
  id: string
  userId?: string
  startTime: Date
  endTime?: Date
  duration: number // seconds
  cardsStudied: number
  correctAnswers: number
  incorrectAnswers: number
  mode: 'flashcard' | 'quiz' | 'typing'
  deckId?: string
  jlptLevel?: JLPTLevel
  performance: number // 0-100 accuracy percentage
}

/**
 * Achievement/Badge
 */
export interface Achievement {
  id: string
  type: 'streak' | 'cards' | 'accuracy' | 'time' | 'level'
  title: string
  description: string
  icon: string
  requirement: number
  progress: number
  unlocked: boolean
  unlockedAt?: Date
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

/**
 * JLPT level progress details
 */
export interface LevelProgress {
  level: JLPTLevel
  learned: number
  total: number
  percentage: number
  newToday: number
  reviewedToday: number
}

/**
 * Progress snapshot
 */
export interface ProgressSnapshot {
  userId?: string
  date: Date
  totalCardsLearned: number
  totalReviews: number
  currentStreak: number
  longestStreak: number
  studyTime: number // total minutes
  averageAccuracy: number
  jlptProgress: {
    N5: LevelProgress
    N4: LevelProgress
    N3: LevelProgress
    N2: LevelProgress
    N1: LevelProgress
  }
}

/**
 * Retention data point
 */
export interface RetentionData {
  interval: number // days since first review
  retention: number // percentage remembered (0-100)
  cardCount: number
}

/**
 * Weak area identification
 */
export interface WeakArea {
  category: string
  jlptLevel: JLPTLevel
  accuracy: number
  cardsCount: number
  recommendation: string
}

/**
 * Study streak information
 */
export interface StreakInfo {
  current: number
  longest: number
  lastStudyDate?: Date
  isActiveToday: boolean
}

/**
 * Analytics export format
 */
export interface AnalyticsExport {
  exportDate: string
  version: string
  user: {
    uid?: string
    email?: string
  }
  summary: {
    totalCardsLearned: number
    totalReviews: number
    currentStreak: number
    longestStreak: number
    totalStudyTime: number
    averageAccuracy: number
  }
  dailyStats: DailyStats[]
  sessions: AnalyticsSession[]
  achievements: Achievement[]
  jlptProgress: Record<JLPTLevel, LevelProgress>
}

/**
 * Chart data point for activity charts
 */
export interface ActivityDataPoint {
  date: string
  cards: number
  accuracy: number
  time: number
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  averageAccuracy: number
  averageResponseTime: number
  totalStudyTime: number
  cardsPerSession: number
  bestStreak: number
  consistencyScore: number // 0-100
}
