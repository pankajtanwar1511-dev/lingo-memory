"use client"

import { Header } from "@/components/layout/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountTab } from "@/components/settings/account-tab"
import { PreferencesTab } from "@/components/settings/preferences-tab"
import { PrivacyTab } from "@/components/settings/privacy-tab"
import { SyncTab } from "@/components/settings/sync-tab"
import { SecurityTab } from "@/components/settings/security-tab"
import { DataTab } from "@/components/settings/data-tab"
import { ManageTab } from "@/components/settings/manage-tab"
import { DatabaseTab } from "@/components/settings/database-tab"
import { useSettings } from "@/contexts/settings-context"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { loading } = useSettings()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and customize your learning experience
            </p>
          </div>

          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="sync">Sync</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <AccountTab />
            </TabsContent>

            <TabsContent value="preferences">
              <PreferencesTab />
            </TabsContent>

            <TabsContent value="privacy">
              <PrivacyTab />
            </TabsContent>

            <TabsContent value="sync">
              <SyncTab />
            </TabsContent>

            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>

            <TabsContent value="data">
              <DataTab />
            </TabsContent>

            <TabsContent value="manage">
              <ManageTab />
            </TabsContent>

            <TabsContent value="database">
              <DatabaseTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
