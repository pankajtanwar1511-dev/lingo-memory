/**
 * Pure aggregation helpers for the extended-kanji progress dashboard.
 *
 * All functions take the same two inputs and have no side effects:
 *   - progress: per-kanji rating state (id → { level, lastSeen, reviewCount })
 *   - kanjiList: the static ExtendedKanji catalog (loaded from JSON)
 *
 * Levels in extended-kanji-practice run 0..5 (5 buttons map to levels
 * 0,1,2,3,5; level 4 is intentionally unused). For simplicity we treat
 *   - 0–1: weak / needs work
 *   - 2–3: learning
 *   - 5  : mastered (never appears as 4 in real data, but treated equivalently)
 */

import type { CardProgress, ExtendedKanji } from '@/types/extended-kanji'

export type ProgressMap = Record<string, CardProgress>

/** Buckets we visualise on the level-distribution chart. */
export const LEVELS_DISPLAYED = [0, 1, 2, 3, 5] as const
export type LevelKey = typeof LEVELS_DISPLAYED[number]

/**
 * Days a card stays "fresh" before it's due for review again. Pure doubling
 * (1, 2, 4, 8, 16, 32) — keeps the SuperMemo pattern but tighter than the
 * earlier 1/2/5/14/30/60 schedule so cards re-surface more often. Untouched
 * cards are never "due" — they're "new".
 */
const REVIEW_INTERVAL_DAYS: Record<number, number> = {
  0: 1,
  1: 2,
  2: 4,
  3: 8,
  4: 16,
  5: 32,
}

const DAY_MS = 86_400_000

/** Card classification used by listing filters. */
export type CardCategory = 'untouched' | 'learning' | 'mastered' | 'due'

export function classify(p: CardProgress | undefined): CardCategory {
  if (!p || p.reviewCount === 0) return 'untouched'
  if (p.level === 5) return 'mastered'
  return isDue(p) ? 'due' : 'learning'
}

export function isDue(p: CardProgress | undefined, now: number = Date.now()): boolean {
  if (!p || p.reviewCount === 0) return false
  if (p.level === 5) return false
  const interval = REVIEW_INTERVAL_DAYS[p.level] ?? 7
  return now - p.lastSeen >= interval * DAY_MS
}

// ──────────────────────────────────────────────────────────────────────────
// Top-line KPIs
// ──────────────────────────────────────────────────────────────────────────

export interface Kpis {
  total: number
  mastered: number
  learning: number
  untouched: number
  due: number
}

export function getKpis(progress: ProgressMap, kanjiList: ExtendedKanji[]): Kpis {
  const k: Kpis = { total: kanjiList.length, mastered: 0, learning: 0, untouched: 0, due: 0 }
  for (const kanji of kanjiList) {
    switch (classify(progress[kanji.id])) {
      case 'mastered':
        k.mastered++
        break
      case 'learning':
        k.learning++
        break
      case 'due':
        k.due++
        // A "due" card is conceptually still "learning" from the user's POV;
        // surface it as a separate KPI but it counts inside learning too.
        k.learning++
        break
      case 'untouched':
        k.untouched++
        break
    }
  }
  return k
}

// ──────────────────────────────────────────────────────────────────────────
// Level distribution
// ──────────────────────────────────────────────────────────────────────────

export type Distribution = Record<LevelKey | 'untouched', number>

export function getDistribution(
  progress: ProgressMap,
  kanjiList: ExtendedKanji[],
): Distribution {
  const dist: Distribution = { untouched: 0, 0: 0, 1: 0, 2: 0, 3: 0, 5: 0 }
  for (const kanji of kanjiList) {
    const p = progress[kanji.id]
    if (!p || p.reviewCount === 0) {
      dist.untouched++
      continue
    }
    const lvl = (p.level === 4 ? 5 : p.level) as LevelKey
    dist[lvl] = (dist[lvl] ?? 0) + 1
  }
  return dist
}

// ──────────────────────────────────────────────────────────────────────────
// Daily activity
// ──────────────────────────────────────────────────────────────────────────

/** YYYY-MM-DD in the user's local timezone. */
export function ymd(ts: number): string {
  const d = new Date(ts)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function getTodayCount(progress: ProgressMap): number {
  const today = ymd(Date.now())
  let n = 0
  for (const id in progress) {
    if (ymd(progress[id].lastSeen) === today) n++
  }
  return n
}

export interface DayBucket {
  date: string  // YYYY-MM-DD
  count: number
}

/** Returns the last `days` days (oldest → newest), each with a count. */
export function getActivityLastNDays(progress: ProgressMap, days = 7): DayBucket[] {
  const buckets: DayBucket[] = []
  const now = Date.now()
  // Build empty buckets first so days with zero reviews still appear.
  for (let i = days - 1; i >= 0; i--) {
    buckets.push({ date: ymd(now - i * DAY_MS), count: 0 })
  }
  const index = new Map(buckets.map((b, i) => [b.date, i]))
  for (const id in progress) {
    const day = ymd(progress[id].lastSeen)
    const i = index.get(day)
    if (i !== undefined) buckets[i].count++
  }
  return buckets
}

/** Number of consecutive days up to today with at least one review. */
export function getStreak(progress: ProgressMap): number {
  const days = new Set<string>()
  for (const id in progress) days.add(ymd(progress[id].lastSeen))
  let streak = 0
  let cursor = Date.now()
  while (days.has(ymd(cursor))) {
    streak++
    cursor -= DAY_MS
  }
  return streak
}

// ──────────────────────────────────────────────────────────────────────────
// Lesson breakdown
// ──────────────────────────────────────────────────────────────────────────

export interface LessonStat {
  lesson: number
  total: number
  mastered: number
  learning: number   // includes due
  untouched: number
}

export function getLessonStats(
  progress: ProgressMap,
  kanjiList: ExtendedKanji[],
): LessonStat[] {
  const byLesson = new Map<number, LessonStat>()
  for (const kanji of kanjiList) {
    if (kanji.lessonNumber == null) continue
    let stat = byLesson.get(kanji.lessonNumber)
    if (!stat) {
      stat = { lesson: kanji.lessonNumber, total: 0, mastered: 0, learning: 0, untouched: 0 }
      byLesson.set(kanji.lessonNumber, stat)
    }
    stat.total++
    const cat = classify(progress[kanji.id])
    if (cat === 'mastered') stat.mastered++
    else if (cat === 'untouched') stat.untouched++
    else stat.learning++
  }
  return [...byLesson.values()].sort((a, b) => a.lesson - b.lesson)
}

// ──────────────────────────────────────────────────────────────────────────
// Stuck cards: many reviews, still at low level
// ──────────────────────────────────────────────────────────────────────────

export interface StuckCard {
  kanji: ExtendedKanji
  progress: CardProgress
}

export function getStuckCards(
  progress: ProgressMap,
  kanjiList: ExtendedKanji[],
  limit = 10,
): StuckCard[] {
  const candidates: StuckCard[] = []
  for (const kanji of kanjiList) {
    const p = progress[kanji.id]
    if (!p) continue
    if (p.reviewCount >= 3 && p.level <= 1) {
      candidates.push({ kanji, progress: p })
    }
  }
  // Most reviews and lowest level first → these are the most "stuck".
  candidates.sort((a, b) => {
    if (a.progress.level !== b.progress.level) return a.progress.level - b.progress.level
    return b.progress.reviewCount - a.progress.reviewCount
  })
  return candidates.slice(0, limit)
}

// ──────────────────────────────────────────────────────────────────────────
// Filter helper for listings
// ──────────────────────────────────────────────────────────────────────────

export function filterByCategory(
  kanjiList: ExtendedKanji[],
  progress: ProgressMap,
  category: CardCategory | 'all',
): ExtendedKanji[] {
  if (category === 'all') return kanjiList
  return kanjiList.filter((k) => classify(progress[k.id]) === category)
}
