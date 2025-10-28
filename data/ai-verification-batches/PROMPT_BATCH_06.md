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

**Batch Number**: 6
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0090",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "スポーツ",
      "meaning": "sport"
    },
    "sentence": {
      "japanese": "彼は音楽もスポーツも好きです。",
      "kana": "かれはおんがくもすぽーつもすきです。",
      "english": "He likes both music and sports.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0090",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "スポーツ",
      "meaning": "sport"
    },
    "sentence": {
      "japanese": "彼は音楽と同様スポーツも好きです。",
      "kana": "かれはおんがくとどうようすぽーつもすきです。",
      "english": "He likes sports as well as music.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0090",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "スポーツ",
      "meaning": "sport"
    },
    "sentence": {
      "japanese": "私はスポーツより音楽の方が好きだ。",
      "kana": "わたしはすぽーつよりおんがくのほうがすきだ。",
      "english": "I like music better than sports.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0091",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "どっち",
      "meaning": "which"
    },
    "sentence": {
      "japanese": "春と秋、どっちが好きですか？",
      "kana": "はるとあき、どっちがすきですか？",
      "english": "Which do you prefer, spring or autumn?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0091",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "どっち",
      "meaning": "which"
    },
    "sentence": {
      "japanese": "仕事と家庭どっちが大切なの？",
      "kana": "しごととかていどっちがたいせつなの？",
      "english": "Which comes first, your career or your family?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0091",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "どっち",
      "meaning": "which"
    },
    "sentence": {
      "japanese": "紅茶とコーヒーとどっちが好きですか。",
      "kana": "こうちゃとこーひーとどっちがすきですか。",
      "english": "Which do you like better, tea or coffee?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0092",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "そば",
      "meaning": "near"
    },
    "sentence": {
      "japanese": "彼はそのそばでシャツをすうっと着た。",
      "kana": "かれはそのそばでしゃつをすうっときた。",
      "english": "He slipped the gaudy shirt on.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0092",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "そば",
      "meaning": "near"
    },
    "sentence": {
      "japanese": "あの窓のそばの机は使うな。",
      "kana": "あのまどのそばのつくえはつかうな。",
      "english": "Don't use the desk by that window.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0092",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "そば",
      "meaning": "near"
    },
    "sentence": {
      "japanese": "彼女は彼のそばに立っていた。",
      "kana": "かのじょはかのそばにたっていた。",
      "english": "She stood by him.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0093",
    "example_index": 0,
    "target_vocab": {
      "kanji": "新聞",
      "kana": "しんぶん",
      "meaning": "newspaper"
    },
    "sentence": {
      "japanese": "彼は毎朝、新聞を読む。",
      "kana": "かれはまいあさ、しんぶんをよむ。",
      "english": "He reads the paper every morning.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0093",
    "example_index": 1,
    "target_vocab": {
      "kanji": "新聞",
      "kana": "しんぶん",
      "meaning": "newspaper"
    },
    "sentence": {
      "japanese": "彼は新聞を読んでいた。",
      "kana": "かれはしんぶんをよんでいた。",
      "english": "He was reading a newspaper.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0093",
    "example_index": 2,
    "target_vocab": {
      "kanji": "新聞",
      "kana": "しんぶん",
      "meaning": "newspaper"
    },
    "sentence": {
      "japanese": "彼は新聞を読むのが好きだ。",
      "kana": "かれはしんぶんをよむのがすきだ。",
      "english": "He likes to read newspapers.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0095",
    "example_index": 0,
    "target_vocab": {
      "kanji": "庭",
      "kana": "にわ",
      "meaning": "garden"
    },
    "sentence": {
      "japanese": "彼女は、なんて奇麗な庭でしょうと言った。",
      "kana": "かのじょは、なんてきれいなにわでしょうといった。",
      "english": "She cried what a lovely garden it was.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0095",
    "example_index": 1,
    "target_vocab": {
      "kanji": "庭",
      "kana": "にわ",
      "meaning": "garden"
    },
    "sentence": {
      "japanese": "彼らは庭に出ています。",
      "kana": "かれらはにわにでています。",
      "english": "They are out in the garden.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0095",
    "example_index": 2,
    "target_vocab": {
      "kanji": "庭",
      "kana": "にわ",
      "meaning": "garden"
    },
    "sentence": {
      "japanese": "彼の庭はいつも様々な花が咲く。",
      "kana": "かのにわはいつもさまざまなはながさく。",
      "english": "Many kinds of flowers always come out in his garden.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0096",
    "example_index": 0,
    "target_vocab": {
      "kanji": "大きな",
      "kana": "おおきな",
      "meaning": "big"
    },
    "sentence": {
      "japanese": "おやまあ、なんて大きな箱なの。",
      "kana": "おやまあ、なんておおきなはこなの。",
      "english": "My heavens, what an enormous box!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0096",
    "example_index": 1,
    "target_vocab": {
      "kanji": "大きな",
      "kana": "おおきな",
      "meaning": "big"
    },
    "sentence": {
      "japanese": "彼女は大きな家に住んでいる。",
      "kana": "かのじょはおおきないえにすんでいる。",
      "english": "She lives in a large house.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0096",
    "example_index": 2,
    "target_vocab": {
      "kanji": "大きな",
      "kana": "おおきな",
      "meaning": "big"
    },
    "sentence": {
      "japanese": "彼女はとても大きな家に住んでいる。",
      "kana": "かのじょはとてもおおきないえにすんでいる。",
      "english": "She lives in a huge house.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0097",
    "example_index": 0,
    "target_vocab": {
      "kanji": "辺",
      "kana": "へん",
      "meaning": "area"
    },
    "sentence": {
      "japanese": "彼の家はどこかこの辺だ。",
      "kana": "かのいえはどこかこのへんだ。",
      "english": "His house is somewhere about here.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0097",
    "example_index": 1,
    "target_vocab": {
      "kanji": "辺",
      "kana": "へん",
      "meaning": "area"
    },
    "sentence": {
      "japanese": "私もこの辺は初めてです。",
      "kana": "わたしもこのへんははじめてです。",
      "english": "I'm a stranger here myself.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0097",
    "example_index": 2,
    "target_vocab": {
      "kanji": "辺",
      "kana": "へん",
      "meaning": "area"
    },
    "sentence": {
      "japanese": "私はこのへんはよく知りません。",
      "kana": "わたしはこのへんはよくしりません。",
      "english": "I am a stranger here.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0097",
    "example_index": 3,
    "target_vocab": {
      "kanji": "辺",
      "kana": "へん",
      "meaning": "area"
    },
    "sentence": {
      "japanese": "彼がまだ来ていないとはへんだ。",
      "kana": "かれがまだきていないとはへんだ。",
      "english": "It is strange that he has not come yet.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0097",
    "example_index": 4,
    "target_vocab": {
      "kanji": "辺",
      "kana": "へん",
      "meaning": "area"
    },
    "sentence": {
      "japanese": "私はこのへんはよく知りません。",
      "kana": "わたしはこのへんはよくしりません。",
      "english": "I am a stranger here.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0097",
    "example_index": 5,
    "target_vocab": {
      "kanji": "辺",
      "kana": "へん",
      "meaning": "area"
    },
    "sentence": {
      "japanese": "どこらへんを？",
      "kana": "どこらへんを？",
      "english": "Where?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0098",
    "example_index": 0,
    "target_vocab": {
      "kanji": "番号",
      "kana": "ばんごう",
      "meaning": "number"
    },
    "sentence": {
      "japanese": "ええ、じゃあ私の電話番号教えるね。",
      "kana": "ええ、じゃあわたしのでんわばんごうおしえるね。",
      "english": "OK. Let me give you my number.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0098",
    "example_index": 1,
    "target_vocab": {
      "kanji": "番号",
      "kana": "ばんごう",
      "meaning": "number"
    },
    "sentence": {
      "japanese": "彼女は彼に名前と電話番号を教えた。",
      "kana": "かのじょはかれになまえとでんわばんごうをおしえた。",
      "english": "She gave him her name and telephone number.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0098",
    "example_index": 2,
    "target_vocab": {
      "kanji": "番号",
      "kana": "ばんごう",
      "meaning": "number"
    },
    "sentence": {
      "japanese": "彼女はいつも僕の電話番号を忘れている。",
      "kana": "かのじょはいつもぼくのでんわばんごうをわすれている。",
      "english": "She is always forgetting my phone number.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0099",
    "example_index": 0,
    "target_vocab": {
      "kanji": "家族",
      "kana": "かぞく",
      "meaning": "family"
    },
    "sentence": {
      "japanese": "私は家族の写真を撮った。",
      "kana": "わたしはかぞくのしゃしんをとった。",
      "english": "I took a picture of my family.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0099",
    "example_index": 1,
    "target_vocab": {
      "kanji": "家族",
      "kana": "かぞく",
      "meaning": "family"
    },
    "sentence": {
      "japanese": "家の家族は五人からなる。",
      "kana": "いえのかぞくはごにんからなる。",
      "english": "Our family consists of five members.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0099",
    "example_index": 2,
    "target_vocab": {
      "kanji": "家族",
      "kana": "かぞく",
      "meaning": "family"
    },
    "sentence": {
      "japanese": "来週になると一家族が入ってくる。",
      "kana": "らいしゅうになるとひとかぞくがいっってくる。",
      "english": "Next week a family will move in.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0100",
    "example_index": 0,
    "target_vocab": {
      "kanji": "下手",
      "kana": "へた",
      "meaning": "unskillful"
    },
    "sentence": {
      "japanese": "彼女は話が下手です。",
      "kana": "かのじょははなしがへたです。",
      "english": "She is not very good with words.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0100",
    "example_index": 1,
    "target_vocab": {
      "kanji": "下手",
      "kana": "へた",
      "meaning": "unskillful"
    },
    "sentence": {
      "japanese": "彼女は料理が下手だ。",
      "kana": "かのじょはりょうりがへただ。",
      "english": "She is a poor cook.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0100",
    "example_index": 2,
    "target_vocab": {
      "kanji": "下手",
      "kana": "へた",
      "meaning": "unskillful"
    },
    "sentence": {
      "japanese": "彼は名前を覚えるのが下手だ。",
      "kana": "かれはなまえをおぼえるのがへただ。",
      "english": "He is weak on names.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0101",
    "example_index": 0,
    "target_vocab": {
      "kanji": "料理",
      "kana": "りょうり",
      "meaning": "cuisine"
    },
    "sentence": {
      "japanese": "料理が上手ですね。",
      "kana": "りょうりがじょうずですね。",
      "english": "You are a good cook.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0101",
    "example_index": 1,
    "target_vocab": {
      "kanji": "料理",
      "kana": "りょうり",
      "meaning": "cuisine"
    },
    "sentence": {
      "japanese": "料理がお上手と聞いています。",
      "kana": "りょうりがおじょうずときいています。",
      "english": "I hear you are good at cooking.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0101",
    "example_index": 2,
    "target_vocab": {
      "kanji": "料理",
      "kana": "りょうり",
      "meaning": "cuisine"
    },
    "sentence": {
      "japanese": "彼女は料理が大好きです。",
      "kana": "かのじょはりょうりがだいすきです。",
      "english": "Cooking is her delight.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0102",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "カレー",
      "meaning": "curry"
    },
    "sentence": {
      "japanese": "カレーはまあまあでした。",
      "kana": "かれーはまあまあでした。",
      "english": "The curry was nothing special.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0102",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "カレー",
      "meaning": "curry"
    },
    "sentence": {
      "japanese": "昨夜カレーを食べた。",
      "kana": "さくやかれーをたべた。",
      "english": "I had curry and rice last night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0102",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "カレー",
      "meaning": "curry"
    },
    "sentence": {
      "japanese": "カレーを初めて作りました。",
      "kana": "かれーをはじめてつくりました。",
      "english": "I made curry for the first time.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0103",
    "example_index": 0,
    "target_vocab": {
      "kanji": "六",
      "kana": "ろく",
      "meaning": "six"
    },
    "sentence": {
      "japanese": "彼女は来年六歳になる。",
      "kana": "かのじょはらいねんろくさいになる。",
      "english": "She is going to be six next year.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0103",
    "example_index": 1,
    "target_vocab": {
      "kanji": "六",
      "kana": "ろく",
      "meaning": "six"
    },
    "sentence": {
      "japanese": "一つ、二つ、三つ、四つ、五つ、六つ、七つ、八つ、九つ、十。",
      "kana": "ひとつ、ふたつ、みっつ、よつ、いつつ、むつ、ななつ、やつ、ここのつ、じゅう。",
      "english": "One, two, three, four, five, six, seven, eight, nine, ten.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0103",
    "example_index": 2,
    "target_vocab": {
      "kanji": "六",
      "kana": "ろく",
      "meaning": "six"
    },
    "sentence": {
      "japanese": "十、十一、十二、十三、十四、十五、十六、十七、十八、十九、二十。",
      "kana": "じゅう、じゅういち、じゅうに、じゅうさん、じゅうよん、じゅうご、じゅうろく、じゅうしち、じゅうはち、じゅうきゅう、にじゅう。",
      "english": "Ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0104",
    "example_index": 0,
    "target_vocab": {
      "kanji": "今年",
      "kana": "ことし",
      "meaning": "this year"
    },
    "sentence": {
      "japanese": "彼は今年私が英語を教えている生徒なんだ。",
      "kana": "かれはこんねんわたしがえいごをおしえているせいとなんだ。",
      "english": "He's a student who I'm teaching English to this year.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0104",
    "example_index": 1,
    "target_vocab": {
      "kanji": "今年",
      "kana": "ことし",
      "meaning": "this year"
    },
    "sentence": {
      "japanese": "彼はことしわたしが英語を教えている生徒です。",
      "kana": "かれはことしわたしがえいごをおしえているせいとです。",
      "english": "He is a student who I am teaching English this year.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0104",
    "example_index": 2,
    "target_vocab": {
      "kanji": "今年",
      "kana": "ことし",
      "meaning": "this year"
    },
    "sentence": {
      "japanese": "今年は雪が多かった。",
      "kana": "こんねんはゆきがおおかった。",
      "english": "We have had plenty of snow this year.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0104",
    "example_index": 3,
    "target_vocab": {
      "kanji": "今年",
      "kana": "ことし",
      "meaning": "this year"
    },
    "sentence": {
      "japanese": "彼はことしわたしが英語を教えている生徒です。",
      "kana": "かれはことしわたしがえいごをおしえているせいとです。",
      "english": "He is a student who I am teaching English this year.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0105",
    "example_index": 0,
    "target_vocab": {
      "kanji": "初めて",
      "kana": "はじめて",
      "meaning": "for the first time"
    },
    "sentence": {
      "japanese": "話すのを聞いて初めて彼だとわかった。",
      "kana": "はなすのをきいてはじめてかれだとわかった。",
      "english": "It wasn't until I heard him speak that I recognized him.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0105",
    "example_index": 1,
    "target_vocab": {
      "kanji": "初めて",
      "kana": "はじめて",
      "meaning": "for the first time"
    },
    "sentence": {
      "japanese": "彼らはある夏の午後に初めて会った。",
      "kana": "かれらはあるなつのごごにはじめてあった。",
      "english": "They first met on a summer afternoon.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0105",
    "example_index": 2,
    "target_vocab": {
      "kanji": "初めて",
      "kana": "はじめて",
      "meaning": "for the first time"
    },
    "sentence": {
      "japanese": "私もこの辺は初めてです。",
      "kana": "わたしもこのへんははじめてです。",
      "english": "I'm a stranger here myself.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0105",
    "example_index": 3,
    "target_vocab": {
      "kanji": "初めて",
      "kana": "はじめて",
      "meaning": "for the first time"
    },
    "sentence": {
      "japanese": "私が呼んではじめて彼は来た。",
      "kana": "わたしがよんではじめてかれはきた。",
      "english": "It was not until I called that he came.",
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
