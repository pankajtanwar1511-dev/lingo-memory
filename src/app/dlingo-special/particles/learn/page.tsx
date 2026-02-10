"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Loader2, ChevronLeft, ChevronRight, Lightbulb, AlertCircle,
  CheckCircle2, Home, Sparkles, Eye, EyeOff
} from "lucide-react"
import Link from "next/link"
import { loadParticleLearningData } from "@/services/particle-learning.service"
import { ParticleGuide } from "@/types/particle-learning"
import { motion, AnimatePresence } from "framer-motion"

export default function ParticleLearnPage() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<ParticleGuide[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showExamples, setShowExamples] = useState(true)
  const [revealedExamples, setRevealedExamples] = useState<Set<number>>(new Set())

  useEffect(() => {
    const load = async () => {
      try {
        const particleData = await loadParticleLearningData()
        const particleParam = searchParams.get("particle")

        if (particleParam) {
          const index = particleData.particleGuide.findIndex(
            p => p.particle === particleParam
          )
          if (index >= 0) {
            setCurrentIndex(index)
          }
        }

        setData(particleData.particleGuide)
      } catch (error) {
        console.error("Failed to load:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [searchParams])

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setRevealedExamples(new Set())
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setRevealedExamples(new Set())
    }
  }

  const toggleExample = (index: number) => {
    const newRevealed = new Set(revealedExamples)
    if (newRevealed.has(index)) {
      newRevealed.delete(index)
    } else {
      newRevealed.add(index)
    }
    setRevealedExamples(newRevealed)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
          </div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">No particle data found</p>
          </div>
        </div>
      </div>
    )
  }

  const current = data[currentIndex]

  const particleEmojis: { [key: string]: string } = {
    "に": "📍",
    "を": "🎯",
    "が": "⭐",
    "で": "🏃",
    "は": "🎨",
    "も": "➕",
    "の": "🔗",
    "と": "🤝",
    "から": "🚀",
    "まで": "🏁",
    "へ": "➡️"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Header />

      <div className="container mx-auto py-8 px-4 max-w-5xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dlingo-special/particles">
            <Button variant="ghost" className="gap-2">
              <Home className="h-4 w-4" />
              Back
            </Button>
          </Link>

          <Badge variant="outline" className="text-sm">
            {currentIndex + 1} / {data.length}
          </Badge>

          <div className="w-20" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main Particle Card */}
            <Card className="mb-6 border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-7xl mb-4">
                    {particleEmojis[current.particle] || "📝"}
                  </div>
                  <h1 className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                    {current.particle}
                  </h1>
                  <p className="text-2xl text-gray-700 dark:text-gray-300 mb-2">
                    {current.primaryUse}
                  </p>
                </div>

                {/* Tips Section */}
                {current.tips && current.tips.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-bold text-lg">Pro Tips</h3>
                    </div>
                    <ul className="space-y-2">
                      {current.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Examples Section */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Examples in Context
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExamples(!showExamples)}
                  >
                    {showExamples ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {showExamples ? "Hide" : "Show"} All
                  </Button>
                </div>
              </CardHeader>
              {showExamples && (
                <CardContent className="space-y-4">
                  {current.examples.map((example, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => toggleExample(index)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {example.japanese}
                              </p>
                              <AnimatePresence>
                                {revealedExamples.has(index) && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                  >
                                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                                      {example.english}
                                    </p>
                                    <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950/30 rounded p-3">
                                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                      <p className="text-sm text-blue-800 dark:text-blue-300">
                                        {example.note}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleExample(index)
                              }}
                            >
                              {revealedExamples.has(index) ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </CardContent>
              )}
            </Card>

            {/* No Particle Examples (if available) */}
            {current.noParticleExamples && current.noParticleExamples.length > 0 && (
              <Card className="mb-6 border-2 border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <AlertCircle className="h-5 w-5" />
                    When NOT to use {current.particle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {current.noParticleExamples.map((example, index) => (
                    <div key={index} className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">
                        {example.japanese}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                        {example.english}
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-400">
                        💡 {example.note}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentIndex === data.length - 1}
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
