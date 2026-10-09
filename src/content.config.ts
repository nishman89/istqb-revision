import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** One MDX page per syllabus chapter, generated from the Sparta slide decks. */
const chapters = defineCollection({
  loader: glob({ pattern: 'chapter-*.mdx', base: './src/content/chapters' }),
  schema: z.object({
    number: z.number().int().min(1).max(6),
    title: z.string(),
    minutes: z.number().int(),
    summary: z.string(),
    objectives: z.array(z.string()),
  }),
});

const block = z.discriminatedUnion('t', [
  z.object({ t: z.literal('p'), text: z.string() }),
  z.object({ t: z.literal('formula'), text: z.string() }),
  z.object({ t: z.literal('list'), items: z.array(z.object({ marker: z.string(), text: z.string(), sub: z.array(z.string()).optional() })) }),
  z.object({ t: z.literal('table'), rows: z.array(z.array(z.string())) }),
  z.object({ t: z.literal('box'), lines: z.array(z.string()) }),
  z.object({ t: z.literal('img'), src: z.string() }),
]);

const question = z
  .object({
    id: z.string(),
    exam: z.enum(['A', 'B', 'C', 'D']),
    n: z.number().int(),
    chapter: z.number().int().min(1).max(6),
    lo: z.string(),
    ref: z.string(),
    k: z.enum(['K1', 'K2', 'K3']),
    select: z.union([z.literal(1), z.literal(2)]),
    blocks: z.array(block),
    options: z.array(z.object({ key: z.string(), text: z.string() })).min(4),
    answer: z.array(z.string()).min(1),
    explanation: z.object({ intro: z.string(), options: z.record(z.string()) }),
  })
  // Fail the build if the data is inconsistent, rather than showing a broken question.
  .refine((q) => q.answer.length === q.select, { message: 'answer count must match "select"' })
  .refine((q) => q.answer.every((a) => q.options.some((o) => o.key === a)), { message: 'answer is not an option' });

/** One entry per ISTQB sample exam set (A-D), each holding its 40 questions. */
const exams = defineCollection({
  loader: glob({ pattern: 'exam-*.json', base: './src/data/exams' }),
  schema: z.object({
    set: z.enum(['A', 'B', 'C', 'D']),
    version: z.string(),
    questions: z.array(question).length(40),
  }),
});

export type Question = z.infer<typeof question>;

export const collections = { chapters, exams };
