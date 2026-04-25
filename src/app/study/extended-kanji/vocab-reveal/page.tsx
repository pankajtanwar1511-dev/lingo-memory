'use client';

/**
 * Extended Kanji — big-typography vocabulary reveal practice
 * Route: /study/extended-kanji/vocab-reveal
 *
 * Flow:
 *   [word]  →  Right: reveal kana below  →  Right: next word  →  …
 *
 * Keys:
 *   →  advance (reveal, or if already revealed, go to next word)
 *   ←  previous word
 *   Space  toggle reveal without advancing
 *   M   toggle meaning
 *   R   reshuffle (random mode only)
 *   S   flip Sequential ↔ Random
 *
 * Settings persist to sessionStorage so Back/Forward keeps your spot.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Shuffle,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ExtendedKanji, MergedVocabRow } from '@/types/extended-kanji';
import {
  READING_STYLES,
  classifyReading,
  readingTypeStyle,
  type ReadingType,
} from '@/lib/extended-kanji/readings';
import { ColoredWord } from '@/components/extended-kanji/colored-word';

type Mode = 'sequential' | 'random';

const CFG_KEY = 'extended-kanji-vocab-reveal-config';
const IDX_KEY = 'extended-kanji-vocab-reveal-index';
const ORDER_KEY = 'extended-kanji-vocab-reveal-order';

export default function VocabRevealPage() {
  const [vocab, setVocab] = useState<MergedVocabRow[]>([]);
  const [kanjiByChar, setKanjiByChar] = useState<Record<string, ExtendedKanji>>({});
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<Mode>('sequential');
  const [themeFilter, setThemeFilter] = useState<string>('all');
  const [parentFilter, setParentFilter] = useState<string>('all');
  const [usageFilter, setUsageFilter] = useState<'all' | 'on' | 'kun' | 'mixed' | 'unknown'>('all');
  const [cardLimit, setCardLimit] = useState<number>(0); // 0 = no limit

  const [order, setOrder] = useState<MergedVocabRow[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showMeaning, setShowMeaning] = useState(true);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    (async () => {
      const [vRes, kRes] = await Promise.all([
        fetch('/seed-data/extended-kanji/vocabulary.json'),
        fetch('/seed-data/extended-kanji/kanji.json'),
      ]);
      const vData = await vRes.json();
      const kData = await kRes.json();
      setVocab(vData.vocabulary as MergedVocabRow[]);
      const byChar: Record<string, ExtendedKanji> = {};
      (kData.kanji as ExtendedKanji[]).forEach((k) => (byChar[k.kanji] = k));
      setKanjiByChar(byChar);

      const savedCfg = sessionStorage.getItem(CFG_KEY);
      if (savedCfg) {
        const c = JSON.parse(savedCfg);
        setMode(c.mode ?? 'sequential');
        setThemeFilter(c.themeFilter ?? 'all');
        setParentFilter(c.parentFilter ?? 'all');
        setUsageFilter(c.usageFilter ?? 'all');
        setCardLimit(c.cardLimit ?? 0);
      }
      const savedIdx = sessionStorage.getItem(IDX_KEY);
      if (savedIdx) setIndex(parseInt(savedIdx, 10) || 0);
      setLoading(false);
    })();
  }, []);

  const allThemes = useMemo(() => {
    const s = new Set<string>();
    vocab.forEach((v) => v.themes.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [vocab]);

  const allParents = useMemo(() => {
    const s = new Set<string>();
    vocab.forEach((v) => v.parentKanji.forEach((p) => s.add(p)));
    return Array.from(s).sort();
  }, [vocab]);

  const classifyRow = useCallback(
    (v: MergedVocabRow): ReadingType => {
      const parent = v.parentKanji.find((p) => kanjiByChar[p]);
      if (!parent) return 'unknown';
      return classifyReading(v.reading, kanjiByChar[parent]);
    },
    [kanjiByChar],
  );

  /** Rebuild the practice queue whenever filters/mode change. */
  const rebuild = useCallback(
    (opts?: { resetIndex?: boolean }) => {
      let pool = vocab;
      if (themeFilter !== 'all') pool = pool.filter((v) => v.themes.includes(themeFilter));
      if (parentFilter !== 'all') pool = pool.filter((v) => v.parentKanji.includes(parentFilter));
      if (usageFilter !== 'all') pool = pool.filter((v) => classifyRow(v) === usageFilter);

      let next = [...pool];
      if (mode === 'random') {
        // Fisher-Yates shuffle
        for (let i = next.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [next[i], next[j]] = [next[j], next[i]];
        }
      }
      if (cardLimit > 0) next = next.slice(0, cardLimit);
      setOrder(next);
      if (opts?.resetIndex) {
        setIndex(0);
        setRevealed(false);
      }
      sessionStorage.setItem(
        ORDER_KEY,
        JSON.stringify(next.map((v) => `${v.word}|${v.reading}`)),
      );
      sessionStorage.setItem(
        CFG_KEY,
        JSON.stringify({ mode, themeFilter, parentFilter, usageFilter, cardLimit }),
      );
    },
    [vocab, themeFilter, parentFilter, usageFilter, mode, cardLimit, classifyRow],
  );

  // Initial order build once data is loaded.
  useEffect(() => {
    if (!loading && vocab.length > 0 && order.length === 0) {
      rebuild({ resetIndex: true });
    }
  }, [loading, vocab, order.length, rebuild]);

  useEffect(() => {
    if (order.length > 0) sessionStorage.setItem(IDX_KEY, String(index));
  }, [index, order.length]);

  const current = order[index];

  const next = useCallback(() => {
    setRevealed(false);
    setIndex((i) => (order.length === 0 ? 0 : (i + 1) % order.length));
  }, [order.length]);

  /** Left-arrow acts as true "undo": mirror the right-arrow stages in reverse.
   *
   *  Right sequence:  [word] → [word + kana] → [next word] → [next word + kana]…
   *  Left sequence:   …[next word + kana] → [next word] → [word + kana] → [word]
   *
   *  So if kana is currently revealed → hide it (undo the reveal).
   *  If kana is hidden → step back one word AND re-show its kana (undo the advance).
   */
  const prev = useCallback(() => {
    if (revealed) {
      setRevealed(false);
    } else if (order.length > 0) {
      setIndex((i) => (i - 1 + order.length) % order.length);
      setRevealed(true);
    }
  }, [revealed, order.length]);

  const advance = useCallback(() => {
    if (!revealed) setRevealed(true);
    else next();
  }, [revealed, next]);

  const reshuffle = useCallback(() => {
    rebuild({ resetIndex: true });
  }, [rebuild]);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === 'sequential' ? 'random' : 'sequential'));
  }, []);

  // Rebuild when mode or filters change
  useEffect(() => {
    if (!loading && vocab.length > 0) {
      rebuild({ resetIndex: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, themeFilter, parentFilter, usageFilter, cardLimit]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) return;
      if (showConfig) return;
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          advance();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case ' ':
          e.preventDefault();
          setRevealed((r) => !r);
          break;
        case 'm':
        case 'M':
          setShowMeaning((m) => !m);
          break;
        case 'r':
        case 'R':
          if (mode === 'random') reshuffle();
          break;
        case 's':
        case 'S':
          toggleMode();
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [advance, prev, reshuffle, toggleMode, mode, showConfig]);

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (showConfig) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2" onClick={() => setShowConfig(false)}>
            <ArrowLeft className="h-4 w-4" />
            Back to practice
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configure practice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Mode</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={mode === 'sequential' ? 'default' : 'outline'}
                  onClick={() => setMode('sequential')}
                >
                  Sequential
                </Button>
                <Button
                  variant={mode === 'random' ? 'default' : 'outline'}
                  onClick={() => setMode('random')}
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Random
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Press <kbd className="px-1 py-0.5 rounded bg-muted">S</kbd> during practice to switch modes.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={themeFilter} onChange={(e) => setThemeFilter(e.target.value)}>
                <option value="all">All themes</option>
                {allThemes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Parent kanji</Label>
              <Select value={parentFilter} onChange={(e) => setParentFilter(e.target.value)}>
                <option value="all">Any</option>
                {allParents.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reading usage</Label>
              <div className="grid grid-cols-5 gap-2">
                {(['all', 'on', 'kun', 'mixed', 'unknown'] as const).map((u) => (
                  <Button
                    key={u}
                    variant={usageFilter === u ? 'default' : 'outline'}
                    onClick={() => setUsageFilter(u)}
                    size="sm"
                  >
                    {u === 'all' ? 'All' : u === 'on' ? '音' : u === 'kun' ? '訓' : u === 'mixed' ? 'Mix' : '—'}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit">Card limit (0 = no limit)</Label>
              <Input
                id="limit"
                type="number"
                min={0}
                max={vocab.length}
                value={cardLimit}
                onChange={(e) => setCardLimit(parseInt(e.target.value) || 0)}
              />
            </div>
            <Button onClick={() => setShowConfig(false)} className="w-full" size="lg">
              Start practice · {order.length} card{order.length !== 1 ? 's' : ''}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (order.length === 0) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-muted-foreground">No vocabulary matches your filters.</p>
            <Button onClick={() => setShowConfig(true)}>Open filters</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const type = classifyRow(current);
  const typeStyle = readingTypeStyle(type);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 space-y-6 min-h-screen">
      {/* Top bar — wraps to a second row on phones, single row on tablet+ */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href="/study/extended-kanji/vocabulary">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Exit
          </Button>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {index + 1} / {order.length}
          </Badge>
          <Button
            variant={mode === 'random' ? 'default' : 'outline'}
            size="sm"
            onClick={toggleMode}
            title="Press S"
          >
            {mode === 'random' ? (
              <>
                <Shuffle className="h-4 w-4 mr-1.5" />
                Random
              </>
            ) : (
              'Sequential'
            )}
          </Button>
          {mode === 'random' && (
            <Button variant="outline" size="sm" onClick={reshuffle} title="Press R">
              <Shuffle className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Reshuffle</span>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowConfig(true)}>
            <Settings className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
      </div>

      {/* Active filter chips */}
      {(themeFilter !== 'all' ||
        parentFilter !== 'all' ||
        usageFilter !== 'all' ||
        cardLimit > 0) && (
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {themeFilter !== 'all' && <Badge variant="outline">Theme: {themeFilter}</Badge>}
          {parentFilter !== 'all' && <Badge variant="outline">Parent: {parentFilter}</Badge>}
          {usageFilter !== 'all' && <Badge variant="outline">Usage: {usageFilter}</Badge>}
          {cardLimit > 0 && <Badge variant="outline">Limit: {cardLimit}</Badge>}
        </div>
      )}

      {/* Stage */}
      <Card
        className="min-h-[68vh] flex items-center justify-center relative cursor-pointer select-none border-0 shadow-sm bg-gradient-to-b from-background to-muted/30"
        onClick={() => (revealed ? next() : setRevealed(true))}
      >
        {/* Tiny usage badge — muted, corner */}
        {(type === 'on' || type === 'kun') && (
          <div className="absolute top-4 left-4 opacity-60">
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${READING_STYLES[type].chip}`}>
              {READING_STYLES[type].label}
            </span>
          </div>
        )}

        <CardContent className="py-16 w-full flex flex-col items-center">
          {/* Word — calmer size, tight tracking */}
          <div className="text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[1] tracking-tight">
            <ColoredWord
              word={current.word}
              reading={current.reading}
              kanjiByChar={kanjiByChar}
            />
          </div>

          {/* Reserved reveal slot — always takes the same vertical space so the
            word never jumps when kana fades in. Kana and meaning inherit a
            soft neutral tone instead of saturated on/kun color. */}
          <div className="mt-12 h-[7.5rem] w-full flex flex-col items-center">
            <div
              className={`text-center transition-opacity duration-300 ease-out ${
                revealed ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden={!revealed}
            >
              <div className="text-[clamp(1.5rem,4.5vw,3rem)] font-normal leading-tight text-foreground/70">
                {current.reading}
              </div>
              {showMeaning && (
                <div className="mt-3 text-[clamp(0.875rem,1.6vw,1.125rem)] text-muted-foreground/80 italic">
                  {current.meaning}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nav */}
      <div className="flex items-center justify-center gap-4 max-w-xl mx-auto">
        <Button variant="outline" size="lg" onClick={prev} className="gap-2 flex-1">
          <ChevronLeft className="h-5 w-5" />
          Prev
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={advance}
          className="gap-2 flex-[2]"
        >
          {revealed ? (
            <>
              Next <ChevronRight className="h-5 w-5" />
            </>
          ) : (
            <>
              <Eye className="h-5 w-5" /> Reveal kana
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowMeaning((m) => !m)}
          className="gap-2 flex-1"
          title="Press M"
        >
          {showMeaning ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          Meaning
        </Button>
      </div>

      {/* Progress */}
      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full transition-all"
          style={{ width: `${((index + 1) / order.length) * 100}%` }}
        />
      </div>

      {/* Keyboard legend — desktop only (hidden on phones where there's no keyboard) */}
      <div className="hidden md:flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
        <span><kbd className="px-1.5 py-0.5 rounded bg-muted">→</kbd> advance / reveal</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-muted">←</kbd> previous</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-muted">Space</kbd> toggle reveal</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-muted">M</kbd> meaning</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-muted">S</kbd> seq↔random</span>
        {mode === 'random' && <span><kbd className="px-1.5 py-0.5 rounded bg-muted">R</kbd> reshuffle</span>}
      </div>
      {/* Mobile hint — replaces keyboard legend on phones */}
      <p className="md:hidden text-center text-xs text-muted-foreground">
        Tap the card or the buttons below
      </p>
    </div>
  );
}
