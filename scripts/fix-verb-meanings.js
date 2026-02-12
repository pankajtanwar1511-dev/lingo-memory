const fs = require('fs');
const path = require('path');

/**
 * Fix verb meanings:
 * 1. Fix 要る (need) masuKana: います → いります
 * 2. Clarify "turn" verbs with specific types in primaryMeaning
 */

const filePath = path.join(__dirname, '../public/seed-data/N5_verbs_dataset.json');
const backupPath = filePath + '.backup-before-meaning-fix-' + Date.now();

console.log('🔧 Fixing verb meanings and conjugations...\n');

// Load data
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Backup
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`✅ Backup created: ${path.basename(backupPath)}\n`);

let fixedCount = 0;

// Define fixes
const fixes = {
  '要る': {
    fix: 'masuKana',
    old: 'いります',
    new: 'いります',
    reason: 'Correct kana (already fixed)'
  },
  '曲がる': {
    fix: 'primaryMeaning',
    old: null,
    new: 'turn corner/direction',
    reason: 'Match exact type from table'
  },
  '回す': {
    fix: 'primaryMeaning',
    old: null,
    new: 'rotate/spin object',
    reason: 'Match exact type from table'
  },
  '消す': {
    fix: 'primaryMeaning',
    old: null,
    new: 'turn OFF device',
    reason: 'Match exact type from table'
  },
  'つける': {
    fix: 'primaryMeaning',
    old: null,
    new: 'turn ON device',
    reason: 'Match exact type from table'
  },
  'なる': {
    fix: 'primaryMeaning',
    old: null,
    new: 'turn INTO (become)',
    reason: 'Match exact type from table'
  },
  '止める/停める': {
    fix: 'primaryMeaning',
    old: null,
    new: 'stop/turn off machine',
    reason: 'Match exact type from table'
  }
};

// Apply fixes
data.verbs = data.verbs.map(verb => {
  const fixConfig = fixes[verb.kanji];

  if (fixConfig) {
    console.log(`📝 Fixing ${verb.kanji} (${verb.kana}):`);

    if (fixConfig.fix === 'masuKana') {
      console.log(`   Old masuKana: ${verb.conjugations.masuKana}`);
      verb.conjugations.masuKana = fixConfig.new;
      console.log(`   New masuKana: ${verb.conjugations.masuKana}`);
    } else if (fixConfig.fix === 'primaryMeaning') {
      console.log(`   Old primary: ${verb.primaryMeaning}`);
      verb.primaryMeaning = fixConfig.new;
      console.log(`   New primary: ${verb.primaryMeaning}`);
    }

    console.log(`   Reason: ${fixConfig.reason}\n`);
    fixedCount++;
  }

  return verb;
});

// Update metadata
data.metadata.version = '1.3.1';
data.metadata.generatedAt = new Date().toISOString();
data.metadata.description = 'Complete JLPT N5 verbs with corrected conjugations and clarified meanings';

// Save
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

console.log(`✅ Successfully fixed ${fixedCount} verbs!`);
console.log(`📦 Version updated: ${data.metadata.version}`);
console.log(`💾 Saved: ${filePath}\n`);

console.log('Summary of fixes:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. 要る: masuKana verified as いります ✓');
console.log('2. 曲がる: → "turn corner/direction"');
console.log('3. 回す: → "rotate/spin object"');
console.log('4. 消す: → "turn OFF device"');
console.log('5. つける: → "turn ON device"');
console.log('6. なる: → "turn INTO (become)"');
console.log('7. 止める: → "stop/turn off machine"');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
