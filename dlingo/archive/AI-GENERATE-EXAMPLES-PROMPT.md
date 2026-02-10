# Task: Generate Example Sentences for Japanese Vocabulary

## Context
I have a Japanese vocabulary learning application with 685 words that need example sentences. These examples will help learners understand how to use each word in context.

## Requirements for Each Example

### Structure
Each example must include:
- **japanese**: Japanese sentence using the vocabulary word
- **english**: English translation
- **context**: One of: "statement", "question", or "answer"
- **level**: Estimate appropriate Duolingo level (e.g., "1-1" to "1-9" for Level 1, "2-1" to "2-30" for Level 2, "3-1" to "3-15" for Level 3)
- **isAIGenerated**: true

### Quality Guidelines
1. **Natural usage**: Use the word naturally as a native speaker would
2. **Appropriate level**: Match complexity to beginner-intermediate learners (JLPT N5-N4 level)
3. **Context variety**: Mix statements, questions, and answers
4. **Different scenarios**: Show different contexts/situations where the word is used
5. **Common collocations**: Use words that commonly appear together
6. **Accurate translations**: English should be natural and accurate

### Quantity
- Aim for 1-3 examples per word
- More examples (2-3) for: common words, verbs with multiple uses, adjectives
- Fewer examples (1) for: very specific nouns, rare words, technical terms

## Example Format

For the word **しょうせつ** (novel):
```json
{
  "id": "duo_0",
  "japanese": "しょうせつ",
  "english": "novel",
  "type": "noun",
  "exampleSentences": [
    {
      "japanese": "日本のしょうせつを読むのが好きです。",
      "english": "I like reading Japanese novels.",
      "context": "statement",
      "level": "2-10",
      "isAIGenerated": true
    },
    {
      "japanese": "どんなしょうせつが好きですか。",
      "english": "What kind of novels do you like?",
      "context": "question",
      "level": "2-10",
      "isAIGenerated": true
    }
  ]
}
```

---

## Vocabulary Words to Process

Total: 685 words


### NOUN (457 words)

```json
{
  "id": "duo_0",
  "japanese": "しょうせつ",
  "english": "novel",
  "type": "noun"
},
{
  "id": "duo_11",
  "japanese": "バナナ",
  "english": "banana",
  "type": "noun"
},
{
  "id": "duo_15",
  "japanese": "ブランケット",
  "english": "blanket",
  "type": "noun"
},
{
  "id": "duo_17",
  "japanese": "リモコン",
  "english": "remote, controller, controllers",
  "type": "noun"
},
{
  "id": "duo_18",
  "japanese": "アラーム",
  "english": "alarms, alarm",
  "type": "noun"
},
{
  "id": "duo_27",
  "japanese": "チーズ",
  "english": "cheese",
  "type": "noun"
},
{
  "id": "duo_30",
  "japanese": "ようじ",
  "english": "stuff to do",
  "type": "noun"
},
{
  "id": "duo_31",
  "japanese": "じてんしゃ",
  "english": "bike",
  "type": "noun"
},
{
  "id": "duo_32",
  "japanese": "ゆうがた",
  "english": "evening",
  "type": "noun"
},
{
  "id": "duo_34",
  "japanese": "車",
  "english": "car",
  "type": "noun"
},
{
  "id": "duo_35",
  "japanese": "さいたま",
  "english": "Saitama",
  "type": "noun"
},
{
  "id": "duo_36",
  "japanese": "はたち",
  "english": "twenty years old",
  "type": "noun"
},
{
  "id": "duo_40",
  "japanese": "みかん",
  "english": "mandarin oranges",
  "type": "noun"
},
{
  "id": "duo_41",
  "japanese": "スキー",
  "english": "skiing, ski, skis",
  "type": "noun"
},
{
  "id": "duo_45",
  "japanese": "スケート",
  "english": "skating, skate, ice skating",
  "type": "noun"
},
{
  "id": "duo_46",
  "japanese": "なべ",
  "english": "hot pot",
  "type": "noun"
},
{
  "id": "duo_49",
  "japanese": "さつまいも",
  "english": "sweet potato",
  "type": "noun"
},
{
  "id": "duo_51",
  "japanese": "だんぼう",
  "english": "heater",
  "type": "noun"
},
{
  "id": "duo_53",
  "japanese": "夜",
  "english": "night, nights, evening",
  "type": "noun"
},
{
  "id": "duo_54",
  "japanese": "すいか",
  "english": "watermelon",
  "type": "noun"
},
{
  "id": "duo_56",
  "japanese": "さくら",
  "english": "cherry blossoms",
  "type": "noun"
},
{
  "id": "duo_60",
  "japanese": "こんど",
  "english": "next time",
  "type": "noun"
},
{
  "id": "duo_61",
  "japanese": "八千",
  "english": "eight thousand",
  "type": "noun"
},
{
  "id": "duo_65",
  "japanese": "マフラー",
  "english": "scarf",
  "type": "noun"
},
{
  "id": "duo_66",
  "japanese": "アクセサリー",
  "english": "accessories, jewelry, accessory",
  "type": "noun"
},
{
  "id": "duo_67",
  "japanese": "右",
  "english": "right",
  "type": "noun"
},
{
  "id": "duo_70",
  "japanese": "左",
  "english": "left",
  "type": "noun"
},
{
  "id": "duo_73",
  "japanese": "メンズ",
  "english": "men's, men",
  "type": "noun"
},
{
  "id": "duo_75",
  "japanese": "パーカー",
  "english": "hoodie",
  "type": "noun"
},
{
  "id": "duo_77",
  "japanese": "むらさき",
  "english": "purple",
  "type": "noun"
},
{
  "id": "duo_78",
  "japanese": "くつした",
  "english": "socks",
  "type": "noun"
},
{
  "id": "duo_81",
  "japanese": "セーター",
  "english": "sweater",
  "type": "noun"
},
{
  "id": "duo_82",
  "japanese": "クラスメイト",
  "english": "classmates, classmate",
  "type": "noun"
},
{
  "id": "duo_83",
  "japanese": "ふくや",
  "english": "clothing store",
  "type": "noun"
},
{
  "id": "duo_84",
  "japanese": "えんぴつ",
  "english": "pencil",
  "type": "noun"
},
{
  "id": "duo_86",
  "japanese": "くうき",
  "english": "air",
  "type": "noun"
},
{
  "id": "duo_87",
  "japanese": "ドラッグストア",
  "english": "drugstore",
  "type": "noun"
},
{
  "id": "duo_89",
  "japanese": "ぎんこう",
  "english": "bank",
  "type": "noun"
},
{
  "id": "duo_91",
  "japanese": "ゆうびんきょく",
  "english": "post office",
  "type": "noun"
},
{
  "id": "duo_93",
  "japanese": "スタジアム",
  "english": "stadium",
  "type": "noun"
},
{
  "id": "duo_94",
  "japanese": "アメフト",
  "english": "football",
  "type": "noun"
},
{
  "id": "duo_95",
  "japanese": "先生",
  "english": "teacher, professor, Mr., Miss",
  "type": "noun"
},
{
  "id": "duo_96",
  "japanese": "木",
  "english": "tree, Thursday, wood",
  "type": "noun"
},
{
  "id": "duo_97",
  "japanese": "こうこう",
  "english": "high school",
  "type": "noun"
},
{
  "id": "duo_99",
  "japanese": "れきし",
  "english": "history",
  "type": "noun"
},
{
  "id": "duo_103",
  "japanese": "グッズ",
  "english": "merch",
  "type": "noun"
},
{
  "id": "duo_108",
  "japanese": "サイン",
  "english": "signature, signatures, autograph",
  "type": "noun"
},
{
  "id": "duo_109",
  "japanese": "ペン",
  "english": "pen",
  "type": "noun"
},
{
  "id": "duo_111",
  "japanese": "ひがしぐち",
  "english": "east exit",
  "type": "noun"
},
{
  "id": "duo_115",
  "japanese": "外",
  "english": "out, outside",
  "type": "noun"
},
{
  "id": "duo_118",
  "japanese": "まんなか",
  "english": "middle",
  "type": "noun"
},
{
  "id": "duo_121",
  "japanese": "アーティスト",
  "english": "artist",
  "type": "noun"
},
{
  "id": "duo_122",
  "japanese": "今夜",
  "english": "tonight",
  "type": "noun"
},
{
  "id": "duo_126",
  "japanese": "レジぶくろ",
  "english": "shopping bag, shopping bags",
  "type": "noun"
},
{
  "id": "duo_127",
  "japanese": "でんち",
  "english": "batteries",
  "type": "noun"
},
{
  "id": "duo_129",
  "japanese": "グレー",
  "english": "gray",
  "type": "noun"
},
{
  "id": "duo_131",
  "japanese": "ケーブル",
  "english": "cable",
  "type": "noun"
},
{
  "id": "duo_132",
  "japanese": "スピーカー",
  "english": "speakers, speaker",
  "type": "noun"
},
{
  "id": "duo_134",
  "japanese": "キーボード",
  "english": "keyboard",
  "type": "noun"
},
{
  "id": "duo_138",
  "japanese": "インチ",
  "english": "inches, inch",
  "type": "noun"
},
{
  "id": "duo_139",
  "japanese": "一万",
  "english": "ten thousand, 10,000",
  "type": "noun"
},
{
  "id": "duo_142",
  "japanese": "前",
  "english": "ago, before, front",
  "type": "noun"
},
{
  "id": "duo_143",
  "japanese": "ゲーミング",
  "english": "gaming",
  "type": "noun"
},
{
  "id": "duo_145",
  "japanese": "おさら",
  "english": "plate",
  "type": "noun"
},
{
  "id": "duo_146",
  "japanese": "ナイフ",
  "english": "knife",
  "type": "noun"
},
{
  "id": "duo_149",
  "japanese": "おもちゃ",
  "english": "toy",
  "type": "noun"
},
{
  "id": "duo_151",
  "japanese": "ヘッドホン",
  "english": "headphones",
  "type": "noun"
},
{
  "id": "duo_152",
  "japanese": "六百",
  "english": "six hundred",
  "type": "noun"
},
{
  "id": "duo_153",
  "japanese": "カップ",
  "english": "cup",
  "type": "noun"
},
{
  "id": "duo_154",
  "japanese": "フォーク",
  "english": "fork",
  "type": "noun"
},
{
  "id": "duo_155",
  "japanese": "百円ショップ",
  "english": "hundred yen shop",
  "type": "noun"
},
{
  "id": "duo_157",
  "japanese": "ポテトチップス",
  "english": "chips, potato chips",
  "type": "noun"
},
{
  "id": "duo_160",
  "japanese": "みち",
  "english": "path, road, street",
  "type": "noun"
},
{
  "id": "duo_161",
  "japanese": "フライドチキン",
  "english": "fried chicken",
  "type": "noun"
},
{
  "id": "duo_162",
  "japanese": "円",
  "english": "circle, yen",
  "type": "noun"
},
{
  "id": "duo_163",
  "japanese": "家",
  "english": "house, home, homes",
  "type": "noun"
},
{
  "id": "duo_164",
  "japanese": "いとこ",
  "english": "(my) cousin, (my) cousins",
  "type": "noun"
},
{
  "id": "duo_165",
  "japanese": "タイご",
  "english": "Thai",
  "type": "noun"
},
{
  "id": "duo_166",
  "japanese": "ぞう",
  "english": "elephant",
  "type": "noun"
},
{
  "id": "duo_167",
  "japanese": "タイ",
  "english": "Thailand, Thai",
  "type": "noun"
},
{
  "id": "duo_168",
  "japanese": "来週",
  "english": "next week",
  "type": "noun"
},
{
  "id": "duo_170",
  "japanese": "ピーナッツ",
  "english": "peanuts, (a) peanut",
  "type": "noun"
},
{
  "id": "duo_171",
  "japanese": "明日",
  "english": "tomorrow",
  "type": "noun"
},
{
  "id": "duo_173",
  "japanese": "ちば",
  "english": "Chiba",
  "type": "noun"
},
{
  "id": "duo_175",
  "japanese": "きのう",
  "english": "yesterday",
  "type": "noun"
},
{
  "id": "duo_176",
  "japanese": "クレープ",
  "english": "crepe",
  "type": "noun"
},
{
  "id": "duo_180",
  "japanese": "先週",
  "english": "last week",
  "type": "noun"
},
{
  "id": "duo_182",
  "japanese": "ぎんざ",
  "english": "Ginza",
  "type": "noun"
},
{
  "id": "duo_183",
  "japanese": "ぶんか",
  "english": "culture",
  "type": "noun"
},
{
  "id": "duo_186",
  "japanese": "先月",
  "english": "last month",
  "type": "noun"
},
{
  "id": "duo_187",
  "japanese": "きょねん",
  "english": "last year",
  "type": "noun"
},
{
  "id": "duo_189",
  "japanese": "トースト",
  "english": "toast",
  "type": "noun"
},
{
  "id": "duo_190",
  "japanese": "コーヒーメーカー",
  "english": "coffee maker",
  "type": "noun"
},
{
  "id": "duo_192",
  "japanese": "ぎゅうにゅう",
  "english": "milk",
  "type": "noun"
},
{
  "id": "duo_194",
  "japanese": "タオル",
  "english": "towel",
  "type": "noun"
},
{
  "id": "duo_197",
  "japanese": "スパ",
  "english": "spa, spas",
  "type": "noun"
},
{
  "id": "duo_198",
  "japanese": "パスワード",
  "english": "password",
  "type": "noun"
},
{
  "id": "duo_200",
  "japanese": "ルームサービス",
  "english": "room service",
  "type": "noun"
},
{
  "id": "duo_201",
  "japanese": "こおり",
  "english": "ice",
  "type": "noun"
},
{
  "id": "duo_202",
  "japanese": "まえ",
  "english": "front",
  "type": "noun"
},
{
  "id": "duo_205",
  "japanese": "となり",
  "english": "next door, next to, neighboring",
  "type": "noun"
},
{
  "id": "duo_207",
  "japanese": "かぎ",
  "english": "key",
  "type": "noun"
},
{
  "id": "duo_208",
  "japanese": "ネット",
  "english": "internet",
  "type": "noun"
},
{
  "id": "duo_214",
  "japanese": "おつり",
  "english": "change",
  "type": "noun"
},
{
  "id": "duo_217",
  "japanese": "かいけい",
  "english": "cashier",
  "type": "noun"
},
{
  "id": "duo_219",
  "japanese": "えび",
  "english": "shrimp",
  "type": "noun"
},
{
  "id": "duo_222",
  "japanese": "ナプキン",
  "english": "napkin",
  "type": "noun"
},
{
  "id": "duo_223",
  "japanese": "マーボーどうふ",
  "english": "mapo tofu",
  "type": "noun"
},
{
  "id": "duo_224",
  "japanese": "はし",
  "english": "bridges, chopsticks, bridge",
  "type": "noun"
},
{
  "id": "duo_226",
  "japanese": "スープ",
  "english": "soup",
  "type": "noun"
},
{
  "id": "duo_232",
  "japanese": "メニュー",
  "english": "menu",
  "type": "noun"
},
{
  "id": "duo_235",
  "japanese": "タピオカティー",
  "english": "bubble tea",
  "type": "noun"
},
{
  "id": "duo_236",
  "japanese": "ちゅうかがい",
  "english": "Chinatown",
  "type": "noun"
},
{
  "id": "duo_237",
  "japanese": "ちゅうかりょうり",
  "english": "Chinese food",
  "type": "noun"
},
{
  "id": "duo_239",
  "japanese": "シーフード",
  "english": "seafood",
  "type": "noun"
},
{
  "id": "duo_240",
  "japanese": "ぎゅうにく",
  "english": "beef",
  "type": "noun"
},
{
  "id": "duo_241",
  "japanese": "こしょう",
  "english": "pepper",
  "type": "noun"
},
{
  "id": "duo_243",
  "japanese": "そと",
  "english": "outside, outdoors",
  "type": "noun"
},
{
  "id": "duo_246",
  "japanese": "川",
  "english": "(the) river, (the) rivers, rivers",
  "type": "noun"
},
{
  "id": "duo_248",
  "japanese": "雨",
  "english": "rain",
  "type": "noun"
},
{
  "id": "duo_250",
  "japanese": "ピクニック",
  "english": "picnic",
  "type": "noun"
},
{
  "id": "duo_255",
  "japanese": "キャンプ",
  "english": "camping",
  "type": "noun"
},
{
  "id": "duo_256",
  "japanese": "ハイキング",
  "english": "hiking",
  "type": "noun"
},
{
  "id": "duo_257",
  "japanese": "バックパック",
  "english": "backpack",
  "type": "noun"
},
{
  "id": "duo_259",
  "japanese": "すみ",
  "english": "corner",
  "type": "noun"
},
{
  "id": "duo_262",
  "japanese": "カメレオン",
  "english": "chameleon",
  "type": "noun"
},
{
  "id": "duo_263",
  "japanese": "なんびき",
  "english": "how many",
  "type": "noun"
},
{
  "id": "duo_266",
  "japanese": "口",
  "english": "mouths, (a) mouth, tastes",
  "type": "noun"
},
{
  "id": "duo_267",
  "japanese": "トマト",
  "english": "tomato, tomatoes, (a) tomato",
  "type": "noun"
},
{
  "id": "duo_272",
  "japanese": "ちゃいろ",
  "english": "brown",
  "type": "noun"
},
{
  "id": "duo_273",
  "japanese": "パンケーキ",
  "english": "pancake",
  "type": "noun"
},
{
  "id": "duo_274",
  "japanese": "め",
  "english": "eye",
  "type": "noun"
},
{
  "id": "duo_276",
  "japanese": "カプチーノ",
  "english": "cappuccinos, (a) cappuccino",
  "type": "noun"
},
{
  "id": "duo_279",
  "japanese": "ねこ",
  "english": "cat",
  "type": "noun"
},
{
  "id": "duo_280",
  "japanese": "チェス",
  "english": "chess",
  "type": "noun"
},
{
  "id": "duo_283",
  "japanese": "ボードゲーム",
  "english": "board game",
  "type": "noun"
},
{
  "id": "duo_285",
  "japanese": "ルームメイト",
  "english": "roommate, roommates",
  "type": "noun"
},
{
  "id": "duo_286",
  "japanese": "りょう",
  "english": "dorm",
  "type": "noun"
},
{
  "id": "duo_287",
  "japanese": "駅",
  "english": "station, train station, stations",
  "type": "noun"
},
{
  "id": "duo_288",
  "japanese": "タガログご",
  "english": "Tagalog",
  "type": "noun"
},
{
  "id": "duo_289",
  "japanese": "ドイツご",
  "english": "German",
  "type": "noun"
},
{
  "id": "duo_290",
  "japanese": "げんご",
  "english": "language, languages",
  "type": "noun"
},
{
  "id": "duo_291",
  "japanese": "ドイツ",
  "english": "Germany, German",
  "type": "noun"
},
{
  "id": "duo_292",
  "japanese": "フィリピン",
  "english": "the Philippines",
  "type": "noun"
},
{
  "id": "duo_294",
  "japanese": "ビジネス",
  "english": "business",
  "type": "noun"
},
{
  "id": "duo_298",
  "japanese": "サム",
  "english": "Sam",
  "type": "noun"
},
{
  "id": "duo_299",
  "japanese": "かい",
  "english": "are you, will you, buy",
  "type": "noun"
},
{
  "id": "duo_303",
  "japanese": "みなみぐち",
  "english": "south exit",
  "type": "noun"
},
{
  "id": "duo_304",
  "japanese": "飲み物",
  "english": "beverage, drink, drinks",
  "type": "noun"
},
{
  "id": "duo_307",
  "japanese": "ツアー",
  "english": "tour",
  "type": "noun"
},
{
  "id": "duo_308",
  "japanese": "インフォメーション",
  "english": "information desk",
  "type": "noun"
},
{
  "id": "duo_309",
  "japanese": "八百",
  "english": "800",
  "type": "noun"
},
{
  "id": "duo_311",
  "japanese": "エスカレーター",
  "english": "escalator",
  "type": "noun"
},
{
  "id": "duo_313",
  "japanese": "三ばん",
  "english": "number three",
  "type": "noun"
},
{
  "id": "duo_315",
  "japanese": "かいそく",
  "english": "rapid-service",
  "type": "noun"
},
{
  "id": "duo_316",
  "japanese": "二ばん",
  "english": "number two",
  "type": "noun"
},
{
  "id": "duo_317",
  "japanese": "オレンジ",
  "english": "orange",
  "type": "noun"
},
{
  "id": "duo_319",
  "japanese": "一ばん",
  "english": "number one",
  "type": "noun"
},
{
  "id": "duo_320",
  "japanese": "きっぷうりば",
  "english": "ticket area",
  "type": "noun"
},
{
  "id": "duo_321",
  "japanese": "モノレール",
  "english": "monorail",
  "type": "noun"
},
{
  "id": "duo_322",
  "japanese": "三百",
  "english": "300, three hundred",
  "type": "noun"
},
{
  "id": "duo_325",
  "japanese": "ワイン",
  "english": "wine",
  "type": "noun"
},
{
  "id": "duo_326",
  "japanese": "ステーキ",
  "english": "steak",
  "type": "noun"
},
{
  "id": "duo_327",
  "japanese": "かんとく",
  "english": "director",
  "type": "noun"
},
{
  "id": "duo_328",
  "japanese": "ポップコーン",
  "english": "popcorn",
  "type": "noun"
},
{
  "id": "duo_330",
  "japanese": "ホットドッグ",
  "english": "hot dog",
  "type": "noun"
},
{
  "id": "duo_333",
  "japanese": "スーツ",
  "english": "suit",
  "type": "noun"
},
{
  "id": "duo_335",
  "japanese": "うでどけい",
  "english": "watch",
  "type": "noun"
},
{
  "id": "duo_336",
  "japanese": "ネックレス",
  "english": "necklace",
  "type": "noun"
},
{
  "id": "duo_340",
  "japanese": "人",
  "english": "people, human, someone",
  "type": "noun"
},
{
  "id": "duo_342",
  "japanese": "カウントダウン",
  "english": "countdown",
  "type": "noun"
},
{
  "id": "duo_343",
  "japanese": "クリスマス",
  "english": "Christmas",
  "type": "noun"
},
{
  "id": "duo_345",
  "japanese": "イルミネーション",
  "english": "lights display",
  "type": "noun"
},
{
  "id": "duo_347",
  "japanese": "パレード",
  "english": "parade",
  "type": "noun"
},
{
  "id": "duo_352",
  "japanese": "ダンス",
  "english": "dance",
  "type": "noun"
},
{
  "id": "duo_353",
  "japanese": "コミュニティーセンター",
  "english": "community center, Community center",
  "type": "noun"
},
{
  "id": "duo_357",
  "japanese": "チョコバナナ",
  "english": "chocolate covered bananas, chocolate covered banana",
  "type": "noun"
},
{
  "id": "duo_358",
  "japanese": "食べ物",
  "english": "food",
  "type": "noun"
},
{
  "id": "duo_361",
  "japanese": "はなびたいかい",
  "english": "fireworks display",
  "type": "noun"
},
{
  "id": "duo_364",
  "japanese": "こんしゅうまつ",
  "english": "this weekend",
  "type": "noun"
},
{
  "id": "duo_365",
  "japanese": "きじ",
  "english": "post",
  "type": "noun"
},
{
  "id": "duo_366",
  "japanese": "ブログ",
  "english": "blog",
  "type": "noun"
},
{
  "id": "duo_370",
  "japanese": "バレエ",
  "english": "ballet",
  "type": "noun"
},
{
  "id": "duo_372",
  "japanese": "パフォーマンス",
  "english": "performance",
  "type": "noun"
},
{
  "id": "duo_376",
  "japanese": "かんじ",
  "english": "kanji, Chinese character, Chinese characters",
  "type": "noun"
},
{
  "id": "duo_379",
  "japanese": "ピアノ",
  "english": "piano",
  "type": "noun"
},
{
  "id": "duo_381",
  "japanese": "がっき",
  "english": "instrument",
  "type": "noun"
},
{
  "id": "duo_384",
  "japanese": "何時間",
  "english": "how many hours",
  "type": "noun"
},
{
  "id": "duo_385",
  "japanese": "れんしゅう",
  "english": "practice",
  "type": "noun"
},
{
  "id": "duo_386",
  "japanese": "バドミントン",
  "english": "badminton",
  "type": "noun"
},
{
  "id": "duo_389",
  "japanese": "バー",
  "english": "bar",
  "type": "noun"
},
{
  "id": "duo_391",
  "japanese": "さいご",
  "english": "last",
  "type": "noun"
},
{
  "id": "duo_393",
  "japanese": "クライアント",
  "english": "client",
  "type": "noun"
},
{
  "id": "duo_394",
  "japanese": "プレゼン",
  "english": "presentation",
  "type": "noun"
},
{
  "id": "duo_397",
  "japanese": "ひる休み",
  "english": "lunch break",
  "type": "noun"
},
{
  "id": "duo_398",
  "japanese": "しょくどう",
  "english": "cafeteria",
  "type": "noun"
},
{
  "id": "duo_400",
  "japanese": "チャーハン",
  "english": "fried rice",
  "type": "noun"
},
{
  "id": "duo_401",
  "japanese": "フライドポテト",
  "english": "french fries",
  "type": "noun"
},
{
  "id": "duo_403",
  "japanese": "プリンター",
  "english": "printer",
  "type": "noun"
},
{
  "id": "duo_407",
  "japanese": "うけつけ",
  "english": "front desk",
  "type": "noun"
},
{
  "id": "duo_410",
  "japanese": "ドキュメンタリー",
  "english": "documentary",
  "type": "noun"
},
{
  "id": "duo_411",
  "japanese": "ポスター",
  "english": "poster",
  "type": "noun"
},
{
  "id": "duo_412",
  "japanese": "はいゆう",
  "english": "actor",
  "type": "noun"
},
{
  "id": "duo_414",
  "japanese": "カードゲーム",
  "english": "card game",
  "type": "noun"
},
{
  "id": "duo_417",
  "japanese": "パズル",
  "english": "puzzle",
  "type": "noun"
},
{
  "id": "duo_422",
  "japanese": "ポップス",
  "english": "pop",
  "type": "noun"
},
{
  "id": "duo_423",
  "japanese": "ノンフィクション",
  "english": "non-fiction",
  "type": "noun"
},
{
  "id": "duo_427",
  "japanese": "話",
  "english": "talking, conversation, chat",
  "type": "noun"
},
{
  "id": "duo_431",
  "japanese": "チョコミント",
  "english": "mint chocolate chip",
  "type": "noun"
},
{
  "id": "duo_433",
  "japanese": "バニラ",
  "english": "vanilla",
  "type": "noun"
},
{
  "id": "duo_436",
  "japanese": "ショー",
  "english": "show",
  "type": "noun"
},
{
  "id": "duo_439",
  "japanese": "ゴーカート",
  "english": "go-kart",
  "type": "noun"
},
{
  "id": "duo_442",
  "japanese": "アトラクション",
  "english": "attraction",
  "type": "noun"
},
{
  "id": "duo_445",
  "japanese": "三千",
  "english": "3,000",
  "type": "noun"
},
{
  "id": "duo_447",
  "japanese": "いりぐち",
  "english": "entrance",
  "type": "noun"
},
{
  "id": "duo_450",
  "japanese": "はくぶつかん",
  "english": "museum",
  "type": "noun"
},
{
  "id": "duo_451",
  "japanese": "ゆうえんち",
  "english": "theme park",
  "type": "noun"
},
{
  "id": "duo_453",
  "japanese": "ジム",
  "english": "gym",
  "type": "noun"
},
{
  "id": "duo_455",
  "japanese": "せんしゅ",
  "english": "athlete, athletes, player",
  "type": "noun"
},
{
  "id": "duo_457",
  "japanese": "チーム",
  "english": "team",
  "type": "noun"
},
{
  "id": "duo_459",
  "japanese": "カメラ",
  "english": "camera",
  "type": "noun"
},
{
  "id": "duo_463",
  "japanese": "ごぜん",
  "english": "a.m., morning",
  "type": "noun"
},
{
  "id": "duo_465",
  "japanese": "ナビ",
  "english": "GPS",
  "type": "noun"
},
{
  "id": "duo_466",
  "japanese": "うんてんしゅ",
  "english": "driver",
  "type": "noun"
},
{
  "id": "duo_468",
  "japanese": "ほんやくか",
  "english": "translator",
  "type": "noun"
},
{
  "id": "duo_470",
  "japanese": "としょかん",
  "english": "library",
  "type": "noun"
},
{
  "id": "duo_471",
  "japanese": "じしょ",
  "english": "dictionary",
  "type": "noun"
},
{
  "id": "duo_473",
  "japanese": "マネージャー",
  "english": "manager",
  "type": "noun"
},
{
  "id": "duo_474",
  "japanese": "かいしゃ",
  "english": "company",
  "type": "noun"
},
{
  "id": "duo_475",
  "japanese": "どうりょう",
  "english": "coworker",
  "type": "noun"
},
{
  "id": "duo_478",
  "japanese": "水曜日",
  "english": "Wednesday, Wednesdays",
  "type": "noun"
},
{
  "id": "duo_479",
  "japanese": "プロジェクト",
  "english": "project",
  "type": "noun"
},
{
  "id": "duo_480",
  "japanese": "しめきり",
  "english": "deadline",
  "type": "noun"
},
{
  "id": "duo_485",
  "japanese": "火曜日",
  "english": "Tuesday, Tuesdays",
  "type": "noun"
},
{
  "id": "duo_486",
  "japanese": "しつもん",
  "english": "question",
  "type": "noun"
},
{
  "id": "duo_489",
  "japanese": "テスト",
  "english": "test",
  "type": "noun"
},
{
  "id": "duo_490",
  "japanese": "何曜日",
  "english": "what day",
  "type": "noun"
},
{
  "id": "duo_492",
  "japanese": "スミス",
  "english": "Smith",
  "type": "noun"
},
{
  "id": "duo_493",
  "japanese": "山田",
  "english": "Yamada",
  "type": "noun"
},
{
  "id": "duo_496",
  "japanese": "スペインご",
  "english": "Spanish",
  "type": "noun"
},
{
  "id": "duo_497",
  "japanese": "きょうしつ",
  "english": "classroom",
  "type": "noun"
},
{
  "id": "duo_498",
  "japanese": "ぶたにく",
  "english": "pork",
  "type": "noun"
},
{
  "id": "duo_500",
  "japanese": "コーラ",
  "english": "cola",
  "type": "noun"
},
{
  "id": "duo_502",
  "japanese": "ビール",
  "english": "beer",
  "type": "noun"
},
{
  "id": "duo_503",
  "japanese": "とんかつ",
  "english": "pork cutlet",
  "type": "noun"
},
{
  "id": "duo_504",
  "japanese": "しお",
  "english": "salt",
  "type": "noun"
},
{
  "id": "duo_505",
  "japanese": "ソース",
  "english": "sauce",
  "type": "noun"
},
{
  "id": "duo_507",
  "japanese": "なま",
  "english": "raw",
  "type": "noun"
},
{
  "id": "duo_508",
  "japanese": "とうふ",
  "english": "(the) tofu, bean curd, tofu",
  "type": "noun"
},
{
  "id": "duo_510",
  "japanese": "魚",
  "english": "fish",
  "type": "noun"
},
{
  "id": "duo_512",
  "japanese": "ぎゅうどん",
  "english": "beef bowl",
  "type": "noun"
},
{
  "id": "duo_517",
  "japanese": "卵",
  "english": "egg, eggs",
  "type": "noun"
},
{
  "id": "duo_521",
  "japanese": "木曜日",
  "english": "Thursday, Thursdays",
  "type": "noun"
},
{
  "id": "duo_528",
  "japanese": "いちご",
  "english": "strawberry, strawberries",
  "type": "noun"
},
{
  "id": "duo_529",
  "japanese": "クッキー",
  "english": "cookies, cookie",
  "type": "noun"
},
{
  "id": "duo_532",
  "japanese": "みどり",
  "english": "green",
  "type": "noun"
},
{
  "id": "duo_534",
  "japanese": "カップケーキ",
  "english": "cupcake",
  "type": "noun"
},
{
  "id": "duo_541",
  "japanese": "ケーキや",
  "english": "cake shop",
  "type": "noun"
},
{
  "id": "duo_543",
  "japanese": "もの",
  "english": "stuff",
  "type": "noun"
},
{
  "id": "duo_546",
  "japanese": "月曜日",
  "english": "Monday",
  "type": "noun"
},
{
  "id": "duo_548",
  "japanese": "みそかつ",
  "english": "miso pork cutlet",
  "type": "noun"
},
{
  "id": "duo_549",
  "japanese": "にわ",
  "english": "garden",
  "type": "noun"
},
{
  "id": "duo_550",
  "japanese": "かんこう",
  "english": "sightseeing",
  "type": "noun"
},
{
  "id": "duo_551",
  "japanese": "しろ",
  "english": "castle",
  "type": "noun"
},
{
  "id": "duo_552",
  "japanese": "せき",
  "english": "seat",
  "type": "noun"
},
{
  "id": "duo_557",
  "japanese": "日本りょうり",
  "english": "Japanese food",
  "type": "noun"
},
{
  "id": "duo_559",
  "japanese": "お母さん",
  "english": "mom, mother, (your) mom",
  "type": "noun"
},
{
  "id": "duo_560",
  "japanese": "すしや",
  "english": "sushi restaurant",
  "type": "noun"
},
{
  "id": "duo_562",
  "japanese": "りょうしん",
  "english": "parents",
  "type": "noun"
},
{
  "id": "duo_563",
  "japanese": "お父さん",
  "english": "dad, (your) dad, (your) father",
  "type": "noun"
},
{
  "id": "duo_565",
  "japanese": "にく",
  "english": "meat",
  "type": "noun"
},
{
  "id": "duo_566",
  "japanese": "フランスりょうり",
  "english": "French food",
  "type": "noun"
},
{
  "id": "duo_570",
  "japanese": "ライオン",
  "english": "lion",
  "type": "noun"
},
{
  "id": "duo_572",
  "japanese": "ひろば",
  "english": "plaza",
  "type": "noun"
},
{
  "id": "duo_574",
  "japanese": "え",
  "english": "painting",
  "type": "noun"
},
{
  "id": "duo_582",
  "japanese": "スーツケース",
  "english": "suitcase",
  "type": "noun"
},
{
  "id": "duo_589",
  "japanese": "来月",
  "english": "next month",
  "type": "noun"
},
{
  "id": "duo_593",
  "japanese": "りょうり",
  "english": "cuisine, dish, food",
  "type": "noun"
},
{
  "id": "duo_594",
  "japanese": "買い物",
  "english": "shopping",
  "type": "noun"
},
{
  "id": "duo_597",
  "japanese": "ストレッチ",
  "english": "stretch",
  "type": "noun"
},
{
  "id": "duo_599",
  "japanese": "おふろ",
  "english": "bath",
  "type": "noun"
},
{
  "id": "duo_600",
  "japanese": "せんたく",
  "english": "laundry",
  "type": "noun"
},
{
  "id": "duo_607",
  "japanese": "がっこう",
  "english": "school",
  "type": "noun"
},
{
  "id": "duo_608",
  "japanese": "かじ",
  "english": "chore",
  "type": "noun"
},
{
  "id": "duo_616",
  "japanese": "ソウル",
  "english": "Seoul",
  "type": "noun"
},
{
  "id": "duo_617",
  "japanese": "かんこくご",
  "english": "Korean",
  "type": "noun"
},
{
  "id": "duo_619",
  "japanese": "マレーシア",
  "english": "Malaysia",
  "type": "noun"
},
{
  "id": "duo_620",
  "japanese": "えいご",
  "english": "English",
  "type": "noun"
},
{
  "id": "duo_621",
  "japanese": "おにいさん",
  "english": "big brother, older brothers, older brother",
  "type": "noun"
},
{
  "id": "duo_622",
  "japanese": "いもうとさん",
  "english": "younger sister",
  "type": "noun"
},
{
  "id": "duo_625",
  "japanese": "たいわん",
  "english": "Taiwan",
  "type": "noun"
},
{
  "id": "duo_627",
  "japanese": "コーチ",
  "english": "coach",
  "type": "noun"
},
{
  "id": "duo_629",
  "japanese": "おねえさん",
  "english": "big sister, big sisters, older sisters",
  "type": "noun"
},
{
  "id": "duo_634",
  "japanese": "おとうとさん",
  "english": "younger brother",
  "type": "noun"
},
{
  "id": "duo_637",
  "japanese": "ココア",
  "english": "cocoa",
  "type": "noun"
},
{
  "id": "duo_638",
  "japanese": "おんせん",
  "english": "hot spring",
  "type": "noun"
},
{
  "id": "duo_639",
  "japanese": "ふゆ",
  "english": "winter",
  "type": "noun"
},
{
  "id": "duo_640",
  "japanese": "こんばん",
  "english": "this evening, tonight",
  "type": "noun"
},
{
  "id": "duo_642",
  "japanese": "くもり",
  "english": "cloudy weather, cloudiness",
  "type": "noun"
},
{
  "id": "duo_644",
  "japanese": "あき",
  "english": "fall",
  "type": "noun"
},
{
  "id": "duo_646",
  "japanese": "はなび",
  "english": "fireworks",
  "type": "noun"
},
{
  "id": "duo_648",
  "japanese": "プール",
  "english": "swimming pools, pools, pool",
  "type": "noun"
},
{
  "id": "duo_651",
  "japanese": "なつ",
  "english": "summer",
  "type": "noun"
},
{
  "id": "duo_652",
  "japanese": "日",
  "english": "day, the sun, (a) day",
  "type": "noun"
},
{
  "id": "duo_655",
  "japanese": "はる",
  "english": "spring",
  "type": "noun"
},
{
  "id": "duo_664",
  "japanese": "ごかぞく",
  "english": "your family, family",
  "type": "noun"
},
{
  "id": "duo_668",
  "japanese": "何さい",
  "english": "how old",
  "type": "noun"
},
{
  "id": "duo_669",
  "japanese": "〇",
  "english": "0, zero",
  "type": "noun"
},
{
  "id": "duo_670",
  "japanese": "九",
  "english": "nine",
  "type": "noun"
},
{
  "id": "duo_673",
  "japanese": "びょういん",
  "english": "hospital",
  "type": "noun"
},
{
  "id": "duo_674",
  "japanese": "けいさつ",
  "english": "police",
  "type": "noun"
},
{
  "id": "duo_680",
  "japanese": "おみやげ",
  "english": "souvenir",
  "type": "noun"
},
{
  "id": "duo_685",
  "japanese": "山",
  "english": "mountain, mount, mountains",
  "type": "noun"
},
{
  "id": "duo_687",
  "japanese": "ラーメンや",
  "english": "ramen shop",
  "type": "noun"
},
{
  "id": "duo_688",
  "japanese": "ピザや",
  "english": "pizza shop",
  "type": "noun"
},
{
  "id": "duo_689",
  "japanese": "はらじゅく",
  "english": "Harajuku",
  "type": "noun"
},
{
  "id": "duo_690",
  "japanese": "デザート",
  "english": "dessert",
  "type": "noun"
},
{
  "id": "duo_693",
  "japanese": "おてら",
  "english": "temple",
  "type": "noun"
},
{
  "id": "duo_696",
  "japanese": "ところ",
  "english": "place",
  "type": "noun"
},
{
  "id": "duo_699",
  "japanese": "しゅうてん",
  "english": "final stop",
  "type": "noun"
},
{
  "id": "duo_700",
  "japanese": "時間",
  "english": "time, hour, hours",
  "type": "noun"
},
{
  "id": "duo_701",
  "japanese": "分",
  "english": "minute, minutes",
  "type": "noun"
},
{
  "id": "duo_708",
  "japanese": "あさくさ",
  "english": "Asakusa",
  "type": "noun"
},
{
  "id": "duo_709",
  "japanese": "うえのこうえん",
  "english": "Ueno Park",
  "type": "noun"
},
{
  "id": "duo_715",
  "japanese": "あきはばら",
  "english": "Akihabara",
  "type": "noun"
},
{
  "id": "duo_721",
  "japanese": "つくえ",
  "english": "desk",
  "type": "noun"
},
{
  "id": "duo_723",
  "japanese": "れいぞうこ",
  "english": "fridge",
  "type": "noun"
},
{
  "id": "duo_724",
  "japanese": "いす",
  "english": "chair, chairs",
  "type": "noun"
},
{
  "id": "duo_725",
  "japanese": "テーブル",
  "english": "table, tables",
  "type": "noun"
},
{
  "id": "duo_726",
  "japanese": "でんしレンジ",
  "english": "microwave",
  "type": "noun"
},
{
  "id": "duo_727",
  "japanese": "ふとん",
  "english": "futon, futons",
  "type": "noun"
},
{
  "id": "duo_730",
  "japanese": "シャワー",
  "english": "shower, showers",
  "type": "noun"
},
{
  "id": "duo_731",
  "japanese": "そうじき",
  "english": "vacuum cleaner",
  "type": "noun"
},
{
  "id": "duo_735",
  "japanese": "リビング",
  "english": "living room",
  "type": "noun"
},
{
  "id": "duo_742",
  "japanese": "いえ",
  "english": "house",
  "type": "noun"
},
{
  "id": "duo_743",
  "japanese": "れんあい",
  "english": "romance",
  "type": "noun"
},
{
  "id": "duo_744",
  "japanese": "コメディ",
  "english": "comedy",
  "type": "noun"
},
{
  "id": "duo_746",
  "japanese": "アクション",
  "english": "action",
  "type": "noun"
},
{
  "id": "duo_747",
  "japanese": "アメリカの",
  "english": "... of the US, American, ... of the United States",
  "type": "noun"
},
{
  "id": "duo_749",
  "japanese": "ファンタジー",
  "english": "fantasy",
  "type": "noun"
},
{
  "id": "duo_750",
  "japanese": "ホラー",
  "english": "horror",
  "type": "noun"
},
{
  "id": "duo_753",
  "japanese": "ミステリー",
  "english": "mystery",
  "type": "noun"
},
{
  "id": "duo_754",
  "japanese": "Kポップ",
  "english": "K-pop",
  "type": "noun"
},
{
  "id": "duo_755",
  "japanese": "日本の",
  "english": "Japan's, of Japan, Japanese",
  "type": "noun"
},
{
  "id": "duo_757",
  "japanese": "ベトナム",
  "english": "Vietnam",
  "type": "noun"
},
{
  "id": "duo_758",
  "japanese": "かんこく",
  "english": "Korea, korean",
  "type": "noun"
},
{
  "id": "duo_760",
  "japanese": "ちゅうごく",
  "english": "China",
  "type": "noun"
},
{
  "id": "duo_761",
  "japanese": "さんは",
  "english": "Mr./Ms.",
  "type": "noun"
},
{
  "id": "duo_762",
  "japanese": "かれし",
  "english": "boyfriend",
  "type": "noun"
},
{
  "id": "duo_768",
  "japanese": "ダニエル",
  "english": "Daniel",
  "type": "noun"
},
{
  "id": "duo_771",
  "japanese": "パスタ",
  "english": "pasta",
  "type": "noun"
},
{
  "id": "duo_777",
  "japanese": "バレーボール",
  "english": "volleyball",
  "type": "noun"
},
{
  "id": "duo_778",
  "japanese": "まいしゅう",
  "english": "every week",
  "type": "noun"
},
{
  "id": "duo_782",
  "japanese": "何時に",
  "english": "(at) what time",
  "type": "noun"
},
{
  "id": "duo_784",
  "japanese": "新聞",
  "english": "newspaper",
  "type": "noun"
},
{
  "id": "duo_785",
  "japanese": "ラジオ",
  "english": "radio",
  "type": "noun"
},
{
  "id": "duo_788",
  "japanese": "でぐち",
  "english": "exit",
  "type": "noun"
},
{
  "id": "duo_789",
  "japanese": "じはんき",
  "english": "vending machines, vending machine",
  "type": "noun"
},
{
  "id": "duo_790",
  "japanese": "コインロッカー",
  "english": "storage lockers",
  "type": "noun"
},
{
  "id": "duo_795",
  "japanese": "コンセント",
  "english": "outlet",
  "type": "noun"
},
{
  "id": "duo_797",
  "japanese": "でんわ",
  "english": "phone",
  "type": "noun"
},
{
  "id": "duo_798",
  "japanese": "ちか",
  "english": "underground level",
  "type": "noun"
},
{
  "id": "duo_801",
  "japanese": "おてあらい",
  "english": "restroom",
  "type": "noun"
},
{
  "id": "duo_802",
  "japanese": "wifi",
  "english": "wifi",
  "type": "noun"
},
{
  "id": "duo_804",
  "japanese": "ゴミばこ",
  "english": "trash can",
  "type": "noun"
},
{
  "id": "duo_805",
  "japanese": "のりかえ",
  "english": "transfer",
  "type": "noun"
},
{
  "id": "duo_809",
  "japanese": "いっかい",
  "english": "first floor",
  "type": "noun"
},
{
  "id": "duo_810",
  "japanese": "ホーム",
  "english": "platform",
  "type": "noun"
},
{
  "id": "duo_812",
  "japanese": "じゅうどう",
  "english": "judo",
  "type": "noun"
},
{
  "id": "duo_813",
  "japanese": "テニス",
  "english": "tennis",
  "type": "noun"
},
{
  "id": "duo_815",
  "japanese": "日曜日",
  "english": "Sunday",
  "type": "noun"
},
{
  "id": "duo_817",
  "japanese": "からて",
  "english": "karate",
  "type": "noun"
},
{
  "id": "duo_821",
  "japanese": "スポーツ",
  "english": "sports",
  "type": "noun"
},
{
  "id": "duo_824",
  "japanese": "ドラマ",
  "english": "drama",
  "type": "noun"
},
{
  "id": "duo_827",
  "japanese": "しゅうまつ",
  "english": "weekend",
  "type": "noun"
},
{
  "id": "duo_829",
  "japanese": "アイスコーヒー",
  "english": "iced coffee",
  "type": "noun"
},
{
  "id": "duo_831",
  "japanese": "こうちゃ",
  "english": "black teas, black tea, tea",
  "type": "noun"
},
{
  "id": "duo_835",
  "japanese": "サラダ",
  "english": "salad, salads",
  "type": "noun"
},
{
  "id": "duo_838",
  "japanese": "おにぎり",
  "english": "rice balls, rice ball, onigiri",
  "type": "noun"
},
{
  "id": "duo_846",
  "japanese": "水",
  "english": "water, waters",
  "type": "noun"
},
{
  "id": "duo_847",
  "japanese": "レストラン",
  "english": "restaurant",
  "type": "noun"
},
{
  "id": "duo_849",
  "japanese": "うどん",
  "english": "udon",
  "type": "noun"
},
{
  "id": "duo_850",
  "japanese": "てんぷら",
  "english": "tempura",
  "type": "noun"
},
{
  "id": "duo_854",
  "japanese": "みせ",
  "english": "store",
  "type": "noun"
},
{
  "id": "duo_856",
  "japanese": "千",
  "english": "thousand",
  "type": "noun"
},
{
  "id": "duo_858",
  "japanese": "ネクタイ",
  "english": "tie, necktie, ties",
  "type": "noun"
},
{
  "id": "duo_859",
  "japanese": "えん",
  "english": "yen",
  "type": "noun"
},
{
  "id": "duo_861",
  "japanese": "百",
  "english": "hundred",
  "type": "noun"
},
{
  "id": "duo_865",
  "japanese": "ドレス",
  "english": "dress",
  "type": "noun"
},
{
  "id": "duo_872",
  "japanese": "ふく",
  "english": "clothes",
  "type": "noun"
},
{
  "id": "duo_875",
  "japanese": "さいふ",
  "english": "wallet",
  "type": "noun"
},
{
  "id": "duo_878",
  "japanese": "まいばん",
  "english": "every night",
  "type": "noun"
},
{
  "id": "duo_880",
  "japanese": "半",
  "english": "thirty",
  "type": "noun"
},
{
  "id": "duo_881",
  "japanese": "八",
  "english": "eight",
  "type": "noun"
},
{
  "id": "duo_882",
  "japanese": "べんとう",
  "english": "boxed lunch",
  "type": "noun"
},
{
  "id": "duo_883",
  "japanese": "ひるごはん",
  "english": "lunch",
  "type": "noun"
},
{
  "id": "duo_884",
  "japanese": "十二",
  "english": "twelve",
  "type": "noun"
},
{
  "id": "duo_885",
  "japanese": "十",
  "english": "ten",
  "type": "noun"
},
{
  "id": "duo_886",
  "japanese": "十一",
  "english": "eleven",
  "type": "noun"
},
{
  "id": "duo_889",
  "japanese": "時",
  "english": "o'clock",
  "type": "noun"
},
{
  "id": "duo_893",
  "japanese": "ジュース",
  "english": "juice",
  "type": "noun"
},
{
  "id": "duo_895",
  "japanese": "パン",
  "english": "bread",
  "type": "noun"
},
{
  "id": "duo_896",
  "japanese": "サンドイッチ",
  "english": "sandwich",
  "type": "noun"
},
{
  "id": "duo_901",
  "japanese": "やきゅう",
  "english": "baseball",
  "type": "noun"
},
{
  "id": "duo_902",
  "japanese": "ざっし",
  "english": "magazines",
  "type": "noun"
},
{
  "id": "duo_903",
  "japanese": "本",
  "english": "books",
  "type": "noun"
},
{
  "id": "duo_905",
  "japanese": "ニュース",
  "english": "news",
  "type": "noun"
},
{
  "id": "duo_906",
  "japanese": "おんがく",
  "english": "music",
  "type": "noun"
},
{
  "id": "duo_909",
  "japanese": "ジャズ",
  "english": "jazz",
  "type": "noun"
},
{
  "id": "duo_917",
  "japanese": "テレビ",
  "english": "TV",
  "type": "noun"
},
{
  "id": "duo_919",
  "japanese": "おっと",
  "english": "my husband",
  "type": "noun"
},
{
  "id": "duo_920",
  "japanese": "七",
  "english": "7, seven, seventh",
  "type": "noun"
},
{
  "id": "duo_924",
  "japanese": "むすめ",
  "english": "my daughter",
  "type": "noun"
},
{
  "id": "duo_925",
  "japanese": "六",
  "english": "six",
  "type": "noun"
},
{
  "id": "duo_927",
  "japanese": "だいがくせい",
  "english": "college student",
  "type": "noun"
},
{
  "id": "duo_929",
  "japanese": "かんごし",
  "english": "nurse",
  "type": "noun"
},
{
  "id": "duo_932",
  "japanese": "五",
  "english": "5, five",
  "type": "noun"
},
{
  "id": "duo_934",
  "japanese": "かいしゃいん",
  "english": "office worker",
  "type": "noun"
},
{
  "id": "duo_935",
  "japanese": "あね",
  "english": "my older sister",
  "type": "noun"
},
{
  "id": "duo_936",
  "japanese": "四",
  "english": "four",
  "type": "noun"
},
{
  "id": "duo_938",
  "japanese": "さい",
  "english": "years old",
  "type": "noun"
},
{
  "id": "duo_940",
  "japanese": "エンジニア",
  "english": "engineer",
  "type": "noun"
},
{
  "id": "duo_941",
  "japanese": "父",
  "english": "dad",
  "type": "noun"
},
{
  "id": "duo_942",
  "japanese": "かぞく",
  "english": "family",
  "type": "noun"
},
{
  "id": "duo_943",
  "japanese": "母",
  "english": "mom, mother, my mom",
  "type": "noun"
},
{
  "id": "duo_948",
  "japanese": "トロント",
  "english": "Toronto",
  "type": "noun"
},
{
  "id": "duo_950",
  "japanese": "とし",
  "english": "years, cities, city",
  "type": "noun"
},
{
  "id": "duo_952",
  "japanese": "日本",
  "english": "Japan, Japanese",
  "type": "noun"
},
{
  "id": "duo_956",
  "japanese": "ニューヨーク",
  "english": "New York",
  "type": "noun"
},
{
  "id": "duo_964",
  "japanese": "おなまえは",
  "english": "what's your name",
  "type": "noun"
},
{
  "id": "duo_965",
  "japanese": "かばん",
  "english": "bag",
  "type": "noun"
},
{
  "id": "duo_966",
  "japanese": "中山",
  "english": "Nakayama",
  "type": "noun"
},
{
  "id": "duo_967",
  "japanese": "田中",
  "english": "Tanaka",
  "type": "noun"
},
{
  "id": "duo_968",
  "japanese": "山口",
  "english": "Yamaguchi",
  "type": "noun"
},
{
  "id": "duo_972",
  "japanese": "ちず",
  "english": "map",
  "type": "noun"
},
{
  "id": "duo_973",
  "japanese": "きっぷ",
  "english": "ticket",
  "type": "noun"
},
{
  "id": "duo_976",
  "japanese": "くうこう",
  "english": "airport",
  "type": "noun"
},
{
  "id": "duo_977",
  "japanese": "はん",
  "english": "thirty",
  "type": "noun"
},
{
  "id": "duo_979",
  "japanese": "ごろ",
  "english": "around, about",
  "type": "noun"
},
{
  "id": "duo_980",
  "japanese": "いま",
  "english": "now, current",
  "type": "noun"
},
{
  "id": "duo_981",
  "japanese": "一",
  "english": "one, an, a",
  "type": "noun"
},
{
  "id": "duo_982",
  "japanese": "二",
  "english": "two, 2",
  "type": "noun"
},
{
  "id": "duo_983",
  "japanese": "なんじ",
  "english": "what time",
  "type": "noun"
},
{
  "id": "duo_984",
  "japanese": "三",
  "english": "3, three, third",
  "type": "noun"
},
{
  "id": "duo_985",
  "japanese": "じ",
  "english": "o'clock",
  "type": "noun"
},
{
  "id": "duo_987",
  "japanese": "いち",
  "english": "one, an",
  "type": "noun"
},
{
  "id": "duo_993",
  "japanese": "たなか",
  "english": "Tanaka",
  "type": "noun"
},
{
  "id": "duo_1012",
  "japanese": "コンビニ",
  "english": "convenience store",
  "type": "noun"
},
{
  "id": "duo_1018",
  "japanese": "にほんじん",
  "english": "Japanese",
  "type": "noun"
},
{
  "id": "duo_1019",
  "japanese": "カナダ",
  "english": "Canada",
  "type": "noun"
},
{
  "id": "duo_1020",
  "japanese": "アメリカじん",
  "english": "American",
  "type": "noun"
},
{
  "id": "duo_1024",
  "japanese": "にほん",
  "english": "Japan",
  "type": "noun"
},
{
  "id": "duo_1030",
  "japanese": "ピザ",
  "english": "pizza",
  "type": "noun"
},
{
  "id": "duo_1039",
  "japanese": "さん",
  "english": "Mr., Miss, Mrs.",
  "type": "noun"
},
{
  "id": "duo_1041",
  "japanese": "なおみ",
  "english": "Naomi",
  "type": "noun"
},
{
  "id": "duo_1046",
  "japanese": "がくせい",
  "english": "student, students",
  "type": "noun"
},
{
  "id": "duo_1047",
  "japanese": "ひと",
  "english": "person, people",
  "type": "noun"
}
```

### VERB (83 words)

```json
{
  "id": "duo_1",
  "japanese": "あそびたいです",
  "english": "want to play",
  "type": "verb"
},
{
  "id": "duo_8",
  "japanese": "会いたくないです",
  "english": "don't want to see, don't want to meet",
  "type": "verb"
},
{
  "id": "duo_9",
  "japanese": "ねました",
  "english": "went to sleep, slept",
  "type": "verb"
},
{
  "id": "duo_12",
  "japanese": "行きたくないです",
  "english": "do not want to go",
  "type": "verb"
},
{
  "id": "duo_13",
  "japanese": "食べたいです",
  "english": "want to eat",
  "type": "verb"
},
{
  "id": "duo_14",
  "japanese": "ねたいです",
  "english": "want to sleep",
  "type": "verb"
},
{
  "id": "duo_23",
  "japanese": "かたづけます",
  "english": "(will) clean up, going to tidy up",
  "type": "verb"
},
{
  "id": "duo_24",
  "japanese": "帰ります",
  "english": "am going home, goes home, am going back",
  "type": "verb"
},
{
  "id": "duo_37",
  "japanese": "になります",
  "english": "will be, becomes, become",
  "type": "verb"
},
{
  "id": "duo_55",
  "japanese": "つけます",
  "english": "put on, turns on, turn on",
  "type": "verb"
},
{
  "id": "duo_58",
  "japanese": "さきます",
  "english": "bloom, blooms, will bloom",
  "type": "verb"
},
{
  "id": "duo_59",
  "japanese": "住んでいます",
  "english": "live, lives",
  "type": "verb"
},
{
  "id": "duo_92",
  "japanese": "しまります",
  "english": "close, closes",
  "type": "verb"
},
{
  "id": "duo_101",
  "japanese": "そつぎょうします",
  "english": "graduate",
  "type": "verb"
},
{
  "id": "duo_102",
  "japanese": "はいります",
  "english": "enter, join, go in",
  "type": "verb"
},
{
  "id": "duo_105",
  "japanese": "つかれました",
  "english": "was tired, am tired, is tired",
  "type": "verb"
},
{
  "id": "duo_110",
  "japanese": "話したいです",
  "english": "want to talk",
  "type": "verb"
},
{
  "id": "duo_112",
  "japanese": "ならびます",
  "english": "(will) wait in line, (will) form a line, (will) queue",
  "type": "verb"
},
{
  "id": "duo_113",
  "japanese": "飲みたいです",
  "english": "want to drink",
  "type": "verb"
},
{
  "id": "duo_116",
  "japanese": "もどります",
  "english": "will return, return",
  "type": "verb"
},
{
  "id": "duo_120",
  "japanese": "でかけたいです",
  "english": "want to go out",
  "type": "verb"
},
{
  "id": "duo_123",
  "japanese": "行きたいです",
  "english": "would like to go, want to go, wants to go",
  "type": "verb"
},
{
  "id": "duo_124",
  "japanese": "会いたいです",
  "english": "want to meet",
  "type": "verb"
},
{
  "id": "duo_133",
  "japanese": "ひかります",
  "english": "lights up",
  "type": "verb"
},
{
  "id": "duo_147",
  "japanese": "きります",
  "english": "going to cut",
  "type": "verb"
},
{
  "id": "duo_148",
  "japanese": "あるきます",
  "english": "walk, walking, am walking",
  "type": "verb"
},
{
  "id": "duo_156",
  "japanese": "わたります",
  "english": "cross",
  "type": "verb"
},
{
  "id": "duo_169",
  "japanese": "れんしゅうしました",
  "english": "practiced",
  "type": "verb"
},
{
  "id": "duo_174",
  "japanese": "見つけました",
  "english": "found, caught",
  "type": "verb"
},
{
  "id": "duo_178",
  "japanese": "あそびました",
  "english": "played",
  "type": "verb"
},
{
  "id": "duo_179",
  "japanese": "行きました",
  "english": "went, (I) went",
  "type": "verb"
},
{
  "id": "duo_181",
  "japanese": "食べました",
  "english": "ate, (I) ate, had",
  "type": "verb"
},
{
  "id": "duo_185",
  "japanese": "来ました",
  "english": "have come, came, has arrived",
  "type": "verb"
},
{
  "id": "duo_211",
  "japanese": "とまりませんか",
  "english": "Shall we not stay",
  "type": "verb"
},
{
  "id": "duo_212",
  "japanese": "さがします",
  "english": "will look for, am going to look for",
  "type": "verb"
},
{
  "id": "duo_238",
  "japanese": "あきます",
  "english": "opens, open",
  "type": "verb"
},
{
  "id": "duo_242",
  "japanese": "やきます",
  "english": "bake, am going to bake, grill",
  "type": "verb"
},
{
  "id": "duo_247",
  "japanese": "たのしみます",
  "english": "going to enjoy",
  "type": "verb"
},
{
  "id": "duo_305",
  "japanese": "よびます",
  "english": "(will) call, calls, going to call",
  "type": "verb"
},
{
  "id": "duo_306",
  "japanese": "ゆっくりします",
  "english": "going to relax",
  "type": "verb"
},
{
  "id": "duo_310",
  "japanese": "はらいます",
  "english": "pay, going to pay, will pay",
  "type": "verb"
},
{
  "id": "duo_314",
  "japanese": "のりかえます",
  "english": "switching, going to transfer, are switching",
  "type": "verb"
},
{
  "id": "duo_323",
  "japanese": "のります",
  "english": "take, ride, getting on",
  "type": "verb"
},
{
  "id": "duo_331",
  "japanese": "よやくします",
  "english": "am going to reserve, book, will reserve",
  "type": "verb"
},
{
  "id": "duo_356",
  "japanese": "食べませんか",
  "english": "do you want to eat, won't you eat, would you like to eat",
  "type": "verb"
},
{
  "id": "duo_362",
  "japanese": "あそびませんか",
  "english": "play",
  "type": "verb"
},
{
  "id": "duo_368",
  "japanese": "作ります",
  "english": "going to make, make, (I) make",
  "type": "verb"
},
{
  "id": "duo_369",
  "japanese": "書きます",
  "english": "will write",
  "type": "verb"
},
{
  "id": "duo_373",
  "japanese": "おどります",
  "english": "dance, going to dance",
  "type": "verb"
},
{
  "id": "duo_374",
  "japanese": "はじまります",
  "english": "is starting, starts, begins",
  "type": "verb"
},
{
  "id": "duo_413",
  "japanese": "見ません",
  "english": "does not see, do not watch, does not look at",
  "type": "verb"
},
{
  "id": "duo_416",
  "japanese": "しません",
  "english": "do not, will not, does not",
  "type": "verb"
},
{
  "id": "duo_421",
  "japanese": "ききません",
  "english": "don't really listen to",
  "type": "verb"
},
{
  "id": "duo_438",
  "japanese": "見ましょうか",
  "english": "should we see",
  "type": "verb"
},
{
  "id": "duo_454",
  "japanese": "うんどうします",
  "english": "exercise, am going to exercise",
  "type": "verb"
},
{
  "id": "duo_461",
  "japanese": "りょこうします",
  "english": "travel, travels",
  "type": "verb"
},
{
  "id": "duo_464",
  "japanese": "うんてんします",
  "english": "drive",
  "type": "verb"
},
{
  "id": "duo_467",
  "japanese": "あらいます",
  "english": "wash, going to wash, washes",
  "type": "verb"
},
{
  "id": "duo_469",
  "japanese": "ほんやくします",
  "english": "translate",
  "type": "verb"
},
{
  "id": "duo_472",
  "japanese": "つかいます",
  "english": "will use, uses",
  "type": "verb"
},
{
  "id": "duo_501",
  "japanese": "飲みません",
  "english": "(I) won't drink, don't take, (I) do not drink",
  "type": "verb"
},
{
  "id": "duo_506",
  "japanese": "つかいましょう",
  "english": "we should use",
  "type": "verb"
},
{
  "id": "duo_522",
  "japanese": "つくりましょうか",
  "english": "shall I make, should we make, should I make",
  "type": "verb"
},
{
  "id": "duo_547",
  "japanese": "まちます",
  "english": "wait for",
  "type": "verb"
},
{
  "id": "duo_554",
  "japanese": "にのります",
  "english": "get on, going to ride, take",
  "type": "verb"
},
{
  "id": "duo_564",
  "japanese": "食べましょう",
  "english": "we should eat",
  "type": "verb"
},
{
  "id": "duo_567",
  "japanese": "かえりましょう",
  "english": "we should return",
  "type": "verb"
},
{
  "id": "duo_568",
  "japanese": "休みましょう",
  "english": "we should rest",
  "type": "verb"
},
{
  "id": "duo_571",
  "japanese": "とりましょう",
  "english": "we should take",
  "type": "verb"
},
{
  "id": "duo_576",
  "japanese": "見ましょう",
  "english": "let's see, let's view, let's watch",
  "type": "verb"
},
{
  "id": "duo_581",
  "japanese": "会います",
  "english": "am going to meet up, (will) meet, (is) meeting",
  "type": "verb"
},
{
  "id": "duo_584",
  "japanese": "会いましょう",
  "english": "let's meet, see you",
  "type": "verb"
},
{
  "id": "duo_598",
  "japanese": "にはいります",
  "english": "am going to take, take, going to enroll",
  "type": "verb"
},
{
  "id": "duo_612",
  "japanese": "かえります",
  "english": "am returning, will return home, returning",
  "type": "verb"
},
{
  "id": "duo_660",
  "japanese": "くすりを飲みます",
  "english": "take",
  "type": "verb"
},
{
  "id": "duo_661",
  "japanese": "休みます",
  "english": "rest, take a break, absent (from)",
  "type": "verb"
},
{
  "id": "duo_677",
  "japanese": "すわります",
  "english": "sit, going to sit",
  "type": "verb"
},
{
  "id": "duo_769",
  "japanese": "はしります",
  "english": "runs, run",
  "type": "verb"
},
{
  "id": "duo_772",
  "japanese": "ねます",
  "english": "sleep, go to sleep, will go to sleep",
  "type": "verb"
},
{
  "id": "duo_773",
  "japanese": "シャワーをあびます",
  "english": "take a shower",
  "type": "verb"
},
{
  "id": "duo_774",
  "japanese": "メールを読みます",
  "english": "check emails",
  "type": "verb"
},
{
  "id": "duo_814",
  "japanese": "話します",
  "english": "speaks, speak, tells",
  "type": "verb"
},
{
  "id": "duo_825",
  "japanese": "あそびます",
  "english": "hang out, hangs out, (I) will play",
  "type": "verb"
}
```

### ADJECTIVE (56 words)

```json
{
  "id": "duo_5",
  "japanese": "いたいです",
  "english": "hurts, painful, it hurts",
  "type": "adjective"
},
{
  "id": "duo_21",
  "japanese": "ねむい",
  "english": "sleepy",
  "type": "adjective"
},
{
  "id": "duo_26",
  "japanese": "いそがしくない",
  "english": "not busy",
  "type": "adjective"
},
{
  "id": "duo_29",
  "japanese": "とおくない",
  "english": "not far",
  "type": "adjective"
},
{
  "id": "duo_44",
  "japanese": "たのしくない",
  "english": "aren't fun",
  "type": "adjective"
},
{
  "id": "duo_47",
  "japanese": "くらくない",
  "english": "not dark",
  "type": "adjective"
},
{
  "id": "duo_64",
  "japanese": "キラキラ",
  "english": "sparkle, glisten, sparkly",
  "type": "adjective"
},
{
  "id": "duo_71",
  "japanese": "ふわふわ",
  "english": "fluffy",
  "type": "adjective"
},
{
  "id": "duo_79",
  "japanese": "ボロボロ",
  "english": "worn-out",
  "type": "adjective"
},
{
  "id": "duo_88",
  "japanese": "ふべん",
  "english": "inconvenient",
  "type": "adjective"
},
{
  "id": "duo_90",
  "japanese": "しんせつ",
  "english": "nice, kind",
  "type": "adjective"
},
{
  "id": "duo_128",
  "japanese": "おもい",
  "english": "heavy",
  "type": "adjective"
},
{
  "id": "duo_137",
  "japanese": "かるい",
  "english": "light, lightweight",
  "type": "adjective"
},
{
  "id": "duo_140",
  "japanese": "安い",
  "english": "inexpensive, cheap, cheaper",
  "type": "adjective"
},
{
  "id": "duo_196",
  "japanese": "むりょう",
  "english": "free",
  "type": "adjective"
},
{
  "id": "duo_218",
  "japanese": "おおい",
  "english": "a lot of, large, a lot",
  "type": "adjective"
},
{
  "id": "duo_225",
  "japanese": "からい",
  "english": "spicy",
  "type": "adjective"
},
{
  "id": "duo_234",
  "japanese": "つめたい",
  "english": "cold",
  "type": "adjective"
},
{
  "id": "duo_244",
  "japanese": "すずしい",
  "english": "cool",
  "type": "adjective"
},
{
  "id": "duo_249",
  "japanese": "くらい",
  "english": "dark",
  "type": "adjective"
},
{
  "id": "duo_260",
  "japanese": "カラフルな",
  "english": "colorful",
  "type": "adjective"
},
{
  "id": "duo_338",
  "japanese": "げんき",
  "english": "well, lively, fine",
  "type": "adjective"
},
{
  "id": "duo_415",
  "japanese": "むずかしい",
  "english": "difficult",
  "type": "adjective"
},
{
  "id": "duo_435",
  "japanese": "きいろい",
  "english": "yellow",
  "type": "adjective"
},
{
  "id": "duo_441",
  "japanese": "すきな",
  "english": "favorite",
  "type": "adjective"
},
{
  "id": "duo_443",
  "japanese": "こわい",
  "english": "scary",
  "type": "adjective"
},
{
  "id": "duo_449",
  "japanese": "つまらない",
  "english": "boring",
  "type": "adjective"
},
{
  "id": "duo_456",
  "japanese": "プロの",
  "english": "professional, pro",
  "type": "adjective"
},
{
  "id": "duo_499",
  "japanese": "しょっぱい",
  "english": "salty",
  "type": "adjective"
},
{
  "id": "duo_520",
  "japanese": "ひま",
  "english": "available, bored, free",
  "type": "adjective"
},
{
  "id": "duo_539",
  "japanese": "あまい",
  "english": "sweet",
  "type": "adjective"
},
{
  "id": "duo_544",
  "japanese": "みじかい",
  "english": "short",
  "type": "adjective"
},
{
  "id": "duo_553",
  "japanese": "べんり",
  "english": "convenient",
  "type": "adjective"
},
{
  "id": "duo_596",
  "japanese": "たいへん",
  "english": "tough, very, hard",
  "type": "adjective"
},
{
  "id": "duo_635",
  "japanese": "さむい",
  "english": "cold",
  "type": "adjective"
},
{
  "id": "duo_647",
  "japanese": "あつい",
  "english": "hot, thick",
  "type": "adjective"
},
{
  "id": "duo_675",
  "japanese": "あぶない",
  "english": "dangerous",
  "type": "adjective"
},
{
  "id": "duo_704",
  "japanese": "はやい",
  "english": "fast",
  "type": "adjective"
},
{
  "id": "duo_734",
  "japanese": "せまい",
  "english": "cramped",
  "type": "adjective"
},
{
  "id": "duo_741",
  "japanese": "ひろい",
  "english": "spacious",
  "type": "adjective"
},
{
  "id": "duo_791",
  "japanese": "ちかい",
  "english": "close",
  "type": "adjective"
},
{
  "id": "duo_796",
  "japanese": "とおい",
  "english": "far",
  "type": "adjective"
},
{
  "id": "duo_832",
  "japanese": "小さい",
  "english": "small, little",
  "type": "adjective"
},
{
  "id": "duo_837",
  "japanese": "大きい",
  "english": "big",
  "type": "adjective"
},
{
  "id": "duo_852",
  "japanese": "たかい",
  "english": "expensive, big, tall",
  "type": "adjective"
},
{
  "id": "duo_860",
  "japanese": "やすい",
  "english": "cheap, inexpensive",
  "type": "adjective"
},
{
  "id": "duo_863",
  "japanese": "あおい",
  "english": "blue",
  "type": "adjective"
},
{
  "id": "duo_866",
  "japanese": "すてき",
  "english": "lovely, nice, cute",
  "type": "adjective"
},
{
  "id": "duo_870",
  "japanese": "新しい",
  "english": "new, newer",
  "type": "adjective"
},
{
  "id": "duo_873",
  "japanese": "ダサい",
  "english": "hideous",
  "type": "adjective"
},
{
  "id": "duo_876",
  "japanese": "古い",
  "english": "old",
  "type": "adjective"
},
{
  "id": "duo_921",
  "japanese": "あたまがいい",
  "english": "smart",
  "type": "adjective"
},
{
  "id": "duo_939",
  "japanese": "いそがしい",
  "english": "busy",
  "type": "adjective"
},
{
  "id": "duo_946",
  "japanese": "きれい",
  "english": "clean",
  "type": "adjective"
},
{
  "id": "duo_999",
  "japanese": "しろい",
  "english": "white",
  "type": "adjective"
},
{
  "id": "duo_1023",
  "japanese": "ちいさい",
  "english": "small, little",
  "type": "adjective"
}
```

### COUNTER (39 words)

```json
{
  "id": "duo_38",
  "japanese": "四日",
  "english": "fourth, four days, 4th",
  "type": "counter"
},
{
  "id": "duo_39",
  "japanese": "三月",
  "english": "March",
  "type": "counter"
},
{
  "id": "duo_48",
  "japanese": "一月",
  "english": "January",
  "type": "counter"
},
{
  "id": "duo_135",
  "japanese": "万",
  "english": "ten thousand",
  "type": "counter"
},
{
  "id": "duo_193",
  "japanese": "四階",
  "english": "fourth floor",
  "type": "counter"
},
{
  "id": "duo_209",
  "japanese": "三日",
  "english": "third, three days",
  "type": "counter"
},
{
  "id": "duo_210",
  "japanese": "二日",
  "english": "two days, second, 2",
  "type": "counter"
},
{
  "id": "duo_215",
  "japanese": "七つ",
  "english": "seven (things), seven",
  "type": "counter"
},
{
  "id": "duo_220",
  "japanese": "六つ",
  "english": "six (things), six",
  "type": "counter"
},
{
  "id": "duo_227",
  "japanese": "五つ",
  "english": "five (things), five",
  "type": "counter"
},
{
  "id": "duo_230",
  "japanese": "二人",
  "english": "two people, they, two",
  "type": "counter"
},
{
  "id": "duo_252",
  "japanese": "一日",
  "english": "one day, first, a day",
  "type": "counter"
},
{
  "id": "duo_253",
  "japanese": "五月",
  "english": "May",
  "type": "counter"
},
{
  "id": "duo_270",
  "japanese": "にひき",
  "english": "two animals",
  "type": "counter"
},
{
  "id": "duo_275",
  "japanese": "いっぴき",
  "english": "one",
  "type": "counter"
},
{
  "id": "duo_296",
  "japanese": "四年生",
  "english": "senior, seniors",
  "type": "counter"
},
{
  "id": "duo_297",
  "japanese": "三年生",
  "english": "third grade student, junior",
  "type": "counter"
},
{
  "id": "duo_300",
  "japanese": "二年生",
  "english": "sophomore",
  "type": "counter"
},
{
  "id": "duo_301",
  "japanese": "一年生",
  "english": "freshman",
  "type": "counter"
},
{
  "id": "duo_346",
  "japanese": "十二月",
  "english": "December",
  "type": "counter"
},
{
  "id": "duo_350",
  "japanese": "十月",
  "english": "October",
  "type": "counter"
},
{
  "id": "duo_380",
  "japanese": "九時間",
  "english": "nine hours",
  "type": "counter"
},
{
  "id": "duo_388",
  "japanese": "四時間",
  "english": "for four hours",
  "type": "counter"
},
{
  "id": "duo_399",
  "japanese": "二階",
  "english": "the second floor",
  "type": "counter"
},
{
  "id": "duo_481",
  "japanese": "ななつ",
  "english": "seven",
  "type": "counter"
},
{
  "id": "duo_482",
  "japanese": "むっつ",
  "english": "six",
  "type": "counter"
},
{
  "id": "duo_488",
  "japanese": "いつつ",
  "english": "five",
  "type": "counter"
},
{
  "id": "duo_524",
  "japanese": "四つ",
  "english": "four (things), four",
  "type": "counter"
},
{
  "id": "duo_530",
  "japanese": "三つ",
  "english": "three",
  "type": "counter"
},
{
  "id": "duo_533",
  "japanese": "一つ",
  "english": "one (thing), one",
  "type": "counter"
},
{
  "id": "duo_613",
  "japanese": "ひとり",
  "english": "one",
  "type": "counter"
},
{
  "id": "duo_618",
  "japanese": "ふたり",
  "english": "two",
  "type": "counter"
},
{
  "id": "duo_649",
  "japanese": "七月",
  "english": "July",
  "type": "counter"
},
{
  "id": "duo_705",
  "japanese": "十分",
  "english": "sufficient, enough, adequate",
  "type": "counter"
},
{
  "id": "duo_779",
  "japanese": "四時",
  "english": "four o'clock",
  "type": "counter"
},
{
  "id": "duo_839",
  "japanese": "よっつ",
  "english": "four",
  "type": "counter"
},
{
  "id": "duo_841",
  "japanese": "みっつ",
  "english": "three",
  "type": "counter"
},
{
  "id": "duo_843",
  "japanese": "ふたつ",
  "english": "two",
  "type": "counter"
},
{
  "id": "duo_845",
  "japanese": "ひとつ",
  "english": "one",
  "type": "counter"
}
```

### ADVERB (19 words)

```json
{
  "id": "duo_4",
  "japanese": "後で",
  "english": "later, after, afterwards",
  "type": "adverb"
},
{
  "id": "duo_6",
  "japanese": "もうすこし",
  "english": "more, a bit longer",
  "type": "adverb"
},
{
  "id": "duo_19",
  "japanese": "今",
  "english": "this, now, just",
  "type": "adverb"
},
{
  "id": "duo_33",
  "japanese": "前に",
  "english": "previously, ago, in front of",
  "type": "adverb"
},
{
  "id": "duo_76",
  "japanese": "まっすぐ",
  "english": "straight",
  "type": "adverb"
},
{
  "id": "duo_104",
  "japanese": "また",
  "english": "again, back, see you ...",
  "type": "adverb"
},
{
  "id": "duo_106",
  "japanese": "もう",
  "english": "yet, now, already",
  "type": "adverb"
},
{
  "id": "duo_177",
  "japanese": "はじめて",
  "english": "for the first time",
  "type": "adverb"
},
{
  "id": "duo_426",
  "japanese": "あまり",
  "english": "(not) a lot of, (not) so, (not) too",
  "type": "adverb"
},
{
  "id": "duo_487",
  "japanese": "はやく",
  "english": "fast, early, quickly",
  "type": "adverb"
},
{
  "id": "duo_494",
  "japanese": "たくさん",
  "english": "a lot of",
  "type": "adverb"
},
{
  "id": "duo_602",
  "japanese": "いろいろ",
  "english": "all sorts of",
  "type": "adverb"
},
{
  "id": "duo_707",
  "japanese": "もうすぐ",
  "english": "soon, almost, shortly",
  "type": "adverb"
},
{
  "id": "duo_720",
  "japanese": "いつ",
  "english": "when, what time",
  "type": "adverb"
},
{
  "id": "duo_728",
  "japanese": "たぶん",
  "english": "probably",
  "type": "adverb"
},
{
  "id": "duo_740",
  "japanese": "まだ",
  "english": "still, yet, too",
  "type": "adverb"
},
{
  "id": "duo_787",
  "japanese": "いつも",
  "english": "always, all the time",
  "type": "adverb"
},
{
  "id": "duo_833",
  "japanese": "すこし",
  "english": "a bit",
  "type": "adverb"
},
{
  "id": "duo_945",
  "japanese": "とても",
  "english": "very",
  "type": "adverb"
}
```

### PARTICLE (13 words)

```json
{
  "id": "duo_396",
  "japanese": "まで",
  "english": "through, even, before",
  "type": "particle"
},
{
  "id": "duo_404",
  "japanese": "から",
  "english": "because, starting, through",
  "type": "particle"
},
{
  "id": "duo_575",
  "japanese": "で",
  "english": "as a, under, through",
  "type": "particle"
},
{
  "id": "duo_630",
  "japanese": "が",
  "english": "(softens the tone), (indicates the subject), but",
  "type": "particle"
},
{
  "id": "duo_695",
  "japanese": "な",
  "english": "do not, (adjective ending), don't",
  "type": "particle"
},
{
  "id": "duo_871",
  "japanese": "ね",
  "english": "isn't it?",
  "type": "particle"
},
{
  "id": "duo_914",
  "japanese": "を",
  "english": "through, with, for",
  "type": "particle"
},
{
  "id": "duo_957",
  "japanese": "も",
  "english": "even, any, also",
  "type": "particle"
},
{
  "id": "duo_970",
  "japanese": "の",
  "english": "for, 's, one",
  "type": "particle"
},
{
  "id": "duo_986",
  "japanese": "に",
  "english": "to, in, as (a)",
  "type": "particle"
},
{
  "id": "duo_1026",
  "japanese": "か",
  "english": "or, is it?, that",
  "type": "particle"
},
{
  "id": "duo_1035",
  "japanese": "は",
  "english": "is, with, regarding",
  "type": "particle"
},
{
  "id": "duo_1054",
  "japanese": "と",
  "english": "and, that, door",
  "type": "particle"
}
```

### OTHER (10 words)

```json
{
  "id": "duo_511",
  "japanese": "でも",
  "english": "but, however, neither",
  "type": "other",
  "subtype": "conjunction"
},
{
  "id": "duo_706",
  "japanese": "どの",
  "english": "any, each, which",
  "type": "other",
  "subtype": "determiner"
},
{
  "id": "duo_748",
  "japanese": "どんな",
  "english": "any, what kind of, what (sort of)",
  "type": "other",
  "subtype": "determiner"
},
{
  "id": "duo_840",
  "japanese": "ええと",
  "english": "um",
  "type": "other",
  "subtype": "interjection"
},
{
  "id": "duo_844",
  "japanese": "あ",
  "english": "ah, oh",
  "type": "other",
  "subtype": "interjection"
},
{
  "id": "duo_862",
  "japanese": "あの",
  "english": "those, ah, that (over there)",
  "type": "other",
  "subtype": "determiner"
},
{
  "id": "duo_990",
  "japanese": "その",
  "english": "the, that, its",
  "type": "other",
  "subtype": "determiner"
},
{
  "id": "duo_1027",
  "japanese": "いいえ",
  "english": "no",
  "type": "other",
  "subtype": "interjection"
},
{
  "id": "duo_1028",
  "japanese": "はい",
  "english": "yes",
  "type": "other",
  "subtype": "interjection"
},
{
  "id": "duo_1053",
  "japanese": "です",
  "english": "there is, it's, I'm",
  "type": "other",
  "subtype": "copula"
}
```

### PHRASE (4 words)

```json
{
  "id": "duo_408",
  "japanese": "よろしくおねがいします",
  "english": "nice to meet you, glad to work with you",
  "type": "phrase"
},
{
  "id": "duo_745",
  "japanese": "ほんとうですか",
  "english": "really",
  "type": "phrase"
},
{
  "id": "duo_751",
  "japanese": "がすきですか",
  "english": "do you like",
  "type": "phrase"
},
{
  "id": "duo_961",
  "japanese": "ようこそ",
  "english": "welcome",
  "type": "phrase"
}
```

### PRONOUN (4 words)

```json
{
  "id": "duo_606",
  "japanese": "何",
  "english": "anything, which, what",
  "type": "pronoun"
},
{
  "id": "duo_691",
  "japanese": "あれ",
  "english": "hey, that (one) (over there), what",
  "type": "pronoun"
},
{
  "id": "duo_960",
  "japanese": "私",
  "english": "I",
  "type": "pronoun"
},
{
  "id": "duo_996",
  "japanese": "それら",
  "english": "they, them, those",
  "type": "pronoun"
}
```

---

## Output Format

Please generate example sentences for ALL 685 words above and return them in this JSON format:

```json
{
  "updatedWords": [
    {
      "id": "duo_0",
      "exampleSentences": [
        {
          "japanese": "...",
          "english": "...",
          "context": "statement|question|answer",
          "level": "X-Y",
          "isAIGenerated": true
        }
      ]
    },
    // ... all other words
  ]
}
```

## Important Notes

1. **Do NOT skip any words** - all 685 words must have examples
2. **Context types**:
   - "statement": Declarative sentences
   - "question": Questions (usually end with か)
   - "answer": Responses to questions
3. **Level estimation guide**:
   - Level 1 (1-1 to 1-9): Very basic, greetings, food orders, simple descriptions
   - Level 2 (2-1 to 2-30): Intermediate, daily conversations, hobbies, work
   - Level 3 (3-1 to 3-15): Advanced beginner, past tense, preferences, complex situations
4. **Use natural Japanese**: Avoid overly formal or bookish language unless appropriate for the word
5. **Be consistent**: All examples should be beginner-friendly but realistic

## Ready?

Please process all 685 words and generate the JSON output. Take your time to ensure quality!
