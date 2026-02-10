"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Loader2, Home, Trophy, CheckCircle2, XCircle, Zap, RefreshCw
} from "lucide-react"
import Link from "next/link"
import { loadParticleLearningData, generateQuizQuestions, ParticleQuizQuestion } from "@/services/particle-learning.service"
import { motion, AnimatePresence } from "framer-motion"

export default function ParticleQuizPage() {
  const [loading, setLoading] = useState(true)
  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState<ParticleQuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<{ correct: boolean; particle: string }[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        await loadParticleLearningData()
      } catch (error) {
        console.error("Failed to load:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const startQuiz = () => {
    const allParticles = ["に", "を", "が", "で", "は", "も", "の"]
    const quizQuestions = generateQuizQuestions(allParticles, 10)
    setQuestions(quizQuestions)
    setQuizStarted(true)
    setCurrentQuestionIndex(0)
    setScore(0)
    setAnswers([])
  }

  const handleAnswer = (answer: string) => {
    if (showResult) return

    setSelectedAnswer(answer)
    setShowResult(true)

    const isCorrect = answer === currentQuestion.correctAnswer
    if (isCorrect) {
      setScore(score + 1)
    }
    setAnswers([...answers, { correct: isCorrect, particle: currentQuestion.particle }])

    // Auto advance after 2 seconds
    setTimeout(() => {
      handleNext()
    }, 2000)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      // Quiz finished
      setQuizStarted(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
          </div>
        </div>
      </div>
    )
  }

  // Setup screen
  if (!quizStarted && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />

        <div className="container mx-auto py-8 px-4 max-w-3xl">
          <Link href="/dlingo-special/particles">
            <Button variant="ghost" className="mb-4 gap-2">
              <Home className="h-4 w-4" />
              Back
            </Button>
          </Link>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-purple-300 dark:border-purple-700">
              <CardContent className="p-12 text-center">
                <Zap className="h-24 w-24 mx-auto mb-6 text-purple-600 animate-pulse" />
                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Particle Quiz Challenge
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  Test your particle knowledge with 10 questions!
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                  <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4">
                    <div className="text-3xl font-bold text-purple-600">10</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
                  </div>
                  <div className="bg-pink-50 dark:bg-pink-950/30 rounded-lg p-4">
                    <div className="text-3xl font-bold text-pink-600">⚡</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Instant</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                    <div className="text-3xl font-bold text-blue-600">🎯</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Practice</div>
                  </div>
                </div>

                <Button
                  onClick={startQuiz}
                  size="lg"
                  className="gap-2 text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700"
                >
                  <Zap className="h-5 w-5" />
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // Results screen
  if (!quizStarted && questions.length > 0) {
    const percentage = (score / questions.length) * 100
    const passed = percentage >= 70

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />

        <div className="container mx-auto py-8 px-4 max-w-3xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-purple-300 dark:border-purple-700">
              <CardContent className="p-12 text-center">
                <Trophy className={`h-24 w-24 mx-auto mb-6 ${passed ? "text-yellow-500" : "text-gray-400"} animate-bounce`} />
                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Quiz Complete!
                </h1>

                <div className="text-7xl font-bold mb-4">
                  <span className={passed ? "text-green-600" : "text-orange-600"}>
                    {score}
                  </span>
                  <span className="text-gray-400">/{questions.length}</span>
                </div>

                <div className="text-2xl mb-8">
                  <Badge variant={passed ? "default" : "secondary"} className="text-lg px-4 py-2">
                    {percentage.toFixed(0)}% {passed ? "✨ Great!" : "Keep practicing!"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
                  <Button
                    onClick={startQuiz}
                    variant="default"
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                  <Link href="/dlingo-special/particles">
                    <Button variant="outline" className="gap-2 w-full">
                      <Home className="h-4 w-4" />
                      Back
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // Quiz in progress
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Header />

      <div className="container mx-auto py-8 px-4 max-w-3xl">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              Score: {score}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Fill in the particle:
                  </h2>
                  <p className="text-4xl font-semibold text-purple-600 dark:text-purple-400">
                    {currentQuestion.question}
                  </p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-3">
                  {currentQuestion.options?.map((option, index) => {
                    const isSelected = selectedAnswer === option
                    const isCorrect = option === currentQuestion.correctAnswer
                    const showFeedback = showResult

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        disabled={showResult}
                        className={`p-6 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? showFeedback
                              ? isCorrect
                                ? "border-green-600 bg-green-50 dark:bg-green-950/20"
                                : "border-red-600 bg-red-50 dark:bg-red-950/20"
                              : "border-purple-600 bg-purple-50 dark:bg-purple-950/20"
                            : showFeedback && isCorrect
                            ? "border-green-600 bg-green-50 dark:bg-green-950/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {option}
                          </span>

                          {showFeedback && isCorrect && (
                            <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                          )}
                          {showFeedback && isSelected && !isCorrect && (
                            <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Explanation */}
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg"
                  >
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      💡 {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
