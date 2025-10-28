#!/usr/bin/env ts-node
/**
 * Sentence Enrichment CLI Tool
 *
 * Enriches vocabulary cards with example sentences from Tatoeba corpus
 *
 * Usage:
 *   npm run enrich:sentences -- --cards ./n5-cards.json --corpus ./tatoeba --output ./n5-enriched.json
 *   ts-node scripts/enrich-sentences.ts --cards ./n5-cards.json --corpus ./tatoeba
 *
 * Options:
 *   --cards <path>       Path to vocabulary cards JSON file (required)
 *   --corpus <path>      Path to Tatoeba corpus directory (required)
 *   --output <path>      Output JSON file path (default: ./enriched-cards.json)
 *   --max <number>       Maximum examples per card (default: 3)
 *   --min-score <number> Minimum quality score (default: 60)
 *   --max-length <number> Maximum sentence length (default: 25)
 *   --build-index        Build corpus index from TSV files
 *   --index-cache <path> Path to cached index JSON (default: ./tatoeba-index.json)
 *   --help              Show help
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { createTatoebaParser } from '../src/services/tatoeba-parser.service'
import { createSentenceMatcher } from '../src/services/sentence-matcher.service'
import { VocabularyCard } from '../src/types/vocabulary'

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color?: keyof typeof colors) {
  if (color && colors[color]) {
    console.log(`${colors[color]}${message}${colors.reset}`)
  } else {
    console.log(message)
  }
}

function error(message: string) {
  log(`❌ ERROR: ${message}`, 'red')
}

function success(message: string) {
  log(`✅ ${message}`, 'green')
}

function info(message: string) {
  log(`ℹ️  ${message}`, 'cyan')
}

function warn(message: string) {
  log(`⚠️  ${message}`, 'yellow')
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2)
  const parsed: any = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--cards':
        parsed.cardsPath = args[++i]
        break
      case '--corpus':
        parsed.corpusPath = args[++i]
        break
      case '--output':
        parsed.outputPath = args[++i]
        break
      case '--max':
        parsed.maxExamples = parseInt(args[++i], 10)
        break
      case '--min-score':
        parsed.minScore = parseInt(args[++i], 10)
        break
      case '--max-length':
        parsed.maxLength = parseInt(args[++i], 10)
        break
      case '--build-index':
        parsed.buildIndex = true
        break
      case '--index-cache':
        parsed.indexCachePath = args[++i]
        break
      case '--help':
      case '-h':
        parsed.help = true
        break
    }
  }

  return parsed
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
${colors.bright}Sentence Enrichment CLI Tool${colors.reset}

${colors.cyan}USAGE:${colors.reset}
  npm run enrich:sentences -- [options]
  ts-node scripts/enrich-sentences.ts [options]

${colors.cyan}OPTIONS:${colors.reset}
  --cards <path>         Path to vocabulary cards JSON file (required)
  --corpus <path>        Path to Tatoeba corpus directory (required)
  --output <path>        Output JSON file path (default: ./enriched-cards.json)
  --max <number>         Maximum examples per card (default: 3)
  --min-score <number>   Minimum quality score 0-100 (default: 60)
  --max-length <number>  Maximum sentence length in characters (default: 25)
  --build-index          Build corpus index from TSV files
  --index-cache <path>   Path to cached index JSON (default: ./tatoeba-index.json)
  --help, -h             Show this help message

${colors.cyan}TATOEBA CORPUS STRUCTURE:${colors.reset}
  corpus/
    ├── sentences.csv     (All sentences)
    ├── jpn_sentences.csv (Japanese sentences only)
    ├── eng_sentences.csv (English sentences only)
    └── jpn_indices.csv   (Japanese-English links)

${colors.cyan}EXAMPLES:${colors.reset}
  # First time: Build index from corpus
  npm run enrich:sentences -- \\
    --cards ./n5-cards.json \\
    --corpus ./data/tatoeba \\
    --build-index \\
    --output ./n5-enriched.json

  # Subsequent runs: Use cached index
  npm run enrich:sentences -- \\
    --cards ./n5-cards.json \\
    --index-cache ./tatoeba-index.json \\
    --output ./n5-enriched.json

  # Custom settings
  npm run enrich:sentences -- \\
    --cards ./n4-cards.json \\
    --index-cache ./tatoeba-index.json \\
    --max 5 \\
    --min-score 70 \\
    --max-length 20

${colors.cyan}DOWNLOAD TATOEBA:${colors.reset}
  # Japanese sentences
  curl https://downloads.tatoeba.org/exports/per_language/jpn/jpn_sentences.tsv.bz2 -o jpn_sentences.tsv.bz2
  bzip2 -d jpn_sentences.tsv.bz2

  # English sentences
  curl https://downloads.tatoeba.org/exports/per_language/eng/eng_sentences.tsv.bz2 -o eng_sentences.tsv.bz2
  bzip2 -d eng_sentences.tsv.bz2

  # Translation links
  curl https://downloads.tatoeba.org/exports/jpn-eng_links.tsv.bz2 -o jpn-eng_links.tsv.bz2
  bzip2 -d jpn-eng_links.tsv.bz2
`)
}

/**
 * Load vocabulary cards
 */
async function loadCards(filePath: string): Promise<VocabularyCard[]> {
  try {
    const absolutePath = path.resolve(filePath)
    info(`Loading vocabulary cards from: ${absolutePath}`)

    const content = await fs.readFile(absolutePath, 'utf-8')
    const data = JSON.parse(content)

    // Handle different formats
    const cards = data.cards || data

    if (!Array.isArray(cards)) {
      throw new Error('Cards file must contain an array of vocabulary cards')
    }

    success(`Loaded ${cards.length} cards`)
    return cards

  } catch (err) {
    throw new Error(`Failed to load cards: ${(err as Error).message}`)
  }
}

/**
 * Build corpus index from TSV files
 */
async function buildCorpusIndex(corpusPath: string) {
  const parser = createTatoebaParser()

  info('Loading Tatoeba corpus files...')

  // Load Japanese sentences
  const jpnPath = path.join(corpusPath, 'jpn_sentences.tsv')
  info(`  Reading ${jpnPath}`)
  const jpnContent = await fs.readFile(jpnPath, 'utf-8')
  const jpnSentences = parser.parseSentencesFile(jpnContent, 'jpn')
  success(`  Loaded ${jpnSentences.length} Japanese sentences`)

  // Load English sentences
  const engPath = path.join(corpusPath, 'eng_sentences.tsv')
  info(`  Reading ${engPath}`)
  const engContent = await fs.readFile(engPath, 'utf-8')
  const engSentences = parser.parseSentencesFile(engContent, 'eng')
  success(`  Loaded ${engSentences.length} English sentences`)

  // Load links
  const linksPath = path.join(corpusPath, 'jpn-eng_links.tsv')
  info(`  Reading ${linksPath}`)
  const linksContent = await fs.readFile(linksPath, 'utf-8')
  const links = parser.parseLinksFile(linksContent)
  success(`  Loaded ${links.length} translation links`)

  // Build index
  info('Building corpus index (this may take a minute)...')
  const index = parser.buildCorpusIndex(jpnSentences, engSentences, links)

  const stats = parser.getCorpusStats(index)
  success('Corpus index built!')
  console.log('  Statistics:')
  console.log(`    Total sentences: ${stats.totalSentences}`)
  console.log(`    Japanese: ${stats.japaneseSentences}`)
  console.log(`    English: ${stats.englishSentences}`)
  console.log(`    Translation pairs: ${stats.translationPairs}`)
  console.log(`    Word index size: ${stats.wordIndexSize}`)

  return index
}

/**
 * Save corpus index to cache
 */
async function saveIndexCache(index: any, cachePath: string) {
  try {
    const parser = createTatoebaParser()
    const json = parser.exportIndexToJSON(index)
    await fs.writeFile(cachePath, json, 'utf-8')
    success(`Saved index cache to: ${cachePath}`)
  } catch (err) {
    warn(`Failed to save index cache: ${(err as Error).message}`)
  }
}

/**
 * Load corpus index from cache
 */
async function loadIndexCache(cachePath: string) {
  try {
    info(`Loading index cache from: ${cachePath}`)
    const json = await fs.readFile(cachePath, 'utf-8')
    const parser = createTatoebaParser()
    const index = parser.importIndexFromJSON(json)
    success('Index cache loaded')
    return index
  } catch (err) {
    throw new Error(`Failed to load index cache: ${(err as Error).message}`)
  }
}

/**
 * Progress bar
 */
function progressBar(current: number, total: number, label: string = '') {
  const width = 40
  const percentage = Math.round((current / total) * 100)
  const filled = Math.round((width * current) / total)
  const empty = width - filled

  const bar = '█'.repeat(filled) + '░'.repeat(empty)

  process.stdout.write(`\r${label} [${bar}] ${percentage}% (${current}/${total})`)

  if (current >= total) {
    process.stdout.write('\n')
  }
}

/**
 * Main CLI function
 */
async function main() {
  const args = parseArgs()

  // Show help
  if (args.help) {
    showHelp()
    process.exit(0)
  }

  // Validate required arguments
  if (!args.cardsPath) {
    error('Missing required argument: --cards')
    console.log('Run with --help for usage information')
    process.exit(1)
  }

  if (!args.corpusPath && !args.indexCachePath) {
    error('Must provide either --corpus or --index-cache')
    console.log('Run with --help for usage information')
    process.exit(1)
  }

  try {
    log('\n' + '='.repeat(60), 'bright')
    log('Sentence Enrichment Tool', 'bright')
    log('='.repeat(60) + '\n', 'bright')

    // Step 1: Load vocabulary cards
    const cards = await loadCards(args.cardsPath)

    // Step 2: Load or build corpus index
    let corpusIndex

    if (args.buildIndex && args.corpusPath) {
      corpusIndex = await buildCorpusIndex(args.corpusPath)

      // Save index cache if path provided
      const cachePath = args.indexCachePath || './tatoeba-index.json'
      await saveIndexCache(corpusIndex, cachePath)
    } else if (args.indexCachePath) {
      corpusIndex = await loadIndexCache(args.indexCachePath)
    } else {
      throw new Error('Must provide --corpus with --build-index, or --index-cache')
    }

    // Step 3: Initialize sentence matcher
    const matcher = createSentenceMatcher()
    matcher.loadCorpusIndex(corpusIndex)
    success('Sentence matcher ready')

    // Step 4: Configure options
    const options = {
      maxResults: args.maxExamples || 3,
      minScore: args.minScore || 60,
      maxLength: args.maxLength || 25,
      minLength: 5,
      requireTranslation: true,
      preferShorter: true,
    }

    info('\nEnrichment Settings:')
    info(`  Max examples per card: ${options.maxResults}`)
    info(`  Min quality score: ${options.minScore}`)
    info(`  Max sentence length: ${options.maxLength} chars`)
    console.log()

    // Step 5: Enrich cards
    log('Enriching cards with example sentences...', 'bright')
    const enrichedCards = matcher.enrichCards(cards, options, (current: number, total: number) => {
      progressBar(current, total, 'Progress')
    })

    // Step 6: Generate statistics
    console.log()
    log('Enrichment Statistics:', 'bright')
    const stats = matcher.getMatchingStats(enrichedCards)
    console.log(`  Total cards: ${stats.totalCards}`)
    console.log(`  Cards with examples: ${stats.cardsWithExamples}`)
    console.log(`  Cards without examples: ${stats.cardsWithoutExamples}`)
    console.log(`  Total examples: ${stats.totalExamples}`)
    console.log(`  Avg examples/card: ${stats.averageExamplesPerCard.toFixed(2)}`)
    console.log()
    console.log('  Example length distribution:')
    Object.entries(stats.exampleLengthDistribution).forEach(([range, count]) => {
      console.log(`    ${range}: ${count}`)
    })

    // Step 7: Save enriched cards
    const outputPath = path.resolve(args.outputPath || './enriched-cards.json')
    const outputData = {
      metadata: {
        source: 'Tatoeba',
        generatedAt: new Date(),
        totalCards: enrichedCards.length,
        enrichmentOptions: options,
        license: 'CC BY 2.0 FR',
        licenseUrl: 'https://creativecommons.org/licenses/by/2.0/fr/'
      },
      cards: enrichedCards
    }

    await fs.writeFile(outputPath, JSON.stringify(outputData, null, 2), 'utf-8')
    success(`\nSaved enriched cards to: ${outputPath}`)

    console.log()
    log('✨ Enrichment complete!', 'green')

    process.exit(0)

  } catch (err) {
    console.log()
    error((err as Error).message)
    console.log()
    process.exit(1)
  }
}

// Run CLI
if (require.main === module) {
  main()
}

export { main }
