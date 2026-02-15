import { VocabularyCard } from "@/types/vocabulary"

export const sampleN5Deck: VocabularyCard[] = [
  {
    id: "n5_001",
    kanji: "水",
    kana: "みず",
    meaning: ["water"],
    examples: [
      {
        japanese: "水を飲みます",
        kana: "みずをのみます",
        english: "I drink water",
        source: { type: "tatoeba", id: "204677" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "お水をください",
        kana: "おみずをください",
        english: "Water please",
        source: { type: "tatoeba", id: "434980" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["noun", "common", "nature"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_002",
    kanji: "食べる",
    kana: "たべる",
    meaning: ["to eat"],
    examples: [
      {
        japanese: "朝ごはんを食べる",
        kana: "あさごはんをたべる",
        english: "To eat breakfast",
        source: { type: "tatoeba", id: "143754" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "すしを食べたい",
        kana: "すしをたべたい",
        english: "I want to eat sushi",
        source: { type: "tatoeba", id: "258598" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["verb", "common", "food"],
    jlptLevel: "N5",
    partOfSpeech: ["verb", "ichidan"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_003",
    kanji: "見る",
    kana: "みる",
    meaning: ["to see, to watch"],
    examples: [
      {
        japanese: "テレビを見る",
        kana: "テレビをみる",
        english: "To watch TV",
        source: { type: "tatoeba", id: "204808" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "映画を見ましょう",
        kana: "えいがをみましょう",
        english: "Let's watch a movie",
        source: { type: "tatoeba", id: "406642" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["verb", "common", "perception"],
    jlptLevel: "N5",
    partOfSpeech: ["verb", "ichidan"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_004",
    kanji: "大きい",
    kana: "おおきい",
    meaning: ["big, large"],
    examples: [
      {
        japanese: "大きい家",
        kana: "おおきいいえ",
        english: "A big house",
        source: { type: "jmdict" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "この部屋は大きいです",
        kana: "このへやはおおきいです",
        english: "This room is big",
        source: { type: "tatoeba", id: "223345" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["adjective", "common", "size"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/"
    }
  },
  {
    id: "n5_005",
    kanji: "小さい",
    kana: "ちいさい",
    meaning: ["small, little"],
    examples: [
      {
        japanese: "小さい犬",
        kana: "ちいさいいぬ",
        english: "A small dog",
        source: { type: "jmdict" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "この靴は小さいです",
        kana: "このくつはちいさいです",
        english: "These shoes are small",
        source: { type: "tatoeba", id: "200731" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["adjective", "common", "size"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/"
    }
  },
  {
    id: "n5_006",
    kanji: "今日",
    kana: "きょう",
    meaning: ["today"],
    examples: [
      {
        japanese: "今日は月曜日です",
        kana: "きょうはげつようびです",
        english: "Today is Monday",
        source: { type: "tatoeba", id: "200843" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "今日は暑い",
        kana: "きょうはあつい",
        english: "It's hot today",
        source: { type: "tatoeba", id: "200911" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["noun", "time", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["noun", "temporal"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_007",
    kanji: "明日",
    kana: "あした",
    meaning: ["tomorrow"],
    examples: [
      {
        japanese: "明日会いましょう",
        kana: "あしたあいましょう",
        english: "Let's meet tomorrow",
        source: { type: "tatoeba", id: "185542" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "明日は雨です",
        kana: "あしたはあめです",
        english: "It will rain tomorrow",
        source: { type: "tatoeba", id: "425620" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["noun", "time", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["noun", "temporal"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_008",
    kanji: "友達",
    kana: "ともだち",
    meaning: ["friend"],
    examples: [
      {
        japanese: "友達と遊ぶ",
        kana: "ともだちとあそぶ",
        english: "To play with friends",
        source: { type: "tatoeba", id: "108788" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "新しい友達ができました",
        kana: "あたらしいともだちができました",
        english: "I made new friends",
        source: { type: "tatoeba", id: "406779" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["noun", "people", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_009",
    kanji: "学校",
    kana: "がっこう",
    meaning: ["school"],
    examples: [
      {
        japanese: "学校に行く",
        kana: "がっこうにいく",
        english: "To go to school",
        source: { type: "tatoeba", id: "74904" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "学校は楽しいです",
        kana: "がっこうはたのしいです",
        english: "School is fun",
        source: { type: "custom" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["noun", "education", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_010",
    kanji: "本",
    kana: "ほん",
    meaning: ["book"],
    examples: [
      {
        japanese: "本を読む",
        kana: "ほんをよむ",
        english: "To read a book",
        source: { type: "tatoeba", id: "258463" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "この本は面白い",
        kana: "このほんはおもしろい",
        english: "This book is interesting",
        source: { type: "tatoeba", id: "60273" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["noun", "education", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_011",
    kanji: "高い",
    kana: "たかい",
    meaning: ["high", "tall", "expensive"],
    examples: [
      {
        japanese: "山が高い",
        kana: "やまがたかい",
        english: "The mountain is high",
        source: { type: "jmdict" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "これは高いです",
        kana: "これはたかいです",
        english: "This is expensive",
        source: { type: "tatoeba", id: "60887" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["adjective", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/"
    }
  },
  {
    id: "n5_012",
    kanji: "安い",
    kana: "やすい",
    meaning: ["cheap, inexpensive"],
    examples: [
      {
        japanese: "この店は安い",
        kana: "このみせはやすい",
        english: "This store is cheap",
        source: { type: "custom" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "安い服を買う",
        kana: "やすいふくをかう",
        english: "To buy cheap clothes",
        source: { type: "tatoeba", id: "1193534" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["adjective", "shopping", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_013",
    kanji: "新しい",
    kana: "あたらしい",
    meaning: ["new"],
    examples: [
      {
        japanese: "新しい車",
        kana: "あたらしいくるま",
        english: "A new car",
        source: { type: "jmdict" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "新しい服を着る",
        kana: "あたらしいふくをきる",
        english: "To wear new clothes",
        source: { type: "tatoeba", id: "406968" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["adjective", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/"
    }
  },
  {
    id: "n5_014",
    kanji: "古い",
    kana: "ふるい",
    meaning: ["old (for things)"],
    examples: [
      {
        japanese: "古い建物",
        kana: "ふるいたてもの",
        english: "An old building",
        source: { type: "jmdict" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "この家は古いです",
        kana: "このいえはふるいです",
        english: "This house is old",
        source: { type: "tatoeba", id: "60825" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["adjective", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/"
    }
  },
  {
    id: "n5_015",
    kanji: "好き",
    kana: "すき",
    meaning: ["like, favorite"],
    examples: [
      {
        japanese: "音楽が好きです",
        kana: "おんがくがすきです",
        english: "I like music",
        source: { type: "tatoeba", id: "257225" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "何が好きですか",
        kana: "なにがすきですか",
        english: "What do you like?",
        source: { type: "tatoeba", id: "1105642" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["adjective", "emotion", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["na-adjective"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_016",
    kana: "いつ",
    meaning: ["when"],
    examples: [
      {
        japanese: "いつ来ますか",
        kana: "いつきますか",
        english: "When will you come?",
        source: { type: "tatoeba", id: "1652" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "いつがいいですか",
        kana: "いつがいいですか",
        english: "When is good?",
        source: { type: "custom" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["adverb", "question", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["adverb"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_017",
    kana: "どこ",
    meaning: ["where"],
    examples: [
      {
        japanese: "どこに行きますか",
        kana: "どこにいきますか",
        english: "Where are you going?",
        source: { type: "tatoeba", id: "434985" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "駅はどこですか",
        kana: "えきはどこですか",
        english: "Where is the station?",
        source: { type: "tatoeba", id: "28069" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["pronoun", "question", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["pronoun"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_018",
    kanji: "毎日",
    kana: "まいにち",
    meaning: ["every day"],
    examples: [
      {
        japanese: "毎日勉強します",
        kana: "まいにちべんきょうします",
        english: "I study every day",
        source: { type: "tatoeba", id: "108789" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "毎日運動する",
        kana: "まいにちうんどうする",
        english: "To exercise every day",
        source: { type: "custom" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["noun", "time", "frequency", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["noun", "temporal"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_019",
    kanji: "元気",
    kana: "げんき",
    meaning: ["healthy", "energetic", "well"],
    examples: [
      {
        japanese: "お元気ですか",
        kana: "おげんきですか",
        english: "How are you?",
        source: { type: "tatoeba", id: "238498" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "元気です",
        kana: "げんきです",
        english: "I'm fine",
        source: { type: "tatoeba", id: "257213" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["adjective", "health", "greeting", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["na-adjective", "noun"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_020",
    kanji: "天気",
    kana: "てんき",
    meaning: ["weather"],
    examples: [
      {
        japanese: "今日の天気はどうですか",
        kana: "きょうのてんきはどうですか",
        english: "How's the weather today?",
        source: { type: "tatoeba", id: "423478" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      },
      {
        japanese: "いい天気ですね",
        kana: "いいてんきですね",
        english: "Nice weather, isn't it?",
        source: { type: "tatoeba", id: "65873" },
        license: { text: "CC BY 2.0 FR (Tatoeba)", url: "https://creativecommons.org/licenses/by/2.0/" }
      }
    ],
    tags: ["noun", "weather", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    source: { type: "sample-deck" },
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  }
]

// Export deck metadata
export const sampleN5DeckMetadata = {
  id: "sample_n5_core",
  name: "JLPT N5 Core Vocabulary",
  description: "Essential N5 vocabulary with authentic example sentences from Tatoeba and JMdict. Perfect for beginners starting their Japanese journey.",
  jlptLevel: "N5" as const,
  visibility: "public" as const,
  premiumOnly: false,
  credits: {
    author: "LingoMemory Team",
    sources: [
      "JMdict (EDRDG) - CC BY-SA 4.0",
      "Tatoeba Project - CC BY 2.0",
      "Custom examples for educational purposes"
    ]
  },
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01")
}