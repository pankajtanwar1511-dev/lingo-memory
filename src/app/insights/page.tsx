"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Trophy, BarChart3, TrendingUp, Calendar, Target, Flame, BookOpen, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

export default function InsightsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("progress")

  useEffect(() => {
    setMounted(true)
    const tab = searchParams.get("view")
    if (tab === "analytics" || tab === "progress") {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/insights?view=${value}`, { scroll: false })
  }

  // Mock data
  const progressData = {
    totalCards: 245,
    masteredCards: 180,
    learningCards: 45,
    newCards: 20,
    currentStreak: 7,
    longestStreak: 15,
    totalStudyDays: 42,
    accuracy: 92
  }

  const weeklyActivity = [
    { day: "Mon", cards: 25 },
    { day: "Tue", cards: 30 },
    { day: "Wed", cards: 20 },
    { day: "Thu", cards: 35 },
    { day: "Fri", cards: 28 },
    { day: "Sat", cards: 22 },
    { day: "Sun", cards: 18 }
  ]

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
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Learning Insights</h1>
              <p className="text-muted-foreground">
                Track your progress and analyze your learning patterns
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="progress" className="gap-2">
              <Trophy className="h-4 w-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium text-muted-foreground">Total Cards</span>
                    </div>
                    <div className="text-3xl font-bold">{progressData.totalCards}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-muted-foreground">Mastered</span>
                    </div>
                    <div className="text-3xl font-bold">{progressData.masteredCards}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <span className="text-sm font-medium text-muted-foreground">Streak</span>
                    </div>
                    <div className="text-3xl font-bold">{progressData.currentStreak}d</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
                    </div>
                    <div className="text-3xl font-bold">{progressData.accuracy}%</div>
                  </CardContent>
                </Card>
              </div>

              {/* Learning Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>Your card mastery breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Mastered</span>
                      <span className="text-sm text-muted-foreground">{progressData.masteredCards} cards</span>
                    </div>
                    <Progress
                      value={(progressData.masteredCards / progressData.totalCards) * 100}
                      className="h-3"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Learning</span>
                      <span className="text-sm text-muted-foreground">{progressData.learningCards} cards</span>
                    </div>
                    <Progress
                      value={(progressData.learningCards / progressData.totalCards) * 100}
                      className="h-3"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">New</span>
                      <span className="text-sm text-muted-foreground">{progressData.newCards} cards</span>
                    </div>
                    <Progress
                      value={(progressData.newCards / progressData.totalCards) * 100}
                      className="h-3"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Study Streaks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Study Streaks
                  </CardTitle>
                  <CardDescription>Keep the momentum going!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-accent rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Current Streak</div>
                      <div className="text-2xl font-bold">{progressData.currentStreak} days</div>
                    </div>
                    <div className="p-4 bg-accent rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Longest Streak</div>
                      <div className="text-2xl font-bold">{progressData.longestStreak} days</div>
                    </div>
                    <div className="p-4 bg-accent rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Total Study Days</div>
                      <div className="text-2xl font-bold">{progressData.totalStudyDays} days</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Weekly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Weekly Activity
                  </CardTitle>
                  <CardDescription>Cards studied this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 h-48">
                    {weeklyActivity.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-accent rounded-t-lg transition-all hover:bg-primary/20 relative">
                          <div
                            className="bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all"
                            style={{ height: `${(item.cards / 35) * 180}px` }}
                          />
                        </div>
                        <div className="text-sm font-medium">{item.day}</div>
                        <div className="text-xs text-muted-foreground">{item.cards}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Performance Trends
                    </CardTitle>
                    <CardDescription>Your learning curve over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Accuracy</span>
                        <Badge variant="success">{progressData.accuracy}%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cards/Day Average</span>
                        <Badge variant="default">23 cards</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Study Time Average</span>
                        <Badge variant="secondary">18 min</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Goals & Milestones
                    </CardTitle>
                    <CardDescription>Track your achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">7-Day Streak</span>
                        <Badge variant="success">✓ Completed</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">100 Cards Mastered</span>
                        <Badge variant="success">✓ Completed</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">500 Cards Total</span>
                        <Badge variant="secondary">49% (245/500)</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Statistics</CardTitle>
                  <CardDescription>Comprehensive learning metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Total Reviews</div>
                      <div className="text-2xl font-bold">1,234</div>
                      <div className="text-xs text-green-600 mt-1">+15% from last week</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Time Studied</div>
                      <div className="text-2xl font-bold">12.5h</div>
                      <div className="text-xs text-green-600 mt-1">+2.3h from last week</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Best Day</div>
                      <div className="text-2xl font-bold">Thursday</div>
                      <div className="text-xs text-muted-foreground mt-1">Avg 35 cards/day</div>
                    </div>
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
