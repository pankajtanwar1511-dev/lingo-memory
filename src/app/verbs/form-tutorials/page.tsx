"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, ArrowLeft, BookOpen, Lightbulb, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// ─── Shared types ────────────────────────────────────────────────────────────

interface FormRule {
  id: string
  title: string
  pattern: string
  rule: string
  description: string[]
  examples: string[]
  examplesKana: string[]
  color: string
}

// ─── Dictionary Form data ─────────────────────────────────────────────────────

interface DictVerb {
  id: string
  kanji: string
  kana: string
  conjugations: { dictionary: string; dictionaryKana: string; masu: string; masuKana: string }
  verbGroup: string
  primaryMeaning: string
}

const dictRules: FormRule[] = [
  { id: "ichidan", title: "Group II — Ichidan Verbs (る-verbs)", pattern: "Vowel + ます → る", rule: "Remove ます, add る",
    description: ["Stems ending in -e or -i sounds", "Simple and consistent — just replace ます with る", "Works 99% of the time for ichidan verbs"],
    examples: ["食べます → 食べる", "見ます → 見る", "起きます → 起きる"],
    examplesKana: ["たべます → たべる", "みます → みる", "おきます → おきる"],
    color: "bg-gradient-to-r from-green-500 to-teal-500" },
  { id: "imasu", title: "Group I — Godan: います → う", pattern: "います → う", rule: "Replace います with う",
    description: ["Verbs with masu-stem ending in い", "Change い to う", "Remember: い-row becomes う-row"],
    examples: ["会います → 会う", "買います → 買う", "言います → 言う"],
    examplesKana: ["あいます → あう", "かいます → かう", "いいます → いう"],
    color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
  { id: "kimasu", title: "Group I — Godan: きます → く", pattern: "きます → く", rule: "Replace きます with く",
    description: ["Verbs with masu-stem ending in き", "Change き to く", "Common pattern: writing, listening, walking"],
    examples: ["書きます → 書く", "聞きます → 聞く", "歩きます → 歩く"],
    examplesKana: ["かきます → かく", "ききます → きく", "あるきます → あるく"],
    color: "bg-gradient-to-r from-yellow-500 to-orange-500" },
  { id: "gimasu", title: "Group I — Godan: ぎます → ぐ", pattern: "ぎます → ぐ", rule: "Replace ぎます with ぐ",
    description: ["Verbs with masu-stem ending in ぎ", "Change ぎ to ぐ (voiced version)", "Rare in N5"],
    examples: ["泳ぎます → 泳ぐ", "急ぎます → 急ぐ"],
    examplesKana: ["およぎます → およぐ", "いそぎます → いそぐ"],
    color: "bg-gradient-to-r from-indigo-500 to-purple-500" },
  { id: "shimasu", title: "Group I — Godan: します → す", pattern: "します → す", rule: "Replace します with す",
    description: ["Verbs with masu-stem ending in し", "Change し to す", "Note: する (irregular) also ends in します"],
    examples: ["話します → 話す", "貸します → 貸す", "押します → 押す"],
    examplesKana: ["はなします → はなす", "かします → かす", "おします → おす"],
    color: "bg-gradient-to-r from-red-500 to-pink-500" },
  { id: "chimasu", title: "Group I — Godan: ちます → つ", pattern: "ちます → つ", rule: "Replace ちます with つ",
    description: ["Verbs with masu-stem ending in ち", "Change ち to つ", "Common: waiting, standing verbs"],
    examples: ["待ちます → 待つ", "立ちます → 立つ", "持ちます → 持つ"],
    examplesKana: ["まちます → まつ", "たちます → たつ", "もちます → もつ"],
    color: "bg-gradient-to-r from-orange-500 to-red-500" },
  { id: "nimasu", title: "Group I — Godan: にます → ぬ", pattern: "にます → ぬ", rule: "Replace にます with ぬ",
    description: ["Verbs with masu-stem ending in に", "Change に to ぬ", "Rare — main example: 死ぬ (to die)"],
    examples: ["死にます → 死ぬ"],
    examplesKana: ["しにます → しぬ"],
    color: "bg-gradient-to-r from-gray-500 to-slate-500" },
  { id: "bimasu", title: "Group I — Godan: びます → ぶ", pattern: "びます → ぶ", rule: "Replace びます with ぶ",
    description: ["Verbs with masu-stem ending in び", "Change び to ぶ", "Common: playing, calling verbs"],
    examples: ["遊びます → 遊ぶ", "呼びます → 呼ぶ", "飛びます → 飛ぶ"],
    examplesKana: ["あそびます → あそぶ", "よびます → よぶ", "とびます → とぶ"],
    color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  { id: "mimasu", title: "Group I — Godan: みます → む", pattern: "みます → む", rule: "Replace みます with む",
    description: ["Verbs with masu-stem ending in み", "Change み to む", "Common: drinking, reading verbs"],
    examples: ["飲みます → 飲む", "読みます → 読む", "住みます → 住む"],
    examplesKana: ["のみます → のむ", "よみます → よむ", "すみます → すむ"],
    color: "bg-gradient-to-r from-teal-500 to-green-500" },
  { id: "rimasu", title: "Group I — Godan: ります → る", pattern: "ります → る", rule: "Replace ります with る",
    description: ["Verbs with masu-stem ending in り", "Change り to る", "Looks like ichidan but it's godan!"],
    examples: ["帰ります → 帰る", "乗ります → 乗る", "分かります → 分かる"],
    examplesKana: ["かえります → かえる", "のります → のる", "わかります → わかる"],
    color: "bg-gradient-to-r from-cyan-500 to-blue-500" },
]

const dictException: FormRule = {
  id: "exceptions", title: "⚠️ Group III — Irregular Verbs — Memorize!", pattern: "Special Cases", rule: "Must be memorized",
  description: ["する and 来る are the only truly irregular verbs", "22 compound する verbs + 2 compound 来る verbs = 25 total"],
  examples: ["します → する", "来ます → 来る", "勉強します → 勉強する", "持って来ます → 持って来る"],
  examplesKana: ["します → する", "きます → くる", "べんきょうします → べんきょうする", "もってきます → もってくる"],
  color: "bg-gradient-to-r from-red-600 to-orange-600"
}

// ─── Te-form data ─────────────────────────────────────────────────────────────

interface TeVerb {
  id: string
  lemma: { kanji: string; kana: string }
  forms: { masu: { kanji: string; kana: string }; te: { kanji: string; kana: string } }
  morphology: { class: string; isIrregular: boolean }
  meaning: { primary: string; gloss: string[] }
}

const teRules: FormRule[] = [
  { id: "ichidan", title: "Group II — Ichidan Verbs (る-verbs)", pattern: "Vowel + ます → て", rule: "Remove ます, add て",
    description: ["Stems ending in -e or -i sounds", "Simple and consistent — just replace ます with て", "Works 99% of the time"],
    examples: ["食べます → 食べて", "見ます → 見て", "起きます → 起きて"],
    examplesKana: ["たべます → たべて", "みます → みて", "おきます → おきて"],
    color: "bg-gradient-to-r from-green-500 to-teal-500" },
  { id: "itte", title: "Group I — Godan: い・ち・り + ます → って", pattern: "い/ち/り + ます → って", rule: "Replace い/ち/り with って",
    description: ["Verbs ending in -imasu, -chimasu, -rimasu", "All convert to って", "Most common godan pattern"],
    examples: ["会います → 会って", "待ちます → 待って", "帰ります → 帰って"],
    examplesKana: ["あいます → あって", "まちます → まって", "かえります → かえって"],
    color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
  { id: "nde", title: "Group I — Godan: み・び・に + ます → んで", pattern: "み/び/に + ます → んで", rule: "Replace み/び/に with んで",
    description: ["Verbs ending in -mimasu, -bimasu, -nimasu", "All convert to んで (with 'n' sound)"],
    examples: ["飲みます → 飲んで", "遊びます → 遊んで", "死にます → 死んで"],
    examplesKana: ["のみます → のんで", "あそびます → あそんで", "しにます → しんで"],
    color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  { id: "ite", title: "Group I — Godan: き + ます → いて", pattern: "き + ます → いて", rule: "Replace き with いて",
    description: ["Verbs ending in -kimasu", "Convert to いて", "Watch out for 行く exception!"],
    examples: ["書きます → 書いて", "歩きます → 歩いて", "聞きます → 聞いて"],
    examplesKana: ["かきます → かいて", "あるきます → あるいて", "ききます → きいて"],
    color: "bg-gradient-to-r from-yellow-500 to-orange-500" },
  { id: "ide", title: "Group I — Godan: ぎ + ます → いで", pattern: "ぎ + ます → いで", rule: "Replace ぎ with いで",
    description: ["Verbs ending in -gimasu", "Convert to いで (voiced version of いて)", "Rare in N5"],
    examples: ["泳ぎます → 泳いで", "急ぎます → 急いで"],
    examplesKana: ["およぎます → およいで", "いそぎます → いそいで"],
    color: "bg-gradient-to-r from-indigo-500 to-purple-500" },
  { id: "shite", title: "Group I — Godan: し + ます → して", pattern: "し + ます → して", rule: "Replace し with して",
    description: ["Verbs ending in -shimasu", "Includes all する verbs (irregular but same pattern)"],
    examples: ["話します → 話して", "貸します → 貸して", "します → して", "勉強します → 勉強して"],
    examplesKana: ["はなします → はなして", "かします → かして", "します → して", "べんきょうします → べんきょうして"],
    color: "bg-gradient-to-r from-red-500 to-pink-500" },
]

const teException: FormRule = {
  id: "exceptions", title: "⚠️ Exceptions — Memorize!", pattern: "Special Cases", rule: "Must be memorized",
  description: ["行く is the ONLY き→いて exception (follows って instead)", "Group III — Irregular verbs: する, 来る (25 total with compounds)"],
  examples: ["行きます → 行って (NOT 行いて!)", "します → して", "来ます → 来て"],
  examplesKana: ["いきます → いって (NOT いいて!)", "します → して", "きます → きて"],
  color: "bg-gradient-to-r from-red-600 to-orange-600"
}

// ─── Shared RuleWalkthrough component ────────────────────────────────────────

function RuleWalkthrough({
  rules,
  exception,
  formLabel,
  verbCount,
  showKana,
}: {
  rules: FormRule[]
  exception: FormRule
  formLabel: "Dictionary" | "Te"
  verbCount: (ruleId: string) => number
  showKana: boolean
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showException, setShowException] = useState(false)
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const current = showException ? exception : rules[currentIndex]
  const progress = ((currentIndex + (showException ? 1 : 0)) / (rules.length + 1)) * 100

  const next = () => {
    setCompleted(prev => new Set([...prev, current.id]))
    if (currentIndex < rules.length - 1) setCurrentIndex(currentIndex + 1)
    else setShowException(true)
  }

  const prev = () => {
    if (showException) setShowException(false)
    else if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Rule {currentIndex + (showException ? rules.length + 1 : currentIndex + 1 > rules.length ? rules.length : currentIndex + 1)} of {rules.length + 1}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Rule card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                {completed.has(current.id) && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />}
                {current.id === "exceptions" && <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />}
                <CardTitle className="text-xl">{current.title}</CardTitle>
              </div>
              <div className={`inline-flex px-4 py-2 rounded-lg ${current.color} text-white font-mono font-bold text-base mt-2`}>
                {current.pattern}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Rule: {current.rule}
                </div>
                <ul className="space-y-1 pl-5">
                  {current.description.map((d, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary mt-0.5">•</span>{d}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid sm:grid-cols-2 gap-2">
                {(showKana ? current.examplesKana : current.examples).map((ex, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 border text-sm font-medium text-center">{ex}</div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-lg">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{verbCount(current.id)} N5 verbs follow this pattern</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={prev} disabled={currentIndex === 0 && !showException} className="flex-1">
          Previous
        </Button>
        <Button onClick={next} disabled={showException} className="flex-1 gap-2">
          {showException ? "Done!" : "Next"}
          {!showException && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Completion */}
      {showException && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
            <CardContent className="pt-6 text-center space-y-3">
              <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
              <h3 className="text-xl font-bold">All {formLabel} Form rules complete!</h3>
              <p className="text-sm text-muted-foreground">
                Practice these patterns to master {formLabel.toLowerCase()} form conjugation for all N5 verbs.
              </p>
              <Button onClick={() => window.location.href = "/verbs"}>Practice with Flip Cards</Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FormTutorialsPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") === "te" ? "te" : "dictionary"
  const router = useRouter()

  const [dictVerbs, setDictVerbs] = useState<DictVerb[]>([])
  const [teVerbs, setTeVerbs] = useState<TeVerb[]>([])
  const [showKana, setShowKana] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/seed-data/N5_verbs_dataset.json")
      .then(r => r.json())
      .then(data => {
        setDictVerbs(data.verbs || [])
        setTeVerbs(data.verbs || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const categorizeDictVerb = (verb: DictVerb): string => {
    if (verb.verbGroup === "irregular") return "exceptions"
    if (verb.verbGroup === "ichidan") return "ichidan"
    const k = verb.conjugations.masuKana
    if (k.endsWith("います")) return "imasu"
    if (k.endsWith("きます")) return "kimasu"
    if (k.endsWith("ぎます")) return "gimasu"
    if (k.endsWith("します")) return "shimasu"
    if (k.endsWith("ちます")) return "chimasu"
    if (k.endsWith("にます")) return "nimasu"
    if (k.endsWith("びます")) return "bimasu"
    if (k.endsWith("みます")) return "mimasu"
    if (k.endsWith("ります")) return "rimasu"
    return "other"
  }

  const categorizeTeVerb = (verb: TeVerb): string => {
    if (verb.lemma?.kanji === "行く") return "exceptions"
    if (verb.lemma?.kanji === "来る" || verb.lemma?.kanji?.includes("来る")) return "exceptions"
    if (verb.lemma?.kanji === "する" || verb.lemma?.kanji?.endsWith("する")) return "shite"
    if (verb.morphology?.class === "ichidan") return "ichidan"
    const k = verb.forms?.masu?.kana || ""
    if (k.endsWith("います") || k.endsWith("ちます") || k.endsWith("ります")) return "itte"
    if (k.endsWith("みます") || k.endsWith("びます") || k.endsWith("にます")) return "nde"
    if (k.endsWith("きます")) return "ite"
    if (k.endsWith("ぎます")) return "ide"
    if (k.endsWith("します")) return "shite"
    return "other"
  }

  const dictVerbCount = (ruleId: string) => dictVerbs.filter(v => categorizeDictVerb(v) === ruleId).length
  const teVerbCount = (ruleId: string) => teVerbs.filter(v => categorizeTeVerb(v) === ruleId).length

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading tutorials…</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6 max-w-3xl">

        {/* Back button */}
        <div>
          <Button variant="ghost" onClick={() => router.push('/verbs')} className="pl-0">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Button>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <Badge variant="gradient" className="px-4 py-1.5">
            <Lightbulb className="h-3 w-3 mr-2" />
            Step-by-Step Conjugation Tutorials
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold">
            Form <span className="gradient-text">Tutorials</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Learn how to convert masu-form to dictionary or te-form, rule by rule, with real N5 verb examples.
          </p>
        </motion.div>

        {/* Kanji/Kana toggle */}
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm ${!showKana ? "font-semibold text-primary" : "text-muted-foreground"}`}>Kanji</span>
          <Switch id="kana" checked={showKana} onCheckedChange={setShowKana} />
          <span className={`text-sm ${showKana ? "font-semibold text-primary" : "text-muted-foreground"}`}>Kana</span>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={initialTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dictionary">Dictionary Form</TabsTrigger>
            <TabsTrigger value="te">Te Form</TabsTrigger>
          </TabsList>

          <TabsContent value="dictionary">
            <div className="mb-4 p-3 rounded-lg bg-muted/40 text-sm text-center text-muted-foreground">
              Masu form → Dictionary form (casual/plain) — 10 patterns + exceptions
            </div>
            <RuleWalkthrough
              rules={dictRules}
              exception={dictException}
              formLabel="Dictionary"
              verbCount={dictVerbCount}
              showKana={showKana}
            />
          </TabsContent>

          <TabsContent value="te">
            <div className="mb-4 p-3 rounded-lg bg-muted/40 text-sm text-center text-muted-foreground">
              Masu form → Te form (connecting/requesting) — 6 patterns + exceptions
            </div>
            <RuleWalkthrough
              rules={teRules}
              exception={teException}
              formLabel="Te"
              verbCount={teVerbCount}
              showKana={showKana}
            />
          </TabsContent>
        </Tabs>

      </main>
    </div>
  )
}
