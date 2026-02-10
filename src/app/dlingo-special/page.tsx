"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, BookOpen, Zap, Clock, Calendar, Hash, Timer, BarChart3, Award, Table, HelpCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { loadSpecialData, getCategoryType, getCategoryWordCount } from "@/services/dlingo-special.service"
import { SpecialVocabularyData } from "@/types/dlingo-special"

export default function DlingoSpecialPage() {
  const [data, setData] = useState<SpecialVocabularyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const specialData = await loadSpecialData()
        setData(specialData)
      } catch (error) {
        console.error("Failed to load special data:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Category icons mapping
  const getCategoryIcon = (categoryName: string) => {
    if (categoryName.includes("Number")) return Hash
    if (categoryName.includes("Time Expression")) return Timer
    if (categoryName.includes("Telling Time")) return Clock
    if (categoryName.includes("Days of the Week")) return Calendar
    if (categoryName.includes("Date")) return Calendar
    if (categoryName.includes("Duration")) return Timer
    if (categoryName.includes("Period")) return BarChart3
    if (categoryName.includes("Counter")) return Award
    return BookOpen
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading special vocabulary...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 text-lg">Failed to load special vocabulary</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Header />

      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎯 Dlingo Special
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Master systematic Japanese patterns: Numbers, Time, Dates & Counters
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
              <p className="text-2xl font-bold">{data.summary.totalCategories}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Subcategories</p>
              </div>
              <p className="text-2xl font-bold">{data.summary.totalSubcategories}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Total Words</p>
              </div>
              <p className="text-2xl font-bold">{data.summary.totalVocabulary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
              <p className="text-2xl font-bold">0%</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Question Words Drill */}
          <Card className="border-2 border-blue-300 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                  <HelpCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Question Words Drill
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Master all 40 question words (なに、どこ、いつ、だれ, etc.)
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    <Badge variant="secondary" className="gap-1">
                      <HelpCircle className="h-3 w-3" />
                      40 words
                    </Badge>
                    <Badge variant="outline">JP ↔ EN</Badge>
                  </div>
                </div>
                <Link href="/dlingo-special/drill-questions" className="w-full">
                  <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 w-full">
                    <Zap className="h-5 w-5" />
                    Start Drill
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Particles Master */}
          <Card className="border-2 border-pink-300 dark:border-pink-700 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-pink-600 dark:bg-pink-500 flex items-center justify-center">
                  <span className="text-3xl">✨</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Particles Master
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Learn particles with tricks, tips, and interactive examples
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    <Badge variant="secondary">11 particles</Badge>
                    <Badge variant="outline">Interactive</Badge>
                    <Badge variant="outline">Playful</Badge>
                  </div>
                </div>
                <Link href="/dlingo-special/particles" className="w-full">
                  <Button size="lg" className="gap-2 bg-pink-600 hover:bg-pink-700 w-full">
                    <Sparkles className="h-5 w-5" />
                    Start Learning
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {data.vocabularyCategories.map((category, index) => {
            const Icon = getCategoryIcon(category.category)
            const wordCount = getCategoryWordCount(index)
            const categoryType = getCategoryType(category.category)

            return (
              <Card key={index} className="hover:shadow-xl transition-all border-2 hover:border-purple-300 dark:hover:border-purple-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.category}</CardTitle>
                        <CardDescription>
                          {category.subcategories.length} subcategories · {wordCount} words
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {categoryType}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Mastery</span>
                      <span className="font-semibold">0 / {wordCount}</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  {/* Subcategories preview */}
                  <div className="flex flex-wrap gap-1.5">
                    {category.subcategories.slice(0, 3).map((sub, subIndex) => (
                      <Badge key={subIndex} variant="secondary" className="text-xs">
                        {sub.subcategory}
                      </Badge>
                    ))}
                    {category.subcategories.length > 3 && (
                      <Badge variant="secondary" className="text-xs opacity-50">
                        +{category.subcategories.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <Link href={`/dlingo-special/learn?category=${index}`}>
                      <Button variant="default" className="w-full gap-1" size="sm">
                        <BookOpen className="h-4 w-4" />
                        Learn
                      </Button>
                    </Link>
                    <Link href={`/dlingo-special/drill?category=${index}`}>
                      <Button variant="outline" className="w-full gap-1" size="sm">
                        <Zap className="h-4 w-4" />
                        Drill
                      </Button>
                    </Link>
                    <Link href={`/dlingo-special/table?category=${index}`}>
                      <Button variant="secondary" className="w-full gap-1" size="sm">
                        <Table className="h-4 w-4" />
                        Table
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Mixed Drill Button */}
        <div className="mt-8 text-center">
          <Link href="/dlingo-special/drill">
            <Button size="lg" variant="gradient" className="gap-2">
              <Zap className="h-5 w-5" />
              Mixed Drill - All Categories
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
