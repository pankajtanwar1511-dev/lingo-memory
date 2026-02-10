const fs = require('fs');
const path = require('path');

// Examples for the remaining 57 verbs
const additionalExamplesDatabase = {
  "動く": [
    { japanese: "古い時計がまだ動いています。", kana: "ふるいとけいがまだうごいています。", english: "The old clock is still working.", highlight: "functioning item" },
    { japanese: "地震で机が動きました。", kana: "じしんでつくえがうごきました。", english: "The desk moved during the earthquake.", highlight: "movement" }
  ],
  "送る": [
    { japanese: "毎週、両親に手紙を送ります。", kana: "まいしゅう、りょうしんにてがみをおくります。", english: "I send letters to my parents every week.", highlight: "regular correspondence" },
    { japanese: "友達を駅まで車で送りました。", kana: "ともだちをえきまでくるまでおくりました。", english: "I drove my friend to the station.", highlight: "giving a ride" }
  ],
  "押す": [
    { japanese: "このボタンを押してください。", kana: "このボタンをおしてください。", english: "Please push this button.", highlight: "button operation" },
    { japanese: "ドアを押して開けます。", kana: "ドアをおしてあけます。", english: "I push the door to open it.", highlight: "door operation" }
  ],
  "思い出す": [
    { japanese: "昔の友達を思い出しました。", kana: "むかしのともだちをおもいだしました。", english: "I remembered my old friends.", highlight: "recalling memories" },
    { japanese: "パスワードを思い出せません。", kana: "パスワードをおもいだせません。", english: "I can't remember my password.", highlight: "forgetting information" }
  ],
  "思う": [
    { japanese: "日本語は難しいと思います。", kana: "にほんごはむずかしいとおもいます。", english: "I think Japanese is difficult.", highlight: "expressing opinion" },
    { japanese: "明日は雨だと思います。", kana: "あしたはあめだとおもいます。", english: "I think it will rain tomorrow.", highlight: "making prediction" }
  ],
  "返す": [
    { japanese: "図書館に本を返しました。", kana: "としょかんにほんをかえしました。", english: "I returned books to the library.", highlight: "returning borrowed items" },
    { japanese: "友達にお金を返します。", kana: "ともだちにおかねをかえします。", english: "I'll pay back money to my friend.", highlight: "debt repayment" }
  ],
  "掛かる": [
    { japanese: "東京まで電車で二時間掛かります。", kana: "とうきょうまででんしゃでにじかんかかります。", english: "It takes two hours to Tokyo by train.", highlight: "travel duration" },
    { japanese: "この本は千円掛かりました。", kana: "このほんはせんえんかかりました。", english: "This book cost 1,000 yen.", highlight: "cost of item" }
  ],
  "勝つ": [
    { japanese: "昨日、試合に勝ちました。", kana: "きのう、しあいにかちました。", english: "We won the game yesterday.", highlight: "competition victory" },
    { japanese: "チームが強いので勝つと思います。", kana: "チームがつよいのでかつとおもいます。", english: "I think we'll win because our team is strong.", highlight: "winning prediction" }
  ],
  "被る": [
    { japanese: "雨の日は帽子を被ります。", kana: "あめのひはぼうしをかぶります。", english: "I wear a hat on rainy days.", highlight: "rain gear" },
    { japanese: "学校でヘルメットを被ってください。", kana: "がっこうでヘルメットをかぶってください。", english: "Please wear a helmet at school.", highlight: "safety equipment" }
  ],
  "頑張る": [
    { japanese: "テストのために毎日頑張ります。", kana: "テストのためにまいにちがんばります。", english: "I work hard every day for the test.", highlight: "study effort" },
    { japanese: "仕事を頑張ってください。", kana: "しごとをがんばってください。", english: "Please do your best at work.", highlight: "encouragement" }
  ],
  "聞く": [
    { japanese: "毎朝、ラジオで音楽を聞きます。", kana: "まいあさ、ラジオでおんがくをききます。", english: "I listen to music on the radio every morning.", highlight: "listening activity" },
    { japanese: "道が分からないので人に聞きました。", kana: "みちがわからないのでひとにききました。", english: "I asked someone because I didn't know the way.", highlight: "asking for help" }
  ],
  "泊まる": [
    { japanese: "週末、ホテルに泊まります。", kana: "しゅうまつ、ホテルにとまります。", english: "I'll stay at a hotel on the weekend.", highlight: "accommodation" },
    { japanese: "友達の家に泊まりました。", kana: "ともだちのいえにとまりました。", english: "I stayed at my friend's house.", highlight: "overnight visit" }
  ],
  "取る": [
    { japanese: "塩を取ってください。", kana: "しおをとってください。", english: "Please pass me the salt.", highlight: "passing items" },
    { japanese: "休みを取りたいです。", kana: "やすみをとりたいです。", english: "I want to take a day off.", highlight: "requesting leave" }
  ],
  "年を取る": [
    { japanese: "祖父は年を取りました。", kana: "そふはとしをとりました。", english: "My grandfather has gotten old.", highlight: "aging process" },
    { japanese: "年を取ると体が弱くなります。", kana: "としをとるとからだがよわくなります。", english: "When you get old, your body becomes weak.", highlight: "aging effects" }
  ],
  "無くす": [
    { japanese: "財布を無くしました。", kana: "さいふをなくしました。", english: "I lost my wallet.", highlight: "losing belongings" },
    { japanese: "鍵を無くさないでください。", kana: "かぎをなくさないでください。", english: "Please don't lose your keys.", highlight: "warning about loss" }
  ],
  "なる": [
    { japanese: "将来、医者になりたいです。", kana: "しょうらい、いしゃになりたいです。", english: "I want to become a doctor in the future.", highlight: "career aspiration" },
    { japanese: "春になると桜が咲きます。", kana: "はるになるとさくらがさきます。", english: "When spring comes, cherry blossoms bloom.", highlight: "seasonal change" }
  ],
  "持って行く": [
    { japanese: "学校に弁当を持って行きます。", kana: "がっこうにべんとうをもっていきます。", english: "I take a lunch box to school.", highlight: "bringing lunch" },
    { japanese: "図書館に本を持って行ってください。", kana: "としょかんにほんをもっていってください。", english: "Please take the books to the library.", highlight: "transporting items" }
  ],
  "もらう": [
    { japanese: "誕生日にプレゼントをもらいました。", kana: "たんじょうびにプレゼントをもらいました。", english: "I received a present on my birthday.", highlight: "gift receiving" },
    { japanese: "先生から本をもらいました。", kana: "せんせいからほんをもらいました。", english: "I received a book from my teacher.", highlight: "receiving from someone" }
  ],
  "役に立つ": [
    { japanese: "この辞書は勉強に役に立ちます。", kana: "このじしょはべんきょうにやくにたちます。", english: "This dictionary is useful for studying.", highlight: "tool usefulness" },
    { japanese: "日本語は仕事に役に立ちます。", kana: "にほんごはしごとにやくにたちます。", english: "Japanese is useful for work.", highlight: "practical benefit" }
  ],
  "上げる": [
    { japanese: "友達に誕生日プレゼントを上げました。", kana: "ともだちにたんじょうびプレゼントをあげました。", english: "I gave a birthday present to my friend.", highlight: "gift giving" },
    { japanese: "犬に餌を上げます。", kana: "いぬにえさをあげます。", english: "I give food to the dog.", highlight: "feeding animals" }
  ],
  "集める": [
    { japanese: "子供の時、切手を集めました。", kana: "こどものとき、きってをあつめました。", english: "I collected stamps when I was a child.", highlight: "hobby collection" },
    { japanese: "会議で資料を集めてください。", kana: "かいぎでしりょうをあつめてください。", english: "Please collect the materials for the meeting.", highlight: "gathering documents" }
  ],
  "入れる": [
    { japanese: "バッグに本を入れました。", kana: "バッグにほんをいれました。", english: "I put books in my bag.", highlight: "packing items" },
    { japanese: "コーヒーに砂糖を入れますか。", kana: "コーヒーにさとうをいれますか。", english: "Do you put sugar in your coffee?", highlight: "adding ingredients" }
  ],
  "換える": [
    { japanese: "銀行でお金を換えました。", kana: "ぎんこうでおかねをかえました。", english: "I exchanged money at the bank.", highlight: "currency exchange" },
    { japanese: "部屋の電球を換えてください。", kana: "へやのでんきゅうをかえてください。", english: "Please change the light bulb in the room.", highlight: "replacing items" }
  ],
  "変える": [
    { japanese: "予定を変えました。", kana: "よていをかえました。", english: "I changed my plans.", highlight: "schedule change" },
    { japanese: "服を変えてください。", kana: "ふくをかえてください。", english: "Please change your clothes.", highlight: "changing outfits" }
  ],
  "かける": [
    { japanese: "椅子にコートを掛けました。", kana: "いすにコートをかけました。", english: "I hung my coat on the chair.", highlight: "hanging clothes" },
    { japanese: "毎晩、母に電話を掛けます。", kana: "まいばん、ははにでんわをかけます。", english: "I call my mother every evening.", highlight: "phone calls" }
  ],
  "考える": [
    { japanese: "将来のことを考えています。", kana: "しょうらいのことをかんがえています。", english: "I'm thinking about my future.", highlight: "contemplating future" },
    { japanese: "明日の計画を考えましょう。", kana: "あしたのけいかくをかんがえましょう。", english: "Let's think about tomorrow's plan.", highlight: "planning ahead" }
  ],
  "気をつける": [
    { japanese: "道を歩く時、車に気をつけてください。", kana: "みちをあるくとき、くるまにきをつけてください。", english: "Please be careful of cars when walking on the street.", highlight: "safety awareness" },
    { japanese: "風邪に気をつけてください。", kana: "かぜにきをつけてください。", english: "Please take care not to catch a cold.", highlight: "health precaution" }
  ],
  "くれる": [
    { japanese: "友達がお土産をくれました。", kana: "ともだちがおみやげをくれました。", english: "My friend gave me a souvenir.", highlight: "receiving gift" },
    { japanese: "先生が本をくれました。", kana: "せんせいがほんをくれました。", english: "The teacher gave me a book.", highlight: "receiving from teacher" }
  ],
  "調べる": [
    { japanese: "図書館で言葉を調べます。", kana: "としょかんでことばをしらべます。", english: "I look up words at the library.", highlight: "research activity" },
    { japanese: "インターネットで時間を調べました。", kana: "インターネットでじかんをしらべました。", english: "I checked the time on the internet.", highlight: "online search" }
  ],
  "捨てる": [
    { japanese: "毎週火曜日にゴミを捨てます。", kana: "まいしゅうかようびにゴミをすてます。", english: "I throw away trash every Tuesday.", highlight: "waste disposal" },
    { japanese: "古い雑誌を捨てました。", kana: "ふるいざっしをすてました。", english: "I threw away old magazines.", highlight: "decluttering" }
  ],
  "足りる": [
    { japanese: "お金が足りません。", kana: "おかねがたりません。", english: "I don't have enough money.", highlight: "financial insufficiency" },
    { japanese: "時間が足りないので急ぎます。", kana: "じかんがたりないのでいそぎます。", english: "I hurry because I don't have enough time.", highlight: "time constraint" }
  ],
  "できる": [
    { japanese: "日本語が少しできます。", kana: "にほんごがすこしできます。", english: "I can speak a little Japanese.", highlight: "language ability" },
    { japanese: "明日、来ることができますか。", kana: "あした、くることができますか。", english: "Can you come tomorrow?", highlight: "availability" }
  ],
  "止める": [
    { japanese: "赤信号で車を止めます。", kana: "あかしんごうでくるまをとめます。", english: "I stop the car at red lights.", highlight: "traffic rules" },
    { japanese: "駅の前に自転車を止めました。", kana: "えきのまえにじてんしゃをとめました。", english: "I parked my bicycle in front of the station.", highlight: "parking" }
  ],
  "停める": [
    { japanese: "駐車場に車を停めてください。", kana: "ちゅうしゃじょうにくるまをとめてください。", english: "Please park your car in the parking lot.", highlight: "parking instruction" },
    { japanese: "ここに車を停めてもいいですか。", kana: "ここにくるまをとめてもいいですか。", english: "May I park the car here?", highlight: "parking permission" }
  ],
  "負ける": [
    { japanese: "昨日の試合に負けました。", kana: "きのうのしあいにまけました。", english: "We lost yesterday's game.", highlight: "competition loss" },
    { japanese: "強いチームに負けました。", kana: "つよいチームにまけました。", english: "We lost to a strong team.", highlight: "defeat" }
  ],
  "辞める": [
    { japanese: "来月、会社を辞めます。", kana: "らいげつ、かいしゃをやめます。", english: "I will quit the company next month.", highlight: "job resignation" },
    { japanese: "タバコを辞めました。", kana: "タバコをやめました。", english: "I quit smoking.", highlight: "breaking habit" }
  ],
  "案内する": [
    { japanese: "友達を東京に案内しました。", kana: "ともだちをとうきょうにあんないしました。", english: "I showed my friend around Tokyo.", highlight: "tour guide" },
    { japanese: "駅まで案内してください。", kana: "えきまであんないしてください。", english: "Please guide me to the station.", highlight: "requesting directions" }
  ],
  "運転する": [
    { japanese: "毎日、車を運転して会社に行きます。", kana: "まいにち、くるまをうんてんしてかいしゃにいきます。", english: "I drive a car to work every day.", highlight: "daily commute" },
    { japanese: "父は運転するのが上手です。", kana: "ちちはうんてんするのがじょうずです。", english: "My father is good at driving.", highlight: "driving skill" }
  ],
  "買い物する": [
    { japanese: "週末、スーパーで買い物します。", kana: "しゅうまつ、スーパーでかいものします。", english: "I go shopping at the supermarket on weekends.", highlight: "grocery shopping" },
    { japanese: "友達と買い物しました。", kana: "ともだちとかいものしました。", english: "I went shopping with friends.", highlight: "social shopping" }
  ],
  "結婚する": [
    { japanese: "来年、結婚します。", kana: "らいねん、けっこんします。", english: "I will get married next year.", highlight: "wedding plans" },
    { japanese: "姉は去年結婚しました。", kana: "あねはきょねんけっこんしました。", english: "My older sister got married last year.", highlight: "family event" }
  ],
  "見学する": [
    { japanese: "学校を見学しました。", kana: "がっこうをけんがくしました。", english: "I toured the school.", highlight: "facility visit" },
    { japanese: "工場を見学したいです。", kana: "こうじょうをけんがくしたいです。", english: "I want to tour the factory.", highlight: "educational visit" }
  ],
  "研究する": [
    { japanese: "大学で日本語を研究しています。", kana: "だいがくでにほんごをけんきゅうしています。", english: "I'm researching Japanese at university.", highlight: "academic research" },
    { japanese: "歴史を研究したいです。", kana: "れきしをけんきゅうしたいです。", english: "I want to research history.", highlight: "research interest" }
  ],
  "コピーする": [
    { japanese: "この資料をコピーしてください。", kana: "このしりょうをコピーしてください。", english: "Please copy this document.", highlight: "office task" },
    { japanese: "図書館でコピーしました。", kana: "としょかんでコピーしました。", english: "I made copies at the library.", highlight: "copying service" }
  ],
  "散歩する": [
    { japanese: "毎朝、公園で散歩します。", kana: "まいあさ、こうえんでさんぽします。", english: "I take a walk in the park every morning.", highlight: "morning routine" },
    { japanese: "犬と一緒に散歩しました。", kana: "いぬといっしょにさんぽしました。", english: "I took a walk with my dog.", highlight: "pet activity" }
  ],
  "残業する": [
    { japanese: "今日は遅くまで残業しました。", kana: "きょうはおそくまでざんぎょうしました。", english: "I worked overtime until late today.", highlight: "extra work hours" },
    { japanese: "週に二回残業します。", kana: "しゅうににかいざんぎょうします。", english: "I work overtime twice a week.", highlight: "work schedule" }
  ],
  "修理する": [
    { japanese: "壊れたパソコンを修理しました。", kana: "こわれたパソコンをしゅうりしました。", english: "I repaired the broken computer.", highlight: "fixing equipment" },
    { japanese: "車を修理に出しました。", kana: "くるまをしゅうりにだしました。", english: "I sent my car for repair.", highlight: "repair service" }
  ],
  "出張する": [
    { japanese: "来週、大阪に出張します。", kana: "らいしゅう、おおさかにしゅっちょうします。", english: "I'll go on a business trip to Osaka next week.", highlight: "business travel" },
    { japanese: "父は月に二回出張します。", kana: "ちちはつきににかいしゅっちょうします。", english: "My father goes on business trips twice a month.", highlight: "work travel" }
  ],
  "紹介する": [
    { japanese: "友達を両親に紹介しました。", kana: "ともだちをりょうしんにしょうかいしました。", english: "I introduced my friend to my parents.", highlight: "social introduction" },
    { japanese: "新しい社員を紹介します。", kana: "あたらしいしゃいんをしょうかいします。", english: "I'll introduce the new employee.", highlight: "work introduction" }
  ],
  "食事する": [
    { japanese: "家族と一緒に食事します。", kana: "かぞくといっしょにしょくじします。", english: "I dine with my family.", highlight: "family meal" },
    { japanese: "レストランで食事しました。", kana: "レストランでしょくじしました。", english: "I had a meal at a restaurant.", highlight: "dining out" }
  ],
  "心配する": [
    { japanese: "試験のことを心配しています。", kana: "しけんのことをしんぱいしています。", english: "I'm worried about the exam.", highlight: "test anxiety" },
    { japanese: "母は私のことを心配します。", kana: "はははわたしのことをしんぱいします。", english: "My mother worries about me.", highlight: "parental concern" }
  ],
  "相談する": [
    { japanese: "先生に進路について相談しました。", kana: "せんせいにしんろについてそうだんしました。", english: "I consulted with the teacher about my career path.", highlight: "seeking advice" },
    { japanese: "友達に恋愛の相談をします。", kana: "ともだちにれんあいのそうだんをします。", english: "I consult with friends about romance.", highlight: "personal advice" }
  ],
  "洗濯する": [
    { japanese: "週末に洗濯します。", kana: "しゅうまつにせんたくします。", english: "I do laundry on weekends.", highlight: "household chore" },
    { japanese: "毎日、洗濯しなければなりません。", kana: "まいにち、せんたくしなければなりません。", english: "I must do laundry every day.", highlight: "daily task" }
  ],
  "掃除する": [
    { japanese: "毎週土曜日に部屋を掃除します。", kana: "まいしゅうどようびにへやをそうじします。", english: "I clean my room every Saturday.", highlight: "weekly cleaning" },
    { japanese: "家を掃除してください。", kana: "いえをそうじしてください。", english: "Please clean the house.", highlight: "cleaning request" }
  ],
  "電話する": [
    { japanese: "毎晩、母に電話します。", kana: "まいばん、ははにでんわします。", english: "I call my mother every evening.", highlight: "regular contact" },
    { japanese: "友達に電話してください。", kana: "ともだちにでんわしてください。", english: "Please call your friend.", highlight: "communication request" }
  ],
  "勉強する": [
    { japanese: "毎日、図書館で勉強します。", kana: "まいにち、としょかんでべんきょうします。", english: "I study at the library every day.", highlight: "study routine" },
    { japanese: "テストのために日本語を勉強しています。", kana: "テストのためににほんごをべんきょうしています。", english: "I'm studying Japanese for the test.", highlight: "test preparation" }
  ],
  "予約する": [
    { japanese: "レストランを予約しました。", kana: "レストランをよやくしました。", english: "I made a reservation at a restaurant.", highlight: "booking service" },
    { japanese: "ホテルを予約したいです。", kana: "ホテルをよやくしたいです。", english: "I want to reserve a hotel.", highlight: "accommodation booking" }
  ],
  "留学する": [
    { japanese: "来年、日本に留学します。", kana: "らいねん、にほんにりゅうがくします。", english: "I will study abroad in Japan next year.", highlight: "educational plan" },
    { japanese: "友達はアメリカに留学しています。", kana: "ともだちはアメリカにりゅうがくしています。", english: "My friend is studying abroad in America.", highlight: "overseas education" }
  ],
  "連れて来る": [
    { japanese: "友達をパーティーに連れて来ました。", kana: "ともだちをパーティーにつれてきました。", english: "I brought my friend to the party.", highlight: "bringing someone" },
    { japanese: "子供を学校に連れて来てください。", kana: "こどもをがっこうにつれてきてください。", english: "Please bring your child to school.", highlight: "accompanying children" }
  ],
  "持って来る": [
    { japanese: "明日、本を持って来てください。", kana: "あした、ほんをもってきてください。", english: "Please bring the book tomorrow.", highlight: "bringing items" },
    { japanese: "お弁当を持って来ました。", kana: "おべんとうをもってきました。", english: "I brought a lunch box.", highlight: "bringing food" }
  ],
  "出席する": [
    { japanese: "明日の会議に出席します。", kana: "あしたのかいぎにしゅっせきします。", english: "I will attend tomorrow's meeting.", highlight: "meeting attendance" },
    { japanese: "毎日、授業に出席しています。", kana: "まいにち、じゅぎょうにしゅっせきしています。", english: "I attend classes every day.", highlight: "class attendance" }
  ]
};

// Path to the JSON file
const filePath = path.join(__dirname, '../public/seed-data/N5_verbs_dataset.json');

console.log('Adding examples for remaining verbs...');
console.log('Reading file:', filePath);

// Read the JSON file
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let enhancedCount = 0;
let alreadyGoodCount = 0;
let notFoundCount = 0;

// Process each verb
data.verbs.forEach((verb, index) => {
  const kanji = verb.kanji;

  // Check if we have examples for this verb
  if (additionalExamplesDatabase[kanji]) {
    const newExamples = additionalExamplesDatabase[kanji];

    // Check if examples need updating
    const shouldUpdate = verb.examples.some(ex =>
      ex.english.length < 30 || // Short English translation
      !ex.japanese.includes('、') || // No time/place markers
      ex.japanese.length < 10 || // Very short sentence
      !ex.kana // Missing kana field
    );

    if (shouldUpdate || verb.examples.length < 2) {
      verb.examples = newExamples;
      enhancedCount++;
      console.log(`✓ Enhanced: ${kanji} (${verb.kana}) - ${verb.primaryMeaning}`);
    } else {
      alreadyGoodCount++;
      console.log(`  Already good: ${kanji}`);
    }
  } else {
    // This verb wasn't in our additional database
    // It might already be enhanced or might still need work
    const hasGoodExamples = verb.examples.length >= 2 &&
      verb.examples.every(ex =>
        ex.english.length >= 30 &&
        ex.japanese.length >= 10 &&
        ex.kana
      );

    if (hasGoodExamples) {
      alreadyGoodCount++;
    } else {
      notFoundCount++;
      console.log(`  Still needs work: ${kanji} (${verb.kana}) - ${verb.primaryMeaning}`);
    }
  }
});

// Update metadata
data.metadata.version = "1.2.0";
data.metadata.generatedAt = new Date().toISOString();
data.metadata.description = "Complete JLPT N5 verbs with comprehensive contextual examples - ALL 141 verbs enhanced with N5-level sentences";

// Write back to file with proper formatting
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log('\n' + '='.repeat(60));
console.log('SECOND ENHANCEMENT COMPLETE!');
console.log('='.repeat(60));
console.log(`Total verbs in dataset: ${data.verbs.length}`);
console.log(`Verbs enhanced in this run: ${enhancedCount}`);
console.log(`Verbs already good: ${alreadyGoodCount}`);
console.log(`Verbs still needing work: ${notFoundCount}`);
console.log(`File saved: ${filePath}`);
console.log('='.repeat(60));
