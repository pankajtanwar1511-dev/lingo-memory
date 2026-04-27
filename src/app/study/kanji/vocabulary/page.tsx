'use client';

/**
 * Extended Kanji — master vocabulary browser
 * Route: /study/kanji/vocabulary
 *
 * Every vocab row from every PART 1 per-kanji table + every PART 2 themed
 * table, deduplicated by (word, reading). Each row shows which kanji
 * introduced it and which themes it appears under.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { KanjiContextualSwitch } from '@/components/kanji/contextual-switch';
import { ExtendedKanji, MergedVocabRow } from '@/types/extended-kanji';
import {
  READING_STYLES,
  classifyReading,
  readingTypeStyle,
  type ReadingType,
} from '@/lib/extended-kanji/readings';
import { ColoredWord } from '@/components/extended-kanji/colored-word';
import { useAuth } from '@/contexts/auth-context';
import { load as loadSrs } from '@/services/vocab-reveal-srs.service';
import { cardKey, type SrsState, type SrsLevel } from '@/types/vocab-reveal-srs';

type LevelFilter = 'all' | 0 | 1 | 2 | 3 | 4;

/** Visual style per SRS level — red 0 → emerald 4, with a neutral "—" for
 *  cards never rated. Reused by both the mobile card and desktop table. */
const LEVEL_STYLES: Record<number, { chip: string; label: string }> = {
  0: { chip: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/40', label: 'L0' },
  1: { chip: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/40', label: 'L1' },
  2: { chip: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/40', label: 'L2' },
  3: { chip: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/40', label: 'L3' },
  4: { chip: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40', label: 'L4' },
};

function LevelChip({ level, seen }: { level: number; seen: boolean }) {
  if (!seen) {
    return (
      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium border border-border text-muted-foreground/60">
        —
      </span>
    );
  }
  const s = LEVEL_STYLES[level] ?? LEVEL_STYLES[0];
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${s.chip}`}>
      {s.label}
    </span>
  );
}

export default function ExtendedKanjiVocabularyPage() {
  const { user } = useAuth();
  const [vocab, setVocab] = useState<MergedVocabRow[]>([]);
  const [kanjiById, setKanjiById] = useState<Record<string, string>>({});
  const [kanjiByChar, setKanjiByChar] = useState<Record<string, ExtendedKanji>>({});
  const [kanjiCharSet, setKanjiCharSet] = useState<string[]>([]);
  const [srs, setSrs] = useState<SrsState>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [themeFilter, setThemeFilter] = useState<string>('all');
  const [parentFilter, setParentFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'kanji' | 'theme' | 'both'>('all');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [showAutoDiscovered, setShowAutoDiscovered] = useState(true);

  useEffect(() => {
    (async () => {
      const [vRes, kRes, srsLoaded] = await Promise.all([
        fetch('/seed-data/extended-kanji/vocabulary.json'),
        fetch('/seed-data/extended-kanji/kanji.json'),
        loadSrs(user?.uid ?? null),
      ]);
      const vData = await vRes.json();
      const kData = await kRes.json();
      setVocab(vData.vocabulary);
      const map: Record<string, string> = {};
      const byChar: Record<string, ExtendedKanji> = {};
      const chars: string[] = [];
      (kData.kanji as ExtendedKanji[]).forEach((k) => {
        map[k.kanji] = k.id;
        byChar[k.kanji] = k;
        chars.push(k.kanji);
      });
      setKanjiById(map);
      setKanjiByChar(byChar);
      setKanjiCharSet(chars);
      setSrs(srsLoaded);
      setLoading(false);
    })();
  }, [user?.uid]);

  /** Look up SRS data for one row. Returns level + whether the user has ever rated it. */
  const srsFor = (v: MergedVocabRow): { level: SrsLevel; seen: boolean } => {
    const entry = srs[cardKey(v.word, v.reading)];
    return { level: (entry?.level ?? 0) as SrsLevel, seen: !!entry && entry.reviewCount > 0 };
  };

  /** Classify the reading using the first teacher-tagged parent kanji. */
  const classifyRow = (v: MergedVocabRow): ReadingType => {
    const parent = v.parentKanji.find((p) => kanjiByChar[p]);
    if (!parent) return 'unknown';
    return classifyReading(v.reading, kanjiByChar[parent]);
  };

  /** Runtime: which of the 86 extended kanji appear in this word,
   * beyond what the teacher already tagged? */
  const autoParentsFor = (word: string, teacherParents: string[]): string[] => {
    const teacherSet = new Set(teacherParents);
    return kanjiCharSet.filter((c) => word.includes(c) && !teacherSet.has(c));
  };

  const allThemes = useMemo(() => {
    const s = new Set<string>();
    vocab.forEach((v) => v.themes.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [vocab]);

  const allParents = useMemo(() => {
    const s = new Set<string>();
    vocab.forEach((v) => v.parentKanji.forEach((p) => s.add(p)));
    return Array.from(s).sort();
  }, [vocab]);

  const filtered = useMemo(() => {
    let rows = vocab;
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (v) =>
          v.word.toLowerCase().includes(q) ||
          v.reading.toLowerCase().includes(q) ||
          v.meaning.toLowerCase().includes(q) ||
          v.parentKanji.some((p) => p.includes(q)),
      );
    }
    if (themeFilter !== 'all') rows = rows.filter((v) => v.themes.includes(themeFilter));
    // Parent filter now also matches auto-discovered parents
    if (parentFilter !== 'all') {
      rows = rows.filter(
        (v) =>
          v.parentKanji.includes(parentFilter) ||
          (showAutoDiscovered && v.word.includes(parentFilter)),
      );
    }
    if (sourceFilter === 'kanji') rows = rows.filter((v) => v.parentKanji.length > 0 && v.themes.length === 0);
    else if (sourceFilter === 'theme') rows = rows.filter((v) => v.themes.length > 0 && v.parentKanji.length === 0);
    else if (sourceFilter === 'both') rows = rows.filter((v) => v.themes.length > 0 && v.parentKanji.length > 0);
    if (levelFilter !== 'all') {
      rows = rows.filter((v) => srsFor(v).level === levelFilter);
    }
    return rows;
    // srsFor is a stable lookup over `srs` — listing srs in deps is sufficient
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocab, search, themeFilter, parentFilter, sourceFilter, showAutoDiscovered, levelFilter, srs]);

  /** Per-level breakdown across the full corpus — drives the chips shown
   *  above the table so the user has a one-glance mastery snapshot. */
  const levelCounts = useMemo(() => {
    const counts: { 0: number; 1: number; 2: number; 3: number; 4: number; unseen: number } = {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, unseen: 0,
    };
    for (const v of vocab) {
      const { level, seen } = srsFor(v);
      if (!seen) counts.unseen++;
      else (counts as any)[level]++;
    }
    return counts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocab, srs]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container max-w-5xl mx-auto px-4 py-6">
          <SubPageHeader />
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container max-w-5xl mx-auto px-4 py-6 space-y-6">
        <SubPageHeader />

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-7 w-7" />
          All vocabulary
        </h1>
        <p className="text-muted-foreground">
          {filtered.length} of {vocab.length} unique rows — merged from every per-kanji
          table and every themed master list.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search word, reading, meaning, or kanji…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Select
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value)}
          >
            <option value="all">All themes</option>
            {allThemes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Select
            value={parentFilter}
            onChange={(e) => setParentFilter(e.target.value)}
          >
            <option value="all">All kanji</option>
            {allParents.map((p) => (
              <option key={p} value={p}>Parent: {p}</option>
            ))}
          </Select>
          <Select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as typeof sourceFilter)}
          >
            <option value="all">Any source</option>
            <option value="kanji">Kanji tables only</option>
            <option value="theme">Themes only</option>
            <option value="both">In both</option>
          </Select>
        </div>

        {/* Level breakdown — click any chip to filter to that level */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground mr-1">SRS level:</span>
          <button
            type="button"
            onClick={() => setLevelFilter('all')}
            className={`px-2 py-0.5 rounded border transition-colors ${
              levelFilter === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-input hover:border-foreground/30'
            }`}
          >
            All <span className="tabular-nums opacity-70">{vocab.length}</span>
          </button>
          {([0, 1, 2, 3, 4] as const).map((n) => {
            const count = (levelCounts as any)[n] as number;
            const active = levelFilter === n;
            const s = LEVEL_STYLES[n];
            return (
              <button
                key={n}
                type="button"
                onClick={() => setLevelFilter(active ? 'all' : n)}
                disabled={count === 0}
                className={`px-2 py-0.5 rounded border font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  active ? s.chip + ' ring-2 ring-offset-1 ring-current' : s.chip
                }`}
                title={`${count} card${count === 1 ? '' : 's'} at L${n}`}
              >
                {s.label} <span className="tabular-nums opacity-80">{count}</span>
              </button>
            );
          })}
          <span
            className="px-2 py-0.5 rounded border border-border text-muted-foreground/70"
            title="Cards never rated yet"
          >
            Unseen <span className="tabular-nums">{levelCounts.unseen}</span>
          </span>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showAutoDiscovered}
          onChange={(e) => setShowAutoDiscovered(e.target.checked)}
          className="w-4 h-4"
        />
        Also show auto-discovered parents (runtime substring match across the{' '}
        {kanjiCharSet.length} kanji)
      </label>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Badge className="text-xs">大</Badge> Teacher-tagged
        </span>
        <span className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-xs border-dashed">大</Badge>
          Auto-discovered (substring match)
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`inline-block px-2 py-0.5 rounded ${READING_STYLES.on.chip}`}>
            {READING_STYLES.on.label}
          </span>
          on-yomi usage
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`inline-block px-2 py-0.5 rounded ${READING_STYLES.kun.chip}`}>
            {READING_STYLES.kun.label}
          </span>
          kun-yomi usage
        </span>
      </div>

      {/* MOBILE: stacked card per row — full info, no horizontal scroll. */}
      <div className="md:hidden space-y-3">
        {filtered.map((v, i) => {
          const type = classifyRow(v);
          const style = readingTypeStyle(type);
          const autoParents = showAutoDiscovered
            ? autoParentsFor(v.word, v.parentKanji)
            : [];
          return (
            <Card
              key={`m-${v.word}-${v.reading}-${i}`}
              className={style ? `border-l-4 ${style.border}` : ''}
            >
              <CardContent className="px-4 py-3 space-y-2">
                {/* Word + level + usage pill on the same row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="text-2xl font-medium leading-tight">
                    <ColoredWord
                      word={v.word}
                      reading={v.reading}
                      kanjiByChar={kanjiByChar}
                    />
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <LevelChip level={srsFor(v).level} seen={srsFor(v).seen} />
                    {type === 'on' || type === 'kun' ? (
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${READING_STYLES[type].chip}`}>
                        {READING_STYLES[type].label}
                      </span>
                    ) : type === 'mixed' ? (
                      <span className="inline-flex gap-1 text-[10px]">
                        <span className={`px-1.5 py-0.5 rounded ${READING_STYLES.on.chip}`}>音</span>
                        <span className={`px-1.5 py-0.5 rounded ${READING_STYLES.kun.chip}`}>訓</span>
                      </span>
                    ) : null}
                  </div>
                </div>
                {/* Reading */}
                <div
                  className={`text-base ${
                    style ? style.text : 'text-muted-foreground'
                  }`}
                >
                  {v.reading}
                </div>
                {/* Meaning */}
                <div className="text-sm">{v.meaning}</div>
                {/* Parent kanji + themes */}
                {(v.parentKanji.length > 0 || autoParents.length > 0 || v.themes.length > 0) && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {v.parentKanji.map((p) => {
                      const id = kanjiById[p];
                      return id ? (
                        <Link key={p} href={`/study/kanji/${encodeURIComponent(id)}`}>
                          <Badge className="text-base cursor-pointer">{p}</Badge>
                        </Link>
                      ) : (
                        <Badge key={p} className="text-base">{p}</Badge>
                      );
                    })}
                    {autoParents.map((p) => {
                      const id = kanjiById[p];
                      return id ? (
                        <Link
                          key={`auto-${p}`}
                          href={`/study/kanji/${encodeURIComponent(id)}`}
                          title={`Auto-discovered: ${p} appears in ${v.word}`}
                        >
                          <Badge variant="outline" className="text-base cursor-pointer border-dashed">
                            {p}
                          </Badge>
                        </Link>
                      ) : null;
                    })}
                    {v.themes.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No matching vocabulary. Try clearing filters.
            </CardContent>
          </Card>
        )}
      </div>

      {/* TABLET / DESKTOP: full table layout. */}
      <Card className="hidden md:block">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Word</th>
                  <th className="text-left py-2 font-medium">Reading</th>
                  <th className="text-left py-2 font-medium">Level</th>
                  <th className="text-left py-2 font-medium">Usage</th>
                  <th className="text-left py-2 font-medium">Meaning</th>
                  <th className="text-left py-2 font-medium">Parent kanji</th>
                  <th className="text-left py-2 font-medium">Themes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => {
                  const type = classifyRow(v);
                  const style = readingTypeStyle(type);
                  return (
                  <tr
                    key={`${v.word}-${v.reading}-${i}`}
                    className={`border-b last:border-0 ${
                      style ? `border-l-4 ${style.border}` : ''
                    }`}
                  >
                    <td className="py-3 pl-2 text-lg font-medium">
                      <ColoredWord
                        word={v.word}
                        reading={v.reading}
                        kanjiByChar={kanjiByChar}
                      />
                    </td>
                    <td
                      className={`py-3 whitespace-nowrap ${
                        style ? style.text : 'text-muted-foreground'
                      }`}
                    >
                      {v.reading}
                    </td>
                    <td className="py-3">
                      <LevelChip level={srsFor(v).level} seen={srsFor(v).seen} />
                    </td>
                    <td className="py-3">
                      {type === 'on' || type === 'kun' ? (
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${READING_STYLES[type].chip}`}>
                          {READING_STYLES[type].label}
                        </span>
                      ) : type === 'mixed' ? (
                        <span className="inline-flex gap-1 text-xs">
                          <span className={`px-1.5 py-0.5 rounded ${READING_STYLES.on.chip}`}>音</span>
                          <span className={`px-1.5 py-0.5 rounded ${READING_STYLES.kun.chip}`}>訓</span>
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3">{v.meaning}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {v.parentKanji.map((p) => {
                          const id = kanjiById[p];
                          return id ? (
                            <Link key={p} href={`/study/kanji/${encodeURIComponent(id)}`}>
                              <Badge className="text-base cursor-pointer">
                                {p}
                              </Badge>
                            </Link>
                          ) : (
                            <Badge key={p} className="text-base">
                              {p}
                            </Badge>
                          );
                        })}
                        {showAutoDiscovered &&
                          autoParentsFor(v.word, v.parentKanji).map((p) => {
                            const id = kanjiById[p];
                            return id ? (
                              <Link
                                key={`auto-${p}`}
                                href={`/study/kanji/${encodeURIComponent(id)}`}
                                title={`Auto-discovered: ${p} appears in ${v.word}`}
                              >
                                <Badge
                                  variant="outline"
                                  className="text-base cursor-pointer hover:bg-accent border-dashed"
                                >
                                  {p}
                                </Badge>
                              </Link>
                            ) : null;
                          })}
                        {v.parentKanji.length === 0 &&
                          autoParentsFor(v.word, v.parentKanji).length === 0 && (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {v.themes.map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs">
                            {t}
                          </Badge>
                        ))}
                        {v.themes.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </td>
                  </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No matching vocabulary. Try clearing filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  );
}

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
