# Day 7: Firebase Authentication & Cloud Sync - Quick Start Guide

## Table of Contents

1. [Setup Firebase (5 minutes)](#setup-firebase)
2. [Test Authentication (2 minutes)](#test-authentication)
3. [Test Cloud Sync (3 minutes)](#test-cloud-sync)
4. [Test Offline Mode (2 minutes)](#test-offline-mode)
5. [Troubleshooting](#troubleshooting)

---

## Setup Firebase

### Option 1: Use Firebase (Recommended for Production)

#### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `japvocab` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

#### Step 2: Enable Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click "Get started"
3. Enable **Email/Password** provider
4. Enable **Google** provider (add support email)
5. Click "Save"

#### Step 3: Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click "Create database"
3. Start in **Test mode** (for development)
4. Choose location (e.g., `us-central1`)
5. Click "Enable"

#### Step 4: Set Security Rules

1. In Firestore Database, go to **Rules** tab
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

#### Step 5: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click web icon (</>) to add web app
4. Register app name: `japvocab-web`
5. Click "Register app"
6. Copy the config object:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc"
};
```

#### Step 6: Configure Environment

1. Create `.env.local` in project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
```

2. **IMPORTANT**: Add to `.gitignore`:
```
.env.local
```

3. Restart dev server:
```bash
npm run dev
```

### Option 2: Skip Firebase (Offline Only)

**Don't create `.env.local` file.**

App will run in offline-only mode:
- ✅ All vocabulary features work
- ✅ Study sessions work
- ✅ Data stored locally in IndexedDB
- ❌ No multi-user support
- ❌ No cross-device sync
- ❌ No cloud backup

---

## Test Authentication

### Test Email Signup

1. Start dev server:
```bash
npm run dev
```

2. Open http://localhost:3000

3. Click **Sign In** in header

4. Click **Sign up** link at bottom

5. Fill in signup form:
   - Display Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`

6. Click **Sign Up**

7. ✅ Should redirect to homepage
8. ✅ Should see user profile in header
9. ✅ Should see "Synced" indicator in top-right

**Verify in Firebase Console:**
- Go to **Authentication → Users**
- Should see `test@example.com`

### Test Email Login

1. Click user profile → **Sign Out**

2. Click **Sign In** in header

3. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`

4. Click **Sign In**

5. ✅ Should redirect to homepage
6. ✅ Should see user profile
7. ✅ Should see sync indicator

### Test Google OAuth

1. Sign out if signed in

2. Click **Sign In** in header

3. Click **Continue with Google** button

4. Select Google account in popup

5. ✅ Should redirect to homepage
6. ✅ Should see Google profile picture
7. ✅ Should see Google display name

**Note:** First-time Google users auto-create account

### Test Sign Out

1. Click user profile in header

2. Click **Sign Out**

3. ✅ Should see sign-in button appear
4. ✅ Should remove user profile
5. ✅ Should stop sync indicator

---

## Test Cloud Sync

### Test Initial Sync (Upload)

1. **Before signing in:**
   - Go to http://localhost:3000/manage
   - Add 5 vocabulary cards manually

2. **Sign in:**
   - Click **Sign In** → sign in with test account
   - Wait for "Synced" indicator

3. **Verify in Firebase Console:**
   - Go to **Firestore Database**
   - Navigate to: `users/{userId}/vocabulary`
   - ✅ Should see 5 vocabulary cards

### Test Initial Sync (Download)

1. **Add cards in Firebase Console:**
   - Go to **Firestore Database**
   - Click "Start collection"
   - Collection ID: `users/{userId}/vocabulary`
   - Click "Next"
   - Add document with:
     ```json
     {
       "id": "test-card-1",
       "kanji": "本",
       "kana": "ほん",
       "meaning": "book",
       "jlptLevel": "N5",
       "createdAt": [current timestamp],
       "updatedAt": [current timestamp]
     }
     ```

2. **Open app in incognito window:**
   - Go to http://localhost:3000
   - Sign in with same account
   - Go to `/manage`
   - ✅ Should see "本" card appear

### Test Real-Time Sync

1. **Open app in two browser windows:**
   - Window A: http://localhost:3000/manage
   - Window B: http://localhost:3000/manage (incognito)
   - Sign in to same account in both

2. **Add card in Window A:**
   - Click "Add Vocabulary"
   - Add: 猫 (ねこ) = "cat"
   - Click Save

3. **Check Window B:**
   - ✅ Should see 猫 appear within 1-2 seconds
   - ✅ No page reload needed

### Test Conflict Resolution

1. **Go offline in Window A:**
   - Open DevTools (F12)
   - Network tab → set to "Offline"

2. **Edit same card in both windows:**
   - Window A (offline): Edit 猫 meaning to "kitty"
   - Window B (online): Edit 猫 meaning to "feline"
   - Wait 2 seconds for Window B to sync

3. **Go online in Window A:**
   - Network tab → set to "No throttling"
   - Wait for sync

4. **Check both windows:**
   - ✅ Both should show "feline" (last write wins)
   - ✅ No data loss
   - ✅ Deterministic outcome

---

## Test Offline Mode

### Test Offline Queue

1. **Go offline:**
   - Open DevTools (F12)
   - Network tab → set to "Offline"
   - ✅ Should see "Offline" indicator (gray cloud)

2. **Add 3 vocabulary cards:**
   - Go to `/manage`
   - Add 3 cards
   - ✅ Should see "3 changes queued" in sync indicator

3. **Go online:**
   - Network tab → set to "No throttling"
   - ✅ Should see "Syncing" indicator
   - ✅ Should change to "Synced" after 1-2 seconds

4. **Verify in Firebase Console:**
   - Check Firestore Database
   - ✅ Should see all 3 cards

### Test Offline Functionality

**While offline:**

✅ **Can study cards:**
- Go to `/study`
- Complete study session
- Progress saved locally

✅ **Can take quizzes:**
- Go to `/quiz`
- Complete quiz
- Results saved locally

✅ **Can add vocabulary:**
- Go to `/manage`
- Add/edit/delete cards
- Changes queued for sync

❌ **Cannot:**
- Sign up (requires network)
- Sign in (requires network)
- Reset password (requires network)

### Test Multi-Device Sync

#### Setup:
- Device 1: Desktop computer
- Device 2: Phone or tablet

#### Test Steps:

1. **Sign in on both devices:**
   - Use same account
   - Wait for initial sync

2. **Add card on Device 1:**
   - Go to `/manage`
   - Add card: 犬 (いぬ) = "dog"

3. **Check Device 2:**
   - Refresh page or wait 5-10 seconds
   - ✅ Should see 犬 appear

4. **Study on Device 2:**
   - Go to `/study`
   - Study the 犬 card
   - Grade it as "Good"

5. **Check Device 1:**
   - Go to `/study`
   - ✅ 犬 should not appear (already studied)
   - ✅ Next review date should be updated

---

## Troubleshooting

### Issue: "Firebase is not configured"

**Symptoms:**
- See "Offline Mode" indicator
- Can't sign up/sign in
- No sync happening

**Solutions:**

1. **Check `.env.local` exists:**
   ```bash
   ls -la .env.local
   ```

2. **Verify all variables set:**
   ```bash
   cat .env.local
   ```
   Should have 6 `NEXT_PUBLIC_FIREBASE_*` variables

3. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Check for typos:**
   - Variable names must be EXACT
   - No extra spaces
   - No quotes around values

### Issue: "Authentication failed"

**Symptoms:**
- "Failed to sign in" error
- "Email already in use"
- "Wrong password"

**Solutions:**

1. **Check Firebase Auth enabled:**
   - Firebase Console → Authentication
   - Email/Password provider enabled ✅
   - Google provider enabled ✅

2. **Verify email/password:**
   - Password must be 6+ characters
   - Email must be valid format

3. **Check browser console:**
   - Open DevTools (F12)
   - Console tab
   - Look for error messages

4. **Try different account:**
   - Use unique email
   - Or reset password for existing account

### Issue: "Sync not working"

**Symptoms:**
- Cards don't appear on other devices
- Changes not syncing
- "Pending" indicator stuck

**Solutions:**

1. **Check Firestore enabled:**
   - Firebase Console → Firestore Database
   - Database should be created
   - Rules should be set

2. **Verify security rules:**
   ```javascript
   match /users/{userId}/{document=**} {
     allow read, write: if request.auth != null
                       && request.auth.uid == userId;
   }
   ```

3. **Check network:**
   - DevTools → Network tab
   - Set to "No throttling"
   - Refresh page

4. **Manual sync:**
   - Click sync indicator
   - Click "Sync Now" button

5. **Check browser console:**
   - Look for sync errors
   - Check for 403 Forbidden (rules issue)
   - Check for network errors

### Issue: "Slow sync"

**Symptoms:**
- Sync takes >10 seconds
- Real-time updates delayed
- High Firebase usage

**Solutions:**

1. **Check Firestore indexes:**
   - Firebase Console → Firestore → Indexes
   - Create suggested indexes

2. **Reduce sync frequency:**
   - Edit `src/services/sync.service.ts`
   - Change `5 * 60 * 1000` to higher value

3. **Check network speed:**
   - DevTools → Network tab
   - Look for slow requests
   - Check WiFi connection

4. **Optimize Firestore queries:**
   - Add pagination
   - Limit results
   - Use indexes

### Issue: "Data not appearing"

**Symptoms:**
- Cards added on one device don't show on another
- Study progress not syncing
- Decks missing

**Solutions:**

1. **Check signed in:**
   - Click user profile
   - Should show email/name
   - If not, sign in again

2. **Check same account:**
   - Verify email matches on both devices
   - Firebase Console → Authentication → Users
   - Check UID matches

3. **Force refresh:**
   - DevTools → Application → Storage
   - Click "Clear site data"
   - Refresh page
   - Sign in again

4. **Check Firestore data:**
   - Firebase Console → Firestore Database
   - Navigate to `users/{userId}/vocabulary`
   - Verify data exists

### Issue: "Build errors"

**Symptoms:**
- `npm run build` fails
- TypeScript errors
- Linting errors

**Solutions:**

1. **Run type-check:**
   ```bash
   npm run type-check
   ```

2. **Fix TypeScript errors:**
   - Read error messages
   - Fix type mismatches
   - Add missing imports

3. **Update dependencies:**
   ```bash
   npm install
   ```

4. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run build
   ```

---

## Quick Reference

### Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Start production server
npm start

# Clear cache and rebuild
rm -rf .next && npm run build
```

### Useful URLs

- **App**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Signup**: http://localhost:3000/signup
- **Manage**: http://localhost:3000/manage
- **Study**: http://localhost:3000/study
- **Firebase Console**: https://console.firebase.google.com/

### Environment Variables

```env
# Required for Firebase integration
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Optional
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=... # Google Analytics
```

### Firebase Console Locations

- **Authentication**: Build → Authentication
- **Firestore**: Build → Firestore Database
- **Security Rules**: Firestore Database → Rules tab
- **Usage**: Build → Firestore Database → Usage tab
- **Logs**: Build → Firestore Database → Request logs

### Browser DevTools

**Useful panels:**
- **Console**: Error messages and logs
- **Network**: API requests and responses
- **Application**:
  - IndexedDB: Local database
  - Local Storage: Sync queue
  - Session Storage: Temp data
- **Lighthouse**: Performance audit

### Testing Checklist

- [ ] Email signup works
- [ ] Email login works
- [ ] Google OAuth works
- [ ] Sign out works
- [ ] Initial sync uploads local data
- [ ] Initial sync downloads cloud data
- [ ] Real-time sync works across tabs
- [ ] Offline queue works
- [ ] Multi-device sync works
- [ ] Conflict resolution works
- [ ] Offline mode works (no Firebase config)
- [ ] Production build succeeds

---

## Next Steps

### Recommended Actions

1. **Set up email verification:**
   - Firebase Console → Authentication → Templates
   - Customize email templates
   - Enable email verification requirement

2. **Configure domain:**
   - Firebase Console → Authentication → Settings
   - Add authorized domains
   - Set up custom domain

3. **Monitor usage:**
   - Firebase Console → Usage and billing
   - Set up billing alerts
   - Monitor Firestore reads/writes

4. **Add more security:**
   - Enable 2FA for Firebase project
   - Set up Firestore backup
   - Review security rules regularly

5. **Optimize costs:**
   - Add pagination to queries
   - Implement incremental sync
   - Cache frequently accessed data
   - Use Firestore TTL for cleanup

### Learning Resources

- **Firebase Auth**: https://firebase.google.com/docs/auth
- **Firestore**: https://firebase.google.com/docs/firestore
- **Security Rules**: https://firebase.google.com/docs/rules
- **Firebase Pricing**: https://firebase.google.com/pricing

### Community

- **GitHub Issues**: https://github.com/yourusername/japvocab/issues
- **Discord**: Join our community (coming soon)
- **Email**: support@japvocab.com (coming soon)

---

## Success! 🎉

You've successfully set up Firebase Authentication and Cloud Sync!

**What you can now do:**
- ✅ Sign up with email or Google
- ✅ Access your data from any device
- ✅ Study offline and sync later
- ✅ See real-time updates across devices
- ✅ Never lose your progress

**Happy learning! 🇯🇵📚**
