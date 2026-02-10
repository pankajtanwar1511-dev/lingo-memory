const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying batch_final.json\n');

// Read the 209 missing words
const missingWords = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'missing-words.json'), 'utf-8')
);
const missingIds = new Set(missingWords.map(w => w.id));

console.log(`📊 Words needing examples: ${missingIds.size}\n`);

// Read batch_final.json
const batchFinal = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'batch_final.json'), 'utf-8')
);

console.log(`📄 Processing batch_final.json...`);
console.log(`   Found ${batchFinal.length} words\n`);

// Verify each word
const issues = [];
const levelCounts = { '1': 0, '2': 0, '3': 0 };
let totalExamples = 0;
const coveredIds = new Set();

batchFinal.forEach(word => {
  // Check if this word was in the missing list
  if (!missingIds.has(word.id)) {
    issues.push(`${word.id}: Not in missing words list`);
  }
  coveredIds.add(word.id);

  if (!word.exampleSentences || word.exampleSentences.length === 0) {
    issues.push(`${word.id}: No examples`);
    return;
  }

  totalExamples += word.exampleSentences.length;

  // Verify each example
  word.exampleSentences.forEach((ex, idx) => {
    // Check required fields
    if (!ex.japanese) issues.push(`${word.id} Example ${idx+1}: Missing japanese`);
    if (!ex.english) issues.push(`${word.id} Example ${idx+1}: Missing english`);
    if (!ex.level) issues.push(`${word.id} Example ${idx+1}: Missing level`);
    if (ex.isAIGenerated !== true) issues.push(`${word.id} Example ${idx+1}: isAIGenerated not true`);

    // Check level format (should be "1-X", "2-X", or "3-X")
    if (ex.level) {
      const levelMatch = ex.level.match(/^([1-3])-\d+$/);
      if (!levelMatch) {
        issues.push(`${word.id} Example ${idx+1}: Invalid level format "${ex.level}"`);
      } else {
        levelCounts[levelMatch[1]]++;
      }
    }

    // Check context
    if (ex.context && !['statement', 'question', 'answer'].includes(ex.context)) {
      issues.push(`${word.id} Example ${idx+1}: Invalid context "${ex.context}"`);
    }
  });
});

// Check coverage
const stillMissing = Array.from(missingIds).filter(id => !coveredIds.has(id));

console.log('='.repeat(60));
console.log('📊 VERIFICATION SUMMARY\n');
console.log(`Words in batch: ${batchFinal.length}`);
console.log(`Total examples: ${totalExamples}`);
console.log(`Average examples per word: ${(totalExamples / batchFinal.length).toFixed(1)}`);
console.log(`\nLevel Distribution:`);
console.log(`  Level 1 (Simple): ${levelCounts['1']} examples (${(levelCounts['1']/totalExamples*100).toFixed(1)}%)`);
console.log(`  Level 2 (Intermediate): ${levelCounts['2']} examples (${(levelCounts['2']/totalExamples*100).toFixed(1)}%)`);
console.log(`  Level 3 (Advanced): ${levelCounts['3']} examples (${(levelCounts['3']/totalExamples*100).toFixed(1)}%)`);

console.log(`\n📈 Coverage:`);
console.log(`  Covered: ${coveredIds.size} / ${missingIds.size} words`);
console.log(`  Still missing: ${stillMissing.length} words`);

if (stillMissing.length > 0 && stillMissing.length <= 20) {
  console.log(`  Missing IDs: ${stillMissing.join(', ')}`);
}

if (issues.length > 0) {
  console.log(`\n⚠️  Issues Found: ${issues.length}\n`);
  issues.slice(0, 20).forEach(issue => console.log(`   - ${issue}`));
  if (issues.length > 20) {
    console.log(`   ... and ${issues.length - 20} more issues`);
  }
} else {
  console.log(`\n✅ No issues found! Batch is valid.`);
}

console.log('\n' + '='.repeat(60));

// Sample a few examples to check quality
console.log('\n📝 Sample Examples (Quality Check):\n');
const samples = batchFinal.slice(0, 3);
samples.forEach(word => {
  console.log(`${word.japanese} (${word.english}):`);
  word.exampleSentences.forEach(ex => {
    console.log(`  [${ex.level}] ${ex.japanese}`);
    console.log(`       ${ex.english}\n`);
  });
});

if (issues.length === 0 && stillMissing.length === 0) {
  console.log('✅ All 209 missing words are covered! Ready to merge.\n');
} else {
  console.log('⚠️  Please address issues before merging.\n');
}
