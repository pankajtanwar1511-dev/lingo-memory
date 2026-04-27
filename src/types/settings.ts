/**
 * User Settings Types
 *
 * Defines all settings interfaces for user preferences,
 * profile data, sync activity, and session management.
 */

export interface UserSettings {
  // App Preferences
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'ja'

  // Study Settings
  dailyGoal: number // cards per day
  studyReminder: boolean
  reminderTime: string // HH:MM format
  autoPlayAudio: boolean
  showFurigana: boolean

  // Notification Settings
  emailNotifications: boolean
  studyReminders: boolean
  weeklyReport: boolean
  achievementNotifications: boolean

  // Privacy Settings
  profileVisibility: 'public' | 'private' | 'friends-only'
  showProgress: boolean
  allowDataCollection: boolean

  // Sync Settings
  autoSync: boolean
  syncFrequency: 'realtime' | 'hourly' | 'daily'
  syncOnMobileData: boolean

  // Kanji vocab-reveal SRS tuning (managed from the Kanji hub settings dialog)
  /** Idle days before a card drops one SRS level on next session start. */
  srsDecayDays: number
  /** Built-queue length = pool × this multiplier (lower = tighter loops). */
  srsQueueMultiplier: number

  // Metadata
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  uid: string
  displayName: string
  email: string
  emailVerified: boolean
  photoURL: string | null
  phoneNumber: string | null

  // Extended profile
  bio?: string
  location?: string
  nativeLanguage?: string
  learningGoals?: string[]

  // Timestamps
  joinedAt: Date
  lastActive: Date
}

export interface SyncActivity {
  id: string
  userId: string
  type: 'upload' | 'download' | 'conflict' | 'error'
  entityType: 'vocabulary' | 'studyCard' | 'deck' | 'settings' | 'all'
  entityCount: number
  timestamp: Date
  duration: number // milliseconds
  success: boolean
  error?: string
}

export interface DeviceInfo {
  browser: string
  os: string
  device: string
  ip?: string
}

export interface ActiveSession {
  id: string
  userId: string
  deviceInfo: DeviceInfo
  lastActive: Date
  createdAt: Date
  current?: boolean // Is this the current session
}

export interface ExportData {
  exportDate: Date
  version: string
  user: {
    uid: string
    email: string
    displayName: string
    emailVerified: boolean
  }
  settings: UserSettings
  vocabulary: any[]
  studyCards: any[]
  decks: any[]
  statistics: {
    totalCards: number
    totalStudyTime: number
    streakDays: number
    cardsStudiedToday: number
  }
}

export interface DeleteAccountRequest {
  userId: string
  password: string
  confirmation: string
  reason?: string
}

// Default settings
export const DEFAULT_SETTINGS: Omit<UserSettings, 'createdAt' | 'updatedAt'> = {
  // App Preferences
  theme: 'system',
  language: 'en',

  // Study Settings
  dailyGoal: 20,
  studyReminder: true,
  reminderTime: '19:00',
  autoPlayAudio: true,
  showFurigana: true,

  // Notification Settings
  emailNotifications: true,
  studyReminders: true,
  weeklyReport: true,
  achievementNotifications: true,

  // Privacy Settings
  profileVisibility: 'private',
  showProgress: true,
  allowDataCollection: true,

  // Sync Settings
  autoSync: true,
  syncFrequency: 'realtime',
  syncOnMobileData: false,

  // Kanji vocab-reveal SRS tuning
  srsDecayDays: 7,
  srsQueueMultiplier: 1.5,
}

// Setting categories for UI organization
export type SettingCategory =
  | 'account'
  | 'preferences'
  | 'privacy'
  | 'sync'
  | 'security'
  | 'data'

export interface SettingItem {
  id: string
  category: SettingCategory
  label: string
  description: string
  type: 'toggle' | 'select' | 'text' | 'number' | 'time'
  value: any
  options?: { label: string; value: any }[]
}
