// @flow
import React, { Fragment } from 'react';
import ChangeIcon from 'react-icons/lib/md/sync';
import UploadIcon from 'react-icons/lib/md/file-upload';
import './WriteConfigureThumbnail.scss';

type Props = {
  thumbnail: ?string,
  onUploadClick: () => void,
  onClearThumbnail: () => void,
};

const WriteConfigureThumbnail = ({ thumbnail, onUploadClick, onClearThumbnail }: Props) => (
  <div className="WriteConfigureThumbnail">
    {thumbnail ? (
      <Fragment>
        <div className="remove-wrapper">
          <button className="remove" onClick={onClearThumbnail}>
            제거
          </button>
        </div>
        <div className="thumbnail-area">
          <img className="full" src={thumbnail} alt="post-thumbnail" />
          <div className="overlay full">
            <button className="white-button" onClick={onUploadClick}>
              <ChangeIcon />
              <div className="text">변경</div>
            </button>
          </div>
        </div>
      </Fragment>
    ) : (
      <button className="white-button fullwidth" onClick={onUploadClick}>
        <UploadIcon />
        <div className="text">업로드</div>
      </button>
    )}
  </div>
);

export default WriteConfigureThumbnail;

// 1582 138 0 57
