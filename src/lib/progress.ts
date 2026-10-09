/**
 * Learner progress, kept in the browser's localStorage.
 * Nothing leaves the device: no server, no cookies, no tracking.
 */

const KEY = 'sparta-ctfl-progress';

export interface QuizAttempt {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  date: string;
  answers: Record<string, string[]>;
  /** Time taken, for timed mock exams. */
  seconds?: number;
}

export interface QuizRecord {
  attempts: number;
  best: QuizAttempt;
  last: QuizAttempt;
}

export interface LastVisit {
  chapter: number;
  slug: string;
  title: string;
}

export interface Progress {
  version: 1;
  chaptersRead: number[];
  quizzes: Record<string, QuizRecord>;
  /** The topic the learner was last reading, for "Continue where you left off". */
  lastVisit?: LastVisit;
}

const empty = (): Progress => ({ version: 1, chaptersRead: [], quizzes: {} });

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? (JSON.parse(raw) as Progress) : null;
    return data?.version === 1 ? data : empty();
  } catch {
    return empty(); // storage blocked (e.g. some private-browsing modes)
  }
}

function save(progress: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    /* ignore - progress simply won't persist */
  }
}

export function markChapterRead(chapter: number): void {
  const p = loadProgress();
  if (!p.chaptersRead.includes(chapter)) p.chaptersRead.push(chapter);
  save(p);
}

export function saveLastVisit(visit: LastVisit): void {
  const p = loadProgress();
  p.lastVisit = visit;
  save(p);
}

export function isChapterRead(chapter: number): boolean {
  return loadProgress().chaptersRead.includes(chapter);
}

export function getQuiz(quizId: string): QuizRecord | undefined {
  return loadProgress().quizzes[quizId];
}

export function saveQuizAttempt(quizId: string, attempt: QuizAttempt): QuizRecord {
  const p = loadProgress();
  const prev = p.quizzes[quizId];
  const record: QuizRecord = {
    attempts: (prev?.attempts ?? 0) + 1,
    best: !prev || attempt.percent >= prev.best.percent ? attempt : prev.best,
    last: attempt,
  };
  p.quizzes[quizId] = record;
  save(p);
  return record;
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to reset */
  }
}

export const quizId = (chapter: number, set: string) => `ch${chapter}-${set.toLowerCase()}`;
export const examId = (set: string) => `exam-${set.toLowerCase()}`;
