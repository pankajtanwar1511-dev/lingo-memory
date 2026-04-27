'use client'

/**
 * Pending-approval waiting page.
 *
 * Shown after sign-up + email verification when the user's email is NOT on
 * the admin-managed allowlist. Polls the allowlist every 30 s; when the
 * admin approves them, the user is auto-redirected to ?next= or "/".
 */

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Hourglass, RefreshCw, LogOut } from 'lucide-react'
import { isEmailAllowed, invalidateAllowlistCache } from '@/services/allowlist.service'
import { isAdminEmail } from '@/lib/admin'

const POLL_INTERVAL_MS = 30_000
const ADMIN_CONTACT = 'pankaj.tanwar1511@gmail.com'

export default function PendingApprovalPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { user, loading, signOut } = useAuth()
  const next = params?.get('next') || '/'

  const [checking, setChecking] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)

  // Bounce conditions
  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login')
      return
    }
    if (!user.emailVerified) {
      router.replace('/verify-email')
      return
    }
    if (isAdminEmail(user.email)) {
      router.replace(next)
      return
    }
  }, [user, loading, router, next])

  // Polling — invalidate cache so we always re-fetch the latest allowlist.
  useEffect(() => {
    if (!user || isAdminEmail(user.email)) return
    const id = setInterval(async () => {
      invalidateAllowlistCache()
      const allowed = await isEmailAllowed(user.email)
      if (allowed) {
        window.location.replace(next)
      }
    }, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [user, next])

  const onCheckNow = useCallback(async () => {
    if (checking || !user) return
    setChecking(true)
    setStatusMsg(null)
    try {
      invalidateAllowlistCache()
      const allowed = await isEmailAllowed(user.email)
      if (allowed) {
        window.location.replace(next)
        return
      }
      setStatusMsg('Still pending. Try again in a few minutes.')
    } finally {
      setChecking(false)
    }
  }, [checking, user, next])

  const onSignOut = useCallback(async () => {
    await signOut()
    router.replace('/login')
  }, [signOut, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center space-y-3">
              <div className="mx-auto h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <Hourglass className="h-7 w-7 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-2xl">Awaiting approval</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your account{' '}
                <span className="font-medium text-foreground">{user.email}</span>{' '}
                is signed in and verified, but access to the app is invite-only.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-center text-muted-foreground">
                The admin has been notified. Once they grant access, this page
                will refresh automatically.
              </p>

              <Button
                onClick={onCheckNow}
                disabled={checking}
                className="w-full"
                size="lg"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
                {checking ? 'Checking…' : 'Check approval status'}
              </Button>

              {statusMsg && (
                <p className="text-xs text-center text-muted-foreground">{statusMsg}</p>
              )}

              <div className="text-center text-xs text-muted-foreground pt-2 space-y-2">
                <p>
                  Need access urgently? Email{' '}
                  <a
                    href={`mailto:${ADMIN_CONTACT}?subject=LingoMemory access request&body=Please grant access to ${encodeURIComponent(user.email || '')}`}
                    className="underline hover:text-foreground"
                  >
                    {ADMIN_CONTACT}
                  </a>
                  .
                </p>
                <p>
                  <button
                    onClick={onSignOut}
                    className="underline hover:text-foreground inline-flex items-center gap-1"
                  >
                    <LogOut className="h-3 w-3" />
                    Sign out
                  </button>
                </p>
                <p className="text-[11px]">
                  This page checks for approval automatically every 30 seconds.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
