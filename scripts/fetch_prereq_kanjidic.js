#!/usr/bin/env node
/**
 * Fetch full KANJIDIC2 data (on/kun readings + meanings) for the 117
 * prerequisite kanji. Cached to scripts/_kanjidic_cache.json so we only
 * hit the network once.
 *
 * Source: kanjiapi.dev (KANJIDIC2 + KRADFILE, EDRDG license, free).
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const PREREQ = path.join(ROOT, 'public/seed-data/extended-kanji/prerequisite.json');
const CACHE = path.join(__dirname, '_kanjidic_cache.json');

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
  const prereq = JSON.parse(fs.readFileSync(PREREQ, 'utf-8'));
  const chars = new Set();
  for (const p of prereq.prerequisite) {
    for (const ch of p.Kanji.split('/').map((s) => s.trim()).filter(Boolean)) {
      chars.add(ch);
    }
  }

  const cache = fs.existsSync(CACHE)
    ? JSON.parse(fs.readFileSync(CACHE, 'utf-8'))
    : {};

  const todo = [...chars].filter((ch) => !cache[ch]);
  console.log(
    `Total prereq chars: ${chars.size}, cached: ${chars.size - todo.length}, fetching: ${todo.length}`,
  );

  let ok = 0,
    fail = 0;
  for (const ch of todo) {
    try {
      const u = `https://kanjiapi.dev/v1/kanji/${encodeURIComponent(ch)}`;
      const data = await fetch(u);
      cache[ch] = {
        kanji: data.kanji,
        on_readings: data.on_readings || [],
        kun_readings: data.kun_readings || [],
        meanings: data.meanings || [],
        stroke_count: data.stroke_count,
        jlpt: data.jlpt,
      };
      ok++;
      if (ok % 20 === 0) console.log(`  fetched ${ok}/${todo.length}`);
      await new Promise((r) => setTimeout(r, 60));
    } catch (e) {
      fail++;
      cache[ch] = { kanji: ch, error: e.message };
      console.error(`  FAIL ${ch}: ${e.message}`);
    }
  }

  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2));
  console.log(`Done: ${ok} fetched, ${fail} failed. Cache: ${CACHE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
