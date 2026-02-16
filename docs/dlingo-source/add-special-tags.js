const fs = require('fs');
const path = require('path');

// Read the special.json file
const filePath = path.join(__dirname, 'special.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Rules for marking words as special
function isSpecialWord(word) {
  // Rule 1: Question words
  if (word.type === 'question') {
    return { special: true, reason: 'question' };
  }

  // Rule 2: Words with multiple readings (contains /)
  if (word.japanese.includes('/')) {
    return { special: true, reason: 'multiple-readings' };
  }

  // Rule 3: Irregular counters and exceptions
  const irregularPatterns = [
    // People counters
    'ひとり', 'ふたり',
    // Days of month
    'ついたち', 'ふつか', 'みっか', 'よっか', 'いつか', 'むいか', 'なのか', 'ようか', 'ここのか', 'とおか', 'はつか',
    // Age exception
    'はたち',
    // Sound changes in hundreds
    'さんびゃく', 'ろっぴゃく', 'はっぴゃく',
    // Sound changes in thousands
    'さんぜん', 'はっせん',
    // Special time readings
    'よじ', 'くじ', 'しちじ',
    // Special minute readings
    'いっぷん', 'さんぷん', 'よんぷん', 'ろっぷん', 'はっぷん', 'じゅっぷん', 'じっぷん',
    // General things counter
    'ひとつ', 'ふたつ', 'みっつ', 'よっつ', 'いつつ', 'むっつ', 'ななつ', 'やっつ', 'ここのつ', 'とお',
    // Floor exception
    'ちかいっかい',
    // Long things counters with sound changes
    'さんぼん', 'ろっぽん', 'はっぽん', 'じゅっぽん',
    // Cups with sound changes
    'さんばい', 'ろっぱい', 'はっぱい', 'じゅっぱい',
    // Small animals with sound changes
    'さんびき', 'ろっぴき', 'はっぴき', 'じゅっぴき',
    // Shoes/socks with sound changes
    'さんぞく', 'はっそく', 'じゅっそく',
    // Houses with sound changes
    'さんげん', 'はっけん', 'じゅっけん',
    // Floors with sound changes
    'さんがい', 'ろっかい', 'はっかい', 'じゅっかい', 'じっかい',
    // Books with sound changes
    'いっさつ', 'はっさつ', 'じゅっさつ', 'じっさつ',
    // Clothes with sound changes
    'いっちゃく', 'はっちゃく', 'じゅっちゃく',
    // Frequency with sound changes
    'いっかい', 'ろっかい', 'はっかい', 'じゅっかい', 'じっかい',
    // Small things with sound changes
    'いっこ', 'ろっこ', 'はっこ', 'じゅっこ', 'じっこ',
    // Age with sound changes
    'いっさい', 'はっさい', 'じゅっさい', 'じっさい',
    // Machines with sound changes
    'いちだい'
  ];

  for (const pattern of irregularPatterns) {
    if (word.japanese.includes(pattern)) {
      return { special: true, reason: 'irregular' };
    }
  }

  return { special: false };
}

// Process all categories
data.vocabularyCategories.forEach(category => {
  category.subcategories.forEach(subcategory => {
    subcategory.words.forEach(word => {
      const specialInfo = isSpecialWord(word);
      if (specialInfo.special) {
        word.special = true;
        word.specialReason = specialInfo.reason;
      }
    });
  });
});

// Write the updated data back
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

// Count special words
let specialCount = 0;
let reasonCounts = {};

data.vocabularyCategories.forEach(category => {
  category.subcategories.forEach(subcategory => {
    subcategory.words.forEach(word => {
      if (word.special) {
        specialCount++;
        reasonCounts[word.specialReason] = (reasonCounts[word.specialReason] || 0) + 1;
      }
    });
  });
});

console.log(`✅ Added special tags to ${specialCount} words!`);
console.log('Breakdown by reason:');
console.log(JSON.stringify(reasonCounts, null, 2));
