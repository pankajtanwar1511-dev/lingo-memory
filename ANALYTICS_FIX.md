# Analytics Not Working - Quick Fix

## 🔍 Problem Found

The **Analytics and Progress pages show no data** because:
- The study page is **NOT recording analytics data** after completing reviews
- It's missing calls to `analyticsService.recordSession()`
- No data is being saved to `db.dailyStats` or `db.sessions`

## ✅ Solution

The study page needs to be updated to record analytics after each study session.

### What Needs to be Added

After completing a study session in `src/app/study/page.tsx`, add:

```typescript
import { analyticsService } from '@/services/analytics.service'

// After finishing a session (when all cards are reviewed):
await analyticsService.recordSession(
  'default-deck',  // Deck ID
  'flashcard',     // Study mode
  cardsReviewed,   // Total cards studied
  correctCount,    // Number of correct answers
  averageTime      // Average time per card in seconds
)
```

This will:
1. Save session data to database
2. Update daily statistics
3. Track streaks
4. Enable analytics charts

## 🔧 Layout Shift Issue

**Problem**: "When I expand the page it expand and then shift a little left"

**Cause**: Likely caused by scrollbar appearing/disappearing

**Fix**: Add to `src/app/globals.css`:

```css
html {
  overflow-y: scroll; /* Always show scrollbar space */
}
```

This prevents layout shifts when content changes height.

---

## 🚀 Quick Test

After implementing the fix:

1. **Clear browser data** (or use incognito)
2. Visit `/study` and complete 5-10 cards
3. Visit `/analytics` → You'll see:
   - Cards studied: 5-10
   - Study activity chart with today's data
   - JLPT progress bars
4. Visit `/progress` → You'll see:
   - Total reviews: 5-10
   - Today's cards count
   - Streak: 1 day

---

## 📝 Implementation Status

- [x] Analytics recording IMPLEMENTED in study page (src/app/study/page.tsx)
- [x] Layout shift fix APPLIED (src/app/globals.css)
- [x] Analytics service code is correct and ready to use

**✅ COMPLETE! Analytics tracking is now fully functional.**

### What Was Implemented

The study page (src/app/study/page.tsx) now includes:
- Session start time tracking
- Per-card response time tracking
- Automatic analytics recording when session completes
- Analytics recording when user manually ends session
- Console logging for verification

When a study session completes, it records:
- Total cards studied
- Correct answers count
- Average response time per card

This data populates:
- Progress page (/progress) - Shows daily stats, streaks, and totals
- Analytics page (/analytics) - Shows charts, JLPT progress, and performance metrics
