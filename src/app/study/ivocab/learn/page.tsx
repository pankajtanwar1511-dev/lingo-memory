'use client'

/**
 * iVocab Learn — plain image browser, no covers, no SRS.
 * Route: /study/ivocab/learn
 *
 * Click left/right halves of the card or use ←/→ to navigate. Same
 * fullscreen toggle as the drill. No reveal mechanic — every answer is
 * always visible.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Maximize2, X } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { loadProgress, saveProgress } from '@/services/cloud-progress.service'

const MANIFEST_URL = '/seed-data/rpc/pages.json'
const IMG_BASE = '/seed-data/rpc/'
// Cloud-progress key — synced to RTDB when signed in, falls back to
// localStorage when offline. Same pattern as the drill's CFG_KEY.
const POSITION_KEY = 'ivocab-learn-position'

interface PageEntry {
  id: string
  page: number
  file: string
}

export default function IVocabLearnPage() {
  const { user } = useAuth()
  const uid = user?.uid ?? null
  const [pages, setPages] = useState<PageEntry[]>([])
  const [index, setIndex] = useState(0)
  const [restored, setRestored] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const downXRef = useRef<number | null>(null)

  // Load manifest + restore last-visited index from cloud-progress (RTDB
  // when signed in, localStorage fallback otherwise).
  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const [manifest, savedIdx] = await Promise.all([
          fetch(MANIFEST_URL, { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)),
          loadProgress<number>(uid, POSITION_KEY, 0),
        ])
        if (cancelled || !manifest) return
        const list = (manifest.pages ?? []) as PageEntry[]
        setPages(list)
        if (Number.isFinite(savedIdx) && savedIdx >= 0 && savedIdx < list.length) {
          setIndex(savedIdx)
        }
        setRestored(true)
      } catch {
        setRestored(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [uid])

  // Persist position so the user picks up where they left off — across
  // devices when signed in. Skip the first write so we don't clobber the
  // restored value with the initial 0.
  useEffect(() => {
    if (!restored || pages.length === 0) return
    saveProgress(uid, POSITION_KEY, index)
  }, [index, pages.length, restored, uid])

  const next = useCallback(() => {
    setIndex((i) => (pages.length === 0 ? 0 : (i + 1) % pages.length))
  }, [pages.length])

  const prev = useCallback(() => {
    setIndex((i) => (pages.length === 0 ? 0 : (i - 1 + pages.length) % pages.length))
  }, [pages.length])

  const enterFullscreen = useCallback(() => {
    setFullscreen(true)
    try {
      document.documentElement.requestFullscreen?.().catch(() => undefined)
    } catch {
      /* no-op */
    }
  }, [])

  const leaveFullscreen = useCallback(() => {
    setFullscreen(false)
    try {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => undefined)
    } catch {
      /* no-op */
    }
  }, [])

  // Keyboard — arrows + space navigate, Esc / F manage fullscreen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      ) return
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prev()
          break
        case 'Escape':
          if (fullscreen) leaveFullscreen()
          break
        case 'f':
        case 'F':
          if (fullscreen) leaveFullscreen()
          else enterFullscreen()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, fullscreen, enterFullscreen, leaveFullscreen])

  const onPointerDown = (e: React.PointerEvent) => {
    downXRef.current = e.clientX
  }

  const onCardClick = (e: React.MouseEvent) => {
    const x = downXRef.current ?? e.clientX
    const halfway = window.innerWidth / 2
    if (x < halfway) prev()
    else next()
    downXRef.current = null
  }

  const current = pages[index]

  if (pages.length === 0) {
    return (
      <>
        <Header />
        <div className="container max-w-3xl mx-auto px-4 py-12 flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </>
    )
  }

  if (!current) return null

  const cardImg = (
    <Image
      src={`${IMG_BASE}${current.file}`}
      alt={`iVocab card ${current.page}`}
      fill
      priority
      sizes="100vw"
      quality={92}
      style={{ objectFit: 'contain' }}
      draggable={false}
    />
  )

  // ── Compact ──
  if (!fullscreen) {
    return (
      <div className="px-3 sm:px-4 py-3 sm:py-4 min-h-[100dvh] flex flex-col gap-2 sm:gap-3">
        <div className="flex items-center justify-between">
          <Link href="/study/ivocab">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Hub
            </Button>
          </Link>
          <span className="text-sm sm:text-xs text-muted-foreground tabular-nums px-1">
            {index + 1} / {pages.length}
          </span>
        </div>

        <Card
          className="relative border-border/60 select-none cursor-pointer overflow-hidden flex-1 flex flex-col rounded-3xl shadow-lg"
          onPointerDown={onPointerDown}
          onClick={onCardClick}
          onContextMenu={(e) => e.preventDefault()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              enterFullscreen()
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 z-20 h-10 w-10 sm:h-8 sm:w-8 rounded-full bg-card hover:bg-accent border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground transition"
            title="Full-screen"
            aria-label="Enter full-screen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          <CardContent className="flex-1 flex items-start justify-center pt-4 px-2 sm:px-4 pb-2 min-h-0">
            <div
              key={`card-${index}`}
              className="relative"
              style={{
                width: 'min(100%, calc((100dvh - 7rem) * 720 / 405))',
                aspectRatio: '720 / 405',
              }}
            >
              {cardImg}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Fullscreen ──
  return (
    <div
      className="fixed inset-0 z-50 bg-background select-none overflow-hidden touch-pinch-zoom"
      onPointerDown={onPointerDown}
      onClick={onCardClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="absolute top-3 left-3 z-20"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={leaveFullscreen}
          className="h-11 w-11 rounded-full bg-card/70 hover:bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition"
          title="Exit full-screen"
          aria-label="Exit full-screen"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className="absolute top-3 right-3 z-20"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs text-muted-foreground tabular-nums px-2">
          {index + 1} / {pages.length}
        </span>
      </div>

      <div className="h-full w-full flex items-center justify-center px-4 pt-8 pb-6">
        <div
          key={`fs-card-${index}`}
          className="relative"
          style={{
            width: 'min(100%, calc((100dvh - 5rem) * 720 / 405))',
            aspectRatio: '720 / 405',
          }}
        >
          {cardImg}
        </div>
      </div>
    </div>
  )
}
