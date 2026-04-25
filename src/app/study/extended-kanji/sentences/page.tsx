'use client';

/**
 * Extended Kanji — master sentences browser
 * Route: /study/extended-kanji/sentences
 *
 * Shows ALL sentences from KANJI_REFERENCE.md:
 *   • PART 1 main — 106, attached to a specific kanji
 *   • PART 1 extras — 24 from extraSections (review practice, warm-ups, etc.)
 *   • PART 3 — 38 grouped by topic
 * Total: 168
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Quote, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  ExtendedKanji,
  ExtendedKanjiSentence,
  TopicSentenceGroup,
} from '@/types/extended-kanji';
import { InteractiveSentence } from '@/components/extended-kanji/interactive-sentence';

type View = 'all' | 'part1' | 'extras' | 'topics';

export default function ExtendedKanjiSentencesPage() {
  const [part1, setPart1] = useState<ExtendedKanjiSentence[]>([]);
  const [extras, setExtras] = useState<ExtendedKanjiSentence[]>([]);
  const [topics, setTopics] = useState<TopicSentenceGroup[]>([]);
  const [kanjiIdByChar, setKanjiIdByChar] = useState<Record<string, string>>({});
  const [kanjiByChar, setKanjiByChar] = useState<Record<string, ExtendedKanji>>({});
  const [kanjiCharSet, setKanjiCharSet] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('all');
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [kanjiFilter, setKanjiFilter] = useState<string>('all');
  const [showAutoParents, setShowAutoParents] = useState(true);

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
      const map: Record<string, string> = {};
      const byChar: Record<string, ExtendedKanji> = {};
      const chars: string[] = [];
      (kData.kanji as ExtendedKanji[]).forEach((k) => {
        map[k.kanji] = k.id;
        byChar[k.kanji] = k;
        chars.push(k.kanji);
      });
      setKanjiIdByChar(map);
      setKanjiByChar(byChar);
      setKanjiCharSet(chars);
      setLoading(false);
    })();
  }, []);

  /** Runtime: which of the 86 extended kanji appear in this sentence, beyond
   * the teacher-tagged parent? */
  const autoKanjiIn = (jp: string, teacherParent?: string): string[] => {
    const skip = new Set<string>(teacherParent ? [teacherParent] : []);
    return kanjiCharSet.filter((c) => jp.includes(c) && !skip.has(c));
  };

  const totalAll = part1.length + extras.length + topics.reduce((s, g) => s + g.sentences.length, 0);
  // Expose every taught kanji as a filter option — not just those with a teacher-assigned
  // parent sentence. This lets the runtime substring match surface all occurrences.
  const allParentKanji = useMemo(() => [...kanjiCharSet].sort(), [kanjiCharSet]);

  const matchesSearch = (jp: string, en: string = ''): boolean => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return jp.toLowerCase().includes(q) || en.toLowerCase().includes(q);
  };

  const matchesKanjiFilter = (jp: string, parent?: string) => {
    if (kanjiFilter === 'all') return true;
    if (parent === kanjiFilter) return true;
    // Auto-discovered: kanji appears inside the sentence text
    return showAutoParents && jp.includes(kanjiFilter);
  };

  const filteredPart1 = useMemo(
    () =>
      part1.filter(
        (s) => matchesSearch(s.japanese, s.english) && matchesKanjiFilter(s.japanese, s.parentKanji),
      ),
    [part1, search, kanjiFilter, showAutoParents],
  );

  const filteredExtras = useMemo(
    () =>
      extras.filter(
        (s) => matchesSearch(s.japanese, s.english) && matchesKanjiFilter(s.japanese, s.parentKanji),
      ),
    [extras, search, kanjiFilter, showAutoParents],
  );

  const filteredTopics = useMemo(() => {
    return topics
      .filter((t) => topicFilter === 'all' || t.topic === topicFilter)
      .map((t) => ({
        ...t,
        sentences: t.sentences.filter(
          (s) => matchesSearch(s) && matchesKanjiFilter(s),
        ),
      }))
      .filter((t) => t.sentences.length > 0);
  }, [topics, search, topicFilter, kanjiFilter, showAutoParents]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const showPart1 = view === 'all' || view === 'part1';
  const showExtras = view === 'all' || view === 'extras';
  const showTopics = view === 'all' || view === 'topics';
  const visibleCount =
    (showPart1 ? filteredPart1.length : 0) +
    (showExtras ? filteredExtras.length : 0) +
    (showTopics ? filteredTopics.reduce((s, t) => s + t.sentences.length, 0) : 0);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/study/extended-kanji">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <Badge variant="secondary">All sentences</Badge>
      </div>

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Quote className="h-7 w-7" />
          Sentences
        </h1>
        <p className="text-muted-foreground">
          {visibleCount} of {totalAll} sentences visible · PART 1 main ({part1.length}) · PART 1 review &amp; warm-ups ({extras.length}) · PART 3 topics ({topics.reduce((s, g) => s + g.sentences.length, 0)})
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {([['all', 'All'], ['part1', `Main (${part1.length})`], ['extras', `Review/warm-ups (${extras.length})`], ['topics', `By topic (${topics.reduce((s, g) => s + g.sentences.length, 0)})`]] as const).map(
          ([v, label]) => (
            <Button
              key={v}
              variant={view === v ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView(v)}
            >
              {label}
            </Button>
          ),
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search Japanese or English…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {(view === 'all' || view === 'topics') && (
          <Select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="w-[200px]"
          >
            <option value="all">All topics</option>
            {topics.map((t) => (
              <option key={t.topic} value={t.topic}>
                {t.topic}
              </option>
            ))}
          </Select>
        )}
        <Select
          value={kanjiFilter}
          onChange={(e) => setKanjiFilter(e.target.value)}
          className="w-[170px]"
        >
          <option value="all">Any kanji</option>
          {allParentKanji.map((c) => (
            <option key={c} value={c}>Contains: {c}</option>
          ))}
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showAutoParents}
            onChange={(e) => setShowAutoParents(e.target.checked)}
            className="w-4 h-4"
          />
          Show auto-discovered kanji in each sentence (runtime match across {kanjiCharSet.length} taught)
        </label>
        <span className="flex items-center gap-1.5">
          <Badge className="text-xs">大</Badge> Teacher-tagged parent
        </span>
        <span className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-xs border-dashed">大</Badge>
          Auto-discovered
        </span>
      </div>

      {/* PART 1 main */}
      {showPart1 && filteredPart1.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Main example sentences
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                · {filteredPart1.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPart1.map((s, i) => (
                <InteractiveSentence
                  key={`p1-${i}`}
                  japanese={s.japanese}
                  english={s.english}
                  kanjiByChar={kanjiByChar}
                  footer={
                    <SentenceMeta
                      kanji={s.parentKanji}
                      autoKanji={showAutoParents ? autoKanjiIn(s.japanese, s.parentKanji) : []}
                      kanjiIdByChar={kanjiIdByChar}
                    />
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PART 1 extras */}
      {showExtras && filteredExtras.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Review practice &amp; warm-ups
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                · {filteredExtras.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredExtras.map((s, i) => (
                <InteractiveSentence
                  key={`ex-${i}`}
                  japanese={s.japanese}
                  english={s.english}
                  kanjiByChar={kanjiByChar}
                  footer={
                    <SentenceMeta
                      kanji={s.parentKanji}
                      section={s.sectionTitle}
                      autoKanji={showAutoParents ? autoKanjiIn(s.japanese, s.parentKanji) : []}
                      kanjiIdByChar={kanjiIdByChar}
                    />
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PART 3 topics */}
      {showTopics && filteredTopics.map((group) => (
        <Card key={group.topic}>
          <CardHeader>
            <CardTitle className="text-xl">
              {group.topic}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                · {group.sentences.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {group.sentences.map((s, i) => (
                <InteractiveSentence
                  key={`t-${group.topic}-${i}`}
                  japanese={s}
                  kanjiByChar={kanjiByChar}
                  footer={
                    <SentenceMeta
                      autoKanji={showAutoParents ? autoKanjiIn(s) : []}
                      kanjiIdByChar={kanjiIdByChar}
                    />
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {visibleCount === 0 && (
        <Card>
          <CardContent className="pt-6 text-center space-y-3">
            <p className="text-muted-foreground">No sentences match your filters.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setTopicFilter('all');
                setKanjiFilter('all');
                setView('all');
              }}
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SentenceMeta({
  kanji,
  section,
  autoKanji = [],
  kanjiIdByChar,
}: {
  kanji?: string;
  section?: string;
  autoKanji?: string[];
  kanjiIdByChar: Record<string, string>;
}) {
  if (!kanji && !section && autoKanji.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 text-xs">
      {kanji &&
        (kanjiIdByChar[kanji] ? (
          <Link href={`/study/extended-kanji/${encodeURIComponent(kanjiIdByChar[kanji])}`}>
            <Badge className="cursor-pointer">Parent: {kanji}</Badge>
          </Link>
        ) : (
          <Badge>Parent: {kanji}</Badge>
        ))}
      {autoKanji.map((c) => {
        const id = kanjiIdByChar[c];
        return id ? (
          <Link
            key={`auto-${c}`}
            href={`/study/extended-kanji/${encodeURIComponent(id)}`}
            title={`Auto-discovered: ${c} appears in this sentence`}
          >
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-accent border-dashed"
            >
              {c}
            </Badge>
          </Link>
        ) : null;
      })}
      {section && <Badge variant="secondary">{section}</Badge>}
    </div>
  );
}
