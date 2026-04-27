# Kanji

The kanji study section of LingoMemory. A hub-and-spoke design with one gear at the hub, a focus-mode drill, and three reference surfaces.

---

## Routes

| Path | Purpose |
|---|---|
| `/study/kanji` | **Hub** — 2×2 launcher, today strip (streak + goal + resume), single settings gear |
| `/study/kanji/list` | All kanji in the active dataset, with inline search/sort/status filters |
| `/study/kanji/[id]` | Detail view for one kanji (readings, meanings, vocab) |
| `/study/kanji/vocab-reveal` | **The drill.** Setup screen → swipe-rated card session |
| `/study/kanji/progress` | Coverage dashboard (kanji viewed, vocab mastery, stuck cards) |
| `/study/kanji/vocabulary` | Browse every vocab row across both datasets |
| `/study/kanji/sentences` | Reader / Study / Topics views over example sentences |
| `/study/kanji-practice` | Sequential flashcard browse (linked from the hub gear) |

---

## The drill (`/vocab-reveal`)

A spaced-repetition vocab card game. Two phases: **setup** then **playing**.

### Setup screen

You pick four things, all locked once you start:

| Option | Choices | Effect |
|---|---|---|
| **Cards** | 25 / 50 / 100 / All | Session length (queue size) |
| **Level filter** | `≤` / `≥` × `0..4` | Only cards whose SRS level matches show up |
| **Order** | Teacher / Shuffle / Lowest first | How the queue is built |
| **Reveal** | Hold to reveal / Always show | Whether the English meaning is shown by default |

A live count under the level filter tells you how many cards match before you commit.

### In-game gestures

Tap = browse, swipe = rate. They're separate by design — casual taps don't change levels.

| Gesture | Effect | Level changes? |
|---|---|---|
| **Tap left half** | Previous card / hide reveal | No |
| **Tap right half** | Next card / show reveal | No |
| **Hold ≥280ms** | Reveal English meaning while held | No |
| **Swipe right ≥80px** | Mark *knew it* → ↑ level | **Yes** |
| **Swipe left ≥80px** | Mark *didn't know* → ↓ level | **Yes** |
| **Drag <80px and release** | Snap back, no commitment | No |

Keyboard (silent power-user shortcuts): `→/Space` next, `←` prev, `↑` knew, `↓` didn't, `Esc` end session, `F` toggle fullscreen.

### How "knew it" / "didn't" affects what comes next

Each card has a level 0–4 (0 = new/forgotten, 4 = mastered). Levels map to draw weights:

```
L0 = 1.0    L1 = 0.5    L2 = 0.33    L3 = 0.25    L4 = 0.2
```

So an L0 card is **5× more likely** to be drawn than an L4 card.

In **shuffle** mode, the queue is built by weighted-random sampling with a min-gap rule (a card can't reappear within the last 5 slots). After every rating, `retuneTail` rebuilds the slots **after your current position** using the now-current SRS state — so marking a card "knew" three times in a row drops its weight and it stops dominating the next 50 slots.

In **teacher** and **lowest-first** modes the queue is deterministic and doesn't retune mid-session (by design — those modes are about predictability).

### Decay

Cards untouched for `decayDays` (default 7) drop one level per full window on the next session start. So a 14-day gap demotes everything by ~2 levels and forgotten material naturally resurfaces. Decay is silent — no notification.

### Floor-level-up celebration

When the **minimum level across the active session pool** moves up (e.g. the last L0 card finally graduates to L1), a centered emerald up-arrow with `All ≥ L{N}` pops for ~1 second. Triggers per crossed threshold; works on mobile.

### Session lifecycle

- **Open the drill** → setup form (pre-filled from your last cloud-saved choices).
- **Start session** → queue built, phase = playing, `cfg` saved to cloud-progress.
- **Swipe through cards** → each rating writes SRS state immediately to cloud + local.
- **End session** → return to setup; queue is dropped (every entry rebuilds fresh).
- **Close tab / switch device / come back tomorrow** → setup form re-loads with same options; per-card levels are intact; decay applies if needed; queue is built fresh.

There's **no** "resume where I left off" — the queue isn't persisted on purpose. Cross-device sync of in-flight queues was a tarpit; rebuilding from SRS state always produces a sensible queue. The setup form effectively *is* the resume affordance.

---

## Other sub-pages

- **`/list`** — Grid of all kanji in the active dataset (curated 86 or extended 117). Inline search, sort (teacher / a→z / most vocab), status chips (All / Not viewed / Viewed). Cards link to the per-kanji detail page; viewed cards get a green dot.
- **`/[id]`** — Per-kanji detail. Loads from **both** datasets and unions them (curated wins on collision) so deep links work regardless of which dataset is active.
- **`/progress`** — Coverage dashboard. Shows kanji viewed, vocab KPIs (new / learning / mastered), stuck vocab list, last-N-day activity.
- **`/vocabulary`** — Master vocab browser. Mobile = stacked card per row; desktop = full table. Filters: search, theme, parent kanji, source (kanji-table / theme / both), and an opt-in "auto-discover" toggle that surfaces kanji-substring matches the curated data didn't tag. Each row shows the user's **SRS level** (L0–L4 color-coded chip; "—" for unrated cards), and a **per-level breakdown** above the table doubles as a one-click filter — tap "L0 12" to see only your 12 unrated/forgotten cards. The data here mirrors the same RTDB record the drill writes to, so progress made in the drill is immediately visible in Reference and vice versa.
- **`/sentences`** — Three modes via segmented control:
  - **Reader** — calm vertical column, hairline dividers
  - **Study** — one sentence at a time, hold to reveal English (mirrors the drill)
  - **Topics** — accordion grouped by source / topic

---

## Settings — one gear at the hub, only

There is **one** settings entry point in this section: the gear button on the hub (`/study/kanji`). Sub-pages have no gears. The hub gear holds:

- **Dataset** — Curated (86) or Extended (117). Affects every page.
- **Drill · spaced repetition** — `srsDecayDays` slider (1–30) and `srsQueueMultiplier` slider (×1.0–×3.0).
- **Tools** — link to the sequential flashcard browse.

The drill's **session controls** (cardLimit / order / level filter / reveal) live on the drill's own setup screen — they're not "settings," they're per-session choices.

Listing-page filters (search/sort/status) live inline on the listing page — also not "settings," they're view controls.

---

## Persistence

All learning state and preferences sync via Realtime Database when signed in; everything is also written to localStorage so the app works offline.

| Data | Storage | Survives reload | Survives tab close | Cross-device (signed in) |
|---|---|---|---|---|
| Per-card SRS state (level, lastSeen, reviewCount) | localStorage + RTDB at `users/{uid}/preferences/vocabRevealSrs` | ✅ | ✅ | ✅ — written on **every** rating, no debounce |
| Drill cfg (cardLimit, order, levelOp, levelValue, holdToReveal) | localStorage + RTDB at `users/{uid}/progress/extended-kanji-vocab-reveal-config` | ✅ | ✅ | ✅ |
| Hub settings (decay days, queue multiplier) | settings context → RTDB | ✅ | ✅ | ✅ |
| Dataset choice | localStorage + RTDB at `users/{uid}/progress/kanji-dataset-choice` | ✅ | ✅ | ✅ |
| Kanji "viewed" progress (green dots on listing) | localStorage + RTDB at `users/{uid}/progress/extended-kanji-practice-progress` | ✅ | ✅ | ✅ |
| First-open help overlay dismissed | localStorage only | ✅ | ✅ | ❌ (per-device on purpose) |
| Drill queue + position | **not persisted** — rebuilt fresh every entry | — | — | — |
| Listing inline filters (search/sort/status) | React state only | ❌ | ❌ | ❌ |

### Mobile-specific notes

- **iOS Safari ITP**: localStorage and IndexedDB may be evicted after 7 days of inactivity. SRS state is reconstructed from RTDB on next sign-in, so no permanent loss.
- **Offline ratings**: written locally instantly; cloud retry happens on the next rating. Multi-device-while-offline is the only window for race conditions; per-card `lastSeen` merge resolves it on reconnect.
- **PWA installed mode**: stronger persistence (less aggressive eviction) — recommended for daily use.
- **Background tab suspension on iOS**: fine — every rating is in flight the moment you swipe (no debounce window to lose).

---

## Architecture

### Files in this folder

```
src/app/study/kanji/
├── page.tsx                ─ Hub (2×2 launcher + today strip)
├── README.md               ─ This file
├── list/page.tsx           ─ Kanji listing grid + inline filters
├── [id]/page.tsx           ─ Per-kanji detail
├── vocab-reveal/page.tsx   ─ The drill (setup + game + celebration)
├── progress/page.tsx       ─ Coverage dashboard
├── vocabulary/page.tsx     ─ Master vocab browser
├── sentences/page.tsx      ─ Reader / Study / Topics
├── lessons/                ─ Per-lesson views (reference)
├── prerequisite/           ─ Prerequisite kanji views
├── confusables/            ─ Lookalike-kanji views
├── themes/                 ─ Themed vocab views
└── answer-keys/            ─ Reference answer keys
```

### Supporting modules

- **`src/services/vocab-reveal-srs.service.ts`** — SRS state management. `load`, `rate`, `applyDecay`, `persistLocal`, `scheduleFlush` (now immediate, no debounce). RTDB merge on load picks per-card newer-by-`lastSeen`.
- **`src/services/cloud-progress.service.ts`** — Generic local↔cloud sync used for drill cfg, dataset choice, kanji viewed progress. Last-write-wins at the document level; cloud writes debounced 10 s.
- **`src/types/vocab-reveal-srs.ts`** — Tunable constants: `WEIGHTS`, `MIN_GAP`, `DECAY_DAYS`, `QUEUE_MULTIPLIER`, level cap.
- **`src/hooks/use-kanji-dataset.tsx`** — Context provider for the dataset toggle. Persists via cloud-progress.
- **`src/hooks/use-kanji-list-filters.tsx`** — Context for listing filters (search, sort, status). Not persisted.
- **`src/components/kanji/settings-dialog.tsx`** — Hub gear (`KanjiSettingsButton`).
- **`src/components/kanji/contextual-switch.tsx`** — Sub-page header switcher (Kanji↔Extended on listing, Vocab↔Sentence on the others).
- **`src/lib/extended-kanji/stats.ts`** — KPI helpers used by hub + dashboard.
- **`src/lib/extended-kanji/readings.ts`** — Reading-style classification (on / kun / mixed) + chip styling.

### Data files (`public/seed-data/extended-kanji/`)

| File | What it holds |
|---|---|
| `kanji.json` | Curated dataset (86 kanji with readings, meanings, vocab) |
| `prerequisite-detailed.json` | Extended dataset (117 kanji) |
| `vocabulary.json` | Master vocab corpus, deduplicated by (word, reading) |
| `sentences.json` | Part-1 main sentences + Part-1 extras + Part-3 topic groups |
| `themes.json`, `lessons.json` | Theme/lesson grouping metadata |
| `answer_keys.json`, `study_aids.json` | Reference materials |

---

## Common edits

**Add a new tunable to the SRS algorithm**
1. Add the field to `UserSettings` in `src/types/settings.ts` + `DEFAULT_SETTINGS`.
2. Mirror it in `cloudToSettings` and `getLocalSettings` in `src/services/settings.service.ts` (with a sensible fallback).
3. Add a slider/control to `DrillSrsSection` in `src/components/kanji/settings-dialog.tsx`.
4. Read it via `useSettings()` in `vocab-reveal/page.tsx` and pass to `buildQueue` / `applyDecay`.

**Add a new order mode**
1. Extend `OrderMode` union in `vocab-reveal/page.tsx`.
2. Add the case in `buildQueue` (and decide if `retuneTail` should re-fire — by default it only does for `shuffle`).
3. Add the radio card in `SetupScreen`'s order section.

**Add a new sub-page**
1. Create `src/app/study/kanji/{name}/page.tsx`.
2. Render `<Header />` + a `SubPageHeader` (copy from `list/page.tsx`) so it gets the Hub link + contextual switch.
3. Add to `pathToContext` in `src/components/kanji/contextual-switch.tsx` if it should participate in the variant switcher.
4. Optionally surface from the hub tile grid (`src/app/study/kanji/page.tsx`).

**Change the celebration trigger**
- Logic lives at the end of `rateAndAdvance` in `vocab-reveal/page.tsx` — uses `minLevelOf(active, next)` against `minLevelRef`.
- The visual is `LevelUpCelebration` near the bottom of the same file.

---

## Known limitations

- **No "session complete" screen.** When you finish slot N/N the index wraps silently to slot 0. Worth adding a celebration card at session end (`promoted X · demoted Y · accuracy Z%`) eventually.
- **No "graduate / retire" mechanic.** L4 cards stay in the pool with weight 0.2 forever. Some SRS systems remove them; this one doesn't.
- **No mid-session level changes for teacher/lowest modes.** By design — those modes are predictable. Switch to shuffle if you want the queue to react to your ratings.
- **Listing filters don't persist.** Reload = reset. Considered a feature (filters are transient view state); easy to change if you'd rather they survive.
- **iOS Safari ITP edge case.** Local cache may evict after 7 idle days; RTDB recovers it on next sign-in.

---

## Quick test on your phone

1. Open `https://<your-deploy>/study/kanji/vocab-reveal` on phone.
2. Pick `cards = 25`, `level ≤ 0`, `order = Lowest first`. Hit **Start session**.
3. Swipe right through cards — green tint should grow with the drag, card flies off past 80px.
4. When the last L0 card promotes to L1, a green up-arrow with "All ≥ L1" pops centered for ~1s.
5. Pull up the same URL on laptop. Open setup form — pre-filled with your last choices. Per-card levels reflect what you just rated.

If steps 3–5 work end-to-end, persistence + sync + gestures + celebration are all healthy.
