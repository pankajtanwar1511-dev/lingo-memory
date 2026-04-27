'use client';

/**
 * Extended Kanji — full-screen vocabulary drill
 * Route: /study/kanji/vocab-reveal
 *
 * Three icon controls in the toolbar — no settings modal:
 *   • # cards  — pick session length (25 / 50 / 100 / All)
 *   • Shuffle  — toggle random vs teacher order
 *   • Eye      — toggle "always show meaning" vs "hold to reveal"
 *
 * Smart repetition is always on. Pool = the entire vocab corpus. The SRS
 * cycles weak cards more often (weighted by level); ↑/↓ ratings re-tune the
 * upcoming queue in-session.
 *
 * Keyboard (silent): →/Space = next · ← = prev · R = reshuffle · Esc = exit
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUp, Eye, EyeOff, Hash, Maximize2, Shuffle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExtendedKanji, MergedVocabRow } from '@/types/extended-kanji';
import {
  READING_STYLES,
  classifyReading,
  readingTypeStyle,
  type ReadingType,
} from '@/lib/extended-kanji/readings';
import { ColoredWord } from '@/components/extended-kanji/colored-word';
import { useAuth } from '@/contexts/auth-context';
import { useSettings } from '@/contexts/settings-context';
import { flushAllPending, loadProgress, saveProgress } from '@/services/cloud-progress.service';
import { SRS, SrsState, cardKey } from '@/types/vocab-reveal-srs';
import {
  applyDecay,
  flushNow,
  load as loadSrs,
  persistLocal,
  rate as rateCard,
  scheduleFlush,
} from '@/services/vocab-reveal-srs.service';

// Drill prefs live in cloud-progress — localStorage write-through + RTDB
// sync so the form pre-fills with your last choices on every device.
const CFG_KEY = 'extended-kanji-vocab-reveal-config';
// Help-dismissed is per-device (no cloud) — no value in syncing the overlay.
const HELP_DISMISSED_KEY = 'extended-kanji-vocab-reveal-help-dismissed';

const HOLD_THRESHOLD_MS = 280; // tap vs hold

const CARD_LIMIT_OPTIONS: { v: number; label: string }[] = [
  { v: 25, label: '25' },
  { v: 50, label: '50' },
  { v: 100, label: '100' },
  { v: 0, label: 'All' },
];

type OrderMode = 'teacher' | 'shuffle' | 'lowest';
type LevelOp = '<=' | '>=';

interface QueueConfig {
  cardLimit: number;
  /** 'teacher' = JSON order; 'shuffle' = smart-rep weighted; 'lowest' = sort by SRS level ascending. */
  order: OrderMode;
  /** Filter the pool to cards whose level matches `levelOp levelValue`. */
  levelOp: LevelOp;
  levelValue: 0 | 1 | 2 | 3 | 4;
  holdToReveal: boolean;
}

const DEFAULT_CFG: QueueConfig = {
  cardLimit: 50,
  order: 'shuffle',
  levelOp: '>=',
  levelValue: 0,
  holdToReveal: true,
};

/** Apply the level filter — used by both buildQueue and the live setup count. */
function filterByLevel(
  rows: MergedVocabRow[],
  srs: SrsState,
  op: LevelOp,
  value: number,
): MergedVocabRow[] {
  return rows.filter((row) => {
    const lvl = srs[cardKey(row.word, row.reading)]?.level ?? 0;
    return op === '<=' ? lvl <= value : lvl >= value;
  });
}

/** Minimum SRS level across a list of cards (0 if empty). */
function minLevelOf(rows: MergedVocabRow[], srs: SrsState): number {
  if (rows.length === 0) return 0;
  let min = Infinity;
  for (const r of rows) {
    const lvl = srs[cardKey(r.word, r.reading)]?.level ?? 0;
    if (lvl < min) min = lvl;
  }
  return min === Infinity ? 0 : min;
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

/**
 * Build a session queue. Three steps:
 *   1. Filter the corpus by `levelOp levelValue` (e.g. `<= 2` for struggling
 *      cards only). The level filter is locked at session start.
 *   2. Route by order mode: teacher = JSON order; shuffle = SRS-weighted
 *      draw with min-gap; lowest = sort by current level ascending.
 *   3. Cap to cardLimit (or the full filtered pool if cardLimit = 0).
 */
function buildQueue(
  rows: MergedVocabRow[],
  cfg: QueueConfig,
  srs: SrsState,
  queueMultiplier: number = SRS.QUEUE_MULTIPLIER,
): MergedVocabRow[] {
  const pool = filterByLevel(rows, srs, cfg.levelOp, cfg.levelValue);
  if (pool.length === 0) return [];

  if (cfg.order === 'teacher') {
    // Filtered teacher order — straight slice in JSON order.
    return cfg.cardLimit > 0 ? pool.slice(0, cfg.cardLimit) : [...pool];
  }

  if (cfg.order === 'lowest') {
    // Sort by current level ascending (struggling cards first), then slice.
    const sorted = [...pool].sort((a, b) => {
      const la = srs[cardKey(a.word, a.reading)]?.level ?? 0;
      const lb = srs[cardKey(b.word, b.reading)]?.level ?? 0;
      return la - lb;
    });
    return cfg.cardLimit > 0 ? sorted.slice(0, cfg.cardLimit) : sorted;
  }

  // order === 'shuffle' → smart-repetition path. cardLimit is the SESSION
  // LENGTH; the queue cycles the pool with weighted repetition. Ratings
  // during the session re-weight the *tail* of the queue (see retuneTail).
  const targetLength =
    cfg.cardLimit > 0
      ? cfg.cardLimit
      : Math.max(
          pool.length,
          Math.ceil(pool.length * Math.max(1, queueMultiplier)),
        );
  return buildSmartQueue(pool, srs, targetLength);
}

/**
 * Replace the upcoming portion of the queue (slots after `fromIndex`) with a
 * fresh weighted draw using the current SRS state. Only meaningful for
 * shuffle mode — teacher and lowest are deterministic by design (the user
 * wanted the order locked at session start).
 *
 * The level filter is also re-applied: if a card was just rated past the
 * filter boundary (e.g. session is `<= 2` and the card moved to L3), it
 * naturally drops out of the rest of the queue.
 */
function retuneTail(
  order: MergedVocabRow[],
  fromIndex: number,
  rows: MergedVocabRow[],
  cfg: QueueConfig,
  srs: SrsState,
): MergedVocabRow[] {
  if (cfg.order !== 'shuffle') return order;
  const pool = filterByLevel(rows, srs, cfg.levelOp, cfg.levelValue);
  if (pool.length === 0) return order;
  const tailNeeded = order.length - fromIndex - 1;
  if (tailNeeded <= 0) return order;
  const head = order.slice(0, fromIndex + 1);
  const newTail = buildSmartQueue(pool, srs, tailNeeded);
  return head.concat(newTail);
}

export default function VocabRevealPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const uid = isAuthenticated && user ? user.uid : null;
  const decayDays = settings?.srsDecayDays ?? SRS.DECAY_DAYS;
  const queueMultiplier = settings?.srsQueueMultiplier ?? SRS.QUEUE_MULTIPLIER;

  const [vocab, setVocab] = useState<MergedVocabRow[]>([]);
  const [kanjiByChar, setKanjiByChar] = useState<Record<string, ExtendedKanji>>({});
  const [loading, setLoading] = useState(true);

  // Single cfg object, edited from the setup screen and locked while playing.
  // Saved cfg from cloud-progress pre-fills it on entry; updated cfg is
  // persisted whenever the user starts a new session.
  const [cfg, setCfg] = useState<QueueConfig>(DEFAULT_CFG);

  // Two phases: 'setup' = the form; 'playing' = the card reveal game.
  // Setup is the default on entry; "Start session" → 'playing'; in-game
  // "End session" button → 'setup'.
  const [phase, setPhase] = useState<'setup' | 'playing'>('setup');

  const [order, setOrder] = useState<MergedVocabRow[]>([]);
  const [index, setIndex] = useState(0);
  const [holding, setHolding] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const [showHelp, setShowHelp] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // SRS state — kept in a ref so rating handlers stay stable and don't
  // retrigger keyboard listener re-attach on every rating.
  const srsRef = useRef<SrsState>({});
  // Toast for rating feedback. Cleared by a timer.
  const [toast, setToast] = useState<{ text: string; level: number } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Minimum-level milestone celebration: when the floor of the session pool
  // crosses up (e.g. the last L0 card finally graduates to L1), pop a
  // centered up-arrow toast for ~1.8s. Baseline is set in startSession;
  // checked again after every rating in rateAndAdvance.
  const minLevelRef = useRef<number>(0);
  const [levelUp, setLevelUp] = useState<{ level: number } | null>(null);
  const levelUpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasHeldRef = useRef(false);
  const wasSwipedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const downXRef = useRef<number | null>(null);
  const downYRef = useRef<number | null>(null);

  // Tinder-style live drag state: dragX/dragY drives transform + color tint.
  // `snapping` toggles the CSS transition so we can either follow finger
  // (no transition) or animate snap-back / fly-off (with transition).
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [snapping, setSnapping] = useState(false);

  // Swipe thresholds — drag past this many px to commit to a rating.
  // 8px = the "this is a drag, not a tap" deadzone.
  const SWIPE_DX_MIN = 80;
  const DRAG_DEAD_ZONE = 8;

  // Refs to the latest navigation handlers + state. The keyboard listener
  // reads through these so the listener can stay mounted exactly once for
  // the lifetime of the page — no detach/re-attach on every state change.
  const nextRef = useRef(() => {});
  const prevRef = useRef(() => {});
  const dismissHelpRef = useRef(() => {});
  const enterFullscreenRef = useRef(() => {});
  const leaveFullscreenRef = useRef(() => {});
  const endSessionRef = useRef(() => {});
  const rateRef = useRef((_knew: boolean) => {});
  const stateRef = useRef({ showHelp: false, fullscreen: false, phase: 'setup' as 'setup' | 'playing' });
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

      // Load drill prefs from cloud-progress — pre-fills the setup form.
      // Tolerate older saved cfg shapes (no `order` / no level filter) by
      // mapping them into DEFAULT_CFG-shaped records.
      const savedRaw = await loadProgress<Partial<QueueConfig> & { shuffle?: boolean }>(
        uid,
        CFG_KEY,
        {},
      );
      const savedCfg: QueueConfig = {
        cardLimit: typeof savedRaw.cardLimit === 'number' ? savedRaw.cardLimit : DEFAULT_CFG.cardLimit,
        order:
          savedRaw.order ??
          // legacy: `shuffle: false` mapped to teacher order
          (savedRaw.shuffle === false ? 'teacher' : DEFAULT_CFG.order),
        levelOp: savedRaw.levelOp ?? DEFAULT_CFG.levelOp,
        levelValue: (savedRaw.levelValue ?? DEFAULT_CFG.levelValue) as 0 | 1 | 2 | 3 | 4,
        holdToReveal:
          typeof savedRaw.holdToReveal === 'boolean' ? savedRaw.holdToReveal : DEFAULT_CFG.holdToReveal,
      };
      setCfg(savedCfg);

      // Load SRS state (local + cloud, merged) and apply time-decay.
      const loaded = await loadSrs(uid);
      const decayed = applyDecay(loaded, Date.now(), decayDays);
      srsRef.current = decayed;
      // Persist decayed state so the next session starts clean.
      persistLocal(decayed);
      if (uid) scheduleFlush(uid, decayed);

      // Don't pre-build a queue — the user picks options on the setup screen
      // first and clicks Start, which is when the queue is built.

      setLoading(false);
      // Help overlay only shows when entering full-screen (handled in enterFullscreen)
    })();
    // SRS tuning (decayDays/queueMultiplier) is read at session start only;
    // changing it mid-session shouldn't rebuild the queue. The user reshuffles
    // or reopens the page to pick up new values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  // Flush any pending cloud writes when the user leaves the page — both the
  // SRS state and any debounced drill-config edits.
  useEffect(() => {
    return () => {
      if (uid) void flushNow(uid, srsRef.current);
      void flushAllPending();
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

  /**
   * Build a fresh queue from the locked-in cfg and switch to the playing
   * phase. Called by the "Start session" button on the setup screen.
   * Persists cfg via cloud-progress so the next entry pre-fills the form.
   */
  const startSession = useCallback(
    (sessionCfg: QueueConfig) => {
      if (vocab.length === 0) return;
      const built = buildQueue(vocab, sessionCfg, srsRef.current, queueMultiplier);
      setCfg(sessionCfg);
      setOrder(built);
      setIndex(0);
      setRevealed(false);
      setPhase('playing');
      // Baseline for the level-up celebration. No animation on session start —
      // only when the floor moves UP from this baseline during the session.
      minLevelRef.current = minLevelOf(built, srsRef.current);
      setLevelUp(null);
      saveProgress(uid, CFG_KEY, sessionCfg);
    },
    [vocab, queueMultiplier, uid],
  );

  /** Return to the setup screen, dropping the in-flight queue. */
  const endSession = useCallback(() => {
    setPhase('setup');
    setOrder([]);
    setIndex(0);
    setRevealed(false);
    setLevelUp(null);
    if (levelUpTimerRef.current) clearTimeout(levelUpTimerRef.current);
    leaveFullscreen();
  }, [leaveFullscreen]);

  /** Rate the current card and advance. Per-rating cloud sync is immediate. */
  const rateAndAdvance = useCallback(
    (knew: boolean) => {
      const c = order[index];
      if (!c) return;
      const key = cardKey(c.word, c.reading);
      const next = rateCard(srsRef.current, key, knew);
      srsRef.current = next;
      persistLocal(next);
      // Immediate cloud write (no debounce). Async, non-blocking.
      scheduleFlush(uid, next);
      // Toast
      const newLevel = next[key].level;
      setToast({ text: knew ? 'Knew it' : 'Didn’t know', level: newLevel });
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), 700);
      // Re-tune the upcoming queue with the fresh SRS state so ↑/↓ actually
      // changes what comes next. Only fires for shuffle order — teacher and
      // lowest are deterministic by user choice.
      const retuned = retuneTail(order, index, vocab, cfg, next);
      if (retuned !== order) {
        setOrder(retuned);
      }
      // Milestone celebration: did the SESSION'S floor level just move up?
      // Compute against the active queue (retuned if it changed, else order).
      const active = retuned !== order ? retuned : order;
      const newMin = minLevelOf(active, next);
      if (newMin > minLevelRef.current) {
        setLevelUp({ level: newMin });
        if (levelUpTimerRef.current) clearTimeout(levelUpTimerRef.current);
        levelUpTimerRef.current = setTimeout(() => setLevelUp(null), 1000);
      }
      minLevelRef.current = newMin;
      // Advance — wrap around like next() does.
      setIndex((i) => (i + 1) % order.length);
      setRevealed(false);
    },
    [order, index, uid, vocab, cfg],
  );


  const dismissHelp = useCallback(() => {
    setShowHelp(false);
    localStorage.setItem(HELP_DISMISSED_KEY, '1');
  }, []);

  // Keep the navigation refs current on every render. The keyboard listener
  // reads these refs so it never has to be detached/reattached.
  useEffect(() => {
    nextRef.current = next;
    prevRef.current = prev;
    dismissHelpRef.current = dismissHelp;
    enterFullscreenRef.current = enterFullscreen;
    leaveFullscreenRef.current = leaveFullscreen;
    endSessionRef.current = endSession;
    rateRef.current = rateAndAdvance;
    stateRef.current = { showHelp, fullscreen, phase };
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
      const { showHelp, fullscreen, phase } = stateRef.current;
      // Setup screen: only Esc (back to hub) is handled. The form has its
      // own input focus + native button handling.
      if (phase === 'setup') {
        if (e.key === 'Escape') router.push('/study/kanji');
        return;
      }
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
          else endSessionRef.current();
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

  // Gesture handling — three modes branching off pointer-down:
  //   • Hold (no movement, 280ms+) → reveal meaning while held
  //   • Tap (no movement, quick release) → tap-left/right for prev/next
  //   • Drag (movement past DRAG_DEAD_ZONE) → Tinder-style swipe with live
  //       transform; release past SWIPE_DX_MIN flies off + rates the card,
  //       release under SWIPE_DX_MIN snaps back to center.
  const onPointerDown = (e: React.PointerEvent) => {
    wasHeldRef.current = false;
    wasSwipedRef.current = false;
    isDraggingRef.current = false;
    downXRef.current = e.clientX;
    downYRef.current = e.clientY;
    // Capture the pointer so move/up events fire on this element even if
    // the finger leaves the card bounds. Critical for mobile drag.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* some browsers throw on null/non-active pointers — ignore */
    }
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      // Only fire hold if the user hasn't started dragging
      if (!isDraggingRef.current) {
        wasHeldRef.current = true;
        setHolding(true);
      }
    }, HOLD_THRESHOLD_MS);
  };

  const cancelTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (downXRef.current === null || downYRef.current === null) return;
    if (wasHeldRef.current) return; // hold takes precedence; ignore movement
    const dx = e.clientX - downXRef.current;
    const dy = e.clientY - downYRef.current;
    // Promote to "dragging" once the user moves past the dead zone.
    if (!isDraggingRef.current && Math.hypot(dx, dy) >= DRAG_DEAD_ZONE) {
      isDraggingRef.current = true;
      cancelTimer(); // no longer eligible to become a hold
    }
    if (isDraggingRef.current) {
      // Dampen vertical movement (×0.3) so the card mostly slides sideways,
      // dating-app style, even when the finger drifts up/down.
      setSnapping(false);
      setDragX(dx);
      setDragY(dy * 0.3);
    }
  };

  const resetDrag = (animate: boolean) => {
    setSnapping(animate);
    setDragX(0);
    setDragY(0);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    cancelTimer();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }
    if (wasHeldRef.current) {
      // Was a hold — drop the meaning overlay. Leave wasHeldRef set so the
      // upcoming synthesized click event knows to skip navigation.
      setHolding(false);
      return;
    }
    if (!isDraggingRef.current) return; // simple tap — onClick will handle
    isDraggingRef.current = false;

    const dx = downXRef.current !== null ? e.clientX - downXRef.current : 0;
    if (Math.abs(dx) >= SWIPE_DX_MIN) {
      // Past the threshold — fly off the screen in the swipe direction,
      // then rate the card and reset position for the next one.
      wasSwipedRef.current = true;
      const dir = dx > 0 ? 1 : -1;
      const flyTo = dir * (window.innerWidth + 200);
      setSnapping(true);
      setDragX(flyTo);
      // Tilt scales naturally with dragX in the transform — no separate value.
      window.setTimeout(() => {
        rateAndAdvance(dir > 0); // right = knew, left = didn't
        // Snap the card back to center INSTANTLY (no transition) so the
        // next card appears at rest, not flying in from off-screen.
        setSnapping(false);
        setDragX(0);
        setDragY(0);
      }, 220);
      return;
    }
    // Under threshold — snap back to center with a brief animation.
    resetDrag(true);
  };

  const onPointerCancel = (e: React.PointerEvent) => {
    cancelTimer();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }
    setHolding(false);
    wasHeldRef.current = false;
    wasSwipedRef.current = false;
    isDraggingRef.current = false;
    downXRef.current = null;
    downYRef.current = null;
    resetDrag(true);
  };

  const onClick = (e: React.MouseEvent) => {
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

  // Setup phase — the user picks options BEFORE the card reveal game starts.
  // All choices are locked once "Start session" is pressed; to change any of
  // them mid-stream the user must end the session and pick again.
  if (phase === 'setup') {
    return (
      <SetupScreen
        cfg={cfg}
        vocab={vocab}
        srs={srsRef.current}
        onStart={startSession}
      />
    );
  }

  if (!current) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2" onClick={endSession}>
            <ArrowLeft className="h-4 w-4" />
            Back to setup
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-muted-foreground">
              No cards match the selected level filter ({cfg.levelOp} L{cfg.levelValue}).
            </p>
            <Button onClick={endSession}>Pick different options</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const type = classifyRow(current);
  const typeStyle = readingTypeStyle(type);
  const progressPct = ((index + 1) / order.length) * 100;
  const showMeaning = cfg.holdToReveal ? holding : revealed;

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
      <div className="px-[10vw] py-[10vh] min-h-[100dvh] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2" onClick={endSession}>
            <ArrowLeft className="h-4 w-4" />
            End session
          </Button>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground tabular-nums px-1">
              {index + 1} / {order.length}
            </span>
            <span
              className="text-[10px] text-muted-foreground/70 tabular-nums px-1 hidden sm:inline"
              title="Cards still at level 0 or 1 · cards at level 4 (mastered)"
            >
              {srsStats.due}↻ · {srsStats.mastered}✓
            </span>
            <span
              className="text-[10px] text-muted-foreground/60 px-1 hidden md:inline"
              title="Locked options for this session"
            >
              {cfg.order} · {cfg.levelOp}L{cfg.levelValue}
            </span>
          </div>
        </div>

        <Card
          className="relative border-border/60 select-none cursor-grab active:cursor-grabbing overflow-hidden flex-1 flex flex-col touch-none rounded-3xl shadow-lg"
          style={{
            // touchAction:'none' (via touch-none) lets the card own pan-x
            // gestures instead of the browser scrolling the page.
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            // Live drag transform — finger position drives translate + tilt.
            transform: `translate(${dragX}px, ${dragY}px) rotate(${dragX * 0.04}deg)`,
            transition: snapping ? 'transform 220ms ease-out' : 'none',
            willChange: 'transform',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
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

          {/* Swipe tint overlays — green right (knew), red left (didn't).
              Opacity ramps with drag distance and clamps at the threshold. */}
          {dragX > 0 && (
            <div
              className="absolute inset-0 z-0 pointer-events-none bg-emerald-500"
              style={{ opacity: Math.min(0.18, dragX / SWIPE_DX_MIN * 0.18) }}
            />
          )}
          {dragX < 0 && (
            <div
              className="absolute inset-0 z-0 pointer-events-none bg-red-500"
              style={{ opacity: Math.min(0.18, -dragX / SWIPE_DX_MIN * 0.18) }}
            />
          )}
          {/* Tiny fullscreen toggle — fully isolated from the card's tap handler */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              enterFullscreen();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 z-20 h-8 w-8 rounded-full bg-card hover:bg-accent border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground transition"
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

          <CardContent className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-8">
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

        {/* Floor-level-up celebration */}
        {levelUp && (
          <LevelUpCelebration key={`lu-${levelUp.level}-${Date.now()}`} level={levelUp.level} />
        )}
      </div>
    );
  }

  // Full-screen drill view
  return (
    <div
      className="fixed inset-0 z-50 bg-background select-none overflow-hidden touch-none"
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
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

      {/* Swipe tint overlays (fullscreen) */}
      {dragX > 0 && (
        <div
          className="absolute inset-0 z-0 pointer-events-none bg-emerald-500"
          style={{ opacity: Math.min(0.18, dragX / SWIPE_DX_MIN * 0.18) }}
        />
      )}
      {dragX < 0 && (
        <div
          className="absolute inset-0 z-0 pointer-events-none bg-red-500"
          style={{ opacity: Math.min(0.18, -dragX / SWIPE_DX_MIN * 0.18) }}
        />
      )}

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
          <span
            className="text-[10px] text-muted-foreground/70 tabular-nums"
            title="Cards still at level 0 or 1 · cards at level 4 (mastered)"
          >
            {srsStats.due}↻ · {srsStats.mastered}✓
          </span>
        </div>
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
      <div
        className="h-full w-full flex flex-col items-center px-6 pt-[42vh] pb-[18vh]"
        style={{
          transform: `translate(${dragX}px, ${dragY}px) rotate(${dragX * 0.04}deg)`,
          transition: snapping ? 'transform 220ms ease-out' : 'none',
          willChange: 'transform',
        }}
      >
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

      {/* Floor-level-up celebration (fullscreen) */}
      {levelUp && (
        <LevelUpCelebration key={`lu-fs-${levelUp.level}-${Date.now()}`} level={levelUp.level} />
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

// ---------------------------------------------------------------------------
// Floor-level-up celebration — flashes a centered up-arrow when the
// minimum SRS level across the session pool moves up. ~1s lifespan.
// ---------------------------------------------------------------------------

function LevelUpCelebration({ level }: { level: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in-50 duration-300">
        <div className="relative">
          <ArrowUp className="h-24 w-24 text-emerald-500 drop-shadow-lg animate-bounce" />
          <div className="absolute inset-0 -z-10 bg-emerald-500/20 blur-2xl rounded-full" />
        </div>
        <div className="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-lg tabular-nums">
          All ≥ L{level}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Setup screen — pick session shape, start the drill
// ---------------------------------------------------------------------------

function SetupScreen({
  cfg: initialCfg,
  vocab,
  srs,
  onStart,
}: {
  cfg: QueueConfig;
  vocab: MergedVocabRow[];
  srs: SrsState;
  onStart: (cfg: QueueConfig) => void;
}) {
  const [draft, setDraft] = useState<QueueConfig>(initialCfg);

  // If the parent re-loads cfg (e.g. cloud sync arrives late), refresh draft.
  useEffect(() => {
    setDraft(initialCfg);
  }, [initialCfg]);

  const matching = useMemo(
    () => filterByLevel(vocab, srs, draft.levelOp, draft.levelValue).length,
    [vocab, srs, draft.levelOp, draft.levelValue],
  );

  const orderOptions: { id: OrderMode; label: string; hint: string }[] = [
    { id: 'teacher', label: 'Teacher order', hint: 'JSON order — predictable progression' },
    { id: 'shuffle', label: 'Shuffle (smart)', hint: 'Weighted by SRS level — weak cards more often' },
    { id: 'lowest', label: 'Lowest level first', hint: 'Sort by current level — struggling cards first' },
  ];

  const canStart = vocab.length > 0 && matching > 0;

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/study/kanji">
          <Button variant="ghost" size="sm" className="gap-1 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Hub
          </Button>
        </Link>
        <span className="text-sm text-muted-foreground">Start a drill session</span>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Cards */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Cards</h3>
            <div className="flex flex-wrap gap-2">
              {CARD_LIMIT_OPTIONS.map(({ v, label }) => (
                <Button
                  key={v}
                  size="sm"
                  variant={draft.cardLimit === v ? 'default' : 'outline'}
                  onClick={() => setDraft({ ...draft, cardLimit: v })}
                  className="min-w-[60px]"
                >
                  {label}
                </Button>
              ))}
            </div>
          </section>

          {/* Level filter */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Level filter</h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex gap-1">
                {(['<=', '>='] as LevelOp[]).map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setDraft({ ...draft, levelOp: op })}
                    className={`h-9 px-3 text-sm font-medium rounded-md border transition-colors ${
                      draft.levelOp === op
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-input hover:border-foreground/30 hover:text-foreground'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">L</span>
              <div className="inline-flex gap-1">
                {[0, 1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setDraft({ ...draft, levelValue: n as 0 | 1 | 2 | 3 | 4 })}
                    className={`h-9 w-9 text-sm font-medium tabular-nums rounded-md border transition-colors ${
                      draft.levelValue === n
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-input hover:border-foreground/30 hover:text-foreground'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {matching > 0
                ? `${matching} card${matching === 1 ? '' : 's'} match (level ${draft.levelOp} ${draft.levelValue}).`
                : `No cards match level ${draft.levelOp} ${draft.levelValue}. Try the other operator.`}
            </p>
          </section>

          {/* Order */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Order</h3>
            <div className="grid gap-2">
              {orderOptions.map(({ id, label, hint }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDraft({ ...draft, order: id })}
                  className={`text-left rounded-lg border p-3 transition-colors ${
                    draft.order === id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/40'
                      : 'border-input hover:border-foreground/30'
                  }`}
                >
                  <div className="font-medium text-sm">{label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Reveal meaning */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Meaning reveal</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={draft.holdToReveal ? 'default' : 'outline'}
                onClick={() => setDraft({ ...draft, holdToReveal: true })}
                size="sm"
                className="gap-2"
              >
                <EyeOff className="h-4 w-4" />
                Hold to reveal
              </Button>
              <Button
                variant={!draft.holdToReveal ? 'default' : 'outline'}
                onClick={() => setDraft({ ...draft, holdToReveal: false })}
                size="sm"
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Always show
              </Button>
            </div>
          </section>

          <Button
            onClick={() => onStart(draft)}
            disabled={!canStart}
            className="w-full min-h-[48px]"
            size="lg"
          >
            Start session
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">
            Swipe right or press ↑ to mark <span className="text-emerald-600 dark:text-emerald-400 font-medium">knew it</span>; swipe left or press ↓ to mark <span className="text-red-600 dark:text-red-400 font-medium">didn&apos;t</span>. Tap or use ←/→ to navigate.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
