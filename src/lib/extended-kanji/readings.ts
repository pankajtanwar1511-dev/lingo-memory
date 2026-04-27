/**
 * Shared utilities for classifying and styling kanji readings across the
 * /study/kanji feature.
 *
 *   On'yomi  (音読み)  →  BLUE
 *   Kun'yomi (訓読み)  →  GREEN
 *
 * Pick these from one place so every page stays consistent.
 */

import type { ExtendedKanji } from '@/types/extended-kanji';

export type ReadingType = 'on' | 'kun' | 'mixed' | 'unknown';

/** Canonical Tailwind class bundles. Use the same strings everywhere. */
export const READING_STYLES: Record<
  'on' | 'kun',
  {
    text: string;
    bg: string;
    border: string;
    chip: string; // compact pill
    label: string;
  }
> = {
  on: {
    text: 'text-blue-900 dark:text-blue-100',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-900/30',
    chip:
      'bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-900/40',
    label: '音 On',
  },
  kun: {
    text: 'text-green-900 dark:text-green-100',
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-900/30',
    chip:
      'bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-100 border border-green-200 dark:border-green-900/40',
    label: '訓 Kun',
  },
};

/** Convert any katakana codepoints to their hiragana equivalents. */
export function toHiragana(s: string): string {
  return s.replace(/[ァ-ヶ]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0x60),
  );
}

/** Extract base forms from teacher-notation readings like "おお (きい)" or "サン、ザン".
 * - Splits on Japanese or Western comma
 * - Drops parenthetical endings (both half-width and full-width)
 * - Strips leading/trailing hyphens and whitespace
 * - Normalizes to hiragana so on-readings in katakana become comparable
 * Returns a deduplicated list of hiragana base forms.
 */
function baseForms(raw: string[]): string[] {
  const out = new Set<string>();
  for (const r of raw) {
    for (const chunk of r.split(/[、,]/)) {
      const trimmed = chunk.trim().split(/[\s(（]/)[0].replace(/^-|-$/g, '');
      if (!trimmed) continue;
      const hira = toHiragana(trimmed);
      if (hira.length > 0) out.add(hira);
    }
  }
  return [...out];
}

function longestMatch(norm: string, bases: string[]): string {
  let best = '';
  for (const b of bases) {
    if (b.length > 0 && norm.includes(b) && b.length > best.length) best = b;
  }
  return best;
}

/**
 * Classify how the parent kanji is being read in a compound word.
 *
 * Heuristic: normalize the word's reading to hiragana, then take the longest
 * matching base on each side (on vs kun). The side with the longer match wins.
 * This prevents noisy single-character kun bases (like い, お, き) from
 * outweighing a solid two-character on-reading.
 *
 *   onBest > kunBest  →  'on'
 *   kunBest > onBest  →  'kun'
 *   tie (both non-empty, same length)  →  'mixed'
 *   neither matches   →  'unknown'
 */
export function classifyReading(
  reading: string,
  kanji: Pick<ExtendedKanji, 'onReadings' | 'kunReadings'>,
): ReadingType {
  if (!reading) return 'unknown';
  const norm = toHiragana(reading);
  const onBest = longestMatch(norm, baseForms(kanji.onReadings));
  const kunBest = longestMatch(norm, baseForms(kanji.kunReadings));
  if (onBest.length > kunBest.length) return 'on';
  if (kunBest.length > onBest.length) return 'kun';
  if (onBest.length > 0 && kunBest.length > 0) return 'mixed';
  return 'unknown';
}

/** Style helpers so callers don't have to branch on the enum. */
export function readingTypeStyle(
  t: ReadingType,
): (typeof READING_STYLES)['on'] | null {
  if (t === 'on') return READING_STYLES.on;
  if (t === 'kun') return READING_STYLES.kun;
  return null;
}

/** Is a single character a CJK ideograph (kanji)? */
export function isKanjiChar(ch: string): boolean {
  if (!ch) return false;
  const code = ch.codePointAt(0);
  if (code === undefined) return false;
  // Common CJK Unified Ideographs + Extension A
  return (code >= 0x4e00 && code <= 0x9fff) || (code >= 0x3400 && code <= 0x4dbf);
}

/**
 * Classify each character of a word by on/kun usage.
 *
 * For kanji chars that exist in our taught set, run `classifyReading` using
 * the whole word's reading against that kanji's own on/kun bases. Chars that
 * aren't in the taught set (including kana and non-taught kanji like 好, 言)
 * get 'unknown' so the caller can render them neutrally.
 */
export function classifyPerCharacter(
  word: string,
  reading: string,
  byChar: Record<string, Pick<ExtendedKanji, 'onReadings' | 'kunReadings'>>,
): { char: string; type: ReadingType; isKanji: boolean; taught: boolean }[] {
  return Array.from(word).map((char) => {
    const isK = isKanjiChar(char);
    const k = byChar[char];
    if (!isK) return { char, type: 'unknown' as ReadingType, isKanji: false, taught: false };
    if (!k) return { char, type: 'unknown' as ReadingType, isKanji: true, taught: false };
    return { char, type: classifyReading(reading, k), isKanji: true, taught: true };
  });
}
