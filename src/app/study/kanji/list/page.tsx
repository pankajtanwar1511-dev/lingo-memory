'use client';

/**
 * Extended Kanji — list page
 * Route: /study/kanji
 *
 * Data source: public/seed-data/extended-kanji/kanji.json (generated from
 * KANJI_REFERENCE.md). Does NOT merge with the /study/kanji dataset.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BookOpenText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { CardProgress, ExtendedKanji } from '@/types/extended-kanji';
import { READING_STYLES } from '@/lib/extended-kanji/readings';
import { useAuth } from '@/contexts/auth-context';
import { loadProgress } from '@/services/cloud-progress.service';
import { useKanjiDataset } from '@/hooks/use-kanji-dataset';
import { useKanjiListFilters } from '@/hooks/use-kanji-list-filters';
import { KanjiSettingsButton } from '@/components/kanji/settings-dialog';
import { KanjiDatasetSwitch } from '@/components/kanji/dataset-switch';
import { ArrowLeft } from 'lucide-react';

const PROGRESS_KEY = 'extended-kanji-practice-progress';


export default function ExtendedKanjiListPage() {
  const { meta: datasetMeta } = useKanjiDataset();
  // Wrap so we can `key` on dataset id and remount the inner state-holding
  // component when the user toggles. Cleanest way to flush every per-dataset
  // bit (filters, search, scroll) without coordinating resets manually.
  return <KanjiListInner key={datasetMeta.id} />;
}

function KanjiListInner() {
  const { user } = useAuth();
  const { meta: datasetMeta } = useKanjiDataset();
  const [kanjiList, setKanjiList] = useState<ExtendedKanji[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});
  const { search, sortBy, statusFilter, isAnyActive, reset: resetFilters } = useKanjiListFilters();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(datasetMeta.fetchUrl);
        if (!res.ok) throw new Error(`Failed to load ${datasetMeta.label} dataset`);
        const data = await res.json();
        setKanjiList(data.kanji as ExtendedKanji[]);
        const merged = await loadProgress<Record<string, CardProgress>>(
          user?.uid,
          PROGRESS_KEY,
          {},
        );
        setProgress(merged);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.uid, datasetMeta.fetchUrl, datasetMeta.label]);

  const filtered = useMemo(() => {
    let list = kanjiList;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (k) =>
          k.kanji.includes(q) ||
          k.meaning.toLowerCase().includes(q) ||
          k.onReadings.some((r) => r.toLowerCase().includes(q)) ||
          k.kunReadings.some((r) => r.toLowerCase().includes(q)) ||
          k.vocabulary.some(
            (v) =>
              v.word.toLowerCase().includes(q) ||
              v.reading.toLowerCase().includes(q) ||
              v.meaning.toLowerCase().includes(q),
          ),
      );
    }
    if (statusFilter === 'untouched') {
      list = list.filter((k) => !progress[k.id] || progress[k.id].reviewCount === 0);
    } else if (statusFilter === 'viewed') {
      list = list.filter((k) => !!progress[k.id] && progress[k.id].reviewCount > 0);
    }
    const sorted = [...list];
    switch (sortBy) {
      case 'kanji':
        sorted.sort((a, b) => a.kanji.localeCompare(b.kanji, 'ja'));
        break;
      case 'vocab':
        sorted.sort((a, b) => b.vocabulary.length - a.vocabulary.length);
        break;
      default:
        sorted.sort((a, b) => a.orderInReference - b.orderInReference);
    }
    return sorted;
  }, [kanjiList, search, sortBy, statusFilter, progress]);

  const totalVocab = kanjiList.reduce((sum, k) => sum + k.vocabulary.length, 0);
  const totalSentences = kanjiList.reduce((sum, k) => sum + k.exampleSentences.length, 0);

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center text-destructive">{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link href="/study/kanji">
            <Button variant="ghost" size="sm" className="gap-1 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Hub
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <KanjiDatasetSwitch />
            <KanjiSettingsButton />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h1 className="text-3xl font-bold">Kanji</h1>
            <p className="text-muted-foreground text-sm">
              {filtered.length} of {kanjiList.length} kanji · {datasetMeta.description}
            </p>
          </div>

          {/* If user has narrowed via settings filters, surface a subtle hint
              with a one-click reset so they don't get confused why N < total. */}
          {isAnyActive && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Filters active.</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-6 px-2 text-xs"
              >
                Reset
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{kanjiList.length}</div>
              <p className="text-xs text-muted-foreground">Total kanji</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{totalVocab}</div>
              <p className="text-xs text-muted-foreground">Vocabulary rows</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{totalSentences}</div>
              <p className="text-xs text-muted-foreground">Example sentences</p>
            </CardContent>
          </Card>
        </div>

        {/* Reading palette legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>Reading palette:</span>
          <span className="flex items-center gap-1.5">
            <span className={`inline-block px-2 py-0.5 rounded ${READING_STYLES.on.chip}`}>
              {READING_STYLES.on.label}
            </span>
            on'yomi (Sino-Japanese)
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`inline-block px-2 py-0.5 rounded ${READING_STYLES.kun.chip}`}>
              {READING_STYLES.kun.label}
            </span>
            kun'yomi (native Japanese)
          </span>
        </div>

        {/* Kanji grid */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-muted-foreground">No kanji match your filter.</p>
              <Button variant="outline" onClick={resetFilters}>
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((k) => {
              const kanjiProgress = progress[k.id];
              const hasBeenViewed = !!kanjiProgress && kanjiProgress.reviewCount > 0;
              return (
                <Link key={k.id} href={`/study/kanji/${encodeURIComponent(k.id)}`}>
                  <Card
                    className={`hover:shadow-lg hover:border-primary transition-all h-full cursor-pointer relative ${
                      hasBeenViewed ? 'ring-1 ring-emerald-500/30' : ''
                    }`}
                  >
                    {hasBeenViewed && (
                      <span
                        className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500"
                        title={`Viewed ${kanjiProgress?.reviewCount}× · last seen ${new Date(kanjiProgress?.lastSeen ?? Date.now()).toLocaleDateString()}`}
                      />
                    )}
                    <CardContent className="pt-6 text-center space-y-2">
                      <div className="text-5xl font-bold">{k.kanji}</div>
                      <div className="flex flex-wrap gap-1 justify-center min-h-[1.25rem]">
                        {k.onReadings[0] && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${READING_STYLES.on.chip}`}
                          >
                            {k.onReadings[0]}
                          </span>
                        )}
                        {k.kunReadings[0] && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${READING_STYLES.kun.chip}`}
                          >
                            {k.kunReadings[0]}
                          </span>
                        )}
                        {!k.onReadings[0] && !k.kunReadings[0] && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {k.meaning}
                      </div>
                      <div className="flex items-center justify-center text-xs text-muted-foreground pt-2 border-t">
                        <span className="flex items-center gap-1">
                          <BookOpenText className="h-3 w-3" /> {k.vocabulary.length} vocab
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground text-center">
              Source: KANJI_REFERENCE.md — compiled from 36 teacher lessons (Feb 17 – Apr 24,
              2026). No KANJIDIC2 merge.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

