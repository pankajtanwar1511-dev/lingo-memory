#!/usr/bin/env python3
"""
Generate comprehensive examples for N5 verbs (Batch 1: Verbs 1-10)
Covers Dictionary Form and Te Form patterns from comparison table
"""

import json

# First 10 verbs examples
verb_examples = {
    "n5_verb_0001": {  # 会う (meet)
        "dictFormExamples": [
            {
                "japanese": "毎週、友達に会う。",
                "kana": "まいしゅう、ともだちにあう。",
                "english": "I meet my friends every week.",
                "highlight": "daily habit",
                "pattern": "habitual"
            },
            {
                "japanese": "人に会う前に、服を着替える。",
                "kana": "ひとにあうまえに、ふくをきがえる。",
                "english": "I change clothes before meeting people.",
                "highlight": "before action",
                "pattern": "before"
            }
        ],
        "teFormExamples": [
            {
                "japanese": "友達に会って、話をしました。",
                "kana": "ともだちにあって、はなしをしました。",
                "english": "I met my friend and talked.",
                "highlight": "sequential actions",
                "pattern": "sequential"
            },
            {
                "japanese": "明日、先生に会ってください。",
                "kana": "あした、せんせいにあってください。",
                "english": "Please meet the teacher tomorrow.",
                "highlight": "polite request",
                "pattern": "request"
            }
        ]
    },

    "n5_verb_0002": {  # 遊ぶ (play)
        "dictFormExamples": [
            {
                "japanese": "子供は毎日、公園で遊ぶ。",
                "kana": "こどもはまいにち、こうえんであそぶ。",
                "english": "Children play in the park every day.",
                "highlight": "daily habit",
                "pattern": "habitual"
            },
            {
                "japanese": "友達と遊ぶのが好きです。",
                "kana": "ともだちとあそぶのがすきです。",
                "english": "I like playing with friends.",
                "highlight": "nominalization",
                "pattern": "nominalization"
            }
        ],
        "teFormExamples": [
            {
                "japanese": "宿題をしてから、遊んでもいいですか。",
                "kana": "しゅくだいをしてから、あそんでもいいですか。",
                "english": "May I play after doing homework?",
                "highlight": "permission",
                "pattern": "permission"
            },
            {
                "japanese": "外で遊んでいる子供たちが見えます。",
                "kana": "そとであそんでいるこどもたちがみえます。",
                "english": "I can see children playing outside.",
                "highlight": "present progressive",
                "pattern": "progressive"
            }
        ]
    },

    "n5_verb_0003": {  # 洗う (wash)
        "dictFormExamples": [
            {
                "japanese": "食べる前に、手を洗う。",
                "kana": "たべるまえに、てをあらう。",
                "english": "I wash my hands before eating.",
                "highlight": "before action",
                "pattern": "before"
            },
            {
                "japanese": "毎朝、顔を洗う。",
                "kana": "まいあさ、かおをあらう。",
                "english": "I wash my face every morning.",
                "highlight": "daily routine",
                "pattern": "habitual"
            }
        ],
        "teFormExamples": [
            {
                "japanese": "手を洗ってから、料理を作ります。",
                "kana": "てをあらってから、りょうりをつくります。",
                "english": "After washing hands, I cook.",
                "highlight": "after action",
                "pattern": "after"
            },
            {
                "japanese": "野菜を洗ってください。",
                "kana": "やさいをあらってください。",
                "english": "Please wash the vegetables.",
                "highlight": "polite request",
                "pattern": "request"
            }
        ]
    },

    "n5_verb_0004": {  # ある (exist/have)
        "dictFormExamples": [
            {
                "japanese": "駅の近くにスーパーがある。",
                "kana": "えきのちかくにスーパーがある。",
                "english": "There is a supermarket near the station.",
                "highlight": "existence",
                "pattern": "habitual"
            },
            {
                "japanese": "本がたくさんあることができます。",
                "kana": "ほんがたくさんあることができます。",
                "english": "There can be many books.",
                "highlight": "possibility",
                "pattern": "ability"
            }
        ],
        "teFormExamples": [
            {
                "japanese": "お金があって、嬉しいです。",
                "kana": "おかねがあって、うれしいです。",
                "english": "I have money and I'm happy.",
                "highlight": "sequential state",
                "pattern": "sequential"
            },
            {
                "japanese": "質問があったら、聞いてください。",
                "kana": "しつもんがあったら、きいてください。",
                "english": "If you have questions, please ask.",
                "highlight": "conditional request",
                "pattern": "request"
            }
        ]
    },

    "n5_verb_0007": {  # 歩く (walk)
        "dictFormExamples": [
            {
                "japanese": "毎朝、公園を歩く。",
                "kana": "まいあさ、こうえんをあるく。",
                "english": "I walk in the park every morning.",
                "highlight": "daily habit",
                "pattern": "habitual"
            },
            {
                "japanese": "歩くのは健康にいいです。",
                "kana": "あるくのはけんこうにいいです。",
                "english": "Walking is good for health.",
                "highlight": "nominalization",
                "pattern": "nominalization"
            }
        ],
        "teFormExamples": [
            {
                "japanese": "駅まで歩いて行きます。",
                "kana": "えきまであるいていきます。",
                "english": "I walk to the station.",
                "highlight": "manner of movement",
                "pattern": "sequential"
            },
            {
                "japanese": "ゆっくり歩いてください。",
                "kana": "ゆっくりあるいてください。",
                "english": "Please walk slowly.",
                "highlight": "polite request",
                "pattern": "request"
            }
        ]
    },

    "n5_verb_0008": {  # 言う (say)
        "dictFormExamples": [
            {
                "japanese": "いつも本当のことを言う。",
                "kana": "いつもほんとうのことをいう。",
                "english": "I always say the truth.",
                "highlight": "habitual action",
                "pattern": "habitual"
            },
            {
                "japanese": "日本語で言うことができますか。",
                "kana": "にほんごでいうことができますか。",
                "english": "Can you say it in Japanese?",
                "highlight": "ability",
                "pattern": "ability"
            }
        ],
        "teFormExamples": [
            {
                "japanese": "もう一度言ってください。",
                "kana": "もういちどいってください。",
                "english": "Please say it one more time.",
                "highlight": "polite request",
                "pattern": "request"
            },
            {
                "japanese": "先生が言っていることが分かりません。",
                "kana": "せんせいがいっていることがわかりません。",
                "english": "I don't understand what the teacher is saying.",
                "highlight": "present progressive",
                "pattern": "progressive"
            }
        ]
    },

    "n5_verb_0009": {  # 行く (go)
        "dictFormExamples": [
            {
                "japanese": "毎日、学校に行く。",
                "kana": "まいにち、がっこうにいく。",
                "english": "I go to school every day.",
                "highlight": "daily routine",
                "pattern": "habitual"
            },
            {
                "japanese": "来年、日本に行くつもりです。",
                "kana": "らいねん、にほんにいくつもりです。",
                "english": "I plan to go to Japan next year.",
                "highlight": "future plan",
                "pattern": "intention"
            }
        ],
        "teFormExamples": [
            {
                "japanese": "スーパーに行って、野菜を買いました。",
                "kana": "スーパーにいって、やさいをかいました。",
                "english": "I went to the supermarket and bought vegetables.",
                "highlight": "sequential actions",
                "pattern": "sequential"
            },
            {
                "japanese": "一緒に行ってもいいですか。",
                "kana": "いっしょにいってもいいですか。",
                "english": "May I go with you?",
                "highlight": "permission",
                "pattern": "permission"
            }
        ]
    },

    "n5_verb_0010": {  # 急ぐ (hurry)
        "dictFormExamples": [
            {
                "japanese": "朝はいつも急ぐ。",
                "kana": "あさはいつもいそぐ。",
                "english": "I always hurry in the morning.",
                "highlight": "daily habit",
                "pattern": "habitual"
            },
            {
                "japanese": "急ぐ前に、忘れ物がないか確認する。",
                "kana": "いそぐまえに、わすれものがないかかくにんする。",
                "english": "Before hurrying, I check if I forgot anything.",
                "highlight": "before action",
                "pattern": "before"
            }
        ],
        "teFormExamples": [
            {
                "japanese": "急いで走りました。",
                "kana": "いそいではしりました。",
                "english": "I hurried and ran.",
                "highlight": "sequential actions",
                "pattern": "sequential"
            },
            {
                "japanese": "急いでください。遅れますよ。",
                "kana": "いそいでください。おくれますよ。",
                "english": "Please hurry. We'll be late.",
                "highlight": "polite request",
                "pattern": "request"
            }
        ]
    },

    "n5_verb_0011": {  # 要る (need)
        "dictFormExamples": [
            {
                "japanese": "毎日、お金が要る。",
                "kana": "まいにち、おかねがいる。",
                "english": "I need money every day.",
                "highlight": "daily need",
                "pattern": "habitual"
            },
            {
                "japanese": "この仕事には時間が要ることが分かった。",
                "kana": "このしごとにはじかんがいることがわかった。",
                "english": "I understood that this work requires time.",
                "highlight": "nominalization",
                "pattern": "nominalization"
            }
        ],
        "teFormExamples": [
            {
                "japanese": "パスポートが要って、困りました。",
                "kana": "パスポートがいって、こまりました。",
                "english": "I needed a passport and was troubled.",
                "highlight": "sequential state",
                "pattern": "sequential"
            },
            {
                "japanese": "何が要っているか教えてください。",
                "kana": "なにがいっているかおしえてください。",
                "english": "Please tell me what is needed.",
                "highlight": "present progressive + request",
                "pattern": "request"
            }
        ]
    },

    "n5_verb_0012": {  # 動く (move)
        "dictFormExamples": [
            {
                "japanese": "機械が毎日動く。",
                "kana": "きかいがまいにちうごく。",
                "english": "The machine moves every day.",
                "highlight": "habitual action",
                "pattern": "habitual"
            },
            {
                "japanese": "動くことができません。",
                "kana": "うごくことができません。",
                "english": "It cannot move.",
                "highlight": "ability (negative)",
                "pattern": "ability"
            }
        ],
        "teFormExamples": [
            {
                "japanese": "車が動いています。",
                "kana": "くるまがうごいています。",
                "english": "The car is moving.",
                "highlight": "present progressive",
                "pattern": "progressive"
            },
            {
                "japanese": "少し動いてください。",
                "kana": "すこしうごいてください。",
                "english": "Please move a little.",
                "highlight": "polite request",
                "pattern": "request"
            }
        ]
    }
}

# Output the examples
print(json.dumps(verb_examples, ensure_ascii=False, indent=2))
