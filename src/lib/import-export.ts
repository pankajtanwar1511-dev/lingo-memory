/**
 * Import/Export Utilities
 *
 * Handles importing and exporting vocabulary data in various formats:
 * - CSV (Anki-compatible)
 * - JSON (native format)
 * - TSV (tab-separated values)
 *
 * Features:
 * - Anki deck format support
 * - Batch import/export
 * - Data validation
 * - Error handling
 */

import { VocabularyCard, Deck, JLPTLevel, Example } from "@/types/vocabulary"

/**
 * CSV field delimiter options
 */
export type CSVDelimiter = "," | "\t" | "|"

/**
 * Export format options
 */
export interface ExportOptions {
  delimiter?: CSVDelimiter
  includeHeader?: boolean
  ankiFormat?: boolean // Use Anki-compatible format
  includeExamples?: boolean
  includeTags?: boolean
}

/**
 * Import options
 */
export interface ImportOptions {
  delimiter?: CSVDelimiter
  hasHeader?: boolean
  skipInvalidRows?: boolean
  defaultJLPTLevel?: JLPTLevel
}

/**
 * Import result
 */
export interface ImportResult {
  success: number
  failed: number
  cards: VocabularyCard[]
  errors: Array<{ row: number; error: string }>
}

/**
 * Escape CSV field
 */
function escapeCSVField(field: string, delimiter: CSVDelimiter = ","): string {
  if (field.includes(delimiter) || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

/**
 * Parse CSV field
 */
function parseCSVField(field: string): string {
  field = field.trim()
  if (field.startsWith('"') && field.endsWith('"')) {
    return field.slice(1, -1).replace(/""/g, '"')
  }
  return field
}

/**
 * Convert VocabularyCard to CSV row (Anki format)
 * Format: kanji/kana, meaning, example_ja, example_en, tags, jlpt_level
 */
export function vocabularyToCSV(
  card: VocabularyCard,
  options: ExportOptions = {}
): string {
  const {
    delimiter = ",",
    ankiFormat = true,
    includeExamples = true,
    includeTags = true
  } = options

  const fields: string[] = []

  if (ankiFormat) {
    // Anki front field: kanji (kana) or just kana if no kanji
    const front = card.kanji
      ? `${card.kanji} (${card.kana})`
      : card.kana
    fields.push(escapeCSVField(front, delimiter))

    // Anki back field: meaning
    const meaning = Array.isArray(card.meaning)
      ? card.meaning.join("; ")
      : card.meaning
    fields.push(escapeCSVField(meaning, delimiter))

    // Example sentence (Japanese)
    if (includeExamples && card.examples.length > 0) {
      const exampleJa = card.examples[0].japanese || ""
      const exampleEn = card.examples[0].english || ""
      fields.push(escapeCSVField(exampleJa, delimiter))
      fields.push(escapeCSVField(exampleEn, delimiter))
    } else {
      fields.push("")
      fields.push("")
    }

    // Tags
    if (includeTags) {
      const tags = [
        ...(card.tags || []),
        ...(card.jlptLevel ? [card.jlptLevel] : []),
        ...(card.partOfSpeech || [])
      ].join(" ")
      fields.push(escapeCSVField(tags, delimiter))
    }
  } else {
    // Standard format: all fields
    fields.push(card.id)
    fields.push(escapeCSVField(card.kanji || "", delimiter))
    fields.push(escapeCSVField(card.kana, delimiter))
    fields.push(escapeCSVField(
      Array.isArray(card.meaning) ? card.meaning.join("; ") : card.meaning,
      delimiter
    ))
    fields.push(escapeCSVField(card.jlptLevel || "", delimiter))
    fields.push(escapeCSVField((card.partOfSpeech || []).join(";"), delimiter))
    fields.push(escapeCSVField((card.tags || []).join(";"), delimiter))

    if (includeExamples && card.examples.length > 0) {
      const examplesJson = JSON.stringify(card.examples)
      fields.push(escapeCSVField(examplesJson, delimiter))
    } else {
      fields.push("")
    }
  }

  return fields.join(delimiter)
}

/**
 * Convert array of VocabularyCards to CSV string
 */
export function exportToCSV(
  cards: VocabularyCard[],
  options: ExportOptions = {}
): string {
  const {
    includeHeader = true,
    ankiFormat = true
  } = options

  const lines: string[] = []

  // Add header
  if (includeHeader) {
    if (ankiFormat) {
      lines.push("Front,Back,Example (Japanese),Example (English),Tags")
    } else {
      lines.push("ID,Kanji,Kana,Meaning,JLPT Level,Part of Speech,Tags,Examples")
    }
  }

  // Add data rows
  for (const card of cards) {
    lines.push(vocabularyToCSV(card, options))
  }

  return lines.join("\n")
}

/**
 * Parse CSV row to VocabularyCard
 */
function parseCSVRow(
  row: string,
  rowIndex: number,
  options: ImportOptions = {}
): VocabularyCard | null {
  const { delimiter = ",", defaultJLPTLevel } = options

  // Split by delimiter, handling quoted fields
  const fields: string[] = []
  let currentField = ""
  let insideQuotes = false

  for (let i = 0; i < row.length; i++) {
    const char = row[i]

    if (char === '"') {
      if (insideQuotes && row[i + 1] === '"') {
        currentField += '"'
        i++ // Skip next quote
      } else {
        insideQuotes = !insideQuotes
      }
    } else if (char === delimiter && !insideQuotes) {
      fields.push(parseCSVField(currentField))
      currentField = ""
    } else {
      currentField += char
    }
  }
  fields.push(parseCSVField(currentField))

  // Validate minimum fields
  if (fields.length < 2) {
    return null
  }

  // Parse front field (kanji/kana)
  const frontField = fields[0]
  let kanji: string | undefined
  let kana: string

  // Check if format is "kanji (kana)"
  const match = frontField.match(/^(.+?)\s*\((.+?)\)$/)
  if (match) {
    kanji = match[1].trim()
    kana = match[2].trim()
  } else {
    kana = frontField.trim()
  }

  // Parse meaning
  const meaning = fields[1]

  // Parse example sentences
  const examples: Example[] = []
  if (fields.length >= 4 && fields[2] && fields[3]) {
    examples.push({
      japanese: fields[2],
      english: fields[3],
      source: { type: "custom" }
    })
  }

  // Parse tags and JLPT level
  const tags: string[] = []
  let jlptLevel: JLPTLevel | undefined = defaultJLPTLevel
  let partOfSpeech: string[] = []

  if (fields.length >= 5 && fields[4]) {
    const tagParts = fields[4].split(/\s+/)
    for (const tag of tagParts) {
      const upper = tag.toUpperCase()
      if (upper === "N5" || upper === "N4" || upper === "N3" || upper === "N2" || upper === "N1") {
        jlptLevel = upper as JLPTLevel
      } else if (tag) {
        tags.push(tag)
      }
    }
  }

  // Generate ID
  const id = `imported_${Date.now()}_${rowIndex}`

  return {
    id,
    kanji,
    kana,
    meaning,
    examples,
    tags,
    jlptLevel,
    partOfSpeech,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

/**
 * Import vocabulary cards from CSV string
 */
export function importFromCSV(
  csvContent: string,
  options: ImportOptions = {}
): ImportResult {
  const { hasHeader = true, skipInvalidRows = true } = options

  const result: ImportResult = {
    success: 0,
    failed: 0,
    cards: [],
    errors: []
  }

  const lines = csvContent.split(/\r?\n/)
  const startIndex = hasHeader ? 1 : 0

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue // Skip empty lines

    try {
      const card = parseCSVRow(line, i, options)
      if (card) {
        result.cards.push(card)
        result.success++
      } else if (!skipInvalidRows) {
        result.failed++
        result.errors.push({
          row: i + 1,
          error: "Invalid row format"
        })
      }
    } catch (error) {
      result.failed++
      result.errors.push({
        row: i + 1,
        error: error instanceof Error ? error.message : "Unknown error"
      })

      if (!skipInvalidRows) {
        break
      }
    }
  }

  return result
}

/**
 * Export deck to JSON
 */
export function exportDeckToJSON(deck: Deck): string {
  return JSON.stringify(deck, null, 2)
}

/**
 * Export vocabulary cards to JSON
 */
export function exportCardsToJSON(cards: VocabularyCard[]): string {
  return JSON.stringify(cards, null, 2)
}

/**
 * Import deck from JSON
 */
export function importDeckFromJSON(jsonContent: string): Deck {
  try {
    const deck = JSON.parse(jsonContent) as Deck
    // Validate required fields
    if (!deck.id || !deck.name || !deck.cards) {
      throw new Error("Invalid deck format: missing required fields")
    }
    return deck
  } catch (error) {
    throw new Error(`Failed to import deck: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Import vocabulary cards from JSON
 */
export function importCardsFromJSON(jsonContent: string): VocabularyCard[] {
  try {
    const cards = JSON.parse(jsonContent) as VocabularyCard[]
    if (!Array.isArray(cards)) {
      throw new Error("Invalid format: expected array of cards")
    }
    return cards
  } catch (error) {
    throw new Error(`Failed to import cards: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Download data as file (browser only)
 */
export function downloadFile(content: string, filename: string, mimeType: string = "text/plain") {
  if (typeof window === "undefined") {
    throw new Error("downloadFile can only be used in browser environment")
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Read file content (browser only)
 */
export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

/**
 * Export vocabulary cards to CSV file (browser download)
 */
export function exportVocabularyToCSVFile(
  cards: VocabularyCard[],
  filename: string = "vocabulary.csv",
  options: ExportOptions = {}
) {
  const csvContent = exportToCSV(cards, options)
  downloadFile(csvContent, filename, "text/csv")
}

/**
 * Export deck to JSON file (browser download)
 */
export function exportDeckToJSONFile(
  deck: Deck,
  filename?: string
) {
  const jsonContent = exportDeckToJSON(deck)
  const name = filename || `${deck.name.toLowerCase().replace(/\s+/g, "-")}.json`
  downloadFile(jsonContent, name, "application/json")
}
