import React from 'react';
import renderer from 'react-test-renderer';
import marksy from 'marksy'

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