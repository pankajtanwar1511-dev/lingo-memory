"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft, Clock, Zap, Target, Flame,
  Brain, RotateCcw, Play, CheckCircle2, XCircle, Loader2, Languages
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/layout/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useStudyStore from "@/store/study-store"
import { useDatabase } from "@/hooks/useDatabase"
import { Rating, CardState, FSRS } from "@/lib/fsrs"
import { cn } from "@/lib/utils"
import { analyticsService } from "@/services/analytics.service"

export default function StudyPage() {
  const {
    vocabulary,
    studyCards,
    currentCard,
    currentSession,
    queue,
    stats,
    loadVocabulary,
    initializeCards,
    startSession,
    gradeCard,
    endSession,
    getDueCards,
    getNewCards,
    updateStats
  } = useStudyStore()

  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null)

  // Analytics tracking
  const sessionStartTime = useRef<number>(0)
  const cardStartTime = useRef<number>(0)
  const responseTimes = useRef<number[]>([])
  const currentSessionId = useRef<string | null>(null)

  // Initialize database
  const { isInitialized, isLoading: dbLoading, error: dbError } = useDatabase()

  // Load vocabulary from database on mount
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
    }
  }, [isInitialized, loadVocabulary, updateStats])

  // Get current vocabulary card
  const currentVocab = currentCard
    ? vocabulary.find(v => v.id === currentCard.vocabularyId)
    : null

  // Calculate session progress
  const sessionProgress = currentSession
    ? (currentSession.cardsStudied / (currentSession.cardsStudied + queue.length)) * 100
    : 0

  // Get summary stats
  const dueCards = getDueCards()
  const newCards = getNewCards()

  const handleStartSession = (mode: 'review' | 'learn' | 'cram') => {
    startSession(mode)
    setShowAnswer(false)
    setSelectedRating(null)

    // Initialize analytics tracking
    sessionStartTime.current = Date.now()
    cardStartTime.current = Date.now()
    responseTimes.current = []
    currentSessionId.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log('📝 Session started:', currentSessionId.current)
  }

  const handleEndSession = async () => {
    // Mark session as complete by incrementing session count
    if (currentSession && responseTimes.current.length > 0) {
      const avgResponseTime = responseTimes.current.reduce((a, b) => a + b, 0) / responseTimes.current.length

      try {
        // Record final session data
        await analyticsService.recordSession(
          'default-deck',
          'flashcard',
          currentSession.cardsStudied,
          currentSession.correctCount,
          avgResponseTime
        )

        // Increment session count in daily stats
        await analyticsService.incrementDailyStats({
          sessionsCount: 1
        })

        console.log('✅ Session completed:', {
          sessionId: currentSessionId.current,
          cards: currentSession.cardsStudied,
          correct: currentSession.correctCount,
          avgTime: avgResponseTime.toFixed(2) + 's'
        })

        // Clear response times to prevent double recording
        responseTimes.current = []
        currentSessionId.current = null
      } catch (error) {
        console.error('Failed to complete session:', error)
      }
    }

    endSession()
  }

  const handleGrade = async (rating: Rating) => {
    setSelectedRating(rating)

    // Track response time for this card
    const responseTime = (Date.now() - cardStartTime.current) / 1000 // Convert to seconds
    responseTimes.current.push(responseTime)

    // Determine if answer was correct (Good or Easy = correct)
    const isCorrect = rating === Rating.Good || rating === Rating.Easy

    // Update daily stats IMMEDIATELY after each card
    try {
      await analyticsService.incrementDailyStats({
        cardsStudied: 1,
        correctAnswers: isCorrect ? 1 : 0,
        incorrectAnswers: isCorrect ? 0 : 1,
        studyTime: Math.round(responseTime / 60), // Convert to minutes
        sessionsCount: 0 // Don't increment session count per card
      })

      console.log('✅ Card analytics recorded:', {
        correct: isCorrect,
        time: responseTime.toFixed(2) + 's'
      })
    } catch (error) {
      console.error('Failed to record card analytics:', error)
    }

    gradeCard(rating)
    setShowAnswer(false)
    setSelectedRating(null)

    // Check if session is complete
    if (queue.length === 0 && currentSession) {
      await handleEndSession()
    } else {
      // Reset timer for next card
      cardStartTime.current = Date.now()
    }
  }

  const ratingButtons = [
    { rating: Rating.Again, label: "Again", color: "danger", icon: XCircle, shortcut: "1" },
    { rating: Rating.Hard, label: "Hard", color: "warning", icon: RotateCcw, shortcut: "2" },
    { rating: Rating.Good, label: "Good", color: "success", icon: CheckCircle2, shortcut: "3" },
    { rating: Rating.Easy, label: "Easy", color: "primary", icon: Zap, shortcut: "4" }
  ]

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!currentSession || !showAnswer) return

      if (e.key === ' ') {
        e.preventDefault()
        if (!showAnswer) setShowAnswer(true)
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const rating = parseInt(e.key) as Rating
        handleGrade(rating)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSession, showAnswer])

  // Show loading state
  if (dbLoading || !isInitialized) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Initializing study session...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Show error state
  if (dbError) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-2">Failed to load study data</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{dbError}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {!currentSession ? (
          // Session selection screen
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Stats overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Due Today</p>
                  </div>
                  <p className="text-2xl font-bold">{dueCards.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">New Cards</p>
                  </div>
                  <p className="text-2xl font-bold">{newCards.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Streak</p>
                  </div>
                  <p className="text-2xl font-bold">{stats.streakDays} days</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Retention</p>
                  </div>
                  <p className="text-2xl font-bold">{Math.round(stats.retention)}%</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Today</p>
                  </div>
                  <p className="text-2xl font-bold">{stats.todayReviews}</p>
                </CardContent>
              </Card>
            </div>

            {/* Study modes */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Review
                  </CardTitle>
                  <CardDescription>
                    Review due cards and learn new vocabulary
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Due cards</span>
                      <span className="font-bold">{dueCards.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>New cards</span>
                      <span className="font-bold">+5</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleStartSession('review')}
                    className="w-full"
                    variant="gradient"
                    disabled={dueCards.length === 0 && newCards.length === 0}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Review
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Learn
                  </CardTitle>
                  <CardDescription>
                    Focus on learning new vocabulary only
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>New cards available</span>
                      <span className="font-bold">{newCards.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Session size</span>
                      <span className="font-bold">20 cards</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleStartSession('learn')}
                    className="w-full"
                    variant="secondary"
                    disabled={newCards.length === 0}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Cram
                  </CardTitle>
                  <CardDescription>
                    Quick practice without affecting progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Random cards</span>
                      <span className="font-bold">30</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>No SRS tracking</span>
                      <Badge variant="outline">Practice</Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleStartSession('cram')}
                    className="w-full"
                    variant="outline"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Start Cramming
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Kanji
                  </CardTitle>
                  <CardDescription>
                    37-lesson reference + vocab reveal SRS
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Kanji taught</span>
                      <span className="font-bold">86</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Lessons · vocab · sentences</span>
                      <Badge variant="outline">37 · 378 · 173</Badge>
                    </div>
                  </div>
                  <Link href="/study/kanji">
                    <Button className="w-full" variant="default">
                      <Languages className="h-4 w-4 mr-2" />
                      Open Kanji
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Progress overview */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>
                  Your journey through JLPT N5 vocabulary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {studyCards.filter(c => c.state !== CardState.New).length} / {studyCards.length} cards
                      </span>
                    </div>
                    <Progress
                      value={(studyCards.filter(c => c.state !== CardState.New).length / studyCards.length) * 100}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">New</p>
                      <p className="text-xl font-bold">
                        {studyCards.filter(c => c.state === CardState.New).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Learning</p>
                      <p className="text-xl font-bold">
                        {studyCards.filter(c => c.state === CardState.Learning).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Review</p>
                      <p className="text-xl font-bold">
                        {studyCards.filter(c => c.state === CardState.Review).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Relearning</p>
                      <p className="text-xl font-bold">
                        {studyCards.filter(c => c.state === CardState.Relearning).length}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Study session screen
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Session header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleEndSession}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                End Session
              </Button>

              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  {currentSession.mode === 'review' ? 'Review' :
                   currentSession.mode === 'learn' ? 'Learn' : 'Cram'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {currentSession.cardsStudied} / {currentSession.cardsStudied + queue.length + (currentCard ? 1 : 0)}
                </span>
              </div>

              <Badge variant="success">
                {currentSession.correctCount} correct
              </Badge>
            </div>

            {/* Progress bar */}
            <Progress value={sessionProgress} className="h-2" />

            {/* Study card */}
            {currentCard && currentVocab ? (
              <motion.div
                key={currentCard.vocabularyId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
                  <CardContent className="p-8">
                    {/* Card state badges */}
                    <div className="flex justify-between mb-6">
                      <Badge variant={
                        currentCard.state === CardState.New ? "secondary" :
                        currentCard.state === CardState.Learning ? "default" :
                        currentCard.state === CardState.Review ? "success" : "outline"
                      }>
                        {CardState[currentCard.state]}
                      </Badge>

                      {currentVocab.jlptLevel && (
                        <Badge variant="gradient">{currentVocab.jlptLevel}</Badge>
                      )}
                    </div>

                    {/* Question side */}
                    <div className="text-center space-y-6">
                      {currentVocab.kanji && (
                        <h1 className="text-6xl md:text-8xl font-bold text-primary-700 dark:text-primary-300 font-japanese">
                          {currentVocab.kanji}
                        </h1>
                      )}
                      <p className="text-3xl md:text-4xl text-gray-600 dark:text-gray-400 font-japanese">
                        {currentVocab.kana}
                      </p>

                      {!showAnswer && (
                        <Button
                          onClick={() => setShowAnswer(true)}
                          size="lg"
                          variant="gradient"
                          className="mt-8"
                        >
                          Show Answer
                          <span className="ml-2 text-xs opacity-75">(Space)</span>
                        </Button>
                      )}
                    </div>

                    {/* Answer side */}
                    <AnimatePresence>
                      {showAnswer && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-8 space-y-6"
                        >
                          <div className="border-t pt-6">
                            <h3 className="text-2xl font-semibold mb-4">
                              {Array.isArray(currentVocab.meaning)
                                ? currentVocab.meaning.join(", ")
                                : currentVocab.meaning}
                            </h3>

                            {currentVocab.partOfSpeech && (
                              <div className="flex gap-2 mb-4">
                                {currentVocab.partOfSpeech.map((pos, i) => (
                                  <Badge key={i} variant="outline">{pos}</Badge>
                                ))}
                              </div>
                            )}

                            {/* Examples */}
                            <div className="space-y-3">
                              {currentVocab.examples.slice(0, 2).map((example, i) => (
                                <div key={i} className="p-3 bg-muted rounded-lg">
                                  <p className="font-japanese text-lg">{example.japanese}</p>
                                  {example.kana && (
                                    <p className="text-sm text-muted-foreground font-japanese">
                                      {example.kana}
                                    </p>
                                  )}
                                  <p className="text-sm mt-1">{example.english}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Rating buttons */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {ratingButtons.map(({ rating, label, color, icon: Icon, shortcut }) => {
                              // Get the next interval for this rating
                              const nextCard = currentCard
                                ? new FSRS().repeat(currentCard, new Date())[rating]
                                : null
                              const interval = nextCard
                                ? FSRS.formatInterval(nextCard.scheduledDays)
                                : ""

                              return (
                                <Button
                                  key={rating}
                                  onClick={() => handleGrade(rating)}
                                  variant={
                                    color === "danger" ? "destructive" :
                                    color === "warning" ? "secondary" :
                                    color === "success" ? "outline" : "gradient"
                                  }
                                  className="flex flex-col gap-1 h-auto py-3"
                                >
                                  <Icon className="h-5 w-5" />
                                  <span className="font-semibold">{label}</span>
                                  <span className="text-xs opacity-75">{interval}</span>
                                  <kbd className="text-xs opacity-50">{shortcut}</kbd>
                                </Button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              // Session complete
              <Card className="text-center py-16">
                <CardContent className="space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
                    <p className="text-muted-foreground">
                      Great job! You've completed your study session.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <div>
                      <p className="text-2xl font-bold">{currentSession.cardsStudied}</p>
                      <p className="text-sm text-muted-foreground">Cards studied</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {currentSession.correctCount > 0
                          ? Math.round((currentSession.correctCount / currentSession.cardsStudied) * 100)
                          : 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => startSession('review')} variant="gradient">
                      Continue Studying
                    </Button>
                    <Button onClick={handleEndSession} variant="outline">
                      End Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}