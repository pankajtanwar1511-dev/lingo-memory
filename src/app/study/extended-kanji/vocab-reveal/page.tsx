'use client';

/**
 * Extended Kanji — full-screen vocabulary drill
 * Route: /study/extended-kanji/vocab-reveal
 *
 * UX (no visible nav, no shown keys):
 *   • Tap LEFT half  → previous word
 *   • Tap RIGHT half → next word
 *   • Hold (long-press / mouse-down) → reveal English meaning while held
 *   • Tiny X (top-left) exits, gear (top-right) opens filters, shuffle in middle
 *   • Thin progress bar at the very top edge
 *
 * Keyboard shortcuts still work silently for desktop power users:
 *   →/Space = next · ← = previous · S = mode · R = reshuffle · Esc = exit
 *
 * Settings (mode / theme / parent / usage / card limit) live behind the gear
 * icon and persist via sessionStorage. On open, the drill goes straight to
 * full-screen with the user's saved defaults — config is never required.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Maximize2, Settings, Shuffle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
type UsageFilter = 'all' | 'on' | 'kun' | 'mixed' | 'unknown';

const CFG_KEY = 'extended-kanji-vocab-reveal-config';
const IDX_KEY = 'extended-kanji-vocab-reveal-index';
const ORDER_KEY = 'extended-kanji-vocab-reveal-order';
const HELP_DISMISSED_KEY = 'extended-kanji-vocab-reveal-help-dismissed';

const HOLD_THRESHOLD_MS = 280; // tap vs hold

interface QueueConfig {
  mode: Mode;
  themeFilter: string;
  parentFilter: string;
  usageFilter: UsageFilter;
  cardLimit: number;
}

function buildQueue(
  rows: MergedVocabRow[],
  byChar: Record<string, ExtendedKanji>,
  cfg: QueueConfig,
): MergedVocabRow[] {
  let pool = rows;
  if (cfg.themeFilter !== 'all')
    pool = pool.filter((v) => v.themes.includes(cfg.themeFilter));
  if (cfg.parentFilter !== 'all')
    pool = pool.filter((v) => v.parentKanji.includes(cfg.parentFilter));
  if (cfg.usageFilter !== 'all') {
    pool = pool.filter((v) => {
      const parent = v.parentKanji.find((p) => byChar[p]);
      if (!parent) return cfg.usageFilter === 'unknown';
      return classifyReading(v.reading, byChar[parent]) === cfg.usageFilter;
    });
  }
  let next = [...pool];
  if (cfg.mode === 'random') {
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
  }
  if (cfg.cardLimit > 0) next = next.slice(0, cfg.cardLimit);
  return next;
}

export default function VocabRevealPage() {
  const router = useRouter();

  const [vocab, setVocab] = useState<MergedVocabRow[]>([]);
  const [kanjiByChar, setKanjiByChar] = useState<Record<string, ExtendedKanji>>({});
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<Mode>('sequential');
  const [themeFilter, setThemeFilter] = useState<string>('all');
  const [parentFilter, setParentFilter] = useState<string>('all');
  const [usageFilter, setUsageFilter] = useState<UsageFilter>('all');
  const [cardLimit, setCardLimit] = useState<number>(0);

  const [order, setOrder] = useState<MergedVocabRow[]>([]);
  const [index, setIndex] = useState(0);
  const [holding, setHolding] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const [showConfig, setShowConfig] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasHeldRef = useRef(false);
  const downXRef = useRef<number | null>(null);

  // Initial data + queue restore
  useEffect(() => {
    (async () => {
      const [vRes, kRes] = await Promise.all([
        fetch('/seed-data/extended-kanji/vocabulary.json'),
        fetch('/seed-data/extended-kanji/kanji.json'),
      ]);
      const vData = await vRes.json();
      const kData = await kRes.json();
      const vocabRows = vData.vocabulary as MergedVocabRow[];
      setVocab(vocabRows);
      const byChar: Record<string, ExtendedKanji> = {};
      (kData.kanji as ExtendedKanji[]).forEach((k) => (byChar[k.kanji] = k));
      setKanjiByChar(byChar);

      const savedCfg = sessionStorage.getItem(CFG_KEY);
      const cfg: QueueConfig = {
        mode: 'sequential',
        themeFilter: 'all',
        parentFilter: 'all',
        usageFilter: 'all',
        cardLimit: 0,
        ...(savedCfg ? JSON.parse(savedCfg) : {}),
      };
      setMode(cfg.mode);
      setThemeFilter(cfg.themeFilter);
      setParentFilter(cfg.parentFilter);
      setUsageFilter(cfg.usageFilter);
      setCardLimit(cfg.cardLimit);

      const savedOrder = sessionStorage.getItem(ORDER_KEY);
      let resolved: MergedVocabRow[] = [];
      if (savedOrder) {
        try {
          const ids: string[] = JSON.parse(savedOrder);
          resolved = ids
            .map((id) => vocabRows.find((v) => `${v.word}|${v.reading}` === id))
            .filter(Boolean) as MergedVocabRow[];
        } catch {
          resolved = [];
        }
      }
      if (resolved.length === 0) {
        resolved = buildQueue(vocabRows, byChar, cfg);
        sessionStorage.setItem(
          ORDER_KEY,
          JSON.stringify(resolved.map((v) => `${v.word}|${v.reading}`)),
        );
      }
      setOrder(resolved);
      const savedIdx = sessionStorage.getItem(IDX_KEY);
      if (savedIdx) setIndex(Math.min(parseInt(savedIdx, 10) || 0, resolved.length - 1));

      setLoading(false);
      // Help overlay only shows when entering full-screen (handled in enterFullscreen)
    })();
  }, []);

  const enterFullscreen = useCallback(() => {
    setRevealed(false);
    setFullscreen(true);
    if (!localStorage.getItem(HELP_DISMISSED_KEY)) setShowHelp(true);
    try {
      document.documentElement.requestFullscreen?.().catch(() => undefined);
    } catch {
      /* no-op */
    }
  }, []);

  const leaveFullscreen = useCallback(() => {
    setFullscreen(false);
    setHolding(false);
    try {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => undefined);
    } catch {
      /* no-op */
    }
  }, []);

  const classifyRow = useCallback(
    (v: MergedVocabRow): ReadingType => {
      const parent = v.parentKanji.find((p) => kanjiByChar[p]);
      if (!parent) return 'unknown';
      return classifyReading(v.reading, kanjiByChar[parent]);
    },
    [kanjiByChar],
  );

  const allThemes = Array.from(new Set(vocab.flatMap((v) => v.themes))).sort();
  const allParents = Array.from(new Set(vocab.flatMap((v) => v.parentKanji))).sort();

  useEffect(() => {
    if (order.length > 0) sessionStorage.setItem(IDX_KEY, String(index));
  }, [index, order.length]);

  const current = order[index];

  /**
   * Next-tap behavior: two-stage advance.
   *   1st tap on a word  → reveal its kana reading
   *   2nd tap            → move to the next word (kana hidden again)
   *
   * Previous-tap is the exact inverse — it walks back through the same
   * states, so left-tap on a revealed word hides the kana, and left-tap
   * on a hidden word steps back to the previous word with its kana
   * already revealed (since that's where the user came from).
   */
  const next = useCallback(() => {
    if (order.length === 0) return;
    if (!revealed) {
      setRevealed(true);
    } else {
      setIndex((i) => (i + 1) % order.length);
      setRevealed(false);
    }
  }, [order.length, revealed]);

  const prev = useCallback(() => {
    if (order.length === 0) return;
    if (revealed) {
      setRevealed(false);
    } else {
      setIndex((i) => (i - 1 + order.length) % order.length);
      setRevealed(true);
    }
  }, [order.length, revealed]);

  const reshuffle = useCallback(() => {
    if (vocab.length === 0) return;
    const built = buildQueue(vocab, kanjiByChar, {
      mode: 'random',
      themeFilter,
      parentFilter,
      usageFilter,
      cardLimit,
    });
    setMode('random');
    setOrder(built);
    setIndex(0);
    setRevealed(false);
    sessionStorage.setItem(
      ORDER_KEY,
      JSON.stringify(built.map((v) => `${v.word}|${v.reading}`)),
    );
    sessionStorage.setItem(
      CFG_KEY,
      JSON.stringify({ mode: 'random', themeFilter, parentFilter, usageFilter, cardLimit }),
    );
  }, [vocab, kanjiByChar, themeFilter, parentFilter, usageFilter, cardLimit]);

  const applyConfigAndStart = useCallback(() => {
    const cfg: QueueConfig = { mode, themeFilter, parentFilter, usageFilter, cardLimit };
    sessionStorage.setItem(CFG_KEY, JSON.stringify(cfg));
    const built = buildQueue(vocab, kanjiByChar, cfg);
    setOrder(built);
    setIndex(0);
    setRevealed(false);
    sessionStorage.setItem(
      ORDER_KEY,
      JSON.stringify(built.map((v) => `${v.word}|${v.reading}`)),
    );
    setShowConfig(false);
  }, [mode, themeFilter, parentFilter, usageFilter, cardLimit, vocab, kanjiByChar]);

  const exitToLanding = useCallback(() => {
    leaveFullscreen();
  }, [leaveFullscreen]);

  const exitDrillEntirely = useCallback(() => {
    sessionStorage.removeItem(ORDER_KEY);
    sessionStorage.removeItem(IDX_KEY);
    router.push('/study/extended-kanji/vocabulary');
  }, [router]);

  const dismissHelp = useCallback(() => {
    setShowHelp(false);
    localStorage.setItem(HELP_DISMISSED_KEY, '1');
  }, []);

  // Keyboard — active in BOTH compact and fullscreen drill modes (silent: no UI hint).
  // Touch + keyboard coexist — keyboard is just an accelerator for desktop users.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) return;
      if (showConfig) return;
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          if (showHelp) dismissHelp();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (showHelp) dismissHelp();
          prev();
          break;
        case 'Escape':
          if (showHelp) dismissHelp();
          else if (fullscreen) leaveFullscreen();
          else router.push('/study/extended-kanji/vocabulary');
          break;
        case 's':
        case 'S':
          setMode((m) => (m === 'sequential' ? 'random' : 'sequential'));
          break;
        case 'r':
        case 'R':
          reshuffle();
          break;
        case 'f':
        case 'F':
          if (fullscreen) leaveFullscreen();
          else enterFullscreen();
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, leaveFullscreen, enterFullscreen, reshuffle, showConfig, showHelp, dismissHelp, fullscreen, router]);

  // Pointer (tap vs hold)
  const onPointerDown = (e: React.PointerEvent) => {
    if (showConfig) return;
    e.preventDefault();
    wasHeldRef.current = false;
    downXRef.current = e.clientX;
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      wasHeldRef.current = true;
      setHolding(true);
    }, HOLD_THRESHOLD_MS);
  };

  const cancelTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (showConfig) return;
    cancelTimer();
    if (wasHeldRef.current) {
      setHolding(false);
      wasHeldRef.current = false;
      return;
    }
    if (showHelp) {
      dismissHelp();
      return;
    }
    const x = downXRef.current ?? e.clientX;
    const halfway = window.innerWidth / 2;
    if (x < halfway) prev();
    else next();
  };

  const onPointerCancel = () => {
    cancelTimer();
    setHolding(false);
    wasHeldRef.current = false;
  };

  // ---- Render ----
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (showConfig) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
        <div className="container max-w-3xl mx-auto px-4 py-6 space-y-5">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setShowConfig(false)}>
              Cancel
            </Button>
            <span className="text-sm text-muted-foreground">Filters</span>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
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
                    className="min-h-[44px]"
                  >
                    Sequential
                  </Button>
                  <Button
                    variant={mode === 'random' ? 'default' : 'outline'}
                    onClick={() => setMode('random')}
                    className="min-h-[44px]"
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Random
                  </Button>
                </div>
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
                      className="min-h-[44px]"
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
              <Button onClick={applyConfigAndStart} className="w-full min-h-[48px]" size="lg">
                Apply &amp; start
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/study/extended-kanji/vocabulary">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
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
  const progressPct = ((index + 1) / order.length) * 100;

  // Compact (quick-view) drill — the page IS the drill at a calm card size.
  // Same gestures as fullscreen: tap left half, tap right half, press & hold.
  // A tiny Maximize button in the card corner is the only fullscreen affordance.
  if (!fullscreen) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/study/extended-kanji/vocabulary">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground tabular-nums px-1">
              {index + 1} / {order.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={reshuffle}
              className="h-9 w-9 p-0"
              title="Reshuffle"
              aria-label="Reshuffle"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfig(true)}
              className="h-9 w-9 p-0"
              title="Filters"
              aria-label="Filters"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card
          className="relative border-border/60 select-none touch-none cursor-pointer overflow-hidden"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Thin progress bar at top edge of the card */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Tiny fullscreen toggle */}
          <button
            type="button"
            onClick={enterFullscreen}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-card hover:bg-accent border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground transition"
            title="Full-screen"
            aria-label="Enter full-screen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          {(type === 'on' || type === 'kun') && (
            <div className="absolute top-3 left-3 z-10 opacity-60">
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${READING_STYLES[type].chip}`}
              >
                {READING_STYLES[type].label}
              </span>
            </div>
          )}

          <CardContent className="pt-32 sm:pt-40 pb-12 sm:pb-16 flex flex-col items-center gap-6">
            <div
              className="text-[clamp(3rem,9vw,6rem)] font-light leading-none text-center"
              style={{ fontFeatureSettings: '"palt", "kern"', letterSpacing: '0.06em' }}
            >
              <ColoredWord
                word={current.word}
                reading={current.reading}
                kanjiByChar={kanjiByChar}
              />
            </div>

            <div
              className={`text-[clamp(1rem,3vw,1.75rem)] font-light leading-tight tracking-wide text-center transition-opacity duration-200 ease-out ${
                revealed ? 'opacity-100' : 'opacity-0'
              } ${typeStyle ? typeStyle.text : 'text-muted-foreground'}`}
              aria-hidden={!revealed}
            >
              {current.reading}
            </div>

            <div
              className={`max-w-xl text-center transition-opacity duration-200 ease-out ${
                holding ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden={!holding}
            >
              <div className="text-[clamp(0.875rem,2vw,1.125rem)] font-light text-foreground/75 italic">
                {current.meaning}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Full-screen drill view
  return (
    <div
      className="fixed inset-0 z-50 bg-background select-none touch-none overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Thin top progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted z-10">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Tiny corner controls — bumped to 44×44 for proper touch targets */}
      <div className="absolute top-3 left-3 z-20" onPointerDown={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={leaveFullscreen}
          className="h-11 w-11 rounded-full bg-card/70 hover:bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition"
          title="Exit full-screen"
          aria-label="Exit full-screen"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div
        className="absolute top-3 right-3 z-20 flex items-center gap-2"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <span className="text-xs text-muted-foreground tabular-nums px-1">
          {index + 1} / {order.length}
        </span>
        <button
          type="button"
          onClick={reshuffle}
          className="h-11 w-11 rounded-full bg-card/70 hover:bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition"
          title="Reshuffle"
          aria-label="Reshuffle"
        >
          <Shuffle className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setShowConfig(true)}
          className="h-11 w-11 rounded-full bg-card/70 hover:bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition"
          title="Filters"
          aria-label="Filters"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {(type === 'on' || type === 'kun') && (
        <div className="absolute top-16 right-3 z-10 opacity-60">
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${READING_STYLES[type].chip}`}>
            {READING_STYLES[type].label}
          </span>
        </div>
      )}

      {/* The drill — lighter font weight, refined kerning, calmer rhythm.
        Content sits slightly below visual center via `pt-[60vh]` reset and
        a flex column whose top spacer is larger than the bottom. */}
      <div className="h-full w-full flex flex-col items-center px-6 pt-[42vh] pb-[18vh]">
        <div
          className="text-[clamp(3.5rem,12vw,9rem)] font-light leading-none text-center"
          style={{ fontFeatureSettings: '"palt", "kern"', letterSpacing: '0.06em' }}
        >
          <ColoredWord
            word={current.word}
            reading={current.reading}
            kanjiByChar={kanjiByChar}
          />
        </div>

        {/* Kana — fades in only after the first next-tap on this word */}
        <div
          className={`mt-10 text-[clamp(1.25rem,4vw,2.5rem)] font-light leading-tight text-center tracking-wide transition-opacity duration-200 ease-out ${
            revealed ? 'opacity-100' : 'opacity-0'
          } ${typeStyle ? typeStyle.text : 'text-muted-foreground'}`}
          aria-hidden={!revealed}
        >
          {current.reading}
        </div>

        {/* English meaning fades in only while held */}
        <div
          className={`mt-12 max-w-2xl text-center transition-opacity duration-200 ease-out ${
            holding ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={!holding}
        >
          <div className="text-[clamp(1rem,2.5vw,1.5rem)] font-light text-foreground/75 italic">
            {current.meaning}
          </div>
        </div>
      </div>

      {/* First-open help overlay */}
      {showHelp && (
        <div
          className="absolute inset-0 z-30 bg-background/90 backdrop-blur-sm flex items-center justify-center"
          onPointerDown={(e) => {
            e.stopPropagation();
            dismissHelp();
          }}
        >
          <div className="grid grid-cols-2 w-full max-w-3xl gap-4 px-6">
            <div className="rounded-lg border-2 border-dashed border-border p-6 text-center space-y-2">
              <div className="text-4xl font-light">←</div>
              <div className="text-sm font-medium">Tap left half</div>
              <div className="text-xs text-muted-foreground">Previous word</div>
            </div>
            <div className="rounded-lg border-2 border-dashed border-border p-6 text-center space-y-2">
              <div className="text-4xl font-light">→</div>
              <div className="text-sm font-medium">Tap right half</div>
              <div className="text-xs text-muted-foreground">Next word</div>
            </div>
            <div className="col-span-2 rounded-lg border-2 border-dashed border-border p-6 text-center space-y-2">
              <div className="text-2xl font-light">⏵</div>
              <div className="text-sm font-medium">Press &amp; hold anywhere</div>
              <div className="text-xs text-muted-foreground">
                Reveal English meaning while held
              </div>
            </div>
            <div className="col-span-2 text-center text-xs text-muted-foreground pt-2">
              Tap anywhere to begin
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
