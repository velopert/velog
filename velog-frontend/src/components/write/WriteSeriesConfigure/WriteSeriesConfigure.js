// @flow

import React from 'react';
import PlaylistAddIcon from 'react-icons/lib/md/playlist-add';
import './WriteSeriesConfigure.scss';

type Props = {
  series: ?{ id: string, name: string },
  onOpenModal: () => any,
};

const WriteSeriesConfigure = ({ series, onOpenModal }: Props) => {
  return (
    <div className="WriteSeriesConfigure">
      {series ? (
        <div className="box edit">
          <div className="name">{series.name}</div>
          <div className="separator" />
          <div className="change" onClick={onOpenModal}>
            변경
          </div>
        </div>
      ) : (
        <button className="box create" onClick={onOpenModal}>
          <PlaylistAddIcon />
          <div className="text">시리즈에 추가하기</div>
        </button>
      )}
    </div>
  );
};

export default WriteSeriesConfigure;
