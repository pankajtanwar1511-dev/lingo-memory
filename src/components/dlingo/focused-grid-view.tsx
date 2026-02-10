"use client"

import { useState } from "react"
import { Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react"
import { DlingoWord, LearningDirection } from "@/types/dlingo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FocusedCardProps {
  word: DlingoWord
  direction: LearningDirection
  globalShowAllAnswers: boolean
  globalShowExamples: boolean
}

function FocusedCard({ word, direction, globalShowAllAnswers, globalShowExamples }: FocusedCardProps) {
  const [localShowAnswer, setLocalShowAnswer] = useState(false)
  const [localShowExamples, setLocalShowExamples] = useState(false)

  const isEnToJp = direction === 'en-to-jp'
  const question = isEnToJp ? word.english : word.japanese
  const answer = isEnToJp ? word.japanese : word.english

  // Use global controls if set, otherwise use local state
  const showAnswer = globalShowAllAnswers || localShowAnswer
  const showExamples = globalShowExamples || localShowExamples

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-300 dark:hover:border-purple-700">
      <CardContent className="p-5 space-y-4">
        {/* Type badge - subtle top-right */}
        <div className="flex justify-end -mt-1 -mr-1">
          <Badge variant="outline" className="text-xs opacity-40">
            {word.type}
            {word.subtype && (
              <span className="ml-1">({word.subtype})</span>
            )}
          </Badge>
        </div>

        {/* Question */}
        <div className="-mt-1">
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 opacity-50 block mb-2">
            {isEnToJp ? 'English' : 'Japanese'}
          </span>
          <p className="text-2xl font-bold text-gray-900 dark:text-white break-words">
            {question}
          </p>
        </div>

        {/* Answer */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 opacity-50">
              {isEnToJp ? 'Japanese' : 'English'}
            </span>
            <Button
              onClick={() => setLocalShowAnswer(!localShowAnswer)}
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 hover:bg-purple-100 dark:hover:bg-purple-900 text-xs"
              disabled={globalShowAllAnswers}
            >
              {showAnswer ? (
                <>
                  <EyeOff className="h-3 w-3" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3" />
                  Show
                </>
              )}
            </Button>
          </div>
          {showAnswer ? (
            <p className="text-xl font-semibold text-purple-600 dark:text-purple-400">
              {answer}
            </p>
          ) : (
            <div className="flex items-center justify-center h-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Eye className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>

        {/* Examples - Collapsible */}
        {word.exampleSentences && word.exampleSentences.length > 0 && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => setLocalShowExamples(!localShowExamples)}
              variant="ghost"
              size="sm"
              className="w-full justify-between h-8 hover:bg-gray-100 dark:hover:bg-gray-800"
              disabled={globalShowExamples}
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                📝 {word.exampleSentences.length} example{word.exampleSentences.length > 1 ? 's' : ''}
              </span>
              {showExamples ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showExamples && (
              <div className="mt-3 space-y-3">
                {word.exampleSentences.map((example, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 relative"
                  >
                    {/* Sentences */}
                    <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {example.japanese}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-6">
                      {example.english}
                    </p>

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
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface FocusedGridViewProps {
  words: DlingoWord[]
  direction: LearningDirection
  showAllAnswers: boolean
  showExamples: boolean
}

export function FocusedGridView({ words, direction, showAllAnswers, showExamples }: FocusedGridViewProps) {
  if (words.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No words to display.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-8">
      {words.map(word => (
        <FocusedCard
          key={word.id}
          word={word}
          direction={direction}
          globalShowAllAnswers={showAllAnswers}
          globalShowExamples={showExamples}
        />
      ))}
    </div>
  )
}
