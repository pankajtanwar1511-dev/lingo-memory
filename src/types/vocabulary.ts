export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1"

/**
 * Source types for example sentences
 * - tatoeba: From Tatoeba Project (CC BY 2.0)
 * - jmdict: From JMdict (CC BY-SA 4.0)
 * - custom: Manually created by team
 * - generated: AI-generated with persona
 */
export type ExampleSourceType = "tatoeba" | "jmdict" | "custom" | "generated"

/**
 * Base source information for all examples
 */
export interface BaseExampleSource {
  type: ExampleSourceType
  id?: string | number
}

/**
 * Source information for generated examples
 */
export interface GeneratedExampleSource extends BaseExampleSource {
  type: "generated"
  /** Persona that generated/spoke this example */
  persona: string // PersonaId
  /** Model used for generation */
  model: string
  /** When it was generated */
  generatedAt: string // ISO 8601 date
}

/**
 * Union type for all example sources
 */
export type ExampleSource = BaseExampleSource | GeneratedExampleSource

/**
 * Validation results from automated checks
 */
export interface ExampleValidation {
  /** Word appears in the example (kanji or kana) */
  tokenMatch: boolean
  /** Kana reading matches the sentence */
  kanaMatch: boolean
  /** Length is appropriate for JLPT level */
  lengthOk: boolean
  /** Overall automated quality score (0-1) */
  autoScore?: number
  /** Validation timestamp */
  validatedAt?: string
  /** Any validation errors or warnings */
  issues?: string[]
}

/**
 * Review information for generated examples
 */
export interface ExampleReview {
  /** User/reviewer who approved/rejected */
  reviewedBy: string
  /** When it was reviewed */
  reviewedAt: string
  /** Review decision */
  status: "approved" | "rejected" | "needs_revision"
  /** Optional reviewer comments */
  comments?: string
  /** Reviewer's quality rating (1-5) */
  rating?: number
}

/**
 * License information
 */
export interface License {
  text: string
  url: string
}

/**
 * Example sentence with metadata
 */
export interface Example {
  /** Japanese sentence (with kanji) */
  japanese: string
  /** Kana reading (matches your schema field name) */
  kana: string
  /** English translation */
  english: string
  /** Source of this example */
  source: ExampleSource
  /** License information */
  license: License
  /** Audio URL if available */
  audioUrl?: string
  /** Whether this example needs human review */
  needsReview?: boolean
  /** Review information (for generated examples) */
  review?: ExampleReview
  /** Automated validation results */
  validation?: ExampleValidation
}

/**
 * Audio information for vocabulary
 */
export interface VocabularyAudio {
  pronunciationUrl: string
  source: string
}

/**
 * Source information for vocabulary
 */
export interface VocabularySource {
  type: string
  url?: string
  id?: string
}

/**
 * Vocabulary Card matching your actual schema
 */
export interface VocabularyCard {
  id: string
  kanji?: string
  kana: string
  romaji?: string
  meaning: string[]
  jlptLevel: JLPTLevel
  partOfSpeech: string[]
  tags: string[]
  examples: Example[]
  audio?: VocabularyAudio
  source: VocabularySource
  license: License
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

// ─── Office Vocabulary Schema (v2) ───────────────────────────────────────────

export type OfficeTier = "S" | "A" | "B" | "C"

export type OfficeContext =
  | "standup"
  | "meeting"
  | "email"
  | "incident"
  | "1on1"
  | "hr"
  | "client"

export type OfficeCategory =
  | "verbs"
  | "meetings"
  | "project"
  | "incident"
  | "status"
  | "keigo"
  | "tech"
  | "time"
  | "hr"
  | "roles"
  | "communication"
  | "documents"

/**
 * A single example sentence (office vocabulary — no source/license overhead)
 */
export interface OfficeExample {
  japanese: string  // kanji form
  kana: string      // kana reading
  english: string   // English translation
}

/**
 * Office vocabulary card — structured fields instead of tag strings
 */
export interface OfficeCard {
  id: string
  kanji?: string         // kanji form (undefined for katakana-only words)
  kana: string           // kana reading (required)
  romaji?: string        // romaji transcription
  meaning: string[]      // English meanings (first = primary)
  partOfSpeech?: string[]
  active: boolean        // true = produce (write/speak), false = recognize only
  tier: OfficeTier       // S=daily, A=weekly, B=monthly, C=rare
  contexts: OfficeContext[]  // usage contexts
  category: OfficeCategory
  example?: OfficeExample    // one example sentence
}