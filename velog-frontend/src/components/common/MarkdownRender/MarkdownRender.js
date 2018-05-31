// @flow

import marked from 'marked';
import React, { Component } from 'react';
import Prism from 'prismjs';
import { escapeForUrl } from 'lib/common';
import 'prismjs/components/prism-bash.min';
import 'prismjs/components/prism-typescript.min';
import 'prismjs/components/prism-javascript.min';
import 'prismjs/components/prism-jsx.min';
import 'prismjs/components/prism-css.min';
import './MarkdownRender.scss';

type Props = {
  body: string,
  onSetToc?: (toc: any) => void,
};

type State = {
  html: string,
};

const toc = [];
const renderer = (() => {
  const tocRenderer = new marked.Renderer();
  tocRenderer.heading = function heading(text, level, raw) {
    if (!raw) return '';
    const anchor = this.options.headerPrefix + escapeForUrl(raw.toLowerCase());
    toc.push({
      anchor,
      level,
      text,
    });
    return `<h${level} id="${anchor}">${text}</h${level}>`;
  };
  return tocRenderer;
})();

marked.setOptions({
  renderer,
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
  };

  renderMarkdown() {
    toc.length = 0;
    const rendered = marked(this.props.body);
    if (this.props.onSetToc) {
      this.props.onSetToc(toc);
    }
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
      <div
        className="MarkdownRender atom-one"
        dangerouslySetInnerHTML={markup}
        id="markdown-render"
      />
    );
  }
}

export default MarkdownRender;
