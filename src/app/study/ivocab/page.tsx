'use client'

/**
 * iVocab hub — single-page launcher.
 * Route: /study/ivocab
 *
 * Three tiles: Learn (browse without covers), Drill (SRS), Insights (progress).
 * Each tile shows a live stat line so the hub doubles as a status snapshot.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Play, TrendingUp, type LucideIcon } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { applyDecay, load as loadSrs } from '@/services/rpc-srs.service'
import { SrsState } from '@/types/rpc-srs'
import { useSettings } from '@/contexts/settings-context'

const MANIFEST_URL = '/seed-data/rpc/pages.json'

interface PageEntry {
  id: string
  page: number
  file: string
}

export default function IVocabHubPage() {
  const { user } = useAuth()
  const { settings } = useSettings()
  const decayDays = settings?.srsDecayDays ?? 7
  const uid = user?.uid ?? null

  const [total, setTotal] = useState(0)
  const [srs, setSrs] = useState<SrsState>({})

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch(MANIFEST_URL, { cache: 'no-cache' })
        if (!res.ok) return
        const manifest = await res.json()
        if (!cancelled) setTotal(Array.isArray(manifest.pages) ? manifest.pages.length : 0)
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

  // Cards still at L0 or L1 after decay = "due"; L4 = "mastered". Cards that
  // never appeared in SRS are unrated → counted as L0.
  const due = (() => {
    let n = 0
    for (let i = 0; i < total; i += 1) {
      const id = `rpc-${String(i + 1).padStart(4, '0')}`
      const lvl = srs[id]?.level ?? 0
      if (lvl <= 1) n += 1
    }
    return n
  })()
  const mastered = Object.values(srs).filter((c) => c.level === 4).length
  const rated = Object.keys(srs).length

  return (
    <>
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/study">
            <Button variant="ghost" size="sm" className="gap-1 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Study
            </Button>
          </Link>
          <span className="text-sm text-muted-foreground tabular-nums">
            {total} cards · {rated} rated
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">iVocab</h1>
          <p className="text-sm text-muted-foreground">
            Image-card vocabulary deck. Pick a mode to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Tile
            href="/study/ivocab/learn"
            icon={BookOpen}
            title="Learn"
            description="Browse plain images — nothing hidden."
            stat={`${total} cards`}
          />
          <Tile
            href="/study/ivocab/drill"
            icon={Play}
            title="Drill"
            description="SRS flashcards. Reveal answer on tap, swipe to rate."
            stat={`${due} due · ${mastered} mastered`}
            primary
          />
          <Tile
            href="/study/ivocab/insights"
            icon={TrendingUp}
            title="Insights"
            description="Level distribution and session progress."
            stat={`${Math.round((mastered / Math.max(1, total)) * 100)}% mastered`}
          />
        </div>
      </div>
    </>
  )
}

function Tile({
  href,
  icon: Icon,
  title,
  description,
  stat,
  primary = false,
}: {
  href: string
  icon: LucideIcon
  title: string
  description: string
  stat: string
  primary?: boolean
}) {
  return (
    <Link href={href as never}>
      <Card
        className={`h-full transition-colors hover:border-foreground/30 cursor-pointer ${
          primary ? 'ring-1 ring-primary/40 bg-primary/5' : ''
        }`}
      >
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">{title}</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-snug">{description}</p>
          <div className="text-xs tabular-nums text-muted-foreground pt-2 border-t">{stat}</div>
        </CardContent>
      </Card>
    </Link>
  )
}
