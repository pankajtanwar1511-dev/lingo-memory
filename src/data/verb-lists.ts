/**
 * Predefined Verb Lists for N5 Learning
 *
 * All IDs and comments verified against N5_verbs_dataset_merged.json.
 *
 * Difficulty is a 4-tier curriculum (not 3), designed for staged cognitive load:
 *
 *   Tier 1 — Core         18 verbs  Cannot survive without these
 *   Tier 2 — Daily Life   31 verbs  Concrete, high-frequency expansion
 *   Tier 3 — Situational  45 verbs  Context-specific, physical, transactional
 *   Tier 4 — Extended     46 verbs  Compounds, する verbs, abstract/nuanced
 *
 * Distribution: 18 → 31 → 45 → 46  (balanced, not a cliff)
 *
 * Thematic lists and grammar lists cover all 135 verbs orthogonally.
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

// ---------------------------------------------------------------------------
// DIFFICULTY LISTS  — 4-Tier Curriculum
// Distribution: 18 → 30 → 45 → 42  (staged, not a cliff)
// ---------------------------------------------------------------------------

export const DIFFICULTY_LISTS: VerbList[] = [
  // -------------------------------------------------------------------------
  // TIER 1 — Core (18 verbs)
  // Criteria: concrete meaning, universal daily use, no grammar prerequisite
  // Cannot hold a single Japanese conversation without these
  // -------------------------------------------------------------------------
  {
    id: 'core',
    name: 'Core — Survival Verbs',
    description: 'The 18 verbs you literally cannot survive without. Start here.',
    category: 'difficulty',
    icon: '🌱',
    color: 'green',
    verbIds: [
      'n5_v_0004',  // ある        - to exist (inanimate things)
      'n5_v_0090',  // いる        - to exist (animate beings)
      'n5_v_0009',  // 行く        - to go
      'n5_v_0130',  // 来る        - to come        ← irregular, but unavoidable
      'n5_v_0026',  // 帰る        - to go home / return
      'n5_v_0111',  // 食べる      - to eat
      'n5_v_0059',  // 飲む        - to drink
      'n5_v_0121',  // 寝る        - to sleep
      'n5_v_0095',  // 起きる      - to get up / wake up
      'n5_v_0126',  // 見る        - to see / watch
      'n5_v_0068',  // 話す        - to speak / talk
      'n5_v_0033',  // 聞く        - to hear / listen / ask
      'n5_v_0083',  // 読む        - to read
      'n5_v_0028',  // 書く        - to write
      'n5_v_0131',  // する        - to do           ← irregular, but core
      'n5_v_0024',  // 買う        - to buy
      'n5_v_0084',  // 分かる      - to understand
      'n5_v_0001',  // 会う        - to meet
    ]
  },

  // -------------------------------------------------------------------------
  // TIER 2 — Daily Life (31 verbs)
  // Criteria: very frequent, concrete actions, single-morpheme verbs
  // Needed to talk about a typical day, work, relationships, feelings
  // -------------------------------------------------------------------------
  {
    id: 'daily-life',
    name: 'Daily Life — Everyday Essentials',
    description: '31 high-frequency verbs for talking about a normal day.',
    category: 'difficulty',
    icon: '🌿',
    color: 'blue',
    verbIds: [
      // Movement basics
      'n5_v_0007',  // 歩く        - to walk
      'n5_v_0117',  // 出る        - to leave / exit
      'n5_v_0063',  // 入る        - to enter
      'n5_v_0045',  // 着く        - to arrive
      'n5_v_0115',  // 出かける    - to go out
      // Talking & interacting
      'n5_v_0008',  // 言う        - to say
      'n5_v_0082',  // 呼ぶ        - to call (a name / person)
      'n5_v_0096',  // 教える      - to teach / tell
      'n5_v_0016',  // 送る        - to send
      'n5_v_0074',  // 待つ        - to wait
      'n5_v_0034',  // 聞く (ask)  - to ask / enquire  ← same kanji as 0033, separate sense
      // Mental / cognitive
      'n5_v_0020',  // 思う        - to think / feel / believe
      'n5_v_0038',  // 知る        - to know / get to know
      'n5_v_0129',  // 忘れる      - to forget
      // Work & study
      'n5_v_0067',  // 働く        - to work
      'n5_v_0080',  // 休む        - to rest / take a day off
      'n5_v_0040',  // 住む        - to live / reside
      'n5_v_0150',  // 勉強する    - to study
      // Making & using
      'n5_v_0046',  // 作る        - to make / cook
      'n5_v_0044',  // 使う        - to use
      'n5_v_0055',  // 習う        - to learn (from a teacher)
      'n5_v_0098',  // 覚える      - to memorize / remember
      // Giving / receiving (N5 grammar triad — taught as a unit)
      'n5_v_0087',  // 上げる      - to give (speaker → other)
      'n5_v_0107',  // くれる      - to give (other → speaker / in-group)
      'n5_v_0078',  // もらう      - to receive
      // Start / end
      'n5_v_0123',  // 始める      - to start / begin (transitive)
      'n5_v_0023',  // 終わる      - to finish / end (intransitive)
      // Common transactions
      'n5_v_0029',  // 貸す        - to lend
      'n5_v_0103',  // 借りる      - to borrow
      'n5_v_0149',  // 電話する    - to phone / call
      // Ability & state
      'n5_v_0116',  // できる      - to be able to / to be done
    ]
  },

  // -------------------------------------------------------------------------
  // TIER 3 — Situational (45 verbs)
  // Criteria: context-specific (transport, clothing, household, body, shopping)
  // Concrete actions but require knowing a specific situation / vocabulary
  // -------------------------------------------------------------------------
  {
    id: 'situational',
    name: 'Situational — Context Verbs',
    description: '45 concrete verbs for transport, home, shopping, body actions and more.',
    category: 'difficulty',
    icon: '🌳',
    color: 'orange',
    verbIds: [
      // Daily routine & home
      'n5_v_0003',  // 洗う        - to wash
      'n5_v_0089',  // 浴びる      - to bathe / shower
      'n5_v_0147',  // 洗濯する    - to do laundry
      'n5_v_0148',  // 掃除する    - to clean (a room)
      'n5_v_0114',  // つける      - to turn on (light / TV)
      'n5_v_0036',  // 消す        - to turn off / erase
      'n5_v_0086',  // 開ける      - to open (door, window — transitive)
      'n5_v_0108',  // 閉める      - to close (transitive)
      // Clothing (needs vocab for garment types)
      'n5_v_0105',  // 着る        - to wear (upper body)
      'n5_v_0066',  // 履く        - to put on (shoes / pants / socks)
      'n5_v_0031',  // 被る        - to put on (hat / hood)
      'n5_v_0057',  // 脱ぐ        - to take off (any clothing)
      'n5_v_0101',  // かける      - to put on (glasses) / hang / lock
      // Transportation (needs transport vocab)
      'n5_v_0062',  // 乗る        - to ride / board (vehicle)
      'n5_v_0099',  // 降りる      - to get off (vehicle)
      'n5_v_0122',  // 乗り換える  - to transfer (train / bus)
      'n5_v_0133',  // 運転する    - to drive
      'n5_v_0073',  // 曲がる      - to turn (direction: left / right)
      'n5_v_0085',  // 渡る        - to cross (road / bridge)
      'n5_v_0058',  // 登る        - to climb (stairs / mountain)
      // Shopping & money
      'n5_v_0069',  // 払う        - to pay
      'n5_v_0014',  // 売る        - to sell
      'n5_v_0025',  // 返す        - to give back / return (an item)
      'n5_v_0022',  // 下ろす      - to withdraw (money from ATM)
      'n5_v_0027',  // 掛かる      - to take / cost (time or money)
      'n5_v_0134',  // 買い物する  - to go shopping
      'n5_v_0151',  // 予約する    - to reserve / book
      // Body & physical actions
      'n5_v_0043',  // 立つ        - to stand up
      'n5_v_0041',  // 座る        - to sit down
      'n5_v_0076',  // 持つ        - to hold / carry / have
      'n5_v_0018',  // 押す        - to push / press
      'n5_v_0071',  // 引く        - to pull
      'n5_v_0037',  // 触る        - to touch
      'n5_v_0035',  // 切る        - to cut / slice
      'n5_v_0050',  // 取る        - to take / pick up / get
      'n5_v_0042',  // 出す        - to take out / hand in / submit
      'n5_v_0015',  // 置く        - to put / place / leave
      'n5_v_0093',  // 入れる      - to put in / insert
      'n5_v_0110',  // 捨てる      - to throw away / discard
      // Communication (situational — needs social context)
      'n5_v_0125',  // 見せる      - to show
      'n5_v_0048',  // 手伝う      - to help / assist
      'n5_v_0032',  // 頑張る      - to do one's best / hang in there
      // Common states & changes
      'n5_v_0056',  // なる        - to become / turn into
      'n5_v_0113',  // 疲れる      - to get tired
      'n5_v_0120',  // 止める      - to stop (transitive: car, timer)
    ]
  },

  // -------------------------------------------------------------------------
  // TIER 4 — Extended (46 verbs)
  // Criteria: compound verbs, most する-compounds, abstract/nuanced meanings,
  // lower frequency, or require advanced grammatical context
  // -------------------------------------------------------------------------
  {
    id: 'extended',
    name: 'Extended — Complete N5 Coverage',
    description: '46 verbs completing full N5: compounds, する verbs, and nuanced actions.',
    category: 'difficulty',
    icon: '🌲',
    color: 'purple',
    verbIds: [
      // Nuanced / less frequent single verbs
      'n5_v_0002',  // 遊ぶ        - to play / enjoy oneself
      'n5_v_0010',  // 急ぐ        - to hurry
      'n5_v_0011',  // 要る        - to need / require  (が-object structure)
      'n5_v_0012',  // 動く        - to move / work (of a machine)
      'n5_v_0013',  // 歌う        - to sing
      'n5_v_0019',  // 思い出す    - to remember / recollect  (compound godan)
      'n5_v_0021',  // 泳ぐ        - to swim
      'n5_v_0030',  // 勝つ        - to win
      'n5_v_0039',  // 吸う        - to breathe in / inhale (smoke)
      'n5_v_0049',  // 泊まる      - to stay overnight
      'n5_v_0051',  // 撮る        - to take (a photo) ← homophones 取る vs 撮る
      'n5_v_0053',  // 直す        - to repair / correct / fix
      'n5_v_0054',  // 無くす      - to lose (an object)
      'n5_v_0070',  // 弾く        - to play (instrument) ← homophones 引く vs 弾く
      'n5_v_0072',  // 降る        - to fall (rain / snow — weather only)
      'n5_v_0075',  // 回す        - to turn / rotate / pass around
      'n5_v_0088',  // 集める      - to collect / gather
      'n5_v_0094',  // 生まれる    - to be born
      'n5_v_0100',  // 変える      - to change (something)
      'n5_v_0104',  // 考える      - to think / consider  (deeper than 思う)
      'n5_v_0109',  // 調べる      - to investigate / look up / research
      'n5_v_0112',  // 足りる      - to be enough / sufficient
      'n5_v_0124',  // 負ける      - to lose (a competition)
      'n5_v_0127',  // 迎える      - to welcome / go to pick up
      'n5_v_0128',  // 辞める      - to quit / resign
      // Compound verbs (require understanding of 〜て + movement verb)
      'n5_v_0077',  // 持って行く  - to take (something) along
      'n5_v_0154',  // 持って来る  - to bring (something)
      'n5_v_0047',  // 連れて行く  - to take (someone) somewhere
      'n5_v_0153',  // 連れて来る  - to bring (someone)
      'n5_v_0079',  // 役に立つ    - to be useful  (fixed expression)
      'n5_v_0052',  // 年を取る    - to grow old   (fixed expression)
      'n5_v_0106',  // 気をつける  - to be careful (fixed expression)
      // する-compound verbs (need noun → する pattern knowledge)
      'n5_v_0139',  // 散歩する    - to take a walk
      'n5_v_0144',  // 食事する    - to have a meal  (more formal than 食べる)
      'n5_v_0135',  // 結婚する    - to marry
      'n5_v_0145',  // 心配する    - to worry
      'n5_v_0143',  // 紹介する    - to introduce
      'n5_v_0146',  // 説明する    - to explain
      'n5_v_0132',  // 案内する    - to guide
      'n5_v_0136',  // 見学する    - to tour / go on a field trip
      'n5_v_0137',  // 研究する    - to research / study a subject
      'n5_v_0138',  // コピーする  - to copy / photocopy
      'n5_v_0140',  // 残業する    - to work overtime
      'n5_v_0141',  // 修理する    - to repair (formal / professional)
      'n5_v_0142',  // 出張する    - to go on a business trip
      'n5_v_0152',  // 留学する    - to study abroad
    ]
  }
]

// ---------------------------------------------------------------------------
// THEMATIC LISTS
// ---------------------------------------------------------------------------

export const THEMATIC_LISTS: VerbList[] = [
  {
    id: 'existence-state',
    name: 'Existence & State',
    description: 'Being, existing, and becoming — the most foundational verbs',
    category: 'thematic',
    icon: '🫧',
    color: 'indigo',
    verbIds: [
      'n5_v_0004',  // ある        - to exist (inanimate)
      'n5_v_0090',  // いる        - to exist (animate)
      'n5_v_0056',  // なる        - to become
      'n5_v_0116',  // できる      - to be able to / be done
      'n5_v_0112',  // 足りる      - to be enough
      'n5_v_0079',  // 役に立つ    - to be useful
      'n5_v_0094',  // 生まれる    - to be born
    ]
  },
  {
    id: 'movement-travel',
    name: 'Movement & Travel',
    description: 'Going, coming, arriving, and getting around',
    category: 'thematic',
    icon: '🚶',
    color: 'teal',
    verbIds: [
      'n5_v_0009',  // 行く        - to go
      'n5_v_0130',  // 来る        - to come
      'n5_v_0026',  // 帰る        - to go home
      'n5_v_0007',  // 歩く        - to walk
      'n5_v_0045',  // 着く        - to arrive
      'n5_v_0117',  // 出る        - to leave / exit
      'n5_v_0063',  // 入る        - to enter
      'n5_v_0115',  // 出かける    - to go out
      'n5_v_0058',  // 登る        - to climb
      'n5_v_0085',  // 渡る        - to cross
      'n5_v_0073',  // 曲がる      - to turn (direction)
      'n5_v_0021',  // 泳ぐ        - to swim
      'n5_v_0010',  // 急ぐ        - to hurry
    ]
  },
  {
    id: 'transportation',
    name: 'Transportation',
    description: 'Riding, driving, and transferring between transport',
    category: 'thematic',
    icon: '🚌',
    color: 'cyan',
    verbIds: [
      'n5_v_0062',  // 乗る        - to ride (vehicle)
      'n5_v_0099',  // 降りる      - to get off (vehicle)
      'n5_v_0122',  // 乗り換える  - to transfer (train)
      'n5_v_0133',  // 運転する    - to drive
      'n5_v_0047',  // 連れて行く  - to take (someone) somewhere
      'n5_v_0153',  // 連れて来る  - to bring (someone)
    ]
  },
  {
    id: 'food-drink',
    name: 'Food & Drink',
    description: 'Eating, drinking, and meal-related actions',
    category: 'thematic',
    icon: '🍱',
    color: 'orange',
    verbIds: [
      'n5_v_0111',  // 食べる      - to eat
      'n5_v_0059',  // 飲む        - to drink
      'n5_v_0039',  // 吸う        - to inhale / breathe in (smoke)
      'n5_v_0144',  // 食事する    - to have a meal
    ]
  },
  {
    id: 'daily-routine',
    name: 'Daily Routine',
    description: 'Sleeping, waking, washing and everyday household tasks',
    category: 'thematic',
    icon: '🏠',
    color: 'green',
    verbIds: [
      'n5_v_0121',  // 寝る        - to sleep
      'n5_v_0095',  // 起きる      - to get up
      'n5_v_0003',  // 洗う        - to wash
      'n5_v_0147',  // 洗濯する    - to do laundry
      'n5_v_0148',  // 掃除する    - to clean (a room)
      'n5_v_0080',  // 休む        - to rest
      'n5_v_0089',  // 浴びる      - to bathe / shower
      'n5_v_0139',  // 散歩する    - to take a walk
    ]
  },
  {
    id: 'getting-dressed',
    name: 'Getting Dressed',
    description: 'Wearing and taking off clothing and accessories',
    category: 'thematic',
    icon: '👔',
    color: 'pink',
    verbIds: [
      'n5_v_0105',  // 着る        - to wear (upper body)
      'n5_v_0066',  // 履く        - to put on (shoes / pants)
      'n5_v_0031',  // 被る        - to put on (hat)
      'n5_v_0101',  // かける      - to put on (glasses)
      'n5_v_0057',  // 脱ぐ        - to take off (any clothing)
    ]
  },
  {
    id: 'communication',
    name: 'Communication & Social',
    description: 'Speaking, listening, reading, writing and meeting people',
    category: 'thematic',
    icon: '💬',
    color: 'blue',
    verbIds: [
      'n5_v_0068',  // 話す        - to speak
      'n5_v_0008',  // 言う        - to say
      'n5_v_0033',  // 聞く        - to hear / listen
      'n5_v_0083',  // 読む        - to read
      'n5_v_0028',  // 書く        - to write
      'n5_v_0001',  // 会う        - to meet
      'n5_v_0082',  // 呼ぶ        - to call (a name)
      'n5_v_0096',  // 教える      - to teach / tell
      'n5_v_0125',  // 見せる      - to show
      'n5_v_0016',  // 送る        - to send
      'n5_v_0149',  // 電話する    - to phone
      'n5_v_0143',  // 紹介する    - to introduce
      'n5_v_0146',  // 説明する    - to explain
    ]
  },
  {
    id: 'thinking-knowing',
    name: 'Thinking & Knowing',
    description: 'Mental verbs — understanding, thinking, and remembering',
    category: 'thematic',
    icon: '🧠',
    color: 'violet',
    verbIds: [
      'n5_v_0084',  // 分かる      - to understand
      'n5_v_0038',  // 知る        - to get to know
      'n5_v_0020',  // 思う        - to think (feel/believe)
      'n5_v_0104',  // 考える      - to think / consider
      'n5_v_0019',  // 思い出す    - to remember / recollect
      'n5_v_0129',  // 忘れる      - to forget
    ]
  },
  {
    id: 'work-study',
    name: 'Work & Study',
    description: 'Professional and academic activities',
    category: 'thematic',
    icon: '📚',
    color: 'indigo',
    verbIds: [
      'n5_v_0067',  // 働く        - to work
      'n5_v_0150',  // 勉強する    - to study
      'n5_v_0055',  // 習う        - to learn (from a teacher)
      'n5_v_0098',  // 覚える      - to memorize
      'n5_v_0109',  // 調べる      - to investigate / look up
      'n5_v_0137',  // 研究する    - to research
      'n5_v_0140',  // 残業する    - to work overtime
      'n5_v_0142',  // 出張する    - to go on a business trip
      'n5_v_0152',  // 留学する    - to study abroad
      'n5_v_0136',  // 見学する    - to tour / go on a field trip
      'n5_v_0128',  // 辞める      - to quit / resign
      'n5_v_0032',  // 頑張る      - to do one's best
    ]
  },
  {
    id: 'shopping-money',
    name: 'Shopping & Money',
    description: 'Buying, selling, paying, and lending',
    category: 'thematic',
    icon: '🛒',
    color: 'cyan',
    verbIds: [
      'n5_v_0024',  // 買う        - to buy
      'n5_v_0134',  // 買い物する  - to go shopping
      'n5_v_0014',  // 売る        - to sell
      'n5_v_0069',  // 払う        - to pay
      'n5_v_0029',  // 貸す        - to lend
      'n5_v_0103',  // 借りる      - to borrow
      'n5_v_0025',  // 返す        - to give back / return
      'n5_v_0027',  // 掛かる      - to take / cost (time or money)
      'n5_v_0022',  // 下ろす      - to withdraw (money)
      'n5_v_0151',  // 予約する    - to reserve / book
    ]
  },
  {
    id: 'giving-receiving',
    name: 'Giving & Receiving',
    description: 'The three Japanese giving/receiving verbs — a key N5 grammar topic',
    category: 'thematic',
    icon: '🎁',
    color: 'rose',
    verbIds: [
      'n5_v_0087',  // 上げる      - to give (speaker→other)
      'n5_v_0107',  // くれる      - to give (other→speaker/in-group)
      'n5_v_0078',  // もらう      - to receive
    ]
  },
  {
    id: 'body-posture',
    name: 'Body & Posture',
    description: 'Physical actions and posture changes',
    category: 'thematic',
    icon: '🧘',
    color: 'green',
    verbIds: [
      'n5_v_0043',  // 立つ        - to stand up
      'n5_v_0041',  // 座る        - to sit down
      'n5_v_0076',  // 持つ        - to hold / have
      'n5_v_0037',  // 触る        - to touch
      'n5_v_0018',  // 押す        - to push / press
      'n5_v_0071',  // 引く        - to pull
      'n5_v_0113',  // 疲れる      - to get tired
      'n5_v_0106',  // 気をつける  - to be careful
    ]
  },
  {
    id: 'carrying-bringing',
    name: 'Carrying & Bringing',
    description: 'Taking, bringing, and transporting things and people',
    category: 'thematic',
    icon: '🎒',
    color: 'orange',
    verbIds: [
      'n5_v_0076',  // 持つ        - to hold / carry
      'n5_v_0077',  // 持って行く  - to take (something) along
      'n5_v_0154',  // 持って来る  - to bring (something)
      'n5_v_0047',  // 連れて行く  - to take (someone) somewhere
      'n5_v_0153',  // 連れて来る  - to bring (someone)
      'n5_v_0016',  // 送る        - to send / escort
    ]
  },
  {
    id: 'putting-placing',
    name: 'Putting & Placing',
    description: 'Organizing, positioning, and moving objects',
    category: 'thematic',
    icon: '📦',
    color: 'blue',
    verbIds: [
      'n5_v_0015',  // 置く        - to put / place
      'n5_v_0042',  // 出す        - to take out / hand in
      'n5_v_0093',  // 入れる      - to put in
      'n5_v_0050',  // 取る        - to take / pick up
      'n5_v_0110',  // 捨てる      - to throw away
      'n5_v_0088',  // 集める      - to collect / gather
    ]
  },
  {
    id: 'opening-closing',
    name: 'Opening & Closing',
    description: 'Switches, doors, and appliances — on/off and open/close pairs',
    category: 'thematic',
    icon: '🚪',
    color: 'teal',
    verbIds: [
      'n5_v_0086',  // 開ける      - to open (transitive)
      'n5_v_0108',  // 閉める      - to close (transitive)
      'n5_v_0114',  // つける      - to turn on (light/TV)
      'n5_v_0036',  // 消す        - to turn off / erase
    ]
  },
  {
    id: 'making-repairing',
    name: 'Making & Repairing',
    description: 'Creating, fixing, and cutting',
    category: 'thematic',
    icon: '🔨',
    color: 'red',
    verbIds: [
      'n5_v_0046',  // 作る        - to make
      'n5_v_0053',  // 直す        - to repair / correct
      'n5_v_0141',  // 修理する    - to repair (formal)
      'n5_v_0035',  // 切る        - to cut
      'n5_v_0075',  // 回す        - to turn / rotate
      'n5_v_0138',  // コピーする  - to copy
    ]
  },
  {
    id: 'recreation-hobbies',
    name: 'Recreation & Hobbies',
    description: 'Sports, arts, and leisure activities',
    category: 'thematic',
    icon: '⚽',
    color: 'green',
    verbIds: [
      'n5_v_0002',  // 遊ぶ        - to play / enjoy oneself
      'n5_v_0021',  // 泳ぐ        - to swim
      'n5_v_0013',  // 歌う        - to sing
      'n5_v_0070',  // 弾く        - to play (instrument)
      'n5_v_0030',  // 勝つ        - to win
      'n5_v_0124',  // 負ける      - to lose
      'n5_v_0051',  // 撮る        - to take (a photo)
      'n5_v_0139',  // 散歩する    - to take a walk
    ]
  },
  {
    id: 'weather-nature',
    name: 'Weather & Nature',
    description: 'Natural phenomena and weather events',
    category: 'thematic',
    icon: '🌤️',
    color: 'violet',
    verbIds: [
      'n5_v_0072',  // 降る        - to fall (rain / snow)
    ]
  },
  {
    id: 'emotions-attitude',
    name: 'Emotions & Attitude',
    description: 'Feelings, effort, worry, and concern',
    category: 'thematic',
    icon: '💭',
    color: 'purple',
    verbIds: [
      'n5_v_0145',  // 心配する    - to worry
      'n5_v_0032',  // 頑張る      - to do one's best
      'n5_v_0079',  // 役に立つ    - to be useful
      'n5_v_0106',  // 気をつける  - to be careful
      'n5_v_0113',  // 疲れる      - to get tired
    ]
  },
  {
    id: 'life-events',
    name: 'Life Events',
    description: 'Milestones in life — birth, marriage, ageing, and travel abroad',
    category: 'thematic',
    icon: '🎉',
    color: 'pink',
    verbIds: [
      'n5_v_0094',  // 生まれる    - to be born
      'n5_v_0135',  // 結婚する    - to marry
      'n5_v_0052',  // 年を取る    - to grow old
      'n5_v_0152',  // 留学する    - to study abroad
      'n5_v_0054',  // 無くす      - to lose (something)
      'n5_v_0128',  // 辞める      - to quit / resign
    ]
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Service',
    description: 'Welcoming, guiding, introducing, and showing around',
    category: 'thematic',
    icon: '🤝',
    color: 'rose',
    verbIds: [
      'n5_v_0001',  // 会う        - to meet
      'n5_v_0127',  // 迎える      - to welcome / go to meet
      'n5_v_0143',  // 紹介する    - to introduce
      'n5_v_0132',  // 案内する    - to guide
      'n5_v_0136',  // 見学する    - to tour / visit a place
      'n5_v_0049',  // 泊まる      - to stay (overnight)
    ]
  },
  {
    id: 'start-end',
    name: 'Starting & Ending',
    description: 'Beginning, finishing, and stopping',
    category: 'thematic',
    icon: '🔄',
    color: 'indigo',
    verbIds: [
      'n5_v_0123',  // 始める      - to start (transitive)
      'n5_v_0023',  // 終わる      - to finish (intransitive)
      'n5_v_0120',  // 止める      - to stop (transitive)
    ]
  },
  {
    id: 'change-transition',
    name: 'Change & Transition',
    description: 'Changing, becoming, and switching',
    category: 'thematic',
    icon: '♻️',
    color: 'teal',
    verbIds: [
      'n5_v_0056',  // なる        - to become
      'n5_v_0100',  // 変える      - to change (something)
      'n5_v_0122',  // 乗り換える  - to transfer (train)
    ]
  },
]

// ---------------------------------------------------------------------------
// GRAMMAR LISTS
// ---------------------------------------------------------------------------

export const GRAMMAR_LISTS: VerbList[] = [
  {
    id: 'godan',
    name: 'Group I — Godan Verbs (U-verbs)',
    description: 'Consonant-stem verbs — 85 verbs with -u endings (行く, 書く, 飲む…)',
    category: 'grammar',
    icon: '1️⃣',
    color: 'blue',
    verbIds: [] // Populated dynamically from dataset (morphology.class === 'godan')
  },
  {
    id: 'ichidan',
    name: 'Group II — Ichidan Verbs (Ru-verbs)',
    description: 'Vowel-stem verbs — 44 verbs ending in -る (食べる, 見る, 起きる…)',
    category: 'grammar',
    icon: '2️⃣',
    color: 'violet',
    verbIds: [] // Populated dynamically from dataset (morphology.class === 'ichidan')
  },
  {
    id: 'irregular',
    name: 'Group III — Irregular Verbs',
    description: 'する、来る and all する-compound verbs (25 entries)',
    category: 'grammar',
    icon: '3️⃣',
    color: 'rose',
    verbIds: [] // Populated dynamically from dataset (morphology.class === 'irregular')
  },
  {
    id: 'transitive',
    name: 'Transitive Verbs',
    description: 'Verbs that take a direct object (〜を + verb)',
    category: 'grammar',
    icon: '➡️',
    color: 'orange',
    verbIds: [] // Populated dynamically (valency.type === 'transitive')
  },
  {
    id: 'intransitive',
    name: 'Intransitive Verbs',
    description: 'Verbs with no direct object — subject performs action on itself',
    category: 'grammar',
    icon: '🔵',
    color: 'green',
    verbIds: [] // Populated dynamically (valency.type === 'intransitive')
  }
]

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

export const ALL_PREDEFINED_LISTS: VerbList[] = [
  ...DIFFICULTY_LISTS,
  ...THEMATIC_LISTS,
  ...GRAMMAR_LISTS
]

export function getVerbListById(id: string): VerbList | undefined {
  return ALL_PREDEFINED_LISTS.find(list => list.id === id)
}

export function getVerbListsByCategory(category: VerbList['category']): VerbList[] {
  return ALL_PREDEFINED_LISTS.filter(list => list.category === category)
}
