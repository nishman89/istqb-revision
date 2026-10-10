/**
 * Rehype plugin: makes the chapter notes collapsible at two levels, and adds wayfinding.
 *
 *   ## 4.2 Black-box Test Techniques        → <details class="chapter-section">   (closed by default)
 *     4.2.1 Equivalence Partitioning        → a sub-heading, where a section spans several sub-sections
 *     ### Equivalence Partitioning          → <details class="chapter-topic">     (closed by default)
 *
 * Each topic's collapsed bar shows its syllabus section number, and exercise topics are flagged.
 */
import { SECTION_TITLES } from '../data/syllabus-sections.mjs';

const el = (tagName, props, children) => ({ type: 'element', tagName, properties: props, children });
const text = (value) => ({ type: 'text', value });
const isHeading = (node, tag) => node.type === 'element' && node.tagName === tag;
const textOf = (n) => (n.type === 'text' ? n.value : (n.children ?? []).map(textOf).join(''));

/** The ref="…" of the first <SyllabusRef> in a list of nodes (MDX keeps components as JSX nodes here). */
function syllabusRef(nodes) {
  for (const n of nodes) {
    if (n.type === 'mdxJsxFlowElement' && n.name === 'SyllabusRef') {
      return n.attributes.find((a) => a.name === 'ref')?.value ?? null;
    }
  }
  return null;
}

/** Wrap each `tag` heading and the nodes after it (until the next one) in a closed <details>. */
function wrap(nodes, tag, className) {
  const out = [];
  let body = null;
  for (const node of nodes) {
    if (isHeading(node, tag)) {
      body = el('div', { className: [`${className}__body`] }, []);
      out.push(el('details', { className: [className] }, [el('summary', {}, [node]), body]));
    } else if (body) {
      body.children.push(node);
    } else {
      out.push(node); // anything before the first heading (e.g. imports, an intro)
    }
  }
  return out;
}

/** Inside one section: topic badges, exercise flags and sub-section headings. */
function decorateTopics(sectionNo, topics) {
  const out = [];
  const keys = [];
  let key = sectionNo;
  for (const node of topics) {
    if (node.tagName !== 'details') { out.push(node); continue; }
    const [summary, body] = node.children;
    const title = textOf(summary).trim();
    const ref = syllabusRef(body.children);
    if (ref) summary.children.push(el('span', { className: ['topic-ref'] }, [text(ref)]));
    if (/^(exercise|worked example)\b/i.test(title)) node.properties.className.push('chapter-topic--exercise');
    // which sub-section does this topic belong to? (refs from other sections, e.g. recaps, stay in the current group)
    if (ref && ref.split('.').length === 3 && ref.startsWith(sectionNo + '.')) key = ref;
    keys.push(key);
    out.push({ key, node });
  }
  if (new Set(keys.filter((k) => k !== sectionNo)).size < 2) return out.map((x) => x.node ?? x);
  const result = [];
  let last = null;
  for (const item of out) {
    if (!item.node) { result.push(item); continue; }
    if (item.key !== last && item.key !== sectionNo && SECTION_TITLES[item.key]) {
      result.push(el('p', { className: ['topic-group'] }, [el('span', {}, [text(item.key)]), text(' ' + SECTION_TITLES[item.key])]));
    }
    last = item.key;
    result.push(item.node);
  }
  return result;
}

/** "1.3 The Seven Testing Principles" and "The Seven Testing Principles" compare equal. */
const sameTitle = (a, b) => {
  const norm = (t) => t.toLowerCase().replace(/&/g, 'and').replace(/^[\d.]+\s*/, '').replace(/[^a-z0-9]/g, '');
  return norm(a) === norm(b);
};

/**
 * If a section's first topic has the same title as the section (e.g. "1.3 The Seven Testing Principles"
 * → "The Seven Testing Principles"), its content is the section's introduction: show it as soon as the
 * section opens, not in a collapsible topic of its own. The heading stays (visually hidden) so links still work.
 */
function promoteIntro(sectionTitle, nodes) {
  const first = nodes.find((n) => n.type === 'element' && n.tagName === 'details');
  if (!first || !(first.properties.className ?? []).includes('chapter-topic')) return nodes;
  const heading = first.children[0].children.find((n) => n.tagName === 'h3');
  if (!heading || !sameTitle(textOf(heading), sectionTitle)) return nodes;
  heading.properties = { ...heading.properties, className: ['visually-hidden'] };
  const intro = el('div', { className: ['section-intro'] }, [heading, ...first.children[1].children]);
  return nodes.map((n) => (n === first ? intro : n));
}

/** Stable test hooks: data-testid="section-1-2" / "topic-1-2-3" (section n, topic m) on each <details>. */
function addTestIds(tree) {
  tree.children.filter((n) => n.tagName === 'details').forEach((section, si) => {
    const no = textOf(section.children[0]).trim().split(/\s+/)[0].replace(/\./g, '-');
    section.properties = { ...section.properties, dataTestid: `section-${no}` };
    let t = 0;
    for (const n of section.children[1].children) {
      if (n.type === 'element' && n.tagName === 'details') {
        t += 1;
        n.properties = { ...n.properties, dataTestid: `topic-${no}-${t}` };
      } else if (n.type === 'element' && (n.properties?.className ?? []).includes('section-intro')) {
        n.properties = { ...n.properties, dataTestid: `section-${no}-intro` };
      }
    }
  });
}

export default function collapsibleSections() {
  return (tree) => {
    tree.children = wrap(tree.children, 'h2', 'chapter-section');
    for (const section of tree.children) {
      if (section.tagName !== 'details') continue;
      const body = section.children[1];
      const sectionTitle = textOf(section.children[0]).trim();
      const sectionNo = sectionTitle.split(/\s+/)[0];
      body.children = promoteIntro(sectionTitle, decorateTopics(sectionNo, wrap(body.children, 'h3', 'chapter-topic')));
      // the learner marks each section as done themselves (handled by the chapter page script)
      body.children.push(el('div', { className: ['section-done', 'no-print'] }, [
        el('button', { type: 'button', className: ['section-done__btn'], dataSectionDone: sectionNo, dataTestid: `section-done-${sectionNo.replace(/\./g, '-')}`, ariaPressed: 'false' },
          [{ type: 'text', value: '✓ Mark section as done' }]),
      ]));
    }
    addTestIds(tree);
  };
}
