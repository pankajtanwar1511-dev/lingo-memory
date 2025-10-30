/**
 * Bookmarks Store - Manage bookmarked cards for focused study
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface BookmarksStore {
  // Bookmarked card IDs
  bookmarkedVocab: Set<string>
  bookmarkedKanji: Set<string>

  // Actions
  toggleVocabBookmark: (cardId: string) => void
  toggleKanjiBookmark: (cardId: string) => void
  isVocabBookmarked: (cardId: string) => boolean
  isKanjiBookmarked: (cardId: string) => boolean
  clearAllBookmarks: () => void
  getBookmarkCounts: () => { vocab: number; kanji: number; total: number }
}

export const useBookmarksStore = create<BookmarksStore>()(
  persist(
    (set, get) => ({
      bookmarkedVocab: new Set<string>(),
      bookmarkedKanji: new Set<string>(),

      toggleVocabBookmark: (cardId: string) => {
        set((state) => {
          const newSet = new Set(state.bookmarkedVocab)
          if (newSet.has(cardId)) {
            newSet.delete(cardId)
          } else {
            newSet.add(cardId)
          }
          return { bookmarkedVocab: newSet }
        })
      },

      toggleKanjiBookmark: (cardId: string) => {
        set((state) => {
          const newSet = new Set(state.bookmarkedKanji)
          if (newSet.has(cardId)) {
            newSet.delete(cardId)
          } else {
            newSet.add(cardId)
          }
          return { bookmarkedKanji: newSet }
        })
      },

      isVocabBookmarked: (cardId: string) => {
        return get().bookmarkedVocab.has(cardId)
      },

      isKanjiBookmarked: (cardId: string) => {
        return get().bookmarkedKanji.has(cardId)
      },

      clearAllBookmarks: () => {
        set({
          bookmarkedVocab: new Set<string>(),
          bookmarkedKanji: new Set<string>()
        })
      },

      getBookmarkCounts: () => {
        const { bookmarkedVocab, bookmarkedKanji } = get()
        return {
          vocab: bookmarkedVocab.size,
          kanji: bookmarkedKanji.size,
          total: bookmarkedVocab.size + bookmarkedKanji.size
        }
      }
    }),
    {
      name: "bookmarks-storage",
      // Custom storage to handle Set serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const { state } = JSON.parse(str)
          return {
            state: {
              ...state,
              bookmarkedVocab: new Set(state.bookmarkedVocab || []),
              bookmarkedKanji: new Set(state.bookmarkedKanji || [])
            }
          }
        },
        setItem: (name, value) => {
          const str = JSON.stringify({
            state: {
              ...value.state,
              bookmarkedVocab: Array.from(value.state.bookmarkedVocab),
              bookmarkedKanji: Array.from(value.state.bookmarkedKanji)
            }
          })
          localStorage.setItem(name, str)
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
)
