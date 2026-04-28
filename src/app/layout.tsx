import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { DatabaseProvider } from "@/components/providers/database-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { RequireAuth } from "@/components/auth/require-auth"
import { SettingsProvider } from "@/contexts/settings-context"
import { PWAInstaller, IOSInstallInstructions } from "@/components/pwa-installer"
import { OfflineIndicator } from "@/components/offline-indicator"
import { ServiceWorkerInit } from "@/components/service-worker-init"
import { CloudSyncBoot } from "@/components/cloud-sync-boot"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "LingoMemory - Master Japanese with Science-Backed Learning",
  description: "Learn Japanese vocabulary efficiently with spaced repetition, JLPT-aligned content, and authentic examples from native sources.",
  keywords: ["Japanese", "JLPT", "vocabulary", "learning", "spaced repetition", "flashcards"],
  authors: [{ name: "LingoMemory Team" }],
  openGraph: {
    title: "LingoMemory - Master Japanese with Science-Backed Learning",
    description: "Learn Japanese vocabulary efficiently with spaced repetition",
    type: "website",
    locale: "en_US",
    siteName: "LingoMemory",
  },
  twitter: {
    card: "summary_large_image",
    title: "LingoMemory - Master Japanese with Science-Backed Learning",
    description: "Learn Japanese vocabulary efficiently with spaced repetition",
  },
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // No maximumScale — let mobile users pinch-zoom the iVocab drill image
  // (and any other dense content). Accessibility wins outweigh the small
  // risk of accidental zoom.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6B46C1" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <SettingsProvider>
              <DatabaseProvider>
                <ServiceWorkerInit />
                <CloudSyncBoot />
                <OfflineIndicator />

                <div className="relative min-h-screen bg-background">
                  {/* Gradient mesh background */}
                  <div className="fixed inset-0 gradient-mesh opacity-50 dark:opacity-30" />
                  <div className="relative z-10">
                    <RequireAuth>{children}</RequireAuth>
                  </div>
                </div>
                <Toaster />
                <PWAInstaller />
                <IOSInstallInstructions />
              </DatabaseProvider>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}