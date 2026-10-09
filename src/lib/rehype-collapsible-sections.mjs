/**
 * Rehype plugin: wraps each <h2> section of a chapter (e.g. "2.1 Testing in the Context of an SDLC")
 * and everything up to the next <h2> in a <details> element, so learners can open and close sections.
 */
export default function collapsibleSections() {
  return (tree) => {
    const out = [];
    let current = null;
    for (const node of tree.children) {
      if (node.type === 'element' && node.tagName === 'h2') {
        current = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['chapter-section__body'] },
          children: [],
        };
        out.push({
          type: 'element',
          tagName: 'details',
          properties: { className: ['chapter-section'] },
          children: [
            { type: 'element', tagName: 'summary', properties: {}, children: [node] },
            current,
          ],
        });
      } else if (current) {
        current.children.push(node);
      } else {
        out.push(node); // imports and any intro content before the first section
      }
    }
    tree.children = out;
  };
}
