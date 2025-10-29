"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/toaster"
import { Download, Trash2, Loader2, AlertTriangle, RefreshCw } from "lucide-react"
import { db } from "@/lib/db"
import { firestoreService } from "@/lib/firestore.service"
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { deleteDoc, doc } from "firebase/firestore"
import { seedLoaderService } from "@/services/seed-loader.service"

export function DataTab() {
  const { user, signOut, isFirebaseAvailable } = useAuth()
  const router = useRouter()
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [resetConfirmation, setResetConfirmation] = useState("")

  const handleExportData = async () => {
    setExporting(true)
    try {
      // Collect all data
      const vocabulary = await db.vocabulary.toArray()
      const studyCards = await db.studyCards.toArray()
      const decks = await db.decks.toArray()
      const settings = await db.settings.toArray()

      const exportData = {
        exportDate: new Date().toISOString(),
        version: "1.0.0",
        user: user
          ? {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              emailVerified: user.emailVerified,
            }
          : { uid: "local-user", email: "offline", displayName: "Offline User" },
        vocabulary,
        studyCards,
        decks,
        settings,
        statistics: {
          totalCards: vocabulary.length,
          totalStudyCards: studyCards.length,
          totalDecks: decks.length,
        },
      }

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `lingomemory-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Data exported",
        description: "Your data has been downloaded successfully",
        type: "success",
      })
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message || "Failed to export data",
        type: "error",
      })
    } finally {
      setExporting(false)
    }
  }

  const handleResetDatabase = async () => {
    if (resetConfirmation !== "RESET") {
      toast({
        title: "Confirmation required",
        description: 'Please type "RESET" to confirm',
        type: "error",
      })
      return
    }

    setResetting(true)
    try {
      // Clear all vocabulary and study data
      await db.vocabulary.clear()
      await db.studyCards.clear()

      // Clear the seed loaded flag
      seedLoaderService.clearLoadedFlag()

      // Reload seed data
      const result = await seedLoaderService.loadAll(true)

      if (result.success) {
        toast({
          title: "Database reset successfully",
          description: `Loaded ${result.loaded} seed files with fresh vocabulary data`,
          type: "success",
        })

        // Clear confirmation and close dialog
        setResetConfirmation("")

        // Reload page to refresh all data
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        toast({
          title: "Reset failed",
          description: result.errors.join(", ") || "Failed to reload seed data",
          type: "error",
        })
      }
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Failed to reset database",
        type: "error",
      })
    } finally {
      setResetting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user || !auth?.currentUser) return

    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Confirmation required",
        description: 'Please type "DELETE" to confirm',
        type: "error",
      })
      return
    }

    setDeleting(true)
    try {
      // Re-authenticate user
      if (user.email && deletePassword) {
        const credential = EmailAuthProvider.credential(user.email, deletePassword)
        await reauthenticateWithCredential(auth.currentUser, credential)
      }

      // Delete Firestore data
      if (isFirebaseAvailable && firestoreService.isAvailable()) {
        await deleteDoc(doc(auth.currentUser as any, `users/${user.uid}`))
      }

      // Delete local data
      await db.vocabulary.clear()
      await db.studyCards.clear()
      await db.decks.clear()
      await db.settings.clear()

      // Delete Firebase Auth account
      await deleteUser(auth.currentUser)

      toast({
        title: "Account deleted",
        description: "Your account and all data have been permanently deleted",
        type: "success",
      })

      // Sign out and redirect
      await signOut()
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description:
          error.message === "auth/wrong-password"
            ? "Incorrect password"
            : error.message || "Failed to delete account",
        type: "error",
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>Download all your data as a JSON file</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExportData} disabled={exporting} className="w-full">
            {exporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Download className="mr-2 h-4 w-4" />
            Export All Data
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Includes vocabulary, study progress, decks, and settings. You can use this to backup your
            data or transfer it to another device.
          </p>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions - proceed with caution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Reset Database */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Database
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Reset Database to Factory Defaults?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <p>This will clear all your vocabulary and study progress, then reload fresh seed data:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>All vocabulary cards will be deleted</li>
                    <li>All study progress will be reset</li>
                    <li>Fresh seed data (662 N5 cards) will be loaded</li>
                    <li>Your account and settings will remain intact</li>
                  </ul>
                  <p className="font-medium text-orange-600">
                    This action cannot be undone. Export your data first if needed!
                  </p>
                  <p className="font-medium">Please confirm by typing RESET below:</p>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-2">
                <Label htmlFor="resetConfirmation">Type RESET to confirm</Label>
                <Input
                  id="resetConfirmation"
                  value={resetConfirmation}
                  onChange={(e) => setResetConfirmation(e.target.value)}
                  placeholder="RESET"
                  disabled={resetting}
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={resetting} onClick={() => setResetConfirmation("")}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetDatabase}
                  disabled={resetting || resetConfirmation !== "RESET"}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {resetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reset Database
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Delete Account */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Delete Account Permanently?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <p>This action cannot be undone. This will permanently delete:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Your account and profile</li>
                    <li>All vocabulary cards</li>
                    <li>All study progress</li>
                    <li>All custom decks</li>
                    <li>All settings</li>
                  </ul>
                  <p className="font-medium">Please confirm by typing DELETE below:</p>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4">
                {user && (
                  <div className="space-y-2">
                    <Label htmlFor="deletePassword">Your Password</Label>
                    <Input
                      id="deletePassword"
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={deleting}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="deleteConfirmation">Type DELETE to confirm</Label>
                  <Input
                    id="deleteConfirmation"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="DELETE"
                    disabled={deleting}
                  />
                </div>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirmation !== "DELETE"}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete Forever
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <p className="text-xs text-red-600 dark:text-red-400">
            Warning: Account deletion is permanent and cannot be reversed. Make sure to export your
            data before deleting your account.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
