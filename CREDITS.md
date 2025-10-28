# Credits & Attribution

This project uses content and resources from multiple open-source and freely available sources. We gratefully acknowledge the following projects and contributors.

---

## 📚 Vocabulary Data

### JLPT Vocab API
- **Source:** https://jlpt-vocab-api.vercel.app/
- **Content Used:** JLPT N5 and N4 vocabulary words (kanji, kana, meanings, part of speech)
- **License:** CC BY-SA 4.0 (Creative Commons Attribution-ShareAlike 4.0 International)
- **License URL:** https://creativecommons.org/licenses/by-sa/4.0/
- **Attribution:** JLPT Vocabulary data sourced from JLPT Vocab API
- **Modifications:** Converted API format to internal schema, added examples and audio

**Cards Sourced:**
- N5: 662 vocabulary cards
- N4: 632 vocabulary cards

---

## 📝 Example Sentences

### Tatoeba Project
- **Source:** https://tatoeba.org/
- **Content Used:** Japanese-English sentence pairs for vocabulary examples
- **License:** CC BY 2.0 FR (Creative Commons Attribution 2.0 France)
- **License URL:** https://creativecommons.org/licenses/by/2.0/fr/
- **Corpus Version:** Downloaded October 2024
- **Corpus Files:**
  - `jpn_sentences.tsv` - 16 MB (Japanese sentences)
  - `eng_sentences.tsv` - 102 MB (English translations)
  - `jpn-eng_links.tsv` - 413 MB (Translation links)

**Attribution:** Example sentences from Tatoeba (https://tatoeba.org), licensed under CC BY 2.0 FR. Each example includes Tatoeba sentence ID for traceability.

**Example Coverage:**
- N5: 1,368 examples from Tatoeba (474 cards)
- N4: 2,032 examples from Tatoeba (449 cards)
- Total: 3,400 Tatoeba-sourced examples

**Tatoeba Contributors:** Examples were created by the Tatoeba community. Individual sentence contributors can be found on Tatoeba.org by searching the sentence ID.

---

## 🎙️ Audio Generation

### Current Implementation (Development Only)

#### Microsoft Edge TTS (via edge-tts Python library)
- **Library:** https://github.com/rany2/edge-tts
- **Library License:** GNU GPL v3.0 (wrapper code only)
- **Microsoft Service:** Unofficial API access
- **Voice Used:** ja-JP-NanamiNeural (Female Japanese voice)
- **Status:** ⚠️ **DEVELOPMENT ONLY** - Not licensed for commercial redistribution
- **Generated Files:** 4,694 audio files (N5 + N4 vocabulary and examples)

**Important Notice:** Audio files generated with Edge TTS are currently marked as "development-only" and should not be used in production without proper licensing. See `docs/TTS-ALTERNATIVES.md` for legal alternatives.

### Recommended Production Alternatives

See `docs/TTS-ALTERNATIVES.md` for detailed comparison of:
- **VOICEVOX** (Free, requires attribution per character voice)
- **OpenJTalk** (Free, Modified BSD License)
- **Azure Cognitive Services TTS** (Paid, ~$0.30 for full dataset)

---

## 🖼️ Icons & UI Components

### Lucide Icons
- **Source:** https://lucide.dev/
- **License:** ISC License
- **Usage:** UI icons throughout the application

### shadcn/ui Components
- **Source:** https://ui.shadcn.com/
- **License:** MIT License
- **Usage:** Base UI components (buttons, cards, dialogs, etc.)

---

## 🛠️ Development Tools & Libraries

### Next.js
- **License:** MIT License
- **URL:** https://nextjs.org/

### React
- **License:** MIT License
- **URL:** https://reactjs.org/

### Dexie.js (IndexedDB wrapper)
- **License:** Apache License 2.0
- **URL:** https://dexie.org/

### Tailwind CSS
- **License:** MIT License
- **URL:** https://tailwindcss.com/

### Python Libraries
- **fugashi** (Japanese morphological analyzer) - MIT License
- **pykakasi** (Kana/Kanji conversion) - GPLv3+
- **edge-tts** (TTS wrapper) - GPLv3

---

## 📖 Dictionaries & Linguistic Resources

### JMdict (Japanese-Multilingual Dictionary)
- **Source:** http://www.edrdg.org/jmdict/j_jmdict.html
- **License:** CC BY-SA 3.0
- **Used For:** Word meanings and translations (via JLPT Vocab API)
- **Maintained By:** Electronic Dictionary Research and Development Group (EDRDG)

---

## 🤖 Generated Content

### AI-Generated Examples
Some example sentences are generated using large language models (Claude or GPT-4) for vocabulary words that lack examples in Tatoeba corpus.

**All AI-generated examples are clearly marked with:**
```json
{
  "source": {
    "type": "generated",
    "model": "claude-3-5-sonnet-20241022",
    "provider": "anthropic",
    "date": "2025-01-XX"
  },
  "needsReview": true
}
```

**Generation Tool:** `scripts/generate-missing-examples.py`
**Status:** All generated examples require human review before production use

---

## 📄 License Summary by Component

| Component | License | Commercial Use | Attribution Required |
|-----------|---------|----------------|---------------------|
| Vocabulary data | CC BY-SA 4.0 | ✅ Yes | ✅ Yes |
| Tatoeba examples | CC BY 2.0 FR | ✅ Yes | ✅ Yes |
| Audio (Edge TTS) | ⚠️ Unofficial | ❌ No | N/A |
| Audio (VOICEVOX alternative) | Free | ✅ Yes | ✅ Yes (per voice) |
| Audio (OpenJTalk alternative) | Modified BSD | ✅ Yes | ❌ No |
| UI Components (shadcn) | MIT | ✅ Yes | ❌ No |
| Icons (Lucide) | ISC | ✅ Yes | ❌ No |

---

## 🙏 Acknowledgments

We thank the following projects and communities for making open Japanese language learning resources available:

1. **Tatoeba Community** - Thousands of volunteers creating high-quality bilingual sentence pairs
2. **EDRDG** - Jim Breen and contributors for decades of Japanese dictionary work
3. **JLPT Vocab API maintainers** - For providing accessible JLPT vocabulary data
4. **Open Source TTS projects** - VOICEVOX, OpenJTalk, and Coeiroink developers
5. **React/Next.js communities** - For excellent web development tools

---

## 📋 Full Attribution Text

For redistribution or derivative works, please include:

```
This application uses vocabulary data from the JLPT Vocab API (CC BY-SA 4.0),
example sentences from the Tatoeba Project (CC BY 2.0 FR), and is built with
open-source tools. See CREDITS.md for full attribution.

Vocabulary: JLPT Vocab API (https://jlpt-vocab-api.vercel.app/)
Examples: Tatoeba Project (https://tatoeba.org/)
Dictionaries: JMdict by EDRDG (http://www.edrdg.org/)
```

---

## 📞 Contact & Corrections

If you notice any attribution errors or missing credits, please open an issue at:
https://github.com/[your-repo]/japvocab/issues

---

**Last Updated:** January 2025
**Dataset Version:** 1.0.0
**Total Vocabulary Cards:** 1,344 (N5: 662, N4: 632, Essentials: 50)
**Total Examples:** 3,400+ (Tatoeba) + Generated examples (marked for review)
**Total Audio Files:** 4,694 (pending production TTS migration)
