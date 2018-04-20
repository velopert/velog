// @flow
import React, { Component } from 'react';
import axios from 'lib/defaultClient';
import './DropImage.scss';

type Props = {
  onDragEnter(e: any): void,
  onDragLeave(e: any): void,
  onDrop(e: any): void,
};

class DropImage extends Component<Props> {
  componentDidMount() {
    this.applyListeners();
    const str = 'a';
  }

  onDragOver = (e: any) => {
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
  };

  removeListeners = () => {
    const { onDragEnter, onDragLeave, onDrop } = this.props;
    if (window) {
      window.removeEventListener('drop', onDrop);
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('dragover', this.onDragOver);
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
