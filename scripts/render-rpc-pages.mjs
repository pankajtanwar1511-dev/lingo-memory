#!/usr/bin/env node
/**
 * Render every page of RPC_Vocabs_Combined_no_titles.pdf to a per-page image
 * under public/seed-data/rpc/ and emit a pages.json manifest the drill loads.
 *
 * Why a script (not built in next.config): the PDF is 70+MB and the rendered
 * output is ~782 small images (~50–80MB total). We render once, gitignore the
 * output, and ship only the manifest. Re-run after the source PDF changes.
 *
 * Requires: pdftoppm (poppler-utils) on PATH. cwebp is optional — if missing,
 * we fall back to JPEG (also accepted by next/image).
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
// Source PDF lives outside /public so it isn't shipped to production.
const PDF_PATH = join(REPO_ROOT, 'seed-source/RPC_Vocabs.pdf');
const OUT_DIR = join(REPO_ROOT, 'public/seed-data/rpc');
const MOBILE_OUT_DIR = join(OUT_DIR, 'mobile');
const MANIFEST_PATH = join(OUT_DIR, 'pages.json');

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

async function pageCount() {
  const { stdout } = await exec('pdfinfo', [PDF_PATH]);
  const m = stdout.match(/Pages:\s+(\d+)/);
  if (!m) throw new Error('Could not read page count from pdfinfo');
  return Number(m[1]);
}

/** Render one page → final file path. Skips if the file already exists. */
async function renderOne(pageNum, ext, useWebp, outDir, dpi) {
  const finalName = `page-${pageNum}.${ext}`;
  const finalPath = join(outDir, finalName);
  if (existsSync(finalPath)) return { pageNum, skipped: true };

  // pdftoppm always appends -{N}.{ext} where {N} is zero-padded to the page
  // count's width; we render one page at a time and let it use a unique
  // tmp prefix so we can rename to a clean filename.
  const tmpPrefix = join(outDir, `_tmp_p${pageNum}`);
  if (useWebp) {
    // Render to PNG first, then convert with cwebp — quality vs jpeg+cwebp.
    await exec('pdftoppm', [
      '-png', '-r', String(dpi), '-f', String(pageNum), '-l', String(pageNum),
      PDF_PATH, tmpPrefix,
    ]);
    const pngFile = (await readdir(outDir)).find(
      (f) => f.startsWith(`_tmp_p${pageNum}-`) && f.endsWith('.png'),
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
      PDF_PATH, tmpPrefix,
    ]);
    const jpgFile = (await readdir(outDir)).find(
      (f) => f.startsWith(`_tmp_p${pageNum}-`) && f.endsWith('.jpg'),
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
  if (!existsSync(PDF_PATH)) {
    throw new Error(`Source PDF not found: ${PDF_PATH}`);
  }
  if (!hasBin('pdftoppm')) {
    throw new Error('pdftoppm not on PATH. Install poppler-utils.');
  }
  const useWebp = hasBin('cwebp');
  const ext = useWebp ? 'webp' : 'jpg';

  const total = await pageCount();
  console.log(`PDF: ${PDF_PATH}`);
  console.log(`Pages: ${total} · format: ${ext} · concurrency: ${CONCURRENCY}`);

  const pageNums = Array.from({ length: total }, (_, i) => i + 1);

  // Render each variant in turn. renderOne skips files that already exist,
  // so re-running is safe and idempotent.
  for (const v of VARIANTS) {
    await mkdir(v.dir, { recursive: true });
    console.log(`\n${v.name} variant → ${v.dir} @ ${v.dpi} DPI`);
    await pool(pageNums, (n) => renderOne(n, ext, useWebp, v.dir, v.dpi), CONCURRENCY);
  }

  // Build manifest from the desktop set (filenames are identical across
  // variants; only the directory differs). The runtime picks the right
  // path via matchMedia.
  const files = await readdir(OUT_DIR);
  const seen = new Map();
  for (const f of files) {
    const m = /^page-(\d+)\.(webp|jpg|jpeg|png)$/.exec(f);
    if (!m) continue;
    seen.set(Number(m[1]), m[2]);
  }
  const pages = [];
  for (let i = 1; i <= total; i += 1) {
    const e = seen.get(i);
    if (!e) {
      console.warn(`  WARN: page ${i} missing on disk after render`);
      continue;
    }
    pages.push({
      id: `rpc-${String(i).padStart(4, '0')}`,
      page: i,
      file: `page-${i}.${e}`,
    });
  }

  const manifest = {
    source: 'RPC_Vocabs_Combined_no_titles.pdf',
    renderedAt: new Date().toISOString(),
    variants: VARIANTS.map((v) => ({ name: v.name, dpi: v.dpi })),
    aspectRatio: '720:405',
    total: pages.length,
    pages,
  };
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest: ${MANIFEST_PATH} (${pages.length} pages)`);

  // Cleanup any orphan tmp files from interrupted prior runs in either dir.
  for (const v of VARIANTS) {
    const dirFiles = await readdir(v.dir);
    for (const f of dirFiles) {
      if (f.startsWith('_tmp_p')) await rm(join(v.dir, f));
    }
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
