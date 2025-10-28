/**
 * Tatoeba Parser Service
 *
 * Parses Tatoeba corpus TSV files and creates searchable index
 *
 * Data Format:
 * - sentences.tsv: [id, lang, text]
 * - links.tsv: [sentence_id, translation_id]
 *
 * License: CC BY 2.0 FR
 * Source: https://tatoeba.org/en/downloads
 */

import {
  TatoebaSentence,
  TatoebaLink,
  TatoebaSentencePair,
  TatoebaCorpusIndex,
} from '@/types/tatoeba'

export class TatoebaParserService {
  /**
   * Parse sentences from TSV line
   * Format: sentence_id\tlang\ttext
   */
  parseSentenceLine(line: string): TatoebaSentence | null {
    const parts = line.split('\t')
    if (parts.length < 3) return null

    const [idStr, lang, text] = parts
    const id = parseInt(idStr, 10)

    if (isNaN(id) || !text) return null

    return {
      id,
      lang,
      text: text.trim(),
    }
  }

  /**
   * Parse link from TSV line
   * Format: sentence_id\ttranslation_id
   */
  parseLinkLine(line: string): TatoebaLink | null {
    const parts = line.split('\t')
    if (parts.length < 2) return null

    const [sentenceIdStr, translationIdStr] = parts
    const sentenceId = parseInt(sentenceIdStr, 10)
    const translationId = parseInt(translationIdStr, 10)

    if (isNaN(sentenceId) || isNaN(translationId)) return null

    return {
      sentenceId,
      translationId,
    }
  }

  /**
   * Parse sentences TSV file
   */
  parseSentencesFile(content: string, lang?: string): TatoebaSentence[] {
    const lines = content.split('\n')
    const sentences: TatoebaSentence[] = []

    for (const line of lines) {
      if (!line.trim()) continue

      const sentence = this.parseSentenceLine(line)
      if (sentence && (!lang || sentence.lang === lang)) {
        sentences.push(sentence)
      }
    }

    return sentences
  }

  /**
   * Parse links TSV file
   */
  parseLinksFile(content: string): TatoebaLink[] {
    const lines = content.split('\n')
    const links: TatoebaLink[] = []

    for (const line of lines) {
      if (!line.trim()) continue

      const link = this.parseLinkLine(line)
      if (link) {
        links.push(link)
      }
    }

    return links
  }

  /**
   * Build word index for fast lookups
   * Maps each word to sentence IDs containing it
   */
  buildWordIndex(sentences: TatoebaSentence[]): Map<string, number[]> {
    const wordIndex = new Map<string, number[]>()

    for (const sentence of sentences) {
      // Extract all possible word matches from sentence
      const words = this.extractWords(sentence.text)

      for (const word of words) {
        const sentenceIds = wordIndex.get(word) || []
        sentenceIds.push(sentence.id)
        wordIndex.set(word, sentenceIds)
      }
    }

    return wordIndex
  }

  /**
   * Extract searchable words from Japanese text
   * Includes:
   * - Individual characters
   * - 2-char sequences
   * - 3-char sequences
   * - Full words (space-separated if applicable)
   */
  extractWords(text: string): string[] {
    const words = new Set<string>()
    const cleaned = text.trim()

    // Add full text
    words.add(cleaned)

    // Add individual characters
    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i]
      // Skip punctuation and spaces
      if (char.match(/[\s\p{P}]/u)) continue
      words.add(char)
    }

    // Add 2-character sequences
    for (let i = 0; i < cleaned.length - 1; i++) {
      const seq = cleaned.slice(i, i + 2)
      if (!seq.match(/[\s\p{P}]/u)) {
        words.add(seq)
      }
    }

    // Add 3-character sequences
    for (let i = 0; i < cleaned.length - 2; i++) {
      const seq = cleaned.slice(i, i + 3)
      if (!seq.match(/[\s\p{P}]/u)) {
        words.add(seq)
      }
    }

    // Add 4-character sequences
    for (let i = 0; i < cleaned.length - 3; i++) {
      const seq = cleaned.slice(i, i + 4)
      if (!seq.match(/[\s\p{P}]/u)) {
        words.add(seq)
      }
    }

    return Array.from(words)
  }

  /**
   * Build translation map
   * Maps Japanese sentence ID to English sentence IDs
   */
  buildTranslationMap(
    links: TatoebaLink[],
    jpnSentences: Set<number>,
    engSentences: Set<number>
  ): Map<number, number[]> {
    const translationMap = new Map<number, number[]>()

    for (const link of links) {
      // Only include if both sentences exist
      if (!jpnSentences.has(link.sentenceId) || !engSentences.has(link.translationId)) {
        continue
      }

      const translations = translationMap.get(link.sentenceId) || []
      translations.push(link.translationId)
      translationMap.set(link.sentenceId, translations)
    }

    return translationMap
  }

  /**
   * Build complete corpus index
   */
  buildCorpusIndex(
    jpnSentences: TatoebaSentence[],
    engSentences: TatoebaSentence[],
    links: TatoebaLink[]
  ): TatoebaCorpusIndex {
    console.log('Building corpus index...')

    // Build sentence maps
    const sentenceMap = new Map<number, TatoebaSentence>()
    const jpnIds = new Set<number>()
    const engIds = new Set<number>()

    for (const sentence of jpnSentences) {
      sentenceMap.set(sentence.id, sentence)
      jpnIds.add(sentence.id)
    }

    for (const sentence of engSentences) {
      sentenceMap.set(sentence.id, sentence)
      engIds.add(sentence.id)
    }

    console.log(`  Japanese sentences: ${jpnSentences.length}`)
    console.log(`  English sentences: ${engSentences.length}`)

    // Build translation map
    const translationMap = this.buildTranslationMap(links, jpnIds, engIds)
    console.log(`  Translations: ${translationMap.size}`)

    // Build word index (only for Japanese sentences)
    const wordIndex = this.buildWordIndex(jpnSentences)
    console.log(`  Word index entries: ${wordIndex.size}`)

    return {
      sentences: sentenceMap,
      translations: translationMap,
      wordIndex,
    }
  }

  /**
   * Get sentence pairs for Japanese sentence IDs
   */
  getSentencePairs(
    sentenceIds: number[],
    corpusIndex: TatoebaCorpusIndex
  ): TatoebaSentencePair[] {
    const pairs: TatoebaSentencePair[] = []

    for (const sentenceId of sentenceIds) {
      const jpnSentence = corpusIndex.sentences.get(sentenceId)
      if (!jpnSentence) continue

      const translationIds = corpusIndex.translations.get(sentenceId)
      if (!translationIds || translationIds.length === 0) continue

      // Use first translation (usually best quality)
      const engSentence = corpusIndex.sentences.get(translationIds[0])
      if (!engSentence) continue

      pairs.push({
        japanese: jpnSentence,
        english: engSentence,
      })
    }

    return pairs
  }

  /**
   * Export index to JSON for caching
   */
  exportIndexToJSON(index: TatoebaCorpusIndex): string {
    const exportData = {
      sentences: Array.from(index.sentences.entries()),
      translations: Array.from(index.translations.entries()),
      wordIndex: Array.from(index.wordIndex.entries()),
    }

    return JSON.stringify(exportData)
  }

  /**
   * Import index from JSON cache
   */
  importIndexFromJSON(json: string): TatoebaCorpusIndex {
    const data = JSON.parse(json)

    return {
      sentences: new Map(data.sentences),
      translations: new Map(data.translations),
      wordIndex: new Map(data.wordIndex),
    }
  }

  /**
   * Get corpus statistics
   */
  getCorpusStats(index: TatoebaCorpusIndex): {
    totalSentences: number
    japaneseSentences: number
    englishSentences: number
    translationPairs: number
    wordIndexSize: number
    averageTranslationsPerSentence: number
  } {
    let japaneseSentences = 0
    let englishSentences = 0

    for (const sentence of index.sentences.values()) {
      if (sentence.lang === 'jpn') japaneseSentences++
      if (sentence.lang === 'eng') englishSentences++
    }

    const translationPairs = index.translations.size
    const totalTranslations = Array.from(index.translations.values()).reduce(
      (sum, arr) => sum + arr.length,
      0
    )

    return {
      totalSentences: index.sentences.size,
      japaneseSentences,
      englishSentences,
      translationPairs,
      wordIndexSize: index.wordIndex.size,
      averageTranslationsPerSentence:
        translationPairs > 0 ? totalTranslations / translationPairs : 0,
    }
  }
}

/**
 * Create Tatoeba parser service
 */
export function createTatoebaParser(): TatoebaParserService {
  return new TatoebaParserService()
}
