'use client'

/**
 * Admin: access management.
 *
 * Three sections:
 *   1. Pending requests — users who signed up but aren't approved yet
 *   2. Approved emails — current allowlist (revoke per row)
 *   3. Admins — runtime admin list (promote/demote, bootstrap protected)
 *
 * Gated by useIsAdmin — non-admins are redirected away.
 */

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { ArrowLeft, Check, Trash2, Plus, ShieldCheck, Lock, RefreshCw } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { BOOTSTRAP_ADMIN_EMAILS, useIsAdmin } from '@/lib/admin'
import {
  addAdmin,
  addEmail,
  approvePendingRequest,
  deletePendingRequest,
  getAllowlist,
  listAdmins,
  listPendingRequests,
  PendingRequest,
  removeAdmin,
  removeEmail,
} from '@/services/allowlist.service'

export default function AdminAccessPage() {
  const router = useRouter()
  const { loading, user } = useAuth()
  const isAdmin = useIsAdmin()

  const [pending, setPending] = useState<PendingRequest[]>([])
  const [allowed, setAllowed] = useState<string[]>([])
  const [admins, setAdmins] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const [newAllowEmail, setNewAllowEmail] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')

  // Redirect non-admins
  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login')
      return
    }
    if (!isAdmin) {
      router.replace('/')
      return
    }
  }, [loading, user, isAdmin, router])

  const refresh = useCallback(async () => {
    setBusy(true)
    setError(null)
    try {
      const [p, a, ad] = await Promise.all([
        listPendingRequests(),
        getAllowlist(true),
        listAdmins(),
      ])
      setPending(p.sort((x, y) => (x.createdAt ?? 0) - (y.createdAt ?? 0)))
      setAllowed([...a].sort())
      setAdmins(ad.sort())
    } catch (e: any) {
      setError(e?.message || 'Failed to load data')
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    if (isAdmin) void refresh()
  }, [isAdmin, refresh])

  const flash = (msg: string) => {
    setInfo(msg)
    setTimeout(() => setInfo(null), 2500)
  }

  const onApprove = async (req: PendingRequest) => {
    try {
      await approvePendingRequest(req.uid, req.email)
      flash(`Approved ${req.email}`)
      await refresh()
    } catch (e: any) {
      setError(e?.message || 'Approve failed')
    }
  }

  const onDecline = async (req: PendingRequest) => {
    try {
      await deletePendingRequest(req.uid)
      flash(`Removed pending request for ${req.email}`)
      await refresh()
    } catch (e: any) {
      setError(e?.message || 'Decline failed')
    }
  }

  const onAddAllow = async () => {
    if (!newAllowEmail.trim()) return
    try {
      await addEmail(newAllowEmail)
      flash(`Added ${newAllowEmail.toLowerCase()} to allowlist`)
      setNewAllowEmail('')
      await refresh()
    } catch (e: any) {
      setError(e?.message || 'Add failed')
    }
  }

  const onRemoveAllow = async (email: string) => {
    if (!confirm(`Remove ${email} from allowlist? They will lose access immediately.`)) return
    try {
      await removeEmail(email)
      flash(`Removed ${email}`)
      await refresh()
    } catch (e: any) {
      setError(e?.message || 'Remove failed')
    }
  }

  const onAddAdmin = async () => {
    if (!newAdminEmail.trim()) return
    try {
      await addAdmin(newAdminEmail)
      flash(`Promoted ${newAdminEmail.toLowerCase()} to admin`)
      setNewAdminEmail('')
      await refresh()
    } catch (e: any) {
      setError(e?.message || 'Promote failed')
    }
  }

  const onRemoveAdmin = async (email: string) => {
    if (BOOTSTRAP_ADMIN_EMAILS.has(email.toLowerCase())) return
    if (!confirm(`Demote ${email}? They lose admin access but stay on the allowlist.`)) return
    try {
      await removeAdmin(email)
      flash(`Demoted ${email}`)
      await refresh()
    } catch (e: any) {
      setError(e?.message || 'Demote failed')
    }
  }

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <ShieldCheck className="h-3 w-3" />
              Admin
            </Badge>
            <Button variant="outline" size="sm" onClick={refresh} disabled={busy}>
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${busy ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Access management</h1>
          <p className="text-muted-foreground">
            Approve who can use LingoMemory and who else gets admin powers.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {info && (
          <div className="rounded-md border border-emerald-400/40 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-sm text-emerald-700 dark:text-emerald-400">
            {info}
          </div>
        )}

        {/* --- Pending requests --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hourglass />
              Pending requests ({pending.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              People who signed up + verified their email but aren’t approved yet.
            </p>
          </CardHeader>
          <CardContent>
            {pending.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No pending requests.</p>
            ) : (
              <ul className="divide-y">
                {pending.map((p) => (
                  <li key={p.uid} className="flex flex-wrap items-center gap-3 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{p.email}</div>
                      {p.displayName && (
                        <div className="text-xs text-muted-foreground truncate">
                          {p.displayName}
                        </div>
                      )}
                    </div>
                    <Button size="sm" onClick={() => onApprove(p)} className="gap-1">
                      <Check className="h-3.5 w-3.5" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDecline(p)}
                      className="gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Decline
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* --- Allowlist --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Approved emails ({allowed.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Allowlisted emails can use the app immediately after signing in + verifying.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="someone@example.com"
                value={newAllowEmail}
                onChange={(e) => setNewAllowEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onAddAllow()}
              />
              <Button onClick={onAddAllow} className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            {allowed.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                No emails approved yet.
              </p>
            ) : (
              <ul className="divide-y">
                {allowed.map((email) => (
                  <li key={email} className="flex items-center justify-between py-2.5">
                    <span className="font-mono text-sm truncate">{email}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveAllow(email)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* --- Admins --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Admins ({admins.length + BOOTSTRAP_ADMIN_EMAILS.size})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Admins can manage access and other admins. Bootstrap admins are
              hardcoded and can’t be demoted from this UI.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="someone@example.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onAddAdmin()}
              />
              <Button onClick={onAddAdmin} className="gap-1">
                <Plus className="h-4 w-4" />
                Promote
              </Button>
            </div>
            <ul className="divide-y">
              {[...BOOTSTRAP_ADMIN_EMAILS].map((email) => (
                <li key={email} className="flex items-center justify-between py-2.5">
                  <span className="font-mono text-sm truncate">{email}</span>
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Bootstrap
                  </Badge>
                </li>
              ))}
              {admins
                .filter((e) => !BOOTSTRAP_ADMIN_EMAILS.has(e.toLowerCase()))
                .map((email) => (
                  <li key={email} className="flex items-center justify-between py-2.5">
                    <span className="font-mono text-sm truncate">{email}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveAdmin(email)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Demote</span>
                    </Button>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function Hourglass() {
  // Inline lucide icon import would also work, but centralizing here keeps
  // top-of-file imports lean.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
  )
}
