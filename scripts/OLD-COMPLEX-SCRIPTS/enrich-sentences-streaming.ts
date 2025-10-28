#!/usr/bin/env ts-node
/**
 * Streaming Sentence Enrichment (Optimized for Large Corpora)
 *
 * Processes Tatoeba corpus in streaming mode to avoid memory issues
 * with 27M+ translation links.
 *
 * Strategy:
 * 1. Extract all vocabulary words from cards
 * 2. Stream Japanese sentences, find matches, remember IDs
 * 3. Stream links file, collect only matching sentence pairs
 * 4. Stream English sentences, get only needed translations
 * 5. Enrich cards with found examples
 *
 * Usage:
 *   npm run enrich:stream -- --cards data/n5-converted.json --corpus data/tatoeba --output data/n5-enriched.json
 */

import * as fs from 'fs'
import * as readline from 'readline'
import * as path from 'path'

interface VocabCard {
  id: string
  kanji?: string
  kana: string
  meaning: string
  examples?: any[]
  [key: string]: any
}

interface SentenceMatch {
  jpnId: number
  jpnText: string
  word: string
  score: number
}

interface TranslationPair {
  jpnId: number
  engId: number
}

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
}

function log(msg: string, color?: keyof typeof colors) {
  const c = color && colors[color] ? colors[color] : ''
  console.log(`${c}${msg}${colors.reset}`)
}

/**
 * Extract all unique vocabulary words from cards
 */
function extractVocabularyWords(cards: VocabCard[]): Set<string> {
  const words = new Set<string>()

  for (const card of cards) {
    // Add kana
    words.add(card.kana)

    // Add kanji if present
    if (card.kanji) {
      words.add(card.kanji)
    }

    // Add individual kanji characters for better matching
    if (card.kanji) {
      for (const char of card.kanji) {
        if (char !== ' ') {
          words.add(char)
        }
      }
    }
  }

  log(`✅ Extracted ${words.size} unique vocabulary words`, 'green')
  return words
}

/**
 * Stream Japanese sentences and find matches
 */
async function findMatchingSentences(
  jpnPath: string,
  vocabWords: Set<string>,
  maxLength: number = 25
): Promise<Map<number, SentenceMatch>> {
  log(`\n📖 Streaming Japanese sentences...`, 'cyan')

  const matches = new Map<number, SentenceMatch>()
  let processed = 0
  let matchCount = 0

  const fileStream = fs.createReadStream(jpnPath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  for await (const line of rl) {
    if (!line.trim()) continue

    const parts = line.split('\t')
    if (parts.length < 3) continue

    const [idStr, lang, text] = parts
    const id = parseInt(idStr, 10)

    if (isNaN(id) || !text) continue

    const trimmedText = text.trim()

    // Skip if too long
    if (trimmedText.length > maxLength) continue

    // Check if sentence contains any vocabulary words
    for (const word of vocabWords) {
      if (trimmedText.includes(word)) {
        // Calculate simple quality score
        const score = 100 - Math.min(trimmedText.length * 2, 50) // Shorter = better

        if (!matches.has(id) || matches.get(id)!.score < score) {
          matches.set(id, {
            jpnId: id,
            jpnText: trimmedText,
            word,
            score
          })
          matchCount++
        }
      }
    }

    processed++
    if (processed % 50000 === 0) {
      process.stdout.write(`\r  Processed: ${processed.toLocaleString()} sentences, Found: ${matchCount.toLocaleString()} matches`)
    }
  }

  process.stdout.write('\n')
  log(`✅ Found ${matches.size} matching Japanese sentences`, 'green')

  return matches
}

/**
 * Stream translation links and collect pairs for matching sentences
 */
async function findTranslationPairs(
  linksPath: string,
  jpnSentenceIds: Set<number>
): Promise<TranslationPair[]> {
  log(`\n🔗 Streaming translation links...`, 'cyan')

  const pairs: TranslationPair[] = []
  let processed = 0

  const fileStream = fs.createReadStream(linksPath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  for await (const line of rl) {
    if (!line.trim()) continue

    const parts = line.split('\t')
    if (parts.length < 2) continue

    const jpnId = parseInt(parts[0], 10)
    const engId = parseInt(parts[1], 10)

    if (isNaN(jpnId) || isNaN(engId)) continue

    // Only keep links for sentences we matched
    if (jpnSentenceIds.has(jpnId)) {
      pairs.push({ jpnId, engId })
    }

    processed++
    if (processed % 1000000 === 0) {
      process.stdout.write(`\r  Processed: ${(processed / 1000000).toFixed(1)}M links, Found: ${pairs.length.toLocaleString()} pairs`)
    }
  }

  process.stdout.write('\n')
  log(`✅ Found ${pairs.length} translation pairs`, 'green')

  return pairs
}

/**
 * Stream English sentences and get translations
 */
async function getEnglishTranslations(
  engPath: string,
  engIds: Set<number>
): Promise<Map<number, string>> {
  log(`\n🌐 Streaming English sentences...`, 'cyan')

  const translations = new Map<number, string>()
  let processed = 0

  const fileStream = fs.createReadStream(engPath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  for await (const line of rl) {
    if (!line.trim()) continue

    const parts = line.split('\t')
    if (parts.length < 3) continue

    const [idStr, lang, text] = parts
    const id = parseInt(idStr, 10)

    if (isNaN(id) || !text) continue

    // Only keep English sentences we need
    if (engIds.has(id)) {
      translations.set(id, text.trim())

      // Early exit if we found all translations
      if (translations.size === engIds.size) {
        break
      }
    }

    processed++
    if (processed % 50000 === 0) {
      process.stdout.write(`\r  Processed: ${processed.toLocaleString()} sentences, Found: ${translations.size}/${engIds.size}`)
    }
  }

  process.stdout.write('\n')
  log(`✅ Found ${translations.size} English translations`, 'green')

  return translations
}

/**
 * Enrich cards with found examples
 */
function enrichCards(
  cards: VocabCard[],
  jpnMatches: Map<number, SentenceMatch>,
  translationPairs: TranslationPair[],
  engTranslations: Map<number, string>,
  maxPerCard: number = 3
): VocabCard[] {
  log(`\n✨ Enriching cards with examples...`, 'cyan')

  // Build reverse lookup: jpnId -> engText
  const pairMap = new Map<number, string[]>()
  for (const pair of translationPairs) {
    const engText = engTranslations.get(pair.engId)
    if (engText) {
      if (!pairMap.has(pair.jpnId)) {
        pairMap.set(pair.jpnId, [])
      }
      pairMap.get(pair.jpnId)!.push(engText)
    }
  }

  let enrichedCount = 0
  let exampleCount = 0

  for (const card of cards) {
    const examples = []

    // Find all matching sentences for this card's words
    const cardWords = new Set([card.kana])
    if (card.kanji) {
      cardWords.add(card.kanji)
      // Add individual kanji characters for better matching
      for (const char of card.kanji) {
        if (char !== ' ') {
          cardWords.add(char)
        }
      }
    }

    const candidates: Array<{match: SentenceMatch, engText: string}> = []

    for (const [jpnId, match] of jpnMatches.entries()) {
      if (cardWords.has(match.word)) {
        const engTexts = pairMap.get(jpnId) || []
        for (const engText of engTexts) {
          candidates.push({ match, engText })
        }
      }
    }

    // Sort by score and take top N
    candidates.sort((a, b) => b.match.score - a.match.score)

    for (const candidate of candidates.slice(0, maxPerCard)) {
      examples.push({
        japanese: candidate.match.jpnText,
        english: candidate.engText,
        source: {
          type: 'tatoeba',
          id: candidate.match.jpnId
        }
      })
    }

    if (examples.length > 0) {
      card.examples = examples
      enrichedCount++
      exampleCount += examples.length
    }
  }

  log(`✅ Enriched ${enrichedCount}/${cards.length} cards with ${exampleCount} examples`, 'green')

  return cards
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)

  let cardsPath = 'data/n5-converted.json'
  let corpusPath = 'data/tatoeba'
  let outputPath = 'data/n5-enriched.json'
  let maxLength = 40
  let maxExamples = 3

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--cards') cardsPath = args[++i]
    else if (args[i] === '--corpus') corpusPath = args[++i]
    else if (args[i] === '--output') outputPath = args[++i]
    else if (args[i] === '--max-length') maxLength = parseInt(args[++i], 10)
    else if (args[i] === '--max') maxExamples = parseInt(args[++i], 10)
  }

  log('🚀 Streaming Sentence Enrichment', 'cyan')
  log(`   Cards: ${cardsPath}`)
  log(`   Corpus: ${corpusPath}`)
  log(`   Output: ${outputPath}`)
  log(`   Max length: ${maxLength} chars`)
  log(`   Max examples: ${maxExamples} per card\n`)

  // Load cards
  log('📥 Loading vocabulary cards...', 'cyan')
  const cardsContent = await fs.promises.readFile(cardsPath, 'utf-8')
  const cardsData = JSON.parse(cardsContent)
  const cards: VocabCard[] = cardsData.cards || cardsData
  log(`✅ Loaded ${cards.length} cards`, 'green')

  // Extract vocabulary words
  const vocabWords = extractVocabularyWords(cards)

  // Find matching Japanese sentences
  const jpnPath = path.join(corpusPath, 'jpn_sentences.tsv')
  const jpnMatches = await findMatchingSentences(jpnPath, vocabWords, maxLength)

  // Find translation pairs
  const jpnIds = new Set(jpnMatches.keys())
  const linksPath = path.join(corpusPath, 'jpn-eng_links.tsv')
  const translationPairs = await findTranslationPairs(linksPath, jpnIds)

  // Get English translations
  const engIds = new Set(translationPairs.map(p => p.engId))
  const engPath = path.join(corpusPath, 'eng_sentences.tsv')
  const engTranslations = await getEnglishTranslations(engPath, engIds)

  // Enrich cards
  const enrichedCards = enrichCards(cards, jpnMatches, translationPairs, engTranslations, maxExamples)

  // Save output
  log(`\n💾 Saving enriched cards...`, 'cyan')
  const output = {
    ...cardsData,
    cards: enrichedCards
  }
  await fs.promises.writeFile(outputPath, JSON.stringify(output, null, 2))
  log(`✅ Saved to: ${outputPath}`, 'green')

  log(`\n🎉 Done!`, 'green')
}

main().catch(err => {
  log(`\n❌ Error: ${err.message}`, 'red')
  console.error(err)
  process.exit(1)
})
