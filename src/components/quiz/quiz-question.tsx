"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { QuizQuestion as QuizQuestionType } from "@/types/quiz"
import { audioService } from "@/lib/audio-service"
import {
  Volume2,
  Lightbulb,
  Clock,
  ChevronRight,
  Check,
  X,
  SkipForward,
  Star
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useBookmarksStore } from "@/store/bookmarks-store"
import { SentenceBuilder } from "./sentence-builder"
import { KanjiDrawing } from "./kanji-drawing"

interface QuizQuestionProps {
  question: QuizQuestionType
  questionNumber: number
  totalQuestions: number
  timeLimit?: number
  showHints: boolean
  playAudio: boolean
  onAnswer: (answer: string, timeSpent: number, hintsUsed: number) => void
  onSkip: () => void
  onNext?: () => void
  disabled?: boolean
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  timeLimit,
  showHints,
  playAudio,
  onAnswer,
  onSkip,
  onNext,
  disabled = false
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [typedAnswer, setTypedAnswer] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [validationLevel, setValidationLevel] = useState<"correct" | "close" | "wrong" | null>(null)
  const [validationHint, setValidationHint] = useState<string>("")
  const [isFlipped, setIsFlipped] = useState(false)

  const startTimeRef = useRef(Date.now())
  const timerRef = useRef<NodeJS.Timeout>()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Bookmarks
  const {
    toggleVocabBookmark,
    toggleKanjiBookmark,
    isVocabBookmarked,
    isKanjiBookmarked
  } = useBookmarksStore()

  const isBookmarked = question.contentType === "vocabulary"
    ? isVocabBookmarked(question.card.id)
    : isKanjiBookmarked(question.card.id)

  const handleToggleBookmark = () => {
    if (question.contentType === "vocabulary") {
      toggleVocabBookmark(question.card.id)
    } else {
      toggleKanjiBookmark(question.card.id)
    }
  }

  useEffect(() => {
    // Reset state when question changes
    setSelectedAnswer("")
    setTypedAnswer("")
    setShowHint(false)
    setTimeSpent(0)
    setTimeRemaining(timeLimit)
    setHintsUsed(0)
    setHasAnswered(false)
    setIsCorrect(null)
    setValidationLevel(null)
    setValidationHint("")
    setIsFlipped(false)
    startTimeRef.current = Date.now()

    // Start timer (disabled for sentence-building and stroke-order modes which need no time pressure)
    if (timeLimit && question.mode !== "sentence-building" && question.mode !== "stroke-order") {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === undefined || prev <= 0) {
            handleTimeout()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    // Play audio if enabled
    if (playAudio && question.mode === "listening") {
      playQuestionAudio()
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [question.id])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Don't trigger if already answered or disabled
      if (hasAnswered || disabled) return

      // Multiple choice: Number keys 1-4 (or 1-6 for hard mode)
      if (question.mode === "multiple-choice" && question.choices) {
        const num = parseInt(e.key)
        if (num >= 1 && num <= question.choices.length) {
          const choice = question.choices[num - 1]
          setSelectedAnswer(choice)
          return
        }
      }

      // Enter key: Submit answer
      if (e.key === "Enter") {
        e.preventDefault()
        if (question.mode === "multiple-choice" && selectedAnswer) {
          handleSubmit()
        } else if (question.mode === "typing" && typedAnswer.trim()) {
          handleSubmit()
        }
        return
      }

      // Space key: Skip question
      if (e.key === " " && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault()
        handleSkipClick()
        return
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [question.mode, question.choices, selectedAnswer, typedAnswer, hasAnswered, disabled])

  const handleTimeout = () => {
    if (!hasAnswered) {
      handleSubmit(true)
    }
  }

  const playQuestionAudio = async () => {
    // Stop any currently playing audio
    audioService.stop()

    // For listening mode, speak the Japanese text
    if (question.mode === "listening" && question.card && question.contentType === "vocabulary") {
      const card = question.card as any // Type narrow
      const textToSpeak = card.kanji || card.kana
      try {
        await audioService.speak(textToSpeak, {
          lang: "ja-JP",
          rate: 0.9,
          pitch: 1.0,
          volume: 1.0
        })
      } catch (err) {
        console.error("Audio playback failed:", err)
      }
    } else if (question.audioUrl) {
      // Fallback to audio URL if provided
      if (audioRef.current) {
        audioRef.current.pause()
      }

      audioRef.current = new Audio(question.audioUrl)
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err)
      })
    }
  }

  const handleHintClick = () => {
    setShowHint(true)
    setHintsUsed(prev => prev + 1)
  }

  const handleSubmit = (isTimeout: boolean = false) => {
    if (hasAnswered || disabled) return

    const elapsed = Date.now() - startTimeRef.current
    setTimeSpent(elapsed)
    setHasAnswered(true)

    const answer = question.mode === "typing" ? typedAnswer : selectedAnswer

    // Use enhanced validator for typing mode, simple check for multiple-choice
    if (question.mode === "typing") {
      // Import validator dynamically
      const { validateAnswer } = require("@/lib/quiz-validator")

      // Get card data
      const card = question.card
      const validationResult = validateAnswer(
        answer,
        question.direction,
        card,
        question.contentType
      )

      // Set validation state
      setValidationLevel(validationResult.level)
      setValidationHint(validationResult.hint || "")

      // Set isCorrect for backward compatibility
      setIsCorrect(validationResult.level === "correct")
    } else {
      // Multiple choice - use simple validation
      const correctAnswers = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : [question.correctAnswer]

      const correct = correctAnswers.some(
        ca => ca.trim().toLowerCase() === answer.trim().toLowerCase()
      )

      setIsCorrect(correct)
      setValidationLevel(correct ? "correct" : "wrong")
      setValidationHint("")
    }

    // Submit answer after showing feedback
    setTimeout(() => {
      onAnswer(answer, elapsed, hintsUsed)
    }, isTimeout ? 0 : 1500)
  }

  const handleSkipClick = () => {
    if (disabled) return
    const elapsed = Date.now() - startTimeRef.current
    setTimeSpent(elapsed)
    onSkip()
  }

  const handleChoiceClick = (choice: string) => {
    if (hasAnswered || disabled) return
    setSelectedAnswer(choice)
  }

  const handleTypingSubmit = () => {
    if (!typedAnswer.trim() || hasAnswered || disabled) return
    handleSubmit()
  }

  const handleSentenceBuilderSubmit = (userOrder: string[], isCorrect: boolean) => {
    if (hasAnswered || disabled) return

    const elapsed = Date.now() - startTimeRef.current
    setTimeSpent(elapsed)
    setHasAnswered(true)
    setIsCorrect(isCorrect)

    // Submit answer immediately (no auto-advance for sentence-building)
    onAnswer(userOrder.join(""), elapsed, hintsUsed)
  }

  const handleStrokeOrderSubmit = (strokes: any[], isCorrect: boolean) => {
    if (hasAnswered || disabled) return

    const elapsed = Date.now() - startTimeRef.current
    setTimeSpent(elapsed)
    setHasAnswered(true)
    setIsCorrect(isCorrect)

    // Submit answer with stroke count as answer
    onAnswer(`${strokes.length} strokes`, elapsed, hintsUsed)
  }

  const progressPercent = timeLimit && timeRemaining !== undefined
    ? (timeRemaining / timeLimit) * 100
    : 100

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            Question {questionNumber} / {totalQuestions}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleBookmark}
            className={`h-8 w-8 p-0 ${isBookmarked ? "text-yellow-500" : "text-gray-400"}`}
            title={isBookmarked ? "Remove bookmark" : "Bookmark this card"}
          >
            <Star className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>
        {timeLimit && timeRemaining !== undefined && question.mode !== "sentence-building" && question.mode !== "stroke-order" && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className={`font-mono ${
              timeRemaining <= 10 ? "text-red-600 font-bold" : "text-gray-600"
            }`}>
              {timeRemaining}s
            </span>
          </div>
        )}
      </div>

      {/* Timer Progress */}
      {timeLimit && question.mode !== "sentence-building" && question.mode !== "stroke-order" && (
        <Progress
          value={progressPercent}
          className={progressPercent <= 20 ? "bg-red-200" : ""}
        />
      )}

      <Card className="p-6 space-y-6">
        {/* Question */}
        <div className="text-center">
          {question.mode === "listening" && (
            <Button
              variant="outline"
              size="lg"
              onClick={playQuestionAudio}
              className="mb-4 gap-2"
            >
              <Volume2 className="h-5 w-5" />
              Play Audio
            </Button>
          )}

          <h2 className={`font-bold mb-2 text-foreground ${
            question.mode === "sentence-building"
              ? "text-2xl"
              : question.contentType === "kanji"
              ? "text-7xl"
              : "text-3xl"
          }`}>
            {question.question}
          </h2>

            {/* Show stroke count for kanji questions (except stroke-order mode) */}
            {question.contentType === "kanji" &&
             question.mode !== "stroke-order" &&
             "strokeCount" in question.card && (
              <p className="text-sm text-muted-foreground mt-2">
                Stroke count: {question.card.strokeCount}
              </p>
            )}

            {/* Show readings for kanji questions - always visible, regardless of direction */}
            {question.contentType === "kanji" &&
             question.mode !== "stroke-order" &&
             "onReadings" in question.card &&
             "kunReadings" in question.card && (
              <div className="text-sm text-muted-foreground mt-3 space-x-3">
                {question.card.onReadings.length > 0 && (
                  <span className="inline-block">
                    <span className="font-semibold">音:</span> {question.card.onReadings.join(", ")}
                  </span>
                )}
                {question.card.kunReadings.length > 0 && (
                  <span className="inline-block">
                    <span className="font-semibold">訓:</span> {question.card.kunReadings.join(", ")}
                  </span>
                )}
              </div>
            )}
        </div>

        {/* Hint for sentence-completion mode */}
        {question.mode === "sentence-completion" && question.hint && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {question.hint}
            </p>
          </div>
        )}

        {/* Answer Options */}
        {question.mode === "multiple-choice" && question.choices && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoiceClick(choice)}
                disabled={hasAnswered || disabled}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedAnswer === choice
                    ? hasAnswered
                      ? isCorrect
                        ? "border-green-600 bg-green-50 dark:bg-green-950/20"
                        : "border-red-600 bg-red-50 dark:bg-red-950/20"
                      : "border-purple-600 bg-purple-50 dark:bg-purple-950/20"
                    : hasAnswered && choice === question.correctAnswer
                    ? "border-green-600 bg-green-50 dark:bg-green-950/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                } ${hasAnswered || disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    selectedAnswer === choice
                      ? hasAnswered
                        ? isCorrect
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                        : "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1 text-foreground font-medium">{choice}</span>
                  {hasAnswered && choice === question.correctAnswer && (
                    <Check className="h-5 w-5 text-green-600" />
                  )}
                  {hasAnswered && selectedAnswer === choice && !isCorrect && (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Typing Input */}
        {(question.mode === "typing" || question.mode === "sentence-completion") && (
          <div className="space-y-3">
            <Input
              type="text"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTypingSubmit()}
              placeholder="Type your answer..."
              disabled={hasAnswered || disabled}
              className="text-lg text-center"
              autoFocus
            />
            {hasAnswered && (
              <div className={`text-center p-3 rounded-lg ${
                validationLevel === "correct"
                  ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300"
                  : validationLevel === "close"
                  ? "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300"
                  : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300"
              }`}>
                {validationLevel === "correct" ? (
                  <div className="flex items-center justify-center gap-2">
                    <Check className="h-5 w-5" />
                    <span>Correct!</span>
                  </div>
                ) : validationLevel === "close" ? (
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Check className="h-5 w-5" />
                      <span className="font-semibold">Close!</span>
                    </div>
                    {validationHint && (
                      <div className="text-sm bg-orange-100 dark:bg-orange-900/30 p-2 rounded border border-orange-200 dark:border-orange-800">
                        💡 {validationHint}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <X className="h-5 w-5" />
                      <span>Incorrect</span>
                    </div>
                    <div className="text-sm">
                      Correct answer: {Array.isArray(question.correctAnswer)
                        ? question.correctAnswer.join(" or ")
                        : question.correctAnswer}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Listening Options */}
        {question.mode === "listening" && question.choices && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoiceClick(choice)}
                disabled={hasAnswered || disabled}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedAnswer === choice
                    ? hasAnswered
                      ? isCorrect
                        ? "border-green-600 bg-green-50 dark:bg-green-950/20"
                        : "border-red-600 bg-red-50 dark:bg-red-950/20"
                      : "border-purple-600 bg-purple-50 dark:bg-purple-950/20"
                    : hasAnswered && choice === question.correctAnswer
                    ? "border-green-600 bg-green-50 dark:bg-green-950/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                } ${hasAnswered || disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                {choice}
              </button>
            ))}
          </div>
        )}

        {/* Sentence Building (Drag and Drop) */}
        {question.mode === "sentence-building" && question.scrambledWords && (
          <SentenceBuilder
            key={question.id}
            words={question.scrambledWords}
            correctOrder={Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer]}
            hint={question.hint}
            onSubmit={handleSentenceBuilderSubmit}
            onNext={onNext}
            disabled={disabled}
            showHints={showHints}
          />
        )}

        {/* Stroke Order (Kanji Drawing) */}
        {question.mode === "stroke-order" && question.contentType === "kanji" && "strokes" in question.card && (
          <KanjiDrawing
            key={question.id}
            kanji={question.card.kanji}
            svgPath={question.card.strokes.svgPath}
            strokeCount={question.card.strokeCount}
            onReadings={question.card.onReadings}
            kunReadings={question.card.kunReadings}
            onSubmit={handleStrokeOrderSubmit}
            disabled={hasAnswered || disabled}
            showReference={false}
          />
        )}

        {/* Flashcard Mode */}
        {question.mode === "flashcard" && (
          <div className="space-y-4">
            <div
              className="relative min-h-[300px] cursor-pointer perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
              >
                {/* Front of card */}
                <div
                  className={`absolute w-full backface-hidden ${isFlipped ? "invisible" : "visible"}`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-xl border-2 border-purple-200 dark:border-purple-800 min-h-[300px] flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground mb-4">Front</p>
                    <p className="text-5xl font-bold text-center mb-4">{question.question}</p>
                    <p className="text-sm text-muted-foreground mt-8 flex items-center gap-2">
                      👆 Click to flip
                    </p>
                  </div>
                </div>

                {/* Back of card */}
                <div
                  className={`absolute w-full backface-hidden ${isFlipped ? "visible" : "invisible"}`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-200 dark:border-green-800 min-h-[300px] flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground mb-4">Back</p>
                    <p className="text-4xl font-bold text-center mb-6">{question.correctAnswer}</p>
                    {question.hint && (
                      <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg max-w-md">
                        <p className="text-sm text-muted-foreground">{question.hint}</p>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground mt-8 flex items-center gap-2">
                      👆 Click to flip back
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Self-assessment buttons */}
            {isFlipped && (
              <div className="space-y-3">
                <p className="text-sm text-center text-muted-foreground font-medium">
                  How well did you know this?
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCorrect(false)
                      setHasAnswered(true)
                      const time = Date.now() - startTimeRef.current
                      onAnswer("wrong", time, hintsUsed)
                    }}
                    className="h-auto py-4 flex-col border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/20"
                    disabled={hasAnswered || disabled}
                  >
                    <X className="h-6 w-6 text-red-600 mb-1" />
                    <span className="text-sm font-semibold">Didn't Know</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCorrect(true)
                      setHasAnswered(true)
                      const time = Date.now() - startTimeRef.current
                      onAnswer("partial", time, hintsUsed)
                    }}
                    className="h-auto py-4 flex-col border-yellow-200 hover:bg-yellow-50 dark:border-yellow-800 dark:hover:bg-yellow-950/20"
                    disabled={hasAnswered || disabled}
                  >
                    <div className="text-2xl mb-1">😐</div>
                    <span className="text-sm font-semibold">Sort of</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCorrect(true)
                      setHasAnswered(true)
                      const time = Date.now() - startTimeRef.current
                      const answer = Array.isArray(question.correctAnswer)
                        ? question.correctAnswer[0]
                        : question.correctAnswer
                      onAnswer(answer, time, hintsUsed)
                    }}
                    className="h-auto py-4 flex-col border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950/20"
                    disabled={hasAnswered || disabled}
                  >
                    <Check className="h-6 w-6 text-green-600 mb-1" />
                    <span className="text-sm font-semibold">Knew It!</span>
                  </Button>
                </div>
              </div>
            )}

            {/* After self-assessment */}
            {hasAnswered && (
              <div className="text-center">
                <Button
                  onClick={onNext}
                  className="gap-2"
                  size="lg"
                >
                  Next Card
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Hint (hidden for sentence-building, stroke-order, and flashcard as they have their own) */}
        {showHints && question.hint && question.mode !== "sentence-building" && question.mode !== "stroke-order" && question.mode !== "flashcard" && (
          <div className="text-center">
            {!showHint ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleHintClick}
                className="gap-2"
                disabled={hasAnswered || disabled}
              >
                <Lightbulb className="h-4 w-4" />
                Show Hint
              </Button>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <div className="flex items-start gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                  <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{question.hint}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons (hidden for sentence-building, stroke-order, and flashcard which have their own) */}
        {question.mode !== "sentence-building" && question.mode !== "stroke-order" && question.mode !== "flashcard" && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkipClick}
              disabled={hasAnswered || disabled}
              className="gap-2"
            >
              <SkipForward className="h-4 w-4" />
              Skip
              <kbd className="hidden sm:inline ml-1 px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded border">
                Space
              </kbd>
            </Button>

            {question.mode === "multiple-choice" || question.mode === "listening" ? (
              <Button
                onClick={() => handleSubmit()}
                disabled={!selectedAnswer || hasAnswered || disabled}
                className="flex-1 gap-2"
              >
                {hasAnswered ? "Next" : "Submit"}
                <ChevronRight className="h-4 w-4" />
                <kbd className="hidden sm:inline ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded border border-white/30">
                  Enter
                </kbd>
              </Button>
            ) : (
              <Button
                onClick={handleTypingSubmit}
                disabled={!typedAnswer.trim() || hasAnswered || disabled}
                className="flex-1 gap-2"
              >
                {hasAnswered ? "Next" : "Submit"}
                <ChevronRight className="h-4 w-4" />
                <kbd className="hidden sm:inline ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded border border-white/30">
                  Enter
                </kbd>
              </Button>
            )}
          </div>
        )}

        {/* Keyboard shortcuts hint */}
        {question.mode === "multiple-choice" && !hasAnswered && (
          <p className="text-xs text-center text-muted-foreground">
            Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">1-{question.choices?.length || 4}</kbd> to select, <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to submit, <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Space</kbd> to skip
          </p>
        )}
      </Card>
    </div>
  )
}
