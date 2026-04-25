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
import { useRouter } from 'next/navigation';
import { Settings, Shuffle, X } from 'lucide-react';
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

  const [showConfig, setShowConfig] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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
      if (!localStorage.getItem(HELP_DISMISSED_KEY)) setShowHelp(true);
    })();
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

  const next = useCallback(() => {
    if (order.length === 0) return;
    setIndex((i) => (i + 1) % order.length);
  }, [order.length]);

  const prev = useCallback(() => {
    if (order.length === 0) return;
    setIndex((i) => (i - 1 + order.length) % order.length);
  }, [order.length]);

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
    sessionStorage.setItem(
      ORDER_KEY,
      JSON.stringify(built.map((v) => `${v.word}|${v.reading}`)),
    );
    setShowConfig(false);
  }, [mode, themeFilter, parentFilter, usageFilter, cardLimit, vocab, kanjiByChar]);

  const exit = useCallback(() => {
    sessionStorage.removeItem(ORDER_KEY);
    sessionStorage.removeItem(IDX_KEY);
    router.push('/study/extended-kanji/vocabulary');
  }, [router]);

  const dismissHelp = useCallback(() => {
    setShowHelp(false);
    localStorage.setItem(HELP_DISMISSED_KEY, '1');
  }, []);

  // Keyboard (silent — no UI hint)
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
          else exit();
          break;
        case 's':
        case 'S':
          setMode((m) => (m === 'sequential' ? 'random' : 'sequential'));
          break;
        case 'r':
        case 'R':
          reshuffle();
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, exit, reshuffle, showConfig, showHelp, dismissHelp]);

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
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-muted-foreground">No vocabulary matches your filters.</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={exit}>Exit</Button>
              <Button onClick={() => setShowConfig(true)}>Open filters</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const type = classifyRow(current);
  const typeStyle = readingTypeStyle(type);
  const progressPct = ((index + 1) / order.length) * 100;

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

      {/* Tiny corner controls — opt-out, not chrome */}
      <div className="absolute top-3 left-3 z-20" onPointerDown={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={exit}
          className="h-9 w-9 rounded-full bg-card/70 hover:bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition"
          title="Exit"
          aria-label="Exit drill"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div
        className="absolute top-3 right-3 z-20 flex items-center gap-2"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <span className="text-xs text-muted-foreground tabular-nums">
          {index + 1} / {order.length}
        </span>
        <button
          type="button"
          onClick={reshuffle}
          className="h-9 w-9 rounded-full bg-card/70 hover:bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition"
          title="Reshuffle"
          aria-label="Reshuffle"
        >
          <Shuffle className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowConfig(true)}
          className="h-9 w-9 rounded-full bg-card/70 hover:bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition"
          title="Filters"
          aria-label="Filters"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {(type === 'on' || type === 'kun') && (
        <div className="absolute top-14 right-3 z-10 opacity-70">
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${READING_STYLES[type].chip}`}>
            {READING_STYLES[type].label}
          </span>
        </div>
      )}

      {/* The drill — big word + reading; meaning fades in on hold */}
      <div className="h-full w-full flex flex-col items-center justify-center px-6">
        <div className="text-[clamp(3.5rem,12vw,9rem)] font-semibold leading-none tracking-tight text-center">
          <ColoredWord
            word={current.word}
            reading={current.reading}
            kanjiByChar={kanjiByChar}
          />
        </div>

        <div
          className={`mt-8 text-[clamp(1.25rem,4vw,2.5rem)] font-normal leading-tight text-center ${
            typeStyle ? typeStyle.text : 'text-muted-foreground'
          }`}
        >
          {current.reading}
        </div>

        {/* English meaning fades in only while held */}
        <div
          className={`mt-10 max-w-2xl text-center transition-opacity duration-200 ease-out ${
            holding ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={!holding}
        >
          <div className="text-[clamp(1rem,2.5vw,1.5rem)] text-foreground/80 italic">
            {current.meaning}
          </div>
        </div>
      </div>

      {/* First-open help overlay */}
      {showHelp && (
        <div
          className="absolute inset-0 z-30 bg-background/85 backdrop-blur-sm flex items-center justify-center"
          onPointerDown={(e) => {
            e.stopPropagation();
            dismissHelp();
          }}
        >
          <div className="grid grid-cols-2 w-full max-w-3xl gap-4 px-6">
            <div className="rounded-lg border-2 border-dashed border-border p-6 text-center space-y-2">
              <div className="text-4xl">←</div>
              <div className="text-sm font-medium">Tap left half</div>
              <div className="text-xs text-muted-foreground">Previous word</div>
            </div>
            <div className="rounded-lg border-2 border-dashed border-border p-6 text-center space-y-2">
              <div className="text-4xl">→</div>
              <div className="text-sm font-medium">Tap right half</div>
              <div className="text-xs text-muted-foreground">Next word</div>
            </div>
            <div className="col-span-2 rounded-lg border-2 border-dashed border-border p-6 text-center space-y-2">
              <div className="text-2xl">⏵</div>
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
