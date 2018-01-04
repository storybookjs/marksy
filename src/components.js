import marked from 'marked';
import { transform } from 'babel-standalone';
import createRenderer, { codeRenderer } from './createRenderer';

export function marksy(options = {}) {
  // eslint-disable-next-line no-param-reassign
  options.components = options.components || {};

  const tracker = {
    tree: null,
    elements: null,
    nextElementId: null,
    toc: null,
    currentId: [],
  };
  const renderer = createRenderer(tracker, options, {
    html(html) {
      try {
        const { code } = transform(html, {
          presets: ['react'],
        });
        const components = Object.keys(options.components).map(key => options.components[key]);
        const mockedReact = {
          createElement(tag, props = {}, ...children) {
            const componentProps =
              components.indexOf(tag) >= 0
                ? Object.assign(props || {}, {
                    // eslint-disable-next-line no-plusplus
                    key: tracker.nextElementId++,
                    context: tracker.context,
                  })
                : props;

            return options.createElement(tag, componentProps, children);
          },
        };

        tracker.tree.push(
          // eslint-disable-next-line no-new-func
          new Function('React', ...Object.keys(options.components), `return ${code}`)(
            mockedReact,
            ...components
          ) || null
        );
      } catch (e) {
        //
      }
    },
    code(code, language) {
      if (language === 'marksy') {
        return renderer.html(code);
      }
      return codeRenderer(tracker, options)(code, language);
    },
  });

  return function compile(content, markedOptions = {}, context = {}) {
    tracker.tree = [];
    tracker.elements = {};
    tracker.toc = [];
    tracker.nextElementId = 0;
    tracker.context = context;
    tracker.currentId = [];
    marked(content, Object.assign({ renderer, smartypants: true }, markedOptions));

    return { tree: tracker.tree, toc: tracker.toc };
  };
}

export default function(options) {
  return marksy(options);
}
