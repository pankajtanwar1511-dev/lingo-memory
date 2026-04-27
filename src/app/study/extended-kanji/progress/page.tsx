'use client'

/**
 * Extended-kanji learning dashboard.
 * Route: /study/extended-kanji/progress
 *
 * Aggregates the per-kanji progress map into things a student actually
 * needs to see: where am I, what should I do next, am I keeping up.
 *
 * All sections derive from the same `progress` + `kanjiList` inputs;
 * computation lives in lib/extended-kanji/stats.ts.
 */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Flame,
  Target,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Calendar,
  BookOpen,
  Play,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { CardProgress, ExtendedKanji } from '@/types/extended-kanji'
import { useAuth } from '@/contexts/auth-context'
import { loadProgress } from '@/services/cloud-progress.service'
import { useSettings } from '@/contexts/settings-context'
import {
  DEFAULT_SRS_INTERVALS,
  LEVELS_DISPLAYED,
  getActivityLastNDays,
  getDistribution,
  getKpis,
  getLessonStats,
  getStreak,
  getStuckCards,
  getTodayCount,
  type SrsIntervals,
} from '@/lib/extended-kanji/stats'
import { useSrsIntervals, INTERVAL_BOUNDS } from '@/hooks/use-srs-intervals'
import { Input } from '@/components/ui/input'
import { Settings2, RotateCcw } from 'lucide-react'

const PROGRESS_KEY = 'extended-kanji-practice-progress'

// Friendly label per level for the distribution row.
const LEVEL_LABEL: Record<number, string> = {
  0: 'Didn’t know',
  1: 'Hard',
  2: 'Medium',
  3: 'Good',
  5: 'Mastered',
}
const LEVEL_COLOR: Record<number, string> = {
  0: 'bg-rose-500',
  1: 'bg-orange-500',
  2: 'bg-amber-500',
  3: 'bg-lime-500',
  5: 'bg-emerald-600',
}

export default function ExtendedKanjiProgressPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { settings } = useSettings()
  const dailyGoal = settings?.dailyGoal ?? 20

  const [kanjiList, setKanjiList] = useState<ExtendedKanji[]>([])
  const [progress, setProgress] = useState<Record<string, CardProgress>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { intervals, setIntervals, reset: resetIntervals } = useSrsIntervals()
  const [showIntervals, setShowIntervals] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/seed-data/extended-kanji/kanji.json')
        if (!res.ok) throw new Error('Failed to load extended-kanji dataset')
        const data = await res.json()
        if (cancelled) return
        setKanjiList(data.kanji as ExtendedKanji[])
        const merged = await loadProgress<Record<string, CardProgress>>(
          user?.uid,
          PROGRESS_KEY,
          {},
        )
        if (!cancelled) setProgress(merged)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user?.uid])

  const kpis = useMemo(() => getKpis(progress, kanjiList, intervals), [progress, kanjiList, intervals])
  const distribution = useMemo(
    () => getDistribution(progress, kanjiList),
    [progress, kanjiList],
  )
  const activity = useMemo(() => getActivityLastNDays(progress, 7), [progress])
  const lessonStats = useMemo(
    () => getLessonStats(progress, kanjiList, intervals),
    [progress, kanjiList, intervals],
  )
  const stuckCards = useMemo(() => getStuckCards(progress, kanjiList, 10), [progress, kanjiList])
  const streak = useMemo(() => getStreak(progress), [progress])
  const todayCount = useMemo(() => getTodayCount(progress), [progress])

  const goalPct = Math.min(100, Math.round((todayCount / Math.max(1, dailyGoal)) * 100))
  const masteryPct = kpis.total > 0 ? Math.round((kpis.mastered / kpis.total) * 100) : 0
  const distributionTotal = Object.values(distribution).reduce((a, b) => a + b, 0)
  const last7Total = activity.reduce((a, b) => a + b.count, 0)
  const distMaxCount = Math.max(1, ...Object.values(distribution))

  // Quick-action launcher — passes config to practice page via URL params.
  function launchPractice(opts: {
    sortMode: 'teacher' | 'weak-first' | 'random' | 'due' | 'stuck' | 'untouched'
    cardCount?: number
    lesson?: number
  }) {
    const params = new URLSearchParams()
    params.set('sort', opts.sortMode)
    if (opts.cardCount) params.set('count', String(opts.cardCount))
    if (opts.lesson != null) params.set('lesson', String(opts.lesson))
    router.push(`/study/extended-kanji-practice?${params.toString()}` as any)
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <p className="text-destructive">{error}</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <Link href="/study/extended-kanji">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Extended Kanji
            </Button>
          </Link>
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            {masteryPct}% mastered
          </Badge>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progress dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {kpis.total} prerequisite kanji · synced across devices
          </p>
        </div>

        {/* ── KPI row ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <KpiTile label="Total" value={kpis.total} icon={<BookOpen className="h-4 w-4" />} />
          <KpiTile
            label="Mastered"
            value={kpis.mastered}
            icon={<CheckCircle2 className="h-4 w-4" />}
            tone="emerald"
          />
          <KpiTile
            label="Learning"
            value={kpis.learning}
            icon={<TrendingUp className="h-4 w-4" />}
            tone="sky"
          />
          <KpiTile
            label="Untouched"
            value={kpis.untouched}
            icon={<Circle className="h-4 w-4" />}
            tone="muted"
          />
          <KpiTile
            label="Due now"
            value={kpis.due}
            icon={<Clock className="h-4 w-4" />}
            tone="amber"
          />
        </div>

        {/* ── Today's activity + streak ─────────────────────────────── */}
        <Card>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Target className="h-4 w-4" />
                Daily goal
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{todayCount}</span>
                <span className="text-muted-foreground">/ {dailyGoal} reviews today</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${goalPct}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{goalPct}% complete</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Flame className="h-4 w-4 text-orange-500" />
                Current streak
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{streak}</span>
                <span className="text-muted-foreground">
                  {streak === 1 ? 'day' : 'days'} in a row
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {streak === 0
                  ? 'Review at least one card today to start a streak.'
                  : streak < 3
                    ? 'Keep going — daily reviews are when retention compounds.'
                    : 'Great consistency! Don’t break the chain.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ── Memory level distribution ─────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Memory level distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <DistRow
              label="Untouched"
              count={distribution.untouched}
              total={distributionTotal}
              max={distMaxCount}
              color="bg-slate-300 dark:bg-slate-700"
              actionLabel={kpis.untouched > 0 ? 'Practice new' : undefined}
              onAction={() =>
                launchPractice({ sortMode: 'untouched', cardCount: Math.min(10, kpis.untouched) })
              }
            />
            {LEVELS_DISPLAYED.map((level) => (
              <DistRow
                key={level}
                label={`L${level} · ${LEVEL_LABEL[level]}`}
                count={distribution[level]}
                total={distributionTotal}
                max={distMaxCount}
                color={LEVEL_COLOR[level]}
                actionLabel={
                  level <= 1 && distribution[level] > 0 ? 'Practice these' : undefined
                }
                onAction={() =>
                  launchPractice({
                    sortMode: 'weak-first',
                    cardCount: Math.min(10, distribution[level]),
                  })
                }
              />
            ))}
          </CardContent>
        </Card>

        {/* ── Last 7 days activity ──────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last 7 days · {last7Total} reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-24">
              {activity.map((b) => {
                const max = Math.max(1, ...activity.map((x) => x.count))
                const h = (b.count / max) * 100
                const isToday = b.date === activity[activity.length - 1].date
                return (
                  <div key={b.date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[10px] tabular-nums font-medium text-muted-foreground">
                      {b.count || ''}
                    </div>
                    <div
                      className={`w-full rounded-t transition-all ${
                        b.count === 0
                          ? 'bg-muted'
                          : isToday
                            ? 'bg-primary'
                            : 'bg-primary/60'
                      }`}
                      style={{ height: `${Math.max(4, h)}%` }}
                    />
                    <div className="text-[10px] text-muted-foreground tabular-nums">
                      {new Date(b.date + 'T00:00').toLocaleDateString(undefined, {
                        weekday: 'narrow',
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Quick actions ─────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Play className="h-4 w-4" />
              Quick start
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <QuickAction
              label="Review due cards"
              hint={`${kpis.due} due now`}
              disabled={kpis.due === 0}
              onClick={() =>
                launchPractice({ sortMode: 'due', cardCount: Math.min(20, kpis.due) })
              }
            />
            <QuickAction
              label="Drill weakest"
              hint="L0/L1 first"
              disabled={kpis.learning === 0 && kpis.due === 0}
              onClick={() => launchPractice({ sortMode: 'weak-first', cardCount: 10 })}
            />
            <QuickAction
              label="Tackle stuck cards"
              hint={`${stuckCards.length} stuck`}
              disabled={stuckCards.length === 0}
              onClick={() =>
                launchPractice({ sortMode: 'stuck', cardCount: Math.min(10, stuckCards.length) })
              }
            />
            <QuickAction
              label="Learn new"
              hint={`${kpis.untouched} untouched`}
              disabled={kpis.untouched === 0}
              onClick={() =>
                launchPractice({ sortMode: 'untouched', cardCount: Math.min(10, kpis.untouched) })
              }
            />
          </CardContent>
        </Card>

        {/* ── Review schedule (adjustable, persisted via cloud sync) ── */}
        <Card>
          <CardHeader className="pb-3">
            <button
              type="button"
              onClick={() => setShowIntervals((v) => !v)}
              className="w-full flex items-center justify-between text-left group"
            >
              <CardTitle className="text-base flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Review schedule
              </CardTitle>
              <span className="text-xs text-muted-foreground tabular-nums">
                {intervals[0]}/{intervals[1]}/{intervals[2]}/{intervals[3]}/{intervals[5]}d
                <span className="ml-2 text-primary opacity-70 group-hover:opacity-100">
                  {showIntervals ? 'Hide' : 'Edit'}
                </span>
              </span>
            </button>
            {!showIntervals && (
              <p className="text-xs text-muted-foreground mt-1">
                Days a card stays fresh per memory level before counting as “due”.
                Shorter = more frequent review.
              </p>
            )}
          </CardHeader>
          {showIntervals && (
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {([0, 1, 2, 3, 5] as const).map((lvl) => (
                  <div key={lvl} className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                      <span>L{lvl} · {LEVEL_LABEL[lvl]}</span>
                      <span className="tabular-nums">{intervals[lvl]}d</span>
                    </label>
                    <Input
                      type="number"
                      min={INTERVAL_BOUNDS.min}
                      max={INTERVAL_BOUNDS.max}
                      value={intervals[lvl]}
                      onChange={(e) => {
                        const n = parseInt(e.target.value, 10)
                        if (Number.isFinite(n)) {
                          setIntervals({ ...intervals, [lvl]: n } as SrsIntervals)
                        }
                      }}
                      className="h-8 text-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <p className="text-[11px] text-muted-foreground">
                  Defaults: {DEFAULT_SRS_INTERVALS[0]}/{DEFAULT_SRS_INTERVALS[1]}/
                  {DEFAULT_SRS_INTERVALS[2]}/{DEFAULT_SRS_INTERVALS[3]}/
                  {DEFAULT_SRS_INTERVALS[5]} days. Synced across devices.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetIntervals}
                  className="gap-1 h-7 text-xs"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* ── Lesson breakdown ──────────────────────────────────────── */}
        {lessonStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Lesson breakdown · {lessonStats.length} lessons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[24rem] overflow-y-auto pr-1">
              {lessonStats.map((s) => {
                const masteryPct = s.total > 0 ? (s.mastered / s.total) * 100 : 0
                const learnPct = s.total > 0 ? (s.learning / s.total) * 100 : 0
                return (
                  <div
                    key={s.lesson}
                    className="flex items-center gap-3 py-1.5 border-b last:border-b-0"
                  >
                    <div className="w-12 shrink-0 text-sm font-medium tabular-nums">
                      L{s.lesson}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className="bg-emerald-500 transition-all"
                          style={{ width: `${masteryPct}%` }}
                        />
                        <div
                          className="bg-sky-500 transition-all"
                          style={{ width: `${learnPct}%` }}
                        />
                      </div>
                      <div className="mt-1 flex gap-2 text-[10px] text-muted-foreground tabular-nums">
                        <span>{s.mastered}/{s.total} mastered</span>
                        {s.learning > 0 && <span>· {s.learning} learning</span>}
                        {s.untouched > 0 && <span>· {s.untouched} new</span>}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 h-7 text-xs"
                      onClick={() =>
                        launchPractice({
                          sortMode: 'teacher',
                          cardCount: Math.min(10, s.total),
                          lesson: s.lesson,
                        })
                      }
                    >
                      Practice
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* ── Stuck cards ───────────────────────────────────────────── */}
        {stuckCards.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Cards needing extra attention
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Reviewed 3+ times but still at L0/L1. Targeted practice helps these the most.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {stuckCards.map(({ kanji, progress: p }) => (
                  <Link
                    key={kanji.id}
                    href={`/study/extended-kanji/${encodeURIComponent(kanji.id)}`}
                  >
                    <Card className="hover:border-primary cursor-pointer transition-colors">
                      <CardContent className="pt-4 text-center space-y-1">
                        <div className="text-3xl font-bold">{kanji.kanji}</div>
                        <div className="text-[10px] text-muted-foreground line-clamp-1">
                          {kanji.meaning}
                        </div>
                        <div className="text-[10px] text-muted-foreground tabular-nums">
                          L{p.level} · {p.reviewCount}×
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-3"
                size="sm"
                onClick={() =>
                  launchPractice({
                    sortMode: 'stuck',
                    cardCount: Math.min(10, stuckCards.length),
                  })
                }
              >
                <Play className="h-3 w-3 mr-1" />
                Drill all {stuckCards.length} together
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Empty state for fresh users ───────────────────────────── */}
        {kpis.untouched === kpis.total && (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center space-y-3">
              <Sparkles className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                You haven’t rated any kanji yet. Start with a small session to seed your data.
              </p>
              <Button onClick={() => launchPractice({ sortMode: 'teacher', cardCount: 10 })}>
                <Play className="h-4 w-4 mr-1" />
                Start with 10 cards
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────────────────────────────────

function KpiTile({
  label,
  value,
  icon,
  tone = 'default',
}: {
  label: string
  value: number
  icon: React.ReactNode
  tone?: 'default' | 'emerald' | 'sky' | 'amber' | 'muted'
}) {
  const toneClass = {
    default: 'text-foreground',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    sky: 'text-sky-600 dark:text-sky-400',
    amber: 'text-amber-600 dark:text-amber-400',
    muted: 'text-muted-foreground',
  }[tone]
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
          {icon}
          {label}
        </div>
        <div className={`text-2xl font-bold tabular-nums mt-1 ${toneClass}`}>{value}</div>
      </CardContent>
    </Card>
  )
}

function DistRow({
  label,
  count,
  total,
  max,
  color,
  actionLabel,
  onAction,
}: {
  label: string
  count: number
  total: number
  max: number
  color: string
  actionLabel?: string
  onAction?: () => void
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  const barPct = max > 0 ? Math.round((count / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 shrink-0 text-xs text-muted-foreground">{label}</div>
      <div className="flex-1 min-w-0">
        <div className="h-5 rounded bg-muted overflow-hidden">
          <div
            className={`h-full ${color} transition-all flex items-center justify-end pr-2`}
            style={{ width: `${barPct}%` }}
          >
            {count > 0 && barPct > 12 && (
              <span className="text-[10px] font-medium text-white tabular-nums">
                {count}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="w-16 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
        {count} ({pct}%)
      </div>
      {actionLabel && onAction ? (
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : (
        <div className="w-[72px] shrink-0" />
      )}
    </div>
  )
}

function QuickAction({
  label,
  hint,
  onClick,
  disabled,
}: {
  label: string
  hint: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <Button
      variant="outline"
      className="h-auto py-3 flex-col items-start gap-1 text-left"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="font-medium">{label}</span>
      <span className="text-[10px] text-muted-foreground font-normal">{hint}</span>
    </Button>
  )
}
