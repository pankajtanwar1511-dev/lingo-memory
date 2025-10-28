#!/bin/bash
# Check audio generation progress

echo "🎵 Audio Generation Progress Monitor"
echo "=================================="
echo ""

# Count files
VOCAB_COUNT=$(find public/audio/n5 -name "n5_jlpt_*.mp3" -not -path "*/examples/*" 2>/dev/null | wc -l)
EXAMPLE_COUNT=$(find public/audio/n5/examples -name "*.mp3" 2>/dev/null | wc -l)
TOTAL_COUNT=$((VOCAB_COUNT + EXAMPLE_COUNT))

# Count real audio files (>1KB)
VOCAB_REAL=$(find public/audio/n5 -name "n5_jlpt_*.mp3" -not -path "*/examples/*" -size +1k 2>/dev/null | wc -l)
EXAMPLE_REAL=$(find public/audio/n5/examples -name "*.mp3" -size +1k 2>/dev/null | wc -l)
TOTAL_REAL=$((VOCAB_REAL + EXAMPLE_REAL))

echo "📊 Current Status:"
echo "  Vocabulary audio: $VOCAB_REAL / 662 ($(awk "BEGIN {printf \"%.1f\", ($VOCAB_REAL/662)*100}")%)"
echo "  Example audio: $EXAMPLE_REAL / 1368 ($(awk "BEGIN {printf \"%.1f\", ($EXAMPLE_REAL/1368)*100}")%)"
echo "  Total progress: $TOTAL_REAL / 2030 ($(awk "BEGIN {printf \"%.1f\", ($TOTAL_REAL/2030)*100}")%)"
echo ""

# Estimate remaining time
if [ $TOTAL_REAL -gt 10 ]; then
  RATE=$(awk "BEGIN {printf \"%.1f\", $TOTAL_REAL/10}")  # Files per minute (rough estimate)
  REMAINING=$((2030 - TOTAL_REAL))
  MINUTES=$(awk "BEGIN {printf \"%.0f\", $REMAINING/$RATE}")
  echo "⏱️  Estimated time remaining: ~$MINUTES minutes"
  echo ""
fi

# Check if generation is complete
if [ $TOTAL_REAL -eq 2030 ]; then
  echo "✅ Audio generation COMPLETE!"
  echo ""
  echo "📝 Next step: Run 'npm run link:audio' to add URLs to seed data"
else
  echo "⚙️  Generation still running..."
  echo "   Run this script again to check progress"
fi

echo ""
echo "Recent files:"
find public/audio/n5 -name "*.mp3" -mmin -1 -size +1k 2>/dev/null | head -5
