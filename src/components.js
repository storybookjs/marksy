import React from 'react';
import createRenderer from './createRenderer';
import marked from 'marked';
import {transform} from 'babel-standalone';

export function marksy (options = {}) {
  options.components = options.components || {};

  const tracker = {
    tree: null,
    elements: null,
    nextElementId: null,
    toc: null
  };
  const renderer = createRenderer(tracker, options, {
    html (html) {
      try {
        const code = transform(html, {
          presets: ['react']
        }).code;
        const components = Object.keys(options.components).map(function (key) {
          return options.components[key];
        });

        tracker.tree.push(React.createElement(function () {
          return new Function('React', ...Object.keys(options.components), `return ${code}`)(React, ...components) || null;
        }, {key: tracker.nextElementId++}));
      } catch (e) {}
    },
    code (code, language) {
      if (language === 'marksy') {
        return renderer.html(code)
      } else {
        const elementId = tracker.nextElementId++;

        function CodeComponent () {
          return <pre><code className={`hljs ${language}`} dangerouslySetInnerHTML={{__html: options.highlight ? options.highlight.highlightAuto(code).value : code}}></code></pre>
        }

        tracker.elements[elementId] = React.createElement(CodeComponent, {key: elementId});

        tracker.tree.push(tracker.elements[elementId]);

        return `{{${elementId}}}`;
      }
    }
  })

  return function compile (content, markedOptions = {}) {
    tracker.tree = [];
    tracker.elements = {};
    tracker.toc = [];
    tracker.nextElementId = 0;
    marked(content, Object.assign({renderer: renderer, smartypants: true}, markedOptions));

    return {tree: tracker.tree, toc: tracker.toc};
  };
}


export default function (options) {
  return marksy(options)
};
