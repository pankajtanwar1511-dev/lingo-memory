const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Duplicates and Merging AI Batches\n');

// Read current vocabulary
const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
const vocabData = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));
const wordsNeedingExamples = vocabData.filter(w => !w.exampleSentences || w.exampleSentences.length === 0);

console.log(`📊 Words needing examples: ${wordsNeedingExamples.length}\n`);

// Extract JSON helper
function extractJSON(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (filePath.endsWith('.json')) {
    return JSON.parse(content);
  }
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]);
  }
  throw new Error(`Could not extract JSON from ${filePath}`);
}

// Collect all examples, removing duplicates (keep first occurrence)
const examplesByWordId = new Map();
const batchFiles = [
  'batch_1.md',
  'batch_2.md',
  'batch_3.md',
  'batch_4_to_8.json',
  'batch_remaining.json'
];

batchFiles.forEach(filename => {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) return;

  console.log(`📄 Processing ${filename}...`);

  const data = extractJSON(filePath);
  const words = Array.isArray(data) ? data : (data.updatedWords || []);

  let added = 0, skipped = 0;

  words.forEach(word => {
    if (examplesByWordId.has(word.id)) {
      skipped++;
    } else {
      examplesByWordId.set(word.id, word.exampleSentences);
      added++;
    }
  });

  console.log(`   ✅ Added: ${added}, Skipped duplicates: ${skipped}\n`);
});

// Find missing words
const coveredIds = new Set(examplesByWordId.keys());
const missingWords = wordsNeedingExamples.filter(w => !coveredIds.has(w.id));

console.log('='.repeat(60));
console.log('📊 MERGE SUMMARY\n');
console.log(`Total unique words: ${examplesByWordId.size}`);
console.log(`Total examples: ${Array.from(examplesByWordId.values()).reduce((sum, ex) => sum + ex.length, 0)}`);
console.log(`Words still missing: ${missingWords.length}\n`);

if (missingWords.length > 0) {
  console.log('⚠️  Missing Words:\n');

  // Group missing by type
  const missingByType = {};
  missingWords.forEach(w => {
    if (!missingByType[w.type]) missingByType[w.type] = [];
    missingByType[w.type].push(w);
  });

  Object.entries(missingByType).forEach(([type, words]) => {
    console.log(`${type.toUpperCase()} (${words.length}):`);
    words.slice(0, 10).forEach(w => {
      console.log(`  - ${w.id}: ${w.japanese} (${w.english})`);
    });
    if (words.length > 10) {
      console.log(`  ... and ${words.length - 10} more`);
    }
    console.log('');
  });

  // Save missing words list
  fs.writeFileSync(
    path.join(__dirname, 'missing-words.json'),
    JSON.stringify(missingWords, null, 2)
  );
  console.log('💾 Missing words saved to: missing-words.json\n');
}

console.log('='.repeat(60));
console.log('\n✅ Ready to merge into final dataset!\n');

// Save merged data for import
const mergedData = {
  updatedWords: Array.from(examplesByWordId.entries()).map(([id, examples]) => ({
    id,
    exampleSentences: examples
  }))
};

fs.writeFileSync(
  path.join(__dirname, 'merged-ai-examples.json'),
  JSON.stringify(mergedData, null, 2)
);

console.log('💾 Merged examples saved to: merged-ai-examples.json');
console.log(`📊 Ready to import ${mergedData.updatedWords.length} words\n`);
