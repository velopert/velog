// @flow
import React, { type Node } from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import './UserContent.scss';

type Props = {
  type: string,
  username: string,
  children: Node,
  side: Node,
};

const UserContent = ({ type, children, side, username }: Props) => (
  <div className="UserContent">
    <div className="tabs">
      <Link className={cx({ active: type === 'posts' })} to={`/@${username}`}>
        글
      </Link>
      <Link className={cx({ active: type === 'series' })} to={`/@${username}/series`}>
        시리즈
      </Link>
      <Link className={cx({ active: type === 'history' })} to={`/@${username}/history`}>
        활동
      </Link>
      <Link className={cx({ active: type === 'about' })} to={`/@${username}/about`}>
        소개
      </Link>
    </div>
    <div className="content">
      {side && <div className="side-wrapper">{side}</div>}
      <div className="tab-wrapper">{children}</div>
    </div>
  </div>
);

export default UserContent;
