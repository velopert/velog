// @flow
import React from 'react';
import HeartOutlineIcon from 'react-icons/lib/fa/heart-o';
import HeartIcon from 'react-icons/lib/fa/heart';
import cx from 'classnames';
import Tooltip from 'react-tooltip';
import './PostLikeButton.scss';

type Props = {
  likes: number,
  liked: boolean,
  disabled: boolean,
  onClick: () => void,
};

const PostLikeButton = ({ likes, liked, onClick, disabled }: Props) => (
  <button
    className={cx('PostLikeButton', { liked, disabled })}
    onClick={disabled ? undefined : onClick}
    {...(disabled ? { 'data-tip': '로그인 후 이용해주세요.' } : {})}
  >
    {liked ? <HeartIcon /> : <HeartOutlineIcon />}
    <div className="count">{likes ? likes.toLocaleString() : 0}</div>
    <Tooltip effect="solid" className="tooltip" />
  </button>
);

export default PostLikeButton;
