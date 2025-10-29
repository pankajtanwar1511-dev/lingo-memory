"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/contexts/settings-context"
import { useTheme } from "next-themes"
import { toast } from "@/components/ui/toaster"
import { Sun, Moon } from "lucide-react"
import useStudyStore from "@/store/study-store"

export function PreferencesTab() {
  const { settings, updateSettings } = useSettings()
  const { theme, setTheme } = useTheme()
  const { preferences, updatePreferences } = useStudyStore()

  const handleUpdate = async (key: keyof typeof settings, value: any) => {
    try {
      await updateSettings({ [key]: value })
      toast({
        title: "Setting updated",
        description: "Your preference has been saved",
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the app's look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Theme</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button
                size="sm"
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Study Settings</CardTitle>
          <CardDescription>Configure your learning preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Daily Goal</Label>
              <p className="text-sm text-muted-foreground">Cards to study per day</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleUpdate("dailyGoal", Math.max(5, settings.dailyGoal - 5))}
              >
                -
              </Button>
              <span className="w-12 text-center font-medium">{settings.dailyGoal}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleUpdate("dailyGoal", Math.min(100, settings.dailyGoal + 5))}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-play Audio</Label>
              <p className="text-sm text-muted-foreground">Automatically play pronunciation</p>
            </div>
            <Switch
              checked={settings.autoPlayAudio}
              onCheckedChange={(checked) => handleUpdate("autoPlayAudio", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Furigana</Label>
              <p className="text-sm text-muted-foreground">Display reading hints</p>
            </div>
            <Switch
              checked={settings.showFurigana}
              onCheckedChange={(checked) => handleUpdate("showFurigana", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example Sentences</CardTitle>
          <CardDescription>Control which examples to display during study</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Generated Examples</Label>
              <p className="text-sm text-muted-foreground">AI-generated sentences with personas</p>
            </div>
            <Switch
              checked={preferences.showGeneratedExamples}
              onCheckedChange={(checked) => updatePreferences({ showGeneratedExamples: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Authentic Examples</Label>
              <p className="text-sm text-muted-foreground">Examples from Tatoeba and other sources</p>
            </div>
            <Switch
              checked={preferences.showAuthenticExamples}
              onCheckedChange={(checked) => updatePreferences({ showAuthenticExamples: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Needs Review</Label>
              <p className="text-sm text-muted-foreground">Display examples pending review</p>
            </div>
            <Switch
              checked={preferences.showNeedsReview}
              onCheckedChange={(checked) => updatePreferences({ showNeedsReview: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Study Reminders</Label>
              <p className="text-sm text-muted-foreground">Daily study notifications</p>
            </div>
            <Switch
              checked={settings.studyReminders}
              onCheckedChange={(checked) => handleUpdate("studyReminders", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly Report</Label>
              <p className="text-sm text-muted-foreground">Weekly progress summary</p>
            </div>
            <Switch
              checked={settings.weeklyReport}
              onCheckedChange={(checked) => handleUpdate("weeklyReport", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
