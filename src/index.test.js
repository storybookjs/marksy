import React, {createElement, Component} from 'react';
import Preact from 'preact';
import preactRenderToString from 'preact-render-to-string';
import {renderToString as infernoRenderToString} from 'inferno-server';
import infernoCreateElement from 'inferno-create-element';
import renderer from 'react-test-renderer';
import marksy from './'
import marksyComponents from './components'
import Prism from 'prismjs'
import hljs from 'highlight.js/lib/highlight'
import hljsJs from 'highlight.js/lib/languages/javascript'
import hljsXml from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('javascript', hljsJs)
hljs.registerLanguage('xml', hljsXml)

class TestComponent extends Component {
  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

it('should be able to compile text', () => {
  const compile = marksy({createElement});
  const compiled = compile(`hello`);
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile strong text', () => {
  const compile = marksy({createElement});
  const compiled = compile(`hello **there**`);
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile strong text', () => {
  const compile = marksy({createElement});
  const compiled = compile(`hello **there**`);
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile italic text', () => {
  const compile = marksy({createElement});
  const compiled = compile(`hello *there*`);
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile links', () => {
  const compile = marksy({createElement});
  const compiled = compile(`[my link](http://example.com)`);
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile headers', () => {
  const compile = marksy({createElement});
  const compiled = compile(`
# header1
## header2
### header3
#### header4
  `)
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should handle same name nested headers', () => {
  const compile = marksy({createElement});
  const compiled = compile(`
# header1
## header2
# header3
## header2
  `)
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile ordered list', () => {
  const compile = marksy({createElement});
  const compiled = compile(`
1. foo
2. bar
  `)
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile list', () => {
  const compile = marksy({createElement});
  const compiled = compile(`
- foo
- bar
  `)
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile tables', () => {
  const compile = marksy({createElement});
  const compiled = compile(`
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
  `)
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile codespans', () => {
  const compile = marksy({createElement});
  const compiled = compile('install with `$ npm install`')
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile image', () => {
  const compile = marksy({createElement});
  const compiled = compile('![test](http://some.com/image.png)')
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile html', () => {
  const compile = marksy({createElement});
  const compiled = compile(`<div>hello</div>`)
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile html as components', () => {
  const compile = marksyComponents({createElement});
  const compiled = compile(`<div>hello</div>`)
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile components', () => {
  const compile = marksyComponents({
    createElement,
    components: {
      Test() {
        return <div>mip</div>
      }
    }
  });
  const compiled = compile(`<Test />`)
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile components using marksy language', () => {
  const compile = marksyComponents({
    createElement,
    components: {
      Test() {
        return <div>mip</div>
      }
    }
  });
  const compiled = compile('```marksy\n<Test />\n```')
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile nested lists', () => {
  const compile = marksy({createElement});
  const compiled = compile(`
- Colors
    - Red
    - Blue
- Shape
  - Triangle
  - Rectangle
  `)
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to combine in compilation', () => {
  const compile = marksy({createElement});
  const compiled = compile(`
# hey

- foo

-bar
  `)
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should produce TOC', () => {
  const compile = marksy({createElement});
  const compiled = compile(`
# foo

## bar

### baz
  `)

  expect(JSON.stringify(compiled.toc, null, 2)).toMatchSnapshot();
});

it('should produce custom tags', () => {
  const compile = marksy({
    createElement,
    elements: {
      h1 (props) {
        return <div>{props.children}</div>
      }
    }
  });
  const compiled = compile(`
# foo
  `)

  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should work with Preact', () => {
  const compile = marksy({
    createElement: Preact.h,
    elements: {
      h1 (props) {
        return Preact.h('div', null, props.children)
      }
    }
  });
  const compiled = compile(`
# foo
  `)

  expect(preactRenderToString(Preact.h('div', null, compiled.tree))).toMatchSnapshot();
});

it('should work with Inferno', () => {
  const compile = marksy({
    createElement: infernoCreateElement,
    elements: {
      h1 (props) {
        return infernoCreateElement('div', null, props.children)
      }
    }
  });
  const compiled = compile(`
# foo
  `)

  expect(infernoRenderToString(infernoCreateElement('div', null, compiled.tree))).toMatchSnapshot();
});

it('should allow injecting context to elements', () => {
  const compile = marksy({
    createElement,
    elements: {
      h1 (props) {
        return <div>{props.context.foo}</div>
      }
    }
  });
  const compiled = compile(`
# foo
  `, {}, {
    foo: 'bar'
  })

  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should allow injecting context to components', () => {
  const compile = marksyComponents({
    createElement,
    components: {
      Comp (props) {
        return <div>{props.context.foo}</div>
      }
    }
  });
  const compiled = compile(`
<Comp/>
  `, {}, {
    foo: 'bar'
  })

  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to inline components', () => {
  const compile = marksyComponents({
    createElement,
    components: {
      Comp (props) {
        return <div>Wuuut</div>
      }
    }
  });
  const compiled = compile(`<p>Hello there <Comp/></p>`)

  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should allow overriding code element with components version', () => {
  const compile = marksyComponents({
    createElement,
    elements: {
      code() {
        return <div>code</div>
      }
    }
  });
  const compiled = compile('Hello `code`');

  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should allow overriding codeblock element with components version', () => {
    const compile = marksyComponents({
        createElement,
        elements: {
            code() {
                return <div>code</div>
            }
        }
    });
    const compiled = compile('```js\nconst foo = "bar"\n```');

    const tree = renderer.create(
        <TestComponent>{compiled.tree}</TestComponent>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

it('should highlight code with highlight.js', () => {
  const compile = marksy({
    createElement,
    highlight(language, code) {
      return hljs.highlight(language, code).value
    }
  });
  const compiled = compile('```js\nconst foo = "bar"\n```');

  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should highlight code with Prism.js', () => {
  const compile = marksyComponents({
    createElement,
    highlight(language, code) {
      return Prism.highlight(code, Prism.languages[language])
    }
  });
  const compiled = compile('```js\nconst foo = "bar"\n```');

  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
