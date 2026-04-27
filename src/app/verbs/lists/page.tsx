'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ALL_PREDEFINED_LISTS,
  DIFFICULTY_LISTS,
  THEMATIC_LISTS,
  GRAMMAR_LISTS,
  type VerbList
} from '@/data/verb-lists'
import { useAuth } from '@/contexts/auth-context'
import { loadProgress, saveProgress } from '@/services/cloud-progress.service'
import { CreateCustomListDialog } from '@/components/verbs/create-custom-list-dialog'
import { ManageListVerbsDialog } from '@/components/verbs/manage-list-verbs-dialog'
import { Play, Plus, Star, BookOpen, GraduationCap, Edit, Trash2, ListPlus, CheckSquare, Square, ArrowLeft } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

interface N5Verb {
  id: string
  lemma: { kanji: string; kana: string }
  meaning: { primary: string; gloss: string[] }
  morphology: { class: string; isIrregular: boolean }
  valency: { type: string; requiredParticles: string[] }
}

export default function VerbListsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [customLists, setCustomLists] = useState<VerbList[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [verbProgress, setVerbProgress] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState<'difficulty' | 'thematic' | 'grammar' | 'custom'>('difficulty')
  const [allVerbs, setAllVerbs] = useState<N5Verb[]>([])
  const [dynamicGrammarLists, setDynamicGrammarLists] = useState<VerbList[]>(GRAMMAR_LISTS)

  // Multi-select state
  const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set())
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false)

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [manageVerbsDialogOpen, setManageVerbsDialogOpen] = useState(false)
  const [editingList, setEditingList] = useState<VerbList | undefined>(undefined)
  const [managingList, setManagingList] = useState<VerbList | undefined>(undefined)

  // Load verbs data
  useEffect(() => {
    loadVerbs()
  }, [])

  // Load user data — local first, cloud merge if signed in.
  useEffect(() => {
    loadUserData()
  }, [user?.uid])

  const loadVerbs = async () => {
    try {
      const response = await fetch('/seed-data/N5_verbs_dataset.json')
      const data = await response.json()
      const verbs: N5Verb[] = data.verbs.map((v: any) => ({
        id: v.id,
        lemma: v.lemma,
        meaning: v.meaning,
        morphology: v.morphology,
        valency: v.valency ?? { type: 'unknown', requiredParticles: [] }
      }))
      setAllVerbs(verbs)

      // Populate dynamic grammar lists from dataset
      setDynamicGrammarLists(GRAMMAR_LISTS.map(list => {
        switch (list.id) {
          case 'godan':
            return { ...list, verbIds: verbs.filter(v => v.morphology.class === 'godan').map(v => v.id) }
          case 'ichidan':
            return { ...list, verbIds: verbs.filter(v => v.morphology.class === 'ichidan').map(v => v.id) }
          case 'irregular':
            return { ...list, verbIds: verbs.filter(v => v.morphology.class === 'irregular').map(v => v.id) }
          case 'transitive':
            return { ...list, verbIds: verbs.filter(v => v.valency.type === 'transitive').map(v => v.id) }
          case 'intransitive':
            return { ...list, verbIds: verbs.filter(v => v.valency.type === 'intransitive').map(v => v.id) }
          default:
            return list
        }
      }))
    } catch (error) {
      console.error('Failed to load verbs:', error)
    }
  }

  const loadUserData = async () => {
    const [lists, favs, prog] = await Promise.all([
      loadProgress<VerbList[]>(user?.uid, 'customVerbLists', []),
      loadProgress<string[]>(user?.uid, 'favoriteVerbs', []),
      loadProgress<Record<string, number>>(user?.uid, 'verbProgress', {}),
    ])
    if (lists.length > 0) setCustomLists(lists)
    if (favs.length > 0) setFavorites(favs)
    if (Object.keys(prog).length > 0) setVerbProgress(prog)
  }

  const saveCustomLists = (lists: VerbList[]) => {
    setCustomLists(lists)
    saveProgress(user?.uid, 'customVerbLists', lists)
  }

  const calculateListProgress = (list: VerbList): number => {
    if (list.verbIds.length === 0) return 0
    const completedVerbs = list.verbIds.filter(id => verbProgress[id] >= 5).length
    return Math.round((completedVerbs / list.verbIds.length) * 100)
  }

  const handlePractice = (list: VerbList) => {
    // Navigate to verbs page with list filter
    router.push(`/verbs?list=${list.id}`)
  }

  const toggleListSelection = (listId: string) => {
    setSelectedLists(prev => {
      const newSet = new Set(prev)
      if (newSet.has(listId)) {
        newSet.delete(listId)
      } else {
        newSet.add(listId)
      }
      return newSet
    })
  }

  const handlePracticeCombined = () => {
    if (selectedLists.size === 0) return

    // Combine all verb IDs from selected lists
    const allLists = [...DIFFICULTY_LISTS, ...THEMATIC_LISTS, ...dynamicGrammarLists, ...customLists]
    const combinedVerbIds = new Set<string>()

    selectedLists.forEach(listId => {
      const list = allLists.find(l => l.id === listId)
      if (list) {
        list.verbIds.forEach(id => combinedVerbIds.add(id))
      }
    })

    // Create a temporary combined list in localStorage
    const combinedList: VerbList = {
      id: 'combined_temp',
      name: `Combined (${selectedLists.size} lists)`,
      description: `Practicing ${combinedVerbIds.size} unique verbs`,
      category: 'custom',
      verbIds: Array.from(combinedVerbIds)
    }

    // Store temporarily
    localStorage.setItem('tempCombinedList', JSON.stringify(combinedList))

    // Navigate
    router.push(`/verbs?list=combined_temp`)
  }

  const clearSelection = () => {
    setSelectedLists(new Set())
    setIsMultiSelectMode(false)
  }

  const handleCreateCustomList = () => {
    setEditingList(undefined)
    setCreateDialogOpen(true)
  }

  const handleEditList = (list: VerbList) => {
    setEditingList(list)
    setCreateDialogOpen(true)
  }

  const handleManageVerbs = (list: VerbList) => {
    setManagingList(list)
    setManageVerbsDialogOpen(true)
  }

  const handleDeleteList = (listId: string) => {
    const newLists = customLists.filter(l => l.id !== listId)
    saveCustomLists(newLists)
  }

  const handleSaveList = async (listData: Omit<VerbList, 'id'>) => {
    if (editingList) {
      // Update existing list
      const newLists = customLists.map(l =>
        l.id === editingList.id ? { ...listData, id: editingList.id } : l
      )
      saveCustomLists(newLists)
    } else {
      // Create new list
      const newList: VerbList = {
        ...listData,
        id: `custom_${Date.now()}`
      }
      saveCustomLists([...customLists, newList])
    }
  }

  const handleSaveListVerbs = async (verbIds: string[]) => {
    if (!managingList) return

    const newLists = customLists.map(l =>
      l.id === managingList.id ? { ...l, verbIds } : l
    )
    saveCustomLists(newLists)
  }

  const getColorClasses = (color?: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
      teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
      cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
      violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
      rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' }
    }
    return colorMap[color || 'blue'] || colorMap.blue
  }

  const renderListCard = (list: VerbList) => {
    const progress = calculateListProgress(list)
    const colors = getColorClasses(list.color)
    const isSelected = selectedLists.has(list.id)

    return (
      <Card
        key={list.id}
        className={`${colors.bg} ${colors.border} border-2 hover:shadow-lg transition-all ${
          isSelected ? 'ring-2 ring-primary shadow-xl' : ''
        } ${isMultiSelectMode ? 'cursor-pointer' : ''}`}
        onClick={() => isMultiSelectMode && toggleListSelection(list.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {isMultiSelectMode && (
                <Checkbox
                  checked={isSelected}
                  onChange={() => toggleListSelection(list.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1"
                />
              )}
              {list.icon && <span className="text-2xl">{list.icon}</span>}
              <div>
                <CardTitle className={`text-lg ${colors.text}`}>{list.name}</CardTitle>
                <CardDescription className="text-sm mt-1">{list.description}</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="ml-2">
              {list.verbIds.length} verbs
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Action buttons */}
            {!isMultiSelectMode && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handlePractice(list)}
                  className={`flex-1 ${colors.text}`}
                  variant="outline"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Practice
                </Button>
                {list.category === 'custom' && (
                  <>
                    <Button variant="ghost" size="icon" onClick={() => handleManageVerbs(list)} title="Manage verbs">
                      <ListPlus className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditList(list)} title="Edit list">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteList(list.id)} title="Delete list">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderTabContent = () => {
    let lists: VerbList[] = []

    switch (activeTab) {
      case 'difficulty':
        lists = DIFFICULTY_LISTS
        break
      case 'thematic':
        lists = THEMATIC_LISTS
        break
      case 'grammar':
        lists = dynamicGrammarLists
        break
      case 'custom':
        lists = customLists
        break
    }

    if (lists.length === 0 && activeTab === 'custom') {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">No custom lists yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your own custom verb lists to focus on specific learning goals
          </p>
          <Button onClick={handleCreateCustomList}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First List
          </Button>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.map(list => renderListCard(list))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start sm:items-center justify-between gap-2 mb-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Verb Lists</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Choose from curated lists or create your own to focus your learning
              </p>
            </div>
            <Button onClick={() => router.push('/verbs')} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Card>
              <CardContent className="p-3 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-center sm:text-left">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg self-center sm:self-auto">
                    <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">
                      {Object.values(verbProgress).filter(p => p >= 5).length}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Mastered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-center sm:text-left">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-lg self-center sm:self-auto">
                    <Star className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{favorites.length}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Favorites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-center sm:text-left">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-lg self-center sm:self-auto">
                    <Star className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{customLists.length}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Custom Lists</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeTab === 'difficulty' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('difficulty')}
                className="rounded-full px-2 sm:px-4"
                size="sm"
              >
                <GraduationCap className="w-4 h-4 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline">By Difficulty</span>
                <span className="sm:hidden text-xs">Level</span>
              </Button>
              <Button
                variant={activeTab === 'thematic' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('thematic')}
                className="rounded-full px-2 sm:px-4"
                size="sm"
              >
                <BookOpen className="w-4 h-4 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline">By Theme</span>
                <span className="sm:hidden text-xs">Theme</span>
              </Button>
              <Button
                variant={activeTab === 'grammar' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('grammar')}
                className="rounded-full px-2 sm:px-4"
                size="sm"
              >
                <GraduationCap className="w-4 h-4 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline">By Grammar</span>
                <span className="sm:hidden text-xs">Grammar</span>
              </Button>
              <Button
                variant={activeTab === 'custom' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('custom')}
                className="rounded-full px-2 sm:px-4"
                size="sm"
              >
                <Star className="w-4 h-4 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline">My Lists</span>
                <span className="sm:hidden text-xs">Mine</span>
                {customLists.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {customLists.length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Multi-select toggle */}
            <Button
              variant={isMultiSelectMode ? 'default' : 'outline'}
              onClick={() => {
                setIsMultiSelectMode(!isMultiSelectMode)
                if (isMultiSelectMode) {
                  clearSelection()
                }
              }}
              size="sm"
            >
              {isMultiSelectMode ? (
                <>
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Cancel Selection
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Select Multiple
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Lists grid */}
        {renderTabContent()}

        {/* Create custom list button for non-custom tabs */}
        {activeTab !== 'custom' && isAuthenticated && (
          <div className="mt-8 text-center">
            <Button onClick={handleCreateCustomList} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Custom List
            </Button>
          </div>
        )}

        {/* Dialogs */}
        <CreateCustomListDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSave={handleSaveList}
          editList={editingList}
        />

        {managingList && (
          <ManageListVerbsDialog
            open={manageVerbsDialogOpen}
            onOpenChange={setManageVerbsDialogOpen}
            list={managingList}
            allVerbs={allVerbs}
            onSave={handleSaveListVerbs}
          />
        )}

        {/* Floating action bar for multi-select */}
        {selectedLists.size > 0 && (
          <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 w-[calc(100vw-2rem)] sm:w-auto max-w-lg">
            <Card className="shadow-2xl border-2 border-primary">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-primary shrink-0" />
                    <div className="text-left">
                      <p className="font-semibold text-sm">
                        {selectedLists.size} {selectedLists.size === 1 ? 'list' : 'lists'} selected
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(() => {
                          const allLists = [...DIFFICULTY_LISTS, ...THEMATIC_LISTS, ...dynamicGrammarLists, ...customLists]
                          const combinedVerbIds = new Set<string>()
                          selectedLists.forEach(listId => {
                            const list = allLists.find(l => l.id === listId)
                            if (list) {
                              list.verbIds.forEach(id => combinedVerbIds.add(id))
                            }
                          })
                          return `${combinedVerbIds.size} unique verbs`
                        })()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:ml-auto">
                    <Button onClick={handlePracticeCombined} size="sm" className="flex-1 sm:flex-none">
                      <Play className="w-4 h-4 mr-2" />
                      Practice Combined
                    </Button>
                    <Button variant="outline" onClick={clearSelection} size="sm">
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
