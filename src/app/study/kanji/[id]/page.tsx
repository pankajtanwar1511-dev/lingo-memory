'use client';

/**
 * Kanji Detail Page
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
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StrokeOrderAnimation } from '@/components/kanji/StrokeOrderAnimation';
import { KanjiCard } from '@/types/kanji';

export default function KanjiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const kanjiId = decodeURIComponent(params.id as string);

  const [kanji, setKanji] = useState<KanjiCard | null>(null);
  const [vocabData, setVocabData] = useState<Record<string, any>>({});
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

        // Create vocab lookup map
        const vocabMap: Record<string, any> = {};
        vocabDataset.vocabulary.forEach((vocab: any) => {
          vocabMap[vocab.id] = vocab;
        });
        setVocabData(vocabMap);

        console.log('📦 Loaded kanji dataset:', kanjiData.metadata);
        console.log('🔎 Searching for kanji with ID:', kanjiId);
        const kanjiCard = kanjiData.kanji.find((k: KanjiCard) => k.id === kanjiId);

        if (!kanjiCard) {
          console.error('❌ Kanji not found. Available IDs:', kanjiData.kanji.slice(0, 5).map((k: any) => k.id));
          throw new Error('Kanji not found');
        }

        console.log('✅ Found kanji:', kanjiCard.kanji);

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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Example Words ({kanji.examples.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Click on a word to see its full details
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {kanji.examples.slice(0, 12).map((vocabId) => {
                const vocab = vocabData[vocabId];
                if (!vocab) return null;

                return (
                  <Link
                    key={vocabId}
                    href={`/vocabulary/${vocabId}`}
                    className="p-3 border rounded-lg hover:bg-accent hover:border-primary transition-colors"
                  >
                    <div className="text-lg font-medium mb-1">
                      {vocab.kanji || vocab.kana}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {vocab.kana}
                    </div>
                    <div className="text-xs text-muted-foreground">
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
            <p>
              <strong>License:</strong> {kanji.license.text}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
