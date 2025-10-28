"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  QuizSettings,
  QuizMode,
  QuizDirection,
  QuizDifficulty,
  DEFAULT_QUIZ_DIFFICULTY_CONFIG
} from "@/types/quiz"
import {
  Play,
  Settings2,
  Zap,
  Brain,
  Headphones,
  Keyboard,
  Book
} from "lucide-react"

interface QuizSetupProps {
  onStart: (settings: QuizSettings) => void
  availableCardCount: number
}

export function QuizSetup({ onStart, availableCardCount }: QuizSetupProps) {
  const [mode, setMode] = useState<QuizMode>("multiple-choice")
  const [direction, setDirection] = useState<QuizDirection>("japanese-to-english")
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("medium")
  const [questionCount, setQuestionCount] = useState(20)
  const [timeLimit, setTimeLimit] = useState<number | undefined>(60)
  const [showHints, setShowHints] = useState(true)
  const [playAudio, setPlayAudio] = useState(true)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [strictTyping, setStrictTyping] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)

  // Update settings based on difficulty
  const handleDifficultyChange = (newDifficulty: QuizDifficulty) => {
    setDifficulty(newDifficulty)
    const config = DEFAULT_QUIZ_DIFFICULTY_CONFIG[newDifficulty]
    setQuestionCount(Math.min(config.questionCount, availableCardCount))
    setTimeLimit(config.timeLimit || undefined)
    setShowHints(config.showHints)
  }

  const handleStart = () => {
    const settings: QuizSettings = {
      mode,
      direction,
      difficulty,
      questionCount: Math.min(questionCount, availableCardCount),
      timeLimit,
      showHints,
      playAudio,
      autoAdvance,
      strictTyping,
      caseSensitive
    }

    onStart(settings)
  }

  const maxQuestions = Math.min(availableCardCount, 100)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Quiz Setup</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your quiz settings and start learning
        </p>
        <Badge variant="secondary" className="mt-2">
          {availableCardCount} cards available
        </Badge>
      </div>

      <Card className="p-6 space-y-6">
        {/* Quiz Mode */}
        <div>
          <label className="text-sm font-medium mb-3 block">Quiz Mode</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <ModeCard
              icon={<Zap className="h-5 w-5" />}
              title="Multiple Choice"
              description="Choose from options"
              selected={mode === "multiple-choice"}
              onClick={() => setMode("multiple-choice")}
            />
            <ModeCard
              icon={<Keyboard className="h-5 w-5" />}
              title="Typing"
              description="Type the answer"
              selected={mode === "typing"}
              onClick={() => setMode("typing")}
            />
            <ModeCard
              icon={<Headphones className="h-5 w-5" />}
              title="Listening"
              description="Listen and answer"
              selected={mode === "listening"}
              onClick={() => setMode("listening")}
            />
          </div>
        </div>

        {/* Direction */}
        <div>
          <label className="text-sm font-medium mb-2 block">Quiz Direction</label>
          <Select value={direction} onChange={(e) => setDirection(e.target.value as QuizDirection)}>
            <option value="japanese-to-english">Japanese → English</option>
            <option value="english-to-japanese">English → Japanese</option>
            <option value="kanji-to-reading">Kanji → Reading</option>
            <option value="reading-to-kanji">Reading → Kanji</option>
          </Select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="text-sm font-medium mb-3 block">Difficulty</label>
          <div className="grid grid-cols-3 gap-3">
            <DifficultyCard
              title="Easy"
              description="No time limit, hints enabled"
              selected={difficulty === "easy"}
              onClick={() => handleDifficultyChange("easy")}
              color="green"
            />
            <DifficultyCard
              title="Medium"
              description="60s per question"
              selected={difficulty === "medium"}
              onClick={() => handleDifficultyChange("medium")}
              color="yellow"
            />
            <DifficultyCard
              title="Hard"
              description="30s, no hints"
              selected={difficulty === "hard"}
              onClick={() => handleDifficultyChange("hard")}
              color="red"
            />
          </div>
        </div>

        {/* Question Count */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Number of Questions: {questionCount}
          </label>
          <input
            type="range"
            min="5"
            max={maxQuestions}
            step="5"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5</span>
            <span>{maxQuestions}</span>
          </div>
        </div>

        {/* Time Limit */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Time Limit per Question (seconds)
          </label>
          <div className="flex items-center gap-3">
            <Checkbox
              checked={timeLimit !== undefined}
              onChange={(e) =>
                setTimeLimit(e.target.checked ? 60 : undefined)
              }
              label="Enable time limit"
            />
            {timeLimit !== undefined && (
              <Input
                type="number"
                min="10"
                max="300"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-24"
              />
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium block">Options</label>
          <Checkbox
            checked={showHints}
            onChange={(e) => setShowHints(e.target.checked)}
            label="Show hints"
          />
          <Checkbox
            checked={playAudio}
            onChange={(e) => setPlayAudio(e.target.checked)}
            label="Play audio automatically"
          />
          <Checkbox
            checked={autoAdvance}
            onChange={(e) => setAutoAdvance(e.target.checked)}
            label="Auto-advance to next question"
          />

          {mode === "typing" && (
            <>
              <Checkbox
                checked={strictTyping}
                onChange={(e) => setStrictTyping(e.target.checked)}
                label="Strict typing (exact match required)"
              />
              <Checkbox
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                label="Case sensitive"
              />
            </>
          )}
        </div>

        {/* Start Button */}
        <Button
          onClick={handleStart}
          className="w-full gap-2"
          size="lg"
        >
          <Play className="h-5 w-5" />
          Start Quiz
        </Button>
      </Card>
    </div>
  )
}

interface ModeCardProps {
  icon: React.ReactNode
  title: string
  description: string
  selected: boolean
  onClick: () => void
}

function ModeCard({ icon, title, description, selected, onClick }: ModeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all text-left ${
        selected
          ? "border-purple-600 bg-purple-50 dark:bg-purple-950/20"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          selected
            ? "bg-purple-600 text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600"
        }`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{title}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
            {description}
          </div>
        </div>
      </div>
    </button>
  )
}

interface DifficultyCardProps {
  title: string
  description: string
  selected: boolean
  onClick: () => void
  color: "green" | "yellow" | "red"
}

function DifficultyCard({
  title,
  description,
  selected,
  onClick,
  color
}: DifficultyCardProps) {
  const colors = {
    green: {
      border: "border-green-600",
      bg: "bg-green-50 dark:bg-green-950/20",
      badge: "bg-green-600"
    },
    yellow: {
      border: "border-yellow-600",
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
      badge: "bg-yellow-600"
    },
    red: {
      border: "border-red-600",
      bg: "bg-red-50 dark:bg-red-950/20",
      badge: "bg-red-600"
    }
  }

  const style = colors[color]

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all ${
        selected
          ? `${style.border} ${style.bg}`
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
      }`}
    >
      <div className="text-sm font-medium mb-1">{title}</div>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {description}
      </div>
    </button>
  )
}
