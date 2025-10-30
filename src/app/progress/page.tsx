"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  TrendingUp, Calendar, Award, Target, Brain, Clock,
  Flame, BookOpen, BarChart, Activity, Medal, Star
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/header"
import useStudyStore from "@/store/study-store"
import { CardState, FSRS } from "@/lib/fsrs"
import { cn } from "@/lib/utils"
import { useDatabase } from "@/hooks/useDatabase"
import { WeakAreasReport } from "@/components/analytics/weak-areas-report"
import { QuizLearningCurve } from "@/components/analytics/quiz-learning-curve"
import { DailyGoals } from "@/components/dashboard/daily-goals"
import { StreakDisplay } from "@/components/dashboard/streak-display"

interface DailyStats {
  date: Date
  reviews: number
  newCards: number
  minutes: number
}

export default function ProgressPage() {
  const {
    studyCards,
    stats,
    vocabulary,
    loadVocabulary,
    initializeCards,
    updateStats,
    resetProgress
  } = useStudyStore()

  const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([])
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Initialize database
  const { isInitialized } = useDatabase()

  useEffect(() => {
    if (isInitialized) {
      // Load vocabulary from database
      import('@/lib/db').then(async ({ db }) => {
        const dbVocabulary = await db.vocabulary.toArray()
        const cards = dbVocabulary.map(card => {
          const { deckId, addedAt, modifiedAt, ...vocabCard } = card
          return vocabCard as any
        })
        loadVocabulary(cards)
        updateStats()
      })

      // Generate mock weekly stats for visualization
      const mockWeekly: DailyStats[] = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        mockWeekly.push({
          date,
          reviews: Math.floor(Math.random() * 50) + 10,
          newCards: Math.floor(Math.random() * 10) + 2,
          minutes: Math.floor(Math.random() * 30) + 10
        })
      }
      setWeeklyStats(mockWeekly)
    }
  }, [isInitialized, loadVocabulary, updateStats])

  // Calculate progress metrics
  const totalCards = studyCards.length
  const learnedCards = studyCards.filter(c => c.state !== CardState.New).length
  const masteredCards = studyCards.filter(c => c.stability > 30).length // 30+ day interval
  const progressPercentage = totalCards > 0 ? (learnedCards / totalCards) * 100 : 0

  // Calculate review forecast
  const today = new Date()
  const forecast = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dueCount = studyCards.filter(card => {
      const dueDate = new Date(card.due)
      return dueDate.toDateString() === date.toDateString()
    }).length
    forecast.push({ date, count: dueCount })
  }

  // Get achievement badges
  const achievements = [
    {
      icon: Flame,
      name: "First Steps",
      description: "Complete your first review",
      unlocked: stats.totalReviews > 0,
      progress: Math.min(100, stats.totalReviews * 100)
    },
    {
      icon: Star,
      name: "Consistency",
      description: "7-day streak",
      unlocked: stats.streakDays >= 7,
      progress: Math.min(100, (stats.streakDays / 7) * 100)
    },
    {
      icon: Brain,
      name: "Quick Learner",
      description: "Learn 50 cards",
      unlocked: learnedCards >= 50,
      progress: Math.min(100, (learnedCards / 50) * 100)
    },
    {
      icon: Medal,
      name: "Master",
      description: "Master 10 cards (30+ day interval)",
      unlocked: masteredCards >= 10,
      progress: Math.min(100, (masteredCards / 10) * 100)
    }
  ]

  const handleReset = () => {
    if (showResetConfirm) {
      resetProgress()
      setShowResetConfirm(false)
    } else {
      setShowResetConfirm(true)
      setTimeout(() => setShowResetConfirm(false), 5000) // Auto-cancel after 5s
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="max-w-6xl mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Learning Progress</h1>
            <p className="text-muted-foreground">
              Track your Japanese learning journey and celebrate your achievements
            </p>
          </div>

          {/* Overview cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                    <p className="text-2xl font-bold">{stats.totalReviews}</p>
                  </div>
                  <Activity className="h-8 w-8 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-bold">{stats.streakDays} days</p>
                  </div>
                  <Flame className="h-8 w-8 text-orange-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Cards Learned</p>
                    <p className="text-2xl font-bold">{learnedCards}/{totalCards}</p>
                  </div>
                  <Brain className="h-8 w-8 text-secondary opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Retention</p>
                    <p className="text-2xl font-bold">{Math.round(stats.retention)}%</p>
                  </div>
                  <Target className="h-8 w-8 text-success opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Goals and Streak */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <DailyGoals showSettings={true} />
            <StreakDisplay />
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Overall Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>N5 Vocabulary Progress</CardTitle>
                  <CardDescription>
                    Your journey through {totalCards} vocabulary cards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {learnedCards} / {totalCards} cards learned
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">New</p>
                      <p className="text-xl font-bold text-gray-500">
                        {studyCards.filter(c => c.state === CardState.New).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Learning</p>
                      <p className="text-xl font-bold text-warning">
                        {studyCards.filter(c => c.state === CardState.Learning).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Review</p>
                      <p className="text-xl font-bold text-success">
                        {studyCards.filter(c => c.state === CardState.Review).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mastered</p>
                      <p className="text-xl font-bold text-primary">
                        {masteredCards}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>
                    Your study activity over the past week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 h-32">
                    {weeklyStats.map((day, index) => {
                      const height = (day.reviews / 50) * 100 // Normalize to percentage
                      const isToday = index === weeklyStats.length - 1
                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center gap-2"
                        >
                          <div className="relative w-full">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: index * 0.1 }}
                              className={cn(
                                "w-full rounded-t",
                                isToday
                                  ? "bg-gradient-to-t from-primary to-secondary"
                                  : "bg-muted"
                              )}
                              style={{ minHeight: height > 0 ? "4px" : "0" }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {day.date.toLocaleDateString("en", { weekday: "short" })}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Today</p>
                      <p className="text-lg font-semibold">{stats.todayReviews} reviews</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time spent</p>
                      <p className="text-lg font-semibold">{Math.round(stats.todayMinutes)} min</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average</p>
                      <p className="text-lg font-semibold">
                        {stats.todayReviews > 0
                          ? Math.round((stats.todayMinutes / stats.todayReviews) * 60)
                          : 0}s/card
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forecast" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review Forecast</CardTitle>
                  <CardDescription>
                    Expected reviews for the next 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {forecast.map((day, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-24 text-sm">
                          {index === 0 ? "Today" :
                           index === 1 ? "Tomorrow" :
                           day.date.toLocaleDateString("en", { weekday: "long" })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={day.count > 0 ? Math.min((day.count / 20) * 100, 100) : 0}
                              className="flex-1"
                            />
                            <span className="text-sm font-medium w-12 text-right">
                              {day.count}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Pro tip:</strong> Consistent daily reviews lead to better long-term retention.
                      Try to review all due cards each day to maintain your streak!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "relative overflow-hidden",
                      achievement.unlocked && "border-primary"
                    )}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-3 rounded-full",
                            achievement.unlocked
                              ? "bg-gradient-to-r from-primary to-secondary"
                              : "bg-muted"
                          )}>
                            <achievement.icon className={cn(
                              "h-6 w-6",
                              achievement.unlocked ? "text-white" : "text-muted-foreground"
                            )} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{achievement.name}</CardTitle>
                            <CardDescription>{achievement.description}</CardDescription>
                          </div>
                          {achievement.unlocked && (
                            <Badge variant="gradient">Unlocked!</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Progress value={achievement.progress} className="h-2" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Statistics</CardTitle>
                  <CardDescription>
                    In-depth analysis of your learning patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Study Habits</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total study time</span>
                          <span className="text-sm font-medium">
                            {Math.round(stats.todayMinutes)} minutes today
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Average session</span>
                          <span className="text-sm font-medium">15-20 minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Best time</span>
                          <span className="text-sm font-medium">Morning (9-11 AM)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Performance</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Retention rate</span>
                          <span className="text-sm font-medium">{Math.round(stats.retention)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Cards per day</span>
                          <span className="text-sm font-medium">
                            {Math.round(stats.totalReviews / Math.max(1, stats.streakDays))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Mature cards</span>
                          <span className="text-sm font-medium">{masteredCards}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Reset Progress</p>
                        <p className="text-sm text-muted-foreground">
                          Clear all learning data and start fresh
                        </p>
                      </div>
                      <Button
                        variant={showResetConfirm ? "destructive" : "outline"}
                        onClick={handleReset}
                      >
                        {showResetConfirm ? "Confirm Reset" : "Reset All"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quiz Analytics */}
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold mb-4">Quiz Analytics</h2>

            {/* Learning Curve */}
            <QuizLearningCurve days={30} />

            {/* Weak Areas Report */}
            <WeakAreasReport limit={10} />
          </div>

          {/* Call to action */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Ready to continue learning?</h3>
                  <p className="text-sm text-muted-foreground">
                    You have {studyCards.filter(c => c.due <= new Date()).length} cards due for review
                  </p>
                </div>
                <Link href="/study">
                  <Button variant="gradient">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Study Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}