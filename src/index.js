import marked from 'marked';
import createRenderer from './createRenderer';

export function marksy (options = {}) {
  const tracker = {
    tree: null,
    elements: null,
    nextElementId: null,
    toc: null
  };
  const renderer = createRenderer(tracker, options)

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
