"use client"

import { useState, useMemo } from "react"
import { VocabularyCard, JLPTLevel } from "@/types/vocabulary"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VocabularySearchProps {
  vocabulary: VocabularyCard[]
  onSelectCard?: (card: VocabularyCard) => void
  onBulkSelect?: (cards: VocabularyCard[]) => void
  showBulkActions?: boolean
}

interface FilterState {
  searchQuery: string
  jlptLevel: JLPTLevel | "all"
  partOfSpeech: string
  hasKanji: boolean | "all"
  hasExamples: boolean | "all"
  tags: string[]
}

export function VocabularySearch({
  vocabulary,
  onSelectCard,
  onBulkSelect,
  showBulkActions = false
}: VocabularySearchProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    jlptLevel: "all",
    partOfSpeech: "all",
    hasKanji: "all",
    hasExamples: "all",
    tags: []
  })

  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique values for filters
  const { partOfSpeechOptions, allTags } = useMemo(() => {
    const posSet = new Set<string>()
    const tagSet = new Set<string>()

    vocabulary.forEach(card => {
      card.partOfSpeech?.forEach(pos => posSet.add(pos))
      card.tags?.forEach(tag => tagSet.add(tag))
    })

    return {
      partOfSpeechOptions: Array.from(posSet).sort(),
      allTags: Array.from(tagSet).sort()
    }
  }, [vocabulary])

  // Filter vocabulary based on current filters
  const filteredVocabulary = useMemo(() => {
    return vocabulary.filter(card => {
      // Search query (matches kanji, kana, or meaning)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const meaning = Array.isArray(card.meaning)
          ? card.meaning.join(" ").toLowerCase()
          : card.meaning.toLowerCase()

        const matches =
          card.kanji?.toLowerCase().includes(query) ||
          card.kana.toLowerCase().includes(query) ||
          meaning.includes(query)

        if (!matches) return false
      }

      // JLPT level filter
      if (filters.jlptLevel !== "all" && card.jlptLevel !== filters.jlptLevel) {
        return false
      }

      // Part of speech filter
      if (filters.partOfSpeech !== "all") {
        if (!card.partOfSpeech?.includes(filters.partOfSpeech)) {
          return false
        }
      }

      // Kanji filter
      if (filters.hasKanji !== "all") {
        const hasKanji = !!card.kanji
        if (hasKanji !== filters.hasKanji) {
          return false
        }
      }

      // Examples filter
      if (filters.hasExamples !== "all") {
        const hasExamples = card.examples && card.examples.length > 0
        if (hasExamples !== filters.hasExamples) {
          return false
        }
      }

      // Tags filter
      if (filters.tags.length > 0) {
        if (!card.tags || !filters.tags.some(tag => card.tags!.includes(tag))) {
          return false
        }
      }

      return true
    })
  }, [vocabulary, filters])

  // Handle card selection for bulk operations
  const toggleCardSelection = (cardId: string) => {
    const newSelection = new Set(selectedCards)
    if (newSelection.has(cardId)) {
      newSelection.delete(cardId)
    } else {
      newSelection.add(cardId)
    }
    setSelectedCards(newSelection)

    if (onBulkSelect) {
      const selected = vocabulary.filter(card => newSelection.has(card.id))
      onBulkSelect(selected)
    }
  }

  const selectAll = () => {
    const allIds = new Set(filteredVocabulary.map(card => card.id))
    setSelectedCards(allIds)
    if (onBulkSelect) {
      onBulkSelect(filteredVocabulary)
    }
  }

  const clearSelection = () => {
    setSelectedCards(new Set())
    if (onBulkSelect) {
      onBulkSelect([])
    }
  }

  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      jlptLevel: "all",
      partOfSpeech: "all",
      hasKanji: "all",
      hasExamples: "all",
      tags: []
    })
  }

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search vocabulary (kanji, kana, meaning)..."
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters(prev => ({ ...prev, searchQuery: e.target.value }))
            }
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        {(filters.jlptLevel !== "all" ||
          filters.partOfSpeech !== "all" ||
          filters.tags.length > 0) && (
          <Button variant="ghost" onClick={resetFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* JLPT Level */}
            <div>
              <label className="text-sm font-medium mb-2 block">JLPT Level</label>
              <Select
                value={filters.jlptLevel}
                onChange={(e) =>
                  setFilters(prev => ({
                    ...prev,
                    jlptLevel: e.target.value as JLPTLevel | "all"
                  }))
                }
              >
                <option value="all">All Levels</option>
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
                <option value="N2">N2</option>
                <option value="N1">N1</option>
              </Select>
            </div>

            {/* Part of Speech */}
            <div>
              <label className="text-sm font-medium mb-2 block">Part of Speech</label>
              <Select
                value={filters.partOfSpeech}
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, partOfSpeech: e.target.value }))
                }
              >
                <option value="all">All Types</option>
                {partOfSpeechOptions.map(pos => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </Select>
            </div>

            {/* Has Kanji */}
            <div>
              <label className="text-sm font-medium mb-2 block">Kanji</label>
              <Select
                value={String(filters.hasKanji)}
                onChange={(e) =>
                  setFilters(prev => ({
                    ...prev,
                    hasKanji: e.target.value === "all" ? "all" : e.target.value === "true"
                  }))
                }
              >
                <option value="all">All</option>
                <option value="true">With Kanji</option>
                <option value="false">Kana Only</option>
              </Select>
            </div>

            {/* Has Examples */}
            <div>
              <label className="text-sm font-medium mb-2 block">Examples</label>
              <Select
                value={String(filters.hasExamples)}
                onChange={(e) =>
                  setFilters(prev => ({
                    ...prev,
                    hasExamples: e.target.value === "all" ? "all" : e.target.value === "true"
                  }))
                }
              >
                <option value="all">All</option>
                <option value="true">With Examples</option>
                <option value="false">Without Examples</option>
              </Select>
            </div>
          </div>

          {/* Category Tags Filter */}
          {allTags.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Categories & Tags</label>
              <div className="space-y-3">
                {/* Semantic Categories (Priority Display) */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Semantic Categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {allTags
                      .filter(tag => ['food', 'time', 'family', 'numbers', 'location', 'home', 'school', 'work', 'transportation', 'weather', 'body', 'clothes', 'color', 'emotion', 'question', 'animals', 'nature', 'actions'].includes(tag))
                      .map(tag => (
                        <Badge
                          key={tag}
                          variant={filters.tags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>

                {/* Part of Speech Tags */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Grammar:</p>
                  <div className="flex flex-wrap gap-2">
                    {allTags
                      .filter(tag => ['noun', 'verb', 'adjective', 'adverb', 'particle', 'i-adjective', 'na-adjective'].includes(tag))
                      .map(tag => (
                        <Badge
                          key={tag}
                          variant={filters.tags.includes(tag) ? "secondary" : "outline"}
                          className="cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-900"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredVocabulary.length} {filteredVocabulary.length === 1 ? "card" : "cards"} found
        </p>
        {showBulkActions && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All
            </Button>
            {selectedCards.size > 0 && (
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear ({selectedCards.size})
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Results List */}
      <div className="space-y-2">
        {filteredVocabulary.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <p>No vocabulary cards match your filters.</p>
            <Button variant="link" onClick={resetFilters} className="mt-2">
              Reset filters
            </Button>
          </Card>
        ) : (
          filteredVocabulary.map(card => (
            <Card
              key={card.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                selectedCards.has(card.id) ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() => {
                if (showBulkActions) {
                  toggleCardSelection(card.id)
                } else if (onSelectCard) {
                  onSelectCard(card)
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {showBulkActions && (
                      <Checkbox
                        checked={selectedCards.has(card.id)}
                        onChange={() => toggleCardSelection(card.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    <h3 className="text-lg font-medium">
                      {card.kanji && <span className="text-xl mr-2">{card.kanji}</span>}
                      <span className="text-gray-600 dark:text-gray-400">{card.kana}</span>
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {Array.isArray(card.meaning) ? card.meaning.join("; ") : card.meaning}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {card.jlptLevel && (
                      <Badge variant="secondary">{card.jlptLevel}</Badge>
                    )}
                    {card.partOfSpeech?.map(pos => (
                      <Badge key={pos} variant="outline">
                        {pos}
                      </Badge>
                    ))}
                    {card.tags
                      ?.filter(tag => ['food', 'time', 'family', 'numbers', 'location', 'home', 'school', 'work', 'transportation', 'weather', 'body', 'clothes', 'color', 'emotion', 'question', 'animals', 'nature', 'actions'].includes(tag))
                      .slice(0, 3)
                      .map(tag => (
                        <Badge key={tag} variant="default" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
