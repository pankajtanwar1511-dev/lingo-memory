"use client"

/**
 * Sync Status Indicator
 *
 * Shows the current synchronization status with Firestore.
 * Displays sync progress, queue length, and connection status.
 */

import { useEffect, useState } from "react"
import { Cloud, CloudOff, RefreshCw, Check, AlertCircle } from "lucide-react"
import { syncService } from "@/services/sync.service"
import { useAuth } from "@/contexts/auth-context"

export function SyncStatus() {
  const { isAuthenticated, isFirebaseAvailable } = useAuth()
  const [status, setStatus] = useState(syncService.getSyncStatus())
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Update status every second
    const interval = setInterval(() => {
      setStatus(syncService.getSyncStatus())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Don't show if Firebase not available or user not authenticated
  if (!isFirebaseAvailable || !isAuthenticated) {
    return null
  }

  const { isOnline, isSyncing, queueLength } = status

  // Determine icon and message
  const getStatusDisplay = () => {
    if (!isOnline) {
      return {
        icon: <CloudOff className="h-4 w-4" />,
        text: "Offline",
        description: `${queueLength} changes queued`,
        color: "text-gray-500",
        bgColor: "bg-gray-100 dark:bg-gray-800",
      }
    }

    if (isSyncing) {
      return {
        icon: <RefreshCw className="h-4 w-4 animate-spin" />,
        text: "Syncing",
        description: "Updating cloud data",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
      }
    }

    if (queueLength > 0) {
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        text: "Pending",
        description: `${queueLength} changes to sync`,
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      }
    }

    return {
      icon: <Check className="h-4 w-4" />,
      text: "Synced",
      description: "All changes saved to cloud",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    }
  }

  const display = getStatusDisplay()

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${display.bgColor}`}
      onClick={() => setShowDetails(!showDetails)}
      title={display.description}
    >
      <div className={display.color}>{display.icon}</div>
      <span className={`text-sm font-medium ${display.color}`}>
        {display.text}
      </span>

      {/* Show queue length badge if > 0 */}
      {queueLength > 0 && (
        <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-white dark:bg-gray-700">
          {queueLength}
        </span>
      )}

      {/* Details tooltip */}
      {showDetails && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-64 z-50 border border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connection</span>
              <span className={`text-sm ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <span className={`text-sm ${display.color}`}>
                {isSyncing ? 'Syncing...' : 'Idle'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Queue</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {queueLength} {queueLength === 1 ? 'item' : 'items'}
              </span>
            </div>
            {!isOnline && queueLength > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                Changes will sync automatically when connection is restored.
              </p>
            )}
            <button
              onClick={async (e) => {
                e.stopPropagation()
                try {
                  await syncService.syncNow()
                  setShowDetails(false)
                } catch (error) {
                  console.error('Manual sync failed:', error)
                }
              }}
              disabled={!isOnline || isSyncing}
              className="w-full mt-2 px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sync Now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Compact version for mobile
 */
export function SyncStatusCompact() {
  const { isAuthenticated, isFirebaseAvailable } = useAuth()
  const [status, setStatus] = useState(syncService.getSyncStatus())

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(syncService.getSyncStatus())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!isFirebaseAvailable || !isAuthenticated) {
    return null
  }

  const { isOnline, isSyncing, queueLength } = status

  // Show icon only
  if (!isOnline) {
    return <CloudOff className="h-4 w-4 text-gray-500" />
  }

  if (isSyncing) {
    return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
  }

  if (queueLength > 0) {
    return (
      <div className="relative">
        <Cloud className="h-4 w-4 text-yellow-600" />
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-500 rounded-full" />
      </div>
    )
  }

  return <Cloud className="h-4 w-4 text-green-600" />
}
