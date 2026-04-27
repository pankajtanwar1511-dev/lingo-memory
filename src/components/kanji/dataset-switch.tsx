'use client'

import { useKanjiDataset, DATASETS, type KanjiDataset } from '@/hooks/use-kanji-dataset'

/**
 * Always-visible segmented control for switching between the two kanji
 * datasets. Backed by the shared KanjiDatasetProvider context — clicks
 * propagate to every page in the kanji section.
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
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              active
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title={meta.description}
          >
            {meta.label}
            <span className="tabular-nums opacity-60 text-xs">{meta.count}</span>
          </button>
        )
      })}
    </div>
  )
}
