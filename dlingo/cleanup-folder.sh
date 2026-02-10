#!/bin/bash

echo "=================================================="
echo "DUOLINGO FOLDER CLEANUP"
echo "=================================================="
echo ""

# Create archive folder
echo "📁 Creating archive folder..."
mkdir -p archive

# Move intermediate data to archive
echo "📦 Archiving intermediate data..."
mv batch_*.{md,json} archive/ 2>/dev/null
mv list-*.txt archive/ 2>/dev/null
mv *-report.json archive/ 2>/dev/null
mv *-analysis.json archive/ 2>/dev/null
mv batch-verification-summary.json archive/ 2>/dev/null

# Move intermediate folders to archive
echo "📂 Archiving intermediate folders..."
mv remaining_264_examples archive/ 2>/dev/null
mv remaining_173_few_examples archive/ 2>/dev/null
mv final-word-level-category-without-example archive/ 2>/dev/null

# Move old markdown files to archive
echo "📝 Archiving old documentation..."
mv AI-*.md archive/ 2>/dev/null
mv CORRECTIONS_SUMMARY.md archive/ 2>/dev/null
mv ALL_LEVELS_UPDATE_SUMMARY.md archive/ 2>/dev/null
mv LINGOSPECIAL_IMPLEMENTATION.md archive/ 2>/dev/null
mv QUICK_START_GUIDE.md archive/ 2>/dev/null
mv TIPS_PREVIEW.md archive/ 2>/dev/null
mv examples-review.md archive/ 2>/dev/null
mv claude-prompt-264-words.md archive/ 2>/dev/null
mv words-without-examples.md archive/ 2>/dev/null
mv conjugated-forms-verification.md archive/ 2>/dev/null

# Move working scripts to archive
echo "🔧 Archiving working scripts..."
mv add-ai-examples-*.ts archive/ 2>/dev/null
mv check-alignment.ts archive/ 2>/dev/null
mv cleanup-analysis.ts archive/ 2>/dev/null
mv compare-*.ts archive/ 2>/dev/null
mv copy-duolingo-vocab-clean.ts archive/ 2>/dev/null
mv create-clean-vocab.ts archive/ 2>/dev/null
mv duolingo-parser.ts archive/ 2>/dev/null
mv extract-*.ts archive/ 2>/dev/null
mv fix-invalid-levels.ts archive/ 2>/dev/null
mv generate-173-prompt.ts archive/ 2>/dev/null
mv generate-examples-prompt*.ts archive/ 2>/dev/null
mv list-words-without-examples.ts archive/ 2>/dev/null
mv match-level1-examples.ts archive/ 2>/dev/null
mv merge-*.ts archive/ 2>/dev/null
mv remove-examples-from-public.ts archive/ 2>/dev/null
mv reverse-ids.ts archive/ 2>/dev/null
mv update-*.ts archive/ 2>/dev/null
mv validate-examples.ts archive/ 2>/dev/null
mv verify-*.ts archive/ 2>/dev/null

# Move subset files to archive
echo "📋 Archiving subset files..."
mv subset-*.txt archive/ 2>/dev/null
mv example_level_*.txt archive/ 2>/dev/null
mv data.txt archive/ 2>/dev/null
mv conjugated-forms-verification.json archive/ 2>/dev/null

echo ""
echo "=================================================="
echo "✅ CLEANUP COMPLETE!"
echo "=================================================="
echo ""
echo "📁 KEPT IN ROOT:"
echo "  - duolingo_vocab_enhanced.json (if exists)"
echo "  - PROCESS-DOCUMENTATION.md"
echo "  - categorization-review.md"
echo "  - PROMPT-FOR-CLAUDE-264-WORDS.md"
echo "  - PROMPT-FOR-CLAUDE-173-WORDS.md"
echo "  - README.md"
echo ""
echo "🔧 USEFUL SCRIPTS KEPT:"
echo "  - generate-claude-prompt.ts"
echo "  - analyze-example-stats.ts"
echo "  - final-comprehensive-verification.ts"
echo "  - analyze-ai-batches.ts"
echo "  - analyze-remaining-words.ts"
echo "  - analyze-duplicates.ts"
echo "  - analyze-batch-files.ts"
echo ""
echo "📂 FOLDERS KEPT:"
echo "  - duolingo-vocab-with-examples/ (contains backup)"
echo "  - .claude/ (Claude Code config)"
echo ""
echo "📁 ARCHIVED:"
echo "  - All intermediate data → archive/"
echo "  - All working scripts → archive/"
echo "  - All old documentation → archive/"
echo ""
echo "To restore any archived file, check the archive/ folder"
echo ""
