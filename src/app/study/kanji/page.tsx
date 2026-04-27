'use client'

/**
 * Kanji hub — single-page launcher.
 * Route: /study/kanji
 *
 * Three vertical zones:
 *   1. Title strip (gear icon top-right)
 *   2. Today strip — streak + daily goal + Resume CTA (auto-hides if empty)
 *   3. 2x2 tile grid — Kanji / Drill / Dashboard / Reference, each with
 *      a live stat line so the hub doubles as a status snapshot.
 */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Eye,
  Flame,
  Languages,
  Play,
  Target,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CardProgress, ExtendedKanji, MergedVocabRow } from '@/types/extended-kanji'
import { type SrsState } from '@/types/vocab-reveal-srs'
import { load as loadVocabSrs } from '@/services/vocab-reveal-srs.service'
import { useAuth } from '@/contexts/auth-context'
import { loadProgress } from '@/services/cloud-progress.service'
import { useSettings } from '@/contexts/settings-context'
import { useKanjiDataset } from '@/hooks/use-kanji-dataset'
import { KanjiSettingsButton } from '@/components/kanji/settings-dialog'
import {
  getKanjiCoverage,
  getStreak,
  getStuckVocab,
  getTodayCount,
  getVocabKpis,
} from '@/lib/extended-kanji/stats'

const PROGRESS_KEY = 'extended-kanji-practice-progress'

export default function KanjiHubPage() {
  const { user } = useAuth()
  const { settings } = useSettings()
  const { meta: datasetMeta } = useKanjiDataset()
  const dailyGoal = settings?.dailyGoal ?? 20

  const [kanjiList, setKanjiList] = useState<ExtendedKanji[]>([])
  const [vocabList, setVocabList] = useState<MergedVocabRow[]>([])
  const [sentenceCount, setSentenceCount] = useState(0)
  const [progress, setProgress] = useState<Record<string, CardProgress>>({})
  const [vocabSrs, setVocabSrs] = useState<SrsState>({})

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const [kRes, vRes, sRes] = await Promise.all([
          fetch(datasetMeta.fetchUrl),
          fetch('/seed-data/extended-kanji/vocabulary.json'),
          fetch('/seed-data/extended-kanji/sentences.json'),
        ])
        if (!kRes.ok || !vRes.ok || !sRes.ok) return
        const kData = await kRes.json()
        const vData = await vRes.json()
        const sData = await sRes.json()
        if (cancelled) return
        setKanjiList(kData.kanji as ExtendedKanji[])
        setVocabList(vData.vocabulary as MergedVocabRow[])
        setSentenceCount(Array.isArray(sData.sentences) ? sData.sentences.length : 0)

        const [merged, vSrs] = await Promise.all([
          loadProgress<Record<string, CardProgress>>(user?.uid, PROGRESS_KEY, {}),
          loadVocabSrs(user?.uid ?? null),
        ])
        if (!cancelled) {
          setProgress(merged)
          setVocabSrs(vSrs)
        }
      } catch (e) {
        // Hub is non-critical — tiles just show 0s if data fails.
        console.warn('[kanji hub] data load failed:', e)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user?.uid, datasetMeta.fetchUrl])

  // ─── Stats ───────────────────────────────────────────────────────────
  const vocabKpis = useMemo(() => getVocabKpis(vocabSrs, vocabList), [vocabSrs, vocabList])
  const coverage = useMemo(
    () => getKanjiCoverage(kanjiList, vocabSrs, progress),
    [kanjiList, vocabSrs, progress],
  )
  const stuck = useMemo(() => getStuckVocab(vocabSrs, vocabList, 50), [vocabSrs, vocabList])
  const dueCount = vocabKpis.learning // cards rated, not yet at L4 — proxy for "due"
  const stuckCount = stuck.length
  const kanjiViewedCount = useMemo(
    () => kanjiList.filter((k) => !!progress[k.id] && progress[k.id].reviewCount > 0).length,
    [kanjiList, progress],
  )
  const coveragePct = coverage.total > 0 ? Math.round((coverage.covered / coverage.total) * 100) : 0
  const todayCount = useMemo(() => {
    const synth: Record<string, CardProgress> = {}
    for (const k in vocabSrs) {
      synth[k] = { kanjiId: k, level: 0, lastSeen: vocabSrs[k].lastSeen, reviewCount: 1 }
    }
    return getTodayCount(synth)
  }, [vocabSrs])
  const streak = useMemo(() => {
    const synth: Record<string, CardProgress> = {}
    for (const k in vocabSrs) {
      synth[k] = { kanjiId: k, level: 0, lastSeen: vocabSrs[k].lastSeen, reviewCount: 1 }
    }
    return getStreak(synth)
  }, [vocabSrs])

  const goalPct = Math.min(100, Math.round((todayCount / Math.max(1, dailyGoal)) * 100))
  const showToday = streak > 0 || todayCount > 0 || dueCount > 0
  const resumeLabel =
    dueCount > 0
      ? `Resume drill · ${dueCount} due`
      : vocabKpis.newCount > 0
        ? `Start with ${Math.min(10, vocabKpis.newCount)} new vocab`
        : null

  return (
    <>
      <Header />
      <div className="container max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
        {/* ─── Title strip ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Kanji</h1>
          <KanjiSettingsButton />
        </div>

        {/* ─── Today strip (auto-hides for fresh users) ─────────────── */}
        {showToday && (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="flex items-center justify-between gap-3 text-sm flex-wrap">
                {streak > 0 && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Flame className="h-4 w-4 text-orange-500" />
                    {streak}-day streak
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="tabular-nums">
                    <strong>{todayCount}</strong> / {dailyGoal} today
                  </span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${goalPct}%` }}
                />
              </div>
              {resumeLabel && (
                <Link href="/study/kanji/vocab-reveal">
                  <Button className="w-full gap-2 mt-1" size="lg">
                    <Play className="h-4 w-4" />
                    {resumeLabel}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* ─── 2×2 tile grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <HubTile
            href="/study/kanji/list"
            icon={Languages}
            label="Kanji"
            stat={
              kanjiList.length > 0
                ? `${kanjiViewedCount} / ${kanjiList.length} viewed`
                : '—'
            }
          />
          <HubTile
            href="/study/kanji/vocab-reveal"
            icon={Eye}
            label="Drill"
            stat={
              vocabKpis.total > 0
                ? `${dueCount} due · ${stuckCount} stuck`
                : '—'
            }
          />
          <HubTile
            href="/study/kanji/progress"
            icon={TrendingUp}
            label="Dashboard"
            stat={coverage.total > 0 ? `${coveragePct}% covered` : '—'}
          />
          <HubTile
            href="/study/kanji/vocabulary"
            icon={BookOpen}
            label="Reference"
            stat={
              vocabList.length > 0
                ? `${vocabList.length} vocab · ${sentenceCount} sentences`
                : '—'
            }
          />
        </div>
      </div>
    </>
  )
}

// ──────────────────────────────────────────────────────────────────────────

function HubTile({
  href,
  icon: Icon,
  label,
  stat,
}: {
  href: string
  icon: LucideIcon
  label: string
  stat: string
}) {
  return (
    <Link href={href}>
      <Card className="group hover:shadow-lg hover:border-primary/60 transition-all cursor-pointer h-full">
        <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center gap-3 min-h-[160px] sm:min-h-[180px] justify-center">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <div className="space-y-0.5">
            <div className="font-semibold text-base sm:text-lg">{label}</div>
            <div className="text-xs sm:text-sm text-muted-foreground tabular-nums">{stat}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
