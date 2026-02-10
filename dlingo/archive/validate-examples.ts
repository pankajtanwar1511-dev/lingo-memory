import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

interface DuolingoWord {
  id: string;
  japanese: string;
  english: string;
  type: string;
  exampleSentences?: Array<{
    japanese: string;
    english: string;
    context?: string;
    level?: string;
    isAIGenerated?: boolean;
  }>;
}

interface ValidationResult {
  id: string;
  japanese: string;
  english: string;
  hasIssues: boolean;
  issues: Array<{
    sentenceIndex: number;
    japanese: string;
    english: string;
    reason: string;
  }>;
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function validateWordExamples(word: DuolingoWord): Promise<ValidationResult> {
  if (!word.exampleSentences || word.exampleSentences.length === 0) {
    return {
      id: word.id,
      japanese: word.japanese,
      english: word.english,
      hasIssues: false,
      issues: [],
    };
  }

  const prompt = `You are validating Japanese vocabulary example sentences.

Target word (Japanese): ${word.japanese}
Target word (English): ${word.english}
Word type: ${word.type}

Example sentences:
${word.exampleSentences.map((ex, idx) => `${idx + 1}. Japanese: ${ex.japanese}\n   English: ${ex.english}`).join('\n')}

For each example sentence, verify if it actually uses or contains the target Japanese word "${word.japanese}".
Note: The word might appear in different forms (conjugations, with particles, in kanji vs hiragana, etc.)

Respond in JSON format with an array of issues. If there are no issues, return an empty array.
Format:
[
  {
    "sentenceIndex": <number starting from 1>,
    "reason": "<brief explanation of why this example doesn't match>"
  }
]

Only include sentences that clearly don't contain the target word in any recognizable form.`;

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response (it might be wrapped in markdown code blocks)
    let jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      jsonMatch = responseText.match(/\[[\s\S]*\]/);
    }

    const issuesData = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : [];

    const issues = issuesData.map((issue: any) => ({
      sentenceIndex: issue.sentenceIndex - 1, // Convert to 0-based
      japanese: word.exampleSentences![issue.sentenceIndex - 1].japanese,
      english: word.exampleSentences![issue.sentenceIndex - 1].english,
      reason: issue.reason,
    }));

    return {
      id: word.id,
      japanese: word.japanese,
      english: word.english,
      hasIssues: issues.length > 0,
      issues,
    };
  } catch (error) {
    console.error(`Error validating word ${word.id}:`, error);
    return {
      id: word.id,
      japanese: word.japanese,
      english: word.english,
      hasIssues: false,
      issues: [],
    };
  }
}

async function validateAllWords(
  batchSize: number = 10,
  delayMs: number = 1000,
  wordTypes?: string[]
) {
  const vocabPath = path.join(__dirname, '..', 'public', 'seed-data', 'duolingo_vocab_enhanced.json');
  let words: DuolingoWord[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

  // Filter by word types if specified
  if (wordTypes && wordTypes.length > 0) {
    words = words.filter(w => wordTypes.includes(w.type));
    console.log(`Filtering for word types: ${wordTypes.join(', ')}`);
  }

  console.log(`Starting validation of ${words.length} words...`);
  console.log(`Processing in batches of ${batchSize} with ${delayMs}ms delay between batches\n`);

  const results: ValidationResult[] = [];
  let wordsWithIssues = 0;
  let totalIssues = 0;

  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(words.length / batchSize);

    console.log(`Processing batch ${batchNumber}/${totalBatches} (words ${i + 1}-${Math.min(i + batchSize, words.length)})...`);

    const batchResults = await Promise.all(batch.map(validateWordExamples));
    results.push(...batchResults);

    const batchIssues = batchResults.filter(r => r.hasIssues);
    if (batchIssues.length > 0) {
      console.log(`  Found ${batchIssues.length} words with issues in this batch:`);
      batchIssues.forEach(result => {
        console.log(`    - ${result.japanese} (${result.english}): ${result.issues.length} issue(s)`);
      });
      wordsWithIssues += batchIssues.length;
      totalIssues += batchIssues.reduce((sum, r) => sum + r.issues.length, 0);
    }

    // Delay between batches to avoid rate limiting
    if (i + batchSize < words.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  // Save results
  const typesSuffix = wordTypes && wordTypes.length > 0 ? `-${wordTypes.join('-')}` : '';
  const outputPath = path.join(__dirname, `validation-results${typesSuffix}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✓ Full results saved to: ${outputPath}`);

  // Save words with issues only
  const wordsWithIssuesOnly = results.filter(r => r.hasIssues);
  const issuesPath = path.join(__dirname, `validation-issues${typesSuffix}.json`);
  fs.writeFileSync(issuesPath, JSON.stringify(wordsWithIssuesOnly, null, 2));
  console.log(`✓ Issues-only report saved to: ${issuesPath}`);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total words validated: ${words.length}`);
  console.log(`Words with issues: ${wordsWithIssues} (${((wordsWithIssues / words.length) * 100).toFixed(2)}%)`);
  console.log(`Total example issues found: ${totalIssues}`);
  console.log('='.repeat(60));

  if (wordsWithIssues > 0) {
    console.log('\nSample issues:');
    wordsWithIssuesOnly.slice(0, 5).forEach(result => {
      console.log(`\n${result.japanese} (${result.english}):`);
      result.issues.forEach(issue => {
        console.log(`  - "${issue.japanese}"`);
        console.log(`    Reason: ${issue.reason}`);
      });
    });
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const subsetArg = args.find(arg => arg.startsWith('--subset='));
const subset = subsetArg ? subsetArg.split('=')[1] : 'all';

// Define subsets
const subsets: Record<string, string[]> = {
  'counter': ['counter'],
  'adverb-particle': ['adverb', 'particle'],
  'phrase-pronoun': ['phrase', 'pronoun'],
  'all': []
};

const wordTypes = subsets[subset];

if (!wordTypes && subset !== 'all') {
  console.error(`Unknown subset: ${subset}`);
  console.log(`Available subsets: ${Object.keys(subsets).join(', ')}`);
  process.exit(1);
}

console.log(`Running validation for subset: ${subset}\n`);

// Run validation
validateAllWords(10, 1000, wordTypes.length > 0 ? wordTypes : undefined).catch(console.error);
