# Office Japanese App — Build Progress

> Last updated: 2026-02-18

---

## Overview

A dedicated `/office` section in the lingomemory app for Japanese used in a
tech workplace (Slack, standups, PRs, incident response, 1-on-1s, etc.).
Built alongside the existing `/verbs` section, sharing the same `VocabularyCard`
type and generic UI components.

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

**148 entries** across 13 categories:

| Category tag | Count | Examples |
|---|---|---|
| `cat:verbs` | 25 | 確認する、報告する、依頼する、デプロイする、マージする |
| `cat:meetings` | 16 | 議題、議事録、承認、フォローアップ、アジェンダ |
| `cat:project` | 18 | 優先度、スケジュール、マイルストーン、リリース、要件 |
| `cat:incident` | 12 | 障害、影響範囲、暫定対応、復旧、再発防止 |
| `cat:status` | 10 | 完了、対応中、遅延、保留、未対応、対応済み |
| `cat:keigo` | 12 | お疲れ様です、承知しました、ご確認ください、お手数をおかけします |
| `cat:tech` | 12 | バグ、デプロイ、プルリクエスト、コードレビュー、本番環境、API |
| `cat:time` | 11 | 期限、締め切り、本日、来週、至急、一時間後 |
| `cat:hr` | 9 | 有給、在宅勤務、欠勤、育児休暇、フレックス |
| `cat:roles` | 8 | エンジニア、マネージャー、チームリーダー、プロダクトオーナー |
| `cat:communication` | 9 | 周知する、連絡する、報告する、フォロー、確認取り |
| `cat:documents` | 6 | 仕様書、設計書、議事録、報告書、手順書 |

### Tag system
- **Active/Passive:** `"active"` (produce it) / `"passive"` (recognize it)
- **Frequency tier:** `"tier:S"` (daily) / `"tier:A"` (weekly) / `"tier:B"` (monthly) / `"tier:C"` (rare)
- **Context:** `"ctx:standup"` / `"ctx:meeting"` / `"ctx:email"` / `"ctx:incident"` / `"ctx:1on1"` / `"ctx:hr"` / `"ctx:client"`
- **Category:** `"cat:verbs"` / `"cat:meetings"` / … (see table above)

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

### Why no new types
`VocabularyCard` from `src/types/vocabulary.ts` already has `tags: string[]`.
All office metadata (tier, active/passive, context, category) is encoded as
structured tag strings — zero schema changes needed.

### What's shared with verbs
- `<Flashcard>` component (generic, no verb-specific fields)
- `VocabularyCard` interface
- `<Header>` layout component
- shadcn/ui primitives (Card, Badge, Button, Progress)

### What's office-only (skipped from verbs)
- Particle quiz — verb grammar only
- Form master — verb conjugation only
- View modes (masu/te/dictionary form) — verb-specific

---

## Pending / Future

- [ ] Audio pronunciation (when audio files available)
- [ ] Progress persistence (localStorage or DB) — know which words are "learned"
- [ ] Spaced repetition scheduling based on test results
- [ ] More vocabulary entries (target: 100+)
- [ ] More scenario packs (PR review, design review, project kick-off)
- [ ] Search / filter by keyword within vocabulary
