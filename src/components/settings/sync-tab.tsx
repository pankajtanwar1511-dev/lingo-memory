"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/contexts/settings-context"
import { useAuth } from "@/contexts/auth-context"
import { settingsService } from "@/services/settings.service"
import { syncService } from "@/services/sync.service"
import { SyncActivity } from "@/types/settings"
import { toast } from "@/components/ui/toaster"
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function SyncTab() {
  const { settings, updateSettings } = useSettings()
  const { user, isFirebaseAvailable } = useAuth()
  const [activities, setActivities] = useState<SyncActivity[]>([])
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (user && isFirebaseAvailable) {
      loadActivity()
    }
  }, [user, isFirebaseAvailable])

  const loadActivity = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await settingsService.getSyncActivity(user.uid, 20)
      setActivities(data)
    } catch (error) {
      console.error("Failed to load sync activity:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleManualSync = async () => {
    setSyncing(true)
    try {
      await syncService.syncNow()
      toast({
        title: "Sync complete",
        description: "Your data has been synced successfully",
        type: "success",
      })
      await loadActivity()
    } catch (error: any) {
      toast({
        title: "Sync failed",
        description: error.message || "Failed to sync data",
        type: "error",
      })
    } finally {
      setSyncing(false)
    }
  }

  const handleUpdate = async (key: keyof typeof settings, value: any) => {
    try {
      await updateSettings({ [key]: value })
      toast({
        title: "Setting updated",
        description: "Your sync preference has been saved",
        type: "success",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to save setting",
        type: "error",
      })
    }
  }

  if (!isFirebaseAvailable) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sync</CardTitle>
          <CardDescription>
            Firebase is not configured. Sync features are unavailable in offline mode.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
          <CardDescription>Configure how your data syncs across devices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Sync</Label>
              <p className="text-sm text-muted-foreground">Automatically sync changes</p>
            </div>
            <Switch
              checked={settings.autoSync}
              onCheckedChange={(checked) => handleUpdate("autoSync", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Sync on Mobile Data</Label>
              <p className="text-sm text-muted-foreground">Allow sync when not on WiFi</p>
            </div>
            <Switch
              checked={settings.syncOnMobileData}
              onCheckedChange={(checked) => handleUpdate("syncOnMobileData", checked)}
            />
          </div>

          <Button onClick={handleManualSync} disabled={syncing} className="w-full">
            {syncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "" : ""}`} />
            Sync Now
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent sync history</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No sync activity yet</p>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  {activity.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {activity.type === "upload" ? "Uploaded" : "Downloaded"}{" "}
                      {activity.entityCount} {activity.entityType}
                      {activity.entityCount !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })} •{" "}
                      {activity.duration}ms
                    </p>
                    {activity.error && (
                      <p className="text-xs text-red-600 mt-1">{activity.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
