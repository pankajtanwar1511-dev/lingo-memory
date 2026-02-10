# AI-Generated Examples Workflow

Complete workflow for generating example sentences for the 685 words without examples using Claude AI.

---

## 📋 Step-by-Step Process

### Step 1: Prepare the Prompt ✅ DONE

The comprehensive prompt file has been created:
- **File**: `AI-GENERATE-EXAMPLES-PROMPT.md`
- **Size**: 70.6 KB
- **Contains**: All 685 words organized by type with clear instructions

### Step 2: Send to Claude AI

1. Open the prompt file:
   ```bash
   cat AI-GENERATE-EXAMPLES-PROMPT.md
   ```

2. Copy the ENTIRE content (Ctrl+A, Ctrl+C)

3. Go to [claude.ai](https://claude.ai)

4. Create a new conversation

5. Paste the entire prompt

6. Wait for Claude to generate all examples (this may take a few minutes)

### Step 3: Save Claude's Response

1. Claude will return a large JSON response in this format:
   ```json
   {
     "updatedWords": [
       {
         "id": "duo_0",
         "exampleSentences": [
           {
             "japanese": "...",
             "english": "...",
             "context": "statement",
             "level": "2-10",
             "isAIGenerated": true
           }
         ]
       },
       // ... more words
     ]
   }
   ```

2. Copy Claude's JSON response

3. Save it to a file in the `duolingo` folder:
   ```bash
   # Save the JSON response
   nano ai-examples-response.json
   # Paste the JSON and save (Ctrl+O, Enter, Ctrl+X)
   ```

### Step 4: Merge AI Examples into Dataset

Run the merge script:
```bash
cd duolingo
npx ts-node merge-ai-examples.ts ai-examples-response.json
```

This will:
- ✅ Validate all AI-generated examples
- ✅ Merge them with existing Duolingo examples
- ✅ Update `duolingo_vocab_enhanced.json`
- ✅ Create an automatic backup
- ✅ Show detailed statistics

### Step 5: Verify the Results

After merging, check the statistics:
- Total vocabulary: 1,060 words
- Expected coverage: ~100% (all words should have examples)
- Total examples: ~687 (Duolingo) + ~1,000-2,000 (AI) = ~1,700-2,700 total
- Words with examples: Should be close to 1,060

---

## 📊 Current Status

**Before AI Generation:**
- Words with examples: 375 (35.4%)
- Words without examples: 685 (64.6%)
- Total examples: 687 (all from Duolingo)

**After AI Generation (Expected):**
- Words with examples: ~1,060 (100%)
- Total examples: ~1,700-2,700
- Duolingo examples: 687
- AI-generated examples: ~1,000-2,000

---

## 🔧 Scripts Available

### 1. `generate-examples-prompt.ts`
Generates the comprehensive prompt file for Claude.
```bash
npx ts-node generate-examples-prompt.ts
```

### 2. `merge-ai-examples.ts`
Merges Claude's JSON response into the vocabulary dataset.
```bash
npx ts-node merge-ai-examples.ts <response-file.json>
```

### 3. `list-words-without-examples.ts`
Lists all words currently without examples.
```bash
npx ts-node list-words-without-examples.ts
```

---

## 📁 Files Generated

- ✅ `AI-GENERATE-EXAMPLES-PROMPT.md` - The prompt to send to Claude
- ✅ `words-without-examples.md` - Detailed list of words without examples
- ✅ `words-without-examples.csv` - CSV format for spreadsheets
- ⏳ `ai-examples-response.json` - You'll create this by saving Claude's response
- 🔄 `duolingo_vocab_enhanced.backup_*.json` - Automatic backups created during merge

---

## ⚠️ Important Notes

1. **Backup**: The merge script automatically creates backups, but you can also manually backup:
   ```bash
   cp ../public/seed-data/duolingo_vocab_enhanced.json ../public/seed-data/duolingo_vocab_enhanced.manual_backup.json
   ```

2. **Validation**: The merge script validates all examples and reports errors

3. **Context Types**: Ensure Claude uses correct context types:
   - `statement` - Declarative sentences
   - `question` - Questions (usually end with か)
   - `answer` - Responses to questions

4. **Level Accuracy**: Claude estimates levels, but you can manually adjust if needed

5. **Quality Check**: After merging, spot-check some AI examples to ensure quality

---

## 🎯 Next Steps After Completion

Once all examples are added:

1. **Update Summary Document**:
   ```bash
   # Update the statistics in ALL_LEVELS_UPDATE_SUMMARY.md
   ```

2. **Test in Application**:
   - Verify examples display correctly
   - Check context badges (Q/A/statement)
   - Verify level tags show properly
   - Test AI-generated badge display

3. **Review Quality** (optional):
   - Randomly sample AI examples
   - Check for natural Japanese
   - Verify translations are accurate
   - Fix any issues found

---

## 📞 Support

If you encounter any issues:
1. Check the error messages from the merge script
2. Verify the JSON format from Claude
3. Check that all required fields are present
4. Ensure the backup was created before making changes

---

**Ready to start?** Follow Step 2 above! 🚀
