/**
 * Persona Types
 *
 * Character personas used for generating contextualized example sentences.
 * Each persona represents a different speaker profile with specific tone,
 * vocabulary preferences, and usage contexts.
 */

export type PersonaId =
  | "persona_tomoko"
  | "persona_ken"
  | "persona_aya"
  | "persona_emi"

export type PersonaTone =
  | "simple"
  | "friendly"
  | "playful"
  | "neutral"
  | "practical"
  | "casual"
  | "polite"
  | "formal"

export type GrammarLevel = "N5" | "N4" | "N3" | "N2" | "N1"

export type ExampleStyle =
  | "short_daily"      // Short, daily life sentences
  | "routine"          // Routine/habitual actions
  | "casual"           // Casual conversation
  | "polite_formal"    // Polite/formal speech

export interface PersonaContext {
  /** Main contexts where this persona's examples take place */
  primary: string[]
  /** Secondary contexts occasionally used */
  secondary?: string[]
}

export interface Persona {
  /** Unique identifier for the persona */
  id: PersonaId

  /** Display name (English) */
  name: string

  /** Name in kana */
  nameKana: string

  /** Optional kanji name */
  nameKanji?: string

  /** Role/description (e.g., "elementary student", "office worker") */
  role: string

  /** Age or age range */
  age: number | string

  /** Speaking tone characteristics */
  tone: PersonaTone[]

  /** Contexts where this persona's examples typically occur */
  context: PersonaContext

  /** Appropriate grammar level for this persona's speech */
  grammarLevel: GrammarLevel

  /** Style of examples this persona produces */
  exampleStyle: ExampleStyle

  /** Path to avatar image/SVG */
  avatarUrl?: string

  /** Optional Lottie animation for speaking */
  avatarLottieUrl?: string

  /** Vocabulary categories this persona frequently uses */
  preferredVocabulary: string[]

  /** Brief description for prompt engineering */
  description: string

  /** TTS voice ID (for future audio generation) */
  ttsVoice?: string

  /** When this persona was created */
  createdAt?: Date

  /** Active/inactive status */
  active: boolean
}

export interface PersonaExample {
  /** Which persona generated/spoke this example */
  personaId: PersonaId

  /** Reference to persona object (populated at runtime) */
  persona?: Persona
}

/**
 * Utility type for persona selection based on vocabulary characteristics
 */
export interface PersonaMatchCriteria {
  /** Vocabulary word's tags */
  tags?: string[]

  /** Part of speech */
  partOfSpeech?: string[]

  /** JLPT level */
  jlptLevel?: GrammarLevel

  /** Preferred context */
  preferredContext?: string
}

/**
 * Result of matching a word to appropriate personas
 */
export interface PersonaMatchResult {
  /** Matched persona */
  persona: Persona

  /** Confidence score (0-1) */
  confidence: number

  /** Reason for match */
  reason: string
}
