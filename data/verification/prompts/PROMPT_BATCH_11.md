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

**Batch Number**: 11
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0174",
    "example_index": 0,
    "target_vocab": {
      "kanji": "一日",
      "kana": "いちにち",
      "meaning": "(1) one day"
    },
    "sentence": {
      "japanese": "１日おきに買い物に行く。",
      "kana": "１にちおきにかいものにいく。",
      "english": "I go shopping every other day.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0174",
    "example_index": 1,
    "target_vocab": {
      "kanji": "一日",
      "kana": "いちにち",
      "meaning": "(1) one day"
    },
    "sentence": {
      "japanese": "明日１日休ませてください。",
      "kana": "あした１にちきゅうませてください。",
      "english": "Will you let me have a holiday tomorrow?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0174",
    "example_index": 2,
    "target_vocab": {
      "kanji": "一日",
      "kana": "いちにち",
      "meaning": "(1) one day"
    },
    "sentence": {
      "japanese": "風は１日中吹いた。",
      "kana": "かぜは１にっちゅうふいた。",
      "english": "The wind blew all day.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0175",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "いいえ",
      "meaning": "no"
    },
    "sentence": {
      "japanese": "いいえ、知りません。",
      "kana": "いいえ、しりません。",
      "english": "No, I don't know.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0175",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "いいえ",
      "meaning": "no"
    },
    "sentence": {
      "japanese": "いいえ、知らないです。いつか覚えなければ。",
      "kana": "いいえ、しらないです。いつかおぼえなければ。",
      "english": "No, I don't. I want to learn sometime.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0175",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "いいえ",
      "meaning": "no"
    },
    "sentence": {
      "japanese": "いいえ、少しも。",
      "kana": "いいえ、すこしも。",
      "english": "Not at all.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0176",
    "example_index": 0,
    "target_vocab": {
      "kanji": "小さな",
      "kana": "ちいさな",
      "meaning": "little"
    },
    "sentence": {
      "japanese": "彼女は小さな村で生まれました。",
      "kana": "かのじょはちいさなむらでうまれました。",
      "english": "She was born in a small village.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0176",
    "example_index": 1,
    "target_vocab": {
      "kanji": "小さな",
      "kana": "ちいさな",
      "meaning": "little"
    },
    "sentence": {
      "japanese": "彼は近くの小さな町に住んでいた。",
      "kana": "かれはちかくのちいさなまちにすんでいた。",
      "english": "He lived in a small town nearby.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0176",
    "example_index": 2,
    "target_vocab": {
      "kanji": "小さな",
      "kana": "ちいさな",
      "meaning": "little"
    },
    "sentence": {
      "japanese": "彼のその言葉をとても小さな声で言った。",
      "kana": "かのそのことばをとてもちいさなこえでいった。",
      "english": "He said the words in a very small voice.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0177",
    "example_index": 0,
    "target_vocab": {
      "kanji": "時間",
      "kana": "じかん",
      "meaning": "time"
    },
    "sentence": {
      "japanese": "毎日働く時間帯が違うんです。",
      "kana": "まいにちはたらくじかんたいがちがうんです。",
      "english": "Every day I work different hours.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0177",
    "example_index": 1,
    "target_vocab": {
      "kanji": "時間",
      "kana": "じかん",
      "meaning": "time"
    },
    "sentence": {
      "japanese": "時間があるか分かりません。",
      "kana": "じかんがあるかわかりません。",
      "english": "I don't know if I have the time.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0177",
    "example_index": 2,
    "target_vocab": {
      "kanji": "時間",
      "kana": "じかん",
      "meaning": "time"
    },
    "sentence": {
      "japanese": "夕飯の時間ですよ。",
      "kana": "ゆうはんのじかんですよ。",
      "english": "It's time for dinner.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0178",
    "example_index": 0,
    "target_vocab": {
      "kanji": "上げる",
      "kana": "あげる",
      "meaning": "to give"
    },
    "sentence": {
      "japanese": "いつでも私の車を貸してあげますよ。",
      "kana": "いつでもわたしのくるまをかしてあげますよ。",
      "english": "You can borrow my car anytime.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0178",
    "example_index": 1,
    "target_vocab": {
      "kanji": "上げる",
      "kana": "あげる",
      "meaning": "to give"
    },
    "sentence": {
      "japanese": "生徒はあまり手を挙げません。",
      "kana": "せいとはあまりてをあげません。",
      "english": "Students don't raise their hands much.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0178",
    "example_index": 2,
    "target_vocab": {
      "kanji": "上げる",
      "kana": "あげる",
      "meaning": "to give"
    },
    "sentence": {
      "japanese": "欲しいものは何でもあげるよ。",
      "kana": "ほしいものはなんでもあげるよ。",
      "english": "I will give you whatever you want.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0178",
    "example_index": 3,
    "target_vocab": {
      "kanji": "上げる",
      "kana": "あげる",
      "meaning": "to give"
    },
    "sentence": {
      "japanese": "欲しいものは何でもあげるよ。",
      "kana": "ほしいものはなんでもあげるよ。",
      "english": "I will give you whatever you want.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0178",
    "example_index": 4,
    "target_vocab": {
      "kanji": "上げる",
      "kana": "あげる",
      "meaning": "to give"
    },
    "sentence": {
      "japanese": "弟の本を何冊か貸してあげるよ。",
      "kana": "おとうとのほんをなんさつかかしてあげるよ。",
      "english": "I'll lend you some books of my brother's.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0178",
    "example_index": 5,
    "target_vocab": {
      "kanji": "上げる",
      "kana": "あげる",
      "meaning": "to give"
    },
    "sentence": {
      "japanese": "待ってあげる。",
      "kana": "まってあげる。",
      "english": "I'll wait for you.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0179",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ふろ",
      "meaning": "bath"
    },
    "sentence": {
      "japanese": "彼はふろに水を入れた。",
      "kana": "かれはふろにみずをいれた。",
      "english": "He ran water into the bathtub.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0179",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ふろ",
      "meaning": "bath"
    },
    "sentence": {
      "japanese": "夕飯を食べて、おふろに入って、寝ます。",
      "kana": "ゆうはんをたべて、おふろにいっって、ねます。",
      "english": "I'll eat dinner, take a bath, and go to bed.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0180",
    "example_index": 0,
    "target_vocab": {
      "kanji": "生徒",
      "kana": "せいと",
      "meaning": "pupil"
    },
    "sentence": {
      "japanese": "この学校はたくさんの生徒がいます。",
      "kana": "このがっこうはたくさんのせいとがいます。",
      "english": "This school has many students.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0180",
    "example_index": 1,
    "target_vocab": {
      "kanji": "生徒",
      "kana": "せいと",
      "meaning": "pupil"
    },
    "sentence": {
      "japanese": "生徒はあまり手を挙げません。",
      "kana": "せいとはあまりてをあげません。",
      "english": "Students don't raise their hands much.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0180",
    "example_index": 2,
    "target_vocab": {
      "kanji": "生徒",
      "kana": "せいと",
      "meaning": "pupil"
    },
    "sentence": {
      "japanese": "彼女は生徒を呼んで部屋へ入らせた。",
      "kana": "かのじょはせいとをよんでへやへいらせた。",
      "english": "She called the pupils into the room.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0181",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "レストラン",
      "meaning": "restaurant"
    },
    "sentence": {
      "japanese": "彼女はレストランから出て行った。",
      "kana": "かのじょはれすとらんからでていった。",
      "english": "She went out of the restaurant.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0181",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "レストラン",
      "meaning": "restaurant"
    },
    "sentence": {
      "japanese": "彼らはレストランのテーブルについた。",
      "kana": "かれらはれすとらんのてーぶるについた。",
      "english": "They were seated at a table in a restaurant.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0181",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "レストラン",
      "meaning": "restaurant"
    },
    "sentence": {
      "japanese": "私たちはレストランに行きました。",
      "kana": "わたしたちはれすとらんにいきました。",
      "english": "We went to a restaurant.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0182",
    "example_index": 0,
    "target_vocab": {
      "kanji": "出す",
      "kana": "だす",
      "meaning": "to put out"
    },
    "sentence": {
      "japanese": "その上雨が降り出している。",
      "kana": "そのうえあめがおりだしている。",
      "english": "Besides, it's starting to rain.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0182",
    "example_index": 1,
    "target_vocab": {
      "kanji": "出す",
      "kana": "だす",
      "meaning": "to put out"
    },
    "sentence": {
      "japanese": "ここではおいしい食べ物が出されます。",
      "kana": "ここではおいしいたべものがだされます。",
      "english": "They serve excellent food here.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0182",
    "example_index": 2,
    "target_vocab": {
      "kanji": "出す",
      "kana": "だす",
      "meaning": "to put out"
    },
    "sentence": {
      "japanese": "窓から手を出さないで。",
      "kana": "まどからてをださないで。",
      "english": "Don't stick your hand out of the window.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0182",
    "example_index": 3,
    "target_vocab": {
      "kanji": "出す",
      "kana": "だす",
      "meaning": "to put out"
    },
    "sentence": {
      "japanese": "彼女に手をだすな。",
      "kana": "かのじょにてをだすな。",
      "english": "You stay away from her.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0183",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "かわいい",
      "meaning": "cute"
    },
    "sentence": {
      "japanese": "彼女らはかわいい。",
      "kana": "かのじょらはかわいい。",
      "english": "They are pretty.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0183",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "かわいい",
      "meaning": "cute"
    },
    "sentence": {
      "japanese": "彼女はとてもかわいい。",
      "kana": "かのじょはとてもかわいい。",
      "english": "She is very pretty.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0183",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "かわいい",
      "meaning": "cute"
    },
    "sentence": {
      "japanese": "彼女はとてもかわいいですね。",
      "kana": "かのじょはとてもかわいいですね。",
      "english": "She is very pretty, isn't she?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0184",
    "example_index": 0,
    "target_vocab": {
      "kanji": "音楽",
      "kana": "おんがく",
      "meaning": "music"
    },
    "sentence": {
      "japanese": "音楽が好きで、毎日聴いています。",
      "kana": "おんがくがすきで、まいにちきいています。",
      "english": "I like music, and I listen to it every day.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0184",
    "example_index": 1,
    "target_vocab": {
      "kanji": "音楽",
      "kana": "おんがく",
      "meaning": "music"
    },
    "sentence": {
      "japanese": "彼女は何時間も音楽を聞いた。",
      "kana": "かのじょはなんじかんもおんがくをきいた。",
      "english": "She listened to music for hours.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0184",
    "example_index": 2,
    "target_vocab": {
      "kanji": "音楽",
      "kana": "おんがく",
      "meaning": "music"
    },
    "sentence": {
      "japanese": "彼女は音楽を聞いていた。",
      "kana": "かのじょはおんがくをきいていた。",
      "english": "She was listening to music.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0185",
    "example_index": 0,
    "target_vocab": {
      "kanji": "歌",
      "kana": "うた",
      "meaning": "song"
    },
    "sentence": {
      "japanese": "彼女は上手に歌を歌う。",
      "kana": "かのじょはじょうずにうたをうたう。",
      "english": "She sings well.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0185",
    "example_index": 1,
    "target_vocab": {
      "kanji": "歌",
      "kana": "うた",
      "meaning": "song"
    },
    "sentence": {
      "japanese": "彼女はクラスのどの女の子よりも歌が上手だ。",
      "kana": "かのじょはくらすのどのおんなのこよりもうたがじょうずだ。",
      "english": "She is a better singer than any other student in her class.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0185",
    "example_index": 2,
    "target_vocab": {
      "kanji": "歌",
      "kana": "うた",
      "meaning": "song"
    },
    "sentence": {
      "japanese": "彼女がギターを弾いて、彼が歌を歌った。",
      "kana": "かのじょがぎたーをひいて、かれがうたをうたった。",
      "english": "She played the guitar and he sang.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0186",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "いちばん",
      "meaning": "best"
    },
    "sentence": {
      "japanese": "彼は鼻がいちばん立派だ。",
      "kana": "かれははながいちばんりっぱだ。",
      "english": "His nose is his best feature.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0186",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "いちばん",
      "meaning": "best"
    },
    "sentence": {
      "japanese": "彼はクラスでいちばん勉強する。",
      "kana": "かれはくらすでいちばんべんきょうする。",
      "english": "He studies harder than any other student does in his class.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0186",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "いちばん",
      "meaning": "best"
    },
    "sentence": {
      "japanese": "これが全部の中でいちばん悪い。",
      "kana": "これがぜんぶのなかでいちばんわるい。",
      "english": "This is the worst of all.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0187",
    "example_index": 0,
    "target_vocab": {
      "kanji": "咲く",
      "kana": "さく",
      "meaning": "to bloom"
    },
    "sentence": {
      "japanese": "これらの花は春に咲く。",
      "kana": "これらのはなははるにさく。",
      "english": "These flowers bloom in spring.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0187",
    "example_index": 1,
    "target_vocab": {
      "kanji": "咲く",
      "kana": "さく",
      "meaning": "to bloom"
    },
    "sentence": {
      "japanese": "たおやかな花が咲いている。",
      "kana": "たおやかなはながさいている。",
      "english": "The delicate, graceful flowers are in bloom.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0187",
    "example_index": 2,
    "target_vocab": {
      "kanji": "咲く",
      "kana": "さく",
      "meaning": "to bloom"
    },
    "sentence": {
      "japanese": "彼の庭はいつも様々な花が咲く。",
      "kana": "かのにわはいつもさまざまなはながさく。",
      "english": "Many kinds of flowers always come out in his garden.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0188",
    "example_index": 0,
    "target_vocab": {
      "kanji": "山",
      "kana": "やま",
      "meaning": "mountain"
    },
    "sentence": {
      "japanese": "私は山にいました。",
      "kana": "わたしはやまにいました。",
      "english": "I was in the mountains.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0188",
    "example_index": 1,
    "target_vocab": {
      "kanji": "山",
      "kana": "やま",
      "meaning": "mountain"
    },
    "sentence": {
      "japanese": "彼女はいつかあの山に登るだろう。",
      "kana": "かのじょはいつかあのやまにのぼるだろう。",
      "english": "She is going to climb that mountain someday.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0188",
    "example_index": 2,
    "target_vocab": {
      "kanji": "山",
      "kana": "やま",
      "meaning": "mountain"
    },
    "sentence": {
      "japanese": "彼は向こうの上、あの山の上に住んでいます。",
      "kana": "かれはむこうのうえ、あのやまのうえにすんでいます。",
      "english": "He lives up there, up on that mountain.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0188",
    "example_index": 3,
    "target_vocab": {
      "kanji": "山",
      "kana": "やま",
      "meaning": "mountain"
    },
    "sentence": {
      "japanese": "雨は一晩中やまなかった。",
      "kana": "あめはひとばんじゅうやまなかった。",
      "english": "The rain never let up all night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0188",
    "example_index": 4,
    "target_vocab": {
      "kanji": "山",
      "kana": "やま",
      "meaning": "mountain"
    },
    "sentence": {
      "japanese": "雨がやまなかったらいきません。",
      "kana": "あめがやまなかったらいきません。",
      "english": "I will not go unless it stops raining.",
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
