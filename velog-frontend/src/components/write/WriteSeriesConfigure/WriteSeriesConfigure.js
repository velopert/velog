// @flow

import React from 'react';
import PlaylistAddIcon from 'react-icons/lib/md/playlist-add';
import './WriteSeriesConfigure.scss';

type Props = {
  current: ?string,
  onOpenModal: () => any,
};

const WriteSeriesConfigure = ({ current, onOpenModal }: Props) => {
  return (
    <div className="WriteSeriesConfigure" onClick={onOpenModal}>
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
