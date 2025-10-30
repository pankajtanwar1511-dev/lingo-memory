"use client"

import { Card } from "@/components/ui/card"
import { useQuizStore } from "@/store/quiz-store"
import { TrendingUp, Calendar } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

interface QuizLearningCurveProps {
  contentType?: "vocabulary" | "kanji"
  days?: number
}

interface ChartDataPoint {
  date: string
  score: number
  accuracy: number
  sessions: number
}

export function QuizLearningCurve({
  contentType,
  days = 30
}: QuizLearningCurveProps) {
  const { sessionHistory } = useQuizStore()

  // Filter sessions by content type if specified
  const filteredSessions = contentType
    ? sessionHistory.filter(
        (result) => result.settings.contentType === contentType
      )
    : sessionHistory

  // Generate chart data
  const chartData = generateChartData(filteredSessions, days)

  if (chartData.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data Yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {contentType
              ? `Complete some ${contentType} quizzes to see your learning curve.`
              : "Complete some quizzes to see your learning curve."}
          </p>
        </div>
      </Card>
    )
  }

  const averageScore =
    chartData.reduce((sum, point) => sum + point.score, 0) / chartData.length
  const trend = calculateTrend(chartData)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Learning Curve</h3>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-right">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Average Score
            </div>
            <div className="font-semibold text-blue-600">
              {Math.round(averageScore)}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600 dark:text-gray-400">Trend</div>
            <div
              className={`font-semibold ${
                trend > 0
                  ? "text-green-600"
                  : trend < 0
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"}{" "}
              {Math.abs(trend).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="date"
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
              label={{
                value: "Score (%)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12 }
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "12px"
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#3b82f6" }}
              activeDot={{ r: 6 }}
              name="Score"
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4, fill: "#10b981" }}
              activeDot={{ r: 6 }}
              name="Accuracy"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Tip:</strong> {trend > 5 ? "Great progress! Keep up the consistent practice." : trend > 0 ? "You're improving steadily. Keep practicing!" : trend < -5 ? "Don't worry about dips. Try reviewing weak areas and bookmarked cards." : "Maintain your current performance with regular practice."}
        </p>
      </div>
    </Card>
  )
}

/**
 * Generate chart data by aggregating quiz sessions by date
 */
function generateChartData(
  sessions: any[],
  days: number
): ChartDataPoint[] {
  // Get date range
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Group sessions by date
  const sessionsByDate = new Map<string, any[]>()

  sessions.forEach((session) => {
    const sessionDate = new Date(session.completedAt)
    if (sessionDate >= startDate && sessionDate <= endDate) {
      const dateKey = sessionDate.toISOString().split("T")[0]
      if (!sessionsByDate.has(dateKey)) {
        sessionsByDate.set(dateKey, [])
      }
      sessionsByDate.get(dateKey)!.push(session)
    }
  })

  // Calculate averages for each date
  const chartData: ChartDataPoint[] = []

  sessionsByDate.forEach((daySessions, dateKey) => {
    const avgScore =
      daySessions.reduce((sum, s) => sum + s.score, 0) / daySessions.length
    const avgAccuracy =
      daySessions.reduce((sum, s) => sum + s.accuracy, 0) / daySessions.length

    chartData.push({
      date: formatDate(dateKey),
      score: Math.round(avgScore),
      accuracy: Math.round(avgAccuracy),
      sessions: daySessions.length
    })
  })

  // Sort by date
  chartData.sort((a, b) => {
    const dateA = new Date(parseFormattedDate(a.date))
    const dateB = new Date(parseFormattedDate(b.date))
    return dateA.getTime() - dateB.getTime()
  })

  return chartData
}

/**
 * Format date as "MM/DD"
 */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

/**
 * Parse formatted date "MM/DD" back to Date (using current year)
 */
function parseFormattedDate(formattedDate: string): string {
  const [month, day] = formattedDate.split("/")
  const year = new Date().getFullYear()
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

/**
 * Calculate trend (difference between average of last 3 points vs first 3 points)
 */
function calculateTrend(data: ChartDataPoint[]): number {
  if (data.length < 2) return 0

  const recentCount = Math.min(3, Math.floor(data.length / 2))
  const recent = data.slice(-recentCount)
  const early = data.slice(0, recentCount)

  const recentAvg = recent.reduce((sum, p) => sum + p.score, 0) / recent.length
  const earlyAvg = early.reduce((sum, p) => sum + p.score, 0) / early.length

  return recentAvg - earlyAvg
}

/**
 * Custom tooltip component for recharts
 */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
        {payload[0]?.payload?.sessions && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {payload[0].payload.sessions} session{payload[0].payload.sessions > 1 ? "s" : ""}
          </p>
        )}
      </div>
    )
  }
  return null
}
