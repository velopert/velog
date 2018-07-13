// @flow
import React, { Component, type Node } from 'react';
import { Link } from 'react-router-dom';

import './UserTab.scss';

type Props = {
  username: string,
  children: Node,
};

class UserTab extends Component<Props> {
  render() {
    const { username, children } = this.props;
    return (
      <div className="UserTab">
        <div className="tab-selector">
          <Link exact className="active" to={`/@${username}`}>
            최신 포스트
          </Link>
          {/* <NavLink activeClassName="active" to={`/@${username}/popular`}>
            인기 포스트
          </NavLink>
          <NavLink activeClassName="active" to={`/@${username}/collections`}>
            컬렉션
          </NavLink> */}
        </div>
        <section className="tab-contents">{children}</section>
      </div>
    );
  }
}

export default UserTab;
