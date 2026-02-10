"use client"

import { useState } from "react"
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react"
import { DlingoWord, LearningDirection } from "@/types/dlingo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SingleCardViewProps {
  words: DlingoWord[]
  direction: LearningDirection
  currentIndex: number
  onNavigate: (index: number) => void
  showAllAnswers: boolean
  showExamples: boolean
}

export function SingleCardView({ words, direction, currentIndex, onNavigate, showAllAnswers, showExamples }: SingleCardViewProps) {
  const [localShowAnswer, setLocalShowAnswer] = useState(false)

  // Use global control if set, otherwise use local state
  const showAnswer = showAllAnswers || localShowAnswer

  if (words.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No words to display.
        </p>
      </div>
    )
  }

  const word = words[currentIndex]
  const isEnToJp = direction === 'en-to-jp'

  const question = isEnToJp ? word.english : word.japanese
  const answer = isEnToJp ? word.japanese : word.english

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1)
      setLocalShowAnswer(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      onNavigate(currentIndex + 1)
      setLocalShowAnswer(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Word <span className="font-semibold text-purple-600 dark:text-purple-400">{currentIndex + 1}</span> of {words.length}
          </p>
        </div>

        <Button
          onClick={handleNext}
          disabled={currentIndex === words.length - 1}
          variant="outline"
          className="gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Word Card */}
      <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
        <CardContent className="space-y-6 pt-6">
          {/* Type badge - subtle and top-right */}
          <div className="flex justify-end -mt-2 -mr-2">
            <Badge variant="outline" className="text-xs opacity-40">
              {word.type}
              {word.subtype && (
                <span className="ml-1">({word.subtype})</span>
              )}
            </Badge>
          </div>

          {/* Question */}
          <div className="-mt-2">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-3 opacity-50">
              {isEnToJp ? 'English' : 'Japanese'}
            </p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {question}
            </p>
          </div>

          {/* Answer */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 opacity-50">
                {isEnToJp ? 'Japanese' : 'English'}
              </p>
              <Button
                onClick={() => setLocalShowAnswer(!localShowAnswer)}
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-purple-100 dark:hover:bg-purple-900"
                disabled={showAllAnswers}
              >
                {showAnswer ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Show
                  </>
                )}
              </Button>
            </div>
            {showAnswer ? (
              <p className="text-3xl font-semibold text-purple-600 dark:text-purple-400">
                {answer}
              </p>
            ) : (
              <div className="flex items-center justify-center h-16 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Eye className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Example Sentences */}
      {showExamples && word.exampleSentences && word.exampleSentences.length > 0 && (
        <Card className="border-2">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-4 opacity-50">
              📝 Example Sentences
            </h3>
            <div className="space-y-6">
              {word.exampleSentences.map((example, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                >
                  {/* Japanese sentence */}
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {example.japanese}
                  </p>

                  {/* English translation */}
                  <p className="text-base text-gray-600 dark:text-gray-300 italic mb-6">
                    {example.english}
                  </p>

                  {/* Related tip */}
                  {example.relatedTip && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 mb-6">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        💡 <span className="font-medium">Tip:</span> {example.relatedTip}
                      </p>
                    </div>
                  )}

                  {/* Example details - bottom right, faint */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-30">
                    {example.context && (
                      <Badge
                        variant="outline"
                        className="text-xs h-5 px-1.5"
                      >
                        {example.context === 'question' && 'Q'}
                        {example.context === 'answer' && 'A'}
                        {example.context === 'statement' && 'S'}
                      </Badge>
                    )}
                    {example.level && (
                      <Badge variant="outline" className="text-xs h-5 px-1.5">
                        {example.level}
                      </Badge>
                    )}
                    {example.isAIGenerated && (
                      <Badge variant="outline" className="text-xs h-5 px-1.5">
                        AI
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Footer (duplicate for convenience) */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentIndex === words.length - 1}
          variant="outline"
          className="gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
