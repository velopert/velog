// @flow

import React, { Component } from 'react';
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