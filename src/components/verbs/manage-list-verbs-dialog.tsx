'use client'

import { useState, useEffect } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VerbList } from '@/data/verb-lists'
import { Search, Loader2, Check } from 'lucide-react'

interface N5Verb {
  id: string
  kanji: string
  kana: string
  primaryMeaning: string
  verbGroup: string
}

interface ManageListVerbsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  list: VerbList
  allVerbs: N5Verb[]
  onSave: (verbIds: string[]) => Promise<void>
}

export function ManageListVerbsDialog({
  open,
  onOpenChange,
  list,
  allVerbs,
  onSave
}: ManageListVerbsDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVerbIds, setSelectedVerbIds] = useState<Set<string>>(new Set(list.verbIds))
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setSelectedVerbIds(new Set(list.verbIds))
  }, [list.verbIds])

  const filteredVerbs = allVerbs.filter(verb => {
    const query = searchQuery.toLowerCase()
    return (
      verb.kanji.includes(query) ||
      verb.kana.includes(query) ||
      verb.primaryMeaning.toLowerCase().includes(query)
    )
  })

  const toggleVerb = (verbId: string) => {
    const newSelected = new Set(selectedVerbIds)
    if (newSelected.has(verbId)) {
      newSelected.delete(verbId)
    } else {
      newSelected.add(verbId)
    }
    setSelectedVerbIds(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedVerbIds.size === filteredVerbs.length) {
      setSelectedVerbIds(new Set())
    } else {
      setSelectedVerbIds(new Set(filteredVerbs.map(v => v.id)))
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(Array.from(selectedVerbIds))
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save verb selection:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Manage Verbs - {list.name}</DialogTitle>
          <DialogDescription>
            Select verbs to include in this list ({selectedVerbIds.size} selected)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search verbs by kanji, kana, or meaning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Select All */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedVerbIds.size === filteredVerbs.length ? 'Deselect All' : 'Select All'}
            </Button>
            <span className="text-sm text-muted-foreground">
              {filteredVerbs.length} verbs shown
            </span>
          </div>

          {/* Verb list */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {filteredVerbs.map((verb) => {
                const isSelected = selectedVerbIds.has(verb.id)
                return (
                  <div
                    key={verb.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted/30 hover:bg-muted/50 border-transparent'
                    }`}
                    onClick={() => toggleVerb(verb.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleVerb(verb.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{verb.kanji}</span>
                        <span className="text-muted-foreground">({verb.kana})</span>
                        <Badge variant="outline" className="ml-auto">
                          {verb.verbGroup}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {verb.primaryMeaning}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
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
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save ({selectedVerbIds.size} verbs)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
