"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSettings } from "@/contexts/settings-context"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/toaster"
import { User, Mail, CheckCircle, XCircle, Lock, Loader2 } from "lucide-react"
import { sendEmailVerification, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { auth } from "@/lib/firebase"

export function AccountTab() {
  const { profile, updateProfile: updateUserProfile } = useSettings()
  const { user, isFirebaseAvailable } = useAuth()
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(profile?.displayName || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [saving, setSaving] = useState(false)
  const [sendingVerification, setSendingVerification] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSaveProfile = async () => {
    if (!user) return

    setSaving(true)
    try {
      // Update Firebase Auth profile
      if (auth?.currentUser) {
        await updateProfile(auth.currentUser, { displayName })
      }

      // Update Firestore profile
      await updateUserProfile({ displayName, bio })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
        type: "success",
      })
      setEditing(false)
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        type: "error",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSendVerificationEmail = async () => {
    if (!auth?.currentUser) return

    setSendingVerification(true)
    try {
      await sendEmailVerification(auth.currentUser)
      toast({
        title: "Verification email sent",
        description: "Please check your inbox and click the verification link",
        type: "success",
      })
    } catch (error: any) {
      toast({
        title: "Failed to send email",
        description: error.message || "Please try again later",
        type: "error",
      })
    } finally {
      setSendingVerification(false)
    }
  }

  const handleChangePassword = async () => {
    if (!auth?.currentUser || !user?.email) return

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same",
        type: "error",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        type: "error",
      })
      return
    }

    setChangingPassword(true)
    try {
      // Re-authenticate user first
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)

      // Update password
      await updatePassword(auth.currentUser, newPassword)

      toast({
        title: "Password changed",
        description: "Your password has been updated successfully",
        type: "success",
      })

      // Clear form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      toast({
        title: "Password change failed",
        description: error.message === "auth/wrong-password"
          ? "Current password is incorrect"
          : error.message || "Failed to change password",
        type: "error",
      })
    } finally {
      setChangingPassword(false)
    }
  }

  if (!isFirebaseAvailable) {
    return (
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Offline Mode
          </CardTitle>
          <CardDescription className="text-blue-800 dark:text-blue-200">
            You're using LingoMemory in offline mode. All your study data is saved locally on this device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            ℹ️ Account features require Firebase configuration to enable:
          </p>
          <ul className="list-disc list-inside text-sm text-blue-600 dark:text-blue-400 space-y-1 ml-4">
            <li>Cloud sync across devices</li>
            <li>Profile management</li>
            <li>Email verification</li>
            <li>Password management</li>
          </ul>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-4">
            ✅ You can still use all study features, manage vocabulary, and track progress locally!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your profile details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={!editing || saving}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!editing || saving}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="flex gap-2">
            {editing ? (
              <>
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Email Verification */}
      <Card>
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {user?.emailVerified
              ? "Your email address is verified"
              : "Verify your email to enable all features"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user?.email}</span>
            </div>
            {user?.emailVerified ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-600">
                <XCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Not Verified</span>
              </div>
            )}
          </div>

          {!user?.emailVerified && (
            <Button
              onClick={handleSendVerificationEmail}
              disabled={sendingVerification}
              size="sm"
            >
              {sendingVerification && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Verification Email
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={changingPassword}
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={changingPassword}
              placeholder="Enter new password (min 6 characters)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={changingPassword}
              placeholder="Confirm new password"
            />
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
          >
            {changingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
