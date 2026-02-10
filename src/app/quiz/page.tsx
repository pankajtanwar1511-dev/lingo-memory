"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { QuizSetup } from "@/components/quiz/quiz-setup"
import { QuizQuestion } from "@/components/quiz/quiz-question"
import { QuizResults } from "@/components/quiz/quiz-results"
import { useQuizStore } from "@/store/quiz-store"
import { useBookmarksStore } from "@/store/bookmarks-store"
import { useLiveVocabulary, useDatabase } from "@/hooks/useDatabase"
import { VocabularyCard } from "@/types/vocabulary"
import { KanjiCard } from "@/types/kanji"
import { QuizSettings, QuizSession } from "@/types/quiz"
import { Button } from "@/components/ui/button"
import { X, Pause, Play, Loader2 } from "lucide-react"
import { Header } from "@/components/layout/header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type QuizState = "setup" | "in-progress" | "results"

export default function QuizPage() {
  const router = useRouter()
  const [quizState, setQuizState] = useState<QuizState>("setup")
  const [kanjiCards, setKanjiCards] = useState<KanjiCard[]>([])
  const [kanjiLoading, setKanjiLoading] = useState(true)
  const [showQuitDialog, setShowQuitDialog] = useState(false)

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

  const handleStartQuiz = async (settings: QuizSettings) => {
    console.log("🎯 Quiz Starting with settings:", settings)
    console.log("🔍 PresetId:", settings.presetId)

    const { bookmarkedVocab, bookmarkedKanji } = useBookmarksStore.getState()
    let cards: (VocabularyCard | KanjiCard)[]

    // LINGOSPECIAL MODE: Use Dlingo data with confusable options
    const isLingoSpecial = settings.presetId === "lingo-special"
    console.log("❓ Is LingoSpecial?", isLingoSpecial)

    if (isLingoSpecial) {
      try {
        console.log("💀 LingoSpecial Mode Activated!")

        // Load Dlingo data
        const { loadDlingoData } = await import("@/services/dlingo.service")
        const { generateLingoSpecialSession } = await import("@/lib/lingo-special-generator")

        const dlingoWords = await loadDlingoData()
        console.log(`✅ Loaded ${dlingoWords.length} Dlingo words`)

        // Generate LingoSpecial questions with confusable options
        const lingoSpecialQuestions = generateLingoSpecialSession(dlingoWords, settings.questionCount)
        console.log(`🔥 Generated ${lingoSpecialQuestions.length} ultra-hard LingoSpecial questions`)

        // Create a special session directly with these questions
        const sessionId = `lingospecial_${Date.now()}`
        const session: QuizSession = {
          id: sessionId,
          settings,
          questions: lingoSpecialQuestions,
          answers: [],
          progress: {
            currentQuestionIndex: 0,
            totalQuestions: lingoSpecialQuestions.length,
            answeredCount: 0,
            correctCount: 0,
            startTime: new Date(),
            elapsedTime: 0,
            isPaused: false
          },
          startedAt: new Date(),
          status: "in-progress"
        }

        // Use the quiz store's internal state setter
        useQuizStore.setState({
          currentSession: session,
          currentQuestionIndex: 0
        })

        setQuizState("in-progress")
        return
      } catch (error) {
        console.error("Failed to load LingoSpecial mode:", error)
        alert("Failed to load LingoSpecial quiz. Please try again.")
        return
      }
    }

    // FSRS SMART MODE: Load cards from study cards table with prioritization
    if (settings.smartMode && settings.contentType === "vocabulary") {
      try {
        const { databaseService } = await import("@/services/database.service")
        const { getRecommendedQuizCards } = await import("@/lib/quiz-fsrs-integration")

        // Get recommended cards based on FSRS
        const recommendations = await getRecommendedQuizCards(settings.questionCount)

        // Load vocabulary data for these cards
        const studyCardsWithVocab = await databaseService.getStudyCardsWithVocabulary()

        // Filter to get only recommended card IDs
        const recommendedIds = new Set([
          ...recommendations.dueCards.map(c => c.vocabularyId),
          ...recommendations.newCards.map(c => c.vocabularyId),
          ...recommendations.reviewCards.map(c => c.vocabularyId)
        ])

        // Get vocabulary cards for recommended IDs
        cards = studyCardsWithVocab
          .filter(sc => recommendedIds.has(sc.vocabularyId))
          .map(sc => sc.vocabulary)

        console.log(`🧠 FSRS Smart Mode: Loaded ${cards.length} cards (${recommendations.dueCards.length} due, ${recommendations.newCards.length} new)`)

      } catch (error) {
        console.error("Failed to load FSRS smart cards, falling back to normal mode:", error)
        // Fallback to normal loading
        cards = availableVocabCards
      }
    }
    // DUE CARDS ONLY: Load only cards due for review
    else if (settings.dueCardsOnly && settings.contentType === "vocabulary") {
      try {
        const { databaseService } = await import("@/services/database.service")
        const studyCardsWithVocab = await databaseService.getStudyCardsWithVocabulary()
        const now = new Date()

        // Filter to due cards only
        cards = studyCardsWithVocab
          .filter(sc => new Date(sc.due) <= now)
          .map(sc => sc.vocabulary)

        console.log(`📅 Due Cards Only: Loaded ${cards.length} cards due for review`)

      } catch (error) {
        console.error("Failed to load due cards, falling back to normal mode:", error)
        cards = availableVocabCards
      }
    }
    // NORMAL MODE: Load all cards based on content type
    else {
      if (settings.contentType === "mixed") {
        // Combine vocabulary and kanji cards
        cards = [...availableVocabCards, ...kanjiCards]
      } else if (settings.contentType === "vocabulary") {
        cards = availableVocabCards
      } else {
        cards = kanjiCards
      }
    }

    // Filter by bookmarked only if specified
    if (settings.bookmarkedOnly) {
      cards = cards.filter(card => {
        if ("kana" in card) {
          return bookmarkedVocab.has(card.id)
        } else {
          return bookmarkedKanji.has(card.id)
        }
      })
    }

    // Filter by JLPT level if specified (skip if smart mode already filtered)
    if (!settings.smartMode && settings.jlptLevel && settings.jlptLevel !== "All") {
      cards = cards.filter(card => card.jlptLevel === settings.jlptLevel)
    }

    // SMART FILTER: Filter cards based on direction requirements
    // This ensures only cards with required fields are included
    // E.g., "kana → kanji" direction needs cards WITH kanji
    const { filterCardsForDirection, getDirectionFilterStats } = require("@/lib/quiz-card-filter")
    const cardsBeforeDirectionFilter = cards.length
    cards = filterCardsForDirection(cards, settings.direction)
    const cardsFilteredByDirection = cardsBeforeDirectionFilter - cards.length

    if (cards.length === 0) {
      const type = settings.contentType === "mixed" ? "vocabulary or kanji" : settings.contentType
      const levelMsg = settings.jlptLevel && settings.jlptLevel !== "All"
        ? ` at ${settings.jlptLevel} level`
        : ""
      const bookmarkMsg = settings.bookmarkedOnly ? " bookmarked" : ""

      // Show specific message if cards were filtered by direction
      if (cardsFilteredByDirection > 0) {
        const { getDirectionRequirements } = require("@/lib/quiz-card-filter")
        const requirement = getDirectionRequirements(settings.direction)
        alert(
          `No${bookmarkMsg} ${type} cards available${levelMsg} for this quiz direction.\n\n` +
          `${cardsFilteredByDirection} card(s) were filtered out because:\n` +
          `${requirement}\n\n` +
          `Try selecting a different direction or add more cards with the required fields.`
        )
      } else {
        alert(`No${bookmarkMsg} ${type} cards available${levelMsg}. Please add cards first.`)
      }
      return
    }

    // Show info if cards were filtered
    if (cardsFilteredByDirection > 0) {
      console.log(
        `ℹ️ Filtered ${cardsFilteredByDirection} card(s) that don't meet direction requirements. ` +
        `${cards.length} cards available for quiz.`
      )
    }

    // Select cards (shuffle only if not in smart mode)
    let selected: (VocabularyCard | KanjiCard)[]

    if (settings.smartMode) {
      // Smart mode: Already prioritized by FSRS, just take the first N cards
      // Don't shuffle - respect FSRS priority order
      selected = cards.slice(0, settings.questionCount)
      console.log(`🧠 Smart Mode: Selected top ${selected.length} prioritized cards`)
    } else {
      // Normal mode: Shuffle and select randomly
      const shuffled = [...cards].sort(() => Math.random() - 0.5)
      selected = shuffled.slice(0, settings.questionCount)
    }

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
    setShowQuitDialog(true)
  }

  const confirmQuit = () => {
    abandonQuiz()
    setQuizState("setup")
    setShowQuitDialog(false)
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
          onNext={nextQuestion}
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

      {/* Quit Confirmation Dialog */}
      <Dialog open={showQuitDialog} onOpenChange={setShowQuitDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quit Quiz?</DialogTitle>
            <DialogDescription>
              Are you sure you want to quit this quiz? Your progress will not be saved and you will lose all answers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowQuitDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmQuit}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Quit Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  )
}
