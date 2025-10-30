'use client';

/**
 * Kanji Practice Mode
 *
 * Flashcard-style practice for kanji
 * Shows kanji → flip to see meanings and readings
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCw, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KanjiCard {
  id: string;
  kanji: string;
  meanings: string[];
  onReadings: string[];
  kunReadings: string[];
  strokeCount: number;
  jlptLevel: string;
}

interface CardProgress {
  kanjiId: string;
  level: number;        // 0-5 LM circles
  lastSeen: number;     // Timestamp
  reviewCount: number;  // Total reviews
}

export default function KanjiPracticePage() {
  const [kanjiList, setKanjiList] = useState<KanjiCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});

  useEffect(() => {
    const loadKanji = async () => {
      try {
        const response = await fetch('/seed-data/kanji_n5.json');
        if (!response.ok) throw new Error('Failed to load');

        const data = await response.json();

        // Load progress from localStorage
        const savedProgress = localStorage.getItem('kanji-practice-progress');
        const progressData = savedProgress ? JSON.parse(savedProgress) : {};
        setProgress(progressData);

        // Try to restore from session storage
        const savedOrder = sessionStorage.getItem('kanji-practice-order');
        const savedIndex = sessionStorage.getItem('kanji-practice-index');

        let orderedKanji: KanjiCard[] = [];

        if (savedOrder) {
          // Restore previous session
          const orderIds = JSON.parse(savedOrder);
          orderedKanji = orderIds
            .map((id: string) => data.kanji.find((k: any) => k.id === id))
            .filter(Boolean);
          setCurrentIndex(savedIndex ? parseInt(savedIndex) : 0);
        } else {
          // New session - sort by priority based on progress
          orderedKanji = sortByPriority(data.kanji, progressData);
          // Save the order
          sessionStorage.setItem(
            'kanji-practice-order',
            JSON.stringify(orderedKanji.map((k: any) => k.id))
          );
        }

        setKanjiList(orderedKanji);
      } catch (err) {
        console.error('Error loading kanji:', err);
      } finally {
        setLoading(false);
      }
    };

    loadKanji();
  }, []);

  // Sort kanji by priority (struggling cards first)
  const sortByPriority = (kanji: KanjiCard[], progressData: Record<string, CardProgress>) => {
    return [...kanji].sort((a, b) => {
      const progressA = progressData[a.id];
      const progressB = progressData[b.id];

      // Never reviewed = highest priority
      if (!progressA && progressB) return -1;
      if (progressA && !progressB) return 1;
      if (!progressA && !progressB) return Math.random() - 0.5;

      // Lower level = higher priority
      if (progressA.level !== progressB.level) {
        return progressA.level - progressB.level;
      }

      // Least recently seen = higher priority
      return progressA.lastSeen - progressB.lastSeen;
    });
  };

  // Save current index whenever it changes
  useEffect(() => {
    if (kanjiList.length > 0) {
      sessionStorage.setItem('kanji-practice-index', currentIndex.toString());
    }
  }, [currentIndex, kanjiList.length]);

  const currentKanji = kanjiList[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setShowRating(false);
    setCurrentIndex((prev) => (prev + 1) % kanjiList.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setShowRating(false);
    setCurrentIndex((prev) => (prev - 1 + kanjiList.length) % kanjiList.length);
  };

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setShowRating(true);
    } else {
      setIsFlipped(false);
      setShowRating(false);
    }
  };

  const handleRating = (level: number) => {
    if (!currentKanji) return;

    // Update progress
    const newProgress = {
      ...progress,
      [currentKanji.id]: {
        kanjiId: currentKanji.id,
        level,
        lastSeen: Date.now(),
        reviewCount: (progress[currentKanji.id]?.reviewCount || 0) + 1,
      },
    };

    setProgress(newProgress);
    localStorage.setItem('kanji-practice-progress', JSON.stringify(newProgress));

    // Auto-advance to next card
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!currentKanji) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No kanji available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/study/kanji">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Kanji List
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            {currentIndex + 1} / {kanjiList.length}
          </Badge>
          {currentKanji && progress[currentKanji.id] && (
            <Badge variant="outline" className="text-sm gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < progress[currentKanji.id].level
                      ? 'bg-green-500'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem('kanji-practice-order');
              sessionStorage.removeItem('kanji-practice-index');
              window.location.reload();
            }}
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Restart
          </Button>
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow min-h-[400px] flex items-center justify-center"
          onClick={handleFlip}
        >
          <CardContent className="pt-6 w-full">
            {!isFlipped ? (
              // Front: Kanji
              <div className="text-center space-y-6">
                <div className="text-9xl font-bold text-foreground mb-8">
                  {currentKanji.kanji}
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">Click to see answer</span>
                </div>
              </div>
            ) : (
              // Back: Meanings and readings
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-foreground mb-4">
                    {currentKanji.kanji}
                  </div>
                  <Badge variant="outline">{currentKanji.jlptLevel}</Badge>
                </div>

                <div className="space-y-4">
                  {/* Meanings */}
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                      MEANINGS
                    </h3>
                    <div className="text-2xl font-medium">
                      {currentKanji.meanings.slice(0, 3).join(', ')}
                    </div>
                  </div>

                  {/* Readings */}
                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    {/* On-readings */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        音読み (ON)
                      </h3>
                      {currentKanji.onReadings.length > 0 ? (
                        <div className="space-y-1">
                          {currentKanji.onReadings.map((reading, i) => (
                            <div key={i} className="text-xl font-medium">
                              {reading}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">—</p>
                      )}
                    </div>

                    {/* Kun-readings */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        訓読み (KUN)
                      </h3>
                      {currentKanji.kunReadings.length > 0 ? (
                        <div className="space-y-1">
                          {currentKanji.kunReadings.map((reading, i) => (
                            <div key={i} className="text-xl font-medium">
                              {reading}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">—</p>
                      )}
                    </div>
                  </div>

                  {/* Stroke count */}
                  <div className="text-center pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      {currentKanji.strokeCount} strokes
                    </span>
                  </div>
                </div>

                {/* Rating Section */}
                {showRating && (
                  <div className="pt-6 border-t mt-6">
                    <h3 className="text-center text-sm font-semibold text-muted-foreground mb-4">
                      How well did you remember?
                    </h3>
                    <div className="space-y-2">
                      {[
                        { level: 0, label: "Didn't know", circles: 0 },
                        { level: 1, label: "Hard", circles: 1 },
                        { level: 2, label: "Medium", circles: 2 },
                        { level: 3, label: "Good", circles: 3 },
                        { level: 5, label: "Perfect", circles: 5 },
                      ].map((option) => (
                        <button
                          key={option.level}
                          onClick={() => handleRating(option.level)}
                          className="w-full p-3 border rounded-lg hover:bg-accent hover:border-primary transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 rounded-full border-2 ${
                                    i < option.circles
                                      ? 'bg-green-500 border-green-500'
                                      : 'bg-transparent border-muted-foreground/30'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{option.label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to rate
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* See Details Link */}
        <div className="text-center mt-4">
          <Link href={`/study/kanji/${currentKanji.id}`}>
            <Button variant="link" className="text-sm">
              View full details & stroke order →
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrevious}
          className="gap-2"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </Button>

        <Button
          variant="default"
          size="lg"
          onClick={handleFlip}
          className="gap-2"
        >
          {isFlipped ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          {isFlipped ? 'Hide' : 'Show'} Answer
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleNext}
          className="gap-2"
        >
          Next
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / kanjiList.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
