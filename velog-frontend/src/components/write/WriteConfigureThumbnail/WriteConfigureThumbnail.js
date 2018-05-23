// @flow
import React from 'react';
import ChangeIcon from 'react-icons/lib/md/sync';
import './WriteConfigureThumbnail.scss';

type Props = {};

const WriteConfigureThumbnail = (props: Props) => (
  <div className="WriteConfigureThumbnail">
    <div className="thumbnail-area">
      <img
        src="https://images.velog.io/post-images/velopert/0700dc90-5ea2-11e8-b245-3fe0979a15ae/스크린샷 2018-04-25 오전 12.42.05.png"
        alt="post-thumbnail"
      />
      <div className="overlay">
        <ChangeIcon />
        <div className="text">변경</div>
      </div>
    </div>
  </div>
);

export default WriteConfigureThumbnail;

// 1582 138 0 57
