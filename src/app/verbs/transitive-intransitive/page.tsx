"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft, ArrowRight, BookOpen, Lightbulb, AlertTriangle,
  CheckCircle2, ChevronRight, Zap, Play
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// ─── Types ────────────────────────────────────────────────────────────────────

interface N5Verb {
  id: string
  lemma: { kanji: string; kana: string }
  morphology: { class: string; isIrregular: boolean }
  valency: { type: string; requiredParticles: string[]; coreStructure?: string }
  meaning: { primary: string; gloss: string[] }
  forms: {
    dictionary: { kanji: string; kana: string }
    masu: { kanji: string; kana: string }
    te: { kanji: string; kana: string }
  }
}

// ─── Static lesson content ────────────────────────────────────────────────────

interface Lesson {
  id: string
  title: string
  subtitle: string
  color: string
  icon: React.ElementType
  content: React.ReactNode
}

// ─── Particle badge ───────────────────────────────────────────────────────────

function ParticleBadge({ p }: { p: string }) {
  const colors: Record<string, string> = {
    を: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-300",
    が: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300",
    に: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300",
    で: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-300",
    と: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300 border-pink-300",
    から: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300",
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded border text-xs font-bold font-mono ${colors[p] ?? "bg-muted border-muted-foreground/30 text-muted-foreground"}`}>
      {p}
    </span>
  )
}

// ─── Lesson walkthrough (same UX as form-tutorials) ───────────────────────────

interface LessonStep {
  id: string
  title: string
  tag?: string
  tagColor?: string
  rule: string
  color: string
  bullets: string[]
  examples: { jp: string; kana: string; en: string; note?: string }[]
  callout?: { type: "tip" | "warn"; text: string }
}

const lessons: LessonStep[] = [
  {
    id: "what",
    title: "What do transitive and intransitive actually mean?",
    rule: "Transitive verbs act ON something. Intransitive verbs just happen.",
    color: "bg-gradient-to-r from-blue-500 to-indigo-500",
    bullets: [
      "Transitive (他動詞 tadōshi): the subject performs an action on an object — someone is doing it to something",
      "Intransitive (自動詞 jidōshi): the action just occurs — no one is 'doing' it to anything",
      "In English this difference is often invisible. In Japanese it changes the particle AND sometimes the verb itself",
    ],
    examples: [
      { jp: "私はドアを開けた。", kana: "わたしはドアをあけた。", en: "I opened the door.", note: "T — I acted on the door, used を" },
      { jp: "ドアが開いた。", kana: "ドアがあいた。", en: "The door opened.", note: "I — the door just opened by itself, used が" },
    ],
    callout: { type: "tip", text: "The easiest shortcut: can you ask 'who did it to what?' → transitive. If the action just happened with no target → intransitive." },
  },
  {
    id: "wo-ga",
    title: "The を signal — your fastest diagnostic",
    rule: "Transitive verbs almost always take を. Intransitive verbs never take を for their main action.",
    color: "bg-gradient-to-r from-orange-500 to-red-500",
    bullets: [
      "を marks the direct object — the thing being acted on",
      "If you can slot を between the noun and the verb, the verb is transitive",
      "Intransitive verbs use に, が, で, と depending on their meaning — never を for the core action",
    ],
    examples: [
      { jp: "本を読む。", kana: "ほんをよむ。", en: "Read a book.", note: "を → transitive (読む)" },
      { jp: "友達に会う。", kana: "ともだちにあう。", en: "Meet a friend.", note: "に, not を → intransitive (会う)" },
      { jp: "駅に着く。", kana: "えきにつく。", en: "Arrive at the station.", note: "に → intransitive (着く)" },
      { jp: "コーヒーを飲む。", kana: "コーヒーをのむ。", en: "Drink coffee.", note: "を → transitive (飲む)" },
    ],
    callout: { type: "warn", text: "Watch out: 歩く (to walk) and 渡る (to cross) are intransitive but use を for the PATH traversed — not a direct object. 道を歩く = walk along the road." },
  },
  {
    id: "pairs",
    title: "Verb pairs — the hardest part of Japanese",
    rule: "Japanese has many T/I verb pairs. Same root, different ending, completely different particle.",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    bullets: [
      "Many actions have TWO verbs: one transitive (someone does it), one intransitive (it just happens)",
      "Common pattern: ～える / ～う  (出す/出る, 入れる/入る)",
      "The transitive verb takes を. The intransitive verb uses が or に",
      "Both verbs exist in the N5 dataset — you will encounter both",
    ],
    examples: [
      { jp: "荷物を出す → 荷物が出る", kana: "にもつをだす → にもつがでる", en: "Take out the luggage (T) → The luggage comes out (I)", note: "出す/出る pair" },
      { jp: "お金を入れる → 人が入る", kana: "おかねをいれる → ひとがはいる", en: "Put money in (T) → A person enters (I)", note: "入れる/入る pair" },
      { jp: "仕事を始める → 仕事が始まる", kana: "しごとをはじめる → しごとがはじまる", en: "Start the work (T) → The work starts (I)", note: "始める/始まる — 始まる not in N5 dataset but you'll hear it" },
    ],
    callout: { type: "tip", text: "Memory trick for pairs: ～える endings are usually transitive (someone is doing something). ～う / ～る endings are often intransitive (it just happens). Not 100% reliable, but helpful." },
  },
  {
    id: "te-iru",
    title: "The て+いる trap — same grammar, opposite meaning",
    rule: "T + て+いる = action in progress. I + て+いる = resulting state.",
    color: "bg-gradient-to-r from-teal-500 to-cyan-500",
    bullets: [
      "て+いる is N5 grammar, but its meaning depends entirely on whether the verb is transitive or intransitive",
      "Transitive + て+いる: someone is currently performing the action (like English -ing)",
      "Intransitive + て+いる: the action has already happened and the result remains",
      "This is one of the most tested distinctions at N4/N3 — understanding it at N5 level pays off",
    ],
    examples: [
      { jp: "窓を開けています。", kana: "まどをあけています。", en: "I am (currently) opening the window.", note: "開ける = T → action ongoing" },
      { jp: "窓が開いています。", kana: "まどがあいています。", en: "The window is open (and has been opened).", note: "開く = I → resulting state" },
      { jp: "電気をつけています。", kana: "でんきをつけています。", en: "I am turning on the light.", note: "つける = T → action in progress" },
      { jp: "電気がついています。", kana: "でんきがついています。", en: "The light is on.", note: "つく = I → current state" },
    ],
    callout: { type: "warn", text: "窓を開けていますか vs 窓が開いていますか — the first asks 'are you opening it?', the second asks 'is it open?'. Huge difference in real conversation." },
  },
  {
    id: "tricky",
    title: "Verbs that break the rules",
    rule: "Some verbs look transitive but aren't — and vice versa. Memorise these.",
    color: "bg-gradient-to-r from-red-500 to-orange-500",
    bullets: [
      "分かる (to understand) is intransitive — takes が, never を. 日本語が分かる NOT 日本語を分かる",
      "要る (to need) is intransitive — takes が. お金が要る NOT お金を要る",
      "できる (to be able to / be done) is intransitive — takes が. 日本語ができる",
      "歩く, 渡る, 出る, 登る, 曲がる use を for PATH traversal — not as a direct object. This を means 'through/along', not 'acting on'",
      "降りる (to get off) takes を — treated as transitive in this dataset",
    ],
    examples: [
      { jp: "日本語が分かります。", kana: "にほんごがわかります。", en: "I understand Japanese.", note: "が, not を — 分かる is intransitive" },
      { jp: "お金が要ります。", kana: "おかねがいります。", en: "Money is needed.", note: "が, not を — 要る is intransitive" },
      { jp: "橋を渡る。", kana: "はしをわたる。", en: "Cross the bridge.", note: "を = PATH, not object — 渡る is intransitive" },
      { jp: "坂を登る。", kana: "さかをのぼる。", en: "Climb the slope.", note: "を = PATH — 登る is intransitive" },
    ],
    callout: { type: "warn", text: "The 'path を' (道を歩く, 橋を渡る) is a permanent exception. Never confuse it with an object を. Hint: you cannot do something TO a road or bridge." },
  },
  {
    id: "noobj",
    title: "Verbs with no pair — transitives you can't make intransitive",
    rule: "Most transitive N5 verbs (食べる, 飲む, 読む, 書く…) have no intransitive counterpart.",
    color: "bg-gradient-to-r from-green-500 to-teal-500",
    bullets: [
      "食べる (to eat), 飲む (to drink), 読む (to read), 書く (to write) — always transitive, always take を",
      "There is no Japanese verb meaning 'the food eats' or 'the book reads' — no intransitive pair exists",
      "Similarly, 行く, 来る, 帰る, 泳ぐ are always intransitive — they never take を as a direct object",
      "These are the 'safe' verbs — no ambiguity, no pair to mix up",
    ],
    examples: [
      { jp: "ご飯を食べる。", kana: "ごはんをたべる。", en: "Eat rice.", note: "食べる always T" },
      { jp: "水を飲む。", kana: "みずをのむ。", en: "Drink water.", note: "飲む always T" },
      { jp: "毎朝、学校に来る。", kana: "まいあさ、がっこうにくる。", en: "Come to school every morning.", note: "来る always I" },
      { jp: "家に帰る。", kana: "いえにかえる。", en: "Return home.", note: "帰る always I" },
    ],
    callout: { type: "tip", text: "If you see 食べる, 飲む, 読む, 書く, 見る, 聞く, 話す — stop worrying. They're always transitive, always take を. Lock them in and move on." },
  },
]

// ─── Lesson walkthrough component ─────────────────────────────────────────────

function LessonWalkthrough({ showKana, verbs }: { showKana: boolean; verbs: N5Verb[] }) {
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(false)
  const [seen, setSeen] = useState<Set<string>>(new Set())

  const step = lessons[idx]
  const progress = ((idx + (done ? 1 : 0)) / lessons.length) * 100

  const next = () => {
    setSeen(prev => new Set([...prev, step.id]))
    if (idx < lessons.length - 1) setIdx(idx + 1)
    else setDone(true)
  }

  const prev = () => {
    if (done) { setDone(false); return }
    if (idx > 0) setIdx(idx - 1)
  }

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold">All 6 lessons complete!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You now understand the core T/I distinction, the を signal, verb pairs, the て+いる trap, and the tricky exceptions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button onClick={() => window.location.href = "/verbs?list=transitive"} className="gap-2">
                <Play className="h-4 w-4" />
                Practice Transitive Verbs
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/verbs?list=intransitive"} className="gap-2">
                <Play className="h-4 w-4" />
                Practice Intransitive Verbs
              </Button>
            </div>
            <Button variant="ghost" onClick={() => { setDone(false); setIdx(0); setSeen(new Set()) }}>
              Start over
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Lesson {idx + 1} of {lessons.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Lesson mini-nav */}
      <div className="flex gap-1.5 flex-wrap">
        {lessons.map((l, i) => (
          <button
            key={l.id}
            onClick={() => { setSeen(prev => new Set([...prev, step.id])); setIdx(i) }}
            className={`w-7 h-7 rounded-full text-xs font-bold border-2 transition-all ${
              i === idx
                ? "border-primary bg-primary text-primary-foreground"
                : seen.has(l.id)
                ? "border-green-500 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                : "border-muted-foreground/30 bg-muted text-muted-foreground"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.22 }}
        >
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-2">
                {seen.has(step.id) && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />}
                <CardTitle className="text-lg leading-snug">{step.title}</CardTitle>
              </div>
              <div className={`inline-flex px-4 py-2 rounded-lg ${step.color} text-white font-semibold text-sm mt-2`}>
                {step.rule}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Bullets */}
              <ul className="space-y-2">
                {step.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Examples */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Examples</p>
                {step.examples.map((ex, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 border space-y-1">
                    <p className="font-medium text-sm">{showKana ? ex.kana : ex.jp}</p>
                    <p className="text-xs text-muted-foreground">{ex.en}</p>
                    {ex.note && (
                      <Badge variant="secondary" className="text-xs">{ex.note}</Badge>
                    )}
                  </div>
                ))}
              </div>

              {/* Callout */}
              {step.callout && (
                <div className={`flex gap-2 p-3 rounded-lg text-sm ${
                  step.callout.type === "tip"
                    ? "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
                    : "bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800"
                }`}>
                  {step.callout.type === "tip"
                    ? <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    : <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />}
                  <p className={step.callout.type === "tip" ? "text-blue-800 dark:text-blue-200" : "text-orange-800 dark:text-orange-200"}>
                    {step.callout.text}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={prev} disabled={idx === 0} className="flex-1">
          Previous
        </Button>
        <Button onClick={next} className="flex-1 gap-2">
          {idx === lessons.length - 1 ? "Finish" : "Next"}
          {idx < lessons.length - 1 && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

// ─── Reference tab ────────────────────────────────────────────────────────────

function ReferenceTab({ verbs, showKana }: { verbs: N5Verb[]; showKana: boolean }) {
  const [filter, setFilter] = useState<"all" | "transitive" | "intransitive">("all")
  const [particleFilter, setParticleFilter] = useState<string>("all")

  const transitiveVerbs = verbs.filter(v => v.valency.type === "transitive")
  const intransitiveVerbs = verbs.filter(v => v.valency.type === "intransitive")
  const specialVerbs = verbs.filter(v => !["transitive", "intransitive"].includes(v.valency.type))

  const displayed = filter === "transitive" ? transitiveVerbs
    : filter === "intransitive" ? intransitiveVerbs
    : [...transitiveVerbs, ...intransitiveVerbs, ...specialVerbs]

  const filtered = particleFilter === "all" ? displayed
    : displayed.filter(v => v.valency.requiredParticles.includes(particleFilter))

  const allParticles = Array.from(new Set(
    displayed.flatMap(v => v.valency.requiredParticles)
  )).sort()

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{transitiveVerbs.length}</p>
            <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">Transitive</p>
            <p className="text-[10px] text-muted-foreground">他動詞</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{intransitiveVerbs.length}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Intransitive</p>
            <p className="text-[10px] text-muted-foreground">自動詞</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{specialVerbs.length}</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Special</p>
            <p className="text-[10px] text-muted-foreground">ditransitive etc.</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {(["all", "transitive", "intransitive"] as const).map(f => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => { setFilter(f); setParticleFilter("all") }}
            className="rounded-full"
          >
            {f === "all" ? "All verbs" : f === "transitive" ? "Transitive 他動詞" : "Intransitive 自動詞"}
          </Button>
        ))}
      </div>

      {/* Particle filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground">Particle:</span>
        <button
          onClick={() => setParticleFilter("all")}
          className={`px-2 py-0.5 rounded text-xs font-bold border transition-all ${particleFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground/30 hover:border-primary/50"}`}
        >
          all
        </button>
        {allParticles.map(p => (
          <button
            key={p}
            onClick={() => setParticleFilter(p === particleFilter ? "all" : p)}
            className={`px-2 py-0.5 rounded text-xs font-bold border transition-all ${particleFilter === p ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground/30 hover:border-primary/50"}`}
          >
            {p}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} verbs</p>

      {/* Verb list */}
      <div className="space-y-1.5">
        {filtered.map(verb => {
          const isT = verb.valency.type === "transitive"
          const isI = verb.valency.type === "intransitive"
          return (
            <div
              key={verb.id}
              className={`flex items-center gap-3 p-2.5 rounded-lg border text-sm ${
                isT
                  ? "border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/10"
                  : isI
                  ? "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/10"
                  : "border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/10"
              }`}
            >
              <div className="shrink-0">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isT ? "bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200"
                    : isI ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                    : "bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200"
                }`}>
                  {isT ? "T" : isI ? "I" : "S"}
                </span>
              </div>
              <div className="font-medium w-20 shrink-0">
                {showKana ? verb.lemma.kana : verb.lemma.kanji}
              </div>
              <div className="text-muted-foreground flex-1 truncate text-xs">{verb.meaning.primary}</div>
              <div className="flex gap-1 shrink-0">
                {verb.valency.requiredParticles.length > 0
                  ? verb.valency.requiredParticles.map(p => <ParticleBadge key={p} p={p} />)
                  : <span className="text-[10px] text-muted-foreground">—</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pairs highlight */}
      <Card className="border-2 border-purple-300 dark:border-purple-700 mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-500" />
            T/I Verb Pairs in N5
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Only two clean T/I pairs exist in the N5 dataset. Both verbs appear — learn them together.
          </p>
          <div className="space-y-3">
            {[
              {
                t: { kanji: "出す", kana: "だす", meaning: "to take out / send", particle: "を" },
                i: { kanji: "出る", kana: "でる", meaning: "to come out / leave", particle: "を (path)" },
                note: "出す acts on an object (出す書類 = take out the document). 出る is movement (部屋を出る = leave the room)."
              },
              {
                t: { kanji: "入れる", kana: "いれる", meaning: "to put in / insert", particle: "を" },
                i: { kanji: "入る", kana: "はいる", meaning: "to enter / go in", particle: "に" },
                note: "入れる acts on the thing being inserted. 入る is movement — you enter somewhere."
              },
            ].map((pair, i) => (
              <div key={i} className="rounded-lg border p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 rounded bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-1 rounded">T</span>
                      <span className="font-bold">{showKana ? pair.t.kana : pair.t.kanji}</span>
                      <ParticleBadge p={pair.t.particle.split(" ")[0]} />
                    </div>
                    <p className="text-xs text-muted-foreground">{pair.t.meaning}</p>
                  </div>
                  <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-1 rounded">I</span>
                      <span className="font-bold">{showKana ? pair.i.kana : pair.i.kanji}</span>
                      <ParticleBadge p={pair.i.particle.split(" ")[0]} />
                    </div>
                    <p className="text-xs text-muted-foreground">{pair.i.meaning}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground border-t pt-2">{pair.note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Quick test tab ───────────────────────────────────────────────────────────

interface QuizQuestion {
  verb: N5Verb
  sentence: string
  sentenceKana: string
  english: string
  blankParticle: string
  options: string[]
  explanation: string
}

const quizQuestions: QuizQuestion[] = [
  {
    verb: { id: "", lemma: { kanji: "食べる", kana: "たべる" }, morphology: { class: "ichidan", isIrregular: false }, valency: { type: "transitive", requiredParticles: ["を"] }, meaning: { primary: "to eat", gloss: [] }, forms: { dictionary: { kanji: "", kana: "" }, masu: { kanji: "", kana: "" }, te: { kanji: "", kana: "" } } },
    sentence: "毎朝、パン＿食べる。", sentenceKana: "まいあさ、パン＿たべる。",
    english: "I eat bread every morning.",
    blankParticle: "を", options: ["を", "が", "に", "で"],
    explanation: "食べる is transitive — it acts on the bread. を marks the direct object."
  },
  {
    verb: { id: "", lemma: { kanji: "分かる", kana: "わかる" }, morphology: { class: "godan", isIrregular: false }, valency: { type: "intransitive", requiredParticles: ["が"] }, meaning: { primary: "to understand", gloss: [] }, forms: { dictionary: { kanji: "", kana: "" }, masu: { kanji: "", kana: "" }, te: { kanji: "", kana: "" } } },
    sentence: "日本語＿分かりますか。", sentenceKana: "にほんご＿わかりますか。",
    english: "Do you understand Japanese?",
    blankParticle: "が", options: ["を", "が", "に", "で"],
    explanation: "分かる is intransitive — understanding happens, nothing is being acted on. が, not を."
  },
  {
    verb: { id: "", lemma: { kanji: "会う", kana: "あう" }, morphology: { class: "godan", isIrregular: false }, valency: { type: "intransitive", requiredParticles: ["に"] }, meaning: { primary: "to meet", gloss: [] }, forms: { dictionary: { kanji: "", kana: "" }, masu: { kanji: "", kana: "" }, te: { kanji: "", kana: "" } } },
    sentence: "友達＿会う。", sentenceKana: "ともだち＿あう。",
    english: "Meet a friend.",
    blankParticle: "に", options: ["を", "が", "に", "で"],
    explanation: "会う is intransitive — you meet someone (に), you don't act on them. Never を."
  },
  {
    verb: { id: "", lemma: { kanji: "渡る", kana: "わたる" }, morphology: { class: "godan", isIrregular: false }, valency: { type: "intransitive", requiredParticles: ["を"] }, meaning: { primary: "to cross", gloss: [] }, forms: { dictionary: { kanji: "", kana: "" }, masu: { kanji: "", kana: "" }, te: { kanji: "", kana: "" } } },
    sentence: "橋＿渡る。", sentenceKana: "はし＿わたる。",
    english: "Cross the bridge.",
    blankParticle: "を", options: ["を", "が", "に", "で"],
    explanation: "渡る is intransitive but uses を for the path traversed — not a direct object. You're moving through/over the bridge."
  },
  {
    verb: { id: "", lemma: { kanji: "住む", kana: "すむ" }, morphology: { class: "godan", isIrregular: false }, valency: { type: "intransitive", requiredParticles: ["に"] }, meaning: { primary: "to live; reside", gloss: [] }, forms: { dictionary: { kanji: "", kana: "" }, masu: { kanji: "", kana: "" }, te: { kanji: "", kana: "" } } },
    sentence: "東京＿住んでいます。", sentenceKana: "とうきょう＿すんでいます。",
    english: "I live in Tokyo.",
    blankParticle: "に", options: ["を", "が", "に", "で"],
    explanation: "住む is intransitive. You live at a location (に), you don't act on it."
  },
  {
    verb: { id: "", lemma: { kanji: "開ける", kana: "あける" }, morphology: { class: "ichidan", isIrregular: false }, valency: { type: "transitive", requiredParticles: ["を"] }, meaning: { primary: "to open", gloss: [] }, forms: { dictionary: { kanji: "", kana: "" }, masu: { kanji: "", kana: "" }, te: { kanji: "", kana: "" } } },
    sentence: "窓＿開けてください。", sentenceKana: "まど＿あけてください。",
    english: "Please open the window.",
    blankParticle: "を", options: ["を", "が", "に", "で"],
    explanation: "開ける is transitive — someone is actively opening the window. を marks the window as the object being acted on."
  },
  {
    verb: { id: "", lemma: { kanji: "できる", kana: "できる" }, morphology: { class: "ichidan", isIrregular: false }, valency: { type: "intransitive", requiredParticles: ["が"] }, meaning: { primary: "to be able to", gloss: [] }, forms: { dictionary: { kanji: "", kana: "" }, masu: { kanji: "", kana: "" }, te: { kanji: "", kana: "" } } },
    sentence: "日本語＿できます。", sentenceKana: "にほんご＿できます。",
    english: "I can speak Japanese.",
    blankParticle: "が", options: ["を", "が", "に", "で"],
    explanation: "できる is intransitive — ability exists, not an action on an object. が marks the skill."
  },
  {
    verb: { id: "", lemma: { kanji: "乗る", kana: "のる" }, morphology: { class: "godan", isIrregular: false }, valency: { type: "intransitive", requiredParticles: ["に"] }, meaning: { primary: "to ride", gloss: [] }, forms: { dictionary: { kanji: "", kana: "" }, masu: { kanji: "", kana: "" }, te: { kanji: "", kana: "" } } },
    sentence: "電車＿乗る。", sentenceKana: "でんしゃ＿のる。",
    english: "Ride the train.",
    blankParticle: "に", options: ["を", "が", "に", "で"],
    explanation: "乗る is intransitive — you board something (に). You're not acting on the train."
  },
]

function QuizTab({ showKana }: { showKana: boolean }) {
  const [qIdx, setQIdx] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [finished, setFinished] = useState(false)

  const q = quizQuestions[qIdx]
  const isCorrect = chosen === q.blankParticle

  const handleChoice = (p: string) => {
    if (chosen) return
    setChosen(p)
    setScore(prev => ({ correct: prev.correct + (p === q.blankParticle ? 1 : 0), total: prev.total + 1 }))
  }

  const next = () => {
    if (qIdx < quizQuestions.length - 1) {
      setQIdx(qIdx + 1)
      setChosen(null)
    } else {
      setFinished(true)
    }
  }

  const restart = () => {
    setQIdx(0)
    setChosen(null)
    setScore({ correct: 0, total: 0 })
    setFinished(false)
  }

  if (finished) {
    const pct = Math.round((score.correct / score.total) * 100)
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-2 border-primary text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="text-5xl font-bold">{pct}%</div>
            <p className="text-xl font-semibold">{score.correct} / {score.total} correct</p>
            <p className="text-muted-foreground">
              {pct >= 90 ? "Excellent! You've got the particle logic down." :
               pct >= 70 ? "Good work — review the tricky cases (分かる, 渡る, できる)." :
               "Keep going — the lessons tab will help reinforce these patterns."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={restart}>Try again</Button>
              <Button variant="outline" onClick={() => window.location.href = "/verbs?list=transitive"}>Practice verbs</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Score + progress */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Question {qIdx + 1} / {quizQuestions.length}</span>
        <span>{score.correct} correct</span>
      </div>
      <Progress value={((qIdx + (chosen ? 1 : 0)) / quizQuestions.length) * 100} className="h-2" />

      <AnimatePresence mode="wait">
        <motion.div key={qIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
          <Card className="border-2">
            <CardContent className="pt-6 space-y-5">
              {/* Sentence */}
              <div className="text-center space-y-2">
                <p className="text-lg sm:text-2xl font-medium tracking-wide leading-relaxed">
                  {(showKana ? q.sentenceKana : q.sentence).replace("＿", " ＿ ")}
                </p>
                <p className="text-sm text-muted-foreground">{q.english}</p>
                <p className="text-xs text-muted-foreground font-medium">
                  Verb: <span className="text-foreground font-bold">{showKana ? q.verb.lemma.kana : q.verb.lemma.kanji}</span> — {q.verb.meaning.primary}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {q.options.map(opt => {
                  const isRight = opt === q.blankParticle
                  const isWrong = chosen === opt && !isRight
                  return (
                    <button
                      key={opt}
                      onClick={() => handleChoice(opt)}
                      disabled={!!chosen}
                      className={`py-4 rounded-xl border-2 text-2xl font-bold font-mono transition-all ${
                        !chosen
                          ? "border-muted-foreground/30 hover:border-primary hover:bg-primary/5"
                          : isRight
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300"
                          : isWrong
                          ? "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                          : "border-muted-foreground/20 opacity-50"
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>

              {/* Explanation */}
              {chosen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={`p-3 rounded-lg border text-sm flex gap-2 ${
                    isCorrect
                      ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700"
                      : "bg-orange-50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-700"
                  }`}>
                    {isCorrect
                      ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      : <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />}
                    <p>{q.explanation}</p>
                  </div>
                  <Button onClick={next} className="w-full mt-3 gap-2">
                    {qIdx < quizQuestions.length - 1 ? "Next question" : "See results"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TransitiveIntransitivePage() {
  const router = useRouter()
  const [verbs, setVerbs] = useState<N5Verb[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showKana, setShowKana] = useState(false)

  useEffect(() => {
    fetch("/seed-data/N5_verbs_dataset.json")
      .then(r => r.json())
      .then(data => { setVerbs(data.verbs || []); setIsLoading(false) })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading…</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6 max-w-3xl">

        {/* Back */}
        <Button variant="ghost" onClick={() => router.push("/verbs")} className="pl-0">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <Badge variant="gradient" className="px-4 py-1.5">
            <BookOpen className="h-3 w-3 mr-2" />
            Grammar Deep Dive
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold">
            Transitive &{" "}
            <span className="gradient-text">Intransitive</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            他動詞 (tadōshi) vs 自動詞 (jidōshi) — the particle difference that changes the meaning of every sentence.
          </p>

          {/* Quick reference strip */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 pt-2">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
              <span className="text-xs font-bold text-orange-700 dark:text-orange-300">T 他動詞</span>
              <ParticleBadge p="を" />
              <span className="text-xs text-muted-foreground">acts on object</span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300">I 自動詞</span>
              <ParticleBadge p="が" />
              <span className="text-xs text-muted-foreground">just happens</span>
            </div>
          </div>
        </motion.div>

        {/* Kana toggle */}
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm ${!showKana ? "font-semibold text-primary" : "text-muted-foreground"}`}>Kanji</span>
          <Switch checked={showKana} onCheckedChange={setShowKana} />
          <span className={`text-sm ${showKana ? "font-semibold text-primary" : "text-muted-foreground"}`}>Kana</span>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="lessons" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="reference">N5 Verbs</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="lessons">
            <LessonWalkthrough showKana={showKana} verbs={verbs} />
          </TabsContent>

          <TabsContent value="reference">
            <ReferenceTab verbs={verbs} showKana={showKana} />
          </TabsContent>

          <TabsContent value="quiz">
            <QuizTab showKana={showKana} />
          </TabsContent>
        </Tabs>

      </main>
    </div>
  )
}
