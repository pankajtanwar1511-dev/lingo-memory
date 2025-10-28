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

**Batch Number**: 15
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0242",
    "example_index": 1,
    "target_vocab": {
      "kanji": "悪い",
      "kana": "わるい",
      "meaning": "bad"
    },
    "sentence": {
      "japanese": "彼女は人が悪い。",
      "kana": "かのじょはにんがわるい。",
      "english": "She is ill-natured.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0242",
    "example_index": 2,
    "target_vocab": {
      "kanji": "悪い",
      "kana": "わるい",
      "meaning": "bad"
    },
    "sentence": {
      "japanese": "目に悪いから暗いところで本を読んではいけない。",
      "kana": "めにわるいからくらいところでほんをよんではいけない。",
      "english": "Don't read under insufficient light, for it is bad for your eyes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0243",
    "example_index": 0,
    "target_vocab": {
      "kanji": "青い",
      "kana": "あおい",
      "meaning": "blue"
    },
    "sentence": {
      "japanese": "なぜ空が青いか知っているか。",
      "kana": "なぜそらがあおいかしっているか。",
      "english": "Do you know why the sky is blue?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0243",
    "example_index": 1,
    "target_vocab": {
      "kanji": "青い",
      "kana": "あおい",
      "meaning": "blue"
    },
    "sentence": {
      "japanese": "お前はまだ「青い」な。",
      "kana": "おまえはまだ「あおい」な。",
      "english": "You're still green.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0243",
    "example_index": 2,
    "target_vocab": {
      "kanji": "青い",
      "kana": "あおい",
      "meaning": "blue"
    },
    "sentence": {
      "japanese": "彼女は青い服を着ています。",
      "kana": "かのじょはあおいふくをきています。",
      "english": "She is wearing a blue dress.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0244",
    "example_index": 0,
    "target_vocab": {
      "kanji": "住む",
      "kana": "すむ",
      "meaning": "to live in"
    },
    "sentence": {
      "japanese": "どこに住んでいますか？",
      "kana": "どこにすんでいますか？",
      "english": "Where do you live?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0244",
    "example_index": 1,
    "target_vocab": {
      "kanji": "住む",
      "kana": "すむ",
      "meaning": "to live in"
    },
    "sentence": {
      "japanese": "隣の家には誰が住んでいるんですか。",
      "kana": "となりのいえにはだれがすんでいるんですか。",
      "english": "Who lives in the house next door?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0244",
    "example_index": 2,
    "target_vocab": {
      "kanji": "住む",
      "kana": "すむ",
      "meaning": "to live in"
    },
    "sentence": {
      "japanese": "彼女は彼の隣に住んでいる。",
      "kana": "かのじょはかのとなりにすんでいる。",
      "english": "She lives next door to him.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0244",
    "example_index": 3,
    "target_vocab": {
      "kanji": "住む",
      "kana": "すむ",
      "meaning": "to live in"
    },
    "sentence": {
      "japanese": "テレビなんかなくてすむ。",
      "kana": "てれびなんかなくてすむ。",
      "english": "We can do without a television, can't we?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0244",
    "example_index": 4,
    "target_vocab": {
      "kanji": "住む",
      "kana": "すむ",
      "meaning": "to live in"
    },
    "sentence": {
      "japanese": "それで私は彼に手紙を書かずにすむだろう。",
      "kana": "それでわたしはかれにてがみをかかずにすむだろう。",
      "english": "That will save me the trouble of writing to him.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0245",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "かける",
      "meaning": "to call by phone"
    },
    "sentence": {
      "japanese": "あまりそれを鼻にかけるな。",
      "kana": "あまりそれをはなにかけるな。",
      "english": "Don't boast too much about that.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0245",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "かける",
      "meaning": "to call by phone"
    },
    "sentence": {
      "japanese": "私達は今でかけるところだ。",
      "kana": "わたしたちはいまでかけるところだ。",
      "english": "We are just going to leave.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0245",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "かける",
      "meaning": "to call by phone"
    },
    "sentence": {
      "japanese": "昨夜、彼女に電話をかけるのを忘れました。",
      "kana": "さくや、かのじょにでんわをかけるのをわすれました。",
      "english": "I forgot to call her last night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0247",
    "example_index": 0,
    "target_vocab": {
      "kanji": "忘れる",
      "kana": "わすれる",
      "meaning": "to forget"
    },
    "sentence": {
      "japanese": "彼は人の名前を忘れやすい。",
      "kana": "かれはにんのなまえをわすれやすい。",
      "english": "He is apt to forget people's name.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0247",
    "example_index": 1,
    "target_vocab": {
      "kanji": "忘れる",
      "kana": "わすれる",
      "meaning": "to forget"
    },
    "sentence": {
      "japanese": "電気を消すのを忘れないで。",
      "kana": "でんきをけすのをわすれないで。",
      "english": "Don't forget to turn the light off.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0247",
    "example_index": 2,
    "target_vocab": {
      "kanji": "忘れる",
      "kana": "わすれる",
      "meaning": "to forget"
    },
    "sentence": {
      "japanese": "明日彼と話をするのを忘れてはいけませんよ。",
      "kana": "あしたかれとはなしをするのをわすれてはいけませんよ。",
      "english": "Don't forget to talk with him tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0249",
    "example_index": 0,
    "target_vocab": {
      "kanji": "写真",
      "kana": "しゃしん",
      "meaning": "photograph"
    },
    "sentence": {
      "japanese": "これは私の妹を撮った写真です。",
      "kana": "これはわたしのいもうとをとったしゃしんです。",
      "english": "This is a picture of my sister.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0249",
    "example_index": 1,
    "target_vocab": {
      "kanji": "写真",
      "kana": "しゃしん",
      "meaning": "photograph"
    },
    "sentence": {
      "japanese": "あなたに何枚かの写真を見せましょう。",
      "kana": "あなたになんまいかのしゃしんをみせましょう。",
      "english": "I will show you some pictures.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0249",
    "example_index": 2,
    "target_vocab": {
      "kanji": "写真",
      "kana": "しゃしん",
      "meaning": "photograph"
    },
    "sentence": {
      "japanese": "私は家族の写真を撮った。",
      "kana": "わたしはかぞくのしゃしんをとった。",
      "english": "I took a picture of my family.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0250",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ゼロ",
      "meaning": "zero"
    },
    "sentence": {
      "japanese": "一の前はゼロです。",
      "kana": "いちのまえはぜろです。",
      "english": "Zero comes before one.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0251",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "いろいろ",
      "meaning": "various"
    },
    "sentence": {
      "japanese": "彼の話はいろいろなところへ飛ぶ。",
      "kana": "かのはなしはいろいろなところへとぶ。",
      "english": "He frequently jumps from one topic to another while he is talking.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0251",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "いろいろ",
      "meaning": "various"
    },
    "sentence": {
      "japanese": "彼はいろいろ知っている。",
      "kana": "かれはいろいろしっている。",
      "english": "He knows lots.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0251",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "いろいろ",
      "meaning": "various"
    },
    "sentence": {
      "japanese": "彼の家はいろいろと便利だ。",
      "kana": "かのいえはいろいろとべんりだ。",
      "english": "His house is full of convenience.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0252",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "もう",
      "meaning": "already"
    },
    "sentence": {
      "japanese": "もう朝から晩まで働いてクタクタだよ。",
      "kana": "もうあさからばんまではたらいてくたくただよ。",
      "english": "I'm beat. I've been working from dawn to dusk.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0252",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "もう",
      "meaning": "already"
    },
    "sentence": {
      "japanese": "私はもうあなたに夢中、メロメロなのよ。",
      "kana": "わたしはもうあなたにむちゅう、めろめろなのよ。",
      "english": "I'm stuck on you - really far gone.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0252",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "もう",
      "meaning": "already"
    },
    "sentence": {
      "japanese": "もう手が冷たくって。",
      "kana": "もうてがつめたくって。",
      "english": "My hand's getting too cold.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0253",
    "example_index": 0,
    "target_vocab": {
      "kanji": "会う",
      "kana": "あう",
      "meaning": "to meet"
    },
    "sentence": {
      "japanese": "いつものところでいつもの人達に会った。",
      "kana": "いつものところでいつものひとたちにあった。",
      "english": "I met the usual people at the usual place.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0253",
    "example_index": 1,
    "target_vocab": {
      "kanji": "会う",
      "kana": "あう",
      "meaning": "to meet"
    },
    "sentence": {
      "japanese": "あなたの妹さんに会いたいものです。",
      "kana": "あなたのいもうとさんにあいたいものです。",
      "english": "I'd like to see your sister.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0253",
    "example_index": 2,
    "target_vocab": {
      "kanji": "会う",
      "kana": "あう",
      "meaning": "to meet"
    },
    "sentence": {
      "japanese": "ある学生に会うところです。",
      "kana": "あるがくせいにあうところです。",
      "english": "I'm going to meet a certain student.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0253",
    "example_index": 3,
    "target_vocab": {
      "kanji": "会う",
      "kana": "あう",
      "meaning": "to meet"
    },
    "sentence": {
      "japanese": "この帽子はよく服とあう。",
      "kana": "このぼうしはよくふくとあう。",
      "english": "This hat goes together with the dress.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0253",
    "example_index": 4,
    "target_vocab": {
      "kanji": "会う",
      "kana": "あう",
      "meaning": "to meet"
    },
    "sentence": {
      "japanese": "このスカートは体にちょうどよくあう。",
      "kana": "このすかーとはからだにちょうどよくあう。",
      "english": "This skirt hangs nicely.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0254",
    "example_index": 0,
    "target_vocab": {
      "kanji": "南",
      "kana": "みなみ",
      "meaning": "south"
    },
    "sentence": {
      "japanese": "風は南へ吹く。",
      "kana": "かぜはみなみへふく。",
      "english": "The wind blows south.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0254",
    "example_index": 1,
    "target_vocab": {
      "kanji": "南",
      "kana": "みなみ",
      "meaning": "south"
    },
    "sentence": {
      "japanese": "鳥は南へ飛んで行った。",
      "kana": "とりはみなみへとんでいった。",
      "english": "The birds flew to the south.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0254",
    "example_index": 2,
    "target_vocab": {
      "kanji": "南",
      "kana": "みなみ",
      "meaning": "south"
    },
    "sentence": {
      "japanese": "鳥は冬になると南へ飛んでいきます。",
      "kana": "とりはふゆになるとみなみへとんでいきます。",
      "english": "Birds fly south in winter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0256",
    "example_index": 0,
    "target_vocab": {
      "kanji": "着る",
      "kana": "きる",
      "meaning": "to put on from the shoulders down"
    },
    "sentence": {
      "japanese": "あなたはシャツをあべこべに着ている。",
      "kana": "あなたはしゃつをあべこべにきている。",
      "english": "You are wearing your shirt inside out.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0256",
    "example_index": 1,
    "target_vocab": {
      "kanji": "着る",
      "kana": "きる",
      "meaning": "to put on from the shoulders down"
    },
    "sentence": {
      "japanese": "彼はくたくたの背広を着ていた。",
      "kana": "かれはくたくたのせびろをきていた。",
      "english": "He was wearing a threadbare suit.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0256",
    "example_index": 2,
    "target_vocab": {
      "kanji": "着る",
      "kana": "きる",
      "meaning": "to put on from the shoulders down"
    },
    "sentence": {
      "japanese": "彼はそのそばでシャツをすうっと着た。",
      "kana": "かれはそのそばでしゃつをすうっときた。",
      "english": "He slipped the gaudy shirt on.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0257",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "そこ",
      "meaning": "that place"
    },
    "sentence": {
      "japanese": "彼女はそこらにいますか。",
      "kana": "かのじょはそこらにいますか。",
      "english": "Is she anywhere about?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0257",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "そこ",
      "meaning": "that place"
    },
    "sentence": {
      "japanese": "ちょっと、そこのきみ！",
      "kana": "ちょっと、そこのきみ！",
      "english": "Hey, you there!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0257",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "そこ",
      "meaning": "that place"
    },
    "sentence": {
      "japanese": "私が先にそこへ着くよ。",
      "kana": "わたしがさきにそこへつくよ。",
      "english": "I'll get there before you will.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0259",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "どの",
      "meaning": "which"
    },
    "sentence": {
      "japanese": "彼女はどのような人ですか。",
      "kana": "かのじょはどのようなにんですか。",
      "english": "What is she like?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0259",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "どの",
      "meaning": "which"
    },
    "sentence": {
      "japanese": "彼女はクラスのどの女の子よりも歌が上手だ。",
      "kana": "かのじょはくらすのどのおんなのこよりもうたがじょうずだ。",
      "english": "She is a better singer than any other student in her class.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0259",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "どの",
      "meaning": "which"
    },
    "sentence": {
      "japanese": "彼らはそれをどのようにするかを知らない。",
      "kana": "かれらはそれをどのようにするかをしらない。",
      "english": "They do not know how to do it.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0260",
    "example_index": 0,
    "target_vocab": {
      "kanji": "読む",
      "kana": "よむ",
      "meaning": "to read"
    },
    "sentence": {
      "japanese": "とても暗いので私は本が読めない。",
      "kana": "とてもくらいのでわたしはほんがよめない。",
      "english": "It is too dark for me to read.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0260",
    "example_index": 1,
    "target_vocab": {
      "kanji": "読む",
      "kana": "よむ",
      "meaning": "to read"
    },
    "sentence": {
      "japanese": "私は彼の名前の読み方がわからない。",
      "kana": "わたしはかのなまえのよみかたがわからない。",
      "english": "I don't know how to pronounce his name.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0260",
    "example_index": 2,
    "target_vocab": {
      "kanji": "読む",
      "kana": "よむ",
      "meaning": "to read"
    },
    "sentence": {
      "japanese": "私はメガネがなくては読めない。",
      "kana": "わたしはめがねがなくてはよめない。",
      "english": "I cannot read without glasses.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0262",
    "example_index": 0,
    "target_vocab": {
      "kanji": "来月",
      "kana": "らいげつ",
      "meaning": "next month"
    },
    "sentence": {
      "japanese": "来月はとても忙しいだろう。",
      "kana": "らいげつはとてもいそがしいだろう。",
      "english": "I'll be very busy next month.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0262",
    "example_index": 1,
    "target_vocab": {
      "kanji": "来月",
      "kana": "らいげつ",
      "meaning": "next month"
    },
    "sentence": {
      "japanese": "彼らは来月結婚するだろう。",
      "kana": "かれらはらいげつけっこんするだろう。",
      "english": "They will get married next month.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0263",
    "example_index": 0,
    "target_vocab": {
      "kanji": "果物",
      "kana": "くだもの",
      "meaning": "fruit"
    },
    "sentence": {
      "japanese": "もっと果物を食べるべきです。",
      "kana": "もっとくだものをたべるべきです。",
      "english": "You should eat more fruit.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0263",
    "example_index": 1,
    "target_vocab": {
      "kanji": "果物",
      "kana": "くだもの",
      "meaning": "fruit"
    },
    "sentence": {
      "japanese": "彼らは果物が好きです。",
      "kana": "かれらはくだものがすきです。",
      "english": "They are fond of fruit.",
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
