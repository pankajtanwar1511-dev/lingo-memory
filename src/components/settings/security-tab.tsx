"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { CheckCircle, XCircle, Shield, KeyRound, Loader2 } from "lucide-react"

export function SecurityTab() {
  const { user, isFirebaseAvailable, hasPasswordProvider, linkPasswordToCurrentUser } = useAuth()
  // Re-render trigger after a successful link so the section flips state.
  const [, force] = useState(0)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isFirebaseAvailable) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Firebase is not configured. Security features are unavailable in offline mode.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const passwordSet = hasPasswordProvider()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }
    setSubmitting(true)
    try {
      await linkPasswordToCurrentUser(password)
      setSuccess(true)
      setPassword("")
      setConfirm("")
      // hasPasswordProvider is a function reading from authService — trigger
      // a re-render so the section swaps to the "password set" state.
      force((n) => n + 1)
    } catch (err: any) {
      setError(err?.message || "Failed to set password.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Security Status</CardTitle>
          <CardDescription>Overview of your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              {user?.emailVerified ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-yellow-600" />
              )}
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">
                  {user?.emailVerified ? "Your email is verified" : "Email verification required"}
                </p>
              </div>
            </div>
            <Badge variant={user?.emailVerified ? "default" : "outline"}>
              {user?.emailVerified ? "Active" : "Pending"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Email/Password Sign-In</p>
                <p className="text-sm text-muted-foreground">
                  {passwordSet
                    ? "You can sign in with email and password on any device."
                    : "Not yet set — add one below to enable email/password sign-in."}
                </p>
              </div>
            </div>
            <Badge variant={passwordSet ? "default" : "outline"}>
              {passwordSet ? "Enabled" : "Not set"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {!passwordSet && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Set a password
            </CardTitle>
            <CardDescription>
              Add email/password as a second way to sign in. Your existing Google
              account stays linked — same data, just one more way in. Recommended
              if you use mobile Safari, where Google sign-in can be flaky.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password-account">Email</Label>
                <Input
                  id="password-account"
                  type="email"
                  value={user?.email ?? ""}
                  disabled
                  className="bg-muted/40"
                />
                <p className="text-[11px] text-muted-foreground">
                  Locked to your current account&apos;s email.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Type it again"
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
              {success && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Password set. You can now sign in with email + password on any device.
                </p>
              )}

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Setting password…
                  </>
                ) : (
                  "Set password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {passwordSet && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              You&apos;re set
            </CardTitle>
            <CardDescription>
              Email/password sign-in is enabled on your account. Sign out and back in
              with <span className="font-mono">{user?.email}</span> + your password
              on any device — same data follows you.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
