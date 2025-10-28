"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { AlertTriangle, Database, RefreshCw, CheckCircle } from 'lucide-react'
import { db } from '@/lib/db'
import { seedLoaderService } from '@/services/seed-loader.service'
import Link from 'next/link'
import { Header } from '@/components/layout/header'

export default function ResetDatabasePage() {
  const [isResetting, setIsResetting] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async () => {
    try {
      setIsResetting(true)
      setError(null)

      console.log('🗑️ Step 1: Clearing IndexedDB...')
      // Clear all tables
      await db.vocabulary.clear()
      await db.studyCards.clear()
      await db.decks.clear()
      await db.sessions.clear()
      await db.progress.clear()
      await db.dailyStats.clear()
      await db.achievements.clear()

      console.log('✅ Step 1 complete')

      console.log('🗑️ Step 2: Clearing localStorage...')
      // Clear localStorage
      localStorage.removeItem('japvocab-study-store')
      localStorage.removeItem('vocab_seed_loaded_v1')

      console.log('✅ Step 2 complete')

      console.log('🌱 Step 3: Reloading seed data...')
      // Reload seed data
      const result = await seedLoaderService.loadAll(true)

      console.log('✅ Step 3 complete')

      if (result.success) {
        console.log(`✅ Database reset complete! Loaded ${result.loaded} seed files`)
        setResetComplete(true)
      } else {
        throw new Error(`Failed to load seed data: ${result.errors.join(', ')}`)
      }
    } catch (err) {
      console.error('❌ Reset failed:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsResetting(false)
    }
  }

  const handleReload = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="bg-background p-8">
        <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Database className="w-16 h-16 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">Reset Database</h1>
          <p className="text-muted-foreground">
            Clear all data and reload seed vocabulary
          </p>
        </div>

        {!resetComplete ? (
          <Card className="border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-destructive" />
                <div>
                  <CardTitle>Warning: This will delete all your data</CardTitle>
                  <CardDescription>
                    This action will permanently delete:
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>All vocabulary cards (including custom cards)</li>
                <li>All study progress and FSRS data</li>
                <li>All custom decks</li>
                <li>All study sessions and statistics</li>
                <li>All achievements and daily stats</li>
                <li>LocalStorage data (study store, settings)</li>
              </ul>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">What will be restored:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>50 curated vocabulary cards (from seed data)</li>
                  <li>N5 Essential Verbs (10 cards)</li>
                  <li>N5 Essential Nouns (10 cards)</li>
                  <li>N5 Essential Adjectives (10 cards)</li>
                  <li>N4 Essential (10 cards)</li>
                  <li>N3 Essential (10 cards)</li>
                </ul>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                  <p className="font-semibold">Error:</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleReset}
                disabled={isResetting}
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Reset Database
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-green-500/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <CardTitle className="text-green-500">Reset Complete!</CardTitle>
                  <CardDescription>
                    Database has been reset successfully
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Your database has been cleared and seed data has been loaded.
                You can now use the app with a fresh start.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">What's been loaded:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>✅ 50 curated vocabulary cards</li>
                  <li>✅ Fresh study cards (FSRS initialized)</li>
                  <li>✅ Clean database with no duplicates</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleReload} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <p>If you're seeing database errors, this reset will fix them.</p>
          <p className="mt-2">
            Having issues? Check the browser console (F12) for detailed logs.
          </p>
        </div>
      </div>
    </div>
    </div>
  )
}
