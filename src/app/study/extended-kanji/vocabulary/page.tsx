'use client';

/**
 * Extended Kanji — master vocabulary browser
 * Route: /study/extended-kanji/vocabulary
 *
 * Every vocab row from every PART 1 per-kanji table + every PART 2 themed
 * table, deduplicated by (word, reading). Each row shows which kanji
 * introduced it and which themes it appears under.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ExtendedKanji, MergedVocabRow } from '@/types/extended-kanji';
import {
  READING_STYLES,
  classifyReading,
  readingTypeStyle,
  type ReadingType,
} from '@/lib/extended-kanji/readings';
import { ColoredWord } from '@/components/extended-kanji/colored-word';

export default function ExtendedKanjiVocabularyPage() {
  const [vocab, setVocab] = useState<MergedVocabRow[]>([]);
  const [kanjiById, setKanjiById] = useState<Record<string, string>>({});
  const [kanjiByChar, setKanjiByChar] = useState<Record<string, ExtendedKanji>>({});
  const [kanjiCharSet, setKanjiCharSet] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [themeFilter, setThemeFilter] = useState<string>('all');
  const [parentFilter, setParentFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'kanji' | 'theme' | 'both'>('all');
  const [showAutoDiscovered, setShowAutoDiscovered] = useState(true);

  useEffect(() => {
    (async () => {
      const [vRes, kRes] = await Promise.all([
        fetch('/seed-data/extended-kanji/vocabulary.json'),
        fetch('/seed-data/extended-kanji/kanji.json'),
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
      setLoading(false);
    })();
  }, []);

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
    return rows;
  }, [vocab, search, themeFilter, parentFilter, sourceFilter, showAutoDiscovered]);

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/study/extended-kanji">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/study/extended-kanji/vocab-reveal">
            <Button variant="default" className="gap-2">
              <Eye className="h-4 w-4" />
              Reveal drill
            </Button>
          </Link>
          <Badge variant="secondary">Master vocabulary</Badge>
        </div>
      </div>

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
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showAutoDiscovered}
          onChange={(e) => setShowAutoDiscovered(e.target.checked)}
          className="w-4 h-4"
        />
        Also show auto-discovered parents (runtime substring match across the{' '}
        {kanjiCharSet.length} extended kanji)
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
                {/* Word + usage pill on the same row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="text-2xl font-medium leading-tight">
                    <ColoredWord
                      word={v.word}
                      reading={v.reading}
                      kanjiByChar={kanjiByChar}
                    />
                  </div>
                  {type === 'on' || type === 'kun' ? (
                    <span className={`shrink-0 inline-block px-2 py-0.5 rounded text-[10px] font-medium ${READING_STYLES[type].chip}`}>
                      {READING_STYLES[type].label}
                    </span>
                  ) : type === 'mixed' ? (
                    <span className="shrink-0 inline-flex gap-1 text-[10px]">
                      <span className={`px-1.5 py-0.5 rounded ${READING_STYLES.on.chip}`}>音</span>
                      <span className={`px-1.5 py-0.5 rounded ${READING_STYLES.kun.chip}`}>訓</span>
                    </span>
                  ) : null}
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
                        <Link key={p} href={`/study/extended-kanji/${encodeURIComponent(id)}`}>
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
                          href={`/study/extended-kanji/${encodeURIComponent(id)}`}
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
                            <Link key={p} href={`/study/extended-kanji/${encodeURIComponent(id)}`}>
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
                                href={`/study/extended-kanji/${encodeURIComponent(id)}`}
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
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
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
  );
}
