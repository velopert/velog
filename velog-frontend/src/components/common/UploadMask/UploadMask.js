// @flow
import React, { Component } from 'react';
import UploadIcon from 'react-icons/lib/md/cloud-upload';
import './UploadMask.scss';

type Props = {
  visible: boolean,
};

class UploadMask extends Component<Props> {
  render() {
    if (!this.props.visible) return null;

    return (
      <div className="UploadMask">
        <UploadIcon />
        <h3>파일을 드래그하여 업로드 하세요</h3>
      </div>
    );
  }
}

export default UploadMask;
