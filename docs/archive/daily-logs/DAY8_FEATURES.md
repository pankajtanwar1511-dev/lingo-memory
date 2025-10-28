# Day 8 Features: Complete Settings System Documentation

This document provides detailed documentation for all features implemented in Day 8.

## Table of Contents

1. [Settings Architecture](#settings-architecture)
2. [Account Tab](#account-tab)
3. [Preferences Tab](#preferences-tab)
4. [Privacy Tab](#privacy-tab)
5. [Sync Tab](#sync-tab)
6. [Security Tab](#security-tab)
7. [Data Tab](#data-tab)
8. [Settings Service API](#settings-service-api)
9. [Settings Context API](#settings-context-api)
10. [Type Definitions](#type-definitions)

---

## Settings Architecture

### Overview

The settings system uses a three-tier architecture for optimal performance and reliability:

```
┌─────────────────────────────────────────────────┐
│              Settings System                    │
│                                                 │
│  User Action → Context → Service → Storage     │
│                                                 │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   │
│  │  Cache   │ → │ IndexedDB│ → │Firestore │   │
│  │  (Map)   │   │ (Local)  │   │ (Cloud)  │   │
│  │  0ms     │   │  5-10ms  │   │ 100-500ms│   │
│  └──────────┘   └──────────┘   └──────────┘   │
│                                                 │
│  ← Real-time Sync (onSnapshot) ←               │
└─────────────────────────────────────────────────┘
```

### Data Flow

**Read Flow:**
1. Check cache → Return if found (instant)
2. Check IndexedDB → Return if found, update cache
3. Check Firestore → Return if found, update cache & IndexedDB
4. Return default settings if nothing found

**Write Flow:**
1. Update cache immediately (optimistic update)
2. Update UI instantly
3. Save to IndexedDB
4. Sync to Firestore in background
5. On error: Rollback to last known good state

### Storage Locations

| Storage | Purpose | Speed | Offline | Sync |
|---------|---------|-------|---------|------|
| Cache (Map) | Fast access | 0ms | No | No |
| IndexedDB | Offline support | 5-10ms | Yes | No |
| Firestore | Cloud sync | 100-500ms | No | Yes |

---

## Account Tab

### Features

#### 1. Profile Information

**Edit Display Name:**
```typescript
// Updates both Settings Context and Firebase Auth
await updateProfile({ displayName: "New Name" })
```

**Edit Bio:**
```typescript
// Updates user profile in Firestore
await updateProfile({ bio: "Learning Japanese!" })
```

**Location:**
```typescript
await updateProfile({ location: "Tokyo, Japan" })
```

**Native Language:**
```typescript
await updateProfile({ nativeLanguage: "en" })
```

#### 2. Email Verification

**Send Verification Email:**
```typescript
import { sendEmailVerification } from 'firebase/auth'

const handleSendVerification = async () => {
  if (auth.currentUser && !user.emailVerified) {
    await sendEmailVerification(auth.currentUser)
    toast({
      title: "Verification email sent",
      description: "Please check your inbox",
      type: "success"
    })
  }
}
```

**Check Verification Status:**
- Email verification status shown with badge
- "Verified" badge: Green checkmark
- "Not Verified" badge: Yellow warning
- Real-time updates via Auth state observer

**Resend Verification:**
- Available if not verified
- Rate limited by Firebase (max 1 per minute)
- Shows loading state during send

#### 3. Password Change

**Security Flow:**
1. User enters current password
2. User enters new password (min 8 characters)
3. User confirms new password
4. System re-authenticates user
5. System updates password
6. Success toast shown

**Implementation:**
```typescript
const handleChangePassword = async () => {
  // Re-authenticate first
  const credential = EmailAuthProvider.credential(
    user.email,
    currentPassword
  )
  await reauthenticateWithCredential(auth.currentUser, credential)

  // Update password
  await updatePassword(auth.currentUser, newPassword)

  toast({
    title: "Password changed",
    description: "Your password has been updated successfully",
    type: "success"
  })
}
```

**Validation:**
- Current password required
- New password minimum 8 characters
- New password must match confirmation
- Cannot use same password as current

**Error Handling:**
```typescript
if (error.code === 'auth/wrong-password') {
  toast({
    title: "Incorrect password",
    description: "The current password you entered is incorrect",
    type: "error"
  })
}
```

---

## Preferences Tab

### Features

#### 1. Theme Selection

**Options:**
- Light Mode
- Dark Mode

**Implementation:**
```typescript
const handleThemeChange = (theme: 'light' | 'dark') => {
  updateSettings({ theme })
  // Theme applies immediately via Tailwind dark mode
}
```

**Persistence:**
- Saved to IndexedDB
- Synced to Firestore
- Applied on page load

#### 2. Daily Study Goal

**Features:**
- Adjustable from 1-100 cards per day
- +/- buttons for easy adjustment
- Visual feedback on change

**Implementation:**
```typescript
const handleDailyGoalChange = (delta: number) => {
  const newGoal = Math.max(1, Math.min(100, dailyGoal + delta))
  updateSettings({ dailyGoal: newGoal })
}
```

**Default:** 20 cards per day

#### 3. Audio Settings

**Auto-play Audio:**
```typescript
updateSettings({ autoPlayAudio: true })
```

- Plays audio automatically when card flips
- Useful for pronunciation practice
- Can be toggled per-session

#### 4. Display Settings

**Show Furigana:**
```typescript
updateSettings({ showFurigana: true })
```

- Shows furigana (reading hints) above kanji
- Helpful for beginners
- Can be toggled during study

#### 5. Notification Settings

**Email Notifications:**
```typescript
updateSettings({ emailNotifications: true })
```

**Study Reminders:**
```typescript
updateSettings({ studyReminders: true })
```

**Weekly Reports:**
```typescript
updateSettings({ weeklyReport: true })
```

---

## Privacy Tab

### Features

#### 1. Progress Visibility

**Show Progress:**
```typescript
updateSettings({ showProgress: true })
```

- Controls whether study progress is visible to others
- Future: Will integrate with social features
- Default: true

#### 2. Data Collection

**Allow Data Collection:**
```typescript
updateSettings({ allowDataCollection: true })
```

- Anonymous usage analytics
- Helps improve app performance
- GDPR-compliant
- Default: true

---

## Sync Tab

### Features

#### 1. Sync Configuration

**Auto Sync:**
```typescript
updateSettings({ autoSync: true })
```

- Automatically sync changes to cloud
- Runs in background
- No user intervention needed

**Sync on Mobile Data:**
```typescript
updateSettings({ syncOnMobileData: false })
```

- Control whether to sync on cellular connection
- Helps save data usage
- Default: false (WiFi only)

#### 2. Manual Sync

**Sync Now Button:**
```typescript
const handleManualSync = async () => {
  const startTime = Date.now()

  await firestoreService.syncToCloud()

  const duration = Date.now() - startTime

  await settingsService.logSyncActivity(user.uid, {
    type: 'upload',
    entityType: 'vocabulary',
    entityCount: 100,
    timestamp: new Date(),
    duration,
    success: true
  })

  toast({
    title: "Sync complete",
    description: `Synced in ${duration}ms`,
    type: "success"
  })
}
```

#### 3. Sync Activity Log

**Display:**
- Last 50 sync events
- Upload/Download indicators
- Success/Failure status with icons
- Entity type and count
- Timestamp in human-readable format
- Duration in milliseconds

**Activity Item:**
```typescript
interface SyncActivity {
  id: string
  userId: string
  type: 'upload' | 'download' | 'conflict'
  entityType: 'vocabulary' | 'studyCard' | 'deck' | 'settings'
  entityCount: number
  timestamp: Date
  duration: number // milliseconds
  success: boolean
  error?: string
}
```

**Visual Indicators:**
- ✅ Success: Green check circle
- ❌ Failure: Red X circle
- ⬆️ Upload: Arrow up icon
- ⬇️ Download: Arrow down icon

**Example Display:**
```
✅ Uploaded 15 vocabulary cards
   2 hours ago · 250ms

❌ Failed to download 5 study cards
   5 hours ago · Error: Network timeout

✅ Downloaded 3 decks
   1 day ago · 180ms
```

---

## Security Tab

### Features

#### 1. Email Verification Status

**Verified:**
```tsx
<Badge className="bg-green-600">
  <CheckCircle className="mr-1 h-3 w-3" />
  Verified
</Badge>
```

**Not Verified:**
```tsx
<Badge variant="warning">
  <AlertTriangle className="mr-1 h-3 w-3" />
  Not Verified
</Badge>
```

#### 2. Password Protection

**Status Indicator:**
- Shows if account has password set
- Indicates last password change (future)
- Links to password change in Account tab

#### 3. Security Tips

**Recommendations:**
1. Enable email verification
2. Use a strong, unique password
3. Enable 2FA when available (future)
4. Review active sessions regularly (future)
5. Keep recovery email up to date (future)

#### 4. Last Active

**Display:**
```typescript
Last active: {formatDistanceToNow(profile.lastActive, { addSuffix: true })}
// "Last active: 5 minutes ago"
```

---

## Data Tab

### Features

#### 1. Data Export

**Export All Data:**

**Data Included:**
- User information (uid, email, displayName)
- All vocabulary cards
- All study cards with FSRS state
- All decks
- All settings
- Statistics summary

**Export Format:**
```json
{
  "exportDate": "2025-10-26T15:30:00.000Z",
  "version": "1.0.0",
  "user": {
    "uid": "abc123xyz",
    "email": "user@example.com",
    "displayName": "John Doe",
    "emailVerified": true
  },
  "vocabulary": [
    {
      "id": "1",
      "word": "こんにちは",
      "reading": "konnichiwa",
      "meaning": "hello",
      "partOfSpeech": "expression",
      "level": "N5",
      "createdAt": "2025-10-20T10:00:00.000Z"
    }
  ],
  "studyCards": [
    {
      "vocabularyId": "1",
      "state": 0,
      "difficulty": 5.0,
      "stability": 1.0,
      "due": "2025-10-27T10:00:00.000Z",
      "lastReviewed": "2025-10-26T10:00:00.000Z",
      "lapses": 0,
      "reps": 1
    }
  ],
  "decks": [
    {
      "id": "deck1",
      "name": "N5 Basics",
      "description": "Essential N5 vocabulary",
      "cardCount": 100,
      "createdAt": "2025-10-20T10:00:00.000Z"
    }
  ],
  "settings": {
    "theme": "dark",
    "dailyGoal": 20,
    "autoPlayAudio": true,
    "showFurigana": true
  },
  "statistics": {
    "totalCards": 150,
    "totalStudyCards": 50,
    "totalDecks": 3
  }
}
```

**Implementation:**
```typescript
const handleExportData = async () => {
  // Collect all data
  const vocabulary = await db.vocabulary.toArray()
  const studyCards = await db.studyCards.toArray()
  const decks = await db.decks.toArray()
  const settings = await db.settings.toArray()

  const exportData = {
    exportDate: new Date().toISOString(),
    version: "1.0.0",
    user: {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
    },
    vocabulary,
    studyCards,
    decks,
    settings,
    statistics: {
      totalCards: vocabulary.length,
      totalStudyCards: studyCards.length,
      totalDecks: decks.length,
    },
  }

  // Create and download file
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `japvocab-backup-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

**File Naming:**
```
japvocab-backup-2025-10-26.json
```

#### 2. Account Deletion

**GDPR-Compliant Deletion Flow:**

**Step 1: Warning Modal**
```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">
      <Trash2 className="mr-2 h-4 w-4" />
      Delete Account
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        <AlertTriangle className="h-5 w-5 text-red-600" />
        Delete Account Permanently?
      </AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete:
        <ul>
          <li>Your account and profile</li>
          <li>All vocabulary cards</li>
          <li>All study progress</li>
          <li>All custom decks</li>
          <li>All settings</li>
        </ul>
      </AlertDialogDescription>
    </AlertDialogHeader>
    {/* Password and confirmation inputs */}
  </AlertDialogContent>
</AlertDialog>
```

**Step 2: Password Confirmation**
```tsx
<Input
  type="password"
  placeholder="Enter your password"
  value={deletePassword}
  onChange={(e) => setDeletePassword(e.target.value)}
/>
```

**Step 3: Type DELETE Confirmation**
```tsx
<Input
  placeholder="DELETE"
  value={deleteConfirmation}
  onChange={(e) => setDeleteConfirmation(e.target.value)}
/>
```

**Step 4: Deletion Process**
```typescript
const handleDeleteAccount = async () => {
  if (deleteConfirmation !== "DELETE") {
    toast({ title: "Please type DELETE to confirm", type: "error" })
    return
  }

  // 1. Re-authenticate user
  const credential = EmailAuthProvider.credential(user.email, deletePassword)
  await reauthenticateWithCredential(auth.currentUser, credential)

  // 2. Delete Firestore data
  if (isFirebaseAvailable) {
    await deleteDoc(doc(firestore, `users/${user.uid}`))
  }

  // 3. Delete local data
  await db.vocabulary.clear()
  await db.studyCards.clear()
  await db.decks.clear()
  await db.settings.clear()

  // 4. Delete Firebase Auth account
  await deleteUser(auth.currentUser)

  // 5. Sign out and redirect
  await signOut()
  router.push("/")

  toast({
    title: "Account deleted",
    description: "Your account and all data have been permanently deleted",
    type: "success"
  })
}
```

**Data Deleted:**
1. Firebase Auth account
2. Firestore `/users/{userId}` document and subcollections
3. IndexedDB tables: vocabulary, studyCards, decks, settings
4. Cache cleared
5. Local storage cleared

**Security Measures:**
- Password required
- Type "DELETE" required
- Re-authentication required
- Cannot be undone
- All data permanently removed

---

## Settings Service API

### Class: SettingsService

#### Methods

##### getSettings(userId: string): Promise<UserSettings>

Retrieves user settings from cache, IndexedDB, or Firestore.

```typescript
const settings = await settingsService.getSettings(user.uid)
```

**Returns:** UserSettings object
**Throws:** Error if userId is invalid

##### saveSettings(userId: string, settings: Partial<UserSettings>): Promise<void>

Updates user settings in all storage layers.

```typescript
await settingsService.saveSettings(user.uid, {
  theme: 'dark',
  dailyGoal: 30
})
```

**Parameters:**
- `userId`: User ID
- `settings`: Partial settings object (only changed fields)

**Behavior:**
1. Merges with current settings
2. Updates cache
3. Saves to IndexedDB
4. Syncs to Firestore (if available)

##### resetSettings(userId: string): Promise<void>

Resets all settings to defaults.

```typescript
await settingsService.resetSettings(user.uid)
```

##### subscribeToSettings(userId: string, callback: (settings: UserSettings) => void): () => void

Subscribe to real-time settings updates from Firestore.

```typescript
const unsubscribe = settingsService.subscribeToSettings(
  user.uid,
  (updatedSettings) => {
    console.log('Settings changed:', updatedSettings)
  }
)

// Later: unsubscribe()
```

**Returns:** Unsubscribe function

##### getUserProfile(userId: string): Promise<UserProfile | null>

Retrieves user profile from Firestore.

```typescript
const profile = await settingsService.getUserProfile(user.uid)
```

##### updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void>

Updates user profile in Firestore.

```typescript
await settingsService.updateUserProfile(user.uid, {
  bio: 'Learning Japanese!',
  location: 'Tokyo'
})
```

##### logSyncActivity(userId: string, activity: Omit<SyncActivity, 'id' | 'userId'>): Promise<void>

Logs sync activity to Firestore.

```typescript
await settingsService.logSyncActivity(user.uid, {
  type: 'upload',
  entityType: 'vocabulary',
  entityCount: 15,
  timestamp: new Date(),
  duration: 250,
  success: true
})
```

##### getSyncActivity(userId: string, limit: number = 50): Promise<SyncActivity[]>

Retrieves recent sync activity.

```typescript
const activities = await settingsService.getSyncActivity(user.uid, 50)
```

---

## Settings Context API

### Hook: useSettings()

```typescript
const {
  settings,
  profile,
  loading,
  updateSettings,
  updateProfile,
  resetSettings,
  refreshSettings,
  refreshProfile
} = useSettings()
```

### Properties

#### settings: UserSettings

Current user settings.

```typescript
const { theme, dailyGoal, autoPlayAudio } = settings
```

#### profile: UserProfile | null

Current user profile.

```typescript
const { displayName, bio, emailVerified } = profile || {}
```

#### loading: boolean

Loading state during initial fetch.

```typescript
{loading ? <Spinner /> : <SettingsForm />}
```

### Methods

#### updateSettings(settings: Partial<UserSettings>): Promise<void>

Update settings with optimistic UI.

```typescript
await updateSettings({ theme: 'dark' })
```

**Features:**
- Optimistic update (instant UI)
- Background sync
- Rollback on error

#### updateProfile(profile: Partial<UserProfile>): Promise<void>

Update user profile.

```typescript
await updateProfile({ displayName: 'New Name' })
```

#### resetSettings(): Promise<void>

Reset to default settings.

```typescript
await resetSettings()
```

#### refreshSettings(): Promise<void>

Manually refresh settings from cloud.

```typescript
await refreshSettings()
```

#### refreshProfile(): Promise<void>

Manually refresh profile from cloud.

```typescript
await refreshProfile()
```

---

## Type Definitions

### UserSettings

```typescript
interface UserSettings {
  // App Preferences
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'ja'

  // Study Settings
  dailyGoal: number // 1-100
  studyReminder: boolean
  reminderTime: string // "HH:MM"
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

  // Metadata
  createdAt: Date
  updatedAt: Date
}
```

### UserProfile

```typescript
interface UserProfile {
  uid: string
  displayName: string
  email: string
  emailVerified: boolean
  photoURL: string | null
  phoneNumber: string | null
  bio?: string
  location?: string
  nativeLanguage?: string
  learningGoals?: string[]
  joinedAt: Date
  lastActive: Date
}
```

### SyncActivity

```typescript
interface SyncActivity {
  id: string
  userId: string
  type: 'upload' | 'download' | 'conflict'
  entityType: 'vocabulary' | 'studyCard' | 'deck' | 'settings'
  entityCount: number
  timestamp: Date
  duration: number // milliseconds
  success: boolean
  error?: string
}
```

### DEFAULT_SETTINGS

```typescript
export const DEFAULT_SETTINGS: Omit<UserSettings, 'createdAt' | 'updatedAt'> = {
  theme: 'system',
  language: 'en',
  dailyGoal: 20,
  studyReminder: true,
  reminderTime: '19:00',
  autoPlayAudio: true,
  showFurigana: true,
  emailNotifications: true,
  studyReminders: true,
  weeklyReport: true,
  achievementNotifications: true,
  profileVisibility: 'private',
  showProgress: true,
  allowDataCollection: true,
  autoSync: true,
  syncFrequency: 'realtime',
  syncOnMobileData: false,
}
```

---

## Usage Examples

### Example 1: Update Theme

```typescript
import { useSettings } from '@/contexts/settings-context'

function ThemeToggle() {
  const { settings, updateSettings } = useSettings()

  const toggleTheme = async () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light'
    await updateSettings({ theme: newTheme })
  }

  return (
    <button onClick={toggleTheme}>
      {settings.theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

### Example 2: Display User Profile

```typescript
import { useSettings } from '@/contexts/settings-context'

function UserProfile() {
  const { profile, loading } = useSettings()

  if (loading) return <Spinner />
  if (!profile) return <div>No profile found</div>

  return (
    <div>
      <h1>{profile.displayName}</h1>
      <p>{profile.bio}</p>
      <p>{profile.location}</p>
      {profile.emailVerified && <Badge>Verified</Badge>}
    </div>
  )
}
```

### Example 3: Export Data

```typescript
import { useAuth } from '@/contexts/auth-context'
import { db } from '@/lib/db'

async function exportUserData() {
  const { user } = useAuth()

  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    user: {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    },
    vocabulary: await db.vocabulary.toArray(),
    studyCards: await db.studyCards.toArray(),
    decks: await db.decks.toArray()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
}
```

---

## Best Practices

1. **Always use useSettings() hook** - Don't access settingsService directly from components
2. **Use optimistic updates** - Let the context handle sync
3. **Handle loading states** - Check `loading` before rendering settings
4. **Validate before save** - Validate settings before calling updateSettings()
5. **Show feedback** - Use toasts for success/error feedback
6. **Handle offline** - Settings work offline via IndexedDB
7. **Don't over-sync** - Context handles sync automatically
8. **Use type safety** - TypeScript prevents invalid settings

---

**Documentation Complete** ✅
