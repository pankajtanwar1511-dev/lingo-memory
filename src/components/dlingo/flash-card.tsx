"use client"

import { useState } from "react"
import { Eye, EyeOff, Volume2 } from "lucide-react"
import { DlingoWord, LearningDirection } from "@/types/dlingo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FlashCardProps {
  word: DlingoWord
  direction: LearningDirection
  showAnswer: boolean
  showExamples: boolean
  onToggleAnswer: () => void
}

export function FlashCard({ word, direction, showAnswer, showExamples, onToggleAnswer }: FlashCardProps) {
  const isEnToJp = direction === 'en-to-jp'

  const leftContent = isEnToJp ? word.english : word.japanese
  const rightContent = isEnToJp ? word.japanese : word.english

  const leftLabel = isEnToJp ? 'English' : 'Japanese'
  const rightLabel = isEnToJp ? 'Japanese' : 'English'

  // Dummy audio play function
  const handlePlayAudio = () => {
    console.log('Playing audio for:', word.japanese)
    // TODO: Implement actual audio playback
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-300 dark:hover:border-purple-700 h-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left Side - Always visible */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {leftLabel}
              </span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                {word.type}
                {word.subtype && (
                  <span className="ml-1 opacity-75">({word.subtype})</span>
                )}
              </span>
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white break-words">
              {leftContent}
            </div>

            {/* Example sentences (conditionally shown) */}
            {showExamples && showAnswer && word.exampleSentences && word.exampleSentences.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Example{word.exampleSentences.length > 1 ? 's' : ''}:
                </div>
                <div className="space-y-1.5">
                  {word.exampleSentences.map((example, idx) => (
                    <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 italic flex items-start gap-2">
                      <div className="flex-shrink-0 flex items-center gap-1">
                        {word.exampleSentences!.length > 1 && (
                          <span className="text-xs text-gray-400">{idx + 1}.</span>
                        )}
                        {example.context === 'question' && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">Q</span>
                        )}
                        {example.context === 'answer' && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">A</span>
                        )}
                      </div>
                      <span className="flex-1">{isEnToJp ? example.english : example.japanese}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px bg-gray-200 dark:bg-gray-700 self-stretch my-2" />

          {/* Right Side - Can be hidden/shown */}
          <div className="flex-1 min-w-0 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {rightLabel}
              </span>
              <div className="flex gap-1">
                {/* Play audio button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayAudio}
                  className="h-6 w-6 p-0 hover:bg-purple-100 dark:hover:bg-purple-900"
                  title="Play audio"
                >
                  <Volume2 className="h-3 w-3" />
                </Button>

                {/* Toggle visibility button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleAnswer}
                  className="h-6 w-6 p-0 hover:bg-purple-100 dark:hover:bg-purple-900"
                  title={showAnswer ? "Hide answer" : "Show answer"}
                >
                  {showAnswer ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            {showAnswer ? (
              <>
                <div className="text-xl font-semibold text-gray-900 dark:text-white break-words">
                  {rightContent}
                </div>

                {/* Example sentence translations (conditionally shown) */}
                {showExamples && word.exampleSentences && word.exampleSentences.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Example{word.exampleSentences.length > 1 ? 's' : ''}:
                    </div>
                    <div className="space-y-1.5">
                      {word.exampleSentences.map((example, idx) => (
                        <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 italic flex items-start gap-2">
                          <div className="flex-shrink-0 flex items-center gap-1">
                            {word.exampleSentences!.length > 1 && (
                              <span className="text-xs text-gray-400">{idx + 1}.</span>
                            )}
                            {example.context === 'question' && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">Q</span>
                            )}
                            {example.context === 'answer' && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">A</span>
                            )}
                          </div>
                          <span className="flex-1">{isEnToJp ? example.japanese : example.english}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-16 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Eye className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
