'use client'

/**
 * useSrsIntervals — read/write the per-user SRS review intervals.
 *
 * Storage: cloud-progress.service under key `extended-kanji-srs-intervals`.
 * Means the schedule syncs across devices for free, and falls back to
 * DEFAULT_SRS_INTERVALS when the user hasn't customised yet.
 *
 * Usage:
 *   const { intervals, setIntervals, reset, loading } = useSrsIntervals()
 *   const due = isDue(progress[id], Date.now(), intervals)
 */

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { loadProgress, saveProgress } from '@/services/cloud-progress.service'
import { DEFAULT_SRS_INTERVALS, SrsIntervals } from '@/lib/extended-kanji/stats'

export const SRS_INTERVALS_KEY = 'extended-kanji-srs-intervals'

/** Each value is days. Hard caps to keep the UI sane. */
export const INTERVAL_BOUNDS = { min: 1, max: 365 } as const

function sanitize(input: Partial<SrsIntervals> | null | undefined): SrsIntervals {
  const out = { ...DEFAULT_SRS_INTERVALS }
  if (!input) return out
  for (const key of [0, 1, 2, 3, 4, 5] as const) {
    const v = input[key]
    if (typeof v === 'number' && Number.isFinite(v)) {
      out[key] = Math.max(INTERVAL_BOUNDS.min, Math.min(INTERVAL_BOUNDS.max, Math.round(v)))
    }
  }
  return out
}

export function useSrsIntervals() {
  const { user } = useAuth()
  const [intervals, setIntervalsState] = useState<SrsIntervals>(DEFAULT_SRS_INTERVALS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const stored = await loadProgress<Partial<SrsIntervals> | null>(
        user?.uid,
        SRS_INTERVALS_KEY,
        null,
      )
      if (cancelled) return
      setIntervalsState(sanitize(stored))
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [user?.uid])

  const setIntervals = useCallback(
    (next: SrsIntervals) => {
      const clean = sanitize(next)
      setIntervalsState(clean)
      saveProgress(user?.uid, SRS_INTERVALS_KEY, clean)
    },
    [user?.uid],
  )

  const reset = useCallback(() => {
    setIntervalsState(DEFAULT_SRS_INTERVALS)
    saveProgress(user?.uid, SRS_INTERVALS_KEY, DEFAULT_SRS_INTERVALS)
  }, [user?.uid])

  return { intervals, setIntervals, reset, loading }
}
