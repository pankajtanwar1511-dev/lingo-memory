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

**Batch Number**: 14
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0225",
    "example_index": 2,
    "target_vocab": {
      "kanji": "医者",
      "kana": "いしゃ",
      "meaning": "medical doctor"
    },
    "sentence": {
      "japanese": "彼女は医者になるでしょうね。",
      "kana": "かのじょはいしゃになるでしょうね。",
      "english": "She will become a doctor.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0226",
    "example_index": 0,
    "target_vocab": {
      "kanji": "七",
      "kana": "しち/なな",
      "meaning": "seven"
    },
    "sentence": {
      "japanese": "彼女は七人も子供がいる。",
      "kana": "かのじょはしちにんもこどもがいる。",
      "english": "She has as many as seven children.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0226",
    "example_index": 1,
    "target_vocab": {
      "kanji": "七",
      "kana": "しち/なな",
      "meaning": "seven"
    },
    "sentence": {
      "japanese": "一つ、二つ、三つ、四つ、五つ、六つ、七つ、八つ、九つ、十。",
      "kana": "ひとつ、ふたつ、みっつ、よつ、いつつ、むつ、ななつ、やつ、ここのつ、じゅう。",
      "english": "One, two, three, four, five, six, seven, eight, nine, ten.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0226",
    "example_index": 2,
    "target_vocab": {
      "kanji": "七",
      "kana": "しち/なな",
      "meaning": "seven"
    },
    "sentence": {
      "japanese": "十、十一、十二、十三、十四、十五、十六、十七、十八、十九、二十。",
      "kana": "じゅう、じゅういち、じゅうに、じゅうさん、じゅうよん、じゅうご、じゅうろく、じゅうしち、じゅうはち、じゅうきゅう、にじゅう。",
      "english": "Ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0228",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "だんだん",
      "meaning": "gradually"
    },
    "sentence": {
      "japanese": "空がだんだん曇ってきた。",
      "kana": "そらがだんだんくもってきた。",
      "english": "The sky has gradually clouded over.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0228",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "だんだん",
      "meaning": "gradually"
    },
    "sentence": {
      "japanese": "だんだん分かってきたよ。",
      "kana": "だんだんわかってきたよ。",
      "english": "I'm beginning to understand.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0229",
    "example_index": 0,
    "target_vocab": {
      "kanji": "戸",
      "kana": "と",
      "meaning": "Japanese style door"
    },
    "sentence": {
      "japanese": "彼女は戸を押して閉めた。",
      "kana": "かのじょはこをおしてしめた。",
      "english": "She pushed the door shut.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0229",
    "example_index": 1,
    "target_vocab": {
      "kanji": "戸",
      "kana": "と",
      "meaning": "Japanese style door"
    },
    "sentence": {
      "japanese": "私は彼に戸を開けさせた。",
      "kana": "わたしはかれにこをひらけさせた。",
      "english": "I made him open the door.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0229",
    "example_index": 2,
    "target_vocab": {
      "kanji": "戸",
      "kana": "と",
      "meaning": "Japanese style door"
    },
    "sentence": {
      "japanese": "私は全部の戸を閉めて寝た。",
      "kana": "わたしはぜんぶのこをしめてねた。",
      "english": "Locking all the doors, I went to bed.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0229",
    "example_index": 3,
    "target_vocab": {
      "kanji": "戸",
      "kana": "と",
      "meaning": "Japanese style door"
    },
    "sentence": {
      "japanese": "彼はそのそばでシャツをすうっと着た。",
      "kana": "かれはそのそばでしゃつをすうっときた。",
      "english": "He slipped the gaudy shirt on.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0229",
    "example_index": 4,
    "target_vocab": {
      "kanji": "戸",
      "kana": "と",
      "meaning": "Japanese style door"
    },
    "sentence": {
      "japanese": "私は彼が来るのを今か今かと待っている。",
      "kana": "わたしはかれがくるのをいまかいまかとまっている。",
      "english": "I expect him to come every moment.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0229",
    "example_index": 5,
    "target_vocab": {
      "kanji": "戸",
      "kana": "と",
      "meaning": "Japanese style door"
    },
    "sentence": {
      "japanese": "それを言われると弱いなあ。",
      "kana": "それをいわれるとよわいなあ。",
      "english": "That sure puts me on the spot.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0230",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ノート",
      "meaning": "notebook"
    },
    "sentence": {
      "japanese": "彼は鉛筆やノートや辞書などを買った。",
      "kana": "かれはえんぴつやのーとやじしょなどをかった。",
      "english": "He bought pencils, notebooks, dictionaries and so on.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0230",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ノート",
      "meaning": "notebook"
    },
    "sentence": {
      "japanese": "私はノートがほしい。",
      "kana": "わたしはのーとがほしい。",
      "english": "I want a notebook.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0230",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ノート",
      "meaning": "notebook"
    },
    "sentence": {
      "japanese": "私の授業にはいつもノートを持ってきてくださいね。",
      "kana": "わたしのじゅぎょうにはいつものーとをもってきてくださいね。",
      "english": "Always bring your notebook to my class, will you?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0231",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "また",
      "meaning": "again"
    },
    "sentence": {
      "japanese": "それじゃまた明日。",
      "kana": "それじゃまたあした。",
      "english": "See you tomorrow.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0231",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "また",
      "meaning": "again"
    },
    "sentence": {
      "japanese": "では今晩またね、さようなら。",
      "kana": "ではこんばんまたね、さようなら。",
      "english": "See you tonight, then. Cheers!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0231",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "また",
      "meaning": "again"
    },
    "sentence": {
      "japanese": "紅茶またはコーヒーはいかが？",
      "kana": "こうちゃまたはこーひーはいかが？",
      "english": "Would you like some tea or coffee?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0232",
    "example_index": 0,
    "target_vocab": {
      "kanji": "今日",
      "kana": "きょう",
      "meaning": "today"
    },
    "sentence": {
      "japanese": "今日はとてもチャーミングだね。",
      "kana": "こんにちはとてもちゃーみんぐだね。",
      "english": "You look very charming today.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0232",
    "example_index": 1,
    "target_vocab": {
      "kanji": "今日",
      "kana": "きょう",
      "meaning": "today"
    },
    "sentence": {
      "japanese": "今日歯医者へ行きました。",
      "kana": "きょうはいしゃへいきました。",
      "english": "Today I went to the dentist's.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0232",
    "example_index": 2,
    "target_vocab": {
      "kanji": "今日",
      "kana": "きょう",
      "meaning": "today"
    },
    "sentence": {
      "japanese": "今日は、これまでになく寒い。",
      "kana": "こんにちは、これまでになくさむい。",
      "english": "Today's the coldest day we've ever had.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0232",
    "example_index": 3,
    "target_vocab": {
      "kanji": "今日",
      "kana": "きょう",
      "meaning": "today"
    },
    "sentence": {
      "japanese": "きょうは何も食べられないんだ。",
      "kana": "きょうはなにもたべられないんだ。",
      "english": "I cannot eat anything today.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0232",
    "example_index": 4,
    "target_vocab": {
      "kanji": "今日",
      "kana": "きょう",
      "meaning": "today"
    },
    "sentence": {
      "japanese": "きょうかぜで学校を休みました。",
      "kana": "きょうかぜでがっこうをやすみました。",
      "english": "I didn't go to school today because I had a cold.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0232",
    "example_index": 5,
    "target_vocab": {
      "kanji": "今日",
      "kana": "きょう",
      "meaning": "today"
    },
    "sentence": {
      "japanese": "きょうは天気が悪いです。",
      "kana": "きょうはてんきがわるいです。",
      "english": "The weather's not good today.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0233",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "とても",
      "meaning": "very"
    },
    "sentence": {
      "japanese": "とても暗いので私は本が読めない。",
      "kana": "とてもくらいのでわたしはほんがよめない。",
      "english": "It is too dark for me to read.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0233",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "とても",
      "meaning": "very"
    },
    "sentence": {
      "japanese": "今日はとてもチャーミングだね。",
      "kana": "こんにちはとてもちゃーみんぐだね。",
      "english": "You look very charming today.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0233",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "とても",
      "meaning": "very"
    },
    "sentence": {
      "japanese": "これはとてもまろやかなコーヒーだ。",
      "kana": "これはとてもまろやかなこーひーだ。",
      "english": "This is a very mild coffee.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0235",
    "example_index": 0,
    "target_vocab": {
      "kanji": "文章",
      "kana": "ぶんしょう",
      "meaning": "sentence"
    },
    "sentence": {
      "japanese": "彼は文章を書くのが上手であるとわかった。",
      "kana": "かれはぶんしょうをかくのがじょうずであるとわかった。",
      "english": "He proved to be a good writer.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0235",
    "example_index": 1,
    "target_vocab": {
      "kanji": "文章",
      "kana": "ぶんしょう",
      "meaning": "sentence"
    },
    "sentence": {
      "japanese": "私はこれらの文章の意味がわからない。",
      "kana": "わたしはこれらのぶんしょうのいみがわからない。",
      "english": "I can't make sense of these sentences.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0235",
    "example_index": 2,
    "target_vocab": {
      "kanji": "文章",
      "kana": "ぶんしょう",
      "meaning": "sentence"
    },
    "sentence": {
      "japanese": "この文章の意味が曖昧なんだよ。",
      "kana": "このぶんしょうのいみがあいまいなんだよ。",
      "english": "The meaning of this sentence is obscure.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0236",
    "example_index": 0,
    "target_vocab": {
      "kanji": "公園",
      "kana": "こうえん",
      "meaning": "park"
    },
    "sentence": {
      "japanese": "あなたに公園の行き方を教えましょう。",
      "kana": "あなたにこうえんのいきかたをおしえましょう。",
      "english": "I will show you how to go to the park.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0236",
    "example_index": 1,
    "target_vocab": {
      "kanji": "公園",
      "kana": "こうえん",
      "meaning": "park"
    },
    "sentence": {
      "japanese": "風が強く吹いたので、彼らは公園で遊べなかった。",
      "kana": "かぜがつよくふいたので、かれらはこうえんであそべなかった。",
      "english": "The wind blew too hard for them to play in the park.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0236",
    "example_index": 2,
    "target_vocab": {
      "kanji": "公園",
      "kana": "こうえん",
      "meaning": "park"
    },
    "sentence": {
      "japanese": "彼女は彼と一緒に公園に行った。",
      "kana": "かのじょはかれといっしょにこうえんにいった。",
      "english": "She went to the park with him.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0237",
    "example_index": 0,
    "target_vocab": {
      "kanji": "借りる",
      "kana": "かりる",
      "meaning": "to borrow"
    },
    "sentence": {
      "japanese": "彼らはアパートを借りた。",
      "kana": "かれらはあぱーとをかりた。",
      "english": "They rented an apartment.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0237",
    "example_index": 1,
    "target_vocab": {
      "kanji": "借りる",
      "kana": "かりる",
      "meaning": "to borrow"
    },
    "sentence": {
      "japanese": "彼はアパートを借りた。",
      "kana": "かれはあぱーとをかりた。",
      "english": "He rented an apartment.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0237",
    "example_index": 2,
    "target_vocab": {
      "kanji": "借りる",
      "kana": "かりる",
      "meaning": "to borrow"
    },
    "sentence": {
      "japanese": "借りるのが好きな人は返すのが嫌いだ。",
      "kana": "かりるのがすきなにんはかえすのがきらいだ。",
      "english": "Those who like borrowing dislike paying.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0238",
    "example_index": 0,
    "target_vocab": {
      "kanji": "口",
      "kana": "くち",
      "meaning": "mouth"
    },
    "sentence": {
      "japanese": "あの仕事の口はまだあるよ。",
      "kana": "あのしごとのくちはまだあるよ。",
      "english": "The job offer still stands.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0238",
    "example_index": 1,
    "target_vocab": {
      "kanji": "口",
      "kana": "くち",
      "meaning": "mouth"
    },
    "sentence": {
      "japanese": "彼は口が重い。",
      "kana": "かれはくちがおもい。",
      "english": "He is a man of few words.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0238",
    "example_index": 2,
    "target_vocab": {
      "kanji": "口",
      "kana": "くち",
      "meaning": "mouth"
    },
    "sentence": {
      "japanese": "存外、口は達者なようね。",
      "kana": "ぞんがい、くちはたっしゃなようね。",
      "english": "It seems like you're unexpectedly eloquent.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0239",
    "example_index": 0,
    "target_vocab": {
      "kanji": "持つ",
      "kana": "もつ",
      "meaning": "to hold"
    },
    "sentence": {
      "japanese": "ペンか鉛筆を持っていますか。",
      "kana": "ぺんかえんぴつをもっていますか。",
      "english": "Do you have a pen or a pencil?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0239",
    "example_index": 1,
    "target_vocab": {
      "kanji": "持つ",
      "kana": "もつ",
      "meaning": "to hold"
    },
    "sentence": {
      "japanese": "ポケットに何を持っていますか。",
      "kana": "ぽけっとになにをもっていますか。",
      "english": "What do you have in your pocket?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0239",
    "example_index": 2,
    "target_vocab": {
      "kanji": "持つ",
      "kana": "もつ",
      "meaning": "to hold"
    },
    "sentence": {
      "japanese": "あなたは外国の本を持っていますか。",
      "kana": "あなたはがいこくのほんをもっていますか。",
      "english": "Do you have any foreign books?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0239",
    "example_index": 3,
    "target_vocab": {
      "kanji": "持つ",
      "kana": "もつ",
      "meaning": "to hold"
    },
    "sentence": {
      "japanese": "この靴は二年もつでしょう。",
      "kana": "このくつはにねんもつでしょう。",
      "english": "These shoes will last you two years.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0240",
    "example_index": 0,
    "target_vocab": {
      "kanji": "上着",
      "kana": "うわぎ",
      "meaning": "jacket"
    },
    "sentence": {
      "japanese": "彼女は青い上着を着ていた。",
      "kana": "かのじょはあおいうわぎをきていた。",
      "english": "She was wearing a blue coat.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0240",
    "example_index": 1,
    "target_vocab": {
      "kanji": "上着",
      "kana": "うわぎ",
      "meaning": "jacket"
    },
    "sentence": {
      "japanese": "彼女は新しい上着を着た。",
      "kana": "かのじょはあたらしいうわぎをきた。",
      "english": "She clothed herself in a new suit.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0240",
    "example_index": 2,
    "target_vocab": {
      "kanji": "上着",
      "kana": "うわぎ",
      "meaning": "jacket"
    },
    "sentence": {
      "japanese": "彼女は上着を脱いだ。",
      "kana": "かのじょはうわぎをぬいだ。",
      "english": "She took off her coat.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0241",
    "example_index": 0,
    "target_vocab": {
      "kanji": "秋",
      "kana": "あき",
      "meaning": "autumn"
    },
    "sentence": {
      "japanese": "春に咲く花もあれば、秋に咲く花もある。",
      "kana": "はるにさくはなもあれば、あきにさくはなもある。",
      "english": "Some flowers bloom in spring and others in autumn.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0241",
    "example_index": 1,
    "target_vocab": {
      "kanji": "秋",
      "kana": "あき",
      "meaning": "autumn"
    },
    "sentence": {
      "japanese": "春と秋、どっちが好きですか？",
      "kana": "はるとあき、どっちがすきですか？",
      "english": "Which do you prefer, spring or autumn?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0241",
    "example_index": 2,
    "target_vocab": {
      "kanji": "秋",
      "kana": "あき",
      "meaning": "autumn"
    },
    "sentence": {
      "japanese": "春と秋ではどちらが好きですか。",
      "kana": "はるとあきではどちらがすきですか。",
      "english": "Which do you like better, spring or autumn?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0242",
    "example_index": 0,
    "target_vocab": {
      "kanji": "悪い",
      "kana": "わるい",
      "meaning": "bad"
    },
    "sentence": {
      "japanese": "この悪い天気はもうたくさんだ。",
      "kana": "このわるいてんきはもうたくさんだ。",
      "english": "We've had enough of this bad weather.",
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
