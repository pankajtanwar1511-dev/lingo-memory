# Day 4 Quick Start Guide

## Getting Started

### 1. Access the Vocabulary Management Page

Navigate to `/manage` in your application:

```bash
npm run dev
# Open http://localhost:3000/manage
```

---

## Common Tasks

### Import Vocabulary from CSV

**Step 1**: Prepare your CSV file in Anki format:

```csv
Front,Back,Example (Japanese),Example (English),Tags
水 (みず),water,水を飲みます,I drink water,N5 noun common
食べる (たべる),to eat,すしを食べたい,I want to eat sushi,N5 verb common
```

**Step 2**: Click "Import CSV" button in the Vocabulary tab

**Step 3**: Select your CSV file

**Step 4**: Review the import result notification

---

### Import from JMdict JSON

**Code Example**:

```typescript
import { loadJMdictFromURL, filterByJLPTLevel } from "@/lib/jmdict-parser"

// Load JMdict data
const allCards = await loadJMdictFromURL("https://example.com/jmdict-eng.json")

// Filter to N5 only
const n5Cards = filterByJLPTLevel(allCards, "N5")

// Save to database
for (const card of n5Cards) {
  await databaseService.addVocabularyCard(card)
}
```

---

### Create a New Vocabulary Card

**Step 1**: Go to Vocabulary tab

**Step 2**: Click "New Card" button

**Step 3**: Fill in the form:
- Kana (required): `みず`
- Kanji (optional): `水`
- Meaning (required): `water`
- JLPT Level: `N5`
- Part of Speech: `noun` (click + to add)
- Tags: `common`, `nature` (click + to add each)

**Step 4**: Add example sentences (optional):
- Japanese: `水を飲みます`
- Hiragana: `みずをのみます`
- English: `I drink water`
- Click "Add Example"

**Step 5**: Click "Create Card"

---

### Search and Filter Vocabulary

**Basic Search**:
1. Type in search box: `water` or `みず` or `水`
2. Results update in real-time

**Advanced Filtering**:
1. Click "Filters" button
2. Select filters:
   - JLPT Level: `N5`
   - Part of Speech: `noun`
   - Kanji: `With Kanji`
   - Examples: `With Examples`
3. Click tags to filter by tags
4. Results update automatically

**Clear Filters**:
- Click "Clear" button next to Filters

---

### Bulk Operations

**Select Multiple Cards**:
1. Enable bulk actions (checkboxes appear)
2. Click checkboxes on cards you want to modify
3. Or click "Select All" to select all visible cards

**Add Tags to Selected Cards**:
1. Select cards (see above)
2. Bulk Operations panel appears
3. Choose "Add Tags" from dropdown
4. Enter tags: `reviewed, favorite`
5. Click "Add Tags"

**Update JLPT Level**:
1. Select cards
2. Choose "Update JLPT Level"
3. Select level: `N4`
4. Click "Update JLPT Level"

**Export Selected Cards**:
1. Select cards
2. Choose "Export Selected"
3. Click "Export X Cards"
4. CSV file downloads automatically

**Delete Cards**:
1. Select cards
2. Choose "Delete"
3. Read warning
4. Click "Delete X Cards"
5. Confirm in dialog

---

### Create and Manage Decks

**Create New Deck**:
1. Switch to "Decks" tab
2. Click "New Deck" button
3. Fill in form:
   - Name: `Common Verbs`
   - Description: `Most common Japanese verbs for daily conversation`
   - JLPT Level: `N5`
   - Visibility: `Private`
4. Click "Create"

**Edit Deck**:
1. Find deck in list
2. Click "Edit" button
3. Modify fields
4. Click "Save"

**Export Deck**:
1. Click "Export" button on deck
2. JSON file downloads with deck data and all cards

**Import Deck**:
1. Click "Import" button in header
2. Select JSON deck file
3. Deck and all cards are imported

**Delete Deck**:
1. Click "Delete" button
2. Confirm in dialog
3. Deck is removed (cards remain in vocabulary)

---

### Export All Vocabulary

**Export to CSV (Anki)**:
1. Click "Export All CSV" in header
2. File downloads as `lingomemory-all.csv`
3. Can be imported into Anki

**Export to JSON**:
1. Click "Export All JSON" in header
2. File downloads as `lingomemory-all.json`
3. Can be re-imported or backed up

---

## Code Examples

### Programmatic Import

```typescript
import { importFromCSV, importCardsFromJSON } from "@/lib/import-export"

// Import CSV
const csvContent = await fetch("/data/n5-vocabulary.csv").then(r => r.text())
const result = importFromCSV(csvContent, {
  hasHeader: true,
  defaultJLPTLevel: "N5",
  skipInvalidRows: true
})

console.log(`Imported ${result.success} cards`)
console.log(`Failed: ${result.failed}`)
console.log(result.cards)

// Import JSON
const jsonContent = await fetch("/data/vocabulary.json").then(r => r.text())
const cards = importCardsFromJSON(jsonContent)
```

### Programmatic Export

```typescript
import { exportToCSV, exportCardsToJSON } from "@/lib/import-export"

// Get all N5 cards
const n5Cards = vocabulary.filter(card => card.jlptLevel === "N5")

// Export to CSV
const csvContent = exportToCSV(n5Cards, {
  includeHeader: true,
  ankiFormat: true,
  includeExamples: true,
  includeTags: true
})

// Save or download
// (In browser: use downloadFile utility)
// (In Node.js: fs.writeFileSync)
```

### Process JMdict Data

```typescript
import {
  parseJMdictEntry,
  parseJMdictEntries,
  filterByJLPTLevel,
  calculateVocabularyStats
} from "@/lib/jmdict-parser"

// Parse entries
const cards = parseJMdictEntries(jmdictData)

// Filter by level
const n5Cards = filterByJLPTLevel(cards, "N5")
const n4Cards = filterByJLPTLevel(cards, "N4")

// Get statistics
const stats = calculateVocabularyStats(cards)
console.log(`Total: ${stats.total}`)
console.log(`N5: ${stats.byJLPT.N5}`)
console.log(`N4: ${stats.byJLPT.N4}`)
console.log(`Verbs: ${stats.byPartOfSpeech["verb"]}`)
console.log(`With kanji: ${stats.withKanji}`)
```

---

## Integration with Database

### Update Database Service

Add these methods to `src/services/database.service.ts`:

```typescript
// Add vocabulary card
async addVocabularyCard(card: VocabularyCard): Promise<void> {
  await db.vocabulary.add(card)
}

// Add multiple cards (bulk)
async addVocabularyCards(cards: VocabularyCard[]): Promise<void> {
  await db.vocabulary.bulkAdd(cards)
}

// Update card
async updateVocabularyCard(id: string, updates: Partial<VocabularyCard>): Promise<void> {
  await db.vocabulary.update(id, { ...updates, updatedAt: new Date() })
}

// Delete cards (bulk)
async deleteVocabularyCards(ids: string[]): Promise<void> {
  await db.vocabulary.bulkDelete(ids)
}

// Bulk update tags
async bulkAddTags(cardIds: string[], tags: string[]): Promise<void> {
  const cards = await db.vocabulary.where("id").anyOf(cardIds).toArray()
  const updates = cards.map(card => ({
    key: card.id,
    changes: {
      tags: [...new Set([...(card.tags || []), ...tags])],
      updatedAt: new Date()
    }
  }))
  await db.vocabulary.bulkUpdate(updates)
}

// Bulk update JLPT level
async bulkUpdateJLPT(cardIds: string[], level: JLPTLevel | undefined): Promise<void> {
  await db.vocabulary
    .where("id")
    .anyOf(cardIds)
    .modify({ jlptLevel: level, updatedAt: new Date() })
}
```

### Use in Management Page

```typescript
import { databaseService } from "@/services/database.service"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"

export default function ManagePage() {
  // Get live data from database
  const vocabulary = useLiveQuery(() => db.vocabulary.toArray()) || []
  const decks = useLiveQuery(() => db.decks.toArray()) || []

  // Save card
  const handleSaveCard = async (card: VocabularyCard) => {
    if (editingCard) {
      await databaseService.updateVocabularyCard(card.id, card)
    } else {
      await databaseService.addVocabularyCard(card)
    }
  }

  // Delete cards
  const handleDeleteCards = async (cardIds: string[]) => {
    await databaseService.deleteVocabularyCards(cardIds)
  }

  // Bulk add tags
  const handleAddTags = async (cardIds: string[], tags: string[]) => {
    await databaseService.bulkAddTags(cardIds, tags)
  }

  // ... rest of component
}
```

---

## Testing

### Manual Test Checklist

Run through these tests to verify Day 4 features:

**✓ JMdict Parser**
- [ ] Load sample JMdict JSON file
- [ ] Parse entries correctly
- [ ] JLPT levels extracted properly
- [ ] Statistics calculated correctly

**✓ CSV Import**
- [ ] Import Anki format CSV
- [ ] Import with header row
- [ ] Import without header
- [ ] Handle invalid rows gracefully
- [ ] Show import summary

**✓ JSON Import**
- [ ] Import vocabulary cards array
- [ ] Import full deck
- [ ] Validate required fields
- [ ] Show error for invalid JSON

**✓ CSV Export**
- [ ] Export in Anki format
- [ ] Include examples
- [ ] Include tags
- [ ] Headers included
- [ ] Special characters escaped

**✓ JSON Export**
- [ ] Export all cards
- [ ] Export deck with metadata
- [ ] Valid JSON format
- [ ] All fields preserved

**✓ Search**
- [ ] Search by kanji
- [ ] Search by kana
- [ ] Search by English meaning
- [ ] Case-insensitive search
- [ ] Real-time results

**✓ Filters**
- [ ] Filter by JLPT level
- [ ] Filter by part of speech
- [ ] Filter by tag
- [ ] Filter by has kanji
- [ ] Filter by has examples
- [ ] Combine multiple filters
- [ ] Clear filters button works

**✓ Bulk Operations**
- [ ] Select multiple cards
- [ ] Select all visible
- [ ] Add tags to selection
- [ ] Remove tags from selection
- [ ] Update JLPT level
- [ ] Move to deck
- [ ] Export selection
- [ ] Delete selection
- [ ] Clear selection

**✓ Card Editor**
- [ ] Create new card
- [ ] Edit existing card
- [ ] Add examples
- [ ] Remove examples
- [ ] Add tags
- [ ] Add part of speech
- [ ] Validation works
- [ ] Cancel works

**✓ Deck Manager**
- [ ] Create deck
- [ ] Edit deck
- [ ] Delete deck
- [ ] Export deck
- [ ] Import deck
- [ ] Visibility toggle

---

## Tips & Best Practices

### Importing Large Datasets

For datasets with 1000+ cards:
```typescript
// Import in batches
const BATCH_SIZE = 500
for (let i = 0; i < cards.length; i += BATCH_SIZE) {
  const batch = cards.slice(i, i + BATCH_SIZE)
  await databaseService.addVocabularyCards(batch)
  console.log(`Imported ${i + batch.length} / ${cards.length}`)
}
```

### Optimizing Search

Add debouncing for search input:
```typescript
import { useMemo, useState } from "react"
import { debounce } from "lodash"

const debouncedSearch = useMemo(
  () => debounce((query) => {
    setFilters(prev => ({ ...prev, searchQuery: query }))
  }, 300),
  []
)
```

### Backup Strategy

Regular exports for backup:
```typescript
// Export all data weekly
const exportBackup = () => {
  const timestamp = new Date().toISOString().split("T")[0]
  exportVocabularyToCSVFile(vocabulary, `backup-${timestamp}.csv`)
}
```

---

## Troubleshooting

### Import fails silently
**Check**: Browser console for error messages
**Fix**: Verify file format matches expected structure

### Search returns no results
**Check**: Search query exact spelling
**Fix**: Try partial matches or check filters

### Export file is empty
**Check**: Selected cards or vocabulary array
**Fix**: Ensure data exists before export

### Bulk operations timeout
**Check**: Number of selected cards
**Fix**: Process in smaller batches

---

## Next Steps

After Day 4 completion, you can:

1. **Integrate with Firebase** (Day 5+)
   - Cloud sync for vocabulary
   - Multi-device support
   - Shared decks

2. **Add Audio Generation** (Day 5+)
   - OpenAI TTS integration
   - Japanese voice actors
   - Pronunciation practice

3. **Implement Quiz Mode** (Day 5+)
   - Multiple choice
   - Typing practice
   - Listening comprehension

4. **Add Tatoeba Integration** (Day 6+)
   - Auto-fetch example sentences
   - Audio from Tatoeba
   - Multiple example sources

---

## Resources

### JMdict Data Sources
- **JMdict JSON**: https://github.com/scriptin/jmdict-simplified
- **JMdict Official**: https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project

### Tatoeba Sentences
- **Tatoeba**: https://tatoeba.org/en/downloads
- **Japanese-English Pairs**: Available in TSV format

### Anki Integration
- **Anki Manual**: https://docs.ankiweb.net/importing.html
- **CSV Format**: Tab or comma separated

---

## Support

For issues or questions:
1. Check DAY4_FEATURES.md for detailed documentation
2. Review code comments in library files
3. Test with small datasets first
4. Check browser console for errors

---

**Day 4 Complete! 🎉**

You now have a fully-featured vocabulary management system with:
- ✅ JMdict integration
- ✅ CSV/JSON import/export
- ✅ Advanced search and filtering
- ✅ Deck management
- ✅ Bulk operations
- ✅ Vocabulary editor
- ✅ Anki compatibility

Ready to move to Day 5!
