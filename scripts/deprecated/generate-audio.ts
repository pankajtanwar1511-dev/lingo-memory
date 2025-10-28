#!/usr/bin/env ts-node
/**
 * Audio Generation CLI Tool
 *
 * Generates audio files for vocabulary cards using Google Cloud Text-to-Speech
 *
 * Usage:
 *   npm run generate:audio -- --cards ./n5-enriched.json --output ./audio/n5 --voice female-standard
 *   ts-node scripts/generate-audio.ts --cards ./n5-enriched.json --output ./audio/n5
 *
 * Options:
 *   --cards <path>       Path to vocabulary cards JSON file (required)
 *   --output <path>      Output directory for audio files (required)
 *   --voice <voice>      Voice to use (default: female-standard)
 *   --speed <speed>      Speech speed: slow/normal/fast (default: normal)
 *   --format <format>    Audio format: mp3/wav (default: mp3)
 *   --examples          Also generate audio for example sentences
 *   --concurrent <n>     Number of concurrent requests (default: 5)
 *   --dry-run           Preview without generating
 *   --help              Show help
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { createAudioGenerator, AudioVoice, AudioSpeed } from '../src/services/audio-generator.service'
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
      case '--output':
        parsed.outputPath = args[++i]
        break
      case '--voice':
        parsed.voice = args[++i] as AudioVoice
        break
      case '--speed':
        parsed.speed = args[++i] as AudioSpeed
        break
      case '--format':
        parsed.format = args[++i]
        break
      case '--examples':
        parsed.includeExamples = true
        break
      case '--concurrent':
        parsed.concurrent = parseInt(args[++i], 10)
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
${colors.bright}Audio Generation CLI Tool${colors.reset}

${colors.cyan}USAGE:${colors.reset}
  npm run generate:audio -- [options]
  ts-node scripts/generate-audio.ts [options]

${colors.cyan}OPTIONS:${colors.reset}
  --cards <path>         Path to vocabulary cards JSON file (required)
  --output <path>        Output directory for audio files (required)
  --voice <voice>        Voice to use (default: female-standard)
                         Options: female-standard, female-premium, male-standard, male-premium
  --speed <speed>        Speech speed: slow/normal/fast (default: normal)
  --format <format>      Audio format: mp3/wav (default: mp3)
  --examples             Also generate audio for example sentences
  --concurrent <n>       Concurrent requests (default: 5, max: 10)
  --dry-run              Preview without generating
  --help, -h             Show this help message

${colors.cyan}VOICE OPTIONS:${colors.reset}
  female-standard        Standard female voice ($4/1M chars)
  female-premium         Premium neural female voice ($16/1M chars) - Most natural
  male-standard          Standard male voice ($4/1M chars)
  male-premium           Premium neural male voice ($16/1M chars)

${colors.cyan}EXAMPLES:${colors.reset}
  # Generate with default settings
  npm run generate:audio -- \\
    --cards ./data/n5-enriched.json \\
    --output ./public/audio/n5

  # Premium voice for top words
  npm run generate:audio -- \\
    --cards ./data/n5-top200.json \\
    --output ./public/audio/n5-premium \\
    --voice female-premium

  # Include example sentences
  npm run generate:audio -- \\
    --cards ./data/n5-enriched.json \\
    --output ./public/audio/n5 \\
    --examples

  # Slow speed for beginners
  npm run generate:audio -- \\
    --cards ./data/n5-enriched.json \\
    --output ./public/audio/n5-slow \\
    --speed slow

  # Dry run to preview
  npm run generate:audio -- \\
    --cards ./data/n5-enriched.json \\
    --output ./public/audio/n5 \\
    --dry-run

${colors.cyan}PREREQUISITES:${colors.reset}
  1. Google Cloud account
  2. Text-to-Speech API enabled
  3. Service account credentials
  4. Environment variable: GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

${colors.cyan}SETUP:${colors.reset}
  1. Create Google Cloud project: https://console.cloud.google.com
  2. Enable Text-to-Speech API
  3. Create service account and download JSON key
  4. Set environment variable:
     export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
  5. Install package:
     npm install @google-cloud/text-to-speech

${colors.cyan}COST ESTIMATION:${colors.reset}
  Standard voices: $4 per 1 million characters
  Premium voices: $16 per 1 million characters

  Example: 800 N5 words × 3 chars avg = 2,400 chars ≈ $0.01 (standard) or $0.04 (premium)
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
 * Generate filename for audio
 */
function generateAudioFilename(text: string, cardId: string, suffix: string = ''): string {
  // Clean text for filename (remove special chars)
  const cleaned = text.replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\w]/g, '')
  const truncated = cleaned.slice(0, 20)

  // Use card ID as base
  const base = cardId.replace(/[^a-z0-9_-]/gi, '_')

  return `${base}${suffix ? '_' + suffix : ''}.mp3`
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
 * Format file size
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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

  if (!args.outputPath) {
    error('Missing required argument: --output')
    console.log('Run with --help for usage information')
    process.exit(1)
  }

  try {
    log('\n' + '='.repeat(60), 'bright')
    log('Audio Generation Tool', 'bright')
    log('='.repeat(60) + '\n', 'bright')

    // Step 1: Load vocabulary cards
    const cards = await loadCards(args.cardsPath)

    // Step 2: Initialize audio generator
    const audioGen = await createAudioGenerator()

    if (audioGen.isMockMode()) {
      warn('\n⚠️  Running in MOCK MODE')
      warn('   Audio files will be dummy files for testing')
      warn('   To generate real audio:')
      warn('   1. Set up Google Cloud credentials')
      warn('   2. Install: npm install @google-cloud/text-to-speech')
      warn('   3. Set GOOGLE_APPLICATION_CREDENTIALS environment variable\n')
    } else {
      success('Google Cloud TTS client ready')
    }

    // Step 3: Configure options
    const voice: AudioVoice = args.voice || 'female-standard'
    const speed: AudioSpeed = args.speed || 'normal'
    const format = args.format || 'mp3'
    const includeExamples = args.includeExamples || false

    info('\nAudio Generation Settings:')
    info(`  Voice: ${voice}`)
    info(`  Speed: ${speed}`)
    info(`  Format: ${format}`)
    info(`  Include examples: ${includeExamples ? 'Yes' : 'No'}`)

    // Step 4: Prepare audio generation items
    const items: Array<{ text: string; outputPath: string; cardId: string }> = []

    for (const card of cards) {
      const outputDir = path.resolve(args.outputPath)

      // Main word audio
      const wordText = card.kanji || card.kana
      const wordFilename = generateAudioFilename(wordText, card.id)
      items.push({
        text: wordText,
        outputPath: path.join(outputDir, wordFilename),
        cardId: card.id,
      })

      // Example sentences audio (if requested)
      if (includeExamples && card.examples) {
        card.examples.forEach((example, idx) => {
          const exampleFilename = generateAudioFilename(example.japanese, card.id, `ex${idx + 1}`)
          items.push({
            text: example.japanese,
            outputPath: path.join(outputDir, exampleFilename),
            cardId: card.id,
          })
        })
      }
    }

    info(`\nTotal audio files to generate: ${items.length}`)

    // Step 5: Estimate cost
    const texts = items.map(item => item.text)
    const costEstimate = audioGen.estimateBatchCost(texts, voice)

    console.log('\nCost Estimation:')
    console.log(`  Total characters: ${costEstimate.characters.toLocaleString()}`)
    console.log(`  Estimated cost: $${costEstimate.cost.toFixed(4)}`)

    // Step 6: Dry run check
    if (args.dryRun) {
      warn('\nDry run complete - no files were generated')
      warn('Remove --dry-run to generate audio files')
      console.log()
      process.exit(0)
    }

    // Step 7: Generate audio files
    console.log()
    log('Generating audio files...', 'bright')
    console.log()

    let totalSize = 0

    const result = await audioGen.generateBatch(
      items,
      { voice, speed, format: format as 'mp3' | 'wav' },
      {
        onProgress: (current: number, total: number) => {
          progressBar(current, total, 'Progress')
        },
        onSuccess: (genResult: any) => {
          if (genResult.fileSize) {
            totalSize += genResult.fileSize
          }
        },
        onError: (genResult: any) => {
          // Errors are collected in result.errors
        },
        onSkip: () => {
          // File already exists, skipped
        },
      }
    )

    // Step 8: Show results
    console.log()
    log('Generation Complete!', 'bright')
    console.log()
    console.log(`  Total: ${result.total}`)
    success(`  Successful: ${result.successful}`)
    info(`  Skipped (already exist): ${result.skipped}`)
    if (result.failed > 0) {
      error(`  Failed: ${result.failed}`)
    }
    console.log(`  Total size: ${formatFileSize(totalSize)}`)

    // Show errors if any
    if (result.errors.length > 0) {
      console.log()
      warn('Errors encountered:')
      result.errors.slice(0, 10).forEach(err => {
        console.log(`  "${err.text}": ${err.error}`)
      })
      if (result.errors.length > 10) {
        console.log(`  ... and ${result.errors.length - 10} more errors`)
      }
    }

    console.log()
    info('Next steps:')
    if (!audioGen.isMockMode()) {
      info('  1. Test audio playback in your app')
      info('  2. Update vocabulary cards with audio URLs')
      info('  3. Upload to CDN for production use')
    } else {
      info('  1. Set up Google Cloud credentials')
      info('  2. Re-run to generate real audio')
    }
    console.log()

    process.exit(result.failed > 0 ? 1 : 0)

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
