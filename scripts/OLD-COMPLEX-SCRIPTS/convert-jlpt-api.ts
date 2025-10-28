#!/usr/bin/env ts-node
/**
 * JLPT API Format Converter
 *
 * Converts JLPT Vocabulary API format to our pipeline format
 */

import * as fs from 'fs/promises'
import * as path from 'path'

interface JLPTAPIWord {
  word: string
  meaning: string
  furigana: string
  romaji: string
  level: number
}

interface VocabularyCard {
  id: string
  kanji?: string
  kana: string
  meaning: string
  jlptLevel: string
  partOfSpeech?: string[]
  examples: any[]
  source: {
    type: string
    url: string
  }
}

async function convertJLPTAPI(inputPath: string, outputPath: string) {
  console.log('🔄 Converting JLPT API format to pipeline format...\n')

  // Read input file
  const content = await fs.readFile(inputPath, 'utf-8')
  const apiWords: JLPTAPIWord[] = JSON.parse(content)

  console.log(`📥 Loaded ${apiWords.length} words from JLPT API`)

  // Convert to our format
  const cards: VocabularyCard[] = apiWords.map((word, index) => {
    const levelMap: Record<number, string> = {
      5: 'N5',
      4: 'N4',
      3: 'N3',
      2: 'N2',
      1: 'N1'
    }

    const jlptLevel = levelMap[word.level] || 'N5'
    const hasKanji = word.word !== word.furigana && /[\u4e00-\u9faf]/.test(word.word)

    return {
      id: `${jlptLevel.toLowerCase()}_jlpt_${String(index + 1).padStart(4, '0')}`,
      ...(hasKanji ? { kanji: word.word } : {}),
      kana: word.furigana || word.word,
      meaning: word.meaning,
      jlptLevel,
      partOfSpeech: [], // Not available from API
      examples: [],
      source: {
        type: 'jlpt-vocab-api',
        url: 'https://jlpt-vocab-api.vercel.app'
      }
    }
  })

  // Create output
  const output = {
    metadata: {
      source: 'JLPT Vocabulary API',
      sourceUrl: 'https://jlpt-vocab-api.vercel.app',
      jlptLevel: 'N5',
      generatedAt: new Date().toISOString(),
      totalCards: cards.length,
      attribution: 'JLPT level data from JLPT Vocabulary API. Original vocabulary based on JLPT official test specifications.',
      license: 'Unspecified (using with attribution)'
    },
    cards
  }

  // Write output
  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf-8')

  console.log(`\n✅ Converted ${cards.length} cards`)
  console.log(`✅ Saved to: ${outputPath}`)

  // Statistics
  const withKanji = cards.filter(c => c.kanji).length
  const kanaOnly = cards.length - withKanji

  console.log(`\n📊 Statistics:`)
  console.log(`   Cards with kanji: ${withKanji}`)
  console.log(`   Kana only: ${kanaOnly}`)
  console.log(`   JLPT Level: N5`)
}

// Run if called directly (ES module compatible)
const isMainModule = import.meta.url === `file://${process.argv[1]}`

if (isMainModule) {
  const inputPath = process.argv[2] || 'data/source/jlpt-n5-words.json'
  const outputPath = process.argv[3] || 'data/n5-all.json'

  convertJLPTAPI(path.resolve(inputPath), path.resolve(outputPath))
    .then(() => {
      console.log('\n🎉 Conversion complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Error:', error.message)
      process.exit(1)
    })
}

export { convertJLPTAPI }
