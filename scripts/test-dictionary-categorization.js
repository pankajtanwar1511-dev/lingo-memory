const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/seed-data/N5_verbs_dataset.json'), 'utf8'));

const categorizeVerb = (verb) => {
  const masuKana = verb.conjugations.masuKana;

  // Exceptions first - all irregular verbs (group 3)
  if (verb.verbGroup === 'irregular') return 'exceptions';

  // Ichidan verbs
  if (verb.verbGroup === 'ichidan') return 'ichidan';

  // Godan patterns
  if (masuKana.endsWith('います')) return 'imasu';
  if (masuKana.endsWith('きます')) return 'kimasu';
  if (masuKana.endsWith('ぎます')) return 'gimasu';
  if (masuKana.endsWith('します')) return 'shimasu';
  if (masuKana.endsWith('ちます')) return 'chimasu';
  if (masuKana.endsWith('にます')) return 'nimasu';
  if (masuKana.endsWith('びます')) return 'bimasu';
  if (masuKana.endsWith('みます')) return 'mimasu';
  if (masuKana.endsWith('ります')) return 'rimasu';

  // Special case: 帰る
  if (verb.kanji === '帰る' && masuKana.endsWith('えます')) return 'rimasu';

  return 'other';
};

const categories = {};
data.verbs.forEach(verb => {
  const cat = categorizeVerb(verb);
  if (!categories[cat]) categories[cat] = [];
  categories[cat].push(`${verb.kanji}(${verb.conjugations.masuKana}→${verb.conjugations.dictionaryKana})`);
});

console.log('📊 Verb distribution by dictionary form rule:\n');
const order = ['ichidan', 'imasu', 'kimasu', 'gimasu', 'shimasu', 'chimasu', 'nimasu', 'bimasu', 'mimasu', 'rimasu', 'exceptions', 'other'];
order.forEach(cat => {
  if (categories[cat]) {
    console.log(`\n${cat}: ${categories[cat].length} verbs`);
    console.log(`Examples: ${categories[cat].slice(0, 5).join(', ')}`);
  }
});

console.log(`\n\n✅ Total: ${data.verbs.length} verbs`);
console.log(`✅ Categorized: ${Object.values(categories).reduce((sum, arr) => sum + arr.length, 0)} verbs`);

if (categories.other) {
  console.log(`\n⚠️  Uncategorized (${categories.other.length}):`);
  console.log(categories.other.join('\n'));
}
