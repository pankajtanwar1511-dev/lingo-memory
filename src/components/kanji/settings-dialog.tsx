'use client'

/**
 * Single settings surface for the entire Kanji section.
 *
 * Lives only on the Kanji hub (/study/kanji). Sub-pages do not host their
 * own settings. Anything that's a persistent "config" for the kanji domain —
 * dataset choice, drill SRS tuning, tools — lives in here.
 *
 * Per-page UI controls (search, sort, status filter, drill session filters)
 * stay inline on the page they belong to.
 */

import { useState } from 'react'
import Link from 'next/link'
import { Settings, BookOpenText, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useKanjiDataset, DATASETS, type KanjiDataset } from '@/hooks/use-kanji-dataset'
import { useSettings } from '@/contexts/settings-context'

export function KanjiSettingsButton({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`h-9 w-9 ${className}`}
          aria-label="Kanji settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Kanji settings</DialogTitle>
          <DialogDescription>
            One place for everything: dataset, drill behavior, tools.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-2 max-h-[70vh] overflow-y-auto pr-1">
          <DatasetSection />
          <DrillSrsSection />
          <ToolsSection />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DatasetSection() {
  const { dataset, setDataset } = useKanjiDataset()
  const options: KanjiDataset[] = ['curated', 'extended']
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold">Dataset</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Which kanji set the pages display.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((id) => {
          const meta = DATASETS[id]
          const active = dataset === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setDataset(id)}
              className={`text-left rounded-lg border p-3 transition-colors ${
                active
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/40'
                  : 'border-input hover:border-foreground/30'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-sm">{meta.label}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{meta.count}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                {meta.description}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function DrillSrsSection() {
  const { settings, updateSettings } = useSettings()
  const decay = settings?.srsDecayDays ?? 7
  const mult = settings?.srsQueueMultiplier ?? 1.5

  return (
    <section className="space-y-4 pt-4 border-t">
      <div>
        <h3 className="text-sm font-semibold">Drill · spaced repetition</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tunes the vocab-reveal drill. Cards have 5 levels (0 = new, 4 = mastered);
          lower-level cards appear more often.
        </p>
      </div>

      {/* Decay days */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <label className="text-xs font-medium">
            Idle days before a card drops one level
          </label>
          <span className="text-xs tabular-nums text-muted-foreground">{decay}d</span>
        </div>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={decay}
          onChange={(e) => updateSettings({ srsDecayDays: Number(e.target.value) })}
          className="w-full accent-primary"
        />
        <p className="text-[11px] text-muted-foreground">
          A card untouched for this many days demotes by one level next session.
          Lower = stricter review cadence.
        </p>
      </div>

      {/* Queue multiplier */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <label className="text-xs font-medium">Queue length multiplier</label>
          <span className="text-xs tabular-nums text-muted-foreground">×{mult.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={1.0}
          max={3.0}
          step={0.1}
          value={mult}
          onChange={(e) => updateSettings({ srsQueueMultiplier: Number(e.target.value) })}
          className="w-full accent-primary"
        />
        <p className="text-[11px] text-muted-foreground">
          Built session queue = pool × this. Higher = more repeats per session,
          lower = tighter loops.
        </p>
      </div>
    </section>
  )
}

function ToolsSection() {
  return (
    <section className="space-y-2 pt-4 border-t">
      <div>
        <h3 className="text-sm font-semibold">Tools</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Less-used surfaces tucked here so the main page stays clean.
        </p>
      </div>
      <DialogClose asChild>
        <Link href="/study/kanji-practice" className="block">
          <div className="flex items-center gap-3 rounded-lg border p-3 hover:border-foreground/30 transition-colors cursor-pointer group">
            <BookOpenText className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">Flashcard browse</div>
              <div className="text-[11px] text-muted-foreground">
                Sequential flip-through · marks cards as viewed
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </DialogClose>
    </section>
  )
}
