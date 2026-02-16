"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  BookOpen, FlaskConical, GraduationCap, Trophy, TrendingUp,
  Calendar, Flame, Target, Sparkles, ArrowRight, Clock,
  CheckCircle2, Star, Zap, BarChart3, BookMarked
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/layout/header"

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    setMounted(true)
    const now = new Date()
    setCurrentDate(now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }))
  }, [])

  // Mock data - in production, this would come from your database
  const stats = {
    todayGoal: 20,
    todayCompleted: 16,
    streak: 7,
    totalCards: 245,
    accuracy: 92,
    level: "N5"
  }

  const quickActions = [
    {
      title: "Continue Study",
      description: "20 cards due today",
      icon: BookOpen,
      href: "/study",
      color: "from-blue-500 to-cyan-500",
      badge: "20 Due",
      badgeVariant: "default" as const
    },
    {
      title: "Verb Form Master",
      description: "Practice 846 questions",
      icon: FlaskConical,
      href: "/verbs/form-master",
      color: "from-green-500 to-emerald-500",
      badge: "846 Q!",
      badgeVariant: "success" as const
    },
    {
      title: "Take a Quiz",
      description: "Test your knowledge",
      icon: GraduationCap,
      href: "/quiz",
      color: "from-purple-500 to-pink-500",
      badge: "NEW",
      badgeVariant: "default" as const
    },
    {
      title: "Learn Verbs",
      description: "141 N5 verbs with examples",
      icon: BookMarked,
      href: "/verbs",
      color: "from-orange-500 to-red-500",
      badge: null,
      badgeVariant: null
    }
  ]

  const whatsNew = [
    {
      title: "Verb Form Master - 846 Questions!",
      description: "All verb forms verified and ready to practice. Master masu, mashita, te-form, and dictionary forms with contextual examples.",
      date: "Feb 16, 2026",
      icon: FlaskConical,
      color: "text-green-500",
      href: "/verbs/form-master"
    },
    {
      title: "Enhanced Quiz System",
      description: "New LingoSpecial mode with confusable options and bidirectional questions for advanced learners.",
      date: "Feb 15, 2026",
      icon: GraduationCap,
      color: "text-purple-500",
      href: "/quiz"
    },
    {
      title: "Organized Navigation",
      description: "Navigation reorganized into 4 clear categories: Learn, Practice, Track, and System.",
      date: "Today",
      icon: Sparkles,
      color: "text-yellow-500",
      href: "#"
    }
  ]

  const recentActivity = [
    {
      title: "Verb Form Master",
      description: "Completed 25 questions with 92% accuracy",
      time: "2 hours ago",
      icon: CheckCircle2,
      color: "text-green-500"
    },
    {
      title: "N5 Flashcards",
      description: "Reviewed 15 vocabulary cards",
      time: "5 hours ago",
      icon: BookOpen,
      color: "text-blue-500"
    },
    {
      title: "Kanji Practice",
      description: "Practiced 10 kanji characters",
      time: "Yesterday",
      icon: Star,
      color: "text-yellow-500"
    }
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome back! 👋
              </h1>
              <p className="text-muted-foreground mt-2">
                {currentDate}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="gradient" className="px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                {stats.level} Level
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Today's Goal</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{stats.todayCompleted}</span>
                  <span className="text-muted-foreground">/ {stats.todayGoal}</span>
                </div>
                <Progress value={(stats.todayCompleted / stats.todayGoal) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium text-muted-foreground">Streak</span>
              </div>
              <div className="text-3xl font-bold">{stats.streak} days</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">Total Cards</span>
              </div>
              <div className="text-3xl font-bold">{stats.totalCards}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
              </div>
              <div className="text-3xl font-bold">{stats.accuracy}%</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={action.title} href={action.href as any}>
                <Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <CardContent className="pt-6">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${action.color} mb-4`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold">{action.title}</h3>
                      {action.badge && (
                        <Badge variant={action.badgeVariant} className="text-xs">
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* What's New Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle>What's New</CardTitle>
                </div>
                <CardDescription>Latest features and improvements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {whatsNew.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href as any}
                    className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className={`flex-shrink-0 ${item.color}`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold">{item.title}</h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {item.date}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}

                <div className="pt-4 border-t">
                  <Link href="/progress">
                    <Button variant="ghost" className="w-full group">
                      View All Updates
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle>Recent Activity</CardTitle>
                </div>
                <CardDescription>Your learning history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className={`flex-shrink-0 ${activity.color}`}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <Link href="/analytics">
                    <Button variant="ghost" className="w-full group">
                      View Analytics
                      <BarChart3 className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Continue Learning CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/20">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Ready to continue learning?</h3>
                    <p className="text-muted-foreground">
                      You have {stats.todayGoal - stats.todayCompleted} cards left to reach today's goal!
                    </p>
                  </div>
                </div>
                <Link href="/study">
                  <Button size="lg" variant="gradient" className="group">
                    Start Studying
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
