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

  state = {
    cursor: null,
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
    this.codeMirror.on('scroll', (e) => {
      const scrollInfo = e.getScrollInfo();
      const lineNumber = e.lineAtHeight(scrollInfo.top, 'local');
      const range = e.getRange({ line: 0, ch: null }, { line: lineNumber, ch: null });
      const markdown = `<h1></h1><div>${marked(range)}</div>`;
      const parser = new DOMParser();
      const doc = parser.parseFromString(markdown, 'text/html');
      if (!doc.body) return;
      const totalLines = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');
      const markdownRender = document.getElementById('markdown-render');
      const preview = document.getElementById('preview');
      if (!markdownRender || !preview) return;
      const elements = markdownRender.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');
      if (!elements) return;
      const index = (totalLines.length > elements.length) ? elements.length : totalLines.length;
      preview.scrollTop = elements[index - 1].offsetTop;
      // console.log(elements[index - 1]);
    });
  }

  onChange = (doc: any) => {
    this.setState({
      cursor: doc.getCursor(),
    });
    const { onEditBody, body } = this.props;
    if (body !== doc.getValue()) {
      onEditBody(doc.getValue());
    }
  }

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { codeMirror } = this;
    const { cursor } = this.state;
    const { body } = this.props;

    if (!codeMirror) return;

    // diff cursor
    if (prevState.cursor !== cursor) {
      codeMirror.setCursor(cursor);
      return;
    }
    if (prevProps.body !== body) {
      codeMirror.setValue(body);
      if (!cursor) return;
      codeMirror.setCursor(cursor);
    }
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