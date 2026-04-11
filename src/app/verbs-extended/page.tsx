"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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
  Shuffle, GraduationCap, ThumbsUp, ThumbsDown, SkipForward, RotateCcw, BookText, ListChecks, X, Star
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ALL_PREDEFINED_LISTS, type VerbList } from "@/data/verb-lists"
import { analyticsService } from "@/services/analytics.service"

interface VerbExample {
  jp: string
  kana: string
  en: string
  highlight: string
  grammarTag?: string
  pattern?: string
}

interface N5Verb {
  id: string
  jlpt: string
  pos: string
  lemma: { kanji: string; kana: string }
  morphology: { class: "godan" | "ichidan" | "irregular"; isIrregular: boolean }
  valency: { type: string; requiredParticles: string[] }
  meaning: { primary: string; gloss: string[] }
  forms: {
    dictionary: { kanji: string; kana: string }
    masu: { kanji: string; kana: string }
    te: { kanji: string; kana: string }
  }
  examples: {
    dictionary: VerbExample[]
    masu: VerbExample[]
    te: VerbExample[]
  }
  usagePatterns?: Array<{ jp: string; en: string }>
  audio?: { file: string; status: string }
  meta?: { license: string }
}

interface VerbsData {
  metadata: {
    version: string
    totalEntries: number
  }
  verbs: N5Verb[]
}

type ViewMode = "all" | "dictionary" | "masu" | "kana-masu" | "dictionary-kana" | "te-form" | "te-form-kana"
type FlipSide = "english" | "kanji" | "kana" | "masu-kanji" | "masu-kana" | "te-kanji" | "te-kana" | "kana-mixed" | "image"
type ConjugationFormType = "dict" | "masu" | "te"

/** Maps internal morphology.class key → user-facing group label */
const verbGroupLabel = (cls: string): string => {
  if (cls === 'godan')     return 'Group I'
  if (cls === 'ichidan')   return 'Group II'
  return 'Group III'
}

interface VerbProgress {
  verbId: string
  knownCount: number
  unknownCount: number
  lastReviewed: Date
  nextReview: Date
  level: number // 0-5: higher = better retention
}

export default function VerbsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

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

  // List filtering
  const [activeList, setActiveList] = useState<VerbList | null>(null)
  const [customLists, setCustomLists] = useState<VerbList[]>([])

  // Favorites
  const [favoriteVerbs, setFavoriteVerbs] = useState<Set<string>>(new Set())
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

  // English Quiz Mode - stores random form type for each verb
  const [quizMode, setQuizMode] = useState(false)
  const [verbFormTypes, setVerbFormTypes] = useState<Map<string, ConjugationFormType>>(new Map())

  // New features
  const [shuffleMode, setShuffleMode] = useState(false)
  const [testMode, setTestMode] = useState(false)
  const [currentTestIndex, setCurrentTestIndex] = useState(0)
  const [verbProgress, setVerbProgress] = useState<Map<string, VerbProgress>>(new Map())
  const [showAnswer, setShowAnswer] = useState(false)
  const [showOnlyUnknown, setShowOnlyUnknown] = useState(false)
  const [expandedMeanings, setExpandedMeanings] = useState<Set<string>>(new Set())
  const [expandedExamples, setExpandedExamples] = useState<Set<string>>(new Set())
  const [expandedUsagePatterns, setExpandedUsagePatterns] = useState<Set<string>>(new Set())
  const [selectedExampleForm, setSelectedExampleForm] = useState<'masu' | 'dict' | 'te'>('masu')
  const [examplesPopup, setExamplesPopup] = useState<{ verbId: string; verb: N5Verb; position: { x: number; y: number }; showKana: boolean; formType?: 'masu' | 'dict' | 'te' } | null>(null)
  const [usagePatternsPopup, setUsagePatternsPopup] = useState<{ verbId: string; verb: N5Verb; position: { x: number; y: number } } | null>(null)

  // Particle quiz mode
  const [particleQuizMode, setParticleQuizMode] = useState(false)
  const [particleQuizIndex, setParticleQuizIndex] = useState(0)
  const [particleQuizAnswer, setParticleQuizAnswer] = useState<string | null>(null)
  const [particleQuizScore, setParticleQuizScore] = useState({ correct: 0, total: 0 })
  const [particleQuizHistory, setParticleQuizHistory] = useState<Array<{ verbId: string; chosen: string; correct: boolean }>>([])
  const [particleQuizVerbs, setParticleQuizVerbs] = useState<N5Verb[]>([])
  const [particleQuizOptions, setParticleQuizOptions] = useState<string[][]>([])
  const [particleQuizComplete, setParticleQuizComplete] = useState(false)
  const [particleQuizStats, setParticleQuizStats] = useState<Awaited<ReturnType<typeof analyticsService.getParticleQuizStats>> | null>(null)

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

  // Load custom lists and favorites from localStorage
  useEffect(() => {
    const savedCustomLists = localStorage.getItem('customVerbLists')
    if (savedCustomLists) {
      setCustomLists(JSON.parse(savedCustomLists))
    }

    const savedFavorites = localStorage.getItem('favoriteVerbs')
    if (savedFavorites) {
      setFavoriteVerbs(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  // Load active list from URL params
  useEffect(() => {
    const listId = searchParams.get('list')
    if (listId) {
      // Check predefined lists
      const predefinedList = ALL_PREDEFINED_LISTS.find(l => l.id === listId)
      if (predefinedList) {
        setActiveList(predefinedList)
        return
      }

      // Check for combined temporary list
      if (listId === 'combined_temp') {
        const savedCombinedList = localStorage.getItem('tempCombinedList')
        if (savedCombinedList) {
          try {
            const combinedList = JSON.parse(savedCombinedList)
            setActiveList(combinedList)
            return
          } catch (error) {
            console.error('Failed to load combined list:', error)
          }
        }
      }

      // Check custom lists
      const customList = customLists.find(l => l.id === listId)
      if (customList) {
        setActiveList(customList)
      }
    } else {
      setActiveList(null)
    }
  }, [searchParams, customLists])

  // Load verbs data
  useEffect(() => {
    async function loadVerbs() {
      try {
        const response = await fetch('/seed-data/N5_verbs_dataset_2.json')
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

    // Filter by active list (takes precedence)
    // Grammar lists have empty verbIds in static data — populate dynamically here
    if (activeList) {
      let listVerbIds: Set<string>
      if (activeList.verbIds.length === 0 && activeList.category === 'grammar') {
        // Dynamically derive grammar list verb IDs from the loaded dataset
        let grammarFiltered: N5Verb[]
        switch (activeList.id) {
          case 'godan':
            grammarFiltered = verbsData.verbs.filter(v => v.morphology.class === 'godan')
            break
          case 'ichidan':
            grammarFiltered = verbsData.verbs.filter(v => v.morphology.class === 'ichidan')
            break
          case 'irregular':
            grammarFiltered = verbsData.verbs.filter(v => v.morphology.class === 'irregular')
            break
          case 'transitive':
            grammarFiltered = verbsData.verbs.filter(v => v.valency.type === 'transitive')
            break
          case 'intransitive':
            grammarFiltered = verbsData.verbs.filter(v => v.valency.type === 'intransitive')
            break
          default:
            grammarFiltered = []
        }
        listVerbIds = new Set(grammarFiltered.map(v => v.id))
      } else {
        listVerbIds = new Set(activeList.verbIds)
      }
      if (listVerbIds.size > 0) {
        filtered = filtered.filter(v => listVerbIds.has(v.id))
      }
    }

    // Filter by group
    if (selectedGroup !== "all") {
      filtered = filtered.filter(v => v.morphology.class === selectedGroup)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(v =>
        v.lemma.kanji.includes(query) ||
        v.lemma.kana.includes(query) ||
        v.meaning.gloss.some(m => m.toLowerCase().includes(query)) ||
        v.meaning.primary.toLowerCase().includes(query)
      )
    }

    // Filter by favorites
    if (showOnlyFavorites) {
      filtered = filtered.filter(v => favoriteVerbs.has(v.id))
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

    // Initialize random form types for quiz mode
    if (quizMode) {
      const formTypesMap = new Map<string, ConjugationFormType>()
      const forms: ConjugationFormType[] = ["dict", "masu", "te"]
      filtered.forEach(verb => {
        const randomForm = forms[Math.floor(Math.random() * forms.length)]
        formTypesMap.set(verb.id, randomForm)
      })
      setVerbFormTypes(formTypesMap)
    }
  }, [searchQuery, selectedGroup, verbsData, shuffleMode, showOnlyUnknown, testMode, verbProgress, quizMode, activeList, showOnlyFavorites, favoriteVerbs])

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
    { id: "all",       label: "All Verbs",       shortLabel: "All",      count: verbsData?.metadata.totalEntries || 0,                                          color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { id: "godan",     label: "Group I — Godan (う-verbs)",    shortLabel: "Gr.I",    count: verbsData?.verbs.filter(v => v.morphology.class === 'godan').length || 0,     color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
    { id: "ichidan",   label: "Group II — Ichidan (る-verbs)", shortLabel: "Gr.II",   count: verbsData?.verbs.filter(v => v.morphology.class === 'ichidan').length || 0,   color: "bg-gradient-to-r from-green-500 to-teal-500" },
    { id: "irregular", label: "Group III — Irregular",         shortLabel: "Gr.III",  count: verbsData?.verbs.filter(v => v.morphology.class === 'irregular').length || 0,  color: "bg-gradient-to-r from-orange-500 to-red-500" }
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

  const toggleFavorite = (verbId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()

    setFavoriteVerbs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(verbId)) {
        newSet.delete(verbId)
      } else {
        newSet.add(verbId)
      }

      // Save to localStorage
      localStorage.setItem('favoriteVerbs', JSON.stringify(Array.from(newSet)))
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

    // Determine which form to show based on current view mode
    const formType: 'masu' | 'dict' | 'te' =
      displaySide === 'te-kanji' || displaySide === 'te-kana' ||
      otherSide === 'te-kanji' || otherSide === 'te-kana' ||
      viewMode === 'te-form' || viewMode === 'te-form-kana'
        ? 'te'
        : viewMode === 'dictionary' || viewMode === 'dictionary-kana' ||
          displaySide === 'kanji' || displaySide === 'kana'
        ? 'dict'
        : 'masu'

    // Get button position for popup placement
    const button = e.currentTarget as HTMLElement
    const rect = button.getBoundingClientRect()

    // Calculate popup dimensions (approximate)
    const popupWidth = 420
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
      formType
    })
  }

  const toggleUsagePatternsPopup = (verb: N5Verb, e: React.MouseEvent) => {
    e.stopPropagation()

    // If clicking the same verb, close the popup
    if (usagePatternsPopup?.verbId === verb.id) {
      setUsagePatternsPopup(null)
      return
    }

    // Get button position for popup placement
    const button = e.currentTarget as HTMLElement
    const rect = button.getBoundingClientRect()

    // Calculate popup dimensions (approximate)
    const popupWidth = 420
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

    setUsagePatternsPopup({
      verbId: verb.id,
      verb: verb,
      position: { x, y }
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

  const toggleUsagePatternsExpansion = (verbId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedUsagePatterns(prev => {
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

  // ── Particle Quiz helpers ──────────────────────────────────────────────────

  const ALL_PARTICLES = ['を', 'が', 'に', 'で', 'と', 'から']

  const getParticleOptions = (verb: N5Verb): string[] => {
    const correct = verb.valency.requiredParticles[0] || 'を'
    const pool = ALL_PARTICLES.filter(p => p !== correct)
    // Shuffle pool and take 3 distractors
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 3)
    const options = [correct, ...shuffled].sort(() => Math.random() - 0.5)
    return options
  }

  const startParticleQuiz = () => {
    // Only include verbs that have requiredParticles data
    const eligible = filteredVerbs.filter(v => v.valency.requiredParticles.length > 0)
    const shuffled = [...eligible].sort(() => Math.random() - 0.5)
    // Pre-compute options for each verb so they stay stable during quiz
    const opts = shuffled.map(v => getParticleOptions(v))
    setParticleQuizVerbs(shuffled)
    setParticleQuizOptions(opts)
    setParticleQuizIndex(0)
    setParticleQuizAnswer(null)
    setParticleQuizScore({ correct: 0, total: 0 })
    setParticleQuizHistory([])
    setParticleQuizComplete(false)
  }

  const handleParticleAnswer = (chosen: string) => {
    if (particleQuizAnswer !== null) return // already answered
    const verb = particleQuizVerbs[particleQuizIndex]
    const correctParticle = verb.valency.requiredParticles[0]
    const isCorrect = chosen === correctParticle
    setParticleQuizAnswer(chosen)
    setParticleQuizScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))
    setParticleQuizHistory(prev => [
      ...prev,
      { verbId: verb.id, chosen, correct: isCorrect }
    ])
  }

  const nextParticleQuestion = () => {
    const nextIndex = particleQuizIndex + 1
    if (nextIndex >= particleQuizVerbs.length) {
      setParticleQuizComplete(true)
      // Save this session to IndexedDB and refresh lifetime stats
      const sessionId = `pq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const resultsToSave = particleQuizHistory.map(h => {
        const v = particleQuizVerbs.find(v => v.id === h.verbId)!
        return {
          verbId: h.verbId,
          verbKanji: v.lemma.kanji,
          verbMeaning: v.meaning.primary,
          valencyType: v.valency.type,
          correctParticle: v.valency.requiredParticles[0],
          chosenParticle: h.chosen,
          correct: h.correct
        }
      })
      analyticsService.saveParticleQuizSession(sessionId, resultsToSave)
        .then(() => analyticsService.getParticleQuizStats())
        .then(stats => setParticleQuizStats(stats))
        .catch(err => console.error('Failed to save quiz analytics:', err))
    } else {
      setParticleQuizIndex(nextIndex)
      setParticleQuizAnswer(null)
    }
  }

  // ──────────────────────────────────────────────────────────────────────────

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

  const renderValencyBadge = (verb: N5Verb, compact: boolean = true) => {
    const type = verb.valency.type
    const particles = verb.valency.requiredParticles

    if (compact) {
      // Small T / I / S badge for flip cards
      if (type === 'transitive') {
        return (
          <span
            title={`Transitive — takes ${particles.join('/')} particle`}
            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
          >
            T
          </span>
        )
      }
      if (type === 'intransitive') {
        return (
          <span
            title="Intransitive — no direct object"
            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
          >
            I
          </span>
        )
      }
      // Special types
      return (
        <span
          title={`${type} — ${particles.join('/')}`}
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
        >
          S
        </span>
      )
    }

    // Full badge for "all info" view
    const particleLabel = particles.length > 0 ? particles.join('/') : ''
    if (type === 'transitive') {
      return (
        <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-700 hover:bg-blue-100">
          T · {particleLabel || 'を'}
        </Badge>
      )
    }
    if (type === 'intransitive') {
      return (
        <Badge className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100">
          I{particleLabel ? ` · ${particleLabel}` : ''}
        </Badge>
      )
    }
    return (
      <Badge className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-100">
        {type.charAt(0).toUpperCase()}{type.slice(1)}{particleLabel ? ` · ${particleLabel}` : ''}
      </Badge>
    )
  }

  const renderCardContent = (verb: N5Verb, side: FlipSide, showExpandButton: boolean = false) => {
    const isExpanded = expandedMeanings.has(verb.id)

    switch (side) {
      case "english":
        return (
          <div className="relative w-full h-full flex items-center justify-center px-2 py-4">
            <div className="space-y-1 flex-1 w-full overflow-hidden">
              <div className="text-base font-bold text-primary break-words leading-tight">
                {verb.meaning.primary}
              </div>
              {isExpanded && verb.meaning.gloss.length > 1 && (
                <div className="text-xs text-muted-foreground break-words leading-tight">
                  {verb.meaning.gloss.slice(1).join(', ')}
                </div>
              )}
            </div>
            {showExpandButton && verb.meaning.gloss.length > 2 && (
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
            <div className="text-2xl sm:text-4xl font-bold text-primary">
              {verb.lemma.kanji}
            </div>
          </div>
        )
      case "kana":
        return (
          <div className="text-2xl sm:text-4xl font-bold text-primary">
            {verb.lemma.kana}
          </div>
        )
      case "masu-kanji":
        return (
          <div className="text-2xl sm:text-4xl font-bold text-primary">
            {verb.forms.masu.kanji}
          </div>
        )
      case "masu-kana":
        return (
          <div className="text-2xl sm:text-4xl font-bold text-primary">
            {verb.forms.masu.kana}
          </div>
        )
      case "te-kanji":
        return (
          <div className="text-2xl sm:text-4xl font-bold text-primary">
            {verb.forms.te.kanji}
          </div>
        )
      case "te-kana":
        return (
          <div className="text-2xl sm:text-4xl font-bold text-primary">
            {verb.forms.te.kana}
          </div>
        )
      case "kana-mixed":
        // Show the appropriate kana based on quiz mode
        if (quizMode) {
          const formType = verbFormTypes.get(verb.id) || "dict"
          let kanaText = verb.lemma.kana
          if (formType === "masu") {
            kanaText = verb.forms.masu.kana
          } else if (formType === "te") {
            kanaText = verb.forms.te.kana
          }
          return (
            <div className="text-2xl sm:text-4xl font-bold text-primary">
              {kanaText}
            </div>
          )
        }
        // Default: show dictionary form kana
        return (
          <div className="text-2xl sm:text-4xl font-bold text-primary">
            {verb.lemma.kana}
          </div>
        )
      case "image":
        return (
          <div className="flex items-center justify-center w-full h-full p-2">
            <img
              src={`/images/verbs/${verb.id}.png`}
              alt={`${verb.lemma.kanji} - ${verb.meaning.primary}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => {
                // Fallback if image doesn't exist
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `<div class="text-sm text-muted-foreground">Image not available</div>`
                }
              }}
            />
          </div>
        )
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center px-2 py-4">
            <div className="space-y-1 flex-1 w-full overflow-hidden">
              <div className="text-base font-bold text-primary break-words leading-tight">
                {verb.meaning.primary}
              </div>
              {isExpanded && verb.meaning.gloss.length > 1 && (
                <div className="text-xs text-muted-foreground break-words leading-tight">
                  {verb.meaning.gloss.slice(1).join(', ')}
                </div>
              )}
            </div>
            {showExpandButton && verb.meaning.gloss.length > 2 && (
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

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 max-w-7xl">
        {/* Hero — compact single row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">
              N5 Verbs <span className="text-muted-foreground font-normal text-lg">· {verbsData?.metadata.totalEntries} verbs</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">JLPT N5 complete collection with conjugations and practice modes</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:shrink-0">
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/verbs/lists'} className="gap-1.5 text-xs">
              <ListChecks className="h-3.5 w-3.5" />
              Verb Lists
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/verbs/form-master'} className="gap-1.5 text-xs">
              <Target className="h-3.5 w-3.5" />
              Form Master
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/verbs/form-tutorials'} className="gap-1.5 text-xs">
              <GraduationCap className="h-3.5 w-3.5" />
              Tutorials
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/verbs/grammar-reference'} className="gap-1.5 text-xs">
              <BookOpen className="h-3.5 w-3.5" />
              Grammar
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/verbs/transitive-intransitive'} className="gap-1.5 text-xs">
              <Layers className="h-3.5 w-3.5" />
              T/I Guide
            </Button>
          </div>
        </div>

        {/* Active List Filter Banner */}
        {activeList && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/40 text-sm">
            <ListChecks className="h-4 w-4 text-primary shrink-0" />
            <span className="font-medium">{activeList.icon} {activeList.name}</span>
            <span className="text-muted-foreground">— {filteredVerbs.length} verbs</span>
            <button
              onClick={() => router.push('/verbs')}
              className="ml-auto flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        )}

        {/* Controls */}
        <Card>
          <CardContent className="pt-4 pb-4 space-y-3">

            {/* Row 1: Search + group filter */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search by kanji, kana, romaji, or meaning…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {filteredVerbs.length} / {verbsData?.metadata.totalEntries}
                </span>
              </div>
              <div className="flex gap-1 sm:gap-1.5 flex-wrap sm:flex-nowrap">
                {verbGroups.map(group => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md text-xs font-medium border transition-colors whitespace-nowrap ${
                      selectedGroup === group.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    <span className="hidden sm:inline">{group.label}</span>
                    <span className="sm:hidden">{group.shortLabel ?? group.label}</span>
                    <span className={`text-xs ${selectedGroup === group.id ? 'opacity-70' : 'text-muted-foreground'}`}>
                      {group.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Practice Mode selector */}
            <div className="flex flex-wrap gap-2">
                {/* Browse */}
                <button
                  onClick={() => { setFlipMode(false); setTestMode(false); setMatchingMode(false); setParticleQuizMode(false) }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                    !flipMode && !testMode && !matchingMode && !particleQuizMode
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Browse
                </button>

                {/* Flip Cards */}
                <button
                  onClick={() => { setFlipMode(true); setTestMode(false); setMatchingMode(false); setParticleQuizMode(false) }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                    flipMode && !testMode
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                  }`}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Flip Cards</span>
                  <span className="sm:hidden">Flip</span>
                </button>

                {/* Test */}
                <button
                  onClick={() => { setTestMode(true); setFlipMode(true); setMatchingMode(false); setParticleQuizMode(false); setCurrentTestIndex(0); setShowAnswer(false) }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                    testMode
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                  }`}
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  Test
                </button>

                {/* Matching */}
                <button
                  onClick={() => { setMatchingMode(true); setTestMode(false); setFlipMode(false); setParticleQuizMode(false); setCurrentBatch(0); resetMatchingState() }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                    matchingMode
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                  }`}
                >
                  <Target className="h-3.5 w-3.5" />
                  Match
                </button>

                {/* Particle Quiz */}
                <button
                  onClick={() => { setParticleQuizMode(true); setTestMode(false); setFlipMode(false); setMatchingMode(false); startParticleQuiz() }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                    particleQuizMode
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                  }`}
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Particle Quiz</span>
                  <span className="sm:hidden">Particles</span>
                </button>
              </div>

            {/* Row 3: Options — context-sensitive */}
            <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-2">
              {/* Shuffle — always available */}
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                <Switch id="shuffle-mode" checked={shuffleMode} onCheckedChange={setShuffleMode} />
                <span className="flex items-center gap-1 text-muted-foreground"><Shuffle className="h-3.5 w-3.5" />Shuffle</span>
              </label>

              {/* Favorites — always available */}
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                <Switch id="favorites-only" checked={showOnlyFavorites} onCheckedChange={setShowOnlyFavorites} />
                <span className="flex items-center gap-1 text-muted-foreground"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />Favorites</span>
              </label>

              {/* Conjugation Quiz — only in Flip Cards mode */}
              {flipMode && !testMode && (
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                  <Switch
                    id="quiz-mode"
                    checked={quizMode}
                    onCheckedChange={(checked) => {
                      setQuizMode(checked)
                      if (checked) { setFrontSide("english"); setBackSide("kana-mixed") }
                    }}
                  />
                  <span className="flex items-center gap-1 text-muted-foreground"><Zap className="h-3.5 w-3.5" />Conjugation Quiz</span>
                </label>
              )}

              {/* Focus Practice — only in Test mode */}
              {testMode && (
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                  <Switch id="show-unknown" checked={showOnlyUnknown} onCheckedChange={setShowOnlyUnknown} />
                  <span className="text-muted-foreground">Focus on needs practice</span>
                </label>
              )}

              {/* Auto-advance — only in Matching mode */}
              {matchingMode && (
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                  <Switch
                    id="matching-test-mode"
                    checked={matchingTestMode}
                    onCheckedChange={(checked) => { setMatchingTestMode(checked); if (checked) resetAllMatchingProgress() }}
                  />
                  <span className="text-muted-foreground">Auto-advance</span>
                </label>
              )}

              {/* Reset */}
              <button
                onClick={() => { setSearchQuery(""); setSelectedGroup("all"); setViewMode("all"); setFlipMode(false); setFrontSide("english"); setBackSide("kanji") }}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Row 4: Flip side selectors — only in Flip Cards mode (not test, not quiz) */}
            {flipMode && !testMode && !quizMode && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-1 border-t">
                <div className="flex items-center gap-2 sm:contents">
                  <span className="text-xs text-muted-foreground shrink-0 w-10 sm:w-auto">Front →</span>
                  <select
                    value={frontSide}
                    onChange={(e) => setFrontSide(e.target.value as FlipSide)}
                    className="text-sm px-2 py-1.5 border rounded-md bg-background flex-1 min-w-0"
                  >
                    <option value="english">English</option>
                    <option value="kanji">Dictionary (Kanji)</option>
                    <option value="kana">Dictionary (Kana)</option>
                    <option value="kana-mixed">Mixed Kana</option>
                    <option value="masu-kanji">Masu (Kanji)</option>
                    <option value="masu-kana">Masu (Kana)</option>
                    <option value="te-kanji">Te-form (Kanji)</option>
                    <option value="te-kana">Te-form (Kana)</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 sm:contents">
                  <span className="text-xs text-muted-foreground shrink-0 w-10 sm:w-auto">Back →</span>
                  <select
                    value={backSide}
                    onChange={(e) => setBackSide(e.target.value as FlipSide)}
                    className="text-sm px-2 py-1.5 border rounded-md bg-background flex-1 min-w-0"
                  >
                    <option value="english">English</option>
                    <option value="kanji">Dictionary (Kanji)</option>
                    <option value="kana">Dictionary (Kana)</option>
                    <option value="kana-mixed">Mixed Kana</option>
                    <option value="masu-kanji">Masu (Kanji)</option>
                    <option value="masu-kana">Masu (Kana)</option>
                    <option value="te-kanji">Te-form (Kanji)</option>
                    <option value="te-kana">Te-form (Kana)</option>
                    <option value="image">Image</option>
                  </select>
                </div>
              </div>
            )}

            {/* Row 5: Matching side selectors */}
            {matchingMode && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-1 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground shrink-0 w-10 sm:w-auto">Left →</span>
                  <select
                    value={matchingLeftForm}
                    onChange={(e) => { setMatchingLeftForm(e.target.value as FlipSide); resetAllMatchingProgress() }}
                    className="text-sm px-2 py-1.5 border rounded-md bg-background flex-1 min-w-0"
                  >
                    <option value="english">English</option>
                    <option value="kanji">Dictionary (Kanji)</option>
                    <option value="kana">Dictionary (Kana)</option>
                    <option value="kana-mixed">Mixed Kana</option>
                    <option value="masu-kanji">Masu (Kanji)</option>
                    <option value="masu-kana">Masu (Kana)</option>
                    <option value="te-kanji">Te-form (Kanji)</option>
                    <option value="te-kana">Te-form (Kana)</option>
                  </select>
                </div>
                <span className="hidden sm:block text-xs text-muted-foreground shrink-0">⟷</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground shrink-0 w-10 sm:w-auto">Right →</span>
                  <select
                    value={matchingRightForm}
                    onChange={(e) => { setMatchingRightForm(e.target.value as FlipSide); resetAllMatchingProgress() }}
                    className="text-sm px-2 py-1.5 border rounded-md bg-background flex-1 min-w-0"
                  >
                    <option value="english">English</option>
                    <option value="kanji">Dictionary (Kanji)</option>
                    <option value="kana">Dictionary (Kana)</option>
                    <option value="kana-mixed">Mixed Kana</option>
                    <option value="masu-kanji">Masu (Kanji)</option>
                    <option value="masu-kana">Masu (Kana)</option>
                    <option value="te-kanji">Te-form (Kanji)</option>
                    <option value="te-kana">Te-form (Kana)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Row 6: View mode pills — only in Browse mode */}
            {!flipMode && !matchingMode && !particleQuizMode && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1 border-t">
                {(
                  [
                    { key: "all",             label: "All Info" },
                    { key: "dictionary",      label: "Dict (Kanji)" },
                    { key: "dictionary-kana", label: "Dict (Kana)" },
                    { key: "masu",            label: "Masu (Kanji)" },
                    { key: "kana-masu",       label: "Masu (Kana)" },
                    { key: "te-form",         label: "Te (Kanji)" },
                    { key: "te-form-kana",    label: "Te (Kana)" },
                  ] as { key: ViewMode; label: string }[]
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setViewMode(key)}
                    className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                      viewMode === key
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

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
            {/* ── Particle Quiz Mode ── */}
            {particleQuizMode && (
              <div className="max-w-xl mx-auto space-y-6">
                {particleQuizComplete ? (
                  /* Results Screen */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card>
                      <CardHeader className="text-center">
                        <div className="text-6xl mb-2">
                          {particleQuizScore.correct / particleQuizScore.total >= 0.8 ? '🎉' : '📚'}
                        </div>
                        <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
                        <CardDescription>
                          {particleQuizScore.correct} / {particleQuizScore.total} correct
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center p-6 bg-muted/50 rounded-lg">
                          <div className="text-3xl sm:text-5xl font-bold gradient-text mb-1">
                            {Math.round((particleQuizScore.correct / particleQuizScore.total) * 100)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Score</div>
                        </div>

                        {/* Mistake review */}
                        {particleQuizHistory.filter(h => !h.correct).length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-2 text-destructive">
                              Review — {particleQuizHistory.filter(h => !h.correct).length} mistakes:
                            </p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {particleQuizHistory.filter(h => !h.correct).map((h, idx) => {
                                const v = particleQuizVerbs.find(v => v.id === h.verbId)
                                if (!v) return null
                                return (
                                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm">
                                    <span className="font-medium">{v.lemma.kanji} <span className="text-muted-foreground text-xs">({v.meaning.primary})</span></span>
                                    <div className="flex items-center gap-2">
                                      <span className="line-through text-red-500">{h.chosen}</span>
                                      <span className="text-green-600 font-bold">{v.valency.requiredParticles[0]}</span>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Lifetime confusion stats */}
                        {particleQuizStats && particleQuizStats.totalAttempts > 0 && (
                          <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Lifetime Stats ({particleQuizStats.totalAttempts} attempts)
                            </p>

                            {/* By valency type */}
                            {Object.keys(particleQuizStats.byValencyType).length > 0 && (
                              <div className="space-y-1">
                                {Object.entries(particleQuizStats.byValencyType).map(([type, data]) => (
                                  <div key={type} className="flex items-center gap-2 text-sm">
                                    <Badge variant="outline" className="text-xs w-24 justify-center shrink-0">
                                      {type}
                                    </Badge>
                                    <Progress value={data.accuracy} className="h-2 flex-1" />
                                    <span className="text-xs text-muted-foreground w-12 text-right">
                                      {data.accuracy}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Worst verbs */}
                            {particleQuizStats.worstVerbs.length > 0 && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Needs practice:</p>
                                <div className="flex flex-wrap gap-1">
                                  {particleQuizStats.worstVerbs.map(v => (
                                    <Badge key={v.verbId} variant="secondary" className="text-xs">
                                      {v.verbKanji} {v.accuracy}%
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button onClick={startParticleQuiz} className="flex-1" size="lg">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                          </Button>
                          <Button
                            onClick={() => setParticleQuizMode(false)}
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
                ) : particleQuizVerbs.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No verbs with particle data in the current filter.
                    </CardContent>
                  </Card>
                ) : (
                  /* Active Quiz */
                  (() => {
                    const verb = particleQuizVerbs[particleQuizIndex]
                    const options = particleQuizOptions[particleQuizIndex] || []
                    const correctParticle = verb.valency.requiredParticles[0]
                    const answered = particleQuizAnswer !== null

                    return (
                      <motion.div
                        key={particleQuizIndex}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Question {particleQuizIndex + 1} / {particleQuizVerbs.length}</span>
                            <span>{particleQuizScore.correct} correct</span>
                          </div>
                          <Progress value={((particleQuizIndex) / particleQuizVerbs.length) * 100} className="h-2" />
                        </div>

                        {/* Verb card */}
                        <Card className="text-center">
                          <CardContent className="pt-8 pb-6 space-y-3">
                            <div className="space-y-1">
                              <div className="text-3xl sm:text-5xl font-bold text-primary">{verb.lemma.kanji}</div>
                              <div className="text-lg sm:text-xl text-muted-foreground">{verb.lemma.kana}</div>
                            </div>
                            <p className="text-base text-muted-foreground">{verb.meaning.primary}</p>
                            <div className="flex items-center justify-center gap-2">
                              {renderValencyBadge(verb, false)}
                            </div>
                            <p className="text-sm font-semibold pt-2">
                              Which particle does <span className="text-primary">{verb.lemma.kanji}</span> take?
                            </p>
                          </CardContent>
                        </Card>

                        {/* Particle choices */}
                        <div className="grid grid-cols-2 gap-3">
                          {options.map((particle) => {
                            const isCorrect = particle === correctParticle
                            const isChosen = particle === particleQuizAnswer
                            let btnClass = "h-16 text-2xl font-bold border-2 transition-all"
                            if (!answered) {
                              btnClass += " hover:border-primary hover:bg-primary/10"
                            } else if (isCorrect) {
                              btnClass += " bg-green-100 border-green-500 dark:border-green-500 text-green-700 dark:bg-green-950 dark:text-green-300 shadow-md shadow-green-100 dark:shadow-green-900/40"
                            } else if (isChosen) {
                              btnClass += " bg-red-100 border-red-500 dark:border-red-500 text-red-700 dark:bg-red-950 dark:text-red-300 shadow-md shadow-red-100 dark:shadow-red-900/40"
                            } else {
                              btnClass += " opacity-40"
                            }
                            return (
                              <Button
                                key={particle}
                                variant="outline"
                                className={btnClass}
                                onClick={() => handleParticleAnswer(particle)}
                                disabled={answered}
                              >
                                {particle}
                                {answered && isCorrect && (
                                  <CheckCircle2 className="ml-2 h-5 w-5 text-green-600" />
                                )}
                                {answered && isChosen && !isCorrect && (
                                  <X className="ml-2 h-5 w-5 text-red-600" />
                                )}
                              </Button>
                            )
                          })}
                        </div>

                        {/* Feedback + Next */}
                        {answered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                          >
                            <div className={cn(
                              "p-3 rounded-lg text-sm font-medium text-center",
                              particleQuizAnswer === correctParticle
                                ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                                : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                            )}>
                              {particleQuizAnswer === correctParticle
                                ? `Correct! ${verb.lemma.kanji} takes ${correctParticle}`
                                : `The correct particle is ${correctParticle}`
                              }
                              {verb.valency.requiredParticles.length > 1 && (
                                <span className="ml-1 text-muted-foreground">
                                  (also: {verb.valency.requiredParticles.slice(1).join('/')})
                                </span>
                              )}
                            </div>
                            <Button onClick={nextParticleQuestion} className="w-full" size="lg">
                              {particleQuizIndex + 1 < particleQuizVerbs.length ? (
                                <>Next <ChevronRight className="ml-1 h-4 w-4" /></>
                              ) : (
                                <>See Results <ChevronRight className="ml-1 h-4 w-4" /></>
                              )}
                            </Button>
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })()
                )}
              </div>
            )}

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
                          <div className="text-3xl sm:text-5xl font-bold gradient-text mb-2">
                            {calculateFinalScore()}%
                          </div>
                          <div className="text-sm text-muted-foreground">Overall Score</div>
                        </div>

                        {/* Batch Scores */}
                        <div>
                          <h3 className="text-sm font-semibold mb-3">Batch Scores:</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
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
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-400/20 dark:to-cyan-400/20 rounded-md"></div>
                      <div className="relative text-xs font-bold text-center py-2 px-3 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 text-white rounded-md shadow-md">
                        <div className="flex items-center justify-center gap-1.5">
                          <List className="h-3.5 w-3.5" />
                          <span>
                            {matchingLeftForm === 'english' ? 'English' :
                             matchingLeftForm === 'kanji' ? 'Dictionary (Kanji)' :
                             matchingLeftForm === 'kana' ? 'Dictionary (Kana)' :
                             matchingLeftForm === 'kana-mixed' ? 'Mixed Kana' :
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
                            "cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 border",
                            selectedLeft === verb.id && "ring-2 ring-blue-400 dark:ring-blue-400 shadow-lg shadow-blue-100 dark:shadow-blue-900/50 scale-[1.02] border-blue-400 dark:border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20",
                            correctMatches.has(verb.id) && "ring-2 ring-green-400 dark:ring-green-500 border-green-400 dark:border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 opacity-70",
                            wrongAttempts.has(verb.id) && !correctMatches.has(verb.id) && "ring-2 ring-red-400 dark:ring-red-500 border-red-400 dark:border-red-500 animate-shake bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20",
                            !selectedLeft && !correctMatches.has(verb.id) && !wrongAttempts.has(verb.id) && "border-border hover:border-blue-300 dark:hover:border-blue-500 bg-gradient-to-br from-background to-muted/30"
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
                                  <span className="text-sm">{verb.meaning.primary}</span>
                                ) : matchingLeftForm === 'kanji' || matchingLeftForm === 'kana' || matchingLeftForm === 'kana-mixed' ? (
                                  <span className="text-xl font-bold">{matchingLeftForm === 'kanji' ? verb.lemma.kanji : verb.lemma.kana}</span>
                                ) : matchingLeftForm === 'masu-kanji' || matchingLeftForm === 'masu-kana' ? (
                                  <span className="text-xl font-bold">{matchingLeftForm === 'masu-kanji' ? verb.forms.masu.kanji : verb.forms.masu.kana}</span>
                                ) : (
                                  <span className="text-xl font-bold">{matchingLeftForm === 'te-kanji' ? verb.forms.te.kanji : verb.forms.te.kana}</span>
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
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-400/20 dark:to-pink-400/20 rounded-md"></div>
                      <div className="relative text-xs font-bold text-center py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white rounded-md shadow-md">
                        <div className="flex items-center justify-center gap-1.5">
                          <Shuffle className="h-3.5 w-3.5" />
                          <span>
                            {matchingRightForm === 'english' ? 'English' :
                             matchingRightForm === 'kanji' ? 'Dictionary (Kanji)' :
                             matchingRightForm === 'kana' ? 'Dictionary (Kana)' :
                             matchingRightForm === 'kana-mixed' ? 'Mixed Kana' :
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
                            "cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 border",
                            selectedRight === verb.id && "ring-2 ring-purple-400 dark:ring-purple-400 shadow-lg shadow-purple-100 dark:shadow-purple-900/50 scale-[1.02] border-purple-400 dark:border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20",
                            correctMatches.has(verb.id) && "ring-2 ring-green-400 dark:ring-green-500 border-green-400 dark:border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 opacity-70",
                            !selectedRight && !correctMatches.has(verb.id) && "border-border hover:border-purple-300 dark:hover:border-purple-500 bg-gradient-to-br from-background to-muted/30"
                          )}
                        >
                          <CardContent className="p-2.5 px-3 min-h-[48px] flex items-center justify-center">
                            <div className="flex items-center gap-2.5 w-full justify-center">
                              <div className="flex-1 text-center text-sm font-semibold">
                                {matchingRightForm === 'english' ? (
                                  <span className="text-sm">{verb.meaning.primary}</span>
                                ) : matchingRightForm === 'kanji' || matchingRightForm === 'kana' || matchingRightForm === 'kana-mixed' ? (
                                  <span className="text-xl font-bold">{matchingRightForm === 'kanji' ? verb.lemma.kanji : verb.lemma.kana}</span>
                                ) : matchingRightForm === 'masu-kanji' || matchingRightForm === 'masu-kana' ? (
                                  <span className="text-xl font-bold">{matchingRightForm === 'masu-kanji' ? verb.forms.masu.kanji : verb.forms.masu.kana}</span>
                                ) : (
                                  <span className="text-xl font-bold">{matchingRightForm === 'te-kanji' ? verb.forms.te.kanji : verb.forms.te.kana}</span>
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
            {!matchingMode && !particleQuizMode && flipMode && testMode && (
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
                <div className={`grid ${
                  frontSide === "image" || backSide === "image"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
                }`}>
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
                                  (isFlipped && backSide === 'english' && expandedMeanings.has(verb.id)) ||
                                  (frontSide === "image" || backSide === "image")
                                  ? "auto"
                                  : "180px"
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
                                "transition-all duration-200 relative w-full overflow-hidden border-0 shadow-lg",
                                hasProgress && progress.level >= 3 ? "ring-2 ring-green-400 dark:ring-green-500 shadow-green-100 dark:shadow-green-900/50" :
                                hasProgress && progress.level < 3 ? "ring-2 ring-red-400 dark:ring-red-500 shadow-red-100 dark:shadow-red-900/50" :
                                "hover:shadow-xl hover:-translate-y-0.5"
                              )}
                              style={{
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                minHeight: "180px"
                              }}
                            >
                              {/* Level Badge - top left inside card */}
                              {hasProgress && (
                                <div className="absolute top-2 left-2 z-10">
                                  <Badge
                                    variant={progress.level >= 3 ? "default" : "destructive"}
                                    className="text-[10px] px-1.5 py-0"
                                  >
                                    L{progress.level}
                                  </Badge>
                                </div>
                              )}

                              {/* Button Group in Top Right */}
                              <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                                {/* Favorite Toggle */}
                                <button
                                  onClick={(e) => toggleFavorite(verb.id, e)}
                                  className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                  title={favoriteVerbs.has(verb.id) ? "Remove from favorites" : "Add to favorites"}
                                >
                                  <Star
                                    className={cn(
                                      "h-4 w-4 transition-all",
                                      favoriteVerbs.has(verb.id)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground hover:text-yellow-400"
                                    )}
                                  />
                                </button>
                                {/* Examples Toggle */}
                                {verb.examples && (verb.examples.masu.length > 0 || verb.examples.dictionary.length > 0 || verb.examples.te.length > 0) && (
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
                                {/* Usage Patterns Toggle */}
                                {verb.usagePatterns && verb.usagePatterns.length > 0 && (
                                  <button
                                    onClick={(e) => toggleUsagePatternsPopup(verb, e)}
                                    className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                    title={usagePatternsPopup?.verbId === verb.id ? "Hide usage patterns" : "Show usage patterns"}
                                  >
                                    {usagePatternsPopup?.verbId === verb.id ? (
                                      <Sparkles className="h-4 w-4 text-blue-500" />
                                    ) : (
                                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </button>
                                )}
                                {/* Meanings Toggle */}
                                {frontSide === 'english' && verb.meaning.gloss.length > 2 && (
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

                              {/* Valency badge - bottom left */}
                              <div className="absolute bottom-2 left-2 z-10">
                                {renderValencyBadge(verb, true)}
                              </div>

                              {/* Quiz mode badge - at bottom right corner */}
                              {quizMode && frontSide === 'english' && (
                                <div className="absolute bottom-2 right-2 z-10">
                                  <Badge variant="default" className="text-xs font-bold px-2 py-0.5">
                                    {verbFormTypes.get(verb.id) === 'dict' ? 'Dict' :
                                     verbFormTypes.get(verb.id) === 'masu' ? 'Masu' : 'Te'}
                                  </Badge>
                                </div>
                              )}

                              <CardContent className={`p-6 text-center flex items-center justify-center bg-gradient-to-b from-background to-muted/30 ${
                                frontSide === "image" || backSide === "image" ? "min-h-[280px]" : "min-h-[180px]"
                              }`}>
                                {renderCardContent(verb, frontSide, false)}
                              </CardContent>
                            </Card>

                            {/* Back Side with Action Buttons */}
                            <Card
                              className="absolute top-0 left-0 w-full overflow-hidden border-0 shadow-lg shadow-violet-200/60 dark:shadow-violet-900/40"
                              style={{
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                                minHeight: "180px"
                              }}
                            >
                              {/* Accent bar at top — thicker on mobile for at-a-glance recognition */}
                              <div className="h-1.5 sm:h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
                              {/* Button Group in Top Right (Back) */}
                              <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                                {/* Examples Toggle */}
                                {verb.examples && (verb.examples.masu.length > 0 || verb.examples.dictionary.length > 0 || verb.examples.te.length > 0) && (
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
                                {/* Usage Patterns Toggle */}
                                {verb.usagePatterns && verb.usagePatterns.length > 0 && (
                                  <button
                                    onClick={(e) => toggleUsagePatternsPopup(verb, e)}
                                    className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                    title={usagePatternsPopup?.verbId === verb.id ? "Hide usage patterns" : "Show usage patterns"}
                                  >
                                    {usagePatternsPopup?.verbId === verb.id ? (
                                      <Sparkles className="h-4 w-4 text-blue-500" />
                                    ) : (
                                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </button>
                                )}
                                {/* Meanings Toggle */}
                                {backSide === 'english' && verb.meaning.gloss.length > 2 && (
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
                              <CardContent className={`p-3 sm:p-4 text-center flex flex-col items-center justify-between bg-gradient-to-b from-violet-100/90 via-purple-50/60 to-muted/30 dark:from-violet-950/50 dark:via-purple-950/30 dark:to-muted/30 ${
                                frontSide === "image" || backSide === "image" ? "min-h-[280px]" : "min-h-[180px]"
                              }`}>
                                <div className="flex-1 flex items-center justify-center w-full">
                                  {renderCardContent(verb, backSide, false)}
                                </div>

                                {/* Action Buttons on Back */}
                                {isFlipped && (
                                  <div className="flex justify-between mt-3 w-full px-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={() => markVerbKnown(verb.id, false)}
                                      title="Don't know"
                                      className="p-2.5 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/70 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 transition-colors"
                                    >
                                      <ThumbsDown className="h-4 w-4" />
                                    </button>

                                    <button
                                      onClick={() => markVerbKnown(verb.id, true)}
                                      title="Know"
                                      className="p-2.5 rounded-full bg-green-50 hover:bg-green-100 dark:bg-green-950/40 dark:hover:bg-green-950/70 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 transition-colors"
                                    >
                                      <ThumbsUp className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>

                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Normal Flip Card Views - Grid of all cards */}
            {!matchingMode && !particleQuizMode && flipMode && !testMode && (
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

                <div className={`grid ${
                  frontSide === "image" || backSide === "image"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
                }`}>
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
                                (isFlipped && backSide === 'english' && expandedMeanings.has(verb.id)) ||
                                (frontSide === "image" || backSide === "image")
                                ? "auto"
                                : "180px"
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
                          className="relative w-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            minHeight: "180px"
                          }}
                        >
                          {/* Button Group in Top Right */}
                          <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                            {/* Examples Toggle */}
                            {verb.examples && (verb.examples.masu.length > 0 || verb.examples.dictionary.length > 0 || verb.examples.te.length > 0) && (
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
                            {/* Usage Patterns Toggle */}
                            {verb.usagePatterns && verb.usagePatterns.length > 0 && (
                              <button
                                onClick={(e) => toggleUsagePatternsPopup(verb, e)}
                                className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                title={usagePatternsPopup?.verbId === verb.id ? "Hide usage patterns" : "Show usage patterns"}
                              >
                                {usagePatternsPopup?.verbId === verb.id ? (
                                  <Sparkles className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            )}
                            {/* Meanings Toggle */}
                            {frontSide === 'english' && verb.meaning.gloss.length > 2 && (
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

                          {/* Valency badge - bottom left */}
                          <div className="absolute bottom-2 left-2 z-10">
                            {renderValencyBadge(verb, true)}
                          </div>

                          {/* Quiz mode badge - at bottom right corner */}
                          {quizMode && frontSide === 'english' && (
                            <div className="absolute bottom-2 right-2 z-10">
                              <Badge variant="default" className="text-xs font-bold px-2 py-0.5">
                                {verbFormTypes.get(verb.id) === 'dict' ? 'Dict' :
                                 verbFormTypes.get(verb.id) === 'masu' ? 'Masu' : 'Te'}
                              </Badge>
                            </div>
                          )}

                          <CardContent className={`p-6 text-center flex items-center justify-center bg-gradient-to-b from-background to-muted/30 ${
                            frontSide === "image" || backSide === "image" ? "min-h-[280px]" : "min-h-[180px]"
                          }`}>
                            {renderCardContent(verb, frontSide, false)}
                          </CardContent>
                        </Card>

                        {/* Back Side */}
                        <Card
                          className="absolute top-0 left-0 w-full overflow-hidden border-0 shadow-lg shadow-violet-200/60 dark:shadow-violet-900/40"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            minHeight: "180px"
                          }}
                        >
                          {/* Accent bar at top — thicker on mobile for at-a-glance recognition */}
                          <div className="h-1.5 sm:h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
                          {/* Button Group in Top Right (Back) */}
                          <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                            {/* Examples Toggle */}
                            {verb.examples && (verb.examples.masu.length > 0 || verb.examples.dictionary.length > 0 || verb.examples.te.length > 0) && (
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
                            {/* Usage Patterns Toggle */}
                            {verb.usagePatterns && verb.usagePatterns.length > 0 && (
                              <button
                                onClick={(e) => toggleUsagePatternsPopup(verb, e)}
                                className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                title={usagePatternsPopup?.verbId === verb.id ? "Hide usage patterns" : "Show usage patterns"}
                              >
                                {usagePatternsPopup?.verbId === verb.id ? (
                                  <Sparkles className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            )}
                            {/* Meanings Toggle */}
                            {backSide === 'english' && verb.meaning.gloss.length > 2 && (
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
                          <CardContent className={`p-4 sm:p-6 text-center flex items-center justify-center bg-gradient-to-b from-violet-100/90 via-purple-50/60 to-muted/30 dark:from-violet-950/50 dark:via-purple-950/30 dark:to-muted/30 ${
                            frontSide === "image" || backSide === "image" ? "min-h-[280px]" : "min-h-[180px]"
                          }`}>
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
            {!matchingMode && !particleQuizMode && !flipMode && viewMode !== "all" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredVerbs.map((verb, index) => (
                  <motion.div
                    key={verb.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(index * 0.02, 0.5) }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group border-0 shadow-md">
                      {/* Glossy accent bar */}
                      <div className={cn(
                        "h-1 w-full",
                        verb.morphology.class === 'godan' ? "bg-gradient-to-r from-blue-400 to-indigo-500" :
                        verb.morphology.class === 'ichidan' ? "bg-gradient-to-r from-emerald-400 to-teal-500" :
                        "bg-gradient-to-r from-orange-400 to-rose-500"
                      )} />
                      <CardContent className="p-5 text-center space-y-3 bg-gradient-to-b from-background to-muted/20">
                        {/* Main Display */}
                        <div className="space-y-1.5">
                          {viewMode === "dictionary" && (
                            <>
                              <div className="text-xl sm:text-3xl font-bold group-hover:text-primary transition-colors tracking-wide">
                                {verb.lemma.kanji}
                              </div>
                              <div className="text-sm text-muted-foreground">{verb.lemma.kana}</div>
                            </>
                          )}
                          {viewMode === "masu" && (
                            <>
                              <div className="text-xl sm:text-3xl font-bold group-hover:text-primary transition-colors tracking-wide">
                                {verb.forms.masu.kanji}
                              </div>
                              <div className="text-sm text-muted-foreground">{verb.forms.masu.kana}</div>
                            </>
                          )}
                          {viewMode === "kana-masu" && (
                            <>
                              <div className="text-xl sm:text-3xl font-bold group-hover:text-primary transition-colors tracking-wide">
                                {verb.forms.masu.kana}
                              </div>
                              <div className="text-sm text-muted-foreground">{verb.forms.masu.kanji}</div>
                            </>
                          )}
                          {viewMode === "dictionary-kana" && (
                            <>
                              <div className="text-xl sm:text-3xl font-bold group-hover:text-primary transition-colors tracking-wide">
                                {verb.lemma.kana}
                              </div>
                              <div className="text-sm text-muted-foreground">{verb.lemma.kanji}</div>
                            </>
                          )}
                          {viewMode === "te-form" && (
                            <>
                              <div className="text-xl sm:text-3xl font-bold group-hover:text-primary transition-colors tracking-wide">
                                {verb.forms.te.kanji}
                              </div>
                              <div className="text-sm text-muted-foreground">{verb.forms.te.kana}</div>
                            </>
                          )}
                          {viewMode === "te-form-kana" && (
                            <>
                              <div className="text-xl sm:text-3xl font-bold group-hover:text-primary transition-colors tracking-wide">
                                {verb.forms.te.kana}
                              </div>
                              <div className="text-sm text-muted-foreground">{verb.forms.te.kanji}</div>
                            </>
                          )}
                        </div>

                        {/* Meaning */}
                        <div className="pt-2 border-t border-border/50">
                          <p className="text-sm font-medium">{verb.meaning.primary}</p>
                        </div>

                        {/* Group + Valency Badges */}
                        <div className="flex flex-wrap items-center gap-1 justify-center">
                          <Badge variant={
                            verb.morphology.class === 'godan' ? 'default' :
                            verb.morphology.class === 'ichidan' ? 'secondary' : 'outline'
                          } className="text-xs">
                            {verbGroupLabel(verb.morphology.class)}
                          </Badge>
                          {renderValencyBadge(verb, true)}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Full Information View */}
            {!matchingMode && !particleQuizMode && !flipMode && viewMode === "all" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVerbs.map((verb, index) => (
                  <motion.div
                    key={verb.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(index * 0.05, 1) }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full border shadow-sm">
                      {/* Header */}
                      <div className={cn(
                        "px-4 py-3 border-b",
                        verb.morphology.class === 'godan'
                          ? "bg-gradient-to-r from-blue-500/5 to-background"
                          : verb.morphology.class === 'ichidan'
                          ? "bg-gradient-to-r from-emerald-500/5 to-background"
                          : "bg-gradient-to-r from-orange-500/5 to-background"
                      )}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-baseline gap-2 flex-1 min-w-0">
                            <CardTitle className="text-lg sm:text-xl font-bold tracking-wide truncate">{verb.lemma.kanji}</CardTitle>
                            <span className="text-sm sm:text-base text-muted-foreground whitespace-nowrap">{verb.lemma.kana}</span>
                          </div>
                          <Badge variant={
                            verb.morphology.class === 'godan' ? 'default' :
                            verb.morphology.class === 'ichidan' ? 'secondary' : 'outline'
                          } className="text-xs shrink-0">
                            {verbGroupLabel(verb.morphology.class)}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-0 space-y-0">
                        {/* Meaning block */}
                        <div className="px-4 py-3 bg-muted/30">
                          <p className="font-medium text-base">{verb.meaning.primary}</p>
                        </div>

                        {/* Forms block - horizontal grid */}
                        <div className="grid grid-cols-2 gap-0 bg-muted/50">
                          <div className="px-4 py-3 border-r border-border/50">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-semibold text-base">{verb.forms.masu.kanji}</span>
                              <span className="text-xs text-muted-foreground">({verb.forms.masu.kana})</span>
                            </div>
                          </div>
                          <div className="px-4 py-3">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-semibold text-base">{verb.forms.te.kanji}</span>
                              <span className="text-xs text-muted-foreground">({verb.forms.te.kana})</span>
                            </div>
                          </div>
                        </div>

                        {/* Additional info block */}
                        <div className="px-4 py-2.5 bg-muted/20 flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            {renderValencyBadge(verb, false)}
                            {verb.valency.requiredParticles.length > 1 && (
                              <span className="text-xs text-muted-foreground">
                                {verb.valency.requiredParticles.slice(1).join('/')}
                              </span>
                            )}
                          </div>
                          {verb.meaning.gloss.length > 1 && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                +{verb.meaning.gloss.length - 1} more
                              </summary>
                              <ul className="mt-1 space-y-0.5 pl-3 list-disc text-muted-foreground absolute bg-popover border rounded-md shadow-lg p-2 z-10 min-w-[200px]">
                                {verb.meaning.gloss.slice(1, 4).map((m, i) => (
                                  <li key={i}>{m}</li>
                                ))}
                              </ul>
                            </details>
                          )}
                        </div>

                        {/* Examples Section */}
                        {verb.examples && verb.examples.masu.length > 0 && (
                          <div className="px-4 py-3 bg-background border-t">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <BookText className="h-4 w-4 text-primary" />
                                <p className="text-sm font-semibold text-primary">Masu Examples ({verb.examples.masu.length})</p>
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
                                {verb.examples.masu.map((example, idx) => (
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
                                          {example.jp}
                                        </p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                          {example.en}
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

                        {/* Usage Patterns Section */}
                        {verb.usagePatterns && verb.usagePatterns.length > 0 && (
                          <div className="px-4 py-3 bg-background border-t">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-blue-500" />
                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Common Usage Patterns ({verb.usagePatterns.length})</p>
                              </div>
                              <button
                                onClick={(e) => toggleUsagePatternsExpansion(verb.id, e)}
                                className="p-1.5 rounded-full hover:bg-accent transition-colors"
                                title={expandedUsagePatterns.has(verb.id) ? "Hide patterns" : "Show patterns"}
                              >
                                {expandedUsagePatterns.has(verb.id) ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>

                            {expandedUsagePatterns.has(verb.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-2"
                              >
                                {verb.usagePatterns.map((pattern, idx) => (
                                  <div
                                    key={idx}
                                    className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 space-y-1"
                                  >
                                    <div className="flex items-start gap-2">
                                      <Badge variant="outline" className="text-xs shrink-0 mt-0.5 bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700">
                                        {idx + 1}
                                      </Badge>
                                      <div className="space-y-0.5 flex-1">
                                        <p className="text-sm font-medium leading-relaxed text-foreground">
                                          {pattern.jp}
                                        </p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                          {pattern.en}
                                        </p>
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
          {examplesPopup && (() => {
            const formType = examplesPopup.formType || selectedExampleForm
            const examples = formType === 'dict'
              ? examplesPopup.verb.examples.dictionary
              : formType === 'te'
              ? examplesPopup.verb.examples.te
              : examplesPopup.verb.examples.masu

            return examples && examples.length > 0 && (
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
                  className="fixed z-50 w-[95vw] sm:w-[420px] max-w-[420px]"
                  style={{
                    left: typeof window !== 'undefined' && window.innerWidth < 640 ? '2.5vw' : `${examplesPopup.position.x}px`,
                    top: `${examplesPopup.position.y}px`
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Card className="shadow-2xl border-2 bg-background">
                    <CardHeader className="pb-2 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BookText className="h-4 w-4 text-primary" />
                          <CardTitle className="text-base">
                            {examplesPopup.verb.lemma.kanji}
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
                      {/* Form Selector Tabs */}
                      <div className="flex gap-1 p-1 bg-muted rounded-lg">
                        <button
                          onClick={() => setExamplesPopup({...examplesPopup, formType: 'masu'})}
                          className={cn(
                            "flex-1 px-2 py-1 text-xs font-medium rounded transition-colors",
                            formType === 'masu'
                              ? "bg-background shadow-sm text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Masu Form
                        </button>
                        <button
                          onClick={() => setExamplesPopup({...examplesPopup, formType: 'dict'})}
                          className={cn(
                            "flex-1 px-2 py-1 text-xs font-medium rounded transition-colors",
                            formType === 'dict'
                              ? "bg-background shadow-sm text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Dict Form
                        </button>
                        <button
                          onClick={() => setExamplesPopup({...examplesPopup, formType: 'te'})}
                          className={cn(
                            "flex-1 px-2 py-1 text-xs font-medium rounded transition-colors",
                            formType === 'te'
                              ? "bg-background shadow-sm text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Te Form
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-[400px] overflow-y-auto pb-3">
                      {examples.map((example, idx) => (
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
                                {examplesPopup.showKana ? example.kana : example.jp}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {example.en}
                              </p>
                              <div className="flex gap-1 flex-wrap">
                                {example.highlight && (
                                  <Badge variant="secondary" className="text-xs">
                                    {example.highlight}
                                  </Badge>
                                )}
                                {example.pattern && (
                                  <Badge variant="outline" className="text-xs">
                                    {example.pattern}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )
          })()}
        </AnimatePresence>

        {/* Usage Patterns Popup */}
        <AnimatePresence>
          {usagePatternsPopup && usagePatternsPopup.verb.usagePatterns && usagePatternsPopup.verb.usagePatterns.length > 0 && (
            <>
              {/* Backdrop to close popup when clicking outside */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setUsagePatternsPopup(null)}
              />

              {/* Popup Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="fixed z-50 w-[95vw] sm:w-[420px] max-w-[420px]"
                style={{
                  left: typeof window !== 'undefined' && window.innerWidth < 640 ? '2.5vw' : `${usagePatternsPopup.position.x}px`,
                  top: `${usagePatternsPopup.position.y}px`
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="shadow-2xl border-2 border-blue-500 bg-background">
                  <CardHeader className="pb-2 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        <CardTitle className="text-base text-blue-600 dark:text-blue-400">
                          {usagePatternsPopup.verb.lemma.kanji} — Common Usage Patterns
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUsagePatternsPopup(null)}
                        className="h-6 w-6 p-0"
                      >
                        <EyeOff className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-[400px] overflow-y-auto pb-3">
                    {usagePatternsPopup.verb.usagePatterns.map((pattern, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 space-y-1"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {pattern.jp}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pattern.en}
                        </p>
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
