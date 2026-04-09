# Verb Comparison Report
## Source Data vs N5 Verbs Dataset

**Date:** March 11, 2026

## Summary

- **N5 Dataset:** 140 verbs
- **Source Data Extracted:** 112 unique verb forms
- **Found in N5:** 85 verbs
- **Missing from N5:** 27 verbs

## Verbs in Source BUT NOT in N5 Dataset (27 verbs)

| No. | Hiragana | Kanji | Romaji | Meaning | Group |
|-----|----------|-------|--------|---------|-------|
| 1 | ちがいます | 違います | chigaimasu | be different, be wrong, it isn't | 1G |
| 2 | しごとします | 仕事します | shigoto shimasu | work | 3G |
| 3 | はじまります | 始まります | hajimarimasu | start, begin | 1G |
| 4 | もどります | 戻ります | modorimasu | return | 1G |
| 5 | ドライブします | ドライブします | doraibu shimasu | drive | 3G |
| 6 | はっぴょうします | 発表します | happyou shimasu | announce, present | 3G |
| 7 | こたえます | 答えます | kotaemasu | answer | 2G |
| 8 | たすかります | 助かります | tasukarimasu | be helpful | 1G |
| 9 | ならべます | 並べます | narabemasu | arrange, align | 2G |
| 10 | けしょうします | 化粧します | keshou shimasu | put on/wear makeup | 3G |
| 11 | きめます | 決めます | kimemasu | decide | 2G |
| 12 | わらいます | 笑います | waraimasu | laugh, smile | 1G |
| 13 | なきます | 泣きます | nakimasu | cry | 1G |
| 14 | けんかします | けんかします | kenka shimasu | fight, argue | 3G |
| 15 | はしります | 走ります | hashirimasu | run | 1G |
| 16 | おどります | 踊ります | odorimasu | dance | 1G |
| 17 | きゅうけいします | 休憩します | kyuukei shimasu | take a break | 3G |
| 18 | しにます | 死にます | shinimasu | die, pass away | 1G |
| 19 | りょこうします | 旅行します | ryokou shimasu | go on a trip, travel | 3G |
| 20 | うかがいます | 伺います | ukagaimasu | visit (humble) | 1G |
| 21 | りょうりします | 料理します | ryouri shimasu | cook | 3G |
| 22 | ゆでます | 茹でます | yudemasu | cook, boil | 2G |
| 23 | わきます | 沸きます | wakimasu | boil | 1G |
| 24 | おくれます | 遅れます | okuremasu | be late | 2G |
| 25 | ほします | 干します | hoshimasu | hang out to dry | 1G |
| 26 | さきます | 咲きます | sakimasu | blossom, bloom | 1G |
| 27 | まもります | 守ります | mamorimasu | observe, comply, protect | 1G |

## Breakdown by Category

### Basic Verbs (4)
1. **ちがいます** (違います) - be different, be wrong
2. **しごとします** (仕事します) - work
3. **はじまります** (始まります) - start, begin
4. **もどります** (戻ります) - return

### Communication & Expression (2)
5. **はっぴょうします** (発表します) - announce, present
6. **こたえます** (答えます) - answer

### Work & Office (2)
7. **きゅうけいします** (休憩します) - take a break
8. **おくれます** (遅れます) - be late

### Emotions & Physical Actions (6)
9. **わらいます** (笑います) - laugh, smile
10. **なきます** (泣きます) - cry
11. **けんかします** (けんかします) - fight, argue
12. **はしります** (走ります) - run
13. **おどります** (踊ります) - dance
14. **しにます** (死にます) - die, pass away

### Helpful & Support (2)
15. **たすかります** (助かります) - be helpful
16. **まもります** (守ります) - observe, comply, protect

### Organization & Arrangement (1)
17. **ならべます** (並べます) - arrange, align

### Personal Care (1)
18. **けしょうします** (化粧します) - put on/wear makeup

### Decision & Planning (2)
19. **きめます** (決めます) - decide
20. **りょこうします** (旅行します) - go on a trip, travel

### Visiting (1)
21. **うかがいます** (伺います) - visit (humble form)

### Cooking (3)
22. **りょうりします** (料理します) - cook
23. **ゆでます** (茹でます) - cook, boil
24. **わきます** (沸きます) - boil

### Household (1)
25. **ほします** (干します) - hang out to dry

### Nature (1)
26. **さきます** (咲きます) - blossom, bloom

### Transportation (1)
27. **ドライブします** (ドライブします) - drive

## Verb Group Distribution (Missing Verbs)

- **Group 1 (Godan):** 14 verbs (52%)
- **Group 2 (Ichidan):** 4 verbs (15%)
- **Group 3 (Irregular):** 9 verbs (33%)

## Notes

### Potential Reasons for Gaps

1. **Source Material Focus:** The source data appears to be from a practical/conversational Japanese course with workplace and daily life emphasis
2. **N5 Dataset Scope:** The N5 dataset may focus on core JLPT N5 vocabulary
3. **Level Differences:** Some verbs like うかがいます (humble form) and けしょうします might be considered beyond basic N5

### Recommendations

1. **Consider Adding:** Most of these 27 verbs are commonly used in daily Japanese conversation
2. **Priority Additions:**
   - Basic verbs: ちがいます, はじまります, もどります
   - Common daily actions: はしります, わらいます, なきます
   - Essential work verbs: おくれます, きゅうけいします
3. **Lower Priority:**
   - Specialized: けしょうします, ほします
   - Nature/seasonal: さきます

### Dataset Expansion Potential

If these 27 verbs were added to the N5 dataset:
- **New total:** 167 verbs
- **Coverage increase:** +19%
- **Practical value:** High (most are common daily verbs)

---

**Generated:** March 11, 2026
**Script:** compare_verb_datasets.py
