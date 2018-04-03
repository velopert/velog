// @flow
import marked from 'marked';
import React, { Component } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash.min';
import 'prismjs/components/prism-javascript.min';
import 'prismjs/components/prism-jsx.min';
import 'prismjs/components/prism-css.min';
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
    const rendered = marked(this.props.body);
    this.setState({
      html: rendered,
    });
  }

  componentDidMount() {
    this.renderMarkdown();
  }

  renderPrism() {
    if (!Prism) return;
    Prism.highlightAll();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.body !== this.props.body) {
      this.renderMarkdown();
    }
    if (prevProps.html !== this.state.html) {
      this.renderPrism();
    }
  }

  render() {
    const { html } = this.state;
    const markup = { __html: html };

    return (
      <div className="MarkdownRender atom-one" dangerouslySetInnerHTML={markup} id="markdown-render" />
    );
  }
}

export default MarkdownRender;