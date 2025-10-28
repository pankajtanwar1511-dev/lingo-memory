"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { VocabularyCard, Example } from "@/types/vocabulary"
import { Search, Plus, Check, Sparkles } from "lucide-react"

interface SentenceMiningProps {
  onAddCard: (card: Omit<VocabularyCard, "id">) => void
}

export function SentenceMining({ onAddCard }: SentenceMiningProps) {
  const [inputText, setInputText] = useState("")
  const [minedWords, setMinedWords] = useState<Array<{
    word: string
    reading: string
    meaning: string
    context: string
  }>>([])
  const [loading, setLoading] = useState(false)

  const analyzeText = async () => {
    if (!inputText.trim()) return

    setLoading(true)

    try {
      // In production, this would call a Japanese NLP API
      // For now, we'll do basic extraction
      const words = extractWords(inputText)
      setMinedWords(words)
    } catch (error) {
      console.error("Failed to analyze text:", error)
    } finally {
      setLoading(false)
    }
  }

  const extractWords = (text: string) => {
    // This is a simplified extraction
    // In production, use a proper Japanese tokenizer like kuromoji or mecab
    const japanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g
    const matches = text.match(japanese)

    if (!matches) return []

    // Group characters into words (simplified)
    const words: Array<{
      word: string
      reading: string
      meaning: string
      context: string
    }> = []

    // This is a placeholder - real implementation would use proper tokenization
    const uniqueWords = [...new Set(matches)]
    uniqueWords.slice(0, 10).forEach(word => {
      words.push({
        word,
        reading: word, // Would be converted using a dictionary
        meaning: "Definition needed", // Would be looked up
        context: text
      })
    })

    return words
  }

  const handleAddWord = (word: {
    word: string
    reading: string
    meaning: string
    context: string
  }) => {
    const example: Example = {
      japanese: word.context,
      english: "Translation needed",
      source: { type: "custom" }
    }

    const card: Omit<VocabularyCard, "id"> = {
      kanji: word.word,
      kana: word.reading,
      meaning: word.meaning,
      examples: [example],
      tags: ["mined", "needs-review"],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    onAddCard(card)

    // Remove from mined words
    setMinedWords(prev => prev.filter(w => w.word !== word.word))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Sentence Mining</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Extract vocabulary from Japanese text
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Paste Japanese text
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="貼り付けまたは入力してください..."
            className="w-full h-32 p-3 border rounded-lg resize-none"
          />
        </div>

        <Button
          onClick={analyzeText}
          disabled={!inputText.trim() || loading}
          className="w-full gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze Text
            </>
          )}
        </Button>
      </Card>

      {minedWords.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">
            Found {minedWords.length} words
          </h3>
          <div className="space-y-3">
            {minedWords.map((word, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <div className="flex-1">
                  <div className="text-xl font-medium mb-1">{word.word}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Reading: {word.reading}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {word.meaning}
                  </div>
                  <Badge variant="outline" className="mt-2">
                    mined
                  </Badge>
                </div>
                <Button
                  onClick={() => handleAddWord(word)}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          Pro Tip
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Sentence mining is a powerful way to learn vocabulary in context. Import text from articles, books, or
          conversations to build your personal vocabulary deck.
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          Note: This feature uses basic extraction. For production, integrate with MeCab, Kuromoji, or similar
          Japanese NLP tools for accurate tokenization and definitions.
        </p>
      </Card>
    </div>
  )
}
