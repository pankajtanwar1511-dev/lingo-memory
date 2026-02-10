const fs = require('fs');
const path = require('path');

// Load the verbs dataset
const dataPath = path.join(__dirname, '../public/seed-data/N5_verbs_dataset.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('Creating comprehensive contextual examples for ALL verbs...\n');

// Comprehensive examples with context for ALL verbs
const allExamples = {
  '会う': [
    { japanese: '明日、友達に会います。', kana: 'あした、ともだちにあいます。', english: 'I will meet my friend tomorrow.', highlight: 'scheduled meeting' },
    { japanese: '駅で午後三時に会いましょう。', kana: 'えきでごごさんじにあいましょう。', english: "Let's meet at the station at 3 PM.", highlight: 'arranging time and place' }
  ],
  '遊ぶ': [
    { japanese: '週末、公園で子供たちが遊びます。', kana: 'しゅうまつ、こうえんでこどもたちがあそびます。', english: 'Children play in the park on weekends.', highlight: 'outdoor play' },
    { japanese: '友達と一緒にゲームで遊びました。', kana: 'ともだちといっしょにゲームであそびました。', english: 'I played games together with my friends.', highlight: 'playing with others' }
  ],
  '洗う': [
    { japanese: '毎朝、顔を洗います。', kana: 'まいあさ、かおをあらいます。', english: 'I wash my face every morning.', highlight: 'daily routine' },
    { japanese: '食べる前に手を洗ってください。', kana: 'たべるまえにてをあらってください。', english: 'Please wash your hands before eating.', highlight: 'hygiene instruction' }
  ],
  'ある': [
    { japanese: '机の上に本があります。', kana: 'つくえのうえにほんがあります。', english: 'There is a book on the desk.', highlight: 'location of objects' },
    { japanese: '来週、大切な試験があります。', kana: 'らいしゅう、たいせつなしけんがあります。', english: 'There is an important exam next week.', highlight: 'scheduled event' },
    { japanese: '私は車がありません。', kana: 'わたしはくるまがありません。', english: "I don't have a car.", highlight: 'possession' }
  ],
  '歩く': [
    { japanese: '毎日、駅まで歩いて行きます。', kana: 'まいにち、えきまであるいていきます。', english: 'I walk to the station every day.', highlight: 'daily commute' },
    { japanese: '公園をゆっくり歩きましょう。', kana: 'こうえんをゆっくりあるきましょう。', english: "Let's walk slowly in the park.", highlight: 'leisurely stroll' }
  ],
  '言う': [
    { japanese: '先生は「静かにしてください」と言いました。', kana: 'せんせいは「しずかにしてください」といいました。', english: 'The teacher said "Please be quiet."', highlight: 'quoting someone' },
    { japanese: '彼はいつも本当のことを言います。', kana: 'かれはいつもほんとうのことをいいます。', english: 'He always tells the truth.', highlight: 'speaking truthfully' }
  ],
  '行く': [
    { japanese: '来週、日本に行きます。', kana: 'らいしゅう、にほんにいきます。', english: 'I will go to Japan next week.', highlight: 'travel plans' },
    { japanese: '毎朝、学校に行きます。', kana: 'まいあさ、がっこうにいきます。', english: 'I go to school every morning.', highlight: 'daily routine' }
  ],
  '急ぐ': [
    { japanese: '電車に遅れるので、急いでください。', kana: 'でんしゃにおくれるので、いそいでください。', english: "Please hurry, or you'll miss the train.", highlight: 'urgency with reason' },
    { japanese: '時間がないから、急ぎましょう。', kana: 'じかんがないから、いそぎましょう。', english: "Let's hurry because there's no time.", highlight: 'time pressure' }
  ],
  '要る': [
    { japanese: '旅行にパスポートが要ります。', kana: 'りょこうにパスポートがいります。', english: 'You need a passport for travel.', highlight: 'necessary item' },
    { japanese: 'お金が要りますか。', kana: 'おかねがいりますか。', english: 'Do you need money?', highlight: 'asking about needs' }
  ],
  '動く': [
    { japanese: 'この機械は動きません。', kana: 'このきかいはうごきません。', english: 'This machine does not work.', highlight: 'machine malfunction' },
    { japanese: '電車が動き始めました。', kana: 'でんしゃがうごきはじめました。', english: 'The train started moving.', highlight: 'starting motion' }
  ],
  '歌う': [
    { japanese: '彼女は毎日、カラオケで歌います。', kana: 'かのじょはまいにち、カラオケでうたいます。', english: 'She sings at karaoke every day.', highlight: 'regular activity' },
    { japanese: '日本の歌を歌いましょう。', kana: 'にほんのうたをうたいましょう。', english: "Let's sing a Japanese song.", highlight: 'suggestion to sing' }
  ],
  '売る': [
    { japanese: 'この店は新鮮な魚を売っています。', kana: 'このみせはしんせんなさかなをうっています。', english: 'This store sells fresh fish.', highlight: 'retail business' },
    { japanese: '古い本をインターネットで売りました。', kana: 'ふるいほんをインターネットでうりました。', english: 'I sold my old books on the internet.', highlight: 'online selling' }
  ],
  '置く': [
    { japanese: 'かばんを机の上に置いてください。', kana: 'かばんをつくえのうえにおいてください。', english: 'Please put your bag on the desk.', highlight: 'placing objects' },
    { japanese: 'ここに車を置いてもいいですか。', kana: 'ここにくるまをおいてもいいですか。', english: 'May I park my car here?', highlight: 'asking permission' }
  ],
  '送る': [
    { japanese: '母に手紙を送りました。', kana: 'ははにてがみをおくりました。', english: 'I sent a letter to my mother.', highlight: 'sending mail' },
    { japanese: '友達を駅まで送ります。', kana: 'ともだちをえきまでおくります。', english: 'I will see my friend off to the station.', highlight: 'escorting someone' }
  ],
  '押す': [
    { japanese: 'このボタンを押してください。', kana: 'このボタンをおしてください。', english: 'Please press this button.', highlight: 'giving instructions' },
    { japanese: 'ドアを押して開けます。', kana: 'ドアをおしてあけます。', english: 'I push the door to open it.', highlight: 'physical action' }
  ],
  '思い出す': [
    { japanese: '昔のことを思い出しました。', kana: 'むかしのことをおもいだしました。', english: 'I remembered old times.', highlight: 'recalling memories' },
    { japanese: '友達の名前を思い出せません。', kana: 'ともだちのなまえをおもいだせません。', english: "I can't remember my friend's name.", highlight: 'difficulty remembering' }
  ],
  '思う': [
    { japanese: 'この映画は面白いと思います。', kana: 'このえいがはおもしろいとおもいます。', english: 'I think this movie is interesting.', highlight: 'expressing opinion' },
    { japanese: '明日は雨が降ると思います。', kana: 'あしたはあめがふるとおもいます。', english: 'I think it will rain tomorrow.', highlight: 'making prediction' }
  ],
  '泳ぐ': [
    { japanese: '夏、海で泳ぎます。', kana: 'なつ、うみでおよぎます。', english: 'I swim in the sea in summer.', highlight: 'seasonal activity' },
    { japanese: '毎週、プールで泳いでいます。', kana: 'まいしゅう、プールでおよいでいます。', english: 'I swim at the pool every week.', highlight: 'regular exercise' }
  ],
  '下ろす': [
    { japanese: '銀行でお金を下ろしました。', kana: 'ぎんこうでおかねをおろしました。', english: 'I withdrew money at the bank.', highlight: 'ATM transaction' },
    { japanese: '荷物を棚から下ろしてください。', kana: 'にもつをたなからおろしてください。', english: 'Please take the luggage down from the shelf.', highlight: 'moving objects down' }
  ],
  '終わる': [
    { japanese: '授業は午後五時に終わります。', kana: 'じゅぎょうはごごごじにおわります。', english: 'Class ends at 5 PM.', highlight: 'scheduled ending' },
    { japanese: '仕事が終わったら、飲みに行きましょう。', kana: 'しごとがおわったら、のみにいきましょう。', english: "Let's go drinking after work finishes.", highlight: 'plans after completion' }
  ],
  '買う': [
    { japanese: 'スーパーで野菜と肉を買います。', kana: 'スーパーでやさいとにくをかいます。', english: 'I buy vegetables and meat at the supermarket.', highlight: 'grocery shopping' },
    { japanese: '友達に誕生日プレゼントを買いました。', kana: 'ともだちにたんじょうびプレゼントをかいました。', english: 'I bought a birthday present for my friend.', highlight: 'gift buying' }
  ],
  '返す': [
    { japanese: '図書館に本を返します。', kana: 'としょかんにほんをかえします。', english: 'I return books to the library.', highlight: 'returning borrowed items' },
    { japanese: '明日、お金を返してください。', kana: 'あした、おかねをかえしてください。', english: 'Please return the money tomorrow.', highlight: 'requesting repayment' }
  ],
  '帰る': [
    { japanese: '毎日、六時に家に帰ります。', kana: 'まいにち、ろくじにいえにかえります。', english: 'I go home at 6 o\'clock every day.', highlight: 'daily routine' },
    { japanese: '来月、国に帰ります。', kana: 'らいげつ、くににかえります。', english: 'I will return to my country next month.', highlight: 'returning home country' }
  ],
  '掛かる': [
    { japanese: '東京まで三時間掛かります。', kana: 'とうきょうまでさんじかんかかります。', english: 'It takes three hours to Tokyo.', highlight: 'time duration' },
    { japanese: 'この本は千円掛かりました。', kana: 'このほんはせんえんかかりました。', english: 'This book cost 1000 yen.', highlight: 'cost of item' }
  ],
  '書く': [
    { japanese: '毎日、日記を書きます。', kana: 'まいにち、にっきをかきます。', english: 'I write in my diary every day.', highlight: 'daily writing habit' },
    { japanese: '黒板に名前を書いてください。', kana: 'こくばんになまえをかいてください。', english: 'Please write your name on the blackboard.', highlight: 'classroom instruction' }
  ],
  '貸す': [
    { japanese: '友達にお金を貸しました。', kana: 'ともだちにおかねをかしました。', english: 'I lent money to my friend.', highlight: 'lending money' },
    { japanese: 'ペンを貸してください。', kana: 'ペンをかしてください。', english: 'Please lend me a pen.', highlight: 'requesting to borrow' }
  ],
  '勝つ': [
    { japanese: '昨日、試合に勝ちました。', kana: 'きのう、しあいにかちました。', english: 'I won the match yesterday.', highlight: 'sports victory' },
    { japanese: 'このチームはいつも勝ちます。', kana: 'このチームはいつもかちます。', english: 'This team always wins.', highlight: 'consistent winning' }
  ],
  '被る': [
    { japanese: '外出する時、帽子を被ります。', kana: 'がいしゅつするとき、ぼうしをかぶります。', english: 'I wear a hat when going out.', highlight: 'wearing headwear' },
    { japanese: '寒いので、帽子を被ってください。', kana: 'さむいので、ぼうしをかぶってください。', english: 'Please wear a hat because it\'s cold.', highlight: 'advice for weather' }
  ],
  '頑張る': [
    { japanese: '試験のために頑張ります。', kana: 'しけんのためにがんばります。', english: 'I will do my best for the exam.', highlight: 'making effort' },
    { japanese: '仕事を頑張ってください。', kana: 'しごとをがんばってください。', english: 'Please work hard.', highlight: 'encouragement' }
  ],
  '聞く': [
    { japanese: '毎日、音楽を聞きます。', kana: 'まいにち、おんがくをききます。', english: 'I listen to music every day.', highlight: 'listening for enjoyment' },
    { japanese: '先生に質問を聞きました。', kana: 'せんせいにしつもんをききました。', english: 'I asked the teacher a question.', highlight: 'asking questions' }
  ]
};

console.log('Processing all verbs...\n');

// Apply examples to dataset
let processedCount = 0;
data.verbs.forEach(verb => {
  if (allExamples[verb.kanji]) {
    verb.examples = allExamples[verb.kanji];
    processedCount++;
    console.log(`✓ ${verb.kanji} - Enhanced with contextual examples`);
  } else if (!verb.examples || verb.examples.length === 0) {
    console.log(`⚠ ${verb.kanji} - No examples yet (will add generic)`);
  }
});

console.log(`\n✅ Enhanced ${processedCount} verbs with comprehensive contextual examples`);
console.log(`⚠ ${data.verbs.length - processedCount} verbs still need examples\n`);

// Save
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('✅ Dataset updated!\n');
console.log('Next: Run part 2 to add remaining verbs...');
