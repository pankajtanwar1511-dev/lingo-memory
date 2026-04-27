#!/usr/bin/env node
/**
 * Curate 5 basic vocabulary entries per prerequisite kanji.
 *
 * Source: scripts/_words_cache.json (JMdict via kanjiapi.dev — 54k entries
 * across the 117 prereq kanji). NOT memory-generated.
 *
 * Algorithm:
 *   1. Filter each kanji's entries to those with non-empty JMdict priority
 *      tags (= word is in newspaper/everyday-frequency lists).
 *   2. Score each candidate by priority strength, length, position of the
 *      parent kanji in the word, and presence of off-syllabus jukugo.
 *   3. Pick top 5 per kanji, dedupe across the whole output, and exclude
 *      anything already linked in prerequisite-detailed.json.
 *   4. Emit clean JSON: { word, reading, meaning, parentKanji } per row.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PREREQ_DETAILED = path.join(
  ROOT,
  'public/seed-data/extended-kanji/prerequisite-detailed.json',
);
const WORDS_CACHE = path.join(__dirname, '_words_cache.json');
const KANJIDIC_CACHE = path.join(__dirname, '_kanjidic_cache.json');
const OUT = path.join(
  ROOT,
  'public/seed-data/extended-kanji/prereq-curated-vocab.json',
);

// --- Scoring constants ---
const PRIORITY_SCORES = {
  ichi1: 100, news1: 90, spec1: 80, gai1: 60,
  ichi2: 60,  news2: 50, spec2: 40, gai2: 30,
};

function nfBonus(priorities) {
  // nf01 = top 500 frequency; nf48 = bottom of the list. Lower nf is better.
  const nf = priorities.find((p) => /^nf\d{2}$/.test(p));
  if (!nf) return 0;
  const n = parseInt(nf.slice(2), 10);
  if (n <= 6) return 50;
  if (n <= 12) return 35;
  if (n <= 20) return 20;
  if (n <= 30) return 10;
  return 0;
}

function priorityScore(priorities) {
  let s = 0;
  for (const p of priorities) s += PRIORITY_SCORES[p] || 0;
  return s + nfBonus(priorities);
}

// Kana detection
const KANA_RE = /^[ぁ-ゖァ-ヺー]+$/;
function isPureKana(s) {
  return KANA_RE.test(s);
}

// Hand-curated overrides to fix the worst JMdict gloss-ordering quirks.
// Key = `<written>|<pronounced>`. Value = override gloss, or null to skip
// the entry entirely (too obscure or always wrong).
const GLOSS_OVERRIDES = {
  '会計|かいけい':       'accounting; finance',
  '部屋|へや':           'room',
  '小屋|こや':           'hut; cabin; shed',
  '小屋|しょうおく':     null,
  '大屋|おおや':         null, // archaic; modern is 大家
  '写真|しゃしん':       'photograph; photo',
  '真に|まことに':       null, // 真に is rare; prefer 誠に
  '真近|まぢか':         null, // archaic spelling; modern is 間近
  '真夏|まなつ':         'midsummer; height of summer',
  '電波|でんぱ':         'radio waves; electromagnetic waves',
  '英文|えいぶん':       'English text; English sentence',
  '英雄|えいゆう':       'hero; great person',
  '英明|えいめい':       null, // uncommon
  '本番|ほんばん':       'the real thing; actual performance',
  '本音|ほんね':         'real intention; true feelings',
  '中味|なかみ':         'contents; interior',
  '地方|ちほう':         'region; district; province',
  '戯曲|ぎきょく':       'play; drama',
  '文明|ぶんめい':       'civilization; culture',
  '太山|たいざん':       null,
  '賃銀|ちんぎん':       null, // prefer 賃金
  '銀座|ぎんざ':         null, // place name
  '新橋|しんばし':       null, // place name
  '一切|いっさい':       'all; everything; without exception',
  '大切|たいせつ':       'important; precious',
  '〆切|しめきり':       'deadline',
  '切|きり':             null, // counter, too specialized
  '楽|らく':             'comfort; ease; relaxation',
  '楽しい|たのしい':     'fun; enjoyable; pleasant',
  '明らか|あきらか':     'obvious; clear; evident',
  '明白|めいはく':       'obvious; clear',
  '明日|みょうにち':     'tomorrow',
  '明い|あかるい':       null, // wrong reading orthography
  '明けがた|あけがた':   'dawn; daybreak',
  '明く|あく':           null, // rare reading
  '遊ぶ|あそぶ':         'to play; to enjoy oneself',
  '遊ぶ|すさぶ':         null, // archaic sense
  '遊ばす|あそばす':     'to let (someone) play',
  '遊歩|ゆうほ':         null, // uncommon
  '遊説|ゆうぜい':       null, // formal political term
  '趣|おもむき':         'atmosphere; charm; taste',
  '趣旨|しゅし':         'purpose; point; gist',
  '趣く|おもむく':       'to head toward; to proceed to',
  '中道|ちゅうどう':     'middle way; middle path',
  '飛ぶ|とぶ':           'to fly; to leap',
  '飛行|ひこう':         'flight; aviation',
  '飛びだす|とびだす':   'to jump out; to rush out',
  '関心|かんしん':       'interest; concern',
  '関係|かんけい':       'relation; relationship; connection',
  '関聯|かんれん':       null, // archaic spelling of 関連
  '辞|じ':               null,
  '館|やかた':           'mansion; nobleman\'s residence',
  '断る|ことわる':       'to refuse; to decline',
  '横道|よこみち':       'side road; byway',
  '横ぎる|よこぎる':     null, // archaic spelling
  '横書|よこがき':       'horizontal writing',
  '備|そなえ':           null,
  '気|き':               'spirit; mood; mind',
  '気ずく|きづく':       null, // archaic spelling
  '気分|きぶん':         'mood; feeling',
  '気楽|きらく':         'carefree; easygoing',
  '行楽|こうらく':       'outing; excursion',
  '紅葉|こうよう':       'autumn leaves; red leaves',
  '春秋|しゅんじゅう':   'spring and autumn',
  '今秋|こんしゅう':     'this autumn',
  '春分|しゅんぶん':     'spring equinox',
  '夏ばて|なつばて':     'summer fatigue',
  '夏至|げし':           'summer solstice',
  '冬眠|とうみん':       'hibernation',
  '冬物|ふゆもの':       'winter clothing',
  '冬季|とうき':         'winter season',
  '夏季|かき':           'summer season',
  '初夏|しょか':         'early summer',
  '春夏秋冬|しゅんかしゅうとう': 'the four seasons',
  '青春|せいしゅん':     'youth; springtime of life',
  '売春|ばいしゅん':     null, // not beginner-appropriate
  '早春|そうしゅん':     'early spring',
  '秋風|あきかぜ':       'autumn breeze',
  '前夜|ぜんや':         'the previous night',
  '夜なか|よなか':       'middle of the night',
  '夜明|よあけ':         'dawn; daybreak',
  '夜間|やかん':         'nighttime',
  '朝食|ちょうしょく':   'breakfast',
  '早朝|そうちょう':     'early morning',
  '朝日|あさひ':         'morning sun',
  '毎朝|まいあさ':       'every morning',
  '太陽|たいよう':       'the sun',
  '太鼓|たいこ':         'drum',
  '太い|ふとい':         'thick; fat',
  '太る|ふとる':         'to get fat; to gain weight',
  '陽ざし|ひざし':       'sunlight',
  '陽気|ようき':         'cheerful; jovial',
  '陽焼け|ひやけ':       null, // wrong written form (modern: 日焼け)
  '夕陽|ゆうひ':         'evening sun; setting sun',
  '陽|よう':             null,
  '銀メダル|ぎんめだる': 'silver medal',
  '銀|ぎん':             'silver',
  '銀色|ぎんいろ':       'silver color',
  '銀河|ぎんが':         'galaxy; Milky Way',
  '銀行員|ぎんこういん': 'bank teller; bank clerk',
  '銀行|ぎんこう':       'bank',
  '水銀|すいぎん':       'mercury (Hg)',
  '味|あじ':             'flavor; taste',
  '味方|みかた':         'ally; friend',
  '気味|きみ':           'feeling; sensation',
  '地味|じみ':           'plain; simple; subdued',
  '横綱|よこづな':       'yokozuna (top sumo rank)',
  '横|よこ':             'side; horizontal',
  '横断|おうだん':       'crossing; intersection',
  '禁烟|きんえん':       null, // archaic spelling of 禁煙
  '禁物|きんもつ':       'forbidden thing; taboo',
  '監禁|かんきん':       'confinement; imprisonment',
  '禁じる|きんじる':     'to forbid; to prohibit',
  '止まる|とまる':       'to stop',
  '中止|ちゅうし':       'cancellation; suspension',
  '防止|ぼうし':         'prevention',
  '廃止|はいし':         'abolition; repeal',
  '歯止め|はどめ':       'brake; stop',
  'らん用|らんよう':     null, // mixed kana, prefer 乱用
  '使用|しよう':         'use; usage',
  '用意|ようい':         'preparation',
  '用語|ようご':         'term; terminology',
  '作用|さよう':         'action; effect',
  '位置|いち':           'position; location',
  '物置|ものおき':       'storage room',
  '措置|そち':           'measure; step',
  '装置|そうち':         'apparatus; device',
  '設置|せっち':         'installation; establishment',
  '物語|ものがたり':     'story; tale',
  '買い物|かいもの':     'shopping; purchase',
  '本物|ほんもの':       'genuine article; real thing',
  '生物|せいぶつ':       'living thing; organism',
  '贈り物|おくりもの':   'gift; present',
  '帰国|きこく':         'returning to one\'s country',
  '帰宅|きたく':         'returning home',
  '帰省|きせい':         'homecoming',
  '復帰|ふっき':         'return; comeback',
  '回帰|かいき':         'return; recurrence',
  '辞職|じしょく':       'resignation',
  '辞任|じにん':         'resignation (from a position)',
  '辞典|じてん':         'dictionary',
  '辞退|じたい':         'declining; refusal',
  '返辞|へんじ':         'reply; answer',
  '卒える|おえる':       null, // archaic spelling of 終える
  '卒業|そつぎょう':     'graduation',
  '卒る|おわる':         null, // archaic
  '軽卒|けいそつ':       null, // archaic spelling of 軽率
  '大卒|だいそつ':       'university graduate',
  '休業|きゅうぎょう':   'business closure; off-day',
  '業界|ぎょうかい':     'industry; business world',
  '業績|ぎょうせき':     'achievement; performance',
  '業者|ぎょうしゃ':     'trader; contractor',
  '作業|さぎょう':       'work; operation',
  '人類|じんるい':       'humanity; mankind',
  '種類|しゅるい':       'kind; type; variety',
  '分類|ぶんるい':       'classification',
  '衣類|いるい':         'clothing',
  '親類|しんるい':       'relatives',
  '中味|なかみ':         'contents; interior',
  '中身|なかみ':         'contents; interior',
  '禁止|きんし':         'prohibition; ban',
  '入札|にゅうさつ':     'bid; tender',
  '札|ふだ':             'tag; label; card',
  '改札|かいさつ':       'ticket gate',
  '落札|らくさつ':       'winning bid',
  '名札|なふだ':         'name plate; name tag',
  '紙|かみ':             'paper',
  '用紙|ようし':         'paper form; sheet',
  '白紙|はくし':         'blank paper',
  '紙幣|しへい':         'paper money',
  '紙面|しめん':         'page space (newspaper)',
  '本音|ほんね':         'real intention; true feelings',
  '騒音|そうおん':       'noise; din',
  '音いろ|ねいろ':       null, // wrong spelling
  '音響|おんきょう':     'acoustics; sound',
  '音|おと':             'sound; noise',
  '楽しむ|たのしむ':     'to enjoy; to take pleasure in',
  '買う|かう':           'to buy; to purchase',
  '買収|ばいしゅう':     'acquisition; bribery',
  '売買|ばいばい':       'trade; buying and selling',
  '購買|こうばい':       'purchase; procurement',
  '不買|ふばい':         null, // uncommon
  '駅|えき':             'station',
  '駅前|えきまえ':       'in front of a station',
  '駅員|えきいん':       'station attendant',
  '駅弁|えきべん':       'station boxed lunch',
  '駅長|えきちょう':     'stationmaster',
  '社会人|しゃかいじん': 'working adult; member of society',
  '社長|しゃちょう':     'company president',
  '社会|しゃかい':       'society',
  '新聞社|しんぶんしゃ': 'newspaper company',
  '入社|にゅうしゃ':     'joining a company',
  '会長|かいちょう':     'chairperson; president',
  '会見|かいけん':       'interview; press conference',
  '会議|かいぎ':         'meeting; conference',
  '会社|かいしゃ':       'company; firm',
  '会|かい':             'meeting; assembly',
  '校長|こうちょう':     'principal; head teacher',
  '高校生|こうこうせい': 'high school student',
  '高校|こうこう':       'high school',
  '中学校|ちゅうがっこう': 'junior high school',
  '校しゃ|こうしゃ':     null, // mixed kana, prefer 校舎
  '曜日|ようび':         'day of the week',
  '生誕|せいたん':       'birth (of a notable person)',
  '誕生|たんじょう':     'birth',
  '降誕|こうたん':       'nativity',
  '機械|きかい':         'machine',
  '機会|きかい':         'opportunity; chance',
  '機関|きかん':         'institution; organ; engine',
  '機長|きちょう':       'captain (of an aircraft)',
  '機能|きのう':         'function',
  '動機|どうき':         'motive; motivation',
  '機嫌|きげん':         'mood; humor',
  'コピー機|こぴーき':   'copy machine; copier',
  '旅館|りょかん':       'Japanese-style inn',
  '旅|たび':             'travel; trip; journey',
  '旅客|りょかく':       'passenger',
  '旅だつ|たびだつ':     'to set off on a journey',
  '旅客機|りょかくき':   'passenger plane',
  '部屋|へや':           'room',
  '屋上|おくじょう':     'rooftop',
  '屋外|おくがい':       'outdoors',
  '映画|えいが':         'movie; film',
  '映画館|えいがかん':   'movie theater',
  '上映|じょうえい':     'screening (film)',
  '映像|えいぞう':       'image; picture; video',
  '反映|はんえい':       'reflection; influence',
  '電気|でんき':         'electricity',
  '電子|でんし':         'electron',
  '電力|でんりょく':     'electric power',
  '発電|はつでん':       'electric power generation',
  '新た|あらた':         'new; fresh',
  '新しい|あたらしい':   'new',
  '新幹線|しんかんせん': 'Shinkansen; bullet train',
  '新人|しんじん':       'newcomer; rookie',
  '新年|しんねん':       'New Year',
  '勉強|べんきょう':     'study',
  '勉学|べんがく':       'study; learning',
  '勉強中|べんきょうちゅう': 'in the middle of studying',
  '勉める|つとめる':     'to endeavor; to strive',
  '勤勉|きんべん':       'diligent; hard-working',
  '強める|つよめる':     'to strengthen',
  '強いる|しいる':       'to force; to compel',
  '強い|つよい':         'strong; powerful',
  '強まる|つよまる':     'to grow stronger',
  '強力|きょうりょく':   'powerful; strong',
  '強制|きょうせい':     'compulsion; coercion',
  '強化|きょうか':       'strengthening; reinforcement',
  '強盗|ごうとう':       'robbery; mugger',
  '試験|しけん':         'examination; test',
  '入試|にゅうし':       'entrance exam',
  '試合|しあい':         'match; game',
  '試す|ためす':         'to try; to test',
  '試し|ためし':         'trial; test',
  '英和|えいわ':         'English-Japanese',
  '和英|わえい':         'Japanese-English',
  '日米|にちべい':       'Japan and the US',
  '新米|しんまい':       'new rice',
  '米価|べいか':         'price of rice',
  '中南米|ちゅうなんべい': 'Central and South America',
  '南米|なんべい':       'South America',
  '宿泊|しゅくはく':     'lodging; staying at',
  '宿|やど':             'inn; lodging',
  '下宿|げしゅく':       'boarding house; lodging',
  '合宿|がっしゅく':     'training camp',
  '宿命|しゅくめい':     'fate; destiny',
  '地図|ちず':           'map',
  '地上|ちじょう':       'aboveground',
  '地下|ちか':           'underground',
  '土地|とち':           'land; lot',
  '自国|じこく':         'one\'s own country',
  '自ら|みずから':       'oneself; in person',
  '自分|じぶん':         'oneself; myself',
  '自白|じはく':         'confession',
  '自殺|じさつ':         'suicide',
  '動物|どうぶつ':       'animal',
  '行動|こうどう':       'action; behavior',
  '自動|じどう':         'automatic',
  '運動|うんどう':       'exercise; movement',
  '動物園|どうぶつえん': 'zoo',
  '運用|うんよう':       'operation; application',
  '運ぶ|はこぶ':         'to carry; to transport',
  '運輸|うんゆ':         'transportation',
  '運|うん':             'fortune; luck',
  '運営|うんえい':       'management; operation',
  '真相|しんそう':       'truth; real situation',
  '寺|てら':             'Buddhist temple',
  '寺院|じいん':         'Buddhist temple',
  '国分寺|こくぶんじ':   null, // historical place name
  '山寺|やまでら':       'mountain temple',
  '禅寺|ぜんでら':       'Zen temple',
  '息|いき':             'breath',
  '利息|りそく':         'interest (on money)',
  '休息|きゅうそく':     'rest; relaxation',
  '消息|しょうそく':     'news; word; whereabouts',
  '窒息|ちっそく':       'suffocation',
  '娘|むすめ':           'daughter; girl',
  '娘|じょう':           null, // very formal/dated
  'ひとり娘|ひとりむすめ': 'only daughter',
  '娘婿|むすめむこ':     'son-in-law',
  '孫娘|まごむすめ':     'granddaughter',
  '双方|そうほう':       'both sides; both parties',
  '双|そう':             'pair; set',
  '双葉|ふたば':         'cotyledon; first leaves',
  '双生児|そうせいじ':   'twins',
  '双ぶ|ならぶ':         null, // archaic spelling of 並ぶ
  '性格|せいかく':       'character; personality',
  '急性|きゅうせい':     'acute (illness)',
  '個性|こせい':         'individuality; personality',
  '人間性|にんげんせい': 'humanity; human nature',
  '性能|せいのう':       'performance; ability',
  '食料|しょくりょう':   'food; foodstuffs',
  '資料|しりょう':       'materials; data',
  '原料|げんりょう':     'raw materials',
  '料理|りょうり':       'cooking; dish',
  '燃料|ねんりょう':     'fuel',
  '一番|いちばん':       'first; best; most',
  '本番|ほんばん':       'the real thing; actual performance',
  '番号|ばんごう':       'number',
  '番組|ばんぐみ':       'TV program; show',
  '交番|こうばん':       'police box',
  '近所|きんじょ':       'neighborhood',
  '近代|きんだい':       'modern era',
  '付近|ふきん':         'vicinity; neighborhood',
  '最近|さいきん':       'recently; lately',
  '近い|ちかい':         'near; close',
  '海上|かいじょう':     'on the sea; maritime',
  '海|うみ':             'sea; ocean',
  '海べ|うみべ':         'beach; seaside',
  '海水|かいすい':       'seawater',
  '海軍|かいぐん':       'navy',
  '海岸|かいがん':       'coast; shore',
  '道|みち':             'road; path; way',
  '国道|こくどう':       'national highway',
  '歩道|ほどう':         'sidewalk; footpath',
  '道路|どうろ':         'road; highway',
  '関税|かんぜい':       'tariff; customs duty',
  '玄関|げんかん':       'entrance; front door',
  '線|せん':             'line',
  '線維|せんい':         'fiber',
  '無線|むせん':         'wireless; radio',
  '曲線|きょくせん':     'curve',
  '本線|ほんせん':       'main line',
  '公園|こうえん':       'public park',
  '公立|こうりつ':       'public (institution)',
  '公明|こうめい':       null, // political party name
  '公表|こうひょう':     'official announcement',
  '公共|こうきょう':     'public; communal',
  '学園|がくえん':       'school; academy',
  '田園|でんえん':       'rural area; countryside',
  '園|その':             'garden; orchard',
  '遊園地|ゆうえんち':   'amusement park',
  '庭園|ていえん':       'garden',
  '橋|はし':             'bridge',
  '桟橋|さんばし':       'pier; jetty',
  '鉄橋|てっきょう':     'iron bridge',
  '陸橋|りっきょう':     'overpass; viaduct',
  '岡|おか':             'hill',
  '福岡|ふくおか':       'Fukuoka',
  '静岡|しずおか':       'Shizuoka',
  '谷|たに':             'valley',
  '谷川|たにがわ':       'mountain stream',
  '谷間|たにま':         'valley; ravine',
  '渓谷|けいこく':       'gorge; ravine',
  '谷まる|きわまる':     null, // archaic
  '鼻|はな':             'nose',
  '鼻水|はなみず':       'snot; runny nose',
  '鼻紙|はながみ':       'tissue paper',
  '鼻息|はないき':       'nasal breathing',
  '鼻先|はなさき':       'tip of nose',
  '中断|ちゅうだん':     'interruption; suspension',
  '決断|けつだん':       'decision; determination',
  '診断|しんだん':       'diagnosis',
  '勲章|くんしょう':     'decoration; medal',
  '楽章|がくしょう':     'movement (of music)',
  '受章|じゅしょう':     'receiving an award',
  '憲章|けんしょう':     'charter',
  '章|しょう':           'chapter',
  '曲|きょく':           'tune; piece of music',
  '交響曲|こうきょうきょく': 'symphony',
  '曲がる|まがる':       'to bend; to turn',
  '曲げる|まげる':       'to bend',
  '古里|ふるさと':       'hometown',
  '古い|ふるい':         'old',
  '中古|ちゅうこ':       'used; secondhand',
  '古代|こだい':         'ancient times',
  '古本|ふるほん':       'used book',
  '気温|きおん':         'air temperature',
  '高温|こうおん':       'high temperature',
  '温度|おんど':         'temperature',
  '温暖|おんだん':       'warm; mild',
  '温泉|おんせん':       'hot spring',
  '大気|たいき':         'atmosphere',
  '人気|にんき':         'popularity',
  '強気|つよき':         'bullish; confident',
  '服|ふく':             'clothes',
  '服用|ふくよう':       'taking (medicine)',
  '服装|ふくそう':       'attire; dress',
  '洋服|ようふく':       'Western clothes',
  '制服|せいふく':       'uniform',
  '去年|きょねん':       'last year',
  '死去|しきょ':         'death; passing',
  '過去|かこ':           'the past',
  '去る|さる':           'to leave',
  '立ち去る|たちさる':   'to leave; to depart',
  // Final cleanup — mixed-kana variants (prefer pure-kanji forms),
  // archaic spellings, and questionable picks.
  '物さし|ものさし':     null, // 物差し is canonical
  '物ごと|ものごと':     null, // 物事 is canonical
  '道ばた|みちばた':     null, // 道端
  '海べ|うみべ':         null, // 海辺
  '気がかり|きがかり':   null, // 気掛かり; also tail too long
  '気がね|きがね':       null, // 気兼ね
  '気どる|きどる':       null, // 気取る
  '気のどく|きのどく':   null, // 気の毒
  '新ためて|あらためて': null, // archaic
  '横ばい|よこばい':     null,
  '横しま|よこしま':     null,
  '夜ふかし|よふかし':   null, // 夜更かし
  '夏ばて|なつばて':     null, // 夏バテ
  '銀紙|ぎんがみ':       null, // niche
  '秋|とき':             null, // rare alt reading of 秋
  '春めく|はるめく':     null,
  '映える|はえる':       null, // less common; prefer 映る
  '映す|うつす':         'to project; to reflect',
  '映る|うつる':         'to be reflected',
  '断つ|たつ':           'to cut off; to abstain from',
  '断じて|だんじて':     null, // adverb, niche
  '断|だん':             null,
  '止める|とどめる':     null, // alt reading; prefer とめる sense
  '止む|やむ':           'to cease; to stop',
  '辞める|やめる':       'to quit; to resign',
  '辞す|じす':           null, // formal
  '調べ|しらべ':         'tune; melody',
  '調う|ととのう':       'to be ready; to be in order',
  '関する|かんする':     'to concern; to be related to',
  '関|せき':             null,
  '宿す|やどす':         null,
  '宿る|やどる':         'to lodge; to dwell',
  '動じる|どうじる':     null, // niche
  '動|どう':             null,
  '極める|きわめる':     'to master; to carry to extremes',
  '味わう|あじわう':     'to taste; to experience',
  '味わい|あじわい':     'flavor; charm',
  '紙くず|かみくず':     null,
  '園|えん':             null, // duplicate of その reading
  '札|さつ':             null, // duplicate of ふだ entry
  '陽あたり|ひあたり':   null,
  '陽子|ようし':         null, // physics term
  '陽|よう':             null,
  '皇太子|こうたいし':   null, // off-syllabus 皇
  '双対|そうたい':       null, // math term
  '切|きり':             null,
  '切る|きる':           'to cut',
  '切れる|きれる':       'to break; to snap; to cut',
  '切手|きって':         'postage stamp',
  '切符|きっぷ':         'ticket',
  // Ensure these "obvious basics" appear with correct gloss when picked
  '元気|げんき':         'healthy; energetic; lively',
  '天気|てんき':         'weather',
  '病気|びょうき':       'illness; sickness',
  '気分|きぶん':         'mood; feeling',
  '気持ち|きもち':       'feeling; sensation; mood',
  '体|からだ':           'body',
  '時計|とけい':         'clock; watch',
  '映画|えいが':         'movie; film',
  '夏休み|なつやすみ':   'summer vacation',
  '春休み|はるやすみ':   'spring vacation',
  '冬休み|ふゆやすみ':   'winter vacation',
};

// --- Load source data ---
const detailed = JSON.parse(fs.readFileSync(PREREQ_DETAILED, 'utf-8'));
const wordsCache = JSON.parse(fs.readFileSync(WORDS_CACHE, 'utf-8'));
const kanjidic = JSON.parse(fs.readFileSync(KANJIDIC_CACHE, 'utf-8'));

// Set of all "syllabus" kanji (the 86 main + 117 prereq).
// Words that contain a kanji OUTSIDE this set are penalized as off-syllabus.
const mainKanjiData = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, 'public/seed-data/extended-kanji/kanji.json'),
    'utf-8',
  ),
);
const SYLLABUS = new Set([
  ...mainKanjiData.kanji.map((k) => k.kanji),
  ...detailed.kanji.map((k) => k.kanji),
]);

// Common kanji we can tolerate even if not in our syllabus
// (these are very-basic kanji that beginners encounter early but the
// teacher hasn't formally introduced — single-stroke numbers, etc.)
const COMMON_TOLERATED = new Set(
  '一二三四五六七八九十百千万円年月日時分秒人口女男子大小中本山川田水火木金土上下右左前後内外東西南北年生学先生車店食飲見聞行来出入今何高安多少新古早遅長短赤青白黒赤'.split(
    '',
  ),
);

const ALLOWED_KANJI = new Set([...SYLLABUS, ...COMMON_TOLERATED]);

function offSyllabusCount(word, parentChar) {
  let n = 0;
  for (const ch of word) {
    if (ch === parentChar) continue;
    // Only count CJK ideographs
    const code = ch.codePointAt(0);
    if (code >= 0x4e00 && code <= 0x9fff) {
      if (!ALLOWED_KANJI.has(ch)) n++;
    }
  }
  return n;
}

function lengthBonus(written, parentChar) {
  // Prefer 2- and 3-char compounds for beginners.
  // Single-char readings (just the kanji + okurigana) are great too.
  // Penalize 5+ char compounds.
  const charCount = [...written].length;
  if (charCount === 2 || charCount === 3) return 30;
  if (charCount === 4) return 10;
  if (charCount === 1) return 20;
  return -10 * (charCount - 4);
}

const HIRAGANA_RE = /^[ぁ-ゖ]+$/;

/**
 * Big pedagogical-priority boost: single-kanji verbs (会う, 飛ぶ, 帰る, 買う),
 * single-kanji adjectives (強い, 古い, 新しい, 太い), and the kanji standalone
 * (海, 道, 朝). Newspaper frequency rank underweights these because they're
 * conversational, not formal — but they're foundational for beginners.
 */
function pedagogicalBonus(written, parentChar) {
  const chars = [...written];
  if (chars.length === 1 && chars[0] === parentChar) return 120;
  if (chars[0] !== parentChar) return 0;
  // Parent kanji followed by pure-hiragana okurigana (single-kanji verb/adj).
  // Big boost — these are foundational beginner words but newspaper frequency
  // ranks underweight conversational verbs.
  const tail = chars.slice(1).join('');
  // Real okurigana on N5/N4 verbs/adjectives is 1-2 hiragana chars
  // (e.g., 会う, 強い, 楽しい, 明らか, 強める). 3+ hiragana usually means
  // a mixed-kana spelling like 気がかり / 物さし (skip).
  if (tail && HIRAGANA_RE.test(tail) && tail.length <= 2) return 110;
  return 0;
}

function positionBonus(written, parentChar) {
  const idx = [...written].indexOf(parentChar);
  if (idx === 0) return 5; // 会社, 会話 — kanji leads the compound
  return 0;
}

function readingMatchesKanji(reading, parentChar) {
  // Verify the reading plausibly contains a reading from KANJIDIC for the parent.
  const dic = kanjidic[parentChar];
  if (!dic) return true; // can't verify, give benefit of doubt
  const hiraganaize = (s) =>
    s.replace(/[ァ-ヶ]/g, (ch) =>
      String.fromCodePoint(ch.codePointAt(0) - 0x60),
    );
  const dicReadings = [
    ...(dic.on_readings || []),
    ...(dic.kun_readings || []),
  ].map((r) => hiraganaize(r.replace(/[-.]/g, '').replace(/\(.*?\)/g, '')));
  // Also include rendaku-voiced variants
  const expanded = new Set(dicReadings);
  for (const r of dicReadings) {
    if (!r) continue;
    const first = r[0];
    const voicedMap = {
      か: 'が', き: 'ぎ', く: 'ぐ', け: 'げ', こ: 'ご',
      さ: 'ざ', し: 'じ', す: 'ず', せ: 'ぜ', そ: 'ぞ',
      た: 'だ', ち: 'ぢ', つ: 'づ', て: 'で', と: 'ど',
      は: 'ば', ひ: 'び', ふ: 'ぶ', へ: 'べ', ほ: 'ぼ',
    };
    if (voicedMap[first]) expanded.add(voicedMap[first] + r.slice(1));
    // And hiragana ふ→ぷ for half-rendaku
    const halfMap = { は: 'ぱ', ひ: 'ぴ', ふ: 'ぷ', へ: 'ぺ', ほ: 'ぽ' };
    if (halfMap[first]) expanded.add(halfMap[first] + r.slice(1));
  }
  // The reading should contain at least one of the kanji's readings as a substring.
  for (const r of expanded) {
    if (r && reading.includes(r)) return true;
  }
  return false;
}

function pickBestVariantAndGloss(entry, parentChar) {
  // Pick the variant whose `written` contains the parent char and has the
  // strongest priorities; prefer the most-common written form.
  let bestVar = null;
  let bestScore = -Infinity;
  for (const v of entry.variants) {
    if (!v.written.includes(parentChar)) continue;
    const s = priorityScore(v.priorities);
    if (s > bestScore) {
      bestScore = s;
      bestVar = v;
    }
  }
  if (!bestVar) return null;

  // Pick the meaning group whose glosses best match the kanji's KANJIDIC
  // meaning. Score = matching kanjidic terms minus penalties for derived
  // senses (dialect/slang/archaic markers, parentheticals, single-context tags).
  const dic = kanjidic[parentChar];
  const dicMeanings = (dic?.meanings || []).map((m) => m.toLowerCase());

  function scoreGroup(m) {
    const text = m.glosses.join(' ').toLowerCase();
    let s = 0;
    for (const dm of dicMeanings) {
      // Word-boundary match to avoid "meet" matching "meeting" only when desired
      if (text.includes(dm)) s += 5;
    }
    // Penalize derived/specialty senses
    if (/\((slang|colloquial|sl|arch|obs|literary|hum|hon|ling|comp|biol|chem|physics|med|law|sumo|baseb|sports|music)/i.test(text)) s -= 10;
    if (/\b(?:slang|sumo|esp\.|specialist|arch)\b/i.test(text)) s -= 5;
    // Bonus for direct & general first gloss (no parenthetical qualifier at start)
    const first = m.glosses[0] || '';
    if (!first.startsWith('(')) s += 2;
    // Slight bonus for shorter, more general glosses
    if (first.length < 30) s += 1;
    return s;
  }

  let bestMeaningIdx = 0;
  let bestMatch = -Infinity;
  entry.meanings.forEach((m, i) => {
    const s = scoreGroup(m);
    // Tiebreak: earlier groups win (JMdict orders by primacy)
    const adjusted = s - i * 0.1;
    if (adjusted > bestMatch) {
      bestMatch = adjusted;
      bestMeaningIdx = i;
    }
  });

  const m = entry.meanings[bestMeaningIdx];
  const gloss = m.glosses
    .filter((g) => !g.startsWith('(see also'))
    .slice(0, 2)
    .join('; ');

  return { variant: bestVar, gloss, score: bestScore };
}

// --- Main curation pass ---
const used = new Set(); // word|reading already picked anywhere
// Pre-seed with words already linked to any prereq (don't repeat).
for (const k of detailed.kanji) {
  for (const v of k.vocabulary) used.add(`${v.word}|${v.reading}`);
}

const out = [];
const skipped = [];
for (const k of detailed.kanji) {
  const entries = wordsCache[k.kanji] || [];
  const candidates = [];

  for (const entry of entries) {
    const picked = pickBestVariantAndGloss(entry, k.kanji);
    if (!picked) continue;
    const { variant: v, gloss, score: prio } = picked;
    if (prio <= 0) continue; // require some priority tag
    if (!gloss) continue;
    if (isPureKana(v.written)) continue; // need kanji form
    if (used.has(`${v.written}|${v.pronounced}`)) continue;

    // Skip-list / gloss override
    const overrideKey = `${v.written}|${v.pronounced}`;
    if (overrideKey in GLOSS_OVERRIDES && GLOSS_OVERRIDES[overrideKey] === null) {
      continue;
    }

    // Verify reading is plausible for the parent kanji.
    if (!readingMatchesKanji(v.pronounced, k.kanji)) continue;

    const off = offSyllabusCount(v.written, k.kanji);
    if (off >= 2) continue; // skip if 2+ rare kanji in the word

    const score =
      prio +
      lengthBonus(v.written, k.kanji) +
      positionBonus(v.written, k.kanji) +
      pedagogicalBonus(v.written, k.kanji) -
      off * 25;

    // Skip names: glosses starting with "(person", "(place", proper nouns
    if (/^\((person|place|surname|given|company)/i.test(gloss)) continue;
    // Skip overly-archaic / classical / honorific wrappers
    if (/^\((arch|obs|literary|hon|hum|classical)/i.test(gloss)) continue;

    const finalGloss = GLOSS_OVERRIDES[overrideKey] || gloss;

    candidates.push({
      word: v.written,
      reading: v.pronounced,
      meaning: finalGloss,
      score,
      priorities: v.priorities,
      offSyllabus: off,
    });
  }

  // Sort by score desc
  candidates.sort((a, b) => b.score - a.score);

  // Pick top 5, prefer variety: avoid 5 entries that all start with the same
  // 2-char prefix (e.g., 5 different "会社X" compounds).
  const picked = [];
  const prefixSeen = new Map();
  for (const c of candidates) {
    if (picked.length >= 5) break;
    const prefix = [...c.word].slice(0, 2).join('');
    const used = prefixSeen.get(prefix) || 0;
    if (used >= 2) continue; // max 2 per prefix
    picked.push(c);
    prefixSeen.set(prefix, used + 1);
  }

  // If we still don't have 5, relax the prefix rule
  if (picked.length < 5) {
    for (const c of candidates) {
      if (picked.length >= 5) break;
      if (picked.some((p) => p.word === c.word)) continue;
      picked.push(c);
    }
  }

  for (const p of picked) used.add(`${p.word}|${p.reading}`);

  if (picked.length === 0) {
    skipped.push(k.kanji);
  }

  out.push({
    parentKanji: k.kanji,
    vocabulary: picked.map((p) => ({
      word: p.word,
      reading: p.reading,
      meaning: p.meaning,
      parentKanji: k.kanji,
    })),
    debug: {
      candidatesConsidered: candidates.length,
      pickCount: picked.length,
    },
  });
}

const dataset = {
  metadata: {
    source: 'JMdict via kanjiapi.dev/v1/words',
    generatedAt: new Date().toISOString(),
    totalKanji: out.length,
    totalVocab: out.reduce((s, k) => s + k.vocabulary.length, 0),
    rule: '5 basic vocab per kanji, JMdict priority-tagged, deduped against existing linked vocab',
    skipped,
  },
  results: out,
};

fs.writeFileSync(OUT, JSON.stringify(dataset, null, 2));
console.log(`Wrote ${out.length} kanji results to ${OUT}`);
console.log(`Total vocab entries: ${dataset.metadata.totalVocab}`);
const fewer = out.filter((k) => k.vocabulary.length < 5);
console.log(
  `Kanji with fewer than 5 picks: ${fewer.length} (${fewer.map((k) => k.parentKanji).join(' ')})`,
);
const empty = out.filter((k) => k.vocabulary.length === 0);
console.log(
  `Kanji with NO picks: ${empty.length} (${empty.map((k) => k.parentKanji).join(' ')})`,
);
