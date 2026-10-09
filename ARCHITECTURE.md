# Architecture

This document explains how the Sparta Global ISTQB CTFL study site is put together. It covers why it's built
this way, how the pieces fit, and how to make common changes safely. It's written for a developer picking the
project up for the first time. For setup and day-to-day editing, start with the [README](README.md).

---

## 1. The big picture

The site is a **static site** built with [Astro](https://astro.build) and hosted on **GitHub Pages**.

```
 Content (Markdown + JSON)  ──►  Astro build (npm run build)  ──►  Plain HTML/CSS/JS in dist/  ──►  GitHub Pages
        you edit this               runs on GitHub Actions             what visitors download
```

- **Everything is decided at build time.** Astro reads the chapter notes and exam data, validates them, and turns
  every page into a ready-made HTML file. There is no server and no database at runtime.
- **JavaScript is only used where it's needed:** marking quizzes, the exam timer, collapsible menus, and saving progress.
  Reading pages work with JavaScript switched off.
- **Learner progress lives in the browser** (`localStorage`). Nothing is sent anywhere.

### Why these choices

| Decision | Why |
|---|---|
| **Static site, no backend** | GitHub Pages only serves files. It's free, fast, needs no maintenance, and has nothing to hack. |
| **Astro** | Built for content sites. It turns Markdown into pages, validates content with schemas, and outputs plain HTML with very little JavaScript. Components let the header, quiz and diagrams be written once. |
| **MDX for notes** | Markdown that also accepts components, so a chapter can contain `<VModel />` or `<SyllabusRef ref="2.1" />`. |
| **JSON for questions** | Exam questions are structured data (options, answers, explanations), not prose. JSON with a schema means a broken question fails the build instead of reaching a learner. |
| **SVG diagrams as components** | Sharp at any size, themeable with CSS, accessible, and editable in code. No image files to keep in sync. |
| **localStorage for progress** | It's the only persistence available without a server. It's private to each learner and enough for "what have I done and how did I score". |

---

## 2. How a request becomes a page

There are four kinds of page. Each is a file in `src/pages/` and gets its data from the content layer.

```
src/pages/
├── index.astro                    /                          Home: chapter cards + progress
├── introduction.astro             /introduction/             Introduction to the ISTQB
├── chapters/[chapter].astro       /chapters/1/ … /6/         Chapter notes (one MDX file each)
├── quiz/[chapter]/[set].astro     /quiz/4/c/ …               Chapter quiz (set C) or extra practice (A, B, D)
├── past-papers/index.astro        /past-papers/              List of the four sample papers
├── past-papers/[set].astro        /past-papers/c/ …          A full 40-question timed paper
├── handouts.astro                 /handouts/                 Download the chapter handouts and practice workbook
├── search.json.ts                 /search.json               Build-time search index (one entry per topic)
├── exam-tips/index.astro          /exam-tips/                Exam technique, with statistics calculated from the papers
├── exam-tips/k3.astro             /exam-tips/k3/             All 32 K3 questions, grouped by skill
└── 404.astro
```

Files with `[brackets]` are **dynamic routes**. Each exports a `getStaticPaths()` function that lists every page to
generate. For example, the quiz route builds one page for each chapter and exam set, which is 6 × 4 = 24 pages.

```ts
// src/pages/quiz/[chapter]/[set].astro (simplified)
export async function getStaticPaths() {
  const chapters = await getChapters();
  return chapters.flatMap(({ data }) =>
    ['C', 'A', 'B', 'D'].map((set) => ({ params: { chapter: String(data.number), set: set.toLowerCase() }, props: { chapter: data, set } })),
  );
}
```

---

## 3. The content layer

Content lives in `src/content/` and `src/data/`, and is declared in **`src/content.config.ts`**. This file is the
single source of truth for what the content must look like.

### Chapters: `src/content/chapters/chapter-N.mdx`

Each file has frontmatter (validated) followed by the notes:

```mdx
---
number: 2
title: "Testing Throughout the SDLC"
minutes: 130
summary: "…"
objectives:
  - "How testing is incorporated into different development approaches"
---
import SyllabusRef from '../../components/SyllabusRef.astro';
import VModel from '../../components/diagrams/VModel.astro';

## 2.1 Testing in the Context of an SDLC      ← a section (becomes collapsible)

### The V-Model                               ← a topic (listed in the side menu)
<SyllabusRef ref="2.1" />
<VModel />
- **Pros** - Test plans developed earlier · Defects found earlier
```

The heading levels matter:

- `##` = a syllabus **section** (1.1, 2.1…). Each one is wrapped in a collapsible block.
- `###` = a **topic** inside a section. Topics are listed in the "In this chapter" menu.
- `####` = a small label within a topic.

### Exams: `src/data/exams/exam-a.json` … `exam-d.json`

Each file is one ISTQB sample paper:

```jsonc
{ "set": "C", "version": "1.6", "questions": [ /* exactly 40 */ ] }
```

The question schema (`question` in `content.config.ts`) enforces the rules a question must follow:

- the `k` level is K1, K2 or K3
- there are at least 4 options
- `answer.length === select`, so "Select TWO" has two answers
- every answer key is one of the options
- each paper has exactly 40 questions

If any rule fails, **`npm run build` stops with an error** that names the file and the field.

A question's text is an ordered list of **blocks**, so tables, boxed text and diagrams appear exactly where the
original paper put them:

| `t` | Renders as | Example use |
|---|---|---|
| `p` | paragraph | most question text |
| `list` | marker + text rows | "1. … 2. …", "A. … B. …" |
| `table` | HTML table, first row is the header | decision tables, traceability matrices |
| `box` | bordered block of lines | user stories, test logs, business rules |
| `formula` | centred formula | estimation formulas |
| `img` | image from `public/exam-figures/` | state diagrams, control flow graphs, charts |

Each question also has a `chapter` (taken from its learning objective). That's how the chapter quizzes pick out "the
Paper C questions for Chapter 4".

### Reading content: `src/lib/data.ts`

Pages never read files directly. They call three small functions:

```ts
getChapters()                 // all chapters, sorted 1-6
getQuestions(set, chapter)    // e.g. the Chapter 4 questions from Paper C
getExam(set)                  // a whole paper (all 40 questions)
```

---

## 4. Turning Markdown into the notes page

Two small **rehype plugins** (rehype transforms HTML after the Markdown is parsed) shape the notes. They're
registered in `astro.config.mjs`:

```js
integrations: [mdx({ rehypePlugins: [tidyLists, collapsibleSections] })]
```

| Plugin | File | What it does |
|---|---|---|
| **tidyLists** | `src/lib/rehype-tidy-lists.mjs` | Reshapes bullet lists so the notes aren't a wall of bullets. Key points (`- **Title** - description`) become a grid of **cards**, with ` · ` becoming a new line. Full sentences become ordinary **paragraphs**. Lists of short items (e.g. "Test strategy", "Level of coverage") become a row of **tags**. Numbered lists are left alone. Card grids pick a column count that keeps them symmetrical (4 cards → 2×2, 5 → 3 + 2 centred); a pair titled Pros/Cons (or Benefits/Drawbacks…) becomes a green-and-pink side-by-side comparison; 7 or more points become a compact two-column list. A bold phrase that starts a sentence ("**Software testing** is…") stays a paragraph. |
| **collapsibleSections** | `src/lib/rehype-collapsible-sections.mjs` | Makes the notes collapsible at two levels: each `##` section becomes a `<details>` (closed by default), and each `###` topic inside it another `<details>` (also closed by default). Links into the notes open every collapsed block around their target. |

The chapter page (`src/pages/chapters/[chapter].astro`) then:

1. calls `render(entry)`, which returns the compiled notes **and** a list of every heading;
2. groups the `###` topics under their `##` section to build the collapsible "In this chapter" menu;
3. includes a small script that, when a topic link is clicked, **opens its section** and scrolls to it (a link
   into a closed `<details>` would otherwise go nowhere).

---

## 5. Components

```
src/components/
├── Header.astro          Logo + navigation (desktop links; a "Menu" panel on phones)
├── Footer.astro          ISTQB copyright acknowledgement
├── PageHead.astro        Slide-style page title with the pink full stop and rule
├── SyllabusRef.astro     The "Syllabus · CTFL v4.0 · Section 2.1" badge
├── Search.astro          Header search box (loads /search.json on first use)
├── BackToTop.astro       Floating back-to-top button
├── SyllabusText.astro    The collapsible "What the syllabus says" box
├── WatchOut.astro        "Watch out for…" exam traps at the end of each chapter (data: src/data/traps.ts)
├── Exercise.astro        A practice question in the notes, answer in a collapsible panel (slot="answer")
├── ExamSplit.astro       Questions-per-chapter bar chart (Introduction page)
├── QuestionBody.astro    Renders a question's blocks (p / list / table / box / formula / img)
├── Quiz.astro            The quiz and mock-exam engine - see section 6
├── Figure.astro          Card + caption wrapper used by every diagram
└── diagrams/
    ├── Flow.astro        Reusable: steps joined by arrows (optional loop)
    ├── Compare.astro     Reusable: 2-3 columns of points
    ├── Tiles.astro       Reusable: a grid of tiles
    ├── Cycle.astro       Reusable: steps in a loop (Scrum sprint, TDD, retrospectives, monitor/control)
    ├── Hub.astro         Reusable: a centre idea with items around it (whole team, test tools)
    ├── Partitions.astro  Reusable: equivalence partitions with the test value picked from each
    └── VModel.astro …    Bespoke diagrams (V-model, defect lifecycle, quadrants, BVA, etc.)
```

### Diagrams

All diagrams are inline SVG with a `viewBox`, so they scale to any width. Colours come from CSS classes in
`src/styles/global.css` (`.b-pink`, `.b-dark`, `.t`, `.ln`…), which use the theme variables. Changing the
brand colours therefore restyles every diagram.

SVG has no automatic text wrapping, so `src/lib/svg.ts` provides `wrap(text, maxChars)`. **Flow**, **Compare** and
**Tiles** use it to fit text into their boxes, which is why they're the recommended way to add new diagrams: you pass
data, not coordinates.

---

## 6. The quiz engine (`src/components/Quiz.astro`)

The quiz is built so that **everything a learner might see is rendered into the HTML at build time**. That includes
questions, options and every explanation. The browser script only shows, hides and marks.

```
Build time (Astro)                                   Browser (script in Quiz.astro)
──────────────────                                   ──────────────────────────────
<section data-quiz-id="ch4-c" data-exam?>            • count answered questions
  <li data-question="c-21"                           • stop a 3rd tick on "Select TWO"
      data-answer="b" data-select="1"                • on submit: compare picked vs data-answer,
      data-chapter="4">                                mark options, reveal each review block
    question blocks + options (inputs)               • compute score, pass/fail (65%)
    <div data-review hidden> explanations </div>     • save the attempt to localStorage
  </li>                                              • exam mode: start screen, countdown,
  <div data-results hidden> score, breakdown           auto-submit at 0:00, chapter breakdown
```

- **Chapter quizzes and past papers use the same component.** Past papers pass `examMode`, which adds the time-limit
  picker, the countdown and the score-by-chapter table.
- **The answers are in the page source** (`data-answer`). That's fine for a revision site: it's open-book practice,
  not an assessment. If it ever needs to be secure, marking would have to move to a server.
- State is kept in the DOM (checked inputs and CSS classes such as `is-right` / `is-wrong`), not in a framework, so the
  script needs no libraries.

---

## 6b. Handouts, search and reading aids

- **Handouts** - PDFs in `public/handouts/` are served as plain files and listed in `src/data/handouts.ts`, which
  the Handouts page and each chapter's download button read from.
- **Search** - `src/pages/search.json.ts` builds an index at build time: one entry per `###` topic (title, chapter,
  section, the first ~400 characters of plain text, and a link using the same slug Astro gives the heading, via
  `github-slugger`). Exercise answers and syllabus boxes are left out. `Search.astro` fetches it the first time the box is used
  and scores matches (title hits beat body hits; every word must match).
- **Reading aids** (script in `chapters/[chapter].astro`) - an `IntersectionObserver` highlights the current topic in the
  contents menu and saves it as `lastVisit` (shown on the home page as "Continue where you left off"); a "Next section"
  button is appended to the end of each collapsible section.

## 7. Progress storage (`src/lib/progress.ts`)

All reading and writing of progress goes through this one module:

```ts
loadProgress()                 // { version: 1, chaptersRead, quizzes, lastVisit? }
saveLastVisit(visit)           // the topic being read, for "Continue where you left off"
markChapterRead(n)
saveQuizAttempt(id, attempt)   // keeps attempts, best and last
getQuiz(id)
resetProgress()
quizId(chapter, set)           // "ch4-c"  - chapter quizzes
examId(set)                    // "exam-c" - full past papers
```

- Everything is stored under one `localStorage` key, `sparta-ctfl-progress`, as JSON with a `version` field. If the
  shape ever changes, bump the version and `loadProgress()` will start fresh instead of crashing on old data.
- Every call is wrapped in `try/catch`, because storage can be blocked (some private-browsing modes). The site
  still works; it just doesn't remember.

---

## 8. Styling

- **`src/styles/global.css`** holds the theme: CSS variables (colours, fonts, radius, shadow) at the top, then shared
  utilities (`.card`, `.btn`, `.pill`, `.grid`, `.eyebrow`), table styles, diagram classes and mobile tweaks.
- **Component styles** are written in a `<style>` block inside each `.astro` file. Astro scopes these to that component
  automatically, so they can't leak. `:global(...)` is used where a page styles HTML it didn't create itself, such as
  the notes produced from MDX.
- **Brand:** charcoal `#2d2a2b`, pink `#d42a57` (Sparta's `#e33661` deepened very slightly so white text on it meets the WCAG AA contrast ratio of 4.5:1), the pink full stop after titles, and a rule with an end dot, all taken
  from the Sparta slide template. Headings use Zilla Slab (a free slab font close to Sparta's Bw Glenn Slab) and the
  body uses Source Sans 3, both from Google Fonts.

### Accessible colour

All text meets WCAG AA contrast (4.5:1, or 3:1 for large text). Small pink labels use `--pink-dark` on light backgrounds
and `--pink-soft` on dark ones; body text never uses grey on a coloured background. Keep to these variables when adding
new styles.

### Responsive design

The site is designed for desktop and tested at phone width (390 px):

| Area | Desktop | Phone (≤ 48 rem / 56 rem) |
|---|---|---|
| Header | Inline links + Chapters dropdown | One **Menu** button opening a full-width panel |
| Chapter page | Sticky contents sidebar + notes | Contents becomes a collapsed panel above the notes |
| Card lists, tiles | Multi-column grid | Single column (`auto-fill` + `minmax`) |
| Tables | Normal | Scroll sideways inside their own box |
| Quiz | Options with "✓ Correct answer" on the right | Flags move under the option; results stack vertically |

Layout grids use `minmax(0, 1fr)` columns, so wide content (a big table) can't push the page wider than the screen.

---

## 9. Build and deployment

```
npm run dev      → local server with live reload (http://localhost:4321)
npm run build    → astro check (TypeScript + content schemas) then astro build → dist/
npm run preview  → serve dist/ exactly as it will be published
```

**`.github/workflows/deploy.yml`** runs on every push to `main`:

1. `withastro/action` installs dependencies and runs `npm run build`. A content or type error stops the deploy here.
2. `actions/deploy-pages` publishes `dist/` to GitHub Pages.

GitHub Pages serves a project site from a sub-path (`/istqb-revision/`), so `astro.config.mjs` reads `BASE_PATH`
from the workflow. **All internal links must go through `url()`** in `src/lib/site.ts`, which adds that prefix:

```astro
<a href={url('chapters/2')}>   <!-- → /istqb-revision/chapters/2/ on GitHub, /chapters/2/ locally -->
```

A hard-coded `href="/chapters/2"` would work locally but break on GitHub Pages.

---

## 10. Common changes

| I want to… | Do this |
|---|---|
| Fix a typo in the notes | Edit `src/content/chapters/chapter-N.mdx`. |
| Add a topic | Add a `###` heading in the right `##` section. It appears in the side menu automatically. |
| Edit a chapter's exam traps | `src/data/traps.ts` (a `trap` and the `truth` for each). |
| Change the K3 methods on Exam tips | `src/lib/k3.ts`. The statistics on that page are calculated from the exam JSON at build time, so they update themselves. |
| Add a practice question to the notes | Wrap it in `<Exercise title="…">` with the answer in `<div slot="answer">` (see the README). |
| Add a diagram | Use `<Flow>`, `<Compare>` or `<Tiles>` in the MDX (see the README), or copy a bespoke one in `components/diagrams/`. |
| Fix a question or explanation | Edit `src/data/exams/exam-X.json`, then run `npm run check`. |
| Add a new sample paper | Add `exam-e.json` (40 questions), add `'E'` to the `set` enum in `content.config.ts`, and add it to `PRACTICE_SETS` in `src/lib/site.ts`. The routes pick it up automatically. |
| Change the main chapter-quiz paper | Change `MAIN_SET` in `src/lib/site.ts`. |
| Change the pass mark | `PASS_MARK` in `src/lib/site.ts`. |
| Update a handout PDF | Replace the file in `public/handouts/` (same name). |
| Change colours or fonts | The variables at the top of `src/styles/global.css` (fonts are loaded in `BaseLayout.astro`). |
| Add a page | Create `src/pages/my-page.astro` using `BaseLayout` and `PageHead`. Link to it with `url('my-page')`. |

---

## 11. Where the content came from

- **Chapter notes:** converted once from the Sparta Global CTFL slide decks (titles, key points, syllabus
  references and the "syllabus detail" speaker notes), then tidied by hand. They're now maintained directly as MDX.
  There's no link back to the slides.
- **Questions and explanations:** extracted once from the official ISTQB CTFL v4.0 sample exam PDFs (A v1.7, B v1.7,
  C v1.6, D v1.5). Tables were rebuilt as data, and the diagrams were cropped into `public/exam-figures/`. They're now
  maintained directly as JSON. If ISTQB publishes a new version of a paper, update the matching JSON file by hand.

ISTQB material is © International Software Testing Qualifications Board and is acknowledged on every page, as its
copyright terms require.

---

## 12. Build pipeline in detail

What happens when you run `npm run build` (or when GitHub Actions does it for you):

```
 1. astro check
    ├── TypeScript type-checks every .astro / .ts file
    └── content schemas (src/content.config.ts) validate every chapter frontmatter and all 160 questions
        → any error stops here, before anything is published

 2. astro build
    ├── Content layer loads   src/content/chapters/*.mdx   and   src/data/exams/*.json
    ├── MDX compile, for each chapter:
    │     Markdown → mdast (remark) → hast (rehype)
    │       → tidyLists            reshapes bullet lists (cards / tags / paragraphs / pros-cons / two-column list)
    │       → collapsibleSections  wraps ## sections and ### topics in <details>
    │       → heading ids          Astro adds slug ids to every heading (used by links, search, the contents menu)
    ├── Every route in src/pages/ is rendered to static HTML
    │     dynamic routes run getStaticPaths(): 6 chapters, 24 chapter quizzes, 4 past papers
    ├── search.json is generated from the chapter Markdown (one entry per topic)
    ├── <script> blocks in components are bundled and minified into dist/_astro/*.js
    └── public/ is copied as-is (logo, favicon, exam figures, handout PDFs)

 3. Output: dist/  - plain HTML, CSS, JS and assets.  This folder is what GitHub Pages serves.
```

## 13. Data flow at runtime

There is no server. Everything a visitor sees comes from the static files; the only things that change are in their browser.

```
 Visitor's browser
 ├── loads the static page (HTML already contains all text, questions and explanations)
 ├── runs the page's small script(s):
 │     Quiz.astro        marks answers, shows explanations, runs the timer
 │     chapters/[n]      opens sections, highlights the current topic, "Next section"
 │     Search.astro      fetches /search.json once, filters it as you type
 │     Header / BackToTop menus and the back-to-top button
 └── reads/writes localStorage key "sparta-ctfl-progress" via src/lib/progress.ts
       { version: 1,
         chaptersRead: [1, 2],
         quizzes: { "ch4-c": { attempts, best, last }, "exam-b": {...}, "k3-practice": {...} },
         lastVisit: { chapter: 2, slug: "the-v-model", title: "The V-Model" } }
```

## 14. File-by-file reference

| File | Responsibility | Depends on |
|---|---|---|
| `astro.config.mjs` | Site URL and base path (from env), MDX + the two rehype plugins | `src/lib/rehype-*.mjs` |
| `src/content.config.ts` | Defines the `chapters` and `exams` collections and their Zod schemas; exports the `Question` type | - |
| `src/lib/site.ts` | Constants (pass mark, main/practice sets, questions per chapter, K-level timings) and `url()` | - |
| `src/lib/data.ts` | `getChapters()`, `getQuestions(set, chapter)`, `getExam(set)` | content collections |
| `src/lib/progress.ts` | All localStorage access: load/save, chapters read, quiz attempts, last visit, reset | - |
| `src/lib/k3.ts` | The 8 K3 skills, their methods and links into the notes | - |
| `src/lib/svg.ts` | `wrap()` text for SVG; shared fill classes | - |
| `src/lib/rehype-tidy-lists.mjs` | List → cards / tags / paragraphs / versus / definition list | - |
| `src/lib/rehype-collapsible-sections.mjs` | `##` and `###` → nested `<details>` | - |
| `src/data/exams/exam-*.json` | The four ISTQB sample papers (40 questions each) | validated by `content.config.ts` |
| `src/data/traps.ts` | "Watch out for…" content per chapter | - |
| `src/data/handouts.ts` | The PDF list and `handoutUrl()` | `site.ts` |
| `src/layouts/BaseLayout.astro` | `<head>`, fonts, header, footer, back-to-top - wraps every page | components |
| `src/components/Quiz.astro` | Quiz and mock-exam engine (build-time markup + client script) | `QuestionBody`, `progress.ts` |
| `src/components/QuestionBody.astro` | Renders a question's blocks | `Question` type |
| `src/components/Exercise.astro` | Practice question with collapsible answer (`slot="answer"`) | `handouts.ts` |
| `src/components/SyllabusRef.astro` / `SyllabusText.astro` | Syllabus badge / collapsible syllabus wording | - |
| `src/components/WatchOut.astro` | Collapsible exam traps | `traps.ts` |
| `src/components/Search.astro` | Search box + client-side matching | `/search.json` |
| `src/components/diagrams/*` | SVG diagrams (reusable: Flow, Compare, Tiles, Cycle, Hub, Partitions) | `Figure`, `svg.ts` |

## 15. Component contracts

The props each reusable component accepts (TypeScript checks these at build time):

```ts
<Quiz questions={Question[]} quizId="ch4-c" examMode?={boolean} />
<Exercise title="…" kind?="exercise" | "discuss" options?={string[]} source?="workbook">
  question…  <div slot="answer">answer…</div>
</Exercise>
<SyllabusRef ref="4.2.1" />          <SyllabusRef beyond />
<SyllabusText> official wording… </SyllabusText>
<WatchOut chapter={4} />

<Flow    caption="…" steps={[{ title, sub? }]} loop?="label" />
<Compare caption="…" columns={[{ title, sub?, points: string[] }]} middle?="vs" />
<Tiles   caption="…" tiles={[{ label?, title, sub? }]} cols?={4} />
<Cycle   caption="…" steps={[{ title, sub?, tone?: 'red'|'green'|'yellow' }]} center?="…" />
<Hub     caption="…" center="…" items={string[]} />
<Partitions caption="…" rows={[{ label, segments: [{ text, kind?: 'valid'|'invalid'|'neutral', size?, pick? }] }]} />
```

## 16. Quality checks built in

| Check | Where | What it catches |
|---|---|---|
| Content schemas | `content.config.ts` | a question whose answer isn't an option, wrong number of answers for "Select TWO", a paper without 40 questions, missing chapter fields |
| Type checking | `astro check` | wrong component props, typos in variable names, unused/undefined imports |
| Build-time rendering | `astro build` | broken MDX (e.g. an unclosed `<Exercise>`), components that throw |
| Deploy gate | GitHub Actions | nothing is published unless steps above pass |

Things that are **not** automated, so check them by eye after a big content change: diagram text fitting its boxes,
layout on a phone (≈390 px wide), and colour contrast for any new colours (keep to the CSS variables).

## 17. Design decisions and trade-offs

| Decision | Benefit | Trade-off |
|---|---|---|
| Static site, no backend | Free hosting, nothing to maintain or secure, fast | No shared data - trainers can't see learners' scores |
| Answers in the page source | Quizzes work offline and instantly, no server | A determined learner could read the answers in the HTML - fine for revision, not for assessment |
| localStorage for progress | Private, zero setup | Per browser and device; cleared with browser data |
| Content converted once from slides/PDFs | Content is now plain text that anyone can edit | Changes to the original slides don't flow through automatically |
| SVG diagrams as components | Sharp, themeable, accessible, editable in code | Need a little SVG knowledge for brand-new bespoke diagrams (the reusable ones avoid this) |
| Two-level `<details>` for the notes | Works without JavaScript, accessible by default | Browser "find in page" doesn't search inside closed sections - use the site search or Expand all |

## 18. Extending the site - recipes

**A new page** - create `src/pages/my-page.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageHead from '../components/PageHead.astro';
---
<BaseLayout title="My page">
  <PageHead eyebrow="Section" title="My page" />
  <div class="container"> … </div>
</BaseLayout>
```

Add it to the header by appending `['my-page', 'My page']` to `links` in `Header.astro` (or to `external` for an
outside link that should open in a new tab, like the Glossary).

**A new reusable diagram** - copy `Hub.astro` or `Cycle.astro`, change the layout maths, keep using the CSS classes
(`b-pink`, `b-dark`, `t`, `t-sm`…) so colours follow the theme, and wrap the SVG in `<Figure caption=…>`.

**A new list layout** - add a rule in `tidy()` inside `rehype-tidy-lists.mjs` that sets a class on the `<ul>`, then style
that class in `chapters/[chapter].astro` (look for the "Lists reshaped by…" comment).

**A new kind of stored progress** - add a field to the `Progress` interface and a small save/load function in
`progress.ts`. If the change isn't backwards compatible, bump `version` so old data is ignored rather than misread.
