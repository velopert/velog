// @flow
import React from 'react';
import HeartOutlineIcon from 'react-icons/lib/fa/heart-o';
import HeartIcon from 'react-icons/lib/fa/heart';
import cx from 'classnames';
import './PostLikeButton.scss';

type Props = {
  likes: number,
  liked: boolean,
  onClick: () => void,
};

const PostLikeButton = ({ likes, liked, onClick }: Props) => (
  <button className={cx('PostLikeButton', { liked })} onClick={onClick}>
    {liked ? <HeartIcon /> : <HeartOutlineIcon />}
    <div className="count">{likes ? likes.toLocaleString() : 0}</div>
  </button>
);

export default PostLikeButton;
