'use client';

/**
 * Extended Kanji — textbook answer keys (PART 4 of KANJI_REFERENCE.md)
 * Route: /study/kanji/answer-keys
 *
 * Each page has an "Attempt" toggle: answers are hidden by default so the
 * student can try first, then reveal.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnswerKeyPage } from '@/types/extended-kanji';

export default function ExtendedKanjiAnswerKeysPage() {
  const [pages, setPages] = useState<AnswerKeyPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      const res = await fetch('/seed-data/extended-kanji/answer_keys.json');
      const data = await res.json();
      setPages(data.pages);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const toggle = (page: string) => setRevealed((r) => ({ ...r, [page]: !r[page] }));

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/study/kanji">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <Badge variant="secondary">PART 4</Badge>
      </div>

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ListChecks className="h-7 w-7" />
          Textbook answer keys
        </h1>
        <p className="text-muted-foreground">
          Answers from {pages.length} textbook pages. Try first, then reveal.
        </p>
      </div>

      {pages.map((page) => {
        const isRevealed = !!revealed[page.page];
        return (
          <Card key={page.page}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-xl">
                  {page.page}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    — {page.context}
                  </span>
                </CardTitle>
                <Button
                  variant={isRevealed ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => toggle(page.page)}
                  className="gap-2"
                >
                  {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {isRevealed ? 'Hide answers' : 'Reveal answers'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isRevealed ? (
                <div className="space-y-4">
                  {page.items.length > 0 && (
                    <ul className="space-y-1.5">
                      {page.items.map((item, i) => (
                        <li
                          key={i}
                          className="p-2 rounded bg-muted/40 text-base font-mono"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {page.subSections.map((sub) => (
                    <div key={sub.title} className="space-y-2 pt-2 border-t">
                      <h4 className="text-sm font-semibold">{sub.title}</h4>
                      <ul className="space-y-1.5">
                        {sub.items.map((item, i) => (
                          <li
                            key={i}
                            className="p-2 rounded bg-muted/40 text-base font-mono"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {page.items.length} answer{page.items.length !== 1 ? 's' : ''}
                  {page.subSections.length > 0
                    ? ` + ${page.subSections.length} sub-section${page.subSections.length !== 1 ? 's' : ''}`
                    : ''}{' '}
                  hidden.
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
