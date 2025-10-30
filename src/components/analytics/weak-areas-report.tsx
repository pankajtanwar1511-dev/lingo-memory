"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCardStatsStore } from "@/store/card-stats-store"
import { AlertCircle, TrendingDown, Target } from "lucide-react"

interface WeakAreasReportProps {
  contentType?: "vocabulary" | "kanji"
  limit?: number
  onPracticeCard?: (cardId: string) => void
}

export function WeakAreasReport({
  contentType,
  limit = 10,
  onPracticeCard
}: WeakAreasReportProps) {
  const { getWeakestCards } = useCardStatsStore()
  const weakCards = getWeakestCards(limit, contentType)

  if (weakCards.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Target className="h-12 w-12 mx-auto text-green-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Great Job!</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {contentType
              ? `No weak areas found in ${contentType}. Keep practicing!`
              : "No weak areas found. Keep up the great work!"}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold">Weak Areas</h3>
        <Badge variant="secondary">{weakCards.length} cards</Badge>
      </div>

      <div className="space-y-3">
        {weakCards.map((stat, index) => (
          <div
            key={stat.cardId}
            className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                    #{index + 1}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {stat.contentType}
                  </Badge>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    ID: {stat.cardId}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy</div>
                    <div className={`font-semibold ${
                      stat.accuracy < 50
                        ? "text-red-600"
                        : stat.accuracy < 70
                        ? "text-orange-600"
                        : "text-yellow-600"
                    }`}>
                      {Math.round(stat.accuracy)}%
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Attempts</div>
                    <div className="font-semibold">{stat.totalAttempts}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Correct</div>
                    <div className="font-semibold text-green-600">
                      {stat.correctAttempts}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Incorrect</div>
                    <div className="font-semibold text-red-600">
                      {stat.incorrectAttempts}
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  Last reviewed: {new Date(stat.lastReviewedAt).toLocaleDateString()}
                </div>
              </div>

              {onPracticeCard && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPracticeCard(stat.cardId)}
                  className="flex-shrink-0"
                >
                  <TrendingDown className="h-4 w-4 mr-1" />
                  Practice
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {weakCards.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Tip:</strong> Focus on these cards in your next quiz session.
            Use the bookmark feature to mark them for targeted practice.
          </p>
        </div>
      )}
    </Card>
  )
}
