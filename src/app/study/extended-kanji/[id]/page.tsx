'use client';

/**
 * Extended Kanji — detail page
 * Route: /study/extended-kanji/[id]
 *
 * Renders every field from KANJI_REFERENCE.md for one kanji:
 *   teacher readings, vocabulary table, example sentences, lesson context,
 *   bundled-with cross-links, and all extraSections (counting yen, March dates,
 *   day-of-week tables, verb conjugations, review practice, etc.).
 */

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Info,
  Languages,
  Link2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StrokeOrderAnimation } from '@/components/kanji/StrokeOrderAnimation';
import {
  ExtendedKanji,
  ExtendedKanjiSentence,
  ExtraSection,
  MergedVocabRow,
  TopicSentenceGroup,
} from '@/types/extended-kanji';
import {
  READING_STYLES,
  classifyReading,
  readingTypeStyle,
  type ReadingType,
} from '@/lib/extended-kanji/readings';
import { ColoredWord } from '@/components/extended-kanji/colored-word';
import { InteractiveSentence } from '@/components/extended-kanji/interactive-sentence';

/** A unified sentence row used for runtime cross-refs. */
interface AnySentence {
  japanese: string;
  english: string;
  origin: 'part1' | 'part1_extras' | 'part3';
  parentKanji?: string;
  sectionTitle?: string;
  topic?: string;
}

export default function ExtendedKanjiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const kanjiId = decodeURIComponent(params.id as string);

  const [kanji, setKanji] = useState<ExtendedKanji | null>(null);
  const [allKanji, setAllKanji] = useState<ExtendedKanji[]>([]);
  const [allVocab, setAllVocab] = useState<MergedVocabRow[]>([]);
  const [allSentences, setAllSentences] = useState<AnySentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [kRes, vRes, sRes] = await Promise.all([
          fetch('/seed-data/extended-kanji/kanji.json'),
          fetch('/seed-data/extended-kanji/vocabulary.json'),
          fetch('/seed-data/extended-kanji/sentences.json'),
        ]);
        if (!kRes.ok) throw new Error('Failed to load dataset');
        const kData = await kRes.json();
        const vData = await vRes.json();
        const sData = await sRes.json();
        const all = kData.kanji as ExtendedKanji[];
        setAllKanji(all);
        setAllVocab(vData.vocabulary as MergedVocabRow[]);

        // Flatten all sentence sources into one list so cross-ref is uniform.
        const unified: AnySentence[] = [];
        (sData.part1 as ExtendedKanjiSentence[]).forEach((s) =>
          unified.push({
            japanese: s.japanese,
            english: s.english,
            origin: 'part1',
            parentKanji: s.parentKanji,
          }),
        );
        (sData.part1Extras as ExtendedKanjiSentence[]).forEach((s) =>
          unified.push({
            japanese: s.japanese,
            english: s.english,
            origin: 'part1_extras',
            parentKanji: s.parentKanji,
            sectionTitle: s.sectionTitle,
          }),
        );
        (sData.part3 as TopicSentenceGroup[]).forEach((g) =>
          g.sentences.forEach((jp) =>
            unified.push({ japanese: jp, english: '', origin: 'part3', topic: g.topic }),
          ),
        );
        setAllSentences(unified);

        const found = all.find((k) => k.id === kanjiId);
        if (!found) throw new Error(`Kanji ${kanjiId} not found`);
        setKanji(found);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [kanjiId]);

  /** Runtime cross-reference: every vocab row (from all 378) whose `word`
   * contains this kanji character. Split into rows already listed in the
   * teacher's per-kanji table vs auto-discovered from elsewhere. */
  const crossRefs = useMemo(() => {
    if (!kanji) return { inTeacherTable: [], autoDiscovered: [] as MergedVocabRow[] };
    const teacherKeys = new Set(
      kanji.vocabulary.map((v) => `${v.word}|${v.reading}`),
    );
    const hits = allVocab.filter((v) => v.word.includes(kanji.kanji));
    const inTable: MergedVocabRow[] = [];
    const auto: MergedVocabRow[] = [];
    for (const v of hits) {
      if (teacherKeys.has(`${v.word}|${v.reading}`)) inTable.push(v);
      else auto.push(v);
    }
    return { inTeacherTable: inTable, autoDiscovered: auto };
  }, [kanji, allVocab]);

  /** Map kanji char → id for cross-linking to other kanji detail pages. */
  const kanjiIdByChar = useMemo(() => {
    const m: Record<string, string> = {};
    allKanji.forEach((k) => (m[k.kanji] = k.id));
    return m;
  }, [allKanji]);

  /** Map kanji char → full entry, used by <ColoredWord> to classify per char. */
  const kanjiByChar = useMemo(() => {
    const m: Record<string, ExtendedKanji> = {};
    allKanji.forEach((k) => (m[k.kanji] = k));
    return m;
  }, [allKanji]);

  /** Runtime cross-reference: every sentence containing this kanji character,
   * grouped into teacher's examples vs everything else (extras, topics, other
   * kanji's examples). */
  const sentenceCrossRefs = useMemo(() => {
    if (!kanji) return { inTeacherExamples: 0, autoDiscovered: [] as AnySentence[] };
    const teacherSet = new Set(kanji.exampleSentences.map((s) => s.japanese));
    const hits = allSentences.filter((s) => s.japanese.includes(kanji.kanji));
    const auto: AnySentence[] = [];
    let inTable = 0;
    for (const s of hits) {
      if (
        teacherSet.has(s.japanese) &&
        s.origin === 'part1' &&
        s.parentKanji === kanji.kanji
      ) {
        inTable++;
      } else {
        auto.push(s);
      }
    }
    return { inTeacherExamples: inTable, autoDiscovered: auto };
  }, [kanji, allSentences]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !kanji) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-destructive">{error || 'Kanji not found'}</p>
            <Button onClick={() => router.back()}>Go back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bundled =
    kanji.bundledWith?.map((c) => allKanji.find((k) => k.kanji === c)).filter(Boolean) ?? [];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {kanji.lessonNumber && (
          <Link href={`/study/extended-kanji/lessons/lesson_${kanji.lessonNumber}`}>
            <Badge variant="secondary" className="cursor-pointer">
              Lesson {kanji.lessonNumber} · {kanji.lessonDate}
            </Badge>
          </Link>
        )}
      </div>

      {/* Main */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-9xl font-bold">{kanji.kanji}</div>
            <h2 className="text-2xl font-semibold">{kanji.meaning}</h2>
            {kanji.bundledWith && kanji.bundledWith.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Taught alongside{' '}
                {bundled.map((b, i) => (
                  <span key={b!.id}>
                    <Link
                      href={`/study/extended-kanji/${encodeURIComponent(b!.id)}`}
                      className="underline hover:text-primary"
                    >
                      {b!.kanji}
                    </Link>
                    {i < bundled.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Readings */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className={`${READING_STYLES.on.bg} ${READING_STYLES.on.border}`}>
          <CardHeader>
            <CardTitle className="text-lg">
              音読み <span className="text-sm font-normal text-muted-foreground">({READING_STYLES.on.label})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kanji.onReadings.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {kanji.onReadings.map((r, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1.5 rounded text-2xl font-medium bg-white dark:bg-blue-950/40 ${READING_STYLES.on.text} border ${READING_STYLES.on.border}`}
                  >
                    {r}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-xl">—</p>
            )}
          </CardContent>
        </Card>

        <Card className={`${READING_STYLES.kun.bg} ${READING_STYLES.kun.border}`}>
          <CardHeader>
            <CardTitle className="text-lg">
              訓読み <span className="text-sm font-normal text-muted-foreground">({READING_STYLES.kun.label})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kanji.kunReadings.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {kanji.kunReadings.map((r, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1.5 rounded text-2xl font-medium bg-white dark:bg-green-950/40 ${READING_STYLES.kun.text} border ${READING_STYLES.kun.border}`}
                  >
                    {r}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-xl">—</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stroke order animation — SVG path derived from the hex codepoint */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Stroke order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StrokeOrderAnimation
            kanji={kanji.kanji}
            strokes={{
              svgPath: `/kanji/strokes/${kanji.kanji
                .codePointAt(0)!
                .toString(16)
                .padStart(5, '0')}.svg`,
              count: 0,
            }}
            autoPlay={false}
            showStrokeNumbers={true}
            loop={false}
          />
        </CardContent>
      </Card>

      {/* Lesson context banner */}
      {kanji.lessonNumber !== null && (
        <Card className="bg-indigo-50 dark:bg-indigo-950/10 border-indigo-200 dark:border-indigo-900/30">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="font-medium">
                    Taught on {kanji.lessonDate} (Lesson {kanji.lessonNumber})
                  </p>
                  {kanji.lessonSource && (
                    <p className="text-xs text-muted-foreground">Source: {kanji.lessonSource}</p>
                  )}
                </div>
              </div>
              {kanji.textbookPage && (
                <Badge variant="outline">p.{kanji.textbookPage}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vocabulary */}
      {kanji.vocabulary.length > 0 && (
        <Card className="bg-amber-50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Vocabulary ({kanji.vocabulary.length})
            </CardTitle>
            <ReadingLegend />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-amber-200 dark:border-amber-900/50">
                    <th className="text-left py-2 font-medium">Word</th>
                    <th className="text-left py-2 font-medium">Reading</th>
                    <th className="text-left py-2 font-medium">Meaning</th>
                    <th className="text-left py-2 font-medium">Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {kanji.vocabulary.map((v, i) => {
                    const type = classifyReading(v.reading, kanji);
                    const style = readingTypeStyle(type);
                    return (
                      <tr
                        key={i}
                        className={`border-b border-amber-100 dark:border-amber-900/30 ${
                          style ? `border-l-4 ${style.border}` : ''
                        }`}
                      >
                        <td className="py-2 pl-2 text-lg font-medium">
                          <ColoredWord
                            word={v.word}
                            reading={v.reading}
                            kanjiByChar={kanjiByChar}
                            highlightChar={kanji.kanji}
                          />
                        </td>
                        <td
                          className={`py-2 whitespace-nowrap ${
                            style ? style.text : 'text-muted-foreground'
                          }`}
                        >
                          {v.reading}
                        </td>
                        <td className="py-2">{v.meaning}</td>
                        <td className="py-2">
                          <ReadingTypePill type={type} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Runtime cross-reference: every vocab row containing this kanji */}
      {crossRefs.autoDiscovered.length > 0 && (
        <Card className="bg-teal-50 dark:bg-teal-950/10 border-teal-200 dark:border-teal-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Also used in ({crossRefs.autoDiscovered.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Runtime match across all {allVocab.length} vocab rows — words containing{' '}
              <span className="text-lg font-bold">{kanji.kanji}</span> that aren't in
              this kanji's own teacher table.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-teal-200 dark:border-teal-900/50">
                    <th className="text-left py-2 font-medium">Word</th>
                    <th className="text-left py-2 font-medium">Reading</th>
                    <th className="text-left py-2 font-medium">Meaning</th>
                    <th className="text-left py-2 font-medium">Usage</th>
                    <th className="text-left py-2 font-medium">Listed under</th>
                    <th className="text-left py-2 font-medium">Themes</th>
                  </tr>
                </thead>
                <tbody>
                  {crossRefs.autoDiscovered.map((v, i) => {
                    const type = classifyReading(v.reading, kanji);
                    const style = readingTypeStyle(type);
                    return (
                      <tr
                        key={`${v.word}-${v.reading}-${i}`}
                        className={`border-b border-teal-100 dark:border-teal-900/30 ${
                          style ? `border-l-4 ${style.border}` : ''
                        }`}
                      >
                        <td className="py-2 pl-2 text-lg font-medium">
                          <ColoredWord
                            word={v.word}
                            reading={v.reading}
                            kanjiByChar={kanjiByChar}
                            highlightChar={kanji.kanji}
                          />
                        </td>
                        <td
                          className={`py-2 whitespace-nowrap ${
                            style ? style.text : 'text-muted-foreground'
                          }`}
                        >
                          {v.reading}
                        </td>
                        <td className="py-2">{v.meaning}</td>
                        <td className="py-2">
                          <ReadingTypePill type={type} />
                        </td>
                        <td className="py-2">
                          <div className="flex flex-wrap gap-1">
                            {v.parentKanji.length === 0 ? (
                              <span className="text-xs text-muted-foreground">theme-only</span>
                            ) : (
                              v.parentKanji.map((p) => {
                                const id = kanjiIdByChar[p];
                                return id && p !== kanji.kanji ? (
                                  <Link
                                    key={p}
                                    href={`/study/extended-kanji/${encodeURIComponent(id)}`}
                                  >
                                    <Badge
                                      variant="outline"
                                      className="cursor-pointer hover:bg-accent"
                                    >
                                      {p}
                                    </Badge>
                                  </Link>
                                ) : (
                                  <Badge key={p} variant="outline">
                                    {p}
                                  </Badge>
                                );
                              })
                            )}
                          </div>
                        </td>
                        <td className="py-2">
                          <div className="flex flex-wrap gap-1">
                            {v.themes.length === 0 ? (
                              <span className="text-xs text-muted-foreground">—</span>
                            ) : (
                              v.themes.map((t) => (
                                <Badge key={t} variant="secondary" className="text-xs">
                                  {t}
                                </Badge>
                              ))
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Teacher's own table already includes {crossRefs.inTeacherTable.length}{' '}
              of the {crossRefs.inTeacherTable.length + crossRefs.autoDiscovered.length}{' '}
              total matches.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Example sentences */}
      {kanji.exampleSentences.length > 0 && (
        <Card className="bg-purple-50 dark:bg-purple-950/10 border-purple-200 dark:border-purple-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Example sentences ({kanji.exampleSentences.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {kanji.exampleSentences.map((s, i) => (
                <InteractiveSentence
                  key={i}
                  japanese={s.japanese}
                  english={s.english}
                  kanjiByChar={kanjiByChar}
                  highlightChar={kanji.kanji}
                  className="border-purple-200 dark:border-purple-900/50"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Runtime cross-ref: every sentence containing this kanji */}
      {sentenceCrossRefs.autoDiscovered.length > 0 && (
        <Card className="bg-sky-50 dark:bg-sky-950/10 border-sky-200 dark:border-sky-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Also appears in sentences ({sentenceCrossRefs.autoDiscovered.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Runtime match across all {allSentences.length} sentences in the reference —
              occurrences of <span className="text-lg font-bold">{kanji.kanji}</span>{' '}
              beyond this kanji's own {sentenceCrossRefs.inTeacherExamples} teacher example
              {sentenceCrossRefs.inTeacherExamples === 1 ? '' : 's'}.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sentenceCrossRefs.autoDiscovered.map((s, i) => (
                <InteractiveSentence
                  key={`${s.origin}-${i}`}
                  japanese={s.japanese}
                  english={s.english}
                  kanjiByChar={kanjiByChar}
                  highlightChar={kanji.kanji}
                  className="border-sky-200 dark:border-sky-900/50"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extra sections — counting yen, March dates, etc. */}
      {kanji.extraSections.length > 0 && (
        <div className="space-y-4">
          {kanji.extraSections.map((section, idx) => (
            <Card key={idx} className="bg-slate-50 dark:bg-slate-900/40">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExtraSectionBody section={section} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer */}
      <Card>
        <CardContent className="pt-6 text-xs text-muted-foreground space-y-1">
          <p>
            <Info className="inline h-3 w-3 mr-1" />
            Data from teacher's KANJI_REFERENCE.md (not KANJIDIC2).
          </p>
          <p>
            <Languages className="inline h-3 w-3 mr-1" />
            Reading notation preserved as written in the reference
            (e.g. "おお (きい)" → stem + ending).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ExtraSectionBody({ section }: { section: ExtraSection }) {
  if (section.type === 'table') {
    return <TableBlock headers={section.headers} rows={section.rows} />;
  }
  if (section.type === 'bullets') {
    return <BulletsBlock items={section.items} />;
  }
  if (section.type === 'prose') {
    return <p className="text-sm">{section.text}</p>;
  }
  return (
    <div className="space-y-3">
      {section.blocks.map((b, i) => {
        if (b.type === 'table') return <TableBlock key={i} headers={b.headers} rows={b.rows} />;
        if (b.type === 'bullets') return <BulletsBlock key={i} items={b.items} />;
        return (
          <p key={i} className="text-sm">
            {b.text}
          </p>
        );
      })}
    </div>
  );
}

function TableBlock({
  headers,
  rows,
}: {
  headers: string[];
  rows: Record<string, string>[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {headers.map((h) => (
              <th key={h} className="text-left py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b last:border-0">
              {headers.map((h) => (
                <td key={h} className="py-2">
                  {r[h] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReadingTypePill({ type }: { type: ReadingType }) {
  if (type === 'on' || type === 'kun') {
    const style = READING_STYLES[type];
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${style.chip}`}>
        {style.label}
      </span>
    );
  }
  if (type === 'mixed') {
    return (
      <span className="inline-flex gap-1 text-xs">
        <span className={`px-1.5 py-0.5 rounded ${READING_STYLES.on.chip}`}>音</span>
        <span className={`px-1.5 py-0.5 rounded ${READING_STYLES.kun.chip}`}>訓</span>
      </span>
    );
  }
  return <span className="text-xs text-muted-foreground">—</span>;
}

function ReadingLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className={`inline-block px-2 py-0.5 rounded ${READING_STYLES.on.chip}`}>
          {READING_STYLES.on.label}
        </span>
        <span className={`${READING_STYLES.on.text} font-semibold`}>大</span>
        on'yomi reading
      </span>
      <span className="flex items-center gap-1.5">
        <span className={`inline-block px-2 py-0.5 rounded ${READING_STYLES.kun.chip}`}>
          {READING_STYLES.kun.label}
        </span>
        <span className={`${READING_STYLES.kun.text} font-semibold`}>大</span>
        kun'yomi reading
      </span>
      <span className="flex items-center gap-1.5">
        <span>好</span>
        not in the 86 taught kanji
      </span>
    </div>
  );
}

function sentenceOriginLabel(origin: AnySentence['origin']): string {
  if (origin === 'part1') return 'Main example';
  if (origin === 'part1_extras') return 'Review / warm-up';
  return 'Topic sentence';
}

/** Bold-highlight every occurrence of `char` inside `word`. */
function highlightChar(word: string, char: string): React.ReactNode {
  if (!char || !word.includes(char)) return word;
  const parts = word.split(char);
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && (
        <span className="text-teal-700 dark:text-teal-400 font-bold">{char}</span>
      )}
    </span>
  ));
}

function BulletsBlock({ items }: { items: { text: string; gloss: string }[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
          <span className="text-base font-medium">{it.text}</span>
          {it.gloss && <span className="text-sm text-muted-foreground italic">— {it.gloss}</span>}
        </li>
      ))}
    </ul>
  );
}
