"use client"

/**
 * Vocabulary Browser Page
 *
 * Browse, search, and filter all available vocabulary cards.
 * View statistics and explore content by JLPT level.
 */

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { VocabularyCard, JLPTLevel } from '@/types/vocabulary'
import { contentStatsService } from '@/services/content-stats.service'
import { Search, TrendingUp, BookOpen, Volume2, Image as ImageIcon, X } from 'lucide-react'
import { Header } from '@/components/layout/header'

export default function VocabularyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'ALL'>('ALL')
  const [searchResults, setSearchResults] = useState<VocabularyCard[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<VocabularyCard | null>(null)
  const [displayLimit, setDisplayLimit] = useState(20)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load statistics on mount
  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const overallStats = await contentStatsService.getOverallStats()
      setStats(overallStats)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Search vocabulary
  const handleSearch = async () => {
    try {
      const level = selectedLevel === 'ALL' ? undefined : selectedLevel
      const results = await contentStatsService.search(searchQuery, {
        level,
        limit: 999999 // Fetch ALL matching results
      })
      setSearchResults(results)
      setDisplayLimit(20) // Reset display limit for new search
    } catch (error) {
      console.error('Error searching:', error)
    }
  }

  // Load random cards for browsing
  useEffect(() => {
    if (!searchQuery) {
      loadRandomCards()
    }
  }, [selectedLevel])

  const loadRandomCards = async () => {
    try {
      const level = selectedLevel === 'ALL' ? undefined : selectedLevel
      // Fetch ALL cards for the selected level (no limit)
      const cards = await contentStatsService.getRandomCards(999999, level)
      setSearchResults(cards)
      setDisplayLimit(20) // Reset limit when level changes
    } catch (error) {
      console.error('Error loading cards:', error)
    }
  }

  // Play audio
  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    audioRef.current = new Audio(audioUrl)
    audioRef.current.play().catch(err => console.error('Error playing audio:', err))
  }

  // Load more cards
  const loadMore = () => {
    setDisplayLimit(prev => prev + 20)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading vocabulary...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="space-y-6">
          {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Vocabulary Browser</h1>
          <p className="text-muted-foreground mt-2">
            Explore and search through our comprehensive Japanese vocabulary database
          </p>
        </div>

        {/* Statistics Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Vocabulary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all JLPT levels
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  With Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.withExamples}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((stats.withExamples / stats.total) * 100)}% coverage
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  With Audio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.withAudio}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((stats.withAudio / stats.total) * 100)}% coverage
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.averageExamplesPerCard}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Per vocabulary card
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* JLPT Level Distribution */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>JLPT Level Distribution</CardTitle>
              <CardDescription>Vocabulary count by proficiency level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {(['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map(level => (
                  <div key={level} className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {stats.byLevel[level]}
                    </div>
                    <div className="text-sm text-muted-foreground">{level}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Search Vocabulary</CardTitle>
            <CardDescription>Search by word, reading, or meaning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search vocabulary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedLevel === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel('ALL')}
              >
                All Levels
              </Button>
              {(['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map(level => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {searchQuery ? 'Search Results' : 'Browse Vocabulary'} ({searchResults.length})
          </h2>

          {searchResults.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No results found. Try a different search term.' : 'No vocabulary loaded yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.slice(0, displayLimit).map(card => (
                <Card
                  key={card.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCard(card)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl flex items-center gap-2">
                          {card.kanji || card.kana}
                          {card.audioUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                playAudio(card.audioUrl!)
                              }}
                            >
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          )}
                        </CardTitle>
                        {card.kanji && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {card.kana}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary">{card.jlptLevel}</Badge>
                    </div>
                    <CardDescription>
                      {Array.isArray(card.meaning) ? card.meaning.join(', ') : card.meaning}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Part of Speech */}
                      {card.partOfSpeech && card.partOfSpeech.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {card.partOfSpeech.map((pos, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {pos}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Example Sentences */}
                      {card.examples && card.examples.length > 0 && (
                        <div className="space-y-2">
                          {card.examples.slice(0, 2).map((example, idx) => (
                            <div key={idx} className="text-sm border-l-2 border-primary pl-3">
                              <p className="font-medium">{example.japanese}</p>
                              {example.kana && (
                                <p className="text-muted-foreground text-xs">{example.kana}</p>
                              )}
                              <p className="text-muted-foreground">{example.english}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Features */}
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        {card.audioUrl && (
                          <div className="flex items-center gap-1">
                            <Volume2 className="h-3 w-3" />
                            Audio
                          </div>
                        )}
                        {card.imageUrl && (
                          <div className="flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            Image
                          </div>
                        )}
                        {card.examples && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {card.examples.length} examples
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {card.tags && card.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {card.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Load More */}
        {searchResults.length > displayLimit && (
          <div className="text-center">
            <Button variant="outline" onClick={loadMore}>
              Load More ({searchResults.length - displayLimit} remaining)
            </Button>
          </div>
        )}

        {/* Card Detail Dialog */}
        <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedCard && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <DialogTitle className="text-3xl flex items-center gap-2">
                        {selectedCard.kanji || selectedCard.kana}
                        {selectedCard.audioUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => playAudio(selectedCard.audioUrl!)}
                          >
                            <Volume2 className="h-5 w-5" />
                          </Button>
                        )}
                      </DialogTitle>
                      {selectedCard.kanji && (
                        <p className="text-lg text-muted-foreground mt-2">
                          {selectedCard.kana}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {selectedCard.jlptLevel}
                    </Badge>
                  </div>
                  <DialogDescription className="text-base mt-3">
                    {Array.isArray(selectedCard.meaning)
                      ? selectedCard.meaning.join(', ')
                      : selectedCard.meaning}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  {/* Part of Speech */}
                  {selectedCard.partOfSpeech && selectedCard.partOfSpeech.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Part of Speech</h3>
                      <div className="flex gap-2 flex-wrap">
                        {selectedCard.partOfSpeech.map((pos, idx) => (
                          <Badge key={idx} variant="outline">
                            {pos}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Example Sentences */}
                  {selectedCard.examples && selectedCard.examples.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">
                        Example Sentences ({selectedCard.examples.length})
                      </h3>
                      <div className="space-y-4">
                        {selectedCard.examples.map((example, idx) => (
                          <div key={idx} className="border-l-4 border-primary pl-4 py-2 bg-muted/30 rounded-r">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-lg">{example.japanese}</p>
                              {example.audioUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 flex-shrink-0"
                                  onClick={() => playAudio(example.audioUrl!)}
                                >
                                  <Volume2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            {example.kana && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {example.kana}
                              </p>
                            )}
                            <p className="text-muted-foreground mt-2">{example.english}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedCard.tags && selectedCard.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex gap-2 flex-wrap">
                        {selectedCard.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* License */}
                  {selectedCard.license && (
                    <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                      <p>
                        <strong>License:</strong> {selectedCard.license.text}
                        {selectedCard.license.url && (
                          <>
                            {' - '}
                            <a
                              href={selectedCard.license.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-primary"
                            >
                              Learn more
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </div>
  )
}
