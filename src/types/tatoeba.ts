/**
 * Tatoeba Corpus Data Types
 *
 * Tatoeba is a collection of sentences and translations for language learning
 * License: CC BY 2.0 FR
 * Source: https://tatoeba.org
 */

export interface TatoebaSentence {
  id: number
  lang: string // 'jpn' for Japanese
  text: string
}

export interface TatoebaLink {
  sentenceId: number // Japanese sentence ID
  translationId: number // English sentence ID
}

export interface TatoebaSentencePair {
  japanese: TatoebaSentence
  english: TatoebaSentence
}

export interface SentenceMatch {
  sentence: TatoebaSentencePair
  score: number // Relevance score (0-100)
  matchType: 'exact' | 'kanji' | 'kana' // How it matched
  matchedWord: string // The word that matched
}

export interface SentenceMatchResult {
  cardId: string
  word: string
  matches: SentenceMatch[]
  totalFound: number
  topMatches: TatoebaSentencePair[] // Top 3 best matches
}

/**
 * Tatoeba corpus index for fast lookups
 */
export interface TatoebaCorpusIndex {
  sentences: Map<number, TatoebaSentence> // sentence ID → sentence
  translations: Map<number, number[]> // jpn sentence ID → eng sentence IDs
  wordIndex: Map<string, number[]> // word → sentence IDs containing it
}

/**
 * Quality metrics for sentence selection
 */
export interface SentenceQuality {
  score: number // 0-100
  length: number // Character count
  complexity: 'beginner' | 'intermediate' | 'advanced'
  hasTranslation: boolean
  isNatural: boolean // Heuristic
  hasDifficultGrammar: boolean
}
