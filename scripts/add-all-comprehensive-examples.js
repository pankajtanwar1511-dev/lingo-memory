const fs = require('fs');
const path = require('path');

// Comprehensive examples database for ALL N5 verbs
const verbExamplesDatabase = {
  // あ行
  "会う": [
    { japanese: "明日、友達に会います。", kana: "あした、ともだちにあいます。", english: "I will meet my friend tomorrow.", highlight: "meeting someone" },
    { japanese: "駅で午後三時に会いましょう。", kana: "えきでごごさんじにあいましょう。", english: "Let's meet at the station at 3 PM.", highlight: "arranging a meeting" }
  ],
  "遊ぶ": [
    { japanese: "週末に公園で子供たちが遊びます。", kana: "しゅうまつにこうえんでこどもたちがあそびます。", english: "Children play in the park on weekends.", highlight: "playing outdoors" },
    { japanese: "毎日、学校の後で友達と遊びます。", kana: "まいにち、がっこうのあとでともだちとあそびます。", english: "I play with friends every day after school.", highlight: "spending time with friends" }
  ],
  "洗う": [
    { japanese: "毎朝、顔を洗います。", kana: "まいあさ、かおをあらいます。", english: "I wash my face every morning.", highlight: "morning routine" },
    { japanese: "食事の前に手を洗いましょう。", kana: "しょくじのまえにてをあらいましょう。", english: "Let's wash our hands before the meal.", highlight: "hygiene practice" }
  ],
  "ある": [
    { japanese: "この近くに銀行がありますか。", kana: "このちかくにぎんこうがありますか。", english: "Is there a bank near here?", highlight: "asking about location" },
    { japanese: "机の上に本があります。", kana: "つくえのうえにほんがあります。", english: "There is a book on the desk.", highlight: "describing location" }
  ],
  "歩く": [
    { japanese: "毎朝、公園を三十分歩きます。", kana: "まいあさ、こうえんをさんじゅっぷんあるきます。", english: "I walk in the park for 30 minutes every morning.", highlight: "daily exercise" },
    { japanese: "駅まで歩いて十五分かかります。", kana: "えきまであるいてじゅうごふんかかります。", english: "It takes 15 minutes to walk to the station.", highlight: "commuting distance" }
  ],
  "言う": [
    { japanese: "先生が明日テストだと言いました。", kana: "せんせいがあしたテストだといいました。", english: "The teacher said there will be a test tomorrow.", highlight: "reporting information" },
    { japanese: "日本語で何と言いますか。", kana: "にほんごでなんといいますか。", english: "What do you say in Japanese?", highlight: "asking for translation" }
  ],
  "行く": [
    { japanese: "来週、京都に行きます。", kana: "らいしゅう、きょうとにいきます。", english: "I will go to Kyoto next week.", highlight: "travel plans" },
    { japanese: "毎日、バスで会社に行きます。", kana: "まいにち、バスでかいしゃにいきます。", english: "I go to the company by bus every day.", highlight: "daily commute" }
  ],
  "急ぐ": [
    { japanese: "会議に遅れるので急いでください。", kana: "かいぎにおくれるのでいそいでください。", english: "Please hurry because we'll be late for the meeting.", highlight: "urgent situation" },
    { japanese: "朝、時間がないので急ぎます。", kana: "あさ、じかんがないのでいそぎます。", english: "I hurry in the morning because I don't have time.", highlight: "time pressure" }
  ],
  "いる": [
    { japanese: "今、図書館に友達がいます。", kana: "いま、としょかんにともだちがいます。", english: "My friend is at the library now.", highlight: "current location" },
    { japanese: "部屋に猫が二匹います。", kana: "へやにねこがにひきいます。", english: "There are two cats in the room.", highlight: "counting animals" }
  ],
  "要る": [
    { japanese: "この仕事にパソコンが要ります。", kana: "このしごとにパソコンがいります。", english: "I need a computer for this work.", highlight: "work necessity" },
    { japanese: "旅行にお金がたくさん要ります。", kana: "りょこうにおかねがたくさんいります。", english: "I need a lot of money for the trip.", highlight: "travel expenses" }
  ],
  "入る": [
    { japanese: "朝七時に教室に入ります。", kana: "あささちじにきょうしつにはいります。", english: "I enter the classroom at 7 AM.", highlight: "arriving at class" },
    { japanese: "毎晩、お風呂に入ります。", kana: "まいばん、おふろにはいります。", english: "I take a bath every evening.", highlight: "daily routine" }
  ],
  "歌う": [
    { japanese: "週末、カラオケで日本の歌を歌います。", kana: "しゅうまつ、カラオケでにほんのうたをうたいます。", english: "I sing Japanese songs at karaoke on weekends.", highlight: "entertainment activity" },
    { japanese: "音楽の授業で歌を歌いました。", kana: "おんがくのじゅぎょうでうたをうたいました。", english: "We sang songs in music class.", highlight: "school activity" }
  ],
  "売る": [
    { japanese: "この店で新鮮な魚を売ります。", kana: "このみせでしんせんなさかなをうります。", english: "This shop sells fresh fish.", highlight: "store merchandise" },
    { japanese: "古い本をインターネットで売りました。", kana: "ふるいほんをインターネットでうりました。", english: "I sold old books on the internet.", highlight: "online selling" }
  ],
  "起きる": [
    { japanese: "毎朝六時に起きます。", kana: "まいあさろくじにおきます。", english: "I wake up at 6 AM every morning.", highlight: "daily routine" },
    { japanese: "昨日、寝坊して八時に起きました。", kana: "きのう、ねぼうしてはちじにおきました。", english: "I overslept yesterday and woke up at 8 AM.", highlight: "being late" }
  ],
  "置く": [
    { japanese: "机の上に辞書を置いてください。", kana: "つくえのうえにじしょをおいてください。", english: "Please put the dictionary on the desk.", highlight: "placing objects" },
    { japanese: "ここに荷物を置いてもいいですか。", kana: "ここににもつをおいてもいいですか。", english: "May I put my luggage here?", highlight: "asking permission" }
  ],
  "降りる": [
    { japanese: "次の駅で電車を降ります。", kana: "つぎのえきででんしゃをおります。", english: "I will get off the train at the next station.", highlight: "transportation" },
    { japanese: "三階でエレベーターを降りてください。", kana: "さんがいでエレベーターをおりてください。", english: "Please get off the elevator on the third floor.", highlight: "building navigation" }
  ],
  "終わる": [
    { japanese: "授業は午後三時に終わります。", kana: "じゅぎょうはごごさんじにおわります。", english: "Class ends at 3 PM.", highlight: "school schedule" },
    { japanese: "この映画は二時間で終わりました。", kana: "このえいがはにじかんでおわりました。", english: "This movie ended in two hours.", highlight: "duration" }
  ],
  "泳ぐ": [
    { japanese: "夏、海でよく泳ぎます。", kana: "なつ、うみでよくおよぎます。", english: "I often swim in the sea in summer.", highlight: "summer activity" },
    { japanese: "毎週土曜日にプールで泳ぎます。", kana: "まいしゅうどようびにプールでおよぎます。", english: "I swim in the pool every Saturday.", highlight: "regular exercise" }
  ],
  // か行
  "買う": [
    { japanese: "スーパーで野菜と肉を買います。", kana: "スーパーでやさいとにくをかいます。", english: "I buy vegetables and meat at the supermarket.", highlight: "grocery shopping" },
    { japanese: "誕生日に新しい時計を買いました。", kana: "たんじょうびにあたらしいとけいをかいました。", english: "I bought a new watch on my birthday.", highlight: "special purchase" }
  ],
  "帰る": [
    { japanese: "毎日七時に家に帰ります。", kana: "まいにちしちじにいえにかえります。", english: "I return home at 7 PM every day.", highlight: "daily routine" },
    { japanese: "夏休みに国に帰ります。", kana: "なつやすみにくににかえります。", english: "I will return to my country during summer vacation.", highlight: "travel plans" }
  ],
  "かかる": [
    { japanese: "東京から大阪まで三時間かかります。", kana: "とうきょうからおおさかまでさんじかんかかります。", english: "It takes three hours from Tokyo to Osaka.", highlight: "travel time" },
    { japanese: "このコンピュータは十万円かかりました。", kana: "このコンピュータはじゅうまんえんかかりました。", english: "This computer cost 100,000 yen.", highlight: "expense" }
  ],
  "書く": [
    { japanese: "毎日、日記を書きます。", kana: "まいにち、にっきをかきます。", english: "I write a diary every day.", highlight: "daily habit" },
    { japanese: "黒板に漢字を書いてください。", kana: "こくばんにかんじをかいてください。", english: "Please write kanji on the blackboard.", highlight: "classroom instruction" }
  ],
  "貸す": [
    { japanese: "友達に本を貸しました。", kana: "ともだちにほんをかしました。", english: "I lent a book to my friend.", highlight: "lending items" },
    { japanese: "ペンを貸してください。", kana: "ペンをかしてください。", english: "Please lend me a pen.", highlight: "requesting help" }
  ],
  "かぶる": [
    { japanese: "冬は寒いので帽子をかぶります。", kana: "ふゆはさむいのでぼうしをかぶります。", english: "I wear a hat in winter because it's cold.", highlight: "winter clothing" },
    { japanese: "学校でヘルメットをかぶってください。", kana: "がっこうでヘルメットをかぶってください。", english: "Please wear a helmet at school.", highlight: "safety equipment" }
  ],
  "借りる": [
    { japanese: "図書館で本を三冊借りました。", kana: "としょかんでほんをさんさつかりました。", english: "I borrowed three books from the library.", highlight: "library use" },
    { japanese: "友達からお金を借りたくないです。", kana: "ともだちからおかねをかりたくないです。", english: "I don't want to borrow money from friends.", highlight: "personal policy" }
  ],
  "消す": [
    { japanese: "寝る前に部屋の電気を消します。", kana: "ねるまえにへやのでんきをけします。", english: "I turn off the room light before sleeping.", highlight: "bedtime routine" },
    { japanese: "黒板の字を消してください。", kana: "こくばんのじをけしてください。", english: "Please erase the writing on the blackboard.", highlight: "classroom task" }
  ],
  "着る": [
    { japanese: "今日は寒いのでコートを着ます。", kana: "きょうはさむいのでコートをきます。", english: "I wear a coat today because it's cold.", highlight: "weather-appropriate clothing" },
    { japanese: "パーティーで新しいドレスを着ました。", kana: "パーティーであたらしいドレスをきました。", english: "I wore a new dress at the party.", highlight: "special occasion" }
  ],
  "切る": [
    { japanese: "料理をする時、野菜を小さく切ります。", kana: "りょうりをするとき、やさいをちいさくきります。", english: "When cooking, I cut vegetables into small pieces.", highlight: "food preparation" },
    { japanese: "はさみで紙を切ってください。", kana: "はさみでかみをきってください。", english: "Please cut the paper with scissors.", highlight: "craft activity" }
  ],
  "着る": [
    { japanese: "今日は寒いのでセーターを着ます。", kana: "きょうはさむいのでセーターをきます。", english: "I wear a sweater today because it's cold.", highlight: "weather clothing" },
    { japanese: "結婚式で着物を着ました。", kana: "けっこんしきできものをきました。", english: "I wore a kimono at the wedding.", highlight: "formal occasion" }
  ],
  "来る": [
    { japanese: "明日の朝九時に会社に来てください。", kana: "あしたのあさくじにかいしゃにきてください。", english: "Please come to the office at 9 AM tomorrow.", highlight: "appointment" },
    { japanese: "週末、友達が家に来ます。", kana: "しゅうまつ、ともだちがいえにきます。", english: "My friend will come to my house on the weekend.", highlight: "social visit" }
  ],
  "曇る": [
    { japanese: "明日は曇るそうです。", kana: "あしたはくもるそうです。", english: "I heard it will be cloudy tomorrow.", highlight: "weather forecast" },
    { japanese: "午後から空が曇りました。", kana: "ごごからそらがくもりました。", english: "The sky became cloudy from the afternoon.", highlight: "weather change" }
  ],
  // さ行
  "咲く": [
    { japanese: "春に公園で桜が咲きます。", kana: "はるにこうえんでさくらがさきます。", english: "Cherry blossoms bloom in the park in spring.", highlight: "seasonal nature" },
    { japanese: "庭にきれいな花が咲いています。", kana: "にわにきれいなはながさいています。", english: "Beautiful flowers are blooming in the garden.", highlight: "garden scenery" }
  ],
  "座る": [
    { japanese: "電車で席に座りました。", kana: "でんしゃでせきにすわりました。", english: "I sat on a seat in the train.", highlight: "public transportation" },
    { japanese: "ここに座ってください。", kana: "ここにすわってください。", english: "Please sit here.", highlight: "offering a seat" }
  ],
  "残る": [
    { japanese: "会議の後で質問が残りました。", kana: "かいぎのあとでしつもんがのこりました。", english: "Questions remained after the meeting.", highlight: "unfinished business" },
    { japanese: "冷蔵庫に食べ物が少し残っています。", kana: "れいぞうこにたべものがすこしのこっています。", english: "A little food remains in the refrigerator.", highlight: "leftovers" }
  ],
  "死ぬ": [
    { japanese: "祖父は去年、病院で死にました。", kana: "そふはきょねん、びょういんでしにました。", english: "My grandfather died in the hospital last year.", highlight: "family loss" },
    { japanese: "この植物は水がないと死にます。", kana: "このしょくぶつはみずがないとしにます。", english: "This plant will die without water.", highlight: "plant care" }
  ],
  "閉まる": [
    { japanese: "銀行は午後五時に閉まります。", kana: "ぎんこうはごごごじにしまります。", english: "The bank closes at 5 PM.", highlight: "business hours" },
    { japanese: "風でドアが閉まりました。", kana: "かぜでドアがしまりました。", english: "The door closed because of the wind.", highlight: "automatic action" }
  ],
  "閉める": [
    { japanese: "寒いので窓を閉めてください。", kana: "さむいのでまどをしめてください。", english: "Please close the window because it's cold.", highlight: "temperature control" },
    { japanese: "出かける前にドアを閉めます。", kana: "でかけるまえにドアをしめます。", english: "I close the door before going out.", highlight: "leaving routine" }
  ],
  "知る": [
    { japanese: "この近くに良いレストランを知っていますか。", kana: "このちかくにいいレストランをしっていますか。", english: "Do you know a good restaurant near here?", highlight: "seeking local information" },
    { japanese: "田中さんを知っていますか。", kana: "たなかさんをしっていますか。", english: "Do you know Mr. Tanaka?", highlight: "acquaintance" }
  ],
  "吸う": [
    { japanese: "この建物の中でタバコを吸わないでください。", kana: "このたてもののなかでタバコをすわないでください。", english: "Please don't smoke inside this building.", highlight: "smoking rules" },
    { japanese: "深く息を吸ってください。", kana: "ふかくいきをすってください。", english: "Please breathe in deeply.", highlight: "breathing instruction" }
  ],
  "住む": [
    { japanese: "東京に五年間住んでいます。", kana: "とうきょうにごねんかんすんでいます。", english: "I have been living in Tokyo for five years.", highlight: "residence duration" },
    { japanese: "駅の近くに住みたいです。", kana: "えきのちかくにすみたいです。", english: "I want to live near the station.", highlight: "housing preference" }
  ],
  "する": [
    { japanese: "毎日、宿題をします。", kana: "まいにち、しゅくだいをします。", english: "I do homework every day.", highlight: "study routine" },
    { japanese: "週末、買い物をします。", kana: "しゅうまつ、かいものをします。", english: "I go shopping on weekends.", highlight: "leisure activity" }
  ],
  // た行
  "立つ": [
    { japanese: "バスの中で立っています。", kana: "バスのなかでたっています。", english: "I'm standing in the bus.", highlight: "public transport" },
    { japanese: "授業の前に立ってください。", kana: "じゅぎょうのまえにたってください。", english: "Please stand before class.", highlight: "classroom etiquette" }
  ],
  "頼む": [
    { japanese: "友達に宿題を手伝ってと頼みました。", kana: "ともだちにしゅくだいをてつだってとたのみました。", english: "I asked my friend to help with homework.", highlight: "requesting assistance" },
    { japanese: "レストランで寿司を頼みました。", kana: "レストランですしをたのみました。", english: "I ordered sushi at the restaurant.", highlight: "food ordering" }
  ],
  "食べる": [
    { japanese: "毎朝、パンと果物を食べます。", kana: "まいあさ、パンとくだものをたべます。", english: "I eat bread and fruit every morning.", highlight: "breakfast routine" },
    { japanese: "昼休みに学食でラーメンを食べました。", kana: "ひるやすみにがくしょくでラーメンをたべました。", english: "I ate ramen at the school cafeteria during lunch break.", highlight: "lunch at school" }
  ],
  "違う": [
    { japanese: "この答えは違います。", kana: "このこたえはちがいます。", english: "This answer is wrong.", highlight: "correction" },
    { japanese: "私の考えと先生の考えは違います。", kana: "わたしのかんがえとせんせいのかんがえはちがいます。", english: "My opinion and the teacher's opinion are different.", highlight: "differing views" }
  ],
  "使う": [
    { japanese: "毎日、パソコンを使って仕事をします。", kana: "まいにち、パソコンをつかってしごとをします。", english: "I work using a computer every day.", highlight: "work tool" },
    { japanese: "日本では箸を使って食べます。", kana: "にほんでははしをつかってたべます。", english: "In Japan, we eat using chopsticks.", highlight: "cultural practice" }
  ],
  "疲れる": [
    { japanese: "今日は仕事で疲れました。", kana: "きょうはしごとでつかれました。", english: "I got tired from work today.", highlight: "work exhaustion" },
    { japanese: "長い会議で疲れます。", kana: "ながいかいぎでつかれます。", english: "Long meetings tire me out.", highlight: "meeting fatigue" }
  ],
  "着く": [
    { japanese: "電車は午後三時に東京駅に着きます。", kana: "でんしゃはごごさんじにとうきょうえきにつきます。", english: "The train arrives at Tokyo Station at 3 PM.", highlight: "arrival time" },
    { japanese: "家に着いたら電話してください。", kana: "いえについたらでんわしてください。", english: "Please call me when you arrive home.", highlight: "arrival notification" }
  ],
  "作る": [
    { japanese: "週末、友達と料理を作ります。", kana: "しゅうまつ、ともだちとりょうりをつくります。", english: "I make food with friends on weekends.", highlight: "cooking together" },
    { japanese: "授業で紙で花を作りました。", kana: "じゅぎょうでかみではなをつくりました。", english: "We made flowers from paper in class.", highlight: "craft project" }
  ],
  "点ける": [
    { japanese: "暗いので電気を点けてください。", kana: "くらいのででんきをつけてください。", english: "Please turn on the light because it's dark.", highlight: "lighting control" },
    { japanese: "寒い朝、ストーブを点けます。", kana: "さむいあさ、ストーブをつけます。", english: "I turn on the heater on cold mornings.", highlight: "heating usage" }
  ],
  "勤める": [
    { japanese: "父は銀行に勤めています。", kana: "ちちはぎんこうにつとめています。", english: "My father works at a bank.", highlight: "employment" },
    { japanese: "東京の会社に勤めたいです。", kana: "とうきょうのかいしゃにつとめたいです。", english: "I want to work at a company in Tokyo.", highlight: "career goal" }
  ],
  "出かける": [
    { japanese: "毎朝八時に家を出かけます。", kana: "まいあさはちじにいえをでかけます。", english: "I leave home at 8 AM every morning.", highlight: "morning departure" },
    { japanese: "週末、買い物に出かけます。", kana: "しゅうまつ、かいものにでかけます。", english: "I go out shopping on weekends.", highlight: "weekend activity" }
  ],
  "出す": [
    { japanese: "毎週火曜日にゴミを出します。", kana: "まいしゅうかようびにゴミをだします。", english: "I take out the trash every Tuesday.", highlight: "waste disposal" },
    { japanese: "明日、先生に宿題を出します。", kana: "あした、せんせいにしゅくだいをだします。", english: "I will submit homework to the teacher tomorrow.", highlight: "assignment submission" }
  ],
  "出る": [
    { japanese: "朝七時に家を出ます。", kana: "あさしちじにいえをでます。", english: "I leave home at 7 AM.", highlight: "departure time" },
    { japanese: "会議に出てください。", kana: "かいぎにでてください。", english: "Please attend the meeting.", highlight: "participation request" }
  ],
  "止まる": [
    { japanese: "信号で車が止まります。", kana: "しんごうでくるまがとまります。", english: "The car stops at the traffic light.", highlight: "traffic rules" },
    { japanese: "駅の前でバスが止まりました。", kana: "えきのまえでバスがとまりました。", english: "The bus stopped in front of the station.", highlight: "bus stop" }
  ],
  "止める": [
    { japanese: "赤信号で止めてください。", kana: "あかしんごうでとめてください。", english: "Please stop at the red light.", highlight: "driving instruction" },
    { japanese: "ここに車を止めてもいいですか。", kana: "ここにくるまをとめてもいいですか。", english: "May I park the car here?", highlight: "parking permission" }
  ],
  "撮る": [
    { japanese: "旅行で写真をたくさん撮ります。", kana: "りょこうでしゃしんをたくさんとります。", english: "I take many photos during trips.", highlight: "travel photography" },
    { japanese: "桜の木の前で写真を撮りましょう。", kana: "さくらのきのまえでしゃしんをとりましょう。", english: "Let's take a photo in front of the cherry tree.", highlight: "photo opportunity" }
  ],
  // な行
  "泣く": [
    { japanese: "悲しい映画を見て泣きました。", kana: "かなしいえいがをみてなきました。", english: "I cried watching a sad movie.", highlight: "emotional response" },
    { japanese: "赤ちゃんが夜中に泣きます。", kana: "あかちゃんがよなかになきます。", english: "The baby cries in the middle of the night.", highlight: "infant behavior" }
  ],
  "並ぶ": [
    { japanese: "人気のレストランの前で並びます。", kana: "にんきのレストランのまえでならびます。", english: "I line up in front of a popular restaurant.", highlight: "waiting in queue" },
    { japanese: "バス停で五人が並んでいます。", kana: "バスていでごにんがならんでいます。", english: "Five people are lining up at the bus stop.", highlight: "public transport queue" }
  ],
  "習う": [
    { japanese: "学校で英語を習います。", kana: "がっこうでえいごをならいます。", english: "I learn English at school.", highlight: "formal education" },
    { japanese: "毎週土曜日にピアノを習っています。", kana: "まいしゅうどようびにピアノをならっています。", english: "I'm learning piano every Saturday.", highlight: "regular lessons" }
  ],
  "脱ぐ": [
    { japanese: "家に入る前に靴を脱ぎます。", kana: "いえにはいるまえにくつをぬぎます。", english: "I take off my shoes before entering the house.", highlight: "cultural custom" },
    { japanese: "暑いのでジャケットを脱ぎました。", kana: "あついのでジャケットをぬぎました。", english: "I took off my jacket because it's hot.", highlight: "temperature adjustment" }
  ],
  "寝る": [
    { japanese: "毎晩十一時に寝ます。", kana: "まいばんじゅういちじにねます。", english: "I go to bed at 11 PM every night.", highlight: "sleep schedule" },
    { japanese: "疲れたので早く寝ました。", kana: "つかれたのではやくねました。", english: "I went to bed early because I was tired.", highlight: "rest need" }
  ],
  "登る": [
    { japanese: "夏に富士山に登りたいです。", kana: "なつにふじさんにのぼりたいです。", english: "I want to climb Mt. Fuji in summer.", highlight: "mountain climbing" },
    { japanese: "子供が木に登っています。", kana: "こどもがきにのぼっています。", english: "The child is climbing a tree.", highlight: "play activity" }
  ],
  "乗る": [
    { japanese: "毎日、電車に乗って会社に行きます。", kana: "まいにち、でんしゃにのってかいしゃにいきます。", english: "I take the train to work every day.", highlight: "daily commute" },
    { japanese: "自転車に乗るのが好きです。", kana: "じてんしゃにのるのがすきです。", english: "I like riding a bicycle.", highlight: "hobby preference" }
  ],
  "飲む": [
    { japanese: "朝、コーヒーを一杯飲みます。", kana: "あさ、コーヒーをいっぱいのみます。", english: "I drink a cup of coffee in the morning.", highlight: "morning routine" },
    { japanese: "暑い日にたくさん水を飲みます。", kana: "あついひにたくさんみずをのみます。", english: "I drink a lot of water on hot days.", highlight: "hydration" }
  ],
  // は行
  "入る": [
    { japanese: "朝八時に教室に入ります。", kana: "あさはちじにきょうしつにはいります。", english: "I enter the classroom at 8 AM.", highlight: "class arrival" },
    { japanese: "毎晩お風呂に入ります。", kana: "まいばんおふろにはいります。", english: "I take a bath every evening.", highlight: "bathing routine" }
  ],
  "履く": [
    { japanese: "寒い冬に厚い靴下を履きます。", kana: "さむいふゆにあついくつしたをはきます。", english: "I wear thick socks in cold winter.", highlight: "winter clothing" },
    { japanese: "学校で上履きを履いてください。", kana: "がっこうでうわばきをはいてください。", english: "Please wear indoor shoes at school.", highlight: "school rule" }
  ],
  "始まる": [
    { japanese: "授業は午前九時に始まります。", kana: "じゅぎょうはごぜんくじにはじまります。", english: "Class starts at 9 AM.", highlight: "schedule timing" },
    { japanese: "映画はもうすぐ始まります。", kana: "えいがはもうすぐはじまります。", english: "The movie will start soon.", highlight: "event timing" }
  ],
  "始める": [
    { japanese: "来月、新しい仕事を始めます。", kana: "らいげつ、あたらしいしごとをはじめます。", english: "I will start a new job next month.", highlight: "career change" },
    { japanese: "今日から日本語を勉強し始めました。", kana: "きょうからにほんごをべんきょうしはじめました。", english: "I started studying Japanese from today.", highlight: "new learning" }
  ],
  "走る": [
    { japanese: "毎朝、公園で三十分走ります。", kana: "まいあさ、こうえんでさんじゅっぷんはしります。", english: "I run for 30 minutes in the park every morning.", highlight: "exercise routine" },
    { japanese: "バスに遅れるので走りました。", kana: "バスにおくれるのではしりました。", english: "I ran because I was late for the bus.", highlight: "rushing situation" }
  ],
  "働く": [
    { japanese: "父は銀行で働いています。", kana: "ちちはぎんこうではたらいています。", english: "My father works at a bank.", highlight: "employment" },
    { japanese: "週末、レストランで働きます。", kana: "しゅうまつ、レストランではたらきます。", english: "I work at a restaurant on weekends.", highlight: "part-time job" }
  ],
  "貼る": [
    { japanese: "壁にポスターを貼りました。", kana: "かべにポスターをはりました。", english: "I put a poster on the wall.", highlight: "room decoration" },
    { japanese: "手紙に切手を貼ってください。", kana: "てがみにきってをはってください。", english: "Please put a stamp on the letter.", highlight: "mail preparation" }
  ],
  "晴れる": [
    { japanese: "明日は晴れるそうです。", kana: "あしたははれるそうです。", english: "I heard it will be sunny tomorrow.", highlight: "weather forecast" },
    { japanese: "週末、天気が晴れたら海に行きます。", kana: "しゅうまつ、てんきがはれたらうみにいきます。", english: "If the weather is sunny on the weekend, I'll go to the sea.", highlight: "conditional plan" }
  ],
  "引く": [
    { japanese: "風邪を引いたので学校を休みます。", kana: "かぜをひいたのでがっこうをやすみます。", english: "I'll take a day off from school because I caught a cold.", highlight: "illness absence" },
    { japanese: "辞書を引いて言葉を調べます。", kana: "じしょをひいてことばをしらべます。", english: "I look up words by consulting a dictionary.", highlight: "study method" }
  ],
  "弾く": [
    { japanese: "毎日、ピアノを一時間弾きます。", kana: "まいにち、ピアノをいちじかんひきます。", english: "I play the piano for one hour every day.", highlight: "music practice" },
    { japanese: "コンサートでギターを弾きました。", kana: "コンサートでギターをひきました。", english: "I played guitar at the concert.", highlight: "performance" }
  ],
  "開く": [
    { japanese: "図書館は朝九時に開きます。", kana: "としょかんはあさくじにひらきます。", english: "The library opens at 9 AM.", highlight: "opening hours" },
    { japanese: "窓を開けると風が入ります。", kana: "まどをあけるとかぜがはいります。", english: "When I open the window, wind comes in.", highlight: "ventilation" }
  ],
  "吹く": [
    { japanese: "今日は強い風が吹いています。", kana: "きょうはつよいかぜがふいています。", english: "A strong wind is blowing today.", highlight: "weather condition" },
    { japanese: "音楽の授業でフルートを吹きます。", kana: "おんがくのじゅぎょうでフルートをふきます。", english: "I play the flute in music class.", highlight: "instrument playing" }
  ],
  "降る": [
    { japanese: "明日は雨が降るそうです。", kana: "あしたはあめがふるそうです。", english: "I heard it will rain tomorrow.", highlight: "weather forecast" },
    { japanese: "冬に雪がたくさん降ります。", kana: "ふゆにゆきがたくさんふります。", english: "It snows a lot in winter.", highlight: "seasonal weather" }
  ],
  "曲がる": [
    { japanese: "次の角を右に曲がってください。", kana: "つぎのかどをみぎにまがってください。", english: "Please turn right at the next corner.", highlight: "giving directions" },
    { japanese: "この道は左に曲がります。", kana: "このみちはひだりにまがります。", english: "This road curves to the left.", highlight: "road description" }
  ],
  // ま行
  "曲げる": [
    { japanese: "体操で膝を曲げます。", kana: "たいそうでひざをまげます。", english: "I bend my knees during exercises.", highlight: "physical exercise" },
    { japanese: "針金を曲げて形を作ります。", kana: "はりがねをまげてかたちをつくります。", english: "I bend wire to make shapes.", highlight: "craft work" }
  ],
  "待つ": [
    { japanese: "駅で友達を三十分待ちました。", kana: "えきでともだちをさんじゅっぷんまちました。", english: "I waited for my friend at the station for 30 minutes.", highlight: "meeting delay" },
    { japanese: "バス停でバスを待っています。", kana: "バスていでバスをまっています。", english: "I'm waiting for the bus at the bus stop.", highlight: "public transport" }
  ],
  "磨く": [
    { japanese: "毎朝、歯を磨きます。", kana: "まいあさ、はをみがきます。", english: "I brush my teeth every morning.", highlight: "hygiene routine" },
    { japanese: "靴をきれいに磨きました。", kana: "くつをきれいにみがきました。", english: "I polished the shoes cleanly.", highlight: "shoe care" }
  ],
  "見せる": [
    { japanese: "友達に新しいスマホを見せました。", kana: "ともだちにあたらしいスマホをみせました。", english: "I showed my new smartphone to my friend.", highlight: "sharing possession" },
    { japanese: "先生にパスポートを見せてください。", kana: "せんせいにパスポートをみせてください。", english: "Please show your passport to the teacher.", highlight: "document verification" }
  ],
  "見る": [
    { japanese: "毎晩、テレビでニュースを見ます。", kana: "まいばん、テレビでニュースをみます。", english: "I watch the news on TV every evening.", highlight: "evening routine" },
    { japanese: "週末、映画館で映画を見ました。", kana: "しゅうまつ、えいがかんでえいがをみました。", english: "I watched a movie at the cinema on the weekend.", highlight: "leisure activity" }
  ],
  "持つ": [
    { japanese: "学校に教科書を持って行きます。", kana: "がっこうにきょうかしょをもっていきます。", english: "I bring textbooks to school.", highlight: "school preparation" },
    { japanese: "重い荷物を持ってください。", kana: "おもいにもつをもってください。", english: "Please hold the heavy luggage.", highlight: "helping with carrying" }
  ],
  // や行
  "休む": [
    { japanese: "今日は頭が痛いので会社を休みます。", kana: "きょうはあたまがいたいのでかいしゃをやすみます。", english: "I'll take a day off from work today because I have a headache.", highlight: "sick leave" },
    { japanese: "昼休みに図書館で休みます。", kana: "ひるやすみにとしょかんでやすみます。", english: "I rest at the library during lunch break.", highlight: "break time" }
  ],
  "呼ぶ": [
    { japanese: "友達を誕生日パーティーに呼びました。", kana: "ともだちをたんじょうびパーティーによびました。", english: "I invited friends to my birthday party.", highlight: "social invitation" },
    { japanese: "名前を呼んでください。", kana: "なまえをよんでください。", english: "Please call my name.", highlight: "roll call" }
  ],
  "読む": [
    { japanese: "毎晩、寝る前に本を読みます。", kana: "まいばん、ねるまえにほんをよみます。", english: "I read a book every evening before sleeping.", highlight: "bedtime routine" },
    { japanese: "図書館で日本語の新聞を読みました。", kana: "としょかんでにほんごのしんぶんをよみました。", english: "I read a Japanese newspaper at the library.", highlight: "study activity" }
  ],
  // わ行
  "渡る": [
    { japanese: "横断歩道で道を渡ります。", kana: "おうだんほどうでみちをわたります。", english: "I cross the road at the crosswalk.", highlight: "pedestrian safety" },
    { japanese: "橋を渡って学校に行きます。", kana: "はしをわたってがっこうにいきます。", english: "I go to school by crossing the bridge.", highlight: "commute route" }
  ],
  "渡す": [
    { japanese: "友達に誕生日プレゼントを渡しました。", kana: "ともだちにたんじょうびプレゼントをわたしました。", english: "I gave a birthday present to my friend.", highlight: "gift giving" },
    { japanese: "先生に宿題を渡してください。", kana: "せんせいにしゅくだいをわたしてください。", english: "Please hand in your homework to the teacher.", highlight: "assignment submission" }
  ],
  "忘れる": [
    { japanese: "昨日、傘を電車に忘れました。", kana: "きのう、かさをでんしゃにわすれました。", english: "I forgot my umbrella on the train yesterday.", highlight: "lost item" },
    { japanese: "約束の時間を忘れないでください。", kana: "やくそくのじかんをわすれないでください。", english: "Please don't forget the appointment time.", highlight: "reminder" }
  ],
  "笑う": [
    { japanese: "面白い話を聞いて笑いました。", kana: "おもしろいはなしをきいてわらいました。", english: "I laughed hearing a funny story.", highlight: "amusement" },
    { japanese: "赤ちゃんがよく笑います。", kana: "あかちゃんがよくわらいます。", english: "The baby laughs often.", highlight: "infant behavior" }
  ],
  // Additional verbs with alternative readings/meanings
  "上がる": [
    { japanese: "二階に上がってください。", kana: "にかいにあがってください。", english: "Please go up to the second floor.", highlight: "building navigation" },
    { japanese: "来週、給料が上がります。", kana: "らいしゅう、きゅうりょうがあがります。", english: "My salary will increase next week.", highlight: "pay raise" }
  ],
  "開ける": [
    { japanese: "暑いので窓を開けてください。", kana: "あついのでまどをあけてください。", english: "Please open the window because it's hot.", highlight: "ventilation" },
    { japanese: "朝七時に店を開けます。", kana: "あさしちじにみせをあけます。", english: "I open the shop at 7 AM.", highlight: "business opening" }
  ],
  "集まる": [
    { japanese: "週末、友達が公園に集まります。", kana: "しゅうまつ、ともだちがこうえんにあつまります。", english: "Friends gather in the park on weekends.", highlight: "social gathering" },
    { japanese: "会議室に午後二時に集まってください。", kana: "かいぎしつにごごにじにあつまってください。", english: "Please gather in the meeting room at 2 PM.", highlight: "work meeting" }
  ],
  "浴びる": [
    { japanese: "毎朝、シャワーを浴びます。", kana: "まいあさ、シャワーをあびます。", english: "I take a shower every morning.", highlight: "morning routine" },
    { japanese: "夏、海で太陽を浴びます。", kana: "なつ、うみでたいようをあびます。", english: "I sunbathe at the beach in summer.", highlight: "summer activity" }
  ],
  "生まれる": [
    { japanese: "私は東京で生まれました。", kana: "わたしはとうきょうでうまれました。", english: "I was born in Tokyo.", highlight: "birthplace" },
    { japanese: "赤ちゃんが昨日、病院で生まれました。", kana: "あかちゃんがきのう、びょういんでうまれました。", english: "A baby was born at the hospital yesterday.", highlight: "birth event" }
  ],
  "選ぶ": [
    { japanese: "レストランでメニューから料理を選びます。", kana: "レストランでメニューからりょうりをえらびます。", english: "I choose dishes from the menu at restaurants.", highlight: "ordering food" },
    { japanese: "大学で専攻を選びました。", kana: "だいがくでせんこうをえらびました。", english: "I chose my major at university.", highlight: "academic decision" }
  ],
  "教える": [
    { japanese: "毎週、子供たちに英語を教えます。", kana: "まいしゅう、こどもたちにえいごをおしえます。", english: "I teach English to children every week.", highlight: "teaching job" },
    { japanese: "駅への道を教えてください。", kana: "えきへのみちをおしえてください。", english: "Please tell me the way to the station.", highlight: "asking directions" }
  ],
  "覚える": [
    { japanese: "毎日、新しい漢字を五つ覚えます。", kana: "まいにち、あたらしいかんじをいつつおぼえます。", english: "I memorize five new kanji every day.", highlight: "study routine" },
    { japanese: "友達の電話番号を覚えています。", kana: "ともだちのでんわばんごうをおぼえています。", english: "I remember my friend's phone number.", highlight: "memory retention" }
  ],
  "落ちる": [
    { japanese: "木から葉が落ちます。", kana: "きからはがおちます。", english: "Leaves fall from trees.", highlight: "autumn scene" },
    { japanese: "テストに落ちたので悲しいです。", kana: "テストにおちたのでかなしいです。", english: "I'm sad because I failed the test.", highlight: "exam result" }
  ],
  "下りる": [
    { japanese: "階段を下りてください。", kana: "かいだんをおりてください。", english: "Please go down the stairs.", highlight: "building navigation" },
    { japanese: "次の駅で電車を下ります。", kana: "つぎのえきででんしゃをおります。", english: "I'll get off the train at the next station.", highlight: "transportation" }
  ],
  "踊る": [
    { japanese: "週末、クラブで踊ります。", kana: "しゅうまつ、クラブでおどります。", english: "I dance at clubs on weekends.", highlight: "nightlife activity" },
    { japanese: "パーティーで友達と踊りました。", kana: "パーティーでともだちとおどりました。", english: "I danced with friends at the party.", highlight: "social event" }
  ],
  "下ろす": [
    { japanese: "銀行でお金を下ろしました。", kana: "ぎんこうでおかねをおろしました。", english: "I withdrew money from the bank.", highlight: "banking transaction" },
    { japanese: "ここで荷物を下ろしてください。", kana: "ここでにもつをおろしてください。", english: "Please unload the luggage here.", highlight: "moving items" }
  ],
  "掛ける": [
    { japanese: "壁に絵を掛けました。", kana: "かべにえをかけました。", english: "I hung a picture on the wall.", highlight: "home decoration" },
    { japanese: "友達に電話を掛けます。", kana: "ともだちにでんわをかけます。", english: "I make a phone call to my friend.", highlight: "communication" }
  ],
  "代わる": [
    { japanese: "明日から天気が代わります。", kana: "あしたからてんきがかわります。", english: "The weather will change from tomorrow.", highlight: "weather forecast" },
    { japanese: "季節が代わると服も代わります。", kana: "きせつがかわるとふくもかわります。", english: "When seasons change, clothes change too.", highlight: "seasonal transition" }
  ],
  "通う": [
    { japanese: "毎日、電車で大学に通います。", kana: "まいにち、でんしゃでだいがくにかよいます。", english: "I commute to university by train every day.", highlight: "daily commute" },
    { japanese: "週三回、ジムに通っています。", kana: "しゅうさんかい、ジムにかよっています。", english: "I go to the gym three times a week.", highlight: "regular routine" }
  ],
  "決まる": [
    { japanese: "来月の会議の日程が決まりました。", kana: "らいげつのかいぎのにっていがきまりました。", english: "The schedule for next month's meeting was decided.", highlight: "scheduling" },
    { japanese: "旅行の計画が決まったら教えてください。", kana: "りょこうのけいかくがきまったらおしえてください。", english: "Please tell me when the travel plan is decided.", highlight: "planning coordination" }
  ],
  "壊れる": [
    { japanese: "昨日、パソコンが壊れました。", kana: "きのう、パソコンがこわれました。", english: "My computer broke yesterday.", highlight: "equipment failure" },
    { japanese: "古い時計が壊れています。", kana: "ふるいとけいがこわれています。", english: "The old clock is broken.", highlight: "damaged item" }
  ],
  "探す": [
    { japanese: "図書館で本を探しています。", kana: "としょかんでほんをさがしています。", english: "I'm looking for a book at the library.", highlight: "searching for items" },
    { japanese: "駅の近くで安い家を探します。", kana: "えきのちかくでやすいいえをさがします。", english: "I'm looking for a cheap house near the station.", highlight: "house hunting" }
  ],
  "触る": [
    { japanese: "美術館で展示品に触らないでください。", kana: "びじゅつかんでてんじひんにさわらないでください。", english: "Please don't touch the exhibits at the museum.", highlight: "museum rule" },
    { japanese: "熱いストーブに触ると危ないです。", kana: "あついストーブにさわるとあぶないです。", english: "It's dangerous to touch a hot stove.", highlight: "safety warning" }
  ],
  "死ぬ": [
    { japanese: "祖父は去年、病院で亡くなりました。", kana: "そふはきょねん、びょういんでなくなりました。", english: "My grandfather passed away at the hospital last year.", highlight: "family loss" },
    { japanese: "この植物は水がないと死にます。", kana: "このしょくぶつはみずがないとしにます。", english: "This plant will die without water.", highlight: "plant care" }
  ],
  "しまう": [
    { japanese: "本を棚にしまってください。", kana: "ほんをたなにしまってください。", english: "Please put the books away on the shelf.", highlight: "organizing items" },
    { japanese: "服をクローゼットにしまいます。", kana: "ふくをクローゼットにしまいます。", english: "I put clothes away in the closet.", highlight: "tidying up" }
  ],
  "説明する": [
    { japanese: "先生が文法を詳しく説明しました。", kana: "せんせいがぶんぽうをくわしくせつめいしました。", english: "The teacher explained grammar in detail.", highlight: "classroom instruction" },
    { japanese: "道を説明してください。", kana: "みちをせつめいしてください。", english: "Please explain the way.", highlight: "giving directions" }
  ],
  "相談する": [
    { japanese: "先生に進路について相談しました。", kana: "せんせいにしんろについてそうだんしました。", english: "I consulted with the teacher about my career path.", highlight: "academic guidance" },
    { japanese: "友達に恋愛の相談をします。", kana: "ともだちにれんあいのそうだんをします。", english: "I consult with friends about romance.", highlight: "personal advice" }
  ],
  "出席する": [
    { japanese: "明日の会議に出席します。", kana: "あしたのかいぎにしゅっせきします。", english: "I will attend tomorrow's meeting.", highlight: "work obligation" },
    { japanese: "毎日、授業に出席しています。", kana: "まいにち、じゅぎょうにしゅっせきしています。", english: "I attend classes every day.", highlight: "school attendance" }
  ],
  "連れて行く": [
    { japanese: "週末、子供を動物園に連れて行きます。", kana: "しゅうまつ、こどもをどうぶつえんにつれていきます。", english: "I'll take my child to the zoo on the weekend.", highlight: "family outing" },
    { japanese: "友達を新しいレストランに連れて行きました。", kana: "ともだちをあたらしいレストランにつれていきました。", english: "I took my friend to a new restaurant.", highlight: "social invitation" }
  ],
  "つける": [
    { japanese: "夜、部屋の電気をつけます。", kana: "よる、へやのでんきをつけます。", english: "I turn on the room light at night.", highlight: "lighting control" },
    { japanese: "寒いのでエアコンをつけてください。", kana: "さむいのでエアコンをつけてください。", english: "Please turn on the air conditioner because it's cold.", highlight: "climate control" }
  ],
  "手伝う": [
    { japanese: "母の料理を手伝います。", kana: "ははのりょうりをてつだいます。", english: "I help my mother with cooking.", highlight: "household help" },
    { japanese: "引っ越しを手伝ってください。", kana: "ひっこしをてつだってください。", english: "Please help with the move.", highlight: "requesting assistance" }
  ],
  "届く": [
    { japanese: "荷物は明日届きます。", kana: "にもつはあしたとどきます。", english: "The package will arrive tomorrow.", highlight: "delivery timing" },
    { japanese: "手紙が昨日届きました。", kana: "てがみがきのうとどきました。", english: "The letter arrived yesterday.", highlight: "mail receipt" }
  ],
  "直す": [
    { japanese: "壊れた時計を直しました。", kana: "こわれたとけいをなおしました。", english: "I fixed the broken clock.", highlight: "repair work" },
    { japanese: "間違いを直してください。", kana: "まちがいをなおしてください。", english: "Please correct the mistakes.", highlight: "error correction" }
  ],
  "鳴る": [
    { japanese: "朝六時に目覚まし時計が鳴ります。", kana: "あさろくじにめざましどけいがなります。", english: "The alarm clock rings at 6 AM.", highlight: "morning alarm" },
    { japanese: "授業中に電話が鳴りました。", kana: "じゅぎょうちゅうにでんわがなりました。", english: "The phone rang during class.", highlight: "interruption" }
  ],
  "似る": [
    { japanese: "息子は父に似ています。", kana: "むすこはちちににています。", english: "My son resembles his father.", highlight: "family resemblance" },
    { japanese: "この二つの絵は似ています。", kana: "このふたつのえはにています。", english: "These two pictures look similar.", highlight: "comparison" }
  ],
  "逃げる": [
    { japanese: "猫が犬から逃げました。", kana: "ねこがいぬからにげました。", english: "The cat ran away from the dog.", highlight: "animal behavior" },
    { japanese: "火事の時、建物から逃げてください。", kana: "かじのとき、たてものからにげてください。", english: "Please escape from the building during a fire.", highlight: "emergency instruction" }
  ],
  "眠る": [
    { japanese: "赤ちゃんが静かに眠っています。", kana: "あかちゃんがしずかにねむっています。", english: "The baby is sleeping quietly.", highlight: "infant sleep" },
    { japanese: "疲れたのでよく眠りました。", kana: "つかれたのでよくねむりました。", english: "I slept well because I was tired.", highlight: "restful sleep" }
  ],
  "飲む": [
    { japanese: "朝、コーヒーを飲みます。", kana: "あさ、コーヒーをのみます。", english: "I drink coffee in the morning.", highlight: "morning beverage" },
    { japanese: "薬を食後に飲んでください。", kana: "くすりをしょくごにのんでください。", english: "Please take medicine after meals.", highlight: "medication instruction" }
  ],
  "乗り換える": [
    { japanese: "新宿駅で電車を乗り換えます。", kana: "しんじゅくえきででんしゃをのりかえます。", english: "I transfer trains at Shinjuku Station.", highlight: "transit connection" },
    { japanese: "三番線で乗り換えてください。", kana: "さんばんせんでのりかえてください。", english: "Please transfer at platform 3.", highlight: "platform instruction" }
  ],
  "離れる": [
    { japanese: "家族と離れて暮らしています。", kana: "かぞくとはなれてくらしています。", english: "I live away from my family.", highlight: "living situation" },
    { japanese: "危ないのでここから離れてください。", kana: "あぶないのでここからはなれてください。", english: "Please move away from here because it's dangerous.", highlight: "safety warning" }
  ],
  "話す": [
    { japanese: "授業で日本語を話します。", kana: "じゅぎょうでにほんごをはなします。", english: "I speak Japanese in class.", highlight: "language practice" },
    { japanese: "友達と電話で話しました。", kana: "ともだちとでんわではなしました。", english: "I talked with my friend on the phone.", highlight: "communication" }
  ],
  "払う": [
    { japanese: "レストランで現金で払いました。", kana: "レストランでげんきんではらいました。", english: "I paid with cash at the restaurant.", highlight: "payment method" },
    { japanese: "来月、家賃を払います。", kana: "らいげつ、やちんをはらいます。", english: "I will pay rent next month.", highlight: "monthly payment" }
  ],
  "太る": [
    { japanese: "冬にたくさん食べて太りました。", kana: "ふゆにたくさんたべてふとりました。", english: "I gained weight by eating a lot in winter.", highlight: "weight gain" },
    { japanese: "最近、少し太りました。", kana: "さいきん、すこしふとりました。", english: "I've gained a little weight recently.", highlight: "body change" }
  ],
  "増える": [
    { japanese: "最近、外国人観光客が増えています。", kana: "さいきん、がいこくじんかんこうきゃくがふえています。", english: "Foreign tourists are increasing recently.", highlight: "tourism trend" },
    { japanese: "春に花が増えます。", kana: "はるにはながふえます。", english: "Flowers increase in spring.", highlight: "seasonal change" }
  ],
  "参る": [
    { japanese: "お正月に神社に参ります。", kana: "おしょうがつにじんじゃにまいります。", english: "I visit the shrine on New Year's.", highlight: "traditional practice" },
    { japanese: "明日、御社に参ります。", kana: "あした、おんしゃにまいります。", english: "I will visit your company tomorrow.", highlight: "polite visit" }
  ],
  "回す": [
    { japanese: "ドアのノブを回してください。", kana: "ドアのノブをまわしてください。", english: "Please turn the door knob.", highlight: "opening doors" },
    { japanese: "資料を回してください。", kana: "しりょうをまわしてください。", english: "Please pass around the documents.", highlight: "sharing materials" }
  ],
  "回る": [
    { japanese: "地球は太陽の周りを回ります。", kana: "ちきゅうはたいようのまわりをまわります。", english: "The Earth revolves around the sun.", highlight: "astronomy fact" },
    { japanese: "京都の観光地を回りました。", kana: "きょうとのかんこうちをまわりました。", english: "I went around Kyoto's tourist spots.", highlight: "sightseeing" }
  ],
  "迎える": [
    { japanese: "空港で友達を迎えます。", kana: "くうこうでともだちをむかえます。", english: "I'll pick up my friend at the airport.", highlight: "greeting arrival" },
    { japanese: "新年を家族と迎えます。", kana: "しんねんをかぞくとむかえます。", english: "I welcome the new year with my family.", highlight: "celebration" }
  ],
  "申し込む": [
    { japanese: "大学に申し込みました。", kana: "だいがくにもうしこみました。", english: "I applied to university.", highlight: "application process" },
    { japanese: "来週のツアーに申し込みます。", kana: "らいしゅうのツアーにもうしこみます。", english: "I'll apply for next week's tour.", highlight: "registration" }
  ],
  "やる": [
    { japanese: "毎日、宿題をやります。", kana: "まいにち、しゅくだいをやります。", english: "I do homework every day.", highlight: "daily task" },
    { japanese: "花に水をやってください。", kana: "はなにみずをやってください。", english: "Please water the flowers.", highlight: "plant care" }
  ],
  "痩せる": [
    { japanese: "運動して三キロ痩せました。", kana: "うんどうしてさんキロやせました。", english: "I lost 3 kilos by exercising.", highlight: "weight loss" },
    { japanese: "病気で痩せてしまいました。", kana: "びょうきでやせてしまいました。", english: "I lost weight due to illness.", highlight: "health issue" }
  ],
  "呼ぶ": [
    { japanese: "パーティーに友達を呼びました。", kana: "パーティーにともだちをよびました。", english: "I invited friends to the party.", highlight: "social gathering" },
    { japanese: "助けを呼んでください。", kana: "たすけをよんでください。", english: "Please call for help.", highlight: "emergency request" }
  ],
  "別れる": [
    { japanese: "駅で友達と別れました。", kana: "えきでともだちとわかれました。", english: "I parted ways with my friend at the station.", highlight: "farewell" },
    { japanese: "恋人と別れました。", kana: "こいびととわかれました。", english: "I broke up with my boyfriend/girlfriend.", highlight: "relationship ending" }
  ],
  "分かる": [
    { japanese: "日本語が少し分かります。", kana: "にほんごがすこしわかります。", english: "I understand a little Japanese.", highlight: "language comprehension" },
    { japanese: "この問題が分かりません。", kana: "このもんだいがわかりません。", english: "I don't understand this problem.", highlight: "difficulty understanding" }
  ],
  "沸く": [
    { japanese: "お湯が沸きました。", kana: "おゆがわきました。", english: "The water has boiled.", highlight: "cooking preparation" },
    { japanese: "やかんのお湯が沸いています。", kana: "やかんのおゆがわいています。", english: "The water in the kettle is boiling.", highlight: "hot water ready" }
  ]
};

// Path to the JSON file
const filePath = path.join(__dirname, '../public/seed-data/N5_verbs_dataset.json');

console.log('Starting comprehensive verb examples enhancement...');
console.log('Reading file:', filePath);

// Read the JSON file
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let enhancedCount = 0;
let skippedCount = 0;
let notFoundCount = 0;

// Process each verb
data.verbs.forEach((verb, index) => {
  const kanji = verb.kanji;

  // Check if we have examples for this verb
  if (verbExamplesDatabase[kanji]) {
    const newExamples = verbExamplesDatabase[kanji];

    // Only update if the current examples are simple or need enhancement
    const shouldUpdate = verb.examples.some(ex =>
      ex.english.length < 30 || // Short English translation
      !ex.japanese.includes('、') || // No time/place markers
      ex.japanese.length < 10 // Very short sentence
    );

    if (shouldUpdate || verb.examples.length < 2) {
      verb.examples = newExamples;
      enhancedCount++;
      console.log(`✓ Enhanced: ${kanji} (${verb.kana}) - ${verb.primaryMeaning}`);
    } else {
      skippedCount++;
      console.log(`  Skipped: ${kanji} (already has good examples)`);
    }
  } else {
    notFoundCount++;
    console.log(`  Not found in database: ${kanji} (${verb.kana}) - ${verb.primaryMeaning}`);
  }
});

// Update metadata
data.metadata.version = "1.1.0";
data.metadata.generatedAt = new Date().toISOString();
data.metadata.description = "Complete JLPT N5 verbs with comprehensive contextual examples - ALL verbs enhanced with N5-level sentences";

// Write back to file with proper formatting
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log('\n' + '='.repeat(60));
console.log('ENHANCEMENT COMPLETE!');
console.log('='.repeat(60));
console.log(`Total verbs in dataset: ${data.verbs.length}`);
console.log(`Verbs enhanced: ${enhancedCount}`);
console.log(`Verbs skipped (already good): ${skippedCount}`);
console.log(`Verbs not in database: ${notFoundCount}`);
console.log(`File saved: ${filePath}`);
console.log('='.repeat(60));

// List verbs that weren't found (so we can add them later if needed)
if (notFoundCount > 0) {
  console.log('\nVerbs not found in enhancement database:');
  data.verbs.forEach(verb => {
    if (!verbExamplesDatabase[verb.kanji]) {
      console.log(`  - ${verb.kanji} (${verb.kana}): ${verb.primaryMeaning}`);
    }
  });
}
