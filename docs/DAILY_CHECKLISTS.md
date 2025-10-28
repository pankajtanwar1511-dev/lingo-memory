# Phase 1: Daily Task Checklists

**Complete breakdown of Days 1-20 (Weeks 1-4)**

---

## Week 1: Automated Content Pipeline

### ✅ Day 1 (Day 11): JMdict Batch Importer - COMPLETE

**Goal:** Build automated system to import 100+ cards/hour

- [x] Task 1.1: Extend JMdict parser for batch processing
- [x] Task 1.2: Create BatchImportService class
- [x] Task 1.3: Add JLPT filtering logic
- [x] Task 1.4: Add frequency-based sorting
- [x] Task 1.5: Add deduplication system
- [x] Task 1.6: Add Zod validation integration
- [x] Task 1.7: Build statistics calculator
- [x] Task 1.8: Create CLI tool with colored output
- [x] Task 1.9: Add dry-run mode
- [x] Task 1.10: Create TypeScript config for scripts
- [x] Task 1.11: Add npm script
- [x] Task 1.12: Write comprehensive documentation
- [x] Task 1.13: Test with sample JMdict data
- [x] Task 1.14: Create quick start guide

**Deliverables:**
- ✅ `src/services/batch-import.service.ts`
- ✅ `scripts/import-jmdict.ts`
- ✅ `docs/DAY11_JMDICT_BATCH_IMPORT.md`
- ✅ Sample data and configs

**Time:** 8 hours

---

### 🔄 Day 2 (Day 12): Tatoeba Sentence Matching - IN PROGRESS

**Goal:** Automatically find 2-3 quality example sentences per card

#### Morning Session (3-4 hours)

- [ ] **Task 2.1: Download Tatoeba Corpus** (30 min)
  - [ ] Download Japanese sentences (sentences.tar.bz2)
  - [ ] Download Japanese-English links (jpn-eng.tar.bz2)
  - [ ] Extract and parse TSV files
  - [ ] Create JSON index for fast lookup

- [ ] **Task 2.2: Build Sentence Parser** (1 hour)
  - [ ] Create Tatoeba data interfaces (TypeScript types)
  - [ ] Build TSV parser for sentences
  - [ ] Build TSV parser for translations
  - [ ] Create sentence-translation mapper
  - [ ] Build in-memory index (sentence ID → data)

- [ ] **Task 2.3: Implement Matching Algorithm** (1.5 hours)
  - [ ] Exact match: Find sentences containing exact word
  - [ ] Kana match: Match by kana reading
  - [ ] Kanji match: Match by kanji
  - [ ] Ranking system: Score sentences by quality
  - [ ] Return top 3 best matches

#### Afternoon Session (3-4 hours)

- [ ] **Task 2.4: Build Quality Filter** (1.5 hours)
  - [ ] Length filter (5-25 characters ideal)
  - [ ] Complexity filter (appropriate for JLPT level)
  - [ ] Grammar pattern detection (avoid advanced patterns for N5)
  - [ ] Translation quality check (ensure good translation exists)
  - [ ] Diversity filter (avoid duplicate patterns)

- [ ] **Task 2.5: Create Sentence Enrichment Service** (1 hour)
  - [ ] `SentenceMatcherService` class
  - [ ] `enrichCardWithSentences(card)` method
  - [ ] `enrichCardsInBatch(cards)` method
  - [ ] Progress tracking
  - [ ] Error handling

- [ ] **Task 2.6: Build CLI Tool** (1 hour)
  - [ ] `scripts/enrich-sentences.ts`
  - [ ] Input: JSON file with vocabulary cards
  - [ ] Output: Enriched cards with examples
  - [ ] Progress bar for batch processing
  - [ ] Statistics (matched/unmatched/errors)

#### Evening Session (1-2 hours)

- [ ] **Task 2.7: Testing & Documentation** (1.5 hours)
  - [ ] Test with 10 sample N5 cards
  - [ ] Test with full N5 dataset
  - [ ] Verify example quality
  - [ ] Write documentation (DAY12_TATOEBA_MATCHING.md)
  - [ ] Create usage examples

**Deliverables:**
- [ ] `src/services/sentence-matcher.service.ts`
- [ ] `scripts/enrich-sentences.ts`
- [ ] `data/tatoeba/` (Tatoeba corpus files)
- [ ] `docs/DAY12_TATOEBA_MATCHING.md`
- [ ] Enriched N5 cards with examples

**Expected Output:** 800 N5 cards → 800 cards with 2-3 examples each

**Time:** 6-8 hours

---

### ⏳ Day 3 (Day 13): Batch Audio Generation

**Goal:** Generate audio files for all N5 cards

#### Morning Session (2-3 hours)

- [ ] **Task 3.1: Set Up Google Cloud TTS** (1 hour)
  - [ ] Create Google Cloud account
  - [ ] Enable Text-to-Speech API
  - [ ] Create service account
  - [ ] Download credentials JSON
  - [ ] Set environment variable (GOOGLE_APPLICATION_CREDENTIALS)
  - [ ] Test API with sample request

- [ ] **Task 3.2: Build Audio Generator Service** (1.5 hours)
  - [ ] Install @google-cloud/text-to-speech
  - [ ] Create `AudioGeneratorService` class
  - [ ] Implement `generateAudio(text, outputPath)` method
  - [ ] Configure voice settings (ja-JP-Standard-A)
  - [ ] Add audio format settings (MP3, 128kbps)
  - [ ] Add error handling and retry logic

#### Afternoon Session (3-4 hours)

- [ ] **Task 3.3: Create Batch Processor** (2 hours)
  - [ ] `scripts/generate-audio.ts` CLI tool
  - [ ] Rate limiting (avoid API quota limits)
  - [ ] Progress tracking with ETA
  - [ ] Concurrent requests (5 at a time)
  - [ ] Resume capability (skip existing files)
  - [ ] Statistics tracking (generated/skipped/errors)

- [ ] **Task 3.4: Generate Audio for N5 Cards** (1.5 hours)
  - [ ] Run batch generator on N5 dataset
  - [ ] Generate main word audio
  - [ ] Generate example sentence audio (optional)
  - [ ] Verify audio file quality
  - [ ] Save to local directory (public/audio/n5/)

#### Evening Session (2-3 hours)

- [ ] **Task 3.5: Set Up CDN (Cloudflare R2)** (1 hour)
  - [ ] Create Cloudflare account
  - [ ] Create R2 bucket
  - [ ] Configure public access
  - [ ] Get bucket URL
  - [ ] Install AWS SDK (R2 is S3-compatible)

- [ ] **Task 3.6: Upload & Update Cards** (1.5 hours)
  - [ ] Create upload script
  - [ ] Upload all audio files to R2
  - [ ] Update card audioUrls
  - [ ] Test audio playback from CDN
  - [ ] Write documentation

**Deliverables:**
- [ ] `src/services/audio-generator.service.ts`
- [ ] `scripts/generate-audio.ts`
- [ ] `scripts/upload-audio.ts`
- [ ] `public/audio/n5/` (800+ audio files)
- [ ] `docs/DAY13_AUDIO_GENERATION.md`
- [ ] N5 cards with audio URLs

**Cost:** ~$0 (within Google Cloud free tier)

**Time:** 6-8 hours

---

### ⏳ Day 4 (Day 14): Quality Validation Pipeline

**Goal:** Ensure all generated content meets quality standards

#### Morning Session (2-3 hours)

- [ ] **Task 4.1: Build Quality Scoring System** (1.5 hours)
  - [ ] Define quality metrics:
    - Has kanji/kana: +10 points
    - Has 2+ examples: +20 points
    - Has audio URL: +20 points
    - Example length appropriate: +10 points
    - Has JLPT level: +10 points
    - Has part of speech: +10 points
    - Has proper licensing: +10 points
  - [ ] Calculate quality score (0-100)
  - [ ] Set thresholds (>90 = excellent, 70-90 = good, <70 = needs review)

- [ ] **Task 4.2: Create Quality Validator** (1 hour)
  - [ ] `QualityValidatorService` class
  - [ ] Check for required fields
  - [ ] Verify example sentences quality
  - [ ] Verify audio URLs accessible
  - [ ] Check for common issues
  - [ ] Generate validation report

#### Afternoon Session (3-4 hours)

- [ ] **Task 4.3: Build Review Interface** (2 hours)
  - [ ] `scripts/review-cards.ts` CLI tool
  - [ ] Show flagged cards one by one
  - [ ] Display issues found
  - [ ] Allow editing (fix/skip/delete)
  - [ ] Save changes to JSON
  - [ ] Track review progress

- [ ] **Task 4.4: Run Validation** (1 hour)
  - [ ] Run validator on all N5 cards
  - [ ] Generate quality report
  - [ ] Identify cards needing review
  - [ ] Create priority list (critical → minor)

#### Evening Session (1-2 hours)

- [ ] **Task 4.5: Fix Issues & Approve** (1.5 hours)
  - [ ] Review flagged cards (top 20-30)
  - [ ] Fix critical issues
  - [ ] Approve cards for production
  - [ ] Export final dataset
  - [ ] Write documentation

**Deliverables:**
- [ ] `src/services/quality-validator.service.ts`
- [ ] `scripts/review-cards.ts`
- [ ] `scripts/validate-quality.ts`
- [ ] `docs/DAY14_QUALITY_VALIDATION.md`
- [ ] Quality report
- [ ] Production-ready N5 dataset

**Time:** 6-8 hours

---

## Week 2: Content Generation Sprint

### ⏳ Day 5 (Day 15): Generate 150 N5 Cards

**Goal:** Add 150 more N5 cards (running total: 150)

**Morning (2-3 hours):**
- [ ] Run batch import for 150 N5 words
- [ ] Run sentence matcher
- [ ] Review quality report

**Afternoon (2-3 hours):**
- [ ] Generate audio for new cards
- [ ] Upload to CDN
- [ ] Run quality validation

**Evening (1-2 hours):**
- [ ] Manual review of flagged cards
- [ ] Fix issues
- [ ] Update seed data files

**Deliverables:** 150 production-ready N5 cards

**Time:** 5-7 hours

---

### ⏳ Day 6 (Day 16): Generate 150 N5 Cards

**Goal:** Add 150 more N5 cards (running total: 300)

**Tasks:** Same as Day 5

**Deliverables:** 300 total N5 cards

**Time:** 5-7 hours

---

### ⏳ Day 7 (Day 17): Generate 150 N5 Cards

**Goal:** Add 150 more N5 cards (running total: 450)

**Tasks:** Same as Day 5

**Deliverables:** 450 total N5 cards

**Time:** 5-7 hours

---

### ⏳ Day 8 (Day 18): Audio Quality Upgrade

**Goal:** Improve audio for top 200 most common words

**Morning (3 hours):**
- [ ] Set up Azure TTS account
- [ ] Configure premium voice (ja-JP-NanamiNeural)
- [ ] Generate high-quality audio for top 200

**Afternoon (3 hours):**
- [ ] Generate slow-speed versions
- [ ] Normalize audio levels
- [ ] Compress for web delivery
- [ ] Upload to CDN

**Evening (2 hours):**
- [ ] Update card audio URLs
- [ ] Test playback quality
- [ ] Write documentation

**Deliverables:**
- Premium audio for 200 core words
- Dual-speed audio (slow/normal)

**Cost:** ~$8 for Azure TTS

**Time:** 6-8 hours

---

### ⏳ Day 9 (Day 19): Category & Tag Refinement

**Goal:** Improve organization and discoverability

**Morning (3 hours):**
- [ ] Review all 450 cards
- [ ] Assign categories (verbs, nouns, adjectives, etc.)
- [ ] Balance category sizes
- [ ] Add subcategories

**Afternoon (3 hours):**
- [ ] Add usage frequency tags
- [ ] Add grammar tags
- [ ] Add context tags (formal/casual/etc.)
- [ ] Add difficulty tags

**Evening (2 hours):**
- [ ] Create curated starter decks
- [ ] Update vocabulary browser
- [ ] Test filtering and search

**Deliverables:**
- All cards categorized and tagged
- 4-5 curated starter decks

**Time:** 6-8 hours

---

### ⏳ Day 10 (Day 20): Community Review

**Goal:** External validation of content quality

**Morning (2 hours):**
- [ ] Recruit 5-10 reviewers
- [ ] Create review interface
- [ ] Deploy to staging environment

**Afternoon (3 hours):**
- [ ] Collect feedback
- [ ] Categorize issues
- [ ] Prioritize fixes

**Evening (2 hours):**
- [ ] Fix critical issues
- [ ] Update documentation
- [ ] Thank reviewers

**Deliverables:**
- Feedback from 5-10 reviewers
- Critical issues fixed
- Quality metrics documented

**Time:** 6-8 hours

---

## Week 3: Scaling to 800 N5 Cards

### ⏳ Days 11-14 (Days 21-24): Content Sprint

**Daily Goal:** Generate 100 N5 cards/day

**Daily Schedule:**

**Morning (2-3 hours):**
- [ ] Run automated pipeline (import → sentences → audio)
- [ ] Quality validation
- [ ] Generate quality report

**Afternoon (2-3 hours):**
- [ ] Manual review of flagged cards
- [ ] Fix issues
- [ ] Approve cards

**Evening (1 hour):**
- [ ] Update seed data
- [ ] Test in app
- [ ] Track progress

**Daily Deliverables:** 100 cards

**Week 3 Total:** 400 cards (running total: 850+)

**Time per day:** 5-7 hours

---

### ⏳ Day 15 (Day 25): N5 Content Integration

**Goal:** Integrate all 800+ N5 cards into app

**Morning (3 hours):**
- [ ] Clear dev database
- [ ] Import all N5 cards to IndexedDB
- [ ] Verify database integrity

**Afternoon (3 hours):**
- [ ] Test study flow
- [ ] Test quiz generation
- [ ] Test audio playback
- [ ] Test search/filtering

**Evening (2 hours):**
- [ ] Mobile testing
- [ ] Offline mode testing
- [ ] Performance testing

**Deliverables:**
- All 800+ N5 cards integrated
- Full functionality tested

**Time:** 6-8 hours

---

### ⏳ Day 16 (Day 26): Content Polish & Documentation

**Goal:** Final refinement and documentation

**Morning (3 hours):**
- [ ] Fix any integration issues
- [ ] Final quality review
- [ ] Ensure consistent formatting

**Afternoon (3 hours):**
- [ ] Write content creation guide
- [ ] Document data sources
- [ ] Create content statistics page

**Evening (2 hours):**
- [ ] Prepare seed data for production
- [ ] Test clean install
- [ ] Update README

**Deliverables:**
- Polished, production-ready content
- Comprehensive documentation

**Time:** 6-8 hours

---

## Week 4: Beta Testing & Buffer

### ⏳ Days 17-18 (Days 27-28): User Testing

**Goal:** Beta test with real users

**Day 17:**
- [ ] Recruit 10-15 beta testers
- [ ] Give access to dev instance
- [ ] Set up feedback collection

**Day 18:**
- [ ] Monitor usage
- [ ] Collect feedback
- [ ] Address issues

**Deliverables:**
- Beta testing feedback
- Issues documented

**Time per day:** 4-6 hours

---

### ⏳ Days 19-20 (Days 29-30): Buffer & Polish

**Goal:** Handle unexpected issues

**Flexible tasks:**
- [ ] Fix beta testing issues
- [ ] Add missing content
- [ ] Improve documentation
- [ ] Prepare for Phase 2

**Deliverables:**
- Phase 1 complete
- Ready for testing phase

**Time per day:** 4-8 hours

---

## Phase 1 Summary

### Week 1: Pipeline (Days 1-4)
- **Output:** Automated content pipeline
- **Time:** 26-32 hours
- **Cards:** ~400 N5 cards

### Week 2: Generation (Days 5-10)
- **Output:** 450+ N5 cards total
- **Time:** 30-40 hours
- **Features:** Premium audio, categories, tags

### Week 3: Scaling (Days 11-16)
- **Output:** 800+ N5 cards total
- **Time:** 30-40 hours
- **Milestone:** 100% N5 coverage

### Week 4: Validation (Days 17-20)
- **Output:** Beta tested, polished
- **Time:** 16-28 hours
- **Status:** Production ready

### Total Phase 1
- **Duration:** 20 days (4 weeks)
- **Total Time:** 102-140 hours
- **Cards Generated:** 800+ N5 cards
- **Quality:** 95%+ quality score
- **Status:** Ready for Phase 2 (Testing)

---

## Daily Work Rhythm

### Typical Day Structure

**Morning (3 hours):**
- Check previous day's output
- Run automated pipeline
- Review quality reports

**Afternoon (3 hours):**
- Manual review and fixes
- Testing and validation
- Documentation updates

**Evening (2 hours):**
- Final checks
- Commit changes
- Plan next day

**Total:** 6-8 hours/day

### Weekly Reviews

**Every Friday:**
- [ ] Review week's progress
- [ ] Update metrics
- [ ] Plan next week
- [ ] Celebrate wins! 🎉

---

## Tracking Progress

### Daily Checklist Format

```markdown
## Day X - [Date]

**Goal:** [Primary objective]

**Morning:**
- [ ] Task 1
- [ ] Task 2

**Afternoon:**
- [ ] Task 3
- [ ] Task 4

**Evening:**
- [ ] Task 5

**Completed:** [X/Y tasks]
**Time Spent:** [X hours]
**Cards Generated:** [X cards]
**Blockers:** [None/List]
**Notes:** [Key learnings]
```

### Weekly Summary Format

```markdown
## Week X Summary

**Cards Generated:** [X total]
**Time Invested:** [X hours]
**Major Achievements:**
- Achievement 1
- Achievement 2

**Challenges:**
- Challenge 1

**Next Week Focus:**
- Goal 1
- Goal 2
```

---

**This checklist ensures systematic progress toward 800+ N5 cards!**

Ready to start Day 2? 🚀
