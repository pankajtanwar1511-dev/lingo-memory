'use client'

/**
 * Kanji learning dashboard.
 * Route: /study/kanji/progress
 *
 * Two sections, both derived from synced data:
 *   1. Vocab reveal drill (HERO) — the real SRS layer. KPIs, distribution,
 *      7-day, stuck vocab, quick actions.
 *   2. Kanji study coverage — no SRS, just "% viewed". Coverage bar,
 *      7-day, lesson breakdown.
 *
 * No level dial / "due now" for kanji — kanji content is too compound for
 * atomic recall ratings. SRS lives in vocab-reveal.
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
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { CardProgress, ExtendedKanji, MergedVocabRow } from '@/types/extended-kanji'
import { type SrsState } from '@/types/vocab-reveal-srs'
import { load as loadVocabSrs } from '@/services/vocab-reveal-srs.service'
import { useAuth } from '@/contexts/auth-context'
import { loadProgress } from '@/services/cloud-progress.service'
import { useSettings } from '@/contexts/settings-context'
import {
  getActivityLastNDays,
  getStreak,
  getStuckVocab,
  getTodayCount,
  getVocabActivityLastNDays,
  getVocabDistribution,
  getVocabKpis,
  getLessonStats,
} from '@/lib/extended-kanji/stats'

const PROGRESS_KEY = 'extended-kanji-practice-progress'

export default function KanjiProgressPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { settings } = useSettings()
  const dailyGoal = settings?.dailyGoal ?? 20

  const [kanjiList, setKanjiList] = useState<ExtendedKanji[]>([])
  const [progress, setProgress] = useState<Record<string, CardProgress>>({})
  const [vocabList, setVocabList] = useState<MergedVocabRow[]>([])
  const [vocabSrs, setVocabSrs] = useState<SrsState>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllLessons, setShowAllLessons] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const [kanjiRes, vocabRes] = await Promise.all([
          fetch('/seed-data/extended-kanji/kanji.json'),
          fetch('/seed-data/extended-kanji/vocabulary.json'),
        ])
        if (!kanjiRes.ok) throw new Error('Failed to load kanji dataset')
        if (!vocabRes.ok) throw new Error('Failed to load vocabulary dataset')
        const kanjiData = await kanjiRes.json()
        const vocabData = await vocabRes.json()
        if (cancelled) return
        setKanjiList(kanjiData.kanji as ExtendedKanji[])
        setVocabList(vocabData.vocabulary as MergedVocabRow[])

        const [merged, vSrs] = await Promise.all([
          loadProgress<Record<string, CardProgress>>(user?.uid, PROGRESS_KEY, {}),
          loadVocabSrs(user?.uid ?? null),
        ])
        if (!cancelled) {
          setProgress(merged)
          setVocabSrs(vSrs)
        }
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

  // ─── Vocab-reveal stats (the real SRS) ──────────────────────────────
  const vocabKpis = useMemo(() => getVocabKpis(vocabSrs, vocabList), [vocabSrs, vocabList])
  const vocabDist = useMemo(() => getVocabDistribution(vocabSrs, vocabList), [vocabSrs, vocabList])
  const vocabActivity = useMemo(() => getVocabActivityLastNDays(vocabSrs, 7), [vocabSrs])
  const vocabStuck = useMemo(() => getStuckVocab(vocabSrs, vocabList, 6), [vocabSrs, vocabList])
  // Streak + today count come from vocab activity (atomic SRS signal).
  const streak = useMemo(() => {
    // Reuse the kanji helper but feed it a synthetic progress map keyed by
    // each vocab entry's lastSeen so we get the same "consecutive days" math.
    const synth: Record<string, CardProgress> = {}
    for (const k in vocabSrs) {
      synth[k] = { kanjiId: k, level: 0, lastSeen: vocabSrs[k].lastSeen, reviewCount: 1 }
    }
    return getStreak(synth)
  }, [vocabSrs])
  const todayCount = useMemo(() => {
    const synth: Record<string, CardProgress> = {}
    for (const k in vocabSrs) {
      synth[k] = { kanjiId: k, level: 0, lastSeen: vocabSrs[k].lastSeen, reviewCount: 1 }
    }
    return getTodayCount(synth)
  }, [vocabSrs])

  // ─── Kanji coverage (no SRS — viewed vs not viewed) ─────────────────
  const kanjiViewed = useMemo(
    () => kanjiList.filter((k) => !!progress[k.id] && progress[k.id].reviewCount > 0).length,
    [kanjiList, progress],
  )
  const kanjiCoverage = kanjiList.length > 0 ? Math.round((kanjiViewed / kanjiList.length) * 100) : 0
  const kanjiActivity = useMemo(() => getActivityLastNDays(progress, 7), [progress])
  const lessonStats = useMemo(() => getLessonStats(progress, kanjiList), [progress, kanjiList])
  const visibleLessons = showAllLessons ? lessonStats : lessonStats.slice(0, 6)

  const goalPct = Math.min(100, Math.round((todayCount / Math.max(1, dailyGoal)) * 100))

  // Dist segment helpers for vocab-reveal
  const vocabSegments = (['new', 0, 1, 2, 3, 4] as const)
    .map((k) => ({
      key: k,
      count: vocabDist[k],
      pct: vocabKpis.total > 0 ? (vocabDist[k] / vocabKpis.total) * 100 : 0,
    }))
    .filter((s) => s.count > 0)
  const VOCAB_COLOR: Record<string, string> = {
    new: 'bg-slate-300 dark:bg-slate-700',
    '0': 'bg-rose-500',
    '1': 'bg-orange-500',
    '2': 'bg-amber-500',
    '3': 'bg-lime-500',
    '4': 'bg-emerald-600',
  }
  const VOCAB_LABEL: Record<string, string> = {
    new: 'New',
    '0': 'L0',
    '1': 'L1',
    '2': 'L2',
    '3': 'L3',
    '4': 'L4 ★',
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

  return (
    <>
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2">
          <Link href="/study/kanji">
            <Button variant="ghost" size="sm" className="gap-1 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <Badge variant="outline" className="gap-1 text-xs">
                <Flame className="h-3 w-3 text-orange-500" />
                {streak}d streak
              </Badge>
            )}
            <Badge variant="outline" className="gap-1 text-xs">
              <Target className="h-3 w-3" />
              {todayCount}/{dailyGoal} today
            </Badge>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {vocabKpis.total} vocab cards · {kanjiList.length} kanji
          </p>
          {/* Daily goal bar */}
          <div className="mt-3">
            <div className="h-2 rounded-full bg-muted overflow-hidden max-w-md">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${goalPct}%` }}
              />
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Daily goal: {goalPct}% · counted from vocab-reveal recalls
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
             SECTION 1 — VOCAB REVEAL DRILL (HERO, primary SRS)
        ═══════════════════════════════════════════════════════════════ */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Vocab reveal drill
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Atomic SRS · big-type kanji → press → kana
                </p>
              </div>
              <Link href="/study/kanji/vocab-reveal">
                <Button size="sm" className="gap-1">
                  <Play className="h-3.5 w-3.5" />
                  Open drill
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-2">
              <KpiTile label="Total" value={vocabKpis.total} />
              <KpiTile label="Mastered" value={vocabKpis.mastered} icon={<CheckCircle2 className="h-3.5 w-3.5" />} tone="emerald" />
              <KpiTile label="Learning" value={vocabKpis.learning} icon={<TrendingUp className="h-3.5 w-3.5" />} tone="sky" />
              <KpiTile label="New" value={vocabKpis.newCount} icon={<Circle className="h-3.5 w-3.5" />} tone="muted" />
            </div>

            {/* Distribution */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Level distribution</span>
                <span className="text-[11px] text-muted-foreground tabular-nums">{vocabKpis.total} cards</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                {vocabSegments.map((s) => (
                  <div
                    key={String(s.key)}
                    className={`${VOCAB_COLOR[String(s.key)]} transition-all`}
                    style={{ width: `${s.pct}%` }}
                    title={`${VOCAB_LABEL[String(s.key)]}: ${s.count}`}
                  />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                {vocabSegments.map((s) => (
                  <span key={String(s.key)} className="flex items-center gap-1">
                    <span className={`h-2 w-2 rounded-sm ${VOCAB_COLOR[String(s.key)]}`} />
                    {VOCAB_LABEL[String(s.key)]} <span className="tabular-nums">{s.count}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 7-day activity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Last 7 days
                </span>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {vocabActivity.reduce((a, b) => a + b.count, 0)} reveals
                </span>
              </div>
              <div className="flex items-end justify-between gap-1.5 h-14">
                {vocabActivity.map((b, i) => {
                  const max = Math.max(1, ...vocabActivity.map((x) => x.count))
                  const h = (b.count / max) * 100
                  const isToday = i === vocabActivity.length - 1
                  return (
                    <div key={b.date} className="flex-1 flex flex-col items-center gap-0.5">
                      <div className="text-[9px] text-muted-foreground tabular-nums">{b.count || ''}</div>
                      <div
                        className={`w-full rounded-t transition-all ${
                          b.count === 0 ? 'bg-muted' : isToday ? 'bg-primary' : 'bg-primary/60'
                        }`}
                        style={{ height: `${Math.max(6, h)}%` }}
                        title={`${b.date}: ${b.count}`}
                      />
                      <div className="text-[9px] text-muted-foreground tabular-nums">
                        {new Date(b.date + 'T00:00').toLocaleDateString(undefined, { weekday: 'narrow' })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Stuck vocab */}
            {vocabStuck.length > 0 && (
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                    Needs attention · {vocabStuck.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {vocabStuck.map(({ row, level, reviewCount }) => (
                    <div key={`${row.word}|${row.reading}`} className="rounded border bg-background p-2 text-center">
                      <div className="text-base font-bold leading-none">{row.word}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 truncate">
                        {row.reading} · {row.meaning}
                      </div>
                      <div className="text-[10px] text-muted-foreground tabular-nums mt-1">
                        L{level} · {reviewCount}×
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════════════════════
             SECTION 2 — KANJI STUDY COVERAGE (no SRS, just visibility)
        ═══════════════════════════════════════════════════════════════ */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Kanji study coverage
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  No level dial — kanji cards are too compound for atomic ratings. Just track what you've opened.
                </p>
              </div>
              <Link href="/study/kanji">
                <Button size="sm" variant="outline" className="gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  Browse
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Coverage bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">Viewed coverage</span>
                <span className="text-xs tabular-nums">
                  <span className="font-bold">{kanjiViewed}</span>{' '}
                  <span className="text-muted-foreground">/ {kanjiList.length} ({kanjiCoverage}%)</span>
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${kanjiCoverage}%` }}
                />
              </div>
            </div>

            {/* 7-day kanji activity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Last 7 days
                </span>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {kanjiActivity.reduce((a, b) => a + b.count, 0)} kanji opened
                </span>
              </div>
              <div className="flex items-end justify-between gap-1.5 h-12">
                {kanjiActivity.map((b, i) => {
                  const max = Math.max(1, ...kanjiActivity.map((x) => x.count))
                  const h = (b.count / max) * 100
                  const isToday = i === kanjiActivity.length - 1
                  return (
                    <div key={b.date} className="flex-1 flex flex-col items-center gap-0.5">
                      <div
                        className={`w-full rounded-t ${
                          b.count === 0 ? 'bg-muted' : isToday ? 'bg-emerald-500' : 'bg-emerald-500/60'
                        }`}
                        style={{ height: `${Math.max(6, h)}%` }}
                        title={`${b.date}: ${b.count}`}
                      />
                      <div className="text-[9px] text-muted-foreground tabular-nums">
                        {new Date(b.date + 'T00:00').toLocaleDateString(undefined, { weekday: 'narrow' })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Lesson coverage breakdown */}
            {lessonStats.length > 0 && (
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    Lesson coverage · {lessonStats.length} lessons
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
                <div className={showAllLessons ? 'max-h-72 overflow-y-auto pr-1 space-y-1.5' : 'space-y-1.5'}>
                  {visibleLessons.map((s) => {
                    const viewedCount = s.mastered + s.learning
                    const pct = s.total > 0 ? (viewedCount / s.total) * 100 : 0
                    return (
                      <div key={s.lesson} className="flex items-center gap-2">
                        <div className="w-7 shrink-0 text-[11px] tabular-nums text-muted-foreground">
                          L{s.lesson}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <div className="w-12 shrink-0 text-right text-[10px] text-muted-foreground tabular-nums">
                          {viewedCount}/{s.total}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="shrink-0 h-6 px-2 text-[10px]"
                          onClick={() =>
                            router.push(`/study/kanji-practice?sort=teacher&count=${Math.min(10, s.total)}&lesson=${s.lesson}` as any)
                          }
                        >
                          Open
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Empty state */}
        {vocabKpis.newCount === vocabKpis.total && kanjiViewed === 0 && (
          <Card className="border-dashed">
            <CardContent className="pt-4 pb-4 text-center space-y-2">
              <Sparkles className="h-6 w-6 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Try the vocab-reveal drill to seed your data.
              </p>
              <Link href="/study/kanji/vocab-reveal">
                <Button size="sm">
                  <Play className="h-3 w-3 mr-1" />
                  Open vocab drill
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

// ──────────────────────────────────────────────────────────────────────────

function KpiTile({
  label,
  value,
  icon,
  tone = 'default',
}: {
  label: string
  value: number
  icon?: React.ReactNode
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
    <div className="rounded-lg border bg-background p-2.5">
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
        {icon}
        {label}
      </div>
      <div className={`text-xl font-bold tabular-nums leading-tight mt-1 ${toneClass}`}>{value}</div>
    </div>
  )
}
