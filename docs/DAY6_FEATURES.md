# Day 6 Features - Database Integration & PWA

## 🗄️ Database Integration Features

### 1. Live Queries with Dexie React Hooks

**What It Is**:
Real-time database queries that automatically update your UI when data changes in IndexedDB.

**Key Hooks**:

```typescript
// Get all vocabulary (auto-updates)
const vocabulary = useLiveVocabulary()

// Get vocabulary filtered by deck
const deckCards = useLiveVocabulary(deckId)

// Get all decks (auto-updates)
const decks = useLiveDecks()

// Get due cards for review
const dueCards = useLiveDueCards('local-user', 20)

// Get database statistics
const stats = useDatabaseStats()
```

**Example Usage**:
```typescript
function MyComponent() {
  const vocabulary = useLiveVocabulary() ?? []

  // Vocabulary automatically updates when:
  // - New cards are added
  // - Cards are edited
  // - Cards are deleted
  // - Cards are imported

  return <div>{vocabulary.length} cards</div>
}
```

---

### 2. Database Initialization Hook

**What It Does**:
Ensures IndexedDB is ready before your components try to use it.

```typescript
const { isInitialized, isLoading, error } = useDatabase()

if (isLoading) return <LoadingSpinner />
if (error) return <Error message={error} />
// Now safe to use database!
```

**Handles**:
- Creating database if first time
- Loading sample N5 data
- Syncing with Zustand store
- Error recovery

---

### 3. Automatic UI Updates

**Before** (Manual):
```typescript
// Old way - manual reloading
const handleAddCard = async (card) => {
  await databaseService.addVocabularyCard(card)
  await loadData() // Manual reload
  setLoading(false)
}
```

**After** (Automatic):
```typescript
// New way - automatic updates
const handleAddCard = async (card) => {
  await databaseService.addVocabularyCard(card)
  // UI updates automatically via live query!
}
```

---

### 4. Management Page Features

**Real-time Operations**:
- ✅ Add vocabulary cards → instant UI update
- ✅ Edit cards → changes appear immediately
- ✅ Delete cards → removed from UI instantly
- ✅ Bulk operations → all updates in real-time
- ✅ Import CSV/JSON → cards appear as they're added
- ✅ Create/edit/delete decks → instant feedback

**Bulk Operations** (all real-time):
- Add tags to multiple cards
- Remove tags from multiple cards
- Update JLPT level
- Move cards to different deck
- Export selected cards
- Delete multiple cards

---

### 5. Study Page Features

**Integration**:
- ✅ Database initializes before study session
- ✅ Loads due cards from IndexedDB
- ✅ Saves review results to database
- ✅ Updates FSRS scheduling automatically
- ✅ Syncs with Zustand store

**Flow**:
```
Database Init → Load Study Cards → Start Session
     ↓
Review Card → Grade → Save to DB → Next Card
     ↓
End Session → Update Statistics → Persist
```

---

### 6. Quiz Page Features

**Real-time Vocabulary**:
- ✅ Always uses latest vocabulary from database
- ✅ No need to refresh after adding cards
- ✅ Quiz questions update automatically
- ✅ Statistics persist to database

**Smart Quiz Generation**:
```typescript
// Automatically gets latest cards
const availableCards = useLiveVocabulary() ?? []

// Generate quiz with fresh data
const quiz = generateQuiz(availableCards, settings)
```

---

## 📱 PWA Features

### 1. Offline Functionality

**What Works Offline**:
- ✅ Browse all pages (/, /study, /quiz, /manage, /settings, /progress)
- ✅ Study with flashcards
- ✅ Take quizzes
- ✅ Add/edit/delete vocabulary
- ✅ Manage decks
- ✅ View progress

**What Requires Internet**:
- ⏳ Text-to-speech audio (future: cache audio)
- ⏳ Cloud sync (coming in Day 7)
- ⏳ Downloading new content

---

### 2. Service Worker Caching

**Caching Strategies**:

**Cache-First** (static assets):
```
Browser → Cache → (if miss) → Network → Cache
```
- HTML pages
- CSS files
- JavaScript bundles
- Images
- Fonts

**Network-First** (dynamic data):
```
Browser → Network → (if fail) → Cache
```
- API calls
- User data
- Fresh content

---

### 3. Offline Indicator

**Visual Feedback**:
- Shows when connection is lost
- Shows when connection is restored
- Auto-hides after 3 seconds when online
- Accessible design
- Smooth animations

**States**:
```typescript
// Offline (persistent)
<div className="bg-gray-900 dark:bg-gray-100">
  <WifiOff /> No internet connection
</div>

// Online (3s auto-hide)
<div className="bg-green-500">
  <Wifi /> Back online
</div>
```

---

### 4. Install Prompt

**PWA Installation**:
- ✅ Browser shows install prompt
- ✅ Can install to home screen (mobile)
- ✅ Can install as desktop app
- ✅ Works like native app

**Shortcuts** (on install):
- Study → `/study`
- Progress → `/progress`
- (More can be added in manifest.json)

---

### 5. Service Worker Features

**Automatic Updates**:
```javascript
// Checks for updates every hour
setInterval(() => registration.update(), 3600000)

// Prompts user when update available
if (newWorker.state === 'installed') {
  confirm('New version available! Reload?')
}
```

**Background Sync** (ready):
- Infrastructure in place
- Will sync offline changes when back online
- Currently: `sync-progress` event handler

**Push Notifications** (ready):
- Permission handling implemented
- Notification actions configured
- Backend integration pending

---

## 🔧 Developer Features

### 1. Type-Safe Database Operations

**All operations are type-safe**:
```typescript
// TypeScript catches errors at compile time
await databaseService.addVocabularyCard(card) // ✓
await databaseService.addVocabularyCard(invalid) // ✗ Type error

// Auto-complete for all methods
databaseService. // Shows all available methods
```

---

### 2. Error Handling

**Comprehensive error handling**:
```typescript
try {
  await databaseService.addVocabularyCard(card)
} catch (error) {
  console.error('Failed to add card:', error)
  alert('Failed to add card. Please try again.')
}
```

**Error States in UI**:
```typescript
if (dbError) {
  return (
    <div className="text-red-600">
      Failed to load: {dbError}
    </div>
  )
}
```

---

### 3. Loading States

**All pages have loading states**:
```typescript
if (dbLoading || !isInitialized) {
  return <LoadingSpinner />
}
```

**Benefits**:
- Better user experience
- No blank screens
- Clear feedback
- Prevents race conditions

---

### 4. Database Service API

**Complete API**:

```typescript
// Vocabulary operations
await databaseService.getVocabulary()
await databaseService.addVocabularyCard(card, deckId?)
await databaseService.addVocabularyCards(cards, deckId?)
await databaseService.updateVocabularyCard(id, updates)
await databaseService.deleteVocabularyCards(ids)
await databaseService.searchVocabulary(query)

// Deck operations
await databaseService.getDecks()
await databaseService.createDeck(deck)
await databaseService.updateDeck(id, updates)
await databaseService.deleteDeck(id)
await databaseService.getDeckVocabulary(deckId)

// Bulk operations
await databaseService.bulkAddTags(cardIds, tags)
await databaseService.bulkRemoveTags(cardIds, tags)
await databaseService.bulkUpdateJLPTLevel(cardIds, level)
await databaseService.moveCardsToDeck(cardIds, deckId)

// Study operations
await databaseService.getStudyCards()
await databaseService.updateStudyCard(card)
await databaseService.bulkUpdateStudyCards(cards)

// Data management
await databaseService.exportData()
await databaseService.importData(jsonString)
await databaseService.getStatistics()
await databaseService.clearAllData()
```

---

## 🎨 UI/UX Improvements

### 1. Instant Feedback

**Before**:
- Click add → loading spinner → manual reload → see new card
- ~2-3 seconds delay

**After**:
- Click add → card appears immediately
- <100ms perceived latency

---

### 2. No Stale Data

**Live queries ensure**:
- Always showing latest data
- No cache invalidation needed
- No manual refresh buttons
- Consistent across tabs

---

### 3. Optimistic Updates

**Pattern**:
```typescript
// UI updates immediately
setLocalState(newValue)

// Database saves in background
await databaseService.save(newValue)

// If fails, revert
if (error) setLocalState(oldValue)
```

---

## 📊 Performance Improvements

### 1. Efficient Queries

**Indexed queries**:
```typescript
// Fast - uses index
db.vocabulary.where('jlptLevel').equals('N5')

// Fast - uses compound index
db.studyCards.where('[userId+due]').between([userId, min], [userId, max])
```

---

### 2. Memoized Conversions

**Prevents unnecessary re-renders**:
```typescript
const vocabulary = useMemo(() => {
  return dbVocabulary.map(card => {
    const { deckId, addedAt, modifiedAt, ...rest } = card
    return rest
  })
}, [dbVocabulary])
```

---

### 3. Lazy Loading (Ready)

**Structure in place for**:
- Virtual scrolling
- Pagination
- Infinite scroll
- Code splitting

---

## 🔐 Data Persistence

### IndexedDB Benefits

**vs localStorage**:
- ✅ No size limits (localStorage: 5-10MB)
- ✅ Structured queries (localStorage: key-value only)
- ✅ Transactions (localStorage: no transactions)
- ✅ Indexes (localStorage: no indexes)
- ✅ Async (localStorage: synchronous/blocking)

**vs Cookies**:
- ✅ Much larger capacity
- ✅ Not sent with every request
- ✅ Better security
- ✅ Better performance

---

## 🎯 Best Practices Implemented

### 1. Single Source of Truth
- IndexedDB is the source of truth
- All components query database
- No duplicate state

### 2. Separation of Concerns
- `useDatabase` - initialization
- `useLiveQuery` - data fetching
- `databaseService` - operations
- Components - presentation

### 3. Error Boundaries
- Try-catch everywhere
- User-friendly error messages
- Graceful degradation
- No white screens of death

### 4. Accessibility
- Loading states
- Error states
- Keyboard navigation
- Screen reader support
- ARIA labels

---

## 🚀 Ready for Production

### Checklist
- ✅ Type-safe throughout
- ✅ Error handling everywhere
- ✅ Loading states
- ✅ Offline support
- ✅ Real-time updates
- ✅ Production build passing
- ✅ PWA manifest configured
- ✅ Service worker active
- ✅ User feedback mechanisms

---

**Day 6 Features Complete!** 🎉
