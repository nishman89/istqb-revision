# Sparta Global – ISTQB CTFL Study Site

A study website for the **ISTQB® Certified Tester Foundation Level (CTFL v4.0)** course. It turns the
Sparta Global course slides into readable chapter notes and adds end-of-chapter practice quizzes built from
the official ISTQB sample exams.

It is a static website, hosted free on **GitHub Pages**. There is no server or database. Learners'
progress is saved in their own browser.

---

## What's on the site

| Page | What it does |
|---|---|
| **Home** | A card for each of the six chapters, showing its weighting in the exam, course time and the learner's progress. |
| **Introduction to the ISTQB** | What the ISTQB is, the Foundation certificate, the exam at a glance, how marks are granted, K-levels, and the question spread by chapter. |
| **Chapter notes** (1–6) | The slide content as notes. Every topic shows the syllabus section it covers (e.g. *CTFL v4.0 · Section 4.2.1*), and **"What the syllabus says"** opens the official wording. |
| **Chapter quiz** | The questions from **ISTQB Sample Exam C** for that chapter. |
| **Extra practice** | The same chapter's questions from **Sample Exams A, B and D**. |
| **Past papers** | Sit any of the four ISTQB sample exams in full: 40 questions with an optional 60- or 75-minute timer, then a score for each chapter. |

### How the quizzes work

1. Answer every question. "Select TWO" questions stop you ticking more than two.
2. Press **Submit answers**.
3. You get your score and whether you passed (the pass mark is 65%, the same as the real exam).
4. Every question then shows your answer, the correct answer, and **why each option is right or wrong**, using ISTQB's own explanations.
5. Tick **Show only questions I got wrong** to focus on mistakes, or press **Retake quiz** to try again.

### Past papers

Each sample exam can be sat as a full mock exam:

1. Choose a time limit: **60 minutes** (standard), **75 minutes** (the exam isn't in your native language), or **no limit**.
2. Press **Start exam**. A countdown appears in the bar at the bottom of the screen and turns pink in the last five minutes.
3. Submit when you're done. If time runs out, the paper is marked automatically.
4. The results show your score, pass or fail, the time taken, a **score for each chapter**, and the same full review as the chapter quizzes.

### Diagrams

Key topics in the chapter notes have diagrams: the test process, error → defect → failure, the V-model, the test pyramid,
the DevOps pipeline, the review process, boundary values, state transitions, control flow graphs, the testing quadrants,
the risk matrix and the defect lifecycle. They're drawn as SVG, so they stay sharp at any size and use the Sparta colours.

### Progress

The site remembers which chapters a learner has marked as read and their **last and best score** for every quiz.
This is stored in the browser's `localStorage`:

- It stays until the learner clears their browser data or presses **Reset my progress** on the home page.
- It belongs to **one browser on one device**. It won't follow someone from their laptop to their phone, and private/incognito windows forget it.
- Nothing is sent anywhere. There are no cookies, no tracking, and trainers can't see learners' scores.

---

## Opening the website

### The live site

Once it's published (see [Publishing on GitHub Pages](#publishing-on-github-pages)), open:

```
https://<your-github-username-or-organisation>.github.io/<repository-name>/
```

For example, a repository called `istqb-ctfl` owned by `sparta-global` would be at
`https://sparta-global.github.io/istqb-ctfl/`.

### On your own computer

You need **Node.js 20 or newer**, available from https://nodejs.org. Choose the "LTS" version.

1. Open a terminal in this folder.
2. Install the project's packages. You only need to do this once:
   ```bash
   npm install
   ```
3. Start the local preview:
   ```bash
   npm run dev
   ```
4. Open **http://localhost:4321** in your browser. The page reloads automatically when you edit a file.
5. Press `Ctrl + C` in the terminal to stop it.

> Opening `index.html` by double-clicking it **won't work**. The site has to be built first and served by a web
> server, which is what `npm run dev` does for you.

### Commands

| Command | What it does |
|---|---|
| `npm install` | Installs the packages (first time only). |
| `npm run dev` | Runs the site locally at http://localhost:4321 with live reload. |
| `npm run check` | Checks the code and content for errors. |
| `npm run build` | Checks everything, then builds the finished site into `dist/`. |
| `npm run preview` | Serves the built `dist/` folder, so you can check exactly what will be published. |

---

## Publishing on GitHub Pages

This only needs setting up once. After that, the site republishes itself every time you push to `main`.

1. Create a new repository on GitHub and push this folder to its `main` branch.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push a change, or go to the **Actions** tab and run **Deploy to GitHub Pages** manually.
5. When the workflow shows a green tick, the site is live at the address shown on the **Settings → Pages** screen.

The workflow is in `.github/workflows/deploy.yml`. It sets the site's address to match your repository name
automatically. If you name the repository `<username>.github.io`, change `BASE_PATH` in that file to `/`.

> **Note:** on GitHub's free plans a Pages site is **public**, even if the repository is private. The site
> credits ISTQB as its copyright terms require (see [Copyright](#copyright)). Check with whoever manages
> Sparta's ISTQB accreditation that publishing the sample exams openly is acceptable.

---

## Editing the content

You don't need to touch any code to change the notes or questions.

### Chapter notes – `src/content/chapters/chapter-1.mdx` … `chapter-6.mdx`

Each chapter is a Markdown file. The top section (between the `---` lines) holds the chapter's title, course time,
summary and learning objectives. Below it:

```mdx
## 4.2 Black-box Test Techniques          ← a section (appears in the "In this chapter" menu)

### Equivalence Partitioning              ← a topic

<SyllabusRef ref="4.2.1" />               ← the syllabus section badge

- **Divide the data** - into equivalence partitions
- **One test each** - one value per partition is enough

<SyllabusText>

The official syllabus wording goes here. It appears in the
collapsible "What the syllabus says" box.

</SyllabusText>
```

Use `<SyllabusRef beyond />` for topics that go beyond the syllabus.

### Quiz questions – `src/data/exams/exam-a.json` … `exam-d.json`

One file per ISTQB sample exam, each holding 40 questions. A question looks like this:

```jsonc
{
  "id": "c-21",
  "exam": "C",
  "n": 21,                        // question number in the ISTQB paper
  "chapter": 4,                   // which chapter's quiz it appears in
  "lo": "FL-4.2.2",               // learning objective
  "ref": "4.2.2",                 // syllabus section shown on the badge
  "k": "K3",                      // knowledge level
  "select": 1,                    // 1 = "Select ONE", 2 = "Select TWO"
  "blocks": [                     // the question text, in order
    { "t": "p", "text": "A developer was asked to implement the following business rule:" },
    { "t": "box", "lines": ["INPUT: value (integer number)", "..."] }
  ],
  "options": [{ "key": "a", "text": "100, 150, 200, 201" }, ...],
  "answer": ["b"],
  "explanation": {
    "intro": "General explanation (optional)",
    "options": { "a": "Is not correct. ...", "b": "Is correct. ...", ... }
  }
}
```

Block types for the question text:

- `p`: a paragraph
- `list`: a numbered or lettered list
- `table`: a table (the first row is the header)
- `box`: a bordered block of lines, such as a user story or a test log
- `formula`: a centred formula
- `img`: a diagram from `public/exam-figures/`

**Safety net:** `npm run build` refuses to build if a question is broken. For example, it fails if the answer isn't
one of the options, if a "Select TWO" question doesn't have two answers, or if an exam doesn't have 40
questions. Run `npm run check` after editing.

### Other things you might change

| To change… | Edit… |
|---|---|
| Colours and fonts | `src/styles/global.css` (the variables at the top) |
| Pass mark, questions per chapter, main quiz set | `src/lib/site.ts` |
| The Introduction page | `src/pages/introduction.astro` |
| Header, footer, logo | `src/components/Header.astro`, `Footer.astro`, `public/sparta-logo*.png` |
| A diagram | `src/components/diagrams/` (one file per diagram) |

### Adding a diagram to the notes

Import it at the top of the chapter file, then place it under any topic:

```mdx
import VModel from '../../components/diagrams/VModel.astro';

### The V-Model

<SyllabusRef ref="2.1" />

<VModel />
```

---

## How it's built

The site uses **[Astro](https://astro.build)**, a framework for content sites. Astro turns the Markdown notes and JSON
questions into plain, fast HTML pages at build time. JavaScript only runs where it's needed: the quiz and the
progress tracking.

```
├── .github/workflows/deploy.yml   Builds and publishes to GitHub Pages
├── public/                        Files copied as-is: logo, favicon, exam diagrams
└── src/
    ├── content.config.ts          Defines and validates chapters and exam questions
    ├── content/chapters/          Chapter notes (MDX)
    ├── data/exams/                ISTQB sample exams A–D (JSON)
    ├── components/                Reusable pieces: Quiz, QuestionBody, SyllabusRef, Header…
    │   └── diagrams/              SVG diagrams used in the notes
    ├── layouts/BaseLayout.astro   The shared page shell (head, header, footer)
    ├── lib/
    │   ├── site.ts                Settings and helpers (pass mark, links)
    │   ├── data.ts                Loads chapters and questions
    │   └── progress.ts            Saves progress in the browser
    ├── pages/                     One file per page or page pattern
    │   ├── index.astro            Home
    │   ├── introduction.astro     Introduction to the ISTQB
    │   ├── chapters/[chapter].astro
    │   ├── quiz/[chapter]/[set].astro
    │   └── past-papers/           Past papers list and full mock exams
    └── styles/global.css          Sparta Global theme
```

The chapter notes were converted from the Sparta Global CTFL slide decks. The questions and explanations were
extracted from the ISTQB CTFL v4.0 sample exam PDFs (Exam A v1.7, B v1.7, C v1.6, D v1.5). Both are now
edited directly in the files above.

---

## Copyright

The sample exam questions, answers and explanations, and the syllabus extracts, are © International Software Testing
Qualifications Board (ISTQB®). ISTQB allows accredited training providers to use its sample exams in their
training courses, as long as ISTQB is acknowledged as the source and copyright owner. The site does this in the footer
of every page and on every question. ISTQB® is a registered trademark of the International Software Testing
Qualifications Board.

Course notes © Sparta Global.
