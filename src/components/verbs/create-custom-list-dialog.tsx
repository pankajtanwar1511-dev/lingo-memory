'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { VerbList } from '@/data/verb-lists'
import { Loader2 } from 'lucide-react'

interface CreateCustomListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (list: Omit<VerbList, 'id'>) => Promise<void>
  editList?: VerbList
}

export function CreateCustomListDialog({
  open,
  onOpenChange,
  onSave,
  editList
}: CreateCustomListDialogProps) {
  const [name, setName] = useState(editList?.name || '')
  const [description, setDescription] = useState(editList?.description || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      return
    }

    setIsSaving(true)

    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        category: 'custom',
        verbIds: editList?.verbIds || [],
        icon: '📝',
        color: 'blue'
      })

      // Reset form
      setName('')
      setDescription('')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save list:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editList ? 'Edit Custom List' : 'Create Custom List'}
            </DialogTitle>
            <DialogDescription>
              {editList
                ? 'Update your custom verb list'
                : 'Create a new custom verb list to organize your learning'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">List Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Daily Conversation Verbs"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                {name.length}/50 characters
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this list is for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/200 characters
              </p>
            </div>

            {editList && (
              <div className="text-sm text-muted-foreground">
                <p>Current verbs: {editList.verbIds.length}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !name.trim()}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editList ? 'Update List' : 'Create List'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
