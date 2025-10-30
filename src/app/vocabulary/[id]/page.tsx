'use client';

/**
 * Vocabulary Detail Page
 *
 * Dynamic route: /vocabulary/[id]
 * Example: /vocabulary/n5_vocab_0001
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Volume2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VocabWord {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string[];
  jlptLevel: string;
  partOfSpeech: string[];
  tags: string[];
  examples: Array<{
    japanese: string;
    kana: string;
    english: string;
    audioUrl?: string;
  }>;
}

export default function VocabularyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vocabId = decodeURIComponent(params.id as string);

  const [vocab, setVocab] = useState<VocabWord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVocab = async () => {
      try {
        setLoading(true);
        const response = await fetch('/seed-data/N5_vocab_dataset.json');

        if (!response.ok) {
          throw new Error('Failed to load vocabulary data');
        }

        const data = await response.json();
        const vocabWord = data.vocabulary.find((v: VocabWord) => v.id === vocabId);

        if (!vocabWord) {
          throw new Error('Vocabulary word not found');
        }

        setVocab(vocabWord);
        setError(null);
      } catch (err) {
        console.error('Error loading vocabulary:', err);
        setError(err instanceof Error ? err.message : 'Failed to load vocabulary');
      } finally {
        setLoading(false);
      }
    };

    loadVocab();
  }, [vocabId]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !vocab) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error || 'Vocabulary not found'}</p>
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

        <Badge variant="secondary">{vocab.jlptLevel}</Badge>
      </div>

      {/* Main Word Display */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {/* Kanji/Kana */}
            <div className="text-7xl font-bold text-foreground">
              {vocab.kanji || vocab.kana}
            </div>

            {/* Reading */}
            {vocab.kanji && (
              <div className="text-3xl text-muted-foreground">
                {vocab.kana}
              </div>
            )}

            {/* Romaji */}
            <div className="text-xl text-muted-foreground italic">
              {vocab.romaji}
            </div>

            {/* Meanings */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 justify-center">
                {vocab.meaning.map((meaning, i) => (
                  <Badge key={i} variant="outline" className="text-base px-3 py-1">
                    {meaning}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Part of Speech */}
            <div className="flex flex-wrap gap-2 justify-center">
              {vocab.partOfSpeech.map((pos, i) => (
                <Badge key={i} variant="secondary" className="text-sm">
                  {pos}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Sentences */}
      {vocab.examples && vocab.examples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Example Sentences ({vocab.examples.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vocab.examples.slice(0, 5).map((example, i) => (
              <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="text-xl font-medium">
                      {example.japanese}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {example.kana}
                    </div>
                    <div className="text-base text-muted-foreground">
                      {example.english}
                    </div>
                  </div>
                  {example.audioUrl && (
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Volume2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {vocab.tags && vocab.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {vocab.tags.map((tag, i) => (
                <Badge key={i} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
