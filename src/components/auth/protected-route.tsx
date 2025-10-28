"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
export function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, loading, isFirebaseAvailable } = useAuth()

  useEffect(() => {
    // If Firebase is not available, allow access (offline mode)
    if (!isFirebaseAvailable) {
      return
    }

    // If not loading and not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      router.push(redirectTo as any)
    }
  }, [isAuthenticated, loading, isFirebaseAvailable, router, redirectTo])

  // Show loading while checking auth state
  if (loading && isFirebaseAvailable) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If Firebase not available or user is authenticated, show children
  if (!isFirebaseAvailable || isAuthenticated) {
    return <>{children}</>
  }

  // Otherwise show nothing (will redirect)
  return null
}
