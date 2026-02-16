# Prompt for Claude AI - Add Examples to 173 Words

## Task

Add **additional example sentences** for **173 Japanese vocabulary words** that currently have fewer than 3 examples. Each word should end up with **exactly 3 examples total**.

## Important Notes

### Current State
- Some words have **1 example** (need 2 more)
- Some words have **2 examples** (need 1 more)
- Some words have **0 examples** (need 3)

**You must ADD examples to reach a total of 3 per word, NOT replace existing ones.**

### Vocabulary Restriction
**CRITICAL:** Use ONLY words from the provided 1060-word vocabulary list when creating example sentences. Do not use any Japanese words outside this list.

### Example Distribution (for NEW examples being added)
- **15% Simple** (1 level, basic grammar, single clause)
- **60% Intermediate** (2 levels, natural sentences, 2-3 grammar points)
- **25% Advanced** (3 levels, multiple vocab from the 1060 list, complex patterns)

### Diversity Requirements
Please use a variety of grammar elements in your examples:
- **Particles**: は, が, を, に, で, と, の, から, まで, etc.
- **Pronouns**: 私, あなた, これ, それ, あれ, だれ, 何, etc.
- **Time expressions**: 今, 今日, 明日, 昨日, 先週, 来月, etc.
- **Adverbs**: よく, とても, また, もう, いつも, etc.
- **Adjectives**: 大きい, 小さい, 新しい, 古い, きれい, etc.
- **Counters**: 一つ, 二つ, 三人, 四日, 五月, etc.
- **Verbs in different forms**: ます, ました, たい, ません, etc.

### Output Format

For each word, provide the **ADDITIONAL** examples needed in this JSON structure:

```json
{
  "updatedWords": [
    {
      "id": "duo_XXXX",
      "japanese": "word",
      "english": "translation",
      "type": "category",
      "currentExamples": 1,
      "newExampleSentences": [
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

**Important:**
- `currentExamples`: How many examples the word currently has
- `newExampleSentences`: Array of NEW examples to add (should contain 2 examples if currentExamples=1, or 1 example if currentExamples=2)

**Level notation:**
- `1-X` = Simple (beginner-friendly, 1-2 grammar points)
- `2-X` = Intermediate (natural, 2-3 grammar points)
- `3-X` = Advanced (complex, uses multiple vocab words from the list)

**Context types:**
- `statement` - Declarative sentence
- `question` - Interrogative sentence
- `answer` - Response to a question

---

## Words Needing Additional Examples (173 words)

### List of 173 Words (Need Additional Examples)

```json
[
  {
    "id": "duo_1057",
    "japanese": "したいです",
    "english": "want to do, want to play",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_1056",
    "japanese": "したくないです",
    "english": "don't want to do",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_1049",
    "japanese": "ゆっくりしたいです",
    "english": "want to relax",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_1043",
    "japanese": "でたくないです",
    "english": "don't want to get out",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_1039",
    "japanese": "おきたくないです",
    "english": "don't want to get up",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_1037",
    "japanese": "そろそろ",
    "english": "soon, shortly, in a bit",
    "type": "adverb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_1034",
    "japanese": "ひさしぶりです",
    "english": "long time no see",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_1031",
    "japanese": "さいきん",
    "english": "recently",
    "type": "adverb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_1016",
    "japanese": "スノボ",
    "english": "snowboarding",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_1009",
    "japanese": "さむくない",
    "english": "not cold, not very cold",
    "type": "adjective",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_1007",
    "japanese": "あつくない",
    "english": "not hot, not very hot",
    "type": "adjective",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_997",
    "japanese": "ポイントカード",
    "english": "rewards card, rewards cards",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_996",
    "japanese": "レジ",
    "english": "register, cash register, cash registers",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_990",
    "japanese": "レディース",
    "english": "women's, women",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_987",
    "japanese": "上がります",
    "english": "go up",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_985",
    "japanese": "まず",
    "english": "first, first of all",
    "type": "adverb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_979",
    "japanese": "ジーンズ",
    "english": "jeans",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_974",
    "japanese": "ショッピングセンター",
    "english": "center",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_959",
    "japanese": "大学",
    "english": "university, college, universities",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_945",
    "japanese": "ききたいです",
    "english": "want to hear",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_942",
    "japanese": "ステージ",
    "english": "stage",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_940",
    "japanese": "すわりたい",
    "english": "want to sit",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_934",
    "japanese": "レシート",
    "english": "receipt, receipts",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_929",
    "japanese": "ワイヤレス",
    "english": "wireless",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_923",
    "japanese": "マウス",
    "english": "mouse",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_918",
    "japanese": "モニター",
    "english": "monitor",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_901",
    "japanese": "どうやって",
    "english": "how",
    "type": "adverb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_900",
    "japanese": "とちゅうで",
    "english": "on the way",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_860",
    "japanese": "三階",
    "english": "third floor",
    "type": "counter",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_856",
    "japanese": "ばんごう",
    "english": "number",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_855",
    "japanese": "クレジットカード",
    "english": "credit card",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_853",
    "japanese": "チェックイン",
    "english": "check-in",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_846",
    "japanese": "ぎょうざ",
    "english": "fried dumpling, fried dumplings",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_830",
    "japanese": "ウーロンちゃ",
    "english": "oolong tea",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_828",
    "japanese": "なんめいさま",
    "english": "how many people",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_814",
    "japanese": "けしき",
    "english": "view",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_808",
    "japanese": "バーベキュー",
    "english": "barbecue",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_798",
    "japanese": "よんひき",
    "english": "four",
    "type": "counter",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_795",
    "japanese": "さんびき",
    "english": "three",
    "type": "counter",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_788",
    "japanese": "ハムスター",
    "english": "hamster",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_782",
    "japanese": "にんき",
    "english": "popular",
    "type": "adjective",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_781",
    "japanese": "どうぶつ",
    "english": "animal",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_778",
    "japanese": "ボランティア",
    "english": "volunteer",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_777",
    "japanese": "サークル",
    "english": "club, clubs",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_766",
    "japanese": "すうがく",
    "english": "math",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_757",
    "japanese": "何年生",
    "english": "what school year",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_747",
    "japanese": "きたぐち",
    "english": "north exit",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_727",
    "japanese": "ブラウス",
    "english": "blouse",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_718",
    "japanese": "デート",
    "english": "date",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_715",
    "japanese": "おおみそか",
    "english": "New Year's Eve",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_711",
    "japanese": "ハロウィン",
    "english": "Halloween",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_708",
    "japanese": "三十一日",
    "english": "thirty-first",
    "type": "counter",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_705",
    "japanese": "コンテスト",
    "english": "contest",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_704",
    "japanese": "たいこ",
    "english": "taiko drum",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_692",
    "japanese": "ファッション",
    "english": "fashion",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_688",
    "japanese": "レッスン",
    "english": "lesson",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_684",
    "japanese": "こんや",
    "english": "tonight",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_682",
    "japanese": "ひらがな",
    "english": "hiragana",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_672",
    "japanese": "しあい",
    "english": "game",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_669",
    "japanese": "カラオケ",
    "english": "karaoke",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_653",
    "japanese": "一階",
    "english": "street level",
    "type": "counter",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_650",
    "japanese": "何階",
    "english": "which floor",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_641",
    "japanese": "バンド",
    "english": "band",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_640",
    "japanese": "アニソン",
    "english": "anime music",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_639",
    "japanese": "アルバム",
    "english": "album",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_635",
    "japanese": "読みません",
    "english": "does not read, do not read, (never) reads",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_631",
    "japanese": "本や",
    "english": "bookstore",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_630",
    "japanese": "セール",
    "english": "sale",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_622",
    "japanese": "キャラクター",
    "english": "mascot",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_619",
    "japanese": "ジェットコースター",
    "english": "rollercoaster",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_613",
    "japanese": "にゅうじょうりょう",
    "english": "admission fee",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_611",
    "japanese": "ごご",
    "english": "afternoon, p.m., p.m",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_607",
    "japanese": "でかけましょう",
    "english": "we should go out",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_601",
    "japanese": "しゃしんか",
    "english": "photographer",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_575",
    "japanese": "ききましょうか",
    "english": "should we ask",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_550",
    "japanese": "食べません",
    "english": "don't eat, do not eat, will not eat",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_540",
    "japanese": "つくりましょう",
    "english": "we should make",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_536",
    "japanese": "パイ",
    "english": "pie, pies",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_533",
    "japanese": "ドーナツ",
    "english": "donut",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_528",
    "japanese": "まっちゃ",
    "english": "matcha",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_524",
    "japanese": "チーズケーキ",
    "english": "cheesecake",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_523",
    "japanese": "買いましょうか",
    "english": "should we buy",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_522",
    "japanese": "おかしや",
    "english": "pastry shop",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_517",
    "japanese": "行きましょうか",
    "english": "should we go, would you like to go",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_514",
    "japanese": "がたのしみです",
    "english": "looking forward to, am looking forward to",
    "type": "phrase",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_498",
    "japanese": "ロビー",
    "english": "(the) lobby",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_490",
    "japanese": "どうぶつえん",
    "english": "zoo",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_481",
    "japanese": "飲みましょう",
    "english": "let's have, let's drink",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_468",
    "japanese": "ガーデニング",
    "english": "gardening",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_464",
    "japanese": "そして",
    "english": "then",
    "type": "other",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_456",
    "japanese": "そうじ",
    "english": "cleaning, clean",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_455",
    "japanese": "てつだいます",
    "english": "help",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_427",
    "japanese": "はいますか",
    "english": "do ... have",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_409",
    "japanese": "はれ",
    "english": "clear weather, sunny",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_400",
    "japanese": "ちゃんと",
    "english": "proper, properly, full",
    "type": "adverb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_393",
    "japanese": "ごりょうしん",
    "english": "(your) parents, parents",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_388",
    "japanese": "きゅうきゅうしゃ",
    "english": "ambulance",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_383",
    "japanese": "ぐあいがわるい",
    "english": "unwell",
    "type": "phrase",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_376",
    "japanese": "ふじさん",
    "english": "Mt. Fuji",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_375",
    "japanese": "高い",
    "english": "tall",
    "type": "adjective",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_373",
    "japanese": "じんじゃ",
    "english": "shrine",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_357",
    "japanese": "ぐらい",
    "english": "about",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_348",
    "japanese": "つぎの",
    "english": "next",
    "type": "other",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_343",
    "japanese": "しぶや",
    "english": "Shibuya",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_337",
    "japanese": "せんたくき",
    "english": "washing machine",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_330",
    "japanese": "ほんだな",
    "english": "bookshelf",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_327",
    "japanese": "エアコン",
    "english": "air conditioning, air conditioners, air conditioner",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_326",
    "japanese": "ベッド",
    "english": "bed, beds",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_321",
    "japanese": "アパート",
    "english": "apartment building, apartment, apartments",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_320",
    "japanese": "ひっこします",
    "english": "am going to move, is going to move, move",
    "type": "verb",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_307",
    "japanese": "しゅみはありますか",
    "english": "do you have a hobby",
    "type": "phrase",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_294",
    "japanese": "エリカ",
    "english": "Erica, Erika",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_292",
    "japanese": "こちら",
    "english": "this, these, (over) here",
    "type": "pronoun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_266",
    "japanese": "にかい",
    "english": "the second floor, two",
    "type": "counter",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_265",
    "japanese": "かいだん",
    "english": "stairs",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_248",
    "japanese": "どうが",
    "english": "video",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_225",
    "japanese": "みそしる",
    "english": "miso soup",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_217",
    "japanese": "じゃあ",
    "english": "well then, well, see you",
    "type": "phrase",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_211",
    "japanese": "ていしょく",
    "english": "meal set, meal sets",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_206",
    "japanese": "くろい",
    "english": "black",
    "type": "adjective",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_190",
    "japanese": "Tシャツ",
    "english": "t-shirt",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_185",
    "japanese": "はちょっと",
    "english": "I don't really like, doesn't work very well, kind of",
    "type": "phrase",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_180",
    "japanese": "九時",
    "english": "nine o'clock",
    "type": "counter",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_171",
    "japanese": "七時",
    "english": "seven o'clock",
    "type": "counter",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_161",
    "japanese": "Jポップ",
    "english": "J-pop",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_160",
    "japanese": "まんが",
    "english": "manga",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_152",
    "japanese": "ロック",
    "english": "rock",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_128",
    "japanese": "うるさい",
    "english": "noisy",
    "type": "adjective",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_85",
    "japanese": "じゃないです",
    "english": "is not, we're not, aren't",
    "type": "phrase",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_71",
    "japanese": "やまぐち",
    "english": "Yamaguchi",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_62",
    "japanese": "これら",
    "english": "these",
    "type": "pronoun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_58",
    "japanese": "あかい",
    "english": "red",
    "type": "adjective",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_45",
    "japanese": "ブラジルじん",
    "english": "Brazilian",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_44",
    "japanese": "イギリスじん",
    "english": "British",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_38",
    "japanese": "カナダじん",
    "english": "Canadian",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_22",
    "japanese": "またあした",
    "english": "see you tomorrow",
    "type": "phrase",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_16",
    "japanese": "どうぞよろしく",
    "english": "nice to meet you",
    "type": "phrase",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_14",
    "japanese": "けん",
    "english": "Ken, ticket",
    "type": "noun",
    "currentExamples": 1,
    "needsMore": 2
  },
  {
    "id": "duo_952",
    "japanese": "買いたいです",
    "english": "want to buy",
    "type": "verb",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_909",
    "japanese": "でんきや",
    "english": "electronics store",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_871",
    "japanese": "かぶき",
    "english": "kabuki, kabuki performance, Kabuki performances",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_868",
    "japanese": "チェックアウト",
    "english": "check-out",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_843",
    "japanese": "ぜんぶで",
    "english": "in total",
    "type": "adverb",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_764",
    "japanese": "せんこう",
    "english": "major",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_700",
    "japanese": "おまつり",
    "english": "festival",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_677",
    "japanese": "ギター",
    "english": "(a) guitar, (the) guitars, (the) guitar",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_657",
    "japanese": "トレーニング",
    "english": "job training",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_634",
    "japanese": "フィクション",
    "english": "fiction",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_629",
    "japanese": "コーナー",
    "english": "section",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_599",
    "japanese": "イベント",
    "english": "event",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_582",
    "japanese": "ききましょう",
    "english": "we should ask",
    "type": "verb",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_545",
    "japanese": "しょうゆ",
    "english": "soy sauce",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_521",
    "japanese": "がだいすきです",
    "english": "love, loves",
    "type": "phrase",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_519",
    "japanese": "はすきですか",
    "english": "do ... like",
    "type": "phrase",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_471",
    "japanese": "しましょうか",
    "english": "shall (we), should (we)",
    "type": "verb",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_450",
    "japanese": "あと",
    "english": "after",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_436",
    "japanese": "ちゅうごくご",
    "english": "Chinese",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_416",
    "japanese": "コンサート",
    "english": "concert, concerts",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_377",
    "japanese": "ポストカード",
    "english": "postcard",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_367",
    "japanese": "何ですか",
    "english": "what (is), what are, what's",
    "type": "phrase",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_365",
    "japanese": "たてもの",
    "english": "building",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_362",
    "japanese": "ほんとうに",
    "english": "really, truly",
    "type": "adverb",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_303",
    "japanese": "がすきです",
    "english": "like",
    "type": "phrase",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_295",
    "japanese": "と言います",
    "english": "tell, say, says",
    "type": "verb",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_293",
    "japanese": "言います",
    "english": "tell, tells, say",
    "type": "verb",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_278",
    "japanese": "食べます",
    "english": "eat, am going to eat, will eat",
    "type": "verb",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_237",
    "japanese": "ヨガ",
    "english": "yoga",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_192",
    "japanese": "がほしいです",
    "english": "want",
    "type": "phrase",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_136",
    "japanese": "おしゃれ",
    "english": "fashionable, stylish, well-dressed",
    "type": "adjective",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_104",
    "japanese": "にすんでいます",
    "english": "is living",
    "type": "verb",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_101",
    "japanese": "しゅっしん",
    "english": "from, origin, hometown",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_68",
    "japanese": "かわいい",
    "english": "cuter, cute, pretty",
    "type": "adjective",
    "currentExamples": 2,
    "needsMore": 1
  },
  {
    "id": "duo_64",
    "japanese": "なかやま",
    "english": "Nakayama",
    "type": "noun",
    "currentExamples": 2,
    "needsMore": 1
  }
]
```

**Summary:**

- **Words with 0 examples** (need 3): 0 words
- **Words with 1 example** (need 2 more): 138 words
- **Words with 2 examples** (need 1 more): 35 words


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

1. For each of the 173 words listed above, add the necessary examples to reach 3 total
2. If a word has 1 example, add 2 more examples
3. If a word has 2 examples, add 1 more example
4. Ensure all examples use ONLY vocabulary from the 1060-word list
5. Follow the distribution: 15% simple, 60% intermediate, 25% advanced
6. Use diverse grammar elements (particles, pronouns, time, counters, etc.)
7. Make sentences natural and useful for learning
8. Provide output in the JSON format specified above

## Quality Checklist

Before submitting, verify:
- ✅ Every example uses ONLY words from the 1060-word vocabulary
- ✅ Distribution is approximately 15%/60%/25% (simple/intermediate/advanced)
- ✅ Examples include variety: particles, pronouns, time, adverbs, adjectives, counters
- ✅ Each word ends up with exactly 3 examples total (existing + new)
- ✅ JSON format is correct with all required fields
- ✅ Context (statement/question/answer) is appropriate
- ✅ Level notation (1-X, 2-X, 3-X) matches complexity
- ✅ `newExampleSentences` contains the correct number of examples based on `currentExamples`

---

**Please generate the additional examples now. You can process them in batches if needed.**
