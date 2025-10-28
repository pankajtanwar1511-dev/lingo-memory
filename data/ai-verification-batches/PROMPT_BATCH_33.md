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

**Batch Number**: 33
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0569",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "アパート",
      "meaning": "apartment"
    },
    "sentence": {
      "japanese": "彼女は一人でアパートに住んでいる。",
      "kana": "かのじょはひとりであぱーとにすんでいる。",
      "english": "She lives in an apartment alone.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0569",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "アパート",
      "meaning": "apartment"
    },
    "sentence": {
      "japanese": "彼女はわれわれの上のアパートに住んでいます。",
      "kana": "かのじょはわれわれのうえのあぱーとにすんでいます。",
      "english": "She lives in an apartment above us.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0569",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "アパート",
      "meaning": "apartment"
    },
    "sentence": {
      "japanese": "彼らはアパートを借りた。",
      "kana": "かれらはあぱーとをかりた。",
      "english": "They rented an apartment.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0570",
    "example_index": 0,
    "target_vocab": {
      "kanji": "鳥",
      "kana": "とり",
      "meaning": "bird"
    },
    "sentence": {
      "japanese": "彼女は鳥や花が大好きです。",
      "kana": "かのじょはとりやはながだいすきです。",
      "english": "She is keen on birds and flowers.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0570",
    "example_index": 1,
    "target_vocab": {
      "kanji": "鳥",
      "kana": "とり",
      "meaning": "bird"
    },
    "sentence": {
      "japanese": "鳥は飛ぶ。",
      "kana": "とりはとぶ。",
      "english": "Birds fly.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0570",
    "example_index": 2,
    "target_vocab": {
      "kanji": "鳥",
      "kana": "とり",
      "meaning": "bird"
    },
    "sentence": {
      "japanese": "鳥は南へ飛んで行った。",
      "kana": "とりはみなみへとんでいった。",
      "english": "The birds flew to the south.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0570",
    "example_index": 3,
    "target_vocab": {
      "kanji": "鳥",
      "kana": "とり",
      "meaning": "bird"
    },
    "sentence": {
      "japanese": "ここで写真をとりましょう。",
      "kana": "ここでしゃしんをとりましょう。",
      "english": "Let's take a picture here.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0571",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ここ",
      "meaning": "here"
    },
    "sentence": {
      "japanese": "ここではおいしい食べ物が出されます。",
      "kana": "ここではおいしいたべものがだされます。",
      "english": "They serve excellent food here.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0571",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ここ",
      "meaning": "here"
    },
    "sentence": {
      "japanese": "ここから先には行けません。",
      "kana": "ここからさきにはいけません。",
      "english": "You cannot go any farther.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0571",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ここ",
      "meaning": "here"
    },
    "sentence": {
      "japanese": "我々二人がここにいるのは不自然だ。",
      "kana": "われわれふたりがここにいるのはふしぜんだ。",
      "english": "The two of us don't belong here.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0572",
    "example_index": 0,
    "target_vocab": {
      "kanji": "方",
      "kana": "かた",
      "meaning": "person"
    },
    "sentence": {
      "japanese": "君は違う方にいきますよ。",
      "kana": "くんはちがうほうにいきますよ。",
      "english": "You're going the wrong way.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0572",
    "example_index": 1,
    "target_vocab": {
      "kanji": "方",
      "kana": "かた",
      "meaning": "person"
    },
    "sentence": {
      "japanese": "私は彼の名前の読み方がわからない。",
      "kana": "わたしはかのなまえのよみかたがわからない。",
      "english": "I don't know how to pronounce his name.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0572",
    "example_index": 2,
    "target_vocab": {
      "kanji": "方",
      "kana": "かた",
      "meaning": "person"
    },
    "sentence": {
      "japanese": "北の方では冬が寒いです。",
      "kana": "きたのほうではふゆがさむいです。",
      "english": "In the north, it's cold in winter.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0572",
    "example_index": 3,
    "target_vocab": {
      "kanji": "方",
      "kana": "かた",
      "meaning": "person"
    },
    "sentence": {
      "japanese": "私は彼の口のききかたが嫌いだ。",
      "kana": "わたしはかのくちのききかたがきらいだ。",
      "english": "I do not like the way he talks.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0572",
    "example_index": 4,
    "target_vocab": {
      "kanji": "方",
      "kana": "かた",
      "meaning": "person"
    },
    "sentence": {
      "japanese": "ここからレストランまでのいきかたを書いてください。",
      "kana": "ここかられすとらんまでのいきかたをかいてください。",
      "english": "Could you write me directions to the restaurant?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0572",
    "example_index": 5,
    "target_vocab": {
      "kanji": "方",
      "kana": "かた",
      "meaning": "person"
    },
    "sentence": {
      "japanese": "あなたは泳ぎかたを知っていますか。",
      "kana": "あなたはおよぎかたをしっていますか。",
      "english": "Do you know how to swim?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0573",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "タクシー",
      "meaning": "taxi"
    },
    "sentence": {
      "japanese": "彼女は病院までタクシーに乗った。",
      "kana": "かのじょはびょういんまでたくしーにじょうった。",
      "english": "She took a taxi to the hospital.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0573",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "タクシー",
      "meaning": "taxi"
    },
    "sentence": {
      "japanese": "彼女はタクシーに乗った。",
      "kana": "かのじょはたくしーにじょうった。",
      "english": "She got in the taxi.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0573",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "タクシー",
      "meaning": "taxi"
    },
    "sentence": {
      "japanese": "彼は駅までタクシーに乗った。",
      "kana": "かれはえきまでたくしーにじょうった。",
      "english": "He took a taxi to the station.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0576",
    "example_index": 0,
    "target_vocab": {
      "kanji": "少ない",
      "kana": "すくない",
      "meaning": "a few"
    },
    "sentence": {
      "japanese": "男の子で食べ物にうるさいのは少ない。",
      "kana": "おとこのこでたべものにうるさいのはすくない。",
      "english": "Few boys are dainty about their food.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0576",
    "example_index": 1,
    "target_vocab": {
      "kanji": "少ない",
      "kana": "すくない",
      "meaning": "a few"
    },
    "sentence": {
      "japanese": "少なくとも地図ぐらいはあるだろう。",
      "kana": "すくなくともちずぐらいはあるだろう。",
      "english": "At least they should have a map.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0576",
    "example_index": 2,
    "target_vocab": {
      "kanji": "少ない",
      "kana": "すくない",
      "meaning": "a few"
    },
    "sentence": {
      "japanese": "今年の冬は雪が少ないだろう。",
      "kana": "こんねんのふゆはゆきがすくないだろう。",
      "english": "We'll have little snow this winter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0577",
    "example_index": 0,
    "target_vocab": {
      "kanji": "白い",
      "kana": "しろい",
      "meaning": "white"
    },
    "sentence": {
      "japanese": "彼女は白い服を着ている。",
      "kana": "かのじょはしろいふくをきている。",
      "english": "She is dressed in white.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0577",
    "example_index": 1,
    "target_vocab": {
      "kanji": "白い",
      "kana": "しろい",
      "meaning": "white"
    },
    "sentence": {
      "japanese": "彼女は白い靴をはいていた。",
      "kana": "かのじょはしろいくつをはいていた。",
      "english": "She had white shoes on.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0577",
    "example_index": 2,
    "target_vocab": {
      "kanji": "白い",
      "kana": "しろい",
      "meaning": "white"
    },
    "sentence": {
      "japanese": "彼女は今日は白い服を着ている。",
      "kana": "かのじょはこんにちはしろいふくをきている。",
      "english": "She is wearing a white dress today.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0578",
    "example_index": 0,
    "target_vocab": {
      "kanji": "待つ",
      "kana": "まつ",
      "meaning": "to wait"
    },
    "sentence": {
      "japanese": "私は彼が来るのを今か今かと待っている。",
      "kana": "わたしはかれがくるのをいまかいまかとまっている。",
      "english": "I expect him to come every moment.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0578",
    "example_index": 1,
    "target_vocab": {
      "kanji": "待つ",
      "kana": "まつ",
      "meaning": "to wait"
    },
    "sentence": {
      "japanese": "あちらが私の待っていた人です。",
      "kana": "あちらがわたしのまっていたにんです。",
      "english": "That's the person I've been waiting for.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0578",
    "example_index": 2,
    "target_vocab": {
      "kanji": "待つ",
      "kana": "まつ",
      "meaning": "to wait"
    },
    "sentence": {
      "japanese": "彼がおまちかねよ。",
      "kana": "かれがおまちかねよ。",
      "english": "He is impatient to see you.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0579",
    "example_index": 0,
    "target_vocab": {
      "kanji": "次",
      "kana": "つぎ",
      "meaning": "next"
    },
    "sentence": {
      "japanese": "彼らは次の朝公園に行った。",
      "kana": "かれらはつぎのあさこうえんにいった。",
      "english": "They went to the park the next morning.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0579",
    "example_index": 1,
    "target_vocab": {
      "kanji": "次",
      "kana": "つぎ",
      "meaning": "next"
    },
    "sentence": {
      "japanese": "彼は次のように答えた。",
      "kana": "かれはつぎのようにこたえた。",
      "english": "He answered as follows.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0579",
    "example_index": 2,
    "target_vocab": {
      "kanji": "次",
      "kana": "つぎ",
      "meaning": "next"
    },
    "sentence": {
      "japanese": "春は冬の次です。",
      "kana": "はるはふゆのつぎです。",
      "english": "Spring comes after winter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0580",
    "example_index": 0,
    "target_vocab": {
      "kanji": "行く",
      "kana": "いく",
      "meaning": "to go"
    },
    "sentence": {
      "japanese": "私の犬は、どこでも私の行くところへついてくる。",
      "kana": "わたしのいぬは、どこでもわたしのいくところへついてくる。",
      "english": "My dog follows me wherever I go.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0580",
    "example_index": 1,
    "target_vocab": {
      "kanji": "行く",
      "kana": "いく",
      "meaning": "to go"
    },
    "sentence": {
      "japanese": "君は違う方にいきますよ。",
      "kana": "くんはちがうほうにいきますよ。",
      "english": "You're going the wrong way.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0580",
    "example_index": 2,
    "target_vocab": {
      "kanji": "行く",
      "kana": "いく",
      "meaning": "to go"
    },
    "sentence": {
      "japanese": "この薬を飲まなければ行けませんか。",
      "kana": "このくすりをのまなければいけませんか。",
      "english": "Must I take this medicine?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0580",
    "example_index": 3,
    "target_vocab": {
      "kanji": "行く",
      "kana": "いく",
      "meaning": "to go"
    },
    "sentence": {
      "japanese": "おいくつですか？",
      "kana": "おいくつですか？",
      "english": "How old are you?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0580",
    "example_index": 4,
    "target_vocab": {
      "kanji": "行く",
      "kana": "いく",
      "meaning": "to go"
    },
    "sentence": {
      "japanese": "彼は毎日傘を持っていく。",
      "kana": "かれはまいにちかさをもっていく。",
      "english": "He carries his umbrella about with him every day.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0580",
    "example_index": 5,
    "target_vocab": {
      "kanji": "行く",
      "kana": "いく",
      "meaning": "to go"
    },
    "sentence": {
      "japanese": "彼は私たちと一緒にいくべきです。",
      "kana": "かれはわたしたちといっしょにいくべきです。",
      "english": "I insist that he should go with us.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0581",
    "example_index": 0,
    "target_vocab": {
      "kanji": "角",
      "kana": "かど",
      "meaning": "a corner"
    },
    "sentence": {
      "japanese": "彼らは角の所でバスに乗るところです。",
      "kana": "かれらはかくのところでばすにのるところです。",
      "english": "They are getting on the bus at the corner.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0581",
    "example_index": 1,
    "target_vocab": {
      "kanji": "角",
      "kana": "かど",
      "meaning": "a corner"
    },
    "sentence": {
      "japanese": "角の家は私たちの家です。",
      "kana": "かくのいえはわたしたちのいえです。",
      "english": "The house on the corner is ours.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0581",
    "example_index": 2,
    "target_vocab": {
      "kanji": "角",
      "kana": "かど",
      "meaning": "a corner"
    },
    "sentence": {
      "japanese": "そこの角ですよ。",
      "kana": "そこのかくですよ。",
      "english": "It's at the corner.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0582",
    "example_index": 0,
    "target_vocab": {
      "kanji": "男",
      "kana": "おとこ",
      "meaning": "man"
    },
    "sentence": {
      "japanese": "若い男の人がドアの前で歌っています。",
      "kana": "わかいおとこのにんがどあのまえでうたっています。",
      "english": "A young man is singing in front of the door.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0582",
    "example_index": 1,
    "target_vocab": {
      "kanji": "男",
      "kana": "おとこ",
      "meaning": "man"
    },
    "sentence": {
      "japanese": "立っているのは、みんな男だった。",
      "kana": "たっているのは、みんなおとこだった。",
      "english": "Those standing were all men.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0582",
    "example_index": 2,
    "target_vocab": {
      "kanji": "男",
      "kana": "おとこ",
      "meaning": "man"
    },
    "sentence": {
      "japanese": "彼女は昨日背の高い男の人に会いました。",
      "kana": "かのじょはきのうせのたかいおとこのにんにあいました。",
      "english": "She saw a tall man yesterday.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0583",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ギター",
      "meaning": "guitar"
    },
    "sentence": {
      "japanese": "僕はギターを弾くのが好きだ。",
      "kana": "ぼくはぎたーをひくのがすきだ。",
      "english": "I am fond of playing the guitar.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0583",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ギター",
      "meaning": "guitar"
    },
    "sentence": {
      "japanese": "彼女はギターを弾くのが上手だ。",
      "kana": "かのじょはぎたーをひくのがじょうずだ。",
      "english": "She is good at playing the guitar.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0583",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ギター",
      "meaning": "guitar"
    },
    "sentence": {
      "japanese": "彼女はギターを弾きます。",
      "kana": "かのじょはぎたーをひきます。",
      "english": "She plays the guitar.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0584",
    "example_index": 0,
    "target_vocab": {
      "kanji": "聞く",
      "kana": "きく",
      "meaning": "to hear"
    },
    "sentence": {
      "japanese": "そのニュースはラジオで聞いたよ。",
      "kana": "そのにゅーすはらじおできいたよ。",
      "english": "I heard the news on the radio.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0584",
    "example_index": 1,
    "target_vocab": {
      "kanji": "聞く",
      "kana": "きく",
      "meaning": "to hear"
    },
    "sentence": {
      "japanese": "向こうの交番で聞いてください。",
      "kana": "むこうのこうばんできいてください。",
      "english": "Ask at the police station over there.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0584",
    "example_index": 2,
    "target_vocab": {
      "kanji": "聞く",
      "kana": "きく",
      "meaning": "to hear"
    },
    "sentence": {
      "japanese": "それから先の話を聞きたい。",
      "kana": "それからさきのはなしをききたい。",
      "english": "I'd like to know the rest of the story.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0585",
    "example_index": 0,
    "target_vocab": {
      "kanji": "走る",
      "kana": "はしる",
      "meaning": "to run"
    },
    "sentence": {
      "japanese": "彼女は走るのが遅い。",
      "kana": "かのじょははしるのがおそい。",
      "english": "She is a slow runner.",
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
