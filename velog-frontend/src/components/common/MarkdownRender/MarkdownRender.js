// @flow
import marked from 'marked';
import React, { Component } from 'react';
import './MarkdownRender.scss';

type Props = {
  body: string
};

type State = {
  html: string
};

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});


class MarkdownRender extends Component<Props, State> {
  state = {
    html: '',
  }

  renderMarkdown() {
    this.setState({
      html: marked(this.props.body),
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.body !== this.props.body) {
      this.renderMarkdown();
    }
  }

  render() {
    const { html } = this.state;
    const markup = { __html: html };

    return (
      <div className="MarkdownRender" dangerouslySetInnerHTML={markup} />
    );
  }
}

export default MarkdownRender;