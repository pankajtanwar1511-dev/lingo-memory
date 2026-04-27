'use client'

/**
 * Single settings surface for the entire Kanji section.
 *
 * Triggered by a gear icon in the page header. Anything that's a "config"
 * for the kanji domain — across listing, dashboard, drill, practice —
 * lives in here. Today: just the dataset switch. Tomorrow: anything else
 * that would otherwise scatter into individual page headers.
 */

import { useState } from 'react'
import Link from 'next/link'
import { Settings, BookOpenText, ArrowRight, Search, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
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
import {
  useKanjiListFilters,
  type ListSortOption,
  type ListStatusFilter,
} from '@/hooks/use-kanji-list-filters'

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
            Applies across listing, dashboard, drill, and flashcards.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-2 max-h-[70vh] overflow-y-auto pr-1">
          <DatasetSection />
          <FiltersSection />
          <ToolsSection />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FiltersSection() {
  const { search, setSearch, sortBy, setSortBy, statusFilter, setStatusFilter, isAnyActive, reset } =
    useKanjiListFilters()
  const chips: { id: ListStatusFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'untouched', label: 'Not viewed' },
    { id: 'viewed', label: 'Viewed' },
  ]
  return (
    <section className="space-y-3 pt-4 border-t">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">Filters</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Apply to the kanji listing grid.
          </p>
        </div>
        {isAnyActive && (
          <Button variant="ghost" size="sm" onClick={reset} className="h-7 text-xs gap-1">
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search kanji, reading, meaning, vocab…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sort */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Sort by</label>
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value as ListSortOption)}>
          <option value="default">Teacher order</option>
          <option value="kanji">Kanji (a→z)</option>
          <option value="vocab">Most vocab</option>
        </Select>
      </div>

      {/* Status chips */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Status</label>
        <div className="flex flex-wrap gap-1.5">
          {chips.map(({ id, label }) => (
            <Button
              key={id}
              size="sm"
              variant={statusFilter === id ? 'default' : 'outline'}
              onClick={() => setStatusFilter(id)}
              className="h-7 text-xs"
            >
              {label}
            </Button>
          ))}
        </div>
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
