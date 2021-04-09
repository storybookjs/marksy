export const CodeComponent = options => props => {
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
};

export function codeRenderer(tracker, options) {
  return (code, language) => {
    // eslint-disable-next-line no-plusplus, no-param-reassign
    const elementId = tracker.nextElementId++;

    // eslint-disable-next-line no-param-reassign
    tracker.elements[elementId] = options.createElement(
      (options.elements && options.elements.code) || CodeComponent(options),
      { key: elementId, code, language }
    );

    tracker.tree.push(tracker.elements[elementId]);

    return `{{${elementId}}}`;
  };
}
