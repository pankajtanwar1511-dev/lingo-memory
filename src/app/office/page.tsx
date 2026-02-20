"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { OfficeCard, OfficeTier, OfficeContext } from "@/types/vocabulary"
import {
  Building2, Search, MessageSquare, BookOpen,
  Eye, RefreshCw, Target, Shuffle, Star,
  GraduationCap, RotateCcw,
  CheckCircle2, ChevronRight, List, X, EyeOff, Zap, Calendar
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import officeData from "@/../public/seed-data/office_vocabulary.json"
import { fsrs as fsrsScheduler, FSRS, type FSRSCard, Rating, CardState } from "@/lib/fsrs"

// ─── Types ────────────────────────────────────────────────────────────────────

type FreqTier = "S" | "A" | "B" | "C" | "all"
type ActiveFilter = "all" | "active" | "passive"

// Serialisable version of FSRSCard (stores Dates as ISO strings for localStorage)
interface FSRSCardData {
  due: string
  stability: number
  difficulty: number
  elapsedDays: number
  scheduledDays: number
  reps: number
  lapses: number
  state: number  // CardState enum value
  lastReview?: string
}

interface CardProgress {
  cardId: string
  knownCount: number
  unknownCount: number
  level: number        // 0–5 (mirrors reps, kept for display/filter compat)
  nextReviewDate?: string  // ISO date (YYYY-MM-DD) — when next due for review
  fsrs?: FSRSCardData  // v2: full FSRS card state (absent = not yet reviewed with v2)
}

// ─── FSRS helpers ──────────────────────────────────────────────────────────────

function fsrsDataToCard(data: FSRSCardData): FSRSCard {
  return {
    ...data,
    due: new Date(data.due),
    lastReview: data.lastReview ? new Date(data.lastReview) : undefined,
    state: data.state as CardState,
  }
}

function cardToFsrsData(card: FSRSCard): FSRSCardData {
  return {
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsedDays,
    scheduledDays: card.scheduledDays,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as number,
    due: card.due.toISOString(),
    lastReview: card.lastReview?.toISOString(),
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all",            label: "All Office",     shortLabel: "All",     color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  { id: "verbs",          label: "Verbs",          shortLabel: "Verbs",   color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
  { id: "meetings",       label: "Meetings",       shortLabel: "Mtgs",    color: "bg-gradient-to-r from-emerald-500 to-teal-500" },
  { id: "project",        label: "Project",        shortLabel: "Proj",    color: "bg-gradient-to-r from-violet-500 to-purple-500" },
  { id: "incident",       label: "Incident",       shortLabel: "Inc",     color: "bg-gradient-to-r from-red-500 to-rose-500" },
  { id: "status",         label: "Status",         shortLabel: "Status",  color: "bg-gradient-to-r from-orange-500 to-amber-500" },
  { id: "keigo",          label: "Keigo",          shortLabel: "Keigo",   color: "bg-gradient-to-r from-pink-500 to-fuchsia-500" },
  { id: "tech",           label: "Tech",           shortLabel: "Tech",    color: "bg-gradient-to-r from-indigo-500 to-blue-500" },
  { id: "time",           label: "Time",           shortLabel: "Time",    color: "bg-gradient-to-r from-yellow-500 to-amber-500" },
  { id: "hr",             label: "HR",             shortLabel: "HR",      color: "bg-gradient-to-r from-teal-500 to-cyan-500" },
  { id: "roles",          label: "Roles",          shortLabel: "Roles",   color: "bg-gradient-to-r from-slate-500 to-gray-500" },
  { id: "communication",  label: "Communication",  shortLabel: "Comms",   color: "bg-gradient-to-r from-cyan-500 to-sky-500" },
  { id: "documents",      label: "Documents",      shortLabel: "Docs",    color: "bg-gradient-to-r from-stone-500 to-neutral-500" },
]

const CONTEXT_TAGS = [
  { id: "all",       label: "All Contexts" },
  { id: "standup",   label: "Standup" },
  { id: "meeting",   label: "Meeting" },
  { id: "email",     label: "Email" },
  { id: "incident",  label: "Incident" },
  { id: "1on1",      label: "1-on-1" },
  { id: "hr",        label: "HR" },
  { id: "client",    label: "Client" },
]

const TIER_LABELS: Record<string, string> = { S: "Daily", A: "Weekly", B: "Monthly", C: "Rare" }
const MATCH_BATCH_SIZE = 10

// SRS v2 button config
const SRS_BUTTONS = [
  { rating: Rating.Again, label: "Again", cls: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950/50 dark:text-red-400" },
  { rating: Rating.Hard,  label: "Hard",  cls: "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-950/50 dark:text-amber-400" },
  { rating: Rating.Good,  label: "Good",  cls: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400" },
  { rating: Rating.Easy,  label: "Easy",  cls: "bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-950/50 dark:text-sky-400" },
] as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryLabel(card: OfficeCard): string {
  return CATEGORIES.find(c => c.id === card.category)?.shortLabel ?? ""
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OfficePage() {
  const router = useRouter()

  // Mode state — mirrors verbs page exactly
  const [flipMode, setFlipMode] = useState(false)
  const [testMode, setTestMode] = useState(false)
  const [matchingMode, setMatchingMode] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedContext, setSelectedContext] = useState("all")
  const [tierFilter, setTierFilter] = useState<FreqTier>("all")
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all")

  // Options
  const [shuffleMode, setShuffleMode] = useState(false)
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [showOnlyUnknown, setShowOnlyUnknown] = useState(false)
  const [showDueOnly, setShowDueOnly] = useState(false)
  const [favoriteCards, setFavoriteCards] = useState<Set<string>>(new Set())

  // Flip card state
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())

  // Test mode (grid)
  const [cardProgress, setCardProgress] = useState<Map<string, CardProgress>>(new Map())

  // Matching state
  const [currentBatch, setCurrentBatch] = useState(0)
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [correctMatches, setCorrectMatches] = useState<Set<string>>(new Set())
  const [wrongAttempts, setWrongAttempts] = useState<Set<string>>(new Set())
  const [shuffledRight, setShuffledRight] = useState<OfficeCard[]>([])
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [batchScores, setBatchScores] = useState<number[]>([])
  const [matchingTestMode, setMatchingTestMode] = useState(false)
  const [showBatchResult, setShowBatchResult] = useState(false)

  // Load favorites + progress from localStorage
  useEffect(() => {
    const fav = localStorage.getItem("officeFavorites")
    if (fav) setFavoriteCards(new Set(JSON.parse(fav)))
    const prog = localStorage.getItem("officeProgress")
    if (prog) {
      const obj = JSON.parse(prog)
      setCardProgress(new Map(Object.entries(obj) as [string, CardProgress][]))
    }
  }, [])

  // ── Data ──────────────────────────────────────────────────────────────────

  const allCards: OfficeCard[] = useMemo(
    () => officeData.entries as OfficeCard[],
    []
  )

  const filteredCards = useMemo(() => {
    let cards = [...allCards]

    if (selectedCategory !== "all") {
      cards = cards.filter(c => c.category === selectedCategory)
    }
    if (selectedContext !== "all") {
      cards = cards.filter(c => c.contexts.includes(selectedContext as OfficeContext))
    }
    if (tierFilter !== "all") {
      cards = cards.filter(c => c.tier === tierFilter)
    }
    if (activeFilter === "active") {
      cards = cards.filter(c => c.active)
    } else if (activeFilter === "passive") {
      cards = cards.filter(c => !c.active)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      cards = cards.filter(c =>
        c.kanji?.toLowerCase().includes(q) ||
        c.kana.includes(q) ||
        c.romaji?.toLowerCase().includes(q) ||
        c.meaning.some(m => m.toLowerCase().includes(q))
      )
    }
    if (showOnlyFavorites) {
      cards = cards.filter(c => favoriteCards.has(c.id))
    }
    if (showOnlyUnknown && testMode) {
      cards = cards.filter(c => {
        const p = cardProgress.get(c.id)
        return !p || p.level < 3
      })
    }
    if (showDueOnly && testMode) {
      const today = new Date().toISOString().split('T')[0]
      cards = cards.filter(c => {
        const p = cardProgress.get(c.id)
        return p?.nextReviewDate && p.nextReviewDate <= today
      })
    }
    if (shuffleMode) {
      cards = [...cards].sort(() => Math.random() - 0.5)
    }
    return cards
  }, [allCards, selectedCategory, selectedContext, tierFilter, activeFilter, searchQuery, showOnlyFavorites, favoriteCards, showOnlyUnknown, showDueOnly, testMode, cardProgress, shuffleMode])

  // Due-today count across ALL filtered cards (ignores showDueOnly so the badge always shows)
  const dueToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return allCards.filter(c => {
      const p = cardProgress.get(c.id)
      return p?.nextReviewDate && p.nextReviewDate <= today
    }).length
  }, [allCards, cardProgress])

  // Reset flip cards when filters change
  useEffect(() => {
    setFlippedCards(new Set())
    setCurrentBatch(0)
    resetMatchingState()
  }, [filteredCards])

  // Shuffle right side when batch or matching mode changes
  useEffect(() => {
    if (matchingMode && filteredCards.length > 0) {
      const batch = getBatchCards()
      setShuffledRight([...batch].sort(() => Math.random() - 0.5))
    }
  }, [currentBatch, matchingMode, filteredCards])

  // ── Helpers ───────────────────────────────────────────────────────────────

  function getBatchCards(): OfficeCard[] {
    const start = currentBatch * MATCH_BATCH_SIZE
    return filteredCards.slice(start, start + MATCH_BATCH_SIZE)
  }

  function isMatchingComplete(): boolean {
    return correctMatches.size === getBatchCards().length
  }

  function resetMatchingState() {
    setSelectedLeft(null)
    setSelectedRight(null)
    setCorrectMatches(new Set())
    setWrongAttempts(new Set())
    setTotalAttempts(0)
  }

  function resetAllMatchingProgress() {
    setCurrentBatch(0)
    setBatchScores([])
    setShowBatchResult(false)
    resetMatchingState()
  }

  function nextBatch() {
    const maxBatch = Math.ceil(filteredCards.length / MATCH_BATCH_SIZE) - 1
    if (currentBatch < maxBatch) {
      setCurrentBatch(b => b + 1)
      resetMatchingState()
    }
  }

  function previousBatch() {
    if (currentBatch > 0) {
      setCurrentBatch(b => b - 1)
      resetMatchingState()
    }
  }

  function calculateFinalScore() {
    if (batchScores.length === 0) return 0
    return Math.round(batchScores.reduce((a, b) => a + b, 0) / batchScores.length)
  }

  // ── Matching handlers ─────────────────────────────────────────────────────

  function handleLeftClick(cardId: string) {
    if (correctMatches.has(cardId)) return
    if (selectedLeft === cardId) { setSelectedLeft(null); return }
    setSelectedLeft(cardId)
    if (selectedRight) checkMatch(cardId, selectedRight)
  }

  function handleRightClick(cardId: string) {
    if (correctMatches.has(cardId)) return
    if (selectedRight === cardId) { setSelectedRight(null); return }
    setSelectedRight(cardId)
    if (selectedLeft) checkMatch(selectedLeft, cardId)
  }

  function checkMatch(leftId: string, rightId: string) {
    setTotalAttempts(t => t + 1)
    if (leftId === rightId) {
      const newCorrect = new Set([...correctMatches, leftId])
      setCorrectMatches(newCorrect)
      setSelectedLeft(null)
      setSelectedRight(null)
      setWrongAttempts(prev => { const s = new Set(prev); s.delete(leftId); return s })

      if (newCorrect.size === getBatchCards().length) {
        if (matchingTestMode) {
          const score = Math.max(0, Math.round((getBatchCards().length / (totalAttempts + 1)) * 100))
          setBatchScores(prev => [...prev, score])
          setShowBatchResult(true)
          const maxBatch = Math.ceil(filteredCards.length / MATCH_BATCH_SIZE) - 1
          if (currentBatch < maxBatch) {
            setTimeout(() => { nextBatch(); setShowBatchResult(false) }, 2000)
          }
        }
      }
    } else {
      setWrongAttempts(prev => new Set([...prev, leftId]))
      setTimeout(() => { setSelectedLeft(null); setSelectedRight(null) }, 500)
    }
  }

  // ── Card progress ─────────────────────────────────────────────────────────

  function markCard(cardId: string, rating: Rating) {
    const now = new Date()
    const current = cardProgress.get(cardId) || { cardId, knownCount: 0, unknownCount: 0, level: 0 }
    // Get existing FSRS card or init a fresh one
    const card = current.fsrs ? fsrsDataToCard(current.fsrs) : fsrsScheduler.initCard()
    // Apply the rating
    const updatedCard = fsrsScheduler.reviewCard(card, rating, now)
    // Derive level (0–5) from reps so existing filters/stats still work
    const newLevel = Math.min(5, updatedCard.reps)
    const nextReviewDate = updatedCard.due.toISOString().split('T')[0]
    const updated: CardProgress = {
      cardId,
      knownCount: current.knownCount + (rating >= Rating.Good ? 1 : 0),
      unknownCount: current.unknownCount + (rating === Rating.Again ? 1 : 0),
      level: newLevel,
      nextReviewDate,
      fsrs: cardToFsrsData(updatedCard),
    }
    const newProgress = new Map(cardProgress)
    newProgress.set(cardId, updated)
    setCardProgress(newProgress)
    const obj: Record<string, CardProgress> = {}
    newProgress.forEach((v, k) => { obj[k] = v })
    localStorage.setItem("officeProgress", JSON.stringify(obj))
    setTimeout(() => setFlippedCards(prev => { const s = new Set(prev); s.delete(cardId); return s }), 500)
  }

  function resetProgress() {
    if (confirm("Reset all progress? This cannot be undone.")) {
      setCardProgress(new Map())
      localStorage.removeItem("officeProgress")
    }
  }

  // ── Favorites ─────────────────────────────────────────────────────────────

  function toggleFavorite(cardId: string, e?: React.MouseEvent) {
    e?.stopPropagation()
    setFavoriteCards(prev => {
      const s = new Set(prev)
      if (s.has(cardId)) s.delete(cardId); else s.add(cardId)
      localStorage.setItem("officeFavorites", JSON.stringify(Array.from(s)))
      return s
    })
  }

  function toggleCardFlip(cardId: string) {
    setFlippedCards(prev => {
      const s = new Set(prev)
      if (s.has(cardId)) s.delete(cardId); else s.add(cardId)
      return s
    })
  }

  // ── Mode selectors ────────────────────────────────────────────────────────

  function activateBrowse() {
    setFlipMode(false); setTestMode(false); setMatchingMode(false)
  }
  function activateFlip() {
    setFlipMode(true); setTestMode(false); setMatchingMode(false)
  }
  function activateTest() {
    setTestMode(true); setFlipMode(true); setMatchingMode(false)
  }
  function activateMatch() {
    setMatchingMode(true); setTestMode(false); setFlipMode(false)
    setCurrentBatch(0); resetMatchingState()
  }

  const isBrowse = !flipMode && !testMode && !matchingMode

  // ── Card content renderer ─────────────────────────────────────────────────

  function renderCardFront(card: OfficeCard) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 px-2 py-4 text-center">
        <div className="text-base font-bold text-primary leading-tight">
          {card.meaning[0]}
        </div>
        {card.meaning.length > 1 && (
          <div className="text-xs text-muted-foreground leading-tight">
            {card.meaning.slice(1, 3).join(", ")}
          </div>
        )}
      </div>
    )
  }

  function renderCardBack(card: OfficeCard) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 px-2 py-4 text-center">
        {card.kanji && (
          <div className="text-2xl sm:text-3xl font-bold text-primary font-japanese">
            {card.kanji}
          </div>
        )}
        <div className={cn("font-japanese text-muted-foreground", card.kanji ? "text-sm" : "text-2xl font-bold text-primary")}>
          {card.kana}
        </div>
        {card.romaji && (
          <div className="text-xs text-muted-foreground/60">{card.romaji}</div>
        )}
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 max-w-7xl">

        {/* ── Hero ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">
              Office Japanese{" "}
              <span className="text-muted-foreground font-normal text-lg">
                · {allCards.length} words
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Workplace vocabulary — standups, messages, incidents, keigo and more
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/office/drills")}
              className="gap-1.5 text-xs border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Zap className="h-3.5 w-3.5" />
              Drills
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/office/scenarios")}
              className="gap-1.5 text-xs"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Scenarios
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/verbs/grammar-reference")}
              className="gap-1.5 text-xs"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Grammar
            </Button>
          </div>
        </div>

        {/* ── Controls Card ── */}
        <Card>
          <CardContent className="pt-4 pb-4 space-y-3">

            {/* Row 1: Search + category buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search by kanji, kana, romaji, or meaning…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {filteredCards.length} / {allCards.length}
                </span>
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1 -mb-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md text-xs font-medium border transition-colors whitespace-nowrap shrink-0",
                      selectedCategory === cat.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    <span className="hidden sm:inline">{cat.label}</span>
                    <span className="sm:hidden">{cat.shortLabel}</span>
                    <span className={cn("text-xs", selectedCategory === cat.id ? "opacity-70" : "text-muted-foreground")}>
                      {cat.id === "all"
                        ? allCards.length
                        : allCards.filter(c => c.category === cat.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Practice Mode selector */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={activateBrowse}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
                  isBrowse
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                )}
              >
                <Eye className="h-3.5 w-3.5" />
                Browse
              </button>

              <button
                onClick={activateFlip}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
                  flipMode && !testMode
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                )}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Flip Cards</span>
                <span className="sm:hidden">Flip</span>
              </button>

              <button
                onClick={activateTest}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
                  testMode
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                )}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                Test
              </button>

              <button
                onClick={activateMatch}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
                  matchingMode
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                )}
              >
                <Target className="h-3.5 w-3.5" />
                Match
              </button>
            </div>

            {/* Row 3: Options */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                <Switch checked={shuffleMode} onCheckedChange={setShuffleMode} />
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Shuffle className="h-3.5 w-3.5" />Shuffle
                </span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                <Switch checked={showOnlyFavorites} onCheckedChange={setShowOnlyFavorites} />
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />Favorites
                </span>
              </label>

              {testMode && (
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                  <Switch checked={showOnlyUnknown} onCheckedChange={v => { setShowOnlyUnknown(v); if (v) setShowDueOnly(false) }} />
                  <span className="text-muted-foreground">Focus needs practice</span>
                </label>
              )}

              {testMode && (
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                  <Switch checked={showDueOnly} onCheckedChange={v => { setShowDueOnly(v); if (v) setShowOnlyUnknown(false) }} />
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Due Today
                    {dueToday > 0 && (
                      <span className="inline-flex items-center justify-center text-[10px] font-bold bg-amber-500 text-white rounded-full h-4 min-w-[16px] px-1">
                        {dueToday}
                      </span>
                    )}
                  </span>
                </label>
              )}

              {matchingMode && (
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                  <Switch
                    checked={matchingTestMode}
                    onCheckedChange={checked => { setMatchingTestMode(checked); if (checked) resetAllMatchingProgress() }}
                  />
                  <span className="text-muted-foreground">Auto-advance</span>
                </label>
              )}

              <button
                onClick={() => {
                  setSearchQuery(""); setSelectedCategory("all"); setSelectedContext("all")
                  setTierFilter("all"); setActiveFilter("all")
                  setFlipMode(false); setTestMode(false); setMatchingMode(false)
                }}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Row 4: Context + Tier + Active/Passive — in Browse/Flip modes */}
            {!matchingMode && (
              <div className="flex flex-col gap-1.5 pt-1 border-t">
                {/* Context filter — horizontal scroll on mobile */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                  <span className="text-xs text-muted-foreground shrink-0 mr-1 whitespace-nowrap">Context:</span>
                  {CONTEXT_TAGS.map(ctx => (
                    <button
                      key={ctx.id}
                      onClick={() => setSelectedContext(ctx.id)}
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium border transition-colors whitespace-nowrap shrink-0",
                        selectedContext === ctx.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                      )}
                    >
                      {ctx.label}
                    </button>
                  ))}
                </div>

                {/* Tier + Active/Passive — horizontal scroll on mobile */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                  <span className="text-xs text-muted-foreground shrink-0 mr-1 whitespace-nowrap">Tier:</span>
                  {(["all", "S", "A", "B", "C"] as FreqTier[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setTierFilter(t)}
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium transition-all whitespace-nowrap shrink-0",
                        tierFilter === t
                          ? t === "S" ? "bg-emerald-600 text-white"
                            : t === "A" ? "bg-blue-600 text-white"
                            : t === "B" ? "bg-amber-600 text-white"
                            : t === "C" ? "bg-gray-500 text-white"
                            : "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {t === "all" ? "All" : t === "S" ? "S·Daily" : t === "A" ? "A·Weekly" : t === "B" ? "B·Monthly" : "C·Rare"}
                    </button>
                  ))}
                  <div className="w-px h-3 bg-border mx-1 shrink-0" />
                  <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">Prod:</span>
                  {([
                    { id: "all", label: "All" },
                    { id: "active", label: "🔵 Active" },
                    { id: "passive", label: "⚪ Passive" },
                  ] as { id: ActiveFilter; label: string }[]).map(f => (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id)}
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium transition-all whitespace-nowrap shrink-0",
                        activeFilter === f.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* ── Empty state ── */}
        {filteredCards.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No words match your filters</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* ════════ CONTENT AREA ════════ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${flipMode}-${testMode}-${matchingMode}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >

            {/* ── Matching Mode ── */}
            {matchingMode && filteredCards.length > 0 && (
              <div className="space-y-4">
                {/* Completed modal */}
                {matchingTestMode && currentBatch >= Math.ceil(filteredCards.length / MATCH_BATCH_SIZE) - 1 && isMatchingComplete() && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
                  >
                    <Card className="max-w-md w-full my-4 sm:my-0">
                      <CardHeader className="text-center">
                        <div className="text-5xl mb-2">🎉</div>
                        <CardTitle className="text-2xl">Test Complete!</CardTitle>
                        <CardDescription>All {Math.ceil(filteredCards.length / MATCH_BATCH_SIZE)} batches done</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-4xl font-bold gradient-text mb-1">{calculateFinalScore()}%</div>
                          <div className="text-sm text-muted-foreground">Overall Score</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {batchScores.map((s, i) => (
                            <div key={i} className="text-center p-2 bg-muted/30 rounded">
                              <div className="text-xs text-muted-foreground">Batch {i + 1}</div>
                              <div className={cn("font-bold text-sm", s >= 90 ? "text-green-600" : s >= 70 ? "text-yellow-600" : "text-red-600")}>
                                {s}%
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <Button onClick={resetAllMatchingProgress} className="flex-1">
                            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                          </Button>
                          <Button variant="outline" onClick={() => { setMatchingMode(false); setMatchingTestMode(false); resetAllMatchingProgress() }} className="flex-1">
                            Exit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Batch header */}
                <Card className="bg-muted/30">
                  <CardContent className="p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="text-sm font-semibold whitespace-nowrap">
                          Batch {currentBatch + 1} / {Math.ceil(filteredCards.length / MATCH_BATCH_SIZE)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                          <span className="text-xs sm:text-sm whitespace-nowrap">Matched: {correctMatches.size} / {getBatchCards().length}</span>
                        </div>
                        {isMatchingComplete() && !matchingTestMode && (
                          <Badge variant="default" className="animate-pulse text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Done!
                          </Badge>
                        )}
                        {showBatchResult && matchingTestMode && (
                          <Badge variant="default" className="animate-pulse text-xs">
                            Score: {batchScores[batchScores.length - 1]}%
                          </Badge>
                        )}
                      </div>
                      {!matchingTestMode && (
                        <div className="flex gap-2 shrink-0">
                          <Button variant="outline" size="sm" onClick={previousBatch} disabled={currentBatch === 0} className="h-8 px-2.5">
                            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                            <span className="ml-1 text-xs">Prev</span>
                          </Button>
                          <Button variant="outline" size="sm" onClick={resetMatchingState} className="h-8 px-2.5">
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span className="ml-1 text-xs">Reset</span>
                          </Button>
                          <Button variant="outline" size="sm" onClick={nextBatch} disabled={currentBatch >= Math.ceil(filteredCards.length / MATCH_BATCH_SIZE) - 1} className="h-8 px-2.5">
                            <span className="mr-1 text-xs">Next</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Matching grid */}
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Left — Japanese */}
                    <div className="space-y-2">
                      <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-400/20 dark:to-cyan-400/20 rounded-md" />
                        <div className="relative text-xs font-bold text-center py-2 px-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-md shadow-md">
                          Japanese
                        </div>
                      </div>
                      {getBatchCards().map((card, i) => (
                        <motion.div key={card.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                          <Card
                            onClick={() => handleLeftClick(card.id)}
                            className={cn(
                              "cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 border",
                              selectedLeft === card.id && "ring-2 ring-blue-400 dark:ring-blue-400 shadow-lg border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20",
                              correctMatches.has(card.id) && "ring-2 ring-green-400 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 opacity-70",
                              wrongAttempts.has(card.id) && !correctMatches.has(card.id) && "ring-2 ring-red-400 border-red-400 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20",
                              !selectedLeft && !correctMatches.has(card.id) && !wrongAttempts.has(card.id) && "border-border hover:border-blue-300 dark:hover:border-blue-500"
                            )}
                          >
                            <CardContent className="p-2 sm:p-2.5 px-2.5 sm:px-3 min-h-[44px] flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] h-4 w-5 flex items-center justify-center p-0 font-bold border-2 shrink-0",
                                  selectedLeft === card.id && "bg-blue-500 text-white border-blue-600",
                                  correctMatches.has(card.id) && "bg-green-500 text-white border-green-600",
                                  wrongAttempts.has(card.id) && !correctMatches.has(card.id) && "bg-red-500 text-white border-red-600"
                                )}
                              >
                                {i + 1}
                              </Badge>
                              <div className="flex-1 font-japanese font-semibold text-sm sm:text-base leading-snug">
                                {card.kanji ?? card.kana}
                              </div>
                              {correctMatches.has(card.id) && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
                                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                                </motion.div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Right — English (shuffled) */}
                    <div className="space-y-2">
                      <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-400/20 dark:to-pink-400/20 rounded-md" />
                        <div className="relative text-xs font-bold text-center py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md shadow-md">
                          English
                        </div>
                      </div>
                      {shuffledRight.map((card, i) => (
                        <motion.div key={card.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                          <Card
                            onClick={() => handleRightClick(card.id)}
                            className={cn(
                              "cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 border",
                              selectedRight === card.id && "ring-2 ring-purple-400 dark:ring-purple-400 shadow-lg border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20",
                              correctMatches.has(card.id) && "ring-2 ring-green-400 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 opacity-70",
                              !selectedRight && !correctMatches.has(card.id) && "border-border hover:border-purple-300 dark:hover:border-purple-500"
                            )}
                          >
                            <CardContent className="p-2 sm:p-2.5 px-2.5 sm:px-3 min-h-[44px] flex items-center justify-center">
                              <div className="text-xs sm:text-sm font-medium text-center flex-1 leading-snug">
                                {card.meaning[0]}
                              </div>
                              {correctMatches.has(card.id) && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
                                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                                </motion.div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Test Mode (grid) ── */}
            {!matchingMode && flipMode && testMode && filteredCards.length > 0 && (
              <div className="space-y-4">
                <Card className="bg-muted/30">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                          <span className="text-xs sm:text-sm">Known: {Array.from(cardProgress.values()).filter(p => p.level >= 3).length}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                          <span className="text-xs sm:text-sm">Needs Practice: {Array.from(cardProgress.values()).filter(p => p.level < 3).length}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-400 shrink-0" />
                          <span className="text-xs sm:text-sm">Not Reviewed: {filteredCards.length - cardProgress.size}</span>
                        </div>
                        {dueToday > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-amber-500 shrink-0" />
                            <span className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-medium">Due: {dueToday}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button variant="outline" size="sm" onClick={() => setFlippedCards(new Set())} disabled={flippedCards.size === 0} className="text-xs sm:text-sm h-8 sm:h-9">
                          <RefreshCw className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Flip All Back</span>
                          <span className="sm:hidden">Flip Back</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={resetProgress} className="text-xs sm:text-sm h-8 sm:h-9">
                          <RotateCcw className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Reset Progress</span>
                          <span className="sm:hidden">Reset</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {filteredCards.map((card, i) => {
                    const isFlipped = flippedCards.has(card.id)
                    const progress = cardProgress.get(card.id)
                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.min(i * 0.02, 0.5) }}
                        style={{ perspective: "1000px" }}
                      >
                        <div className="relative w-full h-full">
                          <div
                            onClick={() => toggleCardFlip(card.id)}
                            className="relative cursor-pointer w-full h-full"
                            style={{
                              transformStyle: "preserve-3d",
                              transition: "transform 0.6s",
                              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                            }}
                          >
                            {/* Front */}
                            <Card
                              className={cn(
                                "transition-all duration-200 relative w-full overflow-hidden border-0 shadow-lg",
                                progress && progress.level >= 3 ? "ring-2 ring-green-400 dark:ring-green-500" :
                                progress && progress.level < 3 ? "ring-2 ring-red-400 dark:ring-red-500" :
                                "hover:shadow-xl hover:-translate-y-0.5"
                              )}
                              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", minHeight: "150px" }}
                            >
                              {progress && (
                                <div className="absolute top-2 left-2 z-10 flex gap-1">
                                  <Badge variant={progress.level >= 3 ? "default" : "destructive"} className="text-[10px] px-1.5 py-0">
                                    L{progress.level}
                                  </Badge>
                                  {progress.nextReviewDate && progress.nextReviewDate <= new Date().toISOString().split('T')[0] && (
                                    <Badge className="text-[10px] px-1.5 py-0 bg-amber-500 hover:bg-amber-500 text-white border-0">
                                      due
                                    </Badge>
                                  )}
                                </div>
                              )}
                              <div className="absolute top-2 right-2 z-10">
                                <button onClick={e => toggleFavorite(card.id, e)} className="p-1.5 rounded-full hover:bg-accent">
                                  <Star className={cn("h-4 w-4", favoriteCards.has(card.id) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400")} />
                                </button>
                              </div>
                              <CardContent className="p-4 text-center min-h-[150px] flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
                                {renderCardFront(card)}
                              </CardContent>
                            </Card>

                            {/* Back */}
                            <Card
                              className="absolute top-0 left-0 w-full overflow-hidden border-0 shadow-lg shadow-violet-200/60 dark:shadow-violet-900/40"
                              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", minHeight: "150px" }}
                            >
                              <div className="h-1.5 sm:h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
                              <CardContent className="p-4 text-center min-h-[140px] flex flex-col items-center justify-center gap-3">
                                {renderCardBack(card)}
                                {/* Tier + active badges */}
                                <div className="flex flex-wrap gap-1 justify-center mt-1">
                                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold",
                                    card.tier === "S" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
                                    card.tier === "A" ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" :
                                    "bg-muted text-muted-foreground"
                                  )}>
                                    {card.tier}·{TIER_LABELS[card.tier]}
                                  </span>
                                  {card.active ? (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium">🔵 Active</span>
                                  ) : (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">⚪ Passive</span>
                                  )}
                                </div>
                                {/* SRS next review date */}
                                {progress?.nextReviewDate && (
                                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {progress.nextReviewDate <= new Date().toISOString().split('T')[0]
                                        ? <span className="text-amber-500 font-medium">due now</span>
                                        : <>next: {progress.nextReviewDate}</>
                                      }
                                    </span>
                                  </div>
                                )}
                                {/* SRS v2 — 4-button rating with interval preview */}
                                {(() => {
                                  const fsrsCard = progress?.fsrs ? fsrsDataToCard(progress.fsrs) : fsrsScheduler.initCard()
                                  const schedules = fsrsScheduler.repeat(fsrsCard, new Date())
                                  return (
                                    <div className="flex gap-1 mt-1">
                                      {SRS_BUTTONS.map(({ rating, label, cls }) => (
                                        <button
                                          key={rating}
                                          onClick={e => { e.stopPropagation(); markCard(card.id, rating) }}
                                          className={cn("flex flex-col items-center rounded px-1.5 py-1 text-center transition-all hover:scale-105", cls)}
                                        >
                                          <span className="text-[11px] font-bold leading-none">{label}</span>
                                          <span className="text-[9px] opacity-70 leading-none mt-0.5">
                                            {FSRS.formatInterval(schedules[rating].scheduledDays)}
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  )
                                })()}
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Flip Cards (not test) ── */}
            {!matchingMode && flipMode && !testMode && filteredCards.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredCards.map((card, i) => {
                  const isFlipped = flippedCards.has(card.id)
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(i * 0.02, 0.5) }}
                      style={{ perspective: "1000px" }}
                    >
                      <div
                        onClick={() => toggleCardFlip(card.id)}
                        className="relative cursor-pointer w-full"
                        style={{
                          transformStyle: "preserve-3d",
                          transition: "transform 0.6s",
                          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}
                      >
                        <Card
                          className="w-full overflow-hidden border-0 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", minHeight: "150px" }}
                        >
                          <div className="absolute top-2 right-2 z-10">
                            <button onClick={e => toggleFavorite(card.id, e)} className="p-1.5 rounded-full hover:bg-accent">
                              <Star className={cn("h-3.5 w-3.5", favoriteCards.has(card.id) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                            </button>
                          </div>
                          <CardContent className="p-4 text-center min-h-[150px] flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
                            {renderCardFront(card)}
                          </CardContent>
                        </Card>

                        <Card
                          className="absolute top-0 left-0 w-full overflow-hidden border-0 shadow-lg shadow-violet-200/60 dark:shadow-violet-900/40"
                          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", minHeight: "150px" }}
                        >
                          <div className="h-1.5 sm:h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
                          <CardContent className="p-4 text-center min-h-[140px] flex items-center justify-center">
                            {renderCardBack(card)}
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* ── Browse Mode ── */}
            {isBrowse && filteredCards.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCards.map((card, i) => {
                  const progress = cardProgress.get(card.id)

                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.4) }}
                    >
                      <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              {/* Japanese */}
                              <div className="flex items-baseline gap-2 flex-wrap">
                                {card.kanji && (
                                  <span className="text-xl font-bold font-japanese">{card.kanji}</span>
                                )}
                                <span className={cn("font-japanese text-muted-foreground", !card.kanji && "text-xl font-bold text-foreground")}>
                                  {card.kana}
                                </span>
                                {card.romaji && (
                                  <span className="text-xs text-muted-foreground/60">{card.romaji}</span>
                                )}
                              </div>
                              {/* English */}
                              <p className="text-sm font-medium mt-1">{card.meaning[0]}</p>
                              {card.meaning.length > 1 && (
                                <p className="text-xs text-muted-foreground">{card.meaning.slice(1, 3).join(", ")}</p>
                              )}
                              {/* Tags row */}
                              <div className="flex flex-wrap gap-1 mt-2">
                                <span className={cn(
                                  "text-[10px] px-1.5 py-0.5 rounded font-medium",
                                  card.tier === "S" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
                                  card.tier === "A" ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" :
                                  card.tier === "B" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" :
                                  "bg-muted text-muted-foreground"
                                )}>
                                  {card.tier}·{TIER_LABELS[card.tier]}
                                </span>
                                {card.active ? (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">🔵 Active</span>
                                ) : (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">⚪ Passive</span>
                                )}
                                {card.contexts.slice(0, 2).map(ctx => (
                                  <span key={ctx} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{ctx}</span>
                                ))}
                              </div>
                              {/* Example sentence */}
                              {card.example && (
                                <div className="mt-2 text-xs bg-muted/40 rounded p-2 space-y-0.5">
                                  <p className="font-japanese font-medium text-foreground">{card.example.japanese}</p>
                                  <p className="font-japanese text-[10px] text-muted-foreground">{card.example.kana}</p>
                                  <p className="text-muted-foreground">{card.example.english}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <button onClick={e => toggleFavorite(card.id, e)} className="p-1 rounded-full hover:bg-accent">
                                <Star className={cn("h-4 w-4", favoriteCards.has(card.id) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                              </button>
                              {progress && (
                                <Badge variant={progress.level >= 3 ? "default" : "destructive"} className="text-[10px] px-1.5 py-0">
                                  L{progress.level}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
