#!/usr/bin/env python3
import json
import re

# Load N5 verbs dataset
with open('/home/pankaj/bumble/lingomemory/public/seed-data/N5_verbs_dataset.json', 'r', encoding='utf-8') as f:
    n5_data = json.load(f)

# Group by masu-form kana to find homonyms
homonym_groups = {}
for verb in n5_data['verbs']:
    masu_kana = verb['forms']['masu']['kana']
    if masu_kana not in homonym_groups:
        homonym_groups[masu_kana] = []
    homonym_groups[masu_kana].append(verb)

# Find the 10 verbs in question
problem_verbs = {
    'おきます': {'source_meaning': 'put', 'n5_primary': 'to get up'},
    'きます': {'source_meaning': 'wear/put on', 'n5_primary': 'to come'},
    'はいります': {'source_meaning': 'take', 'n5_primary': 'to enter'},
    'かけます': {'source_meaning': 'sprinkle', 'n5_primary': 'to put on'},
    'おくります': {'source_meaning': 'be late', 'n5_primary': 'to send; escort'},
    'とります': {'source_meaning': 'pick', 'n5_primary': 'to take (a photo)'},
    'かいます': {'source_meaning': 'keep', 'n5_primary': 'to buy'},
    'いれます': {'source_meaning': 'add', 'n5_primary': 'to put in'},
    'ひきます': {'source_meaning': 'play', 'n5_primary': 'to pull'},
    'います': {'source_meaning': 'have', 'n5_primary': 'to exist (animate)'}
}

print("=" * 100)
print("HOMONYM ANALYSIS - Are these different verbs or different meanings?")
print("=" * 100)

for kana, info in problem_verbs.items():
    print(f"\n{'='*100}")
    print(f"{kana}")
    print(f"{'='*100}")
    
    if kana in homonym_groups:
        verbs_with_kana = homonym_groups[kana]
        print(f"Found {len(verbs_with_kana)} verb(s) in N5 dataset with this kana:")
        
        for v in verbs_with_kana:
            print(f"\n  {v['id']}: {v['lemma']['kanji']} ({v['lemma']['kana']})")
            print(f"     Masu: {v['forms']['masu']['kanji']} ({v['forms']['masu']['kana']})")
            print(f"     Primary: {v['meaning']['primary']}")
            print(f"     Gloss: {', '.join(v['meaning']['gloss'])}")
    
    print(f"\n  Source data says: '{info['source_meaning']}'")
    
    # Analysis
    if kana == 'おきます':
        print(f"\n  ANALYSIS: Homonym!")
        print(f"     N5 has: 起きます (okimasu) = get up, wake up")
        print(f"     Source means: 置きます (okimasu) = put, place")
        print(f"     VERDICT: Source refers to DIFFERENT verb 置く (not in N5 dataset)")
        
    elif kana == 'きます':
        print(f"\n  ANALYSIS: Homonym!")
        print(f"     N5 has: 来ます (kimasu) = come")
        print(f"     Source means: 着ます (kimasu) = wear, put on")
        print(f"     VERDICT: Source refers to DIFFERENT verb 着る (need to check if in N5)")
        
    elif kana == 'はいります':
        print(f"\n  ANALYSIS: Context-specific meaning")
        print(f"     N5 has: 入ります (hairimasu) = enter")
        print(f"     Source says: 'take' (in context of 'take a bath')")
        print(f"     VERDICT: Same verb, different English in specific context (風呂に入る = take a bath)")
        
    elif kana == 'かけます':
        print(f"\n  ANALYSIS: Multiple meanings of same verb OR homonym")
        print(f"     N5 has: かけます = put on (glasses), make (call), pour over")
        print(f"     Source says: 'sprinkle' (salt)")
        print(f"     VERDICT: Same verb, 'sprinkle' is another valid meaning of かける")
        
    elif kana == 'おくります':
        print(f"\n  ANALYSIS: ERROR in source?")
        print(f"     N5 has: 送ります (okurimasu) = send")
        print(f"     Source says: 'be late'")
        print(f"     VERDICT: Source CONFUSED with おくれます (遅れます = be late)")
        
    elif kana == 'とります':
        print(f"\n  ANALYSIS: Homonym!")
        print(f"     N5 has: 撮ります (torimasu) = take (photo)")
        print(f"     Source means: 採ります (torimasu) = pick (bamboo shoots)")
        print(f"     VERDICT: Source refers to DIFFERENT verb 採る (need to check if in N5)")
        
    elif kana == 'かいます':
        print(f"\n  ANALYSIS: Homonym!")
        print(f"     N5 has: 買います (kaimasu) = buy")
        print(f"     Source means: 飼います (kaimasu) = keep (pet)")
        print(f"     VERDICT: Source refers to DIFFERENT verb 飼う (need to check if in N5)")
        
    elif kana == 'いれます':
        print(f"\n  ANALYSIS: Context-specific meaning")
        print(f"     N5 has: 入れます (iremasu) = put in")
        print(f"     Source says: 'add' (salt)")
        print(f"     VERDICT: Same verb, 'add' is context-specific meaning (料理に入れる = add to cooking)")
        
    elif kana == 'ひきます':
        print(f"\n  ANALYSIS: Homonym!")
        print(f"     N5 has: 引きます (hikimasu) = pull")
        print(f"     Source means: 弾きます (hikimasu) = play (piano)")
        print(f"     VERDICT: Source refers to DIFFERENT verb 弾く (need to check if in N5)")
        
    elif kana == 'います':
        print(f"\n  ANALYSIS: Usage difference")
        print(f"     N5 has: います (imasu) = exist, be")
        print(f"     Source says: 'have'")
        print(f"     VERDICT: Different English translation for same verb usage")

