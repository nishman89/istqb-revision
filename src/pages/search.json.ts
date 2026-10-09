/**
 * Build-time search index: one entry per topic (### heading) in the chapter notes, plus the
 * other main pages. Served as /search.json and loaded by the header search box on first use.
 */
import type { APIRoute } from 'astro';
import GithubSlugger from 'github-slugger';
import { getChapters } from '../lib/data';

export interface SearchEntry {
  title: string;
  where: string;
  path: string;
  text: string;
}

/** Markdown/MDX → plain words (good enough for matching and a short snippet). */
function plain(md: string): string {
  return md
    .replace(/<SyllabusText>[\s\S]*?<\/SyllabusText>/g, ' ')
    .replace(/<div slot="answer">[\s\S]*?<\/div>/g, ' ') // don't give exercise answers away in search
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/[*_`#|>]/g, ' ')
    .replace(/(^|\s)-\s/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = async () => {
  const entries: SearchEntry[] = [];
  for (const chapter of await getChapters()) {
    const slugger = new GithubSlugger(); // same slugs Astro gives the headings
    let section = '';
    const parts = (chapter.body ?? '').split(/^(?=#{2,3} )/m);
    for (const part of parts) {
      const heading = part.match(/^(#{2,3}) (.*)$/m);
      if (!heading) continue;
      const [, level, title] = heading;
      const slug = slugger.slug(title);
      if (level === '##') { section = title; continue; }
      entries.push({
        title,
        where: `Chapter ${chapter.data.number}${section ? ` · ${section}` : ''}`,
        path: `chapters/${chapter.data.number}/#${slug}`,
        text: plain(part.slice(heading[0].length)).slice(0, 400),
      });
    }
  }
  const pages: [string, string, string][] = [
    ['Introduction to the ISTQB', 'introduction', 'What the ISTQB is, the exam, how marks are granted, K-levels'],
    ['Exam tips', 'exam-tips', 'Exam technique, the 8 calculation topics, key words, question formats'],
    ['Practise K1 questions', 'practice/k1', 'All K1 (remember) questions from Sample Papers A-D'],
    ['Practise K2 questions', 'practice/k2', 'All K2 (understand) questions from Sample Papers A-D'],
    ['Practise K3 questions', 'practice/k3', 'All K3 (apply) calculation questions from Sample Papers A-D'],
    ['Sample papers', 'past-papers', 'Full timed Sample Papers A, B, C and D, and practice by chapter or K-level'],
    ['Handouts', 'handouts', 'Download the chapter handouts and practice workbook (PDF)'],
  ];
  for (const [title, path, text] of pages) entries.push({ title, where: 'Page', path, text });
  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json' } });
};
