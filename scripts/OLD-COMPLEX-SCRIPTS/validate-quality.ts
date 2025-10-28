#!/usr/bin/env ts-node
/**
 * Quality Validator CLI Tool
 *
 * Validates vocabulary cards and generates quality reports
 *
 * Features:
 * - Batch quality scoring
 * - Detailed validation reports
 * - Flags cards needing review
 * - Statistics and summaries
 * - Export flagged cards for manual review
 *
 * Usage:
 *   npm run validate:quality -- --cards ./n5-enriched.json --output ./validation-report.json
 *   ts-node scripts/validate-quality.ts --cards ./n5-enriched.json
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { VocabularyCard } from '../src/types/vocabulary'
import { createQualityScorer, QualityScore } from '../src/services/quality-scorer.service'

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
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
      case '--output':
        parsed.outputPath = args[++i]
        break
      case '--flagged-output':
        parsed.flaggedOutput = args[++i]
        break
      case '--min-score':
        parsed.minScore = parseInt(args[++i], 10)
        break
      case '--require-audio':
        parsed.requireAudio = args[++i] === 'true'
        break
      case '--verbose':
      case '-v':
        parsed.verbose = true
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
${colors.bright}Quality Validator CLI Tool${colors.reset}

${colors.cyan}USAGE:${colors.reset}
  npm run validate:quality -- [options]
  ts-node scripts/validate-quality.ts [options]

${colors.cyan}OPTIONS:${colors.reset}
  --cards <path>           Path to vocabulary cards JSON file (required)
  --output <path>          Output path for validation report (default: validation-report.json)
  --flagged-output <path>  Output path for flagged cards (default: flagged-cards.json)
  --min-score <number>     Minimum acceptable score (default: 75)
  --require-audio <bool>   Require audio URL (default: true)
  --verbose, -v            Show detailed output for each card
  --help, -h               Show this help message

${colors.cyan}EXAMPLES:${colors.reset}
  # Validate N5 cards
  npm run validate:quality -- --cards ./data/n5-enriched.json

  # Validate with custom minimum score
  npm run validate:quality -- --cards ./data/n5-enriched.json --min-score 80

  # Validate without requiring audio
  npm run validate:quality -- --cards ./data/n5-enriched.json --require-audio false

  # Verbose mode (show each card)
  npm run validate:quality -- --cards ./data/n5-enriched.json --verbose

${colors.cyan}SCORING:${colors.reset}
  ${colors.bright}Score Ranges:${colors.reset}
    90-100: Excellent (production-ready)
    75-89:  Good (minor issues)
    60-74:  Fair (needs review)
    0-59:   Poor (needs fixing)

  ${colors.bright}Scoring Criteria:${colors.reset}
    Completeness: 0-30 points (ID, kanji/kana, meaning, JLPT level)
    Examples:     0-30 points (quantity and quality)
    Audio:        0-20 points (has valid audio URL)
    Consistency:  0-20 points (formatting, no empty strings, valid characters)

${colors.cyan}OUTPUT:${colors.reset}
  The validator generates two files:
  1. ${colors.bright}Validation Report${colors.reset}: Complete quality scores for all cards
  2. ${colors.bright}Flagged Cards${colors.reset}: Cards that need review (score < min-score or critical issues)
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
 * Display validation results
 */
function displayResults(
  cards: VocabularyCard[],
  scores: Map<string, QualityScore>,
  stats: any,
  verbose: boolean
) {
  console.log()
  log('='.repeat(60), 'bright')
  log('Quality Validation Results', 'bright')
  log('='.repeat(60) + '\n', 'bright')

  // Overall statistics
  log('Overall Statistics:', 'bright')
  console.log(`  Total cards: ${stats.total}`)
  console.log(`  Average score: ${stats.average}/100`)
  console.log(`  Production ready: ${stats.productionReady} (${Math.round((stats.productionReady / stats.total) * 100)}%)`)
  console.log(`  Needs review: ${stats.needsReview} (${Math.round((stats.needsReview / stats.total) * 100)}%)`)
  console.log()

  // Distribution
  log('Score Distribution:', 'bright')
  console.log(`  ${colors.green}Excellent (90-100):${colors.reset} ${stats.distribution.excellent} cards`)
  console.log(`  ${colors.cyan}Good (75-89):${colors.reset}      ${stats.distribution.good} cards`)
  console.log(`  ${colors.yellow}Fair (60-74):${colors.reset}      ${stats.distribution.fair} cards`)
  console.log(`  ${colors.red}Poor (0-59):${colors.reset}       ${stats.distribution.poor} cards`)
  console.log()

  // Critical issues
  if (stats.criticalIssues > 0) {
    warn(`${stats.criticalIssues} cards have critical issues`)
    console.log()
  }

  // Verbose output: show details for flagged cards
  if (verbose) {
    const flaggedCards = cards.filter(card => {
      const score = scores.get(card.id)
      return score && (!score.productionReady || score.overall < 75)
    })

    if (flaggedCards.length > 0) {
      log('Flagged Cards (Detailed):', 'bright')
      console.log()

      for (const card of flaggedCards.slice(0, 10)) { // Show first 10
        const score = scores.get(card.id)!
        displayCardDetails(card, score)
      }

      if (flaggedCards.length > 10) {
        info(`... and ${flaggedCards.length - 10} more flagged cards`)
        console.log()
      }
    }
  }
}

/**
 * Display details for a single card
 */
function displayCardDetails(card: VocabularyCard, score: QualityScore) {
  const ratingColor =
    score.rating === 'excellent' ? 'green' :
    score.rating === 'good' ? 'cyan' :
    score.rating === 'fair' ? 'yellow' : 'red'

  log(`Card: ${card.id}`, 'bright')
  console.log(`  Word: ${card.kanji || card.kana}`)
  console.log(`  Score: ${score.overall}/100 (${colors[ratingColor]}${score.rating}${colors.reset})`)
  console.log(`  Production Ready: ${score.productionReady ? '✅ Yes' : '❌ No'}`)
  console.log(`  Breakdown:`)
  console.log(`    Completeness: ${score.breakdown.completeness}/30`)
  console.log(`    Examples:     ${score.breakdown.examples}/30`)
  console.log(`    Audio:        ${score.breakdown.audio}/20`)
  console.log(`    Consistency:  ${score.breakdown.consistency}/20`)

  if (score.issues.length > 0) {
    console.log(`  Issues:`)
    for (const issue of score.issues) {
      const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'warning' ? '⚠️' : 'ℹ️'
      console.log(`    ${icon} [${issue.category}] ${issue.message}`)
    }
  }

  console.log()
}

/**
 * Save validation report
 */
async function saveReport(
  outputPath: string,
  cards: VocabularyCard[],
  scores: Map<string, QualityScore>,
  stats: any
) {
  const report = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalCards: cards.length,
      validator: 'JapVocab Quality Validator v1.0',
    },
    statistics: stats,
    cards: cards.map(card => ({
      id: card.id,
      word: card.kanji || card.kana,
      score: scores.get(card.id),
    })),
  }

  await fs.writeFile(outputPath, JSON.stringify(report, null, 2), 'utf-8')
  success(`Saved validation report to: ${outputPath}`)
}

/**
 * Save flagged cards
 */
async function saveFlaggedCards(
  outputPath: string,
  cards: VocabularyCard[],
  scores: Map<string, QualityScore>,
  minScore: number
) {
  const flaggedCards = cards.filter(card => {
    const score = scores.get(card.id)
    return score && (score.overall < minScore || !score.productionReady)
  })

  const flaggedData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalFlagged: flaggedCards.length,
      minScore,
    },
    cards: flaggedCards.map(card => ({
      ...card,
      qualityScore: scores.get(card.id),
    })),
  }

  await fs.writeFile(outputPath, JSON.stringify(flaggedData, null, 2), 'utf-8')

  if (flaggedCards.length > 0) {
    warn(`${flaggedCards.length} cards flagged for review`)
    success(`Saved flagged cards to: ${outputPath}`)
  } else {
    success('No cards flagged - all cards pass validation!')
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

  try {
    log('\n' + '='.repeat(60), 'bright')
    log('Quality Validation Tool', 'bright')
    log('='.repeat(60) + '\n', 'bright')

    // Step 1: Load vocabulary cards
    const cards = await loadCards(args.cardsPath)

    // Step 2: Create quality scorer
    const minScore = args.minScore ?? 75
    const requireAudio = args.requireAudio ?? true

    info(`Validation settings:`)
    console.log(`  Minimum score: ${minScore}/100`)
    console.log(`  Require audio: ${requireAudio}`)
    console.log()

    const scorer = createQualityScorer({ requireAudio })

    // Step 3: Score all cards
    info('Scoring vocabulary cards...')
    const scores = new Map<string, QualityScore>()

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]
      const score = scorer.scoreCard(card)
      scores.set(card.id, score)

      progressBar(i + 1, cards.length, 'Validating')
    }

    console.log()

    // Step 4: Generate statistics
    const stats = scorer.generateBatchStatistics(scores)

    // Step 5: Display results
    displayResults(cards, scores, stats, args.verbose ?? false)

    // Step 6: Save reports
    const outputPath = args.outputPath || path.join(path.dirname(args.cardsPath), 'validation-report.json')
    const flaggedOutput = args.flaggedOutput || path.join(path.dirname(args.cardsPath), 'flagged-cards.json')

    await saveReport(outputPath, cards, scores, stats)
    await saveFlaggedCards(flaggedOutput, cards, scores, minScore)

    // Step 7: Exit with appropriate code
    console.log()
    if (stats.needsReview > 0) {
      warn(`Validation complete with ${stats.needsReview} cards needing review`)
      info('Review flagged cards and fix issues before production deployment')
      process.exit(1)
    } else {
      success('All cards pass validation! Ready for production.')
      process.exit(0)
    }

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
