// @flow
import React, { Component } from 'react';
import UserContent from 'components/user/UserContent';
import UserTagView from 'components/user/UserTagView';
import { withRouter, type Match, type ContextRouter, Route } from 'react-router-dom';
import { ProfileActions } from 'store/actionCreators';
import { type TagCountInfo, type Profile } from 'store/modules/profile';
import { connect } from 'react-redux';
import type { State } from 'store';
import { compose } from 'redux';
import UserPostsSubpage from 'pages/user/UserPostsSubpage';
import UserHistorySubpage from '../../pages/user/UserHistorySubpage';
import UserAboutSubpage from '../../pages/user/UserAboutSubpage';
import UserSeriesSubpage from '../../pages/user/UserSeriesSubpage';

type Props = {
  match: Match,
  tagCounts: ?(TagCountInfo[]),
  shouldCancel: boolean,
  profile: ?Profile,
  side: boolean,
} & ContextRouter;

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
    const { match, tagCounts, side, location } = this.props;
    const username = match.params.username || '';

    const type = match.params.tab || 'posts';
    return (
      <UserContent
        type={type}
        username={username}
        side={
          side && (
            <UserTagView tagCounts={tagCounts} username={username} onSelectTag={this.onSelectTag} />
          )
        }
      >
        <Route exact path="/@:username" component={UserPostsSubpage} />
        <Route path="/@:username/series" component={UserSeriesSubpage} />
        <Route path="/@:username/history" component={UserHistorySubpage} />
        <Route path="/@:username/tags/:tag" component={UserPostsSubpage} />
        <Route path="/@:username/about" component={UserAboutSubpage} />
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
      side: profile.side,
    }),
    () => ({}),
  ),
)(UserContentContainer);
