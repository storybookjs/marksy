import './prism.css'
import './prism.js'
import React from 'react'
import {render} from 'react-dom'
import marksy from 'marksy'

const compile = marksy({
  components: {
    Row ({children}) {
      return <div style={{display: 'flex'}}>{children}</div>
    },
    Col ({children}) {
      return <div style={{flex: '1', padding: '10px', backgroundColor: '#DADADA', border: '1px solid #333'}}>{children}</div>
    }
  },
  h1 (props) {
    return <h1 style={{textDecoration: 'underline'}}>{props.children}</h1>
  }
})

const demo = `
# Some blog title

Just need to show you some code first:

${'```js \nconst foo = "bar"\n```'}

<Row>
  <Col>Need to tell you something over here</Col>
  <Col>And over here</Col>
</Row>
`

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tree: compile(demo).tree,
      value: demo
    };
  }
  onTextareaChange (event) {
    this.setState({
      tree: compile(event.target.value).tree,
      value: event.target.value
    });
  }
  render () {
    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Marksy demo (a blog service)</h1>
        <div style={{
          width: '50%',
          verticalAlign: 'top',
          display: 'inline-block',
          padding: '0 20px'
        }}>
          {this.state.tree}
        </div>
        <textarea
          style={{width: 500, height: 500, border: '1px dashed #DADADA', outline: 'none', padding: '10px'}}
          onChange={(event) => this.onTextareaChange(event)}
          value={this.state.value}
        ></textarea>
      </div>
    );
  }
}

render(<App />, document.querySelector('#app'));
