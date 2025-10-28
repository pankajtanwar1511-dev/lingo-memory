"use client"

import { useEffect } from "react"
import { registerServiceWorker } from "@/lib/register-sw"

/**
 * Service Worker Initialization Component
 * Registers the service worker on app mount
 */
export function ServiceWorkerInit() {
  useEffect(() => {
    // Only register in production or if explicitly enabled
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_SW === 'true') {
      registerServiceWorker().catch(console.error)
    } else {
      console.log('Service Worker registration skipped in development')
    }
  }, [])

  // This component doesn't render anything
  return null
}
