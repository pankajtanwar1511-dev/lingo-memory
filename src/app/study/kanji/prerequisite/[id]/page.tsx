'use client';

/**
 * Kanji — prerequisite kanji detail page
 * Route: /study/kanji/prerequisite/[id]
 *
 * Mirrors the main /study/kanji/[id] detail layout but for the 117
 * prerequisite kanji. Vocabulary and sentences are pre-scoped in the dataset
 * (linked only from the existing main-kanji corpus), so no runtime cross-ref
 * is needed. Adds a "Common uses seen" card showing the teacher's compound
 * list as a fallback for kanji with no linked vocab.
 */

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Info,
  Languages,
  Layers,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StrokeOrderAnimation } from '@/components/kanji/StrokeOrderAnimation';
import { ExtendedKanji } from '@/types/extended-kanji';
import { READING_STYLES } from '@/lib/extended-kanji/readings';
import { ColoredWord } from '@/components/extended-kanji/colored-word';
import { InteractiveSentence } from '@/components/extended-kanji/interactive-sentence';

type CuratedVocab = {
  word: string;
  reading: string;
  meaning: string;
};

type PrereqKanji = ExtendedKanji & {
  commonUsesSeen?: string;
  teacherPrimaryReading?: string[];
  strokeCount?: number | null;
  jlpt?: number | null;
  commonVocabulary?: CuratedVocab[];
};

export default function PrerequisiteKanjiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const kanjiId = decodeURIComponent(params.id as string);

  const [kanji, setKanji] = useState<PrereqKanji | null>(null);
  const [allPrereq, setAllPrereq] = useState<PrereqKanji[]>([]);
  const [allMainKanji, setAllMainKanji] = useState<ExtendedKanji[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [pRes, mRes] = await Promise.all([
          fetch('/seed-data/extended-kanji/prerequisite-detailed.json'),
          fetch('/seed-data/extended-kanji/kanji.json'),
        ]);
        if (!pRes.ok) throw new Error('Failed to load prerequisite dataset');
        const pData = await pRes.json();
        const mData = await mRes.json();
        const list = pData.kanji as PrereqKanji[];
        setAllPrereq(list);
        setAllMainKanji(mData.kanji as ExtendedKanji[]);
        const found = list.find((k) => k.id === kanjiId);
        if (!found) throw new Error(`Kanji ${kanjiId} not found`);
        setKanji(found);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [kanjiId]);

  // Map of kanji char -> ExtendedKanji entry, used by ColoredWord/InteractiveSentence
  // for color-coded rendering. Includes both main 86 and prereq 117.
  const kanjiByChar = useMemo(() => {
    const m: Record<string, ExtendedKanji> = {};
    allMainKanji.forEach((k) => (m[k.kanji] = k));
    allPrereq.forEach((k) => {
      // Prefer main entry if a char somehow appears in both (shouldn't happen).
      if (!m[k.kanji]) m[k.kanji] = k;
    });
    return m;
  }, [allMainKanji, allPrereq]);

  // Map of main-kanji char -> id for click-through links to /study/kanji/[id]
  const mainIdByChar = useMemo(() => {
    const m: Record<string, string> = {};
    allMainKanji.forEach((k) => (m[k.kanji] = k.id));
    return m;
  }, [allMainKanji]);

  // Map of prereq-kanji char -> id for click-through links to other prereq detail pages
  const prereqIdByChar = useMemo(() => {
    const m: Record<string, string> = {};
    allPrereq.forEach((k) => (m[k.kanji] = k.id));
    return m;
  }, [allPrereq]);

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

  // Parse the comma/semicolon-separated commonUsesSeen string into compound chips.
  const commonCompounds = (kanji.commonUsesSeen ?? '')
    .split(/[;,、]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Link href="/study/kanji/prerequisite">
          <Badge variant="secondary" className="cursor-pointer text-xs sm:text-sm gap-1">
            <Layers className="h-3 w-3" />
            Prerequisite
          </Badge>
        </Link>
      </div>

      {/* Main */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-[clamp(5rem,18vw,9rem)] font-bold leading-none">
              {kanji.kanji}
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold">{kanji.meaning}</h2>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              {kanji.strokeCount != null && (
                <Badge variant="outline">{kanji.strokeCount} strokes</Badge>
              )}
              {kanji.jlpt != null && (
                <Badge variant="outline">JLPT N{kanji.jlpt}</Badge>
              )}
              {kanji.teacherPrimaryReading && kanji.teacherPrimaryReading.length > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  Teacher highlighted:
                  {kanji.teacherPrimaryReading.map((r, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-medium"
                    >
                      {r}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Readings */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className={`${READING_STYLES.on.bg} ${READING_STYLES.on.border}`}>
          <CardHeader>
            <CardTitle className="text-lg">
              音読み{' '}
              <span className="text-sm font-normal text-muted-foreground">
                ({READING_STYLES.on.label})
              </span>
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
              訓読み{' '}
              <span className="text-sm font-normal text-muted-foreground">
                ({READING_STYLES.kun.label})
              </span>
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

      {/* Stroke order */}
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

      {/* Common uses seen — teacher's compound list (fallback for kanji with no linked vocab) */}
      {commonCompounds.length > 0 && (
        <Card className="bg-indigo-50 dark:bg-indigo-950/10 border-indigo-200 dark:border-indigo-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Common uses seen ({commonCompounds.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Compounds containing{' '}
              <span className="text-base font-bold">{kanji.kanji}</span> as listed in
              the teacher's PART 6 reference.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {commonCompounds.map((c, i) => (
                <Badge key={i} variant="outline" className="text-base py-1 px-2.5">
                  {c}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Common vocabulary — curated 5 basic words per kanji from JMdict.
          Kept SEPARATE from the corpus-linked "Linked vocabulary" below so the
          two data sources don't merge. */}
      {kanji.commonVocabulary && kanji.commonVocabulary.length > 0 && (
        <Card className="bg-emerald-50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Common vocabulary ({kanji.commonVocabulary.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Beginner-friendly everyday words containing{' '}
              <span className="text-base font-bold">{kanji.kanji}</span>, curated
              from JMdict frequency lists. Independent of the main-kanji corpus.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-emerald-200 dark:border-emerald-900/50">
                    <th className="text-left py-2 font-medium">Word</th>
                    <th className="text-left py-2 font-medium">Reading</th>
                    <th className="text-left py-2 font-medium">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {kanji.commonVocabulary.map((v, i) => (
                    <tr
                      key={i}
                      className="border-b border-emerald-100 dark:border-emerald-900/30"
                    >
                      <td className="py-2 pl-2 text-lg font-medium">
                        <ColoredWord
                          word={v.word}
                          reading={v.reading}
                          kanjiByChar={kanjiByChar}
                          highlightChar={kanji.kanji}
                        />
                      </td>
                      <td className="py-2 whitespace-nowrap text-muted-foreground">
                        {v.reading}
                      </td>
                      <td className="py-2">{v.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vocabulary — words from main 86-kanji corpus that include this prereq char */}
      {kanji.vocabulary.length > 0 && (
        <Card className="bg-amber-50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Linked vocabulary ({kanji.vocabulary.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Words from the main 86-kanji corpus that contain{' '}
              <span className="text-base font-bold">{kanji.kanji}</span>. Click the
              listed-under kanji to jump to its detail page.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-amber-200 dark:border-amber-900/50">
                    <th className="text-left py-2 font-medium">Word</th>
                    <th className="text-left py-2 font-medium">Reading</th>
                    <th className="text-left py-2 font-medium">Meaning</th>
                    <th className="text-left py-2 font-medium">Listed under</th>
                  </tr>
                </thead>
                <tbody>
                  {kanji.vocabulary.map((v, i) => {
                    const parentId = v.parentKanji ? mainIdByChar[v.parentKanji] : null;
                    return (
                      <tr
                        key={i}
                        className="border-b border-amber-100 dark:border-amber-900/30"
                      >
                        <td className="py-2 pl-2 text-lg font-medium">
                          <ColoredWord
                            word={v.word}
                            reading={v.reading}
                            kanjiByChar={kanjiByChar}
                            highlightChar={kanji.kanji}
                          />
                        </td>
                        <td className="py-2 whitespace-nowrap text-muted-foreground">
                          {v.reading}
                        </td>
                        <td className="py-2">{v.meaning}</td>
                        <td className="py-2">
                          {v.parentKanji && parentId ? (
                            <Link
                              href={`/study/kanji/${encodeURIComponent(parentId)}`}
                            >
                              <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-accent"
                              >
                                {v.parentKanji}
                              </Badge>
                            </Link>
                          ) : v.parentKanji ? (
                            <Badge variant="outline">{v.parentKanji}</Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
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

      {/* Example sentences */}
      {kanji.exampleSentences.length > 0 && (
        <Card className="bg-purple-50 dark:bg-purple-950/10 border-purple-200 dark:border-purple-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Example sentences ({kanji.exampleSentences.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Sentences from the main reference that include{' '}
              <span className="text-base font-bold">{kanji.kanji}</span>.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {kanji.exampleSentences.map((s, i) => (
                <InteractiveSentence
                  key={i}
                  japanese={s.japanese}
                  english={s.english}
                  rubies={s.rubies}
                  kanjiByChar={kanjiByChar}
                  highlightChar={kanji.kanji}
                  className="border-purple-200 dark:border-purple-900/50"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty-state nudge when neither vocab nor sentences are linked */}
      {kanji.vocabulary.length === 0 && kanji.exampleSentences.length === 0 && (
        <Card className="bg-slate-50 dark:bg-slate-900/40">
          <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
            <p>
              No linked vocabulary or example sentences for{' '}
              <span className="text-base font-bold">{kanji.kanji}</span> in the main
              corpus.
            </p>
            <p>
              That's expected for some prerequisites — they appear only in compounds
              the teacher referenced (see <em>Common uses seen</em> above) but were
              not used inside the per-kanji vocabulary tables of the 86 main kanji.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <Card>
        <CardContent className="pt-6 text-xs text-muted-foreground space-y-1">
          <p>
            <Info className="inline h-3 w-3 mr-1" />
            Source: PART 6 of KANJI_REFERENCE_v2.md. Vocab/sentences linked only from
            the existing main-kanji corpus.
          </p>
          <p>
            <Languages className="inline h-3 w-3 mr-1" />
            Stroke-order data from KanjiVG (CC BY-SA 3.0).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
