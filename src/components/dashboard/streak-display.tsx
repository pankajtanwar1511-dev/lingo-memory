"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGoalsStore } from "@/store/goals-store"
import { useQuizStore } from "@/store/quiz-store"
import { Flame, Calendar, TrendingUp, Award, Zap } from "lucide-react"
import { useMemo } from "react"

interface StreakDisplayProps {
  compact?: boolean
}

export function StreakDisplay({ compact = false }: StreakDisplayProps) {
  const { getStreak, getTodayProgress, dailyGoal, progressHistory } = useGoalsStore()
  const { statistics } = useQuizStore()

  const currentStreak = getStreak()
  const todayProgress = getTodayProgress()

  // Calculate best streak from history
  const bestStreak = useMemo(() => {
    let maxStreak = 0
    let tempStreak = 0
    const sortedHistory = [...progressHistory].sort((a, b) => a.date.localeCompare(b.date))

    for (let i = 0; i < sortedHistory.length; i++) {
      if (sortedHistory[i].goalMet) {
        tempStreak++
        maxStreak = Math.max(maxStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    return Math.max(maxStreak, currentStreak)
  }, [progressHistory, currentStreak])

  // Check if at risk (haven't completed goal today)
  const isAtRisk = currentStreak > 0 && !todayProgress.goalMet

  // Get streak status
  const getStreakStatus = () => {
    if (currentStreak === 0) {
      return {
        icon: Flame,
        color: "text-gray-400",
        bgColor: "bg-gray-100 dark:bg-gray-800",
        borderColor: "border-gray-200 dark:border-gray-700",
        message: "Start your first streak today!"
      }
    }

    if (isAtRisk) {
      return {
        icon: Flame,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-950/20",
        borderColor: "border-orange-200 dark:border-orange-800",
        message: "Complete today's goal to maintain your streak!"
      }
    }

    if (currentStreak >= 30) {
      return {
        icon: Award,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950/20",
        borderColor: "border-purple-200 dark:border-purple-800",
        message: "Legendary streak! You're unstoppable!"
      }
    }

    if (currentStreak >= 7) {
      return {
        icon: Zap,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        message: "Amazing consistency! Keep it up!"
      }
    }

    return {
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      message: "Great start! Build your habit!"
    }
  }

  const status = getStreakStatus()
  const Icon = status.icon

  if (compact) {
    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg border ${status.bgColor} ${status.borderColor}`}>
        <Icon className={`h-5 w-5 ${status.color}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${status.color}`}>
              {currentStreak} Day{currentStreak !== 1 ? "s" : ""}
            </span>
            {bestStreak > currentStreak && (
              <Badge variant="outline" className="text-xs">
                Best: {bestStreak}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Current Streak</p>
        </div>
        {isAtRisk && (
          <Badge variant="destructive" className="text-xs">
            At Risk!
          </Badge>
        )}
      </div>
    )
  }

  return (
    <Card className={`p-6 border-2 ${status.borderColor} ${status.bgColor}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${status.bgColor} border ${status.borderColor}`}>
            <Icon className={`h-6 w-6 ${status.color}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Learning Streak</h3>
            <p className="text-sm text-muted-foreground">{status.message}</p>
          </div>
        </div>
        {isAtRisk && (
          <Badge variant="destructive" className="gap-1">
            At Risk!
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Current Streak */}
        <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg border">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className={`h-5 w-5 ${status.color}`} />
            <span className={`text-3xl font-bold ${status.color}`}>
              {currentStreak}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Current Streak</p>
          <p className="text-xs text-muted-foreground mt-1">
            {currentStreak === 1 ? "day" : "days"}
          </p>
        </div>

        {/* Best Streak */}
        <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg border">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="h-5 w-5 text-blue-600" />
            <span className="text-3xl font-bold text-blue-600">
              {bestStreak}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Best Streak</p>
          <p className="text-xs text-muted-foreground mt-1">
            {bestStreak === 1 ? "day" : "days"}
          </p>
        </div>
      </div>

      {/* Progress towards today's goal */}
      {currentStreak > 0 && !todayProgress.goalMet && (
        <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Today's Progress</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Questions</span>
              <span>
                {todayProgress.questionsAnswered} / {dailyGoal.questionsGoal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quizzes</span>
              <span>
                {todayProgress.quizzesCompleted} / {dailyGoal.quizzesGoal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Accuracy</span>
              <span>
                {Math.round(todayProgress.averageAccuracy)}% /{" "}
                {dailyGoal.accuracyGoal}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Motivational message */}
      {currentStreak === 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Tip:</strong> Complete your daily goal to start building a streak.
            Consistency is key to language learning success!
          </p>
        </div>
      )}

      {currentStreak >= 3 && currentStreak < 7 && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>You're on fire!</strong> Just {7 - currentStreak} more{" "}
            {7 - currentStreak === 1 ? "day" : "days"} to reach a week streak!
          </p>
        </div>
      )}
    </Card>
  )
}
