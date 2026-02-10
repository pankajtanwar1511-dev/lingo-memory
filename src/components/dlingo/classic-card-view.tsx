"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DlingoWord, LearningDirection } from "@/types/dlingo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ClassicCardViewProps {
  words: DlingoWord[]
  direction: LearningDirection
  currentIndex: number
  onNavigate: (index: number) => void
  showExamples: boolean
}

export function ClassicCardView({ words, direction, currentIndex, onNavigate, showExamples }: ClassicCardViewProps) {
  const [showAnswer, setShowAnswer] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        setShowAnswer(!showAnswer)
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault()
        onNavigate(currentIndex - 1)
        setShowAnswer(false)
      } else if (e.key === 'ArrowRight' && currentIndex < words.length - 1) {
        e.preventDefault()
        onNavigate(currentIndex + 1)
        setShowAnswer(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showAnswer, currentIndex, words.length, onNavigate])

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
      setShowAnswer(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      onNavigate(currentIndex + 1)
      setShowAnswer(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="ghost"
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Word <span className="font-semibold text-purple-600 dark:text-purple-400">{currentIndex + 1}</span> of {words.length}
          </p>
        </div>

        <Button
          onClick={handleNext}
          disabled={currentIndex === words.length - 1}
          variant="ghost"
          className="gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Classic Study Card */}
      <motion.div
        key={word.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="min-h-[500px]">
          <CardContent className="p-8">
            {/* Type badge - top right, subtle */}
            <div className="flex justify-end mb-6">
              <Badge variant="outline" className="text-xs opacity-40">
                {word.type}
                {word.subtype && (
                  <span className="ml-1">({word.subtype})</span>
                )}
              </Badge>
            </div>

            {/* Question side - large centered */}
            <div className="text-center space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold text-primary-700 dark:text-primary-300">
                {question}
              </h1>

              {!showAnswer && (
                <Button
                  onClick={() => setShowAnswer(true)}
                  size="lg"
                  variant="gradient"
                  className="mt-8"
                >
                  Show Answer
                  <span className="ml-2 text-xs opacity-75">(Space)</span>
                </Button>
              )}
            </div>

            {/* Answer side - revealed with animation */}
            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 space-y-6"
                >
                  <div className="border-t pt-6">
                    <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-center text-purple-600 dark:text-purple-400">
                      {answer}
                    </h3>

                    {/* Examples */}
                    {showExamples && word.exampleSentences && word.exampleSentences.length > 0 && (
                      <div className="space-y-3 mt-6">
                        <p className="text-sm font-medium text-gray-400 dark:text-gray-500 opacity-50">
                          📝 Example Sentences
                        </p>
                        {word.exampleSentences.slice(0, 2).map((example, idx) => (
                          <div key={idx} className="p-4 bg-muted rounded-lg relative">
                            {/* Japanese sentence */}
                            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {example.japanese}
                            </p>

                            {/* English translation */}
                            <p className="text-sm text-muted-foreground mb-6">
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
                    )}

                    {/* Hide Answer button */}
                    <div className="text-center mt-6">
                      <Button
                        onClick={() => setShowAnswer(false)}
                        variant="outline"
                        size="sm"
                      >
                        Hide Answer
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation Footer */}
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
