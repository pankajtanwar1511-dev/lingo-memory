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
  lemma: { kanji: string; kana: string }
  meaning: { primary: string; gloss: string[] }
  morphology: { class: string; isIrregular: boolean }
  valency: { type: string; requiredParticles: string[] }
  forms: {
    dictionary: { kanji: string; kana: string }
    masu: { kanji: string; kana: string }
    te: { kanji: string; kana: string }
  }
  examples: {
    dictionary: { jp: string; kana: string; en: string; highlight?: string; grammarTag?: string; pattern?: string }[]
    masu: { jp: string; kana: string; en: string; highlight?: string; grammarTag?: string; pattern?: string }[]
    te: { jp: string; kana: string; en: string; highlight?: string; grammarTag?: string; pattern?: string }[]
  }
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
  if (verbGroup === 'ichidan') {
    const nai = dictionary.replace(/る$/, 'ない')
    const naiKana = dictionaryKana.replace(/る$/, 'ない')
    return { nai, naiKana }
  } else if (verbGroup === 'godan') {
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
  const { ta, taKana } = generateTaForm(verb.forms.te.kanji, verb.forms.te.kana)
  const { mashita, mashitaKana } = generateMashitaForm(verb.forms.masu.kanji, verb.forms.masu.kana)

  // Check for ました (past polite)
  if (sentence.includes(mashita)) {
    return { form: 'mashita', verbText: mashita, verbKana: mashitaKana }
  }

  // Check for ます (present polite)
  if (sentence.includes(verb.forms.masu.kanji)) {
    return { form: 'masu', verbText: verb.forms.masu.kanji, verbKana: verb.forms.masu.kana }
  }

  // Check for て-form
  if (sentence.includes(verb.forms.te.kanji)) {
    return { form: 'te', verbText: verb.forms.te.kanji, verbKana: verb.forms.te.kana }
  }

  // Check for た-form (casual past)
  if (sentence.includes(ta)) {
    return { form: 'ta', verbText: ta, verbKana: taKana }
  }

  // Check for dictionary form
  if (sentence.includes(verb.forms.dictionary.kanji)) {
    return { form: 'dictionary', verbText: verb.forms.dictionary.kanji, verbKana: verb.forms.dictionary.kana }
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

  // Pre-generate all forms
  const { ta, taKana } = generateTaForm(verb.forms.te.kanji, verb.forms.te.kana)
  const { mashita, mashitaKana } = generateMashitaForm(verb.forms.masu.kanji, verb.forms.masu.kana)
  const { nai, naiKana } = generateNaiForm(verb.forms.dictionary.kanji, verb.forms.dictionary.kana, verb.morphology.class)
  const { masen, masenKana } = generateMasenForm(verb.forms.masu.kanji, verb.forms.masu.kana)

  // Suppress unused variable warnings
  void nai; void naiKana; void masen; void masenKana

  // Process masu examples (polite forms)
  if (verb.examples.masu) {
    verb.examples.masu.forEach((example, index) => {
    const detected = detectVerbForm(example.jp, verb)

    if (!detected) {
      console.warn(`Could not detect verb form in: ${example.jp}`)
      return
    }

    const { sentence: blankSentence, kana: blankKana } = createSentenceWithBlank(
      example.jp,
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
        english: example.en,

        verbId: verb.id,
        verbKanji: verb.lemma.kanji,
        verbMeaning: verb.meaning.primary,

        correctForm: 'masu',
        correctAnswer: verb.forms.masu.kanji,
        correctAnswerKana: verb.forms.masu.kana,

        options: [
          { form: 'dictionary', text: verb.forms.dictionary.kanji, kana: verb.forms.dictionary.kana, isCorrect: false },
          { form: 'masu', text: verb.forms.masu.kanji, kana: verb.forms.masu.kana, isCorrect: true },
          { form: 'te', text: verb.forms.te.kanji, kana: verb.forms.te.kana, isCorrect: false },
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
        english: example.en,

        verbId: verb.id,
        verbKanji: verb.lemma.kanji,
        verbMeaning: verb.meaning.primary,

        correctForm: 'mashita',
        correctAnswer: mashita,
        correctAnswerKana: mashitaKana,

        options: [
          { form: 'dictionary', text: verb.forms.dictionary.kanji, kana: verb.forms.dictionary.kana, isCorrect: false },
          { form: 'masu', text: verb.forms.masu.kanji, kana: verb.forms.masu.kana, isCorrect: false },
          { form: 'mashita', text: mashita, kana: mashitaKana, isCorrect: true },
          { form: 'te', text: verb.forms.te.kanji, kana: verb.forms.te.kana, isCorrect: false },
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
        english: example.en,

        verbId: verb.id,
        verbKanji: verb.lemma.kanji,
        verbMeaning: verb.meaning.primary,

        correctForm: 'te',
        correctAnswer: verb.forms.te.kanji,
        correctAnswerKana: verb.forms.te.kana,

        options: [
          { form: 'dictionary', text: verb.forms.dictionary.kanji, kana: verb.forms.dictionary.kana, isCorrect: false },
          { form: 'masu', text: verb.forms.masu.kanji, kana: verb.forms.masu.kana, isCorrect: false },
          { form: 'te', text: verb.forms.te.kanji, kana: verb.forms.te.kana, isCorrect: true },
          { form: 'ta', text: ta, kana: taKana, isCorrect: false },
        ],

        context: 'connection',
        difficulty: 2,
        explanation: generateExplanation('te', false)
      })
    } else if (detected.form === 'dictionary') {
      // Dictionary form question
      questions.push({
        id: `${verb.id}-ex${index}-dict`,
        sentence: blankSentence,
        sentenceKana: blankKana,
        english: example.en,

        verbId: verb.id,
        verbKanji: verb.lemma.kanji,
        verbMeaning: verb.meaning.primary,

        correctForm: 'dictionary',
        correctAnswer: verb.forms.dictionary.kanji,
        correctAnswerKana: verb.forms.dictionary.kana,

        options: [
          { form: 'dictionary', text: verb.forms.dictionary.kanji, kana: verb.forms.dictionary.kana, isCorrect: true },
          { form: 'masu', text: verb.forms.masu.kanji, kana: verb.forms.masu.kana, isCorrect: false },
          { form: 'te', text: verb.forms.te.kanji, kana: verb.forms.te.kana, isCorrect: false },
          { form: 'mashita', text: mashita, kana: mashitaKana, isCorrect: false },
        ],

        context: 'casual',
        difficulty: 1,
        explanation: generateExplanation('dictionary', false)
      })
    }
    })
  }

  // Process te-form examples
  if (verb.examples.te) {
    verb.examples.te.forEach((example, index) => {
      const detected = detectVerbForm(example.jp, verb)

      if (!detected) {
        console.warn(`Could not detect verb form in te-form example: ${example.jp}`)
        return
      }

      const { sentence: blankSentence, kana: blankKana } = createSentenceWithBlank(
        example.jp,
        example.kana,
        detected.verbText,
        detected.verbKana
      )

      if (detected.form === 'te') {
        questions.push({
          id: `${verb.id}-te${index}`,
          sentence: blankSentence,
          sentenceKana: blankKana,
          english: example.en,

          verbId: verb.id,
          verbKanji: verb.lemma.kanji,
          verbMeaning: verb.meaning.primary,

          correctForm: 'te',
          correctAnswer: verb.forms.te.kanji,
          correctAnswerKana: verb.forms.te.kana,

          options: [
            { form: 'dictionary', text: verb.forms.dictionary.kanji, kana: verb.forms.dictionary.kana, isCorrect: false },
            { form: 'masu', text: verb.forms.masu.kanji, kana: verb.forms.masu.kana, isCorrect: false },
            { form: 'te', text: verb.forms.te.kanji, kana: verb.forms.te.kana, isCorrect: true },
            { form: 'ta', text: ta, kana: taKana, isCorrect: false },
          ],

          context: example.pattern || 'connection',
          difficulty: 2,
          explanation: generateExplanation('te', false)
        })
      }
    })
  }

  // Process dictionary form examples
  if (verb.examples.dictionary) {
    verb.examples.dictionary.forEach((example, index) => {
      const detected = detectVerbForm(example.jp, verb)

      if (!detected) {
        console.warn(`Could not detect verb form in dict example: ${example.jp}`)
        return
      }

      const { sentence: blankSentence, kana: blankKana } = createSentenceWithBlank(
        example.jp,
        example.kana,
        detected.verbText,
        detected.verbKana
      )

      if (detected.form === 'dictionary') {
        questions.push({
          id: `${verb.id}-dict${index}`,
          sentence: blankSentence,
          sentenceKana: blankKana,
          english: example.en,

          verbId: verb.id,
          verbKanji: verb.lemma.kanji,
          verbMeaning: verb.meaning.primary,

          correctForm: 'dictionary',
          correctAnswer: verb.forms.dictionary.kanji,
          correctAnswerKana: verb.forms.dictionary.kana,

          options: [
            { form: 'dictionary', text: verb.forms.dictionary.kanji, kana: verb.forms.dictionary.kana, isCorrect: true },
            { form: 'masu', text: verb.forms.masu.kanji, kana: verb.forms.masu.kana, isCorrect: false },
            { form: 'te', text: verb.forms.te.kanji, kana: verb.forms.te.kana, isCorrect: false },
            { form: 'ta', text: ta, kana: taKana, isCorrect: false },
          ],

          context: example.pattern || 'casual',
          difficulty: 1,
          explanation: generateExplanation('dictionary', false)
        })
      }
    })
  }

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
