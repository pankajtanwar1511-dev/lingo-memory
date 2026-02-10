"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Home, ArrowLeft, Star, HelpCircle, Shuffle } from "lucide-react"
import Link from "next/link"
import {
  loadSpecialData,
  getCategory,
} from "@/services/dlingo-special.service"
import { JapaneseText } from "@/components/dlingo-special/japanese-text"
import { SpecialCategory } from "@/types/dlingo-special"

export default function TableViewPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<SpecialCategory | null>(null)
  const [categoryIndex, setCategoryIndex] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        await loadSpecialData()
        const catIndex = parseInt(searchParams.get("category") || "0")
        setCategoryIndex(catIndex)

        const cat = getCategory(catIndex)
        if (cat) {
          setCategory(cat)
        }
      } catch (error) {
        console.error("Failed to load:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [searchParams])

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

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Category not found</p>
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
        <div className="flex items-center justify-between mb-6">
          <Link href="/dlingo-special">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {category.category}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quick Reference Table
            </p>
          </div>

          <div className="w-32" /> {/* Spacer */}
        </div>

        {/* Legend for special words */}
        <Card className="mb-6 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Special Markers:
              </span>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Question word
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shuffle className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Multiple readings
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Irregular/Exception
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500 ml-auto">
                211 special words out of 450 total
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subcategories */}
        <div className="space-y-6">
          {category.subcategories.map((subcategory, subIndex) => (
            <Card key={subIndex}>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{subcategory.subcategory}</CardTitle>
                  <Badge variant="outline">
                    {subcategory.words.length} words
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Japanese
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          English
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {subcategory.words.map((word, wordIndex) => {
                        // Determine special icon and color
                        const getSpecialIcon = () => {
                          if (!word.special) return null
                          switch (word.specialReason) {
                            case "question":
                              return <HelpCircle className="h-4 w-4 text-blue-500" />
                            case "multiple-readings":
                              return <Shuffle className="h-4 w-4 text-orange-500" />
                            case "irregular":
                              return <Star className="h-4 w-4 text-yellow-500" />
                            default:
                              return <Star className="h-4 w-4 text-purple-500" />
                          }
                        }

                        const specialBgClass = word.special
                          ? "bg-yellow-50 dark:bg-yellow-900/10"
                          : ""

                        return (
                          <tr
                            key={wordIndex}
                            className={`hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${specialBgClass}`}
                          >
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                {wordIndex + 1}
                                {word.special && getSpecialIcon()}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                  <JapaneseText text={word.japanese} />
                                </span>
                                {word.special && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {word.specialReason === "question" && "Q"}
                                    {word.specialReason === "multiple-readings" && "Alt"}
                                    {word.specialReason === "irregular" && "Irreg"}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-base text-gray-700 dark:text-gray-300">
                                {word.english}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="text-xs opacity-60">
                                {word.type}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom navigation */}
        <div className="mt-8 text-center">
          <Link href={`/dlingo-special/learn?category=${categoryIndex}`}>
            <Button variant="default" className="mr-2">
              Start Learning
            </Button>
          </Link>
          <Link href={`/dlingo-special/drill?category=${categoryIndex}`}>
            <Button variant="outline">
              Start Drill
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
