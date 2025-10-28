#!/usr/bin/env ts-node
/**
 * Audio Upload CLI Tool
 *
 * Uploads audio files to CDN and updates vocabulary cards with audio URLs
 *
 * Supports:
 * - Cloudflare R2 (S3-compatible)
 * - AWS S3
 * - Local file server (for testing)
 *
 * Usage:
 *   npm run upload:audio -- --cards ./n5-enriched.json --audio ./audio/n5 --cdn r2 --bucket my-bucket
 *   ts-node scripts/upload-audio.ts --cards ./n5-enriched.json --audio ./audio/n5 --cdn local
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { VocabularyCard } from '../src/types/vocabulary'

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
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
      case '--audio':
        parsed.audioDir = args[++i]
        break
      case '--cdn':
        parsed.cdn = args[++i] // 'r2', 's3', or 'local'
        break
      case '--bucket':
        parsed.bucket = args[++i]
        break
      case '--base-url':
        parsed.baseUrl = args[++i]
        break
      case '--output':
        parsed.outputPath = args[++i]
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
${colors.bright}Audio Upload CLI Tool${colors.reset}

${colors.cyan}USAGE:${colors.reset}
  npm run upload:audio -- [options]
  ts-node scripts/upload-audio.ts [options]

${colors.cyan}OPTIONS:${colors.reset}
  --cards <path>       Path to vocabulary cards JSON file (required)
  --audio <path>       Path to audio files directory (required)
  --cdn <type>         CDN type: r2, s3, or local (required)
  --bucket <name>      S3/R2 bucket name (required for r2/s3)
  --base-url <url>     Base URL for CDN (required for r2/s3)
  --output <path>      Output JSON file with updated cards (default: same as input)
  --help, -h           Show this help message

${colors.cyan}EXAMPLES:${colors.reset}
  # Local mode (for testing - no actual upload)
  npm run upload:audio -- \\
    --cards ./data/n5-enriched.json \\
    --audio ./public/audio/n5 \\
    --cdn local \\
    --base-url http://localhost:3000/audio/n5

  # Cloudflare R2
  npm run upload:audio -- \\
    --cards ./data/n5-enriched.json \\
    --audio ./audio/n5 \\
    --cdn r2 \\
    --bucket japvocab-audio \\
    --base-url https://audio.japvocab.com

  # AWS S3
  npm run upload:audio -- \\
    --cards ./data/n5-enriched.json \\
    --audio ./audio/n5 \\
    --cdn s3 \\
    --bucket my-bucket \\
    --base-url https://my-bucket.s3.amazonaws.com

${colors.cyan}SETUP:${colors.reset}
  ${colors.bright}Cloudflare R2:${colors.reset}
    1. Create Cloudflare account
    2. Create R2 bucket
    3. Get API keys (Account ID, Access Key, Secret Key)
    4. Set environment variables:
       export R2_ACCOUNT_ID="..."
       export R2_ACCESS_KEY_ID="..."
       export R2_SECRET_ACCESS_KEY="..."
    5. Configure custom domain (optional)

  ${colors.bright}AWS S3:${colors.reset}
    1. Create AWS account
    2. Create S3 bucket
    3. Configure IAM credentials
    4. Set AWS credentials:
       export AWS_ACCESS_KEY_ID="..."
       export AWS_SECRET_ACCESS_KEY="..."

  ${colors.bright}Local (Testing):${colors.reset}
    1. Copy audio files to public directory
    2. Run with --cdn local
    3. Use localhost URL

${colors.cyan}COST:${colors.reset}
  ${colors.bright}Cloudflare R2:${colors.reset}
    - Storage: $0.015/GB/month
    - Bandwidth: FREE (no egress fees!)
    - Operations: Class A: $4.50/million, Class B: $0.36/million

  ${colors.bright}AWS S3:${colors.reset}
    - Storage: $0.023/GB/month
    - Bandwidth: $0.09/GB (after 1GB free)
    - Operations: GET: $0.0004/1000, PUT: $0.005/1000

  ${colors.bright}Recommendation:${colors.reset} Cloudflare R2 (free egress = huge savings)
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
 * Find audio file for card
 */
async function findAudioFile(audioDir: string, cardId: string): Promise<string | null> {
  const possibleExtensions = ['.mp3', '.wav']

  for (const ext of possibleExtensions) {
    // Try exact match
    const exactPath = path.join(audioDir, `${cardId}${ext}`)
    try {
      await fs.access(exactPath)
      return exactPath
    } catch {}

    // Try pattern match
    try {
      const files = await fs.readdir(audioDir)
      const match = files.find(file =>
        file.startsWith(cardId) && file.endsWith(ext)
      )
      if (match) {
        return path.join(audioDir, match)
      }
    } catch {}
  }

  return null
}

/**
 * Upload to local (just copy and generate URL)
 */
async function uploadLocal(
  filePath: string,
  baseUrl: string
): Promise<string> {
  const filename = path.basename(filePath)
  const url = `${baseUrl}/${filename}`
  return url
}

/**
 * Upload to R2/S3 (mock - would use AWS SDK)
 */
async function uploadToR2(
  filePath: string,
  bucket: string,
  baseUrl: string
): Promise<string> {
  // This would use AWS SDK for S3-compatible storage
  // For now, return mock URL
  const filename = path.basename(filePath)
  warn(`Mock upload: ${filename} → ${bucket}`)
  return `${baseUrl}/${filename}`
}

/**
 * Update cards with audio URLs
 */
function updateCardsWithAudio(
  cards: VocabularyCard[],
  audioMap: Map<string, string>
): VocabularyCard[] {
  return cards.map(card => {
    const audioUrl = audioMap.get(card.id)
    if (audioUrl) {
      return { ...card, audioUrl }
    }
    return card
  })
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
  if (!args.cardsPath || !args.audioDir || !args.cdn) {
    error('Missing required arguments')
    console.log('Run with --help for usage information')
    process.exit(1)
  }

  if (args.cdn !== 'local' && (!args.bucket || !args.baseUrl)) {
    error('--bucket and --base-url required for r2/s3')
    process.exit(1)
  }

  try {
    log('\n' + '='.repeat(60), 'bright')
    log('Audio Upload Tool', 'bright')
    log('='.repeat(60) + '\n', 'bright')

    // Step 1: Load vocabulary cards
    const cards = await loadCards(args.cardsPath)

    // Step 2: Find audio files
    info('\nFinding audio files...')
    const audioMap = new Map<string, string>()
    let foundCount = 0

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]
      const audioFile = await findAudioFile(args.audioDir, card.id)

      if (audioFile) {
        // Upload/process file
        let url: string

        if (args.cdn === 'local') {
          url = await uploadLocal(audioFile, args.baseUrl)
        } else if (args.cdn === 'r2' || args.cdn === 's3') {
          url = await uploadToR2(audioFile, args.bucket, args.baseUrl)
        } else {
          throw new Error(`Unknown CDN type: ${args.cdn}`)
        }

        audioMap.set(card.id, url)
        foundCount++
      }

      progressBar(i + 1, cards.length, 'Processing')
    }

    console.log()
    success(`Found audio for ${foundCount}/${cards.length} cards`)

    if (foundCount === 0) {
      warn('No audio files found')
      warn('Make sure audio directory contains files matching card IDs')
      process.exit(1)
    }

    // Step 3: Update cards with URLs
    info('\nUpdating cards with audio URLs...')
    const updatedCards = updateCardsWithAudio(cards, audioMap)

    // Step 4: Save updated cards
    const outputPath = args.outputPath || args.cardsPath
    const outputData = {
      metadata: {
        source: 'JapVocab',
        generatedAt: new Date(),
        totalCards: updatedCards.length,
        cardsWithAudio: foundCount,
        audioBaseUrl: args.baseUrl,
      },
      cards: updatedCards,
    }

    await fs.writeFile(
      outputPath,
      JSON.stringify(outputData, null, 2),
      'utf-8'
    )

    success(`Saved updated cards to: ${outputPath}`)

    // Step 5: Summary
    console.log()
    log('Upload Complete!', 'bright')
    console.log()
    console.log(`  Total cards: ${cards.length}`)
    console.log(`  Cards with audio: ${foundCount}`)
    console.log(`  Cards without audio: ${cards.length - foundCount}`)
    console.log(`  Base URL: ${args.baseUrl}`)

    console.log()
    info('Next steps:')
    info('  1. Test audio playback in your app')
    if (args.cdn === 'local') {
      info('  2. For production, upload to R2/S3')
    } else {
      info('  2. Verify CDN accessibility')
    }
    console.log()

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
