"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, BookOpen, Zap, Target, MessageCircle, Home } from "lucide-react"
import Link from "next/link"
import { loadParticleLearningData } from "@/services/particle-learning.service"
import { ParticleLearningData } from "@/types/particle-learning"
import { motion } from "framer-motion"

export default function ParticleLearningPage() {
  const [data, setData] = useState<ParticleLearningData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const particleData = await loadParticleLearningData()
        setData(particleData)
      } catch (error) {
        console.error("Failed to load particle data:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 text-lg">Failed to load particle data</p>
          </div>
        </div>
      </div>
    )
  }

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

      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dlingo-special">
            <Button variant="ghost" className="mb-4 gap-2">
              <Home className="h-4 w-4" />
              Back to Special Dashboard
            </Button>
          </Link>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Particles Master
                </span>
                <Sparkles className="inline-block ml-3 h-10 w-10 text-yellow-500 animate-pulse" />
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                {data.description}
              </p>
              <Badge variant="outline" className="text-sm">
                {data.particleGuide.length} Essential Particles
              </Badge>
            </motion.div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/dlingo-special/particles/learn">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-pink-200 dark:border-pink-800">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-pink-600" />
                <h3 className="font-bold text-lg mb-2">Learn Particles</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Interactive lessons with tricks & tips
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dlingo-special/particles/quiz">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 mx-auto mb-3 text-purple-600" />
                <h3 className="font-bold text-lg mb-2">Practice Quiz</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Test your knowledge with instant feedback
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dlingo-special/particles/mistakes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-bold text-lg mb-2">Common Mistakes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avoid typical errors & confusions
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Particle Cards Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            All Particles
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.particleGuide.map((particle, index) => (
              <motion.div
                key={particle.particle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/dlingo-special/particles/learn?particle=${encodeURIComponent(particle.particle)}`}>
                  <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-5xl mb-3">
                        {particleEmojis[particle.particle] || "📝"}
                      </div>
                      <div className="text-4xl font-bold mb-2 text-purple-600 dark:text-purple-400">
                        {particle.particle}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {particle.primaryUse}
                      </p>
                      <Badge variant="outline" className="mt-3 text-xs">
                        {particle.examples.length} examples
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Practice Dialogues Preview */}
        {data.practiceDialogues && data.practiceDialogues.length > 0 && (
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-green-600" />
                <CardTitle>Practice Dialogues</CardTitle>
              </div>
              <CardDescription>
                Real conversations showing particles in context
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {data.practiceDialogues.slice(0, 4).map((dialogue, index) => (
                  <Link key={index} href={`/dlingo-special/particles/dialogue?id=${index}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-1">{dialogue.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dialogue.situation}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              {data.practiceDialogues.length > 4 && (
                <div className="text-center mt-4">
                  <Link href="/dlingo-special/particles/dialogues">
                    <Button variant="outline">View All Dialogues</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
