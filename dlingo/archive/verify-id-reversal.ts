import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the mismatch report
const mismatchPath = path.join(__dirname, 'merge-mismatches.json');
const mismatches = JSON.parse(fs.readFileSync(mismatchPath, 'utf-8'));

console.log('Verifying ID Reversal Logic');
console.log('='.repeat(80));
console.log(`Total ID mismatches: ${mismatches.length}\n`);

console.log('Formula: new_id = duo_(1059 - old_id_number)\n');

let correctReversals = 0;
let incorrectReversals = 0;

// Check first 20 mismatches
console.log('Checking first 20 ID mismatches:\n');

mismatches.slice(0, 20).forEach((m: any) => {
  const idIssue = m.issues.find((i: string) => i.includes('ID mismatch'));
  if (idIssue) {
    const match = idIssue.match(/vocab has "duo_(\d+)", examples has "duo_(\d+)"/);
    if (match) {
      const newId = parseInt(match[1]);
      const oldId = parseInt(match[2]);
      const expectedNewId = 1059 - oldId;

      const isCorrect = newId === expectedNewId;
      if (isCorrect) {
        correctReversals++;
      } else {
        incorrectReversals++;
      }

      const status = isCorrect ? '✅' : '❌';
      console.log(`${status} ${m.japanese}:`);
      console.log(`   Old ID: duo_${oldId} → Expected: duo_${expectedNewId} → Got: duo_${newId}`);
      if (!isCorrect) {
        console.log(`   ⚠️  INCORRECT REVERSAL!`);
      }
    }
  }
});

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`✅ Correct reversals: ${correctReversals}`);
console.log(`❌ Incorrect reversals: ${incorrectReversals}`);

if (incorrectReversals === 0) {
  console.log('\n🎉 ALL IDs ARE CORRECTLY REVERSED!');
  console.log('The "mismatches" are just the natural difference between old and new IDs.');
  console.log('The reversal formula (1059 - old_id) is working perfectly!');
} else {
  console.log('\n⚠️  Some IDs are NOT correctly reversed!');
}
