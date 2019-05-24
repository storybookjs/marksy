/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import Preact from 'preact';
import preactRenderToString from 'preact-render-to-string';
import { renderToString as infernoRenderToString } from 'inferno-server';
import { createElement as infernoCreateElement } from 'inferno-create-element';
import { render } from 'react-testing-library';

import Prism from 'prismjs';
import hljs from 'highlight.js/lib/highlight';
import hljsJs from 'highlight.js/lib/languages/javascript';
import hljsXml from 'highlight.js/lib/languages/xml';

// eslint-disable-next-line
import marksy from './';
import marksyComponents from './jsx';

hljs.registerLanguage('javascript', hljsJs);
hljs.registerLanguage('xml', hljsXml);

// eslint-disable-next-line
class TestComponent extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  render() {
    return <div>{this.props.children}</div>;
  }
}

it('should be able to compile text', () => {
  const compile = marksy({ createElement });
  const compiled = compile('hello');
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile strong text', () => {
  const compile = marksy({ createElement });
  const compiled = compile('hello **there**');
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile italic text', () => {
  const compile = marksy({ createElement });
  const compiled = compile('hello *there*');
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile links', () => {
  const compile = marksy({ createElement });
  const compiled = compile('[my link](http://example.com)');
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile headers', () => {
  const compile = marksy({ createElement });
  const compiled = compile(`
# header1
## header2
### header3
#### header4
  `);
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should handle same name nested headers', () => {
  const compile = marksy({ createElement });
  const compiled = compile(`
# header1
## header2
# header3
## header2
  `);
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile ordered list', () => {
  const compile = marksy({ createElement });
  const compiled = compile(`
1. foo
2. bar
  `);
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile list', () => {
  const compile = marksy({ createElement });
  const compiled = compile(`
- foo
- bar
  `);
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile tables', () => {
  const compile = marksy({ createElement });
  const compiled = compile(`
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
  `);
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile codespans', () => {
  const compile = marksy({ createElement });
  const compiled = compile('install with `$ npm install`');
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile image', () => {
  const compile = marksy({ createElement });
  const compiled = compile('![test](http://some.com/image.png)');
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile html', () => {
  const compile = marksy({ createElement });
  const compiled = compile('<div>hello</div>');
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile html as components', () => {
  const compile = marksyComponents({ createElement });
  const compiled = compile('<div>hello</div>');
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile components', () => {
  const compile = marksyComponents({
    createElement,
    components: {
      Test() {
        return <div>mip</div>;
      },
    },
  });
  const compiled = compile('<Test />');
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile components using H and marksy language', () => {
  const compile = marksy({
    createElement,
    components: {
      Test() {
        return <div>mip</div>;
      },
    },
  });
  const compiled = compile('```marksy\nh(Test)\n```');
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile components using marksy language', () => {
  const compile = marksyComponents({
    createElement,
    components: {
      Test() {
        return <div>mip</div>;
      },
    },
  });
  const compiled = compile('```marksy\n<Test />\n```');
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should show source instead of compiling components when using other languages', () => {
  const compile = marksyComponents({
    createElement,
    components: {
      Test() {
        return <div>mip</div>;
      },
    },
  });
  const compiled = compile('```js\n<Test />\n```');
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile nested lists', () => {
  const compile = marksy({ createElement });
  const compiled = compile(`
- Colors
    - Red
    - Blue
- Shape
  - Triangle
  - Rectangle
  `);
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to combine in compilation', () => {
  const compile = marksy({ createElement });
  const compiled = compile(`
# hey

- foo

-bar
  `);
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should produce TOC', () => {
  const compile = marksy({ createElement });
  const compiled = compile(`
# foo

## bar

### baz
  `);

  expect(JSON.stringify(compiled.toc, null, 2)).toMatchSnapshot();
});

it('should produce custom tags', () => {
  const compile = marksy({
    createElement,
    elements: {
      h1(props) {
        return <div>{props.children}</div>;
      },
    },
  });
  const compiled = compile(`
# foo
  `);

  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should work with Preact', () => {
  const compile = marksy({
    createElement: Preact.h,
    elements: {
      h1(props) {
        return Preact.h('div', null, props.children);
      },
    },
  });
  const compiled = compile(`
# foo
  `);

  expect(preactRenderToString(Preact.h('div', null, compiled.tree))).toMatchSnapshot();
});

it('should work with Inferno', () => {
  const compile = marksy({
    createElement: infernoCreateElement,
    elements: {
      h1(props) {
        return infernoCreateElement('div', null, props.children);
      },
    },
  });
  const compiled = compile(`
# foo
  `);

  expect(infernoRenderToString(infernoCreateElement('div', null, compiled.tree))).toMatchSnapshot();
});

it('should allow injecting context to elements', () => {
  const compile = marksy({
    createElement,
    elements: {
      h1(props) {
        return <div>{props.context.foo}</div>;
      },
    },
  });
  const compiled = compile(
    `
# foo
  `,
    {},
    {
      foo: 'bar',
    }
  );

  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should allow injecting context to components', () => {
  const compile = marksyComponents({
    createElement,
    components: {
      Comp(props) {
        return <div>{props.context.foo}</div>;
      },
    },
  });
  const compiled = compile(
    `
<Comp/>
  `,
    {},
    {
      foo: 'bar',
    }
  );

  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to inline components', () => {
  const compile = marksyComponents({
    createElement,
    components: {
      Comp() {
        return <span>Wuuut</span>;
      },
    },
  });
  const compiled = compile('<p>Hello there <Comp/></p>');

  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should allow overriding inline code element', () => {
  const compile = marksy({
    createElement,
    elements: {
      codespan({ children }) {
        return <span>{children}</span>;
      },
    },
  });
  const compiled = compile('Hello `code`');

  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should allow overriding inline code element with components version', () => {
  const compile = marksyComponents({
    createElement,
    elements: {
      codespan({ children }) {
        return <span>{children}</span>;
      },
    },
  });
  const compiled = compile('Hello `code`');

  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should allow overriding block code element', () => {
  const compile = marksy({
    createElement,
    elements: {
      code({ language, code }) {
        return (
          <div>
            {language}:{code}
          </div>
        );
      },
    },
  });
  const compiled = compile('```js\ncode\n```');

  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should allow overriding block code element with components version', () => {
  const compile = marksyComponents({
    createElement,
    elements: {
      code({ language, code }) {
        return (
          <div>
            {language}:{code}
          </div>
        );
      },
    },
  });
  const compiled = compile('```js\ncode\n```');

  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should escape code when no highlighting is supplied', () => {
  const compile = marksy({
    createElement,
  });
  const compiled = compile('```js\nconst Foo = () => <div/>\n```');

  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should escape code when no highlighting is supplied with components version', () => {
  const compile = marksyComponents({
    createElement,
  });
  const compiled = compile('```js\nconst Foo = () => <div/>\n```');

  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should highlight code with highlight.js', () => {
  const compile = marksy({
    createElement,
    highlight(language, code) {
      return hljs.highlight(language, code).value;
    },
  });
  const compiled = compile('```js\nconst foo = "bar"\n```');

  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should not crash highlight.js with unsupported language', () => {
  const compile = marksy({
    createElement,
    highlight(language, code) {
      return hljs.highlight(language, code).value;
    },
  });

  const compiled = compile('```unsuppoted_language\nconst foo = "bar"\n```');

  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should highlight code with Prism.js', () => {
  const compile = marksyComponents({
    createElement,
    highlight(language, code) {
      return Prism.highlight(code, Prism.languages[language]);
    },
  });
  const compiled = compile('```js\nconst foo = "bar"\n```');

  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile list with html tag', () => {
  const compile = marksyComponents({
    createElement,
  });

  const compiled = compile(
    `
  <font color="red"> this is root red text </font>

  * list 1
  * list 2
  * <font color="blue">list blue text</font>
  * list 3
    * <font color="green">two depth green text</font>
  `
  );

  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});

it('should be able to compile self-closing tag', () => {
  const compile = marksy({ createElement });
  const compiled = compile(`
  ![test](http://some.com/image.png)
  
  <div><br /></div>
  
  <hr/>
  `);
  const { container } = render(<TestComponent>{compiled.tree}</TestComponent>);

  expect(container.firstChild).toMatchSnapshot();
});
