"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGoalsStore } from "@/store/goals-store"
import { Target, TrendingUp, Award, Settings, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface DailyGoalsProps {
  showSettings?: boolean
}

export function DailyGoals({ showSettings = false }: DailyGoalsProps) {
  const {
    dailyGoal,
    getTodayProgress,
    setDailyGoal,
    getStreak
  } = useGoalsStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editGoal, setEditGoal] = useState(dailyGoal)

  const todayProgress = getTodayProgress()
  const streak = getStreak()

  // Calculate progress percentages
  const questionsProgress = Math.min(
    (todayProgress.questionsAnswered / dailyGoal.questionsGoal) * 100,
    100
  )
  const quizzesProgress = Math.min(
    (todayProgress.quizzesCompleted / dailyGoal.quizzesGoal) * 100,
    100
  )
  const accuracyProgress = Math.min(
    (todayProgress.averageAccuracy / dailyGoal.accuracyGoal) * 100,
    100
  )

  const overallProgress = (questionsProgress + quizzesProgress + accuracyProgress) / 3

  const handleSaveGoal = () => {
    setDailyGoal(editGoal)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Edit Daily Goals</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Questions per day
            </label>
            <input
              type="number"
              min="5"
              max="100"
              value={editGoal.questionsGoal}
              onChange={(e) =>
                setEditGoal({
                  ...editGoal,
                  questionsGoal: parseInt(e.target.value) || 20
                })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Quizzes per day
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={editGoal.quizzesGoal}
              onChange={(e) =>
                setEditGoal({
                  ...editGoal,
                  quizzesGoal: parseInt(e.target.value) || 1
                })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Target accuracy (%)
            </label>
            <input
              type="number"
              min="50"
              max="100"
              value={editGoal.accuracyGoal}
              onChange={(e) =>
                setEditGoal({
                  ...editGoal,
                  accuracyGoal: parseInt(e.target.value) || 70
                })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSaveGoal} className="flex-1">
              Save Goals
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditGoal(dailyGoal)
                setIsEditing(false)
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Daily Goals</h3>
          {todayProgress.goalMet && (
            <Badge variant="gradient" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Complete!
            </Badge>
          )}
        </div>
        {showSettings && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm text-muted-foreground">
            {Math.round(overallProgress)}%
          </span>
        </div>
        <Progress value={overallProgress} className="h-3" />
      </div>

      {/* Individual Goals */}
      <div className="space-y-4">
        {/* Questions Goal */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Questions Answered</span>
            <span className="text-sm text-muted-foreground">
              {todayProgress.questionsAnswered} / {dailyGoal.questionsGoal}
            </span>
          </div>
          <Progress value={questionsProgress} className="h-2" />
        </div>

        {/* Quizzes Goal */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Quizzes Completed</span>
            <span className="text-sm text-muted-foreground">
              {todayProgress.quizzesCompleted} / {dailyGoal.quizzesGoal}
            </span>
          </div>
          <Progress value={quizzesProgress} className="h-2" />
        </div>

        {/* Accuracy Goal */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Average Accuracy</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(todayProgress.averageAccuracy)}% (goal: {dailyGoal.accuracyGoal}%)
            </span>
          </div>
          <Progress value={accuracyProgress} className="h-2" />
        </div>
      </div>

      {/* Streak Display */}
      {streak > 0 && (
        <div className="mt-6 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                {streak} Day Streak!
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                Keep it up! Complete today's goal to continue your streak.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Motivation */}
      {!todayProgress.goalMet && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Tip:</strong>{" "}
            {questionsProgress < 50
              ? `${dailyGoal.questionsGoal - todayProgress.questionsAnswered} more questions to reach your goal!`
              : quizzesProgress < 100
              ? "Almost there! Complete one more quiz."
              : accuracyProgress < 100
              ? "Focus on accuracy to meet your daily goal."
              : "Great job! Keep going!"}
          </p>
        </div>
      )}
    </Card>
  )
}
