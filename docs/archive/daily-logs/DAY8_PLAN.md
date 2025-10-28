# Day 8: User Settings, Profile Management & Enhanced Security

**Date:** 2025-10-26
**Status:** Planning
**Estimated Time:** 3-4 hours

## Overview

Day 8 focuses on enhancing user experience with comprehensive settings management, profile customization, email verification, and advanced security features. We'll build on Day 7's authentication foundation to create a complete user account management system.

## Goals

1. ✅ Comprehensive settings page with multiple tabs
2. ✅ User settings sync across devices (theme, preferences, etc.)
3. ✅ Profile management (edit name, photo, email)
4. ✅ Email verification flow
5. ✅ Password change functionality
6. ✅ Account deletion (GDPR-compliant)
7. ✅ Data export (download all user data)
8. ✅ Sync history and activity log
9. ✅ Notification preferences
10. ✅ Session management (view active devices)

## Architecture

### Settings Data Structure

```typescript
interface UserSettings {
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

  // Metadata
  createdAt: Date
  updatedAt: Date
}

interface UserProfile {
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
  joinedAt: Date
  lastActive: Date
}

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

interface ActiveSession {
  id: string
  userId: string
  deviceInfo: {
    browser: string
    os: string
    device: string
    ip?: string
  }
  lastActive: Date
  createdAt: Date
}
```

### Firestore Structure

```
/users/{userId}
  - profile (document)
    - displayName, email, photoURL, bio, etc.

  - settings (document)
    - theme, dailyGoal, notifications, etc.

  - /vocabulary/{cardId}
  - /studyCards/{vocabularyId}
  - /decks/{deckId}

  - /syncActivity/{activityId}
    - type, entityType, timestamp, success, etc.

  - /sessions/{sessionId}
    - deviceInfo, lastActive, createdAt
```

### Settings Service Architecture

```
┌────────────────────────────────────────────────┐
│           Settings Management System           │
│                                                │
│  ┌──────────────┐      ┌──────────────┐       │
│  │   Settings   │◄────►│  Firestore   │       │
│  │   Service    │      │   (Cloud)    │       │
│  └──────┬───────┘      └──────────────┘       │
│         │                                       │
│         ▼                                       │
│  ┌──────────────┐      ┌──────────────┐       │
│  │  IndexedDB   │      │ React Context│       │
│  │   (Local)    │      │  (Settings)  │       │
│  └──────────────┘      └──────────────┘       │
│                                                │
│  ┌──────────────────────────────────────┐    │
│  │         Settings UI                   │    │
│  │  ┌─────────┬──────────┬──────────┐  │    │
│  │  │ Account │ Preferences│ Privacy │  │    │
│  │  └─────────┴──────────┴──────────┘  │    │
│  │  ┌─────────┬──────────┬──────────┐  │    │
│  │  │  Sync   │  Security │  Data   │  │    │
│  │  └─────────┴──────────┴──────────┘  │    │
│  └──────────────────────────────────────┘    │
└────────────────────────────────────────────────┘
```

## Features to Implement

### 1. Settings Page with Tabs

**Component:** `src/app/settings/page.tsx`

Tabs:
1. **Account** - Profile, email, password
2. **Preferences** - Theme, language, study settings
3. **Privacy** - Visibility, data collection
4. **Sync** - Sync settings, activity log
5. **Security** - Email verification, sessions, 2FA (future)
6. **Data** - Export, delete account

### 2. Settings Service

**File:** `src/services/settings.service.ts`

Methods:
- `getSettings(userId)` - Fetch settings from Firestore
- `updateSettings(userId, settings)` - Update settings
- `syncSettings(userId)` - Sync with cloud
- `resetSettings(userId)` - Reset to defaults
- `exportSettings(userId)` - Export as JSON

### 3. Profile Management

**Component:** `src/components/settings/profile-settings.tsx`

Features:
- Edit display name
- Upload/change profile photo
- Change email address
- Verify email
- Update bio and location
- Set native language
- Define learning goals

### 4. Email Verification

**Flow:**
1. User signs up → email sent automatically
2. User clicks verify button in settings
3. Firebase sends verification email
4. User clicks link in email
5. App detects verification and updates UI

**Components:**
- `src/components/settings/email-verification.tsx`
- Email template customization in Firebase Console

### 5. Password Change

**Component:** `src/components/settings/change-password.tsx`

Features:
- Require current password
- New password validation
- Confirmation field
- Strength indicator
- Success/error feedback

### 6. Account Deletion

**Component:** `src/components/settings/delete-account.tsx`

GDPR-Compliant Flow:
1. User clicks "Delete Account"
2. Show warning modal with consequences
3. Require password confirmation
4. Delete all user data from Firestore
5. Delete Firebase Auth account
6. Clear local data
7. Redirect to homepage

### 7. Data Export

**Component:** `src/components/settings/export-data.tsx`

Export Format (JSON):
```json
{
  "export_date": "2025-10-26T12:00:00Z",
  "user": {
    "uid": "abc123",
    "email": "user@example.com",
    "displayName": "Test User"
  },
  "vocabulary": [...],
  "studyCards": [...],
  "decks": [...],
  "settings": {...},
  "statistics": {...}
}
```

### 8. Sync Activity Log

**Component:** `src/components/settings/sync-activity.tsx`

Display:
- Recent sync events (last 50)
- Upload/download counts
- Conflict resolutions
- Error logs
- Sync duration
- Filter by date/type

### 9. Notification Preferences

**Component:** `src/components/settings/notification-settings.tsx`

Options:
- Email notifications on/off
- Study reminders
- Weekly progress report
- Achievement notifications
- New features announcements

### 10. Session Management

**Component:** `src/components/settings/active-sessions.tsx`

Features:
- List all active sessions
- Show device info (browser, OS)
- Last active time
- Sign out from specific session
- Sign out from all other sessions

### 11. Advanced Security

**Component:** `src/components/settings/security-settings.tsx`

Features:
- Email verification status
- Last password change
- Active sessions count
- 2FA setup (future)
- Recovery email (future)

## Implementation Plan

### Phase 1: Settings Infrastructure (1 hour)

1. **Create Settings Service**
   - `src/services/settings.service.ts`
   - CRUD operations for settings
   - Sync with Firestore

2. **Create Settings Context**
   - `src/contexts/settings-context.tsx`
   - Global settings state
   - Auto-sync on changes

3. **Update Database Schema**
   - Add settings table to IndexedDB
   - Migration script if needed

### Phase 2: Settings UI (1.5 hours)

1. **Settings Page Layout**
   - Tabbed interface
   - Responsive design
   - Loading states

2. **Account Tab**
   - Profile settings
   - Email verification
   - Change password

3. **Preferences Tab**
   - Theme selector
   - Language selector
   - Study preferences

4. **Privacy Tab**
   - Visibility settings
   - Data collection toggle

5. **Sync Tab**
   - Sync frequency
   - Activity log
   - Manual sync button

6. **Security Tab**
   - Active sessions
   - Security status

7. **Data Tab**
   - Export data button
   - Delete account button

### Phase 3: Advanced Features (1 hour)

1. **Email Verification**
   - Send verification email
   - Check verification status
   - Resend email option

2. **Password Change**
   - Current password validation
   - New password strength
   - Update password

3. **Account Deletion**
   - Warning modal
   - Confirmation flow
   - Data cleanup

4. **Data Export**
   - Collect all user data
   - Format as JSON
   - Download file

### Phase 4: Testing & Documentation (0.5 hours)

1. **Testing**
   - Test all settings changes
   - Test sync across devices
   - Test email verification
   - Test account deletion

2. **Documentation**
   - DAY8_SUMMARY.md
   - DAY8_FEATURES.md
   - DAY8_QUICKSTART.md

## Security Considerations

### Email Verification
- Send verification on signup
- Block certain features until verified
- Resend email with rate limiting

### Password Changes
- Require current password
- Minimum 8 characters
- Mix of letters, numbers, symbols
- Rate limit attempts

### Account Deletion
- Require password confirmation
- Irreversible warning
- Delete all data (Firestore + Auth)
- Clear local storage

### Data Export
- Only authenticated users
- Rate limit to prevent abuse
- Include metadata for transparency

### Session Management
- Track all active sessions
- Allow remote sign-out
- Detect suspicious activity

## UI/UX Considerations

### Settings Page
- Clean, organized tabs
- Clear labels and descriptions
- Instant feedback on changes
- Loading states for async operations
- Success/error toasts

### Profile Photo Upload
- Drag-and-drop support
- Image preview before upload
- Crop/resize functionality (future)
- Firebase Storage integration

### Form Validation
- Real-time validation
- Clear error messages
- Disabled submit until valid
- Prevent duplicate submissions

### Dangerous Actions
- Red color for destructive actions
- Confirmation modals
- "Are you sure?" dialogs
- Undo option where possible

## Performance Optimizations

### Settings Sync
- Debounce setting changes (500ms)
- Batch multiple changes
- Optimistic UI updates
- Background sync

### Activity Log
- Paginate results (50 per page)
- Virtual scrolling for long lists
- Cache in IndexedDB
- Lazy load details

### Profile Photo
- Compress images before upload
- Generate thumbnails
- Use CDN (Firebase Storage)
- Lazy load images

## Success Metrics

After Day 8, users should be able to:
- ✅ Customize all app preferences
- ✅ Manage their profile information
- ✅ Verify their email address
- ✅ Change their password securely
- ✅ View sync activity history
- ✅ Manage active sessions
- ✅ Export all their data
- ✅ Delete their account (GDPR)
- ✅ See settings sync across devices

## Dependencies

### New NPM Packages (if needed)
```bash
# Image handling (if adding photo upload)
npm install react-dropzone

# Date formatting
npm install date-fns

# Copy to clipboard
npm install react-copy-to-clipboard
```

### Firebase Features
- Firebase Auth (already installed)
- Firestore (already installed)
- Firebase Storage (for profile photos - optional)

## File Structure

```
src/
├── app/
│   └── settings/
│       └── page.tsx                    # Settings page
│
├── components/
│   └── settings/
│       ├── profile-settings.tsx        # Profile management
│       ├── preference-settings.tsx     # App preferences
│       ├── privacy-settings.tsx        # Privacy options
│       ├── sync-settings.tsx           # Sync configuration
│       ├── security-settings.tsx       # Security features
│       ├── data-settings.tsx           # Export/delete
│       ├── email-verification.tsx      # Email verify component
│       ├── change-password.tsx         # Password change
│       ├── delete-account.tsx          # Account deletion
│       ├── export-data.tsx             # Data export
│       ├── sync-activity.tsx           # Activity log
│       └── active-sessions.tsx         # Session management
│
├── services/
│   └── settings.service.ts             # Settings CRUD
│
├── contexts/
│   └── settings-context.tsx            # Settings state
│
└── types/
    └── settings.ts                     # Settings types
```

## Testing Checklist

- [ ] Settings sync to Firestore
- [ ] Settings sync across devices
- [ ] Theme changes apply immediately
- [ ] Email verification sends email
- [ ] Email verification updates status
- [ ] Password change works
- [ ] Password change requires current password
- [ ] Account deletion removes all data
- [ ] Data export downloads JSON
- [ ] Sync activity log shows recent events
- [ ] Active sessions list updates
- [ ] Remote sign-out works
- [ ] All forms validate properly
- [ ] All error states handled
- [ ] All loading states shown

## Deliverables

1. ✅ Fully functional settings page
2. ✅ Settings sync service
3. ✅ Profile management
4. ✅ Email verification
5. ✅ Password change
6. ✅ Account deletion
7. ✅ Data export
8. ✅ Sync activity log
9. ✅ Session management
10. ✅ Comprehensive documentation

## Timeline

- **Planning:** 15 minutes ✅
- **Settings Infrastructure:** 1 hour
- **Settings UI:** 1.5 hours
- **Advanced Features:** 1 hour
- **Testing:** 30 minutes
- **Documentation:** 30 minutes

**Total:** ~3.5-4 hours

## Next Steps After Day 8

With settings and profile management complete, Day 9 could focus on:
1. **Content Expansion** - Add N3 vocabulary
2. **Analytics Dashboard** - Detailed progress tracking
3. **Premium Features** - Stripe integration
4. **Social Features** - Deck sharing, leaderboards

---

Let's build a comprehensive settings system that gives users full control over their learning experience! 🎯
