/**
 * Vocabulary Validation Schema
 *
 * Ensures all vocabulary content meets quality and licensing standards.
 * Used for content import, validation, and quality control.
 */

import { z } from 'zod'

// JLPT Level enum
export const JLPTLevelSchema = z.enum(['N5', 'N4', 'N3', 'N2', 'N1'])

// Example sentence schema
export const ExampleSchema = z.object({
  japanese: z.string().min(1, 'Japanese text is required'),
  hiragana: z.string().optional(),
  english: z.string().min(1, 'English translation is required'),
  audioUrl: z.string().optional(), // Relative path like /audio/n5/examples/...
  needsReview: z.boolean().optional().default(false), // Flag for human review (AI-generated or flagged)
  source: z.object({
    type: z.enum(['tatoeba', 'jmdict', 'custom', 'generated']), // Added 'generated' type
    id: z.union([z.string(), z.number()]).optional(),
    // Additional fields for generated content
    model: z.string().optional(), // e.g., "claude-3-5-sonnet-20241022"
    provider: z.string().optional(), // e.g., "anthropic", "openai"
    date: z.string().optional() // ISO timestamp of generation
  })
})

// License schema
export const LicenseSchema = z.object({
  text: z.string().min(1, 'License text is required'),
  url: z.string().url().optional()
})

// Vocabulary card schema
export const VocabularyCardSchema = z.object({
  id: z.string()
    .min(1, 'ID is required')
    .regex(
      /^(n5|n4|n3|n2|n1|vocab)_[a-z0-9_]+$/i,
      'ID must follow format: {level}_{identifier}'
    ),
  kanji: z.string().optional(),
  kana: z.string().min(1, 'Kana (hiragana/katakana) is required'),
  meaning: z.union([
    z.string().min(1, 'At least one meaning is required'),
    z.array(z.string().min(1)).min(1, 'At least one meaning is required')
  ]),
  examples: z.array(ExampleSchema)
    .max(6, 'Maximum 6 example sentences allowed')
    .optional()
    .default([]),
  audioUrl: z.string().optional(), // Relative path like /audio/n5/...
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  jlptLevel: JLPTLevelSchema,
  partOfSpeech: z.array(z.string()).optional(),
  license: LicenseSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

// Import file schema
export const ImportFileSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semver format'),
  metadata: z.object({
    source: z.string(),
    createdAt: z.string(),
    author: z.string(),
    license: z.string()
  }),
  vocabulary: z.array(VocabularyCardSchema).min(1, 'At least one vocabulary card required')
})

// Validation result types
export type ValidationError = {
  field: string
  message: string
  cardId?: string
}

export type ValidationResult = {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  stats: {
    total: number
    valid: number
    invalid: number
    duplicateIds: string[]
  }
}

// Export types
export type VocabularyCardInput = z.input<typeof VocabularyCardSchema>
export type VocabularyCardOutput = z.output<typeof VocabularyCardSchema>
export type ImportFileInput = z.input<typeof ImportFileSchema>
export type JLPTLevel = z.infer<typeof JLPTLevelSchema>

/**
 * Validate a single vocabulary card
 */
export function validateVocabularyCard(card: unknown): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  try {
    VocabularyCardSchema.parse(card)
    return {
      valid: true,
      errors: [],
      warnings: [],
      stats: {
        total: 1,
        valid: 1,
        invalid: 0,
        duplicateIds: []
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((err: z.ZodIssue) => {
        errors.push({
          field: err.path.join('.'),
          message: err.message,
          cardId: typeof card === 'object' && card !== null && 'id' in card
            ? String(card.id)
            : undefined
        })
      })
    }

    return {
      valid: false,
      errors,
      warnings: [],
      stats: {
        total: 1,
        valid: 0,
        invalid: 1,
        duplicateIds: []
      }
    }
  }
}

/**
 * Validate multiple vocabulary cards
 */
export function validateVocabularyCards(cards: unknown[]): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []
  const ids = new Set<string>()
  const duplicateIds: string[] = []
  let validCount = 0

  cards.forEach((card, index) => {
    const result = validateVocabularyCard(card)

    if (result.valid) {
      validCount++

      // Check for duplicate IDs
      const cardId = (card as any).id
      if (ids.has(cardId)) {
        duplicateIds.push(cardId)
        errors.push({
          field: 'id',
          message: `Duplicate ID found: ${cardId}`,
          cardId
        })
      } else {
        ids.add(cardId)
      }
    } else {
      errors.push(...result.errors)
    }

    // Add warnings for missing optional but recommended fields
    const cardObj = card as any
    if (result.valid) {
      if (!cardObj.kanji && cardObj.jlptLevel !== 'N5') {
        warnings.push({
          field: 'kanji',
          message: 'Kanji is recommended for N4+ vocabulary',
          cardId: cardObj.id
        })
      }

      if (!cardObj.audioUrl) {
        warnings.push({
          field: 'audioUrl',
          message: 'Audio URL is recommended for better learning',
          cardId: cardObj.id
        })
      }

      if (!cardObj.partOfSpeech || cardObj.partOfSpeech.length === 0) {
        warnings.push({
          field: 'partOfSpeech',
          message: 'Part of speech is recommended for grammar understanding',
          cardId: cardObj.id
        })
      }

      if (cardObj.examples.length < 2) {
        warnings.push({
          field: 'examples',
          message: 'At least 2 example sentences recommended',
          cardId: cardObj.id
        })
      }
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      total: cards.length,
      valid: validCount,
      invalid: cards.length - validCount,
      duplicateIds
    }
  }
}

/**
 * Validate import file
 */
export function validateImportFile(data: unknown): ValidationResult {
  const errors: ValidationError[] = []

  try {
    const parsed = ImportFileSchema.parse(data)
    return validateVocabularyCards(parsed.vocabulary)
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((err: z.ZodIssue) => {
        errors.push({
          field: err.path.join('.'),
          message: err.message
        })
      })
    }

    return {
      valid: false,
      errors,
      warnings: [],
      stats: {
        total: 0,
        valid: 0,
        invalid: 0,
        duplicateIds: []
      }
    }
  }
}
