#!/usr/bin/env ts-node
/**
 * Audio Generation Script using Google Cloud Text-to-Speech
 *
 * Generates audio files for:
 * - All vocabulary words (kana)
 * - All example sentences (japanese)
 *
 * Prerequisites:
 * 1. Google Cloud account with Text-to-Speech API enabled
 * 2. Service account key JSON file
 * 3. Environment variable: GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
 * 4. Install: npm install @google-cloud/text-to-speech
 *
 * Usage:
 *   npm run generate:audio -- --input public/seed-data/n5-comprehensive.json --output-dir public/audio/n5
 *
 * Cost: FREE (covered by 1M characters/month free tier)
 * - Current dataset: ~11,000 characters = $0.18 (but FREE!)
 */

import * as fs from 'fs'
import * as path from 'path'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'

interface VocabCard {
  id: string
  kanji?: string
  kana: string
  meaning: string
  examples?: Array<{
    japanese: string
    english: string
    source: any
  }>
  [key: string]: any
}

interface SeedData {
  version: string
  metadata: any
  vocabulary: VocabCard[]
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
 * Generate audio file using Google Cloud TTS
 */
async function generateAudio(
  client: TextToSpeechClient,
  text: string,
  outputPath: string
): Promise<void> {
  // Construct the request
  const request = {
    input: { text },
    voice: {
      languageCode: 'ja-JP',
      name: 'ja-JP-Neural2-B', // Female voice
      // Alternatives: ja-JP-Neural2-C (Male), ja-JP-Neural2-D (Male)
    },
    audioConfig: {
      audioEncoding: 'MP3' as const,
      speakingRate: 0.9, // Slightly slower for language learning
      pitch: 0.0,
    },
  }

  try {
    const [response] = await client.synthesizeSpeech(request)

    if (!response.audioContent) {
      throw new Error('No audio content received')
    }

    // Write audio to file
    await fs.promises.writeFile(outputPath, response.audioContent, 'binary')
  } catch (error) {
    throw new Error(`Failed to generate audio: ${error}`)
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)

  let inputPath = 'public/seed-data/n5-comprehensive.json'
  let outputDir = 'public/audio/n5'
  let dryRun = false
  let skipExisting = true

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input') inputPath = args[++i]
    else if (args[i] === '--output-dir') outputDir = args[++i]
    else if (args[i] === '--dry-run') dryRun = true
    else if (args[i] === '--force') skipExisting = false
  }

  log('🎙️  Audio Generation with Google Cloud TTS', 'cyan')
  log(`   Input: ${inputPath}`)
  log(`   Output: ${outputDir}`)
  log(`   Dry run: ${dryRun}`)
  log(`   Skip existing: ${skipExisting}\n`)

  // Check for credentials
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !dryRun) {
    log('❌ ERROR: GOOGLE_APPLICATION_CREDENTIALS not set', 'red')
    log('\nSetup Instructions:', 'yellow')
    log('1. Create Google Cloud account: https://cloud.google.com/')
    log('2. Enable Text-to-Speech API')
    log('3. Create service account & download JSON key')
    log('4. Set environment variable:')
    log('   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json\n')
    process.exit(1)
  }

  // Create output directory
  await fs.promises.mkdir(outputDir, { recursive: true })
  await fs.promises.mkdir(path.join(outputDir, 'examples'), { recursive: true })

  // Load vocabulary data
  log('📥 Loading vocabulary data...', 'cyan')
  const content = await fs.promises.readFile(inputPath, 'utf-8')
  const data: SeedData = JSON.parse(content)
  log(`✅ Loaded ${data.vocabulary.length} cards\n`, 'green')

  // Initialize TTS client
  let client: TextToSpeechClient | null = null
  if (!dryRun) {
    client = new TextToSpeechClient()
    log('✅ Google Cloud TTS client initialized\n', 'green')
  }

  // Statistics
  let vocabGenerated = 0
  let vocabSkipped = 0
  let examplesGenerated = 0
  let examplesSkipped = 0
  let totalChars = 0
  let errors = 0

  // Generate audio for each vocabulary word
  log('🎤 Generating vocabulary audio...', 'cyan')
  for (const card of data.vocabulary) {
    const audioPath = path.join(outputDir, `${card.id}.mp3`)

    if (skipExisting && fs.existsSync(audioPath)) {
      vocabSkipped++
      continue
    }

    totalChars += card.kana.length

    if (dryRun) {
      log(`  [DRY RUN] Would generate: ${card.id}.mp3 (${card.kana})`, 'yellow')
      vocabGenerated++
    } else {
      try {
        await generateAudio(client!, card.kana, audioPath)
        vocabGenerated++

        if (vocabGenerated % 50 === 0) {
          log(`  Generated ${vocabGenerated} vocab audio files...`, 'cyan')
        }
      } catch (error) {
        log(`  ❌ Error generating ${card.id}: ${error}`, 'red')
        errors++
      }
    }
  }

  log(`✅ Vocabulary audio: ${vocabGenerated} generated, ${vocabSkipped} skipped\n`, 'green')

  // Generate audio for example sentences
  log('🎤 Generating example audio...', 'cyan')
  for (const card of data.vocabulary) {
    if (!card.examples || card.examples.length === 0) continue

    for (let i = 0; i < card.examples.length; i++) {
      const example = card.examples[i]
      const examplePath = path.join(outputDir, 'examples', `${card.id}_ex${i + 1}.mp3`)

      if (skipExisting && fs.existsSync(examplePath)) {
        examplesSkipped++
        continue
      }

      totalChars += example.japanese.length

      if (dryRun) {
        log(`  [DRY RUN] Would generate: ${card.id}_ex${i + 1}.mp3 (${example.japanese})`, 'yellow')
        examplesGenerated++
      } else {
        try {
          await generateAudio(client!, example.japanese, examplePath)
          examplesGenerated++

          if (examplesGenerated % 100 === 0) {
            log(`  Generated ${examplesGenerated} example audio files...`, 'cyan')
          }
        } catch (error) {
          log(`  ❌ Error generating ${card.id}_ex${i + 1}: ${error}`, 'red')
          errors++
        }
      }
    }
  }

  log(`✅ Example audio: ${examplesGenerated} generated, ${examplesSkipped} skipped\n`, 'green')

  // Calculate costs
  const costPerMillion = 16.00 // Neural2 voices
  const estimatedCost = (totalChars / 1000000) * costPerMillion

  // Summary
  log('📊 Summary:', 'cyan')
  log(`   Vocabulary audio: ${vocabGenerated} generated, ${vocabSkipped} skipped`)
  log(`   Example audio: ${examplesGenerated} generated, ${examplesSkipped} skipped`)
  log(`   Total audio files: ${vocabGenerated + examplesGenerated}`)
  log(`   Total characters: ${totalChars.toLocaleString()}`)
  log(`   Estimated cost: $${estimatedCost.toFixed(4)} (FREE - covered by free tier!)`)
  log(`   Errors: ${errors}\n`)

  if (dryRun) {
    log('🔔 This was a dry run. Use without --dry-run to generate actual audio.', 'yellow')
  } else {
    log('🎉 Audio generation complete!', 'green')
  }
}

main().catch(err => {
  log(`\n❌ Error: ${err.message}`, 'red')
  console.error(err)
  process.exit(1)
})
