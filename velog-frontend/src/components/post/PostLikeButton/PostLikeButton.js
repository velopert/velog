// @flow
import React from 'react';
import HeartOutlineIcon from 'react-icons/lib/fa/heart-o';
import HeartIcon from 'react-icons/lib/fa/heart';
import './PostLikeButton.scss';

type Props = {};

const PostLikeButton = (props: Props) => (
  <button className="PostLikeButton">
    <HeartOutlineIcon />
    <div className="count">132</div>
  </button>
);

export default PostLikeButton;
