"use client"

import { useState } from "react"
import { Deck, JLPTLevel, VocabularyCard } from "@/types/vocabulary"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  MoreVertical
} from "lucide-react"

interface DeckManagerProps {
  decks: Deck[]
  onCreateDeck: (deck: Omit<Deck, "id" | "createdAt" | "updatedAt">) => void
  onUpdateDeck: (deckId: string, updates: Partial<Deck>) => void
  onDeleteDeck: (deckId: string) => void
  onExportDeck: (deckId: string) => void
  onImportDeck: () => void
}

export function DeckManager({
  decks,
  onCreateDeck,
  onUpdateDeck,
  onDeleteDeck,
  onExportDeck,
  onImportDeck
}: DeckManagerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [editingDeck, setEditingDeck] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    description: string
    jlptLevel: JLPTLevel | ""
    visibility: "private" | "public" | "shared"
  }>({
    name: "",
    description: "",
    jlptLevel: "",
    visibility: "private"
  })

  const handleCreateDeck = () => {
    if (!formData.name.trim()) {
      alert("Deck name is required")
      return
    }

    onCreateDeck({
      name: formData.name,
      description: formData.description || undefined,
      jlptLevel: formData.jlptLevel || undefined,
      cards: [],
      visibility: formData.visibility,
      credits: {
        sources: ["User created"]
      }
    })

    // Reset form
    setFormData({
      name: "",
      description: "",
      jlptLevel: "",
      visibility: "private"
    })
    setIsCreating(false)
  }

  const handleUpdateDeck = (deckId: string) => {
    if (!formData.name.trim()) {
      alert("Deck name is required")
      return
    }

    onUpdateDeck(deckId, {
      name: formData.name,
      description: formData.description || undefined,
      jlptLevel: formData.jlptLevel || undefined,
      visibility: formData.visibility
    })

    setEditingDeck(null)
    setFormData({
      name: "",
      description: "",
      jlptLevel: "",
      visibility: "private"
    })
  }

  const startEdit = (deck: Deck) => {
    setEditingDeck(deck.id)
    setFormData({
      name: deck.name,
      description: deck.description || "",
      jlptLevel: deck.jlptLevel || "",
      visibility: deck.visibility
    })
  }

  const cancelEdit = () => {
    setEditingDeck(null)
    setIsCreating(false)
    setFormData({
      name: "",
      description: "",
      jlptLevel: "",
      visibility: "private"
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Decks</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your vocabulary decks
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onImportDeck} className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Deck
          </Button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingDeck) && (
        <Card className="p-4 space-y-4 border-2 border-purple-500">
          <h3 className="font-semibold">
            {isCreating ? "Create New Deck" : "Edit Deck"}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Deck Name *
              </label>
              <Input
                type="text"
                placeholder="e.g., Common Verbs, Daily Conversation"
                value={formData.name}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Description
              </label>
              <Input
                type="text"
                placeholder="Brief description of this deck"
                value={formData.description}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, description: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  JLPT Level
                </label>
                <Select
                  value={formData.jlptLevel}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      jlptLevel: e.target.value as JLPTLevel | ""
                    }))
                  }
                >
                  <option value="">Not specified</option>
                  <option value="N5">N5</option>
                  <option value="N4">N4</option>
                  <option value="N3">N3</option>
                  <option value="N2">N2</option>
                  <option value="N1">N1</option>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Visibility
                </label>
                <Select
                  value={formData.visibility}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      visibility: e.target.value as "private" | "public" | "shared"
                    }))
                  }
                >
                  <option value="private">Private</option>
                  <option value="shared">Shared</option>
                  <option value="public">Public</option>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                isCreating ? handleCreateDeck() : handleUpdateDeck(editingDeck!)
              }
            >
              {isCreating ? "Create" : "Save"}
            </Button>
          </div>
        </Card>
      )}

      {/* Decks List */}
      <div className="space-y-3">
        {decks.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <p className="mb-2">No decks yet</p>
            <Button variant="link" onClick={() => setIsCreating(true)}>
              Create your first deck
            </Button>
          </Card>
        ) : (
          decks.map(deck => (
            <Card key={deck.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{deck.name}</h3>
                    {deck.visibility === "private" ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </div>

                  {deck.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {deck.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    {deck.jlptLevel && (
                      <Badge variant="secondary">{deck.jlptLevel}</Badge>
                    )}
                    <Badge variant="outline">
                      {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {deck.visibility}
                    </Badge>
                    {deck.premiumOnly && (
                      <Badge className="bg-yellow-500">Premium</Badge>
                    )}
                  </div>

                  {deck.credits?.sources && (
                    <p className="text-xs text-gray-500">
                      Sources: {deck.credits.sources.join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(deck)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onExportDeck(deck.id)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Delete deck "${deck.name}"? This cannot be undone.`)) {
                        onDeleteDeck(deck.id)
                      }
                    }}
                    className="gap-2 text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
