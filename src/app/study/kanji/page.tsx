'use client';

/**
 * Kanji List Page
 *
 * Route: /study/kanji
 *
 * Displays grid of all N5 kanji with:
 * - Filter by study status
 * - Sort by stroke count, frequency, grade
 * - Search by meaning or reading
 * - Click card to view details
 */

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KanjiCard } from '@/types/kanji';

type SortOption = 'stroke' | 'frequency' | 'grade' | 'default';

export default function KanjiListPage() {
  const [kanjiList, setKanjiList] = useState<KanjiCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  useEffect(() => {
    const loadKanji = async () => {
      try {
        setLoading(true);
        const response = await fetch('/seed-data/kanji_n5.json');

        if (!response.ok) {
          throw new Error('Failed to load kanji data');
        }

        const data = await response.json();
        setKanjiList(data.kanji);
      } catch (err) {
        console.error('Error loading kanji:', err);
      } finally {
        setLoading(false);
      }
    };

    loadKanji();
  }, []);

  // Filter and sort kanji
  const filteredAndSortedKanji = useMemo(() => {
    let filtered = kanjiList;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (k) =>
          k.kanji.includes(query) ||
          k.meanings.some((m) => m.toLowerCase().includes(query)) ||
          k.onReadings.some((r) => r.includes(query)) ||
          k.kunReadings.some((r) => r.includes(query))
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'stroke':
        sorted.sort((a, b) => a.strokeCount - b.strokeCount);
        break;
      case 'frequency':
        sorted.sort((a, b) => {
          const freqA = a.frequency || 9999;
          const freqB = b.frequency || 9999;
          return freqA - freqB;
        });
        break;
      case 'grade':
        sorted.sort((a, b) => {
          const gradeA = a.grade || 99;
          const gradeB = b.grade || 99;
          return gradeA - gradeB;
        });
        break;
      default:
        // Keep original order (by stroke count from dataset)
        break;
    }

    return sorted;
  }, [kanjiList, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">N5 Kanji</h1>
            <p className="text-muted-foreground">
              {filteredAndSortedKanji.length} characters
            </p>
          </div>

          <Badge variant="secondary" className="text-lg px-4 py-2">
            JLPT N5
          </Badge>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by kanji, meaning, or reading..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="stroke">Stroke Count</SelectItem>
              <SelectItem value="frequency">Frequency</SelectItem>
              <SelectItem value="grade">Grade</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{kanjiList.length}</div>
            <p className="text-xs text-muted-foreground">Total Kanji</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {kanjiList.filter((k) => k.strokeCount <= 5).length}
            </div>
            <p className="text-xs text-muted-foreground">Simple (≤5 strokes)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {kanjiList.filter((k) => k.grade && k.grade <= 2).length}
            </div>
            <p className="text-xs text-muted-foreground">Grade 1-2</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {kanjiList.reduce((sum, k) => sum + k.examples.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Example Words</p>
          </CardContent>
        </Card>
      </div>

      {/* Kanji Grid */}
      {filteredAndSortedKanji.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              No kanji found matching your search
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery('')}
              className="mt-4"
            >
              Clear Search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredAndSortedKanji.map((kanji) => (
            <Link
              key={kanji.id}
              href={`/study/kanji/${kanji.id}`}
              className="block"
            >
              <Card className="hover:shadow-lg hover:border-primary transition-all duration-200 cursor-pointer h-full">
                <CardContent className="pt-6 text-center space-y-2">
                  {/* Kanji Character */}
                  <div className="text-5xl font-bold">{kanji.kanji}</div>

                  {/* Primary Reading */}
                  <div className="text-sm font-medium text-primary">
                    {kanji.onReadings[0] || kanji.kunReadings[0] || ''}
                  </div>

                  {/* Primary Meaning */}
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {kanji.meanings[0]}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>{kanji.strokeCount} strokes</span>
                    {kanji.grade && <Badge variant="outline">G{kanji.grade}</Badge>}
                  </div>

                  {/* Progress indicator (placeholder for future) */}
                  <div className="flex gap-1 justify-center">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <div
                        key={dot}
                        className="w-1.5 h-1.5 rounded-full bg-muted"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Attribution Footer */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            Kanji data from KANJIDIC2 (CC BY-SA 4.0) · Stroke order from KanjiVG
            (CC BY-SA 3.0)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
