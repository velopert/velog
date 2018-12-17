// @flow
import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import './MarkdownEditor.scss';

let CodeMirror = null;

if (process.env.APP_ENV !== 'server') {
  CodeMirror = require('codemirror');
}

type Props = {
  placeholder?: string,
};
type State = {};

class MarkdownEditor extends Component<Props, State> {
  state = {};
  textarea = null;

  initialize = () => {
    if (!CodeMirror) return;
    const { placeholder } = this.props;
    CodeMirror.fromTextArea(this.textarea, {
      mode: 'markdown',
      placeholder,
    });
  };
  componentDidMount() {
    this.initialize();
  }

  render() {
    return (
      <div className="MarkdownEditor">
        <TextareaAutosize
          innerRef={(ref) => {
            this.textarea = ref;
          }}
          rows={5}
          maxRows={20}
        />
      </div>
    );
  }
}

export default MarkdownEditor;
