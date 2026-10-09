import { getCollection } from 'astro:content';
import type { Question } from '../content.config';

/** All chapters, in syllabus order. */
export async function getChapters() {
  return (await getCollection('chapters')).sort((a, b) => a.data.number - b.data.number);
}

/** Questions from one sample exam set that target the given chapter. */
export async function getQuestions(set: string, chapter: number): Promise<Question[]> {
  const exams = await getCollection('exams');
  const exam = exams.find((e) => e.data.set === set);
  if (!exam) throw new Error(`Unknown exam set ${set}`);
  return exam.data.questions.filter((q) => q.chapter === chapter);
}

/** A whole sample exam set (all 40 questions), in paper order. */
export async function getExam(set: string) {
  const exams = await getCollection('exams');
  const exam = exams.find((e) => e.data.set === set);
  if (!exam) throw new Error(`Unknown exam set ${set}`);
  return exam.data;
}
