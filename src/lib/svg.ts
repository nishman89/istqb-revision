/** Helpers for the hand-built SVG diagrams. */

/** Greedy word-wrap for SVG text, which has no automatic wrapping. */
export function wrap(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && (line + ' ' + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Alternating Sparta fills for a run of boxes. */
export const fills = ['b-pink', 'b-dark'] as const;
