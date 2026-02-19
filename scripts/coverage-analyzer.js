#!/usr/bin/env node
/**
 * Coverage Analyzer — Office Vocabulary
 *
 * Reports which vocab entries appear in scenarios and/or drills,
 * and which never appear in either (dead weight candidates).
 *
 * Usage:
 *   node scripts/coverage-analyzer.js
 *   node scripts/coverage-analyzer.js --uncovered      # only show uncovered entries
 *   node scripts/coverage-analyzer.js --category verbs # filter by category
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '../public/seed-data');

const vocab = JSON.parse(fs.readFileSync(path.join(DATA, 'office_vocabulary.json')));
const scenarios = JSON.parse(fs.readFileSync(path.join(DATA, 'office_scenarios.json')));
const drills = JSON.parse(fs.readFileSync(path.join(DATA, 'office_drills.json')));

// --- collect all vocab IDs referenced in scenarios ---
const inScenarios = new Set();
for (const situation of scenarios.situations) {
  for (const frame of situation.frames) {
    for (const id of (frame.vocabIds || [])) {
      inScenarios.add(id);
    }
  }
}

// --- collect all vocab IDs referenced in drills ---
const inDrills = new Set();
for (const pack of drills.packs) {
  for (const stage of pack.stages) {
    const t = stage.targets;
    for (const id of [...(t.required || []), ...(t.optional || [])]) {
      inDrills.add(id);
    }
    for (const group of (t.anyOf || [])) {
      for (const id of group) inDrills.add(id);
    }
  }
}

// --- parse args ---
const args = process.argv.slice(2);
const onlyUncovered = args.includes('--uncovered');
const categoryFilter = (() => {
  const i = args.indexOf('--category');
  return i !== -1 ? args[i + 1] : null;
})();

// --- build coverage report ---
const entries = vocab.entries.filter(e =>
  categoryFilter ? e.category === categoryFilter : true
);

const covered = entries.filter(e => inScenarios.has(e.id) || inDrills.has(e.id));
const uncovered = entries.filter(e => !inScenarios.has(e.id) && !inDrills.has(e.id));
const scenariosOnly = entries.filter(e => inScenarios.has(e.id) && !inDrills.has(e.id));
const drillsOnly = entries.filter(e => !inScenarios.has(e.id) && inDrills.has(e.id));
const both = entries.filter(e => inScenarios.has(e.id) && inDrills.has(e.id));

// --- output ---
const pct = (n, d) => `${n}/${d} (${Math.round(n/d*100)}%)`;

console.log('\n=== Office Vocabulary Coverage Report ===\n');
if (categoryFilter) console.log(`Filter: category = ${categoryFilter}\n`);

console.log(`Total entries:    ${entries.length}`);
console.log(`Covered:          ${pct(covered.length, entries.length)}`);
console.log(`  Both:           ${both.length}`);
console.log(`  Scenarios only: ${scenariosOnly.length}`);
console.log(`  Drills only:    ${drillsOnly.length}`);
console.log(`Uncovered:        ${pct(uncovered.length, entries.length)}`);

// --- per-category breakdown ---
const categories = [...new Set(vocab.entries.map(e => e.category))].sort();
console.log('\n--- Coverage by category ---');
console.log('Category'.padEnd(18), 'Total'.padStart(6), 'Covered'.padStart(8), 'Pct'.padStart(5));
console.log('-'.repeat(40));
for (const cat of categories) {
  const catEntries = vocab.entries.filter(e => e.category === cat);
  const catCovered = catEntries.filter(e => inScenarios.has(e.id) || inDrills.has(e.id));
  const pctStr = Math.round(catCovered.length / catEntries.length * 100) + '%';
  console.log(cat.padEnd(18), String(catEntries.length).padStart(6), String(catCovered.length).padStart(8), pctStr.padStart(5));
}

// --- uncovered entries list ---
const toShow = onlyUncovered ? uncovered : entries;
console.log(`\n--- ${onlyUncovered ? 'Uncovered entries' : 'All entries'} ---`);
console.log('ID'.padEnd(12), 'Kanji'.padEnd(22), 'Tier'.padEnd(6), 'Cat'.padEnd(16), 'Active'.padEnd(8), 'Scenarios Drills');
console.log('-'.repeat(82));
for (const e of toShow) {
  const s = inScenarios.has(e.id) ? '✓' : ' ';
  const d = inDrills.has(e.id) ? '✓' : ' ';
  const row = [
    e.id.padEnd(12),
    e.kanji.padEnd(22),
    e.tier.padEnd(6),
    e.category.padEnd(16),
    String(e.active).padEnd(8),
    `   ${s}         ${d}`
  ].join(' ');
  console.log(row);
}

// --- high-priority uncovered: active S or A tier ---
const highPriority = uncovered.filter(e => e.active && (e.tier === 'S' || e.tier === 'A'));
if (highPriority.length > 0) {
  console.log(`\n--- HIGH PRIORITY uncovered (active, tier S/A) ---`);
  for (const e of highPriority) {
    console.log(`  ${e.id}  ${e.kanji}  [${e.tier}] ${e.category}`);
  }
}

console.log('');
