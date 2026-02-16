"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Upload, Download, FileText, Plus } from "lucide-react"
import Link from "next/link"

export function ManageTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vocabulary Management</CardTitle>
          <CardDescription>
            Manage your vocabulary cards, decks, and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The full vocabulary management interface is available on a dedicated page for better performance and functionality.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Vocabulary Cards</p>
                    <p className="text-xs text-muted-foreground">Create, edit, and search cards</p>
                  </div>
                </div>
                <Link href="/manage">
                  <Button className="w-full">
                    Open Vocabulary Manager
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Deck Management</p>
                    <p className="text-xs text-muted-foreground">Create and organize decks</p>
                  </div>
                </div>
                <Link href="/manage">
                  <Button variant="outline" className="w-full">
                    Open Deck Manager
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="bg-accent rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Quick Actions:</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Upload className="h-4 w-4 mr-2" />
                Import JSON
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Plus className="h-4 w-4 mr-2" />
                New Card
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              These actions are available on the full management page
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
