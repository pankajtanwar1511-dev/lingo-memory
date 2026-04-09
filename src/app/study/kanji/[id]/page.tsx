'use client';

/**
 * Enhanced Kanji Detail Page with kanji.md Integration
 *
 * Dynamic route: /study/kanji/[id]
 * Example: /study/kanji/kanji_n5_日
 *
 * Displays:
 * - Kanji character (large)
 * - Meanings and readings
 * - Stroke order animation
 * - Metadata (stroke count, grade, frequency)
 * - Example vocabulary words (clickable)
 * - Example sentences with full translations (NEW)
 * - Related lessons (NEW)
 * - Cultural notes (NEW)
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Sparkles, MessageSquare, GraduationCap, Landmark, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StrokeOrderAnimation } from '@/components/kanji/StrokeOrderAnimation';
import { KanjiCard, KanjiSentence, KanjiLesson, CulturalNote } from '@/types/kanji';

export default function KanjiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const kanjiId = decodeURIComponent(params.id as string);

  const [kanji, setKanji] = useState<KanjiCard | null>(null);
  const [vocabData, setVocabData] = useState<Record<string, any>>({});
  const [sentences, setSentences] = useState<KanjiSentence[]>([]);
  const [lessons, setLessons] = useState<KanjiLesson[]>([]);
  const [culturalNotes, setCulturalNotes] = useState<CulturalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadKanji = async () => {
      try {
        setLoading(true);
        console.log('🔍 Loading kanji with ID:', kanjiId);

        // Load kanji data
        const kanjiResponse = await fetch('/seed-data/kanji_n5.json');
        if (!kanjiResponse.ok) {
          throw new Error('Failed to load kanji data');
        }
        const kanjiData = await kanjiResponse.json();

        // Load vocabulary data
        const vocabResponse = await fetch('/seed-data/N5_vocab_dataset.json');
        if (!vocabResponse.ok) {
          throw new Error('Failed to load vocabulary data');
        }
        const vocabDataset = await vocabResponse.json();

        // Load sentences data (NEW)
        let sentencesData: any = { sentences: [] };
        try {
          const sentencesResponse = await fetch('/seed-data/kanji_sentences.json');
          if (sentencesResponse.ok) {
            sentencesData = await sentencesResponse.json();
            console.log('✅ Loaded sentences:', sentencesData.sentences.length);
          }
        } catch (err) {
          console.warn('⚠️ Sentences data not available');
        }

        // Load lessons data (NEW)
        let lessonsData: any = { lessons: [] };
        try {
          const lessonsResponse = await fetch('/seed-data/kanji_lessons.json');
          if (lessonsResponse.ok) {
            lessonsData = await lessonsResponse.json();
            console.log('✅ Loaded lessons:', lessonsData.lessons.length);
          }
        } catch (err) {
          console.warn('⚠️ Lessons data not available');
        }

        // Load cultural notes data (NEW)
        let culturalData: any = { notes: [] };
        try {
          const culturalResponse = await fetch('/seed-data/cultural_notes.json');
          if (culturalResponse.ok) {
            culturalData = await culturalResponse.json();
            console.log('✅ Loaded cultural notes:', culturalData.notes.length);
          }
        } catch (err) {
          console.warn('⚠️ Cultural notes data not available');
        }

        // Create vocab lookup map
        const vocabMap: Record<string, any> = {};
        vocabDataset.vocabulary.forEach((vocab: any) => {
          vocabMap[vocab.id] = vocab;
        });
        setVocabData(vocabMap);

        // Find the kanji
        console.log('📦 Loaded kanji dataset:', kanjiData.metadata);
        console.log('🔎 Searching for kanji with ID:', kanjiId);
        const kanjiCard = kanjiData.kanji.find((k: KanjiCard) => k.id === kanjiId);

        if (!kanjiCard) {
          console.error('❌ Kanji not found. Available IDs:', kanjiData.kanji.slice(0, 5).map((k: any) => k.id));
          throw new Error('Kanji not found');
        }

        console.log('✅ Found kanji:', kanjiCard.kanji);

        // Filter sentences for this kanji (NEW)
        if (kanjiCard.sentence_ids && kanjiCard.sentence_ids.length > 0) {
          const kanjiSentences = sentencesData.sentences.filter((s: KanjiSentence) =>
            kanjiCard.sentence_ids?.includes(s.id)
          );
          setSentences(kanjiSentences);
          console.log('📝 Found sentences:', kanjiSentences.length);
        }

        // Filter lessons for this kanji (NEW)
        if (kanjiCard.lesson_ids && kanjiCard.lesson_ids.length > 0) {
          const kanjiLessons = lessonsData.lessons.filter((l: KanjiLesson) =>
            kanjiCard.lesson_ids?.includes(l.id)
          );
          setLessons(kanjiLessons);
          console.log('📚 Found lessons:', kanjiLessons.length);
        }

        // Filter cultural notes for this kanji (NEW)
        if (kanjiCard.cultural_note_ids && kanjiCard.cultural_note_ids.length > 0) {
          const kanjiCulturalNotes = culturalData.notes.filter((n: CulturalNote) =>
            kanjiCard.cultural_note_ids?.includes(n.id)
          );
          setCulturalNotes(kanjiCulturalNotes);
          console.log('🎎 Found cultural notes:', kanjiCulturalNotes.length);
        }

        setKanji(kanjiCard);
        setError(null);
      } catch (err) {
        console.error('Error loading kanji:', err);
        setError(err instanceof Error ? err.message : 'Failed to load kanji');
      } finally {
        setLoading(false);
      }
    };

    loadKanji();
  }, [kanjiId]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !kanji) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error || 'Kanji not found'}</p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Badge variant="secondary">{kanji.jlptLevel}</Badge>
      </div>

      {/* Main Kanji Display */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {/* Large Kanji Character */}
            <div className="text-9xl font-bold text-foreground">
              {kanji.kanji}
            </div>

            {/* Meanings */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">
                {kanji.meanings.slice(0, 3).join(', ')}
              </h2>
              {kanji.meanings.length > 3 && (
                <p className="text-sm text-muted-foreground">
                  +{kanji.meanings.length - 3} more meanings
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Readings */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* On-readings Card */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30">
          <CardHeader>
            <CardTitle className="text-lg">
              音読み <span className="text-sm font-normal text-muted-foreground">(On-reading)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kanji.onReadings.length > 0 ? (
              <div className="space-y-2">
                {kanji.onReadings.map((reading, i) => (
                  <div key={i} className="text-3xl font-medium text-blue-900 dark:text-blue-100">
                    {reading}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-xl">—</p>
            )}
          </CardContent>
        </Card>

        {/* Kun-readings Card */}
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30">
          <CardHeader>
            <CardTitle className="text-lg">
              訓読み <span className="text-sm font-normal text-muted-foreground">(Kun-reading)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kanji.kunReadings.length > 0 ? (
              <div className="space-y-2">
                {kanji.kunReadings.map((reading, i) => (
                  <div key={i} className="text-3xl font-medium text-green-900 dark:text-green-100">
                    {reading}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-xl">—</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Example Vocabulary (Moved up for better visibility) */}
      {kanji.examples.length > 0 && (
        <Card className="bg-amber-50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Example Words ({kanji.examples.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Words that use this kanji
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {kanji.examples.slice(0, 12).map((vocabId) => {
                const vocab = vocabData[vocabId];
                if (!vocab) return null;

                return (
                  <Link
                    key={vocabId}
                    href={`/vocabulary/${vocabId}`}
                    className="p-4 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-lg shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-700 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl font-bold text-foreground">
                        {vocab.kanji || vocab.kana}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {vocab.partOfSpeech[0] || 'word'}
                      </Badge>
                    </div>
                    <div className="text-base text-muted-foreground mb-1">
                      {vocab.kana}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {vocab.meaning[0]}
                    </div>
                  </Link>
                );
              })}
            </div>

            {kanji.examples.length > 12 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                +{kanji.examples.length - 12} more examples
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Example Sentences (NEW - kanji.md integration) */}
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
              Real sentences from Japanese textbooks
            </div>
            <div className="space-y-6">
              {sentences.slice(0, 6).map((sentence) => (
                <div key={sentence.id} className="p-4 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50 rounded-lg">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-foreground">
                      {sentence.japanese}
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {sentence.kana}
                    </div>
                    <div className="text-base text-muted-foreground italic">
                      {sentence.romaji}
                    </div>
                    <div className="text-lg font-medium text-foreground pt-2">
                      {sentence.english}
                    </div>
                    {sentence.grammarPoints.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {sentence.grammarPoints.map((point, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {sentences.length > 6 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                +{sentences.length - 6} more sentences
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Related Lessons (NEW - kanji.md integration) */}
      {lessons.length > 0 && (
        <Card className="bg-indigo-50 dark:bg-indigo-950/10 border-indigo-200 dark:border-indigo-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Taught in Lessons ({lessons.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Structured learning path for this kanji
            </div>
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/study/kanji/lessons/${lesson.id}`}
                  className="block p-4 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50 rounded-lg hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-700 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Lesson {lesson.number}</Badge>
                        <span className="text-sm text-muted-foreground">{lesson.page}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>⏱ {lesson.estimatedMinutes} minutes</span>
                        <span>📝 {lesson.sentence_ids.length} sentences</span>
                        <span>🔤 {lesson.kanji_chars.length} kanji</span>
                      </div>
                    </div>
                    <ArrowLeft className="h-5 w-5 rotate-180 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cultural Notes (NEW - kanji.md integration) */}
      {culturalNotes.length > 0 && (
        <Card className="bg-rose-50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              Cultural Notes ({culturalNotes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Japanese cultural context and traditions
            </div>
            <div className="space-y-4">
              {culturalNotes.map((note) => (
                <div key={note.id} className="p-4 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {note.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {note.category}
                        </Badge>
                      </div>
                      <div className="text-3xl">
                        {note.term}
                      </div>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {note.fullDescription.substring(0, 300)}...
                    </p>
                    {note.externalLinks.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {note.externalLinks.map((link, i) => (
                          <a
                            key={i}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            Learn more <ExternalLink className="h-3 w-3" />
                          </a>
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

      {/* Stroke Order Animation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Stroke Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StrokeOrderAnimation
            kanji={kanji.kanji}
            strokes={kanji.strokes}
            autoPlay={false}
            showStrokeNumbers={true}
            loop={false}
          />
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Strokes</p>
              <p className="text-2xl font-bold">{kanji.strokeCount}</p>
            </div>

            {kanji.grade && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Grade</p>
                <p className="text-2xl font-bold">{kanji.grade}</p>
              </div>
            )}

            {kanji.frequency && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Frequency</p>
                <p className="text-2xl font-bold">#{kanji.frequency}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-1">Examples</p>
              <p className="text-2xl font-bold">{kanji.examples.length}</p>
            </div>
          </div>

          {kanji.radical && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Radical</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{kanji.radical.literal}</span>
                <span className="text-sm text-muted-foreground">
                  ({kanji.radical.meaning})
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Example Vocabulary */}
      {kanji.examples.length > 0 && (
        <Card className="bg-amber-50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Example Words ({kanji.examples.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Words that use this kanji
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {kanji.examples.slice(0, 12).map((vocabId) => {
                const vocab = vocabData[vocabId];
                if (!vocab) return null;

                return (
                  <Link
                    key={vocabId}
                    href={`/vocabulary/${vocabId}`}
                    className="p-4 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-lg shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-700 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl font-bold text-foreground">
                        {vocab.kanji || vocab.kana}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {vocab.partOfSpeech[0] || 'word'}
                      </Badge>
                    </div>
                    <div className="text-base text-muted-foreground mb-1">
                      {vocab.kana}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {vocab.meaning[0]}
                    </div>
                  </Link>
                );
              })}
            </div>

            {kanji.examples.length > 12 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                +{kanji.examples.length - 12} more examples
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Attribution */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <strong>Data Source:</strong> {kanji.source.type} ({kanji.source.version})
            </p>
            <p>
              <strong>Stroke Order:</strong> KanjiVG (CC BY-SA 3.0)
            </p>
            {sentences.length > 0 && (
              <p>
                <strong>Example Sentences:</strong> kanji.md textbook
              </p>
            )}
            <p>
              <strong>License:</strong> {kanji.license.text}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
