# Prompt for Claude AI - Generate Example Sentences

## Task

Generate example sentences for **264 Japanese vocabulary words** that currently don't have examples.

## Important Constraints

### 1. Vocabulary Restriction
**CRITICAL:** Use ONLY words from the provided 1060-word vocabulary list when creating example sentences. Do not use any Japanese words outside this list.

### 2. Example Distribution (2-3 examples per word)
- **15% Simple** (1 level, basic grammar, single clause)
- **60% Intermediate** (2 levels, natural sentences, 2-3 grammar points)
- **25% Advanced** (3 levels, multiple vocab from the 1060 list, complex patterns)

### 3. Diversity Requirements
Please use a variety of grammar elements in your examples:
- **Particles**: は, が, を, に, で, と, の, から, まで, etc.
- **Pronouns**: 私, あなた, これ, それ, あれ, だれ, 何, etc.
- **Time expressions**: 今, 今日, 明日, 昨日, 先週, 来月, etc.
- **Adverbs**: よく, とても, また, もう, いつも, etc.
- **Adjectives**: 大きい, 小さい, 新しい, 古い, きれい, etc.
- **Counters**: 一つ, 二つ, 三人, 四日, 五月, etc.
- **Verbs in different forms**: ます, ました, たい, ません, etc.

### 4. Output Format

For each word, provide examples in this JSON structure:

```json
{
  "updatedWords": [
    {
      "id": "duo_XXXX",
      "japanese": "word",
      "english": "translation",
      "type": "category",
      "exampleSentences": [
        {
          "japanese": "example sentence in Japanese",
          "english": "example sentence in English",
          "context": "statement|question|answer",
          "level": "1-3|2-2|3-1",
          "isAIGenerated": true
        }
      ]
    }
  ]
}
```

**Level notation:**
- `1-X` = Simple (beginner-friendly, 1-2 grammar points)
- `2-X` = Intermediate (natural, 2-3 grammar points)
- `3-X` = Advanced (complex, uses multiple vocab words from the list)

**Context types:**
- `statement` - Declarative sentence
- `question` - Interrogative sentence
- `answer` - Response to a question

---

## Words Needing Examples (264 words)

### List of 264 Words

```json
[
  {
    "id": "duo_888",
    "japanese": "明日",
    "english": "tomorrow",
    "type": "noun"
  },
  {
    "id": "duo_886",
    "japanese": "ちば",
    "english": "Chiba",
    "type": "noun"
  },
  {
    "id": "duo_885",
    "japanese": "見つけました",
    "english": "found, caught",
    "type": "verb"
  },
  {
    "id": "duo_883",
    "japanese": "クレープ",
    "english": "crepe",
    "type": "noun"
  },
  {
    "id": "duo_882",
    "japanese": "はじめて",
    "english": "for the first time",
    "type": "adverb"
  },
  {
    "id": "duo_881",
    "japanese": "あそびました",
    "english": "played",
    "type": "verb"
  },
  {
    "id": "duo_880",
    "japanese": "行きました",
    "english": "went, (I) went",
    "type": "verb"
  },
  {
    "id": "duo_878",
    "japanese": "食べました",
    "english": "ate, (I) ate, had",
    "type": "verb"
  },
  {
    "id": "duo_877",
    "japanese": "ぎんざ",
    "english": "Ginza",
    "type": "noun"
  },
  {
    "id": "duo_874",
    "japanese": "来ました",
    "english": "have come, came, has arrived",
    "type": "verb"
  },
  {
    "id": "duo_870",
    "japanese": "トースト",
    "english": "toast",
    "type": "noun"
  },
  {
    "id": "duo_869",
    "japanese": "コーヒーメーカー",
    "english": "coffee maker",
    "type": "noun"
  },
  {
    "id": "duo_866",
    "japanese": "四階",
    "english": "fourth floor",
    "type": "counter"
  },
  {
    "id": "duo_863",
    "japanese": "むりょう",
    "english": "free",
    "type": "adjective"
  },
  {
    "id": "duo_862",
    "japanese": "スパ",
    "english": "spa, spas",
    "type": "noun"
  },
  {
    "id": "duo_861",
    "japanese": "パスワード",
    "english": "password",
    "type": "noun"
  },
  {
    "id": "duo_859",
    "japanese": "ルームサービス",
    "english": "room service",
    "type": "noun"
  },
  {
    "id": "duo_858",
    "japanese": "こおり",
    "english": "ice",
    "type": "noun"
  },
  {
    "id": "duo_851",
    "japanese": "ネット",
    "english": "internet",
    "type": "noun"
  },
  {
    "id": "duo_850",
    "japanese": "三日",
    "english": "third, three days",
    "type": "counter"
  },
  {
    "id": "duo_849",
    "japanese": "二日",
    "english": "two days, second, 2",
    "type": "counter"
  },
  {
    "id": "duo_848",
    "japanese": "とまりませんか",
    "english": "Shall we not stay",
    "type": "verb"
  },
  {
    "id": "duo_845",
    "japanese": "おつり",
    "english": "change",
    "type": "noun"
  },
  {
    "id": "duo_842",
    "japanese": "かいけい",
    "english": "cashier",
    "type": "noun"
  },
  {
    "id": "duo_841",
    "japanese": "おおい",
    "english": "a lot of, large, a lot",
    "type": "adjective"
  },
  {
    "id": "duo_840",
    "japanese": "えび",
    "english": "shrimp",
    "type": "noun"
  },
  {
    "id": "duo_837",
    "japanese": "ナプキン",
    "english": "napkin",
    "type": "noun"
  },
  {
    "id": "duo_836",
    "japanese": "マーボーどうふ",
    "english": "mapo tofu",
    "type": "noun"
  },
  {
    "id": "duo_835",
    "japanese": "はし",
    "english": "bridges, chopsticks, bridge",
    "type": "noun"
  },
  {
    "id": "duo_834",
    "japanese": "からい",
    "english": "spicy",
    "type": "adjective"
  },
  {
    "id": "duo_825",
    "japanese": "つめたい",
    "english": "cold",
    "type": "adjective"
  },
  {
    "id": "duo_824",
    "japanese": "タピオカティー",
    "english": "bubble tea",
    "type": "noun"
  },
  {
    "id": "duo_823",
    "japanese": "ちゅうかがい",
    "english": "Chinatown",
    "type": "noun"
  },
  {
    "id": "duo_822",
    "japanese": "ちゅうかりょうり",
    "english": "Chinese food",
    "type": "noun"
  },
  {
    "id": "duo_821",
    "japanese": "あきます",
    "english": "opens, open",
    "type": "verb"
  },
  {
    "id": "duo_820",
    "japanese": "シーフード",
    "english": "seafood",
    "type": "noun"
  },
  {
    "id": "duo_818",
    "japanese": "こしょう",
    "english": "pepper",
    "type": "noun"
  },
  {
    "id": "duo_817",
    "japanese": "やきます",
    "english": "bake, am going to bake, grill",
    "type": "verb"
  },
  {
    "id": "duo_812",
    "japanese": "たのしみます",
    "english": "going to enjoy",
    "type": "verb"
  },
  {
    "id": "duo_811",
    "japanese": "雨",
    "english": "rain",
    "type": "noun"
  },
  {
    "id": "duo_809",
    "japanese": "ピクニック",
    "english": "picnic",
    "type": "noun"
  },
  {
    "id": "duo_807",
    "japanese": "一日",
    "english": "one day, first, a day",
    "type": "counter"
  },
  {
    "id": "duo_804",
    "japanese": "キャンプ",
    "english": "camping",
    "type": "noun"
  },
  {
    "id": "duo_803",
    "japanese": "ハイキング",
    "english": "hiking",
    "type": "noun"
  },
  {
    "id": "duo_802",
    "japanese": "バックパック",
    "english": "backpack",
    "type": "noun"
  },
  {
    "id": "duo_800",
    "japanese": "すみ",
    "english": "corner",
    "type": "noun"
  },
  {
    "id": "duo_799",
    "japanese": "カラフルな",
    "english": "colorful",
    "type": "adjective"
  },
  {
    "id": "duo_797",
    "japanese": "カメレオン",
    "english": "chameleon",
    "type": "noun"
  },
  {
    "id": "duo_796",
    "japanese": "なんびき",
    "english": "how many",
    "type": "noun"
  },
  {
    "id": "duo_793",
    "japanese": "口",
    "english": "mouths, (a) mouth, tastes",
    "type": "noun"
  },
  {
    "id": "duo_792",
    "japanese": "トマト",
    "english": "tomato, tomatoes, (a) tomato",
    "type": "noun"
  },
  {
    "id": "duo_787",
    "japanese": "ちゃいろ",
    "english": "brown",
    "type": "noun"
  },
  {
    "id": "duo_786",
    "japanese": "パンケーキ",
    "english": "pancake",
    "type": "noun"
  },
  {
    "id": "duo_783",
    "japanese": "カプチーノ",
    "english": "cappuccinos, (a) cappuccino",
    "type": "noun"
  },
  {
    "id": "duo_779",
    "japanese": "チェス",
    "english": "chess",
    "type": "noun"
  },
  {
    "id": "duo_776",
    "japanese": "ボードゲーム",
    "english": "board game",
    "type": "noun"
  },
  {
    "id": "duo_773",
    "japanese": "りょう",
    "english": "dorm",
    "type": "noun"
  },
  {
    "id": "duo_772",
    "japanese": "駅",
    "english": "station, train station, stations",
    "type": "noun"
  },
  {
    "id": "duo_771",
    "japanese": "タガログご",
    "english": "Tagalog",
    "type": "noun"
  },
  {
    "id": "duo_770",
    "japanese": "ドイツご",
    "english": "German",
    "type": "noun"
  },
  {
    "id": "duo_769",
    "japanese": "げんご",
    "english": "language, languages",
    "type": "noun"
  },
  {
    "id": "duo_765",
    "japanese": "ビジネス",
    "english": "business",
    "type": "noun"
  },
  {
    "id": "duo_763",
    "japanese": "四年生",
    "english": "senior, seniors",
    "type": "counter"
  },
  {
    "id": "duo_762",
    "japanese": "三年生",
    "english": "third grade student, junior",
    "type": "counter"
  },
  {
    "id": "duo_761",
    "japanese": "サム",
    "english": "Sam",
    "type": "noun"
  },
  {
    "id": "duo_760",
    "japanese": "かい",
    "english": "are you, will you, buy",
    "type": "noun"
  },
  {
    "id": "duo_759",
    "japanese": "二年生",
    "english": "sophomore",
    "type": "counter"
  },
  {
    "id": "duo_758",
    "japanese": "一年生",
    "english": "freshman",
    "type": "counter"
  },
  {
    "id": "duo_756",
    "japanese": "みなみぐち",
    "english": "south exit",
    "type": "noun"
  },
  {
    "id": "duo_755",
    "japanese": "飲み物",
    "english": "beverage, drink, drinks",
    "type": "noun"
  },
  {
    "id": "duo_754",
    "japanese": "よびます",
    "english": "(will) call, calls, going to call",
    "type": "verb"
  },
  {
    "id": "duo_753",
    "japanese": "ゆっくりします",
    "english": "going to relax",
    "type": "verb"
  },
  {
    "id": "duo_752",
    "japanese": "ツアー",
    "english": "tour",
    "type": "noun"
  },
  {
    "id": "duo_751",
    "japanese": "インフォメーション",
    "english": "information desk",
    "type": "noun"
  },
  {
    "id": "duo_750",
    "japanese": "八百",
    "english": "800",
    "type": "noun"
  },
  {
    "id": "duo_749",
    "japanese": "はらいます",
    "english": "pay, going to pay, will pay",
    "type": "verb"
  },
  {
    "id": "duo_748",
    "japanese": "エスカレーター",
    "english": "escalator",
    "type": "noun"
  },
  {
    "id": "duo_746",
    "japanese": "三ばん",
    "english": "number three",
    "type": "noun"
  },
  {
    "id": "duo_745",
    "japanese": "のりかえます",
    "english": "switching, going to transfer, are switching",
    "type": "verb"
  },
  {
    "id": "duo_744",
    "japanese": "かいそく",
    "english": "rapid-service",
    "type": "noun"
  },
  {
    "id": "duo_743",
    "japanese": "二ばん",
    "english": "number two",
    "type": "noun"
  },
  {
    "id": "duo_742",
    "japanese": "オレンジ",
    "english": "orange",
    "type": "noun"
  },
  {
    "id": "duo_740",
    "japanese": "一ばん",
    "english": "number one",
    "type": "noun"
  },
  {
    "id": "duo_739",
    "japanese": "きっぷうりば",
    "english": "ticket area",
    "type": "noun"
  },
  {
    "id": "duo_738",
    "japanese": "モノレール",
    "english": "monorail",
    "type": "noun"
  },
  {
    "id": "duo_737",
    "japanese": "三百",
    "english": "300, three hundred",
    "type": "noun"
  },
  {
    "id": "duo_733",
    "japanese": "ステーキ",
    "english": "steak",
    "type": "noun"
  },
  {
    "id": "duo_732",
    "japanese": "かんとく",
    "english": "director",
    "type": "noun"
  },
  {
    "id": "duo_731",
    "japanese": "ポップコーン",
    "english": "popcorn",
    "type": "noun"
  },
  {
    "id": "duo_729",
    "japanese": "ホットドッグ",
    "english": "hot dog",
    "type": "noun"
  },
  {
    "id": "duo_726",
    "japanese": "スーツ",
    "english": "suit",
    "type": "noun"
  },
  {
    "id": "duo_724",
    "japanese": "うでどけい",
    "english": "watch",
    "type": "noun"
  },
  {
    "id": "duo_723",
    "japanese": "ネックレス",
    "english": "necklace",
    "type": "noun"
  },
  {
    "id": "duo_719",
    "japanese": "人",
    "english": "people, human, someone",
    "type": "noun"
  },
  {
    "id": "duo_717",
    "japanese": "カウントダウン",
    "english": "countdown",
    "type": "noun"
  },
  {
    "id": "duo_716",
    "japanese": "クリスマス",
    "english": "Christmas",
    "type": "noun"
  },
  {
    "id": "duo_714",
    "japanese": "イルミネーション",
    "english": "lights display",
    "type": "noun"
  },
  {
    "id": "duo_712",
    "japanese": "パレード",
    "english": "parade",
    "type": "noun"
  },
  {
    "id": "duo_707",
    "japanese": "ダンス",
    "english": "dance",
    "type": "noun"
  },
  {
    "id": "duo_706",
    "japanese": "コミュニティーセンター",
    "english": "community center, Community center",
    "type": "noun"
  },
  {
    "id": "duo_703",
    "japanese": "食べませんか",
    "english": "do you want to eat, won't you eat, would you like to eat",
    "type": "verb"
  },
  {
    "id": "duo_702",
    "japanese": "チョコバナナ",
    "english": "chocolate covered bananas, chocolate covered banana",
    "type": "noun"
  },
  {
    "id": "duo_701",
    "japanese": "食べ物",
    "english": "food",
    "type": "noun"
  },
  {
    "id": "duo_698",
    "japanese": "はなびたいかい",
    "english": "fireworks display",
    "type": "noun"
  },
  {
    "id": "duo_697",
    "japanese": "あそびませんか",
    "english": "play",
    "type": "verb"
  },
  {
    "id": "duo_695",
    "japanese": "こんしゅうまつ",
    "english": "this weekend",
    "type": "noun"
  },
  {
    "id": "duo_694",
    "japanese": "きじ",
    "english": "post",
    "type": "noun"
  },
  {
    "id": "duo_693",
    "japanese": "ブログ",
    "english": "blog",
    "type": "noun"
  },
  {
    "id": "duo_689",
    "japanese": "バレエ",
    "english": "ballet",
    "type": "noun"
  },
  {
    "id": "duo_687",
    "japanese": "パフォーマンス",
    "english": "performance",
    "type": "noun"
  },
  {
    "id": "duo_683",
    "japanese": "かんじ",
    "english": "kanji, Chinese character, Chinese characters",
    "type": "noun"
  },
  {
    "id": "duo_680",
    "japanese": "ピアノ",
    "english": "piano",
    "type": "noun"
  },
  {
    "id": "duo_679",
    "japanese": "九時間",
    "english": "nine hours",
    "type": "counter"
  },
  {
    "id": "duo_678",
    "japanese": "がっき",
    "english": "instrument",
    "type": "noun"
  },
  {
    "id": "duo_675",
    "japanese": "何時間",
    "english": "how many hours",
    "type": "noun"
  },
  {
    "id": "duo_674",
    "japanese": "れんしゅう",
    "english": "practice",
    "type": "noun"
  },
  {
    "id": "duo_673",
    "japanese": "バドミントン",
    "english": "badminton",
    "type": "noun"
  },
  {
    "id": "duo_671",
    "japanese": "四時間",
    "english": "for four hours",
    "type": "counter"
  },
  {
    "id": "duo_670",
    "japanese": "バー",
    "english": "bar",
    "type": "noun"
  },
  {
    "id": "duo_666",
    "japanese": "クライアント",
    "english": "client",
    "type": "noun"
  },
  {
    "id": "duo_665",
    "japanese": "プレゼン",
    "english": "presentation",
    "type": "noun"
  },
  {
    "id": "duo_663",
    "japanese": "まで",
    "english": "through, even, before",
    "type": "particle"
  },
  {
    "id": "duo_662",
    "japanese": "ひる休み",
    "english": "lunch break",
    "type": "noun"
  },
  {
    "id": "duo_660",
    "japanese": "二階",
    "english": "the second floor",
    "type": "counter"
  },
  {
    "id": "duo_659",
    "japanese": "チャーハン",
    "english": "fried rice",
    "type": "noun"
  },
  {
    "id": "duo_658",
    "japanese": "フライドポテト",
    "english": "french fries",
    "type": "noun"
  },
  {
    "id": "duo_656",
    "japanese": "プリンター",
    "english": "printer",
    "type": "noun"
  },
  {
    "id": "duo_655",
    "japanese": "から",
    "english": "because, starting, through",
    "type": "particle"
  },
  {
    "id": "duo_652",
    "japanese": "うけつけ",
    "english": "front desk",
    "type": "noun"
  },
  {
    "id": "duo_649",
    "japanese": "ドキュメンタリー",
    "english": "documentary",
    "type": "noun"
  },
  {
    "id": "duo_648",
    "japanese": "ポスター",
    "english": "poster",
    "type": "noun"
  },
  {
    "id": "duo_647",
    "japanese": "はいゆう",
    "english": "actor",
    "type": "noun"
  },
  {
    "id": "duo_646",
    "japanese": "見ません",
    "english": "does not see, do not watch, does not look at",
    "type": "verb"
  },
  {
    "id": "duo_645",
    "japanese": "カードゲーム",
    "english": "card game",
    "type": "noun"
  },
  {
    "id": "duo_643",
    "japanese": "しません",
    "english": "do not, will not, does not",
    "type": "verb"
  },
  {
    "id": "duo_642",
    "japanese": "パズル",
    "english": "puzzle",
    "type": "noun"
  },
  {
    "id": "duo_638",
    "japanese": "ききません",
    "english": "don't really listen to",
    "type": "verb"
  },
  {
    "id": "duo_637",
    "japanese": "ポップス",
    "english": "pop",
    "type": "noun"
  },
  {
    "id": "duo_636",
    "japanese": "ノンフィクション",
    "english": "non-fiction",
    "type": "noun"
  },
  {
    "id": "duo_632",
    "japanese": "話",
    "english": "talking, conversation, chat",
    "type": "noun"
  },
  {
    "id": "duo_628",
    "japanese": "チョコミント",
    "english": "mint chocolate chip",
    "type": "noun"
  },
  {
    "id": "duo_626",
    "japanese": "バニラ",
    "english": "vanilla",
    "type": "noun"
  },
  {
    "id": "duo_624",
    "japanese": "きいろい",
    "english": "yellow",
    "type": "adjective"
  },
  {
    "id": "duo_623",
    "japanese": "ショー",
    "english": "show",
    "type": "noun"
  },
  {
    "id": "duo_621",
    "japanese": "見ましょうか",
    "english": "should we see",
    "type": "verb"
  },
  {
    "id": "duo_620",
    "japanese": "ゴーカート",
    "english": "go-kart",
    "type": "noun"
  },
  {
    "id": "duo_618",
    "japanese": "すきな",
    "english": "favorite",
    "type": "adjective"
  },
  {
    "id": "duo_617",
    "japanese": "アトラクション",
    "english": "attraction",
    "type": "noun"
  },
  {
    "id": "duo_616",
    "japanese": "こわい",
    "english": "scary",
    "type": "adjective"
  },
  {
    "id": "duo_614",
    "japanese": "三千",
    "english": "3,000",
    "type": "noun"
  },
  {
    "id": "duo_608",
    "japanese": "ゆうえんち",
    "english": "theme park",
    "type": "noun"
  },
  {
    "id": "duo_604",
    "japanese": "せんしゅ",
    "english": "athlete, athletes, player",
    "type": "noun"
  },
  {
    "id": "duo_603",
    "japanese": "プロの",
    "english": "professional, pro",
    "type": "adjective"
  },
  {
    "id": "duo_602",
    "japanese": "チーム",
    "english": "team",
    "type": "noun"
  },
  {
    "id": "duo_596",
    "japanese": "ごぜん",
    "english": "a.m., morning",
    "type": "noun"
  },
  {
    "id": "duo_595",
    "japanese": "うんてんします",
    "english": "drive",
    "type": "verb"
  },
  {
    "id": "duo_594",
    "japanese": "ナビ",
    "english": "GPS",
    "type": "noun"
  },
  {
    "id": "duo_591",
    "japanese": "ほんやくか",
    "english": "translator",
    "type": "noun"
  },
  {
    "id": "duo_590",
    "japanese": "ほんやくします",
    "english": "translate",
    "type": "verb"
  },
  {
    "id": "duo_588",
    "japanese": "じしょ",
    "english": "dictionary",
    "type": "noun"
  },
  {
    "id": "duo_585",
    "japanese": "かいしゃ",
    "english": "company",
    "type": "noun"
  },
  {
    "id": "duo_580",
    "japanese": "プロジェクト",
    "english": "project",
    "type": "noun"
  },
  {
    "id": "duo_579",
    "japanese": "しめきり",
    "english": "deadline",
    "type": "noun"
  },
  {
    "id": "duo_569",
    "japanese": "何曜日",
    "english": "what day",
    "type": "noun"
  },
  {
    "id": "duo_567",
    "japanese": "スミス",
    "english": "Smith",
    "type": "noun"
  },
  {
    "id": "duo_566",
    "japanese": "山田",
    "english": "Yamada",
    "type": "noun"
  },
  {
    "id": "duo_563",
    "japanese": "スペインご",
    "english": "Spanish",
    "type": "noun"
  },
  {
    "id": "duo_562",
    "japanese": "きょうしつ",
    "english": "classroom",
    "type": "noun"
  },
  {
    "id": "duo_560",
    "japanese": "しょっぱい",
    "english": "salty",
    "type": "adjective"
  },
  {
    "id": "duo_559",
    "japanese": "コーラ",
    "english": "cola",
    "type": "noun"
  },
  {
    "id": "duo_558",
    "japanese": "飲みません",
    "english": "(I) won't drink, don't take, (I) do not drink",
    "type": "verb"
  },
  {
    "id": "duo_556",
    "japanese": "とんかつ",
    "english": "pork cutlet",
    "type": "noun"
  },
  {
    "id": "duo_555",
    "japanese": "しお",
    "english": "salt",
    "type": "noun"
  },
  {
    "id": "duo_554",
    "japanese": "ソース",
    "english": "sauce",
    "type": "noun"
  },
  {
    "id": "duo_553",
    "japanese": "つかいましょう",
    "english": "we should use",
    "type": "verb"
  },
  {
    "id": "duo_552",
    "japanese": "なま",
    "english": "raw",
    "type": "noun"
  },
  {
    "id": "duo_551",
    "japanese": "とうふ",
    "english": "(the) tofu, bean curd, tofu",
    "type": "noun"
  },
  {
    "id": "duo_548",
    "japanese": "でも",
    "english": "but, however, neither",
    "type": "other"
  },
  {
    "id": "duo_547",
    "japanese": "ぎゅうどん",
    "english": "beef bowl",
    "type": "noun"
  },
  {
    "id": "duo_542",
    "japanese": "卵",
    "english": "egg, eggs",
    "type": "noun"
  },
  {
    "id": "duo_537",
    "japanese": "つくりましょうか",
    "english": "shall I make, should we make, should I make",
    "type": "verb"
  },
  {
    "id": "duo_531",
    "japanese": "いちご",
    "english": "strawberry, strawberries",
    "type": "noun"
  },
  {
    "id": "duo_530",
    "japanese": "クッキー",
    "english": "cookies, cookie",
    "type": "noun"
  },
  {
    "id": "duo_527",
    "japanese": "みどり",
    "english": "green",
    "type": "noun"
  },
  {
    "id": "duo_525",
    "japanese": "カップケーキ",
    "english": "cupcake",
    "type": "noun"
  },
  {
    "id": "duo_520",
    "japanese": "あまい",
    "english": "sweet",
    "type": "adjective"
  },
  {
    "id": "duo_518",
    "japanese": "ケーキや",
    "english": "cake shop",
    "type": "noun"
  },
  {
    "id": "duo_511",
    "japanese": "みそかつ",
    "english": "miso pork cutlet",
    "type": "noun"
  },
  {
    "id": "duo_510",
    "japanese": "にわ",
    "english": "garden",
    "type": "noun"
  },
  {
    "id": "duo_508",
    "japanese": "しろ",
    "english": "castle",
    "type": "noun"
  },
  {
    "id": "duo_507",
    "japanese": "せき",
    "english": "seat",
    "type": "noun"
  },
  {
    "id": "duo_505",
    "japanese": "にのります",
    "english": "get on, going to ride, take",
    "type": "verb"
  },
  {
    "id": "duo_502",
    "japanese": "日本りょうり",
    "english": "Japanese food",
    "type": "noun"
  },
  {
    "id": "duo_499",
    "japanese": "すしや",
    "english": "sushi restaurant",
    "type": "noun"
  },
  {
    "id": "duo_495",
    "japanese": "食べましょう",
    "english": "we should eat",
    "type": "verb"
  },
  {
    "id": "duo_493",
    "japanese": "フランスりょうり",
    "english": "French food",
    "type": "noun"
  },
  {
    "id": "duo_492",
    "japanese": "かえりましょう",
    "english": "we should return",
    "type": "verb"
  },
  {
    "id": "duo_491",
    "japanese": "休みましょう",
    "english": "we should rest",
    "type": "verb"
  },
  {
    "id": "duo_489",
    "japanese": "ライオン",
    "english": "lion",
    "type": "noun"
  },
  {
    "id": "duo_488",
    "japanese": "とりましょう",
    "english": "we should take",
    "type": "verb"
  },
  {
    "id": "duo_484",
    "japanese": "で",
    "english": "as a, under, through",
    "type": "particle"
  },
  {
    "id": "duo_483",
    "japanese": "見ましょう",
    "english": "let's see, let's view, let's watch",
    "type": "verb"
  },
  {
    "id": "duo_478",
    "japanese": "会います",
    "english": "am going to meet up, (will) meet, (is) meeting",
    "type": "verb"
  },
  {
    "id": "duo_475",
    "japanese": "会いましょう",
    "english": "let's meet, see you",
    "type": "verb"
  },
  {
    "id": "duo_465",
    "japanese": "買い物",
    "english": "shopping",
    "type": "noun"
  },
  {
    "id": "duo_462",
    "japanese": "ストレッチ",
    "english": "stretch",
    "type": "noun"
  },
  {
    "id": "duo_461",
    "japanese": "にはいります",
    "english": "am going to take, take, going to enroll",
    "type": "verb"
  },
  {
    "id": "duo_459",
    "japanese": "せんたく",
    "english": "laundry",
    "type": "noun"
  },
  {
    "id": "duo_457",
    "japanese": "いろいろ",
    "english": "all sorts of",
    "type": "adverb"
  },
  {
    "id": "duo_453",
    "japanese": "何",
    "english": "anything, which, what",
    "type": "pronoun"
  },
  {
    "id": "duo_451",
    "japanese": "かじ",
    "english": "chore",
    "type": "noun"
  },
  {
    "id": "duo_447",
    "japanese": "かえります",
    "english": "am returning, will return home, returning",
    "type": "verb"
  },
  {
    "id": "duo_443",
    "japanese": "ソウル",
    "english": "Seoul",
    "type": "noun"
  },
  {
    "id": "duo_442",
    "japanese": "かんこくご",
    "english": "Korean",
    "type": "noun"
  },
  {
    "id": "duo_434",
    "japanese": "たいわん",
    "english": "Taiwan",
    "type": "noun"
  },
  {
    "id": "duo_432",
    "japanese": "コーチ",
    "english": "coach",
    "type": "noun"
  },
  {
    "id": "duo_429",
    "japanese": "が",
    "english": "(softens the tone), (indicates the subject), but",
    "type": "particle"
  },
  {
    "id": "duo_422",
    "japanese": "ココア",
    "english": "cocoa",
    "type": "noun"
  },
  {
    "id": "duo_419",
    "japanese": "こんばん",
    "english": "this evening, tonight",
    "type": "noun"
  },
  {
    "id": "duo_417",
    "japanese": "くもり",
    "english": "cloudy weather, cloudiness",
    "type": "noun"
  },
  {
    "id": "duo_413",
    "japanese": "はなび",
    "english": "fireworks",
    "type": "noun"
  },
  {
    "id": "duo_407",
    "japanese": "日",
    "english": "day, the sun, (a) day",
    "type": "noun"
  },
  {
    "id": "duo_399",
    "japanese": "くすりを飲みます",
    "english": "take",
    "type": "verb"
  },
  {
    "id": "duo_398",
    "japanese": "休みます",
    "english": "rest, take a break, absent (from)",
    "type": "verb"
  },
  {
    "id": "duo_395",
    "japanese": "ごかぞく",
    "english": "your family, family",
    "type": "noun"
  },
  {
    "id": "duo_391",
    "japanese": "何さい",
    "english": "how old",
    "type": "noun"
  },
  {
    "id": "duo_390",
    "japanese": "〇",
    "english": "0, zero",
    "type": "noun"
  },
  {
    "id": "duo_389",
    "japanese": "九",
    "english": "nine",
    "type": "noun"
  },
  {
    "id": "duo_385",
    "japanese": "けいさつ",
    "english": "police",
    "type": "noun"
  },
  {
    "id": "duo_384",
    "japanese": "あぶない",
    "english": "dangerous",
    "type": "adjective"
  },
  {
    "id": "duo_382",
    "japanese": "すわります",
    "english": "sit, going to sit",
    "type": "verb"
  },
  {
    "id": "duo_372",
    "japanese": "ラーメンや",
    "english": "ramen shop",
    "type": "noun"
  },
  {
    "id": "duo_371",
    "japanese": "ピザや",
    "english": "pizza shop",
    "type": "noun"
  },
  {
    "id": "duo_370",
    "japanese": "はらじゅく",
    "english": "Harajuku",
    "type": "noun"
  },
  {
    "id": "duo_366",
    "japanese": "おてら",
    "english": "temple",
    "type": "noun"
  },
  {
    "id": "duo_364",
    "japanese": "な",
    "english": "do not, (adjective ending), don't",
    "type": "particle"
  },
  {
    "id": "duo_363",
    "japanese": "ところ",
    "english": "place",
    "type": "noun"
  },
  {
    "id": "duo_360",
    "japanese": "しゅうてん",
    "english": "final stop",
    "type": "noun"
  },
  {
    "id": "duo_354",
    "japanese": "十分",
    "english": "sufficient, enough, adequate",
    "type": "counter"
  },
  {
    "id": "duo_352",
    "japanese": "もうすぐ",
    "english": "soon, almost, shortly",
    "type": "adverb"
  },
  {
    "id": "duo_351",
    "japanese": "あさくさ",
    "english": "Asakusa",
    "type": "noun"
  },
  {
    "id": "duo_350",
    "japanese": "うえのこうえん",
    "english": "Ueno Park",
    "type": "noun"
  },
  {
    "id": "duo_344",
    "japanese": "あきはばら",
    "english": "Akihabara",
    "type": "noun"
  },
  {
    "id": "duo_339",
    "japanese": "いつ",
    "english": "when, what time",
    "type": "adverb"
  },
  {
    "id": "duo_338",
    "japanese": "つくえ",
    "english": "desk",
    "type": "noun"
  },
  {
    "id": "duo_336",
    "japanese": "れいぞうこ",
    "english": "fridge",
    "type": "noun"
  },
  {
    "id": "duo_335",
    "japanese": "いす",
    "english": "chair, chairs",
    "type": "noun"
  },
  {
    "id": "duo_334",
    "japanese": "テーブル",
    "english": "table, tables",
    "type": "noun"
  },
  {
    "id": "duo_333",
    "japanese": "でんしレンジ",
    "english": "microwave",
    "type": "noun"
  },
  {
    "id": "duo_332",
    "japanese": "ふとん",
    "english": "futon, futons",
    "type": "noun"
  },
  {
    "id": "duo_328",
    "japanese": "そうじき",
    "english": "vacuum cleaner",
    "type": "noun"
  },
  {
    "id": "duo_316",
    "japanese": "れんあい",
    "english": "romance",
    "type": "noun"
  },
  {
    "id": "duo_315",
    "japanese": "コメディ",
    "english": "comedy",
    "type": "noun"
  },
  {
    "id": "duo_314",
    "japanese": "ほんとうですか",
    "english": "really",
    "type": "phrase"
  },
  {
    "id": "duo_313",
    "japanese": "アクション",
    "english": "action",
    "type": "noun"
  },
  {
    "id": "duo_312",
    "japanese": "アメリカの",
    "english": "... of the US, American, ... of the United States",
    "type": "noun"
  },
  {
    "id": "duo_311",
    "japanese": "どんな",
    "english": "any, what kind of, what (sort of)",
    "type": "other"
  },
  {
    "id": "duo_310",
    "japanese": "ファンタジー",
    "english": "fantasy",
    "type": "noun"
  },
  {
    "id": "duo_309",
    "japanese": "ホラー",
    "english": "horror",
    "type": "noun"
  },
  {
    "id": "duo_308",
    "japanese": "がすきですか",
    "english": "do you like",
    "type": "phrase"
  },
  {
    "id": "duo_306",
    "japanese": "ミステリー",
    "english": "mystery",
    "type": "noun"
  },
  {
    "id": "duo_305",
    "japanese": "Kポップ",
    "english": "K-pop",
    "type": "noun"
  },
  {
    "id": "duo_304",
    "japanese": "日本の",
    "english": "Japan's, of Japan, Japanese",
    "type": "noun"
  },
  {
    "id": "duo_298",
    "japanese": "さんは",
    "english": "Mr./Ms.",
    "type": "noun"
  }
]
```

**Summary by Type:**

- **noun**: 189 words
- **verb**: 37 words
- **counter**: 12 words
- **adjective**: 12 words
- **particle**: 5 words
- **adverb**: 4 words
- **other**: 2 words
- **phrase**: 2 words
- **pronoun**: 1 words


---

## Complete 1060-Word Vocabulary Reference

**Use ONLY these words in your example sentences:**

### Complete Vocabulary (1060 words)

**Organized by Type:**

#### NOUN (683 words)

しょうせつ (novel), バナナ (banana), ブランケット (blanket), リモコン (remote, controller, 
controllers), アラーム (alarms, alarm), ひさしぶりです (long time no see), チーズ (cheese), 
ようじ (stuff to do), じてんしゃ (bike), ゆうがた (evening), 車 (car), さいたま (Saitama), 
はたち (twenty years old), みかん (mandarin oranges), スキー (skiing, ski, skis), 
スノボ (snowboarding), スケート (skating, skate, ice skating), なべ (hot pot), 
さつまいも (sweet potato), だんぼう (heater), 夜 (night, nights, evening), 
すいか (watermelon), さくら (cherry blossoms), こんど (next time), 八千 (eight thousand), 
ポイントカード (rewards card, rewards cards), レジ (register, cash register, 
cash registers), マフラー (scarf), アクセサリー (accessories, jewelry, accessory), 
右 (right), レディース (women's, women), 左 (left), メンズ (men's, men), パーカー (hoodie), 
むらさき (purple), くつした (socks), ジーンズ (jeans), セーター (sweater), クラスメイト (classmates, 
classmate), ふくや (clothing store), えんぴつ (pencil), ショッピングセンター (center), くうき (air), 
ドラッグストア (drugstore), ぎんこう (bank), ゆうびんきょく (post office), スタジアム (stadium), 
アメフト (football), 先生 (teacher, professor, Mr., Miss), 木 (tree, Thursday, wood), 
こうこう (high school), いなか (countryside), れきし (history), 大学 (university, college, 
universities), グッズ (merch), サイン (signature, signatures, autograph), ペン (pen), 
ひがしぐち (east exit), 外 (out, outside), ステージ (stage), まんなか (middle), 
アーティスト (artist), 今夜 (tonight), レシート (receipt, receipts), レジぶくろ (shopping bag, 
shopping bags), でんち (batteries), グレー (gray), ワイヤレス (wireless), ケーブル (cable), 
スピーカー (speakers, speaker), キーボード (keyboard), マウス (mouse), インチ (inches, inch), 
一万 (ten thousand, 10,000), モニター (monitor), 前 (ago, before, front), 
ゲーミング (gaming), 今日 (today), おさら (plate), ナイフ (knife), おもちゃ (toy), 
でんきや (electronics store), ヘッドホン (headphones), 六百 (six hundred), カップ (cup), 
フォーク (fork), 百円ショップ (hundred yen shop), ポテトチップス (chips, potato chips), 
とちゅうで (on the way), みち (path, road, street), フライドチキン (fried chicken), 円 (circle, 
yen), 家 (house, home, homes), いとこ ((my) cousin, (my) cousins), タイご (Thai), 
ぞう (elephant), タイ (Thailand, Thai), 来週 (next week), ピーナッツ (peanuts, (a) peanut), 
明日 (tomorrow), すいぞくかん (aquarium), ちば (Chiba), きのう (yesterday), クレープ (crepe), 
先週 (last week), ぎんざ (Ginza), ぶんか (culture), 先月 (last month), きょねん (last year), 
かぶき (kabuki, kabuki performance, Kabuki performances), トースト (toast), 
コーヒーメーカー (coffee maker), チェックアウト (check-out), ぎゅうにゅう (milk), タオル (towel), 
うしろ (behind), スパ (spa, spas), パスワード (password), ルームサービス (room service), 
こおり (ice), まえ (front), ばんごう (number), クレジットカード (credit card), となり (next door, 
next to, neighboring), チェックイン (check-in), かぎ (key), ネット (internet), 
ぎょうざ (fried dumpling, fried dumplings), おつり (change), かいけい (cashier), 
えび (shrimp), てんいん (salesperson, waiter), ナプキン (napkin), マーボーどうふ (mapo tofu), 
はし (bridges, chopsticks, bridge), スープ (soup), ウーロンちゃ (oolong tea), 
なんめいさま (how many people), メニュー (menu), タピオカティー (bubble tea), ちゅうかがい (Chinatown), 
ちゅうかりょうり (Chinese food), シーフード (seafood), ぎゅうにく (beef), こしょう (pepper), 
そと (outside, outdoors), けしき (view), 川 ((the) river, (the) rivers, rivers), 
雨 (rain), ピクニック (picnic), バーベキュー (barbecue), キャンプ (camping), ハイキング (hiking), 
バックパック (backpack), ほっかいどう (Hokkaido), すみ (corner), カメレオン (chameleon), 
なんびき (how many), へや (room), 口 (mouths, (a) mouth, tastes), トマト (tomato, tomatoes, 
(a) tomato), みみ (ear), いぬ (dog), ハムスター (hamster), ちゃいろ (brown), パンケーキ (pancake), 
め (eye), カプチーノ (cappuccinos, (a) cappuccino), どうぶつ (animal), ねこ (cat), 
チェス (chess), ボランティア (volunteer), サークル (club, clubs), ボードゲーム (board game), 
キャンパス (campus), ルームメイト (roommate, roommates), りょう (dorm), 駅 (station, 
train station, stations), タガログご (Tagalog), ドイツご (German), げんご (language, 
languages), ドイツ (Germany, German), フィリピン (the Philippines), すうがく (math), 
ビジネス (business), せんこう (major), サム (Sam), かい (are you, will you, buy), 
何年生 (what school year), みなみぐち (south exit), 飲み物 (beverage, drink, drinks), 
ツアー (tour), インフォメーション (information desk), 八百 (800), エスカレーター (escalator), 
きたぐち (north exit), 三ばん (number three), かいそく (rapid-service), 二ばん (number two), 
オレンジ (orange), 一ばん (number one), きっぷうりば (ticket area), モノレール (monorail), 三百 (300, 
three hundred), うた (song), ワイン (wine), ステーキ (steak), かんとく (director), 
ポップコーン (popcorn), えいがかん (movie theater), ホットドッグ (hot dog), ブラウス (blouse), 
スーツ (suit), うでどけい (watch), ネックレス (necklace), プレゼント (present), たんじょうび (birthday), 
人 (people, human, someone), デート (date), カウントダウン (countdown), クリスマス (Christmas), 
おおみそか (New Year's Eve), イルミネーション (lights display), パレード (parade), 
ハロウィン (Halloween), パーティー (party), ダンス (dance), コミュニティーセンター (community center, 
Community center), コンテスト (contest), たいこ (taiko drum), 
チョコバナナ (chocolate covered bananas, chocolate covered banana), 食べ物 (food), 
おまつり (festival), はなびたいかい (fireworks display), こんしゅうまつ (this weekend), きじ (post), 
ブログ (blog), ファッション (fashion), バレエ (ballet), レッスン (lesson), パフォーマンス (performance), 
こんや (tonight), かんじ (kanji, Chinese character, Chinese characters), 
ひらがな (hiragana), ピアノ (piano), がっき (instrument), ギター ((a) guitar, (the) guitars, 
(the) guitar), 何時間 (how many hours), れんしゅう (practice), バドミントン (badminton), 
しあい (game), バー (bar), カラオケ (karaoke), さいご (last), クライアント (client), 
プレゼン (presentation), パソコン (computer), ひる休み (lunch break), しょくどう (cafeteria), 
チャーハン (fried rice), フライドポテト (french fries), トレーニング (job training), 
プリンター (printer), ミーティング (meeting), うけつけ (front desk), 何階 (which floor), 
ドキュメンタリー (documentary), ポスター (poster), はいゆう (actor), カードゲーム (card game), 
パズル (puzzle), バンド (band), アニソン (anime music), アルバム (album), ポップス (pop), 
ノンフィクション (non-fiction), フィクション (fiction), 話 (talking, conversation, chat), 
本や (bookstore), セール (sale), コーナー (section), チョコミント (mint chocolate chip), 
あじ (flavor), バニラ (vanilla), かお (face), ショー (show), キャラクター (mascot), 
ゴーカート (go-kart), ジェットコースター (rollercoaster), アトラクション (attraction), 
おとな ((the) adult, (the) adults, (an) adult), 三千 (3,000), 
にゅうじょうりょう (admission fee), いりぐち (entrance), ごご (afternoon, p.m., p.m), 
はくぶつかん (museum), ゆうえんち (theme park), ジム (gym), せんしゅ (athlete, athletes, player), 
チーム (team), しゃしんか (photographer), カメラ (camera), イベント (event), ごぜん (a.m., 
morning), ナビ (GPS), うんてんしゅ (driver), ほんやくか (translator), としょかん (library), 
じしょ (dictionary), マネージャー (manager), かいしゃ (company), どうりょう (coworker), 
水曜日 (Wednesday, Wednesdays), プロジェクト (project), しめきり (deadline), 火曜日 (Tuesday, 
Tuesdays), しつもん (question), テスト (test), 何曜日 (what day), スミス (Smith), 山田 (Yamada), 
じゅぎょう (class), スペインご (Spanish), きょうしつ (classroom), ぶたにく (pork), コーラ (cola), 
ビール (beer), とんかつ (pork cutlet), しお (salt), ソース (sauce), なま (raw), 
とうふ ((the) tofu, bean curd, tofu), 魚 (fish), ぎゅうどん (beef bowl), やさい (vegetable), 
しょうゆ (soy sauce), スーパー (supermarket), 卵 (egg, eggs), 木曜日 (Thursday, Thursdays), 
パイ (pie, pies), チョコレート (chocolate, chocolates), ドーナツ (donut), いちご (strawberry, 
strawberries), クッキー (cookies, cookie), まっちゃ (matcha), みどり (green), 
カップケーキ (cupcake), チーズケーキ (cheesecake), おかしや (pastry shop), ケーキや (cake shop), 
もの (stuff), 月曜日 (Monday), みそかつ (miso pork cutlet), にわ (garden), 
かんこう (sightseeing), しろ (castle), せき (seat), しんかんせん (bullet train), なごや (Nagoya), 
日本りょうり (Japanese food), 金曜日 (Friday, Fridays), お母さん (mom, mother, (your) mom), 
すしや (sushi restaurant), ロビー ((the) lobby), りょうしん (parents), お父さん (dad, 
(your) dad, (your) father), にく (meat), フランスりょうり (French food), どうぶつえん (zoo), 
ライオン (lion), ひろば (plaza), しゃしん (photo), え (painting), びじゅつかん (art museum), 
チケット (ticket, tickets), スーツケース (suitcase), ひこうき (plane), りょこう (trip), 
フランス (French, France), 来月 (next month), 休みの日 (day off), ガーデニング (gardening), 
りょうり (cuisine, dish, food), 買い物 (shopping), ストレッチ (stretch), おふろ (bath), 
せんたく (laundry), そうじ (cleaning, clean), しゅくだい (homework), がっこう (school), 
かじ (chore), あと (after), しごと (work), うち (we, (my) house, home), こども (kid, 
(the) child, (the) children), おこさん (kid, kids), ソウル (Seoul), かんこくご (Korean), 
マレーシア (Malaysia), えいご (English), おにいさん (big brother, older brothers, 
older brother), いもうとさん (younger sister), ちゅうごくご (Chinese), たいわん (Taiwan), 
日本ご (Japanese), コーチ (coach), オーストラリア (Australia, Australian), おねえさん (big sister, 
big sisters, older sisters), きょうだい (sibling), おとうとさん (younger brother), 
ゆき (snow), ココア (cocoa), おんせん (hot spring), ふゆ (winter), こんばん (this evening, 
tonight), くもり (cloudy weather, cloudiness), コンサート (concert, concerts), あき (fall), 
休み (break), はなび (fireworks), プール (swimming pools, pools, pool), 
はれ (clear weather, sunny), なつ (summer), 日 (day, the sun, (a) day), うみ (beach), 
こうえん (park, performance, parks), はる (spring), あめ (rain), てんき (weather), 
きょう (today), ちかく (nearby), ごかぞく (your family, family), アレルギー (allergy), 
ごりょうしん ((your) parents, parents), でんわばんごう (phone number), 何さい (how old), 〇 (0, 
zero), 九 (nine), きゅうきゅうしゃ (ambulance), びょういん (hospital), けいさつ (police), 
おみやげ (souvenir), おかし (snack), ポストカード (postcard), ふじさん (Mt. Fuji), 山 (mountain, 
mount, mountains), じんじゃ (shrine), ラーメンや (ramen shop), ピザや (pizza shop), 
はらじゅく (Harajuku), デザート (dessert), おてら (temple), たてもの (building), ところ (place), 
しゅうてん (final stop), 時間 (time, hour, hours), 分 (minute, minutes), ぐらい (about), 
あさくさ (Asakusa), うえのこうえん (Ueno Park), つぎ (next), よこはま (Yokohama), バス (bus), 
あきはばら (Akihabara), しぶや (Shibuya), でんしゃ (train), こんしゅう (this week), つくえ (desk), 
せんたくき (washing machine), れいぞうこ (fridge), いす (chair, chairs), テーブル (table, 
tables), でんしレンジ (microwave), ふとん (futon, futons), ほんだな (bookshelf), シャワー (shower, 
showers), そうじき (vacuum cleaner), エアコン (air conditioning, air conditioners, 
air conditioner), ベッド (bed, beds), リビング (living room), キッチン (kitchen), 
アパート (apartment building, apartment, apartments), いえ (house), れんあい (romance), 
コメディ (comedy), アクション (action), アメリカの (... of the US, American, 
... of the United States), ファンタジー (fantasy), ホラー (horror), ミステリー (mystery), 
Kポップ (K-pop), 日本の (Japan's, of Japan, Japanese), ベトナム (Vietnam), かんこく (Korea, 
korean), ちゅうごく (China), さんは (Mr./Ms.), かれし (boyfriend), アンドリュー (Andrew), 
エリカ (Erica, Erika), ダニエル (Daniel), パスタ (pasta), あした (tomorrow), 
らいしゅう (next week), バレーボール (volleyball), まいしゅう (every week), 何時に ((at) what time), 
新聞 (newspaper), ラジオ (radio), 何時 (when, what time), でぐち (exit), 
じはんき (vending machines, vending machine), コインロッカー (storage lockers), カフェ (cafe), 
かいだん (stairs), コンセント (outlet), でんわ (phone), ちか (underground level), タクシー (taxi), 
エレベーター (elevator), おてあらい (restroom), wifi (wifi), ゴミばこ (trash can), 
のりかえ (transfer), かいさつ (ticket gate), いっかい (first floor), ホーム (platform), 
どうが (video), じゅうどう (judo), テニス (tennis), 日曜日 (Sunday), ゲーム (video games), 
からて (karate), 土曜日 (Saturday, Saturdays), スポーツ (sports), ヨガ (yoga), ともだち (friend, 
friends), ドラマ (drama), しゅうまつ (weekend), アイスコーヒー (iced coffee), 
アイスクリーム (ice cream, ice creams), こうちゃ (black teas, black tea, tea), 
みそしる (miso soup), サラダ (salad, salads), そば (soba), おにぎり (rice balls, rice ball, 
onigiri), 水 (water, waters), レストラン (restaurant), ていしょく (meal set, meal sets), 
うどん (udon), てんぷら (tempura), ジャケット (jacket), みせ (store), 千 (thousand), 
いくら (how much), ネクタイ (tie, necktie, ties), えん (yen), 百 (hundred), ドレス (dress), 
スカート (skirt), Tシャツ (t-shirt), ふく (clothes), さいふ (wallet), ばんごはん (dinner), 
まいばん (every night), 半 (thirty), 八 (eight), べんとう (boxed lunch), ひるごはん (lunch), 
十二 (twelve), 十 (ten), 十一 (eleven), あさごはん (breakfast), 時 (o'clock), コーヒー (coffee), 
まいあさ (every morning), ジュース (juice), まいにち (every day), パン (bread), 
サンドイッチ (sandwich), Jポップ (J-pop), まんが (manga), アニメ (anime), やきゅう (baseball), 
ざっし (magazines), 本 (books), ニュース (news), おんがく (music), ロック (rock), ジャズ (jazz), 
サッカー (soccer), バスケットボール (basketball), えいが (movies), テレビ (TV), おっと (my husband), 
七 (7, seven, seventh), むすこ (my son), むすめ (my daughter), 六 (six), つま (my wife), 
だいがくせい (college student), かんごし (nurse), おとうと (my younger brother), 五 (5, five), 
あに (my older brother), かいしゃいん (office worker), あね (my older sister), 四 (four), 
いもうと (my younger sister), さい (years old), エンジニア (engineer), 父 (dad), 
かぞく (family), 母 (mom, mother, my mom), まち (town, city), トロント (Toronto), 
とし (years, cities, city), 日本 (Japan, Japanese), おおさか (Osaka), 京都 (Kyoto), 
ニューヨーク (New York), しゅっしん (from, origin, hometown), 東京 (Tokyo), 
おなまえは (what's your name), かばん (bag), 中山 (Nakayama), 田中 (Tanaka), 山口 (Yamaguchi), 
パスポート (passport), スマホ (smartphone), ちず (map), きっぷ (ticket), ちかてつ (subway), 
くうこう (airport), はん (thirty), ごろ (around, about), いま (now, current), 一 (one, an, 
a), 二 (two, 2), なんじ (what time), 三 (3, three, third), じ (o'clock), いち (one, an), 
やまぐち (Yamaguchi), たなか (Tanaka), なかやま (Nakayama), くつ (shoes, shoe), コート (coat), 
わたしの (my, mine), かさ (umbrella, umbrellas), ぼうし (hat, hats), だいがく (university, 
college), えき (station, train station, stations), デパート (department store), 
バスてい (bus stop), ホテル (hotel), コンビニ (convenience store), ブラジルじん (Brazilian), 
イギリスじん (British), ブラジル (Brazil), イギリス (Britain, the United Kingdom, British), 
にほんじん (Japanese), カナダ (Canada), アメリカじん (American), カナダじん (Canadian), 
アメリカ (America, the USA, the US), にほん (Japan), ケーキ (cake), ピザ (pizza), 
ラーメン (ramen), カレー (curry), さん (Mr., Miss, Mrs.), なおみ (Naomi), はな (flowers, 
flower, Hana), けん (Ken, ticket), がくせい (student, students), ひと (person, people), 
べんごし (lawyer, lawyers), せんせい (teacher, Professor, teachers), いしゃ (doctor, 
doctors), みず (water), ごはん (rice, meal, meals), すし (sushi), おちゃ (green teas, 
green tea, tea)

#### VERB (143 words)

あそびたいです (want to play), したいです (want to do, want to play), 
したくないです (don't want to do), キャンセルします (going to cancel), 
会いたくないです (don't want to see, don't want to meet), ねました (went to sleep, slept), 
ゆっくりしたいです (want to relax), 行きたくないです (do not want to go), 食べたいです (want to eat), 
ねたいです (want to sleep), でたくないです (don't want to get out), 
おきたくないです (don't want to get up), かたづけます ((will) clean up, going to tidy up), 
帰ります (am going home, goes home, am going back), になります (will be, becomes, become), 
つけます (put on, turns on, turn on), さきます (bloom, blooms, will bloom), 住んでいます (live, 
lives), まがります (turn, turns), 上がります (go up), しまります (close, closes), 
そつぎょうします (graduate), はいります (enter, join, go in), つかれました (was tired, am tired, 
is tired), 買いたいです (want to buy), 話したいです (want to talk), 
ならびます ((will) wait in line, (will) form a line, (will) queue), 
飲みたいです (want to drink), ききたいです (want to hear), もどります (will return, return), 
すわりたい (want to sit), でかけたいです (want to go out), 行きたいです (would like to go, 
want to go, wants to go), 会いたいです (want to meet), ひかります (lights up), 
きります (going to cut), あるきます (walk, walking, am walking), わたります (cross), 
れんしゅうしました (practiced), 見つけました (found, caught), あそびました (played), 行きました (went, 
(I) went), 食べました (ate, (I) ate, had), 見ました (watched, saw, looked at), 
来ました (have come, came, has arrived), とまりませんか (Shall we not stay), 
さがします (will look for, am going to look for), あきます (opens, open), やきます (bake, 
am going to bake, grill), たのしみます (going to enjoy), よびます ((will) call, calls, 
going to call), ゆっくりします (going to relax), はらいます (pay, going to pay, will pay), 
のりかえます (switching, going to transfer, are switching), おります ((we) are, 
(will) get off, getting off), のります (take, ride, getting on), 
よやくします (am going to reserve, book, will reserve), きます (wears, wear, comes), 
食べませんか (do you want to eat, won't you eat, would you like to eat), 
あそびませんか (play), 行きませんか (do you want to go, would you like to go, 
why don't we go), 作ります (going to make, make, (I) make), 書きます (will write), 
おどります (dance, going to dance), はじまります (is starting, starts, begins), 
べんきょうします (study, will study, studies), ひきます (play (instrument), pull, look up), 
うたいます (sing, will sing, am going to sing), 見ません (does not see, do not watch, 
does not look at), しません (do not, will not, does not), 
ききません (don't really listen to), 読みません (does not read, do not read, 
(never) reads), 見ましょうか (should we see), でかけましょう (we should go out), 
うんどうします (exercise, am going to exercise), りょこうします (travel, travels), とります (takes, 
get, going to take), うんてんします (drive), あらいます (wash, going to wash, washes), 
ほんやくします (translate), つかいます (will use, uses), しごとします (work), 
ききましょう (we should ask), おわります (ends, end), ききましょうか (should we ask), あります (is, 
(they) are, have), 飲みません ((I) won't drink, don't take, (I) do not drink), 
つかいましょう (we should use), 食べません (don't eat, do not eat, will not eat), 
つくりましょう (we should make), つくりましょうか (shall I make, should we make, should I make), 
買いましょうか (should we buy), 行きましょうか (should we go, would you like to go), 
まちます (wait for), にのります (get on, going to ride, take), 食べましょう (we should eat), 
かえりましょう (we should return), 休みましょう (we should rest), とりましょう (we should take), 
見ましょう (let's see, let's view, let's watch), 飲みましょう (let's have, let's drink), 
買いましょう (we should buy, let's buy), 会います (am going to meet up, (will) meet, 
(is) meeting), 会いましょう (let's meet, see you), 行きましょう (let's go), 
しましょうか (shall (we), should (we)), にはいります (am going to take, take, 
going to enroll), てつだいます (help), かえります (am returning, will return home, 
returning), います (is, am, has been), はいますか (do ... have), くすりを飲みます (take), 
休みます (rest, take a break, absent (from)), すわります (sit, going to sit), かかります (take, 
(it) takes, (it) will take), 来ます (will be here, will come, is coming), 
行きます (am going, are going, go), があります (is, there is, there are), 
ひっこします (am going to move, is going to move, move), と言います (tell, say, says), 
言います (tell, tells, say), はしります (runs, run), 飲みます (will have, drink, having), 
ねます (sleep, go to sleep, will go to sleep), シャワーをあびます (take a shower), 
メールを読みます (check emails), つくります (make), 食べます (eat, am going to eat, will eat), 
おきます (get up, going to wake up, wake up), ありません (there are no, (it) is not, 
has nothing), ありますか (is (there), is (it), are (there)), 話します (speaks, speak, 
tells), でかけます (go out, am going to go out), 買います (will buy), あそびます (hang out, 
hangs out, (I) will play), およぎます (swim, will swim, swims), のみます (drink, drinks, 
(will) drink), たべます (eat, eats), 読みます (read, will read, reads), ききます (listen, 
listens, ask), します (makes, are doing, make), 見ます (watch, will watch, watches), 
にすんでいます (is living)

#### ADJECTIVE (79 words)

いたいです (hurts, painful, it hurts), ねむい (sleepy), いそがしくない (not busy), 
とおくない (not far), たのしくない (aren't fun), くらくない (not dark), さむくない (not cold, 
not very cold), あつくない (not hot, not very hot), キラキラ (sparkle, glisten, sparkly), 
ふわふわ (fluffy), ボロボロ (worn-out), ふべん (inconvenient), しんせつ (nice, kind), 
おもい (heavy), かるい (light, lightweight), 安い (inexpensive, cheap, cheaper), 
むりょう (free), おおい (a lot of, large, a lot), からい (spicy), つめたい (cold), すずしい (cool), 
くらい (dark), カラフルな (colorful), にんき (popular), げんき (well, lively, fine), 
むずかしい (difficult), きいろい (yellow), すきな (favorite), こわい (scary), つまらない (boring), 
プロの (professional, pro), しょっぱい (salty), ひま (available, bored, free), あまい (sweet), 
みじかい (short), べんり (convenient), たのしい (fun), たいへん (tough, very, hard), さむい (cold), 
あつい (hot, thick), あたたかい (warm), あぶない (dangerous), だいじょうぶ (OK), 高い (tall), 
ながい (long), はやい (fast), せまい (cramped), ひろい (spacious), ちかい (close), とおい (far), 
小さい (small, little), 大きい (big), たかい (expensive, big, tall), くろい (black), 
やすい (cheap, inexpensive), あおい (blue), いい (good, like, well), すてき (lovely, nice, 
cute), 新しい (new, newer), ダサい (hideous), 古い (old), あたまがいい (smart), 
おしゃれ (fashionable, stylish, well-dressed), ゆうめい (famous), うるさい (noisy), 
いそがしい (busy), きれい (clean), しずか (quiet), にぎやか (lively), おもしろい (interesting, fun, 
funny), かわいい (cuter, cute, pretty), あかるい (bright, cheerful, well-lit), 
しろい (white), あかい (red), ちいさい (small, little), おおきい (big, large), おいしい (good, 
delicious, tasty), かっこいい (cool, good-looking, stylish), やさしい (kind, easy, nice)

#### COUNTER (53 words)

四日 (fourth, four days, 4th), 三月 (March), 二月 (February), 一月 (January), 四月 (April), 
万 (ten thousand), 四階 (fourth floor), 三階 (third floor), 三日 (third, three days), 
二日 (two days, second, 2), 七つ (seven (things), seven), 六つ (six (things), six), 
五つ (five (things), five), 二人 (two people, they, two), 四人 (four), 一日 (one day, 
first, a day), 五月 (May), よんひき (four), さんびき (three), にひき (two animals), 
いっぴき (one), 四年生 (senior, seniors), 三年生 (third grade student, junior), 
二年生 (sophomore), 一年生 (freshman), 十二月 (December), 十月 (October), 
三十一日 (thirty-first), 八月 (August), 九時間 (nine hours), 四時間 (for four hours), 
二階 (the second floor), 一階 (street level), ななつ (seven), むっつ (six), いつつ (five), 
四つ (four (things), four), 二つ (two), 三つ (three), 一つ (one (thing), one), ひとり (one), 
ふたり (two), 九月 (September, (in) September), 七月 (July), 十分 (sufficient, enough, 
adequate), 四時 (four o'clock), にかい (the second floor, two), よっつ (four), 
みっつ (three), ふたつ (two), ひとつ (one), 九時 (nine o'clock), 七時 (seven o'clock)

#### ADVERB (32 words)

後で (later, after, afterwards), もうすこし (more, a bit longer), 今 (this, now, just), 
そろそろ (soon, shortly, in a bit), さいきん (recently), 前に (previously, ago, 
in front of), まず (first, first of all), まっすぐ (straight), また (again, back, 
see you ...), もう (yet, now, already), どうやって (how), はじめて (for the first time), 
ぜんぶで (in total), あまり ((not) a lot of, (not) so, (not) too), はやく (fast, early, 
quickly), たくさん (a lot of), もっと (more), いっしょに (together), いろいろ (all sorts of), 
ちゃんと (proper, properly, full), ほんとうに (really, truly), もうすぐ (soon, almost, 
shortly), いつ (when, what time), たぶん (probably), まだ (still, yet, too), 
いつも (always, all the time), ひとりで (by myself, by herself, alone), すこし (a bit), 
ときどき (sometimes), よく (often), とても (very), どう (how (about), what, how)

#### PHRASE (30 words)

いらっしゃいませ (welcome), がいいです (sounds good, sound good), 
よろしくおねがいします (nice to meet you, glad to work with you), がだいすきです (love, loves), 
はすきですか (do ... like), がたのしみです (looking forward to, am looking forward to), 
ができます (know, can play), おねがいします (please, I need ... please), ぐあいがわるい (unwell), 
どうですか (how are things, why don't, how is), 何ですか (what (is), what are, what's), 
ほんとうですか (really), がすきですか (do you like), しゅみはありますか (do you have a hobby), 
がすきです (like), じゃあ (well then, well, see you), ありがとうございます (thank you), 
がほしいです (want), はちょっと (I don't really like, doesn't work very well, kind of), 
ようこそ (welcome), おはようございます (good morning), はじめまして (nice to meet you, 
how do you do), じゃないです (is not, we're not, aren't), すみません (excuse me), 
またあした (see you tomorrow), じゃあね (bye), こんばんは (tonight, good evening, 
this evening), どうぞよろしく (nice to meet you), こんにちは (hello, hi), ください (please)

#### PRONOUN (14 words)

だれ (who), 何 (anything, which, what), あれ (hey, that (one) (over there), what), 
かのじょ (she, girlfriend, her), こちら (this, these, (over) here), あそこ (over there), 
私 (I), それら (they, them, those), これら (these), そこ (there), ここ (here), どこ (where), 
それ (that (one), it, that), これ (this (one), these, this)

#### PARTICLE (13 words)

まで (through, even, before), から (because, starting, through), で (as a, under, 
through), が ((softens the tone), (indicates the subject), but), な (do not, 
(adjective ending), don't), ね (isn't it?), を (through, with, for), も (even, any, 
also), の (for, 's, one), に (to, in, as (a)), か (or, is it?, that), は (is, with, 
regarding), と (and, that, door)

#### OTHER (13 words)

でも (but, however, neither), そして (then), どの (any, each, which), つぎの (next), 
どんな (any, what kind of, what (sort of)), ええと (um), あ (ah, oh), あの (those, ah, 
that (over there)), その (the, that, its), この (this, these), いいえ (no), はい (yes), 
です (there is, it's, I'm)



---

## Instructions

1. Generate 2-3 example sentences for each of the 264 words listed above
2. Ensure examples use ONLY vocabulary from the 1060-word list
3. Follow the distribution: 15% simple, 60% intermediate, 25% advanced
4. Use diverse grammar elements (particles, pronouns, time, counters, etc.)
5. Make sentences natural and useful for learning
6. Provide output in the JSON format specified above

## Quality Checklist

Before submitting, verify:
- ✅ Every example uses ONLY words from the 1060-word vocabulary
- ✅ Distribution is approximately 15%/60%/25% (simple/intermediate/advanced)
- ✅ Examples include variety: particles, pronouns, time, adverbs, adjectives, counters
- ✅ Each word has 2-3 examples minimum
- ✅ JSON format is correct with all required fields
- ✅ Context (statement/question/answer) is appropriate
- ✅ Level notation (1-X, 2-X, 3-X) matches complexity

---

**Please generate the examples now. You can process them in batches if needed.**
