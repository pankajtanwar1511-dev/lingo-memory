"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Flashcard } from "@/components/flashcard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { VocabularyCard } from "@/types/vocabulary"
import {
  ArrowLeft, List, Layers, Shuffle,
  ChevronLeft, ChevronRight, Building2,
  ThumbsUp, ThumbsDown, RotateCcw, MessageSquare,
  CheckCircle2, XCircle, Zap
} from "lucide-react"
import officeData from "@/../public/seed-data/office_vocabulary.json"

// ─── Types ───────────────────────────────────────────────────────────────────

type FreqTier = "S" | "A" | "B" | "C" | "all"
type ActiveFilter = "all" | "active" | "passive"
type ViewMode = "flashcard" | "matching" | "test" | "list"

// Matching game types
interface MatchPair {
  id: string
  japanese: string
  english: string
}
type MatchState = "idle" | "selected" | "matched" | "wrong"
interface MatchCell {
  pair: MatchPair
  side: "jp" | "en"
  state: MatchState
}

// Test mode types
interface TestResult {
  cardId: string
  known: boolean
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all",               label: "All",       color: "bg-gray-100 dark:bg-gray-800" },
  { id: "cat:verbs",         label: "Verbs",     color: "bg-blue-100 dark:bg-blue-950" },
  { id: "cat:project",       label: "Project",   color: "bg-violet-100 dark:bg-violet-950" },
  { id: "cat:meetings",      label: "Meetings",  color: "bg-emerald-100 dark:bg-emerald-950" },
  { id: "cat:incident",      label: "Incident",  color: "bg-red-100 dark:bg-red-950" },
  { id: "cat:status",        label: "Status",    color: "bg-orange-100 dark:bg-orange-950" },
  { id: "cat:keigo",         label: "Keigo",     color: "bg-pink-100 dark:bg-pink-950" },
  { id: "cat:time",          label: "Time",      color: "bg-yellow-100 dark:bg-yellow-950" },
  { id: "cat:hr",            label: "HR",        color: "bg-teal-100 dark:bg-teal-950" },
  { id: "cat:documents",     label: "Docs",      color: "bg-indigo-100 dark:bg-indigo-950" },
  { id: "cat:communication", label: "Comms",     color: "bg-cyan-100 dark:bg-cyan-950" },
  { id: "cat:roles",         label: "Roles",     color: "bg-purple-100 dark:bg-purple-950" },
]

const CONTEXT_FILTERS = [
  { id: "all",       label: "All Contexts" },
  { id: "ctx:standup",   label: "Standup" },
  { id: "ctx:meeting",   label: "Meeting" },
  { id: "ctx:email",     label: "Email" },
  { id: "ctx:incident",  label: "Incident" },
  { id: "ctx:1on1",      label: "1-on-1" },
  { id: "ctx:hr",        label: "HR" },
  { id: "ctx:client",    label: "Client" },
]

const TIER_LABELS: Record<string, string> = {
  S: "Daily", A: "Weekly", B: "Monthly", C: "Rare",
}

const MATCH_BATCH = 6

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTier(card: VocabularyCard): string {
  const tierTag = card.tags.find(t => t.startsWith("tier:"))
  return tierTag ? tierTag.split(":")[1] : "A"
}

function isActive(card: VocabularyCard): boolean {
  return card.tags.includes("active")
}

function getContextTags(card: VocabularyCard): string[] {
  return card.tags
    .filter(t => t.startsWith("ctx:"))
    .map(t => t.split(":")[1])
}

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// ─── Matching Game ────────────────────────────────────────────────────────────

function buildMatchBatch(cards: VocabularyCard[]): MatchCell[] {
  const pairs: MatchPair[] = cards.slice(0, MATCH_BATCH).map(c => ({
    id: c.id,
    japanese: c.kanji ?? c.kana,
    english: c.meaning[0],
  }))
  const jpCells: MatchCell[] = shuffleArray(pairs).map(p => ({
    pair: p, side: "jp", state: "idle",
  }))
  const enCells: MatchCell[] = shuffleArray(pairs).map(p => ({
    pair: p, side: "en", state: "idle",
  }))
  return [...jpCells, ...enCells]
}

interface MatchingGameProps {
  cards: VocabularyCard[]
  onDone: () => void
}

function MatchingGame({ cards, onDone }: MatchingGameProps) {
  const [batchStart, setBatchStart] = useState(0)
  const [cells, setCells] = useState<MatchCell[]>(() =>
    buildMatchBatch(cards)
  )
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [matchedCount, setMatchedCount] = useState(0)
  const [wrongFlash, setWrongFlash] = useState(false)
  const [batchDone, setBatchDone] = useState(false)

  const totalBatches = Math.ceil(cards.length / MATCH_BATCH)
  const currentBatch = Math.floor(batchStart / MATCH_BATCH) + 1
  const batchCards = cards.slice(batchStart, batchStart + MATCH_BATCH)

  const resetBatch = useCallback((newStart: number) => {
    const bCards = cards.slice(newStart, newStart + MATCH_BATCH)
    setCells(buildMatchBatch(bCards))
    setSelectedIdx(null)
    setMatchedCount(0)
    setBatchDone(false)
  }, [cards])

  function handleCellClick(idx: number) {
    const cell = cells[idx]
    if (cell.state === "matched" || cell.state === "wrong") return
    if (selectedIdx === null) {
      setSelectedIdx(idx)
      setCells(prev => prev.map((c, i) => i === idx ? { ...c, state: "selected" } : c))
    } else {
      if (selectedIdx === idx) {
        // Deselect
        setCells(prev => prev.map((c, i) => i === idx ? { ...c, state: "idle" } : c))
        setSelectedIdx(null)
        return
      }
      const prev = cells[selectedIdx]
      const curr = cells[idx]
      if (prev.pair.id === curr.pair.id && prev.side !== curr.side) {
        // Match!
        const newCount = matchedCount + 1
        setCells(c => c.map((cell, i) =>
          i === idx || i === selectedIdx ? { ...cell, state: "matched" } : cell
        ))
        setMatchedCount(newCount)
        setSelectedIdx(null)
        if (newCount === batchCards.length) {
          setTimeout(() => setBatchDone(true), 400)
        }
      } else {
        // Wrong
        setCells(c => c.map((cell, i) =>
          i === idx || i === selectedIdx ? { ...cell, state: "wrong" } : cell
        ))
        setWrongFlash(true)
        setTimeout(() => {
          setCells(c => c.map((cell, i) =>
            (i === idx || i === selectedIdx) && cell.state === "wrong"
              ? { ...cell, state: "idle" }
              : cell
          ))
          setWrongFlash(false)
          setSelectedIdx(null)
        }, 700)
      }
    }
  }

  const jpCells = cells.slice(0, MATCH_BATCH)
  const enCells = cells.slice(MATCH_BATCH)

  if (batchDone) {
    const isLast = batchStart + MATCH_BATCH >= cards.length
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        <div className="text-center">
          <p className="text-xl font-bold">Batch {currentBatch} complete!</p>
          <p className="text-muted-foreground mt-1">{batchCards.length} pairs matched</p>
        </div>
        {isLast ? (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setBatchStart(0); resetBatch(0) }}>
              <RotateCcw className="h-4 w-4 mr-1" /> Restart
            </Button>
            <Button onClick={onDone}>Done</Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setBatchStart(0); resetBatch(0) }}>
              <RotateCcw className="h-4 w-4 mr-1" /> Restart
            </Button>
            <Button onClick={() => {
              const next = batchStart + MATCH_BATCH
              setBatchStart(next)
              resetBatch(next)
            }}>
              Next Batch ({currentBatch + 1}/{totalBatches})
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Batch {currentBatch} of {totalBatches}</span>
        <span>{matchedCount} / {batchCards.length} matched</span>
      </div>
      <Progress value={(matchedCount / batchCards.length) * 100} className="h-1.5" />

      <div className="grid grid-cols-2 gap-3">
        {/* Japanese column */}
        <div className="space-y-2">
          {jpCells.map((cell, i) => (
            <button
              key={`jp-${i}`}
              onClick={() => handleCellClick(i)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg border text-sm font-japanese transition-all",
                cell.state === "idle" && "bg-background border-border hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30",
                cell.state === "selected" && "bg-violet-100 dark:bg-violet-950/60 border-violet-500 ring-1 ring-violet-400",
                cell.state === "matched" && "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300 opacity-60",
                cell.state === "wrong" && "bg-red-50 dark:bg-red-950/40 border-red-400 text-red-700 dark:text-red-300",
              )}
              disabled={cell.state === "matched"}
            >
              {cell.pair.japanese}
            </button>
          ))}
        </div>

        {/* English column */}
        <div className="space-y-2">
          {enCells.map((cell, i) => (
            <button
              key={`en-${i}`}
              onClick={() => handleCellClick(i + MATCH_BATCH)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all",
                cell.state === "idle" && "bg-background border-border hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30",
                cell.state === "selected" && "bg-violet-100 dark:bg-violet-950/60 border-violet-500 ring-1 ring-violet-400",
                cell.state === "matched" && "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300 opacity-60",
                cell.state === "wrong" && "bg-red-50 dark:bg-red-950/40 border-red-400 text-red-700 dark:text-red-300",
              )}
              disabled={cell.state === "matched"}
            >
              {cell.pair.english}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Test Mode ───────────────────────────────────────────────────────────────

interface TestModeProps {
  cards: VocabularyCard[]
  onDone: (results: TestResult[]) => void
}

function TestMode({ cards, onDone }: TestModeProps) {
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])

  const card = cards[idx]

  function handleAnswer(known: boolean) {
    const newResults = [...results, { cardId: card.id, known }]
    setResults(newResults)
    if (idx + 1 >= cards.length) {
      onDone(newResults)
    } else {
      setIdx(i => i + 1)
      setRevealed(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{idx + 1} / {cards.length}</span>
        <div className="flex gap-3 text-xs">
          <span className="text-emerald-600 dark:text-emerald-400">
            ✓ {results.filter(r => r.known).length} known
          </span>
          <span className="text-red-500">
            ✗ {results.filter(r => !r.known).length} learning
          </span>
        </div>
      </div>
      <Progress value={(idx / cards.length) * 100} className="h-1.5" />

      {/* Card */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {/* Front — Japanese */}
        <div className="p-8 text-center bg-gradient-to-b from-violet-50/50 dark:from-violet-950/20 to-transparent">
          {card.kanji && (
            <p className="text-4xl font-bold font-japanese mb-2">{card.kanji}</p>
          )}
          <p className="text-xl text-muted-foreground font-japanese">{card.kana}</p>
          {card.romaji && (
            <p className="text-sm text-muted-foreground/60 mt-1">{card.romaji}</p>
          )}
        </div>

        {/* Reveal button / Answer */}
        {!revealed ? (
          <div className="px-6 pb-8 text-center">
            <Button
              onClick={() => setRevealed(true)}
              variant="outline"
              className="w-full"
            >
              Reveal Meaning
            </Button>
          </div>
        ) : (
          <div className="px-6 pb-6 space-y-4">
            <div className="text-center border-t pt-4">
              <p className="text-lg font-medium">{card.meaning.join(", ")}</p>
              {card.examples?.[0] && (
                <div className="mt-3 text-sm text-muted-foreground bg-muted/40 rounded-lg p-3 text-left">
                  <p className="font-japanese">{card.examples[0].japanese}</p>
                  <p className="mt-1 text-xs">{card.examples[0].english}</p>
                </div>
              )}
            </div>

            {/* Self-assessment buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleAnswer(false)}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 hover:bg-red-200 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-all hover:scale-110"
                title="Still learning"
              >
                <ThumbsDown className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 transition-all hover:scale-110"
                title="I knew it"
              >
                <ThumbsUp className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Test Results ─────────────────────────────────────────────────────────────

interface TestResultsProps {
  results: TestResult[]
  cards: VocabularyCard[]
  onRetry: () => void
  onDone: () => void
}

function TestResults({ results, cards, onRetry, onDone }: TestResultsProps) {
  const known = results.filter(r => r.known).length
  const pct = Math.round((known / results.length) * 100)
  const unknownCards = cards.filter(c => results.find(r => r.cardId === c.id && !r.known))

  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="text-center py-8 space-y-2">
        <div className={cn(
          "text-5xl font-bold",
          pct >= 80 ? "text-emerald-600 dark:text-emerald-400"
            : pct >= 60 ? "text-amber-600 dark:text-amber-400"
            : "text-red-600 dark:text-red-400"
        )}>
          {pct}%
        </div>
        <p className="text-muted-foreground">
          {known} of {results.length} correct
        </p>
        <Progress value={pct} className="h-2 w-48 mx-auto" />
      </div>

      {/* Review unknowns */}
      {unknownCards.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Still learning ({unknownCards.length})</p>
          <div className="space-y-1.5">
            {unknownCards.map(card => (
              <div key={card.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="font-japanese font-medium">{card.kanji ?? card.kana}</span>
                <span className="text-muted-foreground text-sm ml-auto truncate">
                  {card.meaning[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={onRetry}>
          <RotateCcw className="h-4 w-4 mr-1" /> Retry
        </Button>
        <Button onClick={onDone}>Done</Button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OfficePage() {
  const router = useRouter()

  const [viewMode, setViewMode] = useState<ViewMode>("flashcard")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [contextFilter, setContextFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState<FreqTier>("all")
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shuffled, setShuffled] = useState(false)

  // Test mode state
  const [testDone, setTestDone] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [testKey, setTestKey] = useState(0) // remount key for retry

  // Load and type-cast JSON data
  const allCards: VocabularyCard[] = useMemo(
    () => officeData.entries as VocabularyCard[],
    []
  )

  // Filtered + optionally shuffled list
  const filteredCards = useMemo(() => {
    let cards = [...allCards]

    if (categoryFilter !== "all") {
      cards = cards.filter(c => c.tags.includes(categoryFilter))
    }

    if (contextFilter !== "all") {
      cards = cards.filter(c => c.tags.includes(contextFilter))
    }

    if (tierFilter !== "all") {
      cards = cards.filter(c => getTier(c) === tierFilter)
    }

    if (activeFilter === "active") {
      cards = cards.filter(c => isActive(c))
    } else if (activeFilter === "passive") {
      cards = cards.filter(c => !isActive(c))
    }

    if (shuffled) {
      cards = shuffleArray(cards)
    }

    return cards
  }, [allCards, categoryFilter, contextFilter, tierFilter, activeFilter, shuffled])

  // Reset index + test state when filter or mode changes
  useEffect(() => {
    setCurrentIndex(0)
    setTestDone(false)
    setTestResults([])
  }, [filteredCards, viewMode])

  const currentCard = filteredCards[currentIndex]

  const handleShuffle = () => {
    setShuffled(s => !s)
    setCurrentIndex(0)
  }

  function handleModeChange(mode: ViewMode) {
    setViewMode(mode)
    setTestDone(false)
    setTestResults([])
    setTestKey(k => k + 1)
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ── Page header ── */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <h1 className="text-xl font-bold">Office Japanese</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:inline-flex">
              {filteredCards.length} / {allCards.length} words
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/office/scenarios")}
              className="text-violet-600 dark:text-violet-400 border-violet-300 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-950/40"
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline">Scenarios</span>
              <span className="sm:hidden">Scene</span>
            </Button>
          </div>
        </div>

        {/* ── Mode tabs ── */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          {([
            { id: "flashcard", label: "Cards",    icon: <Layers className="h-3.5 w-3.5" /> },
            { id: "matching",  label: "Match",    icon: <Zap className="h-3.5 w-3.5" /> },
            { id: "test",      label: "Test",     icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
            { id: "list",      label: "List",     icon: <List className="h-3.5 w-3.5" /> },
          ] as { id: ViewMode; label: string; icon: React.ReactNode }[]).map(m => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                viewMode === m.id
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="space-y-3">

          {/* Category chips */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all border",
                  categoryFilter === cat.id
                    ? "border-violet-500 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 ring-1 ring-violet-400"
                    : "border-transparent " + cat.color + " text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Context chips */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-muted-foreground shrink-0">Context:</span>
            {CONTEXT_FILTERS.map(ctx => (
              <button
                key={ctx.id}
                onClick={() => setContextFilter(ctx.id)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium transition-all border",
                  contextFilter === ctx.id
                    ? "border-blue-500 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 ring-1 ring-blue-400"
                    : "border-transparent bg-muted text-muted-foreground hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                {ctx.label}
              </button>
            ))}
          </div>

          {/* Tier + Active/Passive row */}
          <div className="flex items-center gap-3 flex-wrap">

            {/* Tier filter */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-1">Tier:</span>
              {(["all", "S", "A", "B", "C"] as FreqTier[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-medium transition-all",
                    tierFilter === t
                      ? t === "S" ? "bg-emerald-600 text-white"
                        : t === "A" ? "bg-blue-600 text-white"
                        : t === "B" ? "bg-amber-600 text-white"
                        : t === "C" ? "bg-gray-500 text-white"
                        : "bg-violet-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {t === "all" ? "All" : `${t} · ${TIER_LABELS[t]}`}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-border" />

            {/* Active/Passive filter */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-1">Mode:</span>
              {([
                { id: "all",     label: "All" },
                { id: "active",  label: "🔵 Active" },
                { id: "passive", label: "⚪ Passive" },
              ] as { id: ActiveFilter; label: string }[]).map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-medium transition-all",
                    activeFilter === f.id
                      ? "bg-violet-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* Shuffle (flashcard + test only) */}
              {(viewMode === "flashcard" || viewMode === "test") && (
                <Button
                  variant={shuffled ? "default" : "outline"}
                  size="sm"
                  onClick={handleShuffle}
                >
                  <Shuffle className="h-3.5 w-3.5 mr-1" />
                  {shuffled ? "Shuffled" : "Shuffle"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ── Empty state ── */}
        {filteredCards.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No words match your filters</p>
            <p className="text-sm mt-1">Try adjusting the category, tier, or mode</p>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            FLASHCARD MODE
        ════════════════════════════════════════════════════════════ */}
        {viewMode === "flashcard" && filteredCards.length > 0 && (
          <div className="space-y-4">

            {/* Card counter + meta */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{currentIndex + 1} of {filteredCards.length}</span>
              {currentCard && (
                <div className="flex items-center gap-2">
                  <span className="text-lg" title={isActive(currentCard) ? "Active — produce this" : "Passive — recognize this"}>
                    {isActive(currentCard) ? "🔵" : "⚪"}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-mono",
                      getTier(currentCard) === "S" && "border-emerald-500 text-emerald-600 dark:text-emerald-400",
                      getTier(currentCard) === "A" && "border-blue-500 text-blue-600 dark:text-blue-400",
                      getTier(currentCard) === "B" && "border-amber-500 text-amber-600 dark:text-amber-400",
                      getTier(currentCard) === "C" && "border-gray-400 text-gray-500",
                    )}
                  >
                    Tier {getTier(currentCard)} · {TIER_LABELS[getTier(currentCard)]}
                  </Badge>
                  {getContextTags(currentCard).slice(0, 2).map(ctx => (
                    <Badge key={ctx} variant="secondary" className="text-xs">
                      {ctx}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {currentCard && (
              <Flashcard card={currentCard} showControls={false} />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              {/* Progress dots (max 10) */}
              <div className="flex gap-1.5">
                {filteredCards.slice(0, 10).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      i === currentIndex
                        ? "bg-violet-600 scale-125"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                    )}
                  />
                ))}
                {filteredCards.length > 10 && (
                  <span className="text-xs text-muted-foreground self-center">
                    +{filteredCards.length - 10}
                  </span>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentIndex(i => Math.min(filteredCards.length - 1, i + 1))}
                disabled={currentIndex === filteredCards.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            MATCHING MODE
        ════════════════════════════════════════════════════════════ */}
        {viewMode === "matching" && filteredCards.length > 0 && (
          <MatchingGame
            key={`match-${categoryFilter}-${contextFilter}-${tierFilter}-${activeFilter}`}
            cards={filteredCards}
            onDone={() => handleModeChange("flashcard")}
          />
        )}

        {/* ════════════════════════════════════════════════════════════
            TEST MODE
        ════════════════════════════════════════════════════════════ */}
        {viewMode === "test" && filteredCards.length > 0 && (
          testDone ? (
            <TestResults
              results={testResults}
              cards={filteredCards}
              onRetry={() => {
                setTestDone(false)
                setTestResults([])
                setTestKey(k => k + 1)
              }}
              onDone={() => handleModeChange("flashcard")}
            />
          ) : (
            <TestMode
              key={testKey}
              cards={filteredCards}
              onDone={(results) => {
                setTestResults(results)
                setTestDone(true)
              }}
            />
          )
        )}

        {/* ════════════════════════════════════════════════════════════
            LIST MODE
        ════════════════════════════════════════════════════════════ */}
        {viewMode === "list" && filteredCards.length > 0 && (
          <div className="space-y-2">
            {filteredCards.map((card, i) => (
              <Card
                key={card.id}
                className={cn(
                  "transition-all hover:shadow-md cursor-pointer",
                  i === currentIndex && "ring-2 ring-violet-500"
                )}
                onClick={() => {
                  setCurrentIndex(i)
                  setViewMode("flashcard")
                }}
              >
                <CardContent className="py-3 px-4">
                  <div className="flex items-center gap-3">

                    {/* Active/Passive dot */}
                    <span className="text-sm flex-shrink-0" title={isActive(card) ? "Active" : "Passive"}>
                      {isActive(card) ? "🔵" : "⚪"}
                    </span>

                    {/* Word */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        {card.kanji && (
                          <span className="font-bold text-base font-japanese">{card.kanji}</span>
                        )}
                        <span className="text-sm text-muted-foreground font-japanese">{card.kana}</span>
                        {card.romaji && (
                          <span className="text-xs text-muted-foreground/60">{card.romaji}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 truncate">
                        {card.meaning.join(", ")}
                      </p>
                    </div>

                    {/* Right badges */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-mono",
                          getTier(card) === "S" && "border-emerald-500 text-emerald-600 dark:text-emerald-400",
                          getTier(card) === "A" && "border-blue-500 text-blue-600 dark:text-blue-400",
                          getTier(card) === "B" && "border-amber-500 text-amber-600 dark:text-amber-400",
                        )}
                      >
                        {getTier(card)}
                      </Badge>
                      {getContextTags(card).slice(0, 1).map(ctx => (
                        <Badge key={ctx} variant="secondary" className="text-xs hidden sm:inline-flex">
                          {ctx}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
