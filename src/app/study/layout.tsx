/**
 * Wraps every /study/* page in the KanjiDatasetProvider so the kanji
 * dataset switch (curated 86 / extended 117) propagates across listing,
 * dashboard, AND the kanji-practice route which is a sibling to
 * /study/kanji rather than a child. Pages that don't read the hook
 * just ignore the provider.
 */

import { KanjiDatasetProvider } from '@/hooks/use-kanji-dataset'
import { KanjiListFiltersProvider } from '@/hooks/use-kanji-list-filters'

export default function StudySectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <KanjiDatasetProvider>
      <KanjiListFiltersProvider>{children}</KanjiListFiltersProvider>
    </KanjiDatasetProvider>
  )
}
