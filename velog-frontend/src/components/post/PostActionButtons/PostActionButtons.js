// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import './PostActionButtons.scss';

type Props = {
  id: string,
  onAskRemove: () => void,
};

const PostActionButtons = ({ id, onAskRemove }: Props) => (
  <div className="PostActionButtons">
    <Link to={`/write?edit_id=${id}`} className="btn">
      수정
    </Link>
    <button className="btn" onClick={onAskRemove}>
      삭제
    </button>
  </div>
);

export default PostActionButtons;
