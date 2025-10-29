"use client"

import { useState, useMemo } from "react"
import { VocabularyCard, Deck, JLPTLevel } from "@/types/vocabulary"
import { VocabularySearch } from "@/components/vocabulary-search"
import { VocabularyEditor } from "@/components/vocabulary-editor"
import { DeckManager } from "@/components/deck-manager"
import { BulkOperations } from "@/components/bulk-operations"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Upload,
  Download,
  Plus,
  FileText,
  Database,
  Loader2
} from "lucide-react"
import {
  exportCardsToJSON,
  exportDeckToJSONFile,
  exportVocabularyToCSVFile,
  importFromCSV,
  importCardsFromJSON,
  importDeckFromJSON,
  readFile
} from "@/lib/import-export"
import { databaseService } from "@/services/database.service"
import { useLiveVocabulary, useLiveDecks, useDatabase } from "@/hooks/useDatabase"
import { Header } from "@/components/layout/header"

export default function ManagePage() {
  const [activeTab, setActiveTab] = useState<"vocabulary" | "decks">("vocabulary")
  const [selectedCards, setSelectedCards] = useState<VocabularyCard[]>([])
  const [editingCard, setEditingCard] = useState<VocabularyCard | null>(null)
  const [isCreatingCard, setIsCreatingCard] = useState(false)

  // Initialize database and use live queries
  const { isInitialized, isLoading: dbLoading, error: dbError } = useDatabase()
  const dbVocabulary = useLiveVocabulary() ?? []
  const dbDecks = useLiveDecks() ?? []

  // Convert live vocabulary data
  const vocabulary = useMemo<VocabularyCard[]>(() => {
    return dbVocabulary.map(card => {
      const { deckId, addedAt, modifiedAt, ...vocabCard } = card
      return vocabCard as VocabularyCard
    })
  }, [dbVocabulary])

  // Convert live decks data with their cards
  const decks = useMemo<Deck[]>(() => {
    return dbDecks.map(dbDeck => ({
      id: dbDeck.id,
      name: dbDeck.name,
      description: dbDeck.description,
      jlptLevel: dbDeck.jlptLevel,
      cards: dbVocabulary
        .filter(card => card.deckId === dbDeck.id)
        .map(card => {
          const { deckId, addedAt, modifiedAt, ...vocabCard } = card
          return vocabCard as VocabularyCard
        }),
      visibility: dbDeck.visibility,
      premiumOnly: dbDeck.premiumOnly,
      credits: dbDeck.credits,
      createdAt: dbDeck.createdAt,
      updatedAt: dbDeck.updatedAt
    }))
  }, [dbDecks, dbVocabulary])

  // Import handlers
  const handleImportCSV = async () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const content = await readFile(file)
        const result = importFromCSV(content, {
          hasHeader: true,
          skipInvalidRows: true,
          defaultJLPTLevel: "N5"
        })

        if (result.success > 0) {
          await databaseService.addVocabularyCards(result.cards)
          // Live query will auto-update
          alert(`Successfully imported ${result.success} cards!`)
        }

        if (result.errors.length > 0) {
          console.warn("Import errors:", result.errors)
          alert(`Imported ${result.success} cards with ${result.failed} errors. Check console for details.`)
        }
      } catch (error) {
        console.error("Import failed:", error)
        alert("Failed to import CSV file")
      }
    }
    input.click()
  }

  const handleImportJSON = async () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const content = await readFile(file)
        const cards = importCardsFromJSON(content)
        await databaseService.addVocabularyCards(cards)
        // Live query will auto-update
        alert(`Successfully imported ${cards.length} cards!`)
      } catch (error) {
        console.error("Import failed:", error)
        alert("Failed to import JSON file")
      }
    }
    input.click()
  }

  const handleImportDeck = async () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const content = await readFile(file)
        const deck = importDeckFromJSON(content)

        // Create deck in database
        const deckId = await databaseService.createDeck({
          name: deck.name,
          description: deck.description,
          jlptLevel: deck.jlptLevel,
          cardIds: deck.cards.map(c => c.id),
          visibility: deck.visibility,
          premiumOnly: deck.premiumOnly,
          credits: deck.credits,
          createdAt: deck.createdAt,
          updatedAt: deck.updatedAt
        })

        // Add all cards to database
        await databaseService.addVocabularyCards(deck.cards, deckId)
        // Live query will auto-update
        alert(`Successfully imported deck "${deck.name}" with ${deck.cards.length} cards!`)
      } catch (error) {
        console.error("Import failed:", error)
        alert("Failed to import deck")
      }
    }
    input.click()
  }

  // Export handlers
  const handleExportAllCSV = () => {
    exportVocabularyToCSVFile(vocabulary, "lingomemory-all.csv", {
      includeHeader: true,
      ankiFormat: true
    })
  }

  const handleExportAllJSON = () => {
    const jsonContent = exportCardsToJSON(vocabulary)
    const blob = new Blob([jsonContent], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "lingomemory-all.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExportDeck = (deckId: string) => {
    const deck = decks.find(d => d.id === deckId)
    if (!deck) return
    exportDeckToJSONFile(deck)
  }

  // Deck operations
  const handleCreateDeck = async (newDeck: Omit<Deck, "id" | "createdAt" | "updatedAt">) => {
    try {
      await databaseService.createDeck({
        name: newDeck.name,
        description: newDeck.description,
        jlptLevel: newDeck.jlptLevel,
        cardIds: [],
        visibility: newDeck.visibility,
        premiumOnly: newDeck.premiumOnly,
        credits: newDeck.credits,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      // Live query will auto-update
    } catch (error) {
      console.error("Failed to create deck:", error)
      alert("Failed to create deck")
    }
  }

  const handleUpdateDeck = async (deckId: string, updates: Partial<Deck>) => {
    try {
      await databaseService.updateDeck(deckId, updates)
      // Live query will auto-update
    } catch (error) {
      console.error("Failed to update deck:", error)
      alert("Failed to update deck")
    }
  }

  const handleDeleteDeck = async (deckId: string) => {
    try {
      await databaseService.deleteDeck(deckId)
      // Live query will auto-update
    } catch (error) {
      console.error("Failed to delete deck:", error)
      alert("Failed to delete deck")
    }
  }

  // Card operations
  const handleSaveCard = async (card: VocabularyCard) => {
    try {
      if (editingCard) {
        // Update existing card
        await databaseService.updateVocabularyCard(card.id, card)
        setEditingCard(null)
      } else {
        // Create new card
        await databaseService.addVocabularyCard(card)
        setIsCreatingCard(false)
      }
      // Live query will auto-update
    } catch (error) {
      console.error("Failed to save card:", error)
      alert("Failed to save card")
    }
  }

  const handleDeleteCards = async (cardIds: string[]) => {
    try {
      await databaseService.deleteVocabularyCards(cardIds)
      setSelectedCards([])
      // Live query will auto-update
    } catch (error) {
      console.error("Failed to delete cards:", error)
      alert("Failed to delete cards")
    }
  }

  // Bulk operations
  const handleAddTags = async (cardIds: string[], tags: string[]) => {
    try {
      await databaseService.bulkAddTags(cardIds, tags)
      // Live query will auto-update
    } catch (error) {
      console.error("Failed to add tags:", error)
      alert("Failed to add tags")
    }
  }

  const handleRemoveTags = async (cardIds: string[], tags: string[]) => {
    try {
      await databaseService.bulkRemoveTags(cardIds, tags)
      // Live query will auto-update
    } catch (error) {
      console.error("Failed to remove tags:", error)
      alert("Failed to remove tags")
    }
  }

  const handleMoveToDeck = async (cardIds: string[], deckId: string) => {
    try {
      await databaseService.moveCardsToDeck(cardIds, deckId)
      // Live query will auto-update
      const cardsCount = cardIds.length
      alert(`Moved ${cardsCount} cards to deck`)
    } catch (error) {
      console.error("Failed to move cards:", error)
      alert("Failed to move cards to deck")
    }
  }

  const handleExportSelected = (cardIds: string[]) => {
    const cardsToExport = vocabulary.filter(card => cardIds.includes(card.id))
    exportVocabularyToCSVFile(cardsToExport, "selected-cards.csv", {
      includeHeader: true,
      ankiFormat: true
    })
  }

  const handleUpdateJLPT = async (cardIds: string[], level: JLPTLevel | undefined) => {
    try {
      await databaseService.bulkUpdateJLPTLevel(cardIds, level)
      // Live query will auto-update
    } catch (error) {
      console.error("Failed to update JLPT level:", error)
      alert("Failed to update JLPT level")
    }
  }

  if (dbLoading || !isInitialized) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading vocabulary data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (dbError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-2">Failed to load database</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{dbError}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Vocabulary Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your vocabulary cards and decks
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAllJSON} className="gap-2">
            <Download className="h-4 w-4" />
            Export All JSON
          </Button>
          <Button variant="outline" onClick={handleExportAllCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export All CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Cards</p>
              <p className="text-2xl font-bold">{vocabulary.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Decks</p>
              <p className="text-2xl font-bold">{decks.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Selected</p>
              <p className="text-2xl font-bold">{selectedCards.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">N5 Cards</p>
              <p className="text-2xl font-bold">
                {vocabulary.filter(c => c.jlptLevel === "N5").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bulk Operations (shown when cards are selected) */}
      {selectedCards.length > 0 && (
        <BulkOperations
          selectedCards={selectedCards}
          availableDecks={decks.map(d => ({ id: d.id, name: d.name }))}
          onAddTags={handleAddTags}
          onRemoveTags={handleRemoveTags}
          onDelete={handleDeleteCards}
          onMoveToDeck={handleMoveToDeck}
          onExport={handleExportSelected}
          onUpdateJLPT={handleUpdateJLPT}
          onClearSelection={() => setSelectedCards([])}
        />
      )}

      {/* Editor (shown when creating/editing) */}
      {(isCreatingCard || editingCard) && (
        <VocabularyEditor
          card={editingCard || undefined}
          onSave={handleSaveCard}
          onCancel={() => {
            setIsCreatingCard(false)
            setEditingCard(null)
          }}
        />
      )}

      {/* Main Tabs */}
      <Card>
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab("vocabulary")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "vocabulary"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              Vocabulary Cards
            </button>
            <button
              onClick={() => setActiveTab("decks")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "decks"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              Decks
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "vocabulary" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Vocabulary Cards</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleImportCSV}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Import CSV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleImportJSON}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Import JSON
                  </Button>
                  <Button
                    onClick={() => setIsCreatingCard(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Card
                  </Button>
                </div>
              </div>

              <VocabularySearch
                vocabulary={vocabulary}
                onSelectCard={(card) => setEditingCard(card)}
                onBulkSelect={setSelectedCards}
                showBulkActions={true}
              />
            </div>
          )}

          {activeTab === "decks" && (
            <DeckManager
              decks={decks}
              onCreateDeck={handleCreateDeck}
              onUpdateDeck={handleUpdateDeck}
              onDeleteDeck={handleDeleteDeck}
              onExportDeck={handleExportDeck}
              onImportDeck={handleImportDeck}
            />
          )}
        </div>
      </Card>
    </div>
    </div>
  )
}
