// @flow
import React from 'react';
import ImageIcon from 'react-icons/lib/io/image';
import './PostCard.scss';

type Props = {
  thumbnail: ?string,
  username: string,
  title: string,
  body: string,
};

const PostCard = ({ thumbnail, username, title, body }: Props) => (
  <div className="PostCard">
    <div className="thumbnail-wrapper">
      {thumbnail ? (
        <img src={thumbnail} alt="thumbnail" />
      ) : (
        <div className="image-placeholder">
          <ImageIcon />
        </div>
      )}
    </div>
    <div className="card-content">
      <div className="user-thumbnail-wrapper">
        <img src="https://avatars0.githubusercontent.com/u/17202261?s=460&v=4" alt="thumbnail" />
      </div>
      <div className="content-head">
        <div className="username">{username}</div>
        <h3>{title}</h3>
        <div className="subinfo">
          <span>5월 10일</span>
          <span>8개의 댓글</span>
        </div>
      </div>
      <div className="description">{body}</div>
    </div>
  </div>
);

export default PostCard;
