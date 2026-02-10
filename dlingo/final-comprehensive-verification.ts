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

console.log('COMPREHENSIVE FINAL VERIFICATION');
console.log('='.repeat(80));

// Load final vocabulary
const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
const vocab: Word[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

console.log(`✓ Loaded ${vocab.length} words\n`);

// Create a set of all allowed Japanese words
const allowedWords = new Set<string>();
vocab.forEach(w => {
  allowedWords.add(w.japanese);
});

console.log(`✓ Created vocabulary set: ${allowedWords.size} unique Japanese words\n`);

console.log('='.repeat(80));
console.log('VERIFICATION CHECKS');
console.log('='.repeat(80));

// Check 1: Duplicate IDs
console.log('\n1. CHECKING FOR DUPLICATE IDs...');
const idSet = new Set<string>();
const duplicateIds: string[] = [];
vocab.forEach(w => {
  if (idSet.has(w.id)) {
    duplicateIds.push(w.id);
  }
  idSet.add(w.id);
});
console.log(`   ${duplicateIds.length === 0 ? '✅' : '❌'} Duplicate IDs: ${duplicateIds.length}`);
if (duplicateIds.length > 0) {
  duplicateIds.forEach(id => console.log(`      - ${id}`));
}

// Check 2: Duplicate examples within each word
console.log('\n2. CHECKING FOR DUPLICATE EXAMPLES WITHIN WORDS...');
let wordsWithDuplicates = 0;
const duplicateExampleDetails: string[] = [];

vocab.forEach(word => {
  if (!word.exampleSentences) return;

  const exampleSet = new Set<string>();
  const duplicates: string[] = [];

  word.exampleSentences.forEach(ex => {
    const key = `${ex.japanese}|||${ex.english}`;
    if (exampleSet.has(key)) {
      duplicates.push(ex.japanese);
    }
    exampleSet.add(key);
  });

  if (duplicates.length > 0) {
    wordsWithDuplicates++;
    duplicateExampleDetails.push(`      ${word.id} (${word.japanese}): ${duplicates.length} duplicate(s)`);
  }
});

console.log(`   ${wordsWithDuplicates === 0 ? '✅' : '❌'} Words with duplicate examples: ${wordsWithDuplicates}`);
if (duplicateExampleDetails.length > 0) {
  duplicateExampleDetails.slice(0, 10).forEach(d => console.log(d));
  if (duplicateExampleDetails.length > 10) {
    console.log(`      ... and ${duplicateExampleDetails.length - 10} more`);
  }
}

// Check 3: Duplicate examples across all words
console.log('\n3. CHECKING FOR DUPLICATE EXAMPLES ACROSS ALL WORDS...');
const allExamplesSet = new Set<string>();
const duplicateAcrossWords: string[] = [];
let totalExamples = 0;

vocab.forEach(word => {
  if (!word.exampleSentences) return;

  word.exampleSentences.forEach(ex => {
    totalExamples++;
    const key = `${ex.japanese}|||${ex.english}`;
    if (allExamplesSet.has(key)) {
      duplicateAcrossWords.push(`"${ex.japanese}" in ${word.id} (${word.japanese})`);
    }
    allExamplesSet.add(key);
  });
});

console.log(`   ${duplicateAcrossWords.length === 0 ? '✅' : '❌'} Duplicate examples across words: ${duplicateAcrossWords.length}`);
if (duplicateAcrossWords.length > 0) {
  duplicateAcrossWords.slice(0, 5).forEach(d => console.log(`      - ${d}`));
  if (duplicateAcrossWords.length > 5) {
    console.log(`      ... and ${duplicateAcrossWords.length - 5} more`);
  }
}

// Check 4: Verify all words have required fields
console.log('\n4. CHECKING REQUIRED FIELDS...');
const missingFields: string[] = [];

vocab.forEach(word => {
  const missing: string[] = [];
  if (!word.id) missing.push('id');
  if (!word.japanese) missing.push('japanese');
  if (!word.english) missing.push('english');
  if (!word.type) missing.push('type');

  if (missing.length > 0) {
    missingFields.push(`${word.id || 'UNKNOWN'}: missing ${missing.join(', ')}`);
  }
});

console.log(`   ${missingFields.length === 0 ? '✅' : '❌'} Words with missing fields: ${missingFields.length}`);
if (missingFields.length > 0) {
  missingFields.forEach(f => console.log(`      - ${f}`));
}

// Check 5: Verify all examples have required fields
console.log('\n5. CHECKING EXAMPLE SENTENCE FIELDS...');
let examplesWithMissingFields = 0;
const exampleFieldIssues: string[] = [];

vocab.forEach(word => {
  if (!word.exampleSentences) return;

  word.exampleSentences.forEach((ex, idx) => {
    const missing: string[] = [];
    if (!ex.japanese) missing.push('japanese');
    if (!ex.english) missing.push('english');
    if (!ex.context) missing.push('context');
    if (!ex.level) missing.push('level');
    if (ex.isAIGenerated === undefined) missing.push('isAIGenerated');

    if (missing.length > 0) {
      examplesWithMissingFields++;
      exampleFieldIssues.push(`${word.id} example #${idx + 1}: missing ${missing.join(', ')}`);
    }
  });
});

console.log(`   ${examplesWithMissingFields === 0 ? '✅' : '❌'} Examples with missing fields: ${examplesWithMissingFields}`);
if (exampleFieldIssues.length > 0) {
  exampleFieldIssues.slice(0, 10).forEach(f => console.log(`      - ${f}`));
  if (exampleFieldIssues.length > 10) {
    console.log(`      ... and ${exampleFieldIssues.length - 10} more`);
  }
}

// Check 6: Verify vocabulary usage in examples (simplified check)
console.log('\n6. CHECKING VOCABULARY USAGE IN EXAMPLES...');
console.log('   (Checking if example sentences contain unfamiliar character patterns)');

// This is a simplified check - we look for words that seem out of place
// A proper tokenizer would be needed for complete verification
const suspiciousExamples: string[] = [];
let checkedExamples = 0;

vocab.forEach(word => {
  if (!word.exampleSentences) return;

  word.exampleSentences.forEach(ex => {
    checkedExamples++;

    // Check if the target word appears in the example
    if (!ex.japanese.includes(word.japanese)) {
      // Some exceptions for particles and conjugations
      const isException = ['を', 'に', 'は', 'が', 'で', 'と', 'の', 'も', 'か', 'な', 'よ', 'ね'].includes(word.japanese);

      if (!isException) {
        suspiciousExamples.push(`${word.id} (${word.japanese}): Example doesn't contain target word - "${ex.japanese}"`);
      }
    }
  });
});

console.log(`   ℹ️  Checked ${checkedExamples} examples`);
console.log(`   ${suspiciousExamples.length === 0 ? '✅' : '⚠️ '} Examples not containing target word: ${suspiciousExamples.length}`);
if (suspiciousExamples.length > 0) {
  suspiciousExamples.slice(0, 5).forEach(s => console.log(`      - ${s}`));
  if (suspiciousExamples.length > 5) {
    console.log(`      ... and ${suspiciousExamples.length - 5} more`);
  }
}

// Check 7: Verify minimum examples per word
console.log('\n7. CHECKING MINIMUM EXAMPLES PER WORD...');
const wordsWithLessThan3 = vocab.filter(w => (w.exampleSentences?.length || 0) < 3);
console.log(`   ${wordsWithLessThan3.length === 0 ? '✅' : '❌'} Words with <3 examples: ${wordsWithLessThan3.length}`);
if (wordsWithLessThan3.length > 0) {
  wordsWithLessThan3.slice(0, 10).forEach(w => {
    console.log(`      - ${w.id} (${w.japanese}): ${w.exampleSentences?.length || 0} examples`);
  });
}

// Check 8: Verify context values
console.log('\n8. CHECKING CONTEXT VALUES...');
const validContexts = ['statement', 'question', 'answer'];
let invalidContextCount = 0;
const invalidContextExamples: string[] = [];

vocab.forEach(word => {
  if (!word.exampleSentences) return;

  word.exampleSentences.forEach((ex, idx) => {
    if (!validContexts.includes(ex.context)) {
      invalidContextCount++;
      invalidContextExamples.push(`${word.id} example #${idx + 1}: "${ex.context}"`);
    }
  });
});

console.log(`   ${invalidContextCount === 0 ? '✅' : '❌'} Invalid context values: ${invalidContextCount}`);
if (invalidContextExamples.length > 0) {
  invalidContextExamples.slice(0, 5).forEach(e => console.log(`      - ${e}`));
}

// Check 9: Verify level format
console.log('\n9. CHECKING LEVEL FORMAT...');
const levelPattern = /^[1-3]-[1-9]$/;
let invalidLevelCount = 0;
const invalidLevelExamples: string[] = [];

vocab.forEach(word => {
  if (!word.exampleSentences) return;

  word.exampleSentences.forEach((ex, idx) => {
    if (!levelPattern.test(ex.level)) {
      invalidLevelCount++;
      invalidLevelExamples.push(`${word.id} example #${idx + 1}: "${ex.level}"`);
    }
  });
});

console.log(`   ${invalidLevelCount === 0 ? '✅' : '❌'} Invalid level formats: ${invalidLevelCount}`);
if (invalidLevelExamples.length > 0) {
  invalidLevelExamples.slice(0, 5).forEach(e => console.log(`      - ${e}`));
}

// Summary
console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));

const totalIssues =
  duplicateIds.length +
  wordsWithDuplicates +
  duplicateAcrossWords.length +
  missingFields.length +
  examplesWithMissingFields +
  wordsWithLessThan3.length +
  invalidContextCount +
  invalidLevelCount;

console.log(`\nTotal issues found: ${totalIssues}`);
console.log(`\n📊 Statistics:`);
console.log(`   - Total words: ${vocab.length}`);
console.log(`   - Total examples: ${totalExamples}`);
console.log(`   - Unique examples: ${allExamplesSet.size}`);
console.log(`   - Average examples per word: ${(totalExamples / vocab.length).toFixed(2)}`);

if (totalIssues === 0) {
  console.log('\n' + '='.repeat(80));
  console.log('🎉 VERIFICATION PASSED! DATA IS CLEAN AND READY! 🎉');
  console.log('='.repeat(80));
} else {
  console.log('\n' + '='.repeat(80));
  console.log('⚠️  VERIFICATION FOUND ISSUES - Please review above');
  console.log('='.repeat(80));
}

// Save detailed report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalWords: vocab.length,
    totalExamples,
    uniqueExamples: allExamplesSet.size,
    totalIssues
  },
  issues: {
    duplicateIds: duplicateIds.length,
    wordsWithDuplicateExamples: wordsWithDuplicates,
    duplicateExamplesAcrossWords: duplicateAcrossWords.length,
    missingFields: missingFields.length,
    examplesWithMissingFields,
    wordsWithLessThan3Examples: wordsWithLessThan3.length,
    invalidContexts: invalidContextCount,
    invalidLevels: invalidLevelCount
  },
  details: {
    duplicateIds,
    duplicateExamples: duplicateExampleDetails,
    suspiciousExamples: suspiciousExamples.slice(0, 20),
    invalidContextExamples: invalidContextExamples.slice(0, 20),
    invalidLevelExamples: invalidLevelExamples.slice(0, 20)
  }
};

const reportPath = path.join(__dirname, 'final-verification-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n📄 Detailed report saved: final-verification-report.json`);
