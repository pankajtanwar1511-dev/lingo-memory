# N5 Example Verification Prompt

## Background and Problems

We have 1,871 example sentences for 662 N5 vocabulary words, sourced from JMdict and Tatoeba. However, we've identified critical quality issues:

### Problem 1: False Positive Vocabulary Matches
- Substring matching created false positives
- Example: "売る" (uru - to sell) incorrectly matched "うるさい" (urusai - noisy)
- Need to verify the target vocabulary actually appears as a distinct word

### Problem 2: Grammar Level Uncertainty
- Examples may contain N4+ grammar despite passing our filters
- Filter may have missed advanced conditional forms, causative, passive, etc.
- Need strict verification that ONLY N5 grammar is used

### Problem 3: Kana Accuracy
- Auto-generated kana readings may have errors
- Need to verify kana matches the Japanese sentence correctly

## Your Task

Verify each example sentence below for N5 appropriateness and provide structured feedback.

## N5 Grammar Patterns Reference

### ✅ ALLOWED (N5 Grammar)

**Particles**: は、が、を、に、へ、で、と、も、か、から、まで、の、や、ね、よ

**Verb Forms**:
- Dictionary form: 食べる、行く
- Masu form: 食べます、行きます
- Te form: 食べて、行って
- Ta form: 食べた、行った
- Nai form: 食べない、行かない
- Nakatta form: 食べなかった

**Copula**: だ、です、じゃない、ではない

**Adjectives**:
- I-adjectives: 大きい、大きくない、大きかった
- Na-adjectives: 静かだ、静かな、静かじゃない

**Sentence Patterns**:
- X は Y です (X is Y)
- X が好きです/嫌いです (like/dislike)
- X は Y が Adj です (X's Y is Adj)
- X は Y を V (X does V to Y)
- X で Y を V (do V with Y)
- X から Y まで (from X to Y)
- Question words: 何、誰、どこ、いつ、なぜ、どう、いくら
- Counting/time expressions

### ❌ NOT ALLOWED (N4+ Grammar)

**Conditionals**: たら、ば、なら、と (conditional)
**Causative**: させる、せる forms
**Passive**: れる、られる forms
**Potential**: できる、られる (ability)
**Volitional**: よう、ましょう (beyond basic suggestions)
**Advanced conjunctions**: のに、ので (complex reasons)
**Formal patterns**: ている (continuous) is borderline - accept only if very basic

## Verification Criteria

For each example, check:

### 1. Target Vocabulary Present (YES/NO/UNCLEAR)
- Does the sentence contain the EXACT target vocabulary word?
- Check word boundaries - not just substring
- If target has kanji, check if kanji or kana version appears
- Mark UNCLEAR if word might be part of compound

### 2. Kana Accuracy (ACCURATE/MINOR_ERROR/MAJOR_ERROR)
- Does the kana reading match the Japanese sentence character-by-character?
- ACCURATE: Perfect match
- MINOR_ERROR: 1-2 character mistakes, missing particles
- MAJOR_ERROR: Multiple errors, completely wrong readings

### 3. N5 Grammar Check (PASS/FAIL + explanation)
- Does sentence use ONLY N5 grammar patterns listed above?
- Identify any N4+ grammar if found
- PASS: Only N5 patterns
- FAIL: Contains any N4+ pattern (list which ones)

### 4. Difficulty Rating (1-10 within N5 range)

Rate based on these factors:
- **Grammar complexity**: Simple statements (1-3) vs multiple clauses (7-10)
- **Vocabulary density**: Only target word (1-3) vs many N5 words (7-10)
- **Sentence length**: Short (1-3) vs long (7-10)
- **Cultural context**: Universal concepts (1-3) vs Japan-specific (5-7)

**Rating Scale Examples**:
- **1-3 (Beginner N5)**: これは本です。/ 私は学生です。
- **4-6 (Mid N5)**: 私は毎日学校へ行きます。
- **7-8 (Advanced N5)**: 田中さんは昨日図書館で本を読みました。
- **9-10 (Upper N5 limit)**: Complex but still N5-only grammar

### 5. Recommendation (ACCEPT/REVIEW/REJECT)
- **ACCEPT**: Target present, kana accurate, N5 grammar only, appropriate difficulty
- **REVIEW**: Minor issues (small kana error, borderline grammar, difficulty uncertain)
- **REJECT**: Major issues (wrong vocab, N4+ grammar, major kana errors)

## Output Format

For each example, return JSON in this exact format:

```json
{
  "card_id": "n5_vocab_0001",
  "example_index": 0,
  "verification": {
    "target_vocab_present": "YES/NO/UNCLEAR",
    "target_vocab_notes": "Explain where/how target word appears",
    "kana_accuracy": "ACCURATE/MINOR_ERROR/MAJOR_ERROR",
    "kana_notes": "Explain any errors found",
    "n5_grammar_check": "PASS/FAIL",
    "grammar_notes": "List any N4+ patterns if FAIL, or note N5 patterns if PASS",
    "difficulty_rating": 5,
    "difficulty_notes": "Explain rating based on 4 factors",
    "recommendation": "ACCEPT/REVIEW/REJECT",
    "overall_notes": "Summary of decision"
  }
}
```

## Batch to Verify

**Batch Number**: 9
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0141",
    "example_index": 0,
    "target_vocab": {
      "kanji": "好き",
      "kana": "すき",
      "meaning": "likeable"
    },
    "sentence": {
      "japanese": "コーヒーは薄いのが好きです。",
      "kana": "こーひーはうすいのがすきです。",
      "english": "I'd like my coffee weak.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0141",
    "example_index": 1,
    "target_vocab": {
      "kanji": "好き",
      "kana": "すき",
      "meaning": "likeable"
    },
    "sentence": {
      "japanese": "音楽が好きで、毎日聴いています。",
      "kana": "おんがくがすきで、まいにちきいています。",
      "english": "I like music, and I listen to it every day.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0141",
    "example_index": 2,
    "target_vocab": {
      "kanji": "好き",
      "kana": "すき",
      "meaning": "likeable"
    },
    "sentence": {
      "japanese": "好きにしろよ。",
      "kana": "すきにしろよ。",
      "english": "Suit yourself.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0141",
    "example_index": 3,
    "target_vocab": {
      "kanji": "好き",
      "kana": "すき",
      "meaning": "likeable"
    },
    "sentence": {
      "japanese": "彼はすきだらけだ。",
      "kana": "かれはすきだらけだ。",
      "english": "He is utterly unguarded.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0141",
    "example_index": 4,
    "target_vocab": {
      "kanji": "好き",
      "kana": "すき",
      "meaning": "likeable"
    },
    "sentence": {
      "japanese": "私達はみんな彼がすきです。",
      "kana": "わたしたちはみんなかれがすきです。",
      "english": "We all like him.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0141",
    "example_index": 5,
    "target_vocab": {
      "kanji": "好き",
      "kana": "すき",
      "meaning": "likeable"
    },
    "sentence": {
      "japanese": "どの店がすきですか。",
      "kana": "どのみせがすきですか。",
      "english": "Which is your favorite store?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0142",
    "example_index": 0,
    "target_vocab": {
      "kanji": "静か",
      "kana": "しずか",
      "meaning": "quiet"
    },
    "sentence": {
      "japanese": "静かにしろったら。",
      "kana": "しずかにしろったら。",
      "english": "Do be quiet!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0142",
    "example_index": 1,
    "target_vocab": {
      "kanji": "静か",
      "kana": "しずか",
      "meaning": "quiet"
    },
    "sentence": {
      "japanese": "彼女は静かに部屋に入った。",
      "kana": "かのじょはしずかにへやにいっった。",
      "english": "She quietly entered the room.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0142",
    "example_index": 2,
    "target_vocab": {
      "kanji": "静か",
      "kana": "しずか",
      "meaning": "quiet"
    },
    "sentence": {
      "japanese": "彼女は静かな人です。",
      "kana": "かのじょはしずかなにんです。",
      "english": "She is quiet.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0144",
    "example_index": 0,
    "target_vocab": {
      "kanji": "人",
      "kana": "ひと",
      "meaning": "person"
    },
    "sentence": {
      "japanese": "彼女はどのような人ですか。",
      "kana": "かのじょはどのようなにんですか。",
      "english": "What is she like?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0144",
    "example_index": 1,
    "target_vocab": {
      "kanji": "人",
      "kana": "ひと",
      "meaning": "person"
    },
    "sentence": {
      "japanese": "彼は人の名前を忘れやすい。",
      "kana": "かれはにんのなまえをわすれやすい。",
      "english": "He is apt to forget people's name.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0144",
    "example_index": 2,
    "target_vocab": {
      "kanji": "人",
      "kana": "ひと",
      "meaning": "person"
    },
    "sentence": {
      "japanese": "いつものところでいつもの人達に会った。",
      "kana": "いつものところでいつものひとたちにあった。",
      "english": "I met the usual people at the usual place.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0144",
    "example_index": 3,
    "target_vocab": {
      "kanji": "人",
      "kana": "ひと",
      "meaning": "person"
    },
    "sentence": {
      "japanese": "「コップいる？」「テーブルにひとつある」",
      "kana": "「こっぷいる？」「てーぶるにひとつある」",
      "english": "\"Is there a glass?\" \"Yes, there's one on the table.\"",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0144",
    "example_index": 4,
    "target_vocab": {
      "kanji": "人",
      "kana": "ひと",
      "meaning": "person"
    },
    "sentence": {
      "japanese": "ひと箱いくらですか？",
      "kana": "ひとはこいくらですか？",
      "english": "How much does a box cost?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0144",
    "example_index": 5,
    "target_vocab": {
      "kanji": "人",
      "kana": "ひと",
      "meaning": "person"
    },
    "sentence": {
      "japanese": "ひとつ欲しい？",
      "kana": "ひとつほしい？",
      "english": "Do you want one?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0145",
    "example_index": 0,
    "target_vocab": {
      "kanji": "覚える",
      "kana": "おぼえる",
      "meaning": "to remember"
    },
    "sentence": {
      "japanese": "彼は名前を覚えるのが下手だ。",
      "kana": "かれはなまえをおぼえるのがへただ。",
      "english": "He is weak on names.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0145",
    "example_index": 1,
    "target_vocab": {
      "kanji": "覚える",
      "kana": "おぼえる",
      "meaning": "to remember"
    },
    "sentence": {
      "japanese": "彼の名前は覚えるのがとても難しい。",
      "kana": "かのなまえはおぼえるのがとてもむずかしい。",
      "english": "His name is very difficult to remember.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0145",
    "example_index": 2,
    "target_vocab": {
      "kanji": "覚える",
      "kana": "おぼえる",
      "meaning": "to remember"
    },
    "sentence": {
      "japanese": "彼の名前を覚えていますか。",
      "kana": "かのなまえをおぼえていますか。",
      "english": "Do you remember his name?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0146",
    "example_index": 0,
    "target_vocab": {
      "kanji": "休み",
      "kana": "やすみ",
      "meaning": "rest"
    },
    "sentence": {
      "japanese": "来週の今日は学校は休みだ。",
      "kana": "らいしゅうのこんにちはがっこうはやすみだ。",
      "english": "There will be no school a week from today.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0146",
    "example_index": 1,
    "target_vocab": {
      "kanji": "休み",
      "kana": "やすみ",
      "meaning": "rest"
    },
    "sentence": {
      "japanese": "明日は休みだ。",
      "kana": "あしたはやすみだ。",
      "english": "It is a holiday tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0146",
    "example_index": 2,
    "target_vocab": {
      "kanji": "休み",
      "kana": "やすみ",
      "meaning": "rest"
    },
    "sentence": {
      "japanese": "明日は休みます。",
      "kana": "あしたはやすみます。",
      "english": "I'll be absent tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0146",
    "example_index": 3,
    "target_vocab": {
      "kanji": "休み",
      "kana": "やすみ",
      "meaning": "rest"
    },
    "sentence": {
      "japanese": "私は彼女におやすみといった。",
      "kana": "わたしはかのじょにおやすみといった。",
      "english": "I bade good night to her.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0146",
    "example_index": 4,
    "target_vocab": {
      "kanji": "休み",
      "kana": "やすみ",
      "meaning": "rest"
    },
    "sentence": {
      "japanese": "もう、おやすみを言う時間だね。",
      "kana": "もう、おやすみをいうじかんだね。",
      "english": "Now it's time to say good night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0146",
    "example_index": 5,
    "target_vocab": {
      "kanji": "休み",
      "kana": "やすみ",
      "meaning": "rest"
    },
    "sentence": {
      "japanese": "おやすみ。",
      "kana": "おやすみ。",
      "english": "Good night!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0147",
    "example_index": 0,
    "target_vocab": {
      "kanji": "池",
      "kana": "いけ",
      "meaning": "pond"
    },
    "sentence": {
      "japanese": "池のそばに男がいる。",
      "kana": "いけのそばにおとこがいる。",
      "english": "There is a man by the side of the pond.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0147",
    "example_index": 1,
    "target_vocab": {
      "kanji": "池",
      "kana": "いけ",
      "meaning": "pond"
    },
    "sentence": {
      "japanese": "池に大きな赤い魚が一匹泳いでいる。",
      "kana": "いけにおおきなあかいさかながいっぴきおよいでいる。",
      "english": "A big red fish is swimming about in the pond.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0147",
    "example_index": 2,
    "target_vocab": {
      "kanji": "池",
      "kana": "いけ",
      "meaning": "pond"
    },
    "sentence": {
      "japanese": "池には魚がたくさんいる。",
      "kana": "いけにはさかながたくさんいる。",
      "english": "There are a lot of fish in the pond.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0147",
    "example_index": 3,
    "target_vocab": {
      "kanji": "池",
      "kana": "いけ",
      "meaning": "pond"
    },
    "sentence": {
      "japanese": "目に悪いから暗いところで本を読んではいけない。",
      "kana": "めにわるいからくらいところでほんをよんではいけない。",
      "english": "Don't read under insufficient light, for it is bad for your eyes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0147",
    "example_index": 4,
    "target_vocab": {
      "kanji": "池",
      "kana": "いけ",
      "meaning": "pond"
    },
    "sentence": {
      "japanese": "明日彼と話をするのを忘れてはいけませんよ。",
      "kana": "あしたかれとはなしをするのをわすれてはいけませんよ。",
      "english": "Don't forget to talk with him tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0147",
    "example_index": 5,
    "target_vocab": {
      "kanji": "池",
      "kana": "いけ",
      "meaning": "pond"
    },
    "sentence": {
      "japanese": "明日は来なければいけませんよ。",
      "kana": "あしたはこなければいけませんよ。",
      "english": "You'll have to come tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0148",
    "example_index": 0,
    "target_vocab": {
      "kanji": "始まる",
      "kana": "はじまる",
      "meaning": "to begin"
    },
    "sentence": {
      "japanese": "来週からテストが始まる。",
      "kana": "らいしゅうからてすとがはじまる。",
      "english": "Tests start next week.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0148",
    "example_index": 1,
    "target_vocab": {
      "kanji": "始まる",
      "kana": "はじまる",
      "meaning": "to begin"
    },
    "sentence": {
      "japanese": "学校は明日から始まります。",
      "kana": "がっこうはあしたからはじまります。",
      "english": "School begins tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0148",
    "example_index": 2,
    "target_vocab": {
      "kanji": "始まる",
      "kana": "はじまる",
      "meaning": "to begin"
    },
    "sentence": {
      "japanese": "学校は春から始まります。",
      "kana": "がっこうははるからはじまります。",
      "english": "School begins in spring.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0149",
    "example_index": 0,
    "target_vocab": {
      "kanji": "困る",
      "kana": "こまる",
      "meaning": "to be worried"
    },
    "sentence": {
      "japanese": "こいつは困ったぞ。",
      "kana": "こいつはこまったぞ。",
      "english": "Here's a fine how-do-you-do.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0149",
    "example_index": 1,
    "target_vocab": {
      "kanji": "困る",
      "kana": "こまる",
      "meaning": "to be worried"
    },
    "sentence": {
      "japanese": "非常に困っています。",
      "kana": "ひじょうにこまっています。",
      "english": "I am in deep water.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0149",
    "example_index": 2,
    "target_vocab": {
      "kanji": "困る",
      "kana": "こまる",
      "meaning": "to be worried"
    },
    "sentence": {
      "japanese": "彼等はいつも食べる物に困っている。",
      "kana": "かれらはいつもたべるものにこまっている。",
      "english": "They are always hard up for food.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0152",
    "example_index": 0,
    "target_vocab": {
      "kanji": "疲れる",
      "kana": "つかれる",
      "meaning": "to get tired"
    },
    "sentence": {
      "japanese": "彼女に疲れているのかと聞かれて彼は「ああ」といった。",
      "kana": "かのじょにつかれているのかときかれてかれは「ああ」といった。",
      "english": "He said \"Yeah\" when she asked if he was tired.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0152",
    "example_index": 1,
    "target_vocab": {
      "kanji": "疲れる",
      "kana": "つかれる",
      "meaning": "to get tired"
    },
    "sentence": {
      "japanese": "疲れて足が重かった。",
      "kana": "つかれてあしがおもかった。",
      "english": "My legs were leaden from fatigue.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0152",
    "example_index": 2,
    "target_vocab": {
      "kanji": "疲れる",
      "kana": "つかれる",
      "meaning": "to get tired"
    },
    "sentence": {
      "japanese": "目が疲れやすいです。",
      "kana": "めがつかれやすいです。",
      "english": "My eyes get tired very easily.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0153",
    "example_index": 0,
    "target_vocab": {
      "kanji": "掃除",
      "kana": "そうじする",
      "meaning": "to clean"
    },
    "sentence": {
      "japanese": "彼女が私の部屋を掃除する。",
      "kana": "かのじょがわたしのへやをそうじする。",
      "english": "She will clean my room.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0153",
    "example_index": 1,
    "target_vocab": {
      "kanji": "掃除",
      "kana": "そうじする",
      "meaning": "to clean"
    },
    "sentence": {
      "japanese": "彼は部屋を掃除するように私に言った。",
      "kana": "かれはへやをそうじするようにわたしにいった。",
      "english": "He ordered me to clean the room.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0153",
    "example_index": 2,
    "target_vocab": {
      "kanji": "掃除",
      "kana": "そうじする",
      "meaning": "to clean"
    },
    "sentence": {
      "japanese": "彼は部屋の掃除が嫌いだ。",
      "kana": "かれはへやのそうじがきらいだ。",
      "english": "He hates cleaning his room.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0154",
    "example_index": 0,
    "target_vocab": {
      "kanji": "賑やか",
      "kana": "にぎやか",
      "meaning": "bustling"
    },
    "sentence": {
      "japanese": "にぎやかなところが好きだ。",
      "kana": "にぎやかなところがすきだ。",
      "english": "I like busy places.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0154",
    "example_index": 1,
    "target_vocab": {
      "kanji": "賑やか",
      "kana": "にぎやか",
      "meaning": "bustling"
    },
    "sentence": {
      "japanese": "ここはとてもにぎやかな所です。",
      "kana": "ここはとてもにぎやかなところです。",
      "english": "This is a very lively place.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0154",
    "example_index": 2,
    "target_vocab": {
      "kanji": "賑やか",
      "kana": "にぎやか",
      "meaning": "bustling"
    },
    "sentence": {
      "japanese": "隣の教室はとてもにぎやかです。",
      "kana": "となりのきょうしつはとてもにぎやかです。",
      "english": "It's very lively in the class next door.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0154",
    "example_index": 3,
    "target_vocab": {
      "kanji": "賑やか",
      "kana": "にぎやか",
      "meaning": "bustling"
    },
    "sentence": {
      "japanese": "にぎやかなところが好きだ。",
      "kana": "にぎやかなところがすきだ。",
      "english": "I like busy places.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0154",
    "example_index": 4,
    "target_vocab": {
      "kanji": "賑やか",
      "kana": "にぎやか",
      "meaning": "bustling"
    },
    "sentence": {
      "japanese": "ここはとてもにぎやかな所です。",
      "kana": "ここはとてもにぎやかなところです。",
      "english": "This is a very lively place.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0154",
    "example_index": 5,
    "target_vocab": {
      "kanji": "賑やか",
      "kana": "にぎやか",
      "meaning": "bustling"
    },
    "sentence": {
      "japanese": "隣の教室はとてもにぎやかです。",
      "kana": "となりのきょうしつはとてもにぎやかです。",
      "english": "It's very lively in the class next door.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0156",
    "example_index": 0,
    "target_vocab": {
      "kanji": "来週",
      "kana": "らいしゅう",
      "meaning": "next week"
    },
    "sentence": {
      "japanese": "来週また会いたい。",
      "kana": "らいしゅうまたあいたい。",
      "english": "I'd like to see you again next week.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0156",
    "example_index": 1,
    "target_vocab": {
      "kanji": "来週",
      "kana": "らいしゅう",
      "meaning": "next week"
    },
    "sentence": {
      "japanese": "来週の今日は学校は休みだ。",
      "kana": "らいしゅうのこんにちはがっこうはやすみだ。",
      "english": "There will be no school a week from today.",
      "source": "tatoeba"
    }
  }
]

---

## Important Notes

- Be strict with grammar verification - when in doubt, mark as REVIEW
- Consider learner perspective - would a beginner understand this?
- Target vocabulary must be the MAIN focus of the sentence
- Rate difficulty relative to N5 range, not absolute Japanese proficiency
- Provide clear explanations for REVIEW and REJECT recommendations

## Output Instructions

1. Verify all examples in this batch
2. Return results as a JSON array
3. Include your verification reasoning in the notes fields
4. Be consistent with your ratings across all examples
