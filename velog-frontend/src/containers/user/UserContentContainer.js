// @flow
import React, { Component } from 'react';
import UserContent from 'components/user/UserContent';
import UserTagView from 'components/user/UserTagView';
import UserTab from 'components/user/UserTab';
import { withRouter, type Match, Route } from 'react-router-dom';
import { ProfileActions } from 'store/actionCreators';
import { type TagCountInfo, type Profile } from 'store/modules/profile';
import { connect } from 'react-redux';
import type { State } from 'store';
import { compose } from 'redux';
import UserPostsSubpage from 'pages/user/UserPostsSubpage';

type Props = {
  match: Match,
  tagCounts: ?(TagCountInfo[]),
  shouldCancel: boolean,
  profile: ?Profile,
};

class UserContentContainer extends Component<Props> {
  initialize = async () => {
    const { shouldCancel } = this.props;
    if (shouldCancel) return;
    const { username } = this.props.match.params;
    if (!username) return;
    if (username === (this.props.profile && this.props.profile.username)) return;
    ProfileActions.initialize();
    await ProfileActions.getUserTags(username);
    await ProfileActions.getProfile(username);
  };

  componentDidMount() {
    this.initialize();
  }

  onSelectTag = (tagName: string) => {
    ProfileActions.setRawTagName(tagName);
  };

  componentDidUpdate(prevProps) {
    if (this.props.match.params.username !== prevProps.match.params.username) {
      this.initialize();
    }
  }

  render() {
    const { match, tagCounts } = this.props;
    const username = match.params.username || '';

    return (
      <UserContent
        side={
          <UserTagView tagCounts={tagCounts} username={username} onSelectTag={this.onSelectTag} />
        }
      >
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
    ({ profile, common }: State) => ({
      profile: profile.profile,
      tagCounts: profile.tagCounts,
      shouldCancel: common.ssr && !common.router.altered,
    }),
    () => ({}),
  ),
)(UserContentContainer);
