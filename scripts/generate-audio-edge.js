#!/usr/bin/env ts-node
"use strict";
/**
 * Audio Generation Script using Microsoft Edge TTS (FREE!)
 *
 * Uses Microsoft Edge's TTS service - NO API KEY, NO PAYMENT INFO REQUIRED!
 *
 * Generates audio files for:
 * - All vocabulary words (kana)
 * - All example sentences (japanese)
 *
 * Prerequisites:
 * - npm install edge-tts
 *
 * Usage:
 *   npm run generate:audio -- --input public/seed-data/n5-comprehensive.json --output-dir public/audio/n5
 *
 * Cost: 100% FREE, no limits!
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    red: '\x1b[31m',
};
function log(msg, color) {
    const c = color && colors[color] ? colors[color] : '';
    console.log(`${c}${msg}${colors.reset}`);
}
/**
 * Generate audio file using Edge-TTS
 */
async function generateAudio(text, outputPath, voice = 'ja-JP-NanamiNeural') {
    try {
        // Use edge-tts command line (Python version)
        const command = `edge-tts --voice "${voice}" --text "${text.replace(/"/g, '\\"')}" --write-media "${outputPath}"`;
        (0, child_process_1.execSync)(command, { stdio: 'pipe' });
    }
    catch (error) {
        throw new Error(`Failed to generate audio: ${error}`);
    }
}
/**
 * Sleep for specified milliseconds (rate limiting)
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Main function
 */
async function main() {
    const args = process.argv.slice(2);
    let inputPath = 'public/seed-data/n5-comprehensive.json';
    let outputDir = 'public/audio/n5';
    let dryRun = false;
    let skipExisting = true;
    let voice = 'ja-JP-NanamiNeural'; // Female voice
    // Other options: ja-JP-KeitaNeural (Male), ja-JP-AoiNeural (Female)
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--input')
            inputPath = args[++i];
        else if (args[i] === '--output-dir')
            outputDir = args[++i];
        else if (args[i] === '--dry-run')
            dryRun = true;
        else if (args[i] === '--force')
            skipExisting = false;
        else if (args[i] === '--voice')
            voice = args[++i];
    }
    log('🎙️  Audio Generation with Microsoft Edge TTS (FREE!)', 'cyan');
    log(`   Input: ${inputPath}`);
    log(`   Output: ${outputDir}`);
    log(`   Voice: ${voice}`);
    log(`   Dry run: ${dryRun}`);
    log(`   Skip existing: ${skipExisting}\n`);
    // Create output directory
    await fs.promises.mkdir(outputDir, { recursive: true });
    await fs.promises.mkdir(path.join(outputDir, 'examples'), { recursive: true });
    // Load vocabulary data
    log('📥 Loading vocabulary data...', 'cyan');
    const content = await fs.promises.readFile(inputPath, 'utf-8');
    const data = JSON.parse(content);
    log(`✅ Loaded ${data.vocabulary.length} cards\n`, 'green');
    // Statistics
    let vocabGenerated = 0;
    let vocabSkipped = 0;
    let examplesGenerated = 0;
    let examplesSkipped = 0;
    let totalChars = 0;
    let errors = 0;
    // Generate audio for each vocabulary word
    log('🎤 Generating vocabulary audio...', 'cyan');
    for (const card of data.vocabulary) {
        const audioPath = path.join(outputDir, `${card.id}.mp3`);
        if (skipExisting && fs.existsSync(audioPath)) {
            vocabSkipped++;
            continue;
        }
        totalChars += card.kana.length;
        if (dryRun) {
            log(`  [DRY RUN] Would generate: ${card.id}.mp3 (${card.kana})`, 'yellow');
            vocabGenerated++;
        }
        else {
            try {
                await generateAudio(card.kana, audioPath, voice);
                vocabGenerated++;
                if (vocabGenerated % 50 === 0) {
                    log(`  Generated ${vocabGenerated}/${data.vocabulary.length} vocab audio files...`, 'cyan');
                }
                // Rate limiting - small delay to be nice to the service
                await sleep(100);
            }
            catch (error) {
                log(`  ❌ Error generating ${card.id}: ${error}`, 'red');
                errors++;
            }
        }
    }
    log(`✅ Vocabulary audio: ${vocabGenerated} generated, ${vocabSkipped} skipped\n`, 'green');
    // Generate audio for example sentences
    log('🎤 Generating example audio...', 'cyan');
    for (const card of data.vocabulary) {
        if (!card.examples || card.examples.length === 0)
            continue;
        for (let i = 0; i < card.examples.length; i++) {
            const example = card.examples[i];
            const examplePath = path.join(outputDir, 'examples', `${card.id}_ex${i + 1}.mp3`);
            if (skipExisting && fs.existsSync(examplePath)) {
                examplesSkipped++;
                continue;
            }
            totalChars += example.japanese.length;
            if (dryRun) {
                log(`  [DRY RUN] Would generate: ${card.id}_ex${i + 1}.mp3 (${example.japanese})`, 'yellow');
                examplesGenerated++;
            }
            else {
                try {
                    await generateAudio(example.japanese, examplePath, voice);
                    examplesGenerated++;
                    if (examplesGenerated % 100 === 0) {
                        log(`  Generated ${examplesGenerated}/~1368 example audio files...`, 'cyan');
                    }
                    // Rate limiting
                    await sleep(100);
                }
                catch (error) {
                    log(`  ❌ Error generating ${card.id}_ex${i + 1}: ${error}`, 'red');
                    errors++;
                }
            }
        }
    }
    log(`✅ Example audio: ${examplesGenerated} generated, ${examplesSkipped} skipped\n`, 'green');
    // Summary
    log('📊 Summary:', 'cyan');
    log(`   Vocabulary audio: ${vocabGenerated} generated, ${vocabSkipped} skipped`);
    log(`   Example audio: ${examplesGenerated} generated, ${examplesSkipped} skipped`);
    log(`   Total audio files: ${vocabGenerated + examplesGenerated}`);
    log(`   Total characters: ${totalChars.toLocaleString()}`);
    log(`   Cost: $0.00 (100% FREE!)`);
    log(`   Errors: ${errors}\n`);
    if (dryRun) {
        log('🔔 This was a dry run. Use without --dry-run to generate actual audio.', 'yellow');
    }
    else {
        log('🎉 Audio generation complete!', 'green');
        log('\n📝 Next step: Run "npm run link:audio" to add audio URLs to seed data');
    }
}
main().catch(err => {
    log(`\n❌ Error: ${err.message}`, 'red');
    console.error(err);
    process.exit(1);
});
