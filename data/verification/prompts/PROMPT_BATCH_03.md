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

**Batch Number**: 3
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0038",
    "example_index": 2,
    "target_vocab": {
      "kanji": "中",
      "kana": "なか",
      "meaning": "middle"
    },
    "sentence": {
      "japanese": "部屋の中は暗くて寒かった。",
      "kana": "へやのなかはくらくてさむかった。",
      "english": "It was dark and cold in the room.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0038",
    "example_index": 3,
    "target_vocab": {
      "kanji": "中",
      "kana": "なか",
      "meaning": "middle"
    },
    "sentence": {
      "japanese": "花瓶のなかには何本の花がはいっていますか。",
      "kana": "かびんのなかにはなんぼんのはながはいっていますか。",
      "english": "How many flowers are there in the vase?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0038",
    "example_index": 4,
    "target_vocab": {
      "kanji": "中",
      "kana": "なか",
      "meaning": "middle"
    },
    "sentence": {
      "japanese": "電車のなかに傘を忘れてきた。",
      "kana": "でんしゃのなかにかさをわすれてきた。",
      "english": "I left my umbrella on the train.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0039",
    "example_index": 0,
    "target_vocab": {
      "kanji": "消す",
      "kana": "けす",
      "meaning": "to erase"
    },
    "sentence": {
      "japanese": "寝る前に電気を消してください。",
      "kana": "ねるまえにでんきをけしてください。",
      "english": "Turn off the light before you go to bed.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0039",
    "example_index": 1,
    "target_vocab": {
      "kanji": "消す",
      "kana": "けす",
      "meaning": "to erase"
    },
    "sentence": {
      "japanese": "電気を消すのを忘れないで。",
      "kana": "でんきをけすのをわすれないで。",
      "english": "Don't forget to turn the light off.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0039",
    "example_index": 2,
    "target_vocab": {
      "kanji": "消す",
      "kana": "けす",
      "meaning": "to erase"
    },
    "sentence": {
      "japanese": "彼女はラジオを消した。",
      "kana": "かのじょはらじおをけした。",
      "english": "She turned off the radio.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0040",
    "example_index": 0,
    "target_vocab": {
      "kanji": "近く",
      "kana": "ちかく",
      "meaning": "near"
    },
    "sentence": {
      "japanese": "夕方近く雨が降りだした。",
      "kana": "ゆうがたちかくあめがおりだした。",
      "english": "It came to rain toward evening.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0040",
    "example_index": 1,
    "target_vocab": {
      "kanji": "近く",
      "kana": "ちかく",
      "meaning": "near"
    },
    "sentence": {
      "japanese": "僕の家この近くなんだ。",
      "kana": "ぼくのいえこのちかくなんだ。",
      "english": "My apartment is near here.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0040",
    "example_index": 2,
    "target_vocab": {
      "kanji": "近く",
      "kana": "ちかく",
      "meaning": "near"
    },
    "sentence": {
      "japanese": "彼女は学校の近くに住んでいるようだ。",
      "kana": "かのじょはがっこうのちかくにすんでいるようだ。",
      "english": "It seems that she lives in the neighborhood of the school.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0043",
    "example_index": 0,
    "target_vocab": {
      "kanji": "目",
      "kana": "め",
      "meaning": "eye"
    },
    "sentence": {
      "japanese": "その店は私の家の目と鼻の先にある。",
      "kana": "そのみせはわたしのいえのめとはなのさきにある。",
      "english": "The store is close to my house.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0043",
    "example_index": 1,
    "target_vocab": {
      "kanji": "目",
      "kana": "め",
      "meaning": "eye"
    },
    "sentence": {
      "japanese": "目が疲れやすいです。",
      "kana": "めがつかれやすいです。",
      "english": "My eyes get tired very easily.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0043",
    "example_index": 2,
    "target_vocab": {
      "kanji": "目",
      "kana": "め",
      "meaning": "eye"
    },
    "sentence": {
      "japanese": "彼は二枚目だ。",
      "kana": "かれはにまいめだ。",
      "english": "He is a handsome man.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0043",
    "example_index": 3,
    "target_vocab": {
      "kanji": "目",
      "kana": "め",
      "meaning": "eye"
    },
    "sentence": {
      "japanese": "あけおめ！",
      "kana": "あけおめ！",
      "english": "Happy New Year!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0043",
    "example_index": 4,
    "target_vocab": {
      "kanji": "目",
      "kana": "め",
      "meaning": "eye"
    },
    "sentence": {
      "japanese": "あけおめ〜〜〜〜。",
      "kana": "あけおめ〜〜〜〜。",
      "english": "Happy New Year!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0044",
    "example_index": 0,
    "target_vocab": {
      "kanji": "空",
      "kana": "そら",
      "meaning": "sky"
    },
    "sentence": {
      "japanese": "ワシが空を飛んでいる。",
      "kana": "わしがそらをとんでいる。",
      "english": "An eagle is flying in the sky.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0044",
    "example_index": 1,
    "target_vocab": {
      "kanji": "空",
      "kana": "そら",
      "meaning": "sky"
    },
    "sentence": {
      "japanese": "なぜ空が青いか知っているか。",
      "kana": "なぜそらがあおいかしっているか。",
      "english": "Do you know why the sky is blue?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0044",
    "example_index": 2,
    "target_vocab": {
      "kanji": "空",
      "kana": "そら",
      "meaning": "sky"
    },
    "sentence": {
      "japanese": "夜の空は、とても綺麗なものだ。",
      "kana": "よるのそらは、とてもきれいなものだ。",
      "english": "The sky in the night is a very clean thing.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0044",
    "example_index": 3,
    "target_vocab": {
      "kanji": "空",
      "kana": "そら",
      "meaning": "sky"
    },
    "sentence": {
      "japanese": "はい。これならそらで歌えます。",
      "kana": "はい。これならそらでうたえます。",
      "english": "Yes. This one I can sing from memory.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0044",
    "example_index": 4,
    "target_vocab": {
      "kanji": "空",
      "kana": "そら",
      "meaning": "sky"
    },
    "sentence": {
      "japanese": "そらバスが来た。",
      "kana": "そらばすがきた。",
      "english": "Here's the bus.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0044",
    "example_index": 5,
    "target_vocab": {
      "kanji": "空",
      "kana": "そら",
      "meaning": "sky"
    },
    "sentence": {
      "japanese": "それをそらで言ってください。",
      "kana": "それをそらでいってください。",
      "english": "Please say it by heart.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0046",
    "example_index": 0,
    "target_vocab": {
      "kanji": "座る",
      "kana": "すわる",
      "meaning": "to sit"
    },
    "sentence": {
      "japanese": "彼女は木の下に座っていた。",
      "kana": "かのじょはきのしたにすわっていた。",
      "english": "She was sitting under a tree.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0046",
    "example_index": 1,
    "target_vocab": {
      "kanji": "座る",
      "kana": "すわる",
      "meaning": "to sit"
    },
    "sentence": {
      "japanese": "彼女は彼に座ってくださいと言った。",
      "kana": "かのじょはかれにすわってくださいといった。",
      "english": "She asked him to sit down.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0046",
    "example_index": 2,
    "target_vocab": {
      "kanji": "座る",
      "kana": "すわる",
      "meaning": "to sit"
    },
    "sentence": {
      "japanese": "彼女は私のとなりに座った。",
      "kana": "かのじょはわたしのとなりにすわった。",
      "english": "She sat next to me.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0047",
    "example_index": 0,
    "target_vocab": {
      "kanji": "年",
      "kana": "とし",
      "meaning": "year"
    },
    "sentence": {
      "japanese": "わたしは去年一年生でした。",
      "kana": "わたしはきょねんいちねんせいでした。",
      "english": "I was a first year student last year.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0047",
    "example_index": 1,
    "target_vocab": {
      "kanji": "年",
      "kana": "とし",
      "meaning": "year"
    },
    "sentence": {
      "japanese": "彼はとても年をとっているけれどたっしゃだ。",
      "kana": "かれはとてもねんをとっているけれどたっしゃだ。",
      "english": "Although he is very old, he is strong.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0047",
    "example_index": 2,
    "target_vocab": {
      "kanji": "年",
      "kana": "とし",
      "meaning": "year"
    },
    "sentence": {
      "japanese": "君と僕とは同じ年だ。",
      "kana": "くんとぼくとはおなじねんだ。",
      "english": "You and I are the same age.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0048",
    "example_index": 0,
    "target_vocab": {
      "kanji": "男の子",
      "kana": "おとこのこ",
      "meaning": "boy"
    },
    "sentence": {
      "japanese": "その男の子は向こうにいます。",
      "kana": "そのおとこのこはむこうにいます。",
      "english": "The boy is over there.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0048",
    "example_index": 1,
    "target_vocab": {
      "kanji": "男の子",
      "kana": "おとこのこ",
      "meaning": "boy"
    },
    "sentence": {
      "japanese": "「わたしは、年とっていて遊べないね」男の子は言いました。",
      "kana": "「わたしは、ねんとっていてあそべないね」おとこのこはいいました。",
      "english": "\"I am too old and sad to play,\" said the boy.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0048",
    "example_index": 2,
    "target_vocab": {
      "kanji": "男の子",
      "kana": "おとこのこ",
      "meaning": "boy"
    },
    "sentence": {
      "japanese": "彼女には男の子が１人と女の子が２人ある。",
      "kana": "かのじょにはおとこのこが１にんとおんなのこが２にんある。",
      "english": "She has a son and two daughters.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0049",
    "example_index": 0,
    "target_vocab": {
      "kanji": "狭い",
      "kana": "せまい",
      "meaning": "narrow"
    },
    "sentence": {
      "japanese": "彼らは狭い道を歩いていった。",
      "kana": "かれらはせまいみちをあるいていった。",
      "english": "They walked along a narrow path.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0049",
    "example_index": 1,
    "target_vocab": {
      "kanji": "狭い",
      "kana": "せまい",
      "meaning": "narrow"
    },
    "sentence": {
      "japanese": "私の部屋はとても狭いの。",
      "kana": "わたしのへやはとてもせまいの。",
      "english": "My room is very small.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0049",
    "example_index": 2,
    "target_vocab": {
      "kanji": "狭い",
      "kana": "せまい",
      "meaning": "narrow"
    },
    "sentence": {
      "japanese": "私の家は庭がせまい。",
      "kana": "わたしのいえはにわがせまい。",
      "english": "My house has a small yard.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0049",
    "example_index": 3,
    "target_vocab": {
      "kanji": "狭い",
      "kana": "せまい",
      "meaning": "narrow"
    },
    "sentence": {
      "japanese": "私の家は庭がせまい。",
      "kana": "わたしのいえはにわがせまい。",
      "english": "My house has a small yard.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0051",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "カメラ",
      "meaning": "camera"
    },
    "sentence": {
      "japanese": "僕は君と同じカメラを買った。",
      "kana": "ぼくはくんとおなじかめらをかった。",
      "english": "I have bought the same camera as you have.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0051",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "カメラ",
      "meaning": "camera"
    },
    "sentence": {
      "japanese": "僕はこのカメラが欲しい。",
      "kana": "ぼくはこのかめらがほしい。",
      "english": "I would like to have this camera.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0051",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "カメラ",
      "meaning": "camera"
    },
    "sentence": {
      "japanese": "彼女がそこで買ったのは、カメラだった。",
      "kana": "かのじょがそこでかったのは、かめらだった。",
      "english": "It was a camera that she bought there.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0052",
    "example_index": 0,
    "target_vocab": {
      "kanji": "玄関",
      "kana": "げんかん",
      "meaning": "entry hall"
    },
    "sentence": {
      "japanese": "誰か玄関に来てるよ。",
      "kana": "だれかげんかんにきてるよ。",
      "english": "Someone is at the front door.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0052",
    "example_index": 1,
    "target_vocab": {
      "kanji": "玄関",
      "kana": "げんかん",
      "meaning": "entry hall"
    },
    "sentence": {
      "japanese": "誰かが玄関にいるよ。",
      "kana": "だれかがげんかんにいるよ。",
      "english": "Someone is at the front door.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0052",
    "example_index": 2,
    "target_vocab": {
      "kanji": "玄関",
      "kana": "げんかん",
      "meaning": "entry hall"
    },
    "sentence": {
      "japanese": "私は玄関のところまで行った。",
      "kana": "わたしはげんかんのところまでいった。",
      "english": "I went up to the front door.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0053",
    "example_index": 0,
    "target_vocab": {
      "kanji": "違う",
      "kana": "ちがう",
      "meaning": "to differ"
    },
    "sentence": {
      "japanese": "君は違う方にいきますよ。",
      "kana": "くんはちがうほうにいきますよ。",
      "english": "You're going the wrong way.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0053",
    "example_index": 1,
    "target_vocab": {
      "kanji": "違う",
      "kana": "ちがう",
      "meaning": "to differ"
    },
    "sentence": {
      "japanese": "毎日働く時間帯が違うんです。",
      "kana": "まいにちはたらくじかんたいがちがうんです。",
      "english": "Every day I work different hours.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0053",
    "example_index": 2,
    "target_vocab": {
      "kanji": "違う",
      "kana": "ちがう",
      "meaning": "to differ"
    },
    "sentence": {
      "japanese": "私は違います。あなたです。",
      "kana": "わたしはちがいます。あなたです。",
      "english": "No I'm not; you are!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0053",
    "example_index": 3,
    "target_vocab": {
      "kanji": "違う",
      "kana": "ちがう",
      "meaning": "to differ"
    },
    "sentence": {
      "japanese": "私は学生だが彼はちがう。",
      "kana": "わたしはがくせいだがかれはちがう。",
      "english": "I am a student, but he isn't.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0054",
    "example_index": 0,
    "target_vocab": {
      "kanji": "危ない",
      "kana": "あぶない",
      "meaning": "dangerous"
    },
    "sentence": {
      "japanese": "彼はとても危ない人だ。",
      "kana": "かれはとてもあぶないにんだ。",
      "english": "He is very a dangerous man.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0054",
    "example_index": 1,
    "target_vocab": {
      "kanji": "危ない",
      "kana": "あぶない",
      "meaning": "dangerous"
    },
    "sentence": {
      "japanese": "危ない！",
      "kana": "あぶない！",
      "english": "Look out!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0054",
    "example_index": 2,
    "target_vocab": {
      "kanji": "危ない",
      "kana": "あぶない",
      "meaning": "dangerous"
    },
    "sentence": {
      "japanese": "そのふるい橋をわたるのは危ない。",
      "kana": "そのふるいはしをわたるのはあぶない。",
      "english": "It is dangerous to cross that old bridge.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0055",
    "example_index": 0,
    "target_vocab": {
      "kanji": "分かる",
      "kana": "わかる",
      "meaning": "to be understood"
    },
    "sentence": {
      "japanese": "私は彼の名前の読み方がわからない。",
      "kana": "わたしはかのなまえのよみかたがわからない。",
      "english": "I don't know how to pronounce his name.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0055",
    "example_index": 1,
    "target_vocab": {
      "kanji": "分かる",
      "kana": "わかる",
      "meaning": "to be understood"
    },
    "sentence": {
      "japanese": "この町は西も東も分かりません。",
      "kana": "このまちはにしもひがしもわかりません。",
      "english": "I'm quite a stranger in this town.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0055",
    "example_index": 2,
    "target_vocab": {
      "kanji": "分かる",
      "kana": "わかる",
      "meaning": "to be understood"
    },
    "sentence": {
      "japanese": "それが何かぼくにはわかっている。",
      "kana": "それがなにかぼくにはわかっている。",
      "english": "I have an idea what it is.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0055",
    "example_index": 3,
    "target_vocab": {
      "kanji": "分かる",
      "kana": "わかる",
      "meaning": "to be understood"
    },
    "sentence": {
      "japanese": "彼女は音楽がわかる。",
      "kana": "かのじょはおんがくがわかる。",
      "english": "She understands music.",
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
