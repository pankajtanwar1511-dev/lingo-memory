"use client"

import { useState, useRef } from "react"
import {
  Download, Upload, Database, Trash2, Check,
  AlertCircle, HardDrive, Cloud, Shield
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toaster"
import { exportDatabase, importDatabase, useDatabaseStats } from "@/hooks/useDatabase"
import { databaseService } from "@/services/database.service"
import useStudyStore from "@/store/study-store"

export function DataTab() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [dataSync, setDataSync] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const dbStats = useDatabaseStats()
  const resetProgress = useStudyStore((state) => state.resetProgress)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      await exportDatabase()
      toast({
        title: "Export successful",
        description: "Your data has been downloaded",
        type: "success"
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export your data",
        type: "error"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsImporting(true)
      await importDatabase(file)
      toast({
        title: "Import successful",
        description: "Your data has been restored",
        type: "success"
      })

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Could not import data",
        type: "error"
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleDeleteData = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      setTimeout(() => setShowDeleteConfirm(false), 5000)
      return
    }

    try {
      await databaseService.clearAllData()
      resetProgress()
      toast({
        title: "Data cleared",
        description: "All your learning data has been deleted",
        type: "success"
      })
      setShowDeleteConfirm(false)

      // Reload the page to reinitialize
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Could not clear data",
        type: "error"
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Overview</CardTitle>
          <CardDescription>
            Your learning data and storage usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Cards</p>
              <p className="text-2xl font-bold">{dbStats.totalCards}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Study Cards</p>
              <p className="text-2xl font-bold">{dbStats.studyCards}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Sessions</p>
              <p className="text-2xl font-bold">{dbStats.sessions}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Storage Used</p>
              <p className="text-2xl font-bold">{dbStats.storageUsed}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>IndexedDB Storage</span>
              <span className="text-muted-foreground">{dbStats.storageUsed}</span>
            </div>
            <Progress value={30} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Using local browser storage for offline access
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Import, export, and manage your learning data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Data */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">
                  Download all your cards, progress, and settings
                </p>
              </div>
            </div>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              variant="outline"
            >
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>

          {/* Import Data */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Upload className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium">Import Data</p>
                <p className="text-sm text-muted-foreground">
                  Restore from a previous backup
                </p>
              </div>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                variant="outline"
              >
                {isImporting ? "Importing..." : "Import"}
              </Button>
            </div>
          </div>

          {/* Clear Data */}
          <div className="flex items-center justify-between p-4 border border-danger/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-danger/10 rounded-lg">
                <Trash2 className="h-5 w-5 text-danger" />
              </div>
              <div>
                <p className="font-medium text-danger">Clear All Data</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete all learning progress
                </p>
              </div>
            </div>
            <Button
              onClick={handleDeleteData}
              variant={showDeleteConfirm ? "destructive" : "outline"}
            >
              {showDeleteConfirm ? "Confirm Delete" : "Clear"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Sync & Backup</CardTitle>
          <CardDescription>
            Configure automatic backup and sync settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Cloud Sync
              </p>
              <p className="text-sm text-muted-foreground">
                Sync progress across all your devices
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="gradient">Premium</Badge>
              <Switch
                checked={dataSync}
                onCheckedChange={setDataSync}
                disabled
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Auto Backup
              </p>
              <p className="text-sm text-muted-foreground">
                Daily automatic backups to cloud
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="gradient">Premium</Badge>
              <Switch disabled />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Offline Mode
              </p>
              <p className="text-sm text-muted-foreground">
                All data stored locally for offline access
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">Active</Badge>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Backup Reminder</p>
                <p className="text-sm text-muted-foreground">
                  Regular backups ensure your progress is never lost. Export your data weekly
                  or upgrade to Premium for automatic cloud backups.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}