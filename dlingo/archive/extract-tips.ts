import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Tip {
  id: string;
  level: string; // e.g., "1-1", "2-3"
  chapter: string; // e.g., "Order food", "Describe people"
  title?: string; // First line of tip (if it looks like a title)
  content: string; // Full tip text
}

const allTips: Tip[] = [];
let tipIdCounter = 1;

// Process each level file
for (let levelNum = 1; levelNum <= 3; levelNum++) {
  const filePath = path.join(__dirname, `example_level_${levelNum}.txt`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: example_level_${levelNum}.txt`);
    continue;
  }

  console.log(`📖 Processing example_level_${levelNum}.txt...`);

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let currentLevel = '';
  let currentChapter = '';
  let collectingTip = false;
  let tipLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Chapter header
    if (line.match(/^Level (\d+-\d+) \[ (.+) \]$/)) {
      const match = line.match(/^Level (\d+-\d+) \[ (.+) \]$/);
      if (match) {
        currentLevel = match[1];
        currentChapter = match[2];
      }
      continue;
    }

    // Start of TIP section
    if (line.trim() === 'TIP') {
      collectingTip = true;
      tipLines = [];
      i++;
      continue;
    }

    // Inside TIP section
    if (collectingTip) {
      // Empty line or separator ends the tip
      if (line.trim() === '' || line.trim().startsWith('-')) {
        // Save the tip
        if (tipLines.length > 0) {
          const tipContent = tipLines.join('\n').trim();

          // Extract title (first line if it's short and looks like a title)
          const firstLine = tipLines[0].trim();
          let title: string | undefined;
          let content: string;

          if (firstLine.length < 60 && !firstLine.endsWith('.')) {
            title = firstLine;
            content = tipLines.slice(1).join('\n').trim();
          } else {
            content = tipContent;
          }

          allTips.push({
            id: `tip_${tipIdCounter++}`,
            level: currentLevel,
            chapter: currentChapter,
            title,
            content: content || tipContent
          });

          console.log(`   ✅ Extracted tip for Level ${currentLevel} (${currentChapter})`);
        }

        collectingTip = false;
        tipLines = [];
        continue;
      }

      // Collect tip lines
      tipLines.push(line);
    }
  }
}

// Save tips to JSON
const outputPath = path.join(__dirname, '../public/seed-data/duolingo_tips.json');
fs.writeFileSync(outputPath, JSON.stringify(allTips, null, 2), 'utf-8');

console.log(`\n📊 SUMMARY`);
console.log('='.repeat(50));
console.log(`Total tips extracted: ${allTips.length}`);

// Count by level
const byLevel = allTips.reduce((acc, tip) => {
  const level = tip.level.split('-')[0];
  acc[level] = (acc[level] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log(`\nBy Level:`);
Object.entries(byLevel).forEach(([level, count]) => {
  console.log(`  Level ${level}: ${count} tips`);
});

console.log(`\n💾 Tips saved to: ${outputPath}\n`);

// Create markdown preview
const markdownLines = ['# Japanese Learning Tips\n'];

let currentLevelGroup = '';
allTips.forEach(tip => {
  const levelGroup = tip.level.split('-')[0];
  if (levelGroup !== currentLevelGroup) {
    currentLevelGroup = levelGroup;
    markdownLines.push(`\n## Level ${levelGroup} Tips\n`);
  }

  markdownLines.push(`### ${tip.level} - ${tip.chapter}\n`);
  if (tip.title) {
    markdownLines.push(`**${tip.title}**\n`);
  }
  markdownLines.push(`${tip.content}\n`);
});

const markdownPath = path.join(__dirname, 'TIPS_PREVIEW.md');
fs.writeFileSync(markdownPath, markdownLines.join('\n'), 'utf-8');
console.log(`📝 Preview created: ${markdownPath}\n`);
