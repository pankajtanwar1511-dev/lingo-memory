"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QuizResult } from "@/types/quiz"
import {
  Trophy,
  Target,
  Clock,
  Award,
  Check,
  X,
  SkipForward,
  RotateCcw,
  Home,
  TrendingUp
} from "lucide-react"

interface QuizResultsProps {
  result: QuizResult
  onRetry: () => void
  onNewQuiz: () => void
  onViewProgress: () => void
  onReviewMistakes?: () => void
}

export function QuizResults({
  result,
  onRetry,
  onNewQuiz,
  onViewProgress,
  onReviewMistakes
}: QuizResultsProps) {
  // Trigger confetti for high scores
  useEffect(() => {
    const triggerConfetti = async () => {
      if (result.score >= 90) {
        // Dynamically import confetti library
        const confetti = (await import("canvas-confetti")).default

        if (result.score === 100) {
          // Perfect score - golden confetti
          confetti({
            particleCount: 200,
            spread: 160,
            origin: { y: 0.6 },
            colors: ["#FFD700", "#FFA500", "#FF8C00"],
            scalar: 1.2
          })
        } else {
          // High score - regular confetti
          confetti({
            particleCount: 150,
            spread: 120,
            origin: { y: 0.6 }
          })
        }
      }
    }

    triggerConfetti()
  }, [result.score])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return minutes > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${remainingSeconds}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: "Excellent!", color: "bg-green-600" }
    if (score >= 70) return { label: "Good Job!", color: "bg-yellow-600" }
    if (score >= 50) return { label: "Keep Practicing", color: "bg-orange-600" }
    return { label: "Try Again", color: "bg-red-600" }
  }

  const scoreBadge = getScoreBadge(result.score)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${scoreBadge.color} text-white font-semibold mb-4`}>
          <Trophy className="h-5 w-5" />
          {scoreBadge.label}
        </div>
        <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's how you performed
        </p>
      </div>

      {/* Score Card */}
      <Card className="p-8 text-center">
        <div className={`text-7xl font-bold ${getScoreColor(result.score)} mb-2`}>
          {Math.round(result.score)}%
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Your Score
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {result.correctAnswers} out of {result.questions.length} correct
        </p>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Check className="h-5 w-5 text-green-600" />}
          label="Correct"
          value={result.correctAnswers}
          color="green"
        />
        <StatCard
          icon={<X className="h-5 w-5 text-red-600" />}
          label="Incorrect"
          value={result.incorrectAnswers}
          color="red"
        />
        <StatCard
          icon={<SkipForward className="h-5 w-5 text-gray-600" />}
          label="Skipped"
          value={result.skippedAnswers}
          color="gray"
        />
        <StatCard
          icon={<Award className="h-5 w-5 text-purple-600" />}
          label="Perfect"
          value={result.perfectAnswers}
          color="purple"
        />
      </div>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Performance Metrics</h3>
        <div className="space-y-4">
          <MetricRow
            icon={<Target className="h-5 w-5" />}
            label="Accuracy"
            value={`${Math.round(result.accuracy)}%`}
            description="Percentage of answered questions correct"
          />
          <MetricRow
            icon={<Clock className="h-5 w-5" />}
            label="Total Time"
            value={formatTime(result.totalTime)}
            description="Time spent on quiz"
          />
          <MetricRow
            icon={<TrendingUp className="h-5 w-5" />}
            label="Avg Time/Question"
            value={formatTime(result.averageTimePerQuestion)}
            description="Average time per question"
          />
        </div>
      </Card>

      {/* Question Review */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Question Review</h3>
        <div className="space-y-3">
          {result.questions.map((question, index) => {
            const answer = result.answers[index]
            if (!answer) return null

            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg border ${
                  answer.isCorrect
                    ? "border-green-200 bg-green-50 dark:bg-green-950/20"
                    : answer.userAnswer === ""
                    ? "border-gray-200 bg-gray-50 dark:bg-gray-900"
                    : "border-red-200 bg-red-50 dark:bg-red-950/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    answer.isCorrect
                      ? "bg-green-600"
                      : answer.userAnswer === ""
                      ? "bg-gray-600"
                      : "bg-red-600"
                  } text-white`}>
                    {answer.isCorrect ? (
                      <Check className="h-4 w-4" />
                    ) : answer.userAnswer === "" ? (
                      <SkipForward className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-medium">
                        {index + 1}. {question.question}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {formatTime(answer.timeSpent)}
                      </Badge>
                    </div>

                    {answer.userAnswer && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-medium">Your answer:</span> {answer.userAnswer}
                      </div>
                    )}

                    {!answer.isCorrect && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Correct answer:</span>{" "}
                        {Array.isArray(question.correctAnswer)
                          ? question.correctAnswer.join(" or ")
                          : question.correctAnswer}
                      </div>
                    )}

                    {answer.hintsUsed > 0 && (
                      <Badge variant="secondary" className="text-xs mt-2">
                        {answer.hintsUsed} hint{answer.hintsUsed > 1 ? "s" : ""} used
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onNewQuiz}
          className="flex-1 gap-2"
        >
          <Home className="h-4 w-4" />
          New Quiz
        </Button>
        <Button
          variant="outline"
          onClick={onRetry}
          className="flex-1 gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Retry Quiz
        </Button>
        {result.incorrectQuestionDetails && result.incorrectQuestionDetails.length > 0 && onReviewMistakes && (
          <Button
            variant="outline"
            onClick={onReviewMistakes}
            className="flex-1 gap-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
          >
            <X className="h-4 w-4" />
            Review Mistakes ({result.incorrectQuestionDetails.length})
          </Button>
        )}
        <Button
          onClick={onViewProgress}
          className="flex-1 gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          View Progress
        </Button>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  color: "green" | "red" | "gray" | "purple"
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colors = {
    green: "bg-green-100 dark:bg-green-900/20",
    red: "bg-red-100 dark:bg-red-900/20",
    gray: "bg-gray-100 dark:bg-gray-800",
    purple: "bg-purple-100 dark:bg-purple-900/20"
  }

  return (
    <Card className="p-4">
      <div className={`inline-flex p-2 rounded-lg ${colors[color]} mb-2`}>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </Card>
  )
}

interface MetricRowProps {
  icon: React.ReactNode
  label: string
  value: string
  description: string
}

function MetricRow({ icon, label, value, description }: MetricRowProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">{label}</span>
          <span className="text-lg font-bold">{value}</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  )
}
