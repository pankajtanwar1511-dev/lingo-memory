/**
 * Predefined Verb Lists for N5 Learning
 *
 * This file contains curated lists of N5 verbs organized by:
 * - Difficulty level (Beginner, Intermediate, Advanced)
 * - Thematic categories (Daily Life, Movement, Communication, etc.)
 * - Grammar groups (Godan, Ichidan, Irregular)
 */

export interface VerbList {
  id: string
  name: string
  description: string
  category: 'difficulty' | 'thematic' | 'grammar' | 'custom'
  verbIds: string[]
  icon?: string
  color?: string
}

/**
 * Difficulty-Based Lists
 * - Beginner: Most common, essential verbs for everyday use
 * - Intermediate: Common verbs with specific contexts
 * - Advanced: Less common, specialized verbs
 */
export const DIFFICULTY_LISTS: VerbList[] = [
  {
    id: 'beginner',
    name: 'Beginner Verbs',
    description: 'Essential verbs for everyday conversations - perfect for starting your Japanese journey',
    category: 'difficulty',
    icon: '🌱',
    color: 'green',
    verbIds: [
      'n5_verb_0001', // 会う - meet
      'n5_verb_0004', // ある - exist (inanimate)
      'n5_verb_0008', // 言う - say
      'n5_verb_0009', // 行く - go
      'n5_verb_0024', // 来る - come
      'n5_verb_0026', // する - do
      'n5_verb_0028', // 食べる - eat
      'n5_verb_0033', // 飲む - drink
      'n5_verb_0034', // 見る - see/watch
      'n5_verb_0041', // 買う - buy
      'n5_verb_0042', // 書く - write
      'n5_verb_0044', // 帰る - return home
      'n5_verb_0048', // 聞く - listen/hear/ask
      'n5_verb_0058', // 話す - speak
      'n5_verb_0062', // 読む - read
      'n5_verb_0073', // わかる - understand
      'n5_verb_0076', // いる - exist (animate)
      'n5_verb_0083', // やる - do
      'n5_verb_0086', // あげる - give
      'n5_verb_0091', // もらう - receive
      'n5_verb_0095', // 起きる - wake up
      'n5_verb_0099', // 寝る - sleep
      'n5_verb_0102', // 入る - enter
      'n5_verb_0107', // 出る - exit/leave
      'n5_verb_0114', // 乗る - ride
      'n5_verb_0117', // 降りる - get off
      'n5_verb_0125' // 開く - open
    ]
  },
  {
    id: 'intermediate',
    name: 'Intermediate Verbs',
    description: 'Common verbs for specific situations and daily activities',
    category: 'difficulty',
    icon: '🌿',
    color: 'blue',
    verbIds: [
      'n5_verb_0003', // 洗う - wash
      'n5_verb_0007', // 歩く - walk
      'n5_verb_0010', // 急ぐ - hurry
      'n5_verb_0013', // 働く - work
      'n5_verb_0014', // 送る - send
      'n5_verb_0016', // 待つ - wait
      'n5_verb_0021', // 休む - rest
      'n5_verb_0023', // 始まる - begin
      'n5_verb_0029', // 教える - teach
      'n5_verb_0035', // 使う - use
      'n5_verb_0037', // 作る - make
      'n5_verb_0039', // 習う - learn
      'n5_verb_0040', // 覚える - memorize
      'n5_verb_0043', // 切る - cut
      'n5_verb_0046', // 貸す - lend
      'n5_verb_0047', // 借りる - borrow
      'n5_verb_0052', // 売る - sell
      'n5_verb_0055', // 止まる - stop
      'n5_verb_0056', // 曲がる - turn
      'n5_verb_0059', // 渡る - cross
      'n5_verb_0061', // 住む - live/reside
      'n5_verb_0064', // 泳ぐ - swim
      'n5_verb_0065', // 歌う - sing
      'n5_verb_0067', // 踊る - dance
      'n5_verb_0070', // 走る - run
      'n5_verb_0071', // 呼ぶ - call
      'n5_verb_0074', // 答える - answer
      'n5_verb_0078', // 吹く - blow
      'n5_verb_0082' // 降る - fall (rain/snow)
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced Verbs',
    description: 'Specialized and less common verbs for expanding your vocabulary',
    category: 'difficulty',
    icon: '🌳',
    color: 'purple',
    verbIds: [
      'n5_verb_0002', // 遊ぶ - play
      'n5_verb_0011', // 要る - need
      'n5_verb_0012', // 動く - move
      'n5_verb_0015', // 終わる - end
      'n5_verb_0018', // 忘れる - forget
      'n5_verb_0019', // 持つ - hold/have
      'n5_verb_0020', // 立つ - stand
      'n5_verb_0022', // 知る - know
      'n5_verb_0025', // 着る - wear
      'n5_verb_0027', // 座る - sit
      'n5_verb_0030', // 思う - think
      'n5_verb_0031', // 置く - put/place
      'n5_verb_0032', // 押す - push
      'n5_verb_0036', // 撮る - take (photo)
      'n5_verb_0038', // 直す - fix/correct
      'n5_verb_0045', // 消す - turn off/erase
      'n5_verb_0049', // 着く - arrive
      'n5_verb_0050', // つける - turn on/attach
      'n5_verb_0051', // 付く - be attached
      'n5_verb_0053', // 脱ぐ - take off (clothes)
      'n5_verb_0054', // 並ぶ - line up
      'n5_verb_0057', // 閉める - close/shut
      'n5_verb_0060', // 登る - climb
      'n5_verb_0063', // 弾く - play (instrument)
      'n5_verb_0066', // 勝つ - win
      'n5_verb_0068', // 負ける - lose
      'n5_verb_0069', // 困る - be troubled
      'n5_verb_0072', // 分かれる - separate/split
      'n5_verb_0075', // 浴びる - pour/shower
      'n5_verb_0077', // 要る - need (alternative reading)
      'n5_verb_0079', // 違う - differ
      'n5_verb_0080', // 晴れる - clear up (weather)
      'n5_verb_0081', // 曇る - become cloudy
      'n5_verb_0084', // 鳴る - ring/sound
      'n5_verb_0085', // 光る - shine
      'n5_verb_0087', // 上げる - raise
      'n5_verb_0088', // 下げる - lower
      'n5_verb_0089', // 出す - take out/send
      'n5_verb_0090', // 入れる - put in
      'n5_verb_0092', // くれる - give (to me)
      'n5_verb_0093', // 見せる - show
      'n5_verb_0094', // 教える - tell
      'n5_verb_0096', // 出かける - go out
      'n5_verb_0097', // 掛ける - hang/make (phone call)
      'n5_verb_0098', // かける - put on (glasses)
      'n5_verb_0100', // 起こす - wake (someone)
      'n5_verb_0101', // 疲れる - get tired
      'n5_verb_0103', // 要る - need (variant)
      'n5_verb_0104', // 触る - touch
      'n5_verb_0105', // 曲げる - bend
      'n5_verb_0106', // 折る - break/fold
      'n5_verb_0108', // 上がる - go up/rise
      'n5_verb_0109', // 下がる - go down
      'n5_verb_0110', // 上る - ascend
      'n5_verb_0111', // 下る - descend
      'n5_verb_0112', // 戻る - return
      'n5_verb_0113', // 通る - pass through
      'n5_verb_0115', // 過ぎる - pass/exceed
      'n5_verb_0116', // 回る - go around
      'n5_verb_0118', // 飛ぶ - fly
      'n5_verb_0119', // 滑る - slide/slip
      'n5_verb_0120', // 転ぶ - fall down
      'n5_verb_0121', // 落ちる - fall/drop
      'n5_verb_0122', // 落とす - drop
      'n5_verb_0123', // 拾う - pick up
      'n5_verb_0124', // 並べる - arrange/line up
      'n5_verb_0126', // 閉まる - close (intransitive)
      'n5_verb_0127', // 開ける - open (transitive)
      'n5_verb_0128', // 建てる - build
      'n5_verb_0129', // 建つ - be built
      'n5_verb_0130', // 壊す - break/destroy
      'n5_verb_0131', // 壊れる - break (intransitive)
      'n5_verb_0132', // 汚す - make dirty
      'n5_verb_0133', // 汚れる - get dirty
      'n5_verb_0134', // 濡れる - get wet
      'n5_verb_0135', // 乾く - dry (intransitive)
      'n5_verb_0136', // 乾かす - dry (transitive)
      'n5_verb_0137', // 焼く - grill/bake
      'n5_verb_0138', // 焼ける - be grilled/burned
      'n5_verb_0139', // 沸く - boil (intransitive)
      'n5_verb_0140', // 沸かす - boil (transitive)
      'n5_verb_0141'  // 冷える - get cold
    ]
  }
]

/**
 * Thematic Lists
 * Comprehensive categories covering all aspects of N5 verb usage
 */
export const THEMATIC_LISTS: VerbList[] = [
  {
    id: 'daily-life',
    name: 'Daily Life & Routines',
    description: 'Essential verbs for daily activities, eating, sleeping, and household tasks',
    category: 'thematic',
    icon: '🏠',
    color: 'orange',
    verbIds: [
      'n5_verb_0003', // 洗う - wash
      'n5_verb_0025', // 着る - wear
      'n5_verb_0028', // 食べる - eat
      'n5_verb_0033', // 飲む - drink
      'n5_verb_0035', // 使う - use
      'n5_verb_0037', // 作る - make
      'n5_verb_0045', // 消す - turn off
      'n5_verb_0050', // つける - turn on
      'n5_verb_0053', // 脱ぐ - take off
      'n5_verb_0040', // 住む - live
      'n5_verb_0066', // 履く - put on (shoes/pants)
      'n5_verb_0095', // 起きる - wake up
      'n5_verb_0099', // 寝る - sleep
      'n5_verb_0063', // 入る - enter
      'n5_verb_0107', // くれる - give (to me)
      'n5_verb_0125', // 開く - open
      'n5_verb_0126', // 閉まる - close (intransitive)
      'n5_verb_0127', // 開ける - open (transitive)
      'n5_verb_0057', // 閉める - close
      'n5_verb_0108'  // 閉める - close/shut
    ]
  },
  {
    id: 'movement',
    name: 'Movement & Transportation',
    description: 'Verbs for walking, traveling, and changing location',
    category: 'thematic',
    icon: '🚶',
    color: 'teal',
    verbIds: [
      'n5_verb_0007', // 歩く - walk
      'n5_verb_0009', // 行く - go
      'n5_verb_0056', // なる - become/turn into
      'n5_verb_0058', // 登る - climb
      'n5_verb_0062', // 乗る - ride
      'n5_verb_0114', // つける - turn on
      'n5_verb_0117', // 出る - exit/leave
      'n5_verb_0096', // 出かける - go out
      'n5_verb_0115'  // 過ぎる - pass/exceed
    ]
  },
  {
    id: 'communication',
    name: 'Communication & Social',
    description: 'Speaking, listening, reading, writing, and interacting with others',
    category: 'thematic',
    icon: '💬',
    color: 'pink',
    verbIds: [
      'n5_verb_0001', // 会う - meet
      'n5_verb_0008', // 言う - say
      'n5_verb_0029', // 教える - teach/tell
      'n5_verb_0042', // 書く - write
      'n5_verb_0048', // 聞く - listen/hear/ask
      'n5_verb_0082', // 呼ぶ - call
      'n5_verb_0093', // 見せる - show
      'n5_verb_0094', // 教える - tell
      'n5_verb_0097', // 掛ける - make (phone call)
      'n5_verb_0014'  // 送る - send
    ]
  },
  {
    id: 'work-study',
    name: 'Work & Study',
    description: 'Professional activities, learning, and academic tasks',
    category: 'thematic',
    icon: '📚',
    color: 'indigo',
    verbIds: [
      'n5_verb_0013', 'n5_verb_0021', 'n5_verb_0023', 'n5_verb_0026', 'n5_verb_0029',
      'n5_verb_0039', 'n5_verb_0040', 'n5_verb_0018', 'n5_verb_0046', 'n5_verb_0047',
      'n5_verb_0083', 'n5_verb_0015', 'n5_verb_0022', 'n5_verb_0073', 'n5_verb_0038'
    ]
  },
  {
    id: 'food-dining',
    name: 'Food & Dining',
    description: 'Eating, drinking, cooking, and restaurant-related verbs',
    category: 'thematic',
    icon: '🍱',
    color: 'red',
    verbIds: [
      'n5_verb_0028', // 食べる - eat
      'n5_verb_0033', // 飲む - drink
      'n5_verb_0037', // 作る - make
      'n5_verb_0137', // 焼く - grill/bake
      'n5_verb_0138', // 焼ける - be grilled
      'n5_verb_0139', // 沸く - boil (intransitive)
      'n5_verb_0140', // 沸かす - boil (transitive)
      'n5_verb_0003'  // 洗う - wash
    ]
  },
  {
    id: 'recreation',
    name: 'Hobbies & Recreation',
    description: 'Playing, sports, entertainment, and leisure activities',
    category: 'thematic',
    icon: '⚽',
    color: 'green',
    verbIds: [
      'n5_verb_0002', // 遊ぶ - play
      'n5_verb_0021', // 泳ぐ - swim
      'n5_verb_0013', // 歌う - sing
      'n5_verb_0070', // 弾く - play (instrument)
      'n5_verb_0067', // 踊る - dance
      'n5_verb_0030', // 勝つ - win
      'n5_verb_0068', // 負ける - lose
      'n5_verb_0036'  // 撮る - take (photo)
    ]
  },
  {
    id: 'shopping',
    name: 'Shopping & Money',
    description: 'Buying, selling, and financial transactions',
    category: 'thematic',
    icon: '🛒',
    color: 'cyan',
    verbIds: [
      'n5_verb_0041', // 買う - buy
      'n5_verb_0052', // 売る - sell
      'n5_verb_0046', // 貸す - lend
      'n5_verb_0047', // 借りる - borrow
      'n5_verb_0004', // ある - exist/have
      'n5_verb_0011', // 要る - need
      'n5_verb_0086', // あげる - give
      'n5_verb_0078', // もらう - receive
      'n5_verb_0107'  // くれる - give (to me)
    ]
  },
  {
    id: 'weather-nature',
    name: 'Weather & Nature',
    description: 'Weather phenomena and natural events',
    category: 'thematic',
    icon: '🌤️',
    color: 'violet',
    verbIds: [
      'n5_verb_0072'  // 降る - rain
    ]
  },
  {
    id: 'body-actions',
    name: 'Body Actions & Posture',
    description: 'Physical actions, posture changes, and body movements',
    category: 'thematic',
    icon: '🧘',
    color: 'rose',
    verbIds: [
      'n5_verb_0020', // 立つ - stand
      'n5_verb_0027', // 座る - sit
      'n5_verb_0019', // 持つ - hold
      'n5_verb_0070', // 走る - run
      'n5_verb_0007', // 歩く - walk
      'n5_verb_0095', // 起きる - wake up
      'n5_verb_0099', // 寝る - sleep
      'n5_verb_0100', // 起こす - wake (someone)
      'n5_verb_0101', // 疲れる - get tired
      'n5_verb_0113', // 疲れる - get tired
      'n5_verb_0104', // 触る - touch
      'n5_verb_0105', // 曲げる - bend
      'n5_verb_0106', // 折る - break/fold
      'n5_verb_0120'  // 転ぶ - fall down
    ]
  },
  {
    id: 'putting-placing',
    name: 'Putting & Placing Things',
    description: 'Actions related to positioning, arranging, and organizing objects',
    category: 'thematic',
    icon: '📦',
    color: 'orange',
    verbIds: [
      'n5_verb_0031', // 置く - put/place
      'n5_verb_0089', // 出す - take out
      'n5_verb_0090', // 入れる - put in
      'n5_verb_0087', // 上げる - raise
      'n5_verb_0088', // 下げる - lower
      'n5_verb_0054', // 並ぶ - line up
      'n5_verb_0124', // 並べる - arrange
      'n5_verb_0123', // 拾う - pick up
      'n5_verb_0122'  // 落とす - drop
    ]
  },
  {
    id: 'changes-states',
    name: 'Changes & State Transitions',
    description: 'Verbs describing changes in condition or state',
    category: 'thematic',
    icon: '🔄',
    color: 'purple',
    verbIds: [
      'n5_verb_0023', // 始まる - begin
      'n5_verb_0015', // 終わる - end
      'n5_verb_0125', // 開く - open
      'n5_verb_0126', // 閉まる - close
      'n5_verb_0129', // 建つ - be built
      'n5_verb_0131', // 壊れる - break
      'n5_verb_0133', // 汚れる - get dirty
      'n5_verb_0134', // 濡れる - get wet
      'n5_verb_0135', // 乾く - dry
      'n5_verb_0138', // 焼ける - be grilled
      'n5_verb_0141'  // 冷える - get cold
    ]
  },
  {
    id: 'making-breaking',
    name: 'Making & Breaking',
    description: 'Construction, destruction, repair, and transformation',
    category: 'thematic',
    icon: '🔨',
    color: 'blue',
    verbIds: [
      'n5_verb_0037', // 作る - make
      'n5_verb_0128', // 建てる - build
      'n5_verb_0130', // 壊す - destroy
      'n5_verb_0131', // 壊れる - break
      'n5_verb_0038', // 直す - fix
      'n5_verb_0043', // 切る - cut
      'n5_verb_0106', // 折る - break/fold
      'n5_verb_0132', // 汚す - make dirty
      'n5_verb_0136'  // 乾かす - dry (transitive)
    ]
  },
  {
    id: 'household-chores',
    name: 'Household Chores',
    description: 'Cleaning, washing, and daily household maintenance tasks',
    category: 'thematic',
    icon: '🧹',
    color: 'teal',
    verbIds: [
      'n5_verb_0147', // 洗濯する - wash (clothes)
      'n5_verb_0148', // 掃除する - clean (a room)
      'n5_verb_0003'  // 洗う - wash
    ]
  },
  {
    id: 'business-travel',
    name: 'Business & Travel',
    description: 'Professional activities, accommodations, and travel arrangements',
    category: 'thematic',
    icon: '💼',
    color: 'indigo',
    verbIds: [
      'n5_verb_0142', // 出張する - go on business trip
      'n5_verb_0049', // 泊まる - stay (overnight)
      'n5_verb_0151', // 予約する - reserve/book
      'n5_verb_0152'  // 留学する - study abroad
    ]
  },
  {
    id: 'advanced-communication',
    name: 'Advanced Communication',
    description: 'Introducing, explaining, calling, and detailed conversations',
    category: 'thematic',
    icon: '📞',
    color: 'pink',
    verbIds: [
      'n5_verb_0143', // 紹介する - introduce
      'n5_verb_0146', // 説明する - explain
      'n5_verb_0149', // 電話する - phone
      'n5_verb_0034'  // 聞く - ask
    ]
  },
  {
    id: 'emotions-mindset',
    name: 'Emotions & Mindset',
    description: 'Feelings, attitudes, and mental states',
    category: 'thematic',
    icon: '💭',
    color: 'purple',
    verbIds: [
      'n5_verb_0145', // 心配する - worry
      'n5_verb_0032', // 頑張る - do one's best
      'n5_verb_0079'  // 役に立つ - be useful
    ]
  },
  {
    id: 'transactions',
    name: 'Transactions & Exchanges',
    description: 'Paying, sending, and financial/postal transactions',
    category: 'thematic',
    icon: '💰',
    color: 'green',
    verbIds: [
      'n5_verb_0069', // 払う - pay
      'n5_verb_0016'  // 送る - send
    ]
  },
  {
    id: 'learning-education',
    name: 'Learning & Education',
    description: 'Studying, teaching, memorizing, and academic activities',
    category: 'thematic',
    icon: '📖',
    color: 'blue',
    verbIds: [
      'n5_verb_0150', // 勉強する - study
      'n5_verb_0096', // 教える - teach
      'n5_verb_0098', // 覚える - memorize
      'n5_verb_0103'  // 借りる - borrow
    ]
  },
  {
    id: 'carrying-bringing',
    name: 'Carrying & Bringing',
    description: 'Taking, bringing, and transporting people or things',
    category: 'thematic',
    icon: '🎒',
    color: 'orange',
    verbIds: [
      'n5_verb_0076', // 持つ - hold/have
      'n5_verb_0077', // 持って行く - take (something)
      'n5_verb_0154', // 持って来る - bring (something)
      'n5_verb_0153', // 連れて来る - bring (someone)
      'n5_verb_0051'  // 撮る - take (photo)
    ]
  },
  {
    id: 'urgent-actions',
    name: 'Urgent & Quick Actions',
    description: 'Hurrying, moving quickly, and time-sensitive actions',
    category: 'thematic',
    icon: '⚡',
    color: 'red',
    verbIds: [
      'n5_verb_0010', // 急ぐ - hurry
      'n5_verb_0012'  // 動く - move/work
    ]
  },
  {
    id: 'dining-meals',
    name: 'Dining & Meals',
    description: 'Having meals and dining-related activities',
    category: 'thematic',
    icon: '🍽️',
    color: 'red',
    verbIds: [
      'n5_verb_0144', // 食事する - have a meal/dine
      'n5_verb_0028', // 食べる - eat
      'n5_verb_0033'  // 飲む - drink
    ]
  },
  {
    id: 'resting-sleeping',
    name: 'Resting & Sleeping',
    description: 'Sleeping, staying, and resting activities',
    category: 'thematic',
    icon: '😴',
    color: 'violet',
    verbIds: [
      'n5_verb_0121'  // 寝る - sleep/go to bed
    ]
  },
  {
    id: 'mixed-general',
    name: 'Mixed & General',
    description: 'Common utility verbs used across various situations',
    category: 'thematic',
    icon: '⚙️',
    color: 'gray',
    verbIds: [
      'n5_verb_0024', // 買う - buy
      'n5_verb_0027', // 掛かる - take/cost (time/money)
      'n5_verb_0044', // 使う - use
      'n5_verb_0052', // 年を取る - grow old
      'n5_verb_0055', // 習う - learn
      'n5_verb_0059', // 飲む - drink
      'n5_verb_0071', // 引く - pull
      'n5_verb_0074', // 待つ - wait
      'n5_verb_0075', // 回す - rotate/spin
      'n5_verb_0109', // 調べる - check/investigate
      'n5_verb_0110', // 捨てる - throw away
      'n5_verb_0111', // 食べる - eat
      'n5_verb_0112', // 足りる - be enough
      'n5_verb_0116'  // できる - be able to/can
    ]
  }
]

/**
 * Grammar-Based Lists
 * - Godan verbs (Group 1)
 * - Ichidan verbs (Group 2)
 * - Irregular verbs (Group 3: する and 来る conjugations)
 */
export const GRAMMAR_LISTS: VerbList[] = [
  {
    id: 'godan',
    name: 'Godan Verbs (Group 1)',
    description: 'U-verbs with consonant-stem conjugation pattern (77 verbs)',
    category: 'grammar',
    icon: '1️⃣',
    color: 'cyan',
    verbIds: [] // Will be populated dynamically from dataset
  },
  {
    id: 'ichidan',
    name: 'Ichidan Verbs (Group 2)',
    description: 'Ru-verbs with vowel-stem conjugation pattern (39 verbs)',
    category: 'grammar',
    icon: '2️⃣',
    color: 'violet',
    verbIds: [] // Will be populated dynamically from dataset
  },
  {
    id: 'irregular',
    name: 'Irregular Verbs (Group 3)',
    description: 'Special conjugation verbs including する and 来る (25 verbs)',
    category: 'grammar',
    icon: '3️⃣',
    color: 'rose',
    verbIds: [] // Will be populated dynamically from dataset
  }
]

/**
 * All predefined lists combined
 */
export const ALL_PREDEFINED_LISTS: VerbList[] = [
  ...DIFFICULTY_LISTS,
  ...THEMATIC_LISTS,
  ...GRAMMAR_LISTS
]

/**
 * Get a specific list by ID
 */
export function getVerbListById(id: string): VerbList | undefined {
  return ALL_PREDEFINED_LISTS.find(list => list.id === id)
}

/**
 * Get all lists in a specific category
 */
export function getVerbListsByCategory(category: VerbList['category']): VerbList[] {
  return ALL_PREDEFINED_LISTS.filter(list => list.category === category)
}
