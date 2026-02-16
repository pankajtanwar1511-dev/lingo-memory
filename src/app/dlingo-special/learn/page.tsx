"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Eye, EyeOff, Loader2, Home } from "lucide-react"
import Link from "next/link"
import {
  loadSpecialData,
  getCategory,
  getSubcategory,
  getCategoryType,
  getVisualAidType,
  getWordVisualHint,
} from "@/services/dlingo-special.service"
import { ClockVisual } from "@/components/dlingo-special/clock-visual"
import { CalendarVisual } from "@/components/dlingo-special/calendar-visual"
import { NumberVisual } from "@/components/dlingo-special/number-visual"
import { CounterVisual } from "@/components/dlingo-special/counter-visual"
import { JapaneseText } from "@/components/dlingo-special/japanese-text"
import { SpecialWord } from "@/types/dlingo-special"

export default function LearnModePage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [subcategoryIndex, setSubcategoryIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [currentWord, setCurrentWord] = useState<SpecialWord | null>(null)
  const [categoryName, setCategoryName] = useState("")
  const [subcategoryName, setSubcategoryName] = useState("")
  const [totalWords, setTotalWords] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        await loadSpecialData()
        const catIndex = parseInt(searchParams.get("category") || "0")
        const subIndex = parseInt(searchParams.get("subcategory") || "0")

        setCategoryIndex(catIndex)
        setSubcategoryIndex(subIndex)

        const category = getCategory(catIndex)
        const subcategory = getSubcategory(catIndex, subIndex)

        if (category && subcategory) {
          setCategoryName(category.category)
          setSubcategoryName(subcategory.subcategory)
          setTotalWords(subcategory.words.length)
          setCurrentWord(subcategory.words[0])
        }
      } catch (error) {
        console.error("Failed to load:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [searchParams])

  // Update current word when index changes
  useEffect(() => {
    const subcategory = getSubcategory(categoryIndex, subcategoryIndex)
    if (subcategory && subcategory.words[wordIndex]) {
      setCurrentWord(subcategory.words[wordIndex])
      setShowAnswer(false)
    }
  }, [categoryIndex, subcategoryIndex, wordIndex])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [wordIndex, totalWords])

  const handlePrevious = () => {
    if (wordIndex > 0) {
      setWordIndex(wordIndex - 1)
    } else if (subcategoryIndex > 0) {
      // Go to previous subcategory
      const prevSubIndex = subcategoryIndex - 1
      const prevSubcategory = getSubcategory(categoryIndex, prevSubIndex)

      if (prevSubcategory) {
        setSubcategoryIndex(prevSubIndex)
        setSubcategoryName(prevSubcategory.subcategory)
        setTotalWords(prevSubcategory.words.length)
        setWordIndex(prevSubcategory.words.length - 1)
        setCurrentWord(prevSubcategory.words[prevSubcategory.words.length - 1])
      }
    }
  }

  const handleNext = () => {
    if (wordIndex < totalWords - 1) {
      setWordIndex(wordIndex + 1)
    } else {
      // Go to next subcategory
      const category = getCategory(categoryIndex)
      if (category && subcategoryIndex < category.subcategories.length - 1) {
        const nextSubIndex = subcategoryIndex + 1
        const nextSubcategory = getSubcategory(categoryIndex, nextSubIndex)

        if (nextSubcategory) {
          setSubcategoryIndex(nextSubIndex)
          setSubcategoryName(nextSubcategory.subcategory)
          setTotalWords(nextSubcategory.words.length)
          setWordIndex(0)
          setCurrentWord(nextSubcategory.words[0])
        }
      }
    }
  }

  // Render visual aid based on category type
  const renderVisualAid = () => {
    if (!currentWord) return null

    const categoryType = getCategoryType(categoryName)
    const visualType = getVisualAidType(categoryType)

    // Try to extract time/number/date from Japanese text
    const extractTimeInfo = (text: string) => {
      // Extract hour (じ)
      const hourMatch = text.match(/(いち|に|さん|よ|ご|ろく|しち|はち|く|じゅう|じゅういち|じゅうに)じ/)
      if (hourMatch) {
        const hours = ["いち", "に", "さん", "よ", "ご", "ろく", "しち", "はち", "く", "じゅう", "じゅういち", "じゅうに"]
        return { hour: hours.indexOf(hourMatch[1]) + 1 }
      }
      return null
    }

    const extractNumber = (text: string) => {
      // Simple number extraction - can be enhanced
      const match = currentWord.english.match(/\d+/)
      if (match) {
        return parseInt(match[0])
      }
      return null
    }

    switch (visualType) {
      case "clock": {
        const timeInfo = extractTimeInfo(currentWord.japanese)
        return timeInfo ? <ClockVisual hour={timeInfo.hour} minute={0} size={180} /> : null
      }

      case "calendar": {
        // For date learning
        return <CalendarVisual day={15} month={6} year={2024} size="md" />
      }

      case "number-builder": {
        const number = extractNumber(currentWord.japanese + currentWord.english)
        return number !== null ? <NumberVisual number={number} size="md" /> : null
      }

      case "counter-icons": {
        // Extract count from Japanese text
        const japaneseCounters: { [key: string]: number } = {
          "ひとり": 1, "ふたり": 2, "ひとつ": 1, "ふたつ": 2, "みっつ": 3, "よっつ": 4,
          "いつつ": 5, "むっつ": 6, "ななつ": 7, "やっつ": 8, "ここのつ": 9, "とお": 10,
          "いち": 1, "に": 2, "さん": 3, "よん": 4, "よ": 4, "ご": 5, "ろく": 6, "ろっ": 6,
          "なな": 7, "しち": 7, "はち": 8, "はっ": 8, "きゅう": 9, "く": 9, "じゅう": 10, "じゅっ": 10, "じっ": 10
        }

        // Try to extract from Japanese
        let count = 1
        for (const [key, value] of Object.entries(japaneseCounters)) {
          if (currentWord.japanese.startsWith(key)) {
            count = value
            break
          }
        }

        // Fallback: Extract from English
        const englishCounts: { [key: string]: number } = {
          "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
          "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10
        }
        const countMatch = currentWord.english.match(/^(\w+)\s/)
        if (countMatch && englishCounts[countMatch[1]]) {
          count = englishCounts[countMatch[1]]
        }

        return <CounterVisual counterType={currentWord.japanese} count={count} size="md" />
      }

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          </div>
        </div>
      </div>
    )
  }

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No words found</p>
          </div>
        </div>
      </div>
    )
  }

  const progress = ((wordIndex + 1) / totalWords) * 100
  const categoryType = getCategoryType(categoryName)
  const visualHint = getWordVisualHint(currentWord, categoryType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Header />

      <div className="container mx-auto py-8 px-4 max-w-5xl">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dlingo-special">
            <Button variant="ghost" className="gap-2">
              <Home className="h-4 w-4" />
              Back to Dlingo Special
            </Button>
          </Link>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {categoryName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subcategoryName}
            </p>
          </div>

          <div className="w-32" /> {/* Spacer */}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              {wordIndex + 1} / {totalWords}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Dual Card Layout - Side by Side */}
        <motion.div
          key={`${categoryIndex}-${subcategoryIndex}-${wordIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* English Card */}
          <Card className="min-h-[400px] border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8 h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20">
                  English
                </Badge>
                {currentWord.special && (
                  <Badge variant="secondary" className="text-xs">
                    {currentWord.specialReason === "question" && "Question"}
                    {currentWord.specialReason === "multiple-readings" && "Alt Reading"}
                    {currentWord.specialReason === "irregular" && "Irregular"}
                  </Badge>
                )}
              </div>

              {/* Content - Centered */}
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <h2 className="text-5xl md:text-6xl font-bold text-blue-700 dark:text-blue-300">
                  {currentWord.english}
                </h2>
                <Badge variant="outline" className="text-xs opacity-40">
                  {currentWord.type}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Japanese Card */}
          <Card className="min-h-[400px] border-2 border-purple-200 dark:border-purple-800">
            <CardContent className="p-8 h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/20">
                  日本語
                </Badge>
                {visualHint && (
                  <span className="text-3xl">{visualHint}</span>
                )}
              </div>

              {/* Content - Centered */}
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <h2 className="text-5xl md:text-6xl font-bold text-purple-700 dark:text-purple-300">
                  <JapaneseText text={currentWord.japanese} />
                </h2>

                {/* Visual Aid */}
                <div className="mt-4">
                  {renderVisualAid()}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            onClick={handlePrevious}
            disabled={categoryIndex === 0 && subcategoryIndex === 0 && wordIndex === 0}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
