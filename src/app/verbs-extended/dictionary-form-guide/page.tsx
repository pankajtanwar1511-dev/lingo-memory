"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowRight, BookOpen, Lightbulb, CheckCircle2, Sparkles, Users, Calendar, Target, TrendingUp, MessageSquare } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface N5Verb {
  id: string
  lemma: { kanji: string; kana: string }
  forms: {
    dictionary: { kanji: string; kana: string }
    masu: { kanji: string; kana: string }
    te: { kanji: string; kana: string }
  }
  morphology: { class: string; isIrregular: boolean }
  meaning: { primary: string; gloss: string[] }
}

interface UsagePattern {
  id: string
  title: string
  description: string[]
  examples: {
    japanese: string
    kana: string
    english: string
    highlight: string
  }[]
  grammar: string
  color: string
  icon: any
}

const usagePatterns: UsagePattern[] = [
  {
    id: "habitual",
    title: "Daily Habits & Routines",
    description: [
      "Use dictionary form for regular, habitual actions",
      "Describes what you do every day, week, or regularly",
      "Often used with time markers: 毎日 (every day), いつも (always)",
      "This is casual/plain speech - use masu form in polite conversation"
    ],
    examples: [
      {
        japanese: "毎朝、コーヒーを飲む。",
        kana: "まいあさ、コーヒーをのむ。",
        english: "I drink coffee every morning.",
        highlight: "daily routine"
      },
      {
        japanese: "いつも九時に寝る。",
        kana: "いつもくじにねる。",
        english: "I always sleep at 9 o'clock.",
        highlight: "habitual action"
      },
      {
        japanese: "週末、公園で走る。",
        kana: "しゅうまつ、こうえんではしる。",
        english: "I run in the park on weekends.",
        highlight: "regular activity"
      }
    ],
    grammar: "毎日/いつも + Verb(dict)",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    icon: Calendar
  },
  {
    id: "intention",
    title: "Future Plans & Intentions",
    description: [
      "Dictionary form + つもり = plan to do, intend to do",
      "Expresses what you're planning or intending to do",
      "Shows conscious decision or determination",
      "Can be negated: ない + つもり = don't intend to"
    ],
    examples: [
      {
        japanese: "明日、友達に会うつもりです。",
        kana: "あした、ともだちにあうつもりです。",
        english: "I plan to meet my friend tomorrow.",
        highlight: "future intention"
      },
      {
        japanese: "来年、日本に行くつもりだ。",
        kana: "らいねん、にほんにいくつもりだ。",
        english: "I intend to go to Japan next year.",
        highlight: "long-term plan"
      },
      {
        japanese: "今日は勉強するつもりです。",
        kana: "きょうはべんきょうするつもりです。",
        english: "I plan to study today.",
        highlight: "today's intention"
      }
    ],
    grammar: "Verb(dict) + つもり",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: Target
  },
  {
    id: "before",
    title: "Before Doing Something",
    description: [
      "Dictionary form + 前に = before doing",
      "Describes action that happens before another action",
      "The second clause can be past or future",
      "Essential pattern for sequencing events"
    ],
    examples: [
      {
        japanese: "寝る前に、歯を磨きます。",
        kana: "ねるまえに、はをみがきます。",
        english: "I brush my teeth before sleeping.",
        highlight: "before sequence"
      },
      {
        japanese: "食べる前に、手を洗う。",
        kana: "たべるまえに、てをあらう。",
        english: "I wash hands before eating.",
        highlight: "hygiene routine"
      },
      {
        japanese: "出かける前に、鍵を確認する。",
        kana: "でかけるまえに、かぎをかくにんする。",
        english: "I check the key before going out.",
        highlight: "preparation"
      }
    ],
    grammar: "Verb(dict) + 前に",
    color: "bg-gradient-to-r from-green-500 to-teal-500",
    icon: ArrowRight
  },
  {
    id: "ability",
    title: "Ability & Possibility",
    description: [
      "Dictionary form + ことができる = can do, be able to do",
      "Expresses ability or possibility",
      "More formal than potential form",
      "Can use past tense: ことができた = was able to"
    ],
    examples: [
      {
        japanese: "日本語を話すことができます。",
        kana: "にほんごをはなすことができます。",
        english: "I can speak Japanese.",
        highlight: "ability"
      },
      {
        japanese: "泳ぐことができますか。",
        kana: "およぐことができますか。",
        english: "Can you swim?",
        highlight: "asking ability"
      },
      {
        japanese: "車を運転することができる。",
        kana: "くるまをうんてんすることができる。",
        english: "I can drive a car.",
        highlight: "skill"
      }
    ],
    grammar: "Verb(dict) + ことができる",
    color: "bg-gradient-to-r from-yellow-500 to-orange-500",
    icon: TrendingUp
  },
  {
    id: "nominalization",
    title: "Making Verbs into Nouns",
    description: [
      "Dictionary form + の/こと = the act of doing",
      "Turns verbs into noun phrases",
      "の is more casual, こと is more formal",
      "Used with が好き (like), が上手 (good at), etc."
    ],
    examples: [
      {
        japanese: "本を読むのが好きです。",
        kana: "ほんをよむのがすきです。",
        english: "I like reading books.",
        highlight: "preference"
      },
      {
        japanese: "歌うことが上手です。",
        kana: "うたうことがじょうずです。",
        english: "I'm good at singing.",
        highlight: "skill level"
      },
      {
        japanese: "泳ぐのは楽しい。",
        kana: "およぐのはたのしい。",
        english: "Swimming is fun.",
        highlight: "description"
      }
    ],
    grammar: "Verb(dict) + の/こと",
    color: "bg-gradient-to-r from-indigo-500 to-purple-500",
    icon: BookOpen
  },
  {
    id: "when-if",
    title: "When/If Clauses",
    description: [
      "Dictionary form + 時 (とき) = when (doing)",
      "Dictionary form + と = if/when (always happens)",
      "Describes conditions or timing",
      "Present tense even if referring to future"
    ],
    examples: [
      {
        japanese: "雨が降る時、傘を持ちます。",
        kana: "あめがふるとき、かさをもちます。",
        english: "When it rains, I take an umbrella.",
        highlight: "conditional timing"
      },
      {
        japanese: "春になると、桜が咲く。",
        kana: "はるになると、さくらがさく。",
        english: "When spring comes, cherry blossoms bloom.",
        highlight: "natural occurrence"
      },
      {
        japanese: "家に帰る時、買い物をする。",
        kana: "いえにかえるとき、かいものをする。",
        english: "When I go home, I do shopping.",
        highlight: "routine timing"
      }
    ],
    grammar: "Verb(dict) + 時/と",
    color: "bg-gradient-to-r from-red-500 to-pink-500",
    icon: Lightbulb
  },
  {
    id: "casual",
    title: "Casual Conversation",
    description: [
      "Use with family, close friends, and in casual settings",
      "More natural in diary writing and internal thoughts",
      "Children and teenagers use it commonly",
      "Switch to masu form for polite/formal situations"
    ],
    examples: [
      {
        japanese: "今日、映画を見る？",
        kana: "きょう、えいがをみる？",
        english: "Wanna watch a movie today?",
        highlight: "casual invitation"
      },
      {
        japanese: "明日、遊ぶ？",
        kana: "あした、あそぶ？",
        english: "Wanna hang out tomorrow?",
        highlight: "informal question"
      },
      {
        japanese: "もう寝る。",
        kana: "もうねる。",
        english: "I'm going to sleep now.",
        highlight: "casual statement"
      }
    ],
    grammar: "Verb(dict) - in casual speech",
    color: "bg-gradient-to-r from-teal-500 to-green-500",
    icon: MessageSquare
  }
]

const comparisonData = {
  title: "Dictionary vs Masu vs Te-Form",
  forms: [
    {
      name: "Dictionary",
      example: "食べる (たべる)",
      when: "Casual speech, grammar patterns",
      canStandAlone: true,
      politeness: "Casual/Plain"
    },
    {
      name: "Masu",
      example: "食べます (たべます)",
      when: "Polite speech, formal situations",
      canStandAlone: true,
      politeness: "Polite/Formal"
    },
    {
      name: "Te",
      example: "食べて (たべて)",
      when: "Connecting actions, requests",
      canStandAlone: false,
      politeness: "Neutral (context dependent)"
    }
  ]
}

export default function DictionaryFormGuidePage() {
  const [verbsData, setVerbsData] = useState<N5Verb[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0)
  const [completedPatterns, setCompletedPatterns] = useState<Set<string>>(new Set())
  const [showKana, setShowKana] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    async function loadVerbs() {
      try {
        const response = await fetch('/seed-data/N5_verbs_dataset_2.json')
        const data = await response.json()
        setVerbsData(data.verbs.slice(0, 12)) // Get first 12 verbs for examples
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load verbs:', error)
        setIsLoading(false)
      }
    }
    loadVerbs()
  }, [])

  const markPatternCompleted = (patternId: string) => {
    setCompletedPatterns(prev => new Set([...prev, patternId]))
  }

  const goToNextPattern = () => {
    markPatternCompleted(usagePatterns[currentPatternIndex].id)
    if (currentPatternIndex < usagePatterns.length - 1) {
      setCurrentPatternIndex(currentPatternIndex + 1)
    } else {
      setShowComparison(true)
    }
  }

  const goToPreviousPattern = () => {
    if (showComparison) {
      setShowComparison(false)
    } else if (currentPatternIndex > 0) {
      setCurrentPatternIndex(currentPatternIndex - 1)
    }
  }

  const currentPattern = usagePatterns[currentPatternIndex]
  const progress = ((currentPatternIndex + (showComparison ? 1 : 0)) / (usagePatterns.length + 1)) * 100
  const Icon = currentPattern?.icon

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading dictionary form guide...</p>
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
            <BookOpen className="h-3 w-3 mr-2" />
            Dictionary Form (辞書形) Usage Guide
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold">
            Master <span className="gradient-text">Dictionary Form</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn when and how to use dictionary form in Japanese. From daily habits to grammar patterns.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {currentPatternIndex + (showComparison ? 1 : 0)} / {usagePatterns.length + 1} patterns
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

        {/* Pattern or Comparison Card */}
        {!showComparison ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPattern.id}
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
                        {completedPatterns.has(currentPattern.id) && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        {Icon && <Icon className="h-5 w-5 text-primary" />}
                        <CardTitle className="text-2xl">{currentPattern.title}</CardTitle>
                      </div>
                      <div className={`inline-flex px-4 py-2 rounded-lg ${currentPattern.color} text-white font-mono font-bold text-sm`}>
                        {currentPattern.grammar}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pattern Explanation */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <span>How to Use</span>
                    </div>
                    <ul className="space-y-2 pl-6">
                      {currentPattern.description.map((desc, idx) => (
                        <li key={idx} className="text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Examples */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>Examples</span>
                    </div>
                    <div className="grid gap-3">
                      {currentPattern.examples.map((example, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-lg bg-muted/50 border-2 border-border space-y-2"
                        >
                          <div className="text-lg font-medium">
                            {showKana ? example.kana : example.japanese}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {example.english}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {example.highlight}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-2xl">{comparisonData.title}</CardTitle>
                <CardDescription>Understanding the three main verb forms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  {comparisonData.forms.map((form, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border-2 bg-muted/30 space-y-3"
                    >
                      <div className="text-center">
                        <h3 className="font-bold text-lg mb-2">{form.name} Form</h3>
                        <div className="text-2xl font-bold text-primary mb-1">
                          {form.example.split(' ')[0]}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {form.example.split(' ')[1]?.replace(/[()]/g, '')}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold">When:</span>
                          <p className="text-muted-foreground">{form.when}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Stand alone:</span>
                          <p className="text-muted-foreground">
                            {form.canStandAlone ? "✅ Yes" : "❌ No"}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold">Level:</span>
                          <p className="text-muted-foreground">{form.politeness}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Quick Rule:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                    <li>• Polite conversation? → Use <strong>Masu Form</strong> (食べます)</li>
                    <li>• Casual/Grammar patterns? → Use <strong>Dictionary Form</strong> (食べる)</li>
                    <li>• Connecting/Requesting? → Use <strong>Te Form</strong> (食べて)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Practice Verbs */}
        {!showComparison && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                Practice Verbs
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {verbsData.map((verb, index) => (
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
                          {showKana ? verb.lemma.kana : verb.lemma.kanji}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {verb.meaning.primary}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-2 bg-primary/10 rounded border-2 border-primary/20">
                          <span className="text-primary font-semibold">Dict:</span>
                          <span className="font-bold text-primary">
                            {showKana ? verb.forms.dictionary.kana : verb.forms.dictionary.kanji}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-muted-foreground">Masu:</span>
                          <span className="font-medium">
                            {showKana ? verb.forms.masu.kana : verb.forms.masu.kanji}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-muted-foreground">Te:</span>
                          <span className="font-medium">
                            {showKana ? verb.forms.te.kana : verb.forms.te.kanji}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={goToPreviousPattern}
            disabled={currentPatternIndex === 0 && !showComparison}
          >
            Previous Pattern
          </Button>

          <Button
            size="lg"
            onClick={goToNextPattern}
            disabled={showComparison}
            className="gap-2"
          >
            {showComparison ? "Completed!" : "Next Pattern"}
            {!showComparison && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Completion Message */}
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6 text-center space-y-3">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-2xl font-bold">Congratulations!</h3>
                <p className="text-muted-foreground">
                  You've learned all the main usage patterns for dictionary form!
                  Practice these patterns to become fluent in Japanese grammar.
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
