# Day 10: Analytics Dashboard & Progress Tracking

**Date:** 2025-10-26
**Status:** Planning
**Estimated Time:** 4-5 hours

## Overview

Day 10 focuses on building a comprehensive analytics dashboard that provides users with deep insights into their learning progress. This includes visualizations, achievement tracking, study streaks, retention curves, and personalized recommendations based on performance data.

## Goals

1. ✅ Build analytics tracking service
2. ✅ Create comprehensive dashboard page
3. ✅ Implement study streak tracking
4. ✅ Add progress visualizations (charts)
5. ✅ Build achievement/badge system
6. ✅ Create retention curve analysis
7. ✅ Add study time analytics
8. ✅ Identify weak areas automatically
9. ✅ Export analytics data
10. ✅ JLPT level progress tracking

## Architecture

### Analytics System Overview

```
┌────────────────────────────────────────────────┐
│            Analytics Dashboard                 │
│                                                │
│  ┌──────────────┐      ┌──────────────┐       │
│  │  Study       │      │ Achievement  │       │
│  │  Tracker     │      │   System     │       │
│  └──────┬───────┘      └──────┬───────┘       │
│         │                     │                │
│         ▼                     ▼                │
│  ┌──────────────────────────────────┐         │
│  │     Analytics Service            │         │
│  │  - Session tracking              │         │
│  │  - Progress calculation          │         │
│  │  - Streak management             │         │
│  │  - Performance metrics           │         │
│  └──────────┬───────────────────────┘         │
│             │                                  │
│             ▼                                  │
│  ┌──────────────────────────────────┐         │
│  │      IndexedDB Storage           │         │
│  │  - Study sessions                │         │
│  │  - Daily stats                   │         │
│  │  - Achievements                  │         │
│  └──────────────────────────────────┘         │
│             │                                  │
│             ▼                                  │
│  ┌──────────────────────────────────┐         │
│  │   Dashboard Visualizations       │         │
│  │  - Progress charts               │         │
│  │  - Streak calendar               │         │
│  │  - Performance graphs            │         │
│  │  - Level progress bars           │         │
│  └──────────────────────────────────┘         │
└────────────────────────────────────────────────┘
```

## Data Models

### Analytics Types

```typescript
// Daily study statistics
interface DailyStats {
  id: string // Format: YYYY-MM-DD
  date: Date
  cardsStudied: number
  newCards: number
  reviewCards: number
  correctAnswers: number
  incorrectAnswers: number
  averageResponseTime: number // seconds
  studyTime: number // minutes
  sessionsCount: number
  streak: number
  userId?: string
}

// Study session
interface StudySession {
  id: string
  userId?: string
  startTime: Date
  endTime?: Date
  duration: number // seconds
  cardsStudied: number
  correctAnswers: number
  incorrectAnswers: number
  mode: 'flashcard' | 'quiz' | 'typing'
  deckId?: string
  jlptLevel?: JLPTLevel
  performance: number // 0-100 accuracy percentage
}

// Achievement/Badge
interface Achievement {
  id: string
  type: 'streak' | 'cards' | 'accuracy' | 'time' | 'level'
  title: string
  description: string
  icon: string
  requirement: number
  progress: number
  unlocked: boolean
  unlockedAt?: Date
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

// Progress snapshot
interface ProgressSnapshot {
  userId?: string
  date: Date
  totalCardsLearned: number
  totalReviews: number
  currentStreak: number
  longestStreak: number
  studyTime: number // total minutes
  averageAccuracy: number
  jlptProgress: {
    N5: { learned: number; total: number; percentage: number }
    N4: { learned: number; total: number; percentage: number }
    N3: { learned: number; total: number; percentage: number }
    N2: { learned: number; total: number; percentage: number }
    N1: { learned: number; total: number; percentage: number }
  }
}

// Retention data
interface RetentionData {
  interval: number // days since first review
  retention: number // percentage remembered
  cardCount: number
}

// Weak area
interface WeakArea {
  category: string
  jlptLevel: JLPTLevel
  accuracy: number
  cardsCount: number
  recommendation: string
}
```

## Implementation Plan

### Phase 1: Analytics Service (1 hour)

**File:** `src/services/analytics.service.ts`

**Key Methods:**
```typescript
class AnalyticsService {
  // Session tracking
  async startSession(mode: string, deckId?: string): Promise<string>
  async endSession(sessionId: string, stats: SessionStats): Promise<void>
  async recordAnswer(sessionId: string, correct: boolean, responseTime: number): Promise<void>

  // Daily stats
  async getDailyStats(date: Date): Promise<DailyStats>
  async updateDailyStats(date: Date, updates: Partial<DailyStats>): Promise<void>
  async getStatsRange(startDate: Date, endDate: Date): Promise<DailyStats[]>

  // Streak tracking
  async getCurrentStreak(): Promise<number>
  async getLongestStreak(): Promise<number>
  async updateStreak(studied: boolean): Promise<void>

  // Progress
  async getProgressSnapshot(): Promise<ProgressSnapshot>
  async getJLPTProgress(level: JLPTLevel): Promise<LevelProgress>

  // Performance analysis
  async getRetentionCurve(): Promise<RetentionData[]>
  async getWeakAreas(): Promise<WeakArea[]>
  async getAverageAccuracy(days: number): Promise<number>

  // Export
  async exportAnalytics(): Promise<AnalyticsExport>
}
```

### Phase 2: Achievement System (30 min)

**File:** `src/services/achievement.service.ts`

**Achievements to implement:**

**Streak Achievements:**
- 🔥 First Flame: 3-day streak
- 🔥 Rising Phoenix: 7-day streak
- 🔥 Eternal Flame: 30-day streak
- 🔥 Inferno: 100-day streak

**Card Achievements:**
- 📚 Beginner: 10 cards learned
- 📚 Student: 50 cards learned
- 📚 Scholar: 100 cards learned
- 📚 Master: 500 cards learned
- 📚 Sensei: 1000 cards learned

**Accuracy Achievements:**
- 🎯 Sharpshooter: 90% accuracy (50+ reviews)
- 🎯 Perfectionist: 95% accuracy (100+ reviews)
- 🎯 Flawless: 98% accuracy (200+ reviews)

**Time Achievements:**
- ⏱️ Dedicated: 10 hours study time
- ⏱️ Committed: 50 hours study time
- ⏱️ Devoted: 100 hours study time

**Level Achievements:**
- 🌸 N5 Complete: 100% N5 cards learned
- 🌸 N4 Complete: 100% N4 cards learned
- 🌸 N3 Complete: 100% N3 cards learned

### Phase 3: Dashboard Page (1.5 hours)

**File:** `src/app/analytics/page.tsx`

**Sections:**

1. **Overview Cards (Top)**
   - Total cards learned
   - Current streak
   - Study time this week
   - Average accuracy

2. **Progress Charts**
   - Daily study activity (line chart, last 30 days)
   - JLPT level progress (horizontal bars)
   - Accuracy trend (line chart)
   - Study time by day of week (bar chart)

3. **Streak Calendar**
   - Visual calendar showing study days
   - Highlight current streak
   - Show longest streak

4. **Achievements Panel**
   - Grid of achievement badges
   - Progress bars for locked achievements
   - Recently unlocked badges

5. **Performance Insights**
   - Retention curve
   - Weak areas with recommendations
   - Best/worst performing categories
   - Study time distribution

6. **Session History**
   - Recent study sessions
   - Session details (time, accuracy, cards)
   - Session replay option

### Phase 4: Visualizations (1 hour)

**Install Chart Library:**
```bash
npm install recharts
```

**Charts to create:**

1. **Activity Line Chart**
   - X-axis: Date (last 30 days)
   - Y-axis: Cards studied
   - Line: Daily activity
   - Area fill for visual impact

2. **Progress Bar Chart**
   - X-axis: JLPT levels (N5-N1)
   - Y-axis: Progress percentage
   - Stacked bars: Learned vs Remaining

3. **Accuracy Trend**
   - X-axis: Date
   - Y-axis: Accuracy percentage
   - Line with moving average

4. **Retention Curve**
   - X-axis: Days since first review
   - Y-axis: Retention percentage
   - Exponential decay curve

5. **Study Time Pie Chart**
   - Breakdown by JLPT level
   - Breakdown by study mode

### Phase 5: Weak Areas Analysis (30 min)

**Algorithm:**
```typescript
async function identifyWeakAreas(): Promise<WeakArea[]> {
  // 1. Get all study cards with review history
  // 2. Calculate accuracy by category and level
  // 3. Identify categories with <70% accuracy
  // 4. Rank by importance (frequency × difficulty)
  // 5. Generate recommendations
}
```

**Recommendations:**
- "Focus on N5 verbs - 60% accuracy"
- "Review N4 adjectives - 55% accuracy"
- "Practice N3 particles - 50% accuracy"

### Phase 6: Integration & Testing (30 min)

1. Integrate analytics tracking into study flow
2. Test streak calculation
3. Test achievement unlocking
4. Verify chart data
5. Test export functionality

## Database Schema Updates

### New Tables (IndexedDB)

```typescript
// Daily stats
db.version(3).stores({
  dailyStats: 'id, date, userId, cardsStudied, streak',
  studySessions: 'id, userId, startTime, endTime, mode',
  achievements: 'id, userId, type, unlocked',
  progressSnapshots: '++id, userId, date'
})
```

## Charting Library: Recharts

**Why Recharts:**
- Built for React
- TypeScript support
- Responsive
- Customizable
- Small bundle size (~50KB)
- Good documentation

**Example Usage:**
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={dailyStats}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="cardsStudied" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>
```

## Analytics Tracking Points

**When to track:**

1. **Study Session Start**
   - Record session start time
   - Record mode and deck

2. **Each Card Review**
   - Record answer (correct/incorrect)
   - Record response time
   - Update session stats

3. **Study Session End**
   - Calculate session duration
   - Calculate accuracy
   - Update daily stats
   - Check for achievements
   - Update streak

4. **Daily Rollover (midnight)**
   - Finalize yesterday's stats
   - Initialize today's stats
   - Update streak status

5. **Achievement Unlock**
   - Record unlock time
   - Show notification
   - Update UI

## Privacy Considerations

- All analytics data stored locally (IndexedDB)
- Synced to Firestore only if user authenticated
- User can export data anytime
- User can clear analytics data
- Anonymous mode available (no user ID)

## Performance Optimizations

1. **Batch Updates**
   - Don't write to DB on every card review
   - Batch updates every 10 cards or on session end

2. **Lazy Loading**
   - Load charts only when visible
   - Use intersection observer

3. **Caching**
   - Cache calculated stats for current day
   - Invalidate on new data

4. **Indexes**
   - Index by date for fast range queries
   - Index by userId for multi-user support

## UI/UX Design

### Color Scheme
- **Success:** Green (#22c55e)
- **Warning:** Yellow (#eab308)
- **Danger:** Red (#ef4444)
- **Info:** Blue (#3b82f6)
- **Streak:** Orange (#f97316)

### Responsive Design
- Desktop: 3-column grid
- Tablet: 2-column grid
- Mobile: 1-column stack

### Accessibility
- Proper ARIA labels
- Keyboard navigation
- Color-blind friendly charts
- Screen reader support

## Export Format

```json
{
  "exportDate": "2025-10-26T12:00:00Z",
  "version": "1.0.0",
  "user": {
    "uid": "user123",
    "email": "user@example.com"
  },
  "summary": {
    "totalCardsLearned": 150,
    "totalReviews": 500,
    "currentStreak": 14,
    "longestStreak": 30,
    "totalStudyTime": 1200,
    "averageAccuracy": 85
  },
  "dailyStats": [...],
  "sessions": [...],
  "achievements": [...],
  "jlptProgress": {...}
}
```

## Success Metrics

After Day 10, users should be able to:
- ✅ View comprehensive study analytics
- ✅ Track study streaks
- ✅ See progress visualizations
- ✅ Unlock achievements
- ✅ Identify weak areas
- ✅ Export analytics data
- ✅ View retention curves
- ✅ Monitor JLPT progress
- ✅ See study time breakdown

## Timeline

- **Phase 1: Analytics Service** - 1 hour
- **Phase 2: Achievement System** - 30 minutes
- **Phase 3: Dashboard Page** - 1.5 hours
- **Phase 4: Visualizations** - 1 hour
- **Phase 5: Weak Areas** - 30 minutes
- **Phase 6: Testing & Polish** - 30 minutes

**Total:** ~5 hours

## Dependencies

```bash
npm install recharts
npm install date-fns # For date formatting
```

## Deliverables

1. ✅ Analytics tracking service
2. ✅ Achievement system with badges
3. ✅ Comprehensive dashboard page
4. ✅ Multiple chart visualizations
5. ✅ Streak tracking system
6. ✅ Weak areas identification
7. ✅ Export functionality
8. ✅ Database schema updates
9. ✅ Integration with study flow
10. ✅ Comprehensive documentation

---

Let's build an analytics system that motivates users and provides actionable insights! 📊🎯
