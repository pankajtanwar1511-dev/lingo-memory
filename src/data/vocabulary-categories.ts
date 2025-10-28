/**
 * Vocabulary Categories and Tags
 *
 * Organized categorization system for Japanese vocabulary.
 * Used for filtering, organization, and targeted study.
 */

import { JLPTLevel } from '@/types/vocabulary'

export interface Category {
  id: string
  name: string
  description: string
  jlptLevel?: JLPTLevel
  icon?: string
  color?: string
  parent?: string
}

export interface Tag {
  id: string
  name: string
  description?: string
  category?: string
  color?: string
}

/**
 * Vocabulary Categories
 */
export const CATEGORIES: Category[] = [
  // N5 Categories
  {
    id: 'numbers',
    name: 'Numbers & Counting',
    description: 'Numbers, counters, and quantity expressions',
    jlptLevel: 'N5',
    icon: '🔢',
    color: 'blue'
  },
  {
    id: 'time',
    name: 'Time & Dates',
    description: 'Time expressions, days, months, seasons',
    jlptLevel: 'N5',
    icon: '🕐',
    color: 'purple'
  },
  {
    id: 'basic-verbs',
    name: 'Basic Verbs',
    description: 'Essential everyday verbs',
    jlptLevel: 'N5',
    icon: '🏃',
    color: 'green'
  },
  {
    id: 'basic-adjectives',
    name: 'Basic Adjectives',
    description: 'Common descriptive words (i-adjectives and na-adjectives)',
    jlptLevel: 'N5',
    icon: '✨',
    color: 'yellow'
  },
  {
    id: 'common-nouns',
    name: 'Common Nouns',
    description: 'Everyday objects, places, and concepts',
    jlptLevel: 'N5',
    icon: '📦',
    color: 'red'
  },
  {
    id: 'particles',
    name: 'Particles',
    description: 'Grammatical particles',
    jlptLevel: 'N5',
    icon: '⚡',
    color: 'orange'
  },
  {
    id: 'pronouns',
    name: 'Pronouns & Demonstratives',
    description: 'Personal pronouns and demonstrative words',
    jlptLevel: 'N5',
    icon: '👤',
    color: 'pink'
  },
  {
    id: 'greetings',
    name: 'Greetings & Phrases',
    description: 'Common greetings and set phrases',
    jlptLevel: 'N5',
    icon: '👋',
    color: 'cyan'
  },
  {
    id: 'food',
    name: 'Food & Drink',
    description: 'Common foods, drinks, and related words',
    jlptLevel: 'N5',
    icon: '🍱',
    color: 'amber'
  },
  {
    id: 'family',
    name: 'Family & People',
    description: 'Family members and personal relationships',
    jlptLevel: 'N5',
    icon: '👨‍👩‍👧‍👦',
    color: 'rose'
  },

  // N4 Categories
  {
    id: 'intermediate-verbs',
    name: 'Intermediate Verbs',
    description: 'More complex verbs and expressions',
    jlptLevel: 'N4',
    icon: '🏃‍♂️',
    color: 'green'
  },
  {
    id: 'intermediate-adjectives',
    name: 'Intermediate Adjectives',
    description: 'More nuanced descriptive words',
    jlptLevel: 'N4',
    icon: '🌟',
    color: 'yellow'
  },
  {
    id: 'nature',
    name: 'Nature & Weather',
    description: 'Natural phenomena, weather, and environment',
    jlptLevel: 'N4',
    icon: '🌿',
    color: 'emerald'
  },
  {
    id: 'travel',
    name: 'Travel & Transportation',
    description: 'Travel, vehicles, and navigation',
    jlptLevel: 'N4',
    icon: '🚄',
    color: 'indigo'
  },
  {
    id: 'school',
    name: 'School & Education',
    description: 'Education-related vocabulary',
    jlptLevel: 'N4',
    icon: '📚',
    color: 'blue'
  },
  {
    id: 'work',
    name: 'Work & Business',
    description: 'Workplace and business terminology',
    jlptLevel: 'N4',
    icon: '💼',
    color: 'gray'
  },
  {
    id: 'emotions',
    name: 'Emotions & Feelings',
    description: 'Emotional states and feelings',
    jlptLevel: 'N4',
    icon: '😊',
    color: 'pink'
  },
  {
    id: 'body',
    name: 'Body & Health',
    description: 'Body parts, health, and medical terms',
    jlptLevel: 'N4',
    icon: '🏥',
    color: 'red'
  },

  // N3 Categories
  {
    id: 'advanced-verbs',
    name: 'Advanced Verbs',
    description: 'Complex verbs and idiomatic expressions',
    jlptLevel: 'N3',
    icon: '🎯',
    color: 'green'
  },
  {
    id: 'advanced-adjectives',
    name: 'Advanced Adjectives',
    description: 'Subtle and nuanced descriptive words',
    jlptLevel: 'N3',
    icon: '💫',
    color: 'yellow'
  },
  {
    id: 'abstract',
    name: 'Abstract Concepts',
    description: 'Abstract ideas and philosophical concepts',
    jlptLevel: 'N3',
    icon: '🧠',
    color: 'purple'
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Technology and digital terminology',
    jlptLevel: 'N3',
    icon: '💻',
    color: 'cyan'
  },
  {
    id: 'society',
    name: 'Society & Culture',
    description: 'Social and cultural concepts',
    jlptLevel: 'N3',
    icon: '🏛️',
    color: 'orange'
  },
  {
    id: 'media',
    name: 'Media & Communication',
    description: 'Media, news, and communication',
    jlptLevel: 'N3',
    icon: '📰',
    color: 'blue'
  },
  {
    id: 'grammar-advanced',
    name: 'Grammar-Related',
    description: 'Advanced grammar patterns and expressions',
    jlptLevel: 'N3',
    icon: '📝',
    color: 'gray'
  }
]

/**
 * Vocabulary Tags
 */
export const TAGS: Tag[] = [
  // Usage frequency
  { id: 'essential', name: 'Essential', description: 'Must-know vocabulary', color: 'red' },
  { id: 'common', name: 'Common', description: 'Frequently used', color: 'orange' },
  { id: 'useful', name: 'Useful', description: 'Practical vocabulary', color: 'yellow' },
  { id: 'advanced', name: 'Advanced', description: 'Higher difficulty', color: 'purple' },

  // Grammar categories
  { id: 'verb', name: 'Verb', category: 'grammar', color: 'green' },
  { id: 'adjective', name: 'Adjective', category: 'grammar', color: 'blue' },
  { id: 'noun', name: 'Noun', category: 'grammar', color: 'red' },
  { id: 'particle', name: 'Particle', category: 'grammar', color: 'purple' },
  { id: 'adverb', name: 'Adverb', category: 'grammar', color: 'pink' },
  { id: 'counter', name: 'Counter', category: 'grammar', color: 'cyan' },

  // Verb types
  { id: 'godan', name: 'Godan Verb', category: 'verb-type', color: 'green' },
  { id: 'ichidan', name: 'Ichidan Verb', category: 'verb-type', color: 'emerald' },
  { id: 'irregular', name: 'Irregular Verb', category: 'verb-type', color: 'red' },

  // Adjective types
  { id: 'i-adjective', name: 'I-Adjective', category: 'adjective-type', color: 'blue' },
  { id: 'na-adjective', name: 'Na-Adjective', category: 'adjective-type', color: 'indigo' },

  // Topics
  { id: 'daily-life', name: 'Daily Life', category: 'topic', color: 'gray' },
  { id: 'conversation', name: 'Conversation', category: 'topic', color: 'pink' },
  { id: 'formal', name: 'Formal', category: 'topic', color: 'gray' },
  { id: 'casual', name: 'Casual', category: 'topic', color: 'cyan' },
  { id: 'business', name: 'Business', category: 'topic', color: 'blue' },
  { id: 'academic', name: 'Academic', category: 'topic', color: 'purple' },

  // Context
  { id: 'spoken', name: 'Spoken', category: 'context', color: 'pink' },
  { id: 'written', name: 'Written', category: 'context', color: 'gray' },
  { id: 'informal', name: 'Informal', category: 'context', color: 'cyan' },
  { id: 'polite', name: 'Polite', category: 'context', color: 'blue' },

  // Special
  { id: 'kanji-required', name: 'Kanji Required', category: 'special', color: 'red' },
  { id: 'idiomatic', name: 'Idiomatic', category: 'special', color: 'purple' },
  { id: 'compound', name: 'Compound Word', category: 'special', color: 'orange' },
  { id: 'loan-word', name: 'Loan Word', category: 'special', color: 'pink' }
]

/**
 * Get category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(cat => cat.id === id)
}

/**
 * Get categories by JLPT level
 */
export function getCategoriesByLevel(level: JLPTLevel): Category[] {
  return CATEGORIES.filter(cat => cat.jlptLevel === level)
}

/**
 * Get tag by ID
 */
export function getTagById(id: string): Tag | undefined {
  return TAGS.find(tag => tag.id === id)
}

/**
 * Get tags by category
 */
export function getTagsByCategory(category: string): Tag[] {
  return TAGS.filter(tag => tag.category === category)
}

/**
 * Get all grammar-related tags
 */
export function getGrammarTags(): Tag[] {
  return getTagsByCategory('grammar')
}

/**
 * Get all verb type tags
 */
export function getVerbTypeTags(): Tag[] {
  return getTagsByCategory('verb-type')
}

/**
 * Get all adjective type tags
 */
export function getAdjectiveTypeTags(): Tag[] {
  return getTagsByCategory('adjective-type')
}
