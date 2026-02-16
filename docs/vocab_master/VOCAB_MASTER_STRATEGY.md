# N5 Vocabulary Master Strategy

**Date:** 2026-02-16
**Purpose:** Fresh start with authoritative N5 vocabulary using JMDict integration
**Goal:** Build complete, high-quality N5 vocabulary dataset

---

## 🎯 Current Situation

### What We Have

| Source | Entries | Quality | JMDict Coverage | Status |
|--------|---------|---------|-----------------|--------|
| **Current Enhanced** | 703 | High | Partial | ✅ In production |
| **N5_807 Dataset** | 807 | High | 98.9% | 📦 Available |
| **Tanos Reference** | 597 | Standard | N/A | 📚 Reference |
| **N5_vocab_complete** | 2,248 | ⚠️ Too broad | 100% | ❌ Not N5 only |

### What We've Accomplished (Today)

✅ **Phase 1:** Added 32 essential expressions
✅ **Phase 2:** Added 9 missing adjectives
✅ **Phase 2.5:** Properly tagged all 66 adjectives (covers 83 canonical N5 adjectives)

**Current total:** 703 vocabulary cards

### What We Need

**Target:** ~940-1,077 complete N5 vocabulary
**Gap:** ~237-374 words

**Missing categories:**
- Verbs: ~80-100 (have some, need more)
- Nouns: ~100-150
- Particles: 2 (か, や)
- Counters: ~20-30

---

## 📚 Available Resources in vocab_master/

### 1. **N5_vocab_dataset_final.json** (From N5_807)
- **Entry count:** 807
- **JMDict coverage:** 98.9%
- **Quality:** High (professionally curated)
- **Structure:** Same as current dataset
- **Recommendation:** ⭐⭐⭐ **PRIMARY SOURCE**

### 2. **Tanos Reference** (tanos_n5_vocab.json)
- **Entry count:** 597
- **Quality:** Standard authoritative source
- **Coverage:** Conservative N5 list
- **Recommendation:** ⭐⭐ **VALIDATION SOURCE**

### 3. **Minna no Nihongo Verbs** (minna_verb.md)
- **Verbs:** 161 total
  - Group I (Godan): 91
  - Group II (Ichidan): 44
  - Group III (Irregular): 26
- **Quality:** Textbook standard
- **Recommendation:** ⭐⭐⭐ **VERB SOURCE**

### 4. **JMDict Filtering Strategy** (JMDict filter strategy/)
- **Professional filtering approach**
- **Priority tags:** news1, ichi1, nf01-nf06
- **Sense limiting:** First 2 senses for common words
- **Recommendation:** ⭐⭐⭐ **QUALITY CONTROL**

### 5. **ClaudeAI Decisions** (claudeAI_decision.md)
- **Kanji vs hiragana guidelines**
- **Decision principles for N5 appropriateness**
- **Recommendation:** ⭐⭐ **STYLE GUIDE**

---

## 🚀 Recommended Approach

### Option A: Use N5_807 Dataset (RECOMMENDED)

**Why:**
- Already has 807 high-quality entries
- 98.9% JMDict coverage
- Professional curation
- Compatible data structure

**Steps:**
1. Copy N5_807 dataset to vocab_master
2. Compare with current 703 entries
3. Extract ~104 new unique entries
4. Apply JMDict sense filtering
5. Validate against Tanos (597 words)
6. Result: ~807 vocabulary cards

**Timeline:** 1-2 days

**Pros:**
- ✅ Quick implementation
- ✅ High quality guaranteed
- ✅ JMDict integrated
- ✅ Well-tested dataset

**Cons:**
- ⚠️ Still 133-270 words short of 940-1,077 target
- ⚠️ May need Phase 4 to add remaining words

---

### Option B: Build from Scratch with JMDict

**Why:**
- Maximum control over quality
- Can reach 940-1,077 target directly
- Perfect JMDict integration

**Steps:**
1. Start with Tanos 597 as base
2. Add Minna verbs (161 total)
3. Use JMDict filtering for meanings
4. Cross-reference with N5_807
5. Add missing nouns/counters from comparison
6. Result: ~900-1,000 vocabulary cards

**Timeline:** 1-2 weeks

**Pros:**
- ✅ Complete N5 coverage
- ✅ Perfect JMDict integration
- ✅ Full control over quality

**Cons:**
- ⚠️ Time-consuming
- ⚠️ Need to verify each entry
- ⚠️ More complex implementation

---

## 💡 RECOMMENDED: Hybrid Approach

**Combine the best of both worlds:**

### Phase 3: Add Core Vocabulary from N5_807

**Goal:** Add ~100-150 high-priority words

**Steps:**

1. **Extract missing words** from N5_807 (807 entries) that aren't in current 703
   - Expected: ~100-200 words depending on overlap

2. **Prioritize by category:**
   - Priority 1: Essential verbs (から ~50-80 verbs)
   - Priority 2: Common nouns (から ~50-100 nouns)
   - Priority 3: Particles (2: か, や)
   - Priority 4: Counters (~10-20)

3. **Apply quality filters:**
   - Use JMDict sense filtering (first 2 senses)
   - Cross-reference with Tanos for validation
   - Follow claudeAI_decision.md for kanji choices

4. **Result:** ~850-900 vocabulary cards

### Phase 4 (Optional): Fill Remaining Gaps

**Goal:** Reach 940-1,077 complete coverage

**Steps:**

1. Compare 850-900 cards with Tanos 1,077-word count
2. Identify remaining ~77-227 words
3. Add systematically by priority
4. Final validation against all sources

---

## 📊 Implementation Strategy

### Week 1: Phase 3 - Core Vocabulary Addition

**Day 1-2: Analysis**
```bash
# Compare N5_807 with current enhanced dataset
python3 scripts/compare_vocabularies.py \
  --source1 N5_807_data_set_details/data/N5_vocab_dataset_final.json \
  --source2 public/seed-data/N5_vocab_dataset_ENHANCED.json \
  --output vocab_master/missing_analysis.json
```

**Day 3-4: Extraction & Filtering**
```bash
# Extract missing verbs
python3 scripts/extract_missing_verbs.py \
  --reference minna_verb.md \
  --current N5_vocab_dataset_ENHANCED.json \
  --jmdict vocab_sources/JMdict_e.gz \
  --output vocab_master/missing_verbs.json

# Extract missing nouns
python3 scripts/extract_missing_nouns.py \
  --source N5_807_dataset.json \
  --current N5_vocab_dataset_ENHANCED.json \
  --output vocab_master/missing_nouns.json
```

**Day 5: Integration**
```bash
# Create Phase 3 dataset
python3 scripts/create_phase3_vocabulary.py \
  --base N5_vocab_dataset_ENHANCED.json \
  --add-verbs missing_verbs.json \
  --add-nouns missing_nouns.json \
  --add-particles "か,や" \
  --output N5_vocab_dataset_PHASE3.json
```

**Expected Result:** ~850 vocabulary cards

---

### Week 2: Phase 4 - Complete Coverage (Optional)

**Goal:** Reach 940-1,077 words

**Steps:**
1. Cross-reference Phase 3 output with Tanos
2. Identify final gaps
3. Add remaining words with careful validation
4. Final quality check

---

## 🎯 Success Metrics

| Phase | Target | Cards Added | Total Cards | Completion |
|-------|--------|-------------|-------------|------------|
| **Current** | - | - | 703 | 70-75% |
| **Phase 3** | Core vocab | +147-197 | 850-900 | 85-90% |
| **Phase 4** | Complete | +40-177 | 940-1,077 | 100% |

---

## 📁 File Organization

```
vocab_master/
├── VOCAB_MASTER_STRATEGY.md          # This file
├── N5_vocab_dataset_final.json        # N5_807 reference (807 entries)
├── minna_verb.md                      # 161 Minna verbs
├── claudeAI_decision.md               # Kanji/hiragana decisions
├── comparison_analysis.md             # Multi-source comparison
├── JMDict filter strategy/            # Professional filtering
│   ├── QUICK_START_GUIDE.md
│   └── professional_jmdict_filtering.md
└── [Generated files will go here]
```

---

## ⚠️ Important Notes

### What NOT to Use

**N5_vocab_complete.json (2,248 entries):**
- ❌ Contains N1-N5 mixed vocabulary
- ❌ Too many homonyms (し has 40 entries!)
- ❌ Not N5-specific
- ❌ Outdated documentation (says 890 but has 2,248)

**Why it exists:** Probably a JMDict dump that wasn't filtered properly

### What TO Use

✅ **N5_807 dataset** - Proven, high-quality, N5-specific
✅ **Tanos reference** - Authoritative validation source
✅ **Minna verbs** - Standard textbook verbs
✅ **JMDict filtering** - Professional quality control

---

## 🎓 Lessons Learned

### From Previous Work

1. **Manual verification > Automation** ✅
   - Caught 20+ false positives in adjective categorization
   - Prevented adding N4+ words

2. **Phased approach works** ✅
   - Phase 1: Expressions (32 words)
   - Phase 2: Adjectives (9 words)
   - Phase 2.5: Retagging (66 adjectives)
   - All successful!

3. **Use authoritative sources** ✅
   - N5_ADJECTIVES_CLEAN.json provided ground truth
   - Prevented guesswork and errors

4. **Document decisions** ✅
   - claudeAI_decision.md shows reasoning
   - Helps maintain consistency

---

## 🚦 Next Steps

### Immediate (Today)

1. ✅ **Create vocab_master folder** - Done
2. ✅ **Copy key files** - Done
3. ✅ **Document strategy** - This file

### This Week

4. **Decide on approach:**
   - Recommended: Hybrid (Phase 3 from N5_807)
   - Alternative: Build from scratch

5. **Create extraction scripts:**
   - Compare vocabularies
   - Extract missing verbs/nouns
   - Apply JMDict filtering

6. **Run Phase 3:**
   - Add ~147-197 words
   - Reach 850-900 cards

### Next Week (Optional)

7. **Run Phase 4:**
   - Fill remaining gaps
   - Reach 940-1,077 cards
   - 100% N5 coverage ✅

---

## 📞 Questions to Decide

1. **Target size:**
   - Minimum: 850 (N5_807 level)
   - Standard: 940 (Conservative complete)
   - Maximum: 1,077 (Tanos complete with all forms)

2. **Timeline:**
   - Fast: Use N5_807 directly (1-2 days)
   - Balanced: Phase 3 approach (1 week)
   - Thorough: Phase 3 + 4 (2 weeks)

3. **Quality level:**
   - Standard: Take N5_807 as-is
   - High: Apply JMDict filtering
   - Maximum: Manual verification of each entry

---

## ✅ Recommendation Summary

**Best approach for you:**

1. **Use N5_807 as base** (807 high-quality entries)
2. **Extract ~100-200 missing words** not in current 703
3. **Apply JMDict sense filtering** (first 2 senses)
4. **Validate with Tanos** for confidence
5. **Result:** ~850-900 cards in 1 week

**Then optionally:**

6. **Add remaining words** to reach 940-1,077
7. **Final validation** against all sources
8. **Result:** 100% N5 coverage

**This gives you:**
- ✅ High quality (98.9% JMDict matched)
- ✅ Fast implementation (1 week for Phase 3)
- ✅ Proven source (N5_807 is battle-tested)
- ✅ Complete coverage (with optional Phase 4)

---

**Ready to proceed?** 🚀

*Created: 2026-02-16*
*Last updated: 2026-02-16*
