import { CodeComponent } from './codeRenderer';

export function renderIntermediateTree(treeWrap = { tree: [] }, options = {}) {
  const tracker = {
    tree: null,
    elements: null,
    nextElementId: null,
    toc: null,
    currentId: [],
  };
  tracker.tree = [];
  tracker.elements = {};
  tracker.toc = [];
  tracker.nextElementId = 0;
  tracker.currentId = [];

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

  const specialRenderers = {
    code: ({ code, language }) => {
      if (language === 'marksy') {
        try {
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

          return (
            // eslint-disable-next-line no-new-func
            new Function('h', ...Object.keys(options.components), `return ${code}`)(
              mockedReact,
              ...components
            ) || null
          );
        } catch (e) {
          //
        }
        return null;
      }
      return CodeComponent(options)({ code, language });
    },
    heading: ({ text, level }) => {
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

      // eslint-disable-next-line no-use-before-define
      return options.createElement(
        `h${level}`,
        {
          id,
        },
        text
      );
    },
  };

  function parseTreeNode(astNode) {
    if (typeof astNode === 'string' || !astNode) {
      return astNode;
    }
    if (Array.isArray(astNode)) {
      // eslint-disable-next-line no-plusplus
      const elementId = tracker.nextElementId++;
      const type = astNode[0];
      let customTagRenderer = null;
      if (!type) {
        throw new Error(`no type for node: ${astNode}`);
      }
      const props = astNode[1] || {};
      let children = null;
      if (specialRenderers[type]) {
        return specialRenderers[type](props, children);
      }

      if (options.elements?.[type]) {
        customTagRenderer = options.elements[type];
      }

      if (astNode[2]) {
        children = Array.isArray(astNode[2])
          ? astNode[2].map(node => parseTreeNode(node))
          : astNode[2];
      }
      return options.createElement(
        customTagRenderer || type,
        {
          key: elementId,
          ...props,
        },
        children
      );
    }
    throw new Error(`unknown type of astNode: ${typeof astNode}/ ${astNode}`);
  }

  const tree = treeWrap.tree.map(parseTreeNode);
  return { tree, toc: tracker.toc };
}
