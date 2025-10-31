"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useBookmarksStore } from "@/store/bookmarks-store"
import {
  QuizSettings,
  QuizContentType,
  QuizMode,
  QuizDirection,
  QuizDifficulty,
  DEFAULT_QUIZ_DIFFICULTY_CONFIG
} from "@/types/quiz"
import { quizPresets, type QuizPreset } from "@/lib/quiz-presets"
import { directionMetadata } from "@/lib/direction-metadata"
import {
  Play,
  Settings2,
  Zap,
  Brain,
  Headphones,
  Keyboard,
  Book,
  Languages,
  Puzzle,
  Pen,
  ArrowRight,
  Lock
} from "lucide-react"

type DirectionOption = "kanji" | "kana" | "english"

interface QuizSetupProps {
  onStart: (settings: QuizSettings) => void
  availableVocabCount: number
  availableKanjiCount: number
}

export function QuizSetup({ onStart, availableVocabCount, availableKanjiCount }: QuizSetupProps) {
  const [contentType, setContentType] = useState<QuizContentType>("vocabulary")
  const [mode, setMode] = useState<QuizMode>("multiple-choice")
  const [direction, setDirection] = useState<QuizDirection>("japanese-to-english")
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("medium")
  const [jlptLevel, setJlptLevel] = useState<string>("All")
  const [questionCount, setQuestionCount] = useState(20)
  const [timeLimit, setTimeLimit] = useState<number | undefined>(60)
  const [showHints, setShowHints] = useState(true)
  const [playAudio, setPlayAudio] = useState(true)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [strictTyping, setStrictTyping] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const [kanaOnly, setKanaOnly] = useState(false)
  const [smartMode, setSmartMode] = useState(false)
  const [dueCardsOnly, setDueCardsOnly] = useState(false)
  const [dueCardsCount, setDueCardsCount] = useState(0)

  // Direction selector state
  const [leftSelection, setLeftSelection] = useState<DirectionOption>("kanji")
  const [rightSelection, setRightSelection] = useState<DirectionOption>("english")

  // Get bookmark counts
  const { getBookmarkCounts } = useBookmarksStore()
  const bookmarkCounts = getBookmarkCounts()

  // Calculate available card count (raw, before direction filtering)
  const rawCardCount = contentType === "mixed"
    ? availableVocabCount + availableKanjiCount
    : contentType === "vocabulary"
    ? availableVocabCount
    : availableKanjiCount

  // We'll update this with actual filtered count from the parent component
  // For now, use raw count as fallback
  const availableCardCount = rawCardCount

  // Helper: Check if mode supports direction selection
  const shouldShowDirectionSelector = (quizMode: QuizMode): boolean => {
    // Modes that support all directions
    const directionalModes: QuizMode[] = ["multiple-choice", "typing", "flashcard"]
    return directionalModes.includes(quizMode)
  }

  // Helper: Get auto-direction for fixed modes
  const getAutoDirection = (quizMode: QuizMode): QuizDirection => {
    const autoDirections: Record<string, QuizDirection> = {
      "listening": "kanji-only-to-english",        // Listen to audio, answer English
      "sentence-completion": "kanji-only-to-english", // See sentence with blank, complete it
      "sentence-building": "english-to-kanji",     // See English, build Japanese
      "stroke-order": contentType === "kanji" ? "kanji-to-meaning" : "kanji-only-to-english"
    }
    return autoDirections[quizMode] || "kanji-only-to-english"
  }

  // Auto-set direction when mode changes to a fixed-direction mode
  useEffect(() => {
    if (!shouldShowDirectionSelector(mode)) {
      const autoDir = getAutoDirection(mode)
      setDirection(autoDir)
    }
  }, [mode, contentType])

  // Load due cards count for FSRS Smart Mode
  useEffect(() => {
    const loadDueCount = async () => {
      try {
        const { databaseService } = await import("@/services/database.service")
        const count = await databaseService.getDueCardsCount()
        setDueCardsCount(count)
      } catch (error) {
        console.error("Failed to load due cards count:", error)
      }
    }
    loadDueCount()
  }, [])

  // Convert left/right selections to QuizDirection
  const getQuizDirection = (left: DirectionOption, right: DirectionOption): QuizDirection => {
    // For kanji content type, use specific kanji directions
    if (contentType === "kanji") {
      const key = `${left}-to-${right}`
      const kanjiMap: Record<string, QuizDirection> = {
        "kanji-to-kana": "kanji-to-reading",
        "kanji-to-english": "kanji-to-meaning",
        "kana-to-kanji": "reading-to-kanji",
        "kana-to-english": "kanji-to-meaning", // Show kana reading, answer with meaning
        "english-to-kanji": "meaning-to-kanji",
        "english-to-kana": "meaning-to-kanji", // Answer is kanji, but we can show readings
      }
      return kanjiMap[key] || "kanji-to-meaning"
    }

    // For vocabulary/mixed content type
    const key = `${left}-to-${right}`
    const vocabMap: Record<string, QuizDirection> = {
      "kanji-to-kana": "kanji-to-reading",        // Show kanji, answer with kana
      "kanji-to-english": "kanji-only-to-english", // Show ONLY kanji, answer English
      "kana-to-kanji": "reading-to-kanji",        // Show kana, answer with kanji
      "kana-to-english": "kana-only-to-english",  // Show ONLY kana, answer English
      "english-to-kanji": "english-to-kanji",     // Show English, answer ONLY kanji
      "english-to-kana": "english-to-kana",       // Show English, answer ONLY kana
    }
    return vocabMap[key] || "kana-only-to-english"
  }

  // Get available options for left and right based on content type
  const getAvailableOptions = (): { left: DirectionOption[], right: DirectionOption[] } => {
    // All content types support the same 3 options
    const allOptions: DirectionOption[] = ["kanji", "kana", "english"]
    return {
      left: allOptions,
      right: allOptions
    }
  }

  // Handle selection changes
  const handleLeftSelection = (option: DirectionOption) => {
    // Left side ALWAYS gets priority - can select any option
    setLeftSelection(option)

    // If the new left selection conflicts with current right selection,
    // auto-switch right to the next available option
    if (option === rightSelection) {
      const availableRightOptions = getAvailableOptions().right.filter(o => o !== option)
      // Prefer the first available option that's different from left
      const newRight = availableRightOptions[0]
      setRightSelection(newRight)
      setDirection(getQuizDirection(option, newRight))
    } else {
      // No conflict - just update direction
      setDirection(getQuizDirection(option, rightSelection))
    }
  }

  const handleRightSelection = (option: DirectionOption) => {
    // Right side selection must not conflict with left
    // This is already enforced by disabled array, but double-check here
    if (option === leftSelection) {
      return // Don't allow selecting the same as left
    }

    setRightSelection(option)
    setDirection(getQuizDirection(leftSelection, option))
  }

  // Reset direction when content type changes
  const handleContentTypeChange = (newType: QuizContentType) => {
    setContentType(newType)
    // Set appropriate default selections for content type
    if (newType === "kanji") {
      setLeftSelection("kanji")
      setRightSelection("english")
      setDirection("kanji-to-meaning")
    } else {
      // vocabulary or mixed - default to kanji → english
      setLeftSelection("kanji")
      setRightSelection("english")
      setDirection("japanese-to-english")
    }
  }

  // Update settings based on difficulty
  const handleDifficultyChange = (newDifficulty: QuizDifficulty) => {
    setDifficulty(newDifficulty)
    const config = DEFAULT_QUIZ_DIFFICULTY_CONFIG[newDifficulty]
    setQuestionCount(Math.min(config.questionCount, availableCardCount))
    setTimeLimit(config.timeLimit || undefined)
    setShowHints(config.showHints)
  }

  // Apply a preset configuration
  const handlePresetClick = (preset: QuizPreset) => {
    // Set all settings from preset directly (don't use handleContentTypeChange)
    // Order matters: set mode and direction AFTER content type to prevent overrides
    setContentType(preset.contentType)

    // Update direction selector state first (before setting mode)
    if (shouldShowDirectionSelector(preset.mode)) {
      // Parse direction to set left/right selections
      const directionMap: Record<QuizDirection, { left: DirectionOption; right: DirectionOption }> = {
        "kanji-only-to-english": { left: "kanji", right: "english" },
        "kana-only-to-english": { left: "kana", right: "english" },
        "kanji-to-reading": { left: "kanji", right: "kana" },
        "reading-to-kanji": { left: "kana", right: "kanji" },
        "english-to-kanji": { left: "english", right: "kanji" },
        "english-to-kana": { left: "english", right: "kana" },
        "kanji-to-meaning": { left: "kanji", right: "english" },
        "meaning-to-kanji": { left: "english", right: "kanji" },
        "japanese-to-english": { left: "kanji", right: "english" },
        "english-to-japanese": { left: "english", right: "kanji" },
      }

      const selections = directionMap[preset.direction]
      if (selections) {
        setLeftSelection(selections.left)
        setRightSelection(selections.right)
      }
    }

    // Now set mode and direction
    setMode(preset.mode)
    setDirection(preset.direction)
    setDifficulty(preset.difficulty)
    setQuestionCount(Math.min(preset.questionCount, availableCardCount))

    // Apply difficulty config
    const config = DEFAULT_QUIZ_DIFFICULTY_CONFIG[preset.difficulty]
    setTimeLimit(config.timeLimit || undefined)
    setShowHints(config.showHints)
  }

  const handleStart = () => {
    const settings: QuizSettings = {
      contentType,
      mode,
      direction,
      difficulty,
      jlptLevel,
      questionCount: Math.min(questionCount, availableCardCount),
      timeLimit,
      showHints,
      playAudio,
      autoAdvance,
      strictTyping,
      caseSensitive,
      bookmarkedOnly,
      kanaOnly,
      smartMode,
      dueCardsOnly
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
        {/* Content Type */}
        <div>
          <label className="text-sm font-medium mb-3 block">Content Type</label>
          <div className="grid grid-cols-3 gap-3">
            <ModeCard
              icon={<Book className="h-5 w-5" />}
              title="Vocabulary"
              description={`${availableVocabCount} words available`}
              selected={contentType === "vocabulary"}
              onClick={() => handleContentTypeChange("vocabulary")}
            />
            <ModeCard
              icon={<Languages className="h-5 w-5" />}
              title="Kanji"
              description={`${availableKanjiCount} characters available`}
              selected={contentType === "kanji"}
              onClick={() => handleContentTypeChange("kanji")}
            />
            <ModeCard
              icon={<Brain className="h-5 w-5" />}
              title="Mixed"
              description={`${availableVocabCount + availableKanjiCount} total cards`}
              selected={contentType === "mixed"}
              onClick={() => handleContentTypeChange("mixed")}
            />
          </div>
        </div>

        {/* Quick Start Presets */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 rounded-lg border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <label className="text-sm font-semibold text-purple-900 dark:text-purple-100">
              Quick Start Presets
            </label>
            <Badge variant="secondary" className="text-xs">Recommended</Badge>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-300 mb-3">
            Click a preset to quickly configure your quiz
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {quizPresets.map((preset) => (
              <Button
                key={preset.id}
                variant="outline"
                size="sm"
                onClick={() => handlePresetClick(preset)}
                className="h-auto py-2 px-3 flex flex-col items-start text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800"
              >
                <div className="flex items-center gap-1 w-full mb-1">
                  <span className="text-base shrink-0">{preset.icon}</span>
                  <span className="font-semibold text-xs flex-1 break-words">{preset.name}</span>
                  {directionMetadata[preset.direction] && (
                    <span className="text-xs shrink-0">
                      {"⭐".repeat(directionMetadata[preset.direction].difficultyStars)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground w-full break-words whitespace-normal">
                  {preset.description}
                </span>
              </Button>
            ))}
          </div>
        </div>

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
              disabled={contentType === "kanji"} // Disable for kanji
            />
            <ModeCard
              icon={<Book className="h-5 w-5" />}
              title="Sentence Fill"
              description="Complete the sentence"
              selected={mode === "sentence-completion"}
              onClick={() => setMode("sentence-completion")}
              disabled={contentType === "kanji"} // Only works with vocabulary
            />
            <ModeCard
              icon={<Puzzle className="h-5 w-5" />}
              title="Sentence Builder"
              description="Arrange words in order"
              selected={mode === "sentence-building"}
              onClick={() => setMode("sentence-building")}
              disabled={contentType === "kanji"} // Only works with vocabulary
            />
            <ModeCard
              icon={<Pen className="h-5 w-5" />}
              title="Stroke Order"
              description="Draw kanji strokes"
              selected={mode === "stroke-order"}
              onClick={() => setMode("stroke-order")}
              disabled={contentType !== "kanji"} // Only works with kanji
            />
          </div>
        </div>

        {/* JLPT Level Filter */}
        <div>
          <label className="text-sm font-medium mb-3 block">JLPT Level</label>
          <div className="grid grid-cols-3 gap-2">
            {["All", "N5", "N4", "N3", "N2", "N1"].map((level) => (
              <Button
                key={level}
                variant={jlptLevel === level ? "default" : "outline"}
                onClick={() => setJlptLevel(level)}
                size="sm"
                className={level === "All" ? "col-span-3" : ""}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Direction - Two Button Selector or Locked Display */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            Quiz Direction
            {!shouldShowDirectionSelector(mode) && (
              <span className="ml-2 text-xs text-muted-foreground">
                <Lock className="inline h-3 w-3 mr-1" />
                Auto-set for this mode
              </span>
            )}
          </label>

          {shouldShowDirectionSelector(mode) ? (
            <>
              <div className="flex items-center gap-3">
                {/* Left Button - Question/Prompt */}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-2 text-center">You see</p>
                  <DirectionButton
                    options={getAvailableOptions().left}
                    selected={leftSelection}
                    onSelect={handleLeftSelection}
                    disabled={[]} // Left side: all options always enabled
                  />
                </div>

                {/* Arrow */}
                <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-6" />

                {/* Right Button - Answer */}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-2 text-center">You answer</p>
                  <DirectionButton
                    options={getAvailableOptions().right}
                    selected={rightSelection}
                    onSelect={handleRightSelection}
                    disabled={[leftSelection]} // Right side: disable only the left selection
                  />
                </div>
              </div>

              {/* Direction Difficulty Badge */}
              {directionMetadata[direction] && (
                <div className="mt-3 flex items-center justify-center gap-2 p-2 bg-muted/30 rounded">
                  <Badge variant="secondary" className="text-xs">
                    {directionMetadata[direction].type === "recognition" ? "📖 Recognition" : "✍️ Production"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {"⭐".repeat(directionMetadata[direction].difficultyStars)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {directionMetadata[direction].shortDescription}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
              <p className="text-sm text-muted-foreground text-center">
                Direction is automatically set based on quiz mode
              </p>
            </div>
          )}

          {/* Dynamic Question Preview */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔍</span>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                Preview
              </p>
            </div>
            <QuizPreviewBox
              contentType={contentType}
              mode={mode}
              direction={direction}
            />
          </div>
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
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              Number of Questions: {questionCount}
            </label>
            {questionCount > 0 && (
              <Badge variant="outline" className="text-xs">
                ⏱️ ~{Math.ceil(questionCount * (timeLimit || 45) / 60)} min
              </Badge>
            )}
          </div>
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
          <Checkbox
            checked={bookmarkedOnly}
            onChange={(e) => setBookmarkedOnly(e.target.checked)}
            label={`Bookmarked only (${bookmarkCounts.total} cards)`}
            disabled={bookmarkCounts.total === 0}
          />

          {/* FSRS Smart Mode Options */}
          {contentType === "vocabulary" && (
            <>
              <div className="border-t pt-2 mt-2">
                <p className="text-xs text-muted-foreground mb-2">🧠 FSRS Smart Review</p>
              </div>
              <div>
                <Checkbox
                  checked={smartMode}
                  onChange={(e) => {
                    setSmartMode(e.target.checked)
                    // Auto-enable due cards filter when smart mode is enabled
                    if (e.target.checked) {
                      setDueCardsOnly(true)
                    }
                  }}
                  label="Smart Mode (FSRS)"
                />
                {smartMode && (
                  <p className="text-xs text-muted-foreground ml-6 mt-1">
                    Prioritizes cards based on spaced repetition algorithm
                  </p>
                )}
              </div>
              <Checkbox
                checked={dueCardsOnly}
                onChange={(e) => setDueCardsOnly(e.target.checked)}
                label={`Due cards only (${dueCardsCount} due for review)`}
                disabled={dueCardsCount === 0}
              />
            </>
          )}

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

          {mode === "sentence-building" && (
            <Checkbox
              checked={kanaOnly}
              onChange={(e) => setKanaOnly(e.target.checked)}
              label="Kana only (no kanji)"
            />
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
  disabled?: boolean
}

function ModeCard({ icon, title, description, selected, onClick, disabled }: ModeCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-4 rounded-lg border-2 transition-all text-left ${
        disabled
          ? "opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700"
          : selected
          ? "border-purple-600 bg-purple-50 dark:bg-purple-950/20"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          disabled
            ? "bg-gray-100 dark:bg-gray-800 text-gray-400"
            : selected
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

interface DirectionButtonProps {
  options: DirectionOption[]
  selected: DirectionOption
  onSelect: (option: DirectionOption) => void
  disabled: DirectionOption[]
}

function DirectionButton({ options, selected, onSelect, disabled }: DirectionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getLabel = (option: DirectionOption): string => {
    const labels: Record<DirectionOption, string> = {
      kanji: "漢字",
      kana: "かな",
      english: "English"
    }
    return labels[option]
  }

  const getDescription = (option: DirectionOption): string => {
    const descriptions: Record<DirectionOption, string> = {
      kanji: "Kanji",
      kana: "Kana",
      english: "English"
    }
    return descriptions[option]
  }

  const handleSelect = (option: DirectionOption) => {
    if (!disabled.includes(option)) {
      onSelect(option)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 rounded-lg border-2 border-purple-600 bg-purple-50 dark:bg-purple-950/20 text-left transition-all hover:border-purple-700"
      >
        <div className="text-center">
          <div className="text-2xl font-bold mb-1">{getLabel(selected)}</div>
          <div className="text-xs text-muted-foreground">{getDescription(selected)}</div>
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-lg">
            {options.map((option) => {
              const isDisabled = disabled.includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  disabled={isDisabled}
                  className={`w-full p-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    option === selected
                      ? "bg-purple-100 dark:bg-purple-900/30"
                      : isDisabled
                      ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-900"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">{getLabel(option)}</div>
                      <div className="text-xs text-muted-foreground">
                        {getDescription(option)}
                        {isDisabled && <span className="ml-2 text-red-500">(already selected on left)</span>}
                      </div>
                    </div>
                    {isDisabled && <Lock className="h-4 w-4 text-red-500" />}
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

interface QuizPreviewBoxProps {
  contentType: QuizContentType
  mode: QuizMode
  direction: QuizDirection
}

function QuizPreviewBox({ contentType, mode, direction }: QuizPreviewBoxProps) {
  // Get example question and answer based on settings
  const getPreviewContent = () => {
    // Example Japanese text based on content type
    const exampleKanji = contentType === "kanji" ? "犬" : "食べる"
    const exampleKana = contentType === "kanji" ? "いぬ" : "たべる"
    const exampleEnglish = contentType === "kanji" ? "dog" : "to eat"

    // Determine what to show based on direction
    let questionText = ""
    let answerText = ""

    switch (direction) {
      case "kanji-only-to-english":
      case "kanji-to-meaning":
        questionText = exampleKanji
        answerText = exampleEnglish
        break
      case "kana-only-to-english":
        questionText = exampleKana
        answerText = exampleEnglish
        break
      case "kanji-to-reading":
        questionText = exampleKanji
        answerText = exampleKana
        break
      case "reading-to-kanji":
        questionText = exampleKana
        answerText = exampleKanji
        break
      case "english-to-kanji":
      case "meaning-to-kanji":
        questionText = exampleEnglish
        answerText = exampleKanji
        break
      case "english-to-kana":
        questionText = exampleEnglish
        answerText = exampleKana
        break
      case "japanese-to-english":
        questionText = `${exampleKanji} (${exampleKana})`
        answerText = exampleEnglish
        break
      case "english-to-japanese":
        questionText = exampleEnglish
        answerText = `${exampleKanji} or ${exampleKana}`
        break
      default:
        questionText = `${exampleKanji} (${exampleKana})`
        answerText = exampleEnglish
    }

    return { questionText, answerText }
  }

  const { questionText, answerText } = getPreviewContent()

  // Render preview based on mode
  switch (mode) {
    case "multiple-choice":
      return (
        <div className="space-y-3">
          <div className="p-3 bg-white dark:bg-gray-900 rounded border border-blue-300 dark:border-blue-700">
            <p className="text-xs text-muted-foreground mb-1">Question:</p>
            <p className="text-lg font-bold text-center">{questionText}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Choose one:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 text-sm">
                A) Option 1
              </div>
              <div className="p-2 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 text-sm">
                B) {answerText}
              </div>
              <div className="p-2 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 text-sm">
                C) Option 3
              </div>
              <div className="p-2 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 text-sm">
                D) Option 4
              </div>
            </div>
          </div>
        </div>
      )

    case "typing":
      return (
        <div className="space-y-3">
          <div className="p-3 bg-white dark:bg-gray-900 rounded border border-blue-300 dark:border-blue-700">
            <p className="text-xs text-muted-foreground mb-1">Question:</p>
            <p className="text-lg font-bold text-center">{questionText}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">⌨️ Type your answer:</p>
            <div className="p-3 bg-white dark:bg-gray-900 rounded border-2 border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-sm text-gray-400 dark:text-gray-600 italic">
                {answerText}
              </p>
            </div>
          </div>
        </div>
      )

    case "listening":
      return (
        <div className="space-y-3">
          <div className="p-4 bg-white dark:bg-gray-900 rounded border border-blue-300 dark:border-blue-700 text-center">
            <p className="text-3xl mb-2">🔊</p>
            <p className="text-sm text-muted-foreground">Listen to audio</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Choose the meaning:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 text-sm">
                A) Option 1
              </div>
              <div className="p-2 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 text-sm">
                B) {answerText}
              </div>
            </div>
          </div>
        </div>
      )

    case "sentence-completion":
      return (
        <div className="space-y-3">
          <div className="p-3 bg-white dark:bg-gray-900 rounded border border-blue-300 dark:border-blue-700">
            <p className="text-xs text-muted-foreground mb-1">Complete the sentence:</p>
            <p className="text-base text-center">
              私は <span className="font-bold text-purple-600">____</span> が好きです
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              I like ____
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Fill in the blank:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 text-sm">
                A) りんご
              </div>
              <div className="p-2 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 text-sm">
                B) 犬
              </div>
            </div>
          </div>
        </div>
      )

    case "sentence-building":
      return (
        <div className="space-y-3">
          <div className="p-3 bg-white dark:bg-gray-900 rounded border border-blue-300 dark:border-blue-700">
            <p className="text-xs text-muted-foreground mb-1">Arrange in order:</p>
            <p className="text-sm text-center font-medium">{answerText}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">🧩 Drag words to arrange:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <div className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 rounded border border-purple-300 dark:border-purple-700 text-sm">
                です
              </div>
              <div className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 rounded border border-purple-300 dark:border-purple-700 text-sm">
                学生
              </div>
              <div className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 rounded border border-purple-300 dark:border-purple-700 text-sm">
                私は
              </div>
            </div>
          </div>
        </div>
      )

    case "stroke-order":
      return (
        <div className="space-y-3">
          <div className="p-4 bg-white dark:bg-gray-900 rounded border border-blue-300 dark:border-blue-700 text-center">
            <p className="text-xs text-muted-foreground mb-2">Draw this kanji:</p>
            <p className="text-5xl font-bold">犬</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-900 rounded border-2 border-dashed border-gray-300 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-600">✏️ Drawing canvas</p>
          </div>
        </div>
      )

    case "flashcard":
      return (
        <div className="space-y-3">
          <div className="p-4 bg-white dark:bg-gray-900 rounded border border-blue-300 dark:border-blue-700 text-center">
            <p className="text-xs text-muted-foreground mb-2">Front:</p>
            <p className="text-2xl font-bold">{questionText}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">👆 Click to flip</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-center opacity-50">
            <p className="text-xs text-muted-foreground mb-2">Back:</p>
            <p className="text-xl">{answerText}</p>
          </div>
        </div>
      )

    default:
      return (
        <div className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700">
          <p className="text-sm text-center text-muted-foreground">
            Preview not available for this mode
          </p>
        </div>
      )
  }
}
