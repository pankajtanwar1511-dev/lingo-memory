'use client';

/**
 * Kanji Practice Mode
 *
 * Flashcard-style practice for kanji
 * Shows kanji → flip to see meanings and readings
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCw, ChevronLeft, ChevronRight, Eye, EyeOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

type SortMode = 'weak-first' | 'random' | 'algorithm';

export default function KanjiPracticePage() {
  const [kanjiList, setKanjiList] = useState<KanjiCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Configuration state
  const [showConfig, setShowConfig] = useState(false);
  const [cardCount, setCardCount] = useState(10);
  const [jlptFilter, setJlptFilter] = useState<string>('All');
  const [sortMode, setSortMode] = useState<SortMode>('algorithm');
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const [hasDefaultSettings, setHasDefaultSettings] = useState(false);

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

        // Load default settings from localStorage
        const defaultSettings = localStorage.getItem('kanji-practice-defaults');
        const skipConfig = localStorage.getItem('kanji-practice-skip-config');

        if (defaultSettings) {
          const defaults = JSON.parse(defaultSettings);
          setCardCount(defaults.cardCount);
          setJlptFilter(defaults.jlptFilter);
          setSortMode(defaults.sortMode);
          setHasDefaultSettings(true);

          if (skipConfig === 'true') {
            setDontAskAgain(true);
          }
        }

        // Load saved config from session
        const savedConfig = sessionStorage.getItem('kanji-practice-config');
        if (savedConfig) {
          const config = JSON.parse(savedConfig);
          setCardCount(config.cardCount);
          setJlptFilter(config.jlptFilter);
          setSortMode(config.sortMode);
        }

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
          setShowConfig(false);
        } else {
          // New session - check if should skip config
          if (skipConfig === 'true' && defaultSettings) {
            // Auto-start with defaults
            const defaults = JSON.parse(defaultSettings);
            await autoStartWithDefaults(data.kanji, progressData, defaults);
            setShowConfig(false);
          } else {
            // Show config first
            setShowConfig(true);
          }
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

  const handleBackToList = () => {
    // Clear session state when going back to kanji list
    sessionStorage.removeItem('kanji-practice-order');
    sessionStorage.removeItem('kanji-practice-index');
    sessionStorage.removeItem('kanji-practice-config');
  };

  const applyFiltersAndSort = (allKanji: KanjiCard[], progressData: Record<string, CardProgress>, config: { cardCount: number; jlptFilter: string; sortMode: SortMode }) => {
    // Filter by JLPT level (or include all if 'All' selected)
    let filteredKanji = config.jlptFilter === 'All'
      ? allKanji
      : allKanji.filter((k: KanjiCard) => k.jlptLevel === config.jlptFilter);

    // Apply sorting
    let orderedKanji: KanjiCard[] = [];
    switch (config.sortMode) {
      case 'random':
        orderedKanji = [...filteredKanji].sort(() => Math.random() - 0.5);
        break;
      case 'weak-first':
        orderedKanji = [...filteredKanji].sort((a, b) => {
          const levelA = progressData[a.id]?.level || 0;
          const levelB = progressData[b.id]?.level || 0;
          return levelA - levelB; // Lower level = weaker = first
        });
        break;
      case 'algorithm':
      default:
        orderedKanji = sortByPriority(filteredKanji, progressData);
        break;
    }

    // Limit to card count
    return orderedKanji.slice(0, config.cardCount);
  };

  const autoStartWithDefaults = async (allKanji: KanjiCard[], progressData: Record<string, CardProgress>, defaults: any) => {
    const orderedKanji = applyFiltersAndSort(allKanji, progressData, defaults);

    // Save config and order to session
    sessionStorage.setItem('kanji-practice-config', JSON.stringify(defaults));
    sessionStorage.setItem('kanji-practice-order', JSON.stringify(orderedKanji.map(k => k.id)));

    setKanjiList(orderedKanji);
    setCurrentIndex(0);
  };

  const startPractice = async (saveAsDefault: boolean = false) => {
    try {
      const response = await fetch('/seed-data/kanji_n5.json');
      if (!response.ok) throw new Error('Failed to load');

      const data = await response.json();
      const progressData = progress;

      const config = { cardCount, jlptFilter, sortMode };
      const orderedKanji = applyFiltersAndSort(data.kanji, progressData, config);

      // Save config and order to session
      sessionStorage.setItem('kanji-practice-config', JSON.stringify(config));
      sessionStorage.setItem('kanji-practice-order', JSON.stringify(orderedKanji.map(k => k.id)));

      // Save as default if requested
      if (saveAsDefault) {
        localStorage.setItem('kanji-practice-defaults', JSON.stringify(config));
        setHasDefaultSettings(true);

        // Save "don't ask again" preference
        if (dontAskAgain) {
          localStorage.setItem('kanji-practice-skip-config', 'true');
        } else {
          localStorage.removeItem('kanji-practice-skip-config');
        }
      }

      setKanjiList(orderedKanji);
      setCurrentIndex(0);
      setShowConfig(false);
    } catch (err) {
      console.error('Error starting practice:', err);
    }
  };

  const currentKanji = kanjiList[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setShowRating(false);
    setSelectedRating(null);
    setCurrentIndex((prev) => (prev + 1) % kanjiList.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setShowRating(false);
    setSelectedRating(null);
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

    // Set selected rating visually
    setSelectedRating(level);

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

    // Don't auto-advance - let user navigate manually
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Don't trigger if config screen is showing
      if (showConfig) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case ' ':
          e.preventDefault();
          handleFlip();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentKanji, showConfig, handleNext, handlePrevious]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Show configuration screen
  if (showConfig) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/study/kanji" onClick={handleBackToList}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Kanji List
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configure Practice Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Number of Cards */}
            <div className="space-y-2">
              <Label htmlFor="cardCount">Number of Cards</Label>
              <Input
                id="cardCount"
                type="number"
                min="1"
                max="100"
                value={cardCount}
                onChange={(e) => setCardCount(parseInt(e.target.value) || 10)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                How many kanji do you want to practice? (1-100)
              </p>
            </div>

            {/* JLPT Level */}
            <div className="space-y-2">
              <Label>JLPT Level</Label>
              <div className="grid grid-cols-3 gap-2">
                {['All', 'N5', 'N4', 'N3', 'N2', 'N1'].map((level) => (
                  <Button
                    key={level}
                    variant={jlptFilter === level ? 'default' : 'outline'}
                    onClick={() => setJlptFilter(level)}
                    className={level === 'All' ? 'col-span-3' : ''}
                  >
                    {level}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently only N5 kanji are available. "All" includes all levels.
              </p>
            </div>

            {/* Sort Mode */}
            <div className="space-y-2">
              <Label>Card Order</Label>
              <div className="space-y-2">
                <Button
                  variant={sortMode === 'algorithm' ? 'default' : 'outline'}
                  onClick={() => setSortMode('algorithm')}
                  className={`w-full justify-start text-left h-auto py-3 ${
                    sortMode === 'algorithm' ? 'text-primary-foreground' : ''
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold text-base">Smart Algorithm (Recommended)</div>
                    <div className={`text-xs ${
                      sortMode === 'algorithm' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}>
                      Prioritizes cards you haven't seen, then by difficulty level and recency
                    </div>
                  </div>
                </Button>

                <Button
                  variant={sortMode === 'weak-first' ? 'default' : 'outline'}
                  onClick={() => setSortMode('weak-first')}
                  className={`w-full justify-start text-left h-auto py-3 ${
                    sortMode === 'weak-first' ? 'text-primary-foreground' : ''
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold text-base">Weakest First</div>
                    <div className={`text-xs ${
                      sortMode === 'weak-first' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}>
                      Shows cards with lowest memory level first
                    </div>
                  </div>
                </Button>

                <Button
                  variant={sortMode === 'random' ? 'default' : 'outline'}
                  onClick={() => setSortMode('random')}
                  className={`w-full justify-start text-left h-auto py-3 ${
                    sortMode === 'random' ? 'text-primary-foreground' : ''
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold text-base">Random</div>
                    <div className={`text-xs ${
                      sortMode === 'random' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}>
                      Completely random shuffle
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Don't Ask Again (only if default is set) */}
            {hasDefaultSettings && (
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <input
                  type="checkbox"
                  id="dontAskAgain"
                  checked={dontAskAgain}
                  onChange={(e) => setDontAskAgain(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="dontAskAgain" className="cursor-pointer text-sm">
                  Don't ask again - automatically start with default settings
                </Label>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => startPractice(false)}
                size="lg"
                variant="outline"
                className="flex-1"
              >
                Start Practice
              </Button>
              <Button
                onClick={() => startPractice(true)}
                size="lg"
                className="flex-1"
              >
                {hasDefaultSettings ? 'Update & Start' : 'Save as Default & Start'}
              </Button>
            </div>
          </CardContent>
        </Card>
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
        <Link href="/study/kanji" onClick={handleBackToList}>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Kanji List
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            {currentIndex + 1} / {kanjiList.length}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem('kanji-practice-order');
              sessionStorage.removeItem('kanji-practice-index');
              sessionStorage.removeItem('kanji-practice-config');
              setShowConfig(true);
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Reconfigure
          </Button>
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative">
        <Card className="h-[500px] flex items-center justify-center relative cursor-pointer" onClick={handleFlip}>
          {/* LM Circle Rating - Bottom Right (shown on both sides) */}
          <div
            className="absolute bottom-0 right-0 flex flex-col items-end gap-2 z-10 p-4 bg-gray-50/30 dark:bg-gray-900/30 rounded-tl-lg min-w-[240px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs text-muted-foreground font-medium whitespace-nowrap">Memory Level</div>
            <div className="flex gap-2 flex-shrink-0">
              {[0, 1, 2, 3, 5].map((level, index) => {
                const currentProgress = progress[currentKanji?.id];
                const hasBeenRated = currentProgress && currentProgress.reviewCount > 0;
                const currentLevel = currentProgress?.level || 0;
                const isAchieved = hasBeenRated && index < (currentLevel === 5 ? 5 : currentLevel + 1);

                return (
                  <button
                    key={level}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRating(level);
                    }}
                    className="group relative"
                    title={['Didn\'t know', 'Hard', 'Medium', 'Good', 'Perfect'][level === 5 ? 4 : level]}
                  >
                    <div className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                      selectedRating === level
                        ? 'bg-blue-500 border-blue-600 text-white'
                        : isAchieved
                        ? 'bg-green-500 border-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}>
                      <span className="text-[8px] font-medium">LM</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

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

                  {/* Readings - Flexible Width Blocks */}
                  <div className="flex gap-3 pt-4">
                    {(() => {
                      const onCount = currentKanji.onReadings.length || 0;
                      const kunCount = currentKanji.kunReadings.length || 0;
                      const total = onCount + kunCount;

                      // Calculate flex ratios (minimum 1 if has readings, 0 if none)
                      const onFlex = onCount > 0 ? Math.max(onCount, 1) : 0;
                      const kunFlex = kunCount > 0 ? Math.max(kunCount, 1) : 0;

                      // Calculate columns needed (2 per column, min 1)
                      const onCols = Math.ceil(onCount / 2);
                      const kunCols = Math.ceil(kunCount / 2);

                      return (
                        <>
                          {/* On-readings Block */}
                          {onCount > 0 && (
                            <div
                              className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 flex flex-col"
                              style={{ flex: onFlex }}
                            >
                              <h3 className="text-sm font-semibold mb-3">
                                音読み <span className="text-xs font-normal text-muted-foreground">(On)</span>
                              </h3>
                              <div className={`grid gap-2 flex-1 content-center`} style={{ gridTemplateColumns: `repeat(${onCols}, 1fr)` }}>
                                {currentKanji.onReadings.map((reading, i) => (
                                  <div key={i} className="text-2xl font-medium text-blue-900 dark:text-blue-100">
                                    {reading}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Kun-readings Block */}
                          {kunCount > 0 && (
                            <div
                              className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 flex flex-col"
                              style={{ flex: kunFlex }}
                            >
                              <h3 className="text-sm font-semibold mb-3">
                                訓読み <span className="text-xs font-normal text-muted-foreground">(Kun)</span>
                              </h3>
                              <div className={`grid gap-2 flex-1 content-center`} style={{ gridTemplateColumns: `repeat(${kunCols}, 1fr)` }}>
                                {currentKanji.kunReadings.map((reading, i) => (
                                  <div key={i} className="text-2xl font-medium text-green-900 dark:text-green-100">
                                    {reading}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* If both are empty, show placeholder */}
                          {onCount === 0 && kunCount === 0 && (
                            <div className="flex-1 p-4 rounded-lg border border-muted text-center text-muted-foreground">
                              No readings available
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Stroke count */}
                  <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
                    <span className="text-sm text-gray-400 dark:text-gray-600">
                      {currentKanji.strokeCount} strokes
                    </span>
                  </div>

                  {/* Rating hint */}
                  <div className="text-center pt-4 text-xs text-gray-400 dark:text-gray-600">
                    Click a circle below to rate your memory
                  </div>
                </div>
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
          className="gap-2 w-[140px]"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </Button>

        <Button
          variant="default"
          size="lg"
          onClick={handleFlip}
          className="gap-2 w-[180px] flex-shrink-0"
        >
          {isFlipped ? <EyeOff className="h-5 w-5 flex-shrink-0" /> : <Eye className="h-5 w-5 flex-shrink-0" />}
          <span>{isFlipped ? 'Hide' : 'Show'} Answer</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleNext}
          className="gap-2 w-[140px]"
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
