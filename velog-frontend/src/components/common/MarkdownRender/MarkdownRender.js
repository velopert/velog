// @flow

import marked from 'marked';
import React, { Component } from 'react';
import throttle from 'lodash/throttle';
import Prism from 'prismjs';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import { escapeForUrl, getScrollTop } from 'lib/common';
import 'prismjs/components/prism-bash.min';
import 'prismjs/components/prism-typescript.min';
import 'prismjs/components/prism-javascript.min';
import 'prismjs/components/prism-jsx.min';
import 'prismjs/components/prism-css.min';
import './MarkdownRender.scss';

type Props = {
  body: string,
  theme?: string,
  onSetToc?: (toc: any) => void,
  onActivateHeading?: (headingId: string) => void,
};

type State = {
  html: string,
};

function stripHtml(text: string): string {
  const regex = /<\/?[^>]+(>|$)/g;
  return text.replace(regex, '');
}

const createRenderer = (arr: any[]) => {
  const tocRenderer = new marked.Renderer();
  tocRenderer.heading = function heading(text, level, raw) {
    if (!raw) return '';
    const anchor = this.options.headerPrefix + escapeForUrl(raw.toLowerCase());
    const hasDuplicate = arr.find(item => item.anchor === anchor);
    const filtered = arr.filter(item => item.anchor.indexOf(anchor) > -1);
    const suffix = !hasDuplicate && filtered.length === 0 ? '' : `-${filtered.length + 1}`;

    const suffixed = `${anchor}${suffix}`;
    if (level <= 3 && arr) {
      try {
        arr.push({
          anchor: suffixed,
          level,
          text: stripHtml(text),
        });
      } catch (e) {
        console.log(e);
      }
    }
    return `<h${level} id="${suffixed}">${text}</h${level}>`;
  };
  return tocRenderer;
};

class MarkdownRender extends Component<Props, State> {
  positions: { id: string, top: number }[] = [];
  currentHeading: ?string;
  toc = [];
  el = null;
  timerId = null;
  prevHeight = null;

  state = {
    html: '',
  };

  static defaultProps = {
    theme: 'github',
  };

  constructor(props: Props) {
    super(props);
    const toc = [];
    marked.setOptions({
      renderer: createRenderer(toc),
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      xhtml: false,
    });
    this.state.html = marked(this.props.body);
    this.toc = toc;
  }

  checkHeight = () => {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    const { el } = this;
    if (!el) return;
    const currentHeight = el.clientHeight;
    if (this.prevHeight !== currentHeight) {
      this.updatePositions();
    }
    this.prevHeight = currentHeight;
    setTimeout(this.checkHeight, 500);
  };

  renderMarkdown() {
    const toc = [];
    marked.setOptions({
      renderer: createRenderer(toc),
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      xhtml: false,
    });
    const rendered = marked(this.props.body);
    if (this.props.onSetToc) {
      this.props.onSetToc(toc);
    }
    this.setState({
      html: rendered,
    });
    this.toc = toc;
  }

  componentDidMount() {
    if (this.state.html !== '') {
      this.renderPrism();
      this.updatePositions();
      this.checkHeight();
    }
    this.renderMarkdown();
    this.registerEvent();
  }

  componentWillUnmount() {
    this.unregisterEvent();
  }

  renderPrism() {
    if (!Prism) return;
    Prism.highlightAll();
  }

  onScroll = () => {
    const scrollTop = getScrollTop();
    if (!document.body) return;
    if (!this.positions || this.positions.length === 0) return;
    for (let i = this.positions.length - 1; i > -1; i -= 1) {
      const pos = this.positions[i];
      if (pos.top < scrollTop + 32) {
        if (pos.id === this.currentHeading) return;
        this.currentHeading = pos.id;
        if (!this.props.onActivateHeading) return;
        this.props.onActivateHeading(pos.id);
        return;
      }
    }
    // not found, activate the first heading
    if (!this.props.onActivateHeading) return;
    this.props.onActivateHeading(this.positions[0].id);
  };

  registerEvent = () => {
    if (!this.props.onSetToc) return;
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.updatePositions);
  };

  unregisterEvent = () => {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.updatePositions);
  };

  updatePositions = debounce(() => {
    if (!this.toc) return;
    const scrollTop = getScrollTop();
    this.positions = this.toc.map(({ anchor }) => {
      const dom = document.getElementById(anchor);
      if (!dom) return { top: 0, id: '' };
      return { top: dom.getBoundingClientRect().top + scrollTop, id: anchor };
    });
  }, 500);

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.body !== this.props.body) {
      this.renderMarkdown();
    }
    if (prevState.html !== this.state.html) {
      this.renderPrism();
      this.updatePositions();
    }
  }

  render() {
    const { html } = this.state;
    const markup = { __html: html };
    const { theme } = this.props;
    return (
      <div
        className={cx('MarkdownRender', theme || 'github')}
        dangerouslySetInnerHTML={markup}
        id="markdown-render"
        ref={(ref) => {
          this.el = ref;
        }}
      />
    );
  }
}

export default MarkdownRender;
