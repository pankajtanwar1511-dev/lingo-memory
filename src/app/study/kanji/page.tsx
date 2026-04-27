'use client'

/**
 * Kanji hub — single-page launcher.
 * Route: /study/kanji
 *
 * Just four big tiles + the dataset switch + the settings gear.
 * Click Kanji → /study/kanji/list (the actual grid).
 * Drill / Dashboard / Reference each open a 2-option dropdown.
 */

import { Header } from '@/components/layout/header'
import { KanjiHubTiles } from '@/components/kanji/section-tiles'
import { KanjiDatasetSwitch } from '@/components/kanji/dataset-switch'
import { KanjiSettingsButton } from '@/components/kanji/settings-dialog'

export default function KanjiHubPage() {
  return (
    <>
      <Header />
      <div className="container max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <KanjiDatasetSwitch />
          <KanjiSettingsButton />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Kanji</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Where would you like to start?
          </p>
        </div>

        <KanjiHubTiles />
      </div>
    </>
  )
}
