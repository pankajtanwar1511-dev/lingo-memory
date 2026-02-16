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

  correctForm: 'dictionary' | 'masu' | 'te' | 'ta' | 'mashita' | 'nai' | 'masen'
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
 * Generate ました-form from ます-form
 */
function generateMashitaForm(masu: string, masuKana: string): { mashita: string, mashitaKana: string } {
  const mashita = masu.replace(/ます$/, 'ました')
  const mashitaKana = masuKana.replace(/ます$/, 'ました')
  return { mashita, mashitaKana }
}

/**
 * Generate ない-form (negative) from dictionary form
 */
function generateNaiForm(dictionary: string, dictionaryKana: string, verbGroup: string): { nai: string, naiKana: string } {
  if (verbGroup === 'Ichidan') {
    const nai = dictionary.replace(/る$/, 'ない')
    const naiKana = dictionaryKana.replace(/る$/, 'ない')
    return { nai, naiKana }
  } else if (verbGroup === 'Godan') {
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
 * Detect which verb form is actually used in the sentence
 */
function detectVerbForm(sentence: string, verb: VerbData): {
  form: 'masu' | 'mashita' | 'te' | 'ta' | 'dictionary' | null
  verbText: string
  verbKana: string
} | null {
  const { ta, taKana } = generateTaForm(verb.conjugations.te, verb.conjugations.teKana)
  const { mashita, mashitaKana } = generateMashitaForm(verb.conjugations.masu, verb.conjugations.masuKana)

  // Check for ました (past polite)
  if (sentence.includes(mashita)) {
    return { form: 'mashita', verbText: mashita, verbKana: mashitaKana }
  }

  // Check for ます (present polite)
  if (sentence.includes(verb.conjugations.masu)) {
    return { form: 'masu', verbText: verb.conjugations.masu, verbKana: verb.conjugations.masuKana }
  }

  // Check for て-form
  if (sentence.includes(verb.conjugations.te)) {
    return { form: 'te', verbText: verb.conjugations.te, verbKana: verb.conjugations.teKana }
  }

  // Check for た-form (casual past)
  if (sentence.includes(ta)) {
    return { form: 'ta', verbText: ta, verbKana: taKana }
  }

  // Check for dictionary form
  if (sentence.includes(verb.conjugations.dictionary)) {
    return { form: 'dictionary', verbText: verb.conjugations.dictionary, verbKana: verb.conjugations.dictionaryKana }
  }

  return null
}

/**
 * Replace verb in sentence with blank marker
 */
function createSentenceWithBlank(sentence: string, sentenceKana: string, verbForm: string, verbFormKana: string): { sentence: string, kana: string } {
  const blankSentence = sentence.replace(verbForm, '___')
  const blankKana = sentenceKana.replace(verbFormKana, '___')

  return {
    sentence: blankSentence,
    kana: blankKana
  }
}

/**
 * Generate explanation for why a form is correct
 */
function generateExplanation(form: string, isPast: boolean): string {
  const explanations: Record<string, string> = {
    'masu': 'Use ます-form for polite present tense or habitual actions',
    'mashita': 'Use ました-form for polite past tense (completed actions)',
    'te': 'Use て-form to connect sequential actions',
    'ta': 'Use た-form for casual past tense',
    'dictionary': 'Use dictionary form in casual speech or after time expressions',
    'nai': 'Use ない-form for negative (casual)',
    'masen': 'Use ません-form for negative (polite)'
  }

  return explanations[form] || `Use ${form}-form in this context`
}

/**
 * Generate questions from a single verb's example sentences
 */
export function generateQuestionsFromVerb(verb: VerbData): VerbFormQuestion[] {
  const questions: VerbFormQuestion[] = []

  if (!verb.examples || verb.examples.length === 0) {
    return questions
  }

  // Pre-generate all forms
  const { ta, taKana } = generateTaForm(verb.conjugations.te, verb.conjugations.teKana)
  const { mashita, mashitaKana } = generateMashitaForm(verb.conjugations.masu, verb.conjugations.masuKana)
  const { nai, naiKana } = generateNaiForm(verb.conjugations.dictionary, verb.conjugations.dictionaryKana, verb.verbGroup)
  const { masen, masenKana } = generateMasenForm(verb.conjugations.masu, verb.conjugations.masuKana)

  // For each example sentence, detect what form it uses and create a question
  verb.examples.forEach((example, index) => {
    const detected = detectVerbForm(example.japanese, verb)

    if (!detected) {
      console.warn(`Could not detect verb form in: ${example.japanese}`)
      return
    }

    const { sentence: blankSentence, kana: blankKana } = createSentenceWithBlank(
      example.japanese,
      example.kana,
      detected.verbText,
      detected.verbKana
    )

    // Create question based on detected form
    if (detected.form === 'masu') {
      // Present tense question
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
          { form: 'mashita', text: mashita, kana: mashitaKana, isCorrect: false },
        ],

        context: 'polite-present',
        difficulty: 1,
        explanation: generateExplanation('masu', false)
      })
    } else if (detected.form === 'mashita') {
      // Past tense question
      questions.push({
        id: `${verb.id}-ex${index}-mashita`,
        sentence: blankSentence,
        sentenceKana: blankKana,
        english: example.english,

        verbId: verb.id,
        verbKanji: verb.kanji,
        verbMeaning: verb.primaryMeaning,

        correctForm: 'mashita',
        correctAnswer: mashita,
        correctAnswerKana: mashitaKana,

        options: [
          { form: 'dictionary', text: verb.conjugations.dictionary, kana: verb.conjugations.dictionaryKana, isCorrect: false },
          { form: 'masu', text: verb.conjugations.masu, kana: verb.conjugations.masuKana, isCorrect: false },
          { form: 'mashita', text: mashita, kana: mashitaKana, isCorrect: true },
          { form: 'te', text: verb.conjugations.te, kana: verb.conjugations.teKana, isCorrect: false },
        ],

        context: 'polite-past',
        difficulty: 1,
        explanation: generateExplanation('mashita', true)
      })
    } else if (detected.form === 'te') {
      // て-form question
      questions.push({
        id: `${verb.id}-ex${index}-te`,
        sentence: blankSentence,
        sentenceKana: blankKana,
        english: example.english,

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
        explanation: generateExplanation('te', false)
      })
    }
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
