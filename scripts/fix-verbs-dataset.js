const fs = require('fs');
const path = require('path');

// Load the verbs dataset
const dataPath = path.join(__dirname, '../public/seed-data/N5_verbs_dataset.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('Original verbs count:', data.verbs.length);

// Define merging rules for duplicates
const mergeRules = {
  'ある': {
    primaryMeaning: 'exist; be; have',
    meaning: ['exist; be; have', 'to exist, to be (inanimate)', 'to be held, to take place'],
    context: 'existence'
  },
  '送る': {
    primaryMeaning: 'send; escort',
    meaning: ['send; escort', 'to send', 'to see someone off', 'to escort'],
    context: 'transportation'
  },
  '聞く_listen': {
    kanji: '聞く',
    primaryMeaning: 'hear; listen',
    meaning: ['hear; listen', 'to hear', 'to listen'],
    context: 'listening',
    keep: true
  },
  '聞く_ask': {
    kanji: '聞く',
    primaryMeaning: 'ask',
    meaning: ['ask', 'to ask', 'to inquire'],
    context: 'asking',
    keep: true
  },
  '飲む': {
    primaryMeaning: 'drink; take (medicine)',
    meaning: ['drink; take (medicine)', 'to drink', 'to swallow', 'to take (medicine)'],
    context: 'consumption'
  },
  '入る': {
    primaryMeaning: 'enter; join',
    meaning: ['enter; join', 'to enter', 'to join (club, company)', 'to take (bath)'],
    context: 'entering'
  },
  '休む': {
    primaryMeaning: 'rest; take a day off',
    meaning: ['rest; take a day off', 'to rest', 'to take a holiday', 'to be absent'],
    context: 'resting'
  },
  'いる': {
    primaryMeaning: 'exist; be (animate); have',
    meaning: ['exist; be (animate); have', 'to exist (animate)', 'to be', 'to stay', 'to have'],
    context: 'existence'
  },
  '教える_teach': {
    kanji: '教える',
    primaryMeaning: 'teach',
    meaning: ['teach', 'to teach', 'to instruct'],
    context: 'teaching',
    keep: true
  },
  '教える_tell': {
    kanji: '教える',
    primaryMeaning: 'tell; inform',
    meaning: ['tell; inform', 'to tell', 'to inform', 'to teach'],
    context: 'informing',
    keep: true
  },
  'かける': {
    primaryMeaning: 'put on; make (call)',
    meaning: ['put on; make (call)', 'to put on (glasses)', 'to wear (necklace)', 'to make (phone call)'],
    context: 'wearing'
  },
  '出る': {
    primaryMeaning: 'leave; go out; graduate',
    meaning: ['leave; go out; graduate', 'to leave', 'to exit', 'to go out', 'to graduate from'],
    context: 'exiting'
  }
};

// Shorten long meanings
const shortenRules = {
  '掛かる': { primaryMeaning: 'take; cost (time/money)', original: 'take, cost (time or money)' },
  '被る': { primaryMeaning: 'put on (hat)', original: 'put on (a hat, etc.)' },
  '出す': { primaryMeaning: 'take out; send', original: 'take out, hand in, send' },
  '脱ぐ': { primaryMeaning: 'take off (clothes)', original: 'take off (clothes, shoes, etc.)' },
  '履く': { primaryMeaning: 'put on (shoes/pants)', original: 'put on (shoes, trousers, etc.)' },
  '弾く': { primaryMeaning: 'play (instrument)', original: 'play (stringed instruments, piano, etc.)' },
  'いる': { primaryMeaning: 'exist; be (animate)', original: 'exist, be (referring to animate things)' },
  '着る': { primaryMeaning: 'wear; put on (shirt)', original: 'put on (a shirt, etc.)' },
  '辞める': { primaryMeaning: 'quit; retire; stop', original: 'quit or retire from , stop, give up' },
  '案内する': { primaryMeaning: 'show around; guide', original: 'show around, show the way' },
  '見学する': { primaryMeaning: 'tour; visit (to study)', original: 'tour, visit a place to study it' },
  '出張する': { primaryMeaning: 'go on business trip', original: 'go on a business trip' },
  '休む': { primaryMeaning: 'rest; take a day off', original: 'take a rest, take a holiday' }
};

// Process verbs
const processedVerbs = [];
const skipIds = new Set();

// First, handle duplicates that need to be merged
const verbGroups = {};
data.verbs.forEach(verb => {
  const key = verb.kanji;
  if (!verbGroups[key]) {
    verbGroups[key] = [];
  }
  verbGroups[key].push(verb);
});

// Process each verb group
Object.entries(verbGroups).forEach(([kanji, verbs]) => {
  if (verbs.length === 1) {
    // Single verb - just process it
    const verb = verbs[0];

    // Add context field
    verb.context = null;

    // Shorten meaning if needed
    if (shortenRules[kanji]) {
      verb.primaryMeaning = shortenRules[kanji].primaryMeaning;
      console.log(`Shortened: ${kanji} "${shortenRules[kanji].original}" → "${verb.primaryMeaning}"`);
    }

    processedVerbs.push(verb);
  } else {
    // Multiple verbs - check merge rules
    console.log(`\nProcessing duplicate: ${kanji} (${verbs.length} entries)`);

    // Check if we should keep them separate with context
    const keepSeparate = verbs.some(v =>
      (kanji === '聞く') ||
      (kanji === '教える')
    );

    if (keepSeparate) {
      // Keep separate with context tags
      verbs.forEach((verb, idx) => {
        if (kanji === '聞く') {
          if (verb.primaryMeaning.includes('hear') || verb.primaryMeaning.includes('listen')) {
            verb.context = 'listening';
            verb.primaryMeaning = 'hear; listen';
          } else {
            verb.context = 'asking';
            verb.primaryMeaning = 'ask';
          }
        } else if (kanji === '教える') {
          if (verb.primaryMeaning.includes('teach')) {
            verb.context = 'teaching';
            verb.primaryMeaning = 'teach';
          } else {
            verb.context = 'informing';
            verb.primaryMeaning = 'tell; inform';
          }
        }
        processedVerbs.push(verb);
        console.log(`  Kept separate: ${verb.primaryMeaning} [${verb.context}]`);
      });
    } else {
      // Merge into one
      const baseVerb = verbs[0];
      const allMeanings = new Set();

      // Collect all unique meanings
      verbs.forEach(v => {
        v.meaning.forEach(m => {
          if (m && !m.toLowerCase().includes('to shoot')) { // Filter out weird meanings
            allMeanings.add(m);
          }
        });
      });

      // Apply merge rule or create smart merge
      if (mergeRules[kanji]) {
        baseVerb.primaryMeaning = mergeRules[kanji].primaryMeaning;
        baseVerb.meaning = mergeRules[kanji].meaning;
        baseVerb.context = mergeRules[kanji].context;
      } else {
        // Smart merge - combine primary meanings
        const primaries = verbs.map(v => v.primaryMeaning).filter(Boolean);
        baseVerb.primaryMeaning = primaries.join('; ');
        baseVerb.meaning = Array.from(allMeanings);
        baseVerb.context = 'multiple';
      }

      // Apply shortening if needed
      if (shortenRules[kanji]) {
        baseVerb.primaryMeaning = shortenRules[kanji].primaryMeaning;
      }

      processedVerbs.push(baseVerb);
      console.log(`  Merged into: ${baseVerb.primaryMeaning}`);
    }
  }
});

// Update metadata
data.verbs = processedVerbs;
data.metadata.totalEntries = processedVerbs.length;
data.metadata.uniqueVerbs = processedVerbs.length;

// Recalculate group counts
const groups = { godan: 0, ichidan: 0, irregular: 0 };
processedVerbs.forEach(v => {
  groups[v.verbGroup]++;
});
data.metadata.groups = groups;

console.log('\n=== SUMMARY ===');
console.log('Original verbs:', verbGroups.length);
console.log('After processing:', processedVerbs.length);
console.log('Groups:', groups);

// Save the updated dataset
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('\n✅ Updated dataset saved to:', dataPath);
console.log('✅ Backup available at: N5_verbs_dataset.json.backup');
