'use client'

/**
 * Email verification waiting page.
 *
 * Shown after signup (and to any signed-in user whose email is not yet
 * verified). Polls auth.currentUser.reload() every 5s; once Firebase
 * reports emailVerified === true, redirects the user to the original
 * target (sessionStorage["auth-next"]) or to "/".
 *
 * Public route — RequireAuth guard explicitly whitelists /verify-email.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { authService } from '@/services/auth.service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Mail, RefreshCw, LogOut } from 'lucide-react'

const POLL_INTERVAL_MS = 5_000
const RESEND_COOLDOWN_S = 60

export default function VerifyEmailPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { user, loading, signOut } = useAuth()

  const [resendCooldown, setResendCooldown] = useState(0)
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [checkingNow, setCheckingNow] = useState(false)
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = params?.get('next') || '/'

  // While loading: render nothing, the AuthProvider is still initializing.
  // No user: bounce to login (verify-email requires being signed in).
  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login' + (next !== '/' ? `?next=${encodeURIComponent(next)}` : ''))
      return
    }
    if (user.emailVerified) {
      router.replace(next)
    }
  }, [user, loading, router, next])

  // Poll currentUser.reload() — a verified user clicking the email link in
  // another tab will get auto-detected within 5s.
  useEffect(() => {
    if (!user || user.emailVerified) return
    const id = setInterval(async () => {
      const refreshed = await authService.reloadCurrentUser()
      if (refreshed?.emailVerified) {
        // Force a full window reload so AuthProvider re-emits with the
        // updated emailVerified flag (onAuthStateChanged doesn't fire for
        // a profile-only refresh).
        window.location.replace(next)
      }
    }, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [user, next])

  // Cooldown ticker for the resend button.
  useEffect(() => {
    if (resendCooldown <= 0) return
    cooldownTimerRef.current = setInterval(() => {
      setResendCooldown((s) => Math.max(0, s - 1))
    }, 1000)
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current)
    }
  }, [resendCooldown])

  const onResend = useCallback(async () => {
    if (resending || resendCooldown > 0) return
    setResending(true)
    setResendMessage(null)
    try {
      await authService.resendEmailVerification()
      setResendMessage('Verification email sent. Check your inbox (and spam folder).')
      setResendCooldown(RESEND_COOLDOWN_S)
    } catch (e: any) {
      setResendMessage(e?.message || 'Failed to send verification email.')
    } finally {
      setResending(false)
    }
  }, [resending, resendCooldown])

  const onCheckNow = useCallback(async () => {
    if (checkingNow) return
    setCheckingNow(true)
    const refreshed = await authService.reloadCurrentUser()
    if (refreshed?.emailVerified) {
      window.location.replace(next)
    } else {
      setCheckingNow(false)
      setResendMessage('Still not verified. Click the link in your email and try again.')
    }
  }, [checkingNow, next])

  const onSignOut = useCallback(async () => {
    await signOut()
    router.replace('/login')
  }, [signOut, router])

  if (loading || !user || user.emailVerified) {
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
              <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Verify your email</CardTitle>
              <p className="text-sm text-muted-foreground">
                We sent a verification link to{' '}
                <span className="font-medium text-foreground">{user.email}</span>.
                Click the link, then come back here.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={onCheckNow}
                disabled={checkingNow}
                className="w-full"
                size="lg"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${checkingNow ? 'animate-spin' : ''}`} />
                {checkingNow ? 'Checking…' : 'I’ve verified — continue'}
              </Button>

              <Button
                variant="outline"
                onClick={onResend}
                disabled={resending || resendCooldown > 0}
                className="w-full"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : resending
                  ? 'Sending…'
                  : 'Resend verification email'}
              </Button>

              {resendMessage && (
                <p className="text-xs text-center text-muted-foreground">
                  {resendMessage}
                </p>
              )}

              <div className="text-center text-xs text-muted-foreground pt-2 space-y-2">
                <p>
                  Wrong email? <button
                    onClick={onSignOut}
                    className="underline hover:text-foreground inline-flex items-center gap-1"
                  >
                    <LogOut className="h-3 w-3" />
                    Sign out
                  </button> and try again.
                </p>
                <p className="text-[11px]">
                  This page checks for verification automatically every few seconds.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
