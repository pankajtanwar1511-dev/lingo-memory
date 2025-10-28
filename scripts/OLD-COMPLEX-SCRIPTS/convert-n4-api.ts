#!/usr/bin/env ts-node
/**
 * Convert N4 API data to app format
 */

import * as fs from 'fs/promises'

interface APIWord {
  word: string
  meaning: string
  furigana: string
  romaji: string
  level: number
}

interface AppVocab {
  id: string
  kanji?: string
  kana: string
  meaning: string[]
  examples: any[]
  tags: string[]
  jlptLevel: string
  partOfSpeech: string[]
  license: {
    text: string
    url: string
  }
}

async function main() {
  console.log('🔄 Converting N4 API data to app format...')

  const input = await fs.readFile('/tmp/n4-api-raw.json', 'utf-8')
  const data = JSON.parse(input)

  console.log(`📥 Found ${data.words.length} N4 words`)

  const vocabulary: AppVocab[] = data.words.map((word: APIWord, index: number) => {
    const id = `n4_${String(index + 1).padStart(4, '0')}`

    // Determine if word has kanji
    const hasKanji = word.word !== word.furigana && word.furigana !== ''

    return {
      id,
      ...(hasKanji ? { kanji: word.word } : {}),
      kana: word.furigana || word.word,
      meaning: [word.meaning],
      examples: [], // Will be enriched later
      tags: ['vocabulary'],
      jlptLevel: 'N4',
      partOfSpeech: ['noun'], // Default, will be refined later
      license: {
        text: 'CC BY-SA 4.0',
        url: 'https://creativecommons.org/licenses/by-sa/4.0/'
      }
    }
  })

  const output = {
    version: '1.0.0',
    metadata: {
      source: 'JLPT Vocab API',
      createdAt: new Date().toISOString().split('T')[0],
      author: 'JapVocab Content Team',
      license: 'CC BY-SA 4.0',
      description: 'N4 vocabulary - auto-generated'
    },
    vocabulary
  }

  await fs.writeFile(
    'data/n4-all.json',
    JSON.stringify(output, null, 2),
    'utf-8'
  )

  console.log(`✅ Created data/n4-all.json with ${vocabulary.length} words`)
  console.log(`📊 Statistics:`)
  console.log(`   - Words with kanji: ${vocabulary.filter(v => v.kanji).length}`)
  console.log(`   - Kana only: ${vocabulary.filter(v => !v.kanji).length}`)
}

main().catch(console.error)
