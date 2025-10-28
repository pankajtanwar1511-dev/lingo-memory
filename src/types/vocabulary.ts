export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1"

export interface Example {
  japanese: string
  hiragana?: string
  english: string
  audioUrl?: string
  source: {
    type: "tatoeba" | "jmdict" | "custom"
    id?: string | number
  }
}

export interface VocabularyCard {
  id: string
  kanji?: string
  kana: string
  meaning: string | string[]
  examples: Example[]
  audioUrl?: string
  imageUrl?: string
  tags?: string[]
  jlptLevel?: JLPTLevel
  partOfSpeech?: string[]
  license?: {
    text: string
    url?: string
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface SRSData {
  ease: number // Default 2.5
  interval: number // In days
  repetitions: number
  lastReviewed?: Date
  nextReview?: Date
  lapses?: number
  totalReviews?: number
}

export interface StudyCard extends VocabularyCard {
  srsData: SRSData
}

export interface Deck {
  id: string
  name: string
  description?: string
  jlptLevel?: JLPTLevel
  cards: VocabularyCard[]
  visibility: "private" | "public" | "shared"
  premiumOnly?: boolean
  credits?: {
    author?: string
    sources: string[]
  }
  createdAt: Date
  updatedAt: Date
}

export interface StudySession {
  id: string
  deckId: string
  startedAt: Date
  completedAt?: Date
  cardsStudied: number
  correctAnswers: number
  averageResponseTime: number // in seconds
  mode: "flashcard" | "quiz" | "typing"
}

export interface UserProgress {
  userId: string
  totalCardsLearned: number
  totalReviews: number
  currentStreak: number
  longestStreak: number
  jlptProgress: Record<JLPTLevel, number> // percentage for each level
  studySessions: StudySession[]
}