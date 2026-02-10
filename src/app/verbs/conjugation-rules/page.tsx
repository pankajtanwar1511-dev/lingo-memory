"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"

export default function ConjugationRulesPage() {
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
            Quick Reference Guide
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="gradient-text">Verb Conjugation Rules</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All conversion patterns based on the hiragana vowel table (i-row → u-row)
          </p>
        </motion.div>

        {/* Hiragana Table Reference */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Hiragana Vowel Table (The Foundation)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="border-b-2">
                    <th className="p-2 font-bold">Row</th>
                    <th className="p-2">∅</th>
                    <th className="p-2">k</th>
                    <th className="p-2">s</th>
                    <th className="p-2">t</th>
                    <th className="p-2">n</th>
                    <th className="p-2">h</th>
                    <th className="p-2">m</th>
                    <th className="p-2">y</th>
                    <th className="p-2">r</th>
                    <th className="p-2">w</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-bold bg-muted">a-row</td>
                    <td className="p-2">あ</td>
                    <td className="p-2">か</td>
                    <td className="p-2">さ</td>
                    <td className="p-2">た</td>
                    <td className="p-2">な</td>
                    <td className="p-2">は</td>
                    <td className="p-2">ま</td>
                    <td className="p-2">や</td>
                    <td className="p-2">ら</td>
                    <td className="p-2">わ</td>
                  </tr>
                  <tr className="border-b bg-blue-50 dark:bg-blue-950/20">
                    <td className="p-2 font-bold bg-blue-100 dark:bg-blue-900">i-row (ます)</td>
                    <td className="p-2 font-bold">い</td>
                    <td className="p-2 font-bold">き</td>
                    <td className="p-2 font-bold">し</td>
                    <td className="p-2 font-bold">ち</td>
                    <td className="p-2 font-bold">に</td>
                    <td className="p-2 font-bold">ひ</td>
                    <td className="p-2 font-bold">み</td>
                    <td className="p-2 font-bold">-</td>
                    <td className="p-2 font-bold">り</td>
                    <td className="p-2 font-bold">-</td>
                  </tr>
                  <tr className="border-b bg-green-50 dark:bg-green-950/20">
                    <td className="p-2 font-bold bg-green-100 dark:bg-green-900">u-row (dictionary)</td>
                    <td className="p-2 font-bold">う</td>
                    <td className="p-2 font-bold">く</td>
                    <td className="p-2 font-bold">す</td>
                    <td className="p-2 font-bold">つ</td>
                    <td className="p-2 font-bold">ぬ</td>
                    <td className="p-2 font-bold">ふ</td>
                    <td className="p-2 font-bold">む</td>
                    <td className="p-2 font-bold">ゆ</td>
                    <td className="p-2 font-bold">る</td>
                    <td className="p-2 font-bold">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-bold bg-muted">e-row</td>
                    <td className="p-2">え</td>
                    <td className="p-2">け</td>
                    <td className="p-2">せ</td>
                    <td className="p-2">て</td>
                    <td className="p-2">ね</td>
                    <td className="p-2">へ</td>
                    <td className="p-2">め</td>
                    <td className="p-2">-</td>
                    <td className="p-2">れ</td>
                    <td className="p-2">-</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold bg-muted">o-row</td>
                    <td className="p-2">お</td>
                    <td className="p-2">こ</td>
                    <td className="p-2">そ</td>
                    <td className="p-2">と</td>
                    <td className="p-2">の</td>
                    <td className="p-2">ほ</td>
                    <td className="p-2">も</td>
                    <td className="p-2">よ</td>
                    <td className="p-2">ろ</td>
                    <td className="p-2">を</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              💡 Key Pattern: Godan verbs shift <span className="font-bold text-blue-600 dark:text-blue-400">i-row (ます form)</span> → <span className="font-bold text-green-600 dark:text-green-400">u-row (dictionary form)</span>
            </p>
          </CardContent>
        </Card>

        {/* Masu → Dictionary Form Rules */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">📘 Masu → Dictionary Form Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2">
                    <th className="p-3 text-left font-bold">Pattern</th>
                    <th className="p-3 text-left font-bold">Rule</th>
                    <th className="p-3 text-left font-bold">Examples</th>
                    <th className="p-3 text-center font-bold">Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-green-50 dark:bg-green-950/20">
                    <td className="p-3 font-mono font-bold">e/i + ます → る</td>
                    <td className="p-3">Remove ます, add る</td>
                    <td className="p-3">食べます→食べる, 見ます→見る</td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary">39</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">います → う</td>
                    <td className="p-3">い → う</td>
                    <td className="p-3">会います→会う, 買います→買う</td>
                    <td className="p-3 text-center">
                      <Badge>13</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">きます → く</td>
                    <td className="p-3">き → く</td>
                    <td className="p-3">書きます→書く, 聞きます→聞く</td>
                    <td className="p-3 text-center">
                      <Badge>15</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">ぎます → ぐ</td>
                    <td className="p-3">ぎ → ぐ</td>
                    <td className="p-3">泳ぎます→泳ぐ, 急ぎます→急ぐ</td>
                    <td className="p-3 text-center">
                      <Badge>3</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">します → す</td>
                    <td className="p-3">し → す</td>
                    <td className="p-3">話します→話す, 貸します→貸す</td>
                    <td className="p-3 text-center">
                      <Badge>11</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">ちます → つ</td>
                    <td className="p-3">ち → つ</td>
                    <td className="p-3">待ちます→待つ, 立ちます→立つ</td>
                    <td className="p-3 text-center">
                      <Badge>5</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">にます → ぬ</td>
                    <td className="p-3">に → ぬ</td>
                    <td className="p-3">死にます→死ぬ (rare!)</td>
                    <td className="p-3 text-center">
                      <Badge>0</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">びます → ぶ</td>
                    <td className="p-3">び → ぶ</td>
                    <td className="p-3">遊びます→遊ぶ, 呼びます→呼ぶ</td>
                    <td className="p-3 text-center">
                      <Badge>2</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">みます → む</td>
                    <td className="p-3">み → む</td>
                    <td className="p-3">飲みます→飲む, 読みます→読む</td>
                    <td className="p-3 text-center">
                      <Badge>4</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">ります → る</td>
                    <td className="p-3">り → る</td>
                    <td className="p-3">帰ります→帰る, 乗ります→乗る</td>
                    <td className="p-3 text-center">
                      <Badge>24</Badge>
                    </td>
                  </tr>
                  <tr className="border-b bg-red-50 dark:bg-red-950/20">
                    <td className="p-3 font-mono font-bold text-red-600 dark:text-red-400">Irregular</td>
                    <td className="p-3">Memorize!</td>
                    <td className="p-3">します→する, 来ます→来る, 勉強します→勉強する</td>
                    <td className="p-3 text-center">
                      <Badge variant="destructive">25</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Masu → Te Form Rules */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">📗 Masu → Te Form Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2">
                    <th className="p-3 text-left font-bold">Pattern</th>
                    <th className="p-3 text-left font-bold">Rule</th>
                    <th className="p-3 text-left font-bold">Examples</th>
                    <th className="p-3 text-center font-bold">Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-green-50 dark:bg-green-950/20">
                    <td className="p-3 font-mono font-bold">e/i + ます → て</td>
                    <td className="p-3">Remove ます, add て</td>
                    <td className="p-3">食べます→食べて, 見ます→見て</td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary">39</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-purple-600 dark:text-purple-400">い/ち/り + ます → って</td>
                    <td className="p-3">Replace with って</td>
                    <td className="p-3">会います→会って, 待ちます→待って</td>
                    <td className="p-3 text-center">
                      <Badge>42</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-purple-600 dark:text-purple-400">み/び/に + ます → んで</td>
                    <td className="p-3">Replace with んで</td>
                    <td className="p-3">飲みます→飲んで, 遊びます→遊んで</td>
                    <td className="p-3 text-center">
                      <Badge>6</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-purple-600 dark:text-purple-400">きます → いて</td>
                    <td className="p-3">Replace き with いて</td>
                    <td className="p-3">書きます→書いて, 聞きます→聞いて</td>
                    <td className="p-3 text-center">
                      <Badge>14</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-purple-600 dark:text-purple-400">ぎます → いで</td>
                    <td className="p-3">Replace ぎ with いで</td>
                    <td className="p-3">泳ぎます→泳いで, 急ぎます→急いで</td>
                    <td className="p-3 text-center">
                      <Badge>3</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-purple-600 dark:text-purple-400">します → して</td>
                    <td className="p-3">Replace し with して</td>
                    <td className="p-3">話します→話して, します→して</td>
                    <td className="p-3 text-center">
                      <Badge>33</Badge>
                    </td>
                  </tr>
                  <tr className="border-b bg-red-50 dark:bg-red-950/20">
                    <td className="p-3 font-mono font-bold text-red-600 dark:text-red-400">Exceptions</td>
                    <td className="p-3">Memorize!</td>
                    <td className="p-3">行きます→行って, 来ます→来て</td>
                    <td className="p-3 text-center">
                      <Badge variant="destructive">4</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="font-semibold">1. Ichidan Verbs (39 verbs):</p>
              <ul className="list-disc list-inside pl-4 space-y-1 text-sm text-muted-foreground">
                <li>Stem ends in e/i sound + る</li>
                <li>Dictionary: Remove ます, add る</li>
                <li>Te-form: Remove ます, add て</li>
                <li>Simple and consistent!</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">2. Godan Verbs (77 verbs):</p>
              <ul className="list-disc list-inside pl-4 space-y-1 text-sm text-muted-foreground">
                <li>Dictionary: Follow i-row → u-row vowel shift (い→う, き→く, etc.)</li>
                <li>Te-form: More complex patterns (って, んで, いて, いで, して)</li>
                <li>Largest groups: ります→る (24), い/ち/り→って (42)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">3. Irregular Verbs (25 verbs):</p>
              <ul className="list-disc list-inside pl-4 space-y-1 text-sm text-muted-foreground">
                <li>Core: する, 来る (must memorize!)</li>
                <li>Compounds: 勉強する, 持って来る, etc.</li>
                <li>Note: する follows して pattern in te-form</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-red-600 dark:text-red-400">⚠️ Common Trap:</p>
              <ul className="list-disc list-inside pl-4 space-y-1 text-sm text-muted-foreground">
                <li><strong>ります→る verbs look like ichidan but they're GODAN!</strong></li>
                <li>帰る, 乗る, 分かる - these end in る but follow godan patterns</li>
                <li>Check the sound before る: if it's a/u/o → godan</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Navigation to Learning Pages */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.location.href = '/verbs/dictionary-form-learning'}
            className="gap-2"
          >
            <GraduationCap className="h-5 w-5" />
            Learn Dictionary Form Step-by-Step
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.location.href = '/verbs/te-form-learning'}
            className="gap-2"
          >
            <GraduationCap className="h-5 w-5" />
            Learn Te-form Step-by-Step
          </Button>
          <Button
            size="lg"
            onClick={() => window.location.href = '/verbs'}
            className="gap-2"
          >
            <BookOpen className="h-5 w-5" />
            Practice with Flip Cards
          </Button>
        </div>
      </main>
    </div>
  )
}
