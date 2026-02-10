const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/seed-data/N5_verbs_dataset.json'), 'utf8'));

const categorizeVerb = (verb) => {
  const masuKana = verb.conjugations.masuKana;

  // Exceptions first
  if (verb.kanji === '行く') return 'exceptions';

  // 来る and compound 来る verbs are exceptions
  if (verb.kanji === '来る' || verb.kanji.includes('来る')) return 'exceptions';

  // する and compound する verbs follow the して pattern
  if (verb.kanji === 'する' || verb.kanji.endsWith('する')) return 'shite';

  // Ichidan verbs
  if (verb.verbGroup === 'ichidan') return 'ichidan';

  // Godan patterns
  // Special case: 帰る ends in えます but follows ります pattern (historically かえります)
  if (masuKana.endsWith('います') || masuKana.endsWith('ちます') || masuKana.endsWith('ります') ||
      (verb.kanji === '帰る' && masuKana.endsWith('えます'))) {
    return 'itte';
  }
  if (masuKana.endsWith('みます') || masuKana.endsWith('びます') || masuKana.endsWith('にます')) {
    return 'nde';
  }
  if (masuKana.endsWith('きます')) {
    return 'ite';
  }
  if (masuKana.endsWith('ぎます')) {
    return 'ide';
  }
  if (masuKana.endsWith('します')) {
    return 'shite';
  }

  return 'other';
};

const categories = {};
data.verbs.forEach(verb => {
  const cat = categorizeVerb(verb);
  if (!categories[cat]) categories[cat] = [];
  categories[cat].push(`${verb.kanji}(${verb.conjugations.masuKana}→${verb.conjugations.teKana})`);
});

console.log('📊 Verb distribution by te-form rule:\n');
const order = ['ichidan', 'itte', 'nde', 'ite', 'ide', 'shite', 'exceptions', 'other'];
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
