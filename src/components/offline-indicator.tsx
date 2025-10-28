"use client"

import { useEffect, useState } from "react"
import { WifiOff, Wifi } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowIndicator(true)
      // Hide success indicator after 3 seconds
      setTimeout(() => setShowIndicator(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowIndicator(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Show indicator when offline or when just came back online
  if (!showIndicator && isOnline) {
    return null
  }

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg ${
              isOnline
                ? 'bg-green-500 text-white'
                : 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4" />
                <span className="text-sm font-medium">Back online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                <span className="text-sm font-medium">No internet connection</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
