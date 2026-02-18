"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen, Lightbulb, Sparkles, CheckCircle2, XCircle,
  Calendar, Target, TrendingUp, ArrowRight, Users, Zap, ArrowLeft
} from "lucide-react"
import { motion } from "framer-motion"

// ─── Usage Guide data (from forms-usage-guide) ───────────────────────────────

interface UsageRow {
  category: string
  dictForm: { canUse: boolean; example?: string; exampleKana?: string; english?: string }
  masuForm: { canUse: boolean; example?: string; exampleKana?: string; english?: string }
  teForm:   { canUse: boolean; example?: string; exampleKana?: string; english?: string }
}

interface UsagePattern {
  id: string; title: string; description: string[]
  examples: { japanese: string; kana: string; english: string; highlight: string }[]
  grammar: string; color: string; icon: React.ElementType
}

const comparisonTable: UsageRow[] = [
  { category: "Daily Habits",      dictForm: { canUse: true,  example: "毎日走る",        exampleKana: "まいにちはしる",        english: "I run every day" },          masuForm: { canUse: true,  example: "毎日走ります",    exampleKana: "まいにちはしります",    english: "I run every day (polite)" }, teForm: { canUse: false } },
  { category: "Requests",          dictForm: { canUse: false }, masuForm: { canUse: false }, teForm: { canUse: true,  example: "走ってください",   exampleKana: "はしってください",   english: "Please run" } },
  { category: "Sequential Actions",dictForm: { canUse: false }, masuForm: { canUse: false }, teForm: { canUse: true,  example: "走って、寝た",     exampleKana: "はしって、ねた",     english: "I ran and slept" } },
  { category: "Progressive (ing)", dictForm: { canUse: false }, masuForm: { canUse: false }, teForm: { canUse: true,  example: "走っています",     exampleKana: "はしっています",     english: "I am running" } },
  { category: "Future Plans",      dictForm: { canUse: true,  example: "走るつもり",       exampleKana: "はしるつもり",          english: "Plan to run" },              masuForm: { canUse: true,  example: "走るつもりです", exampleKana: "はしるつもりです",    english: "Plan to run (polite)" }, teForm: { canUse: false } },
  { category: "Before Action",     dictForm: { canUse: true,  example: "走る前に",         exampleKana: "はしるまえに",          english: "Before running" },           masuForm: { canUse: true,  example: "走る前に",       exampleKana: "はしるまえに",        english: "Before running" }, teForm: { canUse: false } },
  { category: "After Action",      dictForm: { canUse: false }, masuForm: { canUse: false }, teForm: { canUse: true,  example: "走ってから",       exampleKana: "はしってから",       english: "After running" } },
  { category: "Permission",        dictForm: { canUse: false }, masuForm: { canUse: false }, teForm: { canUse: true,  example: "走ってもいい",     exampleKana: "はしってもいい",     english: "May I run?" } },
  { category: "Prohibition",       dictForm: { canUse: false }, masuForm: { canUse: false }, teForm: { canUse: true,  example: "走ってはいけない", exampleKana: "はしってはいけない", english: "Must not run" } },
  { category: "Ability",           dictForm: { canUse: true,  example: "走ることができる", exampleKana: "はしることができる",  english: "Can run" },                  masuForm: { canUse: true,  example: "走ることができます", exampleKana: "はしることができます", english: "Can run (polite)" }, teForm: { canUse: false } },
  { category: "Nominalization",    dictForm: { canUse: true,  example: "走るのが好き",     exampleKana: "はしるのがすき",        english: "Like running" },             masuForm: { canUse: true,  example: "走るのが好きです", exampleKana: "はしるのがすきです",  english: "Like running (polite)" }, teForm: { canUse: false } },
  { category: "Try Doing",         dictForm: { canUse: false }, masuForm: { canUse: false }, teForm: { canUse: true,  example: "走ってみる",       exampleKana: "はしってみる",       english: "Try running" } },
]

const dictPatterns: UsagePattern[] = [
  { id:"d1", title:"1. Daily Habits & Routines", grammar:"毎日/いつも + Verb(dict)", color:"bg-gradient-to-r from-blue-500 to-cyan-500", icon: Calendar,
    description:["Most common use — describes habitual actions","Casual/plain speech","Use masu form in polite conversation"],
    examples:[{ japanese:"毎朝、コーヒーを飲む。", kana:"まいあさ、コーヒーをのむ。", english:"I drink coffee every morning.", highlight:"daily routine"},
              { japanese:"週末、公園で走る。", kana:"しゅうまつ、こうえんではしる。", english:"I run in the park on weekends.", highlight:"regular activity"}]},
  { id:"d2", title:"2. Making Verbs into Nouns", grammar:"Verb(dict) + の/こと", color:"bg-gradient-to-r from-indigo-500 to-purple-500", icon: BookOpen,
    description:["Dict form + の/こと = the act of doing","Used with が好き (like), が上手 (good at), etc."],
    examples:[{ japanese:"本を読むのが好きです。", kana:"ほんをよむのがすきです。", english:"I like reading books.", highlight:"preference"},
              { japanese:"泳ぐのは楽しい。", kana:"およぐのはたのしい。", english:"Swimming is fun.", highlight:"general statement"}]},
  { id:"d3", title:"3. Future Plans & Intentions", grammar:"Verb(dict) + つもり", color:"bg-gradient-to-r from-purple-500 to-pink-500", icon: Target,
    description:["Dict form + つもり = plan/intend to do","Can be negated: ない + つもり = don't intend to"],
    examples:[{ japanese:"明日、友達に会うつもりです。", kana:"あした、ともだちにあうつもりです。", english:"I plan to meet my friend tomorrow.", highlight:"future intention"},
              { japanese:"来年、日本に行くつもりだ。", kana:"らいねん、にほんにいくつもりだ。", english:"I intend to go to Japan next year.", highlight:"long-term plan"}]},
  { id:"d4", title:"4. Before Doing Something", grammar:"Verb(dict) + 前に", color:"bg-gradient-to-r from-green-500 to-teal-500", icon: ArrowRight,
    description:["Dict form + 前に = before doing","Common in daily routines and sequences"],
    examples:[{ japanese:"寝る前に、歯を磨きます。", kana:"ねるまえに、はをみがきます。", english:"I brush my teeth before sleeping.", highlight:"routine"},
              { japanese:"食べる前に、手を洗う。", kana:"たべるまえに、てをあらう。", english:"I wash hands before eating.", highlight:"hygiene"}]},
  { id:"d5", title:"5. Ability & Possibility", grammar:"Verb(dict) + ことができる", color:"bg-gradient-to-r from-yellow-500 to-orange-500", icon: TrendingUp,
    description:["Dict form + ことができる = can do","More formal than potential form"],
    examples:[{ japanese:"日本語を話すことができます。", kana:"にほんごをはなすことができます。", english:"I can speak Japanese.", highlight:"language ability"},
              { japanese:"泳ぐことができますか。", kana:"およぐことができますか。", english:"Can you swim?", highlight:"asking ability"}]},
]

const tePatterns: UsagePattern[] = [
  { id:"t1", title:"1. Polite Requests", grammar:"Verb(te) + ください", color:"bg-gradient-to-r from-blue-500 to-cyan-500", icon: Users,
    description:["Most common te-form use","Polite way to ask someone to do something"],
    examples:[{ japanese:"ここに座ってください。", kana:"ここにすわってください。", english:"Please sit here.", highlight:"polite request"},
              { japanese:"もう一度言ってください。", kana:"もういちどいってください。", english:"Please say it one more time.", highlight:"repetition"}]},
  { id:"t2", title:"2. Sequential Actions", grammar:"Verb(te) + Verb", color:"bg-gradient-to-r from-purple-500 to-pink-500", icon: ArrowRight,
    description:["Te-form connects multiple actions in sequence","Shows 'and then' relationship"],
    examples:[{ japanese:"朝起きて、顔を洗います。", kana:"あさおきて、かおをあらいます。", english:"I wake up and wash my face.", highlight:"morning routine"},
              { japanese:"宿題をして、寝ました。", kana:"しゅくだいをして、ねました。", english:"I did homework and slept.", highlight:"evening"}]},
  { id:"t3", title:"3. Present Progressive (ing)", grammar:"Verb(te) + いる/います", color:"bg-gradient-to-r from-green-500 to-teal-500", icon: Zap,
    description:["Te-form + いる = currently doing","Like English '-ing' form"],
    examples:[{ japanese:"今、テレビを見ています。", kana:"いま、テレビをみています。", english:"I am watching TV now.", highlight:"current action"},
              { japanese:"雨が降っています。", kana:"あめがふっています。", english:"It is raining.", highlight:"weather"}]},
  { id:"t4", title:"4. After Doing Something", grammar:"Verb(te) + から", color:"bg-gradient-to-r from-orange-500 to-red-500", icon: Calendar,
    description:["Te-form + から = after doing","Shows sequence with emphasis on 'after'"],
    examples:[{ japanese:"宿題をしてから、遊びます。", kana:"しゅくだいをしてから、あそびます。", english:"After doing homework, I'll play.", highlight:"priority"},
              { japanese:"ご飯を食べてから、出かけます。", kana:"ごはんをたべてから、でかけます。", english:"After eating, I'll go out.", highlight:"sequence"}]},
  { id:"t5", title:"5. Permission", grammar:"Verb(te) + もいい", color:"bg-gradient-to-r from-teal-500 to-cyan-500", icon: CheckCircle2,
    description:["Te-form + もいい = may I / it's okay to","Polite way to ask if something is allowed"],
    examples:[{ japanese:"写真を撮ってもいいですか。", kana:"しゃしんをとってもいいですか。", english:"May I take a photo?", highlight:"permission"},
              { japanese:"ここに座ってもいいですか。", kana:"ここにすわってもいいですか。", english:"May I sit here?", highlight:"social"}]},
  { id:"t6", title:"6. Prohibition", grammar:"Verb(te) + はいけない", color:"bg-gradient-to-r from-red-500 to-pink-500", icon: XCircle,
    description:["Te-form + はいけない = must not do","Used in rules and warnings"],
    examples:[{ japanese:"ここで泳いではいけません。", kana:"ここでおよいではいけません。", english:"You must not swim here.", highlight:"prohibition"},
              { japanese:"タバコを吸ってはいけません。", kana:"タバコをすってはいけません。", english:"You must not smoke.", highlight:"rule"}]},
  { id:"t7", title:"7. Try Doing", grammar:"Verb(te) + みる", color:"bg-gradient-to-r from-yellow-500 to-orange-500", icon: Sparkles,
    description:["Te-form + みる = try doing","Common when recommending or attempting"],
    examples:[{ japanese:"この料理を食べてみてください。", kana:"このりょうりをたべてみてください。", english:"Please try eating this dish.", highlight:"recommendation"},
              { japanese:"日本語を話してみます。", kana:"にほんごをはなしてみます。", english:"I'll try speaking Japanese.", highlight:"attempt"}]},
]

function PatternList({ patterns, showKana }: { patterns: UsagePattern[]; showKana: boolean }) {
  return (
    <div className="space-y-4">
      {patterns.map(p => {
        const Icon = p.icon
        return (
          <Card key={p.id} className="border">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary shrink-0" />
                <CardTitle className="text-base">{p.title}</CardTitle>
              </div>
              <div className={`inline-flex px-2 sm:px-3 py-1 rounded ${p.color} text-white font-mono text-[10px] sm:text-xs font-bold break-all`}>
                {p.grammar}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <ul className="space-y-0.5 text-sm text-muted-foreground">
                {p.description.map((d, i) => (
                  <li key={i} className="flex gap-1.5"><span className="text-primary">•</span>{d}</li>
                ))}
              </ul>
              <div className="space-y-2">
                {p.examples.map((ex, i) => (
                  <div key={i} className="p-2.5 rounded bg-muted/50 border text-sm space-y-0.5">
                    <div className="font-medium">{showKana ? ex.kana : ex.japanese}</div>
                    <div className="text-muted-foreground text-xs">{ex.english}</div>
                    <Badge variant="secondary" className="text-xs">{ex.highlight}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function GrammarReferencePage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") === "rules" ? "rules" : "usage"
  const [showKana, setShowKana] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6 max-w-4xl">

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
            <BookOpen className="h-3 w-3 mr-2" />
            Grammar Reference
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold">
            Grammar <span className="gradient-text">Reference</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            When to use each form and how conjugation patterns work — all in one place.
          </p>
        </motion.div>

        {/* Kana toggle */}
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm ${!showKana ? "font-semibold text-primary" : "text-muted-foreground"}`}>Kanji</span>
          <Switch id="kana" checked={showKana} onCheckedChange={setShowKana} />
          <span className={`text-sm ${showKana ? "font-semibold text-primary" : "text-muted-foreground"}`}>Kana</span>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={initialTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="usage">Usage Guide</TabsTrigger>
            <TabsTrigger value="rules">Conjugation Rules</TabsTrigger>
          </TabsList>

          {/* ── Usage Guide tab ──────────────────────────────────────────── */}
          <TabsContent value="usage" className="space-y-6">
            <p className="text-sm text-muted-foreground text-center">
              When and why to use Dictionary / Masu / Te form
            </p>

            {/* Comparison table */}
            <Card>
              <CardHeader>
                <CardTitle>At a Glance — Which Form?</CardTitle>
                <CardDescription>Usage categories with examples</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left p-1.5 sm:p-2 font-bold">Category</th>
                        <th className="text-center p-1.5 sm:p-2 font-bold bg-blue-500/10">Dict</th>
                        <th className="text-center p-1.5 sm:p-2 font-bold bg-purple-500/10">Masu</th>
                        <th className="text-center p-1.5 sm:p-2 font-bold bg-green-500/10">Te</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonTable.map((row, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/40">
                          <td className="p-1.5 sm:p-2 font-medium">{row.category}</td>
                          {([
                            { data: row.dictForm, bg: "bg-blue-500/5" },
                            { data: row.masuForm, bg: "bg-purple-500/5" },
                            { data: row.teForm,   bg: "bg-green-500/5" },
                          ] as { data: UsageRow["dictForm"]; bg: string }[]).map(({ data, bg }, ci) => (
                            <td key={ci} className={`p-1.5 sm:p-2 text-center ${bg}`}>
                              {data.canUse ? (
                                <div className="space-y-0.5">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                                  {data.example && (
                                    <div className="text-xs hidden sm:block">
                                      <div className="font-medium">{showKana ? data.exampleKana : data.example}</div>
                                      <div className="text-muted-foreground">{data.english}</div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <XCircle className="h-4 w-4 text-red-400 mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg text-sm">
                  <div className="flex items-center gap-2 font-semibold mb-1"><Lightbulb className="h-4 w-4" />Quick rule:</div>
                  <ul className="space-y-0.5 text-muted-foreground pl-4">
                    <li>• <strong>Polite conversation?</strong> → Masu form</li>
                    <li>• <strong>Casual / grammar patterns?</strong> → Dictionary form</li>
                    <li>• <strong>Connecting / requesting?</strong> → Te form</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Dictionary patterns */}
            <div>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Badge className="bg-blue-500 text-white">Dict</Badge> Dictionary Form Patterns
              </h2>
              <PatternList patterns={dictPatterns} showKana={showKana} />
            </div>

            {/* Masu note */}
            <Card className="border bg-muted/30">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Masu form patterns</strong> mirror dictionary form patterns but add politeness.
                  Use masu form in the same contexts when speaking to strangers, superiors, or in formal situations.
                </p>
              </CardContent>
            </Card>

            {/* Te patterns */}
            <div>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Badge className="bg-green-500 text-white">Te</Badge> Te Form Patterns
              </h2>
              <PatternList patterns={tePatterns} showKana={showKana} />
            </div>
          </TabsContent>

          {/* ── Conjugation Rules tab ─────────────────────────────────────── */}
          <TabsContent value="rules" className="space-y-6">
            <p className="text-sm text-muted-foreground text-center">
              How verb conjugation works — based on the hiragana vowel table
            </p>

            {/* Hiragana table */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">📊 Hiragana Vowel Table — The Foundation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-1">
                  <table className="w-full text-center border-collapse text-[10px] sm:text-sm">
                    <thead>
                      <tr className="border-b-2">
                        <th className="p-0.5 sm:p-1.5 font-bold text-left">Row</th>
                        {["∅","k","s","t","n","h","m","y","r","w"].map(c => (
                          <th key={c} className="p-0.5 sm:p-1.5">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "a-row", bg: "bg-muted",                      cells: ["あ","か","さ","た","な","は","ま","や","ら","わ"] },
                        { label: "i-row (ます)", bg: "bg-blue-100 dark:bg-blue-900 font-bold", cells: ["い","き","し","ち","に","ひ","み","—","り","—"] },
                        { label: "u-row (dict)", bg: "bg-green-100 dark:bg-green-900 font-bold", cells: ["う","く","す","つ","ぬ","ふ","む","ゆ","る","—"] },
                        { label: "e-row", bg: "bg-muted",                      cells: ["え","け","せ","て","ね","へ","め","—","れ","—"] },
                        { label: "o-row", bg: "bg-muted",                      cells: ["お","こ","そ","と","の","ほ","も","よ","ろ","を"] },
                      ].map(row => (
                        <tr key={row.label} className="border-b">
                          <td className={`p-0.5 sm:p-1.5 font-bold text-left whitespace-nowrap ${row.bg}`}>{row.label}</td>
                          {row.cells.map((c, i) => <td key={i} className="p-0.5 sm:p-1.5">{c}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Group I (Godan) verbs shift <span className="font-bold text-blue-600 dark:text-blue-400">i-row (ます)</span> → <span className="font-bold text-green-600 dark:text-green-400">u-row (dictionary)</span>
                </p>
              </CardContent>
            </Card>

            {/* Ichidan vs Godan explanation */}
            <Card className="border-2 border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-base">🎯 Why "Group II (Ichidan)" and "Group I (Godan)"?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border-2 border-blue-500 space-y-2">
                    <p className="font-bold text-blue-700 dark:text-blue-400">Group I — Godan 五段 = "Five-step"</p>
                    <p className="text-muted-foreground">Steps through all 5 vowel rows when conjugating. Example 書く: か→き→く→け→こ</p>
                  </div>
                  <div className="p-3 rounded-lg border-2 border-green-500 space-y-2">
                    <p className="font-bold text-green-700 dark:text-green-400">Group II — Ichidan 一段 = "One-step"</p>
                    <p className="text-muted-foreground">Stem never changes — uses only one vowel row. Example 食べる: たべ always stays たべ</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Masu → Dict rules table */}
            <Card className="border-2">
              <CardHeader><CardTitle className="text-base">📘 Masu → Dictionary Form Rules</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b-2"><th className="p-2 text-left">Pattern</th><th className="p-2 text-left">Rule</th><th className="p-2 text-left hidden sm:table-cell">Examples</th><th className="p-2 text-center">Count</th></tr></thead>
                    <tbody>
                      {[
                        { pat: "e/i + ます → る", rule: "Remove ます, add る", ex: "食べます→食べる, 見ます→見る", n: 39, hi: true },
                        { pat: "います → う", rule: "い → う", ex: "会います→会う, 買います→買う", n: 13 },
                        { pat: "きます → く", rule: "き → く", ex: "書きます→書く, 聞きます→聞く", n: 15 },
                        { pat: "ぎます → ぐ", rule: "ぎ → ぐ", ex: "泳ぎます→泳ぐ", n: 3 },
                        { pat: "します → す", rule: "し → す", ex: "話します→話す", n: 11 },
                        { pat: "ちます → つ", rule: "ち → つ", ex: "待ちます→待つ", n: 5 },
                        { pat: "にます → ぬ", rule: "に → ぬ", ex: "死にます→死ぬ (rare)", n: 0 },
                        { pat: "びます → ぶ", rule: "び → ぶ", ex: "遊びます→遊ぶ", n: 2 },
                        { pat: "みます → む", rule: "み → む", ex: "飲みます→飲む", n: 4 },
                        { pat: "ります → る", rule: "り → る", ex: "帰ります→帰る", n: 24 },
                        { pat: "Group III (Irregular)", rule: "Memorize!", ex: "します→する, 来ます→来る", n: 25, err: true },
                      ].map((r, i) => (
                        <tr key={i} className={`border-b ${r.hi ? "bg-green-50 dark:bg-green-950/20" : r.err ? "bg-red-50 dark:bg-red-950/20" : "hover:bg-muted/30"}`}>
                          <td className={`p-2 font-mono font-bold ${r.err ? "text-red-600 dark:text-red-400" : ""}`}>{r.pat}</td>
                          <td className="p-2">{r.rule}</td>
                          <td className="p-2 hidden sm:table-cell text-muted-foreground text-xs">{r.ex}</td>
                          <td className="p-2 text-center"><Badge variant={r.err ? "destructive" : r.hi ? "secondary" : "outline"}>{r.n}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Masu → Te rules table */}
            <Card className="border-2">
              <CardHeader><CardTitle className="text-base">📗 Masu → Te Form Rules</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b-2"><th className="p-2 text-left">Pattern</th><th className="p-2 text-left">Rule</th><th className="p-2 text-left hidden sm:table-cell">Examples</th><th className="p-2 text-center">Count</th></tr></thead>
                    <tbody>
                      {[
                        { pat: "e/i + ます → て", rule: "Remove ます, add て", ex: "食べます→食べて, 見ます→見て", n: 39, hi: true },
                        { pat: "い/ち/り + ます → って", rule: "Replace with って", ex: "会います→会って, 待ちます→待って", n: 42 },
                        { pat: "み/び/に + ます → んで", rule: "Replace with んで", ex: "飲みます→飲んで, 遊びます→遊んで", n: 6 },
                        { pat: "きます → いて", rule: "Replace き with いて", ex: "書きます→書いて", n: 14 },
                        { pat: "ぎます → いで", rule: "Replace ぎ with いで", ex: "泳ぎます→泳いで", n: 3 },
                        { pat: "します → して", rule: "Replace し with して", ex: "話します→話して", n: 33 },
                        { pat: "Exceptions", rule: "Memorize!", ex: "行きます→行って, 来ます→来て", n: 4, err: true },
                      ].map((r, i) => (
                        <tr key={i} className={`border-b ${r.hi ? "bg-green-50 dark:bg-green-950/20" : r.err ? "bg-red-50 dark:bg-red-950/20" : "hover:bg-muted/30"}`}>
                          <td className={`p-2 font-mono font-bold ${r.err ? "text-red-600 dark:text-red-400" : ""}`}>{r.pat}</td>
                          <td className="p-2">{r.rule}</td>
                          <td className="p-2 hidden sm:table-cell text-muted-foreground text-xs">{r.ex}</td>
                          <td className="p-2 text-center"><Badge variant={r.err ? "destructive" : r.hi ? "secondary" : "outline"}>{r.n}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Key insights */}
            <Card className="border-2 border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/10">
              <CardHeader><CardTitle className="text-base">💡 Key Insights</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-3">
                <div><p className="font-semibold">Group II — Ichidan (39 verbs):</p><p className="text-muted-foreground pl-4">Dict: remove ます add る → Te: remove ます add て — simple and consistent.</p></div>
                <div><p className="font-semibold">Group I — Godan (77 verbs):</p><p className="text-muted-foreground pl-4">Dict: i-row → u-row shift. Te: more complex (って, んで, いて, いで, して).</p></div>
                <div><p className="font-semibold">Group III — Irregular (25 verbs):</p><p className="text-muted-foreground pl-4">Core: する, 来る. Compounds: 勉強する etc. Note: する follows して in te-form.</p></div>

                {/* します shortcuts */}
                <div className="grid sm:grid-cols-2 gap-2 pt-1">
                  <div className="p-3 bg-violet-50 dark:bg-violet-950/30 rounded border border-violet-300 dark:border-violet-700">
                    <p className="font-semibold text-violet-800 dark:text-violet-300">⭐ Noun + します → always Group III (Irregular)</p>
                    <p className="text-muted-foreground mt-1">If there is a <strong>noun before します</strong>, the verb is Group III (irregular). No exceptions in N5.</p>
                    <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                      <p>勉強<strong>します</strong> → 勉強する (Group III)</p>
                      <p>電話<strong>します</strong> → 電話する (Group III)</p>
                      <p>運転<strong>します</strong> → 運転する (Group III)</p>
                      <p className="text-violet-600 dark:text-violet-400 font-medium">21 such verbs in N5 — all Group III</p>
                    </div>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded border border-teal-300 dark:border-teal-700">
                    <p className="font-semibold text-teal-800 dark:text-teal-300">⭐ No noun + します → always Group I (Godan)</p>
                    <p className="text-muted-foreground mt-1">If します is the <strong>whole ending</strong> (no noun before it), it is Group I (Godan), dict form ends in す.</p>
                    <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                      <p>話<strong>します</strong> → 話す (Group I)</p>
                      <p>貸<strong>します</strong> → 貸す (Group I)</p>
                      <p>消<strong>します</strong> → 消す (Group I)</p>
                      <p className="text-teal-600 dark:text-teal-400 font-medium">11 such verbs in N5 — all Group I</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded text-orange-800 dark:text-orange-300">
                  <p className="font-semibold">⚠️ Common trap:</p>
                  <p>ります→る verbs look like Group II (Ichidan) but they're Group I (Godan)! 帰る, 乗る, 分かる — check the sound before る.</p>
                </div>
              </CardContent>
            </Card>

            {/* How to identify */}
            <Card className="border-2 border-blue-500/50">
              <CardHeader><CardTitle className="text-base">🔍 How to Identify Group II (Ichidan) vs Group I (Godan)</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-3">

                {/* Teacher's rule — the 1-kana shortcut */}
                <div className="p-3 rounded bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-400 dark:border-purple-600">
                  <p className="font-bold text-purple-800 dark:text-purple-300">⭐ Best shortcut: count the kana before ます</p>
                  <p className="mt-1 text-purple-700 dark:text-purple-400">
                    If there is <strong>only 1 kana</strong> before ます → it is <strong>always Group II (Ichidan)</strong>
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="font-semibold text-purple-700 dark:text-purple-400 mb-1">1 kana → Group II (Ichidan) ✓</p>
                      <p className="text-muted-foreground">み・ます → 見る</p>
                      <p className="text-muted-foreground">ね・ます → 寝る</p>
                      <p className="text-muted-foreground">き・ます → 着る</p>
                      <p className="text-muted-foreground">で・ます → 出る</p>
                      <p className="text-muted-foreground">い・ます → いる</p>
                    </div>
                    <div>
                      <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Exceptions (irregular!) ⚠️</p>
                      <p className="text-muted-foreground">き・ます → 来る (irregular)</p>
                      <p className="text-muted-foreground">し・ます → する (irregular)</p>
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">These are the only 2 exceptions — memorise them and the rule is bulletproof.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded bg-green-50 dark:bg-green-950/30 border border-green-300">
                  <p className="font-bold text-green-700 dark:text-green-400">✓ Ends in -えます? → Group II — Ichidan (100% certain)</p>
                  <p className="text-muted-foreground text-xs pl-4">たべます, みせます, おしえます, かんがえます — no Group I (Godan) verb ends in -えます</p>
                </div>
                <div className="p-3 rounded bg-blue-50 dark:bg-blue-950/30 border border-blue-300">
                  <p className="font-bold text-blue-700 dark:text-blue-400">✓ Ends in -きます/-ぎます/-ちます/-びます/-にます? → Group I — Godan</p>
                  <p className="text-muted-foreground text-xs pl-4">かきます, およぎます, まちます, あそびます — never Group II (Ichidan)</p>
                </div>
                <div className="p-3 rounded bg-orange-50 dark:bg-orange-950/30 border border-orange-300">
                  <p className="font-bold text-orange-700 dark:text-orange-400">⚠️ Ends in -います/-ります/-みます? → Could be either — must memorize</p>
                  <p className="text-muted-foreground text-xs pl-4">Group II: みます (見る), おきます (起きる) | Group I: のみます (飲む), かえります (帰る)</p>
                </div>
              </CardContent>
            </Card>

            {/* Link to tutorials */}
            <div className="flex justify-center">
              <Button onClick={() => window.location.href = "/verbs/form-tutorials"} variant="outline" className="gap-2">
                <Lightbulb className="h-4 w-4" />
                Practice Rules Step-by-Step → Form Tutorials
              </Button>
            </div>
          </TabsContent>
        </Tabs>

      </main>
    </div>
  )
}
