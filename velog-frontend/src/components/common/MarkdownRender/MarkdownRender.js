// @flow

import marked from 'marked';
import React, { Component } from 'react';
import throttle from 'lodash/throttle';
import Prism from 'prismjs';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import { escapeForUrl, getScrollTop, loadScript } from 'lib/common';
import 'prismjs/components/prism-bash.min';
import 'prismjs/components/prism-typescript.min';
import 'prismjs/components/prism-javascript.min';
import 'prismjs/components/prism-jsx.min';
import 'prismjs/components/prism-css.min';
import 'prismjs/components/prism-python.min';
import 'prismjs/components/prism-go.min';
import 'prismjs/components/prism-scss.min';
import 'prismjs/components/prism-java.min';
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

function checkCustomLexer(text: string) {
  const checkCode = /<code>(.*?)<\/code>/;
  if (checkCode.test(text)) return null;
  const regex = /!(youtube|twitter|codesandbox)\[(.*?)\]/;
  const match = regex.exec(text);
  if (!match) return null;
  return {
    type: match[1],
    code: match[2],
  };
}

const lexers = {
  youtube: code =>
    `<iframe class="youtube" src="https://www.youtube.com/embed/${code}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
  twitter: code =>
    `<div class="twitter-wrapper"><blockquote class="twitter-tweet" data-lang="ko"><a href="https://twitter.com/${code}"></a></blockquote></div>`,
  codesandbox: code =>
    `<iframe src="https://codesandbox.io/embed/${code}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`,
};

const createRenderer = (arr: any[]) => {
  const renderer = new marked.Renderer();
  const linkRenderer = renderer.link;
  renderer.link = (href, title, text) => {
    const html = linkRenderer.call(renderer, href, title, text);
    return html.replace(/^<a /, '<a target="_blank" ');
  };
  renderer.heading = function heading(text, level, raw) {
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
  renderer.paragraph = function paragraph(text) {
    const processed = (() => {
      const check = checkCustomLexer(text);
      if (!check) return text;
      return text.replace(
        /!(youtube|twitter|codesandbox)\[(.*?)\]/,
        lexers[check.type](check.code),
      );
    })();
    return `<p>${processed}</p>\n`;
  };

  return renderer;
};

class MarkdownRender extends Component<Props, State> {
  positions: { id: string, top: number }[] = [];
  currentHeading: ?string;
  toc = [];
  el = null;
  timerId = null;
  prevHeight = null;
  htmlDiv = null;
  loadTwitter = false;

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
      highlight(code, lang: string) {
        return Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup, lang);
      },
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

  renderMarkdown = () => {
    const start = new Date();
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
      highlight(code, lang: string) {
        return Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup, lang);
      },
    });
    const rendered = marked(this.props.body);
    if (this.props.onSetToc) {
      this.props.onSetToc(toc);
    }

    this.toc = toc;
    if (this.htmlDiv) {
      // morphdom(this.htmlDiv, `<div>${rendered}</div>`);
      this.htmlDiv.innerHTML = rendered;
      if (rendered.indexOf('class="twitter-tweet"') > -1) {
        loadScript('https://platform.twitter.com/widgets.js');
      }
    }
    const last = new Date();
    const diff = last.getTime() - start.getTime();

    this.debouncedRender = debounce(this.renderMarkdown, diff * 1.5);
  };

  debouncedRender = () => {
    this.renderMarkdown();
  };

  componentDidMount() {
    if (this.state.html !== '') {
      this.updatePositions();
      this.checkHeight();
    }
    this.debouncedRender();
    this.registerEvent();
    window.htmlDiv = this.htmlDiv;
  }

  componentWillUnmount() {
    this.unregisterEvent();
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
  }, 20);

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.body !== this.props.body) {
      this.debouncedRender();
    }
    if (prevState.html !== this.state.html) {
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
        id="markdown-render"
        ref={(ref) => {
          this.el = ref;
        }}
      >
        <div
          ref={(ref) => {
            this.htmlDiv = ref;
          }}
          dangerouslySetInnerHTML={markup}
        />
      </div>
    );
  }
}

export default MarkdownRender;
