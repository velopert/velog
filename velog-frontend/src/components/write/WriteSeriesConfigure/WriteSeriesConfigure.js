// @flow

import React from 'react';
import PlaylistAddIcon from 'react-icons/lib/md/playlist-add';
import './WriteSeriesConfigure.scss';

type Props = {
  current: ?string,
};

const WriteSeriesConfigure = ({ current }: Props) => {
  return (
    <div className="WriteSeriesConfigure">
      {current ? (
        <div className="edit" />
      ) : (
        <button className="create">
          <PlaylistAddIcon />
          <div className="text">시리즈에 추가하기</div>
        </button>
      )}
    </div>
  );
};

export default WriteSeriesConfigure;
