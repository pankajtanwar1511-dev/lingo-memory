"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, AlertTriangle, RefreshCw } from "lucide-react"
import Link from "next/link"

export function DatabaseTab() {
  return (
    <div className="space-y-6">
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div>
              <CardTitle>Database Reset</CardTitle>
              <CardDescription>
                Clear all data and reload seed vocabulary
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The database reset functionality is available on a dedicated page with detailed controls and safety warnings.
          </p>

          <div className="bg-destructive/10 p-4 rounded-lg">
            <p className="text-sm font-semibold text-destructive mb-2">Warning:</p>
            <p className="text-sm text-muted-foreground">
              Resetting the database will permanently delete:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
              <li>All vocabulary cards (including custom cards)</li>
              <li>All study progress and FSRS data</li>
              <li>All custom decks</li>
              <li>All study sessions and statistics</li>
              <li>All achievements and daily stats</li>
            </ul>
          </div>

          <div className="bg-accent p-4 rounded-lg">
            <p className="text-sm font-semibold mb-2">What will be restored:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>50 curated vocabulary cards (from seed data)</li>
              <li>N5 Essential Verbs (10 cards)</li>
              <li>N5 Essential Nouns (10 cards)</li>
              <li>N5 Essential Adjectives (10 cards)</li>
              <li>N4 Essential (10 cards)</li>
              <li>N3 Essential (10 cards)</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Link href="/reset-database" className="flex-1">
              <Button variant="destructive" className="w-full gap-2">
                <Database className="h-4 w-4" />
                Open Reset Database Page
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            <p>If you're seeing database errors, the reset page will help fix them.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Information</CardTitle>
          <CardDescription>Information about your local database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm font-medium">Database Type</span>
            <span className="text-sm text-muted-foreground">IndexedDB (Dexie)</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm font-medium">Storage Location</span>
            <span className="text-sm text-muted-foreground">Browser Local Storage</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm font-medium">Offline Support</span>
            <span className="text-sm text-green-600">✓ Enabled</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium">Backup Recommendation</span>
            <span className="text-sm text-muted-foreground">Export regularly</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
