// @flow
import React, { Component } from 'react';
import UserContent from 'components/user/UserContent';
import UserSide from 'components/user/UserSide';
import UserTab from 'components/user/UserTab';
import { withRouter, type Match, Route } from 'react-router-dom';

import UserPosts from './UserPosts';

type Props = {
  match: Match,
};

class UserContentContainer extends Component<Props> {
  render() {
    const { match } = this.props;
    const { username } = match.params;
    return (
      <UserContent side={<UserSide />}>
        <UserTab username={username || ''}>
          <Route
            exact
            path={`/@${username || ''}`}
            render={() => <UserPosts username={username || ''} />}
          />
        </UserTab>
      </UserContent>
    );
  }
}

export default withRouter(UserContentContainer);
