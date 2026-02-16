'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Trophy, Target, CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import { generateAllQuestions, getRandomQuestions, VerbFormQuestion, type VerbData } from '@/lib/verb-form-questions'

export default function VerbFormMasterPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<VerbFormQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1)
  const [questionsPerSession] = useState(10)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      // Load verb dataset
      const response = await fetch('/seed-data/N5_verbs_dataset.json')
      const data = await response.json()
      const verbs: VerbData[] = data.verbs

      // Generate all questions
      const allQuestions = generateAllQuestions(verbs)

      // Get random questions for this session
      const sessionQuestions = getRandomQuestions(allQuestions, questionsPerSession)

      setQuestions(sessionQuestions)
    } catch (error) {
      console.error('Failed to load questions:', error)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerSelect = (answerText: string) => {
    if (showFeedback) return // Already answered

    setSelectedAnswer(answerText)
    setShowFeedback(true)

    // Check if correct
    if (answerText === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setIsComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setScore(0)
    setIsComplete(false)
    loadQuestions()
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <CardTitle className="text-center text-3xl">Quiz Complete!</CardTitle>
            <CardDescription className="text-center text-lg">
              Great job practicing verb forms!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">{percentage}%</div>
              <p className="text-xl">
                {score} out of {questions.length} correct
              </p>

              <div className="flex gap-2 justify-center">
                {percentage >= 80 && (
                  <Badge variant="default" className="text-lg py-2 px-4">Excellent!</Badge>
                )}
                {percentage >= 60 && percentage < 80 && (
                  <Badge variant="secondary" className="text-lg py-2 px-4">Good Job!</Badge>
                )}
                {percentage < 60 && (
                  <Badge variant="outline" className="text-lg py-2 px-4">Keep Practicing!</Badge>
                )}
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button onClick={handleRestart} size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => router.push('/verbs')} variant="outline" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Verbs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/verbs')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg py-1 px-3">
            <Target className="w-4 h-4 mr-2" />
            {score}/{questions.length}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg">
              {currentQuestion.verbKanji} - {currentQuestion.verbMeaning}
            </CardTitle>
            <Badge variant={currentQuestion.difficulty === 1 ? 'default' : currentQuestion.difficulty === 2 ? 'secondary' : 'destructive'}>
              Level {currentQuestion.difficulty}
            </Badge>
          </div>
          <CardDescription>
            Choose the correct verb form to complete the sentence
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Sentence */}
          <div className="bg-muted/30 rounded-lg p-6 space-y-2">
            <p className="text-2xl font-bold text-center">{currentQuestion.sentence}</p>
            <p className="text-lg text-muted-foreground text-center">{currentQuestion.sentenceKana}</p>
            <p className="text-sm text-center italic">{currentQuestion.english}</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option.text
              const isCorrect = option.isCorrect
              const showCorrect = showFeedback && isCorrect
              const showIncorrect = showFeedback && isSelected && !isCorrect

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option.text)}
                  disabled={showFeedback}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all text-left
                    ${!showFeedback && 'hover:border-primary hover:bg-primary/5'}
                    ${showCorrect && 'border-green-500 bg-green-50 dark:bg-green-950'}
                    ${showIncorrect && 'border-red-500 bg-red-50 dark:bg-red-950'}
                    ${!showFeedback && isSelected && 'border-primary bg-primary/10'}
                    ${!showFeedback && !isSelected && 'border-border'}
                    ${showFeedback && !isCorrect && !isSelected && 'opacity-50'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold">{option.text}</p>
                      <p className="text-sm text-muted-foreground">{option.kana}</p>
                      <Badge variant="outline" className="mt-1 text-xs">{option.form}-form</Badge>
                    </div>
                    {showCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    )}
                    {showIncorrect && (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`p-4 rounded-lg ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
              <p className="font-semibold mb-2">
                {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
              </p>
              <p className="text-sm">{currentQuestion.explanation}</p>
              {selectedAnswer !== currentQuestion.correctAnswer && (
                <p className="text-sm mt-2">
                  <strong>Correct answer:</strong> {currentQuestion.correctAnswer} ({currentQuestion.correctAnswerKana})
                </p>
              )}
            </div>
          )}

          {/* Next Button */}
          {showFeedback && (
            <Button onClick={handleNext} className="w-full" size="lg">
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
