const fs = require('fs');
const path = require('path');

console.log('🔧 Preparing batch_final.json for merge...\n');

// Read batch_final.json
const batchFinal = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'batch_final.json'), 'utf-8')
);

// Convert to merge format
const mergeFormat = {
  updatedWords: batchFinal.map(word => ({
    id: word.id,
    exampleSentences: word.exampleSentences
  }))
};

// Save
const outputPath = path.join(__dirname, 'batch_final_merge.json');
fs.writeFileSync(outputPath, JSON.stringify(mergeFormat, null, 2));

console.log(`✅ Converted ${batchFinal.length} words`);
console.log(`   Total examples: ${batchFinal.reduce((sum, w) => sum + w.exampleSentences.length, 0)}`);
console.log(`   Output: batch_final_merge.json\n`);
