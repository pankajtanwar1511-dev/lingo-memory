'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import type { KanjiLesson, KanjiCard, KanjiSentence } from '@/types/kanji';

/**
 * Lesson Detail Page
 *
 * Displays comprehensive information about a specific kanji lesson including:
 * - Lesson metadata (number, title, description, time estimate)
 * - All kanji taught in this lesson (with links to detail pages)
 * - All example sentences for this lesson
 * - Prerequisites and next lesson navigation
 */
export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.id as string;

  const [lesson, setLesson] = useState<KanjiLesson | null>(null);
  const [kanji, setKanji] = useState<KanjiCard[]>([]);
  const [sentences, setSentences] = useState<KanjiSentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        console.log('📚 Loading lesson data for:', lessonId);

        // Load lessons data
        const lessonsResponse = await fetch('/seed-data/kanji_lessons.json');
        if (!lessonsResponse.ok) {
          throw new Error('Failed to load lessons data');
        }
        const lessonsData = await lessonsResponse.json();

        // Find the specific lesson
        const foundLesson = lessonsData.lessons.find((l: KanjiLesson) => l.id === lessonId);
        if (!foundLesson) {
          setError('Lesson not found');
          setLoading(false);
          return;
        }

        console.log('✅ Found lesson:', foundLesson.title);
        setLesson(foundLesson);

        // Load kanji data
        const kanjiResponse = await fetch('/seed-data/kanji_n5.json');
        if (kanjiResponse.ok) {
          const kanjiData = await kanjiResponse.json();
          const lessonKanji = kanjiData.kanji.filter((k: KanjiCard) =>
            foundLesson.kanji_ids.includes(k.id)
          );
          setKanji(lessonKanji);
          console.log('✅ Loaded kanji:', lessonKanji.length);
        }

        // Load sentences data
        const sentencesResponse = await fetch('/seed-data/kanji_sentences.json');
        if (sentencesResponse.ok) {
          const sentencesData = await sentencesResponse.json();
          const lessonSentences = sentencesData.sentences.filter((s: KanjiSentence) =>
            foundLesson.sentence_ids.includes(s.id)
          );
          setSentences(lessonSentences);
          console.log('✅ Loaded sentences:', lessonSentences.length);
        }

        setLoading(false);
      } catch (err) {
        console.error('❌ Error loading lesson:', err);
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
        setLoading(false);
      }
    }

    if (lessonId) {
      loadData();
    }
  }, [lessonId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading lesson...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'The requested lesson could not be found.'}
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Badge variant="secondary" className="text-sm">
            Lesson {lesson.number}
          </Badge>
        </div>

        {/* Lesson Header */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-900/30">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <Badge variant="outline" className="text-xs">
                    {lesson.page}
                  </Badge>
                </div>
                <CardTitle className="text-3xl mb-2">
                  {lesson.title}
                </CardTitle>
                <p className="text-lg text-muted-foreground">
                  {lesson.description}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{lesson.estimatedMinutes} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{kanji.length} kanji</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>{sentences.length} sentences</span>
              </div>
              <Badge variant="secondary">{lesson.difficulty}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Prerequisites & Navigation */}
        {(lesson.prerequisites.length > 0 || lesson.nextLesson) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Learning Path</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                {lesson.prerequisites.length > 0 && (
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-2">
                      Prerequisites
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lesson.prerequisites.map((prereqId) => (
                        <Link key={prereqId} href={`/study/kanji/lessons/${prereqId}`}>
                          <Button variant="outline" size="sm">
                            {prereqId.replace('lesson_', 'Lesson ')}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {lesson.nextLesson && (
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-2">
                      Next Lesson
                    </div>
                    <Link href={`/study/kanji/lessons/${lesson.nextLesson}`}>
                      <Button variant="default" size="sm" className="gap-2">
                        {lesson.nextLesson.replace('lesson_', 'Lesson ')}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Kanji in This Lesson */}
        {kanji.length > 0 && (
          <Card className="bg-blue-50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-900/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Kanji in This Lesson ({kanji.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {kanji.map((k) => (
                  <Link
                    key={k.id}
                    href={`/study/kanji/${k.id}`}
                    className="block"
                  >
                    <Card className="hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="text-5xl font-bold mb-2">{k.kanji}</div>
                        <div className="text-sm text-muted-foreground">
                          {k.meanings.slice(0, 2).join(', ')}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Example Sentences */}
        {sentences.length > 0 && (
          <Card className="bg-purple-50 dark:bg-purple-950/10 border-purple-200 dark:border-purple-900/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Example Sentences ({sentences.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                Practice sentences from the textbook
              </div>
              <div className="space-y-6">
                {sentences.map((sentence) => (
                  <div
                    key={sentence.id}
                    className="p-4 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50 rounded-lg"
                  >
                    <div className="space-y-2">
                      {/* Japanese */}
                      <div className="text-2xl font-bold text-foreground">
                        {sentence.japanese}
                      </div>
                      {/* Kana */}
                      <div className="text-lg text-muted-foreground">
                        {sentence.kana}
                      </div>
                      {/* Romaji */}
                      <div className="text-base text-muted-foreground italic">
                        {sentence.romaji}
                      </div>
                      {/* English */}
                      <div className="text-lg font-medium text-foreground pt-2">
                        {sentence.english}
                      </div>
                      {/* Grammar Points */}
                      {sentence.grammarPoints.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {sentence.grammarPoints.map((point, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {point}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {/* Kanji Used */}
                      {sentence.kanji_chars.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-100 dark:border-purple-900/30 mt-2">
                          <span className="text-xs text-muted-foreground mr-2">
                            Kanji:
                          </span>
                          {sentence.kanji_chars.map((char, i) => (
                            <Badge key={i} variant="secondary" className="text-sm">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Study Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Start Studying
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <MessageSquare className="h-5 w-5" />
                Practice Sentences
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Study features coming soon!
            </p>
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        {lesson.nextLesson && (
          <div className="flex justify-end">
            <Link href={`/study/kanji/lessons/${lesson.nextLesson}`}>
              <Button size="lg" className="gap-2">
                Next Lesson
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
