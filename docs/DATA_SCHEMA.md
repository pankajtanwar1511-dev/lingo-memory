# Data Schema Documentation - N5 Vocabulary Dataset

This document defines the canonical JSON schema for the N5 vocabulary dataset.

**Version:** 1.0.0
**Last Updated:** January 2025
**Status:** Production-ready

---

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Vocabulary Card Schema](#vocabulary-card-schema)
4. [Example Sentence Schema](#example-sentence-schema)
5. [Source Types](#source-types)
6. [License Metadata](#license-metadata)
7. [Audio Schema](#audio-schema)
8. [Validation Rules](#validation-rules)
9. [Examples](#examples)

---

## Overview

The N5 vocabulary dataset follows a strict JSON schema designed for:

- **Legal compliance**: Full license attribution per source
- **Quality assurance**: Required fields, validation rules
- **Production use**: Clean, consistent structure
- **Human review**: Support for AI-generated content flagging

**Key Principles:**

1. Every example includes license metadata
2. AI-generated content is clearly marked for review
3. Audio paths are relative (portable across environments)
4. Schema is backwards-compatible with existing systems

---

## File Structure

### Top-Level Structure

```json
{
  "version": "1.0.0",
  "metadata": {
    "source": "JLPT Vocabulary API + Tatoeba Project",
    "createdAt": "2025-01-15",
    "updatedAt": "2025-01-15",
    "author": "JapVocab Content Team",
    "license": "CC BY-SA 4.0 (vocab) + CC BY 2.0 FR (Tatoeba examples)",
    "description": "JLPT N5 vocabulary with example sentences",
    "totalCards": 662,
    "coverage": {
      "cardsWithExamples": 474,
      "totalExamples": 948
    }
  },
  "vocabulary": [
    // Array of vocabulary cards (see below)
  ]
}
```

### Required Top-Level Fields

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | Semantic version (MAJOR.MINOR.PATCH) |
| `metadata` | object | Dataset metadata |
| `vocabulary` | array | Array of vocabulary cards |

---

## Vocabulary Card Schema

### Full Schema Example

```json
{
  "id": "n5_vocab_0001",
  "kanji": "毎朝",
  "kana": "まいあさ",
  "romaji": "mai asa",
  "meaning": ["every morning"],
  "jlptLevel": "N5",
  "partOfSpeech": ["noun"],
  "tags": ["time", "daily life"],
  "examples": [
    // See Example Sentence Schema below
  ],
  "audio": {
    "pronunciationUrl": "/audio/n5/n5_vocab_0001.mp3",
    "source": "edge-tts"
  },
  "source": {
    "type": "jlpt-vocab-api",
    "url": "https://jlpt-vocab-api.vercel.app"
  },
  "license": {
    "text": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0/"
  }
}
```

### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ Yes | Unique identifier (format: `n5_vocab_XXXX`) |
| `kana` | string | ✅ Yes | Hiragana/katakana reading |
| `meaning` | array | ✅ Yes | Array of English meanings |
| `jlptLevel` | string | ✅ Yes | JLPT level (must be "N5") |
| `license` | object | ✅ Yes | License metadata |

### Optional Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `kanji` | string | No | Kanji form (if word has kanji) |
| `romaji` | string | No | Romanized reading |
| `partOfSpeech` | array | No | Part of speech tags |
| `tags` | array | No | Thematic tags (e.g., "food", "time") |
| `examples` | array | No | Example sentences (recommended) |
| `audio` | object | No | Audio pronunciation metadata |
| `source` | object | No | Source attribution |

### Field Constraints

**`id`**:
- Format: `n5_vocab_XXXX` where XXXX is 4-digit number
- Must be unique across dataset
- Sequential numbering recommended

**`kana`**:
- Hiragana or katakana only
- No spaces, punctuation, or special characters
- Example: "まいあさ", "コーヒー"

**`meaning`**:
- Must be non-empty array
- Each element is a string
- Order: most common meanings first
- Example: `["every morning", "each morning"]`

**`jlptLevel`**:
- Must be exactly "N5" for this dataset
- Case-sensitive

**`partOfSpeech`**:
- Common values: `["noun"]`, `["verb"]`, `["adjective"]`, `["adverb"]`, etc.
- Multiple tags allowed: `["noun", "adverb"]`

---

## Example Sentence Schema

### Full Schema Example

```json
{
  "japanese": "毎朝コーヒーを飲みます。",
  "kana": "まいあさ コーヒーを のみます。",
  "english": "I drink coffee every morning.",
  "audioUrl": "/audio/n5/examples/n5_vocab_0001_ex1.mp3",
  "needsReview": false,
  "source": {
    "type": "tatoeba",
    "id": 3496794
  },
  "license": {
    "text": "CC BY 2.0 FR",
    "url": "https://creativecommons.org/licenses/by/2.0/fr/"
  }
}
```

### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `japanese` | string | ✅ Yes | Japanese sentence (kanji/kana mixed) |
| `english` | string | ✅ Yes | English translation |
| `source` | object | ✅ Yes | Source metadata |
| `license` | object | ✅ Yes | License metadata |

### Optional Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `kana` | string | No | Full kana reading (with spaces) |
| `audioUrl` | string | No | Relative path to audio file |
| `needsReview` | boolean | No | Flag for human review (default: false) |

### Field Constraints

**`japanese`**:
- N5: ≤40 characters (recommended)
- Must contain target word (validated during import)
- Natural, grammatically correct Japanese

**`english`**:
- Clear, accurate translation
- Natural English phrasing
- Matches Japanese meaning

**`needsReview`**:
- Must be `true` for all AI-generated examples
- Optional for Tatoeba/manual examples
- Used to flag content for human review

**`audioUrl`**:
- Relative path starting with `/audio/`
- Format: `/audio/n5/examples/{card_id}_ex{N}.mp3`
- Example: `/audio/n5/examples/n5_vocab_0001_ex1.mp3`

---

## Source Types

Examples can come from multiple sources. Each source has specific requirements.

### Source Type: `tatoeba`

**Description**: Sentences from Tatoeba Project corpus

**Required Fields**:
```json
{
  "type": "tatoeba",
  "id": 3496794  // Tatoeba sentence ID (integer)
}
```

**License**: Must be CC BY 2.0 FR

**Use Case**: Auto-matched examples from Phase 2 enrichment

---

### Source Type: `generated`

**Description**: AI-generated sentences (Claude, GPT-4, etc.)

**Required Fields**:
```json
{
  "type": "generated",
  "model": "claude-3-5-sonnet-20241022",
  "provider": "anthropic",
  "date": "2025-01-15T12:34:56.789Z"
}
```

**License**: CC BY-SA 4.0 (inherited from vocabulary dataset)

**Use Case**: LLM fallback for words with no Tatoeba matches

**CRITICAL**: All generated examples **MUST** have `needsReview: true`

---

### Source Type: `custom`

**Description**: Manually created examples (not from corpus or LLM)

**Required Fields**:
```json
{
  "type": "custom",
  "author": "JapVocab Team",  // Optional
  "date": "2025-01-15"         // Optional
}
```

**License**: CC BY-SA 4.0 (same as vocabulary)

**Use Case**: Hand-crafted examples, editorial corrections

---

### Source Type: `jmdict`

**Description**: Example sentences from JMdict database

**Required Fields**:
```json
{
  "type": "jmdict",
  "id": 123456  // JMdict sequence number (optional)
}
```

**License**: CC BY-SA 4.0

**Use Case**: Dictionary-based examples (if available)

---

## License Metadata

### License Object Schema

```json
{
  "text": "CC BY 2.0 FR",
  "url": "https://creativecommons.org/licenses/by/2.0/fr/"
}
```

### Common Licenses

| License | Use Case | URL |
|---------|----------|-----|
| **CC BY-SA 4.0** | Vocabulary cards, generated examples | https://creativecommons.org/licenses/by-sa/4.0/ |
| **CC BY 2.0 FR** | Tatoeba examples | https://creativecommons.org/licenses/by/2.0/fr/ |

### License Rules

1. **Vocabulary cards**: Must use CC BY-SA 4.0 (ShareAlike requirement from JLPT Vocab API)
2. **Tatoeba examples**: Must preserve CC BY 2.0 FR license
3. **Generated examples**: Use CC BY-SA 4.0 (same as vocabulary)
4. **Custom examples**: Use CC BY-SA 4.0 (consistency)

**Important**: Tatoeba examples have different license than vocabulary cards. Each example carries its own license metadata.

---

## Audio Schema

### Pronunciation Audio (Card-Level)

```json
{
  "audio": {
    "pronunciationUrl": "/audio/n5/n5_vocab_0001.mp3",
    "source": "edge-tts"  // or "forvo", "custom", etc.
  }
}
```

### Example Audio (Example-Level)

```json
{
  "audioUrl": "/audio/n5/examples/n5_vocab_0001_ex1.mp3"
}
```

### Audio File Naming Conventions

**Pronunciation audio**:
- Format: `/audio/{level}/{card_id}.mp3`
- Example: `/audio/n5/n5_vocab_0001.mp3`

**Example audio**:
- Format: `/audio/{level}/examples/{card_id}_ex{N}.mp3`
- Example: `/audio/n5/examples/n5_vocab_0001_ex1.mp3`

**Notes**:
- All paths are relative (portable)
- Audio files stored in `public/audio/` directory
- Supports multiple formats (mp3, ogg, wav)

---

## Validation Rules

### Card-Level Validation

✅ **Must Pass**:
- `id` is unique and follows format `n5_vocab_XXXX`
- `kana` is non-empty
- `meaning` is non-empty array
- `jlptLevel` is exactly "N5"
- `license` object is present

⚠️ **Warnings**:
- Card has no examples (< 2 examples)
- No audio URL provided
- No part of speech tags

### Example-Level Validation

✅ **Must Pass**:
- `japanese` and `english` are non-empty
- `source` object with valid `type` field
- `license` object is present
- Target word appears in Japanese sentence
- If `source.type` is "generated", then `needsReview` must be `true`

⚠️ **Warnings**:
- Sentence length > 40 characters (too long for N5)
- No kana reading provided
- No audio URL provided

### Dataset-Level Validation

✅ **Must Pass**:
- All card IDs are unique
- All examples have license metadata
- Version field is present

---

## Examples

### Minimal Card (No Examples)

```json
{
  "id": "n5_vocab_0100",
  "kana": "ねこ",
  "meaning": ["cat"],
  "jlptLevel": "N5",
  "license": {
    "text": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0/"
  }
}
```

### Full Card with Tatoeba Examples

```json
{
  "id": "n5_vocab_0042",
  "kanji": "毎朝",
  "kana": "まいあさ",
  "romaji": "mai asa",
  "meaning": ["every morning"],
  "jlptLevel": "N5",
  "partOfSpeech": ["noun"],
  "tags": ["time", "daily life"],
  "examples": [
    {
      "japanese": "毎朝コーヒーを飲みます。",
      "kana": "まいあさ コーヒーを のみます。",
      "english": "I drink coffee every morning.",
      "audioUrl": "/audio/n5/examples/n5_vocab_0042_ex1.mp3",
      "source": {
        "type": "tatoeba",
        "id": 3496794
      },
      "license": {
        "text": "CC BY 2.0 FR",
        "url": "https://creativecommons.org/licenses/by/2.0/fr/"
      }
    },
    {
      "japanese": "毎朝、散歩します。",
      "kana": "まいあさ、さんぽします。",
      "english": "I take a walk every morning.",
      "audioUrl": "/audio/n5/examples/n5_vocab_0042_ex2.mp3",
      "source": {
        "type": "tatoeba",
        "id": 8721459
      },
      "license": {
        "text": "CC BY 2.0 FR",
        "url": "https://creativecommons.org/licenses/by/2.0/fr/"
      }
    }
  ],
  "audio": {
    "pronunciationUrl": "/audio/n5/n5_vocab_0042.mp3",
    "source": "edge-tts"
  },
  "source": {
    "type": "jlpt-vocab-api",
    "url": "https://jlpt-vocab-api.vercel.app"
  },
  "license": {
    "text": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0/"
  }
}
```

### Card with AI-Generated Example (Needs Review)

```json
{
  "id": "n5_vocab_0500",
  "kanji": "暑い",
  "kana": "あつい",
  "meaning": ["hot (weather)"],
  "jlptLevel": "N5",
  "partOfSpeech": ["adjective"],
  "examples": [
    {
      "japanese": "今日は暑いです。",
      "kana": "きょうは あついです。",
      "english": "It's hot today.",
      "needsReview": true,
      "source": {
        "type": "generated",
        "model": "claude-3-5-sonnet-20241022",
        "provider": "anthropic",
        "date": "2025-01-15T10:30:00.000Z"
      },
      "license": {
        "text": "CC BY-SA 4.0",
        "url": "https://creativecommons.org/licenses/by-sa/4.0/"
      }
    }
  ],
  "license": {
    "text": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0/"
  }
}
```

---

## Schema Evolution

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-15 | Initial schema definition |

### Future Considerations

**Potential additions (not yet implemented)**:
- `difficulty` field (beginner/intermediate/advanced within N5)
- `frequency` rank (most common words first)
- `conjugations` for verbs/adjectives
- `mnemonics` for memory aids
- `relatedWords` for vocabulary connections

---

## Tooling

### Validation

Use `phase4_validate_n5.py` to validate datasets against this schema:

```bash
python3 scripts/phase4_validate_n5.py \
  --input data/n5-v1.0.json \
  --output-dir reports/validation
```

### Schema Checking (TypeScript)

Use `src/schemas/vocabulary.schema.ts` for runtime validation in the app.

---

## References

- **JLPT Vocab API**: https://jlpt-vocab-api.vercel.app/
- **Tatoeba Project**: https://tatoeba.org/
- **Tatoeba License**: https://creativecommons.org/licenses/by/2.0/fr/
- **Dataset License**: https://creativecommons.org/licenses/by-sa/4.0/
- **Full Attribution**: See `CREDITS.md`

---

**Last Updated:** January 2025
**Maintainer:** JapVocab Content Team
**License:** This documentation is CC BY-SA 4.0
