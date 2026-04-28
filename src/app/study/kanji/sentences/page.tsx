'use client';

/**
 * Kanji — master sentences browser (Reference · Sentence variant).
 * Route: /study/kanji/sentences
 *
 * Three modes:
 *   • Reader  — calm single-column list, hairline dividers, generous whitespace
 *   • Study   — one-sentence-at-a-time focus drill (full-screen-ish), tap left/right,
 *               press & hold to reveal English meaning
 *   • Topics  — accordion grouped by PART 3 topic for browsing
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Eye,
  Layers,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { KanjiContextualSwitch } from '@/components/kanji/contextual-switch';
import {
  ExtendedKanji,
  ExtendedKanjiSentence,
  SentenceRuby,
  TopicSentenceGroup,
} from '@/types/extended-kanji';
import { InteractiveSentence } from '@/components/extended-kanji/interactive-sentence';

type ViewMode = 'reader' | 'study' | 'topics';

interface UnifiedSentence {
  id: string;
  japanese: string;
  english: string;
  rubies?: SentenceRuby[];
  origin: 'part1' | 'part1_extras' | 'part3';
  parentKanji?: string;
  sectionTitle?: string;
  topic?: string;
}

const VIEW_MODES: { id: ViewMode; label: string; Icon: typeof BookOpen }[] = [
  { id: 'reader', label: 'Reader', Icon: BookOpen },
  { id: 'study', label: 'Study', Icon: Eye },
  { id: 'topics', label: 'Topics', Icon: Layers },
];

function originLabel(origin: UnifiedSentence['origin']): string {
  if (origin === 'part1') return 'Main';
  if (origin === 'part1_extras') return 'Review';
  return 'Topic';
}

export default function SentencesPage() {
  // ---- data ----
  const [part1, setPart1] = useState<ExtendedKanjiSentence[]>([]);
  const [extras, setExtras] = useState<ExtendedKanjiSentence[]>([]);
  const [topics, setTopics] = useState<TopicSentenceGroup[]>([]);
  const [kanjiByChar, setKanjiByChar] = useState<Record<string, ExtendedKanji>>({});
  const [kanjiIdByChar, setKanjiIdByChar] = useState<Record<string, string>>({});
  const [kanjiCharSet, setKanjiCharSet] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // ---- ui ----
  const [view, setView] = useState<ViewMode>('reader');
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [kanjiFilter, setKanjiFilter] = useState<string>('all');
  const [showAutoParents, setShowAutoParents] = useState(true);

  // ---- study mode ----
  const [studyIndex, setStudyIndex] = useState(0);
  const [englishHeld, setEnglishHeld] = useState(false);

  // hold-vs-tap detection (mirrors the vocab-reveal pattern)
  const HOLD_THRESHOLD_MS = 280;
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasHeldRef = useRef(false);
  const downXRef = useRef<number | null>(null);
  const lastNavRef = useRef(0);

  useEffect(() => {
    (async () => {
      const [sRes, kRes] = await Promise.all([
        fetch('/seed-data/extended-kanji/sentences.json'),
        fetch('/seed-data/extended-kanji/kanji.json'),
      ]);
      const sData = await sRes.json();
      const kData = await kRes.json();
      setPart1(sData.part1);
      setExtras(sData.part1Extras);
      setTopics(sData.part3);
      const idMap: Record<string, string> = {};
      const byChar: Record<string, ExtendedKanji> = {};
      const chars: string[] = [];
      (kData.kanji as ExtendedKanji[]).forEach((k) => {
        idMap[k.kanji] = k.id;
        byChar[k.kanji] = k;
        chars.push(k.kanji);
      });
      setKanjiIdByChar(idMap);
      setKanjiByChar(byChar);
      setKanjiCharSet(chars);
      setLoading(false);
    })();
  }, []);

  // ---- unified list ----
  const unified = useMemo<UnifiedSentence[]>(() => {
    const out: UnifiedSentence[] = [];
    part1.forEach((s, i) =>
      out.push({
        id: `p1-${i}`,
        japanese: s.japanese,
        english: s.english,
        rubies: s.rubies,
        origin: 'part1',
        parentKanji: s.parentKanji,
      }),
    );
    extras.forEach((s, i) =>
      out.push({
        id: `ex-${i}`,
        japanese: s.japanese,
        english: s.english,
        rubies: s.rubies,
        origin: 'part1_extras',
        parentKanji: s.parentKanji,
        sectionTitle: s.sectionTitle,
      }),
    );
    topics.forEach((g) =>
      g.sentences.forEach((jp, i) =>
        out.push({
          id: `t-${g.topic}-${i}`,
          japanese: jp,
          english: '',
          rubies: g.rubies?.[i],
          origin: 'part3',
          topic: g.topic,
        }),
      ),
    );
    return out;
  }, [part1, extras, topics]);

  const allParentKanji = useMemo(() => [...kanjiCharSet].sort(), [kanjiCharSet]);

  const matchesSearch = useCallback(
    (s: UnifiedSentence) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        s.japanese.toLowerCase().includes(q) ||
        (s.english || '').toLowerCase().includes(q)
      );
    },
    [search],
  );

  const matchesKanji = useCallback(
    (s: UnifiedSentence) => {
      if (kanjiFilter === 'all') return true;
      if (s.parentKanji === kanjiFilter) return true;
      return showAutoParents && s.japanese.includes(kanjiFilter);
    },
    [kanjiFilter, showAutoParents],
  );

  const matchesTopic = useCallback(
    (s: UnifiedSentence) => topicFilter === 'all' || s.topic === topicFilter,
    [topicFilter],
  );

  const filtered = useMemo(
    () => unified.filter((s) => matchesSearch(s) && matchesKanji(s) && matchesTopic(s)),
    [unified, matchesSearch, matchesKanji, matchesTopic],
  );

  // Reset study index when the queue changes
  useEffect(() => {
    if (studyIndex >= filtered.length) setStudyIndex(0);
  }, [filtered.length, studyIndex]);

  // ---- study-mode pointer + key handlers ----
  const studyNext = useCallback(() => {
    if (filtered.length === 0) return;
    setStudyIndex((i) => (i + 1) % filtered.length);
  }, [filtered.length]);

  const studyPrev = useCallback(() => {
    if (filtered.length === 0) return;
    setStudyIndex((i) => (i - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  // Refs so the keyboard listener stays mounted once
  const studyNextRef = useRef(studyNext);
  const studyPrevRef = useRef(studyPrev);
  const viewRef = useRef(view);
  useEffect(() => {
    studyNextRef.current = studyNext;
    studyPrevRef.current = studyPrev;
    viewRef.current = view;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (viewRef.current !== 'study') return;
      if (e.repeat && (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === ' '))
        return;
      const now = Date.now();
      const debounced = now - lastNavRef.current < 150;
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          if (debounced) return;
          lastNavRef.current = now;
          studyNextRef.current();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (debounced) return;
          lastNavRef.current = now;
          studyPrevRef.current();
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onStudyPointerDown = (e: React.PointerEvent) => {
    wasHeldRef.current = false;
    downXRef.current = e.clientX;
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      wasHeldRef.current = true;
      setEnglishHeld(true);
    }, HOLD_THRESHOLD_MS);
  };

  const cancelHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const onStudyPointerUp = () => {
    cancelHoldTimer();
    if (wasHeldRef.current) {
      setEnglishHeld(false);
    }
  };

  const onStudyPointerCancel = () => {
    cancelHoldTimer();
    setEnglishHeld(false);
    wasHeldRef.current = false;
    downXRef.current = null;
  };

  const onStudyClick = (e: React.MouseEvent) => {
    if (wasHeldRef.current) {
      wasHeldRef.current = false;
      return;
    }
    const now = Date.now();
    if (now - lastNavRef.current < 150) return;
    lastNavRef.current = now;
    const x = downXRef.current ?? e.clientX;
    const halfway = window.innerWidth / 2;
    if (x < halfway) studyPrev();
    else studyNext();
    downXRef.current = null;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <SubPageHeader />
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </div>
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // Header / mode switcher / filters — shared across modes
  // ---------------------------------------------------------------------------
  const header = (
    <div className="space-y-4">
      <SubPageHeader rightSlot={
        <Badge variant="secondary" className="text-xs">
          {filtered.length} of {unified.length}
        </Badge>
      } />

      {/* Mode segmented control */}
      <div className="inline-flex p-1 rounded-lg bg-muted/60 border border-border/40 mx-auto">
        {VIEW_MODES.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition ${
              view === id
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  const filtersRow = (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search Japanese or English…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-background/60 border-border/40"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Select
          value={kanjiFilter}
          onChange={(e) => setKanjiFilter(e.target.value)}
          className="bg-background/60 border-border/40"
        >
          <option value="all">Any kanji</option>
          {allParentKanji.map((c) => (
            <option key={c} value={c}>
              Contains: {c}
            </option>
          ))}
        </Select>
        <Select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="bg-background/60 border-border/40"
        >
          <option value="all">All topics</option>
          {topics.map((t) => (
            <option key={t.topic} value={t.topic}>
              {t.topic}
            </option>
          ))}
        </Select>
      </div>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={showAutoParents}
          onChange={(e) => setShowAutoParents(e.target.checked)}
          className="w-4 h-4"
        />
        Match kanji appearing inside the sentence (not just teacher-tagged parents)
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Sticky header bar with mode switcher + filters; calmer surface */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/30">
        <div className="container max-w-3xl mx-auto px-4 py-4 space-y-4 flex flex-col items-center">
          {header}
        </div>
      </header>

      {/* Filters live below the sticky header — not sticky themselves so reading
        gets generous space */}
      <div className="container max-w-3xl mx-auto px-4 py-5 border-b border-border/20">
        {filtersRow}
      </div>

      <main className="pb-20">
        {view === 'reader' && (
          <ReaderView
            sentences={filtered}
            kanjiByChar={kanjiByChar}
            kanjiIdByChar={kanjiIdByChar}
          />
        )}

        {view === 'study' && (
          <StudyView
            sentences={filtered}
            index={studyIndex}
            englishHeld={englishHeld}
            kanjiByChar={kanjiByChar}
            onPointerDown={onStudyPointerDown}
            onPointerUp={onStudyPointerUp}
            onPointerCancel={onStudyPointerCancel}
            onClick={onStudyClick}
            onPrev={studyPrev}
            onNext={studyNext}
          />
        )}

        {view === 'topics' && (
          <TopicsView
            topics={topics}
            unified={unified}
            kanjiByChar={kanjiByChar}
            search={search}
            kanjiFilter={kanjiFilter}
            showAutoParents={showAutoParents}
          />
        )}
      </main>
    </div>
  );
}

function SubPageHeader({ rightSlot }: { rightSlot?: React.ReactNode }) {
  return (
    <div className="w-full flex items-center justify-between gap-2 flex-wrap">
      <Link href="/study/kanji">
        <Button variant="ghost" size="sm" className="gap-1 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Hub
        </Button>
      </Link>
      <div className="flex items-center gap-2">
        {rightSlot}
        <KanjiContextualSwitch />
      </div>
    </div>
  );
}

// =============================================================================
// READER VIEW — calm vertical column with hairline dividers
// =============================================================================
function ReaderView({
  sentences,
  kanjiByChar,
  kanjiIdByChar,
}: {
  sentences: UnifiedSentence[];
  kanjiByChar: Record<string, ExtendedKanji>;
  kanjiIdByChar: Record<string, string>;
}) {
  if (sentences.length === 0) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-16 text-center text-muted-foreground">
        No sentences match the current filters.
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6">
      <ul className="divide-y divide-border/30">
        {sentences.map((s) => (
          <li key={s.id} className="py-9">
            <InteractiveSentence
              bare
              japanese={s.japanese}
              english={s.english}
              rubies={s.rubies}
              kanjiByChar={kanjiByChar}
            />
            <div className="mt-3 text-[11px] text-muted-foreground/70 flex flex-wrap gap-x-2.5 gap-y-1">
              <span className="uppercase tracking-wider">{originLabel(s.origin)}</span>
              {s.parentKanji && (
                <span>
                  ·{' '}
                  {kanjiIdByChar[s.parentKanji] ? (
                    <Link
                      href={`/study/kanji/${encodeURIComponent(
                        kanjiIdByChar[s.parentKanji],
                      )}`}
                      className="hover:text-foreground transition"
                    >
                      {s.parentKanji}
                    </Link>
                  ) : (
                    <span>{s.parentKanji}</span>
                  )}
                </span>
              )}
              {s.topic && <span>· {s.topic}</span>}
              {s.sectionTitle && <span>· {s.sectionTitle}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// =============================================================================
// STUDY VIEW — focus drill, one sentence at a time, hold-to-reveal English
// =============================================================================
function StudyView({
  sentences,
  index,
  englishHeld,
  kanjiByChar,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onClick,
  onPrev,
  onNext,
}: {
  sentences: UnifiedSentence[];
  index: number;
  englishHeld: boolean;
  kanjiByChar: Record<string, ExtendedKanji>;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onClick: (e: React.MouseEvent) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (sentences.length === 0) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-16 text-center text-muted-foreground">
        No sentences match the current filters.
      </div>
    );
  }
  const current = sentences[index];
  if (!current) return null;
  const progressPct = ((index + 1) / sentences.length) * 100;

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 space-y-5">
      <div
        className="relative rounded-xl border border-border/40 bg-card/40 select-none cursor-pointer overflow-hidden"
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
        {/* Thin progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Counter top-right */}
        <div className="absolute top-3 right-4 text-xs text-muted-foreground tabular-nums">
          {index + 1} / {sentences.length}
        </div>

        <div className="px-6 sm:px-10 pt-16 pb-10 flex flex-col items-center min-h-[55vh] justify-center gap-8">
          <div key={`s-${index}`} className="w-full">
            <InteractiveSentence
              bare
              japanese={current.japanese}
              english={undefined /* hidden until held */}
              rubies={current.rubies}
              kanjiByChar={kanjiByChar}
            />
          </div>

          {/* English meaning — fades in only while held */}
          <div
            key={`en-${index}`}
            className={`text-base sm:text-lg font-light italic text-foreground/75 text-center max-w-xl transition-opacity duration-200 ease-out min-h-[1.5em] ${
              englishHeld && current.english ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={!englishHeld}
          >
            {current.english || ' '}
          </div>
        </div>
      </div>

      {/* Hint — only shows when no English available for the current item */}
      <div className="text-center text-[11px] text-muted-foreground/60">
        Tap right · next · Tap left · previous · Press &amp; hold · meaning
      </div>
    </div>
  );
}

// =============================================================================
// TOPICS VIEW — accordion grouped by source / topic
// =============================================================================
function TopicsView({
  topics,
  unified,
  kanjiByChar,
  search,
  kanjiFilter,
  showAutoParents,
}: {
  topics: TopicSentenceGroup[];
  unified: UnifiedSentence[];
  kanjiByChar: Record<string, ExtendedKanji>;
  search: string;
  kanjiFilter: string;
  showAutoParents: boolean;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const matches = useCallback(
    (jp: string, en: string, parent: string | undefined) => {
      const q = search.trim().toLowerCase();
      if (q && !jp.toLowerCase().includes(q) && !en.toLowerCase().includes(q)) return false;
      if (kanjiFilter !== 'all') {
        if (parent === kanjiFilter) return true;
        if (showAutoParents && jp.includes(kanjiFilter)) return true;
        return false;
      }
      return true;
    },
    [search, kanjiFilter, showAutoParents],
  );

  // Three buckets: Main (part1), Review (part1_extras), Topic groups (part3)
  const part1Items = unified.filter((u) => u.origin === 'part1');
  const extrasItems = unified.filter((u) => u.origin === 'part1_extras');

  const groups: { key: string; label: string; items: UnifiedSentence[] }[] = [
    { key: '__main', label: 'Main examples', items: part1Items.filter((s) => matches(s.japanese, s.english, s.parentKanji)) },
    { key: '__review', label: 'Review & warm-ups', items: extrasItems.filter((s) => matches(s.japanese, s.english, s.parentKanji)) },
    ...topics.map((t) => ({
      key: `t-${t.topic}`,
      label: t.topic,
      items: t.sentences
        .map(
          (jp, i): UnifiedSentence => ({
            id: `t-${t.topic}-${i}`,
            japanese: jp,
            english: '',
            rubies: t.rubies?.[i],
            origin: 'part3',
            topic: t.topic,
          }),
        )
        .filter((s) => matches(s.japanese, '', undefined)),
    })),
  ].filter((g) => g.items.length > 0);

  if (groups.length === 0) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-16 text-center text-muted-foreground">
        No sentences match the current filters.
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 space-y-2">
      {groups.map(({ key, label, items }) => {
        const isOpen = open.has(key);
        return (
          <Card key={key} className="border-border/40 overflow-hidden">
            <button
              type="button"
              onClick={() => toggle(key)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-accent/30 transition"
            >
              <div className="flex items-center gap-3">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="font-medium text-base">{label}</span>
                <span className="text-xs text-muted-foreground">· {items.length}</span>
              </div>
            </button>
            {isOpen && (
              <CardContent className="px-5 pb-5 pt-0">
                <ul className="divide-y divide-border/30">
                  {items.map((s) => (
                    <li key={s.id} className="py-5">
                      <InteractiveSentence
                        bare
                        japanese={s.japanese}
                        english={s.english}
                        rubies={s.rubies}
                        kanjiByChar={kanjiByChar}
                      />
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
