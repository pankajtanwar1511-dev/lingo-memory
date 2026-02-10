const fs = require('fs');
const path = require('path');

// Load the verbs dataset
const dataPath = path.join(__dirname, '../public/seed-data/N5_verbs_dataset.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('Enhancing verb examples with kana and better context...\n');

// Enhanced examples with kana versions and better context
const enhancedExamples = {
  '会う': [
    {
      japanese: '明日、友達に会います。',
      kana: 'あした、ともだちにあいます。',
      english: 'I will meet my friend tomorrow.',
      highlight: 'meeting someone'
    },
    {
      japanese: '駅で午後三時に会いましょう。',
      kana: 'えきでごごさんじにあいましょう。',
      english: "Let's meet at the station at 3 PM.",
      highlight: 'arranging a meeting'
    }
  ],
  '遊ぶ': [
    {
      japanese: '週末、公園で子供たちが遊びます。',
      kana: 'しゅうまつ、こうえんでこどもたちがあそびます。',
      english: 'Children play in the park on weekends.',
      highlight: 'playing for fun'
    },
    {
      japanese: '友達と一緒にゲームで遊びました。',
      kana: 'ともだちといっしょにゲームであそびました。',
      english: 'I played games together with my friends.',
      highlight: 'playing games'
    }
  ],
  '洗う': [
    {
      japanese: '毎朝、顔を洗います。',
      kana: 'まいあさ、かおをあらいます。',
      english: 'I wash my face every morning.',
      highlight: 'daily routine'
    },
    {
      japanese: '食べる前に手を洗ってください。',
      kana: 'たべるまえにてをあらってください。',
      english: 'Please wash your hands before eating.',
      highlight: 'hygiene instruction'
    }
  ],
  'ある': [
    {
      japanese: '机の上に本があります。',
      kana: 'つくえのうえにほんがあります。',
      english: 'There is a book on the desk.',
      highlight: 'location of things'
    },
    {
      japanese: '来週、大切な試験があります。',
      kana: 'らいしゅう、たいせつなしけんがあります。',
      english: 'There is an important exam next week.',
      highlight: 'upcoming event'
    },
    {
      japanese: '私は車がありません。',
      kana: 'わたしはくるまがありません。',
      english: "I don't have a car.",
      highlight: 'possession'
    }
  ],
  '歩く': [
    {
      japanese: '毎日、駅まで歩いて行きます。',
      kana: 'まいにち、えきまであるいていきます。',
      english: 'I walk to the station every day.',
      highlight: 'daily commute'
    },
    {
      japanese: '公園をゆっくり歩きましょう。',
      kana: 'こうえんをゆっくりあるきましょう。',
      english: "Let's walk slowly in the park.",
      highlight: 'leisurely walk'
    }
  ],
  '言う': [
    {
      japanese: '先生は「静かにしてください」と言いました。',
      kana: 'せんせいは「しずかにしてください」といいました。',
      english: 'The teacher said "Please be quiet."',
      highlight: 'quoting speech'
    },
    {
      japanese: '彼はいつも本当のことを言います。',
      kana: 'かれはいつもほんとうのことをいいます。',
      english: 'He always tells the truth.',
      highlight: 'stating facts'
    }
  ],
  '行く': [
    {
      japanese: '来週、日本に行きます。',
      kana: 'らいしゅう、にほんにいきます。',
      english: 'I will go to Japan next week.',
      highlight: 'travel plans'
    },
    {
      japanese: '毎朝、学校に行きます。',
      kana: 'まいあさ、がっこうにいきます。',
      english: 'I go to school every morning.',
      highlight: 'daily routine'
    }
  ],
  '急ぐ': [
    {
      japanese: '電車に遅れるので、急いでください。',
      kana: 'でんしゃにおくれるので、いそいでください。',
      english: "Please hurry, or you'll miss the train.",
      highlight: 'urgent situation'
    },
    {
      japanese: '時間がないから、急ぎましょう。',
      kana: 'じかんがないから、いそぎましょう。',
      english: "Let's hurry because there's no time.",
      highlight: 'time pressure'
    }
  ],
  '売る': [
    {
      japanese: 'この店は新鮮な魚を売っています。',
      kana: 'このみせはしんせんなさかなをうっています。',
      english: 'This store sells fresh fish.',
      highlight: 'retail business'
    },
    {
      japanese: '古い本をインターネットで売りました。',
      kana: 'ふるいほんをインターネットでうりました。',
      english: 'I sold my old books on the internet.',
      highlight: 'online selling'
    }
  ],
  '買う': [
    {
      japanese: 'スーパーで野菜と肉を買います。',
      kana: 'スーパーでやさいとにくをかいます。',
      english: 'I buy vegetables and meat at the supermarket.',
      highlight: 'grocery shopping'
    },
    {
      japanese: '友達に誕生日プレゼントを買いました。',
      kana: 'ともだちにたんじょうびプレゼントをかいました。',
      english: 'I bought a birthday present for my friend.',
      highlight: 'gift buying'
    }
  ]
};

// Process verbs and add enhanced examples
let enhancedCount = 0;
data.verbs.forEach(verb => {
  if (verb.examples && verb.examples.length > 0) {
    // Add kana to existing examples if not enhanced
    if (enhancedExamples[verb.kanji]) {
      verb.examples = enhancedExamples[verb.kanji];
      enhancedCount++;
      console.log(`✓ Enhanced: ${verb.kanji} with better context and kana`);
    } else {
      // Add basic kana conversion for existing examples
      verb.examples = verb.examples.map(ex => {
        if (!ex.kana) {
          // Simple conversion: replace kanji with kana based on verb data
          let kanaVersion = ex.japanese;

          // Replace common kanji with hiragana (basic conversion)
          const replacements = {
            '私': 'わたし',
            '友達': 'ともだち',
            '先生': 'せんせい',
            '学校': 'がっこう',
            '毎日': 'まいにち',
            '今日': 'きょう',
            '明日': 'あした',
            '昨日': 'きのう',
            '来週': 'らいしゅう',
            '先週': 'せんしゅう',
            '今週': 'こんしゅう',
            '時間': 'じかん',
            '電車': 'でんしゃ',
            '駅': 'えき',
            '公園': 'こうえん',
            '本': 'ほん',
            '机': 'つくえ',
            '上': 'うえ',
            '下': 'した',
            '中': 'なか',
            '外': 'そと',
            '前': 'まえ',
            '後': 'あと',
            '大切': 'たいせつ',
            '新鮮': 'しんせん',
            '週末': 'しゅうまつ',
            '午後': 'ごご',
            '午前': 'ごぜん',
            '子供': 'こども',
            '顔': 'かお',
            '手': 'て',
            '食': 'た',
            '車': 'くるま',
            '試験': 'しけん',
            '魚': 'さかな',
            '肉': 'にく',
            '野菜': 'やさい',
            '古': 'ふる',
            '新': 'あたら',
            '誕生日': 'たんじょうび'
          };

          Object.entries(replacements).forEach(([kanji, kana]) => {
            kanaVersion = kanaVersion.replace(new RegExp(kanji, 'g'), kana);
          });

          // Replace verb kanji with verb kana
          if (verb.conjugations.masu) {
            kanaVersion = kanaVersion.replace(new RegExp(verb.conjugations.masu, 'g'), verb.conjugations.masuKana);
          }
          if (verb.conjugations.dictionary) {
            kanaVersion = kanaVersion.replace(new RegExp(verb.conjugations.dictionary, 'g'), verb.conjugations.dictionaryKana);
          }

          ex.kana = kanaVersion;
        }
        return ex;
      });
      console.log(`  Added kana: ${verb.kanji}`);
    }
  }
});

console.log(`\n✅ Enhanced ${enhancedCount} verbs with better contextual examples`);
console.log(`✅ Added kana versions to all ${data.verbs.filter(v => v.examples).length} verbs with examples`);

// Save the updated dataset
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('\n✅ Updated dataset saved!');
