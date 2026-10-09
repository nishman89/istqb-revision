/**
 * Rehype plugin: makes the chapter notes collapsible at two levels.
 *
 *   ## 2.1 Testing in the Context of an SDLC   → <details class="chapter-section">  (closed by default)
 *     ### SDLC Models                          → <details class="chapter-topic">  (closed by default)
 *
 * Each heading becomes the <summary> of its block, so clicking it opens or closes everything
 * up to the next heading of the same level.
 */
const el = (tagName, props, children) => ({ type: 'element', tagName, properties: props, children });
const isHeading = (node, tag) => node.type === 'element' && node.tagName === tag;

/** Wrap each `tag` heading and the nodes after it (until the next one) in a <details>. */
function wrap(nodes, tag, className, open) {
  const out = [];
  let body = null;
  for (const node of nodes) {
    if (isHeading(node, tag)) {
      body = el('div', { className: [`${className}__body`] }, []);
      out.push(el('details', { className: [className], ...(open ? { open: true } : {}) }, [el('summary', {}, [node]), body]));
    } else if (body) {
      body.children.push(node);
    } else {
      out.push(node); // anything before the first heading (e.g. imports, an intro)
    }
  }
  return out;
}

export default function collapsibleSections() {
  return (tree) => {
    tree.children = wrap(tree.children, 'h2', 'chapter-section', false);
    for (const section of tree.children) {
      const body = section.tagName === 'details' && section.children[1];
      if (body) body.children = wrap(body.children, 'h3', 'chapter-topic', false);
    }
  };
}
