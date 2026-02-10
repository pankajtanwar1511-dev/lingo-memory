/**
 * Types for Particle & Special Vocabulary Learning System
 */

export interface ParticleExample {
  japanese: string
  english: string
  note: string
}

export interface ParticleGuide {
  particle: string
  primaryUse: string
  tips: string[]
  examples: ParticleExample[]
  noParticleExamples?: ParticleExample[]
}

export interface CounterRule {
  rule: string
  examples: string[]
}

export interface CommonMistake {
  wrong: string
  correct: string
  explanation: string
}

export interface UsefulPattern {
  pattern: string
  meaning: string
  examples: ParticleExample[]
}

export interface DialogueLine {
  speaker: string
  japanese: string
  english: string
  particleHighlights?: string[]
}

export interface PracticeDialogue {
  title: string
  situation: string
  dialogue: DialogueLine[]
}

export interface QuickReference {
  particle: string
  function: string
  example: string
}

export interface ParticleLearningData {
  title: string
  description: string
  particleGuide: ParticleGuide[]
  counterPlacementRules?: CounterRule[]
  commonMistakes?: CommonMistake[]
  usefulPatterns?: UsefulPattern[]
  practiceDialogues?: PracticeDialogue[]
  quickReferenceChart?: QuickReference[]
}

// Learning progress
export interface ParticleProgress {
  particleId: string
  examplesViewed: number
  quizAttempts: number
  quizCorrect: number
  lastPracticed: Date | null
  mastered: boolean
}

export interface LearningSession {
  startTime: Date
  particlesStudied: string[]
  quizScore: number
  timeSpent: number // seconds
}
