import React from 'react';
import marked from 'marked';
import he from 'he';
import {transform} from 'babel-standalone';

export function marksy (options = {}) {
  options.components = options.components || {};

  const renderer = new marked.Renderer();
  let tree = [];
  let elements = {};
  let nextElementId = 0;

  function populateInlineContent (content = '') {
    const contentArray = content.split(/(\{\{.*?\}\})/);
    const extractedElements = contentArray.map(function (text) {
      const elementIdMatch = text.match(/\{\{(.*)\}\}/);
      if (elementIdMatch) {
        tree.splice(tree.indexOf(elements[elementIdMatch[1]]), 1)
        return elements[elementIdMatch[1]];
      } else if (text != '') {
        return he.decode(text);
      }

      return null;
    });

    return extractedElements;
  }

  function addElement (tag, props = {}, children) {
    const elementId = nextElementId++;
    let inlineContent = null;

    if (children) {
      inlineContent = Array.isArray(children) ? children.map(populateInlineContent) : populateInlineContent(children)
    }

    elements[elementId] = React.createElement(tag, Object.assign({
      key: elementId
    }, props), inlineContent);

    tree.push(elements[elementId]);

    return `{{${elementId}}}`;
  }

  renderer.code = (code, language) => {
    if (language === 'marksy') {
      return renderer.html(code)
    } else {
      const elementId = nextElementId++;

      elements[elementId] = React.createElement('pre', {
        key: elementId,
        className: `language-${language}`
      }, React.createElement('code', {
        className: `language-${language}`
      }, code));

      tree.push(elements[elementId]);

      return `{{${elementId}}}`
    }
  };

  renderer.html = function (html) {
    try {
      const code = transform(html, {
        presets: ['react']
      }).code;
      const components = Object.keys(options.components).map(function (key) {
        return options.components[key];
      });

      tree.push(React.createElement(function () {
        return new Function('React', ...Object.keys(options.components), `return ${code}`)(React, ...components);
      }, {key: nextElementId++}));
    } catch (e) {}
  };

  renderer.paragraph = (text) => addElement('p', null, text)

  renderer.blockquote = (text) => addElement('blockquote', null, text);

  renderer.link = (href, title, text) => addElement('a', {href, title}, text);

  renderer.br = () => addElement('br');

  renderer.hr = () => addElement('hr');

  renderer.strong = (text) => addElement('strong', null, text);

  renderer.del = (text) => addElement('del', null, text);

  renderer.em = (text) => addElement('em', null, text);

  renderer.heading = (text, level) => {
    const id = text.replace(/\s/g, '-').toLowerCase();

    return addElement(`h${level}`, null, text);
  }

  renderer.list = (body, ordered) => {
    return addElement(ordered ? 'ol' : 'ul', null, body);
  }

  renderer.listitem = (text) => {
    return addElement('li', null, text);
  }

  renderer.table = (header, body) => {
    return addElement('table', null, [
      addElement('thead', null, header),
      addElement('tbody', null, body)
    ]);
  }

  renderer.thead = (content) => {
    return addElement('thead', null, content)
  }

  renderer.tbody = (content) => {
    return addElement('tbody', null, content)
  }

  renderer.tablerow = (content) => {
    return addElement('tr', null, content)
  }

  renderer.tablecell = (content, flag) => {
    const tag = flag.header ? 'th' : 'td'
    return addElement('tr', {className: flag.align ? `text-${flag.align}` : undefined}, content)
  }

  renderer.codespan = (text) => {
    return addElement('code', null, text)
  }

  renderer.image = (href, title, text) => {
    return addElement('img', {src: href, alt: text})
  }

  return function compile (content, markedOptions = {}) {
    tree = [];
    elements = {};
    nextElementId = 0;
    marked(content, Object.assign({renderer: renderer, smartypants: true}, markedOptions));

    return {tree};
  };
}


export default function (options) {
  return marksy(options)
};
