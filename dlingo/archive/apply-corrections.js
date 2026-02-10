const fs = require('fs');
const path = require('path');

// Read the current JSON data
const dataPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Define all corrections based on Claude's review
const corrections = {
  // ROUND 1: Misclassified as "noun" - should be "adverb"
  '後で': 'adverb',
  'もうすこし': 'adverb',
  'まっすぐ': 'adverb',
  'どうやって': 'adverb',
  'いっしょに': 'adverb',

  // ROUND 1: Misclassified as "noun" - should be "adjective"
  'キラキラ': 'adjective',
  'ふわふわ': 'adjective',
  'ボロボロ': 'adjective',
  'むりょう': 'adjective',

  // ROUND 1: Misclassified as "verb" - should be "adjective"
  'いたいです': 'adjective',
  'つめたい': 'adjective',

  // ROUND 1: Misclassified as "noun" - should be "counter"
  '万': 'counter',

  // ROUND 1: Grammar patterns - should be "phrase"
  'がいいです': 'phrase',
  'がだいすきです': 'phrase',
  'がすきです': 'phrase',
  'がすきですか': 'phrase',
  'はすきですか': 'phrase',
  'がほしいです': 'phrase',
  'がたのしみです': 'phrase',
  'ができます': 'phrase',

  // ROUND 1: Color words - should be "adjective"
  'きいろい': 'adjective',
  'あおい': 'adjective',
  'あかい': 'adjective',
  'しろい': 'adjective',
  'くろい': 'adjective',

  // ROUND 1: Other corrections
  'カラフルな': 'adjective',
  'すきな': 'adjective',

  // ROUND 1: Phrases that should be "noun"
  'ショッピングセンター': 'noun',
  'ジェットコースター': 'noun',

  // ROUND 2: noun → adverb
  '今': 'adverb',
  'さいきん': 'adverb',
  '前に': 'adverb',
  'はじめて': 'adverb',
  'ぜんぶで': 'adverb',
  'いろいろ': 'adverb',

  // ROUND 2: counter → adverb
  'ひとりで': 'adverb',

  // ROUND 2: noun → adjective
  'プロの': 'adjective',
  'おしゃれ': 'adjective',
  'あたまがいい': 'adjective',

  // ROUND 2: counter → noun (Japan is not a counter!)
  'にほん': 'noun',

  // ROUND 2: noun → other (demonstratives/determiners)
  'この': 'other',
  'その': 'other',
  'あの': 'other',
  'どの': 'other',
  'どんな': 'other',
  'つぎの': 'other',

  // ROUND 2: noun → phrase
  'ぐあいがわるい': 'phrase',
  'どうですか': 'phrase',
  'じゃないです': 'phrase',

  // ROUND 2: noun → verb (question forms)
  'ありますか': 'verb',
  'はいますか': 'verb',

  // ROUND 2: Interjections (using 'other' category)
  'ええと': 'other',
  'あ': 'other',
  'いいえ': 'other',
  'はい': 'other',

  // ROUND 2: Greetings/set phrases
  'こんにちは': 'phrase',
  'こんばんは': 'phrase',
  'またあした': 'phrase',
  'じゃあね': 'phrase',
  'じゃあ': 'phrase',
  'ようこそ': 'phrase',

  // ROUND 2: Particle
  'も': 'particle',

  // ROUND 3: Conjunctions
  'でも': 'other',
  'そして': 'other',

  // ROUND 3: noun → other (copula)
  'です': 'other',

  // ROUND 3: noun → phrase (set expressions/questions)
  'ください': 'phrase',
  'ほんとうですか': 'phrase',
  '何ですか': 'phrase',
  'はちょっと': 'phrase',

  // ROUND 3: noun → adverb (interrogative adverbs)
  'どう': 'adverb',
  'いつ': 'adverb',

  // ROUND 3: noun → pronoun (interrogative pronouns)
  'だれ': 'pronoun',
  '何': 'pronoun',
  'どこ': 'pronoun',

  // ROUND 3: noun → pronoun (demonstrative pronouns)
  'ここ': 'pronoun',
  'そこ': 'pronoun',
  'あそこ': 'pronoun',
  'これ': 'pronoun',
  'それ': 'pronoun',
  'あれ': 'pronoun',
  'こちら': 'pronoun',

  // ROUND 3: noun → pronoun (personal pronouns)
  '私': 'pronoun',
  'かのじょ': 'pronoun',

  // ROUND 3: verb → phrase (set expressions/greetings)
  'よろしくおねがいします': 'phrase',
  'ありがとうございます': 'phrase',
  'すみません': 'phrase',
  'おはようございます': 'phrase',
  'おねがいします': 'phrase',

  // ROUND 4: phrase → noun (compound nouns)
  'コミュニティーセンター': 'noun',
  'インフォメーション': 'noun',
  'にゅうじょうりょう': 'noun',

  // ROUND 4: noun → pronoun (plural demonstratives)
  'これら': 'pronoun',
  'それら': 'pronoun',
};

// Meaning corrections (English translations)
const meaningCorrections = {
  'まず': 'first, first of all',
  'はいります': 'enter, join, go in',
  '会いたくないです': "don't want to see, don't want to meet",
  'あめ': 'rain',
  'ゆき': 'snow',
  'いたいです': 'hurts, painful, it hurts',
  'ひきます': 'play (instrument), pull, look up',
  '先生': 'teacher, professor, Mr., Miss',
  'いつも': 'always, all the time',
  '雨': 'rain',
  'くもり': 'cloudy weather, cloudiness',
  'はれ': 'clear weather, sunny',
  'まち': 'town, city',
};

// Apply corrections
let correctedCount = 0;
let meaningCorrectedCount = 0;

data.forEach(word => {
  // Apply category corrections
  if (corrections[word.japanese]) {
    console.log(`Correcting category: ${word.japanese} from ${word.type} to ${corrections[word.japanese]}`);
    word.type = corrections[word.japanese];
    correctedCount++;
  }

  // Apply meaning corrections
  if (meaningCorrections[word.japanese]) {
    console.log(`Correcting meaning: ${word.japanese} from "${word.english}" to "${meaningCorrections[word.japanese]}"`);
    word.english = meaningCorrections[word.japanese];
    meaningCorrectedCount++;
  }
});

// Save corrected data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`\n✅ Applied ${correctedCount} category corrections`);
console.log(`✅ Applied ${meaningCorrectedCount} meaning corrections`);

// Regenerate the markdown review file
let md = '# Duolingo Vocabulary Categorization Review\n\n';
md += 'Total: ' + data.length + ' words\n\n';
md += '**Updated based on Claude\'s review**\n\n';

// Count by type
const typeCounts = {};
data.forEach(w => {
  typeCounts[w.type] = (typeCounts[w.type] || 0) + 1;
});

md += '## Distribution:\n';
Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
  md += `- **${type}**: ${count}\n`;
});

md += '\n| Japanese | Category | English |\n';
md += '|----------|----------|----------|\n';

data.forEach(word => {
  md += `| ${word.japanese} | ${word.type} | ${word.english} |\n`;
});

const mdPath = path.join(__dirname, 'categorization-review.md');
fs.writeFileSync(mdPath, md);
console.log(`✅ Updated categorization-review.md`);
console.log('\n📊 New distribution:');
Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
  console.log(`  - ${type}: ${count}`);
});
