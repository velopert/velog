// @flow
import React, { Component } from 'react';
import UploadMask from '../UploadMask/UploadMask';

type Props = {
  uploadImages: (files: File[]) => any,
};
type State = {
  drag: boolean,
};

class FullpageUploader extends Component<Props, State> {
  state = {
    drag: false,
  };
  dragCounter = 0;
  onDrop = (e: any) => {
    e.preventDefault();
    this.dragCounter = 0;
    this.setState({
      drag: false,
    });
    const { /* items, */ files } = e.dataTransfer;
    if (!files) return;
    const filesArray = [...files];
    this.props.uploadImages(filesArray);
  };
  onDragEnter = (e: any) => {
    this.dragCounter += 1;
    if (this.dragCounter >= 1) {
      this.setState({
        drag: true,
      });
    }
  };
  onDragLeave = (e: any) => {
    this.dragCounter -= 1;
    if (this.dragCounter === 0) {
      this.setState({
        drag: false,
      });
    }
  };
  onDragOver = (e: any) => {
    e.preventDefault();
  };
  addListeners = () => {
    if (!window) return;
    window.addEventListener('drop', this.onDrop);
    window.addEventListener('dragenter', this.onDragEnter);
    window.addEventListener('dragleave', this.onDragLeave);
    window.addEventListener('dragover', this.onDragOver);
  };
  componentDidMount() {
    this.addListeners();
  }
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.drag !== this.state.drag) {
      console.log(this.state.drag);
    }
  }

  render() {
    const { drag } = this.state;
    return <UploadMask visible={drag} />;
  }
}

export default FullpageUploader;
