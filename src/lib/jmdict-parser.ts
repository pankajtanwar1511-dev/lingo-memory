/**
 * JMdict Parser and Data Processor
 *
 * Processes JMdict XML/JSON data into VocabularyCard format
 * JMdict is a Japanese-Multilingual Dictionary database (https://www.edrdg.org/jmdict/j_jmdict.html)
 *
 * Features:
 * - Parse JMdict JSON format
 * - Extract JLPT level from tags
 * - Handle multiple readings and meanings
 * - Filter by JLPT level
 * - Generate unique IDs
 */

import { VocabularyCard, JLPTLevel, Example } from "@/types/vocabulary"

// JMdict JSON structure interfaces
interface JMdictKanji {
  text: string
  tags?: string[]
  priority?: string[]
}

interface JMdictReading {
  text: string
  tags?: string[]
  priority?: string[]
  restrict?: string[] // Restricts reading to specific kanji
  nokanji?: boolean
}

interface JMdictSense {
  gloss: Array<{ text: string; lang?: string }>
  partOfSpeech?: string[]
  field?: string[]
  misc?: string[]
  info?: string[]
  dialect?: string[]
}

interface JMdictEntry {
  id: string | number
  kanji?: JMdictKanji[]
  readings: JMdictReading[]
  senses: JMdictSense[]
}

// JLPT level detection from tags
const JLPT_TAG_MAP: Record<string, JLPTLevel> = {
  "jlpt-n5": "N5",
  "jlpt-n4": "N4",
  "jlpt-n3": "N3",
  "jlpt-n2": "N2",
  "jlpt-n1": "N1",
  "n5": "N5",
  "n4": "N4",
  "n3": "N3",
  "n2": "N2",
  "n1": "N1"
}

/**
 * Extract JLPT level from tags array
 */
function extractJLPTLevel(tags?: string[]): JLPTLevel | undefined {
  if (!tags) return undefined

  for (const tag of tags) {
    const normalized = tag.toLowerCase().trim()
    if (JLPT_TAG_MAP[normalized]) {
      return JLPT_TAG_MAP[normalized]
    }
  }

  return undefined
}

/**
 * Generate vocabulary ID from entry
 */
function generateVocabId(entry: JMdictEntry, jlptLevel?: JLPTLevel): string {
  const prefix = jlptLevel?.toLowerCase() || "vocab"
  const entryId = String(entry.id).padStart(6, "0")
  return `${prefix}_${entryId}`
}

/**
 * Extract part of speech tags
 */
function extractPartOfSpeech(senses: JMdictSense[]): string[] {
  const posSet = new Set<string>()

  for (const sense of senses) {
    if (sense.partOfSpeech) {
      sense.partOfSpeech.forEach(pos => posSet.add(pos))
    }
  }

  return Array.from(posSet)
}

/**
 * Extract all tags from entry
 */
function extractTags(entry: JMdictEntry): string[] {
  const tags = new Set<string>()

  // Add kanji tags
  entry.kanji?.forEach(k => k.tags?.forEach(t => tags.add(t)))

  // Add reading tags
  entry.readings?.forEach(r => r.tags?.forEach(t => tags.add(t)))

  // Add sense fields and misc tags
  entry.senses?.forEach(s => {
    s.field?.forEach(f => tags.add(f))
    s.misc?.forEach(m => tags.add(m))
  })

  return Array.from(tags)
}

/**
 * Convert JMdict entry to VocabularyCard
 */
export function parseJMdictEntry(entry: JMdictEntry): VocabularyCard {
  // Get primary kanji (first one or most common)
  const primaryKanji = entry.kanji?.[0]?.text

  // Get primary reading (first hiragana reading)
  const primaryReading = entry.readings[0]?.text

  // Extract meanings from all senses (English only)
  const meanings = entry.senses
    .flatMap(sense =>
      sense.gloss
        .filter(g => !g.lang || g.lang === "eng")
        .map(g => g.text)
    )

  // Get JLPT level from tags
  const allTags = extractTags(entry)
  const jlptLevel = extractJLPTLevel(allTags)

  // Get part of speech
  const partOfSpeech = extractPartOfSpeech(entry.senses)

  // Generate ID
  const id = generateVocabId(entry, jlptLevel)

  return {
    id,
    kanji: primaryKanji,
    kana: primaryReading,
    meaning: meanings.join("; "),
    examples: [], // JMdict doesn't include examples, use Tatoeba integration
    tags: allTags.filter(t => !t.toLowerCase().includes("jlpt")), // Remove JLPT tags (stored separately)
    jlptLevel,
    partOfSpeech,
    license: {
      text: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

/**
 * Parse multiple JMdict entries
 */
export function parseJMdictEntries(entries: JMdictEntry[]): VocabularyCard[] {
  return entries.map(parseJMdictEntry)
}

/**
 * Filter entries by JLPT level
 */
export function filterByJLPTLevel(
  cards: VocabularyCard[],
  level: JLPTLevel
): VocabularyCard[] {
  return cards.filter(card => card.jlptLevel === level)
}

/**
 * Parse JMdict JSON file
 */
export async function parseJMdictJSON(jsonData: JMdictEntry[]): Promise<VocabularyCard[]> {
  return parseJMdictEntries(jsonData)
}

/**
 * Load and parse JMdict JSON from URL
 */
export async function loadJMdictFromURL(url: string): Promise<VocabularyCard[]> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch JMdict: ${response.statusText}`)
    }

    const data = await response.json() as JMdictEntry[]
    return parseJMdictJSON(data)
  } catch (error) {
    console.error("Error loading JMdict:", error)
    throw error
  }
}

/**
 * Load and parse JMdict JSON from file (Node.js environment)
 */
export async function loadJMdictFromFile(filePath: string): Promise<VocabularyCard[]> {
  try {
    // This would work in Node.js environment
    const fs = await import("fs/promises")
    const fileContent = await fs.readFile(filePath, "utf-8")
    const data: JMdictEntry[] = JSON.parse(fileContent)
    return parseJMdictJSON(data)
  } catch (error) {
    console.error("Error loading JMdict from file:", error)
    throw error
  }
}

/**
 * Statistics about parsed vocabulary
 */
export interface VocabularyStats {
  total: number
  byJLPT: Record<JLPTLevel, number>
  byPartOfSpeech: Record<string, number>
  withKanji: number
  withExamples: number
}

/**
 * Calculate statistics for vocabulary cards
 */
export function calculateVocabularyStats(cards: VocabularyCard[]): VocabularyStats {
  const stats: VocabularyStats = {
    total: cards.length,
    byJLPT: { N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 },
    byPartOfSpeech: {},
    withKanji: 0,
    withExamples: 0
  }

  for (const card of cards) {
    // Count by JLPT level
    if (card.jlptLevel) {
      stats.byJLPT[card.jlptLevel]++
    }

    // Count by part of speech
    if (card.partOfSpeech) {
      for (const pos of card.partOfSpeech) {
        stats.byPartOfSpeech[pos] = (stats.byPartOfSpeech[pos] || 0) + 1
      }
    }

    // Count with kanji
    if (card.kanji) {
      stats.withKanji++
    }

    // Count with examples
    if (card.examples && card.examples.length > 0) {
      stats.withExamples++
    }
  }

  return stats
}
