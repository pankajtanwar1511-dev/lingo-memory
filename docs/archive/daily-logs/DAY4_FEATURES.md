# Day 4 Implementation - Vocabulary Data Management

## Overview

Day 4 adds comprehensive vocabulary data management features to LingoMemory, including JMdict integration, import/export capabilities, advanced search/filtering, deck management, and bulk operations.

## Features Implemented

### 1. JMdict Parser and Data Processor
**File**: `src/lib/jmdict-parser.ts`

Processes JMdict JSON/XML data into VocabularyCard format.

**Features**:
- Parse JMdict JSON entries
- Extract JLPT level from tags
- Handle multiple readings and meanings
- Extract part of speech information
- Generate unique vocabulary IDs
- Calculate vocabulary statistics

**Usage**:
```typescript
import { parseJMdictEntry, loadJMdictFromURL, filterByJLPTLevel } from "@/lib/jmdict-parser"

// Parse a single JMdict entry
const card = parseJMdictEntry(jmdictEntry)

// Load from URL
const cards = await loadJMdictFromURL("https://example.com/jmdict.json")

// Filter by JLPT level
const n5Cards = filterByJLPTLevel(cards, "N5")

// Calculate statistics
const stats = calculateVocabularyStats(cards)
console.log(`Total: ${stats.total}, N5: ${stats.byJLPT.N5}`)
```

**JMdict Entry Structure**:
```typescript
interface JMdictEntry {
  id: string | number
  kanji?: JMdictKanji[]
  readings: JMdictReading[]
  senses: JMdictSense[]
}
```

**Output VocabularyCard**:
- Auto-generates unique ID (e.g., `n5_000123`)
- Extracts primary kanji and reading
- Combines all sense glosses into meaning
- Tags extracted from entry metadata
- JLPT level auto-detected from tags
- License: CC BY-SA 4.0

---

### 2. Import/Export System
**File**: `src/lib/import-export.ts`

Comprehensive data import/export utilities supporting multiple formats.

#### Supported Formats

**CSV (Comma-Separated Values)**:
- Anki-compatible format (front, back, example, tags)
- Standard format (all fields including examples JSON)
- Custom delimiters (comma, tab, pipe)
- Header row support

**JSON**:
- Native VocabularyCard array format
- Full Deck format with metadata
- Preserves all fields and relationships

**TSV (Tab-Separated Values)**:
- Same as CSV but tab-delimited

#### Export Features

**Export to CSV (Anki Format)**:
```typescript
import { exportToCSV, exportVocabularyToCSVFile } from "@/lib/import-export"

// Export to CSV string
const csvContent = exportToCSV(cards, {
  delimiter: ",",
  includeHeader: true,
  ankiFormat: true,
  includeExamples: true,
  includeTags: true
})

// Export and download as file (browser)
exportVocabularyToCSVFile(cards, "my-deck.csv", {
  ankiFormat: true
})
```

**Anki CSV Format**:
```csv
Front,Back,Example (Japanese),Example (English),Tags
水 (みず),water,水を飲みます,I drink water,N5 noun common
```

**Export to JSON**:
```typescript
import { exportCardsToJSON, exportDeckToJSONFile } from "@/lib/import-export"

// Export cards
const json = exportCardsToJSON(cards)

// Export deck with metadata
exportDeckToJSONFile(deck, "n5-deck.json")
```

#### Import Features

**Import from CSV**:
```typescript
import { importFromCSV } from "@/lib/import-export"

const result = importFromCSV(csvContent, {
  hasHeader: true,
  delimiter: ",",
  skipInvalidRows: true,
  defaultJLPTLevel: "N5"
})

console.log(`Success: ${result.success}, Failed: ${result.failed}`)
console.log(`Imported cards:`, result.cards)
console.log(`Errors:`, result.errors)
```

**Import from JSON**:
```typescript
import { importCardsFromJSON, importDeckFromJSON } from "@/lib/import-export"

// Import cards array
const cards = importCardsFromJSON(jsonContent)

// Import full deck
const deck = importDeckFromJSON(deckJsonContent)
```

**Browser File Upload**:
```typescript
import { readFile } from "@/lib/import-export"

// Read file content
const content = await readFile(file)
const result = importFromCSV(content)
```

---

### 3. Vocabulary Search and Filter UI
**File**: `src/components/vocabulary-search.tsx`

Advanced search and filtering component with real-time filtering.

**Features**:
- Full-text search (kanji, kana, meaning)
- JLPT level filter (N5-N1)
- Part of speech filter
- Kanji presence filter (with/without kanji)
- Examples presence filter
- Tag-based filtering
- Bulk selection support
- Real-time filter updates

**Usage**:
```tsx
import { VocabularySearch } from "@/components/vocabulary-search"

<VocabularySearch
  vocabulary={allCards}
  onSelectCard={(card) => handleEdit(card)}
  onBulkSelect={(cards) => setSelected(cards)}
  showBulkActions={true}
/>
```

**Filter Options**:
- Search query: Matches kanji, kana, or meaning
- JLPT level: N5, N4, N3, N2, N1, or all
- Part of speech: Noun, verb, adjective, etc.
- Has kanji: Yes, No, or all
- Has examples: Yes, No, or all
- Tags: Multi-select tag filtering

**UI Features**:
- Collapsible advanced filters
- Active filter badges with clear button
- Result count display
- Select all / clear selection
- Card selection checkboxes
- Responsive grid layout

---

### 4. Deck Management UI
**File**: `src/components/deck-manager.tsx`

Complete deck CRUD operations interface.

**Features**:
- Create new decks
- Edit deck metadata
- Delete decks with confirmation
- Export decks to JSON
- Import decks from JSON
- Visibility control (private/shared/public)
- JLPT level assignment
- Card count tracking
- Source attribution

**Usage**:
```tsx
import { DeckManager } from "@/components/deck-manager"

<DeckManager
  decks={allDecks}
  onCreateDeck={handleCreate}
  onUpdateDeck={handleUpdate}
  onDeleteDeck={handleDelete}
  onExportDeck={handleExport}
  onImportDeck={handleImport}
/>
```

**Deck Properties**:
```typescript
interface Deck {
  id: string
  name: string
  description?: string
  jlptLevel?: JLPTLevel
  cards: VocabularyCard[]
  visibility: "private" | "public" | "shared"
  premiumOnly?: boolean
  credits?: {
    author?: string
    sources: string[]
  }
  createdAt: Date
  updatedAt: Date
}
```

**UI Features**:
- Inline create/edit form
- Visibility icons (eye/eye-off)
- Card count badges
- Premium deck indicator
- Source credits display
- Confirmation dialogs for destructive actions

---

### 5. Bulk Operations
**File**: `src/components/bulk-operations.tsx`

Batch operations on multiple vocabulary cards.

**Supported Operations**:
1. **Add Tags**: Add one or more tags to selected cards
2. **Remove Tags**: Remove tags from selected cards
3. **Update JLPT Level**: Set or clear JLPT level for multiple cards
4. **Move to Deck**: Transfer cards to another deck
5. **Export Selected**: Export selected cards to CSV
6. **Delete**: Bulk delete with confirmation

**Usage**:
```tsx
import { BulkOperations } from "@/components/bulk-operations"

<BulkOperations
  selectedCards={selectedCards}
  availableDecks={decks}
  onAddTags={handleAddTags}
  onRemoveTags={handleRemoveTags}
  onDelete={handleDelete}
  onMoveToDeck={handleMoveToDeck}
  onExport={handleExport}
  onUpdateJLPT={handleUpdateJLPT}
  onClearSelection={clearSelection}
/>
```

**UI Features**:
- Operation selector dropdown
- Context-specific forms
- Common tags display
- Selection count badge
- Destructive action warnings
- Cancel buttons for all operations

**Example: Adding Tags**:
```typescript
const handleAddTags = (cardIds: string[], tags: string[]) => {
  setVocabulary(prev =>
    prev.map(card =>
      cardIds.includes(card.id)
        ? { ...card, tags: [...new Set([...card.tags, ...tags])] }
        : card
    )
  )
}
```

---

### 6. Vocabulary Editor
**File**: `src/components/vocabulary-editor.tsx`

Full-featured card editor for creating and updating vocabulary.

**Editable Fields**:
- Kanji (optional)
- Kana reading (required)
- Meaning/translation (required)
- JLPT level
- Part of speech (multi-value)
- Tags (multi-value)
- Example sentences (array)
  - Japanese text
  - Hiragana reading
  - English translation

**Features**:
- Form validation
- Dynamic field addition (examples, tags, POS)
- Inline item removal
- Auto-generation of IDs
- Timestamp tracking
- Cancel confirmation

**Usage**:
```tsx
import { VocabularyEditor } from "@/components/vocabulary-editor"

// Create mode
<VocabularyEditor
  onSave={handleCreate}
  onCancel={handleCancel}
/>

// Edit mode
<VocabularyEditor
  card={existingCard}
  onSave={handleUpdate}
  onCancel={handleCancel}
/>
```

**Example Sentence Structure**:
```typescript
{
  japanese: "水を飲みます",
  hiragana: "みずをのみます",
  english: "I drink water",
  source: { type: "custom" }
}
```

---

### 7. Vocabulary Management Page
**File**: `src/app/manage/page.tsx`

Unified page integrating all Day 4 features.

**Page Sections**:

1. **Header**
   - Page title and description
   - Export all (JSON/CSV) buttons

2. **Statistics Cards**
   - Total cards count
   - Total decks count
   - Selected cards count
   - N5 cards count

3. **Bulk Operations Bar** (shown when cards selected)
   - All bulk operations
   - Selection management

4. **Editor Panel** (shown when creating/editing)
   - Full vocabulary editor
   - Cancel/save actions

5. **Main Tabs**
   - **Vocabulary Tab**:
     - Import buttons (CSV/JSON)
     - New card button
     - Search and filter component
     - Card list with selection

   - **Decks Tab**:
     - Import deck button
     - New deck button
     - Deck manager component

**Usage**:
Access the page at `/manage` route.

**Features**:
- Two-tab interface (Vocabulary / Decks)
- Integrated import/export
- Contextual UI (shows editor or bulk ops when needed)
- Real-time statistics
- Responsive layout

---

## UI Components Created

### Base Components
- `src/components/ui/input.tsx` - Text input with dark mode support
- `src/components/ui/select.tsx` - Dropdown select with consistent styling
- `src/components/ui/checkbox.tsx` - Checkbox with optional label

### Feature Components
- `src/components/vocabulary-search.tsx` - Search and filter UI
- `src/components/vocabulary-editor.tsx` - Card create/edit form
- `src/components/deck-manager.tsx` - Deck CRUD interface
- `src/components/bulk-operations.tsx` - Bulk action panel

---

## Integration with Existing System

### Database Integration
The management page uses mock data for demonstration. To integrate with the actual database:

```typescript
// In src/app/manage/page.tsx, replace mock state with:
import { useLiveVocabulary, useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"

const vocabulary = useLiveQuery(() => db.vocabulary.toArray())
const decks = useLiveQuery(() => db.decks.toArray())
```

### Service Layer Integration
Connect to existing database service:

```typescript
import { databaseService } from "@/services/database.service"

// Save card
await databaseService.addVocabularyCard(card)

// Update card
await databaseService.updateVocabularyCard(card.id, updates)

// Delete cards
await databaseService.deleteVocabularyCards(cardIds)
```

---

## Data Flow

### Import Flow
1. User clicks "Import CSV/JSON"
2. File picker opens
3. File content read via FileReader API
4. Parse content using import utilities
5. Validate data
6. Insert into database
7. Update UI with success/error message

### Export Flow
1. User selects cards or deck
2. Click "Export" button
3. Generate CSV/JSON content
4. Create Blob with content
5. Trigger browser download
6. Cleanup temporary URLs

### Bulk Operations Flow
1. User selects multiple cards via checkboxes
2. Bulk operations panel appears
3. User selects operation type
4. Fill operation-specific form
5. Confirm action
6. Update database in batch
7. Clear selection and refresh UI

---

## File Structure

```
src/
├── lib/
│   ├── jmdict-parser.ts       # JMdict data processing
│   └── import-export.ts       # CSV/JSON import/export
├── components/
│   ├── ui/
│   │   ├── input.tsx          # Input component
│   │   ├── select.tsx         # Select component
│   │   └── checkbox.tsx       # Checkbox component
│   ├── vocabulary-search.tsx  # Search and filter UI
│   ├── vocabulary-editor.tsx  # Card editor form
│   ├── deck-manager.tsx       # Deck management UI
│   └── bulk-operations.tsx    # Bulk action panel
└── app/
    └── manage/
        └── page.tsx           # Management page
```

---

## Testing

### Manual Testing Checklist

**JMdict Parser**:
- [ ] Parse JMdict JSON entry correctly
- [ ] Extract JLPT level from tags
- [ ] Handle entries without kanji
- [ ] Extract all meanings
- [ ] Calculate statistics accurately

**Import/Export**:
- [ ] Import CSV with header
- [ ] Import CSV without header
- [ ] Import JSON cards
- [ ] Import JSON deck
- [ ] Export to Anki CSV format
- [ ] Export to standard CSV
- [ ] Export to JSON
- [ ] Handle invalid CSV rows
- [ ] Show import errors

**Search and Filter**:
- [ ] Search by kanji
- [ ] Search by kana
- [ ] Search by meaning
- [ ] Filter by JLPT level
- [ ] Filter by part of speech
- [ ] Filter by tags
- [ ] Combine multiple filters
- [ ] Clear filters
- [ ] Select all cards
- [ ] Clear selection

**Deck Manager**:
- [ ] Create new deck
- [ ] Edit deck metadata
- [ ] Delete deck with confirmation
- [ ] Export deck to JSON
- [ ] Import deck from JSON
- [ ] Show card counts
- [ ] Display visibility status

**Bulk Operations**:
- [ ] Add tags to multiple cards
- [ ] Remove tags from cards
- [ ] Update JLPT level
- [ ] Move cards to deck
- [ ] Export selected cards
- [ ] Delete multiple cards
- [ ] Cancel operations

**Vocabulary Editor**:
- [ ] Create new card
- [ ] Edit existing card
- [ ] Validate required fields
- [ ] Add/remove examples
- [ ] Add/remove tags
- [ ] Add/remove part of speech
- [ ] Save changes
- [ ] Cancel editing

**Management Page**:
- [ ] Switch between tabs
- [ ] View statistics
- [ ] Import CSV
- [ ] Import JSON
- [ ] Export all cards
- [ ] Create card
- [ ] Edit card
- [ ] Delete card
- [ ] Bulk operations

---

## Performance Considerations

### Search Optimization
- Uses `useMemo` for expensive filtering operations
- Filters applied incrementally (AND logic)
- Early exit for non-matching filters

### Rendering Optimization
- Card list virtualization recommended for 1000+ cards
- Memoized filter options computation
- Debounced search input (can be added)

### Database Optimization
- Bulk operations use single transaction
- Batch updates instead of individual saves
- Indexes on searchable fields (kanji, kana, jlptLevel)

---

## Future Enhancements

### Phase 2 Features
1. **Advanced Search**:
   - Regex search
   - Wildcard support
   - Fuzzy matching

2. **Import Sources**:
   - Tatoeba sentence integration
   - Forvo audio integration
   - Image search integration

3. **Export Formats**:
   - Anki APKG (deck package)
   - Quizlet format
   - Memrise format

4. **Bulk Operations**:
   - Duplicate detection and merging
   - Auto-tag based on patterns
   - Batch audio generation

5. **Deck Features**:
   - Deck templates
   - Shared deck library
   - Deck cloning
   - Sub-decks

6. **Editor Enhancements**:
   - Rich text formatting
   - Image upload
   - Audio recording
   - Kanji stroke order

---

## API Reference

### JMdict Parser

```typescript
// Parse single entry
function parseJMdictEntry(entry: JMdictEntry): VocabularyCard

// Parse multiple entries
function parseJMdictEntries(entries: JMdictEntry[]): VocabularyCard[]

// Filter by JLPT level
function filterByJLPTLevel(cards: VocabularyCard[], level: JLPTLevel): VocabularyCard[]

// Load from URL
async function loadJMdictFromURL(url: string): Promise<VocabularyCard[]>

// Load from file (Node.js)
async function loadJMdictFromFile(filePath: string): Promise<VocabularyCard[]>

// Calculate statistics
function calculateVocabularyStats(cards: VocabularyCard[]): VocabularyStats
```

### Import/Export

```typescript
// Export to CSV
function exportToCSV(cards: VocabularyCard[], options?: ExportOptions): string

// Export cards to JSON
function exportCardsToJSON(cards: VocabularyCard[]): string

// Export deck to JSON
function exportDeckToJSON(deck: Deck): string

// Import from CSV
function importFromCSV(csvContent: string, options?: ImportOptions): ImportResult

// Import cards from JSON
function importCardsFromJSON(jsonContent: string): VocabularyCard[]

// Import deck from JSON
function importDeckFromJSON(jsonContent: string): Deck

// Browser utilities
function downloadFile(content: string, filename: string, mimeType?: string): void
async function readFile(file: File): Promise<string>

// Convenience exports
function exportVocabularyToCSVFile(cards: VocabularyCard[], filename?: string, options?: ExportOptions): void
function exportDeckToJSONFile(deck: Deck, filename?: string): void
```

---

## Troubleshooting

### Import Issues

**Problem**: CSV import fails with "Invalid row format"
**Solution**: Check CSV format matches expected structure. Ensure proper quoting of fields with commas.

**Problem**: JSON import shows "Invalid format" error
**Solution**: Validate JSON structure. Must be array of VocabularyCard objects or valid Deck object.

**Problem**: Imported cards missing data
**Solution**: Check field mapping. CSV import requires specific column order or header names.

### Export Issues

**Problem**: Downloaded file is empty
**Solution**: Ensure cards array is not empty. Check browser console for errors.

**Problem**: CSV file corrupted in Excel
**Solution**: Excel may have encoding issues. Use UTF-8 compatible editor or import wizard.

### Search/Filter Issues

**Problem**: Search not finding cards
**Solution**: Check that search terms match exact characters (case-insensitive). Try partial matches.

**Problem**: Filters not working
**Solution**: Filters use AND logic. Clear all filters and apply one at a time.

### Performance Issues

**Problem**: Slow search with many cards
**Solution**: Consider implementing search debouncing or virtual scrolling for large datasets.

**Problem**: Bulk operations timeout
**Solution**: Process in smaller batches (500 cards at a time).

---

## License Attribution

### JMdict
- **License**: CC BY-SA 4.0
- **Source**: EDRDG (Electronic Dictionary Research and Development Group)
- **URL**: https://www.edrdg.org/jmdict/j_jmdict.html

### Tatoeba Examples
- **License**: CC BY 2.0
- **Source**: Tatoeba Project
- **URL**: https://tatoeba.org

---

## Credits

Developed as part of LingoMemory Day 4 implementation.

**Technologies**:
- Next.js 14
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide Icons
