const fs = require('fs');
const path = require('path');

// Load the verbs dataset
const dataPath = path.join(__dirname, '../public/seed-data/N5_verbs_dataset.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('Adding comprehensive examples to all verbs...\n');

// Example templates for each verb
const verbExamples = {
  '会う': [
    { japanese: '友達に会います。', english: 'I meet my friend.', highlight: 'meeting someone' },
    { japanese: '駅で会いましょう。', english: "Let's meet at the station.", highlight: 'arranging to meet' }
  ],
  '遊ぶ': [
    { japanese: '公園で遊びます。', english: 'I play in the park.', highlight: 'outdoor play' },
    { japanese: '友達と遊びます。', english: 'I play with friends.', highlight: 'social play' }
  ],
  '洗う': [
    { japanese: '手を洗います。', english: 'I wash my hands.', highlight: 'washing body parts' },
    { japanese: '車を洗います。', english: 'I wash the car.', highlight: 'washing objects' }
  ],
  'ある': [
    { japanese: '机の上に本があります。', english: 'There is a book on the desk.', highlight: 'existence (inanimate)' },
    { japanese: '時間があります。', english: 'I have time.', highlight: 'possession (abstract)' },
    { japanese: 'パーティーがあります。', english: 'There is a party.', highlight: 'event happening' }
  ],
  '歩く': [
    { japanese: '学校まで歩きます。', english: 'I walk to school.', highlight: 'walking as transportation' },
    { japanese: '毎日歩きます。', english: 'I walk every day.', highlight: 'walking as exercise' }
  ],
  '言う': [
    { japanese: '「ありがとう」と言います。', english: 'I say "thank you".', highlight: 'saying specific words' },
    { japanese: '先生が言いました。', english: 'The teacher said it.', highlight: 'stating information' }
  ],
  '行く': [
    { japanese: '学校に行きます。', english: 'I go to school.', highlight: 'going to a place' },
    { japanese: '日本に行きたいです。', english: 'I want to go to Japan.', highlight: 'travel/destination' }
  ],
  '急ぐ': [
    { japanese: '急いでください。', english: 'Please hurry.', highlight: 'urging someone' },
    { japanese: '朝は急ぎます。', english: 'I hurry in the morning.', highlight: 'being in a rush' }
  ],
  '売る': [
    { japanese: 'この店は本を売ります。', english: 'This store sells books.', highlight: 'commercial selling' },
    { japanese: '車を売りました。', english: 'I sold my car.', highlight: 'personal selling' }
  ],
  '置く': [
    { japanese: 'ここに置いてください。', english: 'Please put it here.', highlight: 'placing objects' },
    { japanese: 'かばんを机に置きます。', english: 'I put my bag on the desk.', highlight: 'setting down' }
  ],
  '送る': [
    { japanese: 'メールを送ります。', english: 'I send an email.', highlight: 'sending messages' },
    { japanese: '友達を駅まで送ります。', english: 'I escort my friend to the station.', highlight: 'accompanying someone' }
  ],
  '押す': [
    { japanese: 'ボタンを押します。', english: 'I push the button.', highlight: 'pressing buttons' },
    { japanese: 'ドアを押してください。', english: 'Please push the door.', highlight: 'physical pushing' }
  ],
  '終わる': [
    { japanese: '授業が終わります。', english: 'Class ends.', highlight: 'scheduled events ending' },
    { japanese: '仕事が終わりました。', english: 'Work is finished.', highlight: 'completion of tasks' }
  ],
  '買う': [
    { japanese: '本を買います。', english: 'I buy a book.', highlight: 'purchasing items' },
    { japanese: 'スーパーで買い物します。', english: 'I shop at the supermarket.', highlight: 'shopping activity' }
  ],
  '帰る': [
    { japanese: '家に帰ります。', english: 'I return home.', highlight: 'going back home' },
    { japanese: '6時に帰ります。', english: 'I go home at 6 o\'clock.', highlight: 'leaving work/school' }
  ],
  '掛かる': [
    { japanese: '時間が掛かります。', english: 'It takes time.', highlight: 'time required' },
    { japanese: 'お金が掛かります。', english: 'It costs money.', highlight: 'money required' }
  ],
  'かける': [
    { japanese: 'めがねをかけます。', english: 'I put on glasses.', highlight: 'wearing accessories' },
    { japanese: '電話をかけます。', english: 'I make a phone call.', highlight: 'making calls' }
  ],
  '貸す': [
    { japanese: 'ペンを貸してください。', english: 'Please lend me a pen.', highlight: 'lending temporarily' },
    { japanese: '友達に本を貸します。', english: 'I lend a book to my friend.', highlight: 'loaning items' }
  ],
  '被る': [
    { japanese: '帽子を被ります。', english: 'I put on a hat.', highlight: 'wearing on head' },
    { japanese: '帽子を被ってください。', english: 'Please wear a hat.', highlight: 'protection/fashion' }
  ],
  '聞く_listening': [
    { japanese: '音楽を聞きます。', english: 'I listen to music.', highlight: 'intentional listening' },
    { japanese: 'ニュースを聞きました。', english: 'I heard the news.', highlight: 'receiving information' }
  ],
  '聞く_asking': [
    { japanese: '先生に聞きます。', english: 'I ask the teacher.', highlight: 'asking questions' },
    { japanese: '道を聞きました。', english: 'I asked for directions.', highlight: 'requesting information' }
  ],
  '消す': [
    { japanese: '電気を消します。', english: 'I turn off the light.', highlight: 'switching off' },
    { japanese: '字を消します。', english: 'I erase the letters.', highlight: 'erasing/deleting' }
  ],
  '切る': [
    { japanese: '紙を切ります。', english: 'I cut paper.', highlight: 'cutting with scissors' },
    { japanese: '電話を切ります。', english: 'I hang up the phone.', highlight: 'disconnecting' }
  ],
  '来る': [
    { japanese: '友達が来ます。', english: 'My friend comes.', highlight: 'someone arriving' },
    { japanese: '日本に来ました。', english: 'I came to Japan.', highlight: 'arrival at location' }
  ],
  '曇る': [
    { japanese: '今日は曇ります。', english: 'It will be cloudy today.', highlight: 'weather condition' },
    { japanese: '空が曇っています。', english: 'The sky is cloudy.', highlight: 'current sky state' }
  ],
  'する': [
    { japanese: '勉強します。', english: 'I study.', highlight: 'doing activities' },
    { japanese: '仕事をします。', english: 'I do work.', highlight: 'performing tasks' }
  ],
  '知る': [
    { japanese: '知っています。', english: 'I know.', highlight: 'knowledge/awareness' },
    { japanese: '住所を知っていますか。', english: 'Do you know the address?', highlight: 'knowing information' }
  ],
  '住む': [
    { japanese: '東京に住んでいます。', english: 'I live in Tokyo.', highlight: 'residence' },
    { japanese: 'アパートに住みます。', english: 'I live in an apartment.', highlight: 'dwelling place' }
  ],
  '座る': [
    { japanese: 'ここに座ってください。', english: 'Please sit here.', highlight: 'taking a seat' },
    { japanese: '椅子に座ります。', english: 'I sit on a chair.', highlight: 'sitting down' }
  ],
  '立つ': [
    { japanese: '立ってください。', english: 'Please stand up.', highlight: 'standing position' },
    { japanese: 'そこに立ちます。', english: 'I stand there.', highlight: 'remaining standing' }
  ],
  '出す': [
    { japanese: 'かばんから本を出します。', english: 'I take out a book from my bag.', highlight: 'removing from container' },
    { japanese: '宿題を出します。', english: 'I hand in homework.', highlight: 'submitting' }
  ],
  '立てる': [
    { japanese: '傘を立てます。', english: 'I stand up the umbrella.', highlight: 'making upright' },
    { japanese: '計画を立てます。', english: 'I make a plan.', highlight: 'creating plans' }
  ],
  '違う': [
    { japanese: '答えが違います。', english: 'The answer is different.', highlight: 'being incorrect' },
    { japanese: '意見が違います。', english: 'Our opinions differ.', highlight: 'disagreement' }
  ],
  '使う': [
    { japanese: 'ペンを使います。', english: 'I use a pen.', highlight: 'using tools' },
    { japanese: '日本語を使います。', english: 'I use Japanese.', highlight: 'using language' }
  ],
  '疲れる': [
    { japanese: '疲れました。', english: 'I am tired.', highlight: 'physical fatigue' },
    { japanese: '仕事で疲れます。', english: 'I get tired from work.', highlight: 'exhaustion from activity' }
  ],
  '作る': [
    { japanese: '料理を作ります。', english: 'I make food.', highlight: 'cooking/preparing' },
    { japanese: 'レポートを作ります。', english: 'I create a report.', highlight: 'creating documents' }
  ],
  '着く': [
    { japanese: '駅に着きました。', english: 'I arrived at the station.', highlight: 'reaching destination' },
    { japanese: '家に着きます。', english: 'I arrive home.', highlight: 'completing journey' }
  ],
  '点ける': [
    { japanese: '電気を点けます。', english: 'I turn on the light.', highlight: 'switching on lights' },
    { japanese: 'エアコンを点けます。', english: 'I turn on the air conditioner.', highlight: 'activating appliances' }
  ],
  '手伝う': [
    { japanese: '母を手伝います。', english: 'I help my mother.', highlight: 'assisting someone' },
    { japanese: '仕事を手伝ってください。', english: 'Please help with the work.', highlight: 'requesting assistance' }
  ],
  '出かける': [
    { japanese: '買い物に出かけます。', english: 'I go out shopping.', highlight: 'leaving home for activity' },
    { japanese: '朝早く出かけます。', english: 'I go out early in the morning.', highlight: 'departure timing' }
  ],
  '止まる': [
    { japanese: '車が止まります。', english: 'The car stops.', highlight: 'vehicle stopping' },
    { japanese: '時計が止まりました。', english: 'The clock stopped.', highlight: 'ceasing motion' }
  ],
  '取る': [
    { japanese: '写真を取ります。', english: 'I take a photo.', highlight: 'capturing images' },
    { japanese: '塩を取ってください。', english: 'Please pass me the salt.', highlight: 'picking up/passing' }
  ],
  '撮る': [
    { japanese: '写真を撮ります。', english: 'I take a picture.', highlight: 'photography' },
    { japanese: 'ビデオを撮ります。', english: 'I shoot a video.', highlight: 'recording' }
  ],
  '鳴る': [
    { japanese: '電話が鳴ります。', english: 'The phone rings.', highlight: 'phone ringing' },
    { japanese: 'ベルが鳴りました。', english: 'The bell rang.', highlight: 'making sound' }
  ],
  '直す': [
    { japanese: '間違いを直します。', english: 'I correct mistakes.', highlight: 'fixing errors' },
    { japanese: '時計を直します。', english: 'I repair the clock.', highlight: 'repairing objects' }
  ],
  '脱ぐ': [
    { japanese: '靴を脱ぎます。', english: 'I take off my shoes.', highlight: 'removing footwear' },
    { japanese: 'コートを脱いでください。', english: 'Please take off your coat.', highlight: 'removing outerwear' }
  ],
  '飲む': [
    { japanese: '水を飲みます。', english: 'I drink water.', highlight: 'consuming liquids' },
    { japanese: '薬を飲みます。', english: 'I take medicine.', highlight: 'ingesting medicine' },
    { japanese: 'お酒を飲みます。', english: 'I drink alcohol.', highlight: 'consuming alcohol' }
  ],
  '乗る': [
    { japanese: 'バスに乗ります。', english: 'I ride the bus.', highlight: 'boarding vehicles' },
    { japanese: '自転車に乗ります。', english: 'I ride a bicycle.', highlight: 'riding/mounting' }
  ],
  '入る': [
    { japanese: '部屋に入ります。', english: 'I enter the room.', highlight: 'entering spaces' },
    { japanese: '大学に入ります。', english: 'I enter university.', highlight: 'joining institution' },
    { japanese: 'お風呂に入ります。', english: 'I take a bath.', highlight: 'bathing' }
  ],
  '晴れる': [
    { japanese: '明日は晴れます。', english: 'It will be sunny tomorrow.', highlight: 'clear weather' },
    { japanese: '今日は晴れています。', english: 'It is sunny today.', highlight: 'current weather' }
  ],
  '貼る': [
    { japanese: '切手を貼ります。', english: 'I stick on a stamp.', highlight: 'attaching with adhesive' },
    { japanese: 'ポスターを貼ります。', english: 'I put up a poster.', highlight: 'posting on walls' }
  ],
  '弾く': [
    { japanese: 'ピアノを弾きます。', english: 'I play the piano.', highlight: 'keyboard instruments' },
    { japanese: 'ギターを弾きます。', english: 'I play the guitar.', highlight: 'stringed instruments' }
  ],
  '引く': [
    { japanese: 'ドアを引きます。', english: 'I pull the door.', highlight: 'pulling motion' },
    { japanese: '線を引きます。', english: 'I draw a line.', highlight: 'drawing lines' }
  ],
  '吹く': [
    { japanese: '風が吹きます。', english: 'The wind blows.', highlight: 'natural blowing' },
    { japanese: '笛を吹きます。', english: 'I blow a whistle.', highlight: 'blowing instruments' }
  ],
  '降る': [
    { japanese: '雨が降ります。', english: 'It rains.', highlight: 'rain falling' },
    { japanese: '雪が降ります。', english: 'It snows.', highlight: 'snow falling' }
  ],
  '太る': [
    { japanese: '太りました。', english: 'I gained weight.', highlight: 'weight increase' },
    { japanese: '食べすぎて太ります。', english: 'I get fat from overeating.', highlight: 'cause of weight gain' }
  ],
  '曲がる': [
    { japanese: '右に曲がります。', english: 'I turn right.', highlight: 'changing direction' },
    { japanese: '次の角を曲がってください。', english: 'Please turn at the next corner.', highlight: 'giving directions' }
  ],
  '磨く': [
    { japanese: '歯を磨きます。', english: 'I brush my teeth.', highlight: 'dental hygiene' },
    { japanese: '靴を磨きます。', english: 'I polish shoes.', highlight: 'cleaning/shining' }
  ],
  '回る': [
    { japanese: '地球が回ります。', english: 'The Earth rotates.', highlight: 'rotating motion' },
    { japanese: '店を回ります。', english: 'I go around shops.', highlight: 'visiting multiple places' }
  ],
  '持つ': [
    { japanese: 'かばんを持ちます。', english: 'I carry a bag.', highlight: 'holding/carrying' },
    { japanese: 'パスポートを持っていますか。', english: 'Do you have a passport?', highlight: 'possessing' }
  ],
  '休む': [
    { japanese: '今日は休みます。', english: 'I rest today.', highlight: 'taking rest' },
    { japanese: '学校を休みます。', english: 'I take a day off from school.', highlight: 'being absent' }
  ],
  '呼ぶ': [
    { japanese: '友達を呼びます。', english: 'I call my friend.', highlight: 'summoning someone' },
    { japanese: 'タクシーを呼んでください。', english: 'Please call a taxi.', highlight: 'requesting service' }
  ],
  '分かる': [
    { japanese: '日本語が分かります。', english: 'I understand Japanese.', highlight: 'comprehension' },
    { japanese: '分かりました。', english: 'I understood.', highlight: 'acknowledgment' }
  ],
  '忘れる': [
    { japanese: '名前を忘れました。', english: 'I forgot the name.', highlight: 'memory lapse' },
    { japanese: '宿題を忘れました。', english: 'I forgot my homework.', highlight: 'failing to remember' }
  ],
  'いる': [
    { japanese: '部屋に人がいます。', english: 'There is a person in the room.', highlight: 'existence of animate' },
    { japanese: '犬を飼っています。', english: 'I have a dog.', highlight: 'possessing pets' },
    { japanese: 'ここにいてください。', english: 'Please stay here.', highlight: 'remaining in place' }
  ],
  '要る': [
    { japanese: 'お金が要ります。', english: 'I need money.', highlight: 'necessity' },
    { japanese: 'これは要りません。', english: "I don't need this.", highlight: 'lack of need' }
  ],
  '入れる': [
    { japanese: 'かばんに入れます。', english: 'I put it in the bag.', highlight: 'placing inside' },
    { japanese: 'コーヒーを入れます。', english: 'I make coffee.', highlight: 'preparing drinks' }
  ],
  '生まれる': [
    { japanese: '日本で生まれました。', english: 'I was born in Japan.', highlight: 'place of birth' },
    { japanese: '1990年に生まれました。', english: 'I was born in 1990.', highlight: 'time of birth' }
  ],
  '起きる': [
    { japanese: '6時に起きます。', english: 'I wake up at 6 o\'clock.', highlight: 'waking up' },
    { japanese: '地震が起きました。', english: 'An earthquake occurred.', highlight: 'events happening' }
  ],
  '教える': [
    { japanese: '英語を教えます。', english: 'I teach English.', highlight: 'instructing subject' },
    { japanese: '学生に教えます。', english: 'I teach students.', highlight: 'educating people' }
  ],
  '教える_telling': [
    { japanese: '道を教えてください。', english: 'Please tell me the way.', highlight: 'giving directions' },
    { japanese: '電話番号を教えます。', english: 'I tell you my phone number.', highlight: 'sharing information' }
  ],
  '降りる': [
    { japanese: 'バスを降ります。', english: 'I get off the bus.', highlight: 'exiting vehicle' },
    { japanese: '次の駅で降ります。', english: 'I get off at the next station.', highlight: 'disembarking' }
  ],
  '借りる': [
    { japanese: '本を借ります。', english: 'I borrow a book.', highlight: 'borrowing items' },
    { japanese: '図書館で借ります。', english: 'I borrow from the library.', highlight: 'institutional borrowing' }
  ],
  '着る': [
    { japanese: 'シャツを着ます。', english: 'I wear a shirt.', highlight: 'wearing upper body' },
    { japanese: 'きれいな服を着ます。', english: 'I wear nice clothes.', highlight: 'dressing nicely' }
  ],
  '見る': [
    { japanese: 'テレビを見ます。', english: 'I watch TV.', highlight: 'watching shows' },
    { japanese: '映画を見ます。', english: 'I watch a movie.', highlight: 'viewing entertainment' }
  ],
  '浴びる': [
    { japanese: 'シャワーを浴びます。', english: 'I take a shower.', highlight: 'showering' },
    { japanese: '朝シャワーを浴びます。', english: 'I shower in the morning.', highlight: 'bathing routine' }
  ],
  '開ける': [
    { japanese: '窓を開けます。', english: 'I open the window.', highlight: 'opening objects' },
    { japanese: 'ドアを開けてください。', english: 'Please open the door.', highlight: 'requesting to open' }
  ],
  '上げる': [
    { japanese: '手を上げます。', english: 'I raise my hand.', highlight: 'lifting up' },
    { japanese: 'プレゼントを上げます。', english: 'I give a present.', highlight: 'giving (humble)' }
  ],
  '集める': [
    { japanese: '切手を集めます。', english: 'I collect stamps.', highlight: 'collecting hobby' },
    { japanese: 'お金を集めます。', english: 'I gather money.', highlight: 'gathering resources' }
  ],
  'いじめる': [
    { japanese: 'いじめないでください。', english: 'Please don\'t bully.', highlight: 'bullying behavior' },
    { japanese: '弱い子をいじめます。', english: 'Bullying weak children.', highlight: 'picking on others' }
  ],
  '受ける': [
    { japanese: '試験を受けます。', english: 'I take an exam.', highlight: 'taking tests' },
    { japanese: 'テストを受けました。', english: 'I took a test.', highlight: 'undergoing examination' }
  ],
  '売れる': [
    { japanese: 'よく売れます。', english: 'It sells well.', highlight: 'good sales' },
    { japanese: 'この本は売れました。', english: 'This book sold out.', highlight: 'being sold' }
  ],
  '起こす': [
    { japanese: '友達を起こします。', english: 'I wake up my friend.', highlight: 'waking someone' },
    { japanese: '朝6時に起こしてください。', english: 'Please wake me at 6 AM.', highlight: 'alarm/wake-up call' }
  ],
  '怒る': [
    { japanese: '先生が怒ります。', english: 'The teacher gets angry.', highlight: 'becoming angry' },
    { japanese: '怒らないでください。', english: 'Please don\'t get angry.', highlight: 'expressing anger' }
  ],
  '覚える': [
    { japanese: '漢字を覚えます。', english: 'I memorize kanji.', highlight: 'memorization' },
    { japanese: '名前を覚えてください。', english: 'Please remember my name.', highlight: 'remembering' }
  ],
  '教える': [
    { japanese: '英語を教えます。', english: 'I teach English.', highlight: 'instruction' },
    { japanese: '道を教えてください。', english: 'Please tell me the way.', highlight: 'informing' }
  ],
  '落ちる': [
    { japanese: '葉が落ちます。', english: 'Leaves fall.', highlight: 'natural falling' },
    { japanese: '試験に落ちました。', english: 'I failed the exam.', highlight: 'failing test' }
  ],
  '下りる': [
    { japanese: '階段を下ります。', english: 'I go down the stairs.', highlight: 'descending' },
    { japanese: '山を下ります。', english: 'I go down the mountain.', highlight: 'coming down' }
  ],
  '変える': [
    { japanese: '予定を変えます。', english: 'I change plans.', highlight: 'altering plans' },
    { japanese: '服を変えます。', english: 'I change clothes.', highlight: 'changing items' }
  ],
  '気をつける': [
    { japanese: '気をつけてください。', english: 'Please be careful.', highlight: 'warning' },
    { japanese: '車に気をつけます。', english: 'I watch out for cars.', highlight: 'being cautious' }
  ],
  '消える': [
    { japanese: '電気が消えました。', english: 'The light went out.', highlight: 'lights going off' },
    { japanese: '雪が消えます。', english: 'The snow disappears.', highlight: 'vanishing' }
  ],
  '壊れる': [
    { japanese: '時計が壊れました。', english: 'The clock broke.', highlight: 'breaking down' },
    { japanese: 'パソコンが壊れています。', english: 'The computer is broken.', highlight: 'being broken' }
  ],
  '困る': [
    { japanese: '困っています。', english: 'I am troubled.', highlight: 'being in trouble' },
    { japanese: 'お金がなくて困ります。', english: 'I\'m in trouble without money.', highlight: 'financial difficulty' }
  ],
  '閉まる': [
    { japanese: 'ドアが閉まります。', english: 'The door closes.', highlight: 'automatic closing' },
    { japanese: '店が閉まりました。', english: 'The store closed.', highlight: 'closing time' }
  ],
  '閉める': [
    { japanese: 'ドアを閉めます。', english: 'I close the door.', highlight: 'manual closing' },
    { japanese: '窓を閉めてください。', english: 'Please close the window.', highlight: 'requesting closure' }
  ],
  '締める': [
    { japanese: 'ネクタイを締めます。', english: 'I tighten my tie.', highlight: 'fastening' },
    { japanese: 'ベルトを締めます。', english: 'I fasten my belt.', highlight: 'securing items' }
  ],
  '出る': [
    { japanese: '家を出ます。', english: 'I leave home.', highlight: 'departing' },
    { japanese: '外に出ます。', english: 'I go outside.', highlight: 'going out' },
    { japanese: '大学を出ました。', english: 'I graduated from university.', highlight: 'completing education' }
  ],
  '捨てる': [
    { japanese: 'ゴミを捨てます。', english: 'I throw away trash.', highlight: 'disposing waste' },
    { japanese: 'ここに捨てないでください。', english: 'Please don\'t throw away here.', highlight: 'littering prohibition' }
  ],
  '違える': [
    { japanese: '間違えました。', english: 'I made a mistake.', highlight: 'making errors' },
    { japanese: '道を間違えました。', english: 'I took the wrong way.', highlight: 'going wrong' }
  ],
  '疲れる': [
    { japanese: '疲れました。', english: 'I\'m tired.', highlight: 'physical tiredness' },
    { japanese: '毎日疲れます。', english: 'I get tired every day.', highlight: 'daily fatigue' }
  ],
  '続ける': [
    { japanese: '勉強を続けます。', english: 'I continue studying.', highlight: 'continuing activity' },
    { japanese: '仕事を続けてください。', english: 'Please continue working.', highlight: 'urging continuation' }
  ],
  '勤める': [
    { japanese: '会社に勤めます。', english: 'I work at a company.', highlight: 'employment' },
    { japanese: '銀行に勤めています。', english: 'I work at a bank.', highlight: 'current job' }
  ],
  'つける': [
    { japanese: '電気をつけます。', english: 'I turn on the light.', highlight: 'switching on' },
    { japanese: '名前をつけます。', english: 'I give a name.', highlight: 'naming' }
  ],
  '伝える': [
    { japanese: 'メッセージを伝えます。', english: 'I convey a message.', highlight: 'transmitting information' },
    { japanese: '気持ちを伝えます。', english: 'I express my feelings.', highlight: 'communicating emotions' }
  ],
  '届ける': [
    { japanese: '荷物を届けます。', english: 'I deliver a package.', highlight: 'delivery' },
    { japanese: '家まで届けてください。', english: 'Please deliver to my house.', highlight: 'requesting delivery' }
  ],
  '泣く': [
    { japanese: '赤ちゃんが泣きます。', english: 'The baby cries.', highlight: 'crying behavior' },
    { japanese: '悲しくて泣きます。', english: 'I cry because I\'m sad.', highlight: 'emotional crying' }
  ],
  '直る': [
    { japanese: '時計が直りました。', english: 'The clock was fixed.', highlight: 'being repaired' },
    { japanese: '風邪が直りました。', english: 'My cold got better.', highlight: 'recovering' }
  ],
  '並べる': [
    { japanese: '本を並べます。', english: 'I line up books.', highlight: 'arranging in order' },
    { japanese: '椅子を並べてください。', english: 'Please arrange the chairs.', highlight: 'organizing items' }
  ],
  '慣れる': [
    { japanese: '日本の生活に慣れました。', english: 'I got used to life in Japan.', highlight: 'acclimatization' },
    { japanese: '仕事に慣れます。', english: 'I get used to work.', highlight: 'adaptation' }
  ],
  '逃げる': [
    { japanese: '泥棒が逃げました。', english: 'The thief escaped.', highlight: 'escaping' },
    { japanese: '危ないから逃げます。', english: 'I run away because it\'s dangerous.', highlight: 'fleeing danger' }
  ],
  '似る': [
    { japanese: '父に似ています。', english: 'I resemble my father.', highlight: 'resemblance' },
    { japanese: '兄と似ています。', english: 'I look like my brother.', highlight: 'similarity' }
  ],
  '抜ける': [
    { japanese: '歯が抜けました。', english: 'My tooth came out.', highlight: 'falling out' },
    { japanese: 'トンネルを抜けます。', english: 'I go through the tunnel.', highlight: 'passing through' }
  ],
  '残る': [
    { japanese: 'まだ残っています。', english: 'It still remains.', highlight: 'remaining' },
    { japanese: '会社に残ります。', english: 'I stay at the company.', highlight: 'staying behind' }
  ],
  '晴れる': [
    { japanese: '明日は晴れます。', english: 'Tomorrow will be sunny.', highlight: 'clear weather' },
    { japanese: '午後から晴れます。', english: 'It will clear up in the afternoon.', highlight: 'weather improving' }
  ],
  '冷える': [
    { japanese: '今日は冷えます。', english: 'It\'s cold today.', highlight: 'cold temperature' },
    { japanese: '体が冷えました。', english: 'My body got cold.', highlight: 'feeling cold' }
  ],
  '増える': [
    { japanese: '人が増えました。', english: 'People increased.', highlight: 'increasing number' },
    { japanese: '体重が増えます。', english: 'My weight increases.', highlight: 'weight gain' }
  ],
  '間に合う': [
    { japanese: '時間に間に合います。', english: 'I\'m in time.', highlight: 'being on time' },
    { japanese: '間に合いました。', english: 'I made it.', highlight: 'arriving just in time' }
  ],
  '見せる': [
    { japanese: '写真を見せます。', english: 'I show a photo.', highlight: 'displaying' },
    { japanese: 'パスポートを見せてください。', english: 'Please show me your passport.', highlight: 'requesting to see' }
  ],
  '持ってくる': [
    { japanese: '本を持ってきます。', english: 'I bring a book.', highlight: 'bringing items' },
    { japanese: '明日持ってきてください。', english: 'Please bring it tomorrow.', highlight: 'requesting delivery' }
  ],
  '辞める': [
    { japanese: '会社を辞めます。', english: 'I quit the company.', highlight: 'resigning job' },
    { japanese: 'たばこを辞めます。', english: 'I quit smoking.', highlight: 'stopping habit' }
  ],
  '訳す': [
    { japanese: '英語に訳します。', english: 'I translate into English.', highlight: 'language translation' },
    { japanese: 'この文を訳してください。', english: 'Please translate this sentence.', highlight: 'requesting translation' }
  ],
  '笑う': [
    { japanese: '友達が笑います。', english: 'My friend laughs.', highlight: 'laughing' },
    { japanese: '面白くて笑います。', english: 'I laugh because it\'s funny.', highlight: 'reacting to humor' }
  ],
  '別れる': [
    { japanese: '彼女と別れました。', english: 'I broke up with my girlfriend.', highlight: 'ending relationship' },
    { japanese: 'ここで別れます。', english: 'We part ways here.', highlight: 'parting' }
  ],
  '渡る': [
    { japanese: '道を渡ります。', english: 'I cross the street.', highlight: 'crossing road' },
    { japanese: '橋を渡ります。', english: 'I cross the bridge.', highlight: 'going across' }
  ],
  '渡す': [
    { japanese: 'ペンを渡します。', english: 'I hand over a pen.', highlight: 'passing object' },
    { japanese: 'プレゼントを渡します。', english: 'I give a present.', highlight: 'giving gift' }
  ],
  '案内する': [
    { japanese: '友達を案内します。', english: 'I guide my friend.', highlight: 'showing around' },
    { japanese: '道を案内してください。', english: 'Please show me the way.', highlight: 'requesting guidance' }
  ],
  '片付ける': [
    { japanese: '部屋を片付けます。', english: 'I tidy up the room.', highlight: 'cleaning/organizing' },
    { japanese: '机を片付けてください。', english: 'Please clean up the desk.', highlight: 'requesting tidying' }
  ],
  '心配する': [
    { japanese: '心配しないでください。', english: 'Please don\'t worry.', highlight: 'reassuring' },
    { japanese: '家族を心配します。', english: 'I worry about my family.', highlight: 'being concerned' }
  ],
  '出張する': [
    { japanese: '大阪に出張します。', english: 'I go on a business trip to Osaka.', highlight: 'business travel' },
    { japanese: '来週出張します。', english: 'I have a business trip next week.', highlight: 'work-related travel' }
  ],
  '準備する': [
    { japanese: '会議の準備をします。', english: 'I prepare for the meeting.', highlight: 'making ready' },
    { japanese: '旅行の準備をします。', english: 'I prepare for the trip.', highlight: 'getting ready' }
  ],
  '説明する': [
    { japanese: 'ルールを説明します。', english: 'I explain the rules.', highlight: 'clarifying' },
    { japanese: '詳しく説明してください。', english: 'Please explain in detail.', highlight: 'requesting explanation' }
  ],
  '電話する': [
    { japanese: '友達に電話します。', english: 'I call my friend.', highlight: 'making phone call' },
    { japanese: '後で電話してください。', english: 'Please call later.', highlight: 'requesting callback' }
  ],
  '予約する': [
    { japanese: 'ホテルを予約します。', english: 'I reserve a hotel.', highlight: 'booking accommodation' },
    { japanese: 'レストランを予約しました。', english: 'I booked a restaurant.', highlight: 'making reservation' }
  ],
  '連絡する': [
    { japanese: '後で連絡します。', english: 'I will contact you later.', highlight: 'getting in touch' },
    { japanese: 'メールで連絡してください。', english: 'Please contact by email.', highlight: 'communication method' }
  ],
  '見学する': [
    { japanese: '工場を見学します。', english: 'I tour the factory.', highlight: 'visiting to learn' },
    { japanese: '学校を見学しました。', english: 'I visited the school.', highlight: 'educational visit' }
  ],
  '練習する': [
    { japanese: '日本語を練習します。', english: 'I practice Japanese.', highlight: 'language practice' },
    { japanese: '毎日練習します。', english: 'I practice every day.', highlight: 'regular training' }
  ],
  '履く': [
    { japanese: '靴を履きます。', english: 'I put on shoes.', highlight: 'wearing footwear' },
    { japanese: 'ズボンを履きます。', english: 'I put on pants.', highlight: 'wearing lower body' }
  ]
};

// Function to get examples for a verb
function getExamplesForVerb(verb) {
  // Try exact kanji match first
  if (verbExamples[verb.kanji]) {
    return verbExamples[verb.kanji];
  }

  // Try with context suffix for verbs that were kept separate
  if (verb.context) {
    const keyWithContext = `${verb.kanji}_${verb.context}`;
    if (verbExamples[keyWithContext]) {
      return verbExamples[keyWithContext];
    }
  }

  // For teaching/telling distinction
  if (verb.kanji === '教える' && verb.context === 'informing') {
    return verbExamples['教える_telling'] || verbExamples['教える'];
  }

  // For listen/ask distinction
  if (verb.kanji === '聞く' && verb.context === 'listening') {
    return verbExamples['聞く_listening'] || verbExamples['聞く'];
  }
  if (verb.kanji === '聞く' && verb.context === 'asking') {
    return verbExamples['聞く_asking'] || verbExamples['聞く'];
  }

  // Generic fallback
  return [
    {
      japanese: `${verb.conjugations.masu}。`,
      english: `I ${verb.primaryMeaning.split(';')[0].split(',')[0].trim()}.`,
      highlight: 'general usage'
    },
    {
      japanese: `毎日${verb.conjugations.masu}。`,
      english: `I ${verb.primaryMeaning.split(';')[0].split(',')[0].trim()} every day.`,
      highlight: 'regular activity'
    }
  ];
}

// Add examples to each verb
let addedCount = 0;
let missingCount = 0;

data.verbs.forEach(verb => {
  const examples = getExamplesForVerb(verb);
  verb.examples = examples;

  if (verbExamples[verb.kanji] || (verb.context && verbExamples[`${verb.kanji}_${verb.context}`])) {
    addedCount++;
    console.log(`✓ ${verb.kanji} ${verb.context ? '[' + verb.context + ']' : ''}: ${examples.length} examples`);
  } else {
    missingCount++;
    console.log(`○ ${verb.kanji}: using generic examples`);
  }
});

console.log(`\n=== SUMMARY ===`);
console.log(`Total verbs: ${data.verbs.length}`);
console.log(`With custom examples: ${addedCount}`);
console.log(`With generic examples: ${missingCount}`);

// Save the updated dataset
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`\n✅ Examples added to all verbs!`);
console.log(`✅ Dataset saved to: ${dataPath}`);
