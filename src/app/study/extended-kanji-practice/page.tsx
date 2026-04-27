'use client';

/**
 * Extended Kanji — flashcard practice
 * Route: /study/extended-kanji-practice
 *
 * Uses public/seed-data/extended-kanji/kanji.json only. Progress stored in
 * localStorage under `extended-kanji-practice-progress` (separate from the
 * regular kanji practice).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardProgress, ExtendedKanji } from '@/types/extended-kanji';
import { READING_STYLES } from '@/lib/extended-kanji/readings';
import { useAuth } from '@/contexts/auth-context';
import { loadProgress, saveProgress } from '@/services/cloud-progress.service';
import { isDue } from '@/lib/extended-kanji/stats';

type SortMode = 'weak-first' | 'random' | 'teacher' | 'due' | 'stuck' | 'untouched';

const PROGRESS_KEY = 'extended-kanji-practice-progress';
const DEFAULTS_KEY = 'extended-kanji-practice-defaults';
const SKIP_KEY = 'extended-kanji-practice-skip-config';
const ORDER_KEY = 'extended-kanji-practice-order';
const INDEX_KEY = 'extended-kanji-practice-index';
const CONFIG_KEY = 'extended-kanji-practice-config';

export default function ExtendedKanjiPracticePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [allKanji, setAllKanji] = useState<ExtendedKanji[]>([]);
  const [order, setOrder] = useState<ExtendedKanji[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const [showConfig, setShowConfig] = useState(false);
  const [cardCount, setCardCount] = useState(10);
  const [sortMode, setSortMode] = useState<SortMode>('teacher');
  const [lessonFilter, setLessonFilter] = useState<string>('all');
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const [hasDefaults, setHasDefaults] = useState(false);

  // ─── Session summary tracking ─────────────────────────────────────────
  // Snapshot levels at session start; diff against current `progress` when
  // session ends to compute promotions/demotions/unchanged.
  const sessionStartLevelsRef = useRef<Record<string, number>>({});
  const sessionEndedRef = useRef(false);
  const [sessionSummary, setSessionSummary] = useState<{
    reviewed: number
    promoted: number
    demoted: number
    unchanged: number
    masteredNow: number
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/seed-data/extended-kanji/kanji.json');
        const data = await res.json();
        const kanji = data.kanji as ExtendedKanji[];
        setAllKanji(kanji);

        const progressData = await loadProgress<Record<string, CardProgress>>(
          user?.uid,
          PROGRESS_KEY,
          {},
        );
        setProgress(progressData);

        const savedDefaults = localStorage.getItem(DEFAULTS_KEY);
        const skipConfig = localStorage.getItem(SKIP_KEY) === 'true';
        if (savedDefaults) {
          const d = JSON.parse(savedDefaults);
          setCardCount(d.cardCount);
          setSortMode(d.sortMode);
          setLessonFilter(d.lessonFilter ?? 'all');
          setHasDefaults(true);
          if (skipConfig) setDontAskAgain(true);
        }

        const savedConfig = sessionStorage.getItem(CONFIG_KEY);
        const savedOrderJson = sessionStorage.getItem(ORDER_KEY);
        const savedIndex = sessionStorage.getItem(INDEX_KEY);

        // URL params (e.g. from the dashboard's quick actions) override
        // everything else and start a fresh session immediately.
        const urlSort = searchParams?.get('sort') as SortMode | null;
        const urlCount = searchParams?.get('count');
        const urlLesson = searchParams?.get('lesson');
        if (urlSort) {
          const cfg = {
            cardCount: urlCount ? parseInt(urlCount, 10) || 10 : 10,
            sortMode: urlSort,
            lessonFilter: urlLesson ?? 'all',
          };
          setCardCount(cfg.cardCount);
          setSortMode(cfg.sortMode);
          setLessonFilter(cfg.lessonFilter);
          const pick = buildOrder(kanji, progressData, cfg);
          // Snapshot levels at session start for the end-of-session summary.
          sessionStartLevelsRef.current = Object.fromEntries(
            pick.map((k) => [k.id, progressData[k.id]?.level ?? 0]),
          );
          sessionStorage.setItem(ORDER_KEY, JSON.stringify(pick.map((k) => k.id)));
          sessionStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
          sessionStorage.removeItem(INDEX_KEY);
          setIndex(0);
          setOrder(pick);
          setShowConfig(false);
        } else if (savedOrderJson) {
          const ids: string[] = JSON.parse(savedOrderJson);
          const restored = ids.map((id) => kanji.find((k) => k.id === id)).filter(Boolean) as ExtendedKanji[];
          setOrder(restored);
          if (savedIndex) setIndex(parseInt(savedIndex, 10) || 0);
          // Re-snapshot from current progress so summary still works on reload.
          sessionStartLevelsRef.current = Object.fromEntries(
            restored.map((k) => [k.id, progressData[k.id]?.level ?? 0]),
          );
          setShowConfig(false);
        } else if (savedDefaults && skipConfig) {
          const d = JSON.parse(savedDefaults);
          const pick = buildOrder(kanji, progressData, d);
          sessionStorage.setItem(ORDER_KEY, JSON.stringify(pick.map((k) => k.id)));
          sessionStorage.setItem(CONFIG_KEY, JSON.stringify(d));
          setOrder(pick);
          setShowConfig(false);
        } else {
          if (savedConfig) {
            const c = JSON.parse(savedConfig);
            setCardCount(c.cardCount);
            setSortMode(c.sortMode);
            setLessonFilter(c.lessonFilter ?? 'all');
          }
          setShowConfig(true);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.uid]);

  useEffect(() => {
    if (order.length > 0) sessionStorage.setItem(INDEX_KEY, index.toString());
  }, [index, order.length]);

  const buildOrder = (
    kanji: ExtendedKanji[],
    progressData: Record<string, CardProgress>,
    cfg: { cardCount: number; sortMode: SortMode; lessonFilter: string },
  ) => {
    let pool = kanji;
    if (cfg.lessonFilter !== 'all') {
      const n = parseInt(cfg.lessonFilter, 10);
      pool = pool.filter((k) => k.lessonNumber === n);
    }
    let sorted: ExtendedKanji[];
    switch (cfg.sortMode) {
      case 'random':
        sorted = [...pool].sort(() => Math.random() - 0.5);
        break;
      case 'weak-first':
        sorted = [...pool].sort((a, b) => {
          const la = progressData[a.id]?.level ?? 0;
          const lb = progressData[b.id]?.level ?? 0;
          if (la !== lb) return la - lb;
          const ta = progressData[a.id]?.lastSeen ?? 0;
          const tb = progressData[b.id]?.lastSeen ?? 0;
          return ta - tb;
        });
        break;
      case 'due':
        // Cards that are past their next-review interval. Oldest-overdue first.
        sorted = pool
          .filter((k) => isDue(progressData[k.id]))
          .sort((a, b) => (progressData[a.id]?.lastSeen ?? 0) - (progressData[b.id]?.lastSeen ?? 0));
        break;
      case 'stuck':
        // Reviewed 3+ times but still at L0/L1. Highest-review-count first
        // so the most-attempted-but-still-failing cards get attention first.
        sorted = pool
          .filter((k) => {
            const p = progressData[k.id];
            return !!p && p.reviewCount >= 3 && p.level <= 1;
          })
          .sort((a, b) => {
            const pa = progressData[a.id]!;
            const pb = progressData[b.id]!;
            if (pa.level !== pb.level) return pa.level - pb.level;
            return pb.reviewCount - pa.reviewCount;
          });
        break;
      case 'untouched':
        // Never rated. Teacher order so they appear in lesson sequence.
        sorted = pool
          .filter((k) => !progressData[k.id] || progressData[k.id].reviewCount === 0)
          .sort((a, b) => a.orderInReference - b.orderInReference);
        break;
      default:
        sorted = [...pool].sort((a, b) => a.orderInReference - b.orderInReference);
    }
    return sorted.slice(0, cfg.cardCount);
  };

  const lessonOptions = Array.from(
    new Set(allKanji.map((k) => k.lessonNumber).filter((n): n is number => n !== null)),
  ).sort((a, b) => a - b);

  const startPractice = async (saveAsDefault: boolean) => {
    const cfg = { cardCount, sortMode, lessonFilter };
    const pick = buildOrder(allKanji, progress, cfg);
    sessionStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(pick.map((k) => k.id)));
    sessionStorage.removeItem(INDEX_KEY);
    if (saveAsDefault) {
      localStorage.setItem(DEFAULTS_KEY, JSON.stringify(cfg));
      setHasDefaults(true);
      if (dontAskAgain) localStorage.setItem(SKIP_KEY, 'true');
      else localStorage.removeItem(SKIP_KEY);
    }
    // Snapshot for session summary.
    sessionStartLevelsRef.current = Object.fromEntries(
      pick.map((k) => [k.id, progress[k.id]?.level ?? 0]),
    );
    sessionEndedRef.current = false;
    setSessionSummary(null);
    setOrder(pick);
    setIndex(0);
    setFlipped(false);
    setSelectedRating(null);
    setShowConfig(false);
  };

  const current = order[index];

  const handleNext = useCallback(() => {
    setFlipped(false);
    setSelectedRating(null);
    setIndex((prev) => {
      const nextIdx = prev + 1;
      // Reaching the end → trigger session summary (once per session).
      if (nextIdx >= order.length && order.length > 0 && !sessionEndedRef.current) {
        sessionEndedRef.current = true;
        const summary = { reviewed: 0, promoted: 0, demoted: 0, unchanged: 0, masteredNow: 0 };
        for (const k of order) {
          const startLvl = sessionStartLevelsRef.current[k.id] ?? 0;
          const endProg = progress[k.id];
          if (!endProg) continue;
          summary.reviewed++;
          if (endProg.level > startLvl) summary.promoted++;
          else if (endProg.level < startLvl) summary.demoted++;
          else summary.unchanged++;
          if (endProg.level === 5 && startLvl !== 5) summary.masteredNow++;
        }
        setSessionSummary(summary);
        return prev; // stay on last card behind the modal
      }
      return nextIdx % Math.max(order.length, 1);
    });
  }, [order, progress]);

  const handlePrev = useCallback(() => {
    setFlipped(false);
    setSelectedRating(null);
    setIndex((prev) => (prev - 1 + Math.max(order.length, 1)) % Math.max(order.length, 1));
  }, [order.length]);

  const handleFlip = () => setFlipped((f) => !f);

  const handleRate = (level: number) => {
    if (!current) return;
    setSelectedRating(level);
    const next: Record<string, CardProgress> = {
      ...progress,
      [current.id]: {
        kanjiId: current.id,
        level,
        lastSeen: Date.now(),
        reviewCount: (progress[current.id]?.reviewCount ?? 0) + 1,
      },
    };
    setProgress(next);
    saveProgress(user?.uid, PROGRESS_KEY, next);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (showConfig) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleFlip();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showConfig, handleNext, handlePrev]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (showConfig) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/study/extended-kanji">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Extended Kanji
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configure practice session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cardCount">Number of cards</Label>
              <Input
                id="cardCount"
                type="number"
                min={1}
                max={allKanji.length}
                value={cardCount}
                onChange={(e) => setCardCount(parseInt(e.target.value) || 10)}
              />
              <p className="text-xs text-muted-foreground">1–{allKanji.length}</p>
            </div>
            <div className="space-y-2">
              <Label>Lesson filter</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
                <Button
                  variant={lessonFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setLessonFilter('all')}
                  className="col-span-2 min-h-[44px]"
                >
                  All
                </Button>
                {lessonOptions.map((n) => (
                  <Button
                    key={n}
                    variant={lessonFilter === String(n) ? 'default' : 'outline'}
                    onClick={() => setLessonFilter(String(n))}
                    size="sm"
                    className="min-h-[44px]"
                  >
                    L{n}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Card order</Label>
              <div className="space-y-2">
                {(
                  [
                    ['teacher', 'Teacher order', 'Follows the lesson sequence from KANJI_REFERENCE.md'],
                    ['weak-first', 'Weakest first', 'Lowest memory level first; breaks ties by oldest last-seen'],
                    ['due', 'Due review', 'Cards past their next-review interval (oldest first)'],
                    ['stuck', 'Stuck cards', 'Reviewed 3+ times but still at L0/L1'],
                    ['untouched', 'Untouched', 'Never rated — pick up new ones in lesson order'],
                    ['random', 'Random', 'Shuffle every time'],
                  ] as const
                ).map(([mode, title, desc]) => (
                  <Button
                    key={mode}
                    variant={sortMode === mode ? 'default' : 'outline'}
                    onClick={() => setSortMode(mode)}
                    className="w-full justify-start text-left h-auto py-3"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="font-semibold text-base">{title}</div>
                      <div className="text-xs opacity-80">{desc}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            {hasDefaults && (
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <input
                  type="checkbox"
                  id="dontAskAgain"
                  checked={dontAskAgain}
                  onChange={(e) => setDontAskAgain(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="dontAskAgain" className="cursor-pointer text-sm">
                  Don't ask again — auto-start with defaults
                </Label>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={() => startPractice(false)} size="lg" variant="outline" className="flex-1">
                Start
              </Button>
              <Button onClick={() => startPractice(true)} size="lg" className="flex-1">
                {hasDefaults ? 'Update & Start' : 'Save as Default & Start'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-muted-foreground">No cards in queue.</p>
            <Button onClick={() => setShowConfig(true)}>Configure</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentProgress = progress[current.id];
  const hasBeenRated = currentProgress && currentProgress.reviewCount > 0;
  const currentLevel = currentProgress?.level ?? 0;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Session summary modal — appears when the queue is finished. */}
      {sessionSummary && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Session complete
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                You reviewed {sessionSummary.reviewed} of {order.length} cards.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border p-3 text-center">
                  <TrendingUp className="h-4 w-4 mx-auto text-emerald-500 mb-1" />
                  <div className="text-2xl font-bold tabular-nums">{sessionSummary.promoted}</div>
                  <div className="text-[10px] text-muted-foreground">Promoted</div>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <Minus className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <div className="text-2xl font-bold tabular-nums">{sessionSummary.unchanged}</div>
                  <div className="text-[10px] text-muted-foreground">Unchanged</div>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <TrendingDown className="h-4 w-4 mx-auto text-rose-500 mb-1" />
                  <div className="text-2xl font-bold tabular-nums">{sessionSummary.demoted}</div>
                  <div className="text-[10px] text-muted-foreground">Demoted</div>
                </div>
              </div>
              {sessionSummary.masteredNow > 0 && (
                <div className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300 text-center">
                  🎉 {sessionSummary.masteredNow}{' '}
                  {sessionSummary.masteredNow === 1 ? 'card' : 'cards'} reached mastered.
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSessionSummary(null);
                    sessionStorage.removeItem(ORDER_KEY);
                    sessionStorage.removeItem(INDEX_KEY);
                    sessionStorage.removeItem(CONFIG_KEY);
                    setOrder([]);
                    setIndex(0);
                    setShowConfig(true);
                  }}
                >
                  New session
                </Button>
                <Link href="/study/extended-kanji/progress">
                  <Button variant="default" className="w-full">
                    See progress
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link
          href="/study/extended-kanji"
          onClick={() => {
            sessionStorage.removeItem(ORDER_KEY);
            sessionStorage.removeItem(INDEX_KEY);
            sessionStorage.removeItem(CONFIG_KEY);
          }}
        >
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Extended Kanji
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">
            {index + 1} / {order.length}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem(ORDER_KEY);
              sessionStorage.removeItem(INDEX_KEY);
              sessionStorage.removeItem(CONFIG_KEY);
              setShowConfig(true);
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Reconfigure
          </Button>
        </div>
      </div>

      <div className="relative">
        <Card
          className="h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center relative cursor-pointer"
          onClick={handleFlip}
        >
          <div
            className="absolute bottom-0 right-0 flex flex-col items-end gap-2 z-10 p-4 bg-gray-50/30 dark:bg-gray-900/30 rounded-tl-lg min-w-[240px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs text-muted-foreground font-medium">Memory level</div>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 5].map((level, idx) => {
                const isAchieved =
                  hasBeenRated && idx < (currentLevel === 5 ? 5 : currentLevel + 1);
                return (
                  <button
                    key={level}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRate(level);
                    }}
                    className="group relative"
                    title={['Didn\'t know', 'Hard', 'Medium', 'Good', 'Perfect'][level === 5 ? 4 : level]}
                  >
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                        selectedRating === level
                          ? 'bg-blue-500 border-blue-600 text-white'
                          : isAchieved
                          ? 'bg-green-500 border-green-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <span className="text-[8px] font-medium">LM</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <CardContent className="pt-6 w-full">
            {!flipped ? (
              <div className="text-center space-y-6">
                <div className="text-9xl font-bold mb-8">{current.kanji}</div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">Click to reveal</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-4">{current.kanji}</div>
                  {current.lessonNumber && (
                    <Badge variant="outline">
                      Lesson {current.lessonNumber} · {current.lessonDate}
                    </Badge>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">MEANING</h3>
                  <div className="text-2xl font-medium">{current.meaning}</div>
                </div>

                <div className="flex gap-3 pt-4">
                  {current.onReadings.length > 0 && (
                    <div className={`flex-1 p-4 rounded-lg border ${READING_STYLES.on.bg} ${READING_STYLES.on.border}`}>
                      <h3 className="text-sm font-semibold mb-3">
                        音読み <span className="text-xs font-normal text-muted-foreground">({READING_STYLES.on.label})</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {current.onReadings.map((r, i) => (
                          <span key={i} className={`text-xl font-medium ${READING_STYLES.on.text}`}>
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {current.kunReadings.length > 0 && (
                    <div className={`flex-1 p-4 rounded-lg border ${READING_STYLES.kun.bg} ${READING_STYLES.kun.border}`}>
                      <h3 className="text-sm font-semibold mb-3">
                        訓読み <span className="text-xs font-normal text-muted-foreground">({READING_STYLES.kun.label})</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {current.kunReadings.map((r, i) => (
                          <span key={i} className={`text-xl font-medium ${READING_STYLES.kun.text}`}>
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {current.vocabulary.length > 0 && (
                  <div className="text-center pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      {current.vocabulary.length} vocab · {current.exampleSentences.length} sentences
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <Link href={`/study/extended-kanji/${encodeURIComponent(current.id)}`}>
            <Button variant="link" className="text-sm">
              View full details →
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-md mx-auto">
        <Button variant="outline" size="lg" onClick={handlePrev} className="gap-2 flex-1">
          <ChevronLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>
        <Button variant="default" size="lg" onClick={handleFlip} className="gap-2 flex-1">
          {flipped ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          <span className="hidden sm:inline">{flipped ? 'Hide' : 'Show'} Answer</span>
          <span className="sm:hidden">{flipped ? 'Hide' : 'Show'}</span>
        </Button>
        <Button variant="outline" size="lg" onClick={handleNext} className="gap-2 flex-1">
          <span>Next</span>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${((index + 1) / order.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
