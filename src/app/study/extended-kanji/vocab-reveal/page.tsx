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
import { useAuth } from '@/contexts/auth-context';
import { SRS, SrsState, cardKey } from '@/types/vocab-reveal-srs';
import {
  applyDecay,
  flushNow,
  load as loadSrs,
  persistLocal,
  rate as rateCard,
  scheduleFlush,
} from '@/services/vocab-reveal-srs.service';

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
  holdToReveal: boolean;
  smartRepetition: boolean;
}

/** Filter the corpus down to the eligible pool (theme/parent/usage). */
function filterPool(
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
  return pool;
}

/**
 * Weighted-random sampler with min-gap.
 *
 * Each card's draw weight = SRS.WEIGHTS[level] (level-0 cards 5× more likely
 * than level-4). A picked card is locked out of the next SRS.MIN_GAP slots so
 * level-0 cards can't appear back-to-back. If the eligibility window starves
 * (small pools), the lock-out window is shortened to break the deadlock.
 */
function buildSmartQueue(
  pool: MergedVocabRow[],
  srs: SrsState,
  queueLength: number,
): MergedVocabRow[] {
  if (pool.length === 0) return [];
  const items = pool.map((row) => ({
    row,
    key: cardKey(row.word, row.reading),
  }));
  const queue: MergedVocabRow[] = [];
  const recent: string[] = [];
  const minGap = Math.min(SRS.MIN_GAP, Math.max(0, pool.length - 1));

  while (queue.length < queueLength) {
    const eligible = items.filter((i) => !recent.includes(i.key));
    if (eligible.length === 0) {
      if (recent.length === 0) break;
      recent.shift();
      continue;
    }
    const total = eligible.reduce(
      (s, i) => s + SRS.WEIGHTS[srs[i.key]?.level ?? 0],
      0,
    );
    let r = Math.random() * total;
    let pick = eligible[0];
    for (const i of eligible) {
      r -= SRS.WEIGHTS[srs[i.key]?.level ?? 0];
      if (r <= 0) {
        pick = i;
        break;
      }
    }
    queue.push(pick.row);
    recent.push(pick.key);
    if (recent.length > minGap) recent.shift();
  }
  return queue;
}

/** Plain shuffle (sequential or random) — used when smartRepetition is off. */
function buildPlainQueue(
  pool: MergedVocabRow[],
  cfg: QueueConfig,
): MergedVocabRow[] {
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

function buildQueue(
  rows: MergedVocabRow[],
  byChar: Record<string, ExtendedKanji>,
  cfg: QueueConfig,
  srs: SrsState,
): MergedVocabRow[] {
  const pool = filterPool(rows, byChar, cfg);
  if (!cfg.smartRepetition) return buildPlainQueue(pool, cfg);
  const targetLength =
    cfg.cardLimit > 0
      ? cfg.cardLimit
      : Math.max(
          pool.length,
          Math.ceil(pool.length * SRS.QUEUE_MULTIPLIER),
        );
  return buildSmartQueue(pool, srs, targetLength);
}

export default function VocabRevealPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const uid = isAuthenticated && user ? user.uid : null;

  const [vocab, setVocab] = useState<MergedVocabRow[]>([]);
  const [kanjiByChar, setKanjiByChar] = useState<Record<string, ExtendedKanji>>({});
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<Mode>('sequential');
  const [themeFilter, setThemeFilter] = useState<string>('all');
  const [parentFilter, setParentFilter] = useState<string>('all');
  const [usageFilter, setUsageFilter] = useState<UsageFilter>('all');
  const [cardLimit, setCardLimit] = useState<number>(0);
  const [holdToReveal, setHoldToReveal] = useState<boolean>(true);
  const [smartRepetition, setSmartRepetition] = useState<boolean>(true);

  const [order, setOrder] = useState<MergedVocabRow[]>([]);
  const [index, setIndex] = useState(0);
  const [holding, setHolding] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const [showConfig, setShowConfig] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // SRS state — kept in a ref so rating handlers stay stable and don't
  // retrigger keyboard listener re-attach on every rating.
  const srsRef = useRef<SrsState>({});
  // Toast for rating feedback. Cleared by a timer.
  const [toast, setToast] = useState<{ text: string; level: number } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasHeldRef = useRef(false);
  const wasSwipedRef = useRef(false);
  const downXRef = useRef<number | null>(null);
  const downYRef = useRef<number | null>(null);

  // Swipe thresholds: ≥60px horizontal AND <30px vertical = a rating swipe.
  const SWIPE_DX_MIN = 60;
  const SWIPE_DY_MAX = 30;

  // Refs to the latest navigation handlers + state. The keyboard listener
  // reads through these so the listener can stay mounted exactly once for
  // the lifetime of the page — no detach/re-attach on every state change.
  const nextRef = useRef(() => {});
  const prevRef = useRef(() => {});
  const reshuffleRef = useRef(() => {});
  const dismissHelpRef = useRef(() => {});
  const enterFullscreenRef = useRef(() => {});
  const leaveFullscreenRef = useRef(() => {});
  const rateRef = useRef((_knew: boolean) => {});
  const stateRef = useRef({ showConfig: false, showHelp: false, fullscreen: false });
  // Debounce: prevent the same logical key/click navigation from firing
  // twice within this many milliseconds (covers OS auto-repeat + spurious
  // double events).
  const lastNavRef = useRef(0);

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
        holdToReveal: true,
        smartRepetition: true,
        ...(savedCfg ? JSON.parse(savedCfg) : {}),
      };
      setMode(cfg.mode);
      setThemeFilter(cfg.themeFilter);
      setParentFilter(cfg.parentFilter);
      setUsageFilter(cfg.usageFilter);
      setCardLimit(cfg.cardLimit);
      setHoldToReveal(cfg.holdToReveal);
      setSmartRepetition(cfg.smartRepetition);

      // Load SRS state (local + cloud, merged) and apply time-decay.
      const loaded = await loadSrs(uid);
      const decayed = applyDecay(loaded);
      srsRef.current = decayed;
      // Persist decayed state so the next session starts clean. Cloud flush
      // is fire-and-forget; local is synchronous.
      persistLocal(decayed);
      if (uid) scheduleFlush(uid, decayed);

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
        resolved = buildQueue(vocabRows, byChar, cfg, decayed);
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
  }, [uid]);

  // Flush any pending cloud writes when the user leaves the page.
  useEffect(() => {
    return () => {
      if (uid) void flushNow(uid, srsRef.current);
    };
  }, [uid]);

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
    const cfg: QueueConfig = {
      mode: 'random',
      themeFilter,
      parentFilter,
      usageFilter,
      cardLimit,
      holdToReveal,
      smartRepetition,
    };
    const built = buildQueue(vocab, kanjiByChar, cfg, srsRef.current);
    setMode('random');
    setOrder(built);
    setIndex(0);
    setRevealed(false);
    sessionStorage.setItem(
      ORDER_KEY,
      JSON.stringify(built.map((v) => `${v.word}|${v.reading}`)),
    );
    sessionStorage.setItem(CFG_KEY, JSON.stringify(cfg));
  }, [vocab, kanjiByChar, themeFilter, parentFilter, usageFilter, cardLimit, holdToReveal, smartRepetition]);

  const applyConfigAndStart = useCallback(() => {
    const cfg: QueueConfig = { mode, themeFilter, parentFilter, usageFilter, cardLimit, holdToReveal, smartRepetition };
    sessionStorage.setItem(CFG_KEY, JSON.stringify(cfg));
    const built = buildQueue(vocab, kanjiByChar, cfg, srsRef.current);
    setOrder(built);
    setIndex(0);
    setRevealed(false);
    sessionStorage.setItem(
      ORDER_KEY,
      JSON.stringify(built.map((v) => `${v.word}|${v.reading}`)),
    );
    setShowConfig(false);
  }, [mode, themeFilter, parentFilter, usageFilter, cardLimit, holdToReveal, smartRepetition, vocab, kanjiByChar]);

  /** Rate the current card and advance. */
  const rateAndAdvance = useCallback(
    (knew: boolean) => {
      const c = order[index];
      if (!c) return;
      const key = cardKey(c.word, c.reading);
      const next = rateCard(srsRef.current, key, knew);
      srsRef.current = next;
      persistLocal(next);
      scheduleFlush(uid, next);
      // Toast
      const newLevel = next[key].level;
      setToast({ text: knew ? 'Knew it' : 'Didn’t know', level: newLevel });
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), 700);
      // Advance — wrap around like next() does.
      setIndex((i) => (i + 1) % order.length);
      setRevealed(false);
    },
    [order, index, uid],
  );

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

  // Keep the navigation refs current on every render. The keyboard listener
  // reads these refs so it never has to be detached/reattached.
  useEffect(() => {
    nextRef.current = next;
    prevRef.current = prev;
    reshuffleRef.current = reshuffle;
    dismissHelpRef.current = dismissHelp;
    enterFullscreenRef.current = enterFullscreen;
    leaveFullscreenRef.current = leaveFullscreen;
    rateRef.current = rateAndAdvance;
    stateRef.current = { showConfig, showHelp, fullscreen };
  });

  // Keyboard — single mount for the page's lifetime. Filters out:
  //   • OS key auto-repeat (e.repeat === true) — was the main culprit:
  //     a held arrow key fired keydown every ~50ms, advancing twice per tap.
  //   • Bursty double-events within 150ms (debounce via lastNavRef).
  // Both compact and fullscreen modes share the same listener.
  useEffect(() => {
    const NAV_DEBOUNCE_MS = 150;
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      const { showConfig, showHelp, fullscreen } = stateRef.current;
      if (showConfig) return;
      // Block OS auto-repeat for navigation keys
      if (e.repeat && (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === ' ')) return;
      const now = Date.now();
      const navDebounced = now - lastNavRef.current < NAV_DEBOUNCE_MS;

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          if (navDebounced) return;
          lastNavRef.current = now;
          if (showHelp) dismissHelpRef.current();
          nextRef.current();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (navDebounced) return;
          lastNavRef.current = now;
          if (showHelp) dismissHelpRef.current();
          prevRef.current();
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (navDebounced) return;
          lastNavRef.current = now;
          if (showHelp) dismissHelpRef.current();
          rateRef.current(true);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (navDebounced) return;
          lastNavRef.current = now;
          if (showHelp) dismissHelpRef.current();
          rateRef.current(false);
          break;
        case 'Escape':
          if (showHelp) dismissHelpRef.current();
          else if (fullscreen) leaveFullscreenRef.current();
          else router.push('/study/extended-kanji/vocabulary');
          break;
        case 's':
        case 'S':
          setMode((m) => (m === 'sequential' ? 'random' : 'sequential'));
          break;
        case 'r':
        case 'R':
          reshuffleRef.current();
          break;
        case 'f':
        case 'F':
          if (fullscreen) leaveFullscreenRef.current();
          else enterFullscreenRef.current();
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);

  // Tap vs hold detection — pointer events handle the HOLD; the browser-native
  // `click` event handles the TAP (it's deduped across pointer + synthesized
  // mouse events, so navigation never double-fires on touch devices).
  const onPointerDown = (e: React.PointerEvent) => {
    if (showConfig) return;
    wasHeldRef.current = false;
    wasSwipedRef.current = false;
    downXRef.current = e.clientX;
    downYRef.current = e.clientY;
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
      // Was a hold — drop the meaning overlay. Leave wasHeldRef set so the
      // upcoming click event knows to skip navigation.
      setHolding(false);
      return;
    }
    // Swipe detection: pointer moved ≥SWIPE_DX_MIN horizontally and
    // <SWIPE_DY_MAX vertically. Triggers a rating instead of a navigation.
    if (downXRef.current !== null && downYRef.current !== null) {
      const dx = e.clientX - downXRef.current;
      const dy = e.clientY - downYRef.current;
      if (Math.abs(dx) >= SWIPE_DX_MIN && Math.abs(dy) < SWIPE_DY_MAX) {
        wasSwipedRef.current = true;
        rateAndAdvance(dx > 0); // right = knew, left = didn't
      }
    }
  };

  const onPointerCancel = () => {
    cancelTimer();
    setHolding(false);
    wasHeldRef.current = false;
    wasSwipedRef.current = false;
    downXRef.current = null;
    downYRef.current = null;
  };

  const onClick = (e: React.MouseEvent) => {
    if (showConfig) return;
    if (wasHeldRef.current) {
      wasHeldRef.current = false;
      return;
    }
    if (wasSwipedRef.current) {
      // Swipe already triggered a rating — eat the synthesized click.
      wasSwipedRef.current = false;
      return;
    }
    if (showHelp) {
      dismissHelp();
      return;
    }
    const now = Date.now();
    if (now - lastNavRef.current < 150) return;
    lastNavRef.current = now;
    const x = downXRef.current ?? e.clientX;
    const halfway = window.innerWidth / 2;
    if (x < halfway) prev();
    else next();
    downXRef.current = null;
    downYRef.current = null;
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
                <Label htmlFor="limit">Card limit</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { v: 0, label: 'All' },
                    { v: 25, label: '25' },
                    { v: 50, label: '50' },
                    { v: 100, label: '100' },
                    { v: 200, label: '200' },
                  ].map(({ v, label }) => (
                    <Button
                      key={v}
                      size="sm"
                      variant={cardLimit === v ? 'default' : 'outline'}
                      onClick={() => setCardLimit(v)}
                      className="min-h-[40px]"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
                <Input
                  id="limit"
                  type="number"
                  min={0}
                  max={vocab.length}
                  value={cardLimit}
                  onChange={(e) => setCardLimit(parseInt(e.target.value) || 0)}
                  placeholder="Custom (0 = all)"
                />
                <p className="text-xs text-muted-foreground">
                  How many cards to draw into the session. Smart Repetition uses
                  weighted sampling so weak cards appear more often.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Smart Repetition</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={smartRepetition ? 'default' : 'outline'}
                    onClick={() => setSmartRepetition(true)}
                    className="min-h-[44px]"
                  >
                    On (recommended)
                  </Button>
                  <Button
                    variant={!smartRepetition ? 'default' : 'outline'}
                    onClick={() => setSmartRepetition(false)}
                    className="min-h-[44px]"
                  >
                    Off
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  ↑ / swipe right = knew it.&nbsp; ↓ / swipe left = didn’t.&nbsp;
                  Cards you don’t know reappear sooner; mastered cards still
                  show up, just rarely. Off = plain sequential/random order.
                </p>
              </div>
              <div className="space-y-2">
                <Label>English meaning</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={holdToReveal ? 'default' : 'outline'}
                    onClick={() => setHoldToReveal(true)}
                    className="min-h-[44px]"
                  >
                    Hold to reveal
                  </Button>
                  <Button
                    variant={!holdToReveal ? 'default' : 'outline'}
                    onClick={() => setHoldToReveal(false)}
                    className="min-h-[44px]"
                  >
                    Always show
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Off = meaning appears together with the kana — handy when navigating with arrow keys.
                </p>
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
  const showMeaning = holdToReveal ? holding : revealed;

  // Stats over the entire session pool — counts cards in the queue scoped by
  // current SRS state. Cheap to recompute since the queue is at most a few
  // hundred items.
  const srsStats = (() => {
    let due = 0;
    let mastered = 0;
    for (const v of order) {
      const lvl = srsRef.current[cardKey(v.word, v.reading)]?.level ?? 0;
      if (lvl <= 1) due++;
      if (lvl === 4) mastered++;
    }
    return { due, mastered };
  })();

  // Compact (quick-view) drill — the page IS the drill at a calm card size.
  // Same gestures as fullscreen: tap left half, tap right half, press & hold.
  // A tiny Maximize button in the card corner is the only fullscreen affordance.
  if (!fullscreen) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-6 sm:py-10 min-h-[100dvh] flex flex-col">
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
            {smartRepetition && (
              <span
                className="text-[10px] text-muted-foreground/70 tabular-nums px-1"
                title="Cards still at level 0 or 1 · cards at level 4 (mastered)"
              >
                {srsStats.due}↻ · {srsStats.mastered}✓
              </span>
            )}
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
          className="relative border-border/60 select-none cursor-pointer overflow-hidden mt-[32vh] sm:mt-[28vh]"
          style={{
            touchAction: 'manipulation',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onClick={onClick}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Thin progress bar at top edge of the card */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Tiny fullscreen toggle — fully isolated from the card's tap handler */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              enterFullscreen();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
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

          <CardContent className="pt-12 sm:pt-14 pb-12 sm:pb-14 flex flex-col items-center gap-6">
            {/* `key={index}` forces these elements to unmount/remount when the
              word changes, so the kana never bleeds into the next word's
              fade transition. */}
            <div
              key={`word-${index}`}
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
              key={`reading-${index}`}
              className={`text-[clamp(1.25rem,3.5vw,2.25rem)] font-light leading-tight tracking-wide text-center transition-opacity duration-200 ease-out ${
                revealed ? 'opacity-100' : 'opacity-0'
              } ${typeStyle ? typeStyle.text : 'text-muted-foreground'}`}
              aria-hidden={!revealed}
            >
              {current.reading}
            </div>

            <div
              key={`meaning-${index}`}
              className={`max-w-xl text-center transition-opacity duration-200 ease-out ${
                showMeaning ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden={!showMeaning}
            >
              <div className="text-[clamp(0.875rem,2vw,1.125rem)] font-light text-foreground/75 italic">
                {current.meaning}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating toast */}
        {toast && (
          <div className="pointer-events-none fixed inset-x-0 bottom-10 flex justify-center z-30">
            <div className="px-3 py-1.5 rounded-full bg-foreground/85 text-background text-xs font-medium shadow tracking-wide animate-in fade-in duration-150">
              {toast.text} · L{toast.level}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full-screen drill view
  return (
    <div
      className="fixed inset-0 z-50 bg-background select-none overflow-hidden"
      style={{
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Thin top progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted z-10">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Tiny corner controls — bumped to 44×44 for proper touch targets.
        Each button stops both pointerdown AND click from bubbling, so the
        underlying tap-surface handler doesn't double-fire. */}
      <div
        className="absolute top-3 left-3 z-20"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
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
        onPointerUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-end leading-tight px-1">
          <span className="text-xs text-muted-foreground tabular-nums">
            {index + 1} / {order.length}
          </span>
          {smartRepetition && (
            <span
              className="text-[10px] text-muted-foreground/70 tabular-nums"
              title="Cards still at level 0 or 1 · cards at level 4 (mastered)"
            >
              {srsStats.due}↻ · {srsStats.mastered}✓
            </span>
          )}
        </div>
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
        {/* `key={index}` ensures these unmount/remount on word change so the
          previous word's fade-out can't smear into the next word's content. */}
        <div
          key={`fs-word-${index}`}
          className="text-[clamp(3.5rem,12vw,9rem)] font-light leading-none text-center"
          style={{ fontFeatureSettings: '"palt", "kern"', letterSpacing: '0.06em' }}
        >
          <ColoredWord
            word={current.word}
            reading={current.reading}
            kanjiByChar={kanjiByChar}
          />
        </div>

        <div
          key={`fs-reading-${index}`}
          className={`mt-10 text-[clamp(1.5rem,4.5vw,3rem)] font-light leading-tight text-center tracking-wide transition-opacity duration-200 ease-out ${
            revealed ? 'opacity-100' : 'opacity-0'
          } ${typeStyle ? typeStyle.text : 'text-muted-foreground'}`}
          aria-hidden={!revealed}
        >
          {current.reading}
        </div>

        <div
          key={`fs-meaning-${index}`}
          className={`mt-12 max-w-2xl text-center transition-opacity duration-200 ease-out ${
            showMeaning ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={!showMeaning}
        >
          <div className="text-[clamp(1rem,2.5vw,1.5rem)] font-light text-foreground/75 italic">
            {current.meaning}
          </div>
        </div>
      </div>

      {/* Rating toast (fullscreen) */}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-12 flex justify-center z-30">
          <div className="px-4 py-2 rounded-full bg-foreground/85 text-background text-sm font-medium shadow-lg tracking-wide animate-in fade-in duration-150">
            {toast.text} · L{toast.level}
          </div>
        </div>
      )}

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
            <div className="rounded-lg border-2 border-dashed border-emerald-500/50 p-6 text-center space-y-2">
              <div className="text-3xl font-light">↑ / ⇢</div>
              <div className="text-sm font-medium">Swipe right · ↑ key</div>
              <div className="text-xs text-muted-foreground">Knew it (less often)</div>
            </div>
            <div className="rounded-lg border-2 border-dashed border-amber-500/50 p-6 text-center space-y-2">
              <div className="text-3xl font-light">↓ / ⇠</div>
              <div className="text-sm font-medium">Swipe left · ↓ key</div>
              <div className="text-xs text-muted-foreground">Didn’t know (more often)</div>
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
