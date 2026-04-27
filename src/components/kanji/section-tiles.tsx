'use client'

/**
 * Top-of-page nav for the kanji section. Three icon tiles instead of a
 * mixed mess of cards:
 *   - Dashboard : direct link
 *   - Drill     : dropdown of available drills (vocab today, sentence later)
 *   - Reference : dropdown of reference browsers (vocab, sentence)
 *
 * Each tile uses a big icon + label below; hover shows a description via
 * native title attr. Dropdowns open on click (DropdownMenu).
 */

import Link from 'next/link'
import { Eye, BookOpen, Quote, TrendingUp, type LucideIcon } from 'lucide-react'
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
    label: 'Vocab reading drill',
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

export function KanjiSectionTiles() {
  return (
    <div className="flex items-stretch gap-3 sm:gap-4">
      {/* Direct-link tile: Dashboard */}
      <TileLink
        href="/study/kanji/progress"
        icon={TrendingUp}
        label="Dashboard"
        title="Progress dashboard — streak, today, coverage, drill stats"
      />

      {/* Dropdown tile: Drill */}
      <TileMenu
        icon={Eye}
        label="Drill"
        title="Active recall sessions (SRS)"
        items={DRILL_ITEMS}
      />

      {/* Dropdown tile: Reference */}
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
    <div className="flex flex-col items-center gap-1.5 group" title={title}>
      {children}
      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
    </div>
  )
}

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
      <Link
        href={href}
        className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl border bg-gradient-to-br from-primary/10 to-transparent text-primary flex items-center justify-center hover:border-primary hover:from-primary/20 transition-all hover:shadow-md cursor-pointer"
        aria-label={label}
      >
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
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
          <button
            type="button"
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl border bg-gradient-to-br from-primary/10 to-transparent text-primary flex items-center justify-center hover:border-primary hover:from-primary/20 transition-all hover:shadow-md cursor-pointer"
            aria-label={label}
          >
            <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
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
                <DropdownMenuItem key={item.label} disabled className="cursor-not-allowed opacity-60 py-2.5">
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
