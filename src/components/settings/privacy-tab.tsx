"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useSettings } from "@/contexts/settings-context"
import { toast } from "@/components/ui/toaster"

export function PrivacyTab() {
  const { settings, updateSettings } = useSettings()

  const handleUpdate = async (key: keyof typeof settings, value: any) => {
    try {
      await updateSettings({ [key]: value })
      toast({
        title: "Setting updated",
        description: "Your privacy preference has been saved",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Control your data and privacy preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Show Progress</Label>
            <p className="text-sm text-muted-foreground">Display your learning progress publicly</p>
          </div>
          <Switch
            checked={settings.showProgress}
            onCheckedChange={(checked) => handleUpdate("showProgress", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Data Collection</Label>
            <p className="text-sm text-muted-foreground">Help improve JapVocab with anonymous usage data</p>
          </div>
          <Switch
            checked={settings.allowDataCollection}
            onCheckedChange={(checked) => handleUpdate("allowDataCollection", checked)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
