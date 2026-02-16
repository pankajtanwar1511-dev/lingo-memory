"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { personaImportService } from "@/services/persona-import.service"
import { Upload, Check, X, Database, TrendingUp } from "lucide-react"

export default function PersonaImportPage() {
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async () => {
    setImporting(true)
    setResult(null)

    try {
      const importResult = await personaImportService.importDemoExamples()
      setResult(importResult)

      // Refresh stats after import
      await loadStats()
    } catch (error) {
      setResult({
        success: false,
        imported: 0,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Import failed']
      })
    } finally {
      setImporting(false)
    }
  }

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const personaStats = await personaImportService.getPersonaStats()
      setStats(personaStats)
      console.log('Stats loaded:', personaStats)
    } catch (error) {
      console.error('Failed to load stats:', error)
      setError(error instanceof Error ? error.message : 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = async () => {
    if (!confirm('Are you sure you want to remove all generated examples?')) {
      return
    }

    setLoading(true)
    try {
      const cleared = await personaImportService.clearGeneratedExamples()
      alert(`Cleared ${cleared} cards with generated examples`)
      await loadStats()
      setResult(null)
    } catch (error) {
      alert('Failed to clear examples: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Persona Example Import
          </h1>
          <p className="text-gray-600">
            Import demo persona examples into the database
          </p>
        </div>

        {/* Import Action */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Demo Data
            </CardTitle>
            <CardDescription>
              Import persona examples (demo data has been removed)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={handleImport}
                disabled={importing}
                className="gap-2"
              >
                <Database className="h-4 w-4" />
                {importing ? 'Importing...' : 'Import Demo Examples'}
              </Button>

              <Button
                onClick={loadStats}
                disabled={loading}
                variant="outline"
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Load Stats
              </Button>

              <Button
                onClick={handleClear}
                disabled={loading}
                variant="destructive"
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Generated
              </Button>
            </div>

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50 animate-scale-in">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <X className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-2 text-red-700">Error</h3>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Import Result */}
            {result && (
              <Card className={`${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'} animate-scale-in`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-2">
                        {result.success ? 'Import Successful' : 'Import Failed'}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p>Imported: {result.imported} new cards</p>
                        <p>Updated: {result.updated} existing cards</p>
                        {result.errors.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium text-red-700">Errors:</p>
                            <ul className="list-disc list-inside text-red-600">
                              {result.errors.map((error: string, i: number) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        {stats && (
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Database Statistics</CardTitle>
              <CardDescription>Current persona example data in database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Vocabulary</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.totalCards}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">With Generated Examples</p>
                  <p className="text-2xl font-bold text-green-700">{stats.cardsWithGeneratedExamples}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Generated</p>
                  <p className="text-2xl font-bold text-purple-700">{stats.totalGeneratedExamples}</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Coverage</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {stats.totalCards > 0
                      ? ((stats.cardsWithGeneratedExamples / stats.totalCards) * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>
              </div>

              {/* Examples by Persona */}
              {Object.keys(stats.examplesByPersona).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Examples by Persona</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stats.examplesByPersona).map(([persona, count]) => (
                      <Badge key={persona} variant="secondary" className="gap-1">
                        {persona}: {count as number}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p><strong>Import Demo Examples:</strong> Demo data has been removed. Use custom import instead.</p>
            <p><strong>Load Stats:</strong> Refresh statistics about current persona data</p>
            <p><strong>Clear Generated:</strong> Removes all AI-generated examples (keeps authentic ones)</p>
            <p className="text-xs text-gray-500 mt-4">
              Note: This is an admin tool for development. Import happens in the browser using IndexedDB.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
