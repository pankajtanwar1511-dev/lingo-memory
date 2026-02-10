export interface DlingoWord {
  id: string
  japanese: string
  english: string
  type: WordType
  subtype?: string // For "other" category: conjunction, copula, interjection, determiner
  exampleSentences?: Array<{
    japanese: string
    english: string
    context?: 'statement' | 'question' | 'answer'
    relatedTip?: string
    level?: string // e.g., "1-1", "2-4", "3-15"
    isAIGenerated?: boolean // false for Duolingo examples, true for AI-generated
  }>
}

export type WordType =
  | 'verb'
  | 'noun'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'particle'
  | 'counter'
  | 'pronoun'
  | 'other'

export type LearningDirection = 'en-to-jp' | 'jp-to-en'

export const WORD_TYPE_LABELS: Record<WordType, string> = {
  verb: 'Verb',
  noun: 'Noun',
  adjective: 'Adjective',
  adverb: 'Adverb',
  phrase: 'Phrase',
  particle: 'Particle',
  counter: 'Counter',
  pronoun: 'Pronoun',
  other: 'Other'
}
