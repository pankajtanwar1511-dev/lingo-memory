'use client'

import { useKanjiDataset, DATASETS, type KanjiDataset } from '@/hooks/use-kanji-dataset'

/**
 * Segmented control for switching between the two kanji datasets.
 * Persisted state lives in useKanjiDataset (cloud-synced) — pages just
 * read .dataset / .meta to know which set they're showing.
 */
export function KanjiDatasetSwitch({ className = '' }: { className?: string }) {
  const { dataset, setDataset } = useKanjiDataset()
  const options: KanjiDataset[] = ['curated', 'extended']

  return (
    <div
      className={`inline-flex items-center rounded-lg border bg-muted/40 p-0.5 ${className}`}
      role="tablist"
      aria-label="Kanji dataset"
    >
      {options.map((id) => {
        const meta = DATASETS[id]
        const active = dataset === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setDataset(id)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              active
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title={meta.description}
          >
            {meta.label}
            <span className="tabular-nums opacity-60 text-[10px]">{meta.count}</span>
          </button>
        )
      })}
    </div>
  )
}
