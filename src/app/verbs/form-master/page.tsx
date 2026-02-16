'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Trophy, Target, CheckCircle2, XCircle, RotateCcw, Settings } from 'lucide-react'
import { generateAllQuestions, getRandomQuestions, VerbFormQuestion, type VerbData } from '@/lib/verb-form-questions'

export default function VerbFormMasterPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<VerbFormQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showSetup, setShowSetup] = useState(true)
  const [displayMode, setDisplayMode] = useState<'kanji' | 'kana'>('kanji')
  const [questionsPerSession, setQuestionsPerSession] = useState(10)

  const loadQuestions = async (count: number) => {
    try {
      // Load verb dataset
      const response = await fetch('/seed-data/N5_verbs_dataset.json')
      const data = await response.json()
      const verbs: VerbData[] = data.verbs

      // Generate all questions
      const allQuestions = generateAllQuestions(verbs)

      // Get random questions for this session
      const sessionQuestions = getRandomQuestions(allQuestions, count)

      setQuestions(sessionQuestions)
      setShowSetup(false)
    } catch (error) {
      console.error('Failed to load questions:', error)
    }
  }

  const handleStartQuiz = () => {
    loadQuestions(questionsPerSession)
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
    setShowSetup(true)
  }

  // Setup screen
  if (showSetup) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.push('/verbs')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Verbs
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Settings className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-center text-3xl">Verb Form Master Setup</CardTitle>
            <CardDescription className="text-center text-lg">
              Configure your practice session
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Display Mode */}
            <div className="space-y-4">
              <div>
                <label className="text-base font-semibold text-foreground">Display Mode</label>
                <p className="text-sm text-muted-foreground mt-1">Choose how you want to see the sentences</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDisplayMode('kanji')}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-200 ${
                    displayMode === 'kanji'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md scale-105'
                      : 'border-border hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className={`text-4xl font-bold mb-2 ${
                      displayMode === 'kanji' ? 'text-blue-600 dark:text-blue-400' : ''
                    }`}>
                      漢字
                    </div>
                    <p className={`text-sm font-medium ${
                      displayMode === 'kanji' ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'
                    }`}>
                      Kanji + Furigana
                    </p>
                    <p className="text-xs text-muted-foreground">Best for learning</p>
                  </div>
                  {displayMode === 'kanji' && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                </button>
                <button
                  onClick={() => setDisplayMode('kana')}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-200 ${
                    displayMode === 'kana'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950 shadow-md scale-105'
                      : 'border-border hover:border-purple-300 hover:shadow-sm'
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className={`text-4xl font-bold mb-2 ${
                      displayMode === 'kana' ? 'text-purple-600 dark:text-purple-400' : ''
                    }`}>
                      かな
                    </div>
                    <p className={`text-sm font-medium ${
                      displayMode === 'kana' ? 'text-purple-700 dark:text-purple-300' : 'text-muted-foreground'
                    }`}>
                      Kana Only
                    </p>
                    <p className="text-xs text-muted-foreground">Challenge mode</p>
                  </div>
                  {displayMode === 'kana' && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Question Count */}
            <div className="space-y-4">
              <div>
                <label className="text-base font-semibold text-foreground">Number of Questions</label>
                <p className="text-sm text-muted-foreground mt-1">How many questions do you want to practice?</p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { count: 5, label: 'Quick', time: '~2 min', color: 'green' },
                  { count: 10, label: 'Standard', time: '~5 min', color: 'blue' },
                  { count: 15, label: 'Extended', time: '~8 min', color: 'orange' },
                  { count: 20, label: 'Marathon', time: '~10 min', color: 'red' }
                ].map((option) => (
                  <button
                    key={option.count}
                    onClick={() => setQuestionsPerSession(option.count)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      questionsPerSession === option.count
                        ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-950 shadow-md scale-105`
                        : 'border-border hover:border-primary/50 hover:shadow-sm'
                    }`}
                  >
                    <div className="text-center space-y-1">
                      <p className={`text-3xl font-bold ${
                        questionsPerSession === option.count ? `text-${option.color}-600 dark:text-${option.color}-400` : ''
                      }`}>
                        {option.count}
                      </p>
                      <p className={`text-xs font-medium ${
                        questionsPerSession === option.count ? `text-${option.color}-700 dark:text-${option.color}-300` : 'text-muted-foreground'
                      }`}>
                        {option.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{option.time}</p>
                    </div>
                    {questionsPerSession === option.count && (
                      <div className="absolute -top-1 -right-1">
                        <CheckCircle2 className={`w-4 h-4 text-${option.color}-600 dark:text-${option.color}-400`} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStartQuiz}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <Target className="w-5 h-5 mr-2" />
              Start Practice
            </Button>
          </CardContent>
        </Card>
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
            <p className="text-2xl font-bold text-center">
              {displayMode === 'kanji' ? currentQuestion.sentence : currentQuestion.sentenceKana}
            </p>
            {displayMode === 'kanji' && (
              <p className="text-lg text-muted-foreground text-center">{currentQuestion.sentenceKana}</p>
            )}
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
                      <p className="text-xl font-bold">
                        {displayMode === 'kanji' ? option.text : option.kana}
                      </p>
                      {displayMode === 'kanji' && (
                        <p className="text-sm text-muted-foreground">{option.kana}</p>
                      )}
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
