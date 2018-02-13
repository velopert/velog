// @flow
import React from 'react';
import BackIcon from 'react-icons/lib/md/arrow-back';
import MoreIcon from 'react-icons/lib/md/more-vert';
import './WriteHeader.scss';

type Props = {
  onChangeTitle(e: any): void,
  onOpenSubmitBox(): void,
  title: string,
};
const WriteHeader = ({
  onChangeTitle,
  onOpenSubmitBox,
  title,
}: Props) => {
  return (
    <div className="WriteHeader">
      <BackIcon className="back-icon" />
      <div className="title-area">
        <input
          placeholder="제목을 입력해주세요"
          autoFocus
          onChange={onChangeTitle}
          value={title}
        />
      </div>
      <div className="actions">
        <div className="button temp-save">
          임시저장
        </div>
        <div className="button submit" onClick={onOpenSubmitBox}>
          작성하기
        </div>
        <div className="more util flex-center">
          <MoreIcon />
        </div>
      </div>
    </div>
  );
};

export default WriteHeader;