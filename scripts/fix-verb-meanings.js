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
    old: 'います',
    new: 'いります',
    reason: 'Incorrect kana - confused with いる (exist)'
  },
  '曲がる': {
    fix: 'primaryMeaning',
    old: 'turn',
    new: 'turn (corner), bend',
    reason: 'Clarify type of turn - directional turn'
  },
  '回す': {
    fix: 'primaryMeaning',
    old: 'turn',
    new: 'rotate, turn (around)',
    reason: 'Clarify type of turn - rotational turn'
  },
  '消す': {
    fix: 'primaryMeaning',
    old: 'turn off',
    new: 'turn off (light/device), erase',
    reason: 'Clarify usage context'
  },
  'つける': {
    fix: 'primaryMeaning',
    old: 'turn on',
    new: 'turn on (light/device), attach',
    reason: 'Clarify usage context'
  },
  '止める/停める': {
    fix: 'primaryMeaning',
    old: 'stop, park',
    new: 'stop, turn off (engine), park',
    reason: 'Clarify turn off for engines'
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
console.log('1. 要る: Fixed masuKana (います → いります)');
console.log('2. 曲がる: Clarified as "turn (corner), bend"');
console.log('3. 回す: Clarified as "rotate, turn (around)"');
console.log('4. 消す: Clarified as "turn off (light/device), erase"');
console.log('5. つける: Clarified as "turn on (light/device), attach"');
console.log('6. 止める: Clarified as "stop, turn off (engine), park"');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
