"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db"
import { Flashcard } from "@/components/flashcard"
import { VocabularyCard } from "@/types/vocabulary"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function TestPersonaPage() {
  const [cards, setCards] = useState<VocabularyCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    try {
      const allCards = await db.vocabulary.toArray()
      // Filter cards that have generated examples
      const cardsWithPersonas = allCards.filter(
        card => card.examples && card.examples.some(ex => ex.source.type === 'generated')
      )
      setCards(cardsWithPersonas)
      console.log('Found cards with personas:', cardsWithPersonas.length)
      console.log('Sample card:', cardsWithPersonas[0])
    } catch (error) {
      console.error('Failed to load cards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-gray-600">No cards with persona examples found</p>
        <p className="text-sm text-gray-500">
          Go to <a href="/admin/persona-import" className="text-blue-600 underline">/admin/persona-import</a> to import demo data
        </p>
      </div>
    )
  }

  const currentCard = cards[currentIndex]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Persona Flashcards
          </h1>
          <p className="text-gray-600">
            Card {currentIndex + 1} of {cards.length}
          </p>
        </div>

        {/* Flashcard */}
        <Flashcard
          card={currentCard}
          onNext={handleNext}
          onPrevious={handlePrevious}
          showControls={false}
        />

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            {currentCard.examples?.filter(ex => ex.source.type === 'generated').length || 0} persona examples
          </div>

          <Button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            variant="outline"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-2">Card Info:</h3>
          <div className="text-sm space-y-1">
            <p><strong>ID:</strong> {currentCard.id}</p>
            <p><strong>Kanji:</strong> {currentCard.kanji || 'N/A'}</p>
            <p><strong>Kana:</strong> {currentCard.kana}</p>
            <p><strong>Meaning:</strong> {Array.isArray(currentCard.meaning) ? currentCard.meaning.join(', ') : currentCard.meaning}</p>
            <p><strong>Total Examples:</strong> {currentCard.examples?.length || 0}</p>
            <p><strong>Generated Examples:</strong> {currentCard.examples?.filter(ex => ex.source.type === 'generated').length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
