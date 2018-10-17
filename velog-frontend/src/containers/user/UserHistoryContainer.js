// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProfileActions } from 'store/actionCreators';
import UserHistory from 'components/user/UserHistory/UserHistory';
import { withRouter, type ContextRouter } from 'react-router-dom';
import { compose } from 'redux';
import { type State } from 'store';
import { type UserHistoryItem } from 'store/modules/profile';

type Props = {
  userHistory: ?(UserHistoryItem[]),
  prefetched: ?(UserHistoryItem[]),
  prefetching: boolean,
  loading: boolean,
} & ContextRouter;
class UserHistoryContainer extends Component<Props> {
  lastOffset: ?number;
  initialize = async () => {
    const { match } = this.props;
    const { username } = match.params;
    try {
      if (!username) return;
      await ProfileActions.getUserHistory({ username });
    } catch (e) {
      console.log(e);
    }
  };

  prefetch = async () => {
    const { userHistory, prefetched, loading, prefetching, match } = this.props;
    const { username } = match.params;
    if (!username || !userHistory || loading || prefetching) return;
    // REVEAL
    ProfileActions.revealPrefetchedHistory();
    await Promise.resolve();
    try {
      await ProfileActions.prefetchUserHistory({
        username,
        offset: userHistory.length || 0,
      });
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount() {
    ProfileActions.setSideVisibility(false);
    this.initialize();
  }
  componentWillUnmount() {
    ProfileActions.setSideVisibility(true);
  }

  render() {
    const { userHistory, match } = this.props;
    if (!userHistory) return null;
    return <UserHistory data={userHistory} username={match.params.username || ''} />;
  }
}

const enhance = compose(
  withRouter,
  connect(
    ({ profile, pender }: State) => ({
      userHistory: profile.userHistory,
      prefetched: profile.prefetchedHistory,
      loading: pender.pending['profile/GET_USER_HISTORY'],
      prefetching: pender.pending['profile/PREFETCH_USER_HISTORY'],
    }),
    () => ({}),
  ),
);

export default enhance(UserHistoryContainer);
