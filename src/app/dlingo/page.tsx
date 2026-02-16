"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { BookMarked, Zap, ArrowRight, Sparkles, Target, Book } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function DlingoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("review")

  useEffect(() => {
    setMounted(true)
    // Get tab from URL query parameter
    const tab = searchParams.get("tab")
    if (tab === "special" || tab === "review") {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Update URL without page reload
    router.push(`/dlingo?tab=${value}`, { scroll: false })
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <BookMarked className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Dlingo Learning</h1>
              <p className="text-muted-foreground">
                Duolingo-inspired vocabulary and special learning modes
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="review" className="gap-2">
              <BookMarked className="h-4 w-4" />
              Review
            </TabsTrigger>
            <TabsTrigger value="special" className="gap-2">
              <Zap className="h-4 w-4" />
              Special
            </TabsTrigger>
          </TabsList>

          {/* Review Tab */}
          <TabsContent value="review" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookMarked className="h-5 w-5 text-primary" />
                        Vocabulary Review
                      </CardTitle>
                      <CardDescription>
                        Practice 1000+ vocabulary words with multiple view modes
                      </CardDescription>
                    </div>
                    <Badge variant="gradient">1000+ Words</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* View Modes */}
                    <Card className="border-2 hover:shadow-lg transition-all hover:scale-105">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Book className="h-5 w-5 text-blue-500" />
                          Classic Cards
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Traditional flashcard view with flip animations
                        </p>
                        <Link href="/dlingo-review">
                          <Button className="w-full group">
                            Start Review
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    <Card className="border-2 hover:shadow-lg transition-all hover:scale-105">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="h-5 w-5 text-green-500" />
                          Focused Grid
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Grid view for scanning multiple words at once
                        </p>
                        <Link href="/dlingo-review">
                          <Button variant="outline" className="w-full group">
                            Start Review
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Features List */}
                  <div className="bg-accent/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Features
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Enhanced with JMdict definitions and example sentences
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Multiple view modes: Classic cards, Flash cards, Focused grid, Single card
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Filter by word type, level, and more
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Progress tracking and spaced repetition
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Special Tab */}
          <TabsContent value="special" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Special Learning Modes
                      </CardTitle>
                      <CardDescription>
                        Focused drills for particles, counters, and special vocabulary
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Advanced</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Particles */}
                    <Card className="border-2 hover:shadow-lg transition-all hover:scale-105">
                      <CardHeader>
                        <CardTitle className="text-lg">Particles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Master は, が, を, に, で, and more
                        </p>
                        <Link href="/dlingo-special/particles">
                          <Button className="w-full group">
                            Learn
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    {/* Counters */}
                    <Card className="border-2 hover:shadow-lg transition-all hover:scale-105">
                      <CardHeader>
                        <CardTitle className="text-lg">Counters</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Learn counting systems for objects, people, time
                        </p>
                        <Link href="/dlingo-special/table">
                          <Button className="w-full group">
                            Learn
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    {/* Drills */}
                    <Card className="border-2 hover:shadow-lg transition-all hover:scale-105">
                      <CardHeader>
                        <CardTitle className="text-lg">Drills</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Intensive practice for special vocabulary
                        </p>
                        <Link href="/dlingo-special/drill">
                          <Button variant="outline" className="w-full group">
                            Start
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Visual Components */}
                  <div className="bg-accent/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Visual Learning
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Special visual components help you learn:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="text-2xl mb-1">🔢</div>
                        <div className="text-xs font-medium">Numbers</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="text-2xl mb-1">📅</div>
                        <div className="text-xs font-medium">Calendar</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="text-2xl mb-1">🕐</div>
                        <div className="text-xs font-medium">Clock</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="text-2xl mb-1">📏</div>
                        <div className="text-xs font-medium">Counters</div>
                      </div>
                    </div>
                  </div>

                  {/* Browse All Categories Button */}
                  <div className="text-center pt-4">
                    <Link href="/dlingo-special">
                      <Button size="lg" variant="gradient" className="group">
                        <Target className="mr-2 h-5 w-5" />
                        Browse All Categories
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-2">
                      View all 8 categories with 450+ special vocabulary words
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
