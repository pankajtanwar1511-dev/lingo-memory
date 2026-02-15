/**
 * Firestore Service
 *
 * Handles all Firestore database operations for cloud sync.
 * Manages vocabulary, study cards, decks, and user data.
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore'
import { firestore, isFirebaseConfigured } from '@/lib/firebase'
import { VocabularyCard, Deck } from '@/types/vocabulary'
import { StudyCard } from '@/store/study-store'

export class FirestoreService {
  /**
   * Check if Firestore is available
   */
  isAvailable(): boolean {
    return isFirebaseConfigured() && !!firestore
  }

  // ========== Vocabulary Operations ==========

  /**
   * Sync vocabulary card to Firestore
   */
  async syncVocabularyCard(userId: string, card: VocabularyCard): Promise<void> {
    if (!this.isAvailable()) return

    const docRef = doc(firestore!, `users/${userId}/vocabulary/${card.id}`)
    await setDoc(docRef, {
      ...card,
      updatedAt: Timestamp.now(),
    }, { merge: true })
  }

  /**
   * Batch sync multiple vocabulary cards
   */
  async syncVocabularyCards(userId: string, cards: VocabularyCard[]): Promise<void> {
    if (!this.isAvailable() || cards.length === 0) return

    const batch = writeBatch(firestore!)
    const timestamp = Timestamp.now()

    cards.forEach(card => {
      const docRef = doc(firestore!, `users/${userId}/vocabulary/${card.id}`)
      batch.set(docRef, {
        ...card,
        updatedAt: timestamp,
      }, { merge: true })
    })

    await batch.commit()
  }

  /**
   * Get all vocabulary cards for a user
   */
  async getVocabularyCards(userId: string): Promise<VocabularyCard[]> {
    if (!this.isAvailable()) return []

    const snapshot = await getDocs(
      collection(firestore!, `users/${userId}/vocabulary`)
    )

    return snapshot.docs.map(doc => this.toVocabularyCard(doc.data()))
  }

  /**
   * Delete vocabulary card from Firestore
   */
  async deleteVocabularyCard(userId: string, cardId: string): Promise<void> {
    if (!this.isAvailable()) return

    await deleteDoc(doc(firestore!, `users/${userId}/vocabulary/${cardId}`))
  }

  /**
   * Listen to vocabulary changes in real-time
   */
  subscribeToVocabulary(
    userId: string,
    callback: (cards: VocabularyCard[]) => void
  ): () => void {
    if (!this.isAvailable()) {
      return () => {}
    }

    return onSnapshot(
      collection(firestore!, `users/${userId}/vocabulary`),
      (snapshot) => {
        const cards = snapshot.docs.map(doc => this.toVocabularyCard(doc.data()))
        callback(cards)
      }
    )
  }

  // ========== Study Cards Operations ==========

  /**
   * Sync study card to Firestore
   */
  async syncStudyCard(userId: string, card: StudyCard): Promise<void> {
    if (!this.isAvailable()) return

    const docRef = doc(firestore!, `users/${userId}/studyCards/${card.vocabularyId}`)
    await setDoc(docRef, {
      ...card,
      due: card.due ? Timestamp.fromDate(card.due) : null,
      updatedAt: Timestamp.now(),
    }, { merge: true })
  }

  /**
   * Batch sync study cards
   */
  async syncStudyCards(userId: string, cards: StudyCard[]): Promise<void> {
    if (!this.isAvailable() || cards.length === 0) return

    const batch = writeBatch(firestore!)
    const timestamp = Timestamp.now()

    cards.forEach(card => {
      const docRef = doc(firestore!, `users/${userId}/studyCards/${card.vocabularyId}`)
      batch.set(docRef, {
        ...card,
        due: card.due ? Timestamp.fromDate(card.due) : null,
        updatedAt: timestamp,
      }, { merge: true })
    })

    await batch.commit()
  }

  /**
   * Get all study cards for a user
   */
  async getStudyCards(userId: string): Promise<StudyCard[]> {
    if (!this.isAvailable()) return []

    const snapshot = await getDocs(
      collection(firestore!, `users/${userId}/studyCards`)
    )

    return snapshot.docs.map(doc => this.toStudyCard(doc.data()))
  }

  // ========== Deck Operations ==========

  /**
   * Sync deck to Firestore
   */
  async syncDeck(userId: string, deck: Deck): Promise<void> {
    if (!this.isAvailable()) return

    const docRef = doc(firestore!, `users/${userId}/decks/${deck.id}`)
    await setDoc(docRef, {
      ...deck,
      cards: undefined, // Don't store cards array, use cardIds
      cardIds: deck.cards.map(c => c.id),
      updatedAt: Timestamp.now(),
    }, { merge: true })
  }

  /**
   * Get all decks for a user
   */
  async getDecks(userId: string): Promise<any[]> {
    if (!this.isAvailable()) return []

    const snapshot = await getDocs(
      collection(firestore!, `users/${userId}/decks`)
    )

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  }

  // ========== User Settings ==========

  /**
   * Sync user settings to Firestore
   */
  async syncUserSettings(userId: string, settings: any): Promise<void> {
    if (!this.isAvailable()) return

    const docRef = doc(firestore!, `users/${userId}`)
    await setDoc(docRef, {
      settings,
      updatedAt: Timestamp.now(),
    }, { merge: true })
  }

  /**
   * Get user settings from Firestore
   */
  async getUserSettings(userId: string): Promise<any> {
    if (!this.isAvailable()) return null

    const docRef = doc(firestore!, `users/${userId}`)
    const snapshot = await getDoc(docRef)

    if (snapshot.exists()) {
      return snapshot.data().settings
    }

    return null
  }

  // ========== Sync Status ==========

  /**
   * Update last sync timestamp
   */
  async updateLastSync(userId: string): Promise<void> {
    if (!this.isAvailable()) return

    const docRef = doc(firestore!, `users/${userId}`)
    await setDoc(docRef, {
      lastSyncAt: Timestamp.now(),
    }, { merge: true })
  }

  /**
   * Get last sync timestamp
   */
  async getLastSync(userId: string): Promise<Date | null> {
    if (!this.isAvailable()) return null

    const docRef = doc(firestore!, `users/${userId}`)
    const snapshot = await getDoc(docRef)

    if (snapshot.exists() && snapshot.data().lastSyncAt) {
      return snapshot.data().lastSyncAt.toDate()
    }

    return null
  }

  // ========== Helper Methods ==========

  private toVocabularyCard(data: DocumentData): VocabularyCard {
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
      license: data.license || { text: "Unknown", url: "" },
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as VocabularyCard
  }

  private toStudyCard(data: DocumentData): StudyCard {
    return {
      vocabularyId: data.vocabularyId,
      state: data.state,
      due: data.due?.toDate() || new Date(),
      stability: data.stability,
      difficulty: data.difficulty,
      elapsedDays: data.elapsed_days || 0,
      scheduledDays: data.scheduled_days || 0,
      reps: data.reps || 0,
      lapses: data.lapses || 0,
      lastReview: data.last_review?.toDate(),
    }
  }
}

// Create singleton instance
export const firestoreService = new FirestoreService()

// Export for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).firestoreService = firestoreService
}
