// @flow
import React from 'react';
import type { SeriesPostData } from 'store/modules/series';
import { fromNow } from 'lib/common';
import { Link } from 'react-router-dom';

import './SeriesPostItem.scss';

type Props = {
  post: SeriesPostData,
  username: string,
};
const SeriesPostItem = ({ post, username }: Props) => {
  return (
    <div className="SeriesPostItem">
      <h2>
        <Link to={`/@${username}/${post.url_slug}`}>{post.title}</Link>
      </h2>
      <div className="date">{fromNow(post.released_at)}</div>
      <p>{post.meta.short_description || post.body}</p>
    </div>
  );
};

export default SeriesPostItem;
