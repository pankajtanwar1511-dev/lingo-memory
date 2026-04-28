'use client';

/**
 * Kanji — prerequisite kanji card grid.
 * Route: /study/kanji/prerequisite
 *
 * Mirrors the main 86-kanji card grid but for the 117 prerequisite kanji
 * from PART 6 of KANJI_REFERENCE_v2.md. Vocab and sentence links are
 * derived only from the existing kanji.json/sentences.json corpus.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpenText,
  Layers,
  Search,
  SortAsc,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { CardProgress, ExtendedKanji } from '@/types/extended-kanji';
import { READING_STYLES } from '@/lib/extended-kanji/readings';

type CuratedVocab = { word: string; reading: string; meaning: string };
type PrereqKanji = ExtendedKanji & {
  commonUsesSeen?: string;
  commonVocabulary?: CuratedVocab[];
};
type SortOption = 'default' | 'kanji' | 'vocab';

const PROGRESS_KEY = 'extended-kanji-prereq-progress';

export default function ExtendedKanjiPrerequisitePage() {
  const [kanjiList, setKanjiList] = useState<PrereqKanji[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [hasVocabOnly, setHasVocabOnly] = useState(false);
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/seed-data/extended-kanji/prerequisite-detailed.json');
        if (!res.ok) throw new Error('Failed to load prerequisite dataset');
        const data = await res.json();
        setKanjiList(data.kanji as PrereqKanji[]);
        const saved = localStorage.getItem(PROGRESS_KEY);
        if (saved) setProgress(JSON.parse(saved));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
          (k.commonUsesSeen ?? '').toLowerCase().includes(q) ||
          k.vocabulary.some(
            (v) =>
              v.word.toLowerCase().includes(q) ||
              v.reading.toLowerCase().includes(q) ||
              v.meaning.toLowerCase().includes(q),
          ),
      );
    }
    if (hasVocabOnly) list = list.filter((k) => k.vocabulary.length > 0);
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
  }, [kanjiList, search, sortBy, hasVocabOnly]);

  const totalVocab = kanjiList.reduce((sum, k) => sum + k.vocabulary.length, 0);
  const totalSentences = kanjiList.reduce((sum, k) => sum + k.exampleSentences.length, 0);
  const withVocab = kanjiList.filter((k) => k.vocabulary.length > 0).length;

  if (loading) {
    return (
      <>
        <Header />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
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
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center text-destructive">{error}</CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/study/kanji">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Kanji hub
            </Button>
          </Link>
          <Badge variant="secondary">PART 6 · 117 kanji</Badge>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Layers className="h-7 w-7" />
                Prerequisite Kanji
              </h1>
              <p className="text-muted-foreground">
                {filtered.length} of {kanjiList.length} characters — taught in earlier
                classes, reused throughout the 36 lessons.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search kanji, reading, meaning, vocab, or compound…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SortAsc className="hidden sm:block h-4 w-4 text-muted-foreground shrink-0" />
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="flex-1 sm:flex-initial sm:w-[170px] min-w-[140px]"
              >
                <option value="default">Reference order</option>
                <option value="kanji">Kanji (a→z)</option>
                <option value="vocab">Most vocab</option>
              </Select>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasVocabOnly}
                  onChange={(e) => setHasVocabOnly(e.target.checked)}
                  className="rounded border-input"
                />
                With linked vocab
              </label>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{kanjiList.length}</div>
              <p className="text-xs text-muted-foreground">Prerequisite kanji</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{withVocab}</div>
              <p className="text-xs text-muted-foreground">With linked vocab</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{totalVocab}</div>
              <p className="text-xs text-muted-foreground">Vocab links</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{totalSentences}</div>
              <p className="text-xs text-muted-foreground">Sentence links</p>
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
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setHasVocabOnly(false);
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((k) => {
              const kanjiProgress = progress[k.id];
              const hasBeenRated = kanjiProgress && kanjiProgress.reviewCount > 0;
              const currentLevel = kanjiProgress?.level ?? 0;
              return (
                <Link
                  key={k.id}
                  href={`/study/kanji/prerequisite/${encodeURIComponent(k.id)}`}
                >
                  <Card className="hover:shadow-lg hover:border-primary transition-all h-full cursor-pointer">
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
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span className="flex items-center gap-1" title="Curated common vocabulary">
                          <BookOpenText className="h-3 w-3" />
                          {k.commonVocabulary?.length ?? 0}
                        </span>
                        <span className="text-[10px]" title="Linked vocab + sentences from main corpus">
                          {k.vocabulary.length}v · {k.exampleSentences.length}s
                        </span>
                      </div>
                      <div className="flex gap-1 justify-center">
                        {[0, 1, 2, 3, 5].map((level, index) => {
                          const isAchieved =
                            hasBeenRated &&
                            index < (currentLevel === 5 ? 5 : currentLevel + 1);
                          return (
                            <div
                              key={level}
                              className={`w-1.5 h-1.5 rounded-full ${
                                isAchieved ? 'bg-green-500' : 'bg-muted'
                              }`}
                            />
                          );
                        })}
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
              Source: PART 6 of KANJI_REFERENCE_v2.md. Vocabulary and example sentences
              are linked from the existing main-kanji corpus only — no invented data.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
