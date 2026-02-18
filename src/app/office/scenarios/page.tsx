"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  ArrowLeft, MessageSquare, Eye, EyeOff,
  ChevronLeft, ChevronRight, RotateCcw,
  CheckCircle2, Play, BookOpen
} from "lucide-react"
import scenariosData from "@/../public/seed-data/office_scenarios.json"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Frame {
  id: string
  contextEn: string
  japanese: string
  kana: string
  english: string
  register: "neutral" | "casual-neutral" | "formal"
}

interface Situation {
  id: string
  title: string
  titleJa: string
  description: string
  color: string
  frames: Frame[]
}

type DrillMode = "browse" | "drill"

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  violet:  { bg: "bg-violet-50 dark:bg-violet-950/20",  text: "text-violet-700 dark:text-violet-300",  border: "border-violet-200 dark:border-violet-800",  badge: "bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300" },
  blue:    { bg: "bg-blue-50 dark:bg-blue-950/20",      text: "text-blue-700 dark:text-blue-300",      border: "border-blue-200 dark:border-blue-800",      badge: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300" },
  red:     { bg: "bg-red-50 dark:bg-red-950/20",        text: "text-red-700 dark:text-red-300",        border: "border-red-200 dark:border-red-800",        badge: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/20",text: "text-emerald-700 dark:text-emerald-300",border: "border-emerald-200 dark:border-emerald-800",badge: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" },
  amber:   { bg: "bg-amber-50 dark:bg-amber-950/20",    text: "text-amber-700 dark:text-amber-300",    border: "border-amber-200 dark:border-amber-800",    badge: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300" },
}

const REGISTER_BADGE: Record<string, string> = {
  "neutral":       "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
  "casual-neutral":"bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300",
  "formal":        "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300",
}

const REGISTER_LABEL: Record<string, string> = {
  "neutral":       "Neutral",
  "casual-neutral":"Casual",
  "formal":        "Formal",
}

// ─── Drill Component ──────────────────────────────────────────────────────────

interface DrillProps {
  situation: Situation
  onExit: () => void
}

function SituationDrill({ situation, onExit }: DrillProps) {
  const [frameIdx, setFrameIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [revealedFrames, setRevealedFrames] = useState<Set<number>>(new Set())
  const [done, setDone] = useState(false)

  const colors = COLOR_MAP[situation.color] ?? COLOR_MAP.violet
  const frame = situation.frames[frameIdx]
  const total = situation.frames.length

  function handleReveal() {
    setRevealed(true)
    setRevealedFrames(prev => new Set(prev).add(frameIdx))
  }

  function handleNext() {
    if (frameIdx + 1 >= total) {
      setDone(true)
    } else {
      setFrameIdx(i => i + 1)
      setRevealed(false)
    }
  }

  function handlePrev() {
    setFrameIdx(i => Math.max(0, i - 1))
    setRevealed(revealedFrames.has(frameIdx - 1))
  }

  function handleRestart() {
    setFrameIdx(0)
    setRevealed(false)
    setRevealedFrames(new Set())
    setDone(false)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        <div>
          <p className="text-xl font-bold">{situation.title} complete!</p>
          <p className="text-muted-foreground mt-1">
            You drilled all {total} sentence frames
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4 mr-1" /> Drill again
          </Button>
          <Button onClick={onExit}>
            Back to scenarios
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Frame {frameIdx + 1} of {total}</span>
        <span>{revealedFrames.size} revealed</span>
      </div>
      <Progress value={(frameIdx / total) * 100} className="h-1.5" />

      {/* Context label */}
      <div className={cn("rounded-lg px-4 py-2 border text-sm font-medium", colors.bg, colors.border, colors.text)}>
        {frame.contextEn}
      </div>

      {/* Drill card */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {/* Japanese (always visible in drill — the prompt) */}
        <div className={cn("p-8 text-center", colors.bg)}>
          <p className="text-3xl font-japanese font-semibold leading-relaxed">
            {frame.japanese}
          </p>
          <p className="text-base text-muted-foreground font-japanese mt-3">
            {frame.kana}
          </p>
        </div>

        {/* English — hidden until revealed */}
        {!revealed ? (
          <div className="px-6 py-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              What does this mean?
            </p>
            <Button onClick={handleReveal} className="w-full sm:w-auto">
              <Eye className="h-4 w-4 mr-2" />
              Reveal Translation
            </Button>
          </div>
        ) : (
          <div className="px-6 py-6 space-y-4">
            <div className="border-t pt-4 text-center">
              <p className="text-lg font-medium">{frame.english}</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", REGISTER_BADGE[frame.register])}>
                  {REGISTER_LABEL[frame.register]}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={frameIdx === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleNext}
              >
                {frameIdx + 1 < total ? (
                  <>Next <ChevronRight className="h-4 w-4 ml-1" /></>
                ) : (
                  <>Finish <CheckCircle2 className="h-4 w-4 ml-1" /></>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Skip navigation (when not revealed) */}
      {!revealed && (
        <div className="flex gap-3 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={frameIdx === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              handleReveal()
              setTimeout(handleNext, 50)
            }}
          >
            Skip
          </Button>
        </div>
      )}
    </div>
  )
}

// ─── Browse Component ─────────────────────────────────────────────────────────

interface BrowseProps {
  situation: Situation
  onStartDrill: () => void
}

function SituationBrowse({ situation, onStartDrill }: BrowseProps) {
  const colors = COLOR_MAP[situation.color] ?? COLOR_MAP.violet

  return (
    <div className="space-y-3">
      {/* Start drill CTA */}
      <div className={cn("rounded-xl border p-4 flex items-center justify-between", colors.bg, colors.border)}>
        <div>
          <p className={cn("font-semibold", colors.text)}>{situation.title}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{situation.frames.length} sentence frames</p>
        </div>
        <Button onClick={onStartDrill} size="sm">
          <Play className="h-3.5 w-3.5 mr-1.5" />
          Drill
        </Button>
      </div>

      {/* Frame list */}
      <div className="space-y-2">
        {situation.frames.map((frame, i) => (
          <Card key={frame.id} className="overflow-hidden">
            <CardContent className="py-0 px-0">
              {/* Context header */}
              <div className={cn("px-4 py-1.5 border-b text-xs font-medium", colors.bg, colors.border, colors.text)}>
                {i + 1}. {frame.contextEn}
              </div>
              {/* Content */}
              <div className="px-4 py-3 space-y-1">
                <p className="font-japanese text-base font-semibold leading-relaxed">
                  {frame.japanese}
                </p>
                <p className="font-japanese text-sm text-muted-foreground">
                  {frame.kana}
                </p>
                <p className="text-sm text-muted-foreground pt-1 border-t border-dashed">
                  {frame.english}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", REGISTER_BADGE[frame.register])}>
                    {REGISTER_LABEL[frame.register]}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ScenariosPage() {
  const router = useRouter()

  const situations: Situation[] = useMemo(
    () => scenariosData.situations as Situation[],
    []
  )

  const [activeSitId, setActiveSitId] = useState(situations[0]?.id ?? "")
  const [drillMode, setDrillMode] = useState<DrillMode>("browse")

  const activeSituation = situations.find(s => s.id === activeSitId) ?? situations[0]

  function handleSelectSituation(id: string) {
    setActiveSitId(id)
    setDrillMode("browse")
  }

  const totalFrames = useMemo(
    () => situations.reduce((sum, s) => sum + s.frames.length, 0),
    [situations]
  )

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ── Page header ── */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/office")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <h1 className="text-xl font-bold">Situation Scenarios</h1>
          </div>
          <Badge variant="outline" className="ml-auto hidden sm:inline-flex">
            {totalFrames} sentence frames
          </Badge>
        </div>

        {/* ── Description ── */}
        <div className="rounded-xl bg-muted/40 border px-4 py-3 text-sm text-muted-foreground">
          <p>
            Real Japanese sentence templates for common office situations.
            Browse all frames or use <strong>Drill mode</strong> to practice: see the Japanese, recall the meaning, reveal and confirm.
          </p>
        </div>

        {/* ── Situation selector tabs ── */}
        <div className="flex gap-2 flex-wrap">
          {situations.map(sit => {
            const colors = COLOR_MAP[sit.color] ?? COLOR_MAP.violet
            return (
              <button
                key={sit.id}
                onClick={() => handleSelectSituation(sit.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                  activeSitId === sit.id
                    ? cn("ring-2 ring-offset-1 ring-violet-400", colors.bg, colors.border, colors.text)
                    : "bg-background border-border text-muted-foreground hover:border-gray-300 dark:hover:border-gray-600 hover:text-foreground"
                )}
              >
                <span className="font-japanese text-base">{sit.titleJa}</span>
                <span className="hidden sm:inline text-xs opacity-70">
                  {sit.frames.length}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Situation detail ── */}
        {activeSituation && (
          <div>
            {drillMode === "browse" ? (
              <SituationBrowse
                situation={activeSituation}
                onStartDrill={() => setDrillMode("drill")}
              />
            ) : (
              <SituationDrill
                key={activeSitId}
                situation={activeSituation}
                onExit={() => setDrillMode("browse")}
              />
            )}
          </div>
        )}

        {/* ── All situations overview (collapsed) ── */}
        {drillMode === "browse" && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">All Situations</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {situations.map(sit => {
                const colors = COLOR_MAP[sit.color] ?? COLOR_MAP.violet
                return (
                  <button
                    key={sit.id}
                    onClick={() => handleSelectSituation(sit.id)}
                    className={cn(
                      "text-left p-4 rounded-xl border transition-all hover:shadow-md",
                      activeSitId === sit.id
                        ? cn(colors.bg, colors.border, "shadow-sm")
                        : "bg-background border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={cn("font-semibold text-sm", activeSitId === sit.id ? colors.text : "")}>
                          {sit.title}
                        </p>
                        <p className="font-japanese text-xs text-muted-foreground mt-0.5">
                          {sit.titleJa}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {sit.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {sit.frames.length}
                      </Badge>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
