"use client"

import { useEffect, useState } from "react"
import { useDatabase } from "@/hooks/useDatabase"
import { toast } from "@/components/ui/toaster"
import { seedLoaderService } from "@/services/seed-loader.service"

// Maximum time we'll show the "Initializing database…" spinner before
// rendering the app anyway. On mobile Safari (especially in private
// browsing) IndexedDB can hang on first open with no error, leaving the
// user stuck. Routes that don't use Dexie (e.g. /study/ivocab — uses
// RTDB + localStorage directly) shouldn't be blocked by that hang. Init
// continues in the background; if it completes later, things start
// working without a refresh.
const INIT_GRACE_MS = 5000

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const { isInitialized, isLoading, error } = useDatabase()
  const [seedLoading, setSeedLoading] = useState(false)
  const [seedLoaded, setSeedLoaded] = useState(false)
  const [graceElapsed, setGraceElapsed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setGraceElapsed(true), INIT_GRACE_MS)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (error) {
      toast({
        title: "Database Error",
        description: error,
        type: "error"
      })
    }
  }, [error])

  // Load seed data when database is initialized
  useEffect(() => {
    if (isInitialized && !seedLoaded && !seedLoading) {
      loadSeedData()
    }
  }, [isInitialized])

  const loadSeedData = async () => {
    try {
      setSeedLoading(true)
      console.log("🌱 Loading vocabulary seed data...")

      const result = await seedLoaderService.loadAll()

      if (result.success && result.loaded > 0) {
        console.log(`✅ Loaded ${result.loaded} seed files successfully`)
        toast({
          title: "Vocabulary Loaded",
          description: `${result.loaded} seed files loaded with curated vocabulary`,
          type: "success"
        })
      } else if (result.loaded === 0) {
        console.log("ℹ️ Seed data already loaded")
      }

      setSeedLoaded(true)
    } catch (error) {
      console.error("❌ Error loading seed data:", error)
      // Don't block app if seed loading fails
      setSeedLoaded(true)
    } finally {
      setSeedLoading(false)
    }
  }

  // Block rendering while the database is initializing — but only up to
  // INIT_GRACE_MS. After that, render the app anyway so non-Dexie routes
  // work even if Dexie itself is hung.
  if (isLoading && !graceElapsed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Initializing database...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}