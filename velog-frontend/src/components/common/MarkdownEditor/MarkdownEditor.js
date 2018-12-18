// @flow
import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import './MarkdownEditor.scss';

let CodeMirror = null;

if (process.env.APP_ENV !== 'server') {
  CodeMirror = require('codemirror');
}

type Props = {
  value: string,
  placeholder?: string,
  onChange: (text: string) => void,
};
type State = {};

class MarkdownEditor extends Component<Props, State> {
  state = {};
  textarea = null;
  cm: any = null;

  initialize = () => {
    if (!CodeMirror) return;
    const { placeholder } = this.props;
    const cm = CodeMirror.fromTextArea(this.textarea, {
      mode: 'markdown',
      placeholder,
    });
    this.cm = cm;
    cm.on('change', (instance) => {
      this.props.onChange(instance.getValue());
    });
    cm.setValue(this.props.value);
  };

  componentDidMount() {
    this.initialize();
  }

  componentWillUnmount() {
    this.cm.toTextArea();
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
