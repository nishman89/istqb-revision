/**
 * The Sparta Global chapter handouts (one-page summary sheets) and the practice workbook,
 * served as downloadable PDFs from public/handouts/.
 *
 */
import { url } from '../lib/site';

export interface Handout {
  chapter: number | null; // null = the practice workbook
  title: string;
  file: string;
  pages: number;
}

export const HANDOUTS: Handout[] = [
  { chapter: 1, title: 'Fundamentals of Testing', file: 'chapter-1-fundamentals-of-testing.pdf', pages: 2 },
  { chapter: 2, title: 'Testing Throughout the SDLC', file: 'chapter-2-testing-throughout-the-sdlc.pdf', pages: 4 },
  { chapter: 3, title: 'Static Testing', file: 'chapter-3-static-testing.pdf', pages: 1 },
  { chapter: 4, title: 'Test Analysis and Design', file: 'chapter-4-test-analysis-and-design.pdf', pages: 2 },
  { chapter: 5, title: 'Managing the Test Activities', file: 'chapter-5-managing-the-test-activities.pdf', pages: 2 },
  { chapter: 6, title: 'Test Tools', file: 'chapter-6-test-tools.pdf', pages: 1 },
  { chapter: null, title: 'Practice Workbook', file: 'practice-workbook.pdf', pages: 3 },
];

export const handoutUrl = (h: Handout) => url(`handouts/${h.file}`);
export const chapterHandout = (chapter: number) => HANDOUTS.find((h) => h.chapter === chapter)!;
export const workbook = HANDOUTS.find((h) => h.chapter === null)!;
