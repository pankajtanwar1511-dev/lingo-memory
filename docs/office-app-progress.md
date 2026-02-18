# Office Japanese App — Build Progress

> Last updated: 2026-02-18 · Schema v2

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
| `public/seed-data/office_vocabulary.json` | ✅ Done | 148 vocab entries, 13 categories |
| `public/seed-data/office_scenarios.json` | ✅ Done | 5 situation packs, 32 sentence frames |
| `src/app/office/page.tsx` | ✅ Done | 4 modes: Cards / Match / Test / List |
| `src/app/office/scenarios/page.tsx` | ✅ Done | Browse + Drill mode, 5 situations |
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
- **Scenarios** button in header → `/office/scenarios`

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

## Pending / Future

- [ ] Audio pronunciation (when audio files available)
- [x] Progress persistence (localStorage) — L0–L5 per card via Test mode
- [x] Search / filter by keyword (kanji / kana / romaji / meaning)
- [ ] Spaced repetition scheduling based on test results
- [ ] Expand vocabulary: 148 → ~580 (following `japanese-office-vocabulary.md`)
  - Phase 1 survival core: 120 words (currently 148, covers this)
  - Final target: ~580 entries across 19 categories
- [ ] More scenario packs (PR review, design review, project kick-off)
- [ ] ChatGPT review of all 4 parts for kana/example accuracy
  - Send `office_vocabulary_part{1..4}.json` to ChatGPT for review
  - Apply corrections back to `office_vocabulary.json`
