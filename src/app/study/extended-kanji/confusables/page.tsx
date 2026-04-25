'use client';

/**
 * Extended Kanji — study aids (PART 5 of KANJI_REFERENCE.md)
 * Route: /study/extended-kanji/confusables
 *
 * Renders confusable groups, special readings, verb stems, section labels,
 * and dialog phrases — everything in the study_aids JSON.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, GitCompareArrows, MessageCircle, Sparkles, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StudyAids } from '@/types/extended-kanji';

export default function ExtendedKanjiConfusablesPage() {
  const [aids, setAids] = useState<StudyAids | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/seed-data/extended-kanji/study_aids.json');
      const data = await res.json();
      setAids({
        confusables: data.confusables,
        specialReadings: data.specialReadings,
        verbStems: data.verbStems,
        sectionLabels: data.sectionLabels,
        dialogPhrases: data.dialogPhrases,
      });
      setLoading(false);
    })();
  }, []);

  if (loading || !aids) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/study/extended-kanji">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <Badge variant="secondary">PART 5</Badge>
      </div>

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <GitCompareArrows className="h-7 w-7" />
          Study aids & teacher notes
        </h1>
        <p className="text-muted-foreground">
          Confusable kanji, special readings, verb stems, and dialog phrases.
        </p>
      </div>

      {/* Confusables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompareArrows className="h-5 w-5" />
            Confusable kanji
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aids.confusables.map((g, i) => (
            <div key={i} className="space-y-2">
              {g.context && (
                <p className="text-xs text-muted-foreground italic">{g.context}</p>
              )}
              {g.group && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {g.group.map((row, j) => (
                    <div
                      key={j}
                      className="p-4 rounded-lg border bg-card text-center space-y-1"
                    >
                      <div className="text-5xl font-bold">{row.Kanji}</div>
                      <div className="text-sm text-muted-foreground">{row.Reading}</div>
                      <div className="text-xs">{row.Meaning}</div>
                    </div>
                  ))}
                </div>
              )}
              {g.note && (
                <div
                  className="p-3 rounded bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: g.note.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
                  }}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Special readings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Special readings (※)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {aids.specialReadings.map((s, i) => (
              <li key={i} className="p-3 rounded bg-muted/40">
                {s.context && (
                  <div className="text-xs text-muted-foreground mb-1">{s.context}</div>
                )}
                <div className="text-sm">{s.entry}</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Verb stems */}
      <Card>
        <CardHeader>
          <CardTitle>Verb stems introduced via kanji lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {aids.verbStems.map((v, i) => (
              <li key={i} className="p-3 rounded bg-muted/40">
                {v.context && (
                  <div className="text-xs text-muted-foreground mb-1">{v.context}</div>
                )}
                <div className="text-sm">{v.item}</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Section labels */}
      {aids.sectionLabels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Textbook page cross-reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {Object.keys(aids.sectionLabels[0]).map((h) => (
                      <th key={h} className="text-left py-2 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {aids.sectionLabels.map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      {Object.keys(row).map((h) => (
                        <td key={h} className="py-2">
                          {row[h]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog phrases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Dialog phrases
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {Object.entries(aids.dialogPhrases).map(([topic, phrases]) => (
            <div key={topic} className="space-y-2">
              <h3 className="text-base font-semibold">{topic}</h3>
              <ul className="space-y-2">
                {phrases.map((p, i) => (
                  <li
                    key={i}
                    className="p-3 rounded bg-muted/40 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4"
                  >
                    <span className="text-base font-medium">{p.jp}</span>
                    {p.en && (
                      <span className="text-sm text-muted-foreground italic">— {p.en}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
