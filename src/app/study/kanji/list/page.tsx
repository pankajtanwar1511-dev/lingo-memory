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
import { ArrowLeft, BookOpenText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { CardProgress, ExtendedKanji } from '@/types/extended-kanji';
import { READING_STYLES } from '@/lib/extended-kanji/readings';
import { useAuth } from '@/contexts/auth-context';
import { loadProgress } from '@/services/cloud-progress.service';
import { useKanjiDataset } from '@/hooks/use-kanji-dataset';
import {
  useKanjiListFilters,
  type ListSortOption,
  type ListStatusFilter,
} from '@/hooks/use-kanji-list-filters';
import { KanjiContextualSwitch } from '@/components/kanji/contextual-switch';

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
  const {
    search,
    setSearch,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    isAnyActive,
    reset: resetFilters,
  } = useKanjiListFilters();

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


  if (loading) {
    return (
      <>
        <Header />
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <SubPageHeader />
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container max-w-3xl mx-auto px-4 py-6">
          <SubPageHeader />
          <Card className="mt-4">
            <CardContent className="pt-6 text-center text-destructive">{error}</CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        <SubPageHeader />

        {/* Inline filters — listing view controls live with the listing,
            not in the global Kanji settings dialog. */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search kanji, reading, meaning, vocab…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ListSortOption)}
            className="h-9 w-auto"
          >
            <option value="default">Teacher order</option>
            <option value="kanji">Kanji (a→z)</option>
            <option value="vocab">Most vocab</option>
          </Select>
          <div className="flex items-center gap-1">
            {(['all', 'untouched', 'viewed'] as ListStatusFilter[]).map((id) => (
              <Button
                key={id}
                size="sm"
                variant={statusFilter === id ? 'default' : 'outline'}
                onClick={() => setStatusFilter(id)}
                className="h-9 text-xs"
              >
                {id === 'all' ? 'All' : id === 'untouched' ? 'Not viewed' : 'Viewed'}
              </Button>
            ))}
          </div>
          {isAnyActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 text-xs text-muted-foreground"
            >
              Reset · {filtered.length}/{kanjiList.length}
            </Button>
          )}
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

      </div>
    </>
  );
}

/** Reusable sub-page header bar — Hub link, contextual switch, gear. */
function SubPageHeader() {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <Link href="/study/kanji">
        <Button variant="ghost" size="sm" className="gap-1 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Hub
        </Button>
      </Link>
      <div className="flex items-center gap-2">
        <KanjiContextualSwitch />
      </div>
    </div>
  );
}

