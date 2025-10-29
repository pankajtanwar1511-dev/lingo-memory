/**
 * Pilot N5 Vocabulary Dataset (Updated to match actual schema)
 *
 * 20 high-frequency N5 words selected for beta testing
 * persona-based example generation.
 */

import { VocabularyCard } from "@/types/vocabulary"

const DEFAULT_LICENSE = {
  text: "CC BY-SA 4.0",
  url: "https://creativecommons.org/licenses/by-sa/4.0/"
}

const DEFAULT_SOURCE = {
  type: "pilot-dataset",
  url: "https://lingomemory.com"
}

export const pilotN5Words: VocabularyCard[] = [
  // Daily life verbs
  {
    id: "pilot_001",
    kanji: "起きる",
    kana: "おきる",
    romaji: "okiru",
    meaning: ["to wake up", "to get up"],
    jlptLevel: "N5",
    partOfSpeech: ["verb", "ichidan"],
    tags: ["verb", "daily routine", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
  {
    id: "pilot_002",
    kanji: "寝る",
    kana: "ねる",
    romaji: "neru",
    meaning: ["to sleep", "to go to bed"],
    jlptLevel: "N5",
    partOfSpeech: ["verb", "ichidan"],
    tags: ["verb", "daily routine", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
  {
    id: "pilot_003",
    kanji: "勉強する",
    kana: "べんきょうする",
    romaji: "benkyousuru",
    meaning: ["to study"],
    jlptLevel: "N5",
    partOfSpeech: ["verb", "suru-verb"],
    tags: ["verb", "education", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
  {
    id: "pilot_004",
    kanji: "働く",
    kana: "はたらく",
    romaji: "hataraku",
    meaning: ["to work"],
    jlptLevel: "N5",
    partOfSpeech: ["verb", "godan"],
    tags: ["verb", "work", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
  {
    id: "pilot_005",
    kanji: "買う",
    kana: "かう",
    romaji: "kau",
    meaning: ["to buy"],
    jlptLevel: "N5",
    partOfSpeech: ["verb", "godan"],
    tags: ["verb", "shopping", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },

  // Time expressions
  {
    id: "pilot_006",
    kanji: "毎朝",
    kana: "まいあさ",
    romaji: "maiasa",
    meaning: ["every morning"],
    jlptLevel: "N5",
    partOfSpeech: ["noun", "temporal"],
    tags: ["noun", "time", "frequency", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
  {
    id: "pilot_007",
    kanji: "週末",
    kana: "しゅうまつ",
    romaji: "shuumatsu",
    meaning: ["weekend"],
    jlptLevel: "N5",
    partOfSpeech: ["noun", "temporal"],
    tags: ["noun", "time", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
  {
    id: "pilot_008",
    kanji: "昨日",
    kana: "きのう",
    romaji: "kinou",
    meaning: ["yesterday"],
    jlptLevel: "N5",
    partOfSpeech: ["noun", "temporal"],
    tags: ["noun", "time", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },

  // Common adjectives
  {
    id: "pilot_009",
    kanji: "楽しい",
    kana: "たのしい",
    romaji: "tanoshii",
    meaning: ["fun", "enjoyable"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    tags: ["adjective", "emotion", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
  {
    id: "pilot_010",
    kanji: "忙しい",
    kana: "いそがしい",
    romaji: "isogashii",
    meaning: ["busy"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    tags: ["adjective", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
  {
    id: "pilot_011",
    kanji: "暑い",
    kana: "あつい",
    romaji: "atsui",
    meaning: ["hot (weather)"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    tags: ["adjective", "weather", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
  {
    id: "pilot_012",
    kanji: "寒い",
    kana: "さむい",
    romaji: "samui",
    meaning: ["cold (weather)"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    tags: ["adjective", "weather", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },

  // Places and locations
  {
    id: "pilot_013",
    kanji: "会社",
    kana: "かいしゃ",
    romaji: "kaisha",
    meaning: ["company", "office"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    tags: ["noun", "work", "place", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
  {
    id: "pilot_014",
    kanji: "図書館",
    kana: "としょかん",
    romaji: "toshokan",
    meaning: ["library"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    tags: ["noun", "education", "place", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
  {
    id: "pilot_015",
    kanji: "公園",
    kana: "こうえん",
    romaji: "kouen",
    meaning: ["park"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    tags: ["noun", "place", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },

  // Food and daily items
  {
    id: "pilot_016",
    kanji: "朝ごはん",
    kana: "あさごはん",
    romaji: "asagohan",
    meaning: ["breakfast"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    tags: ["noun", "food", "daily life", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
  {
    id: "pilot_017",
    kana: "コーヒー",
    romaji: "koohii",
    meaning: ["coffee"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    tags: ["noun", "food", "drink", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },

  // Social and hobbies
  {
    id: "pilot_018",
    kanji: "遊ぶ",
    kana: "あそぶ",
    romaji: "asobu",
    meaning: ["to play", "to hang out"],
    jlptLevel: "N5",
    partOfSpeech: ["verb", "godan"],
    tags: ["verb", "social", "hobby", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
  {
    id: "pilot_019",
    kanji: "話す",
    kana: "はなす",
    romaji: "hanasu",
    meaning: ["to speak", "to talk"],
    jlptLevel: "N5",
    partOfSpeech: ["verb", "godan"],
    tags: ["verb", "communication", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
  {
    id: "pilot_020",
    kanji: "音楽",
    kana: "おんがく",
    romaji: "ongaku",
    meaning: ["music"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    tags: ["noun", "hobby", "entertainment", "common"],
    examples: [],
    source: DEFAULT_SOURCE,
    license: DEFAULT_LICENSE,
  },
]

/**
 * Metadata about the pilot dataset
 */
export const pilotDatasetMetadata = {
  id: "pilot_n5_persona_generation",
  name: "Pilot N5 Persona Generation Dataset",
  description:
    "20 high-frequency N5 words for testing persona-based example generation",
  version: "1.1.0",
  schemaVersion: "actual-production",
  createdAt: new Date("2025-10-29"),
  updatedAt: new Date("2025-10-29"),
  wordCount: 20,
  categories: {
    verbs: 7,
    nouns: 10,
    adjectives: 4,
  },
  contexts: [
    "daily routine",
    "work",
    "education",
    "social",
    "time",
    "weather",
    "food",
  ],
  purpose: "Beta testing for persona-based example generation system",
  notes: "Updated to match actual production schema with romaji, proper license structure, and source metadata"
}

/**
 * Get pilot words by category
 */
export function getPilotWordsByCategory(category: string): VocabularyCard[] {
  return pilotN5Words.filter((word) => word.tags?.includes(category))
}

/**
 * Get pilot words by part of speech
 */
export function getPilotWordsByPartOfSpeech(
  pos: string
): VocabularyCard[] {
  return pilotN5Words.filter((word) =>
    word.partOfSpeech?.some((p) => p.includes(pos))
  )
}

/**
 * Export individual word groups for targeted testing
 */
export const pilotVerbs = getPilotWordsByPartOfSpeech("verb")
export const pilotNouns = getPilotWordsByPartOfSpeech("noun")
export const pilotAdjectives = getPilotWordsByPartOfSpeech("adjective")
export const pilotTimeWords = getPilotWordsByCategory("time")
export const pilotWorkWords = getPilotWordsByCategory("work")
export const pilotEducationWords = getPilotWordsByCategory("education")
