#!/usr/bin/env node
/**
 * Fetch full JMdict word list for each prerequisite kanji from kanjiapi.dev.
 * Caches to scripts/_words_cache.json so we only hit the network once.
 *
 * The /v1/words/<kanji> endpoint returns every dictionary entry containing
 * that kanji, with JMdict frequency-priority tags. Source of truth — no
 * memory-generated vocab.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const PREREQ = path.join(ROOT, 'public/seed-data/extended-kanji/prerequisite-detailed.json');
const CACHE = path.join(__dirname, '_words_cache.json');

function fetchJson(u) {
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
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const data = JSON.parse(fs.readFileSync(PREREQ, 'utf-8'));
  const chars = data.kanji.map((k) => k.kanji);
  const cache = fs.existsSync(CACHE)
    ? JSON.parse(fs.readFileSync(CACHE, 'utf-8'))
    : {};

  const todo = chars.filter((ch) => !cache[ch]);
  console.log(
    `Total: ${chars.length}, cached: ${chars.length - todo.length}, fetching: ${todo.length}`,
  );

  let ok = 0,
    fail = 0;
  for (const ch of todo) {
    try {
      const u = `https://kanjiapi.dev/v1/words/${encodeURIComponent(ch)}`;
      const words = await fetchJson(u);
      cache[ch] = words;
      ok++;
      if (ok % 10 === 0)
        console.log(`  fetched ${ok}/${todo.length} (${ch}: ${words.length} words)`);
      await new Promise((r) => setTimeout(r, 80));
    } catch (e) {
      fail++;
      console.error(`  FAIL ${ch}: ${e.message}`);
    }
  }

  fs.writeFileSync(CACHE, JSON.stringify(cache));
  const totalWords = Object.values(cache).reduce((s, arr) => s + arr.length, 0);
  console.log(`Done: ${ok} fetched, ${fail} failed.`);
  console.log(`Cache: ${(fs.statSync(CACHE).size / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Total dictionary entries cached: ${totalWords}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
