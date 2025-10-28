# Day 6 Quick Start Guide

## 🚀 Getting Started

### Test the New Features

#### 1. Start Development Server
```bash
npm run dev
```

Open http://localhost:3000

---

## 📱 Testing Offline Functionality

### Method 1: Chrome DevTools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Check **Offline** checkbox
4. Navigate around the app - everything still works!
5. Try adding/editing vocabulary
6. Try taking a quiz
7. Go back online - all changes persist

### Method 2: Service Worker

1. Build production version:
```bash
npm run build
npm start
```

2. Open http://localhost:3000
3. Open DevTools → **Application** tab → **Service Workers**
4. Verify service worker is registered
5. Check **Offline** in Network tab
6. Refresh page - app still loads!

---

## 🗄️ Testing Database Integration

### Management Page (/manage)

**Test Real-time Updates**:

1. **Open in two browser tabs** (side by side)
2. In tab 1: Add a new vocabulary card
3. Watch tab 2: Card appears automatically! ✨
4. In tab 1: Edit the card
5. Watch tab 2: Changes appear instantly! ✨
6. In tab 1: Delete the card
7. Watch tab 2: Card disappears! ✨

**Test Bulk Operations**:

1. Select multiple cards (checkboxes)
2. Add tags → changes appear immediately
3. Update JLPT level → instant update
4. Move to deck → real-time update

**Test Import/Export**:

1. Click "Import CSV"
2. Select a CSV file
3. Cards appear in real-time as they're imported
4. Click "Export All JSON"
5. File downloads with all current data

---

### Study Page (/study)

**Test Study Session**:

1. Go to `/study`
2. Watch loading spinner while database initializes
3. See due cards count (from database)
4. Start a study session
5. Grade some cards
6. Check IndexedDB (DevTools → Application → IndexedDB)
7. Verify FSRS data is saved

**Check Database**:

```javascript
// In browser console
await db.studyCards.toArray()
// See all your study cards with FSRS data!
```

---

### Quiz Page (/quiz)

**Test Live Vocabulary**:

1. Go to `/quiz`
2. Note the "Available cards" count
3. **In another tab**, go to `/manage`
4. Add a new card
5. **Go back to `/quiz` tab**
6. Refresh is NOT needed - count updates automatically!
7. Start quiz - new card is available immediately

---

## 🔍 Inspecting IndexedDB

### Chrome DevTools

1. Open DevTools (F12)
2. Go to **Application** tab
3. Expand **IndexedDB** → **JapVocabDB**
4. Click on tables:
   - `vocabulary` - all your cards
   - `studyCards` - FSRS scheduling data
   - `decks` - your decks
   - `sessions` - study sessions
   - `settings` - user preferences

5. Right-click any table → **Clear** to reset data

### View Live Data

```javascript
// In browser console
// Get all vocabulary
await db.vocabulary.toArray()

// Get cards by JLPT level
await db.vocabulary.where('jlptLevel').equals('N5').toArray()

// Get due cards
await db.studyCards.where('due').below(new Date()).toArray()

// Get all decks
await db.decks.toArray()

// Clear all data (be careful!)
await db.delete()
```

---

## 🧪 Testing Scenarios

### Scenario 1: Offline Learning

```
1. Start app (online)
2. Navigate to /study
3. Go offline (DevTools → Network → Offline)
4. Start a study session
5. Complete 10 reviews
6. Check database - reviews are saved!
7. Go to /progress - see updated stats
8. Go back online
9. All data still there ✓
```

### Scenario 2: Multi-Tab Sync

```
1. Open app in Tab A
2. Open app in Tab B (same URL)
3. In Tab A: Add a card
4. In Tab B: Card appears (no refresh!)
5. In Tab B: Edit the card
6. In Tab A: Changes appear instantly
7. In Tab A: Delete the card
8. In Tab B: Card removed (real-time!)
```

### Scenario 3: Import & Export

```
1. Create sample CSV:
   Front,Back,Example (JP),Example (EN),Tags
   犬,dog,犬が好きです,I like dogs,animal
   猫,cat,猫を飼っています,I have a cat,animal

2. Save as sample.csv
3. Go to /manage
4. Click "Import CSV"
5. Select sample.csv
6. Watch cards appear in real-time
7. Click "Export All JSON"
8. Verify exported file contains the cards
```

---

## 📊 Verifying PWA Features

### Check Manifest

1. DevTools → **Application** → **Manifest**
2. Verify:
   - ✅ Name: "JapVocab"
   - ✅ Icons: 8 sizes
   - ✅ Start URL: "/"
   - ✅ Display: "standalone"
   - ✅ Theme color: "#6B46C1"

### Check Service Worker

1. DevTools → **Application** → **Service Workers**
2. Verify:
   - ✅ Status: "activated and running"
   - ✅ Source: "/sw.js"
   - ✅ Scope: "/"

3. Click **Update** to force update check
4. Click **Unregister** then refresh to re-register

### Check Cache Storage

1. DevTools → **Application** → **Cache Storage**
2. Expand **japvocab-v2**
3. See cached files:
   - ✅ /
   - ✅ /study
   - ✅ /quiz
   - ✅ /manage
   - ✅ /settings
   - ✅ /progress
   - ✅ /manifest.json

---

## 🎨 Testing Offline Indicator

### Test Connection Loss

```
1. App running (online)
2. Open DevTools → Network
3. Check "Offline"
4. See toast appear: "No internet connection"
5. Toast stays visible
6. Uncheck "Offline"
7. See toast: "Back online" (green)
8. Toast auto-hides after 3 seconds
```

---

## 🐛 Debugging Tips

### Common Issues

**Issue**: Service worker not registering

**Solution**:
```javascript
// In browser console
navigator.serviceWorker.getRegistration()
  .then(reg => console.log('SW registered:', reg))
  .catch(err => console.error('No SW:', err))
```

**Issue**: Database not initializing

**Solution**:
```javascript
// Check database
console.log('DB exists:', !!window.db)
console.log('DB open:', window.db?.isOpen())

// Force re-init
await databaseService.initializeDatabase()
```

**Issue**: Live queries not updating

**Solution**:
```javascript
// Check if Dexie hooks are working
import { useLiveQuery } from 'dexie-react-hooks'

// Verify observable is firing
db.vocabulary.toArray().then(console.log)
```

---

## 📝 Quick Reference

### Environment Variables

```bash
# Enable service worker in development
NEXT_PUBLIC_ENABLE_SW=true npm run dev

# Push notification key (future)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-key-here
```

### Key Shortcuts

**On Management Page**:
- `Ctrl/Cmd + Click` on cards = Multi-select
- `Import CSV` = Adds cards to database
- `Export JSON` = Downloads all data

**On Study Page**:
- `Space` = Show answer
- `1` = Again (hard to remember)
- `2` = Hard
- `3` = Good
- `4` = Easy

### Database Methods

```typescript
// Most used methods
databaseService.getVocabulary()
databaseService.addVocabularyCard(card)
databaseService.updateVocabularyCard(id, updates)
databaseService.deleteVocabularyCards([id1, id2])
databaseService.bulkAddTags([id1, id2], ['tag1', 'tag2'])
```

---

## ✅ Testing Checklist

### Database Integration
- [ ] Open /manage in two tabs
- [ ] Add card in tab 1, see it in tab 2
- [ ] Edit card in tab 2, see change in tab 1
- [ ] Delete card, both tabs update
- [ ] Import CSV, cards appear
- [ ] Export JSON, file downloads
- [ ] Bulk add tags, instant update
- [ ] Move cards to deck, real-time change

### PWA Features
- [ ] Service worker registered
- [ ] Manifest loaded correctly
- [ ] App works offline
- [ ] Offline indicator appears/disappears
- [ ] Cache storage populated
- [ ] Install prompt works (mobile/desktop)

### Study/Quiz
- [ ] Study session loads data from database
- [ ] Reviews save to database
- [ ] Quiz gets latest vocabulary
- [ ] Statistics persist

---

## 🎉 Success Criteria

You've successfully tested Day 6 if:
- ✅ App works completely offline
- ✅ Changes in one tab appear in another
- ✅ No manual page reloads needed
- ✅ Import/export works
- ✅ Service worker is active
- ✅ Offline indicator works
- ✅ Database has data (check DevTools)

---

**Happy Testing!** 🚀

Need help? Check `DAY6_SUMMARY.md` and `DAY6_FEATURES.md`
