// @flow
import React, { Component } from 'react';
import UserContent from 'components/user/UserContent';
import UserSide from 'components/user/UserSide';
import UserTab from 'components/user/UserTab';
import { withRouter, type Match, Route } from 'react-router-dom';
import { ProfileActions } from 'store/actionCreators';
import { type TagCountInfo } from 'store/modules/profile';
import { connect } from 'react-redux';
import type { State } from 'store';
import { compose } from 'redux';

import UserPosts from './UserPosts';

type Props = {
  match: Match,
  tagCounts: ?(TagCountInfo[]),
};

class UserContentContainer extends Component<Props> {
  initialize = async () => {
    const { username } = this.props.match.params;
    if (!username) return;
    ProfileActions.getUserTags(username);
    ProfileActions.getProfile(username);
  };

  componentDidMount() {
    this.initialize();
  }

  render() {
    const { match, tagCounts } = this.props;
    const { username } = match.params;
    return (
      <UserContent side={<UserSide tagCounts={tagCounts} />}>
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

export default compose(
  withRouter,
  connect(
    ({ profile }: State) => ({
      tagCounts: profile.tagCounts,
    }),
    () => ({}),
  ),
)(UserContentContainer);
