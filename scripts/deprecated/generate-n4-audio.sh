#!/bin/bash
# Generate N4 audio files using edge-tts
# This will take approximately 30-60 minutes for 632 words

echo "🎙️  Starting N4 Audio Generation..."
echo "   Input: public/seed-data/n4-comprehensive.json"
echo "   Output: public/audio/n4/"
echo "   Voice: ja-JP-NanamiNeural (Female)"
echo ""

# Run the TypeScript audio generation script
npx ts-node --project tsconfig.scripts.json scripts/generate-audio-edge.ts \
  --input public/seed-data/n4-comprehensive.json \
  --output-dir public/audio/n4 \
  2>&1 | tee /tmp/n4-audio-generation.log

echo ""
echo "✅ N4 Audio Generation Complete!"
echo "   Check log: /tmp/n4-audio-generation.log"
