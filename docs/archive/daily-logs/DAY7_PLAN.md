# Day 7 Implementation Plan

## 🎯 Objectives

### Primary Goals
1. **Firebase Authentication** - Google & Email/Password sign-in
2. **Cloud Sync** - Firestore integration for multi-device support
3. **User Profiles** - Manage user data and preferences
4. **Protected Routes** - Authentication-required pages
5. **Sync Strategy** - IndexedDB ↔ Firestore synchronization

### Success Criteria
- ✅ Users can sign up/login with Google or Email
- ✅ User data syncs across devices
- ✅ Offline-first with background sync
- ✅ Conflict resolution for concurrent edits
- ✅ Secure user isolation (can't see others' data)

---

## 🏗️ Architecture

### Authentication Flow
```
User → Auth UI → Firebase Auth → User Profile → Firestore
                      ↓
                User Session (persisted)
                      ↓
                Protected Routes
```

### Data Sync Strategy
```
IndexedDB (Local) ↔ Sync Service ↔ Firestore (Cloud)
      ↓                                    ↓
  Offline-first                      Multi-device
  Instant access                     Persistence
```

### Conflict Resolution
```
Last Write Wins (LWW) with timestamps
- Compare updatedAt timestamps
- Keep most recent version
- Notify user of conflicts (optional)
```

---

## 📦 Dependencies to Install

```bash
npm install firebase
npm install @firebase/auth
npm install @firebase/firestore
npm install @firebase/app
```

---

## 🔧 Implementation Steps

### Phase 1: Firebase Setup (30 min)
1. Install Firebase SDK
2. Create Firebase config file
3. Initialize Firebase app
4. Set up environment variables

### Phase 2: Authentication (60 min)
1. Create Auth Service
2. Google Sign-In provider
3. Email/Password provider
4. Auth state persistence
5. Sign-out functionality

### Phase 3: Auth UI (45 min)
1. Login page component
2. Signup page component
3. Auth context provider
4. Protected route wrapper
5. User profile dropdown

### Phase 4: Firestore Integration (90 min)
1. Create Firestore service
2. User data schema
3. Vocabulary sync
4. Study cards sync
5. Decks sync
6. Settings sync

### Phase 5: Sync Strategy (60 min)
1. Background sync worker
2. Conflict resolution
3. Sync status indicator
4. Manual sync trigger
5. Error recovery

### Phase 6: Multi-User Support (45 min)
1. Update database service with userId
2. Update all queries with user filter
3. User isolation in Firestore
4. Security rules

### Phase 7: Testing & Docs (45 min)
1. Test authentication flow
2. Test sync functionality
3. Test conflict resolution
4. Create documentation
5. Update README

**Total Estimated Time**: ~6 hours

---

## 🗂️ File Structure

```
src/
├── lib/
│   ├── firebase.ts              (NEW) Firebase config & init
│   └── firestore.service.ts     (NEW) Firestore operations
├── services/
│   ├── auth.service.ts          (NEW) Authentication logic
│   └── sync.service.ts          (NEW) Sync coordination
├── contexts/
│   └── auth-context.tsx         (NEW) Auth state management
├── components/
│   ├── auth/
│   │   ├── login-form.tsx       (NEW) Login UI
│   │   ├── signup-form.tsx      (NEW) Signup UI
│   │   └── protected-route.tsx  (NEW) Route guard
│   ├── user-profile.tsx         (NEW) User dropdown
│   └── sync-indicator.tsx       (NEW) Sync status
└── app/
    ├── login/
    │   └── page.tsx             (NEW) Login page
    ├── signup/
    │   └── page.tsx             (NEW) Signup page
    └── layout.tsx               (UPDATE) Add auth provider
```

---

## 🔐 Security Considerations

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /users/{userId}/vocabulary/{cardId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /users/{userId}/studyCards/{cardId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Environment Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## 📊 Data Schema

### Firestore Collections

```typescript
/users/{userId}
  - uid: string
  - email: string
  - displayName: string
  - photoURL: string
  - createdAt: Timestamp
  - lastSyncAt: Timestamp
  - settings: {
      theme: string
      dailyGoal: number
      notifications: boolean
      // ... other settings
    }

/users/{userId}/vocabulary/{cardId}
  - id: string
  - kanji: string
  - kana: string
  - meaning: string[]
  - jlptLevel: string
  - tags: string[]
  - examples: Example[]
  - createdAt: Timestamp
  - updatedAt: Timestamp

/users/{userId}/studyCards/{cardId}
  - vocabularyId: string
  - state: number
  - due: Timestamp
  - stability: number
  - difficulty: number
  - // ... FSRS fields
  - updatedAt: Timestamp

/users/{userId}/decks/{deckId}
  - name: string
  - description: string
  - cardIds: string[]
  - jlptLevel: string
  - visibility: string
  - createdAt: Timestamp
  - updatedAt: Timestamp
```

---

## 🔄 Sync Strategy Details

### Initial Sync (First Login)
1. Upload all local IndexedDB data to Firestore
2. Tag with user ID
3. Mark as synced

### Background Sync (Ongoing)
1. Listen for local changes (IndexedDB)
2. Queue changes for upload
3. Upload when online
4. Listen for remote changes (Firestore)
5. Download and merge to IndexedDB

### Conflict Resolution
```typescript
interface SyncConflict {
  local: VocabularyCard
  remote: VocabularyCard
  resolution: 'local' | 'remote' | 'merge'
}

// Strategy: Last Write Wins
function resolveConflict(local, remote) {
  if (local.updatedAt > remote.updatedAt) {
    return 'local'
  } else {
    return 'remote'
  }
}
```

---

## 🎨 UI Components

### Login Page
- Email/password form
- Google sign-in button
- "Forgot password" link
- "Sign up" link
- Error messages

### Signup Page
- Email/password form
- Display name field
- Terms & conditions checkbox
- Google sign-up button
- "Already have account" link

### User Profile Dropdown
- User avatar
- Display name
- Email
- Settings link
- Sync status
- Sign out button

### Sync Indicator
- Cloud icon
- "Syncing..." state
- "Synced" state
- "Offline" state
- Last sync time
- Manual sync button

---

## 🧪 Testing Checklist

### Authentication
- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] Sign in with Google
- [ ] Sign out
- [ ] Password reset
- [ ] Session persistence
- [ ] Protected routes work

### Sync
- [ ] Initial sync uploads local data
- [ ] Changes sync to Firestore
- [ ] Remote changes download to local
- [ ] Offline changes queue properly
- [ ] Conflicts resolve correctly
- [ ] Multi-device sync works

### Security
- [ ] User can only see own data
- [ ] Security rules enforced
- [ ] API keys secure
- [ ] No data leakage between users

---

## 🚀 Deployment Notes

### Firebase Setup Required
1. Create Firebase project
2. Enable Authentication (Google + Email/Password)
3. Create Firestore database
4. Set security rules
5. Get configuration keys
6. Add to .env.local

### Environment Setup
```bash
# Create .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 📝 Documentation Deliverables

1. **DAY7_SUMMARY.md** - Implementation summary
2. **DAY7_FEATURES.md** - Feature documentation
3. **DAY7_QUICKSTART.md** - Setup and testing guide
4. **FIREBASE_SETUP.md** - Firebase configuration guide

---

## ⚠️ Important Notes

### Development Mode
- Can use Firebase emulators for testing
- No real Firebase project needed initially
- Can mock authentication for development

### Production Mode
- Real Firebase project required
- Environment variables must be set
- Security rules must be deployed
- HTTPS required for auth

### Fallback Strategy
- App still works 100% offline without Firebase
- Firebase is optional enhancement
- Local-only mode fully functional

---

**Ready to implement!** 🚀
