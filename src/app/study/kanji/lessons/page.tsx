'use client';

/**
 * Kanji — lesson timeline index.
 * Route: /study/kanji/lessons
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExtendedKanjiLesson } from '@/types/extended-kanji';

export default function ExtendedKanjiLessonsIndexPage() {
  const [lessons, setLessons] = useState<ExtendedKanjiLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/seed-data/extended-kanji/lessons.json');
      const data = await res.json();
      setLessons(data.lessons);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/study/kanji">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to kanji
          </Button>
        </Link>
        <Badge variant="secondary" className="text-base px-3 py-1">
          {lessons.length} lessons
        </Badge>
      </div>

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CalendarDays className="h-7 w-7" />
          Lesson Timeline
        </h1>
        <p className="text-muted-foreground">
          36 chronological lessons from Feb 17 – Apr 24, 2026.
        </p>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson) => (
          <Link
            key={lesson.number}
            href={`/study/kanji/lessons/lesson_${lesson.number}`}
            className="block"
          >
            <Card className="hover:shadow-md hover:border-primary transition-all cursor-pointer">
              <CardContent className="pt-5 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      {lesson.number}
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{lesson.date}</div>
                      <div className="font-medium">
                        {lesson.isPracticeOnly
                          ? lesson.rawKanjiField
                          : lesson.kanjiChars.length > 0
                          ? lesson.kanjiChars.join('・')
                          : '—'}
                      </div>
                      {lesson.reviewKanjiChars.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          review: {lesson.reviewKanjiChars.join('・')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {lesson.textbookPage && (
                      <Badge variant="outline">p.{lesson.textbookPage}</Badge>
                    )}
                    {lesson.source && !lesson.textbookPage && (
                      <Badge variant="outline">{lesson.source}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
