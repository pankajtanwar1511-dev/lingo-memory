import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ExampleSentence {
  japanese: string;
  english: string;
  context?: 'statement' | 'question' | 'answer';
  relatedTip?: string;
  level: string;
  isAIGenerated: boolean;
}

interface DuolingoWord {
  id: string;
  japanese: string;
  english: string;
  type: string;
  subtype?: string;
  exampleSentences?: ExampleSentence[];
}

interface AIResponse {
  updatedWords: Array<{
    id: string;
    exampleSentences: ExampleSentence[];
  }>;
}

// Read the AI response JSON file
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Error: Please provide the AI response JSON file path');
  console.error('Usage: npx ts-node merge-ai-examples.ts <ai-response.json>');
  process.exit(1);
}

const aiResponsePath = args[0];
if (!fs.existsSync(aiResponsePath)) {
  console.error(`❌ Error: File not found: ${aiResponsePath}`);
  process.exit(1);
}

console.log('🔄 Merging AI-generated examples...\n');

// Read files
const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
const vocabData: DuolingoWord[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));
const aiResponse: AIResponse = JSON.parse(fs.readFileSync(aiResponsePath, 'utf-8'));

console.log(`📚 Total vocabulary: ${vocabData.length}`);
console.log(`🤖 AI examples received: ${aiResponse.updatedWords.length}\n`);

// Create a map for quick lookup
const aiExamplesMap = new Map<string, ExampleSentence[]>();
aiResponse.updatedWords.forEach(word => {
  aiExamplesMap.set(word.id, word.exampleSentences);
});

// Merge examples
let wordsUpdated = 0;
let examplesAdded = 0;
const errors: string[] = [];

vocabData.forEach(word => {
  if (aiExamplesMap.has(word.id)) {
    const aiExamples = aiExamplesMap.get(word.id)!;

    // Validate examples
    const validExamples = aiExamples.filter(ex => {
      if (!ex.japanese || !ex.english || !ex.level) {
        errors.push(`${word.id} (${word.japanese}): Missing required fields`);
        return false;
      }
      return true;
    });

    if (validExamples.length > 0) {
      // Merge with existing examples (if any)
      if (!word.exampleSentences) {
        word.exampleSentences = [];
      }

      word.exampleSentences.push(...validExamples);
      wordsUpdated++;
      examplesAdded += validExamples.length;

      console.log(`   ✅ ${word.japanese.padEnd(20)} → +${validExamples.length} AI examples`);
    }
  }
});

console.log(`\n📊 SUMMARY`);
console.log('='.repeat(50));
console.log(`Words updated: ${wordsUpdated}`);
console.log(`AI examples added: ${examplesAdded}`);
console.log(`Average examples per word: ${(examplesAdded / wordsUpdated).toFixed(1)}`);

if (errors.length > 0) {
  console.log(`\n⚠️  Errors found: ${errors.length}`);
  errors.slice(0, 10).forEach(err => console.log(`   - ${err}`));
  if (errors.length > 10) {
    console.log(`   ... and ${errors.length - 10} more`);
  }
}

// Save updated data
console.log(`\n💾 Saving updated vocabulary...`);
fs.writeFileSync(vocabPath, JSON.stringify(vocabData, null, 2), 'utf-8');
console.log(`   ✅ Saved to ${vocabPath}`);

// Create backup
const backupPath = path.join(__dirname, `../public/seed-data/duolingo_vocab_enhanced.backup_${Date.now()}.json`);
fs.copyFileSync(vocabPath, backupPath);
console.log(`   ✅ Backup created: ${path.basename(backupPath)}\n`);

console.log('✅ Merge complete!\n');

// Final statistics
const finalWithExamples = vocabData.filter(w => w.exampleSentences && w.exampleSentences.length > 0).length;
const finalTotalExamples = vocabData.reduce((sum, w) => sum + (w.exampleSentences?.length || 0), 0);
const aiGeneratedCount = vocabData.reduce((sum, w) =>
  sum + (w.exampleSentences?.filter(ex => ex.isAIGenerated).length || 0), 0
);
const duolingoCount = finalTotalExamples - aiGeneratedCount;

console.log('📊 FINAL DATASET STATISTICS');
console.log('='.repeat(50));
console.log(`Total vocabulary: ${vocabData.length}`);
console.log(`Words with examples: ${finalWithExamples} (${(finalWithExamples / vocabData.length * 100).toFixed(1)}%)`);
console.log(`Total examples: ${finalTotalExamples}`);
console.log(`  - Duolingo examples: ${duolingoCount}`);
console.log(`  - AI-generated examples: ${aiGeneratedCount}`);
console.log(`Average examples per word: ${(finalTotalExamples / finalWithExamples).toFixed(1)}\n`);
