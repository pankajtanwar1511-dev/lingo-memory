"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { OfficeCard } from "@/types/vocabulary"
import {
  ArrowLeft, CheckCircle2, XCircle, Eye,
  ChevronRight, RotateCcw, Zap, AlertTriangle,
  BookOpen, Target
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import drillsData from "@/../public/seed-data/office_drills.json"
import vocabData from "@/../public/seed-data/office_vocabulary.json"

// ─── Types ────────────────────────────────────────────────────────────────────

interface DrillTargets {
  required: string[]
  optional: string[]
  anyOf: string[][]
}

interface DrillStage {
  id: string
  stage: number
  title: string
  titleJa: string
  prompt: string
  hint: string
  targets: DrillTargets
  modelAnswer: { japanese: string; kana: string; english: string }
}

interface DrillPack {
  id: string
  title: string
  titleJa: string
  cluster: string
  description: string
  stages: DrillStage[]
}

type StageStatus = "idle" | "submitted" | "passed" | "failed" | "revealed"

interface TermResult {
  id: string
  matched: boolean
  kanji: string | undefined
  kana: string
  meaning: string
}

interface ValidationResult {
  pass: boolean
  hasJapanese: boolean
  required: TermResult[]
}

interface StageRecord {
  stageId: string
  attempts: number
  status: "passed" | "revealed"
}

// ─── Constants ────────────────────────────────────────────────────────────────

const HAS_JAPANESE = /[ぁ-んァ-ン一-龯]/
const MAX_ATTEMPTS = 2

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateInput(
  input: string,
  targets: DrillTargets,
  vocabMap: Map<string, OfficeCard>
): ValidationResult {
  const hasJapanese = HAS_JAPANESE.test(input)
  const required: TermResult[] = targets.required.map(id => {
    const card = vocabMap.get(id)
    if (!card) return { id, matched: false, kanji: undefined, kana: "?", meaning: id }
    const matched =
      (card.kanji ? input.includes(card.kanji) : false) ||
      input.includes(card.kana)
    return { id, matched, kanji: card.kanji ?? undefined, kana: card.kana, meaning: card.meaning[0] }
  })
  return { pass: hasJapanese && required.every(r => r.matched), hasJapanese, required }
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function PackCard({ pack, onStart }: { pack: DrillPack; onStart: () => void }) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all border-2 hover:border-red-300 dark:hover:border-red-700"
      onClick={onStart}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="destructive" className="text-[10px] font-bold uppercase tracking-wide">
                {pack.cluster}
              </Badge>
              <span className="text-xs text-muted-foreground">{pack.stages.length} stages</span>
            </div>
            <h3 className="text-lg font-bold">{pack.title}</h3>
            <p className="text-sm font-japanese text-muted-foreground">{pack.titleJa}</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{pack.description}</p>
          </div>
          <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
            <Zap className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {pack.stages.map(s => (
            <div
              key={s.id}
              className="flex-1 text-center py-1.5 px-1 bg-muted/60 rounded text-[10px] text-muted-foreground font-medium"
            >
              <div className="font-japanese text-xs font-bold text-foreground">{s.titleJa}</div>
              <div className="mt-0.5">{s.title}</div>
            </div>
          ))}
        </div>
        <Button size="sm" className="mt-4 w-full gap-2">
          <Target className="h-4 w-4" />
          Start Drill
        </Button>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DrillsPage() {
  const router = useRouter()

  const packs = drillsData.packs as DrillPack[]
  const vocabMap = useMemo(() => {
    const m = new Map<string, OfficeCard>()
    ;(vocabData.entries as OfficeCard[]).forEach(e => m.set(e.id, e))
    return m
  }, [])

  // ── Session state ──────────────────────────────────────────────────────────
  const [activePack, setActivePack] = useState<DrillPack | null>(null)
  const [stageIndex, setStageIndex] = useState(0)
  const [input, setInput] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [stageStatus, setStageStatus] = useState<StageStatus>("idle")
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [sessionRecords, setSessionRecords] = useState<StageRecord[]>([])
  const [sessionComplete, setSessionComplete] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus textarea when stage changes
  useEffect(() => {
    if (stageStatus === "idle" && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [stageIndex, stageStatus])

  // ── Computed ───────────────────────────────────────────────────────────────
  const currentStage = activePack ? activePack.stages[stageIndex] : null
  const totalStages = activePack ? activePack.stages.length : 0
  const progressPct = activePack ? ((stageIndex / totalStages) * 100) : 0

  // ── Handlers ──────────────────────────────────────────────────────────────

  function startPack(pack: DrillPack) {
    setActivePack(pack)
    setStageIndex(0)
    setInput("")
    setAttempts(0)
    setStageStatus("idle")
    setValidation(null)
    setSessionRecords([])
    setSessionComplete(false)
  }

  function exitPack() {
    setActivePack(null)
    setSessionComplete(false)
  }

  function handleSubmit() {
    if (!currentStage || !input.trim()) return
    const result = validateInput(input, currentStage.targets, vocabMap)
    setValidation(result)
    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    if (result.pass) {
      setStageStatus("passed")
      setSessionRecords(prev => [...prev, { stageId: currentStage.id, attempts: newAttempts, status: "passed" }])
    } else if (newAttempts >= MAX_ATTEMPTS) {
      setStageStatus("revealed")
      setSessionRecords(prev => [...prev, { stageId: currentStage.id, attempts: newAttempts, status: "revealed" }])
    } else {
      setStageStatus("failed")
    }
  }

  function handleRetry() {
    setInput("")
    setStageStatus("idle")
    setValidation(null)
    if (textareaRef.current) textareaRef.current.focus()
  }

  function handleReveal() {
    if (!currentStage) return
    setStageStatus("revealed")
    setSessionRecords(prev => {
      // Don't double-add if already recorded
      const alreadyRecorded = prev.some(r => r.stageId === currentStage.id)
      if (alreadyRecorded) return prev
      return [...prev, { stageId: currentStage.id, attempts, status: "revealed" }]
    })
  }

  function handleNext() {
    if (!activePack) return
    const nextIndex = stageIndex + 1
    if (nextIndex >= totalStages) {
      setSessionComplete(true)
    } else {
      setStageIndex(nextIndex)
      setInput("")
      setAttempts(0)
      setStageStatus("idle")
      setValidation(null)
    }
  }

  function restartSession() {
    if (!activePack) return
    startPack(activePack)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const passedCount = sessionRecords.filter(r => r.status === "passed").length
  const revealedCount = sessionRecords.filter(r => r.status === "revealed").length

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 max-w-2xl">

        {/* ── Hero ── */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={activePack ? exitPack : () => router.push("/office")}
              className="gap-1.5 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {activePack ? "All Drills" : "Back"}
            </Button>
          </div>
          {activePack && !sessionComplete && (
            <div className="text-sm text-muted-foreground font-medium">
              Stage {stageIndex + 1} / {totalStages}
            </div>
          )}
        </div>

        {!activePack && (
          <div>
            <h1 className="text-2xl font-bold">Office Drills</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Production writing drills — type complete sentences using target vocabulary
            </p>
          </div>
        )}

        {/* ════════ PACK SELECTOR ════════ */}
        {!activePack && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {packs.map(pack => (
                <PackCard key={pack.id} pack={pack} onStart={() => startPack(pack)} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ════════ SESSION COMPLETE ════════ */}
        {activePack && sessionComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <Card className="border-2 border-emerald-300 dark:border-emerald-700">
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-5xl">
                  {revealedCount === 0 ? "🏆" : revealedCount <= 1 ? "✅" : "📝"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {revealedCount === 0 ? "Perfect Run!" : "Drill Complete"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activePack.title} · {activePack.titleJa}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{passedCount}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Passed</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{revealedCount}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Revealed</div>
                  </div>
                </div>

                {/* Stage breakdown */}
                <div className="space-y-2 text-left">
                  {sessionRecords.map((record, i) => {
                    const stage = activePack.stages.find(s => s.id === record.stageId)
                    return (
                      <div
                        key={record.stageId}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-lg text-sm",
                          record.status === "passed"
                            ? "bg-emerald-50 dark:bg-emerald-950/30"
                            : "bg-amber-50 dark:bg-amber-950/30"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {record.status === "passed"
                            ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            : <Eye className="h-4 w-4 text-amber-600 shrink-0" />
                          }
                          <span className="font-medium">{stage?.title ?? `Stage ${i + 1}`}</span>
                          <span className="font-japanese text-muted-foreground text-xs">{stage?.titleJa}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {record.attempts} {record.attempts === 1 ? "try" : "tries"}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={restartSession} className="flex-1 gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={exitPack} className="flex-1 gap-2">
                    <BookOpen className="h-4 w-4" />
                    All Drills
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ════════ ACTIVE DRILL ════════ */}
        {activePack && currentStage && !sessionComplete && (
          <motion.div
            key={currentStage.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Progress bar */}
            <div className="space-y-1">
              <Progress value={progressPct} className="h-1.5" />
              <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
                {activePack.stages.map((s, i) => (
                  <div
                    key={s.id}
                    className={cn(
                      "flex flex-col items-center gap-0.5",
                      i <= stageIndex ? "text-foreground" : ""
                    )}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full border",
                      i < stageIndex ? "bg-emerald-500 border-emerald-500" :
                      i === stageIndex ? "bg-primary border-primary" :
                      "bg-muted border-muted-foreground/30"
                    )} />
                    <span className="hidden sm:block">{s.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage header */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-bold">
                Stage {currentStage.stage}
              </Badge>
              <span className="font-bold text-base">{currentStage.title}</span>
              <span className="font-japanese text-muted-foreground">{currentStage.titleJa}</span>
            </div>

            {/* Prompt card */}
            <Card className="border-2 border-primary/20 bg-gradient-to-b from-background to-muted/20">
              <CardContent className="px-4 py-5 sm:p-6 space-y-3">
                <p className="text-base sm:text-lg font-medium leading-relaxed">
                  {currentStage.prompt}
                </p>
                <div className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-3 py-2 border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{currentStage.hint}</span>
                </div>
              </CardContent>
            </Card>

            {/* Input area — shown in idle + failed states */}
            {(stageStatus === "idle" || stageStatus === "failed") && (
              <div className="space-y-2">
                {stageStatus === "failed" && validation && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 font-medium">
                      <XCircle className="h-4 w-4 shrink-0" />
                      {!validation.hasJapanese
                        ? "Please write in Japanese (kana or kanji)"
                        : `Missing required term${validation.required.filter(r => !r.matched).length > 1 ? "s" : ""}`}
                    </div>
                    {validation.hasJapanese && (
                      <div className="flex flex-wrap gap-1.5">
                        {validation.required.map(term => (
                          <span
                            key={term.id}
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border",
                              term.matched
                                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                                : "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                            )}
                          >
                            {term.matched
                              ? <CheckCircle2 className="h-3 w-3" />
                              : <XCircle className="h-3 w-3" />}
                            <span className="font-japanese">{term.kanji ?? term.kana}</span>
                            <span className="text-[10px] opacity-70">{term.meaning}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Attempt {attempts} of {MAX_ATTEMPTS} — {MAX_ATTEMPTS - attempts} {MAX_ATTEMPTS - attempts === 1 ? "try" : "tries"} remaining
                    </p>
                  </motion.div>
                )}

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit()
                  }}
                  placeholder="日本語で入力してください… (Cmd+Enter to submit)"
                  className={cn(
                    "w-full rounded-xl border-2 px-4 py-3 text-base font-japanese resize-none",
                    "bg-background placeholder:text-muted-foreground/50",
                    "focus:outline-none focus:ring-0 transition-colors",
                    stageStatus === "failed"
                      ? "border-red-300 dark:border-red-700 focus:border-red-400"
                      : "border-border focus:border-primary/60"
                  )}
                  rows={3}
                />

                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className="flex-1 gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Submit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReveal}
                    className="gap-1.5 text-muted-foreground"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Reveal</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Passed state */}
            {stageStatus === "passed" && validation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-5 w-5" />
                  Correct! All required terms used.
                </div>

                {/* Your input */}
                <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20 px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">Your answer</p>
                  <p className="font-japanese text-base leading-relaxed">{input}</p>
                </div>

                {/* Terms matched */}
                <div className="flex flex-wrap gap-1.5">
                  {validation.required.map(term => (
                    <span
                      key={term.id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span className="font-japanese">{term.kanji ?? term.kana}</span>
                      <span className="text-[10px] opacity-70">{term.meaning}</span>
                    </span>
                  ))}
                </div>

                {/* Model answer */}
                <ModelAnswerBlock answer={currentStage.modelAnswer} />

                <Button onClick={handleNext} className="w-full gap-2">
                  {stageIndex + 1 >= totalStages ? "Finish" : "Next Stage"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Revealed state */}
            {stageStatus === "revealed" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
                  <Eye className="h-5 w-5" />
                  Answer revealed
                </div>

                {/* Show what was missing (if they submitted) */}
                {validation && validation.required.some(r => !r.matched) && (
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground font-medium">Required terms:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {validation.required.map(term => (
                        <span
                          key={term.id}
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border",
                            term.matched
                              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                              : "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                          )}
                        >
                          {term.matched
                            ? <CheckCircle2 className="h-3 w-3" />
                            : <XCircle className="h-3 w-3" />}
                          <span className="font-japanese">{term.kanji ?? term.kana}</span>
                          <span className="text-[10px] opacity-70">{term.meaning}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Model answer */}
                <ModelAnswerBlock answer={currentStage.modelAnswer} />

                {/* Target vocab highlight */}
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground font-medium">Study these terms:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentStage.targets.required.map(id => {
                      const card = vocabMap.get(id)
                      if (!card) return null
                      return (
                        <div
                          key={id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border bg-muted/60"
                        >
                          <span className="font-japanese font-bold text-sm">{card.kanji ?? card.kana}</span>
                          {card.kanji && <span className="font-japanese text-muted-foreground">{card.kana}</span>}
                          <span className="text-muted-foreground">— {card.meaning[0]}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full gap-2">
                  {stageIndex + 1 >= totalStages ? "Finish" : "Continue"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

      </main>
    </div>
  )
}

// ─── Model Answer Block ───────────────────────────────────────────────────────

function ModelAnswerBlock({ answer }: { answer: { japanese: string; kana: string; english: string } }) {
  return (
    <div className="rounded-xl border bg-gradient-to-b from-background to-muted/30 p-4 space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Model answer</p>
      <p className="font-japanese text-lg font-semibold leading-relaxed">{answer.japanese}</p>
      <p className="font-japanese text-sm text-muted-foreground">{answer.kana}</p>
      <p className="text-sm text-muted-foreground mt-1">{answer.english}</p>
    </div>
  )
}
