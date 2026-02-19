# Office Japanese App — Build Progress

> Last updated: 2026-02-20 · Schema v2 · Drills v1 · 7 packs · 200/580 vocab · SRS v1 (basic) · coverage 40% → target 60%

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
| `public/seed-data/office_vocabulary.json` | ✅ Done | 200 vocab entries, 12 categories, schema v2 |
| `public/seed-data/office_vocabulary_part6.json` | ✅ Done | Entries 171–200 (tech/design, email, project, status) |
| `public/seed-data/office_scenarios.json` | ✅ Done | 7 situation packs, 46 sentence frames, vocabIds linked |
| `public/seed-data/office_drills.json` | ✅ Done | 7 packs (incident + standup + PR + keigo + 1-on-1 + design-review + email), 35 stages, schema v1 |
| `src/app/office/page.tsx` | ✅ Done | 4 modes: Browse / Flip / Match / Test + SRS scheduling |
| `src/app/office/scenarios/page.tsx` | ✅ Done | Browse + Drill mode, register filter, vocab study block on completion |
| `src/app/office/drills/page.tsx` | ✅ Done | Production drill UI, stem + anyOf validation, completion screen |
| `src/types/vocabulary.ts` | ✅ Done | OfficeCard, OfficeTier, OfficeContext, OfficeCategory, OfficeExample |
| `scripts/coverage-analyzer.js` | ✅ Done | Cross-refs vocab IDs across all data files; `--uncovered` + `--category` flags |
| `docs/japanese-office-vocabulary.md` | ✅ Done | 100+ word reference doc |
| `docs/japanese-office-practice.md` | ✅ Done | Practice drills, 30-day plan |

---

## Vocabulary Dataset (`office_vocabulary.json`)

**Version:** 2.0 (schema: `office-v2`)
**200 entries** across 12 categories, each with one example sentence.

| Category | Count | Examples |
|---|---|---|
| `verbs` | 35 | 確認する、報告する、着手する、進める、差し戻す、切り戻す、議論する、決定する |
| `project` | 25 | 優先度、スケジュール、マイルストーン、タイムライン、スプリント、ロードマップ、ゴール |
| `tech` | 22 | バグ、デプロイ、ブランチ、コミット、差分、リファクタリング、本番リリース、仕様変更 |
| `meetings` | 17 | 議題、議事録、承認、フォローアップ、アジェンダ |
| `communication` | 16 | 周知する、以下の通り、念のため、先日、取り急ぎ、件名、ご返信お待ちしております |
| `status` | 16 | 完了、対応中、遅延、保留、テスト中、リリース待ち、検討中、確認待ち、着手済み |
| `keigo` | 14 | お疲れ様です、承知しました、ご不明な点があれば、ご連絡いたします |
| `incident` | 12 | 障害、影響範囲、暫定対応、復旧、再発防止 |
| `time` | 11 | 期限、締め切り、本日、来週、至急 |
| `hr` | 9 | 有給、在宅勤務、欠勤、育児休暇、フレックス |
| `roles` | 8 | エンジニア、マネージャー、チームリーダー、プロダクトオーナー |
| `documents` | 8 | 仕様書、設計書、議事録、報告書、ドキュメント、方針 |

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

**7 situation packs** with **46 sentence frames** total:

| Situation | Frames | Description |
|---|---|---|
| 🟣 Daily Standup (`standup`) | 7 | Opening, task complete/in-progress/delayed, blockers, closing |
| 🔵 Business Messages (`message`) | 7 | Opener, ack (casual/formal), request, sharing, completion report, closing |
| 🔴 Incident Response (`incident`) | 7 | Phase 1–3: alert → update → resolve → prevent; escalation |
| 🟢 1-on-1 Meeting (`1on1`) | 6 | Opening, on-track, behind, concern, career goals, receiving feedback |
| 🟡 HR & Admin (`hr`) | 5 | PTO request, sick/absent, WFH, late arrival, apology after absence |
| 🔷 Design Review (`design-review`) | 7 | Request review, explain rationale, flag concern, request revision, approve, share spec, spec change |
| 🩵 Project Kick-off (`kickoff`) | 7 | Announce project, share timeline, define requirements, assign responsibilities, milestones, sprint goal, close |

Each frame has: `contextEn`, `japanese`, `kana`, `english`, `register` (neutral / casual-neutral / formal), `vocabIds?: string[]`.

### vocabIds linking
All 32 frames now carry `vocabIds` arrays pointing to entries in `office_vocabulary.json`.
This enables the **vocab study block** shown on scenario drill completion.

### Register filter (scenarios page)
Toggle buttons above the frame list: **All / Neutral / Casual / Formal**.
- Counts per register shown on each tab
- Filter scopes both Browse mode and Drill mode
- Drill button disabled if filter produces 0 frames
- Drill session key resets when filter changes

---

## Office Page (`/office`)

### Modes

| Mode | Description |
|---|---|
| **Browse** | Full card list with example sentences, tier badges, context tags. |
| **Flip** | Flip cards (meaning front → Japanese back). Toggle each card individually. |
| **Match** | 10-pair matching game. Japanese column vs English column. Batches through all filtered cards. Idle → selected → matched (green) / wrong (red flash). Auto-advance mode. |
| **Test** | Show meaning → reveal Japanese → thumbs up/down self-assessment. L0–L5 per card, persisted in localStorage. **SRS scheduling**: each mark sets `nextReviewDate` based on level interval. |

### Test mode SRS (Spaced Repetition)

| Level | Interval | Meaning |
|---|---|---|
| L0 | 1 day | Just started / still learning |
| L1 | 3 days | Seen once |
| L2 | 7 days | Getting there |
| L3 | 14 days | Known |
| L4 | 30 days | Strong |
| L5 | 90 days | Mastered |

- `CardProgress.nextReviewDate` stored in `localStorage["officeProgress"]`
- **"Due Today" filter** in controls row — shows only cards where `nextReviewDate ≤ today`
- **Amber badge** on card front when due
- **"next: YYYY-MM-DD" / "due now"** shown on card back
- **Stats header**: Known / Needs Practice / Not Reviewed / Due count
- Mutual exclusion: "Due Today" and "Focus needs practice" switches auto-disable each other

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
- `targets.anyOf` — array of synonym groups; each group requires at least one match (✅ live)

### Current packs

| Pack | Stages | Vocab targets |
|---|---|---|
| Incident Response (障害対応) | 5 | 発生 → 影響範囲 → 暫定対応 → 根本原因 → 再発防止 |
| Daily Standup (朝会報告) | 5 | 着手 → 進行中 → 完了報告 → 遅延報告 → ブロッカー |
| PR Review (コードレビュー) | 5 | レビュー依頼 → コメント → 修正依頼 → 承認 → 本番デプロイ |
| Keigo Escalation (敬語エスカレーション) | 5 | カジュアル返答 → 丁寧な返答 → 依頼の敬語 → 謝罪の敬語 → フォーマルな書き出し |
| 1-on-1 Meeting (1on1) | 5 | 開始 → 順調 → 遅延報告 → 課題の共有 → フィードバック |
| Design Review (デザインレビュー) | 5 | レビュー依頼 → 懸念の指摘 → 修正依頼 → 承認 → 仕様共有 |
| Email Lifecycle (メールの書き方) | 5 | 書き出し → 丁寧な依頼 → 情報共有 → フォローアップ → 結び |

### Validation logic
- Japanese character guard: `/[ぁ-んァ-ン一-龯]/`
- `required` — all listed vocab IDs must appear (kanji or kana stem match)
- `anyOf` — each group requires at least one term from the group (synonym choice)
  - Example: `[["office-069", "office-068"]]` → マージする **or** デプロイする
  - Failed anyOf shows "Use one of: X / Y" in red feedback badges
  - Passed anyOf shows the matched term as a green badge
  - Revealed anyOf shows all options in the study block with "or:" prefix
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

## Coverage Analyzer (`scripts/coverage-analyzer.js`)

Node.js script that cross-references `office_vocabulary.json`, `office_scenarios.json`,
and `office_drills.json` to show which vocab entries are exercised and which aren't.

**Usage:**
```bash
node scripts/coverage-analyzer.js                  # full report
node scripts/coverage-analyzer.js --uncovered      # only uncovered entries
node scripts/coverage-analyzer.js --category verbs # filter by category
```

**Baseline (200 entries, 7 drill packs, 7 scenario packs):**
- Covered: 79/200 (40%) · Both: 34 · Scenarios only: 23 · Drills only: 22
- Best coverage: incident 83%, keigo 73%
- Worst coverage: communication 19%, documents 14%, roles 13%, meetings 21%
- High-priority uncovered (active, tier S/A): **87 entries** across all categories

---

## Reference Doc Gap Analysis

`docs/japanese-office-vocabulary.md` defines **~580 words across 21 categories** as the full target.
The current app has **200 entries across 12 categories** — roughly 1/3 of the stated goal.

### Categories completely absent from the app

These categories exist in the reference doc but have **zero entries** in `office_vocabulary.json`:

| Ref Category | Words | Priority | Why it matters |
|---|---|---|---|
| Departments & Divisions | 20 | B | Engineers need to name チーム, 開発部, 総務部 |
| Workplace Facilities & Spaces | 20 | B/C | 会議室予約, オフィス layout — mostly passive |
| Office Supplies & Equipment | 24 | B/C | 名刺, 印鑑, ホワイトボード — cultural essentials |
| Finance, Budget & Accounting | 25 | B | 請求書, 精算する, 振り込む — needed for expenses |
| Business Etiquette & Culture | 20 | A | 名刺交換, 敬語 etiquette, 報連相 |
| Keigo — Verb Substitutions | 20 | A | いただく, おっしゃる, ご覧になる — fully missing |
| Customers & Client Relations | 20 | B | 顧客, お客様, 取引先 — needed for client-facing |
| Presentations & Data | 13 | A | グラフ, スライド, 説明する patterns |
| High-Frequency Workplace Phrases | 40 | **S** | ★ Most important missing layer |

### Categories present but undercovered vs the reference

| Category in App | App Count | Ref Target | Gap | Coverage % |
|---|---|---|---|---|
| `roles` | 8 | 24 | −16 | 33% of ref |
| `documents` | 8 | 24 | −16 | 33% of ref |
| `meetings` | 17 | 29 | −12 | 59% of ref |
| `hr` | 9 | 30 | −21 | 30% of ref |
| `verbs` | 35 | 48 | −13 | 73% of ref |
| `tech` | 22 | 25 | −3 | 88% of ref ✅ |
| `incident` | 12 | 25 | −13 | 48% of ref |
| `keigo` | 14 | 40 (both keigo cats) | −26 | 35% of ref |

### Expansion roadmap (using reference doc as source)

**Phase A — High-Frequency Phrases (priority S):** Add the 40-word "High-Freq Workplace Phrases"
section from the reference doc. These are the most used phrases and directly improve SRS value.

**Phase B — Fill undercovered categories:**
1. Meetings: add 12 missing entries (アジェンダ, 発言する, まとめる, etc.)
2. HR: add 21 missing entries (評価, 残業する, 研修, etc.)
3. Keigo verb substitutions: add いただく, おっしゃる, ご覧になる, 拝見する etc. (20 entries)

**Phase C — New categories (B-priority):**
4. Documents: add 16 missing document types (書類, 報告書, 契約書, etc.)
5. Finance: add core 15 entries (請求書, 精算する, 振り込む, 経費, 予算)
6. Client relations: add 10 core entries (お客様, 取引先, 商談, etc.)

> **Rule going forward:** New entries must come from `japanese-office-vocabulary.md` first.
> Only add entries not in the reference doc if they are clearly missing (e.g. new tech terms).

---

## Coverage Roadmap (40% → 60%+)

**Current state:** 79/200 covered (40%). Need 41 more entries covered to hit 60%.

**Strategy: build drills/scenarios that target the biggest uncovered clusters, not more vocab.**

### High-priority uncovered entries by category (active, S/A tier only)

| Category | Uncovered S/A entries | Quick-win drill pack |
|---|---|---|
| `meetings` | 会議, ミーティング, 打ち合わせ, 議事録, 進捗確認, 報告, アジェンダ, 確認事項, 決定事項, オンライン会議, 議題 | Meeting lifecycle |
| `tech` | エラー, テスト, ブランチ, コミット, ログ, リファクタリング, 差分, 本番リリース, モックアップ, ロードマップ | Tech workflow drill |
| `communication` | 連絡する, 返信する, チャット, メンション, 添付, 件名, 周知, DM | Slack/messaging drill |
| `status` | 検討中, 確認待ち, 着手済み, ステータス更新, 未対応, 保留, 対応済み, 確認済み | Status update scenarios |
| `verbs` | 依頼する, 検討する, 準備する, まとめる, 把握する, 着手する, 見直す, 切り戻す | Standup + meeting verbs |
| `keigo` | ご検討ください, お伝えします, 取り急ぎ, ご返信お待ちしております | Keigo phrases drill |

### Drill packs needed to reach 60% coverage

| New Pack | Target vocab IDs | Estimated new entries covered |
|---|---|---|
| Meeting lifecycle (会議の流れ) | office-019, 020, 021, 022, 025, 026, 076, 077, 078, 082 | ~10 |
| Slack/Comms drill (チャットコミュニケーション) | office-002, 014, 049, 050, 125, 127, 129, 130, 131 | ~9 |
| Tech workflow drill (開発フロー) | office-137, 143, 144, 150, 151, 152, 162, 167, 168 | ~9 |
| Status update scenarios | office-097, 098, 100, 101, 154, 155, 170, 196, 197, 198 | ~10 |

Adding these 4 packs: ~38 new entries → 79+38 = **117/200 = 58%** (just under 60%)
Plus linking existing unlinked entries: **~60%+ reachable without adding any new vocab**.

---

## Pattern Practice Plan (from `japanese-office-practice.md`)

The practice guide defines **7 communication patterns** (A–G) that are more pedagogically
structured than what was built from scratch. These should be wired into the app.

### Patterns defined in the guide

| Pattern | Description | Frames | Key vocab |
|---|---|---|---|
| A — Acknowledgment | Responding when someone sends info | 6 | 了解です, 承知しました, 確認しました, 拝見しました |
| B — Sharing Information | Passing something along | 5 | 共有します, ご報告です, ご参考までに |
| C — Making a Request | Getting someone to do something | 6 | お願いします, ご確認いただけますでしょうか, ご対応よろしく |
| D — Reporting Progress | Updating on status | 5 | 完了しました, 対応中です, 予定通り進んでいます |
| E — Flagging Problems | Delay / blocker / stuck | 6 | 遅延が発生, 手間取っています, 相談があります |
| F — Asking for Clarification | Need more info | 5 | 確認させてください, ご認識のすり合わせ |
| G — Delegating / Routing | Passing to someone else | 4 | 担当の〜さんに, そちらを優先で |

**Total: 37 sentence frames** directly covering real workplace writing.

### Implementation plan

**Option 1 (quickest): Add as scenario pack**
Add a new `office_scenarios.json` situation pack `"pattern-practice"` using the 37 frames
from the guide. Each frame maps directly to a pattern and links existing vocab IDs.

**Option 2 (better UX): New "Pattern Drills" page**
A new `/office/patterns` page — similar to drills but focused on sentence patterns:
- Select a pattern (A–G)
- See the English prompt
- Type the Japanese response
- Validation: check for key phrase (not just vocab ID stem matching)

**Recommended approach:** Start with Option 1 (add to scenarios) — zero new code, immediate
coverage gain. Upgrade to Option 2 when pattern drills become the primary study mode.

---

## SRS Upgrade Plan

### Current implementation (v1 — basic level scheduler)

```typescript
// Fixed intervals per level — no personalisation
const SRS_INTERVALS = { 0: 1, 1: 3, 2: 7, 3: 14, 4: 30, 5: 90 }
// Binary input: thumbs up (+1 level) or thumbs down (-1 level)
```

**Problems:**
- Binary rating (known/unknown) loses information — "barely recalled" and "instant recall" both score +1
- No easiness factor — a hard card and an easy card get the same interval at the same level
- No stability decay — if you skip reviews for a week, nothing changes

### Target implementation (v2 — SM-2 inspired)

**What to change in `CardProgress`:**
```typescript
interface CardProgress {
  cardId: string
  knownCount: number
  unknownCount: number
  level: number
  nextReviewDate?: string
  // NEW:
  easinessFactor?: number   // default 2.5, min 1.3 — personalises interval growth
  interval?: number         // current interval in days (replaces fixed SRS_INTERVALS lookup)
  repetitions?: number      // consecutive correct answers
}
```

**What to change in the UI:**
Replace 2-button (👍 / 👎) with **4-button rating**:

| Button | Label | Meaning | Effect |
|---|---|---|---|
| 🔴 | Again | Forgot / blank | Reset: interval=1, repetitions=0 |
| 🟡 | Hard | Recalled with effort | EF−0.15, interval×0.8 |
| 🟢 | Good | Recalled correctly | EF unchanged, interval×EF |
| ⚡ | Easy | Instant recall | EF+0.1, interval×EF×1.3 |

**SM-2 interval formula:**
```
rep=0 → 1 day
rep=1 → 6 days
rep>1 → prev_interval × EF
EF' = EF + (0.1 - (5-q) × (0.08 + (5-q) × 0.02))   // q: Again=1, Hard=3, Good=4, Easy=5
EF_min = 1.3
```

**Alternative: Use existing `src/lib/fsrs.ts`**
The app already has a full FSRS implementation. It's wired to a `databaseService`
but the algorithm itself (`calculateNextCard`, `Rating`) could be used standalone
with localStorage as the store — just skip the database call.

**Migration:** `CardProgress` schema is backwards-compatible. Old entries without
`easinessFactor`/`interval` default to SM-2 starting values on first use.

**Priority:** v2 SRS is a feature improvement, not a blocker. Build it after coverage
hits 60% — otherwise optimising review scheduling for uncovered cards has no effect.

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

5 ChatGPT review passes completed (2026-02-18 / 2026-02-19); Part 6 pending:

| Pass | Fixes applied |
|---|---|
| Part 1 (001–037) | office-010 translation, office-024 romaji (ba not ra) |
| Part 2 (038–074) | office-043/044 partOfSpeech, office-053 category keigo→communication, 40 romaji macrons normalized |
| Part 3 (075–111) | office-093 partOfSpeech, office-110 example kana (げつじ not つきじ) |
| Part 4 (112–148) | office-131 DM kana/romaji (ディーエム / dii emu) |
| Part 5 (149–170) | office-160 meaning order, office-170 example alignment |
| **Part 6 (171–200)** | **⚠️ Pending review** |

Active/passive audit: 200 entries, **170 active / 30 passive** (85% active).
- office-038 (週次): active → passive
- office-060 (先輩): active → passive
- Entries 171–200: see part6 for individual active values

---

## ChatGPT Review Protocol

Use this process after every phase of changes — vocabulary expansion, new drill
packs, model answer edits, or any data file update.

---

### Phase 1 — Vocabulary batch review

**When:** After adding or editing any entries in `office_vocabulary.json`.

**How to send:**
1. Split the changed range into a part file (e.g. `office_vocabulary_part5.json`)
2. Paste into ChatGPT with the prompt below

**Review prompt (copy-paste):**
```
You are a Japanese linguist reviewing tech-workplace vocabulary for a language learning app.
Review each entry for:
1. kana — does it exactly match the kanji reading?
2. romaji — double-vowel Hepburn only (oo/uu/aa, no macrons). Verify each one.
3. example.kana — does it match the example.japanese sentence reading exactly?
4. example.english — is it natural English for the Japanese sentence shown?
5. partOfSpeech — is it accurate? (no "expression" unless truly idiomatic)
6. category — is it correctly categorised? (e.g. 了解です → communication, not keigo)
7. active — should a learner produce this in Slack/standup? (true) or just recognise it? (false)

Score each entry 1–10. List every error with: entry ID, field, current value → correct value.
Rate the batch overall. Flag anything needing native speaker confirmation.
```

**What to apply back:**
- All field-level corrections → apply to `office_vocabulary.json`
- Regenerate part files: split the full JSON into 4 parts (001–037, 038–074, 075–111, 112–end)
- Run `tsc --noEmit` after any page.tsx changes

**Log completed passes here** (see "Vocabulary quality status" section above).

---

### Phase 2 — Drill pack review

**When:** After adding a new pack or editing stages/model answers in `office_drills.json`.

**Review prompt (copy-paste):**
```
You are a Japanese linguist reviewing production writing drills for a tech workplace app.
For each stage, check:
1. modelAnswer.japanese — is it natural, grammatically correct Japanese for the prompt?
2. modelAnswer.kana — does it exactly match the reading of modelAnswer.japanese?
3. modelAnswer.english — is it an accurate, natural English translation?
4. hint — does it correctly describe the required term (kana hint matches the vocab entry)?
5. targets.required — is the required vocab ID the most important term for this stage?
6. prompt (English) — is it clear and unambiguous for a Japanese learner?

List every error with: pack ID, stage ID, field, current value → correct value.
```

**What to apply back:**
- Model answer / kana / hint corrections → apply to `office_drills.json`
- Do NOT change vocab IDs in targets without also checking `office_vocabulary.json`

---

### Phase 3 — Strategic / architecture review

**When:** After completing a major feature (new page, new data schema, new mode).

**Review prompt (copy-paste):**
```
I'm building a Japanese office vocabulary app for a software engineer learning to work in
a Japanese tech company. Here is the current progress doc:

[paste office-app-progress.md]

Review from two angles:
1. Pedagogy — is the learning flow effective? Are there gaps between recognition and production?
2. Architecture — is the data model clean? Any structural debt to address before expanding?

Give 3–5 prioritised recommendations. Be specific about what to build next and why.
```

**Use this output to:**
- Update the Pending / Future section
- Prioritise next feature vs. next data expansion
- Identify any vocabulary or schema corrections before the next build phase

---

### Review log

| Date | Phase | Scope | Outcome |
|------|-------|-------|---------|
| 2026-02-18 | Vocab batch | Part 1 (001–037) | 2 fixes: office-010 english, office-024 romaji |
| 2026-02-18 | Vocab batch | Part 2 (038–074) | 4 fixes: partOfSpeech ×2, category ×1, romaji ×40 |
| 2026-02-19 | Vocab batch | Part 3 (075–111) | 2 fixes: partOfSpeech ×1, example kana ×1 |
| 2026-02-19 | Vocab batch | Part 4 (112–148) | 1 fix: DM kana + romaji |
| 2026-02-19 | Vocab batch | Part 5 (149–170) | 2 fixes: office-160 meaning order, office-170 example alignment |
| 2026-02-19 | Drill packs | All 5 packs | 1 fix: 1on1-s5 model answer (unnatural compression → two-sentence) |
| 2026-02-19 | Scenarios | All 5 packs | 2 fixes: std-003 を→に particle, inc-005 added が particle |
| 2026-02-18 | Strategic | Full app | Recommended: depth over breadth → linked drills |
| 2026-02-19 | Strategic | Full app | Validated two-layer linking approach + drill schema |

---

## Pending / Future

### Done ✅
- [x] Progress persistence (localStorage) — L0–L5 per card via Test mode
- [x] SRS v1 — nextReviewDate per mark; Due Today filter + amber badge
- [x] Search / filter by keyword (kanji / kana / romaji / meaning)
- [x] Production drills with anyOf validation
- [x] 7 drill packs (incident, standup, PR, keigo, 1-on-1, design-review, email)
- [x] 7 scenario packs (standup, message, incident, 1-on-1, hr, design-review, kickoff)
- [x] vocabIds linking across all 46 scenario frames
- [x] Register filter in scenarios (All / Neutral / Casual / Formal)
- [x] Vocabulary 148 → 200
- [x] Coverage analyzer script
- [x] ChatGPT review parts 1–5 + all original drill packs + original scenarios

### Priority 1 — Quality (do before expanding further)
- [ ] **ChatGPT review Part 6 (171–200)** — 30 entries unreviewed
- [ ] **ChatGPT review design-review + email-lifecycle drill packs** — 2 packs unreviewed
- [ ] **Native speaker review** — at least 1 pass on drill model answers; AI reviewing AI is a ceiling

### Priority 2 — Coverage (40% → 60%)
- [ ] Meeting lifecycle drill pack — targets office-019/020/021/022/025/026/076/077/078/082 (~10 entries)
- [ ] Slack/Comms drill pack — targets office-002/014/049/050/125/127/129/130/131 (~9 entries)
- [ ] Tech workflow drill pack — targets office-137/143/144/150/151/152/162/167/168 (~9 entries)
- [ ] Status update scenario pack — targets office-097/098/100/101/154/155/170/196/197/198 (~10 entries)
- [ ] Pattern Practice: add patterns A–G from `japanese-office-practice.md` as scenario pack (~37 frames)

### Priority 3 — Vocab expansion (from reference doc only)
> All new entries must come from `docs/japanese-office-vocabulary.md` — no AI-invented entries
- [ ] **Phase A**: High-Frequency Workplace Phrases (40 entries, tier S) — highest ROI
- [ ] **Phase B**: Meetings gap (12 entries), HR gap (21 entries), Keigo verb substitutions (20 entries)
- [ ] **Phase C**: Documents gap (16), Finance basics (15), Client relations (10)

### Priority 4 — SRS v2 (after coverage hits 60%)
- [ ] 4-button rating: Again / Hard / Good / Easy (replaces thumbs up/down)
- [ ] SM-2 easiness factor per card (personalised intervals)
- [ ] Evaluate using existing `src/lib/fsrs.ts` algorithm with localStorage store

### Backlog
- [ ] Audio pronunciation (when audio files available)
- [ ] More drill packs: performance review / appraisal lifecycle
- [ ] More scenario packs: client-facing, performance review
- [ ] Pattern Practice page (`/office/patterns`) — Option 2 upgrade from scenario pack
