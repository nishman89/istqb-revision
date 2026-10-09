/** Site-wide constants and helpers. */

export const PASS_MARK = 0.65;
export const MAIN_SET = 'C';
export const PRACTICE_SETS = ['A', 'B', 'D'] as const;

/** Official CTFL v4.0 split: questions per chapter in every exam (ISTQB Exam Structure Tables). */
export const QUESTIONS_PER_CHAPTER: Record<number, number> = { 1: 8, 2: 6, 3: 4, 4: 11, 5: 9, 6: 2 };

/** Suggested minutes per question by K-level (ISTQB Exam Structures and Rules, section 6.1). */
export const MINUTES_PER_K: Record<string, number> = { K1: 1, K2: 1.5, K3: 3 };

/** Prefix an internal path with the deployment base (e.g. /istqb-ctfl/ on GitHub Pages). */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  const needsSlash = clean !== '' && !clean.includes('.') && !clean.includes('#') && !clean.endsWith('/');
  return `${base}/${clean}${needsSlash ? '/' : ''}`;
}

/** "20 min", "3 h", "6.5 h" */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round((minutes / 60) * 10) / 10;
  return `${hours} h`;
}
