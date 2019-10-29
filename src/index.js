import marked from 'marked';
import createRenderer, { codeRenderer } from './createRenderer';

export function marksy(options = {}) {
  const tracker = {
    tree: null,
    elements: null,
    nextElementId: null,
    toc: null,
    currentIdLevel: 0,
    currentId: [],
  };
  const renderer = createRenderer(tracker, options, {
    code(code, language) {
      if (language === 'marksy') {
        try {
          // eslint-disable-next-line no-plusplus
          const elementId = tracker.nextElementId++;

          const components = Object.keys(options.components).map(key => options.components[key]);
          const mockedReact = (tag, props = {}, ...children) => {
            const componentProps =
              components.indexOf(tag) >= 0
                ? Object.assign(props || {}, {
                    // eslint-disable-next-line no-plusplus
                    key: tracker.nextElementId++,
                    context: tracker.context,
                  })
                : props;

            return options.createElement(tag, componentProps, children);
          };

          tracker.elements[elementId] =
            // eslint-disable-next-line no-new-func
            new Function('h', ...Object.keys(options.components), `return ${code}`)(
              mockedReact,
              ...components
            ) || null;

          tracker.tree.push(tracker.elements[elementId]);

          return `{{${elementId}}}`;
        } catch (e) {
          //
        }
        return null;
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
    marked(content, { renderer, smartypants: true, ...markedOptions });

    return { tree: tracker.tree, toc: tracker.toc };
  };
}

export default function(options) {
  return marksy(options);
}
