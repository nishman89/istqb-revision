/**
 * Rehype plugin: turns "key point" lists into cards.
 *
 * A list where every item starts with bold text, e.g.
 *   - **Fast feedback** - on code quality · and on regressions
 * becomes <ul class="cards"> where each item has a title and a body.
 * " · " separators in the body become separate lines. Plain lists are left alone.
 */
const isEl = (n, tag) => n && n.type === 'element' && (!tag || n.tagName === tag);
const isBlank = (n) => n.type === 'text' && !n.value.trim();

export default function topicCards() {
  return (tree) => visit(tree);
}

function visit(node) {
  if (!node.children) return;
  for (const child of node.children) {
    if (isEl(child, 'ul') && isCardList(child)) toCards(child);
    visit(child);
  }
}

function itemContent(li) {
  // MDX may wrap item text in a <p>
  const kids = li.children.filter((n) => !isBlank(n));
  return kids.length === 1 && isEl(kids[0], 'p') ? kids[0].children : kids;
}

function isCardList(ul) {
  const items = ul.children.filter((n) => isEl(n, 'li'));
  return items.length > 0 && items.every((li) => isEl(itemContent(li)[0], 'strong'));
}

function toCards(ul) {
  ul.properties = { ...ul.properties, className: ['cards'] };
  for (const li of ul.children.filter((n) => isEl(n, 'li'))) {
    const [title, ...rest] = itemContent(li);
    // drop the " - " that separated the title from its description
    if (rest[0]?.type === 'text') rest[0] = { ...rest[0], value: rest[0].value.replace(/^\s*-\s*/, '') };
    const body = splitOnDots(rest.filter((n) => !(n.type === 'text' && !n.value.trim())));
    li.properties = { className: ['card-item'] };
    li.children = [
      { type: 'element', tagName: 'span', properties: { className: ['card-item__title'] }, children: title.children },
      ...(body.length ? [{ type: 'element', tagName: 'span', properties: { className: ['card-item__body'] }, children: body }] : []),
    ];
  }
}

/** "a · b · c" -> a<br>b<br>c, so multi-part descriptions read as separate lines. */
function splitOnDots(nodes) {
  return nodes.flatMap((n) => {
    if (n.type !== 'text' || !n.value.includes(' · ')) return [n];
    return n.value.split(' · ').flatMap((part, i) =>
      i ? [{ type: 'element', tagName: 'br', properties: {}, children: [] }, { type: 'text', value: part }] : [{ type: 'text', value: part }],
    );
  });
}
