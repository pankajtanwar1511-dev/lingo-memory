"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, ChevronLeft, ChevronRight, Shuffle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { VocabularyCard } from "@/types/vocabulary"

interface FlashcardProps {
  card: VocabularyCard
  onNext?: () => void
  onPrevious?: () => void
  showControls?: boolean
  className?: string
}

export function Flashcard({
  card,
  onNext,
  onPrevious,
  showControls = true,
  className
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const playAudio = () => {
    // Using Web Speech API for now, will integrate with real audio later
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(card.kana)
      utterance.lang = 'ja-JP'
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  const meanings = Array.isArray(card.meaning) ? card.meaning : [card.meaning]

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="relative">
        {/* Card Container */}
        <div
          className="relative h-[400px] cursor-pointer perspective-1000"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <motion.div
            className="absolute inset-0 w-full h-full preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front of card */}
            <Card className={cn(
              "absolute inset-0 w-full h-full backface-hidden",
              "flex flex-col items-center justify-center p-8",
              "bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950",
              "border-2 border-primary-200 dark:border-primary-800"
            )}>
              <div className="text-center space-y-6">
                {/* JLPT Level Badge */}
                {card.jlptLevel && (
                  <Badge variant="gradient" className="absolute top-4 right-4">
                    {card.jlptLevel}
                  </Badge>
                )}

                {/* Main content */}
                <div className="space-y-4">
                  {card.kanji && (
                    <h2 className="text-6xl font-bold text-primary-700 dark:text-primary-300 font-japanese">
                      {card.kanji}
                    </h2>
                  )}
                  <p className="text-3xl text-gray-600 dark:text-gray-400 font-japanese">
                    {card.kana}
                  </p>
                </div>

                {/* Audio button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    playAudio()
                  }}
                  className="hover:bg-primary-100 dark:hover:bg-primary-900"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>

                {/* Hint button */}
                <div className="absolute bottom-4 left-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowHint(!showHint)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Hint
                  </Button>
                </div>

                {/* Hint display */}
                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-16 left-4 right-4 p-3 bg-white/90 dark:bg-gray-800/90 rounded-lg backdrop-blur"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {meanings[0].substring(0, 3)}...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-xs text-gray-500 dark:text-gray-500 absolute bottom-4 right-4">
                  Click to flip
                </p>
              </div>
            </Card>

            {/* Back of card */}
            <Card className={cn(
              "absolute inset-0 w-full h-full backface-hidden rotate-y-180",
              "flex flex-col p-6",
              "bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-950 dark:to-primary-950",
              "border-2 border-secondary-200 dark:border-secondary-800"
            )}>
              <div className="flex-1 space-y-6">
                {/* Meaning */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Meaning
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {meanings.join(", ")}
                  </p>
                </div>

                {/* Part of speech */}
                {card.partOfSpeech && (
                  <div className="flex gap-2">
                    {card.partOfSpeech.map((pos, index) => (
                      <Badge key={index} variant="outline">
                        {pos}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Examples */}
                {card.examples && card.examples.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Example Sentences
                    </h3>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto">
                      {card.examples.map((example, index) => (
                        <div
                          key={index}
                          className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg space-y-1"
                        >
                          <p className="text-lg font-japanese text-gray-800 dark:text-gray-200">
                            {example.japanese}
                          </p>
                          {example.kana && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-japanese">
                              {example.kana}
                            </p>
                          )}
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {example.english}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Source: {example.source.type} {example.source.id && `#${example.source.id}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-4">
                Click to flip back
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!onPrevious}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={onNext}
              disabled={!onNext}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// CSS for 3D transforms (add to global styles)
const cardStyles = `
  .perspective-1000 {
    perspective: 1000px;
  }
  .preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
`

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = cardStyles
  document.head.appendChild(style)
}