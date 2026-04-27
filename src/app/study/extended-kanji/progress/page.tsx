'use client'

/**
 * Extended-kanji learning dashboard.
 * Route: /study/extended-kanji/progress
 *
 * Compact layout: status row, insight card (distribution + 7-day strip),
 * quick actions, lesson breakdown (collapsed by default).
 * All sections derive from the same `progress` + `kanjiList` inputs;
 * computation lives in lib/extended-kanji/stats.ts.
 */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Flame,
  TrendingUp,
  AlertCircle,
  Calendar,
  Play,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
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
  LEVELS_DISPLAYED,
  getActivityLastNDays,
  getDistribution,
  getKpis,
  getLessonStats,
  getStreak,
  getStuckCards,
  getTodayCount,
} from '@/lib/extended-kanji/stats'

const PROGRESS_KEY = 'extended-kanji-practice-progress'

const LEVEL_COLOR: Record<number | 'untouched', string> = {
  untouched: 'bg-slate-300 dark:bg-slate-700',
  0: 'bg-rose-500',
  1: 'bg-orange-500',
  2: 'bg-amber-500',
  3: 'bg-lime-500',
  5: 'bg-emerald-600',
}
const LEVEL_LABEL: Record<number | 'untouched', string> = {
  untouched: 'New',
  0: 'L0',
  1: 'L1',
  2: 'L2',
  3: 'L3',
  5: 'L5',
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
  const [showAllLessons, setShowAllLessons] = useState(false)

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

  const kpis = useMemo(() => getKpis(progress, kanjiList), [progress, kanjiList])
  const distribution = useMemo(
    () => getDistribution(progress, kanjiList),
    [progress, kanjiList],
  )
  const activity = useMemo(() => getActivityLastNDays(progress, 7), [progress])
  const lessonStats = useMemo(() => getLessonStats(progress, kanjiList), [progress, kanjiList])
  const stuckCards = useMemo(() => getStuckCards(progress, kanjiList, 6), [progress, kanjiList])
  const streak = useMemo(() => getStreak(progress), [progress])
  const todayCount = useMemo(() => getTodayCount(progress), [progress])

  const goalPct = Math.min(100, Math.round((todayCount / Math.max(1, dailyGoal)) * 100))
  const masteryPct = kpis.total > 0 ? Math.round((kpis.mastered / kpis.total) * 100) : 0
  const distTotal = Object.values(distribution).reduce((a, b) => a + b, 0)
  const last7Total = activity.reduce((a, b) => a + b.count, 0)
  const visibleLessons = showAllLessons ? lessonStats : lessonStats.slice(0, 6)

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
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <p className="text-destructive">{error}</p>
        </div>
      </>
    )
  }

  // ────────────────────────────────────────────────────────────────────────
  // Distribution rendered as a single horizontal stacked bar — one glance,
  // not six rows. Hover/title shows counts; legend underneath.
  // ────────────────────────────────────────────────────────────────────────
  const distSegments: { key: number | 'untouched'; count: number; pct: number }[] = (
    ['untouched', 0, 1, 2, 3, 5] as const
  )
    .map((k) => ({
      key: k,
      count: distribution[k],
      pct: distTotal > 0 ? (distribution[k] / distTotal) * 100 : 0,
    }))
    .filter((s) => s.count > 0)

  return (
    <>
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-5 sm:py-6 space-y-4">
        {/* ── Compact header ──────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2">
          <Link href="/study/extended-kanji">
            <Button variant="ghost" size="sm" className="gap-1 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 text-xs">
              <TrendingUp className="h-3 w-3" />
              {masteryPct}% mastered
            </Badge>
            {streak > 0 && (
              <Badge variant="outline" className="gap-1 text-xs">
                <Flame className="h-3 w-3 text-orange-500" />
                {streak}d
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Progress</h1>
          <p className="text-sm text-muted-foreground">
            {todayCount}/{dailyGoal} today · {kpis.total} prereq kanji
          </p>
        </div>

        {/* ── Status card: KPIs + today bar in one tight grouping ── */}
        <Card>
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="grid grid-cols-4 gap-2">
              <Kpi label="Mastered" value={kpis.mastered} icon={<CheckCircle2 className="h-3 w-3" />} tone="emerald" />
              <Kpi label="Learning" value={kpis.learning} icon={<TrendingUp className="h-3 w-3" />} tone="sky" />
              <Kpi label="New" value={kpis.untouched} icon={<Circle className="h-3 w-3" />} tone="muted" />
              <Kpi label="Due" value={kpis.due} icon={<Clock className="h-3 w-3" />} tone="amber" />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                <span>Today</span>
                <span className="tabular-nums">{goalPct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${goalPct}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Insights: stacked-bar distribution + 7-day sparkline ── */}
        <Card>
          <CardContent className="pt-4 pb-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Memory level distribution
                </span>
                <span className="text-[11px] text-muted-foreground">{kpis.total} cards</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                {distSegments.map((s) => (
                  <div
                    key={s.key}
                    className={`${LEVEL_COLOR[s.key]} transition-all`}
                    style={{ width: `${s.pct}%` }}
                    title={`${LEVEL_LABEL[s.key]}: ${s.count}`}
                  />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                {distSegments.map((s) => (
                  <span key={s.key} className="flex items-center gap-1">
                    <span className={`h-2 w-2 rounded-sm ${LEVEL_COLOR[s.key]}`} />
                    {LEVEL_LABEL[s.key]} <span className="tabular-nums">{s.count}</span>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Last 7 days
                </span>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {last7Total} reviews
                </span>
              </div>
              <div className="flex items-end justify-between gap-1.5 h-14">
                {activity.map((b, i) => {
                  const max = Math.max(1, ...activity.map((x) => x.count))
                  const h = (b.count / max) * 100
                  const isToday = i === activity.length - 1
                  return (
                    <div key={b.date} className="flex-1 flex flex-col items-center gap-0.5">
                      <div
                        className={`w-full rounded-t transition-all ${
                          b.count === 0 ? 'bg-muted' : isToday ? 'bg-primary' : 'bg-primary/60'
                        }`}
                        style={{ height: `${Math.max(6, h)}%` }}
                        title={`${b.date}: ${b.count}`}
                      />
                      <div className="text-[9px] text-muted-foreground tabular-nums">
                        {new Date(b.date + 'T00:00').toLocaleDateString(undefined, {
                          weekday: 'narrow',
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Quick actions ─────────────────────────────────────── */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="grid grid-cols-2 gap-2">
              <QuickAction
                label="Review due"
                hint={`${kpis.due} cards`}
                disabled={kpis.due === 0}
                onClick={() => launchPractice({ sortMode: 'due', cardCount: Math.min(20, kpis.due) })}
              />
              <QuickAction
                label="Drill weakest"
                hint="L0/L1 first"
                disabled={kpis.learning === 0}
                onClick={() => launchPractice({ sortMode: 'weak-first', cardCount: 10 })}
              />
              <QuickAction
                label="Stuck cards"
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
            </div>
          </CardContent>
        </Card>

        {/* ── Stuck cards (compact inline) ──────────────────────── */}
        {stuckCards.length > 0 && (
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-500" />
                  Needs attention
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs gap-1"
                  onClick={() =>
                    launchPractice({ sortMode: 'stuck', cardCount: Math.min(10, stuckCards.length) })
                  }
                >
                  Drill all
                  <Play className="h-3 w-3" />
                </Button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {stuckCards.map(({ kanji, progress: p }) => (
                  <Link
                    key={kanji.id}
                    href={`/study/extended-kanji/${encodeURIComponent(kanji.id)}`}
                    className="flex flex-col items-center rounded border p-2 hover:border-primary transition-colors"
                  >
                    <div className="text-2xl font-bold leading-none">{kanji.kanji}</div>
                    <div className="text-[9px] text-muted-foreground tabular-nums mt-1">
                      L{p.level} · {p.reviewCount}×
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Lesson breakdown (collapsed by default) ────────────── */}
        {lessonStats.length > 0 && (
          <Card>
            <CardContent className="pt-4 pb-4 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Lesson breakdown
                </span>
                {lessonStats.length > 6 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs gap-1"
                    onClick={() => setShowAllLessons((v) => !v)}
                  >
                    {showAllLessons ? (
                      <>
                        Less <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        All {lessonStats.length} <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </Button>
                )}
              </div>
              <div className={showAllLessons ? 'max-h-80 overflow-y-auto pr-1 space-y-1' : 'space-y-1'}>
                {visibleLessons.map((s) => {
                  const masteryPct = s.total > 0 ? (s.mastered / s.total) * 100 : 0
                  const learnPct = s.total > 0 ? (s.learning / s.total) * 100 : 0
                  return (
                    <div key={s.lesson} className="flex items-center gap-2">
                      <div className="w-7 shrink-0 text-[11px] tabular-nums text-muted-foreground">
                        L{s.lesson}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="bg-emerald-500"
                            style={{ width: `${masteryPct}%` }}
                          />
                          <div className="bg-sky-500" style={{ width: `${learnPct}%` }} />
                        </div>
                      </div>
                      <div className="w-12 shrink-0 text-right text-[10px] text-muted-foreground tabular-nums">
                        {s.mastered}/{s.total}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="shrink-0 h-6 px-2 text-[10px]"
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Empty state ───────────────────────────────────────── */}
        {kpis.untouched === kpis.total && (
          <Card className="border-dashed">
            <CardContent className="pt-4 pb-4 text-center space-y-2">
              <Sparkles className="h-6 w-6 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Rate a few kanji to see your progress here.
              </p>
              <Button
                size="sm"
                onClick={() => launchPractice({ sortMode: 'teacher', cardCount: 10 })}
              >
                <Play className="h-3 w-3 mr-1" />
                Start with 10
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

// ──────────────────────────────────────────────────────────────────────────

function Kpi({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: number
  icon: React.ReactNode
  tone: 'emerald' | 'sky' | 'amber' | 'muted'
}) {
  const toneClass = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    sky: 'text-sky-600 dark:text-sky-400',
    amber: 'text-amber-600 dark:text-amber-400',
    muted: 'text-muted-foreground',
  }[tone]
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
        {icon}
        {label}
      </div>
      <div className={`text-xl font-bold tabular-nums leading-tight mt-0.5 ${toneClass}`}>
        {value}
      </div>
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
      size="sm"
      className="h-auto py-2.5 flex-col items-start gap-0.5 text-left"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-sm font-medium">{label}</span>
      <span className="text-[10px] text-muted-foreground font-normal">{hint}</span>
    </Button>
  )
}
