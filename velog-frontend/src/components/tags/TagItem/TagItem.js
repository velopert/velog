// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { escapeForUrl } from 'lib/common';
import './TagItem.scss';

type Props = {
  name: string,
  count: number,
  onClick: (info: any) => any,
};

const TagItem = ({ name, count, onClick }: Props) => (
  <Link
    className="TagItem"
    to={`/tags/${escapeForUrl(name)}`}
    onClick={() => {
      onClick({ name, posts_count: count });
    }}
  >
    <div className="name">{name}</div>
    <div className="counts">{count}</div>
  </Link>
);

export default TagItem;
