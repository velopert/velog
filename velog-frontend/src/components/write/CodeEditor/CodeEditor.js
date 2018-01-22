import React, { Component } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/scroll/simplescrollbars.css';
import './CodeEditor.scss';

let CodeMirror = null;

if (process.env.APP_ENV !== 'server') {
  CodeMirror = require('codemirror');
  require('codemirror/addon/scroll/simplescrollbars');
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

class CodeEditor extends Component {
  initialize = () => {
    this.codeMirror = CodeMirror(this.editor, {
      mode: 'markdown',
      theme: 'default',
      lineNumbers: true, // 좌측에 라인넘버 띄우기
      lineWrapping: true, // 내용이 너무 길면 다음 줄에 작성
      scrollbarStyle: 'overlay',
    });
  }

  componentDidMount() {
    this.initialize();
  }

  render() {
    return (
      <div className="CodeEditor">
        <div className="editor" ref={(ref) => { this.editor = ref; }} />
        {/* <textarea ref={(ref) => { this.textarea = ref; }} /> */ }
      </div>
    );
  }
}

export default CodeEditor;