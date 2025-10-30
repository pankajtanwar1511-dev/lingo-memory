"use client"

import { useState, useEffect, useRef } from "react"
import { Check, X, Volume2, RotateCcw, HelpCircle, ChevronRight, RefreshCw, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface SentenceBuilderProps {
  words: string[]
  correctOrder: string[]
  hint?: string
  onSubmit: (userOrder: string[], isCorrect: boolean) => void
  onNext?: () => void
  disabled?: boolean
  showHints?: boolean
}

interface WordItem {
  id: string
  word: string
  isParticle: boolean
  originalIndex: number
  width?: number // Store exact width
}

/**
 * Sortable word component for answer area
 */
function SortableAnswerWord({
  item,
  onClick
}: {
  item: WordItem
  onClick: () => void
}) {
  const particles = [
    "は", "が", "を", "に", "へ", "で", "と", "から", "まで", "より",
    "も", "か", "ね", "よ", "な", "の", "や", "ば", "けど", "けれど"
  ]

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative"
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        className={`
          px-4 rounded-lg border-2
          transition-all select-none
          h-[52px] flex items-center justify-center
          cursor-grab active:cursor-grabbing
          ${item.isParticle
            ? "bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
            : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          }
          hover:border-red-400 dark:hover:border-red-500 hover:scale-105
          ${isDragging ? "shadow-lg z-50" : "shadow-sm"}
        `}
      >
        <span className="text-lg font-medium whitespace-nowrap leading-none">{item.word}</span>
      </button>
    </div>
  )
}

/**
 * Sentence Builder Component
 * - Word Bank: Tap to add (leaves exact-size gray placeholder)
 * - Answer Area: Tap to remove, Drag to reorder
 */
export function SentenceBuilder({
  words,
  correctOrder,
  hint,
  onSubmit,
  onNext,
  disabled = false,
  showHints = true,
}: SentenceBuilderProps) {
  // Japanese particles to highlight
  const particles = [
    "は", "が", "を", "に", "へ", "で", "と", "から", "まで", "より",
    "も", "か", "ね", "よ", "な", "の", "や", "ば", "けど", "けれど"
  ]

  // Create word items with IDs, particle detection, and original positions
  const initialItems: WordItem[] = words.map((word, index) => ({
    id: `word-${index}`,
    word,
    isParticle: particles.includes(word),
    originalIndex: index
  }))

  const [wordBank, setWordBank] = useState<(WordItem | null)[]>(initialItems)
  const [answerArea, setAnswerArea] = useState<WordItem[]>([])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [wordWidths, setWordWidths] = useState<{ [key: string]: number }>({})
  const [showTutorial, setShowTutorial] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)

  const wordRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  // Check if tutorial should be shown on first mount
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('sentenceBuilderTutorialSeen')
    if (!hasSeenTutorial) {
      setShowTutorial(true)
    }
  }, [])

  // Measure word widths after mount
  useEffect(() => {
    const widths: { [key: string]: number } = {}
    initialItems.forEach(item => {
      const element = wordRefs.current[item.id]
      if (element) {
        widths[item.id] = element.offsetWidth
      }
    })
    setWordWidths(widths)
  }, []) // Only run once on mount

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Very small distance for responsive drag
      },
    })
  )

  const handleWordBankClick = (item: WordItem, index: number) => {
    if (hasSubmitted || disabled) return

    // Replace word with null placeholder to maintain position
    setWordBank(prev => {
      const newBank = [...prev]
      newBank[index] = null
      return newBank
    })
    setAnswerArea(prev => [...prev, item])
  }

  const handleAnswerAreaClick = (item: WordItem) => {
    if (hasSubmitted || disabled) return

    // Remove word from answer area
    setAnswerArea(prev => prev.filter(w => w.id !== item.id))

    // Return word to its original position in word bank
    setWordBank(prev => {
      const newBank = [...prev]
      newBank[item.originalIndex] = item
      return newBank
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setAnswerArea((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSubmit = () => {
    const userOrder = answerArea.map((item) => item.word)
    const correct = userOrder.join("") === correctOrder.join("")

    setIsCorrect(correct)
    setHasSubmitted(true)
    onSubmit(userOrder, correct)
  }

  const handleReset = () => {
    // Re-create items from props to get fresh scrambling
    const freshItems: WordItem[] = words.map((word, index) => ({
      id: `word-${index}-${Date.now()}`,
      word,
      isParticle: particles.includes(word),
      originalIndex: index
    }))
    setWordBank(freshItems)
    setAnswerArea([])
    setHasSubmitted(false)
    setIsCorrect(false)
    setShowHint(false)
  }

  const handleRetry = () => {
    // Clear answer area and return all words to bank
    const freshItems: WordItem[] = words.map((word, index) => ({
      id: `word-${index}`,
      word,
      isParticle: particles.includes(word),
      originalIndex: index
    }))

    // Remeasure widths for fresh items
    setTimeout(() => {
      const widths: { [key: string]: number } = {}
      freshItems.forEach(item => {
        const element = wordRefs.current[item.id]
        if (element) {
          widths[item.id] = element.offsetWidth
        }
      })
      setWordWidths(widths)
    }, 0)

    setWordBank(freshItems)
    setAnswerArea([])
    setHasSubmitted(false)
    setIsCorrect(false)
    setShowCorrectAnswer(false)
    setShowHint(false)
  }

  const handleCloseTutorial = () => {
    if (dontShowAgain) {
      localStorage.setItem('sentenceBuilderTutorialSeen', 'true')
    }
    setShowTutorial(false)
  }

  const canSubmit = !hasSubmitted && !disabled && answerArea.length > 0

  const renderWordBankWord = (item: WordItem, onClick: () => void) => (
    <button
      key={item.id}
      ref={el => wordRefs.current[item.id] = el}
      onClick={onClick}
      disabled={hasSubmitted || disabled}
      style={wordWidths[item.id] ? { width: `${wordWidths[item.id]}px` } : undefined}
      className={`
        px-4 rounded-lg border-2
        transition-all select-none
        h-[52px] flex items-center justify-center
        ${item.isParticle
          ? "bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        }
        ${hasSubmitted || disabled
          ? "opacity-60 cursor-not-allowed"
          : "cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:scale-105 active:scale-95"
        }
        shadow-sm
      `}
    >
      <span className="text-lg font-medium whitespace-nowrap leading-none">{item.word}</span>
    </button>
  )

  const renderGrayPlaceholder = (wordId: string) => {
    const width = wordWidths[wordId]
    return (
      <div
        key={`placeholder-${wordId}`}
        style={width ? { width: `${width}px` } : undefined}
        className="px-4 py-3 rounded-lg bg-gray-300 dark:bg-gray-700 h-[52px]"
        aria-hidden="true"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Tutorial Dialog */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              How to Build Sentences
            </DialogTitle>
            <DialogDescription className="text-left space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👆</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Tap to Add</p>
                  <p className="text-sm">Tap any word in the Word Bank to add it to your answer</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">↔️</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Drag to Reorder</p>
                  <p className="text-sm">Drag words in your answer to change their order</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Tap to Remove</p>
                  <p className="text-sm">Tap a word in your answer to return it to the Word Bank</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-2 border-t">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-sm">
                    Words in <span className="text-purple-600 dark:text-purple-400 font-semibold">purple</span> are Japanese particles (は、を、に, etc.)
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3 items-start">
            <Checkbox
              id="dontShow"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              label="Don't show this again"
            />
            <Button onClick={handleCloseTutorial} className="w-full">
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Answer Area with Drag and Drop */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Answer:
        </label>
        <div className="min-h-[100px] p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-300 dark:border-blue-700">
          {answerArea.length === 0 ? (
            <div className="min-h-[68px] flex items-start justify-center pt-2 text-gray-400 dark:text-gray-600 text-sm">
              Tap words below to build the sentence
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={answerArea.map(item => item.id)}
                strategy={horizontalListSortingStrategy}
                disabled={hasSubmitted || disabled}
              >
                <div className="flex flex-wrap gap-3 justify-center items-start min-h-[68px]">
                  {answerArea.map((item) => (
                    <SortableAnswerWord
                      key={item.id}
                      item={item}
                      onClick={() => handleAnswerAreaClick(item)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Word Bank with Exact-Size Gray Placeholders */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Word Bank:
        </label>
        <div className="min-h-[100px] p-4 bg-white dark:bg-gray-900/30 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-3 justify-center items-start min-h-[52px]">
            {wordBank.map((item, index) =>
              item === null
                ? renderGrayPlaceholder(initialItems[index].id)
                : renderWordBankWord(item, () => handleWordBankClick(item, index))
            )}
          </div>
        </div>
      </div>

      {/* Hint */}
      {showHints && hint && (
        <div className="text-center">
          {!showHint ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHint(true)}
              disabled={hasSubmitted || disabled}
              className="gap-2"
            >
              <Volume2 className="h-4 w-4" />
              Show Translation
            </Button>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Hint:</strong> {hint}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Fixed Height Feedback Area - Shows result banner OR correct answer */}
      <div className="min-h-[120px]">
        {hasSubmitted && !showCorrectAnswer && (
          /* Result Banner - only when not showing full answer */
          <div
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
              isCorrect
                ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300"
                : "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300"
            }`}
          >
            {isCorrect ? (
              <>
                <Check className="h-5 w-5" />
                <span className="font-semibold">Perfect! 完璧です！</span>
              </>
            ) : (
              <>
                <X className="h-5 w-5" />
                <span className="font-semibold">Not quite right</span>
              </>
            )}
          </div>
        )}

        {/* Show Correct Answer (when toggled) */}
        {hasSubmitted && showCorrectAnswer && (
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-2 font-medium">Correct sentence:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {correctOrder.map((word, index) => (
                <span
                  key={index}
                  className={`px-3 py-2 rounded-lg text-base font-medium ${
                    particles.includes(word)
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - Fixed Position */}
      <div className="relative">
        {/* Reset button - Bottom left corner (only before submission) */}
        {!hasSubmitted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            disabled={disabled}
            className="absolute left-0 bottom-0 text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400"
            title="Reset"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        )}

        <div className="flex justify-center pt-2">
          {!hasSubmitted ? (
            /* Before submission: Check Answer button */
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="gap-2 min-w-[140px]"
            >
              <Check className="h-4 w-4" />
              Check Answer
            </Button>
          ) : (
            /* After submission: 3 action buttons */
            <div className="flex gap-3">
              {!isCorrect && (
                <Button
                  onClick={handleRetry}
                  variant="default"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
              )}
              <Button
                onClick={() => setShowCorrectAnswer(!showCorrectAnswer)}
                variant="outline"
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                {showCorrectAnswer ? "Hide" : "Show"} Answer
              </Button>
              <Button
                onClick={onNext}
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
