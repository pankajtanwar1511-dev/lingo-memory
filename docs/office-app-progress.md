# Office Japanese App — Build Progress

> Last updated: 2026-02-19 · Schema v2 · Drills v1

---

## Overview

A dedicated `/office` section in the lingomemory app for Japanese used in a
tech workplace (Slack, standups, PRs, incident response, 1-on-1s, etc.).
Built alongside the existing `/verbs` section, using its own `OfficeCard`
typed interface (separate from `VocabularyCard`).

---

## Files

| File | Status | Notes |
|------|--------|-------|
| `public/seed-data/office_vocabulary.json` | ✅ Done | 148 vocab entries, 13 categories, schema v2 |
| `public/seed-data/office_scenarios.json` | ✅ Done | 5 situation packs, 32 sentence frames |
| `public/seed-data/office_drills.json` | ✅ Done | 1 pack (incident), 5 stages, schema v1 |
| `src/app/office/page.tsx` | ✅ Done | 4 modes: Browse / Flip / Match / Test + Drills button |
| `src/app/office/scenarios/page.tsx` | ✅ Done | Browse + Drill mode, 5 situations |
| `src/app/office/drills/page.tsx` | ✅ Done | Production drill UI, stem validation, completion screen |
| `src/types/vocabulary.ts` | ✅ Done | OfficeCard, OfficeTier, OfficeContext, OfficeCategory, OfficeExample |
| `docs/japanese-office-vocabulary.md` | ✅ Done | 100+ word reference doc |
| `docs/japanese-office-practice.md` | ✅ Done | Practice drills, 30-day plan |

---

## Vocabulary Dataset (`office_vocabulary.json`)

**Version:** 2.0 (schema: `office-v2`)
**148 entries** across 13 categories, each with one example sentence.

| Category | Count | Examples |
|---|---|---|
| `verbs` | 25 | 確認する、報告する、依頼する、デプロイする、マージする |
| `meetings` | 16 | 議題、議事録、承認、フォローアップ、アジェンダ |
| `project` | 18 | 優先度、スケジュール、マイルストーン、リリース、要件 |
| `incident` | 12 | 障害、影響範囲、暫定対応、復旧、再発防止 |
| `status` | 10 | 完了、対応中、遅延、保留、未対応、対応済み |
| `keigo` | 12 | お疲れ様です、承知しました、ご確認ください、お手数をおかけします |
| `tech` | 12 | バグ、デプロイ、プルリクエスト、コードレビュー、本番環境、API |
| `time` | 11 | 期限、締め切り、本日、来週、至急、一時間後 |
| `hr` | 9 | 有給、在宅勤務、欠勤、育児休暇、フレックス |
| `roles` | 8 | エンジニア、マネージャー、チームリーダー、プロダクトオーナー |
| `communication` | 9 | 周知する、連絡する、報告する、フォロー、確認取り |
| `documents` | 6 | 仕様書、設計書、議事録、報告書、手順書 |

### Schema v2 fields (typed — no tag strings)

```json
{
  "id": "office-001",
  "kanji": "確認する",
  "kana": "かくにんする",
  "romaji": "kakunin suru",
  "meaning": ["to confirm", "to check"],
  "partOfSpeech": ["verb"],
  "active": true,
  "tier": "S",
  "contexts": ["standup", "email", "meeting"],
  "category": "verbs",
  "example": {
    "japanese": "進捗を確認します。",
    "kana": "しんちょくをかくにんします。",
    "english": "I'll confirm the progress."
  }
}
```

- **`active`** `boolean` — true = produce (write/speak), false = recognize only
- **`tier`** `"S"|"A"|"B"|"C"` — S=daily, A=weekly, B=monthly, C=rare
- **`contexts`** `OfficeContext[]` — standup / meeting / email / incident / 1on1 / hr / client
- **`category`** `OfficeCategory` — one of 12 categories above
- **`example`** — one sentence per entry: `{ japanese, kana, english }`

TypeScript types in `src/types/vocabulary.ts`: `OfficeCard`, `OfficeExample`, `OfficeTier`, `OfficeContext`, `OfficeCategory`.

---

## Scenarios Dataset (`office_scenarios.json`)

**5 situation packs** with **32 sentence frames** total:

| Situation | Frames | Description |
|---|---|---|
| 🟣 Daily Standup (`standup`) | 7 | Opening, task complete/in-progress/delayed, blockers, closing |
| 🔵 Business Messages (`message`) | 7 | Opener, ack (casual/formal), request, sharing, completion report, closing |
| 🔴 Incident Response (`incident`) | 7 | Phase 1–3: alert → update → resolve → prevent; escalation |
| 🟢 1-on-1 Meeting (`1on1`) | 6 | Opening, on-track, behind, concern, career goals, receiving feedback |
| 🟡 HR & Admin (`hr`) | 5 | PTO request, sick/absent, WFH, late arrival, apology after absence |

Each frame has: `contextEn`, `japanese`, `kana`, `english`, `register` (neutral / casual-neutral / formal).

---

## Office Page (`/office`)

### Modes

| Mode | Description |
|---|---|
| **Cards** | Flip cards using the shared `<Flashcard>` component. Previous/Next nav + progress dots. |
| **Match** | 6-pair matching game. Japanese column vs English column. Batches through all filtered cards. Idle → selected → matched (green) / wrong (red flash). |
| **Test** | Show Japanese → reveal meaning → thumbs up/down self-assessment. Score % at end with list of "still learning" words. Retry option. |
| **List** | Scrollable card list. Click any word to jump to it in Cards mode. |

### Filters

| Filter | Options |
|---|---|
| Category | All / Verbs / Meetings / Project / Incident / Status / Keigo / Tech / Time / HR / Roles / Communication / Documents |
| Context | All Contexts / Standup / Meeting / Email / Incident / 1-on-1 / HR / Client |
| Tier | All / S·Daily / A·Weekly / B·Monthly / C·Rare |
| Mode | All / 🔵 Active / ⚪ Passive |
| Shuffle | Toggle (Cards + Test modes only) |

### Navigation
- **Drills** button (red accent) in hero → `/office/drills`
- **Scenarios** button in hero → `/office/scenarios`
- **Grammar** button in hero → `/verbs/grammar-reference`

---

## Drills Page (`/office/drills`)

Production writing drills — user types complete Japanese sentences, validated
against required vocabulary terms from `office_vocabulary.json`.

### Drill schema (`office_drills.json`)

```json
{
  "version": "1.0",
  "schema": "office-drills-v1",
  "packs": [{
    "id": "incident-lifecycle",
    "title": "Incident Response",
    "titleJa": "障害対応",
    "cluster": "incident",
    "stages": [{
      "id": "incident-s1",
      "stage": 1,
      "title": "Detect",
      "titleJa": "発生報告",
      "prompt": "...",
      "hint": "...",
      "targets": { "required": ["office-039"], "optional": [], "anyOf": [] },
      "modelAnswer": { "japanese": "...", "kana": "...", "english": "..." }
    }]
  }]
}
```

- `targets.required` — vocab IDs that must appear in the user's answer
- `targets.optional` — extra credit; not validated
- `targets.anyOf` — reserved for future use (any-one-of groups)

### Current packs

| Pack | Stages | Vocab targets |
|---|---|---|
| Incident Response (障害対応) | 5 | 発生 → 影響範囲 → 暫定対応 → 根本原因 → 再発防止 |

### Validation logic
- Japanese character guard: `/[ぁ-んァ-ン一-龯]/`
- Stem match: `input.includes(card.kanji) || input.includes(card.kana)`
- MAX_ATTEMPTS = 2 before forced reveal

### UI flow
1. Pack selector (card with stage tiles)
2. Stage progress bar (filled dot → active → upcoming)
3. Prompt card + amber hint callout
4. Japanese textarea (Cmd+Enter to submit)
5. On fail: missed term badges + retry
6. On pass/reveal: model answer + study vocab block
7. Completion screen: passed/revealed counts + per-stage breakdown

---

## Scenarios Page (`/office/scenarios`)

### Browse mode
- Situation tab selector (Japanese names)
- Full frame list showing: context label, Japanese, kana, English, register badge
- **Drill** button to start drill mode

### Drill mode
- Context label shown as colored banner
- Japanese + kana displayed as the prompt
- "Reveal Translation" button → shows English + register badge
- Next / Previous navigation
- Skip button (reveals + advances in one step)
- Completion screen with restart option

---

## Architecture Decisions

### Dedicated `OfficeCard` type (schema v2)
Office vocabulary uses its own typed interface instead of the generic
`VocabularyCard`. Structured fields (`active`, `tier`, `contexts`, `category`,
`example`) replace flat tag strings for type safety and simpler filter logic.
`VocabularyCard` is unchanged — zero breakage to the `/verbs` section.

### What's shared with verbs
- `<Header>` layout component
- shadcn/ui primitives (Card, Badge, Button, Progress)
- Animation library (framer-motion)

### What's office-only (skipped from verbs)
- Particle quiz — verb grammar only
- Form master — verb conjugation only
- View modes (masu/te/dictionary form) — verb-specific

---

## Vocabulary quality status

All 4 ChatGPT review passes completed (2026-02-18 / 2026-02-19):

| Pass | Fixes applied |
|---|---|
| Part 1 (001–037) | office-010 translation, office-024 romaji (ba not ra) |
| Part 2 (038–074) | office-043/044 partOfSpeech, office-053 category keigo→communication, 40 romaji macrons normalized |
| Part 3 (075–111) | office-093 partOfSpeech, office-110 example kana (げつじ not つきじ) |
| Part 4 (112–148) | office-131 DM kana/romaji (ディーエム / dii emu) |

Active/passive audit: 148 entries, **124 active / 24 passive** (83% active).
- office-038 (週次): active → passive
- office-060 (先輩): active → passive

---

## Pending / Future

- [ ] Audio pronunciation (when audio files available)
- [x] Progress persistence (localStorage) — L0–L5 per card via Test mode
- [x] Search / filter by keyword (kanji / kana / romaji / meaning)
- [x] Production drills (`/office/drills`) — incident lifecycle pack live
- [ ] More drill packs (PR review, standup, 1-on-1)
  - Next natural pack: Standup lifecycle (着手→完了→遅延→ブロッカー)
  - After: PR/code review, keigo escalation
- [ ] `anyOf` validation in drills (for synonym-accepting stages)
- [ ] Spaced repetition scheduling based on test results
- [ ] Expand vocabulary: 148 → ~250 (next phase)
  - Priority: add ~30 more active tier-S verbs for standup + PR contexts
  - After drills are validated with current 148
- [ ] More scenario packs (PR review, design review, project kick-off)
- [ ] Link scenarios.json to vocab IDs (like drills already do)
