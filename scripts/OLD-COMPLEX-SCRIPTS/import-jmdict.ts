#!/usr/bin/env ts-node
/**
 * JMdict Batch Import CLI Tool
 *
 * Command-line tool for importing vocabulary from JMdict
 *
 * Usage:
 *   npm run import:jmdict -- --level N5 --max 100 --output ./output.json
 *   ts-node scripts/import-jmdict.ts --level N5 --max 100
 *
 * Options:
 *   --input <path>       Path to JMdict JSON file (required)
 *   --level <level>      JLPT level to import (N5, N4, N3, N2, N1)
 *   --max <number>       Maximum number of cards to import
 *   --output <path>      Output JSON file path
 *   --frequency <path>   Path to frequency data JSON file
 *   --sort-freq          Sort by frequency (requires frequency data)
 *   --dry-run           Preview import without saving
 *   --help              Show help
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { createBatchImportService, BatchImportOptions } from '../src/services/batch-import.service'
import { JLPTLevel } from '../src/types/vocabulary'

// ANSI color codes for terminal output
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
function parseArgs(): {
  inputPath?: string
  level?: JLPTLevel
  maxCards?: number
  outputPath?: string
  frequencyPath?: string
  sortByFrequency?: boolean
  dryRun?: boolean
  help?: boolean
} {
  const args = process.argv.slice(2)
  const parsed: ReturnType<typeof parseArgs> = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--input':
        parsed.inputPath = args[++i]
        break
      case '--level':
        const level = args[++i]?.toUpperCase()
        if (['N5', 'N4', 'N3', 'N2', 'N1'].includes(level)) {
          parsed.level = level as JLPTLevel
        }
        break
      case '--max':
        parsed.maxCards = parseInt(args[++i], 10)
        break
      case '--output':
        parsed.outputPath = args[++i]
        break
      case '--frequency':
        parsed.frequencyPath = args[++i]
        break
      case '--sort-freq':
        parsed.sortByFrequency = true
        break
      case '--dry-run':
        parsed.dryRun = true
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
${colors.bright}JMdict Batch Import CLI Tool${colors.reset}

${colors.cyan}USAGE:${colors.reset}
  npm run import:jmdict -- [options]
  ts-node scripts/import-jmdict.ts [options]

${colors.cyan}OPTIONS:${colors.reset}
  --input <path>       Path to JMdict JSON file (required)
  --level <level>      JLPT level to import (N5, N4, N3, N2, N1)
  --max <number>       Maximum number of cards to import
  --output <path>      Output JSON file path (default: ./imported-cards.json)
  --frequency <path>   Path to frequency data JSON file
  --sort-freq          Sort by frequency (requires --frequency)
  --dry-run            Preview import without saving
  --help, -h           Show this help message

${colors.cyan}EXAMPLES:${colors.reset}
  # Import all N5 vocabulary
  npm run import:jmdict -- --input ./jmdict.json --level N5

  # Import top 100 N5 words sorted by frequency
  npm run import:jmdict -- \\
    --input ./jmdict.json \\
    --level N5 \\
    --max 100 \\
    --frequency ./frequency.json \\
    --sort-freq

  # Dry run to preview import
  npm run import:jmdict -- --input ./jmdict.json --level N5 --dry-run

  # Import to specific output file
  npm run import:jmdict -- \\
    --input ./jmdict.json \\
    --level N4 \\
    --output ./n4-cards.json

${colors.cyan}DATA SOURCES:${colors.reset}
  JMdict: https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project
  Frequency: BCCWJ or Leeds Corpus

${colors.cyan}OUTPUT FORMAT:${colors.reset}
  {
    "metadata": {
      "source": "JMdict",
      "jlptLevel": "N5",
      "generatedAt": "2025-10-26T...",
      "totalCards": 100
    },
    "cards": [...]
  }
`)
}

/**
 * Load JMdict data from file
 */
async function loadJMdictData(filePath: string): Promise<any[]> {
  try {
    const absolutePath = path.resolve(filePath)
    info(`Loading JMdict data from: ${absolutePath}`)

    const content = await fs.readFile(absolutePath, 'utf-8')
    const data = JSON.parse(content)

    // Handle different JMdict JSON formats
    // Some versions wrap in "words" array, some are direct array
    const entries = Array.isArray(data) ? data : (data.words || data.entries || [])

    if (entries.length === 0) {
      throw new Error('No entries found in JMdict file')
    }

    success(`Loaded ${entries.length.toLocaleString()} entries from JMdict`)
    return entries

  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`)
    }
    throw new Error(`Failed to load JMdict data: ${(err as Error).message}`)
  }
}

/**
 * Load frequency data from file
 */
async function loadFrequencyData(filePath: string): Promise<Record<string, number>> {
  try {
    const absolutePath = path.resolve(filePath)
    info(`Loading frequency data from: ${absolutePath}`)

    const content = await fs.readFile(absolutePath, 'utf-8')
    const data = JSON.parse(content)

    const count = Object.keys(data).length
    success(`Loaded frequency data for ${count.toLocaleString()} words`)

    return data

  } catch (err) {
    warn(`Could not load frequency data: ${(err as Error).message}`)
    return {}
  }
}

/**
 * Save cards to JSON file
 */
async function saveCards(
  outputPath: string,
  jsonContent: string
): Promise<void> {
  try {
    const absolutePath = path.resolve(outputPath)
    const dir = path.dirname(absolutePath)

    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true })

    // Write file
    await fs.writeFile(absolutePath, jsonContent, 'utf-8')

    success(`Saved cards to: ${absolutePath}`)

  } catch (err) {
    throw new Error(`Failed to save cards: ${(err as Error).message}`)
  }
}

/**
 * Display progress bar
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
  if (!args.inputPath) {
    error('Missing required argument: --input')
    console.log('Run with --help for usage information')
    process.exit(1)
  }

  try {
    log('\n' + '='.repeat(60), 'bright')
    log('JMdict Batch Import Tool', 'bright')
    log('='.repeat(60) + '\n', 'bright')

    // Step 1: Load JMdict data
    const jmdictEntries = await loadJMdictData(args.inputPath)

    // Step 2: Load frequency data (optional)
    const importService = createBatchImportService()

    if (args.frequencyPath) {
      const frequencyData = await loadFrequencyData(args.frequencyPath)
      await importService.loadFrequencyData(frequencyData)
    } else if (args.sortByFrequency) {
      warn('--sort-freq specified but no frequency data provided')
      warn('Cards will not be sorted by frequency')
    }

    // Step 3: Configure import options
    const options: BatchImportOptions = {
      jlptLevel: args.level,
      maxCards: args.maxCards,
      sortByFrequency: args.sortByFrequency,
    }

    info('\nImport Configuration:')
    if (args.level) info(`  JLPT Level: ${args.level}`)
    if (args.maxCards) info(`  Max Cards: ${args.maxCards}`)
    if (args.sortByFrequency) info(`  Sort by Frequency: Yes`)
    if (args.dryRun) warn('  Dry Run Mode: ON (no files will be saved)')
    console.log()

    // Step 4: Run import
    log('Processing entries...', 'bright')
    const result = await importService.importCards(jmdictEntries, options)

    // Step 5: Show report
    console.log('\n')
    log(importService.generateReport(result), 'bright')

    // Step 6: Save to file (unless dry-run)
    if (!args.dryRun && result.success && result.cardsImported > 0) {
      const outputPath = args.outputPath || './imported-cards.json'
      const jsonContent = importService.exportToJSON(result.cards, {
        jlptLevel: args.level,
        source: 'JMdict',
        generatedAt: new Date(),
      })

      await saveCards(outputPath, jsonContent)

      info('\nNext steps:')
      info('  1. Review the imported cards in the output file')
      info('  2. Add example sentences using Tatoeba matcher')
      info('  3. Generate audio files')
      info('  4. Import to database')
    } else if (args.dryRun) {
      info('\nDry run complete - no files were saved')
      info('Remove --dry-run to save cards to file')
    }

    console.log()

    // Exit with appropriate code
    process.exit(result.success ? 0 : 1)

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
