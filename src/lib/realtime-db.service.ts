/**
 * Realtime Database Service
 *
 * RTDB equivalent of the old Firestore-based firestore.service. Same API
 * surface so sync.service can swap implementations without churning.
 *
 * Cloud schema:
 *   users/{uid}/vocabulary/{cardId}        — VocabularyCard JSON + updatedAt(ms)
 *   users/{uid}/studyCards/{vocabularyId}  — StudyCard JSON + due(ms) + updatedAt(ms)
 *   users/{uid}/decks/{deckId}             — Deck metadata + cardIds[]
 *   users/{uid}                            — top-level settings/lastSyncAt etc.
 *
 * RTDB has no Timestamp type — Date <-> number(ms) conversion is done here.
 * `update()` is used over `set()` for partial writes (RTDB merges by default
 * on update; set replaces the entire node).
 */

import { ref, get, set, update, remove, onValue } from 'firebase/database'
import { database, isFirebaseConfigured } from '@/lib/firebase'
import { VocabularyCard, Deck } from '@/types/vocabulary'
import { StudyCard } from '@/store/study-store'

export class RealtimeDbService {
  isAvailable(): boolean {
    return isFirebaseConfigured() && !!database
  }

  // ========== Vocabulary ==========

  async syncVocabularyCard(userId: string, card: VocabularyCard): Promise<void> {
    if (!this.isAvailable()) return
    await update(ref(database!, `users/${userId}/vocabulary/${card.id}`), {
      ...this.serializeVocab(card),
      updatedAt: Date.now(),
    })
  }

  /** Bulk set; uses one multi-path update for atomicity. */
  async syncVocabularyCards(userId: string, cards: VocabularyCard[]): Promise<void> {
    if (!this.isAvailable() || cards.length === 0) return
    const ts = Date.now()
    const updates: Record<string, unknown> = {}
    for (const card of cards) {
      updates[`users/${userId}/vocabulary/${card.id}`] = {
        ...this.serializeVocab(card),
        updatedAt: ts,
      }
    }
    await update(ref(database!), updates)
  }

  async getVocabularyCards(userId: string): Promise<VocabularyCard[]> {
    if (!this.isAvailable()) return []
    const snap = await get(ref(database!, `users/${userId}/vocabulary`))
    if (!snap.exists()) return []
    const all = snap.val() as Record<string, unknown>
    return Object.values(all).map((v) => this.toVocabularyCard(v))
  }

  async deleteVocabularyCard(userId: string, cardId: string): Promise<void> {
    if (!this.isAvailable()) return
    await remove(ref(database!, `users/${userId}/vocabulary/${cardId}`))
  }

  /**
   * Real-time vocabulary listener. RTDB returns the full child set on every
   * change, not granular doc-changes — same shape as the Firestore version's
   * callback (whole-array). Fine for sync.service which iterates per-card.
   */
  subscribeToVocabulary(
    userId: string,
    callback: (cards: VocabularyCard[]) => void,
  ): () => void {
    if (!this.isAvailable()) return () => {}
    return onValue(ref(database!, `users/${userId}/vocabulary`), (snap) => {
      if (!snap.exists()) return callback([])
      const all = snap.val() as Record<string, unknown>
      callback(Object.values(all).map((v) => this.toVocabularyCard(v)))
    })
  }

  // ========== Study Cards ==========

  async syncStudyCard(userId: string, card: StudyCard): Promise<void> {
    if (!this.isAvailable()) return
    await update(ref(database!, `users/${userId}/studyCards/${card.vocabularyId}`), {
      ...this.serializeStudy(card),
      updatedAt: Date.now(),
    })
  }

  async syncStudyCards(userId: string, cards: StudyCard[]): Promise<void> {
    if (!this.isAvailable() || cards.length === 0) return
    const ts = Date.now()
    const updates: Record<string, unknown> = {}
    for (const card of cards) {
      updates[`users/${userId}/studyCards/${card.vocabularyId}`] = {
        ...this.serializeStudy(card),
        updatedAt: ts,
      }
    }
    await update(ref(database!), updates)
  }

  async getStudyCards(userId: string): Promise<StudyCard[]> {
    if (!this.isAvailable()) return []
    const snap = await get(ref(database!, `users/${userId}/studyCards`))
    if (!snap.exists()) return []
    const all = snap.val() as Record<string, unknown>
    return Object.values(all).map((v) => this.toStudyCard(v))
  }

  // ========== Decks ==========

  async syncDeck(userId: string, deck: Deck): Promise<void> {
    if (!this.isAvailable()) return
    // Strip the inline `cards` array (denormalized vocab refs); store cardIds
    // and let the consumer re-hydrate from the vocabulary path.
    const { cards, ...rest } = deck as Deck & { cards?: VocabularyCard[] }
    await update(ref(database!, `users/${userId}/decks/${deck.id}`), {
      ...rest,
      cardIds: (deck.cards || []).map((c) => c.id),
      // RTDB date serialization
      createdAt: deck.createdAt instanceof Date ? deck.createdAt.getTime() : deck.createdAt,
      updatedAt: Date.now(),
    })
  }

  async getDecks(userId: string): Promise<any[]> {
    if (!this.isAvailable()) return []
    const snap = await get(ref(database!, `users/${userId}/decks`))
    if (!snap.exists()) return []
    const all = snap.val() as Record<string, any>
    return Object.entries(all).map(([id, data]) => ({
      id,
      ...data,
      // Mimic Firestore Timestamp's .toDate() so existing consumers keep
      // working without changing their code.
      createdAt:
        typeof data.createdAt === 'number'
          ? { toDate: () => new Date(data.createdAt) }
          : data.createdAt,
      updatedAt:
        typeof data.updatedAt === 'number'
          ? { toDate: () => new Date(data.updatedAt) }
          : data.updatedAt,
    }))
  }

  // ========== User-level fields ==========

  async syncUserSettings(userId: string, settings: any): Promise<void> {
    if (!this.isAvailable()) return
    await update(ref(database!, `users/${userId}`), {
      settings,
      updatedAt: Date.now(),
    })
  }

  async getUserSettings(userId: string): Promise<any> {
    if (!this.isAvailable()) return null
    const snap = await get(ref(database!, `users/${userId}`))
    if (!snap.exists()) return null
    return snap.val()?.settings ?? null
  }

  // ========== Sync status ==========

  async updateLastSync(userId: string): Promise<void> {
    if (!this.isAvailable()) return
    await update(ref(database!, `users/${userId}`), { lastSyncAt: Date.now() })
  }

  async getLastSync(userId: string): Promise<Date | null> {
    if (!this.isAvailable()) return null
    const snap = await get(ref(database!, `users/${userId}/lastSyncAt`))
    if (!snap.exists()) return null
    const v = snap.val()
    return typeof v === 'number' ? new Date(v) : null
  }

  // ========== Serialization helpers ==========

  private serializeVocab(card: VocabularyCard): Record<string, unknown> {
    return {
      ...card,
      createdAt: card.createdAt instanceof Date ? card.createdAt.getTime() : card.createdAt,
    }
  }

  private serializeStudy(card: StudyCard): Record<string, unknown> {
    return {
      ...card,
      // due is a Date in the StudyCard type
      due: card.due instanceof Date ? card.due.getTime() : card.due,
      lastReview:
        card.lastReview instanceof Date ? card.lastReview.getTime() : card.lastReview,
    }
  }

  private toVocabularyCard(data: any): VocabularyCard {
    return {
      id: data.id,
      kanji: data.kanji,
      kana: data.kana,
      meaning: data.meaning,
      jlptLevel: data.jlptLevel,
      partOfSpeech: data.partOfSpeech,
      tags: data.tags || [],
      examples: data.examples || [],
      source: data.source,
      license: data.license || { text: 'Unknown', url: '' },
      createdAt: typeof data.createdAt === 'number' ? new Date(data.createdAt) : new Date(),
      updatedAt: typeof data.updatedAt === 'number' ? new Date(data.updatedAt) : new Date(),
    } as VocabularyCard
  }

  private toStudyCard(data: any): StudyCard {
    return {
      vocabularyId: data.vocabularyId,
      state: data.state,
      due: typeof data.due === 'number' ? new Date(data.due) : new Date(),
      stability: data.stability,
      difficulty: data.difficulty,
      elapsedDays: data.elapsed_days ?? data.elapsedDays ?? 0,
      scheduledDays: data.scheduled_days ?? data.scheduledDays ?? 0,
      reps: data.reps ?? 0,
      lapses: data.lapses ?? 0,
      lastReview: typeof data.last_review === 'number'
        ? new Date(data.last_review)
        : typeof data.lastReview === 'number'
          ? new Date(data.lastReview)
          : undefined,
    }
  }
}

export const realtimeDbService = new RealtimeDbService()

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  ;(window as any).realtimeDbService = realtimeDbService
}
