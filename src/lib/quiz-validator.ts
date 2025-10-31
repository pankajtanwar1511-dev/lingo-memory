import { QuizDirection, ValidationResult } from "@/types/quiz"
import { VocabularyCard } from "@/types/vocabulary"

/**
 * Quiz Answer Validator with 3-level feedback
 *
 * Validation Levels:
 * - CORRECT: Exact match with expected answer
 * - CLOSE: Right idea but wrong form (e.g., kana instead of kanji)
 * - WRONG: Incorrect answer
 */

/**
 * Normalize string for comparison
 * - Trim whitespace
 * - Convert to lowercase for case-insensitive comparison
 * - Remove common punctuation
 */
function normalizeString(str: string): string {
  return str.trim().toLowerCase().replace(/[.,!?]/g, "")
}

/**
 * Check if a string is in hiragana/katakana
 */
function isKana(str: string): boolean {
  // Hiragana: U+3040-U+309F, Katakana: U+30A0-U+30FF
  const kanaRegex = /^[\u3040-\u309F\u30A0-\u30FF\s]+$/
  return kanaRegex.test(str)
}

/**
 * Check if a string contains kanji
 */
function hasKanji(str: string): boolean {
  // Kanji: U+4E00-U+9FFF, U+3400-U+4DBF
  const kanjiRegex = /[\u4E00-\u9FFF\u3400-\u4DBF]/
  return kanjiRegex.test(str)
}

/**
 * Check if a string is romaji (latin characters)
 */
function isRomaji(str: string): boolean {
  const romajiRegex = /^[a-zA-Z\s]+$/
  return romajiRegex.test(str)
}

/**
 * Validate answer with 3-level feedback
 */
export function validateAnswer(
  userAnswer: string,
  card: VocabularyCard,
  direction: QuizDirection,
  options?: {
    caseSensitive?: boolean
    strictTyping?: boolean
  }
): ValidationResult {
  const { caseSensitive = false, strictTyping = false } = options || {}

  // Normalize answers for comparison
  const normalizedUser = caseSensitive ? userAnswer.trim() : normalizeString(userAnswer)
  const normalizedKanji = card.kanji ? (caseSensitive ? card.kanji.trim() : normalizeString(card.kanji)) : ""
  const normalizedKana = caseSensitive ? card.kana.trim() : normalizeString(card.kana)
  const normalizedRomaji = card.romaji ? (caseSensitive ? card.romaji.trim() : normalizeString(card.romaji)) : ""

  // Normalize meanings array
  const meanings = Array.isArray(card.meaning) ? card.meaning : [card.meaning]
  const normalizedMeanings = meanings.map(m => caseSensitive ? m.trim() : normalizeString(m))

  switch (direction) {
    case "english-to-kanji": {
      // CORRECT: User provided kanji
      if (card.kanji && normalizedUser === normalizedKanji) {
        return {
          level: "correct",
          isAcceptable: true
        }
      }

      // CLOSE: User provided kana instead of kanji
      if (normalizedUser === normalizedKana) {
        return {
          level: "close",
          isAcceptable: !strictTyping, // In strict mode, close = wrong
          message: "Good! But try writing it in kanji:",
          expectedAnswer: card.kanji || card.kana
        }
      }

      // CLOSE: User provided romaji
      if (normalizedRomaji && normalizedUser === normalizedRomaji) {
        return {
          level: "close",
          isAcceptable: false,
          message: "Try using kanji:",
          expectedAnswer: card.kanji || card.kana
        }
      }

      // WRONG
      return {
        level: "wrong",
        isAcceptable: false,
        expectedAnswer: card.kanji || card.kana
      }
    }

    case "english-to-kana": {
      // CORRECT: User provided kana
      if (normalizedUser === normalizedKana) {
        return {
          level: "correct",
          isAcceptable: true
        }
      }

      // CLOSE: User provided kanji instead of kana
      if (card.kanji && normalizedUser === normalizedKanji) {
        return {
          level: "close",
          isAcceptable: !strictTyping,
          message: "Good! But try writing it in kana:",
          expectedAnswer: card.kana
        }
      }

      // CLOSE: User provided romaji
      if (normalizedRomaji && normalizedUser === normalizedRomaji) {
        return {
          level: "close",
          isAcceptable: false,
          message: "Try using hiragana/katakana:",
          expectedAnswer: card.kana
        }
      }

      // WRONG
      return {
        level: "wrong",
        isAcceptable: false,
        expectedAnswer: card.kana
      }
    }

    case "kanji-to-reading":
    case "kanji-only-to-english": // When showing kanji, answer is kana reading
      {
        // For kanji-to-reading, expect kana
        if (direction === "kanji-to-reading") {
          if (normalizedUser === normalizedKana) {
            return {
              level: "correct",
              isAcceptable: true
            }
          }

          // CLOSE: Provided romaji
          if (normalizedRomaji && normalizedUser === normalizedRomaji) {
            return {
              level: "close",
              isAcceptable: false,
              message: "Close! Try using hiragana:",
              expectedAnswer: card.kana
            }
          }

          return {
            level: "wrong",
            isAcceptable: false,
            expectedAnswer: card.kana
          }
        }

        // For kanji-only-to-english, expect English meaning
        if (normalizedMeanings.includes(normalizedUser)) {
          return {
            level: "correct",
            isAcceptable: true
          }
        }

        return {
          level: "wrong",
          isAcceptable: false,
          expectedAnswer: meanings[0]
        }
      }

    case "reading-to-kanji": {
      // CORRECT: User provided kanji
      if (card.kanji && normalizedUser === normalizedKanji) {
        return {
          level: "correct",
          isAcceptable: true
        }
      }

      // CLOSE: User provided kana (correct reading but not kanji)
      if (normalizedUser === normalizedKana) {
        return {
          level: "close",
          isAcceptable: false,
          message: card.kanji ? "Try using the kanji form:" : "That's correct!",
          expectedAnswer: card.kanji || card.kana
        }
      }

      // WRONG
      return {
        level: "wrong",
        isAcceptable: false,
        expectedAnswer: card.kanji || card.kana
      }
    }

    case "kana-only-to-english": {
      // CORRECT: Any valid meaning
      if (normalizedMeanings.includes(normalizedUser)) {
        return {
          level: "correct",
          isAcceptable: true
        }
      }

      // WRONG
      return {
        level: "wrong",
        isAcceptable: false,
        expectedAnswer: meanings[0]
      }
    }

    case "japanese-to-english": {
      // CORRECT: Any valid meaning
      if (normalizedMeanings.includes(normalizedUser)) {
        return {
          level: "correct",
          isAcceptable: true
        }
      }

      // WRONG
      return {
        level: "wrong",
        isAcceptable: false,
        expectedAnswer: meanings[0]
      }
    }

    case "english-to-japanese": {
      // CORRECT: Either kanji or kana (accept both for backward compatibility)
      if ((card.kanji && normalizedUser === normalizedKanji) || normalizedUser === normalizedKana) {
        return {
          level: "correct",
          isAcceptable: true
        }
      }

      // CLOSE: Romaji
      if (normalizedRomaji && normalizedUser === normalizedRomaji) {
        return {
          level: "close",
          isAcceptable: false,
          message: "Try using Japanese characters:",
          expectedAnswer: card.kanji || card.kana
        }
      }

      // WRONG
      return {
        level: "wrong",
        isAcceptable: false,
        expectedAnswer: card.kanji || card.kana
      }
    }

    default:
      // Default: accept any valid meaning or form
      if (
        normalizedMeanings.includes(normalizedUser) ||
        normalizedUser === normalizedKana ||
        (card.kanji && normalizedUser === normalizedKanji)
      ) {
        return {
          level: "correct",
          isAcceptable: true
        }
      }

      return {
        level: "wrong",
        isAcceptable: false,
        expectedAnswer: meanings[0]
      }
  }
}

/**
 * Helper: Check if user answer matches any of the correct answers
 */
export function isAnswerCorrect(
  userAnswer: string,
  correctAnswers: string | string[],
  caseSensitive: boolean = false
): boolean {
  const answers = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers]
  const normalizedUser = caseSensitive ? userAnswer.trim() : normalizeString(userAnswer)

  return answers.some(answer => {
    const normalizedAnswer = caseSensitive ? answer.trim() : normalizeString(answer)
    return normalizedUser === normalizedAnswer
  })
}
