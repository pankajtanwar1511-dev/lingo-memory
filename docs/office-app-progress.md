# Office Japanese App — Build Progress

> Last updated: 2026-02-20 · Schema v2 · Drills v1 · 11 packs · 240/580 vocab · SRS v2 (FSRS) · coverage **55%** (131/240)

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
| `public/seed-data/office_vocabulary.json` | ✅ Done | 240 vocab entries (200 − 1 de-dup + 25 A/B + 16 C), 12 categories, schema v2 |
| `public/seed-data/office_vocabulary_part6.json` | ✅ Done | Entries 171–199 (29 entries after de-dup) |
| `public/seed-data/office_scenarios.json` | ✅ Done | 9 situation packs, 90 sentence frames, vocabIds linked |
| `public/seed-data/office_drills.json` | ✅ Done | 11 packs, 55 stages, schema v1 |
| `src/app/office/page.tsx` | ✅ Done | 4 modes: Browse / Flip / Match / Test + SRS v2 (FSRS) |
| `src/app/office/scenarios/page.tsx` | ✅ Done | Browse + Drill mode, register filter, vocab study block on completion |
| `src/app/office/drills/page.tsx` | ✅ Done | Production drill UI, stem + anyOf validation, completion screen |
| `src/types/vocabulary.ts` | ✅ Done | OfficeCard, OfficeTier, OfficeContext, OfficeCategory, OfficeExample |
| `scripts/coverage-analyzer.js` | ✅ Done | Cross-refs vocab IDs across all data files; `--uncovered` + `--category` flags |
| `docs/japanese-office-vocabulary.md` | ✅ Done | ~580-word reference across 21 categories — expansion roadmap |
| `docs/japanese-office-practice.md` | ✅ Done | 7 communication patterns A–G, 37 frames, 30-day plan — now wired into app |

---

## Vocabulary Dataset (`office_vocabulary.json`)

**Version:** 2.0 (schema: `office-v2`)
**240 entries** across 12 categories, each with one example sentence.
*(200 → 199 after de-duplication: office-176 添付 merged into office-129 · +25 Phase A/B: office-201–225 · +16 Phase C: office-226–241)*

| Category | Count | Examples |
|---|---|---|
| `verbs` | 36 | 確認する、報告する、着手する、進める、差し戻す、議論する、決定する、**比較する** |
| `keigo` | 31 | お疲れ様です、承知しました、ご確認ありがとうございます、いたす、申す、拝見する、いただく、伺う、いらっしゃる |
| `project` | 29 | 優先度、スケジュール、マイルストーン、タイムライン、スプリント、ロードマップ、連携、**需要** |
| `tech` | 26 | バグ、デプロイ、ブランチ、コミット、差分、リファクタリング、保存、箇所 |
| `communication` | 25 | チャット、DM、メンション、返信、添付、件名、周知、個別、各自、**報連相、挨拶、もしかして、名刺交換、根拠、空気を読む** |
| `meetings` | 20 | 会議、ミーティング、打ち合わせ、議事録、アジェンダ、確認事項、決定事項、社内調整 |
| `status` | 18 | 完了、対応中、遅延、保留、テスト中、リリース待ち、検討中、確認待ち、着手済み、**至急、傾向** |
| `incident` | 12 | 障害、影響範囲、暫定対応、復旧、再発防止 |
| `time` | 12 | 期限、締め切り、本日、来週、至急、先日 |
| `hr` | 12 | 有給、在宅勤務、欠勤、育児休暇、フレックス、勤怠、**飲み会、講習** |
| `documents` | 11 | 仕様書、設計書、議事録、報告書、ドキュメント、**スライド、グラフ、表、参考資料** |
| `roles` | 8 | エンジニア、マネージャー、チームリーダー、プロダクトオーナー |

**Phase A additions (office-201–211)** — High-frequency workplace phrases:
`個別` `保存` `勤怠` `連携` `箇所` `そのまま` `各自` `手間取る` `社内調整` `ご確認ありがとうございます` `ご連絡ありがとうございます`

**Phase B additions (office-212–225)** — Keigo verb substitutions:
`いたす` `申す` `参る` `おる` `存じる` `拝見する` `いただく` `伺う` `承る` `いらっしゃる` `おっしゃる` `なさる` `くださる` `ご覧いただく`

**Phase C additions (office-226–241)** — Business culture + presentation essentials:
- **Business culture (S/A tier)**: `報連相` `挨拶` `もしかして` `名刺交換` `根拠` `空気を読む` `飲み会`
- **Presentation/data (A tier)**: `スライド` `グラフ` `表` `参考資料` `傾向` `比較する`
- **Status/project (A/B tier)**: `至急` `需要` `講習`

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

**9 situation packs** with **90 sentence frames** total:

| Situation | Frames | Description |
|---|---|---|
| 🟣 Daily Standup (`standup`) | 7 | Opening, task complete/in-progress/delayed, blockers, closing |
| 🔵 Business Messages (`message`) | 7 | Opener, ack (casual/formal), request, sharing, completion report, closing |
| 🔴 Incident Response (`incident`) | 7 | Phase 1–3: alert → update → resolve → prevent; escalation |
| 🟢 1-on-1 Meeting (`1on1`) | 6 | Opening, on-track, behind, concern, career goals, receiving feedback |
| 🟡 HR & Admin (`hr`) | 5 | PTO request, sick/absent, WFH, late arrival, apology after absence |
| 🔷 Design Review (`design-review`) | 7 | Request review, explain rationale, flag concern, request revision, approve, share spec, spec change |
| 🩵 Project Kick-off (`kickoff`) | 7 | Announce project, share timeline, define requirements, assign responsibilities, milestones, sprint goal, close |
| 🟠 Status Updates (`status-update`) | 7 | ステータス更新, 着手済み, テスト中, リリース待ち, 対応済み, 未対応, 保留/検討中 |
| 🔵 Communication Patterns (`communication-patterns`) | 37 | Patterns A–G from the practice guide: acknowledgment, sharing, request, progress, problems, clarification, delegation |

Each frame has: `contextEn`, `japanese`, `kana`, `english`, `register` (neutral / casual-neutral / formal), `vocabIds?: string[]`.

### vocabIds linking
All frames carry `vocabIds` arrays pointing to entries in `office_vocabulary.json`.
This enables the **vocab study block** shown on scenario drill completion.

### Register filter (scenarios page)
Toggle buttons above the frame list: **All / Neutral / Casual / Formal**.

---

## Office Page (`/office`)

### Modes

| Mode | Description |
|---|---|
| **Browse** | Full card list with example sentences, tier badges, context tags. |
| **Flip** | Flip cards (meaning front → Japanese back). Toggle each card individually. |
| **Match** | 10-pair matching game. Japanese column vs English column. Batches through all filtered cards. |
| **Test** | Show meaning → reveal Japanese → **4-button FSRS rating** (Again / Hard / Good / Easy). Each button shows predicted next interval. L0–L5 per card (derived from reps), persisted in localStorage. Due Today filter + amber badge. |

### Test mode SRS (Spaced Repetition — v2, FSRS)

Replaced binary thumbs up/down + fixed level intervals with **full FSRS** (Free Spaced Repetition Scheduler) using the existing `src/lib/fsrs.ts` algorithm.

### 4-button rating (replaces thumbs up/down)

| Button | Label | Effect |
|---|---|---|
| 🔴 | Again | Lapses card, resets to learning state |
| 🟡 | Hard | Reduces stability, shorter interval |
| 🟢 | Good | Standard FSRS progression |
| ⚡ | Easy | Boosts stability, longer interval |

Each button shows the **predicted next interval** inline (e.g. "1 min", "3 days", "2 weeks") computed from the current card state via `fsrs.repeat()`.

### Storage

`CardProgress` extended with optional `fsrs?: FSRSCardData` field:
```typescript
interface FSRSCardData {
  due: string          // ISO string (Date serialized for localStorage)
  stability: number
  difficulty: number
  elapsedDays: number
  scheduledDays: number
  reps: number
  lapses: number
  state: number        // CardState: 0=New, 1=Learning, 2=Review, 3=Relearning
  lastReview?: string
}
```

- **Backwards compatible**: old entries without `fsrs` field start as fresh FSRS New cards on first review
- `level` (0–5) kept in `CardProgress` and derived from `reps` so existing filters/stats continue to work
- `nextReviewDate` still stored as ISO date for the Due Today filter

---

## Drills Page (`/office/drills`)

Production writing drills — user types complete Japanese sentences, validated
against required vocabulary terms from `office_vocabulary.json`.

### Current packs (11 packs / 55 stages)

| Pack | Cluster | Key targets |
|---|---|---|
| Incident Response (障害対応) | incident | 発生 → 影響範囲 → 暫定対応 → 根本原因 → 再発防止 |
| Daily Standup (朝会報告) | standup | 着手 → 進行中 → 完了報告 → 遅延報告 → ブロッカー |
| PR Review (コードレビュー) | tech | レビュー依頼 → コメント → 修正依頼 → 承認 → 本番デプロイ |
| Keigo Escalation (敬語エスカレーション) | keigo | カジュアル返答 → 丁寧な返答 → 依頼の敬語 → 謝罪 → フォーマル書き出し |
| 1-on-1 Meeting (1on1) | 1on1 | 開始 → 順調 → 遅延報告 → 課題の共有 → フィードバック |
| Design Review (デザインレビュー) | tech | レビュー依頼 → 懸念の指摘 → 修正依頼 → 承認 → 仕様共有 |
| Business Email (ビジネスメール) | keigo | 書き出し → 依頼 → 情報共有 → フォローアップ → 結び |
| Meeting Lifecycle (会議の流れ) | meetings | 会議を設定 → アジェンダ共有 → 打ち合わせ開始 → 決定事項まとめ → 議事録共有 |
| Slack & Email (連絡ツールの使い方) | communication | DM → メンション → 返信 → 添付 → 件名を付けて連絡 |
| Tech Workflow (開発の流れ) | tech | バグ発見 → ログ確認 → ブランチ/コミット → テスト/差分 → リリース/リファクタリング |
| **Verb Production (動詞の産出練習)** | verbs | 依頼/提出/検討 → 着手/把握/進める → 議論/合意/決定 → 整理/まとめ/準備 → 見直し/差し戻し/切り戻し |

### Validation logic
- Japanese character guard: `/[ぁ-んァ-ン一-龯]/`
- `required` — all listed vocab IDs must appear (kanji or kana stem match)
- `anyOf` — each group requires at least one term (synonym choice)
- MAX_ATTEMPTS = 2 before forced reveal

---

## Coverage Status (as of 2026-02-20)

```
node scripts/coverage-analyzer.js
```

**Baseline → Session 2 → Session 3 → Session 4:**

| | S1 baseline | S2 end | S3 end | S4 (Phase A/B) | S4 (Phase C) |
|---|---|---|---|---|---|
| Total entries | 200 | 199 (−1 de-dup) | 199 | 224 (+25 A/B) | **240** (+16 C) |
| Covered | 79/200 (40%) | 116/199 (58%) | 131/199 (66%) | 131/224 (58%) | **131/240 (55%)** |
| Drill packs | 7 | 10 | 11 | 11 | 11 |
| Drill stages | — | 50 | 55 | 55 | 55 |
| Scenario packs | 7 | 9 | 9 | 9 | 9 |
| Scenario frames | 46 | 90 | 90 | 90 | 90 |

> **Note on coverage drop S3→S4:** Vocab expansion phases A/B/C added 41 new entries (all uncovered) while covered count stayed at 131. Coverage % dropped from 66% → 58% → 55%. This is expected — vocab expanded first, drills for new entries come next.

**Coverage by category (current — after Phase A/B/C):**

| Category | Coverage | Notes |
|---|---|---|
| `verbs` | 94% (34/36) | ✅ Near-complete (比較する added) |
| `status` | 89% (16/18) | ✅ Strong (至急, 傾向 uncovered) |
| `incident` | 83% (10/12) | ✅ Strong |
| `meetings` | 75% (15/20) | ✅ Strong |
| `tech` | 50% (13/26) | ✅ Decent |
| `project` | 45% (13/29) | ⚠️ Moderate gap (需要 uncovered) |
| `communication` | 36% (9/25) | ⚠️ Large gap — Phase A/C added 10 uncovered entries (報連相, 挨拶, もしかして, 名刺交換, 根拠, 空気を読む, etc.) |
| `keigo` | 35% (11/31) | ⚠️ Gap — 14 new verbs uncovered (Phase B) |
| `hr` | 33% (4/12) | Low priority — 飲み会, 講習 uncovered |
| `time` | 33% (4/12) | Low priority — passive vocab |
| `roles` | 13% (1/8) | Not a priority — see note below |
| `documents` | 9% (1/11) | ⚠️ Gap — Phase C added スライド, グラフ, 表, 参考資料 (all uncovered) |

> **Note on documents and roles:** These categories have low coverage but also low daily production value for a software engineer. Chasing them to inflate the overall % would mean building contrived drills for vocabulary learners mostly need to recognize, not produce. Leave them until there's a real use case.

---

## What 60% Actually Means (and Why It's Not the Goal Anymore)

The **60% target was a guardrail**, not a ceiling. It meant: "don't keep adding vocabulary before covering what you have." That purpose is served at 58%.

**The right question now is not "what gets us to 60%?" — it's "what makes the app better for learners?"**

The answer, in order:

1. **Verb Production drill pack** — verbs are at 54% coverage. Verbs are what make sentences. A learner who can't produce 確認する in context knows nothing. One verb-focused drill pack is higher value than three more scenario packs.

2. **SRS v2** — the current binary thumbs up/down with fixed intervals has been deferred since SRS v1 was built. Every card already in the system is under-scheduled. This is the highest-impact improvement to learning quality for everything already built.

3. **Quality review** — 3 new drill packs and 1 new scenario pack added today have not been ChatGPT reviewed. The communication-patterns pack came directly from the reference doc (low error risk), but the drill model answers need a pass.

4. **Vocab expansion** — only after the above. New entries must come from `docs/japanese-office-vocabulary.md`.

---

## Pattern Practice (from `japanese-office-practice.md`) — ✅ Wired

All 7 communication patterns (A–G, 37 frames) are now in the app as the
`communication-patterns` scenario pack. Frames sourced directly from the
reference practice guide.

| Pattern | Frames | Key phrases |
|---|---|---|
| A — Acknowledgment | 6 | 了解です, 承知いたしました, 確認しました, 拝見しました |
| B — Sharing | 5 | ご共有します, ご報告です, ご参考までに |
| C — Request | 6 | お願いします, ご確認いただけますでしょうか, ご対応よろしく |
| D — Progress | 5 | 完了しました, 対応中です, 予定通り進んでいます |
| E — Problems | 6 | 遅延が発生, 手間取っています, 相談があります |
| F — Clarification | 5 | 確認させてください, ご認識のすり合わせ |
| G — Delegation | 4 | 担当の〜さんに, そちらを優先で |

---

## SRS Implementation (v2 — FSRS) ✅ Done

Replaced the v1 level-based scheduler with the full **FSRS** algorithm using the existing `src/lib/fsrs.ts` (already in the codebase).

See the **Test mode SRS** section above for implementation details.

**What changed vs v1:**
- Fixed-interval level lookup → FSRS stability/difficulty model per card
- Binary thumbs up/down → 4-button rating (Again / Hard / Good / Easy)
- Buttons show predicted next interval inline
- Per-card easiness factor and stability tracked automatically by FSRS
- Backwards-compatible: old progress entries without `fsrs` field start fresh on first review

---

## Reference Doc Gap Analysis

`docs/japanese-office-vocabulary.md` defines **~580 words across 21 categories** as the full target.
The current app has **199 entries across 12 categories** — roughly 1/3 of the stated goal.

### Categories absent from the app (expansion candidates)

| Ref Category | Words | Priority | Notes |
|---|---|---|---|
| High-Frequency Workplace Phrases | 40 | **S** | ★ Highest ROI — add Phase A |
| Keigo — Verb Substitutions | 20 | A | いただく, おっしゃる, ご覧になる — fully missing |
| Business Etiquette & Culture | 20 | A | 名刺交換, 報連相 — needed for workplace culture |
| Presentations & Data | 13 | A | グラフ, スライド, 説明する patterns |
| Customers & Client Relations | 20 | B | 顧客, 取引先, 商談 |
| Finance, Budget & Accounting | 25 | B | 請求書, 精算する — needed for expenses |
| Departments & Divisions | 20 | B | チーム, 開発部 — mostly passive |
| Workplace Facilities & Spaces | 20 | C | Mostly passive |
| Office Supplies & Equipment | 24 | C | Mostly passive |

### Rule going forward
> New entries must come from `docs/japanese-office-vocabulary.md` first.
> Only add entries not in the reference doc for clearly missing modern terms (e.g. new tech tooling).

---

## Architecture Decisions

### Dedicated `OfficeCard` type (schema v2)
Office vocabulary uses its own typed interface instead of the generic
`VocabularyCard`. Structured fields (`active`, `tier`, `contexts`, `category`,
`example`) replace flat tag strings for type safety and simpler filter logic.
`VocabularyCard` is unchanged — zero breakage to the `/verbs` section.

### localStorage only
Office progress (`officeProgress`, `officeFavorites`) is stored client-side.
No database calls. This is intentional — office section is self-contained.

---

## Vocabulary Quality Status

| Pass | Scope | Status | Fixes applied |
|---|---|---|---|
| Vocab Part 1 (001–037) | 37 entries | ✅ Reviewed | office-010 english, office-024 romaji |
| Vocab Part 2 (038–074) | 37 entries | ✅ Reviewed | partOfSpeech ×2, category ×1, romaji ×40 |
| Vocab Part 3 (075–111) | 37 entries | ✅ Reviewed | partOfSpeech ×1, example kana ×1 |
| Vocab Part 4 (112–148) | 37 entries | ✅ Reviewed | DM kana + romaji |
| Vocab Part 5 (149–170) | 22 entries | ✅ Reviewed | meaning order ×1, example alignment ×1 |
| Vocab Part 6 (171–199) | 29 entries | ✅ Reviewed | office-176 added (調整), romaji ×2 (office-178, office-200), meaning fix (office-198) |
| **Vocab Part 7 (201–211)** — Phase A | **11 entries** | ✅ Reviewed | romaji fix (office-209) |
| **Vocab Part 7 (212–225)** — Phase B | **14 entries** | ✅ Reviewed | romaji fix (office-209) |
| **Vocab Part 7 (226–241)** — Phase C | **16 entries** | ✅ Reviewed | romaji fix (office-209) |
| Drills: original 5 packs | incident/standup/PR/keigo/1on1 | ✅ Reviewed | 1on1-s5 model answer fix |
| Drills: design-review + email | 2 packs | ⚠️ Pending | — |
| Drills: meeting + slack + tech | 3 new packs | ⚠️ Pending | — |
| Scenarios: original 5 packs | standup/message/incident/1on1/hr | ✅ Reviewed | std-003 particle, inc-005 particle |
| Scenarios: status-update | 7 frames | ⚠️ Pending | — |
| Scenarios: communication-patterns | 37 frames | ✅ Low risk | Sourced directly from reference doc |

Active/passive distribution: **211 active / 29 passive** (88% active) — all Phase A/B/C entries are active=true.

---

## Development Workflow for Office Dataset Changes

**CRITICAL RULE:** Never directly edit `office_vocabulary.json` or other main dataset files. Always follow this workflow:

### 1. Create a separate "part" file

When adding or modifying office vocabulary entries:

- Create a new part file: `public/seed-data/office_vocabulary_partN.json`
- Use the next available part number (e.g., Part 8, Part 9, etc.)
- Include ONLY the new/modified entries in this file
- Example: `office_vocabulary_part8.json` for entries office-242-270

### 2. Review via ChatGPT

- Copy the part file contents to ChatGPT
- Use the appropriate review prompt from the "ChatGPT Review Protocol" section below
- Get a quality score (1-10) and list of fixes
- Apply all fixes to the part file
- Document the review in the "Review log" section below

### 3. Merge into main dataset

- After ChatGPT review is complete and fixes applied:
  - Merge the part file entries into `office_vocabulary.json`
  - Update entry counts in the header of this doc
  - Update the "Vocabulary Dataset" section with new category counts
  - Commit with detailed message documenting the merge
- Delete the part file (or keep for reference)
- Update the "Vocabulary Quality Status" table to mark as reviewed

### Why this workflow?

- **Quality gate:** Prevents unreviewed data from entering the app
- **Review clarity:** ChatGPT can focus on a small batch (better accuracy)
- **Git history:** Clean commits showing what was added/changed
- **Rollback safety:** Easy to revert a merge if issues found later

### Example: Adding 15 new keigo phrases

```bash
# 1. Create part file
# Edit: public/seed-data/office_vocabulary_part8.json (entries office-242-256)

# 2. Review via ChatGPT
# [paste to ChatGPT, get fixes, apply]

# 3. Merge
# Copy entries from part8 → office_vocabulary.json
# Update this doc (counts, categories, quality status)
git add public/seed-data/office_vocabulary.json docs/office-app-progress.md
git commit -m "vocab: add 15 keigo phrases (office-242-256) — part 8 review complete"
git push
```

---

## ChatGPT Review Protocol

### Phase 1 — Vocabulary batch review

**Review prompt:**
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

### Phase 2 — Drill pack review

**Review prompt:**
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

### Phase 3 — Strategic / architecture review

**Review prompt:**
```
I'm building a Japanese office vocabulary app for a software engineer learning to work in
a Japanese tech company. Here is the current progress doc:

[paste office-app-progress.md]

Review from two angles:
1. Pedagogy — is the learning flow effective? Are there gaps between recognition and production?
2. Architecture — is the data model clean? Any structural debt to address before expanding?

Give 3–5 prioritised recommendations. Be specific about what to build next and why.
```

### Review log

| Date | Phase | Scope | Outcome |
|------|-------|-------|---------|
| 2026-02-18 | Vocab batch | Part 1 (001–037) | 2 fixes |
| 2026-02-18 | Vocab batch | Part 2 (038–074) | 4 fixes + romaji ×40 |
| 2026-02-19 | Vocab batch | Part 3 (075–111) | 2 fixes |
| 2026-02-19 | Vocab batch | Part 4 (112–148) | 1 fix |
| 2026-02-19 | Vocab batch | Part 5 (149–170) | 2 fixes |
| 2026-02-20 | Vocab batch | Part 6 (171–199) | 9.3/10 — office-176 added, romaji ×2, meaning ×1 |
| 2026-02-20 | Vocab batch | Part 7 (201–241) | 9.7/10 — romaji ×1 (office-209) |
| 2026-02-19 | Drill packs | Original 5 packs | 1 fix |
| 2026-02-19 | Scenarios | Original 5 packs | 2 fixes |
| 2026-02-18 | Strategic | Full app | Recommended: depth over breadth → linked drills |
| 2026-02-19 | Strategic | Full app | Validated two-layer linking + drill schema |

---

## Pending / Future

### Done ✅
- [x] SRS v1 — nextReviewDate per mark; Due Today filter + amber badge
- [x] **SRS v2 — FSRS algorithm, 4-button rating (Again/Hard/Good/Easy), interval preview on buttons**
- [x] Production drills with anyOf validation
- [x] 11 drill packs (incident, standup, PR, keigo, 1-on-1, design-review, email, meeting, slack/comms, tech-workflow, **verb-production**)
- [x] 9 scenario packs (standup, message, incident, 1-on-1, hr, design-review, kickoff, status-update, communication-patterns)
- [x] Pattern Practice A–G (37 frames from `japanese-office-practice.md`) wired as scenario pack
- [x] Coverage 40% → 58% → 66% (S3) → 55% (S4 with vocab expansion)
- [x] **Phase A vocab: 11 entries (office-201–211)** — high-freq phrases (個別, 保存, 勤怠, 連携, 箇所, etc.)
- [x] **Phase B vocab: 14 entries (office-212–225)** — keigo verb substitutions (いただく, 拝見する, 伺う, いらっしゃる, etc.)
- [x] **Phase C vocab: 16 entries (office-226–241)** — business culture (報連相, 挨拶, もしかして, 名刺交換, 空気を読む, 飲み会) + presentations (スライド, グラフ, 表, 参考資料, 傾向, 比較する) + status/project (至急, 需要, 講習)
- [x] De-duplication: office-129 / office-176 添付 merged
- [x] Coverage analyzer script

### Priority 1 — Quality (do before next expansion)
- [ ] **ChatGPT review new drill packs** — meeting-lifecycle, slack-comms, tech-workflow, verb-production (4 packs unreviewed)
- [ ] **ChatGPT review design-review + email-lifecycle** — 2 older packs still pending
- [ ] **ChatGPT review scenarios** — status-update (7 frames unreviewed)
- [ ] **Native speaker review** — minimum: drill model answers (1 pass). AI reviewing AI is a quality ceiling.

### Priority 2 — Vocab expansion (from reference doc only)
> **Phase A/B/C complete** — 41 new entries added (199 → 240). Biggest gaps now: `communication` (36%), `keigo` (35%), `documents` (9%). Only expand from `docs/japanese-office-vocabulary.md`.

- [x] **Phase A** ✅: 11 high-freq workplace phrases (office-201–211)
- [x] **Phase B** ✅: 14 keigo verb substitutions (office-212–225)
- [x] **Phase C** ✅: 16 business culture + presentation terms (office-226–241)
- [ ] **Drill packs for Phase A/B/C** — Keigo Verb Production pack (いただく/拝見する/伺う/いらっしゃる); Communication/Culture pack (報連相/挨拶/もしかして/名刺交換/空気を読む); Presentation pack (スライド/グラフ/表/参考資料)
- [ ] **Phase D** (if expanding further): Client relations (10), Finance basics (15)

### Backlog
- [ ] Audio pronunciation (when audio files available)
- [ ] Pattern Practice page (`/office/patterns`) — dedicated page for pattern drills with phrase-level validation (Option 2 upgrade from current scenario pack)
- [ ] Performance review / appraisal lifecycle drill pack
- [ ] Client-facing scenario pack

---

## Session 5 — Major Expansion (2026-02-20)

### Phase D Drill Packs (3 new packs, 10 stages) ⚠️ Pending Review

Created 3 drill packs targeting uncovered Phase A/B/C vocabulary:

**Pack 12: Keigo Production (敬語の産出練習) — 2 packs / 10 stages**
- **File**: `office_drills_part12.json`
- **Target**: 14 Phase B keigo verbs (office-212–225)
- **Structure**:
  - Pack 1: Humble verbs (いたす, 申す, 参る, 拝見する, 伺う) — 5 stages
  - Pack 2: Honorific verbs (いらっしゃる, おっしゃる, なさる, くださる) + hybrid (ご覧いただく) — 5 stages
- **Coverage boost**: Targets 14 uncovered keigo verbs from Phase B

**Pack 13: Communication & Culture (コミュニケーションと文化) — 2 packs / 10 stages**
- **File**: `office_drills_part13.json`
- **Target**: 12 Phase A/C communication entries
- **Structure**:
  - Pack 1: Workplace culture + soft communication (報連相, 挨拶, 名刺交換, もしかして, 空気を読む, 根拠) — 5 stages
  - Pack 2: Daily coordination + acknowledgment phrases (個別, 各自, 社内調整, ご確認ありがとうございます, ご連絡ありがとうございます) — 5 stages
- **Coverage boost**: Targets 12 communication/culture entries from Phase A/C

**Pack 14: Presentations & Data (プレゼンとデータ分析) — 2 packs / 10 stages**
- **File**: `office_drills_part14.json`
- **Target**: 9 Phase C presentation + status entries
- **Structure**:
  - Pack 1: Presentation vocabulary (スライド, 参考資料, グラフ, 表, 傾向, 比較する) — 5 stages
  - Pack 2: Urgent business vocab (至急, 需要, 講習) — 5 stages
- **Coverage boost**: Targets 9 presentation/status entries from Phase C

**Total drill expansion**: 3 parts (6 packs) / 30 stages targeting 35 uncovered entries

### Phase D-F Vocabulary Expansion (120 new entries: office-242–361) ⚠️ Pending Review

Expanded vocabulary from 241 → 361 entries (50% growth) based on reference doc analysis.

**Part 8: High-Frequency Operations (office-242–281, 40 entries)**
- **File**: `office_vocabulary_part8.json`
- **Composition**:
  - Business Verbs (10): 連絡する, 参加する, 出席する, 欠席する, 発表する, 説明する, 更新する, 支払う, 振り込む, 修正する
  - Meetings (8): 議題, プレゼンテーション, 質疑応答, 提案, 定例会議, 臨時会議, 司会, 発言する
  - Time & Scheduling (10): 締め切り (S-tier), 納期, 日程, アポイントメント, 延期する, 前倒しにする, リスケする, 休日出勤, 早退, 定時
  - High-Freq Phrases (12): 給与明細, 支給, 締め, 管理部門, 有休, 在宅, 不備, 現状, 各々, 案件, 整理する, 手配
- **Tier distribution**: S-tier: 3 | A-tier: 25 | B-tier: 12
- **Active/passive**: 34 active / 6 passive

**Part 9: Client Relations & Finance (office-282–321, 40 entries)**
- **File**: `office_vocabulary_part9.json`
- **Composition**:
  - Client Relations (15): お客様, 顧客, 取引先, クレーム, フォローアップ, 顧客対応, アポ, 商談, 見積もり, 納品物, 契約, 提案する, 納品, 受注, 先方
  - Finance & Accounting (15): 請求書, 精算する, 経費, 予算, 領収書, 承認, 申請する, 売上, 利益, コスト, 月次, 四半期, 見積もり書, 支払い, 精算
  - Roles & Titles (10): 部長, 課長, 新入社員, 先輩, 後輩, 同僚, 上司, 担当者, 責任者, 社長
- **Tier distribution**: A-tier: 30 | B-tier: 10
- **Active/passive**: 34 active / 6 passive

**Part 10: Incident Response & Infrastructure (office-322–361, 40 entries)**
- **File**: `office_vocabulary_part10.json`
- **Composition**:
  - Incident / Escalation (12): インシデント, 不具合, 事象, 発生 (S-tier), 原因 (S-tier), 根本原因, 影響なし, 再現, 再現性, 調査中 (S-tier), 恒久対応, 検知
  - Departments (10): 総務部, 人事部, 経理部, 営業部, 企画部, 開発部, 法務部, 広報部, マーケティング部, 購買部
  - Documents (8): 仕様書, 設計書, 契約書, 報告書, 申請書, 書類, 印鑑, 提出先
  - General Vocabulary (10): コミュニケーション, チームワーク, 進める (S-tier), 対処する, 主体性, 責任感, 専門知識, 急ぎの案件, 期待に応える, 締め切りを守る
- **Tier distribution**: S-tier: 4 | A-tier: 22 | B-tier: 12 | C-tier: 2
- **Active/passive**: 26 active / 14 passive

**Total vocab expansion**: 120 entries (241 → 361, +50%)
**Overall tier distribution across 120 entries**: S-tier: 7 (6%) | A-tier: 77 (64%) | B-tier: 34 (28%) | C-tier: 2 (2%)
**Overall active/passive**: 94 active (78%) / 26 passive (22%)

### Session 5 Summary

**Files created (7 total)**:
- `office_drills_part12.json` (2 packs, 10 stages)
- `office_drills_part13.json` (2 packs, 10 stages)
- `office_drills_part14.json` (2 packs, 10 stages)
- `office_vocabulary_part8.json` (40 entries)
- `office_vocabulary_part9.json` (40 entries)
- `office_vocabulary_part10.json` (40 entries)
- Updated: `docs/office-app-progress.md` (this file)

**Key metrics after Session 5** (pending review & merge):
- Vocabulary: 241 → 361 (+120 entries, +50% growth)
- Drill packs: 11 → 14 (+3 packs)
- Drill stages: 55 → 85 (+30 stages)
- Categories expanded: 12 → 15 (added roles, documents subcategories from infrastructure)

**Next steps**:
1. ⚠️ ChatGPT review all Part 8/9/10 vocabulary (120 entries)
2. ⚠️ ChatGPT review all Part 12/13/14 drill packs (30 stages)
3. ✅ After reviews complete → merge into main datasets
4. ✅ Run coverage analyzer to measure new coverage metrics
5. ✅ Update header stats in this doc
