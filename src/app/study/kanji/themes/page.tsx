'use client';

/**
 * Kanji — themed vocabulary (PART 2 of KANJI_REFERENCE.md).
 * Route: /study/kanji/themes
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExtendedKanjiTheme } from '@/types/extended-kanji';

export default function ExtendedKanjiThemesPage() {
  const [themes, setThemes] = useState<ExtendedKanjiTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/seed-data/extended-kanji/themes.json');
      const data = await res.json();
      setThemes(data.themes);
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

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/study/kanji">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <Badge variant="secondary">PART 2</Badge>
      </div>

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Tags className="h-7 w-7" />
          Themed Vocabulary
        </h1>
        <p className="text-muted-foreground">
          Recurring vocabulary across lessons, grouped by theme.
        </p>
      </div>

      {themes.map((theme) => {
        const headers = theme.rows.length > 0 ? Object.keys(theme.rows[0]) : [];
        return (
          <Card key={theme.theme}>
            <CardHeader>
              <CardTitle className="text-xl">
                {theme.theme}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  · {theme.rows.length} entries
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {headers.map((h) => (
                        <th key={h} className="text-left py-2 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {theme.rows.map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        {headers.map((h) => (
                          <td
                            key={h}
                            className={`py-2 ${h === headers[0] ? 'text-lg font-medium' : 'text-muted-foreground'}`}
                          >
                            {row[h] ?? ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
