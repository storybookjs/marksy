import './prism.css'
import './prism.js'
import React from 'react'
import {render} from 'react-dom'
import marksy from 'marksy'

const compile = marksy({
  components: {
    MyComponent (props) {
      return <div style={{color: props.color}}>{props.children}</div>
    },
    AnotherComponent () {
      return <h3>Whatever</h3>
    }
  },
  h1 (props) {
    return <h1 style={{color: 'red'}}>{props.children}</h1>
  }
})

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tree: null
    };
  }
  onTextareaChange (event) {
    this.setState({
      tree: compile(event.target.value).tree
    });
  }
  render () {
    return (
      <div>
        <div style={{
          width: '50%',
          verticalAlign: 'top',
          display: 'inline-block'
        }}>
          {this.state.tree}
        </div>
        <textarea
          style={{width: 500, height: 500}}
          onChange={(event) => this.onTextareaChange(event)}
        ></textarea>
      </div>
    );
  }
}

render(<App />, document.querySelector('#app'));
