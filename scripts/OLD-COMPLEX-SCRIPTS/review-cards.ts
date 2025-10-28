#!/usr/bin/env ts-node
/**
 * Card Review CLI Tool
 *
 * Manual review interface for flagged vocabulary cards
 *
 * Features:
 * - Interactive CLI for reviewing flagged cards
 * - Shows card details and quality issues
 * - Mark cards as: approved, needs-fix, skip
 * - Save review decisions
 * - Generate summary report
 *
 * Usage:
 *   npm run review:cards -- --flagged ./flagged-cards.json
 *   ts-node scripts/review-cards.ts --flagged ./flagged-cards.json
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import * as readline from 'readline'
import { VocabularyCard } from '../src/types/vocabulary'
import { QualityScore } from '../src/services/quality-scorer.service'

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

interface FlaggedCard extends VocabularyCard {
  qualityScore?: QualityScore
}

interface ReviewDecision {
  cardId: string
  decision: 'approved' | 'needs-fix' | 'skip'
  notes?: string
  reviewedAt: string
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
      case '--flagged':
        parsed.flaggedPath = args[++i]
        break
      case '--output':
        parsed.outputPath = args[++i]
        break
      case '--batch-size':
        parsed.batchSize = parseInt(args[++i], 10)
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
${colors.bright}Card Review CLI Tool${colors.reset}

${colors.cyan}USAGE:${colors.reset}
  npm run review:cards -- [options]
  ts-node scripts/review-cards.ts [options]

${colors.cyan}OPTIONS:${colors.reset}
  --flagged <path>      Path to flagged cards JSON file (required)
  --output <path>       Output path for review decisions (default: review-decisions.json)
  --batch-size <num>    Number of cards to review at once (default: 10)
  --help, -h            Show this help message

${colors.cyan}EXAMPLES:${colors.reset}
  # Review flagged cards
  npm run review:cards -- --flagged ./flagged-cards.json

  # Review with custom batch size
  npm run review:cards -- --flagged ./flagged-cards.json --batch-size 5

${colors.cyan}CONTROLS:${colors.reset}
  During review, you can:
    ${colors.green}a${colors.reset} - Approve card (production-ready after minor fixes)
    ${colors.yellow}f${colors.reset} - Mark as needs-fix (requires manual correction)
    ${colors.cyan}s${colors.reset} - Skip card (review later)
    ${colors.red}q${colors.reset} - Quit review (saves progress)

${colors.cyan}WORKFLOW:${colors.reset}
  1. Run quality validator to generate flagged-cards.json
  2. Use this tool to review flagged cards
  3. Fix cards marked as "needs-fix"
  4. Re-run quality validator
  5. Repeat until all cards pass
`)
}

/**
 * Load flagged cards
 */
async function loadFlaggedCards(filePath: string): Promise<FlaggedCard[]> {
  try {
    const absolutePath = path.resolve(filePath)
    info(`Loading flagged cards from: ${absolutePath}`)

    const content = await fs.readFile(absolutePath, 'utf-8')
    const data = JSON.parse(content)

    const cards = data.cards || data

    if (!Array.isArray(cards)) {
      throw new Error('Flagged cards file must contain an array')
    }

    success(`Loaded ${cards.length} flagged cards`)
    return cards

  } catch (err) {
    throw new Error(`Failed to load flagged cards: ${(err as Error).message}`)
  }
}

/**
 * Display card details for review
 */
function displayCardForReview(card: FlaggedCard, index: number, total: number) {
  console.clear()
  log('='.repeat(60), 'bright')
  log(`Card Review (${index + 1}/${total})`, 'bright')
  log('='.repeat(60) + '\n', 'bright')

  // Card information
  log('Card Details:', 'bright')
  console.log(`  ID: ${card.id}`)
  console.log(`  Kanji: ${card.kanji || '(none)'}`)
  console.log(`  Kana: ${card.kana || '(none)'}`)
  console.log(`  Meaning: ${card.meaning || '(none)'}`)
  console.log(`  JLPT Level: ${card.jlptLevel || '(none)'}`)
  console.log(`  Audio URL: ${card.audioUrl || '(none)'}`)
  console.log()

  // Examples
  if (card.examples && card.examples.length > 0) {
    log('Examples:', 'bright')
    for (let i = 0; i < card.examples.length; i++) {
      const ex = card.examples[i]
      console.log(`  ${i + 1}. ${ex.japanese}`)
      console.log(`     ${ex.english}`)
    }
    console.log()
  } else {
    warn('No examples')
    console.log()
  }

  // Quality score
  if (card.qualityScore) {
    const score = card.qualityScore
    const ratingColor =
      score.rating === 'excellent' ? 'green' :
      score.rating === 'good' ? 'cyan' :
      score.rating === 'fair' ? 'yellow' : 'red'

    log('Quality Score:', 'bright')
    console.log(`  Overall: ${score.overall}/100 (${colors[ratingColor]}${score.rating}${colors.reset})`)
    console.log(`  Breakdown:`)
    console.log(`    Completeness: ${score.breakdown.completeness}/30`)
    console.log(`    Examples:     ${score.breakdown.examples}/30`)
    console.log(`    Audio:        ${score.breakdown.audio}/20`)
    console.log(`    Consistency:  ${score.breakdown.consistency}/20`)
    console.log()

    // Issues
    if (score.issues.length > 0) {
      log('Issues:', 'bright')
      for (const issue of score.issues) {
        const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'warning' ? '⚠️' : 'ℹ️'
        const color = issue.severity === 'critical' ? 'red' : issue.severity === 'warning' ? 'yellow' : 'cyan'
        log(`  ${icon} [${issue.category}] ${issue.message}`, color)
        if (issue.field) {
          console.log(`     Field: ${issue.field}`)
        }
      }
      console.log()
    }
  }

  // Controls
  log('What would you like to do?', 'bright')
  console.log(`  ${colors.green}[a]${colors.reset} Approve (production-ready)`)
  console.log(`  ${colors.yellow}[f]${colors.reset} Needs fix (manual correction needed)`)
  console.log(`  ${colors.cyan}[s]${colors.reset} Skip (review later)`)
  console.log(`  ${colors.red}[q]${colors.reset} Quit (save progress)`)
  console.log()
}

/**
 * Prompt user for input
 */
function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close()
      resolve(answer.trim().toLowerCase())
    })
  })
}

/**
 * Review cards interactively
 */
async function reviewCards(
  cards: FlaggedCard[],
  batchSize: number
): Promise<ReviewDecision[]> {
  const decisions: ReviewDecision[] = []
  let currentIndex = 0

  while (currentIndex < cards.length) {
    const card = cards[currentIndex]

    // Display card
    displayCardForReview(card, currentIndex, cards.length)

    // Get user decision
    const answer = await prompt('Your decision [a/f/s/q]: ')

    if (answer === 'q') {
      warn('\nQuitting review...')
      break
    }

    let decision: ReviewDecision['decision']
    if (answer === 'a') {
      decision = 'approved'
      success('Card approved')
    } else if (answer === 'f') {
      decision = 'needs-fix'
      warn('Card marked as needs-fix')
    } else if (answer === 's') {
      decision = 'skip'
      info('Card skipped')
    } else {
      warn('Invalid choice. Please enter a, f, s, or q')
      continue
    }

    // Save decision
    decisions.push({
      cardId: card.id,
      decision,
      reviewedAt: new Date().toISOString(),
    })

    currentIndex++

    // Optional: pause after batch
    if (batchSize > 0 && currentIndex % batchSize === 0 && currentIndex < cards.length) {
      console.log()
      const continueReview = await prompt(`Reviewed ${currentIndex}/${cards.length}. Continue? [y/n]: `)
      if (continueReview !== 'y') {
        break
      }
    }
  }

  return decisions
}

/**
 * Save review decisions
 */
async function saveDecisions(outputPath: string, decisions: ReviewDecision[]) {
  const report = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalReviewed: decisions.length,
      approved: decisions.filter(d => d.decision === 'approved').length,
      needsFix: decisions.filter(d => d.decision === 'needs-fix').length,
      skipped: decisions.filter(d => d.decision === 'skip').length,
    },
    decisions,
  }

  await fs.writeFile(outputPath, JSON.stringify(report, null, 2), 'utf-8')
  success(`Saved review decisions to: ${outputPath}`)
}

/**
 * Display summary
 */
function displaySummary(decisions: ReviewDecision[]) {
  console.log()
  log('='.repeat(60), 'bright')
  log('Review Summary', 'bright')
  log('='.repeat(60) + '\n', 'bright')

  const approved = decisions.filter(d => d.decision === 'approved').length
  const needsFix = decisions.filter(d => d.decision === 'needs-fix').length
  const skipped = decisions.filter(d => d.decision === 'skip').length

  console.log(`  Total reviewed: ${decisions.length}`)
  log(`  Approved: ${approved}`, 'green')
  log(`  Needs fix: ${needsFix}`, 'yellow')
  log(`  Skipped: ${skipped}`, 'cyan')
  console.log()

  if (needsFix > 0) {
    warn('Next steps:')
    console.log('  1. Fix cards marked as "needs-fix"')
    console.log('  2. Re-run quality validator')
    console.log('  3. Review remaining flagged cards')
  } else if (approved > 0) {
    success('All reviewed cards approved!')
    console.log('  Re-run quality validator to verify')
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
  if (!args.flaggedPath) {
    error('Missing required argument: --flagged')
    console.log('Run with --help for usage information')
    process.exit(1)
  }

  try {
    // Step 1: Load flagged cards
    const cards = await loadFlaggedCards(args.flaggedPath)

    if (cards.length === 0) {
      success('No cards to review!')
      process.exit(0)
    }

    console.log()
    info(`Starting review of ${cards.length} flagged cards`)
    info('Use arrow keys and enter to navigate, or type a/f/s/q')
    console.log()

    await prompt('Press Enter to start...')

    // Step 2: Review cards
    const batchSize = args.batchSize ?? 10
    const decisions = await reviewCards(cards, batchSize)

    // Step 3: Save decisions
    const outputPath = args.outputPath || path.join(path.dirname(args.flaggedPath), 'review-decisions.json')
    await saveDecisions(outputPath, decisions)

    // Step 4: Display summary
    displaySummary(decisions)

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
