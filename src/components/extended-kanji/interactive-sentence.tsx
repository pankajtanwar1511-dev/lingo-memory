'use client';

/**
 * <InteractiveSentence> — render a Japanese sentence where each kanji in the
 * 86-set is clickable. Tap a kanji and its on/kun readings appear above it as
 * ruby-text and stay visible until tapped again.
 *
 * Reused on:
 *   - kanji detail page "Example sentences" card
 *   - kanji detail page "Also appears in sentences" card
 *   - /study/extended-kanji/sentences master browser
 *
 * Pure runtime — no data changes. Reading source is each kanji's own
 * onReadings/kunReadings arrays. Anchor kanji (the page's subject) gets a
 * teal underline so it's still findable in cross-ref lists.
 */

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ExtendedKanji } from '@/types/extended-kanji';
import {
  READING_STYLES,
  isKanjiChar,
} from '@/lib/extended-kanji/readings';

interface Props {
  japanese: string;
  english?: string;
  kanjiByChar: Record<string, ExtendedKanji>;
  /** Anchor kanji to underline (e.g. on cross-ref tables). */
  highlightChar?: string;
  /** Optional small footer slot for source/parent badges. */
  footer?: React.ReactNode;
  /** Strip card chrome (border, bg, padding) — used by Reader-mode lists. */
  bare?: boolean;
  className?: string;
}

export function InteractiveSentence({
  japanese,
  english,
  kanjiByChar,
  highlightChar,
  footer,
  bare = false,
  className = '',
}: Props) {
  const chars = Array.from(japanese);
  const taughtIndexes = chars
    .map((c, i) => (isKanjiChar(c) && kanjiByChar[c] ? i : -1))
    .filter((i) => i >= 0);

  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const revealAll = () => setRevealed(new Set(taughtIndexes));
  const hideAll = () => setRevealed(new Set());
  const allShown = revealed.size === taughtIndexes.length && taughtIndexes.length > 0;

  return (
    <div
      className={
        bare
          ? `space-y-3 ${className}`
          : `px-5 pt-7 pb-5 rounded-lg bg-white dark:bg-slate-900 border border-border space-y-3 ${className}`
      }
    >
      <div className="flex items-start justify-between gap-3">
        {/* Sentence with click-to-reveal furigana. Each character is its own
          inline-flex column with a fixed-height ruby slot above the glyph,
          so revealed readings never collapse into one another. Lines have
          generous row-gap so a wrapped second line's ruby doesn't crash
          into the previous line's glyphs. */}
        <div className="flex flex-wrap items-end gap-x-0.5 gap-y-4 text-2xl select-text leading-none">
          {chars.map((ch, i) => {
            const k = kanjiByChar[ch];
            const isTaught = isKanjiChar(ch) && k;
            const isAnchor = highlightChar && ch === highlightChar;
            const isRevealed = revealed.has(i);

            // Non-taught chars: still occupy the same vertical space so the
            // baseline stays aligned with their taught siblings.
            if (!isTaught) {
              return (
                <span
                  key={i}
                  className="inline-flex flex-col items-center leading-none"
                >
                  <span className="h-5 mb-1.5" aria-hidden />
                  <span className="font-medium">{ch}</span>
                </span>
              );
            }

            // Strip teacher notation suffixes like "おお (きい)" → "おお" so the
            // ruby reads cleanly. Show BOTH primary kun and primary on rather
            // than guessing which fits in this sentence — without word-level
            // context we can't pick correctly (e.g. 七五三 wants on-yomi
            // しちごさん, while 七人 wants on-yomi しち and 一人 wants kun-yomi
            // ひと). Showing both lets the reader pick.
            const cleanReading = (r: string): string =>
              r.split(/[\s(（]/)[0].replace(/^-|-$/g, '').trim();
            const kun = k!.kunReadings[0] ? cleanReading(k!.kunReadings[0]) : '';
            const on = k!.onReadings[0] ? cleanReading(k!.onReadings[0]) : '';

            return (
              <span
                key={i}
                className="inline-flex flex-col items-center leading-none"
              >
                {/* Reserved ruby slot — fixed height so neighboring readings
                  never overlap and the kanji line stays aligned. Renders both
                  primary on (blue) and primary kun (green), separated by a
                  thin dot. */}
                <span
                  className={`h-5 mb-1.5 text-[11px] font-medium whitespace-nowrap leading-none flex items-center gap-1 transition-opacity duration-150 ${
                    isRevealed ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden={!isRevealed}
                >
                  {kun && <span className={READING_STYLES.kun.text}>{kun}</span>}
                  {kun && on && <span className="text-muted-foreground/50">·</span>}
                  {on && <span className={READING_STYLES.on.text}>{on}</span>}
                </span>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={`font-semibold cursor-pointer transition-colors hover:bg-accent rounded px-0.5 leading-none ${
                    isAnchor
                      ? 'underline decoration-2 decoration-teal-500 underline-offset-4'
                      : ''
                  }`}
                  title={`Tap to ${isRevealed ? 'hide' : 'reveal'} readings`}
                >
                  {ch}
                </button>
              </span>
            );
          })}
        </div>

        {/* Reveal-all toggle */}
        {taughtIndexes.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={allShown ? hideAll : revealAll}
            className="shrink-0 h-7 px-2 text-xs text-muted-foreground"
            title={allShown ? 'Hide all readings' : 'Reveal all readings'}
          >
            {allShown ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </div>

      {english && (
        <div className="text-sm text-muted-foreground italic">— {english}</div>
      )}

      {footer && <div className="pt-1">{footer}</div>}
    </div>
  );
}
