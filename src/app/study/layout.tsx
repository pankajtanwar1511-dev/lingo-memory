/**
 * Wraps every /study/* page in the KanjiDatasetProvider so the kanji
 * dataset switch (curated 86 / extended 117) propagates across listing,
 * dashboard, AND the kanji-practice route which is a sibling to
 * /study/kanji rather than a child. Pages that don't read the hook
 * just ignore the provider.
 */

import { KanjiDatasetProvider } from '@/hooks/use-kanji-dataset'

export default function StudySectionLayout({ children }: { children: React.ReactNode }) {
  return <KanjiDatasetProvider>{children}</KanjiDatasetProvider>
}
