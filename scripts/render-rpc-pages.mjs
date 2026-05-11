#!/usr/bin/env node
/**
 * Render the iVocab source PDFs into per-page images under
 * public/seed-data/rpc/ and emit a unified pages.json manifest the drill
 * loads. Multiple sources can be combined into one drill — each gets a
 * unique `idPrefix` (so card IDs never collide) and a `filePrefix` (so
 * filenames don't collide either). Each source can also skip specific
 * pages (e.g. cover/title pages we don't want as drill cards).
 *
 * Why a script (not built in next.config): the source PDFs are large
 * (~70MB+) and the rendered output is hundreds of small images. We
 * render once, commit the images, and ship the manifest. Re-run after
 * adding a source or changing one — existing files are skipped.
 *
 * Requires: pdftoppm (poppler-utils) on PATH. cwebp is optional — if
 * missing, we fall back to JPEG (also accepted by next/image).
 *
 * Usage: node scripts/render-rpc-pages.mjs
 */

import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const exec = promisify(execFile);

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const SEED_SOURCE_DIR = join(REPO_ROOT, 'seed-source');
const OUT_DIR = join(REPO_ROOT, 'public/seed-data/rpc');
const MOBILE_OUT_DIR = join(OUT_DIR, 'mobile');
const MANIFEST_PATH = join(OUT_DIR, 'pages.json');

// Source PDFs live outside /public so they aren't shipped to production.
// Each source contributes its pages to the unified iVocab drill. Add a
// new source by appending an entry here and (re)running the script.
//   • idPrefix   — leads the card.id (e.g. 'rpc' → 'rpc-0001'). MUST be
//                  unique across sources.
//   • filePrefix — leads the on-disk filename (e.g. '' → 'page-1.jpg',
//                  'u119-' → 'u119-page-2.jpg'). Use a non-empty prefix
//                  for any source added after the first to avoid
//                  filename collisions in OUT_DIR.
//   • skipPages  — 1-indexed page numbers to NOT render. Cover pages,
//                  title pages, etc.
//   • idPad      — zero-pad width for the page number in card.id.
const SOURCES = [
  {
    name: 'rpc',
    pdf: join(SEED_SOURCE_DIR, 'RPC_Vocabs.pdf'),
    idPrefix: 'rpc',
    filePrefix: '',
    skipPages: new Set(),
    idPad: 4,
  },
  {
    name: 'u119',
    pdf: join(SEED_SOURCE_DIR, 'Unit119_Vocabulary.pdf'),
    idPrefix: 'u119',
    filePrefix: 'u119-',
    skipPages: new Set([1]),
    idPad: 3,
  },
];

// Two render variants:
//   • desktop (140 DPI, ~1400×790, ~4MB decoded) — sharp on retina laptops
//   • mobile  (100 DPI, ~1000×563, ~2.3MB decoded) — pushed the iVocab
//     drill crash threshold from ~30 cards to ~70+ on mid-age iPhones
//     (X/XR/11), where iOS Safari's per-URL decoded-buffer cache piled
//     up faster than the ring buffer could counter.
//
// 720×405 pt source. Original runs were 220 DPI (crashed phones outright);
// 140 DPI compromise didn't fully fix it for the slower phones. The drill/
// learn pages now pick the variant at runtime via matchMedia.
const VARIANTS = [
  { name: 'desktop', dpi: 140, dir: OUT_DIR },
  { name: 'mobile',  dpi: 100, dir: MOBILE_OUT_DIR },
];
const CONCURRENCY = Math.max(2, Math.min(8, os.cpus().length - 1));

function hasBin(bin) {
  try {
    execFileSync('which', [bin], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function pageCount(pdfPath) {
  const { stdout } = await exec('pdfinfo', [pdfPath]);
  const m = stdout.match(/Pages:\s+(\d+)/);
  if (!m) throw new Error(`Could not read page count from ${pdfPath}`);
  return Number(m[1]);
}

/** Render one page → final file path. Skips if the file already exists. */
async function renderOne(pageNum, ext, useWebp, outDir, dpi, pdfPath, filePrefix) {
  const finalName = `${filePrefix}page-${pageNum}.${ext}`;
  const finalPath = join(outDir, finalName);
  if (existsSync(finalPath)) return { pageNum, skipped: true };

  // pdftoppm always appends -{N}.{ext} where {N} is zero-padded to the page
  // count's width; we render one page at a time and let it use a unique
  // tmp prefix so we can rename to a clean filename. The filePrefix keeps
  // tmp files from one source colliding with another's mid-render.
  const tmpPrefix = join(outDir, `_tmp_${filePrefix}p${pageNum}`);
  if (useWebp) {
    // Render to PNG first, then convert with cwebp — quality vs jpeg+cwebp.
    await exec('pdftoppm', [
      '-png', '-r', String(dpi), '-f', String(pageNum), '-l', String(pageNum),
      pdfPath, tmpPrefix,
    ]);
    const pngFile = (await readdir(outDir)).find(
      (f) => f.startsWith(`_tmp_${filePrefix}p${pageNum}-`) && f.endsWith('.png'),
    );
    if (!pngFile) throw new Error(`pdftoppm produced no png for page ${pageNum}`);
    const pngPath = join(outDir, pngFile);
    await exec('cwebp', ['-quiet', '-q', '78', pngPath, '-o', finalPath]);
    await rm(pngPath);
  } else {
    // JPEG path — works without cwebp installed.
    await exec('pdftoppm', [
      '-jpeg', '-jpegopt', 'quality=82,optimize=y',
      '-r', String(dpi), '-f', String(pageNum), '-l', String(pageNum),
      pdfPath, tmpPrefix,
    ]);
    const jpgFile = (await readdir(outDir)).find(
      (f) => f.startsWith(`_tmp_${filePrefix}p${pageNum}-`) && f.endsWith('.jpg'),
    );
    if (!jpgFile) throw new Error(`pdftoppm produced no jpg for page ${pageNum}`);
    await rename(join(outDir, jpgFile), finalPath);
  }
  return { pageNum, skipped: false };
}

async function pool(items, worker, concurrency) {
  const queue = items.slice();
  let done = 0;
  const total = items.length;
  let lastLog = Date.now();
  async function next() {
    while (queue.length) {
      const item = queue.shift();
      try {
        await worker(item);
      } catch (e) {
        process.stderr.write(`\n  page ${item} failed: ${e.message}\n`);
      }
      done += 1;
      if (Date.now() - lastLog > 1000) {
        process.stdout.write(`\r  rendered ${done} / ${total}`);
        lastLog = Date.now();
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, next));
  process.stdout.write(`\r  rendered ${done} / ${total}\n`);
}

async function main() {
  if (!hasBin('pdftoppm')) {
    throw new Error('pdftoppm not on PATH. Install poppler-utils.');
  }
  const useWebp = hasBin('cwebp');
  const ext = useWebp ? 'webp' : 'jpg';

  // Sanity-check unique idPrefix / filePrefix to fail fast if two sources
  // would write to the same filename or emit the same card.id.
  const seenIdPrefix = new Set();
  const seenFilePrefix = new Set();
  for (const s of SOURCES) {
    if (seenIdPrefix.has(s.idPrefix)) {
      throw new Error(`Duplicate idPrefix: ${s.idPrefix}`);
    }
    if (seenFilePrefix.has(s.filePrefix)) {
      throw new Error(`Duplicate filePrefix: "${s.filePrefix}" (must differ across sources)`);
    }
    seenIdPrefix.add(s.idPrefix);
    seenFilePrefix.add(s.filePrefix);
  }

  // Render variant directories exist regardless of which sources contribute.
  for (const v of VARIANTS) await mkdir(v.dir, { recursive: true });

  const allPages = [];

  for (const source of SOURCES) {
    if (!existsSync(source.pdf)) {
      console.warn(`Skipping ${source.name}: PDF not found at ${source.pdf}`);
      continue;
    }
    const total = await pageCount(source.pdf);
    const pageNums = [];
    for (let i = 1; i <= total; i += 1) {
      if (!source.skipPages.has(i)) pageNums.push(i);
    }
    const skippedNote = source.skipPages.size > 0
      ? ` (skipping pages ${[...source.skipPages].join(', ')})`
      : '';
    console.log(
      `\n[${source.name}] ${source.pdf} — ${total} pages, rendering ${pageNums.length}${skippedNote}`,
    );

    for (const v of VARIANTS) {
      console.log(`  ${v.name} @ ${v.dpi} DPI → ${v.dir}`);
      await pool(
        pageNums,
        (n) => renderOne(n, ext, useWebp, v.dir, v.dpi, source.pdf, source.filePrefix),
        CONCURRENCY,
      );
    }

    // Append manifest entries for this source. We trust the file exists if
    // renderOne didn't throw; do a quick existsSync check anyway so a
    // mid-failure shows up here instead of as a 404 in the drill.
    for (const n of pageNums) {
      const file = `${source.filePrefix}page-${n}.${ext}`;
      if (!existsSync(join(OUT_DIR, file))) {
        console.warn(`  WARN: ${file} missing from disk after render`);
        continue;
      }
      allPages.push({
        id: `${source.idPrefix}-${String(n).padStart(source.idPad, '0')}`,
        page: n,
        file,
        source: source.name,
      });
    }
  }

  const manifest = {
    sources: SOURCES.map((s) => ({ name: s.name, pdf: s.pdf })),
    renderedAt: new Date().toISOString(),
    variants: VARIANTS.map((v) => ({ name: v.name, dpi: v.dpi })),
    aspectRatio: '720:405',
    total: allPages.length,
    pages: allPages,
  };
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest: ${MANIFEST_PATH} (${allPages.length} pages across ${SOURCES.length} source(s))`);

  // Cleanup any orphan tmp files from interrupted prior runs in either dir.
  for (const v of VARIANTS) {
    const dirFiles = await readdir(v.dir);
    for (const f of dirFiles) {
      if (f.startsWith('_tmp_')) await rm(join(v.dir, f));
    }
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
