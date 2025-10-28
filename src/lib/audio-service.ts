/**
 * Audio Service
 * Handles TTS (Text-to-Speech) and audio playback/caching
 */

import { VocabularyCard } from "@/types/vocabulary"

export interface AudioCacheEntry {
  text: string
  url: string
  timestamp: number
  expiresAt: number
}

class AudioService {
  private cache: Map<string, AudioCacheEntry> = new Map()
  private cacheExpiry = 24 * 60 * 60 * 1000 // 24 hours
  private synthesis: SpeechSynthesis | null = null
  private voices: SpeechSynthesisVoice[] = []

  constructor() {
    if (typeof window !== "undefined") {
      this.synthesis = window.speechSynthesis
      this.loadVoices()
    }
  }

  /**
   * Load available voices
   */
  private loadVoices() {
    if (!this.synthesis) return

    const loadVoicesList = () => {
      this.voices = this.synthesis!.getVoices()
    }

    loadVoicesList()

    // Chrome loads voices asynchronously
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoicesList
    }
  }

  /**
   * Get Japanese voice
   */
  private getJapaneseVoice(): SpeechSynthesisVoice | null {
    // Try to find a Japanese voice
    const japaneseVoices = this.voices.filter(
      voice => voice.lang.startsWith("ja")
    )

    if (japaneseVoices.length > 0) {
      // Prefer Google voices or high-quality voices
      const googleVoice = japaneseVoices.find(v => v.name.includes("Google"))
      if (googleVoice) return googleVoice

      return japaneseVoices[0]
    }

    return null
  }

  /**
   * Speak text using Web Speech API
   */
  async speak(text: string, options?: {
    rate?: number
    pitch?: number
    volume?: number
    lang?: string
  }): Promise<void> {
    if (!this.synthesis) {
      console.warn("Speech synthesis not supported")
      return
    }

    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      this.synthesis!.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Set voice
      const japaneseVoice = this.getJapaneseVoice()
      if (japaneseVoice) {
        utterance.voice = japaneseVoice
      }

      // Set options
      utterance.lang = options?.lang || "ja-JP"
      utterance.rate = options?.rate || 0.9 // Slightly slower for learning
      utterance.pitch = options?.pitch || 1.0
      utterance.volume = options?.volume || 1.0

      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(event)

      this.synthesis!.speak(utterance)
    })
  }

  /**
   * Stop speaking
   */
  stop() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  /**
   * Check if speaking
   */
  isSpeaking(): boolean {
    return this.synthesis?.speaking || false
  }

  /**
   * Play vocabulary card audio
   */
  async playVocabulary(card: VocabularyCard, playKanji: boolean = true) {
    const text = playKanji && card.kanji ? card.kanji : card.kana
    await this.speak(text)
  }

  /**
   * Play example sentence
   */
  async playExample(text: string) {
    await this.speak(text)
  }

  /**
   * Generate audio URL for text (for caching)
   * This would connect to a real TTS API in production
   */
  async generateAudioURL(text: string): Promise<string> {
    // Check cache first
    const cached = this.cache.get(text)
    if (cached && Date.now() < cached.expiresAt) {
      return cached.url
    }

    // In production, this would call an actual TTS API
    // For now, we return a placeholder or use Web Speech API
    // Example: OpenAI TTS, Google Cloud TTS, etc.

    const url = `/api/tts?text=${encodeURIComponent(text)}`

    // Cache the URL
    this.cache.set(text, {
      text,
      url,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.cacheExpiry
    })

    return url
  }

  /**
   * Preload audio for vocabulary cards
   */
  async preloadVocabulary(cards: VocabularyCard[]) {
    const promises = cards.map(card =>
      this.generateAudioURL(card.kana).catch(err => {
        console.error(`Failed to preload audio for ${card.kana}:`, err)
      })
    )

    await Promise.all(promises)
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache() {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Clear all cache
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size
  }

  /**
   * Get cache info
   */
  getCacheInfo() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.values())
    }
  }

  /**
   * Record audio (for pronunciation practice)
   */
  async recordAudio(durationMs: number = 5000): Promise<Blob | null> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn("Audio recording not supported")
      return null
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data)
          }
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" })
          stream.getTracks().forEach(track => track.stop())
          resolve(blob)
        }

        mediaRecorder.onerror = (event) => {
          stream.getTracks().forEach(track => track.stop())
          reject(event)
        }

        mediaRecorder.start()

        // Stop after duration
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop()
          }
        }, durationMs)
      })
    } catch (error) {
      console.error("Failed to record audio:", error)
      return null
    }
  }

  /**
   * Compare recorded audio with reference (placeholder)
   * In production, this would use speech recognition API
   */
  async compareAudio(
    recordedBlob: Blob,
    referenceText: string
  ): Promise<{
    similarity: number
    transcript: string
    feedback: string
  }> {
    // This would use a speech recognition API in production
    // For now, return placeholder
    return {
      similarity: 0.85,
      transcript: referenceText,
      feedback: "Good pronunciation!"
    }
  }
}

// Create singleton instance
export const audioService = new AudioService()

// Export for debugging
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).audioService = audioService
}
