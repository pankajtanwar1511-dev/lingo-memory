"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { QuizSetup } from "@/components/quiz/quiz-setup"
import { QuizQuestion } from "@/components/quiz/quiz-question"
import { QuizResults } from "@/components/quiz/quiz-results"
import { useQuizStore } from "@/store/quiz-store"
import { useLiveVocabulary, useDatabase } from "@/hooks/useDatabase"
import { VocabularyCard } from "@/types/vocabulary"
import { KanjiCard } from "@/types/kanji"
import { QuizSettings } from "@/types/quiz"
import { Button } from "@/components/ui/button"
import { X, Pause, Play, Loader2 } from "lucide-react"
import { Header } from "@/components/layout/header"

type QuizState = "setup" | "in-progress" | "results"

export default function QuizPage() {
  const router = useRouter()
  const [quizState, setQuizState] = useState<QuizState>("setup")
  const [kanjiCards, setKanjiCards] = useState<KanjiCard[]>([])
  const [kanjiLoading, setKanjiLoading] = useState(true)

  const {
    currentSession,
    currentQuestionIndex,
    startQuiz,
    startReviewQuiz,
    answerQuestion,
    skipQuestion,
    nextQuestion,
    pauseQuiz,
    resumeQuiz,
    endQuiz,
    abandonQuiz,
    retryQuiz,
    getCurrentQuestion,
    getProgress
  } = useQuizStore()

  // Initialize database and use live queries
  const { isInitialized, isLoading: dbLoading, error: dbError } = useDatabase()
  const dbVocabulary = useLiveVocabulary() ?? []

  // Convert live vocabulary data
  const availableVocabCards: VocabularyCard[] = dbVocabulary.map(card => {
    const { deckId, addedAt, modifiedAt, ...vocabCard } = card
    return vocabCard as VocabularyCard
  })

  // Load kanji data
  useEffect(() => {
    const loadKanji = async () => {
      try {
        setKanjiLoading(true)
        const response = await fetch('/seed-data/kanji_n5.json')
        if (!response.ok) {
          throw new Error('Failed to load kanji data')
        }
        const data = await response.json()
        setKanjiCards(data.kanji || [])
      } catch (err) {
        console.error('Error loading kanji:', err)
      } finally {
        setKanjiLoading(false)
      }
    }
    loadKanji()
  }, [])

  const handleStartQuiz = (settings: QuizSettings) => {
    let cards: (VocabularyCard | KanjiCard)[] = settings.contentType === "vocabulary" ? availableVocabCards : kanjiCards

    // Filter by JLPT level if specified
    if (settings.jlptLevel && settings.jlptLevel !== "All") {
      cards = cards.filter(card => card.jlptLevel === settings.jlptLevel)
    }

    if (cards.length === 0) {
      const type = settings.contentType === "vocabulary" ? "vocabulary" : "kanji"
      const levelMsg = settings.jlptLevel && settings.jlptLevel !== "All"
        ? ` at ${settings.jlptLevel} level`
        : ""
      alert(`No ${type} cards available${levelMsg}. Please add cards first.`)
      return
    }

    // Shuffle and select cards
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, settings.questionCount)

    startQuiz(selected, settings, cards)
    setQuizState("in-progress")
  }

  const handleAnswer = (answer: string, timeSpent: number, hintsUsed: number) => {
    answerQuestion(answer, timeSpent, hintsUsed)
  }

  const handleSkip = () => {
    skipQuestion()
  }

  const handleEndQuiz = () => {
    const result = endQuiz()
    if (result) {
      setQuizState("results")
    }
  }

  const handleRetry = () => {
    retryQuiz()
    setQuizState("in-progress")
  }

  const handleNewQuiz = () => {
    setQuizState("setup")
  }

  const handleViewProgress = () => {
    router.push("/progress")
  }

  const handleReviewMistakes = () => {
    if (!currentSession) return

    // Build incorrect question details from current session
    const incorrectDetails = currentSession.answers
      .map((answer, index) => {
        if (!answer.isCorrect && answer.userAnswer !== "") {
          return {
            question: currentSession.questions[index],
            userAnswer: answer.userAnswer,
            correctAnswer: answer.correctAnswer,
            timeSpent: answer.timeSpent,
            hintsUsed: answer.hintsUsed
          }
        }
        return null
      })
      .filter((detail): detail is NonNullable<typeof detail> => detail !== null)

    if (incorrectDetails.length > 0) {
      startReviewQuiz(incorrectDetails, currentSession.settings)
      setQuizState("in-progress")
    }
  }

  const handleAbandon = () => {
    if (confirm("Are you sure you want to quit this quiz? Your progress will not be saved.")) {
      abandonQuiz()
      setQuizState("setup")
    }
  }

  const handleTogglePause = () => {
    const progress = getProgress()
    if (!progress) return

    if (progress.isPaused) {
      resumeQuiz()
    } else {
      pauseQuiz()
    }
  }

  // Check if quiz is complete
  useEffect(() => {
    if (currentSession && currentSession.status === "completed") {
      setQuizState("results")
    }
  }, [currentSession])

  const currentQuestion = getCurrentQuestion()
  const progress = getProgress()

  // Show loading state
  if (dbLoading || !isInitialized || kanjiLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (dbError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-2">Failed to load quiz data</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{dbError}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4">
        {/* Quiz Header (shown during quiz) */}
      {quizState === "in-progress" && (
        <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAbandon}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Quit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTogglePause}
              className="gap-2"
            >
              {progress?.isPaused ? (
                <>
                  <Play className="h-4 w-4" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              )}
            </Button>
          </div>

          {progress && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {progress.correctCount} / {progress.answeredCount} correct
            </div>
          )}
        </div>
      )}

      {/* Pause Overlay */}
      {quizState === "in-progress" && progress?.isPaused && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-md text-center">
            <Pause className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">Quiz Paused</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Take a break and resume when ready
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleAbandon} className="flex-1">
                Quit Quiz
              </Button>
              <Button onClick={handleTogglePause} className="flex-1 gap-2">
                <Play className="h-4 w-4" />
                Resume
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Content */}
      {quizState === "setup" && (
        <QuizSetup
          onStart={handleStartQuiz}
          availableVocabCount={availableVocabCards.length}
          availableKanjiCount={kanjiCards.length}
        />
      )}

      {quizState === "in-progress" && currentQuestion && progress && (
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={progress.totalQuestions}
          timeLimit={currentSession?.settings.timeLimit}
          showHints={currentSession?.settings.showHints || false}
          playAudio={currentSession?.settings.playAudio || false}
          onAnswer={handleAnswer}
          onSkip={handleSkip}
          disabled={progress.isPaused}
        />
      )}

      {quizState === "results" && currentSession?.status === "completed" && (
        <QuizResults
          result={{
            sessionId: currentSession.id,
            startedAt: currentSession.startedAt,
            completedAt: new Date(),
            settings: currentSession.settings,
            questions: currentSession.questions,
            answers: currentSession.answers,
            score:
              (currentSession.answers.filter(a => a.isCorrect).length /
                currentSession.questions.length) *
              100,
            accuracy:
              currentSession.answers.filter(a => a.userAnswer !== "").length > 0
                ? (currentSession.answers.filter(a => a.isCorrect).length /
                    currentSession.answers.filter(a => a.userAnswer !== "").length) *
                  100
                : 0,
            totalTime: Date.now() - currentSession.startedAt.getTime(),
            averageTimePerQuestion:
              currentSession.answers.reduce((sum, a) => sum + a.timeSpent, 0) /
              currentSession.answers.length,
            perfectAnswers: currentSession.answers.filter(
              a => a.isCorrect && a.hintsUsed === 0
            ).length,
            correctAnswers: currentSession.answers.filter(a => a.isCorrect).length,
            incorrectAnswers: currentSession.answers.filter(
              a => !a.isCorrect && a.userAnswer !== ""
            ).length,
            skippedAnswers: currentSession.answers.filter(a => a.userAnswer === "")
              .length,
            incorrectQuestionDetails: currentSession.answers
              .map((answer, index) => {
                if (!answer.isCorrect && answer.userAnswer !== "") {
                  return {
                    question: currentSession.questions[index],
                    userAnswer: answer.userAnswer,
                    correctAnswer: answer.correctAnswer,
                    timeSpent: answer.timeSpent,
                    hintsUsed: answer.hintsUsed
                  }
                }
                return null
              })
              .filter((detail): detail is NonNullable<typeof detail> => detail !== null)
          }}
          onRetry={handleRetry}
          onNewQuiz={handleNewQuiz}
          onViewProgress={handleViewProgress}
          onReviewMistakes={handleReviewMistakes}
        />
      )}
    </div>
    </div>
  )
}
