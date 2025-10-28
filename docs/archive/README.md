# Documentation Archive

**Last Updated:** October 28, 2024

This folder contains historical documentation from the development of JapVocab. These files have been superseded by the consolidated documentation in the parent `docs/` folder but are preserved for historical reference.

---

## Why These Docs Were Archived

As the project evolved, documentation grew to 60+ files. This made it difficult to:
- Find the information you need
- Keep docs up-to-date
- Onboard new developers
- Maintain consistency

**Solution:** Consolidated into 8 essential guides + archived historical docs

---

## Archive Structure

```
archive/
├── daily-logs/          # Day-by-day development progress (33 files)
├── old-planning/        # Original planning documents (3 files)
├── phase-summaries/     # Phase completion reports (7 files)
├── redundant/           # Docs merged into consolidated guides (6 files)
└── README.md           # This file
```

---

## Daily Logs (33 files)

**Location:** `daily-logs/`

Development progress reports from October 2024.

### Day 1-3: Foundation
- `DAY1_B_PROGRESS_REPORT.md` - Initial progress

### Days 4-9: Core Features & Data Pipeline
- `DAY4_FEATURES.md`, `DAY4_QUICKSTART.md`, `DAY4_SUMMARY.md`
- `DAY5_FEATURES.md`, `DAY5_QUICKSTART.md`
- `DAY6_FEATURES.md`, `DAY6_QUICKSTART.md`, `DAY6_SUMMARY.md`
- `DAY7_FEATURES.md`, `DAY7_PLAN.md`, `DAY7_QUICKSTART.md`, `DAY7_SUMMARY.md`
- `DAY8_FEATURES.md`, `DAY8_PLAN.md`, `DAY8_QUICKSTART.md`, `DAY8_SUMMARY.md`
- `DAY9_PLAN.md`, `DAY9_SUMMARY.md`

### Days 10-14: Automation & Advanced Features
- `DAY10_PLAN.md`, `DAY10_SUMMARY.md`
- `DAY11_JMDICT_BATCH_IMPORT.md` - JMdict import system (15KB, comprehensive)
- `DAY12_TATOEBA_MATCHING.md` - Sentence matching (17KB, comprehensive)
- `DAY13_AUDIO_GENERATION.md` - TTS audio generation (17KB, comprehensive)
- `DAY14_QUALITY_VALIDATION.md` - Validation system (21KB, comprehensive)

**Notable:** Days 11-14 contain detailed technical documentation that may still be useful for understanding specific implementations.

### Weekly Reviews
- `WEEK1_REVIEW_SUMMARY.md` - Week 1 retrospective

### Phase Summaries (in daily-logs/)
- `PHASE_1_2_COMPLETE.md` - Phases 1 & 2 completion summary
- `PHASE1_DAY1_SUMMARY.md` through `PHASE1_DAY4_SUMMARY.md`
- `PHASE1_DAYS5-7_SUMMARY.md`
- `PHASE1_WEEK1_REVIEW.md`

**Superseded by:** `06_PROJECT_HISTORY.md`

---

## Old Planning (3 files)

**Location:** `old-planning/`

Original planning and research documents.

### Files

1. **ENHANCEMENT_PLAN_6WEEKS.md** (67KB)
   - Detailed 6-8 week development plan
   - Feature breakdowns
   - Time estimates
   - Resource planning

   **Why archived:** Completed phases, roadmap updated
   **Superseded by:** `07_DEVELOPMENT_ROADMAP.md`

2. **DAILY_CHECKLISTS.md** (15KB)
   - Task tracking
   - Daily todos
   - Progress checkmarks

   **Why archived:** Tasks completed
   **Superseded by:** GitHub issues, project management tools

3. **JLPT_DATA_SOURCES_RESEARCH.md**
   - Research on vocabulary sources
   - API comparisons
   - License analysis

   **Why archived:** Decisions made, sources selected
   **Superseded by:** `03_DATA_PIPELINE.md`, `CREDITS.md`

---

## Phase Summaries (7 files)

**Location:** `phase-summaries/`

Reports on completed development phases.

### Files

1. **ANALYSIS_SUMMARY.md** - Analysis of data quality
2. **DATA_IMPROVEMENT_PLAN.md** - Plan for improving dataset
3. **DATA-QUALITY-IMPROVEMENTS.md** - Quality improvements summary
4. **DATASET-VERSIONING.md** - Versioning strategy for datasets
5. **Deployment_Summary_Multi_Source.md** - Multi-source deployment notes
6. **Final_filter_list.md** - Final filtering criteria
7. **Multi_Source_Enrichment_Summary.md** - Enrichment from multiple sources

**Superseded by:**
- `03_DATA_PIPELINE.md` - Data processing workflow
- `08_QUALITY_ASSURANCE.md` - Quality and validation
- `06_PROJECT_HISTORY.md` - Historical context

---

## Redundant Docs (6 files)

**Location:** `redundant/`

Documentation that was merged into consolidated guides.

### Files

1. **N5_PIPELINE_GUIDE.md** (53KB)
   - Complete N5 pipeline execution guide
   - Step-by-step Phase 1-7 instructions
   - Troubleshooting

   **Merged into:** `03_DATA_PIPELINE.md`

2. **QUICKSTART_PIPELINE.md** (42KB)
   - Quick start commands
   - Sample data workflow
   - Production workflow

   **Merged into:** `03_DATA_PIPELINE.md`, `01_GETTING_STARTED.md`

3. **TTS-ALTERNATIVES.md** (20KB+)
   - Comparison of 6 TTS solutions
   - VOICEVOX, Azure, Google Cloud, OpenJTalk, COEIROINK
   - Cost analysis, licensing

   **Merged into:** `05_AUDIO_PRODUCTION.md`

4. **AUDIO_SETUP_GUIDE.md** (7KB)
   - Google Cloud TTS setup
   - API configuration

   **Merged into:** `05_AUDIO_PRODUCTION.md`

5. **REVIEW-GUIDELINES.md** (10KB+)
   - 5-point quality checklist
   - Review workflow
   - Decision matrix

   **Merged into:** `08_QUALITY_ASSURANCE.md`

6. **AUDIO_COMPLETE.md** (8KB)
   - Audio generation completion notes

   **Merged into:** `05_AUDIO_PRODUCTION.md`

---

## How to Use This Archive

### Finding Information

**If you need details on:**
- **Overall timeline** → `daily-logs/` folder
- **Original planning** → `old-planning/ENHANCEMENT_PLAN_6WEEKS.md`
- **Specific day's work** → `daily-logs/DAY{N}_*.md`
- **Technical deep dive** → `daily-logs/DAY11-14_*.md` (very detailed)

### When to Refer to Archives

✅ **Do refer to archives when:**
- Understanding historical context
- Debugging old code from specific date
- Researching decisions made
- Writing retrospective/post-mortem

❌ **Don't refer to archives for:**
- Current best practices (use main docs/)
- Setup instructions (may be outdated)
- Architecture decisions (may have changed)
- Active development guidance

---

## Current Documentation

**Always prefer the consolidated docs:**

📄 **Main Docs** (`../` parent folder):
1. `01_GETTING_STARTED.md` - Installation & quick start
2. `02_ARCHITECTURE.md` - Technical architecture
3. `03_DATA_PIPELINE.md` - Data processing guide
4. `04_DATA_SCHEMA.md` - Complete schema reference
5. `05_AUDIO_PRODUCTION.md` - TTS production guide
6. `06_PROJECT_HISTORY.md` - Timeline & milestones
7. `07_DEVELOPMENT_ROADMAP.md` - Future plans
8. `08_QUALITY_ASSURANCE.md` - Quality & validation

---

## File Count Summary

| Category | Files | Total Size |
|----------|-------|------------|
| Daily Logs | 33 | ~450KB |
| Old Planning | 3 | ~85KB |
| Phase Summaries | 7 | ~75KB |
| Redundant | 6 | ~150KB |
| **Total** | **49** | **~760KB** |

---

## Notes

- All dates are October 2024
- Files preserved in original state (not updated)
- Some links may be broken (pointing to moved files)
- Code examples may reference old file paths

---

**Last Reorganization:** October 28, 2024
**Consolidated By:** Development team
**Archive Status:** Preserved for historical reference
