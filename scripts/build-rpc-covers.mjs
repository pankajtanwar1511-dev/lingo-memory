#!/usr/bin/env node
/**
 * Extract per-page cover rectangles for the RPC drill.
 *
 * Each RPC page shows the kana answer inside a colored highlight strip.
 * To hide the answer we cover the kana with an opaque block; tapping the
 * card reveals it. Bbox coordinates come from pdftotext -bbox-layout —
 * the PDF stores the kana as real vector text, so we can locate every
 * answer strip deterministically without any pixel-level guessing.
 *
 * Output: public/seed-data/rpc/covers.json
 *   {
 *     "pages": {
 *       "rpc-0001": { "rects": [{ "x":..., "y":..., "w":..., "h":... }, ...] },
 *       ...
 *     }
 *   }
 *
 * Rects are fractions of page size (0..1) so the drill UI can scale them
 * to whatever size the rendered image is shown at.
 *
 * Heuristics:
 *   - Only words containing hiragana / katakana count as answer strips.
 *   - Tiny boxes (< MIN_WIDTH_PT) are corner category tags ("Phrase", "N",
 *     "いA"), not answers — skipped.
 *   - Text bbox is padded out so the cover seals the highlight strip,
 *     which extends a few pt beyond the glyph extent.
 *
 * Usage: node scripts/build-rpc-covers.mjs
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile, readFile, mkdir, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const exec = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const PDF_PATH = join(REPO_ROOT, 'public/seed-data/RPC_Vocabs.pdf');
const OUT_DIR = join(REPO_ROOT, 'public/seed-data/rpc');
const OUT_PATH = join(OUT_DIR, 'covers.json');
const TMP_HTML = '/tmp/rpc-bbox.html';
const TMP_SVG = '/tmp/rpc-all.svg';

// Padding is upward-only. Left/right/bottom hug the kana glyph bbox
// directly so the cover doesn't bleed into the illustration. The upward
// extension is handled in two steps:
//   PAD_TOP        — small slack above the romaji line (highlight strip's
//                    top edge sits a few pt above the glyphs).
//   ABOVE_GAP_MAX  — separate, asymmetric pass that pulls the rect up to
//                    swallow the romaji line above the kana.
const PAD_X = 0;
const PAD_TOP = 9;
const PAD_BOTTOM = 0;

// Filter for corner tags ("Phrase", "N", "いA") — they're always small
// AND tucked into a corner of the page. A small rect anywhere else is a
// legitimate single-character kana answer (e.g. p.32 "き" at 33pt wide).
const CORNER_MAX_WIDTH_PT = 60;
const CORNER_BAND_PT = 80; // distance from page edge that counts as "in corner"

function isJapaneseChar(ch) {
  const c = ch.codePointAt(0);
  return (
    (c >= 0x3040 && c <= 0x309f) || // hiragana
    (c >= 0x30a0 && c <= 0x30ff) || // katakana
    (c >= 0x4e00 && c <= 0x9fff) || // CJK unified ideographs (kanji)
    (c >= 0x3400 && c <= 0x4dbf) || // CJK extension A
    (c >= 0xf900 && c <= 0xfaff) || // CJK compatibility ideographs
    c === 0x3005                    // 々 (iteration mark)
  );
}

// Renamed from `containsKana` — now includes kanji so kanji-only answer
// strips (e.g. 新聞, 会社) are picked up too.
function containsKana(text) {
  for (const ch of text) if (isJapaneseChar(ch)) return true;
  return false;
}

function decodeXmlEntities(s) {
  return s
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

const RECT_RE =
  /<path[^>]*fill:rgb\(([\d.]+)%,([\d.]+)%,([\d.]+)%\)[^>]*d="M ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+) Z/g;

function parseHighlightsFromSvg(svgText) {
  const rects = [];
  let m;
  RECT_RE.lastIndex = 0;
  while ((m = RECT_RE.exec(svgText)) !== null) {
    const r = parseFloat(m[1]);
    const g = parseFloat(m[2]);
    const b = parseFloat(m[3]);
    if (r > 99 && g > 99 && b > 99) continue; // page background
    const x1 = parseFloat(m[4]);
    const y1 = parseFloat(m[5]);
    const x2 = parseFloat(m[6]);
    const y3 = parseFloat(m[9]);
    rects.push({
      xMin: Math.min(x1, x2),
      xMax: Math.max(x1, x2),
      yMin: Math.min(y1, y3),
      yMax: Math.max(y1, y3),
    });
  }
  return rects;
}

/**
 * Render each page individually with pdftocairo and pull the highlight
 * rectangles out. Per-page rendering preserves each page's native viewBox
 * — a multi-page SVG inherits page 1's viewBox and silently truncates
 * content from pages that are larger (e.g. p.38 is 960×540 vs the master
 * 720×405, so its kana highlight at y≈410 was being dropped). Returns an
 * array of length = totalPages + 1 (1-indexed), each element an array of
 * { xMin, yMin, xMax, yMax } in that page's native coords.
 *
 * Concurrency: pdftocairo per page takes ~10–30ms; running a small pool
 * keeps the total under ~10s for 782 pages.
 */
async function renderHighlightsPerPage(totalPages) {
  const perPage = [null]; // 1-indexed
  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1);
  const CONCURRENCY = 8;
  let next = 0;
  let done = 0;
  let lastLog = Date.now();
  async function worker() {
    while (true) {
      const i = next;
      next += 1;
      if (i >= pageNums.length) return;
      const pageNum = pageNums[i];
      const tmp = `/tmp/rpc-p${pageNum}.svg`;
      try {
        await exec('pdftocairo', [
          '-svg',
          '-f', String(pageNum),
          '-l', String(pageNum),
          PDF_PATH,
          tmp,
        ]);
        const text = await readFile(tmp, 'utf8');
        perPage[pageNum] = parseHighlightsFromSvg(text);
      } catch (e) {
        process.stderr.write(`\n  page ${pageNum} svg failed: ${e.message}\n`);
        perPage[pageNum] = [];
      }
      done += 1;
      if (Date.now() - lastLog > 500) {
        process.stdout.write(`\r  rendered ${done} / ${totalPages}`);
        lastLog = Date.now();
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  process.stdout.write(`\r  rendered ${done} / ${totalPages}\n`);
  return perPage;
}

/** Find the colored marker(s) backing the kana glyph and return their
 *  combined bounding box, or null if the kana isn't sitting on a marker
 *  (e.g. p.14 speech bubbles).
 *
 *  Some pages draw the marker as several adjacent rectangles instead of
 *  one — e.g. p.12 `Kyoukasho / tekisuto` renders as three yellow rects
 *  (Kyoukasho | / | テキスト). We accept ANY highlight that overlaps the
 *  kana significantly in *both* axes and union them. If the union still
 *  doesn't cover ≥60% of the kana, treat it as not-an-answer.
 */
// Answer markers are roughly one line of bold kana — typically 40–70pt
// tall. Section-divider title cards (e.g. p.18 ことば/Vocabulary/Unit 5,
// p.82 weekday-summary) draw a big colored backdrop 200pt+ tall. Reject
// those so divider pages don't get a giant cover that hides everything.
const MAX_MARKER_HEIGHT_PT = 100;

function findContainingHighlight(kana, highlights) {
  const kanaW = kana.xMax - kana.xMin;
  const kanaH = kana.yMax - kana.yMin;
  if (kanaW <= 0 || kanaH <= 0) return null;
  let xMin = Infinity, yMin = Infinity, xMax = -Infinity, yMax = -Infinity;
  let unionedAny = false;
  for (const h of highlights) {
    if (h.yMax - h.yMin > MAX_MARKER_HEIGHT_PT) continue; // section-title backdrop
    const ix = Math.min(h.xMax, kana.xMax) - Math.max(h.xMin, kana.xMin);
    const iy = Math.min(h.yMax, kana.yMax) - Math.max(h.yMin, kana.yMin);
    if (ix <= 0 || iy <= 0) continue;
    // Both axes must overlap meaningfully — vertically the highlight
    // should mostly sit behind the kana line; horizontally even a thin
    // sliver counts (a / or punctuation cell can be 10pt wide).
    if (iy < kanaH * 0.5) continue;
    xMin = Math.min(xMin, h.xMin);
    yMin = Math.min(yMin, h.yMin);
    xMax = Math.max(xMax, h.xMax);
    yMax = Math.max(yMax, h.yMax);
    unionedAny = true;
  }
  if (!unionedAny) return null;
  const coverW = Math.min(xMax, kana.xMax) - Math.max(xMin, kana.xMin);
  if (coverW / kanaW < 0.6) return null;
  return { xMin, yMin, xMax, yMax };
}

async function main() {
  console.log(`PDF: ${PDF_PATH}`);
  console.log('Extracting bboxes via pdftotext -bbox-layout...');
  await exec('pdftotext', ['-bbox-layout', PDF_PATH, TMP_HTML]);
  const xml = await readFile(TMP_HTML, 'utf8');

  // Stream-style parse: walk lines, track current page, collect every word.
  // We keep non-kana words too because we use them later to extend each
  // kana rect upward to swallow the romaji line that sits directly above.
  const pages = [];
  // pages: [{ width, height, words: [{xMin,yMin,xMax,yMax,text}], rects: [...] }]
  let cur = null;
  for (const line of xml.split('\n')) {
    const pm = line.match(/<page width="([\d.]+)" height="([\d.]+)">/);
    if (pm) {
      cur = { width: parseFloat(pm[1]), height: parseFloat(pm[2]), words: [], rects: [] };
      pages.push(cur);
      continue;
    }
    if (!cur) continue;
    const wm = line.match(
      /<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/,
    );
    if (!wm) continue;
    const [, x0, y0, x1, y1, raw] = wm;
    const text = decodeXmlEntities(raw);
    const word = {
      xMin: parseFloat(x0),
      yMin: parseFloat(y0),
      xMax: parseFloat(x1),
      yMax: parseFloat(y1),
      text,
    };
    cur.words.push(word);
    if (!containsKana(text)) continue;
    cur.rects.push({ ...word });
  }
  // Filter out corner tags: small rect tucked near a page edge.
  for (const p of pages) {
    p.rects = p.rects.filter((r) => {
      const width = r.xMax - r.xMin;
      if (width >= CORNER_MAX_WIDTH_PT) return true; // wide → keep
      const nearTop = r.yMin < CORNER_BAND_PT;
      const nearBottom = r.yMax > p.height - CORNER_BAND_PT;
      const nearLeft = r.xMin < CORNER_BAND_PT;
      const nearRight = r.xMax > p.width - CORNER_BAND_PT;
      const inCorner = (nearTop || nearBottom) && (nearLeft || nearRight);
      return !inCorner;
    });
  }

  // Merge same-line adjacent kana words. Most answer strips come back as a
  // single <word> (kana strings have no spaces), but occasionally the engine
  // splits them — fold those back together so we draw one cover per line.
  for (const p of pages) {
    p.rects.sort((a, b) => a.yMin - b.yMin || a.xMin - b.xMin);
    const merged = [];
    for (const r of p.rects) {
      const last = merged[merged.length - 1];
      // Same-line + truly adjacent: must start within 2pt of where the
      // previous rect ends. Tight gap so we only fold pdftotext-split
      // glyph fragments back together — never merge across separate
      // markers on the same line. Earlier slack of +12pt was incorrectly
      // joining e.g. p.753 `(展覧会を〜)` (no marker) and `やります` (pink
      // marker) into one wide rect that no longer matched the marker.
      const sameLine =
        last &&
        Math.abs(r.yMin - last.yMin) < 4 &&
        r.xMin >= last.xMax - 1 &&
        r.xMin <= last.xMax + 2;
      if (sameLine) {
        last.xMax = Math.max(last.xMax, r.xMax);
        last.yMax = Math.max(last.yMax, r.yMax);
        last.text += r.text;
      } else {
        merged.push({ ...r });
      }
    }
    p.rects = merged;
  }

  console.log('Rendering each page as SVG to find highlight rectangles...');
  const highlightsPerPage = await renderHighlightsPerPage(pages.length);

  // Snap each kana rect's left/right/bottom edges to the actual colored
  // highlight rectangle drawn behind it in the PDF. This is what the user
  // sees as "the marker" — the text bbox is slightly smaller than the
  // colored strip on every side. Top edge stays at the kana's yMin so the
  // upward extension below can still pull it up to swallow the romaji.
  //
  // OUTSET adds a small overhang on each side so subpixel rendering at
  // small device sizes never leaves a sliver of marker color peeking out.
  // Matches the marker visually while being forgiving to layout drift.
  const OUTSET = 3;
  let snapped = 0;
  let dropped = 0;
  pages.forEach((p, i) => {
    const hs = highlightsPerPage[i + 1] || [];
    const kept = [];
    for (const r of p.rects) {
      const h = findContainingHighlight(r, hs);
      if (!h) {
        // Kana with no backing colored highlight is treated as not-an-
        // answer (e.g. p.14 "Aちゃん！" speech bubbles, exclamations
        // inside illustrations). Drop the rect entirely. The romaji /
        // hint line above any real answer is covered later by the
        // upward-extension pass widening the snapped rect.
        dropped += 1;
        continue;
      }
      r.xMin = h.xMin - OUTSET;
      r.xMax = h.xMax + OUTSET;
      r.yMax = h.yMax + OUTSET;
      r.yMin = h.yMin - OUTSET;
      kept.push(r);
      snapped += 1;
    }
    p.rects = kept;
  });
  console.log(`Snapped ${snapped} rects to highlight bounds (${dropped} dropped — no backing marker).`);

  // For every snapped marker rect, extend its top edge upward to swallow
  // the hint line that sits directly above (romaji over kana, or kana
  // reading over kanji). Without this the hint line gives away the
  // answer even though the marker itself is covered.
  //
  // Filter is tight enough to not grab unrelated content:
  //   - word starts clearly above the rect (yMin < rect.yMin - 4)
  //   - within ABOVE_GAP_MAX of the rect's top (one line of text)
  //   - horizontally overlaps the rect's x-range (with small slack)
  //   - word is NOT itself sitting on a colored highlight — that would
  //     mean it's a separate answer marker (e.g. stacked answers on
  //     summary pages, or a reading on its own marker).
  const ABOVE_GAP_MAX = 60;
  const HORIZ_SLACK = 12;
  pages.forEach((p, pi) => {
    const hs = highlightsPerPage[pi + 1] || [];
    for (const r of p.rects) {
      const above = p.words.filter((w) => {
        if (w.yMin >= r.yMin - 4) return false;
        if (w.yMin < r.yMin - ABOVE_GAP_MAX) return false;
        const overlapsX = w.xMax >= r.xMin - HORIZ_SLACK && w.xMin <= r.xMax + HORIZ_SLACK;
        if (!overlapsX) return false;
        // Skip if the candidate word is itself on a highlight — it's a
        // separate marker, not a hint line.
        const onHighlight = hs.some(
          (h) =>
            h.xMin <= w.xMin + 4 &&
            h.xMax >= w.xMax - 4 &&
            h.yMin <= w.yMin + 4 &&
            h.yMax >= w.yMax - 4 &&
            h.yMax - h.yMin <= MAX_MARKER_HEIGHT_PT,
        );
        return !onHighlight;
      });
      if (above.length === 0) continue;
      const newTop = Math.min(...above.map((w) => w.yMin));
      r.yMin = Math.min(r.yMin, newTop);
      const newLeft = Math.min(...above.map((w) => w.xMin));
      const newRight = Math.max(...above.map((w) => w.xMax));
      r.xMin = Math.min(r.xMin, newLeft);
      r.xMax = Math.max(r.xMax, newRight);
    }
  });

  const out = {};
  pages.forEach((p, i) => {
    const id = `rpc-${String(i + 1).padStart(4, '0')}`;
    out[id] = {
      rects: p.rects.map((r) => {
        const x = Math.max(0, r.xMin - PAD_X) / p.width;
        const y = Math.max(0, r.yMin - PAD_TOP) / p.height;
        const w = (Math.min(p.width, r.xMax + PAD_X) - Math.max(0, r.xMin - PAD_X)) / p.width;
        const h = (Math.min(p.height, r.yMax + PAD_BOTTOM) - Math.max(0, r.yMin - PAD_TOP)) / p.height;
        return {
          x: Number(x.toFixed(4)),
          y: Number(y.toFixed(4)),
          w: Number(w.toFixed(4)),
          h: Number(h.toFixed(4)),
        };
      }),
    };
  });

  const totalPages = pages.length;
  const pagesWithCovers = Object.values(out).filter((p) => p.rects.length).length;
  const totalRects = Object.values(out).reduce((n, p) => n + p.rects.length, 0);
  console.log(`Pages: ${totalPages} · with covers: ${pagesWithCovers} · total rects: ${totalRects}`);

  await mkdir(OUT_DIR, { recursive: true });
  const manifest = {
    source: 'RPC_Vocabs_Combined_no_titles.pdf',
    generatedAt: new Date().toISOString(),
    note: 'Rects are fractions of page size (0..1). Cover kana answer strips; tap to reveal.',
    pages: out,
  };
  await writeFile(OUT_PATH, JSON.stringify(manifest));
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
