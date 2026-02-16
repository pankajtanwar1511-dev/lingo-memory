"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Home, Play, CheckCircle2, XCircle, Trophy, Timer, Target, Zap } from "lucide-react"
import Link from "next/link"
import {
  loadSpecialData,
  getRandomWordsForDrill,
  getCategory,
} from "@/services/dlingo-special.service"
import { JapaneseText } from "@/components/dlingo-special/japanese-text"
import { SpecialWord } from "@/types/dlingo-special"

type DrillPhase = "setup" | "drilling" | "results"
type Direction = "jp-to-en" | "en-to-jp" | "mixed"

interface DrillQuestion {
  word: SpecialWord
  question: string
  correctAnswer: string
  options: string[]
  userAnswer: string | null
  isCorrect: boolean | null
  timeSpent: number
}

export default function DrillModePage() {
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<DrillPhase>("setup")
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null)
  const [questionCount, setQuestionCount] = useState(20)
  const [direction, setDirection] = useState<Direction>("mixed")

  const [questions, setQuestions] = useState<DrillQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [startTime, setStartTime] = useState<number>(0)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)
  const [elapsedTime, setElapsedTime] = useState(0)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        await loadSpecialData()
        const catParam = searchParams.get("category")
        if (catParam) {
          setCategoryIndex(parseInt(catParam))
        }
      } catch (error) {
        console.error("Failed to load:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [searchParams])

  // Timer
  useEffect(() => {
    if (phase === "drilling") {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime)
      }, 100)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [phase, startTime])

  // Keyboard shortcuts
  useEffect(() => {
    if (phase !== "drilling" || currentQuestionIndex >= questions.length) return
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion || currentQuestion.userAnswer) return

    const handleKeyPress = (e: KeyboardEvent) => {
      // Number keys 1-4
      const num = parseInt(e.key)
      if (num >= 1 && num <= currentQuestion.options.length) {
        handleAnswer(currentQuestion.options[num - 1])
        return
      }

      // Letter keys A-D
      const letter = e.key.toUpperCase()
      const letterIndex = letter.charCodeAt(0) - 65 // A=0, B=1, C=2, D=3
      if (letterIndex >= 0 && letterIndex < currentQuestion.options.length) {
        handleAnswer(currentQuestion.options[letterIndex])
        return
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [phase, currentQuestionIndex, questions])

  const startDrill = () => {
    // Generate questions
    const categories = categoryIndex !== null ? [categoryIndex] : [0, 1, 2, 3, 4, 5, 6, 7]
    const randomWords = getRandomWordsForDrill(categories, [[]], questionCount)

    const drillQuestions: DrillQuestion[] = randomWords.map(({ word, categoryIndex: catIdx, subcategoryIndex: subIdx }) => {
      // Determine direction
      let dir: "jp-to-en" | "en-to-jp" = direction === "mixed"
        ? Math.random() > 0.5 ? "jp-to-en" : "en-to-jp"
        : direction

      const question = dir === "jp-to-en" ? word.japanese : word.english
      const correctAnswer = dir === "jp-to-en" ? word.english : word.japanese

      // Generate better wrong options with multiple strategies
      const sameCategory = randomWords.filter(w =>
        w.categoryIndex === catIdx && w.word.japanese !== word.japanese
      )
      const sameSubcategory = sameCategory.filter(w => w.subcategoryIndex === subIdx)

      // NEW: Find words that start with similar characters (for JP direction)
      const getSimilarStarting = (targetWord: string, candidateWords: typeof randomWords) => {
        // Get first 1-3 characters of target
        const prefix1 = targetWord.substring(0, 1)
        const prefix2 = targetWord.substring(0, 2)
        const prefix3 = targetWord.substring(0, 3)

        return candidateWords.filter(w => {
          const wJapanese = dir === "jp-to-en" ? w.word.japanese : w.word.japanese
          return (
            (wJapanese.startsWith(prefix3) && prefix3.length >= 2) ||
            (wJapanese.startsWith(prefix2) && prefix2.length >= 2) ||
            (wJapanese.startsWith(prefix1))
          ) && w.word.japanese !== word.japanese
        })
      }

      const similarStarting = dir === "jp-to-en"
        ? getSimilarStarting(word.japanese, randomWords)
        : getSimilarStarting(word.english, randomWords)

      // Build confusable pool with priorities
      const confusablePool = [
        ...sameSubcategory.map(w => ({ word: w, priority: 3 })), // Highest priority
        ...similarStarting.map(w => ({ word: w, priority: 2 })), // High priority
        ...sameCategory.map(w => ({ word: w, priority: 1 })),   // Medium priority
      ]

      // Remove duplicates
      const uniquePool = Array.from(
        new Map(confusablePool.map(item => [item.word.word.japanese, item])).values()
      )

      // Sort by priority (highest first) and shuffle within same priority
      uniquePool.sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority
        return Math.random() - 0.5
      })

      const wrongOptions = uniquePool
        .map(({ word: w }) => dir === "jp-to-en" ? w.word.english : w.word.japanese)
        .filter(w => w !== correctAnswer)
        .slice(0, 3)

      // If we don't have enough options, fill with random words
      while (wrongOptions.length < 3) {
        const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)]
        const option = dir === "jp-to-en" ? randomWord.word.english : randomWord.word.japanese
        if (option !== correctAnswer && !wrongOptions.includes(option)) {
          wrongOptions.push(option)
        }
      }

      const options = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5)

      return {
        word,
        question,
        correctAnswer,
        options,
        userAnswer: null,
        isCorrect: null,
        timeSpent: 0,
      }
    })

    setQuestions(drillQuestions)
    setCurrentQuestionIndex(0)
    setStartTime(Date.now())
    setQuestionStartTime(Date.now())
    setPhase("drilling")
  }

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex]
    const timeSpent = Date.now() - questionStartTime
    const isCorrect = answer === currentQuestion.correctAnswer

    // Update question
    const updatedQuestions = [...questions]
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      userAnswer: answer,
      isCorrect,
      timeSpent,
    }
    setQuestions(updatedQuestions)

    // Move to next or finish
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setQuestionStartTime(Date.now())
      } else {
        setPhase("results")
      }
    }, 600) // Brief pause to show correct/incorrect
  }

  // Calculate results
  const correctCount = questions.filter(q => q.isCorrect === true).length
  const incorrectCount = questions.filter(q => q.isCorrect === false).length
  const accuracy = questions.length > 0 ? (correctCount / questions.length) * 100 : 0
  const avgTimePerQuestion = questions.length > 0
    ? questions.reduce((sum, q) => sum + q.timeSpent, 0) / questions.length / 1000
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Header />

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Setup Phase */}
        {phase === "setup" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                ⚡ Drill Mode
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Rapid-fire practice for mastery
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Category selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <div className="text-gray-600 dark:text-gray-400">
                    {categoryIndex !== null
                      ? getCategory(categoryIndex)?.category || "All Categories"
                      : "All Categories (Mixed)"}
                  </div>
                </div>

                {/* Question count */}
                <div>
                  <label className="block text-sm font-medium mb-2">Questions</label>
                  <div className="flex gap-2">
                    {[10, 20, 30, 50].map(count => (
                      <Button
                        key={count}
                        variant={questionCount === count ? "default" : "outline"}
                        onClick={() => setQuestionCount(count)}
                      >
                        {count}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Direction */}
                <div>
                  <label className="block text-sm font-medium mb-2">Direction</label>
                  <div className="flex gap-2">
                    <Button
                      variant={direction === "jp-to-en" ? "default" : "outline"}
                      onClick={() => setDirection("jp-to-en")}
                    >
                      JP → EN
                    </Button>
                    <Button
                      variant={direction === "en-to-jp" ? "default" : "outline"}
                      onClick={() => setDirection("en-to-jp")}
                    >
                      EN → JP
                    </Button>
                    <Button
                      variant={direction === "mixed" ? "default" : "outline"}
                      onClick={() => setDirection("mixed")}
                    >
                      Mixed
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={startDrill}
                  size="lg"
                  variant="gradient"
                  className="w-full gap-2"
                >
                  <Play className="h-5 w-5" />
                  Start Drill
                </Button>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link href="/dlingo-special">
                <Button variant="ghost" className="gap-2">
                  <Home className="h-4 w-4" />
                  Back to Dlingo Special
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Drilling Phase */}
        {phase === "drilling" && currentQuestion && (
          <div className="space-y-6">
            {/* Header with timer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-purple-600" />
                <span className="text-lg font-semibold text-purple-600">
                  {Math.floor(elapsedTime / 1000)}s
                </span>
              </div>

              <div className="text-center">
                <span className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>

              <div className="flex gap-2">
                <Badge variant="success">{correctCount}</Badge>
                <Badge variant="destructive">{incorrectCount}</Badge>
              </div>
            </div>

            {/* Progress */}
            <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />

            {/* Question Card */}
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="min-h-[400px]">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                      <JapaneseText text={currentQuestion.question} />
                    </h2>
                    <Badge variant="outline" className="text-xs opacity-40">
                      {currentQuestion.word.type}
                    </Badge>
                  </div>

                  {/* Answer options - Grid like quiz */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = currentQuestion.userAnswer === option
                      const isCorrect = option === currentQuestion.correctAnswer
                      const showResult = currentQuestion.userAnswer !== null

                      return (
                        <button
                          key={index}
                          onClick={() => !currentQuestion.userAnswer && handleAnswer(option)}
                          disabled={currentQuestion.userAnswer !== null}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            isSelected
                              ? showResult
                                ? isCorrect
                                  ? "border-green-600 bg-green-50 dark:bg-green-950/20"
                                  : "border-red-600 bg-red-50 dark:bg-red-950/20"
                                : "border-purple-600 bg-purple-50 dark:bg-purple-950/20"
                              : showResult && isCorrect
                              ? "border-green-600 bg-green-50 dark:bg-green-950/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                          } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Letter badge */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                              isSelected
                                ? showResult
                                  ? isCorrect
                                    ? "bg-green-600 text-white"
                                    : "bg-red-600 text-white"
                                  : "bg-purple-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600"
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>

                            {/* Option text */}
                            <span className="flex-1 text-foreground font-medium">
                              <JapaneseText text={option} />
                            </span>

                            {/* Result icons */}
                            {showResult && isCorrect && (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                            {showResult && isSelected && !isCorrect && (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Results Phase */}
        {phase === "results" && (
          <div className="space-y-6">
            <Card className="text-center py-12">
              <CardContent className="space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
                  <Trophy className="h-10 w-10 text-white" />
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-2">Drill Complete!</h2>
                  <p className="text-muted-foreground">
                    Great work! Here's how you did:
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  <div>
                    <p className="text-3xl font-bold text-green-600">{correctCount}</p>
                    <p className="text-sm text-muted-foreground">Correct</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-red-600">{incorrectCount}</p>
                    <p className="text-sm text-muted-foreground">Incorrect</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-purple-600">{Math.round(accuracy)}%</p>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-600">{avgTimePerQuestion.toFixed(1)}s</p>
                    <p className="text-sm text-muted-foreground">Avg Time</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-center pt-4">
                  <Button onClick={() => setPhase("setup")} variant="gradient" className="gap-2">
                    <Zap className="h-4 w-4" />
                    Try Again
                  </Button>
                  <Link href="/dlingo-special">
                    <Button variant="outline" className="gap-2">
                      <Home className="h-4 w-4" />
                      Back to Dlingo Special
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
