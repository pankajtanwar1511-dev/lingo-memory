'use client'

/**
 * iVocab Insights — SRS state at a glance.
 * Route: /study/ivocab/insights
 *
 * Shows:
 *   • Mastery donut: rated / mastered / unrated.
 *   • Level distribution bar (L0..L4 counts).
 *   • Top "stuck" cards: those rated repeatedly without leveling up.
 */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { useSettings } from '@/contexts/settings-context'
import { applyDecay, load as loadSrs } from '@/services/rpc-srs.service'
import { SrsState } from '@/types/rpc-srs'

const MANIFEST_URL = '/seed-data/rpc/pages.json'

interface PageEntry {
  id: string
  page: number
  file: string
}

const LEVEL_STYLES = [
  'bg-rose-500',     // L0
  'bg-orange-500',   // L1
  'bg-amber-500',    // L2
  'bg-emerald-400',  // L3
  'bg-emerald-600',  // L4
] as const

export default function IVocabInsightsPage() {
  const { user } = useAuth()
  const { settings } = useSettings()
  const decayDays = settings?.srsDecayDays ?? 7
  const uid = user?.uid ?? null

  const [pages, setPages] = useState<PageEntry[]>([])
  const [srs, setSrs] = useState<SrsState>({})

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch(MANIFEST_URL, { cache: 'no-cache' })
        if (!res.ok) return
        const manifest = await res.json()
        if (cancelled) return
        setPages(((manifest.pages ?? []) as PageEntry[]) ?? [])
        const loaded = await loadSrs(uid)
        if (!cancelled) setSrs(applyDecay(loaded, Date.now(), decayDays))
      } catch {
        /* ignore */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [uid, decayDays])

  const stats = useMemo(() => {
    const total = pages.length
    const counts = [0, 0, 0, 0, 0]
    let rated = 0
    for (const p of pages) {
      const c = srs[p.id]
      if (!c) {
        counts[0] += 1 // unrated counted as L0
        continue
      }
      rated += 1
      counts[c.level] += 1
    }
    return {
      total,
      rated,
      unrated: total - rated,
      counts,
      mastered: counts[4],
      due: counts[0] + counts[1],
    }
  }, [pages, srs])

  // Cards that have been reviewed many times but stay at low SRS levels —
  // good candidates for focused practice.
  const stuckCards = useMemo(() => {
    const entries = Object.entries(srs)
      .filter(([, c]) => c.reviewCount >= 3 && c.level <= 1)
      .sort((a, b) => b[1].reviewCount - a[1].reviewCount)
      .slice(0, 8)
    return entries.map(([id, c]) => {
      const p = pages.find((q) => q.id === id)
      return {
        id,
        page: p?.page ?? 0,
        level: c.level,
        reviewCount: c.reviewCount,
        lastSeen: c.lastSeen,
      }
    })
  }, [srs, pages])

  const masteryPct = Math.round((stats.mastered / Math.max(1, stats.total)) * 100)
  const ratedPct = Math.round((stats.rated / Math.max(1, stats.total)) * 100)

  return (
    <>
      <Header />
      <div className="container max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/study/ivocab">
            <Button variant="ghost" size="sm" className="gap-1 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Hub
            </Button>
          </Link>
          <Link href="/study/ivocab/drill">
            <Button size="sm" className="gap-1.5">
              <Play className="h-4 w-4" />
              Start drill
            </Button>
          </Link>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
          <p className="text-sm text-muted-foreground">
            Your iVocab progress. Decayed by {decayDays} idle days.
          </p>
        </div>

        {/* Top-line numbers */}
        <div className="grid grid-cols-3 gap-3">
          <StatCell label="Total cards" value={stats.total} />
          <StatCell label="Rated" value={`${stats.rated}`} hint={`${ratedPct}%`} />
          <StatCell
            label="Mastered"
            value={stats.mastered}
            hint={`${masteryPct}%`}
            tone="success"
          />
        </div>

        {/* Level distribution */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <h3 className="text-sm font-semibold">Level distribution</h3>
            <div className="flex w-full h-3 rounded-full overflow-hidden bg-muted">
              {stats.counts.map((n, lvl) => {
                const pct = (n / Math.max(1, stats.total)) * 100
                return (
                  <div
                    key={lvl}
                    className={LEVEL_STYLES[lvl]}
                    style={{ width: `${pct}%` }}
                    title={`L${lvl}: ${n} cards`}
                  />
                )
              })}
            </div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {stats.counts.map((n, lvl) => (
                <div key={lvl} className="space-y-1">
                  <div
                    className={`mx-auto w-3 h-3 rounded-full ${LEVEL_STYLES[lvl]}`}
                    aria-hidden
                  />
                  <div className="text-sm font-semibold tabular-nums">{n}</div>
                  <div className="text-[10px] text-muted-foreground">L{lvl}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stuck cards */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold">Stuck cards</h3>
              <span className="text-[11px] text-muted-foreground">
                Reviewed ≥3 times, still at L0–L1
              </span>
            </div>
            {stuckCards.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No stuck cards yet — start a drill to see your weakest cards here.
              </p>
            ) : (
              <ul className="divide-y">
                {stuckCards.map((c) => (
                  <li key={c.id} className="py-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-semibold text-white ${LEVEL_STYLES[c.level]}`}
                      >
                        L{c.level}
                      </span>
                      <span className="text-sm font-medium">Card #{c.page}</span>
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {c.reviewCount} reviews
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function StatCell({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string | number
  hint?: string
  tone?: 'success'
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-5 space-y-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div
          className={`text-2xl font-bold tabular-nums ${
            tone === 'success' ? 'text-emerald-600 dark:text-emerald-400' : ''
          }`}
        >
          {value}
        </div>
        {hint && <div className="text-[11px] text-muted-foreground tabular-nums">{hint}</div>}
      </CardContent>
    </Card>
  )
}
