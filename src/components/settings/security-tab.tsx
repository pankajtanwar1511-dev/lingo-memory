"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { CheckCircle, XCircle, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SecurityTab() {
  const { user, isFirebaseAvailable } = useAuth()

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

  return (
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
                {user?.emailVerified
                  ? "Your email is verified"
                  : "Email verification required"}
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
              <p className="font-medium">Password Protection</p>
              <p className="text-sm text-muted-foreground">Strong password enabled</p>
            </div>
          </div>
          <Badge>Enabled</Badge>
        </div>

        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm font-medium mb-1">Security Tip</p>
          <p className="text-sm text-muted-foreground">
            Enable email verification and use a strong, unique password to keep your account secure.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
