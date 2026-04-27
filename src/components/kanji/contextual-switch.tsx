'use client'

/**
 * Context-aware top-left switch in the kanji layout.
 *
 *   - On /study/kanji/list      → "Kanji 86 | Extended 117" (dataset toggle)
 *   - On /study/kanji/vocab-reveal → "Vocab | Sentence" (drill side)
 *   - On /study/kanji/progress  → "Vocab | Sentence" (dashboard side)
 *   - On /study/kanji/vocabulary or /sentences → "Vocab | Sentence" (ref side)
 *
 * For sides where the Sentence variant doesn't exist yet, the chip is shown
 * disabled with a "Coming soon" tooltip.
 */

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { KanjiDatasetSwitch } from '@/components/kanji/dataset-switch'

type Side = 'drill' | 'dashboard' | 'reference'
type Variant = 'vocab' | 'sentence'

const SIDE_ROUTES: Record<Side, Record<Variant, string | null>> = {
  drill: {
    vocab: '/study/kanji/vocab-reveal',
    sentence: null, // not built yet
  },
  dashboard: {
    vocab: '/study/kanji/progress',
    sentence: null,
  },
  reference: {
    vocab: '/study/kanji/vocabulary',
    sentence: '/study/kanji/sentences',
  },
}

function pathToContext(pathname: string): { side: Side; variant: Variant } | null {
  if (pathname.startsWith('/study/kanji/vocab-reveal')) return { side: 'drill', variant: 'vocab' }
  if (pathname.startsWith('/study/kanji/progress')) return { side: 'dashboard', variant: 'vocab' }
  if (pathname.startsWith('/study/kanji/vocabulary')) return { side: 'reference', variant: 'vocab' }
  if (pathname.startsWith('/study/kanji/sentences')) return { side: 'reference', variant: 'sentence' }
  return null
}

export function KanjiContextualSwitch() {
  const pathname = usePathname() || ''

  // Default: kanji listing, dataset toggle
  if (pathname.startsWith('/study/kanji/list') || pathname === '/study/kanji') {
    return <KanjiDatasetSwitch />
  }

  const ctx = pathToContext(pathname)
  if (!ctx) return null

  return <VocabSentenceSwitch side={ctx.side} active={ctx.variant} />
}

function VocabSentenceSwitch({ side, active }: { side: Side; active: Variant }) {
  const router = useRouter()
  const routes = SIDE_ROUTES[side]
  const options: { id: Variant; label: string }[] = [
    { id: 'vocab', label: 'Vocab' },
    { id: 'sentence', label: 'Sentence' },
  ]

  return (
    <div
      className="inline-flex items-center rounded-lg border bg-muted/40 p-0.5"
      role="tablist"
      aria-label={`${side} variant`}
    >
      {options.map(({ id, label }) => {
        const route = routes[id]
        const isActive = active === id
        const disabled = !route
        const baseClass = `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'bg-background shadow-sm text-foreground'
            : disabled
              ? 'text-muted-foreground/50 cursor-not-allowed'
              : 'text-muted-foreground hover:text-foreground'
        }`
        if (disabled) {
          return (
            <button
              key={id}
              type="button"
              disabled
              className={baseClass}
              title="Coming soon"
            >
              {label}
              <span className="ml-1 text-[10px] opacity-60">soon</span>
            </button>
          )
        }
        if (isActive) {
          return (
            <button key={id} type="button" className={baseClass} aria-selected="true">
              {label}
            </button>
          )
        }
        return (
          <Link
            key={id}
            href={route!}
            className={baseClass}
            aria-selected="false"
            onClick={(e) => {
              // Prefetch isn't a problem; just route normally.
              e.stopPropagation()
              router.push(route! as any)
            }}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
