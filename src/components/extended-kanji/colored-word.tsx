'use client';

/**
 * Render a vocab word with each kanji character colored by its on/kun usage
 * in the given reading. Non-taught kanji and kana stay in the default color.
 *
 *   大学   (だいがく)  →  大[blue]  学[blue]
 *   大好き (だいすき)  →  大[blue]  好[neutral]  き[neutral]
 *   一人   (ひとり)    →  一[green] 人[green]
 *
 * `highlightChar` optionally adds an underline to occurrences of the anchor
 * kanji (e.g. the page's current kanji) to reinforce what the reader is
 * looking at in a cross-reference table.
 */

import type { ExtendedKanji } from '@/types/extended-kanji';
import {
  READING_STYLES,
  classifyPerCharacter,
} from '@/lib/extended-kanji/readings';

interface Props {
  word: string;
  reading: string;
  kanjiByChar: Record<
    string,
    Pick<ExtendedKanji, 'onReadings' | 'kunReadings'>
  >;
  /** If set, this kanji char gets an extra underline (used on cross-ref tables). */
  highlightChar?: string;
  className?: string;
}

export function ColoredWord({
  word,
  reading,
  kanjiByChar,
  highlightChar,
  className = '',
}: Props) {
  const parts = classifyPerCharacter(word, reading, kanjiByChar);
  return (
    <span className={className}>
      {parts.map((p, i) => {
        const isAnchor = highlightChar && p.char === highlightChar;
        let colorCls = '';
        if (p.type === 'on') colorCls = READING_STYLES.on.text;
        else if (p.type === 'kun') colorCls = READING_STYLES.kun.text;
        else if (p.type === 'mixed') colorCls = READING_STYLES.on.text;
        return (
          <span
            key={i}
            className={`${colorCls} ${isAnchor ? 'underline decoration-2 decoration-teal-500 underline-offset-4' : ''}`}
            title={
              p.isKanji
                ? p.taught
                  ? `${p.char}: ${p.type === 'on' ? 'on-yomi' : p.type === 'kun' ? 'kun-yomi' : p.type === 'mixed' ? 'mixed' : 'unclassified'}`
                  : `${p.char}: not in the 86 taught kanji`
                : undefined
            }
          >
            {p.char}
          </span>
        );
      })}
    </span>
  );
}
