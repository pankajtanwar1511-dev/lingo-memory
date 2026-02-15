/**
 * Persona Data
 *
 * Character personas used for generating contextualized example sentences.
 * Import from personas.json for type safety and easy access.
 */

import { Persona, PersonaId } from "@/types/persona"
import personasData from "./personas.json"

/**
 * All available personas
 */
export const personas: Persona[] = personasData.personas.map((p) => ({
  ...p,
  id: p.id as PersonaId,
  tone: p.tone as Persona["tone"],
  grammarLevel: p.grammarLevel as Persona["grammarLevel"],
  exampleStyle: p.exampleStyle as Persona["exampleStyle"],
  context: {
    primary: p.context.primary,
    secondary: p.context.secondary,
  },
}))

/**
 * Active personas only (recommended for production use)
 */
export const activePersonas: Persona[] = personas.filter((p) => p.active)

/**
 * Get persona by ID
 */
export function getPersonaById(id: PersonaId): Persona | undefined {
  return personas.find((p) => p.id === id)
}

/**
 * Get all persona IDs
 */
export function getPersonaIds(): PersonaId[] {
  return personas.map((p) => p.id as PersonaId)
}

/**
 * Get active persona IDs only
 */
export function getActivePersonaIds(): PersonaId[] {
  return activePersonas.map((p) => p.id as PersonaId)
}

/**
 * Default persona for generation (Tomoko - most basic)
 */
export const defaultPersona: Persona = personas[0]

/**
 * Metadata about the persona collection
 */
export const personasMetadata = personasData.metadata
