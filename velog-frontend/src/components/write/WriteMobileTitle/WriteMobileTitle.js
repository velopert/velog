// @flow
import React from 'react';
import './WriteMobileTitle.scss';

type Props = {
  onChange: (e: any) => void,
  title: string,
};

const WriteMobileTitle = ({ title, onChange }: Props) => (
  <div className="WriteMobileTitle">
    <input placeholder="제목을 입력해주세요" value={title} onChange={onChange} />
  </div>
);

export default WriteMobileTitle;
