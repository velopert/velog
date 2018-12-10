// @flow
import React from 'react';
import defaultThumbnail from 'static/images/default_thumbnail.png';
import type { PostItem } from 'store/modules/listing';
import { resizeImage, fromNow } from 'lib/common';
import { Link } from 'react-router-dom';
import './SearchResultItem.scss';

type Props = {
  post: PostItem,
};
const SearchResultItem = ({ post }: Props) => {
  const nextLink = `/@${post.user.username}/${post.url_slug}`;

  return (
    <div className="SearchResultItem">
      <Link to={`/@${post.user.username}`} className="userinfo">
        <img src={resizeImage(post.user.thumbnail || defaultThumbnail, 128)} alt="thumbnail" />
        <div className="username">{post.user.username}</div>
      </Link>
      {post.thumbnail && (
        <Link to={nextLink} className="img-wrapper">
          <img alt="img-thumbnail" src={resizeImage(post.thumbnail, 768)} />
        </Link>
      )}
      <Link to={nextLink}>
        <h3>{post.title}</h3>
      </Link>
      <p>{post.body}</p>
      <div className="subinfo">
        <span>{fromNow(post.created_at)}</span>
      </div>
    </div>
  );
};

export default SearchResultItem;
