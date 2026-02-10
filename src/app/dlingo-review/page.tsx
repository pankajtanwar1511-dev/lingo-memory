"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { FlashCard } from "@/components/dlingo/flash-card"
import { SingleCardView } from "@/components/dlingo/single-card-view"
import { FocusedGridView } from "@/components/dlingo/focused-grid-view"
import { ClassicCardView } from "@/components/dlingo/classic-card-view"
import { DlingoWord, WordType, WORD_TYPE_LABELS, LearningDirection } from "@/types/dlingo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeftRight, Eye, EyeOff, FileText, Grid3X3, RectangleVertical, LayoutGrid, BookOpen } from "lucide-react"

type ViewMode = 'grid' | 'single' | 'focused' | 'classic'

export default function DlingoReviewPage() {
  const [words, setWords] = useState<DlingoWord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTypes, setSelectedTypes] = useState<Set<WordType>>(new Set())
  const [direction, setDirection] = useState<LearningDirection>('en-to-jp')
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())
  const [showAllMode, setShowAllMode] = useState(false)
  const [showExamples, setShowExamples] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  // Load vocabulary data
  useEffect(() => {
    const loadWords = async () => {
      try {
        const response = await fetch('/seed-data/dlingo_vocab_enhanced.json')
        if (!response.ok) {
          throw new Error('Failed to load vocabulary')
        }
        const data = await response.json()
        setWords(data)
      } catch (error) {
        console.error('Error loading vocabulary:', error)
      } finally {
        setLoading(false)
      }
    }

    loadWords()
  }, [])

  // Filter words based on selected types
  const filteredWords = useMemo(() => {
    if (selectedTypes.size === 0) {
      return words
    }
    return words.filter(word => selectedTypes.has(word.type))
  }, [words, selectedTypes])

  // Count words by type
  const typeCounts = useMemo(() => {
    const counts: Record<WordType, number> = {
      verb: 0,
      noun: 0,
      adjective: 0,
      adverb: 0,
      phrase: 0,
      particle: 0,
      counter: 0,
      pronoun: 0,
      other: 0
    }

    words.forEach(word => {
      counts[word.type]++
    })

    return counts
  }, [words])

  // Toggle type filter
  const toggleType = (type: WordType) => {
    const newSelectedTypes = new Set(selectedTypes)
    if (newSelectedTypes.has(type)) {
      newSelectedTypes.delete(type)
    } else {
      newSelectedTypes.add(type)
    }
    setSelectedTypes(newSelectedTypes)
  }

  // Toggle direction
  const toggleDirection = () => {
    setDirection(prev => prev === 'en-to-jp' ? 'jp-to-en' : 'en-to-jp')
  }

  // Toggle individual card visibility
  const toggleCardVisibility = (wordId: string) => {
    const newVisibleCards = new Set(visibleCards)
    if (newVisibleCards.has(wordId)) {
      newVisibleCards.delete(wordId)
    } else {
      newVisibleCards.add(wordId)
    }
    setVisibleCards(newVisibleCards)
  }

  // Toggle all cards visibility
  const toggleAllCards = () => {
    if (showAllMode) {
      // Hide all
      setVisibleCards(new Set())
      setShowAllMode(false)
    } else {
      // Show all
      setVisibleCards(new Set(filteredWords.map(w => w.id)))
      setShowAllMode(true)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading vocabulary...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Header />

      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dlingo Vocabulary Review
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review your learned vocabulary with interactive flashcards
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 space-y-4">
          {/* Direction and Global Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <Button
              onClick={() => {
                const nextMode =
                  viewMode === 'grid' ? 'focused' :
                  viewMode === 'focused' ? 'single' :
                  viewMode === 'single' ? 'classic' :
                  'grid'
                setViewMode(nextMode)
                setCurrentCardIndex(0)
              }}
              variant={viewMode !== 'grid' ? "default" : "outline"}
              className="gap-2"
            >
              {viewMode === 'grid' ? (
                <>
                  <LayoutGrid className="h-4 w-4" />
                  Focused Grid
                </>
              ) : viewMode === 'focused' ? (
                <>
                  <RectangleVertical className="h-4 w-4" />
                  Single Card
                </>
              ) : viewMode === 'single' ? (
                <>
                  <BookOpen className="h-4 w-4" />
                  Classic Card
                </>
              ) : (
                <>
                  <Grid3X3 className="h-4 w-4" />
                  Original Grid
                </>
              )}
            </Button>

            <Button
              onClick={toggleDirection}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeftRight className="h-4 w-4" />
              {direction === 'en-to-jp' ? 'English → Japanese' : 'Japanese → English'}
            </Button>

            <Button
              onClick={toggleAllCards}
              variant={showAllMode ? "default" : "outline"}
              className="gap-2"
            >
              {showAllMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showAllMode ? 'Hide All Answers' : 'Show All Answers'}
            </Button>

            <Button
              onClick={() => setShowExamples(!showExamples)}
              variant={showExamples ? "default" : "outline"}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              {showExamples ? 'Hide Examples' : 'Show Examples'}
            </Button>

            <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-purple-600 dark:text-purple-400">{filteredWords.length}</span> of {words.length} words
            </div>
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center mr-2">
              Filter by type:
            </span>
            {(Object.keys(WORD_TYPE_LABELS) as WordType[])
              .filter(type => typeCounts[type] > 0)
              .map(type => (
                <Badge
                  key={type}
                  variant={selectedTypes.has(type) ? "default" : "outline"}
                  className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1.5"
                  onClick={() => toggleType(type)}
                >
                  {WORD_TYPE_LABELS[type]} ({typeCounts[type]})
                </Badge>
              ))}
            {selectedTypes.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTypes(new Set())}
                className="text-sm"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Flash Cards - Four View Modes */}
        {filteredWords.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No words found for the selected filters.
            </p>
          </div>
        ) : viewMode === 'single' ? (
          <SingleCardView
            words={filteredWords}
            direction={direction}
            currentIndex={currentCardIndex}
            onNavigate={setCurrentCardIndex}
            showAllAnswers={showAllMode}
            showExamples={showExamples}
          />
        ) : viewMode === 'classic' ? (
          <ClassicCardView
            words={filteredWords}
            direction={direction}
            currentIndex={currentCardIndex}
            onNavigate={setCurrentCardIndex}
            showExamples={showExamples}
          />
        ) : viewMode === 'focused' ? (
          <FocusedGridView
            words={filteredWords}
            direction={direction}
            showAllAnswers={showAllMode}
            showExamples={showExamples}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-8">
            {filteredWords.map(word => (
              <FlashCard
                key={word.id}
                word={word}
                direction={direction}
                showAnswer={visibleCards.has(word.id)}
                showExamples={showExamples}
                onToggleAnswer={() => toggleCardVisibility(word.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
