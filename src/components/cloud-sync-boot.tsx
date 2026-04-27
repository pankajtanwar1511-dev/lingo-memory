"use client"

/**
 * Cross-cutting cloud sync bridge for Zustand stores.
 *
 * Mounted once at the root layout. On user change, pulls cloud state into
 * the bookmarks store (union-merge with local). Subscribes to store changes
 * and debounces them to RTDB via cloud-progress.service.
 *
 * For per-page localStorage values, see cloud-progress.service directly.
 */

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useBookmarksStore } from "@/store/bookmarks-store"
import { loadProgress, saveProgress } from "@/services/cloud-progress.service"

const BOOKMARKS_KEY = "bookmarks"

interface BookmarksDoc {
  vocab: string[]
  kanji: string[]
}

export function CloudSyncBoot() {
  const { user } = useAuth()

  // 1. On user change: pull cloud bookmarks, union-merge with local store.
  useEffect(() => {
    let cancelled = false
    void (async () => {
      const cloud = await loadProgress<BookmarksDoc>(
        user?.uid,
        BOOKMARKS_KEY,
        { vocab: [], kanji: [] },
      )
      if (cancelled) return
      const state = useBookmarksStore.getState()
      const mergedVocab = new Set([...state.bookmarkedVocab, ...(cloud.vocab || [])])
      const mergedKanji = new Set([...state.bookmarkedKanji, ...(cloud.kanji || [])])
      // Only update if something actually changed.
      if (
        mergedVocab.size !== state.bookmarkedVocab.size ||
        mergedKanji.size !== state.bookmarkedKanji.size
      ) {
        useBookmarksStore.setState({
          bookmarkedVocab: mergedVocab,
          bookmarkedKanji: mergedKanji,
        })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user?.uid])

  // 2. Subscribe to bookmarks changes; debounce-flush to cloud.
  useEffect(() => {
    const unsub = useBookmarksStore.subscribe((state) => {
      saveProgress(user?.uid, BOOKMARKS_KEY, {
        vocab: Array.from(state.bookmarkedVocab),
        kanji: Array.from(state.bookmarkedKanji),
      })
    })
    return unsub
  }, [user?.uid])

  return null
}
