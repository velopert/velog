// @flow
import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import './MarkdownEditor.scss';

let CodeMirror = null;

if (process.env.APP_ENV !== 'server') {
  CodeMirror = require('codemirror');
}

type Props = {
  flash?: string,
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
      lineWrapping: true, // 내용이 너무 길면 다음 줄에 작성
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

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.flash !== this.props.flash) {
      this.insertText();
    }
  }

  insertText = () => {
    const { cm } = this;
    const selection = cm.getSelection();
    if (selection.length > 0) {
      cm.replaceSelection(this.props.flash);
    } else {
      const doc = cm.getDoc();
      const cursor = cm.getCursor();
      const pos = {
        line: cursor.line,
        ch: cursor.ch,
      };
      doc.replaceRange(this.props.flash, pos);
    }
  };

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
