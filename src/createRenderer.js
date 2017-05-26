import React from 'react';
import marked from 'marked';
import he from 'he';

export default function createRenderer (tracker, options, overrides = {}) {
  const renderer = new marked.Renderer();

  function getTocPosition (toc, level) {
    var currentLevel = toc.children;
    while (true) {
      if (!currentLevel.length || currentLevel[currentLevel.length - 1].level === level) {
        return currentLevel;
      } else {
        currentLevel = currentLevel[currentLevel.length - 1].children;
      }
    }
  }

  function populateInlineContent (content = '') {
    const contentArray = content.split(/(\{\{.*?\}\})/);
    const extractedElements = contentArray.map(function (text) {
      const elementIdMatch = text.match(/\{\{(.*)\}\}/);
      if (elementIdMatch) {
        tracker.tree.splice(tracker.tree.indexOf(tracker.elements[elementIdMatch[1]]), 1)
        return tracker.elements[elementIdMatch[1]];
      } else if (text != '') {
        return he.decode(text);
      }

      return null;
    });

    return extractedElements;
  }

  function addElement (tag, props = {}, children) {
    const elementId = tracker.nextElementId++;
    let inlineContent = null;

    if (children) {
      inlineContent = Array.isArray(children) ? children.map(populateInlineContent) : populateInlineContent(children)
    }

    tracker.elements[elementId] = React.createElement(options[tag] || tag, Object.assign({
      key: elementId
    }, props), inlineContent);

    tracker.tree.push(tracker.elements[elementId]);

    return `{{${elementId}}}`;
  }

  renderer.code = overrides.code || function (code, language) {
    const elementId = tracker.nextElementId++;

    tracker.elements[elementId] = React.createElement('pre', {
      key: elementId,
      className: `language-${language}`
    }, React.createElement('code', {
      className: `language-${language}`
    }, code));

    tracker.tree.push(tracker.elements[elementId]);

    return `{{${elementId}}}`;
  };

  renderer.html = overrides.html || function (html) {
    const elementId = tracker.nextElementId++;

    tracker.tree.push(React.createElement('div', {
      key: elementId,
      dangerouslySetInnerHTML: {
        __html: html
      }
    }))
  };

  renderer.paragraph = overrides.paragraph || function (text) {
    return addElement('p', null, text);
  }

  renderer.blockquote = overrides.blockquote || function (text) {
    return addElement('blockquote', null, text);
  }

  renderer.link = overrides.link || function (href, title, text) {
    return addElement('a', {href, title}, text);
  }

  renderer.br = overrides.br || function () {
    return addElement('br');
  }

  renderer.hr = overrides.hr || function () {
    return addElement('hr');
  }

  renderer.strong = overrides.strong || function (text) {
    return addElement('strong', null, text);
  }

  renderer.del = overrides.del || function (text) {
    return addElement('del', null, text);
  }

  renderer.em = overrides.em || function (text) {
    return addElement('em', null, text);
  }

  renderer.heading = overrides.heading || function (text, level) {
    const id = text.replace(/\s/g, '-').toLowerCase();
    const lastToc = tracker.toc[tracker.toc.length - 1];

    if (!lastToc || lastToc.level > level) {
      tracker.toc.push({
        id: id,
        title: text,
        level: level,
        children: []
      });
    } else {
      const tocPosition = getTocPosition(lastToc, level);

      tocPosition.push({
        id: id,
        title: text,
        level: level,
        children: []
      });
    }

    return addElement(`h${level}`, null, text);
  }

  renderer.list = overrides.list || function (body, ordered) {
    return addElement(ordered ? 'ol' : 'ul', null, body);
  }

  renderer.listitem = overrides.listitem || function (text) {
    return addElement('li', null, text);
  }

  renderer.table = overrides.table || function (header, body) {
    return addElement('table', null, [
      addElement('thead', null, header),
      addElement('tbody', null, body)
    ]);
  }

  renderer.thead = overrides.thead || function (content) {
    return addElement('thead', null, content)
  }

  renderer.tbody = overrides.tbody || function (content) {
    return addElement('tbody', null, content)
  }

  renderer.tablerow = overrides.tablerow || function (content) {
    return addElement('tr', null, content)
  }

  renderer.tablecell = overrides.tablecell || function (content, flag) {
    const tag = flag.header ? 'th' : 'td'
    return addElement('tr', {className: flag.align ? `text-${flag.align}` : undefined}, content)
  }

  renderer.codespan = overrides.codespan || function (text) {
    return addElement('code', null, text)
  }

  renderer.image = overrides.image || function (href, title, text) {
    return addElement('img', {src: href, alt: text})
  }

  return renderer;
}
