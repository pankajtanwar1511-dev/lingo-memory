"use client"

import { useEffect, useState } from "react"
import { useDatabase } from "@/hooks/useDatabase"
import { toast } from "@/components/ui/toaster"
import { seedLoaderService } from "@/services/seed-loader.service"

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const { isInitialized, isLoading, error } = useDatabase()
  const [seedLoading, setSeedLoading] = useState(false)
  const [seedLoaded, setSeedLoaded] = useState(false)

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

  // Show loading state while database initializes
  if (isLoading) {
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