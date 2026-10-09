import { getCollection } from 'astro:content';
import type { Question } from '../content.config';

/**
 * Practice sets that pool questions from all four sample papers (A-D):
 * one per K-level (k1, k2, k3) and one per chapter (chapter-1 … chapter-6).
 */
export interface PracticeSet {
  slug: string;
  title: string;
  blurb: string;
  questions: Question[];
}

const K_INFO: Record<string, { name: string; blurb: string }> = {
  K1: { name: 'Remember', blurb: 'Recall terms and facts.' },
  K2: { name: 'Understand', blurb: 'Explain, compare and classify.' },
  K3: { name: 'Apply', blurb: 'Use a technique on a scenario - the calculation questions.' },
};

export async function getPracticeSets(): Promise<PracticeSet[]> {
  const all = (await getCollection('exams')).flatMap((e) => e.data.questions);
  const byPaper = (a: Question, b: Question) => a.exam.localeCompare(b.exam) || a.n - b.n;
  const byChapter = (a: Question, b: Question) => a.chapter - b.chapter || a.ref.localeCompare(b.ref, undefined, { numeric: true }) || byPaper(a, b);
  const chapters = (await getCollection('chapters')).sort((a, b) => a.data.number - b.data.number);

  const kSets = (['K1', 'K2', 'K3'] as const).map((k) => ({
    slug: k.toLowerCase(),
    title: `${k} questions - ${K_INFO[k].name}`,
    blurb: K_INFO[k].blurb,
    questions: all.filter((q) => q.k === k).sort(byChapter),
  }));
  const chapterSets = chapters.map(({ data }) => ({
    slug: `chapter-${data.number}`,
    title: `Chapter ${data.number}: ${data.title}`,
    blurb: `Every Chapter ${data.number} question from Sample Papers A-D.`,
    questions: all.filter((q) => q.chapter === data.number).sort(byPaper),
  }));
  return [...kSets, ...chapterSets];
}
