// @flow
import React from 'react';
import BackIcon from 'react-icons/lib/io/android-arrow-back';
import { Link } from 'react-router-dom';

import './TagCurrent.scss';

type Props = {
  name: string,
  count: ?number,
  lastSort: string,
};

const TagCurrent = ({ name, count, lastSort }: Props) => {
  return (
    <div className="TagCurrent">
      <Link className="backwards-btn" to={`/tags${lastSort === 'popular' ? '' : '?sort=name'}`}>
        <BackIcon />
        전체태그 보기
      </Link>
      <hr />
      <h2>
        #{name}{' '}
        {typeof count === 'number' && (
          <span className="lighten">({count && count.toLocaleString()}개의 포스트)</span>
        )}
      </h2>
    </div>
  );
};

export default TagCurrent;
