"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  BookOpen, Search, Filter, Zap, BarChart3,
  ChevronRight, Sparkles, Target, TrendingUp,
  CheckCircle2, Circle, Grid3x3, List, Eye, EyeOff, Layers, RefreshCw,
  Shuffle, GraduationCap, ThumbsUp, ThumbsDown, SkipForward, RotateCcw, BookText
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface VerbExample {
  japanese: string
  kana: string
  english: string
  highlight: string
}

interface N5Verb {
  id: string
  kanji: string
  kana: string
  romaji: string
  meaning: string[]
  primaryMeaning: string
  jlptLevel: string
  verbGroup: "godan" | "ichidan" | "irregular"
  verbType: {
    transitive: boolean | null
    intransitive: boolean | null
  }
  conjugations: {
    dictionary: string
    dictionaryKana: string
    masu: string
    masuKana: string
    te: string
    teKana: string
  }
  teFormExamples?: VerbExample[]
  tags: string[]
  context?: string | null
  examples?: VerbExample[]
}

interface VerbsData {
  metadata: {
    version: string
    totalEntries: number
    uniqueVerbs: number
    groups: {
      godan: number
      ichidan: number
      irregular: number
    }
  }
  verbs: N5Verb[]
}

type ViewMode = "all" | "dictionary" | "masu" | "kana-masu" | "dictionary-kana" | "te-form" | "te-form-kana"
type FlipSide = "english" | "kanji" | "kana" | "masu-kanji" | "masu-kana" | "te-kanji" | "te-kana"

interface VerbProgress {
  verbId: string
  knownCount: number
  unknownCount: number
  lastReviewed: Date
  nextReview: Date
  level: number // 0-5: higher = better retention
}

export default function VerbsPage() {
  const [verbsData, setVerbsData] = useState<VerbsData | null>(null)
  const [filteredVerbs, setFilteredVerbs] = useState<N5Verb[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())
  const [flipMode, setFlipMode] = useState(false)
  const [frontSide, setFrontSide] = useState<FlipSide>("english")
  const [backSide, setBackSide] = useState<FlipSide>("kanji")

  // New features
  const [shuffleMode, setShuffleMode] = useState(false)
  const [testMode, setTestMode] = useState(false)
  const [currentTestIndex, setCurrentTestIndex] = useState(0)
  const [verbProgress, setVerbProgress] = useState<Map<string, VerbProgress>>(new Map())
  const [showAnswer, setShowAnswer] = useState(false)
  const [showOnlyUnknown, setShowOnlyUnknown] = useState(false)
  const [expandedMeanings, setExpandedMeanings] = useState<Set<string>>(new Set())
  const [expandedExamples, setExpandedExamples] = useState<Set<string>>(new Set())
  const [examplesPopup, setExamplesPopup] = useState<{ verbId: string; verb: N5Verb; position: { x: number; y: number }; showKana: boolean; showTeFormExamples?: boolean } | null>(null)

  // Matching exercise states
  const [matchingMode, setMatchingMode] = useState(false)
  const [matchingLeftForm, setMatchingLeftForm] = useState<FlipSide>("english")
  const [matchingRightForm, setMatchingRightForm] = useState<FlipSide>("kanji")
  const [currentBatch, setCurrentBatch] = useState(0)
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [matches, setMatches] = useState<Map<string, string>>(new Map())
  const [correctMatches, setCorrectMatches] = useState<Set<string>>(new Set())
  const [wrongAttempts, setWrongAttempts] = useState<Set<string>>(new Set())
  const [shuffledRightVerbs, setShuffledRightVerbs] = useState<N5Verb[]>([])
  const [matchingTestMode, setMatchingTestMode] = useState(false)
  const [batchScores, setBatchScores] = useState<number[]>([])
  const [showBatchResult, setShowBatchResult] = useState(false)
  const [totalAttempts, setTotalAttempts] = useState(0)

  // Load verbs data
  useEffect(() => {
    async function loadVerbs() {
      try {
        const response = await fetch('/seed-data/N5_verbs_dataset.json')
        const data: VerbsData = await response.json()
        setVerbsData(data)
        setFilteredVerbs(data.verbs)
        setIsLoading(false)

        // Load progress from localStorage
        const savedProgress = localStorage.getItem('verbProgress')
        if (savedProgress) {
          const progressData = JSON.parse(savedProgress)
          const progressMap = new Map()
          Object.entries(progressData).forEach(([key, value]: [string, any]) => {
            progressMap.set(key, {
              ...value,
              lastReviewed: new Date(value.lastReviewed),
              nextReview: new Date(value.nextReview)
            })
          })
          setVerbProgress(progressMap)
        }
      } catch (error) {
        console.error('Failed to load verbs:', error)
        setIsLoading(false)
      }
    }
    loadVerbs()
  }, [])

  // Filter and shuffle verbs
  useEffect(() => {
    if (!verbsData) return

    let filtered = verbsData.verbs

    // Filter by group
    if (selectedGroup !== "all") {
      filtered = filtered.filter(v => v.verbGroup === selectedGroup)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(v =>
        v.kanji.includes(query) ||
        v.kana.includes(query) ||
        v.romaji.toLowerCase().includes(query) ||
        v.meaning.some(m => m.toLowerCase().includes(query)) ||
        v.primaryMeaning.toLowerCase().includes(query)
      )
    }

    // Filter by progress (show only unknown/need practice)
    if (showOnlyUnknown && testMode) {
      filtered = filtered.filter(v => {
        const progress = verbProgress.get(v.id)
        // Show if: not reviewed yet OR level < 3 (needs practice)
        return !progress || progress.level < 3
      })
    }

    // Shuffle if enabled
    if (shuffleMode) {
      filtered = [...filtered].sort(() => Math.random() - 0.5)
    }

    setFilteredVerbs(filtered)
    setCurrentTestIndex(0)
    setShowAnswer(false)
  }, [searchQuery, selectedGroup, verbsData, shuffleMode, showOnlyUnknown, testMode, verbProgress])

  // Matching exercise functions - defined here before useEffect
  const getBatchVerbs = () => {
    const batchSize = 10
    const start = currentBatch * batchSize
    const end = start + batchSize
    return filteredVerbs.slice(start, end)
  }

  // Shuffle right side when batch changes or matching mode is enabled
  useEffect(() => {
    if (matchingMode && filteredVerbs.length > 0) {
      const batchVerbs = getBatchVerbs()
      setShuffledRightVerbs([...batchVerbs].sort(() => Math.random() - 0.5))
    }
  }, [currentBatch, matchingMode, filteredVerbs])

  const verbGroups = [
    { id: "all", label: "All Verbs", count: verbsData?.metadata.totalEntries || 0, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { id: "godan", label: "Godan (う-verbs)", count: verbsData?.metadata.groups.godan || 0, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
    { id: "ichidan", label: "Ichidan (る-verbs)", count: verbsData?.metadata.groups.ichidan || 0, color: "bg-gradient-to-r from-green-500 to-teal-500" },
    { id: "irregular", label: "Irregular", count: verbsData?.metadata.groups.irregular || 0, color: "bg-gradient-to-r from-orange-500 to-red-500" }
  ]

  const toggleCardFlip = (verbId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(verbId)) {
        newSet.delete(verbId)
      } else {
        newSet.add(verbId)
      }
      return newSet
    })
  }

  // Reset flipped cards when view mode or flip settings change
  useEffect(() => {
    setFlippedCards(new Set())
    setExpandedMeanings(new Set())
    setExpandedExamples(new Set())
  }, [viewMode, flipMode, frontSide, backSide])

  const toggleMeaningExpansion = (verbId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedMeanings(prev => {
      const newSet = new Set(prev)
      if (newSet.has(verbId)) {
        newSet.delete(verbId)
      } else {
        newSet.add(verbId)
      }
      return newSet
    })
  }

  const toggleExamplesPopup = (verb: N5Verb, e: React.MouseEvent, currentSide?: FlipSide) => {
    e.stopPropagation()

    // If clicking the same verb, close the popup
    if (examplesPopup?.verbId === verb.id) {
      setExamplesPopup(null)
      return
    }

    // Determine if we should show kana based on current side AND the other side
    const isFlipped = flippedCards.has(verb.id)
    const displaySide = currentSide || (isFlipped ? backSide : frontSide)
    const otherSide = isFlipped ? frontSide : backSide

    // Show kana if current side, other side, or view mode is kana-related
    // This ensures that when practicing English -> Kana, BOTH sides show kana examples
    const showKana = displaySide === 'masu-kana' || displaySide === 'kana' ||
                     otherSide === 'masu-kana' || otherSide === 'kana' ||
                     viewMode === 'kana-masu' || viewMode === 'dictionary-kana' ||
                     displaySide === 'te-kana' || otherSide === 'te-kana' ||
                     viewMode === 'te-form-kana'

    // Determine if we should show te-form examples
    const showTeFormExamples = displaySide === 'te-kanji' || displaySide === 'te-kana' ||
                                otherSide === 'te-kanji' || otherSide === 'te-kana' ||
                                viewMode === 'te-form' || viewMode === 'te-form-kana'

    // Get button position for popup placement
    const button = e.currentTarget as HTMLElement
    const rect = button.getBoundingClientRect()

    // Calculate popup dimensions (approximate)
    const popupWidth = 350
    const popupHeight = 400

    // Calculate position - try to show to the right, but if not enough space, show to the left
    let x = rect.right + 10
    let y = rect.top

    // Check if popup would go off screen to the right
    if (x + popupWidth > window.innerWidth) {
      // Show to the left of the button instead
      x = rect.left - popupWidth - 10
    }

    // Check if popup would go off screen at the bottom
    if (y + popupHeight > window.innerHeight) {
      // Adjust to show from bottom
      y = Math.max(10, window.innerHeight - popupHeight - 10)
    }

    // Make sure it's not off screen at the top
    if (y < 10) {
      y = 10
    }

    setExamplesPopup({
      verbId: verb.id,
      verb: verb,
      position: { x, y },
      showKana,
      showTeFormExamples
    })
  }

  const toggleExamplesExpansion = (verbId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedExamples(prev => {
      const newSet = new Set(prev)
      if (newSet.has(verbId)) {
        newSet.delete(verbId)
      } else {
        newSet.add(verbId)
      }
      return newSet
    })
  }

  const markVerbKnown = (verbId: string, known: boolean) => {
    const now = new Date()
    const current = verbProgress.get(verbId) || {
      verbId,
      knownCount: 0,
      unknownCount: 0,
      lastReviewed: now,
      nextReview: now,
      level: 0
    }

    let newLevel = current.level
    let nextReviewDate = new Date(now)

    if (known) {
      newLevel = Math.min(5, current.level + 1)
      // Spaced repetition intervals (in days): 1, 3, 7, 14, 30, 60
      const intervals = [1, 3, 7, 14, 30, 60]
      nextReviewDate.setDate(now.getDate() + intervals[newLevel])
    } else {
      newLevel = Math.max(0, current.level - 1)
      nextReviewDate.setHours(now.getHours() + 1) // Review again in 1 hour
    }

    const updated: VerbProgress = {
      verbId,
      knownCount: current.knownCount + (known ? 1 : 0),
      unknownCount: current.unknownCount + (known ? 0 : 1),
      lastReviewed: now,
      nextReview: nextReviewDate,
      level: newLevel
    }

    const newProgress = new Map(verbProgress)
    newProgress.set(verbId, updated)
    setVerbProgress(newProgress)

    // Save to localStorage
    const progressObj: any = {}
    newProgress.forEach((value, key) => {
      progressObj[key] = value
    })
    localStorage.setItem('verbProgress', JSON.stringify(progressObj))

    // Auto-flip the card back after marking
    setTimeout(() => {
      setFlippedCards(prev => {
        const newSet = new Set(prev)
        newSet.delete(verbId)
        return newSet
      })
    }, 500)
  }

  const skipVerb = () => {
    if (testMode && currentTestIndex < filteredVerbs.length - 1) {
      setShowAnswer(false)
      setCurrentTestIndex(currentTestIndex + 1)
    }
  }

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setVerbProgress(new Map())
      localStorage.removeItem('verbProgress')
    }
  }

  const handleLeftClick = (verbId: string) => {
    if (correctMatches.has(verbId)) return // Already matched correctly

    if (selectedLeft === verbId) {
      setSelectedLeft(null) // Deselect
    } else {
      setSelectedLeft(verbId)
      // If right side is selected, try to match
      if (selectedRight) {
        checkMatch(verbId, selectedRight)
      }
    }
  }

  const handleRightClick = (verbId: string) => {
    if (correctMatches.has(verbId)) return // Already matched correctly

    if (selectedRight === verbId) {
      setSelectedRight(null) // Deselect
    } else {
      setSelectedRight(verbId)
      // If left side is selected, try to match
      if (selectedLeft) {
        checkMatch(selectedLeft, verbId)
      }
    }
  }

  const checkMatch = (leftId: string, rightId: string) => {
    setTotalAttempts(prev => prev + 1)

    if (leftId === rightId) {
      // Correct match!
      const newCorrectMatches = new Set([...correctMatches, leftId])
      setCorrectMatches(newCorrectMatches)
      setMatches(prev => new Map([...prev, [leftId, rightId]]))
      setSelectedLeft(null)
      setSelectedRight(null)
      setWrongAttempts(prev => {
        const newSet = new Set(prev)
        newSet.delete(leftId)
        return newSet
      })

      // Check if batch is complete
      if (newCorrectMatches.size === getBatchVerbs().length) {
        if (matchingTestMode) {
          // Calculate score (penalize for wrong attempts)
          const batchSize = getBatchVerbs().length
          const wrongCount = totalAttempts + 1 - newCorrectMatches.size
          const score = Math.max(0, Math.round((batchSize / (totalAttempts + 1)) * 100))

          setBatchScores(prev => [...prev, score])
          setShowBatchResult(true)

          // Auto-advance after 2 seconds if not the last batch
          const maxBatch = Math.ceil(filteredVerbs.length / 10) - 1
          if (currentBatch < maxBatch) {
            setTimeout(() => {
              nextBatch()
              setShowBatchResult(false)
            }, 2000)
          }
        }
      }
    } else {
      // Wrong match
      setWrongAttempts(prev => new Set([...prev, leftId]))
      setTimeout(() => {
        setSelectedLeft(null)
        setSelectedRight(null)
      }, 500)
    }
  }

  const nextBatch = () => {
    const batchSize = 10
    const maxBatch = Math.ceil(filteredVerbs.length / batchSize) - 1
    if (currentBatch < maxBatch) {
      setCurrentBatch(currentBatch + 1)
      resetMatchingState()
    }
  }

  const previousBatch = () => {
    if (currentBatch > 0) {
      setCurrentBatch(currentBatch - 1)
      resetMatchingState()
    }
  }

  const resetMatchingState = () => {
    setSelectedLeft(null)
    setSelectedRight(null)
    setMatches(new Map())
    setCorrectMatches(new Set())
    setWrongAttempts(new Set())
    setTotalAttempts(0)
  }

  const resetAllMatchingProgress = () => {
    setCurrentBatch(0)
    setBatchScores([])
    setShowBatchResult(false)
    resetMatchingState()
  }

  const calculateFinalScore = () => {
    if (batchScores.length === 0) return 0
    const average = batchScores.reduce((a, b) => a + b, 0) / batchScores.length
    return Math.round(average)
  }

  const isMatchingComplete = () => {
    return correctMatches.size === getBatchVerbs().length
  }

  const renderCardContent = (verb: N5Verb, side: FlipSide, showExpandButton: boolean = false) => {
    const isExpanded = expandedMeanings.has(verb.id)

    switch (side) {
      case "english":
        return (
          <div className="relative w-full h-full flex items-center justify-center px-2 py-4">
            <div className="space-y-1 flex-1 w-full overflow-hidden">
              <div className="text-base font-bold text-primary break-words leading-tight">
                {verb.primaryMeaning}
              </div>
              {isExpanded && verb.meaning.length > 1 && (
                <div className="text-xs text-muted-foreground break-words leading-tight">
                  {verb.meaning.slice(1).join(', ')}
                </div>
              )}
            </div>
            {showExpandButton && verb.meaning.length > 2 && (
              <button
                onClick={(e) => toggleMeaningExpansion(verb.id, e)}
                className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-accent transition-colors"
                title={isExpanded ? "Show less" : "Show all meanings"}
              >
                {isExpanded ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
          </div>
        )
      case "kanji":
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl font-bold text-primary">
              {verb.kanji}
            </div>
            {verb.context && (
              <Badge variant="secondary" className="text-xs">
                {verb.context}
              </Badge>
            )}
          </div>
        )
      case "kana":
        return (
          <div className="text-4xl font-bold text-primary">
            {verb.kana}
          </div>
        )
      case "masu-kanji":
        return (
          <div className="text-4xl font-bold text-primary">
            {verb.conjugations.masu}
          </div>
        )
      case "masu-kana":
        return (
          <div className="text-4xl font-bold text-primary">
            {verb.conjugations.masuKana}
          </div>
        )
      case "te-kanji":
        return (
          <div className="text-4xl font-bold text-primary">
            {verb.conjugations.te}
          </div>
        )
      case "te-kana":
        return (
          <div className="text-4xl font-bold text-primary">
            {verb.conjugations.teKana}
          </div>
        )
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center px-2 py-4">
            <div className="space-y-1 flex-1 w-full overflow-hidden">
              <div className="text-base font-bold text-primary break-words leading-tight">
                {verb.primaryMeaning}
              </div>
              {isExpanded && verb.meaning.length > 1 && (
                <div className="text-xs text-muted-foreground break-words leading-tight">
                  {verb.meaning.slice(1).join(', ')}
                </div>
              )}
            </div>
            {showExpandButton && verb.meaning.length > 2 && (
              <button
                onClick={(e) => toggleMeaningExpansion(verb.id, e)}
                className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-accent transition-colors"
                title={isExpanded ? "Show less" : "Show all meanings"}
              >
                {isExpanded ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
          </div>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading N5 verbs...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <Badge variant="gradient" className="px-4 py-1.5">
            <Sparkles className="h-3 w-3 mr-2" />
            N5 Verb Collection
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold">
            Master <span className="gradient-text">{verbsData?.metadata.totalEntries} N5 Verbs</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete collection of JLPT N5 verbs with conjugations, meanings, and practice modes
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button
              variant="default"
              size="lg"
              onClick={() => window.location.href = '/verbs/conjugation-rules'}
              className="gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Quick Reference: All Rules
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.href = '/verbs/dictionary-form-learning'}
              className="gap-2"
            >
              <GraduationCap className="h-5 w-5" />
              Learn Dictionary Form
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.href = '/verbs/te-form-learning'}
              className="gap-2"
            >
              <GraduationCap className="h-5 w-5" />
              Learn Te Form
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {verbGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:scale-105 ${selectedGroup === group.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedGroup(group.id)}
              >
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-full ${group.color} flex items-center justify-center mb-2 mx-auto`}>
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-center">{group.count}</p>
                  <p className="text-sm text-muted-foreground text-center">{group.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search, Filters, and View Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Display Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4">
              {/* Mode Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Flip Mode Toggle */}
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="flip-mode"
                      checked={flipMode}
                      onCheckedChange={setFlipMode}
                    />
                    <Label htmlFor="flip-mode" className="font-semibold">
                      <RefreshCw className="h-4 w-4 inline mr-2" />
                      Flip Card Mode
                    </Label>
                  </div>
                </div>

                {/* Shuffle, Test Mode & Matching Mode */}
                <div className="flex flex-col gap-3 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="shuffle-mode"
                        checked={shuffleMode}
                        onCheckedChange={setShuffleMode}
                      />
                      <Label htmlFor="shuffle-mode" className="font-semibold">
                        <Shuffle className="h-4 w-4 inline mr-2" />
                        Shuffle
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="test-mode"
                        checked={testMode}
                        onCheckedChange={(checked) => {
                          setTestMode(checked)
                          if (checked) {
                            setFlipMode(true) // Auto-enable flip mode for tests
                            setMatchingMode(false) // Disable matching mode
                            setCurrentTestIndex(0)
                            setShowAnswer(false)
                          }
                        }}
                      />
                      <Label htmlFor="test-mode" className="font-semibold">
                        <GraduationCap className="h-4 w-4 inline mr-2" />
                        Test Mode
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="matching-mode"
                        checked={matchingMode}
                        onCheckedChange={(checked) => {
                          setMatchingMode(checked)
                          if (checked) {
                            setTestMode(false) // Disable test mode
                            setFlipMode(false) // Disable flip mode
                            setCurrentBatch(0)
                            resetMatchingState()
                          }
                        }}
                      />
                      <Label htmlFor="matching-mode" className="font-semibold">
                        <Target className="h-4 w-4 inline mr-2" />
                        Matching Exercise
                      </Label>
                    </div>
                  </div>

                  {/* Show only unknown toggle - only visible in test mode */}
                  {testMode && (
                    <div className="flex items-center space-x-2 pl-2 border-l-2 border-primary/30">
                      <Switch
                        id="show-unknown"
                        checked={showOnlyUnknown}
                        onCheckedChange={setShowOnlyUnknown}
                      />
                      <Label htmlFor="show-unknown" className="text-sm">
                        <Target className="h-4 w-4 inline mr-2" />
                        Focus on Need Practice (Level &lt; 3)
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              {/* Flip Side Selection - Only when flip mode is ON and NOT in test mode */}
              {flipMode && !testMode && !matchingMode && (
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm whitespace-nowrap">Front:</Label>
                      <select
                        value={frontSide}
                        onChange={(e) => setFrontSide(e.target.value as FlipSide)}
                        className="px-3 py-1.5 border rounded-md bg-background"
                      >
                        <option value="english">English</option>
                        <option value="kanji">Dictionary (Kanji)</option>
                        <option value="kana">Dictionary (Kana)</option>
                        <option value="masu-kanji">Masu (Kanji)</option>
                        <option value="masu-kana">Masu (Kana)</option>
                        <option value="te-kanji">Te-form (Kanji)</option>
                        <option value="te-kana">Te-form (Kana)</option>
                      </select>
                    </div>

                    <div className="text-muted-foreground">→</div>

                    <div className="flex items-center gap-2">
                      <Label className="text-sm whitespace-nowrap">Back:</Label>
                      <select
                        value={backSide}
                        onChange={(e) => setBackSide(e.target.value as FlipSide)}
                        className="px-3 py-1.5 border rounded-md bg-background"
                      >
                        <option value="english">English</option>
                        <option value="kanji">Dictionary (Kanji)</option>
                        <option value="kana">Dictionary (Kana)</option>
                        <option value="masu-kanji">Masu (Kanji)</option>
                        <option value="masu-kana">Masu (Kana)</option>
                        <option value="te-kanji">Te-form (Kanji)</option>
                        <option value="te-kana">Te-form (Kana)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Matching Mode Form Selection */}
              {matchingMode && (
                <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <Label className="font-semibold">Matching Exercise Settings</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="matching-test-mode"
                        checked={matchingTestMode}
                        onCheckedChange={(checked) => {
                          setMatchingTestMode(checked)
                          if (checked) {
                            resetAllMatchingProgress()
                          }
                        }}
                      />
                      <Label htmlFor="matching-test-mode" className="text-sm font-semibold">
                        <BarChart3 className="h-4 w-4 inline mr-1" />
                        Test Mode (Auto-advance)
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-1 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm whitespace-nowrap">Left Side:</Label>
                      <select
                        value={matchingLeftForm}
                        onChange={(e) => {
                          setMatchingLeftForm(e.target.value as FlipSide)
                          resetAllMatchingProgress()
                        }}
                        className="px-3 py-1.5 border rounded-md bg-background"
                      >
                        <option value="english">English</option>
                        <option value="kanji">Dictionary (Kanji)</option>
                        <option value="kana">Dictionary (Kana)</option>
                        <option value="masu-kanji">Masu (Kanji)</option>
                        <option value="masu-kana">Masu (Kana)</option>
                        <option value="te-kanji">Te-form (Kanji)</option>
                        <option value="te-kana">Te-form (Kana)</option>
                      </select>
                    </div>

                    <div className="text-muted-foreground">⟷</div>

                    <div className="flex items-center gap-2">
                      <Label className="text-sm whitespace-nowrap">Right Side:</Label>
                      <select
                        value={matchingRightForm}
                        onChange={(e) => {
                          setMatchingRightForm(e.target.value as FlipSide)
                          resetAllMatchingProgress()
                        }}
                        className="px-3 py-1.5 border rounded-md bg-background"
                      >
                        <option value="english">English</option>
                        <option value="kanji">Dictionary (Kanji)</option>
                        <option value="kana">Dictionary (Kana)</option>
                        <option value="masu-kanji">Masu (Kanji)</option>
                        <option value="masu-kana">Masu (Kana)</option>
                        <option value="te-kanji">Te-form (Kanji)</option>
                        <option value="te-kana">Te-form (Kana)</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {matchingTestMode
                      ? "Test mode: Complete each batch to auto-advance. Final score shown at the end."
                      : "Practice mode: Match verbs at your own pace. Use Next/Previous buttons to navigate."}
                  </div>
                </div>
              )}

              {/* View Mode Buttons - Only show when flip mode is OFF */}
              {!flipMode && (
                <div>
                  <label className="text-sm font-medium mb-3 block">View Mode</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={viewMode === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("all")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      All Info
                    </Button>
                    <Button
                      variant={viewMode === "dictionary" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("dictionary")}
                    >
                      Dictionary Form
                    </Button>
                    <Button
                      variant={viewMode === "masu" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("masu")}
                    >
                      Masu (Kanji)
                    </Button>
                    <Button
                      variant={viewMode === "kana-masu" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("kana-masu")}
                    >
                      Masu (Kana)
                    </Button>
                    <Button
                      variant={viewMode === "dictionary-kana" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("dictionary-kana")}
                    >
                      Dictionary (Kana)
                    </Button>
                    <Button
                      variant={viewMode === "te-form" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("te-form")}
                    >
                      Te-form (Kanji)
                    </Button>
                    <Button
                      variant={viewMode === "te-form-kana" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("te-form-kana")}
                    >
                      Te-form (Kana)
                    </Button>
                  </div>
                </div>
              )}

              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Search by kanji, kana, romaji, or meaning..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {filteredVerbs.length} of {verbsData?.metadata.totalEntries} verbs</span>
              <Button variant="ghost" size="sm" onClick={() => {
                setSearchQuery("")
                setSelectedGroup("all")
                setViewMode("all")
                setFlipMode(false)
                setFrontSide("english")
                setBackSide("kanji")
              }}>
                Reset all
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Verbs Display - Changes based on view mode */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Matching Mode */}
            {matchingMode && (
              <div className="space-y-4">
                {/* Final Results Screen */}
                {matchingTestMode && currentBatch >= Math.ceil(filteredVerbs.length / 10) - 1 && isMatchingComplete() && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                  >
                    <Card className="max-w-2xl w-full">
                      <CardHeader>
                        <div className="text-center space-y-2">
                          <div className="text-6xl">🎉</div>
                          <CardTitle className="text-3xl">Test Complete!</CardTitle>
                          <CardDescription>You've completed all {Math.ceil(filteredVerbs.length / 10)} batches</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Overall Score */}
                        <div className="text-center p-6 bg-muted/50 rounded-lg">
                          <div className="text-5xl font-bold gradient-text mb-2">
                            {calculateFinalScore()}%
                          </div>
                          <div className="text-sm text-muted-foreground">Overall Score</div>
                        </div>

                        {/* Batch Scores */}
                        <div>
                          <h3 className="text-sm font-semibold mb-3">Batch Scores:</h3>
                          <div className="grid grid-cols-5 gap-2">
                            {batchScores.map((score, idx) => (
                              <div key={idx} className="text-center p-2 bg-muted/30 rounded">
                                <div className="text-xs text-muted-foreground mb-1">Batch {idx + 1}</div>
                                <div className={cn(
                                  "font-bold text-sm",
                                  score >= 90 ? "text-green-600" : score >= 70 ? "text-yellow-600" : "text-red-600"
                                )}>
                                  {score}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button
                            onClick={resetAllMatchingProgress}
                            className="flex-1"
                            size="lg"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                          </Button>
                          <Button
                            onClick={() => {
                              setMatchingMode(false)
                              setMatchingTestMode(false)
                              resetAllMatchingProgress()
                            }}
                            variant="outline"
                            className="flex-1"
                            size="lg"
                          >
                            Exit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Progress Summary */}
                <Card className="bg-muted/30">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="text-sm font-semibold">
                          Batch {currentBatch + 1} of {Math.ceil(filteredVerbs.length / 10)}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">
                            Matched: {correctMatches.size} / {getBatchVerbs().length}
                          </span>
                        </div>
                        {matchingTestMode && totalAttempts > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Attempts: {totalAttempts}
                          </div>
                        )}
                        {isMatchingComplete() && !matchingTestMode && (
                          <Badge variant="default" className="animate-pulse">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complete!
                          </Badge>
                        )}
                        {showBatchResult && matchingTestMode && (
                          <Badge variant="default" className="animate-pulse">
                            Score: {batchScores[batchScores.length - 1]}%
                          </Badge>
                        )}
                      </div>
                      {!matchingTestMode && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={previousBatch}
                            disabled={currentBatch === 0}
                          >
                            <ChevronRight className="h-3 w-3 rotate-180 mr-1" />
                            Prev
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={resetMatchingState}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Reset
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={nextBatch}
                            disabled={currentBatch >= Math.ceil(filteredVerbs.length / 10) - 1}
                          >
                            Next
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Matching Grid */}
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Left Column */}
                    <div className="space-y-2">
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-md"></div>
                      <div className="relative text-xs font-bold text-center py-2 px-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-md shadow-md">
                        <div className="flex items-center justify-center gap-1.5">
                          <List className="h-3.5 w-3.5" />
                          <span>
                            {matchingLeftForm === 'english' ? 'English' :
                             matchingLeftForm === 'kanji' ? 'Dictionary (Kanji)' :
                             matchingLeftForm === 'kana' ? 'Dictionary (Kana)' :
                             matchingLeftForm === 'masu-kanji' ? 'Masu (Kanji)' :
                             matchingLeftForm === 'masu-kana' ? 'Masu (Kana)' :
                             matchingLeftForm === 'te-kanji' ? 'Te-form (Kanji)' :
                             'Te-form (Kana)'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {getBatchVerbs().map((verb, index) => (
                      <motion.div
                        key={verb.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Card
                          onClick={() => handleLeftClick(verb.id)}
                          className={cn(
                            "cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border-2",
                            selectedLeft === verb.id && "ring-4 ring-blue-400/50 shadow-xl scale-[1.03] border-blue-500 bg-blue-50 dark:bg-blue-950/30",
                            correctMatches.has(verb.id) && "ring-4 ring-green-400/50 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
                            wrongAttempts.has(verb.id) && !correctMatches.has(verb.id) && "ring-4 ring-red-400/50 border-red-500 animate-shake bg-red-50 dark:bg-red-950/20",
                            !selectedLeft && !correctMatches.has(verb.id) && !wrongAttempts.has(verb.id) && "border-border hover:border-blue-300"
                          )}
                        >
                          <CardContent className="p-2.5 px-3 min-h-[48px] flex items-center">
                            <div className="flex items-center gap-2.5 w-full">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs h-5 w-6 flex items-center justify-center p-0 font-bold border-2",
                                  selectedLeft === verb.id && "bg-blue-500 text-white border-blue-600",
                                  correctMatches.has(verb.id) && "bg-green-500 text-white border-green-600",
                                  wrongAttempts.has(verb.id) && !correctMatches.has(verb.id) && "bg-red-500 text-white border-red-600"
                                )}
                              >
                                {index + 1}
                              </Badge>
                              <div className="flex-1 text-sm font-semibold">
                                {matchingLeftForm === 'english' ? (
                                  <span className="text-sm">{verb.primaryMeaning}</span>
                                ) : matchingLeftForm === 'kanji' || matchingLeftForm === 'kana' ? (
                                  <span className="text-xl font-bold">{matchingLeftForm === 'kanji' ? verb.kanji : verb.kana}</span>
                                ) : matchingLeftForm === 'masu-kanji' || matchingLeftForm === 'masu-kana' ? (
                                  <span className="text-xl font-bold">{matchingLeftForm === 'masu-kanji' ? verb.conjugations.masu : verb.conjugations.masuKana}</span>
                                ) : (
                                  <span className="text-xl font-bold">{matchingLeftForm === 'te-kanji' ? verb.conjugations.te : verb.conjugations.teKana}</span>
                                )}
                              </div>
                              {correctMatches.has(verb.id) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                >
                                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                                </motion.div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Right Column - Shuffled */}
                  <div className="space-y-2">
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-md"></div>
                      <div className="relative text-xs font-bold text-center py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md shadow-md">
                        <div className="flex items-center justify-center gap-1.5">
                          <Shuffle className="h-3.5 w-3.5" />
                          <span>
                            {matchingRightForm === 'english' ? 'English' :
                             matchingRightForm === 'kanji' ? 'Dictionary (Kanji)' :
                             matchingRightForm === 'kana' ? 'Dictionary (Kana)' :
                             matchingRightForm === 'masu-kanji' ? 'Masu (Kanji)' :
                             matchingRightForm === 'masu-kana' ? 'Masu (Kana)' :
                             matchingRightForm === 'te-kanji' ? 'Te-form (Kanji)' :
                             'Te-form (Kana)'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {shuffledRightVerbs.map((verb, index) => (
                      <motion.div
                        key={verb.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Card
                          onClick={() => handleRightClick(verb.id)}
                          className={cn(
                            "cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border-2",
                            selectedRight === verb.id && "ring-4 ring-purple-400/50 shadow-xl scale-[1.03] border-purple-500 bg-purple-50 dark:bg-purple-950/30",
                            correctMatches.has(verb.id) && "ring-4 ring-green-400/50 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
                            !selectedRight && !correctMatches.has(verb.id) && "border-border hover:border-purple-300"
                          )}
                        >
                          <CardContent className="p-2.5 px-3 min-h-[48px] flex items-center justify-center">
                            <div className="flex items-center gap-2.5 w-full justify-center">
                              <div className="flex-1 text-center text-sm font-semibold">
                                {matchingRightForm === 'english' ? (
                                  <span className="text-sm">{verb.primaryMeaning}</span>
                                ) : matchingRightForm === 'kanji' || matchingRightForm === 'kana' ? (
                                  <span className="text-xl font-bold">{matchingRightForm === 'kanji' ? verb.kanji : verb.kana}</span>
                                ) : matchingRightForm === 'masu-kanji' || matchingRightForm === 'masu-kana' ? (
                                  <span className="text-xl font-bold">{matchingRightForm === 'masu-kanji' ? verb.conjugations.masu : verb.conjugations.masuKana}</span>
                                ) : (
                                  <span className="text-xl font-bold">{matchingRightForm === 'te-kanji' ? verb.conjugations.te : verb.conjugations.teKana}</span>
                                )}
                              </div>
                              {correctMatches.has(verb.id) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                >
                                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                                </motion.div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  </div>
                </div>
              </div>
            )}

            {/* Test Mode - Grid with Know/Don't Know on each card */}
            {!matchingMode && flipMode && testMode && (
              <div className="space-y-4">
                {/* Progress Summary */}
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">
                            Known: {Array.from(verbProgress.values()).filter(v => v.level >= 3).length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-sm">
                            Need Practice: {Array.from(verbProgress.values()).filter(v => v.level < 3).length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                          <span className="text-sm">
                            Not Reviewed: {filteredVerbs.length - verbProgress.size}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFlippedCards(new Set())}
                          disabled={flippedCards.size === 0}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Flip All Back
                        </Button>
                        <Button variant="outline" size="sm" onClick={resetProgress}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset Progress
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Grid of Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {filteredVerbs.map((verb, index) => {
                    const isFlipped = flippedCards.has(verb.id)
                    const progress = verbProgress.get(verb.id)
                    const hasProgress = !!progress

                    return (
                      <motion.div
                        key={verb.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          height: (frontSide === 'english' && expandedMeanings.has(verb.id)) ||
                                  (isFlipped && backSide === 'english' && expandedMeanings.has(verb.id))
                                  ? "auto" : "180px"
                        }}
                        transition={{ delay: Math.min(index * 0.02, 0.5) }}
                        style={{ perspective: "1000px" }}
                      >
                        <div className="relative w-full h-full">
                          <div
                            onClick={() => toggleCardFlip(verb.id)}
                            className="relative cursor-pointer w-full h-full"
                            style={{
                              transformStyle: "preserve-3d",
                              transition: "transform 0.6s",
                              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                            }}
                          >
                            {/* Front Side */}
                            <Card
                              className={cn(
                                "hover:shadow-lg transition-shadow relative w-full",
                                hasProgress && progress.level >= 3 && "ring-2 ring-green-500",
                                hasProgress && progress.level < 3 && "ring-2 ring-red-500"
                              )}
                              style={{
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                minHeight: "180px"
                              }}
                            >
                              {/* Button Group in Top Right */}
                              <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                                {/* Examples Toggle */}
                                {verb.examples && verb.examples.length > 0 && (
                                  <button
                                    onClick={(e) => toggleExamplesPopup(verb, e)}
                                    className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                    title={examplesPopup?.verbId === verb.id ? "Hide examples" : "Show examples"}
                                  >
                                    {examplesPopup?.verbId === verb.id ? (
                                      <BookText className="h-4 w-4 text-primary" />
                                    ) : (
                                      <BookText className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </button>
                                )}
                                {/* Meanings Toggle */}
                                {frontSide === 'english' && verb.meaning.length > 2 && (
                                  <button
                                    onClick={(e) => toggleMeaningExpansion(verb.id, e)}
                                    className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                    title={expandedMeanings.has(verb.id) ? "Show less meanings" : "Show all meanings"}
                                  >
                                    {expandedMeanings.has(verb.id) ? (
                                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </button>
                                )}
                              </div>
                              <CardContent className="p-6 text-center min-h-[180px] flex items-center justify-center">
                                {renderCardContent(verb, frontSide, false)}
                              </CardContent>
                            </Card>

                            {/* Back Side with Action Buttons */}
                            <Card
                              className="absolute top-0 left-0 w-full hover:shadow-lg transition-shadow"
                              style={{
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                                minHeight: "180px"
                              }}
                            >
                              {/* Button Group in Top Right (Back) */}
                              <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                                {/* Examples Toggle */}
                                {verb.examples && verb.examples.length > 0 && (
                                  <button
                                    onClick={(e) => toggleExamplesPopup(verb, e)}
                                    className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                    title={examplesPopup?.verbId === verb.id ? "Hide examples" : "Show examples"}
                                  >
                                    {examplesPopup?.verbId === verb.id ? (
                                      <BookText className="h-4 w-4 text-primary" />
                                    ) : (
                                      <BookText className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </button>
                                )}
                                {/* Meanings Toggle */}
                                {backSide === 'english' && verb.meaning.length > 2 && (
                                  <button
                                    onClick={(e) => toggleMeaningExpansion(verb.id, e)}
                                    className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                    title={expandedMeanings.has(verb.id) ? "Show less meanings" : "Show all meanings"}
                                  >
                                    {expandedMeanings.has(verb.id) ? (
                                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </button>
                                )}
                              </div>
                              <CardContent className="p-4 text-center min-h-[180px] flex flex-col items-center justify-between bg-secondary/20">
                                <div className="flex-1 flex items-center justify-center w-full">
                                  {renderCardContent(verb, backSide, false)}
                                </div>

                                {/* Action Buttons on Back */}
                                {isFlipped && (
                                  <div className="flex gap-2 mt-3 w-full" onClick={(e) => e.stopPropagation()}>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => markVerbKnown(verb.id, false)}
                                      className="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs"
                                    >
                                      <ThumbsDown className="h-3 w-3 mr-1" />
                                      Don't Know
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => markVerbKnown(verb.id, true)}
                                      className="flex-1 bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-950/50 border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 text-xs"
                                    >
                                      <ThumbsUp className="h-3 w-3 mr-1" />
                                      Know
                                    </Button>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>

                          {/* Progress Indicator Badge */}
                          {hasProgress && (
                            <div className="absolute -top-2 -right-2 z-10">
                              <Badge
                                variant={progress.level >= 3 ? "default" : "destructive"}
                                className="text-xs px-2"
                              >
                                L{progress.level}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Normal Flip Card Views - Grid of all cards */}
            {!matchingMode && flipMode && !testMode && (
              <div className="space-y-4">
                {/* Flip All Back Button for normal mode */}
                {flippedCards.size > 0 && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFlippedCards(new Set())}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Flip All Back ({flippedCards.size} cards)
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {filteredVerbs.map((verb, index) => {
                  const isFlipped = flippedCards.has(verb.id)
                  return (
                    <motion.div
                      key={verb.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        height: (frontSide === 'english' && expandedMeanings.has(verb.id)) ||
                                (isFlipped && backSide === 'english' && expandedMeanings.has(verb.id))
                                ? "auto" : "180px"
                      }}
                      transition={{ delay: Math.min(index * 0.02, 0.5) }}
                      style={{ perspective: "1000px" }}
                    >
                      <div
                        onClick={() => toggleCardFlip(verb.id)}
                        className="relative cursor-pointer w-full h-full"
                        style={{
                          transformStyle: "preserve-3d",
                          transition: "transform 0.6s",
                          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}
                      >
                        {/* Front Side */}
                        <Card
                          className="hover:shadow-lg transition-shadow relative w-full"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            minHeight: "180px"
                          }}
                        >
                          {/* Button Group in Top Right */}
                          <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                            {/* Examples Toggle */}
                            {verb.examples && verb.examples.length > 0 && (
                              <button
                                onClick={(e) => toggleExamplesPopup(verb, e)}
                                className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                title={examplesPopup?.verbId === verb.id ? "Hide examples" : "Show examples"}
                              >
                                {examplesPopup?.verbId === verb.id ? (
                                  <BookText className="h-4 w-4 text-primary" />
                                ) : (
                                  <BookText className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            )}
                            {/* Meanings Toggle */}
                            {frontSide === 'english' && verb.meaning.length > 2 && (
                              <button
                                onClick={(e) => toggleMeaningExpansion(verb.id, e)}
                                className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                title={expandedMeanings.has(verb.id) ? "Show less meanings" : "Show all meanings"}
                              >
                                {expandedMeanings.has(verb.id) ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            )}
                          </div>
                          <CardContent className="p-6 text-center min-h-[180px] flex items-center justify-center">
                            {renderCardContent(verb, frontSide, false)}
                          </CardContent>
                        </Card>

                        {/* Back Side */}
                        <Card
                          className="absolute top-0 left-0 w-full hover:shadow-lg transition-shadow"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            minHeight: "180px"
                          }}
                        >
                          {/* Button Group in Top Right (Back) */}
                          <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                            {/* Examples Toggle */}
                            {verb.examples && verb.examples.length > 0 && (
                              <button
                                onClick={(e) => toggleExamplesPopup(verb, e)}
                                className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                title={examplesPopup?.verbId === verb.id ? "Hide examples" : "Show examples"}
                              >
                                {examplesPopup?.verbId === verb.id ? (
                                  <BookText className="h-4 w-4 text-primary" />
                                ) : (
                                  <BookText className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            )}
                            {/* Meanings Toggle */}
                            {backSide === 'english' && verb.meaning.length > 2 && (
                              <button
                                onClick={(e) => toggleMeaningExpansion(verb.id, e)}
                                className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                title={expandedMeanings.has(verb.id) ? "Show less meanings" : "Show all meanings"}
                              >
                                {expandedMeanings.has(verb.id) ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            )}
                          </div>
                          <CardContent className="p-6 text-center min-h-[180px] flex items-center justify-center bg-secondary/20">
                            {renderCardContent(verb, backSide, false)}
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  )
                })}
                </div>
              </div>
            )}

            {/* Simplified Views - Grid Layout */}
            {!matchingMode && !flipMode && viewMode !== "all" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredVerbs.map((verb, index) => (
                  <motion.div
                    key={verb.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(index * 0.02, 0.5) }}
                  >
                    <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                      <CardContent className="p-6 text-center space-y-3">
                        {/* Main Display */}
                        <div className="space-y-2">
                          {viewMode === "dictionary" && (
                            <>
                              <div className="text-3xl font-bold group-hover:text-primary transition-colors">
                                {verb.kanji}
                              </div>
                              <div className="text-sm text-muted-foreground">{verb.kana}</div>
                              {verb.context && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                  {verb.context}
                                </Badge>
                              )}
                            </>
                          )}
                          {viewMode === "masu" && (
                            <>
                              <div className="text-3xl font-bold group-hover:text-primary transition-colors">
                                {verb.conjugations.masu}
                              </div>
                              <div className="text-sm text-muted-foreground">{verb.conjugations.masuKana}</div>
                            </>
                          )}
                          {viewMode === "kana-masu" && (
                            <>
                              <div className="text-3xl font-bold group-hover:text-primary transition-colors">
                                {verb.conjugations.masuKana}
                              </div>
                              <div className="text-sm text-muted-foreground">{verb.conjugations.masu}</div>
                            </>
                          )}
                          {viewMode === "dictionary-kana" && (
                            <>
                              <div className="text-3xl font-bold group-hover:text-primary transition-colors">
                                {verb.kana}
                              </div>
                              <div className="text-sm text-muted-foreground">{verb.kanji}</div>
                            </>
                          )}
                          {viewMode === "te-form" && (
                            <>
                              <div className="text-3xl font-bold group-hover:text-primary transition-colors">
                                {verb.conjugations.te}
                              </div>
                              <div className="text-sm text-muted-foreground">{verb.conjugations.teKana}</div>
                            </>
                          )}
                          {viewMode === "te-form-kana" && (
                            <>
                              <div className="text-3xl font-bold group-hover:text-primary transition-colors">
                                {verb.conjugations.teKana}
                              </div>
                              <div className="text-sm text-muted-foreground">{verb.conjugations.te}</div>
                            </>
                          )}
                        </div>

                        {/* Meaning */}
                        <div className="pt-2 border-t">
                          <p className="text-sm font-medium">{verb.primaryMeaning}</p>
                        </div>

                        {/* Group Badge */}
                        <Badge variant={
                          verb.verbGroup === 'godan' ? 'default' :
                          verb.verbGroup === 'ichidan' ? 'secondary' : 'outline'
                        } className="text-xs">
                          {verb.verbGroup}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Full Information View */}
            {!matchingMode && !flipMode && viewMode === "all" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVerbs.map((verb, index) => (
                  <motion.div
                    key={verb.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(index * 0.05, 1) }}
                  >
                    <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-2xl font-bold">{verb.kanji}</CardTitle>
                              {verb.context && (
                                <Badge variant="secondary" className="text-xs">
                                  {verb.context}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg text-muted-foreground">{verb.kana}</span>
                              <Badge variant={
                                verb.verbGroup === 'godan' ? 'default' :
                                verb.verbGroup === 'ichidan' ? 'secondary' : 'outline'
                              } className="text-xs">
                                {verb.verbGroup}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Primary Meaning:</p>
                          <p className="font-medium">{verb.primaryMeaning}</p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Masu Form:</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold">{verb.conjugations.masu}</span>
                            <span className="text-sm text-muted-foreground">({verb.conjugations.masuKana})</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Te-form:</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold">{verb.conjugations.te}</span>
                            <span className="text-sm text-muted-foreground">({verb.conjugations.teKana})</span>
                          </div>
                        </div>

                        {verb.meaning.length > 1 && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              +{verb.meaning.length - 1} more meanings
                            </summary>
                            <ul className="mt-2 space-y-1 pl-4 list-disc text-muted-foreground">
                              {verb.meaning.slice(1, 4).map((m, i) => (
                                <li key={i}>{m}</li>
                              ))}
                            </ul>
                          </details>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                          {verb.verbType.transitive && (
                            <Badge variant="outline" className="text-xs">Transitive</Badge>
                          )}
                          {verb.verbType.intransitive && (
                            <Badge variant="outline" className="text-xs">Intransitive</Badge>
                          )}
                        </div>

                        {/* Examples Section */}
                        {verb.examples && verb.examples.length > 0 && (
                          <div className="pt-3 border-t mt-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <BookText className="h-4 w-4 text-primary" />
                                <p className="text-sm font-semibold text-primary">Basic Examples ({verb.examples.length})</p>
                              </div>
                              <button
                                onClick={(e) => toggleExamplesExpansion(verb.id, e)}
                                className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                title={expandedExamples.has(verb.id) ? "Hide examples" : "Show examples"}
                              >
                                {expandedExamples.has(verb.id) ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>

                            {expandedExamples.has(verb.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-3"
                              >
                                {verb.examples.map((example, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-1.5"
                                  >
                                    <div className="flex items-start gap-2">
                                      <Badge variant="outline" className="text-xs shrink-0 mt-0.5">
                                        {idx + 1}
                                      </Badge>
                                      <div className="space-y-1 flex-1">
                                        <p className="text-sm font-medium leading-relaxed">
                                          {example.japanese}
                                        </p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                          {example.english}
                                        </p>
                                        {example.highlight && (
                                          <Badge variant="secondary" className="text-xs mt-1">
                                            {example.highlight}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {!matchingMode && filteredVerbs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No verbs found matching your criteria</p>
            <Button
              onClick={() => { setSearchQuery(""); setSelectedGroup("all") }}
              className="mt-4"
              variant="outline"
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Examples Popup */}
        <AnimatePresence>
          {examplesPopup && ((examplesPopup.showTeFormExamples && examplesPopup.verb.teFormExamples) || examplesPopup.verb.examples) && (
            <>
              {/* Backdrop to close popup when clicking outside */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setExamplesPopup(null)}
              />

              {/* Popup Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="fixed z-50 w-[350px]"
                style={{
                  left: `${examplesPopup.position.x}px`,
                  top: `${examplesPopup.position.y}px`
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="shadow-2xl border-2 bg-background">
                  <CardHeader className="pb-2 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookText className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">
                          {examplesPopup.verb.kanji}
                          {examplesPopup.showTeFormExamples && (
                            <span className="text-xs text-muted-foreground ml-2">(Te-form)</span>
                          )}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExamplesPopup(null)}
                        className="h-6 w-6 p-0"
                      >
                        <EyeOff className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-[350px] overflow-y-auto pb-3">
                    {(examplesPopup.showTeFormExamples && examplesPopup.verb.teFormExamples
                      ? examplesPopup.verb.teFormExamples
                      : examplesPopup.verb.examples || []).map((example, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-md bg-muted/50 border space-y-1"
                      >
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs shrink-0 h-5">
                            {idx + 1}
                          </Badge>
                          <div className="space-y-0.5 flex-1">
                            <p className="text-sm font-medium">
                              {examplesPopup.showKana ? example.kana : example.japanese}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {example.english}
                            </p>
                            {example.highlight && (
                              <Badge variant="secondary" className="text-xs">
                                {example.highlight}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
