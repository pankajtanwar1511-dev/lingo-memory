# Dataset Versioning & Cache Invalidation

This document describes the dataset versioning strategy and cache invalidation mechanisms for vocabulary seed data.

---

## 🎯 Purpose

**Problem:** PWA service workers aggressively cache JSON seed files, causing old data to persist even after updates.

**Solution:** Versioned datasets with automatic cache invalidation when versions change.

---

## 📋 Version Format

### Semantic Versioning (SemVer)

Format: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)

**Version Bumps:**

| Change Type | Version Bump | Example | Use Case |
|-------------|--------------|---------|-----------|
| **Breaking changes** | MAJOR | 1.0.0 → 2.0.0 | Schema changes, field removals, incompatible structure |
| **New content** | MINOR | 1.0.0 → 1.1.0 | Added cards, new examples, new features |
| **Fixes/corrections** | PATCH | 1.0.0 → 1.0.1 | Typo fixes, example corrections, small improvements |

---

## 📦 Dataset Structure with Versioning

```json
{
  "version": "1.0.0",
  "metadata": {
    "source": "JLPT Vocabulary API + Tatoeba Project",
    "createdAt": "2025-01-15",
    "updatedAt": "2025-01-20",
    "author": "LingoMemory Content Team",
    "license": "CC BY-SA 4.0 + CC BY 2.0 FR",
    "description": "N5 vocabulary - comprehensive with examples",
    "datasetHash": "sha256:abc123...",
    "coverage": {
      "total": 662,
      "withExamples": 474,
      "totalExamples": 1368
    }
  },
  "vocabulary": [
    // ... cards
  ]
}
```

---

## 🔄 Cache Invalidation Strategy

### 1. Version-Based Cache Keys

Store version in localStorage:
```typescript
const SEED_VERSION_KEY = 'vocab_seed_version'
const SEED_LOADED_KEY = 'vocab_seed_loaded_v1'
```

### 2. Version Check on App Load

```typescript
// src/services/seed-loader.service.ts

async loadAll(force: boolean = false): Promise<SeedResult> {
  // Load current version from localStorage
  const storedVersion = localStorage.getItem(SEED_VERSION_KEY)

  // Fetch latest seed file to get version
  const response = await fetch('/seed-data/n5-comprehensive.json')
  const data = await response.json()
  const latestVersion = data.version

  // Check if version changed
  if (storedVersion !== latestVersion) {
    console.log(`Version changed: ${storedVersion} → ${latestVersion}`)

    // Clear caches
    await this.clearAllCaches()

    // Update stored version
    localStorage.setItem(SEED_VERSION_KEY, latestVersion)

    // Force reload
    force = true
  }

  // Continue with normal load...
}
```

### 3. Clear All Caches Method

```typescript
private async clearAllCaches(): Promise<void> {
  // Clear service worker caches
  if ('caches' in window) {
    const cacheNames = await caches.keys()
    await Promise.all(
      cacheNames.map(name => caches.delete(name))
    )
  }

  // Clear IndexedDB
  await db.vocabulary.clear()

  // Clear localStorage flags
  localStorage.removeItem(SEED_LOADED_KEY)

  console.log('✅ All caches cleared')
}
```

---

## 🚀 Implementation Steps

### Step 1: Add Version to All Seed Files

Update each JSON file:
```bash
jq '.version = "1.0.0" | .metadata.updatedAt = "2025-01-20"' \
  public/seed-data/n5-comprehensive.json > /tmp/versioned.json
mv /tmp/versioned.json public/seed-data/n5-comprehensive.json
```

### Step 2: Update Seed Loader Service

Add version checking logic to `src/services/seed-loader.service.ts`:

```typescript
export class SeedLoaderService {
  private hasLoadedKey = 'vocab_seed_loaded_v1'
  private versionKey = 'vocab_seed_version'

  async checkVersion(seedFilePath: string): Promise<boolean> {
    // Fetch seed file
    const response = await fetch(seedFilePath)
    const data = await response.json()
    const latestVersion = data.version

    // Get stored version
    const storedVersion = localStorage.getItem(this.versionKey)

    // Version changed?
    if (storedVersion && storedVersion !== latestVersion) {
      console.log(`📦 Dataset version changed: ${storedVersion} → ${latestVersion}`)
      return true // Needs refresh
    }

    return false // No change
  }

  async loadAll(force: boolean = false): Promise<SeedResult> {
    // Check for version changes
    for (const seedFile of SEED_FILES) {
      const versionChanged = await this.checkVersion(seedFile.path)
      if (versionChanged) {
        console.log(`🔄 Version changed for ${seedFile.name}, clearing caches...`)
        await this.clearAllCaches()
        force = true
        break
      }
    }

    // ... rest of load logic
  }

  async clearAllCaches(): Promise<void> {
    // Clear service worker caches
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
    }

    // Clear IndexedDB
    await db.vocabulary.clear()

    // Clear localStorage
    localStorage.removeItem(this.hasLoadedKey)

    console.log('✅ Caches cleared')
  }

  private async saveVersion(version: string): void {
    localStorage.setItem(this.versionKey, version)
  }
}
```

### Step 3: Add Version Display in UI

Show current dataset version:

```typescript
// src/app/settings/page.tsx

const DatasetVersion = () => {
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    const storedVersion = localStorage.getItem('vocab_seed_version')
    setVersion(storedVersion)
  }, [])

  return (
    <div className="text-sm text-gray-600">
      Dataset Version: {version || 'Unknown'}
    </div>
  )
}
```

---

## 📝 Version Changelog

Maintain `CHANGELOG.md` for version history:

```markdown
# Dataset Changelog

## [1.1.0] - 2025-01-20

### Added
- 376 AI-generated examples for N5 words missing examples
- 366 AI-generated examples for N4 words missing examples
- Coverage increased from 71% to 95%

### Changed
- Updated schema to support `needsReview` flag
- Added `generated` source type for AI examples

## [1.0.1] - 2025-01-15

### Fixed
- Fixed 15 incorrect kanji readings
- Corrected 8 English translation errors
- Removed 3 duplicate examples

## [1.0.0] - 2025-01-10

### Initial Release
- 662 N5 vocabulary cards
- 632 N4 vocabulary cards
- 3,400 Tatoeba-sourced examples
- 4,694 audio files
```

---

## 🔢 Hash-Based Verification (Optional)

For extra security, add content hashing:

```typescript
import crypto from 'crypto'

function generateDatasetHash(vocabulary: VocabularyCard[]): string {
  const json = JSON.stringify(vocabulary)
  return crypto.createHash('sha256').update(json).digest('hex')
}

// Add to metadata:
{
  "metadata": {
    "datasetHash": "sha256:abc123def456..."
  }
}
```

Verify on load:
```typescript
const expectedHash = data.metadata.datasetHash
const actualHash = generateDatasetHash(data.vocabulary)

if (expectedHash !== actualHash) {
  console.error('⚠️ Dataset integrity check failed!')
}
```

---

## 🛠️ CLI Tools

### Bump Version Script

Create `scripts/bump-version.sh`:

```bash
#!/bin/bash
# Bump dataset version

LEVEL=$1  # major, minor, patch
FILE=$2

if [ -z "$LEVEL" ] || [ -z "$FILE" ]; then
  echo "Usage: ./bump-version.sh [major|minor|patch] [file]"
  exit 1
fi

CURRENT=$(jq -r '.version' "$FILE")
echo "Current version: $CURRENT"

# Parse version
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

# Bump version
case $LEVEL in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch)
    PATCH=$((PATCH + 1))
    ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo "New version: $NEW_VERSION"

# Update file
jq ".version = \"$NEW_VERSION\" | .metadata.updatedAt = \"$(date +%Y-%m-%d)\"" \
  "$FILE" > /tmp/versioned.json
mv /tmp/versioned.json "$FILE"

echo "✅ Version updated to $NEW_VERSION"
```

Usage:
```bash
chmod +x scripts/bump-version.sh

# Bump patch version
./scripts/bump-version.sh patch public/seed-data/n5-comprehensive.json

# Bump minor version (new content)
./scripts/bump-version.sh minor public/seed-data/n5-comprehensive.json

# Bump major version (breaking change)
./scripts/bump-version.sh major public/seed-data/n5-comprehensive.json
```

---

## 🧪 Testing Version Changes

### Manual Test

1. Load app, note current version
2. Update version in JSON file
3. Reload app
4. Check console for "Version changed" message
5. Verify caches cleared
6. Verify new data loaded

### Automated Test

```typescript
// tests/version-check.test.ts

describe('Version Check', () => {
  it('should detect version change', async () => {
    // Mock localStorage
    localStorage.setItem('vocab_seed_version', '1.0.0')

    // Mock fetch with new version
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ version: '1.1.0' })
    })

    const seedLoader = new SeedLoaderService()
    const versionChanged = await seedLoader.checkVersion('/seed-data/n5-comprehensive.json')

    expect(versionChanged).toBe(true)
  })

  it('should not trigger on same version', async () => {
    localStorage.setItem('vocab_seed_version', '1.0.0')

    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ version: '1.0.0' })
    })

    const seedLoader = new SeedLoaderService()
    const versionChanged = await seedLoader.checkVersion('/seed-data/n5-comprehensive.json')

    expect(versionChanged).toBe(false)
  })
})
```

---

## 📊 Monitoring & Analytics

Track version adoption:

```typescript
// Log version on app load
console.log('📦 Dataset version:', data.version)

// Send to analytics (optional)
analytics.track('dataset_loaded', {
  version: data.version,
  cards_loaded: data.vocabulary.length
})
```

---

## ✅ Checklist: Enabling Versioning

- [ ] Add `version` field to all seed JSON files
- [ ] Add `updatedAt` to metadata
- [ ] Update `seed-loader.service.ts` with version checking
- [ ] Create `bump-version.sh` script
- [ ] Add version display to settings page
- [ ] Create CHANGELOG.md
- [ ] Test version change detection
- [ ] Document version policy in README

---

**Last Updated:** January 2025
**Current Implementation:** Basic versioning (version field in JSON)
**Next Steps:** Implement automatic cache invalidation on version change
