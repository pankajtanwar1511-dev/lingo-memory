'use client';

/**
 * Extended Kanji — prerequisite kanji (PART 6 of KANJI_REFERENCE.md)
 * Route: /study/extended-kanji/prerequisite
 *
 * 127 kanji that appear in compounds across the 36 lessons but were taught
 * in earlier classes.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PrerequisiteKanji } from '@/types/extended-kanji';

export default function ExtendedKanjiPrerequisitePage() {
  const [prereq, setPrereq] = useState<PrerequisiteKanji[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('/seed-data/extended-kanji/prerequisite.json');
      const data = await res.json();
      setPrereq(data.prerequisite);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return prereq;
    return prereq.filter(
      (p) =>
        p.Kanji.includes(q) ||
        p.Reading.toLowerCase().includes(q) ||
        p['Common uses seen'].toLowerCase().includes(q),
    );
  }, [prereq, search]);

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
        <Link href="/study/extended-kanji">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <Badge variant="secondary">PART 6</Badge>
      </div>

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Layers className="h-7 w-7" />
          Prerequisite kanji
        </h1>
        <p className="text-muted-foreground">
          {filtered.length} of {prereq.length} characters — kanji that appear in compounds
          but were taught in earlier classes.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search kanji, reading, or usage…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Kanji</th>
                  <th className="text-left py-2 font-medium">Reading</th>
                  <th className="text-left py-2 font-medium">Common uses seen</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 text-3xl font-bold">{p.Kanji}</td>
                    <td className="py-3 text-muted-foreground">{p.Reading}</td>
                    <td className="py-3">{p['Common uses seen']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
