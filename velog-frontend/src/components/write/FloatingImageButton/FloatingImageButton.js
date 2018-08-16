// @flow
import React, { Fragment } from 'react';
import ImageIcon from 'react-icons/lib/io/image';
import Tooltip from 'react-tooltip';
import './FloatingImageButton.scss';

type Props = {
  onClick(): void,
};

const FloatingImageButton = ({ onClick }: Props) => (
  <Fragment>
    <div
      className="FloatingImageButton"
      data-tip="이미지 업로드"
      data-place="left"
      onClick={onClick}
    >
      <ImageIcon />
    </div>
    <Tooltip effect="solid" className="tooltip" />
  </Fragment>
);

export default FloatingImageButton;
