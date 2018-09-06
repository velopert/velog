// @flow
import React, { Component } from 'react';
import axios from 'lib/defaultClient';
import './DropImage.scss';

type Props = {
  onDragEnter(e: any): void,
  onDragLeave(e: any): void,
  onDrop(e: any): void,
  onPaste(file: any): void,
};

class DropImage extends Component<Props> {
  componentDidMount() {
    this.applyListeners();
    const str = 'a';
  }

  onDragOver = (e: any) => {
    e.preventDefault();
  };

  onPaste = (e: any) => {
    const { items } = e.clipboardData || e.originalEvent.clipboardData;
    if (items.length === 0) return;
    const fileItem = [...items].filter(item => item.kind === 'file')[0];
    if (!fileItem || !fileItem.getAsFile) return;
    const file = fileItem.getAsFile();
    this.props.onPaste(file);
    e.preventDefault();
  };

  applyListeners = () => {
    const { onDragEnter, onDragLeave, onDrop } = this.props;
    if (window) {
      window.addEventListener('drop', onDrop);
      window.addEventListener('dragenter', onDragEnter);
      window.addEventListener('dragleave', onDragLeave);
      window.addEventListener('dragover', this.onDragOver);
    }
    if (document && document.body) {
      document.body.addEventListener('paste', this.onPaste);
    }
  };

  removeListeners = () => {
    const { onDragEnter, onDragLeave, onDrop } = this.props;
    if (window) {
      window.removeEventListener('drop', onDrop);
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('dragover', this.onDragOver);
    }
    if (document && document.body) {
      document.body.removeEventListener('paste', this.onPaste);
    }
  };

  componentWillUnmount() {
    this.removeListeners();
  }

  render() {
    return <div />;
  }
}

export default DropImage;
