'use client'

/**
 * iVocab Drill — focus-mode flashcard SRS over rendered image-vocabulary cards.
 * Route: /study/ivocab/drill
 *
 * Originally `/study/rpc` (source PDF was named RPC_Vocabs); folder was
 * renamed but storage keys (`rpc-drill-*`, RTDB `rpcSrs`) stay as-is so
 * existing user progress carries over.
 *
 * Two phases: setup → playing.
 *
 * Setup screen — same options as the kanji vocab-reveal drill:
 *   • Cards         25 / 50 / 100 / All
 *   • Level filter  ≤ / ≥ × 0..4
 *   • Order         Teacher / Shuffle / Lowest first
 *   • Reveal        Hidden until tap (default) / Always visible
 *
 * Reveal mechanism: opaque rectangles painted over the kana answer strips,
 * one per highlight (positions in /seed-data/rpc/covers.json). Tap clears
 * them all on the current card. Replaces the older whole-image blur, which
 * was visually noisy and offered no useful peek of the illustration.
 *
 * In-game gestures:
 *   • Tap right half / →     → 1st: reveal kana · 2nd: advance to next
 *   • Tap left half  / ←     → inverse — hide if revealed, else step back
 *   • Swipe right (≥80px)    → ↑ level (knew it)
 *   • Swipe left  (≥80px)    → ↓ level (didn't)
 *   • Drag <80px and release → snap back, no commitment
 *
 * Keyboard (silent power-user shortcuts):
 *   →/Space = next (two-stage) · ← = prev (two-stage) · ↑ = knew · ↓ = didn't ·
 *   R = toggle reveal · Esc = end session · F = toggle fullscreen.
 *
 * Persistence:
 *   • SRS state    — localStorage `rpc-drill-srs` + RTDB `users/{uid}/preferences/rpcSrs`,
 *                    immediate write per rating (no debounce).
 *   • Setup cfg    — cloud-progress key `rpc-drill-config` (10s debounced).
 *   • Queue        — NOT persisted; rebuilt every entry from the manifest + SRS.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowUp, Maximize2, X } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { useSettings } from '@/contexts/settings-context'
import { flushAllPending, loadProgress, saveProgress } from '@/services/cloud-progress.service'
import { SRS, SrsState, cardKey } from '@/types/rpc-srs'
import {
  applyDecay,
  flushNow,
  load as loadSrs,
  persistLocal,
  rate as rateCard,
  scheduleFlush,
} from '@/services/rpc-srs.service'

const CFG_KEY = 'rpc-drill-config'
const MANIFEST_URL = '/seed-data/rpc/pages.json'
const COVERS_URL = '/seed-data/rpc/covers.json'
const IMG_BASE = '/seed-data/rpc/'
const HELP_DISMISSED_KEY = 'rpc-drill-help-dismissed'

const CARD_LIMIT_OPTIONS: { v: number; label: string }[] = [
  { v: 25, label: '25' },
  { v: 50, label: '50' },
  { v: 100, label: '100' },
  { v: 0, label: 'All' },
]

type OrderMode = 'teacher' | 'shuffle' | 'lowest'
type LevelOp = '<=' | '>='
type LevelValue = 0 | 1 | 2 | 3 | 4

interface PageEntry {
  id: string
  page: number
  file: string
}

interface Manifest {
  total: number
  pages: PageEntry[]
  aspectRatio?: string
}

/** Per-card cover rectangles in 0..1 fractions of the page size. The drill
 *  paints these as opaque blocks over the kana answer strips and tap clears
 *  them. Built by scripts/build-rpc-covers.mjs from the source PDF's text
 *  bboxes, so each rect aligns to the highlighted kana on that page. */
interface CoverRect {
  x: number
  y: number
  w: number
  h: number
}
interface CoversManifest {
  pages: Record<string, { rects: CoverRect[] }>
}

interface QueueConfig {
  cardLimit: number
  order: OrderMode
  levelOp: LevelOp
  levelValue: LevelValue
}

const DEFAULT_CFG: QueueConfig = {
  cardLimit: 50,
  order: 'shuffle',
  levelOp: '>=',
  levelValue: 0,
}

// Swipe thresholds — drag past this many px to commit to a rating.
const SWIPE_DX_MIN = 80
const DRAG_DEAD_ZONE = 8

// Card aspect ratio of the rendered PDF pages (720 × 405 → 16:9).
const CARD_ASPECT = '16 / 9'

// ─── Pool helpers ────────────────────────────────────────────────────────

function filterByLevel(
  pages: PageEntry[],
  srs: SrsState,
  op: LevelOp,
  value: number,
): PageEntry[] {
  return pages.filter((p) => {
    const lvl = srs[cardKey(p.id)]?.level ?? 0
    return op === '<=' ? lvl <= value : lvl >= value
  })
}

function minLevelOf(pages: PageEntry[], srs: SrsState): number {
  if (pages.length === 0) return 0
  let min = Infinity
  for (const p of pages) {
    const lvl = srs[cardKey(p.id)]?.level ?? 0
    if (lvl < min) min = lvl
  }
  return min === Infinity ? 0 : min
}

/**
 * Weighted-random sampler with min-gap. Mirrors the kanji drill's algorithm:
 * each card's draw weight = SRS.WEIGHTS[level] (L0 = 5× more likely than L4).
 * A picked card is locked out of the next SRS.MIN_GAP slots.
 */
function buildSmartQueue(
  pool: PageEntry[],
  srs: SrsState,
  queueLength: number,
): PageEntry[] {
  if (pool.length === 0) return []
  const queue: PageEntry[] = []
  const recent: string[] = []
  const minGap = Math.min(SRS.MIN_GAP, Math.max(0, pool.length - 1))

  while (queue.length < queueLength) {
    const eligible = pool.filter((p) => !recent.includes(p.id))
    if (eligible.length === 0) {
      if (recent.length === 0) break
      recent.shift()
      continue
    }
    const total = eligible.reduce(
      (s, p) => s + SRS.WEIGHTS[srs[p.id]?.level ?? 0],
      0,
    )
    let r = Math.random() * total
    let pick = eligible[0]
    for (const p of eligible) {
      r -= SRS.WEIGHTS[srs[p.id]?.level ?? 0]
      if (r <= 0) {
        pick = p
        break
      }
    }
    queue.push(pick)
    recent.push(pick.id)
    if (recent.length > minGap) recent.shift()
  }
  return queue
}

function buildQueue(
  pages: PageEntry[],
  cfg: QueueConfig,
  srs: SrsState,
  queueMultiplier: number,
): PageEntry[] {
  const pool = filterByLevel(pages, srs, cfg.levelOp, cfg.levelValue)
  if (pool.length === 0) return []

  if (cfg.order === 'teacher') {
    return cfg.cardLimit > 0 ? pool.slice(0, cfg.cardLimit) : [...pool]
  }
  if (cfg.order === 'lowest') {
    const sorted = [...pool].sort(
      (a, b) => (srs[a.id]?.level ?? 0) - (srs[b.id]?.level ?? 0),
    )
    return cfg.cardLimit > 0 ? sorted.slice(0, cfg.cardLimit) : sorted
  }
  // shuffle
  const targetLength =
    cfg.cardLimit > 0
      ? cfg.cardLimit
      : Math.max(pool.length, Math.ceil(pool.length * Math.max(1, queueMultiplier)))
  return buildSmartQueue(pool, srs, targetLength)
}

function retuneTail(
  order: PageEntry[],
  fromIndex: number,
  pages: PageEntry[],
  cfg: QueueConfig,
  srs: SrsState,
): PageEntry[] {
  if (cfg.order !== 'shuffle') return order
  const pool = filterByLevel(pages, srs, cfg.levelOp, cfg.levelValue)
  if (pool.length === 0) return order
  const tailNeeded = order.length - fromIndex - 1
  if (tailNeeded <= 0) return order
  const head = order.slice(0, fromIndex + 1)
  const newTail = buildSmartQueue(pool, srs, tailNeeded)
  return head.concat(newTail)
}

// ─── Component ───────────────────────────────────────────────────────────

export default function RpcDrillPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { settings } = useSettings()
  const uid = isAuthenticated && user ? user.uid : null
  const decayDays = settings?.srsDecayDays ?? SRS.DECAY_DAYS
  const queueMultiplier = settings?.srsQueueMultiplier ?? SRS.QUEUE_MULTIPLIER

  const [pages, setPages] = useState<PageEntry[]>([])
  const [covers, setCovers] = useState<Record<string, CoverRect[]>>({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [cfg, setCfg] = useState<QueueConfig>(DEFAULT_CFG)
  const [phase, setPhase] = useState<'setup' | 'playing'>('setup')

  const [order, setOrder] = useState<PageEntry[]>([])
  const [index, setIndex] = useState(0)
  /** How many of the current card's covers have been revealed. Each → press
   *  reveals one more in row-major reading order (top-to-bottom by row,
   *  left-to-right within row). Once all are revealed, the next → advances
   *  to the next card. ← walks back through the same states. */
  const [revealedCount, setRevealedCount] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // SRS state lives in a ref so rating handlers stay stable.
  const srsRef = useRef<SrsState>({})

  // Toast for rating feedback.
  const [toast, setToast] = useState<{ text: string; level: number } | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Floor-level-up celebration (e.g. last L0 graduates → "All ≥ L1").
  const minLevelRef = useRef<number>(0)
  const [levelUp, setLevelUp] = useState<{ level: number } | null>(null)
  const levelUpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Tinder-style live drag state.
  const [dragX, setDragX] = useState(0)
  const [dragY, setDragY] = useState(0)
  const [snapping, setSnapping] = useState(false)
  const isDraggingRef = useRef(false)
  const wasSwipedRef = useRef(false)
  const downXRef = useRef<number | null>(null)
  const downYRef = useRef<number | null>(null)

  // Refs the keyboard listener reads through so it can stay mounted once.
  const nextRef = useRef(() => {})
  const prevRef = useRef(() => {})
  const rateRef = useRef((_knew: boolean) => {})
  const toggleRevealRef = useRef(() => {})
  const dismissHelpRef = useRef(() => {})
  const endSessionRef = useRef(() => {})
  const enterFullscreenRef = useRef(() => {})
  const leaveFullscreenRef = useRef(() => {})
  const stateRef = useRef({ phase: 'setup' as 'setup' | 'playing', fullscreen: false, showHelp: false })
  const lastNavRef = useRef(0)

  // ── Load data + saved cfg + SRS ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const [manifestRes, coversRes] = await Promise.all([
          // Both manifests are regenerated whenever the source PDF changes;
          // bypass the HTTP cache so re-renders are picked up on the next
          // load without forcing a manual hard-refresh. Without this the
          // browser served a stale 782-page pages.json after the PDF was
          // swapped to a 761-page version, queueing missing-image ids.
          fetch(MANIFEST_URL, { cache: 'no-cache' }),
          fetch(COVERS_URL, { cache: 'no-cache' }),
        ])
        if (!manifestRes.ok) throw new Error(`Manifest fetch failed (${manifestRes.status})`)
        const manifest = (await manifestRes.json()) as Manifest
        if (cancelled) return
        setPages(manifest.pages)
        // Covers are best-effort: if the file is missing or malformed the
        // drill still works, just without the answer-strip masks.
        if (coversRes.ok) {
          try {
            const cm = (await coversRes.json()) as CoversManifest
            const flat: Record<string, CoverRect[]> = {}
            for (const [id, p] of Object.entries(cm.pages || {})) flat[id] = p.rects || []
            if (!cancelled) setCovers(flat)
          } catch {
            /* ignore — drill falls back to no covers */
          }
        }

        const savedRaw = await loadProgress<Partial<QueueConfig>>(uid, CFG_KEY, {})
        const savedCfg: QueueConfig = {
          cardLimit:
            typeof savedRaw.cardLimit === 'number' ? savedRaw.cardLimit : DEFAULT_CFG.cardLimit,
          order: (savedRaw.order ?? DEFAULT_CFG.order) as OrderMode,
          levelOp: (savedRaw.levelOp ?? DEFAULT_CFG.levelOp) as LevelOp,
          levelValue: (savedRaw.levelValue ?? DEFAULT_CFG.levelValue) as LevelValue,
        }
        if (!cancelled) setCfg(savedCfg)

        const loaded = await loadSrs(uid)
        const decayed = applyDecay(loaded, Date.now(), decayDays)
        srsRef.current = decayed
        persistLocal(decayed)
        if (uid) scheduleFlush(uid, decayed)
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : 'Failed to load iVocab pages. Run `node scripts/render-rpc-pages.mjs`.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid])

  // Flush pending writes on unmount.
  useEffect(() => {
    return () => {
      if (uid) void flushNow(uid, srsRef.current)
      void flushAllPending()
    }
  }, [uid])

  // ── Session lifecycle ─────────────────────────────────────────────────

  const enterFullscreen = useCallback(() => {
    setRevealedCount(0)
    setFullscreen(true)
    if (typeof window !== 'undefined' && !localStorage.getItem(HELP_DISMISSED_KEY)) {
      setShowHelp(true)
    }
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

  const dismissHelp = useCallback(() => {
    setShowHelp(false)
    try {
      localStorage.setItem(HELP_DISMISSED_KEY, '1')
    } catch {
      /* no-op */
    }
  }, [])

  const startSession = useCallback(
    (sessionCfg: QueueConfig) => {
      if (pages.length === 0) return
      const built = buildQueue(pages, sessionCfg, srsRef.current, queueMultiplier)
      setCfg(sessionCfg)
      setOrder(built)
      setIndex(0)
      setRevealedCount(0)
      setPhase('playing')
      if (!localStorage.getItem(HELP_DISMISSED_KEY)) setShowHelp(true)
      minLevelRef.current = minLevelOf(built, srsRef.current)
      setLevelUp(null)
      saveProgress(uid, CFG_KEY, sessionCfg)
    },
    [pages, queueMultiplier, uid],
  )

  const endSession = useCallback(() => {
    setPhase('setup')
    setOrder([])
    setIndex(0)
    setRevealedCount(0)
    setLevelUp(null)
    if (levelUpTimerRef.current) clearTimeout(levelUpTimerRef.current)
    leaveFullscreen()
  }, [leaveFullscreen])

  /**
   * Progressive reveal then advance. Each call peels off one more cover in
   * row-major reading order; once all are revealed, the next call advances
   * to the next card with all covers re-hidden. Mirrors the kanji vocab-
   * reveal drill's two-stage tap, but with N stages instead of 2.
   *
   * Pages with no covers behave as a plain "advance" — total is 0 so the
   * reveal-loop never fires.
   */
  const next = useCallback(() => {
    if (order.length === 0) return
    const card = order[index]
    if (!card) return
    const total = covers[card.id]?.length ?? 0
    if (revealedCount < total) {
      setRevealedCount((c) => c + 1)
    } else {
      setIndex((i) => (i + 1) % order.length)
      setRevealedCount(0)
    }
  }, [order, index, covers, revealedCount])

  /** Inverse of next: peel revealed covers back one at a time, then step
   *  to the previous card with all of ITS covers shown. */
  const prev = useCallback(() => {
    if (order.length === 0) return
    if (revealedCount > 0) {
      setRevealedCount((c) => c - 1)
    } else {
      const newIdx = (index - 1 + order.length) % order.length
      const newCard = order[newIdx]
      const newTotal = newCard ? covers[newCard.id]?.length ?? 0 : 0
      setIndex(newIdx)
      setRevealedCount(newTotal)
    }
  }, [order, index, covers, revealedCount])

  const toggleReveal = useCallback(
    () => setRevealedCount((c) => {
      const card = order[index]
      const total = card ? covers[card.id]?.length ?? 0 : 0
      return c >= total ? 0 : total
    }),
    [order, index, covers],
  )

  const rateAndAdvance = useCallback(
    (knew: boolean) => {
      const c = order[index]
      if (!c) return
      const key = cardKey(c.id)
      const next = rateCard(srsRef.current, key, knew)
      srsRef.current = next
      persistLocal(next)
      scheduleFlush(uid, next)

      const newLevel = next[key].level
      setToast({ text: knew ? 'Knew it' : 'Didn’t know', level: newLevel })
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
      toastTimerRef.current = setTimeout(() => setToast(null), 700)

      const retuned = retuneTail(order, index, pages, cfg, next)
      const active = retuned !== order ? retuned : order
      if (retuned !== order) setOrder(retuned)

      const newMin = minLevelOf(active, next)
      if (newMin > minLevelRef.current) {
        setLevelUp({ level: newMin })
        if (levelUpTimerRef.current) clearTimeout(levelUpTimerRef.current)
        levelUpTimerRef.current = setTimeout(() => setLevelUp(null), 1000)
      }
      minLevelRef.current = newMin

      setIndex((i) => (i + 1) % active.length)
      setRevealedCount(0)
    },
    [order, index, uid, pages, cfg],
  )

  // ── Keyboard ──────────────────────────────────────────────────────────
  useEffect(() => {
    nextRef.current = next
    prevRef.current = prev
    rateRef.current = rateAndAdvance
    toggleRevealRef.current = toggleReveal
    endSessionRef.current = endSession
    enterFullscreenRef.current = enterFullscreen
    leaveFullscreenRef.current = leaveFullscreen
    dismissHelpRef.current = dismissHelp
    stateRef.current = { phase, fullscreen, showHelp }
  })

  useEffect(() => {
    const NAV_DEBOUNCE_MS = 150
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }
      const { phase, fullscreen, showHelp } = stateRef.current
      if (phase === 'setup') {
        if (e.key === 'Escape') router.push('/study/ivocab')
        return
      }
      if (e.repeat && (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === ' ')) return
      const now = Date.now()
      const navDebounced = now - lastNavRef.current < NAV_DEBOUNCE_MS

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          if (navDebounced) return
          lastNavRef.current = now
          if (showHelp) dismissHelpRef.current()
          nextRef.current()
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (navDebounced) return
          lastNavRef.current = now
          if (showHelp) dismissHelpRef.current()
          prevRef.current()
          break
        case 'ArrowUp':
          e.preventDefault()
          if (navDebounced) return
          lastNavRef.current = now
          if (showHelp) dismissHelpRef.current()
          rateRef.current(true)
          break
        case 'ArrowDown':
          e.preventDefault()
          if (navDebounced) return
          lastNavRef.current = now
          if (showHelp) dismissHelpRef.current()
          rateRef.current(false)
          break
        case 'Escape':
          if (showHelp) dismissHelpRef.current()
          else if (fullscreen) leaveFullscreenRef.current()
          else endSessionRef.current()
          break
        case 'f':
        case 'F':
          if (fullscreen) leaveFullscreenRef.current()
          else enterFullscreenRef.current()
          break
        case '?':
          setShowHelp((s) => !s)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  // ── Touch / pointer handlers (swipe-only navigation; tap = toggle reveal) ──
  const onPointerDown = (e: React.PointerEvent) => {
    wasSwipedRef.current = false
    isDraggingRef.current = false
    downXRef.current = e.clientX
    downYRef.current = e.clientY
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* no-op */
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (downXRef.current === null || downYRef.current === null) return
    const dx = e.clientX - downXRef.current
    const dy = e.clientY - downYRef.current
    if (!isDraggingRef.current && Math.hypot(dx, dy) >= DRAG_DEAD_ZONE) {
      isDraggingRef.current = true
    }
    if (isDraggingRef.current) {
      setSnapping(false)
      setDragX(dx)
      setDragY(dy * 0.3)
    }
  }

  const resetDrag = (animate: boolean) => {
    setSnapping(animate)
    setDragX(0)
    setDragY(0)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* no-op */
    }
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    const dx = downXRef.current !== null ? e.clientX - downXRef.current : 0
    if (Math.abs(dx) >= SWIPE_DX_MIN) {
      wasSwipedRef.current = true
      const dir = dx > 0 ? 1 : -1
      const flyTo = dir * (window.innerWidth + 200)
      setSnapping(true)
      setDragX(flyTo)
      window.setTimeout(() => {
        rateAndAdvance(dir > 0)
        setSnapping(false)
        setDragX(0)
        setDragY(0)
      }, 220)
      return
    }
    resetDrag(true)
  }

  const onPointerCancel = (e: React.PointerEvent) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* no-op */
    }
    isDraggingRef.current = false
    wasSwipedRef.current = false
    downXRef.current = null
    downYRef.current = null
    resetDrag(true)
  }

  /**
   * Tap = navigate, not toggle. Mirrors the kanji vocab-reveal drill:
   * tap on the right half = next (reveal then advance), tap on the left
   * half = prev (hide then step back). Swipes set wasSwipedRef so the
   * synthesized click that follows is eaten.
   */
  const onCardClick = (e: React.MouseEvent) => {
    if (wasSwipedRef.current) {
      wasSwipedRef.current = false
      return
    }
    const now = Date.now()
    if (now - lastNavRef.current < 150) return
    lastNavRef.current = now
    const x = downXRef.current ?? e.clientX
    const halfway = window.innerWidth / 2
    if (x < halfway) prev()
    else next()
    downXRef.current = null
    downYRef.current = null
  }

  // ── Render ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Header />
        <div className="container max-w-3xl mx-auto px-4 py-12 flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </>
    )
  }

  if (loadError) {
    return (
      <>
        <Header />
        <div className="container max-w-3xl mx-auto px-4 py-8 space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <p className="font-semibold">iVocab cards couldn’t load.</p>
              <p className="text-sm text-muted-foreground">{loadError}</p>
              <p className="text-xs text-muted-foreground">
                If the manifest is missing, run <code>node scripts/render-rpc-pages.mjs</code> from the
                repo root, then refresh this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  if (phase === 'setup') {
    return (
      <SetupScreen
        cfg={cfg}
        pages={pages}
        srs={srsRef.current}
        onStart={startSession}
      />
    )
  }

  const current = order[index]
  // Reveal order — column-major: leftmost first, top-to-bottom for ties.
  // Two covers count as the "same column" when their left edges are
  // within 4% of page width (≈29pt at 720pt-wide pages, ≈38pt at 960pt).
  const currentCovers = current
    ? [...(covers[current.id] ?? [])].sort((a, b) => {
        const sameCol = Math.abs(a.x - b.x) < 0.04
        return sameCol ? a.y - b.y : a.x - b.x
      })
    : []
  if (!current) {
    return (
      <>
        <Header />
        <div className="container max-w-3xl mx-auto px-4 py-8 space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="gap-2" onClick={endSession}>
              <ArrowLeft className="h-4 w-4" /> Back to setup
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-muted-foreground">
                No pages match the selected level filter ({cfg.levelOp} L{cfg.levelValue}).
              </p>
              <Button onClick={endSession}>Pick different options</Button>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  const progressPct = order.length > 0 ? ((index + 1) / order.length) * 100 : 0

  // Cards still at level 0/1 (due) and at level 4 (mastered) within the
  // current session pool. Cheap to recompute on every render — the queue
  // is at most a few hundred items.
  const srsStats = (() => {
    let due = 0
    let mastered = 0
    for (const v of order) {
      const lvl = srsRef.current[v.id]?.level ?? 0
      if (lvl <= 1) due += 1
      if (lvl === 4) mastered += 1
    }
    return { due, mastered }
  })()

  const swipeTintR = Math.min(0.18, (dragX / SWIPE_DX_MIN) * 0.18)
  const swipeTintL = Math.min(0.18, (-dragX / SWIPE_DX_MIN) * 0.18)

  // Image + covers — used by both compact and fullscreen layouts. The
  // image fills the wrapper at 16:9; covers are positioned by % of the
  // wrapper since the rects come back as 0..1 fractions of page size.
  const cardBody = (
    <>
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
      {currentCovers.map((r, i) => (
        <div
          key={i}
          className="absolute pointer-events-none transition-opacity duration-150 bg-background ring-1 ring-foreground/10"
          style={{
            left: `${r.x * 100}%`,
            top: `${r.y * 100}%`,
            width: `${r.w * 100}%`,
            height: `${r.h * 100}%`,
            opacity: i < revealedCount ? 0 : 1,
          }}
        />
      ))}
    </>
  )

  // ── Compact (in-page) drill ──────────────────────────────────────────
  // Same gestures as fullscreen: tap left/right halves, swipe to rate.
  // A tiny Maximize button in the card corner is the only fullscreen
  // affordance.
  if (!fullscreen) {
    return (
      <div className="px-3 sm:px-4 py-3 sm:py-4 min-h-[100dvh] flex flex-col gap-2 sm:gap-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2" onClick={endSession}>
            <ArrowLeft className="h-4 w-4" />
            End session
          </Button>
          <div className="flex items-center gap-1.5">
            <span className="text-sm sm:text-xs text-muted-foreground tabular-nums px-1">
              {index + 1} / {order.length}
            </span>
            <span
              className="text-xs sm:text-[10px] text-muted-foreground/70 tabular-nums px-1 hidden sm:inline"
              title="Cards still at level 0 or 1 · cards at level 4 (mastered)"
            >
              {srsStats.due}↻ · {srsStats.mastered}✓
            </span>
            <span
              className="text-xs sm:text-[10px] text-muted-foreground/60 px-1 hidden md:inline"
              title="Locked options for this session"
            >
              {cfg.order} · {cfg.levelOp}L{cfg.levelValue}
            </span>
          </div>
        </div>

        <Card
          className="relative border-border/60 select-none cursor-grab active:cursor-grabbing overflow-hidden flex-1 flex flex-col touch-pinch-zoom rounded-3xl shadow-lg"
          style={{
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            transform: `translate(${dragX}px, ${dragY}px) rotate(${dragX * 0.04}deg)`,
            transition: snapping ? 'transform 220ms ease-out' : 'none',
            willChange: 'transform',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onClick={onCardClick}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted z-10">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {dragX > 0 && (
            <div
              className="absolute inset-0 z-0 pointer-events-none bg-emerald-500"
              style={{ opacity: swipeTintR }}
            />
          )}
          {dragX < 0 && (
            <div
              className="absolute inset-0 z-0 pointer-events-none bg-red-500"
              style={{ opacity: swipeTintL }}
            />
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              enterFullscreen()
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 z-20 h-10 w-10 sm:h-8 sm:w-8 rounded-full bg-card hover:bg-accent border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground transition"
            title="Full-screen"
            aria-label="Enter full-screen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          {/* The image's height comes from `width × 9/16`. To prevent the
              wrapper from being taller than the card (which would push the
              page into a scroll), the width is capped by both 100% AND
              `available_height × 720/405`. The padding constants below
              should match the px-/py- on the outer container plus the
              top-bar height — kept in sync with the wrapper above. */}
          <CardContent className="flex-1 flex items-start justify-center pt-4 px-2 sm:px-4 pb-2 min-h-0">
            <div
              key={`card-${index}`}
              className="relative"
              style={{
                width: 'min(100%, calc((100dvh - 7rem) * 720 / 405))',
                aspectRatio: '720 / 405',
              }}
            >
              {cardBody}
            </div>
          </CardContent>
        </Card>

        {toast && (
          <div className="pointer-events-none fixed inset-x-0 bottom-10 flex justify-center z-30">
            <div className="px-3 py-1.5 rounded-full bg-foreground/85 text-background text-xs font-medium shadow tracking-wide animate-in fade-in duration-150">
              {toast.text} · L{toast.level}
            </div>
          </div>
        )}

        {levelUp && <LevelUpCelebration level={levelUp.level} />}
      </div>
    )
  }

  // ── Fullscreen drill ─────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 bg-background select-none overflow-hidden touch-pinch-zoom"
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClick={onCardClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted z-10">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {dragX > 0 && (
        <div
          className="absolute inset-0 z-0 pointer-events-none bg-emerald-500"
          style={{ opacity: swipeTintR }}
        />
      )}
      {dragX < 0 && (
        <div
          className="absolute inset-0 z-0 pointer-events-none bg-red-500"
          style={{ opacity: swipeTintL }}
        />
      )}

      <div
        className="absolute top-3 left-3 z-20"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
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
        className="absolute top-3 right-3 z-20 flex items-center gap-2"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-end leading-tight px-1">
          <span className="text-sm sm:text-xs text-muted-foreground tabular-nums">
            {index + 1} / {order.length}
          </span>
          <span
            className="text-xs sm:text-[10px] text-muted-foreground/70 tabular-nums"
            title="Cards still at level 0 or 1 · cards at level 4 (mastered)"
          >
            {srsStats.due}↻ · {srsStats.mastered}✓
          </span>
        </div>
      </div>

      {/* Page image centered with its 16:9 aspect, sized to fit the
          viewport. The drag transform is applied to this wrapper so the
          whole card slides (not just the image). */}
      <div
        className="h-full w-full flex items-center justify-center px-4 pt-8 pb-6"
        style={{
          transform: `translate(${dragX}px, ${dragY}px) rotate(${dragX * 0.04}deg)`,
          transition: snapping ? 'transform 220ms ease-out' : 'none',
          willChange: 'transform',
        }}
      >
        <div
          key={`fs-card-${index}`}
          className="relative"
          style={{
            // Width is the smaller of (100% available) or (100% available
            // height × 16/9), keeping the card fully visible without
            // letterboxing into either axis.
            width: 'min(100%, calc((100dvh - 5rem) * 720 / 405))',
            aspectRatio: '720 / 405',
          }}
        >
          {cardBody}
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-12 flex justify-center z-30">
          <div className="px-4 py-2 rounded-full bg-foreground/85 text-background text-sm font-medium shadow-lg tracking-wide animate-in fade-in duration-150">
            {toast.text} · L{toast.level}
          </div>
        </div>
      )}

      {levelUp && <LevelUpCelebration level={levelUp.level} />}

      {showHelp && (
        <div
          className="absolute inset-0 z-30 bg-background/90 backdrop-blur-sm flex items-center justify-center"
          onPointerDown={(e) => {
            e.stopPropagation()
            dismissHelp()
          }}
        >
          <div className="grid grid-cols-2 w-full max-w-3xl gap-4 px-6">
            <div className="rounded-lg border-2 border-dashed border-border p-6 text-center space-y-2">
              <div className="text-4xl font-light">←</div>
              <div className="text-sm font-medium">Tap left half</div>
              <div className="text-xs text-muted-foreground">Hide / previous card</div>
            </div>
            <div className="rounded-lg border-2 border-dashed border-border p-6 text-center space-y-2">
              <div className="text-4xl font-light">→</div>
              <div className="text-sm font-medium">Tap right half</div>
              <div className="text-xs text-muted-foreground">Reveal / next card</div>
            </div>
            <div className="rounded-lg border-2 border-dashed border-emerald-500/50 p-6 text-center space-y-2">
              <div className="text-3xl font-light">↑ / ⇢</div>
              <div className="text-sm font-medium">Swipe right · ↑ key</div>
              <div className="text-xs text-muted-foreground">Knew it (less often)</div>
            </div>
            <div className="rounded-lg border-2 border-dashed border-amber-500/50 p-6 text-center space-y-2">
              <div className="text-3xl font-light">↓ / ⇠</div>
              <div className="text-sm font-medium">Swipe left · ↓ key</div>
              <div className="text-xs text-muted-foreground">Didn't know (more often)</div>
            </div>
            <div className="col-span-2 text-center text-xs text-muted-foreground pt-2">
              Tap anywhere to begin
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Floor-level-up celebration — flashes a centered up-arrow when the
// minimum SRS level across the session pool moves up. ~1s lifespan.
function LevelUpCelebration({ level }: { level: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in-50 duration-300">
        <div className="relative">
          <ArrowUp className="h-24 w-24 text-emerald-500 drop-shadow-lg animate-bounce" />
          <div className="absolute inset-0 -z-10 bg-emerald-500/20 blur-2xl rounded-full" />
        </div>
        <div className="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-lg tabular-nums">
          All ≥ L{level}
        </div>
      </div>
    </div>
  )
}

// ─── Setup screen ────────────────────────────────────────────────────────

function SetupScreen({
  cfg: initialCfg,
  pages,
  srs,
  onStart,
}: {
  cfg: QueueConfig
  pages: PageEntry[]
  srs: SrsState
  onStart: (cfg: QueueConfig) => void
}) {
  const router = useRouter()
  const [draft, setDraft] = useState<QueueConfig>(initialCfg)
  useEffect(() => setDraft(initialCfg), [initialCfg])

  const matching = useMemo(
    () => filterByLevel(pages, srs, draft.levelOp, draft.levelValue).length,
    [pages, srs, draft.levelOp, draft.levelValue],
  )

  const orderOptions: { id: OrderMode; label: string; hint: string }[] = [
    { id: 'teacher', label: 'Teacher order', hint: 'Source order — predictable progression' },
    { id: 'shuffle', label: 'Shuffle (smart)', hint: 'Weighted by SRS level — weak cards more often' },
    { id: 'lowest', label: 'Lowest level first', hint: 'Sort by current level — struggling cards first' },
  ]

  const canStart = pages.length > 0 && matching > 0

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 -ml-2"
          onClick={() => router.push('/study/ivocab')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <span className="text-sm text-muted-foreground">Start a drill session</span>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Cards */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Cards</h3>
            <div className="flex flex-wrap gap-2">
              {CARD_LIMIT_OPTIONS.map(({ v, label }) => (
                <Button
                  key={v}
                  size="sm"
                  variant={draft.cardLimit === v ? 'default' : 'outline'}
                  onClick={() => setDraft({ ...draft, cardLimit: v })}
                  className="min-w-[60px]"
                >
                  {label}
                </Button>
              ))}
            </div>
          </section>

          {/* Level filter */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Level filter</h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex gap-1">
                {(['<=', '>='] as LevelOp[]).map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setDraft({ ...draft, levelOp: op })}
                    className={`h-9 px-3 text-sm font-medium rounded-md border transition-colors ${
                      draft.levelOp === op
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-input hover:border-foreground/30 hover:text-foreground'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">L</span>
              <div className="inline-flex gap-1">
                {[0, 1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setDraft({ ...draft, levelValue: n as LevelValue })}
                    className={`h-9 w-9 text-sm font-medium tabular-nums rounded-md border transition-colors ${
                      draft.levelValue === n
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-input hover:border-foreground/30 hover:text-foreground'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {matching > 0
                ? `${matching} card${matching === 1 ? '' : 's'} match (level ${draft.levelOp} ${draft.levelValue}).`
                : `No cards match level ${draft.levelOp} ${draft.levelValue}. Try the other operator.`}
            </p>
          </section>

          {/* Order */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Order</h3>
            <div className="grid gap-2">
              {orderOptions.map(({ id, label, hint }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDraft({ ...draft, order: id })}
                  className={`text-left rounded-lg border p-3 transition-colors ${
                    draft.order === id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/40'
                      : 'border-input hover:border-foreground/30'
                  }`}
                >
                  <div className="font-medium text-sm">{label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>
                </button>
              ))}
            </div>
          </section>

          <Button
            onClick={() => onStart(draft)}
            disabled={!canStart}
            className="w-full min-h-[48px]"
            size="lg"
          >
            Start session
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">
            Swipe right or press ↑ to mark <span className="text-emerald-600 dark:text-emerald-400 font-medium">knew it</span>; swipe left or press ↓ to mark <span className="text-red-600 dark:text-red-400 font-medium">didn&apos;t</span>. Tap or use ←/→ to navigate.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

