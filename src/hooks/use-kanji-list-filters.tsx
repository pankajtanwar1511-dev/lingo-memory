'use client'

/**
 * Listing filters live in a context so the settings dialog can edit them
 * without prop-drilling into the listing component.
 */

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export type ListSortOption = 'default' | 'kanji' | 'vocab'
export type ListStatusFilter = 'all' | 'untouched' | 'viewed'

interface KanjiListFiltersValue {
  search: string
  setSearch: (s: string) => void
  sortBy: ListSortOption
  setSortBy: (s: ListSortOption) => void
  statusFilter: ListStatusFilter
  setStatusFilter: (s: ListStatusFilter) => void
  isAnyActive: boolean
  reset: () => void
}

const Ctx = createContext<KanjiListFiltersValue | null>(null)

export function KanjiListFiltersProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<ListSortOption>('default')
  const [statusFilter, setStatusFilter] = useState<ListStatusFilter>('all')
  const reset = useCallback(() => {
    setSearch('')
    setSortBy('default')
    setStatusFilter('all')
  }, [])
  const isAnyActive = search.length > 0 || sortBy !== 'default' || statusFilter !== 'all'
  return (
    <Ctx.Provider
      value={{ search, setSearch, sortBy, setSortBy, statusFilter, setStatusFilter, isAnyActive, reset }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useKanjiListFilters(): KanjiListFiltersValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useKanjiListFilters must be used inside <KanjiListFiltersProvider>')
  return v
}
