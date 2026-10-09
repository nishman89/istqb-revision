/**
 * The Sparta Global chapter handouts (one-page summary sheets) and the practice workbook,
 * served as downloadable PDFs from public/handouts/.
 *
 * Each handout is divided into lettered boxes (A, B, C…). BOXES maps a syllabus section to the
 * box that covers it, so every topic in the notes can point to the matching part of its handout.
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

interface Box { letter: string; title: string; page: number }

/** Boxes on each chapter handout, with the page they're on. */
export const BOX_TITLES: Record<number, Box[]> = {
  1: [
    { letter: 'A', title: 'What is testing? Test objectives', page: 1 }, { letter: 'B', title: 'Errors, defects, failures, root causes', page: 1 },
    { letter: 'C', title: 'Seven testing principles', page: 1 }, { letter: 'D', title: 'Testing vs debugging', page: 1 },
    { letter: 'E', title: 'Why is testing necessary?', page: 1 }, { letter: 'F', title: 'Testing and quality assurance', page: 1 },
    { letter: 'G', title: 'Test activities and testware', page: 2 }, { letter: 'H', title: 'Context and traceability', page: 2 },
    { letter: 'I', title: 'Roles and skills', page: 2 }, { letter: 'J', title: 'Whole team approach', page: 2 },
    { letter: 'K', title: 'Independence of testing', page: 2 }, { letter: 'L', title: 'Key terms', page: 2 },
  ],
  2: [
    { letter: 'A', title: 'SDLC models', page: 1 }, { letter: 'B', title: "Royce's waterfall model", page: 1 },
    { letter: 'C', title: 'The V-model', page: 1 }, { letter: 'D', title: 'Unified Process', page: 1 },
    { letter: 'E', title: 'Agile methodologies', page: 2 }, { letter: 'F', title: 'Impact of the SDLC on testing', page: 2 },
    { letter: 'G', title: 'Good testing practices for any SDLC', page: 2 }, { letter: 'H', title: 'Testing as a driver for development', page: 2 },
    { letter: 'I', title: 'DevOps and testing', page: 2 }, { letter: 'J', title: 'Shift left', page: 3 },
    { letter: 'K', title: 'Retrospectives', page: 3 }, { letter: 'L', title: 'Test levels vs test types', page: 3 },
    { letter: 'M', title: 'The five test levels', page: 3 }, { letter: 'N', title: 'Test types', page: 4 },
    { letter: 'O', title: 'Confirmation and regression testing', page: 4 }, { letter: 'P', title: 'Maintenance testing', page: 4 },
  ],
  3: [
    { letter: 'A', title: 'Static vs dynamic testing', page: 1 }, { letter: 'B', title: 'Review process (ISO/IEC 20246)', page: 1 },
    { letter: 'C', title: 'Static testing basics', page: 1 }, { letter: 'D', title: 'Early and frequent stakeholder feedback', page: 1 },
    { letter: 'E', title: 'Review roles', page: 1 }, { letter: 'F', title: 'Value of static testing', page: 1 },
    { letter: 'G', title: 'Review types', page: 1 }, { letter: 'H', title: 'Success factors for reviews', page: 1 },
  ],
  4: [
    { letter: 'A', title: 'Test techniques overview', page: 1 }, { letter: 'B', title: 'Boundary value analysis', page: 1 },
    { letter: 'C', title: 'Equivalence partitioning', page: 1 }, { letter: 'D', title: 'Decision table testing', page: 1 },
    { letter: 'E', title: 'State transition testing', page: 2 }, { letter: 'F', title: 'Experience-based techniques', page: 2 },
    { letter: 'G', title: 'ATDD', page: 2 }, { letter: 'H', title: 'Collaborative user stories', page: 2 },
    { letter: 'I', title: 'Statement and branch testing', page: 2 }, { letter: 'J', title: 'Value of white-box testing', page: 2 },
    { letter: 'K', title: 'Acceptance criteria', page: 2 },
  ],
  5: [
    { letter: 'A', title: 'Test planning', page: 1 }, { letter: 'B', title: 'Test case prioritisation', page: 1 },
    { letter: 'C', title: 'Testing quadrants', page: 1 }, { letter: 'D', title: 'Entry and exit criteria', page: 1 },
    { letter: 'E', title: 'Estimation techniques', page: 1 }, { letter: 'F', title: 'Test pyramid', page: 1 },
    { letter: 'G', title: 'Monitoring, control and metrics', page: 2 }, { letter: 'H', title: 'Configuration management', page: 2 },
    { letter: 'I', title: 'Defect management and reports', page: 2 }, { letter: 'J', title: 'Risk and risk level', page: 2 },
    { letter: 'K', title: 'Project vs product risks', page: 2 }, { letter: 'L', title: 'Product risk analysis and control', page: 2 },
    { letter: 'M', title: 'Test reports and communication', page: 2 },
  ],
  6: [{ letter: 'A', title: 'Tool support for testing', page: 1 }, { letter: 'B', title: 'Benefits and risks of test automation', page: 1 }],
};

/** Syllabus section → handout box letter. */
const BOXES: Record<string, string> = {
  '1.1': 'A', '1.1.1': 'A', '1.1.2': 'D', '1.2': 'E', '1.2.1': 'E', '1.2.2': 'F', '1.2.3': 'B', '1.3': 'C',
  '1.4.1': 'G', '1.4.2': 'H', '1.4.3': 'G', '1.4.4': 'H', '1.4.5': 'I', '1.5.1': 'I', '1.5.2': 'J', '1.5.3': 'K',
  '2.1': 'A', '2.1.1': 'F', '2.1.2': 'G', '2.1.3': 'H', '2.1.4': 'I', '2.1.5': 'J', '2.1.6': 'K',
  '2.2': 'L', '2.2.1': 'M', '2.2.2': 'N', '2.2.3': 'O', '2.3': 'P',
  '3.1': 'C', '3.1.1': 'C', '3.1.2': 'F', '3.1.3': 'A', '3.2.1': 'D', '3.2.2': 'B', '3.2.3': 'E', '3.2.4': 'G', '3.2.5': 'H',
  '4.1': 'A', '4.2.1': 'C', '4.2.2': 'B', '4.2.3': 'D', '4.2.4': 'E', '4.3': 'I', '4.3.1': 'I', '4.3.2': 'I', '4.3.3': 'J',
  '4.4.1': 'F', '4.4.2': 'F', '4.4.3': 'F', '4.5.1': 'H', '4.5.2': 'K', '4.5.3': 'G',
  '5.1': 'A', '5.1.1': 'A', '5.1.2': 'A', '5.1.3': 'D', '5.1.4': 'E', '5.1.5': 'B', '5.1.6': 'F', '5.1.7': 'C',
  '5.2': 'J', '5.2.1': 'J', '5.2.2': 'K', '5.2.3': 'L', '5.2.4': 'L', '5.3': 'G', '5.3.1': 'G', '5.3.2': 'M', '5.3.3': 'M',
  '5.4': 'H', '5.5': 'I', '6.1': 'A', '6.2': 'B',
};

export const handoutUrl = (h: Handout) => url(`handouts/${h.file}`);
export const chapterHandout = (chapter: number) => HANDOUTS.find((h) => h.chapter === chapter)!;
export const workbook = HANDOUTS.find((h) => h.chapter === null)!;

/** The handout box for a syllabus section (optionally overridden), with a link that opens the PDF at the right page. */
export function boxFor(ref: string, override?: string) {
  const chapter = Number(ref.split('.')[0]);
  const letter = override ?? BOXES[ref];
  const box = BOX_TITLES[chapter]?.find((b) => b.letter === letter);
  if (!box) return null;
  return { chapter, ...box, href: `${handoutUrl(chapterHandout(chapter))}#page=${box.page}` };
}
