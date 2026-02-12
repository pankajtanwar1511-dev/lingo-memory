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

        {/* Origin of Ichidan vs Godan Names */}
        <Card className="border-2 border-purple-500 bg-purple-50 dark:bg-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Why "Ichidan" (一段) and "Godan" (五段)?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              These names describe <strong>how many vowel rows</strong> each verb type uses when conjugating.
              This is a natural pattern that evolved in Japanese over 1000+ years - linguists just observed and named it!
            </p>

            {/* Godan Explanation */}
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border-2 border-blue-500">
                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-2">
                  Godan (五段動詞) = "Five-step verbs"
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  五 (go) = five | 段 (dan) = step/level<br/>
                  These verbs <strong>step through all 5 vowel rows</strong> (a, i, u, e, o) when conjugating
                </p>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                  <p className="font-bold mb-3">Example: 書く (かく - to write)</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-3 p-2 bg-white dark:bg-gray-900 rounded">
                      <span className="font-mono font-bold text-orange-600 dark:text-orange-400 w-12">a-row</span>
                      <span className="font-mono flex-1">書か<strong className="text-orange-600 dark:text-orange-400">ない</strong></span>
                      <span className="font-mono flex-1">かか<strong className="text-orange-600 dark:text-orange-400">ない</strong></span>
                      <span className="text-muted-foreground flex-1">Negative (don't write)</span>
                    </div>
                    <div className="flex items-start gap-3 p-2 bg-white dark:bg-gray-900 rounded">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 w-12">i-row</span>
                      <span className="font-mono flex-1">書き<strong className="text-blue-600 dark:text-blue-400">ます</strong></span>
                      <span className="font-mono flex-1">かき<strong className="text-blue-600 dark:text-blue-400">ます</strong></span>
                      <span className="text-muted-foreground flex-1">Polite (write)</span>
                    </div>
                    <div className="flex items-start gap-3 p-2 bg-white dark:bg-gray-900 rounded">
                      <span className="font-mono font-bold text-green-600 dark:text-green-400 w-12">u-row</span>
                      <span className="font-mono flex-1">書<strong className="text-green-600 dark:text-green-400">く</strong></span>
                      <span className="font-mono flex-1">か<strong className="text-green-600 dark:text-green-400">く</strong></span>
                      <span className="text-muted-foreground flex-1">Dictionary form (to write)</span>
                    </div>
                    <div className="flex items-start gap-3 p-2 bg-white dark:bg-gray-900 rounded">
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400 w-12">e-row</span>
                      <span className="font-mono flex-1">書け<strong className="text-purple-600 dark:text-purple-400">ば</strong></span>
                      <span className="font-mono flex-1">かけ<strong className="text-purple-600 dark:text-purple-400">ば</strong></span>
                      <span className="text-muted-foreground flex-1">Conditional (if you write)</span>
                    </div>
                    <div className="flex items-start gap-3 p-2 bg-white dark:bg-gray-900 rounded">
                      <span className="font-mono font-bold text-pink-600 dark:text-pink-400 w-12">o-row</span>
                      <span className="font-mono flex-1">書こ<strong className="text-pink-600 dark:text-pink-400">う</strong></span>
                      <span className="font-mono flex-1">かこ<strong className="text-pink-600 dark:text-pink-400">う</strong></span>
                      <span className="text-muted-foreground flex-1">Volitional (let's write)</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-bold text-blue-600 dark:text-blue-400">
                    → See? It "steps through" all 5 vowel rows: か→き→く→け→こ (a→i→u→e→o) → 五段!
                  </p>
                </div>
              </div>
            </div>

            {/* Ichidan Explanation */}
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border-2 border-green-500">
                <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
                  Ichidan (一段動詞) = "One-step verbs"
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  一 (ichi) = one | 段 (dan) = step/level<br/>
                  These verbs use <strong>only 1 vowel row</strong> - the stem NEVER changes!
                </p>

                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <p className="font-bold mb-3">Example: 食べる (たべる - to eat)</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-3 p-2 bg-white dark:bg-gray-900 rounded">
                      <span className="font-mono flex-1">食べ<strong>ない</strong></span>
                      <span className="font-mono flex-1">たべ<strong>ない</strong></span>
                      <span className="text-muted-foreground flex-1">Negative (don't eat)</span>
                      <span className="text-green-600 dark:text-green-400 text-xs">stem: たべ</span>
                    </div>
                    <div className="flex items-start gap-3 p-2 bg-white dark:bg-gray-900 rounded">
                      <span className="font-mono flex-1">食べ<strong>ます</strong></span>
                      <span className="font-mono flex-1">たべ<strong>ます</strong></span>
                      <span className="text-muted-foreground flex-1">Polite (eat)</span>
                      <span className="text-green-600 dark:text-green-400 text-xs">stem: たべ</span>
                    </div>
                    <div className="flex items-start gap-3 p-2 bg-white dark:bg-gray-900 rounded">
                      <span className="font-mono flex-1">食べ<strong>る</strong></span>
                      <span className="font-mono flex-1">たべ<strong>る</strong></span>
                      <span className="text-muted-foreground flex-1">Dictionary form (to eat)</span>
                      <span className="text-green-600 dark:text-green-400 text-xs">stem: たべ</span>
                    </div>
                    <div className="flex items-start gap-3 p-2 bg-white dark:bg-gray-900 rounded">
                      <span className="font-mono flex-1">食べ<strong>れば</strong></span>
                      <span className="font-mono flex-1">たべ<strong>れば</strong></span>
                      <span className="text-muted-foreground flex-1">Conditional (if you eat)</span>
                      <span className="text-green-600 dark:text-green-400 text-xs">stem: たべ</span>
                    </div>
                    <div className="flex items-start gap-3 p-2 bg-white dark:bg-gray-900 rounded">
                      <span className="font-mono flex-1">食べ<strong>よう</strong></span>
                      <span className="font-mono flex-1">たべ<strong>よう</strong></span>
                      <span className="text-muted-foreground flex-1">Volitional (let's eat)</span>
                      <span className="text-green-600 dark:text-green-400 text-xs">stem: たべ</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-bold text-green-600 dark:text-green-400">
                    → The stem <strong>たべ</strong> never changes! Only uses one vowel pattern → 一段!
                  </p>
                </div>
              </div>
            </div>

            {/* When to use each form */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-4 rounded-lg border-2">
              <h3 className="text-lg font-bold mb-3">📚 When to Use Each Form:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-white dark:bg-gray-900 rounded">
                  <p className="font-bold mb-1">Negative (ない)</p>
                  <p className="text-muted-foreground">Used to say "don't/doesn't/won't"</p>
                  <p className="text-xs mt-1 font-mono">食べない = don't eat</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-900 rounded">
                  <p className="font-bold mb-1">Polite (ます)</p>
                  <p className="text-muted-foreground">Standard polite present/future</p>
                  <p className="text-xs mt-1 font-mono">食べます = eat (polite)</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-900 rounded">
                  <p className="font-bold mb-1">Dictionary (u-row)</p>
                  <p className="text-muted-foreground">Base form, used in casual speech</p>
                  <p className="text-xs mt-1 font-mono">食べる = to eat</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-900 rounded">
                  <p className="font-bold mb-1">Conditional (ば)</p>
                  <p className="text-muted-foreground">Express "if" conditions</p>
                  <p className="text-xs mt-1 font-mono">食べれば = if you eat</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-900 rounded col-span-1 md:col-span-2">
                  <p className="font-bold mb-1">Volitional (う/よう)</p>
                  <p className="text-muted-foreground">Express intention, suggestion "let's..."</p>
                  <p className="text-xs mt-1 font-mono">食べよう = let's eat | 書こう = let's write</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 rounded-lg border-2">
              <p className="font-bold text-lg mb-2">💡 Key Takeaway:</p>
              <p className="text-sm text-muted-foreground">
                Nobody "decided" which verbs are ichidan vs godan - this is just how Japanese naturally evolved!
                Verbs themselves determine their group based on how they conjugate.
                Linguists observed these patterns and gave them descriptive names:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground ml-4">
                <li><strong>五段 (godan)</strong> = uses 5 vowel rows when conjugating</li>
                <li><strong>一段 (ichidan)</strong> = uses 1 vowel row (stem never changes)</li>
              </ul>
            </div>
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

        {/* How to Identify Ichidan vs Godan from Masu Form */}
        <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔍 How to Identify Ichidan vs Godan from Masu Form
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border-2">
              <p className="font-bold text-lg mb-3">Quick Identification Guide:</p>

              <div className="space-y-3 text-sm">
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded border border-green-300">
                  <p className="font-bold text-green-700 dark:text-green-400">✓ Ends in -えます? → ICHIDAN (99% certain!)</p>
                  <p className="text-muted-foreground ml-4">Examples: たべます, みせます, おしえます, かんがえます</p>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-300">
                  <p className="font-bold text-blue-700 dark:text-blue-400">✓ Ends in -きます/-ぎます/-します/-ちます/-びます? → GODAN</p>
                  <p className="text-muted-foreground ml-4">Examples: かきます, およぎます, はなします, まちます, あそびます</p>
                </div>

                <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded border border-orange-300">
                  <p className="font-bold text-orange-700 dark:text-orange-400">⚠️ Ends in -います/-ります/-みます? → COULD BE EITHER!</p>
                  <p className="text-muted-foreground ml-4">Ichidan: みます (see), おきます (wake up)</p>
                  <p className="text-muted-foreground ml-4">Godan: のみます (drink), かえります (return)</p>
                  <p className="text-red-600 dark:text-red-400 ml-4 mt-2 font-semibold">→ You must memorize which is which!</p>
                </div>
              </div>
            </div>

            {/* All Ichidan Verbs Ending in -i */}
            <div className="space-y-2">
              <p className="font-semibold text-xl text-green-600 dark:text-green-400">📋 ALL Ichidan Verbs Ending in -います (9 verbs)</p>
              <p className="text-sm text-muted-foreground">These are the ONLY ichidan verbs in N5 that end in -i sound. Memorize them!</p>

              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border-2 border-green-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-300 dark:border-green-700">
                    <p className="font-mono text-sm font-bold mb-1">います → いる</p>
                    <p className="text-xs text-muted-foreground">exist; be (animate)</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-300 dark:border-green-700">
                    <p className="font-mono text-sm font-bold mb-1">おきます → おきる</p>
                    <p className="text-xs text-muted-foreground">get up, wake up</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-300 dark:border-green-700">
                    <p className="font-mono text-sm font-bold mb-1">きます → きる</p>
                    <p className="text-xs text-muted-foreground">wear; put on (shirt)</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-300 dark:border-green-700">
                    <p className="font-mono text-sm font-bold mb-1">できます → できる</p>
                    <p className="text-xs text-muted-foreground">be able to, can</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-300 dark:border-green-700">
                    <p className="font-mono text-sm font-bold mb-1">あびます → あびる</p>
                    <p className="text-xs text-muted-foreground">take (shower/bath)</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-300 dark:border-green-700">
                    <p className="font-mono text-sm font-bold mb-1">みます → みる</p>
                    <p className="text-xs text-muted-foreground">see, look at, watch</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-300 dark:border-green-700">
                    <p className="font-mono text-sm font-bold mb-1">おります → おりる</p>
                    <p className="text-xs text-muted-foreground">get off</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-300 dark:border-green-700">
                    <p className="font-mono text-sm font-bold mb-1">かります → かりる</p>
                    <p className="text-xs text-muted-foreground">borrow</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-300 dark:border-green-700">
                    <p className="font-mono text-sm font-bold mb-1">たります → たりる</p>
                    <p className="text-xs text-muted-foreground">be enough, be sufficient</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                  <p className="text-sm font-bold">💡 Key Point:</p>
                  <p className="text-sm text-muted-foreground">All other ichidan verbs (30 verbs) end in -えます, which are easy to identify!</p>
                  <p className="text-sm text-muted-foreground mt-2">So you only need to memorize these 9 exception verbs ending in -います.</p>
                </div>
              </div>
            </div>

            {/* Godan verbs ending in -iru for comparison */}
            <div className="space-y-2">
              <p className="font-semibold text-xl text-red-600 dark:text-red-400">🚨 Godan Verbs Ending in -います (8 verbs - Don't confuse!)</p>
              <p className="text-sm text-muted-foreground">These look similar to ichidan but are actually GODAN:</p>

              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border-2 border-red-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-300 dark:border-red-700">
                    <p className="font-mono text-sm font-bold mb-1">かえります → かえる</p>
                    <p className="text-xs text-muted-foreground">return home (GODAN!)</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-300 dark:border-red-700">
                    <p className="font-mono text-sm font-bold mb-1">はいります → はいる</p>
                    <p className="text-xs text-muted-foreground">enter (GODAN!)</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-300 dark:border-red-700">
                    <p className="font-mono text-sm font-bold mb-1">はしります → はしる</p>
                    <p className="text-xs text-muted-foreground">run (GODAN!)</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-300 dark:border-red-700">
                    <p className="font-mono text-sm font-bold mb-1">きります → きる</p>
                    <p className="text-xs text-muted-foreground">cut (GODAN!)</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-300 dark:border-red-700">
                    <p className="font-mono text-sm font-bold mb-1">しります → しる</p>
                    <p className="text-xs text-muted-foreground">know (GODAN!)</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-300 dark:border-red-700">
                    <p className="font-mono text-sm font-bold mb-1">いります → いる</p>
                    <p className="text-xs text-muted-foreground">need (GODAN!)</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-300 dark:border-red-700">
                    <p className="font-mono text-sm font-bold mb-1">しゃべります → しゃべる</p>
                    <p className="text-xs text-muted-foreground">chat (GODAN!)</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-300 dark:border-red-700">
                    <p className="font-mono text-sm font-bold mb-1">けります → ける</p>
                    <p className="text-xs text-muted-foreground">kick (GODAN!)</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                  <p className="text-sm font-bold">💡 How to Remember:</p>
                  <p className="text-sm text-muted-foreground">Just memorize these 8 godan exceptions. All other -います verbs will be either:</p>
                  <p className="text-sm text-muted-foreground ml-4 mt-1">• On the ichidan list above (9 verbs), OR</p>
                  <p className="text-sm text-muted-foreground ml-4">• Obviously godan (のみます, かきます, etc.)</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-4 rounded-lg border-2">
              <p className="font-bold text-lg mb-2">✅ Summary:</p>
              <div className="space-y-2 text-sm">
                <p><strong>1.</strong> If masu form ends in <strong>-えます</strong> → Ichidan (easy!)</p>
                <p><strong>2.</strong> If masu form ends in <strong>-きます/-ぎます/-します/-ちます/-びます</strong> → Godan (easy!)</p>
                <p><strong>3.</strong> If masu form ends in <strong>-います/-ります/-みます</strong> → Check the lists:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                  <li>9 ichidan verbs ending in -います (green cards above)</li>
                  <li>8 godan verbs ending in -います (red cards above)</li>
                  <li>Everything else is godan with obvious patterns</li>
                </ul>
              </div>
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
