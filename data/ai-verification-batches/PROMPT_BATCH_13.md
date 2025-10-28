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

**Batch Number**: 13
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0209",
    "example_index": 2,
    "target_vocab": {
      "kanji": "難しい",
      "kana": "むずかしい",
      "meaning": "difficult"
    },
    "sentence": {
      "japanese": "彼女に会うのは難しい。",
      "kana": "かのじょにあうのはむずかしい。",
      "english": "It is difficult to see her.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0209",
    "example_index": 3,
    "target_vocab": {
      "kanji": "難しい",
      "kana": "むずかしい",
      "meaning": "difficult"
    },
    "sentence": {
      "japanese": "彼女に会うのはむずかしいとわかるだろう。",
      "kana": "かのじょにあうのはむずかしいとわかるだろう。",
      "english": "You'll find it difficult to meet her.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0210",
    "example_index": 0,
    "target_vocab": {
      "kanji": "村",
      "kana": "むら",
      "meaning": "village"
    },
    "sentence": {
      "japanese": "町は村よりも大きい。",
      "kana": "まちはむらよりもおおきい。",
      "english": "Towns are larger than villages.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0210",
    "example_index": 1,
    "target_vocab": {
      "kanji": "村",
      "kana": "むら",
      "meaning": "village"
    },
    "sentence": {
      "japanese": "彼女は小さな村で生まれました。",
      "kana": "かのじょはちいさなむらでうまれました。",
      "english": "She was born in a small village.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0210",
    "example_index": 2,
    "target_vocab": {
      "kanji": "村",
      "kana": "むら",
      "meaning": "village"
    },
    "sentence": {
      "japanese": "彼女はこの村に住んでいます。",
      "kana": "かのじょはこのむらにすんでいます。",
      "english": "She lives in this village.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0211",
    "example_index": 0,
    "target_vocab": {
      "kanji": "鉛筆",
      "kana": "えんぴつ",
      "meaning": "pencil"
    },
    "sentence": {
      "japanese": "ペンか鉛筆を持っていますか。",
      "kana": "ぺんかえんぴつをもっていますか。",
      "english": "Do you have a pen or a pencil?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0211",
    "example_index": 1,
    "target_vocab": {
      "kanji": "鉛筆",
      "kana": "えんぴつ",
      "meaning": "pencil"
    },
    "sentence": {
      "japanese": "ここに五本の鉛筆がある。",
      "kana": "ここにごほんのえんぴつがある。",
      "english": "There are five pencils here.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0211",
    "example_index": 2,
    "target_vocab": {
      "kanji": "鉛筆",
      "kana": "えんぴつ",
      "meaning": "pencil"
    },
    "sentence": {
      "japanese": "彼は先の細い鉛筆を使う。",
      "kana": "かれはさきのこまいえんぴつをつかう。",
      "english": "He uses a pencil with a fine point.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0212",
    "example_index": 0,
    "target_vocab": {
      "kanji": "長い",
      "kana": "ながい",
      "meaning": "long"
    },
    "sentence": {
      "japanese": "彼に長い手紙を書いた。",
      "kana": "かれにながいてがみをかいた。",
      "english": "I wrote a long letter to him.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0212",
    "example_index": 1,
    "target_vocab": {
      "kanji": "長い",
      "kana": "ながい",
      "meaning": "long"
    },
    "sentence": {
      "japanese": "妹は足が長い。",
      "kana": "いもうとはあしがながい。",
      "english": "My sister has long legs.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0212",
    "example_index": 2,
    "target_vocab": {
      "kanji": "長い",
      "kana": "ながい",
      "meaning": "long"
    },
    "sentence": {
      "japanese": "彼女は長い足だ。",
      "kana": "かのじょはながいあしだ。",
      "english": "She has long feet.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0213",
    "example_index": 0,
    "target_vocab": {
      "kanji": "生まれる",
      "kana": "うまれる",
      "meaning": "to be born"
    },
    "sentence": {
      "japanese": "彼女は小さな村で生まれました。",
      "kana": "かのじょはちいさなむらでうまれました。",
      "english": "She was born in a small village.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0213",
    "example_index": 1,
    "target_vocab": {
      "kanji": "生まれる",
      "kana": "うまれる",
      "meaning": "to be born"
    },
    "sentence": {
      "japanese": "彼がどこで生まれたか知っていますか。",
      "kana": "かれがどこでうまれたかしっていますか。",
      "english": "Do you know his birthplace?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0213",
    "example_index": 2,
    "target_vocab": {
      "kanji": "生まれる",
      "kana": "うまれる",
      "meaning": "to be born"
    },
    "sentence": {
      "japanese": "彼らに先週子供が生まれた。",
      "kana": "かれらにせんしゅうこどもがうまれた。",
      "english": "They had a baby last week.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0214",
    "example_index": 0,
    "target_vocab": {
      "kanji": "雑誌",
      "kana": "ざっし",
      "meaning": "magazine"
    },
    "sentence": {
      "japanese": "その雑誌はどこで買えますか。",
      "kana": "そのざっしはどこでかえますか。",
      "english": "Where can I buy that magazine?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0214",
    "example_index": 1,
    "target_vocab": {
      "kanji": "雑誌",
      "kana": "ざっし",
      "meaning": "magazine"
    },
    "sentence": {
      "japanese": "この雑誌は広く行き渡っている。",
      "kana": "このざっしはひろくいきわたっている。",
      "english": "This magazine circulates widely.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0214",
    "example_index": 2,
    "target_vocab": {
      "kanji": "雑誌",
      "kana": "ざっし",
      "meaning": "magazine"
    },
    "sentence": {
      "japanese": "彼はいつも雑誌を読む。",
      "kana": "かれはいつもざっしをよむ。",
      "english": "He always reads a magazine.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0215",
    "example_index": 0,
    "target_vocab": {
      "kanji": "国",
      "kana": "くに",
      "meaning": "country"
    },
    "sentence": {
      "japanese": "彼の名前は国中で知られている。",
      "kana": "かのなまえはくにじゅうでしられている。",
      "english": "His name is known all over the country.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0215",
    "example_index": 1,
    "target_vocab": {
      "kanji": "国",
      "kana": "くに",
      "meaning": "country"
    },
    "sentence": {
      "japanese": "彼の名前はその国の誰にもよく知られている。",
      "kana": "かのなまえはそのくにのだれにもよくしられている。",
      "english": "His name is familiar to everybody in the country.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0215",
    "example_index": 2,
    "target_vocab": {
      "kanji": "国",
      "kana": "くに",
      "meaning": "country"
    },
    "sentence": {
      "japanese": "彼が国を出ていく前に会っておきたかった。",
      "kana": "かれがくにをでていくまえにあっておきたかった。",
      "english": "I would like to have seen him before he left the country.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0217",
    "example_index": 0,
    "target_vocab": {
      "kanji": "今朝",
      "kana": "けさ",
      "meaning": "this morning"
    },
    "sentence": {
      "japanese": "おや、今朝は早いですね。",
      "kana": "おや、けさははやいですね。",
      "english": "Oh, you are early this morning.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0217",
    "example_index": 1,
    "target_vocab": {
      "kanji": "今朝",
      "kana": "けさ",
      "meaning": "this morning"
    },
    "sentence": {
      "japanese": "私は今朝バターつきのパンを食べた。",
      "kana": "わたしはけさばたーつきのぱんをたべた。",
      "english": "I ate bread and butter this morning.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0217",
    "example_index": 2,
    "target_vocab": {
      "kanji": "今朝",
      "kana": "けさ",
      "meaning": "this morning"
    },
    "sentence": {
      "japanese": "今朝はとても寒かった。",
      "kana": "けさはとてもさむかった。",
      "english": "It was very cold this morning.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0218",
    "example_index": 0,
    "target_vocab": {
      "kanji": "晴れる",
      "kana": "はれる",
      "meaning": "to be sunny"
    },
    "sentence": {
      "japanese": "明日の天気は晴れ時々雨でしょう。",
      "kana": "あしたのてんきははれときどきあめでしょう。",
      "english": "Tomorrow's weather should be sunny with occasional rain.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0218",
    "example_index": 1,
    "target_vocab": {
      "kanji": "晴れる",
      "kana": "はれる",
      "meaning": "to be sunny"
    },
    "sentence": {
      "japanese": "晴れわたってきた。",
      "kana": "はれわたってきた。",
      "english": "It is clearing up.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0218",
    "example_index": 2,
    "target_vocab": {
      "kanji": "晴れる",
      "kana": "はれる",
      "meaning": "to be sunny"
    },
    "sentence": {
      "japanese": "晴れないでしょう。",
      "kana": "はれないでしょう。",
      "english": "The skies won't be clear.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0219",
    "example_index": 0,
    "target_vocab": {
      "kanji": "夕飯",
      "kana": "ゆうはん",
      "meaning": "dinner"
    },
    "sentence": {
      "japanese": "私は昨日夕飯を作った。",
      "kana": "わたしはきのうゆうはんをつくった。",
      "english": "I cooked supper last night.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0219",
    "example_index": 1,
    "target_vocab": {
      "kanji": "夕飯",
      "kana": "ゆうはん",
      "meaning": "dinner"
    },
    "sentence": {
      "japanese": "夕飯はもう食べましたか。",
      "kana": "ゆうはんはもうたべましたか。",
      "english": "Have you had dinner?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0219",
    "example_index": 2,
    "target_vocab": {
      "kanji": "夕飯",
      "kana": "ゆうはん",
      "meaning": "dinner"
    },
    "sentence": {
      "japanese": "夕飯の時間ですよ。",
      "kana": "ゆうはんのじかんですよ。",
      "english": "It's time for dinner.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0220",
    "example_index": 0,
    "target_vocab": {
      "kanji": "一緒",
      "kana": "いっしょ",
      "meaning": "together"
    },
    "sentence": {
      "japanese": "一緒に食べに行きましょう。",
      "kana": "いっしょにたべにいきましょう。",
      "english": "Let's go to eat together.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0220",
    "example_index": 1,
    "target_vocab": {
      "kanji": "一緒",
      "kana": "いっしょ",
      "meaning": "together"
    },
    "sentence": {
      "japanese": "旅行に一緒に行きませんか。",
      "kana": "りょこうにいっしょにいきませんか。",
      "english": "Do you want to go on a trip with me?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0220",
    "example_index": 2,
    "target_vocab": {
      "kanji": "一緒",
      "kana": "いっしょ",
      "meaning": "together"
    },
    "sentence": {
      "japanese": "僕らと一緒にパーティーに行こうよ。",
      "kana": "ぼくらといっしょにぱーてぃーにいこうよ。",
      "english": "Why don't you come along with us to the party?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0220",
    "example_index": 3,
    "target_vocab": {
      "kanji": "一緒",
      "kana": "いっしょ",
      "meaning": "together"
    },
    "sentence": {
      "japanese": "彼女はこの前の夏から私たちといっしょに住んでいます。",
      "kana": "かのじょはこのまえのなつからわたしたちといっしょにすんでいます。",
      "english": "She has lived with us since last summer.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0220",
    "example_index": 4,
    "target_vocab": {
      "kanji": "一緒",
      "kana": "いっしょ",
      "meaning": "together"
    },
    "sentence": {
      "japanese": "彼女が私といっしょに行きたがっているかどうか私は知りません。",
      "kana": "かのじょがわたしといっしょにいきたがっているかどうかわたしはしりません。",
      "english": "I don't know if she wants to go with me.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0220",
    "example_index": 5,
    "target_vocab": {
      "kanji": "一緒",
      "kana": "いっしょ",
      "meaning": "together"
    },
    "sentence": {
      "japanese": "彼女が僕といっしょにそこへ行くかどうかわからない。",
      "kana": "かのじょがぼくといっしょにそこへいくかどうかわからない。",
      "english": "I don't know if she will go there with me.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0221",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "どれ",
      "meaning": "which (of three or more)"
    },
    "sentence": {
      "japanese": "砂糖はどれぐらい使いますか。",
      "kana": "さとうはどれぐらいつかいますか。",
      "english": "How much sugar do you use?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0221",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "どれ",
      "meaning": "which (of three or more)"
    },
    "sentence": {
      "japanese": "どれが私たちの車ですか。",
      "kana": "どれがわたしたちのくるまですか。",
      "english": "Which car is ours?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0221",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "どれ",
      "meaning": "which (of three or more)"
    },
    "sentence": {
      "japanese": "どれが君の本ですか。",
      "kana": "どれがくんのほんですか。",
      "english": "Which is your book?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0222",
    "example_index": 0,
    "target_vocab": {
      "kanji": "立つ",
      "kana": "たつ",
      "meaning": "to stand"
    },
    "sentence": {
      "japanese": "あそこに立ってる女の人はだれですか。",
      "kana": "あそこにたってるおんなのひとはだれですか。",
      "english": "Who is the woman standing there?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0222",
    "example_index": 1,
    "target_vocab": {
      "kanji": "立つ",
      "kana": "たつ",
      "meaning": "to stand"
    },
    "sentence": {
      "japanese": "立っているのは、みんな男だった。",
      "kana": "たっているのは、みんなおとこだった。",
      "english": "Those standing were all men.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0222",
    "example_index": 2,
    "target_vocab": {
      "kanji": "立つ",
      "kana": "たつ",
      "meaning": "to stand"
    },
    "sentence": {
      "japanese": "彼女は彼のそばに立っていた。",
      "kana": "かのじょはかのそばにたっていた。",
      "english": "She stood by him.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0222",
    "example_index": 3,
    "target_vocab": {
      "kanji": "立つ",
      "kana": "たつ",
      "meaning": "to stand"
    },
    "sentence": {
      "japanese": "この国に来て、どれぐらいたつ？",
      "kana": "このくににきて、どれぐらいたつ？",
      "english": "How long have you been in this country?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0223",
    "example_index": 0,
    "target_vocab": {
      "kanji": "元気",
      "kana": "げんき",
      "meaning": "health"
    },
    "sentence": {
      "japanese": "彼はまだ元気盛んだ。",
      "kana": "かれはまだげんきさかんだ。",
      "english": "He is still full of energy.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0223",
    "example_index": 1,
    "target_vocab": {
      "kanji": "元気",
      "kana": "げんき",
      "meaning": "health"
    },
    "sentence": {
      "japanese": "私はなぜか夜の方が元気だ。",
      "kana": "わたしはなぜかよるのほうがげんきだ。",
      "english": "For some reason I feel more alive at night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0223",
    "example_index": 2,
    "target_vocab": {
      "kanji": "元気",
      "kana": "げんき",
      "meaning": "health"
    },
    "sentence": {
      "japanese": "妹さんは元気？",
      "kana": "いもうとさんはげんき？",
      "english": "How's your sister?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0224",
    "example_index": 0,
    "target_vocab": {
      "kanji": "天気",
      "kana": "てんき",
      "meaning": "weather"
    },
    "sentence": {
      "japanese": "明日のお天気はどうかしら？",
      "kana": "あしたのおてんきはどうかしら？",
      "english": "I wonder what the weather will be tomorrow.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0224",
    "example_index": 1,
    "target_vocab": {
      "kanji": "天気",
      "kana": "てんき",
      "meaning": "weather"
    },
    "sentence": {
      "japanese": "この悪い天気はもうたくさんだ。",
      "kana": "このわるいてんきはもうたくさんだ。",
      "english": "We've had enough of this bad weather.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0224",
    "example_index": 2,
    "target_vocab": {
      "kanji": "天気",
      "kana": "てんき",
      "meaning": "weather"
    },
    "sentence": {
      "japanese": "明日天気はどうなるだろうか。",
      "kana": "あしたてんきはどうなるだろうか。",
      "english": "I wonder what the weather will be tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0225",
    "example_index": 0,
    "target_vocab": {
      "kanji": "医者",
      "kana": "いしゃ",
      "meaning": "medical doctor"
    },
    "sentence": {
      "japanese": "今日歯医者へ行きました。",
      "kana": "きょうはいしゃへいきました。",
      "english": "Today I went to the dentist's.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0225",
    "example_index": 1,
    "target_vocab": {
      "kanji": "医者",
      "kana": "いしゃ",
      "meaning": "medical doctor"
    },
    "sentence": {
      "japanese": "彼は医者の卵だ。",
      "kana": "かれはいしゃのたまごだ。",
      "english": "He's a future doctor.",
      "source": "jmdict"
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
