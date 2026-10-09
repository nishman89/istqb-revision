# Sparta Global – ISTQB CTFL Study Site

A study website for the **ISTQB® Certified Tester Foundation Level (CTFL v4.0)** course. It turns the
Sparta Global course slides into readable chapter notes and adds end-of-chapter practice quizzes built from
the official ISTQB sample exams.

It is a static website, hosted free on **GitHub Pages**. There is no server or database. Learners'
progress is saved in their own browser. It works on desktops, tablets and phones.

> **Developers:** see **[ARCHITECTURE.md](ARCHITECTURE.md)** for how the code is structured: the content layer,
> the quiz engine, progress storage, diagrams, styling, and how to make common changes.

---

## What's on the site

| Page | What it does |
|---|---|
| **Home** | A card for each of the six chapters, showing its weighting in the exam, course time and the learner's progress. |
| **Introduction to the ISTQB** | What the ISTQB is, the Foundation certificate, the exam at a glance, how marks are granted, K-levels, and the question spread by chapter. |
| **Chapter notes** (1–6) | The slide content as notes, with diagrams. Key points are shown as cards. Each syllabus section (e.g. *2.1*) is a **collapsible** block, and the "In this chapter" menu opens to list that section's topics. Every topic shows the syllabus section it covers (e.g. *CTFL v4.0 · Section 4.2.1*), and **"What the syllabus says"** opens the official wording. |
| **Chapter quiz** | The questions from **ISTQB Sample Paper C** that cover that chapter (the same number the real exam asks on it). |
| **Extra practice** | The same chapter's questions from **Sample Papers A, B and D**, three more sets on exactly the same topics. |
| **Exam tips** | Exam technique based on an analysis of all 160 sample-paper questions: the 8 calculation topics worth 20% of the exam (with a method for each), the K-level mix, key words and question formats. Includes a quiz of all 32 K3 questions. |
| **Handouts** | Download the six chapter handouts and the practice workbook (PDF). Each chapter page also has a download button for its handout. |
| **Glossary** (header link) | Opens the official ISTQB glossary at glossary.istqb.org in a new tab |
| **Practice sets** | From the Sample Papers page: practise **by chapter** (1-6) or **by K-level** (K1, K2, K3), using every matching question from Papers A-D |
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

The chapter notes include about 50 diagrams, drawn as SVG so they stay sharp at any size and use the Sparta colours. Examples
include the test process, error → defect → failure, the seven principles, the V-model, the test pyramid, the DevOps pipeline,
shift-left, the review process, boundary values, state transitions, control flow graphs, the testing quadrants, risk
management, three-point estimation and the defect lifecycle.

### Finding your way around

- **Search** - press **/** (or the 🔍 Search button) and type; results show the topic, its chapter and section. Arrow keys and Enter work.
- **Continue where you left off** - the home page remembers the last topic you were reading.
- **Next section** - the end of each section has a button that opens the next one.
- **In this chapter** - the side menu highlights the topic you're reading.
- **Back to top** - a button appears once you scroll down.

### Handouts and the practice workbook

The PDFs live in `public/handouts/` and are listed in `src/data/handouts.ts`. To update one, replace the file with the same name. Exercises taken from the practice
workbook are tagged **📄 Practice workbook** in the notes.

### Exercises

Practice questions in the notes (the UV index, boiler timer, BVA, state transition and estimation exercises, and the
"think about it" prompts on the testing principles) appear in a clearly marked **Exercise** or **Discuss** box. The
answer is hidden until you click **Show answer**.

### "Watch out for…" boxes

At the end of each chapter is a list of the common traps for that chapter: the confusions the sample papers
deliberately test, taken from ISTQB's own explanations of why wrong answers are wrong. They're edited in
`src/data/traps.ts`.

### Collapsible sections

Each syllabus section (1.1, 1.2, 2.1…) opens and closes, and so does every topic inside it (click its heading, or the +/−). Everything starts closed.
Use **Expand all sections** / **Collapse all** above the notes.
Clicking a topic in the "In this chapter" menu opens its section and jumps straight to it.

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

### On your own computer (step by step)

You only need to do steps 1-4 once.

**1. Install the tools**

| Tool | Why | Where to get it |
|---|---|---|
| **Visual Studio Code** | The editor you'll open the project in | https://code.visualstudio.com - download and install with the default options |
| **Node.js (LTS, version 20 or newer)** | Runs the site's build tools (includes `npm`) | https://nodejs.org - choose the **LTS** button |
| **Git** | Downloads the project from GitHub and publishes changes | https://git-scm.com/downloads |

Check they installed: open a terminal (Windows: *Command Prompt* or *PowerShell*; Mac: *Terminal*) and run
`node -v`, `npm -v` and `git --version`. Each should print a version number. If not, restart your computer and try again.

**2. Add the recommended VS Code extensions** *(optional, but they make editing easier)*

In VS Code, open the Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`) and install:
- **Astro** (astro-build.astro-vscode) - syntax highlighting and error checking for `.astro` files
- **MDX** (unifiedjs.vscode-mdx) - highlighting for the chapter notes

**3. Get the project**

Either clone it from GitHub:

```bash
git clone https://github.com/<your-username>/istqb-revision.git
```

…or unzip the project zip somewhere sensible (e.g. `Documents/istqb-revision`).

Then in VS Code choose **File → Open Folder…** and pick the `istqb-revision` folder.

**4. Install the project's packages**

Open VS Code's built-in terminal (**Terminal → New Terminal**, or `` Ctrl+` ``) and run:

```bash
npm install
```

This downloads everything listed in `package.json` (Astro, the MDX integration, TypeScript and a couple of helpers)
into a `node_modules` folder. It takes a minute and only needs doing again if `package.json` changes.

**5. Run the site**

```bash
npm run dev
```

Open **http://localhost:4321** in your browser. Leave the terminal running - every time you save a file, the page
updates by itself. Press `Ctrl + C` in the terminal to stop.

**6. Publish your changes**

```bash
git add .
git commit -m "Describe what you changed"
git push
```

GitHub Actions rebuilds and publishes the site in a couple of minutes (see [Publishing on GitHub Pages](#publishing-on-github-pages)).

**Troubleshooting**

| Problem | Fix |
|---|---|
| `npm` or `node` "is not recognised" | Node.js isn't installed or the terminal was open before you installed it - close and reopen VS Code |
| `npm install` fails | Check you're in the project folder (the one containing `package.json`), then try again |
| Port 4321 is already in use | Another copy is running - stop it, or use the other address `npm run dev` prints |
| The build shows an error about a question or chapter | Read the message - it names the file and field that's wrong (see [Editing the content](#editing-the-content)) |

> Opening `index.html` by double-clicking it **won't work** - the site has to be built and served, which is what
> `npm run dev` does for you.

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

### Adding an exercise to the notes

```mdx
import Exercise from '../../components/Exercise.astro';

<Exercise title="UV index partitions" options={['1, 2, 5, 9, 11', '1, 5, 7, 9, 11']}>

Which set of input data exercises all the partitions?

<div slot="answer">

**b)** - one value in each partition.

</div>
</Exercise>
```

Use `kind="discuss"` for an open question with a suggested answer, and `kind="example"` for a worked example (shown with a "Show the worked solution" panel). Leave a blank line after the opening tag and
around the answer so the Markdown inside is formatted.

### Other things you might change

| To change… | Edit… |
|---|---|
| Colours and fonts | `src/styles/global.css` (the variables at the top) |
| Pass mark, questions per chapter, main quiz set | `src/lib/site.ts` |
| The Introduction page | `src/pages/introduction.astro` |
| Header, footer, logo | `src/components/Header.astro`, `Footer.astro`, `public/sparta-logo*.png` |
| A diagram | `src/components/diagrams/` (one file per diagram) |

### Adding a diagram to the notes

Most diagrams use three reusable building blocks, so you can add a new one with just a few lines of MDX and no drawing.
Import the one you need at the top of the chapter file, then place it under any topic:

```mdx
import Flow from '../../components/diagrams/Flow.astro';
import Compare from '../../components/diagrams/Compare.astro';
import Tiles from '../../components/diagrams/Tiles.astro';
import Cycle from '../../components/diagrams/Cycle.astro';
import Hub from '../../components/diagrams/Hub.astro';

<!-- A process: boxes joined by arrows (add loop="…" for a cycle) -->
<Flow caption="The review process (CTFL 3.2.2)" steps={[
  { title: 'Planning' }, { title: 'Individual review', sub: 'find anomalies' }, { title: 'Fixing & reporting' },
]} />

<!-- Two or three columns side by side (add middle="vs" between two) -->
<Compare caption="Static vs dynamic testing" columns={[
  { title: 'Static', sub: 'no code run', points: ['Finds defects directly'] },
  { title: 'Dynamic', sub: 'code is run', points: ['Finds failures'] },
]} />

<!-- Steps in a loop, with an optional centre label -->
<Cycle center="TDD" caption="Red, green, refactor" steps={[
  { title: 'Red', sub: 'write a failing test' }, { title: 'Green' }, { title: 'Refactor' },
]} />

<!-- A centre idea with related items around it -->
<Hub center="Test tools" caption="Tool categories" items={['Management', 'Static testing', 'DevOps']} />

<!-- A grid of tiles (cols defaults to 4) -->
<Tiles cols={3} caption="Roles in a review" tiles={[
  { title: 'Author', sub: 'creates and fixes it' }, { title: 'Moderator' }, { title: 'Scribe' },
]} />
```

The more detailed diagrams (V-model, state diagram, defect lifecycle and so on) each have their own file in
`src/components/diagrams/` and are used like `<VModel />`. Text inside the building blocks wraps automatically.

---

## How it's built

*For the full picture, read **[ARCHITECTURE.md](ARCHITECTURE.md)**.*

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
    │   └── diagrams/              SVG diagrams (Flow, Compare and Tiles are reusable)
    ├── layouts/BaseLayout.astro   The shared page shell (head, header, footer)
    ├── lib/
    │   ├── site.ts                Settings and helpers (pass mark, links)
    │   ├── svg.ts                 Text wrapping for diagrams
    │   ├── rehype-collapsible-sections.mjs   Makes each chapter section collapsible
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
