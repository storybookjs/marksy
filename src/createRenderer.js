import marked from 'marked';
import he from 'he';

export function codeRenderer(tracker, options) {
  function CodeComponent(props) {
    let children;
    try {
      // eslint-disable-next-line react/no-danger-with-children
      children = options.createElement(
        'code',
        {
          className: `language-${props.language}`,
          dangerouslySetInnerHTML: options.highlight
            ? { __html: options.highlight(props.language, props.code) }
            : null,
        },
        options.highlight ? null : props.code
      );
    } catch (e) {
      // eslint-disable-next-line
      console.warn(`${props.language} is not supported by your defined highlighter.`);
      children = options.createElement('code', null, props.code);
    }

    return options.createElement('pre', null, children);
  }

  return (code, language) => {
    // eslint-disable-next-line no-plusplus, no-param-reassign
    const elementId = tracker.nextElementId++;

    // eslint-disable-next-line no-param-reassign
    tracker.elements[elementId] = options.createElement(
      (options.elements && options.elements.code) || CodeComponent,
      { key: elementId, code, language }
    );

    tracker.tree.push(tracker.elements[elementId]);

    return `{{${elementId}}}`;
  };
}

export default function createRenderer(tracker, options, overrides = {}) {
  const renderer = new marked.Renderer();

  function getTocPosition(toc, level) {
    let currentLevel = toc.children;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (!currentLevel.length || currentLevel[currentLevel.length - 1].level === level) {
        return currentLevel;
      }
      currentLevel = currentLevel[currentLevel.length - 1].children;
    }
  }

  function populateInlineContent(content = '') {
    const contentArray = content.split(/(\{\{.*?\}\})/);
    const extractedElements = contentArray.map((text) => {
      const elementIdMatch = text.match(/\{\{(.*)\}\}/);
      if (elementIdMatch) {
        tracker.tree.splice(tracker.tree.indexOf(tracker.elements[elementIdMatch[1]]), 1);
        return tracker.elements[elementIdMatch[1]];
      }
      if (text !== '') {
        return he.decode(text);
      }

      return null;
    });

    return extractedElements;
  }

  function addElement(tag, props = {}, children, type = tag) {
    // eslint-disable-next-line no-plusplus, no-param-reassign
    const elementId = tracker.nextElementId++;
    let inlineContent = null;

    const elementType = options.elements && options.elements[type];

    if (children) {
      inlineContent = Array.isArray(children)
        ? children.map(populateInlineContent)
        : populateInlineContent(children);
    }

    // eslint-disable-next-line no-param-reassign
    tracker.elements[elementId] = options.createElement(
      elementType || tag,
      {
        key: elementId,
        ...props,
        ...(elementType ? { context: tracker.context } : {}),
      },
      inlineContent
    );

    tracker.tree.push(tracker.elements[elementId]);

    return `{{${elementId}}}`;
  }

  renderer.code = overrides.code || codeRenderer(tracker, options);

  renderer.html =
    overrides.html ||
    ((html) => {
      // eslint-disable-next-line no-plusplus, no-param-reassign
      const elementId = tracker.nextElementId++;

      tracker.tree.push(
        options.createElement('div', {
          key: elementId,
          dangerouslySetInnerHTML: {
            __html: html,
          },
        })
      );
    });

  renderer.paragraph = overrides.paragraph || ((text) => addElement('p', null, text));

  renderer.blockquote = overrides.blockquote || ((text) => addElement('blockquote', null, text));

  renderer.link = overrides.link || ((href, title, text) => addElement('a', { href, title }, text));

  renderer.br = overrides.br || (() => addElement('br'));

  renderer.hr = overrides.hr || (() => addElement('hr'));

  renderer.strong = overrides.strong || ((text) => addElement('strong', null, text));

  renderer.del = overrides.del || ((text) => addElement('del', null, text));

  renderer.em = overrides.em || ((text) => addElement('em', null, text));

  renderer.heading =
    overrides.heading ||
    ((text, level) => {
      // eslint-disable-next-line no-param-reassign
      tracker.currentId = tracker.currentId.slice(0, level - 1);
      tracker.currentId.push(text.replace(/\s/g, '-').toLowerCase());

      const id = tracker.currentId.join('-');
      const lastToc = tracker.toc[tracker.toc.length - 1];

      if (!lastToc || lastToc.level > level) {
        tracker.toc.push({
          id,
          title: text,
          level,
          children: [],
        });
      } else {
        const tocPosition = getTocPosition(lastToc, level);

        tocPosition.push({
          id,
          title: text,
          level,
          children: [],
        });
      }

      return addElement(
        `h${level}`,
        {
          id,
        },
        text
      );
    });

  renderer.list =
    overrides.list || ((body, ordered) => addElement(ordered ? 'ol' : 'ul', null, body));

  renderer.listitem = overrides.listitem || ((text) => addElement('li', null, text));

  renderer.table =
    overrides.table ||
    ((header, body) =>
      addElement('table', null, [
        addElement('thead', null, header),
        addElement('tbody', null, body),
      ]));

  renderer.thead = overrides.thead || ((content) => addElement('thead', null, content));

  renderer.tbody = overrides.tbody || ((content) => addElement('tbody', null, content));

  renderer.tablerow = overrides.tablerow || ((content) => addElement('tr', null, content));

  renderer.tablecell =
    overrides.tablecell ||
    ((content, flag) => {
      const tag = flag.header ? 'th' : 'td';
      return addElement(tag, { className: flag.align ? `text-${flag.align}` : undefined }, content);
    });

  renderer.codespan = overrides.codespan || ((text) => addElement('code', null, text, 'codespan'));

  renderer.image =
    overrides.image || ((href, title, text) => addElement('img', { src: href, alt: text }));

  return renderer;
}
