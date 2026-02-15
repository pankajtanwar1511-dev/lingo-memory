import fs from 'fs'
import path from 'path'

export interface DuolingoWord {
  id: string
  japanese: string
  english: string
  type: WordType
  exampleSentence: {
    japanese: string
    english: string
  }
}

export type WordType =
  | 'verb'
  | 'noun'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'particle'
  | 'counter'
  | 'pronoun'
  | 'other'

// Classify word types based on JAPANESE word structure
function classifyWordType(english: string, japanese: string): WordType {
  // Remove spaces for analysis
  const jp = japanese.trim()

  // VERBS: Japanese verb forms
  // ます-form verbs (polite present/future)
  if (jp.endsWith('ます') || jp.endsWith('ません')) {
    return 'verb'
  }

  // ました-form (past tense)
  if (jp.endsWith('ました') || jp.endsWith('ませんでした')) {
    return 'verb'
  }

  // たいです form (want to)
  if (jp.endsWith('たいです') || jp.endsWith('たくないです') || jp.endsWith('たい')) {
    return 'verb'
  }

  // ましょう form (let's)
  if (jp.endsWith('ましょう') || jp.endsWith('ましょうか')) {
    return 'verb'
  }

  // ませんか form (won't you / shall we)
  if (jp.endsWith('ませんか')) {
    return 'verb'
  }

  // て-form variations
  if (jp.endsWith('ています') || jp.endsWith('ていません') || jp.endsWith('てください')) {
    return 'verb'
  }

  // Dictionary form patterns (common verb endings)
  if (jp.match(/[るくぐすつぬぶむう]$/)) {
    // Additional check: if it contains します、きます、etc
    if (jp.includes('します') || jp.includes('きます') || jp.includes('いきます')) {
      return 'verb'
    }
  }

  // I-ADJECTIVES: Common い-adjectives (descriptive words ending in い)
  if (
    jp.match(/^(大きい|小さい|おおきい|ちいさい|高い|安い|たかい|やすい|新しい|古い|あたらしい|ふるい|暑い|寒い|あつい|さむい|温かい|涼しい|あたたかい|すずしい|美味しい|まずい|おいしい|良い|悪い|いい|わるい|よい|長い|短い|ながい|みじかい|広い|狭い|ひろい|せまい|重い|軽い|おもい|かるい|速い|遅い|早い|はやい|おそい|近い|遠い|ちかい|とおい|明るい|暗い|あかるい|くらい|騒い|静か|うるさい|しずか|辛い|甘い|からい|あまい|塩っぱい|酸っぱい|しょっぱい|すっぱい|難しい|易しい|優しい|むずかしい|やさしい|楽しい|つまらない|たのしい|忙しい|暇|いそがしい|ひま|眠い|冷たい|ねむい|つめたい|危ない|怖い|恐い|あぶない|こわい|可愛い|格好いい|かわいい|かっこいい|面白い|おもしろい|ダサい|素敵|すてき|欲しい|ほしい|多い|少ない|おおい|すくない|若い|わかい|低い|ひくい)$/)
  ) {
    return 'adjective'
  }

  // Negative adjectives (くない form)
  if (jp.endsWith('くない') || jp.endsWith('くありません') || jp.endsWith('くなかった')) {
    return 'adjective'
  }

  // NA-ADJECTIVES (descriptive nouns that need な)
  if (
    jp.match(/^(きれい|綺麗|有名|ゆうめい|静か|しずか|賑やか|にぎやか|便利|不便|べんり|ふべん|元気|げんき|親切|しんせつ|大変|たいへん|素敵|すてき|暇|ひま|大丈夫|だいじょうぶ|人気|にんき|簡単|かんたん|複雑|ふくざつ|自由|じゆう|特別|とくべつ|安全|あんぜん|危険|きけん|必要|ひつよう|大切|たいせつ|同じ|おなじ|好き|嫌い|すき|きらい)$/)
  ) {
    return 'adjective'
  }

  // ADVERBS: True adverbs only (frequency, degree, manner)
  // Excludes time nouns which should be classified as nouns
  if (
    jp.match(/^(いつも|よく|ときどき|あまり|ぜんぜん|とても|ちょっと|もっと|すこし|たくさん|もう|まだ|また|ゆっくり|はやく|ちゃんと|ほんとうに|たぶん|まず|そろそろ|もうすぐ|すぐ|あまり)$/)
  ) {
    return 'adverb'
  }

  // Conjunctions (connecting words) - treating as adverbs for simplicity
  if (jp.match(/^(そして|でも|だから|または|しかし)$/)) {
    return 'adverb'
  }

  // PARTICLES: Short grammatical particles
  if (jp.length <= 2 && jp.match(/^(は|が|を|に|で|と|の|へ|から|まで|より|か|ね|よ|な|や)$/)) {
    return 'particle'
  }

  // COUNTERS: Only specific number + counter patterns
  // Must be a number followed by counter, or specific counter words
  if (
    // Kanji numbers at start
    jp.match(/^[一二三四五六七八九十百千万]+[つ人匹本枚個冊台杯階時分日月年歳]/) ||
    // Hiragana numbers
    jp.match(/^(ひとつ|ふたつ|みっつ|よっつ|いつつ|むっつ|ななつ|やっつ|ここのつ|とお)$/) ||
    jp.match(/^(ひとり|ふたり|さんにん|よにん|ごにん)/) ||
    jp.match(/^(いっぴき|にひき|さんびき|よんひき|ごひき)/) ||
    // O'clock times
    jp.match(/^[一二三四五六七八九十]+(時|じ)$/) ||
    // Specific counter patterns with numbers
    jp.match(/^[一二三四五六七八九十]+(人|匹|本|枚|個|冊|台|杯|階|分|日|月|年|歳|円|ドル)$/) ||
    // Written out numbers
    jp.match(/^(なな|はち|きゅう|じゅう|ひゃく|せん|まん|いち|に|さん|し|よん|ご|ろく|しち)+(にん|ひき|ほん|まい|こ|さつ|だい|はい|かい|ふん|ぷん|にち|がつ|ねん|さい|えん)$/)
  ) {
    return 'counter'
  }

  // PHRASES: Multi-word expressions or longer expressions
  if (
    jp.length > 8 ||
    jp.includes('ありがとうございます') ||
    jp.includes('おねがいします') ||
    jp.includes('いらっしゃいませ') ||
    jp.includes('はじめまして') ||
    jp.includes('よろしく') ||
    jp.includes('すみません') ||
    jp.includes('ございます')
  ) {
    return 'phrase'
  }

  // Default: NOUN
  // Most standalone words without special endings are nouns
  return 'noun'
}

// Generate dummy example sentences
function generateDummySentence(japanese: string, english: string, type: WordType): { japanese: string, english: string } {
  const sentences = {
    verb: [
      { japanese: `${japanese}たいです`, english: `I want to ${english}` },
      { japanese: `毎日${japanese}ます`, english: `I ${english} every day` },
      { japanese: `昨日${japanese}ました`, english: `I ${english}ed yesterday` }
    ],
    noun: [
      { japanese: `これは${japanese}です`, english: `This is a ${english}` },
      { japanese: `${japanese}が好きです`, english: `I like ${english}` },
      { japanese: `${japanese}を買いました`, english: `I bought a ${english}` }
    ],
    adjective: [
      { japanese: `とても${japanese}です`, english: `It's very ${english}` },
      { japanese: `${japanese}部屋`, english: `A ${english} room` },
      { japanese: `今日は${japanese}ですね`, english: `Today is ${english}, isn't it?` }
    ],
    adverb: [
      { japanese: `${japanese}行きます`, english: `I go ${english}` },
      { japanese: `${japanese}食べます`, english: `I eat ${english}` },
      { japanese: `${japanese}です`, english: `It's ${english}` }
    ],
    phrase: [
      { japanese: japanese, english: english },
      { japanese: `「${japanese}」と言いました`, english: `I said "${english}"` },
      { japanese: japanese, english: english }
    ],
    particle: [
      { japanese: `日本${japanese}行きます`, english: `I go to Japan` },
      { japanese: `友達${japanese}話します`, english: `I talk with friends` },
      { japanese: japanese, english: english }
    ],
    counter: [
      { japanese: `${japanese}あります`, english: `There are ${english}` },
      { japanese: `${japanese}ください`, english: `${english}, please` },
      { japanese: japanese, english: english }
    ],
    pronoun: [
      { japanese: `${japanese}は学生です`, english: `${english} am/is/are a student` },
      { japanese: `${japanese}が好きです`, english: `I like ${english}` },
      { japanese: japanese, english: english }
    ],
    other: [
      { japanese: japanese, english: english },
      { japanese: `${japanese}です`, english: `It's ${english}` },
      { japanese: japanese, english: english }
    ]
  }

  const options = sentences[type as keyof typeof sentences] || sentences.other
  return options[Math.floor(Math.random() * options.length)]
}

export function parseDataFile(filePath: string): DuolingoWord[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').map(line => line.trim())

  const words: DuolingoWord[] = []

  for (let i = 0; i < lines.length; i += 3) {
    const japanese = lines[i]
    const english = lines[i + 1]

    if (!japanese || !english) continue

    const type = classifyWordType(english, japanese)
    const exampleSentence = generateDummySentence(japanese, english, type)

    words.push({
      id: `duo_${i / 3}`,
      japanese,
      english,
      type,
      exampleSentence
    })
  }

  return words
}

// CLI entry point for generating the JSON
export function generateVocabData() {
  const dataFilePath = path.join(process.cwd(), 'duolingo', 'data.txt')
  const outputPath = path.join(process.cwd(), 'public', 'seed-data', 'duolingo_vocab_enhanced.json')

  console.log('📖 Reading data.txt...')
  const words = parseDataFile(dataFilePath)

  console.log(`✅ Parsed ${words.length} words`)
  console.log(`📊 Type distribution:`)
  const typeCounts = words.reduce((acc, w) => {
    acc[w.type] = (acc[w.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count}`)
  })

  // Write to file
  fs.writeFileSync(outputPath, JSON.stringify(words, null, 2))
  console.log(`\n💾 Saved to ${outputPath}`)
}

// Run if executed directly
const isRunDirectly = process.argv[1] && (
  process.argv[1].endsWith('duolingo-parser.ts') ||
  process.argv[1].endsWith('duolingo-parser.js')
)

if (isRunDirectly) {
  generateVocabData()
}
