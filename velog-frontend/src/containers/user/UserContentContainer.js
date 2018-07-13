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
import UserPostsSubpage from 'pages/user/UserPostsSubpage';

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
    const username = match.params.username || '';

    return (
      <UserContent side={<UserSide tagCounts={tagCounts} username={username} />}>
        <UserTab username={username}>
          <Route exact path="/@:username" component={UserPostsSubpage} />
          <Route path="/@:username/tags/:tag" component={UserPostsSubpage} />
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
