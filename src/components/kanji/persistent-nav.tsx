'use client'

/**
 * Persistent top nav for the kanji section. Mounted in the kanji layout, so
 * the 4 icon tiles stay visible while only the content below swaps.
 *
 * The "Kanji" tile is a direct route. Drill / Dashboard / Reference open a
 * dropdown of 2 sub-routes. The active route is highlighted.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

export function KanjiPersistentNav() {
  const pathname = usePathname() || ''
  const isKanji = pathname === '/study/kanji/list'
  const isDrill = pathname === '/study/kanji/vocab-reveal'
  const isDashboard = pathname === '/study/kanji/progress'
  const isReference =
    pathname === '/study/kanji/vocabulary' || pathname === '/study/kanji/sentences'

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 py-2">
      <TileLink
        href="/study/kanji/list"
        icon={Languages}
        label="Kanji"
        active={isKanji}
        title="Browse all kanji — switch between Kanji (86) and Extended (117)"
      />
      <TileMenu
        icon={Eye}
        label="Drill"
        active={isDrill}
        title="Active recall sessions (SRS)"
        items={DRILL_ITEMS}
      />
      <TileMenu
        icon={TrendingUp}
        label="Dashboard"
        active={isDashboard}
        title="Progress overview · streaks · coverage"
        items={DASHBOARD_ITEMS}
      />
      <TileMenu
        icon={BookOpen}
        label="Reference"
        active={isReference}
        title="Browse the vocab and sentence corpora"
        items={REFERENCE_ITEMS}
      />
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────

const tileBtn = (active: boolean) =>
  `h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer ${
    active
      ? 'bg-primary text-primary-foreground border-primary shadow-md'
      : 'bg-gradient-to-br from-primary/10 to-transparent text-primary hover:border-primary hover:from-primary/20 hover:shadow-md'
  }`

const TILE_ICON = 'h-7 w-7 sm:h-9 sm:w-9'

function TileShell({
  children,
  label,
  title,
  active,
}: {
  children: React.ReactNode
  label: string
  title: string
  active: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 group" title={title}>
      {children}
      <span
        className={`text-xs sm:text-sm font-medium transition-colors ${
          active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
        }`}
      >
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
  active,
}: {
  href: string
  icon: LucideIcon
  label: string
  title: string
  active: boolean
}) {
  return (
    <TileShell label={label} title={title} active={active}>
      <Link href={href} className={tileBtn(active)} aria-label={label}>
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
  active,
}: {
  icon: LucideIcon
  label: string
  title: string
  items: SubItem[]
  active: boolean
}) {
  return (
    <TileShell label={label} title={title} active={active}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={tileBtn(active)} aria-label={label}>
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
