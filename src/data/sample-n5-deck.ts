import { VocabularyCard } from "@/types/vocabulary"

export const sampleN5Deck: VocabularyCard[] = [
  {
    id: "n5_001",
    kanji: "水",
    kana: "みず",
    meaning: "water",
    examples: [
      {
        japanese: "水を飲みます",
        hiragana: "みずをのみます",
        english: "I drink water",
        source: { type: "tatoeba", id: "204677" }
      },
      {
        japanese: "お水をください",
        hiragana: "おみずをください",
        english: "Water please",
        source: { type: "tatoeba", id: "434980" }
      }
    ],
    tags: ["noun", "common", "nature"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_002",
    kanji: "食べる",
    kana: "たべる",
    meaning: "to eat",
    examples: [
      {
        japanese: "朝ごはんを食べる",
        hiragana: "あさごはんをたべる",
        english: "To eat breakfast",
        source: { type: "tatoeba", id: "143754" }
      },
      {
        japanese: "すしを食べたい",
        hiragana: "すしをたべたい",
        english: "I want to eat sushi",
        source: { type: "tatoeba", id: "258598" }
      }
    ],
    tags: ["verb", "common", "food"],
    jlptLevel: "N5",
    partOfSpeech: ["verb", "ichidan"],
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_003",
    kanji: "見る",
    kana: "みる",
    meaning: "to see, to watch",
    examples: [
      {
        japanese: "テレビを見る",
        hiragana: "テレビをみる",
        english: "To watch TV",
        source: { type: "tatoeba", id: "204808" }
      },
      {
        japanese: "映画を見ましょう",
        hiragana: "えいがをみましょう",
        english: "Let's watch a movie",
        source: { type: "tatoeba", id: "406642" }
      }
    ],
    tags: ["verb", "common", "perception"],
    jlptLevel: "N5",
    partOfSpeech: ["verb", "ichidan"],
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_004",
    kanji: "大きい",
    kana: "おおきい",
    meaning: "big, large",
    examples: [
      {
        japanese: "大きい家",
        hiragana: "おおきいいえ",
        english: "A big house",
        source: { type: "jmdict" }
      },
      {
        japanese: "この部屋は大きいです",
        hiragana: "このへやはおおきいです",
        english: "This room is big",
        source: { type: "tatoeba", id: "223345" }
      }
    ],
    tags: ["adjective", "common", "size"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    license: {
      text: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/"
    }
  },
  {
    id: "n5_005",
    kanji: "小さい",
    kana: "ちいさい",
    meaning: "small, little",
    examples: [
      {
        japanese: "小さい犬",
        hiragana: "ちいさいいぬ",
        english: "A small dog",
        source: { type: "jmdict" }
      },
      {
        japanese: "この靴は小さいです",
        hiragana: "このくつはちいさいです",
        english: "These shoes are small",
        source: { type: "tatoeba", id: "200731" }
      }
    ],
    tags: ["adjective", "common", "size"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    license: {
      text: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/"
    }
  },
  {
    id: "n5_006",
    kanji: "今日",
    kana: "きょう",
    meaning: "today",
    examples: [
      {
        japanese: "今日は月曜日です",
        hiragana: "きょうはげつようびです",
        english: "Today is Monday",
        source: { type: "tatoeba", id: "200843" }
      },
      {
        japanese: "今日は暑い",
        hiragana: "きょうはあつい",
        english: "It's hot today",
        source: { type: "tatoeba", id: "200911" }
      }
    ],
    tags: ["noun", "time", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["noun", "temporal"],
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_007",
    kanji: "明日",
    kana: "あした",
    meaning: "tomorrow",
    examples: [
      {
        japanese: "明日会いましょう",
        hiragana: "あしたあいましょう",
        english: "Let's meet tomorrow",
        source: { type: "tatoeba", id: "185542" }
      },
      {
        japanese: "明日は雨です",
        hiragana: "あしたはあめです",
        english: "It will rain tomorrow",
        source: { type: "tatoeba", id: "425620" }
      }
    ],
    tags: ["noun", "time", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["noun", "temporal"],
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_008",
    kanji: "友達",
    kana: "ともだち",
    meaning: "friend",
    examples: [
      {
        japanese: "友達と遊ぶ",
        hiragana: "ともだちとあそぶ",
        english: "To play with friends",
        source: { type: "tatoeba", id: "108788" }
      },
      {
        japanese: "新しい友達ができました",
        hiragana: "あたらしいともだちができました",
        english: "I made new friends",
        source: { type: "tatoeba", id: "406779" }
      }
    ],
    tags: ["noun", "people", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_009",
    kanji: "学校",
    kana: "がっこう",
    meaning: "school",
    examples: [
      {
        japanese: "学校に行く",
        hiragana: "がっこうにいく",
        english: "To go to school",
        source: { type: "tatoeba", id: "74904" }
      },
      {
        japanese: "学校は楽しいです",
        hiragana: "がっこうはたのしいです",
        english: "School is fun",
        source: { type: "custom" }
      }
    ],
    tags: ["noun", "education", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_010",
    kanji: "本",
    kana: "ほん",
    meaning: "book",
    examples: [
      {
        japanese: "本を読む",
        hiragana: "ほんをよむ",
        english: "To read a book",
        source: { type: "tatoeba", id: "258463" }
      },
      {
        japanese: "この本は面白い",
        hiragana: "このほんはおもしろい",
        english: "This book is interesting",
        source: { type: "tatoeba", id: "60273" }
      }
    ],
    tags: ["noun", "education", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
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
        hiragana: "やまがたかい",
        english: "The mountain is high",
        source: { type: "jmdict" }
      },
      {
        japanese: "これは高いです",
        hiragana: "これはたかいです",
        english: "This is expensive",
        source: { type: "tatoeba", id: "60887" }
      }
    ],
    tags: ["adjective", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    license: {
      text: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/"
    }
  },
  {
    id: "n5_012",
    kanji: "安い",
    kana: "やすい",
    meaning: "cheap, inexpensive",
    examples: [
      {
        japanese: "この店は安い",
        hiragana: "このみせはやすい",
        english: "This store is cheap",
        source: { type: "custom" }
      },
      {
        japanese: "安い服を買う",
        hiragana: "やすいふくをかう",
        english: "To buy cheap clothes",
        source: { type: "tatoeba", id: "1193534" }
      }
    ],
    tags: ["adjective", "shopping", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_013",
    kanji: "新しい",
    kana: "あたらしい",
    meaning: "new",
    examples: [
      {
        japanese: "新しい車",
        hiragana: "あたらしいくるま",
        english: "A new car",
        source: { type: "jmdict" }
      },
      {
        japanese: "新しい服を着る",
        hiragana: "あたらしいふくをきる",
        english: "To wear new clothes",
        source: { type: "tatoeba", id: "406968" }
      }
    ],
    tags: ["adjective", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    license: {
      text: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/"
    }
  },
  {
    id: "n5_014",
    kanji: "古い",
    kana: "ふるい",
    meaning: "old (for things)",
    examples: [
      {
        japanese: "古い建物",
        hiragana: "ふるいたてもの",
        english: "An old building",
        source: { type: "jmdict" }
      },
      {
        japanese: "この家は古いです",
        hiragana: "このいえはふるいです",
        english: "This house is old",
        source: { type: "tatoeba", id: "60825" }
      }
    ],
    tags: ["adjective", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["i-adjective"],
    license: {
      text: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/"
    }
  },
  {
    id: "n5_015",
    kanji: "好き",
    kana: "すき",
    meaning: "like, favorite",
    examples: [
      {
        japanese: "音楽が好きです",
        hiragana: "おんがくがすきです",
        english: "I like music",
        source: { type: "tatoeba", id: "257225" }
      },
      {
        japanese: "何が好きですか",
        hiragana: "なにがすきですか",
        english: "What do you like?",
        source: { type: "tatoeba", id: "1105642" }
      }
    ],
    tags: ["adjective", "emotion", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["na-adjective"],
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_016",
    kana: "いつ",
    meaning: "when",
    examples: [
      {
        japanese: "いつ来ますか",
        hiragana: "いつきますか",
        english: "When will you come?",
        source: { type: "tatoeba", id: "1652" }
      },
      {
        japanese: "いつがいいですか",
        hiragana: "いつがいいですか",
        english: "When is good?",
        source: { type: "custom" }
      }
    ],
    tags: ["adverb", "question", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["adverb"],
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_017",
    kana: "どこ",
    meaning: "where",
    examples: [
      {
        japanese: "どこに行きますか",
        hiragana: "どこにいきますか",
        english: "Where are you going?",
        source: { type: "tatoeba", id: "434985" }
      },
      {
        japanese: "駅はどこですか",
        hiragana: "えきはどこですか",
        english: "Where is the station?",
        source: { type: "tatoeba", id: "28069" }
      }
    ],
    tags: ["pronoun", "question", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["pronoun"],
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_018",
    kanji: "毎日",
    kana: "まいにち",
    meaning: "every day",
    examples: [
      {
        japanese: "毎日勉強します",
        hiragana: "まいにちべんきょうします",
        english: "I study every day",
        source: { type: "tatoeba", id: "108789" }
      },
      {
        japanese: "毎日運動する",
        hiragana: "まいにちうんどうする",
        english: "To exercise every day",
        source: { type: "custom" }
      }
    ],
    tags: ["noun", "time", "frequency", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["noun", "temporal"],
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
        hiragana: "おげんきですか",
        english: "How are you?",
        source: { type: "tatoeba", id: "238498" }
      },
      {
        japanese: "元気です",
        hiragana: "げんきです",
        english: "I'm fine",
        source: { type: "tatoeba", id: "257213" }
      }
    ],
    tags: ["adjective", "health", "greeting", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["na-adjective", "noun"],
    license: {
      text: "CC BY 2.0",
      url: "https://creativecommons.org/licenses/by/2.0/"
    }
  },
  {
    id: "n5_020",
    kanji: "天気",
    kana: "てんき",
    meaning: "weather",
    examples: [
      {
        japanese: "今日の天気はどうですか",
        hiragana: "きょうのてんきはどうですか",
        english: "How's the weather today?",
        source: { type: "tatoeba", id: "423478" }
      },
      {
        japanese: "いい天気ですね",
        hiragana: "いいてんきですね",
        english: "Nice weather, isn't it?",
        source: { type: "tatoeba", id: "65873" }
      }
    ],
    tags: ["noun", "weather", "common"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
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