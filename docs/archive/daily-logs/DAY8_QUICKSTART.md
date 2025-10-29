# Day 8 Quick Start Guide

This guide will help you get started with the Day 8 settings system.

## What's New in Day 8?

✅ Comprehensive settings page with 6 tabs
✅ User profile management
✅ Email verification
✅ Password change
✅ GDPR-compliant account deletion
✅ Data export
✅ Sync activity tracking
✅ Real-time settings sync across devices

## Quick Start

### 1. Access Settings

Navigate to the settings page:

```
/settings
```

Or click the "Settings" link in the navigation menu (when logged in).

### 2. Use Settings in Your Components

```typescript
import { useSettings } from '@/contexts/settings-context'

function MyComponent() {
  const { settings, updateSettings, profile, loading } = useSettings()

  if (loading) {
    return <div>Loading settings...</div>
  }

  return (
    <div>
      <h1>Hello, {profile?.displayName}!</h1>
      <p>Daily Goal: {settings.dailyGoal} cards</p>
      <p>Theme: {settings.theme}</p>

      <button onClick={() => updateSettings({ dailyGoal: 30 })}>
        Set goal to 30
      </button>
    </div>
  )
}
```

### 3. Update Settings

Settings update optimistically (instant UI feedback):

```typescript
// Update single setting
await updateSettings({ theme: 'dark' })

// Update multiple settings
await updateSettings({
  theme: 'dark',
  dailyGoal: 25,
  autoPlayAudio: false
})
```

### 4. Update Profile

```typescript
await updateProfile({
  displayName: 'John Doe',
  bio: 'Learning Japanese!',
  location: 'Tokyo'
})
```

### 5. Export Your Data

1. Go to Settings → Data tab
2. Click "Export All Data"
3. Save the JSON file to your computer

File will be named: `lingomemory-backup-2025-10-26.json`

### 6. Change Password

1. Go to Settings → Account tab
2. Scroll to "Change Password"
3. Enter current password
4. Enter new password (min 8 characters)
5. Confirm new password
6. Click "Update Password"

### 7. Verify Email

1. Go to Settings → Account tab
2. If not verified, click "Send Verification Email"
3. Check your inbox
4. Click the verification link
5. Status updates automatically

## Settings Reference

### Theme Settings

```typescript
// Options: 'light' | 'dark' | 'system'
updateSettings({ theme: 'dark' })
```

### Study Settings

```typescript
updateSettings({
  dailyGoal: 25,           // 1-100 cards per day
  autoPlayAudio: true,     // Auto-play pronunciation
  showFurigana: true,      // Show reading hints
  studyReminder: true,     // Enable reminders
  reminderTime: '19:00'    // Reminder time (HH:MM)
})
```

### Notification Settings

```typescript
updateSettings({
  emailNotifications: true,       // Email notifications
  studyReminders: true,           // Study reminders
  weeklyReport: true,             // Weekly progress report
  achievementNotifications: true  // Achievement alerts
})
```

### Privacy Settings

```typescript
updateSettings({
  showProgress: true,         // Show progress publicly
  allowDataCollection: true   // Anonymous analytics
})
```

### Sync Settings

```typescript
updateSettings({
  autoSync: true,            // Auto-sync to cloud
  syncOnMobileData: false,   // Sync on cellular
  syncFrequency: 'realtime'  // 'realtime' | 'hourly' | 'daily'
})
```

## Common Tasks

### Task 1: Enable Dark Mode

```typescript
const { updateSettings } = useSettings()

await updateSettings({ theme: 'dark' })
```

### Task 2: Increase Daily Goal

```typescript
const { settings, updateSettings } = useSettings()

await updateSettings({ dailyGoal: settings.dailyGoal + 5 })
```

### Task 3: Check if Email is Verified

```typescript
const { profile } = useSettings()

if (profile?.emailVerified) {
  console.log('Email is verified!')
} else {
  console.log('Please verify your email')
}
```

### Task 4: Get Sync Activity

```typescript
import { settingsService } from '@/services/settings.service'

const activities = await settingsService.getSyncActivity(user.uid, 50)

activities.forEach(activity => {
  console.log(`${activity.type}: ${activity.entityCount} ${activity.entityType}`)
})
```

### Task 5: Reset Settings to Defaults

```typescript
const { resetSettings } = useSettings()

if (confirm('Reset all settings?')) {
  await resetSettings()
}
```

### Task 6: Export Data Programmatically

```typescript
import { db } from '@/lib/db'

async function exportData() {
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    vocabulary: await db.vocabulary.toArray(),
    studyCards: await db.studyCards.toArray(),
    decks: await db.decks.toArray(),
    settings: await db.settings.toArray()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

## API Reference

### useSettings() Hook

```typescript
const {
  settings,          // Current settings
  profile,           // User profile
  loading,           // Loading state
  updateSettings,    // Update settings
  updateProfile,     // Update profile
  resetSettings,     // Reset to defaults
  refreshSettings,   // Refresh from cloud
  refreshProfile     // Refresh profile
} = useSettings()
```

### Settings Service

```typescript
import { settingsService } from '@/services/settings.service'

// Get settings
const settings = await settingsService.getSettings(userId)

// Save settings
await settingsService.saveSettings(userId, { theme: 'dark' })

// Reset settings
await settingsService.resetSettings(userId)

// Subscribe to changes
const unsubscribe = settingsService.subscribeToSettings(userId, (settings) => {
  console.log('Settings changed:', settings)
})

// Get profile
const profile = await settingsService.getUserProfile(userId)

// Update profile
await settingsService.updateUserProfile(userId, { bio: 'Hello!' })

// Log sync activity
await settingsService.logSyncActivity(userId, {
  type: 'upload',
  entityType: 'vocabulary',
  entityCount: 15,
  timestamp: new Date(),
  duration: 250,
  success: true
})

// Get sync activity
const activities = await settingsService.getSyncActivity(userId, 50)
```

## Offline Support

Settings work offline with automatic sync when back online:

1. **Offline**: Settings saved to IndexedDB
2. **Online**: Settings sync to Firestore
3. **Sync**: Automatic when connection restored

```typescript
// This works offline
await updateSettings({ dailyGoal: 30 })

// Syncs automatically when online
// No additional code needed
```

## Error Handling

All settings operations include error handling:

```typescript
import { toast } from '@/components/ui/toaster'

try {
  await updateSettings({ theme: 'dark' })

  toast({
    title: 'Settings updated',
    description: 'Your preferences have been saved',
    type: 'success'
  })
} catch (error) {
  toast({
    title: 'Update failed',
    description: error.message,
    type: 'error'
  })

  // Settings automatically roll back to previous state
}
```

## TypeScript Support

All settings are fully typed:

```typescript
import { UserSettings, UserProfile } from '@/types/settings'

// TypeScript will validate these
const settings: UserSettings = {
  theme: 'dark',        // ✅ Valid
  dailyGoal: 25,        // ✅ Valid
  autoPlayAudio: true,  // ✅ Valid
  createdAt: new Date(),
  updatedAt: new Date(),
  // ... all required fields
}

// TypeScript will catch errors
const invalid: UserSettings = {
  theme: 'purple',  // ❌ Error: Invalid theme
  dailyGoal: 'ten', // ❌ Error: Must be number
}
```

## Security Best Practices

### 1. Password Changes

Always require current password:

```typescript
// ✅ Good - Requires re-authentication
const credential = EmailAuthProvider.credential(user.email, currentPassword)
await reauthenticateWithCredential(auth.currentUser, credential)
await updatePassword(auth.currentUser, newPassword)

// ❌ Bad - Direct password change without re-auth
await updatePassword(auth.currentUser, newPassword)
```

### 2. Account Deletion

Always confirm with password and typed confirmation:

```typescript
// ✅ Good - Multi-step confirmation
if (deleteConfirmation === 'DELETE' && password) {
  await reauthenticateWithCredential(auth.currentUser, credential)
  await deleteUser(auth.currentUser)
}

// ❌ Bad - Single click deletion
await deleteUser(auth.currentUser)
```

### 3. Email Verification

Check verification status before sensitive operations:

```typescript
// ✅ Good
if (user.emailVerified) {
  await performSensitiveOperation()
} else {
  toast({ title: 'Please verify your email first', type: 'warning' })
}
```

## Performance Tips

### 1. Debounce Frequent Updates

```typescript
import { debounce } from 'lodash'

const debouncedUpdate = debounce((value) => {
  updateSettings({ dailyGoal: value })
}, 500)

<input onChange={(e) => debouncedUpdate(e.target.value)} />
```

### 2. Batch Updates

```typescript
// ✅ Good - Single update
await updateSettings({
  theme: 'dark',
  dailyGoal: 30,
  autoPlayAudio: false
})

// ❌ Bad - Multiple updates
await updateSettings({ theme: 'dark' })
await updateSettings({ dailyGoal: 30 })
await updateSettings({ autoPlayAudio: false })
```

### 3. Use Optimistic Updates

The context handles this automatically:

```typescript
// Instant UI update, sync happens in background
await updateSettings({ theme: 'dark' })
// UI already shows dark theme before Firestore confirms
```

## Troubleshooting

### Settings not syncing?

1. Check internet connection
2. Check Firebase configuration
3. Check browser console for errors
4. Verify user is authenticated

```typescript
import { isFirebaseConfigured } from '@/lib/firebase'

if (!isFirebaseConfigured()) {
  console.log('Firebase not configured - using offline mode')
}
```

### Settings not persisting?

1. Check IndexedDB is enabled in browser
2. Check for storage quota errors
3. Clear browser cache and reload

```typescript
// Check if IndexedDB is available
if (!window.indexedDB) {
  console.error('IndexedDB not supported')
}
```

### Profile not updating?

1. Verify user is authenticated
2. Check Firestore rules allow write
3. Verify user has permission

```typescript
import { auth } from '@/lib/firebase'

if (!auth.currentUser) {
  console.error('User not authenticated')
}
```

## Migration from Previous Version

If you're upgrading from a previous version without settings:

```typescript
// Settings will be created automatically with defaults
const { settings } = useSettings()

// Old localStorage settings will NOT be migrated
// Users will need to reconfigure preferences
```

## Next Steps

- ✅ Explore all 6 settings tabs
- ✅ Verify your email
- ✅ Change your password
- ✅ Export your data
- ✅ Customize study preferences
- ✅ Set up sync preferences

## Additional Resources

- [DAY8_SUMMARY.md](./DAY8_SUMMARY.md) - Complete implementation overview
- [DAY8_FEATURES.md](./DAY8_FEATURES.md) - Detailed feature documentation
- [DAY8_PLAN.md](./DAY8_PLAN.md) - Original planning document
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

## Support

If you encounter issues:

1. Check browser console for errors
2. Review Firestore rules
3. Verify Firebase configuration
4. Check IndexedDB storage quota
5. Test in incognito mode (to rule out extensions)

## FAQ

**Q: Do settings sync across devices?**
A: Yes, if you're logged in. Settings sync via Firestore in real-time.

**Q: What happens if I'm offline?**
A: Settings are saved locally to IndexedDB and sync when you're back online.

**Q: Can I use settings without Firebase?**
A: Yes, settings work in offline mode with IndexedDB only.

**Q: How do I reset all settings?**
A: Go to Settings → Preferences tab → Click "Reset to Defaults".

**Q: Is my data safe?**
A: Yes. All data is encrypted in transit (HTTPS) and at rest (Firebase). You can export and delete your data anytime (GDPR-compliant).

**Q: Can I import settings from an export?**
A: Not yet. This feature is planned for a future update.

**Q: How often does sync happen?**
A: By default, sync happens in real-time when settings change. You can configure this in Settings → Sync tab.

**Q: What data is included in the export?**
A: All vocabulary, study cards, decks, settings, and user information. See [Data Export](#task-6-export-data-programmatically) for details.

---

**Ready to start?** Head to `/settings` and explore! 🚀
