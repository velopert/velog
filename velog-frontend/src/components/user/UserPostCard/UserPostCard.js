// @flow
import React from 'react';
import type { PostItem } from 'store/modules/listing';
import Truncate from 'react-truncate';
import { Link } from 'react-router-dom';
import { escapeForUrl } from 'lib/common';
import './UserPostCard.scss';

type Props = {
  post: PostItem,
  username: string,
};

const UserPostCard = ({ post, username }: Props) => {
  const { title, body, thumbnail, meta, tags, created_at, comments_count, url_slug } = post;

  const link = `/@${username}/${url_slug}`;
  return (
    <div className="UserPostCard">
      {thumbnail && (
        <Link to={link} className="img-wrapper">
          <img src={thumbnail} alt={`${title} Thumbnail`} />
        </Link>
      )}
      <h2>
        <Link to={link}>{title}</Link>
      </h2>
      <p>
        <Truncate lines={3} ellipsis={<span>...</span>}>
          {meta.short_description || body}
        </Truncate>
      </p>
      <div className="tags">
        {tags.map(tag => (
          <Link to={`/@${username}/tags/${escapeForUrl(tag)}`} className="tag" key={tag}>
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserPostCard;
