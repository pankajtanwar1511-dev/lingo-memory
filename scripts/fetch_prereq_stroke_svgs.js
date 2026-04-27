#!/usr/bin/env node
/**
 * Download missing stroke-order SVGs from KanjiVG for the prerequisite kanji.
 * Same naming convention as the existing /public/kanji/strokes/<codepoint>.svg.
 *
 * Source: https://github.com/KanjiVG/kanjivg (CC BY-SA 3.0).
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const STROKE_DIR = path.join(ROOT, 'public/kanji/strokes');
const PREREQ = path.join(ROOT, 'public/seed-data/extended-kanji/prerequisite-detailed.json');

const codepoint = (ch) => ch.codePointAt(0).toString(16).padStart(5, '0');
const url = (cp) => `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${cp}.svg`;

function fetch(u) {
  return new Promise((resolve, reject) => {
    https.get(u, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} for ${u}`));
        return;
      }
      let body = '';
      res.setEncoding('utf-8');
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

async function main() {
  const data = JSON.parse(fs.readFileSync(PREREQ, 'utf-8'));
  const have = new Set(fs.readdirSync(STROKE_DIR).map((f) => f.replace('.svg', '')));

  const missing = data.kanji
    .map((k) => ({ ch: k.kanji, cp: codepoint(k.kanji) }))
    .filter((x) => !have.has(x.cp));

  console.log(`Need to fetch ${missing.length} SVGs.`);

  let ok = 0, fail = 0;
  const failed = [];
  for (const { ch, cp } of missing) {
    try {
      const svg = await fetch(url(cp));
      fs.writeFileSync(path.join(STROKE_DIR, `${cp}.svg`), svg);
      ok++;
      if (ok % 20 === 0) console.log(`  fetched ${ok}/${missing.length}`);
      // tiny delay to be polite to GitHub
      await new Promise((r) => setTimeout(r, 80));
    } catch (e) {
      fail++;
      failed.push(ch);
      console.error(`  FAIL ${ch} (${cp}): ${e.message}`);
    }
  }

  console.log(`Done: ${ok} fetched, ${fail} failed.`);
  if (failed.length) console.log('Failed kanji:', failed.join(' '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
