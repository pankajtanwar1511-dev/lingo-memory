'use client'

/**
 * Kanji hub — 4 large icon tiles.
 *   - Kanji      : direct link to the listing/grid
 *   - Drill      : dropdown → Vocab drill / Sentence drill
 *   - Dashboard  : dropdown → Vocab dashboard / Sentence dashboard
 *   - Reference  : dropdown → Vocab reference / Sentence reference
 *
 * Sentence-side items that don't exist yet are shown as "Coming soon"
 * disabled rows so the 2-option symmetry is consistent.
 */

import Link from 'next/link'
import {
  Eye,
  BookOpen,
  Quote,
  TrendingUp,
  Languages,
  type LucideIcon,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SubItem {
  href: string
  label: string
  icon: LucideIcon
  hint: string
  disabled?: boolean
}

const DRILL_ITEMS: SubItem[] = [
  {
    href: '/study/kanji/vocab-reveal',
    label: 'Vocab drill',
    icon: BookOpen,
    hint: 'SRS · see kanji, recall the reading',
  },
  {
    href: '#',
    label: 'Sentence drill',
    icon: Quote,
    hint: 'Coming soon',
    disabled: true,
  },
]

const DASHBOARD_ITEMS: SubItem[] = [
  {
    href: '/study/kanji/progress',
    label: 'Vocab dashboard',
    icon: BookOpen,
    hint: 'Streak · today · vocab coverage',
  },
  {
    href: '#',
    label: 'Sentence dashboard',
    icon: Quote,
    hint: 'Coming soon',
    disabled: true,
  },
]

const REFERENCE_ITEMS: SubItem[] = [
  {
    href: '/study/kanji/vocabulary',
    label: 'Vocab reference',
    icon: BookOpen,
    hint: 'Browse / search the vocab list',
  },
  {
    href: '/study/kanji/sentences',
    label: 'Sentence reference',
    icon: Quote,
    hint: 'Browse the sentence corpus',
  },
]

export function KanjiHubTiles() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
      <TileLink
        href="/study/kanji/list"
        icon={Languages}
        label="Kanji"
        title="Browse all kanji — switch between Kanji (86) and Extended (117)"
      />
      <TileMenu
        icon={Eye}
        label="Drill"
        title="Active recall sessions (SRS)"
        items={DRILL_ITEMS}
      />
      <TileMenu
        icon={TrendingUp}
        label="Dashboard"
        title="Progress overview · streaks · coverage"
        items={DASHBOARD_ITEMS}
      />
      <TileMenu
        icon={BookOpen}
        label="Reference"
        title="Browse the vocab and sentence corpora"
        items={REFERENCE_ITEMS}
      />
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────

function TileShell({
  children,
  label,
  title,
}: {
  children: React.ReactNode
  label: string
  title: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 group" title={title}>
      {children}
      <span className="text-sm sm:text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
    </div>
  )
}

const TILE_BUTTON =
  'h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-2 bg-gradient-to-br from-primary/10 to-transparent text-primary flex items-center justify-center hover:border-primary hover:from-primary/20 transition-all hover:shadow-lg cursor-pointer'
const TILE_ICON = 'h-10 w-10 sm:h-12 sm:w-12'

function TileLink({
  href,
  icon: Icon,
  label,
  title,
}: {
  href: string
  icon: LucideIcon
  label: string
  title: string
}) {
  return (
    <TileShell label={label} title={title}>
      <Link href={href} className={TILE_BUTTON} aria-label={label}>
        <Icon className={TILE_ICON} />
      </Link>
    </TileShell>
  )
}

function TileMenu({
  icon: Icon,
  label,
  title,
  items,
}: {
  icon: LucideIcon
  label: string
  title: string
  items: SubItem[]
}) {
  return (
    <TileShell label={label} title={title}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={TILE_BUTTON} aria-label={label}>
            <Icon className={TILE_ICON} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-64">
          {items.map((item) => {
            const ItemIcon = item.icon
            const inner = (
              <div className="flex items-start gap-2.5 w-full">
                <ItemIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium leading-tight">{item.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{item.hint}</div>
                </div>
              </div>
            )
            if (item.disabled) {
              return (
                <DropdownMenuItem
                  key={item.label}
                  disabled
                  className="cursor-not-allowed opacity-60 py-2.5"
                >
                  {inner}
                </DropdownMenuItem>
              )
            }
            return (
              <DropdownMenuItem key={item.label} asChild className="py-2.5 cursor-pointer">
                <Link href={item.href}>{inner}</Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </TileShell>
  )
}
