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

import { useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ExtendedKanji, SentenceRuby } from '@/types/extended-kanji';
import {
  READING_STYLES,
  isKanjiChar,
} from '@/lib/extended-kanji/readings';

interface Props {
  japanese: string;
  english?: string;
  kanjiByChar: Record<string, ExtendedKanji>;
  /** Optional inline rubies sourced from KANJI_REFERENCE_v2.md. When present
   * each ruby covers a contiguous span of characters and provides the
   * context-correct reading for that span. The component uses these instead
   * of guessing kun-vs-on per character. */
  rubies?: SentenceRuby[];
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
  rubies,
  highlightChar,
  footer,
  bare = false,
  className = '',
}: Props) {
  const chars = Array.from(japanese);

  /** Build a per-character lookup of "this position belongs to ruby span K".
   * Map char-index → ruby (or undefined). Null when no rubies are provided. */
  const rubyByChar = useMemo(() => {
    if (!rubies || rubies.length === 0) return null;
    const arr: (SentenceRuby | undefined)[] = new Array(chars.length).fill(undefined);
    for (const r of rubies) {
      for (let i = r.start; i < r.end && i < arr.length; i++) {
        arr[i] = r;
      }
    }
    return arr;
  }, [rubies, chars.length]);

  /** When rubies are present, the toggle unit is the ruby span — toggling
   * any one character in the span reveals/hides the whole span's reading.
   * When rubies are absent, fall back to per-character indexing as before. */
  const groupKey = (i: number): string => {
    if (rubyByChar) {
      const r = rubyByChar[i];
      if (r) return `r:${r.start}-${r.end}`;
    }
    return `c:${i}`;
  };

  const taughtGroupKeys: string[] = [];
  if (rubyByChar) {
    const seen = new Set<string>();
    for (const r of rubies!) {
      const key = `r:${r.start}-${r.end}`;
      if (!seen.has(key)) {
        seen.add(key);
        taughtGroupKeys.push(key);
      }
    }
    // Plus any taught kanji not covered by a ruby — fall back to per-char
    chars.forEach((c, i) => {
      if (rubyByChar[i]) return;
      if (isKanjiChar(c) && kanjiByChar[c]) taughtGroupKeys.push(`c:${i}`);
    });
  } else {
    chars.forEach((c, i) => {
      if (isKanjiChar(c) && kanjiByChar[c]) taughtGroupKeys.push(`c:${i}`);
    });
  }

  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const toggle = (i: number) => {
    const key = groupKey(i);
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const revealAll = () => setRevealed(new Set(taughtGroupKeys));
  const hideAll = () => setRevealed(new Set());
  const allShown = revealed.size === taughtGroupKeys.length && taughtGroupKeys.length > 0;

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
            const r = rubyByChar?.[i];
            // If this position is mid-ruby (not the first char of its span),
            // render only the kanji glyph — the ruby reading was already
            // rendered above the span's first char.
            const isRubyContinuation = r && i > r.start;
            const isAnchor = highlightChar && ch === highlightChar;

            // Non-taught chars with no ruby: keep baseline alignment.
            if (!r && !(isKanjiChar(ch) && k)) {
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

            const key = groupKey(i);
            const isRevealed = revealed.has(key);

            // ----- Ruby-driven path (v2 inline rubies) -----
            if (r) {
              if (isRubyContinuation) {
                // Just the glyph — the parent span owns the ruby slot
                return (
                  <span
                    key={i}
                    className="inline-flex flex-col items-center leading-none"
                  >
                    <span className="h-5 mb-1.5" aria-hidden />
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      className={`font-semibold cursor-pointer transition-colors hover:bg-accent rounded px-0.5 leading-none ${
                        isAnchor
                          ? 'underline decoration-2 decoration-teal-500 underline-offset-4'
                          : ''
                      }`}
                      title={`Tap to ${isRevealed ? 'hide' : 'reveal'} reading`}
                    >
                      {ch}
                    </button>
                  </span>
                );
              }
              // First char of a ruby span — render the reading above the
              // entire span. Span width derives naturally from the chars
              // sitting next to this one in the same flex row; the absolute-
              // positioned ruby is anchored to the first char and centered
              // visually across the run.
              const spanLength = r.end - r.start;
              return (
                <span
                  key={i}
                  className="relative inline-flex flex-col items-center leading-none"
                >
                  <span
                    className={`absolute -top-5 left-0 h-5 text-[11px] font-medium leading-none whitespace-nowrap text-foreground/80 transition-opacity duration-150 ${
                      isRevealed ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      // Center the ruby horizontally across the span by
                      // translating left by half the (n-1) glyphs that follow
                      transform: `translateX(${(spanLength - 1) * 0.5}em)`,
                    }}
                    aria-hidden={!isRevealed}
                  >
                    {r.reading}
                  </span>
                  <span className="h-5 mb-1.5" aria-hidden />
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className={`font-semibold cursor-pointer transition-colors hover:bg-accent rounded px-0.5 leading-none ${
                      isAnchor
                        ? 'underline decoration-2 decoration-teal-500 underline-offset-4'
                        : ''
                    }`}
                    title={`Tap to ${isRevealed ? 'hide' : 'reveal'} reading`}
                  >
                    {ch}
                  </button>
                </span>
              );
            }

            // ----- Fallback: no ruby for this char, but it's a taught kanji.
            // Show both primary kun (green) and primary on (blue) so the
            // reader can pick whichever fits in context. -----
            const cleanReading = (raw: string): string =>
              raw.split(/[\s(（]/)[0].replace(/^-|-$/g, '').trim();
            const kun = k!.kunReadings[0] ? cleanReading(k!.kunReadings[0]) : '';
            const on = k!.onReadings[0] ? cleanReading(k!.onReadings[0]) : '';

            return (
              <span
                key={i}
                className="inline-flex flex-col items-center leading-none"
              >
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
        {taughtGroupKeys.length > 0 && (
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
