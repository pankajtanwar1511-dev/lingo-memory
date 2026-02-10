const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/seed-data/N5_verbs_dataset.json', 'utf8'));
console.log('All N5 Verbs:\n');
data.verbs.forEach((v, i) => {
  const hasExamples = v.examples && v.examples.length > 0 ? '✓' : '✗';
  console.log(`${i+1}. ${v.kanji} (${v.kana}) ${hasExamples}`);
});
