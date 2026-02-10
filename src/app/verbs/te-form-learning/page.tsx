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
    masu: string
    masuKana: string
    te: string
    teKana: string
  }
  verbGroup: string
  primaryMeaning: string
}

interface TeFormRule {
  id: string
  title: string
  pattern: string
  rule: string
  description: string[]
  examples: string[]
  examplesKana?: string[]
  color: string
}

const teFormRules: TeFormRule[] = [
  {
    id: "ichidan",
    title: "Ichidan Verbs (る-verbs)",
    pattern: "Vowel + ます → て",
    rule: "Remove ます, add て",
    description: [
      "These verbs have stems ending in -e or -i sounds",
      "The conversion is simple and consistent",
      "Just replace ます with て",
      "Works 99% of the time for ichidan verbs"
    ],
    examples: ["食べます → 食べて", "見ます → 見て", "起きます → 起きて"],
    examplesKana: ["たべます → たべて", "みます → みて", "おきます → おきて"],
    color: "bg-gradient-to-r from-green-500 to-teal-500"
  },
  {
    id: "itte",
    title: "Godan: い・ち・り + ます → って",
    pattern: "い/ち/り + ます → って",
    rule: "Replace い/ち/り with って",
    description: [
      "Verbs ending in -imasu, -chimasu, -rimasu",
      "All convert to って",
      "Most common godan pattern",
      "Easy to remember as a group"
    ],
    examples: ["会います → 会って", "待ちます → 待って", "帰ります → 帰って"],
    examplesKana: ["あいます → あって", "まちます → まって", "かえります → かえって"],
    color: "bg-gradient-to-r from-blue-500 to-cyan-500"
  },
  {
    id: "nde",
    title: "Godan: み・び・に + ます → んで",
    pattern: "み/び/に + ます → んで",
    rule: "Replace み/び/に with んで",
    description: [
      "Verbs ending in -mimasu, -bimasu, -nimasu",
      "All convert to んで (with 'n' sound)",
      "The 'n' sound makes it distinct",
      "Common with drinking/reading verbs"
    ],
    examples: ["飲みます → 飲んで", "遊びます → 遊んで", "死にます → 死んで"],
    examplesKana: ["のみます → のんで", "あそびます → あそんで", "しにます → しんで"],
    color: "bg-gradient-to-r from-purple-500 to-pink-500"
  },
  {
    id: "ite",
    title: "Godan: き + ます → いて",
    pattern: "き + ます → いて",
    rule: "Replace き with いて",
    description: [
      "Verbs ending in -kimasu only",
      "Convert to いて",
      "Very consistent pattern",
      "Watch out for the 行く exception!"
    ],
    examples: ["書きます → 書いて", "歩きます → 歩いて", "聞きます → 聞いて"],
    examplesKana: ["かきます → かいて", "あるきます → あるいて", "ききます → きいて"],
    color: "bg-gradient-to-r from-yellow-500 to-orange-500"
  },
  {
    id: "ide",
    title: "Godan: ぎ + ます → いで",
    pattern: "ぎ + ます → いで",
    rule: "Replace ぎ with いで",
    description: [
      "Verbs ending in -gimasu only",
      "Convert to いで (voiced version)",
      "Similar to き→いて but voiced",
      "Not many N5 verbs use this"
    ],
    examples: ["泳ぎます → 泳いで", "急ぎます → 急いで"],
    examplesKana: ["およぎます → およいで", "いそぎます → いそいで"],
    color: "bg-gradient-to-r from-indigo-500 to-purple-500"
  },
  {
    id: "shite",
    title: "Godan: し + ます → して",
    pattern: "し + ます → して",
    rule: "Replace し with して",
    description: [
      "Verbs ending in -shimasu",
      "Convert to して",
      "Common with speaking/lending verbs",
      "Also includes irregular する"
    ],
    examples: ["話します → 話して", "貸します → 貸して", "押します → 押して"],
    examplesKana: ["はなします → はなして", "かします → かして", "おします → おして"],
    color: "bg-gradient-to-r from-red-500 to-pink-500"
  }
]

const exceptions: TeFormRule = {
  id: "exceptions",
  title: "⚠️ EXCEPTIONS - Memorize These!",
  pattern: "Special Cases",
  rule: "Must be memorized",
  description: [
    "行く is the ONLY common き→いて exception",
    "It follows the って pattern instead",
    "Irregular verbs: する and 来る",
    "These don't follow normal patterns"
  ],
  examples: [
    "行きます → 行って (NOT 行いて!)",
    "来ます → 来て",
    "します → して"
  ],
  examplesKana: [
    "いきます → いって (NOT いいて!)",
    "きます → きて",
    "します → して"
  ],
  color: "bg-gradient-to-r from-red-600 to-orange-600"
}

export default function TeFormLearningPage() {
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

    // Exceptions first
    if (verb.kanji === '行く') return 'exceptions'
    if (verb.kanji === '来る') return 'exceptions'
    if (verb.kanji === 'する' || verb.kanji.endsWith('する')) return 'shite'

    // Ichidan verbs
    if (verb.verbGroup === 'ichidan') return 'ichidan'

    // Godan patterns based on masu-form kana
    // Special case: 帰る ends in えます but follows りますpattern (historically かえります)
    if (masuKana.endsWith('います') || masuKana.endsWith('ちます') || masuKana.endsWith('ります') ||
        (verb.kanji === '帰る' && masuKana.endsWith('えます'))) {
      return 'itte'
    }
    if (masuKana.endsWith('みます') || masuKana.endsWith('びます') || masuKana.endsWith('にます')) {
      return 'nde'
    }
    if (masuKana.endsWith('きます')) {
      return 'ite'
    }
    if (masuKana.endsWith('ぎます')) {
      return 'ide'
    }
    if (masuKana.endsWith('します')) {
      return 'shite'
    }

    return 'other'
  }

  const getVerbsForRule = (ruleId: string) => {
    return verbsData.filter(verb => categorizeVerb(verb) === ruleId)
  }

  const markRuleCompleted = (ruleId: string) => {
    setCompletedRules(prev => new Set([...prev, ruleId]))
  }

  const goToNextRule = () => {
    markRuleCompleted(teFormRules[currentRuleIndex].id)
    if (currentRuleIndex < teFormRules.length - 1) {
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

  const currentRule = showExceptions ? exceptions : teFormRules[currentRuleIndex]
  const currentVerbs = getVerbsForRule(currentRule.id)
  const progress = ((currentRuleIndex + (showExceptions ? 1 : 0)) / (teFormRules.length + 1)) * 100

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading te-form learning content...</p>
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
            Masu → Te-form Conversion Rules
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold">
            Learn <span className="gradient-text">Te-form Patterns</span>
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
                  {currentRuleIndex + (showExceptions ? 1 : 0)} / {teFormRules.length + 1} rules
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
                  {(showKana && currentRule.examplesKana ? currentRule.examplesKana : currentRule.examples).map((example, idx) => (
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
                      <div className="text-2xl font-bold text-primary">
                        {showKana ? verb.kana : verb.kanji}
                      </div>
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
                        <span className="text-primary font-semibold">Te:</span>
                        <span className="font-bold text-primary">
                          {showKana ? verb.conjugations.teKana : verb.conjugations.te}
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
                  You've completed all te-form conversion rules! Practice these patterns
                  to master te-form conjugation for all N5 verbs.
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
