#!/usr/bin/env ts-node
/**
 * Link Audio URLs to Vocabulary Cards
 *
 * Scans generated audio files and adds audioUrl fields to:
 * - Vocabulary cards (kana pronunciation)
 * - Example sentences
 *
 * Only adds URLs if the corresponding audio file exists.
 *
 * Usage:
 *   npm run link:audio -- --input public/seed-data/n5-comprehensive.json --audio-dir public/audio/n5
 */

import * as fs from 'fs'
import * as path from 'path'

interface Example {
  japanese: string
  english: string
  source: any
  audioUrl?: string
}

interface VocabCard {
  id: string
  kanji?: string
  kana: string
  meaning: string
  examples?: Example[]
  audioUrl?: string
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

async function linkAudioUrls(inputPath: string, audioDir: string) {
  log('🔗 Linking audio URLs to vocabulary cards...', 'cyan')
  log(`   Input: ${inputPath}`)
  log(`   Audio dir: ${audioDir}\n`)

  // Read input
  const content = await fs.promises.readFile(inputPath, 'utf-8')
  const data: SeedData = JSON.parse(content)

  log(`📥 Loaded ${data.vocabulary.length} cards\n`, 'green')

  let vocabLinked = 0
  let vocabMissing = 0
  let examplesLinked = 0
  let examplesMissing = 0

  // Process each card
  for (const card of data.vocabulary) {
    // Determine level from card ID (e.g., "n5_jlpt_0001" -> "n5")
    const level = card.id.split('_')[0]

    // Check if vocabulary audio file exists
    const vocabAudioPath = path.join(audioDir, `${card.id}.mp3`)
    if (fs.existsSync(vocabAudioPath)) {
      card.audioUrl = `/audio/${level}/${card.id}.mp3`
      vocabLinked++
    } else {
      vocabMissing++
      // Remove audioUrl if it exists but file doesn't
      delete card.audioUrl
    }

    // Process examples
    if (card.examples && card.examples.length > 0) {
      for (let i = 0; i < card.examples.length; i++) {
        const example = card.examples[i]
        const exampleAudioPath = path.join(audioDir, 'examples', `${card.id}_ex${i + 1}.mp3`)

        if (fs.existsSync(exampleAudioPath)) {
          example.audioUrl = `/audio/${level}/examples/${card.id}_ex${i + 1}.mp3`
          examplesLinked++
        } else {
          examplesMissing++
          // Remove audioUrl if it exists but file doesn't
          delete example.audioUrl
        }
      }
    }
  }

  // Save updated data
  await fs.promises.writeFile(inputPath, JSON.stringify(data, null, 2))

  // Summary
  log('📊 Summary:', 'cyan')
  log(`   Vocabulary audio: ${vocabLinked} linked, ${vocabMissing} missing`)
  log(`   Example audio: ${examplesLinked} linked, ${examplesMissing} missing`)
  log(`   Total audio URLs: ${vocabLinked + examplesLinked}\n`)

  if (vocabMissing > 0 || examplesMissing > 0) {
    log('⚠️  Some audio files are missing. Run audio generation first:', 'yellow')
    log('   npm run generate:audio\n')
  }

  log(`✅ Saved to: ${inputPath}`, 'green')
}

// Parse args
const args = process.argv.slice(2)
let inputPath = 'public/seed-data/n5-comprehensive.json'
let audioDir = 'public/audio/n5'

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--input') inputPath = args[++i]
  else if (args[i] === '--audio-dir') audioDir = args[++i]
}

linkAudioUrls(inputPath, audioDir)
  .then(() => log('\n🎉 Done!', 'green'))
  .catch(err => {
    log(`\n❌ Error: ${err.message}`, 'red')
    console.error(err)
    process.exit(1)
  })
