// @flow
import React, { Component } from 'react';
import axios from 'lib/defaultClient';
import './DropImage.scss';

type Props = {};

class DropImage extends Component<Props> {
  componentDidMount() {
    this.applyListeners();
  }

  applyListeners = () => {
    if (!document || !document.body) return;
    document.body.addEventListener('drop', this.onDrop);
  };

  removeListeners = () => {};

  componentWillUnmount() {}

  onDrop = (e: any) => {
    e.preventDefault();
    const { items, files } = e.dataTransfer;
    if (files) {
      const filesArray = [...files];
      console.log(filesArray);
      const data = new FormData();
      data.append('image', files[0]);
      axios.post('/files/upload', data, {
        onUploadProgress: (uploadEvent) => {
          console.log(`${uploadEvent.loaded}/${uploadEvent.total}`);
        },
      });
    }
  };

  render() {
    return <div />;
  }
}

export default DropImage;
