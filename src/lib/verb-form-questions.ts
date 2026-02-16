/**
 * Verb Form Master - Question Generator
 *
 * Generates quiz questions from verb dataset for practicing conjugation forms
 * in context-based sentence completion exercises.
 */

export interface VerbFormQuestion {
  id: string
  sentence: string
  sentenceKana: string
  english: string

  verbId: string
  verbKanji: string
  verbMeaning: string

  correctForm: 'dictionary' | 'masu' | 'te' | 'ta' | 'nai' | 'masen'
  correctAnswer: string
  correctAnswerKana: string

  options: {
    form: string
    text: string
    kana: string
    isCorrect: boolean
  }[]

  context: string
  difficulty: 1 | 2 | 3
  explanation: string
}

export interface VerbData {
  id: string
  kanji: string
  kana: string
  primaryMeaning: string
  verbGroup: string
  conjugations: {
    dictionary: string
    dictionaryKana: string
    masu: string
    masuKana: string
    te: string
    teKana: string
    ta?: string
    taKana?: string
    nai?: string
    naiKana?: string
  }
  examples?: {
    japanese: string
    kana: string
    english: string
    highlight?: string
  }[]
}

/**
 * Generate た-form (past tense) from て-form
 */
function generateTaForm(teForm: string, teKana: string): { ta: string, taKana: string } {
  // て → た, で → だ
  const ta = teForm.replace(/て$/, 'た').replace(/で$/, 'だ')
  const taKana = teKana.replace(/て$/, 'た').replace(/で$/, 'だ')

  return { ta, taKana }
}

/**
 * Generate ない-form (negative) from dictionary form
 * Simplified version - handles most common N5 patterns
 */
function generateNaiForm(dictionary: string, dictionaryKana: string, verbGroup: string): { nai: string, naiKana: string } {
  if (verbGroup === 'Ichidan') {
    // る-verbs: 食べる → 食べない
    const nai = dictionary.replace(/る$/, 'ない')
    const naiKana = dictionaryKana.replace(/る$/, 'ない')
    return { nai, naiKana }
  } else if (verbGroup === 'Godan') {
    // u-verbs: Change う sound to あ sound + ない
    // 会う → 会わない, 買う → 買わない
    const nai = dictionary.replace(/う$/, 'わない')
      .replace(/く$/, 'かない')
      .replace(/ぐ$/, 'がない')
      .replace(/す$/, 'さない')
      .replace(/つ$/, 'たない')
      .replace(/ぬ$/, 'なない')
      .replace(/ぶ$/, 'ばない')
      .replace(/む$/, 'まない')
      .replace(/る$/, 'らない')

    const naiKana = dictionaryKana.replace(/う$/, 'わない')
      .replace(/く$/, 'かない')
      .replace(/ぐ$/, 'がない')
      .replace(/す$/, 'さない')
      .replace(/つ$/, 'たない')
      .replace(/ぬ$/, 'なない')
      .replace(/ぶ$/, 'ばない')
      .replace(/む$/, 'まない')
      .replace(/る$/, 'らない')

    return { nai, naiKana }
  } else {
    // Irregular (する → しない, 来る → 来ない)
    if (dictionary === 'する' || dictionary.endsWith('する')) {
      return { nai: dictionary.replace('する', 'しない'), naiKana: dictionaryKana.replace('する', 'しない') }
    } else if (dictionary === '来る') {
      return { nai: '来ない', naiKana: 'こない' }
    }
  }

  return { nai: dictionary + 'ない', naiKana: dictionaryKana + 'ない' }
}

/**
 * Generate ません-form from ます-form
 */
function generateMasenForm(masu: string, masuKana: string): { masen: string, masenKana: string } {
  const masen = masu.replace(/ます$/, 'ません')
  const masenKana = masuKana.replace(/ます$/, 'ません')
  return { masen, masenKana }
}

/**
 * Replace verb in sentence with blank marker
 */
function createSentenceWithBlank(sentence: string, sentenceKana: string, verbForm: string, verbFormKana: string): { sentence: string, kana: string } {
  // Replace the verb form with ___
  const blankSentence = sentence.replace(verbForm, '___')
  const blankKana = sentenceKana.replace(verbFormKana, '___')

  return {
    sentence: blankSentence,
    kana: blankKana
  }
}

/**
 * Determine difficulty based on form and context
 */
function calculateDifficulty(form: 'dictionary' | 'masu' | 'te' | 'ta' | 'nai' | 'masen'): 1 | 2 | 3 {
  if (form === 'masu' || form === 'dictionary') return 1
  if (form === 'te' || form === 'ta') return 2
  return 3 // nai, masen
}

/**
 * Generate explanation for why a form is correct
 */
function generateExplanation(form: string, context: string): string {
  const explanations: Record<string, string> = {
    'masu-polite-present': 'Use ます-form for polite present tense statements',
    'masu-polite-habitual': 'Use ます-form for polite habitual actions',
    'dictionary-casual': 'Use dictionary form for casual speech',
    'dictionary-future': 'Use dictionary form after time expressions',
    'te-connection': 'Use て-form to connect sequential actions',
    'te-request': 'Use て-form for making requests (てください)',
    'ta-past': 'Use た-form for completed past actions',
    'ta-past-polite': 'Use ました for polite past tense',
    'nai-negative': 'Use ない-form for negative (casual)',
    'masen-negative-polite': 'Use ません-form for negative (polite)'
  }

  return explanations[`${form}-${context}`] || `Use ${form}-form in this context`
}

/**
 * Generate questions from a single verb's example sentences
 */
export function generateQuestionsFromVerb(verb: VerbData): VerbFormQuestion[] {
  const questions: VerbFormQuestion[] = []

  if (!verb.examples || verb.examples.length === 0) {
    return questions
  }

  // Generate た-form and ない-form
  const { ta, taKana } = generateTaForm(verb.conjugations.te, verb.conjugations.teKana)
  const { nai, naiKana } = generateNaiForm(verb.conjugations.dictionary, verb.conjugations.dictionaryKana, verb.verbGroup)
  const { masen, masenKana } = generateMasenForm(verb.conjugations.masu, verb.conjugations.masuKana)

  // For each example sentence (assuming they use ます-form)
  verb.examples.forEach((example, index) => {
    // Question 1: ます-form (what's in the sentence)
    const { sentence: blankSentence, kana: blankKana } = createSentenceWithBlank(
      example.japanese,
      example.kana,
      verb.conjugations.masu,
      verb.conjugations.masuKana
    )

    questions.push({
      id: `${verb.id}-ex${index}-masu`,
      sentence: blankSentence,
      sentenceKana: blankKana,
      english: example.english,

      verbId: verb.id,
      verbKanji: verb.kanji,
      verbMeaning: verb.primaryMeaning,

      correctForm: 'masu',
      correctAnswer: verb.conjugations.masu,
      correctAnswerKana: verb.conjugations.masuKana,

      options: [
        { form: 'dictionary', text: verb.conjugations.dictionary, kana: verb.conjugations.dictionaryKana, isCorrect: false },
        { form: 'masu', text: verb.conjugations.masu, kana: verb.conjugations.masuKana, isCorrect: true },
        { form: 'te', text: verb.conjugations.te, kana: verb.conjugations.teKana, isCorrect: false },
      ],

      context: 'polite-present',
      difficulty: 1,
      explanation: generateExplanation('masu', 'polite-present')
    })

    // Question 2: て-form variant (modify sentence to need て-form)
    // Example: "毎週、大切な友達に会って、話します。"
    const teBlankSentence = blankSentence.replace('。', '、話します。')
    const teBlankKana = blankKana.replace('。', '、はなします。')

    questions.push({
      id: `${verb.id}-ex${index}-te`,
      sentence: teBlankSentence,
      sentenceKana: teBlankKana,
      english: example.english.replace('.', ', and we talk.'),

      verbId: verb.id,
      verbKanji: verb.kanji,
      verbMeaning: verb.primaryMeaning,

      correctForm: 'te',
      correctAnswer: verb.conjugations.te,
      correctAnswerKana: verb.conjugations.teKana,

      options: [
        { form: 'dictionary', text: verb.conjugations.dictionary, kana: verb.conjugations.dictionaryKana, isCorrect: false },
        { form: 'masu', text: verb.conjugations.masu, kana: verb.conjugations.masuKana, isCorrect: false },
        { form: 'te', text: verb.conjugations.te, kana: verb.conjugations.teKana, isCorrect: true },
        { form: 'ta', text: ta, kana: taKana, isCorrect: false },
      ],

      context: 'connection',
      difficulty: 2,
      explanation: generateExplanation('te', 'connection')
    })
  })

  return questions
}

/**
 * Generate all questions from verb dataset
 */
export function generateAllQuestions(verbs: VerbData[]): VerbFormQuestion[] {
  const allQuestions: VerbFormQuestion[] = []

  verbs.forEach(verb => {
    const questions = generateQuestionsFromVerb(verb)
    allQuestions.push(...questions)
  })

  return allQuestions
}

/**
 * Filter questions by difficulty
 */
export function filterByDifficulty(questions: VerbFormQuestion[], difficulty: 1 | 2 | 3): VerbFormQuestion[] {
  return questions.filter(q => q.difficulty === difficulty)
}

/**
 * Get random questions
 */
export function getRandomQuestions(questions: VerbFormQuestion[], count: number): VerbFormQuestion[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
