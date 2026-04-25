#!/usr/bin/env python3
"""Parse KANJI_REFERENCE.md into structured JSON for the /study/extended-kanji feature.

Emits to public/seed-data/extended-kanji/:
  - kanji.json           per-kanji entries (readings, vocab, sentences, extra sections)
  - lessons.json         36 lessons with dates, kanji taught, textbook pages
  - vocabulary.json      flattened vocab rows from all PART 1 tables
  - sentences.json       PART 1 per-kanji + PART 3 topic-grouped
  - answer_keys.json     PART 4 textbook answer keys by page
  - study_aids.json      PART 5 confusables, special readings, verb stems, dialog phrases
  - prerequisite.json    PART 6 prerequisite kanji
  - themes.json          PART 2 thematic vocabulary master lists

Re-run idempotently whenever KANJI_REFERENCE.md changes.
"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE = REPO_ROOT / "KANJI_REFERENCE.md"
OUT_DIR = REPO_ROOT / "public" / "seed-data" / "extended-kanji"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Helpers


def read_source() -> list[str]:
    return SOURCE.read_text(encoding="utf-8").splitlines()


def split_parts(lines: list[str]) -> dict[str, tuple[int, int]]:
    """Return line-range for each top-level `# PART N —` block plus preamble."""
    markers: list[tuple[str, int]] = []
    for i, line in enumerate(lines):
        m = re.match(r"^# (PART \d+ — .+)$", line)
        if m:
            markers.append((m.group(1), i))
    ranges: dict[str, tuple[int, int]] = {}
    # Preamble = everything before PART 1
    if markers:
        ranges["PREAMBLE"] = (0, markers[0][1])
    for idx, (name, start) in enumerate(markers):
        end = markers[idx + 1][1] if idx + 1 < len(markers) else len(lines)
        ranges[name] = (start, end)
    return ranges


def parse_table(lines: list[str], start: int) -> tuple[list[dict[str, str]], int]:
    """Parse a markdown table starting at `start`. Returns rows + next line idx.

    Skips leading blank lines so callers can pass the line immediately after a heading.
    """
    # Skip blank lines
    while start < len(lines) and not lines[start].strip():
        start += 1
    if start >= len(lines):
        return [], start
    # Expect header row then separator then data rows.
    header_line = lines[start].strip()
    if not header_line.startswith("|") or start + 1 >= len(lines):
        return [], start
    headers = [h.strip() for h in header_line.strip("|").split("|")]
    sep = lines[start + 1].strip()
    if not re.match(r"^\|[\s\-:|]+\|$", sep):
        return [], start
    rows: list[dict[str, str]] = []
    i = start + 2
    while i < len(lines):
        ln = lines[i]
        if not ln.strip().startswith("|"):
            break
        cells = [c.strip() for c in ln.strip().strip("|").split("|")]
        # Pad / truncate to header length (some tables have extra `|` at end — e.g. 本 counter table)
        if len(cells) < len(headers):
            cells.extend([""] * (len(headers) - len(cells)))
        if len(cells) > len(headers):
            cells = cells[: len(headers)]
        rows.append({h: c for h, c in zip(headers, cells)})
        i += 1
    return rows, i


# ---------------------------------------------------------------------------
# Lesson Timeline parser (preamble section)

LESSON_DASH = "・"


def parse_lesson_timeline(lines: list[str]) -> list[dict]:
    """Find the `## Lesson Timeline` table and parse it."""
    # Locate header row of the table.
    start = None
    for i, line in enumerate(lines):
        if line.strip() == "| # | Date | Kanji | Source |":
            start = i
            break
    if start is None:
        raise RuntimeError("Lesson Timeline table not found")
    rows, _ = parse_table(lines, start)
    lessons = []
    for row in rows:
        kanji_field = row.get("Kanji", "").strip()
        # strip parenthetical notes like "(review 一・二・三)" but keep taught kanji
        main_part = re.sub(r"\s*\(.*?\)\s*", " ", kanji_field).strip()
        taught_chars: list[str] = []
        review_chars: list[str] = []
        if main_part and main_part != "—" and main_part.lower() != "practice" and main_part.lower() != "(review)" and main_part.lower() != "(practice)":
            taught_chars = [
                c.strip() for c in main_part.split(LESSON_DASH) if c.strip() and len(c.strip()) == 1
            ]
        # Review kanji inside parens
        review_match = re.search(r"\(review ([^\)]+)\)", kanji_field)
        if review_match:
            review_chars = [
                c.strip()
                for c in review_match.group(1).split(LESSON_DASH)
                if c.strip() and len(c.strip()) == 1
            ]
        source_raw = row.get("Source", "").strip()
        source = None if source_raw in ("—", "") else source_raw
        textbook_page = None
        if source:
            m = re.search(r"p\.?\s*(\d+)", source)
            if m:
                textbook_page = int(m.group(1))
        lessons.append(
            {
                "number": int(row["#"]),
                "date": row["Date"].strip(),
                "kanjiChars": taught_chars,
                "reviewKanjiChars": review_chars,
                "source": source,
                "textbookPage": textbook_page,
                "isPracticeOnly": not taught_chars,
                "rawKanjiField": kanji_field,
            }
        )
    return lessons


# ---------------------------------------------------------------------------
# PART 1 — per-kanji entries

# H2 examples: "## 大 — big", "## 一 — one / 二 — two / 三 — three"
H2_RE = re.compile(r"^## ([^\s—][^—]*) — (.+)$")
H3_RE = re.compile(r"^### (.+)$")
BULLET_LABEL_RE = re.compile(r"^-\s*\*\*(Kun'yomi|On'yomi|Meaning):\*\*\s*(.+)$")
# sentence bullet: `- JP — *EN*` (em-dash separator + italics for EN)
SENTENCE_BULLET_RE = re.compile(r"^-\s*(.+?)\s+—\s*\*(.+?)\*\s*$")
# sometimes the EN gloss is in parentheses without italics e.g. `— *(meal phrases)*`
SUBKANJI_H3_RE = re.compile(r"^### ([^\s(（]+)\s*[\(（]([^\)）]+)[\)）]\s*$")


def parse_readings(text: str) -> list[str]:
    """Split reading text like 'おお (きい)' or 'ダイ、タイ' into tokens."""
    # Teacher notation: separators are Japanese comma 、 and Western comma ,
    parts = re.split(r"[、,]", text)
    return [p.strip() for p in parts if p.strip()]


def parse_part1(lines: list[str], part_range: tuple[int, int]) -> list[dict]:
    """Parse PART 1 — Kanji Dictionary into a flat list of entries.

    Bundled headings (e.g. `## 一 — one / 二 — two / 三 — three`) expand into N
    entries, each carrying the shared vocab/sentences.
    """
    start, end = part_range
    entries: list[dict] = []
    i = start
    order_counter = 0
    while i < end:
        line = lines[i]
        m = H2_RE.match(line)
        if not m:
            i += 1
            continue
        header_raw = m.group(1).strip()
        meaning_raw = m.group(2).strip()
        # Bundled case: "一 — one / 二 — two / 三 — three"
        bundled = " / " in f"{header_raw} — {meaning_raw}"
        bundle: list[tuple[str, str]] = []
        if bundled:
            # Rebuild full heading and split on " / "
            full = f"{header_raw} — {meaning_raw}"
            for chunk in full.split(" / "):
                cm = re.match(r"^\s*(\S)\s*—\s*(.+?)\s*$", chunk)
                if cm:
                    bundle.append((cm.group(1), cm.group(2)))
        else:
            bundle = [(header_raw, meaning_raw)]

        # Collect body until next H2 or end
        j = i + 1
        while j < end and not H2_RE.match(lines[j]):
            j += 1
        body = lines[i + 1 : j]

        # Parse body into per-kanji readings (for bundled) + shared sections
        per_kanji_readings: dict[str, dict[str, list[str]]] = {}
        shared_meanings: list[str] = []
        shared_kun: list[str] = []
        shared_on: list[str] = []
        vocabulary: list[dict] = []
        example_sentences: list[dict] = []
        extra_sections: list[dict] = []

        # Walk body, detecting H3 sub-kanji blocks vs data sections
        k = 0
        current_sub_kanji: str | None = None
        while k < len(body):
            bline = body[k]
            h3 = H3_RE.match(bline)
            # Sub-heading like "### 一 (one)"
            sub_km = SUBKANJI_H3_RE.match(bline) if h3 else None
            if sub_km:
                current_sub_kanji = sub_km.group(1).strip()
                per_kanji_readings.setdefault(
                    current_sub_kanji, {"kun": [], "on": [], "meaning": []}
                )
                k += 1
                continue
            if h3:
                section_title = h3.group(1).strip()
                # Reset sub-kanji context — shared section begins
                current_sub_kanji = None
                # Determine section kind
                title_l = section_title.lower()
                if title_l.startswith("vocabulary"):
                    rows, next_k = parse_table(body, k + 1)
                    # Sometimes tables have extra cells; filter to schema
                    for r in rows:
                        word = r.get("Word", "").strip()
                        reading = r.get("Reading", "").strip()
                        meaning_col = r.get("Meaning", "").strip()
                        if not word:
                            continue
                        vocabulary.append(
                            {"word": word, "reading": reading, "meaning": meaning_col}
                        )
                    k = next_k
                    continue
                if title_l.startswith("example sentence"):
                    # Collect sentence bullets
                    m2 = k + 1
                    sents: list[dict] = []
                    while m2 < len(body):
                        bl = body[m2].rstrip()
                        if not bl.strip():
                            m2 += 1
                            continue
                        if bl.startswith("###") or bl.startswith("## "):
                            break
                        if bl.startswith("- "):
                            sm = SENTENCE_BULLET_RE.match(bl)
                            if sm:
                                sents.append(
                                    {"japanese": sm.group(1).strip(), "english": sm.group(2).strip()}
                                )
                            else:
                                # fallback: just the Japanese line
                                jp_only = bl[2:].strip()
                                sents.append({"japanese": jp_only, "english": ""})
                            m2 += 1
                            continue
                        # Non-bullet line — end of section
                        break
                    example_sentences.extend(sents)
                    k = m2
                    continue
                # Any other H3 → capture as "extraSection" (table, bullets, or mixed)
                section_content = _capture_extra_section(body, k + 1)
                extra_sections.append(
                    {"title": section_title, **section_content}
                )
                k = section_content["_nextOffset"]
                # strip internal offset from stored version
                del extra_sections[-1]["_nextOffset"]
                continue
            # Bullet labels within a sub-kanji or the top-level block
            bm = BULLET_LABEL_RE.match(bline)
            if bm:
                label = bm.group(1)
                value = bm.group(2).strip()
                tokens = parse_readings(value)
                target_kun, target_on, target_mean = None, None, None
                if current_sub_kanji:
                    per_kanji_readings.setdefault(
                        current_sub_kanji, {"kun": [], "on": [], "meaning": []}
                    )
                    bucket = per_kanji_readings[current_sub_kanji]
                    if label == "Kun'yomi":
                        bucket["kun"] = tokens
                    elif label == "On'yomi":
                        bucket["on"] = tokens
                    else:
                        bucket["meaning"] = [value]
                else:
                    if label == "Kun'yomi":
                        shared_kun = tokens
                    elif label == "On'yomi":
                        shared_on = tokens
                    else:
                        shared_meanings = [value]
                k += 1
                continue
            k += 1

        # Handle case 190-219: bundled (一/二/三) with shared vocab — for each chunk,
        # use per_kanji readings if present else shared
        for kanji_char, kanji_meaning in bundle:
            order_counter += 1
            readings = per_kanji_readings.get(kanji_char, {})
            kun = readings.get("kun") or shared_kun
            on = readings.get("on") or shared_on
            entry_meaning = (
                readings.get("meaning", [kanji_meaning])[0]
                if readings.get("meaning")
                else kanji_meaning
            )
            entries.append(
                {
                    "id": f"ext_kanji_{kanji_char}",
                    "kanji": kanji_char,
                    "meaning": entry_meaning,
                    "kunReadings": kun,
                    "onReadings": on,
                    "vocabulary": vocabulary,
                    "exampleSentences": example_sentences,
                    "extraSections": extra_sections,
                    "orderInReference": order_counter,
                    "bundledWith": [c for c, _ in bundle if c != kanji_char] or None,
                }
            )

        i = j
    return entries


def _capture_extra_section(body: list[str], start: int) -> dict:
    """Capture an H3 sub-section that's neither Vocabulary nor Example sentences.
    Returns a dict with either {'type':'table','headers':..., 'rows':...} or
    {'type':'bullets','items':[...]} or {'type':'mixed','blocks':[...]}.
    Includes '_nextOffset' for caller to advance.
    """
    i = start
    blocks: list[dict] = []
    while i < len(body):
        line = body[i]
        if line.startswith("## ") or line.startswith("### "):
            break
        stripped = line.strip()
        # Markdown thematic break — end of section
        if stripped == "---":
            break
        if stripped.startswith("|"):
            # Table block
            rows, next_i = parse_table(body, i)
            # Reconstruct from original header
            header_row = body[i].strip().strip("|").split("|")
            headers = [h.strip() for h in header_row]
            blocks.append({"type": "table", "headers": headers, "rows": rows})
            i = next_i
            continue
        if stripped.startswith("- "):
            items: list[dict] = []
            while i < len(body) and body[i].lstrip().startswith("- "):
                bl = body[i].lstrip()[2:].rstrip()
                sm = SENTENCE_BULLET_RE.match(f"- {bl}")
                if sm:
                    items.append({"text": sm.group(1).strip(), "gloss": sm.group(2).strip()})
                else:
                    items.append({"text": bl, "gloss": ""})
                i += 1
            blocks.append({"type": "bullets", "items": items})
            continue
        if not stripped:
            i += 1
            continue
        # Prose line
        blocks.append({"type": "prose", "text": stripped})
        i += 1

    if len(blocks) == 1:
        result = dict(blocks[0])
    else:
        result = {"type": "mixed", "blocks": blocks}
    result["_nextOffset"] = i
    return result


# ---------------------------------------------------------------------------
# PART 2 — Thematic vocabulary master lists

def parse_part2(lines: list[str], part_range: tuple[int, int]) -> list[dict]:
    start, end = part_range
    themes: list[dict] = []
    i = start
    while i < end:
        line = lines[i]
        m = re.match(r"^## (.+)$", line)
        if m:
            theme_name = m.group(1).strip()
            j = i + 1
            while j < end and not lines[j].strip().startswith("|") and not lines[j].startswith("## "):
                j += 1
            if j < end and lines[j].strip().startswith("|"):
                rows, next_i = parse_table(lines, j)
                themes.append({"theme": theme_name, "rows": rows})
                i = next_i
                continue
        i += 1
    return themes


# ---------------------------------------------------------------------------
# PART 3 — Topic-grouped sentences

def parse_part3(lines: list[str], part_range: tuple[int, int]) -> list[dict]:
    start, end = part_range
    groups: list[dict] = []
    i = start
    while i < end:
        line = lines[i]
        m = re.match(r"^## (.+)$", line)
        if m:
            topic = m.group(1).strip()
            j = i + 1
            items: list[str] = []
            while j < end and not lines[j].startswith("## ") and not lines[j].startswith("# "):
                bl = lines[j].rstrip()
                if bl.startswith("- "):
                    items.append(bl[2:].strip())
                j += 1
            groups.append({"topic": topic, "sentences": items})
            i = j
            continue
        i += 1
    return groups


# ---------------------------------------------------------------------------
# PART 4 — Textbook answer keys

PAGE_H2_RE = re.compile(r"^## P\.(\d+)\s*\(([^)]+)\)\s*$")


def parse_part4(lines: list[str], part_range: tuple[int, int]) -> list[dict]:
    start, end = part_range
    pages: list[dict] = []
    i = start
    while i < end:
        line = lines[i]
        m = PAGE_H2_RE.match(line)
        if m:
            page = f"P.{m.group(1)}"
            context = m.group(2).strip()
            j = i + 1
            items: list[str] = []
            subsections: list[dict] = []
            current_sub_title: str | None = None
            current_sub_items: list[str] = []
            while j < end and not PAGE_H2_RE.match(lines[j]) and not lines[j].startswith("# "):
                bl = lines[j].rstrip()
                bl_stripped = bl.strip()
                if not bl_stripped or bl_stripped == "---":
                    j += 1
                    continue
                # Bold prose like "**Reverse (hiragana → number):**"
                bold_m = re.match(r"^\*\*(.+?):\*\*\s*$", bl_stripped)
                if bold_m:
                    # flush previous subsection
                    if current_sub_title is not None:
                        subsections.append({"title": current_sub_title, "items": current_sub_items})
                    current_sub_title = bold_m.group(1).strip()
                    current_sub_items = []
                    j += 1
                    continue
                # Prose line (e.g. "Review kanji block: 休・飲・聞・何・話")
                if not bl.startswith("- "):
                    if current_sub_title is not None:
                        current_sub_items.append(bl_stripped)
                    else:
                        items.append(bl_stripped)
                    j += 1
                    continue
                # Bullet item
                bullet = bl[2:].strip()
                if current_sub_title is not None:
                    current_sub_items.append(bullet)
                else:
                    items.append(bullet)
                j += 1
            if current_sub_title is not None:
                subsections.append({"title": current_sub_title, "items": current_sub_items})
            pages.append(
                {
                    "page": page,
                    "context": context,
                    "items": items,
                    "subSections": subsections,
                }
            )
            i = j
            continue
        i += 1
    return pages


# ---------------------------------------------------------------------------
# PART 5 — Study aids

def parse_part5(lines: list[str], part_range: tuple[int, int]) -> dict:
    start, end = part_range
    result: dict = {
        "confusables": [],
        "specialReadings": [],
        "verbStems": [],
        "sectionLabels": [],
        "dialogPhrases": {},
    }
    # Walk H2 sections
    i = start
    while i < end:
        line = lines[i]
        m = re.match(r"^## (.+)$", line)
        if not m:
            i += 1
            continue
        section = m.group(1).strip()
        # Collect body until next H2
        j = i + 1
        while j < end and not re.match(r"^## ", lines[j]) and not lines[j].startswith("# "):
            j += 1
        body = lines[i + 1 : j]

        if section.startswith("Confusable"):
            result["confusables"] = _parse_confusables_body(body)
        elif section.startswith("Special readings"):
            result["specialReadings"] = _parse_special_readings_body(body)
        elif section.startswith("Verb stems"):
            result["verbStems"] = _parse_bullet_groups(body)
        elif section.startswith("Section labels"):
            # Single table with lesson/page/topic
            for idx, bl in enumerate(body):
                if bl.strip().startswith("|"):
                    rows, _ = parse_table(body, idx)
                    result["sectionLabels"] = rows
                    break
        elif section.startswith("Dialog phrases"):
            result["dialogPhrases"] = _parse_dialog_phrases_body(body)
        i = j
    return result


def _parse_confusables_body(body: list[str]) -> list[dict]:
    out: list[dict] = []
    current_context: str | None = None
    i = 0
    while i < len(body):
        line = body[i]
        stripped = line.strip()
        if not stripped:
            i += 1
            continue
        if stripped.startswith("From lesson"):
            current_context = stripped.rstrip(":")
            i += 1
            continue
        if stripped.startswith("|"):
            rows, next_i = parse_table(body, i)
            out.append({"context": current_context, "group": rows})
            i = next_i
            continue
        # Prose note (e.g. 木/本 teacher's note) — keep under current context
        out.append({"context": current_context, "note": stripped})
        i += 1
    return out


def _parse_special_readings_body(body: list[str]) -> list[dict]:
    out: list[dict] = []
    current_ctx: str | None = None
    for line in body:
        s = line.strip()
        if s.startswith("From lesson"):
            current_ctx = s.rstrip(":")
            continue
        if s.startswith("- "):
            out.append({"context": current_ctx, "entry": s[2:].strip()})
    return out


def _parse_bullet_groups(body: list[str]) -> list[dict]:
    out: list[dict] = []
    current_ctx: str | None = None
    for line in body:
        s = line.strip()
        if s.startswith("From lesson"):
            current_ctx = s.rstrip(":")
            continue
        if s.startswith("- "):
            out.append({"context": current_ctx, "item": s[2:].strip()})
    return out


def _parse_dialog_phrases_body(body: list[str]) -> dict:
    groups: dict[str, list[dict]] = {}
    current: str | None = None
    for line in body:
        s = line.strip()
        if s.startswith("### "):
            current = s[4:].strip()
            groups.setdefault(current, [])
            continue
        if not current:
            continue
        if s.startswith("- "):
            sm = SENTENCE_BULLET_RE.match(s)
            if sm:
                groups[current].append({"jp": sm.group(1).strip(), "en": sm.group(2).strip()})
            else:
                groups[current].append({"jp": s[2:].strip(), "en": ""})
    return groups


# ---------------------------------------------------------------------------
# PART 6 — Prerequisite kanji

def parse_part6(lines: list[str], part_range: tuple[int, int]) -> list[dict]:
    start, end = part_range
    # Find the single table
    for i in range(start, end):
        if lines[i].strip().startswith("| Kanji |"):
            rows, _ = parse_table(lines, i)
            return rows
    return []


# ---------------------------------------------------------------------------
# Assembly


def build_vocabulary(
    kanji_entries: list[dict], themes: list[dict]
) -> list[dict]:
    """Merge every vocab row from per-kanji tables and PART 2 theme tables.

    Deduplicates by (word, reading). Each row is tagged with its sources so the
    UI can show which kanji introduced it and which themes it appears under.
    """
    out: dict[tuple[str, str], dict] = {}
    for entry in kanji_entries:
        for v in entry["vocabulary"]:
            key = (v["word"], v["reading"])
            row = out.setdefault(
                key,
                {
                    "word": v["word"],
                    "reading": v["reading"],
                    "meaning": v["meaning"],
                    "parentKanji": [],
                    "themes": [],
                },
            )
            if entry["kanji"] not in row["parentKanji"]:
                row["parentKanji"].append(entry["kanji"])
    for theme in themes:
        for row in theme["rows"]:
            word = row.get("Kanji") or row.get("Word") or ""
            reading = row.get("Reading", "")
            meaning = row.get("Meaning") or row.get("Day") or ""
            key = (word, reading)
            if not word:
                continue
            dst = out.setdefault(
                key,
                {
                    "word": word,
                    "reading": reading,
                    "meaning": meaning,
                    "parentKanji": [],
                    "themes": [],
                },
            )
            if theme["theme"] not in dst["themes"]:
                dst["themes"].append(theme["theme"])
            if not dst["meaning"]:
                dst["meaning"] = meaning
    return list(out.values())


def build_sentences(kanji_entries: list[dict], part3_groups: list[dict]) -> dict:
    """Collect every sentence: PART 1 main, PART 1 extraSection bullets, PART 3."""
    part1: list[dict] = []
    part1_extras: list[dict] = []

    for entry in kanji_entries:
        for s in entry["exampleSentences"]:
            part1.append(
                {
                    "japanese": s["japanese"],
                    "english": s["english"],
                    "parentKanji": entry["kanji"],
                    "source": "part1",
                }
            )
        # Pull sentence-like bullets out of extraSections so they appear in the
        # master sentence list too (not just on the parent kanji's detail page).
        for section in entry["extraSections"]:
            buckets: list[dict] = []
            if section.get("type") == "bullets":
                buckets.append(section)
            elif section.get("type") == "mixed":
                buckets.extend(b for b in section["blocks"] if b.get("type") == "bullets")
            for bucket in buckets:
                for item in bucket.get("items", []):
                    text = item.get("text", "")
                    gloss = item.get("gloss", "")
                    # Treat as a sentence if it ends with JP punctuation or has a gloss.
                    if gloss or any(ch in text for ch in "。？！"):
                        part1_extras.append(
                            {
                                "japanese": text,
                                "english": gloss,
                                "parentKanji": entry["kanji"],
                                "sectionTitle": section["title"],
                                "source": "part1_extras",
                            }
                        )

    return {"part1": part1, "part1Extras": part1_extras, "part3": part3_groups}


def enrich_kanji_with_lesson(kanji_entries: list[dict], lessons: list[dict]) -> None:
    # Map kanji char → earliest lesson where it's taught (not review)
    first_taught: dict[str, dict] = {}
    for lesson in lessons:
        for c in lesson["kanjiChars"]:
            if c not in first_taught:
                first_taught[c] = lesson
    for entry in kanji_entries:
        lesson = first_taught.get(entry["kanji"])
        if lesson:
            entry["lessonNumber"] = lesson["number"]
            entry["lessonDate"] = lesson["date"]
            entry["textbookPage"] = lesson["textbookPage"]
            entry["lessonSource"] = lesson["source"]
        else:
            entry["lessonNumber"] = None
            entry["lessonDate"] = None
            entry["textbookPage"] = None
            entry["lessonSource"] = None


def write_json(path: Path, payload) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  wrote {path.relative_to(REPO_ROOT)}  ({path.stat().st_size:,} bytes)")


# ---------------------------------------------------------------------------
# Main

def main() -> None:
    print(f"Parsing {SOURCE.relative_to(REPO_ROOT)}")
    lines = read_source()
    ranges = split_parts(lines)

    # Preamble lesson timeline
    lessons = parse_lesson_timeline(lines[: ranges["PART 1 — Kanji Dictionary (by lesson order)"][0]])

    # PART 1
    kanji_entries = parse_part1(lines, ranges["PART 1 — Kanji Dictionary (by lesson order)"])
    enrich_kanji_with_lesson(kanji_entries, lessons)

    # Link lessons → kanji entry IDs
    by_char = {e["kanji"]: e["id"] for e in kanji_entries}
    for lesson in lessons:
        lesson["kanjiIds"] = [by_char[c] for c in lesson["kanjiChars"] if c in by_char]
        lesson["reviewKanjiIds"] = [by_char[c] for c in lesson["reviewKanjiChars"] if c in by_char]

    # PART 2
    themes = parse_part2(lines, ranges["PART 2 — Quick Vocabulary Master List"])
    # PART 3
    part3 = parse_part3(lines, ranges["PART 3 — Key Example Sentences (by Topic)"])
    # PART 4
    answer_keys = parse_part4(lines, ranges["PART 4 — Textbook Practice Answer Keys"])
    # PART 5
    study_aids = parse_part5(lines, ranges["PART 5 — Study Aids & Teacher Notes"])
    # PART 6
    prerequisite = parse_part6(lines, ranges["PART 6 — Prerequisite Kanji (used in compounds, not newly taught)"])

    # Derived
    vocabulary = build_vocabulary(kanji_entries, themes)
    sentences = build_sentences(kanji_entries, part3)

    now = datetime.now(timezone.utc).isoformat()
    meta = {
        "source": "KANJI_REFERENCE.md",
        "generatedAt": now,
        "lessonsCount": len(lessons),
        "kanjiCount": len(kanji_entries),
        "vocabularyCount": len(vocabulary),
        "sentencesPart1": len(sentences["part1"]),
        "sentencesPart1Extras": len(sentences["part1Extras"]),
        "sentencesPart3Groups": len(sentences["part3"]),
        "sentencesTotal": (
            len(sentences["part1"])
            + len(sentences["part1Extras"])
            + sum(len(g["sentences"]) for g in sentences["part3"])
        ),
        "answerKeyPages": len(answer_keys),
        "prerequisiteKanji": len(prerequisite),
    }

    write_json(OUT_DIR / "kanji.json", {"metadata": meta, "kanji": kanji_entries})
    write_json(OUT_DIR / "lessons.json", {"metadata": meta, "lessons": lessons})
    write_json(OUT_DIR / "vocabulary.json", {"metadata": meta, "vocabulary": vocabulary})
    write_json(OUT_DIR / "sentences.json", {"metadata": meta, **sentences})
    write_json(OUT_DIR / "answer_keys.json", {"metadata": meta, "pages": answer_keys})
    write_json(OUT_DIR / "study_aids.json", {"metadata": meta, **study_aids})
    write_json(OUT_DIR / "prerequisite.json", {"metadata": meta, "prerequisite": prerequisite})
    write_json(OUT_DIR / "themes.json", {"metadata": meta, "themes": themes})

    print("\nSummary:")
    print(json.dumps(meta, indent=2))


if __name__ == "__main__":
    main()
