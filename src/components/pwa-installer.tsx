"use client"

import { useEffect, useState } from "react"
import { Download, X, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/toaster"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show install banner if not shown before
      const hasSeenBanner = localStorage.getItem('pwa-install-banner-seen')
      if (!hasSeenBanner && !isInstalled) {
        setShowInstallBanner(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowInstallBanner(false)
      setDeferredPrompt(null)
      toast({
        title: "App Installed!",
        description: "LingoMemory has been added to your home screen",
        type: "success"
      })
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Installation not available",
        description: "Please try again later or install from your browser menu",
        type: "default"
      })
      return
    }

    // Show the install prompt
    await deferredPrompt.prompt()

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    // Clear the deferred prompt
    setDeferredPrompt(null)
    setShowInstallBanner(false)
  }

  const dismissBanner = () => {
    setShowInstallBanner(false)
    localStorage.setItem('pwa-install-banner-seen', 'true')
  }

  // Don't show anything if already installed or no prompt available
  if (isInstalled || !showInstallBanner) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="border-primary/20 shadow-xl bg-gradient-to-br from-primary/10 to-secondary/10">
        <CardContent className="p-4">
          <button
            onClick={dismissBanner}
            className="absolute top-2 right-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
              <Smartphone className="h-5 w-5 text-white" />
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="font-semibold">Install LingoMemory</h3>
              <p className="text-sm text-muted-foreground">
                Install our app for offline study and quick access from your home screen
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleInstallClick}
                  variant="gradient"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Install
                </Button>
                <Button
                  onClick={dismissBanner}
                  variant="outline"
                  size="sm"
                >
                  Later
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Component to show installation instructions for iOS
export function IOSInstallInstructions() {
  const [showInstructions, setShowInstructions] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent)
    const isInStandalone = window.matchMedia('(display-mode: standalone)').matches

    if (isIOSDevice && !isInStandalone) {
      setIsIOS(true)

      // Check if user has seen instructions
      const hasSeenInstructions = localStorage.getItem('ios-install-instructions-seen')
      if (!hasSeenInstructions) {
        setShowInstructions(true)
      }
    }
  }, [])

  const dismissInstructions = () => {
    setShowInstructions(false)
    localStorage.setItem('ios-install-instructions-seen', 'true')
  }

  if (!isIOS || !showInstructions) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="border-primary/20 shadow-xl">
        <CardContent className="p-4">
          <button
            onClick={dismissInstructions}
            className="absolute top-2 right-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Install on iOS</h3>
            </div>

            <ol className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>1. Tap the Share button <span className="text-primary">⎙</span></li>
              <li>2. Scroll down and tap "Add to Home Screen"</li>
              <li>3. Tap "Add" to install LingoMemory</li>
            </ol>

            <Button
              onClick={dismissInstructions}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Got it
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}