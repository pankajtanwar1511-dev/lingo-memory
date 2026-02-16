"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Lightbulb, Sparkles, Users, Calendar, Target, TrendingUp, MessageSquare, CheckCircle2, XCircle, Zap, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface N5Verb {
  id: string
  kanji: string
  kana: string
  conjugations: {
    dictionary: string
    dictionaryKana: string
    masu: string
    masuKana: string
    te: string
    teKana: string
  }
  verbGroup: string
  primaryMeaning: string
}

interface UsageRow {
  category: string
  dictForm: {
    canUse: boolean
    example?: string
    exampleKana?: string
    english?: string
  }
  masuForm: {
    canUse: boolean
    example?: string
    exampleKana?: string
    english?: string
  }
  teForm: {
    canUse: boolean
    example?: string
    exampleKana?: string
    english?: string
  }
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

const comparisonTable: UsageRow[] = [
  {
    category: "Daily Habits",
    dictForm: { canUse: true, example: "毎日走る", exampleKana: "まいにちはしる", english: "I run every day" },
    masuForm: { canUse: true, example: "毎日走ります", exampleKana: "まいにちはしります", english: "I run every day (polite)" },
    teForm: { canUse: false }
  },
  {
    category: "Requests",
    dictForm: { canUse: false },
    masuForm: { canUse: false },
    teForm: { canUse: true, example: "走ってください", exampleKana: "はしってください", english: "Please run" }
  },
  {
    category: "Sequential Actions",
    dictForm: { canUse: false },
    masuForm: { canUse: false },
    teForm: { canUse: true, example: "走って、寝た", exampleKana: "はしって、ねた", english: "I ran and slept" }
  },
  {
    category: "Progressive (ing)",
    dictForm: { canUse: false },
    masuForm: { canUse: false },
    teForm: { canUse: true, example: "走っています", exampleKana: "はしっています", english: "I am running" }
  },
  {
    category: "Future Plans",
    dictForm: { canUse: true, example: "走るつもり", exampleKana: "はしるつもり", english: "Plan to run" },
    masuForm: { canUse: true, example: "走るつもりです", exampleKana: "はしるつもりです", english: "Plan to run (polite)" },
    teForm: { canUse: false }
  },
  {
    category: "Before Action",
    dictForm: { canUse: true, example: "走る前に", exampleKana: "はしるまえに", english: "Before running" },
    masuForm: { canUse: true, example: "走る前に", exampleKana: "はしるまえに", english: "Before running" },
    teForm: { canUse: false }
  },
  {
    category: "After Action",
    dictForm: { canUse: false },
    masuForm: { canUse: false },
    teForm: { canUse: true, example: "走ってから", exampleKana: "はしってから", english: "After running" }
  },
  {
    category: "Permission",
    dictForm: { canUse: false },
    masuForm: { canUse: false },
    teForm: { canUse: true, example: "走ってもいい", exampleKana: "はしってもいい", english: "May I run?" }
  },
  {
    category: "Prohibition",
    dictForm: { canUse: false },
    masuForm: { canUse: false },
    teForm: { canUse: true, example: "走ってはいけない", exampleKana: "はしってはいけない", english: "Must not run" }
  },
  {
    category: "Ability",
    dictForm: { canUse: true, example: "走ることができる", exampleKana: "はしることができる", english: "Can run" },
    masuForm: { canUse: true, example: "走ることができます", exampleKana: "はしることができます", english: "Can run (polite)" },
    teForm: { canUse: false }
  },
  {
    category: "Nominalization",
    dictForm: { canUse: true, example: "走るのが好き", exampleKana: "はしるのがすき", english: "Like running" },
    masuForm: { canUse: true, example: "走るのが好きです", exampleKana: "はしるのがすきです", english: "Like running (polite)" },
    teForm: { canUse: false }
  },
  {
    category: "Try Doing",
    dictForm: { canUse: false },
    masuForm: { canUse: false },
    teForm: { canUse: true, example: "走ってみる", exampleKana: "はしってみる", english: "Try running" }
  }
]

// Dictionary Form Patterns - Ordered by importance/daily usage
const dictionaryPatterns: UsagePattern[] = [
  {
    id: "dict-habitual",
    title: "1. Daily Habits & Routines",
    description: [
      "Most common use of dictionary form",
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
    id: "dict-nominalization",
    title: "2. Making Verbs into Nouns",
    description: [
      "Dictionary form + の/こと = the act of doing",
      "Very common in daily conversation",
      "Used with が好き (like), が上手 (good at), etc.",
      "の is more casual, こと is more formal"
    ],
    examples: [
      {
        japanese: "本を読むのが好きです。",
        kana: "ほんをよむのがすきです。",
        english: "I like reading books.",
        highlight: "expressing preference"
      },
      {
        japanese: "歌うことが上手です。",
        kana: "うたうことがじょうずです。",
        english: "I'm good at singing.",
        highlight: "describing skill"
      },
      {
        japanese: "泳ぐのは楽しい。",
        kana: "およぐのはたのしい。",
        english: "Swimming is fun.",
        highlight: "general statement"
      }
    ],
    grammar: "Verb(dict) + の/こと",
    color: "bg-gradient-to-r from-indigo-500 to-purple-500",
    icon: BookOpen
  },
  {
    id: "dict-intention",
    title: "3. Future Plans & Intentions",
    description: [
      "Dictionary form + つもり = plan to do, intend to do",
      "Essential for expressing future plans",
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
        highlight: "today's plan"
      }
    ],
    grammar: "Verb(dict) + つもり",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: Target
  },
  {
    id: "dict-before",
    title: "4. Before Doing Something",
    description: [
      "Dictionary form + 前に = before doing",
      "Important for describing sequences",
      "The second clause can be past or future",
      "Essential pattern for daily routines"
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
    id: "dict-ability",
    title: "5. Ability & Possibility",
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
        highlight: "language ability"
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
        highlight: "practical skill"
      }
    ],
    grammar: "Verb(dict) + ことができる",
    color: "bg-gradient-to-r from-yellow-500 to-orange-500",
    icon: TrendingUp
  }
]

// Te Form Patterns - Ordered by importance/daily usage
const teFormPatterns: UsagePattern[] = [
  {
    id: "te-request",
    title: "1. Polite Requests",
    description: [
      "Te-form + ください = Please do",
      "MOST COMMON use - essential for daily conversation",
      "Used constantly in daily Japanese",
      "Polite way to ask someone to do something"
    ],
    examples: [
      {
        japanese: "ここに座ってください。",
        kana: "ここにすわってください。",
        english: "Please sit here.",
        highlight: "polite request"
      },
      {
        japanese: "もう一度言ってください。",
        kana: "もういちどいってください。",
        english: "Please say it one more time.",
        highlight: "asking for repetition"
      },
      {
        japanese: "窓を開けてください。",
        kana: "まどをあけてください。",
        english: "Please open the window.",
        highlight: "simple request"
      }
    ],
    grammar: "Verb(te) + ください",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    icon: Users
  },
  {
    id: "te-sequential",
    title: "2. Sequential Actions",
    description: [
      "Te-form connects multiple actions in sequence",
      "Second most common use of te-form",
      "Shows 'and then' relationship",
      "Natural way to describe routines and stories"
    ],
    examples: [
      {
        japanese: "朝起きて、顔を洗います。",
        kana: "あさおきて、かおをあらいます。",
        english: "I wake up and wash my face.",
        highlight: "morning routine"
      },
      {
        japanese: "スーパーに行って、野菜を買いました。",
        kana: "スーパーにいって、やさいをかいました。",
        english: "I went to the supermarket and bought vegetables.",
        highlight: "shopping sequence"
      },
      {
        japanese: "宿題をして、寝ました。",
        kana: "しゅくだいをして、ねました。",
        english: "I did homework and went to sleep.",
        highlight: "evening routine"
      }
    ],
    grammar: "Verb(te) + Verb",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: ArrowRight
  },
  {
    id: "te-progressive",
    title: "3. Present Progressive (ing)",
    description: [
      "Te-form + いる/います = currently doing",
      "Describes ongoing actions",
      "Like English '-ing' form",
      "Very commonly used in conversation"
    ],
    examples: [
      {
        japanese: "今、テレビを見ています。",
        kana: "いま、テレビをみています。",
        english: "I am watching TV now.",
        highlight: "current action"
      },
      {
        japanese: "彼は本を読んでいる。",
        kana: "かれはほんをよんでいる。",
        english: "He is reading a book.",
        highlight: "ongoing activity"
      },
      {
        japanese: "雨が降っています。",
        kana: "あめがふっています。",
        english: "It is raining.",
        highlight: "weather"
      }
    ],
    grammar: "Verb(te) + いる/います",
    color: "bg-gradient-to-r from-green-500 to-teal-500",
    icon: Zap
  },
  {
    id: "te-after",
    title: "4. After Doing Something",
    description: [
      "Te-form + から = after doing",
      "Shows sequence with emphasis on 'after'",
      "Important for describing order of events",
      "Common in daily routines"
    ],
    examples: [
      {
        japanese: "宿題をしてから、遊びます。",
        kana: "しゅくだいをしてから、あそびます。",
        english: "After doing homework, I'll play.",
        highlight: "priority order"
      },
      {
        japanese: "ご飯を食べてから、出かけます。",
        kana: "ごはんをたべてから、でかけます。",
        english: "After eating, I'll go out.",
        highlight: "daily sequence"
      },
      {
        japanese: "シャワーを浴びてから、寝ます。",
        kana: "シャワーをあびてから、ねます。",
        english: "After taking a shower, I'll sleep.",
        highlight: "evening routine"
      }
    ],
    grammar: "Verb(te) + から",
    color: "bg-gradient-to-r from-orange-500 to-red-500",
    icon: Calendar
  },
  {
    id: "te-permission",
    title: "5. Permission",
    description: [
      "Te-form + もいい = may I do / it's okay to do",
      "For asking and giving permission",
      "Polite way to ask if something is allowed",
      "Essential for social situations"
    ],
    examples: [
      {
        japanese: "写真を撮ってもいいですか。",
        kana: "しゃしんをとってもいいですか。",
        english: "May I take a photo?",
        highlight: "asking permission"
      },
      {
        japanese: "窓を開けてもいいですか。",
        kana: "まどをあけてもいいですか。",
        english: "May I open the window?",
        highlight: "polite request"
      },
      {
        japanese: "ここに座ってもいいですか。",
        kana: "ここにすわってもいいですか。",
        english: "May I sit here?",
        highlight: "seeking permission"
      }
    ],
    grammar: "Verb(te) + もいい",
    color: "bg-gradient-to-r from-teal-500 to-cyan-500",
    icon: CheckCircle2
  },
  {
    id: "te-prohibition",
    title: "6. Prohibition",
    description: [
      "Te-form + はいけない = must not do",
      "For rules and prohibitions",
      "Important for understanding restrictions",
      "Used in signs and warnings"
    ],
    examples: [
      {
        japanese: "ここで泳いではいけません。",
        kana: "ここでおよいではいけません。",
        english: "You must not swim here.",
        highlight: "prohibition"
      },
      {
        japanese: "タバコを吸ってはいけません。",
        kana: "タバコをすってはいけません。",
        english: "You must not smoke.",
        highlight: "rule"
      },
      {
        japanese: "走ってはいけません。",
        kana: "はしってはいけません。",
        english: "You must not run.",
        highlight: "warning"
      }
    ],
    grammar: "Verb(te) + はいけない",
    color: "bg-gradient-to-r from-red-500 to-pink-500",
    icon: XCircle
  },
  {
    id: "te-try",
    title: "7. Try Doing",
    description: [
      "Te-form + みる = try doing",
      "Suggests attempting or experiencing something",
      "Common when recommending things",
      "Casual and friendly expression"
    ],
    examples: [
      {
        japanese: "この料理を食べてみてください。",
        kana: "このりょうりをたべてみてください。",
        english: "Please try eating this dish.",
        highlight: "recommendation"
      },
      {
        japanese: "日本語を話してみます。",
        kana: "にほんごをはなしてみます。",
        english: "I'll try speaking Japanese.",
        highlight: "attempting"
      },
      {
        japanese: "着てみてもいいですか。",
        kana: "きてみてもいいですか。",
        english: "May I try it on?",
        highlight: "shopping"
      }
    ],
    grammar: "Verb(te) + みる",
    color: "bg-gradient-to-r from-yellow-500 to-orange-500",
    icon: Sparkles
  }
]

// Masu Form Patterns - Ordered by importance/daily usage (matching table ✅)
const masuFormPatterns: UsagePattern[] = [
  {
    id: "masu-habitual",
    title: "1. Daily Habits (Polite)",
    description: [
      "Same as dictionary form but POLITE",
      "Most common use - for regular, habitual actions",
      "Use with: strangers, superiors, customers, formal situations",
      "Safe default for most conversations"
    ],
    examples: [
      {
        japanese: "毎日、学校に行きます。",
        kana: "まいにち、がっこうにいきます。",
        english: "I go to school every day.",
        highlight: "polite daily routine"
      },
      {
        japanese: "いつも六時に起きます。",
        kana: "いつもろくじにおきます。",
        english: "I always wake up at 6 o'clock.",
        highlight: "polite habit"
      },
      {
        japanese: "毎朝、コーヒーを飲みます。",
        kana: "まいあさ、コーヒーをのみます。",
        english: "I drink coffee every morning.",
        highlight: "polite routine"
      }
    ],
    grammar: "毎日/いつも + Verb(masu)",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    icon: Calendar
  },
  {
    id: "masu-nominalization",
    title: "2. Making Verbs into Nouns (Polite)",
    description: [
      "Verb(dict) + の/こと + polite copula です",
      "Very common when speaking politely",
      "Used with が好き (like), が上手 (good at), etc.",
      "Essential for polite preferences and descriptions"
    ],
    examples: [
      {
        japanese: "本を読むのが好きです。",
        kana: "ほんをよむのがすきです。",
        english: "I like reading books.",
        highlight: "polite preference"
      },
      {
        japanese: "歌うことが上手です。",
        kana: "うたうことがじょうずです。",
        english: "You're good at singing.",
        highlight: "polite compliment"
      },
      {
        japanese: "走るのは楽しいです。",
        kana: "はしるのはたのしいです。",
        english: "Running is fun.",
        highlight: "polite opinion"
      }
    ],
    grammar: "Verb(dict) + の/こと + です",
    color: "bg-gradient-to-r from-indigo-500 to-purple-500",
    icon: BookOpen
  },
  {
    id: "masu-intention",
    title: "3. Future Plans (Polite)",
    description: [
      "Verb(dict) + つもりです = plan to do (polite)",
      "Essential for expressing future plans politely",
      "Shows conscious decision with politeness",
      "Common in formal and casual polite settings"
    ],
    examples: [
      {
        japanese: "明日、友達に会うつもりです。",
        kana: "あした、ともだちにあうつもりです。",
        english: "I plan to meet my friend tomorrow.",
        highlight: "polite intention"
      },
      {
        japanese: "来年、日本に行くつもりです。",
        kana: "らいねん、にほんにいくつもりです。",
        english: "I intend to go to Japan next year.",
        highlight: "polite plan"
      },
      {
        japanese: "明日は勉強するつもりです。",
        kana: "あしたはべんきょうするつもりです。",
        english: "I plan to study tomorrow.",
        highlight: "polite commitment"
      }
    ],
    grammar: "Verb(dict) + つもりです",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: Target
  },
  {
    id: "masu-before",
    title: "4. Before Doing (Polite)",
    description: [
      "Verb(dict) + 前に + polite ending",
      "Describes action before another (politely)",
      "Important for describing sequences politely",
      "The verb before 前に stays in dictionary form"
    ],
    examples: [
      {
        japanese: "寝る前に、歯を磨きます。",
        kana: "ねるまえに、はをみがきます。",
        english: "I brush my teeth before sleeping.",
        highlight: "polite sequence"
      },
      {
        japanese: "食べる前に、手を洗います。",
        kana: "たべるまえに、てをあらいます。",
        english: "I wash hands before eating.",
        highlight: "polite routine"
      },
      {
        japanese: "出かける前に、鍵を確認します。",
        kana: "でかけるまえに、かぎをかくにんします。",
        english: "I check the key before going out.",
        highlight: "polite preparation"
      }
    ],
    grammar: "Verb(dict) + 前に + masu",
    color: "bg-gradient-to-r from-green-500 to-teal-500",
    icon: ArrowRight
  },
  {
    id: "masu-ability",
    title: "5. Ability (Polite)",
    description: [
      "Verb(dict) + ことができます = can do (polite)",
      "Polite way to express ability",
      "More formal and respectful",
      "Common in professional and polite contexts"
    ],
    examples: [
      {
        japanese: "日本語を話すことができます。",
        kana: "にほんごをはなすことができます。",
        english: "I can speak Japanese.",
        highlight: "polite ability"
      },
      {
        japanese: "泳ぐことができますか。",
        kana: "およぐことができますか。",
        english: "Can you swim?",
        highlight: "polite question"
      },
      {
        japanese: "車を運転することができます。",
        kana: "くるまをうんてんすることができます。",
        english: "I can drive a car.",
        highlight: "polite capability"
      }
    ],
    grammar: "Verb(dict) + ことができます",
    color: "bg-gradient-to-r from-yellow-500 to-orange-500",
    icon: TrendingUp
  }
]

export default function FormsUsageGuidePage() {
  const [verbsData, setVerbsData] = useState<N5Verb[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showKana, setShowKana] = useState(false)
  const [activeTab, setActiveTab] = useState("table")

  useEffect(() => {
    async function loadVerbs() {
      try {
        const response = await fetch('/seed-data/N5_verbs_dataset.json')
        const data = await response.json()
        setVerbsData(data.verbs.slice(0, 12))
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load verbs:', error)
        setIsLoading(false)
      }
    }
    loadVerbs()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading verb forms guide...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <Badge variant="gradient" className="px-4 py-1.5">
            <BookOpen className="h-3 w-3 mr-2" />
            Complete Verb Forms Usage Guide
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold">
            Master <span className="gradient-text">All Three Verb Forms</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn when to use Dictionary, Masu, and Te forms with comprehensive examples and usage patterns.
          </p>
        </motion.div>

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

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-2/3 mx-auto">
            <TabsTrigger value="table">Comparison Table</TabsTrigger>
            <TabsTrigger value="dictionary">Dictionary Form</TabsTrigger>
            <TabsTrigger value="masu">Masu Form</TabsTrigger>
            <TabsTrigger value="te">Te Form</TabsTrigger>
          </TabsList>

          {/* Comparison Table Tab */}
          <TabsContent value="table" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Usage Comparison Table</CardTitle>
                <CardDescription>When to use each verb form at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left p-3 font-bold">Usage Category</th>
                        <th className="text-center p-3 font-bold bg-blue-500/10">Dictionary Form</th>
                        <th className="text-center p-3 font-bold bg-purple-500/10">Masu Form</th>
                        <th className="text-center p-3 font-bold bg-green-500/10">Te Form</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonTable.map((row, idx) => (
                        <tr key={idx} className="border-b border-border hover:bg-muted/50">
                          <td className="p-3 font-semibold">{row.category}</td>
                          <td className="p-3 text-center bg-blue-500/5">
                            {row.dictForm.canUse ? (
                              <div className="space-y-1">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                                {row.dictForm.example && (
                                  <div className="text-xs">
                                    <div className="font-medium">{showKana ? row.dictForm.exampleKana : row.dictForm.example}</div>
                                    <div className="text-muted-foreground">{row.dictForm.english}</div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            )}
                          </td>
                          <td className="p-3 text-center bg-purple-500/5">
                            {row.masuForm.canUse ? (
                              <div className="space-y-1">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                                {row.masuForm.example && (
                                  <div className="text-xs">
                                    <div className="font-medium">{showKana ? row.masuForm.exampleKana : row.masuForm.example}</div>
                                    <div className="text-muted-foreground">{row.masuForm.english}</div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            )}
                          </td>
                          <td className="p-3 text-center bg-green-500/5">
                            {row.teForm.canUse ? (
                              <div className="space-y-1">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                                {row.teForm.example && (
                                  <div className="text-xs">
                                    <div className="font-medium">{showKana ? row.teForm.exampleKana : row.teForm.example}</div>
                                    <div className="text-muted-foreground">{row.teForm.english}</div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Quick Decision Guide:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                    <li>• <strong>Polite conversation?</strong> → Use Masu Form</li>
                    <li>• <strong>Casual/Grammar patterns?</strong> → Use Dictionary Form</li>
                    <li>• <strong>Connecting/Requesting?</strong> → Use Te Form</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dictionary Form Tab */}
          <TabsContent value="dictionary" className="space-y-6">
            {dictionaryPatterns.map((pattern) => {
              const Icon = pattern.icon
              return (
                <Card key={pattern.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{pattern.title}</CardTitle>
                    </div>
                    <div className={`inline-flex px-4 py-2 rounded-lg ${pattern.color} text-white font-mono font-bold text-sm mt-2`}>
                      {pattern.grammar}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        How to Use:
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                        {pattern.description.map((desc, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Examples:
                      </h4>
                      <div className="grid gap-3">
                        {pattern.examples.map((example, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-muted/50 border space-y-1">
                            <div className="text-base font-medium">
                              {showKana ? example.kana : example.japanese}
                            </div>
                            <div className="text-sm text-muted-foreground">{example.english}</div>
                            <Badge variant="secondary" className="text-xs">{example.highlight}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          {/* Masu Form Tab */}
          <TabsContent value="masu" className="space-y-6">
            {masuFormPatterns.map((pattern) => {
              const Icon = pattern.icon
              return (
                <Card key={pattern.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{pattern.title}</CardTitle>
                    </div>
                    <div className={`inline-flex px-4 py-2 rounded-lg ${pattern.color} text-white font-mono font-bold text-sm mt-2`}>
                      {pattern.grammar}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        How to Use:
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                        {pattern.description.map((desc, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Examples:
                      </h4>
                      <div className="grid gap-3">
                        {pattern.examples.map((example, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-muted/50 border space-y-1">
                            <div className="text-base font-medium">
                              {showKana ? example.kana : example.japanese}
                            </div>
                            <div className="text-sm text-muted-foreground">{example.english}</div>
                            <Badge variant="secondary" className="text-xs">{example.highlight}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          {/* Te Form Tab */}
          <TabsContent value="te" className="space-y-6">
            {teFormPatterns.map((pattern) => {
              const Icon = pattern.icon
              return (
                <Card key={pattern.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{pattern.title}</CardTitle>
                    </div>
                    <div className={`inline-flex px-4 py-2 rounded-lg ${pattern.color} text-white font-mono font-bold text-sm mt-2`}>
                      {pattern.grammar}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        How to Use:
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                        {pattern.description.map((desc, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Examples:
                      </h4>
                      <div className="grid gap-3">
                        {pattern.examples.map((example, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-muted/50 border space-y-1">
                            <div className="text-base font-medium">
                              {showKana ? example.kana : example.japanese}
                            </div>
                            <div className="text-sm text-muted-foreground">{example.english}</div>
                            <Badge variant="secondary" className="text-xs">{example.highlight}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>
        </Tabs>

        {/* Practice Verbs Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Practice Verbs - All Forms</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {verbsData.map((verb) => (
              <Card key={verb.id} className="hover:shadow-lg transition-all">
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
                    <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded">
                      <span className="text-blue-700 dark:text-blue-400 font-semibold">Dict:</span>
                      <span className="font-bold">
                        {showKana ? verb.conjugations.dictionaryKana : verb.conjugations.dictionary}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-purple-500/10 rounded">
                      <span className="text-purple-700 dark:text-purple-400 font-semibold">Masu:</span>
                      <span className="font-bold">
                        {showKana ? verb.conjugations.masuKana : verb.conjugations.masu}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-500/10 rounded">
                      <span className="text-green-700 dark:text-green-400 font-semibold">Te:</span>
                      <span className="font-bold">
                        {showKana ? verb.conjugations.teKana : verb.conjugations.te}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Back to Verbs Button */}
        <div className="flex justify-center pt-4">
          <Button size="lg" onClick={() => window.location.href = '/verbs'} className="gap-2">
            <BookOpen className="h-5 w-5" />
            Back to Verbs Practice
          </Button>
        </div>
      </main>
    </div>
  )
}
