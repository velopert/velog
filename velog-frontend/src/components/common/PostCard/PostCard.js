// @flow
import React from 'react';
import ImageIcon from 'react-icons/lib/io/image';
import { fromNow, resizeImage } from 'lib/common';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import defaultThumbnail from 'static/images/default_thumbnail.png';
import { shouldUpdate } from 'recompose';
import LockIcon from 'react-icons/lib/md/lock';

import 'moment/locale/ko';
import './PostCard.scss';

type Props = {
  id: string,
  thumbnail: ?string,
  username: string,
  title: string,
  body: string,
  date: string,
  urlSlug: string,
  userThumbnail: ?string,
  oneColumn?: boolean,
  commentsCount: number,
  hideUsername?: boolean,
  isPrivate: boolean,
};

const PostCard = ({
  thumbnail,
  username,
  title,
  body,
  date,
  urlSlug,
  userThumbnail,
  oneColumn,
  commentsCount,
  hideUsername,
  isPrivate,
}: Props) => {
  const formattedDate = fromNow(date);
  const link = `/@${username}/${urlSlug}`;
  return (
    <div className={cx('PostCard', { 'one-column': oneColumn, empty: !thumbnail })}>
      {thumbnail && (
        <Link to={link} className={cx('thumbnail-wrapper')}>
          {thumbnail && <img src={resizeImage(thumbnail, oneColumn ? 768 : 512)} alt={title} />}
          <div className="white-mask" />
        </Link>
      )}
      <div className="card-content">
        {!oneColumn && (
          <Link className="user-thumbnail-wrapper" to={`/@${username}`}>
            <img src={resizeImage(userThumbnail || defaultThumbnail, 128)} alt={username} />
          </Link>
        )}
        <div className="content-head">
          <div className="between">
            {!hideUsername && (
              <Link to={`/@${username}`} className="username">
                {username}
              </Link>
            )}
            {isPrivate && (
              <div className="private">
                <LockIcon />비공개
              </div>
            )}
          </div>
          <h3>
            <Link to={`/@${username}/${urlSlug}`}>{title}</Link>
          </h3>
          <div className="subinfo">
            <span>{formattedDate}</span>
            <span>{commentsCount}개의 댓글</span>
          </div>
        </div>
        <div className="description" style={{ WebkitBoxOrient: 'vertical' }}>
          {body}
        </div>
      </div>
    </div>
  );
};

PostCard.defaultProps = {
  oneColumn: false,
  hideUsername: false,
};

export default shouldUpdate((props: Props, nextProps: Props) => {
  return props.id !== nextProps.id;
})(PostCard);
