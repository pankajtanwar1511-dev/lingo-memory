"use client"

import { useState } from "react"
import { VocabularyCard, JLPTLevel } from "@/types/vocabulary"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Tag,
  Trash2,
  FolderInput,
  Download,
  AlertCircle
} from "lucide-react"

interface BulkOperationsProps {
  selectedCards: VocabularyCard[]
  availableDecks?: Array<{ id: string; name: string }>
  onAddTags: (cardIds: string[], tags: string[]) => void
  onRemoveTags: (cardIds: string[], tags: string[]) => void
  onDelete: (cardIds: string[]) => void
  onMoveToDeck: (cardIds: string[], deckId: string) => void
  onExport: (cardIds: string[]) => void
  onUpdateJLPT: (cardIds: string[], level: JLPTLevel | undefined) => void
  onClearSelection: () => void
}

export function BulkOperations({
  selectedCards,
  availableDecks = [],
  onAddTags,
  onRemoveTags,
  onDelete,
  onMoveToDeck,
  onExport,
  onUpdateJLPT,
  onClearSelection
}: BulkOperationsProps) {
  const [operation, setOperation] = useState<string>("none")
  const [tagInput, setTagInput] = useState("")
  const [selectedDeck, setSelectedDeck] = useState("")
  const [selectedJLPT, setSelectedJLPT] = useState<JLPTLevel | "">("")

  if (selectedCards.length === 0) {
    return null
  }

  const cardIds = selectedCards.map(card => card.id)

  const handleAddTags = () => {
    const tags = tagInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0)

    if (tags.length === 0) {
      alert("Please enter at least one tag")
      return
    }

    onAddTags(cardIds, tags)
    setTagInput("")
    setOperation("none")
  }

  const handleRemoveTags = () => {
    const tags = tagInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0)

    if (tags.length === 0) {
      alert("Please enter at least one tag to remove")
      return
    }

    onRemoveTags(cardIds, tags)
    setTagInput("")
    setOperation("none")
  }

  const handleDelete = () => {
    const confirmed = confirm(
      `Are you sure you want to delete ${selectedCards.length} card${
        selectedCards.length > 1 ? "s" : ""
      }? This cannot be undone.`
    )

    if (confirmed) {
      onDelete(cardIds)
      setOperation("none")
    }
  }

  const handleMoveToDeck = () => {
    if (!selectedDeck) {
      alert("Please select a deck")
      return
    }

    onMoveToDeck(cardIds, selectedDeck)
    setSelectedDeck("")
    setOperation("none")
  }

  const handleUpdateJLPT = () => {
    onUpdateJLPT(cardIds, selectedJLPT || undefined)
    setSelectedJLPT("")
    setOperation("none")
  }

  const handleExport = () => {
    onExport(cardIds)
    setOperation("none")
  }

  // Calculate common tags across selected cards
  const commonTags = selectedCards.reduce<string[]>((common, card) => {
    if (!card.tags) return []
    if (common.length === 0) return card.tags
    return common.filter(tag => card.tags?.includes(tag))
  }, selectedCards[0]?.tags || [])

  return (
    <Card className="p-4 border-2 border-purple-500 bg-purple-50 dark:bg-purple-950/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-purple-600" />
          <span className="font-semibold">
            {selectedCards.length} card{selectedCards.length > 1 ? "s" : ""} selected
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Clear Selection
        </Button>
      </div>

      {/* Common Tags Display */}
      {commonTags.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Common tags:
          </p>
          <div className="flex flex-wrap gap-1">
            {commonTags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Operation Selector */}
      <div className="space-y-3">
        <Select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="none">Select an operation...</option>
          <option value="add-tags">Add Tags</option>
          <option value="remove-tags">Remove Tags</option>
          <option value="update-jlpt">Update JLPT Level</option>
          {availableDecks.length > 0 && (
            <option value="move">Move to Deck</option>
          )}
          <option value="export">Export Selected</option>
          <option value="delete">Delete</option>
        </Select>

        {/* Add Tags */}
        {operation === "add-tags" && (
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter tags separated by commas"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddTags} className="gap-2">
                <Tag className="h-4 w-4" />
                Add Tags
              </Button>
              <Button variant="outline" onClick={() => setOperation("none")}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Remove Tags */}
        {operation === "remove-tags" && (
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter tags to remove (comma-separated)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleRemoveTags} variant="destructive" className="gap-2">
                <Tag className="h-4 w-4" />
                Remove Tags
              </Button>
              <Button variant="outline" onClick={() => setOperation("none")}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Update JLPT Level */}
        {operation === "update-jlpt" && (
          <div className="space-y-2">
            <Select
              value={selectedJLPT}
              onChange={(e) => setSelectedJLPT(e.target.value as JLPTLevel | "")}
            >
              <option value="">Remove JLPT level</option>
              <option value="N5">N5</option>
              <option value="N4">N4</option>
              <option value="N3">N3</option>
              <option value="N2">N2</option>
              <option value="N1">N1</option>
            </Select>
            <div className="flex gap-2">
              <Button onClick={handleUpdateJLPT} className="gap-2">
                Update JLPT Level
              </Button>
              <Button variant="outline" onClick={() => setOperation("none")}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Move to Deck */}
        {operation === "move" && availableDecks.length > 0 && (
          <div className="space-y-2">
            <Select
              value={selectedDeck}
              onChange={(e) => setSelectedDeck(e.target.value)}
            >
              <option value="">Select destination deck...</option>
              {availableDecks.map(deck => (
                <option key={deck.id} value={deck.id}>
                  {deck.name}
                </option>
              ))}
            </Select>
            <div className="flex gap-2">
              <Button onClick={handleMoveToDeck} className="gap-2">
                <FolderInput className="h-4 w-4" />
                Move to Deck
              </Button>
              <Button variant="outline" onClick={() => setOperation("none")}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Export */}
        {operation === "export" && (
          <div className="flex gap-2">
            <Button onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export {selectedCards.length} Cards
            </Button>
            <Button variant="outline" onClick={() => setOperation("none")}>
              Cancel
            </Button>
          </div>
        )}

        {/* Delete */}
        {operation === "delete" && (
          <div className="space-y-2">
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded p-3">
              <p className="text-sm text-red-800 dark:text-red-200">
                Warning: This will permanently delete {selectedCards.length} card
                {selectedCards.length > 1 ? "s" : ""}. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleDelete} variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete {selectedCards.length} Cards
              </Button>
              <Button variant="outline" onClick={() => setOperation("none")}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
