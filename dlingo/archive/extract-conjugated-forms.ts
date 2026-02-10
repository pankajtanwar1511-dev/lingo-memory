import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ExampleSentence {
  japanese: string;
  english: string;
  context: string;
  level: string;
  isAIGenerated: boolean;
}

interface Word {
  id: string;
  japanese: string;
  english: string;
  type: string;
  exampleSentences?: ExampleSentence[];
}

console.log('EXTRACTING EXAMPLES WITH CONJUGATED/VARIANT FORMS');
console.log('='.repeat(80));

const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
const vocab: Word[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

const conjugatedExamples: any[] = [];

vocab.forEach(word => {
  if (!word.exampleSentences) return;

  word.exampleSentences.forEach((ex, idx) => {
    // Check if the target word appears in the example
    if (!ex.japanese.includes(word.japanese)) {
      // Some exceptions for particles and single characters
      const isException = ['を', 'に', 'は', 'が', 'で', 'と', 'の', 'も', 'か', 'な', 'よ', 'ね', 'や'].includes(word.japanese);

      if (!isException) {
        conjugatedExamples.push({
          wordId: word.id,
          targetWord: word.japanese,
          englishMeaning: word.english,
          wordType: word.type,
          exampleNumber: idx + 1,
          exampleJapanese: ex.japanese,
          exampleEnglish: ex.english,
          context: ex.context,
          level: ex.level,
          isAIGenerated: ex.isAIGenerated
        });
      }
    }
  });
});

console.log(`Found ${conjugatedExamples.length} examples with conjugated/variant forms\n`);

// Create markdown report for Claude AI
let markdown = `# Examples with Conjugated/Variant Forms - Verification Report

**Total Examples**: ${conjugatedExamples.length}

Please verify if these examples are valid conjugations/variations of the target words, or if they should be corrected.

---

`;

conjugatedExamples.forEach((ex, idx) => {
  markdown += `## ${idx + 1}. Word: **${ex.targetWord}** (${ex.englishMeaning}) [${ex.wordType}]\n\n`;
  markdown += `- **Word ID**: ${ex.wordId}\n`;
  markdown += `- **Target Word**: ${ex.targetWord}\n`;
  markdown += `- **Example Japanese**: ${ex.exampleJapanese}\n`;
  markdown += `- **Example English**: ${ex.exampleEnglish}\n`;
  markdown += `- **Context**: ${ex.context}\n`;
  markdown += `- **Level**: ${ex.level}\n`;
  markdown += `- **AI Generated**: ${ex.isAIGenerated}\n`;
  markdown += `\n**Verification Needed**: Does "${ex.exampleJapanese}" contain a valid conjugation/variation of "${ex.targetWord}"?\n\n`;
  markdown += `---\n\n`;
});

// Save markdown report
const reportPath = path.join(__dirname, 'conjugated-forms-verification.md');
fs.writeFileSync(reportPath, markdown);
console.log(`✓ Markdown report saved: conjugated-forms-verification.md\n`);

// Also save as JSON for programmatic access
const jsonReportPath = path.join(__dirname, 'conjugated-forms-verification.json');
fs.writeFileSync(jsonReportPath, JSON.stringify(conjugatedExamples, null, 2));
console.log(`✓ JSON report saved: conjugated-forms-verification.json\n`);

// Print summary by type
console.log('SUMMARY BY WORD TYPE:');
console.log('='.repeat(80));
const byType = new Map<string, number>();
conjugatedExamples.forEach(ex => {
  byType.set(ex.wordType, (byType.get(ex.wordType) || 0) + 1);
});

Array.from(byType.entries())
  .sort((a, b) => b[1] - a[1])
  .forEach(([type, count]) => {
    console.log(`  ${type}: ${count} examples`);
  });

// Print first 10 examples
console.log('\n' + '='.repeat(80));
console.log('FIRST 10 EXAMPLES:');
console.log('='.repeat(80));

conjugatedExamples.slice(0, 10).forEach((ex, idx) => {
  console.log(`\n${idx + 1}. ${ex.wordId} - ${ex.targetWord} (${ex.englishMeaning})`);
  console.log(`   Target: "${ex.targetWord}"`);
  console.log(`   Example: "${ex.exampleJapanese}"`);
  console.log(`   English: "${ex.exampleEnglish}"`);
});

console.log('\n' + '='.repeat(80));
console.log('✅ Reports ready for Claude AI verification!');
console.log('='.repeat(80));
