'use client';

/**
 * Extended Kanji — list page
 * Route: /study/extended-kanji
 *
 * Data source: public/seed-data/extended-kanji/kanji.json (generated from
 * KANJI_REFERENCE.md). Does NOT merge with the /study/kanji dataset.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  BookOpenText,
  CalendarDays,
  Eye,
  GitCompareArrows,
  Layers,
  ListChecks,
  Quote,
  Search,
  SortAsc,
  Sparkles,
  Tags,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { CardProgress, ExtendedKanji } from '@/types/extended-kanji';
import { READING_STYLES } from '@/lib/extended-kanji/readings';

type SortOption = 'default' | 'lesson' | 'kanji' | 'vocab';

const PROGRESS_KEY = 'extended-kanji-practice-progress';

const SECTION_LINKS: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
}[] = [
  { href: '/study/extended-kanji/lessons', label: 'Lesson timeline', icon: CalendarDays, hint: '37 lessons, Feb–Apr 2026' },
  { href: '/study/extended-kanji/vocabulary', label: 'All vocabulary', icon: BookOpen, hint: '378 unique rows (PART 1 + themes)' },
  { href: '/study/extended-kanji/vocab-reveal', label: 'Vocab reveal drill', icon: Eye, hint: 'Big-type kanji → press → kana' },
  { href: '/study/extended-kanji/themes', label: 'Themed vocab', icon: Tags, hint: 'Days, family, places, counters' },
  { href: '/study/extended-kanji/sentences', label: 'All sentences', icon: Quote, hint: '173 sentences (main + review + topics)' },
  { href: '/study/extended-kanji/answer-keys', label: 'Answer keys', icon: ListChecks, hint: 'Textbook practice answers' },
  { href: '/study/extended-kanji/confusables', label: 'Study aids', icon: GitCompareArrows, hint: 'Confusables, special readings' },
  { href: '/study/extended-kanji/prerequisite', label: 'Prerequisite kanji', icon: Layers, hint: '124 kanji from earlier lessons' },
];

export default function ExtendedKanjiListPage() {
  const [kanjiList, setKanjiList] = useState<ExtendedKanji[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [lessonFilter, setLessonFilter] = useState<string>('all');
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/seed-data/extended-kanji/kanji.json');
        if (!res.ok) throw new Error('Failed to load extended-kanji dataset');
        const data = await res.json();
        setKanjiList(data.kanji as ExtendedKanji[]);
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
          k.vocabulary.some(
            (v) =>
              v.word.toLowerCase().includes(q) ||
              v.reading.toLowerCase().includes(q) ||
              v.meaning.toLowerCase().includes(q),
          ),
      );
    }
    if (lessonFilter !== 'all') {
      const n = parseInt(lessonFilter, 10);
      list = list.filter((k) => k.lessonNumber === n);
    }
    const sorted = [...list];
    switch (sortBy) {
      case 'lesson':
        sorted.sort((a, b) => (a.lessonNumber ?? 99) - (b.lessonNumber ?? 99));
        break;
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
  }, [kanjiList, search, sortBy, lessonFilter]);

  const uniqueLessons = useMemo(() => {
    const set = new Set<number>();
    kanjiList.forEach((k) => k.lessonNumber && set.add(k.lessonNumber));
    return Array.from(set).sort((a, b) => a - b);
  }, [kanjiList]);

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
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Extended Kanji</h1>
              <p className="text-muted-foreground">
                {filtered.length} of {kanjiList.length} characters from KANJI_REFERENCE.md
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/study/extended-kanji-practice">
                <Button variant="default" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Practice
                </Button>
              </Link>
              <Badge variant="secondary" className="text-lg px-4 py-2">Teacher data</Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search kanji, reading, meaning, or vocab…"
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
                <option value="default">Teacher order</option>
                <option value="lesson">Lesson number</option>
                <option value="kanji">Kanji (a→z)</option>
                <option value="vocab">Most vocab</option>
              </Select>
              <Select
                value={lessonFilter}
                onChange={(e) => setLessonFilter(e.target.value)}
                className="flex-1 sm:flex-initial sm:w-[140px] min-w-[120px]"
              >
                <option value="all">All lessons</option>
                {uniqueLessons.map((n) => (
                  <option key={n} value={n}>Lesson {n}</option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Secondary nav — tighter on mobile, full info on tablet+ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
          {SECTION_LINKS.map(({ href, label, icon: Icon, hint }) => (
            <Link key={href} href={href}>
              <Card className="hover:shadow-md hover:border-primary transition-all h-full cursor-pointer">
                <CardContent className="px-3 py-3 sm:pt-5 sm:pb-5 sm:px-6 space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold leading-tight">{label}</span>
                  </div>
                  <p className="hidden sm:block text-xs text-muted-foreground">{hint}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
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
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{uniqueLessons.length}</div>
              <p className="text-xs text-muted-foreground">Lessons</p>
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
                  setLessonFilter('all');
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
                <Link key={k.id} href={`/study/extended-kanji/${encodeURIComponent(k.id)}`}>
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
                        <span className="flex items-center gap-1">
                          <BookOpenText className="h-3 w-3" /> {k.vocabulary.length}
                        </span>
                        {k.lessonNumber ? (
                          <Badge variant="outline">L{k.lessonNumber}</Badge>
                        ) : (
                          <span className="text-[10px]">—</span>
                        )}
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
              Source: KANJI_REFERENCE.md — compiled from 36 teacher lessons (Feb 17 – Apr 24,
              2026). No KANJIDIC2 merge.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
