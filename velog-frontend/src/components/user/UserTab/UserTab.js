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
        {/* <div className="tab-selector">
          <Link exact className="active" to={`/@${username}`}>
            최신 포스트
          </Link>
        </div> */}
        <section className="tab-contents">{children}</section>
      </div>
    );
  }
}

export default UserTab;
