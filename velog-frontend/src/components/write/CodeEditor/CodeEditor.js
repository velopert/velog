// @flow

import React, { Component } from 'react';
import marked from 'marked';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/scroll/simplescrollbars.css';
import './CodeEditor.scss';

let CodeMirror = null;

if (process.env.APP_ENV !== 'server') {
  CodeMirror = require('codemirror');
  require('codemirror/addon/scroll/simplescrollbars');
  require('codemirror/addon/display/placeholder');
  require('codemirror/mode/markdown/markdown');
  require('codemirror/mode/javascript/javascript');
  require('codemirror/mode/jsx/jsx');
  require('codemirror/mode/css/css');
  require('codemirror/mode/shell/shell');
  require('codemirror/mode/python/python');
  require('codemirror/mode/go/go');
  require('codemirror/mode/swift/swift');
  require('codemirror/mode/clike/clike');
}

type Props = {
  body: string,
  onEditBody(value: string): any
}

type State = {
  cursor: any
};

class CodeEditor extends Component<Props, State> {
  codeMirror: any
  editor: any
  prevScrollTop: number
  scrollBefore: number // changes only when active scroll line changes
  prevOffsetTop: number
  prevPreviewScrollTop: number
  state = {
    cursor: null,
  }

  onScroll = (e: any) => {
    // retrieve current scroll info and line number
    const scrollInfo = e.getScrollInfo();
    const lineNumber = e.lineAtHeight(scrollInfo.top, 'local');
    const preview = document.getElementById('preview');

    if (!preview) return;
    const down = this.prevScrollTop < scrollInfo.top;
    this.prevScrollTop = scrollInfo.top;

    // content from line 0 -> lineNumber
    const range = e.getRange({ line: 0, ch: null }, { line: lineNumber, ch: null });
    const { top, clientHeight, height } = scrollInfo;

    // scroll to bottom
    if (height - clientHeight - top < 2) {
      (preview :any).scroll({
        behavior: 'smooth',
        top: preview.scrollHeight,
      });
      return;
    }

    // count ```
    const count = (range.match(/\n```/g) || []).length;
    const shouldCloseCodeblock = count % 2 === 1 ? '\n```' : '';
    // convert to markdown
    const markdown = `<h1></h1><div>${marked(`${range}${shouldCloseCodeblock}`)}</div>`;
    // create DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(markdown, 'text/html');
    if (!doc.body) return;
    // count lines
    const totalLines = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');
    const markdownRender = document.getElementById('markdown-render');
    if (!markdownRender || !preview) return;
    // select all lines
    const elements = markdownRender.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');
    if (!elements) return;
    // retrieve scrollTop of rendered current line
    const index = (totalLines.length > elements.length) ? elements.length : totalLines.length;
    if (!elements[index - 1]) return;
    const { offsetTop } = elements[index - 1];
    console.log(totalLines[index - 1], elements[index - 1]);
    // if pointing to same element, calculate diff and apply
    if (this.prevOffsetTop !== offsetTop) {
      this.scrollBefore = scrollInfo.top;
    }
    const diff = this.prevOffsetTop === offsetTop ? scrollInfo.top - this.scrollBefore : 0;
    this.prevOffsetTop = offsetTop;
    const previewScrollTop = offsetTop + diff;
    if (previewScrollTop > this.prevPreviewScrollTop && !down) return;
    this.prevPreviewScrollTop = previewScrollTop;
    // actually scroll
    (preview :any).scroll({
      behavior: 'smooth',
      top: previewScrollTop,
    });
    // console.log(elements[index - 1]);
  }

  initialize = () => {
    if (!CodeMirror) return;
    this.codeMirror = CodeMirror(this.editor, {
      mode: 'markdown',
      theme: 'material',
      lineNumbers: false, // 좌측에 라인넘버 띄우기
      lineWrapping: true, // 내용이 너무 길면 다음 줄에 작성
      scrollbarStyle: 'overlay',
      placeholder: '당신의 이야기를 적어보세요...',
    });
    this.codeMirror.on('change', this.onChange);
    this.codeMirror.on('scroll', this.onScroll);
    // TODO: load data (for updating)
  }

  onChange = (doc: any) => {
    const cursor = doc.getCursor();
    this.setState({
      cursor,
    });
    const { onEditBody, body } = this.props;
    if (body !== doc.getValue()) {
      onEditBody(doc.getValue());
    }
    // if editing the last line
    const { line } = cursor;
    const last = doc.lastLine();
    if (line === last) {
      const preview = document.getElementById('preview');
      if (!preview) return;
      preview.scrollTop = preview.scrollHeight;
    }
  }

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // const { codeMirror } = this;
    // const { cursor } = this.state;
    // const { body } = this.props;

    // if (!codeMirror) return;

    // // diff cursor
    // if (prevState.cursor !== cursor) {
    //   codeMirror.setCursor(cursor);
    //   return;
    // }
    // if (prevProps.body !== body) {
    //   const scrollInfo = codeMirror.getScrollInfo();
    //   codeMirror.setValue(body);
    //   if (!cursor) return;
    //   codeMirror.setCursor(cursor);
    //   codeMirror.scrollTo(scrollInfo.left, scrollInfo.top);
    //   // if editing the last line
    //   const { line } = cursor;
    //   const last = codeMirror.lastLine();
    //   if (line === last) {
    //     codeMirror.scrollTo(0, codeMirror.cursorCoords().top);
    //   }
    // }
  }

  render() {
    return (
      <div className="CodeEditor material">
        <div className="editor" ref={(ref) => { this.editor = ref; }} />
        {/* <textarea ref={(ref) => { this.textarea = ref; }} /> */ }
      </div>
    );
  }
}

export default CodeEditor;