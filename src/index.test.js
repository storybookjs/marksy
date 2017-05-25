import React from 'react';
import renderer from 'react-test-renderer';
import marksy from './'

class TestComponent extends React.Component {
  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

it('should be able to compile text', () => {
  const compile = marksy();
  const compiled = compile(`hello`);
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile strong text', () => {
  const compile = marksy();
  const compiled = compile(`hello **there**`);
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile strong text', () => {
  const compile = marksy();
  const compiled = compile(`hello **there**`);
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile italic text', () => {
  const compile = marksy();
  const compiled = compile(`hello *there*`);
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile links', () => {
  const compile = marksy();
  const compiled = compile(`[my link](http://example.com)`);
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile headers', () => {
  const compile = marksy();
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

it('should be able to compile ordered list', () => {
  const compile = marksy();
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
  const compile = marksy();
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
  const compile = marksy();
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
  const compile = marksy();
  const compiled = compile('install with `$ npm install`')
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile image', () => {
  const compile = marksy();
  const compiled = compile('![test](http://some.com/image.png)')
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile html', () => {
  const compile = marksy();
  const compiled = compile(`<div>hello</div>`)
  const tree = renderer.create(
    <TestComponent>{compiled.tree}</TestComponent>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should be able to compile components', () => {
  const compile = marksy({
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
  const compile = marksy({
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
  const compile = marksy();
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
  const compile = marksy();
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
  const compile = marksy();
  const compiled = compile(`
# foo

## bar

### baz
  `)

  expect(JSON.stringify(compiled.toc, null, 2)).toMatchSnapshot();
});

it('should produce custom tags', () => {
  const compile = marksy({
    h1 (props) {
      return <div>{props.children}</div>
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
