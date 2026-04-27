'use client'

/**
 * useKanjiDataset — single source of truth for which kanji set the kanji
 * pages display. Persisted via cloud-progress.service so the choice syncs
 * across devices.
 *
 *   - 'curated'  : 86 kanji in kanji.json (teacher's KANJI_REFERENCE.md set)
 *   - 'extended' : 117 prerequisite kanji in prerequisite-detailed.json
 *
 * Both files yield ExtendedKanji-compatible objects, so consumer pages
 * just swap the fetch URL based on `dataset` and everything downstream
 * (listing, dashboard, practice) works without further changes.
 */

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { loadProgress, saveProgress } from '@/services/cloud-progress.service'

export type KanjiDataset = 'curated' | 'extended'

export const KANJI_DATASET_KEY = 'kanji-dataset-choice'

export interface KanjiDatasetMeta {
  id: KanjiDataset
  label: string
  count: number
  fetchUrl: string
  description: string
}

export const DATASETS: Record<KanjiDataset, KanjiDatasetMeta> = {
  curated: {
    id: 'curated',
    label: 'Kanji',
    count: 86,
    fetchUrl: '/seed-data/extended-kanji/kanji.json',
    description: '86 kanji from the teacher reference (37 lessons)',
  },
  extended: {
    id: 'extended',
    label: 'Extended',
    count: 117,
    fetchUrl: '/seed-data/extended-kanji/prerequisite-detailed.json',
    description: '117 prerequisite kanji set with stroke-by-stroke drawings',
  },
}

export function useKanjiDataset() {
  const { user } = useAuth()
  const [dataset, setDatasetState] = useState<KanjiDataset>('curated')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const stored = await loadProgress<KanjiDataset>(user?.uid, KANJI_DATASET_KEY, 'curated')
      if (cancelled) return
      // Defensive: if the stored value isn't one of the known options, fall back.
      setDatasetState(stored === 'extended' ? 'extended' : 'curated')
      setLoaded(true)
    })()
    return () => {
      cancelled = true
    }
  }, [user?.uid])

  const setDataset = useCallback(
    (next: KanjiDataset) => {
      setDatasetState(next)
      saveProgress(user?.uid, KANJI_DATASET_KEY, next)
    },
    [user?.uid],
  )

  return { dataset, setDataset, meta: DATASETS[dataset], loaded }
}
