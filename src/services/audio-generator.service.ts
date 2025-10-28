/**
 * Audio Generator Service
 *
 * Generates audio files using Google Cloud Text-to-Speech API
 * Falls back to mock mode if Google Cloud is not available
 *
 * Features:
 * - Multiple voice options (male/female)
 * - Multiple speed options (slow/normal/fast)
 * - Audio format configuration (MP3, WAV)
 * - Batch processing with rate limiting
 * - Resume capability (skip existing files)
 * - Mock mode for testing without Google Cloud
 */

import * as fs from 'fs/promises'
import * as path from 'path'

export type AudioVoice = 'female-standard' | 'female-premium' | 'male-standard' | 'male-premium'
export type AudioSpeed = 'slow' | 'normal' | 'fast'
export type AudioFormat = 'mp3' | 'wav'

export interface AudioGenerationOptions {
  voice?: AudioVoice
  speed?: AudioSpeed
  format?: AudioFormat
  skipExisting?: boolean
  rateLimit?: number // Delay between requests in ms
}

export interface AudioGenerationResult {
  success: boolean
  filePath?: string
  fileSize?: number
  error?: string
  mockMode?: boolean
}

export interface BatchAudioOptions extends AudioGenerationOptions {
  concurrency?: number // Number of concurrent requests
}

export interface BatchAudioResult {
  success: boolean
  total: number
  successful: number
  failed: number
  skipped: number
  errors: Array<{ text: string; error: string }>
  mockMode: boolean
}

export interface AudioItem {
  text: string
  outputPath: string
}

export interface BatchCallbacks {
  onProgress?: (current: number, total: number) => void
  onSuccess?: (result: AudioGenerationResult) => void
  onError?: (result: AudioGenerationResult) => void
  onSkip?: () => void
}

export class AudioGeneratorService {
  private mockMode: boolean = false
  private ttsClient: any = null

  constructor() {}

  /**
   * Initialize the TTS client
   */
  async initialize(): Promise<void> {
    try {
      // Try to dynamically import Google Cloud TTS
      try {
        // @ts-ignore - Optional dependency, gracefully falls back to mock mode
        const { TextToSpeechClient } = await import('@google-cloud/text-to-speech')
        this.ttsClient = new TextToSpeechClient()
        this.mockMode = false
        console.log('✅ Google Cloud TTS client initialized')
      } catch (err) {
        console.warn('⚠️  Google Cloud TTS not available - running in MOCK MODE')
        console.warn('   To use real TTS: npm install @google-cloud/text-to-speech')
        this.mockMode = true
      }
    } catch (err) {
      console.error('Failed to initialize TTS client:', err)
      this.mockMode = true
    }
  }

  /**
   * Check if running in mock mode
   */
  isMockMode(): boolean {
    return this.mockMode
  }

  /**
   * Generate audio for text
   */
  async generateAudio(
    text: string,
    outputPath: string,
    options: AudioGenerationOptions = {}
  ): Promise<AudioGenerationResult> {
    try {
      // Ensure output directory exists
      const dir = path.dirname(outputPath)
      await fs.mkdir(dir, { recursive: true })

      // Check if file already exists and skip if requested
      if (options.skipExisting) {
        try {
          await fs.access(outputPath)
          return {
            success: true,
            filePath: outputPath,
            mockMode: this.mockMode,
          }
        } catch {
          // File doesn't exist, continue
        }
      }

      if (this.mockMode) {
        // Mock mode: Create dummy audio file
        const mockContent = `Mock audio for: ${text}`
        await fs.writeFile(outputPath, mockContent, 'utf-8')

        return {
          success: true,
          filePath: outputPath,
          fileSize: mockContent.length,
          mockMode: true,
        }
      } else {
        // Real mode: Use Google Cloud TTS
        const voice = options.voice || 'female-standard'
        const speed = options.speed || 'normal'
        const format = options.format || 'mp3'

        // Map voice to Google Cloud voice name
        const voiceMap: Record<AudioVoice, string> = {
          'female-standard': 'ja-JP-Wavenet-A',
          'female-premium': 'ja-JP-Neural2-B',
          'male-standard': 'ja-JP-Wavenet-C',
          'male-premium': 'ja-JP-Neural2-C',
        }

        // Map speed to speaking rate
        const speedMap: Record<AudioSpeed, number> = {
          'slow': 0.75,
          'normal': 1.0,
          'fast': 1.25,
        }

        const request = {
          input: { text },
          voice: {
            languageCode: 'ja-JP',
            name: voiceMap[voice],
          },
          audioConfig: {
            audioEncoding: format === 'mp3' ? 'MP3' : 'LINEAR16',
            speakingRate: speedMap[speed],
          },
        }

        const [response] = await this.ttsClient.synthesizeSpeech(request)
        await fs.writeFile(outputPath, response.audioContent, 'binary')

        const stats = await fs.stat(outputPath)

        return {
          success: true,
          filePath: outputPath,
          fileSize: stats.size,
          mockMode: false,
        }
      }
    } catch (err) {
      return {
        success: false,
        error: (err as Error).message,
        mockMode: this.mockMode,
      }
    }
  }

  /**
   * Generate audio for multiple items
   */
  async generateBatch(
    items: AudioItem[],
    options: BatchAudioOptions = {},
    callbacks?: BatchCallbacks
  ): Promise<BatchAudioResult> {
    const result: BatchAudioResult = {
      success: true,
      total: items.length,
      successful: 0,
      failed: 0,
      skipped: 0,
      errors: [],
      mockMode: this.mockMode,
    }

    const rateLimit = options.rateLimit || 100 // Default 100ms between requests

    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      // Call progress callback
      if (callbacks?.onProgress) {
        callbacks.onProgress(i + 1, items.length)
      }

      // Check if file exists (for resume capability)
      if (options.skipExisting) {
        try {
          await fs.access(item.outputPath)
          result.skipped++
          if (callbacks?.onSkip) {
            callbacks.onSkip()
          }
          continue
        } catch {
          // File doesn't exist, continue
        }
      }

      // Generate audio
      const audioResult = await this.generateAudio(item.text, item.outputPath, options)

      if (audioResult.success) {
        result.successful++
        if (callbacks?.onSuccess) {
          callbacks.onSuccess(audioResult)
        }
      } else {
        result.failed++
        result.errors.push({
          text: item.text,
          error: audioResult.error || 'Unknown error',
        })
        if (callbacks?.onError) {
          callbacks.onError(audioResult)
        }
      }

      // Rate limiting (except for last item)
      if (i < items.length - 1 && rateLimit > 0) {
        await new Promise(resolve => setTimeout(resolve, rateLimit))
      }
    }

    result.success = result.failed === 0

    return result
  }

  /**
   * Estimate cost for batch generation
   */
  estimateBatchCost(texts: string[], voice: AudioVoice): { characters: number; cost: number } {
    const totalChars = texts.reduce((sum, text) => sum + text.length, 0)

    // Pricing per 1M characters
    const pricePerMillion: Record<string, number> = {
      'female-standard': 4.00,
      'female-premium': 16.00,
      'male-standard': 4.00,
      'male-premium': 16.00,
    }

    const price = pricePerMillion[voice] || 4.00
    const cost = (totalChars / 1_000_000) * price

    return {
      characters: totalChars,
      cost,
    }
  }
}

/**
 * Factory function
 */
export async function createAudioGenerator(): Promise<AudioGeneratorService> {
  const service = new AudioGeneratorService()
  await service.initialize()
  return service
}
