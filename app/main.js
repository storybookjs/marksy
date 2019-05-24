/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-extraneous-dependencies */

import 'highlight.js/styles/github.css';
import hljs from 'highlight.js/lib/highlight';
import hljsJavascript from 'highlight.js/lib/languages/javascript';
import React from 'react';
import { render } from 'react-dom';

// eslint-disable-next-line import/no-unresolved
import { document } from 'global';
import marksy from '../components';

hljs.registerLanguage('javascript', hljsJavascript);

const compile = marksy({
  createElement: React.createElement,
  highlight(language, code) {
    return hljs.highlight(language, code).value;
  },
  components: {
    Row({ children }) {
      return <div style={{ display: 'flex' }}>{children}</div>;
    },
    Col({ children }) {
      return (
        <div
          style={{
            flex: '1',
            padding: '10px',
            backgroundColor: '#DADADA',
            border: '1px solid #333',
          }}
        >
          {children}
        </div>
      );
    },
  },
  h1(props) {
    return <h1 style={{ textDecoration: 'underline' }}>{props.children}</h1>;
  },
});

const demo = `
# Some blog title

Just need to show you some code first:

\`\`\`js
const foo = "bar"
\`\`\`

<Row>
  <Col>Need to tell you something over here</Col>
  <Col>And over here</Col>
</Row>
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: compile(demo).tree,
      value: demo,
    };
  }

  onTextareaChange(event) {
    this.setState({
      tree: compile(event.target.value).tree,
      value: event.target.value,
    });
  }

  render() {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Marksy demo (a blog service)</h1>
        <div
          style={{
            width: '50%',
            verticalAlign: 'top',
            display: 'inline-block',
            padding: '0 20px',
          }}
        >
          {this.state.tree}
        </div>
        <textarea
          style={{
            width: 500,
            height: 500,
            border: '1px dashed #DADADA',
            outline: 'none',
            padding: '10px',
          }}
          onChange={event => this.onTextareaChange(event)}
          value={this.state.value}
        />
      </div>
    );
  }
}

render(<App />, document.querySelector('#app'));
