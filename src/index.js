import React from 'react';
import marked from 'marked';
import he from 'he';
import {transform} from 'babel-standalone';
import CodeComponent from './CodeComponent';

export function marksy (options = {}) {
  options.components = options.components || {};

  const renderer = new marked.Renderer();
  const tree = [];
  const elements = {};
  let nextElementId = 0;

function populateInlineContent (content) {
    const contentArray = content.split(/(\{\{.*?\}\})/);
    const extractedElements = contentArray.map(function (text) {
      const elementIdMatch = text.match(/\{\{(.*)\}\}/);
      if (elementIdMatch) {
        return elements[elementIdMatch[1]];
      } else if (text != '') {
        return he.decode(text);
      }

      return null;
    });

    return extractedElements;
  }

  function addElement (tag, props = {}, children = '') {
    const elementId = nextElementId++;

    elements[elementId] = React.createElement(tag, Object.assign({
      key: elementId
    }, props), populateInlineContent(children));

    tree.push(elements[elementId]);

    return `{{${elementId}}}`;
  }

  renderer.code = (code, language) => addElement('code', {language, code});
  
  renderer.html = function (html) {
    try {
      const code = transform(html, {
        presets: ['react']
      }).code;
      const components = Object.keys(options.components).map(function (key) {
        return options.components[key];
      });

      result.push(React.createElement(function () {
        return new Function('React', ...Object.keys(options.components), `return ${code}`)(React, ...components);
      }));
    } catch (e) {}
  };
  
  renderer.paragraph = (text) => addElement('p', null, text);
  
  renderer.blockquote = (text) => addElement('blockquote', null, text);
  
  renderer.link = (href, title, text) => addElement('a', {href, title}, text);
  
  renderer.br = () => addElement('br');
  
  renderer.hr = () => addElement('hr');
  
  renderer.strong = (text) => addElement('strong', null, text);
  
  renderer.del = (text) => addElement('del', null, text);
  
  renderer.em = (text) => addElement('em', null, text);

  renderer.heading = (text, level) => {
    const id = text.replace(/\s/g, '-').toLowerCase();

    return addElement(`h${level}`, {id}, text);
  }

  return function compile (content) {
    marked(content, {renderer: renderer, smartypants: true});

    return {tree};
  };
}


export default function (options) {
  return marksy(options)
};
