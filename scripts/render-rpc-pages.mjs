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
const PDF_PATH = join(REPO_ROOT, 'public/seed-data/RPC_Vocabs.pdf');
const OUT_DIR = join(REPO_ROOT, 'public/seed-data/rpc');
const MANIFEST_PATH = join(OUT_DIR, 'pages.json');

// 720×405 pt source. 110 DPI was fine in the compact card but visibly
// soft when the image fills a 4K monitor in fullscreen. 220 DPI emits
// ~2200×1240 — sharp on every common display, ~150–250KB JPEG @ q82.
const DPI = 220;
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
async function renderOne(pageNum, ext, useWebp) {
  const finalName = `page-${pageNum}.${ext}`;
  const finalPath = join(OUT_DIR, finalName);
  if (existsSync(finalPath)) return { pageNum, skipped: true };

  // pdftoppm always appends -{N}.{ext} where {N} is zero-padded to the page
  // count's width; we render one page at a time and let it use a unique
  // tmp prefix so we can rename to a clean filename.
  const tmpPrefix = join(OUT_DIR, `_tmp_p${pageNum}`);
  if (useWebp) {
    // Render to PNG first, then convert with cwebp — quality vs jpeg+cwebp.
    await exec('pdftoppm', [
      '-png', '-r', String(DPI), '-f', String(pageNum), '-l', String(pageNum),
      PDF_PATH, tmpPrefix,
    ]);
    const pngFile = (await readdir(OUT_DIR)).find(
      (f) => f.startsWith(`_tmp_p${pageNum}-`) && f.endsWith('.png'),
    );
    if (!pngFile) throw new Error(`pdftoppm produced no png for page ${pageNum}`);
    const pngPath = join(OUT_DIR, pngFile);
    await exec('cwebp', ['-quiet', '-q', '78', pngPath, '-o', finalPath]);
    await rm(pngPath);
  } else {
    // JPEG path — works without cwebp installed.
    await exec('pdftoppm', [
      '-jpeg', '-jpegopt', 'quality=82,optimize=y',
      '-r', String(DPI), '-f', String(pageNum), '-l', String(pageNum),
      PDF_PATH, tmpPrefix,
    ]);
    const jpgFile = (await readdir(OUT_DIR)).find(
      (f) => f.startsWith(`_tmp_p${pageNum}-`) && f.endsWith('.jpg'),
    );
    if (!jpgFile) throw new Error(`pdftoppm produced no jpg for page ${pageNum}`);
    await rename(join(OUT_DIR, jpgFile), finalPath);
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
  await mkdir(OUT_DIR, { recursive: true });

  const total = await pageCount();
  console.log(`PDF: ${PDF_PATH}`);
  console.log(`Pages: ${total} · DPI: ${DPI} · format: ${ext} · concurrency: ${CONCURRENCY}`);

  const pageNums = Array.from({ length: total }, (_, i) => i + 1);
  await pool(pageNums, (n) => renderOne(n, ext, useWebp), CONCURRENCY);

  // Build manifest. Ext is uniform per run — older runs in another format are
  // detected and the most-recent ext wins.
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
    dpi: DPI,
    aspectRatio: '720:405',
    total: pages.length,
    pages,
  };
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Manifest: ${MANIFEST_PATH} (${pages.length} pages)`);

  // Cleanup any orphan tmp files from interrupted prior runs.
  for (const f of files) {
    if (f.startsWith('_tmp_p')) await rm(join(OUT_DIR, f));
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
