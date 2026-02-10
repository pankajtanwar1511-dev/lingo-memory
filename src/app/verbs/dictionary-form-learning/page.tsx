"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowRight, BookOpen, Lightbulb, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface N5Verb {
  id: string
  kanji: string
  kana: string
  conjugations: {
    dictionary: string
    dictionaryKana: string
    masu: string
    masuKana: string
  }
  verbGroup: string
  primaryMeaning: string
}

interface DictionaryFormRule {
  id: string
  title: string
  pattern: string
  rule: string
  description: string[]
  examples: string[]
  examplesKana: string[]
  color: string
}

const dictionaryFormRules: DictionaryFormRule[] = [
  {
    id: "ichidan",
    title: "Ichidan Verbs (る-verbs)",
    pattern: "Vowel + ます → る",
    rule: "Remove ます, add る",
    description: [
      "These verbs have stems ending in -e or -i sounds",
      "The conversion is simple and consistent",
      "Just replace ます with る",
      "Works 99% of the time for ichidan verbs"
    ],
    examples: ["食べます → 食べる", "見ます → 見る", "起きます → 起きる"],
    examplesKana: ["たべます → たべる", "みます → みる", "おきます → おきる"],
    color: "bg-gradient-to-r from-green-500 to-teal-500"
  },
  {
    id: "imasu",
    title: "Godan: います → う",
    pattern: "います → う",
    rule: "Replace います with う",
    description: [
      "Verbs with masu-stem ending in い",
      "Change い to う",
      "Common with meeting/buying verbs",
      "Remember: い-row becomes う-row"
    ],
    examples: ["会います → 会う", "買います → 買う", "言います → 言う"],
    examplesKana: ["あいます → あう", "かいます → かう", "いいます → いう"],
    color: "bg-gradient-to-r from-blue-500 to-cyan-500"
  },
  {
    id: "kimasu",
    title: "Godan: きます → く",
    pattern: "きます → く",
    rule: "Replace きます with く",
    description: [
      "Verbs with masu-stem ending in き",
      "Change き to く",
      "Very common pattern",
      "Examples: writing, listening, walking verbs"
    ],
    examples: ["書きます → 書く", "聞きます → 聞く", "歩きます → 歩く"],
    examplesKana: ["かきます → かく", "ききます → きく", "あるきます → あるく"],
    color: "bg-gradient-to-r from-yellow-500 to-orange-500"
  },
  {
    id: "gimasu",
    title: "Godan: ぎます → ぐ",
    pattern: "ぎます → ぐ",
    rule: "Replace ぎます with ぐ",
    description: [
      "Verbs with masu-stem ending in ぎ",
      "Change ぎ to ぐ (voiced version)",
      "Not many N5 verbs use this",
      "Examples: swimming, hurrying verbs"
    ],
    examples: ["泳ぎます → 泳ぐ", "急ぎます → 急ぐ"],
    examplesKana: ["およぎます → およぐ", "いそぎます → いそぐ"],
    color: "bg-gradient-to-r from-indigo-500 to-purple-500"
  },
  {
    id: "shimasu",
    title: "Godan: します → す",
    pattern: "します → す",
    rule: "Replace します with す",
    description: [
      "Verbs with masu-stem ending in し",
      "Change し to す",
      "Common with speaking/lending verbs",
      "Note: する (irregular) also ends in します"
    ],
    examples: ["話します → 話す", "貸します → 貸す", "押します → 押す"],
    examplesKana: ["はなします → はなす", "かします → かす", "おします → おす"],
    color: "bg-gradient-to-r from-red-500 to-pink-500"
  },
  {
    id: "chimasu",
    title: "Godan: ちます → つ",
    pattern: "ちます → つ",
    rule: "Replace ちます with つ",
    description: [
      "Verbs with masu-stem ending in ち",
      "Change ち to つ",
      "Common with waiting/standing verbs",
      "Remember the つ sound"
    ],
    examples: ["待ちます → 待つ", "立ちます → 立つ", "持ちます → 持つ"],
    examplesKana: ["まちます → まつ", "たちます → たつ", "もちます → もつ"],
    color: "bg-gradient-to-r from-orange-500 to-red-500"
  },
  {
    id: "nimasu",
    title: "Godan: にます → ぬ",
    pattern: "にます → ぬ",
    rule: "Replace にます with ぬ",
    description: [
      "Verbs with masu-stem ending in に",
      "Change に to ぬ",
      "Rare pattern in N5",
      "Main example: 死ぬ (to die)"
    ],
    examples: ["死にます → 死ぬ"],
    examplesKana: ["しにます → しぬ"],
    color: "bg-gradient-to-r from-gray-500 to-slate-500"
  },
  {
    id: "bimasu",
    title: "Godan: びます → ぶ",
    pattern: "びます → ぶ",
    rule: "Replace びます with ぶ",
    description: [
      "Verbs with masu-stem ending in び",
      "Change び to ぶ",
      "Common with playing/calling verbs",
      "Voiced consonant"
    ],
    examples: ["遊びます → 遊ぶ", "呼びます → 呼ぶ", "飛びます → 飛ぶ"],
    examplesKana: ["あそびます → あそぶ", "よびます → よぶ", "とびます → とぶ"],
    color: "bg-gradient-to-r from-purple-500 to-pink-500"
  },
  {
    id: "mimasu",
    title: "Godan: みます → む",
    pattern: "みます → む",
    rule: "Replace みます with む",
    description: [
      "Verbs with masu-stem ending in み",
      "Change み to む",
      "Common with drinking/reading verbs",
      "Remember the む sound"
    ],
    examples: ["飲みます → 飲む", "読みます → 読む", "住みます → 住む"],
    examplesKana: ["のみます → のむ", "よみます → よむ", "すみます → すむ"],
    color: "bg-gradient-to-r from-teal-500 to-green-500"
  },
  {
    id: "rimasu",
    title: "Godan: ります → る",
    pattern: "ります → る",
    rule: "Replace ります with る",
    description: [
      "Verbs with masu-stem ending in り",
      "Change り to る",
      "Be careful: looks like ichidan but it's godan!",
      "Examples: returning, riding, knowing verbs"
    ],
    examples: ["帰ります → 帰る", "乗ります → 乗る", "分かります → 分かる"],
    examplesKana: ["かえります → かえる", "のります → のる", "わかります → わかる"],
    color: "bg-gradient-to-r from-cyan-500 to-blue-500"
  }
]

const exceptions: DictionaryFormRule = {
  id: "exceptions",
  title: "⚠️ IRREGULAR VERBS - Memorize These!",
  pattern: "Special Cases",
  rule: "Must be memorized",
  description: [
    "する and 来る are the only truly irregular verbs",
    "They don't follow the normal godan/ichidan patterns",
    "22 compound する verbs + 2 compound 来る verbs = 25 total",
    "These are essential verbs - memorize them!"
  ],
  examples: [
    "します → する",
    "来ます → 来る",
    "勉強します → 勉強する",
    "持って来ます → 持って来る"
  ],
  examplesKana: [
    "します → する",
    "きます → くる",
    "べんきょうします → べんきょうする",
    "もってきます → もってくる"
  ],
  color: "bg-gradient-to-r from-red-600 to-orange-600"
}

export default function DictionaryFormLearningPage() {
  const [verbsData, setVerbsData] = useState<N5Verb[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0)
  const [showExceptions, setShowExceptions] = useState(false)
  const [completedRules, setCompletedRules] = useState<Set<string>>(new Set())
  const [showKana, setShowKana] = useState(false)

  useEffect(() => {
    async function loadVerbs() {
      try {
        const response = await fetch('/seed-data/N5_verbs_dataset.json')
        const data = await response.json()
        setVerbsData(data.verbs)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load verbs:', error)
        setIsLoading(false)
      }
    }
    loadVerbs()
  }, [])

  const categorizeVerb = (verb: N5Verb): string => {
    const masuKana = verb.conjugations.masuKana

    // Exceptions first - all irregular verbs (group 3)
    if (verb.verbGroup === 'irregular') return 'exceptions'

    // Ichidan verbs
    if (verb.verbGroup === 'ichidan') return 'ichidan'

    // Godan patterns based on masu-form kana ending
    if (masuKana.endsWith('います')) return 'imasu'
    if (masuKana.endsWith('きます')) return 'kimasu'
    if (masuKana.endsWith('ぎます')) return 'gimasu'
    if (masuKana.endsWith('します')) return 'shimasu'
    if (masuKana.endsWith('ちます')) return 'chimasu'
    if (masuKana.endsWith('にます')) return 'nimasu'
    if (masuKana.endsWith('びます')) return 'bimasu'
    if (masuKana.endsWith('みます')) return 'mimasu'
    if (masuKana.endsWith('ります')) return 'rimasu'

    // Special case for 帰る
    if (verb.kanji === '帰る' && masuKana.endsWith('えます')) return 'rimasu'

    return 'other'
  }

  const getVerbsForRule = (ruleId: string) => {
    return verbsData.filter(verb => categorizeVerb(verb) === ruleId)
  }

  const markRuleCompleted = (ruleId: string) => {
    setCompletedRules(prev => new Set([...prev, ruleId]))
  }

  const goToNextRule = () => {
    markRuleCompleted(dictionaryFormRules[currentRuleIndex].id)
    if (currentRuleIndex < dictionaryFormRules.length - 1) {
      setCurrentRuleIndex(currentRuleIndex + 1)
    } else {
      setShowExceptions(true)
    }
  }

  const goToPreviousRule = () => {
    if (showExceptions) {
      setShowExceptions(false)
    } else if (currentRuleIndex > 0) {
      setCurrentRuleIndex(currentRuleIndex - 1)
    }
  }

  const currentRule = showExceptions ? exceptions : dictionaryFormRules[currentRuleIndex]
  const currentVerbs = getVerbsForRule(currentRule.id)
  const progress = ((currentRuleIndex + (showExceptions ? 1 : 0)) / (dictionaryFormRules.length + 1)) * 100

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading dictionary form learning content...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <Badge variant="gradient" className="px-4 py-1.5">
            <Lightbulb className="h-3 w-3 mr-2" />
            Masu → Dictionary Form Conversion Rules
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold">
            Learn <span className="gradient-text">Dictionary Form Patterns</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master the conversion rules step by step. Each rule comes with real N5 verb examples.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {currentRuleIndex + (showExceptions ? 1 : 0)} / {dictionaryFormRules.length + 1} rules
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Kanji/Kana Toggle */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-4">
              <Label htmlFor="kana-toggle" className="text-base font-medium">
                Display Mode:
              </Label>
              <div className="flex items-center gap-3">
                <span className={`text-sm ${!showKana ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                  Kanji
                </span>
                <Switch
                  id="kana-toggle"
                  checked={showKana}
                  onCheckedChange={setShowKana}
                />
                <span className={`text-sm ${showKana ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                  Kana
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rule Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRule.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      {completedRules.has(currentRule.id) && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {currentRule.id === 'exceptions' && (
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                      )}
                      <CardTitle className="text-2xl">{currentRule.title}</CardTitle>
                    </div>
                    <div className={`inline-flex px-4 py-2 rounded-lg ${currentRule.color} text-white font-mono font-bold text-lg`}>
                      {currentRule.pattern}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rule Explanation */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>Rule: {currentRule.rule}</span>
                  </div>
                  <ul className="space-y-2 pl-6">
                    {currentRule.description.map((desc, idx) => (
                      <li key={idx} className="text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Examples */}
                <div className="grid md:grid-cols-3 gap-3">
                  {(showKana ? currentRule.examplesKana : currentRule.examples).map((example, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-muted/50 border-2 border-border text-center space-y-1"
                    >
                      <div className="text-sm font-medium">{example}</div>
                    </div>
                  ))}
                </div>

                {/* Verb Count */}
                <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-semibold">
                    {currentVerbs.length} N5 verbs follow this pattern
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Verb Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              Practice Verbs ({currentVerbs.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentVerbs.map((verb, index) => (
              <motion.div
                key={verb.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(index * 0.03, 0.5) }}
              >
                <Card className="hover:shadow-lg transition-all hover:scale-105">
                  <CardContent className="p-4 space-y-3">
                    <div className="text-center space-y-1">
                      <div className="text-sm text-muted-foreground">
                        {verb.primaryMeaning}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-muted-foreground">Masu:</span>
                        <span className="font-medium">
                          {showKana ? verb.conjugations.masuKana : verb.conjugations.masu}
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-primary/10 rounded border-2 border-primary/20">
                        <span className="text-primary font-semibold">Dictionary:</span>
                        <span className="font-bold text-primary">
                          {showKana ? verb.conjugations.dictionaryKana : verb.conjugations.dictionary}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={goToPreviousRule}
            disabled={currentRuleIndex === 0 && !showExceptions}
          >
            Previous Rule
          </Button>

          <Button
            size="lg"
            onClick={goToNextRule}
            disabled={showExceptions}
            className="gap-2"
          >
            {showExceptions ? "Completed!" : "Next Rule"}
            {!showExceptions && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Completion Message */}
        {showExceptions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6 text-center space-y-3">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-2xl font-bold">Congratulations!</h3>
                <p className="text-muted-foreground">
                  You've completed all dictionary form conversion rules! Practice these patterns
                  to master dictionary form conjugation for all N5 verbs.
                </p>
                <Button size="lg" onClick={() => window.location.href = '/verbs'}>
                  Practice with Flip Cards
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
