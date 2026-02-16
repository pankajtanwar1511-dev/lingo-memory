# Vocab Master - N5 Vocabulary Fresh Start

**Created:** 2026-02-16
**Purpose:** Organized workspace for building complete N5 vocabulary with JMDict integration

---

## 📁 What's in This Folder

### Strategy & Documentation

- **VOCAB_MASTER_STRATEGY.md** - Complete implementation plan and recommendations
- **README.md** - This file (overview)

### Primary Data Sources

- **N5_807_dataset.json** (807 entries)
  - High-quality N5 vocabulary
  - 98.9% JMDict coverage
  - **Recommended primary source**

- **minna_verb.md** (161 verbs)
  - Minna no Nihongo standard verbs
  - Group I/II/III categorized
  - With conjugation notes

### Reference Materials

- **claudeAI_decision.md**
  - Kanji vs hiragana guidelines
  - N5 appropriateness criteria
  - Style guide for vocabulary selection

- **comparison_analysis.md**
  - Multi-source vocabulary comparison
  - 6 detailed comparison tables
  - Merge strategies

### JMDict Integration

- **JMDict filter strategy/**
  - Professional filtering approaches
  - Sense limiting guidelines
  - Priority tag usage (news1, ichi1, nf01-nf06)

---

## 🎯 Current Status

### What We Have (In Production)

- **703 vocabulary cards** in `public/seed-data/N5_vocab_dataset_ENHANCED.json`
  - ✅ 32 essential expressions (Phase 1)
  - ✅ All 83 N5 adjectives properly tagged (Phase 2 + 2.5)
  - ✅ ~600+ nouns, verbs, and other words

### What We Need

- **Target:** 850-1,077 words for complete N5 coverage
- **Gap:** ~147-374 words
- **Focus:** Verbs, nouns, particles, counters

---

## 🚀 Recommended Next Steps

### Phase 3: Add Core Vocabulary

**Goal:** Add ~150-200 words from N5_807 dataset

**Approach:**
1. Compare N5_807 (807 words) with current 703
2. Extract missing ~100-200 words
3. Prioritize: verbs → nouns → particles → counters
4. Apply JMDict sense filtering
5. **Result:** ~850-900 vocabulary cards

**Timeline:** 1 week

### Phase 4 (Optional): Complete Coverage

**Goal:** Reach 940-1,077 words

**Approach:**
1. Cross-reference with Tanos (1,077-word target)
2. Fill remaining gaps
3. Final validation
4. **Result:** 100% N5 coverage

**Timeline:** +1 week

---

## 📊 Data Sources Quality Comparison

| Source | Words | JMDict | Quality | Use Case |
|--------|-------|--------|---------|----------|
| **N5_807** | 807 | 98.9% | ⭐⭐⭐⭐⭐ | Primary source |
| **Current** | 703 | Partial | ⭐⭐⭐⭐⭐ | Production base |
| **Tanos** | 597 | N/A | ⭐⭐⭐⭐ | Validation |
| **Minna Verbs** | 161 | N/A | ⭐⭐⭐⭐ | Verb source |

---

## ⚠️ What NOT to Use

**N5_vocab_complete.json (2,248 entries):**
- ❌ Contains N1-N5 mixed vocabulary
- ❌ Way too broad for N5
- ❌ Many advanced words (し has 40 entries!)
- ❌ Documentation is outdated

**Why it's here:** Historical JMDict dump, not properly filtered for N5

---

## 💡 Key Principles

### From Today's Work

1. **Manual verification** over automation ✅
2. **Phased approach** works well ✅
3. **Use authoritative sources** (N5_807, Tanos, Minna) ✅
4. **Document all decisions** for consistency ✅
5. **JMDict integration** for high-quality meanings ✅

### Quality Standards

- ✅ All vocabulary must be N5 level
- ✅ Use JMDict sense filtering (first 2 senses for common words)
- ✅ Follow claudeAI kanji/hiragana guidelines
- ✅ Cross-validate with multiple sources
- ✅ Proper part-of-speech tagging

---

## 📚 Reference Links

### Internal Documentation

- [Vocabulary Implementation](../docs/vocabulary_implementation.md)
- [N5 Adjectives Complete](../ADJECTIVES_COMPLETE.md)
- [Vocabulary Enhancement Summary](../vocab_sources/VOCABULARY_ENHANCEMENT_SUMMARY.md)

### External Resources

- Tanos N5 Word List: https://www.tanos.co.uk/jlpt/jlpt5/vocab/
- JMDict Project: https://www.edrdg.org/jmdict/j_jmdict.html
- Minna no Nihongo: Standard JLPT textbook

---

## 🎯 Success Criteria

**Phase 3 Complete When:**
- [ ] ~850-900 total vocabulary cards
- [ ] All essential verbs added (targeting ~140-160 total verbs)
- [ ] Common nouns filled in
- [ ] Particles added (か, や)
- [ ] JMDict meanings applied
- [ ] Cross-validated with Tanos

**Phase 4 Complete When:**
- [ ] 940-1,077 total vocabulary cards
- [ ] 100% Tanos coverage
- [ ] All sources reconciled
- [ ] Final quality check passed
- [ ] Ready for production

---

## 🛠️ Tools & Scripts (To Be Created)

### Planned Scripts

```
vocab_master/scripts/
├── compare_vocabularies.py      # Compare two vocab sources
├── extract_missing_verbs.py     # Extract verbs from Minna
├── extract_missing_nouns.py     # Extract nouns from N5_807
├── apply_jmdict_filtering.py    # Apply sense filtering
└── create_phase3_dataset.py     # Generate Phase 3 output
```

---

## 📞 Contact / Questions

See **VOCAB_MASTER_STRATEGY.md** for:
- Detailed implementation plan
- Timeline breakdown
- Decision points
- Recommended approaches

---

**Status:** ✅ Ready to begin Phase 3 implementation

*Last updated: 2026-02-16*
