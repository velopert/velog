// @flow
import React from 'react';
import './PostActionButtons.scss';

type Props = {};

const PostActionButtons = (props: Props) => (
  <div className="PostActionButtons">
    <button className="btn">수정</button>
    <button className="btn">삭제</button>
  </div>
);

export default PostActionButtons;
