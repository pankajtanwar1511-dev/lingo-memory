const fs = require('fs');
const path = require('path');

const missingWords = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'missing-words.json'), 'utf-8')
);

console.log('📊 REMAINING WORDS WITHOUT EXAMPLES\n');
console.log('='.repeat(60));
console.log(`\nTotal: ${missingWords.length} words\n`);

// Group by type
const byType = {};
missingWords.forEach(word => {
  if (!byType[word.type]) byType[word.type] = [];
  byType[word.type].push(word);
});

// Sort by count (descending)
const sortedTypes = Object.entries(byType).sort((a, b) => b[1].length - a[1].length);

console.log('Breakdown by Type:\n');
sortedTypes.forEach(([type, words]) => {
  console.log(`  ${type.toUpperCase()}: ${words.length} words`);

  // Show first 5 examples
  const examples = words.slice(0, 5).map(w => `${w.japanese} (${w.english})`).join(', ');
  console.log(`    Examples: ${examples}`);
  if (words.length > 5) {
    console.log(`    ... and ${words.length - 5} more\n`);
  } else {
    console.log('');
  }
});

console.log('='.repeat(60));
console.log('\n✅ Analysis complete\n');
