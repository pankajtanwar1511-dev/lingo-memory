"use client"

/**
 * Analytics Dashboard
 *
 * Comprehensive view of user progress, study patterns, and performance metrics.
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { analyticsService } from '@/services/analytics.service'
import { ProgressSnapshot, PerformanceMetrics, ActivityDataPoint } from '@/types/analytics'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, BookOpen, Flame, Clock, Target, Award, RefreshCw } from 'lucide-react'
import { Header } from '@/components/layout/header'

export default function AnalyticsPage() {
  const [snapshot, setSnapshot] = useState<ProgressSnapshot | null>(null)
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const [snapshotData, metricsData, activity] = await Promise.all([
        analyticsService.getProgressSnapshot(),
        analyticsService.getPerformanceMetrics(),
        analyticsService.getActivityData(30)
      ])

      setSnapshot(snapshotData)
      setMetrics(metricsData)
      setActivityData(activity)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!snapshot || !metrics) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No analytics data available yet. Start studying to see your progress!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const jlptData = [
    { level: 'N5', progress: snapshot.jlptProgress.N5.percentage },
    { level: 'N4', progress: snapshot.jlptProgress.N4.percentage },
    { level: 'N3', progress: snapshot.jlptProgress.N3.percentage },
    { level: 'N2', progress: snapshot.jlptProgress.N2.percentage },
    { level: 'N1', progress: snapshot.jlptProgress.N1.percentage }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Track your progress and performance over time
              </p>
            </div>
            <Button
              onClick={loadAnalytics}
              disabled={loading}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cards Learned
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{snapshot.totalCardsLearned}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {snapshot.totalReviews} total reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current Streak
                </CardTitle>
                <Flame className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{snapshot.currentStreak}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Longest: {snapshot.longestStreak} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Accuracy
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{snapshot.averageAccuracy}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Average performance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Study Time
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(snapshot.studyTime / 60)}h</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total time invested
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Study Activity</CardTitle>
            <CardDescription>Daily cards studied over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cards"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Cards Studied"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* JLPT Progress */}
        <Card>
          <CardHeader>
            <CardTitle>JLPT Level Progress</CardTitle>
            <CardDescription>Your progress across different JLPT levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jlptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="level" type="category" />
                <Tooltip />
                <Bar dataKey="progress" fill="#8b5cf6" name="Progress %" />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {Object.entries(snapshot.jlptProgress).map(([level, data]) => (
                <div key={level} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{level}</span>
                  <span className="text-muted-foreground">
                    {data.learned} / {data.total} cards ({data.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Your study performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Accuracy</span>
                  <span className="text-sm text-muted-foreground">{metrics.averageAccuracy}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${metrics.averageAccuracy}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Consistency</span>
                  <span className="text-sm text-muted-foreground">{metrics.consistencyScore}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${metrics.consistencyScore}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cards per session</span>
                  <span className="font-medium">{metrics.cardsPerSession}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Best streak</span>
                  <span className="font-medium">{metrics.bestStreak} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total study time</span>
                  <span className="font-medium">{Math.round(metrics.totalStudyTime / 60)}h {metrics.totalStudyTime % 60}m</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Achievement placeholders */}
                {snapshot.currentStreak >= 7 && (
                  <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg">
                    <div className="p-2 bg-orange-500/20 rounded-full">
                      <Flame className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Week Warrior</div>
                      <div className="text-xs text-muted-foreground">
                        7-day study streak achieved!
                      </div>
                    </div>
                  </div>
                )}

                {snapshot.totalCardsLearned >= 50 && (
                  <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg">
                    <div className="p-2 bg-blue-500/20 rounded-full">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Scholar</div>
                      <div className="text-xs text-muted-foreground">
                        Learned 50+ vocabulary cards
                      </div>
                    </div>
                  </div>
                )}

                {metrics.averageAccuracy >= 80 && (
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                    <div className="p-2 bg-green-500/20 rounded-full">
                      <Target className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Sharpshooter</div>
                      <div className="text-xs text-muted-foreground">
                        80%+ accuracy maintained
                      </div>
                    </div>
                  </div>
                )}

                {snapshot.currentStreak === 0 && snapshot.totalCardsLearned < 10 && (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Keep studying to unlock achievements!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  )
}
