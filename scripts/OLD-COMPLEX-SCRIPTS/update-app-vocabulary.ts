#!/usr/bin/env ts-node
/**
 * Update App Vocabulary Data
 *
 * Converts pipeline-generated vocabulary JSON to TypeScript format
 * for the Next.js application
 */

import * as fs from 'fs/promises'
import * as path from 'path'

interface PipelineCard {
  id: string
  kanji?: string
  kana: string
  meaning: string
  jlptLevel: string
  partOfSpeech?: string[]
  examples: Array<{
    japanese: string
    english: string
    source: {
      type: string
      id?: number
    }
  }>
  source: {
    type: string
    url: string
  }
}

interface AppCard {
  id: string
  kanji?: string
  kana: string
  meaning: string
  examples: Array<{
    japanese: string
    hiragana?: string
    english: string
    source: {
      type: 'tatoeba' | 'jmdict' | 'custom'
      id?: string | number
    }
  }>
  audioUrl?: string
  tags?: string[]
  jlptLevel?: string
  partOfSpeech?: string[]
  license?: {
    text: string
    url?: string
  }
}

async function convertToAppFormat(inputPath: string, outputPath: string) {
  console.log('🔄 Converting pipeline data to app format...\n')

  // Read pipeline data
  const content = await fs.readFile(inputPath, 'utf-8')
  const data = JSON.parse(content)
  const pipelineCards: PipelineCard[] = data.cards || []

  console.log(`📥 Loaded ${pipelineCards.length} cards from pipeline`)

  // Convert to app format
  const appCards: AppCard[] = pipelineCards.map((card) => {
    const appCard: AppCard = {
      id: card.id,
      kana: card.kana,
      meaning: card.meaning,
      examples: card.examples.map(ex => ({
        japanese: ex.japanese,
        english: ex.english,
        source: {
          type: ex.source.type as 'tatoeba' | 'jmdict' | 'custom',
          id: ex.source.id
        }
      })),
      jlptLevel: card.jlptLevel,
      partOfSpeech: card.partOfSpeech || [],
      license: {
        text: 'JLPT Vocabulary API + CC BY 2.0 FR (Tatoeba)',
        url: 'https://creativecommons.org/licenses/by/2.0/'
      }
    }

    // Add kanji if present
    if (card.kanji) {
      appCard.kanji = card.kanji
    }

    // Add audio URL (assuming audio files exist in public/audio/n5/)
    appCard.audioUrl = `/audio/n5/${card.id}.mp3`

    // Add tags based on content
    const tags: string[] = []
    if (card.examples.length > 0) tags.push('with-examples')
    if (card.kanji) tags.push('kanji')
    if (!card.kanji) tags.push('kana-only')
    appCard.tags = tags

    return appCard
  })

  // Generate TypeScript file
  const tsContent = generateTypeScriptFile(appCards)
  await fs.writeFile(outputPath, tsContent, 'utf-8')

  console.log(`\n✅ Converted ${appCards.length} cards`)
  console.log(`✅ Saved to: ${outputPath}`)

  // Statistics
  const withKanji = appCards.filter(c => c.kanji).length
  const withExamples = appCards.filter(c => c.examples.length > 0).length
  const kanaOnly = appCards.length - withKanji

  console.log(`\n📊 Statistics:`)
  console.log(`   Total cards: ${appCards.length}`)
  console.log(`   Cards with kanji: ${withKanji}`)
  console.log(`   Kana only: ${kanaOnly}`)
  console.log(`   Cards with examples: ${withExamples}`)
  console.log(`   JLPT Level: N5`)
}

function generateTypeScriptFile(cards: AppCard[]): string {
  const header = `import { VocabularyCard } from "@/types/vocabulary"

/**
 * Comprehensive JLPT N5 Vocabulary Dataset
 *
 * Generated from: JLPT Vocabulary API (https://jlpt-vocab-api.vercel.app)
 * Examples from: Tatoeba Project - CC BY 2.0 FR
 * Generated at: ${new Date().toISOString()}
 *
 * Total cards: ${cards.length}
 *
 * This dataset contains essential N5 vocabulary with authentic example sentences.
 * All content is properly attributed and licensed for educational use.
 */

export const n5VocabularyFull: VocabularyCard[] = `

  const cardsJson = JSON.stringify(cards, null, 2)
    .replace(/"([^"]+)":/g, '$1:') // Remove quotes from keys
    .replace(/: "tatoeba"/g, ': "tatoeba" as const')
    .replace(/: "jmdict"/g, ': "jmdict" as const')
    .replace(/: "custom"/g, ': "custom" as const')

  return header + cardsJson + '\n'
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`

if (isMainModule) {
  const inputPath = process.argv[2] || 'data/n5-enriched.json'
  const outputPath = process.argv[3] || 'src/data/n5-vocabulary-full.ts'

  convertToAppFormat(path.resolve(inputPath), path.resolve(outputPath))
    .then(() => {
      console.log('\n🎉 App vocabulary updated!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Error:', error.message)
      process.exit(1)
    })
}

export { convertToAppFormat }
