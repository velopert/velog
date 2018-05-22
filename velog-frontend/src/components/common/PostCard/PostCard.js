// @flow
import React from 'react';
import ImageIcon from 'react-icons/lib/io/image';
import moment from 'moment';
import 'moment/locale/ko';
import './PostCard.scss';

type Props = {
  thumbnail: ?string,
  username: string,
  title: string,
  body: string,
  date: string,
};

moment.locale('ko');

const PostCard = ({ thumbnail, username, title, body, date }: Props) => {
  const now = new Date();
  const d = new Date(date);
  const m = moment(date);
  const diff = now - d;
  const formattedDate = (() => {
    if (diff < 1000 * 60) return '방금 전';
    if (diff > 1000 * 60 * 60 * 24) {
      return m.format('MMM Do');
    }
    return m.fromNow();
  })();
  return (
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
            <span>{formattedDate}</span>
            <span>8개의 댓글</span>
          </div>
        </div>
        <div className="description">{body}</div>
      </div>
    </div>
  );
};

export default PostCard;
