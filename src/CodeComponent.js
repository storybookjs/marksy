import React from 'react'

class CodeComponent extends React.Component {
  componentDidMount () {
    if (typeof Prism === 'undefined') {
      console.warn('You do not have Prism included as a global object');
      return;
    }
    Prism.highlightAll();
  }
  componentDidUpdate () {
    if (typeof Prism === 'undefined') {
      console.warn('You do not have Prism included as a global object');
      return;
    }
    Prism.highlightAll();
  }
  render () {
    return (
      <pre>
        <code className={`language-${this.props.language}`}>
          {this.props.code}
        </code>
      </pre>
    )
  }
}

export default CodeComponent;
