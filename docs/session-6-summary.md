# Session 6 — Complete Vocabulary Expansion (361 → 580 entries)

**Date**: 2026-02-20
**Goal**: Complete vocabulary expansion to 580 entries + create drill packs for high-value entries
**Status**: ⚠️ Ready for ChatGPT review

---

## Overview

Session 6 represents the **final and complete vocabulary expansion** for the office Japanese app. This session adds **219 new vocabulary entries** (office-362 to office-580), bringing the total from 361 to the target of **580 entries**.

Additionally, **6 new drill packs (30 stages)** were created to cover high-value active vocabulary from both Phase D-F (Session 5) and the new Phase G+ entries.

---

## Vocabulary Expansion

### Part Files Created (5 total)

| File | Entries | ID Range | Status |
|------|---------|----------|--------|
| `office_vocabulary_part11.json` | 45 | office-362 to office-406 | ⚠️ Needs review |
| `office_vocabulary_part12.json` | 45 | office-407 to office-451 | ⚠️ Needs review |
| `office_vocabulary_part13.json` | 45 | office-452 to office-496 | ⚠️ Needs review |
| `office_vocabulary_part14.json` | 45 | office-497 to office-541 | ⚠️ Needs review |
| `office_vocabulary_part15.json` | 39 | office-542 to office-580 | ⚠️ Needs review |
| **Total** | **219** | **office-362 to 580** | |

### New Categories Introduced

The expansion adds **9 new or expanded categories**:

| Category | New Entries | Total After | Notes |
|----------|-------------|-------------|-------|
| **hr** | 30 | 52 | Expanded: overtime, business trips, training, employment types |
| **communication** | 25 | 75 | Expanded: high-freq phrases, business etiquette |
| **supplies** | 23 | 23 | New: office equipment (printers, staplers, business cards, seals) |
| **facilities** | 20 | 20 | New: meeting rooms, cafeteria, parking, break rooms |
| **verbs** | 20 | 72 | Expanded: additional business verbs and keigo forms |
| **general** | 19 | 19 | New: miscellaneous workplace vocabulary |
| **culture** | 15 | 15 | New: business etiquette and cultural concepts |
| **roles** | 14 | 42 | Expanded: executive titles, contract workers |
| **documents** | 13 | 33 | Expanded: additional paperwork types |
| **departments** | 10 | 10 | New: departments and divisions |
| **meetings** | 10 | 39 | Expanded: advanced meeting vocab |
| **keigo** | 7 | 38 | Expanded: additional keigo phrases |
| **project** | 7 | 43 | Expanded: project management terms |
| **time** | 6 | 30 | Expanded: scheduling and time management |

### Vocabulary Quality Notes

**Generated entries include**:
- Kanji, kana, romaji (auto-generated from reference doc)
- English meanings (extracted from reference doc)
- Active/passive flag (from reference doc markers)
- Tier (S/A/B/C from reference doc)
- Category mapping (auto-mapped from reference categories)
- Context tags (extracted from reference doc notes)
- Example sentences (auto-generated templates)

**⚠️ Known limitations**:
- Example sentences are formulaic and need refinement
- Romaji spacing may need verification (compound words)
- Some context tags may not be optimal
- Tier assignments should be verified against real usage

---

## Drill Packs Created

### Part Files Created (3 total, 6 packs, 30 stages)

**File: `office_drills_part15.json`** (2 packs, 10 stages)

| Pack ID | Title | Stages | Vocabulary Targets |
|---------|-------|--------|-------------------|
| `client-relations` | Client Relations Lifecycle | 5 | 商談, 見積もり, 契約, 納品, フォローアップ |
| `finance-workflow` | Finance & Expenses | 5 | 経費, 領収書, 申請, 承認, 精算 |

**File: `office_drills_part16.json`** (2 packs, 10 stages)

| Pack ID | Title | Stages | Vocabulary Targets |
|---------|-------|--------|-------------------|
| `facilities-booking` | Facilities & Resources | 5 | 会議室, 休憩室, 食堂, エントランス, 個室 |
| `hr-workflows` | HR Workflows | 5 | 残業, 出張, 研修, 有休, 在宅勤務 |

**File: `office_drills_part17.json`** (2 packs, 10 stages)

| Pack ID | Title | Stages | Vocabulary Targets |
|---------|-------|--------|-------------------|
| `advanced-meetings` | Advanced Meeting Management | 5 | 議題, プレゼンテーション, 質疑応答, 提案, 定例会議 |
| `scheduling-coordination` | Scheduling & Coordination | 5 | アポイントメント, 延期, 前倒し, リスケ, 定時 |

### Drill Pack Coverage

These 6 packs target **30 high-value active vocabulary entries** from:
- **Phase D-F** (office-242 to 361): Client relations, finance, meetings advanced
- **Phase G+** (office-362 to 580): Facilities, HR workflows, scheduling

---

## Stats Summary

**Before Session 6:**
- Vocabulary: 361 entries
- Drill packs: 17 packs, 85 stages
- Coverage: 36% (131/361)

**After Session 6 (pending merge):**
- Vocabulary: 580 entries (+219, +61% growth)
- Drill packs: 23 packs, 115 stages (+6 packs, +30 stages)
- Coverage: 28% (161/580) — estimated after new drills merged

**Vocabulary distribution after expansion:**
| Category | Count | % of Total |
|----------|-------|-----------|
| communication | 75 | 13% |
| verbs | 72 | 12% |
| hr | 52 | 9% |
| project | 43 | 7% |
| roles | 42 | 7% |
| meetings | 39 | 7% |
| keigo | 38 | 7% |
| documents | 33 | 6% |
| time | 30 | 5% |
| incident | 23 | 4% |
| supplies | 23 | 4% |
| facilities | 20 | 3% |
| general | 19 | 3% |
| culture | 15 | 3% |
| departments | 10 | 2% |

---

## ChatGPT Review Checklist

### Vocabulary Review (5 parts, 219 entries)

For each part file (11-15), review:
1. **Romaji accuracy** — double-vowel Hepburn (oo/uu/aa), spacing for compounds
2. **Kana accuracy** — does it match kanji reading exactly?
3. **Example sentences** — naturalness, grammar, kana accuracy
4. **Meaning precision** — are English translations accurate?
5. **Active/passive appropriateness** — should an engineer produce this word?
6. **Tier accuracy** — does frequency tier (S/A/B/C) match real usage?
7. **Category mapping** — is the category assignment correct?

**Priority**: High-frequency (S/A tier) active entries first.

### Drill Pack Review (3 parts, 6 packs, 30 stages)

For each drill pack (parts 15-17), review:
1. **Model answer naturalness** — is the Japanese grammatically correct and natural?
2. **Model answer kana** — does it match the Japanese reading exactly?
3. **English translation** — is it accurate and natural?
4. **Prompt clarity** — is the English prompt clear and unambiguous?
5. **Hint accuracy** — does the hint correctly describe the target vocabulary?
6. **Vocabulary targeting** — is the required vocab ID appropriate for the stage?

**Priority**: Client relations and finance packs (business-critical vocabulary).

---

## Review Prompts for ChatGPT

### Vocabulary Review Prompt

```
You are a Japanese linguist reviewing tech-workplace vocabulary for a language learning app.

Review each entry for:
1. kana — does it exactly match the kanji reading?
2. romaji — double-vowel Hepburn only (oo/uu/aa, no macrons). Verify spacing for compound words.
3. example.kana — does it match the example.japanese sentence reading exactly?
4. example.japanese — is it natural, grammatically correct Japanese?
5. example.english — is it natural English for the Japanese sentence shown?
6. meaning — are the English translations accurate and complete?
7. partOfSpeech — is it accurate? (verb vs noun)
8. category — is it correctly categorized?
9. active — should a mid-level engineer produce this word in daily work? (true) or just recognize it? (false)
10. tier — does the frequency tier (S=daily, A=weekly, B=monthly, C=rare) match real workplace usage?

[Paste Part 11, 12, 13, 14, or 15 JSON here]

List every error with: entry ID, field, current value → correct value.
Rate the part overall (1-10). Flag anything needing native speaker confirmation.
```

### Drill Pack Review Prompt

```
You are a Japanese linguist reviewing production writing drills for a tech workplace app.

For each stage, check:
1. modelAnswer.japanese — is it natural, grammatically correct Japanese for the prompt?
2. modelAnswer.kana — does it exactly match the reading of modelAnswer.japanese?
3. modelAnswer.english — is it an accurate, natural English translation?
4. hint — does it correctly describe the required term (kana hint matches the vocab entry)?
5. targets.required — is the required vocab ID the most important term for this stage?
6. prompt (English) — is it clear and unambiguous for a Japanese learner?

[Paste Part 15, 16, or 17 JSON here]

List every error with: pack ID, stage ID, field, current value → correct value.
Rate the pack overall (1-10).
```

---

## Next Steps

1. ⚠️ **ChatGPT review all 5 vocabulary parts** (Part 11-15, 219 entries)
2. ⚠️ **ChatGPT review all 3 drill pack parts** (Part 15-17, 30 stages)
3. ✅ Apply all fixes to part files
4. ✅ Merge vocabulary into `office_vocabulary.json`
5. ✅ Merge drill packs into `office_drills.json`
6. ✅ Update `docs/office-app-progress.md` with final Session 6 stats
7. ✅ Commit and push all changes

---

## Files Created

**Vocabulary part files** (5):
- `/public/seed-data/office_vocabulary_part11.json` (45 entries)
- `/public/seed-data/office_vocabulary_part12.json` (45 entries)
- `/public/seed-data/office_vocabulary_part13.json` (45 entries)
- `/public/seed-data/office_vocabulary_part14.json` (45 entries)
- `/public/seed-data/office_vocabulary_part15.json` (39 entries)

**Drill pack part files** (3):
- `/public/seed-data/office_drills_part15.json` (2 packs, 10 stages)
- `/public/seed-data/office_drills_part16.json` (2 packs, 10 stages)
- `/public/seed-data/office_drills_part17.json` (2 packs, 10 stages)

**Documentation**:
- `/docs/session-6-summary.md` (this file)

**Scripts**:
- `/scripts/expand-vocabulary.py` (vocabulary expansion script)

---

## Architectural Notes

### Vocabulary Generation Strategy

Used a Python script to:
1. Parse `docs/japanese-office-vocabulary.md` reference doc (536 entries found)
2. Compare with current `office_vocabulary.json` (361 entries)
3. Identify 343 missing entries
4. Trim to 219 entries to reach exactly 580 total
5. Auto-generate entries with schema v2 structure
6. Divide into 5 reviewable parts (~45 entries each)

### Drill Pack Creation Strategy

Focused on **high-value, high-frequency active vocabulary**:
- Prioritized S-tier and A-tier entries
- Created workflow-based packs (client relations lifecycle, finance workflow, etc.)
- Covered real-world business scenarios (booking facilities, HR requests, scheduling)
- Targeted vocabulary from both Phase D-F (Session 5) and new Phase G+ entries

### Category Mapping

Reference doc categories → App categories:
- "Roles & Titles" → `roles`
- "Departments & Divisions" → `departments`
- "Workplace Facilities & Spaces" → `facilities`
- "Office Supplies & Equipment" → `supplies`
- "Documents & Paperwork" → `documents`
- "Business Verbs & Actions" → `verbs`
- "Meetings & Discussions" → `meetings`
- "Time, Deadlines & Scheduling" → `time`
- "Communication" → `communication`
- "Finance, Budget & Accounting" → `finance` (new category)
- "HR & Employment" → `hr`
- "Business Etiquette & Culture" → `culture` (new category)
- "Keigo — Verb Substitutions" → `keigo`
- "Keigo — Set Phrases & Greetings" → `keigo`
- "Project Management" → `project`
- "Customers & Client Relations" → `clients` (new category)
- "Technology & IT" → `tech`
- "Presentations & Data" → `presentations` (new category)
- "Engineering & Technical Operations" → `engineering` (new category)
- "High-Frequency Workplace Phrases" → `communication`
- "Incident / Trouble / Escalation" → `incident`
- "General Vocabulary" → `general` (new category)

---

## Session 6 Achievement

✅ **Complete vocabulary expansion to 580 entries**
✅ **Created 219 new vocabulary entries** organized into 5 reviewable parts
✅ **Created 6 new drill packs (30 stages)** targeting high-value vocabulary
✅ **Systematic approach** using Python script for quality and consistency
⚠️ **Ready for linguistic review** by ChatGPT before merge

**This represents the final planned vocabulary expansion for the office Japanese app, reaching the target of 580 entries defined in the reference documentation.**
