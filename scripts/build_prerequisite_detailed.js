#!/usr/bin/env node
/**
 * Build public/seed-data/extended-kanji/prerequisite-detailed.json
 *
 * Promotes the flat prerequisite.json (Kanji | Reading | Common uses seen)
 * into the same ExtendedKanji shape used by the main 86 kanji, so the
 * existing card-grid + detail components can render it.
 *
 * Rules:
 *   - vocabulary[] and exampleSentences[] are derived ONLY from existing
 *     data (kanji.json + sentences.json). No invented words/sentences.
 *   - meaning[] uses a curated lookup table (single-word glosses only).
 *   - Readings are split kun (hiragana) / on (katakana) and merged when
 *     the same kanji appears multiple times in prerequisite.json.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SEED = path.join(ROOT, 'public/seed-data/extended-kanji');

// --- Curated meaning glosses for the 124 prerequisite kanji ---
// Single-word/short-phrase glosses only. NOT invented vocabulary.
const MEANING = {
  '会': 'meet, society',
  '社': 'company, shrine',
  '校': 'school',
  '曜': 'weekday',
  '誕': 'be born',
  '駅': 'station',
  '飛': 'fly',
  '機': 'machine, opportunity',
  '銀': 'silver',
  '旅': 'travel',
  '部': 'section, part',
  '屋': 'shop, roof',
  '映': 'reflect, project',
  '画': 'picture, stroke',
  '電': 'electricity',
  '新': 'new',
  '勉': 'exertion, study',
  '強': 'strong',
  '試': 'try, test',
  '験': 'verify, test',
  '誌': 'magazine, record',
  '詞': 'words, poetry',
  '英': 'English, excellent',
  '米': 'rice, America',
  '韓': 'Korea',
  '宿': 'lodging',
  '科': 'department, section',
  '地': 'ground, earth',
  '鉄': 'iron',
  '転': 'turn, revolve',
  '自': 'self',
  '動': 'move',
  '運': 'carry, luck',
  '真': 'true',
  '写': 'copy',
  '街': 'town, street',
  '寺': 'temple',
  '清': 'pure, clean',
  '祖': 'ancestor',
  '息': 'breath, son',
  '娘': 'daughter',
  '双': 'pair, twin',
  '性': 'gender, nature',
  '料': 'fee, material',
  '持': 'hold, have',
  '計': 'measure, plan',
  '番': 'number, turn',
  '交': 'exchange, cross',
  '近': 'near, recent',
  '州': 'province, state',
  '方': 'direction, way',
  '海': 'sea',
  '道': 'road, way',
  '極': 'pole, extreme',
  '関': 'barrier, related',
  '幹': 'trunk, main',
  '線': 'line',
  '太': 'thick, big',
  '陽': 'sun, positive',
  '公': 'public',
  '園': 'garden, park',
  '資': 'resources, funds',
  '議': 'discussion',
  '札': 'tag, bill',
  '改': 'revise, change',
  '紙': 'paper',
  '音': 'sound',
  '楽': 'music, comfort',
  '買': 'buy',
  '物': 'thing',
  '帰': 'return',
  '失': 'lose, mistake',
  '礼': 'manners, courtesy',
  '切': 'cut, precious',
  '昨': 'yesterday, past',
  '朝': 'morning',
  '夜': 'night',
  '夏': 'summer',
  '春': 'spring',
  '冬': 'winter',
  '秋': 'autumn',
  '葉': 'leaf, word',
  '橋': 'bridge',
  '岡': 'hill',
  '駄': 'useless',
  '谷': 'valley',
  '笠': 'bamboo hat',
  '原': 'field, origin',
  '壱': 'one (formal)',
  '鼻': 'nose',
  '錠': 'lock, pill',
  '断': 'refuse, cut',
  '横': 'side, horizontal',
  '辞': 'word, quit',
  '調': 'tune, investigate',
  '掘': 'dig',
  '卒': 'graduate',
  '業': 'work, business',
  '趣': 'taste, hobby',
  '味': 'taste, flavor',
  '曲': 'song, bend',
  '章': 'chapter, badge',
  '類': 'kind, sort',
  '禁': 'prohibit',
  '止': 'stop',
  '用': 'use, business',
  '帳': 'notebook',
  '館': 'building, hall',
  '図': 'diagram, figure',
  '明': 'bright, clear',
  '古': 'old',
  '置': 'put, place',
  '遊': 'play',
  '温': 'warm',
  '気': 'spirit, energy',
  '服': 'clothes',
  '去': 'leave, past',
};

// Kanji whose single-reading entry in prerequisite.json is actually kun'yomi
// (default convention is on'yomi, so we override these explicitly).
const KUN_OVERRIDE = new Set([
  '娘', '夏', '春', '秋', '冬', '橋', '岡', '横', '真',
  '笠', '調', '掘', '買', '帰', '置', '遊',
]);

// For "/" -separated mixed readings, prerequisite.json writes both on and kun
// in hiragana, so we hand-classify each part. Keys = kanji char, values =
// { kun: [...], on: [...] }.
const MIXED_OVERRIDE = {
  '部': { kun: [],         on: ['ぶ', 'へ'] },        // へ in 部屋 is irregular but conventionally on'-side
  '寺': { kun: ['てら'],    on: ['じ'] },
  '海': { kun: ['うみ'],    on: ['かい'] },
  '道': { kun: ['みち'],    on: ['どう'] },
  '物': { kun: ['もの'],    on: ['ぶつ'] },
  '音': { kun: ['おと'],    on: ['おん'] },
  '朝': { kun: ['あさ'],    on: ['ちょう'] },
  '夜': { kun: ['よる'],    on: ['や'] },
  '谷': { kun: ['たに'],    on: ['や'] },
  '明': { kun: ['あき'],    on: ['めい'] },
  '原': { kun: ['はら'],    on: ['げん'] },
  '葉': { kun: ['は', 'ば'], on: [] },                 // both kun (rendaku variant)
  '切': { kun: ['き'],      on: ['せつ'] },
  '持': { kun: ['も'],      on: ['じ'] },
  '鼻': { kun: ['はな'],    on: ['び'] },
  '図': { kun: [],          on: ['と', 'ず'] },        // both on
  '画': { kun: [],          on: ['が', 'かく'] },      // both on
};

// --- Helpers ---

const HIRAGANA = /^[぀-ゟ・　\s]+$/;
const KATAKANA = /^[゠-ヿー\s]+$/;

/** Split a Reading field like "ぶ / へ" or "てら / じ" into kun / on arrays. */
function splitReading(raw) {
  const kun = [];
  const on = [];
  if (!raw) return { kun, on };
  const parts = raw.split('/').map((s) => s.trim()).filter(Boolean);
  for (const p of parts) {
    if (HIRAGANA.test(p)) kun.push(p);
    else if (KATAKANA.test(p)) on.push(p);
    else {
      // Mixed or unknown — bucket by majority hiragana char
      const hira = (p.match(/[぀-ゟ]/g) || []).length;
      const kata = (p.match(/[゠-ヿ]/g) || []).length;
      if (hira >= kata) kun.push(p);
      else on.push(p);
    }
  }
  return { kun, on };
}

/** Heuristic: most prereq Readings are written in hiragana even when they
 * are on'yomi (e.g., 会 / かい). Convention used in this dataset:
 * if the Common-uses-seen entry is a kanji compound (Sino-Japanese style)
 * AND there is no clear okurigana, treat hiragana reading as on'yomi. */
function classifyPrimary(reading, commonUses) {
  if (KATAKANA.test(reading)) return 'on';
  // Default hiragana to on'yomi — matches teacher's reference style for
  // prerequisite kanji where most listed readings are Sino-Japanese.
  return 'on';
}

function uniqueByWord(rows) {
  const seen = new Set();
  const out = [];
  for (const r of rows) {
    const key = `${r.word}|${r.reading}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

function uniqueSentences(rows) {
  const seen = new Set();
  const out = [];
  for (const r of rows) {
    if (seen.has(r.japanese)) continue;
    seen.add(r.japanese);
    out.push(r);
  }
  return out;
}

// --- Load source data ---

const prereqRaw = JSON.parse(
  fs.readFileSync(path.join(SEED, 'prerequisite.json'), 'utf-8'),
);
const kanjiData = JSON.parse(
  fs.readFileSync(path.join(SEED, 'kanji.json'), 'utf-8'),
);
const sentencesData = JSON.parse(
  fs.readFileSync(path.join(SEED, 'sentences.json'), 'utf-8'),
);
const KANJIDIC_CACHE_PATH = path.join(__dirname, '_kanjidic_cache.json');
const kanjidic = fs.existsSync(KANJIDIC_CACHE_PATH)
  ? JSON.parse(fs.readFileSync(KANJIDIC_CACHE_PATH, 'utf-8'))
  : {};

// Curated common vocabulary (5-ish per kanji) from JMdict via
// scripts/curate_prereq_vocab.js. Stored as a SEPARATE field on each
// prereq entry so it doesn't merge with the corpus-linked vocabulary.
const CURATED_PATH = path.join(SEED, 'prereq-curated-vocab.json');
const curatedByKanji = (() => {
  if (!fs.existsSync(CURATED_PATH)) return {};
  const data = JSON.parse(fs.readFileSync(CURATED_PATH, 'utf-8'));
  const map = {};
  for (const r of data.results) {
    map[r.parentKanji] = r.vocabulary;
  }
  return map;
})();

// --- Build merged vocab + sentences pools (existing data only) ---

const allVocab = [];
for (const k of kanjiData.kanji) {
  for (const v of k.vocabulary) {
    allVocab.push({
      word: v.word,
      reading: v.reading,
      meaning: v.meaning,
      parentKanji: k.kanji,
    });
  }
}

const allSentences = [];
for (const s of sentencesData.part1 || []) {
  allSentences.push({
    japanese: s.japanese,
    english: s.english,
    rubies: s.rubies,
    parentKanji: s.parentKanji,
    source: 'part1',
  });
}
for (const s of sentencesData.part1Extras || []) {
  allSentences.push({
    japanese: s.japanese,
    english: s.english,
    rubies: s.rubies,
    parentKanji: s.parentKanji,
    sectionTitle: s.sectionTitle,
    source: 'part1_extras',
  });
}
for (const grp of sentencesData.part3 || []) {
  (grp.sentences || []).forEach((jp, i) => {
    allSentences.push({
      japanese: jp,
      english: '',
      rubies: grp.rubies?.[i],
      sectionTitle: grp.topic,
      source: 'part3',
    });
  });
}

// --- Merge duplicate prereq entries by kanji char ---

const merged = new Map(); // kanji -> { readingsRaw: Set, commonUses: Set, firstOrder: number }
prereqRaw.prerequisite.forEach((p, idx) => {
  // Some entries combine two kanji like "誌 / 詞" — split.
  const chars = p.Kanji.split('/').map((s) => s.trim()).filter(Boolean);
  for (const ch of chars) {
    if (!merged.has(ch)) {
      merged.set(ch, {
        kanji: ch,
        readingsRaw: new Set(),
        commonUses: new Set(),
        firstOrder: idx,
      });
    }
    const entry = merged.get(ch);
    if (p.Reading) entry.readingsRaw.add(p.Reading);
    if (p['Common uses seen']) entry.commonUses.add(p['Common uses seen']);
  }
});

// --- Build ExtendedKanji-shaped objects ---

const out = [];
for (const [ch, entry] of merged) {
  const allReadings = Array.from(entry.readingsRaw).join(' / ');
  const teacherPrimary = Array.from(entry.readingsRaw); // preserve as written

  // Authoritative readings from KANJIDIC2 (kanjiapi.dev cache).
  // Fallback to the heuristic split only if cache is missing.
  let kun, on;
  const dic = kanjidic[ch];
  if (dic && (dic.on_readings?.length || dic.kun_readings?.length)) {
    on = dic.on_readings || [];
    kun = dic.kun_readings || [];
  } else {
    // Legacy heuristic path (should not be hit when cache is present).
    ({ kun, on } = splitReading(allReadings));
    if (MIXED_OVERRIDE[ch] && allReadings.includes('/')) {
      kun = [...MIXED_OVERRIDE[ch].kun];
      on = [...MIXED_OVERRIDE[ch].on];
    }
  }

  // KANJIDIC already returns on/kun in the canonical buckets, so no
  // reclassification needed when cache is present.
  const finalKun = kun;
  const finalOn = on;

  const vocab = uniqueByWord(allVocab.filter((v) => v.word.includes(ch)));
  const sents = uniqueSentences(
    allSentences.filter((s) => s.japanese.includes(ch)),
  );

  // Prefer richer KANJIDIC meanings; fall back to curated gloss.
  const dicMeanings = (dic?.meanings || []).slice(0, 6).join(', ');
  const meaning = dicMeanings || MEANING[ch] || '';

  out.push({
    id: `ext_prereq_${ch}`,
    kanji: ch,
    meaning,
    kunReadings: finalKun,
    onReadings: finalOn,
    teacherPrimaryReading: teacherPrimary,
    strokeCount: dic?.stroke_count ?? null,
    jlpt: dic?.jlpt ?? null,
    vocabulary: vocab.map((v) => ({
      word: v.word,
      reading: v.reading,
      meaning: v.meaning,
      parentKanji: v.parentKanji,
    })),
    commonVocabulary: (curatedByKanji[ch] || []).map((v) => ({
      word: v.word,
      reading: v.reading,
      meaning: v.meaning,
    })),
    exampleSentences: sents,
    extraSections: [],
    orderInReference: entry.firstOrder,
    bundledWith: null,
    lessonNumber: null,
    lessonDate: null,
    textbookPage: null,
    lessonSource: null,
    commonUsesSeen: Array.from(entry.commonUses).join('; '),
  });
}

// Sort by original order in reference for stable display
out.sort((a, b) => a.orderInReference - b.orderInReference);

const dataset = {
  metadata: {
    source: 'KANJI_REFERENCE_v2.md (PART 6) + derived from kanji.json/sentences.json',
    generatedAt: new Date().toISOString(),
    prerequisiteKanji: out.length,
    vocabularyLinked: out.reduce((s, k) => s + k.vocabulary.length, 0),
    sentencesLinked: out.reduce((s, k) => s + k.exampleSentences.length, 0),
    rule: 'vocab and sentences derived only from existing kanji.json/sentences.json — no invented data',
  },
  kanji: out,
};

const outPath = path.join(SEED, 'prerequisite-detailed.json');
fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2));

console.log(`Wrote ${out.length} prerequisite kanji to ${outPath}`);
console.log(
  `  vocabulary linked: ${dataset.metadata.vocabularyLinked}`,
);
console.log(
  `  sentences linked: ${dataset.metadata.sentencesLinked}`,
);
const missingMeaning = out.filter((k) => !k.meaning).map((k) => k.kanji);
if (missingMeaning.length) {
  console.log(`  WARNING: missing meaning for: ${missingMeaning.join(', ')}`);
}
const noVocab = out.filter((k) => k.vocabulary.length === 0).length;
const noSent = out.filter((k) => k.exampleSentences.length === 0).length;
console.log(`  prereq kanji with no linked vocab: ${noVocab}`);
console.log(`  prereq kanji with no linked sentences: ${noSent}`);
