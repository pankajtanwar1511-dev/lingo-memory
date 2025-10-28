"use client"

/**
 * Settings Context
 *
 * Provides global settings state and methods throughout the app.
 * Automatically syncs with Firestore and handles local caching.
 */

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { settingsService } from '@/services/settings.service'
import { UserSettings, UserProfile, DEFAULT_SETTINGS } from '@/types/settings'
import { useAuth } from '@/contexts/auth-context'

interface SettingsContextType {
  settings: UserSettings
  profile: UserProfile | null
  loading: boolean
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>
  resetSettings: () => Promise<void>
  refreshSettings: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [settings, setSettings] = useState<UserSettings>({
    ...DEFAULT_SETTINGS,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Load settings when user changes
  const loadSettings = useCallback(async () => {
    if (!user) {
      // Use default settings for offline mode
      setSettings({
        ...DEFAULT_SETTINGS,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Load settings
      const userSettings = await settingsService.getSettings(user.uid)
      setSettings(userSettings)

      // Load profile
      const userProfile = await settingsService.getUserProfile(user.uid)
      if (userProfile) {
        setProfile(userProfile)
      } else {
        // Create profile from auth user
        setProfile({
          uid: user.uid,
          displayName: user.displayName || '',
          email: user.email || '',
          emailVerified: user.emailVerified || false,
          photoURL: user.photoURL,
          phoneNumber: null,
          joinedAt: new Date(),
          lastActive: new Date(),
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  // Subscribe to real-time settings updates
  useEffect(() => {
    if (!user) return

    const unsubscribe = settingsService.subscribeToSettings(user.uid, (updatedSettings) => {
      setSettings(updatedSettings)
      console.log('Settings updated from cloud:', updatedSettings)
    })

    return () => unsubscribe()
  }, [user])

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) {
      // For offline mode, just update local state
      setSettings(prev => ({
        ...prev,
        ...newSettings,
        updatedAt: new Date(),
      }))
      return
    }

    try {
      // Optimistic update
      setSettings(prev => ({
        ...prev,
        ...newSettings,
        updatedAt: new Date(),
      }))

      // Save to database
      await settingsService.saveSettings(user.uid, newSettings)
    } catch (error) {
      console.error('Error updating settings:', error)
      // Revert on error
      await loadSettings()
      throw error
    }
  }

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    if (!user) return

    try {
      // Optimistic update
      setProfile(prev => prev ? {
        ...prev,
        ...newProfile,
        lastActive: new Date(),
      } : null)

      // Save to database
      await settingsService.updateUserProfile(user.uid, newProfile)
    } catch (error) {
      console.error('Error updating profile:', error)
      // Revert on error
      await loadSettings()
      throw error
    }
  }

  const resetSettings = async () => {
    if (!user) return

    try {
      await settingsService.resetSettings(user.uid)
      await loadSettings()
    } catch (error) {
      console.error('Error resetting settings:', error)
      throw error
    }
  }

  const refreshSettings = async () => {
    await loadSettings()
  }

  const refreshProfile = async () => {
    if (!user) return

    try {
      const userProfile = await settingsService.getUserProfile(user.uid)
      if (userProfile) {
        setProfile(userProfile)
      }
    } catch (error) {
      console.error('Error refreshing profile:', error)
    }
  }

  const value: SettingsContextType = {
    settings,
    profile,
    loading,
    updateSettings,
    updateProfile,
    resetSettings,
    refreshSettings,
    refreshProfile,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

/**
 * Hook to use settings context
 */
export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

/**
 * Hook to get a specific setting value
 */
export function useSetting<K extends keyof UserSettings>(key: K): UserSettings[K] {
  const { settings } = useSettings()
  return settings[key]
}
