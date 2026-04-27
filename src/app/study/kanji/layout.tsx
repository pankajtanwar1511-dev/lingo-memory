/**
 * Persistent layout for the kanji section. The 4-icon nav + dataset switch +
 * gear are mounted once here and stay put while the inner page content
 * (listing, drill, dashboard, references) swaps below.
 *
 * Next.js layouts don't unmount when you navigate between sibling routes
 * that share a layout, so this gives the user the "icons stay at top" UX
 * they asked for without having to refactor every page into one big
 * tabbed component.
 */

'use client'

import { Header } from '@/components/layout/header'
import { KanjiPersistentNav } from '@/components/kanji/persistent-nav'
import { KanjiContextualSwitch } from '@/components/kanji/contextual-switch'
import { KanjiSettingsButton } from '@/components/kanji/settings-dialog'

export default function KanjiSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {/* Sticky persistent nav — stays visible as the inner content swaps */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b">
        <div className="container max-w-5xl mx-auto px-4 pt-3 pb-2 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <KanjiContextualSwitch />
            <KanjiSettingsButton />
          </div>
          <KanjiPersistentNav />
        </div>
      </div>

      <main className="container max-w-5xl mx-auto px-4 py-4">{children}</main>
    </>
  )
}
