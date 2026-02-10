"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Home, Play, CheckCircle2, XCircle, Trophy, Timer, HelpCircle } from "lucide-react"
import Link from "next/link"
import {
  loadSpecialData,
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

export default function QuestionsDrillPage() {
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<DrillPhase>("setup")
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
      } catch (error) {
        console.error("Failed to load:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Timer effect
  useEffect(() => {
    if (phase === "drilling") {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
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
    if (phase !== "drilling" || !currentQuestion || currentQuestion.userAnswer) return

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
  }, [phase, currentQuestion])

  // Collect all question words
  const getAllQuestionWords = () => {
    const questionWords: Array<{ word: SpecialWord; categoryIndex: number; subcategoryIndex: number }> = []

    // Go through all categories and collect question words
    let catIndex = 0
    while (true) {
      const category = getCategory(catIndex)
      if (!category) break

      category.subcategories.forEach((subcategory, subIndex) => {
        subcategory.words.forEach(word => {
          if (word.special && word.specialReason === "question") {
            questionWords.push({ word, categoryIndex: catIndex, subcategoryIndex: subIndex })
          }
        })
      })

      catIndex++
    }

    return questionWords
  }

  const startDrill = () => {
    const allQuestionWords = getAllQuestionWords()

    if (allQuestionWords.length === 0) {
      console.error("No question words found")
      return
    }

    // Shuffle and select questions
    const shuffled = [...allQuestionWords].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(questionCount, allQuestionWords.length))

    // Generate drill questions
    const drillQuestions: DrillQuestion[] = selected.map(({ word }) => {
      // Determine direction
      let dir: "jp-to-en" | "en-to-jp" = direction === "mixed"
        ? Math.random() > 0.5 ? "jp-to-en" : "en-to-jp"
        : direction

      const question = dir === "jp-to-en" ? word.japanese : word.english
      const correctAnswer = dir === "jp-to-en" ? word.english : word.japanese

      // Generate wrong options from other question words
      const wrongOptions = shuffled
        .filter(({ word: w }) => w.japanese !== word.japanese)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(({ word: w }) => dir === "jp-to-en" ? w.english : w.japanese)

      // Ensure we have 3 wrong options
      while (wrongOptions.length < 3 && wrongOptions.length < shuffled.length - 1) {
        const randomWord = shuffled[Math.floor(Math.random() * shuffled.length)]
        const option = dir === "jp-to-en" ? randomWord.word.english : randomWord.word.japanese
        if (option !== correctAnswer && !wrongOptions.includes(option)) {
          wrongOptions.push(option)
        }
      }

      // Shuffle options
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
    setElapsedTime(0)
    setPhase("drilling")
  }

  const handleAnswer = (answer: string) => {
    const questionTime = Math.floor((Date.now() - questionStartTime) / 1000)
    const isCorrect = answer === currentQuestion.correctAnswer

    setQuestions(prev =>
      prev.map((q, idx) =>
        idx === currentQuestionIndex
          ? { ...q, userAnswer: answer, isCorrect, timeSpent: questionTime }
          : q
      )
    )

    // Auto advance after 1.5 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setQuestionStartTime(Date.now())
      } else {
        setPhase("results")
      }
    }, 1500)
  }

  const resetDrill = () => {
    setPhase("setup")
    setQuestions([])
    setCurrentQuestionIndex(0)
    setElapsedTime(0)
  }

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
  const correctCount = questions.filter(q => q.isCorrect).length
  const accuracy = questions.length > 0 ? (correctCount / questions.length) * 100 : 0

  // Setup Phase
  if (phase === "setup") {
    const totalQuestionWords = getAllQuestionWords().length

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />

        <div className="container mx-auto py-8 px-4 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="h-12 w-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Question Words Drill
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Practice all {totalQuestionWords} question words
            </p>
          </div>

          {/* Setup Card */}
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8 space-y-6">
              {/* Question Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Number of Questions: {questionCount}
                </label>
                <input
                  type="range"
                  min="5"
                  max={totalQuestionWords}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>5</span>
                  <span>{totalQuestionWords}</span>
                </div>
              </div>

              {/* Direction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Direction
                </label>
                <div className="grid grid-cols-3 gap-2">
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

              {/* Start Button */}
              <Button
                onClick={startDrill}
                size="lg"
                className="w-full gap-2"
              >
                <Play className="h-5 w-5" />
                Start Drill
              </Button>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <Link href="/dlingo-special">
              <Button variant="ghost" className="gap-2">
                <Home className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Results Phase
  if (phase === "results") {
    const avgTime = questions.reduce((sum, q) => sum + q.timeSpent, 0) / questions.length

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />

        <div className="container mx-auto py-8 px-4 max-w-4xl">
          {/* Results Header */}
          <div className="text-center mb-8">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Drill Complete!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Question Words Practice
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {correctCount}/{questions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Correct
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {accuracy.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Accuracy
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {avgTime.toFixed(1)}s
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Avg Time
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Mistakes */}
          {questions.filter(q => !q.isCorrect).length > 0 && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Review Mistakes
                </h3>
                <div className="space-y-3">
                  {questions.filter(q => !q.isCorrect).map((q, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          <JapaneseText text={q.question} />
                        </span>
                        <Badge variant="destructive">Incorrect</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="text-gray-600 dark:text-gray-400">
                          Your answer: <span className="text-red-600 dark:text-red-400">{q.userAnswer}</span>
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Correct answer: <span className="text-green-600 dark:text-green-400">
                            <JapaneseText text={q.correctAnswer} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={resetDrill} variant="outline" size="lg">
              Try Again
            </Button>
            <Link href="/dlingo-special">
              <Button variant="default" size="lg" className="gap-2">
                <Home className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Drilling Phase
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Header />

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Timer className="h-4 w-4" />
                {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, "0")}
              </div>
              <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                {correctCount} correct
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

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

        {/* Keyboard hints */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Press A-D or 1-4 to select answer • Enter to confirm
        </div>
      </div>
    </div>
  )
}
