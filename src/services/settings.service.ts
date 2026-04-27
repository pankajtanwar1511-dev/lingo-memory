/**
 * Settings Service
 *
 * Manages user settings with Firestore sync.
 * Handles CRUD operations, caching, and real-time updates.
 */

import { ref, get, set, update, onValue, serverTimestamp } from 'firebase/database'
import { database, isFirebaseConfigured } from '@/lib/firebase'
import { UserSettings, DEFAULT_SETTINGS, SyncActivity, UserProfile } from '@/types/settings'
import { db } from '@/lib/db'

export class SettingsService {
  private settingsCache: Map<string, UserSettings> = new Map()

  /**
   * Check if settings service is available
   */
  isAvailable(): boolean {
    return isFirebaseConfigured() && !!database
  }

  /**
   * Get user settings (from cache, local DB, or Firestore)
   */
  async getSettings(userId: string): Promise<UserSettings> {
    // Check cache first
    if (this.settingsCache.has(userId)) {
      return this.settingsCache.get(userId)!
    }

    // Try local database
    const localSettings = await this.getLocalSettings(userId)
    if (localSettings) {
      this.settingsCache.set(userId, localSettings)
      return localSettings
    }

    // Try Firestore if available
    if (this.isAvailable()) {
      const cloudSettings = await this.getCloudSettings(userId)
      if (cloudSettings) {
        // Save to local and cache
        await this.saveLocalSettings(userId, cloudSettings)
        this.settingsCache.set(userId, cloudSettings)
        return cloudSettings
      }
    }

    // Return defaults if nothing found
    const defaultSettings = this.createDefaultSettings()
    await this.saveSettings(userId, defaultSettings)
    return defaultSettings
  }

  /**
   * Update user settings
   */
  async saveSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
    const currentSettings = await this.getSettings(userId)
    const updatedSettings: UserSettings = {
      ...currentSettings,
      ...settings,
      updatedAt: new Date(),
    }

    // Update cache
    this.settingsCache.set(userId, updatedSettings)

    // Save to local database
    await this.saveLocalSettings(userId, updatedSettings)

    // Sync to Firestore if available
    if (this.isAvailable()) {
      await this.saveCloudSettings(userId, updatedSettings)
    }
  }

  /**
   * Reset settings to defaults
   */
  async resetSettings(userId: string): Promise<void> {
    const defaultSettings = this.createDefaultSettings()
    await this.saveSettings(userId, defaultSettings)
  }

  /**
   * Subscribe to settings changes (real-time)
   */
  subscribeToSettings(
    userId: string,
    callback: (settings: UserSettings) => void
  ): () => void {
    if (!this.isAvailable()) {
      return () => {}
    }

    const r = ref(database!, `users/${userId}/settings/preferences`)
    // onValue returns its own unsubscribe function in v9+ modular SDK.
    return onValue(r, (snapshot) => {
      const val = snapshot.val()
      if (val) {
        const settings = this.cloudToSettings(val)
        this.settingsCache.set(userId, settings)
        callback(settings)
      }
    })
  }

  /**
   * Get settings from local IndexedDB
   */
  private async getLocalSettings(userId: string): Promise<UserSettings | null> {
    try {
      const setting = await db.settings.where('userId').equals(userId).first()
      if (!setting) return null

      return {
        theme: setting.theme,
        language: setting.language as 'en' | 'ja',
        dailyGoal: setting.dailyGoal,
        studyReminder: true,
        reminderTime: setting.reviewTime || '19:00',
        autoPlayAudio: setting.autoplay,
        showFurigana: setting.showFurigana,
        emailNotifications: setting.notifications,
        studyReminders: true,
        weeklyReport: true,
        achievementNotifications: true,
        profileVisibility: 'private',
        showProgress: true,
        allowDataCollection: setting.analytics,
        autoSync: setting.dataSync,
        syncFrequency: 'realtime',
        syncOnMobileData: false,
        createdAt: setting.createdAt,
        updatedAt: setting.updatedAt,
      }
    } catch (error) {
      console.error('Error getting local settings:', error)
      return null
    }
  }

  /**
   * Save settings to local IndexedDB
   */
  private async saveLocalSettings(userId: string, settings: UserSettings): Promise<void> {
    try {
      await db.settings.put({
        userId,
        theme: settings.theme,
        language: settings.language as any,
        dailyGoal: settings.dailyGoal,
        notifications: settings.emailNotifications,
        sound: true,
        autoplay: settings.autoPlayAudio,
        showFurigana: settings.showFurigana,
        reviewTime: settings.reminderTime,
        dataSync: settings.autoSync,
        analytics: settings.allowDataCollection,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
      })
    } catch (error) {
      console.error('Error saving local settings:', error)
    }
  }

  /**
   * Get settings from Realtime Database
   */
  private async getCloudSettings(userId: string): Promise<UserSettings | null> {
    if (!database) return null
    try {
      const snap = await get(ref(database, `users/${userId}/settings/preferences`))
      if (!snap.exists()) return null
      return this.cloudToSettings(snap.val())
    } catch (error) {
      console.error('Error getting cloud settings:', error)
      return null
    }
  }

  /**
   * Save settings to Realtime Database
   */
  private async saveCloudSettings(userId: string, settings: UserSettings): Promise<void> {
    if (!database) return
    try {
      await set(ref(database, `users/${userId}/settings/preferences`), {
        ...settings,
        // RTDB has no Timestamp type — store as ms epoch numbers.
        createdAt: settings.createdAt.getTime(),
        updatedAt: settings.updatedAt.getTime(),
      })
    } catch (error) {
      console.error('Error saving cloud settings:', error)
      throw error
    }
  }

  /**
   * Convert RTDB JSON to UserSettings
   */
  private cloudToSettings(data: any): UserSettings {
    return {
      theme: data.theme || 'system',
      language: data.language || 'en',
      dailyGoal: data.dailyGoal || 20,
      studyReminder: data.studyReminder ?? true,
      reminderTime: data.reminderTime || '19:00',
      autoPlayAudio: data.autoPlayAudio ?? true,
      showFurigana: data.showFurigana ?? true,
      emailNotifications: data.emailNotifications ?? true,
      studyReminders: data.studyReminders ?? true,
      weeklyReport: data.weeklyReport ?? true,
      achievementNotifications: data.achievementNotifications ?? true,
      profileVisibility: data.profileVisibility || 'private',
      showProgress: data.showProgress ?? true,
      allowDataCollection: data.allowDataCollection ?? true,
      autoSync: data.autoSync ?? true,
      syncFrequency: data.syncFrequency || 'realtime',
      syncOnMobileData: data.syncOnMobileData ?? false,
      createdAt: typeof data.createdAt === 'number' ? new Date(data.createdAt) : new Date(),
      updatedAt: typeof data.updatedAt === 'number' ? new Date(data.updatedAt) : new Date(),
    }
  }

  /**
   * Create default settings
   */
  private createDefaultSettings(): UserSettings {
    const now = new Date()
    return {
      ...DEFAULT_SETTINGS,
      createdAt: now,
      updatedAt: now,
    }
  }

  /**
   * Log sync activity
   */
  async logSyncActivity(userId: string, activity: Omit<SyncActivity, 'id' | 'userId'>): Promise<void> {
    if (!this.isAvailable()) return
    try {
      const id = `${Date.now()}`
      await set(ref(database!, `users/${userId}/syncActivity/${id}`), {
        ...activity,
        userId,
        timestamp: activity.timestamp.getTime(),
      })
    } catch (error) {
      console.error('Error logging sync activity:', error)
    }
  }

  /**
   * Get recent sync activity (RTDB has no SQL-like limit/orderBy at scale —
   * fetch all then sort+slice in memory; fine for personal-scale activity log).
   */
  async getSyncActivity(userId: string, limit: number = 50): Promise<SyncActivity[]> {
    if (!this.isAvailable()) return []
    try {
      const snap = await get(ref(database!, `users/${userId}/syncActivity`))
      if (!snap.exists()) return []
      const all = snap.val() as Record<string, any>
      const entries = Object.entries(all).map(([id, data]) => ({
        id,
        userId,
        type: data.type,
        entityType: data.entityType,
        entityCount: data.entityCount,
        timestamp: typeof data.timestamp === 'number' ? new Date(data.timestamp) : new Date(),
        duration: data.duration,
        success: data.success,
        error: data.error,
      }))
      entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      return entries.slice(0, limit)
    } catch (error) {
      console.error('Error getting sync activity:', error)
      return []
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!this.isAvailable()) return null
    try {
      const snap = await get(ref(database!, `users/${userId}`))
      if (!snap.exists()) return null
      const data = snap.val()
      return {
        uid: userId,
        displayName: data.displayName || '',
        email: data.email || '',
        emailVerified: data.emailVerified || false,
        photoURL: data.photoURL || null,
        phoneNumber: data.phoneNumber || null,
        bio: data.bio,
        location: data.location,
        nativeLanguage: data.nativeLanguage,
        learningGoals: data.learningGoals || [],
        joinedAt: typeof data.createdAt === 'number' ? new Date(data.createdAt) : new Date(),
        lastActive: typeof data.lastActive === 'number' ? new Date(data.lastActive) : new Date(),
      }
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    if (!this.isAvailable()) return
    try {
      await update(ref(database!, `users/${userId}`), {
        ...profile,
        lastActive: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }
}

// Create singleton instance
export const settingsService = new SettingsService()

// Export for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).settingsService = settingsService
}
