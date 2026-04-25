'use client';

/**
 * Extended Kanji — single lesson detail
 * Route: /study/extended-kanji/lessons/lesson_{N}
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CalendarDays, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ExtendedKanji,
  ExtendedKanjiLesson,
} from '@/types/extended-kanji';

export default function ExtendedKanjiLessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = decodeURIComponent(params.id as string);
  // id format: "lesson_{N}"
  const lessonNumber = parseInt(rawId.replace(/^lesson_/, ''), 10);

  const [lesson, setLesson] = useState<ExtendedKanjiLesson | null>(null);
  const [allLessons, setAllLessons] = useState<ExtendedKanjiLesson[]>([]);
  const [kanjiById, setKanjiById] = useState<Record<string, ExtendedKanji>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [lessonsRes, kanjiRes] = await Promise.all([
          fetch('/seed-data/extended-kanji/lessons.json'),
          fetch('/seed-data/extended-kanji/kanji.json'),
        ]);
        const lessonsData = await lessonsRes.json();
        const kanjiData = await kanjiRes.json();
        const all = lessonsData.lessons as ExtendedKanjiLesson[];
        const found = all.find((l) => l.number === lessonNumber);
        if (!found) throw new Error(`Lesson ${lessonNumber} not found`);
        setLesson(found);
        setAllLessons(all);
        const map: Record<string, ExtendedKanji> = {};
        (kanjiData.kanji as ExtendedKanji[]).forEach((k) => (map[k.id] = k));
        setKanjiById(map);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [lessonNumber]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-destructive">{error || 'Lesson not found'}</p>
            <Button onClick={() => router.back()}>Go back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const prev = allLessons.find((l) => l.number === lesson.number - 1);
  const next = allLessons.find((l) => l.number === lesson.number + 1);

  const taughtKanji = lesson.kanjiIds.map((id) => kanjiById[id]).filter(Boolean);
  const reviewKanji = lesson.reviewKanjiIds.map((id) => kanjiById[id]).filter(Boolean);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/study/extended-kanji/lessons">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            All lessons
          </Button>
        </Link>
        <Badge variant="secondary">Lesson {lesson.number}</Badge>
      </div>

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CalendarDays className="h-7 w-7" />
          {lesson.date}
        </h1>
        <p className="text-muted-foreground">
          {lesson.isPracticeOnly
            ? `Practice session — ${lesson.rawKanjiField}`
            : `Taught: ${lesson.kanjiChars.join('・') || '—'}`}
        </p>
        {lesson.source && (
          <p className="text-xs text-muted-foreground mt-1">
            Textbook reference: {lesson.source}
          </p>
        )}
      </div>

      {/* Taught kanji */}
      {taughtKanji.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Newly taught ({taughtKanji.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {taughtKanji.map((k) => (
                <Link
                  key={k.id}
                  href={`/study/extended-kanji/${encodeURIComponent(k.id)}`}
                  className="block"
                >
                  <Card className="hover:shadow-md hover:border-primary transition-all">
                    <CardContent className="pt-5 pb-5 text-center space-y-1">
                      <div className="text-5xl font-bold">{k.kanji}</div>
                      <div className="text-xs text-muted-foreground">{k.meaning}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {k.vocabulary.length} vocab · {k.exampleSentences.length} sent.
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review kanji */}
      {reviewKanji.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Reviewed ({reviewKanji.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {reviewKanji.map((k) => (
                <Link key={k.id} href={`/study/extended-kanji/${encodeURIComponent(k.id)}`}>
                  <Badge variant="outline" className="text-lg px-3 py-1 cursor-pointer hover:bg-accent">
                    {k.kanji}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prev / Next */}
      <div className="flex items-center justify-between gap-2">
        {prev ? (
          <Link href={`/study/extended-kanji/lessons/lesson_${prev.number}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Lesson {prev.number} · {prev.date}
            </Button>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/study/extended-kanji/lessons/lesson_${next.number}`}>
            <Button variant="outline" className="gap-2">
              Lesson {next.number} · {next.date}
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
