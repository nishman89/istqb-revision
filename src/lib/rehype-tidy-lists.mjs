/**
 * Rehype plugin: turns the bullet lists in the chapter notes into neater layouts.
 *
 *   Key points   "- **Fast feedback** - on code quality · and regressions"
 *                → a grid of cards (bold title on top, description below; " · " becomes a new line).
 *                The column count suits the number of cards so grids stay symmetrical; a Pros/Cons pair
 *                becomes a side-by-side comparison, and 7+ points become a compact two-column list.
 *   Sentences    "- What is the difference between verification and validation?"
 *                → ordinary paragraphs, placed before any cards
 *   Short items  "- Test strategy  - Test techniques  - Level of coverage"
 *                → a compact row of tags
 *
 * Only unordered lists are touched; numbered lists are left alone.
 */
const SHORT_FRAGMENT = 6; // words - a short plain item in a card list becomes a title-only card
const TAG_MAX = 9; // words - lists where every item is this short become tags

const isEl = (n, tag) => n && n.type === 'element' && (!tag || n.tagName === tag);
const isBlank = (n) => n.type === 'text' && !n.value.trim();
const el = (tagName, className, children) => ({ type: 'element', tagName, properties: className ? { className: [className] } : {}, children });

export default function tidyLists() {
  return (tree) => visit(tree);
}

function visit(node) {
  if (!node.children) return;
  node.children = node.children.flatMap((child) => {
    if (isEl(child, 'ul')) return tidy(child);
    visit(child);
    return [child];
  });
}

/** An item's inline content (MDX sometimes wraps it in a <p>). */
function content(li) {
  const kids = li.children.filter((n) => !isBlank(n));
  return kids.length === 1 && isEl(kids[0], 'p') ? kids[0].children : kids;
}
const textOf = (nodes) => nodes.map((n) => (n.type === 'text' ? n.value : textOf(n.children ?? []))).join('');
const words = (nodes) => textOf(nodes).trim().split(/\s+/).filter(Boolean).length;
const startsBold = (nodes) => isEl(nodes[0], 'strong');
/** "**Title** - description" (a key point) vs "**Software testing** is a set of…" (a sentence that starts in bold). */
const isKeyPoint = (nodes) => {
  if (!startsBold(nodes)) return false;
  const next = nodes.slice(1).find((n) => !isBlank(n));
  return !next || (next.type === 'text' && /^\s*[-–:]\s/.test(next.value)) || (next.type === 'text' && !next.value.trim());
};
const PAIR = /^(pros|cons|benefits|drawbacks|advantages|disadvantages|strengths|limitations|risks)\b/i;
/** Columns that keep a grid symmetrical: 4 → 2×2, 5 → 3+2, 7 → 4+3 … (an odd last row is centred). */
const COLS = { 1: 1, 2: 2, 3: 3, 4: 2, 5: 3, 6: 3 };
const isSentence = (nodes) => /[.?!:…]$/.test(textOf(nodes).trim()) || words(nodes) > SHORT_FRAGMENT;

function tidy(ul) {
  const items = ul.children.filter((n) => isEl(n, 'li')).map(content);
  if (!items.length) return [ul];
  const hasKeyPoints = items.some(isKeyPoint);

  if (hasKeyPoints) {
    // Sentences become paragraphs; key points and short fragments become cards.
    const paras = items.filter((c) => !isKeyPoint(c) && isSentence(c)).map((c) => el('p', 'lead-in', c));
    const pts = items.filter((c) => isKeyPoint(c) || !isSentence(c));
    if (!pts.length) return paras;
    const titles = pts.map((c) => textOf(startsBold(c) ? c[0].children : c).trim());
    let layout = 'cards';
    if (pts.length === 2 && titles.every((t) => PAIR.test(t))) layout = 'cards versus'; // pros vs cons, side by side
    else if (pts.length >= 7) layout = 'deflist'; // long lists read better as a two-column list
    const list = el('ul', layout, pts.map(card));
    list.properties.style = `--cols: ${COLS[pts.length] ?? 3}`;
    return [...paras, list];
  }
  // An intro line ending in ":" (e.g. "Product risks may lead to:") becomes a sentence above the list.
  const intro = /:$/.test(textOf(items[0]).trim()) ? [el('p', 'lead-in', items.shift())] : [];
  if (items.length > 1 && items.every((c) => words(c) <= TAG_MAX && !/[.?!:]$/.test(textOf(c).trim()))) {
    return [...intro, el('ul', 'tags', items.map((c) => el('li', null, c)))];
  }
  if (intro.length) return [...intro, ...items.map((c) => el('p', 'lead-in', c))];
  return items.map((c) => el('p', 'lead-in', c));
}

function card(nodes) {
  let title, rest;
  if (isKeyPoint(nodes)) {
    [title, ...rest] = nodes;
    title = title.children;
    // drop the " - " that separated the title from its description
    if (rest[0]?.type === 'text') rest[0] = { ...rest[0], value: rest[0].value.replace(/^\s*-\s*/, '') };
    rest = rest.filter((n) => !isBlank(n));
  } else {
    title = nodes; // a short fragment: title-only card
    rest = [];
  }
  return el('li', 'card-item', [
    el('span', 'card-item__title', title),
    ...(rest.length ? [el('span', 'card-item__body', splitOnDots(rest))] : []),
  ]);
}

/** "a · b · c" -> a<br>b<br>c, so multi-part descriptions read as separate lines. */
function splitOnDots(nodes) {
  return nodes.flatMap((n) => {
    if (n.type !== 'text' || !n.value.includes(' · ')) return [n];
    return n.value.split(' · ').flatMap((part, i) => (i ? [el('br', null, []), { type: 'text', value: part }] : [{ type: 'text', value: part }]));
  });
}
