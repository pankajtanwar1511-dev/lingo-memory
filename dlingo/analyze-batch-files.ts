import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const batchFiles = [
  'batch_final.json',
  'batch_remaining.json',
  'batch-verification-summary.json'
];

console.log('BATCH FILES ANALYSIS');
console.log('='.repeat(80));

batchFiles.forEach(filename => {
  const filepath = path.join(__dirname, filename);

  if (!fs.existsSync(filepath)) {
    console.log(`\n❌ ${filename} - NOT FOUND`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

  console.log(`\n📁 ${filename}`);
  console.log('-'.repeat(80));

  if (Array.isArray(data)) {
    console.log(`Type: Array`);
    console.log(`Length: ${data.length} items`);

    if (data.length > 0) {
      const sample = data[0];
      console.log(`\nSample structure:`);
      console.log(JSON.stringify(sample, null, 2).split('\n').slice(0, 15).join('\n'));

      // Check if it has examples
      if (sample.exampleSentences || sample.examples) {
        const withExamples = data.filter((item: any) =>
          (item.exampleSentences && item.exampleSentences.length > 0) ||
          (item.examples && item.examples.length > 0)
        );
        console.log(`\nWords with examples: ${withExamples.length}/${data.length}`);

        if (withExamples.length > 0) {
          const totalExamples = withExamples.reduce((sum: number, item: any) => {
            const count = item.exampleSentences?.length || item.examples?.length || 0;
            return sum + count;
          }, 0);
          console.log(`Total examples: ${totalExamples}`);
        }
      }
    }
  } else {
    console.log(`Type: Object`);
    console.log(JSON.stringify(data, null, 2));
  }
});

console.log('\n' + '='.repeat(80));
