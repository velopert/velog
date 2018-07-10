// @flow
import React from 'react';
import BackIcon from 'react-icons/lib/io/android-arrow-back';
import { Link } from 'react-router-dom';

import './TagCurrent.scss';

type Props = {
  name: string,
  count: ?number,
};

const TagCurrent = ({ name, count }: Props) => {
  return (
    <div className="TagCurrent">
      <Link className="backwards-btn" to="/tags">
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
