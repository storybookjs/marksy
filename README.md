# marksy
A markdown to custom React components library

## Install

`npm install marksy`

## API
```js
import marksy from 'marksy'
// const marksy = require('marksy').marksy

// You can override the default elements with
// React components
const compile = marksy({
  h1 ({id, children}) {},
  h2 ({id, children}) {},
  h3 ({id, children}) {},
  h4 ({id, children}) {},
  blockquote ({children}) {},
  hr () {},
  ol ({children}) {},
  ul ({children}) {},
  p ({children}) {},
  table ({children}) {},
  thead ({children}) {},
  tbody ({children}) {},
  tr ({children}) {},
  th ({children}) {},
  td ({children}) {},
  a ({href, title, target, children}) {},
  strong ({children}) {},
  em ({children}) {},
  br () {},
  del ({children}) {},
  img ({src, alt}) {},
  code ({language, code}) {},
  codespan ({children}) {}
})

const compiled = compile('# hello')

compiled.tree // The React tree of components
compiled.toc // The table of contents, based on usage of headers
```

### Custom components
You can also add your own custom components:

```js
const compile = marksy({
  components: {
    MyCustomComponent (props) {
      return <h1>{props.children}</h1>
    }
  }
})

/* MARKDOWN:
  # Just a test
  <MyCustomComponent>some text</MyCustomComponent>
*/
```

This will be converted to the component above. You can pass in any kind of props, as if it was normal code.


## Code highlighting
To enable code highlighting the [Prism](http://prismjs.com/) project needs to be available on window.

## Developing
1. Clone repo
2. `npm install`
3. `npm start` -> localhost:8080 (development app)
