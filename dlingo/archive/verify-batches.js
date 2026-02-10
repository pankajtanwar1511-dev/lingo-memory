const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying AI-Generated Batch Files\n');

// Read current vocabulary to check which words need examples
const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
const vocabData = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));
const wordsNeedingExamples = new Set(
  vocabData
    .filter(w => !w.exampleSentences || w.exampleSentences.length === 0)
    .map(w => w.id)
);

console.log(`📊 Words needing examples: ${wordsNeedingExamples.size}\n`);

// Function to extract JSON from markdown or read JSON directly
function extractJSON(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  if (filePath.endsWith('.json')) {
    return JSON.parse(content);
  }

  // Extract JSON from markdown
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]);
  }

  throw new Error(`Could not extract JSON from ${filePath}`);
}

// Batch files to process
const batchFiles = [
  'batch_1.md',
  'batch_2.md',
  'batch_3.md',
  'batch_4_to_8.json',
  'batch_remaining.json'
];

let totalWords = 0;
let totalExamples = 0;
const allWordIds = new Set();
const issues = [];
const levelCounts = { '1': 0, '2': 0, '3': 0 };

// Process each batch file
batchFiles.forEach(filename => {
  const filePath = path.join(__dirname, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${filename} - NOT FOUND`);
    return;
  }

  console.log(`📄 Processing ${filename}...`);

  try {
    const data = extractJSON(filePath);
    // Handle both formats: {updatedWords: [...]} or direct array [...]
    const words = Array.isArray(data) ? data : (data.updatedWords || []);

    words.forEach(word => {
      if (allWordIds.has(word.id)) {
        issues.push(`Duplicate word ID: ${word.id} in ${filename}`);
      }
      allWordIds.add(word.id);

      if (!word.exampleSentences || word.exampleSentences.length === 0) {
        issues.push(`${word.id}: No examples`);
        return;
      }

      totalWords++;
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
            issues.push(`${word.id} Example ${idx+1}: Invalid level format "${ex.level}" (should be "1-X", "2-X", or "3-X")`);
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

    console.log(`   ✅ ${words.length} words, ${words.reduce((sum, w) => sum + w.exampleSentences.length, 0)} examples\n`);

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
    issues.push(`${filename}: ${error.message}`);
  }
});

// Summary
console.log('='.repeat(60));
console.log('📊 VERIFICATION SUMMARY\n');
console.log(`Total words with examples: ${totalWords}`);
console.log(`Total examples generated: ${totalExamples}`);
console.log(`Average examples per word: ${(totalExamples / totalWords).toFixed(1)}`);
console.log(`\nUnique word IDs: ${allWordIds.size}`);
console.log(`Words still needing examples: ${wordsNeedingExamples.size - allWordIds.size}`);
console.log(`\nLevel Distribution:`);
console.log(`  Level 1 (Simple): ${levelCounts['1']} examples (${(levelCounts['1']/totalExamples*100).toFixed(1)}%)`);
console.log(`  Level 2 (Intermediate): ${levelCounts['2']} examples (${(levelCounts['2']/totalExamples*100).toFixed(1)}%)`);
console.log(`  Level 3 (Advanced): ${levelCounts['3']} examples (${(levelCounts['3']/totalExamples*100).toFixed(1)}%)`);

if (issues.length > 0) {
  console.log(`\n⚠️  Issues Found: ${issues.length}\n`);
  issues.slice(0, 20).forEach(issue => console.log(`   - ${issue}`));
  if (issues.length > 20) {
    console.log(`   ... and ${issues.length - 20} more issues`);
  }
} else {
  console.log(`\n✅ No issues found! All batches are valid.`);
}

// Check coverage
const coveredWords = [];
const missingWords = [];
wordsNeedingExamples.forEach(id => {
  if (allWordIds.has(id)) {
    coveredWords.push(id);
  } else {
    missingWords.push(id);
  }
});

console.log(`\n📈 Coverage:`);
console.log(`  Covered: ${coveredWords.length} words`);
console.log(`  Missing: ${missingWords.length} words`);

if (missingWords.length > 0 && missingWords.length <= 20) {
  console.log(`\n  Missing words: ${missingWords.join(', ')}`);
}

console.log('\n' + '='.repeat(60));

// Save summary
const summary = {
  totalWords,
  totalExamples,
  averageExamplesPerWord: (totalExamples / totalWords).toFixed(1),
  levelDistribution: levelCounts,
  coverage: {
    covered: coveredWords.length,
    missing: missingWords.length
  },
  issues: issues.length,
  status: issues.length === 0 ? 'VALID' : 'HAS_ISSUES'
};

fs.writeFileSync(
  path.join(__dirname, 'batch-verification-summary.json'),
  JSON.stringify(summary, null, 2)
);

console.log('✅ Summary saved to: batch-verification-summary.json\n');
