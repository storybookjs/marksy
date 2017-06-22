import createRenderer from './createRenderer';
import marked from 'marked';
import {transform} from 'babel-standalone';

export function marksy (options = {}) {
  options.components = options.components || {};

  function HtmlWrapper(props) {
    return options.createElement('div', null, props.children);
  }

  function CodeComponent (props) {
    return options.createElement('pre', null, options.createElement('code', {
      className: `hljs ${props.language}`,
      dangerouslySetInnerHTML: {__html: options.highlight ? options.highlight.highlightAuto(props.code).value : props.code}
    }))
  }

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
        const mockedReact = {createElement(tag, props = {}, ...children) {
          const componentProps = components.indexOf(tag) >= 0 ? Object.assign(props || {}, {key: tracker.nextElementId++, context: tracker.context}) : props;

          return options.createElement(tag, componentProps, children);
        }};

        tracker.tree.push(options.createElement(HtmlWrapper, {
          key: tracker.nextElementId++
        }, new Function('React', ...Object.keys(options.components), `return ${code}`)(mockedReact, ...components) || null));
      } catch (e) {}
    },
    code (code, language) {
      if (language === 'marksy') {
        return renderer.html(code)
      } else {
        const elementId = tracker.nextElementId++;

        tracker.elements[elementId] = options.createElement((options.elements && options.elements.code) || CodeComponent, {key: elementId, code, language});

        tracker.tree.push(tracker.elements[elementId]);

        return `{{${elementId}}}`;
      }
    }
  })

  return function compile (content, markedOptions = {}, context = {}) {
    tracker.tree = [];
    tracker.elements = {};
    tracker.toc = [];
    tracker.nextElementId = 0;
    tracker.context = context;
    marked(content, Object.assign({renderer: renderer, smartypants: true}, markedOptions));

    return {tree: tracker.tree, toc: tracker.toc};
  };
}


export default function (options) {
  return marksy(options)
};
