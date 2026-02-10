/**
 * Service for loading and managing particle learning data
 */

import { ParticleLearningData, ParticleGuide } from "@/types/particle-learning"

let cachedData: ParticleLearningData | null = null

export async function loadParticleLearningData(): Promise<ParticleLearningData> {
  if (cachedData) {
    return cachedData
  }

  const response = await fetch('/dlingo/special_vocab_and_particle_usage.json')
  if (!response.ok) {
    throw new Error('Failed to load particle learning data')
  }

  cachedData = await response.json()
  return cachedData!
}

export function getParticleById(particleId: string): ParticleGuide | null {
  if (!cachedData) return null

  return cachedData.particleGuide.find(
    p => p.particle === particleId
  ) || null
}

export function getAllParticles(): ParticleGuide[] {
  return cachedData?.particleGuide || []
}

export function getRandomExample(particle: string): any | null {
  const particleData = getParticleById(particle)
  if (!particleData || particleData.examples.length === 0) return null

  const randomIndex = Math.floor(Math.random() * particleData.examples.length)
  return particleData.examples[randomIndex]
}

// Quiz generation
export interface ParticleQuizQuestion {
  id: string
  type: "fill-blank" | "multiple-choice" | "true-false"
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  particle: string
}

export function generateQuizQuestions(
  particles: string[],
  count: number = 10
): ParticleQuizQuestion[] {
  if (!cachedData) return []

  const questions: ParticleQuizQuestion[] = []
  const particlesData = particles.map(p => getParticleById(p)).filter(Boolean) as ParticleGuide[]

  for (let i = 0; i < count && particlesData.length > 0; i++) {
    const particle = particlesData[i % particlesData.length]
    const examples = particle.examples

    if (examples.length === 0) continue

    const example = examples[Math.floor(Math.random() * examples.length)]

    // Create fill-in-the-blank question
    const questionText = example.japanese.replace(particle.particle, "___")

    // Generate options
    const allParticles = ["に", "を", "が", "で", "は", "も", "の", "と", "から", "まで", "へ"]
    const wrongOptions = allParticles
      .filter(p => p !== particle.particle)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const options = [particle.particle, ...wrongOptions].sort(() => Math.random() - 0.5)

    questions.push({
      id: `q${i}`,
      type: "multiple-choice",
      question: questionText,
      options,
      correctAnswer: particle.particle,
      explanation: example.note || particle.primaryUse,
      particle: particle.particle
    })
  }

  return questions
}
