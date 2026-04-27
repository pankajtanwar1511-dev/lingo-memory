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
import { Eye, BookOpen, TrendingUp, Languages, type LucideIcon } from 'lucide-react'

export function KanjiPersistentNav() {
  const pathname = usePathname() || ''
  const isKanji = pathname.startsWith('/study/kanji/list') || pathname === '/study/kanji'
  const isDrill = pathname.startsWith('/study/kanji/vocab-reveal')
  const isDashboard = pathname.startsWith('/study/kanji/progress')
  const isReference =
    pathname.startsWith('/study/kanji/vocabulary') || pathname.startsWith('/study/kanji/sentences')

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 py-2">
      <TileLink
        href="/study/kanji/list"
        icon={Languages}
        label="Kanji"
        active={isKanji}
        title="Browse all kanji — switch dataset via Kanji|Extended in the header"
      />
      <TileLink
        href="/study/kanji/vocab-reveal"
        icon={Eye}
        label="Drill"
        active={isDrill}
        title="Active recall sessions (SRS) — switch Vocab|Sentence in the header"
      />
      <TileLink
        href="/study/kanji/progress"
        icon={TrendingUp}
        label="Dashboard"
        active={isDashboard}
        title="Progress overview — switch Vocab|Sentence in the header"
      />
      <TileLink
        href="/study/kanji/vocabulary"
        icon={BookOpen}
        label="Reference"
        active={isReference}
        title="Browse — switch Vocab|Sentence in the header"
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

