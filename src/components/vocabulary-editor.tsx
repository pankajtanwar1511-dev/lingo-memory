"use client"

import { useState, useEffect } from "react"
import { VocabularyCard, JLPTLevel, Example } from "@/types/vocabulary"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save } from "lucide-react"
import { PersonaBadge } from "@/components/persona"

interface VocabularyEditorProps {
  card?: VocabularyCard
  onSave: (card: VocabularyCard) => void
  onCancel: () => void
}

export function VocabularyEditor({ card, onSave, onCancel }: VocabularyEditorProps) {
  const [formData, setFormData] = useState<Partial<VocabularyCard>>({
    id: "",
    kanji: "",
    kana: "",
    meaning: [],
    examples: [],
    tags: [],
    jlptLevel: undefined,
    partOfSpeech: []
  })

  const [newExample, setNewExample] = useState<Example>({
    japanese: "",
    kana: "",
    english: "",
    source: { type: "custom" },
    license: { text: "Custom", url: "" }
  })

  const [newTag, setNewTag] = useState("")
  const [newPartOfSpeech, setNewPartOfSpeech] = useState("")

  useEffect(() => {
    if (card) {
      setFormData(card)
    } else {
      // Generate new ID for new card
      setFormData(prev => ({
        ...prev,
        id: `custom_${Date.now()}`
      }))
    }
  }, [card])

  const handleSave = () => {
    if (!formData.kana?.trim()) {
      alert("Kana reading is required")
      return
    }

    if (!formData.meaning || formData.meaning.length === 0) {
      alert("Meaning is required")
      return
    }

    const cardToSave: VocabularyCard = {
      id: formData.id || `custom_${Date.now()}`,
      kanji: formData.kanji || undefined,
      kana: formData.kana!,
      meaning: formData.meaning!,
      examples: formData.examples || [],
      tags: formData.tags || [],
      jlptLevel: formData.jlptLevel!,
      partOfSpeech: formData.partOfSpeech || [],
      source: formData.source || { type: "custom" },
      license: formData.license || { text: "Custom", url: "" },
      createdAt: card?.createdAt || new Date(),
      updatedAt: new Date()
    }

    onSave(cardToSave)
  }

  const addExample = () => {
    if (!newExample.japanese.trim() || !newExample.english.trim()) {
      return
    }

    setFormData(prev => ({
      ...prev,
      examples: [...(prev.examples || []), newExample]
    }))

    setNewExample({
      japanese: "",
      kana: "",
      english: "",
      source: { type: "custom" },
      license: { text: "Custom", url: "" }
    })
  }

  const removeExample = (index: number) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples?.filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (!newTag.trim()) return

    if (formData.tags?.includes(newTag.trim())) {
      return
    }

    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), newTag.trim()]
    }))

    setNewTag("")
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag)
    }))
  }

  const addPartOfSpeech = () => {
    if (!newPartOfSpeech.trim()) return

    if (formData.partOfSpeech?.includes(newPartOfSpeech.trim())) {
      return
    }

    setFormData(prev => ({
      ...prev,
      partOfSpeech: [...(prev.partOfSpeech || []), newPartOfSpeech.trim()]
    }))

    setNewPartOfSpeech("")
  }

  const removePartOfSpeech = (pos: string) => {
    setFormData(prev => ({
      ...prev,
      partOfSpeech: prev.partOfSpeech?.filter(p => p !== pos)
    }))
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {card ? "Edit Vocabulary Card" : "Create New Card"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Kanji (optional)
            </label>
            <Input
              type="text"
              placeholder="漢字"
              value={formData.kanji || ""}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, kanji: e.target.value }))
              }
              className="text-xl"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Kana Reading *
            </label>
            <Input
              type="text"
              placeholder="かんじ"
              value={formData.kana || ""}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, kana: e.target.value }))
              }
              className="text-xl"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">
            Meaning (English) *
          </label>
          <Input
            type="text"
            placeholder="Chinese character; kanji"
            value={Array.isArray(formData.meaning) ? formData.meaning.join("; ") : ""}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                meaning: e.target.value.split(";").map(m => m.trim()).filter(m => m)
              }))
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate multiple meanings with semicolons (;)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              JLPT Level
            </label>
            <Select
              value={formData.jlptLevel || ""}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  jlptLevel: e.target.value as JLPTLevel | undefined
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
              Part of Speech
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="noun, verb, adjective..."
                value={newPartOfSpeech}
                onChange={(e) => setNewPartOfSpeech(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPartOfSpeech())}
              />
              <Button type="button" onClick={addPartOfSpeech} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formData.partOfSpeech?.map(pos => (
                <Badge key={pos} variant="outline" className="gap-1">
                  {pos}
                  <button onClick={() => removePartOfSpeech(pos)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Example Sentences
        </label>

        <div className="space-y-3 mb-3">
          {formData.examples?.map((example, index) => (
            <Card key={index} className="p-3 border-l-2 border-blue-400/50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-1.5">
                  <PersonaBadge type="source" status={example.source.type} />
                  {example.needsReview && (
                    <PersonaBadge type="review" status="needs_review" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExample(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <p className="font-medium">{example.japanese}</p>
                {example.kana && (
                  <p className="text-sm text-gray-600">{example.kana}</p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  "{example.english}"
                </p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-3 space-y-2">
          <Input
            type="text"
            placeholder="Japanese example sentence"
            value={newExample.japanese}
            onChange={(e) =>
              setNewExample(prev => ({ ...prev, japanese: e.target.value }))
            }
          />
          <Input
            type="text"
            placeholder="Hiragana reading (optional)"
            value={newExample.kana}
            onChange={(e) =>
              setNewExample(prev => ({ ...prev, kana: e.target.value }))
            }
          />
          <Input
            type="text"
            placeholder="English translation"
            value={newExample.english}
            onChange={(e) =>
              setNewExample(prev => ({ ...prev, english: e.target.value }))
            }
          />
          <Button onClick={addExample} size="sm" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Add Example
          </Button>
        </Card>
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            type="text"
            placeholder="common, conversational, business..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          <Button onClick={addTag} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {formData.tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          {card ? "Save Changes" : "Create Card"}
        </Button>
      </div>
    </Card>
  )
}
